

https://dev.to/mibii/from-mnemonic-to-bitcoin-addresses-in-javascript-1dmp

Today, we're taking a deep dive into the world of Bitcoin address generation. Using a mnemonic phrase, we'll walk through how to create Bitcoin addresses that are ready to receive funds. If you’ve got your mnemonic phrase handy, let’s get started!

Address Generation
First things first, we'll be using a mnemonic phrase to generate Bitcoin addresses. This phrase isn't just any random collection of words – it follows specific rules and standards to ensure security and compatibility.

Here's a step-by-step guide and the corresponding JavaScript code to generate three Bitcoin addresses.
Create a new folder for your project.
Initialize Your Project (create a package.json file.):
npm init -y
Install Dependencies ( You'll need dotenv for environment variables, bip39 for mnemonic phrase handling, hdkey for hierarchical deterministic key generation, and bitcoinjs-lib for Bitcoin address creation.):
npm install dotenv bip39 hdkey bitcoinjs-lib
Create Your Script:

Make a new file, let's call it AddressGenerator.js.
Copy and paste the provided below code snippet into this file.

For simplicity, we’ll store our mnemonic phrase in an .env file.
Make sure your .env file contains your mnemonic phrase like so:
create the .env file and place to there next string:
MNEMONIC="your mnemonic phrase here"
JavaScript Code to Generate Bitcoin Addresses
Here's the JavaScript code that reads the mnemonic phrase from the .env file, derives the seed, and generates three Bitcoin addresses:

AddressGenerator.js.
require('dotenv').config();
const bip39 = require('bip39');
const hdkey = require('hdkey');
const bitcoin = require('bitcoinjs-lib');

// Retrieve the mnemonic phrase from the .env file
const mnemonic = process.env.MNEMONIC;

// Generate the seed from the mnemonic
const seed = bip39.mnemonicToSeedSync(mnemonic);

// Create the root of the HD wallet from the seed
const root = hdkey.fromMasterSeed(seed);

// Define the path for BIP44 Bitcoin addresses
const path = "m/44'/0'/0'/0";

// Derive the first child key from the root
const child = root.derive(path);

// Log the extended private key for reference
console.log(`BIP32 Extended Private Key: ${child.privateExtendedKey}\n`);

// Define the network as Bitcoin mainnet
const network = bitcoin.networks.bitcoin;

// Generate three Bitcoin addresses
for (let i = 0; i < 3; i++) {
  const derivedPath = `${path}/${i}`;
  const derivedChild = root.derive(derivedPath);
  const { address } = bitcoin.payments.p2pkh({ pubkey: derivedChild.publicKey, network });
  const privateKey = derivedChild.privateKey.toString('hex');
  console.log(`Address ${i + 1}: ${address}`);
  console.log(`Private Key ${i + 1}: ${privateKey}\n`);
}
Done - When you run this script,
node AddressGenerator.js
you'll get three pairs of Bitcoin addresses and their corresponding private keys in hexadecimal format.

Next let's your private keys looks more user-friendly and compatible with most Bitcoin wallets - Converting Private Keys to WIF Format

Converting Private Keys to WIF Format
To make your private keys more user-friendly and compatible with most Bitcoin wallets, you can convert them from hexadecimal format to Wallet Import Format (WIF).
Create one more file and name it - wifFormatconverter.js

Here's a snippet to do just that:

wifFormatconverter.js

function privateKeyToWIF(privateKey) {
    const prefix = Buffer.from([0x80]); // Mainnet prefix
    const suffix = Buffer.from([0x01]); // Compressed suffix

    const extendedPrivateKey = Buffer.concat([prefix, privateKey, suffix]);
    const checksum = sha256(sha256(extendedPrivateKey)).slice(0, 4);
    const extendedPrivateKeyChecksum = Buffer.concat([extendedPrivateKey, checksum]);

    const wif = base58Encode(extendedPrivateKeyChecksum);
    return wif;
}

function sha256(buffer) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest();
}

function base58Encode(buffer) {
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const BASE = BigInt(ALPHABET.length);

    let leadingZeros = 0;
    while (buffer[leadingZeros] === 0x00) {
        leadingZeros++;
    }

    let num = BigInt('0x' + buffer.toString('hex'));
    let encoded = '';

    while (num > 0) {
        const remainder = num % BASE;
        num = num / BASE;
        encoded = ALPHABET[Number(remainder)] + encoded;
    }

    return '1'.repeat(leadingZeros) + encoded;
}


// Usage example

const privateKeyHex = 'put your key in HEX format here';
const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
const privateKeyWIF = privateKeyToWIF(privateKeyBuffer);

console.log(`Private Key (Hexadecimal): ${privateKeyHex}`);
console.log(`Private Key (WIF): ${privateKeyWIF}`);

Done. Before run this scripte - put to this const privateKeyHex = the HEX format of your privateKey that you get on the previous step. Or create one more env variable in your .env file. And run script:
node wifFormatconverter.js
Important Tips: Understanding BIP39 and Mnemonic Phrase Validation
Before we wrap up, it's crucial to highlight an important aspect of working with mnemonic phrases: validation. The code snippet provided above does not validate the mnemonic phrase.

Why is validation important?
Mnemonic phrases follow the BIP39 standard, which ensures they are not just random words but also contain a checksum to detect errors. Here’s a bit more detail on BIP39:

Word List: BIP39 defines a list of 2048 unique words. Each word in a valid mnemonic phrase comes from this list.
Checksum: A BIP39 mnemonic phrase includes a checksum derived from the entropy used to generate the phrase. This ensures that any accidental changes or typos in the mnemonic phrase can be detected.
Entropy and Security: The entropy (randomness) used in generating a mnemonic phrase must be sufficient to ensure security. Typically, 128-256 bits of entropy are used, resulting in 12-24 word phrases.

Here’s how you can validate a mnemonic phrase using the bip39 library:
const bip39 = require('bip39');
const mnemonic = process.env.MNEMONIC;

if (bip39.validateMnemonic(mnemonic)) {
  console.log('The mnemonic phrase is valid.');
} else {
  console.log('Invalid mnemonic phrase! Please check and try again.');
}
Wrapping Up
And there you have it! By following these steps, you've successfully generated Bitcoin addresses from a mnemonic phrase and converted the private keys into WIF format. Remember to validate your mnemonic phrases to ensure they are correct and secure.

Stay tuned for our next post, where we’ll dive into transaction preparation. If you found this guide helpful, don’t forget to give it a thumbs up. Until next time, stay secure and happy coding! 🚀