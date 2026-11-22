export const API_AVATARS = "/api/avatars";

export const INTENSITY_MIN = 0;
export const INTENSITY_MAX = 1;
export const INTENSITY_STEP = 0.05;
export const INTENSITY_DEFAULT = 0.7;
export const INTENSITY_TINT_MAX = 0.45;
export const INTENSITY_LEAN_MAX = 0.75;

export const BAND_TINT = "tint";
export const BAND_LEAN = "lean";
export const BAND_INHABIT = "inhabit";

export const BAND_COPY = {
  [BAND_TINT]: "Tint — flavor the answer",
  [BAND_LEAN]: "Lean — let the stance lead",
  [BAND_INHABIT]: "Inhabit — answer as this avatar",
};

export const PLACEHOLDER_TRIGGER = "when to use this";

export const NEW_AVATAR = {
  name: "New stance",
  tagline: "",
  lens: "",
  voice: "",
  cares: [],
  ignores: [],
  triggers: [PLACEHOLDER_TRIGGER],
  needs: [],
  format: "",
  intensity: INTENSITY_DEFAULT,
};

export const NEW_CHILD_AVATAR = {
  ...NEW_AVATAR,
  name: "New specialist",
};

export const LIST_NEW_LABEL = "New";
export const LIST_ADD_CHILD_LABEL = "Add child";
export const LIST_EXPANDED_MARK = "▾";
export const LIST_COLLAPSED_MARK = "▸";
export const LIST_NOTE =
  "Click a generic to open its children, click again to close. A child answers with both its fields and the generic's.";
export const ROLE_GENERIC = "Generic avatar";
export const ROLE_CHILD_PREFIX = "Child of ";
export const INHERIT_KICKER = "Also from parent";
export const INHERIT_HELP =
  "The assistant applies these together with this child's own lens, voice, cares, and ignores.";
export const INHERIT_LENS = "Lens";
export const INHERIT_VOICE = "Voice";
export const INHERIT_CARES = "Cares";
export const INHERIT_IGNORES = "Ignores";
export const INHERIT_EMPTY = "—";
export const INHERIT_NEEDS = "Needs to know";
export const INHERIT_FORMAT = "Format (used only if this child has none)";
export const NEEDS_KICKER = "Before answering";
export const NEEDS_TITLE = "Needs to know";
export const NEEDS_HELP =
  "Facts the answer depends on. If the user did not give one that matters, the assistant asks one short question first and does not guess.";
export const FORMAT_LABEL = "Format";
export const FORMAT_PLACEHOLDER = "Order of sections, lists vs prose, code blocks, length";

export const MSG_LOAD_FAILED = "Could not load avatars.";
export const MSG_SAVE_FAILED = "Could not save this avatar.";
export const MSG_CREATE_FAILED = "Could not create an avatar.";
export const MSG_DELETE_FAILED = "Could not delete this avatar.";
export const MSG_NEED_TRIGGER = "Add at least one trigger. Triggers are how the assistant finds this avatar.";
export const MSG_NEED_NAME = "Name is required.";
export const MSG_SAVED = "Saved.";
export const MSG_CREATED = "Created.";
export const MSG_CREATED_CHILD = "Created a child avatar.";
export const MSG_DELETED = "Deleted.";
export const MSG_DELETE_CONFIRM = "Click again to delete this avatar.";
export const MSG_DELETE_GENERIC_CONFIRM =
  "Click again to delete this generic and its children.";
