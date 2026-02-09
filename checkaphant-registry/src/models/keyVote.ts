import {loadStoreKeyVotes, deleteStoreKeyVotes, upsertStoreKeyVotes, NestedKeyVotes} from './store'
import {gpg} from '../services/gpg'
const fs = require('node:fs');

export interface KeyVote {
  ts: number;
  kid: string;
  hash: string;
  type: string;
  rate: number;
  sig: string;
  sid: string;
  spk: string; // gpg pub-key
}

export const KEY_VOTE_TYPES = ["void", "intent", "suspicious", "danger"]

export const validateKeyVote = async (keyVote: KeyVote) => {
  await gpg.importKey(keyVote.spk)
  const sig = keyVote.sig
  keyVote.sig = ''
  return gpg.verifySignature(sig, JSON.stringify(keyVote))
};

export const validateKeyVoteAndOwnership = (keyVote: KeyVote, refKeyVote: KeyVote, failIfEqual: boolean = true) => {
  validateKeyVote(keyVote)
  if(keyVote.spk !== refKeyVote.spk)
    throw new Error("Votes have different owners.")

  if(failIfEqual && keyVote.sig === refKeyVote.sig)
    throw new Error("Votes are equal.")
};

export const setKeyVote = (keyVote: KeyVote) => {
  // const prevKeyVote: KeyVote = keyVotes[keyVote.kid][keyVote.sid]
  upsertStoreKeyVotes([keyVote])
  keyVotes[keyVote.kid][keyVote.sid] = keyVote
};

export const unsetKeyVote = (keyVote: KeyVote) => {
  // const prevKeyVote: KeyVote = keyVotes[keyVote.uri][keyVote.model][keyVote.sid]
  deleteStoreKeyVotes([keyVote])
  delete keyVotes[keyVote.kid][keyVote.sid]
};

export let keyVotes: NestedKeyVotes = loadStoreKeyVotes();
