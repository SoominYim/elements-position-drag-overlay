// Popup Script - 주요 설정 인터페이스
interface ExtensionSettings {
  enabled?: boolean;
  overlayPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showToasts?: boolean;
  persistOverlay?: boolean;
  showHoverHighlight?: boolean;
  highlightColor?: string;
}

const POPUP_DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  overlayPosition: "top-right",
  showToasts: true,
  persistOverlay: true,
  showHoverHighlight: true,
  highlightColor: "#4FC08D",
};

// DOM이 로드되면 실행
document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup script loaded");

  // 안전한 탭 메시지 전송 함수
  async function sendMessageToActiveTab(message: any, callback?: (response: any) => void) {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]?.id) {
        // 탭 정보 확인
        const tab = tabs[0];
        if (
          tab.url?.startsWith("chrome://") ||
          tab.url?.startsWith("chrome-extension://") ||
          tab.url?.startsWith("about:") ||
          tab.url?.startsWith("file://")
        ) {
          console.log("Cannot send message to this page:", tab.url);
          return;
        }

        chrome.tabs.sendMessage(tab.id!, message, response => {
          if (chrome.runtime.lastError) {
            console.log("Could not send message to content script:", chrome.runtime.lastError.message);
            return;
          }
          if (callback) callback(response);
        });
      }
    } catch (error: any) {
      console.log("Error sending message to tab:", error.message);
    }
  }

  // 설정 요소들 가져오기
  const enabledCheckbox = document.getElementById("enableToggle") as HTMLInputElement;
  const showToastsCheckbox = document.getElementById("showToasts") as HTMLInputElement;
  const showHoverCheckbox = document.getElementById("showHoverHighlight") as HTMLInputElement;
  const persistOverlayCheckbox = document.getElementById("persistOverlay") as HTMLInputElement;
  const overlayPositionSelect = document.getElementById("overlayPosition") as HTMLSelectElement;
  const highlightColorSelect = document.getElementById("highlightColor") as HTMLSelectElement;

  // 요소들이 제대로 찾아졌는지 확인
  console.log("Elements found:", {
    enabledCheckbox: !!enabledCheckbox,
    showToastsCheckbox: !!showToastsCheckbox,
    showHoverCheckbox: !!showHoverCheckbox,
    persistOverlayCheckbox: !!persistOverlayCheckbox,
    overlayPositionSelect: !!overlayPositionSelect,
    highlightColorSelect: !!highlightColorSelect,
  });

  // 상태 업데이트 함수
  function updateStatus(enabled: boolean) {
    const statusElement = document.getElementById("status");
    if (statusElement) {
      if (enabled) {
        statusElement.textContent = "✅ 활성화됨";
        statusElement.className = "status active";
      } else {
        statusElement.textContent = "⏸️ 비활성화됨";
        statusElement.className = "status inactive";
      }
    }
  }

  // 설정 로드
  function loadSettings() {
    console.log("Loading settings...");
    chrome.storage.sync.get(POPUP_DEFAULT_SETTINGS, (settings: ExtensionSettings) => {
      console.log("Settings loaded:", settings);

      if (enabledCheckbox) enabledCheckbox.checked = settings.enabled ?? true;
      if (showToastsCheckbox) showToastsCheckbox.checked = settings.showToasts ?? true;
      if (showHoverCheckbox) showHoverCheckbox.checked = settings.showHoverHighlight ?? true;
      if (persistOverlayCheckbox) persistOverlayCheckbox.checked = settings.persistOverlay ?? true;
      if (overlayPositionSelect) overlayPositionSelect.value = settings.overlayPosition ?? "top-right";
      if (highlightColorSelect) highlightColorSelect.value = settings.highlightColor ?? "#4FC08D";

      updateStatus(settings.enabled ?? true);
    });
  }

  // 설정 저장
  function saveSettings() {
    console.log("Saving settings...");

    const settings: ExtensionSettings = {
      enabled: enabledCheckbox?.checked ?? true,
      showToasts: showToastsCheckbox?.checked ?? true,
      showHoverHighlight: showHoverCheckbox?.checked ?? true,
      persistOverlay: persistOverlayCheckbox?.checked ?? true,
      overlayPosition: (overlayPositionSelect?.value as ExtensionSettings["overlayPosition"]) ?? "top-right",
      highlightColor: highlightColorSelect?.value ?? "#4FC08D",
    };

    console.log("Settings to save:", settings);

    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving settings:", chrome.runtime.lastError);
        return;
      }

      console.log("Settings saved successfully");
      updateStatus(settings.enabled ?? true);

      // 활성 탭에 설정 변경 알림
      sendMessageToActiveTab(
        {
          action: "settingsChanged",
          settings: settings,
        },
        response => {
          console.log("Settings sent to content script:", response);
        }
      );
    });
  }

  // 이벤트 리스너 등록
  [enabledCheckbox, showToastsCheckbox, showHoverCheckbox, persistOverlayCheckbox].forEach(checkbox => {
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        console.log(`Checkbox ${checkbox.id} changed to:`, checkbox.checked);
        saveSettings();
      });
    }
  });

  [overlayPositionSelect, highlightColorSelect].forEach(select => {
    if (select) {
      select.addEventListener("change", () => {
        console.log(`Select ${select.id} changed to:`, select.value);
        saveSettings();
      });
    }
  });

  // 홈페이지 버튼
  const indexBtn = document.getElementById("indexBtn");
  if (indexBtn) {
    indexBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openIndexPage" }, response => {
        if (chrome.runtime.lastError) {
          console.log("Could not send message to background:", chrome.runtime.lastError.message);
          return;
        }
        if (response?.success) {
          window.close(); // 팝업 닫기
        }
      });
    });
  }

  // 고급 설정 버튼
  const optionsBtn = document.getElementById("optionsBtn");
  if (optionsBtn) {
    optionsBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openOptionsPage" }, response => {
        if (chrome.runtime.lastError) {
          console.log("Could not send message to background:", chrome.runtime.lastError.message);
          return;
        }
        if (response?.success) {
          window.close(); // 팝업 닫기
        }
      });
    });
  }

  // 설정 로드 실행
  loadSettings();

  // 팝업이 포커스를 받을 때마다 설정 새로고침
  window.addEventListener("focus", () => {
    console.log("Popup focused, reloading settings");
    loadSettings();
  });

  // 설정 변경 감지 (단축키 토글 등)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.enabled) {
      console.log("Extension toggle detected in popup");
      loadSettings(); // 설정 다시 로드하여 UI 업데이트
    }
  });
});
