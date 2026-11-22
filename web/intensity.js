import {
  BAND_INHABIT,
  BAND_LEAN,
  BAND_TINT,
  INTENSITY_LEAN_MAX,
  INTENSITY_TINT_MAX,
} from "./constants.js";

export function intensityBand(value) {
  if (value >= INTENSITY_LEAN_MAX) {
    return BAND_INHABIT;
  }
  if (value >= INTENSITY_TINT_MAX) {
    return BAND_LEAN;
  }
  return BAND_TINT;
}
