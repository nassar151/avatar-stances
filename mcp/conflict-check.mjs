import { matches, startServerOnSnapshot } from "./test-client.mjs";

const REQUEST = "Exam tomorrow and I need to cram. How do I teach myself the whole history unit tonight?";

const EXAM_CRAM_TUTOR = {
  parentId: "teacher",
  name: "Exam Cram Tutor",
  tagline: "One night, the whole syllabus, the questions that will actually come up.",
  lens: "What will the exam ask, which topics score the most, and what can be memorized by morning?",
  voice: "Fast and triaged. Covers everything at headline depth, then drills the high-yield parts.",
  cares: ["covering the whole textbook tonight", "high-yield topics", "past exam questions", "memory tricks"],
  ignores: ["one objective", "long projects"],
  triggers: ["exam tomorrow", "cram", "test tomorrow", "last minute studying"],
  needs: ["the subject and the exam format", "hours left before the exam"],
  format: "Triage table (topic, weight, minutes). Then a timed plan for tonight. Then memory tricks. Then a 10-question self-test.",
  intensity: 0.8,
};

const PARENT_CARE_CHILD_IGNORES = "one objective";
const PARENT_IGNORE_CHILD_CARES = "covering the whole textbook tonight";

function check(label, ok, detail) {
  return { label, ok, detail };
}

async function ensureChild(tool) {
  const existing = (await tool("list_child_avatars", { parentId: "teacher" })).data
    .find((row) => row.name === EXAM_CRAM_TUTOR.name);
  if (existing) {
    return existing.id;
  }
  const created = await tool("create_avatar", EXAM_CRAM_TUTOR);
  if (created.isError) {
    throw new Error(`create_avatar failed: ${JSON.stringify(created.data)}`);
  }
  return created.data.id;
}

async function run(tool) {
  const childId = await ensureChild(tool);

  const genericHits = matches(REQUEST, (await tool("list_avatars", {})).data);
  const childHits = matches(REQUEST, (await tool("list_child_avatars", { parentId: "teacher" })).data);
  const avatar = (await tool("get_avatar", { id: childHits[0]?.id })).data;
  const { parent, applied } = avatar;

  const checks = [
    check("generic is Teacher", genericHits[0]?.id === "teacher", genericHits.slice(0, 2)),
    check("child is Exam Cram Tutor", childHits[0]?.id === childId, childHits.slice(0, 2)),
    check(
      "parent ignores / child cares: kept in applied.cares",
      parent.ignores.includes(PARENT_IGNORE_CHILD_CARES) && applied.cares.includes(PARENT_IGNORE_CHILD_CARES),
      PARENT_IGNORE_CHILD_CARES,
    ),
    check(
      "parent ignores / child cares: removed from applied.ignores",
      !applied.ignores.includes(PARENT_IGNORE_CHILD_CARES),
      applied.ignores,
    ),
    check(
      "parent cares / child ignores: kept in applied.ignores",
      parent.cares.includes(PARENT_CARE_CHILD_IGNORES) && applied.ignores.includes(PARENT_CARE_CHILD_IGNORES),
      PARENT_CARE_CHILD_IGNORES,
    ),
    check(
      "parent cares / child ignores: removed from applied.cares",
      !applied.cares.includes(PARENT_CARE_CHILD_IGNORES),
      applied.cares,
    ),
    check("both conflicts listed in applied.overrides", applied.overrides.length === 2, applied.overrides),
    check(
      "non-conflicting parent fields still apply",
      applied.cares.includes("prior knowledge") && applied.ignores.includes("buzzwords"),
      { cares: "prior knowledge", ignores: "buzzwords" },
    ),
    check("format is the child's", applied.format === EXAM_CRAM_TUTOR.format, applied.format),
    check("voice ends with the child's line", applied.voice.endsWith(EXAM_CRAM_TUTOR.voice), applied.voice),
  ];

  console.log(JSON.stringify({ request: REQUEST, checks, applied }, null, 2));
  const failed = checks.filter((item) => !item.ok).length;
  console.log(`\n${checks.length - failed}/${checks.length} checks passed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

const client = await startServerOnSnapshot("conflict-check");
run(client.tool)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(client.stop);
