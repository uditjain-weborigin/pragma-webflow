/**
 * single-blog-article.js
 * Extracted from single-blog-article.html for CDN delivery via jsDelivr.
 *
 * Fixes applied:
 *   - All DOMContentLoaded listeners replaced with domReady() guard so the
 *     script works whether it runs before or after the DOM is ready (which
 *     is the case when loaded asynchronously via fetch/CDN).
 */

// ─── domReady guard ────────────────────────────────────────────────────────────
// Runs fn() immediately if the DOM is already parsed, otherwise waits for the
// DOMContentLoaded event. This is the key fix for CDN-loaded scripts.
function domReady(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}


// =============================================================================
// AI Summarise Script
// Builds a pre-filled prompt with the current page URL and opens the
// selected AI tool in a new tab with the prompt pre-loaded.
// =============================================================================
(function () {
  // ── Prompt Template ──────────────────────────────────────────────────────────
  function buildPrompt(pageUrl) {
    return (
      "Summarise this blog for Indian D2C eCommerce teams.\n" +
      "URL: " + pageUrl + "\n\n" +
      "Requirements:\n" +
      "• Prioritise the most important insights first.\n" +
      "• Clearly mention the Pragma product(s), workflow(s), or capability layer(s) covered in a technical/niche manner.\n" +
      "• Collate all key numbers, benchmarks, percentages, and operational stats from the blog.\n" +
      "• Keep the output concise, technical, and insight-dense.\n" +
      "• Avoid fluff, generic explanations, and marketing language.\n" +
      "• Use short paragraphs or bullets for readability.\n" +
      "• End with: Author: [Name] — [brief expertise]"
    );
  }

  // ── AI deep-link builders ────────────────────────────────────────────────────
  function getAiUrl(ai, prompt) {
    var encoded = encodeURIComponent(prompt);
    switch (ai) {
      case "chatgpt":
        return "https://chatgpt.com/?q=" + encoded;
      case "perplexity":
        return "https://www.perplexity.ai/?q=" + encoded;
      case "gemini":
        return "https://www.google.com/search?udm=50&q=" + encoded;
      case "grok":
        return "https://grok.com/?q=" + encoded;
      default:
        return "#";
    }
  }

  // ── Wire up all .js-ai-summarise buttons ─────────────────────────────────────
  domReady(function () {
    var pageUrl = window.location.href;
    var prompt  = buildPrompt(pageUrl);

    var buttons = document.querySelectorAll(".js-ai-summarise");
    buttons.forEach(function (btn) {
      var ai  = btn.getAttribute("data-ai");
      var url = getAiUrl(ai, prompt);
      btn.setAttribute("href", url);
    });
  });
})();


// =============================================================================
// 25% Scroll — Subscriber Popup Script
// =============================================================================
(function () {
  var STORAGE_KEY      = "pragma_subscriber_popup_dismissed";
  var SCROLL_THRESHOLD = 0.25; // 25%
  var hasTriggered     = false;

  function getArticleScrollPercent() {
    var scrollTop  = window.scrollY || document.documentElement.scrollTop;
    var docHeight  =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (docHeight <= 0) return 0;
    return scrollTop / docHeight;
  }

  function openPopup() {
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    var modal   = document.querySelector(".js-scroll-popup-modal");
    if (!overlay || !modal) return;
    overlay.classList.add("is-active");
    modal.classList.add("is-active");
    document.body.style.overflow = "hidden";
    var emailInput = modal.querySelector(".scroll-popup-input");
    if (emailInput) {
      setTimeout(function () { emailInput.focus(); }, 350);
    }
  }

  function closePopup() {
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    var modal   = document.querySelector(".js-scroll-popup-modal");
    if (!overlay || !modal) return;
    overlay.classList.remove("is-active");
    modal.classList.remove("is-active");
    document.body.style.overflow = "";
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
  }

  function onScroll() {
    if (hasTriggered) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch (e) {}
    var percent = getArticleScrollPercent();
    if (percent >= SCROLL_THRESHOLD) {
      hasTriggered = true;
      window.removeEventListener("scroll", onScroll);
      openPopup();
    }
  }

  domReady(function () {
    // Close button
    var closeBtns = document.querySelectorAll(".js-scroll-popup-close");
    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", closePopup);
    });

    // Backdrop click
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    if (overlay) {
      overlay.addEventListener("click", closePopup);
    }

    // Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopup();
    });

    // Form submit — wire to your email service
    var form = document.querySelector(".js-scroll-popup-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = form.querySelector(".scroll-popup-input");
        var email      = emailInput ? emailInput.value.trim() : "";
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (emailInput) {
            emailInput.style.borderColor = "#ef4444";
            emailInput.focus();
            setTimeout(function () {
              emailInput.style.borderColor = "";
            }, 2000);
          }
          return;
        }
        // TODO: Replace with your email service API call
        console.log("Subscriber email:", email);
        closePopup();
      });
    }

    // Attach scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });
  });
})();


