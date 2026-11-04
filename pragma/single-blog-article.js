/**
 * Blog article interactions, popup forms, and Google Sheets submission.
 */
(function () {
    var WEB_APP_URL =
        "https://script.google.com/macros/s/AKfycbxLpo3VoUntBFwjieCNYPKeZQnWTVP8tT5IqHaLKacPBSlgYDpiKy_Z_3E0JyuDa1GGzg/exec";
    var SUBSCRIBER_STORAGE_KEY = "pragma_subscriber_popup_dismissed";
    var DEMO_STORAGE_KEY = "pragma_demo_popup_dismissed";
    var scrollRestorationKey = "pragma_scroll_position:" + window.location.pathname + window.location.search;
    var restoringAfterReload = isReload();
    var initialized = false;

    window.__pragmaScrollRestorationPending = restoringAfterReload;
    if (restoringAfterReload && "scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    function isReload() {
        var navigationEntries = performance.getEntriesByType("navigation");
        if (navigationEntries.length) return navigationEntries[0].type === "reload";
        return performance.navigation && performance.navigation.type === 1;
    }

    function saveScrollPosition() {
        try {
            sessionStorage.setItem(
                scrollRestorationKey,
                String(window.scrollY || document.documentElement.scrollTop)
            );
        } catch (error) {
            console.error("Unable to save scroll position:", error);
        }
    }

    function finishScrollRestoration() {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                window.__pragmaScrollRestorationPending = false;
            });
        });
    }

    window.addEventListener("pagehide", saveScrollPosition);
    window.addEventListener("pageshow", function () {
        if (!restoringAfterReload) return;

        try {
            var savedPosition = sessionStorage.getItem(scrollRestorationKey);
            if (savedPosition === null) {
                window.__pragmaScrollRestorationPending = false;
                return;
            }
            sessionStorage.removeItem(scrollRestorationKey);
            requestAnimationFrame(function () {
                window.scrollTo(0, Number(savedPosition));
                finishScrollRestoration();
            });
        } catch (error) {
            window.__pragmaScrollRestorationPending = false;
            console.error("Unable to restore scroll position:", error);
        }
    });

    function buildAiPrompt(pageUrl) {
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

    function showFormMessage(form, message, isError) {
        var status = form.querySelector(".js-popup-submit-status");
        if (!status) {
            status = document.createElement("p");
            status.className = "js-popup-submit-status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            form.appendChild(status);
        }
        status.textContent = message;
        status.style.color = isError ? "#ef4444" : "inherit";
    }

    function closePopup(modalSelector, storageKey) {
        var modal = document.querySelector(modalSelector);
        var overlay = document.querySelector(".js-scroll-popup-overlay");
        if (modal) modal.classList.remove("is-active");
        if (overlay) overlay.classList.remove("is-active");
        document.body.style.overflow = "";

        try {
            sessionStorage.setItem(storageKey, "1");
        } catch (error) {
            console.error("Unable to save popup state:", error);
        }
    }

    function getFieldValue(form, selector) {
        var input = form.querySelector(selector);
        return input ? input.value.trim() : "";
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidUrl(value) {
        try {
            var url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (error) {
            return false;
        }
    }

    function submitFormToSheets(form, payload, modalSelector, storageKey) {
        if (!WEB_APP_URL || WEB_APP_URL.indexOf("PASTE_YOUR_") === 0) {
            showFormMessage(form, "Google Sheets is not configured. Update the Web App URL in single-blog-article.js.", true);
            console.error("Google Sheets submission stopped: Web App URL is not configured.");
            return;
        }

        var submitButton = form.querySelector('[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        showFormMessage(form, "Submitting your details...");
        console.info("Submitting " + payload.formType + " form to Google Sheets.");

        fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
        })
            .then(function () {
                showFormMessage(form, "Request sent. Check the corresponding sheet tab to confirm it was added.");
                closePopup(modalSelector, storageKey);
            })
            .catch(function (error) {
                console.error("Network error submitting " + payload.formType + " form to Google Sheets:", error);
                showFormMessage(form, "Submission failed. Please try again.", true);
                if (submitButton) submitButton.disabled = false;
            });
    }

    function getScrollPercent() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return documentHeight > 0 ? scrollTop / documentHeight : 0;
    }

    function openPopup(modalSelector, focusSelector) {
        var overlay = document.querySelector(".js-scroll-popup-overlay");
        var modal = document.querySelector(modalSelector);
        if (!overlay || !modal) return;

        overlay.classList.add("is-active");
        modal.classList.add("is-active");
        document.body.style.overflow = "hidden";

        var focusTarget = modal.querySelector(focusSelector);
        if (focusTarget) {
            setTimeout(function () {
                focusTarget.focus();
            }, 350);
        }
    }

    function initSubscriberPopup() {
        var modal = document.querySelector(".js-scroll-popup-modal");
        if (!modal) return;
        sessionStorage.removeItem(SUBSCRIBER_STORAGE_KEY);

        var hasTriggered = false;
        function onScroll() {
            if (window.__pragmaScrollRestorationPending || hasTriggered) return;
            try {
                if (sessionStorage.getItem(SUBSCRIBER_STORAGE_KEY)) return;
            } catch (error) {
                console.error("Unable to read subscriber popup state:", error);
            }

            if (getScrollPercent() >= 0.25) {
                hasTriggered = true;
                window.removeEventListener("scroll", onScroll);
                openPopup(".js-scroll-popup-modal", ".scroll-popup-input");
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true });

        var form = document.querySelector(".js-scroll-popup-form");
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var email = getFieldValue(form, ".scroll-popup-input");
                if (!isValidEmail(email)) {
                    showFormMessage(form, "Enter a valid email address.", true);
                    form.querySelector(".scroll-popup-input").focus();
                    return;
                }

                submitFormToSheets(
                    form,
                    {
                        formType: "subscriber",
                        pageUrl: window.location.href,
                        email: email,
                    },
                    ".js-scroll-popup-modal",
                    SUBSCRIBER_STORAGE_KEY
                );
            }, true);
        }
    }

    function initDemoPopup() {
        var modal = document.querySelector(".js-demo-popup-modal");
        if (!modal) return;
        sessionStorage.removeItem(DEMO_STORAGE_KEY);

        var hasTriggered = false;
        function onScroll() {
            if (window.__pragmaScrollRestorationPending || hasTriggered) return;
            try {
                if (sessionStorage.getItem(DEMO_STORAGE_KEY)) return;
            } catch (error) {
                console.error("Unable to read demo popup state:", error);
            }

            if (getScrollPercent() >= 0.5) {
                hasTriggered = true;
                window.removeEventListener("scroll", onScroll);
                openPopup(".js-demo-popup-modal", ".demo-popup-input");
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true });

        document.querySelectorAll(".js-demo-popup-close").forEach(function (button) {
            button.addEventListener("click", function () {
                closePopup(".js-demo-popup-modal", DEMO_STORAGE_KEY);
            });
        });

        var overlay = document.querySelector(".js-scroll-popup-overlay");
        if (overlay) {
            overlay.addEventListener("click", function () {
                if (modal.classList.contains("is-active")) {
                    closePopup(".js-demo-popup-modal", DEMO_STORAGE_KEY);
                }
            });
        }

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && modal.classList.contains("is-active")) {
                closePopup(".js-demo-popup-modal", DEMO_STORAGE_KEY);
            }
        });

        var form = document.querySelector(".js-demo-popup-form");
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                var phone = getFieldValue(form, "#demo-popup-phone");
                var email = getFieldValue(form, "#demo-popup-email");
                var website = getFieldValue(form, "#demo-popup-website");
                if (!phone || !isValidEmail(email) || !isValidUrl(website)) {
                    showFormMessage(
                        form,
                        "Enter a phone number, valid email address, and a business website URL starting with http:// or https://.",
                        true
                    );
                    var invalidField = !phone
                        ? form.querySelector("#demo-popup-phone")
                        : !isValidEmail(email)
                          ? form.querySelector("#demo-popup-email")
                          : form.querySelector("#demo-popup-website");
                    invalidField.focus();
                    return;
                }

                submitFormToSheets(
                    form,
                    {
                        formType: "demo",
                        pageUrl: window.location.href,
                        phone: phone,
                        email: email,
                        website: website,
                    },
                    ".js-demo-popup-modal",
                    DEMO_STORAGE_KEY
                );
            }, true);
        }
    }

    function initAiSummarise() {
        var prompt = buildAiPrompt(window.location.href);
        document.querySelectorAll(".js-ai-summarise").forEach(function (button) {
            button.setAttribute("href", getAiUrl(button.getAttribute("data-ai"), prompt));
        });
    }

    function updateActiveLink(id, navLinks) {
        navLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.parentElement) link.parentElement.classList.remove("kb-active-item");

            if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
                if (link.parentElement) link.parentElement.classList.add("kb-active-item");

                var sidebar = document.querySelector(".kb-contents-list");
                if (sidebar) {
                    var linkRect = link.getBoundingClientRect();
                    var sidebarRect = sidebar.getBoundingClientRect();
                    if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
                        link.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                }
            }
        });
    }

    function initArticleInteractions() {
        initAiSummarise();

        document.querySelectorAll(".js-kb-toc-toggle").forEach(function (button) {
            button.addEventListener("click", function () {
                button.classList.toggle("active");
                var content = button.nextElementSibling;
                if (content && content.classList.contains("kb-mobile-toc-content")) {
                    content.classList.toggle("is-visible");
                }
            });
        });

        var floatSummary = document.querySelector(".js-mobile-float-summary");
        var summaryBox = document.querySelector(".kb-summary-box");
        if (floatSummary && summaryBox) {
            function updateFloatingSummary() {
                var summaryBoxRect = summaryBox.getBoundingClientRect();
                if (summaryBoxRect.bottom < 0) {
                    floatSummary.classList.add("is-visible");
                } else {
                    floatSummary.classList.remove("is-visible");
                    floatSummary.classList.remove("is-open");
                }

                var mainContent = document.querySelector(".kb-main-content");
                var isMainContentScrolledOff = false;
                if (mainContent) {
                    isMainContentScrolledOff = mainContent.getBoundingClientRect().bottom <= 0;
                    if (isMainContentScrolledOff) {
                        floatSummary.classList.remove("is-visible");
                        floatSummary.classList.remove("is-open");
                    }
                }

                var topFade = document.querySelector(".js-kb-top-fade");
                var tldrBox = document.querySelector(".kb-tldr-box");
                var mobileToc = document.querySelector(".kb-mobile-toc");
                if (tldrBox) {
                    var isScrolledPastTldr = tldrBox.getBoundingClientRect().bottom < 50;
                    if (topFade) topFade.classList.toggle("is-visible", isScrolledPastTldr);
                    if (mobileToc) {
                        mobileToc.classList.toggle("is-sticky", isScrolledPastTldr && !isMainContentScrolledOff);
                    }
                } else if (mobileToc && isMainContentScrolledOff) {
                    mobileToc.classList.remove("is-sticky");
                }
            }

            window.addEventListener("scroll", updateFloatingSummary, { passive: true });
            updateFloatingSummary();

            document.querySelectorAll(".js-toggle-float-summary").forEach(function (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    floatSummary.classList.toggle("is-open");
                });
            });
        }

        var sections = document.querySelectorAll("main h2[id], main h3[id], main div[id], main p[id]");
        var navLinks = document.querySelectorAll(".kb-sidebar-left .kb-contents-list a");

        if (sections.length && navLinks.length && "IntersectionObserver" in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        updateActiveLink(entry.target.getAttribute("id"), navLinks);
                    }
                });
            }, {
                root: null,
                rootMargin: "0px 0px -70% 0px",
                threshold: 0,
            });
            sections.forEach(function (section) {
                observer.observe(section);
            });
        }

        navLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                var href = link.getAttribute("href");
                if (!href || href.charAt(0) !== "#") return;
                event.preventDefault();

                var target = document.getElementById(href.substring(1));
                if (target) {
                    updateActiveLink(target.id, navLinks);
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - 100,
                        behavior: "smooth",
                    });
                    var mobileTocHeader = document.querySelector(".kb-mobile-toc-header.active");
                    if (mobileTocHeader) mobileTocHeader.click();
                }
            });
        });
    }

    function initBlogArticle() {
        if (initialized) return;
        initialized = true;

        initSubscriberPopup();
        initDemoPopup();
        initArticleInteractions();
    }

    function boot() {
        if (document.querySelector(".kb-main-content") || document.querySelector(".js-scroll-popup-modal")) {
            initBlogArticle();
        }
    }

    document.addEventListener("blog:ready", boot);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
