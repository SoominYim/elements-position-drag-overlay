// Options Page Script
interface ChromeStorage {
  enabled?: boolean;
  overlayPosition?: string;
}

function updateOptionsStatus(message: string, type: "success" | "error" | "info" = "info") {
  const status = document.getElementById("status");
  if (status) {
    const icons = { success: "✅", error: "❌", info: "⚙️" };
    status.textContent = `${icons[type]} ${message}`;
  }
}

function saveSettings() {
  const enableExtension = (document.getElementById("enableExtension") as HTMLInputElement)?.checked;
  const overlayPosition = (document.getElementById("overlayPosition") as HTMLSelectElement)?.value;

  const settings: ChromeStorage = {
    enabled: enableExtension,
    overlayPosition: overlayPosition,
  };

  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.set(settings, () => {
      updateOptionsStatus("설정이 저장되었습니다!", "success");
      setTimeout(() => updateOptionsStatus("설정을 변경하세요", "info"), 2000);
    });
  } else {
    // 로컬 스토리지 폴백
    localStorage.setItem("epo-settings", JSON.stringify(settings));
    updateOptionsStatus("설정이 저장되었습니다! (로컬)", "success");
  }
}

function loadSettings() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(["enabled", "overlayPosition"], (result: ChromeStorage) => {
      const enableExtension = document.getElementById("enableExtension") as HTMLInputElement;
      const overlayPosition = document.getElementById("overlayPosition") as HTMLSelectElement;

      if (enableExtension) {
        enableExtension.checked = result.enabled !== false;
      }

      if (overlayPosition) {
        overlayPosition.value = result.overlayPosition || "top-right";
      }

      updateOptionsStatus("설정을 불러왔습니다", "success");
    });
  } else {
    // 로컬 스토리지 폴백
    const saved = localStorage.getItem("epo-settings");
    if (saved) {
      const settings = JSON.parse(saved) as ChromeStorage;
      const enableExtension = document.getElementById("enableExtension") as HTMLInputElement;
      const overlayPosition = document.getElementById("overlayPosition") as HTMLSelectElement;

      if (enableExtension) {
        enableExtension.checked = settings.enabled !== false;
      }

      if (overlayPosition) {
        overlayPosition.value = settings.overlayPosition || "top-right";
      }
    }
    updateOptionsStatus("설정을 불러왔습니다 (로컬)", "info");
  }
}

function resetSettings() {
  if (confirm("모든 설정을 초기화하시겠습니까?")) {
    const enableExtension = document.getElementById("enableExtension") as HTMLInputElement;
    const overlayPosition = document.getElementById("overlayPosition") as HTMLSelectElement;

    if (enableExtension) enableExtension.checked = true;
    if (overlayPosition) overlayPosition.value = "top-right";

    saveSettings();
    updateOptionsStatus("설정이 초기화되었습니다!", "success");
  }
}

// DOM 로드 완료 시 실행
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  // 이벤트 리스너
  const saveBtn = document.getElementById("saveBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", saveSettings);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetSettings);
  }

  // 실시간 저장
  const enableExtension = document.getElementById("enableExtension");
  const overlayPosition = document.getElementById("overlayPosition");

  if (enableExtension) {
    enableExtension.addEventListener("change", () => {
      updateOptionsStatus("변경사항이 자동 저장됩니다...", "info");
      setTimeout(saveSettings, 500);
    });
  }

  if (overlayPosition) {
    overlayPosition.addEventListener("change", () => {
      updateOptionsStatus("변경사항이 자동 저장됩니다...", "info");
      setTimeout(saveSettings, 500);
    });
  }
});
