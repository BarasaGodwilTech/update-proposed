// Admin authentication check - Add this at the TOP of your script.js file
if (window.location.pathname.includes('admin.html') && 
    !localStorage.getItem('willstech_admin_auth')) {
    window.location.href = 'admin-login.html';
}

// ===== ONBOARDING GUIDE FUNCTIONALITY =====
// ==== FIXED ONBOARDING GUIDE FUNCTIONALITY ====
// ==== PROFESSIONAL ONBOARDING GUIDE ====
function initOnboardingSystem() {
    const hasSeenGuide = localStorage.getItem('willstech_guide_seen');
    
    if (!hasSeenGuide) {
        setTimeout(() => {
            showOnboarding();
        }, 1500);
    }
}

function showOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        initOnboardingEvents();
    }
}

function hideOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        cleanupTour();
    }
}

function initOnboardingEvents() {
    const startTourBtn = document.getElementById('startTourBtn');
    const skipTourBtn = document.getElementById('skipTourBtn');
    const closeTourBtn = document.getElementById('closeTourBtn');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');

    if (startTourBtn) {
        startTourBtn.addEventListener('click', startGuidedTour);
    }

    if (skipTourBtn) {
        skipTourBtn.addEventListener('click', () => {
            localStorage.setItem('willstech_guide_seen', 'true');
            hideOnboarding();
            showCompletionMessage();
        });
    }

    if (closeTourBtn) {
        closeTourBtn.addEventListener('click', () => {
            localStorage.setItem('willstech_guide_seen', 'true');
            hideOnboarding();
            showCompletionMessage();
        });
    }

    if (prevStepBtn) {
        prevStepBtn.addEventListener('click', previousTourStep);
    }

    if (nextStepBtn) {
        nextStepBtn.addEventListener('click', nextTourStep);
    }
}

// Tour Configuration
const tourSteps = [
    {
        title: "Product Showcase",
        description: "Browse our premium tech collection. Use category filters to find exactly what you need, and click 'Quick View' to see product details instantly.",
        element: "#products",
        position: "top-center",
        scroll: true
    },
    {
        title: "Quick View Feature",
        description: "Click the 'Quick View' button on any product to see detailed information, features, and pricing without leaving the page.",
        element: ".product-card:first-child .quick-view-btn",
        position: "center",
        scroll: true
    },
    {
        title: "WhatsApp Integration",
        description: "Get instant support and exclusive deals. Click any WhatsApp button to start a conversation with our team directly.",
        element: ".whatsapp-cta",
        position: "top-center",
        scroll: true
    },
    {
        title: "Video Demonstrations",
        description: "Watch authentic product reviews and unboxings. Our video section helps you make informed decisions.",
        element: ".youtube-section",
        position: "bottom",
        scroll: true
    },
    {
        title: "Easy Ordering",
        description: "Ready to purchase? Click 'Buy Now' on any product to order instantly through WhatsApp with secure payment options.",
        element: ".product-card:first-child .buy-now-btn",
        position: "top",
        scroll: true
    }
];

let currentTourStep = 0;

function startGuidedTour() {
    // Hide welcome screen, show tour
    document.getElementById('welcomeScreen').classList.remove('active');
    document.getElementById('tourSteps').classList.add('active');
    
    // Start with first step
    showTourStep(0);
}

function showTourStep(stepIndex) {
    const step = tourSteps[stepIndex];
    if (!step) return;

    // Update step indicator
    document.getElementById('currentStep').textContent = stepIndex + 1;
    document.getElementById('totalSteps').textContent = tourSteps.length;

    // Update tooltip content
    document.getElementById('tooltipTitle').textContent = step.title;
    document.getElementById('tooltipDescription').textContent = step.description;

    // Update button states
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    
    prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
    nextBtn.textContent = stepIndex === tourSteps.length - 1 ? 'Finish Tour' : 'Next';

    // Highlight target element
    highlightTourElement(step);
}

function highlightTourElement(step) {
    // Cleanup previous highlights
    cleanupTourHighlights();

    const targetElement = document.querySelector(step.element);
    if (!targetElement) {
        console.warn('Tour element not found:', step.element);
        return;
    }

    // Add highlight class
    targetElement.classList.add('highlight-element');

    // Scroll to element if needed
    if (step.scroll) {
        targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
        });
    }

    // Position tooltip
    positionTooltip(step, targetElement);
}

