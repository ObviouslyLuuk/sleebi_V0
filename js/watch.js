
/**
 * This file fetches the watch html
 * then that fires an event which calls loadPlayer()
 * loadPlayer() fetches the player html (or loads the yt embed js)
 * then that fires an event which calls placeWatchContent()
 * placeWatchContent() waits for the player html / yt iframe api to load and adds an event listener if necessary
 * then it places the watch overlay if necessary
 * then it waits for videos_info to load and adds an event listener if necessary
 * then it places the watch content
 */

const PLAY_WHEN_CLICKED = true; // If true, video will play when clicked, otherwise, video will play when play button is clicked

// Set video src once play is requested
if (!PLAY_WHEN_CLICKED) {
    window.addEventListener('play_requested', function() {
        let video = document.querySelector('video');
        if (video.src != "") return;

        video.src = get_download_url(VIDEO_ID);
    });
};


var PREV_VIDEO_ID;
var PREV_EMBED;
var EMBED;
var yt_player;
const WATCH_LOAD = (document.querySelector('#watch_overlay') && 1);

if (!WATCH_LOAD) {
    // Fetch the HTML content
    HTML_TEMPLATES['watch'] = null;
    fetch_html('watch');
};
if (EMBED) {
    load_embed_script();
};
function load_embed_script() {
    // Load youtube embedding JS
    console.log("loadPlayer: loading yt embedding js...");
    script = document.createElement('script');
    script.src = 'js/util/embed.js';
    script.id = 'embed_script';
    document.body.appendChild(script);
};

window.addEventListener('player_ready', ()=>{
    console.log("player ready");
    prompt_player(VIDEO_ID);
});

function autoplay_video() {
    // Pick random video from videos_info that is not the current video and redirect to it
    let video_ids = Object.keys(videos_info);
    let random_video_id = video_ids[Math.floor(Math.random() * video_ids.length)];
    if (random_video_id == VIDEO_ID) {
        autoplay_video();
        return;
    };
    redirect_watch(random_video_id);
};


function placeWatchContent() {
    // Get video_id from URL
    VIDEO_ID = URLPARAMS.get('v');
    console.log("video_id:", VIDEO_ID);

    EMBED = (URLPARAMS.get('embed')!=null); // If true, video will be embedded in page, otherwise, video will be served from Sleebi

    if (PREV_EMBED == undefined) {
        // If PREV_EMBED is undefined, this is the first time we're loading the watch page
    } else if (PREV_EMBED != EMBED) {
        // If PREV_EMBED is defined and is different from EMBED, we need to reload the player
        console.log("placeWatchContent: switching player...");
        destroyVideo(PREV_EMBED);
        if (!EMBED) {window.dispatchEvent(new Event('player_ready'));}; // Sleebi player is always ready after it's loaded
    } else {
        if (VIDEO_ID == PREV_VIDEO_ID) {
            // If video_id is the same as PREV_VIDEO_ID, we don't need to reload the player at all
            console.log("placeWatchContent: video_id is the same as PREV_VIDEO_ID");
            document.body.classList.add('watch');
            window.dispatchEvent(new Event('exitpip'));
            document.querySelector('.vid_player_container').scrollIntoView();
            play();
            return;
        } else {
            // If PREV_EMBED is defined and is the same as EMBED, 
            // we can just prompt the player and continue placing the watch content
            prompt_player(VIDEO_ID);
        };
    };

    // Load player and rerun
    if (!HTML_TEMPLATES['watch'] && !WATCH_LOAD) {
        console.log("placeWatchContent: watch/player html not loaded yet, waiting...");
        window.addEventListener('watch_html_ready', placeWatchContent, {once: true});
        return;
    };
    // Place watch overlay and continue
    let watch_overlay = document.querySelector('#watch_overlay');
    if (HTML_TEMPLATES['watch'] && !watch_overlay && !WATCH_LOAD) {
        watch_overlay = create_and_append('div', document.body, 'watch_overlay');
        document.querySelector('#watch_overlay').innerHTML = HTML_TEMPLATES['watch'];
        console.log("placeWatchContent: watch_overlay now created");
        if (!EMBED) {window.dispatchEvent(new Event('player_ready'));}; // Sleebi player is always ready after it's loaded
    } else if (watch_overlay && WATCH_LOAD) {
        console.log("placeWatchContent: watch_overlay already exists");
        if (!EMBED) {window.dispatchEvent(new Event('player_ready'));};
    };
    // Load player.js and continue
    if (!document.querySelector('#player_script') && !WATCH_LOAD) {
        console.log("player.js not loaded yet, loading...");
        let script = document.createElement('script');
        script.src = 'js/player.js';
        script.id = 'player_script';
        document.body.appendChild(script);
        // We don't need to wait for player.js, it can be async
    };
    // Load yt_player async
    if (EMBED && !yt_player) {
        load_yt_player();
    };

    document.body.classList.add('watch');
    window.dispatchEvent(new Event('exitpip'));
    document.querySelector('.vid_player_container').scrollIntoView();

    if (!videos_info) {
        console.log("placeWatchContent: videos_info not loaded yet, waiting...");
        window.addEventListener('videos_info_loaded', placeWatchContent);
        return;
    };

    if (Object.keys(videos_info).includes(VIDEO_ID)) {
        let video_info = videos_info[VIDEO_ID];
        console.log("video_info:", video_info);

        // Fill video info
        fill_video_info(video_info);

        add_rec_vids(video_info['title']);
    } else {
        console.log("placeWatchContent: video_id not found in videos_info");
        // Set page title
        document.title = "Sleebi";
        // Set video title
        let video_title = document.querySelector('#vid_title');
        video_title.innerHTML = "This video is not in Sleebi's database";
        // Set video description
        let video_description = document.querySelector('#vid_description');
        video_description.innerHTML = "but you can still watch it here :)\n\nKeep in mind that this video's creator will only be compensated if you see an ad.";
        // Set youtube subscribe button to watch this video on YouTube
        let yt_sub = document.querySelector('#yt_sub');
        yt_sub.href = "https://www.youtube.com/watch?v=" + VIDEO_ID;
        // Set video views
        let video_views = document.querySelector('#vid_viewcount');
        video_views.innerHTML = "";
        // Set video upload date
        let video_date = document.querySelector('#vid_date');
        video_date.innerHTML = "";
        // Set video channel name
        let video_channel = document.querySelector('#vid_channel_name');
        video_channel.innerHTML = "";

        add_rec_vids("");
    }

    // Set video share button
    let share_btn = document.querySelector('#vid_share_btn');
    share_btn.addEventListener('click', add_share_overlay);


    // Add script tag for js/util/embed.js async
    let embed_script = document.querySelector('#embed_script');
    if (!embed_script) {
        console.log("embed.js not loaded yet, loading...");
        let script = document.createElement('script');
        script.src = 'js/util/embed.js';
        script.id = 'embed_script';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    };

    PREV_VIDEO_ID = VIDEO_ID;
};


