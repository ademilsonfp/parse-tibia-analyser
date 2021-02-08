
import testCase from 'ava';

import parseGameAnalyser, {
  ParsedGameAnalyser,
  ParsedHuntingSession,
  ParsedPartyHunt
} from '../src';

const calcDuration = function (startedAt: number, finishedAt: number) {
  var duration = finishedAt - startedAt;
  duration -= duration % 60000;
  return duration;
};

testCase('Should parse any game analyser content', function (test) {
  var inputContent: string;
  var parsedResult: ParsedGameAnalyser<{}>;

  const expected = {
    startedAt: null as number,
    finishedAt: null as number,
    duration: null as number
  };

  inputContent = [
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

  parsedResult = parseGameAnalyser(inputContent);

  expected.startedAt = new Date(2020, 10 - 1, 4, 8, 31, 9).getTime();
  expected.finishedAt = new Date(2020, 10 - 1, 4, 10, 0, 8).getTime();
  expected.duration = calcDuration(expected.startedAt, expected.finishedAt);

  test.deepEqual(parsedResult, {
    type: 'hunting-session',
    data: {
      lineBreak: 'unix',
      indentation: 'tab',
      startedAt: expected.startedAt,
      finishedAt: expected.finishedAt,
      duration: expected.duration,
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
        'great health potion': {
          count: 14,
          indefiniteArticle: 'a'
        },
        'crystal ring': {
          count: 1,
          indefiniteArticle: 'a'
        },
        'gold coin': {
          count: 11201,
          indefiniteArticle: 'a'
        },
        'small amethyst': {
          count: 20,
          indefiniteArticle: 'a'
        },
        'platinum coin': {
          count: 9,
          indefiniteArticle: 'a'
        },
        'terra rod': {
          count: 24,
          indefiniteArticle: 'a'
        },
        'orichalcum pearl': {
          count: 2,
          indefiniteArticle: 'an'
        },
        'red piece of cloth': {
          count: 5,
          indefiniteArticle: 'a'
        },
        'soul orb': {
          count: 21,
          indefiniteArticle: 'a'
        },
        'demonic essence': {
          count: 27,
          indefiniteArticle: null
        },
        'concentrated demonic blood': {
          count: 63,
          indefiniteArticle: null
        },
        'assassin dagger': {
          count: 2,
          indefiniteArticle: 'an'
        },
        'noble axe': {
          count: 2,
          indefiniteArticle: 'a'
        },
        'jalapeno pepper': {
          count: 83,
          indefiniteArticle: 'a'
        },
        'slightly rusted legs': {
          count: 16,
          indefiniteArticle: null
        }
      }
    } as ParsedHuntingSession
  });

  inputContent = [
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

  parsedResult = parseGameAnalyser(inputContent);

  expected.startedAt = new Date(2021, 2 - 1, 17, 23, 43, 48).getTime();
  expected.finishedAt = new Date(2021, 2 - 1, 18, 1, 50, 47).getTime();
  expected.duration = calcDuration(expected.startedAt, expected.finishedAt);

  test.deepEqual(parsedResult, {
    type: 'party-hunt', 
    data: {
      lineBreak: 'unix',
      indentation: 'tab',
      startedAt: expected.startedAt,
      finishedAt: expected.finishedAt,
      duration: expected.duration,
      lootType: 'market',
      loot: 64058,
      supplies: 386723,
      balance: -322665,
      members: {
        'Hello Dev': {
          leader: false,
          loot: 19701,
          supplies: 352150,
          balance: -332449,
          damage: 167993,
          healing: 4853
        },
        'Ninja Hunter': {
          leader: true,
          loot: 44357,
          supplies: 34573,
          balance: 9784,
          damage: 6762,
          healing: 113443
        }
      }
    } as ParsedPartyHunt
  });
});