// =============================================================================
// 50% Scroll — Get a Demo Popup Script
// =============================================================================
(function () {
  var DEMO_STORAGE_KEY = "pragma_demo_popup_dismissed";
  var DEMO_THRESHOLD   = 0.50; // 50%
  var demoTriggered    = false;

  function getScrollPercent() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    if (docHeight <= 0) return 0;
    return scrollTop / docHeight;
  }

  function openDemoPopup() {
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    var modal   = document.querySelector(".js-demo-popup-modal");
    if (!overlay || !modal) return;
    overlay.classList.add("is-active");
    modal.classList.add("is-active");
    document.body.style.overflow = "hidden";
    var firstInput = modal.querySelector(".demo-popup-input");
    if (firstInput) {
      setTimeout(function () { firstInput.focus(); }, 350);
    }
  }

  function closeDemoPopup() {
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    var modal   = document.querySelector(".js-demo-popup-modal");
    if (!overlay || !modal) return;
    overlay.classList.remove("is-active");
    modal.classList.remove("is-active");
    document.body.style.overflow = "";
    try { sessionStorage.setItem(DEMO_STORAGE_KEY, "1"); } catch (e) {}
  }

  function onDemoScroll() {
    if (demoTriggered) return;
    try {
      if (sessionStorage.getItem(DEMO_STORAGE_KEY)) return;
    } catch (e) {}
    if (getScrollPercent() >= DEMO_THRESHOLD) {
      demoTriggered = true;
      window.removeEventListener("scroll", onDemoScroll);
      openDemoPopup();
    }
  }

  domReady(function () {
    // Close button
    var closeBtns = document.querySelectorAll(".js-demo-popup-close");
    closeBtns.forEach(function (btn) {
      btn.addEventListener("click", closeDemoPopup);
    });

    // Shared backdrop — also closes demo popup
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    if (overlay) {
      overlay.addEventListener("click", function () {
        var demoModal = document.querySelector(".js-demo-popup-modal");
        if (demoModal && demoModal.classList.contains("is-active")) {
          closeDemoPopup();
        }
      });
    }

    // Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDemoPopup();
    });

    // Form submit — wire to your CRM / demo booking service
    var form = document.querySelector(".js-demo-popup-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = document.getElementById("demo-popup-email");
        var email      = emailInput ? emailInput.value.trim() : "";
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          if (emailInput) {
            emailInput.style.borderColor = "#ef4444";
            emailInput.focus();
            setTimeout(function () {
              emailInput.style.borderColor = "";
            }, 2000);
          }
          return;
        }
        // TODO: Replace with your demo booking / CRM API call
        console.log("Demo request:", {
          phone:   document.getElementById("demo-popup-phone")   ? document.getElementById("demo-popup-phone").value   : "",
          email:   email,
          website: document.getElementById("demo-popup-website") ? document.getElementById("demo-popup-website").value : ""
        });
        closeDemoPopup();
      });
    }

    // Attach scroll listener
    window.addEventListener("scroll", onDemoScroll, { passive: true });
  });
})();


