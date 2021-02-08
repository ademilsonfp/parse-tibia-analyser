
import {
  ParseError
} from './parse-error';

import {
  CustomTypeParsers
} from './type-parser';

import parseHuntingSession, {
  ParsedHuntingSession
} from './hunting-session';

import parsePartyHunt, {
  ParsedPartyHunt
} from './party-hunt';

import * as parseChunk from './parse-chunk';

export type GameAnalyserType = 'hunting-session' | 'party-hunt';

export type ParsedGameAnalyserData<
  TypeParsers extends CustomTypeParsers = {}
> = (
  ParsedHuntingSession<TypeParsers> |
  ParsedPartyHunt<TypeParsers>
);

export type ParsedGameAnalyser<
  TypeParsers extends CustomTypeParsers = {}
> = Readonly<{
  type: GameAnalyserType,
  data: ParsedGameAnalyserData<TypeParsers>
}>;

const parseGameAnalyser = function <
  OptionalTypeParsers extends CustomTypeParsers
>(
  content: string,
  customTypeParsers?: OptionalTypeParsers
) {
  var type: GameAnalyserType;
  var data: ParsedGameAnalyserData<OptionalTypeParsers>;

  try {
    data = parseHuntingSession(content, customTypeParsers);
    type = 'hunting-session';
  } catch (error) {
    if (error instanceof parseChunk.ParseSessionHeaderError) {
      throw new ParseError('Could not parse game analyser');
    } else if (error instanceof parseChunk.ParseHuntingSessionHeaderError) {
      try {
        data = parsePartyHunt(content, customTypeParsers);
        type = 'party-hunt';
      } catch (error) {
        if (error instanceof parseChunk.ParsePartyHuntHeaderError) {
          throw new ParseError('Could not identify game analyser type');
        } else {
          throw error;
        }
      }
    } else {
      throw error;
    }
  }

  return Object.freeze({
    type,
    data 
  }) as ParsedGameAnalyser<OptionalTypeParsers>;
};

export default parseGameAnalyser;
