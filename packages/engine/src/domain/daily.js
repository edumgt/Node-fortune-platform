/**
 * 오늘의 운세(일진) 계산
 * - 오늘 날짜의 일주(간지)를 계산
 * - 사용자의 일주 오행과 오늘 일주의 상생·상극 관계 분석
 * - 세운(해당 연도의 연주) 적용
 * - 현재 대운과의 조합 분석
 */
const { calculateSajuSolar } = require("../adapters/manseryeok");
const { STEM_ELEMENT, BRANCH_ELEMENT, STEM_YINYANG } = require("../domain/ganzhi");

const GEN = { "목": "화", "화": "토", "토": "금", "금": "수", "수": "목" };
const KILL = { "목": "토", "토": "수", "수": "화", "화": "금", "금": "목" };

const ELEMENT_EMOJI = { "목": "🌳", "화": "🔥", "토": "🪨", "금": "⚔️", "수": "💧" };

/** Default longitude for Korea (Seoul area) */
const DEFAULT_LONGITUDE_KR = 127;

const LUCK_MESSAGES = {
  overall: {
    great: ["매우 길한 날입니다. 중요한 일을 추진하기 좋습니다.", "오늘은 강한 기운이 함께합니다. 자신감을 가지고 도전하세요.", "긍정적인 에너지가 넘치는 날입니다. 새로운 시작에 좋습니다."],
    good: ["순조로운 하루가 될 것입니다. 계획한 일들이 잘 풀릴 것입니다.", "안정적인 기운이 감돕니다. 꾸준히 진행하면 좋은 결과가 있습니다.", "균형 잡힌 에너지의 하루입니다. 차분하게 임하면 좋습니다."],
    neutral: ["평범한 기운의 날입니다. 무리하지 말고 현상 유지에 집중하세요.", "큰 변화보다는 안정을 추구하는 것이 좋습니다.", "조용히 내실을 다지는 날입니다."],
    caution: ["주의가 필요한 날입니다. 중요한 결정은 신중하게 내리세요.", "충돌하는 기운이 있습니다. 갈등 상황을 피하는 것이 좋습니다.", "무리한 계획보다는 기존 일에 집중하는 것이 좋습니다."],
  },
  areas: {
    love: { great: "연애운이 매우 좋습니다. 감정 표현에 적극적이 되세요.", good: "연애에서 좋은 기운이 있습니다. 소통을 늘리세요.", neutral: "연애운은 보통입니다. 자연스럽게 흘러가도록 두세요.", caution: "감정적 충돌에 주의하세요. 이해와 배려가 중요합니다." },
    work: { great: "업무운이 탁월합니다. 새 프로젝트나 제안을 적극 추진하세요.", good: "업무가 순조롭게 진행됩니다. 협업에서 좋은 성과가 기대됩니다.", neutral: "평범한 업무운입니다. 기본에 충실하세요.", caution: "업무상 충돌이 생길 수 있습니다. 신중하게 처리하세요." },
    money: { great: "재물운이 좋습니다. 투자나 사업에 긍정적입니다.", good: "소소한 재물 이득이 기대됩니다.", neutral: "재물운은 보통입니다. 지출을 아끼세요.", caution: "예상치 못한 지출에 주의하세요. 큰 투자는 자제하세요." },
    health: { great: "건강 기운이 매우 좋습니다. 운동이나 새로운 활동을 시작하기 좋습니다.", good: "건강 상태가 양호합니다. 꾸준한 관리로 유지하세요.", neutral: "평소처럼 건강 관리를 하세요.", caution: "무리하지 말고 충분한 휴식을 취하세요. 컨디션 관리에 신경 쓰세요." },
  },
};

function getRelation(myElement, targetElement) {
  if (myElement === targetElement) return "비화"; // same
  if (GEN[myElement] === targetElement) return "생출"; // I generate target
  if (GEN[targetElement] === myElement) return "생입"; // target generates me
  if (KILL[myElement] === targetElement) return "극출"; // I control target
  if (KILL[targetElement] === myElement) return "극입"; // target controls me
  return "기타";
}

function relationScore(relation) {
  const map = { "비화": 5, "생입": 10, "생출": 3, "극입": -8, "극출": 2, "기타": 0 };
  return map[relation] ?? 0;
}