function positionTooltip(step, targetElement) {
    const tooltip = document.getElementById('tourTooltip');
    const targetRect = targetElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Always position tooltip in a visible area
    let top, left;
    const arrow = tooltip.querySelector('.tooltip-arrow');
    
    // Calculate available space around the element
    const spaceAbove = targetRect.top;
    const spaceBelow = viewportHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = viewportWidth - targetRect.right;

    // Choose the position with most space
    if (spaceBelow >= 200 || spaceBelow >= spaceAbove) {
        // Position below with center alignment
        top = targetRect.bottom + 20;
        left = Math.max(20, targetRect.left + (targetRect.width - 350) / 2);
        arrow.className = 'tooltip-arrow top';
    } else {
        // Position above with center alignment
        top = targetRect.top - 320; // Account for tooltip height
        left = Math.max(20, targetRect.left + (targetRect.width - 350) / 2);
        arrow.className = 'tooltip-arrow';
    }

    // Ensure tooltip stays within viewport boundaries
    left = Math.max(20, Math.min(left, viewportWidth - 350 - 20)); // 350px is tooltip width
    top = Math.max(20, Math.min(top, viewportHeight - 400 - 20)); // 400px is approximate tooltip height

    // If tooltip would be off-screen, position it in the center of the viewport
    if (top < 20 || top > viewportHeight - 400) {
        top = Math.max(50, (viewportHeight - 400) / 2);
        left = Math.max(20, (viewportWidth - 350) / 2);
        arrow.style.display = 'none'; // Hide arrow when centered
    } else {
        arrow.style.display = 'block';
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';
}

function nextTourStep() {
    if (currentTourStep < tourSteps.length - 1) {
        currentTourStep++;
        showTourStep(currentTourStep);
    } else {
        finishTour();
    }
}

function previousTourStep() {
    if (currentTourStep > 0) {
        currentTourStep--;
        showTourStep(currentTourStep);
    }
}

function finishTour() {
    localStorage.setItem('willstech_guide_seen', 'true');
    hideOnboarding();
    showCompletionMessage();
}

function cleanupTour() {
    cleanupTourHighlights();
    currentTourStep = 0;
    
    // Reset to welcome screen
    document.getElementById('welcomeScreen').classList.add('active');
    document.getElementById('tourSteps').classList.remove('active');
}

function cleanupTourHighlights() {
    const highlightedElements = document.querySelectorAll('.highlight-element');
    highlightedElements.forEach(el => {
        el.classList.remove('highlight-element');
    });
}

function showCompletionMessage() {
    const completionMsg = document.createElement('div');
    completionMsg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        font-family: 'Work Sans', sans-serif;
        animation: slideInRight 0.5s ease-out;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 300px;
    `;
    completionMsg.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
        <div>
            <strong>You're all set! 🎉</strong>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 4px;">
                Enjoy exploring Will's Tech Store
            </div>
        </div>
    `;
    
    document.body.appendChild(completionMsg);
    
    setTimeout(() => {
        completionMsg.style.animation = 'slideOutRight 0.5s ease-in forwards';
        setTimeout(() => {
            if (document.body.contains(completionMsg)) {
                document.body.removeChild(completionMsg);
            }
        }, 500);
    }, 5000);
}

// Keyboard navigation for tour
document.addEventListener('keydown', (e) => {
    const tourActive = document.getElementById('tourSteps')?.classList.contains('active');
    if (!tourActive) return;

    if (e.key === 'Escape') {
        finishTour();
    } else if (e.key === 'ArrowRight') {
        nextTourStep();
    } else if (e.key === 'ArrowLeft') {
        previousTourStep();
    }
});

function ensureTooltipVisibility() {
    const tooltip = document.getElementById('tourTooltip');
    if (!tooltip || currentTourStep === undefined) return;

    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if tooltip is partially out of viewport
    const isOutOfViewport = 
        tooltipRect.top < 0 ||
        tooltipRect.bottom > viewportHeight ||
        tooltipRect.left < 0 ||
        tooltipRect.right > viewportWidth;

    if (isOutOfViewport) {
        // Reposition to center of viewport
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        
        // Hide arrow when centered
        const arrow = tooltip.querySelector('.tooltip-arrow');
        if (arrow) {
            arrow.style.display = 'none';
        }
    }
}

// Update the showTourStep function to include visibility check:
function showTourStep(stepIndex) {
    const step = tourSteps[stepIndex];
    if (!step) return;

    // Update step indicator
    document.getElementById('currentStep').textContent = stepIndex + 1;
    document.getElementById('totalSteps').textContent = tourSteps.length;

    // Update tooltip content
    document.getElementById('tooltipTitle').textContent = step.title;
    document.getElementById('tooltipDescription').textContent = step.description;

    // Update button states
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    
    prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
    nextBtn.innerHTML = stepIndex === tourSteps.length - 1 ? 
        'Finish Tour <i class="fas fa-check"></i>' : 
        'Next <i class="fas fa-arrow-right"></i>';

    // Highlight target element
    highlightTourElement(step);
    
    // Ensure tooltip is visible after a short delay
    setTimeout(ensureTooltipVisibility, 100);
}

// Add this to handle window resizing during the tour
window.addEventListener('resize', () => {
    if (document.getElementById('tourSteps')?.classList.contains('active')) {
        ensureTooltipVisibility();
        
        // Reposition for current step
        const step = tourSteps[currentTourStep];
        if (step) {
            const targetElement = document.querySelector(step.element);
            if (targetElement) {
                positionTooltip(step, targetElement);
            }
        }
    }
});

// ==== END PROFESSIONAL ONBOARDING GUIDE ====

// Your existing script.js code continues below...
// [YOUR EXISTING SCRIPT.JS CODE HERE]


// ===== ADD MISSING FUNCTIONS HERE =====

function addUrgencyEffects(days) {
    // Add urgency effects when launch is near
    if (days <= 7) {
        const countdownSection = document.querySelector('.countdown');
        if (countdownSection && !countdownSection.classList.contains('urgent')) {
            countdownSection.classList.add('urgent');
            
            // Add pulsing animation to countdown
            const timerItems = document.querySelectorAll('.timer-item');
            timerItems.forEach(item => {
                item.style.animation = 'pulse 2s infinite';
            });
            
            // Show notification for the first time
            if (days === 7) {
                showNotification(`Only ${days} days until launch! 🚀`, 'success');
            }
        }
    }
}

function showCelebration() {
    const countdownContainer = document.querySelector('.countdown-container');
    const countdownCta = document.querySelector('.countdown-cta');
    const celebration = document.getElementById('celebration');
    
    if (countdownContainer) countdownContainer.style.display = 'none';
    if (countdownCta) countdownCta.style.display = 'none';
    if (celebration) {
        celebration.style.display = 'block';
        // Add celebration animation
        celebration.style.animation = 'celebrate 1s ease-out';
    }
    
    document.title = "🎉 We're Live! - Will's Tech Store";
    
    // Show celebration notification
    showNotification("🎉 We're officially live! Welcome to Will's Tech Store!", 'success');
    
    // Update page content for live state
    updatePageForLiveState();
}

function updatePageForLiveState() {
    // Update any elements that should change when we're live
    const notifySection = document.querySelector('.notify-section');
    if (notifySection) {
        notifySection.innerHTML = `
            <div class="container">
                <div class="notify-success" style="display: block;">
                    <div class="success-icon">
                        <i class="fas fa-rocket" aria-hidden="true"></i>
                    </div>
                    <h3>We're Live! 🎉</h3>
                    <p>Thank you for your patience! Will's Tech Store is now officially open for business.</p>
                    <a href="#products" class="btn btn-primary">
                        <i class="fas fa-shopping-bag" aria-hidden="true"></i>
                        Start Shopping Now
                    </a>
                </div>
            </div>
        `;
    }
}

// ===== END OF MISSING FUNCTIONS =====

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize onboarding first
    initOnboardingSystem();
    
    // Then load other functionality
    await updateWebsiteWithDynamicData();
    initPageLoader();
    initScrollAnimations();
    initCountdown();
    initFormToggle();
    initYouTubeAPI();
    fetchPlaylistVideos();
    initFloatingButtons();
    initStatCounters();
    initParallaxEffects();
    initProductFilters(); // This will now work with dynamic products
    initTestimonialSlider();
    initContactForm();
    initQuickView();
    initMobileMenu();
    initDropdownNavigation();
    initModalActions();
    initAboutSection();
    initWhatsAppCTA();
    initFeaturesSection();
  } catch (error) {
    console.error("Initialization error:", error);
  }
});

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
        initScrollAnimations()
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
// Enhanced YouTube API Configuration
const YT_API_KEY = "AIzaSyBnhvlEoMzX9A_DIq5Lks74m_S5CBL9jXU"
const PLAYLIST_ID = "PL3UeMmSqW6uaESNSPkwr-RMrZJNiOUmYV"
const YT = window.YT

