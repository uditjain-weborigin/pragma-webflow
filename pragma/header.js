
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
function initHeader() {

  // ── AI Summarise buttons ────────────────────────────────────────────────────
  (function () {
    var pageUrl = window.location.href;
    var prompt  = _buildAiPrompt(pageUrl);
    document.querySelectorAll(".js-ai-summarise").forEach(function (btn) {
      var ai  = btn.getAttribute("data-ai");
      btn.setAttribute("href", _getAiUrl(ai, prompt));
    });
  })();

  document.querySelectorAll(".js-toggle-mobile").forEach((element) => {
        // Header
        element.addEventListener("click", function () {
          this.classList.toggle("active");
          document.querySelector(".menuBox").classList.toggle("active");
          document.getElementById("headerCntr").classList.toggle("active");
        });
      });

      // Mobile Drawer Close Button click logic
      document.querySelectorAll(".drawer-close-btn").forEach((element) => {
        element.addEventListener("click", function () {
          document.querySelectorAll(".js-toggle-mobile").forEach(hamburger => hamburger.classList.remove("active"));
          document.querySelector(".menuBox").classList.remove("active");
          document.getElementById("headerCntr").classList.remove("active");
        });
      });

      // Mobile sub-menu toggle accordion functionality
      document.querySelectorAll(".menuBox ul > li.has-dropdown > a").forEach((trigger) => {
        trigger.addEventListener("click", function (e) {
          if (window.innerWidth <= 767) {
            e.preventDefault();
            const parent = this.parentElement;
            parent.classList.toggle("open");
          }
        });
      });

      // === Products Tab Switching Logic ===
      (function () {
        const tabBar = document.getElementById("productsTabBar");
        if (!tabBar) return;

        const allTabs = tabBar.querySelectorAll(".product-tab-item");
        const allSubPanels = document.querySelectorAll(".products-sub-panel");

        function positionSubPanel(tabId) {
          if (window.innerWidth <= 767) {
            const activePanel = document.getElementById("sub-panel-" + tabId);
            if (activePanel) {
              activePanel.style.left = "";
              activePanel.style.top = "";
            }
            return;
          }

          const activeTab = document.getElementById("tab-" + tabId);
          const activePanel = document.getElementById("sub-panel-" + tabId);
          const menu = document.getElementById("productsDropdownMenu");
          const tabBarEl = document.getElementById("productsTabBar");

          if (activeTab && activePanel && menu && tabBarEl) {
             const tabRect = activeTab.getBoundingClientRect();
             const menuRect = menu.getBoundingClientRect();
             const tabBarRect = tabBarEl.getBoundingClientRect();

             const panelWidth = activePanel.offsetWidth || 540;
             if (activeTab.classList.contains("tab-align-right")) {
               // Align sub-panel right edge with active tab right edge (subtracting dynamic panelWidth)
               const rightOffset = tabRect.right - menuRect.left - panelWidth;
               activePanel.style.left = rightOffset + "px";
             } else {
               // Align sub-panel left edge with active tab left edge
               const leftOffset = tabRect.left - menuRect.left;
               activePanel.style.left = leftOffset + "px";
             }

             // Align sub-panel top with tab bar bottom (minus border overlap)
             const topOffset = tabBarRect.bottom - menuRect.top;
             activePanel.style.top = (topOffset - 1) + "px";
          }
        }

        let shipAxisAnimationTimer = null;
        function playShipAxisAnimation() {
          const shipAxisImg = document.querySelector("#tab-shipaxis .product-icon-box img");
          if (!shipAxisImg) return;
          
          if (shipAxisAnimationTimer) {
            clearTimeout(shipAxisAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/shipaxis-animation/shipaxis1.svg",
            "assets/images/navbar/shipaxis-animation/shipaxis2.svg",
            "assets/images/navbar/shipaxis-animation/shipaxis3.svg",
            "assets/images/navbar/shipaxis-animation/shipaxis4.svg",
            "assets/images/navbar/shipaxis-animation/shipaxis5.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              shipAxisImg.src = frames[currentFrame];
              currentFrame++;
              shipAxisAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetShipAxisImage() {
          if (shipAxisAnimationTimer) {
            clearTimeout(shipAxisAnimationTimer);
            shipAxisAnimationTimer = null;
          }
          const shipAxisImg = document.querySelector("#tab-shipaxis .product-icon-box img");
          if (shipAxisImg) {
            shipAxisImg.src = "assets/images/navbar/ship_axis.svg";
          }
        }

        let crmAnimationTimer = null;
        function playCrmAnimation() {
          const crmImg = document.querySelector("#tab-omnichannel .product-icon-box img");
          if (!crmImg) return;
          
          if (crmAnimationTimer) {
            clearTimeout(crmAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/crm-animation/crm1.svg",
            "assets/images/navbar/crm-animation/crm2.svg",
            "assets/images/navbar/crm-animation/crm3.svg",
            "assets/images/navbar/crm-animation/crm4.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              crmImg.src = frames[currentFrame];
              currentFrame++;
              crmAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetCrmImage() {
          if (crmAnimationTimer) {
            clearTimeout(crmAnimationTimer);
            crmAnimationTimer = null;
          }
          const crmImg = document.querySelector("#tab-omnichannel .product-icon-box img");
          if (crmImg) {
            crmImg.src = "assets/images/navbar/omnichannel_crm.svg";
          }
        }

        let rmsAnimationTimer = null;
        function playRmsAnimation() {
          const rmsImg = document.querySelector("#tab-rms .product-icon-box img");
          if (!rmsImg) return;
          
          if (rmsAnimationTimer) {
            clearTimeout(rmsAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/return-animation/return1.svg",
            "assets/images/navbar/return-animation/return2.svg",
            "assets/images/navbar/return-animation/return3.svg",
            "assets/images/navbar/return-animation/return4.svg",
            "assets/images/navbar/return-animation/return5.svg",
            "assets/images/navbar/return-animation/return6.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              rmsImg.src = frames[currentFrame];
              currentFrame++;
              rmsAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetRmsImage() {
          if (rmsAnimationTimer) {
            clearTimeout(rmsAnimationTimer);
            rmsAnimationTimer = null;
          }
          const rmsImg = document.querySelector("#tab-rms .product-icon-box img");
          if (rmsImg) {
            rmsImg.src = "assets/images/navbar/rms.svg";
          }
        }

        let checkoutAnimationTimer = null;
        function playCheckoutAnimation() {
          const checkoutImg = document.querySelector("#tab-checkout .product-icon-box img");
          if (!checkoutImg) return;
          
          if (checkoutAnimationTimer) {
            clearTimeout(checkoutAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/1checkout-animation/1checkout1.svg",
            "assets/images/navbar/1checkout-animation/1checkout2.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              checkoutImg.src = frames[currentFrame];
              currentFrame++;
              checkoutAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetCheckoutImage() {
          if (checkoutAnimationTimer) {
            clearTimeout(checkoutAnimationTimer);
            checkoutAnimationTimer = null;
          }
          const checkoutImg = document.querySelector("#tab-checkout .product-icon-box img");
          if (checkoutImg) {
            checkoutImg.src = "assets/images/navbar/checkout_1.svg";
          }
        }

        let rtoAnimationTimer = null;
        function playRtoAnimation() {
          const rtoImg = document.querySelector("#tab-rto .product-icon-box img");
          if (!rtoImg) return;
          
          if (rtoAnimationTimer) {
            clearTimeout(rtoAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/rtosuite-animation/rto-suite1.svg",
            "assets/images/navbar/rtosuite-animation/rto-suite2.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              rtoImg.src = frames[currentFrame];
              currentFrame++;
              rtoAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetRtoImage() {
          if (rtoAnimationTimer) {
            clearTimeout(rtoAnimationTimer);
            rtoAnimationTimer = null;
          }
          const rtoImg = document.querySelector("#tab-rto .product-icon-box img");
          if (rtoImg) {
            rtoImg.src = "assets/images/navbar/rto_suite.svg";
          }
        }

        let genieAnimationTimer = null;
        function playGenieAnimation() {
          const genieImg = document.querySelector("#tab-genie .product-icon-box img");
          if (!genieImg) return;
          
          if (genieAnimationTimer) {
            clearTimeout(genieAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/genie-animation/genie1.svg",
            "assets/images/navbar/genie-animation/genie2.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              genieImg.src = frames[currentFrame];
              currentFrame++;
              genieAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetGenieImage() {
          if (genieAnimationTimer) {
            clearTimeout(genieAnimationTimer);
            genieAnimationTimer = null;
          }
          const genieImg = document.querySelector("#tab-genie .product-icon-box img");
          if (genieImg) {
            genieImg.src = "assets/images/navbar/genie.svg";
          }
        }

        let whatsappAnimationTimer = null;
        function playWhatsappAnimation() {
          const whatsappImg = document.querySelector("#tab-whatsapp .product-icon-box img");
          if (!whatsappImg) return;
          
          if (whatsappAnimationTimer) {
            clearTimeout(whatsappAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/whatsapp-animation/wa1.svg",
            "assets/images/navbar/whatsapp-animation/wa2.svg",
            "assets/images/navbar/whatsapp-animation/wa3.svg",
            "assets/images/navbar/whatsapp-animation/wa4.svg",
            "assets/images/navbar/whatsapp-animation/wa5.svg",
            "assets/images/navbar/whatsapp-animation/wa6.svg",
            "assets/images/navbar/whatsapp-animation/wa7.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              whatsappImg.src = frames[currentFrame];
              currentFrame++;
              whatsappAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetWhatsappImage() {
          if (whatsappAnimationTimer) {
            clearTimeout(whatsappAnimationTimer);
            whatsappAnimationTimer = null;
          }
          const whatsappImg = document.querySelector("#tab-whatsapp .product-icon-box img");
          if (whatsappImg) {
            whatsappImg.src = "assets/images/navbar/whatsapp_business_suite.svg";
          }
        }

        let jmsAnimationTimer = null;
        function playJmsAnimation() {
          const jmsImg = document.querySelector("#tab-jms .product-icon-box img");
          if (!jmsImg) return;
          
          if (jmsAnimationTimer) {
            clearTimeout(jmsAnimationTimer);
          }
          
          const frames = [
            "assets/images/navbar/jms-animation/jms1.svg",
            "assets/images/navbar/jms-animation/jms2.svg",
            "assets/images/navbar/jms-animation/jms3.svg",
            "assets/images/navbar/jms-animation/jms4.svg",
            "assets/images/navbar/jms-animation/jms5.svg",
            "assets/images/navbar/jms-animation/jms6.svg",
            "assets/images/navbar/jms-animation/jms7.svg",
            "assets/images/navbar/jms-animation/jms8.svg"
          ];
          
          let currentFrame = 0;
          
          function nextFrame() {
            if (currentFrame < frames.length) {
              jmsImg.src = frames[currentFrame];
              currentFrame++;
              jmsAnimationTimer = setTimeout(nextFrame, 100);
            }
          }
          
          nextFrame();
        }

        function resetJmsImage() {
          if (jmsAnimationTimer) {
            clearTimeout(jmsAnimationTimer);
            jmsAnimationTimer = null;
          }
          const jmsImg = document.querySelector("#tab-jms .product-icon-box img");
          if (jmsImg) {
            jmsImg.src = "assets/images/navbar/jms.svg";
          }
        }

        function activateTab(tabId) {
          // Deactivate all tabs
          allTabs.forEach(function (t) { t.classList.remove("active-tab"); });
          // Hide all sub-panels
          allSubPanels.forEach(function (p) { p.classList.remove("is-visible"); });

          // Reset animated images to default when switching away
          if (tabId !== "shipaxis") {
            resetShipAxisImage();
          }
          if (tabId !== "omnichannel") {
            resetCrmImage();
          }
          if (tabId !== "rms") {
            resetRmsImage();
          }
          if (tabId !== "checkout") {
            resetCheckoutImage();
          }
          if (tabId !== "rto") {
            resetRtoImage();
          }
          if (tabId !== "genie") {
            resetGenieImage();
          }
          if (tabId !== "whatsapp") {
            resetWhatsappImage();
          }
          if (tabId !== "jms") {
            resetJmsImage();
          }

          // Activate the clicked tab
          const activeTab = document.getElementById("tab-" + tabId);
          if (activeTab) activeTab.classList.add("active-tab");

          // Show the corresponding sub-panel
          const activePanel = document.getElementById("sub-panel-" + tabId);
          if (activePanel) {
            activePanel.classList.add("is-visible");
            positionSubPanel(tabId);
          }

          // Play frame-by-frame animations
          if (tabId === "shipaxis") {
            playShipAxisAnimation();
          }
          if (tabId === "omnichannel") {
            playCrmAnimation();
          }
          if (tabId === "rms") {
            playRmsAnimation();
          }
          if (tabId === "checkout") {
            playCheckoutAnimation();
          }
          if (tabId === "rto") {
            playRtoAnimation();
          }
          if (tabId === "genie") {
            playGenieAnimation();
          }
          if (tabId === "whatsapp") {
            playWhatsappAnimation();
          }
          if (tabId === "jms") {
            playJmsAnimation();
          }

          // Show/hide the tab bar border based on sub-panel content
          const productsTabBarEl = document.getElementById("productsTabBar");
          if (productsTabBarEl) {
            if (activePanel && activePanel.children.length > 0) {
              productsTabBarEl.classList.add("has-active-sub");
            } else {
              productsTabBarEl.classList.remove("has-active-sub");
            }
          }
        }

        allTabs.forEach(function (tab) {
          // Collapse active sub-panel on hovering over a different tab to prevent border clashing
          tab.addEventListener("mouseenter", function () {
            if (window.innerWidth > 767 && !this.classList.contains("active-tab")) {
              allTabs.forEach(function (t) { t.classList.remove("active-tab"); });
              allSubPanels.forEach(function (p) { p.classList.remove("is-visible"); });
              resetShipAxisImage();
              resetCrmImage();
              resetRmsImage();
              resetCheckoutImage();
              resetRtoImage();
              resetGenieImage();
              resetWhatsappImage();
              resetJmsImage();
              const productsTabBarEl = document.getElementById("productsTabBar");
              if (productsTabBarEl) {
                productsTabBarEl.classList.remove("has-active-sub");
              }
            }
          });

          tab.addEventListener("click", function () {
            const tabId = this.getAttribute("data-tab");
            if (this.classList.contains("active-tab")) {
              // Toggle off: return to initial state (no sub-panel showing)
              allTabs.forEach(function (t) { t.classList.remove("active-tab"); });
              allSubPanels.forEach(function (p) { p.classList.remove("is-visible"); });
              resetShipAxisImage();
              resetCrmImage();
              resetRmsImage();
              resetCheckoutImage();
              resetRtoImage();
              resetGenieImage();
              resetWhatsappImage();
              resetJmsImage();
              const productsTabBarEl = document.getElementById("productsTabBar");
              if (productsTabBarEl) {
                productsTabBarEl.classList.remove("has-active-sub");
              }
            } else {
              // Activate the clicked tab
              activateTab(tabId);
            }
          });
        });

        // Do not activate any tab by default initially to keep initial state clean as per user mockup

        // Reposition on window resize
        window.addEventListener("resize", function () {
          const activeTabEl = tabBar.querySelector(".product-tab-item.active-tab");
          if (activeTabEl) {
            const tabId = activeTabEl.getAttribute("data-tab");
            positionSubPanel(tabId);
          }
        });

        // Reposition on page load / dropdown show
        const dropdownItem = document.querySelector(".products-dropdown-item");
        if (dropdownItem) {
          dropdownItem.addEventListener("mouseenter", function () {
            const activeTabEl = tabBar.querySelector(".product-tab-item.active-tab");
            if (activeTabEl) {
              const tabId = activeTabEl.getAttribute("data-tab");
              // Delay slightly to ensure dropdown has rendered and has geometry
              setTimeout(() => {
                positionSubPanel(tabId);
              }, 50);
            }
          });
        }
      })();

      // Dynamic Rotating Case Studies Slider in Resources Dropdown
      document.addEventListener("DOMContentLoaded", function () {
        const featuredCaseStudies = [
          {
            logo: "assets/images/navbar/emami.svg",
            alt: "Emami",
            text: "Case Study Title of almost 2-3 lines can fit in this space right here"
          },
          {
            logo: "assets/images/navbar/neeman's logo.svg",
            logoMobile: "assets/images/navbar/neemans_mobile.svg",
            alt: "Neemans",
            text: "Neemans saw decrease in repeat enquiries by 40% in 45days"
          },
          {
            logo: "assets/images/navbar/house_of_gulab.svg",
            alt: "House of Gulab",
            text: "House of Gulab reducing RTOs by 68% in 90days"
          },
          {
            logo: "assets/images/navbar/baidyanath.svg",
            alt: "Baidyanath",
            text: "Baidyanath saw decrease in repeat enquiries by 40% in 45days"
          },
          {
            logo: "assets/images/navbar/bevdaas.svg",
            alt: "Bevdaas",
            text: "Case Study Title of almost 2-3 lines can fit in this space right here"
          },
          {
            logo: "assets/images/navbar/xyxx.svg",
            alt: "XYXX",
            text: "XYXX brand saw decrease in repeat enquiries by 40% in 45days"
          }
        ];

        let currentIndex = 0;
        const containers = document.querySelectorAll(".cs-dynamic-container");
        const logos = document.querySelectorAll(".cs-dynamic-logo");
        const texts = document.querySelectorAll(".cs-dynamic-text");

        if (containers.length > 0) {
          setInterval(() => {
            // 1. Slide active contents out upwards
            containers.forEach(container => container.classList.add("slide-out-up"));

            setTimeout(() => {
              // 2. Increment index & update data
              currentIndex = (currentIndex + 1) % featuredCaseStudies.length;
              const nextStudy = featuredCaseStudies[currentIndex];

              logos.forEach(logo => {
                if (logo.closest(".mobile-case-study-card") && nextStudy.logoMobile) {
                  logo.src = nextStudy.logoMobile;
                } else {
                  logo.src = nextStudy.logo;
                }
                logo.alt = nextStudy.alt;
              });
              texts.forEach(text => {
                text.textContent = nextStudy.text;
              });

              // 3. Put new content at starting position below (transition disabled temporarily)
              containers.forEach(container => {
                container.classList.remove("slide-out-up");
                container.classList.add("slide-in-down");
              });

              // Force reflow
              containers.forEach(container => {
                container.offsetHeight;
              });

              // 4. Slide in up to original centered position
              containers.forEach(container => {
                container.classList.remove("slide-in-down");
              });
            }, 350); // Matches transition duration
          }, 4000); // 4 seconds duration per item
        }

        // Mobile side-panel click logic (accordion toggles for nested menus)
        document.querySelectorAll(".dropdown-list li.has-side-panel > a").forEach((trigger) => {
          trigger.addEventListener("click", function (e) {
            if (window.innerWidth <= 767) {
              e.preventDefault();
              e.stopPropagation(); // Prevent trigger from closing parent dropdown
              const parent = this.parentElement;
              
              // Close any other open sibling panels first
              parent.parentElement.querySelectorAll("li.has-side-panel").forEach((sibling) => {
                if (sibling !== parent) {
                  sibling.classList.remove("open-panel");
                }
              });

              parent.classList.toggle("open-panel");
            }
          });
        });

        // Mobile Resources Accordion Toggle
        const comparisonsTrigger = document.getElementById("m-comparisons-trigger");
        const comparisonsItem = document.getElementById("m-comparisons-item");
        if (comparisonsTrigger && comparisonsItem) {
          comparisonsTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            comparisonsItem.classList.toggle("open-submenu");
          });
        }
      });
} // end initBlogArticle


// =============================================================================
// Boot — listen for 'blog:ready' event dispatched by the fetch script
// Race-condition guard: if fetch already finished before this file loaded,
// window._blogArticleReady will be true and we init immediately.
// =============================================================================
if (window._headerReady) {
  // Fetch already completed before this script loaded — run immediately
  initHeder();
} else {
  // Wait for fetch to complete and fire the custom event
  document.addEventListener("header:ready", initHeader);
}
