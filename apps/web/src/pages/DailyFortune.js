import { card, alertBox } from "../ui/components.js";

export function DailyFortunePage() {
  return card("오늘 운세(샘플)", `
    ${alertBox("info", "데모 페이지입니다. 실제 구현은 '오늘의 일진/세운/대운' 조합 규칙을 engine에 추가하면 됩니다.")}
    <div class="mt-4 text-sm text-slate-700">
      추천 구현:
      <ul class="list-disc ml-5 mt-2 space-y-1">
        <li>오늘 날짜의 일진(간지) 계산</li>
        <li>내 사주의 일간/오행과 오늘 일진의 상생·상극 점수화</li>
        <li>대운/세운 가중치 합산 후 템플릿 문장 생성</li>
      </ul>
    </div>
  `);
}
export function DailyFortuneMount() {}
