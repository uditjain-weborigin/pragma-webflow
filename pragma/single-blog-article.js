/**
 * single-blog-article.js
 * Loaded via jsDelivr CDN. Works with Webflow's fetch-based HTML injection.
 *
 * HOW IT WORKS:
 *   1. This file loads (via <script src defer>) while the page is rendering.
 *   2. The fetch script in Webflow "Before </body>" fetches the HTML from
 *      GitHub, injects it into #github-content, then fires:
 *        document.dispatchEvent(new CustomEvent('blog:ready'))
 *   3. This file listens for that 'blog:ready' event and runs all init logic.
 *   4. A race-condition guard handles the edge case where this file loads
 *      AFTER the fetch has already completed and the event already fired.
 */

// =============================================================================
// AI Summarise — helper functions (no DOM needed, safe to define immediately)
// =============================================================================
function _buildAiPrompt(pageUrl) {
  return (
    "Summarise this blog for Indian D2C eCommerce teams.\n" +
    "URL: " + pageUrl + "\n\n" +
    "Requirements:\n" +
    "\u2022 Prioritise the most important insights first.\n" +
    "\u2022 Clearly mention the Pragma product(s), workflow(s), or capability layer(s) covered in a technical/niche manner.\n" +
    "\u2022 Collate all key numbers, benchmarks, percentages, and operational stats from the blog.\n" +
    "\u2022 Keep the output concise, technical, and insight-dense.\n" +
    "\u2022 Avoid fluff, generic explanations, and marketing language.\n" +
    "\u2022 Use short paragraphs or bullets for readability.\n" +
    "\u2022 End with: Author: [Name] \u2014 [brief expertise]"
  );
}

function _getAiUrl(ai, prompt) {
  var encoded = encodeURIComponent(prompt);
  switch (ai) {
    case "chatgpt":    return "https://chatgpt.com/?q=" + encoded;
    case "perplexity": return "https://www.perplexity.ai/?q=" + encoded;
    case "gemini":     return "https://www.google.com/search?udm=50&q=" + encoded;
    case "grok":       return "https://grok.com/?q=" + encoded;
    default:           return "#";
  }
}


