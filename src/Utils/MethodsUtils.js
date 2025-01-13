import EncryptedStorage from 'react-native-encrypted-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as Constants from '../Constants';
import Singleton from '../Singleton';
import { Dimensions } from 'react-native';
import { ThemeManager } from '../../ThemeManager';
import { BigNumber } from "bignumber.js";

const CryptoJS = require("crypto-js");

export const saveEncryptedData = (key, value, pin) => {
  // console.log('-----------------save response', key, value, pin)
  return new Promise(async (resolve, reject) => {
    try {
      let response = await EncryptedStorage.setItem(
        key.toLowerCase(),
        encryptDataAES(value.toString(), pin)
      );
      // console.log('-----------------save response', response)
      resolve(response);
    } catch (err) {
      //  console.log('-----------------save reject', err)
      reject(err);
    }
  });
};

export const getEncryptedData = (key, pin) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await EncryptedStorage.getItem(key.toLowerCase());
      console.log('----------------------- getEncryptedDataresponse', response, '-----------key', key, pin)
      if (response == undefined) {
        reject({ message: "No record" });
      }
      resolve(decryptDataAES(response, pin));
    } catch (err) {
      reject(err);
    }
  });
};

export const encryptDataAES = (data, pin) => {
  // console.log('----------------------before cipherText', data, pin)
  var ciphertext = CryptoJS.AES.encrypt(data, pin).toString();
  // console.log('----------------------cipherText', ciphertext)
  return ciphertext;
};

export const decryptDataAES = (data, pin) => {
  // console.log('----------------decryptDataAES', data, pin)

  let bytes = CryptoJS.AES.decrypt(data, pin);
  console.log("bytes ======", bytes)
  let decryptText = bytes.toString(CryptoJS.enc.Utf8);
  console.log('----------------decryptText', decryptText)
  return decryptText;
};

//******************************************* save Data **********************************************/
export const saveData = (key, value) => {
  EncryptedStorage.setItem(key, value?.toString()).then((res) => {
    key == 'favorite' && console.log(key, 'saveData ::::', value, 'res::::::', res);
  }).catch(err => {
    console.log('newSaveData err::::', err);
  })
}

