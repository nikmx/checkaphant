import {Args, Command, Flags} from '@oclif/core'
import { assetVotes, AssetVote, checkAssetVotes } from '../../models/assetVote';

export default class CheckAsset extends Command {
  static args = {
    uri: Args.string({description: 'Asset uri', required: true}),
    hash: Args.string({description: 'Asset hash', required: true}),
  }
  static description = 'Check asset votes'
  static examples = [
    `<%= config.bin %> <%= command.id %> https://some-unknown-source.ahoi
checking https://some-unknown-source.ahoi! (./src/commands/check/index.ts)
`,
  ]
  static flags = {
    //from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckAsset)

    const res = checkAssetVotes(args.uri, args.hash)
    this.log(`Check result:\n${JSON.stringify(res)}! (./src/commands/check/asset.ts)`)
  }
}
