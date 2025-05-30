# 🎯 Elements Position Drag Overlay

**실시간 CSS Position 오버레이 도구**

Alt+드래그로 웹 요소의 CSS position(left/top 등) 값을 실시간 오버레이로 보여주는 크롬 확장 및 웹 도구입니다. 개발자, 디자이너, QA를 위한 필수 생산성 툴입니다.

![Demo GIF](https://via.placeholder.com/800x400/3659b5/ffffff?text=Alt%2B%EB%93%9C%EB%9E%98%EA%B7%B8%EB%A1%9C%20%EC%9A%94%EC%86%8C%20%EC%9D%B4%EB%8F%99%20%26%20%EC%A2%8C%ED%91%9C%20%ED%91%9C%EC%8B%9C)

## ✨ 주요 기능

- 🎨 **실시간 Position 표시**: 드래그하는 동안 left, top, right, bottom 값을 실시간으로 확인
- 🔧 **개발자 친화적**: CSS position 속성과 요소 크기까지 한눈에 파악
- ⚡ **빠른 프로토타이핑**: UI 레이아웃 조정과 반응형 디자인 작업에 최적화
- 🌐 **크롬 확장 + 웹 데모**: 모든 웹사이트에서 사용 가능 + 독립 실행형 데모
- 🔥 **현대적 기술스택**: TypeScript, ESM, Vitest, 다중 패키지 매니저 지원

## 🚀 빠른 시작

> 📦 **패키지 매니저 선택 가이드**: [PACKAGE_MANAGER.md](./PACKAGE_MANAGER.md)에서 상세한 비교와 최적화 팁을 확인하세요!

> ⚠️ **중요**: 이 레포지토리는 소스 코드만 포함합니다. 사용하려면 반드시 빌드가 필요합니다!

### 📦 설치 및 빌드 (필수)

GitHub에서 클론한 후 다음 단계를 따라주세요:

<details>
<summary><strong>🧶 Yarn (권장)</strong></summary>

```bash
# 1. 레포지토리 클론
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
yarn install

# 3. 아이콘 생성 (SVG → PNG)
yarn svg2png

# 4. 빌드 (TypeScript → JavaScript + 파일 복사)
yarn build

# 5. 테스트 (선택사항)
yarn test:run
```

</details>

<details>
<summary><strong>📦 npm</strong></summary>

```bash
# 1. 레포지토리 클론
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
npm install

# 3. 아이콘 생성 (SVG → PNG)
npm run svg2png

# 4. 빌드 (TypeScript → JavaScript + 파일 복사)
npm run build

# 5. 테스트 (선택사항)
npm run test:run
```

</details>

<details>
<summary><strong>⚡ pnpm</strong></summary>

```bash
# 1. 레포지토리 클론
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
pnpm install

# 3. 아이콘 생성 (SVG → PNG)
pnpm svg2png

# 4. 빌드 (TypeScript → JavaScript + 파일 복사)
pnpm build

# 5. 테스트 (선택사항)
pnpm test:run
```

</details>

### 🌐 웹 데모 바로 보기

**CORS 정책으로 인해 로컬 서버 실행이 필요합니다!**

<details>
<summary><strong>🚀 방법 1: 내장 Node.js 서버 (권장)</strong></summary>

```bash
# 빌드 + 서버 실행 (자동)
npm start           # 또는 yarn start / pnpm start

# 또는 수동으로
npm run build       # 빌드
npm run serve       # http://localhost:3000 서버 실행
```

**접속**: http://localhost:3000

</details>

<details>
<summary><strong>🐍 방법 2: Python 서버</strong></summary>

```bash
# Python 3
npm run serve:python3     # http://localhost:8000

# Python 2 (구버전)
npm run serve:python      # http://localhost:8000

# 또는 수동으로
npm run build
cd dist
python -m http.server 8000
```

**접속**: http://localhost:8000

</details>

<details>
<summary><strong>🌟 방법 3: 기타 서버들</strong></summary>

```bash
# Live Server (VS Code 확장)
# index.html 우클릭 → "Open with Live Server"

# http-server (글로벌 설치)
npm install -g http-server
npm run build
cd dist && http-server

# serve (글로벌 설치)
npm install -g serve
npm run build
serve dist
```

</details>

> ⚠️ **왜 file:// 로 안 되나요?** 브라우저의 CORS 보안 정책으로 인해 `file://` 프로토콜에서는 JavaScript 모듈 로드가 차단됩니다.

**사용법**: Alt + 드래그로 파란색 박스를 움직여보세요! 🎯

### 🧩 크롬 확장으로 설치

> 🚀 **상세 가이드**: [CHROME_EXTENSION_GUIDE.md](./CHROME_EXTENSION_GUIDE.md)에서 스크린샷과 함께 단계별 설치 방법을 확인하세요!

1. 빌드 실행하여 dist/ 폴더 생성:
   ```bash
   yarn build    # 또는 npm run build / pnpm build
   ```
2. Chrome 브라우저 → 확장 프로그램 관리 (`chrome://extensions/`)
3. 우측 상단 **개발자 모드** ON
4. **"압축해제된 확장 프로그램 로드"** 클릭
5. **dist/** 폴더 선택
6. 🎉 설치 완료!

**사용법**: 이제 **모든 웹사이트**에서 Alt+드래그 사용 가능! 🌍

## 🎮 사용법

### 웹 데모에서:

- `Alt + 드래그`로 요소 이동
- 실시간 CSS 좌표값 오버레이 표시 (우측 상단)
- 좌측 상단 상태바에서 현재 동작 확인

### 크롬 확장에서:

- **모든 웹사이트**에서 `Alt + 드래그` 사용 가능
- `Alt + D`: 확장 ON/OFF 토글
- 확장 아이콘 클릭 → 팝업에서 설정 관리
- 설정 페이지에서 오버레이 위치 변경

## 🏗 프로젝트 구조

```
elements-position-overlay/
├── 📄 package.json          # 프로젝트 설정 (다중 패키지 매니저 지원)
├── 📄 tsconfig.json         # TypeScript 설정
├── 📄 vitest.config.ts      # Vitest 테스트 설정
├── 📄 manifest.json         # 크롬 확장 매니페스트 V3
├── 📄 README.md             # 이 파일
├── 📄 .gitignore            # Git 무시 파일
├── 📁 src/
│   ├── 🎯 content.ts        # 크롬 확장 메인 로직 (컨텐츠 스크립트)
│   ├── 🔧 background.ts     # 백그라운드 서비스 워커
│   ├── 🌐 index.html        # 웹 데모 페이지 (아름다운 UI)
│   ├── ⚡ index.ts          # 웹 데모 TypeScript
│   ├── ⚡ index.js          # 웹 데모 JavaScript (바로 실행 가능)
│   ├── 🧪 __tests__/
│   │   └── dragUtils.test.ts # Vitest 단위 테스트 (통과 ✅)
│   ├── 🎨 popup/
│   │   ├── popup.html       # 확장 팝업 UI
│   │   ├── popup.css        # 팝업 스타일
│   │   └── popup.ts         # 팝업 로직
│   ├── ⚙️ options/
│   │   ├── options.html     # 설정 페이지
│   │   ├── options.css      # 설정 스타일
│   │   └── options.ts       # 설정 로직
│   └── 🎭 icons/
│       ├── icon.svg         # 메인 아이콘 (EPO 로고 SVG)
│       ├── icon16.png       # 16x16 PNG (자동 생성)
│       ├── icon48.png       # 48x48 PNG (자동 생성)
│       └── icon128.png      # 128x128 PNG (자동 생성)
├── 📁 scripts/
│   └── 🔄 svg-to-png.js     # 아이콘 SVG→PNG 변환 스크립트
├── 📁 dist/                 # 빌드 결과물 (크롬 확장 설치용)
│   ├── *.js, *.d.ts         # 컴파일된 TypeScript
│   ├── popup/, options/     # 복사된 UI 파일들
│   ├── icons/               # 아이콘 파일들
│   ├── index.html           # 웹 데모
│   └── manifest.json        # 확장 매니페스트
└── 📁 node_modules/         # 의존성 (패키지 매니저별로 관리)
```

## 🧪 테스트

### 빠른 테스트 실행

| 패키지 매니저 | 한번 실행          | 감시 모드   | UI 모드           |
| ------------- | ------------------ | ----------- | ----------------- |
| **Yarn**      | `yarn test:run`    | `yarn test` | `yarn test:ui`    |
| **npm**       | `npm run test:run` | `npm test`  | `npm run test:ui` |
| **pnpm**      | `pnpm test:run`    | `pnpm test` | `pnpm test:ui`    |

**현재 테스트 상태**: ✅ 3/3 통과 (getCssPosition 함수 테스트)

## 🔧 기술 스택

- **TypeScript**: 타입 안전성과 개발자 경험
- **ESM**: 최신 모듈 시스템
- **다중 패키지 매니저**: npm, yarn, pnpm 모두 지원
- **Vitest**: Jest보다 빠른 단위 테스트 프레임워크
- **Chrome Extension Manifest V3**: 최신 확장 API
- **Sharp**: 고성능 SVG → PNG 아이콘 변환
- **CSS Grid/Flexbox**: 반응형 UI 레이아웃

## 🎯 개발 워크플로우

선택한 패키지 매니저로 진행하세요:

<details>
<summary><strong>Yarn 워크플로우</strong></summary>

```bash
# 1. 개발 시작
yarn dev                    # TypeScript 감시 모드

# 2. 테스트 작성/실행
yarn test                   # 테스트 감시 모드

# 3. 빌드 및 테스트
yarn build                  # 전체 빌드
yarn test:run              # 테스트 실행

# 4. 크롬 확장 테스트
# dist/ 폴더를 Chrome에 로드

# 5. 웹 데모 테스트
start dist/index.html      # 빌드된 버전
```

</details>

<details>
<summary><strong>npm 워크플로우</strong></summary>

```bash
# 1. 개발 시작
npm run dev                 # TypeScript 감시 모드

# 2. 테스트 작성/실행
npm test                    # 테스트 감시 모드

# 3. 빌드 및 테스트
npm run build               # 전체 빌드
npm run test:run           # 테스트 실행

# 4. 크롬 확장 테스트
# dist/ 폴더를 Chrome에 로드

# 5. 웹 데모 테스트
start dist/index.html      # 빌드된 버전
```

</details>

<details>
<summary><strong>pnpm 워크플로우</strong></summary>

```bash
# 1. 개발 시작
pnpm dev                    # TypeScript 감시 모드

# 2. 테스트 작성/실행
pnpm test                   # 테스트 감시 모드

# 3. 빌드 및 테스트
pnpm build                  # 전체 빌드
pnpm test:run              # 테스트 실행

# 4. 크롬 확장 테스트
# dist/ 폴더를 Chrome에 로드

# 5. 웹 데모 테스트
start dist/index.html      # 빌드된 버전
```

</details>

## 📸 스크린샷

![웹 데모](src/icons/screenshot1.png)
_웹 데모: Alt+드래그로 요소 이동 시 실시간 좌표 표시_

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인

- **코드 스타일**: TypeScript strict 모드 사용
- **테스트**: 새 기능은 반드시 테스트 코드 작성
- **빌드**: 선택한 패키지 매니저로 `build` 명령 성공 확인
- **브라우저 호환성**: Chrome Extension Manifest V3 기준
- **패키지 매니저**: npm, yarn, pnpm 모두 호환 유지

### 패키지 매니저별 특징

| 패키지 매니저 | 장점                      | 추천 상황                     |
| ------------- | ------------------------- | ----------------------------- |
| **Yarn**      | 안정성, 워크스페이스 지원 | 대부분의 프로젝트 (현재 설정) |
| **npm**       | 기본 제공, 광범위한 지원  | Node.js 기본 환경 선호 시     |
| **pnpm**      | 디스크 효율성, 빠른 설치  | 모노레포, 성능 중시 시        |

## 📄 라이센스

**MIT License** | Copyright (c) 2024 soomin

이 프로젝트는 MIT 라이선스 하에 공개되어 있습니다. 자유롭게 사용, 수정, 배포할 수 있습니다.

### ✅ 허용 사항

- ✅ **상업적 사용**: 회사 프로젝트에서 자유롭게 사용
- ✅ **수정**: 코드 변경 및 개선
- ✅ **배포**: 수정 버전 포함하여 자유롭게 공유
- ✅ **개인 사용**: 개인 프로젝트에서 제한 없이 사용

### 📝 라이선스 조건

- 📝 **저작권 표시**: 원본 저작권 및 라이선스 표시 유지
- 📝 **책임 제한**: 작성자는 소프트웨어 사용으로 인한 손해에 대해 책임지지 않음

자세한 내용은 `LICENSE` 파일을 확인하세요.

## 🔗 링크

- [GitHub Repository](https://github.com/SoominYim/elements-position-drag-overlay)
- [Issues](https://github.com/SoominYim/elements-position-drag-overlay/issues)
- [Chrome Web Store](#) (출시 예정)
- [웹 데모 바로가기](./src/index.html)

## 🚀 로드맵

- [ ] Chrome Web Store 출시
- [ ] Firefox 확장 지원
- [ ] 더 많은 CSS 속성 표시 (margin, padding)
- [ ] 테마 커스터마이징
- [ ] 키보드 단축키 커스터마이징
- [ ] Bun 패키지 매니저 지원

---

**💡 개발자를 위한 생산성 도구를 만들어 나가고 있습니다. ⭐ 별표를 눌러주세요!**

**즉시 체험**: `src/index.html`을 열어서 Alt+드래그로 파란색 박스를 움직여보세요! 🎯✨

## 🚀 빌드 방법

### 간단한 빌드 📦

```bash
npm run build
# 또는
yarn build
# 또는
pnpm build
```

### 상세 빌드 가이드 📦

<details>
<summary><strong>🎁 npm 사용하기</strong></summary>

```bash
# 1. 레포지토리 클론
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
npm install

# 3. 아이콘 생성 (SVG → PNG)
npm run svg2png

# 4. 빌드 (TypeScript → JavaScript + 파일 복사)
npm run build

# 5. 테스트 (선택사항)
npm run test:run
```

</details>

<details>
<summary><strong>🧶 Yarn 사용하기</strong></summary>

```bash
# 1. 레포지토리 클론
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
yarn install

# 3. 아이콘 생성 (SVG → PNG)
yarn svg2png

# 4. 빌드 (TypeScript → JavaScript + 파일 복사)
yarn build

# 5. 테스트 (선택사항)
yarn test:run
```

</details>

<details>
<summary><strong>📦 pnpm 사용하기</strong></summary>

```bash
# 1. 레포지토리 클론
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
pnpm install

# 3. 아이콘 생성 (SVG → PNG)
pnpm svg2png

# 4. 빌드 (TypeScript → JavaScript + 파일 복사)
pnpm build

# 5. 테스트 (선택사항)
pnpm test:run
```

</details>
