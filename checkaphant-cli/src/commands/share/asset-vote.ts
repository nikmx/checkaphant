import {Args, Command, Flags} from '@oclif/core'
import { assetVotes, AssetVote, signAssetVote, setAssetVote, unsetAssetVote, hashAssetVoteContent, ASSET_VOTE_TYPES } from '../../models/assetVote'
import { getCurrentDigitalIdentity } from '../../models/digitalIdentity'

export default class ShareAssetVote extends Command {
  static args = {
      uri: Args.string({description: 'uri', required: true}),    
    }
  static description = 'sign asset vote'
  static examples = [
    `<%= config.bin %> <%= command.id %>
`,
  ]
  static flags = {
    hash: Flags.string({description: 'asset hash', required: false}),
    asset: Flags.string({description: 'asset path', required: false}),
    format: Flags.string({description: 'asset format', required: false}),
    type: Flags.string({description: 'vote type', required: false, options: ASSET_VOTE_TYPES, default: 'void'}),
    rate: Flags.integer({description: 'vote rate', required: false, default: 1}),
    model: Flags.string({description: 'vote model', required: false, default: 'any'}),
    local: Flags.boolean({char: 'l', description: 'vote locally', required: false}),
    revoke: Flags.boolean({char: 'r', description: 'revoke', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ShareAssetVote)    
    const dId = await getCurrentDigitalIdentity()
    let newAssetVote: AssetVote = {
      ts: Date.now(), 
      uri: args.uri,
      format: flags.format || '',
      hash: flags.hash || '',
      type: flags.type,
      rate: flags.rate,
      model: flags.model,
      sid: dId.id,
      sig: ''
    }
    newAssetVote = await signAssetVote(newAssetVote, flags.asset)
    if(flags.revoke)
      unsetAssetVote(newAssetVote, dId, !!flags.local)
    else
      setAssetVote(newAssetVote, dId, !!flags.local)
  }
}