// Global variables
let player
let currentVideoId = ""
let playlistVideos = []
let hasAutoplayed = false

// Enhanced YouTube API Initialization
function initYouTubeAPI() {
    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
        createYouTubePlayer();
        return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Enhanced YouTube Player Creation
function createYouTubePlayer() {
    player = new YT.Player('mainVideoPlayer', {
        height: '100%',
        width: '100%',
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onError': onPlayerError
        }
    });
}

// YouTube API Ready Callback
window.onYouTubeIframeAPIReady = createYouTubePlayer;

function onPlayerReady(event) {
    console.log('YouTube player ready');
    setupScrollAutoplay();
    setupVolumeControl();
    fetchPlaylistVideos();
    
    // Get initial video data
    try {
        const videoData = event.target.getVideoData();
        if (videoData.video_id) {
            updateActionButtons(videoData.video_id);
        }
    } catch (error) {
        console.log('Could not get initial video data:', error);
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        try {
            const videoData = event.target.getVideoData();
            if (videoData.video_id && videoData.video_id !== currentVideoId) {
                updateActionButtons(videoData.video_id);
                trackVideoPlay(videoData.video_id, videoData.title);
            }
        } catch (error) {
            console.log('Could not get video data on state change:', error);
        }
    }
    
    // Track video completion
    if (event.data === YT.PlayerState.ENDED) {
        trackVideoCompletion(currentVideoId);
    }
}

function onPlayerError(error) {
    console.error('YouTube player error:', error);
    showNotification('Error loading video. Please try again.', 'error');
}

