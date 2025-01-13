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
import styles from "./SendBnbPolStyle";
import {
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
  exponentialToDecimal,
  getData,
  getEncryptedData,
  toFixedExp,
} from "../../../Utils/MethodsUtils";
import {
  requestgasprice,
  requestGasEstimation,
  requestNonce,
  requestSendCoin,
  addAddress,
  fetchNativePrice,
  fetchNative_CoinPrice,
} from "../../../Redux/Actions";
import ReactNativeBiometrics from "react-native-biometrics";
import { Fonts, Images, Colors } from "../../../theme";
import { ActionConst, Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemeManager } from "../../../../ThemeManager";
import QRCodeScanner from "react-native-qrcode-scanner";
import { connect } from "react-redux";
import { LoaderView } from "../../common/LoaderView";
import * as Constants from "../../../Constants";
import Singleton from "../../../Singleton";
import EnterPinForTransaction from "../EnterPinForTransaction/EnterPinForTransaction";
import {
  bnbDataEncode,
  getBnbBal,
  getBnbRaw,
  sendTokenBNB,
} from "../../../Utils/BscUtils";
import { EventRegister } from "react-native-event-listeners";
import { LanguageManager } from "../../../../LanguageManager";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../layouts/responsive";
import { heightDimen, widthDimen } from "../../../Utils";
import ContactsBook from "../ContactsBook/ContactsBook";
import LinearGradient from "react-native-linear-gradient";
import { getMaticBal, getMaticRaw } from "../../../Utils/MaticUtils";
import Clipboard from "@react-native-clipboard/clipboard";
import { getTicsBal } from "../../../Utils/TicsUtils";

