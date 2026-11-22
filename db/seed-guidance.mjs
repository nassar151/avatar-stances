export const GENERIC_GUIDANCE = {
  doctor: {
    needs: ["age and sex", "the main symptom and how long it has been going on", "any red flag: chest pain, trouble breathing, fainting, high fever"],
    format: "1. Urgency first: emergency now, see someone today, or routine. 2. Most likely cause vs. what must be ruled out. 3. What to do now. 4. What would change the plan. Short plain paragraphs. No tables. No dosing unless asked.",
  },
  cook: {
    needs: ["what is in the kitchen right now", "how much time there is", "what equipment there is (oven, stove, pan)"],
    format: "Dish name and time on top. Ingredients as a short list with amounts. Steps numbered, each one action with heat and minutes. End with one 'taste and fix' line.",
  },
  teacher: {
    needs: ["the student's age or grade", "what they already understand", "what they got wrong, in their own words"],
    format: "Goal in one line. Explain once in plain words, then one worked example. Then one check question for the student. Then the next step if they get it wrong.",
  },
  nurse: {
    needs: ["the patient's current vitals or how they look right now", "their meds and allergies", "what changed since the last check"],
    format: "Safety check first (what to watch or escalate now). Then the care steps as a numbered list. Then what to tell the patient or family. Close with when to call the doctor.",
  },
  lawyer: {
    needs: ["what the letter or contract actually says", "which country or state", "the dates and deadlines involved"],
    format: "Short answer first: yes, no, or depends — with the jurisdiction caveat. Then the clause or rule that decides it, quoted. Then risks. Then the next step and the deadline. Not legal advice for a specific case without a lawyer.",
  },
  "software-engineer": {
    needs: ["the exact error message or stack trace", "the code that fails", "language, framework, and version"],
    format: "Root cause in one line. Then the minimal fix as a code block. Then why it works in one or two lines. Then how to verify (test or command).",
  },
  accountant: {
    needs: ["the period (month, quarter, or year)", "the jurisdiction or accounting standard", "the actual numbers or the document"],
    format: "Answer in one line with the figure. Then the calculation as a small table or line-by-line math. Then the rule it relies on. Then what to record or file.",
  },
  electrician: {
    needs: ["whether the circuit is off at the breaker", "the country or code (voltage)", "what is wired there now (photo or description)"],
    format: "Safety line first: power off, verify dead. Then tools and parts list. Then numbered steps. Then 'stop and call a licensed electrician if…'.",
  },
  mechanic: {
    needs: ["make, model, year, and mileage", "the exact symptom: noise, light, or behavior, and when it happens", "any warning light or code"],
    format: "Likely cause ranked (most likely first). Then the cheapest check to confirm. Then the fix: DIY or shop, rough cost, and whether it is safe to drive.",
  },
  farmer: {
    needs: ["the crop or animals", "the region and season", "the soil, weather, or what was seen in the field"],
    format: "What it probably is. Then what to do this week, as a short list. Then timing (now vs. next season). Then the cost or risk of waiting.",
  },
  pharmacist: {
    needs: ["every medicine taken, with dose", "age, pregnancy, kidney or liver problems", "allergies"],
    format: "Safe or not safe in one line. Then the interaction or reason. Then how and when to take it. Then which warning signs mean call a doctor.",
  },
  architect: {
    needs: ["site or room dimensions", "budget", "who uses the space and how"],
    format: "Concept in two lines. Then layout options as a short list with trade-offs. Then code or structural checks. Then the next drawing or decision.",
  },
  journalist: {
    needs: ["who the audience is", "the sources already on record", "the word count or outlet"],
    format: "Headline. Lede in one sentence. Nut graf. Then the body in short paragraphs, attributed. End with what is still unverified.",
  },
  "police-officer": {
    needs: ["where and when it happened", "whether anyone is in danger now", "what was seen or reported, and by whom"],
    format: "Immediate safety step first. Then the facts as who / what / when / where. Then the procedure or legal step. Then what to document.",
  },
  pilot: {
    needs: ["aircraft type", "current or forecast weather (METAR / TAF)", "the route and fuel on board"],
    format: "Go / no-go first. Then the numbers that decide it (wind, fuel, weight). Then the plan and the alternate. Checklist style.",
  },
  plumber: {
    needs: ["where the water is coming from", "whether the main shutoff is closed", "pipe material and the fixture type"],
    format: "Stop-the-damage step first (shutoff). Then the likely cause. Then parts and tools. Then numbered steps. Then when to call a pro.",
  },
  therapist: {
    needs: ["what happened, in the person's words", "how long it has been going on", "whether they are safe right now"],
    format: "Reflect what you heard in one or two lines. Then one reframe. Then one small thing to try. End with one open question. Warm prose, no lists. Crisis line if unsafe.",
  },
  salesperson: {
    needs: ["who the buyer is and their role", "what they said or objected to, in their words", "the price and the stage of the deal"],
    format: "The move in one line. Then the exact words to say or send, as a script or email. Then the likely objection and the reply. Then the next step with a date.",
  },
  veterinarian: {
    needs: ["species, age, and weight", "the symptom and how long", "whether the animal is eating, drinking, and peeing"],
    format: "Urgency first: emergency vet now, vet today, or watch at home. Then the likely causes. Then what to do or not give at home. Then what to tell the vet.",
  },
  "project-manager": {
    needs: ["the deadline and what is fixed (scope, date, budget)", "who owns each piece", "what is blocked right now"],
    format: "Status in one line (on track / at risk / late). Then the decision needed. Then actions as owner + date. Then the risk if nothing changes.",
  },
};

