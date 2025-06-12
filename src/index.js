// index.html용 JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // 테마 토글 버튼 이벤트 리스너
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // 설치 버튼들 이벤트 리스너
  const installButtons = document.querySelectorAll(".install-button");
  installButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.preventDefault();
      alert("크롬 웹 스토어에서 Elements Position Drag Overlay를 검색하세요!");
    });
  });

  // 페이지 로드 시 테마 적용
  loadTheme();
});

// 다크모드 토글 함수
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

// 테마 로드 함수
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
