const SKIP_TAGS = new Set([
  "HTML",
  "HEAD",
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "META",
  "LINK",
  "TITLE",
]);

export function shouldSkipTag(tagName: string): boolean {
  return SKIP_TAGS.has(tagName);
}

export function isElementVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none") return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

export function shouldAuditElement(el: Element): boolean {
  const tag = el.tagName;
  if (shouldSkipTag(tag)) return false;
  if (
    tag === "BUTTON" ||
    tag === "INPUT" ||
    tag === "H1" ||
    tag === "H2" ||
    tag === "H3" ||
    tag === "P" ||
    tag === "SPAN" ||
    tag === "A"
  ) {
    return true;
  }
  return Array.from(el.classList).some((c) => c.startsWith("ds-"));
}

export function countVisibleElements(root: ParentNode): number {
  let count = 0;
  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (shouldSkipTag(el.tagName)) continue;
    if (isElementVisible(el)) count += 1;
  }
  return count;
}