import Singleton from "../Singleton";
import Web3 from 'web3';
const web3Matic = new Web3("https://polygon-mainnet.infura.io") //Singleton.getInstance().MATIC_RPC_URL);// new Web3(Constants.network == 'testnet' ? Constants.MATIC_TESTNET_URL : Constants.MATIC_MAINNET_URL);

/************************************** Get matic Balance *****************************************/
export const getMaticBal = async (walletAddress) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(Singleton.getInstance().MATIC_RPC_URL));
  const balance = await web3.eth.getBalance(walletAddress); //Will give value in wei.
  console.log('chk matic balance::::::', balance / 10 ** 18);
  return (balance / 10 ** 18);
};

// ************************************** Generate Matic signed raw *****************************************
export const getMaticRaw = async (amount, toAddress, nonce, gasPriceTxn, gasLimitTxn, chainID, pvtKey, fromCrossChain = false) => {
  const amountToSend = Web3.utils.toWei(amount, 'ether',);
  console.log(amount + 'klsdjnfklnsd  matic' + '-----chainID', chainID);
  console.log('in send matic');
  return new Promise((resolve, reject) => {
    try {

      let rawTxn;
      fromCrossChain ?
        rawTxn = {
          nonce: nonce,
          gasPrice: gasPriceTxn,
          gasLimit: (gasLimitTxn),
          to: toAddress,
          value: amountToSend,
          from: Singleton.getInstance().defaultMaticAddress,
          // data: '0x0',
          chainId: chainID
        } :
        rawTxn = {
          nonce: nonce,
          gasPrice: gasPriceTxn,
          gasLimit: gasLimitTxn,
          to: toAddress,
          value: amountToSend,
          from: Singleton.getInstance().defaultMaticAddress,
          data: '0x0',
          chainId: chainID
        }

      console.log("rawTxn>>>", rawTxn);

      web3Matic.eth.accounts.signTransaction(rawTxn, pvtKey).then(res => {
        console.log("res111111>>>", res);
        resolve(res.rawTransaction.slice(2));
        // web3Matic.eth.sendSignedTransaction(res.rawTransaction).then(res => {
        //   console.log("res>>>", res);
        // }).catch(error => {
        //   console.log("error>>>", error);
        // })
      })

    } catch (error) {
      reject(error)
    }
  })
};
// ************************************** Generate POL ERC-20 signed raw *****************************************
export const getMaticTokenRaw = async (toAddress, encodeData, nonce, gasPriceTxn, gasLimitTxn, chainID, pvtKey,) => {
  return new Promise((resolve, reject) => {
    const rawTransaction = {
      nonce: nonce,
      gasPrice: gasPriceTxn,
      gasLimit: gasLimitTxn,
      to: toAddress,
      value: '',
      from: Singleton.getInstance().defaultMaticAddress,
      data: encodeData,
      chainId: chainID
    };
    web3Matic.eth.accounts.signTransaction(rawTransaction, pvtKey).then(res => {
      resolve(res.rawTransaction.slice(2));
    }).catch(error => {
      reject(error);
    });
  })
};