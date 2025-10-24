// Admin authentication check - Add this at the TOP of your script.js file
if (window.location.pathname.includes('admin.html') && 
    !localStorage.getItem('willstech_admin_auth')) {
    window.location.href = 'admin-login.html';
}

// ===== ONBOARDING GUIDE FUNCTIONALITY =====
// ==== FIXED ONBOARDING GUIDE FUNCTIONALITY ====
// ==== PROFESSIONAL ONBOARDING GUIDE ====
// ===== ONBOARDING GUIDE FUNCTIONALITY =====
// ==== ENHANCED ONBOARDING WITH SITE IMPROVEMENT NOTIFICATION ====
// ==== PROFESSIONAL ONBOARDING GUIDE ====

// ==== SITE IMPROVEMENT NOTIFICATION ====
function showSiteImprovementNotification() {
    const hasSeenImprovementNotice = localStorage.getItem('willstech_site_improvement_seen');
    
    // Only show if user hasn't seen it before
    if (!hasSeenImprovementNotice) {
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'site-improvement-notification';
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, var(--primary), var(--primary-dark));
                color: white;
                padding: 1.5rem;
                border-radius: var(--border-radius-lg);
                box-shadow: var(--shadow-xl);
                z-index: 10000;
                max-width: 380px;
                animation: slideInRight 0.5s ease-out;
                border-left: 4px solid var(--accent);
                font-family: 'Work Sans', sans-serif;
                backdrop-filter: blur(10px);
            `;
            
            notification.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="flex-shrink: 0;">
                        <i class="fas fa-star" style="font-size: 1.5rem; color: var(--accent);"></i>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 700;">
                            🚀 We've Supercharged Your Experience!
                        </h4>
                        <p style="margin: 0 0 16px 0; font-size: 0.9rem; line-height: 1.4; opacity: 0.9;">
                            <strong>Good news!</strong> We've completely revamped Will's Tech Store with exciting new features:
                        </p>
                        <ul style="margin: 0 0 16px 0; padding-left: 16px; font-size: 0.85rem; opacity: 0.9;">
                            <li>✨ Enhanced product browsing</li>
                            <li>🎯 Smart quick-view features</li>
                            <li>📱 Better mobile experience</li>
                            <li>⚡ Faster performance</li>
                        </ul>
                        <p style="margin: 0 0 16px 0; font-size: 0.85rem; font-style: italic; opacity: 0.8;">
                            A quick guide will appear shortly to show you around the new improvements!
                        </p>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button id="exploreNowBtn" style="
                                background: var(--accent);
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                font-weight: 600;
                                font-size: 0.85rem;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                flex: 1;
                            ">
                                <i class="fas fa-bolt" style="margin-right: 6px;"></i>
                                Explore Now
                            </button>
                            <button id="learnMoreBtn" style="
                                background: rgba(255, 255, 255, 0.2);
                                color: white;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                padding: 8px 16px;
                                border-radius: 6px;
                                font-weight: 600;
                                font-size: 0.85rem;
                                cursor: pointer;
                                transition: all 0.2s ease;
                            ">
                                <i class="fas fa-info-circle" style="margin-right: 6px;"></i>
                                Learn More
                            </button>
                        </div>
                    </div>
                    <button id="closeImprovementNotice" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 6px;
                        border-radius: 50%;
                        transition: all 0.2s ease;
                        flex-shrink: 0;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    " aria-label="Close notification">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Add hover effects
            const buttons = notification.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                });
                btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                });
            });
            
            // Event listeners
            document.getElementById('exploreNowBtn').addEventListener('click', function() {
                localStorage.setItem('willstech_site_improvement_seen', 'true');
                hideImprovementNotification(notification);
                // Let user explore naturally, tour will come shortly
            });
            
            document.getElementById('learnMoreBtn').addEventListener('click', function() {
                // Scroll to features section
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
                localStorage.setItem('willstech_site_improvement_seen', 'true');
                hideImprovementNotification(notification);
            });
            
            document.getElementById('closeImprovementNotice').addEventListener('click', function() {
                localStorage.setItem('willstech_site_improvement_seen', 'true');
                hideImprovementNotification(notification);
            });
            
            // Auto-dismiss after 12 seconds (gives user time to read)
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    hideImprovementNotification(notification);
                }
            }, 28000);
            
        }, 1700); // Show after 1.5 seconds of page load
    }
}

function hideImprovementNotification(notification) {
    notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 500);
}

function initOnboardingSystem() {
    const hasSeenGuide = localStorage.getItem('willstech_guide_seen');
    
    // Show site improvement notification first
    showSiteImprovementNotification();
    
    // Only show tour if user hasn't seen it before
    if (!hasSeenGuide) {
        // Wait longer before showing tour to let user read improvement notice
        setTimeout(() => {
            showOnboarding();
        }, 27000); // Show tour 8 seconds after page load (6.5 seconds after improvement notice)
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
            localStorage.setItem('willstech_site_improvement_seen', 'true');
            hideOnboarding();
            showCompletionMessage();
        });
    }

    if (closeTourBtn) {
        closeTourBtn.addEventListener('click', () => {
            localStorage.setItem('willstech_guide_seen', 'true');
            localStorage.setItem('willstech_site_improvement_seen', 'true');
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
    localStorage.setItem('willstech_site_improvement_seen', 'true'); // Add this line
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
    await updateWebsiteWithDynamicData(); // This loads products from admin panel
    
    // Initialize all components
    initPageLoader();
    initScrollAnimations();
    initCountdown();
    initFormToggle();
    initYouTubeAPI();
    fetchPlaylistVideos();
    initFloatingButtons();
    initStatCounters();
    initParallaxEffects();
    initProductFilters(); // This creates product cards
    initTestimonialSlider();
    initContactForm();
    initMobileMenu();
    initDropdownNavigation();
    initModalActions();
    initAboutSection();
    initWhatsAppCTA();
    initFeaturesSection();
    
    // INIT QUICK VIEW AFTER PRODUCTS ARE LOADED - with better timing
    setTimeout(() => {
        initQuickView();
        initModalActions(); // Ensure modal actions are initialized
        initShareFunctionality(); // ADD THIS LINE

         // Check if URL has product parameter and open it
        checkUrlForProduct(); // ADD THIS LINE
    }, 2500); // Increased delay to ensure everything is loaded
    
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
// Enhanced YouTube API Configuration
const YT_API_KEY = "AIzaSyBnhvlEoMzX9A_DIq5Lks74m_S5CBL9jXU";
const PLAYLIST_ID = "PL3UeMmSqW6uaESNSPkwr-RMrZJNiOUmYV";

// Global variables
let player;
let currentVideoId = "";
let playlistVideos = [];
let hasAutoplayed = false;
let isPlayerReady = false;

// Enhanced YouTube API Initialization
function initYouTubeAPI() {
    console.log('Initializing YouTube API...');
    
    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
        console.log('YouTube API already loaded');
        createYouTubePlayer();
        return;
    }

    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = () => {
        console.error('Failed to load YouTube API');
        showNotification('Failed to load YouTube player', 'error');
    };
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Enhanced YouTube Player Creation with proper autoplay settings
function createYouTubePlayer() {
    console.log('Creating YouTube player...');
    
    try {
        player = new YT.Player('mainVideoPlayer', {
            height: '100%',
            width: '100%',
            videoId: '', // Start with empty video
            playerVars: {
                'autoplay': 0, // Start with 0 due to browser restrictions
                'mute': 1, // Start muted to allow autoplay
                'controls': 1,
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'playsinline': 1,
                'enablejsapi': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } catch (error) {
        console.error('Error creating YouTube player:', error);
        showNotification('Error creating video player', 'error');
    }
}

// YouTube API Ready Callback - FIXED
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API ready');
    createYouTubePlayer();
};

function onPlayerReady(event) {
    console.log('YouTube player ready and muted');
    isPlayerReady = true;
    
    // Set initial state: muted and volume 0
    event.target.mute();
    event.target.setVolume(0);
    
    setupVolumeControl();
    setupScrollAutoplay();
    fetchPlaylistVideos();
    
    // Get initial video data
    try {
        const videoData = event.target.getVideoData();
        if (videoData && videoData.video_id) {
            updateActionButtons(videoData.video_id);
        }
    } catch (error) {
        console.log('Could not get initial video data:', error);
    }
}

function onPlayerStateChange(event) {
    console.log('Player state changed:', event.data);
    
    if (event.data === YT.PlayerState.PLAYING) {
        try {
            const videoData = event.target.getVideoData();
            if (videoData && videoData.video_id && videoData.video_id !== currentVideoId) {
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

// FIXED Volume Control System
function setupVolumeControl() {
    const volumeToggle = document.getElementById('volumeToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIndicator = document.querySelector('.volume-indicator');
    const volumeIcon = volumeToggle?.querySelector('i');

    if (!volumeToggle || !volumeSlider || !volumeIndicator) {
        console.warn('Volume control elements not found');
        return;
    }

    let currentVolume = 0; // Start muted
    let previousVolume = 50;

    // Initialize volume display
    updateVolumeDisplay(currentVolume);

    volumeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isPlayerReady || !player) {
            console.log('Player not ready yet');
            return;
        }

        if (currentVolume === 0) {
            // Unmute - restore previous volume
            currentVolume = previousVolume;
            try {
                player.unMute();
                player.setVolume(currentVolume);
                showNotification('Volume on', 'success');
            } catch (error) {
                console.error('Error unmuting:', error);
            }
        } else {
            // Mute - store current volume and set to 0
            previousVolume = currentVolume;
            currentVolume = 0;
            try {
                player.mute();
                showNotification('Volume muted', 'info');
            } catch (error) {
                console.error('Error muting:', error);
            }
        }

        volumeSlider.value = currentVolume;
        updateVolumeDisplay(currentVolume);
    });

    volumeSlider.addEventListener('input', (e) => {
        if (!isPlayerReady || !player) return;

        currentVolume = parseInt(e.target.value);
        
        try {
            player.setVolume(currentVolume);
            
            if (currentVolume === 0) {
                player.mute();
            } else {
                player.unMute();
                previousVolume = currentVolume;
            }
        } catch (error) {
            console.error('Error setting volume:', error);
        }

        updateVolumeDisplay(currentVolume);
    });

    function updateVolumeDisplay(volume) {
        volumeIndicator.style.width = volume + '%';
        
        // Update toggle button appearance
        volumeToggle.classList.toggle('muted', volume === 0);
        
        // Update icon based on volume level
        if (volumeIcon) {
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
}

// FIXED Auto-play with Intersection Observer
function setupScrollAutoplay() {
    const videoSection = document.querySelector('.youtube-section');
    if (!videoSection) {
        console.warn('YouTube section not found');
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasAutoplayed && isPlayerReady) {
                    if (entry.intersectionRatio >= 0.3) {
                        console.log('Attempting autoplay...');
                        
                        setTimeout(() => {
                            if (player && typeof player.playVideo === 'function') {
                                try {
                                    // Ensure player is muted for autoplay
                                    player.mute();
                                    player.setVolume(0);
                                    player.playVideo();
                                    hasAutoplayed = true;
                                    observer.unobserve(videoSection);
                                    showNotification('🎥 Video started playing!', 'success');
                                } catch (error) {
                                    console.error('Error during autoplay:', error);
                                    // Fallback: let user click play
                                    showNotification('Click play to start video', 'info');
                                }
                            }
                        }, 1000);
                    }
                } else if (!entry.isIntersecting && hasAutoplayed) {
                    // Pause when out of view
                    try {
                        if (player && typeof player.pauseVideo === 'function') {
                            player.pauseVideo();
                        }
                    } catch (error) {
                        console.error('Error pausing video:', error);
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

// Manual play function for user interaction
function playVideoManually() {
    if (!isPlayerReady || !player) {
        showNotification('Video player not ready yet', 'error');
        return;
    }
    
    try {
        player.playVideo();
        hasAutoplayed = true;
    } catch (error) {
        console.error('Error playing video manually:', error);
        showNotification('Error playing video', 'error');
    }
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

        // Fetch first video to set as main video
        const initialResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YT_API_KEY}`
        );

        if (!initialResponse.ok) {
            throw new Error(`Failed to fetch videos: ${initialResponse.status}`);
        }

        const initialData = await initialResponse.json();

        if (!initialData.items || initialData.items.length === 0) {
            throw new Error('No videos found in playlist');
        }

        // Set first video as current
        const firstVideo = {
            id: initialData.items[0].snippet.resourceId.videoId,
            title: initialData.items[0].snippet.title,
            thumbnail: initialData.items[0].snippet.thumbnails.medium?.url || initialData.items[0].snippet.thumbnails.default?.url,
            publishedAt: initialData.items[0].snippet.publishedAt,
            description: initialData.items[0].snippet.description
        };

        // Load this video into the player when ready
        if (isPlayerReady && player) {
            player.loadVideoById(firstVideo.id);
            updateActionButtons(firstVideo.id);
        } else {
            // Store video ID to load when player is ready
            setTimeout(() => {
                if (isPlayerReady && player) {
                    player.loadVideoById(firstVideo.id);
                    updateActionButtons(firstVideo.id);
                }
            }, 2000);
        }

        playlistVideos = [firstVideo];
        
        showNotification(`YouTube player loaded successfully`, 'success');
        
    } catch (error) {
        console.error('Error fetching playlist videos:', error);
        showVideoGridError('Failed to load videos. Please try again later.');
        trackYouTubeError(error.message);
    }
}

