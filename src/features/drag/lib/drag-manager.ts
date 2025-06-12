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
  // Windows: Ctrl, Mac: Cmd 키 지원
  if (!e.ctrlKey && !e.metaKey) return;

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
  if (!state.isDragging || !state.draggedElem || !state.startParentRect) return;

  // 스크롤 변화량 계산
  const scrollDeltaX = window.scrollX - state.lastScrollX;
  const scrollDeltaY = window.scrollY - state.lastScrollY;

  // 부모 요소의 현재 위치 (스크롤 보정)
  const currentParentRect = {
    left: state.startParentRect.left - scrollDeltaX,
    top: state.startParentRect.top - scrollDeltaY,
  };

  // 마우스 위치를 부모 기준 좌표로 변환
  const newLeft = e.clientX - currentParentRect.left - state.offsetX;
  const newTop = e.clientY - currentParentRect.top - state.offsetY;

  // 요소 이동
  moveElement(state.draggedElem, newLeft, newTop);

  // 오버레이 업데이트
  updateOverlay(state.draggedElem);
}

// 마우스 업 핸들러
function onMouseUp(e: MouseEvent): void {
  if (!state.isDragging || !state.draggedElem) return;

  // 드래그 상태 해제
  setDraggingState(false);
  state.isDragging = false;

  // 스타일 복원
  state.draggedElem.style.cursor = "";
  document.body.style.userSelect = "";

  // 성공 토스트 표시
  showToast("✅ 드래그 완료", "success");

  // 상태 초기화
  state.draggedElem = null;
  state.startParentRect = null;
}

// 스크롤 핸들러
function onScroll(): void {
  if (state.isDragging && state.draggedElem) {
    updateOverlay(state.draggedElem);
  }
  updateHoverOnScroll();
}

// 키보드 핸들러
function onKeyDown(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    if (state.isDragging) {
      // 드래그 중이면 취소
      onMouseUp(new MouseEvent("mouseup"));
    }
    removeOverlay();
  }
}

// 드래그 매니저 초기화
export function initDragManager(): void {
  document.addEventListener("mousedown", onMouseDown, true);
  document.addEventListener("mousemove", onMouseMove, true);
  document.addEventListener("mouseup", onMouseUp, true);
  document.addEventListener("scroll", onScroll, true);
  document.addEventListener("keydown", onKeyDown, true);
}

// 드래그 매니저 정리
export function destroyDragManager(): void {
  document.removeEventListener("mousedown", onMouseDown, true);
  document.removeEventListener("mousemove", onMouseMove, true);
  document.removeEventListener("mouseup", onMouseUp, true);
  document.removeEventListener("scroll", onScroll, true);
  document.removeEventListener("keydown", onKeyDown, true);

  // 상태 초기화
  if (state.isDragging && state.draggedElem) {
    state.draggedElem.style.cursor = "";
    document.body.style.userSelect = "";
  }

  state.isDragging = false;
  state.draggedElem = null;
  state.startParentRect = null;
  setDraggingState(false);
}
