
import * as dataType from './data-type';
import { ParseError } from './parse-error';

export type HuntingSessionAnalyser = {
  newLine: dataType.newLine.Value,
  startedAt: string,
  startedAtValue: Date,
  endedAt: string,
  endedAtValue: Date,
  duration: string,
  durationValue: number,
  xpGain: string,
  xpGainValue: number,
  xpPerHour: string,
  xpPerHourValue: number,
  loot: string,
  lootValue: number,
  supplies: string,
  suppliesValue: number,
  balance: string,
  balanceValue: number,
  damage: string,
  damageValue: number,
  damagePerHour: string,
  damagePerHourValue: number,
  healing: string,
  healingValue: number,
  healingPerHour: string,
  healingPerHourValue: number,
  killedMonsters: HuntingSessionAnalyserMonsters,
  lootedItems: HuntingSessionAnalyserItems
};

export type HuntingSessionAnalyserMonsters = {
  [name: string]: number
};

export type HuntingSessionAnalyserItems = {
  [name: string]: HuntingSessionAnalyserItem
};

export type HuntingSessionAnalyserItem = {
  indefiniteArticle: 'an' | 'a' | null,
  count: number
}

export type FrozenHuntingSessionAnalyser = Readonly<HuntingSessionAnalyser & {
  killedMonsters: FrozenHuntingSessionAnalyserMonsters,
  lootedItems: FrozenHuntingSessionAnalyserItems
}>;

export type FrozenHuntingSessionAnalyserMonsters =
    Readonly<HuntingSessionAnalyserMonsters>;

export type FrozenHuntingSessionAnalyserItems =
    Readonly<HuntingSessionAnalyserItems>;

export const HUNTING_SESSION_ANALYSER_ERRORS = Object.freeze({
  invalidHeader: 'Invalid header',
  inconsistentSession: 'Inconsistent session',
  inconsistentDuration: 'Inconsistent duration',
  inconsistentBalance: 'Inconsistent balance',
  cantFindKilledMonsters: 'Can not find killed monsters',
  cantDetermineIndentation: 'Can not determine indentation',
  cantReadKilledMonsters: 'Can not read killed monsters',
  duplicatedKilledMonster: 'Duplicated killed monster',
  killedMonsterZeroCount: 'Killled monster with zero count',
  cantReachLootedItems: 'Can not reach looted items',
  cantReadLootedItems: 'Can not read looted items',
  duplicatedLootedItem: 'Duplicated looted item',
  lootedItemZeroCount: 'Looted item with zero count',
  cantReadAllLootedItems: 'Can not read all looted items'
});

