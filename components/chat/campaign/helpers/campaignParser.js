// utils/chatParsers.js

function normalize(str) {
  return (str || "").trim();
}

export function parseChatCommand(text) {
  const t = (text || "").toLowerCase();

  // "set objective to leads"
  const objMatch =
    t.match(/objective\s*(to|=)\s*([a-z\s-]+)/i) ||
    t.match(/set\s+objective\s+to\s+([a-z\s-]+)/i);
  const objective = objMatch ? normalize(objMatch[objMatch.length - 1]) : null;

  // "set geo to san mateo county"
  const geoMatch =
    t.match(/geo\s*(to|=)\s*([a-z0-9\s,-]+)/i) ||
    t.match(/set\s+geo\s+to\s+([a-z0-9\s,-]+)/i);
  const geo = geoMatch ? normalize(geoMatch[geoMatch.length - 1]) : null;

  // "budget to $50/day"
  const budgetMatch =
    t.match(/budget\s*(to|=)\s*([a-z0-9$\/\s.-]+)/i) ||
    t.match(/set\s+budget\s+to\s+([a-z0-9$\/\s.-]+)/i);
  const budget = budgetMatch
    ? normalize(budgetMatch[budgetMatch.length - 1])
    : null;

  // "landing page url https://..."
  const urlMatch =
    t.match(/landing\s*(page)?\s*(url)?\s*(to|=)?\s*(https?:\/\/\S+)/i) ||
    t.match(/set\s+landing\s*(page)?\s*(url)?\s+to\s+(https?:\/\/\S+)/i);
  const landingUrl = urlMatch ? normalize(urlMatch[urlMatch.length - 1]) : null;

  // "set language to English"
  const langMatch =
    t.match(/language\s*(to|=)\s*([a-z\s-]+)/i) ||
    t.match(/set\s+language\s+to\s+([a-z\s-]+)/i);
  const language = langMatch
    ? normalize(langMatch[langMatch.length - 1])
    : null;

  // "rename campaign to X"
  const nameMatch =
    t.match(/rename\s+campaign\s+to\s+(.+)/i) ||
    t.match(/campaign\s+name\s*(to|=)\s*(.+)/i);
  const name = nameMatch ? normalize(nameMatch[nameMatch.length - 1]) : null;

  // "add ad group emergency plumbing"
  const addAgMatch =
    t.match(/add\s+ad\s*group\s+(.+)/i) || t.match(/new\s+ad\s*group\s+(.+)/i);
  const addAdGroupName = addAgMatch
    ? normalize(addAgMatch[addAgMatch.length - 1])
    : null;

  return {
    objective,
    geo,
    budget,
    landingUrl,
    language,
    name,
    addAdGroupName,
  };
}
