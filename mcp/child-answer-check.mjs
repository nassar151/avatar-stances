import { matches, startServerOnSnapshot } from "./test-client.mjs";

const ASK_CASES = [
  {
    request: "Is my 2 year old a late talker? Speech delay worry: he says about 5 words, his hearing was checked and is fine.",
    generic: "speech-therapist",
    child: "pediatric-speech-therapist",
    given: {
      "child's age": "2 year old",
      "number of words or sounds used": "says about 5 words",
      "hearing test result": "hearing was checked and is fine",
      "age (or diagnosis if adult)": "2 year old",
      "whether hearing has been tested": "hearing was checked",
    },
    asks: ["what the person can say or understand now"],
  },
  {
    request: "My air conditioner is ac blowing warm air since yesterday. The unit is 8 years old and the filter is new.",
    generic: "hvac-technician",
    child: "ac-technician",
    given: {
      "unit age": "8 years old",
      symptoms: "blowing warm air",
      "system type and age": "air conditioner",
      "what it is doing (no air, warm air, noise)": "blowing warm air",
    },
    asks: ["outdoor unit running or not", "filter and thermostat state"],
  },
  {
    request: "Physio question: I'm in acl rehab, 4 months after surgery, I play soccer. When can I return to play?",
    generic: "physiotherapist",
    child: "sports-physio",
    given: {
      "the injury and the date": "acl rehab, 4 months after surgery",
      "how and when it started": "4 months after surgery",
    },
    asks: [
      "the sport and position",
      "what the athlete can do now without pain",
      "where it hurts and which movement triggers it",
      "any numbness, weakness, or night pain",
    ],
  },
  {
    request: "Slow query on PostgreSQL 16: the orders table has 50M rows and explain analyze shows a seq scan.",
    generic: "database-administrator",
    child: "postgres-dba",
    given: {
      version: "PostgreSQL 16",
      plan: "explain analyze shows a seq scan",
      "database engine and version": "PostgreSQL 16",
      "data size and the symptom": "50M rows",
    },
    asks: ["query", "the query or table schema"],
  },
  {
    request: "Please help plan my wedding: a destination wedding in Greece in June, 60 guests, budget 30k.",
    generic: "wedding-planner",
    child: "destination-wedding-planner",
    given: {
      country: "Greece",
      guests: "60 guests",
      budget: "budget 30k",
      "date (or season) and location": "Greece in June",
      "budget and guest count": "60 guests, budget 30k",
    },
    asks: ["the couple's top three priorities"],
  },
];

const ANSWER_CASES = [
  {
    request: "Is my 2 year old a late talker? Speech delay worry: he says about 5 words, understands simple instructions like 'bring your shoes', and his hearing was checked last month and is normal.",
    generic: "speech-therapist",
    child: "pediatric-speech-therapist",
    given: {
      "child's age": "2 year old",
      "number of words or sounds used": "says about 5 words",
      "hearing test result": "hearing was checked last month and is normal",
      "age (or diagnosis if adult)": "2 year old",
      "what the person can say or understand now": "understands simple instructions",
      "whether hearing has been tested": "hearing was checked",
    },
    asks: [],
  },
  {
    request: "My central air conditioner is ac blowing warm air since yesterday. It is a split system, 8 years old, the filter is new, the thermostat is set to cool at 22°C, and the outdoor unit fan is not spinning but it hums.",
    generic: "hvac-technician",
    child: "ac-technician",
    given: {
      "unit age": "8 years old",
      symptoms: "blowing warm air",
      "outdoor unit running or not": "outdoor unit fan is not spinning but it hums",
      "system type and age": "split system, 8 years old",
      "what it is doing (no air, warm air, noise)": "blowing warm air",
      "filter and thermostat state": "the filter is new, the thermostat is set to cool",
    },
    asks: [],
  },
  {
    request: "Physio question: I'm in acl rehab after ACL reconstruction on my right knee in July, 4 months ago. I play soccer as a winger and tore it cutting in a match. I can jog straight and squat without pain; only a dull ache on the inside of the knee when I try to cut. No numbness, no giving way, no night pain. When can I return to play?",
    generic: "physiotherapist",
    child: "sports-physio",
    given: {
      "the sport and position": "soccer as a winger",
      "the injury and the date": "ACL reconstruction on my right knee in July",
      "what the athlete can do now without pain": "jog straight and squat without pain",
      "where it hurts and which movement triggers it": "dull ache on the inside of the knee when I try to cut",
      "how and when it started": "tore it cutting in a match",
      "any numbness, weakness, or night pain": "No numbness, no giving way, no night pain",
    },
    asks: [],
  },
  {
    request: "Slow query on PostgreSQL 16: SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20 takes 4 seconds. The orders table has 50M rows, explain analyze shows Seq Scan on orders with Rows Removed by Filter: 49999980, and the only index is the primary key on id.",
    generic: "database-administrator",
    child: "postgres-dba",
    given: {
      version: "PostgreSQL 16",
      query: "SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20",
      plan: "Seq Scan on orders with Rows Removed by Filter: 49999980",
      "database engine and version": "PostgreSQL 16",
      "the query or table schema": "the only index is the primary key on id",
      "data size and the symptom": "50M rows",
    },
    asks: [],
  },
  {
    request: "Please help plan my wedding: a destination wedding on Santorini, Greece in June 2027, 60 guests, budget 30,000 euros. Our top three priorities are the sea view, great food, and good photos.",
    generic: "wedding-planner",
    child: "destination-wedding-planner",
    given: {
      country: "Greece",
      guests: "60 guests",
      budget: "budget 30,000 euros",
      "date (or season) and location": "Santorini, Greece in June 2027",
      "budget and guest count": "60 guests, budget 30,000 euros",
      "the couple's top three priorities": "the sea view, great food, and good photos",
    },
    asks: [],
  },
];