// Enhanced Volume Control
function setupVolumeControl() {
    const volumeToggle = document.getElementById('volumeToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIndicator = document.querySelector('.volume-indicator');
    const volumeIcon = volumeToggle.querySelector('i');

    let currentVolume = 0;
    let previousVolume = 50;

    // Initialize volume display
    updateVolumeDisplay(currentVolume);

    volumeToggle.addEventListener('click', () => {
        if (currentVolume === 0) {
            // Unmute
            currentVolume = previousVolume;
            if (player && player.setVolume) {
                player.setVolume(currentVolume);
                player.unMute();
            }
            showNotification('Volume on', 'success');
        } else {
            // Mute
            previousVolume = currentVolume;
            currentVolume = 0;
            if (player && player.setVolume) {
                player.setVolume(0);
                player.mute();
            }
            showNotification('Volume muted', 'info');
        }

        volumeSlider.value = currentVolume;
        updateVolumeDisplay(currentVolume);
    });

    volumeSlider.addEventListener('input', (e) => {
        currentVolume = parseInt(e.target.value);
        if (player && player.setVolume) {
            player.setVolume(currentVolume);
            
            if (currentVolume === 0) {
                player.mute();
            } else {
                player.unMute();
                previousVolume = currentVolume;
            }
        }

        updateVolumeDisplay(currentVolume);
    });

    function updateVolumeDisplay(volume) {
        volumeIndicator.style.width = volume + '%';
        
        // Update toggle button appearance
        volumeToggle.classList.toggle('muted', volume === 0);
        
        // Update icon based on volume level
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 30) {
            volumeIcon.className = 'fas fa-volume-down';
        } else if (volume < 70) {
            volumeIcon.className = 'fas fa-volume-up';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
}

// Enhanced Auto-play with Intersection Observer
function setupScrollAutoplay() {
    const videoSection = document.querySelector('.youtube-section');
    if (!videoSection) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAutoplayed) {
                    if (entry.intersectionRatio >= 0.3) {
                        setTimeout(() => {
                            if (player && player.playVideo) {
                                player.playVideo();
                                hasAutoplayed = true;
                                observer.unobserve(videoSection);
                                showNotification('🎥 Video started playing!', 'success');
                            }
                        }, 1000);
                    }
                }
            });
        },
        { 
            threshold: [0.3, 0.5, 0.7],
            rootMargin: '0px 0px -100px 0px'
        }
    );

    observer.observe(videoSection);
}

// Update action buttons for current video
function updateActionButtons(videoId) {
    currentVideoId = videoId;
    const likeBtn = document.getElementById('likeBtn');
    const commentBtn = document.getElementById('commentBtn');

    if (likeBtn) {
        likeBtn.href = `https://www.youtube.com/watch?v=${videoId}&like=1`;
    }
    
    if (commentBtn) {
        commentBtn.href = `https://www.youtube.com/watch?v=${videoId}#comments`;
    }

    updateRecommendedVideos();
}

// Update recommended videos (excluding current one)
function updateRecommendedVideos() {
    const otherVideos = playlistVideos.filter((video) => video.id !== currentVideoId);
    renderVideoGrid(otherVideos);
}

// Enhanced playlist videos fetch with error handling
async function fetchPlaylistVideos() {
    try {
        showVideoGridLoading();
        
        let nextPageToken = "";
        let allVideos = [];

        do {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${YT_API_KEY}&pageToken=${nextPageToken}`
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch videos: ${response.status}`);
            }

            const data = await response.json();

            if (!data.items) {
                throw new Error('No videos found in playlist');
            }

            allVideos = allVideos.concat(
                data.items.map((item) => ({
                    id: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                    publishedAt: item.snippet.publishedAt,
                    description: item.snippet.description
                }))
            );

            nextPageToken = data.nextPageToken || "";
        } while (nextPageToken);

        playlistVideos = allVideos;
        
        if (playlistVideos.length > 0) {
            // Set first video as current
            const firstVideo = playlistVideos[0];
            updateActionButtons(firstVideo.id);
            showNotification(`Loaded ${playlistVideos.length} videos`, 'success');
        } else {
            showVideoGridError('No videos found in playlist');
        }
    } catch (error) {
        console.error('Error fetching playlist videos:', error);
        showVideoGridError('Failed to load videos. Please try again later.');
        trackYouTubeError(error.message);
    }
}

// Enhanced video grid rendering
function renderVideoGrid(videos) {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;

    if (videos.length === 0) {
        showVideoGridError('No additional videos available.');
        return;
    }

    // Show only first 8 videos for better performance
    const videosToShow = videos.slice(0, 8);
    
    videoGrid.innerHTML = "";
    videosToShow.forEach((video, index) => {
        const videoItem = createVideoItem(video, index);
        videoGrid.appendChild(videoItem);
    });
}

