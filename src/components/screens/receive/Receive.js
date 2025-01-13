import React, { Component, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Clipboard,
  Share,
  ScrollView,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import styles from "./ReceiveStyle";
import { AppAlert, Button, GradientBorderView, HeaderMain } from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import Singleton from "../../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../../Constants";
import { getCryptoAddress } from "../../../Utils/MethodsUtils";
import { LanguageManager } from "../../../../LanguageManager";
import {
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import FastImage from "react-native-fast-image";
import Toast from "react-native-easy-toast";
import { Colors, Images } from "../../../theme";
import CustomQRCode from "./CustomQRCode";
import { showMessage } from "react-native-flash-message";
const { width } = Dimensions.get('window');

class Receive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhrase: false,
      walletAddress: getCryptoAddress(this.props.selectedCoin?.coin_family),
      showAlertDialog: false,
      alertTxt: "",
      selectedData: this.props.selectedCoin,
      isDisable: false,
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    console.log(
      "this.props.selectedCoin?.coin_family:::::",
      this.props.selectedCoin?.coin_family

    );
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({ showAlertDialog: false, alertTxt: "" });
    });
    this.setState({
      walletAddress: getCryptoAddress(this.props.selectedCoin?.coin_family),
    });
    this.props.navigation.addListener("didFocus", (event) => {
      this.setState({ isDisable: false });
    });
    EventRegister.addEventListener("enableTouchable", (data) => {
      this.setState({ isDisable: false });
    });
    console.log("addresss>>>>", Singleton.getInstance().defaultBtcAddress);
    console.log("addresss>>>>2", getCryptoAddress(this.props.selectedCoin?.coin_family));

  }

  /******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    const { alertMessages } = LanguageManager;
    await Clipboard.setString(this.state.walletAddress);
    this.setState({
      showAlertDialog: true,
      alertTxt: alertMessages.walletAddressCopied,
    });
    if (this.props.showHeader == "true")
      this.setState({
        showAlertDialog: true,
        alertTxt: alertMessages.walletAddressCopied,
      });
  };

  tokenType() {
    return this.state.selectedData.is_token == 1 ? this.state.selectedData.coin_family == 2
      ? "ERC(20)"
      : this.state.selectedData.coin_family == 1
        ? "BEP(20)"
        : this.state.selectedData.coin_family == 4
          ? "POL ERC(20)"
          : this.state.selectedData.coin_family == 6
            ? "TRC(20)"
            : ""
      : ""
  }

  /******************************************************************************************/
  shareAddress(addressTxt, address) {
    const symbol =
      this.state.selectedData.is_token == 1
        ? this.state.selectedData.coin_family == 2
          ? " ERC-20"
          : this.state.selectedData.coin_family == 1
            ? " BEP-20"
            : this.state.selectedData.coin_family == 4
              ? " POL ERC-20"
              : this.state.selectedData.coin_family == 6
                ? " TRC-20"
                : this.state.selectedData.coin_family == 5
                  ? " SPL(SOL)" : ""
        : Constants.COIN_INFO_BY_FAMILY[this.state.selectedData.coin_family].coin_symbol;
    try {
      this.setState({ isDisable: true });
      // Singleton.isCameraOpen = true;
      Singleton.isPermission = true;

      const result = Share.share({
        message: "Qubetics wallet\nMy " + symbol?.toUpperCase() + " Address: " + address,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("hererrere2");
        } else {
          console.log("hererrere1");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("hererrere");
      }
    } catch (error) {
      console.log("hererrere111");
    }
  }

  onPressLearnMore() {
    alert("Coming soon")
  }
  /******************************************************************************************/
  render() {
    const { walletMain, merchantCard, receive } = LanguageManager;
    const { selectedData } = this.state;
    const qrSize = 200; // Size of the QR Code
    const cornerSize = 50; // Size of corner gradients or images
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"always"}
        >
          <HeaderMain
            BackButtonText={
              walletMain.receive +
              " " +
              `${selectedData.coin_symbol.toUpperCase()}`
            }
            customStyle={{ paddingHorizontal: widthDimen(24) }}
          />
          <View style={{}}>
            {/* <Text allowFontScaling={false} style={[styles.copyShareButtonsText, { color: ThemeManager.colors.newTitle }]}>{selectedData.coin_symbol.toUpperCase()}{selectedData.is_token != 1 ? null : selectedData.coin_family == 2 ? ' ERC(20)' : selectedData.coin_family == 1 ? ' BEP(20)' : selectedData.coin_family == 4 ? ' MATIC ERC(20)' : null}{' '}{receive.address}</Text> */}

            <View style={styles.qrBlock}>


              <CustomQRCode address={this.state.walletAddress} />
            </View>
            <View
              style={[styles.qrAddress, { borderColor: ThemeManager.colors.inputBorder }]}
            >
              <View style={{ flex: 1, marginRight: widthDimen(10) }}>
                <Text style={{ fontSize: 12, color: ThemeManager.colors.legalGreyColor }}>Your {Constants.COIN_INFO_BY_FAMILY[selectedData.coin_family].coin_name} Address</Text>


                <Text
                  numberOfLines={1}
                  allowFontScaling={false}
                  style={[
                    styles.qrAddressTextStyle,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {this.state.walletAddress}
                </Text>
              </View>
              <TouchableOpacity onPress={this.set_Text_Into_Clipboard}>
                <GradientBorderView mainStyle={styles.copyButton}>
                  <Text style={[styles.copyButtonText, { color: ThemeManager.colors.blackWhiteText, }]}>Copy</Text>
                  <Image style={{ tintColor: ThemeManager.colors.blackWhiteText, }} source={Images.copyDarkButton} />
                </GradientBorderView>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: widthDimen(21),
              marginTop: heightDimen(30),
            }}
          >


            <Text
              style={[
                styles.warningText,
                { color: ThemeManager.colors.placeholderBg },
              ]}
            >
              Send only {selectedData.coin_symbol == 'eth' ? "Ethereum (ETH)" : selectedData.coin_symbol == 'bnb' ? 'BNB smart chain' : selectedData.coin_symbol.toUpperCase()} to this address.
              Sending any other coins may result in permanent loss.
            </Text>

            {this.tokenType() != "" && <Text
              style={[
                styles.warningText,
                { color: ThemeManager.colors.placeholderBg, marginTop: heightDimen(5) },
              ]}
            ><Text onPress={this.onPressLearnMore} style={{ color: ThemeManager.colors.primaryColor }}>Learn more</Text> about {this.tokenType()} tokens.</Text>
            }
          </View>
        </ScrollView>
        <View style={[styles.textContainer, { bottom: 5 }]}>

          <Button
            onPress={() => {
              clearTimeout(this.shareAddressRef)
              this.shareAddressRef = setTimeout(() => {
                this.shareAddress(
                  `${selectedData.coin_symbol.toUpperCase()}`,
                  this.state.walletAddress
                );
              }, 800);
            }}
            customStyle={{ flex: 1 }}
            buttontext={receive.shareYourAddress} />
        </View>
        <Toast
          ref={(toast) => (this.toast = toast)}
          position="bottom"
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={true}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}
      </ImageBackground>
    );
  }
}

export default Receive;
