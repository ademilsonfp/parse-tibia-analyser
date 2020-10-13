
/**
 * Regular expression pattern for allowed date and time data.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const PATTERN = '\\d{4}-\\d{2}-\\d{2}, \\d{2}:\\d{2}:\\d{2}';

/**
 * Converts a `string` of a game formatted date and time into `Date`.
 *
 * @param value A valid game date and time.
 * @returns Proper and operable `Date` value.
 */
export function parse(value: string): Date {
  return new Date(value);
}

/**
 * Converts a language `Date` into a game formatted `string`.
 *
 * @param value A valid `Date`.
 * @returns The game formatted date and time.
 */
export function format(value: Date): string {
  const year = value.getFullYear().toString();
  const month = (1 + value.getMonth()).toString();
  const day = value.getDate().toString();
  const hours = value.getHours().toString();
  const minutes = value.getMinutes().toString();
  const seconds = value.getSeconds().toString();

  return [
    [
      '0000'.slice(0, 4 - year.length) + year,
      '00'.slice(0, 2 - month.length) + month,
      '00'.slice(0, 2 - day.length) + day
    ].join('-'),
    [
      '00'.slice(0, 2 - hours.length) + hours,
      '00'.slice(0, 2 - minutes.length) + minutes,
      '00'.slice(0, 2 - seconds.length) + seconds
    ].join(':')
  ].join(', ');
}
