import { INTENSITY_INHABIT_DEFAULT } from "../../lib/constants.mjs";

export function generic(id, name, fields, children) {
  const childRows = children.map(([childId, childName, childFields]) => ({
    id: childId,
    parentId: id,
    name: childName,
    intensity: INTENSITY_INHABIT_DEFAULT,
    ...childFields,
  }));
  const specialtyTriggers = childRows.map((row) => row.name.toLowerCase());

  return [
    {
      id,
      parentId: null,
      name,
      intensity: INTENSITY_INHABIT_DEFAULT,
      ...fields,
      triggers: [...new Set([...fields.triggers, ...specialtyTriggers])],
    },
    ...childRows,
  ];
}
