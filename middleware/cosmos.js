import { getPassword, readSeeds, loadConfig } from "./prompt.js";
import { l } from "../utils/basics.js";
import { cosmosclient, proto, rest } from "@cosmos-client/core";
//import { setBech32Prefix } from "@cosmos-client/core/cjs/config/module";
//import { Coin, LCDClient } from "@terra-money/terra.js";
//import axios from "axios";

import { Cosmos } from "@cosmostation/cosmosjs";
import message from "@cosmostation/cosmosjs/src/messages/proto";

const baseURL = "https://api.cosmos.network";
const chainID = "cosmoshub-4";

// https://api-osmosis.imperator.co/pools/v1/all

async function main() {
  const password = await getPassword();
  const seeds = await readSeeds(password);
  const seed = seeds[0];

  const cosmos = new Cosmos(baseURL, chainID);
  //cosmos.setBech32MainPrefix("juno");
  //cosmos.setPath("m/44'/118'/0'/0/0");
  const address = cosmos.getAddress(seed);
  const privKey = cosmos.getECPairPriv(seed);
  const pubKeyAny = cosmos.getPubKeyAny(privKey);
  l(address);
  let bal = await cosmos.getAccounts(address);
  l(bal);

  /*
  const sdk = new cosmosclient.CosmosSDK(baseURL, chainID);
  
  const privKey = new proto.cosmos.crypto.secp256k1.PrivKey({
    key: await cosmosclient.generatePrivKeyFromMnemonic(seed),
  });
  const pubKey = privKey.pubKey();
  const address = cosmosclient.AccAddress.fromPublicKey(pubKey);

  let { data } = await rest.bank.balance(sdk, address, "uatom");

  l(address.toString());
  l(data);
  */
}

main();

/*

ChainID: "osmosis-1"


*/

/*
  setBech32Prefix(
    ((arg) => ({
      accAddr: `${arg}`,
      accPub: `${arg}pub`,
      valAddr: `${arg}valoper`,
      valPub: `${arg}valoperpub`,
      consAddr: `${arg}valcons`,
      consPub: `${arg}valconspub`,
    }))("juno")
  );
  */