function createVideoItem(video, index) {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.style.animationDelay = `${index * 0.1}s`;
    
    // Format published date
    const publishedDate = new Date(video.publishedAt).toLocaleDateString();
    
    videoItem.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer" class="video-link">
            <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy">
                <div class="play-overlay">
                    <div class="play-icon">
                        <i class="fas fa-play" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="video-duration">Watch</div>
            </div>
            <div class="video-info">
                <h4 class="video-title">${escapeHtml(video.title)}</h4>
                <div class="video-meta">
                    <span>Published: ${publishedDate}</span>
                </div>
            </div>
        </a>
    `;
    
    // Add click tracking
    const videoLink = videoItem.querySelector('.video-link');
    videoLink.addEventListener('click', () => {
        trackVideoClick(video.id, video.title);
    });
    
    return videoItem;
}

// Utility functions
function showVideoGridLoading() {
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
        videoGrid.innerHTML = `
            <div class="video-placeholder">
                <i class="fas fa-spinner" aria-hidden="true"></i>
                Loading amazing tech videos...
            </div>
        `;
    }
}

function showVideoGridError(message) {
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
        videoGrid.innerHTML = `
            <div class="video-placeholder">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                ${message}
            </div>
        `;
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Analytics and tracking
function trackVideoPlay(videoId, videoTitle) {
    console.log('Video playing:', videoTitle);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'play', {
            'event_category': 'YouTube Video',
            'event_label': videoTitle,
            'value': videoId
        });
    }
}

function trackVideoCompletion(videoId) {
    console.log('Video completed:', videoId);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'complete', {
            'event_category': 'YouTube Video',
            'event_label': 'Video Completed',
            'value': videoId
        });
    }
}

function trackVideoClick(videoId, videoTitle) {
    console.log('Video clicked:', videoTitle);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'YouTube Video',
            'event_label': videoTitle,
            'value': videoId
        });
    }
}

function trackYouTubeError(errorMessage) {
    console.error('YouTube error:', errorMessage);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': errorMessage,
            'fatal': false
        });
    }
}

function initProductFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productsGrid = document.querySelector('.products-grid');

    if (!categoryBtns.length || !productsGrid) return;

    // Filter products function - now works with dynamically loaded products
    function filterProducts(category) {
        const productCards = productsGrid.querySelectorAll('.product-card'); // Get fresh product cards
        let visibleCount = 0;
        
        productCards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                visibleCount++;
                card.style.display = 'block';
                // Staggered animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Show empty state if no products
        showEmptyState(visibleCount === 0, category);
        
        // Track filter usage
        trackFilterUsage(category);
    }

    // Show empty state
    function showEmptyState(isEmpty, category) {
        let emptyState = document.querySelector('.products-empty-state');
        
        if (isEmpty && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'products-empty-state';
            emptyState.innerHTML = `
                <div class="empty-state-content">
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <h3>No ${category === 'all' ? '' : category} products found</h3>
                    <p>We're constantly adding new products. Check back soon or contact us for special requests.</p>
                    <button class="cta-btn cta-btn-primary reset-filters">
                        <i class="fas fa-redo" aria-hidden="true"></i>
                        Show All Products
                    </button>
                </div>
            `;
            productsGrid.appendChild(emptyState);
            
            // Add event listener to reset button
            emptyState.querySelector('.reset-filters').addEventListener('click', () => {
                categoryBtns.forEach(btn => {
                    if (btn.dataset.category === 'all') {
                        btn.click();
                    }
                });
            });
        } else if (!isEmpty && emptyState) {
            emptyState.remove();
        }
    }

    // Track filter usage
    function trackFilterUsage(category) {
        console.log(`Products filtered by: ${category}`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'product_filter', {
                'event_category': 'Products',
                'event_label': category,
                'value': 1
            });
        }
    }

    // Add event listeners to category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button states
            categoryBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
                b.setAttribute('tabindex', '-1');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            this.setAttribute('tabindex', '0');
            this.focus();
            
            // Filter products
            filterProducts(category);
        });
    });

    // Enhanced wishlist functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-wishlist')) {
            e.preventDefault();
            const btn = e.target.closest('.add-to-wishlist');
            const icon = btn.querySelector('i');
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;

            if (icon.classList.contains('far')) {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.classList.add('active');
                btn.style.background = 'var(--products-danger)';
                btn.style.borderColor = 'var(--products-danger)';
                btn.style.color = 'white';
                
                showNotification(`Added ${productName} to wishlist!`, 'success');
                trackWishlistAction('add', productName);
            } else {
                // Remove from wishlist
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.classList.remove('active');
                btn.style.background = 'var(--products-card-bg)';
                btn.style.borderColor = 'var(--products-border)';
                btn.style.color = 'var(--text-light)';
                
                showNotification(`Removed ${productName} from wishlist`, 'info');
                trackWishlistAction('remove', productName);
            }
        }

        // Buy Now button functionality
        if (e.target.closest('.buy-now-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.buy-now-btn');
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            const message = `Hi Will's Tech! I want to buy: ${productName} - ${productPrice}. Please provide payment details and delivery information.`;
            const whatsappUrl = `https://wa.me/256751924844?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            trackPurchaseIntent(productName, productPrice);
        }
    });

    // Keyboard navigation for category filters
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const activeBtn = document.querySelector('.category-btn[aria-selected="true"]');
            const buttons = Array.from(categoryBtns);
            const currentIndex = buttons.indexOf(activeBtn);
            let nextIndex;

            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % buttons.length;
            } else {
                nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
            }

            buttons[nextIndex].click();
            buttons[nextIndex].focus();
        }
    });

    // Initialize with all products
    filterProducts('all');
}

// Track wishlist actions
function trackWishlistAction(action, productName) {
    console.log(`Wishlist ${action}: ${productName}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'Wishlist',
            'event_label': productName,
            'value': 1
        });
    }
}

