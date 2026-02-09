import {Command} from '@oclif/core'
import { syncKeyVotes } from '../../models/keyVote'
import { syncAssetVotes } from '../../models/assetVote'

// sync local votes according to trusdb

export default class SyncIndex extends Command {
  static args = {}
  static description = 'sync votes index'
  static examples = [
    `<%= config.bin %> <%= command.id %>
synced key/asset index! (./src/commands/sync/index.ts)
`,
  ]
  static flags = {}

  async run(): Promise<void> {
    syncKeyVotes()
    syncAssetVotes()
    this.log('synced key/asset index! (./src/commands/sync/index.ts)')
  }
}