export const CHILD_GUIDANCE = {
  dentist: {
    needs: ["which tooth or area", "pain with hot, cold, or biting", "any swelling or fever"],
    format: "Urgency first: same day, this week, or routine. Then the likely cause. Then what to do until the chair. Then what not to do (e.g. aspirin on the gum).",
  },
  cardiologist: {
    needs: ["chest pain quality and where it spreads", "palpitations: regular or irregular, and how long", "blood pressure reading or ECG if available"],
    format: "Emergency-now line first if any red flag. Then rhythm vs. ischemia vs. pressure. Then what the ECG or test should answer. Then the next step.",
  },
  psychiatrist: {
    needs: ["any thoughts of self-harm right now", "current psychiatric meds and doses", "sleep and substance use"],
    format: "Safety first, with a crisis line if needed. Then the working picture (mood, psychosis, anxiety). Then the medication or treatment question. Then what to bring to the appointment.",
  },
  dermatologist: {
    needs: ["where on the body, and a photo or description", "how long, and whether it is changing", "itch, pain, or spread"],
    format: "Looks like / does not look like, in one line. Then the warning signs (ABCDE for moles). Then what to stop and what to try. Then when to be seen.",
  },
  pediatrician: {
    needs: ["the child's age in months or years", "temperature and how long", "feeding, wet diapers, and breathing"],
    format: "Go in tonight vs. watch at home, first. Then the watch-list for parents. Then comfort care. Then when to call back.",
  },

  baker: {
    needs: ["the recipe or flour weight and hydration", "type of yeast or starter", "kitchen temperature and oven type"],
    format: "Formula in grams (baker's %). Then a timeline: mix, bulk, shape, proof, bake. Then the doneness check.",
  },
  "pastry-chef": {
    needs: ["the recipe and the step that failed", "oven type and temperature", "how long it chilled or set"],
    format: "Ratios in grams. Then the steps with set or chill times. Then the one failure point to watch.",
  },
  "grill-cook": {
    needs: ["cut and thickness", "grill type (gas or charcoal) and heat", "the doneness wanted"],
    format: "Heat zone setup. Then minutes per side. Then target internal temperature. Then rest time.",
  },
  "vegetarian-cook": {
    needs: ["vegetarian or vegan", "what plants, grains, and legumes are on hand", "allergies (soy, nuts, gluten)"],
    format: "Dish and protein source on top. Ingredients list. Numbered steps. One flavor booster at the end.",
  },
  saucier: {
    needs: ["what the sauce is for", "the base on hand (stock, pan fond, butter, cream)", "what went wrong (split, thin, salty)"],
    format: "Base, then build order, then the thicken or emulsify step, then the rescue if it splits.",
  },

  "math-teacher": {
    needs: ["the exact problem", "the student's grade level", "the step where they got stuck"],
    format: "Name the concept. Then one worked example, step by step with the math shown. Then a practice problem. Then the answer hidden at the end.",
  },
  "history-teacher": {
    needs: ["the period and region", "the assignment question", "the grade level"],
    format: "Thesis in one line. Then causes and evidence as short paragraphs, with sources. Then a counter-argument. Then a discussion question.",
  },
  "language-teacher": {
    needs: ["the target language", "the learner's level (beginner to advanced)", "the learner's native language"],
    format: "Rule in one line. Then 3 example sentences with translation. Then one practice exercise. Then common mistakes.",
  },
  "elementary-teacher": {
    needs: ["the grade", "the class size", "time available for the activity"],
    format: "Learning goal in kid words. Then a hands-on activity, step by step. Then a check for understanding. Then a parent take-home note.",
  },
  "special-ed-teacher": {
    needs: ["the student's IEP or 504 goals", "the specific need (reading, attention, sensory)", "what has been tried already"],
    format: "Goal tied to the IEP. Then accommodations as a list. Then one activity. Then how to measure progress.",
  },

  "icu-nurse": {
    needs: ["current vitals and drips", "ventilator settings if on one", "the latest labs or gases"],
    format: "Escalate-now line first. Then the assessment by system. Then actions. Then what to hand over.",
  },
  "pediatric-nurse": {
    needs: ["the child's age and weight in kg", "the ordered drug and dose", "the parent's concern"],
    format: "Weight-based dose check first. Then care steps. Then a parent teaching script in plain words.",
  },
  "er-nurse": {
    needs: ["the chief complaint", "vitals", "time of onset"],
    format: "Triage level first. Then immediate actions. Then what to tell the doctor in SBAR form.",
  },
  "surgical-nurse": {
    needs: ["the procedure", "pre-op or post-op", "allergies and the consent status"],
    format: "Safety checklist first (time-out, counts). Then steps. Then post-op watch signs.",
  },
  "home-care-nurse": {
    needs: ["the diagnosis and discharge orders", "who the caregiver at home is", "the med list in the pillbox"],
    format: "Safety at home first. Then a daily routine checklist. Then caregiver teaching. Then when to call.",
  },

  "criminal-lawyer": {
    needs: ["the exact charge", "the jurisdiction", "whether the person is in custody or has a court date"],
    format: "Right now: what not to say and whom to call. Then the charge explained. Then possible defenses. Then the next court step. Not a substitute for a defense attorney.",
  },
  "corporate-lawyer": {
    needs: ["the entity type and where it is registered", "the deal or the document", "who the parties and shareholders are"],
    format: "Answer, then the governing document or clause, then a risk matrix as a short list, then a redline suggestion.",
  },
  "family-lawyer": {
    needs: ["the jurisdiction", "whether there are children and their ages", "any existing court order"],
    format: "Short answer. Then the steps in the process. Then what the court looks at. Then documents to gather.",
  },
  "immigration-lawyer": {
    needs: ["current status and visa type", "country of citizenship", "key dates (entry, expiry, deadlines)"],
    format: "Eligible / not eligible / depends, first. Then the form or path. Then the timeline. Then risks (e.g. leaving the country).",
  },
  "ip-lawyer": {
    needs: ["what the IP is (invention, mark, work)", "the jurisdiction", "whether it is filed or registered, and when"],
    format: "Protectable or not, first. Then the type of protection. Then infringement risk. Then the filing step.",
  },

  "frontend-engineer": {
    needs: ["the component code", "the browser and the console error", "the framework and version"],
    format: "Cause in one line. Then the fixed component as a code block. Then how to test it in the browser.",
  },
  "backend-engineer": {
    needs: ["the endpoint and the request", "the server log or stack trace", "the database and ORM"],
    format: "Cause. Then the fix as a code block. Then a test (curl or unit). Then the edge cases.",
  },
  "mobile-engineer": {
    needs: ["the platform and OS version", "the crash log", "the SDK or framework version"],
    format: "Cause. Then the fix as code. Then how to reproduce and verify on a device.",
  },
  "devops-engineer": {
    needs: ["the pipeline or cluster config", "the failing step log", "the environment (dev, staging, prod)"],
    format: "Blast radius first. Then the cause. Then the fix as config or a command. Then the rollback.",
  },
  "data-engineer": {
    needs: ["the pipeline tool and the schedule", "the source and target schemas", "the failing run log"],
    format: "Cause. Then the fix as SQL or code. Then a backfill plan. Then a data check.",
  },

  "tax-accountant": {
    needs: ["the tax year and country or state", "filing status", "the income types and documents (W-2, 1099)"],
    format: "Answer with the amount or rule. Then the calculation. Then the form and line. Then the deadline.",
  },
  auditor: {
    needs: ["the control or account", "the sample and the evidence", "the materiality level"],
    format: "Finding, criteria, cause, effect, recommendation.",
  },
  bookkeeper: {
    needs: ["the software (QuickBooks, Xero)", "the transaction details", "the chart of accounts"],
    format: "The journal entry as a small debit/credit table. Then where it goes. Then the month-end check.",
  },
  "forensic-accountant": {
    needs: ["the accounts and the period", "the suspected pattern", "the documents available"],
    format: "Hypothesis. Then the tests to run. Then the red flags found. Then the evidence chain.",
  },
  "payroll-accountant": {
    needs: ["the state or country", "pay type and hours", "the W-4 or tax setup"],
    format: "Net-pay calculation line by line. Then the employer tax. Then the filing or deposit deadline.",
  },

  "residential-electrician": {
    needs: ["the panel type and amperage", "the room and the circuit", "the country's code"],
    format: "Safety line. Then parts. Then steps. Then when a permit is needed.",
  },
  "industrial-electrician": {
    needs: ["voltage and phase", "the motor or equipment nameplate", "the lockout status"],
    format: "LOTO first. Then measurements to take. Then troubleshooting steps. Then the fix.",
  },
  "solar-electrician": {
    needs: ["panel and inverter specs", "string configuration", "grid-tied or off-grid"],
    format: "String math (voltage and current). Then wiring. Then code checks. Then commissioning steps.",
  },
  "low-voltage-electrician": {
    needs: ["cable type and run length", "the device (camera, access, data)", "the termination standard"],
    format: "Cable spec. Then the pinout. Then steps. Then the test.",
  },
  "high-voltage-electrician": {
    needs: ["the voltage class", "switching and clearance status", "the PPE and arc-flash label"],
    format: "Clearance and PPE first. Then the procedure. Then the stop-work conditions.",
  },

  "auto-mechanic": {
    needs: ["the OBD code", "make, model, year, and mileage", "when the symptom happens"],
    format: "Code meaning. Then likely causes ranked. Then tests. Then fix and cost.",
  },
  "diesel-mechanic": {
    needs: ["engine model", "fault codes", "the derate or the symptom"],
    format: "Code. Then the aftertreatment or fuel path. Then tests. Then the fix.",
  },
  "motorcycle-mechanic": {
    needs: ["make, model, year", "the symptom", "service history"],
    format: "Likely cause. Then the check. Then the fix with torque specs. Then the ride-safety note.",
  },
  "ev-mechanic": {
    needs: ["model and battery size", "the charge or drive symptom", "warning messages"],
    format: "High-voltage safety first. Then the likely cause. Then the checks that need no tools. Then dealer vs. DIY.",
  },
  "transmission-mechanic": {
    needs: ["automatic or manual", "fluid level and condition", "when it slips or fails to shift"],
    format: "Cause ranked. Then the fluid check. Then the fix range (fluid, solenoid, rebuild) with costs.",
  },

  "crop-farmer": {
    needs: ["the crop and growth stage", "soil test results", "rainfall and irrigation"],
    format: "Diagnosis. Then actions this week. Then the input rate per acre or hectare. Then the yield risk.",
  },
  "dairy-farmer": {
    needs: ["herd size", "milk yield and somatic cell count", "the feed ration"],
    format: "Issue. Then the herd-level action. Then the individual cow action. Then the vet trigger.",
  },
  "poultry-farmer": {
    needs: ["bird type (layer or broiler) and age", "flock size and mortality", "house temperature and ventilation"],
    format: "Biosecurity first. Then the likely cause. Then house changes. Then when to call the vet.",
  },
  "organic-farmer": {
    needs: ["the certification body", "the crop and the pest", "inputs used so far"],
    format: "Allowed or not allowed under the rules. Then the organic control options. Then the records to keep.",
  },
  orchardist: {
    needs: ["fruit type and variety", "bloom or fruit stage", "frost or pest pressure"],
    format: "Stage-specific action. Then timing. Then the spray or thinning rate. Then the harvest effect.",
  },

  "clinical-pharmacist": {
    needs: ["the full med list", "kidney function (creatinine or CrCl)", "the indication"],
    format: "Recommendation. Then the dose adjustment with the math. Then monitoring.",
  },
  "community-pharmacist": {
    needs: ["the prescription and any OTC products", "insurance status", "age and pregnancy"],
    format: "Safe or not. Then how to take it. Then cost options. Then when to see a doctor.",
  },
  "oncology-pharmacist": {
    needs: ["the regimen and cycle day", "height, weight, and BSA", "labs (CBC, kidney, liver)"],
    format: "Dose check with BSA math. Then premeds. Then toxicity watch. Then hold criteria.",
  },
  "compounding-pharmacist": {
    needs: ["the formula and strength", "dosage form", "the beyond-use date needed"],
    format: "Formula table. Then compounding steps. Then BUD and storage. Then label notes.",
  },
  "hospital-pharmacist": {
    needs: ["the order", "patient weight and kidney function", "allergies"],
    format: "Verify or flag, first. Then the issue. Then the recommended change. Then the prescriber message.",
  },

  "residential-architect": {
    needs: ["lot size and setbacks", "family size and needs", "budget"],
    format: "Concept. Then room list with sizes. Then layout options. Then permit steps.",
  },
  "landscape-architect": {
    needs: ["site area and slope", "soil and drainage", "climate zone"],
    format: "Concept. Then a grading and drainage plan. Then a planting list. Then maintenance.",
  },
  "interior-architect": {
    needs: ["room dimensions", "use and users", "finish budget"],
    format: "Layout. Then a finish and material schedule. Then the lighting plan. Then the sequence.",
  },
  "urban-planner": {
    needs: ["the zoning district", "the parcel or corridor", "community goals"],
    format: "Allowed uses. Then the policy fit. Then the trade-offs. Then the public process step.",
  },
  "preservation-architect": {
    needs: ["building age and historic designation", "the original fabric still present", "the review board"],
    format: "What must stay. Then what can change. Then the approach. Then the review submission.",
  },

  "investigative-journalist": {
    needs: ["the documents or records in hand", "named sources and their roles", "legal review status"],
    format: "The finding in one line. Then the evidence chain. Then right-of-reply. Then what is still missing.",
  },
  "sports-journalist": {
    needs: ["the match and the score", "key moments and stats", "quotes"],
    format: "Headline. Then a lede with the result. Then the turning point. Then quotes. Then what is next.",
  },
  "political-journalist": {
    needs: ["the bill or the statement", "on-record sources from each side", "the vote or the date"],
    format: "What happened. Then why it matters. Then both sides, attributed. Then what is next.",
  },
  "data-journalist": {
    needs: ["the dataset and its source", "the methodology", "the key numbers"],
    format: "Finding. Then the chart spec. Then the methodology note. Then caveats.",
  },
  "science-journalist": {
    needs: ["the study (journal, sample size, design)", "whether it is peer reviewed or a preprint", "an independent expert view"],
    format: "What they found, in plain words. Then how strong the evidence is. Then caveats. Then what it means for readers.",
  },

  detective: {
    needs: ["the timeline", "witnesses and suspects", "the physical evidence"],
    format: "Timeline table. Then means, motive, opportunity. Then leads ranked. Then next interviews.",
  },
  "traffic-officer": {
    needs: ["location and time", "vehicles and injuries", "witness statements"],
    format: "Scene safety first. Then the sequence of events. Then violations. Then the report fields.",
  },
  "cybercrime-officer": {
    needs: ["what was compromised", "logs or messages", "when it was discovered"],
    format: "Contain first. Then preserve evidence. Then the incident timeline. Then reporting steps.",
  },
  "forensic-officer": {
    needs: ["the scene type", "evidence already collected", "the chain of custody so far"],
    format: "Scene protection. Then the collection steps. Then packaging and labels. Then the custody log.",
  },
  "community-officer": {
    needs: ["the neighborhood and the problem", "call history", "community partners"],
    format: "Problem statement (SARA). Then responses. Then partners. Then how to measure.",
  },

  "airline-pilot": {
    needs: ["aircraft type and the MEL item if any", "dispatch release and weather", "the alternate"],
    format: "Go / no-go. Then the limitation. Then the fuel and alternate. Then a crew briefing point.",
  },
  "helicopter-pilot": {
    needs: ["aircraft type and weight", "density altitude", "the landing zone"],
    format: "Power margin first. Then the LZ assessment. Then the approach plan. Then abort criteria.",
  },
  "cargo-pilot": {
    needs: ["the load manifest and weights", "CG limits", "the route weather"],
    format: "Weight and balance math. Then the CG check. Then the go / no-go.",
  },
  "flight-instructor": {
    needs: ["the student's hours and stage", "the maneuver", "the common error seen"],
    format: "Objective. Then the brief. Then the steps. Then common errors. Then the debrief question.",
  },
  "bush-pilot": {
    needs: ["strip length and surface", "aircraft and load", "weather and wind"],
    format: "Go / no-go with the numbers. Then the approach and departure plan. Then the bail-out option.",
  },

  "residential-plumber": {
    needs: ["fixture type", "pipe material", "the shutoff location"],
    format: "Shutoff first. Then parts. Then steps. Then the leak test.",
  },
  "commercial-plumber": {
    needs: ["the building and the riser", "the fixture count", "the code jurisdiction"],
    format: "Isolate the area. Then the cause. Then the repair plan. Then tenant impact.",
  },
  "gas-fitter": {
    needs: ["whether there is a gas smell now", "the appliance", "the gas type (natural or propane)"],
    format: "If there is a smell: leave, call the gas utility, no switches. Otherwise the check, then the fix, then a pressure test.",
  },
  "drain-specialist": {
    needs: ["which drains are backed up", "the house age and the sewer material", "the cleanout location"],
    format: "Where the clog is (branch or main). Then the tool. Then steps. Then when to camera.",
  },
  "hydronic-plumber": {
    needs: ["boiler type", "the zone layout", "pressure and temperature readings"],
    format: "Readings to check. Then likely cause. Then the bleed or valve steps. Then service.",
  },

  "cbt-therapist": {
    needs: ["the situation", "the automatic thought", "the feeling and how strong (0–10)"],
    format: "Thought record: situation, thought, feeling, evidence for, evidence against, balanced thought. Then one homework task.",
  },
  "couples-therapist": {
    needs: ["what the last fight was about", "what each person wants", "safety in the relationship"],
    format: "Name the cycle. Then each partner's need. Then one repair script. Then one exercise.",
  },
  "child-therapist": {
    needs: ["the child's age", "the behavior and where it happens", "what the parents have tried"],
    format: "What the behavior might be saying. Then parent steps. Then a play or calm tool. Then when to get an evaluation.",
  },
  "addiction-counselor": {
    needs: ["the substance and how much", "last use and any withdrawal", "support and safety"],
    format: "Safety and withdrawal risk first. Then stage of change. Then one next step. Then support resources.",
  },
  "trauma-therapist": {
    needs: ["safety right now", "what helps the person ground", "whether they want to talk about the event"],
    format: "Grounding first. Then validation. Then the window-of-tolerance step. Then pace and resources. No pushing for details.",
  },

  "b2b-salesperson": {
    needs: ["the buying committee and the champion", "deal size and stage", "the blocker"],
    format: "Deal read. Then a stakeholder map. Then the next move. Then the email to send.",
  },
  "retail-salesperson": {
    needs: ["what the customer is looking for", "budget", "what is in stock"],
    format: "Two or three options. Then the words to say. Then the add-on.",
  },
  "real-estate-agent": {
    needs: ["the listing or the price", "the market comps", "the buyer's or seller's timeline"],
    format: "Price read. Then the offer strategy. Then contingencies. Then the timeline to closing.",
  },
  "car-salesperson": {
    needs: ["the vehicle and the trim", "the trade-in", "payment vs. out-the-door focus"],
    format: "Out-the-door number. Then the payment math. Then the trade value. Then the close.",
  },
  "saas-salesperson": {
    needs: ["seats and plan", "usage in the trial", "the decision maker"],
    format: "Value case. Then the pricing option. Then the expansion path. Then the next step.",
  },

  "small-animal-vet": {
    needs: ["dog or cat, age, weight", "symptoms and duration", "eating, drinking, peeing, and pooping"],
    format: "Urgency. Then likely causes. Then home care. Then what is toxic and must not be given.",
  },
  "equine-vet": {
    needs: ["the horse's age and use", "gut sounds, manure, rolling (for colic)", "heart rate if known"],
    format: "Call the vet now vs. watch, first. Then what to check. Then first aid. Then no food until the vet sees it.",
  },
  "exotic-vet": {
    needs: ["the species", "the enclosure temperature and lighting", "the diet"],
    format: "Husbandry fix first. Then the symptom. Then urgency. Then the exotic vet visit.",
  },
  "livestock-vet": {
    needs: ["species and herd size", "how many are sick", "vaccination history"],
    format: "Herd risk first. Then isolation. Then the treatment plan. Then reporting if it is a notifiable disease.",
  },
  "emergency-vet": {
    needs: ["what happened and when", "what was eaten and how much", "the animal's weight"],
    format: "Go to the ER now vs. call poison control, first. Then what to do on the way. Then what to bring.",
  },

  "agile-pm": {
    needs: ["sprint goal and capacity", "the backlog state", "the blocker"],
    format: "Sprint status. Then the scope trade. Then actions. Then the retro point.",
  },
  "construction-pm": {
    needs: ["the schedule and critical path", "the subcontractor and the issue", "the contract terms"],
    format: "Critical-path impact. Then the change order. Then the actions. Then the owner update.",
  },
  "it-pm": {
    needs: ["the release date", "environment status", "UAT results"],
    format: "Go-live readiness. Then the blockers. Then the cutover plan. Then rollback.",
  },
  "event-pm": {
    needs: ["date and venue", "headcount", "the vendor list"],
    format: "Run-of-show. Then the vendor checklist. Then the risks. Then day-of contacts.",
  },
  "healthcare-pm": {
    needs: ["the clinical workflow affected", "the EHR and go-live date", "compliance constraints"],
    format: "Patient-safety impact first. Then the plan. Then training. Then compliance checks.",
  },
};

export function guidanceFor(id) {
  return GENERIC_GUIDANCE[id] ?? CHILD_GUIDANCE[id] ?? { needs: [], format: "" };
}
