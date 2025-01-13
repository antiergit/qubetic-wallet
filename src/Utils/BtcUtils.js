import * as Constants from "../Constants";
import { IS_PRODUCTION } from "../EndPoint";
import { saveData } from "./MethodsUtils";
import { BTC_DERIVATION, signTransactions } from "../TangemUtils";
import { Platform } from "react-native";
import { Network } from "bitcoinjs-lib/src/types";
const bitcore = require("bitcore-lib");
const bitcoin = require("bitcoinjs-lib");
const bip32 = require("bip32");

/************************************** Generate BTC Wallet ************************************/
export const generateBTCAddress = (mnemonics) => {
  const BIP84 = require("bip84");
  var root = new BIP84.fromSeed(
    mnemonics,
    "",
    Constants.network == "testnet" ? true : false
  );
  var child0 = root.deriveAccount(0);
  var account0 = new BIP84.fromZPrv(child0);
  return {
    btcAddress: account0.getAddress(0),
    btc_pvtKey: account0.getPrivateKey(0),
  }; //account0;
};

/************************************** convertBtcPrivateKeyToAddress ************************************/
export const convertBtcPrivateKeyToAddress = (privatekey) => {
  const bitcoin = require('bitcoinjs-lib');
  const privateKeyWIF = privatekey;
  const network = bitcoin.networks.bitcoin;
  try {
      const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);
      const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network });
      saveData(address + "_pk", privatekey);
      return { btc_address: address, btcprivateKey: privatekey };
  } catch (error) {
      console.error("Error deriving address:", error);
      return { btc_address: undefined, btcprivateKey: privatekey };
  }
  
};
/************************************** Validate BTC Address ************************************/
export const validateBTCAddress = (text) => {
  return bitcore.Address.isValid(
    text,
    IS_PRODUCTION == 0 ? bitcore.Networks.testnet : bitcore.Networks.mainnet
  );
};

export const sendBtcTangem = async (
  wallet,
  inputs,
  fee,
  amount,
  toAddress,
  myAddress
) => {
  console.log(
    "sendBtcTangem",
    wallet,
    inputs,
    fee,
    amount,
    toAddress,
    myAddress
  );
  let walletPublicKey = wallet?.login_data?.walletPublicKey;
  let btcPublicKey = wallet?.login_data?.btcPublicKey;
  console.log("sendBtcTangem btcPublicKey ------", btcPublicKey);
  const NETWORK = bitcoin.networks.bitcoin; // Use bitcore.Networks.testnet for testnet
  const sigtype = bitcore.crypto.Signature.SIGHASH_ALL;
  const pubKey = Buffer.from(btcPublicKey, "hex");
  console.log("sendBtcTangem pubKey ------", pubKey);
  let inputSatoshi = 0;
  inputs.map((el, index) => {
    inputSatoshi = inputSatoshi + Math.round(el?.satoshis);
  });
  console.log("inputSatoshi -----", inputSatoshi);

  const pendingAmount = inputSatoshi - fee - amount;
  console.log("pendingAmount -----", pendingAmount);
  const version = 2;
  const psbt = new bitcoin.Psbt({ network: NETWORK });
  psbt.addOutput({
    address: toAddress,
    value: amount,
  });
  console.log("psbt 11-----");

  psbt.addOutput({
    address: myAddress,
    value: pendingAmount,
  });
  console.log("psbt 22-----");

  psbt.setVersion(version);
  console.log("psbt 33-----");

  psbt.setMaximumFeeRate(120);
  console.log("psbt 44-----");

  inputs.map((el, index) => {
    const txIndex = el.outputIndex;
    const utxoTransactionId = el.txId;

    console.log("psbt 441-----", utxoTransactionId);
    console.log("psbt 442-----", txIndex);
    console.log("psbt 443-----", el.tx_raw);
    psbt.addInput({
      hash: utxoTransactionId,
      index: txIndex,
      nonWitnessUtxo: Buffer.from(el.tx_raw, "hex"),
    });
  });
  console.log("psbt 55-----");

  const hashes = inputs.map((el, index) => {
    const meaningfulScript = Buffer.from(el.script, "hex");
    const signingScript = bitcoin.payments.p2pkh({
      hash: meaningfulScript.slice(2),
    }).output;
    console.log("psbt 66-----");

    let hash = psbt.__CACHE.__TX.hashForWitnessV0(
      index,
      signingScript,
      el.satoshis,
      sigtype
    );
    console.log("psbt 77-----");

    return hash.toString("hex");
  });

  console.log(
    "sendBtcTangem1",
    hashes,
    walletPublicKey,
    BTC_DERIVATION,
    wallet?.login_data?.card?.cardId
  );
  const response = await signTransactions(
    hashes,
    walletPublicKey,
    BTC_DERIVATION,
    wallet?.login_data?.card?.cardId
  );
  const signatureResp = JSON.parse(response);
  console.log("sendBtcTangem___ -----", signatureResp);
  signatureResp.signatures.map((signatureHex, index) => {
    console.log("sendBtcTangem___ 88888-----", signatureHex);
    const encodeSignature = bitcoin.script.signature.encode(
      Buffer.from(signatureHex, "hex"),
      sigtype
    );
    const decodedSignature = bitcoin.script.signature.decode(encodeSignature);
    console.log(
      "sendBtcTangem___ 777777-----",
      JSON.stringify(decodedSignature)
    );
    bitcoin.ECPair.fromPublicKey(pubKey);
    const signer = {
      network: NETWORK,
      publicKey: pubKey,
      sign: (hash) => {
        return decodedSignature.signature;
      },
    };
    console.log("sendBtcTangem___ 66666-----");
    psbt.signInput(index, signer);
    console.log(
      "sendBtcTangem___ 999999 singleValidate vals-----",
      pubKey,
      index,
      signer
    );
  });

  const isValidated = psbt.validateSignaturesOfAllInputs();
  console.log("sendBtcTangem___ 22222-----", isValidated);
  psbt.finalizeAllInputs();
  console.log("sendBtcTangem___ 44444-----");
  const hex = psbt.extractTransaction().toHex();
  console.log("sendBtcTangem___ 55555-----", hex);
  if (isValidated) {
    return hex;
  }
};

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

export function isValidBitcoinPrivateKey(privateKey) {
  try {
    bitcoin.ECPair.fromWIF(privateKey);
    return true;
  } catch (e) {
    return false;
  }
}
