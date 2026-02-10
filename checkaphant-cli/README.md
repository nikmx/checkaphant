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
* [`checkaphant-cli check asset-votes URI`](#checkaphant-cli-check-asset-votes-uri)
* [`checkaphant-cli check key-votes KID`](#checkaphant-cli-check-key-votes-kid)
* [`checkaphant-cli sign asset-vote URI`](#checkaphant-cli-sign-asset-vote-uri)
* [`checkaphant-cli sign key-vote KID`](#checkaphant-cli-sign-key-vote-kid)
* [`checkaphant-cli sync`](#checkaphant-cli-sync)

## `checkaphant-cli check asset-votes URI`

check asset votes

```
USAGE
  $ checkaphant-cli check asset-votes URI [--hash <value>] [--asset <value>] [--format <value>]

ARGUMENTS
  URI  asset uri

FLAGS
  --asset=<value>   asset path
  --format=<value>  asset format
  --hash=<value>    asset hash

DESCRIPTION
  check asset votes

EXAMPLES
  $ checkaphant-cli check asset-votes https://some-unknown-source.ahoi --asset=some-formatted-asset-content.file
```

_See code: [src/commands/check/asset-votes.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/check/asset-votes.ts)_

## `checkaphant-cli check key-votes KID`

check key votes

```
USAGE
  $ checkaphant-cli check key-votes KID

ARGUMENTS
  KID  gpg key-id

DESCRIPTION
  check key votes

EXAMPLES
  $ checkaphant-cli check key-votes some-gpg-key-id
  ...
```

_See code: [src/commands/check/key-votes.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/check/key-votes.ts)_

## `checkaphant-cli sign asset-vote URI`

sign asset vote

```
USAGE
  $ checkaphant-cli sign asset-vote URI [--hash <value>] [--asset <value>] [--format <value>] [--type
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
  sign asset vote

EXAMPLES
  $ checkaphant-cli sign asset-vote
```

_See code: [src/commands/sign/asset-vote.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/sign/asset-vote.ts)_

## `checkaphant-cli sign key-vote KID`

sign key vote

```
USAGE
  $ checkaphant-cli sign key-vote KID [--type void|intent|suspicious|danger] [--rate <value>] [-l <value>] [-r]

ARGUMENTS
  KID  gpg key-id

FLAGS
  -l, --local=<value>  vote locally
  -r, --revoke         revoke vote
      --rate=<value>   vote rate in [-10,10]
      --type=<option>  vote type
                       <options: void|intent|suspicious|danger>

DESCRIPTION
  sign key vote

EXAMPLES
  $ checkaphant-cli sign key-vote some-gpg-key-id
```

_See code: [src/commands/sign/key-vote.ts](https://github.com/nikmx/demo-checkaphant/blob/v0.0.0/src/commands/sign/key-vote.ts)_

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
<!-- commandsstop -->
