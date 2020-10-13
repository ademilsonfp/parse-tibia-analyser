
/**
 * Regular expression pattern for indentation character or sequence.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const PATTERN = `\\d{2}:\\d{2}h`;

/**
 * Maximum allowed duration constant in milliseconds.
 */
export const MAX_SAFE_DURATION = 359940000;

/**
 * Converts a `string` of a game formatted duration into milliseconds `number`.
 *
 * @param value A game formatted duration, limited to `99:59h`.
 * @returns The duration converted into milliseconds.
 */
export function parse(value: string): number {
  const hours = parseInt(value.slice(0, 2));
  const minutes = parseInt(value.slice(3, 5));

  return hours * 3600000 + minutes * 60000;
}

/**
 * Converts a milliseconds duration `number` into a game formatted duration
 * `string`.
 *
 * @param milliseconds A `number` integer of milliseconds duration limited to
 *                     `359940000`.
 *
 * @returns The game formatted duration.
 */
export function format(milliseconds: number): string {
  const hourMs = 3600000;

  var hours = Math.floor(milliseconds / hourMs).toString();
  var minutes = Math.floor((milliseconds % hourMs) / 60000).toString();

  hours = '00'.slice(0, 2 - hours.length) + hours;
  minutes = '00'.slice(0, 2 - minutes.length) + minutes;

  return `${hours}:${minutes}h`;
}
