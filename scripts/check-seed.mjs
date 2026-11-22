import { SEED_ROWS, withGuidance } from "../lib/db.mjs";

const EXPECTED_GENERICS = 100;
const CHILDREN_PER_GENERIC = 5;
const TEXT_FIELDS = ["name", "tagline", "lens", "voice", "format"];
const MIN_ITEMS = { cares: 4, ignores: 1, triggers: 4, needs: 3 };

const rows = SEED_ROWS.map(withGuidance);
const errors = [];

const seenIds = new Set();
for (const row of rows) {
  if (seenIds.has(row.id)) {
    errors.push(`duplicate id: ${row.id}`);
  }
  seenIds.add(row.id);

  for (const field of TEXT_FIELDS) {
    if (typeof row[field] !== "string" || row[field].trim() === "") {
      errors.push(`${row.id}: empty ${field}`);
    }
  }
  for (const [field, min] of Object.entries(MIN_ITEMS)) {
    const length = Array.isArray(row[field]) ? row[field].length : 0;
    if (length < min) {
      errors.push(`${row.id}: ${field} has ${length}, needs at least ${min}`);
    }
  }
}

const generics = rows.filter((row) => !row.parentId);
const genericIds = new Set(generics.map((row) => row.id));
if (generics.length !== EXPECTED_GENERICS) {
  errors.push(`expected ${EXPECTED_GENERICS} generics, found ${generics.length}`);
}

const childrenByParent = new Map(generics.map((row) => [row.id, []]));
for (const row of rows.filter((item) => item.parentId)) {
  if (!genericIds.has(row.parentId)) {
    errors.push(`${row.id}: parent ${row.parentId} is not a generic`);
    continue;
  }
  childrenByParent.get(row.parentId).push(row);
}

for (const [parentId, children] of childrenByParent) {
  if (children.length !== CHILDREN_PER_GENERIC) {
    errors.push(`${parentId}: has ${children.length} children, expected ${CHILDREN_PER_GENERIC}`);
  }
  const siblingTriggers = new Map();
  for (const child of children) {
    for (const trigger of child.triggers.map((item) => item.toLowerCase())) {
      const owner = siblingTriggers.get(trigger);
      if (owner && owner !== child.id) {
        errors.push(`${parentId}: trigger "${trigger}" shared by ${owner} and ${child.id}`);
      }
      siblingTriggers.set(trigger, child.id);
    }
  }
}

const genericTriggers = new Map();
for (const generic of generics) {
  for (const trigger of generic.triggers.map((item) => item.toLowerCase())) {
    const owner = genericTriggers.get(trigger);
    if (owner && owner !== generic.id) {
      errors.push(`generic trigger "${trigger}" shared by ${owner} and ${generic.id}`);
    }
    genericTriggers.set(trigger, generic.id);
  }
}

const summary = {
  rows: rows.length,
  generics: generics.length,
  children: rows.length - generics.length,
  errors: errors.length,
};

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(summary, null, 2));
