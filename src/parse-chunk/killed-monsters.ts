
import patterns, {
  LineBreakPattern,
  indentationTypePattern
} from '../pattern';

import {
  ParseError
} from '../parse-error';

import defaultTypeParsers, {
  IndentationType,
  TypeParserKey,
  CustomTypeParsers
} from '../type-parser';

import {
  ParsedResultObject
} from '../parsed-result';

import parseMonsterCount, {
  MonsterCountTypeParserKey,
  ParsedMonsterCountData
} from './monster-count';

export type KilledMonstersTypeParserKey = MonsterCountTypeParserKey | (
  Extract<TypeParserKey, 'indentation'>
);

export type KilledMonstersTypeParsers = CustomTypeParsers<
  KilledMonstersTypeParserKey
>;

export type ParsedKilledMonstersModel = {
  indentation: 'indentation',
  killedMonsters: {
    [name: string]: 'count'
  }
};

export type ParsedKilledMonstersData<
  TypeParsers extends KilledMonstersTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedKilledMonstersModel>;

export type ParsedKilledMonsters<
  TypeParsers extends KilledMonstersTypeParsers = {}
> = Readonly<{
  length: number,
  indentationType: IndentationType,
  data: ParsedKilledMonstersData<TypeParsers>
}>;

export class ParseKilledMonstersError extends ParseError {
  name = 'ParseKilledMonstersError';
}

export class DuplicatedKilledMonsterError extends ParseKilledMonstersError {
  name = 'DuplicatedKilledMonsterError';
}

const parseKilledMonsters = function <
  OptionalTypeParsers extends KilledMonstersTypeParsers
>(
  content: string,
  lineBreakPattern: LineBreakPattern,
  customTypeParsers?: OptionalTypeParsers
) {
  const typeParsers = {
    ...defaultTypeParsers,
    ...customTypeParsers
  };

  const pattern = [
    `^Killed Monsters:`,
    `(${patterns.indentation})`
  ].join(lineBreakPattern);

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParseKilledMonstersError('Could not parse killed monsters');
  }

  const [
    matchedText,
    indentationText
  ] = matched;

  const indentationType = defaultTypeParsers.indentation(indentationText);
  const indentationPattern = indentationTypePattern(indentationType);
  const killedMonsters = {};

  var hasNext = true;
  var length = matchedText.length;
  var fullLength = matchedText.length;
  var data: ParsedMonsterCountData<OptionalTypeParsers>;

  while (hasNext) {
    content = content.slice(length);

    ({ hasNext, length, data } = parseMonsterCount(
      content,
      lineBreakPattern,
      indentationPattern,
      customTypeParsers
    ));

    fullLength += length;

    if (killedMonsters[data.name]) {
      throw new DuplicatedKilledMonsterError(
        `Duplicated killed monster ${data.name}`
      );
    }

    killedMonsters[data.name] = data.count;
  }

  return Object.freeze({
    length: fullLength,
    indentationType,
    data: Object.freeze({
      indentation: typeParsers.indentation(indentationText),
      killedMonsters: Object.freeze(killedMonsters)
    })
  }) as ParsedKilledMonsters<OptionalTypeParsers>;
};

export default parseKilledMonsters;
