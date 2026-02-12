const { STEM_ELEMENT, BRANCH_ELEMENT } = require("./ganzhi");

function deriveElements(saju) {
  const counts = { "목":0,"화":0,"토":0,"금":0,"수":0 };

  const p = saju.pillars;
  const stems = [p.year.stem, p.month.stem, p.day.stem, p.hour.stem];
  const branches = [p.year.branch, p.month.branch, p.day.branch, p.hour.branch];

  stems.forEach(s => { counts[STEM_ELEMENT[s]] += 1; });
  branches.forEach(b => { counts[BRANCH_ELEMENT[b]] += 1; });

  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  const ratios = Object.fromEntries(Object.entries(counts).map(([k,v]) => [k, total ? (v/total) : 0]));

  const max = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const min = Object.entries(counts).sort((a,b)=>a[1]-b[1])[0];

  return {
    counts,
    ratios,
    dominant: { element: max[0], score: max[1] },
    weak: { element: min[0], score: min[1] },
  };
}

module.exports = { deriveElements };
