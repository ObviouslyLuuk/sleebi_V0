/**
 * https://github.com/WebDevSimplified/youtube-video-player-clone/tree/main
 */


const playPauseBtn = document.querySelector(".play-pause-btn")
const theaterBtn = document.querySelector(".theater-btn")
const fullScreenBtn = document.querySelector(".full-screen-btn")
const miniPlayerBtn = document.querySelector(".mini-player-btn")
const muteBtn = document.querySelector(".mute-btn")
const brightnessBtn = document.querySelector(".brightness-btn")
const blueFilterBtn = document.querySelector(".blue-filter-btn")
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
    case "j":
      skip(-5)
      break
    case "arrowright":
    case "l":
      skip(5)
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
  window.dispatchEvent(new Event('brightnesschange'));
})

window.addEventListener("brightnesschange", () => {
  let brightnessLevel
  if (brightnessSlider.value === 0) {
    brightnessLevel = "muted"
  } else if (brightnessSlider.value >= 0.5) {
    brightnessLevel = "high"
  } else {
    brightnessLevel = "low"
  }

  videoContainer.setAttribute("data-brightness-level", brightnessLevel)
})

function toggleBrightness() {
  switch (brightnessSlider.value) {
    case "0":
      brightnessSlider.value = 0.5
      break;
    default:
      brightnessSlider.value = 0
      break;
  }
  video.style.filter = `brightness(${brightnessSlider.value})`
  window.dispatchEvent(new Event('brightnesschange'));
}

// Blue Light Filter
blueFilterBtn.addEventListener("click", toggleBlueFilter)

function toggleBlueFilter() {
  document.body.classList.toggle("blue-filter")
}


// View Modes
// theaterBtn.addEventListener("click", toggleTheaterMode)
fullScreenBtn.addEventListener("click", toggleFullScreenMode)
// miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode)

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater")
}

function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
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
playPauseBtn.addEventListener("click", togglePlay)
video.addEventListener("click", function (e) {
  if (!mobileCheck()) {
    togglePlay()
  } else {
    toggleControls()
  }
})

function togglePlay() {
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
function toggleControls() {
  videoContainer.classList.toggle("controls-active")
  clearTimeout(controlsTimeout)

  // Set timeout if video is playing
  if (!video.paused) {
    controlsTimeout = setTimeout(() => {
      videoContainer.classList.remove("controls-active")
    }, 2000)
  }
}

// When you unpause the video, timeout to hide controls
video.addEventListener("play", () => {
  controlsTimeout = setTimeout(() => {
    videoContainer.classList.remove("controls-active")
  }, 2000)
})
// When pausing the video, clear the timeout
video.addEventListener("pause", () => {
  clearTimeout(controlsTimeout)
})
