
/**
 * Regular expression pattern for indentation character or sequence.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const PATTERN = '(?:\\t| {2}| {4}| {8})';
