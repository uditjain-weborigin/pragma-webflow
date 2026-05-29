document.querySelectorAll(".js-toggle-mobile").forEach((element) => {
  // Header
  element.addEventListener("click", function () {
    this.classList.toggle("active");
    document.querySelector(".menuBox").classList.toggle("active");
    document.getElementById("headerCntr").classList.toggle("active");
  });

  // parallax
  parallax(".js-parallax");
  function parallax(selector, speed = 1, dir = false) {
    let els = document.querySelectorAll(selector);

    for (const el of els) {
      let img = el.querySelector("img");
      let w = img.offsetWidth;
      let h = img.offsetHeight;

      el.style.overflow = "hidden";
      img.style.scale = 1 + speed / 10;
    }

    let ticking = false;

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          for (const el of els) {
            let img = el.querySelector("img");
            let elBox = el.getBoundingClientRect();
            let dirc = dir || el.hasAttribute("data-par-reverse");
            let y =
              ((window.innerHeight / 2 - elBox.top) / window.innerHeight) *
                100 *
                speed -
              50;

            img.style.transform = `translateY(${dirc ? -1 * y : y}px)`;
          }
          ticking = false;
        });

        ticking = true;
      }
    });
  }

  //Brand Slider
  var swiper = new Swiper(".js-brand-slider", {
    slidesPerView: 1.05,
    centeredSlides: true,
    spaceBetween: 16,
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 0,
        centeredSlides: false,
      },
    },
  });

  //Feature Slider
  var swiper = new Swiper(".js-feature-slide", {
    direction: "vertical",
    slidesPerView: 1,
    mousewheel: {
      releaseOnEdges: true,
    },
    pagination: {
      el: ".featureBox .swiper-pagination",
      clickable: true,
    },
  });

  var swiper = new Swiper(".js-sub-product-slider", {
    speed: 5000,
    direction: "horizontal",
    loop: true,
    slidesPerView: 3,
    freeMode: true,
    zoom: true,
    keyboard: true,
    pagination: false,
    navigation: false,

    autoplay: {
      delay: 0,
    },

    breakpoints: {
      765: {
        slidesPerView: 1,
      },
      1000: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });

  // Reviews Slider with Auto-scroll
  var reviewsSwiper = new Swiper(".js-sub-product-reviews", {
    slidesPerView: 1.5, // Mobile: show center + part of sides
    centeredSlides: true,
    spaceBetween: 16,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    breakpoints: {
      768: {
        slidesPerView: 1.5, // Tablet
        centeredSlides: true,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 2, // Desktop: Center full + half of left/right
        centeredSlides: true,
        spaceBetween: 40, // Increased gap for better separation
      },
    },
  });

  // Team Slider (About Us)
  var teamSlider = document.querySelector(".js-team-slider");
  var teamSwiperInstance = null;
  var isCurrentlyMobile = null; // null means not initialized yet
  
  if (teamSlider) {
    // Store all cards once
    var allCards = Array.from(teamSlider.querySelectorAll(".team-card"));
    var swiperWrapper = teamSlider.querySelector(".swiper-wrapper");
    
    function buildTeamSlider() {
      if (allCards.length === 0) return;
      var isMobile = window.innerWidth <= 768;
      
      // If the state hasn't changed, do nothing
      if (isCurrentlyMobile === isMobile) return;
      
      // Destroy old swiper instance if exists
      if (teamSwiperInstance) {
        teamSwiperInstance.destroy(true, true);
      }
      
      swiperWrapper.innerHTML = ''; // clear wrapper
      
      var chunkSize = isMobile ? 4 : 12;
      
      for (var i = 0; i < allCards.length; i += chunkSize) {
        var chunk = allCards.slice(i, i + chunkSize);
        var slide = document.createElement("div");
        slide.className = "swiper-slide";
        var grid = document.createElement("div");
        grid.className = "team-slide-grid";
        
        chunk.forEach(function(card) {
          grid.appendChild(card);
        });
        
        slide.appendChild(grid);
        swiperWrapper.appendChild(slide);
      }
      
      // Re-initialize swiper
      teamSwiperInstance = new Swiper(".js-team-slider", {
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".team-slider-next",
          prevEl: ".team-slider-prev",
        },
        pagination: {
          el: ".team-slider-pagination",
          clickable: true,
        },
        autoplay: isMobile ? { delay: 10000, disableOnInteraction: false } : false,
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
            autoplay: false,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 64,
            autoplay: false,
          },
        },
      });
      
      isCurrentlyMobile = isMobile;
    }
    
    // Initial build
    buildTeamSlider();
    
    // Rebuild on resize
    window.addEventListener("resize", function() {
      buildTeamSlider();
    });
  }

  // Vision Timeline Scroll Observer
  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    { threshold: 0.3 },
  );

  const timelineEl = document.getElementById("vm-timeline");
  if (timelineEl) {
    timelineObserver.observe(timelineEl);
  }

  // Blog Filter and Multiselect Logic
  const multiselect = document.querySelector('.custom-multiselect');
  const searchInput = document.getElementById('blog-search-input');
  const chipsRow = document.getElementById('filter-chips-row');
  const chipsList = document.getElementById('chips-list');
  const chipsToggle = document.getElementById('chips-toggle');

  if (multiselect && searchInput && chipsRow && chipsList) {
    const header = multiselect.querySelector('.multiselect-header');
    const options = multiselect.querySelectorAll('.option-item input');
    let selectedTags = [];

    // Add clear icon to search box
    const searchBox = searchInput.parentElement;
    const clearSearchBtn = document.createElement('div');
    clearSearchBtn.className = 'clear-search';
    clearSearchBtn.innerHTML = 'x';
    searchBox.appendChild(clearSearchBtn);

    // Toggle dropdown
    header.addEventListener('click', (e) => {
      e.stopPropagation();
      multiselect.classList.toggle('active');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!multiselect.contains(e.target)) {
        multiselect.classList.remove('active');
      }
    });

    // Toggle chips row collapse/expand
    if (chipsToggle) {
      chipsToggle.addEventListener('click', () => {
        chipsRow.classList.toggle('collapsed');
      });
    }

    // Search input clear logic
    searchInput.addEventListener('input', () => {
      if (searchInput.value.trim() !== "") {
        searchBox.classList.add('has-text');
      } else {
        searchBox.classList.remove('has-text');
      }
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = "";
      searchBox.classList.remove('has-text');
      searchInput.focus();
    });

    function updateChips() {
      chipsList.innerHTML = '';
      
      // Tag chips only
      selectedTags.forEach(tag => {
        const chip = createChip(tag, 'tag');
        chipsList.appendChild(chip);
      });

      // Update header text
      const selectedText = multiselect.querySelector('.selected-text');
      if (selectedTags.length > 0) {
        selectedText.textContent = `${selectedTags.length} tags selected`;
        selectedText.style.color = '#000';
      } else {
        selectedText.textContent = 'Select max 3 tags';
        selectedText.style.color = 'rgba(0, 0, 0, 0.5)';
      }

      // Show/Hide row based on tags
      if (selectedTags.length > 0) {
        chipsRow.classList.add('active');
      } else {
        chipsRow.classList.remove('active');
      }
    }

    function createChip(text, type) {
      const div = document.createElement('div');
      div.className = 'chip';
      div.innerHTML = `<span>${text}</span><div class="chip-close">x</div>`;
      div.querySelector('.chip-close').addEventListener('click', (e) => {
        e.stopPropagation();
        selectedTags = selectedTags.filter(t => t !== text);
        const input = multiselect.querySelector(`input[value="${text}"]`);
        if (input) input.checked = false;
        updateChips();
      });
      return div;
    }

    options.forEach(input => {
      input.addEventListener('change', () => {
        if (input.checked) {
          if (selectedTags.length >= 3) {
            input.checked = false;
            return;
          }
          selectedTags.push(input.value);
        } else {
          selectedTags = selectedTags.filter(t => t !== input.value);
        }
        updateChips();
      });
    });
  }
});

