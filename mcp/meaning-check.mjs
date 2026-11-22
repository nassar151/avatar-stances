import { matches, startServerOnSnapshot } from "./test-client.mjs";

const CREATE_GENERIC = "create generic";
const CREATE_CHILD = "create child";

const CASES = [
  { request: "Is my 2 year old a late talker? Speech delay worry: he says about 5 words, his hearing was checked and is fine.", meaning: "pediatric-speech-therapist" },
  { request: "My air conditioner is ac blowing warm air since yesterday. The unit is 8 years old and the filter is new.", meaning: "ac-technician" },
  { request: "Physio question: I'm in acl rehab, 4 months after surgery, I play soccer. When can I return to play?", meaning: "sports-physio" },
  { request: "Slow query on PostgreSQL 16: the orders table has 50M rows and explain analyze shows a seq scan.", meaning: "postgres-dba" },
  { request: "Please help plan my wedding: a destination wedding in Greece in June, 60 guests, budget 30k.", meaning: "destination-wedding-planner" },
  { request: "Is my 2 year old a late talker? Speech delay worry: he says about 5 words, understands simple instructions like 'bring your shoes', and his hearing was checked last month and is normal.", meaning: "pediatric-speech-therapist" },
  { request: "My central air conditioner is ac blowing warm air since yesterday. It is a split system, 8 years old, the filter is new, the thermostat is set to cool at 22°C, and the outdoor unit fan is not spinning but it hums.", meaning: "ac-technician" },
  { request: "Physio question: I'm in acl rehab after ACL reconstruction on my right knee in July, 4 months ago. I play soccer as a winger and tore it cutting in a match. When can I return to play?", meaning: "sports-physio" },
  { request: "Slow query on PostgreSQL 16: SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20 takes 4 seconds. The only index is the primary key on id.", meaning: "postgres-dba" },
  { request: "Please help plan my wedding: a destination wedding on Santorini, Greece in June 2027, 60 guests, budget 30,000 euros.", meaning: "destination-wedding-planner" },
  { request: "Exam tomorrow and I need to cram. How do I teach myself the whole history unit tonight?", meaning: "exam-cram-tutor" },
  { request: "Doctor, I suddenly see floaters and flashes of light in my left eye.", meaning: "ophthalmologist" },
  { request: "My bees are swarming from the hive, how do I catch the swarm and requeen?", meaning: CREATE_GENERIC },
  { request: "What ph should my pool water be?", meaning: "chemist" },
  { request: "Our rag pipeline returns the wrong chunks.", meaning: "rag-engineer" },
  { request: "I am 20 weeks pregnant and feel dizzy.", meaning: "prenatal-midwife" },
  { request: "Should I see a doctor about this cough?", meaning: "doctor" },
  { request: "Our kubernetes pods keep restarting", meaning: "kubernetes-architect" },
  { request: "My AC blows warm air", meaning: "ac-technician" },
  { request: "My knee hurts after running", meaning: "sports-physio" },
  { request: "My postgres query got slow after the last deploy", meaning: "postgres-dba" },
  { request: "My tummy aches and I keep throwing up since last night", meaning: "doctor" },
  { request: "How do I make pasta carbonara?", meaning: "cook" },
  { request: "I am not pregnant but my period is late.", meaning: CREATE_CHILD, parent: "doctor" },
  { request: "Someone just fainted at the office and isn't responding", meaning: "paramedic" },
  { request: "I smell something like rotten eggs near the stove", meaning: "firefighter" },
  { request: "The bathroom sink drains really slowly", meaning: "drain-specialist" },
  { request: "My cat keeps throwing up hairballs", meaning: "small-animal-vet" },
];

async function wordRoute(tool, generics, request) {
  const generic = matches(request, generics)[0];
  if (!generic) {
    return { id: null, path: "miss (would create a generic)" };
  }
  const child = matches(request, (await tool("list_child_avatars", { parentId: generic.id })).data)[0];
  const id = child?.id ?? generic.id;
  const hits = [...generic.hits, ...(child?.hits ?? [])].join(", ");
  return { id, path: `${generic.id}${child ? ` → ${child.id}` : ""}  [${hits}]` };
}

function meaningLabel(testCase) {
  if (testCase.meaning === CREATE_GENERIC) {
    return "no generic relates → create a generic";
  }
  if (testCase.meaning === CREATE_CHILD) {
    return `${testCase.parent} → create a child (uncovered specialty)`;
  }
  return testCase.meaning;
}

function agrees(testCase, word) {
  if (testCase.meaning === CREATE_GENERIC) {
    return word.id === null;
  }
  if (testCase.meaning === CREATE_CHILD) {
    return false;
  }
  return word.id === testCase.meaning;
}

const client = await startServerOnSnapshot("meaning-check");
try {
  const generics = (await client.tool("list_avatars", {})).data;
  let same = 0;
  for (const [index, testCase] of CASES.entries()) {
    const word = await wordRoute(client.tool, generics, testCase.request);
    const agree = agrees(testCase, word);
    same += agree ? 1 : 0;
    console.log(`${String(index + 1).padStart(2)}. ${agree ? "same" : "DIFF"}  ${testCase.request.slice(0, 80)}`);
    console.log(`      words:   ${word.path}`);
    console.log(`      meaning: ${meaningLabel(testCase)}`);
  }
  console.log(`\nword matching agrees with meaning on ${same}/${CASES.length}`);
} finally {
  client.stop();
}
