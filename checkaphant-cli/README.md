checkaphant-cli
=================

checkaphant client cli


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/checkaphant-cli.svg)](https://npmjs.org/package/checkaphant-cli)
[![Downloads/week](https://img.shields.io/npm/dw/checkaphant-cli.svg)](https://npmjs.org/package/checkaphant-cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g checkaphant-cli
$ checkaphant-cli COMMAND
running command...
$ checkaphant-cli (--version)
checkaphant-cli/0.0.0 linux-x64 node-v24.13.0
$ checkaphant-cli --help [COMMAND]
USAGE
  $ checkaphant-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`checkaphant-cli check asset URI`](#checkaphant-cli-check-asset-uri)
* [`checkaphant-cli check key KID`](#checkaphant-cli-check-key-kid)
* [`checkaphant-cli sync`](#checkaphant-cli-sync)
* [`checkaphant-cli vote asset URI`](#checkaphant-cli-vote-asset-uri)
* [`checkaphant-cli vote key KID`](#checkaphant-cli-vote-key-kid)

## `checkaphant-cli check asset URI`

check asset votes

```
USAGE
  $ checkaphant-cli check asset URI [--hash <value>] [--asset <value>] [--format <value>]

ARGUMENTS
  URI  asset uri

FLAGS
  --asset=<value>   asset path
  --format=<value>  asset format
  --hash=<value>    asset hash

DESCRIPTION
  check asset votes

EXAMPLES
  $ checkaphant-cli check asset https://some-unknown-source.ahoi --asset=some-formatted-asset-content.file
```

_See code: [src/commands/check/asset.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/check/asset.ts)_

## `checkaphant-cli check key KID`

check key votes

```
USAGE
  $ checkaphant-cli check key KID

ARGUMENTS
  KID  gpg key-id

DESCRIPTION
  check key votes

EXAMPLES
  $ checkaphant-cli check key some-gpg-key-id
  ...
```

_See code: [src/commands/check/key.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/check/key.ts)_

## `checkaphant-cli sync`

sync votes index

```
USAGE
  $ checkaphant-cli sync

DESCRIPTION
  sync votes index

EXAMPLES
  $ checkaphant-cli sync
  synced key/asset index! (./src/commands/sync/index.ts)
```

_See code: [src/commands/sync/index.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/sync/index.ts)_

## `checkaphant-cli vote asset URI`

vote asset

```
USAGE
  $ checkaphant-cli vote asset URI [--hash <value>] [--asset <value>] [--format <value>] [--type
    void|intent|process|execute|suspicious|danger] [--rate <value>] [--model <value>] [-l] [-r]

ARGUMENTS
  URI  uri

FLAGS
  -l, --local           vote locally
  -r, --revoke          revoke
      --asset=<value>   asset path
      --format=<value>  asset format
      --hash=<value>    asset hash
      --model=<value>   [default: any] vote model
      --rate=<value>    [default: 1] vote rate
      --type=<option>   [default: void] vote type
                        <options: void|intent|process|execute|suspicious|danger>

DESCRIPTION
  vote asset

EXAMPLES
  $ checkaphant-cli vote asset
```

_See code: [src/commands/vote/asset.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/vote/asset.ts)_

## `checkaphant-cli vote key KID`

vote key

```
USAGE
  $ checkaphant-cli vote key KID [--type void|intent|suspicious|danger] [--rate <value>] [-l <value>] [-r]

ARGUMENTS
  KID  gpg key-id

FLAGS
  -l, --local=<value>  vote locally
  -r, --revoke         revoke vote
      --rate=<value>   vote rate in [-10,10]
      --type=<option>  vote type
                       <options: void|intent|suspicious|danger>

DESCRIPTION
  vote key

EXAMPLES
  $ checkaphant-cli vote key some-gpg-key-id
```

_See code: [src/commands/vote/key.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/vote/key.ts)_
<!-- commandsstop -->