const features = [
  {
    id: "1",
    title: "Excellent support across all the channels",
    description: "",
    details: {
      orderId: "#765BFDGJ986",
      date: "Oct 23, 2025, 4:31 PM",
      customerType: "Customer",
      product: {
        image: "assets/images/green-vans.png",
        name: "Air Shoes | Causla Sneakers | Men Footwear",
        price: "₹ 600",
        qty: 1,
        sku: "D6290-7-UK",
      },
      returnReason: "The product arrived too late",
      metricText:
        "Meanwhile, a fashion label in Jaipur sees a similar pattern: customers love the designs, keep the items in cart for days, but don't convert until a heavy discount appears. And when the discount doesn't appear, neither does the order.",
    },
  },
  {
    id: "2",
    title: "Seamless integration with your tools",
    description: "",
    details: {
      orderId: "#999ABC123",
      date: "Oct 24, 2025, 10:00 AM",
      customerType: "Business",
      product: {
        image: "assets/images/shoe.jpg",
        name: "Classic Leather Boots | Urban Walkers",
        price: "₹ 1200",
        qty: 2,
        sku: "BT-101-BLK",
      },
      returnReason: "Wrong size ordered",
      metricText:
        "Integration metrics show a 20% increase in workflow efficiency.",
    },
  },
  {
    id: "3",
    title: "Real-time analytics and reporting",
    description: "",
    details: {
      orderId: "#111XYZ789",
      date: "Oct 25, 2025, 2:15 PM",
      customerType: "VIP",
      product: {
        image: "assets/images/shoe.jpg",
        name: "Running Spikes | Pro Athlete Series",
        price: "₹ 2500",
        qty: 1,
        sku: "RN-555-RED",
      },
      returnReason: "Defective item",
      metricText:
        "Real-time data indicates a spike in returns during the holiday season.",
    },
  },
  {
    id: "4",
    title: "Advanced automation workflows",
    description: "",
    details: {
      orderId: "#222LMN456",
      date: "Oct 26, 2025, 9:45 AM",
      customerType: "New",
      product: {
        image: "assets/images/shoe.jpg",
        name: "Casual Loafers | Weekend Vibes",
        price: "₹ 800",
        qty: 1,
        sku: "LF-333-BRN",
      },
      returnReason: "Changed mind",
      metricText: "Automation has reduced manual processing time by 40%.",
    },
  },
  {
    id: "5",
    title: "24/7 dedicated customer support",
    description: "",
    details: {
      orderId: "#333OPQ789",
      date: "Oct 27, 2025, 5:30 PM",
      customerType: "Enterprise",
      product: {
        image: "assets/images/shoe.jpg",
        name: "Formal Oxfords | Executive Collection",
        price: "₹ 3000",
        qty: 5,
        sku: "OX-777-BLK",
      },
      returnReason: "Bulk order error",
      metricText:
        "Our support team resolved 95% of tickets within the first hour.",
    },
  },
];

