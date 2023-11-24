/**
 * https://github.com/WebDevSimplified/youtube-video-player-clone/tree/main
 */

const videoPlayerContainer = document.querySelector(".vid_player_container")

const playPauseBtns = document.querySelectorAll(".play-pause-btn")
const theaterBtn = document.querySelector(".theater-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const fullScreenIosBtn = document.querySelector(".full-screen-ios-btn")
const miniPlayerBtn = document.querySelector(".mini-player-btn")
const muteBtn = document.querySelector(".mute-btn")
const brightnessBtn = document.querySelector(".brightness-btn")
const blueFilterBtn = document.querySelector(".blue-filter-btn")
const loopBtn = document.querySelector(".loop-btn")
const captionsBtn = document.querySelector(".captions-btn")
const speedBtn = document.querySelector(".speed-btn")
const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")
const previewImg = document.querySelector(".preview-img")
const thumbnailImg = document.querySelector(".thumbnail-img")
const volumeSlider = document.querySelector(".volume-slider")
const brightnessSlider = document.querySelector(".brightness-slider")
const videoContainer = document.querySelector(".video-container")
const timelineContainer = document.querySelector(".timeline-container")
const video = document.querySelector("video")

const skipBackOverlay = document.querySelector(".skip-back")
const skipForwardOverlay = document.querySelector(".skip-forward")

document.addEventListener("keydown", e => {
  const tagName = document.activeElement.tagName.toLowerCase()

  if (tagName === "input") return

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return
    case "k":
      togglePlay()
      break
    case "f":
      toggleFullScreenMode()
      break
    case "t":
      toggleTheaterMode()
      break
    case "i":
      toggleMiniPlayerMode()
      break
    case "m":
      toggleMute()
      break
    case "arrowleft":
      skip(-5)
      break
    case "j":
      skip(-10)
      break
    case "arrowright":
      skip(5)
      break
    case "l":
      skip(10)
      break
    case "c":
      toggleCaptions()
      break
  }
})

// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate)
timelineContainer.addEventListener("mousedown", toggleScrubbing)
document.addEventListener("mouseup", e => {
  if (isScrubbing) toggleScrubbing(e)
})
document.addEventListener("mousemove", e => {
  if (isScrubbing) handleTimelineUpdate(e)
})
// Add touch events for mobile
timelineContainer.addEventListener("touchmove", e => {
  // Construct a simulated mouse event from the touch event.
  e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchmove'}
  handleTimelineUpdate(e);
});
timelineContainer.addEventListener("touchstart", e => {
  e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchstart'}
  toggleScrubbing(e);
});
document.addEventListener("touchend", e => {
  if (isScrubbing) {
    e = {x: e.changedTouches[0].clientX, buttons: 0, preventDefault: ()=>{}, type: 'touchend'}
    toggleScrubbing(e);
  }
});
document.addEventListener("touchmove", e => {
  if (isScrubbing) {
    e = {x: e.touches[0].clientX, buttons: 1, preventDefault: ()=>{}, type: 'touchmove'}
    handleTimelineUpdate(e);
  }
});


let isScrubbing = false
let wasPaused
function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  isScrubbing = (e.buttons & 1) === 1
  videoContainer.classList.toggle("scrubbing", isScrubbing)
  if (isScrubbing) {
    wasPaused = video.paused
    video.pause()
  } else {
    video.currentTime = percent * video.duration
    if (!wasPaused) video.play()
  }

  handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect()
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
  const previewImgNumber = Math.max(
    1,
    Math.floor((percent * video.duration) / 10)
  )
  // const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`
  // previewImg.src = previewImgSrc
  timelineContainer.style.setProperty("--preview-position", percent)

  if (isScrubbing) {
    e.preventDefault()
    // thumbnailImg.src = previewImgSrc
    timelineContainer.style.setProperty("--progress-position", percent)

    // Update video current time (could be intensive on performance?)
    video.currentTime = percent * video.duration
    currentTimeElem.textContent = formatDuration(video.currentTime)
  }
}

// Playback Speed
// speedBtn.addEventListener("click", changePlaybackSpeed)

function changePlaybackSpeed() {
  let newPlaybackRate = video.playbackRate + 0.25
  if (newPlaybackRate > 2) newPlaybackRate = 0.25
  video.playbackRate = newPlaybackRate
  speedBtn.textContent = `${newPlaybackRate}x`
}

// Captions
// const captions = video.textTracks[0]
// captions.mode = "hidden"

// captionsBtn.addEventListener("click", toggleCaptions)

function toggleCaptions() {
  const isHidden = captions.mode === "hidden"
  captions.mode = isHidden ? "showing" : "hidden"
  videoContainer.classList.toggle("captions", isHidden)
}

// Duration
video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime)
  const percent = video.currentTime / video.duration
  timelineContainer.style.setProperty("--progress-position", percent)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})
