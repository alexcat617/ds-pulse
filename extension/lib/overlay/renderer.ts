import type { Violation } from "../audit/types";
import { OVERLAY_ROOT_ID } from "../messages";

const STYLES = `
  :host {
    all: initial;
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483646;
  }
  .layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .box {
    position: absolute;
    box-sizing: border-box;
    border: 2px solid #ef4444;
    border-radius: 4px;
    background: rgba(239, 68, 68, 0.08);
  }
  .box--pulse {
    animation: dsp-pulse 0.4s ease 2;
  }
  .pill {
    position: absolute;
    top: -22px;
    left: 0;
    max-width: 220px;
    padding: 2px 8px;
    font: 600 11px/1.3 system-ui, sans-serif;
    color: #fff;
    background: #ef4444;
    border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @keyframes dsp-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
    50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.15); }
  }
`;

export class OverlayRenderer {
  private readonly shadow: ShadowRoot;
  private readonly layer: HTMLDivElement;
  private nodeMap = new Map<string, HTMLElement>();
  private violations: Violation[] = [];
  private highlightAll = false;
  private pulseNodeId: string | null = null;
  private rafId: number | null = null;

  constructor() {
    let host = document.getElementById(OVERLAY_ROOT_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = OVERLAY_ROOT_ID;
      document.body.appendChild(host);
    }
    this.shadow =
      host.shadowRoot ?? host.attachShadow({ mode: "closed" });

    if (!this.shadow.querySelector("style")) {
      const style = document.createElement("style");
      style.textContent = STYLES;
      this.shadow.appendChild(style);
    }

    this.layer = document.createElement("div");
    this.layer.className = "layer";
    this.shadow.appendChild(this.layer);

    window.addEventListener("scroll", this.scheduleRepaint, true);
    window.addEventListener("resize", this.scheduleRepaint);
  }

  setNodeMap(map: Map<string, HTMLElement>): void {
    this.nodeMap = map;
  }

  setViolations(violations: Violation[]): void {
    this.violations = violations;
  }

  setHighlightAll(enabled: boolean): void {
    this.highlightAll = enabled;
    this.paint();
  }

  setPulse(nodeId: string | null): void {
    this.pulseNodeId = nodeId;
    this.paint();
  }

  clear(): void {
    this.highlightAll = false;
    this.pulseNodeId = null;
    this.violations = [];
    this.layer.innerHTML = "";
  }

  private scheduleRepaint = (): void => {
    if (this.rafId !== null) return;
    this.rafId = window.requestAnimationFrame(() => {
      this.rafId = null;
      this.paint();
    });
  };

  private paint(): void {
    this.layer.innerHTML = "";
    if (!this.highlightAll && !this.pulseNodeId) return;

    const ids = new Set<string>();
    if (this.highlightAll) {
      for (const v of this.violations) ids.add(v.nodeId);
    }
    if (this.pulseNodeId) ids.add(this.pulseNodeId);

    for (const nodeId of ids) {
      const el = this.nodeMap.get(nodeId);
      if (!el || !this.isOnPage(el)) continue;
      const violation =
        this.violations.find((v) => v.nodeId === nodeId) ?? this.violations[0];
      this.drawBox(el, violation, nodeId === this.pulseNodeId);
    }
  }

  private isOnPage(el: HTMLElement): boolean {
    if (!el.isConnected) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  }

  private drawBox(
    el: HTMLElement,
    violation: Violation | undefined,
    pulse: boolean,
  ): void {
    const rect = el.getBoundingClientRect();
    const box = document.createElement("div");
    box.className = pulse ? "box box--pulse" : "box";
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;

    if (violation) {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = `${violation.ruleCategory} · ${violation.tagName}`;
      box.appendChild(pill);
    }

    this.layer.appendChild(box);
  }
}