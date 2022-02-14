import { l, readFileAsync, writeFileAsync, accessAsync } from "./utils.js";
import {
  getPassword,
  writeMnemonics,
  readMnemonics,
} from "./prompt-middleware.js";
import { initClient } from "./kava-middleware.js";

const configFilePath = "./config.json";

async function updateSettings(mnemonics) {
  let isExist = await accessAsync(configFilePath);
  if (!isExist) {
    let wallets = [];

    for (const seed of mnemonics) {
      const delegator = (await initClient(seed)).wallet.address;
      const validator = "";
      const claimOption = "1";

      wallets.push({ delegator, validator, claimOption });
    }

    await writeFileAsync(configFilePath, JSON.stringify(wallets));
  }
}

async function main() {
  const password = await getPassword();
  await writeMnemonics(password);
  const mnemonics = await readMnemonics(password);
  await updateSettings(mnemonics);
}

main();

/*
{
  wallets: [
    {
      delegator: "",
      validator: "",
      claimOption: "",
      coin: ""
    }
  ]
}
*/
