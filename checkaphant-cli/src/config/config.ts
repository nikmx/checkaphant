interface Config {
  relays: string[];
  nodeEnv: string;
  indexFile: string;
  keyringFile: string|null;
  keyId: string|null;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  relays: [process.env.CHECKAPHANT_RELAY || "http://localhost:3000"],
  indexFile: process.env.CHECKAPHANT_INDEX_FILE || '.store.db',
  keyringFile: process.env.CHECKAPHANT_KEYRING_FILE || null,
  keyId: process.env.CHECKAPHANT_PUBKEY_ID || null,  
};

export default config;