export const saveDataInStorage = (key, value) => {
  return new Promise(async (resolve, reject) => {
    EncryptedStorage.setItem(key, value?.toString())
      .then((res) => {
        key == "favorite" &&
          console.log(key, "saveDataInStorage ::::", value, "res::::::", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("saveDataInStorage err::::", key, err);
        console.log("saveDataInStorage err value::::", value);
        reject(err)
      });
  });
};
//******************************************* get Data **********************************************/
export const getData = (key) => {
  return new Promise(async (resolve, reject) => {
    EncryptedStorage.getItem(key).then((res) => {
      resolve(res);
    }).catch(err => {
      reject(err);
      console.log('newGetData err::::', err);
    })
  });
}

//******************************************* Remove Item **********************************************/
export const removeStorageItem = (key) => {
  return new Promise((resolve, reject) => {
    EncryptedStorage.removeItem(key).then(response => {
      resolve(response);
    }).catch(error => {
      console.log('clearStorage error $$$$$', error);
      reject(error);
    });
  });
}

//******************************************* ClearStorage **********************************************/
export const clearStorage = () => {
  return new Promise((resolve, reject) => {
    EncryptedStorage.clear().then(response => {
      resolve(response);
    }).catch(error => {
      console.log('clearStorage error $$$$$', error);
      reject(error);
    });
  });
}
//******************************************* callWeb3Auth **********************************************/
export const callWeb3Auth = () => {
  return new Promise((resolve, reject) => {
    // console.log('loginProvider::::::::', loginProvider, 'chk login_hint::::', login_hint);
    // Singleton.isCameraOpen = true;
    // const Web3Key = Constants.network == 'testnet' ? Constants.WEB3AUTH_KEY : Constants.WEB3AUTH_KEY_PROD
    try {
      // const web3auth = new Web3Auth(WebBrowser, { clientId: Web3Key, network: Constants.network == 'testnet' ? OPENLOGIN_NETWORK.TESTNET : OPENLOGIN_NETWORK.MAINNET });
      // web3auth.login({
      //   loginProvider: loginProvider,
      //   extraLoginOptions: {
      //     login_hint: login_hint,
      //   },
      //   redirectUrl: Constants.WEB3AUTH_REDIRECT_URL
      // }).then(async state => {
      //   console.log('chk res web3Auth:::::', state);
      //   resolve(state)
      // }).catch(err => {
      //   console.log('chk err web3Auth:::::', err);
      //   reject(err);
      // })
    } catch (error) {
      console.log('chk error web3Auth:::::', error);
      reject(error)
    }
  });
}
/************************************************** ToFixed **************************************************************/
export const toFixed = (num, fixed) => {
  if (num) {
    num = num.toString(); //If it's not already a String
    if (num.includes('.')) {
      num = num.slice(0, num.indexOf('.') + (fixed + 1));
    }
    return Number(num);
  }
  else return Number(0);
}
/************************************************** getCryptoAddress **************************************************************/
export const getCryptoAddress = (coin_family) => {
  // console.log('getCryptoAddress coin_family -----', coin_family)
  const address =
    coin_family == 3
      ? Singleton.getInstance().defaultBtcAddress
      : coin_family == 5
        ? Singleton.getInstance().defaultSolAddress
        : coin_family == 6
          ? Singleton.getInstance().defaultTrxAddress
          : coin_family == 1
            ? Singleton.getInstance().defaultBnbAddress
            : coin_family == 4
              ? Singleton.getInstance().defaultMaticAddress
              : Singleton.getInstance().defaultEthAddress;
  return address;
};
/************************************************** toFixedExp **************************************************************/
export function toFixedExp(num, fixed, value) {
  // console.log(value,'asfaiuysadfsy');
  if (num) {
    num = exponentialToDecimal(num);
    let re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    return num?.toString()?.match?.(re)?.[0];
  }
  else return '0.00';
}
/************************************************** exponentialToDecimal ***************************************************/
export const exponentialToDecimal = (exponential) => {
  let decimal = exponential?.toString().toLowerCase();
  if (decimal.includes('e+')) {
    const exponentialSplitted = decimal.split('e+');
    let postfix = '';
    for (let i = 0; i < +exponentialSplitted[1] - (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0); i++) {
      postfix += '0';
    }
    const addCommas = text => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)}${text.slice(textLength - j, textLength,)}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
  }
  if (decimal.toLowerCase().includes('e-')) {
    const exponentialSplitted = decimal.split('e-');
    let prefix = '0.';
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += '0';
    }
    decimal = prefix + exponentialSplitted[0].replace('.', '');
  }
  return decimal;
}
export const bigNumberFormat = (number) => {
  return new BigNumber(number)
}
export const bigNumberSafeMath = function (c, operation, d, precision) {
  BigNumber.config({ DECIMAL_PLACES: 18 });
  let a = new BigNumber(c?.toString());
  let b = new BigNumber(d?.toString());
  let rtn;
  // Figure out which operation to perform.
  switch (operation?.toLowerCase()) {
    case "-":
      rtn = a.minus(b);
      break;
    case "+":
      rtn = a.plus(b);
      break;
    case "*":
      rtn = a.multipliedBy(b);
    case "x":
      rtn = a.multipliedBy(b);
      break;
    case "÷":
    case "/":
      rtn = a.dividedBy(b);
      break;
    default:
      //operator = operation;
      break;
  }
  return rtn.toString();
};
/************************************************** exponentialToDecimalWithoutComma ***************************************************/
export const exponentialToDecimalWithoutComma = exponential => {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes('e+')) {
    const exponentialSplitted = decimal.split('e+');
    let postfix = '';
    for (let i = 0; i < +exponentialSplitted[1] - (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0); i++) {
      postfix += '0';
    }
    return exponentialSplitted[0].replace('.', '') + postfix;
  }
  if (decimal.toLowerCase().includes('e-')) {
    const exponentialSplitted = decimal.split('e-');
    let prefix = '0.';
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += '0';
    }
    decimal = prefix + exponentialSplitted[0].replace('.', '');
  }
  return decimal.toString();
};
/************************************************** getFirstDecimalNumber ***************************************************/
export const getFirstDecimalNumber = (value, altDecimal = 10) => {
  if (isNaN(Math.floor(Math.log10(value)))) {
    return exponentialToDecimal(toFixedExp(value, altDecimal))
  }
  return exponentialToDecimal(toFixedExp(value, - Math.floor(Math.log10(value) || altDecimal)))
}
/************************************************** currencyFormat ***************************************************/
export const currencyFormat = (num, toFixed) => {
  return num.toFixed(toFixed).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
/************************************************** removecomma ***************************************************/
export const removeComma = (num) => {
  console.log('chk num:::::::', num);
  if (num) {
    if (num.includes(',')) {
      num = num?.toString();
      num = num?.replace(/[,]/g, '');
      console.log('num::::::::removecomma', num);
      return num;
    } else return num;
  } else
    return '0.00';
}
/************************************************** CommaSeprator ***************************************************/
export const CommaSeprator1 = (num, fixed) => {
  if (isNaN(num)) return 0.00;
  if (num) {
    num = num?.toString(); //If it's not already a String
    num = exponentialToDecimal(num)
    if (num.includes('.')) {
      num = num.slice(0, num.indexOf('.') + (fixed + 1));
    }
    let number = num;                       // Decimal number
    let string = number.toString();         // Convert it into a string
    let array = string.split('.');          // Split the dot
    let firstNumber = +array[0];            // Get both numbers// The '+' sign transforms the string into a number again
    let secondNumber = array[1] == undefined ? 0 : array[1]; // 2
    return (Number(firstNumber).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '.' + secondNumber);
  } else return '0.00'
}
/************************************************** CommaSepratorNew ***************************************************/
export const CommaSeprator = (num, fixed) => {
  if (isNaN(num)) return 0.00;
  var val = num.toString(); //If it's not already a String
  let decimal = val?.toLowerCase();
  if ((decimal?.includes('e+') || decimal?.includes('e-'))) {
    let expoVal = exponentialToDecimal(num)
    let finalVal = expoVal.toString().length >= 6 ? expoVal.substring(0, 3) + "..." + expoVal.substring(expoVal.toString().length - 4, expoVal.toString().length) : expoVal
    return finalVal
  }
  if (!val.includes('.')) {
    if (val?.length >= 4) {
      return val = val?.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    } else {
      return val
    }
  }
  else if (val.includes('.')) {
    val = val.slice(0, val.indexOf('.') + (fixed + 1));
    var str = val.split('.');
    if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (parseFloat(str[0]) >= 1) {
      val = val.slice(0, val.indexOf('.') + (2 + 1));
      var str = val.split('.');
      if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      }
      return str.join('.')
    }
    return str.join('.');
  }

}
/************************************************** attachBtnClicked ***************************************************/
export const attachBtnClicked = () => {
  return new Promise((resolve, reject) => {
    global.isCamera = true;
    var options = {
      mediaType: 'photo',
      CancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose From Gallery',
      title: 'Choose Option',
      allowsEditing: true,
      quality: 1,
      maxWidth: 1160,
      maxHeight: 2272,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true
    };
    launchImageLibrary(options, response => {
      Singleton.isCameraOpen = true;
      console.log('Response ===== ', response);
      if (Object.keys(response).includes('error')) {
        reject('Not selected any Qr Image');
      } else {
        console.log("else::::");
        if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          reject('Something Went Wrong.');
        } else {
          console.log('********' + response.uri, response.fileSize / (1024 * 1024), parseInt(response.fileSize), parseInt(response.fileSize) > 209715);
          if (parseFloat(response.fileSize / (1024 * 1024)) > 2) {
            console.log("response.fileSize", response.fileSize);
            reject(`Size exceeds than 2mb.`);
          }
          // resolve({uri:response.uri.replace('file://', ''),base64:response.base64});
          resolve(response)
        }
      }
    });
  });
};

