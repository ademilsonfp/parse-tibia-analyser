
import patterns, {
  IndentationPattern,
  LineBreakPattern
} from '../pattern';

import {
  ParseError
} from '../parse-error';

import defaultTypeParsers, {
  TypeParserKey,
  CustomTypeParsers,
  IndentationType
} from '../type-parser';

import {
  ParsedResultObject
} from '../parsed-result';

export type PlayerSummaryTypeParserKey = Extract<TypeParserKey,
  'indentation' |
  'boolean' |
  'integer'
>;

export type PlayerSummaryTypeParsers = CustomTypeParsers<
  PlayerSummaryTypeParserKey
>;

export type ParsedPlayerSummaryModel = {
  indentation: 'indentation',
  name: 'raw',
  leader: 'boolean',
  loot: 'integer',
  supplies: 'integer',
  balance: 'integer',
  damage: 'integer',
  healing: 'integer'
};

export type ParsedPlayerSummaryData<
  TypeParsers extends PlayerSummaryTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedPlayerSummaryModel>;

export type ParsedPlayerSummary<
  TypeParsers extends PlayerSummaryTypeParsers = {}
> = Readonly<{
  hasNext: boolean,
  length: number,
  indentationType: IndentationType,
  data: ParsedPlayerSummaryData<TypeParsers>
}>;

export class ParsePlayerSummaryError extends ParseError {
  name = 'ParsePlayerSummaryError';
}

const parsePlayerSummary = function <
  OptionalTypeParsers extends PlayerSummaryTypeParsers
>(
  content: string,
  lineBreakPattern: LineBreakPattern,
  indentationPattern: IndentationPattern | null,
  customTypeParsers?: OptionalTypeParsers
) {
  if (!indentationPattern) {
    indentationPattern = patterns.indentation as IndentationPattern;
  }

  const typeParsers = {
    ...defaultTypeParsers,
    ...customTypeParsers
  };

  const titlePattern = [
    `^(${patterns.playerName})(${patterns.leaderBadge})${lineBreakPattern}`,
    `(${indentationPattern})`
  ].join('');

  const summaryPatternChunks = [
    `Loot: (${patterns.integer})`,
    `Supplies: (${patterns.integer})`,
    `Balance: (${patterns.integer})`,
    `Damage: (${patterns.integer})`,
    `Healing: (${patterns.integer})(${lineBreakPattern}|$)`
  ];

  const pattern = ( [titlePattern + summaryPatternChunks[0]]
    .concat(summaryPatternChunks.slice(1))
    .join(`${lineBreakPattern}\\3`)
  );

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParsePlayerSummaryError('Could not parse player summary');
  }

  const [
    matchedText,
    name,
    leaderText,
    indentationText,
    lootText,
    suppliesText,
    balanceText,
    damageText,
    healingText,
    hasNextText
  ] = matched;

  return Object.freeze({
    length: matchedText.length,
    hasNext: defaultTypeParsers.boolean(hasNextText),
    indentationType: defaultTypeParsers.indentation(indentationText),
    data: Object.freeze({
      indentation: typeParsers.indentation(indentationText),
      name,
      leader: typeParsers.boolean(leaderText),
      loot: typeParsers.integer(lootText),
      supplies: typeParsers.integer(suppliesText),
      balance: typeParsers.integer(balanceText),
      damage: typeParsers.integer(damageText),
      healing: typeParsers.integer(healingText)
    })
  }) as ParsedPlayerSummary<OptionalTypeParsers>;
};

export default parsePlayerSummary;
