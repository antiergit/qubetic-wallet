/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, Image, Text, TouchableOpacity, Modal, ImageBackground } from "react-native";
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
  requestSendCoin,
  requestBTCgasprice,
  requestUnspent,
  requestNonce,
  addAddress,
  fetchNative_CoinPrice,
} from "../../../Redux/Actions";
import {
  clearGarbageCollection,
  exponentialToDecimal,
  exponentialToDecimalWithoutComma,
  getData,
  getEncryptedData,
  toFixedExp,
} from "../../../Utils/MethodsUtils";
import ReactNativeBiometrics from "react-native-biometrics";
import styles from "./SendBtcStyle";
import { Fonts, Images, Colors } from "../../../theme/";
import { ActionConst, Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemeManager } from "../../../../ThemeManager";
import { connect } from "react-redux";
import { LoaderView } from "../../common/LoaderView";
import * as Constants from "../../../Constants";
import Singleton from "../../../Singleton";
import EnterPinForTransaction from "../EnterPinForTransaction/EnterPinForTransaction";
import { sendBtcTangem, validateBTCAddress } from "../../../Utils/BtcUtils";
import { EventRegister } from "react-native-event-listeners";
import { LanguageManager } from "../../../../LanguageManager";
import LinearGradient from "react-native-linear-gradient";
import { widthDimen, heightDimen } from "../../../Utils";
import ContactsBook from "../ContactsBook/ContactsBook";
import { BackHandler } from "react-native";
import { sendMakerTransData } from "../../../Utils/CheckerMarkerUtils";
import Clipboard from "@react-native-clipboard/clipboard";


const bitcore = require("bitcore-lib");

let fee = 0;
let inputCount = 0;
let outputCount = 2;
let totalAmountAvailable = 0;
let inputs = [];
let transactionSize = 0;
let btcTosatoshi = 100000000;
let btcTosatoshiMultiplier = 0.00000001;

