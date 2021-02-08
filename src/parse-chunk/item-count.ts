
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

export type ItemCountTypeParserKey = Extract<TypeParserKey,
  'count' |
  'indefiniteArticle'
>;

export type ItemCountTypeParsers = CustomTypeParsers<
  ItemCountTypeParserKey
>;

export type ParsedItemCountModel = {
  count: 'count',
  indefiniteArticle: 'indefiniteArticle',
  name: 'raw'
};

export type ParsedItemCountData<
  TypeParsers extends ItemCountTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedItemCountModel>;

export type ParsedItemCount <
  TypeParsers extends ItemCountTypeParsers = {}
> = Readonly<{
  length: number,
  hasNext: boolean,
  data: ParsedItemCountData<TypeParsers>
}>;

export class ParseItemCountError extends ParseError {
  name = 'ParseItemCountError'
}

const parseItemCount = function <
  OptionalTypeParsers extends ItemCountTypeParsers
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
    `^(${patterns.count}) (${patterns.indefiniteArticle})`,
    `(${patterns.itemName})`,
    `(${lineBreakPattern}${indentationPattern}|$)`
  ].join('');

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParseItemCountError('Could not parse item count');
  }

  const [
    matchedText,
    countText,
    indefiniteArticleText,
    name,
    hasNextText
  ] = matched;

  return Object.freeze({
    length: matchedText.length,
    hasNext: defaultTypeParsers.boolean(hasNextText),
    data: Object.freeze({
      count: typeParsers.count(countText),
      indefiniteArticle: typeParsers.indefiniteArticle(indefiniteArticleText),
      name
    })
  }) as ParsedItemCount<OptionalTypeParsers>;
};

export default parseItemCount;
