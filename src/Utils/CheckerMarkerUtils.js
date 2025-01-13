import { Actions } from "react-native-router-flux";
import * as Constants from "../Constants";
import {
  getMakerAuthTokens,
  getMakerReqStatuses,
  requestCoinList,
  sendMakerApprovalRequest,
  sendMakerTransaction,
  updateMakerDetails,
} from "../Redux/Actions";
import { store } from "../Redux/Reducers";
import Singleton from "../Singleton";
import { getCoinSymbol, updateLocalStates } from "../Utils";
import {
  getData,
  removeStorageItem,
  saveData,
  toFixedExp,
} from "./MethodsUtils";
import { EventRegister } from "react-native-event-listeners";

let allActionReceivedIds = [];

export const onMakerAccountApproved = async (response) => {
  const { result } = response;
  const deviceId = Singleton.getInstance().unique_id;
  const deviceToken = await getData(Constants.DEVICE_TOKEN);

  const res = result.data;
  const name = res?.walletName;
  const address = res?.walletAddress;

  const data = {
    device_id: deviceId,
    wallet_address: res.walletAddress, // response
    device_token: deviceToken || "abc",
    wallet_name: name,
    referral_code: "",
    // login_type: 'fvg',
    // social_id: '342423',
    // email: 'ok@gmail.com',
    addressList: [
      {
        symbol: getCoinSymbol(res.coinFamily),
        address: res.walletAddress,
        coin_family: res.coinFamily,
      },
    ],
  };
  console.log("data ------", data);
  const addrsListKeys = [res.walletAddress];
  const coinFamilyKeys = [res.coinFamily];

  console.log("addrsListKeys ------", addrsListKeys);
  console.log("coinFamilyKeys ------", coinFamilyKeys);
  let ethAddress = null;
  let bnbAddress = null;
  let btcAddress = null;
  let tronAddress = null;

  switch (res?.coinFamily) {
    case 1:
      bnbAddress = res.walletAddress;
      break;
    case 2:
      ethAddress = res.walletAddress;
      break;
    case 3:
      btcAddress = res.walletAddress;
      break;
    case 6:
      tronAddress = res.walletAddress;
      break;
    default:
      break;
  }

  // TODO: UNCOMMENT THIS
  // Singleton.getInstance().defaultEthAddress = ethAddress; // response
  // Singleton.getInstance().defaultBnbAddress = bnbAddress; // response
  // Singleton.getInstance().defaultBtcAddress = btcAddress; // response
  // Singleton.getInstance().defaultTrxAddress = tronAddress; // response

  const login_data = {
    access_token: res.token, // response
    defaultEthAddress: ethAddress, // response
    defaultBtcAddress: btcAddress, // response
    defaultTrxAddress: tronAddress, // response
    defaultBnbAddress: bnbAddress, // response
    walletName: name,
    userId: res.userId, // response
    makerUserId: res?.makerUserId, // response
    refCode: "",
  };
  console.log("login_data ------", login_data);
  const Wallet_Array = {
    walletName: name,
    loginRequest: data,
    defaultWallet: false,
    user_jwtToken: res?.token, // response
    user_refreshToken: res?.refreshToken, // response
    addrsListKeys: addrsListKeys,
    coinFamilyKeys: coinFamilyKeys,
    login_data: login_data,
  };
  console.log("Wallet_Array ------", Wallet_Array);

  // check is logged in
  const access_token = await getData(Constants.ACCESS_TOKEN);
  const isLoggedIn = access_token && access_token != "null";
  // if not logged then make sure old value of multi wallet is not appended
  // instead it should overwrite with new value only
  // also remove the old maker status so that it is not appended and instead new value is overwritten
  if (!isLoggedIn) {
    const tempMakerStatues = await getData(Constants.MAKER_WALLET_STATUS);
    if (tempMakerStatues && tempMakerStatues != "null") {
      try {
        await removeStorageItem(Constants.MAKER_WALLET_STATUS);
      } catch (error) {
        console.log(
          "Constants.MAKER_WALLET_STATUS removeStorageItem error ----",
          error
        );
      }
    }
  }

  let MultiWalletArray = [];
  await getData(Constants.MULTI_WALLET_LIST).then((multiWalletArray) => {
    console.log(
      "multiWalletArray =======",
      multiWalletArray,
      typeof multiWalletArray
    );
    if (isLoggedIn) {
      MultiWalletArray =
        multiWalletArray && multiWalletArray != "null"
          ? JSON.parse(multiWalletArray)
          : [];
    }
    console.log("MultiWalletArray ==+++++=====", MultiWalletArray);
    MultiWalletArray?.push(Wallet_Array);
    console.log("Multi Wallet_Array List---", MultiWalletArray);
    addMakerWalletStatus({ res });
    //Singleton.getInstance().isMakerWallet
    // TODO: UNCOMMENT THIS
    saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(MultiWalletArray));
    if (isLoggedIn) {
      setTimeout(() => {
        EventRegister.emit("makerWalletCreated");
      }, 600);
    }
  });
};

