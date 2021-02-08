
export type LineBreakType = 'unix' | 'dos' | 'mac';
export type IndentationType = 'tab' | '2-spaces' | '4-spaces' | '8-spaces';
export type LootType = 'market' | 'leader';

const DEFAULT_TYPE_PARSERS = Object.freeze({
  lineBreak (value: string) {
    return {
      '\n': 'unix',
      '\r\n': 'dos',
      '\r': 'mac'
    }[value] as LineBreakType;
  },

  indentation (value: string) {
    return {
      '\t': 'tab',
      '  ': '2-spaces',
      '    ': '4-spaces',
      '        ': '8-spaces'
    }[value] as IndentationType;
  },

  boolean (value: string) {
    return Boolean(value);
  },

  integer (value: string) {
    return parseInt(value.replace(',', ''));
  },

  dateTime (value: string) {
    return new Date(value).getTime();
  },

  duration (value: string) {
    const hours = parseInt(value.slice(0, 2));
    const minutes = parseInt(value.slice(3, 5));

    return hours * 3600000 + minutes * 60000;
  },

  lootType (value: string) {
    return value.toLowerCase() as LootType;
  },

  count (value: string) {
    return parseInt(value.slice(0, -1));
  },

  indefiniteArticle (value: string) {
    return value.trimEnd() || null;
  }
});

export default DEFAULT_TYPE_PARSERS;

export type DefaultTypeParsers = typeof DEFAULT_TYPE_PARSERS;
export type TypeParserKey = keyof DefaultTypeParsers;

export type CustomTypeParser<ParsedValue = unknown> = {
  (value: string): ParsedValue
};

export type CustomTypeParsers<
  TypeKey extends TypeParserKey = TypeParserKey,
  ParsedValue = unknown
> = Partial<Readonly<{
  [Key in TypeKey]: CustomTypeParser<ParsedValue>
}>>;

export type BasicKnownParsedValue = (
  boolean |
  number |
  string |
  object
);

/**
 * Can be overwritten by dependant projects.
 */
export type KnownParsedValue = BasicKnownParsedValue;
