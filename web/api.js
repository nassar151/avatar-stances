import { API_AVATARS } from "./constants.js";

async function parseResponse(response) {
  const raw = await response.text();
  let body = null;
  if (raw.length > 0) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = { error: "Invalid JSON from server" };
    }
  }
  if (!response.ok) {
    const message = body?.error ?? body?.errors?.join("; ") ?? `Request failed (${response.status})`;
    throw new Error(message);
  }
  return body;
}

export async function fetchAvatars(signal) {
  const response = await fetch(API_AVATARS, { signal });
  return parseResponse(response);
}

export async function createAvatar(payload) {
  const response = await fetch(API_AVATARS, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function updateAvatar(id, payload) {
  const response = await fetch(`${API_AVATARS}/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
}

export async function deleteAvatar(id) {
  const response = await fetch(`${API_AVATARS}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return parseResponse(response);
}
