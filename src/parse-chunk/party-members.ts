
import {
  LineBreakPattern,
  IndentationPattern,
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

import parsePlayerSummary, {
  PlayerSummaryTypeParserKey,
  ParsedPlayerSummaryData,
  ParsedPlayerSummaryModel,
  ParsePlayerSummaryError
} from './player-summary';

export type PartyMembersTypeParserKey = PlayerSummaryTypeParserKey | (
  Extract<TypeParserKey, 'indentation'>
);

export type PartyMembersTypeParsers = CustomTypeParsers<
  PartyMembersTypeParserKey
>;

export type ParsedPartyMembersModel = {
  indentation: 'indentation',
  members: {
    [name: string]: Omit<ParsedPlayerSummaryModel, 'indentation' | 'name'>
  }
};

export type ParsedPartyMembersData<
  TypeParsers extends PartyMembersTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedPartyMembersModel>;

export type ParsedPartyMembers<
  TypeParsers extends PartyMembersTypeParsers = {}
> = Readonly<{
  length: number,
  data: ParsedPartyMembersData<TypeParsers>
}>;

export class ParsePartyMembersError extends ParseError {
  name = 'ParsePartyMembersError';
}

export class DuplicatedPartyMemberError extends ParsePartyMembersError {
  name = 'DuplicatedPartyMemberError';
}

const parsePartyMembers = function <
  OptionalTypeParsers extends PartyMembersTypeParsers
>(
  content: string,
  lineBreakPattern: LineBreakPattern,
  customTypeParsers?: OptionalTypeParsers
) {
  const members = {};

  var hasNext = true;
  var length = 0;
  var fullLength = 0;

  var data: ParsedPlayerSummaryData<OptionalTypeParsers> = null;
  var indentationType: IndentationType = null;
  var indentationPattern: IndentationPattern = null;

  while (hasNext) {
    if (length) {
      content = content.slice(length);
    }

    try {
      ({ hasNext, length, indentationType, data } = parsePlayerSummary(
        content,
        lineBreakPattern,
        indentationPattern,
        customTypeParsers
      ));
    } catch (error) {
      if (!indentationType && error instanceof ParsePlayerSummaryError) {
        throw new ParsePartyMembersError('Could not parse party members');
      } else {
        throw error;
      }
    }

    fullLength += length;

    if (!indentationPattern) {
      indentationPattern = indentationTypePattern(indentationType);
    }

    if (members[data.name]) {
      throw new DuplicatedPartyMemberError(
        `Duplicated party member ${data.name}`
      );
    }

    members[data.name] = Object.freeze({
      leader: data.leader,
      loot: data.loot,
      supplies: data.supplies,
      balance: data.balance,
      damage: data.damage,
      healing: data.healing
    });
  }

  return Object.freeze({
    length: fullLength,
    data: Object.freeze({
      indentation: indentationType,
      members: Object.freeze(members)
    })
  }) as ParsedPartyMembers<OptionalTypeParsers>;
};

export default parsePartyMembers;
