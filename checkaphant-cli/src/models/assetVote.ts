import { createHash } from 'node:crypto'
import {refreshStoreAssetVotes, loadStoreAssetVotes, NestedAssetVotes, upsertStoreAssetVotes} from './store'
import {registerAssetVote} from '../lib/registry'
import {gpg} from '../services/gpg'
const fs = require('node:fs');


//import { GPG } from 'gpg-ts'

export interface AssetVote {
  ts: number;
  uri: string;
  format: string; // format how to consume content
  hash: string; // sha-512 of consumed content
  type: string;
  rate: number;
  model: string;
  sig: string;
  sid: string;
  spk: string; // gpg pub-key
  // trust: string; // from gpg trustdb on sig verification!?
}

export const ASSET_VOTE_TYPES = ["void", "intent", "process", "execute", "suspicious", "danger"]

export const hashAssetVoteContent = (content: string) => {
  return createHash('sha512').update(content).digest('hex')
};

export const signAssetVote = async (assetVote: AssetVote, asset: string|undefined) => {
  // do we need to fetch the asset
  if(assetVote.hash === '') {
    if(!asset) {
      // fetch content per uri/format
      throw new Error("Asset resolution not integrated yet, provide hash or local formatted asset path.")
    }
    assetVote.hash = hashAssetVoteContent(fs.readFileSync(asset))
  }
  const sid = await gpg.getId()
  const spk = await gpg.getPublicKey()
  assetVote.sid = sid
  assetVote.spk = spk
  const sig = await gpg.signDoc(JSON.stringify(assetVote))
  assetVote.sig = sig
  return assetVote;
};

export const validateAssetVote = async (assetVote: AssetVote) => {
  await gpg.importKey(assetVote.spk)
  const sig = assetVote.sig
  assetVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(assetVote))
};

export const getAssetVotes = (uri: string, hash: string) => {
  const votes = assetVotes[uri][hash]
  return votes;
};

export const checkAssetVotes = (uri: string, hash: string) => {
  const votes = getAssetVotes(uri, hash)
  // transform to output format
  return votes;
};

export const setAssetVote = (assetVote: AssetVote, local=false) => {
  if (local) {
    upsertStoreAssetVotes([assetVote])
    assetVotes = loadStoreAssetVotes()
  } else {
    registerAssetVote(assetVote)
  }
};

export const resetAssetVotes = (assetVotes: AssetVote[]) => {
  refreshStoreAssetVotes(assetVotes)
  assetVotes = loadStoreAssetVotes()
};

export let assetVotes: NestedAssetVotes = loadStoreAssetVotes();
