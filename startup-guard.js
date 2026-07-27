"use strict";
(() => {
  const errors = window.__ANIMUS_STARTUP_ERRORS = window.__ANIMUS_STARTUP_ERRORS || [];
  let ready = false;
  let dismissed = false;

  const record = (type, detail) => {
    errors.push({ time: new Date().toISOString(), type, detail: String(detail || "Unknown startup error").slice(0, 1000) });
    if (errors.length > 25) errors.shift();
  };

  const dismiss = (recovered = false) => {
    if (dismissed) return;
    dismissed = true;
    const boot = document.getElementById("bootScreen");
    if (boot) {
      boot.classList.add("hide");
      boot.setAttribute("aria-hidden", "true");
      setTimeout(() => boot.remove(), 700);
    }
    if (recovered && document.body) {
      const notice = document.createElement("div");
      notice.className = "startup-recovery-notice";
      notice.setAttribute("role", "alert");
      notice.innerHTML = '<strong>Animus Companion recovered from a startup delay.</strong><span>The loading screen was released automatically. Open Settings → Diagnostics if anything appears incomplete.</span><button type="button">Dismiss</button>';
      notice.querySelector("button")?.addEventListener("click", () => notice.remove());
      document.body.appendChild(notice);
    }
  };

  window.addEventListener("error", event => record("error", event.error?.stack || event.message), true);
  window.addEventListener("securitypolicyviolation", event => record("csp", `${event.violatedDirective || "policy"}: ${event.blockedURI || "unknown"}`), true);

  // Apply runtime geometry through the trusted same-origin stylesheet instead of
  // style attributes, which are forbidden by the production CSP.
  let dynamicSequence = 0;
  const dynamicRules = new Map();
  const stylesheet = () => [...document.styleSheets].find(sheet => {
    try { return sheet.href?.includes("styles.css") && !!sheet.cssRules; } catch (_) { return false; }
  });
  window.ANIMUS_SET_DYNAMIC_STYLE = (element, declarations = {}) => {
    if (!element) return false;
    const id = element.dataset.animusDynamicStyle || `d${++dynamicSequence}`;
    element.dataset.animusDynamicStyle = id;
    const selector = `[data-animus-dynamic-style="${id}"]`;
    const body = Object.entries(declarations).map(([property, value]) => `${property}:${value}`).join(";");
    const sheet = stylesheet();
    if (!sheet) return false;
    try {
      for (let index = sheet.cssRules.length - 1; index >= 0; index -= 1) {
        if (sheet.cssRules[index]?.selectorText === selector) sheet.deleteRule(index);
      }
      sheet.insertRule(`${selector}{${body}}`, sheet.cssRules.length);
      dynamicRules.set(id, true);
      return true;
    } catch (error) {
      record("dynamic-style", error.message || error);
      return false;
    }
  };
  window.addEventListener("unhandledrejection", event => record("unhandledrejection", event.reason?.stack || event.reason));
  window.addEventListener("animus:app-ready", () => {
    ready = true;
    setTimeout(() => dismiss(false), 200);
  }, { once: true });

  // Starts immediately from the document head and cannot miss DOMContentLoaded.
  setTimeout(() => dismiss(!ready), 6000);
  window.ANIMUS_DISMISS_BOOT = dismiss;
})();
