
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

export type HuntingSessionHeaderTypeParserKey = Extract<TypeParserKey,
  'integer'
>;

export type HuntingSessionHeaderTypeParsers = CustomTypeParsers<
  HuntingSessionHeaderTypeParserKey
>;

export type ParsedHuntingSessionHeaderModel = {
  xpGain: 'integer',
  xpPerHour: 'integer',
  loot: 'integer',
  supplies: 'integer',
  balance: 'integer',
  damage: 'integer',
  damagePerHour: 'integer',
  healing: 'integer',
  healingPerHour: 'integer'
};

export type ParsedHuntingSessionHeaderData<
  TypeParsers extends HuntingSessionHeaderTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedHuntingSessionHeaderModel>;

export type ParsedHuntingSessionHeader<
  TypeParsers extends HuntingSessionHeaderTypeParsers = {}
> = Readonly<{
  length: number,
  data: ParsedHuntingSessionHeaderData<TypeParsers>
}>;

export class ParseHuntingSessionHeaderError extends ParseError {
  name = 'ParseHuntingSessionHeaderError'
};

const parseHuntingSessionHeader = function <
  OptionalTypeParsers extends HuntingSessionHeaderTypeParsers
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
    `^XP Gain: (${patterns.integer})`,
    `XP/h: (${patterns.integer})`,
    `Loot: (${patterns.integer})`,
    `Supplies: (${patterns.integer})`,
    `Balance: (${patterns.integer})`,
    `Damage: (${patterns.integer})`,
    `Damage/h: (${patterns.integer})`,
    `Healing: (${patterns.integer})`,
    `Healing/h: (${patterns.integer})`,
    ''
  ].join(lineBreakPattern);

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParseHuntingSessionHeaderError(
      'Could not parse hunting session header'
    );
  }

  const [
    matchedText,
    xpGainText,
    xpPerHourText,
    lootText,
    suppliesText,
    balanceText,
    damageText,
    damagePerHourText,
    healingText,
    healingPerHourText
  ] = matched;

  return Object.freeze({
    length: matchedText.length,
    data: Object.freeze({
      xpGain: typeParsers.integer(xpGainText),
      xpPerHour: typeParsers.integer(xpPerHourText),
      loot: typeParsers.integer(lootText),
      supplies: typeParsers.integer(suppliesText),
      balance: typeParsers.integer(balanceText),
      damage: typeParsers.integer(damageText),
      damagePerHour: typeParsers.integer(damagePerHourText),
      healing: typeParsers.integer(healingText),
      healingPerHour: typeParsers.integer(healingPerHourText)
    })
  }) as ParsedHuntingSessionHeader<OptionalTypeParsers>;
};

export default parseHuntingSessionHeader;
