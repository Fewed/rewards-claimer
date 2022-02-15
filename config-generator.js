import { l } from "./utils.js";
import {
  getPassword,
  readMnemonics,
  seedsToConfig,
} from "./prompt-middleware.js";

// for future tests only
async function main() {
  const password = await getPassword();
  const mnemonics = await readMnemonics(password);

  seedsToConfig(mnemonics);
}

main();