// Track purchase intent
function trackPurchaseIntent(productName, productPrice) {
    console.log(`Purchase intent: ${productName} - ${productPrice}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'event_category': 'Purchase',
            'event_label': productName,
            'value': parseFloat(productPrice.replace(/[^\d.]/g, '')) || 1
        });
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout');
    }
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



function closeQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';

    // Remove focus trap
    removeFocusTrap();
}

      function removeFocusTrap() {
        // Focus will naturally return to the trigger element
    }

function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.querySelector('.modal-close');

    // Create modal if it doesn't exist
    if (!modal) {
        createQuickViewModal();
        return;
    }

    const productData = {
        "iPhone 15 Pro": {
            image: "public/iphone-15-pro.png",
            title: "iPhone 15 Pro",
            description: "The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system. Experience the future of mobile technology with this premium device with professional-grade capabilities.",
            price: "UGX 4,500,000",
            originalPrice: "UGX 5,000,000",
            rating: "(128 reviews)",
            stars: 5,
            features: [
                "Titanium design",
                "A17 Pro chip",
                "Professional camera system",
                "5G capable",
                "Face ID"
            ],
            stock: "In Stock",
            sku: "APP-IP15P-256"
        },
        "MacBook Pro M3": {
            image: "public/macbook-pro-m3-laptop.jpg",
            title: "MacBook Pro M3",
            description: "Supercharged by the M3 chip, this MacBook Pro delivers exceptional performance for professionals and creators. Perfect for demanding workflows with enhanced graphics and processing power.",
            price: "UGX 8,500,000",
            originalPrice: "",
            rating: "(89 reviews)",
            stars: 5,
            features: [
                "M3 chip",
                "Liquid Retina XDR display",
                "Up to 22 hours battery",
                "8GB Unified Memory",
                "512GB SSD Storage"
            ],
            stock: "In Stock",
            sku: "APP-MBP-M3-512"
        },
        "PlayStation 5": {
            image: "public/playstation-5-gaming-console.jpg",
            title: "PlayStation 5",
            description: "Experience next-generation gaming with the PlayStation 5. Featuring ultra-high speed SSD, haptic feedback, and stunning 4K graphics for immersive gaming experiences.",
            price: "UGX 2,800,000",
            originalPrice: "",
            rating: "(156 reviews)",
            stars: 4.5,
            features: [
                "4K Gaming",
                "Ultra-high speed SSD",
                "Haptic feedback",
                "3D Audio",
                "Backward compatibility"
            ],
            stock: "Limited Stock",
            sku: "SONY-PS5-STD"
        },
        "AirPods Pro": {
            image: "public/airpods-pro-wireless-earbuds.jpg",
            title: "AirPods Pro",
            description: "Premium wireless earbuds with active noise cancellation, spatial audio, and all-day battery life. Perfect for music lovers and professionals seeking crystal-clear audio quality.",
            price: "UGX 950,000",
            originalPrice: "",
            rating: "(203 reviews)",
            stars: 5,
            features: [
                "Active Noise Cancellation",
                "Spatial Audio",
                "Sweat and water resistant",
                "Up to 6 hours battery",
                "Wireless charging case"
            ],
            stock: "In Stock",
            sku: "APP-AIRPODS-PRO"
        }
    };

    // Add event listeners to quick view buttons
    quickViewBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const productTitle = productCard.querySelector('h3').textContent;
            const product = productData[productTitle];

            if (product) {
                openQuickViewModal(product);
            } else {
                console.warn('Product data not found for:', productTitle);
                showNotification('Product details not available', 'error');
            }
        });
    });

    // Close modal functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickViewModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeQuickViewModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeQuickViewModal();
        }
    });

    function openQuickViewModal(product) {
        if (!modal) return;

        // Update modal content
        const elements = {
            image: document.getElementById('modalProductImage'),
            title: document.getElementById('modalProductTitle'),
            description: document.getElementById('modalProductDescription'),
            price: document.getElementById('modalProductPrice'),
            originalPrice: document.getElementById('modalProductOriginalPrice'),
            rating: document.getElementById('modalProductRating'),
            stars: document.getElementById('modalProductStars'),
            features: document.getElementById('modalProductFeatures'),
            stock: document.getElementById('modalProductStock'),
            sku: document.getElementById('modalProductSKU')
        };

        // Set product data
        if (elements.image) elements.image.src = product.image;
        if (elements.image) elements.image.alt = product.title;
        if (elements.title) elements.title.textContent = product.title;
        if (elements.description) elements.description.textContent = product.description;
        if (elements.price) elements.price.textContent = product.price;
        
        // Handle original price
        if (elements.originalPrice) {
            if (product.originalPrice) {
                elements.originalPrice.textContent = product.originalPrice;
                elements.originalPrice.style.display = 'inline';
            } else {
                elements.originalPrice.style.display = 'none';
            }
        }
        
        if (elements.rating) elements.rating.textContent = product.rating;
        if (elements.stock) elements.stock.textContent = product.stock;
        if (elements.sku) elements.sku.textContent = product.sku;

        // Generate stars
        if (elements.stars) {
            elements.stars.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                if (i < Math.floor(product.stars)) {
                    star.className = 'fas fa-star';
                } else if (i < product.stars) {
                    star.className = 'fas fa-star-half-alt';
                } else {
                    star.className = 'far fa-star';
                }
                elements.stars.appendChild(star);
            }
        }

        // Generate features list
        if (elements.features && product.features) {
            elements.features.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check" aria-hidden="true"></i> ${feature}`;
                elements.features.appendChild(li);
            });
        }

        // Show modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Add focus trap for accessibility
        trapFocus(modal);

        // Track quick view event
        trackQuickView(product.title);
    }


    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });

        firstElement.focus();
    }


    function createQuickViewModal() {
        const modalHTML = `
            <div id="quickViewModal" class="modal" aria-hidden="true">
                <div class="modal-overlay">
                    <div class="modal-content" role="dialog" aria-labelledby="modalProductTitle" aria-modal="true">
                        <button class="modal-close" aria-label="Close quick view">
                            <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                        
                        <div class="modal-body">
                            <div class="modal-product-image">
                                <img id="modalProductImage" src="" alt="" loading="lazy">
                            </div>
                            
                            <div class="modal-product-info">
                                <div class="product-header">
                                    <h2 id="modalProductTitle">Product Title</h2>
                                    <div class="product-meta">
                                        <span id="modalProductStock" class="stock-status in-stock">In Stock</span>
                                        <span id="modalProductSKU" class="product-sku">SKU: N/A</span>
                                    </div>
                                </div>
                                
                                <div class="product-rating">
                                    <div id="modalProductStars" class="stars">
                                        <!-- Stars will be generated here -->
                                    </div>
                                    <span id="modalProductRating" class="rating-count">(0 reviews)</span>
                                </div>
                                
                                <div class="product-price">
                                    <span id="modalProductPrice" class="current-price">UGX 0</span>
                                    <span id="modalProductOriginalPrice" class="original-price" style="display: none;"></span>
                                </div>
                                
                                <div class="product-description">
                                    <p id="modalProductDescription">Product description will appear here.</p>
                                </div>
                                
                                <div class="product-features">
                                    <h3>Key Features</h3>
                                    <ul id="modalProductFeatures">
                                        <!-- Features will be generated here -->
                                    </ul>
                                </div>
                                
                                <div class="modal-actions">
                                    <button class="btn btn-primary whatsapp-order">
                                        <i class="fab fa-whatsapp" aria-hidden="true"></i>
                                        Order on WhatsApp
                                    </button>
                                    <button class="btn btn-outline add-to-wishlist-modal">
                                        <i class="far fa-heart" aria-hidden="true"></i>
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Re-initialize with the new modal
        initQuickView();
    }
}

// Track quick view events
function trackQuickView(productName) {
    console.log(`Quick view opened for: ${productName}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
            'event_category': 'Quick View',
            'event_label': productName,
            'value': 1
        });
    }
}

