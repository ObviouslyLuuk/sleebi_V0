/**
 * https://github.com/WebDevSimplified/youtube-video-player-clone/tree/main
 */

const videoPlayerContainer = document.querySelector(".vid_player_container");

const playPauseBtns = document.querySelectorAll(".play-pause-btn");
// const theaterBtn = document.querySelector(".theater-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
// const fullScreenIosBtn = document.querySelector(".full-screen-ios-btn");
// const miniPlayerBtn = document.querySelector(".mini-player-btn");
const muteBtn = document.querySelector(".mute-btn");
const brightnessBtn = document.querySelector(".brightness-btn");
const blueFilterBtn = document.querySelector(".blue-filter-btn");
const loopBtn = document.querySelector(".loop-btn");
// const captionsBtn = document.querySelector(".captions-btn");
// const speedBtn = document.querySelector(".speed-btn");
const currentTimeElem = document.querySelector(".current-time");
const totalTimeElem = document.querySelector(".total-time");
// const previewImg = document.querySelector(".preview-img");
const thumbnailImg = document.querySelector(".thumbnail-img");
const volumeSlider = document.querySelector(".volume-slider");
const brightnessSlider = document.querySelector(".brightness-slider");
const videoContainer = document.querySelector(".video-container");
const timelineContainer = document.querySelector(".timeline-container");
const timeline = document.querySelector(".timeline");
const videoWrapper = document.querySelector(".video-wrapper");
const brightnessWrapper = document.querySelector(".video-brightness-wrapper");
const video = document.querySelector("video");

const pipPlayer = document.querySelector(".pip-player-controls");
const pipPlayerStyle = document.querySelector("style#pipplayer");
const pipCloseBtn = document.querySelector(".pip-close-btn");

const skipBackOverlay = document.querySelector(".skip-back");
const skipForwardOverlay = document.querySelector(".skip-forward");

const volumeOverlay = document.querySelector(".volume-overlay");

const videoError = document.querySelector(".video-error-div");

window.addEventListener("keydown", e => {
  const tagName = document.activeElement.tagName.toLowerCase();

  if (tagName === "input") return;

  switch (e.key.toLowerCase()) {
    case " ":
      e.preventDefault();
      if (tagName === "button") return;
      togglePlay();
      break;
    case "k":
      togglePlay();
      break;
    case "f":
      toggleFullScreenMode();
      break;
    // case "t":
    //   toggleTheaterMode();
    //   break;
    // case "i":
    //   toggleMiniPlayerMode();
    //   break;
    case "m":
      toggleMute();
      break;
    case "arrowleft":
      skip(-5);
      break;
    case "j":
      skip(-10);
      break;
    case "arrowright":
      skip(5);
      break;
    case "l":
      skip(10);
      break;
    // case "c":
    //   toggleCaptions();
    //   break;
    case "arrowup":
      e.preventDefault();
      nudgeVolume(0.1);
      break;
    case "arrowdown":
      e.preventDefault();
      nudgeVolume(-0.1);
      break;
  };
});

// When focused on a slider, disable arrow key navigation on the slider and enable it on the video
const sliders = document.querySelectorAll("input[type='range']");
sliders.forEach(slider => {
  slider.addEventListener("keydown", event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      if (event.key === "ArrowRight") {
        skip(5);
      } else {
        skip(-5);
      };
    };
  });
});


// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e);
});
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e);
});
// Add touch events for mobile
timelineContainer.addEventListener("touchmove", e => {
  // Construct a simulated mouse event from the touch event.
  e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchmove'};
  handleTimelineUpdate(e);
});
timelineContainer.addEventListener("touchstart", e => {
  e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchstart'};
  toggleScrubbing(e);
});
document.addEventListener("touchend", e => {
  if (isScrubbing) {
    e = {x: e.changedTouches[0].clientX, buttons: 0, preventDefault: ()=>{}, type: 'touchend'};
    toggleScrubbing(e);
  };
});
document.addEventListener("touchmove", e => {
  if (isScrubbing) {
    e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchmove'};
    handleTimelineUpdate(e);
  };
});


