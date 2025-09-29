
// YouTube API Configuration
const YT_API_KEY = "AIzaSyBnhvlEoMzX9A_DIq5Lks74m_S5CBL9jXU"
const PLAYLIST_ID = "PL3UeMmSqW6uaESNSPkwr-RMrZJNiOUmYV"
const YT = window.YT // Declare the YT variable

// Global variables
let player
const isMuted = true
let currentVideoId = ""
let playlistVideos = []
let hasAutoplayed = false

document.addEventListener("DOMContentLoaded", () => {
  try {
    initPageLoader()
    initScrollAnimations()
    initCountdown()
    initFormToggle()
    initYouTubeAPI()
    fetchPlaylistVideos()
    initFloatingButtons()
    initStatCounters()
    initParallaxEffects()
    initProductFilters()
    initTestimonialSlider()
    initContactForm()
    initQuickView()
    initMobileMenu()
    initDropdownNavigation()
  } catch (error) {
    console.error("Initialization error:", error)
  }
})

function initDropdownNavigation() {
  const dropdowns = document.querySelectorAll(".dropdown")

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle")
    const menu = dropdown.querySelector(".dropdown-menu")

    if (!toggle || !menu) return

    // Handle hover for desktop
    dropdown.addEventListener("mouseenter", () => {
      menu.style.opacity = "1"
      menu.style.visibility = "visible"
      menu.style.transform = "translateY(0)"
    })

    dropdown.addEventListener("mouseleave", () => {
      menu.style.opacity = "0"
      menu.style.visibility = "hidden"
      menu.style.transform = "translateY(-10px)"
    })

    // Handle click for mobile
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault()
        const isOpen = menu.style.opacity === "1"

        // Close all other dropdowns
        dropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            const otherMenu = otherDropdown.querySelector(".dropdown-menu")
            if (otherMenu) {
              otherMenu.style.opacity = "0"
              otherMenu.style.visibility = "hidden"
              otherMenu.style.transform = "translateY(-10px)"
            }
          }
        })

        // Toggle current dropdown
        if (isOpen) {
          menu.style.opacity = "0"
          menu.style.visibility = "hidden"
          menu.style.transform = "translateY(-10px)"
        } else {
          menu.style.opacity = "1"
          menu.style.visibility = "visible"
          menu.style.transform = "translateY(0)"
        }
      }
    })

    // Handle dropdown menu item clicks
    const menuItems = menu.querySelectorAll("a")
    menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        // Handle product category filtering
        if (item.hasAttribute("data-category")) {
          e.preventDefault()
          const category = item.getAttribute("data-category")
          const categoryBtn = document.querySelector(`[data-category="${category}"]`)
          if (categoryBtn && categoryBtn.classList.contains("category-btn")) {
            categoryBtn.click()
          }
          // Scroll to products section
          const productsSection = document.getElementById("products")
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth" })
          }
        }

        // Close dropdown after click
        menu.style.opacity = "0"
        menu.style.visibility = "hidden"
        menu.style.transform = "translateY(-10px)"
      })
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach((dropdown) => {
        const menu = dropdown.querySelector(".dropdown-menu")
        if (menu) {
          menu.style.opacity = "0"
          menu.style.visibility = "hidden"
          menu.style.transform = "translateY(-10px)"
        }
      })
    }
  })
}

function initPageLoader() {
  const loader = document.getElementById("pageLoader")
  const progress = document.querySelector(".loading-progress")
  const percentage = document.querySelector(".loading-percentage")

  if (!loader || !progress || !percentage) return

  let loadProgress = 0
  const loadInterval = setInterval(() => {
    loadProgress += Math.random() * 15
    const currentProgress = Math.min(loadProgress, 100)
    progress.style.width = currentProgress + "%"
    percentage.textContent = Math.floor(currentProgress) + "%"

    if (loadProgress >= 100) {
      clearInterval(loadInterval)
      setTimeout(() => {
        loader.classList.add("hidden")
        document.body.style.overflow = "auto"
        initScrollRevealAnimations()
      }, 500)
    }
  }, 100)

  // Fallback timeout
  setTimeout(() => {
    clearInterval(loadInterval)
    progress.style.width = "100%"
    percentage.textContent = "100%"
    setTimeout(() => {
      loader.classList.add("hidden")
      document.body.style.overflow = "auto"
      initScrollRevealAnimations()
    }, 500)
  }, 3000)
}

