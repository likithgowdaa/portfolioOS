"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/shared/container";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";
import type { ProfileContent } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

import { useActiveSection } from "../hooks/use-active-section";
import { isOpeningFinished, onNavReveal } from "../lib/opening";

/**
 * Top navigation for the landing experience.
 *
 * Transparent over the hero, blurred once the page scrolls, with an active
 * underline for the current section. On mobile the links collapse into an
 * animated drawer. Reveal is coordinated with the opening experience.
 */
export function Navbar({ profile }: { profile: ProfileContent }) {
  const [revealed, setRevealed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  // No broken links: the Resume link only appears once an asset exists (the
  // Resume section is hidden entirely until then).
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Journey", href: "#journey" },
    { label: "About", href: "#about" },
    { label: "Certifications", href: "#certifications" },
    ...(profile.resumeAvailable && profile.resumeUrl.length > 0
      ? [{ label: "Resume", href: profile.resumeUrl }]
      : []),
    { label: "Contact", href: "#contact" },
  ];

  // Reveal after the opening (or immediately when it is skipped).
  useEffect(() => {
    if (isOpeningFinished()) setRevealed(true);
    return onNavReveal(() => setRevealed(true));
  }, []);

  // Transparent → blurred once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActiveLink = (href: string) => href.startsWith("#") && href === `#${active}`;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: DURATION.base, ease: EASE.outExpo }}
        className={cn(
          "z-header fixed inset-x-0 top-0",
          "duration-base ease-out-quart transition-[background-color,border-color,backdrop-filter]",
          scrolled
            ? "border-border bg-background/80 border-b backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
          {/* Left — name */}
          <a href="#home" className="text-sm font-semibold tracking-tight">
            {profile.name}
          </a>

          {/* Center — desktop links */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                    className={cn(
                      "duration-fast relative rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActiveLink(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={cn(
                        "bg-foreground duration-fast absolute inset-x-3 -bottom-0.5 h-px transition-opacity",
                        isActiveLink(link.href) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — theme toggle + mobile menu */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="landing-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
            </Button>
          </div>
        </Container>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              tabIndex={-1}
              aria-label="Close menu"
              className="z-elevated fixed inset-0 bg-black/20 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: EASE.outQuart }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="drawer"
              id="landing-menu"
              aria-label="Mobile"
              className="z-header border-border bg-background fixed inset-x-0 top-16 border-b lg:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: DURATION.base, ease: EASE.outExpo }}
            >
              <Container className="flex flex-col py-2">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "duration-fast rounded-md px-3 py-2.5 text-sm transition-colors",
                      isActiveLink(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </Container>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