// Make play function globally available
window.playVideoManually = playVideoManually;

// Add this to your DOMContentLoaded event
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Initialize YouTube first since it has the most dependencies
        initYouTubeAPI();
        
        // Then load other functionality
        await updateWebsiteWithDynamicData();
        
        // Initialize other components
        initPageLoader();
        initScrollAnimations();
        initCountdown();
        // ... other init functions
    } catch (error) {
        console.error("Initialization error:", error);
    }
});

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
    
    // Clean up gallery state
    cleanupGallery();
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';

    // Remove focus trap
    removeFocusTrap();
}

      function removeFocusTrap() {
        // Focus will naturally return to the trigger element
    }

    // Helper function to get product from admin panel data
function getProductFromAdminData(productName) {
    // This should access your siteData from admin panel
    if (window.siteData && window.siteData.products) {
        const product = window.siteData.products.find(p => p.name === productName);
        if (product) {
            console.log('Found product in admin data:', product.name);
        } else {
            console.log('Product not found in admin data:', productName);
        }
        return product;
    }
    console.log('No site data available');
    return null;
}

// Fallback function to get product from HTML card
function getProductFromCard(productCard) {
    return {
        name: productCard.querySelector('h3')?.textContent || '',
        description: productCard.querySelector('.product-description')?.textContent || '',
        price: extractPrice(productCard.querySelector('.current-price')?.textContent),
        originalPrice: extractPrice(productCard.querySelector('.original-price')?.textContent),
        image: productCard.querySelector('img')?.src || '',
        rating: getRatingFromStars(productCard),
        reviewCount: getReviewCount(productCard),
        stock: 'in-stock', // Default
        sku: '', // You might need to add this to your HTML
        features: getFeaturesFromCard(productCard)
    };
}

