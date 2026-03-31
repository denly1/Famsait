"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getOrCreateSession(): string {
  try {
    let sid = sessionStorage.getItem("_fsid");
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("_fsid", sid);
    }
    return sid;
  } catch {
    return "unknown";
  }
}

export default function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string>("");

  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const session_id = getOrCreateSession();
    const referrer = document.referrer || undefined;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, event_type: "pageview", session_id, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const session_id = getOrCreateSession();

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button");
      if (!target) return;

      const tag = target.tagName.toLowerCase();
      const href = tag === "a" ? (target as HTMLAnchorElement).href : undefined;
      const text = target.textContent?.trim().slice(0, 60);

      const isBuyBtn = text?.includes("КУПИТЬ") || href?.includes("ticket") || href?.includes("билет");
      const event_type = isBuyBtn ? "ticket_click" : "click";

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: window.location.pathname,
          event_type,
          session_id,
          meta: { text, href, tag },
        }),
        keepalive: true,
      }).catch(() => {});
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
