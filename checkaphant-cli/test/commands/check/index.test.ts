import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('check asset', () => {
  it('runs check asset cmd', async () => {
    const {stdout} = await runCommand('check asset ...')
    expect(stdout).to.contain('...')
  })
})
