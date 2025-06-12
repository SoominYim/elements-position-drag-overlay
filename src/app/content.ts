// Content Script - 크롬 확장 전용
console.log("Elements Position Drag Overlay - Content Script Loaded");

interface ExtensionSettings {
  enabled?: boolean;
  overlayPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  toastPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showToasts?: boolean;
  persistOverlay?: boolean;
  showHoverHighlight?: boolean;
  highlightColor?: string;
}

const EXTENSION_DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  overlayPosition: "top-left",
  toastPosition: "top-right",
  showToasts: true,
  persistOverlay: true,
  showHoverHighlight: true,
  highlightColor: "#667eea",
};

let currentSettings: ExtensionSettings = { ...EXTENSION_DEFAULT_SETTINGS };

// 확장 기능 초기화
function initializeExtension() {
  loadExtensionSettings().then(() => {
    if (currentSettings.enabled) {
      initDragSystem();
    } else {
      console.log("Extension is disabled. Aborting initialization.");
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "settingsChanged") {
      currentSettings = { ...EXTENSION_DEFAULT_SETTINGS, ...message.settings };
      // 기존 시스템을 모두 정리하고 다시 시작
      destroyDragSystem();
      if (currentSettings.enabled) {
        initDragSystem();
      }
      sendResponse({ success: true });
    } else if (message.action === "toggle") {
      // 단축키 토글 처리
      console.log("Toggle command received");
      currentSettings.enabled = !currentSettings.enabled;

      // 설정을 storage에 저장
      chrome.storage.sync.set({ enabled: currentSettings.enabled }, () => {
        console.log("Extension toggled:", currentSettings.enabled ? "ON" : "OFF");

        if (currentSettings.enabled) {
          initDragSystem();
          console.log("🔛 확장 기능 활성화됨");
        } else {
          destroyDragSystem();
          console.log("🔕 확장 기능 비활성화됨");
        }

        sendResponse({ success: true, enabled: currentSettings.enabled });
      });
    }
    return true;
  });
}

async function loadExtensionSettings(): Promise<void> {
  return new Promise(resolve => {
    chrome.storage.sync.get(Object.keys(EXTENSION_DEFAULT_SETTINGS), (result: ExtensionSettings) => {
      currentSettings = { ...EXTENSION_DEFAULT_SETTINGS, ...result };
      console.log("Settings loaded:", currentSettings);
      resolve();
    });
  });
}

let activeEventListeners: { type: string; listener: (e: any) => void; capture: boolean }[] = [];

function destroyDragSystem() {
  console.log("Destroying drag system...");
  // 오버레이 및 토스트 컨테이너 제거
  document.getElementById("position-overlay")?.remove();
  document.getElementById("drag-toast-container")?.remove();

  // 등록된 모든 이벤트 리스너 제거
  activeEventListeners.forEach(L => document.removeEventListener(L.type, L.listener, L.capture));
  activeEventListeners = [];
}