export const removeMakerStates = async (selectedItem) => {
  console.log("removeMakerStates selectedItem -----", selectedItem);

  const allMakerStatuses = await getAllWalletMakerStatus();
  const updatedAllMakerStatuses = allMakerStatuses.filter(
    (val) => val.makerId != selectedItem.login_data.makerUserId
  );
  // set the updatedAllMakerStatuses
  saveData(
    Constants.MAKER_WALLET_STATUS,
    JSON.stringify(updatedAllMakerStatuses)
  );
  console.log("removeMakerStates allMakerStatuses -----", allMakerStatuses);
};

export const addMakerId = async (makerId) => {
  console.log("addMakerId makerId -------", makerId);
  const allMakerIds = await getAllMakerIds();
  console.log("addMakerId allMakerIds -------", allMakerIds);
  const temp = [...allMakerIds, makerId];
  console.log("addMakerId temp -------", temp);
  saveData(Constants.MAKER_USER_IDS, JSON.stringify(temp));
  console.log("MAKER_USER_IDS saved -------");
};

export const getAllMakerIds = async () => {
  const allMakerIds = await getData(Constants.MAKER_USER_IDS);
  console.log("getAllMakerIds allMakerIds -------", allMakerIds);
  const parsedIds = allMakerIds ? JSON.parse(allMakerIds) : [];
  console.log("addMakerId parsedIds -------", parsedIds);
  return parsedIds;
};

export const addMakerWalletStatus = async (data) => {
  const { res } = data;
  const makerWallet = {
    isMakerWallet: true,
    isOnlyBtcCoin: res.coinFamily == 3,
    isOnlyTrxCoin: res.coinFamily == 6,
    walletName: res?.walletName,
    makerId: res?.makerUserId,
  };
  console.log("addMakerWalletStatus makerWallet -------", makerWallet);
  const oldData = await getData(Constants.MAKER_WALLET_STATUS);
  const parsedData = oldData ? JSON.parse(oldData) : [];
  const temp = [...parsedData, makerWallet];
  console.log("addMakerWalletStatus temp -------", temp);
  saveData(Constants.MAKER_WALLET_STATUS, JSON.stringify(temp));
};

export const getAllWalletMakerStatus = async () => {
  const tempMakerStatuses = await getData(Constants.MAKER_WALLET_STATUS);
  console.log("tempMakerStatuses -----", tempMakerStatuses);
  const allMakerStatuses = tempMakerStatuses
    ? JSON.parse(tempMakerStatuses)
    : [];
  console.log("allMakerStatuses -----", allMakerStatuses);
  return allMakerStatuses;
};

export const getWalletMakerStatus = async (selectedItem) => {
  console.log("selectedItem -----", selectedItem);
  const tempMakerStatuses = await getData(Constants.MAKER_WALLET_STATUS);
  console.log("tempMakerStatuses -----", tempMakerStatuses);
  const allMakerStatuses = tempMakerStatuses
    ? JSON.parse(tempMakerStatuses)
    : [];
  console.log("allMakerStatuses -----", allMakerStatuses);
  const target = allMakerStatuses.find(
    (val) => val.makerId == selectedItem.login_data.makerUserId
  );
  return target;
};

export const getMakerIsBnb = async () => {
  const tempFamily = await getData(Constants.COIN_FAMILY_LIST);
  let tempJson = tempFamily;
  try {
    tempJson = tempJson ? JSON.parse(tempJson) : tempJson;
  } catch (error) {
    console.log("tempJson JSON parse error ");
  }
  if (tempJson && tempJson?.length == 1) {
    return tempJson[0] == 1;
  }
  return false;
};

