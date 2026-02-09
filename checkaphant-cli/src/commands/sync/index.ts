import {Command} from '@oclif/core'

// sync local votes according to trusdb

export default class SyncIndex extends Command {
  static args = {}
  static description = 'Sync votes index'
  static examples = [
    `<%= config.bin %> <%= command.id %>
syncing index! (./src/commands/sync/index.ts)
`,
  ]
  static flags = {}

  async run(): Promise<void> {
    this.log('syncing index! (./src/commands/sync/index.ts)')
  }
}
