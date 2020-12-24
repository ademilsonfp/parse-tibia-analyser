
import { expect } from 'chai';

import {
  HuntingSessionAnalyserMonsters,
  HuntingSessionAnalyserItems,
  FrozenHuntingSessionAnalyser,
  parseHuntingSessionAnalyser
} from './hunting-session-analyser';

import * as dataType from './data-type';

type ExpectedSession = {
  newLine: dataType.newLine.Value,
  startedAt: Date,
  endedAt: Date,
  xpGain: number,
  xpPerHour: number,
  loot: number,
  supplies: number,
  balance: number,
  damage: number,
  damagePerHour: number,
  healing: number,
  healingPerHour: number,
  killedMonsters: HuntingSessionAnalyserMonsters,
  lootedItems: HuntingSessionAnalyserItems
};

function checkParsedSession(parsed: FrozenHuntingSessionAnalyser,
    expected: ExpectedSession) {

  expect(parsed).to.be.an('object');
  expect(parsed).to.be.frozen;

  expect(parsed).to.have.all.keys(
    'newLine',
    'startedAt',
    'startedAtValue',
    'endedAt',
    'endedAtValue',
    'duration',
    'durationValue',
    'xpGain',
    'xpGainValue',
    'xpPerHour',
    'xpPerHourValue',
    'loot',
    'lootValue',
    'supplies',
    'suppliesValue',
    'balance',
    'balanceValue',
    'damage',
    'damageValue',
    'damagePerHour',
    'damagePerHourValue',
    'healing',
    'healingValue',
    'healingPerHour',
    'healingPerHourValue',
    'killedMonsters',
    'lootedItems'
  );

  expect(parsed.newLine).to.equal(expected.newLine);
  expect(parsed.startedAt).to.equal(dataType.dateTime.format(expected.startedAt));
  expect(parsed.startedAtValue.getTime()).to.equal(expected.startedAt.getTime());
  expect(parsed.endedAt).to.equal(dataType.dateTime.format(expected.endedAt));
  expect(parsed.endedAtValue.getTime()).to.equal(expected.endedAt.getTime());

  expect(parsed.duration).to.equal(dataType.duration.format(
      expected.endedAt.getTime() - expected.startedAt.getTime()));

  expect(parsed.durationValue).to.equal(expected.endedAt.getTime() - expected.startedAt.getTime());
  expect(parsed.xpGain).to.equal(dataType.integer.format(expected.xpGain));
  expect(parsed.xpGainValue).to.equal(expected.xpGain);
  expect(parsed.xpPerHour).to.equal(dataType.integer.format(expected.xpPerHour));
  expect(parsed.xpPerHourValue).to.equal(expected.xpPerHour);
  expect(parsed.loot).to.equal(dataType.integer.format(expected.loot));
  expect(parsed.lootValue).to.equal(expected.loot);
  expect(parsed.supplies).to.equal(dataType.integer.format(expected.supplies));
  expect(parsed.suppliesValue).to.equal(expected.supplies);
  expect(parsed.balance).to.equal(dataType.integer.format(expected.loot - expected.supplies));
  expect(parsed.balanceValue).to.equal(expected.loot - expected.supplies);
  expect(parsed.damage).to.equal(dataType.integer.format(expected.damage));
  expect(parsed.damageValue).to.equal(expected.damage);
  expect(parsed.damagePerHour).to.equal(dataType.integer.format(expected.damagePerHour));
  expect(parsed.damagePerHourValue).to.equal(expected.damagePerHour);
  expect(parsed.healing).to.equal(dataType.integer.format(expected.healing));
  expect(parsed.healingPerHourValue).to.equal(expected.healingPerHour);

  expect(parsed.killedMonsters).to.be.an('object');
  expect(parsed.killedMonsters).to.be.frozen;
  expect(parsed.killedMonsters).to.have.all.keys(Object.keys(expected.killedMonsters));

  var name: string;

  for (name in expected.killedMonsters) {
    expect(parsed.killedMonsters[name]).to.equal(expected.killedMonsters[name]);
  }

  expect(parsed.lootedItems).to.be.an('object');
  expect(parsed.lootedItems).to.be.frozen;
  expect(parsed.lootedItems).to.have.all.keys(Object.keys(expected.lootedItems));

  for (name in expected.lootedItems) {
    expect(parsed.lootedItems[name]).to.equal(expected.lootedItems[name]);
  }
}

describe('#parseHuntingSessionAnalyser()', function () {
  it('should parse correct hunting session analyser contents', function () {
    var sample: string;
    var parsed: FrozenHuntingSessionAnalyser;

    // UNIX line breaks

    sample = [
      'Session data: From 2020-10-04, 08:31:09 to 2020-10-04, 10:00:08',
      'Session: 01:28h',
      'XP Gain: 573,043',
      'XP/h: 175,437',
      'Loot: 165,384',
      'Supplies: 25,520',
      'Balance: 139,864',
      'Damage: 465,202',
      'Damage/h: 437,860',
      'Healing: 72,451',
      'Healing/h: 68,045',
      'Killed Monsters:',
      '\t1x bug',
      '\t2x carniphila',
      '\t3x centipede',
      '\t106x fury',
      '\t1x poison spider',
      '\t2x spider',
      '\t1x wasp',
      'Looted items:',
      '\t14x a great health potion',
      '\t1x a crystal ring',
      '\t11201x a gold coin',
      '\t20x a small amethyst',
      '\t9x a platinum coin',
      '\t24x a terra rod',
      '\t2x an orichalcum pearl',
      '\t5x a red piece of cloth',
      '\t21x a soul orb',
      '\t27x demonic essence',
      '\t63x concentrated demonic blood',
      '\t2x an assassin dagger',
      '\t2x a noble axe',
      '\t83x a jalapeno pepper',
      '\t16x slightly rusted legs'
    ].join('\n');

    parsed = parseHuntingSessionAnalyser(sample);

    checkParsedSession(parsed, {
      newLine: '\n',
      startedAt: new Date('2020-10-04 08:31:09'),
      endedAt: new Date('2020-10-04 10:00:08'),
      xpGain: 573043,
      xpPerHour: 175437,
      loot: 165384,
      supplies: 25520,
      balance: 139864,
      damage: 465202,
      damagePerHour: 437860,
      healing: 72451,
      healingPerHour: 68045,

      killedMonsters: {
        'bug': 1,
        'carniphila': 2,
        'centipede': 3,
        'fury': 106,
        'poison spider': 1,
        'spider': 2,
        'wasp': 1
      },

      lootedItems: {
        'great health potion': 14,
        'crystal ring': 1,
        'gold coin': 11201,
        'small amethyst': 20,
        'platinum coin': 9,
        'terra rod': 24,
        'orichalcum pearl': 2,
        'red piece of cloth': 5,
        'soul orb': 21,
        'demonic essence': 27,
        'concentrated demonic blood': 63,
        'assassin dagger': 2,
        'noble axe': 2,
        'jalapeno pepper': 83,
        'slightly rusted legs': 16
      }
    });
  });
});
