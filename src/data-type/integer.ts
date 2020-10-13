
/**
 * Regular expression pattern for allowed integer data.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const PATTERN = '-?\\d{1,3}(?:,\\d{3})*';

/**
 * Converts a `string` of a game formatted integer into `number`.
 *
 * @param value A valid game integer.
 * @returns Proper and operable `number` value.
 */
export function parse(value: string): number {
  return parseInt(value.replace(/,/g, ''));
}

/**
 * Converts a language integer into a game formatted `string`.
 *
 * @param value A valid integer `number`.
 * @returns The game formatted value.
 */
export function format(value: number): string {
  var digits = value.toString();
  var signal = '';

  if (0 > value) {
    signal = '-';
    digits = digits.slice(1);
  }

  const chunks = [];

  while (digits) {
    chunks.unshift(digits.slice(-3));
    digits = digits.slice(0, -3);
  }

  return signal + chunks.join(',');
}
