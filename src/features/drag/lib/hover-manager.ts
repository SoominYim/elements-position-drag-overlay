// 호버 하이라이트 관리자 (함수형)

// 상태
let hoverHighlight: HTMLDivElement | null = null;
let isAltPressed = false;
let hoveredElem: HTMLElement | null = null;

// 호버 하이라이트 생성
export function createHoverHighlight(): void {
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
}

// 호버 하이라이트 파괴
export function destroyHoverHighlight(): void {
  if (hoverHighlight?.parentNode) {
    hoverHighlight.parentNode.removeChild(hoverHighlight);
    hoverHighlight = null;
  }
}

// Alt 키 상태 설정
export function setAltPressed(pressed: boolean): void {
  isAltPressed = pressed;
  if (!pressed) {
    removeHoverHighlight();
    hoveredElem = null;
  }
}

// Alt 키 상태 확인
export function isAltKeyPressed(): boolean {
  return isAltPressed;
}

// 마우스 오버 처리
export function handleMouseOver(target: HTMLElement): void {
  if (!isAltPressed) return;
  if (!target || target === document.body || target === document.documentElement) return;
  if (target === hoverHighlight) return;

  if (hoveredElem !== target) {
    hoveredElem = target;
    updateHoverHighlight(target);
  }
}

// 스크롤 시 호버 업데이트
export function updateHoverOnScroll(): void {
  if (isAltPressed && hoveredElem && hoverHighlight) {
    updateHoverHighlight(hoveredElem);
  }
}

// 이벤트 핸들러들
function onKeyDown(e: KeyboardEvent): void {
  if (e.key === "Alt") {
    setAltPressed(true);
    createHoverHighlight();
  }
}

function onKeyUp(e: KeyboardEvent): void {
  if (e.key === "Alt") {
    setAltPressed(false);
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
}

// 호버 매니저 정리
export function destroyHoverManager(): void {
  document.removeEventListener("keydown", onKeyDown, true);
  document.removeEventListener("keyup", onKeyUp, true);
  document.removeEventListener("mouseover", onMouseOver, true);

  destroyHoverHighlight();
  isAltPressed = false;
  hoveredElem = null;
}
