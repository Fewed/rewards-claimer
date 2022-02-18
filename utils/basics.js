import { SimpleCrypto } from "simple-crypto-js";
import { promisify } from "util";
import fs from "fs";

const l = console.log.bind(console);

const enc = (text, key) => new SimpleCrypto(key).encrypt(text);
const dec = (code, key) => new SimpleCrypto(key).decrypt(code);

const [readFileAsync, writeFileAsync, accessAsync, delay] = [
  fs.readFile,
  fs.writeFile,
  fs.exists,
  setTimeout,
].map(promisify);

export { l, readFileAsync, writeFileAsync, accessAsync, enc, dec, delay };
