require('dotenv').config();
const bip39 = require('bip39');
const hdkey = require('hdkey');
const bitcoin = require('bitcoinjs-lib');

const mnemonic = process.env.MNEMONIC;
//const mnemonic = bip39.generateMnemonic()
//console.log(mnemonic)
///
if (bip39.validateMnemonic(mnemonic)) {
  console.log('OK - The mnemonic phrase is valid.');


const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = hdkey.fromMasterSeed(seed);
const path = "m/44'/0'/0'/0";

const child = root.derive(path);

console.log(`BIP32 Extended Private Key: ${child.privateExtendedKey}\n`);
console.log(`Hexadecimal Private Key: ${child.privateKey.toString('hex')}`);

const network = bitcoin.networks.bitcoin;

for (let i = 0; i < 3; i++) {
  const derivedPath = `${path}/${i}`;
  const derivedChild = root.derive(derivedPath);
  const { address } = bitcoin.payments.p2pkh({ pubkey: derivedChild.publicKey, network });
  const privateKey = derivedChild.privateKey.toString('hex');

  console.log(`Address ${i + 1}: ${address}`);
  console.log(`Private Key ${i + 1}: ${privateKey}\n`);
}

} else {
  console.log('Invalid mnemonic phrase! Please check and try again.');
}