class SendBnbPol extends Component {
  constructor(props) {
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
      gasEstimate: 21000,
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
      gasPriceForTxnSlow: 10 * 10 ** 9,
      gasPriceForTxnMedium: 10 * 10 ** 9,
      gasPriceForTxnHigh: 10 * 10 ** 9,
      showAddressBookModal: false,
      showContactlModal: false,
      selectedItem: '',
      selected_Index: undefined,
      isButtonDisabled: false,
      isReqSent: false,
      walletName: '',
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    console.log("this.props.selectedCoin", this.props.selectedCoin)

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
      this.generateFeesAndNonceBnb();
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

  /******************************************************************************************/
  fetchNativeCoinPrice() {
    let data = {
      fiat_currency: Singleton.getInstance().CurrencySelected,
      coin_family: this.state.selectedCoin.coin_family,
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
      coin_family: this.state.selectedCoin.coin_family,
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

  dynamicApiEndPoint() {
    return this.state.selectedCoin.coin_family == 1
      ? "binancesmartchain"
      : this.state.selectedCoin.coin_family == 7
        ? "qubetics"
        : "polygon";
  }

  dynamicFeesSymbol() {
    return this.state.selectedCoin.coin_family == 1
      ? "BNB"
      : this.state.selectedCoin.coin_family == 7
        ? "TICS"
        : "POL";
  }

  /******************************************************************************************/
  generateFeesAndNonceBnb() {
    this.setState({ isLoading: true });
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
    let nonceReq = { amount: "" };
    getData(Constants.ACCESS_TOKEN).then((token) => {
      this.props
        .requestGasEstimation({
          url: `${this.dynamicApiEndPoint()}/${is_token == 0 ? coin_symbol : token_address
            }/gas_estimation`,
          coinSymbol: coin_symbol,
          gasEstimationReq,
          token,
        })
        .then(async (res1) => {
          console.log("chk gasEstimate res111:::::", res1);
          if (res1.status) {
            try {

              let gasEstimate = res1?.gas_estimate
              if (this.state.selectedCoin.coin_family != 1) {
                gasEstimate = gasEstimate + 10000
              }
              if (res1?.resultList == undefined && res1?.gas_price != undefined) {
                console.log("res1>>>>>", 'HAS VLAUE');
                res1 = {
                  ...res1, resultList: {
                    safe_gas_price: res1.gas_price,
                    propose_gas_price: res1.gas_price,
                    fast_gas_price: res1.gas_price
                  }
                }
              }
              const slowGasPrice = parseFloat(res1.resultList?.safe_gas_price < 3 ? 3 : res1.resultList?.safe_gas_price) * 10 ** 9;
              const mediumGasPrice = parseFloat(res1.resultList?.propose_gas_price < 3 ? 3 : (res1.resultList?.propose_gas_price)) * 10 ** 9;
              console.log("mediumGasPrice>>>", res1, mediumGasPrice);

              const heightGasPrice = parseFloat(res1.resultList?.fast_gas_price < 3 ? 3 : res1.resultList?.fast_gas_price) * 10 ** 9;
              const feeIs = toFixedExp(mediumGasPrice * gasEstimate * this.state.gasFeeMultiplier, 8);
              const fee = toFixedExp(slowGasPrice * gasEstimate * this.state.gasFeeMultiplier, 8)
              let bal = 0
              if (this.state.selectedCoin.coin_family == 1) {
                bal = await getBnbBal(Singleton.getInstance().defaultBnbAddress);
              } else if (this.state.selectedCoin.coin_family == 7) {
                bal = await getTicsBal(Singleton.getInstance().defaultBnbAddress);
              } else {
                bal = await getMaticBal(Singleton.getInstance().defaultMaticAddress);
              }


              console.log(parseFloat(fee), 'chk bal res:::::', parseFloat(bal));
              if (is_token != 0 && (parseFloat(fee) > parseFloat(bal))) {
                this.setState({
                  disabled: true, showAlertDialog: true, alertTxt:
                    this.state.selectedCoin.coin_family == 1 ? LanguageManager.alertMessages.youhaveInsufficientBnbBalance
                      : LanguageManager.alertMessages.youhaveInsufficientMaticBalance
                })
              }

              console.log("URL>>", `${this.dynamicApiEndPoint()}/${is_token == 0 ? coin_symbol : token_address}/nonce`);

              //  ---------------------------------------------- nonce APi -------------------------------------------------------
              this.props.requestNonce({ url: `${this.dynamicApiEndPoint()}/${is_token == 0 ? coin_symbol : token_address}/nonce`, coinSymbol: coin_symbol, nonceReq, token }).then(res2 => {
                this.setState({
                  gasEstimate: gasEstimate,
                  gasPrice: mediumGasPrice,
                  isLoading: false,
                  nonce: res2.data.nonce,
                  gasPriceForTxnSlow: slowGasPrice,
                  gasPriceForTxnMedium: mediumGasPrice,
                  gasPriceForTxnHigh: heightGasPrice,
                  totalFee: toFixedExp(feeIs, 8),
                });
              }).catch(e => {
                this.setState({ isLoading: false });
              });
            } catch (error) {
              this.setState({ isLoading: false });

              console.log("error>>>>>", error);
            }
          } else {
            this.setState({ isLoading: false });
            return;
          }
        })
        .catch((e) => {
          this.setState({ isLoading: false });
        });
    });
  }

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
    global.openScanner = true
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
  sendSerializedTxn(tx_raw) {
    const {
      nonce,
      toAddress,
      amount,
      gasEstimate,
      gasPrice,
      selectedCoin,
    } = this.state;
    let sendCoinReq = {
      nonce: nonce,
      tx_raw: tx_raw,
      from: Singleton.getInstance().defaultBnbAddress,
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
        url: `${this.dynamicApiEndPoint()}/${is_token == 0 ? selectedCoin.coin_symbol : token_address
          }/send`,
        coinSymbol: coin_symbol,
        sendCoinReq,
      })
      .then((res) => {
        console.log('requestSendCoin-----TransactionHistory');
        // Actions.replace("TransactionHistory", {
        //   selectedCoin: this.state.selectedCoin,
        // });
        Actions.TransactionHistory({ type: ActionConst.RESET, selectedCoin: this.state.selectedCoin });
        this.setState({ isLoading: false });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        this.setState({ showAlertDialog: true, alertTxt: e });
      });
  }

  //******************************************************************************************/
  sendTransaction() {
    const { alertMessages } = LanguageManager;
    const { toAddress, amount, selectedCoin } = this.state;
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
      Singleton.getInstance().defaultBnbAddress.toLowerCase()
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
        fromAddress: Singleton.getInstance().defaultBnbAddress,
        feeSymbol: this.dynamicFeesSymbol(),
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

  //******************************************************************************************/
  SendBnb(pin) {
    this.setState({ isLoading: true });
    const { gasEstimate, toAddress, amount, nonce, gasPrice } = this.state;

    setTimeout(async () => {
      try {


        console.log("pin>>>", pin);

        let privateKey = await getEncryptedData(`${Singleton.getInstance().defaultBnbAddress}_pk`, pin);

        console.log("privateKey", privateKey);

        let txn_raw = ""
        if (this.state.selectedCoin.coin_family == 1) {
          const chainId = Constants.network == "testnet" ? 97 : 56;
          txn_raw = await getBnbRaw(amount, toAddress, nonce, gasPrice, gasEstimate, chainId, privateKey)
        } else {//MATIC and TICS
          const chainId = this.state.selectedCoin.coin_family == 7 ? 9009 : 137;
          txn_raw = await getMaticRaw(amount, toAddress, nonce, gasPrice, gasEstimate, chainId, privateKey)
        }
        console.log("txn_raw", txn_raw);
        this.sendSerializedTxn(txn_raw);


      } catch (err) {
        this.setState({ isLoading: false });
        this.setState({ showAlertDialog: true, alertTxt: err });
      }
    }, 200);

  }

  //******************************************************************************************/
  SendBep20(pin) {
    this.setState({ isLoading: true });

    setTimeout(async () => {
      const { gasEstimate, toAddress, amount, nonce, gasPrice } = this.state;
      const { decimals, token_address } = this.state.selectedCoin;

      let privateKey = await getEncryptedData(`${Singleton.getInstance().defaultBnbAddress}_pk`, pin);



      const chainId = this.state.selectedCoin.coin_family == 1 ? 56 : 137;
      const BigNumber = require("bignumber.js");
      let a = new BigNumber(amount);
      let b = new BigNumber(decimals);
      const amountToSend = a.multipliedBy(b).toString();
      bnbDataEncode(token_address, toAddress, amountToSend)
        .then((encodedData) => {
          console.log("chk bep encoded Data::::::", encodedData);
          sendTokenBNB(
            token_address,
            encodedData,
            nonce,
            gasPrice,
            gasEstimate,
            chainId,
            privateKey
          )
            .then((signedRaw) => {
              console.log("chk bep signedRaw::::::", signedRaw);
              this.sendSerializedTxn(signedRaw);
            })
            .catch((err) => {
              this.setState({ isLoading: false });
              this.setState({ showAlertDialog: true, alertTxt: err.message });
            });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          this.setState({ showAlertDialog: true, alertTxt: err.message });
        });
    }, 200);

  }

  //******************************************************************************************/
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

  //******************************************************************************************/
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
        0.0003
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

  //******************************************************************************************/
  onPinSuccess(pin) {
    this.setState({ PinModal: false });
    setTimeout(() => {
      this.state.selectedCoin.is_token == 0 ? this.SendBnb(pin) : this.SendBep20(pin);
    }, 1000);
  }

  //******************************************************************************************/
  getAddress = (address) => {
    this.setState({ toAddress: address, showContact: false });
  };

  //******************************************************************************************/TODO: -
  onPressAddressBook() {
    this.setState({ showAddressBookModal: true })
  }

  //******************************************************************************************/
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

  //******************************************************************************************/
  onPressConfirm() {
    this.setState({ PinModal: true });
    this.setState({ showConfirmModal: false });
    setTimeout(() => {
      if (this.state.bioMetricMode) this.checkBiometricAvailabilty();
    }, 2000);
  }

  //******************************************************************************************/
  onMaxClicked() {
    this.setState({ maxclicked: true });
    setTimeout(() => {
      this.setToAmountMax();
    }, 300);
  }

  //******************************************************************************************/
  onClickAction = (type) => {
    const {
      gasPriceForTxnSlow,
      gasPriceForTxnMedium,
      gasPriceForTxnHigh,
    } = this.state;
    const gasPrice =
      type == "slow"
        ? gasPriceForTxnSlow
        : type == "average"
          ? gasPriceForTxnMedium
          : gasPriceForTxnHigh;
    this.setState(
      {
        selectedFeeType: type == "slow" ? 1 : type == "average" ? 2 : 3,
        gasPriceForTxn: gasPrice,
        totalFee: toFixedExp(
          gasPrice * this.state.gasEstimate * this.state.gasFeeMultiplier,
          8
        ),
      },
      () => {
        if (this.state.maxclicked) this.setToAmountMax();
      }
    );
  };

  //******************************************************************************************/
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

  typeTextView = (value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: heightDimen(6)
        }}
      >
        {this.text("Low", "left", 'text')}
        {this.text("Average", "center", 'text')}
        {this.text("High", "right", 'text')}
      </View>
    );
  };


