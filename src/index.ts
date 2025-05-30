// 웹 데모를 위한 진입점 - app/index.ts로 리다이렉트
import { initForWeb as initDragFeature } from "./features/drag/index.js";
import { init as initDemoWidget } from "./widgets/demo-controls/index.js";

// 웹 데모 초기화
function initWebDemo() {
  console.log("Elements Position Drag Overlay - Web Demo");

  // 드래그 기능 초기화 (웹용)
  initDragFeature();

  // 데모 컨트롤 위젯 초기화
  initDemoWidget();
}

// DOM이 로드되면 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWebDemo);
} else {
  initWebDemo();
}
