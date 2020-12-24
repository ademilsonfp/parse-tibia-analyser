
import * as dataType from './data-type';

/**
 * Resulting object of a party hunt analyser content.
 */
export type PartyHuntAnalyser = {
  newLine: string,
  startedAt: string,
  startedAtValue: Date,
  endedAt: string,
  endedAtValue: Date,
  duration: string,
  durationValue: number,
  lootType: PartyHuntAnalyserLootType,
  loot: string,
  lootValue: number,
  supplies: string,
  suppliesValue: number,
  balance: string,
  balanceValue: number,
  members: PartyHuntAnalyserMembers
};

/**
 * Resulting loot type `string`.
 */
export type PartyHuntAnalyserLootType = 'market' | 'leader';

/**
 * Object mapping of a party hunt analyser members with character names as key.
 */
export type PartyHuntAnalyserMembers = {
  [name: string]: PartyHuntAnalyserMember
};

/**
 * Resulting object of a party hunt analyser member.
 */
export type PartyHuntAnalyserMember = {
  leader: boolean,
  loot: string,
  lootValue: number,
  supplies: string,
  suppliesValue: number,
  balance: string,
  balanceValue: number,
  damage: string,
  damageValue: number,
  healing: string,
  healingValue: number
};

/**
 * Result of parsed hunt analyser content.
 */
export type FrozenPartyHuntAnalyser = Readonly<PartyHuntAnalyser & {
  members: FrozenPartyHuntAnalyserMembers
}>;

/**
 * Result of parsed party hunt analyser members content.
 */
export type FrozenPartyHuntAnalyserMembers = Readonly<{
  [name: string]: FrozenPartyHuntAnalyserMember
}>;

/**
 * Result of a parsed party hunt analyser member content.
 */
export type FrozenPartyHuntAnalyserMember = Readonly<PartyHuntAnalyserMember>;

/**
 * Possible loot types of parsed party hunt analyser content.
 */
export const PARTY_HUNT_ANALYSER_LOOT_TYPES = Object.freeze([
  'market',
  'leader'
] as PartyHuntAnalyserLootType[]);

/**
 * Possible errors of parsing party hunt analyser content.
 */
export const PARTY_HUNT_ANALYSER_ERRORS = Object.freeze({
  invalidHeader: 'Invalid header',
  inconsistentSession: 'Inconsistent session',
  inconsistentDuration: 'Inconsistent duration',
  inconsistentBalance: 'Inconsistent balance',
  cantDetermineIndentation: 'Can not determine indentation',
  duplicatedMember: 'Duplicated member',
  tooManyLeaders: 'Too many leaders',
  inconsistentMemberBalance: 'Inconsistent member balance',
  cantFindMembers: 'Can not find members',
  cantReadAllMembers: 'Can not read all members',
  leaderNotFound: 'Leader not found',
  inconsistentPartyLoot: 'Inconsistent party loot',
  inconsistentPartySupplies: 'Inconsistent party supplies',
  inconsistentPartyBalance: 'Inconsistent party balance'
});

/**
 * Parses the content of a party hunt analyser copied from Tibia.
 *
 * @param content Text from party hunt analyser.
 * @returns An object with all obtained data.
 */
