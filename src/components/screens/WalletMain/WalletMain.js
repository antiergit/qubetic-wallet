import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  RefreshControl,
  BackHandler,
  StatusBar,
  Platform,
  ScrollView,
  ImageBackground,
  FlatList,
  SafeAreaView,
  Dimensions,
  AppState,
} from "react-native";
import styles from "./WalletMainStyle";
import {
  CoinList,
  TabIcon,
  AppAlert,
  LoaderView,
  MainCard,
  FilterList,
  InputtextSearch,
  GradientBorderView,
} from "../../common";
import { AppAlertDialog } from "../../common/AppAlertDialog";
import { Colors, Fonts, Images } from "../../../theme/";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import {
  requestCoinList,
  getRpcUrl,
  getNotiStatus,
} from "../../../Redux/Actions";
import { connect } from "react-redux";
import ReactNativeBiometrics from "react-native-biometrics";
import { EventRegister } from "react-native-event-listeners";
import { CommaSeprator1, getData, saveData, toFixedExp } from "../../../Utils/MethodsUtils";
import DeviceInfo from "react-native-device-info";
import Singleton from "../../../Singleton";
import { BlurView } from "@react-native-community/blur";
import { LanguageManager } from "../../../../LanguageManager";
import { PortfolioManageButton } from "../../common/SearchToken";
import { getDimensionPercentage, heightDimen, widthDimen } from "../../../Utils";
import messaging from "@react-native-firebase/messaging";
import WalletConnectInstance from "../../../Utils/WalletConnectInstance";

