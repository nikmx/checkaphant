import {Args, Command, Flags} from '@oclif/core'
import { assetVotes, AssetVote, signAssetVote, setAssetVote, unsetAssetVote, hashAssetVoteContent } from '../../models/assetVote'

export default class VoteAsset extends Command {
  static args = {
      uri: Args.string({description: 'uri', required: true}),    
    }
  static description = 'Vote asset'
  static examples = [
    `<%= config.bin %> <%= command.id %>
voting asset ...! (./src/commands/vote/asset.ts)
`,
  ]
  static flags = {
    hash: Flags.string({description: 'hash', required: false}),
    asset: Flags.string({description: 'asset path', required: false}),
    format: Flags.string({description: 'format', required: false}),
    type: Flags.string({description: 'type', required: true}),
    rate: Flags.integer({description: 'rate', required: true}),
    model: Flags.string({description: 'model', required: true}),
    local: Flags.boolean({char: 'l', description: 'vote locally', required: false}),
    revoke: Flags.boolean({char: 'r', description: 'revoke', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(VoteAsset)    

    let newAssetVote: AssetVote = {
      ts: Date.now(), 
      uri: args.uri,
      format: flags.format || '',
      hash: flags.hash || '',
      type: flags.type,
      rate: flags.rate,
      model: flags.model,
      sid: '',
      sig: '',
      spk: ''
    }

    newAssetVote = await signAssetVote(newAssetVote, flags.asset)
    if(flags.revoke)
      unsetAssetVote(newAssetVote, !!flags.local)
    else
      setAssetVote(newAssetVote, !!flags.local)
  }
}
