import {
  BAND_COPY,
  INHERIT_CARES,
  INHERIT_HELP,
  INHERIT_IGNORES,
  INHERIT_KICKER,
  FORMAT_LABEL,
  FORMAT_PLACEHOLDER,
  INHERIT_EMPTY,
  INHERIT_FORMAT,
  INHERIT_LENS,
  INHERIT_NEEDS,
  INHERIT_VOICE,
  NEEDS_HELP,
  NEEDS_KICKER,
  NEEDS_TITLE,
  INTENSITY_MAX,
  INTENSITY_MIN,
  INTENSITY_STEP,
  MSG_DELETE_CONFIRM,
  MSG_DELETE_GENERIC_CONFIRM,
  MSG_NEED_NAME,
  MSG_NEED_TRIGGER,
  ROLE_CHILD_PREFIX,
  ROLE_GENERIC,
} from "./constants.js";
import { clear, el } from "./dom.js";
import { intensityBand } from "./intensity.js";
import { mountPhraseList } from "./phrase-list.js";

export function mountEditor(root, { onSave, onDelete }) {
  const nameInput = el("input", {
    className: "nameInput",
    type: "text",
    name: "name",
    required: true,
  });
  nameInput.setAttribute("aria-label", "Avatar name");

  const taglineInput = el("input", {
    className: "taglineInput",
    type: "text",
    name: "tagline",
    placeholder: "One line on what this stance is for",
  });
  taglineInput.setAttribute("aria-label", "Tagline");

  const lensInput = el("textarea", {
    className: "stackInput",
    name: "lens",
    rows: "3",
  });
  lensInput.setAttribute("aria-label", "Lens");

  const voiceInput = el("textarea", {
    className: "stackInput",
    name: "voice",
    rows: "3",
  });
  voiceInput.setAttribute("aria-label", "Voice");

  const formatInput = el("textarea", {
    className: "stackInput",
    name: "format",
    rows: "3",
    placeholder: FORMAT_PLACEHOLDER,
  });
  formatInput.setAttribute("aria-label", FORMAT_LABEL);

  const intensityInput = el("input", {
    className: "intensityRange",
    type: "range",
    min: String(INTENSITY_MIN),
    max: String(INTENSITY_MAX),
    step: String(INTENSITY_STEP),
  });
  intensityInput.setAttribute("aria-label", "Intensity");

  const intensityLabel = el("p", { className: "intensityCopy" });

  const status = el("p", { className: "editorStatus", role: "status" });
  const empty = el("p", {
    className: "emptyState",
    text: "Select an avatar, or create one.",
  });
  const kindLine = el("p", { className: "editorKind" });
  const form = el("form", { className: "editorForm" });

  const triggerMount = el("div", { className: "phraseMount" });
  const caresMount = el("div", { className: "phraseMount" });
  const ignoresMount = el("div", { className: "phraseMount" });
  const needsMount = el("div", { className: "phraseMount" });

  const triggers = mountPhraseList(triggerMount, { ariaLabel: "Triggers" });
  const cares = mountPhraseList(caresMount, { ariaLabel: "Cares" });
  const ignores = mountPhraseList(ignoresMount, { ariaLabel: "Ignores" });
  const needs = mountPhraseList(needsMount, { ariaLabel: NEEDS_TITLE });
  const inheritSection = el("section", { className: "inheritSection", hidden: true });

  const saveButton = el("button", {
    className: "primaryButton",
    type: "submit",
    text: "Save",
  });
  const deleteButton = el("button", {
    className: "dangerButton",
    type: "button",
    text: "Delete",
  });

  form.append(
    el("header", { className: "editorIdentity" }, [kindLine, nameInput, taglineInput]),
    el("section", { className: "chooseSection" }, [
      el("p", { className: "sectionKicker", text: "Choose" }),
      el("h3", { text: "Triggers" }),
      el("p", {
        className: "sectionHelp",
        text: "Generics match first. Child phrases pick a specialist after that.",
      }),
      triggerMount,
    ]),
    el("section", { className: "needsSection" }, [
      el("p", { className: "sectionKicker", text: NEEDS_KICKER }),
      el("h3", { text: NEEDS_TITLE }),
      el("p", { className: "sectionHelp", text: NEEDS_HELP }),
      needsMount,
    ]),
    el("section", { className: "answerSection" }, [
      el("p", { className: "sectionKicker", text: "Answer" }),
      el("h3", { text: "How this avatar replies" }),
      el("label", { className: "field" }, [
        el("span", { text: "Lens" }),
        lensInput,
      ]),
      el("label", { className: "field" }, [
        el("span", { text: "Voice" }),
        voiceInput,
      ]),
      el("label", { className: "field" }, [
        el("span", { text: FORMAT_LABEL }),
        formatInput,
      ]),
      el("div", { className: "twoCol" }, [
        el("div", {}, [
          el("h4", { text: "Cares" }),
          caresMount,
        ]),
        el("div", {}, [
          el("h4", { text: "Ignores" }),
          ignoresMount,
        ]),
      ]),
      el("label", { className: "field" }, [
        el("span", { text: "Intensity" }),
        intensityInput,
        intensityLabel,
      ]),
    ]),
    inheritSection,
    el("div", { className: "editorActions" }, [saveButton, deleteButton, status]),
  );

  function paintIntensity() {
    const band = intensityBand(Number(intensityInput.value));
    intensityLabel.textContent = BAND_COPY[band];
  }

  function chipList(items) {
    const list = el("ul", { className: "phraseList inheritList" });
    (items ?? []).forEach((item) => {
      list.append(el("li", { className: "phraseChip inheritChip", text: item }));
    });
    return list;
  }

  function paintInherit(avatar) {
    clear(inheritSection);
    const parent = avatar.parent;
    if (!parent) {
      inheritSection.hidden = true;
      return;
    }
    inheritSection.hidden = false;
    inheritSection.append(
      el("p", { className: "sectionKicker", text: INHERIT_KICKER }),
      el("h3", { text: parent.name }),
      el("p", { className: "sectionHelp", text: INHERIT_HELP }),
      el("label", { className: "field" }, [
        el("span", { text: INHERIT_LENS }),
        el("p", { className: "inheritCopy", text: parent.lens || INHERIT_EMPTY }),
      ]),
      el("label", { className: "field" }, [
        el("span", { text: INHERIT_VOICE }),
        el("p", { className: "inheritCopy", text: parent.voice || INHERIT_EMPTY }),
      ]),
      el("div", { className: "field" }, [
        el("span", { text: INHERIT_NEEDS }),
        chipList(parent.needs),
      ]),
      el("label", { className: "field" }, [
        el("span", { text: INHERIT_FORMAT }),
        el("p", { className: "inheritCopy", text: parent.format || INHERIT_EMPTY }),
      ]),
      el("div", { className: "twoCol" }, [
        el("div", {}, [
          el("h4", { text: INHERIT_CARES }),
          chipList(parent.cares),
        ]),
        el("div", {}, [
          el("h4", { text: INHERIT_IGNORES }),
          chipList(parent.ignores),
        ]),
      ]),
    );
  }

  intensityInput.addEventListener("input", paintIntensity);

  let currentId = null;
  let currentChildren = [];
  let pendingDelete = false;

  function setStatus(message) {
    status.textContent = message ?? "";
  }

  function showEmpty() {
    currentId = null;
    currentChildren = [];
    pendingDelete = false;
    deleteButton.textContent = "Delete";
    clear(root);
    root.append(empty);
  }

  function showForm() {
    clear(root);
    root.append(form);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    pendingDelete = false;
    deleteButton.textContent = "Delete";

    const name = nameInput.value.trim();
    const triggerItems = triggers.getItems();
    if (name.length === 0) {
      setStatus(MSG_NEED_NAME);
      return;
    }
    if (triggerItems.length === 0) {
      setStatus(MSG_NEED_TRIGGER);
      return;
    }

    void onSave(currentId, {
      name,
      tagline: taglineInput.value.trim(),
      lens: lensInput.value.trim(),
      voice: voiceInput.value.trim(),
      cares: cares.getItems(),
      ignores: ignores.getItems(),
      triggers: triggerItems,
      needs: needs.getItems(),
      format: formatInput.value.trim(),
      intensity: Number(intensityInput.value),
    });
  });

  deleteButton.addEventListener("click", () => {
    if (!pendingDelete) {
      pendingDelete = true;
      deleteButton.textContent = "Confirm delete";
      const childCount = Array.isArray(currentChildren) ? currentChildren.length : 0;
      setStatus(childCount > 0 ? MSG_DELETE_GENERIC_CONFIRM : MSG_DELETE_CONFIRM);
      return;
    }
    void onDelete(currentId);
  });

  showEmpty();

  return {
    load(avatar) {
      if (!avatar) {
        showEmpty();
        return;
      }
      currentId = avatar.id;
      currentChildren = Array.isArray(avatar.children) ? avatar.children : [];
      pendingDelete = false;
      deleteButton.textContent = "Delete";
      kindLine.textContent = avatar.parentId
        ? `${ROLE_CHILD_PREFIX}${avatar.parentName ?? "a generic avatar"}`
        : ROLE_GENERIC;
      nameInput.value = avatar.name;
      taglineInput.value = avatar.tagline ?? "";
      lensInput.value = avatar.lens ?? "";
      voiceInput.value = avatar.voice ?? "";
      formatInput.value = avatar.format ?? "";
      needs.setItems(avatar.needs);
      intensityInput.value = String(avatar.intensity);
      triggers.setItems(avatar.triggers);
      cares.setItems(avatar.cares);
      ignores.setItems(avatar.ignores);
      paintInherit(avatar);
      paintIntensity();
      setStatus("");
      showForm();
    },
    setStatus,
  };
}
