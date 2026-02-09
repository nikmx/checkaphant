import {Args, Command, Flags} from '@oclif/core'

export default class Check extends Command {
  static args = {}
  static description = 'Check votes of assets or keys'
  static examples = [
    `<%= config.bin %> <%= command.id %> (./src/commands/check/index.ts)
`,
  ]
  static flags = {
    //from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Check)

    this.log(`check general! (./src/commands/check/index.ts)`)
  }
}
