/**
 * Normalize CSS color strings to uppercase #RRGGBB (opaque). Returns null if transparent / unparseable.
 */
export function normalizeColorToHex(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || trimmed === "transparent") return null;

  const hexMatch = /^#([0-9a-f]{3,8})$/.exec(trimmed);
  if (hexMatch) {
    const h = hexMatch[1];
    if (h.length === 3) {
      return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toUpperCase();
    }
    if (h.length === 6) return `#${h}`.toUpperCase();
    if (h.length === 8) return `#${h.slice(0, 6)}`.toUpperCase();
  }

  const rgbaMatch =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(
      trimmed,
    );
  if (rgbaMatch) {
    const alpha = rgbaMatch[4] !== undefined ? Number(rgbaMatch[4]) : 1;
    if (alpha === 0) return null;
    const r = Math.round(Number(rgbaMatch[1]));
    const g = Math.round(Number(rgbaMatch[2]));
    const b = Math.round(Number(rgbaMatch[3]));
    return `#${byteHex(r)}${byteHex(g)}${byteHex(b)}`;
  }

  return null;
}

function byteHex(n: number): string {
  const clamped = Math.min(255, Math.max(0, n));
  return clamped.toString(16).padStart(2, "0").toUpperCase();
}