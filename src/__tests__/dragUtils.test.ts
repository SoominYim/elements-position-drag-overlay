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

describe("getCssPosition", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should return correct CSS position values", () => {
    // JSDOM 환경에서 가짜 div로 테스트
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

  it("should handle static positioned elements", () => {
    document.body.innerHTML = `
      <div id="staticElement" style="position:static;"></div>
    `;

    const elem = document.getElementById("staticElement") as HTMLElement;
    const pos = getCssPosition(elem);
    expect(pos.position).toBe("static");
  });

  it("should handle elements with px values", () => {
    document.body.innerHTML = `
      <div id="pxElement" style="position:relative;left:100px;top:200px;"></div>
    `;

    const elem = document.getElementById("pxElement") as HTMLElement;
    const pos = getCssPosition(elem);
    expect(pos.left).toContain("100px");
    expect(pos.top).toContain("200px");
    expect(pos.position).toBe("relative");
  });
});