class SendBtc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      newObj: "",
      showConfirmModal: false,
      nativePrice: 0,
      modalVisible: false,
      myAddress: this.props.selectedCoin.wallet_address,
      toAddress: "",
      selectedCoin: this.props.selectedCoin,
      isLoading: this.props.tabType == "receive" ? false : true,
      selectedFeeType: 2,
      selectedFee: "",
      amount: "",
      gasEstimate: 0,
      gas_gwei_price: 0,
      nonce: 0,
      userToken: "",
      advanceMode: false,
      isVisible: false,
      marketPriceSelectedCurrency: 0,
      valueInUSD: 0,
      valueInCoinForm: 0,
      selectedDropDownIndex: 1,
      SliderValue: 0,
      SliderValuemin: 0,
      SliderValuemax: 0,
      btcfeesResponse: true,
      btcFeeObj: null,
      bioMetricMode: false,
      showAlertDialog: false,
      alertTxt: "",
      marketUSDPrice: "",
      maxclicked: false,
      PinModal: false,
      showSaveContactModal: false,
      userName: "",
      showContact: true,
      errorMsg: "",
      isFocusOne: false,
      isFocusTwo: false,
      isButtonDisabled: false,
      showAddressBookModal: false,
      showContactlModal: false,
      isReqSent: false,
      walletName: '',

    };
    this.isMakerWallet = Singleton.getInstance().isMakerWallet
  }



  /******************************************************************************************/
  async componentDidMount() {

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
    getData(Constants.BIOMETRIC_MODE).then((bio_mode) => {
      if (bio_mode == "false") this.setState({ bioMetricMode: false });
      else this.setState({ bioMetricMode: true });
    });
    this.props.navigation.addListener("didFocus", async () => {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
      // this.fetchNativeCoinPrice();
    });
    this.props.navigation.addListener("didBlur", (ev) => {
      this.setState({ isVisible: false, modalVisible: false, PinModal: false });
    });
    this.getbtcFeesAndUnspentTransaction();
    this.setState({
      marketPriceSelectedCurrency: this.state.selectedCoin.currentPriceInMarket,
    });
  }

  componentWillUnmount() {
    clearGarbageCollection()
  }

  handleBackButtonClick() {
    console.log("backhandler>>>>>>");
    Actions.pop()

    return true;
  };

  /******************************************************************************************/
  fetchNativeCoinPrice() {
    let data = {
      fiat_currency: Singleton.getInstance().CurrencySelected,
      coin_family: 3,
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
  onPressConfirm() {
    this.setState({ PinModal: true });
    this.setState({ showConfirmModal: false });
    setTimeout(() => {
      if (this.state.bioMetricMode) this.checkBiometricAvailabilty();
    }, 2000);
  }

  onPressItem(item, index) {
    this.setState({ selected_Index: index });
    setTimeout(() => {
      this.setState({ showContactlModal: false });
      this.getAddress(item?.wallet_address);
      // Actions.currentScene == 'ContactsBook' && Actions.pop();
    }, 800);
  }

  /******************************************************************************************/
  getbtcFeesAndUnspentTransaction() {
    inputCount = 0;
    inputs = [];
    /******************************get btc fees****************************** */
    this.props
      .requestBTCgasprice()
      .then((res) => {
        if (res.regular) {
          this.setState({
            btcfeesResponse: true,
            btcFeeObj: res,
            SliderValue: res.priority,
            SliderValuemin: res.limits.min,
            SliderValuemax: res.limits.max,
          });
        } else {
          this.setState({
            btcfeesResponse: false,
            btcFeeObj: null,
            SliderValue: 50,
            SliderValuemin: 1,
            SliderValuemax: 100,
          });
        }
        /******************************get unspent transaction****************************** */
        getData(Constants.ACCESS_TOKEN).then((token) => {
          this.props
            .requestUnspent(
              this.state.myAddress,
              token,
              this.state.selectedCoin.coin_symbol
            )
            .then((res) => {
              console.log("response unspent>>>>>>", res);
              totalAmountAvailable = 0;

              res.data.forEach(async (element) => {
                let utxo = {};
                utxo.satoshis = Math.floor(Number(element.satoshis));
                utxo.script = element.scriptPubKey;
                utxo.address = element.address;
                utxo.txId = element.txid;
                utxo.outputIndex = element.vout;
                utxo.tx_raw = element.tx_raw;
                totalAmountAvailable += utxo.satoshis;
                inputCount += 1;
                inputs.push(utxo);
              });
              this.setState({ isLoading: false });
              console.log("------input", JSON.stringify(inputs));
              console.log("------inputCount", inputCount);
              console.log("------outputCount", outputCount);
              transactionSize =
                inputCount * 146 + outputCount * 34 + 10 - inputCount;
            })
            .catch((e) => {
              this.setState({ isLoading: false });
            });
        });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
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
  setToAmountMax(SliderValue) {
    console.log("s ", this.state.selectedCoin.balance);
    console.log("transactionSize ", transactionSize);
    console.log("SliderValue ", SliderValue);
    if (this.state.selectedCoin.balance == 0 || this.state.maxclicked == false)
      return;
    let val;
    if (this.state.selectedDropDownIndex == 0)
      val = (
        (this.state.selectedCoin.balance -
          this.convertSatoshiinCoinForm(transactionSize * SliderValue)) *
        this.state.marketPriceSelectedCurrency
      ).toFixed(8);
    else
      val = (
        this.state.selectedCoin.balance -
        this.convertSatoshiinCoinForm(transactionSize * SliderValue) -
        0.00002
      ).toFixed(8);
    console.log(transactionSize * SliderValue);
    if (val.toString().includes("-")) {
      return this.setState({
        showAlertDialog: true,
        alertTxt:
          LanguageManager.alertMessages
            .YoudonthaveEnoughbalanceAmountTransactionFee,
      });
    }
    console.log("val ", val);
    this.setState({ amount: (val * 1).toFixed(6).toString() });
    this.showActualAmount(val);
  }

  /******************************************************************************************/
  convertSatoshiinCoinForm(satoshisvalue) {
    const val = parseFloat(
      exponentialToDecimalWithoutComma(satoshisvalue / btcTosatoshi)
    );
    return val;
  }

  /******************************************************************************************/
  sendSerializedTxn(
    nonce,
    tx_raw,
    myAddress,
    toAddress,
    amount,
    gasEstimate,
    gas_gwei_price,
    coin_symbol,
    userToken
  ) {
    const sendCoinReq = {
      nonce: nonce,
      tx_raw: `${tx_raw}`,
      from: myAddress,
      to: toAddress,
      amount: amount,
      gas_estimate: gasEstimate,
      eth_gas_price: gas_gwei_price,
      tx_type: "withdraw",
    };
    console.log("sendCoinReq:::::>>>>>", sendCoinReq);
    this.props
      .requestSendCoin({
        url: `bitcoin/${coin_symbol}/send`,
        coinSymbol: coin_symbol,
        sendCoinReq,
        token: userToken,
      })
      .then((res) => {
        console.log("coin_symbol::::", coin_symbol);
        console.log("this.state.amount::::", this.state.amount);
        console.log("this.state.selectedFee::::", this.state.selectedFee);
        // Actions.replace("TransactionHistory", {
        //   selectedCoin: this.state.selectedCoin,
        // });
        Actions.TransactionHistory({ type: ActionConst.RESET, selectedCoin: this.state.selectedCoin });
        this.setState({ isLoading: false });
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        this.setState({
          showAlertDialog: true,
          alertTxt:
            e || LanguageManager.alertMessages.failedtoInitiateTransaction,
        });
      });
  }

  /******************************************************************************************/
  onPinSuccess(pin) {
    this.setState({ PinModal: false });
    this.setState({ showConfirmModal: false });
    setTimeout(() => {
      console.log(
        "sendMakerTransData SendBnb SendBnb ------",
        this.isMakerWallet
      );
      if (this.isMakerWallet) {
        this.makeTransactionMaker();
      } else {
        this.sendBtc(pin);
      }
    }, 1000);
  }

  makeTransactionMaker() {
    const { toAddress, amount } = this.state;
    const data = {
      amount,
      selectedCoin: this.props.selectedCoin,
      makerUserId: this.state.makerUserId,
      fromAddress: Singleton.getInstance().defaultBtcAddress,
      toAddress,
      walletName: this.state.walletName,
      selectedFeeType: this.state.selectedFeeType,
    };
    sendMakerTransData(data)
      .then((res) => {
        console.log("sendMakerTransData res ----", res);
        this.setState({
          showAlertDialog: true,
          alertTxt:
            "Transaction request has been successfully sent to the Checker.",
          isReqSent: true,
        });
      })
      .catch((err) => {
        console.log("sendMakerTransData err ----", err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }
  // broadcastTransaction = async (signedTx) => {
  //   try {
  //     const response = await axios.post('https://blockchain.info/pushtx', `tx=${signedTx}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Broadcast error:', error);
  //     if (error.response) {
  //       console.error('Error response data:', error.response.data);
  //       throw new Error(`Broadcast failed: ${error.response.data}`);
  //     } else {
  //       throw new Error(`Broadcast failed: ${error.message}`);
  //     }
  //   }
  // };

  /******************************************************************************************/
  async sendBtc(pin) {
    const {
      nonce,
      myAddress,
      toAddress,
      amount,
      gasEstimate,
      gas_gwei_price,
      selectedCoin,
    } = this.state;
    let privateKey = await getEncryptedData(`${Singleton.getInstance().defaultBtcAddress}_pk`, pin);
    fee = transactionSize * this.state.SliderValue;
    console.log("----fee", fee);
    console.log("----transactionSize", transactionSize);
    console.log("----SliderValue", this.state.SliderValue);
    console.log("----totalAmountAvailable", totalAmountAvailable);
    console.log("----eee22", Math.round(this.state.amount * btcTosatoshi));
    console.log("----eee22btcTosatoshi==", btcTosatoshi);
    console.log("----privateKey", privateKey);

    console.log(
      "after fee",
      totalAmountAvailable - Math.round(this.state.amount * btcTosatoshi) - fee
    );
    if (
      totalAmountAvailable -
      Math.round(this.state.amount * btcTosatoshi) -
      fee <
      0

    ) {
      console.log("---aaaaaa>>>>");
      return this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.balancetooLowforThisTransaction,
      });
    }
    console.log("-----1");
    this.setState({ isLoading: true });
    setTimeout(async () => {
      console.log("-----2", amount, toAddress, myAddress);

      let serializedTransaction;
      try {
        const transaction = new bitcore.Transaction();
        transaction.from(inputs);
        transaction.to(
          this.state.toAddress,
          Math.round(this.state.amount * btcTosatoshi)
        );
        transaction.change(this.state.myAddress);
        transaction.fee(fee);
        transaction.sign(privateKey);
        serializedTransaction = transaction.serialize();

        console.log('--------------serializeBTC', serializedTransaction)

      } catch (e) {
        console.log(e);
        this.setState({
          showAlertDialog: true,
          alertTxt: LanguageManager.alertMessages.failedtoInitiateTransaction,
        });
        this.setState({ isLoading: false });
        return;
      }

      getData(Constants.ACCESS_TOKEN)
        .then((token) => {
          privateKey = ""
          this.sendSerializedTxn(
            nonce,
            serializedTransaction,
            myAddress,
            toAddress,
            amount,
            gasEstimate,
            gas_gwei_price,
            selectedCoin.coin_symbol,
            token
          );
        })
        .catch((err) => {
          privateKey = ""
          this.setState({
            showAlertDialog: true,
            alertTxt: LanguageManager.alertMessages.failedtoInitiateTransaction,
          });

          this.setState({ isLoading: false });
        });
    }, 200);
  }

  /******************************************************************************************/
  async sendTransaction() {
    const { alertMessages } = LanguageManager;
    if (this.state.toAddress.trim().length == 0)
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterWalletAddress,
      });
    else if (
      this.state.toAddress.toLowerCase() ==
      Singleton.getInstance().defaultBtcAddress.toLowerCase()
    )
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.youCannotSendToSameAddress,
      });
    else if (this.state.amount.trim().length == 0 || this.state.amount == 0)
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterAmount,
      });
    else if (isNaN(parseFloat(this.state.amount)))
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.pleaseEnterValidAmount,
      });
    else if (!/^\d*\.?\d*$/.test(this.state.amount)) {
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.youCanEnterOnlyOneDecimal,
      });
    } else if (
      parseFloat(this.state.amount) >
      parseFloat(toFixedExp(this.state.selectedCoin.balance, 8))
    ) {
      return this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.youhaveInsufficientBalance,
      });
    } else {
      const totalFee =
        transactionSize * this.state.SliderValue * btcTosatoshiMultiplier;
      const newObj = {
        valueInUSD: this.state.valueInUSD,
        amount: this.state.amount,
        totalFee: totalFee,
        nativePrice: this.state.selectedCoin.currentPriceInMarket,
        toAddress: this.state.toAddress,
        fromAddress: Singleton.getInstance().defaultBtcAddress,
        feeSymbol: "BTC",
        fiatAmount: toFixedExp(
          parseFloat(this.state.amount) *
          parseFloat(this.state.selectedCoin.currentPriceInMarket),
          2
        ),
        fiatCoin: toFixedExp(
          parseFloat(totalFee) *
          parseFloat(this.state.selectedCoin.currentPriceInMarket),
          2
        ),
      };
      this.setState({ showConfirmModal: true, newObj: newObj });
    }
  }

  /******************************************************************************************/
  convertSatoshiToUsd(satoshisvalue) {
    if (!transactionSize) {
      return "";
    }
    const val = (
      exponentialToDecimalWithoutComma((satoshisvalue / btcTosatoshi) * transactionSize) *
      this.state.marketPriceSelectedCurrency
    ).toFixed(5);
    console.log(
      'convertSatoshiToUsd -----', satoshisvalue,
      exponentialToDecimalWithoutComma((satoshisvalue / btcTosatoshi) * transactionSize) *
      this.state.marketPriceSelectedCurrency
    );
    return val;
  }

  /******************************************************************************************/
  // onPressAddressBook() {
  //   Actions.currentScene != "ContactsBook" &&
  //     Actions.ContactsBook({
  //       getAddress: this.getAddress,
  //       ispop: true,
  //       address: Singleton.getInstance().defaultBtcAddress,
  //       coin_family: 3,
  //     });
  // }


  onPressAddressBook() {
    this.setState({ showAddressBookModal: true })
  }






  /******************************************************************************************/
  onMaxClicked() {
    this.setState({ maxclicked: true });
    setTimeout(() => {
      this.setToAmountMax(this.state.SliderValue);
    }, 300);
  }

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
  onClickAction = (type) => {
    this.setState({
      selectedFeeType: type == "slow" ? 1 : type == "average" ? 2 : 3,
      SliderValue:
        type == "slow"
          ? this.state.btcFeeObj.regular
          : type == "average"
            ? this.state.btcFeeObj.priority
            : this.state.btcFeeObj.limits.max,
    });
    if (this.state.maxclicked) {
      this.setToAmountMax(
        type == "slow"
          ? this.state.btcFeeObj.regular
          : type == "average"
            ? this.state.btcFeeObj.priority
            : this.state.btcFeeObj.limits.max
      );
    }
  };

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
  getAddress = (address) => {
    this.setState({ toAddress: address, showContact: false });
  };

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
      alertMessages,
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
                  <Text allowFontScaling={false} style={[styles.txtCancel, , { color: ThemeManager.colors.blackWhiteText }]}>
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
        <View style={{ flex: 1, }}>
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
                <View style={{}}>
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
                  <View style={{ flex: 1 }}>
                    <View
                      style={[
                        styles.ViewStyle,
                        // { borderColor: ThemeManager.colors.blackWhiteText },
                        { backgroundColor: "transparent", borderColor: ThemeManager.colors.inputBorder, }
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
                        placeHolder={placeholderAndLabels.pasteWalletaddress}
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
                        style={{ position: "absolute", right: 50, top: 17 }}
                      >
                        <Image source={ThemeManager.ImageIcons.addressBook} style={{ tintColor: ThemeManager.colors.blackWhiteText }} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.requestCameraPermission()}
                        style={styles.scan}
                      >
                        <Image
                          style={{ tintColor: ThemeManager.colors.blackWhiteText }}
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
                      {sendTrx.enterAmount}
                    </Text>

                    <View
                      style={[
                        styles.ViewStyle2,
                        // { borderColor: ThemeManager.colors.borderColor },
                        { borderColor: ThemeManager.colors.inputBorder, backgroundColor: "transparent" }
                      ]}
                    >
                      <InputCustom
                        value={this.state.amount}
                        onChangeText={(val) => {
                          this.onChangeAmount(val);
                        }}
                        placeHolder={sendTrx.enterAmount}
                        placeholderColor={Colors.placeholderColor}
                        keyboardType="decimal-pad"
                        maxLength={15}
                        customInputStyle={[
                          styles.ViewStyle4,
                          { color: ThemeManager.colors.settingsText },
                        ]}
                        placeholderTextColor={ThemeManager.colors.inputBorder}
                      />
                      <View style={styles.ViewStyle3}>
                        {/* {this.state.selectedCoin.coin_image ? (
                        <Image style={styles.ImgStyle} source={{ uri: this.state.selectedCoin.coin_image }} />
                      ) : (
                        <View style={[styles.ImgStyle, { backgroundColor: ThemeManager.colors.settingsText }]}>
                          <Text allowFontScaling={false} style={[styles.coinSymbolStyle, { color: ThemeManager.colors.Mainbg, textTransform: 'capitalize', paddingLeft: 0 }]}>{this.state.selectedCoin.coin_symbol?.substring(0, 1)}</Text>
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
                        allowFontScaling={false}
                        style={[
                          styles.fiatStyle,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        ≈ {Singleton.getInstance().CurrencySymbol}
                        {this.state.valueInUSD}
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

                    {/* <View style={styles.ViewStyle5}>
                     <Image
                      source={ThemeManager.ImageIcons.approxEqual}
                      style={{ width: widthDimen(8), height: widthDimen(8), resizeMode: "contain", }}
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
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.TextStyle,
                        { color: ThemeManager.colors.greytoken_type },
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
                  </View> */}
                  </View>
                </View>

                {/* ------------------------------------------------------------------- */}
                {this.state.btcFeeObj && (
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
                        {/* <Text
                        allowFontScaling={false}
                        style={[
                          styles.TextStyle1,
                          { color: ThemeManager.colors.lightText },
                        ]}
                      >
                        {" "}
                        (BTC)
                      </Text> */}
                      </Text>
                      <View style={{ justifyContent: "space-between" }}>
                        <LinearGradient
                          style={[
                            styles.feeView,
                            {
                              borderColor:
                                this.state.selectedFeeType == 1
                                  ? ThemeManager.colors.primaryColor
                                  : ThemeManager.colors.nmemonicsInputColor,
                              backgroundColor:
                                this.state.selectedFeeType == 1
                                  ? ThemeManager.colors.grayBlackNew
                                  : ThemeManager.colors.nmemonicsInputColor,
                              marginTop: 15,
                            },
                          ]}
                          colors={["#101010", "#18171F"]}
                        >
                          <TouchableOpacity
                            onPress={() => this.onClickAction("slow")}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                color:
                                  this.state.selectedFeeType == 1
                                    ? ThemeManager.colors.TextColor
                                    : ThemeManager.colors.blackWhiteText,
                                fontSize: 14,
                                fontFamily: Fonts.dmMedium,
                              }}
                            >
                              {sendTrx.slow}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle2,
                                  {
                                    color:
                                      this.state.selectedFeeType == 1
                                        ? ThemeManager.colors.primaryColor
                                        : ThemeManager.colors.blackWhiteText,
                                  },
                                ]}
                              >
                                {this.state.btcFeeObj.regular
                                  ? this.state.btcFeeObj.regular
                                  : 0}{" "}
                                sat/byte{" "}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle2,
                                  {
                                    color:
                                      this.state.selectedFeeType == 1
                                        ? ThemeManager.colors.primaryColor
                                        : ThemeManager.colors.blackWhiteText,
                                  },
                                ]}
                              >
                                {this.convertSatoshiToUsd(
                                  this.state.btcFeeObj.regular
                                )}{" "}
                                {Singleton.getInstance().CurrencySelected}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient
                          style={[
                            styles.feeView,
                            {
                              borderColor:
                                this.state.selectedFeeType == 2
                                  ? ThemeManager.colors.primaryColor
                                  : ThemeManager.colors.nmemonicsInputColor,
                              backgroundColor:
                                this.state.selectedFeeType == 2
                                  ? ThemeManager.colors.grayBlackNew
                                  : ThemeManager.colors.nmemonicsInputColor,
                            },
                          ]}
                          colors={["#101010", "#18171F"]}
                        >
                          <TouchableOpacity
                            onPress={() => this.onClickAction("average")}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                color:
                                  this.state.selectedFeeType == 2
                                    ? ThemeManager.colors.TextColor
                                    : ThemeManager.colors.blackWhiteText,
                                marginTop: 5,
                                fontSize: 14,
                                fontFamily: Fonts.dmMedium,
                              }}
                            >
                              {sendTrx.Average}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle2,
                                  {
                                    color:
                                      this.state.selectedFeeType == 2
                                        ? ThemeManager.colors.primaryColor
                                        : ThemeManager.colors.blackWhiteText,
                                  },
                                ]}
                              >
                                {this.state.btcFeeObj.priority
                                  ? this.state.btcFeeObj.priority
                                  : 0}{" "}
                                sat/byte{" "}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle2,
                                  {
                                    color:
                                      this.state.selectedFeeType == 2
                                        ? ThemeManager.colors.primaryColor
                                        : ThemeManager.colors.blackWhitePure,
                                  },
                                ]}
                              >
                                {this.convertSatoshiToUsd(
                                  this.state.btcFeeObj.priority
                                )}{" "}
                                {Singleton.getInstance().CurrencySelected}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </LinearGradient>

                        <LinearGradient
                          style={[
                            styles.feeView,
                            {
                              borderColor:
                                this.state.selectedFeeType == 3
                                  ? ThemeManager.colors.primaryColor
                                  : ThemeManager.colors.nmemonicsInputColor,
                              backgroundColor:
                                this.state.selectedFeeType == 3
                                  ? ThemeManager.colors.grayBlackNew
                                  : ThemeManager.colors.nmemonicsInputColor,
                            },
                          ]}
                          colors={["#101010", "#18171F"]}
                        >
                          <TouchableOpacity
                            onPress={() => this.onClickAction("high")}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{
                                color:
                                  this.state.selectedFeeType == 3
                                    ? ThemeManager.colors.TextColor
                                    : ThemeManager.colors.blackWhiteText,
                                marginTop: 5,
                                fontSize: 14,
                                fontFamily: Fonts.dmMedium,
                              }}
                            >
                              {sendTrx.Fast}
                            </Text>
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginTop: 5,
                              }}
                            >
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle2,
                                  {
                                    color:
                                      this.state.selectedFeeType == 3
                                        ? ThemeManager.colors.primaryColor
                                        : ThemeManager.colors.blackWhiteText,
                                  },
                                ]}
                              >
                                {this.state.btcFeeObj.limits.max
                                  ? this.state.btcFeeObj.limits.max
                                  : 0}{" "}
                                sat/byte{" "}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle2,
                                  {
                                    color:
                                      this.state.selectedFeeType == 3
                                        ? ThemeManager.colors.primaryColor
                                        : ThemeManager.colors.blackWhiteText,
                                  },
                                ]}
                              >
                                {this.convertSatoshiToUsd(
                                  this.state.btcFeeObj.limits.max
                                )}{" "}
                                {Singleton.getInstance().CurrencySelected}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </KeyboardAwareScrollView>

          <View style={styles.ViewStyle8}>
            <Button
              onPress={() => {
                if (validateBTCAddress(this.state.toAddress)) {
                  return this.sendTransaction();
                } else
                  this.setState({
                    showAlertDialog: true,
                    alertTxt: alertMessages.enterValidBTCaddress,
                  });
              }}
              myStyle={{ marginBottom: heightDimen(50) }}
              buttontext={sendTrx.SEND}
            />
          </View>



          <ContactsBook
            handleBack={() => this.setState({ showAddressBookModal: false })}
            showAddressBookModal={this.state.showAddressBookModal}
            newObj={this.state.newObj}
            getAddress={this.getAddress}
            address={Singleton.getInstance().defaultBtcAddress}
            coin_family={3}
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

const mapStateToProp = (state) => {
  const { gasPriceList } = state.sendCoinReducer;
  return { gasPriceList };
};

export default connect(mapStateToProp, {
  requestUnspent,
  requestSendCoin,
  requestBTCgasprice,
  requestNonce,
  addAddress,
  fetchNative_CoinPrice,
})(SendBtc);
