import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  BackHandler,
  ImageBackground,
} from "react-native";
import styles from "./SecurityStyle";
import {
  Header,
  AppAlert,
  CardView,
  SessionTimeout,
  HeaderMain,
  LoaderView,
} from "../../common";
import { Colors, Images } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import { Actions } from "react-native-router-flux";
import { getData, saveData } from "../../../Utils/MethodsUtils";
import { EventRegister } from "react-native-event-listeners";
import { LanguageManager } from "../../../../LanguageManager";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import fonts from "../../../theme/Fonts";
import Singleton from "../../../Singleton";
class Security extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhrase: false,
      bioMetricMode: this.props.isBioMatricData,
      passwordMode: false,
      themeSelected: "",
      isBiometricSupported: "false",
      showAlertDialog: false,
      alertTxt: "",
      timeOut: 0,
      anim: new Animated.Value(0),
      pinOptionOpen: false,
      showSessionTimeOut: false,
      isLoading: false
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showSessionTimeOut: false,
        showAlertDialog: false,
        alertTxt: "",
      });
    });

    this.props.navigation.addListener("didFocus", (event) => {
      getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
        this.setState({ themeSelected: theme });
        const theme1 =
          theme == 1 ? ThemeManager.colors.MainbgNew : Colors.newHeader;
        EventRegister.emit("theme", theme1);
      });
      EventRegister.addEventListener("getThemeChanged", (data) => {
        this.setState({ themeSelected: data });
      });
      getData(Constants.BIOMETRIC_SUPPORTED).then((res) => {
        this.setState({ isBiometricSupported: res });
      });
      getData(Constants.BIOMETRIC_MODE).then((bio_mode) => {
        bio_mode == "true"
          ? this.setState({ bioMetricMode: true })
          : this.setState({ bioMetricMode: false });
      });
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 200);
    });
  }

  handleBackButtonClick() {
    console.log('back----');
    Actions.pop()

    return true;
  };

  /******************************************************************************************/
  toggleBioMetricMode() {
    if (this.state.bioMetricMode) {
      saveData(Constants.BIOMETRIC_MODE, "false");
      this.setState({ bioMetricMode: false });
      if (this.state.isBiometricSupported == "true") {
        Singleton.getInstance().deleteKeyChainData()
      }
    } else {
      if (this.state.isBiometricSupported == "true") {

        Actions.currentScene !== "EnterPinSecurity" &&
          Actions.EnterPinSecurity({
            from: "Security",
            fromScreen: "Security",
            walletPin: async (pin) => {
              await Singleton.getInstance().handleSetItemUsingTouchIDOnPress(pin)
              saveData(Constants.BIOMETRIC_MODE, "true");
              this.setState({ bioMetricMode: true });
            }
          });
      } else {
        this.setState({
          showAlertDialog: true,
          alertTxt: LanguageManager.alertMessages.systemSecurityIsNotEnabled,
        });
      }
    }
  }

  /******************************************************************************************/
  render() {
    const { alertMessages, referral, pins } = LanguageManager;
    const { themeSelected } = this.state;
    console.log("chk theme::::::::", themeSelected);
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <HeaderMain
          BackButtonText={referral.security}
          customStyle={{
            paddingHorizontal: widthDimen(24),
          }}
        />


        <CardView
          isToggle={true}
          mainCard={true}
          viewStyle={{ justifyContent: "center" }}
          leftImg={true}
          leftIcon={Images.biometricNew}
          leftText={pins.biometric}
          // gradientStyle={{ marginTop: dimen(23) }}
          imgIcon={
            this.state.bioMetricMode
              ? ThemeManager.ImageIcons.toggleNewIcon
              : ThemeManager.ImageIcons.toggleOff
          }
          showIcon={true}
          mainStyle={{ marginTop: dimen(24) }}
          hideBottom={true}
          // onPress={() => this.toggleBioMetricMode()}
          onPressToggle={() => this.toggleBioMetricMode()}
          themeSelected={themeSelected}
        />

        <CardView
          viewStyle={{ justifyContent: "center" }}
          leftImg={true}
          leftIcon={Images.lockIcon}
          leftText={pins.resetCode}
          imgIcon={ThemeManager.ImageIcons.rightArrow}
          // gradientStyle={{ marginTop: dimen(0) }}
          // imgStyle={{ tintColor: ThemeManager.colors.cloudy }}
          // mainStyle={{ marginTop: dimen(24) }}
          hideBottom={false}
          onPress={() => {
            EventRegister.emit(
              "theme",
              themeSelected == 2 ? Colors.White : ThemeManager.colors.Mainbg
            );
            Actions.currentScene !== "EnterPinSecurity" &&
              Actions.EnterPinSecurity({ from: "Security" });
            // Actions.CreatePinSecurity({from:"Security"});
          }}
          mainStyle={{ marginTop: dimen(0) }}

          // img={Images.Lock}
          // text={pins.resetPasscode}
          themeSelected={themeSelected}
        />

        <SessionTimeout
          handleBack={() => {
            this.setState({ showSessionTimeOut: false });
            Actions.pop();
          }}
          showSessionTimeoutModal={this.state.showSessionTimeOut}
        />

        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />
      </ImageBackground>
    );
  }
}

export default Security;