export function parsePartyHuntAnalyser(content: string):
    FrozenPartyHuntAnalyser {

  const errors = PARTY_HUNT_ANALYSER_ERRORS;
  const analyser = {} as PartyHuntAnalyser;

  var pattern = `Session data: From (${dataType.dateTime.PATTERN}) to ` +
      `(${dataType.dateTime.PATTERN})(${dataType.newLine.PATTERN})` +
      `Session: (${dataType.duration.PATTERN})\\3` +
      'Loot Type: (Market|Leader)\\3' +
      `Loot: (${dataType.integer.PATTERN})\\3` +
      `Supplies: (${dataType.integer.PATTERN})\\3` +
      `Balance: (${dataType.integer.PATTERN})\\3`;

  var regex = new RegExp(`^${pattern}`);
  var matches = regex.exec(content);

  if (!matches) {
    throw new Error(errors.invalidHeader);
  }

  analyser.newLine = matches[3];
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
    throw new Error(errors.inconsistentSession);
  } else if (parsedDuration / 60000 !== durationMinutes) {
    throw new Error(errors.inconsistentDuration);
  }

  analyser.durationValue = durationValue;
  analyser.lootType = matches[5].toLowerCase() as PartyHuntAnalyserLootType;
  analyser.loot = matches[6];
  analyser.lootValue = dataType.integer.parse(matches[6]);
  analyser.supplies = matches[7];
  analyser.suppliesValue = dataType.integer.parse(matches[7]);
  analyser.balance = matches[8];
  analyser.balanceValue = dataType.integer.parse(matches[8]);

  if (analyser.balanceValue !== analyser.lootValue - analyser.suppliesValue) {
    throw new Error(errors.inconsistentBalance);
  }

  const nl = dataType.newLine.pattern(analyser.newLine);

  content = content.slice(matches[0].length);
  pattern = `${dataType.charName.PATTERN}(?: \\(Leader\\))?${nl}` +
      `(${dataType.indentation.PATTERN})\\w`;

  regex = new RegExp(`^${pattern}`);
  matches = regex.exec(content);

  if (!matches) {
    throw new Error(errors.cantDetermineIndentation);
  }

  const ind = matches[1].replace('\t', '\\t');
  const members = {} as PartyHuntAnalyserMembers;

  var hasLeader = false;
  var lootSum = 0;
  var suppliesSum = 0;
  var balanceSum = 0;
  var membersCount = 0;
  var member: PartyHuntAnalyserMember;

  pattern = `(${dataType.charName.PATTERN})((?: \\(Leader\\))?)${nl}` +
      `${ind}Loot: (${dataType.integer.PATTERN})${nl}` +
      `${ind}Supplies: (${dataType.integer.PATTERN})${nl}` +
      `${ind}Balance: (${dataType.integer.PATTERN})${nl}` +
      `${ind}Damage: (${dataType.integer.PATTERN})${nl}` +
      `${ind}Healing: (${dataType.integer.PATTERN})`;

  regex = new RegExp(`^${pattern}(?:${nl}|$)`);
  matches = regex.exec(content);

  while (matches) {
    if (members[matches[1]]) {
      throw new Error(errors.duplicatedMember);
    }

    member = {} as PartyHuntAnalyserMember;
    member.leader = !!matches[2];

    if (member.leader) {
      if (hasLeader) {
        throw new Error(errors.tooManyLeaders);
      }

      hasLeader = true;
    }

    member.loot = matches[3];
    member.lootValue = dataType.integer.parse(matches[3]);
    member.supplies = matches[4]
    member.suppliesValue = dataType.integer.parse(matches[4]);
    member.balance = matches[5];
    member.balanceValue = dataType.integer.parse(matches[5]);
    member.damage = matches[6];
    member.damageValue = dataType.integer.parse(matches[6]);
    member.healing = matches[7];
    member.healingValue = dataType.integer.parse(matches[7]);

    if (member.balanceValue !== member.lootValue - member.suppliesValue) {
      throw new Error(errors.inconsistentMemberBalance);
    }

    members[matches[1]] = Object.freeze(member);

    content = content.slice(matches[0].length);
    matches = regex.exec(content);

    lootSum += member.lootValue;
    balanceSum += member.balanceValue;
    suppliesSum += member.suppliesValue;

    membersCount++;
  }

  if (!membersCount) {
    throw new Error(errors.cantFindMembers);
  } else if (content) {
    throw new Error(errors.cantReadAllMembers);
  } else if (!hasLeader) {
    throw new Error(errors.leaderNotFound);
  } else if (lootSum !== analyser.lootValue) {
    throw new Error(errors.inconsistentPartyLoot);
  } else if (suppliesSum !== analyser.suppliesValue) {
    throw new Error(errors.inconsistentPartySupplies);
  } else if (balanceSum !== analyser.balanceValue) {
    throw new Error(errors.inconsistentPartyBalance);
  }

  analyser.members = Object.freeze(members);

  return Object.freeze(analyser);
}