let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
  // Check if e is MouseEvent
  if ((document.body.dataset.mobile == "true" 
    || document.body.dataset.tablet == "true")
    && (e instanceof MouseEvent)) {return}; // If mobile or tablet, don't allow scrubbing with mouse

  const rect = timeline.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = getPaused();
    pause();
  } else {
    setTime(percent * getDuration());
    if (!wasPaused) {
      play();
    };
  };

  handleTimelineUpdate(e);
};

function handleTimelineUpdate(e) {
  const rect = timeline.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  // const previewImgNumber = Math.max(
  //   1,
  //   Math.floor((percent * video.duration) / 10)
  // );
  // const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
  // previewImg.src = previewImgSrc;
  timelineContainer.style.setProperty("--preview-position", percent);

  if (isScrubbing) {
    e.preventDefault();
    // thumbnailImg.src = previewImgSrc;
    timelineContainer.style.setProperty("--progress-position", percent);

    // Update video current time (could be intensive on performance?)
    setTime(percent * getDuration());
    currentTimeElem.textContent = formatDuration(getTime());
  };
};

// Playback Speed
// speedBtn.addEventListener("click", changePlaybackSpeed)

// function changePlaybackSpeed() {
//   let newPlaybackRate = video.playbackRate + 0.25;
//   if (newPlaybackRate > 2) newPlaybackRate = 0.25;
//   video.playbackRate = newPlaybackRate;
//   speedBtn.textContent = `${newPlaybackRate}x`;
// };

// Captions
// const captions = video.textTracks[0];
// captions.mode = "hidden";

// captionsBtn.addEventListener("click", toggleCaptions);

// function toggleCaptions() {
//   const isHidden = captions.mode === "hidden";
//   captions.mode = isHidden ? "showing" : "hidden";
//   videoContainer.classList.toggle("captions", isHidden);
// };

// Duration
video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(getDuration());
});
window.addEventListener("loadeddata", () => {
  // Set interval to update as soon as getDuration() is available
  let interval = setInterval(() => {
    if (yt_player && yt_player.getDuration && getDuration() > 0) {
      totalTimeElem.textContent = formatDuration(getDuration());
      clearInterval(interval);
    }
  }, 500);
});

video.addEventListener("timeupdate", handleTimeUpdate);
// We don't have an event for the embed player, so we just update the time every second
let ytPlayerTimeUpdateInterval;
window.addEventListener("yt_player_ready", () => {
  ytPlayerTimeUpdateInterval = setInterval(handleTimeUpdate, 1000);
});
function handleTimeUpdate() {
  if (EMBED && (!yt_player || !yt_player.getCurrentTime)) {return;};

  let time = getTime();
  currentTimeElem.textContent = formatDuration(time);
  let percent = time / getDuration();
  timelineContainer.style.setProperty("--progress-position", percent);

  if (EMBED) {loopYtPlayer();};
};

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});
function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  };
};

function skip(duration) {
  setTime(getTime() + duration);

  let skipOverlay = duration < 0 ? skipBackOverlay : skipForwardOverlay;

  skipOverlay.querySelector('span').textContent = `${duration < 0 ? "" : "+"}${duration} seconds`;
  skipOverlay.classList.remove("active");
  // Force a reflow to restart the animation
  void skipOverlay.offsetWidth;
  skipOverlay.classList.add("active");
  setTimeout(() => {
    skipOverlay.classList.remove("active");
  }, 500);
};

// Volume
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", e => {
  setVolume(e.target.value);
  if (EMBED) {
    handleVolumeChange(e.target.value);
  };
});

function toggleMute() {
  if (EMBED) {
    let was_muted = yt_player.isMuted();
    was_muted ? yt_player.unMute() : yt_player.mute();
    handleVolumeChange(!was_muted ? 0 : getVolume()); // There's some delay in the volume change, so we base it on the previous isMuted value
  } else {
    video.muted = !video.muted;
  };
};


