const T = require("./templates.ko");

function interpretSaju({ elements, tenGods, daeun, ruleset }) {
  const text = T.overallSummary({ elements, tenGods, daeun });
  const tags = [`강:${elements.dominant.element}`, `약:${elements.weak.element}`];
  return {
    locale: ruleset?.interpretation?.locale || "ko",
    tags,
    text,
  };
}

module.exports = { interpretSaju };