export const getMakerWalletBtcOrTrx = async () => {
  const res = await getData(Constants.LOGIN_DATA);
  console.log('getMakerWalletBtcOrTrx res ------', res)
  let response = JSON.parse(res);
  console.log('getMakerWalletBtcOrTrx response ------', response)
  const makerStatus = await getWalletMakerStatus({
    login_data: response,
  });
  console.log('getMakerWalletBtcOrTrx makerStatus ------', makerStatus)
  return makerStatus?.isOnlyBtcCoin || makerStatus?.isOnlyTrxCoin;
};

export const getIsMakerFromStorage = async () => {
  const res = await getData(Constants.LOGIN_DATA);
  let response = JSON.parse(res);
  const makerStatus = await getWalletMakerStatus({
    login_data: response,
  });
  return makerStatus?.isMakerWallet;
};

export const onSwitchToMakerWallet = async (
  newArray,
  selectedItem,
  onSuccess
) => {
  const item = selectedItem;
  console.log("selectedItem:::::", item);
  let ethAddress = "";
  let btcAdress = "";
  let LtcAddress = "";
  let trxAddress = "";
  item.loginRequest.addressList.map((item, index) => {
    const symbol = item.symbol?.toLowerCase();
    symbol == "trx"
      ? (trxAddress = item.address)
      : symbol == "btc"
      ? (btcAdress = item.address)
      : symbol == "ltc"
      ? (LtcAddress = item.address)
      : (ethAddress = item.address);
  });
  Singleton.getInstance().defaultEthAddress = ethAddress;
  Singleton.getInstance().defaultBnbAddress = ethAddress;
  Singleton.getInstance().defaultMaticAddress = ethAddress;
  Singleton.getInstance().defaultBtcAddress = btcAdress;
  Singleton.getInstance().defaultTrxAddress = trxAddress;
  Singleton.getInstance().defaultLtcAddress = LtcAddress;
  Singleton.getInstance().defaultEmail = item.login_data?.userEmail;
  Singleton.getInstance().refCode = item.login_data?.refCode;
  saveData(Constants.USER_ID, item.login_data.userId);
  saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(newArray));

  let tempJwtToken = item?.user_jwtToken;
  let tempRefreshToken = item?.user_refreshToken;

  console.log(
    "tempRefreshToken =======",
    !tempJwtToken,
    tempJwtToken == "null"
  );
  if (!tempJwtToken || tempJwtToken == "null") {
    const allMakerUserIds = [];
    newArray.forEach((val) => {
      if (val.login_data?.makerUserId) {
        allMakerUserIds.push(val.login_data.makerUserId);
      }
    });
    const apiTokenData = {
      userId: item.login_data.userId,
      deviceToken: item.loginRequest.device_token,
      makerUserIds: allMakerUserIds,
    };
    console.log("apiTokenData ------", apiTokenData);
    const tokenRes = await getMakerAuthTokens(apiTokenData);
    console.log("tokenRes ------", tokenRes);
    tempJwtToken = tokenRes.data.token;
    tempRefreshToken = tokenRes.data.refreshToken;
  }
  saveData(Constants.ACCESS_TOKEN, tempJwtToken);
  saveData(Constants.REFRESH_TOKEN, tempRefreshToken);
  saveData(
    Constants.ACTIVE_ADDRESS_LIST,
    JSON.stringify(item.loginRequest.addressList)
  );

  const makerStatus = await getWalletMakerStatus(item);
  console.log("makerStatus 333333-------", makerStatus);
  if (makerStatus) {
    Singleton.getInstance().isMakerWallet = makerStatus.isMakerWallet;
    Singleton.getInstance().isOnlyBtcCoin = makerStatus.isOnlyBtcCoin;
    Singleton.getInstance().isOnlyTrxCoin = makerStatus.isOnlyTrxCoin;
  } else {
    Singleton.getInstance().isMakerWallet = false;
    Singleton.getInstance().isOnlyBtcCoin = false;
    Singleton.getInstance().isOnlyTrxCoin = false;
  }
  EventRegister.emit("isMakerWallet", true);
  EventRegister.emit(
    "makerWalletChange",
    makerStatus?.isOnlyBtcCoin || makerStatus?.isOnlyTrxCoin
  );

  console.log("CoinsList==1===", item.coinFamilyKeys);
  saveData(Constants.ADDRESS_LIST, JSON.stringify(item.addrsListKeys));
  saveData(Constants.COIN_FAMILY_LIST, JSON.stringify(item.coinFamilyKeys));
  saveData(Constants.LOGIN_DATA, JSON.stringify(item.login_data));
  saveData(Constants.WALLET_NAME, item.walletName);
  saveData(Constants.FAVORITE, JSON.stringify([]));
  Singleton.getInstance().walletName = item.walletName;
  Singleton.isFirsLogin = true;
  setTimeout(() => {
    store.dispatch(requestCoinList({}));
    onSuccess?.();
  }, 150);
};

