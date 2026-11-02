/** Fixed labels only: do not send form values, link text, phone numbers or query strings. */
export type WinterEvent =
  | "winter_concern_select"
  | "winter_link_click"
  | "winter_contact_click"
  | "winter_consult_submit"
  | "winter_consult_success"
  | "winter_consult_error";

export function trackWinter(event: WinterEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  try {
    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;
    gtag("event", event, { ...params, page_path: window.location.pathname });
  } catch {
    // Analytics must never interrupt navigation or consultation submission.
  }
}

export function getWinterLinkEvent(href: string, pageUrl: string) {
  const page = new URL(pageUrl);
  const link = new URL(href, page);
  const winterPage = page.pathname === "/winter" || page.pathname.startsWith("/winter/");
  if (link.origin === page.origin) {
    if (link.pathname === "/winter" && link.hash === "#consult-form") {
      return { event: "winter_contact_click" as const, action: "consult_form", target: "/winter#consult-form" };
    }
    // In-page reading/navigation is not a new visit to a winter page.
    if (link.pathname === page.pathname && (link.hash || href.startsWith("#"))) {
      return null;
    }
    if (link.pathname === "/booking/winter") {
      return { event: "winter_contact_click" as const, action: "naver_booking", target: "/booking/winter" };
    }
    if (link.pathname === "/winter" || link.pathname.startsWith("/winter/")) {
      return { event: "winter_link_click" as const, action: "view_winter", target: link.pathname };
    }
  }
  if (!winterPage) return null;
  if (link.protocol === "tel:") return { event: "winter_contact_click" as const, action: "phone", target: "phone" };
  if (link.protocol === "sms:") return { event: "winter_contact_click" as const, action: "sms", target: "sms" };
  if (link.protocol === "https:" && link.hostname === "talk.naver.com") {
    return { event: "winter_contact_click" as const, action: "naver_talk", target: "naver_talk" };
  }
  return null;
}

/** Capture runs before Next navigation and goToConsult's preventDefault. */
export function handleWinterClick(event: MouseEvent) {
  if (event.type === "auxclick" && event.button !== 1) return;
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest("a[href]");
  if (!link) return;
  try {
    const details = getWinterLinkEvent(link.getAttribute("href")!, window.location.href);
    if (!details) return;
    const placement = link.closest("[data-winter-placement]")?.getAttribute("data-winter-placement") ?? "other";
    trackWinter(details.event, { placement, action: details.action, target: details.target });
  } catch {
    // Ignore malformed URLs without affecting the click.
  }
}
