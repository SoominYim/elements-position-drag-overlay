# Elements Position Drag Overlay

**웹 요소의 CSS position 값을 실시간으로 확인하는 크롬 확장**

Ctrl+드래그로 웹 요소를 이동하면서 CSS position 값(left, top, right, bottom)을 실시간으로 확인할 수 있는 크롬 확장 프로그램입니다. 개발자, 디자이너, QA 작업에 유용합니다.

## 주요 기능

- **실시간 좌표 표시**: 드래그하는 동안 left, top, right, bottom 값을 실시간으로 확인
- **position: absolute 요소만 드래그 가능**: 레이아웃이 깨지지 않도록 제한
- **스크롤 보정**: 페이지 스크롤 중에도 정확한 위치 계산
- **크롬 확장 + 웹 데모**: 모든 웹사이트에서 사용 가능하며 독립 실행형 데모도 제공
- **TypeScript 기반**: 안정적인 코드와 개발 경험

## 시작하기

> **참고**: 소스 코드를 사용하려면 빌드 과정이 필요합니다.

### 설치 및 빌드

GitHub에서 클론 후 빌드:

<details>
<summary><strong>Yarn (권장)</strong></summary>

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
<summary><strong>npm</strong></summary>

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
<summary><strong>pnpm</strong></summary>

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

### 웹 데모 실행

CORS 정책으로 인해 로컬 서버가 필요합니다.

<details>
<summary><strong>방법 1: 내장 Node.js 서버 (권장)</strong></summary>

```bash
# 빌드 + 서버 실행 (자동)
npm start           # 또는 yarn start / pnpm start

# 또는 수동으로
npm run build       # 빌드
npm run serve       # http://localhost:3000 서버 실행
```

접속: http://localhost:3000

</details>

<details>
<summary><strong>방법 2: Python 서버</strong></summary>

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

접속: http://localhost:8000

</details>

<details>
<summary><strong>방법 3: 기타 서버들</strong></summary>

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

> **왜 file:// 로 안 되나요?** 브라우저의 CORS 보안 정책으로 인해 `file://` 프로토콜에서는 JavaScript 모듈 로드가 차단됩니다.

Ctrl + 드래그로 파란색 박스를 움직여보세요.

### 크롬 확장으로 설치 (메인 기능)

1. 빌드 실행하여 dist/ 폴더 생성:
   ```bash
   npm run build    # 또는 yarn build / pnpm build
   ```
2. Chrome 브라우저 → 확장 프로그램 관리 (`chrome://extensions/`)
3. 우측 상단 **개발자 모드** ON
4. **"압축해제된 확장 프로그램 로드"** 클릭
5. **dist/** 폴더 선택
6. 설치 완료!

이제 모든 웹사이트에서 Ctrl+드래그를 사용할 수 있습니다.

## 사용법

### 크롬 확장에서:

- **모든 웹사이트**에서 `Ctrl + 드래그` 사용 가능
- **position: absolute** 요소만 드래그 가능 (relative, static 요소는 에러 메시지 표시)
- 드래그 중 실시간으로 left, top, right, bottom 값 표시
- 확장 아이콘 클릭으로 설정 관리

### 웹 데모에서:

- `Ctrl + 드래그`로 테스트 요소 이동
- 실시간 CSS 좌표값 오버레이 표시
- 다양한 position 속성 요소로 테스트 가능

## 테스트

### 테스트 실행

| 패키지 매니저 | 한번 실행          | 감시 모드   | UI 모드           |
| ------------- | ------------------ | ----------- | ----------------- |
| **Yarn**      | `yarn test:run`    | `yarn test` | `yarn test:ui`    |
| **npm**       | `npm run test:run` | `npm test`  | `npm run test:ui` |
| **pnpm**      | `pnpm test:run`    | `pnpm test` | `pnpm test:ui`    |

현재 테스트: 3/3 통과

## 기술 스택

- **TypeScript**: 타입 안전성
- **ESM**: ES 모듈 시스템
- **다중 패키지 매니저**: npm, yarn, pnpm 지원
- **Vitest**: 단위 테스트
- **Chrome Extension Manifest V3**: 확장 API
- **Sharp**: SVG → PNG 변환
- **CSS Grid/Flexbox**: 반응형 레이아웃

## 개발 워크플로우

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

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 개발 가이드라인

- **코드 스타일**: TypeScript strict 모드
- **테스트**: 새 기능에는 테스트 코드 작성
- **빌드**: `build` 명령 성공 확인
- **브라우저 호환성**: Chrome Extension Manifest V3
- **패키지 매니저**: npm, yarn, pnpm 호환

### 패키지 매니저별 특징

| 패키지 매니저 | 장점                      | 언제 쓰면 좋을까              |
| ------------- | ------------------------- | ----------------------------- |
| **Yarn**      | 안정성, 워크스페이스 지원 | 일반적인 프로젝트 (현재 설정) |
| **npm**       | 기본 제공, 광범위한 지원  | Node.js 기본 환경             |
| **pnpm**      | 디스크 효율성, 빠른 설치  | 모노레포, 성능 중시           |

## 라이센스

MIT License | Copyright (c) 2024 soomin

MIT 라이선스로 공개되어 있어서 자유롭게 사용, 수정, 배포할 수 있습니다.

### 허용 사항

- 상업적 사용
- 코드 수정 및 개선
- 배포 (수정 버전 포함)
- 개인 프로젝트 사용

### 조건

- 원본 저작권 표시 유지
- 작성자는 소프트웨어 사용으로 인한 손해에 대해 책임지지 않음

자세한 내용은 `LICENSE` 파일을 확인하세요.

## 링크

- [GitHub Repository](https://github.com/SoominYim/elements-position-drag-overlay)
- [Issues](https://github.com/SoominYim/elements-position-drag-overlay/issues)
- [Chrome Web Store](https://chromewebstore.google.com/detail/elements-position-drag-ov/hhcokjpdklpgebgklpelpkekgiojnjca)
- [웹 데모 바로가기](https://elements-position-drag-overlay.vercel.app/)

## 로드맵

- [x] Chrome Web Store 출시
- [ ] Firefox 확장 지원
- [ ] margin, padding 표시
- [ ] 테마 설정
- [ ] 키보드 단축키 설정
- [ ] Bun 패키지 매니저 지원

---

도움이 되셨다면 ⭐ 별표 부탁드립니다!

## 빌드 방법

### 간단한 빌드

```bash
npm run build
# 또는
yarn build
# 또는
pnpm build
```

### 상세 빌드 가이드

<details>
<summary><strong>npm 사용</strong></summary>

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
<summary><strong>Yarn 사용</strong></summary>

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
<summary><strong>pnpm 사용</strong></summary>

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
