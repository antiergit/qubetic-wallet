import { Images } from './theme';
import Web3 from 'web3';
import { IS_PRODUCTION } from '../src/EndPoint';
import { Alert, Platform } from 'react-native';
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';
import { utils, Wallet } from 'ethers';
// import { Wallet } from 'ethers/lib';
import * as Constants from './Constants'
import { LanguageManager } from '../LanguageManager';
import { ThemeManager } from '../ThemeManager';
import colors from './theme/Colors';
import { ethers } from 'ethers';
import { getData, saveData } from './Utils/MethodsUtils';
import { EVM_DERIVATION, signTransaction, unmarshalSignature } from './TangemUtils';
import SInfo from 'react-native-sensitive-info';
const EthRpcUrl = Constants.network == 'testnet' ? Constants.ETH_TESTNET_URL : Constants.ETH_MAINNET_URL;
const BscRpcUrl = Constants.network == 'testnet' ? Constants.BSC_TESTNET_URL : Constants.BSC_MAINNET_URL;
const MaticRpcUrl = Constants.network == 'testnet' ? Constants.MATIC_TESTNET_URL : Constants.MATIC_MAINNET_URL;

export default class Singleton {
  static myInstance = null;
  static bottomBar = null;
  static isCameraOpen = false;
  static isPermission = false;
  static isFirsLogin = false;
  static isNotification = false;
  static themeStatus = '1';
  defaultEthAddress = '';
  defaultBtcAddress = '';
  defaultTrxAddress = '';
  defaultBnbAddress = '';
  defaultLtcAddress = '';
  defaultMaticAddress = '';
  defaultSolAddress = '';
  defaultTicsAddress = '';
  refCode = '';
  defaultEmail = '';
  walletName = 'Basic';
  CurrencySymbol = '$';
  CurrencySelected = 'USD';
  SelectedLanguage = 'en';
  ETH_RPC_URL = '';
  ETH_DAPP_RPC_URL = '';
  unique_id = '';
  BSC_RPC_URL = '';
  BTC_RPC_URL = '';
  MATIC_RPC_URL = '';
  SOL_RPC_URL = '';
  TICS_RPC_URL = 'https://dev-evm-rpc.qubetics.work/';
  updateAlert = null;
  updateRefModal = null;
  updateAlertModal = null;
  reqListPopup = null;
  makerReqStatusPopup = null;
  showToast = null;
  swapSelectedCoin = null;
  buySellSelectedCoin = null;
  fromWatchList = false;
  walletConnectRef = false;
  userRefCode = '';
  card = {}
  cardActive = false;
  phyAndvirtualCard = false;
  hide = false;
  isHideBalance = false;
  virtualCardStatus = 'inactive'
  physicalCardStatus = 'inactive'
  isMakerWallet = false;
  isOnlyBtcCoin = false;
  isOnlyTrxCoin = false;
  static getInstance() {
    if (Singleton.myInstance == null) {
      Singleton.myInstance = new Singleton();
    }
    return this.myInstance;
  }
  //******************************************* signPersonalMessage **********************************************/
  signPersonalMessage(data, pKey) {
    return new Promise((resolve, reject) => {
      try {
        const EthRpcUrl = Singleton.getInstance().ETH_RPC_URL
        const web3 = new Web3(EthRpcUrl);
        const signature = web3.eth.accounts.sign(data, pKey)
        // console.log('signPersonalMessage res::::::', signature);
        resolve(signature?.signature);
      }
      catch (err) {
        console.log('ignPersonalMessage err::::::', err);
        reject(err);
      }
    });
  }
  //******************************************* dappApprovalHash **********************************************/
  async dappApprovalHash(pvt_key, approvalParam) {
    return new Promise(async (resolve, reject) => {
      let wallet = new Wallet(pvt_key);
      wallet._signTypedData(
        approvalParam.domain,
        approvalParam.types,
        approvalParam.message).then(async (resww) => {
          console.log("resww>>", resww);
          resolve(resww)

        }).catch(err => {
          console.log('dappApprovalHash err::::', err);
          reject(err)
        });
    })
  };

