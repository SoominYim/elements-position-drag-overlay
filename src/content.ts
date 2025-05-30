// Elements Position Overlay - Content Script
let draggedElem: HTMLElement | null = null;
let offsetX = 0,
  offsetY = 0;
let overlay: HTMLDivElement | null = null;
let isDragging = false;
let startParentRect: DOMRect | null = null;
let isEnabled = false;

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

function onMouseDown(e: MouseEvent) {
  if (!e.altKey || !isEnabled) return;

  const target = e.target as HTMLElement;
  if (!target || target === document.body || target === document.documentElement) return;

  draggedElem = target;
  isDragging = true;

  const parent = (target.offsetParent as HTMLElement) || document.body;
  startParentRect = parent.getBoundingClientRect();

  // 요소를 absolute로 변환
  if (getComputedStyle(target).position === "static") {
    target.style.position = "absolute";
    const rect = target.getBoundingClientRect();
    target.style.left = rect.left - startParentRect.left + "px";
    target.style.top = rect.top - startParentRect.top + "px";
    target.style.right = "auto";
    target.style.bottom = "auto";
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
  if (!draggedElem || !isDragging || !startParentRect) return;

  const left = e.clientX - startParentRect.left - offsetX + window.scrollX;
  const top = e.clientY - startParentRect.top - offsetY + window.scrollY;

  draggedElem.style.left = left + "px";
  draggedElem.style.top = top + "px";
  draggedElem.style.right = "auto";
  draggedElem.style.bottom = "auto";

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

// 이벤트 리스너 등록
document.addEventListener("mousedown", onMouseDown, true);
document.addEventListener("mousemove", onMouseMove, true);
document.addEventListener("mouseup", onMouseUp, true);

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
