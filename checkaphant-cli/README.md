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
* [`checkaphant-cli hello PERSON`](#checkaphant-cli-hello-person)
* [`checkaphant-cli hello world`](#checkaphant-cli-hello-world)
* [`checkaphant-cli help [COMMAND]`](#checkaphant-cli-help-command)
* [`checkaphant-cli plugins`](#checkaphant-cli-plugins)
* [`checkaphant-cli plugins add PLUGIN`](#checkaphant-cli-plugins-add-plugin)
* [`checkaphant-cli plugins:inspect PLUGIN...`](#checkaphant-cli-pluginsinspect-plugin)
* [`checkaphant-cli plugins install PLUGIN`](#checkaphant-cli-plugins-install-plugin)
* [`checkaphant-cli plugins link PATH`](#checkaphant-cli-plugins-link-path)
* [`checkaphant-cli plugins remove [PLUGIN]`](#checkaphant-cli-plugins-remove-plugin)
* [`checkaphant-cli plugins reset`](#checkaphant-cli-plugins-reset)
* [`checkaphant-cli plugins uninstall [PLUGIN]`](#checkaphant-cli-plugins-uninstall-plugin)
* [`checkaphant-cli plugins unlink [PLUGIN]`](#checkaphant-cli-plugins-unlink-plugin)
* [`checkaphant-cli plugins update`](#checkaphant-cli-plugins-update)

## `checkaphant-cli hello PERSON`

Say hello

```
USAGE
  $ checkaphant-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ checkaphant-cli hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/nikmx/checkaphant-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `checkaphant-cli hello world`

Say hello world

```
USAGE
  $ checkaphant-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ checkaphant-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/nikmx/checkaphant-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `checkaphant-cli help [COMMAND]`

Display help for checkaphant-cli.

```
USAGE
  $ checkaphant-cli help [COMMAND...] [-n]

ARGUMENTS
  [COMMAND...]  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for checkaphant-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.37/src/commands/help.ts)_

## `checkaphant-cli plugins`

List installed plugins.

```
USAGE
  $ checkaphant-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ checkaphant-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/index.ts)_

## `checkaphant-cli plugins add PLUGIN`

Installs a plugin into checkaphant-cli.

```
USAGE
  $ checkaphant-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into checkaphant-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the checkaphant_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the checkaphant_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ checkaphant-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ checkaphant-cli plugins add myplugin

  Install a plugin from a github url.

    $ checkaphant-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ checkaphant-cli plugins add someuser/someplugin
```

## `checkaphant-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ checkaphant-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ checkaphant-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/inspect.ts)_

## `checkaphant-cli plugins install PLUGIN`

Installs a plugin into checkaphant-cli.

```
USAGE
  $ checkaphant-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into checkaphant-cli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the checkaphant_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the checkaphant_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ checkaphant-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ checkaphant-cli plugins install myplugin

  Install a plugin from a github url.

    $ checkaphant-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ checkaphant-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/install.ts)_

## `checkaphant-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ checkaphant-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ checkaphant-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/link.ts)_

## `checkaphant-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ checkaphant-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ checkaphant-cli plugins unlink
  $ checkaphant-cli plugins remove

EXAMPLES
  $ checkaphant-cli plugins remove myplugin
```

## `checkaphant-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ checkaphant-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/reset.ts)_

## `checkaphant-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ checkaphant-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ checkaphant-cli plugins unlink
  $ checkaphant-cli plugins remove

EXAMPLES
  $ checkaphant-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/uninstall.ts)_

## `checkaphant-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ checkaphant-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  [PLUGIN...]  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ checkaphant-cli plugins unlink
  $ checkaphant-cli plugins remove

EXAMPLES
  $ checkaphant-cli plugins unlink myplugin
```

## `checkaphant-cli plugins update`

Update installed plugins.

```
USAGE
  $ checkaphant-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.55/src/commands/plugins/update.ts)_
<!-- commandsstop -->
