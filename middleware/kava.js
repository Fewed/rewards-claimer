import { l, delay } from "../utils/basics.js";
import { KavaClient } from "@kava-labs/javascript-sdk";

const baseFee = 0.001;

let claimCnt = 0;
let delegCnt = 0;

const getFeeObj = (amount = baseFee) => ({
  gas: "1000000",
  amount: [
    {
      denom: "ukava",
      amount: `${1e6 * amount}`,
    },
  ],
});

function hideAddress(str, n = 5) {
  return str.match(/^[a-z]+/)[0] + "..." + str.slice(-n);
}

async function initClient(seed) {
  const endpoint = "https://kava.data.kava.io";

  const client = new KavaClient(endpoint);

  client.setWallet(seed);
  client.setBroadcastMode("async");
  await client.initChain();
  return client;
}

async function claim(client, delegator, rewards, cntMax) {
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
    getFeeObj()
  );

  l(`${hideAddress(delegator)} claimed ${rewards} (${++claimCnt}/${cntMax})`);
}

async function delegate(client, delegator, validator, quantity, cntMax) {
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
    getFeeObj()
  );

  l(
    `${hideAddress(delegator)} delegated ${quantity} (${++delegCnt}/${cntMax})`
  );
}

async function getAmount(client, claimOption) {
  function getNum(arr) {
    return +arr.filter(({ denom }) => denom == "ukava")[0].amount;
  }

  const { address } = client.wallet;

  const res2 = await client.getBalances(address);
  let walletBalance = getNum(res2);

  const res3 = await client.getRewards({
    owner: address,
    type: "kava",
  });
  let lendingRewards = getNum(res3.hard_claims[0].base_claim.reward) || 0;

  const claimOptionPrefix = claimOption[0];
  const claimOptionPostfix = 1e6 * (+claimOption.slice(1) || 10 * baseFee);

  const baseFeeM = 1e6 * baseFee;

  let amount = {
    r: lendingRewards - 2 * baseFeeM,
    m: lendingRewards + walletBalance - 2 * baseFeeM - claimOptionPostfix,
    f: claimOptionPostfix,
  }[claimOptionPrefix];

  if (lendingRewards <= baseFeeM) lendingRewards = 0;
  else lendingRewards /= 1e6;

  if (amount === undefined || amount < 0) amount = 0;
  else amount /= 1e6;

  return { amount, lendingRewards };
}

async function kavaWorker(seeds, config, delayInS = 16) {
  const configList = config.wallets;

  async function claimAndDelegate(i) {
    const seed = seeds[i];
    const { delegator, validator, claimOption } = configList[i];
    const client = await initClient(seed);
    const { amount, lendingRewards } = await getAmount(client, claimOption);
    const addressH = hideAddress(client.wallet.address);

    if (lendingRewards !== 0)
      await claim(client, delegator, lendingRewards, seeds.length);
    else l(`${addressH} not enough rewards for claiming!`);

    if (amount === 0) {
      l(`${addressH} not enough balance for delegation!`);
      return;
    }
    await delay(1e3 * delayInS);
    delegate(client, delegator, validator, amount, seeds.length);
  }

  [...Array(seeds.length)].map((_, i) => i).forEach(claimAndDelegate);
}

export { initClient, kavaWorker, hideAddress };
