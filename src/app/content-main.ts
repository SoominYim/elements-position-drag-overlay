// Content Script 메인 애플리케이션
import { init as initDragFeature } from "../features/drag/index.js";

// 메인 함수 export (dynamic import에서 호출)
export function main() {
  console.log("Elements Position Drag Overlay - Content Script Loaded");
  console.log("typeof chrome.runtime =", typeof chrome.runtime);
  console.log("Current URL:", window.location.href);

  try {
    // 드래그 기능 초기화
    console.log("Initializing drag feature...");
    initDragFeature();
    console.log("Drag feature initialized successfully");
  } catch (error) {
    console.error("Failed to initialize drag feature:", error);
  }
}
