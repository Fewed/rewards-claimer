import {
  l,
  enc,
  dec,
  readFileAsync,
  writeFileAsync,
  accessAsync,
} from "./utils.js";
import prompt from "prompt";

const mnemoFilePath = "./settings.txt",
  yesNoString = "y/n";

async function getPassword() {
  l("enter password");
  const { password } = await prompt.get({
    name: "password",
    hidden: true,
  });
  return password;
}

async function writeMnemonics(password) {
  let isMnemonicAdding = await askForMnemoAdding();

  while (isMnemonicAdding) {
    let { mnemonic } = await prompt.get(["mnemonic"]);

    let mnemonics = "";
    if (await accessAsync(mnemoFilePath)) {
      mnemonics = await readFileAsync(mnemoFilePath, {
        encoding: "utf8",
      });
    }
    mnemonics += enc(mnemonic, password) + "\n";
    await writeFileAsync(mnemoFilePath, mnemonics);

    isMnemonicAdding = await askForMnemoAdding();
  }
}

// write seed and change config
async function writeMnemonics2(password) {
  let isMnemonicAdding = await askForMnemoAdding();

  while (isMnemonicAdding) {
    let { mnemonic } = await prompt.get(["mnemonic"]);

    let mnemonics = "";
    if (await accessAsync(mnemoFilePath)) {
      mnemonics = await readFileAsync(mnemoFilePath, {
        encoding: "utf8",
      });
    }
    mnemonics += enc(mnemonic, password) + "\n";
    await writeFileAsync(mnemoFilePath, mnemonics);

    isMnemonicAdding = await askForMnemoAdding();
  }
}

async function askForMnemoAdding() {
  l("add mnemonic?");
  const res = await prompt.get([yesNoString]);
  return res[yesNoString] == "y";
}

async function readMnemonics(password) {
  let text = await readFileAsync(mnemoFilePath, {
    encoding: "utf8",
  });

  let mnemonics = [];

  try {
    mnemonics = text
      .trim()
      .split("\n")
      .map((item) => dec(item, password));
  } catch (error) {
    l("wrong password");
  }

  return mnemonics;
}

export { getPassword, writeMnemonics, readMnemonics };
