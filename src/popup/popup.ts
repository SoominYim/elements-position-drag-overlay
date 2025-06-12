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
  overlayPosition: "top-left",
  showToasts: true,
  persistOverlay: true,
  showHoverHighlight: true,
  highlightColor: "#4FC08D",
};

function updatePopupStatus(message: string, type: "success" | "error" | "info" = "info") {
  const status = document.getElementById("status");
  if (status) {
    const icons = { success: "✅", error: "❌", info: "💡" };
    status.textContent = `${icons[type]} ${message}`;
  }
}

function saveSettings(settings: ExtensionSettings) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        updatePopupStatus("설정 저장 실패", "error");
      } else {
        updatePopupStatus("설정 저장됨", "success");
        // 활성 탭에 설정 변경 알림
        notifyContentScript(settings);
        setTimeout(() => updatePopupStatus("준비됨", "info"), 2000);
      }
    });
  } else {
    // 로컬 스토리지 폴백
    localStorage.setItem("epo-settings", JSON.stringify(settings));
    updatePopupStatus("설정 저장됨 (로컬)", "success");
  }
}

function notifyContentScript(settings: ExtensionSettings) {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs
          .sendMessage(tabs[0].id, {
            type: "SETTINGS_UPDATED",
            settings: settings,
          })
          .catch(() => {
            // Content script가 없는 경우 무시
          });
      }
    });
  }
}

function loadSettings() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(Object.keys(POPUP_DEFAULT_SETTINGS), (result: ExtensionSettings) => {
      if (chrome.runtime.lastError) {
        updatePopupStatus("설정 로드 실패", "error");
        return;
      }

      const settings = { ...POPUP_DEFAULT_SETTINGS, ...result };
      applySettingsToUI(settings);
      updatePopupStatus(settings.enabled ? "활성화됨" : "비활성화됨", settings.enabled ? "success" : "info");
    });
  } else {
    // 로컬 스토리지 폴백
    const saved = localStorage.getItem("epo-settings");
    let settings = POPUP_DEFAULT_SETTINGS;

    if (saved) {
      try {
        settings = { ...POPUP_DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }

    applySettingsToUI(settings);
    updatePopupStatus("로컬 모드", "info");
  }
}

function applySettingsToUI(settings: ExtensionSettings) {
  const elements = {
    enableToggle: document.getElementById("enableToggle") as HTMLInputElement,
    showToasts: document.getElementById("showToasts") as HTMLInputElement,
    persistOverlay: document.getElementById("persistOverlay") as HTMLInputElement,
    showHoverHighlight: document.getElementById("showHoverHighlight") as HTMLInputElement,
    overlayPosition: document.getElementById("overlayPosition") as HTMLSelectElement,
    highlightColor: document.getElementById("highlightColor") as HTMLSelectElement,
  };

  if (elements.enableToggle) elements.enableToggle.checked = settings.enabled ?? true;
  if (elements.showToasts) elements.showToasts.checked = settings.showToasts ?? true;
  if (elements.persistOverlay) elements.persistOverlay.checked = settings.persistOverlay ?? true;
  if (elements.showHoverHighlight) elements.showHoverHighlight.checked = settings.showHoverHighlight ?? true;
  if (elements.overlayPosition) elements.overlayPosition.value = settings.overlayPosition ?? "top-left";
  if (elements.highlightColor) elements.highlightColor.value = settings.highlightColor ?? "#4FC08D";
}

function getCurrentSettings(): ExtensionSettings {
  const elements = {
    enableToggle: document.getElementById("enableToggle") as HTMLInputElement,
    showToasts: document.getElementById("showToasts") as HTMLInputElement,
    persistOverlay: document.getElementById("persistOverlay") as HTMLInputElement,
    showHoverHighlight: document.getElementById("showHoverHighlight") as HTMLInputElement,
    overlayPosition: document.getElementById("overlayPosition") as HTMLSelectElement,
    highlightColor: document.getElementById("highlightColor") as HTMLSelectElement,
  };

  return {
    enabled: elements.enableToggle?.checked ?? true,
    showToasts: elements.showToasts?.checked ?? true,
    persistOverlay: elements.persistOverlay?.checked ?? true,
    showHoverHighlight: elements.showHoverHighlight?.checked ?? true,
    overlayPosition: (elements.overlayPosition?.value as ExtensionSettings["overlayPosition"]) ?? "top-left",
    highlightColor: elements.highlightColor?.value ?? "#4FC08D",
  };
}

// DOM이 로드되면 실행
document.addEventListener("DOMContentLoaded", () => {
  // 초기 설정 로드
  loadSettings();

  // 설정 요소들
  const settingElements = [
    "enableToggle",
    "showToasts",
    "persistOverlay",
    "showHoverHighlight",
    "overlayPosition",
    "highlightColor",
  ];

  // 설정 변경 이벤트 리스너
  settingElements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("change", () => {
        const settings = getCurrentSettings();
        saveSettings(settings);
      });
    }
  });

  // 버튼 이벤트 리스너
  const demoBtn = document.getElementById("demoBtn");
  const optionsBtn = document.getElementById("optionsBtn");

  // 웹 데모 버튼
  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
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

  // 고급 설정 버튼
  if (optionsBtn) {
    optionsBtn.addEventListener("click", () => {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.openOptionsPage();
      }
    });
  }
});
