function convertObjectKeysFromSnakeToCamelCase(
  obj: Record<string, any>
): Record<string, any> {
  const camelObj: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/(_\w)/g, (match) => match[1].toUpperCase());
    camelObj[camelKey] = value;
  }
  return camelObj;
}

export const convertObjectListKeysFromSnakeToCamelCase = (
  list: Record<string, any>[]
) => {
  return list.map((obj) => convertObjectKeysFromSnakeToCamelCase(obj));
};

export default convertObjectKeysFromSnakeToCamelCase;