// Add this to your initQuickView function or as a separate function
function initModalActions() {
    // WhatsApp order button
    document.addEventListener('click', (e) => {
        if (e.target.closest('.whatsapp-order')) {
            e.preventDefault();
            const modal = document.getElementById('quickViewModal');
            const productTitle = document.getElementById('modalProductTitle')?.textContent;
            const productPrice = document.getElementById('modalProductPrice')?.textContent;
            
            if (productTitle && productPrice) {
                const message = `Hi Will's Tech! I want to order: ${productTitle} - ${productPrice}. Please provide more details.`;
                const whatsappUrl = `https://wa.me/256751924844?text=${encodeURIComponent(message)}`;
                
                window.open(whatsappUrl, '_blank');
                trackModalAction('whatsapp_order', productTitle);
            }
            
            closeQuickViewModal();
        }

        // Add to wishlist from modal
        if (e.target.closest('.add-to-wishlist-modal')) {
            e.preventDefault();
            const productTitle = document.getElementById('modalProductTitle')?.textContent;
            
            if (productTitle) {
                // Find the corresponding product card and trigger wishlist
                const productCards = document.querySelectorAll('.product-card');
                productCards.forEach(card => {
                    if (card.querySelector('h3').textContent === productTitle) {
                        const wishlistBtn = card.querySelector('.add-to-wishlist');
                        if (wishlistBtn) {
                            wishlistBtn.click();
                        }
                    }
                });
                
                trackModalAction('wishlist_from_modal', productTitle);
            }
            
            closeQuickViewModal();
        }
    });
}

// Track modal actions
function trackModalAction(action, productName) {
    console.log(`Modal ${action}: ${productName}`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'Quick View Modal',
            'event_label': productName,
            'value': 1
        });
    }
}

// Call this function in your DOMContentLoaded event
// initModalActions();

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

function initFeaturesSection() {
    // Animate feature cards when they come into view
    const featureCards = document.querySelectorAll('.feature-card');
    const featureHighlights = document.querySelector('.feature-highlights');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                } else if (entry.target === featureHighlights) {
                    animateFeatureHighlights();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Observe all feature cards and highlights
    featureCards.forEach(card => observer.observe(card));
    if (featureHighlights) observer.observe(featureHighlights);

    function animateFeatureCard(card) {
        card.style.animationPlayState = 'running';
    }

    function animateFeatureHighlights() {
        const highlights = document.querySelectorAll('.feature-highlight');
        highlights.forEach((highlight, index) => {
            setTimeout(() => {
                highlight.style.opacity = '1';
                highlight.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Add interactive hover effects
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Add click tracking for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonType = this.classList.contains('cta-btn-primary') ? 'Primary' : 'Secondary';
            const buttonText = this.textContent.trim();
            trackFeatureCTAClick(buttonType, buttonText);
        });
    });

    // Initialize feature highlights
    if (featureHighlights) {
        const highlights = document.querySelectorAll('.feature-highlight');
        highlights.forEach(highlight => {
            highlight.style.opacity = '0';
            highlight.style.transform = 'translateY(20px)';
            highlight.style.transition = 'all 0.6s ease';
        });
    }
}

// Track feature CTA button clicks
function trackFeatureCTAClick(buttonType, buttonText) {
    console.log(`Features ${buttonType} CTA clicked: ${buttonText}`);
    
    // Google Analytics integration
    if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
            'event_category': 'Features CTA',
            'event_label': `${buttonType} - ${buttonText}`,
            'value': 1
        });
    }
}

