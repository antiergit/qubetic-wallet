// import litecore from 'litecore-lib';
const litecore = require("bitcore-lib-ltc")
import { saveData } from './MethodsUtils';
import { IS_PRODUCTION } from '../EndPoint';
const litlib = litecore

/************************************** convertLtcPrivateKeyToAddress ************************************/
export const convertLtcPrivateKeyToAddress = (privatekey) => {
    try {
        //  console.log("privatekey convertLtcPrivateKeyToAddress ", privatekey);
        const bitcoin = require('bitcoinjs-lib');
        const ethUtil = require('ethereumjs-util');

        const ltcTestnet = {
            messagePrefix: '\x19Litecoin Signed Message:\n',
            bech32: 'tltc',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4, //  for segwit (start with 2)
            wif: 0xef
        }
        const ltcMainnet = {
            messagePrefix: '\x19Litecoin Signed Message:\n',
            bech32: 'ltc',
            bip32: {
                public: 0x019da462,
                private: 0x019d9cfe,
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0,
        };
        // Ethereum private key
        const ethPrivateKey = privatekey;
        // Convert Ethereum private key to Buffer
        const ethPrivateKeyBuffer = ethUtil.toBuffer(ethPrivateKey);
        // Derive Bitcoin private key from Ethereum private key
        const btcPrivateKeyBuffer = ethUtil.keccak256(ethPrivateKeyBuffer);
        // Create Bitcoin key pair
        const btcKeyPair = bitcoin.ECPair.fromPrivateKey(btcPrivateKeyBuffer, { compressed: true });
        const pvtKey = btcKeyPair.privateKey.toString("hex")
        const ltcAddress = bitcoin.payments.p2wpkh({ pubkey: btcKeyPair.publicKey, network: IS_PRODUCTION == 0 ? ltcTestnet : ltcMainnet }).address;
        //   console.log('LTC Address:', ltcAddress);
        //   console.log("LTC pvtKey ", pvtKey)
        saveData(ltcAddress + '_pk', pvtKey);
        return { ltc_address: ltcAddress, ltcprivateKey: pvtKey }
    }
    catch (e) {
        console.log('exception convertLtcPrivateKeyToAddress', e);
    }
}
/************************************** Validate LTC Address ************************************/
export const validateLTCAddress = text => {
    console.log("testt ", litlib.Address.isValid(text, IS_PRODUCTION == 0 ? 'testnet' : 'livenet'))
    return litlib.Address.isValid(text, IS_PRODUCTION == 0 ? 'testnet' : 'livenet');

}