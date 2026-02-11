import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';
import { getCurrentDigitalIdentity } from '../../models/digitalIdentity';
import { signDigitalAsset, DigitalAsset, validateDigitalAsset } from '../../models/digitalAsset';

export default class VerifyDigitalAssetCommand extends Command {
  static args = {
    content: Args.string({description: 'unsigned text', required: true})
  }
  static description = 'verify a signed asset'
  static examples = [
    `<%= config.bin %> <%= command.id %> "content or path see flags" --sig "sig or path"
...
`,
  ]
  static flags = {
    file: Flags.boolean({char: 'f', description: 'content is a file', required: false}),
    sig: Flags.string({description: 'path or sig', required: false, default: ''}),
    sigfile: Flags.boolean({description: 'sig is a file', required: false}),
    format: Flags.string({description: 'path or sig', required: false, default: ''}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(VerifyDigitalAssetCommand)
    let asset: DigitalAsset = {
      content: args.content,
      format: flags.format,
      isFile: flags.file || false,
      sig: flags.sig,
      sigIsFile: flags.sigfile || false
    }
    // const dId = await getCurrentDigitalIdentity()
    const res = await validateDigitalAsset(asset, undefined)
    console.log(res)
  }
}
