import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeManager } from "../../../../ThemeManager";
import {
  AppAlert,
  Button,
  HeaderMain,
  InputCustom,
  LoaderView,
} from "../../common";
import { LanguageManager } from "../../../../LanguageManager";
import { InputCustomWithQrButton } from "../../common/InputCustomWithQrButton";
import Singleton from "../../../Singleton";
import Clipboard from "@react-native-clipboard/clipboard";
import { styles } from "./styles";
import { validateTRXAddress } from "../../../Utils/TronUtils";
import {
  dimen,
  getCoinSymbol,
  getDimensionPercentage,
  heightDimen,
} from "../../../Utils";
import { address } from "bitcoinjs-lib";
import { Colors } from "../../../theme";
import { ActionConst, Actions } from "react-native-router-flux";
import { createMakerAccount } from "../../../Redux/Actions/RegisterAction";
import {
  getData,
  removeStorageItem,
  saveData,
} from "../../../Utils/MethodsUtils";
import * as Constants from "../../../Constants";
import {
  addMakerId,
  onMakerAccountApproved,
} from "../../../Utils/CheckerMarkerUtils";
import { EventRegister } from "react-native-event-listeners";
import QRCodeScanner from "react-native-qrcode-scanner";
import { validateBTCAddress } from "../../../Utils/BtcUtils";

