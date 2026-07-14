/**
 * Shared tool inner page controller (demo).
 */
(function (global) {
  const Links = () => global.WPSLinks;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function extForFormat(fmt) {
    const map = {
      PDF: "pdf", Word: "docx", Excel: "xlsx", PPT: "pptx", JPG: "jpg", XML: "xml",
      OBJ: "obj", STL: "stl", FBX: "fbx", "GLB/GLTF": "glb", DAE: "dae", "3MF": "3mf", PLY: "ply",
      STEP: "step"
    };
    return map[fmt] || "bin";
  }

  function mimeForExt(ext) {
    const map = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      jpg: "image/jpeg",
      xml: "application/xml",
      txt: "text/plain",
      obj: "model/obj",
      stl: "model/stl",
      fbx: "application/octet-stream",
      glb: "model/gltf-binary",
      dae: "model/vnd.collada+xml",
      "3mf": "model/3mf",
      ply: "application/x-ply",
      step: "application/step"
    };
    return map[ext] || "application/octet-stream";
  }

  function makeRtfFromName(name, from, to) {
    const text = `Converted from ${name} (${from} to ${to}) using WPS PDF Tools demo.`;
    return new Blob([`{\\rtf1\\ansi ${text.replace(/\\/g, "\\\\")} }`], { type: "application/rtf" });
  }

  function formatEta(seconds) {
    const s = Math.max(0, Math.ceil(Number(seconds) || 0));
    if (s <= 0) return "Almost done…";
    if (s < 60) return `~${s}s remaining`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem ? `~${m}m ${rem}s remaining` : `~${m}m remaining`;
  }

  async function simulateUpload(onProgress, file) {
    const durationMs = 900 + Math.min(file.size / 12000, 2200);
    const start = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / durationMs);
        const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
        onProgress({ percent: Math.round(p * 100), eta: remaining, phase: "Uploading" });
        if (p >= 1) resolve();
        else requestAnimationFrame(tick);
      };
      tick();
    });
  }

  async function simulateProcessing(onProgress, durationMs, phaseHint) {
    const start = performance.now();
    return new Promise((resolve) => {
      const tick = () => {
        const elapsed = performance.now() - start;
        const p = Math.min(1, elapsed / durationMs);
        const remaining = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
        const phase = phaseHint
          || (p < 0.15 ? "Preparing" : p < 0.85 ? "Processing" : "Finalizing");
        onProgress({ percent: Math.round(p * 100), eta: remaining, phase });
        if (p >= 1) resolve();
        else requestAnimationFrame(tick);
      };
      tick();
    });
  }

  async function processCompress(file, ratio, onProgress) {
    await simulateProcessing(onProgress, 2200 + Math.min(file.size / 8000, 1800), "Compressing");
    const reduction = ratio === "Smallest" ? 0.55 : ratio === "Recommended" ? 0.72 : 0.88;
    const outSize = Math.max(1024, Math.round(file.size * reduction));
    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer], { type: "application/pdf" });
    const base = file.name.replace(/\.pdf$/i, "") || "document";
    return {
      blob,
      filename: `${base}_compressed_${ratio.toLowerCase()}.pdf`,
      stats: {
        originalSize: file.size,
        outputSize: outSize,
        saved: file.size - outSize,
        ratio
      }
    };
  }

  function convertDurationMs(file, profile) {
    // Profiles mirror 3D capability inventory typical ranges (scaled for demo UX).
    if (profile === "mesh") return 4500 + Math.min(file.size / 4000, 12000);
    if (profile === "cad") return 7000 + Math.min(file.size / 3000, 18000);
    if (profile === "bim") return 9000 + Math.min(file.size / 2500, 22000);
    return 2600 + Math.min(file.size / 6000, 2000);
  }

  async function processConvert(file, from, to, onProgress, options) {
    const profile = options?.etaProfile || "pdf";
    const duration = convertDurationMs(file, profile);
    const phaseHint = profile === "pdf" ? "Converting" : "Converting 3D model";
    await simulateProcessing(onProgress, duration, phaseHint);
    const base = file.name.replace(/\.[^.]+$/, "") || "document";
    const outExt = extForFormat(to);
    let blob;
    let filename;

    if (to === "Word") {
      blob = makeRtfFromName(file.name, from, to);
      filename = `${base}.doc`;
    } else if (to === "PDF" && from !== "PDF") {
      const pdfHeader = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\nxref\n0 2\ntrailer<</Root 1 0 R>>\n%%EOF";
      blob = new Blob([pdfHeader], { type: "application/pdf" });
      filename = `${base}.pdf`;
    } else if (to === "JPG") {
      blob = new Blob([await file.arrayBuffer()], { type: file.type || "image/jpeg" });
      filename = `${base}.jpg`;
    } else {
      const content = `WPS PDF demo output\nSource: ${file.name}\nConversion: ${from} → ${to}\nGenerated: ${new Date().toISOString()}`;
      blob = new Blob([content], { type: mimeForExt(outExt) });
      filename = `${base}.${outExt}`;
    }

    return {
      blob,
      filename,
      stats: { from, to, originalSize: file.size, outputSize: blob.size, etaProfile: profile }
    };
  }

  function acceptForFormat(fmt) {
    const map = {
      PDF: ".pdf,application/pdf",
      Word: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      Excel: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      PPT: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
      JPG: ".jpg,.jpeg,.png,image/jpeg,image/png",
      XML: ".xml,application/xml,text/xml"
    };
    return map[fmt] || "*/*";
  }

  function renderQuotaTooltip(el, Q, handlers) {
    if (!el) return;
    const data = Q.getQuotaRules();
    const rows = data.rules.map((rule) => {
      const hint = rule.hint ? `<span class="quota-rule-hint">${rule.hint}</span>` : "";
      const btn = rule.action
        ? `<button type="button" class="quota-tooltip-action" data-quota-action="${rule.action}">${rule.label}</button>`
        : "";
      return `<li><span class="quota-rule-text"><span class="quota-rule-main">${rule.text}</span>${hint}</span>${btn}</li>`;
    }).join("");
    el.innerHTML = `
      <div class="quota-tooltip-head">
        <strong>${data.title}</strong>
        <span>${data.subtitle}</span>
      </div>
      <ul class="quota-tooltip-rules">${rows}</ul>
    `;
    el.querySelectorAll("[data-quota-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        handlers.handleAction(btn.dataset.quotaAction);
        el.classList.remove("is-visible");
      });
    });
  }

  function bindQuotaTooltip(els, Q, handlers) {
    if (!els.quotaTooltip) return;
    renderQuotaTooltip(els.quotaTooltip, Q, handlers);
    const wrap = els.quotaInfo?.closest(".quota-wrap");
    let hideTimer;
    const show = () => { clearTimeout(hideTimer); els.quotaTooltip.classList.add("is-visible"); };
    const hide = () => { hideTimer = setTimeout(() => els.quotaTooltip.classList.remove("is-visible"), 120); };
    els.quotaInfo?.addEventListener("mouseenter", show);
    els.quotaInfo?.addEventListener("focus", show);
    wrap?.addEventListener("mouseleave", hide);
    els.quotaInfo?.addEventListener("blur", hide);
    els.quotaTooltip.addEventListener("mouseenter", show);
    els.quotaTooltip.addEventListener("mouseleave", hide);
  }

  function initToolPage(config) {
    const Q = global.WPSQuotaFlow;
    const els = config.els;
    let lastResultUrl = null;
    let selectedRatio = "Recommended";
    let pendingFile = null;
    let pendingFiles = [];
    let workflowView = "upload";
    const longRunning = Boolean(config.longRunning);
    const etaProfile = config.etaProfile || "pdf";
    const progressHint =
      config.progressHint
      || (etaProfile === "mesh"
        ? "Typical mesh conversion takes about 10s–2 min. Please keep this tab open."
        : etaProfile === "cad"
          ? "Typical CAD conversion takes about 30s–5 min. Please keep this tab open."
          : etaProfile === "bim"
            ? "Typical BIM conversion takes about 1–10 min. Please keep this tab open."
            : "");

    function ensureMultiFileModal() {
      let backdrop = document.getElementById("multifile-modal");
      if (backdrop) return backdrop;
      backdrop = document.createElement("div");
      backdrop.id = "multifile-modal";
      backdrop.className = "multifile-modal-backdrop";
      backdrop.hidden = true;
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      backdrop.setAttribute("aria-labelledby", "multifile-modal-title");
      backdrop.innerHTML = `
        <div class="multifile-modal">
          <button class="multifile-modal-close" type="button" aria-label="Close" data-multifile-close>
            <span class="material-symbols-rounded">close</span>
          </button>
          <div class="multifile-modal-art" aria-hidden="true">
            <div class="art-window">
              <span class="art-tile"></span><span class="art-tile"></span><span class="art-tile"></span>
              <span class="art-tile"></span><span class="art-tile"></span><span class="art-tile"></span>
            </div>
            <span class="art-lock"><span class="material-symbols-rounded">lock</span></span>
          </div>
          <p class="multifile-modal-copy" id="multifile-modal-title">
            Free users can process only 1 file every time. Upgrade to WPS Pro+ and enjoy unlimited PDF features now!
          </p>
          <div class="multifile-modal-actions">
            <button class="btn-download-free" type="button" data-multifile-download>
              <span class="material-symbols-rounded">download</span>
              Free Download
            </button>
            <button class="btn-start-trial" type="button" data-multifile-trial>
              <span class="material-symbols-rounded">diamond</span>
              Start Free Trial
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop || e.target.closest("[data-multifile-close]")) closeMultiFileModal();
      });
      backdrop.querySelector("[data-multifile-download]")?.addEventListener("click", () => {
        Links()?.openDownload("auto");
        closeMultiFileModal();
      });
      backdrop.querySelector("[data-multifile-trial]")?.addEventListener("click", () => {
        Links()?.openPremium();
        Q.upgradePremium();
        closeMultiFileModal();
        resetResult();
        renderUI();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !backdrop.hidden) closeMultiFileModal();
      });
      return backdrop;
    }

    function openMultiFileModal() {
      const modal = ensureMultiFileModal();
      modal.hidden = false;
    }

    function closeMultiFileModal() {
      const modal = document.getElementById("multifile-modal");
      if (modal) modal.hidden = true;
    }

    function scrollToLoginGate() {
      const gate = document.getElementById("login-gate");
      if (!gate) return;
      const headerH = document.querySelector(".site-header")?.offsetHeight || 64;
      const top = gate.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }

    function flashLoginGate() {
      const gate = document.getElementById("login-gate");
      const card = els.loginGateCard;
      if (card) {
        card.classList.remove("is-flash");
        void card.offsetWidth;
        card.classList.add("is-flash");
        setTimeout(() => card.classList.remove("is-flash"), 1600);
      }
      if (gate) {
        gate.classList.remove("is-flash");
        void gate.offsetWidth;
        gate.classList.add("is-flash");
        setTimeout(() => gate.classList.remove("is-flash"), 1600);
      }
      scrollToLoginGate();
    }

    function updateUploadAvailability(state) {
      const blocked = !state.isPremium && (!state.loggedIn || state.stage !== Q.STAGES.ACTIVE);
      els.uploadZone?.classList.toggle("is-quota-blocked", blocked);
      els.btnSelectFile?.classList.toggle("is-quota-blocked", blocked);
      els.btnSelectFile?.setAttribute("aria-disabled", blocked ? "true" : "false");
    }

    function setView(view) {
      workflowView = view;
      els.uploadZone.hidden = view !== "upload";
      els.processingPanel.hidden = view !== "uploading" && view !== "processing";
      els.uploadSuccessPanel && (els.uploadSuccessPanel.hidden = view !== "upload-success");
      els.resultPanel.hidden = view !== "result";
      els.stageGate.classList.toggle("is-visible", view === "stage");
    }

    function updateProgressUI({ percent, eta, phase }) {
      els.progressBar.style.width = percent + "%";
      els.progressPercent.textContent = percent + "%";
      if (els.progressEta) {
        els.progressEta.textContent = formatEta(eta);
        els.progressEta.classList.add("progress-eta");
      }
      els.progressPhase.textContent = phase;
      els.processingPanel?.classList.toggle("is-long-running", longRunning && workflowView === "processing");
      if (els.progressHint) {
        const showHint = longRunning && workflowView === "processing" && progressHint;
        els.progressHint.hidden = !showHint;
        if (showHint) els.progressHint.textContent = progressHint;
      }
    }

    function updateSteps(active) {
      els.workspaceSteps?.forEach((step, i) => {
        step.classList.toggle("is-active", i === active);
      });
    }

    function updateLoginGate(state) {
      const stage = state.loggedIn ? state.stage : Q.STAGES.NEED_LOGIN;
      const copy = Q.getLoginGateCopy(stage, config.toolVerb);
      const titleEl = els.loginGateTitle || els.loginGateCard?.querySelector("h2");
      const bodyEl = els.loginGateBody || els.loginGateCard?.querySelector(".login-gate-text p");
      const iconEl = els.loginGateIcon || els.loginGateCard?.querySelector(".login-gate-icon .material-symbols-rounded");
      if (titleEl) titleEl.textContent = copy.title;
      if (bodyEl) bodyEl.innerHTML = copy.body;
      if (iconEl) iconEl.textContent = copy.icon;
      if (els.btnLoginPrimary) {
        els.btnLoginPrimary.textContent = copy.button;
        els.btnLoginPrimary.dataset.action = copy.action;
      }
    }

    function clearPendingFile() {
      pendingFile = null;
      pendingFiles = [];
    }

    function renderUI() {
      const state = Q.getState();
      config.onSyncDemo?.(state);

      const siteHeader = els.header || document.querySelector(".site-header");
      const chromeLogin = document.getElementById("chrome-login-link");
      if (siteHeader) {
        siteHeader.classList.toggle("is-logged-in", state.loggedIn);
      }
      if (chromeLogin) {
        chromeLogin.textContent = state.loggedIn ? state.userName : "login";
        chromeLogin.href = Links()?.SIGN_IN_URL || "#";
      }

      const showGate = !state.loggedIn || (!state.isPremium && state.stage !== Q.STAGES.ACTIVE);
      if (showGate) {
        updateLoginGate(state);
        els.loginGateCard?.classList.remove("is-hidden");
        els.formatHub?.classList.add("is-dimmed");
      } else {
        els.loginGateCard?.classList.add("is-hidden");
        els.formatHub?.classList.remove("is-dimmed");
      }

      const summary = Q.getQuotaSummary(state);
      els.quotaText.innerHTML = summary.sub
        ? `${summary.text} <span class="quota-sub">(${summary.sub})</span>`
        : summary.text;
      renderQuotaTooltip(els.quotaTooltip, Q, { handleAction });
      updateUploadAvailability(state);

      if (!state.loggedIn) {
        els.workspaceBody.classList.remove("is-locked");
        if (workflowView !== "uploading" && workflowView !== "processing" && workflowView !== "upload-success") {
          setView("upload");
          updateSteps(0);
        }
        return;
      }

      els.workspaceBody.classList.remove("is-locked");

      if (state.stage !== Q.STAGES.ACTIVE) {
        if (workflowView !== "uploading" && workflowView !== "processing" && workflowView !== "upload-success") {
          setView("upload");
          updateSteps(0);
        }
        return;
      }

      if (workflowView === "result" && els.resultPanel.dataset.visible === "true") {
        setView("result");
        updateSteps(config.mode === "compress" ? 2 : 2);
        return;
      }

      if (workflowView === "uploading") {
        setView("uploading");
        updateSteps(config.mode === "compress" ? 0 : 1);
        return;
      }

      if (workflowView === "upload-success") {
        setView("upload-success");
        updateSteps(config.mode === "compress" ? 0 : 1);
        return;
      }

      if (workflowView === "processing") {
        setView("processing");
        updateSteps(config.mode === "compress" ? 1 : 2);
        return;
      }

      setView("upload");
      updateSteps(0);
    }

    function resetResult() {
      if (lastResultUrl) URL.revokeObjectURL(lastResultUrl);
      lastResultUrl = null;
      els.resultPanel.dataset.visible = "false";
      els.resultPanel.hidden = true;
      clearPendingFile();
      workflowView = "upload";
    }

    function canStartUpload() {
      const state = Q.getState();
      return state.loggedIn && (state.isPremium || state.stage === Q.STAGES.ACTIVE);
    }

    async function startUpload(files) {
      if (!canStartUpload()) {
        flashLoginGate();
        return;
      }

      const list = Array.from(files || []).filter(Boolean);
      if (!list.length) return;

      const state = Q.getState();
      if (list.length > 1 && !state.isPremium) {
        openMultiFileModal();
        return;
      }

      pendingFiles = list;
      const file = list[0];
      pendingFile = file;
      setView("uploading");
      updateSteps(config.mode === "compress" ? 0 : 1);
      const batchLabel = list.length > 1 ? ` · ${list.length} files` : "";
      els.processFilename.textContent = file.name + batchLabel;
      els.processFilesize.textContent = formatBytes(file.size);
      els.progressBar.style.width = "0%";
      if (els.progressHint) els.progressHint.hidden = true;

      try {
        await simulateUpload(updateProgressUI, file);
        if (els.uploadSuccessFilename) {
          els.uploadSuccessFilename.textContent = list.length > 1
            ? `${list.length} files ready`
            : file.name;
        }
        if (els.uploadSuccessFilesize) {
          const total = list.reduce((sum, item) => sum + item.size, 0);
          els.uploadSuccessFilesize.textContent = formatBytes(total);
        }
        setView("upload-success");
        updateSteps(config.mode === "compress" ? 0 : 1);
      } catch (err) {
        alert("Upload failed in demo: " + err.message);
        clearPendingFile();
        setView("upload");
      }
      renderUI();
    }

    function handleUploadBack() {
      clearPendingFile();
      setView("upload");
      updateSteps(0);
      renderUI();
    }

    async function handleUploadContinue() {
      if (!pendingFile) {
        setView("upload");
        renderUI();
        return;
      }

      if (!canStartUpload()) {
        flashLoginGate();
        return;
      }

      const consume = Q.consumeUse();
      if (!consume.ok) {
        clearPendingFile();
        renderUI();
        flashLoginGate();
        return;
      }

      const file = pendingFile;
      const batch = pendingFiles.length ? pendingFiles : [file];
      setView("processing");
      updateSteps(config.mode === "compress" ? 1 : 2);
      els.progressBar.style.width = "0%";
      els.progressPhase.textContent = config.processingLabel || (config.mode === "compress" ? "Compressing" : "Converting");

      try {
        let result;
        for (let i = 0; i < batch.length; i += 1) {
          const current = batch[i];
          const prefix = batch.length > 1 ? `File ${i + 1}/${batch.length}: ` : "";
          els.processFilename.textContent = prefix + current.name;
          els.processFilesize.textContent = formatBytes(current.size);
          if (config.mode === "compress") {
            result = await processCompress(current, selectedRatio, updateProgressUI);
          } else {
            const formats = config.getFormats();
            result = await processConvert(current, formats.from, formats.to, updateProgressUI, { etaProfile });
          }
        }

        clearPendingFile();
        lastResultUrl = URL.createObjectURL(result.blob);
        els.resultFilename.textContent = batch.length > 1
          ? `${result.filename} (+${batch.length - 1} more)`
          : result.filename;
        if (result.stats.ratio) {
          els.resultStats.innerHTML = `
            <span>Original: ${formatBytes(result.stats.originalSize)}</span>
            <span>Compressed: ${formatBytes(result.stats.outputSize)}</span>
            <span class="result-saved">Saved ${formatBytes(result.stats.saved)} (${result.stats.ratio})</span>
          `;
        } else {
          els.resultStats.innerHTML = `
            <span>${result.stats.from} → ${result.stats.to}</span>
            <span>Output: ${formatBytes(result.stats.outputSize)}</span>
            ${batch.length > 1 ? `<span>${batch.length} files processed</span>` : ""}
          `;
        }
        els.downloadBtn.href = lastResultUrl;
        els.downloadBtn.download = result.filename;
        const dlLabel = config.downloadLabel || (config.mode === "compress" ? "Download compressed PDF" : "Download converted file");
        if (els.downloadLabel) els.downloadLabel.textContent = dlLabel;
        els.resultPanel.dataset.visible = "true";
        setView("result");
        updateSteps(config.mode === "compress" ? 2 : 2);
      } catch (err) {
        alert("Processing failed in demo: " + err.message);
        clearPendingFile();
        setView("upload");
      }
      renderUI();
    }

    function handleAction(action) {
      const L = Links();
      if (action === "login") L?.openSignIn();
      else if (action === "extension") { L?.openExtension(); Q.installExtension(); resetResult(); renderUI(); }
      else if (action === "desktop") { L?.openDownload("auto"); Q.installDesktop(); resetResult(); renderUI(); }
      else if (action === "premium") { L?.openPremium(); Q.upgradePremium(); resetResult(); renderUI(); }
    }

    els.btnLoginPrimary?.addEventListener("click", () => {
      handleAction(els.btnLoginPrimary.dataset.action || "login");
    });

    document.getElementById("chrome-login-link")?.addEventListener("click", (e) => {
      const state = Q.getState();
      if (!state.loggedIn) return;
      e.preventDefault();
    });

    let dragGateFlashTimer = null;

    els.btnSelectFile?.addEventListener("click", (e) => {
      if (!canStartUpload()) { e.preventDefault(); flashLoginGate(); return; }
      els.fileInput.click();
    });

    els.uploadZone?.addEventListener("click", (e) => {
      if (e.target.closest("#btn-select-file")) return;
      if (!canStartUpload()) flashLoginGate();
    });

    els.fileInput?.addEventListener("change", (e) => {
      startUpload(e.target.files);
      e.target.value = "";
    });

    ["dragenter", "dragover"].forEach((ev) => {
      els.uploadZone?.addEventListener(ev, (e) => {
        e.preventDefault();
        if (canStartUpload()) {
          els.uploadZone.classList.add("is-dragover");
          els.uploadZone.classList.remove("is-drag-denied");
        } else {
          els.uploadZone.classList.remove("is-dragover");
          els.uploadZone.classList.add("is-drag-denied");
          clearTimeout(dragGateFlashTimer);
          dragGateFlashTimer = setTimeout(() => flashLoginGate(), 120);
        }
      });
    });
    ["dragleave", "drop"].forEach((ev) => {
      els.uploadZone?.addEventListener(ev, (e) => {
        e.preventDefault();
        els.uploadZone.classList.remove("is-dragover", "is-drag-denied");
        if (ev === "drop") {
          if (!canStartUpload()) flashLoginGate();
          else startUpload(e.dataTransfer.files);
        }
      });
    });

    els.btnUploadBack?.addEventListener("click", handleUploadBack);
    els.btnUploadContinue?.addEventListener("click", handleUploadContinue);

    els.stagePrimary?.addEventListener("click", () => {
      const state = Q.getState();
      if (state.stage === Q.STAGES.NEED_EXTENSION) handleAction("extension");
      else if (state.stage === Q.STAGES.NEED_DESKTOP) handleAction("desktop");
      else if (state.stage === Q.STAGES.NEED_PREMIUM) handleAction("premium");
      resetResult();
      renderUI();
    });

    els.stageSecondary?.addEventListener("click", () => {
      const state = Q.getState();
      if (state.stage === Q.STAGES.NEED_PREMIUM) {
        document.getElementById("related-tools")?.scrollIntoView({ behavior: "smooth" });
      }
    });

    els.btnDownloadClient?.addEventListener("click", () => {
      Links()?.openDownload("auto");
    });

    els.ratioButtons?.forEach((btn) => {
      btn.addEventListener("click", () => {
        els.ratioButtons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedRatio = btn.dataset.ratio;
      });
    });

    bindQuotaTooltip(els, Q, { handleAction });

    config.bindFormatPicker?.();

    config.bindDemoPanel?.(renderUI, resetResult);

    if (els.btnUploadContinue && config.continueLabel) {
      els.btnUploadContinue.textContent = config.continueLabel;
    }

    Links()?.wireDownloadTriggers(document.getElementById("tool-content-mount"));
    renderUI();
  }

  global.WPSToolPage = {
    initToolPage,
    formatBytes,
    processCompress,
    processConvert,
    acceptForFormat
  };
})(window);