function getLuckLevel(score) {
  if (score >= 15) return "great";
  if (score >= 5) return "good";
  if (score >= -3) return "neutral";
  return "caution";
}

function pickMessage(arr) {
  const d = new Date();
  return arr[d.getDate() % arr.length];
}

async function calcDailyFortune({ userSaju, birthInput }) {
  const today = new Date();
  const todaySaju = await calculateSajuSolar({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: 12,
    minute: 0,
    longitude: DEFAULT_LONGITUDE_KR,
    applyTimeCorrection: false,
  });

  const yearSaju = await calculateSajuSolar({
    year: today.getFullYear(),
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    longitude: DEFAULT_LONGITUDE_KR,
    applyTimeCorrection: false,
  });

  // 일주(오늘 일진)
  const todayDayStem = todaySaju.pillars.day.stem;
  const todayDayBranch = todaySaju.pillars.day.branch;
  const todayDayElement = STEM_ELEMENT[todayDayStem];
  const todayDayBranchElement = BRANCH_ELEMENT[todayDayBranch];

  // 세운(올해 연주)
  const yearStem = yearSaju.pillars.year.stem;
  const yearElement = STEM_ELEMENT[yearStem];
  const yearBranch = yearSaju.pillars.year.branch;

  // 사용자 일간 오행 (사용자 사주가 없으면 오늘 일주의 오행 기준으로 중립 계산)
  const myDayStem = userSaju ? userSaju.pillars.day.stem : null;
  const myDayElement = myDayStem ? STEM_ELEMENT[myDayStem] : todayDayElement;

  // 오늘 일진과 내 일간의 관계
  const stemRelation = getRelation(myDayElement, todayDayElement);
  const branchRelation = getRelation(myDayElement, todayDayBranchElement);
  const yearRelation = getRelation(myDayElement, yearElement);

  const baseScore = userSaju
    ? relationScore(stemRelation) + relationScore(branchRelation) * 0.5 + relationScore(yearRelation) * 0.3
    : 0; // neutral when no user saju
  const score = Math.round(Math.max(0, Math.min(100, 50 + baseScore * 3)));

  const luckLevel = getLuckLevel(baseScore);

  // Use date-based seed to ensure consistent per-day variation across fortune areas
  // while keeping the same day's results stable across multiple calls
  const seed = today.getDate() + today.getMonth();
  const loveLuck = getLuckLevel(baseScore + ((seed % 3) - 1) * 3);
  const workLuck = getLuckLevel(baseScore + (((seed + 1) % 3) - 1) * 3);
  const moneyLuck = getLuckLevel(baseScore + (((seed + 2) % 3) - 1) * 3);
  const healthLuck = getLuckLevel(baseScore + (((seed + 3) % 3) - 1) * 3);

  const todayPillar = `${todaySaju.pillars.day.text}`;
  const yearPillar = `${yearSaju.pillars.year.text}`;

  return {
    date: today.toLocaleDateString("ko-KR"),
    todayGanzhi: {
      pillar: todayPillar,
      stem: todayDayStem,
      branch: todayDayBranch,
      element: todayDayElement,
      yinyang: STEM_YINYANG[todayDayStem],
      emoji: ELEMENT_EMOJI[todayDayElement],
    },
    yearGanzhi: {
      pillar: yearPillar,
      stem: yearStem,
      branch: yearBranch,
      element: yearElement,
      emoji: ELEMENT_EMOJI[yearElement],
    },
    myDayStem: myDayStem ? { stem: myDayStem, element: myDayElement, emoji: ELEMENT_EMOJI[myDayElement] } : null,
    relations: { stem: stemRelation, branch: branchRelation, year: yearRelation },
    score,
    luckLevel,
    overall: pickMessage(LUCK_MESSAGES.overall[luckLevel]),
    areas: {
      love: { level: loveLuck, message: LUCK_MESSAGES.areas.love[loveLuck] },
      work: { level: workLuck, message: LUCK_MESSAGES.areas.work[workLuck] },
      money: { level: moneyLuck, message: LUCK_MESSAGES.areas.money[moneyLuck] },
      health: { level: healthLuck, message: LUCK_MESSAGES.areas.health[healthLuck] },
    },
  };
}

module.exports = { calcDailyFortune };
