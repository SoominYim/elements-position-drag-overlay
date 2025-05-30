# 🤝 Contributing Guide

Elements Position Overlay 프로젝트에 기여해주셔서 감사합니다!

## 🚀 개발 환경 설정

### 필수 요구사항

- **Node.js** ≥16.0.0
- **Git**
- 선호하는 패키지 매니저 (**pnpm** 권장)

### 로컬 개발 설정

```bash
# 1. 포크 후 클론
git clone https://github.com/your-username/elements-position-drag-overlay.git
cd elements-position-drag-overlay

# 2. 업스트림 추가
git remote add upstream https://github.com/SoominYim/elements-position-drag-overlay.git

# 3. 의존성 설치
pnpm install  # 또는 npm install / yarn install

# 4. 아이콘 생성
pnpm svg2png

# 5. 빌드 테스트
pnpm build

# 6. 테스트 실행
pnpm test:run
```

## 🔄 개발 워크플로우

### 브랜치 전략

- **main**: 안정 버전
- **feature/기능명**: 새 기능 개발
- **fix/버그명**: 버그 수정
- **docs/문서명**: 문서 업데이트

### 개발 단계

```bash
# 1. 새 브랜치 생성
git checkout -b feature/amazing-feature

# 2. 개발 모드 시작 (TypeScript 감시)
pnpm dev

# 3. 코드 작성 및 테스트
pnpm test        # 감시 모드
pnpm test:run    # 한번 실행

# 4. 빌드 확인
pnpm build

# 5. 커밋 및 푸시
git add .
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

## 📝 코딩 스타일

### TypeScript 가이드라인

- **Strict 모드** 필수 (`tsconfig.json`)
- **ESM 모듈** 사용
- **명확한 타입 정의**
- **JSDoc 주석** 권장

### 파일 구조

```typescript
// 좋은 예
import { getCssPosition } from "./utils/dragUtils";

export function handleDrag(element: HTMLElement): void {
  // 명확한 함수명과 타입
}

// 피할 것
function drag(el: any) {
  // any 타입, 불명확한 함수명
}
```

### 테스트 작성

- **모든 새 기능**에 테스트 추가
- **Vitest** 프레임워크 사용
- **단위 테스트** 우선, 통합 테스트 선택

```typescript
// src/__tests__/newFeature.test.ts
import { describe, it, expect } from "vitest";
import { newFeature } from "../newFeature";

describe("newFeature", () => {
  it("should work correctly", () => {
    expect(newFeature()).toBe(expected);
  });
});
```

## 🐛 버그 리포트

### 버그 발견 시

1. [Issues](https://github.com/SoominYim/elements-position-drag-overlay/issues) 검색
2. 기존 이슈가 없다면 **새 이슈 생성**
3. **빌드 문제**라면 [빌드 문제 템플릿](.github/ISSUE_TEMPLATE/build-problem.md) 사용

### 버그 수정 시

```bash
# 1. 버그 재현 테스트 작성
# 2. 수정 코드 작성
# 3. 테스트 통과 확인
pnpm test:run

# 4. 빌드 확인
pnpm build

# 5. PR 생성
```

## 📚 문서 기여

### 문서 종류

- **README.md**: 전체 프로젝트 소개
- **PACKAGE_MANAGER.md**: 패키지 매니저 가이드
- **CHROME_EXTENSION_GUIDE.md**: 크롬 확장 설치
- **TROUBLESHOOTING.md**: 문제 해결

### 문서 스타일

- **명확한 제목** (이모지 사용 권장)
- **단계별 가이드**
- **코드 예시** 포함
- **한국어** 우선, 영어 병행

## 🏗 빌드 시스템

### 스크립트 구조

```json
{
  "build": "npm run build:ts && npm run build:copy",
  "build:ts": "tsc",
  "build:copy": "각 폴더별 복사 스크립트"
}
```

### 빌드 결과물 (`dist/`)

- **Git에 포함되지 않음** (`.gitignore`)
- **사용자가 직접 빌드** 필요
- **크롬 확장 설치용**

## 🔧 패키지 매니저 지원

### 호환성 원칙

- **npm, yarn, pnpm** 모두 지원
- **크로스 플랫폼** 명령어 사용
- **Node.js fs API** 우선

### 테스트 방법

```bash
# 각 패키지 매니저별 테스트
npm run build && npm run test:run
yarn build && yarn test:run
pnpm build && pnpm test:run
```

## 📋 Pull Request 가이드

### PR 체크리스트

- [ ] 모든 테스트 통과 (`pnpm test:run`)
- [ ] 빌드 성공 (`pnpm build`)
- [ ] TypeScript 오류 없음 (`tsc --noEmit`)
- [ ] 새 기능에 테스트 추가
- [ ] 문서 업데이트 (필요시)
- [ ] 커밋 메시지 명확

### PR 템플릿

```markdown
## 📝 변경 사항

- 기능 추가/수정 내용

## 🧪 테스트

- [ ] 단위 테스트 추가/수정
- [ ] 수동 테스트 완료

## 📚 문서

- [ ] README 업데이트
- [ ] JSDoc 주석 추가

## 🔗 관련 이슈

Closes #123
```

## 🎯 기여 우선순위

### 높은 우선순위

1. **버그 수정**
2. **테스트 커버리지 증가**
3. **브라우저 호환성 개선**
4. **성능 최적화**

### 중간 우선순위

1. **새 기능 추가**
2. **문서 개선**
3. **개발자 경험 향상**

### 낮은 우선순위

1. **코드 리팩토링**
2. **스타일 변경**

## 🏷 릴리즈 프로세스

### 버전 관리

- **Semantic Versioning** 사용
- **CHANGELOG.md** 업데이트
- **Git 태그** 생성

### 릴리즈 단계

1. 모든 테스트 통과
2. 문서 업데이트
3. 버전 번호 증가
4. 태그 생성 및 푸시

---

💡 **질문이 있으시면 언제든 [Issues](https://github.com/SoominYim/elements-position-drag-overlay/issues)에 문의해주세요!**

🌟 **기여해주셔서 감사합니다!** ⭐
