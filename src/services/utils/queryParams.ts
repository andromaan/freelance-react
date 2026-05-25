/**
 * Перетворює об'єкт фільтра в URLSearchParams.
 * - Пропускає undefined / null / ''
 * - Масиви → append для кожного елемента
 * - camelCase ключі → PascalCase (для C# API)
 */
export function buildQueryParams<T extends Record<string, any>>(
  filter: T,
): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    // camelCase → PascalCase: pageSize → PageSize
    const paramKey = key.charAt(0).toUpperCase() + key.slice(1);

    if (Array.isArray(value)) {
      value.forEach((v) => params.append(paramKey, String(v)));
    } else {
      params.set(paramKey, String(value));
    }
  });

  return params;
}
