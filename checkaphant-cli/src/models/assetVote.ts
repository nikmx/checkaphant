import { createHash } from 'node:crypto'
import {refreshStoreAssetVotes, loadStoreAssetVotes, NestedAssetVotes, upsertStoreAssetVotes} from './store'
import {registerAssetVote} from '../lib/registry'

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

export const signAssetVote = (assetVote: AssetVote) => {
  //GPG.clearsign(JSON.stringify(assetVote), (sig: string) => assetVote.sig = sig);
  return assetVote;
};

export const validateAssetVote = (assetVote: AssetVote) => {
  // validate gpg sig/sid
  //GPG.verifySignature("...", fn...);
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
