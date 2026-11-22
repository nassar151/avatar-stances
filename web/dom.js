export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === false || value === null || value === undefined) {
      continue;
    }
    if (key === "className") {
      node.className = value;
      continue;
    }
    if (key === "text") {
      node.textContent = value;
      continue;
    }
    if (key === "dataset") {
      Object.assign(node.dataset, value);
      continue;
    }
    if (key.startsWith("on") && typeof value === "function") {
      node.addEventListener(key.slice(2).toLowerCase(), value);
      continue;
    }
    node.setAttribute(key, String(value));
  }

  for (const child of children) {
    if (child) {
      node.append(child);
    }
  }

  return node;
}

export function clear(node) {
  node.replaceChildren();
}