function fill_video_info(video_info) {
    // Update page title
    document.title = video_info['title'];
    
    // Set video title
    let video_title = document.querySelector('#vid_title');
    video_title.innerHTML = video_info['title'];
    let pip_video_title = document.querySelector('.pip-player-title');
    pip_video_title.innerHTML = video_info['title'];

    // Set video views
    let video_views = document.querySelector('#vid_viewcount');
    video_views.innerHTML = `${views_add_commas(video_info['views'])} views`;

    // Set video description
    let video_description = document.querySelector('#vid_description');
    video_description.innerHTML = get_description(video_info);

    // Set video upload date
    let video_date = document.querySelector('#vid_date');
    video_date.innerHTML = get_date(video_info);

    // Set video channel name
    let video_channel = document.querySelector('#vid_channel_name');
    video_channel.innerHTML = video_info['channel_name'];
    video_channel.addEventListener('click', function() { window.location.href = `?c=${video_info['channel_@name']}`; });
    let pip_video_channel = document.querySelector('.pip-player-channel-name');
    pip_video_channel.innerHTML = video_info['channel_name'];

    // Set channel icon
    // let channel_icon = document.querySelector('#vid_channel_icon');
    // channel_icon.src = video_info['channel_icon_url'];
    // channel_icon.addEventListener('click', function() { window.location.href = `?c=${video_info['channel_@name']}`; });

    // Set youtube subscribe button
    let yt_sub = document.querySelector('#yt_sub');
    yt_sub.href = `https://www.youtube.com/channel/${video_info['channel_id']}?sub_confirmation=1&feature=subscribe-embed-click`;

    // Set download button href
    // https://stackoverflow.com/questions/62046965/save-as-video-but-how-to-do-it-with-javascript-and-html-instead
    // let download_btn = document.getElementById('vid_download_btn');
    // download_btn.href = get_download_url(video_info);
    // download_btn.setAttribute('download', video_info['id'] + '.mp4');
};


function add_rec_vids(query) {
    // Sort recommended videos by relevance using get_search_results() and title as query
    let rec_vids = get_search_results(query, Object.values(videos_info));
    let rec_div = document.querySelector('#related_videos');
    empty_element(rec_div);

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        // If vid_info is the current video, skip
        if (vid_info.id == VIDEO_ID)
            continue;

        add_rec_vid(
            rec_div,
            vid_info,
            "eager",
            320,
        );
    };
};



