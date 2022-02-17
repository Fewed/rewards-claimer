import { l } from "./utils.js";
import { getPassword, updateSeedsAndConfig } from "./prompt-middleware.js";

async function main() {
  const password = await getPassword();
  updateSeedsAndConfig(password);
}

main();