function extractPrice(priceText) {
    if (!priceText) return 0;
    return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
}

function getRatingFromStars(productCard) {
    const stars = productCard.querySelectorAll('.stars .fa-star, .stars .fa-star-half-alt');
    let rating = 5;
    if (stars.length > 0) {
        rating = 0;
        stars.forEach(star => {
            if (star.classList.contains('fa-star')) rating += 1;
            if (star.classList.contains('fa-star-half-alt')) rating += 0.5;
        });
    }
    return rating;
}

function getReviewCount(productCard) {
    const ratingText = productCard.querySelector('.rating-count')?.textContent;
    if (!ratingText) return 0;
    const match = ratingText.match(/\((\d+)\s+reviews?\)/);
    return match ? parseInt(match[1]) : 0;
}

function getFeaturesFromCard(productCard) {
    // You might need to add features to your product cards
    return ['Premium Quality', 'Authentic Product', 'Warranty Included'];
}
// ===== ENHANCED QUICK VIEW HELPER FUNCTIONS =====

// Helper function to get product from card data with better extraction
function getProductFromCard(productCard) {
    const name = productCard.querySelector('h3')?.textContent || '';
    const description = productCard.querySelector('.product-description')?.textContent || '';
    const priceText = productCard.querySelector('.current-price')?.textContent || '0';
    const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
    const image = productCard.querySelector('img')?.src || '';
    
    // Extract original price if available
    const originalPriceText = productCard.querySelector('.original-price')?.textContent;
    const originalPrice = originalPriceText ? parseInt(originalPriceText.replace(/[^\d]/g, '')) : null;
    
    // Extract rating
    const stars = productCard.querySelectorAll('.stars .fa-star, .stars .fa-star-half-alt');
    let rating = 5;
    if (stars.length > 0) {
        rating = 0;
        stars.forEach(star => {
            if (star.classList.contains('fa-star')) rating += 1;
            if (star.classList.contains('fa-star-half-alt')) rating += 0.5;
        });
    }
    
    // Extract review count
    const ratingCountText = productCard.querySelector('.rating-count')?.textContent || '(0 reviews)';
    const reviewCountMatch = ratingCountText.match(/\((\d+)\s+reviews?\)/);
    const reviewCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;
    
    // Extract badges
    const badges = [];
    const badgeElements = productCard.querySelectorAll('.product-badge');
    badgeElements.forEach(badge => {
        if (badge.classList.contains('badge-new')) badges.push('new');
        if (badge.classList.contains('badge-sale')) badges.push('sale');
        if (badge.classList.contains('badge-bestseller')) badges.push('bestseller');
        if (badge.classList.contains('badge-limited')) badges.push('limited');
        if (badge.classList.contains('badge-premiumused')) badges.push('premium-used');
    });

    return {
        name: name,
        description: description,
        price: price,
        originalPrice: originalPrice,
        image: image,
        rating: rating,
        reviewCount: reviewCount,
        badges: badges,
        stock: 'in-stock',
        sku: 'N/A',
        features: ['Premium Quality', 'Authentic Product', 'Warranty Included']
    };
}

function updateWhatsAppButton(product) {
    const whatsappBtn = document.querySelector('.whatsapp-order');
    if (whatsappBtn && product) {
        const productName = encodeURIComponent(product.name || product.title || 'Product');
        const productPrice = encodeURIComponent(`UGX ${formatPrice(product.price || 0)}`);
        const message = `Hi Will's Tech! I want to order: ${productName} for ${productPrice}. Please provide more details.`;
        whatsappBtn.href = `https://wa.me/256751924844?text=${encodeURIComponent(message)}`;
    }
}

