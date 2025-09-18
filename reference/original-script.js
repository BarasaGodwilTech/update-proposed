// YouTube API Configuration
const YT_API_KEY = "AIzaSyBnhvlEoMzX9A_DIq5Lks74m_S5CBL9jXU"
const PLAYLIST_ID = "PL3UeMmSqW6uaESNSPkwr-RMrZJNiOUmYV"

// Global variables
let player
const isMuted = true
let currentVideoId = ""
let playlistVideos = []
let hasAutoplayed = false

// Enhanced initialization with loading
document.addEventListener("DOMContentLoaded", () => {
  initPageLoader()
  initScrollAnimations()
  initCountdown()
  initFormToggle()
  initYouTubeAPI()
  fetchPlaylistVideos()
  initFloatingButtons()
  initStatCounters()
  initParallaxEffects()
})

// Page Loader
function initPageLoader() {
  const loader = document.getElementById("pageLoader")
  const progress = document.querySelector(".loading-progress")

  let loadProgress = 0
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15
    progress.style.width = Math.min(loadProgress, 100) + "%"

    if (loadProgress >= 100) {
      clearInterval(loadInterval)
      setTimeout(() => {
        loader.classList.add("hidden")
        document.body.style.overflow = "auto"
        initScrollRevealAnimations()
      }, 500)
    }
  }, 100)

  // Ensure loader hides even if slow connection
  setTimeout(() => {
    clearInterval(loadInterval)
    progress.style.width = "100%"
    setTimeout(() => {
      loader.classList.add("hidden")
      document.body.style.overflow = "auto"
      initScrollRevealAnimations()
    }, 500)
  }, 3000)
}

// Floating Action Buttons
function initFloatingButtons() {
  const scrollToTopBtn = document.getElementById("scrollToTop")

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.style.opacity = "1"
      scrollToTopBtn.style.transform = "translateY(0)"
    } else {
      scrollToTopBtn.style.opacity = "0"
      scrollToTopBtn.style.transform = "translateY(20px)"
    }
  })

  // Scroll to top functionality
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Animated Statistics Counters
function initStatCounters() {
  const statItems = document.querySelectorAll(".stat-item")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
          animateCounter(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.5 },
  )

  statItems.forEach((item) => observer.observe(item))
}

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.count)
  const counter = element.querySelector(".stat-number")
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      counter.textContent = target + (target === 99 ? "%" : "+")
      clearInterval(timer)
    } else {
      counter.textContent = Math.floor(current) + (target === 99 ? "%" : "+")
    }
  }, 16)
}

// Enhanced Countdown with Progress Ring
function initCountdown() {
  const launchDate = new Date("2026-07-29T00:00:00").getTime()
  const totalDuration = launchDate - new Date("2025-01-01T00:00:00").getTime()
  const progressCircle = document.querySelector(".progress-ring-circle")
  const progressDays = document.getElementById("progressDays")
  const circumference = 2 * Math.PI * 54

  progressCircle.style.strokeDasharray = circumference
  progressCircle.style.strokeDashoffset = circumference

  function updateCountdown() {
    const now = new Date().getTime()
    const distance = launchDate - now

    if (distance < 0) {
      document.querySelector(".countdown").innerHTML = "<h2>🚀 We're Live!</h2>"
      return
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    // Update countdown display
    document.getElementById("days").textContent = days.toString().padStart(2, "0")
    document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")

    // Update progress ring
    const elapsed = totalDuration - distance
    const progress = elapsed / totalDuration
    const offset = circumference - progress * circumference

    progressCircle.style.strokeDashoffset = offset
    if (progressDays) {
      progressDays.textContent = days
    }
  }

  updateCountdown()
  setInterval(updateCountdown, 1000)
}

// Form Toggle Functionality
function initFormToggle() {
  const showFormBtn = document.getElementById("show-form-btn")
  const hideFormBtn = document.getElementById("hide-form-btn")
  const formContainer = document.getElementById("google-form-container")

  showFormBtn.addEventListener("click", function () {
    formContainer.style.display = "block"
    this.style.display = "none"
    formContainer.scrollIntoView({ behavior: "smooth" })
  })

  hideFormBtn.addEventListener("click", () => {
    formContainer.style.display = "none"
    showFormBtn.style.display = "inline-block"
  })
}

// YouTube API Initialization
function initYouTubeAPI() {
  // Load YouTube API
  const tag = document.createElement("script")
  tag.src = "https://www.youtube.com/iframe_api"
  const firstScriptTag = document.getElementsByTagName("script")[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}

// YouTube API Ready Callback
window.onYouTubeIframeAPIReady = () => {
  player = new window.YT.Player("mainVideoPlayer", {
    events: {
      onStateChange: onPlayerStateChange,
      onReady: onPlayerReady,
    },
  })
}

function onPlayerReady(event) {
  setupScrollAutoplay()
  setupVolumeControl()
  const videoData = event.target.getVideoData()
  if (videoData.video_id) {
    updateActionButtons(videoData.video_id)
  }
}

function onPlayerStateChange(event) {
  if (event.data === window.YT.PlayerState.PLAYING) {
    const videoData = event.target.getVideoData()
    if (videoData.video_id && videoData.video_id !== currentVideoId) {
      updateActionButtons(videoData.video_id)
    }
  }
}

// Scroll Reveal Animations
function initScrollRevealAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".feature-card, .timer-item, .video-item").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })
}

