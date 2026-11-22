import { BUSINESS_ROWS } from "./business.mjs";
import { CREATIVE_ROWS } from "./creative.mjs";
import { HEALTH_ROWS } from "./health.mjs";
import { HOSPITALITY_ROWS } from "./hospitality.mjs";
import { PUBLIC_SERVICE_ROWS } from "./public-service.mjs";
import { SCIENCE_ROWS } from "./science.mjs";
import { TECH_ROWS } from "./tech.mjs";
import { TRADES_ROWS } from "./trades.mjs";

export const EXTENDED_ROWS = [
  ...HEALTH_ROWS,
  ...TRADES_ROWS,
  ...BUSINESS_ROWS,
  ...CREATIVE_ROWS,
  ...TECH_ROWS,
  ...SCIENCE_ROWS,
  ...PUBLIC_SERVICE_ROWS,
  ...HOSPITALITY_ROWS,
];