function initFloatingButtons() {
  const fabToggle = document.querySelector(".fab-toggle")
  const fabMenu = document.querySelector(".fab-menu")
  const scrollToTopBtn = document.querySelector(".scroll-top")

  if (!fabToggle || !fabMenu) return

  // Toggle FAB menu
  fabToggle.addEventListener("click", () => {
    const isActive = fabMenu.classList.toggle("active")
    fabToggle.setAttribute("aria-expanded", isActive)
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!fabMenu.contains(e.target)) {
      fabMenu.classList.remove("active")
      fabToggle.setAttribute("aria-expanded", "false")
    }
  })

  // Show/hide based on scroll
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      fabMenu.style.opacity = "1"
      fabMenu.style.transform = "translateY(0)"
    } else {
      fabMenu.style.opacity = "0"
      fabMenu.style.transform = "translateY(20px)"
    }
  })

  // Scroll to top functionality
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
      fabMenu.classList.remove("active")
      fabToggle.setAttribute("aria-expanded", "false")
    })
  }
}

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

function initCountdown() {
    const launchDate = new Date('2026-07-29T20:00:00').getTime();
    const progressCircle = document.querySelector('.progress-ring-circle');
    const progressDays = document.getElementById('progressDays');
    const celebration = document.getElementById('celebration');
    const countdownContainer = document.querySelector('.countdown-container');
    const countdownCta = document.querySelector('.countdown-cta');
    
    if (!progressCircle) return;

    // Calculate circumference based on current size
    function getCircumference() {
        const radius = 135; // Based on SVG viewBox
        return 2 * Math.PI * radius;
    }

    let circumference = getCircumference();
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    // Update circumference on resize
    window.addEventListener('resize', () => {
        circumference = getCircumference();
        progressCircle.style.strokeDasharray = circumference;
    });

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        if (distance < 0) {
            showCelebration();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        updateTimerDisplay({ days, hours, minutes, seconds });
        updateProgressRing(distance, days);
        
        if (days <= 7) {
            addUrgencyEffects(days);
        }
    }

    function updateTimerDisplay(time) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };

        // Smooth number updates with animation
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].textContent = time[key].toString().padStart(2, '0');
                
                // Add flip animation
                elements[key].classList.add('changing');
                setTimeout(() => {
                    elements[key].classList.remove('changing');
                }, 300);
            }
        });
    }

    function updateProgressRing(distance, days) {
        const totalDuration = launchDate - new Date('2025-01-01T00:00:00').getTime();
        const elapsed = totalDuration - distance;
        const progress = Math.min(elapsed / totalDuration, 1);
        const offset = circumference - progress * circumference;

        progressCircle.style.strokeDashoffset = offset;
        
        if (progressDays) {
            progressDays.textContent = days;
            progressDays.style.transform = 'scale(1.1)';
            setTimeout(() => {
                progressDays.style.transform = 'scale(1)';
            }, 200);
        }
    }

    function showCelebration() {
        if (countdownContainer) countdownContainer.style.display = 'none';
        if (countdownCta) countdownCta.style.display = 'none';
        if (celebration) celebration.style.display = 'block';
        
        document.title = "🎉 We're Live! - Will's Tech Store";
    }

    // Initialize
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        clearInterval(countdownInterval);
    });
}

