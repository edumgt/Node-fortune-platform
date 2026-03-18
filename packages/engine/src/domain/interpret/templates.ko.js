const ELEMENT_TRAITS = {
  "목": { strength: "리더십, 창의성, 성장 지향", weakness: "조급함, 고집", career: "교육, 출판, 목공, 환경", health: "간·담" },
  "화": { strength: "열정, 표현력, 사교성", weakness: "충동성, 과장", career: "예술, 방송, 요리, 열에너지", health: "심장·소장" },
  "토": { strength: "신뢰, 중재력, 안정감", weakness: "고집, 느린 변화", career: "부동산, 농업, 건설, 교육", health: "비·위" },
  "금": { strength: "결단력, 정의감, 추진력", weakness: "냉정함, 독선", career: "법률, 금융, 의료, 군경", health: "폐·대장" },
  "수": { strength: "지혜, 직관, 유연성", weakness: "우유부단, 불안", career: "학문, IT, 유통, 철학", health: "신장·방광" },
};

const TEN_GOD_DESC = {
  "비견/겁재": "독립적이고 경쟁적인 성향이 강합니다. 자존감이 높지만 협업도 중요합니다.",
  "식신/상관": "창의력과 표현력이 뛰어납니다. 재능을 발휘할 기회를 적극 찾으세요.",
  "인성": "학습 능력과 직관이 발달해 있습니다. 지식과 경험을 쌓는 것이 중요합니다.",
  "재성": "재물과 현실 감각이 돋보입니다. 경제적 기반을 다지는 데 유리합니다.",
  "관성": "규율과 책임감이 강합니다. 조직 생활이나 사회적 역할을 잘 수행합니다.",
  "기타": "독특한 에너지를 지니고 있습니다.",
};

function elementSummary(elements) {
  const { dominant, weak } = elements;
  const dTraits = ELEMENT_TRAITS[dominant.element] || {};
  const wTraits = ELEMENT_TRAITS[weak.element] || {};
  const lines = [
    `오행은 ${dominant.element}(${ELEMENT_TRAITS[dominant.element]?.strength || ""}) 기운이 강하고, ${weak.element}(${ELEMENT_TRAITS[weak.element]?.strength || ""}) 기운이 상대적으로 약한 편입니다.`,
    dTraits.career ? `${dominant.element}이 강한 경우 ${dTraits.career} 계통에서 역량이 발휘될 수 있습니다.` : "",
    dTraits.health ? `건강 측면에서 ${dominant.element}이 과하면 ${dTraits.health} 관련 부위에 주의가 필요합니다.` : "",
    wTraits.strength ? `${weak.element}의 에너지를 보충하면(예: ${wTraits.career}) 균형을 맞출 수 있습니다.` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function tenGodSummary(tenGods) {
  const { map } = tenGods;
  const lines = [
    `일간 기준으로 연간=${map.year}, 월간=${map.month}, 시간=${map.hour} 흐름이 잡힙니다.`,
    TEN_GOD_DESC[map.month] || "",
    map.year !== map.month ? (TEN_GOD_DESC[map.year] ? `연간(${map.year}): ${TEN_GOD_DESC[map.year]}` : "") : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function daeunSummary(daeun) {
  if (!daeun?.startAge) return `대운 계산은 절기 데이터 범위/규칙 설정을 확인해야 합니다.`;
  const b = daeun.startAge.breakdown;
  const dir = daeun.direction === 1 ? "순행" : "역행";
  const first = daeun.periods?.[0]?.pillar ? `첫 대운 ${daeun.periods[0].pillar}부터 시작합니다.` : "";
  const current = daeun.periods?.find(p => p.fromAge <= 30 && p.toAge > 30);
  const currentDesc = current ? `현재 30대는 ${current.pillar} 대운 영향권(${current.fromAge.toFixed(0)}~${current.toAge.toFixed(0)}세) 안에 있습니다.` : "";
  return [`대운은 ${dir} 기준, 약 ${b.years}년 ${b.months}개월 즈음 시작합니다. ${first}`, currentDesc].filter(Boolean).join("\n");
}

function overallSummary({ elements, tenGods, daeun }) {
  return [
    "=== 오행(五行) 분석 ===",
    elementSummary(elements),
    "",
    "=== 십신(十神) 분석 ===",
    tenGodSummary(tenGods),
    "",
    "=== 대운(大運) 분석 ===",
    daeunSummary(daeun),
  ].join("\n");
}

module.exports = { overallSummary };
