// 팝업 스크립트
document.addEventListener("DOMContentLoaded", () => {
  // 홈페이지 버튼
  const indexBtn = document.getElementById("indexBtn");
  if (indexBtn) {
    indexBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openIndexPage" }, response => {
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
        if (response?.success) {
          window.close(); // 팝업 닫기
        }
      });
    });
  }

  // 설정 로드 및 저장 기능
  loadSettings();

  // 설정 변경 이벤트 리스너들 (실제 HTML ID에 맞춤)
  const enabledCheckbox = document.getElementById("enableToggle"); // HTML에서는 enableToggle
  const showToastsCheckbox = document.getElementById("showToasts");
  const showHoverCheckbox = document.getElementById("showHoverHighlight");
  const persistOverlayCheckbox = document.getElementById("persistOverlay");
  const overlayPositionSelect = document.getElementById("overlayPosition");
  const highlightColorSelect = document.getElementById("highlightColor");

  [enabledCheckbox, showToastsCheckbox, showHoverCheckbox, persistOverlayCheckbox].forEach(checkbox => {
    if (checkbox) {
      checkbox.addEventListener("change", saveSettings);
    }
  });

  [overlayPositionSelect, highlightColorSelect].forEach(select => {
    if (select) {
      select.addEventListener("change", saveSettings);
    }
  });

  // 설정 로드
  function loadSettings() {
    chrome.storage.sync.get(
      {
        enabled: true,
        showToasts: true,
        showHoverHighlight: true,
        persistOverlay: false,
        overlayPosition: "top-right",
        highlightColor: "#4FC08D",
      },
      settings => {
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
    const settings = {
      enabled: enabledCheckbox?.checked ?? true,
      showToasts: showToastsCheckbox?.checked ?? true,
      showHoverHighlight: showHoverCheckbox?.checked ?? true,
      persistOverlay: persistOverlayCheckbox?.checked ?? false,
      overlayPosition: overlayPositionSelect?.value ?? "top-right",
      highlightColor: highlightColorSelect?.value ?? "#4FC08D",
    };

    chrome.storage.sync.set(settings, () => {
      updateStatus(settings.enabled);

      // 활성 탭에 설정 변경 알림
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "settingsChanged",
            settings: settings,
          });
        }
      });
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
});
