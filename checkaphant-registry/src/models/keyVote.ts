//import {GPG} from 'gpg-ts'
import {loadStoreKeyVotes, deleteStoreKeyVotes, upsertStoreKeyVotes, NestedKeyVotes} from './store'

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

export const validateKeyVote = (keyVote: KeyVote) => {
  // validate gpg sig/sid
  //GPG.verifySignature("...", fn...);
};

export const validateKeyVoteAndOwnership = (keyVote: KeyVote, refKeyVote: KeyVote, failIfEqual: boolean = true) => {
  // validate gpg sig of keyVote and common ownership
  //GPG.verifySignature("...", fn...);
  validateKeyVote(keyVote)
  if(keyVote.sid !== refKeyVote.sid)
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
