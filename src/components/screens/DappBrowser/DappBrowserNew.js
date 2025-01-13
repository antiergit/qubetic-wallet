import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  TextInput,
  Keyboard,
  SafeAreaView,
  ImageBackground
} from "react-native";
import {
  requestNonce,
  requestgasprice,
  requestGasEstimation,
  requestSendCoin,
  requestGasLimitForDapp,
} from "../../../Redux/Actions";
import {
  bigNumberSafeMath,
  exponentialToDecimal,
  getData,
  getEncryptedData,
  saveData,
  toFixed,
  toFixedExp,
} from "../../../Utils/MethodsUtils";
import styles from "./DappBrowserStyle";
import { Actions } from "react-native-router-flux";
import { Fonts, Images } from "../../../theme";
import { Button, LoaderView, AppAlert } from "../../common";
import RNFS from "react-native-fs";
import WebView from "react-native-webview";
import web3 from "web3";
import { connect } from "react-redux";
import Singleton from "../../../Singleton";
import * as Constants from "../../../Constants";
import { IS_PRODUCTION } from "../../../EndPoint";
import { ThemeManager } from "../../../../ThemeManager";
import FastImage from "react-native-fast-image";
import { BlurView } from "@react-native-community/blur";
import { getNonce, getTotalGasFee } from "../../../Utils/EthUtils";
import { EventRegister } from "react-native-event-listeners";
import { BackHandler } from "react-native";
import { LanguageManager } from "../../../../LanguageManager";
import { dimen, getDimensionPercentage, hasNotchWithIOS, heightDimen, widthDimen } from '../../../Utils';
import LinearGradient from "react-native-linear-gradient";

import DeviceInfo from 'react-native-device-info';
import EnterPinForTransaction from "../EnterPinForTransaction/EnterPinForTransaction";

const web3BscUrl =
  Constants.network == "testnet"
    ? Constants.BSC_TESTNET_URL
    : Constants.BSC_MAINNET_URL;
const web3EthUrl =
  Constants.network == "testnet"
    ? Constants.ETH_TESTNET_URL
    : Constants.ETH_MAINNET_URL;
const web3MaticUrl =
  Constants.network == "testnet"
    ? Constants.MATIC_TESTNET_URL
    : Constants.MATIC_MAINNET_URL;
const gasFeeMultiplier = 0.000000000000000001;
const imageBaseURl = "https://besticon-demo.herokuapp.com/allicons.json?url=";
const { sendTrx, browser, merchantCard } = LanguageManager;


let deviceName = '';

