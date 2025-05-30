// Popup Script
interface ChromeStorage {
  enabled?: boolean;
}

function updatePopupStatus(message: string, type: "success" | "error" | "info" = "info") {
  const status = document.getElementById("status");
  if (status) {
    const icons = { success: "✅", error: "❌", info: "💡" };
    status.textContent = `${icons[type]} ${message}`;
  }
}

function toggleExtension(enabled: boolean) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.set({ enabled }, () => {
      updatePopupStatus(enabled ? "확장 활성화됨" : "확장 비활성화됨", enabled ? "success" : "info");
    });
  }
}

// DOM이 로드되면 실행
document.addEventListener("DOMContentLoaded", () => {
  const enableToggle = document.getElementById("enableToggle") as HTMLInputElement;
  const testBtn = document.getElementById("testBtn") as HTMLButtonElement;
  const optionsBtn = document.getElementById("optionsBtn") as HTMLButtonElement;

  // 초기 상태 로드
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(["enabled"], (result: ChromeStorage) => {
      const enabled = result.enabled !== false;
      if (enableToggle) {
        enableToggle.checked = enabled;
      }
      updatePopupStatus(enabled ? "확장 활성화됨" : "확장 비활성화됨", enabled ? "success" : "info");
    });
  }

  // 토글 이벤트
  if (enableToggle) {
    enableToggle.addEventListener("change", e => {
      const target = e.target as HTMLInputElement;
      toggleExtension(target.checked);
    });
  }

  // 웹 데모 버튼
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.create({
          url: chrome.runtime.getURL("index.html"),
        });
      } else {
        // 로컬에서 테스트할 때
        window.open("./index.html", "_blank");
      }
    });
  }

  // 설정 버튼
  if (optionsBtn) {
    optionsBtn.addEventListener("click", () => {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.openOptionsPage();
      }
    });
  }
});
