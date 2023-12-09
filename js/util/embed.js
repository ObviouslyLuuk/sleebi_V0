
// https://developers.google.com/youtube/iframe_api_reference
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads. (it's called by the API)
var embedplayer;
function onYouTubeIframeAPIReady() {
    window.dispatchEvent(new Event('yt_iframe_api_ready'));

    // let callback = function() {
    //     embedplayer = place_player('h1MsqH5dxCU', 'embedplayer', 160, 90, {
    //         'mute': 1, // this means the video will be muted
    //         'start': 0, // this means the video will start at 0 seconds
    //         'autoplay': 1, // this means the video will play as soon as it's ready
    //     }, {
    //         'onReady': onPlayerReady,
    //         // 'onStateChange': function(event) {
    //         //     console.log(event);
    //         // },
    //     });
    // };
    // // We wait for player to be ready just so we don't slow down the page
    // if (document.querySelector('.video-container') != null) {
    //     callback();
    // } else {
    //     window.addEventListener('player_html_ready', callback);
    // };
};

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    embedplayer.setPlaybackRate(0.25);
};

function place_player(video_id, elem_id="main-video-element", width=640, height=360, vars={
        'playsinline': 1, // this is needed for iOS
        'autoplay': 1, // this means the video will play as soon as it's ready
        'loop': 1, // this means the video will loop
        // 'mute': 1, // this means the video will be muted
        'controls': 0, // this means the video will not have controls
        'disablekb': 1, // this means the video will not be able to be controlled by keyboard
        'fs': 0, // this means the fullscreen button will not be shown
        'iv_load_policy': 3, // this means the video annotations will not be shown
        'modestbranding': 1, // this means the YouTube logo will not be shown
        'rel': 0, // this means related videos will be from the same channel
        'showinfo': 0, // this means the video title will not be shown (doesn't work)
        // 'start': 0, // this means the video will start at 0 seconds
        // 'end': 0, // this means the video will end at 0 seconds
        'enablejsapi': 1, // this means the player will be able to be controlled by JavaScript
    }, events={}) {
    // Create player
    let player = new YT.Player(elem_id, {
        height: height,
        width: width,
        host: 'https://www.youtube-nocookie.com',
        videoId: video_id,
        playerVars: vars,
        events: events,
    });
    return player;
};

// Important functions:
// player.playVideo();
// player.pauseVideo();
// player.stopVideo(); // This is not the same as pauseVideo because it resets the video
// player.destroy(); // This is not the same as stopVideo because it removes the player
// player.seekTo(seconds, allowSeekAhead);
// player.mute();
// player.unMute();
// player.isMuted();
// player.setVolume(0-100);
// player.getVolume();
// player.getPlaybackRate();
// player.setPlaybackRate(0.25-2);
// player.getAvailablePlaybackRates();
// player.setLoop(true/false);
// player.getIframe();
// player.loadVideoById(videoId:String, startSeconds:Number, suggestedQuality:String):Void
// player.getDuration();

// Important events:
// onReady
// onStateChange
// onPlaybackRateChange
// onPlaybackQualityChange
