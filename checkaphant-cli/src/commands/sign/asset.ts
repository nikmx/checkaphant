import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';
import { getCurrentDigitalIdentity } from '../../models/digitalIdentity';
import { signDigitalAsset, DigitalAsset } from '../../models/digitalAsset';

export default class SignDigitalAssetCommand extends Command {
  static args = {
    content: Args.string({description: 'content to sign', required: true})
  }
  static description = 'sign an asset'
  static examples = [
    `<%= config.bin %> <%= command.id %> "content or path see flags"
...
`,
  ]
  static flags = {
    file: Flags.boolean({char: 'f', description: 'text is a file', required: false}),
    sig: Flags.string({description: 'sig or path', required: false, default: ''}),
    sigfile: Flags.boolean({description: 'sig is a file', required: false}),
    format: Flags.string({description: 'content format', required: false, default: ''}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(SignDigitalAssetCommand)
    let asset: DigitalAsset = {
      content: args.content,
      format: flags.format,
      isFile: flags.file || false,
      sig: flags.sig,
      sigIsFile: flags.sigfile || false
    }
    asset = await signDigitalAsset(asset)
    this.log(`${asset.sig}`)
  }
}
