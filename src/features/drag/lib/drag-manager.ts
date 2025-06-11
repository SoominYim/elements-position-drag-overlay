// 드래그 관리자 (함수형)
import type { DragState } from "../../../shared/types/index.js";
import { createOverlay, updateOverlay, removeOverlay } from "../../../entities/overlay/index.js";
import { moveElement } from "../../../shared/lib/position-utils.js";
import { isCtrlKeyPressed, removeHoverHighlight, updateHoverOnScroll, setDraggingState } from "./hover-manager.js";
import { showToast } from "../../../shared/ui/toast.js";

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
  if (!e.ctrlKey) return;

  // 이미 드래그 중이면 새로운 요소 선택 방지
  if (state.isDragging) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;

  // 기존 오버레이가 있으면 제거 (새로운 요소 선택 시)
  removeOverlay();

  // position 체크 - absolute가 아니면 에러 메시지만 표시하고 리턴
  const computedStyle = window.getComputedStyle(target);
  if (computedStyle.position !== "absolute") {
    showToast(
      `드래그 불가능! 이 요소는 position: ${computedStyle.position}입니다. position: absolute인 요소만 드래그할 수 있습니다.`,
      "error"
    );
    return;
  }

  // 호버 하이라이트 제거 및 드래그 상태 설정
  removeHoverHighlight();
  setDraggingState(true);

  state.draggedElem = target;
  state.isDragging = true;

  const parent = (target.offsetParent as HTMLElement) || document.body;
  state.startParentRect = parent.getBoundingClientRect();

  // 현재 스크롤 위치 저장
  state.lastScrollX = window.scrollX;
  state.lastScrollY = window.scrollY;

  // absolute 요소이므로 변환 과정 생략 (이미 absolute임)
  const rect = target.getBoundingClientRect();
  state.offsetX = e.clientX - rect.left;
  state.offsetY = e.clientY - rect.top;

  createOverlay();
  updateOverlay(target);

  target.style.cursor = "grabbing";
  document.body.style.userSelect = "none";

  // 성공 토스트 표시
  showToast("🎯 드래그 시작", "success");

  e.preventDefault();
  e.stopPropagation();
}

// 마우스 이동 핸들러
function onMouseMove(e: MouseEvent): void {
  // 드래그 처리
  if (!state.draggedElem || !state.isDragging || !state.startParentRect) return;

  // 현재 스크롤 위치 변화량 계산
  const scrollDeltaX = window.scrollX - state.lastScrollX;
  const scrollDeltaY = window.scrollY - state.lastScrollY;

  // startParentRect를 스크롤 변화량만큼 보정
  const adjustedParentRect = {
    ...state.startParentRect,
    left: state.startParentRect.left - scrollDeltaX,
    top: state.startParentRect.top - scrollDeltaY,
  };

  // 보정된 부모 rect 기준으로 새 위치 계산
  const left = e.clientX - adjustedParentRect.left - state.offsetX;
  const top = e.clientY - adjustedParentRect.top - state.offsetY;

  moveElement(state.draggedElem, left, top);
  updateOverlay(state.draggedElem);
}

// 마우스 업 핸들러
function onMouseUp(): void {
  if (state.draggedElem && state.isDragging) {
    state.draggedElem.style.cursor = "";
    updateOverlay(state.draggedElem);

    // 드래그 완료 토스트 표시
    showToast("드래그 완료", "success");
  }

  document.body.style.userSelect = "";

  // 드래그 상태만 해제하고 draggedElem은 유지 (오버레이 지속을 위해)
  const lastDraggedElem = state.draggedElem;
  state.draggedElem = null;
  state.isDragging = false;
  state.startParentRect = null;

  // 드래그 종료 상태를 호버 매니저에 알림
  setDraggingState(false);

  // 오버레이는 즉시 제거하지 않음 - 다른 요소 선택 시에만 제거
}

// 스크롤 핸들러
function onScroll(): void {
  // 호버 하이라이트를 스크롤에 맞춰 업데이트
  updateHoverOnScroll();

  // 스크롤 위치 업데이트 (마우스 이동 핸들러에서 사용)
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

  // 호버 매니저 드래그 상태 초기화
  setDraggingState(false);

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