const CreateMakerAccount = (props) => {
  console.log(props?.selectedChain, "propsprops");

  const screenParams = props;
  const isFromManageWallet = screenParams?.isFromManageWallet;
  const selectedCoin = props?.selectedChain;
  const selectCoinFamily = props?.selectedChain?.coin_family;

  const { makerchecker, placeholderAndLabels, addressBook } = LanguageManager;
  const [isVisible, setIsVisible] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertText, setAlertText] = useState("false");
  const [isReqSent, setIsReqSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [multiwallet, setmultiwallet] = useState([]);
  const [state, updateState] = useState({
    address: "",
    code: "",
    name: "",
  });

  const setState = (obj) => {
    updateState((prev) => ({ ...prev, ...obj }));
  };

  useEffect(() => {
    // check if user is not logged in
    getData(Constants.PIN_LOCK).then((pinLock) => {
      // const isLoggedIn = access_token && access_token != 'null';
      const isLoggedIn = pinLock && pinLock != "null";
      console.log("CreateMakerAccount isLoggedIn --------", isLoggedIn);
      // then delete the multi wallet data
      if (!isLoggedIn) {
        removeStorageItem(Constants.MULTI_WALLET_LIST);
        setmultiwallet([]);
      }
    });

    getData(Constants.MULTI_WALLET_LIST).then((multiWalletArray) => {
      setmultiwallet(JSON.parse(multiWalletArray));
    });
  }, []);

  useEffect(() => {
    EventRegister.addEventListener(Constants.DOWN_MODAL, onEventModalDown);

    return () => {
      EventRegister.removeEventListener(Constants.DOWN_MODAL, onEventModalDown);
    };
  }, []);

  const onEventModalDown = () => {
    setShowAlertDialog(false);
    setAlertText("");
    setIsVisible(false);
  };

  // ---------------------------------------------------------------------------------
  const requestCameraPermission = () => {
    Singleton.getInstance()
      .cameraPermission()
      .then((res) => {
        if (res == "granted") {
          Singleton.isCameraOpen = true;
          setIsVisible(true);
        }
      });
  };

  const searchToken = (address) => {
    setState({ address: address });
  };
  // --------------------------------------------------------------------------------
  const validateContractAddress = (address) => {
    const { alertMessages } = LanguageManager;
    console.log("javsdhasvd -----", selectedCoin);
    if (
      selectCoinFamily != 3 &&
      selectCoinFamily != 6 &&
      !/^(0x){1}[0-9a-fA-F]{40}$/i.test(address)
    ) {
      console.log("address>>>>>", address);
      setContractAddress("");
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.invalidWalletAddress);
      return;
    } else if (selectCoinFamily == 6 && !validateTRXAddress(address)) {
      setContractAddress("");
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.invalidWalletAddress);
      return;
    } else if (selectCoinFamily == 3 && !validateBTCAddress(address)) {
      setContractAddress("");
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.invalidWalletAddress);
      return;
    } else {
      setShowAlertDialog(false);
      searchToken(address);
    }
  };
  // --------------------------------------------------------------------------------
  const onPressPaste = async () => {
    const address = await Clipboard.getString();
    validateContractAddress(address);
  };

  const onSubmit = async () => {
    const { name, address, code } = state;
    if (address?.trim().length == 0) {
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.pleaseEnterWalletAddress);
      return;
    }
    if (
      !/^(0x){1}[0-9a-fA-F]{40}$/i.test(address) &&
      selectCoinFamily != 6 &&
      selectCoinFamily != 3 &&
      selectCoinFamily != 5
    ) {
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.pleaseEnterValidWalletAddress);
      return;
    }
    if (code?.trim().length == 0) {
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.enterCheckerCode);
      return;
    }
    if (name?.trim().length == 0) {
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.enterWalletName);
      return;
    }
    if (name?.length < 3) {
      setShowAlertDialog(true);
      setAlertText(LanguageManager.createWalletTexts.validName);
      return;
    }
    setIsLoading(true);

    let iswalletExist = false;
    // validate address from array ie: addressList (mnemonics)
    // validate address and coin family ie: addressList (private)
    const walletExists = await multiwallet?.some((item) => {
      console.log(item.isPrivateKey ,
        item?.coinFamily == selectCoinFamily ,
        item?.walletAddress?.toLowerCase() == address?.toLowerCase(),'yfuyafsdfa');
      
      if (
        item.isPrivateKey &&
        item?.coinFamily == selectCoinFamily &&
        item?.walletAddress?.toLowerCase() == address?.toLowerCase()
      ) {
        return true;
      } else {
        item?.addrsListKeys?.some(
          (ele) => ele?.toLowerCase() === address?.toLowerCase()
        );
      }
    });
    console.log("walletExists>>>>", walletExists);

    if (walletExists) {
      setIsLoading(false);
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.walletAlreadyExists);
      return;
    }
    multiwallet?.forEach((item) => {
      const tempAddressList = item?.loginRequest?.addressList;
      const tempRes = tempAddressList.some((val) => {
        return (
          val.address == address &&
          val.symbol.toLowerCase() == selectedCoin.name.toLowerCase()
        );
      });
      console.log("tempRes ------", tempRes);
      if (tempRes) {
        iswalletExist = tempRes;
      }
      return !iswalletExist;
    });

    console.log("iswalletExist ------", iswalletExist);
    if (iswalletExist) {
      setIsLoading(false);
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.walletAlreadyExists);
      return;
    }

    const iswalletNameExist = multiwallet?.find(
      (item) => item?.walletName.toLowerCase() == name?.toLowerCase()
    );
    if (iswalletNameExist) {
      setIsLoading(false);
      setShowAlertDialog(true);
      setAlertText(LanguageManager.alertMessages.walletNameAlreadyExists);
      return;
    }

    console.log("onSubmit validation passed!!!!!");
    // TODO: UNCOMMENT THIS
    // setIsLoading(false);

    try {
      const deviceToken = await getData(Constants.DEVICE_TOKEN);
      const deviceId = Singleton.getInstance().unique_id;
      const apiData = {
        walletName: name,
        deviceId,
        walletAddress: address,
        checkerCode: code,
        deviceToken, // fcm token
        coinFamily: selectCoinFamily,
        // isFirstWallet: isFromManageWallet ? 0 : 1,
      };

      console.log("apiData -----", apiData);
      const result = await createMakerAccount(apiData);
      console.log("createMakerAccount result------", JSON.stringify(result));
      addMakerId(result.data.makerUserId);
      // onMakerAccountApproved({ result });
      setIsReqSent(true);
      setShowAlertDialog(true);
      setAlertText("Your request has successfully been sent to Checker.");
    } catch (error) {
      console.log("onsubmit error   ------", error);
      setShowAlertDialog(true);
      setAlertText(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }]}>
      <HeaderMain BackButtonText={makerchecker.createMakerAccount} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: dimen(24),
        }}
      >
        <Text
          allowFontScaling={false}
          style={[
            styles.textStyle,
            { color: ThemeManager.colors.grayBlack, marginBottom: 5 },
            props.txtStyle,
          ]}
        >
          {LanguageManager.placeholderAndLabels.enterWalletAdd}
        </Text>
        <InputCustomWithQrButton
          isPaste={true}
          paste={placeholderAndLabels.paste}
          onPressPaste={onPressPaste}
          placeHolder={LanguageManager.sendTrx.walletAddress}
          showQrCode={requestCameraPermission}
          placeholderTextColor={ThemeManager.colors.inputPlace}
          value={state.address}
          onChangeText={(address) => {
            setShowAlertDialog(false);
            searchToken(address);
          }}
          customInputStyle={{
            backgroundColor: ThemeManager.colors.placeholderBg,
            borderWidth: 0,
          }}
          outsideView={{
            backgroundColor: ThemeManager.colors.placeholderBg,
            borderWidth: 0,
          }}
          customBtnsView={{ width: "28%" }}
        />
        <InputCustom
          label={LanguageManager.placeholderAndLabels.enterCheckCode}
          keyboardType="numeric"
          value={state.code}
          maxLength={6}
          placeholderTextColor={ThemeManager.colors.inputPlace}
          placeholderColor={Colors.placeholderColor}
          placeHolder={LanguageManager.placeholderAndLabels.enterCode}
          onChangeText={(text) => setState({ code: text })}
          txtStyle={{
            marginTop: dimen(24),
            color: ThemeManager.colors.grayBlack,
          }}
          customInputStyle={{
            backgroundColor: ThemeManager.colors.placeholderBg,
            borderRadius: 14,
          }}
        />
        <InputCustom
          label={LanguageManager.placeholderAndLabels.enterWalletName}
          value={state.name}
          placeholderTextColor={ThemeManager.colors.inputPlace}
          placeholderColor={Colors.placeholderColor}
          placeHolder={LanguageManager.placeholderAndLabels.enterWalletName}
          onChangeText={(text) => setState({ name: text })}
          txtStyle={{
            marginTop: dimen(24),
            color: ThemeManager.colors.grayBlack,
          }}
          customInputStyle={{
            backgroundColor: ThemeManager.colors.placeholderBg,
            borderRadius: 14,
          }}
        />
      </View>
      <View
        style={{
          marginHorizontal: dimen(24),
        }}
      >
        <Button
          myStyle={{
            marginBottom: heightDimen(50),
            marginTop: heightDimen(10),
          }}
          onPress={onSubmit}
          buttontext={LanguageManager.merchantCard.submit}
        />
      </View>
      <LoaderView isLoading={isLoading} />
      {showAlertDialog ? (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => {
            setShowAlertDialog(false);
            if (isReqSent) {
              if (isFromManageWallet) {
                Singleton.bottomBar?.navigateTab("WalletMain");
                Actions.jump("WalletMain");
              } else {
                Actions.Onboarding({ type: ActionConst.RESET });
              }
            }
          }}
        />
      ) : null}
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          console.log("Modal has been closed.");
        }}
      >
        <View style={[styles.modalView, { flex: 1 }]}>
          <View
            style={{
              backgroundColor: ThemeManager.colors.mainBgNew,
              flex: 1,
              marginTop: -5,
            }}
          >
            <QRCodeScanner
              cameraStyle={styles.cameraStyle}
              onRead={(event) => {
                setIsVisible(false);
                validateContractAddress(event.data);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.cancelText,
                  {
                    color: ThemeManager.colors.blackWhiteText,
                    marginRight:
                      Platform.OS == "ios"
                        ? getDimensionPercentage(30)
                        : getDimensionPercentage(15),
                  },
                ]}
              >
                {LanguageManager.sendTrx.Cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateMakerAccount;
