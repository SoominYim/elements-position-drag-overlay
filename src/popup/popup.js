// 팝업 스크립트
document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup script loaded");

  // 안전한 탭 메시지 전송 함수
  async function sendMessageToActiveTab(message, callback) {
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

        chrome.tabs.sendMessage(tab.id, message, response => {
          if (chrome.runtime.lastError) {
            console.log("Could not send message to content script:", chrome.runtime.lastError.message);
            return;
          }
          if (callback) callback(response);
        });
      }
    } catch (error) {
      console.log("Error sending message to tab:", error.message);
    }
  }

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

  // 설정 요소들 가져오기
  const enabledCheckbox = document.getElementById("enableToggle");
  const showToastsCheckbox = document.getElementById("showToasts");
  const showHoverCheckbox = document.getElementById("showHoverHighlight");
  const persistOverlayCheckbox = document.getElementById("persistOverlay");
  const overlayPositionSelect = document.getElementById("overlayPosition");
  const highlightColorSelect = document.getElementById("highlightColor");

  // 요소들이 제대로 찾아졌는지 확인
  console.log("Elements found:", {
    enabledCheckbox: !!enabledCheckbox,
    showToastsCheckbox: !!showToastsCheckbox,
    showHoverCheckbox: !!showHoverCheckbox,
    persistOverlayCheckbox: !!persistOverlayCheckbox,
    overlayPositionSelect: !!overlayPositionSelect,
    highlightColorSelect: !!highlightColorSelect,
  });

  // 설정 로드
  function loadSettings() {
    console.log("Loading settings...");
    chrome.storage.sync.get(
      {
        enabled: true,
        showToasts: true,
        showHoverHighlight: true,
        persistOverlay: true,
        overlayPosition: "top-right",
        highlightColor: "#4FC08D",
      },
      settings => {
        console.log("Settings loaded:", settings);

        if (enabledCheckbox) enabledCheckbox.checked = settings.enabled;
        if (showToastsCheckbox) showToastsCheckbox.checked = settings.showToasts;
        if (showHoverCheckbox) showHoverCheckbox.checked = settings.showHoverHighlight;
        if (persistOverlayCheckbox) persistOverlayCheckbox.checked = settings.persistOverlay;
        if (overlayPositionSelect) overlayPositionSelect.value = settings.overlayPosition;
        if (highlightColorSelect) highlightColorSelect.value = settings.highlightColor;

        updateStatus(settings.enabled);
      }
    );
  }

  // 설정 저장
  function saveSettings() {
    console.log("Saving settings...");

    const settings = {
      enabled: enabledCheckbox?.checked ?? true,
      showToasts: showToastsCheckbox?.checked ?? true,
      showHoverHighlight: showHoverCheckbox?.checked ?? true,
      persistOverlay: persistOverlayCheckbox?.checked ?? true,
      overlayPosition: overlayPositionSelect?.value ?? "top-right",
      highlightColor: highlightColorSelect?.value ?? "#4FC08D",
    };

    console.log("Settings to save:", settings);

    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving settings:", chrome.runtime.lastError);
        return;
      }

      console.log("Settings saved successfully");
      updateStatus(settings.enabled);

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

  // 상태 업데이트
  function updateStatus(enabled) {
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