// =============================================================================
// Main init — runs after HTML has been injected into the page
// =============================================================================
function initBlogArticle() {

  // ── AI Summarise buttons ────────────────────────────────────────────────────
  (function () {
    var pageUrl = window.location.href;
    var prompt  = _buildAiPrompt(pageUrl);
    document.querySelectorAll(".js-ai-summarise").forEach(function (btn) {
      var ai  = btn.getAttribute("data-ai");
      btn.setAttribute("href", _getAiUrl(ai, prompt));
    });
  })();


  // ── 25% Scroll — Subscriber Popup ──────────────────────────────────────────
  (function () {
    var STORAGE_KEY      = "pragma_subscriber_popup_dismissed";
    var SCROLL_THRESHOLD = 0.25;
    var hasTriggered     = false;

    function getPercent() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      return docH <= 0 ? 0 : scrollTop / docH;
    }

    function openPopup() {
      var overlay = document.querySelector(".js-scroll-popup-overlay");
      var modal   = document.querySelector(".js-scroll-popup-modal");
      if (!overlay || !modal) return;
      overlay.classList.add("is-active");
      modal.classList.add("is-active");
      document.body.style.overflow = "hidden";
      var emailInput = modal.querySelector(".scroll-popup-input");
      if (emailInput) setTimeout(function () { emailInput.focus(); }, 350);
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
      try { if (sessionStorage.getItem(STORAGE_KEY)) return; } catch (e) {}
      if (getPercent() >= SCROLL_THRESHOLD) {
        hasTriggered = true;
        window.removeEventListener("scroll", onScroll);
        openPopup();
      }
    }

    // Close button
    document.querySelectorAll(".js-scroll-popup-close").forEach(function (btn) {
      btn.addEventListener("click", closePopup);
    });

    // Backdrop click
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    if (overlay) overlay.addEventListener("click", closePopup);

    // Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopup();
    });

    // Form submit
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
            setTimeout(function () { emailInput.style.borderColor = ""; }, 2000);
          }
          return;
        }
        console.log("Subscriber email:", email);
        closePopup();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  })();


  // ── 50% Scroll — Get a Demo Popup ──────────────────────────────────────────
  (function () {
    var DEMO_STORAGE_KEY = "pragma_demo_popup_dismissed";
    var DEMO_THRESHOLD   = 0.50;
    var demoTriggered    = false;

    function getPercent() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      return docH <= 0 ? 0 : scrollTop / docH;
    }

    function openDemoPopup() {
      var overlay = document.querySelector(".js-scroll-popup-overlay");
      var modal   = document.querySelector(".js-demo-popup-modal");
      if (!overlay || !modal) return;
      overlay.classList.add("is-active");
      modal.classList.add("is-active");
      document.body.style.overflow = "hidden";
      var firstInput = modal.querySelector(".demo-popup-input");
      if (firstInput) setTimeout(function () { firstInput.focus(); }, 350);
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
      try { if (sessionStorage.getItem(DEMO_STORAGE_KEY)) return; } catch (e) {}
      if (getPercent() >= DEMO_THRESHOLD) {
        demoTriggered = true;
        window.removeEventListener("scroll", onDemoScroll);
        openDemoPopup();
      }
    }

    // Close button
    document.querySelectorAll(".js-demo-popup-close").forEach(function (btn) {
      btn.addEventListener("click", closeDemoPopup);
    });

    // Shared backdrop
    var overlay = document.querySelector(".js-scroll-popup-overlay");
    if (overlay) {
      overlay.addEventListener("click", function () {
        var demoModal = document.querySelector(".js-demo-popup-modal");
        if (demoModal && demoModal.classList.contains("is-active")) closeDemoPopup();
      });
    }

    // Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDemoPopup();
    });

    // Form submit
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
            setTimeout(function () { emailInput.style.borderColor = ""; }, 2000);
          }
          return;
        }
        console.log("Demo request:", {
          phone:   document.getElementById("demo-popup-phone")   ? document.getElementById("demo-popup-phone").value   : "",
          email:   email,
          website: document.getElementById("demo-popup-website") ? document.getElementById("demo-popup-website").value : ""
        });
        closeDemoPopup();
      });
    }

    window.addEventListener("scroll", onDemoScroll, { passive: true });
  })();


  // ── TOC, Floating Summary, Scroll Spy ──────────────────────────────────────

  // 1. Mobile TOC Toggle
  document.querySelectorAll(".js-kb-toc-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content && content.classList.contains("kb-mobile-toc-content")) {
        content.classList.toggle("is-visible");
      }
    });
  });

  // 2. Mobile Floating Summary Sidebar
  var floatSummary = document.querySelector(".js-mobile-float-summary");
  var summaryBox   = document.querySelector(".kb-summary-box");

  if (floatSummary && summaryBox) {
    var handleScroll = function () {
      var summaryBoxRect = summaryBox.getBoundingClientRect();
      if (summaryBoxRect.bottom < 0) {
        floatSummary.classList.add("is-visible");
      } else {
        floatSummary.classList.remove("is-visible");
        floatSummary.classList.remove("is-open");
      }

      var topFade   = document.querySelector(".js-kb-top-fade");
      var tldrBox   = document.querySelector(".kb-tldr-box");
      var mobileToc = document.querySelector(".kb-mobile-toc");

      if (tldrBox) {
        var tldrRect           = tldrBox.getBoundingClientRect();
        var isScrolledPastTLDR = tldrRect.bottom < 50;

        if (topFade) {
          topFade.classList[isScrolledPastTLDR ? "add" : "remove"]("is-visible");
        }
        if (mobileToc) {
          mobileToc.classList[isScrolledPastTLDR ? "add" : "remove"]("is-sticky");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    document.querySelectorAll(".js-toggle-float-summary").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        floatSummary.classList.toggle("is-open");
      });
    });
  }

  // 3. Scroll Spy
  var sections = document.querySelectorAll("main h2[id], main h3[id], main div[id], main p[id]");
  var navLinks = document.querySelectorAll(".kb-sidebar-left .kb-contents-list a");

  function updateActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.remove("active");
      link.parentElement.classList.remove("kb-active-item");
      if (link.getAttribute("href") === "#" + id) {
        link.classList.add("active");
        link.parentElement.classList.add("kb-active-item");
        var sidebar = document.querySelector(".kb-contents-list");
        if (sidebar) {
          var linkRect    = link.getBoundingClientRect();
          var sidebarRect = sidebar.getBoundingClientRect();
          if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
            link.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      }
    });
  }

  if (sections.length > 0 && navLinks.length > 0) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          updateActiveLink(entry.target.getAttribute("id"));
        }
      });
    }, { root: null, rootMargin: "0px 0px -70% 0px", threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // 4. Smooth Scroll for TOC Links
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        var targetId      = href.substring(1);
        var targetElement = document.getElementById(targetId);
        if (targetElement) {
          updateActiveLink(targetId);
          window.scrollTo({ top: targetElement.offsetTop - 100, behavior: "smooth" });
          var mobileToc = document.querySelector(".kb-mobile-toc-header.active");
          if (mobileToc) mobileToc.click();
        }
      }
    });
  });

} // end initBlogArticle


// =============================================================================
// Boot — listen for 'blog:ready' event dispatched by the fetch script
// Race-condition guard: if fetch already finished before this file loaded,
// window._blogArticleReady will be true and we init immediately.
// =============================================================================
if (window._blogArticleReady) {
  // Fetch already completed before this script loaded — run immediately
  initBlogArticle();
} else {
  // Wait for fetch to complete and fire the custom event
  document.addEventListener("blog:ready", initBlogArticle);
}
