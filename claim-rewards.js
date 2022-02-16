import { l } from "./utils.js";
import { getPassword, readMnemonics, loadConfig } from "./prompt-middleware.js";
import { kavaWorker, uniDelegate } from "./kava-middleware.js";

async function main() {
  const password = await getPassword();
  const mnemonics = await readMnemonics(password);
  const config = await loadConfig();

  await kavaWorker(mnemonics, config, 0.5, 14);

  //await uniDelegate(mnemonics, "", 0.1, "osmo");
}

main();
