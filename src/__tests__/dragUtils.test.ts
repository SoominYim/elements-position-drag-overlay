import { describe, it, expect, beforeEach } from "vitest";

// 테스트용 getCssPosition 함수 (직접 정의)
function getCssPosition(elem: HTMLElement) {
  const style = getComputedStyle(elem);
  return {
    left: style.left,
    top: style.top,
    right: style.right,
    bottom: style.bottom,
    position: style.position,
  };
}

// 테스트용 position 검증 함수
function isAbsolutePosition(elem: HTMLElement): boolean {
  const style = getComputedStyle(elem);
  return style.position === "absolute";
}

// 테스트용 스크롤 보정 함수
function calculateScrollDelta(
  currentScrollX: number,
  currentScrollY: number,
  initialScrollX: number,
  initialScrollY: number
) {
  return {
    deltaX: currentScrollX - initialScrollX,
    deltaY: currentScrollY - initialScrollY,
  };
}

describe("CSS Position 유틸리티 함수", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("getCssPosition - CSS 위치값 가져오기", () => {
    it("absolute 요소의 CSS position 값을 올바르게 반환해야 함", () => {
      document.body.innerHTML = `
        <div id="testElement" style="position:absolute;left:22px;top:33px;right:auto;bottom:auto;"></div>
      `;

      const elem = document.getElementById("testElement") as HTMLElement;
      expect(elem).toBeTruthy();

      const pos = getCssPosition(elem);
      expect(pos.left).toMatch(/22/);
      expect(pos.top).toMatch(/33/);
      expect(pos.position).toBe("absolute");
    });

    it("static 요소를 올바르게 처리해야 함", () => {
      document.body.innerHTML = `
        <div id="staticElement" style="position:static;"></div>
      `;

      const elem = document.getElementById("staticElement") as HTMLElement;
      const pos = getCssPosition(elem);
      expect(pos.position).toBe("static");
    });

    it("relative 요소의 px 값을 올바르게 처리해야 함", () => {
      document.body.innerHTML = `
        <div id="pxElement" style="position:relative;left:100px;top:200px;"></div>
      `;

      const elem = document.getElementById("pxElement") as HTMLElement;
      const pos = getCssPosition(elem);
      expect(pos.left).toContain("100px");
      expect(pos.top).toContain("200px");
      expect(pos.position).toBe("relative");
    });

    it("fixed 요소를 올바르게 처리해야 함", () => {
      document.body.innerHTML = `
        <div id="fixedElement" style="position:fixed;left:50px;top:60px;"></div>
      `;

      const elem = document.getElementById("fixedElement") as HTMLElement;
      const pos = getCssPosition(elem);
      expect(pos.left).toContain("50px");
      expect(pos.top).toContain("60px");
      expect(pos.position).toBe("fixed");
    });
  });

  describe("isAbsolutePosition - position 속성 검증", () => {
    it("absolute 요소에 대해 true를 반환해야 함", () => {
      document.body.innerHTML = `
        <div id="absoluteElement" style="position:absolute;"></div>
      `;

      const elem = document.getElementById("absoluteElement") as HTMLElement;
      expect(isAbsolutePosition(elem)).toBe(true);
    });

    it("relative 요소에 대해 false를 반환해야 함", () => {
      document.body.innerHTML = `
        <div id="relativeElement" style="position:relative;"></div>
      `;

      const elem = document.getElementById("relativeElement") as HTMLElement;
      expect(isAbsolutePosition(elem)).toBe(false);
    });

    it("static 요소에 대해 false를 반환해야 함", () => {
      document.body.innerHTML = `
        <div id="staticElement" style="position:static;"></div>
      `;

      const elem = document.getElementById("staticElement") as HTMLElement;
      expect(isAbsolutePosition(elem)).toBe(false);
    });

    it("fixed 요소에 대해 false를 반환해야 함", () => {
      document.body.innerHTML = `
        <div id="fixedElement" style="position:fixed;"></div>
      `;

      const elem = document.getElementById("fixedElement") as HTMLElement;
      expect(isAbsolutePosition(elem)).toBe(false);
    });
  });

  describe("calculateScrollDelta - 스크롤 보정 계산", () => {
    it("스크롤 변화량을 올바르게 계산해야 함", () => {
      const result = calculateScrollDelta(100, 200, 50, 80);
      expect(result.deltaX).toBe(50);
      expect(result.deltaY).toBe(120);
    });

    it("스크롤이 없을 때 0을 반환해야 함", () => {
      const result = calculateScrollDelta(100, 200, 100, 200);
      expect(result.deltaX).toBe(0);
      expect(result.deltaY).toBe(0);
    });

    it("음수 스크롤 변화량을 올바르게 계산해야 함", () => {
      const result = calculateScrollDelta(50, 80, 100, 200);
      expect(result.deltaX).toBe(-50);
      expect(result.deltaY).toBe(-120);
    });
  });
});