// Make function global
window.trackFeatureCTAClick = trackFeatureCTAClick;

function initParallaxEffects() {
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll(".hero, .about-image-main");

        parallaxElements.forEach((element) => {
            const speed = element.classList.contains('hero') ? 0.5 : 0.3;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Load dynamic data from site-config.json
async function loadSiteData() {
    try {
        const response = await fetch('data/site-config.json');
        if (!response.ok) {
            throw new Error('Failed to load site data');
        }
        const siteData = await response.json();
        return siteData;
    } catch (error) {
        console.error('Error loading site data:', error);
        return null;
    }
}

// Update website content with dynamic data
async function updateWebsiteWithDynamicData() {
    const siteData = await loadSiteData();
    if (!siteData) {
        console.log('Using default static content');
        return;
    }

    // Update hero section
    updateHeroSection(siteData.hero);
    
    // Update products section
    updateProductsSection(siteData.products);
    
    // Update content
    updateContent(siteData.content);
    
    // Update social links
    updateSocialLinks(siteData.social);
}

function updateHeroSection(heroData) {
    if (!heroData) return;
    
    const heroTitle = document.querySelector('.hero h1');
    const heroDescription = document.querySelector('.hero p');
    const whatsappButton = document.querySelector('.hero .btn-primary[href*="wa.me"]');
    
    if (heroTitle && heroData.title) heroTitle.textContent = heroData.title;
    if (heroDescription && heroData.description) heroDescription.textContent = heroData.description;
    if (whatsappButton && heroData.whatsappLink) whatsappButton.href = heroData.whatsappLink;
}

function updateProductsSection(productsData) {
    if (!productsData || !Array.isArray(productsData)) return;
    
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    // Clear existing products (keep the structure, just update content)
    const existingProductCards = productsGrid.querySelectorAll('.product-card');
    existingProductCards.forEach(card => card.remove());
    
    // Add products from site-config.json
    productsData.forEach(product => {
        if (product.status !== 'hidden') {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        }
    });
}

function createProductCard(product) {
    const productCard = document.createElement('article');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    
    const formattedPrice = new Intl.NumberFormat('en-UG').format(product.price);
    const ratingStars = generateRatingStars(product.rating || 5);
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-badges">
                ${product.badges ? product.badges.map(badge => 
                    `<span class="product-badge badge-${badge}">${badge}</span>`
                ).join('') : ''}
            </div>
            <div class="product-overlay">
                <button class="quick-view-btn">
                    <i class="fas fa-eye" aria-hidden="true"></i>
                    Quick View
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">UGX ${formattedPrice}</span>
                ${product.originalPrice ? `<span class="original-price">UGX ${new Intl.NumberFormat('en-UG').format(product.originalPrice)}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars" aria-label="${product.rating} out of 5 stars">
                    ${ratingStars}
                </div>
                <span class="rating-count">(${Math.floor(Math.random() * 200) + 50} reviews)</span>
            </div>
            <div class="product-actions">
                <button class="add-to-wishlist" aria-label="Add to wishlist">
                    <i class="far fa-heart"></i>
                </button>
                <button class="buy-now-btn">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                    Buy Now
                </button>
            </div>
        </div>
    `;
    
    return productCard;
}

function generateRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function updateContent(contentData) {
    if (!contentData) return;
    
    // Update page title
    if (contentData.storeName) {
        document.title = contentData.storeName;
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && contentData.description) {
        metaDescription.setAttribute('content', contentData.description);
    }
    
    // Update tagline
    const tagline = document.querySelector('.header-slogan .tagline');
    if (tagline && contentData.tagline) {
        tagline.textContent = contentData.tagline;
    }
}

function updateSocialLinks(socialData) {
    if (!socialData) return;
    
    // Update social links in hero section
    const socialLinks = document.querySelectorAll('.hero .social-links a');
    socialLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.includes('facebook') && socialData.facebook) {
            link.href = socialData.facebook;
        } else if (href.includes('instagram') && socialData.instagram) {
            link.href = socialData.instagram;
        } else if ((href.includes('twitter') || href.includes('x.com')) && socialData.twitter) {
            link.href = socialData.twitter;
        } else if (href.includes('tiktok') && socialData.tiktok) {
            link.href = socialData.tiktok;
        } else if (href.includes('youtube') && socialData.youtube) {
            link.href = socialData.youtube;
        }
    });
}