/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  BackHandler,
  Platform,
  AppState,
  ImageBackground,
} from "react-native";
import {
  Header,
  InputCustom,
  Button,
  InputCustomWithPasteButton,
  AppAlert,
  ConfirmTxnModal,
  HeaderMain,
  AddressModal,
  QRCodeScannerNew,
} from "../../common";
import {
  requestgasprice,
  requestGasEstimation,
  requestNonce,
  requestSendCoin,
  addAddress,
  fetchNativePrice,
  fetchNative_CoinPrice,
} from "../../../Redux/Actions";
import {
  exponentialToDecimal,
  getData,
  getEncryptedData,
  toFixedExp,
} from "../../../Utils/MethodsUtils";
import {
  CreateEthTokenRaw,
  EthDataEncode,
  createEthRaw,
  getEthBal,
  getTotalGasFee,
} from "../../../Utils/EthUtils";
import styles from "./SendStyle";
import ReactNativeBiometrics from "react-native-biometrics";
import { Images, Colors, Fonts } from "../../../theme";
import { ActionConst, Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemeManager } from "../../../../ThemeManager";
import QRCodeScanner from "react-native-qrcode-scanner";
import { connect } from "react-redux";
import { LoaderView } from "../../common/LoaderView";
import * as Constants from "../../../Constants";
import Singleton from "../../../Singleton";
import EnterPinForTransaction from "../EnterPinForTransaction/EnterPinForTransaction";
import { EventRegister } from "react-native-event-listeners";
import { LanguageManager } from "../../../../LanguageManager";
import { SearchToken } from "../../common/SearchToken";
import ProgressBarClass from "../../common/ProgressBarClass";
import { heightDimen, widthDimen } from "../../../Utils";
import ContactsBook from "../ContactsBook/ContactsBook";
import { sendMakerTransData } from "../../../Utils/CheckerMarkerUtils";
import Clipboard from "@react-native-clipboard/clipboard";

class SendEth extends Component {
  constructor(props) {
    console.log(
      "Props::::::::",
      props.selectedCoin,
      JSON.stringify(props.themeSelected)
    );
    super(props);
    this.state = {
      disabled: false,
      newObj: "",
      showConfirmModal: false,
      nativePrice: 0,
      modalVisible: false,
      toAddress: "",
      selectedCoin: this.props.selectedCoin,
      isLoading: false,
      gasFeeMultiplier: 0.000000000000000001,
      selectedFeeType: 2,
      amount: "",
      nonce: -1,
      gasEstimate: 0,
      gasPrice: 0,
      totalFee: 0,
      isVisible: false,
      valueInUSD: 0,
      bioMetricMode: false,
      showAlertDialog: false,
      alertTxt: "",
      maxclicked: false,
      PinModal: false,
      showSaveContactModal: false,
      userName: "",
      showContact: true,
      errorMsg: "",
      showContactlModal: false,
      showAddressBookModal: false,
      selectedItem: '',
      selected_Index: undefined,
      isButtonDisabled: false,
      isReqSent: false,
      walletName: '',

    };
    this.isMakerWallet = Singleton.getInstance().isMakerWallet
  }

