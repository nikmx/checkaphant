interface Config {
  relays: string[];
  nodeEnv: string;
  indexFile: string;
  keyringFile: string|null;
  keyId: string|null;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  relays: [process.env.checkaphant_RELAY || "localhost:3000"],
  indexFile: process.env.checkaphant_INDEX_FILE || '.store.db',
  keyringFile: process.env.checkaphant_KEYRING_FILE || null,
  keyId: process.env.checkaphant_PUBKEY_ID || null,  
};

export default config;