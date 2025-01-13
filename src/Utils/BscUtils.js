import Singleton from "../Singleton";
import Web3 from 'web3';
import idaAbi from '../idaAbi.json';
import { exponentialToDecimal, getData } from "./MethodsUtils";
const web3BNB = new Web3(Singleton.getInstance().BSC_RPC_URL)
import * as Constants from '../Constants'
/************************************** Get Bnb Balance *****************************************/
export const getBnbBal = async (walletAddress) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(Singleton.getInstance().BSC_RPC_URL));
  const balance = await web3.eth.getBalance(walletAddress); //Will give value in wei.
  console.log('chk bsc balance::::::', balance / 10 ** 18);
  return (balance / 10 ** 18);
};

/************************************** Generate bep-20 data encode *****************************************/
export const bnbDataEncode = async (tokenAdrs, toAdrs, amountSent) => {

  const contract = await new web3BNB.eth.Contract(idaAbi, tokenAdrs);
  let dataEncoded = await contract.methods.transfer(toAdrs, exponentialToDecimal(amountSent).toString()).encodeABI();
  return dataEncoded;
};
// ************************************** Generate BNB signed raw *****************************************
export const getBnbRaw = async (amount, toAddress, nonce1, gasPriceTxn, gasLimitTxn, chainID, pvtKey) => {
  const web3BNB = new Web3(chainID == 56 ? Singleton.getInstance().BSC_RPC_URL : Singleton.getInstance().MATIC_RPC_URL)

  let multiWallet = await getData(Constants.MULTI_WALLET_LIST)
  let multiWalletData = JSON.parse(multiWallet)
  let currentWallet = multiWalletData.filter(el => el?.defaultWallet == true)[0]
  const amountToSend = web3BNB.utils.toWei(amount, 'ether',);
  console.log(Singleton.getInstance().defaultBnbAddress);
  const nonce = await web3BNB.eth.getTransactionCount(Singleton.getInstance().defaultBnbAddress, 'latest');
  return new Promise((resolve, reject) => {
    const rawTxn = {
      nonce: nonce,
      gasPrice: gasPriceTxn,
      gasLimit: (gasLimitTxn + 100),
      to: toAddress,
      value: web3BNB.utils.toHex(amountToSend),
      // from: Singleton.getInstance().defaultBnbAddress,
      // data: '0x00',
      chainId: chainID
    }

    console.log("RAW-----", rawTxn, pvtKey)
    try {


      web3BNB.eth.accounts.signTransaction(rawTxn, pvtKey).then(res => {
        console.log("res-----", res)

        resolve(res.rawTransaction.slice(2));
      }).catch(err => {
        console.log("err1111-----", err)

      })
    } catch (error) {
      console.log("error-----", rawTerrorxn)

    }

  })
};

// ************************************** Generate BEP-20 signed raw *****************************************
export const sendTokenBNB = async (toAddress, encodeData, nonce, gasPriceTxn, gasLimitTxn, chainID, pvtKey) => {
  return new Promise(async (resolve, reject) => {
    const web3Instance = new Web3(chainID == 56 ? Singleton.getInstance().BSC_RPC_URL : Singleton.getInstance().MATIC_RPC_URL)
    const rawTransaction = {
      nonce: nonce,
      gasPrice: gasPriceTxn,
      gasLimit: gasLimitTxn,
      to: toAddress,
      value: '',
      data: encodeData,
      chainId: chainID
    };
    console.log("RAW_DATA=====", rawTransaction)
    web3BNB.eth.accounts.signTransaction(rawTransaction, pvtKey).then(res => {
      resolve(res.rawTransaction.slice(2));
    }).catch(error => {
      reject(error);
    });

  })
};