/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Share,
  Clipboard,
  BackHandler,
  Platform,
  ImageBackground,
} from "react-native";
import {
  Header,
  TransactionList,
  AppAlert,
  Button,
  TransactModal,
  LoaderView,
  HeaderMain,
} from "../../common";
import {
  CommaSeprator1,
  exponentialToDecimal,
  getCryptoAddress,
  getData,
  saveData,
  toFixedExp,
} from "../../../Utils/MethodsUtils";
import {
  getTransactionList,
  getSign,
  Updatebalance,
  getUserBalance,
  getOnOffRampCoins
} from "../../../Redux/Actions";
import styles from "./TransactionHistoryStyle";
import { Actions } from "react-native-router-flux";
import { Colors, Fonts, Images } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
import { connect } from "react-redux";
import Singleton from "../../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../../Constants";
import { LanguageManager } from "../../../../LanguageManager";
import LinearGradient from "react-native-linear-gradient";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import { moderateScale, verticalScale } from "../../../layouts/responsive";
import images from "../../../theme/Images";
import CustomButton from "../../subcommon/atoms/customButton";
import { color } from "react-native-reanimated";
import colors from "../../../theme/Colors";
import { getWatchList, updateWatchList } from "../../../Redux/Actions";
import DeviceInfo from 'react-native-device-info';
import PortfolioButton from "../../subcommon/atoms/PortfolioButton";
import GraphComponent from "../../common/GraphComponent";
import { is } from "../../../../ios/trust-min";

class TransactionHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      hideBalance: false,
      showPhrase: false,
      selectedCoin: this.props.selectedCoin,
      isLoading: false,
      transactionList: [],
      showAlertDialog: false,
      isSwapAvailable: true,
      alertTxt: "",
      selectedIndex: null,
      totalRecords: "",
      loadList: false,
      page: 1,
      limit: 25,
      isDisable: false,
      isSelectedWishList: !!this.props.selectedCoin?.coin?.watchlist_data,
      dataObj: {
        status: "",
        coin_id: this.props.selectedCoin.coin_id,
        coin_type: this.props.selectedCoin.coin_symbol,
        coin_family: [this.props.selectedCoin.coin_family],
        trnx_type: "",
        from_date: "",
        to_date: "",
        addrsListKeys: [this.props.selectedCoin.wallet_address],
        page: 1,
        limit: 25,
      },
      showSuccess: false,
      disabled: false,
      sign: "",
      balance: this.props.selectedCoin?.balance,
      exactBalance: 0,
      buttonClicked: false,
      showFullGraph: false,
      graphData: { "graph_pair": "", "graph_source": "" }
    };
  }

  //******************************************************************************************/
  componentDidMount() {

    console.log("this.props.selectedCoin ", this.props.selectedCoin)
    EventRegister.addEventListener("hitWalletApi", () => {
      this.fetchUpdatedBalance();
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: "",
        showModal: false,
        showSuccess: false,
      });
      Share.dismissedAction

    });

    getData("txnHistory").then((txnHistory) => {
      if (txnHistory)
        this.setState({ transactionList: JSON.parse(txnHistory) });
    });
    this.focus = this.props.navigation.addListener("didFocus", (event) => {
      this.setState({ buttonClicked: false });
      console.log("this.props.selectedCoin?.balance 3:::::", this.props.selectedCoin?.balance);
      this.backhandle = BackHandler.addEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
      );
      this.fetchTxnHistory(this.state.dataObj);
      this.fetchUpdatedBalance();
      this.setState({ selectedIndex: null, isDisable: false, disabled: false });
    });
    this.unfocus = this.props.navigation.addListener("didBlur", () => {
      this.setState({ disabled: false });
    });
    EventRegister.addEventListener("enableTouchable", (data) => {
      this.setState({ isDisable: false });
    });
  }

  getUserBalanceFunction() {
    this.setState({ isLoading: true })
    return new Promise((resolve, reject) => {
      const item = this.props.selectedCoin;
      const data = {
        wallet_address: item?.wallet_address,
        coin_id: item?.coin_id,
      };
      this.props
        .getUserBalance({ data })
        .then((res) => {
          console.log("BALANCE>>>>", res);
          this.setState({ isLoading: false })

          resolve(res == 0 ? this.state.balance : res)
        }).catch(err => {
          console.log("BALANCE_ERR>>>>", this.state.balance, err);
          this.setState({ isLoading: false })

          resolve(this.state.balance)
        })
    })
  }
  /******************************************************************************************/
  handleBackButtonClick = () => {
    Singleton.bottomBar?.navigateTab("WalletMain");
    Actions.pop();
    return true;
  };


  /******************************************************************************************/
  fetchTxnHistory(getTxnReq, fromPagination = false) {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.props
        .getTransactionList({ getTxnReq })
        .then((res) => {
          console.log("resss::::", res);
          if (res.data.length > 0) {
            this.setState({
              totalRecords: res.meta.total,
              loadList: true,
              isLoading: false,
              transactionList: fromPagination
                ? this.state.transactionList.concat(res.data)
                : res.data,
            });
          } else {
            this.setState({
              transactionList: fromPagination ? this.state.transactionList : [],
              isLoading: false,
            });
          }
        })
        .catch((e) => {
          this.setState({ isLoading: false, loadList: false });
        });
    }, 150);
  }

  /******************************************************************************************/
  componentWillUnmount() {
    this.backhandle?.remove();
    this.focus.remove();
    this.unfocus.remove();
  }

  /******************************************************************************************/
  fetchUpdatedBalance() {
    console.log("fetchbalance 1>>>");
    const item = this.props.selectedCoin;
    const data = {
      wallet_address: item?.wallet_address,
      coin_id: item?.coin_id,
    };
    this.props
      .Updatebalance({ data })
      .then((res) => {
        console.log("fetchbalance 2>>>", res);
        this.setState({ balance: res?.balance, graphData: res?.coin, isSwapAvailable: (res?.coin?.for_swap == 1 || res?.coin?.cross_chain_data != null) });
      })
      .catch((err) => {
        console.log("chk Updatebalance err::::", err);
      });
  }

  /******************************************************************************************/
  fetchNextPageData() {
    if (this.state.loadList) {
      const page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        console.log("this.state.page:::::::::after", this.state.page);
        if (this.state.transactionList.length != this.state.totalRecords) {
          console.log("here::::", 1);
          const data = {
            status: "",
            coin_id: this.props.selectedCoin.coin_id,
            coin_type: this.props.selectedCoin.coin_symbol,
            coin_family: [this.props.selectedCoin.coin_family],
            trnx_type: "",
            from_date: "",
            to_date: "",
            addrsListKeys: [this.props.selectedCoin.wallet_address],
            page: this.state.page,
            limit: this.state.limit,
          };
          this.fetchTxnHistory(data, true);
        } else {
          console.log("here::::", 11);
        }
      });
    }
  }

  /******************************************************************************************/
  shareAddress(addressTxt, address) {
    console.log('share--------');
    const symbol =
      this.state.selectedCoin.is_token == 1
        ? this.state.selectedCoin.coin_family == 2
          ? " ERC-20"
          : this.state.selectedCoin.coin_family == 1
            ? " BEP-20"
            : this.state.selectedCoin.coin_family == 4
              ? " POL ERC-20"
              : this.state.selectedCoin.coin_family == 6
                ? "TRC-20"
                : this.state.selectedCoin.coin_family == 5
                  ? " SPL(SOL)" : ""
        : Constants.COIN_INFO_BY_FAMILY[this.state.selectedCoin.coin_family].coin_symbol;
    try {
      this.setState({ isDisable: true });
      // Singleton.isCameraOpen = true;
      Singleton.isPermission = true;

      const result = Share.share({
        message:
          "Qubetics wallet\nMy " + symbol?.toUpperCase() + " Address:" + address,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      this.setState({ showAlertDialog: true, alertTxt: error.message });
    }
  }

  /******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(this.state.selectedCoin.wallet_address);
    this.setState({
      showAlertDialog: true,
      alertTxt: LanguageManager.alertMessages.walletAddressCopied,
      showSuccess: true,
    });
  };

  /******************************************************************************************/
  async navigateToTransactionScreen() {
    let balance = await this.getUserBalanceFunction()

    let selectedCoin = this.state.selectedCoin
    selectedCoin = { ...selectedCoin, balance: balance }
    if (selectedCoin.coin_family == 1 || selectedCoin.coin_family == 4 || selectedCoin.coin_family == 7) {
      Actions.currentScene != "SendBnbPol" && Actions.SendBnbPol({
        selectedCoin: selectedCoin,
        themeSelected: this.props.themeSelected,
      })
    } else if (selectedCoin.coin_family == 2) {
      Actions.currentScene != "Send" && Actions.Send({
        selectedCoin: selectedCoin,
        themeSelected: this.props.themeSelected,
      })
    } else if (selectedCoin.coin_family == 3) {
      Actions.currentScene != "SendBtc" && Actions.SendBtc({
        selectedCoin: selectedCoin,
        themeSelected: this.props.themeSelected,
      })
    } else if (selectedCoin.coin_family == 5) {
      Actions.currentScene != "SendSol" && Actions.SendSol({
        selectedCoin: selectedCoin,
        themeSelected: this.props.themeSelected,
      })
    } else if (selectedCoin.coin_family == 6) {
      Actions.currentScene != "SendTrx" && Actions.SendTrx({
        selectedCoin: selectedCoin,
        themeSelected: this.props.themeSelected,
      })

    }
  }

  /******************************************************************************************/
  getTagLabel() {
    const { selectedCoin } = this.state;
    if (selectedCoin.coin_family == 2 && selectedCoin.is_token == 1) {
      return "ERC-20";
    } else if (selectedCoin.coin_family == 1 && selectedCoin.is_token == 1) {
      return "BEP-20";
    } else if (selectedCoin.coin_family == 4 && selectedCoin.is_token == 1) {
      return "POL ERC-20";
    } else if (selectedCoin.coin_family == 6 && selectedCoin.is_token == 1) {
      return "TRC-20";
    } else if (selectedCoin.coin_family == 5 && selectedCoin.is_token == 1) {
      return "SPL";
    } else {
      return "";
    }
  }

  itemPressedOnIcon(item, index) {
    this.setState({ buttonClicked: true });
    console.log("itemPressed-----", item, index);
    const { buySell, walletMain, transactionHistory } = LanguageManager;
    console.log(walletMain.send, "chk item:::::", item);
    this.setState({ selectedIndex: index, disabled: true });
    // setTimeout(() => {
    this.setState({ showModal: false });
    if (item?.toLowerCase() == walletMain.send.toLowerCase()) {
      return this.navigateToTransactionScreen();
    } else if (item?.toLowerCase() == walletMain.receive.toLowerCase()) {
      // if (!this.state.buttonClicked) {
      Actions.currentScene != "Receive" &&
        Actions.Receive({
          selectedCoin: this.state.selectedCoin,
          themeSelected: this.state.themeSelected,
        });
      //   this.setState({ buttonClicked: true })
      //   console.log("Button clicked---!");
      //   setTimeout(() => {
      //     this.setState({ buttonClicked: false })
      //   }, 10000);
      // }
    } else if (item?.toLowerCase() == buySell.sell.toLowerCase()) {
      Actions.currentScene != "SellNew" &&
        Actions.SellNew({
          typeOfSwap: "Sell",
          selectedCoin: this.state.selectedCoin,
        });
    }
    setTimeout(() => {
      this.setState({ buttonClicked: false });
    }, 1000);
    // }, 1000);

  }

  /******************************************************************************************/
  itemPressed(item, index) {
    console.log("itemPressed----11-", item, index);

    const { buySell, walletMain } = LanguageManager;
    console.log(walletMain.send, "chk item:::::", item);
    this.setState({ selectedIndex: index, disabled: true });
    // setTimeout(() => {
    this.setState({ showModal: false });
    if (item.title?.toLowerCase() == walletMain.send.toLowerCase()) {
      return this.navigateToTransactionScreen();
    } else if (
      item.title?.toLowerCase() == walletMain.receive.toLowerCase()
    ) {
      Actions.currentScene != "Receive" &&
        Actions.Receive({
          selectedCoin: this.state.selectedCoin,
          themeSelected: this.state.themeSelected,
        });
    } else if (item.title?.toLowerCase() == buySell.buy.toLowerCase()) {
      Actions.currentScene != "BuyNew" &&
        Actions.BuyNew({
          typeOfSwap: "Buy",
          selectedCoin: this.state.selectedCoin,
        });
    } else if (item.title?.toLowerCase() == buySell.sell.toLowerCase()) {
      Actions.currentScene != "SellNew" &&
        Actions.SellNew({
          typeOfSwap: "Sell",
          selectedCoin: this.state.selectedCoin,
        });
    }
    // }, 1000);
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

  /******************************************************************************************/
  getFiatValue(bal) {
    console.log("chk bal:::::1", bal);
    if (bal > 0) {
      const NewBal =
        bal < 0.000001
          ? toFixedExp(bal, 8)
          : bal < 0.0001
            ? toFixedExp(bal, 6)
            : toFixedExp(bal, 2);
      return NewBal;
    } else return "0.00";
  }

  /******************************************************************************************/
  getFiatValueWithComma(bal) {
    console.log("chk bal:::::2", bal);
    if (bal > 0) {
      const NewBal = bal < 0.0000001 ? toFixedExp(bal, 12) :
        bal < 0.000001
          ? CommaSeprator1(bal, 8)
          : bal < 0.001
            ? CommaSeprator1(bal, 6)
            : bal < 0.01
              ? CommaSeprator1(bal, 4) : CommaSeprator1(bal, 2);
      return NewBal;
    } else return "0.00";
  }

  onPressStar() {
    console.log("chk bal:::::", this.props.selectedCoin)
    this.setState({ isLoading: true });
    this.setState({ isSelectedWishList: !this.state.isSelectedWishList })
    setTimeout(() => {

      const Arr = [];
      const data1 = {};
      data1["coin_id"] = this.props.selectedCoin.coin_id;
      (data1["address"] = getCryptoAddress(this.props.selectedCoin.coin_family)), // item.coin_family == 3 ? Singleton.getInstance().defaultBtcAddress : item.coin_family == 5 ? Singleton.getInstance().defaultLtcAddress : Singleton.getInstance().defaultEthAddress;
        (data1["status"] = !this.state.isSelectedWishList ? 0 : 1);
      Arr.push(data1);
      const data = {
        data: Arr,
      };
      console.log(data, 'data');
      this.props
        .updateWatchList({ data })
        .then((res) => {
          console.log(res, 'resresresresres');
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt:
              LanguageManager.alertMessages.watchlistUpdatedSuccessfully,
            isPop: true,
            showSuccess: true,

          });


        })
        .catch((err) => {
          this.setState({ isSelectedWishList: false })
          this.setState({
            isLoading: false,
            alertTxt: err,
            showSuccess: false,
          });
        });
    }, 150);
  }


  getLastSelectedCoins = async () => {
    try {
      const address = Singleton.getInstance().defaultEthAddress || Singleton.getInstance().defaultBnbAddress
      const result = await getData(Constants.CROSS_CHAIN_LAST_PAIRS)
      const data = JSON.parse(result)
      return { from: data?.[address]?.from || "1", to: data?.[address]?.to || "2" }
    } catch (error) {
      return { from: "1", to: "2" }
    }
  }

  saveLastSelectedCoins = async (from, to) => {
    const address = Singleton.getInstance().defaultEthAddress || Singleton.getInstance().defaultBnbAddress
    let data = await getData(Constants.CROSS_CHAIN_LAST_PAIRS)
    data = data ? JSON.parse(data) : {}
    const savedCoin = JSON.stringify({ ...data, [address]: { from, to } })
    console.log("savedCoin>>>>", savedCoin);
    saveData(Constants.CROSS_CHAIN_LAST_PAIRS, savedCoin)

    setTimeout(() => {
      this.setState({ isLoading: false }, () => {
        Actions.jump("Swap")
      })
    }, 1000)
  }

  /******************************************************************************************/

  render() {
    const { walletMain, sendTrx } = LanguageManager;
    const { selectedCoin } = this.state;
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <View style={{ flex: 1 }}>
          <HeaderMain
            backCallBack={() => {
              Singleton.bottomBar?.navigateTab("WalletMain");
              Actions.jump("WalletMain");
            }}
            // bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
            BackButtonText={`${selectedCoin.coin_name.toString().length > 12
              ? selectedCoin.coin_name.substring(0, 10) + "..."
              : selectedCoin.coin_name
              } (${selectedCoin.coin_symbol?.toUpperCase()})`}
            imgSecond={
              // selectedCoin?.coin?.watchlist_data == null || !this.state.isSelectedWishList
              //   ? images.ic_star_gray :
              //   images.ic_star_active

              this.state.isSelectedWishList
                ? images.ic_star_active
                : images.ic_star_gray
              // this.props.watchlist_data == !null ?  images.ic_star_gray :images.ic_star_active

              // this.state.isSelect == true
              // ? images.ic_star_active
              // : images.ic_star_gray
            }
            imgSecondStyle={{
              tintColor: this.state.isSelectedWishList
                ? ThemeManager.colors.primaryColor
                : ThemeManager.colors.blackWhiteText,
            }}
            imgNew={images.graphIcon}
            onPressImgNew={() => {
              if (this.state.graphData.graph_pair) {
                this.setState({ showFullGraph: true })
              } else {
                this.setState({ showAlertDialog: true, alertTxt: "No data available" });
              }
            }}
            imgSecondTouchableProps={{
              disabled: Singleton.getInstance().isMakerWallet,
            }}
            onPressIcon={() => this.onPressStar()}
          />
          <View style={[styles.coinInfoTextt]}>
            {/* <LinearGradient
            colors={["#69DADB00", "#69DADB33"]}
            
            style={styles.gradient}
          > */}
            <ImageBackground
              style={styles.gradient}
              source={ThemeManager.ImageIcons.homeSubBg}
            >
              {/* <View style={[styles.coinInfoText, { backgroundColor: ThemeManager.colors.DarkRed }]}> */}
              <View style={{ ...styles.ViewStyle, marginTop: 0 }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.coinStyle,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {selectedCoin.is_token == 0
                    ? LanguageManager.walletMain?.coin
                    : this.getTagLabel()}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.coinStyle,
                      { color: ThemeManager.colors.blackWhiteText },
                    ]}
                  >
                    {Singleton.getInstance().CurrencySymbol}
                    {this.getFiatValueWithComma(
                      selectedCoin.currentPriceInMarket
                    )}
                  </Text>
                  {selectedCoin.price_change_percentage_24h
                    ?.toString()
                    .includes("-") ? (
                    <View style={styles.viewStyle2}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.titleTextStyleNew,
                          {
                            color: colors.lossColor,
                            paddingLeft: 2,
                            paddingRight: 0,
                          },
                        ]}
                      >
                        {"-"}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.titleTextStyleNew,
                          { color: colors.lossColor, paddingLeft: 2 },
                        ]}
                      >
                        {selectedCoin.price_change_percentage_24h
                          ? selectedCoin.price_change_percentage_24h
                            .toFixed(2)
                            .toString()
                            .replace(/[-]/g, "")
                          : 0.0}
                        %
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.viewStyle2}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          {
                            color: Colors.profitColor,
                            // fontSize: 12,
                            // paddingRight: 5,
                            marginBottom:
                              Platform.OS == "ios"
                                ? DeviceInfo.hasNotch() ||
                                  DeviceInfo.hasDynamicIsland()
                                  ? getDimensionPercentage(3)
                                  : getDimensionPercentage(5)
                                : getDimensionPercentage(0),
                          },
                        ]}
                      >
                        {"+"}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.titleTextStyleNew,
                          { color: colors.darkGreen },
                        ]}
                      >
                        {selectedCoin.price_change_percentage_24h
                          ? selectedCoin.price_change_percentage_24h.toFixed(2)
                          : 0.0}
                        %
                      </Text>
                    </View>
                  )}
                </View>

                {/* <Text
                allowFontScaling={false}
                style={[
                  // styles.coinStyle,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {Singleton.getInstance().CurrencySymbol}
                {this.getFiatValueWithComma(selectedCoin.price_change_percentage_24h)}
              </Text> */}
              </View>

              {selectedCoin.coin_image ? (
                <Image
                  style={styles.ImgStyle1}
                  source={{ uri: selectedCoin.coin_image }}
                />
              ) : (
                <View
                  style={[
                    styles.ImgStyle,
                    { backgroundColor: ThemeManager.colors.Mainbg },
                  ]}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.coinSymbolStyle,
                      {
                        color: ThemeManager.colors.blackWhiteText,
                        textTransform: "capitalize",
                        paddingLeft: 0,
                      },
                    ]}
                  >
                    {selectedCoin.coin_symbol?.substring(0, 1)}
                  </Text>
                </View>
              )}
              {/* <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.newTitle }]}>{walletMain.walletBalance}{' '}</Text> */}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.coinInfoValue,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {this.getValue(this.state.balance)}{" "}
                  {selectedCoin.coin_symbol.toUpperCase()}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image
                  style={styles.aprroxEqualIconStyle}
                  source={ThemeManager.ImageIcons.approxEqual}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.coinInfoUSDValue,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {Singleton.getInstance().CurrencySymbol}{" "}
                  {this.getFiatValue(
                    exponentialToDecimal(
                      this.state.balance * selectedCoin.currentPriceInMarket
                    )
                  )}{" "}
                  {/* {Singleton.getInstance().CurrencySelected} */}
                </Text>
              </View>

              {/* *************Send Receive Swap **************** */}

              {/* </View> */}
            </ImageBackground>
            {/* </LinearGradient> */}
            <View style={styles.sendReceiveSwapview}>
              <View style={styles.styleRow}>
                <View
                  style={{
                    flexDirection: "row",
                    // marginTop: getDimensionPercentage(22),
                    justifyContent: "space-between",
                  }}
                >
                  <PortfolioButton
                    image={Images.walletSendIcon}
                    text={LanguageManager.walletMain.send}
                    onPress={() => this.itemPressedOnIcon("send", "0")}
                    imageStyle={{
                      ...styles.sendReceiveBtnWrap,
                      borderColor: ThemeManager.colors.darkBg,
                    }}
                  />

                  <PortfolioButton
                    image={Images.walletReceiveIcon}
                    text={LanguageManager.walletMain.receive}
                    color={ThemeManager.colors.blackWhiteText}
                    onPress={() => this.itemPressedOnIcon("Receive", "2")}
                    imageStyle={{
                      ...styles.sendReceiveBtnWrap,
                      borderColor: ThemeManager.colors.darkBg,
                    }}
                  />

                  <PortfolioButton
                    image={Images.walletBuyIcon}
                    text={LanguageManager.contactUs.buySell}
                    onPress={() => {
                      if (selectedCoin?.coin_family != 7) {
                        if (selectedCoin?.is_token == 1) {
                          this.setState({ isLoading: true })
                          this.props.getOnOffRampCoins()
                            .then(async (res) => {
                              const { fiat, config } = res?.data
                              let cryptoCurrencies = config?.crypto_currencies
                              let isSupported = cryptoCurrencies?.find(mItem => (mItem?.contract?.toUpperCase() == selectedCoin?.token_address?.toUpperCase()))
                              console.log("IS_SUPPORTED>>>>", isSupported);
                              if (isSupported) {
                                Singleton.getInstance().buySellSelectedCoin = selectedCoin;
                                Actions.currentScene != "BuySellCoin" &&
                                  Actions.BuySellCoin();
                              } else {
                                this.setState({ showAlertDialog: true, alertTxt: `${selectedCoin?.coin_symbol} is not available for buy/sell.` });

                              }
                              this.setState({ isLoading: false })
                            }).catch(err => {
                              this.setState({ isLoading: false, showAlertDialog: true, alertTxt: `${selectedCoin?.coin_symbol} is not available for buy/sell.` });
                            })
                        } else {
                          Singleton.getInstance().buySellSelectedCoin = selectedCoin;
                          Actions.currentScene != "BuySellCoin" &&
                            Actions.BuySellCoin();
                        }
                      } else {
                        this.setState({ showAlertDialog: true, alertTxt: "Qubetics chain is not available for buy/sell." });
                      }
                    }}
                    imageStyle={{
                      ...styles.sendReceiveBtnWrap,
                      borderColor: ThemeManager.colors.darkBg,
                    }}
                  />
                  {this.state.isSwapAvailable &&
                    <PortfolioButton
                      image={Images.walletTradeIcon}
                      isSwapAvailable={this.state.isSwapAvailable}
                      text={LanguageManager.merchantCard.trade}
                      onPress={() => {
                        if (this.state.isSwapAvailable) {
                          const data = { isOnChain: (selectedCoin?.coin_family == 1 || selectedCoin?.coin_family == 2 || selectedCoin?.coin_family == 4) ? true : false, selectedCoin };
                          Singleton.getInstance().swapSelectedCoin = data;
                          if (data.isOnChain) {
                            Actions.jump("Swap")
                          } else {
                            this.setState({ isLoading: true }, async () => {
                              const lastSelectedCoins = await this.getLastSelectedCoins()
                              let firstCoinId = selectedCoin?.coin_id;
                              let secondCoinId = lastSelectedCoins.to
                              if (firstCoinId == secondCoinId) {
                                secondCoinId = lastSelectedCoins.from
                              }
                              this.saveLastSelectedCoins(firstCoinId, secondCoinId)
                            })
                          }
                        }
                      }}
                      imageStyle={{
                        ...styles.sendReceiveBtnWrap,
                        borderColor: ThemeManager.colors.darkBg,
                      }}
                    />}
                </View>

                {/* 
              <TouchableOpacity
                style={{
                  backgroundColor: "#24A09Ded",
                  width: moderateScale(150),
                  height: moderateScale(54),
                  borderWidth: 1,
                  borderRadius: moderateScale(20),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.itemPressedOnIcon("send", "0");
                }}
              >
                <Text style={[styles.txtStyle, { color: "black",fontFamily:Fonts.dmSemiBold }]}>
                  {LanguageManager.transactionHistory.send}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "#24A09Ded",
                  width: moderateScale(150),
                  borderWidth: 1,
                  borderRadius: moderateScale(20),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  this.itemPressedOnIcon("receive", "1");
                }}
              >
                <Text
                  style={[
                    styles.txtStyle,
                    { color: ThemeManager.colors.TextColor },
                  ]}
                >
                  {LanguageManager.transactionHistory.receive}
                </Text>
              </TouchableOpacity> 
              */}

                {/* <TouchableOpacity
                  onPress={() => {
                    this.itemPressedOnIcon('swap', '2');
                  }}>
                  <View>
                    <Image
                      source={ThemeManager.ImageIcons.swapIconNew}
                      style={styles.logoStyle}
                    />
                  </View>
                  <Text
                    style={[
                      styles.txtStyle,
                      { color: ThemeManager.colors.black },
                    ]}>
                    {LanguageManager.transactionHistory.swap}
                  </Text>
                </TouchableOpacity> */}
              </View>
            </View>
            {/* <View style={styles.wallAddresstitle}>
            <Text allowFontScaling={false} style={[styles.wallAddresstitleText, { color: ThemeManager.colors.newTitle }]}>{sendTrx.walletAddress}</Text>
          </View> */}

            {/* <LinearGradient
            colors={["#69DADB00", "#69DADB33"]}
            style={{
              borderRadius: moderateScale(15),
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              marginHorizontal: 15,
              borderWidth: 1,
              marginTop: verticalScale(20),
              height: verticalScale(50),
            }}
          > */}
            <View
              style={{
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                marginHorizontal: 15,
                // borderWidth: 1,
                marginTop: verticalScale(20),
                height: verticalScale(50),
                backgroundColor: ThemeManager.colors.mnemonicsBg,
                // overflow:'hidden'
              }}
              source={ThemeManager.ImageIcons.sendCardMain}
            >
              <View
                style={[
                  styles.addressWrap,
                  {
                    // backgroundColor: ThemeManager.colors.bgQr,
                    // borderColor: ThemeManager.colors.borderColor,
                  },
                ]}
              >
                <View style={[styles.addressItem]}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={[
                      styles.addressItemText,
                      { color: ThemeManager.colors.blackWhiteText },
                    ]}
                  >
                    {selectedCoin.wallet_address}
                  </Text>
                </View>

                <View style={styles.addressButtons}>
                  <TouchableOpacity
                    style={styles.addButtons}
                    onPress={() => this.set_Text_Into_Clipboard()}
                  >
                    <Image
                      source={images.copy1}
                      resizeMode={"contain"}
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(22),
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={
                      Platform.OS == "ios" ? false : this.state.isDisable
                    }
                    style={styles.addButtons}
                    onPress={() => {
                      clearTimeout(this.shareAddressRef)
                      this.shareAddressRef = setTimeout(() => {
                        this.shareAddress(
                          selectedCoin.coin_name,
                          selectedCoin.wallet_address
                        );
                      }, 800);

                    }}
                  >
                    <Image
                      source={images.share}
                      resizeMode={"contain"}
                      style={{
                        height: moderateScale(20),
                        width: moderateScale(26),
                        resizeMode: "contain",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* </LinearGradient> */}

            {/* <Text
            style={[
              styles.transactionFeeStyle,
              { color: ThemeManager.colors.headersTextColor },
            ]}>
            {LanguageManager.transactionHistory.transaction}
          </Text> */}

            <View style={{ flex: 1, marginTop: getDimensionPercentage(24) }}>
              {this.state.transactionList?.length > 0 && (
                <View style={styles.ViewStyle}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.transactionHistoryTitle,
                      { color: ThemeManager.colors.blackWhiteText },
                    ]}
                  >
                    {sendTrx?.transactions}
                  </Text>
                </View>
              )}

              <TransactionList
                selectedCoin={this.props.selectedCoin}
                txnList={this.state.transactionList}
                themeSelected={this.props.themeSelected}
                onScroll={() => {
                  this.fetchNextPageData();
                }}
              />
            </View>

            {/* <View style={styles.abs}>
            <Button
              onPress={() =>
                this.setState({showModal: true, selectedIndex: null})
              }
              buttontext={sendTrx.transact}
              myStyle={{width: 230}}
            />
          </View> */}

            <TransactModal
              disabled={this.state.disabled}
              selectedIndex={this.state.selectedIndex}
              onPressIn={() =>
                this.setState({ showModal: false, disabled: false })
              }
              openModel={this.state.showModal}
              onPress={(item, index) => {
                this.itemPressed(item, index);
              }}
            />
            <GraphComponent
              headerText={`${selectedCoin.coin_name.toString().length > 12
                ? selectedCoin.coin_name.substring(0, 10) + "..."
                : selectedCoin.coin_name
                } (${selectedCoin.coin_symbol?.toUpperCase()})`}
              openModel={this.state.showFullGraph}
              graphData={this.state.graphData}
              onPressClose={() => this.setState({ showFullGraph: false })} />

            {this.state.showAlertDialog && (
              <AppAlert
                showSuccess={this.state.showSuccess}
                alertTxt={this.state.alertTxt}
                hideAlertDialog={() => {
                  this.setState({ showAlertDialog: false, disabled: false });
                  // Actions.pop()
                }}
              />
            )}
          </View>
          <LoaderView isLoading={this.state.isLoading} />
        </View>
      </ImageBackground>
    );
  }
}
export default connect(null, { getTransactionList, getSign, Updatebalance, getUserBalance, updateWatchList, getOnOffRampCoins })(
  TransactionHistory
);
