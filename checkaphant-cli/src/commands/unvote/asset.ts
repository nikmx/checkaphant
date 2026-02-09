import {Args, Command, Flags} from '@oclif/core'
import { assetVotes, AssetVote, signAssetVote, setAssetVote } from '../../models/assetVote'

export default class UnvoteAsset extends Command {
  static args = {
      uri: Args.string({description: 'uri', required: true}),
      model: Args.string({description: 'model', required: true}),
    }
  static description = 'Revoke asset vote'
  static examples = [
    `<%= config.bin %> <%= command.id %>
voting asset ...! (./src/commands/vote/asset.ts)
`,
  ]
  static flags = {
    local: Flags.boolean({char: 'l'}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(UnvoteAsset)
    // 
  }
}
