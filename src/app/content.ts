// Content Script - Dynamic Import를 사용한 ES6 모듈 로딩
(async () => {
  try {
    // Chrome 확장 환경인지 확인
    if (typeof chrome === "undefined" || !chrome.runtime) {
      console.error("Chrome extension runtime not available");
      return;
    }

    // 정확한 URL 생성
    const moduleUrl = chrome.runtime.getURL("app/content-main.js");
    console.log("Attempting to load module from:", moduleUrl);

    // Dynamic import 실행
    const contentScript = await import(moduleUrl);

    // 메인 함수 호출
    if (typeof contentScript.main === "function") {
      contentScript.main();
    } else {
      console.error("main function not found in content-main module");
    }
  } catch (error) {
    console.error("Failed to load content script main module:", error);
    const errorObj = error as Error;
    console.error("Error details:", {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
    });
  }
})();