function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleKeydown(e) {
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
    }

    modal.addEventListener('keydown', handleKeydown);
    firstElement.focus();
}

function removeFocusTrap() {
    // Focus will naturally return to the trigger element
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-UG').format(price);
}

function getStockStatusText(stock) {
    const statusMap = {
        'in-stock': 'In Stock',
        'out-of-stock': 'Out of Stock', 
        'pre-order': 'Pre-Order',
        'limited': 'Limited Stock'
    };
    return statusMap[stock] || 'In Stock';
}

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

    // Check URL for product parameter and open the product
function checkUrlForProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productSlug = urlParams.get('product');
    
    if (productId && productId !== 'unknown') {
        // Find the product in the site data and open it
        openProductFromUrl(productId, productSlug);
    }
}

// Open product from URL parameters
function openProductFromUrl(productId, productSlug) {
    console.log('Opening product from URL:', productId, productSlug);
    
    // Wait for products to load
    setTimeout(() => {
        if (window.siteData && window.siteData.products) {
            const product = window.siteData.products.find(p => 
                p.id.toString() === productId.toString() || 
                createProductSlug(p.name) === productSlug
            );
            
            if (product) {
                console.log('Product found, opening quick view:', product.name);
                // Scroll to products section first
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Open quick view after a short delay
                setTimeout(() => {
                    openQuickViewModal(product);
                }, 1000);
            } else {
                console.log('Product not found in site data');
            }
        } else {
            console.log('Site data not loaded yet');
            // Retry after a delay
            setTimeout(() => openProductFromUrl(productId, productSlug), 500);
        }
    }, 1000);
}

    function openQuickViewModal(product) {
        // Store product globally for URL sharing
    window.currentProductData = product;
    window.currentProductId = product.id;

    const modal = document.getElementById('quickViewModal');
    if (!modal) {
        console.error('Quick view modal not found');
        return;
    }

    // Update modal content with product data
    const elements = {
        title: document.getElementById('modalProductTitle'),
        description: document.getElementById('modalProductDescription'),
        price: document.getElementById('modalProductPrice'),
        originalPrice: document.getElementById('modalProductOriginalPrice'),
        rating: document.getElementById('modalProductRating'),
        stars: document.getElementById('modalProductStars'),
        features: document.getElementById('modalProductFeatures'),
        stock: document.getElementById('modalProductStock'),
        sku: document.getElementById('modalProductSKU'),
        discount: document.getElementById('modalProductDiscount'),
        thumbnails: document.getElementById('modalProductThumbnails'),
        mainImageContainer: document.getElementById('mainImageContainer'),
        mainVideoContainer: document.getElementById('mainVideoContainer'),
        modalProductVideo: document.getElementById('modalProductVideo'),
        videoControls: document.getElementById('videoControls')
    };

    // Set product data
    const images = product.images && product.images.length > 0 ? product.images : [product.image].filter(Boolean);
    const videos = product.videos || [];
    
    // Combine all media (images + videos)
    const allMedia = [
        ...images.map(img => ({ type: 'image', url: img })),
        ...videos.map(video => ({ type: 'video', url: video }))
    ];

    if (elements.title) elements.title.textContent = product.name || 'Product';
    if (elements.description) elements.description.textContent = product.description || 'No description available';
    
    // Format and set pricing
    if (elements.price) {
        elements.price.textContent = `UGX ${formatPrice(product.price || 0)}`;
    }
    
    // Handle original price and discount
    if (elements.originalPrice) {
        if (product.originalPrice && product.originalPrice > product.price) {
            elements.originalPrice.textContent = `UGX ${formatPrice(product.originalPrice)}`;
            elements.originalPrice.style.display = 'inline';
            
            const discount = Math.round((1 - product.price / product.originalPrice) * 100);
            if (elements.discount) {
                elements.discount.textContent = `Save ${discount}%`;
                elements.discount.style.display = 'inline';
            }
        } else {
            elements.originalPrice.style.display = 'none';
            if (elements.discount) elements.discount.style.display = 'none';
        }
    }
    
    // Set rating and review count
    if (elements.rating) {
        elements.rating.textContent = `(${product.reviewCount || 0} reviews)`;
    }
    
    // Set stock status
    if (elements.stock) {
        elements.stock.textContent = getStockStatusText(product.stock);
        elements.stock.className = `stock-status ${product.stock || 'in-stock'}`;
    }
    
    // Set SKU
    if (elements.sku) {
        elements.sku.textContent = `SKU: ${product.sku || 'N/A'}`;
    }

    // Generate stars from rating (0-5 scale)
    if (elements.stars) {
        elements.stars.innerHTML = '';
        const rating = product.rating || 5;
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('i');
            if (i < Math.floor(rating)) {
                star.className = 'fas fa-star';
            } else if (i < rating) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            elements.stars.appendChild(star);
        }
    }

    // Generate features list
    if (elements.features) {
        elements.features.innerHTML = '';
        
        if (product.features && product.features.length > 0) {
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check" aria-hidden="true"></i> ${feature}`;
                elements.features.appendChild(li);
            });
        } else {
            const defaultFeatures = [
                'Premium quality product',
                'Authentic and genuine',
                'Warranty included',
                'Fast delivery available'
            ];
            defaultFeatures.forEach(feature => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check" aria-hidden="true"></i> ${feature}`;
                elements.features.appendChild(li);
            });
        }
    }

        // Generate combined media thumbnails
    if (elements.thumbnails) {
        elements.thumbnails.innerHTML = '';
        
        if (allMedia.length === 0) {
            // No media available
            const noMedia = document.createElement('div');
            noMedia.className = 'media-loading';
            noMedia.innerHTML = '<i class="fas fa-image"></i> No media available';
            elements.thumbnails.appendChild(noMedia);
        } else {
            // Store current media in modal for thumbnail click handlers
            const modal = document.getElementById('quickViewModal');
            modal.currentMedia = allMedia;
            
            // Create thumbnails for all media
            allMedia.forEach((media, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = `media-thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.setAttribute('data-media-index', index);
                thumbnail.setAttribute('data-media-type', media.type);
                
                if (media.type === 'image') {
                    thumbnail.innerHTML = `
                        <img src="${media.url}" alt="${product.name} - Image ${index + 1}" loading="lazy">
                        <div class="thumbnail-type">
                            <i class="fas fa-image"></i>
                        </div>
                    `;
                } else {
                    const videoId = extractVideoId(media.url);
                    const thumbnailUrl = videoId ? getVideoThumbnail(media.url, videoId) : '/placeholder.svg';
                    
                    thumbnail.innerHTML = `
                        <img src="${thumbnailUrl}" alt="${product.name} - Video ${index + 1}" loading="lazy">
                        <div class="thumbnail-type video-indicator">
                            <i class="fas fa-play"></i>
                        </div>
                    `;
                }
                
                thumbnail.addEventListener('click', () => {
                    // Use the current media stored in the modal
                    const currentMedia = modal.currentMedia;
                    if (!currentMedia) return;
                    
                    displayMedia(media, index, currentMedia, elements);
                    
                    // Update modal's current index
                    modal.currentMediaIndex = index;
                    
                    // Update active thumbnail
                    document.querySelectorAll('.media-thumbnail').forEach(thumb => thumb.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                
                elements.thumbnails.appendChild(thumbnail);
            });
        }
    }

    // Display first media item
    if (allMedia.length > 0) {
        displayMedia(allMedia[0], 0, allMedia, elements);
    }

    // Initialize gallery navigation
    initCombinedGalleryNavigation(allMedia, elements);

    // Update WhatsApp order button
    updateWhatsAppButton(product);

    // Show modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Add focus trap for accessibility
    trapFocus(modal);

      // Store product data for sharing
    window.currentProductData = product;
    
    // Track quick view event
    trackQuickView(product.name || 'Unknown Product');
}

// Display media in the main container
function displayMedia(media, index, allMedia, elements) {
    const modal = document.getElementById('quickViewModal');
    
    // Update modal's current index
    if (modal) {
        modal.currentMediaIndex = index;
    }
    
    if (media.type === 'image') {
        // Show image, hide video
        elements.mainImageContainer.style.display = 'flex';
        elements.mainVideoContainer.style.display = 'none';
        elements.videoControls.style.display = 'none';
        
        const img = elements.mainImageContainer.querySelector('#modalProductImage');
        if (img) {
            img.src = media.url;
            img.alt = `Product image ${index + 1}`;
        }
    } else {
        // Show video, hide image
        elements.mainImageContainer.style.display = 'none';
        elements.mainVideoContainer.style.display = 'block';
        elements.videoControls.style.display = 'flex';
        
        const embedUrl = getEmbedUrl(media.url);
        elements.modalProductVideo.src = embedUrl;
    }
    
    // Update media counter
    updateMediaCounter(index + 1, allMedia.length);
}

// Update media counter
function updateMediaCounter(current, total) {
    let counter = document.querySelector('.media-counter');
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'media-counter';
        document.querySelector('.main-media-container').appendChild(counter);
    }
    counter.textContent = `${current} / ${total}`;
}

// Initialize combined gallery navigation
// Initialize combined gallery navigation
function initCombinedGalleryNavigation(allMedia, elements) {
    if (!allMedia || allMedia.length <= 1) return;
    
    // Store the current product's media in the modal for reference
    const modal = document.getElementById('quickViewModal');
    modal.currentMedia = allMedia;
    modal.currentMediaIndex = 0;
    
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    function navigateToMedia(index) {
        const currentMedia = modal.currentMedia;
        if (currentMedia && currentMedia[index]) {
            modal.currentMediaIndex = index;
            displayMedia(currentMedia[index], index, currentMedia, elements);
            
            // Update active thumbnail
            document.querySelectorAll('.media-thumbnail').forEach((thumb, thumbIndex) => {
                thumb.classList.toggle('active', thumbIndex === index);
            });
        }
    }
    
    function nextMedia() {
        const currentMedia = modal.currentMedia;
        if (!currentMedia) return;
        
        const newIndex = (modal.currentMediaIndex + 1) % currentMedia.length;
        navigateToMedia(newIndex);
    }
    
    function prevMedia() {
        const currentMedia = modal.currentMedia;
        if (!currentMedia) return;
        
        const newIndex = (modal.currentMediaIndex - 1 + currentMedia.length) % currentMedia.length;
        navigateToMedia(newIndex);
    }
    
    // Remove existing event listeners to prevent duplicates
    if (prevButton) {
        prevButton.replaceWith(prevButton.cloneNode(true));
    }
    if (nextButton) {
        nextButton.replaceWith(nextButton.cloneNode(true));
    }
    
    // Get fresh references after cloning
    const freshPrevButton = document.querySelector('.gallery-prev');
    const freshNextButton = document.querySelector('.gallery-next');
    
    // Add event listeners to fresh buttons
    if (freshPrevButton) {
        freshPrevButton.addEventListener('click', prevMedia);
    }
    
    if (freshNextButton) {
        freshNextButton.addEventListener('click', nextMedia);
    }
    
    // Video controls
    if (playPauseBtn) {
        playPauseBtn.replaceWith(playPauseBtn.cloneNode(true));
        const freshPlayPauseBtn = document.getElementById('playPauseBtn');
        
        freshPlayPauseBtn.addEventListener('click', () => {
            const icon = freshPlayPauseBtn.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.className = 'fas fa-pause';
            } else {
                icon.className = 'fas fa-play';
            }
        });
    }
    
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.replaceWith(fullscreenBtn.cloneNode(true));
        const freshFullscreenBtn = document.getElementById('fullscreenBtn');
        
        freshFullscreenBtn.addEventListener('click', () => {
            const videoContainer = elements.mainVideoContainer;
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            }
        });
    }
    
    // Remove existing keyboard listener and add fresh one
    document.removeEventListener('keydown', handleGalleryKeydown);
    document.addEventListener('keydown', handleGalleryKeydown);
    
    function handleGalleryKeydown(e) {
        if (!document.getElementById('quickViewModal').classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            prevMedia();
        } else if (e.key === 'ArrowRight') {
            nextMedia();
        } else if (e.key === 'Escape') {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }
    
    // Store the handler for cleanup
    modal.galleryKeydownHandler = handleGalleryKeydown;
}

// Add these helper functions if they don't exist:
function formatPrice(price) {
    return new Intl.NumberFormat('en-UG').format(price);
}

function getStockStatusText(stock) {
    const statusMap = {
        'in-stock': 'In Stock',
        'out-of-stock': 'Out of Stock', 
        'pre-order': 'Pre-Order',
        'limited': 'Limited Stock'
    };
    return statusMap[stock] || 'In Stock';
}
// Clean up gallery when closing modal
function cleanupGallery() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    // Clear stored media
    modal.currentMedia = null;
    modal.currentMediaIndex = 0;
    
    // Remove keyboard listener
    if (modal.galleryKeydownHandler) {
        document.removeEventListener('keydown', modal.galleryKeydownHandler);
        modal.galleryKeydownHandler = null;
    }
    
    // Clear video iframe src to stop playback
    const videoIframe = document.getElementById('modalProductVideo');
    if (videoIframe) {
        videoIframe.src = '';
    }
    
    // Reset video controls
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        const icon = playPauseBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-play';
        }
    }
}

function updateWhatsAppButton(product) {
    const whatsappBtn = document.querySelector('.whatsapp-order');
    if (whatsappBtn && product) {
        const productName = encodeURIComponent(product.name || product.title);
        const productPrice = encodeURIComponent(`UGX ${formatPrice(product.price)}`);
        whatsappBtn.href = `https://wa.me/256751924844?text=Hi%20Will's%20Tech!%20I%20want%20to%20order%20${productName}%20for%20${productPrice}`;
    }
}

function initQuickView() {
    console.log('Initializing quick view...');
    
    // Ensure modal exists
    if (!document.getElementById('quickViewModal')) {
        console.log('Creating quick view modal...');
        createQuickViewModal();
    }

    // Wait for products to be fully rendered
    setTimeout(() => {
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        console.log('Quick view buttons found:', quickViewBtns.length);

        // Add event listeners to quick view buttons
        quickViewBtns.forEach(quickViewBtn => {
            // Remove existing listeners to prevent duplicates
            quickViewBtn.replaceWith(quickViewBtn.cloneNode(true));
        });

        // Re-select buttons after cloning
        const freshQuickViewBtns = document.querySelectorAll('.quick-view-btn');
        
        // In your initQuickView function, make sure the click handler stores the product
freshQuickViewBtns.forEach(quickViewBtn => {
    quickViewBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Quick view button clicked!');
        
        const productCard = this.closest('.product-card');
        if (!productCard) {
            console.error('Product card not found');
            return;
        }
        
        const productName = productCard.querySelector('h3')?.textContent || '';
        console.log('Product name:', productName);
        
        // Try to get product from admin panel data first
        let product = null;
        if (window.siteData && window.siteData.products) {
            product = window.siteData.products.find(p => 
                p.name === productName || 
                p.name?.includes(productName) || 
                productName.includes(p.name)
            );
        }
        
        // Fallback to card data
        if (!product) {
            product = getProductFromCard(productCard);
        }
        
        if (product) {
            console.log('Opening quick view for:', product.name);
            // Store product globally for URL sharing
            window.currentProductData = product;
            openQuickViewModal(product);
        } else {
            console.error('Product data not found for:', productName);
            showNotification('Product information not available', 'error');
        }
    });
});

        // Close modal functionality
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeQuickViewModal);
        }

        // Close modal when clicking outside
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeQuickViewModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                closeQuickViewModal();
            }
        });

        console.log('Quick view initialization complete');
    }, 2000); // Increased delay to ensure products are loaded
}