// Form Toggle Functionality
function initFormToggle() {
    const showFormBtn = document.getElementById('show-form-btn');
    const hideFormBtn = document.getElementById('hide-form-btn');
    const formContainer = document.getElementById('google-form-container');
    const successMessage = document.getElementById('notify-success');

    if (!showFormBtn || !hideFormBtn || !formContainer) return;

    // Show form function
    function showForm() {
        formContainer.style.display = 'block';
        showFormBtn.style.display = 'none';
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add animation class
        formContainer.style.animation = 'slideDown 0.5s ease-out';
        
        // Track form view (analytics)
        console.log('Launch notification form opened');
    }

    // Hide form function
    function hideForm() {
        formContainer.style.display = 'none';
        showFormBtn.style.display = 'inline-flex';
    }

    // Show success message
    function showSuccessMessage() {
        if (successMessage) {
            successMessage.style.display = 'block';
            formContainer.style.display = 'none';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Close success message
    function closeSuccessMessage() {
        if (successMessage) {
            successMessage.style.display = 'none';
            showFormBtn.style.display = 'inline-flex';
        }
    }

    // Event listeners
    showFormBtn.addEventListener('click', showForm);
    hideFormBtn.addEventListener('click', hideForm);

    // Listen for form submission (Google Forms redirect)
    window.addEventListener('message', function(event) {
        if (event.data === 'formSubmitted') {
            showSuccessMessage();
        }
    });

    // Alternative signup methods
    const alternativeButtons = document.querySelectorAll('.alternative-btn');
    alternativeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.includes('whatsapp') ? 'WhatsApp' : 'Email';
            console.log(`Alternative signup chosen: ${platform}`);
            
            // Open the link
            window.open(this.href, '_blank');
            
            // Show success message after a delay
            setTimeout(showSuccessMessage, 1000);
        });
    });

    // Close form when clicking outside
    document.addEventListener('click', function(e) {
        if (formContainer.style.display === 'block' && 
            !formContainer.contains(e.target) && 
            e.target !== showFormBtn) {
            hideForm();
        }
    });

    // Close form with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && formContainer.style.display === 'block') {
            hideForm();
        }
    });

    // Form submission detection for Google Forms
    const formFrame = formContainer.querySelector('iframe');
    if (formFrame) {
        formFrame.onload = function() {
            // Check if we're on the thank you page
            try {
                if (this.contentWindow.location.href.includes('formResponse')) {
                    showSuccessMessage();
                }
            } catch (e) {
                // Cross-origin restriction, use alternative method
                console.log('Form might be submitted');
            }
        };
    }

    // Make success message function global
    window.closeSuccessMessage = closeSuccessMessage;
}

// Add this function to track form interactions
function trackFormInteraction(action) {
    // Here you can integrate with Google Analytics or other analytics tools
    console.log(`Form interaction: ${action}`);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'Launch Notification',
            'event_label': 'Notify Section'
        });
    }
}

// YouTube API Initialization
function initYouTubeAPI() {
  const tag = document.createElement("script")
  tag.src = "https://www.youtube.com/iframe_api"
  const firstScriptTag = document.getElementsByTagName("script")[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}

// YouTube API Ready Callback
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("mainVideoPlayer", {
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
  if (event.data === YT.PlayerState.PLAYING) {
    const videoData = event.target.getVideoData()
    if (videoData.video_id && videoData.video_id !== currentVideoId) {
      updateActionButtons(videoData.video_id)
    }
  }
}

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
  let ticking = false

  function updateParallax() {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".hero")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })

    ticking = false
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax)
      ticking = true
    }
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

function initProductFilters() {
  const categoryBtns = document.querySelectorAll(".category-btn")
  const productCards = document.querySelectorAll(".product-card")

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category

      // Update active button and ARIA states
      categoryBtns.forEach((b) => {
        b.classList.remove("active")
        b.setAttribute("aria-selected", "false")
      })
      btn.classList.add("active")
      btn.setAttribute("aria-selected", "true")

      // Filter products with animation
      productCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

function initTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  const track = document.querySelector('.testimonials-track');
  let currentSlide = 0;
  let autoSlideInterval;

  if (testimonials.length === 0) return;

  function showSlide(index) {
      // Remove active class from all slides and dots
      testimonials.forEach((testimonial, i) => {
          testimonial.classList.remove('active');
          testimonial.setAttribute('aria-hidden', 'true');
      });
      
      dots.forEach((dot, i) => {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
      });

      // Add active class to current slide and dot
      testimonials[index].classList.add('active');
      testimonials[index].setAttribute('aria-hidden', 'false');
      dots[index].classList.add('active');
      dots[index].setAttribute('aria-selected', 'true');

      // Update track position for smooth sliding
      if (track) {
          track.style.transform = `translateX(-${index * 100}%)`;
      }

      currentSlide = index;
      
      // Update button states
      updateButtonStates();
  }

  function nextSlide() {
      const nextIndex = (currentSlide + 1) % testimonials.length;
      showSlide(nextIndex);
  }

  function prevSlide() {
      const prevIndex = (currentSlide - 1 + testimonials.length) % testimonials.length;
      showSlide(prevIndex);
  }

  function updateButtonStates() {
      if (prevBtn) {
          prevBtn.disabled = currentSlide === 0;
      }
      if (nextBtn) {
          nextBtn.disabled = currentSlide === testimonials.length - 1;
      }
  }

  // Event listeners
  if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
  }
  
  if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
  }

  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          showSlide(index);
          resetAutoSlide();
      });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
          prevSlide();
          resetAutoSlide();
      } else if (e.key === 'ArrowRight') {
          nextSlide();
          resetAutoSlide();
      }
  });

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  if (track) {
      track.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
      });

      track.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
      });
  }

  function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
              nextSlide();
          } else {
              prevSlide();
          }
          resetAutoSlide();
      }
  }

  // Auto-advance testimonials
  function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
  }

  function stopAutoSlide() {
      clearInterval(autoSlideInterval);
  }

  // Pause auto-slide when hovering over testimonials
  const testimonialContainer = document.querySelector('.testimonials-slider');
  if (testimonialContainer) {
      testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
      testimonialContainer.addEventListener('mouseleave', startAutoSlide);
      testimonialContainer.addEventListener('focusin', stopAutoSlide);
      testimonialContainer.addEventListener('focusout', startAutoSlide);
  }

  // Initialize
  showSlide(currentSlide);
  startAutoSlide();

  // Cleanup on page unload
  window.addEventListener('beforeunload', stopAutoSlide);
}

