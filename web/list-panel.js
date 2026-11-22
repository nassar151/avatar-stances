import {
  LIST_ADD_CHILD_LABEL,
  LIST_COLLAPSED_MARK,
  LIST_EXPANDED_MARK,
  LIST_NEW_LABEL,
  LIST_NOTE,
} from "./constants.js";
import { clear, el } from "./dom.js";

function itemButton({ avatar, selectedId, onClick, className, leading }) {
  const isSelected = avatar.id === selectedId;
  const button = el("button", {
    className: isSelected ? `${className} isSelected` : className,
    type: "button",
    onClick,
  }, [
    el("span", { className: "avatarItemName" }, [leading, avatar.name]),
    el("span", { className: "avatarItemTag", text: avatar.tagline || "No tagline" }),
  ]);
  if (isSelected) {
    button.setAttribute("aria-current", "true");
  }
  return button;
}

function renderChildren({ avatar, children, selectedId, onSelect, onCreateChild }) {
  const childList = el("ul", { className: "childList", "aria-label": `${avatar.name} specialists` });
  children.forEach((child) => {
    childList.append(el("li", {}, [
      itemButton({
        avatar: child,
        selectedId,
        onClick: () => onSelect(child.id),
        className: "avatarItem childItem",
      }),
    ]));
  });
  return [
    childList,
    el("button", {
      className: "ghostButton addChildButton",
      type: "button",
      text: LIST_ADD_CHILD_LABEL,
      onClick: () => {
        void onCreateChild(avatar.id);
      },
    }),
  ];
}

export function renderList(root, {
  avatars,
  selectedId,
  expandedIds,
  onSelect,
  onToggleGeneric,
  onCreate,
  onCreateChild,
}) {
  clear(root);

  const heading = el("div", { className: "listHead" }, [
    el("h2", { text: "Avatars" }),
    el("button", {
      className: "ghostButton",
      type: "button",
      text: LIST_NEW_LABEL,
      onClick: () => {
        void onCreate();
      },
    }),
  ]);

  const note = el("p", {
    className: "listNote",
    text: LIST_NOTE,
  });

  const list = el("ul", { className: "avatarList", "aria-label": "Generic avatars" });

  avatars.forEach((avatar) => {
    const children = Array.isArray(avatar.children) ? avatar.children : [];
    const isExpanded = expandedIds.has(avatar.id);
    const genericButton = itemButton({
      avatar,
      selectedId,
      onClick: () => onToggleGeneric(avatar.id),
      className: "avatarItem",
      leading: el("span", {
        className: "expandMark",
        text: isExpanded ? LIST_EXPANDED_MARK : LIST_COLLAPSED_MARK,
        "aria-hidden": "true",
      }),
    });
    genericButton.setAttribute("aria-expanded", String(isExpanded));

    list.append(el("li", { className: "genericGroup" }, [
      genericButton,
      ...(isExpanded
        ? renderChildren({ avatar, children, selectedId, onSelect, onCreateChild })
        : []),
    ]));
  });

  root.append(heading, note, list);
}