// Clean up URL when quick view closes
function cleanupProductUrl() {
    if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Update closeQuickViewModal to clean URL
function closeQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';

    // Clean up URL
    cleanupProductUrl();

    // Remove focus trap
    removeFocusTrap();
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
                        <!-- Product Gallery Section -->
                        <div class="modal-product-gallery">
                            <div class="main-media-container">
                                <!-- Images will be displayed here -->
                                <div class="main-image-container" id="mainImageContainer">
                                    <img id="modalProductImage" src="" alt="" loading="lazy">
                                </div>
                                
                                <!-- Videos will be displayed here -->
                                <div class="main-video-container" id="mainVideoContainer" style="display: none;">
                                    <iframe id="modalProductVideo" frameborder="0" allowfullscreen></iframe>
                                </div>
                                
                                <button class="gallery-nav gallery-prev" aria-label="Previous media">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button class="gallery-nav gallery-next" aria-label="Next media">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                                
                                <!-- Video Play/Pause Controls -->
                                <div class="video-controls" id="videoControls" style="display: none;">
                                    <button class="video-control-btn" id="playPauseBtn" aria-label="Play/Pause">
                                        <i class="fas fa-play"></i>
                                    </button>
                                    <button class="video-control-btn" id="fullscreenBtn" aria-label="Fullscreen">
                                        <i class="fas fa-expand"></i>
                                    </button>
                                </div>
                                
                                <!-- Share Button -->
                                <button class="share-product-btn" id="shareProductBtn" aria-label="Share this product">
                                    <i class="fas fa-share-alt"></i>
                                </button>
                            </div>
                            
                            <!-- Combined Media Thumbnails -->
                            <div class="media-thumbnails" id="modalProductThumbnails">
                                <!-- Combined image and video thumbnails will be generated here -->
                            </div>
                        </div>
                        
                        <!-- Product Info Section -->
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
                                <span id="modalProductDiscount" class="discount-badge" style="display: none;"></span>
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
                                <a href="#" class="btn btn-primary whatsapp-order">
                                    <i class="fab fa-whatsapp" aria-hidden="true"></i>
                                    Order on WhatsApp
                                </a>
                                <button class="btn btn-outline-view add-to-wishlist-modal">
                                    <i class="far fa-heart" aria-hidden="true"></i>
                                    Add to Wishlist
                                </button>
                                <button class="btn btn-outline-view share-product-main-btn">
                                    <i class="fas fa-share-alt" aria-hidden="true"></i>
                                    Share Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Share Modal -->
        <div id="shareModal" class="modal share-modal" aria-hidden="true">
            <div class="modal-overlay">
                <div class="modal-content share-modal-content">
                    <button class="modal-close share-modal-close" aria-label="Close share modal">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div class="share-modal-header">
                        <h3>Share This Product</h3>
                        <p>Share this amazing product with your friends and family</p>
                    </div>
                    
                    <div class="share-options">
                        <button class="share-option" data-platform="whatsapp">
                            <div class="share-icon whatsapp">
                                <i class="fab fa-whatsapp"></i>
                            </div>
                            <span>WhatsApp</span>
                        </button>
                        
                        <button class="share-option" data-platform="facebook">
                            <div class="share-icon facebook">
                                <i class="fab fa-facebook-f"></i>
                            </div>
                            <span>Facebook</span>
                        </button>
                        
                        <button class="share-option" data-platform="twitter">
                            <div class="share-icon twitter">
                                <i class="fab fa-twitter"></i>
                            </div>
                            <span>Twitter</span>
                        </button>
                        
                        <button class="share-option" data-platform="telegram">
                            <div class="share-icon telegram">
                                <i class="fab fa-telegram"></i>
                            </div>
                            <span>Telegram</span>
                        </button>
                        
                        <button class="share-option" data-platform="copy">
                            <div class="share-icon copy">
                                <i class="fas fa-link"></i>
                            </div>
                            <span>Copy Link</span>
                        </button>
                        
                        <button class="share-option" data-platform="email">
                            <div class="share-icon email">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <span>Email</span>
                        </button>
                    </div>
                    
                    <div class="share-link-container">
                        <input type="text" id="shareableLink" readonly class="share-link-input">
                        <button class="btn btn-secondary copy-link-btn">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    
                    <div class="share-preview">
                        <div class="share-preview-image">
                            <img id="sharePreviewImage" src="" alt="">
                        </div>
                        <div class="share-preview-content">
                            <h4 id="sharePreviewTitle">Product Title</h4>
                            <p id="sharePreviewDescription">Product description...</p>
                            <div class="share-preview-price" id="sharePreviewPrice">UGX 0</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
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

// Gallery navigation functionality
function initGalleryNavigation(images, mainImageElement) {
    if (!images || images.length <= 1) return;
    
    let currentImageIndex = 0;
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    
    function updateMainImage(index) {
        if (images[index]) {
            mainImageElement.src = images[index];
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach((thumb, thumbIndex) => {
                thumb.classList.toggle('active', thumbIndex === index);
            });
            
            currentImageIndex = index;
        }
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateMainImage(newIndex);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % images.length;
            updateMainImage(newIndex);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('quickViewModal').classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            const newIndex = (currentImageIndex - 1 + images.length) % images.length;
            updateMainImage(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = (currentImageIndex + 1) % images.length;
            updateMainImage(newIndex);
        }
    });
}

