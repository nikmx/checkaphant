import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, signKeyVote, setKeyVote, unsetKeyVote } from '../../models/keyVote';
import { registerKeyVote } from '../../lib/registry';
import { gpg } from '../../services/gpg'

export default class VoteKey extends Command {
  static args = {
        kid: Args.string({description: 'uri', required: true}),
      }
  static description = 'Vote key'
  static examples = [
    `<%= config.bin %> <%= command.id %>
voting key ...! (./src/commands/vote/key.ts)
`,
  ]
  static flags = {
    type: Flags.string({description: 'type', required: true}),
    rate: Flags.integer({description: 'rate', required: true}),
    local: Flags.string({char: 'l', description: 'vote locally', required: false}),
    revoke: Flags.boolean({char: 'r', description: 'revoke', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(VoteKey)

    let newKeyVote: KeyVote = {
      ts: Date.now(),
      kid: args.kid,
      type: flags.type,
      rate: flags.rate,
      sid: '',
      sig: '',
      spk: ''
    }
    
    newKeyVote = await signKeyVote(newKeyVote)
    if(flags.revoke)
      unsetKeyVote(newKeyVote, !!flags.local)
    else
      setKeyVote(newKeyVote, !!flags.local)
  }
}
