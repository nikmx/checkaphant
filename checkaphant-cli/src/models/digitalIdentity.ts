import {gpg} from '../services/gpg'

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