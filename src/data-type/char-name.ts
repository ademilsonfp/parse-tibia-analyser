
/**
 * Regular expression pattern for allowed character name.
 *
 * It should be wrapped in a complex regular expression sequence, so can not
 * have capturing groups, start flag or end flag.
 */
export const PATTERN = '[A-Z][a-z]+(?: [A-Z]?[a-z]+)*';