// =============================================================================
// Single Blog Article Page Scripts
// Handles TOC toggles, Floating Summary, and Scroll Interactions
// =============================================================================
domReady(function () {

  // 1. KB Mobile TOC Toggle
  // Toggles the visibility of the Table of Contents on mobile devices
  const tocToggles = document.querySelectorAll(".js-kb-toc-toggle");
  tocToggles.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      const content = this.nextElementSibling;
      if (
        content &&
        content.classList.contains("kb-mobile-toc-content")
      ) {
        content.classList.toggle("is-visible");
      }
    });
  });

  // 2. Mobile Floating Summary Sidebar
  // Shows/hides the floating summary button based on scroll position
  // and handles the expansion/collapse of the summary panel
  const floatSummary = document.querySelector(".js-mobile-float-summary");
  const summaryBox   = document.querySelector(".kb-summary-box");

  if (floatSummary && summaryBox) {
    const handleScroll = () => {
      const summaryBoxRect = summaryBox.getBoundingClientRect();
      // Show floating sidebar only when user scrolls past the top summarize section
      if (summaryBoxRect.bottom < 0) {
        floatSummary.classList.add("is-visible");
      } else {
        floatSummary.classList.remove("is-visible");
        floatSummary.classList.remove("is-open"); // Close if user scrolls back up
      }

      // Top Fade Effect & Mobile TOC Sticky Logic
      const topFade  = document.querySelector(".js-kb-top-fade");
      const tldrBox  = document.querySelector(".kb-tldr-box");
      const mobileToc = document.querySelector(".kb-mobile-toc");

      if (tldrBox) {
        const tldrRect         = tldrBox.getBoundingClientRect();
        const isScrolledPastTLDR = tldrRect.bottom < 50;

        // Toggle Top Fade
        if (topFade) {
          if (isScrolledPastTLDR) {
            topFade.classList.add("is-visible");
          } else {
            topFade.classList.remove("is-visible");
          }
        }

        // Toggle Mobile TOC Sticky
        if (mobileToc) {
          if (isScrolledPastTLDR) {
            mobileToc.classList.add("is-sticky");
          } else {
            mobileToc.classList.remove("is-sticky");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Toggle Expansion
    const toggleBtns = document.querySelectorAll(".js-toggle-float-summary");
    toggleBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        floatSummary.classList.toggle("is-open");
      });
    });
  }

  // 3. Scroll Spy for Table of Contents
  // Highlights the active section in the sidebar as the user scrolls
  const sections = document.querySelectorAll(
    "main h2[id], main h3[id], main div[id], main p[id]"
  );
  const navLinks = document.querySelectorAll(
    ".kb-sidebar-left .kb-contents-list a"
  );

  function updateActiveLink(id) {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.parentElement.classList.remove("kb-active-item");

      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
        link.parentElement.classList.add("kb-active-item");

        // Scroll the active link into view within the sidebar
        const sidebar = document.querySelector(".kb-contents-list");
        if (sidebar) {
          const linkRect    = link.getBoundingClientRect();
          const sidebarRect = sidebar.getBoundingClientRect();

          if (
            linkRect.top < sidebarRect.top ||
            linkRect.bottom > sidebarRect.bottom
          ) {
            link.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        }
      }
    });
  }

  if (sections.length > 0 && navLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          updateActiveLink(id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // 4. Smooth Scroll for TOC Links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId      = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Immediate visual feedback
          updateActiveLink(targetId);

          window.scrollTo({
            top: targetElement.offsetTop - 100, // Offset for sticky header
            behavior: "smooth",
          });

          // Close mobile TOC if open
          const mobileToc = document.querySelector(
            ".kb-mobile-toc-header.active"
          );
          if (mobileToc) mobileToc.click();
        }
      }
    });
  });

}); // end domReady
