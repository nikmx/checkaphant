
interface Config {
  port: number;
  nodeEnv: string;
  indexFile: string;
  keyringFile: string|null;
  keyId: string|null;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  indexFile: process.env.CHECKAPHANT_INDEX_FILE || '.store.db',
  keyringFile: process.env.CHECKAPHANT_KEYRING_FILE || null,
  keyId: process.env.CHECKAPHANT_PUBKEY_ID || ''
};

if(!config.keyId)
  throw Error("You need to provide the gpg key-id to use via env variable e.g. `CHECKAPHANT_PUBKEY_ID=my@user.sample`")

export default config;
