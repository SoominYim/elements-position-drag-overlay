# 🔧 문제 해결 가이드

## 🚨 CORS 오류

### 문제

```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

### 원인

브라우저의 보안 정책으로 `file://` 프로토콜에서는 외부 리소스 로드가 차단됩니다.

### 해결책

#### ✅ 방법 1: 내장 서버 사용 (권장)

```bash
npm start              # http://localhost:3000
yarn start             # http://localhost:3000
pnpm start             # http://localhost:3000
```

#### ✅ 방법 2: Python 서버

```bash
# Python 3
cd dist && python -m http.server 8000

# Python 2
cd dist && python -m SimpleHTTPServer 8000
```

#### ✅ 방법 3: VS Code Live Server

1. VS Code에서 `dist/index.html` 열기
2. 우클릭 → "Open with Live Server"

#### ✅ 방법 4: Chrome 플래그 (임시 해결)

```bash
# Windows
chrome.exe --disable-web-security --user-data-dir="C:\temp\chrome"

# macOS
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

## 📦 패키지 매니저 오류

### npm 오류

```
ERESOLVE unable to resolve dependency tree
```

**해결**: `npm install --legacy-peer-deps`

### yarn 오류

```
YN0002: ... doesn't provide ...
```

**해결**: `yarn config set packageExtensions ...`

### pnpm 오류

```
ERR_PNPM_PEER_DEP_ISSUES
```

**해결**: `.npmrc`에 `strict-peer-dependencies=false` 추가

## 🏗 빌드 오류

### TypeScript 오류

```
error TS2307: Cannot find module
```

**해결**:

1. `npm install` 재실행
2. `tsc --noEmit` 타입 체크
3. `tsconfig.json` 경로 확인

### 파일 복사 오류

```
ENOENT: no such file or directory
```

**해결**:

1. `npm run clean` 후 재빌드
2. 소스 파일 경로 확인
3. 권한 문제 시 관리자 권한으로 실행

## 🧪 테스트 오류

### Vitest 오류

```
Cannot import module
```

**해결**:

1. `vitest.config.ts` 확인
2. `jsdom` 설치 확인: `npm install jsdom`

## 🎨 아이콘 생성 오류

### Sharp 오류

```
Something went wrong installing the "sharp" module
```

**해결**:

```bash
npm install --platform=win32 --arch=x64 sharp
# 또는
yarn add sharp --force
```

## 🌐 확장 설치 오류

### Chrome 확장 오류

```
Manifest version 2 is deprecated
```

**해결**: 이미 Manifest V3 사용 중이므로 정상

### 권한 오류

```
Cannot load extension
```

**해결**:

1. 개발자 모드 활성화
2. `dist/` 폴더 전체 선택
3. `manifest.json` 파일 확인

## 🔄 포트 충돌

### 서버 실행 오류

```
Error: listen EADDRINUSE :::3000
```

**해결**:

```bash
# 포트 3000 사용 중인 프로세스 종료
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 다른 포트 사용
npm run serve:python3  # 포트 8000 사용
```

## 💡 성능 최적화

### 빌드 속도 개선

```bash
# pnpm 사용 (가장 빠름)
pnpm install
pnpm build

# yarn PnP 모드
yarn set version berry
yarn install

# npm 캐시 정리
npm cache clean --force
```

### 메모리 사용량 줄이기

```bash
# Node.js 메모리 제한 늘리기
node --max-old-space-size=4096 node_modules/.bin/tsc
```

---

💡 **추가 도움이 필요하시면 [Issues](https://github.com/SoominYim/elements-position-drag-overlay/issues)에 문의해주세요!**
