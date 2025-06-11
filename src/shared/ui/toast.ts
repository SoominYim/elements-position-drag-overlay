// 토스트 UI 모듈
let toastContainer: HTMLDivElement | null = null;

// 토스트 컨테이너 초기화
function initToastContainer(): void {
  if (toastContainer) return;

  toastContainer = document.createElement("div");
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100000;
    pointer-events: none;
  `;
  document.body.appendChild(toastContainer);
}

// 토스트 메시지 표시
export function showToast(message: string, type: "error" | "success" | "warning" | "info" = "info"): void {
  initToastContainer();

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: ${getToastColor(type)};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    pointer-events: auto;
    border-left: 4px solid ${getToastBorderColor(type)};
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  // 아이콘 추가
  const icon = getToastIcon(type);
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  toastContainer!.appendChild(toast);

  // 애니메이션으로 표시
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  });

  // 3초 후 자동 제거
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    toast.style.opacity = "0";

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 토스트 색상 가져오기
function getToastColor(type: string): string {
  switch (type) {
    case "error":
      return "#e74c3c";
    case "success":
      return "#27ae60";
    case "warning":
      return "#f39c12";
    case "info":
      return "#3498db";
    default:
      return "#3498db";
  }
}

// 토스트 테두리 색상 가져오기
function getToastBorderColor(type: string): string {
  switch (type) {
    case "error":
      return "#c0392b";
    case "success":
      return "#229954";
    case "warning":
      return "#d68910";
    case "info":
      return "#2980b9";
    default:
      return "#2980b9";
  }
}

// 토스트 아이콘 가져오기
function getToastIcon(type: string): string {
  switch (type) {
    case "error":
      return "❌";
    case "success":
      return "✅";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
    default:
      return "ℹ️";
  }
}

// 모든 토스트 제거
export function clearToasts(): void {
  if (toastContainer) {
    toastContainer.innerHTML = "";
  }
}
