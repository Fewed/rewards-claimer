import { getPassword, readSeeds, loadConfig } from "./middleware/prompt.js";
import { kavaWorker } from "./middleware/kava.js";

async function main() {
  const password = await getPassword();
  const seeds = await readSeeds(password);
  const config = await loadConfig();

  kavaWorker(seeds, config);
}

main();
