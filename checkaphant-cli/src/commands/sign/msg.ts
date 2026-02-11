import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';
import { getCurrentDigitalIdentity } from '../../models/digitalIdentity';
import { signTextMessage, TextMessage } from '../../models/textMessage';

export default class SignTextMessage extends Command {
  static args = {
    txt: Args.string({description: 'text to sign', required: true})
  }
  static description = 'sign a text message'
  static examples = [
    `<%= config.bin %> <%= command.id %> "some-message-block"
...
`,
  ]
  static flags = {}

  async run(): Promise<void> {
    const {args, flags} = await this.parse(SignTextMessage)
    let msg: TextMessage = {
      txt: args.txt,
      sig: ''
    }    
    msg = await signTextMessage(msg)
    this.log(`${msg.sig}`)
  }
}
