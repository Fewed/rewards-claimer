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
      "kavavaloper17u9s2fx5htqdsuk78hkfskw9s5g06tzqyl2m8j";

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

const fee = {
  gas: "1000000",
  amount: [
    {
      denom: "ukava",
      amount: "1000",
    },
  ],
};

async function claim(client, delegator) {
  await client.sendTx(
    [
      {
        type: "incentive/MsgClaimHardReward",
        value: {
          sender: delegator,
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
          sender: delegator,
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

  l(`${delegator} claimed`);
}

async function delegate(client, delegator, validator, quantity) {
  await client.sendTx(
    [
      {
        type: "cosmos-sdk/MsgDelegate",
        value: {
          delegator_address: delegator,
          validator_address: validator,
          amount: {
            denom: "ukava",
            amount: `${1e6 * quantity}`,
          },
        },
      },
    ],
    fee
  );

  l(`${delegator} delegated ${quantity}`);
}

async function kavaWorker(mnemonics, config, quantity = 0.5, delayInS = 12) {
  const configList = config.wallets;

  async function claimAndDelegate(i) {
    const seed = mnemonics[i];
    const { delegator, validator, claimOption, coin } = configList[i];
    const client = await initClient(seed);

    await claim(client, delegator);
    await delay(1e3 * delayInS);
    delegate(client, delegator, validator, quantity);
  }

  [...Array(mnemonics.length)].map((_, i) => i).forEach(claimAndDelegate);
}

const coinMsgParams = {
  kava: {
    delegator_address: "",
    validator_address: "kavavaloper17u9s2fx5htqdsuk78hkfskw9s5g06tzqyl2m8j",
    denom: "ukava",
    fee: {
      gas: "1000000",
      amount: [
        {
          denom: "ukava",
          amount: "1000",
        },
      ],
    },
  },
  osmo: {
    delegator_address: "",
    validator_address: "osmovaloper1e8238v24qccht9mqc2w0r4luq462yxttfpaeam",
    denom: "uosmo",
    fee: {
      gas: "300000",
      amount: [
        {
          denom: "uosmo",
          amount: "0",
        },
      ],
    },
  },
};

async function uniDelegate(mnemonics, delegator, quantity, coin) {
  const client = await initClient(mnemonics[0]);
  const params = coinMsgParams[coin];
  const { validator_address, denom, fee } = params;

  try {
    await client.sendTx(
      [
        {
          type: "cosmos-sdk/MsgDelegate",
          value: {
            delegator_address: delegator,
            validator_address,
            amount: {
              denom,
              amount: `${1e6 * quantity}`,
            },
          },
        },
      ],
      fee
    );

    l(`${delegator} delegated ${quantity}`);
  } catch (error) {
    l(error);
  }
}

export { kavaStaff, initClient, kavaWorker, uniDelegate };

/*
  let ukavaAmount = +(await client.getBalances(wallet))[2].amount;
  const delegateAmount = ukavaAmount >= 501000 ? 500000 : 400000;
  */
