import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// 테스트용 토스트 시스템 (실제 구현과 유사)
class TestToastSystem {
  private container: HTMLElement | null = null;

  constructor() {
    this.createContainer();
  }

  private createContainer(): void {
    this.container = document.createElement("div");
    this.container.id = "toast-container";
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 100000;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  showToast(message: string, type: "success" | "error" | "warning" | "info" = "info"): void {
    if (!this.container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const colors = {
      success: "#27ae60",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
    };

    toast.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      font-family: monospace;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
    `;

    this.container.appendChild(toast);

    // 애니메이션
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    }, 10);

    // 자동 제거
    setTimeout(() => {
      this.removeToast(toast);
    }, 3000);
  }

  private removeToast(toast: HTMLElement): void {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  getToastCount(): number {
    return this.container ? this.container.children.length : 0;
  }

  getAllToasts(): HTMLElement[] {
    if (!this.container) return [];
    return Array.from(this.container.children) as HTMLElement[];
  }

  clear(): void {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
}

describe("토스트 시스템 유닛 테스트", () => {
  let toastSystem: TestToastSystem;

  beforeEach(() => {
    document.body.innerHTML = "";
    toastSystem = new TestToastSystem();
  });

  afterEach(() => {
    toastSystem.destroy();
  });

  describe("토스트 생성 및 표시", () => {
    it("성공 토스트를 올바르게 생성해야 함", () => {
      toastSystem.showToast("드래그 시작", "success");

      const toasts = toastSystem.getAllToasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].textContent).toBe("드래그 시작");
      expect(toasts[0].className).toContain("toast-success");
    });

    it("에러 토스트를 올바르게 생성해야 함", () => {
      toastSystem.showToast("드래그 불가능! 이 요소는 position: relative입니다", "error");

      const toasts = toastSystem.getAllToasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].textContent).toContain("드래그 불가능");
      expect(toasts[0].className).toContain("toast-error");
    });

    it("경고 토스트를 올바르게 생성해야 함", () => {
      toastSystem.showToast("주의: 스크롤 중입니다", "warning");

      const toasts = toastSystem.getAllToasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].textContent).toBe("주의: 스크롤 중입니다");
      expect(toasts[0].className).toContain("toast-warning");
    });

    it("정보 토스트를 올바르게 생성해야 함", () => {
      toastSystem.showToast("Ctrl 키를 누르고 드래그하세요", "info");

      const toasts = toastSystem.getAllToasts();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].textContent).toBe("Ctrl 키를 누르고 드래그하세요");
      expect(toasts[0].className).toContain("toast-info");
    });
  });

  describe("토스트 스타일링", () => {
    it("성공 토스트는 녹색 배경을 가져야 함", () => {
      toastSystem.showToast("성공", "success");

      const toast = toastSystem.getAllToasts()[0];
      expect(toast.style.background).toBe("rgb(39, 174, 96)"); // #27ae60
    });

    it("에러 토스트는 빨간색 배경을 가져야 함", () => {
      toastSystem.showToast("에러", "error");

      const toast = toastSystem.getAllToasts()[0];
      expect(toast.style.background).toBe("rgb(231, 76, 60)"); // #e74c3c
    });

    it("모든 토스트는 기본 스타일을 가져야 함", () => {
      toastSystem.showToast("테스트", "info");

      const toast = toastSystem.getAllToasts()[0];
      expect(toast.style.color).toBe("white");
      expect(toast.style.fontFamily).toBe("monospace");
      expect(toast.style.borderRadius).toBe("8px");
    });
  });

  describe("토스트 관리", () => {
    it("여러 토스트를 동시에 표시할 수 있어야 함", () => {
      toastSystem.showToast("첫 번째", "info");
      toastSystem.showToast("두 번째", "success");
      toastSystem.showToast("세 번째", "error");

      expect(toastSystem.getToastCount()).toBe(3);
    });

    it("토스트를 모두 지울 수 있어야 함", () => {
      toastSystem.showToast("테스트 1", "info");
      toastSystem.showToast("테스트 2", "success");

      expect(toastSystem.getToastCount()).toBe(2);

      toastSystem.clear();

      expect(toastSystem.getToastCount()).toBe(0);
    });

    it("토스트 컨테이너가 올바른 위치에 생성되어야 함", () => {
      const container = document.getElementById("toast-container");

      expect(container).toBeTruthy();
      expect(container?.style.position).toBe("fixed");
      expect(container?.style.top).toBe("20px");
      expect(container?.style.right).toBe("20px");
      expect(container?.style.zIndex).toBe("100000");
    });
  });

  describe("토스트 자동 제거", () => {
    it("토스트가 3초 후 자동으로 제거되어야 함", async () => {
      vi.useFakeTimers();

      toastSystem.showToast("자동 제거 테스트", "info");
      expect(toastSystem.getToastCount()).toBe(1);

      // 3초 후
      vi.advanceTimersByTime(3000);

      // 애니메이션 완료 대기 (300ms)
      vi.advanceTimersByTime(300);

      expect(toastSystem.getToastCount()).toBe(0);

      vi.useRealTimers();
    });
  });
});
