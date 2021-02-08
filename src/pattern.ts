
import {
  LineBreakType,
  IndentationType
} from './type-parser';

const PATTERNS = Object.freeze({
  dateTime: '(?:\\d{4}-\\d{2}-\\d{2}, \\d{2}:\\d{2}:\\d{2})',
  lineBreak: '(?:\\r\\n|\\r|\\n)',
  duration: '(?:\\d{2}:\\d{2}h)',
  integer: '(?:-?\\d{1,3}(?:,\\d{3})*)',
  lootType: '(?:Market|Leader)',
  indentation: '(?:\\t| {2}| {4}| {8})',
  count: '(?:\\d+x)',
  monsterName: '(?:\\w+(?:\'\\w+)?(?: \\w+(?:\'\\w+)?)*)',
  indefiniteArticle: '(?:(?:an? )?)',
  itemName: '(?:\\w+(?:\'\\w+)?(?: \\w+(?:\'\\w+)?)*)',
  playerName: '(?:[A-Z][a-z]+(?: [A-Z]?[a-z]+)*)',
  leaderBadge: '(?:(?: \\(Leader\\))?)'
});

export type Patterns = typeof PATTERNS;
export type PatternKey = keyof Patterns;

export default PATTERNS;

export type LineBreakPattern = '\\n' | '\\r' | '\\r\\n';
export type IndentationPattern = '\\t' | '  ' | '    ' | '        ';

export const lineBreakTypePattern = function (lineBreak: LineBreakType) {
  return {
    'unix': '\\n',
    'dos': '\\r\\n',
    'mac': '\\r'
  }[lineBreak] as LineBreakPattern;
};

export const indentationTypePattern = function (indentation: IndentationType) {
  return {
    'tab': '\\t',
    '2-spaces': '  ',
    '4-spaces': '    ',
    '8-spaces': '        '
  }[indentation] as IndentationPattern;
};
