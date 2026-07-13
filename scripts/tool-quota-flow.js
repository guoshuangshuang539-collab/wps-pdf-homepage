/**
 * Site-wide shared quota funnel (demo).
 * Daily: sign-in +3/day, Premium unlimited.
 * One-time: extension +3, desktop +3 (per account, not repeatable).
 */
(function (global) {
  const STORAGE_KEY = "wps_pdf_quota_demo_v1";
  const USES_PER_STAGE = 3;

  const STAGES = {
    NEED_LOGIN: "need_login",
    ACTIVE: "active",
    NEED_EXTENSION: "need_extension",
    NEED_DESKTOP: "need_desktop",
    NEED_PREMIUM: "need_premium"
  };

  function normalizeState(state) {
    if (state.extensionInstalled && !state.extensionBonusClaimed) state.extensionBonusClaimed = true;
    if (state.desktopInstalled && !state.desktopBonusClaimed) state.desktopBonusClaimed = true;
    return state;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return normalizeState(JSON.parse(raw));
    } catch (_) {}
    return {
      loggedIn: false,
      userName: "",
      extensionInstalled: false,
      desktopInstalled: false,
      extensionBonusClaimed: false,
      desktopBonusClaimed: false,
      isPremium: false,
      usesRemaining: 0,
      stage: STAGES.NEED_LOGIN
    };
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function recalcStage(state) {
    if (!state.loggedIn) {
      state.stage = STAGES.NEED_LOGIN;
      state.usesRemaining = 0;
      return state;
    }
    if (state.isPremium) {
      state.stage = STAGES.ACTIVE;
      return state;
    }
    if (state.usesRemaining > 0) {
      state.stage = STAGES.ACTIVE;
      return state;
    }
    if (!state.extensionBonusClaimed) {
      state.stage = STAGES.NEED_EXTENSION;
      return state;
    }
    if (!state.desktopBonusClaimed) {
      state.stage = STAGES.NEED_DESKTOP;
      return state;
    }
    state.stage = STAGES.NEED_PREMIUM;
    return state;
  }

  function grantStageUses(state) {
    state.usesRemaining = USES_PER_STAGE;
    return recalcStage(state);
  }

  const QuotaFlow = {
    STAGES,
    USES_PER_STAGE,
    getState() {
      return recalcStage(normalizeState(loadState()));
    },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
      return this.getState();
    },
    setScenario(scenario) {
      const base = {
        loggedIn: false,
        userName: "",
        extensionInstalled: false,
        desktopInstalled: false,
        extensionBonusClaimed: false,
        desktopBonusClaimed: false,
        isPremium: false,
        usesRemaining: 0
      };
      if (scenario === "logged_in") Object.assign(base, { loggedIn: true, userName: "Demo User", usesRemaining: 3 });
      if (scenario === "logged_in_exhausted") Object.assign(base, { loggedIn: true, userName: "Demo User", usesRemaining: 0 });
      if (scenario === "extension") Object.assign(base, { loggedIn: true, userName: "Demo User", extensionInstalled: true, extensionBonusClaimed: true, usesRemaining: 3 });
      if (scenario === "extension_exhausted") Object.assign(base, { loggedIn: true, userName: "Demo User", extensionInstalled: true, extensionBonusClaimed: true, usesRemaining: 0 });
      if (scenario === "desktop") Object.assign(base, { loggedIn: true, userName: "Demo User", extensionInstalled: true, extensionBonusClaimed: true, desktopInstalled: true, desktopBonusClaimed: true, usesRemaining: 3 });
      if (scenario === "desktop_exhausted") Object.assign(base, { loggedIn: true, userName: "Demo User", extensionInstalled: true, extensionBonusClaimed: true, desktopInstalled: true, desktopBonusClaimed: true, usesRemaining: 0 });
      if (scenario === "exhausted") Object.assign(base, { loggedIn: true, userName: "Demo User", extensionInstalled: true, extensionBonusClaimed: true, desktopInstalled: true, desktopBonusClaimed: true, usesRemaining: 0 });
      if (scenario === "premium") Object.assign(base, { loggedIn: true, userName: "Demo User", extensionInstalled: true, extensionBonusClaimed: true, desktopInstalled: true, desktopBonusClaimed: true, isPremium: true, usesRemaining: 0 });
      recalcStage(base);
      saveState(base);
      return base;
    },
    login(name) {
      const state = loadState();
      state.loggedIn = true;
      state.userName = name || "Demo User";
      if (state.usesRemaining <= 0 && !state.extensionBonusClaimed && !state.desktopBonusClaimed) {
        grantStageUses(state);
      } else {
        recalcStage(state);
      }
      saveState(state);
      return state;
    },
    logout() {
      const state = loadState();
      state.loggedIn = false;
      state.userName = "";
      recalcStage(state);
      saveState(state);
      return state;
    },
    consumeUse() {
      const state = loadState();
      if (!state.loggedIn) {
        recalcStage(state);
        saveState(state);
        return { ok: false, state };
      }
      if (state.isPremium) {
        recalcStage(state);
        saveState(state);
        return { ok: true, state };
      }
      if (state.usesRemaining <= 0) {
        recalcStage(state);
        saveState(state);
        return { ok: false, state };
      }
      state.usesRemaining -= 1;
      recalcStage(state);
      saveState(state);
      return { ok: true, state };
    },
    installExtension() {
      const state = loadState();
      state.extensionInstalled = true;
      if (!state.extensionBonusClaimed) {
        state.extensionBonusClaimed = true;
        grantStageUses(state);
      } else {
        recalcStage(state);
      }
      saveState(state);
      return state;
    },
    installDesktop() {
      const state = loadState();
      state.desktopInstalled = true;
      if (!state.desktopBonusClaimed) {
        state.desktopBonusClaimed = true;
        grantStageUses(state);
      } else {
        recalcStage(state);
      }
      saveState(state);
      return state;
    },
    upgradePremium() {
      const state = loadState();
      state.loggedIn = true;
      state.userName = state.userName || "Demo User";
      state.isPremium = true;
      recalcStage(state);
      saveState(state);
      return state;
    },
    setUsesRemaining(n) {
      const state = loadState();
      if (!state.loggedIn) {
        state.loggedIn = true;
        state.userName = state.userName || "Demo User";
      }
      state.usesRemaining = Math.max(0, parseInt(n, 10) || 0);
      recalcStage(state);
      saveState(state);
      return state;
    },
    getQuotaSummary(state) {
      state = state || this.getState();
      if (!state.loggedIn) return { text: "—", sub: "sign in required" };
      if (state.isPremium) return { text: "<strong>Unlimited</strong>", sub: null };
      return { text: `<strong>${state.usesRemaining}</strong> uses left`, sub: null };
    },
    getQuotaRules() {
      return {
        title: "Site-wide quota",
        subtitle: "Resets daily · shared on pdf.wps.com",
        rules: [
          { text: "Sign in +3/day", hint: null, action: "login", label: "Login" },
          { text: "PDF Extension +3", hint: "One-time only", action: "extension", label: "Add Extension" },
          { text: "WPS Desktop +3", hint: "One-time only", action: "desktop", label: "Download" },
          { text: "1 use per task", hint: null, action: null, label: null },
          { text: "Premium unlimited", hint: null, action: "premium", label: "Go Premium" }
        ]
      };
    },
    getLoginGateCopy(stage, toolVerb) {
      toolVerb = toolVerb || "use this tool";
      const copies = {
        [STAGES.NEED_LOGIN]: {
          icon: "lock",
          title: `Log in to ${toolVerb}`,
          body: "Sign in for <strong>3 free uses today</strong> — resets daily across pdf.wps.com.",
          button: "Login",
          action: "login"
        },
        [STAGES.NEED_EXTENSION]: {
          icon: "extension",
          title: "Get 3 more uses with PDF Extension",
          body: "Add the extension for a <strong>one-time +3 bonus</strong>. Reinstalling won't grant again.",
          button: "Add Extension",
          action: "extension"
        },
        [STAGES.NEED_DESKTOP]: {
          icon: "download",
          title: "Unlock 3 more uses with WPS Office",
          body: "Download desktop for a <strong>one-time +3 bonus</strong>. Uninstalling won't grant again.",
          button: "Download Client",
          action: "desktop"
        },
        [STAGES.NEED_PREMIUM]: {
          icon: "workspace_premium",
          title: "Daily limit reached",
          body: "All free tries used today. Go Premium for unlimited access, or come back tomorrow.",
          button: "Go Premium",
          action: "premium"
        }
      };
      return copies[stage] || copies[STAGES.NEED_LOGIN];
    },
    getStageCopy(stage) {
      const copies = {
        [STAGES.NEED_EXTENSION]: {
          title: "Get 3 more uses with PDF Extension",
          body: "One-time +3 bonus. Not repeatable.",
          primary: "Add PDF Extension",
          secondary: "Maybe later",
          icon: "extension"
        },
        [STAGES.NEED_DESKTOP]: {
          title: "Unlock 3 more uses with WPS Office",
          body: "One-time +3 bonus. Not repeatable.",
          primary: "Free Download for Windows",
          secondary: "Remind me tomorrow",
          icon: "download"
        },
        [STAGES.NEED_PREMIUM]: {
          title: "Daily limit reached",
          body: "Upgrade for unlimited access or return tomorrow.",
          primary: "View WPS Premium",
          secondary: "Browse related tools",
          icon: "workspace_premium"
        }
      };
      return copies[stage] || copies[STAGES.NEED_EXTENSION];
    }
  };

  global.WPSQuotaFlow = QuotaFlow;
})(typeof window !== "undefined" ? window : globalThis);