// Video thumbnail helpers
function extractVideoId(url) {
    if (!url) return null;
    
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatch) return youtubeMatch[1];
    
    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
    if (vimeoMatch) return vimeoMatch[1];
    
    return null;
}

function getVideoThumbnail(url, videoId) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (url.includes('vimeo.com')) {
        return `https://vumbnail.com/${videoId}.jpg`;
    } else {
        return '/placeholder.svg';
    }
}

// Video modal functionality
function openVideoModal(videoUrl, productName) {
    // Create video modal
    const videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        padding: 20px;
    `;
    
    videoModal.innerHTML = `
        <div class="video-modal-content" style="position: relative; max-width: 90%; max-height: 90%;">
            <button class="video-modal-close" style="position: absolute; top: -40px; right: 0; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
            <div class="video-container" style="width: 800px; max-width: 90vw; height: 450px; max-height: 80vh;">
                <iframe 
                    src="${getEmbedUrl(videoUrl)}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%; border-radius: 8px;"
                    title="${productName} - Video"
                ></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(videoModal);
    
    // Close functionality
    const closeBtn = videoModal.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(videoModal);
    });
    
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            document.body.removeChild(videoModal);
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.contains(videoModal)) {
            document.body.removeChild(videoModal);
        }
    });
}

function getEmbedUrl(url) {
    const videoId = extractVideoId(url);
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes('vimeo.com')) {
        return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    } else {
        return url; // Direct video URL
    }
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

    // Store site data globally for quick view access
    window.siteData = siteData; // ← ADD THIS LINE
    console.log('Site data loaded and stored globally:', siteData);

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
    
    console.log('Updating products section with:', productsData.length, 'products');
    
    // Store products globally for URL access
    window.siteData = window.siteData || {};
    window.siteData.products = productsData;
    
    // Clear existing products
    const existingProductCards = productsGrid.querySelectorAll('.product-card');
    console.log('Removing existing product cards:', existingProductCards.length);
    existingProductCards.forEach(card => card.remove());
    
    // Add products from site-config.json
    productsData.forEach(product => {
        if (product.status !== 'hidden') {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        }
    });
    
    console.log('Products section updated. Total cards:', productsGrid.querySelectorAll('.product-card').length);
    
    // Re-initialize quick view after products are loaded
    setTimeout(() => {
        initQuickView();
    }, 1000);
}