video.addEventListener("volumechange", () => {
  handleVolumeChange();
});
function handleVolumeChange(volume=null) {
  if (volume == null) {
    volume = video.muted ? 0 : video.volume;
  };

  volumeSlider.value = volume;
  let volumeLevel;
  if (volume == 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else if (volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  };

  videoContainer.dataset.volumeLevel = volumeLevel;
};

function getVolume() {
  if (EMBED) {
    return yt_player.getVolume() / 100;
  } else {
    return video.volume;
  };
};
function setVolume(volume) {
  if (EMBED) {
    yt_player.setVolume(volume * 100);
    volume === 0 ? yt_player.mute() : yt_player.unMute();
  } else {
    video.volume = volume;
    video.muted = volume === 0;
  };
};
volumeOverlayTimeout = null;
function nudgeVolume(amount) {
  let newVolume = getVolume() + amount;
  if (newVolume > 1) newVolume = 1;
  if (newVolume < 0) newVolume = 0;
  setVolume(newVolume);
  handleVolumeChange(newVolume);

  // Handle volume change overlay
  volumeOverlay.querySelector('span').textContent = `${(newVolume*100).toFixed(0)}%`;
  volumeOverlay.classList.add("active");
  clearTimeout(volumeOverlayTimeout);
  volumeOverlayTimeout = setTimeout(() => {
    volumeOverlay.classList.remove("active");
  }, 1000);
};

// Brightness
function setBrightnessStyle(brightness) {
  let str = `brightness(${brightness})`;
  if (!brightness) str = '';
  brightnessWrapper.style.filter = str;
  thumbnailImg.style.filter = str;
}

brightnessBtn.addEventListener("click", toggleBrightness);
brightnessSlider.addEventListener("input", e => {
  setBrightnessStyle(e.target.value);
  window.dispatchEvent(new Event('brightnesschange'));
});

window.addEventListener("brightnesschange", () => {
  let brightnessLevel;
  if (brightnessSlider.value < 0.01) {
    brightnessLevel = "muted";
  } else if (brightnessSlider.value >= 0.5) {
    brightnessLevel = "high";
  } else {
    brightnessLevel = "low";
  };

  videoContainer.setAttribute("data-brightness-level", brightnessLevel);
});

let lastBrightness = 0;
function toggleBrightness() {
  switch (brightnessSlider.value) {
    case "0":
      brightnessSlider.value = lastBrightness;
      break;
    default:
      lastBrightness = brightnessSlider.value;
      brightnessSlider.value = 0;
      break;
  };
  setBrightnessStyle(brightnessSlider.value);
  if (brightnessSlider.value == 1) {
    setBrightnessStyle(null);
  };
  window.dispatchEvent(new Event('brightnesschange'));
};

// Blue Light Filter
blueFilterBtn.addEventListener("click", toggleBlueFilter);

function toggleBlueFilter() {
  let bf = document.body.classList.toggle("blue-filter");
  requestAnimationFrame(() => {
    if (create_message_overlay) {
      let message = `Blue light filter ${bf ? 'enabled' : 'disabled'}`;
      create_message_overlay(message);
    };
  });
};


// View Modes
// theaterBtn.addEventListener("click", toggleTheaterMode);
fullScreenBtn.addEventListener("click", toggleFullScreenMode);
// miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);
// fullScreenIosBtn.addEventListener("click", toggleIOSViewerMode);

// function toggleTheaterMode() {
//   videoContainer.classList.toggle("theater");
// };

function toggleFullScreenMode() {
  // Check if iOS
  if (iOSCheck()) {
    toggleIOSViewerMode();
    return;
  };

  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  };
};

function toggleIOSViewerMode() {
  if (EMBED) {
    create_message_overlay("Can't enter fullscreen on iOS in embed mode\nTry holding your phone sideways :)", document.body, 5000);
    return;
  }
  let waspaused = video.paused;
  video.pause();
  video.webkitEnterFullscreen();
  if (!waspaused) {video.play()};
};


