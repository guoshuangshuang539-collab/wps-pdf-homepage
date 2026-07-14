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
    "XML to PDF", "Word to JPG", "JPG to Word"
  ]);

  const THREE_D_HUBS = new Set(["Mesh Converter", "CAD Converter", "BIM Converter"]);

  function getPageForTool(title) {
    const t = (title || "").trim();
    if (THREE_D_HUBS.has(t) && global.WPSFormatHubs3D) {
      const hub = global.WPSFormatHubs3D.getHub(t);
      if (hub) return global.WPSFormatHubs3D.pageForHub(hub.id);
    }
    if (CONVERT_TOOLS.has(t)) return PAGES.convert;
    return PAGES.compress;
  }

  function wireHomepage(root) {
    root = root || document;
    if (!root.querySelector) return;

    root.querySelectorAll(".nav-menu-link").forEach((link) => {
      const hubId = link.getAttribute("data-3d-hub");
      if (hubId && global.WPSFormatHubs3D) {
        link.href = global.WPSFormatHubs3D.pageForHub(hubId);
        return;
      }
      const title = (link.dataset.toolTitle || link.textContent || "").replace(/\s+/g, " ").trim();
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

    root.querySelectorAll(".tools-directory-link").forEach((link) => {
      if (link.getAttribute("href") && link.getAttribute("href") !== "#") return;
      const title = link.getAttribute("aria-label") || link.querySelector("strong")?.textContent || link.querySelector("span:last-child")?.textContent;
      if (title) link.href = getPageForTool(title.trim());
    });
  }

  global.WPSToolRoutes = { PAGES, CONVERT_TOOLS, THREE_D_HUBS, getPageForTool, wireHomepage };
})(typeof window !== "undefined" ? window : globalThis);
