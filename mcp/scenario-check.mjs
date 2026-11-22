import { matches, startServerOnSnapshot } from "./test-client.mjs";

const BEEKEEPER = {
  name: "Beekeeper",
  tagline: "The colony, the queen, the season — read the hive before you open it.",
  lens: "Is the colony queenright, is it about to swarm, and what does the season allow?",
  voice: "Calm, hive-side. Names frames, brood, and queen cells. Moves slowly.",
  cares: ["queen status and brood pattern", "swarm signs", "season and forage", "beekeeper safety"],
  ignores: ["honey marketing", "general gardening", "pesticide sales talk"],
  triggers: ["beekeeper", "my bees", "beehive", "swarming", "queen cells", "requeen"],
  needs: ["how many hives and how strong", "what was seen on the frames (queen cells, eggs, brood)", "region and month"],
  format: "Hive read in one line. Then what to do at the next inspection, as numbered steps. Then what to have ready (gear, box). Then what to watch next week.",
  intensity: 0.8,
};

const OPHTHALMOLOGIST = {
  parentId: "doctor",
  name: "Ophthalmologist",
  tagline: "The eye, the vision, the minutes that save sight.",
  lens: "Is this a sight-threatening emergency (sudden vision loss, flashes and floaters, chemical) or a surface problem?",
  voice: "Eye-specific and timed. Names which eye, sudden vs gradual, pain vs no pain.",
  cares: ["sudden vision loss", "flashes, floaters, curtain", "eye pain and red eye", "contact lens use"],
  ignores: ["cardiac workups", "skin rashes away from the eye"],
  triggers: ["ophthalmologist", "my eye", "blurry vision", "floaters", "flashes of light", "red eye", "vision loss"],
  needs: ["which eye, and sudden or gradual", "pain, light sensitivity, or a curtain over vision", "contact lenses or an injury"],
  format: "Eye emergency now vs. this week, first. Then the likely cause. Then what to do and not do (do not rub, rinse if chemical). Then what the exam will check.",
  intensity: 0.8,
};

const SCENARIOS = [
  {
    label: "1. No generic matches → create generic → answer as it",
    request: "My bees are swarming from the hive, how do I catch the swarm and requeen?",
  },
  {
    label: "2. Generic matches, no child → create child under it → answer as generic + child",
    request: "Doctor, I suddenly see floaters and flashes of light in my left eye.",
  },
];

function brief(hits) {
  return hits.map((hit) => `${hit.name} [${hit.hits.join(", ")}]`);
}

async function run(tool) {
  const report = [];

  {
    const { request: text, label } = SCENARIOS[0];
    const before = matches(text, (await tool("list_avatars", {})).data);
    const created = await tool("create_avatar", BEEKEEPER);
    const loaded = (await tool("get_avatar", { id: created.data.id })).data;
    const after = matches(text, (await tool("list_avatars", {})).data);
    report.push({
      label,
      request: text,
      genericHitsBefore: brief(before),
      created: { isError: created.isError, id: created.data.id, parentId: created.data.parentId },
      applied: loaded.applied,
      nextTimeGeneric: brief(after.slice(0, 1)),
      passed: before.length === 0 && after[0]?.id === created.data.id,
    });
  }

  {
    const { request: text, label } = SCENARIOS[1];
    const generics = matches(text, (await tool("list_avatars", {})).data);
    const parentId = generics[0]?.id;
    const childrenBefore = matches(text, (await tool("list_child_avatars", { parentId })).data);
    const existing = childrenBefore.find((hit) => hit.name === OPHTHALMOLOGIST.name);
    const created = existing
      ? { isError: false, data: { id: existing.id, parentId }, reused: true }
      : await tool("create_avatar", OPHTHALMOLOGIST);
    const loaded = (await tool("get_avatar", { id: created.data.id })).data;
    const childrenAfter = matches(text, (await tool("list_child_avatars", { parentId })).data);
    const genericsAfter = (await tool("list_avatars", {})).data;
    report.push({
      label,
      request: text,
      genericHits: brief(generics.slice(0, 2)),
      childHitsBefore: brief(childrenBefore),
      created: { isError: created.isError, id: created.data.id, parentId: created.data.parentId, reused: Boolean(created.reused) },
      parent: loaded.parent?.name,
      appliedCares: loaded.applied.cares,
      appliedNeeds: loaded.applied.needs,
      appliedFormat: loaded.applied.format,
      appliedIgnores: loaded.applied.ignores,
      nextTimeChild: brief(childrenAfter.slice(0, 1)),
      leakedIntoGenerics: genericsAfter.some((avatar) => avatar.id === created.data.id),
      passed: parentId === "doctor"
        && (created.reused || childrenBefore.length === 0)
        && childrenAfter[0]?.id === created.data.id
        && !genericsAfter.some((avatar) => avatar.id === created.data.id),
    });
  }

  console.log(JSON.stringify(report, null, 2));
  const failed = report.filter((item) => !item.passed).length;
  console.log(`\n${report.length - failed}/${report.length} scenarios passed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

const client = await startServerOnSnapshot("scenario-check");
run(client.tool)
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(client.stop);
