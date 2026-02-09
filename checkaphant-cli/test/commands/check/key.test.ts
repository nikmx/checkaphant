import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('check key', () => {
  it('runs check key cmd', async () => {
    const {stdout} = await runCommand('check key ...')
    expect(stdout).to.contain('...')
  })
})
