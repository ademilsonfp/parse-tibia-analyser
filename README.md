## Description

Parse contents from [Tibia] found in _Copy to clipboard_ button, which is
present in some dialogs of _[Analytics Selector]_.

Supported contents:

* _Hunting Session Analyser_
* _Party Hunt Analyser_

Apps commonly used by players to share those contents like [Discord] can change
the standard tabular indentations to spaces, so the parsers also supports
consistent space indentations of two, four and eight spaces.

## Index
- [Description](#description)
- [Index](#index)
- [Examples](#examples)
  - [Parsing _Hunting Session Analyser_](#parsing-hunting-session-analyser)
  - [Parsing _Party Hunt Analyser_](#parsing-party-hunt-analyser)
- [Development](#development)
  - [Dependencies](#dependencies)
  - [Tests](#tests)
  - [Documentation](#documentation)
- [License](#license)

## Examples

### Parsing _Hunting Session Analyser_

```ts
import { parseHuntingSessionAnalyser } from 'parse-tibia-analyser';

const result = parseHuntingSessionAnalyser([
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
].join('\n'));

console.log(JSON.stringify(result, null, 2));
```

The code above will output:

```json
{
  "newLine": "\n",
  "startedAt": "2020-10-04, 08:31:09",
  "startedAtValue": "2020-10-04T11:31:09.000Z",
  "endedAt": "2020-10-04, 10:00:08",
  "endedAtValue": "2020-10-04T13:00:08.000Z",
  "duration": "01:28h",
  "durationValue": 5339000,
  "xpGain": "573,043",
  "xpGainValue": 573043,
  "xpPerHour": "175,437",
  "xpPerHourValue": 175437,
  "loot": "165,384",
  "lootValue": 165384,
  "supplies": "25,520",
  "suppliesValue": 25520,
  "balance": "139,864",
  "balanceValue": 139864,
  "damage": "465,202",
  "damageValue": 465202,
  "damagePerHour": "437,860",
  "damagePerHourValue": 437860,
  "healing": "72,451",
  "healingValue": 72451,
  "healingPerHour": "68,045",
  "healingPerHourValue": 68045,
  "killedMonsters": {
    "bug": 1,
    "carniphila": 2,
    "centipede": 3,
    "fury": 106,
    "poison spider": 1,
    "spider": 2,
    "wasp": 1
  },
  "lootedItems": {
    "great health potion": 14,
    "crystal ring": 1,
    "gold coin": 11201,
    "small amethyst": 20,
    "platinum coin": 9,
    "terra rod": 24,
    "orichalcum pearl": 2,
    "red piece of cloth": 5,
    "soul orb": 21,
    "demonic essence": 27,
    "concentrated demonic blood": 63,
    "assassin dagger": 2,
    "noble axe": 2,
    "jalapeno pepper": 83,
    "slightly rusted legs": 16
  }
}
```

### Parsing _Party Hunt Analyser_

```ts
import { parsePartyHuntAnalyser } from 'parse-tibia-analyser';

const result = parsePartyHuntAnalyser([
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
]);

console.log(JSON.stringify(result, null, 2));
```
The code above will output:

```json
{
  "newLine": "\n",
  "startedAt": "2021-02-17, 23:43:48",
  "startedAtValue": "2021-02-18T02:43:48.000Z",
  "endedAt": "2021-02-18, 01:50:47",
  "endedAtValue": "2021-02-18T04:50:47.000Z",
  "duration": "02:06h",
  "durationValue": 7619000,
  "lootType": "market",
  "loot": "64,058",
  "lootValue": 64058,
  "supplies": "386,723",
  "suppliesValue": 386723,
  "balance": "-322,665",
  "balanceValue": -322665,
  "members": {
    "Hello Dev": {
      "leader": false,
      "loot": "19,701",
      "lootValue": 19701,
      "supplies": "352,150",
      "suppliesValue": 352150,
      "balance": "-332,449",
      "balanceValue": -332449,
      "damage": "167,993",
      "damageValue": 167993,
      "healing": "4,853",
      "healingValue": 4853
    },
    "Ninja Hunter": {
      "leader": true,
      "loot": "44,357",
      "lootValue": 44357,
      "supplies": "34,573",
      "suppliesValue": 34573,
      "balance": "9,784",
      "balanceValue": 9784,
      "damage": "6,762",
      "damageValue": 6762,
      "healing": "113,443",
      "healingValue": 113443
    }
  }
}
```

## Development

### Dependencies

Installing dependencies:

```bash
$ yarn install
```

### Tests

Running tests continuously as source code changes:

```bash
# watch mode
$ yarn run dev
```

Running tests at only once:

```bash
$ yarn run test
```

Generating code coverage report (Istanbul):

```bash
$ yarn run coverage
```

### Documentation

Generating HTML reference documentation (TypeDoc):

```bash
$ yarn run docs
```

## License

[MIT]

Copyright (c) 2020, Ademilson Ferreira Pinto

[Tibia]: https://www.tibia.com/news/
[Analytics Selector]: https://www.tibia.com/gameguides/?subtopic=manual&section=interface#analyticsselector
[Discord]: https://discord.com/
[MIT]: https://opensource.org/licenses/MIT
