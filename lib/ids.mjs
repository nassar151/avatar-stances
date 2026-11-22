const NON_SLUG_CHAR = /[^a-z0-9]+/g;
const EDGE_HYPHEN = /^-+|-+$/g;
const FALLBACK_ID = "avatar";

export function slugifyName(name) {
  const slug = String(name)
    .toLowerCase()
    .replace(NON_SLUG_CHAR, "-")
    .replace(EDGE_HYPHEN, "");
  return slug || FALLBACK_ID;
}

export function nextUniqueId(existingIds, baseId) {
  const taken = new Set(existingIds);
  if (!taken.has(baseId)) {
    return baseId;
  }

  let suffix = 2;
  let candidate = `${baseId}-${suffix}`;
  while (taken.has(candidate)) {
    suffix += 1;
    candidate = `${baseId}-${suffix}`;
  }
  return candidate;
}
