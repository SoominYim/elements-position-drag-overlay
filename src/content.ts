// Elements Position Overlay - Content Script
let draggedElem: HTMLElement | null = null;
let offsetX = 0,
  offsetY = 0;
let overlay: HTMLDivElement | null = null;
let isDragging = false;
let startParentRect: DOMRect | null = null;
let isEnabled = false;
let lastScrollX = 0;
let lastScrollY = 0;
let isAltPressed = false;
let hoveredElem: HTMLElement | null = null;
let hoverHighlight: HTMLDivElement | null = null;

export function getCssPosition(elem: HTMLElement) {
  const style = getComputedStyle(elem);
  return {
    left: style.left,
    top: style.top,
    right: style.right,
    bottom: style.bottom,
    position: style.position,
  };
}

function createHoverHighlight() {
  if (hoverHighlight) return hoverHighlight;
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
  `;
  document.body.appendChild(hoverHighlight);
  return hoverHighlight;
}

function updateHoverHighlight(elem: HTMLElement) {
  if (!hoverHighlight) return;
  const rect = elem.getBoundingClientRect();
  hoverHighlight.style.left = rect.left + window.scrollX + "px";
  hoverHighlight.style.top = rect.top + window.scrollY + "px";
  hoverHighlight.style.width = rect.width + "px";
  hoverHighlight.style.height = rect.height + "px";
  hoverHighlight.style.display = "block";
}

function removeHoverHighlight() {
  if (hoverHighlight) {
    hoverHighlight.style.display = "none";
  }
}

function createOverlay() {
  if (overlay) return;
  overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    z-index: 99999;
    background: rgba(54,89,181,0.95);
    color: #fff;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    pointer-events: none;
    top: 20px;
    right: 20px;
    user-select: none;
    max-width: 320px;
    line-height: 1.5;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.2);
  `;
  document.body.appendChild(overlay);
}

