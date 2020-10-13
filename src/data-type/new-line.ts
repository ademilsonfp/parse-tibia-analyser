
/**
 * Regular expression pattern for UNIX new line character.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const UNIX_PATTERN = '\\n';

/**
 * Regular expression pattern for MAC new line character.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const MAC_PATTERN = '\\r';

/**
 * Regular expression pattern for WINDOWS new line sequence.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const WIN_PATTERN = '\\r\\n';

/**
 * Regular expression pattern for new line character or sequence.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const PATTERN = `(?:${UNIX_PATTERN}|${MAC_PATTERN}|${WIN_PATTERN})`;

/**
 * UNIX new line character.
 */
export const UNIX_VALUE = '\n';

/**
 * MAC new line character.
 */
export const MAC_VALUE = '\r';

/**
 * WINDOWS new line sequence.
 */
export const WIN_VALUE = '\r\n';

/**
 * Type for UNIX new line character pattern.
 */
export type UnixPattern = typeof UNIX_PATTERN;

/**
 * Type for MAC new line character pattern.
 */
export type MacPattern = typeof MAC_PATTERN;

/**
 * Type for WINDOWS new line sequence pattern.
 */
export type WinPattern = typeof WIN_PATTERN;

/**
 * Type union of all allowed new line pattern types.
 */
export type SinglePattern = UnixPattern | MacPattern | WinPattern;

/**
 * Type for UNIX new line character constant.
 */
export type UnixValue = typeof UNIX_VALUE;

/**
 * Type for MAC new line character constant.
 */
export type MacValue = typeof MAC_VALUE;

/**
 * Type for WINDOWS new line sequence constant.
 */
export type WinValue = typeof WIN_VALUE;

/**
 * Type union for all allowed new line characters or sequence.
 */
export type Value = UnixValue | MacValue | WinValue;

/**
 * Obtains the properly regular expression pattern for a matched new line
 * value that can be wrapped in a complex regular expression sequence.
 *
 * @param newLine Single new line value.
 *
 * @returns A single regular expression pattern for new line based upon a
 *          matched value.
 */
export function pattern(newLine: UnixValue): UnixPattern;
export function pattern(newLine: MacValue): MacPattern;
export function pattern(newLine: WinValue): WinPattern;
export function pattern(newLine: any): never;
export function pattern(newLine: Value) {
  var pattern: SinglePattern;

  switch (newLine) {
    case UNIX_VALUE:
      pattern = UNIX_PATTERN;
      break;

    case MAC_VALUE:
      pattern = MAC_PATTERN;
      break;

    case WIN_VALUE:
      pattern = WIN_PATTERN;
      break;

    default:
      throw new Error('Invalid new line value');
  }

  return pattern;
}