const CASES = [
  ...ASK_CASES.map((testCase) => ({ ...testCase, expect: "ask" })),
  ...ANSWER_CASES.map((testCase) => ({ ...testCase, expect: "answer" })),
];

const LIST_FIELDS = ["cares", "ignores", "needs"];

function missingFrom(list, items) {
  return items.filter((item) => !list.includes(item));
}

function checkMerge(avatar) {
  const { parent, applied } = avatar;
  const failures = [];

  for (const field of LIST_FIELDS) {
    const fromParent = missingFrom(applied[field], parent[field]);
    const fromChild = missingFrom(applied[field], avatar[field]);
    if (fromParent.length > 0) {
      failures.push(`applied.${field} is missing parent items: ${fromParent.join(", ")}`);
    }
    if (fromChild.length > 0) {
      failures.push(`applied.${field} is missing child items: ${fromChild.join(", ")}`);
    }
  }
  for (const field of ["lens", "voice"]) {
    if (!applied[field].includes(parent[field])) {
      failures.push(`applied.${field} is missing the parent ${field}`);
    }
    if (!applied[field].includes(avatar[field])) {
      failures.push(`applied.${field} is missing the child ${field}`);
    }
  }
  if (applied.format !== avatar.format) {
    failures.push("applied.format is not the child format");
  }
  return failures;
}

function checkNeeds(testCase, appliedNeeds) {
  const failures = [];
  const request = testCase.request.toLowerCase();
  const accounted = new Set([...Object.keys(testCase.given), ...testCase.asks]);

  for (const need of accounted) {
    if (!appliedNeeds.includes(need)) {
      failures.push(`need "${need}" is not in applied.needs`);
    }
  }
  for (const need of appliedNeeds) {
    if (!accounted.has(need)) {
      failures.push(`need "${need}" is neither given nor expected as a question`);
    }
  }
  for (const [need, fragment] of Object.entries(testCase.given)) {
    if (!request.includes(fragment.toLowerCase())) {
      failures.push(`need "${need}": "${fragment}" is not in the request`);
    }
  }
  if (testCase.expect === "answer" && testCase.asks.length > 0) {
    failures.push(`expected a direct answer but ${testCase.asks.length} needs are missing`);
  }
  if (testCase.expect === "ask" && testCase.asks.length === 0) {
    failures.push("expected a question but every need is given");
  }
  return failures;
}

async function runCase(tool, testCase, index) {
  const failures = [];
  const generics = (await tool("list_avatars", {})).data;
  const genericHit = matches(testCase.request, generics)[0];
  if (genericHit?.id !== testCase.generic) {
    failures.push(`generic: expected ${testCase.generic}, got ${genericHit?.id ?? "none"}`);
  }

  const children = (await tool("list_child_avatars", { parentId: testCase.generic })).data;
  const childHit = matches(testCase.request, children)[0];
  if (childHit?.id !== testCase.child) {
    failures.push(`child: expected ${testCase.child}, got ${childHit?.id ?? "none"}`);
  }

  const avatar = (await tool("get_avatar", { id: testCase.child })).data;
  if (avatar.parent?.id !== testCase.generic) {
    failures.push(`parent: expected ${testCase.generic}, got ${avatar.parent?.id ?? "none"}`);
  } else {
    failures.push(...checkMerge(avatar));
    failures.push(...checkNeeds(testCase, avatar.applied.needs));
  }

  return {
    test: index + 1,
    passed: failures.length === 0,
    expect: testCase.expect,
    missingNeeds: testCase.asks,
    request: testCase.request,
    route: `${genericHit?.name ?? "?"} (${genericHit?.hits.join(", ")}) → ${childHit?.name ?? "?"} (${childHit?.hits.join(", ")})`,
    parentFields: {
      cares: avatar.parent?.cares,
      ignores: avatar.parent?.ignores,
      needs: avatar.parent?.needs,
    },
    childFields: {
      cares: avatar.cares,
      ignores: avatar.ignores,
      needs: avatar.needs,
    },
    format: avatar.applied?.format,
    failures,
  };
}

const client = await startServerOnSnapshot("child-answer-check");
try {
  const results = [];
  for (const [index, testCase] of CASES.entries()) {
    results.push(await runCase(client.tool, testCase, index));
  }
  console.log(JSON.stringify(results, null, 2));
  const failed = results.filter((result) => !result.passed).length;
  console.log(`\n${CASES.length - failed}/${CASES.length} passed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
} finally {
  client.stop();
}