/**
 * Validates and gets the icon SVG string from the template
 */
function getIconHtml(templateId) {
  const template = document.getElementById(templateId);
  return template ? template.innerHTML : "";
}

/**
 * State
 */
let state = {
  selectedId: features[0].id,
  // Interaction state for animations (blinking arrow)
  hasInteracted: false,
  // For mobile accordion
  openAccordionId: features[0].id,
};

/**
 * DOM Elements
 */
const elems = {
  mobileAccordion: document.getElementById("mobile-accordion"),
  desktopList: document.getElementById("desktop-list"),
  desktopDisplay: document.getElementById("feature-display"),
};

/**
 * Render Content Helper (Used for both Desktop and Mobile content blocks)
 */
function createContentHtml(feature) {
  const { details } = feature;
  const arrowIcon = getIconHtml("icon-arrow-left");
  const refreshIcon = getIconHtml("icon-refresh");

  // In a real scenario, use actual image paths. Here using placeholder logic if needed,
  // or just utilizing the string provided in data.
  // Note: 'details.product.image' is a path string.

  return `
    <div class="feature-card-wrapper">
      <div class="feature-card">
        <div class="card-content">
          <div class="card-header">
            <div class="header-left">
              ${arrowIcon}
              <div class="order-info">
                <div class="order-id-row">
                  <span class="order-id">${details.orderId}</span>
                  <span class="badge">${details.customerType}</span>
                </div>
                <p class="order-date">${details.date}</p>
              </div>
            </div>
            <div class="icon-wrapper">
              ${refreshIcon}
            </div>
          </div>

          <div class="return-label">RETURN ITEM</div>

          <div class="product-info">
            <div class="product-image">
               <!-- Using a broken image placeholder style or actual image if exists -->
               <img src="${details.product.image}" alt="${details.product.name}" onerror="this.style.display='none'" />
            </div>
            <div class="product-details">
              <p class="product-name">${details.product.name}</p>
              <p class="product-size">7 UK</p>
              <div class="product-meta">
                <span class="price">${details.product.price}</span>
                <span class="qty">Qty: x${details.product.qty}</span>
                <span class="sku-text">${details.product.sku}</span>
              </div>
            </div>
          </div>

          <div class="reason-box">
             <p class="reason-text">Reason: ${details.returnReason}</p>
          </div>
        </div>
      </div>

      <div class="metric-text-wrapper">
        <p class="metric-text">${details.metricText}</p>
      </div>
    </div>
  `;
}