/************************************************** attachCameraClicked ***************************************************/
export const attachCameraClicked = () => {
  return new Promise((resolve, reject) => {
    global.isCamera = true;
    var options = {
      mediaType: 'photo',
      CancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose From Gallery',
      title: 'Choose Option',
      allowsEditing: true,
      quality: 1,
      maxWidth: 1160,
      maxHeight: 2272,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true
    };
    launchCamera(options, response => {
      Singleton.isCameraOpen = true;
      console.log('Response ===== ', response);
      if (Object.keys(response).includes('error')) {
        reject('Not selected any Qr Image');
      } else {
        console.log("else::::");
        if (response.error) {
          console.log('ImagePicker Error: ', response.error);
          reject('Something Went Wrong.');
        } else {
          console.log('********' + response.uri, parseInt(response.fileSize), parseInt(response.fileSize) > 209715);
          if (parseFloat(response.fileSize / (1024 * 1024)) > 2) {
            console.log("response.fileSize", response.fileSize);
            reject(`Size exceeds than 2mb.`);
          }
          resolve(response)
        }
      }
    });
  });
};
/************************************************** heightDimen ***************************************************/
export const heightDimen = (dimension) => {
  let height = 896
  let percentage = dimension / (height) * 100
  let screenHeight = Dimensions.get('screen').height
  let actualDImension = screenHeight * (percentage / 100)
  return actualDImension
}
/************************************************** widthDimen ***************************************************/
export const widthDimen = (dimension) => {
  let width = 414
  let percentage = dimension / (width) * 100
  let screenWidth = Dimensions.get('screen').width
  let actualDImension = screenWidth * (percentage / 100)
  return actualDImension
}

