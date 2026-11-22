import { INTENSITY_MAX, INTENSITY_MIN } from "./constants.mjs";

function asTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
}

export function normalizeAvatarInput(input, { requireTriggers } = { requireTriggers: false }) {
  const errors = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { errors: ["Body must be a JSON object"], avatar: null };
  }

  const name = asTrimmedString(input.name);
  if (name.length === 0) {
    errors.push("name is required");
  }

  const intensityRaw = input.intensity;
  const intensity = intensityRaw === undefined || intensityRaw === null
    ? null
    : Number(intensityRaw);

  if (intensity === null || Number.isNaN(intensity) || intensity < INTENSITY_MIN || intensity > INTENSITY_MAX) {
    errors.push("intensity must be a number between 0 and 1");
  }

  const triggers = asStringArray(input.triggers);
  if (requireTriggers && triggers.length === 0) {
    errors.push("triggers must include at least one phrase");
  }

  if (errors.length > 0) {
    return { errors, avatar: null };
  }

  return {
    errors,
    avatar: {
      name,
      tagline: asTrimmedString(input.tagline),
      lens: asTrimmedString(input.lens),
      voice: asTrimmedString(input.voice),
      cares: asStringArray(input.cares),
      ignores: asStringArray(input.ignores),
      triggers,
      needs: asStringArray(input.needs),
      format: asTrimmedString(input.format),
      intensity,
      parentId: asTrimmedString(input.parentId) || asTrimmedString(input.parent_id) || null,
    },
  };
}
