
import {
  LineBreakPattern,
  IndentationPattern
} from '../pattern';

import {
  ParseError
} from '../parse-error';

import {
  CustomTypeParsers
} from '../type-parser';

import {
  ParsedResultObject
} from '../parsed-result';

import parseItemCount, {
  ItemCountTypeParserKey,
  ParsedItemCountModel,
  ParsedItemCountData
} from './item-count';

export type LootedItemsTypeParserKey = ItemCountTypeParserKey;

export type LootedItemsTypeParsers = CustomTypeParsers<
  LootedItemsTypeParserKey
>;

export type ParsedLootedItemsModel = {
  lootedItems: {
    [name: string]: Omit<ParsedItemCountModel, 'name'>
  }
};

export type ParsedLootedItemsData<
  TypeParsers extends LootedItemsTypeParsers = {}
> = ParsedResultObject<TypeParsers, ParsedLootedItemsModel>;

export type ParsedLootedItems<
  TypeParsers extends LootedItemsTypeParsers = {}
> = Readonly<{
  length: number,
  data: ParsedLootedItemsData<TypeParsers>
}>;

export class ParseLootedItemsError extends ParseError {
  name = 'ParseLootedItemsError'
}

export class DuplicatedLootedItemError extends ParseLootedItemsError {
  name = 'DuplicatedLootedItemError'
}

const parseLootedItems = function <
  OptionalTypeParsers extends LootedItemsTypeParsers
>(
  content: string,
  lineBreakPattern: LineBreakPattern,
  indentationPattern: IndentationPattern,
  customTypeParsers?: OptionalTypeParsers
) {
  const pattern = [
    `^Looted items:`,
    `${indentationPattern}`
  ].join(lineBreakPattern);

  const matched = new RegExp(pattern).exec(content);

  if (!matched) {
    throw new ParseLootedItemsError('Could not parse looted items');
  }

  const [matchedText] = matched;
  const lootedItems = {};

  var hasNext = true;
  var length = matchedText.length;
  var fullLength = matchedText.length;
  var data: ParsedItemCountData<OptionalTypeParsers>;

  while (hasNext) {
    content = content.slice(length);

    ({ hasNext, length, data } = parseItemCount(
      content,
      lineBreakPattern,
      indentationPattern,
      customTypeParsers
    ));

    fullLength += length;

    if (lootedItems[data.name]) {
      throw new DuplicatedLootedItemError(
        `Duplicated looted item ${data.name}`
      );
    }

    lootedItems[data.name] = Object.freeze({
      count: data.count,
      indefiniteArticle: data.indefiniteArticle
    });
  }

  return Object.freeze({
    length: fullLength,
    data: Object.freeze({
      lootedItems: Object.freeze(lootedItems)
    })
  }) as ParsedLootedItems<OptionalTypeParsers>;
};

export default parseLootedItems;
