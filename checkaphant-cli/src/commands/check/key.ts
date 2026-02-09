import {Args, Command, Flags} from '@oclif/core'
import { keyVotes, KeyVote, checkKeyVotes } from '../../models/keyVote';

export default class CheckKey extends Command {
  static args = {
    kid: Args.string({description: 'Key id', required: true})
  }
  static description = 'Check key votes'
  static examples = [
    `<%= config.bin %> <%= command.id %> https://some-unknown-source.ahoi
checking https://some-unknown-source.ahoi! (./src/commands/check/index.ts)
`,
  ]
  static flags = {
    //from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(CheckKey)

    const res = checkKeyVotes(args.kid)
    this.log(`Check result:\n\n${JSON.stringify(res)}\n\n(./src/commands/check/key.ts)`)
  }
}
