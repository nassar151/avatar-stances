export function encodeMessage(message) {
  return Buffer.from(`${JSON.stringify(message)}\n`, "utf8");
}

export function createMessageReader(onMessage) {
  let buffer = Buffer.alloc(0);

  return {
    push(chunk) {
      buffer = Buffer.concat([buffer, chunk]);
      consume();
    },
  };

  function consume() {
    while (buffer.length > 0) {
      const newline = buffer.indexOf(0x0a);
      if (newline === -1) {
        return;
      }
      const line = buffer.subarray(0, newline).toString("utf8").replace(/\r$/, "").trim();
      buffer = buffer.subarray(newline + 1);
      if (line.length === 0) {
        continue;
      }
      try {
        onMessage({ message: JSON.parse(line) });
      } catch {
        onMessage({ error: "Invalid JSON" });
      }
    }
  }
}