function createProductCard(product) {
    const productCard = document.createElement('article');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    
    const formattedPrice = new Intl.NumberFormat('en-UG').format(product.price);
    const ratingStars = generateRatingStars(product.rating || 5);
    
    // Use first image from images array, or fallback to single image
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${mainImage}" alt="${product.name}" loading="lazy">
            ${product.images && product.images.length > 1 ? `<div class="multi-image-badge">+${product.images.length - 1} more</div>` : ''}
            ${product.videos && product.videos.length > 0 ? `<div class="video-badge"><i class="fas fa-video"></i> ${product.videos.length}</div>` : ''}
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
                ${product.originalPrice ? `<span class="original-price">UGX ${new Intl.NumberFormat('en-UG').format(product.originalPrice)}</span>
                <span class="discount-badge">${Math.round((1 - product.price / product.originalPrice) * 100)}% Off</span>` : ''}
            </div>
            
            
            <p><small>Stock: <span class="stock-${product.stock || 'in-stock'}">${getStockStatusText(product.stock)}</span></small></p>
            
            <div class="product-rating">
                <div class="stars" aria-label="${product.rating} out of 5 stars">
                    ${ratingStars}
                </div>
                <span class="rating-count">(${product.reviewCount || 0} reviews)</span>
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

// Initialize share functionality
function initShareFunctionality() {
    const shareProductBtn = document.getElementById('shareProductBtn');
    const shareProductMainBtn = document.querySelector('.share-product-main-btn');
    const shareModal = document.getElementById('shareModal');
    const shareModalClose = document.querySelector('.share-modal-close');
    const shareOptions = document.querySelectorAll('.share-option');
    const copyLinkBtn = document.querySelector('.copy-link-btn');
    const shareableLink = document.getElementById('shareableLink');

    // Floating share button
    if (shareProductBtn) {
        shareProductBtn.addEventListener('click', openShareModal);
    }

    // Main share button
    if (shareProductMainBtn) {
        shareProductMainBtn.addEventListener('click', openShareModal);
    }

    // Close share modal
    if (shareModalClose) {
        shareModalClose.addEventListener('click', closeShareModal);
    }

    // Close modal when clicking outside
    if (shareModal) {
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                closeShareModal();
            }
        });
    }

    // Share options
    shareOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const platform = e.currentTarget.dataset.platform;
            shareProduct(platform);
        });
    });

    // Copy link button
    if (copyLinkBtn && shareableLink) {
        copyLinkBtn.addEventListener('click', () => {
            copyToClipboard(shareableLink.value);
            showShareSuccess('Product link copied to clipboard!');
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shareModal.classList.contains('active')) {
            closeShareModal();
        }
    });
}

