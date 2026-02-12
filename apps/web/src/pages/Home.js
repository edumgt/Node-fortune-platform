import { card, alertBox, escapeHtml } from "../ui/components.js";
import { calcSaju, API_BASE, setApiBase } from "../api.js";

function defaultForm() {
  return {
    year: 1990,
    month: 1,
    day: 1,
    hour: 9,
    minute: 0,
    gender: "M",
    longitude: 127,
    applyTimeCorrection: true,
  };
}

export function HomePage(state) {
  const f = state.form || defaultForm();
  state.form = f;

  const apiCard = card(
    "API 설정",
    `
      <div class="text-sm text-slate-600">백엔드 주소를 변경할 수 있습니다.</div>
      <div class="mt-3 flex flex-col md:flex-row gap-2">
        <input id="apiBase" class="w-full md:flex-1 px-3 py-2 rounded-xl border bg-white"
          value="${escapeHtml(API_BASE)}" />
        <button id="saveApiBase" class="px-4 py-2 rounded-xl bg-slate-900 text-white">저장</button>
      </div>
    `
  );

  const formCard = card(
    "내 사주 계산",
    `
    <form id="sajuForm" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="text-xs text-slate-600">생년</label>
        <input name="year" type="number" class="w-full px-3 py-2 rounded-xl border bg-white" value="${f.year}" required />
      </div>
      <div>
        <label class="text-xs text-slate-600">성별</label>
        <select name="gender" class="w-full px-3 py-2 rounded-xl border bg-white">
          <option value="M" ${f.gender==="M"?"selected":""}>남</option>
          <option value="F" ${f.gender==="F"?"selected":""}>여</option>
        </select>
      </div>

      <div>
        <label class="text-xs text-slate-600">월</label>
        <input name="month" type="number" min="1" max="12" class="w-full px-3 py-2 rounded-xl border bg-white" value="${f.month}" required />
      </div>
      <div>
        <label class="text-xs text-slate-600">일</label>
        <input name="day" type="number" min="1" max="31" class="w-full px-3 py-2 rounded-xl border bg-white" value="${f.day}" required />
      </div>

      <div>
        <label class="text-xs text-slate-600">시</label>
        <input name="hour" type="number" min="0" max="23" class="w-full px-3 py-2 rounded-xl border bg-white" value="${f.hour}" required />
      </div>
      <div>
        <label class="text-xs text-slate-600">분</label>
        <input name="minute" type="number" min="0" max="59" class="w-full px-3 py-2 rounded-xl border bg-white" value="${f.minute}" required />
      </div>

      <div>
        <label class="text-xs text-slate-600">경도(옵션)</label>
        <input name="longitude" type="number" step="0.01" class="w-full px-3 py-2 rounded-xl border bg-white" value="${f.longitude}" />
        <div class="text-[11px] text-slate-500 mt-1">기본 127(서울 근처). 시간보정에 사용</div>
      </div>

      <div class="flex items-center gap-2 mt-5 md:mt-0">
        <input id="applyTimeCorrection" name="applyTimeCorrection" type="checkbox" class="w-4 h-4"
          ${f.applyTimeCorrection ? "checked" : ""} />
        <label for="applyTimeCorrection" class="text-sm">시간보정 적용</label>
      </div>

      <div class="md:col-span-2 flex gap-2 mt-2">
        <button type="submit" class="px-4 py-2 rounded-xl bg-slate-900 text-white">계산하기</button>
        <a href="#/daeun" class="px-4 py-2 rounded-xl border bg-white">대운 페이지로</a>
      </div>
    </form>

    <div id="homeMsg" class="mt-4"></div>
    `
  );

  return `
    <div class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        ${apiCard}
        ${card("사용 가이드", `
          <div class="space-y-2 text-sm text-slate-700">
            <div>1) 생년월일시 입력 → 사주팔자/오행/십신/대운 요약을 확인합니다.</div>
            <div>2) 궁합은 2명 입력 → 점수/관계(합/충/해/파)까지 표시됩니다.</div>
            <div class="mt-3">${alertBox("warn", "주의: 사주/운세는 참고용 데모입니다. 규칙(야자시/대운기산)은 유파별 차이가 큽니다.")}</div>
          </div>
        `)}
      </div>

      ${formCard}
    </div>
  `;
}

export function HomeMount(state) {
  const label = document.getElementById("apiBaseLabel");
  if (label) label.textContent = API_BASE;

  document.getElementById("saveApiBase")?.addEventListener("click", () => {
    const v = document.getElementById("apiBase")?.value?.trim();
    if (v) setApiBase(v);
  });

  const msg = document.getElementById("homeMsg");
  const form = document.getElementById("sajuForm");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msg) msg.innerHTML = alertBox("info", "계산 중...");

    const fd = new FormData(form);
    const input = {
      year: Number(fd.get("year")),
      month: Number(fd.get("month")),
      day: Number(fd.get("day")),
      hour: Number(fd.get("hour")),
      minute: Number(fd.get("minute")),
      gender: String(fd.get("gender")),
      longitude: Number(fd.get("longitude") || 127),
      applyTimeCorrection: !!fd.get("applyTimeCorrection"),
    };
    state.form = input;

    try {
      const data = await calcSaju(input);
      state.lastResult = data.result;
      location.hash = "#/result";
    } catch (err) {
      if (msg) msg.innerHTML = alertBox("error", `오류: ${err.message || err}`);
    }
  });
}
