import { getPassword, updateSeedsAndConfig } from "./middleware/prompt.js";

async function main() {
  const password = await getPassword();
  updateSeedsAndConfig(password);
}

main();
