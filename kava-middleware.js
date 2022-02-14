import { l, delay } from "./utils.js";
import { KavaClient } from "@kava-labs/javascript-sdk";

async function initClient(mnemo) {
  const endpoint = "https://kava.data.kava.io";

  const client = new KavaClient(endpoint);

  client.setWallet(mnemo);
  client.setBroadcastMode("async");
  await client.initChain();
  return client;
}

async function kavaStaff(mnemo, kava) {
  const fee = {
    gas: "1000000",
    amount: [
      {
        denom: "ukava",
        amount: "1000",
      },
    ],
  };

  const client = await initClient(mnemo);
  const wallet = client.wallet.address;

  async function claim(wallet) {
    await client.sendTx(
      [
        {
          type: "incentive/MsgClaimHardReward",
          value: {
            sender: wallet,
            denoms_to_claim: [
              {
                denom: "hard",
                multiplier_name: "large",
              },
              {
                denom: "ukava",
                multiplier_name: "large",
              },
            ],
          },
        },
        {
          type: "incentive/MsgClaimDelegatorReward",
          value: {
            sender: wallet,
            denoms_to_claim: [
              {
                denom: "hard",
                multiplier_name: "large",
              },
              {
                denom: "swp",
                multiplier_name: "large",
              },
            ],
          },
        },
      ],
      fee
    );

    l(`${wallet} claimed`);
  }

  async function delegate(wallet, kava) {
    const operatorAddress =
      "kavavaloper1r2ea4069j7rfemtt2k6ej5glctg9qe3y86rltf";

    await client.sendTx(
      [
        {
          type: "cosmos-sdk/MsgDelegate",
          value: {
            delegator_address: wallet,
            validator_address: operatorAddress,
            amount: {
              denom: "ukava",
              amount: `${1e6 * kava}`,
            },
          },
        },
      ],
      fee
    );

    l(`${wallet} delegated ${kava}`);
  }

  await claim(wallet);
  await delay(16000);
  delegate(wallet, kava);
}

export { kavaStaff, initClient };

/*
  let ukavaAmount = +(await client.getBalances(wallet))[2].amount;
  const delegateAmount = ukavaAmount >= 501000 ? 500000 : 400000;
  */