/**
 * Initialization
 */
function init() {
  // Always update refs in case of navigation/re-render if SPA, though here it's likely static.
  elems.mobileAccordion = document.getElementById("mobile-accordion");
  elems.desktopList = document.getElementById("desktop-list");
  elems.desktopDisplay = document.getElementById("feature-display");

  if (elems.mobileAccordion && elems.desktopList && elems.desktopDisplay) {
    renderMobile();
    renderDesktop();
  }
}

/**
 * Render Mobile Accordion
 */
function renderMobile() {
  if (!elems.mobileAccordion) return;
  elems.mobileAccordion.innerHTML = features
    .map((feature) => {
      const isOpen = state.openAccordionId === feature.id;
      const chevronIcon = getIconHtml("icon-chevron-down");

      const shouldPulse =
        !state.hasInteracted && !isOpen ? "animate-pulse" : "";
      const activeClass = isOpen ? "active" : "";

      return `
        <div class="accordion-item ${activeClass}" data-id="${feature.id}">
          <button class="accordion-trigger" onclick="handleAccordionClick('${feature.id}')">
            <span class="accordion-title">${feature.title}</span>
            <div class="accordion-icon ${shouldPulse}">
              ${chevronIcon}
            </div>
          </button>
          <div class="accordion-content">
            <div class="accordion-content-inner">
              ${createContentHtml(feature)}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Handle Accordion Click
 */
window.handleAccordionClick = (id) => {
  state.openAccordionId = id;
  if (!state.hasInteracted) {
    state.hasInteracted = true;
  }
  renderMobile(); // Re-render to update classes/state
};

/**
 * Render Desktop Sidebar List
 */
function renderDesktop() {
  if (!elems.desktopList || !elems.desktopDisplay) return;
  // Render List
  elems.desktopList.innerHTML = features
    .map((feature) => {
      const isActive = state.selectedId === feature.id;
      const activeClass = isActive ? "active" : "";
      const activeIndicator = isActive
        ? '<div class="active-indicator"></div>'
        : "";
      const separator = !isActive
        ? '<div class="list-item-separator"></div>'
        : "";

      return `
      <button class="list-item ${activeClass}" onclick="handleDesktopClick('${feature.id}')">
        ${activeIndicator}
        ${separator}
        <span class="list-item-text">${feature.title}</span>
      </button>
    `;
    })
    .join("");

  // Render Content
  const activeFeature =
    features.find((f) => f.id === state.selectedId) || features[0];
  elems.desktopDisplay.innerHTML = createContentHtml(activeFeature);
}

/**
 * Handle Desktop List Click
 */
window.handleDesktopClick = (id) => {
  state.selectedId = id;
  renderDesktop(); // Re-render only list and content
};

// Feature Sidebar and Accordion
document.addEventListener("DOMContentLoaded", function () {
  // Existing init call
  if (typeof init === "function") init();

  // KB Mobile TOC Toggle
  document.querySelectorAll(".js-kb-toc-toggle").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  // Mobile Floating Summary Sidebar
  const floatSummary = document.querySelector(".js-mobile-float-summary");
  const summaryBox = document.querySelector(".kb-summary-box");

  if (floatSummary && summaryBox) {
    window.addEventListener("scroll", function () {
      const summaryBoxRect = summaryBox.getBoundingClientRect();
      // Show floating sidebar only when user scrolls past the top summarize section
      if (summaryBoxRect.bottom < 0) {
        floatSummary.classList.add("is-visible");
      } else {
        floatSummary.classList.remove("is-visible");
        floatSummary.classList.remove("is-open"); // Close if user scrolls back up
      }
    });

    // Toggle Expansion
    document.querySelectorAll(".js-toggle-float-summary").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        floatSummary.classList.toggle("is-open");
      });
    });
  }

  // Pricing Mobile Accordion Toggle
  document.querySelectorAll(".js-pricing-toggle").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".pricingCard");

      // Toggle the expanded class on the card
      card.classList.toggle("is-expanded");

      // Update button text and icon based on state
      if (card.classList.contains("is-expanded")) {
        this.innerHTML =
          'Show Less <span class="toggle-icon"><img src="assets/images/pricing/arrow-up.png" alt="Show Less" /></span>';
      } else {
        this.innerHTML =
          'Show More <span class="toggle-icon"><img src="assets/images/pricing/arrow-down.png" alt="Show More" /></span>';
      }
    });
  });
});

/* ==========================================================================
   Partners & Integrations Page Logic
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".js-toggle-expand");
  if (toggleBtn) {
    const btnLabel = toggleBtn.querySelector(".btn-label");
    const extraItems = document.querySelectorAll(".extra-item");
    const logisticsSection =
      document.querySelector("#logistics-section") ||
      document.querySelector(".gray-block");

    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.classList.toggle("is-expanded");

      extraItems.forEach((item) => {
        item.classList.toggle("hidden");
      });

      if (btnLabel) {
        btnLabel.textContent = isExpanded ? "Show Less" : "Show More";
      }

      // If collapsing, scroll back to the start of the section
      if (!isExpanded && logisticsSection) {
        logisticsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
});

/* ==========================================================================
   SALES CONTACT FORM — Sidebar Icon Loop Animation
   Extracted from: sales-contact-form.html <script> block
   ---------------------------------------------------------------------
   Cycles through all [data-sidebar-icon] elements, lighting each one up
   in Pragma blue (via the CSS class .is-active) one at a time.
   - Interval: 1200ms per icon
   - Runs automatically on page load if any sidebar icons exist in the DOM.
   - The active blue styling is defined in assets/styles/main.css under
     the "[data-sidebar-icon].is-active img" rule.
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const sidebarIcons = document.querySelectorAll("[data-sidebar-icon]");

  // Guard: only run on pages that have the contact-form sidebar
  if (!sidebarIcons.length) return;

  let currentIconIndex = 0;

  // Activate the first icon immediately on load
  sidebarIcons[currentIconIndex].classList.add("is-active");

  // Cycle through icons every 1200ms in a continuous loop
  setInterval(function () {
    // Remove active state from the current icon
    sidebarIcons[currentIconIndex].classList.remove("is-active");

    // Advance to the next icon (wraps back to 0 after the last)
    currentIconIndex = (currentIconIndex + 1) % sidebarIcons.length;

    // Apply active state to the new current icon
    sidebarIcons[currentIconIndex].classList.add("is-active");
  }, 1200);
});
/* ── END: Sales Contact Form Sidebar Animation ──────────────── */
