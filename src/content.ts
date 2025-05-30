// Elements Position Overlay - Content Script
import {
  initDragListeners,
  destroyDragListeners,
  onMouseDown as dragMouseDown,
  onMouseMove as dragMouseMove,
  onMouseUp as dragMouseUp,
  onScroll as dragScroll,
} from "./drag-manager";

// 확장 활성화 상태
let isEnabled = false;

function initExtension(): void {
  // 확장 상태 확인
  chrome.storage.sync.get(["enabled"], result => {
    isEnabled = result.enabled !== false;
    if (isEnabled) {
      initDragListeners();
    }
  });

  // 상태 변경 리스너
  chrome.storage.onChanged.addListener(changes => {
    if (changes.enabled) {
      isEnabled = changes.enabled.newValue;
      if (isEnabled) {
        initDragListeners();
      } else {
        destroyDragListeners();
      }
    }
  });

  // 키보드 단축키 리스너
  chrome.runtime.onMessage.addListener(message => {
    if (message.action === "toggle") {
      isEnabled = !isEnabled;
      chrome.storage.sync.set({ enabled: isEnabled });

      if (isEnabled) {
        initDragListeners();
      } else {
        destroyDragListeners();
      }
    }
  });
}

// 확장 기능이 활성화되어 있을 때만 이벤트를 처리하는 래퍼 함수들
function wrappedMouseDown(e: MouseEvent): void {
  if (!isEnabled) return;
  dragMouseDown(e);
}

function wrappedMouseMove(e: MouseEvent): void {
  if (!isEnabled) return;
  dragMouseMove(e);
}

function wrappedMouseUp(): void {
  if (!isEnabled) return;
  dragMouseUp();
}

function wrappedScroll(): void {
  if (!isEnabled) return;
  dragScroll();
}

// 확장 전용 이벤트 리스너 등록 (활성화 상태 체크 포함)
function initExtensionListeners(): void {
  document.addEventListener("mousedown", wrappedMouseDown, true);
  document.addEventListener("mousemove", wrappedMouseMove, true);
  document.addEventListener("mouseup", wrappedMouseUp, true);
  document.addEventListener("scroll", wrappedScroll, true);
}

// 확장용 초기화
if (typeof chrome !== "undefined" && chrome.runtime) {
  initExtension();
  initExtensionListeners();
}