export const requestWalletApiData = async (data = {}) => {
  const { walletData, walletName, } = data;
  const apiData = {
    device_id: Singleton.getInstance().unique_id,
    wallet_address: walletData.eth_address,
    device_token: (await getData(Constants.DEVICE_TOKEN)) || "abc",
    wallet_name: walletName || "Basic",
    referral_code: "",
    addressList: [
      { symbol: "bnb", address: walletData.eth_address, coin_family: 1 },
      { symbol: "eth", address: walletData.eth_address, coin_family: 2 },
      { symbol: "btc", address: walletData.btc_address, coin_family: 3 },
      { symbol: "pol", address: walletData.eth_address, coin_family: 4 },
      { symbol: "sol", address: walletData.sol_address, coin_family: 5 },
      { symbol: "trx", address: walletData.trx_address, coin_family: 6 },
      { symbol: "tics", address: walletData.eth_address, coin_family: 7 },
    ],
  };
  return apiData;
};

export const createUserWalletLocal = async (inputData = {}) => {
  console.log("createUserWalletLocal inputData =======", inputData);
  const {
    resp,
    walletData,
    walletName,
    pin,
    isTangem,
    walletAlreadyExist,
    onSuccess,
    isPrivateKey
  } = inputData;

  const data = await requestWalletApiData({
    walletData,
    walletName,
  });
  console.log("requestWalletApiData data =======", data);

  const addrsListKeys = [
    walletData.eth_address,
    walletData.eth_address,
    walletData.btc_address,
    walletData.eth_address,
    walletData.sol_address,
    walletData.trx_address,
    walletData.eth_address,
  ];
  // const coinFamilyKeys = [1, 2, 6];
  const coinFamilyKeys = [1, 2, 3, 4, 5, 6, 7];

  Singleton.getInstance().defaultEthAddress = walletData.eth_address;
  Singleton.getInstance().defaultBnbAddress = walletData.eth_address;
  Singleton.getInstance().defaultMaticAddress = walletData.eth_address;
  Singleton.getInstance().defaultBtcAddress = walletData.btc_address;
  Singleton.getInstance().defaultSolAddress = walletData.sol_address;
  Singleton.getInstance().defaultTrxAddress = walletData.trx_address;
  Singleton.getInstance().defaultTicsAddress = walletData.eth_address;
  Singleton.getInstance().refCode = resp.data?.referral_code;

  const { ethObj, btcObj, tronObj, solObj, mnemonics } = walletData || {};
  console.log("ethObj ======", ethObj, mnemonics);
  if (ethObj) {
    await saveEncryptedData(ethObj.address + "_pk", ethObj.pvtKey, pin);
    await saveEncryptedData(ethObj.address, mnemonics, pin);
  }

  // if (Constants.network == "testnet") {
  //   BTC_obj = await getBTCAddress(mnemonics, 0);
  // }
  if (btcObj) {
    await saveEncryptedData(btcObj.address + "_pk", btcObj.pvtKey, pin);
    await saveEncryptedData(btcObj.address, mnemonics, pin);
  }
  if (tronObj) {
    await saveEncryptedData(tronObj.address + "_pk", tronObj.privateKey, pin);
    await saveEncryptedData(tronObj.address, mnemonics, pin);
  }
  if (solObj) {
    await saveEncryptedData(solObj.address, mnemonics, pin);
  }

  const login_data = {
    access_token: resp.data.token,
    defaultEthAddress: walletData.eth_address,
    defaultBtcAddress: walletData.btc_address,
    defaultTrxAddress: walletData.trx_address,
    defaultSolAddress: walletData.sol_address,
    defaultBnbAddress: walletData.eth_address,
    defaultMaticAddress: walletData.eth_address,
    defaultTicsAddress: walletData.eth_address,
    walletName: walletName || "Basic",
    userId: resp.data.userId,
    refCode: "",
    isTangem: isTangem,
    walletPublicKey: walletData?.walletPublicKey,
    card: walletData?.card,
    ethPublicKey: walletData?.ethPublicKey,
    btcPublicKey: walletData?.btcPublicKey,
    tronPublicKey: walletData?.tronPublicKey,
  };
  const Wallet_Array = [
    {
      walletName: walletName || "Basic",
      loginRequest: data,
      defaultWallet: true,
      user_jwtToken: resp.data?.token,
      user_refreshToken: resp.data?.token,
      addrsListKeys: addrsListKeys,
      coinFamilyKeys: coinFamilyKeys,
      login_data: login_data,
    },
  ];
  console.log("Wallet_Array---", Wallet_Array);

  // check wallet already exist
  if (walletAlreadyExist) {
    let MultiWalletArray = [];
    getData(Constants.MULTI_WALLET_LIST).then(async (multiWalletArray) => {
      MultiWalletArray = JSON.parse(multiWalletArray);
      MultiWalletArray?.map((item) => {
        item.defaultWallet = false;
      });
      MultiWalletArray?.push(Wallet_Array[0]);
      console.log("Multi Wallet_Array List---", MultiWalletArray);
      await saveDataInStorage(
        Constants.MULTI_WALLET_LIST,
        JSON.stringify(MultiWalletArray)
      );
    });
    saveData(Constants.FAVORITE, JSON.stringify([]));
  } else {
    await saveDataInStorage(
      Constants.MULTI_WALLET_LIST,
      JSON.stringify(Wallet_Array)
    );
    saveDataInStorage(Constants.SELECTED_CURRENCY, "USD");
    saveDataInStorage(Constants.SELECTED_LANGUAGE, "en");
    saveDataInStorage(Constants.SELECTED_SYMBOL, "$");
    Singleton.getInstance().CurrencySymbol = "$";
    Singleton.getInstance().CurrencySelected = "USD";
    Singleton.getInstance().SelectedLanguage = "en";
  }
  saveDataInStorage(Constants.USER_ID, resp.data.userId);
  await saveDataInStorage(Constants.ACCESS_TOKEN, resp.data.token);
  await saveDataInStorage(
    Constants.ACTIVE_ADDRESS_LIST,
    JSON.stringify(data.addressList)
  );
  await saveDataInStorage(
    Constants.ADDRESS_LIST,
    JSON.stringify(addrsListKeys)
  );
  await saveDataInStorage(
    Constants.COIN_FAMILY_LIST,
    JSON.stringify(coinFamilyKeys)
  );
  await saveDataInStorage(Constants.LOGIN_DATA, JSON.stringify(login_data));
  await saveDataInStorage(Constants.WALLET_NAME, walletName || "Basic");
  await saveDataInStorage(Constants.REFRESH_TOKEN, resp.data.refreshToken);
  Singleton.getInstance().walletName = walletName || "Basic";
  Singleton.isFirsLogin = true;
  Singleton.getInstance().isMakerWallet = false;
  if (onSuccess) {
    onSuccess?.();
  }
};


