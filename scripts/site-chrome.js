/**
 * Mount shared homepage header + footer on tool inner pages.
 */
(function (global) {
  function initNavDropdowns(root) {
    root.querySelectorAll(".nav-item").forEach((item) => {
      const trigger = item.querySelector(".nav-trigger");
      if (!trigger) return;
      const desktopMenu = item.querySelector(".desktop-menu");
      const positionDesktopMenu = () => {
        if (!desktopMenu) return;
        const triggerRect = trigger.getBoundingClientRect();
        const menuWidth = Math.min(1200, window.innerWidth - 48);
        const maxLeft = Math.max(24, window.innerWidth - menuWidth - 24);
        const left = Math.min(Math.max(24, triggerRect.left), maxLeft);
        desktopMenu.style.setProperty("--desktop-menu-left", `${Math.round(left)}px`);
      };
      const setExpanded = (expanded) => {
        if (expanded) positionDesktopMenu();
        item.classList.toggle("is-open", expanded);
        trigger.setAttribute("aria-expanded", String(expanded));
      };
      item.addEventListener("mouseenter", () => setExpanded(true));
      item.addEventListener("mouseleave", () => setExpanded(false));
      item.addEventListener("focusin", () => setExpanded(true));
      item.addEventListener("focusout", (e) => { if (!item.contains(e.relatedTarget)) setExpanded(false); });
      trigger.addEventListener("click", () => setExpanded(!item.classList.contains("is-open")));
      window.addEventListener("resize", () => { if (item.classList.contains("is-open")) positionDesktopMenu(); });
    });
  }

  function initHeaderLanguagePicker(root) {
    const picker = root.querySelector(".header-language-picker");
    const button = picker?.querySelector(".header-language-button");
    const menu = picker?.querySelector(".header-language-menu");
    if (!picker || !button || !menu) return;

    const close = () => {
      picker.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      picker.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      picker.classList.contains("is-open") ? close() : open();
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        menu.querySelectorAll("a").forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
        close();
      });
    });
    document.addEventListener("click", (e) => {
      if (!picker.contains(e.target)) close();
    });
  }

  function initFooterLanguagePicker(root) {
    const picker = root.querySelector(".language-picker");
    const button = picker?.querySelector(".language");
    const menu = picker?.querySelector(".language-menu");
    const label = picker?.querySelector(".language-label");
    if (!picker || !button) return;

    const close = () => {
      picker.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      picker.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(picker.classList.contains("is-open")));
    });
    menu?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        menu.querySelectorAll("a").forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
        if (label) label.textContent = link.textContent.trim();
        close();
      });
    });
    document.addEventListener("click", (e) => {
      if (!picker.contains(e.target)) close();
    });
  }

  function initHeaderScroll(header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileMenu(headerRoot) {
    const menuButton = headerRoot.querySelector(".menu-button, #chrome-menu-button");
    const mobileMenu = document.getElementById("chrome-mobile-menu") || document.querySelector(".mobile-menu");
    if (!menuButton || !mobileMenu) return;

    const close = () => {
      document.body.classList.remove("is-menu-open");
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
    };
    const open = () => {
      document.body.classList.add("is-menu-open");
      menuButton.setAttribute("aria-expanded", "true");
      mobileMenu.classList.add("is-open");
    };

    menuButton.addEventListener("click", () => {
      mobileMenu.classList.contains("is-open") ? close() : open();
    });
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => close());
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function parseChromeDoc(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const headerPart = doc.querySelector('[data-chrome-part="header"]');
    return {
      header: headerPart?.innerHTML || "",
      footer: doc.querySelector('[data-chrome-part="footer"]')?.innerHTML || ""
    };
  }

  async function loadChromeParts() {
    try {
      const res = await fetch("partials/site-chrome.html");
      if (res.ok) return parseChromeDoc(await res.text());
    } catch (_) {}

    const tpl = document.getElementById("site-chrome-fallback");
    if (tpl?.innerHTML.trim()) return parseChromeDoc(tpl.innerHTML);
    return null;
  }

  async function mount() {
    const headerSlot = document.getElementById("site-chrome-header");
    const footerSlot = document.getElementById("site-chrome-footer");
    if (!headerSlot || !footerSlot) return;

    const parts = await loadChromeParts();
    if (parts) {
      headerSlot.innerHTML = parts.header;
      footerSlot.innerHTML = parts.footer;
    }

    const header = document.querySelector(".site-header");
    if (header) {
      initNavDropdowns(header);
      initHeaderScroll(header);
      initHeaderLanguagePicker(header);
      initMobileMenu(header);
      global.WPSLinks?.wireDownloadTriggers(document.getElementById("site-chrome-header") || header);
      global.WPSSiteNav3D?.render3DNavMenu(document);
      global.WPSToolRoutes?.wireHomepage(document);
    }

    const footer = document.querySelector(".footer");
    if (footer) {
      initFooterLanguagePicker(footer);
      global.WPSLinks?.wireDownloadTriggers(footer);
    }

    const directory = document.querySelector("[data-tools-directory]");
    global.WPSToolsDirectory?.render(directory);
    global.WPSLinks?.wireDownloadTriggers(document.getElementById("site-chrome-footer") || document);
  }

  global.WPSSiteChrome = { mount };
})(typeof window !== "undefined" ? window : globalThis);
