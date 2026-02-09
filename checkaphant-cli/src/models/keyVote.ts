import { registerKeyVote } from '../lib/registry';
import {refreshStoreKeyVotes, NestedKeyVotes, loadStoreKeyVotes, upsertStoreKeyVotes} from './store'
//import { GPG } from 'gpg-ts'

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

export const signKeyVote = (keyVote: KeyVote) => {
  //GPG.clearsign(JSON.stringify(keyVote), (sig: string) => keyVote.sig = sig);
  return keyVote;
};

export const validateKeyVote = (keyVote: KeyVote) => {
  // validate gpg sig/sid
  //GPG.verifySignature("...", fn...);
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

export const resetKeyVotes = (keyVotes: KeyVote[]) => {
  refreshStoreKeyVotes(keyVotes)
  keyVotes = loadStoreKeyVotes()
};

export let keyVotes: NestedKeyVotes = loadStoreKeyVotes();
