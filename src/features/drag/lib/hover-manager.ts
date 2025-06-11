// 호버 하이라이트 관리자 (함수형)

// 상태
let hoverHighlight: HTMLDivElement | null = null;
let isCtrlPressed = false;
let hoveredElem: HTMLElement | null = null;
let isDraggingFromOtherModule = false; // 드래그 상태를 외부에서 설정

// 드래그 상태 설정 (drag-manager에서 호출)
export function setDraggingState(dragging: boolean): void {
  isDraggingFromOtherModule = dragging;
  if (dragging) {
    // 드래그 중이면 호버 하이라이트 제거
    removeHoverHighlight();
    hoveredElem = null;
  }
}

// 호버 하이라이트 생성
export function createHoverHighlight(): void {
  if (hoverHighlight) return;

  hoverHighlight = document.createElement("div");
  hoverHighlight.style.cssText = `
    position: absolute;
    pointer-events: none;
    border: 2px solid #667eea;
    background: rgba(102, 126, 234, 0.1);
    z-index: 99998;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
    transition: all 0.15s ease;
    display: none;
  `;
  document.body.appendChild(hoverHighlight);
}

// 호버 하이라이트 업데이트
export function updateHoverHighlight(elem: HTMLElement): void {
  if (!hoverHighlight) return;

  const rect = elem.getBoundingClientRect();
  hoverHighlight.style.left = rect.left + window.scrollX + "px";
  hoverHighlight.style.top = rect.top + window.scrollY + "px";
  hoverHighlight.style.width = rect.width + "px";
  hoverHighlight.style.height = rect.height + "px";
  hoverHighlight.style.display = "block";
}

// 호버 하이라이트 제거
export function removeHoverHighlight(): void {
  if (hoverHighlight) {
    hoverHighlight.style.display = "none";
  }
  hoveredElem = null;
}

// 호버 하이라이트 파괴
export function destroyHoverHighlight(): void {
  if (hoverHighlight?.parentNode) {
    hoverHighlight.parentNode.removeChild(hoverHighlight);
    hoverHighlight = null;
  }
}

// Ctrl 키 상태 설정 (Alt -> Ctrl 변경)
export function setCtrlPressed(pressed: boolean): void {
  isCtrlPressed = pressed;
  if (!pressed) {
    removeHoverHighlight();
  }
}

// Ctrl 키 상태 확인 (Alt -> Ctrl 변경)
export function isCtrlKeyPressed(): boolean {
  return isCtrlPressed;
}

// 마우스 오버 처리
export function handleMouseOver(target: HTMLElement): void {
  // Ctrl 키가 눌리지 않았거나 드래그 중이면 처리하지 않음
  if (!isCtrlPressed || isDraggingFromOtherModule) return;

  // 유효하지 않은 타겟 제외
  if (!target || target === document.body || target === document.documentElement) return;
  if (target === hoverHighlight) return;

  // 동일한 요소면 중복 처리하지 않음
  if (hoveredElem === target) return;

  hoveredElem = target;
  createHoverHighlight();
  updateHoverHighlight(target);
}

// 스크롤 시 호버 업데이트
export function updateHoverOnScroll(): void {
  if (isCtrlPressed && hoveredElem && hoverHighlight && !isDraggingFromOtherModule) {
    updateHoverHighlight(hoveredElem);
  }
}

// 이벤트 핸들러들
function onKeyDown(e: KeyboardEvent): void {
  if (e.key === "Control" && !isDraggingFromOtherModule) {
    setCtrlPressed(true);
    createHoverHighlight();
    // 브라우저 기본 동작 방지
    e.preventDefault();
  }
}

function onKeyUp(e: KeyboardEvent): void {
  if (e.key === "Control") {
    setCtrlPressed(false);
  }
}

function onMouseMove(e: MouseEvent): void {
  // 마우스 이동 시에도 호버 처리 (더 반응성 향상)
  if (!isDraggingFromOtherModule) {
    const target = e.target as HTMLElement;
    handleMouseOver(target);
  }
}

function onMouseOver(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  handleMouseOver(target);
}

// 호버 매니저 초기화
export function initHoverManager(): void {
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("keyup", onKeyUp, true);
  document.addEventListener("mouseover", onMouseOver, true);
  document.addEventListener("mousemove", onMouseMove, true);
}

// 호버 매니저 정리
export function destroyHoverManager(): void {
  document.removeEventListener("keydown", onKeyDown, true);
  document.removeEventListener("keyup", onKeyUp, true);
  document.removeEventListener("mouseover", onMouseOver, true);
  document.removeEventListener("mousemove", onMouseMove, true);

  destroyHoverHighlight();
  isCtrlPressed = false;
  hoveredElem = null;
  isDraggingFromOtherModule = false;
}
