import React, { Component } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  BackHandler,
  StyleSheet,
} from "react-native";
import styles from "./CurrencyStyle";
import { AppAlert, Button, Header, HeaderMain, LoaderView } from "../../common";
import { Colors, Images } from "../../../theme/";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import { requestCoinList, getCurrencyPref } from "../../../Redux/Actions";
import { connect } from "react-redux";
import { store } from "../../../Redux/Reducers";
import { getData, saveData } from "../../../Utils/MethodsUtils";
import Singleton from "../../../Singleton";
import FastImage from "react-native-fast-image";
import { BASE_IMAGE_URL } from "../../../EndPoint";
import Toast, { DURATION } from "react-native-easy-toast";
import { LanguageManager } from "../../../../LanguageManager";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import { Actions } from "react-native-router-flux";
import { onMakerDetailsChanged } from "../../../Utils/CheckerMarkerUtils";
import LinearGradient from "react-native-linear-gradient";
class Currency extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currencyList: [],
      isLoading: false,
      defaultCurrency: "",
      alertTxt: "",
      showAlertDialog: false,
      showLoader: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);

    this.props.navigation.addListener("didBlur", () => {
      this.setState({ showLoader: false, showAlertDialog: false });
    });
    getData(Constants.SELECTED_CURRENCY).then((symbol) => {
      this.setState({ defaultCurrency: symbol });
    });
    this.getCurrencyList();
  }

  handleBackButtonClick() {
    Actions.pop()

    return true;
  };
  /******************************************************************************************/
  getCurrencyList() {
    this.setState({ isLoading: true });
    this.props
      .getCurrencyPref()
      .then(async (res) => {
        console.log("getCurrencyPref===0", res)
        const currencyCode = await getData(Constants.SELECTED_CURRENCY);
        const newCurrenyList = res.filter(
          (item) =>
            item.currency_code.toLowerCase() == currencyCode?.toLowerCase()
        );
        if (newCurrenyList.length == 0) {
          this.itemPressed(res[0]);
          this.setState({ currencyList: res });
        } else {
          this.setState({ isLoading: false, currencyList: res });
        }
        saveData("currencyList", JSON.stringify(res));
      })
      .catch((err) => {
        if (
          err == LanguageManager.alertMessages.pleaseCheckYourNetworkConnection
        ) {
          setTimeout(() => {
            this.setState({
              showAlertDialog: true,
              alertTxt:
                LanguageManager.alertMessages.pleaseCheckYourNetworkConnection,
            });
          }, 500);
        }
        this.setState({ isLoading: false });
      });
  }

  /******************************************************************************************/
  async itemPressed(item) {
    if (!global.isConnected) {
      return this.setState({
        showAlertDialog: true,
        alertTxt:
          LanguageManager.alertMessages.pleaseCheckYourNetworkConnection,
      });
    }
    const data = {
      key: 2, // 1 wallet_name,2 fiat_currency,3 theme
      value: item.currency_code?.toLowerCase(),
    };
    onMakerDetailsChanged(data);
    this.setState({ isLoading: true });
    Singleton.getInstance().CurrencySymbol = item.currency_symbol;
    Singleton.getInstance().CurrencySelected = item.currency_code;
    await saveData(Constants.SELECTED_SYMBOL, item.currency_symbol);
    await saveData(Constants.SELECTED_CURRENCY, item.currency_code);
    this.setState({ defaultCurrency: item.currency_code }, () => {
      store
        .dispatch(requestCoinList({}))
        .then((res) => {
          this.setState({ isLoading: false });
          this.toast.show(LanguageManager.alchemy.currencyUpdated);
        })
        .catch((err) => {
          this.setState({ isLoading: false });
        });
    });
  }

  /******************************************************************************************/
  render() {
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <HeaderMain
          BackButtonText={LanguageManager.setting.nativeCurrency}
          customStyle={{ paddingHorizontal: widthDimen(24) }}
        />

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <TouchableWithoutFeedback style={{ flex: 1 }}>
            <View style={styles.ViewStyle1}>
              {this.state.currencyList?.map((item, index) => {
                return (
                  <>
                    <View key={index + ""} style={[styles.wallet_item, {}]}>
                      <TouchableOpacity
                        onPress={() => {
                          item.currency_code?.toLowerCase() ==
                            this.state.defaultCurrency?.toLowerCase()
                            ? ""
                            : this.itemPressed(item, index);
                        }}
                        style={[styles.touchableStyle, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}
                      >

                        <View style={[styles.ViewStyle]}>
                          <View style={{ flexDirection: "row" }}>
                            <FastImage
                              style={styles.imgStyle}
                              resizeMode="contain"
                              source={{
                                uri:
                                  item.image?.includes("https") ||
                                    item.image?.includes("http")
                                    ? item.image
                                    : BASE_IMAGE_URL + item.image,
                              }}
                            />

                            <Text
                              allowFontScaling={false}
                              style={[
                                styles.wallet_itemText,
                                {
                                  color: ThemeManager.colors.blackWhiteText,
                                },
                              ]}
                            >
                              {item.currency_code}
                            </Text>
                          </View>
                          {item.currency_code?.toLowerCase() ==
                            this.state.defaultCurrency?.toLowerCase() && (
                              <Image
                                source={Images.tickIcon}
                                style={{
                                  tintColor: ThemeManager.colors.primaryColor,
                                  resizeMode: "contain",
                                  height: dimen(9),
                                  width: dimen(13),
                                }}
                              />
                            )}
                        </View>
                      </TouchableOpacity>
                    </View >
                  </>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>


        {/* /****************************************************************************************** */}
        {
          this.state.showAlertDialog && (
            <AppAlert
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => {
                this.setState({ showAlertDialog: false });
              }}
            />
          )
        }
        {/* /****************************************************************************************** */}
        <LoaderView isLoading={this.state.isLoading} />
        <Toast
          ref={(toast) => (this.toast = toast)}
          position="center"
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />
      </ImageBackground >
    );
  }
}
const mapStateToProp = (state) => {
  const { currencyList } = state.walletReducer;
  return { currencyList };
};
export default connect(mapStateToProp, { requestCoinList, getCurrencyPref })(
  Currency
);
