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

  mnemonics.slice(0, 8).forEach((seed) => kavaStaff(seed, 0.5)); // 0.5
  mnemonics.slice(-2).forEach((seed) => kavaStaff(seed, 0.4)); // 0.4
}

main();
