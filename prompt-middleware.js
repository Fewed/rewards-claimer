import {
  l,
  enc,
  dec,
  readFileAsync,
  writeFileAsync,
  accessAsync,
} from "./utils.js";
import prompt from "prompt";
import { initClient } from "./kava-middleware.js";

const configFilePath = "./config.json";
const seedsFilePath = "./seeds.txt";
const mnemoFilePath = "./settings.txt";
const yesNoString = "y/n";

async function getPassword() {
  l("enter password");
  const { password } = await prompt.get({
    name: "password",
    hidden: true,
  });
  return password;
}

async function writeMnemonics(password) {
  let isMnemonicAdding = await askForMnemoAdding();

  while (isMnemonicAdding) {
    let { mnemonic } = await prompt.get(["mnemonic"]);

    let mnemonics = "";
    if (await accessAsync(mnemoFilePath)) {
      mnemonics = await readFileAsync(mnemoFilePath, {
        encoding: "utf8",
      });
    }
    mnemonics += enc(mnemonic, password) + "\n";
    await writeFileAsync(mnemoFilePath, mnemonics);

    isMnemonicAdding = await askForMnemoAdding();
  }
}

// write seed and change config
async function updateSeedsAndConfig(password) {
  let isSeedAdding = true;

  while (isSeedAdding) {
    // create new record
    let {
      seed = "",
      validator = "",
      claimOption = 0,
    } = await prompt.get(["seed", "validator", "claimOption"]);

    // update seeds file
    let seeds = "";
    if (await accessAsync(seedsFilePath)) {
      seeds = await readFileAsync(seedsFilePath, {
        encoding: "utf8",
      });
    }
    seeds += enc(seed, password) + "\n";
    writeFileAsync(seedsFilePath, seeds);

    // update config file
    let config = { wallets: [] };
    if (await accessAsync(configFilePath)) {
      config = JSON.parse(
        await readFileAsync(configFilePath, {
          encoding: "utf8",
        })
      );
    }
    const delegator = (await initClient(seed)).wallet.address;
    const coin = "kava";
    config.wallets.push({ delegator, validator, claimOption, coin });
    writeFileAsync(configFilePath, JSON.stringify(config));

    isSeedAdding = await askForMnemoAdding();
  }
}

async function seedsToConfig(seeds) {
  let config = { wallets: [] };
  const coin = "kava";
  const validator = "kavavaloper17u9s2fx5htqdsuk78hkfskw9s5g06tzqyl2m8j";
  const claimOption = 0;

  for (let seed of seeds) {
    const delegator = (await initClient(seed)).wallet.address;
    config.wallets.push({ delegator, validator, claimOption, coin });
  }

  writeFileAsync(configFilePath, JSON.stringify(config));
}

async function askForMnemoAdding() {
  l("add mnemonic?");
  const res = await prompt.get([yesNoString]);
  return res[yesNoString] == "y";
}

async function readMnemonics(password) {
  let text = await readFileAsync(mnemoFilePath, {
    encoding: "utf8",
  });

  let mnemonics = [];

  try {
    mnemonics = text
      .trim()
      .split("\n")
      .map((item) => dec(item, password));
  } catch (error) {
    l("wrong password");
  }

  return mnemonics;
}

export {
  getPassword,
  writeMnemonics,
  readMnemonics,
  updateSeedsAndConfig,
  seedsToConfig,
};