// this will remove the maker ids on which action is already taken and the same has been handled locally
export const removeMakerIdWithStatus = async () => {
  const allMakerIds = await getAllMakerIds();
  console.log("allMakerIds --------", allMakerIds);
  console.log("allActionReceivedIds --------", allActionReceivedIds);
  const updatedAllMakerIds = allMakerIds.filter(
    (ele) => !allActionReceivedIds.includes(ele)
  );
  console.log("updatedAllMakerIds --------", updatedAllMakerIds);
  // remove maker user ids that were approved
  saveData(Constants.MAKER_USER_IDS, JSON.stringify(updatedAllMakerIds));
};

export const checkMakerReqStatus = async (isFromBackground = false) => {
  // const {isFromBackground = false, isFirstLaunch = false} = data;
  try {
    const allMakerIds = await getAllMakerIds();
    console.log("allMakerIds --------", allMakerIds);
    if (allMakerIds.length == 0) {
      console.log("allMakerIds is empty");
      return;
    }
    const res = await getMakerReqStatuses({
      makerUserIds: allMakerIds,
      // status: 1,
    });
    let anyApprovedReq = false;
    let anyDeclinedReq = false;
    allActionReceivedIds = [];
    const approvedRes = res.data.filter((val) => {
      if (val.status == 1) {
        allActionReceivedIds.push(val.id);
        anyApprovedReq = true;
      }
      return val.status == 1;
    });
    const declinedRes = res.data.filter((val) => {
      if (val.status == 2) {
        allActionReceivedIds.push(val.id);
        anyDeclinedReq = true;
      }
      return val.status == 2;
    });
    console.log("anyApprovedReq --------", anyApprovedReq);
    console.log("checkMakerReqStatus res ---------", res);

    if (!approvedRes && !declinedRes) {
      return;
    }

    const data = {
      approvedRes,
      anyApprovedReq,
      isFromBackground,
      anyDeclinedReq,
    };
    console.log("checkMakerReqStatus data ======", data)

    // show declined popup
    // OR
    // show approved popup
    const pinLock = await getData(Constants.PIN_LOCK);
    const isLoggedIn = pinLock && pinLock != "null";
    console.log("checkMakerReqStatus isLoggedIn --------", isLoggedIn);
    // this is handled the case of pin screen that comes when we move the app in background

    if (!isLoggedIn) {
      if (anyApprovedReq) {
        showMakerAccSuccess({
          showDeclinedOnClose: anyDeclinedReq,
          makerData: data,
        });
      } else {
        await removeMakerIdWithStatus();
        showMakerAccRejected();
      }
    } else {
      // when user is logged in
      // both bg and fg states are handled inside
      startMakerWalletCreation(data);
    }
  } catch (error) {
    console.log("checkMakerReqStatus err-------", error);
  }
};

