// 위치 관련 유틸리티 함수들

// 요소를 absolute 포지션으로 변환
export function convertToAbsolutePosition(elem: HTMLElement, parentRect: DOMRect): void {
  const rect = elem.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(elem);

  // 이미 absolute이면 변환하지 않음
  if (computedStyle.position === "absolute") return;

  // 현재 위치 계산
  const left = rect.left - parentRect.left + window.scrollX;
  const top = rect.top - parentRect.top + window.scrollY;

  // 스타일 적용
  elem.style.position = "absolute";
  elem.style.left = `${left}px`;
  elem.style.top = `${top}px`;
  elem.style.margin = "0";

  // inset 속성이 있다면 제거
  elem.style.removeProperty("inset");
  elem.style.removeProperty("inset-inline-start");
  elem.style.removeProperty("inset-inline-end");
  elem.style.removeProperty("inset-block-start");
  elem.style.removeProperty("inset-block-end");
}

// 요소 이동
export function moveElement(elem: HTMLElement, left: number, top: number): void {
  elem.style.left = `${left}px`;
  elem.style.top = `${top}px`;
}

// 요소의 현재 위치 가져오기
export function getElementPosition(elem: HTMLElement): { left: number; top: number } {
  return {
    left: parseInt(elem.style.left) || 0,
    top: parseInt(elem.style.top) || 0,
  };
}

// 스크롤 보정된 위치 계산
export function getScrollCompensatedPosition(
  clientX: number,
  clientY: number,
  parentRect: DOMRect,
  offsetX: number,
  offsetY: number
): { left: number; top: number } {
  return {
    left: clientX - parentRect.left - offsetX + window.scrollX,
    top: clientY - parentRect.top - offsetY + window.scrollY,
  };
}
