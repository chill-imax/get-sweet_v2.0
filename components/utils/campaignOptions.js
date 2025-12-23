// --- 1. CAMPAIGN OBJECTIVES  ---
export const CAMPAIGN_OBJECTIVES = [
  {
    value: "Awareness",
    label: "Awareness & Reach",
    emoji: "📣",
    description: "Maximize visibility and reach a broad audience.",
  },
  {
    value: "Lead generation",
    label: "Lead Generation",
    emoji: "🧲",
    description: "Collect leads and sign-ups.",
  },
  {
    value: "Conversions",
    label: "Conversions / Sales",
    emoji: "💰",
    description: "Drive valuable actions or purchases.",
  },
  {
    value: "Website traffic",
    label: "Website Traffic",
    emoji: "🌐",
    description: "Get the right people to visit your website.",
  },
  {
    value: "Retention",
    label: "Customer Retention",
    emoji: "🔄",
    description: "Engage existing customers to keep them coming back.",
  },
];

// --- 2. TIMEFRAMES (Duración estratégica) ---
export const TIMEFRAMES = [
  {
    value: "1_MONTH",
    label: "1 Month (Testing)",
    emoji: "⏱️",
    description: "Short-term validation and quick wins.",
  },
  {
    value: "3_MONTHS",
    label: "3 Months (Quarterly)",
    emoji: "📅",
    description: "Standard timeframe for campaign optimization.",
  },
  {
    value: "6_MONTHS",
    label: "6 Months (Growth)",
    emoji: "📈",
    description: "Mid-term strategy for market penetration.",
  },
  {
    value: "12_MONTHS",
    label: "1 Year (Long-term)",
    emoji: "🚀",
    description: "Full brand establishment and market dominance.",
  },
];

// --- 3. PRIMARY GOALS (Metas de Negocio de Alto Nivel) ---
// Esto es más sobre "Qué quiere lograr la empresa" (Business Goal)
export const PRIMARY_GOALS = [
  {
    value: "INCREASE_REVENUE",
    label: "Increase Revenue",
    emoji: "💸",
    description: "Focus on maximizing gross income.",
  },
  {
    value: "IMPROVE_ROAS",
    label: "Improve ROAS",
    emoji: "⚖️",
    description: "Optimize for better Return on Ad Spend.",
  },
  {
    value: "ACQUIRE_NEW_CUSTOMERS",
    label: "Acquire New Customers",
    emoji: "busts_in_silhouette", // Emoji code or actual emoji 👥
    description: "Focus on expanding the client base.",
  },
  {
    value: "BRAND_POSITIONING",
    label: "Brand Positioning",
    emoji: "💎",
    description: "Establish authority in a specific niche.",
  },
  {
    value: "LEAD_GENERATION_VOLUME",
    label: "Maximize Lead Volume",
    emoji: "📥",
    description: "Get as many contacts as possible.",
  },
  {
    value: "LEAD_QUALITY",
    label: "Improve Lead Quality",
    emoji: "✨",
    description: "Focus on high-intent prospects.",
  },
];

// --- HELPER PARA OBTENER LABEL ---
export const getLabelByValue = (list, value) => {
  const item = list.find((i) => i.value === value);
  return item ? item.label : value;
};