export const startMakerWalletCreation = async (data) => {
  const {
    approvedRes,
    anyApprovedReq,
    isFromBackground,
    anyDeclinedReq,
    onSuccess
  } = data;
  try {
    const allApprovedPromises = approvedRes.map(async (val) => {
      const result = {
        walletName: val.wallet_name,
        walletAddress: val.wallet_address,
        coinFamily: val.coin_family,
        makerUserId: val.id,
        token: null, // val.token
        refreshToken: null, // val.refreshToken
        userId: val.user_id,
      };
      return onMakerAccountApproved({ result: { data: result } });
    });
    const promiseRes = await Promise.all(allApprovedPromises);
    console.log("allApprovedPromises successfully completed");

    await removeMakerIdWithStatus();
    const access_token = await getData(Constants.ACCESS_TOKEN);
    const pinLock = await getData(Constants.PIN_LOCK);
    // const isLoggedIn = access_token && access_token != 'null';
    const isLoggedIn = pinLock && pinLock != "null";
    console.log("isLoggedIn --------", isLoggedIn);
    if (!isLoggedIn && anyApprovedReq) {
      // it means user is not logged in
      // make a wallet default - onSwitchToMakerWallet
      let multiWalletArray = await getData(Constants.MULTI_WALLET_LIST);
      multiWalletArray = multiWalletArray ? JSON.parse(multiWalletArray) : [];
      onSwitchToMakerWallet(multiWalletArray, multiWalletArray[0]);

      saveData(Constants.SELECTED_CURRENCY, "USD");
      saveData(Constants.SELECTED_LANGUAGE, "en");
      saveData(Constants.SELECTED_SYMBOL, "$");
      saveData(Constants.DARK_MODE_STATUS, "1");
      // move the user to create passcode flow
      Singleton.isFirsLogin = true;
      let timeout = 0;
      if (onSuccess) {
        timeout = 600;
        onSuccess();
      }
      setTimeout(() => {
        Actions.currentScene != "CreatePin" &&
          Actions.CreatePin({ title: "Create", subtitle: "create" });
      }, timeout);
    } else {
    }

    if (isLoggedIn) {
      if (isFromBackground) {
        if (anyApprovedReq) {
          saveData(
            Constants.SHOW_MAKER_REQ_STATUS,
            JSON.stringify({ anyApprovedReq: anyApprovedReq })
          );
        }
        if (anyDeclinedReq) {
          saveData(
            Constants.SHOW_MAKER_REQ_DECLINED,
            JSON.stringify({ anyDeclinedReq: anyDeclinedReq })
          );
        }
      } else {
        if (anyApprovedReq) {
          showMakerAccSuccess({ showDeclinedOnClose: anyDeclinedReq });
        } else {
          showMakerAccRejected();
        }
      }
    }

    // // this is handled the case of pin screen that comes when we move the app in background
    // if (isFromBackground || !isLoggedIn) {
    //   if (anyApprovedReq) {
    //     saveData(
    //       Constants.SHOW_MAKER_REQ_STATUS,
    //       JSON.stringify({ anyApprovedReq: anyApprovedReq })
    //     );
    //   }
    //   if (anyDeclinedReq) {
    //     saveData(
    //       Constants.SHOW_MAKER_REQ_DECLINED,
    //       JSON.stringify({ anyDeclinedReq: anyDeclinedReq })
    //     );
    //   }
    // } else {
    //   if (anyApprovedReq) {
    //     showMakerAccSuccess({showDeclinedOnClose: anyDeclinedReq});
    //   } else {
    //     showMakerAccRejected();
    //   }
    // }
  } catch (error) {
    console.log("startMakerWalletCreation error -------", error);
  }
};

export const checkAndShowStatusPopup = async (isFirstWallet = false) => {
  let anyApprovedRes = await getData(Constants.SHOW_MAKER_REQ_STATUS);
  console.log("anyApprovedRes -----", anyApprovedRes);
  anyApprovedRes =
    anyApprovedRes && anyApprovedRes != "null"
      ? JSON.parse(anyApprovedRes)
      : [];
  console.log("anyApprovedRes222222 -----", anyApprovedRes);

  let anyDeclinedRes = await getData(Constants.SHOW_MAKER_REQ_DECLINED);
  console.log("anyDeclinedRes -----", anyDeclinedRes);
  anyDeclinedRes =
    anyDeclinedRes && anyDeclinedRes != "null"
      ? JSON.parse(anyDeclinedRes)
      : [];
  console.log("anyDeclinedRes222222 -----", anyDeclinedRes);

  if (anyApprovedRes?.anyApprovedReq) {
    setTimeout(async () => {
      showMakerAccSuccess({
        showDeclinedOnClose: anyDeclinedRes?.anyDeclinedReq,
      });
      await removeStorageItem(Constants.SHOW_MAKER_REQ_STATUS);
      if (anyDeclinedRes?.anyDeclinedReq) {
        await removeStorageItem(Constants.SHOW_MAKER_REQ_DECLINED);
      }
    }, 500);
  }
};

export const showMakerAccSuccess = (data) => {
  const { showDeclinedOnClose, makerData } = data;
  if (Singleton.getInstance().makerReqStatusPopup) {
    Singleton.getInstance().makerReqStatusPopup?.show({
      status: 1,
      alsoShowDeclined: showDeclinedOnClose,
      makerData,
    });
  }
};

