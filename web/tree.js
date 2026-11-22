export function findInTree(avatars, id) {
  for (const generic of avatars) {
    if (generic.id === id) {
      return generic;
    }
    const child = (generic.children ?? []).find((item) => item.id === id);
    if (child) {
      return {
        ...child,
        parentName: generic.name,
        parent: {
          id: generic.id,
          name: generic.name,
          lens: generic.lens,
          voice: generic.voice,
          cares: generic.cares,
          ignores: generic.ignores,
          needs: generic.needs,
          format: generic.format,
          intensity: generic.intensity,
        },
      };
    }
  }
  return null;
}

export function insertCreated(avatars, created) {
  if (!created.parentId) {
    return [...avatars, { ...created, children: [] }].sort((a, b) => a.name.localeCompare(b.name));
  }
  return avatars.map((generic) => {
    if (generic.id !== created.parentId) {
      return generic;
    }
    const children = [...(generic.children ?? []), created].sort((a, b) => a.name.localeCompare(b.name));
    return { ...generic, children };
  });
}

export function replaceInTree(avatars, saved) {
  if (!saved.parentId) {
    return avatars
      .map((generic) => (generic.id === saved.id ? { ...saved, children: generic.children ?? [] } : generic))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  return avatars.map((generic) => {
    if (generic.id !== saved.parentId) {
      return generic;
    }
    const children = (generic.children ?? [])
      .map((child) => (child.id === saved.id ? saved : child))
      .sort((a, b) => a.name.localeCompare(b.name));
    return { ...generic, children };
  });
}

export function removeFromTree(avatars, id) {
  const withoutGeneric = avatars.filter((generic) => generic.id !== id);
  if (withoutGeneric.length !== avatars.length) {
    return withoutGeneric;
  }
  return avatars.map((generic) => ({
    ...generic,
    children: (generic.children ?? []).filter((child) => child.id !== id),
  }));
}

export function firstId(avatars) {
  return avatars[0]?.id ?? null;
}
