"use client";

import {
  MessageSquare,
  Mic,
  Play,
  Share2,
} from "lucide-react";

/**
 * Floating tool rail pinned to the right viewport edge. Mirrors the small
 * vertical icon column on servicesaustralia.gov.au pages — play audio,
 * share, comments, voice. All buttons are non-functional stubs in this
 * prototype.
 *
 * Hidden on small mobile widths via CSS; the bottom Listen bar takes over
 * there (see <ListenBar />).
 */
const tools = [
  { key: "play", label: "Listen to this page", Icon: Play },
  { key: "share", label: "Share this page", Icon: Share2 },
  { key: "comments", label: "Send feedback", Icon: MessageSquare },
  { key: "voice", label: "Use voice", Icon: Mic },
] as const;

export function ToolRail() {
  return (
    <div className="tool-rail" aria-label="Page tools">
      <ul className="tool-rail__list">
        {tools.map(({ key, label, Icon }) => (
          <li key={key}>
            <button
              type="button"
              className="tool-rail__button"
              aria-label={label}
              title={label}
            >
              <Icon size={18} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
