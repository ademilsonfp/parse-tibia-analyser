
import patterns from '../pattern';

import {
  ParseError
} from '../parse-error';

import defaultTypeParsers, {
  LineBreakType,
  TypeParserKey,
  CustomTypeParsers
} from '../type-parser';

import {
  ParsedResultObject
} from '../parsed-result';

export type SessionHeaderTypeParserKey = Extract<TypeParserKey,
  'lineBreak' |
  'dateTime' |
  'duration'
>;

export type SessionHeaderTypeParsers = CustomTypeParsers<
  SessionHeaderTypeParserKey
>;

export type ParsedSessionHeaderModel = {
  lineBreak: 'lineBreak',
  startedAt: 'dateTime',
  finishedAt: 'dateTime',
  duration: 'duration'
};

export type ParsedSessionHeaderData<
  TypeParsers extends SessionHeaderTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedSessionHeaderModel>;

export type ParsedSessionHeader<
  TypeParsers extends SessionHeaderTypeParsers = {}
> = Readonly<{
  length: number,
  lineBreakType: LineBreakType,
  data: ParsedSessionHeaderData<TypeParsers>
}>;

export class ParseSessionHeaderError extends ParseError {
  name = 'ParseSessionHeaderError'
}

const parseSessionHeader = function <
  OptionalTypeParsers extends SessionHeaderTypeParsers
>(
  content: string,
  customTypeParsers?: OptionalTypeParsers
) {
  const typeParsers = {
    ...defaultTypeParsers,
    ...customTypeParsers
  };

  const pattern = [
    `^Session data: From (${patterns.dateTime}) to `,
    `(${patterns.dateTime})(${patterns.lineBreak})`,
    `Session: (${patterns.duration})\\3`
  ].join('');

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParseSessionHeaderError('Could not parse session header');
  }

  const [
    matchedText,
    sessionStartedAtText,
    sessionFinishedAtText,
    lineBreakText,
    sessionDurationText
  ] = matched;

  return Object.freeze({
    length: matchedText.length,
    lineBreakType: defaultTypeParsers.lineBreak(lineBreakText),
    data: Object.freeze({
      lineBreak: typeParsers.lineBreak(lineBreakText),
      startedAt: typeParsers.dateTime(sessionStartedAtText),
      finishedAt: typeParsers.dateTime(sessionFinishedAtText),
      duration: typeParsers.duration(sessionDurationText)
    })
  }) as ParsedSessionHeader<OptionalTypeParsers>;
};

export default parseSessionHeader;
