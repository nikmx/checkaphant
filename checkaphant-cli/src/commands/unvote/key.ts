import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, signKeyVote, setKeyVote } from '../../models/keyVote';
import {registerKeyVote} from '../../lib/registry';

export default class UnvoteKey extends Command {
  static args = {
        kid: Args.string({description: 'uri', required: true}),
      }
  static description = 'Unvote key'
  static examples = [
    `<%= config.bin %> <%= command.id %>
voting key ...! (./src/commands/vote/key.ts)
`,
  ]
  static flags = {
    local: Flags.string({char: 'l', description: 'Vote locally', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(UnvoteKey)
     
  }
}
