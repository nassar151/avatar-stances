import { clear, el } from "./dom.js";

export function mountPhraseList(root, { ariaLabel }) {
  let items = [];
  let onChange = () => {};

  const list = el("ul", { className: "phraseList", "aria-label": ariaLabel });
  const input = el("input", {
    className: "phraseInput",
    type: "text",
    autocomplete: "off",
    spellcheck: "false",
  });
  input.setAttribute("aria-label", `Add ${ariaLabel}`);

  const addButton = el("button", {
    className: "ghostButton",
    type: "button",
    text: "Add",
  });

  const row = el("div", { className: "phraseComposer" }, [input, addButton]);
  root.append(list, row);

  function emit() {
    onChange([...items]);
  }

  function addPhrase() {
    const next = input.value.trim();
    if (next.length === 0) {
      return;
    }
    if (items.includes(next)) {
      input.value = "";
      return;
    }
    items = [...items, next];
    input.value = "";
    render();
    emit();
    input.focus();
  }

  function removeAt(index) {
    items = items.filter((_, itemIndex) => itemIndex !== index);
    render();
    emit();
  }

  function render() {
    clear(list);
    items.forEach((phrase, index) => {
      const remove = el("button", {
        className: "phraseRemove",
        type: "button",
        text: "Remove",
        onClick: () => removeAt(index),
      });
      remove.setAttribute("aria-label", `Remove ${phrase}`);
      list.append(
        el("li", { className: "phraseChip" }, [
          el("span", { text: phrase }),
          remove,
        ]),
      );
    });
  }

  addButton.addEventListener("click", addPhrase);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addPhrase();
    }
  });

  return {
    setItems(nextItems) {
      items = Array.isArray(nextItems) ? [...nextItems] : [];
      render();
    },
    getItems() {
      return [...items];
    },
    setOnChange(handler) {
      onChange = handler;
    },
  };
}
