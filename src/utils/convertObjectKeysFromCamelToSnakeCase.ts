const convertObjectKeysFromCamelToSnakeCase = (obj: Record<string, any>) => {
  const snakeCaseObj: Record<string, any> = {};
  for (const key in obj) {
    const snakeCaseKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    snakeCaseObj[snakeCaseKey] = obj[key];
  }
  return snakeCaseObj;
};

export default convertObjectKeysFromCamelToSnakeCase;
