import { l } from "./utils.js";
import { getPassword, readMnemonics, loadConfig } from "./prompt-middleware.js";
import { kavaWorker } from "./kava-middleware.js";

async function main() {
  const password = await getPassword();
  const mnemonics = await readMnemonics(password);
  const config = await loadConfig();

  kavaWorker(mnemonics, config);
}

main();