function updateOverlay(elem: HTMLElement) {
  if (!overlay) return;
  const cssPos = getCssPosition(elem);
  const rect = elem.getBoundingClientRect();
  overlay.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px; color: #a8d0ff;">🎯 Position Info</div>
    <div><b>left:</b> ${cssPos.left}</div>
    <div><b>top:</b> ${cssPos.top}</div>
    <div><b>right:</b> ${cssPos.right}</div>
    <div><b>bottom:</b> ${cssPos.bottom}</div>
    <div><b>position:</b> ${cssPos.position}</div>
    <hr style="margin: 8px 0; border: none; border-top: 1px solid rgba(255,255,255,0.3);">
    <div style="font-size: 12px; opacity: 0.9;">
      Alt+드래그로 요소 이동 • ${Math.round(rect.width)}×${Math.round(rect.height)}px
    </div>
  `;
}

function removeOverlay() {
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.transform = "translateY(-10px)";
    setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      overlay = null;
    }, 200);
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Alt" && !isDragging) {
    isAltPressed = true;
    createHoverHighlight();
  }
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === "Alt") {
    isAltPressed = false;
    removeHoverHighlight();
    hoveredElem = null;
  }
}

function onMouseOver(e: MouseEvent) {
  if (!isAltPressed || isDragging || !isEnabled) return;

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;
  if (target === hoverHighlight) return;

  if (hoveredElem !== target) {
    hoveredElem = target;
    updateHoverHighlight(target);
  }
}

function onMouseDown(e: MouseEvent) {
  if (!e.altKey || !isEnabled) return;

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;
  if (target === hoverHighlight) return;

  // 호버 하이라이트 제거
  removeHoverHighlight();
  isAltPressed = false;

  draggedElem = target;
  isDragging = true;

  const parent = (target.offsetParent as HTMLElement) || document.body;
  startParentRect = parent.getBoundingClientRect();

  // 현재 스크롤 위치 저장
  lastScrollX = window.scrollX;
  lastScrollY = window.scrollY;

  // 요소를 absolute로 변환하고 확실히 left/top만 사용
  const computedStyle = getComputedStyle(target);
  if (computedStyle.position === "static") {
    const rect = target.getBoundingClientRect();
    target.style.position = "absolute";
    // 확실히 left/top만 설정하고 다른 속성들 초기화
    target.style.left = rect.left - startParentRect.left + window.scrollX + "px";
    target.style.top = rect.top - startParentRect.top + window.scrollY + "px";
    target.style.right = "";
    target.style.bottom = "";
    target.style.inset = "";
    target.style.insetInlineStart = "";
    target.style.insetInlineEnd = "";
    target.style.insetBlockStart = "";
    target.style.insetBlockEnd = "";
  }

  const rect = target.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  createOverlay();
  updateOverlay(target);

  target.style.cursor = "grabbing";
  document.body.style.userSelect = "none";

  e.preventDefault();
  e.stopPropagation();
}

function onMouseMove(e: MouseEvent) {
  // Alt 키 호버 처리
  if (isAltPressed && !isDragging) {
    onMouseOver(e);
  }

  // 드래그 처리
  if (!draggedElem || !isDragging || !startParentRect) return;

  // 마우스 위치에서 부모의 위치와 스크롤을 고려한 정확한 계산
  const left = e.clientX - startParentRect.left - offsetX + window.scrollX;
  const top = e.clientY - startParentRect.top - offsetY + window.scrollY;

  // 확실히 left/top만 사용
  draggedElem.style.left = left + "px";
  draggedElem.style.top = top + "px";
  draggedElem.style.right = "";
  draggedElem.style.bottom = "";
  draggedElem.style.inset = "";

  updateOverlay(draggedElem);
}

function onMouseUp() {
  if (draggedElem && isDragging) {
    draggedElem.style.cursor = "";
    updateOverlay(draggedElem);
  }

  document.body.style.userSelect = "";
  draggedElem = null;
  isDragging = false;
  startParentRect = null;

  setTimeout(() => removeOverlay(), 1500);
}

function onScroll() {
  // 스크롤할 때 dragging 중이면 스크롤 차이만큼 보정
  if (isDragging && draggedElem) {
    const scrollDeltaX = window.scrollX - lastScrollX;
    const scrollDeltaY = window.scrollY - lastScrollY;

    const currentLeft = parseInt(draggedElem.style.left) || 0;
    const currentTop = parseInt(draggedElem.style.top) || 0;

    draggedElem.style.left = currentLeft + scrollDeltaX + "px";
    draggedElem.style.top = currentTop + scrollDeltaY + "px";

    updateOverlay(draggedElem);
  }

  // 호버 하이라이트도 스크롤에 맞춰 업데이트
  if (isAltPressed && hoveredElem && hoverHighlight) {
    updateHoverHighlight(hoveredElem);
  }

  lastScrollX = window.scrollX;
  lastScrollY = window.scrollY;
}

// 이벤트 리스너 등록
document.addEventListener("keydown", onKeyDown, true);
document.addEventListener("keyup", onKeyUp, true);
document.addEventListener("mousedown", onMouseDown, true);
document.addEventListener("mousemove", onMouseMove, true);
document.addEventListener("mouseup", onMouseUp, true);
document.addEventListener("scroll", onScroll, true);
document.addEventListener("wheel", onScroll, true);

// 초기 스크롤 위치 저장
lastScrollX = window.scrollX;
lastScrollY = window.scrollY;

// 확장 상태 확인
chrome.storage.sync.get(["enabled"], result => {
  isEnabled = result.enabled !== false;
});

// 상태 변경 리스너
chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue;
  }
});

// 키보드 단축키 리스너
chrome.runtime.onMessage.addListener(message => {
  if (message.action === "toggle") {
    isEnabled = !isEnabled;
    chrome.storage.sync.set({ enabled: isEnabled });

    if (!isEnabled && overlay) {
      removeOverlay();
    }
  }
});
