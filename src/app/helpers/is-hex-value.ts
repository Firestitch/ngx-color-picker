export function isHexValue(value: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  return !!value.match(hexRegex);
}
