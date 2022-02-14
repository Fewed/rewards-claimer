import { l } from "./utils.js";
import {
  getPassword,
  writeMnemonics,
  readMnemonics,
} from "./prompt-middleware.js";
import { kavaStaff } from "./kava-middleware.js";

async function main() {
  const password = await getPassword();
  await writeMnemonics(password);
  const mnemonics = await readMnemonics(password);

  mnemonics.forEach((seed) => kavaStaff(seed, 0.45));
}

main();
