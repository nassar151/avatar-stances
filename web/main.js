import {
  MSG_CREATE_FAILED,
  MSG_CREATED,
  MSG_CREATED_CHILD,
  MSG_DELETE_FAILED,
  MSG_DELETED,
  MSG_LOAD_FAILED,
  MSG_SAVE_FAILED,
  MSG_SAVED,
  NEW_AVATAR,
  NEW_CHILD_AVATAR,
} from "./constants.js";
import { createAvatar, deleteAvatar, fetchAvatars, updateAvatar } from "./api.js";
import { mountEditor } from "./editor-panel.js";
import { renderList } from "./list-panel.js";
import { findInTree, firstId, insertCreated, removeFromTree, replaceInTree } from "./tree.js";

const listRoot = document.getElementById("listRoot");
const editorRoot = document.getElementById("editorRoot");

const state = {
  avatars: [],
  selectedId: null,
  expandedIds: new Set(),
  loadedEditorId: null,
  loadController: null,
};

const editor = mountEditor(editorRoot, {
  onSave: handleSave,
  onDelete: handleDelete,
});

function selectedAvatar() {
  return findInTree(state.avatars, state.selectedId);
}

function paint({ reloadEditor } = { reloadEditor: false }) {
  renderList(listRoot, {
    avatars: state.avatars,
    selectedId: state.selectedId,
    expandedIds: state.expandedIds,
    onSelect: handleSelect,
    onToggleGeneric: handleToggleGeneric,
    onCreate: handleCreate,
    onCreateChild: handleCreateChild,
  });

  const selected = selectedAvatar();
  const selectedId = selected?.id ?? null;
  if (reloadEditor || selectedId !== state.loadedEditorId) {
    editor.load(selected);
    state.loadedEditorId = selectedId;
  }
}

async function loadAvatars({ keepSelection } = { keepSelection: false }) {
  state.loadController?.abort();
  const controller = new AbortController();
  state.loadController = controller;

  try {
    const avatars = await fetchAvatars(controller.signal);
    if (controller.signal.aborted) {
      return;
    }
    state.avatars = avatars;
    const stillThere = Boolean(findInTree(avatars, state.selectedId));
    if (!keepSelection || !stillThere) {
      state.selectedId = firstId(avatars);
    }
    paint({ reloadEditor: !keepSelection });
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    editor.setStatus(MSG_LOAD_FAILED);
  }
}

function handleSelect(id) {
  state.selectedId = id;
  paint({ reloadEditor: true });
}

function handleToggleGeneric(id) {
  const next = new Set(state.expandedIds);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  state.expandedIds = next;
  state.selectedId = id;
  paint({ reloadEditor: true });
}

function expandParentOf(avatar) {
  if (avatar?.parentId && !state.expandedIds.has(avatar.parentId)) {
    state.expandedIds = new Set(state.expandedIds).add(avatar.parentId);
  }
}

async function handleCreate() {
  try {
    const created = await createAvatar({ ...NEW_AVATAR });
    state.avatars = insertCreated(state.avatars, created);
    state.selectedId = created.id;
    paint({ reloadEditor: true });
    editor.setStatus(MSG_CREATED);
  } catch {
    editor.setStatus(MSG_CREATE_FAILED);
  }
}

async function handleCreateChild(parentId) {
  try {
    const created = await createAvatar({ ...NEW_CHILD_AVATAR, parentId });
    state.avatars = insertCreated(state.avatars, created);
    state.selectedId = created.id;
    expandParentOf(created);
    paint({ reloadEditor: true });
    editor.setStatus(MSG_CREATED_CHILD);
  } catch {
    editor.setStatus(MSG_CREATE_FAILED);
  }
}

async function handleSave(id, payload) {
  try {
    const saved = await updateAvatar(id, payload);
    state.avatars = replaceInTree(state.avatars, saved);
    state.selectedId = saved.id;
    expandParentOf(saved);
    paint({ reloadEditor: true });
    editor.setStatus(MSG_SAVED);
  } catch {
    editor.setStatus(MSG_SAVE_FAILED);
  }
}

async function handleDelete(id) {
  try {
    await deleteAvatar(id);
    state.avatars = removeFromTree(state.avatars, id);
    state.selectedId = firstId(state.avatars);
    paint({ reloadEditor: true });
    editor.setStatus(MSG_DELETED);
  } catch {
    editor.setStatus(MSG_DELETE_FAILED);
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    void loadAvatars({ keepSelection: true });
  }
});

void loadAvatars({ keepSelection: false });