export const createPrivateKeyWalletLocal = async (inputData = {}) => {
  console.log("createUserWalletLocal inputData =======", inputData);
  const {
    resp,
    walletData,
    walletName,
    pin,
    isTangem,
    walletAlreadyExist,
    onSuccess,
  } = inputData;
  const { address, privateKey, chain } = walletData

  const data = {
    device_id: Singleton.getInstance().unique_id,
    wallet_address: address,
    device_token: (await getData(Constants.DEVICE_TOKEN)) || "abc",
    wallet_name: walletName || "Basic",
    referral_code: "",
    addressList: [
      { symbol: chain?.symbol?.toLowerCase(), address: address, coin_family: chain?.coin_family },
    ],
  }
  console.log("requestWalletApiData data =======", data);

  const addrsListKeys = [address];
  const coinFamilyKeys = [chain?.coin_family];
  let login_data = {
    access_token: resp.data.token,
    walletName: walletName || "Basic",
    userId: resp.data.userId,
    refCode: ""
  }

  Singleton.getInstance().refCode = resp.data?.referral_code;
  if (chain?.coin_family == 1) {//bsc
    Singleton.getInstance().defaultEthAddress = address
    Singleton.getInstance().defaultBnbAddress = address
    await saveEncryptedData(address + "_pk", privateKey, pin);
    login_data = { ...login_data, defaultBnbAddress: address, }
  } else if (chain?.coin_family == 2) {//eth
    Singleton.getInstance().defaultEthAddress = address
    await saveEncryptedData(address + "_pk", privateKey, pin);
    login_data = { ...login_data, defaultEthAddress: address, }

  } else if (chain?.coin_family == 3) {//btc
    Singleton.getInstance().defaultBtcAddress = address
    await saveEncryptedData(address + "_pk", privateKey, pin);
    login_data = { ...login_data, defaultBtcAddress: address, }

  } else { //trx
    Singleton.getInstance().defaultTrxAddress = address
    await saveEncryptedData(address + "_pk", privateKey, pin);
    login_data = { ...login_data, defaultTrxAddress: address, }

  }
  Singleton.getInstance().isMakerWallet = false;


  const Wallet_Array = [
    {
      walletName: walletName || "Basic",
      loginRequest: data,
      defaultWallet: true,
      user_jwtToken: resp.data?.token,
      user_refreshToken: resp.data?.token,
      addrsListKeys: addrsListKeys,
      coinFamilyKeys: coinFamilyKeys,
      login_data: login_data,
      isPrivateKey: true,
      coinFamily: chain?.coin_family,
      walletAddress: address
    },
  ];
  console.log("Wallet_Array---", Wallet_Array);

  // check wallet already exist
  if (walletAlreadyExist) {
    let MultiWalletArray = [];
    getData(Constants.MULTI_WALLET_LIST).then(async (multiWalletArray) => {
      MultiWalletArray = JSON.parse(multiWalletArray);
      MultiWalletArray?.map((item) => {
        item.defaultWallet = false;
      });
      MultiWalletArray?.push(Wallet_Array[0]);
      console.log("Multi Wallet_Array List---", MultiWalletArray);
      await saveDataInStorage(
        Constants.MULTI_WALLET_LIST,
        JSON.stringify(MultiWalletArray)
      );
    });
    saveData(Constants.FAVORITE, JSON.stringify([]));
  } else {
    await saveDataInStorage(
      Constants.MULTI_WALLET_LIST,
      JSON.stringify(Wallet_Array)
    );
    saveDataInStorage(Constants.SELECTED_CURRENCY, "USD");
    saveDataInStorage(Constants.SELECTED_LANGUAGE, "en");
    saveDataInStorage(Constants.SELECTED_SYMBOL, "$");
    Singleton.getInstance().CurrencySymbol = "$";
    Singleton.getInstance().CurrencySelected = "USD";
    Singleton.getInstance().SelectedLanguage = "en";
  }
  saveDataInStorage(Constants.USER_ID, resp.data.userId);
  await saveDataInStorage(Constants.ACCESS_TOKEN, resp.data.token);
  await saveDataInStorage(
    Constants.ACTIVE_ADDRESS_LIST,
    JSON.stringify(data.addressList)
  );
  await saveDataInStorage(
    Constants.ADDRESS_LIST,
    JSON.stringify(addrsListKeys)
  );
  await saveDataInStorage(
    Constants.COIN_FAMILY_LIST,
    JSON.stringify(coinFamilyKeys)
  );
  await saveDataInStorage(Constants.LOGIN_DATA, JSON.stringify(login_data));
  await saveDataInStorage(Constants.WALLET_NAME, walletName || "Basic");
  await saveDataInStorage(Constants.REFRESH_TOKEN, resp.data.refreshToken);
  Singleton.getInstance().walletName = walletName || "Basic";
  Singleton.isFirsLogin = true;

  if (onSuccess) {
    onSuccess?.();
  }
};