export function parseHuntingSessionAnalyser(content: string):
    FrozenHuntingSessionAnalyser {

  const errors = HUNTING_SESSION_ANALYSER_ERRORS;
  const analyser = {} as HuntingSessionAnalyser;

  var pattern = `Session data: From (${dataType.dateTime.PATTERN}) to ` +
      `(${dataType.dateTime.PATTERN})(${dataType.newLine.PATTERN})` +
      `Session: (${dataType.duration.PATTERN})\\3` +
      `XP Gain: (${dataType.integer.PATTERN})\\3` +
      `XP/h: (${dataType.integer.PATTERN})\\3` +
      `Loot: (${dataType.integer.PATTERN})\\3` +
      `Supplies: (${dataType.integer.PATTERN})\\3` +
      `Balance: (${dataType.integer.PATTERN})\\3` +
      `Damage: (${dataType.integer.PATTERN})\\3` +
      `Damage/h: (${dataType.integer.PATTERN})\\3` +
      `Healing: (${dataType.integer.PATTERN})\\3` +
      `Healing/h: (${dataType.integer.PATTERN})\\3`;

  var regex = new RegExp(`^${pattern}`);
  var matches = regex.exec(content);

  if (!matches) {
    throw new ParseError(errors.invalidHeader, false);
  }

  analyser.newLine = matches[3] as dataType.newLine.Value;
  analyser.startedAt = matches[1];
  analyser.startedAtValue = dataType.dateTime.parse(matches[1]);
  analyser.endedAt = matches[2];
  analyser.endedAtValue = dataType.dateTime.parse(matches[2]);
  analyser.duration = matches[4];

  const parsedDuration = dataType.duration.parse(analyser.duration);
  const startedAtTimestamp = analyser.startedAtValue.getTime();
  const endedAtTimestamp = analyser.endedAtValue.getTime();
  const durationValue = endedAtTimestamp - startedAtTimestamp;
  const durationMinutes = Math.floor(durationValue / 60000);

  if (endedAtTimestamp < startedAtTimestamp) {
    throw new ParseError(errors.inconsistentSession);
  } else if (parsedDuration / 60000 !== durationMinutes) {
    throw new ParseError(errors.inconsistentDuration);
  }

  analyser.durationValue = durationValue;
  analyser.xpGain = matches[5];
  analyser.xpGainValue = dataType.integer.parse(matches[5]);
  analyser.xpPerHour = matches[6];
  analyser.xpPerHourValue = dataType.integer.parse(matches[6]);
  analyser.loot = matches[7];
  analyser.lootValue = dataType.integer.parse(matches[7]);
  analyser.supplies = matches[8];
  analyser.suppliesValue = dataType.integer.parse(matches[8]);
  analyser.balance = matches[9];
  analyser.balanceValue = dataType.integer.parse(matches[9]);

  if (analyser.balanceValue !== analyser.lootValue - analyser.suppliesValue) {
    throw new ParseError(errors.inconsistentBalance);
  }

  analyser.damage = matches[10];
  analyser.damageValue = dataType.integer.parse(matches[10]);
  analyser.damagePerHour = matches[11];
  analyser.damagePerHourValue = dataType.integer.parse(matches[11]);
  analyser.healing = matches[12];
  analyser.healingValue = dataType.integer.parse(matches[12]);
  analyser.healingPerHour = matches[13];
  analyser.healingPerHourValue = dataType.integer.parse(matches[13]);

  const nl = dataType.newLine.pattern(analyser.newLine);

  content = content.slice(matches[0].length);
  pattern = `Killed Monsters:${nl}`;
  regex = new RegExp(`^${pattern}`);
  matches = regex.exec(content);

  if (!matches) {
    throw new ParseError(errors.cantFindKilledMonsters);
  }

  content = content.slice(matches[0].length);
  pattern = `(${dataType.indentation.PATTERN})\\w`;
  regex = new RegExp(`^${pattern}`);
  matches = regex.exec(content);

  if (!matches) {
    throw new ParseError(errors.cantDetermineIndentation);
  }

  const ind = matches[1].replace('\t', '\\t');
  const none = `${ind}None`;
  const killedMonsters = {} as HuntingSessionAnalyserMonsters;

  pattern = `${none}${nl}`;
  regex = new RegExp(`^${pattern}`);
  matches = regex.exec(content);

  if (matches) {
    content = content.slice(matches[0].length);
  } else {
    pattern = `${ind}(\\d+)x (\\w[\\w ']*)${nl}`;
    regex = new RegExp(`^${pattern}`);
    matches = regex.exec(content);

    if (!matches) {
      throw new ParseError(errors.cantReadKilledMonsters);
    }

    while (matches) {
      if (killedMonsters[matches[2]]) {
        throw new ParseError(errors.duplicatedKilledMonster);
      }

      killedMonsters[matches[2]] = parseInt(matches[1]);

      if (!killedMonsters[matches[2]]) {
        throw new ParseError(errors.killedMonsterZeroCount);
      }

      content = content.slice(matches[0].length);
      matches = regex.exec(content);
    }
  }

  analyser.killedMonsters = Object.freeze(killedMonsters);

  pattern = `Looted items:${nl}`;
  regex = new RegExp(`^${pattern}`);
  matches = regex.exec(content);

  if (!matches) {
    throw new ParseError(errors.cantReachLootedItems);
  }

  const lootedItems = {} as HuntingSessionAnalyserItems;

  content = content.slice(matches[0].length);
  regex = new RegExp(`^${none}$`);
  matches = regex.exec(content);

  if (matches) {
    content = content.slice(matches[0].length);
  } else {
    pattern = `${ind}(\\d+)x ((?:an? )?)(\\w[\\w ']*)`;
    regex = new RegExp(`^${pattern}(?:${nl}|$)`);
    matches = regex.exec(content);

    if (!matches) {
      throw new ParseError(errors.cantReadLootedItems);
    }

    while (matches) {
      if (lootedItems[matches[3]]) {
        throw new ParseError(errors.duplicatedLootedItem);
      }

      lootedItems[matches[3]] = {
        count: parseInt(matches[1]),
        indefiniteArticle: (matches[2].trim() || null) as 'an' | 'a' | null
      }

      if (!lootedItems[matches[3]].count) {
        throw new ParseError(errors.lootedItemZeroCount);
      }

      content = content.slice(matches[0].length);
      matches = regex.exec(content);
    }
  }

  if (content) {
    console.log(JSON.stringify(content));
    throw new ParseError(errors.cantReadAllLootedItems);
  }

  analyser.lootedItems = Object.freeze(lootedItems);

  return Object.freeze(analyser);
}
