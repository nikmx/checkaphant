import {Args, Command, Flags} from '@oclif/core'
import { assetVotes, AssetVote, signAssetVote, setAssetVote } from '../../models/assetVote'
import {gpg} from '../../services/gpg'
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const fs = require('node:fs');

export default class VoteAsset extends Command {
  static args = {
      uri: Args.string({description: 'uri', required: true}),
      hash: Args.string({description: 'hash', required: true}),
    }
  static description = 'Vote asset'
  static examples = [
    `<%= config.bin %> <%= command.id %>
voting asset ...! (./src/commands/vote/asset.ts)
`,
  ]
  static flags = {
    format: Flags.string({description: 'format', required: true}),
    type: Flags.string({description: 'type', required: true}),
    rate: Flags.integer({description: 'rate', required: true}),
    model: Flags.string({description: 'model', required: true}),
    local: Flags.boolean({char: 'l'}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(VoteAsset)
    const newAssetVote: AssetVote = {
      ts: Date.now(), 
      uri: args.uri,
      format: flags.format,
      hash: args.hash,
      type: flags.type,
      rate: flags.rate,
      model: flags.model,
      sid: await gpg.getId(),
      sig: '',
      spk: ''
    }    

    const docFile = "test.json"
    const sigFile = "test.json.sig"

    fs.writeFileSync(docFile, JSON.stringify(newAssetVote));

    const rl = createInterface({
      input: stdin,
      output: stdout,
    });
    console.log("Please sign the vote now using following command:")
    console.log(`\`${gpg.getSignDocCmd("vote.test")}\``)
    console.log("\n\n")
    
    newAssetVote.spk = await gpg.getPublicKey();

    rl.question("Hit enter when you are done.", (str) => {
      newAssetVote.sig = fs.readFileSync(sigFile, 'utf8');
      setAssetVote(newAssetVote)
      
      if(flags.local) {
        this.log('Register vote locally! (./src/commands/vote/asset.ts)')
      } else {      
        this.log('Register in chain! (./src/commands/vote/asset.ts)')
      }
      rl.close();}
    );

  }
}
