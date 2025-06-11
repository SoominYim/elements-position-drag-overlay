// 오버레이 엔티티
import type { Position } from "../../shared/types/index.js";

// 오버레이 상태
let overlay: HTMLDivElement | null = null;

// 요소의 위치 정보 계산
function getElementPosition(elem: HTMLElement): Position {
  const rect = elem.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(elem);

  return {
    left: parseInt(elem.style.left) || 0,
    top: parseInt(elem.style.top) || 0,
    right: rect.right,
    bottom: rect.bottom,
    position: computedStyle.position,
  };
}

// 오버레이 생성
export function createOverlay(): void {
  if (overlay) return;

  overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 12px;
    line-height: 1.4;
    z-index: 99999;
    pointer-events: none;
    white-space: pre;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    border: 1px solid #333;
  `;
  document.body.appendChild(overlay);
}

// 오버레이 업데이트
export function updateOverlay(elem: HTMLElement): void {
  if (!overlay) return;

  const pos = getElementPosition(elem);
  overlay.textContent =
    `left: ${pos.left}px\n` +
    `top: ${pos.top}px\n` +
    `right: ${Math.round(pos.right)}px\n` +
    `bottom: ${Math.round(pos.bottom)}px`;
}

// 오버레이 제거
export function removeOverlay(): void {
  if (overlay?.parentNode) {
    overlay.parentNode.removeChild(overlay);
    overlay = null;
  }
}
