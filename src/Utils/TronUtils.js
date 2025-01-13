import TronWeb from 'tronweb';
import * as Constants from '../Constants';
import { getData, saveData } from './MethodsUtils';
import { signTransaction, TRON_DERIVATION, unmarshalSignature, } from '../TangemUtils';
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = Constants.network == 'testnet' ? new HttpProvider('https://api.shasta.trongrid.io') : new HttpProvider('https://api.trongrid.io/');
const solidityNode = Constants.network == 'testnet' ? new HttpProvider('https://api.shasta.trongrid.io') : new HttpProvider('https://api.trongrid.io/');
const eventServer = Constants.network == 'testnet' ? new HttpProvider('https://api.shasta.trongrid.io') : new HttpProvider('https://api.trongrid.io/');

/************************************** getTronBalance TRON ************************************/
export const getTronBalance = async (address, privateKey) => {
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    try {
        return await tronWeb.trx.getBalance(address).then(balance => {
            console.log(address, 'getTronBalance success', (balance / 10 ** 6));
            return (balance / 10 ** 6);
        });
    } catch (error) {
        console.log('getTronBalance error', error);

    }
};

/************************************** Validate TRON Address ************************************/
export const validateTRXAddress = text => {
    console.log('chk Valid trx Addresss::::::::::::', text);
    return TronWeb.isAddress(text);
};
/************************************** Generate TRON Wallet ************************************/
export const convertTrxPrivateKeyToAddress = (privateKey) => {
    // console.log('tron  pvt key::::', privateKey);
    try {
        const address = TronWeb.address.fromPrivateKey(privateKey);
        // console.log('tron address from pvt key::::', address);
        saveData(address + '_pk', privateKey);
        return { trx_address: address, privateKey: privateKey };
    } catch (e) {
        console.log('exception', e);
    }
}
/************************************** Generate TRC signed raw ************************************/
export const createTrxRaw = async (fromAddress, toAddress, amount, pvtkey,) => {
    const privateKey = pvtkey;
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
    console.log('tronwebSendTRX inside function');
    const tradeobj = await tronWeb.transactionBuilder.sendTrx(toAddress, tronWeb.toSun(amount), fromAddress,);
    const signedtxn = await tronWeb.trx.sign(tradeobj, privateKey);
    return await signedtxn;
};
/************************************** Generate TRC20 signed raw ************************************/
export const createTrxTokenRaw = async (fromAddress, toAddress, amount, token_address, pvtkey, feeLimit,) => {
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, pvtkey);
    const BigNumber = require("bignumber.js");
    const largeNumber = new BigNumber(amount);
    const formattedAmt = largeNumber.toFixed();
    const parameter = [
        { type: "address", value: toAddress },
        { type: "uint256", value: formattedAmt },
    ];
    const options = { feeLimit: feeLimit, callValue: 0 };
    const transaction = await tronWeb.transactionBuilder.triggerSmartContract(token_address, 'transfer(address,uint256)', options, parameter, fromAddress,);
    let transactionObject = transaction;
    if (!transactionObject.result || !transactionObject.result.result)
        return console.error('Unknown error: ' + txJson, null, 2);
    const signedTransaction = await tronWeb.trx.sign(transactionObject.transaction,);
    if (!signedTransaction.signature) {
        return console.error('Transaction was not signed properly');
    }
    return await signedTransaction;
};


/************************************** Generate TRC Tangem signed raw ************************************/
export const createTrxTangemRaw = async (fromAddress, toAddress, amount) => {
    return new Promise(async (resolve, reject) => {
        let multiWallet = await getData(Constants.MULTI_WALLET_LIST)
        let multiWalletData = JSON.parse(multiWallet)
        let currentWallet = multiWalletData.filter(el => el?.defaultWallet == true)[0]
        let walletPublicKey = currentWallet?.login_data?.walletPublicKey
        let publicKey = currentWallet?.login_data?.tronPublicKey
        const tronWeb = new TronWeb({ fullNode, solidityNode, eventServer });
        const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, tronWeb.toSun(amount), fromAddress);
        signTransaction(transaction.txID, walletPublicKey, TRON_DERIVATION, currentWallet?.login_data?.card?.cardId).then(async res => {
            let result = JSON.parse(res)
            let unmarshalSig = await unmarshalSignature(result.signature, transaction.txID, publicKey)
            transaction.signature = [unmarshalSig]
            resolve(transaction)
        }).catch(err => {
            reject(err);
        })
    })
};

/************************************** Generate TRC20 Token Tangem signed raw ************************************/
export const createTrxTokenTangemRaw = async (fromAddress, toAddress, amount, token_address, feeLimit) => {
    return new Promise(async (resolve, reject) => {
        let multiWallet = await getData(Constants.MULTI_WALLET_LIST)
        let multiWalletData = JSON.parse(multiWallet)
        let currentWallet = multiWalletData.filter(el => el?.defaultWallet == true)[0]
        let walletPublicKey = currentWallet?.login_data?.walletPublicKey
        let publicKey = currentWallet?.login_data?.tronPublicKey
        const tronWeb = new TronWeb({ fullNode, solidityNode, eventServer });
        const parameter = [
            { type: 'address', value: toAddress },
            { type: 'uint256', value: parseInt(amount)?.toString() },
        ];
        const options = { feeLimit: feeLimit, callValue: 0 };
        const transaction = await tronWeb.transactionBuilder.triggerSmartContract(token_address, 'transfer(address,uint256)', options, parameter, fromAddress,);
        signTransaction(transaction.txID, walletPublicKey, TRON_DERIVATION, currentWallet?.login_data?.card?.cardId).then(async res => {
            let result = JSON.parse(res)
            let unmarshalSig = await unmarshalSignature(result.signature, transaction.txID, publicKey)
            transaction.signature = [unmarshalSig]
            resolve(transaction)
        }).catch(err => {
            reject(err);
        })
    });
}
export function isValidTronPrivateKey(privateKey) {
    // Check if it’s a 64-character hexadecimal string
    return /^[a-fA-F0-9]{64}$/.test(privateKey);
}