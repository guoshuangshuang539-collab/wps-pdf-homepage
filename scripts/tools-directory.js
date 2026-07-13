/**
 * Shared footer "All online Tools" directory renderer (same data as homepage).
 */
(function (global) {
  const ONLINE_TOOLS = [
    { title: "Compress PDF", icon: "compress-pdf.svg" },
    { title: "Convert PDF", icon: "convert-pdf.svg" },
    { title: "Split PDF", icon: "split-pdf.svg" },
    { title: "Merge PDF", icon: "merge-pdf.svg" },
    { title: "Signing PDF", icon: "signing-pdf.svg" },
    { title: "Organizing PDF", icon: "organizing-pdf.svg" }
  ];

  const CONVERSION_TOOLS = [
    { title: "PDF to Word", icon: "PDF to Word.svg" },
    { title: "PDF to Excel", icon: "PDF to Excel.svg" },
    { title: "PDF to PPT", icon: "PDF to PPT.svg" },
    { title: "PDF to JPG", icon: "PDF to JPG.svg" },
    { title: "Word to PDF", icon: "Word to PDF.svg" },
    { title: "Excel to PDF", icon: "Excel to PDF.svg" },
    { title: "PPT to PDF", icon: "PPT to PDF.svg" },
    { title: "JPG to PDF", icon: "JPG to PDF.svg" },
    { title: "HTML to PDF", icon: "HTML to PDF.svg" },
    { title: "XML to PDF", icon: "xml to PDF.svg" },
    { title: "Word to JPG", icon: "Word to jpg.svg" },
    { title: "JPG to Word", icon: "JPG to Word.svg" }
  ];

  const DESKTOP_TOOLS = [
    { title: "Read PDF", icon: "convert-pdf.svg" },
    { title: "PDF AI", icon: "convert-pdf.svg" },
    { title: "Annotate PDF", icon: "convert-pdf.svg" },
    { title: "Edit PDF", icon: "convert-pdf.svg" },
    { title: "PDF Viewer", icon: "convert-pdf.svg" },
    { title: "OCR PDF", icon: "convert-pdf.svg" },
    { title: "Create PDF", icon: "convert-pdf.svg" },
    { title: "Combine PDF", icon: "merge-pdf.svg" },
    { title: "Organize PDF", icon: "organizing-pdf.svg" },
    { title: "Compress PDF", icon: "compress-pdf.svg" },
    { title: "eSign PDF", icon: "signing-pdf.svg" },
    { title: "Protect PDF", icon: "convert-pdf.svg" }
  ];

  function href(title) {
    return global.WPSToolRoutes ? WPSToolRoutes.getPageForTool(title) : "#";
  }

  function get3DColumns() {
    const catalog = global.WPSSiteNav3D?.CONVERSION_3D_CATALOG;
    if (!catalog) return { mesh: [], cad: [], bim: [] };
    return catalog;
  }

  function renderLink(item, grouped) {
    if (grouped) {
      return `<a class="tools-directory-link tools-directory-link--grouped" href="#" aria-label="${item.input}"><span class="tools-directory-icon"><span class="format-dot" aria-hidden="true"></span></span><span class="tools-directory-text"><strong>${item.input}</strong><span class="tools-directory-targets">to ${item.outputs.join(" / ")}</span></span></a>`;
    }
    return `<a class="tools-directory-link" href="${href(item.title)}" aria-label="${item.title}"><span class="tools-directory-icon"><img src="images/tools-icon/${encodeURIComponent(item.icon)}" alt=""></span><span>${item.title}</span></a>`;
  }

  function renderColumn(title, items, grouped) {
    return `<div class="tools-directory-group${grouped ? " tools-directory-group--3d" : ""}"><h3>${title}</h3><div class="tools-directory-list">${items.map((i) => renderLink(i, grouped)).join("")}</div></div>`;
  }

  function render(container) {
    if (!container) return;
    const catalog = get3DColumns();
    container.innerHTML = `<div class="tools-directory-row">${[
      renderColumn("Online PDF Tools", ONLINE_TOOLS),
      renderColumn("Conversion Tools", CONVERSION_TOOLS),
      renderColumn("Desktop Features", DESKTOP_TOOLS),
      renderColumn("Mesh Formats", catalog.mesh || [], true),
      renderColumn("CAD Industrial", catalog.cad || [], true),
      renderColumn("BIM & Architecture", catalog.bim || [], true)
    ].join("")}</div>`;
  }

  global.WPSToolsDirectory = { render };
})(typeof window !== "undefined" ? window : globalThis);
