import { card, alertBox, escapeHtml } from "../ui/components.js";

export function DaeunPage(state) {
  const r = state.lastResult;
  if (!r?.daeun) {
    return card("대운", alertBox("warn", "대운 데이터가 없습니다. 홈에서 먼저 사주를 계산하세요.") + `<div class="mt-3"><a class="underline" href="#/">홈으로</a></div>`);
  }

  const d = r.daeun;
  const dir = d.direction === 1 ? "순행" : "역행";
  const start = d.startAge?.breakdown
    ? `${d.startAge.breakdown.years}년 ${d.startAge.breakdown.months}개월(근사)`
    : "N/A";

  const rows = (d.periods || []).map(p => `
    <tr class="border-b">
      <td class="py-2 text-sm">${p.index}</td>
      <td class="py-2 font-semibold">${escapeHtml(p.pillar)}</td>
      <td class="py-2 text-sm">${p.fromAge != null ? `${p.fromAge.toFixed(1)} ~ ${p.toAge.toFixed(1)}` : "—"}</td>
    </tr>
  `).join("");

  return `
    <div class="space-y-4">
      ${card("대운 요약", `
        <div class="text-sm text-slate-700 space-y-2">
          <div>방향: <b>${dir}</b></div>
          <div>대운 시작: <b>${start}</b></div>
          <div class="text-xs text-slate-500">절기 기준 기산(샘플 규칙셋). 서비스 기준에 맞게 ruleset 조정 권장.</div>
        </div>
      `)}

      ${card("대운 리스트", `
        <div class="overflow-auto">
          <table class="w-full text-left">
            <thead class="text-xs text-slate-500">
              <tr class="border-b">
                <th class="py-2">#</th>
                <th class="py-2">대운</th>
                <th class="py-2">나이</th>
              </tr>
            </thead>
            <tbody>${rows || ""}</tbody>
          </table>
        </div>
      `)}
    </div>
  `;
}

export function DaeunMount() {}