function initContactForm() {
  const form = document.getElementById("contactForm")

  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const data = Object.fromEntries(formData)

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      showNotification("Please fill in all required fields.", "error")
      return
    }

    // Create WhatsApp message
    const message = `Hi Will's Tech! 

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Subject: ${data.subject}

Message: ${data.message}`

    const whatsappUrl = `https://wa.me/256751924844?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    // Show success message
    showNotification("Message prepared! Opening WhatsApp...", "success")

    // Reset form
    form.reset()
  })
}

function initQuickView() {
  const quickViewBtns = document.querySelectorAll(".quick-view-btn")
  const modal = document.getElementById("quickViewModal")
  const closeBtn = document.querySelector(".modal-close")

  if (!modal) return

  const productData = {
    "iPhone 15 Pro": {
      image: "public/iphone-15-pro.png",
      title: "iPhone 15 Pro",
      description:
        "The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system. Experience the future of mobile technology with this premium device.",
      price: "UGX 4,500,000",
      originalPrice: "UGX 5,000,000",
      rating: "(128 reviews)",
      stars: 5,
    },
    "MacBook Pro M3": {
      image: "public/macbook-pro-m3-laptop.jpg",
      title: "MacBook Pro M3",
      description:
        "Supercharged by the M3 chip, this MacBook Pro delivers exceptional performance for professionals and creators. Perfect for demanding workflows.",
      price: "UGX 8,500,000",
      originalPrice: "",
      rating: "(89 reviews)",
      stars: 5,
    },
    "PlayStation 5": {
      image: "public/playstation-5-gaming-console.jpg",
      title: "PlayStation 5",
      description:
        "Experience next-generation gaming with the PlayStation 5. Featuring ultra-high speed SSD, haptic feedback, and stunning 4K graphics.",
      price: "UGX 2,800,000",
      originalPrice: "",
      rating: "(156 reviews)",
      stars: 4.5,
    },
    "AirPods Pro": {
      image: "public/airpods-pro-wireless-earbuds.jpg",
      title: "AirPods Pro",
      description:
        "Premium wireless earbuds with active noise cancellation, spatial audio, and all-day battery life. Perfect for music lovers.",
      price: "UGX 950,000",
      originalPrice: "",
      rating: "(203 reviews)",
      stars: 5,
    },
  }

  quickViewBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      const productCard = btn.closest(".product-card")
      const productTitle = productCard.querySelector("h3").textContent
      const product = productData[productTitle]

      if (product) {
        // Update modal content
        const elements = {
          image: document.getElementById("modalProductImage"),
          title: document.getElementById("modalProductTitle"),
          description: document.getElementById("modalProductDescription"),
          price: document.getElementById("modalProductPrice"),
          originalPrice: document.getElementById("modalProductOriginalPrice"),
          rating: document.getElementById("modalProductRating"),
          stars: document.getElementById("modalProductStars"),
        }

        if (elements.image) elements.image.src = product.image
        if (elements.title) elements.title.textContent = product.title
        if (elements.description) elements.description.textContent = product.description
        if (elements.price) elements.price.textContent = product.price
        if (elements.originalPrice) elements.originalPrice.textContent = product.originalPrice
        if (elements.rating) elements.rating.textContent = product.rating

        // Generate stars
        if (elements.stars) {
          elements.stars.innerHTML = ""
          for (let i = 0; i < 5; i++) {
            const star = document.createElement("i")
            if (i < Math.floor(product.stars)) {
              star.className = "fas fa-star"
            } else if (i < product.stars) {
              star.className = "fas fa-star-half-alt"
            } else {
              star.className = "far fa-star"
            }
            elements.stars.appendChild(star)
          }
        }

        modal.classList.add("active")
        modal.setAttribute("aria-hidden", "false")
        document.body.style.overflow = "hidden"
      }
    })
  })

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal)
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  function closeModal() {
    modal.classList.remove("active")
    modal.setAttribute("aria-hidden", "true")
    document.body.style.overflow = "auto"
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal()
    }
  })
}

function initMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const nav = document.querySelector(".main-nav");
    const overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";
    document.body.appendChild(overlay);

    if (!toggle || !nav) return;

    // Toggle mobile menu
    toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isActive = !nav.classList.contains("active");
        
        nav.classList.toggle("active");
        toggle.classList.toggle("active");
        overlay.classList.toggle("active");
        toggle.setAttribute("aria-expanded", isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? "hidden" : "";
    });

    // Close menu when clicking overlay
    overlay.addEventListener("click", closeMobileMenu);

    // Close menu when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (nav.classList.contains("active") && 
            !nav.contains(e.target) && 
            !toggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && nav.classList.contains("active")) {
            closeMobileMenu();
        }
    });

    // Enhanced dropdown functionality for mobile
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector(".dropdown-toggle");
        
        if (toggleBtn) {
            toggleBtn.addEventListener("click", (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove("active");
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle("active");
                }
            });
        }
    });

    function closeMobileMenu() {
        nav.classList.remove("active");
        toggle.classList.remove("active");
        overlay.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        
        // Close all dropdowns
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove("active");
        });
    }

    // Update on window resize
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && nav.classList.contains("active")) {
            closeMobileMenu();
        }
    });
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}" aria-hidden="true"></i>
    <span>${message}</span>
  `

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "var(--accent)" : type === "error" ? "#ef4444" : "var(--primary)"};
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
    max-width: 300px;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
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
  console.log("Scroll animations initialized")
}

