import { NEGATION_WINDOW, NEGATION_WORDS } from "./constants.mjs";

const WORD_PATTERN = /[a-z0-9]+(?:'[a-z0-9]+)*/g;
const NEGATIONS = new Set(NEGATION_WORDS);

export function tokenize(text) {
  return String(text).toLowerCase().replace(/[\u2018\u2019]/g, "'").match(WORD_PATTERN) ?? [];
}

function isNegated(words, start) {
  for (let offset = 1; offset <= NEGATION_WINDOW; offset += 1) {
    if (NEGATIONS.has(words[start - offset])) {
      return true;
    }
  }
  return false;
}

function phraseAt(words, phrase, start) {
  return phrase.every((word, offset) => words[start + offset] === word);
}

export function triggerHits(words, trigger) {
  const phrase = tokenize(trigger);
  if (phrase.length === 0) {
    return false;
  }
  for (let start = 0; start + phrase.length <= words.length; start += 1) {
    if (phraseAt(words, phrase, start) && !isNegated(words, start)) {
      return true;
    }
  }
  return false;
}

export function matchTriggers(text, avatars) {
  const words = tokenize(text);
  return avatars
    .map((avatar) => {
      const hits = avatar.triggers.filter((trigger) => triggerHits(words, trigger));
      const longest = Math.max(0, ...hits.map((hit) => hit.length));
      return { id: avatar.id, name: avatar.name, hits, score: hits.length, longest };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.longest - a.longest);
}
