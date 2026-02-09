import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, signKeyVote, setKeyVote } from '../../models/keyVote';
import {registerKeyVote} from '../../lib/registry';

export default class VoteKey extends Command {
  static args = {
        kid: Args.string({description: 'uri', required: true}),
        type: Args.string({description: 'type', required: true}),
        rate: Args.integer({description: 'rate', required: true})
      }
  static description = 'Vote key'
  static examples = [
    `<%= config.bin %> <%= command.id %>
voting key ...! (./src/commands/vote/key.ts)
`,
  ]
  static flags = {
    local: Flags.string({char: 'l', description: 'Vote locally', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(VoteKey)
    const newKeyVote: KeyVote = {
      ts: Date.now(),
      kid: args.kid,
      type: args.type,
      rate: args.rate,
      sid: '',
      sig: '',
      spk: ''
    }
    const signedKeyVote = signKeyVote(newKeyVote)
    setKeyVote(newKeyVote, !!flags.local)
    
    if(flags.local) {
      this.log('Register vote locally! (./src/commands/vote/key.ts)')
    } else {
      this.log('Register vote in chain! (./src/commands/vote/key.ts)')
    }    
  }
}
