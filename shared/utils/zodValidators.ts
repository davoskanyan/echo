function inObjectKeys(object: Record<string, unknown>) {
  const isValid = (key: unknown) =>
    object.hasOwnProperty(key as string | number | symbol);
  const errorMessage = `Value must be one of: ${Object.keys(object).join(', ')}`;

  return [isValid, errorMessage] as const;
}

function inObjectValues(object: Record<string, unknown>) {
  const isValid = (value: unknown) =>
    Object.values(object).some((v) => v === value);
  const errorMessage = `Value must be one of: ${Object.values(object).join(', ')}`;

  return [isValid, errorMessage] as const;
}

export const zodValidators = {
  inObjectKeys,
  inObjectValues,
};
