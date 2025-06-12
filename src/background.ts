// 백그라운드 스크립트
console.log("Elements Position Drag Overlay - Background script loaded");

// 안전한 메시지 전송 함수
async function sendMessageSafely(tabId: number, message: any) {
  try {
    // 탭 상태 확인
    const tab = await chrome.tabs.get(tabId);

    // content script가 작동하지 않는 URL들 체크
    if (
      tab.url?.startsWith("chrome://") ||
      tab.url?.startsWith("chrome-extension://") ||
      tab.url?.startsWith("about:") ||
      tab.url?.startsWith("file://") ||
      tab.url?.startsWith("moz-extension://")
    ) {
      console.log("Cannot inject content script on this page:", tab.url);
      return;
    }

    // 메시지 전송
    await chrome.tabs.sendMessage(tabId, message);
  } catch (error: any) {
    console.log("Could not send message to content script:", error.message);
  }
}

// 확장 프로그램 설치/업데이트 시 실행
chrome.runtime.onInstalled.addListener(details => {
  console.log("Extension installed/updated:", details.reason);

  // 설치 시 index.html 페이지 열기
  if (details.reason === "install") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html"),
    });
  }
});

// 키보드 단축키 처리
chrome.commands.onCommand.addListener(command => {
  if (command === "toggle-drag-overlay") {
    // 현재 활성 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        sendMessageSafely(tabs[0].id, { action: "toggle" });
      }
    });
  }
});

// 팝업에서 오는 메시지 처리
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openIndexPage") {
    // index.html 페이지 열기
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html"),
    });
    sendResponse({ success: true });
  }

  if (message.action === "openOptionsPage") {
    // 옵션 페이지 열기
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
});

// 확장 아이콘 클릭 처리
chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    sendMessageSafely(tab.id, { action: "toggle" });
  }
});
