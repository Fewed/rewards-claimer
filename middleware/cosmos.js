import { getPassword, readSeeds, loadConfig } from "./prompt.js";
import { l } from "../utils/basics.js";
import { cosmosclient, proto, rest } from "@cosmos-client/core";
//import { Cosmosjs } from "@cosmostation/cosmosjs";
//import message from "@cosmostation/cosmosjs/src/messages/proto";
import { Coin, LCDClient } from "@terra-money/terra.js";
import axios from "axios";

const baseURL = "https://api.cosmos.network";
const chainID = "cosmoshub-4";

async function main() {
  const password = await getPassword();
  const seeds = await readSeeds(password);
  const seed = seeds[0];

  const sdk = new cosmosclient.CosmosSDK(baseURL, chainID);

  const privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
    key: await cosmosclient.generatePrivKeyFromMnemonic(seed),
  });
  const pubKey = privKey.pubKey();
  const address = cosmosclient.AccAddress.fromPublicKey(pubKey);

  let { data } = await rest.bank.balance(sdk, address, "uatom");

  l(address.toString());
  l(data);
}

main();
