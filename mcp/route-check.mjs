import { matches, startServerOnSnapshot } from "./test-client.mjs";

const NON_MATCHES = [
  { request: "I volunteer at a community garden on weekends.", avatar: "game-developer", trigger: "unity" },
  { request: "Should I ask the pharmacist about this prescription?", avatar: "chemist", trigger: "ph" },
  { request: "My car has been sitting in the garage all winter.", avatar: "ai-engineer", trigger: "rag" },
  { request: "I am not pregnant but my period is late.", avatar: "midwife", trigger: "pregnant" },
  { request: "I have had no contractions so far today.", avatar: "midwife", trigger: "contractions" },
  { request: "Tonight I am cooking without a recipe.", avatar: "cook", trigger: "recipe" },
];

const MATCHES = [
  { request: "My unity game crashes when the scene loads.", avatar: "game-developer", trigger: "unity" },
  { request: "What ph should my pool water be?", avatar: "chemist", trigger: "ph" },
  { request: "Our rag pipeline returns the wrong chunks.", avatar: "ai-engineer", trigger: "rag" },
  { request: "I am 20 weeks pregnant and feel dizzy.", avatar: "midwife", trigger: "pregnant" },
  { request: "My dog is not eating since yesterday.", avatar: "veterinarian", trigger: "not eating" },
];

function hitsFor(request, generics, avatarId) {
  return matches(request, generics).find((row) => row.id === avatarId)?.hits ?? [];
}

function payloadChars(reply) {
  return JSON.stringify(reply.data).length;
}

const client = await startServerOnSnapshot("route-check");
try {
  const listReply = await client.tool("list_avatars", {});
  const generics = listReply.data;
  const results = [
    ...NON_MATCHES.map((testCase) => {
      const hits = hitsFor(testCase.request, generics, testCase.avatar);
      return { ...testCase, expect: "no hit", passed: !hits.includes(testCase.trigger) };
    }),
    ...MATCHES.map((testCase) => {
      const hits = hitsFor(testCase.request, generics, testCase.avatar);
      return { ...testCase, expect: "hit", passed: hits.includes(testCase.trigger) };
    }),
  ];

  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    console.log(`${status}  ${result.expect.padEnd(6)}  ${result.avatar} "${result.trigger}"  ←  ${result.request}`);
  }

  const childReply = await client.tool("list_child_avatars", { parentId: "doctor" });
  console.log(
    `\nlookup payload: list_avatars ${generics.length} generics = ${payloadChars(listReply)} chars,`
    + ` list_child_avatars doctor (${childReply.data.length}) = ${payloadChars(childReply)} chars`,
  );

  const failed = results.filter((result) => !result.passed).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
} finally {
  client.stop();
}
