
import {
  lineBreakTypePattern,
  indentationTypePattern
} from './pattern';

import {
  TypeParserKey,
  CustomTypeParsers
} from './type-parser';

import * as parseChunk from './parse-chunk';

export type HuntingSessionTypeParserKey = Exclude<TypeParserKey,
  'boolean' |
  'lootType'
>;

export type HuntingSessionTypeParsers = CustomTypeParsers<
  HuntingSessionTypeParserKey
>;

export type ParsedHuntingSession<
  TypeParsers extends HuntingSessionTypeParsers = {}
> = (
  parseChunk.ParsedSessionHeaderData<TypeParsers> &
  parseChunk.ParsedHuntingSessionHeaderData<TypeParsers> &
  parseChunk.ParsedKilledMonstersData<TypeParsers> &
  parseChunk.ParsedLootedItemsData<TypeParsers>
);

const parseHuntingSession = function <
  OptionalTypeParsers extends CustomTypeParsers
>(
  content: string,
  customTypeParsers?: OptionalTypeParsers
) {
  const parsedSessionHeader = parseChunk.sessionHeader(
    content,
    customTypeParsers
  );

  var index = parsedSessionHeader.length;

  const lineBreakPattern = lineBreakTypePattern(
    parsedSessionHeader.lineBreakType
  );

  const parsedHuntingSessionHeader = parseChunk.huntingSessionHeader(
    content.slice(index),
    lineBreakPattern,
    customTypeParsers
  );

  index += parsedHuntingSessionHeader.length;

  const parsedKilledMonsters = parseChunk.killedMonsters(
    content.slice(index),
    lineBreakPattern,
    customTypeParsers
  );

  index += parsedKilledMonsters.length;

  const indentationPattern = indentationTypePattern(
    parsedKilledMonsters.indentationType
  );

  const parsedLootedItems = parseChunk.lootedItems(
    content.slice(index),
    lineBreakPattern,
    indentationPattern,
    customTypeParsers
  );

  return Object.freeze({
    ...parsedSessionHeader.data,
    ...parsedHuntingSessionHeader.data,
    ...parsedKilledMonsters.data,
    ...parsedLootedItems.data
  }) as ParsedHuntingSession<OptionalTypeParsers>;
};

export default parseHuntingSession;
