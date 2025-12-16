// components/chat/campaign/campaignStorage.js

const KEY_BY_CAMPAIGN = "campaignOutputsById"; // { [campaignId]: Output[] }

export function safeJsonParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function getOutputsMap() {
  if (typeof window === "undefined") return {};
  return safeJsonParse(localStorage.getItem(KEY_BY_CAMPAIGN), {});
}

export function setOutputsMap(map) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_BY_CAMPAIGN, JSON.stringify(map || {}));
}

export function getCampaignOutputs(campaignId) {
  const map = getOutputsMap();
  return Array.isArray(map?.[campaignId]) ? map[campaignId] : [];
}

export function addCampaignOutput(campaignId, output) {
  const map = getOutputsMap();
  const list = Array.isArray(map?.[campaignId]) ? map[campaignId] : [];
  const next = [output, ...list];
  map[campaignId] = next;
  setOutputsMap(map);
  return output;
}

export function updateCampaignOutput(campaignId, outputId, patch) {
  const map = getOutputsMap();
  const list = Array.isArray(map?.[campaignId]) ? map[campaignId] : [];
  map[campaignId] = list.map((o) => (o.outputId === outputId ? { ...o, ...patch } : o));
  setOutputsMap(map);
}

export function deleteCampaignOutput(campaignId, outputId) {
  const map = getOutputsMap();
  const list = Array.isArray(map?.[campaignId]) ? map[campaignId] : [];
  map[campaignId] = list.filter((o) => o.outputId !== outputId);
  setOutputsMap(map);
}

export function uid(prefix = "out") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
