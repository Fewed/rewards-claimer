import { getPassword, readSeeds, seedsToConfig } from "../middleware/prompt.js";

async function main() {
  const password = await getPassword();
  const seeds = await readSeeds(password);

  seedsToConfig(seeds);
}

main();
