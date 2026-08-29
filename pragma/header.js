
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
