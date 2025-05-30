// Web Demo Script - Elements Position Overlay
import { createOverlay, updateOverlay, removeOverlay } from "./overlay";
import { updateStatus, convertToAbsolutePosition, moveElement } from "./utils";

// 데모용 드래그 상태
let draggedElem: HTMLElement | null = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let startParentRect: DOMRect | null = null;

function onMouseDown(e: MouseEvent): void {
  if (!e.altKey) {
    updateStatus("Alt 키를 누르고 드래그하세요!", "info");
    return;
  }

  const target = e.target as HTMLElement;
  draggedElem = target;
  isDragging = true;
  updateStatus("드래그 시작!", "active");

  const parent = (target.offsetParent as HTMLElement) || document.body;
  startParentRect = parent.getBoundingClientRect();

  // position 설정
  if (getComputedStyle(target).position === "static") {
    convertToAbsolutePosition(target, startParentRect);
  }

  const rect = target.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  createOverlay();
  updateOverlay(target);

  target.style.cursor = "grabbing";
  target.style.transform = "scale(1.02)";
  document.body.style.userSelect = "none";

  e.preventDefault();
}

function onMouseMove(e: MouseEvent): void {
  if (!draggedElem || !isDragging || !startParentRect) return;

  const left = e.clientX - startParentRect.left - offsetX + window.scrollX;
  const top = e.clientY - startParentRect.top - offsetY + window.scrollY;

  moveElement(draggedElem, left, top);
  updateOverlay(draggedElem);
  updateStatus("위치 업데이트 중...", "active");
}

function onMouseUp(): void {
  if (draggedElem && isDragging) {
    draggedElem.style.cursor = "grab";
    draggedElem.style.transform = "scale(1)";
    updateOverlay(draggedElem);
    updateStatus("완료! 위치가 설정되었습니다", "success");
  }

  document.body.style.userSelect = "";
  draggedElem = null;
  isDragging = false;
  startParentRect = null;

  setTimeout(() => {
    removeOverlay();
    updateStatus("Ready", "info");
  }, 2000);
}

function onKeyDown(e: KeyboardEvent): void {
  if (e.altKey && !isDragging) {
    updateStatus("Alt 키 활성화 - 드래그 가능!", "active");
  }
}

function onKeyUp(e: KeyboardEvent): void {
  if (e.key === "Alt" && !isDragging) {
    updateStatus("Ready", "info");
  }
}

function initWebDemo(): void {
  const box = document.getElementById("demoBox") as HTMLElement;

  if (box) {
    box.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  initWebDemo();
  updateStatus("Ready", "success");
  console.log("🎯 Elements Position Overlay 웹 데모가 로드되었습니다!");
});
