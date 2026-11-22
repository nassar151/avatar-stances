import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const MIME_BY_EXT = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function mimeFor(filePath) {
  return MIME_BY_EXT[extname(filePath)] ?? "application/octet-stream";
}

export function resolvePublicFile(webRoot, urlPath) {
  const requested = urlPath === "/" ? "/index.html" : urlPath;
  const decoded = decodeURIComponent(requested.split("?")[0]);
  const resolved = resolve(join(webRoot, decoded));
  const root = resolve(webRoot);
  if (!resolved.startsWith(root)) {
    return null;
  }
  return resolved;
}

export function sendFile(res, filePath) {
  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    return false;
  }
  if (!stat.isFile()) {
    return false;
  }

  res.writeHead(200, {
    "content-type": mimeFor(filePath),
    "content-length": stat.size,
  });
  createReadStream(filePath).pipe(res);
  return true;
}

export function normalizePathname(url) {
  const pathname = new URL(url, "http://127.0.0.1").pathname;
  return normalize(pathname);
}
