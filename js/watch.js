

const PLAY_WHEN_CLICKED = true; // If true, video will play when clicked, otherwise, video will play when play button is clicked


// Fetch the HTML content
HTML_TEMPLATES['watch'] = null;
fetch_html('watch');


function loadPlayer() {
    if (!HTML_TEMPLATES['watch']) {
        window.addEventListener('watch_html_ready', loadPlayer);
        return;
    }
    HTML_TEMPLATES['player'] = null;
    fetch_html('player');
}

window.addEventListener('watch_html_ready', loadPlayer);

function placeWatchContent() {
    // Get video_id from URL
    URLSPARAMS = new URLSearchParams(window.location.search);
    VIDEO_ID = URLPARAMS.get('v');
    console.log("video_id:", VIDEO_ID);

    if (!HTML_TEMPLATES['player']) {
        console.log("player html not loaded yet, waiting...");
        window.addEventListener('player_html_ready', placeWatchContent);
        return;
    }
    let watch_overlay = document.querySelector('#watch_overlay');
    if (!watch_overlay) {
        console.log("watch_overlay not created yet, creating...");
        watch_overlay = create_and_append('div', document.body, 'watch_overlay');
        document.querySelector('#watch_overlay').innerHTML = HTML_TEMPLATES['watch'];
        document.querySelector('.vid_player_container').innerHTML = HTML_TEMPLATES['player'];

        // Set video src once play is requested
        if (!PLAY_WHEN_CLICKED) {
            window.addEventListener('play_requested', function() {
                let video = document.querySelector('video');
                if (video.src != "") return;

                let video_info = videos_info[VIDEO_ID]
                video.src = get_download_url(video_info);
            });
        }
    }
    if (!document.querySelector('#player_script')) {
        console.log("player.js not loaded yet, loading...");
        let script = document.createElement('script');
        script.src = 'js/player.js';
        script.id = 'player_script';
        document.body.appendChild(script);

        setTimeout(function() { // Wait for player.js to load (important for exitpip event)
            placeWatchContent();
        }, 50);
        return;
    }

    document.body.classList.add('watch');
    window.dispatchEvent(new Event('exitpip'));

    if (!videos_info) {
        console.log("videos_info not loaded yet, waiting...");
        window.addEventListener('videos_info_loaded', placeWatchContent);
        return;
    }
    let video_info = videos_info[VIDEO_ID];
    console.log("video_info:", video_info);

    // Set thumbnail src
    let video = document.querySelector('video');
    video.style.backgroundImage = `url(${get_thumb_url(video_info)})`;

    // Prepare video src for when play is requested
    document.querySelector('.video-container').classList.remove('src-loaded');
    if (!PLAY_WHEN_CLICKED) {
        video.removeAttribute('src');
        video.load();
        document.querySelector('.video-container').classList.add('paused');
        document.querySelector('.video-container').classList.add('controls-active');
    } else {
        video.src = get_download_url(video_info);
    }
    let elem_to_scroll = mobileCheck() ? video : document.querySelector('#navbar');
    elem_to_scroll.scrollIntoView();


    // video.play() // Cannot play before user interaction

    // If t is in URL, set video.currentTime to t
    let t = URLPARAMS.get('t');
    if (t) {
        console.log("setting time: ", t);
        video.currentTime = t / 1000;
    }
    
    // Set video title
    let video_title = document.querySelector('#vid_title');
    video_title.innerHTML = video_info['title'];
    let pip_video_title = document.querySelector('.pip-player-title');
    pip_video_title.innerHTML = video_info['title'];

    // Set video views
    let video_views = document.querySelector('#vid_viewcount');
    video_views.innerHTML = `${views_add_commas(video_info['views'])} views`

    // Set video description
    let video_description = document.querySelector('#vid_description');
    video_description.innerHTML = get_description(video_info);

    // Set video upload date
    let video_date = document.querySelector('#vid_date');
    video_date.innerHTML = get_date(video_info);

    // Set video channel name
    let video_channel = document.querySelector('#vid_channel_name');
    video_channel.innerHTML = video_info['channel_name'];
    video_channel.addEventListener('click', function() { window.location.href = `?c=${video_info['channel_@name']}`; }); // Don't have channel_@name yet
    let pip_video_channel = document.querySelector('.pip-player-channel-name');
    pip_video_channel.innerHTML = video_info['channel_name'];

    // Set channel icon
    let channel_icon = document.querySelector('#vid_channel_icon');
    channel_icon.src = video_info['channel_icon_url']; // Don't have channel_icon_url yet
    channel_icon.addEventListener('click', function() { window.location.href = `?c=${video_info['channel_@name']}`; }); // Don't have channel_@name yet

    // Set youtube subscribe button
    let yt_sub = document.querySelector('#yt_sub');
    yt_sub.href = `https://www.youtube.com/channel/${video_info['channel_id']}?sub_confirmation=1&feature=subscribe-embed-click`; // Don't have channel_id yet

    // Set video share button
    let share_btn = document.querySelector('#vid_share_btn');
    share_btn.addEventListener('click', add_share_overlay);
    
    // Set download button href
    // https://stackoverflow.com/questions/62046965/save-as-video-but-how-to-do-it-with-javascript-and-html-instead
    // let download_btn = document.getElementById('vid_download_btn');
    // download_btn.href = get_download_url(video_info);
    // download_btn.setAttribute('download', video_info['id'] + '.mp4');

    // Sort recommended videos by relevance using get_search_results() and title as query
    let rec_vids = get_search_results(video_info['title'], Object.values(videos_info));
    let rec_div = document.querySelector('.right-column');
    empty_element(rec_div);

    // Add every video as rec_vid
    for (let vid_info of rec_vids) {
        // If vid_info is the current video, skip
        if (vid_info.id == VIDEO_ID)
            continue;

        add_rec_vid(
            rec_div,
            vid_info,
        );
    }

    // Wait 2 seconds to load embedding functionality
    setTimeout(function() {
        onYouTubeIframeAPIReady();
    }, 2000);
}



function add_share_overlay() {
    let video = document.querySelector('video');
    video.pause();
    let starttime = format_ms_as_time(video.currentTime * 1000);

    let overlay_content = create_overlay(document.body, 'share_overlay', true, null, true)
    overlay_content = create_and_append('div', overlay_content, null, 'share_overlay_content')
    // Include starttime checkbox
    overlay_content.innerHTML = `
    <h5>Share</h5>
    <div id="share_url_container" class="flex-container">
        <input type="text" id="share_url" class="wide_input" value="${window.location.href}">
        <button id="copy_url_btn" class="btn">Copy</button>
    </div>
    <div id="share_option_container">
        <input type="checkbox" id="share_starttime_checkbox">
        <label for="share_starttime_checkbox">Start at:</label>
        <input type="text" id="share_starttime" class="time_input" disabled value="${starttime}">
    </div>
    `
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
        }
        let t
        try {
            t = calc_ms_from_time(share_starttime.value);
        } catch (error) {
            console.log(error);
            return;
        }
        if (t == 0 || !incl_time) {
            textarea.value = val;
            return;
        }
        val += `&t=${calc_ms_from_time(share_starttime.value)}`;
        textarea.value = val;
    }

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
        }
    });

    // Add input event to share_starttime
    let share_starttime = document.querySelector('#share_starttime');
    share_starttime.addEventListener('input', update_url);
}

