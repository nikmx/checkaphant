import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';
import { getCurrentDigitalIdentity } from '../../models/digitalIdentity';
import { signTextMessage, TextMessage, validateTextMessage } from '../../models/textMessage';

export default class VerifyTextMessage extends Command {
  static args = {
    txt: Args.string({description: 'unsigned text', required: true})
  }
  static description = 'verify a signed text message'
  static examples = [
    `<%= config.bin %> <%= command.id %> "some-message-block" --sig="detached-gpg-sig"
...
`,
  ]
  static flags = {
    sig: Flags.string({char: 's', description: 'gpg detached signature', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(VerifyTextMessage)
    let msg: TextMessage = {
      txt: args.txt,
      sig: flags.sig
    }    
    // const dId = await getCurrentDigitalIdentity()
    await validateTextMessage(msg, undefined)
  }
}
