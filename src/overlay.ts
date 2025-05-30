import { OverlayOptions } from "./types";
import { getCssPosition, addElementWithAnimation, removeElementWithAnimation } from "./utils";

let overlay: HTMLDivElement | null = null;

const defaultOptions: Required<OverlayOptions> = {
  zIndex: 99999,
  backgroundColor: "rgba(54,89,181,0.95)",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "12px",
  fontSize: "14px",
  fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', monospace",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)",
};

export function createOverlay(options: OverlayOptions = {}): void {
  if (overlay) return;

  const opts = { ...defaultOptions, ...options };

  overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    z-index: ${opts.zIndex};
    background: ${opts.backgroundColor};
    color: ${opts.color};
    padding: ${opts.padding};
    border-radius: ${opts.borderRadius};
    font-size: ${opts.fontSize};
    font-family: ${opts.fontFamily};
    box-shadow: ${opts.boxShadow};
    pointer-events: none;
    top: 20px;
    right: 20px;
    user-select: none;
    max-width: 320px;
    line-height: 1.5;
    backdrop-filter: ${opts.backdropFilter};
    border: ${opts.border};
  `;

  addElementWithAnimation(overlay);
}

export function updateOverlay(elem: HTMLElement): void {
  if (!overlay) return;

  const cssPos = getCssPosition(elem);
  const rect = elem.getBoundingClientRect();

  overlay.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px; color: #a8d0ff;">🎯 Position Info</div>
    <div><b>left:</b> ${cssPos.left}</div>
    <div><b>top:</b> ${cssPos.top}</div>
    <div><b>right:</b> ${cssPos.right}</div>
    <div><b>bottom:</b> ${cssPos.bottom}</div>
    <div><b>position:</b> ${cssPos.position}</div>
    <hr style="margin: 8px 0; border: none; border-top: 1px solid rgba(255,255,255,0.3);">
    <div style="font-size: 12px; opacity: 0.9;">
      Alt+드래그로 요소 이동 • ${Math.round(rect.width)}×${Math.round(rect.height)}px
    </div>
  `;
}

export function removeOverlay(): void {
  if (overlay) {
    removeElementWithAnimation(overlay, 200);
    overlay = null;
  }
}

export function isOverlayVisible(): boolean {
  return overlay !== null;
}
