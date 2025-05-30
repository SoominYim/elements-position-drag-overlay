import { CssPosition, OverlayOptions, StatusType } from "./types";

/**
 * 요소의 CSS position 값들을 가져옵니다
 */
export function getCssPosition(elem: HTMLElement): CssPosition {
  const style = getComputedStyle(elem);
  return {
    left: style.left,
    top: style.top,
    right: style.right,
    bottom: style.bottom,
    position: style.position,
  };
}

/**
 * 상태 메시지를 업데이트합니다
 */
export function updateStatus(message: string, type: StatusType = "info"): void {
  const status = document.getElementById("status");
  if (status) {
    const icons: Record<StatusType, string> = {
      success: "✅",
      info: "💡",
      active: "🎯",
      error: "❌",
    };
    status.textContent = `${icons[type]} ${message}`;

    const colors: Record<StatusType, string> = {
      success: "rgba(0,128,0,0.9)",
      info: "rgba(0,0,0,0.8)",
      active: "rgba(54,89,181,0.9)",
      error: "rgba(255,0,0,0.9)",
    };
    status.style.background = colors[type];
  }
}

/**
 * 요소의 position을 absolute로 변환하고 left/top 속성만 사용하도록 설정
 */
export function convertToAbsolutePosition(element: HTMLElement, parentRect: DOMRect): void {
  const computedStyle = getComputedStyle(element);

  if (computedStyle.position === "static") {
    const rect = element.getBoundingClientRect();
    element.style.position = "absolute";

    // 확실히 left/top만 설정하고 다른 속성들 초기화
    element.style.left = rect.left - parentRect.left + window.scrollX + "px";
    element.style.top = rect.top - parentRect.top + window.scrollY + "px";
    element.style.right = "";
    element.style.bottom = "";
    element.style.inset = "";
    element.style.insetInlineStart = "";
    element.style.insetInlineEnd = "";
    element.style.insetBlockStart = "";
    element.style.insetBlockEnd = "";
  }
}

/**
 * 요소를 새로운 위치로 이동 (left/top만 사용)
 */
export function moveElement(element: HTMLElement, left: number, top: number): void {
  element.style.left = left + "px";
  element.style.top = top + "px";
  element.style.right = "";
  element.style.bottom = "";
  element.style.inset = "";
}

/**
 * 애니메이션과 함께 요소를 DOM에 추가
 */
export function addElementWithAnimation(element: HTMLElement, parent: HTMLElement = document.body): void {
  element.style.opacity = "0";
  element.style.transform = "translateY(-10px)";
  element.style.transition = "all 0.3s ease";

  parent.appendChild(element);

  requestAnimationFrame(() => {
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  });
}

/**
 * 애니메이션과 함께 요소를 DOM에서 제거
 */
export function removeElementWithAnimation(element: HTMLElement, duration: number = 300): void {
  element.style.opacity = "0";
  element.style.transform = "translateY(-10px)";

  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }, duration);
}
