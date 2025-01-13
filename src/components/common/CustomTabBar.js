import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { Colors, Fonts, Images } from "../../theme/";
import { TabIconCustom } from "./TabIconCustom";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../ThemeManager";
import DropShadow from "react-native-drop-shadow";
import { getData } from "../../Utils/MethodsUtils";
import Singleton from "../../Singleton";
import { LanguageManager } from "../../../LanguageManager";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../Constants";
import DeviceInfo from "react-native-device-info";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { getIsMakerFromStorage, getMakerWalletBtcOrTrx } from "../../Utils/CheckerMarkerUtils";
import { dimen } from "../../Utils";

class CustomTabBarComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      refresh: true,
      activeScene: "WalletMain",
      themeSelected: "",
      isDapSwapDisabled: false,
      isBtcTrxPrivateKey: false,
      isMakerWallet: false,
      forceRefresh: false, // need to check if active tab bar icon is highlighted corrected without this or not
    };
    this.translateY = new Animated.Value(20);
  }

  //******************************************************************************************/
  componentDidMount() {
    this.startAnimation();
    getIsMakerFromStorage().then((isMakerWallet) => {
      this.setState({
        isMakerWallet: isMakerWallet,
      });
    });
    getMakerWalletBtcOrTrx().then((res) => {
      this.setState({
        isDapSwapDisabled: res,
      });
    });
    this.checkPrivateKeyWallet()


    EventRegister.addEventListener("isMakerWallet", (isMakerWallet) => {
      console.log("isMakerWalletisMakerWallet ------", isMakerWallet);
      // checker wallet
      if (!isMakerWallet) {
        this.startAnimation();
      }
      this.setState({
        isMakerWallet: isMakerWallet,
        forceRefresh: !this.state.forceRefresh
      });
    });

    EventRegister.addEventListener(
      "makerWalletChange",
      (isMakerDisabledBlockchain) => {
        console.log(
          "makerWalletChange isMakerDisabledBlockchain ------",
          isMakerDisabledBlockchain
        );
        this.checkPrivateKeyWallet()
        this.setState({
          isDapSwapDisabled: isMakerDisabledBlockchain,
        });
      }
    );
    EventRegister.addEventListener("getThemeChanged", (data) => {
      this.setState({ themeSelected: data ? data : 2 });
    });
    getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
      this.setState({ themeSelected: theme });
    });
  }

  checkPrivateKeyWallet() {


    getData(Constants.MULTI_WALLET_LIST)
      .then(list => {
        const currentWalletList = JSON.parse(list)
        let currentWallet = currentWalletList.find(res => res?.defaultWallet)
        if (currentWallet?.isPrivateKey) {
          if (currentWallet?.coinFamily == 3 || currentWallet?.coinFamily == 6) {
            if (Actions.currentScene == "DefiAccessMain") {
              Actions.pop()
            } else if (Actions.currentScene == "Swap") {
              Actions.pop()
            }
            this.setState({
              isBtcTrxPrivateKey: true,
            });
          } else {
            this.setState({
              isBtcTrxPrivateKey: false,
            });
          }
        } else {
          this.setState({
            isBtcTrxPrivateKey: false,
          });
        }
      })
  }
  startAnimation() {
    this.bouncyAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.translateY, {
          toValue: 50,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.translateY, {
          toValue: 20,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    this.bouncyAnimation.start();
  }

  componentDidUpdate(prevProps) {
    console.log(
      "prevProps.checkerTransactionReq -----",
      prevProps.checkerTransactionReq !== this.props.checkerTransactionReq
    );
    // Check if checkerTransactionReq has changed
    if (prevProps.checkerTransactionReq !== this.props.checkerTransactionReq) {
      console.log(
        "checkerTransactionReq lenght ------",
        this.props.checkerTransactionReq?.length
      );
      // Check if the length is greater than 0
      if (this.props.checkerTransactionReq?.length > 0) {
        this.startAnimation();
      }
    }
  }

  //******************************************************************************************/
  refreshView = () => {
    this.setState({ refresh: !this.state.refresh });
  };

  //******************************************************************************************/
  toggleBarView = (val) => {
    this.setState({ show: val });
  };

  //******************************************************************************************/
  navigateTab = (scene) => {
    this.setState({ activeScene: scene });
  };

  //******************************************************************************************/
  getTextColor(item, isActive) {
    const { themeSelected } = this.state;
    let color = "";
    if (themeSelected == 2) {
      color = isActive
        ? ThemeManager.colors.colorVariation
        : "rgba(79, 83, 83, 1)";
    } else {
      color = isActive ? "#24A09D" : ThemeManager.colors.lightGrayTextColor;
    }
    return color;
  }

  //******************************************************************************************/
  render() {
    const { walletMain, portfolio, setting } = LanguageManager;
    const imgArr = [
      {
        scene: "WalletMain",
        label: walletMain.Wallet,
        inactive: ThemeManager.ImageIcons.dashBInActive,
      },
      {
        scene: "Swap",
        label: "Swap",
        inactive: ThemeManager.ImageIcons.swapInactive,
      },
      {
        scene: "Portfolio",
        label: portfolio.Portfolio,
        inactive: ThemeManager.ImageIcons.portfolio_active,
      },
      {
        scene: "DefiAccessMain",
        label: "DApp",
        inactive: ThemeManager.ImageIcons.otcInactive,
      },
      {
        scene: "Settings",
        label: setting.settings,
        inactive: ThemeManager.ImageIcons.inActiveSetting,
      },
    ];

    if (!this.state.show) return null;
    const { themeSelected } = this.state;
    const animatedStyle = {
      transform: [{ translateY: this.translateY }],
    };
    const { state } = this.props.navigation;
    const activeTabIndex = state.index;

    return (
      <>
        <SafeAreaView
          style={{ backgroundColor: ThemeManager.colors.tabBarBgColor }}
        >
          <View
            style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.tabBarBgColor }]}
          >
            {imgArr.map((item, index) => {
              return (
                <TouchableOpacity
                  key={"key" + index}
                  disabled={
                    index == 1 && this.state.isBtcTrxPrivateKey ||
                    index == 3 && this.state.isBtcTrxPrivateKey
                  }
                  onPress={() => {
                    Actions.currentScene != "jump" &&
                      Actions.jump(item.scene, { wc_url: "" });
                    Singleton.fromWatchList = false;
                    this.setState({ activeScene: item.scene });
                  }}
                >
                  <TabIconCustom
                    focused={activeTabIndex == index}
                    themeSelected={this.state.themeSelected}
                    activeImg={item.inactive}
                    title={item.label}
                    titleColor={{
                      color: this.getTextColor(
                        item,
                        activeTabIndex == index
                      ),
                    }}
                    ImgSize={{}}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
        {/* <SafeAreaView style={{ backgroundColor: ThemeManager.colors.tabBarBgColor }} /> */}
      </>
    );
  }
}

//******************************************************************************************/
const styles = StyleSheet.create({
  titleTex: {
    fontSize: 10,
    marginTop: 25,
    // bottom: 10,
    fontFamily: Fonts.dmMedium,
    textAlign: "center",
  },
  ViewStyle: {
    shadowColor: Platform.OS == "ios" ? "#404D61" : "#4825251A",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 1,
    zIndex: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  requestBounceView: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: dimen(30),
    paddingTop: dimen(12),
  },
  ViewStyle1: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    height: 65,
  },
  linearGradient: {
    height: 65,
    width: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  HeaderStyle: {},

  viewMainContainer: {
    justifyContent: "center",
    alignItems: "center",
    // bottom: Platform.OS == "ios" ? -11 : -13,
  },
  titleTextTwo: {
    fontSize: 10,
    fontFamily: Fonts.dmBold,
    marginTop: 25,
    fontWeight: "400",
  },
});

const mapStateToProp = (state) => {
  const { checkerTransactionReq, isCheckerReqLoading, checkerApprovalReq } = state.walletReducer;
  return { checkerTransactionReq, isCheckerReqLoading, checkerApprovalReq };
};

const CustomTabBar = connect(mapStateToProp)(CustomTabBarComp);

export { CustomTabBar };