// function toggleMiniPlayerMode() {
//   if (videoContainer.classList.contains("mini-player")) {
//     document.exitPictureInPicture();
//   } else {
//     video.requestPictureInPicture();
//   };
// };

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("full-screen", document.fullscreenElement);
});

// video.addEventListener("enterpictureinpicture", () => {
//   videoContainer.classList.add("mini-player");
// });

// video.addEventListener("leavepictureinpicture", () => {
//   videoContainer.classList.remove("mini-player");
// });

// Play/Pause
playPauseBtns.forEach(e => {e.addEventListener("click", togglePlay)});
videoWrapper.addEventListener("click", function (e) { // We use parentElement because in fullscreen the video could be smaller than the container
  if (document.body.dataset.mobile == "true" || document.body.dataset.tablet == "true") {
    return; // This is handled by the touchstart event
  } else {
    togglePlay();
  };
});

function togglePlay() {
  window.dispatchEvent(new Event('play_requested'));
  try {
    getPaused() ? play() : pause();
  } catch (error) { // Doesn't work for some reason
    console.log("Error:", error);
  };
};

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});
window.addEventListener("play", () => { // For the embed player
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
window.addEventListener("pause", () => { // For the embed player
  videoContainer.classList.add("paused");
});


///////////////////////////////////////////////////////////////////////////////
// BASIC CONTROLS FOR BOTH EMBED AND SLEEBI PLAYER
///////////////////////////////////////////////////////////////////////////////
function play() {
  EMBED ? yt_player.playVideo() : video.play();
};
function pause() {
  EMBED ? yt_player.pauseVideo() : video.pause();
};
function stopVideo() {
  EMBED ? yt_player.stopVideo() : video.pause();
};
function destroyVideo(embed=false) {
  PREV_VIDEO_ID = null;
  PREV_EMBED = null;
  if (embed && yt_player) {
    clearInterval(ytPlayerTimeUpdateInterval);
    yt_player.destroy();
    yt_player = null;
  } else {
    video.src = "";
    video.load();
  };
};
function getPaused() {
  if (EMBED) {
    if (!yt_player || !yt_player.getPlayerState) {return true};
    return yt_player.getPlayerState() != 1;
  } else {
    return video.paused;
  };
};
function setTime(time) {
  EMBED ? yt_player.seekTo(time) : video.currentTime = time;
};
function getTime() {
  return EMBED ? yt_player.getCurrentTime() : video.currentTime;
};
function getDuration() {
  return EMBED ? yt_player.getDuration()-2.1 : video.duration;
};
var LOOPING = false;
function setLoop(loop) {
  LOOPING = loop;
  video.loop = loop;
};
function getLoop() {
  return EMBED ? LOOPING : video.loop;
};
// We want to stop the yt_player slightly before the end, so we can loop it
function loopYtPlayer() {
  if (getDuration() <= 0 || !getDuration()) {return;};
  if (getDuration() - getTime() >= 0) {return;};
  if (LOOPING) {
    yt_player.seekTo(0);
    console.log("Looping");
  } else {
    yt_player.pauseVideo();
    setTime(getDuration());
    console.log("Pausing before end");
    video.dispatchEvent(new Event('ended'))
  };
};

var AUTOPLAY = false;
document.querySelector("#autoplay_switch").addEventListener("change", e => {
  AUTOPLAY = e.target.checked;
  create_message_overlay(`Autoplay ${AUTOPLAY ? 'enabled' : 'disabled'}`);
});
video.addEventListener("ended", () => {
  if (getLoop()) {return;};
  if (AUTOPLAY) {
    autoplay_video();
  };
});



// Controls on desktop
// Set controls active on mousemove over video container
let controlsTimeout;
let mouseOverControls = false;
videoContainer.querySelector(".video-controls-container").addEventListener("mouseenter", () => {
  mouseOverControls = true;
});
videoContainer.querySelector(".video-controls-container").addEventListener("mouseleave", () => {
  if (document.body.dataset.mobile == "true" || document.body.dataset.tablet == "true") {return;};
  videoContainer.classList.remove("controls-active");
  mouseOverControls = false;
});
videoContainer.addEventListener("mousemove", () => {
  videoContainer.style.cursor = "unset";
  if (document.body.dataset.mobile == "true" || document.body.dataset.tablet == "true") {return;};

  videoContainer.classList.add("controls-active");
  clearTimeout(controlsTimeout);

  // If in fullscreen, hide controls after timeout
  if (document.fullscreenElement && !mouseOverControls) {
    controlsTimeout = setTimeout(() => {
      videoContainer.classList.remove("controls-active");
      videoContainer.style.cursor = "none";
    }, 2000);
  };
});
// If mouse leaves video container, hide controls
videoContainer.addEventListener("mouseleave", () => {
  videoContainer.classList.remove("controls-active");
});
// If mouse hits edge of screen, hide controls
window.addEventListener("mousemove", e => {
  if (document.fullscreenElement) {
    if (e.clientX < 2 || e.clientX > window.innerWidth - 2 || e.clientY < 2 || e.clientY > window.innerHeight - 2) {
      videoContainer.classList.remove("controls-active");
      videoContainer.style.cursor = "none";
    };
  };
});


// Controls on mobile
let controlsEnableDelay;
function toggleControls(force=undefined, delay=0, timeout=2000, force_timeout=false) {
  clearTimeout(controlsTimeout);
  clearTimeout(controlsEnableDelay);
  let controls_become_active = !videoContainer.classList.contains("controls-active") || force;
  controlsEnableDelay = setTimeout(() => {
    videoContainer.classList.toggle("controls-active", force);
  }, delay);

  // Set timeout if video is playing
  if (timeout && (!getPaused() || force_timeout) && controls_become_active) {
    controlsTimeout = setTimeout(() => {
      videoContainer.classList.remove("controls-active");
    }, timeout+delay);
  };
};

// When you unpause the video, timeout to hide controls
playPauseBtns.forEach(e => {e.querySelector('.play-icon').addEventListener("click", () => {toggleControls(true, 0, 2000, true)})});
// When pausing the video, clear the timeout
playPauseBtns.forEach(e => {e.querySelector('.pause-icon').addEventListener("click", () => {toggleControls(true, 0, false)})});
// // Any touch interaction with the controls themselves in videoContainer should reset the timeout
const control_elements = [
  videoContainer.querySelector(".controls"),
  videoContainer.querySelector(".timeline-container"),
  // videoContainer.querySelector(".play-pause-btn"),
  videoContainer.querySelector(".volume-slider"),
  videoContainer.querySelector(".brightness-slider"),
  // videoContainer.querySelector(".playback-rate-slider"),
  // videoContainer.querySelector(".captions-btn"),
  videoContainer.querySelector(".full-screen-btn"),
  // videoContainer.querySelector(".mini-player-btn"),
  // videoContainer.querySelector(".theater-btn"),
  videoContainer.querySelector(".mute-btn"),
  videoContainer.querySelector(".blue-filter-btn"),
  videoContainer.querySelector(".loop-btn"),
  // videoContainer.querySelector(".speed-btn"),
  videoContainer.querySelector(".current-time"),
  videoContainer.querySelector(".total-time"),
];
control_elements.forEach(e=>{e.addEventListener("touchstart", () => {toggleControls(true)})});
control_elements.forEach(e=>{e.addEventListener("touchmove", () => {toggleControls(true)})});
control_elements.forEach(e=>{e.addEventListener("touchend", () => {toggleControls(true)})});



// Double tap to skip. Tapping on the left side of the video will skip backwards, and tapping on the right side will skip forwards.
// We listen for touchstart events on the video element, and first determine if there's a double tap in quick succession
// To do this, we check if the time between the current tap and the last tap is less than 300ms
let lastTap = 0;
const TAP_DELAY = 300;
videoWrapper.addEventListener("touchstart", e => {
  // If in the center third of video, don't count the tap
  const rect = videoWrapper.getBoundingClientRect();
  if (e.touches[0].clientX > rect.width / 3 && e.touches[0].clientX < rect.width * 2 / 3) {
    toggleControls();
    return;
  };

  toggleControls(undefined, TAP_DELAY);

  const timeSinceLastTap = Date.now() - lastTap;
  if (timeSinceLastTap < TAP_DELAY) {
    clearTimeout(controlsTimeout); // Cancel hiding controls
    clearTimeout(controlsEnableDelay); // Cancel toggling controls
    if (e.touches[0].clientX < rect.width / 2) {
      skip(-5);
    } else {
      skip(5);
    };
  };
  lastTap = Date.now();
});


// Picture in Picture

// Detect dragging on the video element
// As user is dragging down, we translate #watch_overlay the same amount.
// If the user lets go further than half the viewport height down, we enable picture in picture mode
// Otherwise, we reset the translation
var startY = 0;
var isDragging = false;
let drag_elems = [pipPlayer.querySelector('.pip-player-info'),videoWrapper];
drag_elems.forEach(e=>{e.addEventListener("touchstart", e => {
  startY = e.touches[0].clientY;
  watch_overlay.classList.add("dragging");
  document.body.style.overflow = "hidden";
})});
drag_elems.forEach(e=>{e.addEventListener("touchmove", e => {
  let deltaY = e.touches[0].clientY - startY;

  if (isDragging && !document.body.classList.contains("pip")) {
    let translation = Math.min(Math.max(0, deltaY), window.innerHeight);
    watch_overlay.style.top = `${translation}px`;
  } else if (isDragging && document.body.classList.contains("pip")) {
    let translation = Math.max(Math.min(Math.min(0, deltaY), window.innerHeight), -window.innerHeight);
    watch_overlay.style.top = `${window.innerHeight + translation}px`;

    pipPlayerStyle.innerHTML = `
      .video-wrapper {
        bottom: ${-translation}px!important;
        opacity: ${1 - Math.min(Math.abs(translation) / (window.innerHeight/2), 1)};
      }
      .pip-player-controls {
        bottom: ${-translation}px;
        opacity: ${1 - Math.min(Math.abs(translation) / (window.innerHeight/2), 1)};
      }
    `;
  } else {
    isDragging = true;
  };
})});
drag_elems.forEach(e=>{e.addEventListener("touchend", e => {
  watch_overlay.classList.remove("dragging");
  if (!isDragging) return;

  let deltaY = e.changedTouches[0].clientY - startY;

  if (deltaY > videoContainer.clientHeight / 3) {
    let no_pip_change = document.body.classList.contains("pip");
    window.dispatchEvent(new Event('enterpip'));
    if (no_pip_change) {return;};
    push_state_behind_watchpage();
  } else {
    let no_pip_change = !document.body.classList.contains("pip");
    window.dispatchEvent(new Event('exitpip'));
    if (no_pip_change) {return;};
    window.history.pushState({page:"watch",video_id:VIDEO_ID, embed:EMBED}, null, get_video_url(VIDEO_ID, EMBED, undefined, relative=true));
    console.log("Pushed state with " + VIDEO_ID);
  };
})});
drag_elems[0].addEventListener("click", () => {
  window.dispatchEvent(new Event('exitpip'));
  window.history.pushState({page:"watch",video_id:VIDEO_ID, embed:EMBED}, null, get_video_url(VIDEO_ID, EMBED, undefined, relative=true));
  console.log("Pushed state with " + VIDEO_ID);
});

function pip_refresh() {
  pipPlayerStyle.innerHTML = '';
  watch_overlay.classList.remove("dragging");
  document.body.style.overflow = "";
  isDragging = false;
};

window.addEventListener("enterpip", () => {
  document.body.classList.add("pip");
  watch_overlay.style.top = "";
  pip_refresh();
});
window.addEventListener("exitpip", () => {
  document.body.classList.remove("pip");
  watch_overlay.style.top = "";
  pip_refresh();
});
pipCloseBtn.addEventListener("click", () => { // Close button on pip player
  stopVideo();
  document.body.classList.remove("pip");
  document.body.classList.remove("watch");
  document.body.style.overflow = "";
  pipPlayerStyle.innerHTML = `
    .video-wrapper {
      bottom: ${-100}px!important;
    }
    .pip-player-controls {
      bottom: ${-100}px;
    }
  `;
});

function push_state_behind_watchpage() {
  let content_container = document.querySelector('#content-container');
  if (content_container.dataset.page == "home") {
    window.history.pushState({page:"home"}, null, '/');
    console.log("Pushed state with /");
  } else if (content_container.dataset.page == "results") {
    window.history.pushState({page:"results",query:QUERY}, null, '/?q=' + QUERY);
    console.log("Pushed state with /?q=" + QUERY);
  };
};



// Loop button
loopBtn.addEventListener("click", toggleLoop);

function toggleLoop() {
  setLoop(!getLoop());
  loopBtn.classList.toggle("active", getLoop());
};



/**
 * Sets the video time to the given time in milliseconds. Scrolls the video into view.
 * Shows the video controls if they are hidden.
 * 
 * @param {number} time - The time in milliseconds.
 * @returns {void}
 */
window.seekTo = function(time) {
  setTime(time / 1000);
  videoWrapper.scrollIntoView();
  toggleControls(true);
};


// Add class when the video starts loading
video.addEventListener('loadstart', () => {
  videoContainer.classList.add('src-loading');
});

// Add class when the video has loaded
video.addEventListener('loadeddata', () => {
  videoContainer.classList.remove('src-loading');
  videoContainer.classList.add('src-loaded');
});
window.addEventListener("yt_player_ready", () => {
  videoContainer.classList.remove('src-loading');
  videoContainer.classList.add('src-loaded');
});


// When a button is clicked, start whitePulse animation by adding .clicked class, then remove it after animation is done
const buttons = document.querySelectorAll(".clickable_icon");
buttons.forEach(button => {
    button.addEventListener("click", () => {
        button.classList.add("clicked");
    });
    button.addEventListener("animationend", () => {
        button.classList.remove("clicked");
    });
});


// Video error handling using the .video-error-div, adjusting its innerHTML and adding .active
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/MediaError
video.addEventListener("error", () => {
  if (EMBED) {return;};
  console.log("Video error:", video.error);
  if (video.error.message != undefined && video.error.message.includes("Empty src attribute")) {return;};

  destroyVideo(embed=false);
  redirect_watch(VIDEO_ID, embed=true, replace=true); // Redirect to embed player
  create_message_overlay("switching to embed player");
  return;

  videoContainer.classList.remove('src-loading');
  videoContainer.classList.remove('src-loaded');
  switch (video.error.code) {
    case 1: // MEDIA_ERR_ABORTED
      videoError.innerHTML = "Aborted";
      break;
    case 2: // MEDIA_ERR_NETWORK
      videoError.innerHTML = "Network error";
      break;
    case 3: // MEDIA_ERR_DECODE
      videoError.innerHTML = "Decode error";
      break;
    case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
      // videoError.innerHTML = "Source not supported"
      // Give button to ?v=demo480x852
      videoError.innerHTML = `
        <span>Due to immense data transfer costs I had to pause the website because it was very quickly draining my bank account.
        I'll try to find solutions to further limit the cost! Stay up to date at:</span>
        <a href="https://www.youtube.com/@ObviouslyASMR/community" class="btn rounded" target="_blank">My YouTube Community</a>

        <span>embed this video from YouTube (but it stops before the postroll ad):</span>
        <a class="btn rounded" onclick="redirect_watch('${VIDEO_ID}',true)">Watch Embedded</a>

        <span>or watch a short demo I kept available on the Sleebi servers:</span>
        <a class="btn rounded" onclick="redirect_watch('demo480x852')">Demo</a>
      `;
      break;
    default:
      videoError.innerHTML = "Unknown error";
      break;
  }
  videoError.classList.add("active");
});
// With every pushstate event (when navigating to a new page), remove .active from videoError
window.addEventListener("pushstate", () => {
  videoError.classList.remove("active");
});

window.dispatchEvent(new Event('player_js_ready'));
if (!EMBED) {video.load();};
