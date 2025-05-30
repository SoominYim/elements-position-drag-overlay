const http = require("http");
const fs = require("fs");
const path = require("path");

console.log("🚀 정적 서버 시작...");

const server = http.createServer((req, res) => {
  const filePath = path.join("./dist", req.url === "/" ? "index.html" : req.url);

  try {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);

    let contentType = "text/plain";
    if (ext === ".js") contentType = "application/javascript";
    else if (ext === ".css") contentType = "text/css";
    else if (ext === ".html") contentType = "text/html";
    else if (ext === ".json") contentType = "application/json";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("404 - Not Found");
  }
});

server.listen(3000, () => {
  console.log("✅ 서버 실행: http://localhost:3000");
  console.log("📁 dist 폴더 서빙 중...");
  console.log("💡 Ctrl+C로 종료");
});

process.on("SIGINT", () => {
  console.log("\n🛑 서버 종료...");
  server.close();
  process.exit(0);
});
