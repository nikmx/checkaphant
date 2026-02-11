import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';

export default class CheckKeyVoteCommand extends Command {
  static args = {
    kid: Args.string({description: 'gpg key-id', required: true})
  }
  static description = 'check key votes'
  static examples = [
    `<%= config.bin %> <%= command.id %> some-gpg-key-id
...
`,
  ]
  static flags = {}

  async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckKeyVoteCommand)

    const res = checkKeyVotes(args.kid)
    this.log(`${JSON.stringify(res)}`)
  }
}
