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

const fee = {
  gas: "1000000",
  amount: [
    {
      denom: "ukava",
      amount: "1000",
    },
  ],
};

async function claim(client, delegator, rewards) {
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

  l(`${delegator} claimed ${rewards}`);
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

async function getAmount(
  client,
  claimOption,
  minValue = 10000,
  fixValue = 10000
) {
  const fee = 1000;

  const { address } = client.wallet;

  /*
  const res1 = await client.getDistributionRewards(address);
  let stakingRewars = Math.floor(+res1.total[0].amount);
  */

  const res2 = await client.getBalances(address);
  let walletBalance = +res2.filter(({ denom }) => denom == "ukava")[0].amount;

  const res3 = await client.getRewards({
    owner: address,
    type: "kava",
  });
  let lendingRewards = +res3.hard_claims[0].base_claim.reward.filter(
    ({ denom }) => denom == "ukava"
  )[0].amount;

  const amount =
    {
      0: lendingRewards - 2 * fee,
      1: lendingRewards + walletBalance - 2 * fee - minValue,
      2: fixValue,
    }[claimOption] / 1e6;

  lendingRewards /= 1e6;

  return { amount, lendingRewards };
}

async function kavaWorker(mnemonics, config, delayInS = 16) {
  const configList = config.wallets;

  async function claimAndDelegate(i) {
    const seed = mnemonics[i];
    const { delegator, validator, claimOption, coin } = configList[i];
    const client = await initClient(seed);
    const { amount, lendingRewards } = await getAmount(client, claimOption);

    await claim(client, delegator, lendingRewards);
    await delay(1e3 * delayInS);
    delegate(client, delegator, validator, amount);
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

export { initClient, kavaWorker, uniDelegate };
