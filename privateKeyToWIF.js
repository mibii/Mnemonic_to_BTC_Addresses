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
  const privateKeyHex = 'efe0e36e40bd08d13efd9a0d7fff68a957594370d9ea40edb8d65ec58bd32580';
  const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
  const privateKeyWIF = privateKeyToWIF(privateKeyBuffer);
  
  console.log(`Private Key (Hexadecimal): ${privateKeyHex}`);
  console.log(`Private Key (WIF): ${privateKeyWIF}`);