function initDragSystem() {
  console.log("Initializing drag system for extension...");

  function addTrackedListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    capture = false
  ) {
    document.addEventListener(type, listener, capture);
    activeEventListeners.push({ type, listener, capture });
  }

  // 드래그 매니저 상태
  let isDragging = false;
  let currentElement: HTMLElement | null = null;
  let startMouseX = 0;
  let startMouseY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let initialScrollX = 0;
  let initialScrollY = 0;
  let parentRect: DOMRect | null = null;

  // 호버 매니저 상태
  let hoveredElement: HTMLElement | null = null;
  let isHovering = false;

  // UI 요소들
  let overlay: HTMLElement | null = null;
  let toastContainer: HTMLElement | null = null;

  // === 유틸리티 함수들 ===

  // position 검증
  function isAbsolutePosition(elem: HTMLElement): boolean {
    const style = getComputedStyle(elem);
    return style.position === "absolute";
  }

  // 토스트 컨테이너 생성
  function createToastContainer() {
    if (toastContainer || !currentSettings.showToasts) return;

    toastContainer = document.createElement("div");
    toastContainer.id = "drag-toast-container";

    // 설정에 따른 위치 결정
    const position = currentSettings.toastPosition || "top-right";
    let positionStyles = "";

    switch (position) {
      case "top-left":
        positionStyles = "top: 20px; left: 20px;";
        break;
      case "top-right":
        positionStyles = "top: 20px; right: 20px;";
        break;
      case "bottom-left":
        positionStyles = "bottom: 20px; left: 20px;";
        break;
      case "bottom-right":
        positionStyles = "bottom: 20px; right: 20px;";
        break;
    }

    toastContainer.style.cssText = `
      position: fixed;
      ${positionStyles}
      z-index: 100001;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  // 토스트 표시
  function showToast(message: string, type: "success" | "error" | "warning" | "info" = "info") {
    if (!currentSettings.showToasts) return;

    createToastContainer();
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.textContent = message;

    const colors = {
      success: "#27ae60",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
    };

    toast.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      font-family: monospace;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 10);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // 오버레이 생성
  function createOverlay() {
    if (overlay) return;

    overlay = document.createElement("div");
    overlay.id = "position-overlay";

    // 설정에 따른 위치 결정
    const position = currentSettings.overlayPosition || "top-left";
    let positionStyles = "";

    switch (position) {
      case "top-left":
        positionStyles = "top: 10px; left: 10px;";
        break;
      case "top-right":
        positionStyles = "top: 10px; right: 10px;";
        break;
      case "bottom-left":
        positionStyles = "bottom: 10px; left: 10px;";
        break;
      case "bottom-right":
        positionStyles = "bottom: 10px; right: 10px;";
        break;
    }

    overlay.style.cssText = `
      position: fixed;
      ${positionStyles}
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: monospace;
      font-size: 12px;
      z-index: 99999;
      pointer-events: none;
      display: none;
    `;
    document.body.appendChild(overlay);
  }

  // 오버레이 위치 업데이트 함수
  function updateOverlayPosition() {
    if (!overlay) return;

    const position = currentSettings.overlayPosition || "top-left";
    let positionStyles = "";

    switch (position) {
      case "top-left":
        positionStyles = "top: 10px; left: 10px; right: auto; bottom: auto;";
        break;
      case "top-right":
        positionStyles = "top: 10px; right: 10px; left: auto; bottom: auto;";
        break;
      case "bottom-left":
        positionStyles = "bottom: 10px; left: 10px; right: auto; top: auto;";
        break;
      case "bottom-right":
        positionStyles = "bottom: 10px; right: 10px; left: auto; top: auto;";
        break;
    }

    // 기존 위치 스타일 초기화 후 새 위치 적용
    overlay.style.top = "";
    overlay.style.right = "";
    overlay.style.bottom = "";
    overlay.style.left = "";

    // 새로운 위치 스타일 적용
    switch (position) {
      case "top-left":
        overlay.style.top = "10px";
        overlay.style.left = "10px";
        break;
      case "top-right":
        overlay.style.top = "10px";
        overlay.style.right = "10px";
        break;
      case "bottom-left":
        overlay.style.bottom = "10px";
        overlay.style.left = "10px";
        break;
      case "bottom-right":
        overlay.style.bottom = "10px";
        overlay.style.right = "10px";
        break;
    }
  }

  // 오버레이 업데이트
  function updateOverlay(element: HTMLElement) {
    if (!overlay) return;

    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    // 실제 CSS 값 계산 (정수로 반올림)
    const left = parseInt(style.left) || Math.round(rect.left + window.scrollX);
    const top = parseInt(style.top) || Math.round(rect.top + window.scrollY);
    const right = Math.round(window.innerWidth - rect.right);
    const bottom = Math.round(window.innerHeight - rect.bottom);

    overlay.innerHTML = `
      left: ${left}px<br>
      top: ${top}px<br>
      right: ${right}px<br>
      bottom: ${bottom}px
    `;
    overlay.style.display = "block";
  }

  // 오버레이 숨기기
  function hideOverlay() {
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  // 요소 하이라이트
  function highlightElement(element: HTMLElement) {
    if (!currentSettings.showHoverHighlight) return;

    const color = currentSettings.highlightColor || "#667eea";
    element.style.outline = `2px solid ${color}`;
    element.style.outlineOffset = "2px";
  }

  // 하이라이트 제거
  function removeHighlight(element: HTMLElement) {
    element.style.outline = "";
    element.style.outlineOffset = "";
  }

  // === 드래그 매니저 ===

  function setDraggingState(dragging: boolean) {
    isDragging = dragging;
  }

  // 마우스 다운 이벤트
  function onMouseDown(e: MouseEvent) {
    // Windows: Ctrl, Mac: Cmd 키 지원
    if (!currentSettings.enabled || (!e.ctrlKey && !e.metaKey)) return;

    const target = e.target as HTMLElement;
    if (!target || target === document.body || target === document.documentElement) return;

    // position 검증
    if (!isAbsolutePosition(target)) {
      const position = getComputedStyle(target).position;
      showToast(`❌ 드래그 불가능! 이 요소는 position: ${position}입니다`, "error");
      return;
    }

    // 드래그 시작
    setDraggingState(true);
    currentElement = target;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    initialScrollX = window.scrollX;
    initialScrollY = window.scrollY;

    // 부모 요소의 rect 저장
    const parent = target.offsetParent as HTMLElement;
    if (parent) {
      parentRect = parent.getBoundingClientRect();
    }

    // 초기 위치 저장
    const style = getComputedStyle(target);
    initialLeft = parseInt(style.left) || 0;
    initialTop = parseInt(style.top) || 0;

    // 오버레이 생성 및 업데이트
    createOverlay();
    updateOverlay(target);

    showToast("🎯 드래그 시작!", "success");

    e.preventDefault();
    e.stopPropagation();
  }

  // 마우스 이동 이벤트
  function onMouseMove(e: MouseEvent) {
    if (!currentSettings.enabled) return;

    if (isDragging && currentElement && parentRect) {
      // 스크롤 변화량 계산
      const scrollDeltaX = window.scrollX - initialScrollX;
      const scrollDeltaY = window.scrollY - initialScrollY;

      // 스크롤 보정된 부모 rect
      const adjustedParentRect = {
        left: parentRect.left - scrollDeltaX,
        top: parentRect.top - scrollDeltaY,
      };

      // 마우스 이동량 계산
      const deltaX = e.clientX - startMouseX;
      const deltaY = e.clientY - startMouseY;

      // 새로운 위치 계산 (부모 기준)
      const newLeft = initialLeft + deltaX;
      const newTop = initialTop + deltaY;

      // 요소 위치 업데이트
      currentElement.style.left = `${newLeft}px`;
      currentElement.style.top = `${newTop}px`;

      // 오버레이 업데이트
      updateOverlay(currentElement);
    } else if (!isDragging && (e.ctrlKey || e.metaKey)) {
      // 호버 상태 관리 - Windows: Ctrl, Mac: Cmd 키 지원
      const target = e.target as HTMLElement;
      if (target && target !== hoveredElement && isAbsolutePosition(target)) {
        if (hoveredElement) {
          removeHighlight(hoveredElement);
        }
        hoveredElement = target;
        highlightElement(target);
        isHovering = true;
      } else if (!isAbsolutePosition(target) && hoveredElement) {
        removeHighlight(hoveredElement);
        hoveredElement = null;
        isHovering = false;
      }
    }
  }

  // 마우스 업 이벤트
  function onMouseUp(e: MouseEvent) {
    if (!currentSettings.enabled) return;

    if (isDragging && currentElement) {
      setDraggingState(false);

      // 드래그 완료 후 오버레이 처리
      if (currentSettings.persistOverlay) {
        // 오버레이 유지
        updateOverlay(currentElement);
      } else {
        // 오버레이 숨기기
        hideOverlay();
      }

      showToast("✅ 드래그 완료!", "success");
      currentElement = null;
      parentRect = null;
    }
  }

  // 스크롤 이벤트
  function onScroll() {
    if (!currentSettings.enabled) return;

    if (currentElement && overlay && overlay.style.display === "block") {
      updateOverlay(currentElement);
    }
  }

  // 키 다운 이벤트
  function onKeyDown(e: KeyboardEvent) {
    if (!currentSettings.enabled) return;

    if (e.key === "Escape") {
      hideOverlay();
      if (hoveredElement) {
        removeHighlight(hoveredElement);
        hoveredElement = null;
        isHovering = false;
      }
    }
  }

  // 키 업 이벤트
  function onKeyUp(e: KeyboardEvent) {
    if (!currentSettings.enabled) return;

    // Windows: Ctrl, Mac: Cmd 키 지원
    if ((e.key === "Control" || e.key === "Meta") && hoveredElement && !isDragging) {
      removeHighlight(hoveredElement);
      hoveredElement = null;
      isHovering = false;
    }
  }

  // 이벤트 리스너 등록
  addTrackedListener("mousedown", onMouseDown, true);
  addTrackedListener("mousemove", onMouseMove, true);
  addTrackedListener("mouseup", onMouseUp, true);
  addTrackedListener("scroll", onScroll, true);
  addTrackedListener("keydown", onKeyDown, true);
  addTrackedListener("keyup", onKeyUp, true);

  console.log("Drag system initialized successfully!");
}

initializeExtension();
