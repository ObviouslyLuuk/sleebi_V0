

// Fetch the HTML content
var html_ready = false;
fetch_html('watch', "#content-container", "html_ready");

// Get video_id from URL
const VIDEO_ID = URLPARAMS.get('v');
console.log(VIDEO_ID);

function placePlayer() {
    html_ready = false;
    fetch_html('player', "#video-container", "player_ready");
}

window.addEventListener('html_ready', placePlayer);

function placeContent() {
    if (!html_ready || !videos_info)
        return
    let video = document.querySelector('video');
    if (document.querySelector('video').src != "")
        return

    let video_info = videos_info[VIDEO_ID];
    console.log(video_info);

    // Set video src
    video.src = video_info['download_url'];

    // Set download button href
    // https://stackoverflow.com/questions/62046965/save-as-video-but-how-to-do-it-with-javascript-and-html-instead
    // let download_btn = document.getElementById('vid_download_btn');
    // download_btn.href = video_info['download_url'];
    // download_btn.setAttribute('download', video_info['id'] + '.mp4');

    // video.play() // Cannot play before user interaction

    // Add js/player.js to the body
    let script = document.createElement('script');
    script.src = 'js/player.js';
    document.body.appendChild(script);
    
    // Set video title
    let video_title = document.querySelector('#vid_title');
    video_title.innerHTML = video_info['title'];

    // Set video views
    let video_views = document.querySelector('#vid_viewcount');
    video_views.innerHTML = `${views_add_commas(video_info['views'])} views`

    // Set channel icon
    let channel_icon = document.querySelector('#vid_channel_icon');
    // channel_icon.src = video_info['channel_icon_url']; // Don't have channel_icon_url yet
    channel_icon.src = "https://yt3.googleusercontent.com/G0in2VstE1qVGi8-NRHXHCGxWs4wjEJA55vXPBdVmpNzeV2hBn9j2uwgj19UB8zz8Wmvtmp50w=s176-c-k-c0x00ffffff-no-rj"
    // channel_icon.addEventListener('click', function() { window.location.href = `?c=${video_info['channel_@name']}`; }); // Don't have channel_@name yet

    // Set video channel name
    let video_channel = document.querySelector('#vid_channel_name');
    video_channel.innerHTML = video_info['channel_name'];
    // video_channel.addEventListener('click', function() { window.location.href = `?c=${video_info['channel_@name']}`; }); // Don't have channel_@name yet

    // Set youtube subscribe button
    let yt_sub_div = document.querySelector('#yt_sub_div');
    // yt_sub_div.dataset.channelid = video_info['channel_id']; // Don't have channel_id yet
    yt_sub_div.dataset.channelid = "UChXogayC52mlROq-N71_f5g"

    // Add script for YouTube Subscribe widget at https://apis.google.com/js/platform.js to the body
    script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    document.body.appendChild(script);

    // Set video description
    let video_description = document.querySelector('#vid_description');
    // video_description.innerHTML = video_info['description'];

    // Add every video as rec_vid
    for (let vid_info of Object.values(videos_info)) {
        add_rec_vid(
            document.querySelector('.right-column'),
            vid_info,
        );
    }
}

// Call placeContent() after player_ready and videos_info_loaded events
window.addEventListener('player_ready', placeContent);
window.addEventListener('videos_info_loaded', placeContent);

// Add css/watch.css to the head
let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'css/watch.css';
document.head.appendChild(link);

// Add css/player.css to the head
link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'css/player.css';
document.head.appendChild(link);



function add_rec_vid(parent, info) {
    let rec_vid = create_and_append('div', parent, null, 'rec_vid vid_tile')
    
    // Add onclick event to rec_vid to change video
    rec_vid.addEventListener('click', function() {
        window.location.href = `?v=${info.id}`;
    });

    // Thumbnail
    let rec_thumb_div_container = create_and_append('div', rec_vid, null, 'rec_thumb_div_container')
    let rec_thumb_div = create_and_append('div', rec_thumb_div_container, null, 'rec_thumb_div')
    let rec_thumb_img = create_and_append('img', rec_thumb_div, null, 'rec_thumb_img')
    rec_thumb_img.src = info.thumb_url
    let rec_duration = create_and_append('div', rec_thumb_div, null, 'rec_duration')
    rec_duration.innerText = info.duration

    // Metadata
    let rec_metadata = create_and_append('div', rec_vid, null, 'rec_metadata')
    let rec_title = create_and_append('h3', rec_metadata, null, 'rec_title')
    rec_title.innerText = info.title
    let rec_channel = create_and_append('div', rec_metadata, null, 'rec_channel')
    rec_channel.innerText = info.channel_name
    let rec_views_date = create_and_append('div', rec_metadata, null, 'rec_views-date')
    let rec_views = create_and_append('span', rec_views_date, null, 'rec_views')
    rec_views.innerText = views_abbr(info.views) + ' views'
    let rec_date = create_and_append('span', rec_views_date, null, 'rec_date date-span')
    rec_date.innerText = info.date

    return rec_vid
}
  