  /******************************************************************************************/
  componentDidMount() {
    console.log(
      "Props:::::::2222:",
      this.props.selectedCoin
    );
    getData(Constants.LOGIN_DATA).then((res) => {
      const result = JSON.parse(res);
      console.log("LOGIN_DATA ------");
      this.setState({
        makerUserId: result?.makerUserId,
      });
    });
    getData(Constants.WALLET_NAME).then(async (res) => {
      console.log('walletName res ------', res);
      this.setState({ walletName: res })
    });

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: "",
        showConfirmModal: false,
        isVisible: false,
        PinModal: false,
        disabled: false,
        showAddressBookModal: false

      });
    });
    this.fetchNativePrice();
    this.props.navigation.addListener("didFocus", async () => {
      console.log(
        "Props:::::::2222yrtyrty:",
        this.props.selectedCoin
      );
      // this.state.selectedCoin.is_token == 1 && this.fetchNativeCoinPrice();
      this.state.selectedCoin.is_token == 1
        ? this.getGasLimit()
        : this.getTotalFee();
    });
    AppState.addEventListener("change", (nextState) => {
      if (Platform.OS == "android")
        this.setState({
          isVisible: false,
          modalVisible: false,
          PinModal: false,
        });
      else this.setState({ isVisible: false, modalVisible: false });
    });
    getData(Constants.BIOMETRIC_MODE).then((bio_mode) => {
      if (bio_mode == "false") this.setState({ bioMetricMode: false });
      else this.setState({ bioMetricMode: true });
    });
    this.backhandle = BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    if (this.backhandle) this.backhandle.remove();
  }

  //******************************************************************************************/TODO: -
  onPressAddressBook() {
    this.setState({ showAddressBookModal: true })
  }

  /******************************************************************************************/
  fetchNativeCoinPrice() {
    let data = {
      fiat_currency: Singleton.getInstance().CurrencySelected,
      coin_family: 2,
      coin_symbol: this.state.selectedCoin.coin_symbol,
    };
    this.props
      .fetchNative_CoinPrice({ data })
      .then((res) => {
        res?.message?.toLowerCase() == "going fine"
          ? ""
          : this.setState({
            disabled: true,
            showAlertDialog: true,
            alertTxt: res?.message,
          });
        console.log("chk res fetchNative_CoinPrice price:::::", res);
      })
      .catch((err) => {
        console.log("chk err fetchNative_CoinPrice price:::::", err);
      });
  }

  /******************************************************************************************/
  fetchNativePrice() {
    let data = {
      fiat_currency: Singleton.getInstance().CurrencySelected,
      coin_family: 2,
    };
    this.props
      .fetchNativePrice({ data })
      .then((res) => {
        this.setState({
          nativePrice: toFixedExp(res?.fiatCoinPrice?.value, 2),
        });
        console.log("chk res native price:::::", res);
      })
      .catch((err) => {
        console.log("chk err native price:::::", err);
      });
  }

  /******************************************************************************************/
  getGasLimit() {
    const {
      coin_symbol,
      wallet_address,
      token_address,
      is_token,
    } = this.state.selectedCoin;
    let gasEstimationReq = {
      from: wallet_address,
      to: wallet_address,
      amount: "",
    };
    getData(Constants.ACCESS_TOKEN).then((token) => {
      this.props
        .requestGasEstimation({
          url: `ethereum/${is_token == 0 ? coin_symbol : token_address
            }/gas_estimation`,
          coinSymbol: coin_symbol,
          gasEstimationReq,
          token,
        })
        .then((res1) => {
          console.log("chk gasEstimate res:::::", res1);
          this.getTotalFee(res1.gas_estimate);
        })
        .catch((e) => {
          console.log("chk gasEstimate error:::::", e);

          this.setState({ isLoading: false });
          this.setState({ showAlertDialog: true, alertTxt: e });
        });
    });
  }

  /******************************************************************************************/
  getTotalFee = (gasLimit = 21000) => {
    try {


      this.setState({ isLoading: true });
      setTimeout(async () => {
        const Totalfee = await getTotalGasFee();
        const value = Totalfee
          ? exponentialToDecimal(
            Totalfee * this.state.gasFeeMultiplier * gasLimit
          )
          : 0;
        console.log(" value:::::", value);
        const fee =
          Constants.network == "testnet"
            ? parseFloat(value).toFixed(8)
            : parseFloat(value).toFixed(8);
        const bal = await getEthBal(Singleton.getInstance().defaultEthAddress);
        if (
          this.state.selectedCoin.is_token != 0 &&
          parseFloat(fee) > parseFloat(bal)
        ) {
          this.setState({
            disabled: true,
            showAlertDialog: true,
            alertTxt: LanguageManager.alertMessages.youhaveInsufficientEthBalance,
          });
        }
        this.setState({
          gasEstimate: gasLimit,
          gasPrice: Totalfee,
          totalFee: fee,
          isLoading: false,
        });
      }, 100);
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  /******************************************************************************************/
  checkBiometricAvailabilty() {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject;
      if (available && biometryType === ReactNativeBiometrics.TouchID) {
        console.log("TouchID is supported");
        this.bimetricPrompt();
      } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
        console.log("FaceID is supported");
        this.bimetricPrompt();
      } else if (
        available &&
        biometryType === ReactNativeBiometrics.Biometrics
      ) {
        console.log("Biometrics is supported");
        this.bimetricPrompt();
      } else {
        console.log("Biometrics not supported");
      }
    });
  }

  /******************************************************************************************/
  bimetricPrompt() {
    try {
      Singleton.getInstance().getTouchIDItem().then((res) => {
        this.onPinSuccess(res);
      }).catch((err) => {
      })
    } catch (e) {
      console.log('Device not Support Fingerprint');
    }
  }

  /******************************************************************************************/
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  /******************************************************************************************/
  requestCameraPermission() {
    Singleton.getInstance()
      .cameraPermission()
      .then((res) => {
        if (res == "granted") {
          Singleton.isCameraOpen = true;
          this.setState({ isVisible: true });
        }
      });
  }

  /******************************************************************************************/
  sendSerializedTxn(tx_raw, nonce) {
    const {
      toAddress,
      amount,
      gasEstimate,
      gasPrice,
      selectedCoin,
    } = this.state;
    let sendCoinReq = {
      nonce: nonce,
      tx_raw: tx_raw,
      from: Singleton.getInstance().defaultEthAddress,
      to: toAddress,
      amount: amount,
      gas_estimate: gasEstimate,
      gas_price: gasPrice,
      tx_type: "withdraw",
    };
    console.log("sendCoinReq::::", sendCoinReq);
    const { is_token, token_address, coin_symbol } = selectedCoin;
    this.props
      .requestSendCoin({
        url: `ethereum/${is_token == 0 ? selectedCoin.coin_symbol : token_address
          }/send`,
        coinSymbol: coin_symbol,
        sendCoinReq,
      })
      .then((res) => {
        // Actions.replace("TransactionHistory", {
        //   selectedCoin: this.state.selectedCoin,
        // });
        console.log('TransactionHistory------::::111:');
        Actions.TransactionHistory({ type: ActionConst.RESET, selectedCoin: this.state.selectedCoin });
        this.setState({ isLoading: false });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        this.setState({ showAlertDialog: true, alertTxt: e });
      });
  }

  /******************************************************************************************/
  sendTransaction() {
    const { alertMessages } = LanguageManager;
    const { toAddress, amount, selectedCoin } = this.state;
    console.log("chk bala:::::", selectedCoin.balance);
    if (toAddress.trim().length == 0)
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterWalletAddress,
      });
    else if (!/^(0x){1}[0-9a-fA-F]{40}$/i.test(toAddress))
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterValidAddress,
      });
    else if (
      toAddress.toLowerCase() ==
      Singleton.getInstance().defaultEthAddress.toLowerCase()
    )
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.youCannotSendToSameAddress,
      });
    else if (amount.trim().length == 0 || amount == 0)
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterAmount,
      });
    else if (isNaN(parseFloat(amount)))
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterValidAmount,
      });
    else if (!/^\d*\.?\d*$/.test(amount))
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.youCanEnterOnlyOneDecimal,
      });
    else if (
      parseFloat(amount) > parseFloat(toFixedExp(selectedCoin.balance, 8))
    )
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.youhaveInsufficientBalance,
      });
    else {
      const newObj = {
        valueInUSD: this.state.valueInUSD,
        amount: this.state.amount,
        totalFee: this.state.totalFee,
        nativePrice: this.state.nativePrice,
        toAddress: this.state.toAddress,
        fromAddress: Singleton.getInstance().defaultEthAddress,
        feeSymbol: "ETH",
        fiatAmount: toFixedExp(
          parseFloat(this.state.amount) *
          parseFloat(this.state.selectedCoin.currentPriceInMarket),
          2
        ),
        fiatCoin: toFixedExp(
          parseFloat(this.state.totalFee) * parseFloat(this.state.nativePrice),
          2
        ),
      };
      this.setState({ showConfirmModal: true, newObj: newObj });
    }
  }

  /******************************************************************************************/
  SendEth(pin) {
    this.setState({ isLoading: true });
    console.log(
      "sendMakerTransData SendEth SendEth ------",
      this.isMakerWallet
    );
    const { toAddress, amount } = this.state;
    setTimeout(async () => {
      const { toAddress, amount } = this.state;

      let privateKey = ""
      try {
        privateKey = await getEncryptedData(`${Singleton.getInstance().defaultEthAddress}_pk`, pin);
      } catch (error) {
        console.log("ERROR>>", error);
      }

      createEthRaw(
        Singleton.getInstance().defaultEthAddress,
        toAddress,
        privateKey,
        amount
      ).then((ethSignedRaw) => {
        console.log('-------------ethSignedRaw', ethSignedRaw)
        this.sendSerializedTxn(ethSignedRaw.txn_hash, ethSignedRaw.nonce);
      })
        .catch((err) => {
          console.log("chk signed raw err::::::::::::", err);
          this.setState({ isLoading: false });
        });
    }, 200);

  }

  /******************************************************************************************/
  SendERC20(pin) {
    this.setState({ isLoading: true });
    console.log(
      "sendMakerTransData SendEth SendERC20 ------",
      this.isMakerWallet
    );
    setTimeout(async () => {
      const { gasEstimate, toAddress, amount } = this.state;
      const { decimals, token_address } = this.state.selectedCoin;

      let privateKey = ""
      try {
        privateKey = await getEncryptedData(`${Singleton.getInstance().defaultEthAddress}_pk`, pin);
      } catch (error) {
        console.log("ERROR>>", error);
      }
      const BigNumber = require("bignumber.js");
      let a = new BigNumber(amount);
      let b = new BigNumber(decimals);
      const amountToSend = a.multipliedBy(b).toString();
      EthDataEncode(token_address, toAddress, amountToSend)
        .then((encodedData) => {
          CreateEthTokenRaw(
            Singleton.getInstance().defaultEthAddress,
            token_address,
            privateKey,
            gasEstimate,
            encodedData
          )
            .then((tokenRaw) => {
              this.sendSerializedTxn(tokenRaw.txn_hash, tokenRaw.nonce);
            })
            .catch((err) => {
              console.log("chk signed raw err::::::::::::", err);
              this.setState({ isLoading: false });
            });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
        });
    }, 200);

  }

  /******************************************************************************************/
  showActualAmount(enteredAmount) {
    const amt = exponentialToDecimal(
      enteredAmount * this.state.selectedCoin.currentPriceInMarket
    );
    this.setState({
      valueInUSD: isNaN(enteredAmount)
        ? 0
        : amt < 0.000001
          ? toFixedExp(amt, 8)
          : amt < 0.01
            ? toFixedExp(amt, 4)
            : toFixedExp(amt, 2),
    });
  }

  /******************************************************************************************/
  setToAmountMax() {
    if (this.state.selectedCoin.balance == 0)
      return this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.Youdonthaveenoughbalance,
      });
    let val;
    if (this.state.selectedCoin.is_token == 0) {
      val = (
        this.state.selectedCoin.balance -
        this.state.totalFee -
        0.0002
      ).toFixed(8);
      if (val.toString().includes("-")) {
        return this.setState({
          showAlertDialog: true,
          alertTxt:
            LanguageManager.alertMessages
              .YoudonthaveEnoughbalanceAmountTransactionFee,
        });
      }
      this.setState({ amount: (val * 1).toFixed(6).toString() });
      console.log("val", val);
      this.showActualAmount(val);
    } else {
      val = toFixedExp(this.state.selectedCoin.balance, 8);
      if (val.toString().includes("-")) {
        return this.setState({
          showAlertDialog: true,
          alertTxt:
            LanguageManager.alertMessages
              .YoudonthaveEnoughbalanceAmountTransactionFee,
        });
      }
      const decim =
        this.state.selectedCoin.decimals.toString().length - 1 > 18
          ? 8
          : this.state.selectedCoin.decimals.toString().length - 1;
      this.setState({ amount: toFixedExp(val * 1, decim).toString() });
      this.showActualAmount(val);
    }
  }

  /******************************************************************************************/
  onPinSuccess(pin) {
    this.setState({ PinModal: false });
    setTimeout(() => {
      this.state.selectedCoin.is_token == 0 ? this.SendEth(pin) : this.SendERC20(pin);
    }, 1000);
  }

  /******************************************************************************************/
  getAddress = (address) => {
    this.setState({ toAddress: address, showContact: false });
  };

  /******************************************************************************************/
  // onPressAddressBook() {
  //   Actions.currentScene != "ContactsBook" &&
  //     Actions.ContactsBook({
  //       getAddress: this.getAddress,
  //       ispop: true,
  //       address: Singleton.getInstance().defaultEthAddress,
  //       coin_family: 2,
  //     });
  // }

  /******************************************************************************************/
  onChangeAmount(val) {
    if (val.includes(",")) val = val.replace(",", ".");
    if (val == ".") val = "0.";
    const decim =
      this.state.selectedCoin.decimals.toString().length - 1 > 18
        ? 8
        : this.state.selectedCoin.decimals.toString().length - 1;
    const expression = new RegExp("^\\d*\\.?\\d{0," + decim + "}$");
    if (expression.test(val)) {
      if (/^\d*\.?\d*$/.test(val)) {
        if (val.includes(".") && val.split(".")[1].length > 18) {
          return;
        }
        this.setState({ amount: val, maxclicked: false });
        this.showActualAmount(val);
      }
    }
  }

  /******************************************************************************************/
  onPressConfirm() {
    // this.state.selectedCoin.is_token == 0 ? this.SendEth() : this.SendERC20();
    // return;
    this.setState({ PinModal: true });
    this.setState({ showConfirmModal: false });
    setTimeout(() => {
      if (this.state.bioMetricMode) this.checkBiometricAvailabilty();
    }, 2000);
  }

  // TODO: -
  onPressItem(item, index) {
    this.setState({ selected_Index: index });
    setTimeout(() => {
      this.setState({ showContactlModal: false });
      this.getAddress(item?.wallet_address);
      // Actions.currentScene == 'ContactsBook' && Actions.pop();
    }, 800);
  }

  /******************************************************************************************/
  onMaxClicked() {
    this.setState({ maxclicked: true });
    setTimeout(() => {
      this.setToAmountMax();
    }, 300);
  }

  /******************************************************************************************/
  getValue = (bal) => {
    if (bal > 0) {
      const NewBal =
        bal < 0.000001
          ? toFixedExp(bal, 8)
          : bal < 0.0001
            ? toFixedExp(bal, 6)
            : toFixedExp(bal, 4);
      return NewBal;
    } else return "0.0000";
  };

  onPressPaste = () => {
    Clipboard.getString().then((address) => {
      this.setState({
        toAddress: address,
      })
    })
  }
  /******************************************************************************************/
  render() {
    const {
      walletMain,
      sendTrx,
      merchantCard,
      placeholderAndLabels,
    } = LanguageManager;
    const { modalVisible } = this.state;
    console.log('this.isMakerWallet ------', this.isMakerWallet)
    if (this.state.isVisible)
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.Mainbg,
          }}
        >
          <Modal
            animationType={"slide"}
            transparent={true}
            visible={this.state.isVisible}
            onRequestClose={() => {
              console.log("Modal has been closed.");
            }}
          >
            <View style={[styles.modalView, { flex: 1 }]}>
              <View
                style={{ backgroundColor: ThemeManager.colors.mainBgNew, flex: 1, marginTop: -5 }}
              >
                <QRCodeScannerNew
                  cameraStyle={styles.cameraStyle}
                  onRead={(event) => {
                    const address = event.data;
                    let newAddress = ''
                    if (address.includes(':')) {
                      let address1 = address.split(':')
                      newAddress = address1[1];
                      if (newAddress.includes('?')) {
                        let address1 = newAddress.split('?')
                        newAddress = address1[0];
                      }
                    } else if (address.includes('?amount')) {
                      let address1 = address.split('?')
                      newAddress = address1[0];
                    }
                    else {
                      newAddress = address;

                    }
                    this.setState({ isVisible: false, toAddress: newAddress });
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isVisible: false });
                  }}
                >
                  <Text allowFontScaling={false} style={[styles.txtCancel, { color: ThemeManager.colors.blackWhiteText }]}>
                    {sendTrx.Cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <View style={{ flex: 1 }}>

          {/* <Header
          BackButtonText={
            walletMain.send +
            " " +
            this.state.selectedCoin.coin_symbol?.toUpperCase()
          }
        /> */}
          <HeaderMain
            BackButtonText={
              walletMain.send +
              " " +
              this.state.selectedCoin.coin_symbol?.toUpperCase()
            }
          />

          <KeyboardAwareScrollView keyboardShouldPersistTaps={"always"}>
            <View style={{ flex: 1 }}>
              <View style={styles.mainView}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.txtWallet,
                      { color: ThemeManager.colors.blackWhiteText, },
                    ]}
                  >
                    {merchantCard.walletAddress}
                  </Text>
                </View>
                <View style={{}}>
                  <View
                    style={[
                      styles.ViewStyle,
                      { borderColor: ThemeManager.colors.inputBorder, backgroundColor: "transparent", },
                    ]}
                  >
                    <InputCustomWithPasteButton
                      value={this.state.toAddress}
                      onChangeText={(val) => {
                        this.setState({
                          toAddress: val,
                          showContact: val.length > 10 ? true : false,
                        });
                      }}
                      customInputStyle={[
                        styles.ViewStyle1,
                        {
                          backgroundColor: "transparent",
                          color: ThemeManager.colors.blackWhiteText,
                        },
                      ]}
                      onPastePress={(val) => {
                        this.setState({ toAddress: val });
                      }}
                      placeHolder={'Wallet Address'}
                      placeholderTextColor={ThemeManager.colors.inputBorder}
                    />
                    <TouchableOpacity
                      style={{ position: "absolute", right: 80, top: 17, alignSelf: "center" }}
                      onPress={() => this.onPressPaste()}>
                      <Text style={[styles.txtWallet, { color: ThemeManager.colors.blackWhiteText, fontFamily: Fonts.dmBold }]}>
                        {sendTrx.paste}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={this.state.isButtonDisabled || Singleton.getInstance().isMakerWallet}
                      onPress={() => {
                        this.setState({ isButtonDisabled: true })
                        this.onPressAddressBook()
                        setTimeout(() => {
                          this.setState({ isButtonDisabled: false });
                        }, 2000);

                      }

                      }
                      // onPress={() => this.onPressAddressBook()}
                      style={{ position: "absolute", right: 50, top: 17, alignSelf: "center" }}
                    >
                      <Image source={ThemeManager.ImageIcons.addressBook} style={{ tintColor: ThemeManager.colors.blackWhiteText }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={this.state.isButtonDisabled}
                      onPress={() => {
                        this.setState({ isButtonDisabled: true })
                        this.requestCameraPermission()
                        setTimeout(() => {
                          this.setState({ isButtonDisabled: false });
                        }, 2000);
                      }
                      }
                      // onPress={() => this.requestCameraPermission()}
                      style={styles.scan}
                    >
                      <Image
                        style={{ tintColor: ThemeManager.colors.blackWhiteText }}
                        source={ThemeManager.ImageIcons.scan} />
                    </TouchableOpacity>
                  </View>
                  {/* ------------------------------------------------------------------- */}
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.txtWallet,
                      {
                        height: 40,
                        marginTop: 25,
                        color: ThemeManager.colors.blackWhiteText,
                      },
                    ]}
                  >
                    {sendTrx.enterAmount}
                  </Text>
                  <View
                    style={[
                      styles.ViewStyle2,
                      { borderColor: ThemeManager.colors.inputBorder, backgroundColor: "transparent" },
                    ]}
                  >
                    <InputCustom
                      value={this.state.amount}
                      onChangeText={(val) => {
                        this.onChangeAmount(val);
                      }}

                      placeholderColor={Colors.placeholderColor}
                      keyboardType="decimal-pad"
                      maxLength={15}
                      customInputStyle={[
                        styles.ViewStyle4,
                        { color: ThemeManager.colors.TextColor },
                      ]}
                      placeHolder={sendTrx.enterAmount}
                      placeholderTextColor={ThemeManager.colors.inputBorder}
                    />
                    <View style={styles.ViewStyle3}>
                      {/* {this.state.selectedCoin.coin_image ? (
                      <View style={[styles.ImgStyle, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                        <Image style={styles.ImgStyle} source={{ uri: this.state.selectedCoin.coin_image }} />
                      </View>
                    ) : (
                      <View style={[styles.ImgStyle, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                        <Text allowFontScaling={false} style={[styles.coinSymbolStyle, { color: ThemeManager.colors.Text, textTransform: 'capitalize', paddingLeft: 0 }]}>{this.state.selectedCoin.coin_symbol?.substring(0, 1)}</Text>
                      </View>
                    )} */}
                      {/* <Text
                      allowFontScaling={false}
                      style={[
                        styles.coinSymbolStyle,
                        { color: ThemeManager.colors.subTextColor },
                      ]}
                    >
                      {this.state.selectedCoin.coin_symbol.toUpperCase()}
                    </Text> */}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.onMaxClicked();
                      }}
                      style={styles.maxStyle}
                    >
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.maxText,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {sendTrx.max}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.ViewStyle5}>

                    <Text
                      numberOfLines={1}
                      allowFontScaling={false}
                      style={[
                        styles.fiatStyle,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      ≈ {Singleton.getInstance().CurrencySymbol}{this.state.valueInUSD}
                    </Text>

                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.TextStyle,
                        { color: ThemeManager.colors.grayTextColor },
                      ]}
                    >
                      {sendTrx.Balance}{" "}
                      <Text
                        style={[
                          styles.TextStyle,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {this.getValue(this.state.selectedCoin?.balance)}{" "}
                        {this.state.selectedCoin.coin_symbol.toUpperCase()}
                      </Text>
                    </Text>
                  </View>
                  {/* ------------------------------------------------------------------- */}
                  <View style={styles.coinInfo}>
                    <View style={styles.ViewStyle6}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.TextStyle1,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {sendTrx.transactionFee}
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.TextStyle1,
                            { color: ThemeManager.colors.blackWhiteText },
                          ]}
                        >
                          {" "}
                          (ETH)
                        </Text>
                      </Text>
                      <InputCustom
                        editable={false}
                        value={this.state.totalFee?.toString()}
                        placeHolder="0.00"
                        placeholderColor={Colors.placeholderColor}
                        keyboardType="decimal-pad"
                        customInputStyle={[
                          styles.ViewStyle7,
                          { color: ThemeManager.colors.TextColor, backgroundColor: "transparent", },
                        ]}
                        placeholderTextColor={ThemeManager.colors.TextColor}
                      />
                      {/* <ProgressBarClass /> */}
                    </View>
                  </View>
                  {/* ------------------------------------------------------------------- */}
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.ViewStyle8}>
            {this.state.disabled ? (
              <View
                style={[
                  styles.sendBtnStyle,
                  { backgroundColor: ThemeManager.colors.settingBg },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[styles.sendBtnTextStyle, { color: "gray" }]}
                >
                  {sendTrx.SEND}
                </Text>
              </View>
            ) : (
              <Button
                disabled={this.state.disabled}
                onPress={() => {
                  this.sendTransaction();
                }}
                myStyle={{ marginBottom: heightDimen(50) }}
                buttontext={sendTrx.SEND}
              />
            )}
          </View>



          <ContactsBook
            handleBack={() => this.setState({ showAddressBookModal: false })}
            showAddressBookModal={this.state.showAddressBookModal}
            newObj={this.state.newObj}
            getAddress={this.getAddress}
            address={Singleton.getInstance().defaultEthAddress}
            coin_family={2}
            selectedCoin={this.state.selectedCoin}
            onPress={() => this.onPressConfirm()}
            onPressView={(item) => {
              this.setState({ showAddressBookModal: false, showContactlModal: true, selectedItem: item });
              console.log('here==', item);
            }}
            addbook={() => {
              this.setState({ showAddressBookModal: false })
              Actions.currentScene != 'AddContact' && Actions.AddContact({ themeSelected: this.props.themeSelected, });
            }}
            navigation={this.props.navigation}
          />
          <AddressModal
            selected_Index={this.state.selected_Index}
            onPressItem={(item, index) => this.onPressItem(item, index)}
            dismiss={() => this.setState({ showContactlModal: false })}
            item={this.state.selectedItem}
            openModel={this.state.showContactlModal}
          />


          {/* --------------------------------ConfirmTxnModal----------------------------------- */}
          <ConfirmTxnModal
            handleBack={() => this.setState({ showConfirmModal: false })}
            showConfirmTxnModal={this.state.showConfirmModal}
            newObj={this.state.newObj}
            selectedCoin={this.state.selectedCoin}
            onPress={() => this.onPressConfirm()}
          />



          {/* --------------------------------Modal for Pin----------------------------------- */}
          <Modal
            statusBarTranslucent
            animationType="slide"
            transparent={true}
            visible={this.state.PinModal}
            onRequestClose={() => {
              this.setState({ PinModal: false });
            }}
          >
            <View style={{ flex: 1 }}>
              <EnterPinForTransaction
                onBackClick={() => {
                  this.setState({ PinModal: false });
                }}
                closeEnterPin={(res) => {
                  this.onPinSuccess(res);
                }}
              />
            </View>
          </Modal>


          {this.state.showAlertDialog && (
            <AppAlert
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => {
                this.setState({ showAlertDialog: false });
                if (this.state.isReqSent) {
                  Actions.TransactionHistory({
                    type: ActionConst.RESET,
                    selectedCoin: this.state.selectedCoin,
                  });
                }
              }}
            />
          )}
          <LoaderView isLoading={this.state.isLoading} />
        </View>
      </ImageBackground>
    );
  }
}

export default connect(null, {
  requestgasprice,
  requestGasEstimation,
  requestNonce,
  requestSendCoin,
  addAddress,
  fetchNativePrice,
  fetchNative_CoinPrice,
})(SendEth);
