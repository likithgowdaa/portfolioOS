"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type CursorVariant = "default" | "hover" | "clickable" | "text" | "loading";

/** Elements that opt into a specific cursor state via `data-cursor`. */
const CURSOR_ATTR = "data-cursor";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  '[role="button"]',
  '[role="link"]',
  "select",
  "summary",
  "input[type='submit']",
  "input[type='checkbox']",
  "input[type='radio']",
].join(", ");

const TEXT_SELECTOR = [
  "input:not([type='checkbox']):not([type='radio']):not([type='submit'])",
  "textarea",
  "[contenteditable='true']",
  "label",
].join(", ");

/**
 * PortfolioOS custom cursor.
 *
 * A rounded dot + ring that follows the pointer. It only activates when the
 * pointer is fine (mouse/trackpad) **and** the user has not asked for reduced
 * motion; otherwise it renders nothing and the native cursor stays.
 *
 * State is driven by `data-cursor` attributes or by element type:
 *   data-cursor="hover"|"clickable"|"text"|"loading"|"none"
 *
 * Mount once in the root layout. Renders null on touch devices.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [pressed, setPressed] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 400, damping: 32, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 400, damping: 32, mass: 0.5 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!finePointer || reducedMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const handleMove = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.classList.remove("cursor-custom");
    };
  }, [dotX, dotY]);

  // Resolve the cursor variant from whatever is under the pointer.
  useEffect(() => {
    if (!enabled) return;

    const handleOver = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const optIn = target.closest(`[${CURSOR_ATTR}]`);
      if (optIn) {
        const value = optIn.getAttribute(CURSOR_ATTR);
        if (value === "none") return setVariant("default");
        if (value === "hover" || value === "clickable" || value === "text" || value === "loading") {
          return setVariant(value);
        }
      }
      if (target.closest(INTERACTIVE_SELECTOR)) return setVariant("hover");
      if (target.closest(TEXT_SELECTOR)) return setVariant("text");
      setVariant("default");
    };

    document.addEventListener("mouseover", handleOver);
    return () => document.removeEventListener("mouseover", handleOver);
  }, [enabled]);

  // Press feedback.
  useEffect(() => {
    if (!enabled) return;
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isLoading = variant === "loading";

  return (
    <motion.div
      aria-hidden
      className={cn(
        "z-cursor duration-base ease-out-quart pointer-events-none fixed top-0 left-0 transition-opacity",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{ x: ringX, y: ringY }}
    >
      {/* Follow ring */}
      <div
        data-cursor-ring
        className={cn(
          "duration-base ease-out-quart -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,background-color]",
          isLoading
            ? "border-t-foreground/60 border-foreground/20 size-10 animate-spin"
            : variant === "clickable"
              ? "border-foreground/60 bg-foreground/5 size-10"
              : variant === "hover"
                ? "border-foreground/50 size-9"
                : variant === "text"
                  ? "border-foreground/20 size-6"
                  : "border-foreground/30 size-8",
          pressed && !isLoading && "scale-90"
        )}
      />

      {/* Center dot */}
      <div
        data-cursor-dot
        className={cn(
          "bg-foreground duration-fast ease-out-quart -translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color]",
          isLoading
            ? "bg-foreground/80 size-1.5"
            : variant === "text"
              ? "size-[3px] h-6"
              : variant === "hover"
                ? "size-1.5"
                : "size-2",
          pressed && !isLoading && "scale-75"
        )}
      />
    </motion.div>
  );
}
