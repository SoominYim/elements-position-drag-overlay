const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const http = require("http");

console.log("🚀 개발 서버 시작...");

// 초기 빌드
console.log("📦 초기 빌드 중...");
exec("npm run build", err => {
  if (err) {
    console.error("❌ 초기 빌드 실패:", err);
    return;
  }
  console.log("✅ 초기 빌드 완료");

  // 파일 감시 (모든 파일)
  console.log("👀 파일 감시 시작...");
  let buildTimeout;

  fs.watch("./src", { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes("node_modules")) {
      console.log(`🔄 파일 변경: ${filename}`);

      // 디바운스: 100ms 내에 여러 변경사항이 있으면 마지막 것만 처리
      clearTimeout(buildTimeout);
      buildTimeout = setTimeout(() => {
        exec("npm run build", err => {
          if (!err) {
            console.log(`✅ 빌드 완료: ${new Date().toLocaleTimeString()}`);
          } else {
            console.log(`❌ 빌드 에러: ${err.message}`);
          }
        });
      }, 100);
    }
  });

  // manifest.json 감시
  fs.watch("./manifest.json", () => {
    console.log("🔄 manifest.json 변경됨");
    exec("npm run copy:manifest", err => {
      if (!err) {
        console.log("📁 manifest.json 복사 완료");
      }
    });
  });

  // 개발 서버 시작 (src 폴더 기본 서빙)
  const server = http.createServer((req, res) => {
    // src 폴더를 기본으로 서빙
    let requestPath = req.url;

    // 루트 경로면 src/index.html로 리다이렉트
    if (requestPath === "/") {
      requestPath = "/src/index.html";
    }
    // src로 시작하지 않으면 src/ 접두사 추가
    else if (!requestPath.startsWith("/src/") && !requestPath.startsWith("/dist/")) {
      requestPath = "/src" + requestPath;
    }

    let filePath = path.join(".", requestPath);

    // src에서 찾을 수 없으면 dist에서 찾기
    if (!fs.existsSync(filePath) && requestPath.startsWith("/src/")) {
      filePath = path.join("./dist", requestPath.replace("/src/", "/"));
    }

    try {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath);

      let contentType = "text/plain";
      if (ext === ".js") contentType = "application/javascript";
      else if (ext === ".css") contentType = "text/css";
      else if (ext === ".html") contentType = "text/html";
      else if (ext === ".json") contentType = "application/json";
      else if (ext === ".ts") contentType = "text/plain";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "no-cache",
      });
      res.end(content);
    } catch {
      // 404 페이지에 폴더 브라우징 기능 추가
      try {
        const srcPath = "./src";
        const files = fs.readdirSync(srcPath);
        const fileList = files
          .map(file => {
            const isDir = fs.statSync(path.join(srcPath, file)).isDirectory();
            return `<li><a href="/src/${file}">${file}${isDir ? "/" : ""}</a></li>`;
          })
          .join("");

        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>개발 서버 - src 폴더</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              h1 { color: #333; }
              ul { list-style: none; padding: 0; }
              li { margin: 5px 0; }
              a { color: #0066cc; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>📁 src 폴더</h1>
            <ul>
              ${fileList}
            </ul>
            <hr>
            <p>💡 개발 서버가 src 폴더를 기본으로 서빙합니다.</p>
            <p>🔄 파일 변경시 자동으로 빌드됩니다.</p>
          </body>
          </html>
        `;

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      } catch {
        res.writeHead(404);
        res.end("Not Found");
      }
    }
  });

  server.listen(3000, () => {
    console.log("\n🎉 개발 환경 준비 완료!");
    console.log("🌐 서버: http://localhost:3000 (src 폴더 기본)");
    console.log("👀 파일 변경 감시 중...");
    console.log("🔄 파일 변경시 자동 빌드");
    console.log("\n💡 Ctrl+C로 종료");
  });

  // 종료 시 정리
  process.on("SIGINT", () => {
    console.log("\n🛑 개발 서버 종료...");
    server.close();
    process.exit(0);
  });
});
