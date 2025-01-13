import { NativeModules, Platform } from 'react-native';
import { entropyToMnemonic } from 'ethers/lib/utils';
import { utils } from 'ethers';
import { validateMnemonic } from 'bip39';
import * as Constants from '../Constants';
import Address from '@bitsler/tron-address';
import { saveData } from './MethodsUtils';
const BIP84 = require('bip84');
const { derivePath } = require("ed25519-hd-key");
import bip39 from "react-native-bip39";
import nacl from "tweetnacl";
const solanaWeb3 = require("@solana/web3.js");

const { CreateWallet } = NativeModules;
/************************************** generate mnemonics ************************************/
export const generateMnemonics = () => {
    const mnemonics = entropyToMnemonic(utils.randomBytes(16));
    //  console.log('generateMnemonics::::::::', mnemonics)
    return mnemonics;
};
/************************************************** validate Mnemonics ***************************************************/
export const validateMnemonics = (mnemonics) => {
    return new Promise((resolve, reject) => {
        try {
            const validMnemonics = validateMnemonic(mnemonics);
            resolve(validMnemonics);
        } catch (e) {
            reject(Constants.INVALID_MNEMONICS);
        }
    });
}
/************************************************** create wallet ***************************************************/
export const createWallet = async () => {
    return new Promise((resolve, reject) => {
        try {
            CreateWallet.generateMnemonics(async obj => {
                console.log('---------Obj111', JSON.parse(obj));
                let data = JSON.parse(obj);
                let mnemonics = data?.mnemonics;
                let ethWallet = data?.eth;
                let BTC_obj = data?.btc;
                let solObj;
                console.log('---------ethWallet', data?.eth);
                console.log('---------BTC_obj', data?.btc);
                if (ethWallet.pvtKey?.length < 66) {
                    let suffix = '0x' + '0'.repeat(66 - ethWallet.pvtKey?.length);
                    ethWallet.pvtKey = suffix + ethWallet.pvtKey.substring(2);
                }
                let tronObj = await createTronAddress(mnemonics);
                const account = await createSolAddress(mnemonics);
                solObj = {
                    address: account.publicKey.toString(),
                    account: account
                }
                // await saveData(ethWallet.address + '_pk', ethWallet.pvtKey);
                // await saveData(ethWallet.address, mnemonics);
                // if (Constants.network == 'testnet') {
                //     BTC_obj = await getBTCAddress(mnemonics, 0);
                // }
                // await saveData(BTC_obj.address + '_pk', BTC_obj.pvtKey);
                // await saveData(BTC_obj.address, mnemonics);
                // await saveData(tronObj.address + '_pk', tronObj.privateKey);
                // await saveData(tronObj.address, mnemonics);
                return resolve({
                    mnemonics,
                    eth_address: ethWallet.address,
                    ethObj: ethWallet,
                    btc_address: BTC_obj.address,
                    btcObj: BTC_obj,
                    trx_address: tronObj.address,
                    tronObj,
                    sol_address: solObj.address,
                    solObj,
                });
            });
        } catch (e) {
            console.warn('MM', 'create wallet error ', e);
            return reject(e);
        }
    });
}
/************************************************** tron address generation ***************************************************/

export const createTronAddress = mnemonic => {
    try {
        const addressobj = new Address(mnemonic, 0);
        const address = addressobj.getAddressInfo(0).address;
        const privateKey = addressobj.getAddressInfo(0).privateKey;
        return { address, privateKey };
    } catch (error) {
        console.log('createTronAddress error==', error);
    }
};
/************************************************** sol address generation ***************************************************/

export const createSolAddress = async (mnemonics) => {
    try {
        const seed = await bip39.mnemonicToSeed(mnemonics);
        const path = `m/44'/501'/0'`;
        // console.log("path----::::::::::::::::::::", path);

        const derivedSeed = derivePath(path, seed).key;
        // console.log("derivedSeed----::::::::::::::::::::", derivedSeed);

        var account = new solanaWeb3.Account(
            nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
        );
        console.log("account----::::::::::::::::::::secretKey", account.secretKey.toString());
        console.log("account----::::::::::::::::::::publicKey", account.publicKey.toString());
        return account;
    } catch (error) {
        console.log('createSolAddress error==', error);
    }
};

export const getBTCAddress = async (mnemonics, addressIndex) => {
    var root = new BIP84.fromSeed(
        mnemonics,
        '',
        // false,
        Constants.network == 'testnet' ? true : false,
    ); //pass true for testnet and false for mainnet
    var child0 = root.deriveAccount(0);
    var account0 = new BIP84.fromZPrv(child0);
    const obj = {
        address: account0.getAddress(0),
        pvtKey: account0.getPrivateKey(0),
        mnemonics: mnemonics,
        index: addressIndex,
    };

    return obj;
};
/************************************************** import wallet ***************************************************/

export const importWallet = (mnemonics, btcOnly = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            // ********************************  FOR ETH  ************************************
            CreateWallet.generateAddressFromMnemonics(mnemonics, async obj => {
                console.log('---------Obj', JSON.parse(obj));
                let data = JSON.parse(obj);
                let ethWallet = data.eth;
                let tronObj;
                let solObj;
                let BTC_obj = data.btc;


                if (Platform.OS == "android") {
                    let ethPvtKey = '0x' + Buffer.from(decodeBase64(ethWallet?.pvtKey)).toString('hex');
                    ethWallet.pvtKey = ethPvtKey
                }

                if (ethWallet.pvtKey?.length < 66) {
                    let suffix = '0x' + '0'.repeat(66 - ethWallet.pvtKey?.length);
                    ethWallet.pvtKey = suffix + ethWallet.pvtKey.substring(2);
                }
                if (!validateMnemonic(mnemonics)) {
                    return reject('Invalid Mnemonics');
                }
                tronObj = await createTronAddress(mnemonics);
                const account = await createSolAddress(mnemonics);
                solObj = {
                    address: account.publicKey.toString(),
                    account: account
                }



                return resolve({
                    mnemonics,
                    eth_address: ethWallet.address,
                    ethObj: ethWallet,
                    btc_address: BTC_obj.address,
                    btcObj: BTC_obj,
                    trx_address: tronObj.address,
                    tronObj,
                    sol_address: solObj.address,
                    solObj,
                });


            });
        } catch (e) {
            //console.warn('MM','import wallet error ', e);
            return reject(e);
        }
    });
}
const decodeBase64 = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
}
