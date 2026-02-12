module.exports = {
  name: "standard.kr",
  timezone: "Asia/Seoul",
  daeun: {
    // 남자: 양년 순행 / 음년 역행
    // 여자: 양년 역행 / 음년 순행
    directionRule: "yearStemYinYangByGender",
    dayToYearDivisor: 3,
    periods: 10,
    periodYears: 10,
  },
  interpretation: {
    locale: "ko",
    style: "concise",
  },
};
