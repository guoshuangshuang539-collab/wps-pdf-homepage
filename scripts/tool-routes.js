/**
 * Demo routing: which tool opens which experience page.
 */
(function (global) {
  const PAGES = {
    compress: "tool-compress-demo.html",
    convert: "tool-convert-demo.html"
  };

  const CONVERT_TOOLS = new Set([
    "Convert PDF",
    "PDF to Word", "PDF to Excel", "PDF to PPT", "PDF to JPG",
    "Word to PDF", "Excel to PDF", "PPT to PDF", "JPG to PDF",
    "HTML to PDF", "XML to PDF", "Word to JPG", "JPG to Word"
  ]);

  function getPageForTool(title) {
    const t = (title || "").trim();
    if (CONVERT_TOOLS.has(t)) return PAGES.convert;
    return PAGES.compress;
  }

  function wireHomepage(root) {
    root = root || document;
    if (!root.querySelector) return;

    root.querySelectorAll(".nav-menu-link").forEach((link) => {
      const title = (link.textContent || "").replace(/\s+/g, " ").trim();
      if (title && title !== "All Tools →") link.href = getPageForTool(title);
    });

    root.querySelectorAll(".dock-item").forEach((link) => {
      const title = link.dataset.titleSource || link.dataset.title || "";
      if (title) link.href = getPageForTool(title);
    });

    root.querySelectorAll("[data-tool-title-source] .lab-tool-link").forEach((link) => {
      const card = link.closest("[data-tool-title-source]");
      if (card) link.href = getPageForTool(card.dataset.toolTitleSource);
    });

    root.querySelectorAll(".tools-directory-link:not(.tools-directory-link--grouped)").forEach((link) => {
      const label = link.querySelector("span:last-child");
      const title = label?.textContent?.trim();
      if (title) link.href = getPageForTool(title);
    });
  }

  global.WPSToolRoutes = { PAGES, CONVERT_TOOLS, getPageForTool, wireHomepage };
})(typeof window !== "undefined" ? window : globalThis);
