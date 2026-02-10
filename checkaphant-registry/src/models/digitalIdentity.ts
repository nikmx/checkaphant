import {gpg} from '../services/gpg'
import { deleteStoreDigitalIdentities, loadStoreDigitalIdentities, NestedDigitalIdentities, upsertStoreDigitalIdentities } from './store';

export interface DigitalIdentity {
  id: string;   // gpg key-id
  pubkey: string;  // gpg pub-key
}

export const getCurrentDigitalIdentity = async () => {
    const sid = await gpg.getId()
    const spk = await gpg.getPublicKey()
    const did: DigitalIdentity = {id: sid, pubkey: spk}
    return did;
}

export const setDigitalIdentity = (dId: DigitalIdentity) => {
  upsertStoreDigitalIdentities([dId])
  dIds[dId.id] = dId
};

export const unsetDigitalIdentity = (dId: DigitalIdentity) => {
  deleteStoreDigitalIdentities([dId])
  delete dIds[dId.id]
};

export let dIds: NestedDigitalIdentities = loadStoreDigitalIdentities();