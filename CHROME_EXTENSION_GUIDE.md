# 크롬 확장 설치 가이드

Elements Position Overlay를 크롬 확장으로 설치하여 모든 웹사이트에서 사용해보세요!

> 중요: GitHub에서 클론한 경우 반드시 빌드를 먼저 진행해주세요!

## 빠른 설치 (5분 완료)

### GitHub에서 클론한 경우 (필수)

```bash
# 1. 레포지토리 클론 (이미 완료된 경우 생략)
git clone https://github.com/SoominYim/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 의존성 설치
npm install  # 또는 yarn install / pnpm install

# 3. 아이콘 생성
npm run svg2png  # 또는 yarn svg2png / pnpm svg2png

# 4. 빌드 (dist/ 폴더 생성)
npm run build  # 또는 yarn build / pnpm build
```

### 빌드 확인

```bash
# dist/ 폴더가 생성되었는지 확인
ls dist/  # Windows: dir dist\
```

빌드 성공 시 다음 파일들이 표시되어야 합니다:

```
manifest.json, content.js, background.js, popup/, options/, icons/
```

### Chrome 확장 프로그램 페이지 열기

- Chrome 브라우저 실행
- 주소창에 입력: `chrome://extensions/`
- 또는 더보기(⋮) → 도구 더보기 → 확장 프로그램

### 개발자 모드 활성화

- 우측 상단 "개발자 모드" 토글 ON

### 확장 프로그램 로드

- "압축해제된 확장 프로그램을 로드합니다" 클릭
- `dist` 폴더 선택 (프로젝트 루트/dist)
- "폴더 선택" 클릭

### 설치 완료!

- 확장 프로그램 목록에 Elements Position Overlay 표시
- 브라우저 우측 상단에 EPO 아이콘 표시

## 사용법

### 기본 사용법

1. 아무 웹사이트나 접속
2. Alt + 드래그로 요소 이동
3. 실시간 CSS 좌표 오버레이 확인!

### 고급 기능

- Alt + D: 확장 ON/OFF 토글
- 확장 아이콘 클릭: 설정 팝업 열기
- 설정 페이지: 오버레이 위치, 테마 변경

## 설치 체크리스트

필수 파일들이 dist/ 폴더에 있는지 확인:

```
dist/
├── 📄 manifest.json         # 확장 매니페스트 (필수)
├── 🎯 content.js            # 메인 기능
├── 🔧 background.js         # 백그라운드 서비스
├── 🎨 popup/               # 팝업 UI
├── ⚙️ options/             # 설정 페이지
└── 🎭 icons/               # 아이콘들
```

Chrome 버전: 88 이상 (Manifest V3 지원)
개발자 모드: 활성화 상태
오류 없음: 빨간색 오류 메시지 없음

## 문제 해결

### "매니페스트 파일이 없습니다"

원인: 잘못된 폴더 선택
해결: `dist` 폴더 (manifest.json이 있는 폴더) 선택

### "이 확장 프로그램을 로드할 수 없습니다"

원인: 빌드 누락 또는 파일 손상
해결:

```bash
npm run clean
npm run build
```

### "Manifest version 2 is deprecated"

원인: 없음 (이미 V3 사용 중)
해결: 무시해도 됨

### 확장이 작동하지 않음

해결:

1. 페이지 새로고침 (F5)
2. 확장 프로그램에서 새로고침 클릭
3. Alt+D로 확장 활성화 확인

## 사용 예시

### 반응형 디자인 테스트

1. 개발자 도구 열기 (F12)
2. 모바일 모드 전환
3. Alt+드래그로 요소 위치 확인

### UI 레이아웃 디버깅

1. 문제가 있는 웹페이지 접속
2. Alt+드래그로 요소 이동
3. CSS position 값 실시간 확인

### 빠른 프로토타이핑

1. 웹페이지의 요소들을 Alt+드래그
2. 이상적인 위치 찾기
3. 표시된 CSS 값을 코드에 적용

## 업데이트 방법

### 자동 업데이트 (권장)

1. 새 버전 빌드: `npm run build`
2. Chrome 확장 페이지에서 새로고침 클릭

### 수동 재설치

1. 기존 확장 제거
2. 새 버전 빌드 후 다시 설치

## 기능 비교

| 기능          | 웹 데모 | 크롬 확장 |
| ------------- | ------- | --------- |
| Alt+드래그    | ✅      | ✅        |
| 실시간 좌표   | ✅      | ✅        |
| 모든 웹사이트 | ❌      | ✅        |
| 설정 저장     | ❌      | ✅        |
| 키보드 단축키 | ❌      | ✅        |
| 팝업 UI       | ❌      | ✅        |

## 개발자를 위한 팁

### 디버깅

```bash
# 소스맵 포함 빌드 (기본)
npm run build

# 개발 모드 (파일 감시)
npm run dev
```

### 로그 확인

1. Chrome 확장 페이지 → 세부정보
2. 확장 프로그램 오류 확인
3. 배경 페이지 검사 클릭

---

축하합니다! 이제 모든 웹사이트에서 Elements Position Overlay를 사용할 수 있습니다!

팁: 북마크바에 고정하여 빠른 접근하세요: 확장 아이콘 → 고정
