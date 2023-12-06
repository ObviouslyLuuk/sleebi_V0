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
const videoWrapper = document.querySelector(".video-wrapper");
const brightnessWrapper = document.querySelector(".video-brightness-wrapper");
const video = document.querySelector("video");

const pipPlayer = document.querySelector(".pip-player-controls");
const pipPlayerStyle = document.querySelector("style#pipplayer");
const pipCloseBtn = document.querySelector(".pip-close-btn");

const skipBackOverlay = document.querySelector(".skip-back");
const skipForwardOverlay = document.querySelector(".skip-forward");

const videoError = document.querySelector(".video-error-div");

document.addEventListener("keydown", e => {
  const tagName = document.activeElement.tagName.toLowerCase();

  if (tagName === "input") return;

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
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
  };
});

// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e);
})
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e);
})
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
  }
});
document.addEventListener("touchmove", e => {
  if (isScrubbing) {
    e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchmove'};
    handleTimelineUpdate(e);
  }
});


let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = (EMBED ? yt_player.getPlayerState() != 1 : video.paused);
    EMBED ? yt_player.pauseVideo() : video.pause();
  } else {
    EMBED ? yt_player.seekTo(percent * yt_player.getDuration()) : video.currentTime = percent * video.duration;
    if (!wasPaused) {
      EMBED ? yt_player.playVideo() : video.play();
    };
  };

  handleTimelineUpdate(e);
};

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect();
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
    if (EMBED) {
      yt_player.seekTo(percent * yt_player.getDuration());
      currentTimeElem.textContent = formatDuration(yt_player.getCurrentTime());
    } else {
      video.currentTime = percent * video.duration;
      currentTimeElem.textContent = formatDuration(video.currentTime);
    };
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
  totalTimeElem.textContent = formatDuration(video.duration);
});
window.addEventListener("yt_player_ready", () => {
  totalTimeElem.textContent = formatDuration(yt_player.getDuration());
});

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime);
  let percent = video.currentTime / video.duration;
  timelineContainer.style.setProperty("--progress-position", percent);
});
// We don't have an event for the embed player, so we just update the time every second
if (EMBED) {
  setInterval(() => {
    currentTimeElem.textContent = formatDuration(yt_player.getCurrentTime());
    let percent = yt_player.getCurrentTime() / yt_player.getDuration();
    timelineContainer.style.setProperty("--progress-position", percent);
  }, 1000);
}

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
  EMBED ? yt_player.seekTo(yt_player.getCurrentTime() + duration) : video.currentTime += duration;

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
  if (EMBED) {
    yt_player.setVolume(e.target.value * 100);
    handleVolumeChange(e.target.value);
  } else {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
  };
});

function toggleMute() {
  if (EMBED) {
    let was_muted = yt_player.isMuted();
    was_muted ? yt_player.unMute() : yt_player.mute();
    handleVolumeChange(!was_muted ? 0 : yt_player.getVolume() / 100); // There's some delay in the volume change, so we base it on the previous isMuted value
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
    console.log("Can't enter fullscreen on iOS in embed mode");
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
  if (mobileCheck() || tabletCheck()) {
    toggleControls();
  } else {
    togglePlay();
  };
});

function togglePlay() {
  window.dispatchEvent(new Event('play_requested'));
  try {
    if (EMBED) {
      yt_player.getPlayerState() != 1 ? yt_player.playVideo() : yt_player.pauseVideo();
    } else {
      video.paused ? video.play() : video.pause();
    };
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


// Controls on mobile
let controlsTimeout;
function toggleControls(force=undefined) {
  clearTimeout(controlsTimeout);
  videoContainer.classList.toggle("controls-active", force);

  // Set timeout if video is playing
  if ((EMBED && yt_player.getPlayerState() == 1) || (!EMBED && !video.paused)) {
    controlsTimeout = setTimeout(() => {
      videoContainer.classList.remove("controls-active");
    }, 2000);
  };
};

// When you unpause the video, timeout to hide controls
video.addEventListener("play", () => {
  toggleControls(true);
});
window.addEventListener("play", () => { // For the embed player
  toggleControls(true);
});
// // Any touch interaction with the controls in videoContainer should reset the timeout
const control_elements = [
  videoContainer.querySelector(".controls"),
  videoContainer.querySelector(".timeline-container"),
  videoContainer.querySelector(".play-pause-btn"),
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

// When pausing the video, clear the timeout
videoWrapper.addEventListener("pause", () => {
  clearTimeout(controlsTimeout);
});


// Double tap to skip. Tapping on the left side of the video will skip backwards, and tapping on the right side will skip forwards.
// We listen for touchstart events on the video element, and first determine if there's a double tap in quick succession
// To do this, we check if the time between the current tap and the last tap is less than 300ms
let lastTap = 0;
videoWrapper.addEventListener("touchstart", e => {
  // If in the center third of video, don't count the tap
  const rect = videoWrapper.getBoundingClientRect();
  if (e.touches[0].clientX > rect.width / 3 && e.touches[0].clientX < rect.width * 2 / 3) {
    return;
  };

  const timeSinceLastTap = Date.now() - lastTap;
  if (timeSinceLastTap < 300) {
    if (e.touches[0].clientX < rect.width / 2) {
      skip(-5);
    } else {
      skip(5);
    };
  };
  lastTap = Date.now();
});


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
    window.dispatchEvent(new Event('enterpip'));
  } else {
    window.dispatchEvent(new Event('exitpip'));
  };
})});
drag_elems[0].addEventListener("click", () => {
  window.dispatchEvent(new Event('exitpip'));
});

function pip_refresh() {
  pipPlayerStyle.innerHTML = '';
  watch_overlay.classList.remove("dragging");
  document.body.style.overflow = "";
  isDragging = false;
};

window.addEventListener("enterpip", () => {
  let content_container = document.querySelector('#content-container');
  if (content_container.dataset.page == "home") {
    window.history.replaceState({page:"home"}, null, '/');
  } else if (content_container.dataset.page == "results") {
    window.history.replaceState({page:"results",query:QUERY}, null, '/?q=' + QUERY);
  };

  document.body.classList.add("pip");
  watch_overlay.style.top = "";
  pip_refresh();
});
window.addEventListener("exitpip", () => {
  window.history.replaceState({page:"watch",video_id:VIDEO_ID}, null, '/?v=' + VIDEO_ID + (EMBED ? '&embed' : ''));
  document.body.classList.remove("pip");
  watch_overlay.style.top = "";
  pip_refresh();
});
pipCloseBtn.addEventListener("click", () => { // Close button on pip player
  EMBED ? yt_player.pauseVideo() : video.pause();
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



// Loop button
loopBtn.addEventListener("click", toggleLoop);

function toggleLoop() {
  if (EMBED) {
    console.log("Can't loop in embed mode");
  } else {
    video.loop = !video.loop;
    loopBtn.classList.toggle("active", video.loop);
  };
};



/**
 * Sets the video time to the given time in milliseconds. Scrolls the video into view.
 * Shows the video controls if they are hidden.
 * 
 * @param {number} time - The time in milliseconds.
 * @returns {void}
 */
window.seekTo = function(time) {
  if (EMBED) {
    yt_player.seekTo(time / 1000);
    videoWrapper.scrollIntoView();
    toggleControls(true);
  } else {
    video.currentTime = time / 1000;
    videoWrapper.scrollIntoView();
    toggleControls(true);
  };
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


// Make space bar not scroll the page
window.addEventListener("keydown", e => {
  if (e.key === " ") {
    e.preventDefault();
  };
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
        <span>or watch a short demo I kept available:</span>
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
