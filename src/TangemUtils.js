
import { NativeModules } from "react-native";
const bitcoin = require('bitcoinjs-lib');
const { AppModelModule } = NativeModules;
const publicKeyToAddress = require('ethereum-public-key-to-address')
import { computeAddress, getBase58CheckAddress } from 'tron-create-address/lib/crypto'
import Singleton from "./Singleton";
import { saveData } from "./Utils/MethodsUtils";
const secp256k1 = require('secp256k1');
export const EVM_DERIVATION = "m/44'/60'/0'/0/0"
export const BTC_DERIVATION = "m/84'/0'/0'/0/0"
export const TRON_DERIVATION = "m/44'/195'/0'/0/0"
import { ethers } from "ethers";

export const scan = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await AppModelModule.scan()
            if (result) {
                let cardData = Platform.OS == 'ios' ? JSON.parse(result?.card) : JSON.parse(result)
                Singleton.getInstance().card = result
                saveData("card", result)
                let publicKey = cardData?.wallets?.[0]?.publicKey
                let walletPublicKeyBase64 = Platform.OS == 'ios' ? Buffer.from(publicKey, 'hex').toString('base64') : publicKey;
                Singleton.getInstance().cardPublicKey = walletPublicKeyBase64
                setTimeout(async () => {
                    let { eth, btc, trx, ethPublicKey, btcPublicKey, tronPublicKey } = await generateAddress(cardData)
                    resolve({ eth, btc, trx, walletPublicKey: walletPublicKeyBase64, card: cardData, ethPublicKey, btcPublicKey, tronPublicKey })
                }, 2000);

            }
        } catch (error) {
            reject(error);
        }
    })
};

export const addSignatureToTransaction = (unsignedTx, signature, hash, address) => {
    let sig = parseAndNormalizeSignature(signature);
    unsignedTx.signature = unmarshalSignature1(sig, hash, address);
    return unsignedTx;
}

const parseAndNormalizeSignature = (signatureHex) => {
    const signatureBuffer = Buffer.from(signatureHex, 'hex');
    if (signatureBuffer.length !== 64) {
        throw new Error("Invalid signature length. Expected 64 bytes.");
    }
    const normalizedSig = secp256k1.signatureNormalize(signatureBuffer);
    return normalizedSig;
}


export const unmarshalSignature1 = (signature, hash, userAddress) => {
    const r = signature.slice(0, 32).toString('hex');
    const s = signature.slice(32, 64).toString('hex');
    for (let i = 0; i < 2; i++) {
        let v = i + 27;
        console.log('------------v', v);
        const recoverableSignature = Buffer.alloc(65);
        signature.copy(recoverableSignature, 0);
        recoverableSignature[64] = v;

        try {
            const address = ethers.utils.recoverAddress(hash, {
                r: '0x' + r,
                s: '0x' + s,
                v: v
            });
            if (address.toLowerCase() === userAddress.toLowerCase()) {
                console.log("Address matched:", address);
                return { r: '0x' + r, s: '0x' + s, v: v };
            } else {
                console.log("Address:", address);
            }
        } catch (error) {
            console.log("Error recovering address:", error);
        }
    }

    console.error("No matching address found");
    return null;
};




export const parseRecoverableSignature = (signature, v, hash) => {
    if (signature.length !== 65) {
        throw new Error("Invalid recoverable signature length");
    }
    const compactSignature = signature.slice(0, 64);
    let address = ethers.utils.recoverAddress(hash, compactSignature,)
    if (address) {
        return compactSignature;
    } else {
        throw new Error("Failed to parse recoverable signature");
    }
}

