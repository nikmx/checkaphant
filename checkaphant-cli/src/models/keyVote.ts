import { registerKeyVote, revokeKeyVote, syncKeyVotesIndex } from '../lib/registry';
import {refreshStoreKeyVotes, NestedKeyVotes, loadStoreKeyVotes, upsertStoreKeyVotes, deleteStoreKeyVotes} from './store'
import {gpg} from '../services/gpg'
const fs = require('node:fs');

export interface KeyVote {
  ts: number;
  kid: string;
  type: string;
  rate: number;
  sig: string;
  sid: string;
  spk: string; // gpg pub-key
  // trust: string; // from gpg trustdb on sig verification!?
}

export const KEY_VOTE_TYPES = ["void", "intent", "suspicious", "danger"]

export const signKeyVote = async (keyVote: KeyVote) => {
  const sid = await gpg.getId()
  const spk = await gpg.getPublicKey()
  keyVote.sid = sid
  keyVote.spk = spk
  const sig = await gpg.signDoc(JSON.stringify(keyVote))
  keyVote.sig = sig
  return keyVote;
};

export const validateKeyVote = async (keyVote: KeyVote) => {
  await gpg.importKey(keyVote.spk)
  const sig = keyVote.sig
  keyVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(keyVote))
};

export const getKeyVotes = (kid: string) => {
  const votes = keyVotes[kid]
  return votes;
};

export const checkKeyVotes = (kid: string) => {
  const votes = getKeyVotes(kid)
  // transform to output format
  return votes;
};

export const setKeyVote = (keyVote: KeyVote, local=false) => {
  if (local) {
    upsertStoreKeyVotes([keyVote])
    keyVotes = loadStoreKeyVotes()
  } else {
    registerKeyVote(keyVote)
  }
};

export const unsetKeyVote = (keyVote: KeyVote, local=false) => {
  if (local) {
    deleteStoreKeyVotes([keyVote])
    keyVotes = loadStoreKeyVotes()
  } else {
    revokeKeyVote(keyVote)
  }
};

export const resetKeyVotes = (keyVotes: KeyVote[]) => {
  refreshStoreKeyVotes(keyVotes)
  keyVotes = loadStoreKeyVotes()
};

export const syncKeyVotes = () => {
  syncKeyVotesIndex()
}

export let keyVotes: NestedKeyVotes = loadStoreKeyVotes();