class DappBrowserNew extends Component {
  constructor(props) {
    console.log("chk props dapp::::", props);
    super(props);
    this.state = {
      content: "",
      jsContent: "",
      isVisible: false,
      signingData: "",
      calculatedFee: "",
      gasPrice: "",
      gas: "",
      canGoBack: false,
      gasFeeMultiplier: 0.000000000000000001,
      canGoForward: false,
      isLoading: false,
      selectedNetwork: "Ethereum",
      selectedNetworkImageUri: Constants.ETH_Img,
      chainId: this.props.chainId || 1,
      rpcUrl: this.props.rpcUrl || Singleton.getInstance().ETH_DAPP_RPC_URL,
      url: this.props.url,
      enteredURL: this.props.url,
      isNetworkModalVisible: false,
      showAlertDialog: false,
      alertTxt: "",
      isSearchFocus: false,
      selectedFeeType: 2,
      favoriteArray: [],
      isFavorite: false,
      urlTitle: "",
      isSwitch: false,
      isButtonDisabled: false,
      pinModal: false,
      msgType: "",
      signedData: "",
      isShowEth: true,
      isShowBnb: true,
      isShowMatic: true,
      isPrivateKeyWallet: false,
    };
  }

  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({ showAlertDialog: false, alertTxt: "", isVisible: false });
      if (this.state.signingData) {
        this.closeModal();
      }
    });
    global.isFromUniswap = "yes";

    this.blur = this.props.navigation.addListener("didBlur", () => {
      console.log("Blur .....");
      if (this.backhandle) this.backhandle?.remove();
      Keyboard.dismiss();
    });
    this.focus = this.props.navigation.addListener("didFocus", () => {
      this.backhandle = BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
      );
      console.log("Focus .....");
      Keyboard.dismiss();
    });



    getData(Constants.MULTI_WALLET_LIST)
      .then(list => {
        const currentWalletList = JSON.parse(list)
        let currentWallet = currentWalletList.find(res => res?.defaultWallet)

        let coinFamily = Constants.DAPP_COIN_LIST[0].coin_family;
        let coinItem = Constants.DAPP_COIN_LIST[0]
        if (currentWallet?.isPrivateKey) {
          coinFamily = currentWallet?.coinFamily
          coinItem = Constants.DAPP_COIN_LIST.find(res => res?.coin_family == coinFamily)
        }

        this.setState({
          selectedNetwork: coinItem.coin_name,
          isPrivateKeyWallet: true,
          chainId: coinItem.chainId,
          isShowBnb: coinFamily == 1 ? true : false,
          isShowEth: coinFamily == 2 ? true : false,
          isShowMatic: coinFamily == 2 ? true : false,
          selectedNetworkImageUri: Constants.COIN_IMAGE_BY_SYMBOL[coinItem?.coin_symbol],
          rpcUrl: this.getRpcUrl(coinFamily)
        }
          , () => {
            setTimeout(() => {
              this.connectWithDapp()
            }, 1000);
          })
      })

  }
  connectWithDapp() {
    var provider = new web3.providers.HttpProvider(this.state.rpcUrl);
    this.web3 = new web3(provider);
    if (this.state.jsContent === "") {
      if (Platform.OS === "ios") {
        RNFS.readFile(`${RNFS.MainBundlePath}/trust-min.js`, "utf8").then(
          (content) => {
            this.setState({
              jsContent: this.getJavascript(
                this.state.chainId,
                this.state.rpcUrl,
                Singleton.getInstance().defaultEthAddress,
                content
              ),
              content: content,
            });
          }
        );
      } else {
        RNFS.readFileAssets(`trust-min.js`, "utf8").then((content) => {
          this.setState({
            jsContent: this.getJavascript(
              this.state.chainId,
              this.state.rpcUrl,
              Singleton.getInstance().defaultEthAddress,
              content
            ),
            content: content,
          });
        });
      }
    }
  }

  /******************************************************************************************/
  handleBackButtonClick() {
    console.log("Backhandler Dapp");
    Singleton.bottomBar?.navigateTab("DefiAccessMain");
    Actions.pop();

    // Actions.jump("DefiAccessMain");
    return true;
  }

  /******************************************************************************************/
  componentWillUnmount() {
    global.isFromUniswap = null;
    clearTimeout(this.reloadWebView);
    this.blur.remove();
    this.focus.remove();
  }

  /******************************************************************************************/
  onLoadStart = (event) => {
    this.setState({ isLoading: true });
  };

  /******************************************************************************************/
  onLoadEnd = (event) => {
    this.setState({ isLoading: false });
  };

  /******************************************************************************************/
  onShouldStartLoadWithRequest = () => {
    return true;
  };

  /******************************************************************************************/
  onMessage = async ({ nativeEvent }) => {
    let message = JSON.parse(nativeEvent.data);
    console.log("---------message------", message);
    console.log("---------nativeEvent.data------", nativeEvent.data);
    // console.log('Singleton.getInstance().MATIC_RPC_URL-----', Singleton.getInstance().MATIC_RPC_URL);
    console.log('Singleton.getInstance().ETH_DAPP_RPC_URL-----', Singleton.getInstance().ETH_DAPP_RPC_URL);
    console.log('Singleton.getInstance().BSC_RPC_URL-----', Singleton.getInstance().BSC_RPC_URL);
    console.log(Singleton.getInstance().defaultEthAddress, 'Singleton.getInstance().defaultEthAddress');


    this.setState({ msgType: message.name })
    if (message.name == "signTransaction") {
      if (!message.object.value) message.object.value = "0x0";
      console.log("---------message.object.gas------", message.object.gas);

      if (!message.object.gas) {
        let res = await this.props.requestGasLimitForDapp({
          url:
            this.state.selectedNetwork == "Ethereum"
              ? Singleton.getInstance().ETH_DAPP_RPC_URL
              : this.state.selectedNetwork == "Binance"
                ? Singleton.getInstance().BSC_RPC_URL
                : web3MaticUrl,
          data: message.object,
        });
        console.log("res.result", res.result);
        if (res.result) message.object.gas = res.result;
        else message.object.gas = "0x238ec";
      }
      this.setState({ signingData: message });
      console.log("this.hex2dec(message.ob==", (message.object.value))

      console.log("this.hex2dec(message.object.value)==", this.hex2dec(message.object.value))
      this.getNonceAndGas(
        this.hex2dec(message.object.value),
        this.state.selectedNetwork == "Ethereum"
          ? "eth"
          : this.state.selectedNetwork == "Binance"
            ? "bnb"
            : "pol"
      );
    } else if (message.name == "requestAccounts") {
      /******************************************* requestAccounts ***********************************************/
      let js = `trustwallet.${message?.network}.setAddress('${Singleton.getInstance().defaultEthAddress}');`;
      console.log("js>>>>", js);

      this.webview?.injectJavaScript(js);
      let mmid = message.id;
      let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, ['${Singleton.getInstance().defaultEthAddress}'])`;
      console.log("js>>>>", js1);

      this.webview?.injectJavaScript(js1);

    } else if (
      /********************************************** signPersonalMessage ********************************************/
      message.name == "signPersonalMessage" ||
      message.name == "signMessage" ||
      message.name == "signTypedMessage"
    ) {
      this.setState({
        signedData: message,
        pinModal: true
      })

    } else if (message.name == "switchEthereumChain") {
      console.log("message.name==", message.name)
      let mmid = message.id;
      let chainId = message?.object?.chainId;
      chainId = parseInt(chainId, 16);
      let item = Constants.DAPP_COIN_LIST.find(
        (res) => res?.chainId == chainId
      );
      console.log("item-----", item);

      if (item == undefined) {
        let js1 = `trustwallet.${message?.network}.sendError(${mmid}, "not supported")`;
        this.webview.injectJavaScript(js1);
        return;
      }
      // if (this.state.isPrivateKeyWallet) {
      //   let js1 = `trustwallet.${message?.network}.sendError(${mmid}, "not supported")`;
      //   this.webview.injectJavaScript(js1);
      //   return
      // }
      let rpcUrl = this.getRpcUrl(item.coin_family)


      console.log("item-----rpcUrl", rpcUrl);

      this.setState({
        selectedNetwork: item.coin_name,
        isPrivateKeyWallet: true,
        chainId: item.chainId,
        selectedNetworkImageUri: Constants.COIN_IMAGE_BY_SYMBOL[item?.coin_symbol],
        rpcUrl: rpcUrl
      }, () => {

        let provider = new web3.providers.HttpProvider(rpcUrl);
        this.web3 = new web3(provider);
        let script = this.switchChainScript(chainId, rpcUrl)
        this.webview.injectJavaScript(script);
        let js = `trustwallet.ethereum.emitChainChanged('${web3.utils.toHex(message.object.chainId)}')`;
        this.webview.injectJavaScript(js);
        let js1 = `trustwallet.${message?.network}.sendResponse(${mmid}, null)`;
        this.webview.injectJavaScript(js1);
        this.web3 = new web3(provider);
      })
    }
  };

  getRpcUrl(coinFamily) {
    if (coinFamily == 1) {
      return Singleton.getInstance().BSC_RPC_URL
    } else if (coinFamily == 2) {
      return Singleton.getInstance().ETH_DAPP_RPC_URL
    } else {
      return Singleton.getInstance().MATIC_RPC_URL
    }
  }

  /******************************************************************************************/
  getJavascript = function (chainId, rpcUrl, address, jsContent) {
    let source = "";
    console.log("chainId:", chainId, "rpcUrl:", rpcUrl, "address:", address);

    source = `
  ${jsContent}
  (function() {
    let config = {
      ethereum: {
        chainId: ${chainId},
        rpcUrl: '${rpcUrl}',
        address:'${address}'
    }
    };
    trustwallet.ethereum = new trustwallet.Provider(config);
    trustwallet.postMessage = (jsonString) => {
      window.ReactNativeWebView?.postMessage(JSON.stringify(jsonString))
    };
    window.ethereum = trustwallet.ethereum;
    const EIP6963Icon ='${Constants.APP_LOGO_BASE64}'
      
      const info = {
        uuid: crypto.randomUUID(),
        name: 'QubeticsWallet',
        icon: EIP6963Icon,
        rdns: 'com.wallet.qubetics',
      };

      const announceEvent = new CustomEvent('eip6963:announceProvider', {
        detail: Object.freeze({ info, provider: ethereum }),
      });

      window.dispatchEvent(announceEvent);

      window.addEventListener('eip6963:requestProvider', () => {
         window.dispatchEvent(announceEvent);
      });
})();
  `;
    // console.log("source:::::", source);
    return source;
  };

  /******************************************************************************************/
  ConvertBase(num) {
    return {
      from: function (baseFrom) {
        return {
          to: function (baseTo) {
            return parseInt(num, baseFrom).toString(baseTo);
          },
        };
      },
    };
  }

  /******************************************************************************************/
  hex2dec(num) {
    return this.ConvertBase(num).from(16).to(10);
  }

  /******************************************************************************************/
  async getNonceAndGas(amount, coinsym) {
    const nonceReq = {
      amount: amount,
    };
    console.log(" this.state.selectedNetwork:::::", this.state.selectedNetwork);
    console.log(" amount:::::", amount);
    console.log(" coinsym:::::", coinsym);

    if (this.state.selectedNetwork == "Ethereum") {
      try {
        const Totalfee = await getTotalGasFee();
        const gasLimit = this.hex2dec(this.state.signingData.object.gas);
        const value = exponentialToDecimal(
          Totalfee * this.state.gasFeeMultiplier * gasLimit
        );
        console.log(" value:::::", value);
        const fee = parseFloat(value).toFixed(8);
        console.log(" fee:::::", fee);
        const non = await getNonce();
        console.log(" non:::::", non);
        this.nonce = non;
        this.setState({
          isVisible: true,
          gasEstimate: gasLimit,
          gasPrice: Totalfee,
          calculatedFee: fee,
        });
      } catch (error) {
        console.log(" error:::::", error);
      }
    } else {
      getData(Constants.ACCESS_TOKEN).then((token) => {
        let gasEstimationReq = {
          from: Singleton.getInstance().defaultEthAddress,
          to: Singleton.getInstance().defaultEthAddress,
          amount: "",
        };
        this.props
          .requestNonce({
            url: `${this.state.selectedNetwork == "Binance"
              ? "binancesmartchain"
              : "polygon"
              }/${coinsym}/nonce`,
            coinSymbol: coinsym,
            nonceReq,
            token,
          })
          .then((result) => {
            console.log("requestNonce==result:::::", result);

            this.nonce = result.data.nonce;
            this.props
              .requestGasEstimation({
                url:
                  this.state.selectedNetwork == "Binance"
                    ? "binancesmartchain/bnb/gas_estimation"
                    : `polygon/pol/gas_estimation`,
                coinSymbol:
                  this.state.selectedNetwork == "Binance" ? "bnb" : "pol",
                gasEstimationReq,
                token,
              })
              .then((res) => {
                console.log("gasPriceDetail: bnb", res);
                console.log("this.hex2dec(this.state.signingData.object.gas)===-=-==-=-==", this.hex2dec(this.state.signingData.object.gas))
                var fast = res.resultList.propose_gas_price > 3 ? res.resultList.propose_gas_price : 3;
                var initialValue =
                  10 ** 9 * fast * this.hex2dec(this.state.signingData.object.gas);
                var fee = initialValue * gasFeeMultiplier;
                console.log("initialValue===>", initialValue + " " + fee);
                this.setState({
                  gas: res,
                  isVisible: true,
                  calculatedFee: fee.toFixed(5),
                  gasPrice: fast,
                  isLoading: false
                });
              })
              .catch((err) => {
                console.log("Error: ", err);
                this.setState({ isLoading: false });
              });
          })
          .catch((err) => {
            console.log("Error: ", err);
            this.setState({ isLoading: false });
          });
      });
    }
  }

  /******************************************************************************************/
  async signRawTxn(pin) {
    //isVisible: true,
    let pKey = ""
    try {

      this.setState({ isLoading: true, });
      pKey = await getEncryptedData(`${Singleton.getInstance().defaultEthAddress}_pk`, pin);
    } catch (error) {
      this.setState({ isLoading: false, });
    }
    // console.log("pKey>>>>>", pKey, "address>>>", Singleton.getInstance().defaultEthAddress, pin);

    const gasLimit = this.state.signingData.object.gas; // in hex
    const gasPrice =
      this.state.selectedNetwork == "Binance"
        ? IS_PRODUCTION == 0
          ? 10 * 10 ** 9
          : this.state.gasPrice
        : this.state.gasPrice; // in hex
    const amount = (
      this.hex2dec(this.state.signingData.object.value) /
      10 ** 18
    ).toString();
    const nonce = this.nonce;
    Singleton.getInstance()
      .getsignRawTxnDapp(
        pKey,
        amount,
        gasPrice,
        gasLimit,
        nonce,
        this.state.signingData.object.to,
        this.state.signingData.object.from,
        this.state.signingData.object.data,
        this.state.selectedNetwork == "Ethereum"
          ? "eth"
          : this.state.selectedNetwork == "Binance"
            ? "bnb"
            : "pol"
      )
      .then((serializedTx) => {
        console.log("this.serializedTx-------", serializedTx);
        if (serializedTx != null) {
          this.setState({ isLoading: true, });
          this.sendCoin(serializedTx);
        } else {
          this.setState({ isLoading: false });
          let js = `trustwallet.ethereum.sendError(${this.state.signingData.id
            }, 'Something went wrong.')`;
          this.webview?.injectJavaScript(js);
        }
      }).catch(err => {
        this.setState({ isLoading: false });
      });
  }

  /******************************************************************************************/
  sendCoin(serializedTx) {
    const nonce = this.nonce;
    const tx_raw = serializedTx;
    const from = this.state.signingData.object.from;
    const to = this.state.signingData.object.to;
    const amount = (
      this.hex2dec(this.state.signingData.object.value) /
      10 ** 18
    ).toString();
    const gas_estimate = this.hex2dec(this.state.signingData.object.gas);
    const eth_gas_price = this.state.gasPrice;
    const coinsym =
      this.state.selectedNetwork == "Ethereum"
        ? "eth"
        : this.state.selectedNetwork == "Binance"
          ? "bnb"
          : "pol";
    const coinType =
      this.state.selectedNetwork == "Ethereum"
        ? "ethereum"
        : this.state.selectedNetwork == "Binance"
          ? "binancesmartchain"
          : "polygon";
    const fee = toFixedExp(parseFloat(this.state.calculatedFee), 8);
    const sendCoinReq = {
      nonce: nonce,
      tx_raw: tx_raw,
      from: from,
      to: to,
      amount:
        this.hex2dec(this.state.signingData.object.value) == 0 ? fee : amount,
      add_amount:
        this.hex2dec(this.state.signingData.object.value) == 0 ? 1 : 0,
      gas_estimate: gas_estimate,
      gas_price:
        this.state.selectedNetwork == "Binance"
          ? IS_PRODUCTION == 0
            ? 10 * 10 ** 9
            : eth_gas_price
          : eth_gas_price,
      tx_type: "dapp",
    };
    console.log("The sendCoinReq txn is ", sendCoinReq);
    getData(Constants.ACCESS_TOKEN).then((token) => {
      console.log("The raw txn is " + tx_raw);
      this.props
        .requestSendCoin({
          url: `${coinType}/${coinsym}/send`,
          coinSymbol: coinsym,
          sendCoinReq,
          token,
        })
        .then((res) => {
          console.log(
            "-----------------------Response------------",
            res.tx_hash
          );
          this.setState({ isVisible: false, isLoading: false });
          let mmid = this.state.signingData.id;
          let hash = res.tx_hash;
          let js = `trustwallet.ethereum.sendResponse(${mmid}, '${hash}')`;
          this.webview?.injectJavaScript(js);
        })
        .catch((err) => {
          console.log("Error: ", err);
          let js = `trustwallet.ethereum.sendError(${this.state.signingData.id
            }, '${err.message || err}')`;
          this.webview?.injectJavaScript(js);
          this.setState({
            isVisible: false,
            isLoading: false,
            alertTxt: err,
            showAlertDialog: true,
          });
        });
    });
  }

  /******************************************************************************************/
  calculateFee(type) {
    let res = this.state.gas;
    // console.log("response=-=--===", res)
    var fast = 0;
    if (res) {
      if (type == "slow") {
        fast = res?.resultList
          ? this.state.selectedNetwork == "Binance"
            ? Constants.network == "testnet"
              ? 10 * 10 ** 9
              : res?.resultList?.safe_gas_price > 3 ? res.resultList.safe_gas_price : 3
            : res?.resultList?.safe_gas_price
          : 0;
      } else if (type == "average") {
        fast = res?.resultList
          ? this.state.selectedNetwork == "Binance"
            ? Constants.network == "testnet"
              ? 10 * 10 ** 9
              : res?.resultList?.propose_gas_price > 3 ? res.resultList.propose_gas_price : 3
            : res?.resultList?.propose_gas_price
          : 0;
      } else {
        fast = res?.resultList
          ? this.state.selectedNetwork == "Binance"
            ? Constants.network == "testnet"
              ? 10 * 10 ** 9
              : res?.resultList?.fast_gas_price > 3 ? res.resultList.fast_gas_price : 3
            : res?.resultList?.fast_gas_price
          : 0;
      }

      // console.log("fast=-=-==", fast)
      // console.log("this.state.signingData.object=-=-==", this.state.signingData.object)

      // console.log("this.hex2dec(this.state.signingData.object.gas-====", this.hex2dec(this.state.signingData.object.gas))
      var initialValue = fast * 10 ** 9 * parseFloat(this.hex2dec(this.state.signingData.object.gas));
      console.log("initialValue-=-=======", fast, initialValue, bigNumberSafeMath(initialValue, "*", gasFeeMultiplier))
      return toFixed(exponentialToDecimal(bigNumberSafeMath(initialValue, "*", gasFeeMultiplier)), 5);
    } else {
      return (0 * gasFeeMultiplier).toFixed(5);
    }
  }

  /******************************************************************************************/
  onClickAction(type) {
    console.log("chk type:::::", type);
    if (type == "slow") {
      const res = this.state.gas;
      const standard =
        this.state.selectedNetwork == "Binance"
          ? Constants.network == "testnet"
            ? 10 * 10 ** 9
            : res?.resultList?.safe_gas_price > 3 ? res?.resultList?.safe_gas_price : 3
          : res?.resultList?.safe_gas_price;
      const initialValue =
        10 ** 9 * standard * this.hex2dec(this.state.signingData.object.gas);
      const fee = initialValue * gasFeeMultiplier;
      this.setState({
        selectedFeeType: 1,
        isVisible: true,
        calculatedFee: fee.toFixed(5),
        gasPrice: standard,
      });
    } else if (type == "average") {
      let res = this.state.gas;
      const fast =
        this.state.selectedNetwork == "Binance"
          ? Constants.network == "testnet"
            ? 10 * 10 ** 9
            : res?.resultList?.propose_gas_price > 3 ? res?.resultList?.propose_gas_price : 3
          : res?.resultList?.propose_gas_price;
      const initialValue =
        10 ** 9 * fast * this.hex2dec(this.state.signingData.object.gas);
      const fee = initialValue * gasFeeMultiplier;
      this.setState({
        selectedFeeType: 2,
        isVisible: true,
        calculatedFee: fee.toFixed(5),
        gasPrice: fast,
      });
    } else if (type == "fast") {
      let res = this.state.gas;
      const fast =
        this.state.selectedNetwork == "Binance"
          ? Constants.network == "testnet"
            ? 10 * 10 ** 9
            : res?.resultList?.fast_gas_price > 3 ? res?.resultList?.fast_gas_price : 3
          : res?.resultList?.fast_gas_price
      const initialValue =
        10 ** 9 * fast * this.hex2dec(this.state.signingData.object.gas);
      const fee = initialValue * gasFeeMultiplier;
      this.setState({
        selectedFeeType: 3,
        isVisible: true,
        calculatedFee: fee.toFixed(5),
        gasPrice: fast,
      });
    }
  }

  /******************************************************************************************/
  calculateFiat(type) {
    const res = this.state.gas;
    var fast = 0;
    if (res) {
      if (type == "slow") {
        fast = res?.resultList
          ? this.state.selectedNetwork == "Binance"
            ? Constants.network == "testnet"
              ? 10 * 10 ** 9
              : res?.resultList?.safe_gas_price > 3 ? res?.resultList?.safe_gas_price : 3
            : res?.resultList?.safe_gas_price
          : 0;
      } else if (type == "average") {
        fast = res?.resultList
          ? this.state.selectedNetwork == "Binance"
            ? Constants.network == "testnet"
              ? 10 * 10 ** 9
              : res?.resultList?.propose_gas_price > 3 ? res?.resultList?.propose_gas_price : 3
            : res?.resultList?.propose_gas_price
          : 0;
      } else {
        fast = res?.resultList
          ? this.state.selectedNetwork == "Binance"
            ? Constants.network == "testnet"
              ? 10 * 10 ** 9
              : res?.resultList?.fast_gas_price > 3 ? res?.resultList?.fast_gas_price : 3
            : res?.resultList?.fast_gas_price
          : 0;
      }
      const initialValue = fast * 10 ** 9 * this.hex2dec(this.state.signingData.object.gas);
      const fee = initialValue * gasFeeMultiplier;
      if (this.state.selectedNetwork == "Binance") {
        return toFixedExp(bigNumberSafeMath(fee, "*", this.props.bnbFiatPrice), 4);
      } else {
        return toFixedExp(bigNumberSafeMath(fee, "*", this.props.maticFiatPrice), 4);
      }
    }
  }

  /******************************************************************************************/
  renderSlowStandardFast() {
    const { selectedNetwork } = this.state;
    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15, }}>
          <View>
            <TouchableOpacity
              onPress={() => this.onClickAction("slow")}
              style={[
                styles.feeView,
                {
                  borderColor:
                    this.state.selectedFeeType == 1
                      ? ThemeManager.colors.primaryColor
                      : ThemeManager.colors.borderColor11,
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle2,
                  { color: ThemeManager.colors.blackWhiteText, marginTop: 3 },
                ]}
              >
                {" "}
                {this.calculateFee("slow")}{" "}
                {selectedNetwork == "Binance" ? "BNB" : "POL"}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle2,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {this.calculateFiat("slow")}{" "}
                {Singleton.getInstance().CurrencySelected}
              </Text>
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              style={{
                color:
                  this.state.selectedFeeType == 1
                    ? ThemeManager.colors.primaryColor
                    : ThemeManager.colors.blackWhiteText,
                marginTop: 5,
                textAlign: "center",
                fontSize: 14,
                fontFamily: Fonts.dmMedium,
              }}
            >
              {sendTrx.slow}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => this.onClickAction("average")}
              style={[
                styles.feeView,
                {
                  borderColor:
                    this.state.selectedFeeType == 2
                      ? ThemeManager.colors.primaryColor
                      : ThemeManager.colors.borderColor11,
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle2,
                  { color: ThemeManager.colors.blackWhiteText, marginTop: 3 },
                ]}
              >
                {" "}
                {this.calculateFee("average")}{" "}
                {selectedNetwork == "Binance" ? "BNB" : "POL"}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle2,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {this.calculateFiat("average")}{" "}
                {Singleton.getInstance().CurrencySelected}
              </Text>
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              style={{
                color:
                  this.state.selectedFeeType == 2
                    ? ThemeManager.colors.primaryColor
                    : ThemeManager.colors.blackWhiteText,
                marginTop: 5,
                textAlign: "center",
                fontSize: 14,
                fontFamily: Fonts.dmMedium,
              }}
            >
              {sendTrx.Average}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => this.onClickAction("fast")}
              style={[
                styles.feeView,
                {
                  borderColor:
                    this.state.selectedFeeType == 3
                      ? ThemeManager.colors.primaryColor
                      : ThemeManager.colors.borderColor11,
                },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle2,
                  { color: ThemeManager.colors.blackWhiteText, marginTop: 3 },
                ]}
              >
                {" "}
                {this.calculateFee("fast")}{" "}
                {selectedNetwork == "Binance" ? "BNB" : "POL"}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle2,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {this.calculateFiat("fast")}{" "}
                {Singleton.getInstance().CurrencySelected}
              </Text>
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              style={{
                color:
                  this.state.selectedFeeType == 3
                    ? ThemeManager.colors.primaryColor
                    : ThemeManager.colors.blackWhiteText,
                marginTop: 5,
                textAlign: "center",
                fontSize: 14,
                fontFamily: Fonts.dmMedium,
              }}
            >
              {sendTrx.Fast}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  /******************************************************************************************/
  validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1, 3}\\.){3}\\d{1, 3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  /******************************************************************************************/
  setUrl() {
    console.log("this.state.enteredURL:::::", this.state.enteredURL);
    if (this.validURL(this.state.enteredURL)) {
      if (!this.state.enteredURL.startsWith("http")) {
        this.setState({ url: "https://" + this.state.enteredURL });
      } else {
        this.setState({ url: this.state.enteredURL });
        this.webview?.reload();
      }
    } else {
      this.setState({
        url: "https://www.google.com/search?q=" + this.state.enteredURL,
      });
    }
  }

  switchChainScript(chainId, rpcUrl) {
    const script = `(async () => {
      try {
        let changeEVMConfig = {
        ethereum: {
          address: "${Singleton.getInstance().defaultEthAddress}",
          chainId: ${web3.utils.toHex(chainId)},
          rpcUrl: "${rpcUrl}"
        }
      };
      ethereum.setConfig(changeEVMConfig);
      trustwallet.ethereum.emitChainChanged('${web3.utils.toHex(chainId)}');
      true;
  } catch (error) {
  console.error('Error switching chain:', error);
  trustwallet.ethereum.sendError(null, "Error switching chain:");
}
})();`
    return script
  }
  /******************************************************************************************/
  onChangeText(text) {
    if (Constants.NO_SPACE_REGEX.test(text)) {
      this.setState({ enteredURL: text });
    }
  }

  /******************************************************************************************/
  closeModal() {
    const js = `trustwallet.ethereum.sendError(${this.state.signingData?.id}, 'Cancelled')`;
    console.log("----------------js-----------", js);
    this.webview?.injectJavaScript(js);
    this.setState({ isVisible: false });
  }

  /******************************************************************************************/
  async onPressFav() {
    let favouriteData = await getData(Constants.FAVORITE);
    console.log("favouriteData::::::", favouriteData);
    if (favouriteData) {
      console.log("in iffffff");
      favouriteData = JSON.parse(favouriteData);
      const isPresent = favouriteData?.find((url) => {
        const newUrl = url.url.slice(0, url.url.indexOf("/", 8));
        if (this.state.enteredURL.includes("google.com")) {
          if (this.state.enteredURL == url.url) {
            return url;
          }
        } else {
          if (this.state.enteredURL?.includes(newUrl)) {
            return url;
          }
        }
      });
      console.log("chk is present:::::", isPresent);
      if (isPresent) {
        const newfilteredData = favouriteData.filter((url) => {
          const newUrl = url.url.slice(0, url.url.indexOf("/", 8));
          if (this.state.enteredURL.includes("google.com")) {
            if (!(this.state.enteredURL == url.url)) {
              return url;
            }
          } else {
            if (!this.state.enteredURL?.includes(newUrl)) {
              return url;
            }
          }
        });
        console.log("chk newFiltered data::::::", newfilteredData);
        saveData(Constants.FAVORITE, JSON.stringify(newfilteredData));
        this.setState({ isFavorite: false });
        return;
      } else {
        const iconUrl = await this.getIconUrl(this.state.enteredURL);
        console.log("iconUrl", iconUrl);
        favouriteData.push({
          url: this.state.enteredURL,
          title: this.state.urlTitle,
          iconUrl: iconUrl,
        });
        console.log("chk fav data::::::", favouriteData);
        saveData(Constants.FAVORITE, JSON.stringify(favouriteData));
        this.setState({ isFavorite: true });
      }
    } else {
      console.log("in elseeeeeee");
      let favData = [];
      const iconUrl = await this.getIconUrl(this.state.enteredURL);
      console.log("iconUrl", iconUrl);
      favData.push({
        url: this.state.enteredURL,
        title: this.state.urlTitle,
        iconUrl: iconUrl,
      });
      saveData(Constants.FAVORITE, JSON.stringify(favData));
      this.setState({ isFavorite: true });
    }
  }

  /******************************************************************************************/
  getIconUrl(url) {
    console.log("chk url:::::", url);
    const newStr = url.slice(0, url.indexOf("/", 8));
    return new Promise((resolve, reject) => {
      fetch(`${imageBaseURl}${newStr}`, { method: "GET" })
        .then(async (res) => {
          let jsonVal = await res.json();
          if (jsonVal?.icons?.length > 0) {
            resolve({ icon: jsonVal.icons[0].url });
          } else {
            resolve({ icon: "" });
          }
        })
        .catch((err) => {
          resolve({ icon: "" });
        });
    });
  }

  /******************************************************************************************/
  checkFavorite() {
    getData(Constants.FAVORITE).then((res) => {
      if (res != null) {
        const favArray = JSON.parse(res);
        this.setState({ favoriteArray: favArray });
        const selectedData =
          Array.isArray(favArray) &&
          favArray.find((el) => {
            let newStr = el.url.slice(8, el.url.indexOf("/", 8));
            if (this.state.enteredURL.includes("google.com")) {
              return this.state.enteredURL == el.url;
            } else {
              return this.state.enteredURL?.includes(newStr);
            }
          });
        if (selectedData != null) {
          this.setState({ isFavorite: true });
        } else {
          this.setState({ isFavorite: false });
        }
      }
    });
  }


  async addToHistory(url, urlTitle) {
    clearTimeout(this.historyTimeout)
    this.historyTimeout = setTimeout(async () => {
      let historyData = await getData(Constants.DAPP_HISTORY);
      historyData = historyData == null ? [] : JSON.parse(historyData);
      historyData = [{
        url: url,
        title: urlTitle,
        iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${this.cleanUrl(url)}&size=128`,
        timestamp: new Date().getTime(),
      }, ...historyData];
      console.log("historyData>>>", historyData);

      if (historyData?.length > 50) {
        historyData = historyData.slice(0, 50)
      }

      saveData(Constants.DAPP_HISTORY, JSON.stringify(historyData));
    }, 1200);
  }

  cleanUrl = (url) => {
    // clean url
    let cleanedUrl = url.includes("https")
      ? url.slice(8)
      : url.includes("http")
        ? url.slice(7)
        : url;
    cleanedUrl = cleanedUrl.includes("/")
      ? cleanedUrl.split("/")[0]
      : cleanedUrl;
    return cleanedUrl;
  };


  /******************************************************************************************/
  onShouldStartLoadWithRequest = () => {
    return true;
  };

  /******************************************************************************************/
  render() {

    return (
      <>
        <ImageBackground
          source={ThemeManager.ImageIcons.mainBgImgNew}
          style={{ backgroundColor: ThemeManager.colors.mainBgNew }}
        >
          <View
            style={{
              ...styles.dapHeader,
              paddingTop: Platform.OS == 'ios'
                ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
                  ? getDimensionPercentage(0)
                  : getDimensionPercentage(30)

                : getDimensionPercentage(30)
            }}
          >
            <TouchableOpacity
              disabled={this.state.isButtonDisabled}
              onPress={() => {
                Singleton.bottomBar?.navigateTab("DefiAccessMain");
                Actions.jump("DefiAccessMain");
                // Actions.pop();
                setTimeout(() => {
                  this.setState({ isButtonDisabled: false });
                }, 2000);
              }}
              style={styles.dapBackView}
            >
              <Image
                style={{
                  marginRight: 2,
                  tintColor: ThemeManager.colors.blackWhiteText,
                }}
                source={Images.arrow_back}
              />
            </TouchableOpacity>


            <View style={[styles.searchMainView, { width: "90%" }]}>
              <View
                style={{
                  ...styles.searchInnerView,
                  borderColor: ThemeManager.colors.searchBorderColor,
                }}
              >
                <TextInput
                  style={{
                    ...styles.searchText,
                    color: ThemeManager.colors.TextColor,
                    width: this.state.isSearchFocus ? "82%" : "95%",
                  }}
                  placeholder="https://"
                  value={this.state.enteredURL}
                  onChangeText={(text) => {
                    this.onChangeText(text);
                  }}
                  onBlur={() => {
                    this.setUrl();
                    this.setState({ isSearchFocus: false });
                  }}
                  onFocus={() => {
                    this.setState({ isSearchFocus: true });
                  }}
                  autoCorrect={false}
                  autoCapitalize={"none"}
                  allowFontScaling={false}
                />
                {this.state.isSearchFocus && (
                  <TouchableOpacity
                    style={[styles.searchBtn]}
                    onPress={() => {
                      this.setState({ enteredURL: "" });
                    }}
                  >
                    <Image
                      style={{
                        tintColor: ThemeManager.colors.TextColor,
                      }}
                      source={Images.close_icon}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* <TouchableOpacity
              style={[styles.coinView]}
              onPress={() => {
                this.setState({ isNetworkModalVisible: true });
              }}
            >
              <FastImage
                style={styles.coinImg}
                source={{
                  uri: this.state.selectedNetworkImageUri,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </TouchableOpacity> */}
          </View>
        </ImageBackground>

        <View style={{ flex: 1 }}>
          {this.state.jsContent !== "" && (
            <WebView
              forceDarkOn={true}
              setSupportMultipleWindows={false}
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
              // onStartShouldSetResponder={() => this.state.isNetworkModalVisible ? false : true}
              ref={(ref) => (this.webview = ref)}
              source={{ uri: this.state.url }}
              injectedJavaScriptBeforeContentLoaded={this.state.jsContent}
              style={{ flex: 1 }}
              content
              onMessage={this.onMessage}
              onNavigationStateChange={(navState) => {
                console.log(
                  this.state.chainId,
                  "chk navState.url:::::",
                  navState.url
                );
                this.setState({
                  canGoBack: navState.canGoBack,
                  canGoForward: navState.canGoForward,
                  enteredURL: navState.url,
                  urlTitle: navState.title,
                });
                this.addToHistory(navState.url, navState.title)
              }}
              startInLoadingState={false}
              sendCookies
              javascriptEnabled
              allowsInlineMediaPlayback
              useWebkit
              testID={"browser-webview"}
              originWhitelist={["http://*", "https://*", "intent://*"]}
            // originWhitelist={['http://*', 'https://*', 'intent://*']}
            // originWhitelist={["*"]}
            />
          )}
          {this.state.isNetworkModalVisible && (
            <View
              style={[
                styles.dropdown,
                { backgroundColor: ThemeManager.colors.searchBg },
              ]}
            >
              {this.state.isShowEth && (
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    this.onPressEth();
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{ marginRight: 10, width: 20, height: 20 }}
                      source={{
                        uri: Constants.ETH_Img,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.textStyle,
                        color: ThemeManager.colors.settingsText,
                      }}
                    >
                      {browser.Ethereum}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {this.state.isShowBnb && (
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    this.onPressBnb();
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <FastImage
                      style={{
                        marginRight: 10,
                        width: 20,
                        height: 20,
                        borderRadius: 45,
                      }}
                      source={{
                        uri: Constants.BSC_Img,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.textStyle,
                        color: ThemeManager.colors.settingsText,
                      }}
                    >
                      {browser.Bnb}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {this.state.isShowMatic && <TouchableOpacity
                style={{ padding: 10 }}
                onPress={() => {
                  this.onPressMatic();
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <FastImage
                    style={{ marginRight: 10, width: 20, height: 20 }}
                    source={{
                      uri: Constants.MATIC_Img,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.textStyle,
                      color: ThemeManager.colors.settingsText,
                    }}
                  >
                    {browser.Matic}
                  </Text>
                </View>
              </TouchableOpacity>}
            </View>
          )}
        </View>
        {/* /****************************************************************************************** */}
        <View style={styles.ViewStyle1}>
          <View style={styles.ViewStyle2}>
            <TouchableOpacity
              style={styles.ViewStyle3}
              onPress={() => this.webview?.goBack()}
              disabled={!this.state.canGoBack}
            >
              <Image
                style={[
                  {
                    width: 25,
                    height: 25,
                    tintColor: ThemeManager.colors.statusBarColor1,
                  },
                  this.state.canGoBack ? { opacity: 1 } : { opacity: 0.2 },
                ]}
                source={Images.left_arrow}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ViewStyle3}
              onPress={() => this.webview?.goForward()}
              disabled={!this.state.canGoForward}
            >
              <Image
                style={[
                  {
                    transform: [{ rotate: "180deg" }],
                    width: 25,
                    height: 25,
                    tintColor: ThemeManager.colors.statusBarColor1,
                  },
                  this.state.canGoForward ? { opacity: 1 } : { opacity: 0.2 },
                ]}
                source={Images.left_arrow}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ViewStyle4}>
            <TouchableOpacity
              style={styles.ViewStyle3}
              onPress={() => this.webview?.reload()}
            >
              <Image
                style={{
                  width: 25,
                  height: 25,
                  tintColor: ThemeManager.colors.statusBarColor1,
                }}
                source={Images.reload}
              />
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS != "ios" && (
          <LoaderView isLoading={this.state.isLoading} />
        )}
        {/* </SafeAreaView> */}

        {/* *************************************************** Confirm Transaction ********************************************* */}
        <Modal
          onRequestClose={() => this.closeModal()}
          visible={this.state.isVisible}
          animationType="fade"
          style={{ margin: 0, justifyContent: "flex-end" }}
        >
          {this.state.signingData != "" && (
            <>
              <BlurView
                style={styles.blurView}
                blurType="Dark"
                blurAmount={4}
              // reducedTransparencyFallbackColor="white"
              />
              <View
                style={{
                  ...styles.modalView,
                  // borderColor: ThemeManager.colors.borderColor,
                  // backgroundColor:'transparent',
                }}
              >
                <View
                  style={{
                    ...styles.modalinner,
                    borderColor: ThemeManager.colors.borderColor,
                    backgroundColor: ThemeManager.colors.whiteBlacktext,
                  }}
                >
                  <View style={styles.ViewStyle5}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        ...styles.titleSign,
                        color: ThemeManager.colors.blackWhiteText,
                      }}
                    >
                      {browser.confirmTransaction}
                    </Text>
                    <TouchableOpacity
                      style={styles.touchableStyle}
                      onPress={() => {
                        this.closeModal();
                      }}
                    >
                      <Image
                        style={{
                          tintColor: ThemeManager.colors.blackWhiteText,
                        }}
                        source={Images.close_icon}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.vwSignTransaction}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textLbl,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      {browser.to}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.txtValue,
                        { color: ThemeManager.colors.placeholderColorNew },
                      ]}
                    >
                      {this.state.signingData.object.to}
                    </Text>
                  </View>

                  <View style={styles.vwSignTransaction}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textLbl,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      {browser.From}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.txtValue,
                        { color: ThemeManager.colors.placeholderColorNew },
                      ]}
                    >
                      {this.state.signingData.object.from}
                    </Text>
                  </View>

                  {this.state.selectedNetwork != "Ethereum" ? (
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textLbl,
                        {
                          color: ThemeManager.colors.blackWhiteText,
                          marginTop: 15,
                        },
                      ]}
                    >
                      {sendTrx.transactionFee}
                    </Text>
                  ) : null}
                  {this.state.selectedNetwork == "Ethereum"
                    ? null
                    : this.renderSlowStandardFast()}
                  {this.state.selectedNetwork == "Ethereum" ? (
                    <View style={[styles.vwSignTransaction]}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.textLbl,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {browser.gasFee}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.txtValue,
                          { color: ThemeManager.colors.placeholderColorNew, marginLeft: dimen(6) },
                        ]}
                      >
                        {this.state.calculatedFee}{" "}
                        {this.state.selectedNetwork == "Ethereum"
                          ? "ETH"
                          : this.state.selectedNetwork == "Binance"
                            ? "BNB"
                            : "POL"}{" "}{`(${Singleton.getInstance().CurrencySymbol} ${toFixedExp(
                              Number(this.state.calculatedFee) *
                              Number(this.props.ethFiatPrice),
                              4
                            )})`}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.vwSignTransaction}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textLbl,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      {browser.total}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.txtValue,
                        { color: ThemeManager.colors.placeholderColorNew },
                      ]}
                    >
                      {toFixed(
                        bigNumberSafeMath(
                          this.hex2dec(this.state.signingData.object.value) /
                          10 ** 18,
                          "+",
                          this.state.calculatedFee
                        ),
                        8
                      )}{" "}
                      {this.state.selectedNetwork == "Ethereum"
                        ? "ETH"
                        : this.state.selectedNetwork == "Binance"
                          ? "BNB"
                          : "POL"}
                    </Text>
                  </View>
                  <Button
                    btnstyle={{ borderRadius: 6, marginBottom: 0 }}
                    buttontext={merchantCard.submit}
                    onPress={() => {
                      // this.setState({ isLoading: true });
                      // setTimeout(() => {
                      // this.signRawTxn();
                      this.setState({ isVisible: false, pinModal: true });
                      // }, 1000);
                    }}
                  />
                </View>
              </View>
              <LoaderView isLoading={this.state.isLoading} />
            </>
          )}
        </Modal>

        {/* /****************************************************************************************** */}
        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.pinModal}
          onRequestClose={() => {
            this.setState({ pinModal: false });
          }}
        >
          <View style={{ flex: 1 }}>
            <EnterPinForTransaction
              onBackClick={() => {
                this.setState({ pinModal: false });
              }}
              checkBiometric={true}
              closeEnterPin={(pin) => {
                this.setState({ pinModal: false }, () => {
                  setTimeout(async () => {
                    if (
                      this.state.msgType == "signPersonalMessage" ||
                      this.state.msgType == "signMessage"
                    ) {
                      const message = this.state.signedData;
                      let mmid = message.id;
                      let pKey = "";
                      try {
                        pKey = await getEncryptedData(
                          `${Singleton.getInstance().defaultEthAddress}_pk`,
                          pin
                        );
                      } catch (error) { }

                      let signedMessage =
                        await Singleton.getInstance().signPersonalMessage(
                          message?.object?.data,
                          pKey
                        );
                      let js = `trustwallet.${message?.network}.sendResponse(${mmid}, "${signedMessage}")`;
                      this.webview?.injectJavaScript(js);
                    } else if (this.state.msgType == "signTypedMessage") {
                      const message = this.state.signedData;
                      let approvalParam = JSON.parse(message?.object?.raw);
                      let permitDetails = approvalParam.types.PermitDetails;
                      let permitSingle = approvalParam.types.PermitSingle;


                      let typeArr = Object.keys(approvalParam.types)
                      let newTypes = {}
                      typeArr.map(el => {
                        if (el != "EIP712Domain") {
                          newTypes[el] = approvalParam.types[el]

                        }
                      })

                      let newParams = {
                        domain: approvalParam.domain,
                        types: newTypes,
                        message: approvalParam.message,
                      };

                      console.log("---------newParams:::::", newParams);
                      setTimeout(async () => {
                        // getData(`${Singleton.getInstance().defaultEthAddress}_pk`).then(
                        //   async (privateKey) => {
                        let pvt_key = "";
                        try {
                          pvt_key = await getEncryptedData(
                            `${Singleton.getInstance().defaultEthAddress}_pk`,
                            pin
                          );
                        } catch (error) { }
                        Singleton.getInstance()
                          .dappApprovalHash(pvt_key, newParams)
                          .then((res) => {
                            console.log("res::::::::", res);
                            let mmid = message.id;
                            let js = `trustwallet.ethereum.sendResponse(${mmid}, "${res}")`;
                            this.webview?.injectJavaScript(js);
                            this.setState({ loading: false });
                          })
                          .catch((err) => {
                            console.log("err::::::::", err);
                          });
                        //   }
                        // );
                      }, 200);
                    } else {
                      this.signRawTxn(pin);
                    }
                  }, 1500);
                });
              }}
            />
          </View>
        </Modal>
      </>
    );
  }
}

export default connect(null, {
  requestNonce,
  requestgasprice,
  requestGasEstimation,
  requestSendCoin,
  requestGasLimitForDapp,
})(DappBrowserNew);