export const generateAddress = async (card) => {
    return new Promise(async (resolve, reject) => {
        let cardData = Platform.OS == 'ios' ? card : typeof card === 'string' ? JSON.parse(card) : card
        let publicKey = cardData?.wallets[0]?.publicKey
        const walletPublicKeyBase64 = Platform.OS == 'ios' ? Buffer.from(publicKey, 'hex').toString('base64') : publicKey;
        let derivationArray = [EVM_DERIVATION, BTC_DERIVATION, TRON_DERIVATION]
        let ethDerivedKey = await AppModelModule.derivePublicAddressKey(cardData?.cardId, walletPublicKeyBase64, derivationArray);
        let keysResult = JSON.parse(ethDerivedKey)
        let ethAddress = convertEthAddress(keysResult[derivationArray[0]].publicKey)
        let btcAddress = convertBTCAddress(keysResult[derivationArray[1]].publicKey)
        let trxAddress = await AppModelModule.generateTronAddressFromPublicKey(keysResult[derivationArray[2]].publicKey)
        resolve({
            eth: ethAddress,
            ethPublicKey: keysResult[derivationArray[0]].publicKey,
            btc: btcAddress,
            btcPublicKey: keysResult[derivationArray[1]].publicKey,
            trx: trxAddress,
            tronPublicKey: keysResult[derivationArray[2]].publicKey,
        })
    })
};

export const convertEthAddress = (publicKeyHex) => {
    let address = publicKeyToAddress(Buffer.from(publicKeyHex, 'hex'))
    console.log('ETH Address:', address);
    return address
}

export const convertBTCAddress = (publicKeyHex) => {
    const publicKeyBuffer = Buffer.from(publicKeyHex, 'hex');
    const publicKeyHash = bitcoin.crypto.sha256(publicKeyBuffer);
    const hash160 = bitcoin.crypto.ripemd160(publicKeyHash);
    const { address } = bitcoin.payments.p2wpkh({ hash: hash160 });
    console.log('BIP84 Address:', address);
    return address
}
export const convertTRXAddress = (publicKeyHex) => {
    const address = getBase58CheckAddress(computeAddress(publicKeyHex))
    console.log('TRX Address:', address);
    return address
}


export const signTransaction = (hash, publicKey, derivedPath, cardId) => {
    return new Promise((resolve, reject) => {

        console.log("hash>>>>>", hash, "publicKey>>>>", publicKey, "derivedPath>>>>", derivedPath, "cardId>>>>>", cardId)

        AppModelModule.generateSignHash(hash, publicKey, derivedPath, cardId)
            .then(result => {
                console.log("generateSignHash==result====--==", JSON.parse(result))
                resolve(result)
            })
            .catch(error => {
                console.log("signTransaction==error====", error)
                reject(`${error}`)
            });
    })
}

export const signTransactions = (hashes, publicKey, derivedPath, cardId) => {
    return new Promise((resolve, reject) => {
        AppModelModule.generateSignHashes(hashes, publicKey, derivedPath, cardId)
            .then(result => {
                console.log("generateSignHash==result====--==", JSON.parse(result))
                resolve(result)
            })
            .catch(error => {
                console.error(error);
                reject(error)
            });
    })
}

export const unmarshalSignature = (signature, hash, publicKey, key = 27) => {
    return new Promise((resolve, reject) => {
        AppModelModule.unmarshal(signature, hash, publicKey, key)
            .then(result => {
                console.log("unmarshalSignature==result====--==", result)
                resolve(result)
            })
            .catch(error => {
                console.error('-------------unmarshel error', error);
                reject(error)
            });
    })
}


export const Ethmarshal = (fromAddress, toAddress, value, gasLimit, gasPrice, nonceValue, input, chainId, walletPublicKey, derivationPath, cardId, publicKey) => {
    return new Promise((resolve, reject) => {
        AppModelModule.eth_marshal(fromAddress, toAddress, value, gasLimit, gasPrice, nonceValue, input, chainId, walletPublicKey, derivationPath, cardId, publicKey)
            .then(result => {
                console.log("ethmarshal==result====--==", result)
                resolve(result)
            })
            .catch(error => {
                console.error('-------------evm_unmarshal error', error);
                reject(error)
            });
    })
}


export const Bnbmarshal = (fromAddress, toAddress, value, gasLimit, gasPrice, nonceValue, input, chainId, walletPublicKey, derivationPath, cardId, publicKey) => {
    return new Promise((resolve, reject) => {
        AppModelModule.bnbmarshal(fromAddress, toAddress, value, gasLimit, gasPrice, nonceValue, input, chainId, walletPublicKey, derivationPath, cardId, publicKey)
            .then(result => {
                console.log("bnbmarshal==result====--==", result)
                resolve(result)
            })
            .catch(error => {
                console.error('-------------evm_unmarshal error', error);
                reject(error)
            });
    })
}


