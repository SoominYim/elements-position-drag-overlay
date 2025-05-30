// Chrome 확장 설정 관리 (함수형)
import { ExtensionSettings, OverlayConfig } from "../types";

// 상태
let isEnabled = false;
let settings: ExtensionSettings = {
  enabled: false,
  config: {
    showOverlay: true,
    overlayPosition: "top-left",
    overlayOpacity: 0.9,
  },
};

// 콜백 함수들
let onEnabledChangeCallback: (enabled: boolean) => void = () => {};
let onConfigChangeCallback: (config: OverlayConfig) => void = () => {};

// 설정 로드
async function loadSettings(): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage) {
    const result = await chrome.storage.sync.get(["enabled", "config"]);
    isEnabled = result.enabled !== false;
    if (result.config) {
      settings.config = { ...settings.config, ...result.config };
    }
  }
}

// 리스너 설정
function setupListeners(): void {
  if (typeof chrome !== "undefined" && chrome.storage) {
    // 설정 변경 리스너
    chrome.storage.onChanged.addListener(changes => {
      if (changes.enabled) {
        isEnabled = changes.enabled.newValue;
        onEnabledChangeCallback(isEnabled);
      }
      if (changes.config) {
        settings.config = { ...settings.config, ...changes.config.newValue };
        onConfigChangeCallback(settings.config);
      }
    });

    // 메시지 리스너
    chrome.runtime.onMessage.addListener(message => {
      if (message.action === "toggle") {
        toggleExtension();
      }
    });
  }
}

// 공개 함수들
export function isExtensionEnabled(): boolean {
  return isEnabled;
}

export function getConfig(): OverlayConfig {
  return settings.config;
}

export async function toggleExtension(): Promise<void> {
  isEnabled = !isEnabled;
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.sync.set({ enabled: isEnabled });
  }
  onEnabledChangeCallback(isEnabled);
}

export function setOnEnabledChange(callback: (enabled: boolean) => void): void {
  onEnabledChangeCallback = callback;
}

export function setOnConfigChange(callback: (config: OverlayConfig) => void): void {
  onConfigChangeCallback = callback;
}

// 초기화
export async function initExtensionConfig(): Promise<void> {
  await loadSettings();
  setupListeners();
}
