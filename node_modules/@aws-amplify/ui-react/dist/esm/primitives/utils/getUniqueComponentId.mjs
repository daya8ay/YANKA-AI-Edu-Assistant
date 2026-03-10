const getUniqueComponentId = (id, suffix) => (id && suffix ? `${id}-${suffix}` : undefined);

export { getUniqueComponentId };
