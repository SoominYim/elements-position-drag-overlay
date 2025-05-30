// 드래그 기능 Feature
import { initDragManager, destroyDragManager, initHoverManager, destroyHoverManager } from "./lib/index.js";
import { initExtensionConfig, setOnEnabledChange } from "../../shared/lib/index.js";

// 드래그 기능 상태
let isInitialized = false;

// Chrome 확장용 초기화
export function init(config?: any): void {
  if (isInitialized) return;

  // 확장 설정 초기화
  initExtensionConfig();

  // 설정 변경 시 드래그 기능 on/off
  setOnEnabledChange((enabled: boolean) => {
    if (enabled) {
      initDragManager();
      initHoverManager();
    } else {
      destroyDragManager();
      destroyHoverManager();
    }
  });

  isInitialized = true;
}

// 웹 데모용 초기화 (항상 활성화)
export function initForWeb(): void {
  if (isInitialized) return;

  initDragManager();
  initHoverManager();
  isInitialized = true;
}

// 정리
export function destroy(): void {
  if (!isInitialized) return;

  destroyDragManager();
  destroyHoverManager();
  isInitialized = false;
}
