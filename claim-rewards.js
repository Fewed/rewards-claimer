import { l } from "./utils.js";
import { getPassword, readMnemonics } from "./prompt-middleware.js";
import { kavaStaff } from "./kava-middleware.js";

async function main() {
  const password = await getPassword();
  const mnemonics = await readMnemonics(password);

  //await kavaWorker(mnemonics, config)
}

main();
