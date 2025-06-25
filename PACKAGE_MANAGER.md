# 패키지 매니저 가이드

이 프로젝트는 npm, yarn, pnpm 모든 패키지 매니저를 지원합니다.

## 선택 가이드

| 순위 | 패키지 매니저 | 언제 사용하면 좋을까               |
| ---- | ------------- | ---------------------------------- |
| 1    | pnpm          | 성능 최우선, 모노레포, 디스크 절약 |
| 2    | yarn          | 안정성 중시, 기존 yarn 프로젝트    |
| 3    | npm           | 기본 환경, 호환성 최우선           |

## 설치 및 실행

### pnpm (권장)

```bash
# 설치 (없다면)
npm install -g pnpm

# 프로젝트 설정
pnpm install
pnpm build
pnpm test:run
```

### yarn

```bash
# 설치 (없다면)
npm install -g yarn

# 프로젝트 설정
yarn install
yarn build
yarn test:run
```

### npm

```bash
# 기본 제공, 별도 설치 불필요

# 프로젝트 설정
npm install
npm run build
npm run test:run
```

## 성능 비교

| 항목          | pnpm               | yarn | npm  |
| ------------- | ------------------ | ---- | ---- |
| 설치 속도     | 가장 빠름          | 보통 | 느림 |
| 디스크 사용량 | 최소 (심볼릭 링크) | 보통 | 최대 |
| 호환성        | 좋음               | 최고 | 최고 |
| 모노레포 지원 | 우수               | 우수 | 기본 |

## 스크립트 명령어 변환표

| 작업        | pnpm           | yarn           | npm             |
| ----------- | -------------- | -------------- | --------------- |
| 의존성 설치 | `pnpm install` | `yarn install` | `npm install`   |
| 빌드        | `pnpm build`   | `yarn build`   | `npm run build` |
| 테스트      | `pnpm test`    | `yarn test`    | `npm test`      |
| 개발 모드   | `pnpm dev`     | `yarn dev`     | `npm run dev`   |
| 정리        | `pnpm clean`   | `yarn clean`   | `npm run clean` |

## 락 파일 관리

프로젝트는 모든 패키지 매니저의 락 파일을 `.gitignore`에서 제외하므로, 팀에서 사용하는 패키지 매니저에 따라 적절한 락 파일만 커밋하세요:

- pnpm: `pnpm-lock.yaml` 커밋
- yarn: `yarn.lock` 커밋
- npm: `package-lock.json` 커밋

## 고급 설정

### pnpm 최적화

```bash
# .npmrc 파일 생성
echo "shamefully-hoist=true" > .npmrc
echo "strict-peer-dependencies=false" >> .npmrc
```

### yarn 최적화

```bash
# yarn 2+ 사용 시
yarn set version stable
```

### npm 최적화

```bash
# npm 캐시 최적화
npm config set fund false
npm config set audit false
```

## 패키지 매니저 전환

기존 프로젝트에서 패키지 매니저를 변경하려면:

```bash
# 기존 의존성 제거
rm -rf node_modules
rm package-lock.json yarn.lock pnpm-lock.yaml

# 새 패키지 매니저로 설치
pnpm install  # 또는 yarn install / npm install
```

## 문제 해결

### pnpm 이슈

- 에러: `ERR_PNPM_PEER_DEP_ISSUES`
- 해결: `.npmrc`에 `strict-peer-dependencies=false` 추가

### yarn 이슈

- 에러: `YN0002: ... doesn't provide ...`
- 해결: `yarn config set packageExtensions ...` 사용

### npm 이슈

- 에러: `ERESOLVE unable to resolve dependency tree`
- 해결: `npm install --legacy-peer-deps` 사용

---

팁: 프로젝트별로 일관된 패키지 매니저 사용을 권장합니다!