function prompt_player(video_id) {
    let video_container = document.querySelector('.video-container');
    video_container.classList.add('paused');
    video_container.classList.add('controls-active');

    let t = URLPARAMS.get('t');
    if (!EMBED) {
        // Set thumbnail src
        let video = document.querySelector('video');
        video.style.backgroundImage = `url(${get_thumb_urls(video_id)['maxres']})`;

        // Prepare video src for when play is requested
        video_container.classList.remove('src-loaded');
        if (!PLAY_WHEN_CLICKED) {
            destroyVideo(false);
        } else {
            video.src = get_download_url(video_id);
            video.load();
        };
        // If t is in URL, set video.currentTime to t
        if (t) {
            console.log("setting time: ", t);
            video.currentTime = t / 1000;
        };
        video_container.dataset.mode = 'sleebi';
    } else {
        if (!t) {t = 0;};
        yt_player.loadVideoById(VIDEO_ID, t / 1000);
        video_container.dataset.mode = 'yt';
    }
    PREV_EMBED = EMBED;
};


function load_yt_player() {    
    // Load yt iframe api and rerun
    if (!window.YT || !window.YT.Player) {
        console.log("placeWatchContent: yt iframe api not loaded yet, waiting...");
        window.addEventListener('yt_iframe_api_ready', load_yt_player);
        return;
    };
    // Load yt_player
    yt_player = place_player(VIDEO_ID, 'main-video-element', 640, 360, undefined, {
        'onReady': ()=>{
            console.log("yt_player ready");
            window.dispatchEvent(new Event('yt_player_ready'));
            window.dispatchEvent(new Event('player_ready'));
        },
        'onStateChange': (event)=>{
            // YT.PlayerState.UNSTARTED = -1
            // YT.PlayerState.ENDED = 0
            // YT.PlayerState.PLAYING = 1
            // YT.PlayerState.PAUSED = 2
            // YT.PlayerState.BUFFERING = 3
            if (event.data == 1) {
                window.dispatchEvent(new Event('play'));
            } else if (event.data == 2) {
                window.dispatchEvent(new Event('pause'));
            } else if (event.data == 3) {
                window.dispatchEvent(new Event('buffering'));
            } else if (event.data == 0) {
                window.dispatchEvent(new Event('ended'));
            } else if (event.data == -1) {
                window.dispatchEvent(new Event('loadeddata'));
            };
        }
    });
};



function add_share_overlay() {
    let video = document.querySelector('video');
    video.pause();
    let starttime = format_ms_as_time(video.currentTime * 1000);

    let url = get_video_url(VIDEO_ID, EMBED);

    let overlay_content = create_overlay(document.body, 'share_overlay', true, null, true);
    overlay_content = create_and_append('div', overlay_content, null, 'share_overlay_content');
    // Include starttime checkbox
    overlay_content.innerHTML = `
    <h5>Share</h5>
    <div id="share_url_container" class="flex-container">
        <input type="text" id="share_url" class="wide_input" value="${url}">
        <button id="copy_url_btn" class="btn">Copy</button>
    </div>
    <div id="share_option_container">
        <input type="checkbox" id="share_starttime_checkbox">
        <label for="share_starttime_checkbox">Start at:</label>
        <input type="text" id="share_starttime" class="time_input" disabled value="${starttime}">
    </div>
    `;
    // Add onclick event to copy_url_btn
    let copy_url_btn = document.querySelector('#copy_url_btn');
    copy_url_btn.addEventListener('click', function() {
        navigator.clipboard.writeText(document.querySelector('#share_url').value).then(function() {
            create_message_overlay('Link copied to clipboard');
        });
    });

    function update_url() {
        let incl_time = document.querySelector('#share_starttime_checkbox').checked;
        let textarea = document.querySelector('#share_url');
        let val = textarea.value;
        let index = val.indexOf('&t=');
        if (index != -1) {
            val = val.slice(0, index);
        };
        let t;
        try {
            t = calc_ms_from_time(share_starttime.value);
        } catch (error) {
            console.log(error);
            return;
        };
        if (t == 0 || !incl_time) {
            textarea.value = val;
            return;
        };
        val += `&t=${calc_ms_from_time(share_starttime.value)}`;
        textarea.value = val;
    };

    // Add onclick event to share_starttime_checkbox
    let share_starttime_checkbox = document.querySelector('#share_starttime_checkbox');
    share_starttime_checkbox.addEventListener('click', function() {
        let share_starttime = document.querySelector('#share_starttime');
        if (share_starttime_checkbox.checked) {
            share_starttime.disabled = false;
            update_url();
        } else {
            share_starttime.disabled = true;
            update_url();
        };
    });

    // Add input event to share_starttime
    let share_starttime = document.querySelector('#share_starttime');
    share_starttime.addEventListener('input', update_url);
};

