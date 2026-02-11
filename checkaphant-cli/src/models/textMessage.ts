import { gpg } from "../services/gpg";
import { DigitalIdentity } from "./digitalIdentity";



export interface TextMessage {
  txt: string;
  sig: string;
}

export const signTextMessage = async (msg: TextMessage) => {
  const sig = await gpg.signDoc(msg.txt)
  msg.sig = sig
  return msg;
};

export const validateTextMessage = async (msg: TextMessage, dId: DigitalIdentity|undefined) => {
  //if (dId)
  //  await gpg.importKey(dId.pubkey)
  return gpg.verifySignature(msg.sig, msg.txt)
};