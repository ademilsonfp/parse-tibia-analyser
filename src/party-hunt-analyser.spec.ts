
import { expect } from 'chai';

import {
  PartyHuntAnalyserLootType,
  FrozenPartyHuntAnalyser,
  parsePartyHuntAnalyser
} from './party-hunt-analyser';

import * as dataType from './data-type';

type ExpectedParty = {
  newLine: dataType.newLine.Value,
  startedAt: Date,
  endedAt: Date,
  lootType: PartyHuntAnalyserLootType,
  loot: number,
  supplies: number,
  members: { [name: string]: ExpectedMember }
};

type ExpectedMember = {
  leader?: true,
  loot: number,
  supplies: number,
  damage: number,
  healing: number
};

function checkParsedParty(parsed: FrozenPartyHuntAnalyser,
    expected: ExpectedParty) {

  // Field by field tests are needed because of `Date` timestamp conversions.

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
    'lootType',
    'loot',
    'lootValue',
    'supplies',
    'suppliesValue',
    'balance',
    'balanceValue',
    'members'
  );

  expect(parsed.newLine).to.equal(expected.newLine);
  expect(parsed.startedAt).to.equal(dataType.dateTime.format(expected.startedAt));
  expect(parsed.startedAtValue.getTime()).to.equal(expected.startedAt.getTime());
  expect(parsed.endedAt).to.equal(dataType.dateTime.format(expected.endedAt));
  expect(parsed.endedAtValue.getTime()).to.equal(expected.endedAt.getTime());

  expect(parsed.duration).to.equal(dataType.duration.format(
      expected.endedAt.getTime() - expected.startedAt.getTime()));

  expect(parsed.durationValue).to.equal(expected.endedAt.getTime() - expected.startedAt.getTime());
  expect(parsed.lootType).to.equal(expected.lootType);
  expect(parsed.loot).to.equal(dataType.integer.format(expected.loot));
  expect(parsed.lootValue).to.equal(expected.loot);
  expect(parsed.supplies).to.equal(dataType.integer.format(expected.supplies));
  expect(parsed.suppliesValue).to.equal(expected.supplies);
  expect(parsed.balance).to.equal(dataType.integer.format(expected.loot - expected.supplies));
  expect(parsed.balanceValue).to.equal(expected.loot - expected.supplies);

  expect(parsed.members).to.be.an('object');
  expect(parsed.members).to.be.frozen;
  expect(parsed.members).to.have.all.keys(Object.keys(expected.members));

  var name: string;
  var expectedMember: ExpectedMember;

  for (name in expected.members) {
    expectedMember = expected.members[name];

    expect(parsed.members[name]).to.deep.equal({
      leader: !!expectedMember.leader,
      loot: dataType.integer.format(expectedMember.loot),
      lootValue: expectedMember.loot,
      supplies: dataType.integer.format(expectedMember.supplies),
      suppliesValue: expectedMember.supplies,
      balance: dataType.integer.format(expectedMember.loot - expectedMember.supplies),
      balanceValue: expectedMember.loot - expectedMember.supplies,
      damage: dataType.integer.format(expectedMember.damage),
      damageValue: expectedMember.damage,
      healing: dataType.integer.format(expectedMember.healing),
      healingValue: expectedMember.healing
    });
  }
}

describe('#parsePartyHuntAnalyser()', function () {
  it('should parse correct party hunt analyser contents', function () {
    var sample: string;
    var parsed: FrozenPartyHuntAnalyser;

    // UNIX line breaks

    sample = [
      'Session data: From 2021-02-17, 23:43:48 to 2021-02-18, 01:50:47',
      'Session: 02:06h',
      'Loot Type: Market',
      'Loot: 64,058',
      'Supplies: 386,723',
      'Balance: -322,665',
      'Hello Dev',
      '\tLoot: 19,701',
      '\tSupplies: 352,150',
      '\tBalance: -332,449',
      '\tDamage: 167,993',
      '\tHealing: 4,853',
      'Ninja Hunter (Leader)',
      '\tLoot: 44,357',
      '\tSupplies: 34,573',
      '\tBalance: 9,784',
      '\tDamage: 6,762',
      '\tHealing: 113,443'
    ].join('\n');

    parsed = parsePartyHuntAnalyser(sample);

    checkParsedParty(parsed, {
      newLine: '\n',
      startedAt: new Date('2021-02-17 23:43:48'),
      endedAt: new Date('2021-02-18 01:50:47'),
      lootType: 'market',
      loot: 64058,
      supplies: 386723,
      members: {
        'Hello Dev': {
          loot: 19701,
          supplies: 352150,
          damage: 167993,
          healing: 4853
        },
        'Ninja Hunter': {
          leader: true,
          loot: 44357,
          supplies: 34573,
          damage: 6762,
          healing: 113443
        }
      }
    });

    // MAC line breaks

    sample = [
      'Session data: From 2021-06-17, 14:08:39 to 2021-06-17, 17:40:18',
      'Session: 03:31h',
      'Loot Type: Market',
      'Loot: 658,154',
      'Supplies: 585,697',
      'Balance: 72,457',
      'Gold Farmer (Leader)',
      '\tLoot: 58,012',
      '\tSupplies: 540,952',
      '\tBalance: -482,940',
      '\tDamage: 411,207',
      '\tHealing: 870,441',
      'Fake Char',
      '\tLoot: 600,142',
      '\tSupplies: 44,745',
      '\tBalance: 555,397',
      '\tDamage: 8,659',
      '\tHealing: 215,445'
    ].join('\r');

    parsed = parsePartyHuntAnalyser(sample);

    checkParsedParty(parsed, {
      newLine: '\r',
      startedAt: new Date('2021-06-17 14:08:39'),
      endedAt: new Date('2021-06-17 17:40:18'),
      lootType: 'market',
      loot: 658154,
      supplies: 585697,
      members: {
        'Gold Farmer': {
          leader: true,
          loot: 58012,
          supplies: 540952,
          damage: 411207,
          healing: 870441
        },
        'Fake Char': {
          loot: 600142,
          supplies: 44745,
          damage: 8659,
          healing: 215445
        }
      }
    });

    // WINDOWS line breaks

    
  });
});
