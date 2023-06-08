export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function includesIgnoreDiacritics(str: string, search: string) {
  const strWithoutDiacritics = removeDiacritics(str);

  const searchWithoutDiacritics = removeDiacritics(search);

  return strWithoutDiacritics
    .toLowerCase()
    .includes(searchWithoutDiacritics.toLowerCase());
}
