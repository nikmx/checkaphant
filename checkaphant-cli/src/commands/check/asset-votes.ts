import {Args, Command, Flags} from '@oclif/core'
import { assetVotes, AssetVote, checkAssetVotes } from '../../models/assetVote';

export default class CheckAssetVote extends Command {
  static args = {
    uri: Args.string({description: 'asset uri', required: true}),    
  }
  static description = 'check asset votes'
  static examples = [
    `<%= config.bin %> <%= command.id %> https://some-unknown-source.ahoi --asset=some-formatted-asset-content.file`
  ]
  static flags = {
    hash: Flags.string({description: 'asset hash', required: false}),
    asset: Flags.string({description: 'asset path', required: false}),
    format: Flags.string({description: 'asset format', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckAssetVote)

    const res = checkAssetVotes(args.uri, flags.hash, flags.asset, flags.format)
    this.log(`check result:\n\n${JSON.stringify(res)}\n`)
  }
}
