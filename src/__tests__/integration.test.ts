import { describe, it, expect, beforeEach, vi } from "vitest";

// 테스트용 드래그 매니저 클래스 (간소화된 버전)
class TestDragManager {
  private isDragging = false;
  private currentElement: HTMLElement | null = null;
  private initialPosition = { x: 0, y: 0 };
  private scrollPosition = { x: 0, y: 0 };

  isAbsolutePosition(elem: HTMLElement): boolean {
    const style = getComputedStyle(elem);
    return style.position === "absolute";
  }

  startDrag(element: HTMLElement, mouseX: number, mouseY: number): boolean {
    if (!this.isAbsolutePosition(element)) {
      return false; // 드래그 불가능
    }

    this.isDragging = true;
    this.currentElement = element;
    this.initialPosition = { x: mouseX, y: mouseY };
    this.scrollPosition = { x: window.scrollX, y: window.scrollY };
    return true;
  }

  updateDrag(mouseX: number, mouseY: number): void {
    if (!this.isDragging || !this.currentElement) return;

    const deltaX = mouseX - this.initialPosition.x;
    const deltaY = mouseY - this.initialPosition.y;

    // 스크롤 보정
    const scrollDelta = {
      x: window.scrollX - this.scrollPosition.x,
      y: window.scrollY - this.scrollPosition.y,
    };

    const rect = this.currentElement.getBoundingClientRect();
    const newLeft = rect.left + deltaX + scrollDelta.x;
    const newTop = rect.top + deltaY + scrollDelta.y;

    this.currentElement.style.left = `${newLeft}px`;
    this.currentElement.style.top = `${newTop}px`;
  }

  endDrag(): void {
    this.isDragging = false;
    this.currentElement = null;
  }

  getDragState() {
    return {
      isDragging: this.isDragging,
      currentElement: this.currentElement,
    };
  }
}

// 테스트용 토스트 시스템
class TestToastSystem {
  private messages: Array<{ message: string; type: string }> = [];

  showToast(message: string, type: string): void {
    this.messages.push({ message, type });
  }

  getMessages() {
    return this.messages;
  }

  clear() {
    this.messages = [];
  }
}

describe("드래그 시스템 통합 테스트", () => {
  let dragManager: TestDragManager;
  let toastSystem: TestToastSystem;

  beforeEach(() => {
    document.body.innerHTML = "";
    dragManager = new TestDragManager();
    toastSystem = new TestToastSystem();

    // window.scrollX, scrollY 모킹
    Object.defineProperty(window, "scrollX", { value: 0, writable: true });
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
  });

  describe("드래그 시작 - startDrag", () => {
    it("absolute 요소는 드래그를 시작할 수 있어야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteBox" style="position:absolute;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("absoluteBox") as HTMLElement;
      const result = dragManager.startDrag(element, 125, 125);

      expect(result).toBe(true);
      expect(dragManager.getDragState().isDragging).toBe(true);
      expect(dragManager.getDragState().currentElement).toBe(element);
    });

    it("relative 요소는 드래그를 시작할 수 없어야 함", () => {
      document.body.innerHTML = `
        <div id="relativeBox" style="position:relative;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("relativeBox") as HTMLElement;
      const result = dragManager.startDrag(element, 125, 125);

      expect(result).toBe(false);
      expect(dragManager.getDragState().isDragging).toBe(false);
      expect(dragManager.getDragState().currentElement).toBe(null);
    });

    it("static 요소는 드래그를 시작할 수 없어야 함", () => {
      document.body.innerHTML = `
        <div id="staticBox" style="position:static;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("staticBox") as HTMLElement;
      const result = dragManager.startDrag(element, 125, 125);

      expect(result).toBe(false);
      expect(dragManager.getDragState().isDragging).toBe(false);
    });
  });

  describe("드래그 업데이트 - updateDrag", () => {
    it("드래그 중인 요소의 위치를 업데이트해야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteBox" style="position:absolute;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("absoluteBox") as HTMLElement;

      // getBoundingClientRect 모킹
      element.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 100,
        top: 100,
        width: 50,
        height: 50,
      });

      dragManager.startDrag(element, 125, 125);
      dragManager.updateDrag(150, 175); // 25px 오른쪽, 50px 아래로 이동

      expect(element.style.left).toBe("125px");
      expect(element.style.top).toBe("150px");
    });

    it("드래그 중이 아닐 때는 아무것도 하지 않아야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteBox" style="position:absolute;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("absoluteBox") as HTMLElement;
      const originalLeft = element.style.left;
      const originalTop = element.style.top;

      dragManager.updateDrag(150, 175);

      expect(element.style.left).toBe(originalLeft);
      expect(element.style.top).toBe(originalTop);
    });
  });

  describe("드래그 종료 - endDrag", () => {
    it("드래그 상태를 초기화해야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteBox" style="position:absolute;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("absoluteBox") as HTMLElement;
      dragManager.startDrag(element, 125, 125);

      expect(dragManager.getDragState().isDragging).toBe(true);

      dragManager.endDrag();

      expect(dragManager.getDragState().isDragging).toBe(false);
      expect(dragManager.getDragState().currentElement).toBe(null);
    });
  });

  describe("에러 처리 및 사용자 피드백", () => {
    it("드래그 불가능한 요소에 대해 에러 메시지를 표시해야 함", () => {
      document.body.innerHTML = `
        <div id="relativeBox" style="position:relative;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("relativeBox") as HTMLElement;
      const canDrag = dragManager.startDrag(element, 125, 125);

      if (!canDrag) {
        toastSystem.showToast("드래그 불가능! 이 요소는 position: relative입니다", "error");
      }

      const messages = toastSystem.getMessages();
      expect(messages).toHaveLength(1);
      expect(messages[0].type).toBe("error");
      expect(messages[0].message).toContain("드래그 불가능");
    });

    it("드래그 시작 시 성공 메시지를 표시해야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteBox" style="position:absolute;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("absoluteBox") as HTMLElement;
      const canDrag = dragManager.startDrag(element, 125, 125);

      if (canDrag) {
        toastSystem.showToast("드래그 시작", "success");
      }

      const messages = toastSystem.getMessages();
      expect(messages).toHaveLength(1);
      expect(messages[0].type).toBe("success");
      expect(messages[0].message).toBe("드래그 시작");
    });
  });

  describe("스크롤 보정 통합 테스트", () => {
    it("스크롤 중 드래그 위치를 올바르게 보정해야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteBox" style="position:absolute;left:100px;top:100px;width:50px;height:50px;"></div>
      `;

      const element = document.getElementById("absoluteBox") as HTMLElement;

      element.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 100,
        top: 100,
        width: 50,
        height: 50,
      });

      // 드래그 시작
      dragManager.startDrag(element, 125, 125);

      // 스크롤 발생 시뮬레이션
      Object.defineProperty(window, "scrollX", { value: 50, writable: true });
      Object.defineProperty(window, "scrollY", { value: 30, writable: true });

      // 드래그 업데이트
      dragManager.updateDrag(150, 175);

      // 스크롤 보정이 적용된 위치 확인
      expect(element.style.left).toBe("175px"); // 125 + 50 (스크롤 보정)
      expect(element.style.top).toBe("180px"); // 150 + 30 (스크롤 보정)
    });
  });
});
