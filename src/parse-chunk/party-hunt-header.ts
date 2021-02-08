
import patterns, {
  LineBreakPattern
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

export class ParsePartyHuntHeaderError extends ParseError {
  name = 'ParsePartyHuntHeaderError'
};

export type PartyHuntHeaderTypeParserKey = Extract<TypeParserKey,
  'lootType' |
  'integer'
>;

export type PartyHuntHeaderTypeParsers = CustomTypeParsers<
  PartyHuntHeaderTypeParserKey
>;

export type ParsedPartyHuntHeaderModel = {
  lootType: 'lootType',
  loot: 'integer',
  supplies: 'integer',
  balance: 'integer'
};

export type ParsedPartyHuntHeaderData<
  TypeParsers extends PartyHuntHeaderTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedPartyHuntHeaderModel>;

export type ParsedPartyHuntHeader<
  TypeParsers extends PartyHuntHeaderTypeParsers = {}
> = Readonly<{
  length: number,
  data: ParsedPartyHuntHeaderData<TypeParsers>
}>;

const parsePartyHuntHeader = function <
  OptionalTypeParsers extends PartyHuntHeaderTypeParsers
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
    `^Loot Type: (${patterns.lootType})`,
    `Loot: (${patterns.integer})`,
    `Supplies: (${patterns.integer})`,
    `Balance: (${patterns.integer})`,
    ''
  ].join(lineBreakPattern);

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    console.log(pattern, content);
    throw new ParsePartyHuntHeaderError('Could not parse party hunt header');
  }

  const [
    matchedText,
    lootTypeText,
    lootText,
    suppliesText,
    balanceText
  ] = matched;

  return Object.freeze({
    length: matchedText.length,
    data: Object.freeze({
      lootType: typeParsers.lootType(lootTypeText),
      loot: typeParsers.integer(lootText),
      supplies: typeParsers.integer(suppliesText),
      balance: typeParsers.integer(balanceText)
    })
  }) as ParsedPartyHuntHeader<OptionalTypeParsers>;
};

export default parsePartyHuntHeader;
