// 드래그 관리자 (함수형)
import type { DragState } from "../../../shared/types/index.js";
import { createOverlay, updateOverlay, removeOverlay } from "../../../entities/overlay/index.js";
import { convertToAbsolutePosition, moveElement } from "../../../shared/lib/position-utils.js";
import { isAltKeyPressed, removeHoverHighlight, updateHoverOnScroll } from "./hover-manager.js";

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

// 마우스 다운 핸들러
function onMouseDown(e: MouseEvent): void {
  if (!e.altKey) return;

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;

  // 호버 하이라이트 제거
  removeHoverHighlight();

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

// 마우스 이동 핸들러
function onMouseMove(e: MouseEvent): void {
  // 드래그 처리
  if (!state.draggedElem || !state.isDragging || !state.startParentRect) return;

  const left = e.clientX - state.startParentRect.left - state.offsetX + window.scrollX;
  const top = e.clientY - state.startParentRect.top - state.offsetY + window.scrollY;

  moveElement(state.draggedElem, left, top);
  updateOverlay(state.draggedElem);
}

// 마우스 업 핸들러
function onMouseUp(): void {
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

// 스크롤 핸들러
function onScroll(): void {
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
  updateHoverOnScroll();

  state.lastScrollX = window.scrollX;
  state.lastScrollY = window.scrollY;
}

// 드래그 매니저 초기화
export function initDragManager(): void {
  document.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseup", onMouseUp, true);
  document.addEventListener("scroll", onScroll, true);
}

// 드래그 매니저 정리
export function destroyDragManager(): void {
  document.removeEventListener("mousedown", onMouseDown, true);
  document.removeEventListener("mousemove", onMouseMove, true);
  document.removeEventListener("mouseup", onMouseUp, true);
  document.removeEventListener("scroll", onScroll, true);

  removeOverlay();

  // 상태 초기화
  state = {
    isDragging: false,
    draggedElem: null,
    offsetX: 0,
    offsetY: 0,
    startParentRect: null,
    lastScrollX: window.scrollX,
    lastScrollY: window.scrollY,
  };
}
