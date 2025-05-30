// SVG → PNG 변환(아이콘 자동 생성)
const sharp = require("sharp");
const sizes = [16, 48, 128];
const fs = require("fs");
const path = require("path");

async function convertSvgToPng() {
  const input = path.join(__dirname, "../src/icons/icon.svg");

  if (!fs.existsSync(input)) {
    console.error("❌ icon.svg 파일을 찾을 수 없습니다:", input);
    return;
  }

  console.log("🚀 SVG → PNG 변환 시작...");

  for (const size of sizes) {
    try {
      const outputPath = path.join(__dirname, `../src/icons/icon${size}.png`);

      await sharp(input)
        .resize(size, size)
        .png({
          quality: 100,
          compressionLevel: 0,
        })
        .toFile(outputPath);

      console.log(`✅ icon${size}.png 생성 완료`);
    } catch (error) {
      console.error(`❌ icon${size}.png 생성 실패:`, error.message);
    }
  }

  console.log("🎉 모든 아이콘 생성 완료!");
}

// 스크립트 실행
convertSvgToPng().catch(console.error);
