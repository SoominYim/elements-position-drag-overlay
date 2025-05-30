// Web Demo Script - Elements Position Overlay
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

let draggedElem: HTMLElement | null = null;
let offsetX = 0,
  offsetY = 0;
let overlay: HTMLDivElement | null = null;
let isDragging = false;
let startParentRect: DOMRect | null = null;

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
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  `;
  document.body.appendChild(overlay);

  // 애니메이션
  requestAnimationFrame(() => {
    if (overlay) {
      overlay.style.opacity = "1";
      overlay.style.transform = "translateY(0)";
    }
  });
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
    }, 300);
  }
}

function updateStatus(message: string, type: "success" | "info" | "active" = "info") {
  const status = document.getElementById("status");
  if (status) {
    const icons = { success: "✅", info: "💡", active: "🎯" };
    status.textContent = `${icons[type]} ${message}`;
    status.style.background = type === "active" ? "rgba(54,89,181,0.9)" : "rgba(0,0,0,0.8)";
  }
}

// 메인 로직
const box = document.getElementById("demoBox") as HTMLElement;

if (box) {
  box.addEventListener("mousedown", (e: MouseEvent) => {
    if (!e.altKey) {
      updateStatus("Alt 키를 누르고 드래그하세요!", "info");
      return;
    }

    draggedElem = box;
    isDragging = true;
    updateStatus("드래그 시작!", "active");

    const parent = (box.offsetParent as HTMLElement) || document.body;
    startParentRect = parent.getBoundingClientRect();

    // position 설정
    if (getComputedStyle(box).position === "static") {
      box.style.position = "absolute";
      const rect = box.getBoundingClientRect();
      box.style.left = rect.left - startParentRect.left + "px";
      box.style.top = rect.top - startParentRect.top + "px";
      box.style.right = "auto";
      box.style.bottom = "auto";
    }

    const rect = box.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    createOverlay();
    updateOverlay(box);

    box.style.cursor = "grabbing";
    box.style.transform = "scale(1.02)";
    document.body.style.userSelect = "none";

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e: MouseEvent) => {
    if (!draggedElem || !isDragging || !startParentRect) return;

    const left = e.clientX - startParentRect.left - offsetX + window.scrollX;
    const top = e.clientY - startParentRect.top - offsetY + window.scrollY;

    draggedElem.style.left = left + "px";
    draggedElem.style.top = top + "px";
    draggedElem.style.right = "auto";
    draggedElem.style.bottom = "auto";

    updateOverlay(draggedElem);
    updateStatus("위치 업데이트 중...", "active");
  });

  document.addEventListener("mouseup", () => {
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
  });

  // 키보드 도움말
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.altKey && !isDragging) {
      updateStatus("Alt 키 활성화 - 드래그 가능!", "active");
    }
  });

  document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Alt" && !isDragging) {
      updateStatus("Ready", "info");
    }
  });
}

// 초기화
updateStatus("Ready", "success");
