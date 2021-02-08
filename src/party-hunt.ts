
import {
  lineBreakTypePattern
} from './pattern';

import {
  TypeParserKey,
  CustomTypeParsers
} from './type-parser';

import * as parseChunk from './parse-chunk';

export type PartyHuntTypeParserKey = Exclude<TypeParserKey,
  'indefiniteArticle'
>;

export type PartyHuntTypeParsers = CustomTypeParsers<PartyHuntTypeParserKey>;

export type ParsedPartyHunt<TypeParsers extends PartyHuntTypeParsers = {}> = (
  parseChunk.ParsedSessionHeaderData<TypeParsers> &
  parseChunk.ParsedPartyHuntHeaderData<TypeParsers> &
  parseChunk.ParsedPartyMembersData<TypeParsers>
);

const parsePartyHunt = function <
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

  const parsedPartyHuntHeader = parseChunk.partyHuntHeader(
    content.slice(index),
    lineBreakPattern,
    customTypeParsers
  );

  index += parsedPartyHuntHeader.length;

  const parsedPartyMembers = parseChunk.partyMembers(
    content.slice(index),
    lineBreakPattern,
    customTypeParsers
  );

  return Object.freeze({
    ...parsedSessionHeader.data,
    ...parsedPartyHuntHeader.data,
    ...parsedPartyMembers.data,
  }) as ParsedPartyHunt<OptionalTypeParsers>;
};

export default parsePartyHunt;
