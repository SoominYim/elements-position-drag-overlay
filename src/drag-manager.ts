import { DragState } from "./types";
import { createOverlay, updateOverlay, removeOverlay } from "./overlay";
import { convertToAbsolutePosition, moveElement } from "./utils";

// 드래그 상태
let state: DragState = {
  isDragging: false,
  draggedElem: null,
  offsetX: 0,
  offsetY: 0,
  startParentRect: null,
  lastScrollX: window.scrollX,
  lastScrollY: window.scrollY,
};

// 호버 상태
let hoverHighlight: HTMLDivElement | null = null;
let isAltPressed = false;
let hoveredElem: HTMLElement | null = null;

function createHoverHighlight(): void {
  if (hoverHighlight) return;

  hoverHighlight = document.createElement("div");
  hoverHighlight.style.cssText = `
    position: absolute;
    pointer-events: none;
    border: 2px solid #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
    z-index: 99998;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
    transition: all 0.15s ease;
    display: none;
  `;
  document.body.appendChild(hoverHighlight);
}

function updateHoverHighlight(elem: HTMLElement): void {
  if (!hoverHighlight) return;

  const rect = elem.getBoundingClientRect();
  hoverHighlight.style.left = rect.left + window.scrollX + "px";
  hoverHighlight.style.top = rect.top + window.scrollY + "px";
  hoverHighlight.style.width = rect.width + "px";
  hoverHighlight.style.height = rect.height + "px";
  hoverHighlight.style.display = "block";
}

function removeHoverHighlight(): void {
  if (hoverHighlight) {
    hoverHighlight.style.display = "none";
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.key === "Alt" && !state.isDragging) {
    isAltPressed = true;
    createHoverHighlight();
  }
}

function onKeyUp(e: KeyboardEvent): void {
  if (e.key === "Alt") {
    isAltPressed = false;
    removeHoverHighlight();
    hoveredElem = null;
  }
}

function onMouseOver(e: MouseEvent): void {
  if (!isAltPressed || state.isDragging) return;

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;
  if (target === hoverHighlight) return;

  if (hoveredElem !== target) {
    hoveredElem = target;
    updateHoverHighlight(target);
  }
}

export function onMouseDown(e: MouseEvent): void {
  if (!e.altKey) return;

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;
  if (target === hoverHighlight) return;

  // 호버 하이라이트 제거
  removeHoverHighlight();
  isAltPressed = false;

  state.draggedElem = target;
  state.isDragging = true;

  const parent = (target.offsetParent as HTMLElement) || document.body;
  state.startParentRect = parent.getBoundingClientRect();

  // 현재 스크롤 위치 저장
  state.lastScrollX = window.scrollX;
  state.lastScrollY = window.scrollY;

  // 요소를 absolute로 변환
  convertToAbsolutePosition(target, state.startParentRect);

  const rect = target.getBoundingClientRect();
  state.offsetX = e.clientX - rect.left;
  state.offsetY = e.clientY - rect.top;

  createOverlay();
  updateOverlay(target);

  target.style.cursor = "grabbing";
  document.body.style.userSelect = "none";

  e.preventDefault();
  e.stopPropagation();
}

export function onMouseMove(e: MouseEvent): void {
  // Alt 키 호버 처리
  if (isAltPressed && !state.isDragging) {
    onMouseOver(e);
  }

  // 드래그 처리
  if (!state.draggedElem || !state.isDragging || !state.startParentRect) return;

  const left = e.clientX - state.startParentRect.left - state.offsetX + window.scrollX;
  const top = e.clientY - state.startParentRect.top - state.offsetY + window.scrollY;

  moveElement(state.draggedElem, left, top);
  updateOverlay(state.draggedElem);
}

export function onMouseUp(): void {
  if (state.draggedElem && state.isDragging) {
    state.draggedElem.style.cursor = "";
    updateOverlay(state.draggedElem);
  }

  document.body.style.userSelect = "";
  state.draggedElem = null;
  state.isDragging = false;
  state.startParentRect = null;

  setTimeout(() => removeOverlay(), 1500);
}

export function onScroll(): void {
  // 스크롤할 때 dragging 중이면 스크롤 차이만큼 보정
  if (state.isDragging && state.draggedElem) {
    const scrollDeltaX = window.scrollX - state.lastScrollX;
    const scrollDeltaY = window.scrollY - state.lastScrollY;

    const currentLeft = parseInt(state.draggedElem.style.left) || 0;
    const currentTop = parseInt(state.draggedElem.style.top) || 0;

    moveElement(state.draggedElem, currentLeft + scrollDeltaX, currentTop + scrollDeltaY);
    updateOverlay(state.draggedElem);
  }

  // 호버 하이라이트도 스크롤에 맞춰 업데이트
  if (isAltPressed && hoveredElem && hoverHighlight) {
    updateHoverHighlight(hoveredElem);
  }

  state.lastScrollX = window.scrollX;
  state.lastScrollY = window.scrollY;
}

export function initDragListeners(): void {
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keyup", onKeyUp, true);
  document.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseup", onMouseUp, true);
  document.addEventListener("scroll", onScroll, true);
}

export function destroyDragListeners(): void {
  document.removeEventListener("keydown", onKeyDown, true);
  document.removeEventListener("keyup", onKeyUp, true);
  document.removeEventListener("mousedown", onMouseDown, true);
  document.removeEventListener("mousemove", onMouseMove, true);
  document.removeEventListener("mouseup", onMouseUp, true);
  document.removeEventListener("scroll", onScroll, true);

  if (hoverHighlight?.parentNode) {
    hoverHighlight.parentNode.removeChild(hoverHighlight);
  }
  removeOverlay();
}