let deviceName = "";
const RampList = [
  { title: "Alchemy Pay", image: Images.alchemy },
  { title: "Transak", image: Images.transakLogo },
];
class WalletMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fiat_bal: "0.00",
      showAlertDialogExit: false,
      refresh: false,
      loading: false,
      showAlertDialog: false,
      alertTxt: "",
      is_notification: false,
      selectedCurrImage:
        "https://stage-wallet.shidowallet.io/api/v1/static/images/united-states.png",
      refreshing: false,
      themeSelected: "",
      showViewAll: true,
      showModal: false,
      disabled: false,
      selectedIndex: null,
      showRampModal: false,
      walletName: '',
      twentyFourHour: '0.00',
      themeSelected: "",
      isHideBalance: false,
    };
    this.scrollRef = React.createRef();
  }

  /******************************************************************************************/
  static navigationOptions = () => {
    return {
      header: null,
      tabBarLabel: " ",
      tabBarIcon: ({ focused }) => (
        <TabIcon
          focused={focused}
          title={LanguageManager.walletMain.Wallet}
          ImgSize={{
            height: 23,
            tintColor: focused
              ? ThemeManager.colors.whiteText
              : ThemeManager.colors.lightWhiteText,
          }}
          activeImg={Images.dashboard_active}
          defaultImg={Images.dashboard_inactive}
          titleColor={{
            color: focused
              ? ThemeManager.colors.whiteText
              : ThemeManager.colors.lightWhiteText,
          }}
        />
      ),
      tabBarOptions: {
        style: {
          borderTopColor: "transparent",
          borderColor: "black",
          backgroundColor: ThemeManager.colors.tabBottomColor,
        },
        keyboardHidesTabBar: true,
      },
    };
  };
  //NotificationPush
  /******************************************************************************************/
  componentDidMount() {
    console.log("isPushNotificationEnabled:::::::", Singleton.getInstance().isMakerWallet)


    this.appStateListner = AppState.addEventListener("change", (nextState) => {
      console.log("WalletMain.js nextState ------", nextState);

    });
    getData(Constants.WALLET_NAME).then(async (res) => {
      this.setState({ walletName: res })
    });

    EventRegister.addEventListener("hitWalletApi", () => {
      console.log("chk current scene:::::", Actions.currentScene);
      Actions.currentScene == "_WalletMain" && this.mywalletList();
      Actions.currentScene == "_WalletMain" && this.fetchNotiStatus();
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: "",
        showAlertDialogExit: false,
        showModal: false,
        showRampModal: false,
        disabled: false,
        selectedIndex: null,
      });
    });


    this.checkBiometricAvailability();
    this.checkHideBalance()
    this.initialCallWalletConnect()
    EventRegister.addEventListener("getThemeChanged", (data) => {
      console.log("data:::::main:: ", data)

      this.setState({ themeSelected: data ? data : 2 });
    });
    this.focus = this.props.navigation.addListener("didFocus", async () => {

      this.onFocus();
    });
    this.unfocus = this.props.navigation.addListener("didBlur", () => {
      EventRegister.emit("fromscreen", "");
      this._scrollToTop();
      this.backhandle = BackHandler.removeEventListener(
        "hardwareBackPress",
        this.handleBackButtonClick
      );
      if (this.backhandle) this.backhandle.remove();
    });

  }

  initialCallWalletConnect = async () => {
    WalletConnectInstance.getInstance()
    EventRegister.addEventListener('requestFromDapp', (data) => {
      getData(Constants.PIN_LOCK).then(res => {
        if (res) {
          if (Actions.currentScene != "EnterPin") {
            Singleton.getInstance()?.walletConnectRef?.showTransactionRequest(true, data)
          } else {
            global.wcTxnData = data
            global.wcTxnPopup = true
          }

        }
      });
    })
  }


  componentWillUnmount() {
    this.appStateListner?.remove();
  }

  /******************************************************************************************/
  async onFocus() {
    this.checkHideBalance()

    EventRegister.emit("fromscreen", "wallet");
    this.setState({ search: '' });
    Singleton.isPermission = false;
    this.mywalletList();
    this.fetchRpc();
    this.fetchNotiStatus();
    deviceName = await DeviceInfo.getDeviceName();
    // StatusBar.setBackgroundColor(ThemeManager.colors.statusBarColor1);
    // StatusBar.setBarStyle("light-content");
    this.backhandle = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
    getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
      console.log("test::::::: ", theme)
      this.setState({ themeSelected: theme });
    });
    getData(Constants.WALLET_NAME).then(async (res) => {
      this.setState({ walletName: res })
    });

    // const showBal=this.showBal()
    // console.log("response:::showBal:>>>>>>", showBal);

    // saveData(Constants.SHOW_BALANCE, showBal);

    // getData(Constants.SHOW_BALANCE).then(async (res) => {
    //   console.log("response:::SHOW_BALANCE:>>>>>>", res);
    //   // this.setState({ showBal: res })
    // });




    this.setState({ refresh: false });
    this.setState({ refresh: !this.state.refresh });
  }

  checkHideBalance() {
    getData(Constants.HIDE_BALANCE).then((res) => {
      this.setState({ isHideBalance: res == "true" ? true : false }, () => {
        Singleton.getInstance().isHideBalance = this.state.isHideBalance
      })
    })
  }

  /* *********************************************_scrollToTop***************************************** */
  _scrollToTop() {
    if (this.scrollRef !== null) {
      if (this.scrollRef.current !== null) {
        this.scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  }

  /* *********************************************fetchNotiStatus***************************************** */
  fetchNotiStatus() {
    const data = {
      key: 1,
    };
    console.log("data notification :::", data);
    this.props
      .getNotiStatus({ data })
      .then((res) => {
        console.log("chk noti res:::::: ===", res);
        Singleton.isNotification = res.new_notifications == 1 ? true : false
        this.setState({
          is_notification: res.new_notifications == 1 ? true : false,
        });
      })
      .catch((err) => {
        console.log("chk noti err: wallet main::::: ", err);
      });
  }

  /* *********************************************fetchRpc***************************************** */
  fetchRpc() {
    this.props.getRpcUrl({});
  }

  /* *********************************************checkBiometricAvailability***************************************** */
  checkBiometricAvailability() {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available } = resultObject;
      console.log("chk available:::::", available);
      saveData(Constants.BIOMETRIC_SUPPORTED, available ? "true" : false);
    });
  }

  /* *********************************************handleBackButtonClick***************************************** */
  handleBackButtonClick = () => {
    console.log("chk Actions.Cut=rrent scene::::::", Actions.currentScene);
    Actions.currentScene == "TransactionHistory"
      ? this.hitPop()
      : this.setState({
        showAlertDialogExit:
          Actions.currentScene == "_WalletMain" ||
            Actions.currentScene == "WalletMain"
            ? true
            : false,
      });
    return true;
  };

  /******************************************************************************************/
  hitPop() {
    console.log("herrerere1212");
    Singleton.bottomBar?.navigateTab("WalletMain");
    // Actions.jump("WalletMain");
  }
  /************************************** mywalletList ****************************************************/
  mywalletList(isLoading = true) {
    this.setState({ loading: isLoading });
    this.props
      .requestCoinList({})
      .then((response) => {
        console.log("response coin list>>>>>>>", response);
        Singleton.isFirsLogin = false;
        let fiat_bal = 0;
        let twentyFourHour = 0;

        if (response?.length > 0) {
          response.map((item) => {
            console.log("items?????", item.fiatBal);
            fiat_bal += parseFloat(
              item.fiatBal < 0.000001
                ? toFixedExp(item.fiatBal, 8)
                : item.fiatBal < 0.01
                  ? toFixedExp(item.fiatBal, 4)
                  : toFixedExp(item.fiatBal, 2)
            );
          });
          console.log("item.fiatBal====", fiat_bal);
          fiat_bal = fiat_bal > 0 ? fiat_bal : "0.00";
          this.setState({ fiat_bal: fiat_bal });
          this.setState({ twentyFourHour: twentyFourHour })
        } else {
          this.setState({ fiat_bal: "0.00" });
        }
        console.log("@@@@@@@@@@@@@ fiat_bal", fiat_bal);
        this.setState({ loading: false });


        const showBal = this.showBalWithBal(fiat_bal)
        console.log("response:::showBal:>>>>>>", showBal);

        saveData(Constants.SHOW_BALANCE, showBal);

        getData(Constants.SHOW_BALANCE).then(async (res) => {
          console.log("response:::SHOW_BALANCE:>>>>>>", res);
          // this.setState({ showBal: res })
        });



      })
      .catch((e) => {
        this.setState({
          loading: false,
          fiat_bal: "0.00",
          alertTxt: e,
          showAlertDialog:
            (Actions.prevScene == "_WalletMain" &&
              Actions.currentScene == "EnterPin") ||
              (Actions.prevScene == "EnterPin" &&
                Actions.currentScene == "EnterPin")
              ? false
              : true,
        });

        const showBal = this.showBalWithBal(0.00)
        console.log("response:::showBal:>>>>>>", showBal);

        saveData(Constants.SHOW_BALANCE, showBal);

        getData(Constants.SHOW_BALANCE).then(async (res) => {
          console.log("response:::SHOW_BALANCE:>>>>>>", res);
          // this.setState({ showBal: res })
        });
      });
  }

  /************************************** onRefresh ****************************************************/
  onRefresh = () => {
    this.setState({ refreshing: true, search: '' });
    this.mywalletList(false);
    this.wait(1500).then(() => this.setState({ refreshing: false, }));
  };
  wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  /* *********************************************notiPressed***************************************** */
  notiPressed() {
    Singleton.isNotification = false
    this.setState({ is_notification: false });
    Actions.currentScene != "NotificationsTab" &&
      Actions.NotificationsTab({ themeSelected: this.state.themeSelected });
  }

  /* *********************************************addCustomToken***************************************** */
  addCustomToken() {
    this.setState({ showModal: true, disabled: false, selectedIndex: null });
  }

  /* *********************************************manage***************************************** */
  manage() {

    Actions.currentScene != "Manage" &&
      Actions.Manage({ themeSelected: this.state.themeSelected });


  }

  /* *********************************************priceAlert***************************************** */
  priceAlert() {
    if (this.props?.coinList?.length > 0) {
      Actions.currentScene != "CreatePriceAlert" &&
        Actions.CreatePriceAlert({
          home: true,
          themeSelected: this.state.themeSelected,
        });
    } else {
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.noassetsfound,
      });
    }
  }


  /******************************************************************************************/
  toggleNft() {
    Actions.currentScene !== "Nft" &&
      Actions.Nft({ themeSelected: this.state.themeSelected });

  }
  /******************************************************************************************/
  toggleWallet() {
    Actions.currentScene !== "ToggleWalletNew" &&
      Actions.ToggleWalletNew({ themeSelected: this.state.themeSelected });
  }

  /* *********************************************onPressSend***************************************** */
  onPressSend() {
    Actions.currentScene != "SelectCoin" &&
      Actions.SelectCoin({
        action_type: "send",
        themeSelected: this.state.themeSelected,
      });
  }

  /* *********************************************onPressReceive***************************************** */
  onPressReceive() {
    Actions.currentScene != "SelectCoin" &&
      Actions.SelectCoin({
        action_type: "receive",
        themeSelected: this.state.themeSelected,
      });
  }
  /* *********************************************onPressReceive***************************************** */
  onPressBuySell() {
    Actions.currentScene != "BuySellCoin" &&
      Actions.BuySellCoin();
  }

  /* *********************************************onPressSwap***************************************** */
  onPressSwap() {
    Actions.currentScene != "Swap" &&
      Actions.Swap();
  }

  /* *********************************************hideShowBalance***************************************** */
  onHideShowBalance() {
    console.log("onHideShowBalance>>>");
    this.setState({ isHideBalance: !this.state.isHideBalance }, () => {
      Singleton.getInstance().isHideBalance = this.state.isHideBalance
      saveData(Constants.HIDE_BALANCE, this.state.isHideBalance)
    })
  }


  onPressHistory() {
    Actions.currentScene != "DetailTransaction" &&
      Actions.DetailTransaction({
        themeSelected: this.state.themeSelected,
        symbol: "all",
      });
  }

  /* *********************************************onPressCards***************************************** */
  onPressCards() {
    Actions.currentScene != "PrepaidCard" &&
      Actions.PrepaidCard({ isMainWallet: true });
  }

  /* *********************************************txnHistory***************************************** */
  txnHistory() {
    Actions.currentScene != "DetailTransaction" &&
      Actions.DetailTransaction({ themeSelected: this.state.themeSelected });
  }

  /******************************************************************************************/
  itemPressed(item, index) {
    console.log("chk press item::::", item, index);
    this.setState({ selectedIndex: index, disabled: true });
    setTimeout(() => {
      if (
        item.toLowerCase() ==
        LanguageManager.addressBook.addCustomToken?.toLowerCase()
      ) {
        Actions.currentScene !== "AddCustomToken" &&
          Actions.AddCustomToken({ themeSelected: this.state.themeSelected });
        this.setState({ showModal: false });
      } else {
        this.setState({
          showModal: false,
          selectedIndex: null,
          disabled: false,
          showRampModal: true,
        });
      }
    }, 1000);
  }

  /******************************************************************************************/
  rampItemPressed(item, index) {
    console.log("chk press item::::", item, index);
    this.setState({ selectedIndex: index, disabled: true });
    setTimeout(() => {
      if (item.toLowerCase() == "alchemy pay") {
        Actions.currentScene != "Alchemy" &&
          Actions.Alchemy({ screen: "wallet" });
        this.setState({ showRampModal: false });
      } else {
        Actions.currentScene != "Transak" &&
          Actions.Transak({ screen: "wallet" });
        this.setState({ showRampModal: false });
      }
    }, 1000);
  }

  /******************************************************************************************/
  onEndReached({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToBottom = 20;
    const bottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    if (bottom && this.state.loadList && this.state.page < this.state.pages) {
      const page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.props?.coinList?.length != this.state.totalRecords) {
          console.log("here::::", 1);
          const data = {
            search: "",
            page: this.state.page,
            limit: this.state.limit,
          };
          this.mywalletList(data, true);
        } else {
          console.log("here::::", 11);
        }
      });
    }
  }

  //******************************************************************************************/
  getBgColor(index) {
    const { themeSelected, selectedIndex } = this.state;
    console.log("chk themeSelected:::::", themeSelected);
    let color = "";
    if (themeSelected == 2) {
      color =
        index == selectedIndex
          ? ThemeManager.colors.colorVariation
          : ThemeManager.colors.Mainbg;
    } else {
      color =
        index == selectedIndex
          ? ThemeManager.colors.subTitle
          : ThemeManager.colors.searchBg;
    }
    return color;
  }

  /******************************************************************************************/
  getSearchList() {
    let data = {
      search: this.state.search,
      page: 1,
      limit: this.state.limit,
    };
    this.fetchList(data);
  }

  /******************************************************************************************/
  fetchList(data1, fromPagination = false) {
    this.setState({ isLoading: true });
    console.log("chk action_type:::::", this.props.action_type);
    setTimeout(() => {
      this.props
        .requestCoinList({ data1 })
        .then((response) => {
          console.log("response:::::", response);
          if (response.data.length > 0) {
            this.setState({
              coinList: fromPagination
                ? this.state.coinList.concat(response.data)
                : response.data,
              loadList: true,
              totalRecords: response?.meta?.total,
            });
          } else {
            this.setState({
              coinList: fromPagination ? this.state.coinList : [],
            });
          }
          this.setState({ isLoading: false });
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt: err,
          });
        });
    }, 150);
  }
  /******************************************************************************************/
  updateSearch() {
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getSearchList();
    }, 100);
  }

  showBal() {
    if (this.state.fiat_bal < 0.000001) {
      return `${CommaSeprator1(this.state.fiat_bal, 8)}`
    } else if (this.state.fiat_bal < 0.01) {
      return `${CommaSeprator1(this.state.fiat_bal, 4)}`
    } else {
      return `${CommaSeprator1(this.state.fiat_bal, 2)}`
    }
  }
  showBalWithBal(bal) {
    if (bal < 0.000001) {
      return `${CommaSeprator1(bal, 8)}`
    } else if (bal < 0.01) {
      return `${CommaSeprator1(bal, 4)}`
    } else {
      return `${CommaSeprator1(bal, 2)}`
    }
  }
  /******************************************************************************************/
  render() {
    const { walletMain, alertMessages, addressBook } = LanguageManager;
    return <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <View style={{ flex: 1 }}>

        <View
          style={{
            width: Dimensions.get('screen').width,
            paddingTop: Platform.OS == 'ios'
              ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
                ? getDimensionPercentage(50)
                : getDimensionPercentage(20)

              : getDimensionPercentage(0),
          }}
        >


          <View style={[styles.ViewStyle2]}>
            <View style={[styles.ViewStyle, {}]}>

              <TouchableOpacity
                onPress={() => {
                  if (Actions.currentScene !== "MyWalletList") {
                    Actions.MyWalletList();
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                  <GradientBorderView
                    gradientStyle={{ height: widthDimen(46), width: widthDimen(46) }}
                    mainStyle={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={[styles.walletNameIcon, { color: ThemeManager.colors.blackWhiteText }]}>{this.state.walletName?.charAt(0)?.toUpperCase()}</Text>

                  </GradientBorderView>

                  <Text
                    ellipsizeMode="tail"
                    style={[styles.walletName, { color: ThemeManager.colors.blackWhiteText }]}
                  >
                    {this.state.walletName}
                  </Text>
                  <Image source={ThemeManager.ImageIcons.newDropDown}
                    style={{ resizeMode: "contain", marginLeft: widthDimen(8) }} />

                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.notiPressed()}
                style={[styles.touchableStyle]}
              >

                <Image
                  style={[styles.imgNoti]}
                  source={
                    // Images.notiDot
                    Singleton.isNotification
                      ? Images.notiDot
                      : Images.noti
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: heightDimen(12) }} />
            <MainCard
              fiat_bal={this.state.fiat_bal}
              onPressSend={() => this.onPressSend()}
              onPressReceive={() => this.onPressReceive()}
              onPressHistory={() => this.onPressHistory()}
              onPressBuySell={() => this.onPressBuySell()}
              onPressSwap={() => this.onPressSwap()}
              isHideBalance={this.state.isHideBalance}
              hideBalance={() => this.onHideShowBalance()}
              showBal={this.showBal()}
            />
          </View>
        </View>
        <View style={styles.viewAssets}>
          <PortfolioManageButton
            isIconsShow={true}
            arrangeWallet={() => {

              this.manage();
            }}
            nft={() => {
              this.toggleNft();
            }}
            manage={() => {
              this.toggleWallet();
            }}
            value={this.state.search}
            onSubmitEditing={(text) => {
              this.updateSearch(this.state.search);
            }}
            onChangeText={(text) => {
              this.setState({ search: text, fromSearch: true });
              this.updateSearch(text);
            }}
          />
        </View>
        <View style={{ marginTop: heightDimen(10) }} />

        {/* ------------------------------------------------------------------- */}
        <ScrollView
          // bounces={false}
          ref={this.scrollRef}
          scrollEventThrottle={100}
          keyboardShouldPersistTaps={"always"}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        >
          <View style={{ flex: 1 }}>

            {/* ------------------------------------------------------------------- */}
            {this.props?.coinList?.length == 0 && (
              <View style={styles.emptyView1}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.txtNoAssets,
                    { color: ThemeManager.colors.TextColor },
                  ]}
                >
                  {walletMain.noassetsfound}
                </Text>
              </View>
            )}
            {this.props?.coinList?.length > 0 && (
              <View

              >
                <CoinList
                  showTransactionHistory="true"
                  coinList={this.props?.coinList}
                  showFooter={true}
                  themeSelected={this.state.themeSelected}
                  isHideBalance={this.state.isHideBalance}
                  showViewAll={
                    this.props?.coinList?.length > 5 ? true : false
                  }
                  buttonText={
                    this.state.showViewAll
                      ? walletMain.viewAll
                      : walletMain.viewLess
                  }
                  onAddressBookPress={() => {
                    // Actions.currentScene != "AddressBook" &&
                    //   Actions.AddressBook({ symbol: "all" });
                    Actions.currentScene !== "AddCustomToken" &&
                      Actions.AddCustomToken({ themeSelected: "", from: "walletMain" });

                  }}
                />
              </View>
            )}
            {/* ------------------------------------------------------------------- */}
          </View>
        </ScrollView>
        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              // alert('heyy'+this.state.showAlertDialog)
              this.setState({ showAlertDialog: false });
            }}
          />
        )}

        {/* ********************************************* Modal **************************************** */}
        {/* <FilterList
            disabled={this.state.disabled}
            selectedIndex={this.state.selectedIndex}
            onPress={(item, index) => { this.itemPressed(item, index) }}
            list={List}
            openModel={this.state.showModal}
            onPressIn={() => this.setState({ showModal: false })}
            fromCustom={true}
          /> */}

        {/* ********************************************* Ramp Modal **************************************** */}
        <Modal
          visible={this.state.showRampModal}
          onRequestClose={() => this.setState({ showRampModal: false })}
          transparent
        >
          <BlurView
            style={styles.blurView}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <TouchableOpacity
            onPress={() => this.setState({ showRampModal: false })}
            style={[styles.centeredView]}
          >
            <View
              style={[
                styles.modalView,
                { backgroundColor: ThemeManager.colors.bottomSheetColor },
              ]}
            >
              <View style={{ paddingTop: 10, paddingBottom: 25 }}>
                {RampList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.rampItemPressed(item?.title, index)
                      }
                      style={[
                        styles.touchableStyleNew,
                        {
                          borderColor: ThemeManager.colors.underLineColor,
                          backgroundColor: this.getBgColor(index),
                        },
                      ]}
                    >
                      <Image style={styles.imgStyle1} source={item.image} />
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.textStyle,
                          {
                            color:
                              index == this.state.selectedIndex
                                ? ThemeManager.colors.Mainbg
                                : ThemeManager.colors.settingsText,
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* ********************************************* Exit Modal **************************************** */}
        <Modal
          visible={this.state.showAlertDialogExit}
          onRequestClose={() =>
            this.setState({ showAlertDialogExit: false })
          }
          transparent
        >
          <AppAlertDialog
            alertTxt={alertMessages.areYouSureWantToExist}
            hideAlertDialog={() => {
              this.setState({ showAlertDialogExit: false });
            }}
            confirmAlertDialog={() => {
              this.setState({ showAlertDialogExit: false });
              BackHandler.exitApp();
            }}
          />
        </Modal>
      </View>

      <LoaderView
        isLoading={this.state.loading}
      />
    </ImageBackground>
  }
}
const mapStateToProp = (state) => {
  const { coinList, checkerAccessReq, checkerTransactionReq } = state.walletReducer;
  return { coinList, checkerAccessReq, checkerTransactionReq };
};
export default connect(mapStateToProp, {
  requestCoinList,
  getRpcUrl,
  getNotiStatus,
})(WalletMain);
