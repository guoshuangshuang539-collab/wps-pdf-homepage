/**
 * Per-slug marketing content for tool inner pages.
 * Uses crawled pdf.wps.com meta when available; otherwise accurate English copy.
 * Exposes window.WPSToolContentLibrary
 */
(function (global) {
  const DOCS = {
    compress: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/compress-pdf/",
    merge: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/merge-pdf/",
    split: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/split-pdf/",
    convert: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/convert-pdf/",
    pdfToWord: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/convert-pdf/pdf-to-word/",
    create: "https://www.wps.ai/en-US/docs/wps-pdf/quick-start/create-new-pdf/",
    blog: "https://pdf.wps.com/blog/"
  };

  const WHY_ICONS = {
    ratios: "images/tool-live/compress/why-ratios.svg",
    shield: "images/tool-live/compress/why-shield.svg",
    desktop: "images/tool-live/compress/why-desktop.svg"
  };

  const BLOG_IMGS = [
    "images/legacy/blog/blog-1.png",
    "images/legacy/blog/blog-2.png",
    "images/legacy/blog/blog-3.png"
  ];

  function why(title, items) {
    return {
      title,
      items: items.map((item) => ({
        icon: item.icon || WHY_ICONS.shield,
        title: item.title,
        body: item.body,
        href: item.href || DOCS.convert
      }))
    };
  }

  function guide(title, steps) {
    return { title, steps };
  }

  function faq(title, items) {
    return {
      title,
      items: items.map((item) => ({
        question: item.q,
        answerHtml: item.a,
        learnMore: item.more || DOCS.convert
      }))
    };
  }

  function blog(title, articles) {
    return {
      title,
      moreHref: DOCS.blog,
      articles: articles.map((a, i) => ({
        image: BLOG_IMGS[i % 3],
        href: a.href || DOCS.blog,
        title: a.title,
        body: a.body
      }))
    };
  }

  function convertGuide(pairLabel) {
    return guide(`How does ${pairLabel} conversion work?`, [
      `Select ${pairLabel} (or confirm the From / To formats in the format hub).`,
      "Upload your file to the online converter — drag and drop or click Select File.",
      "Wait for processing to finish, then click Download to save the result to your device."
    ]);
  }

  function convertWhy(name) {
    return why(`Why Choose WPS Office for ${name}?`, [
      {
        icon: WHY_ICONS.ratios,
        title: "Fast online conversion",
        body: `Convert with ${name} in your browser. No installation required — upload, convert, and download in a few steps.`,
        href: DOCS.convert
      },
      {
        icon: WHY_ICONS.shield,
        title: "Layout-aware results",
        body: "WPS conversion is tuned to keep readable structure across PDF and Office formats so you can edit or share with confidence.",
        href: DOCS.convert
      },
      {
        icon: WHY_ICONS.desktop,
        title: "Desktop when you need more",
        body: "Need offline batch work or advanced editing? Download WPS Office for PC for the full PDF and office suite.",
        href: DOCS.create
      }
    ]);
  }

  function convertFaq(name, howQ, howSteps) {
    return faq(`${name} FAQs`, [
      {
        q: howQ,
        a: `<ol>${howSteps.map((s) => `<li>${s}</li>`).join("")}</ol>`,
        more: DOCS.convert
      },
      {
        q: "Is this PDF converter free to use online?",
        a: "<p>Yes. WPS PDF Tools offers free online conversion with a daily site-wide free quota. Sign in with a free WPS account to get started. Upgrade to Premium or install desktop for more uses.</p>",
        more: DOCS.convert
      },
      {
        q: "How do I download a free PDF converter for offline use?",
        a: "<ol><li>Open the WPS PDF Tools converter page.</li><li>Use Download for All Features (or the footer download CTA) to get WPS Office.</li><li>Install WPS Office and open PDF Tools to convert offline alongside Word, Excel, and PowerPoint.</li></ol>",
        more: DOCS.convert
      }
    ]);
  }

  function convertBlog(topic) {
    return blog(`Learn More About ${topic}`, [
      {
        title: `Tips for better ${topic} results`,
        body: "Start with a clear source file, pick the right output format, and review the downloaded document before sharing it."
      },
      {
        title: "When to use online vs desktop PDF tools",
        body: "Online tools are ideal for quick one-off jobs. Desktop WPS Office is better for heavy editing, OCR, and repeated batch work."
      },
      {
        title: "Keep documents shareable and secure",
        body: "Prefer PDF when you need a fixed layout for clients; use Word or Excel when collaborators need to edit content."
      }
    ]);
  }

  const CONTENT = {
    "compress-pdf": {
      whyChoose: why("Why Choose WPS Office to Compress PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Multiple Compression Ratios",
          body: "WPS PDF Compressor supports HD, Recommended, and Smallest. Choose a ratio based on your needs while keeping quality usable for sharing.",
          href: DOCS.compress
        },
        {
          icon: WHY_ICONS.shield,
          title: "No Information Loss",
          body: "Compression is designed to preserve document information so text and structure remain intact after you download.",
          href: DOCS.compress
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Advanced Compressor Options",
          body: "Need more control? Use WPS Office for PC or keep working in the online app to make large PDFs smaller.",
          href: DOCS.compress
        }
      ]),

      faq: faq("PDF Compression FAQs", [
        {
          q: "How do I compress a large file to make it smaller online?",
          a: "<ol><li>Click Select File to upload your PDF or drag it into the upload area.</li><li>Choose HD, Recommended, or Smallest.</li><li>Wait a few seconds, then click Download to get your compressed file.</li></ol>",
          more: DOCS.compress
        },
        {
          q: "How do I know the size of a compressed file?",
          a: "<p>After compression finishes, the result panel shows the original size, compressed size, and how much space you saved.</p>",
          more: DOCS.compress
        },
        {
          q: "Is PDF file compression free?",
          a: "<p>Yes. WPS Office supports free PDF compression online with a daily quota. Upgrade to Premium or download WPS Office for more features and uses.</p>",
          more: DOCS.create
        }
      ]),
      blog: blog("Learn More About Compress PDF Online for Free", [
        {
          title: "Guideline on How to Compress PDF in InDesign",
          body: "When a PDF grows too large for email limits, compress it with WPS before sharing — or use desktop tools for production workflows."
        },
        {
          title: "Enable More Access to PDF — Free Download WPS for Windows",
          body: "WPS for Windows includes Writer, Spreadsheets, Presentation, and PDF tools in one suite with broad format compatibility."
        },
        {
          title: "How to Compress Multiple PDF Files?",
          body: "Use Premium for multi-file batches. Free users process one file per run; Premium unlocks unlimited PDF features."
        }
      ])
    },

    "split-pdf": {
      whyChoose: why("Why Choose WPS Office to Split PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Split pages in minutes",
          body: "Upload a PDF and split it into separate files online without installing software.",
          href: DOCS.split
        },
        {
          icon: WHY_ICONS.shield,
          title: "Keep pages intact",
          body: "Page content stays readable after splitting so you can send only the sections people need.",
          href: DOCS.split
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Works with Merge & Compress",
          body: "After splitting, merge pages back together or compress large outputs with other WPS PDF tools.",
          href: DOCS.merge
        }
      ]),

      faq: faq("PDF Split FAQs", [
        {
          q: "How do I split a PDF online for free?",
          a: "<ol><li>Select Split PDF and upload your file.</li><li>Start the split process.</li><li>Download the output files when processing completes.</li></ol>",
          more: DOCS.split
        },
        {
          q: "Can I split a multi-page PDF into single pages?",
          a: "<p>Yes. The Split PDF tool is designed to separate a PDF into multiple PDF files so you can keep or share only the pages you need.</p>",
          more: DOCS.split
        },
        {
          q: "Do I need to install software?",
          a: "<p>No. Split PDF works in your browser. Sign in with a free WPS account to use the daily quota.</p>",
          more: DOCS.split
        }
      ]),
      blog: blog("Learn More About Split PDF", [
        { title: "When to split vs compress a PDF", body: "Split when recipients only need certain pages; compress when the whole file is still required but too large to send." },
        { title: "Organize scanned documents faster", body: "Break long scans into topic-based PDFs, then merge or convert the pieces you keep." },
        { title: "Share only what is needed", body: "Reducing file size is not the only privacy tip — splitting removes unrelated pages before you share." }
      ])
    },

    "merge-pdf": {
      whyChoose: why("Why Choose WPS Office to Merge PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Combine files quickly",
          body: "Merge multiple PDFs into one document online without downloading separate desktop software.",
          href: DOCS.merge
        },
        {
          icon: WHY_ICONS.shield,
          title: "One file to share",
          body: "Deliver proposals, forms, and appendixes as a single PDF that is easy to email or archive.",
          href: DOCS.merge
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Pair with Compress",
          body: "After merging, compress the combined PDF if the attachment is still too large for email limits.",
          href: DOCS.compress
        }
      ]),

      faq: faq("PDF Merge FAQs", [
        {
          q: "How do I merge PDF files online for free?",
          a: "<ol><li>Open Merge PDF and upload two or more PDF files.</li><li>Continue to merge and wait for processing.</li><li>Download the combined PDF.</li></ol>",
          more: DOCS.merge
        },
        {
          q: "Can free users merge multiple files at once?",
          a: "<p>Free users can process one file per run in this demo flow. Upgrade to WPS Pro+ for multi-file batch merges and unlimited PDF features.</p>",
          more: DOCS.merge
        },
        {
          q: "Will merging change my PDF content?",
          a: "<p>Merging concatenates documents into one file. Page content from each source PDF is preserved in order.</p>",
          more: DOCS.merge
        }
      ]),
      blog: blog("Learn More About Merge PDF", [
        { title: "Build client-ready PDF packs", body: "Merge cover letters, contracts, and exhibits into one sendable packet." },
        { title: "Merge then compress for email", body: "Large merged files often need a Recommended or Smallest compress pass before sending." },
        { title: "Keep version control simple", body: "One merged PDF reduces attachment clutter when collecting signatures or reviews." }
      ])
    },

    "signing-pdf": {
      whyChoose: why("Why Choose WPS Office to Sign PDF Files?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Sign without printing",
          body: "Add an electronic signature online and download a signed PDF — no printer or scanner required.",
          href: DOCS.create
        },
        {
          icon: WHY_ICONS.shield,
          title: "Simple upload → sign → download",
          body: "The workspace walks you through signing in three clear steps with progress feedback.",
          href: DOCS.create
        },
        {
          icon: WHY_ICONS.desktop,
          title: "More signing features on desktop",
          body: "Download WPS Office for richer annotation, stamps, and PDF editing alongside eSign.",
          href: DOCS.create
        }
      ]),

      faq: faq("PDF Signing FAQs", [
        {
          q: "How do I sign a PDF online?",
          a: "<ol><li>Upload your PDF.</li><li>Continue to the sign step and apply your signature.</li><li>Download the signed document.</li></ol>",
          more: DOCS.create
        },
        {
          q: "Is online PDF signing free?",
          a: "<p>Yes, with a free WPS account and the daily site-wide quota. Premium or desktop installs unlock more daily uses.</p>",
          more: DOCS.create
        },
        {
          q: "Can I edit the PDF after signing?",
          a: "<p>For deeper editing or annotations after signing, open the file in WPS Office desktop PDF tools.</p>",
          more: DOCS.create
        }
      ]),
      blog: blog("Learn More About Sign PDF", [
        { title: "When eSign is enough", body: "Use online signing for routine acknowledgements; use regulated e-signature platforms when your industry requires audit trails." },
        { title: "Compress before you send", body: "Signed contracts with scans can be large — compress after signing if email size is a limit." },
        { title: "Keep a clean final PDF", body: "Merge related pages first, then sign once so recipients get a single signed packet." }
      ])
    },

    "convert-pdf": {
      whyChoose: convertWhy("PDF Converter"),
      guide: guide("How Do PDF Converters Work?", [
        "First, select the PDF conversion feature (Convert to or from PDF).",
        "Upload the files in the format you want to convert to the online PDF converter.",
        "Click the Download button to export the converted files to your device."
      ]),
      faq: faq("PDF Converter FAQs", [
        {
          q: "How to convert Word to PDF online?",
          a: "<ol><li>Choose Word → PDF in the format hub.</li><li>Upload your Word file.</li><li>Download the converted PDF.</li></ol>",
          more: DOCS.pdfToWord
        },
        {
          q: "How to download a PDF converter for free?",
          a: "<ol><li>WPS Office is an all-in-one suite with PDF tools.</li><li>Use Download for All Features on this page.</li><li>Open WPS Office and use PDF Converter offline with Word, Excel, and PowerPoint.</li></ol>",
          more: DOCS.convert
        },
        {
          q: "How do I save a file as PDF on PDF Converter?",
          a: "<ol><li>Select a From format that can convert to PDF (Word, Excel, PPT, JPG, or XML).</li><li>Upload the file and continue.</li><li>Download the PDF result.</li></ol>",
          more: DOCS.create
        }
      ]),
      blog: convertBlog("PDF Converter")
    },

    "pdf-to-word": {
      whyChoose: convertWhy("PDF to Word"),

      blog: convertBlog("PDF to Word")
    },
    "pdf-to-excel": {
      whyChoose: convertWhy("PDF to Excel"),

      blog: convertBlog("PDF to Excel")
    },
    "pdf-to-ppt": {
      whyChoose: convertWhy("PDF to PPT"),

      blog: convertBlog("PDF to PPT")
    },
    "pdf-to-jpg": {
      whyChoose: convertWhy("PDF to JPG"),

      blog: convertBlog("PDF to JPG")
    },
    "word-to-pdf": {
      whyChoose: convertWhy("Word to PDF"),

      blog: convertBlog("Word to PDF")
    },
    "excel-to-pdf": {
      whyChoose: convertWhy("Excel to PDF"),

      blog: convertBlog("Excel to PDF")
    },
    "ppt-to-pdf": {
      whyChoose: convertWhy("PPT to PDF"),

      blog: convertBlog("PPT to PDF")
    },
    "jpg-to-pdf": {
      whyChoose: convertWhy("JPG to PDF"),

      blog: convertBlog("JPG to PDF")
    },
    "xml-to-pdf": {
      whyChoose: convertWhy("XML to PDF"),

      blog: convertBlog("XML to PDF")
    },
    "word-to-jpg": {
      whyChoose: convertWhy("Word to JPG"),

      blog: convertBlog("Word to JPG")
    },
    "jpg-to-word": {
      whyChoose: convertWhy("JPG to Word"),

      blog: convertBlog("JPG to Word")
    },

    "mesh-converter": {
      whyChoose: why("Why Choose WPS Mesh Converter?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Broad mesh format coverage",
          body: "Convert among OBJ, STL, FBX, GLB/GLTF, DAE, 3DS, X, 3MF, OFF, AC3D, and PLY with a clear From/To format hub.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.shield,
          title: "Progress + ETA for longer jobs",
          body: "Typical mesh conversions take about 10 seconds to 2 minutes. Keep the tab open while progress and remaining time update.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Batch when you upgrade",
          body: "Free users process one file per run. Premium unlocks batch conversion for production pipelines.",
          href: DOCS.create
        }
      ]),
      guide: guide("How to convert mesh files online", [
        "Choose input and output mesh formats in the hub (same format is disabled).",
        "Upload your mesh file (or multiple if Premium).",
        "Wait for conversion — watch progress and ETA — then download the result."
      ]),
      faq: faq("Mesh Converter FAQs", [
        {
          q: "How long does mesh conversion take?",
          a: "<p>Most mesh jobs finish in about <strong>10 seconds to 2 minutes</strong>, depending on file size and polygon density. Progress and ETA stay visible during processing.</p>",
          more: DOCS.convert
        },
        {
          q: "Which formats can I convert?",
          a: "<p>Inputs include OBJ, STL, FBX, GLB/GLTF, DAE, 3DS, X, 3MF, OFF, AC3D, and PLY. Outputs include OBJ, STL, FBX, GLB/GLTF, DAE, 3MF, and PLY. Converting to the same format is not allowed.</p>",
          more: DOCS.convert
        },
        {
          q: "Is there a 3D preview?",
          a: "<p>Preview capability exists in the product roadmap, but the current online flow is upload → convert → download so you can share files quickly without a local install.</p>",
          more: DOCS.convert
        }
      ]),
      blog: blog("Learn More About Mesh Conversion", [
        { title: "OBJ vs STL for 3D printing", body: "STL remains a common print exchange format; OBJ/GLB are better when you need materials or scene graphs." },
        { title: "Why GLB/GLTF for the web", body: "GLB packages geometry and materials for real-time viewers and AR experiences." },
        { title: "Keep meshes lean before convert", body: "Decimate dense scans first when possible — smaller inputs finish faster within the 10s–2 min window." }
      ])
    },

    "cad-converter": {
      whyChoose: why("Why Choose WPS CAD Converter?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Industrial CAD to STEP or mesh",
          body: "Convert STEP, IGES, CATIA V5, NX, Creo, SolidWorks, Parasolid, Inventor, JT, PRC, ACIS, and Solid Edge to STEP, GLB/GLTF, FBX, OBJ, or STL.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.shield,
          title: "Realistic time estimates",
          body: "CAD jobs typically take <strong>30 seconds to 5 minutes</strong>. The workspace shows progress, ETA, and a long-running hint.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Know what converts to mesh",
          body: "Exporting CAD to mesh (OBJ/STL/FBX/GLB) may lose parametric history — use STEP when you need to preserve CAD exchange data.",
          href: DOCS.convert
        }
      ]),
      guide: guide("How to convert CAD files online", [
        "Pick your CAD input format and a supported output (STEP or mesh).",
        "Upload the CAD file and continue when upload completes.",
        "Keep the tab open while conversion runs (often 30s–5 min), then download."
      ]),
      faq: faq("CAD Converter FAQs", [
        {
          q: "How long does CAD conversion take?",
          a: "<p>Expect about <strong>30 seconds to 5 minutes</strong>. Larger assemblies and multi-body parts take longer. ETA updates during processing.</p>",
          more: DOCS.convert
        },
        {
          q: "Will I keep parametric data?",
          a: "<p>STEP export targets CAD interchange. Mesh outputs (GLB/FBX/OBJ/STL) are for visualization and may not preserve parametric features or PMI.</p>",
          more: DOCS.convert
        },
        {
          q: "Can I convert STEP to another STEP?",
          a: "<p>Same-format conversion is disabled. From STEP, choose a mesh output. Other CAD inputs can convert to STEP or mesh.</p>",
          more: DOCS.convert
        }
      ]),
      blog: blog("Learn More About CAD Conversion", [
        { title: "STEP for suppliers, mesh for review", body: "Send STEP when vendors need CAD; send GLB/OBJ when stakeholders only need to view the model." },
        { title: "SolidWorks and Inventor uploads", body: "Upload part or assembly files supported by the hub, then pick STEP or a mesh target." },
        { title: "Plan for 5-minute jobs", body: "Complex CAD conversions can approach the upper ETA — leave the tab open until download appears." }
      ])
    },

    "bim-converter": {
      whyChoose: why("Why Choose WPS BIM Converter?", [
        {
          icon: WHY_ICONS.ratios,
          title: "Architecture formats covered",
          body: "Convert IFC, Revit, Navisworks, DWF, AutoCAD (DWG/DXF), and SKP to GLB/GLTF, FBX, OBJ, or STL for visualization and sharing.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.shield,
          title: "Built for longer BIM jobs",
          body: "BIM conversions often take <strong>1 to 10 minutes</strong>. Progress, ETA, and on-screen hints help you wait confidently.",
          href: DOCS.convert
        },
        {
          icon: WHY_ICONS.desktop,
          title: "Upload → convert → download",
          body: "Preview may be available later; today the product flow focuses on reliable conversion and download for coordination meetings.",
          href: DOCS.convert
        }
      ]),
      guide: guide("How to convert BIM files online", [
        "Select a BIM/architecture input and a mesh output format.",
        "Upload the model and continue after upload succeeds.",
        "Allow 1–10 minutes for processing, then download the mesh file."
      ]),
      faq: faq("BIM Converter FAQs", [
        {
          q: "How long does BIM conversion take?",
          a: "<p>Typical BIM jobs run about <strong>1 to 10 minutes</strong> depending on model size and linked assets. Keep this tab open; ETA and progress update live.</p>",
          more: DOCS.convert
        },
        {
          q: "What outputs are supported?",
          a: "<p>Outputs are GLB/GLTF, FBX, OBJ, and STL — formats suited for viewers, game engines, and lightweight review — not full BIM authoring packages.</p>",
          more: DOCS.convert
        },
        {
          q: "Is batch conversion available?",
          a: "<p>Yes for Premium users. Free accounts process one file per run with the shared site-wide daily quota.</p>",
          more: DOCS.convert
        }
      ]),
      blog: blog("Learn More About BIM Conversion", [
        { title: "IFC to GLB for client walkthroughs", body: "Export IFC to GLB when non-BIM stakeholders need a lightweight 3D view." },
        { title: "Revit and Navisworks exchanges", body: "Use the BIM hub when you need mesh outputs from common AEC containers." },
        { title: "Expect longer runtimes", body: "Large buildings can approach 10 minutes — schedule conversions before reviews, not during the call." }
      ])
    }
  };

  /** Optional override from scripts/_crawled-wps-content.json (loaded by generator or future fetch). */
  function applyCrawledMeta(slug, crawled) {
    const entry = CONTENT[slug];
    if (!entry || !crawled) return entry;
    // Crawl only seeds titles/descriptions; page chrome uses catalog pageTitle/subtitle.
    // Keep library FAQ/copy; expose crawled strings for consumers that want them.
    entry.crawled = {
      h1: crawled.h1 || "",
      description: crawled.description || "",
      sourceUrl: crawled.sourceUrl || ""
    };
    return entry;
  }

  function get(slug) {
    return CONTENT[slug] || null;
  }

  function getAll() {
    return CONTENT;
  }

  global.WPSToolContentLibrary = {
    CONTENT,
    DOCS,
    get,
    getAll,
    applyCrawledMeta
  };
})(typeof window !== "undefined" ? window : globalThis);