export const showMakerAccRejected = () => {
  if (Singleton.getInstance().makerReqStatusPopup) {
    Singleton.getInstance().makerReqStatusPopup?.show({
      status: 2,
    });
  }
};

export const sendMakerTransData = async (data) => {
  const {
    amount,
    selectedCoin,
    makerUserId,
    fromAddress,
    toAddress,
    walletName,
    selectedFeeType,
    // totalFee,
    // nativePrice,
    // valueInUSD,
  } = data;
  // const fiatAmount = toFixedExp(
  //   parseFloat(amount) * parseFloat(selectedCoin.currentPriceInMarket),
  //   3
  // );
  // const fiatCoin = toFixedExp(
  //   parseFloat(totalFee) * parseFloat(nativePrice),
  //   3
  // );
  const apiData = {
    walletName,
    cryptoAmount: amount,
    // coinDetails: JSON.stringify(selectedCoin),
    coinId: selectedCoin.coin.coin_id,
    coinSymbol: selectedCoin.coin.coin_symbol,
    makerUserId,
    fromAddress,
    toAddress,
    trnxFee: selectedFeeType,
    // makerUserId: makerUserId,
    // coinId: selectedCoin.coin.coin_id,
    // coinSymbol: selectedCoin.coin.coin_symbol,
    // fromAddress,
    // toAddress: toAddress,
    // networkCryptoFee: totalFee, // transaction fee
    // networkFiatFee: toFixedExp(
    //   parseFloat(totalFee) * parseFloat(nativePrice),
    //   3
    // ),
    // cryptoAmount: amount,
    // // fiatAmount: fiatAmount,
    // fiatAmount: valueInUSD,
    // maxTotal: toFixedExp(parseFloat(fiatAmount) + parseFloat(fiatCoin), 3), // fee + amount in fiat
    // // fiatCurrency: Singleton.getInstance().CurrencySymbol, // symbol
    // fiatCurrency: Singleton.getInstance().CurrencySelected,
  };
  console.log("sendMakerTransData data ------", apiData);
  const res = await sendMakerTransaction(apiData);
  return res;
};

export const sendMakerSwapData = async (data) => {
  const {
    tokenOneAmount,
    gaslessToggle,
    tokenOne,
    tokenSecond,
    savedSlippage,
    walletName,
    makerUserId,
  } = data;
  const apiData = {
    tokenOneAmount,
    gaslessToggle,
    tokenOne,
    tokenSecond,
    savedSlippage,
    type: "Swap",

    walletName,
    makerUserId,
    cryptoAmount: "",
    coinId: tokenOne?.coin_id,
    coinSymbol: "",
    fromAddress: "",
    toAddress: "",
    trnxFee: 0,
  };
  console.log("sendMakerTransData data ------", apiData);
  const res = await sendMakerTransaction(apiData);
  return res;
};
export const sendMakerSwapApproval = async (data) => {
  const {
    tokenOneAmount,
    gaslessToggle,
    tokenOne,
    tokenSecond,
    savedSlippage,
    walletName,
    makerUserId,
  } = data;
  const apiData = {
    tokenOneAmount,
    gaslessToggle,
    tokenOne,
    tokenSecond,
    savedSlippage,
    type: "Approval",

    walletName,
    makerUserId,
    cryptoAmount: "",
    coinId: tokenOne?.coin_id,
    coinSymbol: "",
    fromAddress: "",
    toAddress: "",
    trnxFee: 0,
  };
  console.log("sendMakerTransData data ------", apiData);
  const res = await sendMakerApprovalRequest(apiData);
  return res;
};

export const onMakerDetailsChanged = async (data) => {
  const loginData = await getData(Constants.LOGIN_DATA);
  const result = loginData ? JSON.parse(loginData) : loginData;
  console.log("onMakerDetailsChanged LOGIN_DATA ------", result);
  const makerUserId = result?.makerUserId;
  console.log("onMakerDetailsChanged makerUserId ------", makerUserId);
  if (!makerUserId) {
    return;
  }

  const payload = {
    makerUserId: makerUserId,
    ...data,
  };
  console.log("onMakerDetailsChanged payload ------", payload);
  const res = await updateMakerDetails(payload);
  console.log("onMakerDetailsChanged res ------", res);
};