// Create a URL-friendly slug from product title
function createProductSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .substring(0, 50); // Limit length
}

// Generate unique product URL
function generateProductUrl(slug, productId) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?product=${slug}&id=${productId}`;
}

// Get current product data from quick view
function getCurrentProductData() {
    // Try to get data from the stored product first (more accurate)
    if (window.currentProductData) {
        const product = window.currentProductData;
        const productSlug = createProductSlug(product.name);
        const productUrl = generateProductUrl(productSlug, product.id);
        
        return {
            title: product.name,
            description: product.description || 'Check out this amazing product from Will\'s Tech Store!',
            price: `UGX ${formatPrice(product.price || 0)}`,
            image: product.images && product.images.length > 0 ? product.images[0] : product.image || '/placeholder.svg',
            url: productUrl,
            slug: productSlug,
            product: product,
            id: product.id
        };
    }
    
    // Fallback to DOM data
    const title = document.getElementById('modalProductTitle')?.textContent;
    const description = document.getElementById('modalProductDescription')?.textContent;
    const price = document.getElementById('modalProductPrice')?.textContent;
    const image = document.getElementById('modalProductImage')?.src;
    
    if (!title) return null;
    
    // Create a unique product URL
    const productSlug = createProductSlug(title);
    const productUrl = generateProductUrl(productSlug, 'unknown');
    
    return {
        title: title,
        description: description || 'Check out this amazing product from Will\'s Tech Store!',
        price: price || '',
        image: image || '/placeholder.svg',
        url: productUrl,
        slug: productSlug,
        id: 'unknown'
    };
}

// Update share modal content
function updateShareModalContent(product) {
    // Update preview
    document.getElementById('sharePreviewTitle').textContent = product.title;
    document.getElementById('sharePreviewDescription').textContent = product.description;
    document.getElementById('sharePreviewPrice').textContent = product.price;
    document.getElementById('sharePreviewImage').src = product.image;
    
    // Update shareable link
    const shareableLink = document.getElementById('shareableLink');
    if (shareableLink) {
        shareableLink.value = product.url;
    }
    
    // Store current product for sharing
    window.currentSharedProduct = product;
}

// Share product on different platforms
function shareProduct(platform) {
    const product = window.currentSharedProduct;
    if (!product) return;

    const text = `🚀 Check out "${product.title}" at Will's Tech Store! ${product.price} - ${product.description.substring(0, 100)}...`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(product.url);

    let shareUrl = '';

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
            break;
            
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
            break;
            
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
            break;
            
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(product.title)}&body=${encodedText}%0A%0A${encodedUrl}`;
            break;
            
        case 'copy':
            copyToClipboard(product.url);
            showShareSuccess('Product link copied to clipboard!');
            return;
            
        default:
            return;
    }

    // Open share window
    if (platform !== 'email') {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    } else {
        window.location.href = shareUrl;
    }
    
    // Show success message
    showShareSuccess(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`);
    
    // Track share event
    trackShareEvent(platform, product.title);
    
    // Close modal after a delay
    setTimeout(closeShareModal, 1000);
}

// Track share events
function trackShareEvent(platform, productTitle) {
    console.log(`Product shared: ${productTitle} on ${platform}`);
    
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
            'event_category': 'Product Sharing',
            'event_label': platform,
            'value': 1
        });
    }
}

// Open share modal
function openShareModal() {
    const shareModal = document.getElementById('shareModal');
    const quickViewModal = document.getElementById('quickViewModal');
    const currentProduct = getCurrentProductData();
    
    if (!currentProduct) return;
    
    // Update share modal content
    updateShareModalContent(currentProduct);
    
    // Show share modal
    shareModal.classList.add('active');
    shareModal.setAttribute('aria-hidden', 'false');
    
    // Hide quick view modal temporarily
    if (quickViewModal) {
        quickViewModal.style.visibility = 'hidden';
    }
}

// Close share modal
function closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    const quickViewModal = document.getElementById('quickViewModal');
    
    shareModal.classList.remove('active');
    shareModal.setAttribute('aria-hidden', 'true');
    
    // Show quick view modal again
    if (quickViewModal) {
        quickViewModal.style.visibility = 'visible';
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard');
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Show share success message
function showShareSuccess(message) {
    // Remove existing success message
    const existingSuccess = document.querySelector('.share-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const success = document.createElement('div');
    success.className = 'share-success';
    success.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(success);

    // Remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(success)) {
            document.body.removeChild(success);
        }
    }, 3000);
}

// Manual re-initialization function
function reinitQuickView() {
    console.log('Manually re-initializing quick view...');
    initQuickView();
}

// Make it globally available
window.reinitQuickView = reinitQuickView;


// Add this temporarily to debug
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quick view buttons found:', document.querySelectorAll('.quick-view-btn').length);
    
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Quick view button clicked!');
        });
    });
});
// Add CSS for site improvement notification animations
const siteImprovementNotificationCSS = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.site-improvement-notification {
    animation: slideInRight 0.5s ease-out;
}

.site-improvement-notification button {
    transition: all 0.2s ease;
}

.site-improvement-notification ul li {
    margin-bottom: 4px;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .site-improvement-notification {
        right: 10px;
        left: 10px;
        max-width: none;
        top: 80px;
    }
}

@media (max-width: 480px) {
    .site-improvement-notification {
        padding: 1rem;
    }
    
    .site-improvement-notification h4 {
        font-size: 1rem;
    }
    
    .site-improvement-notification p, 
    .site-improvement-notification ul {
        font-size: 0.8rem;
    }
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = siteImprovementNotificationCSS;
document.head.appendChild(style);