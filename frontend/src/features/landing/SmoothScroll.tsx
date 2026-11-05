"use client";

import { useEffect } from "react";

/** Share of the remaining distance covered per 60fps frame; lower = longer glide. */
const LERP = 0.085;

/** True when the wheel event should scroll a nested scroller instead of the page. */
function insideScroller(e: WheelEvent) {
  for (const node of e.composedPath()) {
    if (!(node instanceof HTMLElement) || node === document.documentElement || node === document.body) continue;
    if (node.dataset.nativeScroll !== undefined) return true;
    const { overflowY } = getComputedStyle(node);
    if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight) {
      const atTop = node.scrollTop <= 0;
      const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return true;
    }
  }
  return false;
}

/**
 * Inertial page scroll for mouse wheels and trackpads (Lenis-style easing without the dependency).
 * Touch, keyboard, scrollbar drag and reduced-motion users keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;

    const root = document.documentElement;
    let target = scrollY;
    let current = scrollY;
    let frame = 0;
    let last = 0;

    const clamp = (y: number) => Math.max(0, Math.min(root.scrollHeight - innerHeight, y));

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / (1000 / 60), 4) : 1;
      last = now;
      current += (target - current) * (1 - Math.pow(1 - LERP, dt));
      if (Math.abs(target - current) < 0.4) current = target;
      scrollTo({ top: current, behavior: "instant" });
      if (current === target) {
        frame = 0;
        last = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY) || insideScroller(e)) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
      target = clamp(target + e.deltaY * unit);
      run();
    };

    // Keyboard, scrollbar and find-in-page move the page natively; resync so the next wheel starts from there.
    const onScroll = () => {
      if (!frame) target = current = scrollY;
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.hash.slice(1);
      const el = id ? document.getElementById(decodeURIComponent(id)) : null;
      if (!link || !el) return;
      e.preventDefault();
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      target = clamp(el.getBoundingClientRect().top + scrollY - margin);
      history.pushState(null, "", link.hash);
      run();
    };

    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("wheel", onWheel);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
