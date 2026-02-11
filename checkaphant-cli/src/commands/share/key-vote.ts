import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, signKeyVote, setKeyVote, unsetKeyVote, KEY_VOTE_TYPES } from '../../models/keyVote';
import { registerKeyVote } from '../../lib/registry';
import { gpg } from '../../services/gpg'
import { getCurrentDigitalIdentity } from '../../models/digitalIdentity';

export default class ShareKeyVote extends Command {
  static args = {
        kid: Args.string({description: 'gpg key-id', required: true}),
      }
  static description = 'sign key vote'
  static examples = [
    `<%= config.bin %> <%= command.id %> some-gpg-key-id
`,
  ]
  static flags = {
    type: Flags.string({description: 'vote type', required: false, options: KEY_VOTE_TYPES}),
    rate: Flags.integer({description: 'vote rate in [-10,10]', required: false}),
    local: Flags.string({char: 'l', description: 'vote locally', required: false}),
    revoke: Flags.boolean({char: 'r', description: 'revoke vote', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ShareKeyVote)
    const dId = await getCurrentDigitalIdentity()
    let newKeyVote: KeyVote = {
      ts: Date.now(),
      kid: args.kid,
      type: flags.type || 'void',
      rate: flags.rate || 1,
      sid: dId.id,
      sig: ''
    }    
    newKeyVote = await signKeyVote(newKeyVote)
    if(flags.revoke)
      unsetKeyVote(newKeyVote, dId, !!flags.local)
    else
      setKeyVote(newKeyVote,dId, !!flags.local)
  }
}
