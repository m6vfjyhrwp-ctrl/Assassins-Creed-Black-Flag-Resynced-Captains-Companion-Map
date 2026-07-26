"use strict";
/** Animus Map Engine 3.2 — aspect-correct map framing, bounded pan, and anchored pinch zoom. */
(() => {
  const viewport = document.getElementById("viewport");
  const stage = document.getElementById("stage");
  const image = stage?.querySelector(".map-image");
  if (!viewport || !stage) return;

  const MAP_ASPECT = 1944 / 1665;
  const state = {
    x: 0, y: 0, scale: 1, min: 1, max: 6,
    baseWidth: 0, baseHeight: 0,
    pointers: new Map(), velocityX: 0, velocityY: 0,
    inertiaRaf: 0, renderRaf: 0, changedTimer: 0,
    lastCentroid: null, lastDistance: 0, gestureWasPinch: false
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const pointerList = () => [...state.pointers.values()];
  const setDynamicStyle = (element, declarations) => window.ANIMUS_SET_DYNAMIC_STYLE?.(element, declarations);

  function measure(preserveCenter = true) {
    const vw = Math.max(1, viewport.clientWidth);
    const vh = Math.max(1, viewport.clientHeight);
    const oldWidth = state.baseWidth || vw;
    const oldHeight = state.baseHeight || vh;
    const oldCenterX = ((vw / 2 - state.x) / state.scale) / oldWidth;
    const oldCenterY = ((vh / 2 - state.y) / state.scale) / oldHeight;

    if (vw / vh > MAP_ASPECT) {
      state.baseHeight = vh;
      state.baseWidth = vh * MAP_ASPECT;
    } else {
      state.baseWidth = vw;
      state.baseHeight = vw / MAP_ASPECT;
    }
    setDynamicStyle(stage, { width: `${state.baseWidth}px`, height: `${state.baseHeight}px` });

    if (preserveCenter && Number.isFinite(oldCenterX) && Number.isFinite(oldCenterY)) {
      state.x = vw / 2 - oldCenterX * state.baseWidth * state.scale;
      state.y = vh / 2 - oldCenterY * state.baseHeight * state.scale;
    }
  }

  function bounds() {
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const renderedWidth = state.baseWidth * state.scale;
    const renderedHeight = state.baseHeight * state.scale;
    const centeredX = (vw - renderedWidth) / 2;
    const centeredY = (vh - renderedHeight) / 2;
    return {
      minX: renderedWidth <= vw ? centeredX : vw - renderedWidth,
      maxX: renderedWidth <= vw ? centeredX : 0,
      minY: renderedHeight <= vh ? centeredY : vh - renderedHeight,
      maxY: renderedHeight <= vh ? centeredY : 0
    };
  }

  function constrain() {
    const b = bounds();
    state.x = clamp(state.x, b.minX, b.maxX);
    state.y = clamp(state.y, b.minY, b.maxY);
  }

  function notifyChange() {
    clearTimeout(state.changedTimer);
    state.changedTimer = setTimeout(() => window.dispatchEvent(new CustomEvent("acbf:map-change")), 90);
  }

  function draw(notify = true) {
    if (!state.baseWidth || !state.baseHeight) measure(false);
    constrain();
    setDynamicStyle(stage, {
      transform: `translate3d(${state.x}px,${state.y}px,0) scale(${state.scale})`,
      "--marker-scale": String(1 / Math.sqrt(state.scale))
    });
    if (notify) notifyChange();
  }

  function scheduleDraw(notify = false) {
    if (state.renderRaf) return;
    state.renderRaf = requestAnimationFrame(() => { state.renderRaf = 0; draw(notify); });
  }

  function stopInertia() {
    if (state.inertiaRaf) cancelAnimationFrame(state.inertiaRaf);
    state.inertiaRaf = 0;
  }

  function centroid(points = pointerList()) {
    if (!points.length) return null;
    const total = points.reduce((sum, p) => ({ x: sum.x + p.x, y: sum.y + p.y }), { x: 0, y: 0 });
    return { x: total.x / points.length, y: total.y / points.length };
  }

  function distance(points = pointerList()) {
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  function zoomAt(nextScale, clientX, clientY, notify = true) {
    const rect = viewport.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    const oldScale = state.scale;
    nextScale = clamp(nextScale, state.min, state.max);
    if (Math.abs(nextScale - oldScale) < 0.0005) return;
    const worldX = (px - state.x) / oldScale;
    const worldY = (py - state.y) / oldScale;
    state.scale = nextScale;
    state.x = px - worldX * nextScale;
    state.y = py - worldY * nextScale;
    if (notify) draw(); else scheduleDraw(false);
  }

  function focusPercent(xPercent, yPercent, nextScale = 2.5, targetX = viewport.clientWidth / 2, targetY = viewport.clientHeight / 2) {
    stopInertia();
    state.scale = clamp(nextScale, state.min, state.max);
    state.x = targetX - state.baseWidth * clamp(xPercent, 0, 100) / 100 * state.scale;
    state.y = targetY - state.baseHeight * clamp(yPercent, 0, 100) / 100 * state.scale;
    draw();
  }

  function centerPercent() {
    return {
      x: clamp(((viewport.clientWidth / 2 - state.x) / state.scale) / state.baseWidth * 100, 0, 100),
      y: clamp(((viewport.clientHeight / 2 - state.y) / state.scale) / state.baseHeight * 100, 0, 100)
    };
  }

  function reset() {
    stopInertia();
    state.scale = 1;
    state.velocityX = 0;
    state.velocityY = 0;
    measure(false);
    const b = bounds();
    state.x = b.minX;
    state.y = b.minY;
    draw();
    window.dispatchEvent(new CustomEvent("acbf:map-reset"));
  }

  function startGesture() {
    const points = pointerList();
    state.lastCentroid = centroid(points);
    state.lastDistance = distance(points);
    state.gestureWasPinch = points.length > 1;
    if (state.gestureWasPinch) {
      state.velocityX = 0; state.velocityY = 0;
      viewport.classList.add("is-pinching");
    } else viewport.classList.add("is-panning");
  }

  function inertia() {
    stopInertia();
    if (state.gestureWasPinch || Math.hypot(state.velocityX, state.velocityY) < 0.2) { notifyChange(); return; }
    let last = performance.now();
    const tick = now => {
      const dt = Math.min(32, now - last) / 16.67; last = now;
      state.x += state.velocityX * dt; state.y += state.velocityY * dt;
      state.velocityX *= Math.pow(0.89, dt); state.velocityY *= Math.pow(0.89, dt);
      draw(false);
      if (Math.hypot(state.velocityX, state.velocityY) > 0.16) state.inertiaRaf = requestAnimationFrame(tick);
      else { state.inertiaRaf = 0; notifyChange(); }
    };
    state.inertiaRaf = requestAnimationFrame(tick);
  }

  viewport.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    event.preventDefault(); stopInertia(); viewport.setPointerCapture?.(event.pointerId);
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, t: performance.now() }); startGesture();
  }, { passive: false });

  viewport.addEventListener("pointermove", event => {
    const previousPointer = state.pointers.get(event.pointerId); if (!previousPointer) return;
    event.preventDefault(); const now = performance.now();
    state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, t: now });
    const points = pointerList(); const nextCentroid = centroid(points);
    if (!nextCentroid || !state.lastCentroid) { startGesture(); return; }
    if (points.length === 1) {
      const dx = nextCentroid.x - state.lastCentroid.x; const dy = nextCentroid.y - state.lastCentroid.y;
      const dt = Math.max(8, now - previousPointer.t);
      state.x += dx; state.y += dy; state.velocityX = dx * 16.67 / dt; state.velocityY = dy * 16.67 / dt;
      state.lastCentroid = nextCentroid; scheduleDraw(false); return;
    }
    state.gestureWasPinch = true; viewport.classList.remove("is-panning"); viewport.classList.add("is-pinching");
    const nextDistance = distance(points); const rect = viewport.getBoundingClientRect();
    const oldCenterX = state.lastCentroid.x - rect.left; const oldCenterY = state.lastCentroid.y - rect.top;
    const newCenterX = nextCentroid.x - rect.left; const newCenterY = nextCentroid.y - rect.top;
    const oldScale = state.scale; const ratio = state.lastDistance > 0 ? nextDistance / state.lastDistance : 1;
    const nextScale = clamp(oldScale * ratio, state.min, state.max);
    const worldX = (oldCenterX - state.x) / oldScale; const worldY = (oldCenterY - state.y) / oldScale;
    state.scale = nextScale; state.x = newCenterX - worldX * nextScale; state.y = newCenterY - worldY * nextScale;
    state.lastCentroid = nextCentroid; state.lastDistance = nextDistance; state.velocityX = 0; state.velocityY = 0;
    scheduleDraw(false);
  }, { passive: false });

  function endPointer(event) {
    if (!state.pointers.has(event.pointerId)) return;
    state.pointers.delete(event.pointerId); try { viewport.releasePointerCapture?.(event.pointerId); } catch (_) {}
    viewport.classList.remove("is-pinching", "is-panning");
    if (!state.pointers.size) { state.lastCentroid = null; state.lastDistance = 0; draw(false); inertia(); return; }
    startGesture();
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("lostpointercapture", endPointer);
  viewport.addEventListener("dblclick", event => { event.preventDefault(); zoomAt(state.scale < 2.5 ? state.scale * 1.65 : 1, event.clientX, event.clientY); });
  viewport.addEventListener("wheel", event => { event.preventDefault(); zoomAt(state.scale * Math.exp(-event.deltaY * 0.0015), event.clientX, event.clientY); }, { passive: false });
  document.getElementById("zoomIn")?.addEventListener("click", () => { const r = viewport.getBoundingClientRect(); zoomAt(state.scale * 1.35, r.left + r.width / 2, r.top + r.height / 2); });
  document.getElementById("zoomOut")?.addEventListener("click", () => { const r = viewport.getBoundingClientRect(); zoomAt(state.scale / 1.35, r.left + r.width / 2, r.top + r.height / 2); });
  document.getElementById("reset")?.addEventListener("click", reset);
  window.addEventListener("resize", () => { measure(true); draw(false); }, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(() => { measure(true); draw(false); }, 120), { passive: true });
  image?.addEventListener("load", () => { measure(true); draw(false); }, { once: true });

  window.ACBF_MAP = {
    reset,
    getState: () => ({ x: state.x, y: state.y, scale: state.scale }),
    getGeometry: () => ({ width: state.baseWidth, height: state.baseHeight, aspect: MAP_ASPECT, bounds: bounds() }),
    getCenterPercent: centerPercent,
    zoomTo: zoomAt,
    focusPercent,
    setState: next => {
      if (!next || !Number.isFinite(next.scale)) return;
      stopInertia(); measure(false);
      state.scale = clamp(next.scale, state.min, state.max); state.x = Number(next.x) || 0; state.y = Number(next.y) || 0; draw();
    }
  };

  measure(false);
  reset();
})();
