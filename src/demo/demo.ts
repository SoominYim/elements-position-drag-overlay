console.log("Elements Position Drag Overlay - DEMO SCRIPT LOADED");

// 데모용 고정 설정
const DEMO_SETTINGS = {
  enabled: true,
  overlayPosition: "top-right",
  showToasts: true,
  persistOverlay: true,
  showHoverHighlight: true,
  highlightColor: "#4FC08D", // Vue Green
};

function initDemoDragSystem() {
  console.log("Initializing demo drag system...");

  let isDragging = false;
  let currentElement: HTMLElement | null = null;
  let startMouseX = 0,
    startMouseY = 0;
  let initialLeft = 0,
    initialTop = 0;
  let overlay: HTMLElement | null = null;
  let toastContainer: HTMLElement | null = null;
  let hoveredElement: HTMLElement | null = null;

  function isAbsolutePosition(elem: HTMLElement): boolean {
    return getComputedStyle(elem).position === "absolute";
  }

  function createToastContainer() {
    if (toastContainer) return;
    toastContainer = document.createElement("div");
    toastContainer.id = "demo-toast-container";
    toastContainer.style.cssText = `position: fixed; top: 20px; right: 20px; z-index: 100001; pointer-events: none;`;
    document.body.appendChild(toastContainer);
  }

  function showToast(message: string, type: "success" | "error" | "info" = "info") {
    if (!DEMO_SETTINGS.showToasts) return;
    createToastContainer();
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.textContent = message;
    const colors = { success: "#27ae60", error: "#e74c3c", info: "#3498db" };
    toast.style.cssText = `background: ${colors[type]}; color: white; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; font-family: monospace; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); opacity: 0; transform: translateX(100%); transition: all 0.3s ease;`;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 10);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "demo-position-overlay";

    const position = DEMO_SETTINGS.overlayPosition;
    let positionStyles = `top: 10px; left: 10px;`;
    if (position === "top-left") positionStyles = `top: 10px; left: 10px;`;
    if (position === "bottom-left") positionStyles = `bottom: 10px; left: 10px;`;
    if (position === "bottom-right") positionStyles = `bottom: 10px; right: 10px;`;

    overlay.style.cssText = `position: fixed; ${positionStyles} background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 12px; z-index: 99999; pointer-events: none; display: none;`;
    document.body.appendChild(overlay);
  }

  function updateOverlay(element: HTMLElement) {
    if (!overlay) return;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const left = parseInt(style.left) || Math.round(rect.left + window.scrollX);
    const top = parseInt(style.top) || Math.round(rect.top + window.scrollY);
    const right = Math.round(window.innerWidth - rect.right);
    const bottom = Math.round(window.innerHeight - rect.bottom);
    overlay.innerHTML = `left: ${left}px<br>top: ${top}px<br>right: ${right}px<br>bottom: ${bottom}px`;
    overlay.style.display = "block";
  }

  function hideOverlay() {
    if (overlay) overlay.style.display = "none";
  }

  function highlightElement(element: HTMLElement) {
    element.style.outline = `2px solid ${DEMO_SETTINGS.highlightColor}`;
    element.style.outlineOffset = "2px";
  }

  function removeHighlight(element: HTMLElement) {
    element.style.outline = "";
    element.style.outlineOffset = "";
  }

  function onMouseDown(e: MouseEvent) {
    if (!e.ctrlKey && !e.metaKey) return;
    const target = e.target as HTMLElement;

    if (target.id !== "demo-element") return; // 데모 요소만 드래그 가능하도록 제한

    if (!isAbsolutePosition(target)) {
      showToast(`❌ 드래그 불가능! 이 요소는 position: ${getComputedStyle(target).position}입니다`, "error");
      return;
    }

    isDragging = true;
    currentElement = target;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    initialLeft = parseInt(getComputedStyle(target).left) || 0;
    initialTop = parseInt(getComputedStyle(target).top) || 0;

    createOverlay();
    updateOverlay(target);
    showToast("🎯 드래그 시작!", "success");
    e.preventDefault();
  }

  function onMouseMove(e: MouseEvent) {
    if (isDragging && currentElement) {
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;
      currentElement.style.left = `${initialLeft + deltaX}px`;
      currentElement.style.top = `${initialTop + deltaY}px`;
      updateOverlay(currentElement);
    } else if (e.ctrlKey || e.metaKey) {
      const target = e.target as HTMLElement;
      if (target.id === "demo-element") {
        if (hoveredElement !== target) {
          if (hoveredElement) removeHighlight(hoveredElement);
          hoveredElement = target;
          highlightElement(hoveredElement);
        }
      } else {
        if (hoveredElement) removeHighlight(hoveredElement);
        hoveredElement = null;
      }
    }
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      showToast("✅ 드래그 완료", "success");
      if (!DEMO_SETTINGS.persistOverlay) {
        hideOverlay();
      }
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if ((e.key === "Control" || e.key === "Meta") && hoveredElement) {
      removeHighlight(hoveredElement);
      hoveredElement = null;
    }
  }

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("keyup", onKeyUp);
}

// 스크립트가 로드되면 즉시 데모 초기화
initDemoDragSystem();