function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`
  }
}

function skip(duration) {
  video.currentTime += duration

  let skipOverlay = duration < 0 ? skipBackOverlay : skipForwardOverlay

  skipOverlay.querySelector('span').textContent = `${duration < 0 ? "" : "+"}${duration} seconds`
  skipOverlay.classList.remove("active")
  // Force a reflow to restart the animation
  void skipOverlay.offsetWidth
  skipOverlay.classList.add("active")
  setTimeout(() => {
    skipOverlay.classList.remove("active")
  }, 500)
}

// Volume
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
  video.volume = e.target.value
  video.muted = e.target.value === 0
})

function toggleMute() {
  video.muted = !video.muted
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume
  let volumeLevel
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0
    volumeLevel = "muted"
  } else if (video.volume >= 0.5) {
    volumeLevel = "high"
  } else {
    volumeLevel = "low"
  }

  videoContainer.dataset.volumeLevel = volumeLevel
})

// Brightness
brightnessBtn.addEventListener("click", toggleBrightness)
brightnessSlider.addEventListener("input", e => {
  video.style.filter = `brightness(${e.target.value})`
  thumbnailImg.style.filter = `brightness(${e.target.value})`
  window.dispatchEvent(new Event('brightnesschange'));
})

window.addEventListener("brightnesschange", () => {
  let brightnessLevel
  if (brightnessSlider.value < 0.01) {
    brightnessLevel = "muted"
  } else if (brightnessSlider.value >= 0.5) {
    brightnessLevel = "high"
  } else {
    brightnessLevel = "low"
  }

  videoContainer.setAttribute("data-brightness-level", brightnessLevel)
})

let lastBrightness = 0
function toggleBrightness() {
  switch (brightnessSlider.value) {
    case "0":
      brightnessSlider.value = lastBrightness
      break;
    default:
      lastBrightness = brightnessSlider.value
      brightnessSlider.value = 0
      break;
  }
  video.style.filter = `brightness(${brightnessSlider.value})`
  thumbnailImg.style.filter = `brightness(${brightnessSlider.value})`
  window.dispatchEvent(new Event('brightnesschange'));
}

// Blue Light Filter
blueFilterBtn.addEventListener("click", toggleBlueFilter)

function toggleBlueFilter() {
  let bf = document.body.classList.toggle("blue-filter")
  requestAnimationFrame(() => {
    if (create_message_overlay) {
      let message = `Blue light filter ${bf ? 'enabled' : 'disabled'}`
      create_message_overlay(message);
    }
  });
}


// View Modes
// theaterBtn.addEventListener("click", toggleTheaterMode)
fullScreenBtn.addEventListener("click", toggleFullScreenMode)
// miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode)
fullScreenIosBtn.addEventListener("click", toggleIOSViewerMode)

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater")
}

function toggleFullScreenMode() {
  // Check if iOS
  if (iOSCheck()) {
    toggle_fake_fullscreen()
    return
  }

  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
function toggle_fake_fullscreen() {
  videoContainer.classList.toggle("fake-full-screen")
  if (videoContainer.classList.contains("fake-full-screen")) {
    // Disable scrolling
    document.body.style.overflow = "hidden"
  } else {
    // Enable scrolling
    document.body.style.overflow = ""
  }
}

function toggleIOSViewerMode() {
  // Remove properties that prevent the video from playing fullscreen on iOS
  let waspaused = video.paused
  video.pause()
  // video.removeAttribute("playsinline")
  // video.removeAttribute("webkit-playsinline")
  video.webkitEnterFullscreen()
  if (!waspaused) {video.play()}

  // There's no controls to turn this off because iOS takes over
  // So we add the properties back when the video exits fullscreen
  video.addEventListener("webkitendfullscreen", () => {
    // video.setAttribute("playsinline", "")
    // video.setAttribute("webkit-playsinline", "")
  })
}


function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture()
  } else {
    video.requestPictureInPicture()
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle("full-screen", document.fullscreenElement)
})

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player")
})

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player")
})

// Play/Pause
playPauseBtns.forEach(e => {e.addEventListener("click", togglePlay)});
video.parentElement.addEventListener("click", function (e) { // We use parentElement because in fullscreen the video could be smaller than the container
  if (!mobileCheck()) {
    togglePlay()
  } else {
    toggleControls()
  }
})

function togglePlay() {
  window.dispatchEvent(new Event('play_requested'));
  video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused")
})


// Controls on mobile
let controlsTimeout
function toggleControls(force=undefined) {
  clearTimeout(controlsTimeout)
  videoContainer.classList.toggle("controls-active", force)

  // Set timeout if video is playing
  if (!video.paused) {
    controlsTimeout = setTimeout(() => {
      videoContainer.classList.remove("controls-active")
    }, 2000)
  }
}

// When you unpause the video, timeout to hide controls
video.addEventListener("play", () => {
  toggleControls(true)
})
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
]
control_elements.forEach(e=>{e.addEventListener("touchstart", () => {toggleControls(true)})})
control_elements.forEach(e=>{e.addEventListener("touchmove", () => {toggleControls(true)})})
control_elements.forEach(e=>{e.addEventListener("touchend", () => {toggleControls(true)})})

// When pausing the video, clear the timeout
video.addEventListener("pause", () => {
  clearTimeout(controlsTimeout)
})


// Double tap to skip. Tapping on the left side of the video will skip backwards, and tapping on the right side will skip forwards.
// We listen for touchstart events on the video element, and first determine if there's a double tap in quick succession
// To do this, we check if the time between the current tap and the last tap is less than 300ms
let lastTap = 0
video.addEventListener("touchstart", e => {
  const timeSinceLastTap = Date.now() - lastTap
  if (timeSinceLastTap < 300) {
    const rect = video.getBoundingClientRect()
    if (e.touches[0].clientX < rect.width / 2) {
      skip(-5)
    } else {
      skip(5)
    }
  }
  lastTap = Date.now()
})


// Loop button
loopBtn.addEventListener("click", toggleLoop)

function toggleLoop() {
  video.loop = !video.loop
  loopBtn.classList.toggle("active", video.loop)
}



/**
 * Sets the video time to the given time in milliseconds. Scrolls the video into view.
 * Shows the video controls if they are hidden.
 * 
 * @param {number} time - The time in milliseconds.
 * @returns {void}
 */
window.seekTo = function(time) {
  video.currentTime = time / 1000
  video.scrollIntoView()
  toggleControls(true)
}


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
    e.preventDefault()
  }
})
