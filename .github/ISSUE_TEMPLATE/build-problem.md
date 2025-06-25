---
name: 빌드 문제
about: 빌드나 설치 과정에서 발생한 문제를 신고
title: "[BUILD] "
labels: bug, build
assignees: ""
---

## 빌드 문제 신고

### 체크리스트 (먼저 확인해주세요)

- [ ] Node.js ≥16.0.0 설치 확인 (`node --version`)
- [ ] 패키지 매니저 최신 버전 확인 (`npm --version` / `yarn --version` / `pnpm --version`)
- [ ] `npm install` (또는 yarn/pnpm) 정상 완료
- [ ] `npm run svg2png` 아이콘 생성 시도
- [ ] [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) 확인

### 문제 상황

어떤 명령어에서 오류가 발생했나요?

```bash
# 실행한 명령어를 여기에 작성
npm run build
```

오류 메시지:

```
여기에 전체 오류 메시지를 붙여넣어주세요
```

### 환경 정보

- OS: (예: Windows 10, macOS 13, Ubuntu 20.04)
- Node.js: (예: v18.17.0)
- 패키지 매니저: (예: npm 9.6.7)
- Git 클론 방법: (예: git clone, GitHub Desktop, ZIP 다운로드)

### dist/ 폴더 상태

빌드 후 dist/ 폴더에 있는 파일들:

```
# Windows: dir dist\
# macOS/Linux: ls -la dist/
여기에 결과를 붙여넣어주세요
```

### 재현 단계

1. git clone ...
2. npm install
3. npm run build
4. 오류 발생

### 기대하는 결과

정상적으로 dist/ 폴더가 생성되고 크롬 확장 설치가 가능해야 함

### 스크린샷 (선택사항)

오류 화면이나 결과물 스크린샷을 첨부해주세요.

---

빠른 해결을 위한 팁:

- `npm run clean && npm run build` 시도
- `rm -rf node_modules && npm install` 재설치
- 다른 패키지 매니저 시도 (npm ↔ yarn ↔ pnpm)
