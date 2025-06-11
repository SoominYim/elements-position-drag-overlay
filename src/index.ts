// 웹 데모를 위한 진입점
import { initForWeb as initDragFeature } from "./features/drag/index.js";

// 웹 데모 초기화
function initWebDemo() {
  console.log("Elements Position Drag Overlay - Web Demo");

  // 드래그 기능 초기화 (웹용)
  initDragFeature();
}

// DOM이 로드되면 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWebDemo);
} else {
  initWebDemo();
}
