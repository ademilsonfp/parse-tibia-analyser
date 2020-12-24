
## Description

Parse contents from [Tibia] found in _Copy to clipboard_ button, which is
present in some dialogs of _[Analytics Selector]_.

Supported contents:

* _Hunting Session Analyser_
* _Party Hunt Analyser_

Apps commonly used by players to share those contents like [Discord] can change
the standard tabular indentations to spaces, so the parsers also supports
consistent space indentations of two, four and eight spaces.

## Dependencies

```bash
$ npm install
```

## Development and tests

Running tests continuously as source code changes:

```bash
# watch mode
$ npm run dev
```

Running tests at only once:

```bash
$ npm run test
```

Generating code coverage report (Istanbul):

```bash
$ npm run coverage
```

## Documentation

Generating HTML reference documentation (TypeDoc):

```bash
$ npm run docs
```

[Tibia]: https://www.tibia.com/news/
[Analytics Selector]: https://www.tibia.com/gameguides/?subtopic=manual&section=interface#analyticsselector
[Discord]: https://discord.com/