// Parallax Effects
function initParallaxEffects() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".hero")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })
  })
}

// Enhanced Auto-play with Intersection Observer
function setupScrollAutoplay() {
  const videoSection = document.querySelector(".youtube-section")
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAutoplayed) {
          if (entry.intersectionRatio >= 0.3) {
            setTimeout(() => {
              if (player && player.playVideo) {
                player.playVideo()
                hasAutoplayed = true
                observer.unobserve(videoSection)

                // Show notification
                showNotification("🎥 Video started playing!", "success")
              }
            }, 500)
          }
        }
      })
    },
    { threshold: [0.3, 0.5, 0.7] },
  )

  observer.observe(videoSection)
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
    <span>${message}</span>
  `

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "var(--accent)" : "var(--primary)"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transform: translateX(100%);
    transition: var(--transition);
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Enhanced Volume Control
function setupVolumeControl() {
  const volumeToggle = document.getElementById("volumeToggle")
  const volumeSlider = document.getElementById("volumeSlider")
  const volumeIndicator = document.querySelector(".volume-indicator")
  const volumeIcon = volumeToggle.querySelector("i")

  let currentVolume = 0
  let previousVolume = 50

  // Initialize
  updateVolumeDisplay(currentVolume)

  volumeToggle.addEventListener("click", () => {
    if (currentVolume === 0) {
      // Unmute
      currentVolume = previousVolume
      player.setVolume(currentVolume)
      player.unMute()
    } else {
      // Mute
      previousVolume = currentVolume
      currentVolume = 0
      player.setVolume(0)
      player.mute()
    }

    volumeSlider.value = currentVolume
    updateVolumeDisplay(currentVolume)
  })

  volumeSlider.addEventListener("input", (e) => {
    currentVolume = Number.parseInt(e.target.value)
    player.setVolume(currentVolume)

    if (currentVolume === 0) {
      player.mute()
    } else {
      player.unMute()
      previousVolume = currentVolume
    }

    updateVolumeDisplay(currentVolume)
  })

  function updateVolumeDisplay(volume) {
    volumeIndicator.style.width = volume + "%"
    volumeToggle.classList.toggle("muted", volume === 0)

    // Update icon based on volume level
    volumeIcon.className =
      volume === 0
        ? "fas fa-volume-mute"
        : volume < 30
          ? "fas fa-volume-down"
          : volume < 70
            ? "fas fa-volume-up"
            : "fas fa-volume-up"
  }
}

// Update action buttons for current video
function updateActionButtons(videoId) {
  currentVideoId = videoId
  const likeBtn = document.getElementById("likeBtn")
  const commentBtn = document.getElementById("commentBtn")

  likeBtn.href = `https://www.youtube.com/watch?v=${videoId}&like=1`
  commentBtn.href = `https://www.youtube.com/watch?v=${videoId}#comments`

  updateRecommendedVideos()
}

// Update recommended videos (excluding current one)
function updateRecommendedVideos() {
  const otherVideos = playlistVideos.filter((video) => video.id !== currentVideoId)
  renderVideoGrid(otherVideos)
}

// Fetch playlist videos from YouTube API
async function fetchPlaylistVideos() {
  try {
    let nextPageToken = ""
    let allVideos = []

    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YT_API_KEY}&pageToken=${nextPageToken}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch videos")
      }

      const data = await response.json()

      allVideos = allVideos.concat(
        data.items.map((item) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        })),
      )

      nextPageToken = data.nextPageToken || ""
    } while (nextPageToken)

    playlistVideos = allVideos
    if (playlistVideos.length > 0) {
      updateActionButtons(playlistVideos[0].id)
    }
  } catch (error) {
    console.error("Error fetching playlist videos:", error)
    const videoGrid = document.getElementById("videoGrid")
    videoGrid.innerHTML = '<div class="video-placeholder">Failed to load videos. Please try again later.</div>'
  }
}

// Render video grid
function renderVideoGrid(videos) {
  const videoGrid = document.getElementById("videoGrid")

  if (videos.length === 0) {
    videoGrid.innerHTML = '<div class="video-placeholder">No additional videos available.</div>'
    return
  }

  videoGrid.innerHTML = ""
  videos.forEach((video) => {
    const videoItem = document.createElement("div")
    videoItem.className = "video-item"
    videoItem.innerHTML = `
            <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
                    <div class="play-icon"><i class="fas fa-play"></i></div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${escapeHtml(video.title)}</h3>
                </div>
            </a>
        `
    videoGrid.appendChild(videoItem)
  })
}

// Utility function to escape HTML
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Scroll Animations
function initScrollAnimations() {
  // Initialize scroll animations
  console.log("Scroll animations initialized")
}