export const swapToFixed = (amount, fixed) => {
  if (!fixed) {
    if (amount < 1) {
      fixed = 8
    } else if (amount < 100) {
      fixed = 6
    } else if (amount < 1000) {
      fixed = 4
    } else {
      fixed = 2
    }
  }
  return toFixedExp(amount, fixed)?.toString()
}



export const tradingWebView = (coinData, theme, colorCode, graphData) => {
  return `
    <html>
    <body style="background-color:${colorCode}"/>
    <div class="tradingview-widget-container">
      <div id="tradingview_e7702"></div>
      <div class="tradingview-widget-copyright"><a href="https://in.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a></div>
      <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      <script type="text/javascript">
      new TradingView.widget(
      {
      "autosize": true,
      "symbol": "${graphData?.graph_source}:${graphData?.graph_pair}",
      "interval": "D",
      "theme": "${theme}",
      "style": "1",
      "locale": "in",
      "toolbar_bg": "${colorCode}",
      "enable_publishing": true,
      "withdateranges": true,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "range": "YTD",
  
    "container_id": "tradingview_96183"
    }
      );
      </script>
    </div>
  </html>`;


};


export function maskAddress(address, visibleChars = 4) {
  const start = address.slice(0, visibleChars + 2); // Include "0x" in the start
  const end = address.slice(-visibleChars);
  return `${start}...${end}`;
}

