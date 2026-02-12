# Fortune Platform (Demo)
Node(CommonJS) + Open-source manseryeok 기반으로 **사주/대운/궁합/풀이**까지 동작하는 데모 프로젝트입니다.

![](1.png)
![](2.png)

## 구성
- `packages/engine` : 만세력(사주) 계산 어댑터 + 오행/십신/대운/궁합/풀이 엔진
- `apps/api` : Express API 서버
- `apps/web` : Vite + Tailwind + Offcanvas(반응형) 웹 데모

## 요구사항
- Node.js 18+ (권장 20+)
- pnpm 권장 (npm도 가능하지만 monorepo 의존성이 편합니다)

## 실행 방법 (pnpm)
```bash
cd fortune-platform
pnpm i

# 터미널 1: API
pnpm -C apps/api dev

# 터미널 2: WEB
pnpm -C apps/web dev
```

- WEB: http://localhost:5173
- API: http://localhost:3000

## API 엔드포인트
- `POST /api/saju/calc` : 사주/오행/십신/대운/풀이
- `POST /api/gunghap` : 두 사람 입력 → 각자 사주 계산 + 궁합 점수/관계(합/충/해/파)

### 예시 payload (사주)
```json
{
  "year": 1990,
  "month": 1,
  "day": 1,
  "hour": 9,
  "minute": 0,
  "gender": "M",
  "longitude": 127,
  "applyTimeCorrection": true
}
```

### 예시 payload (궁합)
```json
{
  "a": { "year":1990,"month":1,"day":1,"hour":9,"minute":0,"gender":"M" },
  "b": { "year":1991,"month":2,"day":3,"hour":10,"minute":0,"gender":"F" }
}
```

## 주의/면책
- 사주/운세는 참고용 데모입니다.
- 대운 기산/야자시/시간보정 등은 유파별 차이가 크므로 `packages/engine/src/rulesets/standard.kr.js`에서 서비스 기준을 고정하세요.