  text = (value, textAlign, type) => {
    return (
      <>
        {type == 'text' && <Text
          style={{
            fontSize: 14,
            fontFamily: Fonts.dmSemiBold,
            color: ThemeManager.colors.legalGreyColor,
            flex: 1,
            textAlign: textAlign,
          }}
        >
          {value}
        </Text>}
        {type == 'fee' && <Text
          style={{
            fontSize: 10,
            fontFamily: Fonts.dmSemiBold,
            color: ThemeManager.colors.legalGreyColor,
            flex: 1,
            textAlign: textAlign,
          }}
        >
          {value + ' ' + (this.dynamicFeesSymbol())}
        </Text>}
        {type == 'fiat' && <Text
          style={{
            fontSize: 10,
            fontFamily: Fonts.dmSemiBold,
            color: ThemeManager.colors.legalGreyColor,
            flex: 1,
            textAlign: textAlign,
          }}
        >
          {value + ' ' + Singleton.getInstance().CurrencySelected}
        </Text>}
      </>
    );
  };
  typeTextGasView = (key) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {this.text(toFixedExp(this.state.gasPriceForTxnSlow * this.state.gasEstimate * this.state.gasFeeMultiplier, 4) <= 0 ? toFixedExp(this.state.gasPriceForTxnSlow * this.state.gasEstimate * this.state.gasFeeMultiplier, 6) : toFixedExp(this.state.gasPriceForTxnSlow * this.state.gasEstimate * this.state.gasFeeMultiplier, 4), "left", key)}
        {this.text(toFixedExp(this.state.gasPriceForTxnMedium * this.state.gasEstimate * this.state.gasFeeMultiplier, 4) <= 0 ? toFixedExp(this.state.gasPriceForTxnMedium * this.state.gasEstimate * this.state.gasFeeMultiplier, 6) : toFixedExp(this.state.gasPriceForTxnMedium * this.state.gasEstimate * this.state.gasFeeMultiplier, 4), "center", key)}
        {this.text(toFixedExp(this.state.gasPriceForTxnHigh * this.state.gasEstimate * this.state.gasFeeMultiplier, 4) <= 0 ? toFixedExp(this.state.gasPriceForTxnHigh * this.state.gasEstimate * this.state.gasFeeMultiplier, 6) : toFixedExp(this.state.gasPriceForTxnHigh * this.state.gasEstimate * this.state.gasFeeMultiplier, 4), "right", key)}
      </View>
    );
  };
  typeTextUsdView = (key) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {this.text(toFixedExp(this.state.gasPriceForTxnSlow * this.state.gasEstimate * this.state.gasFeeMultiplier * this.state.nativePrice, 4), "left", key)}
        {this.text(toFixedExp(this.state.gasPriceForTxnMedium * this.state.gasEstimate * this.state.gasFeeMultiplier * this.state.nativePrice, 4), "center", key)}
        {this.text(toFixedExp(this.state.gasPriceForTxnHigh * this.state.gasEstimate * this.state.gasFeeMultiplier * this.state.nativePrice, 4), "right", key)}
      </View>
    );
  };
  // TODO: -
  onPressItem(item, index) {
    this.setState({ selected_Index: index });
    setTimeout(() => {
      this.setState({ showContactlModal: false });
      this.getAddress(item?.wallet_address);
      // Actions.currentScene == 'ContactsBook' && Actions.pop();
    }, 800);
  }

  onPressPaste = () => {
    Clipboard.getString().then((address) => {
      this.setState({
        toAddress: address,
      })
    })
  }


  //******************************************************************************************/
  render() {
    console.log("selectedCoin>>>", this.state.selectedCoin);

    const {
      walletMain,
      sendTrx,
      merchantCard,
      placeholderAndLabels,
    } = LanguageManager;
    const { modalVisible } = this.state;
    if (this.state.isVisible)
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: ThemeManager.colors.mainBgNew,
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
                    console.log("address>>", address);

                    if (address.includes(':')) {
                      let address1 = address.split(':')
                      newAddress = address1[1];
                      if (newAddress.includes('?')) {
                        let address1 = newAddress.split('?')
                        newAddress = address1[0];
                      }
                    } else {
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
                      { color: ThemeManager.colors.blackWhiteText },
                    ]}
                  >
                    {merchantCard.walletAddress}
                  </Text>
                </View>
                <View style={{}}>
                  <View
                    style={[
                      styles.ViewStyle,
                      {
                        borderColor: ThemeManager.colors.inputBorder,
                        backgroundColor: "transparent",
                      },
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
                      placeHolder={merchantCard.walletAddress}
                      customInputStyle={[
                        styles.ViewStyle1,
                        {
                          backgroundColor: "transparent",
                          color: ThemeManager.colors.blackWhiteText,
                        },
                      ]}
                      placeholderTextColor={ThemeManager.colors.inputBorder}
                    />
                    <TouchableOpacity
                      style={{ position: "absolute", right: 80, top: 17, alignSelf: "center" }}
                      onPress={() => this.onPressPaste()}
                    >
                      <Text style={[styles.txtWallet, { color: ThemeManager.colors.blackWhiteText, fontFamily: Fonts.dmBold }]}>
                        {sendTrx.paste}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        this.state.isButtonDisabled
                      }
                      onPress={() => {
                        this.setState({ isButtonDisabled: true });
                        this.onPressAddressBook();
                        setTimeout(() => {
                          this.setState({ isButtonDisabled: false });
                        }, 2000);
                      }}
                      // onPress={() => this.onPressAddressBook()}
                      style={{
                        position: "absolute",
                        right: 50,
                        top: 17,
                        alignSelf: "center",
                      }}
                    >
                      <Image
                        source={ThemeManager.ImageIcons.addressBook}
                        style={{
                          tintColor: ThemeManager.colors.blackWhiteText,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={this.state.isButtonDisabled}
                      onPress={() => {
                        this.setState({ isButtonDisabled: true });
                        this.requestCameraPermission();
                        setTimeout(() => {
                          this.setState({ isButtonDisabled: false });
                        }, 2000);
                      }}
                      // onPress={() => this.requestCameraPermission() }
                      style={styles.scan}
                    >
                      <Image
                        style={{
                          tintColor: ThemeManager.colors.blackWhiteText,
                        }}
                        source={ThemeManager.ImageIcons.scan}
                      />
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
                    {sendTrx.Amount}
                  </Text>
                  <View
                    style={[
                      styles.ViewStyle2,
                      {
                        borderColor: ThemeManager.colors.inputBorder,
                        backgroundColor: "transparent",
                      },
                    ]}
                  >
                    <InputCustom
                      value={this.state.amount}
                      onChangeText={(val) => {
                        this.onChangeAmount(val);
                      }}
                      placeHolder={sendTrx.enterAmount}
                      placeholderColor={ThemeManager.colors.darkMode}
                      keyboardType="decimal-pad"
                      maxLength={15}
                      customInputStyle={[
                        styles.ViewStyle4,
                        { color: ThemeManager.colors.DarkRed },
                      ]}
                      placeholderTextColor={ThemeManager.colors.inputBorder}
                    />
                    <View style={styles.ViewStyle3}>
                      {/* {this.state.selectedCoin.coin_image ? (
                      <View style={[styles.ImgStyle, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                        <Image style={styles.ImgStyle} source={{ uri: this.state.selectedCoin.coin_image }} />
                      </View>
                    ) : (
                      <View style={[styles.ImgStyle, { backgroundColor: ThemeManager.colors.settingsText }]}>
                        <Text allowFontScaling={false} style={[styles.coinSymbolStyle, { color: ThemeManager.colors.Mainbg, textTransform: 'capitalize', paddingLeft: 0 }]}>{this.state.selectedCoin.coin_symbol?.substring(0, 1)}</Text>
                      </View>
                    )} */}
                      {/* <Text allowFontScaling={false} style={[styles.coinSymbolStyle, { color: ThemeManager.colors.subTextColor }]}>{this.state.selectedCoin.coin_symbol.toUpperCase()}</Text> */}
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={ThemeManager.ImageIcons.approxEqual}
                        style={{
                          width: widthDimen(8),
                          height: widthDimen(8),
                          resizeMode: "contain",
                        }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.fiatStyle,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {Singleton.getInstance().CurrencySymbol}
                        {this.state.valueInUSD}
                      </Text>
                    </View>

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

                      </Text>

                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: heightDimen(10),
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.onClickAction("slow");
                          }}
                          activeOpacity={0.8}
                          style={{ flex: 1 }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor:
                                  this.state.selectedFeeType == 1
                                    ? "rgba(94, 209, 210, 0.5)"
                                    : "transparent",
                                borderRadius:
                                  this.state.selectedFeeType == 1 ? 20 : 10,
                                height:
                                  this.state.selectedFeeType == 1 ? 30 : 15,
                                width:
                                  this.state.selectedFeeType == 1 ? 30 : 15,
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft:
                                  this.state.selectedFeeType == 1 ? -10 : 0,
                              }}
                            >
                              <LinearGradient
                                colors={[
                                  this.state.selectedFeeType == 1
                                    ? "#85FFC4"
                                    : "#BC85FF",
                                  "#5CC6FF",
                                  this.state.selectedFeeType == 1
                                    ? "#BC85FF"
                                    : "#85FFC4",
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0.25 }}
                                style={{
                                  borderRadius:
                                    this.state.selectedFeeType == 1 ? 30 : 10,
                                  height:
                                    this.state.selectedFeeType == 1 ? 20 : 15,
                                  width:
                                    this.state.selectedFeeType == 1 ? 20 : 15,
                                }}
                              />
                            </View>
                            <LinearGradient
                              colors={
                                this.state.selectedFeeType == 1
                                  ? [
                                    ThemeManager.colors.inputBorder,
                                    ThemeManager.colors.inputBorder,
                                  ]
                                  : ["#85FFC4", "#5CC6FF", "#BC85FF"]
                              }
                              style={{
                                height: 3,
                                width: "90%",
                              }}
                            />
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            this.onClickAction("average");
                          }}
                          activeOpacity={0.8}
                          style={{ flex: 1 }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor:
                                  this.state.selectedFeeType == 2
                                    ? "rgba(94, 209, 210, 0.5)"
                                    : "transparent",
                                borderRadius:
                                  this.state.selectedFeeType == 2 ? 20 : 10,
                                height:
                                  this.state.selectedFeeType == 2 ? 30 : 15,
                                width:
                                  this.state.selectedFeeType == 2 ? 30 : 15,
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft:
                                  this.state.selectedFeeType == 2 ? -10 : 0,
                                // height:30,
                                // width:30,
                              }}
                            >
                              <LinearGradient
                                colors={[
                                  (this.state.selectedFeeType == 2 || this.state.selectedFeeType == 3)
                                    ? "#85FFC4"
                                    : "#76747B",
                                  (this.state.selectedFeeType == 2 || this.state.selectedFeeType == 3) ? "#5CC6FF" : '#76747B',
                                  (this.state.selectedFeeType == 2 || this.state.selectedFeeType == 3)
                                    ? "#BC85FF"
                                    : "#76747B",
                                ]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0.25 }}
                                style={{
                                  borderRadius:
                                    this.state.selectedFeeType == 2 ? 30 : 10,
                                  height:
                                    this.state.selectedFeeType == 2 ? 20 : 15,
                                  width:
                                    this.state.selectedFeeType == 2 ? 20 : 15,
                                }}
                              />
                            </View>
                            <LinearGradient
                              colors={
                                this.state.selectedFeeType == 3
                                  ? ["#85FFC4", "#5CC6FF", "#BC85FF"]
                                  : [
                                    ThemeManager.colors.inputBorder,
                                    ThemeManager.colors.inputBorder,
                                  ]
                              }
                              style={{
                                height: 3,
                                // flex:1
                                width: "90%",
                              }}
                            />
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            this.onClickAction("high");
                          }}
                          activeOpacity={0.8}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              backgroundColor:
                                this.state.selectedFeeType == 3
                                  ? "rgba(94, 209, 210, 0.5)"
                                  : Colors.primaryColor,
                              borderRadius:
                                this.state.selectedFeeType == 3 ? 20 : 10,
                              height: this.state.selectedFeeType == 3 ? 30 : 15,
                              width: this.state.selectedFeeType == 3 ? 30 : 15,
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft:
                                this.state.selectedFeeType == 3 ? -10 : 0,
                            }}
                          >
                            <LinearGradient
                              colors={[
                                this.state.selectedFeeType == 3
                                  ? "#85FFC4"
                                  : "#76747B",
                                this.state.selectedFeeType == 3 ? "#5CC6FF" : '#76747B',
                                this.state.selectedFeeType == 3
                                  ? "#BC85FF"
                                  : "#76747B",
                              ]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0.25 }}
                              style={{
                                borderRadius:
                                  this.state.selectedFeeType == 3 ? 30 : 10,
                                height:
                                  this.state.selectedFeeType == 3 ? 20 : 15,
                                width:
                                  this.state.selectedFeeType == 3 ? 20 : 15,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                      {this.typeTextView()}
                      {this.typeTextGasView("fee")}
                      {this.typeTextUsdView("fiat")}
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
                onPress={() => {
                  this.sendTransaction();
                }}
                myStyle={{ marginBottom: heightDimen(50) }}
                buttontext={sendTrx.SEND}
              />
            )}
          </View>

          {/* --------------------------------Modal for Pin----------------------------------- */}
          <Modal
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
                closeEnterPin={(pin) => {
                  this.onPinSuccess(pin);
                }}
              />
            </View>
          </Modal>
          {/* --------------------------------ConfirmTxnModal----------------------------------- */}
          <ConfirmTxnModal
            handleBack={() => this.setState({ showConfirmModal: false })}
            showConfirmTxnModal={this.state.showConfirmModal}
            newObj={this.state.newObj}
            selectedCoin={this.state.selectedCoin}
            onPress={() => this.onPressConfirm()}
          />
          {/* // TODO: - */}
          <ContactsBook
            handleBack={() => this.setState({ showAddressBookModal: false })}
            showAddressBookModal={this.state.showAddressBookModal}
            newObj={this.state.newObj}
            getAddress={this.getAddress}
            address={Singleton.getInstance().defaultBnbAddress}
            coin_family={this.state.selectedCoin.coin_family}
            selectedCoin={this.state.selectedCoin}
            onPress={() => this.onPressConfirm()}
            onPressView={(item) => {
              this.setState({
                showAddressBookModal: false,
                showContactlModal: true,
                selectedItem: item,
              });
              console.log("here==", item);
            }}
            addbook={() => {
              this.setState({ showAddressBookModal: false });
              Actions.currentScene != "AddContact" &&
                Actions.AddContact({ themeSelected: this.props.themeSelected });
            }}
            navigation={this.props.navigation}
          />
          {/* // TODO: - */}
          <AddressModal
            selected_Index={this.state.selected_Index}
            onPressItem={(item, index) => this.onPressItem(item, index)}
            dismiss={() => this.setState({ showContactlModal: false })}
            item={this.state.selectedItem}
            openModel={this.state.showContactlModal}
          />

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
})(SendBnbPol);

