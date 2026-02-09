import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';

export default class CheckKey extends Command {
  static args = {
    kid: Args.string({description: 'gpg key-id', required: true})
  }
  static description = 'check key votes'
  static examples = [
    `<%= config.bin %> <%= command.id %> some-gpg-key-id
...
`,
  ]
  static flags = {
    //from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckKey)

    const res = checkKeyVotes(args.kid)
    this.log(`check result:\n\n${JSON.stringify(res)}\n\n(./src/commands/check/key.ts)`)
  }
}
