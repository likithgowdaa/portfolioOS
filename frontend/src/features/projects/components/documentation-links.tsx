"use client";

import { BookOpenIcon, FileCode2Icon, FileTextIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import type { ProjectDocs } from "../data/projects";

interface DocumentationLinksProps {
  docs: ProjectDocs;
}

/**
 * Reusable documentation links.
 *
 * Renders a Documentation, Architecture Document, and/or API Reference button
 * — each only when its URL is non-empty. Never renders disabled or placeholder
 * buttons. Renders `null` when no documentation links exist.
 */
export function DocumentationLinks({ docs }: DocumentationLinksProps) {
  const links = [
    { href: docs.documentation, label: "Documentation", icon: BookOpenIcon },
    { href: docs.architecture, label: "Architecture Document", icon: FileTextIcon },
    { href: docs.apiReference, label: "API Reference", icon: FileCode2Icon },
  ].filter((link) => link.href.length > 0);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {links.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${label} — opens in a new tab`}
          data-slot="button"
          className={buttonVariants({ variant: "outline" })}
        >
          <Icon data-icon="inline-start" className="size-4" />
          {label}
        </a>
      ))}
    </div>
  );
}
