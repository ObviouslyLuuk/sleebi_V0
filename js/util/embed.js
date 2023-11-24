
// https://developers.google.com/youtube/iframe_api_reference
// 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');

// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let size = '1';
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
    height: size,
    width: size,
    videoId: 'h1MsqH5dxCU',
    playerVars: {
        'playsinline': 1
    },
    events: {
        'onReady': onPlayerReady,
        // 'onStateChange': onPlayerStateChange
    }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // Seek to beginning
    player.setPlaybackRate(0.25);
    player.mute();
    player.currentTime = 0;
    player.playVideo();
    // player.setLoop(true); // Only works on playlists
    if (size == '1') {
        player.getIframe().style.display = "none";
    }
}

// Important functions:
// player.playVideo();
// player.pauseVideo();
// player.stopVideo();
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