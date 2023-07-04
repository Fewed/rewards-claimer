# rewards-claimer

A tool for collecting rewards for banding at https://app.kava.io/lend and reinvesting revenue from steaking

## Contents

- [Introduction](#Insertion)
- [Installation](#Installation)
- [Use](#Use)

## Introduction

The rewards-claimer script set is designed to collect rewards in KAVA for lending to https://app.kava.io/lend and then send them to staking. In the current version (v1.0.1) it works only with KAVA coin by running the script manually, but in the future it will be possible to reinvest rewards for other Cosmos ecosystem coins automatically (according to the schedule).

To work with the scripts, you may need to install additional software that requires about 150 MB of free disk space.

## Installation.

To run javascript code on your computer (outside the browser), you need to install the nodejs runtime environment, which you can get from https://nodejs.dev/download 
Download the LTS version for your operating system and install it. You can check if the installation is correct by typing **command line (terminal)** command:
```sh
node -v
```
If successful, the version of the environment should be displayed.

Download the rewards-claimer script set itself at https://github.com/M-Daeva/rewards-claimer.
To do that you will need to click on the green button **Code** and select tab **Download ZIP**, save the archive and unpack it so that **rewards-claimer folder appears in the root directory of drive C**.

You will need to load several modules through the nodejs manager in order to make the rewards-claimer work. Open **command line (terminal)** and sequentially execute commands:
```sh
cd C:\rewards-claimer
npm i
```
Once the download is complete, the `node_modules` folder should appear.

## Usage

In order for the program to be able to sign transactions from user addresses, the phrases must be imported. **All entered phrases are encrypted with the user's password and saved in the `seeds.txt` file in the `config` folder. The password is not saved anywhere and must be entered every time you start the scripts.
To add a new sesed, execute the terminal command
```sh
npm run add
```
* In the line `password` specify the user password. For privacy reasons it is not displayed while typing.
* At the `seed` line we specify the passphrase.
* In the line `validator` specify the address of the validator, which we send the coins to stacking. You can look it up on https://www.mintscan.io/ in the tab **validators** - we are interested in **Operator Address**.
* In the line `claimOption` enter the parameter responsible for the way coins will be delegated:
`r` - only those coins are delegated, which were received for the banding;
`m0.01` - the coins that were received for the lending, and the coins that were on the balance, so that the balance did not fall below **0.01 KAVA**;
`f0.2` - a fixed number of coins is delegated (in this case **0.2 KAVA**).
It is recommended to specify `r` if you want to delegate only rewards from the lending, or `m0.01` if you want to delegate rewards from the lending and reinvest rewards from the steking (the value of the unreduced balance can be set at your discretion).

After entering the last parameter, you will be prompted to add another entry. To do this, you need to enter `y`. To terminate the script, you must enter `n`. Now you need to close the terminal to hide the previously typed sid-phrases. Check the correctness of the settings of the validator addresses and delegation options and adjust them, if necessary, by opening the `config.json` file in the `config` folder with a text editor.

After completing the settings, you can begin collecting awards. 
Open the terminal and run the following commands:
```sh
cd C:\rewards-claimer
npm run claim
```

Next, we enter the password in the `password` field and watch the script work. In the case of successful bounty collecting we see a line like this
```sh
kava...fghjk claimed 0.5 (1/2)
```
which means that at the address `kava...fghjk` has collected **0.5 KAVA** rewards for lending, progress - one address out of two.
In the case of successful delegation appears a message like this
```sh
kava...fghjk delegated 0.5 (1/2)
```
which means that from address `kava...fghjk` delegated **0.5 KAVA**, progress - one address out of two.

The script runtime is usually not more than **half a minute** and you will be charged a total of **0.0005 KAVA** for the transactions. If, due to the increased network load, not all transactions have passed, you can call the script again.