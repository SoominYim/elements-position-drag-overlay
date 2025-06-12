// Options Page Script - 고급 설정
interface OptionsSettings {
  toastPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const OPTIONS_DEFAULTS: OptionsSettings = {
  toastPosition: "top-right",
};

function updateStatus(message: string, type: "success" | "error" | "info" = "info") {
  const status = document.getElementById("status");
  if (status) {
    const icons = { success: "✅", error: "❌", info: "⚙️" };
    status.textContent = `${icons[type]} ${message}`;

    if (type === "success" || type === "error") {
      setTimeout(() => updateStatus("설정을 변경하세요", "info"), 3000);
    }
  }
}

function saveOptionsSettings() {
  const toastPositionElement = document.getElementById("toastPosition") as HTMLSelectElement;
  const settings: OptionsSettings = {
    toastPosition: (toastPositionElement?.value as OptionsSettings["toastPosition"]) ?? OPTIONS_DEFAULTS.toastPosition,
  };

  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(null, existingSettings => {
      if (chrome.runtime.lastError) {
        updateStatus("설정 저장 실패", "error");
        return;
      }

      const mergedSettings = { ...existingSettings, ...settings };
      chrome.storage.sync.set(mergedSettings, () => {
        if (chrome.runtime.lastError) {
          updateStatus("설정 저장 실패", "error");
        } else {
          updateStatus("설정이 저장되었습니다!", "success");
          notifyActiveTab(mergedSettings);
        }
      });
    });
  } else {
    const saved = localStorage.getItem("epo-settings");
    let existingSettings = {};

    if (saved) {
      try {
        existingSettings = JSON.parse(saved);
      } catch (e) {
        console.error("Parse error:", e);
      }
    }

    const mergedSettings = { ...existingSettings, ...settings };
    localStorage.setItem("epo-settings", JSON.stringify(mergedSettings));
    updateStatus("설정 저장됨 (로컬)", "success");
  }
}

function loadOptionsSettings() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(["toastPosition"], (result: OptionsSettings) => {
      if (chrome.runtime.lastError) {
        updateStatus("설정 로드 실패", "error");
        return;
      }

      const settings = { ...OPTIONS_DEFAULTS, ...result };
      applyToUI(settings);
      updateStatus("설정을 불러왔습니다", "success");
    });
  } else {
    const saved = localStorage.getItem("epo-settings");
    let settings = OPTIONS_DEFAULTS;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        settings = { ...OPTIONS_DEFAULTS, toastPosition: parsed.toastPosition };
      } catch (e) {
        console.error("Parse error:", e);
      }
    }

    applyToUI(settings);
    updateStatus("설정 로드됨 (로컬)", "info");
  }
}

function applyToUI(settings: OptionsSettings) {
  const toastPosition = document.getElementById("toastPosition") as HTMLSelectElement;
  if (toastPosition) {
    toastPosition.value = settings.toastPosition ?? "top-right";
  }
}

function resetOptionsSettings() {
  if (confirm("토스트 위치를 기본값으로 초기화하시겠습니까?")) {
    applyToUI(OPTIONS_DEFAULTS);
    saveOptionsSettings();
    updateStatus("기본값으로 초기화되었습니다!", "success");
  }
}

function notifyActiveTab(settings: any) {
  if (typeof chrome !== "undefined" && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs[0]?.id) {
        chrome.tabs
          .sendMessage(tabs[0].id, {
            type: "SETTINGS_UPDATED",
            settings: settings,
          })
          .catch(() => {
            // 무시
          });
      }
    });
  }
}

// 테마 동기화 함수들
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  const toggleButton = document.getElementById("themeToggle");

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (toggleButton) {
      toggleButton.setAttribute("data-theme", "dark");
    }
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (toggleButton) {
      toggleButton.setAttribute("data-theme", "light");
    }
  }
}

function toggleTheme() {
  const isDark = document.documentElement.hasAttribute("data-theme");
  const toggleButton = document.getElementById("themeToggle");

  if (isDark) {
    // 라이트모드로 변경
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    if (toggleButton) {
      toggleButton.setAttribute("data-theme", "light");
    }
  } else {
    // 다크모드로 변경
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    if (toggleButton) {
      toggleButton.setAttribute("data-theme", "dark");
    }
  }
}

// 전역 함수로 노출 (더 이상 필요 없음 - 이벤트 리스너 사용)

document.addEventListener("DOMContentLoaded", () => {
  // 테마 먼저 로드
  loadTheme();

  loadOptionsSettings();

  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");
  const indexBtn = document.getElementById("indexBtn");
  const themeToggle = document.getElementById("themeToggle");
  const toastPosition = document.getElementById("toastPosition");

  if (saveBtn) {
    saveBtn.addEventListener("click", saveOptionsSettings);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetOptionsSettings);
  }

  if (indexBtn) {
    indexBtn.addEventListener("click", () => {
      // 홈페이지 열기
      chrome.tabs.create({
        url: chrome.runtime.getURL("index.html"),
      });
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (toastPosition) {
    toastPosition.addEventListener("change", () => {
      updateStatus("저장 중...", "info");
      setTimeout(saveOptionsSettings, 300);
    });
  }

  document.addEventListener("keydown", e => {
    // Windows: Ctrl+S, Mac: Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveOptionsSettings();
    }
    // Windows: Ctrl+R, Mac: Cmd+R
    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault();
      resetOptionsSettings();
    }
  });
});

window.addEventListener("beforeunload", e => {
  const status = document.getElementById("status");
  if (status?.textContent?.includes("저장 중")) {
    e.preventDefault();
    e.returnValue = "저장되지 않은 변경사항이 있습니다.";
  }
});