// Wishlist functionality
document.addEventListener("click", (e) => {
  if (e.target.closest(".add-to-wishlist")) {
    e.preventDefault()
    const btn = e.target.closest(".add-to-wishlist")
    const icon = btn.querySelector("i")

    if (icon.classList.contains("far")) {
      icon.classList.remove("far")
      icon.classList.add("fas")
      btn.style.background = "var(--accent)"
      btn.style.color = "var(--light)"
      showNotification("Added to wishlist!", "success")
    } else {
      icon.classList.remove("fas")
      icon.classList.add("far")
      btn.style.background = "var(--light)"
      btn.style.color = "var(--text)"
      showNotification("Removed from wishlist", "info")
    }
  }
})


// Enhanced contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formGroups = document.querySelectorAll('.form-group');

    if (!form) return;

    // Add floating label functionality
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');

        if (input && label) {
            // Check if input has value on load
            if (input.value) {
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.background = 'var(--light)';
            }

            input.addEventListener('focus', () => {
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.background = 'var(--light)';
                label.style.color = 'var(--contact-primary)';
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.background = 'transparent';
                    label.style.color = 'var(--text-light)';
                }
            });

            // Real-time validation
            input.addEventListener('input', () => {
                validateField(input);
            });
        }
    });

    // Enhanced form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            if (input && !validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showNotification('Please fix the errors in the form.', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Create WhatsApp message
        const message = `Hi Will's Tech! 

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject}

Message: ${data.message}`;

        const whatsappUrl = `https://wa.me/256751924844?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        showNotification('Message prepared! Opening WhatsApp...', 'success');

        // Reset form with animation
        setTimeout(() => {
            form.reset();
            formGroups.forEach(group => {
                const input = group.querySelector('input, select, textarea');
                const label = group.querySelector('label');
                if (input && label) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.background = 'transparent';
                    label.style.color = 'var(--text-light)';
                }
            });
        }, 1000);
    });

    function validateField(input) {
        const value = input.value.trim();
        const group = input.closest('.form-group');
        
        // Remove existing error styles
        group.classList.remove('error', 'success');
        
        if (input.hasAttribute('required') && !value) {
            group.classList.add('error');
            return false;
        }
        
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                group.classList.add('error');
                return false;
            }
        }
        
        group.classList.add('success');
        return true;
    }
}

// Call this function in your DOMContentLoaded event
// Add it to the existing initContactForm call

function initAboutSection() {
  // Animate stats when they come into view
  const aboutStats = document.querySelector('.about-stats');
  if (!aboutStats) return;

  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              animateAboutStats();
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });

  observer.observe(aboutStats);

  function animateAboutStats() {
      const stats = document.querySelectorAll('.stat-number');
      const values = [1000, 500, 99];
      const durations = [2000, 2500, 1800];

      stats.forEach((stat, index) => {
          const target = values[index];
          const duration = durations[index];
          let start = 0;
          const increment = target / (duration / 16);
          
          const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                  stat.textContent = target + (index === 2 ? '%' : '+');
                  clearInterval(timer);
              } else {
                  stat.textContent = Math.floor(start) + (index === 2 ? '%' : '+');
              }
          }, 16);
      });
  }

  // Add hover effects for highlight items
  const highlightItems = document.querySelectorAll('.highlight-item');
  highlightItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
          item.style.transform = 'translateX(10px)';
      });
      
      item.addEventListener('mouseleave', () => {
          item.style.transform = 'translateX(0)';
      });
  });

  // Parallax effect for about image
  window.addEventListener('scroll', () => {
      const aboutImage = document.querySelector('.about-image-main');
      if (aboutImage) {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          aboutImage.style.transform = `translateY(${rate}px) rotateY(-5deg) rotateX(5deg)`;
      }
  });
}

// Call this function in your DOMContentLoaded event
// Add it to the existing initialization

function initWhatsAppCTA() {
    // Animate stats when they come into view
    const whatsappStats = document.querySelector('.whatsapp-stats');
    if (!whatsappStats) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateWhatsAppStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(whatsappStats);

    function animateWhatsAppStats() {
        const stats = document.querySelectorAll('.whatsapp-stat-number');
        const values = [2000, 24, 15];
        const suffixes = ['+', '/7', ' min'];
        
        stats.forEach((stat, index) => {
            const target = values[index];
            const suffix = suffixes[index];
            let start = 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(start) + suffix;
                }
            }, 16);
        });
    }

    // Add click tracking for WhatsApp buttons
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonType = this.classList.contains('whatsapp-btn-primary') ? 'Primary' : 'Secondary';
            trackWhatsAppClick(buttonType);
        });
    });

    // Simulate online status changes
    function updateOnlineStatus() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (!typingIndicator) return;

        const statusText = typingIndicator.querySelector('span');
        const dots = typingIndicator.querySelector('.typing-dots');
        
        // Randomly change status to make it feel alive
        const statuses = [
            'Our team is online now',
            'Typing...',
            'Online - Ready to help!',
            'Available for questions'
        ];
        
        setInterval(() => {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            statusText.textContent = randomStatus;
            
            // Briefly hide dots for some statuses
            if (randomStatus === 'Online - Ready to help!' || randomStatus === 'Available for questions') {
                dots.style.opacity = '0';
                setTimeout(() => {
                    dots.style.opacity = '1';
                }, 3000);
            }
        }, 8000);
    }

    // Add hover effects for features
    const features = document.querySelectorAll('.whatsapp-feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'translateY(-8px)';
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'translateY(0)';
        });
    });

    // Initialize
    updateOnlineStatus();
}

// Track WhatsApp button clicks
function trackWhatsAppClick(buttonType) {
    // Here you can integrate with Google Analytics or other analytics tools
    console.log(`WhatsApp ${buttonType} button clicked`);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'WhatsApp CTA',
            'event_label': `${buttonType} Button`,
            'value': 1
        });
    }
    
    // Track conversion (you can use this for Facebook Pixel too)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
}

// Make function global for potential external calls
window.trackWhatsAppClick = trackWhatsAppClick;