import {GpgClient} from '../lib/gpg';
import config from '../config/config'

export const gpg = new GpgClient('gpg', config.keyringFile, config.keyId)