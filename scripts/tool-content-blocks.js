/**
 * Reusable homepage-style content blocks for tool inner pages.
 * Prefers WPSToolContentLibrary per-slug content when available.
 */
(function (global) {
  const CONTENT = {
    compress: {
      whyChoose: {
        title: "Why Choose WPS Office to Compress PDF Files?",
        items: [
          {
            icon: "images/tool-live/compress/why-ratios.svg",
            title: "Multiple Compression Ratios",
            body: "WPS PDF Compressor supports 3 compression ratios (HD, Recommended, Smallest). You can choose one ratio based on your requirements to compress your file while maintaining high quality.",
            href: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/"
          },
          {
            icon: "images/tool-live/compress/why-shield.svg",
            title: "No Information Loss",
            body: "The compression process will not damage your files, and your information will be preserved completely.",
            href: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/"
          },
          {
            icon: "images/tool-live/compress/why-desktop.svg",
            title: "Advanced Compressor Options",
            body: "If you are looking for more advanced compressor options, you may use WPS Office for PC or our online application to make your PDF file smaller.",
            href: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/"
          }
        ]
      },
      faq: {
        title: "PDF Compression FAQs",
        items: [
          {
            question: "How do I compress a large file to make it smaller online?",
            answerHtml: "<ol><li>Click Select File to upload your PDF file or drag it directly to the editing area.</li><li>Choose one of the three compression methods (HD, Recommended, Smallest) for compression.</li><li>Wait for a few seconds and click Download to get your compressed file.</li></ol>",
            learnMore: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/"
          },
          {
            question: "How do I know the size of a compressed file?",
            answerHtml: "<p>Select the WPS PDF online compression tool to effectively reduce the file size. The compressor will show you the size of the PDF file and how much it has reduced.</p>",
            learnMore: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/"
          },
          {
            question: "Is PDF file compression free?",
            answerHtml: "<p>Yes. WPS Office supports free PDF file compression online. You can also upgrade to a WPS Premium account or download WPS Office to experience more PDF editing features.</p>",
            learnMore: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/create-new-pdf/"
          }
        ]
      },
      blog: {
        title: "Learn More About Compress PDF Online for Free",
        moreHref: "https://pdf.wps.com/blog/",
        articles: [
          {
            image: "images/legacy/blog/blog-1.png",
            href: "https://pdf.wps.com/blog/",
            title: "Guideline on How to Compress PDF in Indesign",
            body: "PDF is one of the most useful tools in our daily life. When you have a large PDF file, WPS Premium brings you the way out to compress PDF in InDesign using WPS Office."
          },
          {
            image: "images/legacy/blog/blog-2.png",
            href: "https://pdf.wps.com/blog/",
            title: "Enable More Access to PDF - Free Download WPS for Windows",
            body: "The four main features in downloading WPS for Windows are Writer, Spreadsheet, Presentation, and PDF. Easily compatible with 47 file kinds."
          },
          {
            image: "images/legacy/blog/blog-3.png",
            href: "https://pdf.wps.com/blog/",
            title: "How to Compress Multiple PDF Files? Use the Best Tool for 2022!",
            body: "Compressing PDF files is most useful when we are short on storage. WPS PDF only takes a few seconds to compress and download your files."
          }
        ]
      }
    },
    convert: {
      guide: {
        title: "How Do PDF Converters Work?",
        steps: [
          "First, select the PDF conversion feature(Convert to or from PDF)",
          "Upload the files in the format you want to convert to the online PDF converter",
          "Click the Download button to export the converted PDF files to your device"
        ]
      },
      faq: {
        title: "PDF to Word Conversion FAQs",
        items: [
          {
            question: "How to convert word to pdf online?",
            answerHtml: "<ol><li>First, select the PDF to Word feature.</li><li>Upload your file to our online PDF converter.</li><li>Click the Download button to export the converted PDF file to your device.</li></ol>",
            learnMore: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/convert-pdf/pdf-to-word/"
          },
          {
            question: "How to download pdf converter for free?",
            answerHtml: "<ol><li>WPS Office is a powerful All-in-One Office Suite that helps you easily use PDF editing tools.</li><li>At the bottom of WPS PDF Converter page, click \"Download App to work Offline\", you can download WPS Office for free for PDF conversion.</li><li>Open WPS Office and you can use PDF Converter for free. Also unlock Word, Excel, PowerPoint tools.</li></ol>",
            learnMore: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/convert-pdf/"
          },
          {
            question: "How do I save a file as PDF on PDF Converter?",
            answerHtml: "<ol><li>WPS Office is a powerful All-in-One office suite that supports PDF Converter.</li><li>Open WPS Office, click PDF Tools, select \"Create PDF from the file\".</li><li>Select the file you need to convert to PDF format, confirm the conversion, you can convert the file to PDF in a few seconds.</li><li>Click \"Save\", save the file.</li></ol>",
            learnMore: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/create-new-pdf/"
          }
        ]
      },
      blog: {
        title: "Learn More About PDF Converter",
        moreHref: "https://pdf.wps.com/blog/",
        articles: [
          {
            image: "images/legacy/blog/blog-1.png",
            href: "https://pdf.wps.com/blog/",
            title: "Learn How to Save PDF as Word?",
            body: "Converting a PDF file to Word format allows you to make edits to a PDF document even if you are unable to do so in the original format."
          },
          {
            image: "images/legacy/blog/blog-2.png",
            href: "https://pdf.wps.com/blog/",
            title: "Learn about The Top Free PDF Writers in 2024",
            body: "PDF means \"Portable Documents Format\". Making, converting, and exporting files has never been easier than a few years ago."
          },
          {
            image: "images/legacy/blog/blog-3.png",
            href: "https://pdf.wps.com/blog/",
            title: "Free Download iLovePDF: Making Your PDF More Accessible",
            body: "The goal of the team behind iLovePdf is to provide download options and features that make it easier for users to convert and manage pdf files."
          }
        ]
      }
    }
  };

  const LEGACY_KEY = {
    "compress-pdf": "compress",
    compress: "compress",
    "convert-pdf": "convert",
    convert: "convert"
  };

  const RELATED_TOOLS = [
    { title: "Compress PDF", icon: "compress" },
    { title: "Convert PDF", icon: "sync_alt" },
    { title: "Split PDF", icon: "call_split" },
    { title: "Merge PDF", icon: "merge" },
    { title: "Sign PDF", icon: "draw" }
  ];

  function assetPrefix() {
    return global.WPSToolCatalog?.assetBase?.() || document.body?.dataset?.assetBase || "";
  }

  function withAsset(src) {
    if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
    const base = assetPrefix();
    if (!base) return src;
    if (src.startsWith("../") || src.startsWith("/")) return src;
    return base + src;
  }

  function rewriteAssetsInHtml(html) {
    const base = assetPrefix();
    if (!base) return html;
    return html
      .replace(/\bsrc="(images\/[^"]+)"/g, (_, p) => `src="${base}${p}"`)
      .replace(/\bhref="(images\/[^"]+)"/g, (_, p) => `href="${base}${p}"`);
  }

  function renderWhyChoose(config) {
    const items = config.items.map((item) => `
      <a class="why-choose-item" href="${item.href}" target="_blank" rel="noopener noreferrer">
        <div class="why-choose-icon" aria-hidden="true"><img src="${withAsset(item.icon)}" alt="" width="256" height="256" loading="lazy" decoding="async"></div>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
        <span class="why-choose-doc-link">Learn More →</span>
      </a>
    `).join("");
    return `
      <section class="why-choose why-choose--live" id="why-choose" aria-labelledby="why-choose-title">
        <h2 id="why-choose-title">${config.title}</h2>
        <div class="why-choose-grid">${items}</div>
      </section>
    `;
  }

  function renderConverterGuide(config) {
    const steps = config.steps.map((text, i) => `
      <div class="converter-guide-step">
        <span class="converter-guide-num">${i + 1}</span>
        <p>${text}</p>
      </div>
    `).join("");
    return `
      <section class="converter-guide" id="how-it-works">
        <h2>${config.title}</h2>
        <div class="converter-guide-steps">${steps}</div>
      </section>
    `;
  }

  function renderFaq(config) {
    const items = config.items.map((item, i) => `
      <article class="faq-item${i === 0 ? " is-open" : ""}">
        <button class="faq-question" type="button" aria-expanded="${i === 0 ? "true" : "false"}">
          <span>${item.question}</span>
          <span class="faq-icon" aria-hidden="true"><span class="material-symbols-rounded">expand_more</span></span>
        </button>
        <div class="answer">
          ${item.answerHtml}
          <div class="answer-footer">
            <a class="faq-learn-more" href="${item.learnMore}" target="_blank" rel="noopener noreferrer">Learn More →</a>
          </div>
        </div>
      </article>
    `).join("");
    return `
      <section class="faq" id="faq">
        <h2>${config.title}</h2>
        <div class="faq-list">${items}</div>
      </section>
    `;
  }

  function renderBlog(config) {
    const cards = config.articles.map((a) => `
      <a class="blog-card" href="${a.href}" target="_blank" rel="noopener noreferrer">
        <div class="blog-image"><img src="${withAsset(a.image)}" alt="" loading="lazy" decoding="async"></div>
        <h4>${a.title}</h4>
        <p>${a.body}</p>
      </a>
    `).join("");
    return `
      <section class="blog" id="blog">
        <div class="section-head">
          <div><h2>${config.title}</h2></div>
          <a class="btn outline" href="${config.moreHref}" target="_blank" rel="noopener noreferrer">
            <span>More Articles</span>
            <span class="btn-icon"><img src="${withAsset("images/legacy/arrow-up-right.svg")}" alt=""></span>
          </a>
        </div>
        <div class="blog-grid">${cards}</div>
      </section>
    `;
  }

  function renderDownloadCta() {
    return `
      <section class="tool-download-compact" id="download-cta">
        <a class="btn blue" href="#" data-wps-download="auto">
          <span>Download for All Features</span>
          <span class="btn-icon"><img src="${withAsset("images/legacy/arrow-up-right.svg")}" alt=""></span>
        </a>
      </section>
    `;
  }

  function relatedFromSlugs(slugs) {
    const catalog = global.WPSToolCatalog;
    if (!catalog || !slugs?.length) return null;
    return slugs.map((slug) => {
      const tool = catalog.getBySlug(slug);
      if (!tool) return null;
      return {
        title: tool.title,
        icon: tool.materialIcon || "sync_alt",
        href: catalog.resolvePage(tool.page)
      };
    }).filter(Boolean);
  }

  function renderRelatedTools(currentTool, options) {
    const routes = global.WPSToolRoutes;
    const fromCatalog = relatedFromSlugs(options?.relatedSlugs);
    const cardsSource = fromCatalog || RELATED_TOOLS.map((t) => {
      const title = t.title === "Sign PDF" ? "Signing PDF" : t.title;
      return {
        title: t.title,
        icon: t.icon,
        href: routes ? routes.getPageForTool(title) : "#"
      };
    });

    const heading = options?.relatedHeading
      || (currentTool && String(currentTool).includes("3d") || options?.relatedSlugs?.some((s) => /converter$/.test(s))
        ? "Related Tools"
        : "Related PDF Tools");

    const cards = cardsSource.map((t) =>
      `<a class="related-card" href="${t.href}"><span class="material-symbols-rounded">${t.icon}</span><span>${t.title}</span></a>`
    ).join("");

    return `
      <section class="tool-related-section" id="related-tools">
        <h2>${heading}</h2>
        <div class="related-grid">${cards}</div>
      </section>
    `;
  }

  function initFaqAccordion(root) {
    root.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector(".faq-question");
      if (!button) return;
      button.addEventListener("click", () => {
        const isOpen = item.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  function resolveData(slugOrKey) {
    const lib = global.WPSToolContentLibrary;
    if (lib?.get?.(slugOrKey)) return lib.get(slugOrKey);
    const legacy = LEGACY_KEY[slugOrKey] || slugOrKey;
    return CONTENT[legacy] || null;
  }

  function mount(slugOrKey, container, options) {
    const data = resolveData(slugOrKey);
    if (!data || !container) return;
    let html = "";
    if (data.whyChoose) html += renderWhyChoose(data.whyChoose);
    if (data.guide) html += renderConverterGuide(data.guide);
    if (data.faq) html += renderFaq(data.faq);
    if (data.blog) html += renderBlog(data.blog);

    const relatedSlugs = options?.relatedSlugs
      || global.WPSToolCatalog?.getBySlug?.(slugOrKey)?.related;
    html += renderRelatedTools(slugOrKey, { ...options, relatedSlugs });
    html += renderDownloadCta();
    container.innerHTML = rewriteAssetsInHtml(html);
    initFaqAccordion(container);
    global.WPSLinks?.wireDownloadTriggers(container);
  }

  global.WPSToolContent = { CONTENT, mount, initFaqAccordion, renderRelatedTools };
})(typeof window !== "undefined" ? window : globalThis);
