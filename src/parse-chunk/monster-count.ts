
import patterns, {
  LineBreakPattern,
  IndentationPattern
} from '../pattern';

import {
  ParseError
} from '../parse-error';

import defaultTypeParsers, {
  TypeParserKey,
  CustomTypeParsers
} from '../type-parser';

import {
  ParsedResultObject
} from '../parsed-result';

export type MonsterCountTypeParserKey = Extract<TypeParserKey, 'count'>;

export type MonsterCountTypeParsers = CustomTypeParsers<
  MonsterCountTypeParserKey
>;

export type ParsedMonsterCountModel = {
  count: 'count',
  name: 'raw'
};

export type ParsedMonsterCountData<
  TypeParsers extends MonsterCountTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedMonsterCountModel>;

export type ParsedMonsterCount <
  TypeParsers extends MonsterCountTypeParsers = {}
> = Readonly<{
  length: number,
  hasNext: boolean,
  data: ParsedMonsterCountData<TypeParsers>
}>;

export class ParseMonsterCountError extends ParseError {
  name = 'ParseMonsterCountHeaderError'
}

const parseMonsterCount = function <
  OptionalTypeParsers extends MonsterCountTypeParsers
>(
  content: string,
  lineBreakPattern: LineBreakPattern,
  indentationPattern: IndentationPattern,
  customTypeParsers?: OptionalTypeParsers
) {
  const typeParsers = {
    ...defaultTypeParsers,
    ...customTypeParsers
  };

  const pattern = [
    `^(${patterns.count}) (${patterns.monsterName})`,
    `(${indentationPattern})?`
  ].join(lineBreakPattern);

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParseMonsterCountError('Could not parse monster count');
  }

  const [
    matchedText,
    countText,
    name,
    hasNextText
  ] = matched;

  return Object.freeze({
    length: matchedText.length,
    hasNext: defaultTypeParsers.boolean(hasNextText),
    data: Object.freeze({
      count: typeParsers.count(countText),
      name
    })
  }) as ParsedMonsterCount<OptionalTypeParsers>;
};

export default parseMonsterCount;