  //******************************************* getsignRawTxnDapp **********************************************/
  async getsignRawTxnDapp(pKey, toAmount, gas_gwei_price, gas_estimate, nonce, toAddress, myAddress, data, symbol) {
    let multiWallet = await getData(Constants.MULTI_WALLET_LIST);
    let multiWalletData = JSON.parse(multiWallet);
    let currentWallet = multiWalletData.filter(
      (el) => el?.defaultWallet == true
    )[0];
    try {
      const EthRpcUrl = Singleton.getInstance().ETH_RPC_URL
      const BscRpcUrl = Singleton.getInstance().BSC_RPC_URL
      const MaticRpcUrl = Singleton.getInstance().MATIC_RPC_URL
      let web3Dapp = null;
      if (symbol?.toLowerCase() == 'bnb') {
        web3Dapp = new Web3(BscRpcUrl);
      } else if (symbol?.toLowerCase() == 'pol') {
        web3Dapp = new Web3(MaticRpcUrl);
      } else {
        web3Dapp = new Web3(EthRpcUrl);
      }
      const web3Dapp1 = web3Dapp
      console.log('this.props.toAmount', toAmount);
      const amountToSend = web3Dapp1.utils.toWei(toAmount, 'ether');
      const amount = web3Dapp1.utils.toHex(amountToSend);
      let gasPrice = gas_gwei_price;
      gasPrice = (symbol?.toLowerCase() == 'bnb' || symbol?.toLowerCase() == 'pol') ? gasPrice * 10 ** 9 : gasPrice
      const estimateGas = gas_estimate;
      const chainID = symbol?.toLowerCase() == 'bnb' ? (IS_PRODUCTION == 0 ? 97 : 56) : symbol?.toLowerCase() == 'pol' ? (IS_PRODUCTION == 0 ? 80001 : 137) : (IS_PRODUCTION == 0 ? 11155111 : 1)
      console.log('gasPrice', gasPrice);
      console.log('estimateGas', estimateGas);
      const rawTransaction = {
        nonce: nonce,
        gasPrice: web3Dapp1.utils.toHex(gasPrice),
        gasLimit: web3Dapp1.utils.toHex(estimateGas),
        to: toAddress,
        value: amount,
        from: myAddress,
        data: data,
        chainId: chainID,
      };
      console.log('rawTransaction:::::getsignRawTxnDapp ', rawTransaction);
      let serializedTx = '';
      if (!currentWallet?.login_data?.isTangem) {
        const signedTx = await web3Dapp1.eth.accounts.signTransaction(rawTransaction, pKey);
        // console.log('signedTx::::::', signedTx);
        serializedTx = signedTx?.rawTransaction?.substring(2);
      } else {
        delete rawTransaction.from;
        // rawTransaction.value = web3Dapp1.utils.toHex(amount)
        console.log('makeTransaction_tangem 1111111')
        let serializedTxn = ethers.utils.serializeTransaction(rawTransaction)
        console.log('makeTransaction_tangem 222222')
        let hash = ethers.utils.keccak256(serializedTxn)
        console.log('makeTransaction_tangem 33333333')
        let walletPublicKey = currentWallet?.login_data?.walletPublicKey
        console.log('makeTransaction_tangem 4444444')
        let res = await signTransaction(hash, walletPublicKey, EVM_DERIVATION, currentWallet?.login_data?.card?.cardId)
        console.log('makeTransaction_tangem 555555')
        let result = JSON.parse(res)
        let unmarshalSig = await unmarshalSignature(result.signature, hash, currentWallet?.login_data?.ethPublicKey, (35 + chainID * 2))
        let serializedSignedTxn = ethers.utils.serializeTransaction(rawTransaction, "0x" + unmarshalSig)


        let decodedTxn = ethers.utils.parseTransaction(serializedSignedTxn);
        console.log("unmarshalSig-----", decodedTxn, decodedTxn?.from)
        if (Singleton.getInstance().defaultBnbAddress.toLowerCase() != decodedTxn?.from.toLowerCase()) {
          unmarshalSig = await unmarshalSignature(result.signature, hash, currentWallet?.login_data?.ethPublicKey, 1 + (35 + chainID * 2))
          serializedSignedTxn = ethers.utils.serializeTransaction(rawTransaction, "0x" + unmarshalSig)
          decodedTxn = ethers.utils.parseTransaction(serializedSignedTxn);
          console.log("decodedTxn-----", decodedTxn, decodedTxn?.from)
        }
        serializedTx = serializedSignedTxn.slice(2)
      }

      console.log('serializedTx:::::', serializedTx);
      console.log(`Attempting to send signed Eth tx:  0x${serializedTx}`);
      return serializedTx;
    }
    catch (err) {
      console.log("SignRawTxnDapp_ERR:::::", err);
    }
  }
  //******************************************* cameraPermission **********************************************/
  async cameraPermission() {
    Singleton.isCameraOpen = true;
    var response = '';
    if (Platform.OS == 'android') {
      response = await request(PERMISSIONS.ANDROID.CAMERA);
    } else {
      response = await request(PERMISSIONS.IOS.CAMERA);
    }
    if (response != 'granted') {
      Alert.alert('Camera Permission', 'Please allow from setting manually.', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Ok', onPress: () => openSettings() },
      ]);
    }
    return response;
  }
  //******************************************** getStatus **************************************************/
  getStatus(item) {
    const { detailTrx } = LanguageManager;
    const trx_type = item.type?.toLowerCase();
    const status = item.status?.toLowerCase();
    const blockChain_status = item.blockchain_status != null ? item.blockchain_status?.toLowerCase() : item?.blockchain_status;
    if (status == 'failed' || blockChain_status == 'failed') {
      return detailTrx.Failed;
    } else if (trx_type == 'withdraw' || trx_type == 'approve' || trx_type == 'cross_chain' || trx_type == 'swap') {
      if (blockChain_status == 'confirmed' && status == 'completed') {
        return detailTrx.completed;
      }
      if ((blockChain_status == null || blockChain_status == 'pending') && status == 'completed') {
        return detailTrx.pending;
      }
      if (blockChain_status == null && status == 'unconfirmed') {
        return detailTrx.pending;
      }
    } else if (trx_type == 'buy' || trx_type == 'sell') {
      if (status == 'completed') {
        return detailTrx.completed;
      }
      if (status == 'pending') {
        return detailTrx.pending;
      }
    } else if (trx_type != 'withdraw') {
      if (status == 'completed') {
        return detailTrx.completed;
      }
      if (status == 'unconfirmed') {
        return detailTrx.pending;
      }
    }
  }
  //******************************************* getStatusColor **********************************************/
  getStatusColor(item) {
    const trx_type = item.type?.toLowerCase();
    const status = item.status?.toLowerCase();
    const blockChain_status = item.blockchain_status != null ? item.blockchain_status?.toLowerCase() : item?.blockchain_status;
    if (status == 'failed' || blockChain_status == 'failed') {
      return 'red';
    } else if (trx_type == 'withdraw' || trx_type == 'approve' || trx_type == 'cross_chain' || trx_type == 'swap') {
      if (blockChain_status == 'confirmed' && status == 'completed') {
        return colors.profitColor;
      }
      if ((blockChain_status == null || blockChain_status == 'pending') && status == 'completed') {
        return 'rgba(211, 155, 73, 1)';
      }
      if (blockChain_status == null && status == 'unconfirmed') {
        return 'rgba(211, 155, 73, 1)';
      }
    } else if (trx_type == 'buy' || trx_type == 'sell') {
      if (status == 'completed') {
        return 'green';
      }
      if (status == 'pending') {
        return 'rgba(211, 155, 73, 1)';
      }
    } else if (trx_type != 'withdraw') {
      if (status == 'completed') {
        return 'green';
      }
      if (status == 'unconfirmed') {
        return 'rgba(211, 155, 73, 1)';
      }
    }
  }
  //******************************************* getStatusImage **********************************************/
  getStatusImage(item, address) {
    const trx_type = item.type?.toLowerCase();
    const status = item.status?.toLowerCase();
    const blockChain_status = item.blockchain_status != null ? item.blockchain_status?.toLowerCase() : item?.blockchain_status;
    const Address = address;
    if (status == 'failed' || blockChain_status == 'failed') {
      return Images.icTransactionFail;
    } else if (trx_type?.toLowerCase() == 'card_fees' || trx_type?.toLowerCase() == 'card_recharge' || trx_type?.toLowerCase() == 'level_upgradation_fee') {
      return Images.withdrawNew;
    } else if (trx_type?.toLowerCase() == 'withdraw' && item?.from_adrs?.toLowerCase() == address?.toLowerCase()) {
      return Images.withdrawNew;
    } else if (trx_type?.toLowerCase() == 'withdraw' && item?.to_adrs?.toLowerCase() == address?.toLowerCase()) {
      return Images.deposit;
    } else if (trx_type?.toLowerCase() == 'swap' || trx_type?.toLowerCase() == 'cross_chain' || trx_type?.toLowerCase() == 'approve') {
      return Images.icTransactionSwap;
    } else if (trx_type?.toLowerCase() == 'buy') {
      return Images.deposit;
    } else if (trx_type?.toLowerCase() == 'sell') {
      return Images.withdrawNew;
    } else if (trx_type?.toLowerCase() != 'withdraw') {
      return Images.deposit;
    }
  }


  async handleSetItemUsingTouchIDOnPress(pin) {
    return new Promise(async (resolve, reject) => {
      try {
        const deviceHasSensor = await SInfo.isSensorAvailable();
        if (!deviceHasSensor) {
          //  alert('No sensor found');
          reject('No sensor found')
        }
        try {
          setTimeout(async () => {
            SInfo.setItem(Constants.KEYCHAIN_DATA_KEY, pin, {
              sharedPreferencesName: Constants.SHARED_PREFERENCES_NAME,
              keychainService: Constants.KEYCHAIN_SERVICE_NAME,
              kSecAccessControl: 'kSecAccessControlBiometryAny',
              touchID: true,
              showModal: true,
              strings: {
                header: LanguageManager.commonText.sInfoHeader,
                description: LanguageManager.commonText.sInfoDesc,
                hint: 'Biometric',
                success: LanguageManager.commonText.sInfoSuccess,
                notRecognized: LanguageManager.commonText.sInfoNotRecognized,
                cancelled: LanguageManager.commonText.sInfoCancelled, // reject error message
              },
              kSecUseOperationPrompt: LanguageManager.commonText.sInfoPermission,
            }).then((value) => {
              resolve(value); // value;
            }).catch((error) => {
              console.log('error in setItem method in Keychain ' + error);
              reject(error); // error;
            });
          }, 1200);
        } catch (error) {
          console.log(">>>> error", error);
          reject(error);
        }
      } catch (ex) {
        console.log(">>>> ex", ex);
        reject(ex);
      }
    })
  }

  getTouchIDItem = async (isBiometricRequired) => {
    return new Promise(async (resolve, reject) => {
      const deviceHasSensor = await SInfo.isSensorAvailable();
      console.log("deviceHasSensor>>>", deviceHasSensor);

      if (!deviceHasSensor) {
        // alert('No sensor found');
        reject({
          cancelled: true
        })
      }

      try {
        const data = await SInfo.getItem(Constants.KEYCHAIN_DATA_KEY, {
          sharedPreferencesName: Constants.SHARED_PREFERENCES_NAME,
          keychainService: Constants.KEYCHAIN_SERVICE_NAME,
          kSecAccessControl: 'kSecAccessControlBiometryAny',
          touchID: true,
          showModal: true,
          strings: {
            header: LanguageManager.commonText.sInfoGetHeader,
            description: LanguageManager.commonText.sInfoGetDesc,
          },
          kSecUseOperationPrompt: LanguageManager.commonText.sInfoPermission,
        });
        console.log("data>>>", data);

        if ((data == null || data == undefined || data == "") && !isBiometricRequired) {
          alert(LanguageManager.commonText.tryPin);
          saveData(Constants.BIOMETRIC_MODE, "false");
          reject({
            cancelled: false
          })
        } else {
          resolve(data)
        }
      } catch (ex) {
        if (ex.message == "Cancel") {
          reject({
            cancelled: true
          })
        } else {
          reject({
            cancelled: false
          })
        }

        // alert(ex.message);
      }
    })

  }
  deleteKeyChainData = () => {
    return new Promise((resolve, reject) => {
      SInfo.deleteItem(Constants.KEYCHAIN_DATA_KEY, {
        sharedPreferencesName: Constants.SHARED_PREFERENCES_NAME,
        keychainService: Constants.KEYCHAIN_SERVICE_NAME,
        kSecAccessControl: 'kSecAccessControlBiometryAny',
      }).then(res => {
        resolve()
      }).catch(err => {
        reject()
      })
    })
  }

}
//*******************************************  **********************************************/
export const gaslessSign = async (pvt_key, approvalParam, vValue) => {
  console.log("approvalParam::::  ", approvalParam)
  console.log("pvt_key::::  ", pvt_key)
  return new Promise(async (resolve, reject) => {


    let multiWallet = await getData(Constants.MULTI_WALLET_LIST)
    let multiWalletData = await JSON.parse(multiWallet)
    let currentWallet = await multiWalletData.filter(el => el?.defaultWallet == true)[0]
    if (!currentWallet?.login_data?.isTangem) {
      let wallet = new Wallet(pvt_key);
      wallet._signTypedData(approvalParam.domain, approvalParam.types, approvalParam.message, approvalParam.primaryType
      ).then(async (resww) => {
        const sig = utils.splitSignature(resww);
        console.log('sig ::::::::', sig);
        let verify = utils.verifyTypedData(approvalParam.domain, approvalParam.types, approvalParam.message, sig)
        console.log('verify ::::::::', verify);
        resolve(sig)
      }).catch(err => {
        console.log('gaslessSign err::::', err);
        reject(err)
      });
    } else {
      let walletPublicKey = await currentWallet?.login_data?.walletPublicKey

      let rawTxn = await utils._TypedDataEncoder.hash(
        approvalParam.domain,
        approvalParam.types,
        approvalParam.message
      );
      console.log('rawTxn >>>>>>', rawTxn);

      signTransaction(rawTxn, walletPublicKey, EVM_DERIVATION, currentWallet?.login_data?.card?.cardId)
        .then(async res => {
          try {
            let recId = 0;  // Start with recId = 0; if it fails, try recId = 1 later
            let chainId = 1;

            let result = JSON.parse(res)
            let r = result.signature.slice(0, 64);  // First 64 hex characters for r
            let s = result.signature.slice(64, 128); // Next 64 hex characters for s
            let v = vValue;
            let fullSignature = `0x${r}${s}${v.toString(16).padStart(2, '0')}`;  // Convert `v` to hex
            const sig = ethers.utils.splitSignature(fullSignature);
            console.log('Signature components:', sig);  // Sig will now contain { r, s, v }

            // let verify = utils.verifyTypedData(approvalParam.domain, approvalParam.types, approvalParam.message, sig)


            // let recoveredAddress = ethers.utils.recoverAddress(
            //   ethers.utils.hashMessage(rawTxn),
            //   sig
            // );
            // console.log('verify Address:', verify);
            // console.log('recoveredAddress:', recoveredAddress);
            resolve(sig)
          } catch (error) {
            console.log("error>>>", error);
            reject(error)
          }

        })
        .catch(err => {
          console.log("err>>>", err);
          reject(err)
        })
    }
  })
};