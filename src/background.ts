// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  // 기본 설정
  chrome.storage.sync.set({ enabled: true });
  console.log("Elements Position Overlay 확장이 설치되었습니다!");
});

// 키보드 단축키 처리
chrome.commands.onCommand.addListener(command => {
  if (command === "toggle-drag-overlay") {
    // 현재 활성 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle" });
      }
    });
  }
});

// 확장 아이콘 클릭 처리
chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
  }
});
