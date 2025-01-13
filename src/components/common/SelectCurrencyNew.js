/* eslint-disable react-native/no-inline-styles */
import { Dimensions, Image, ImageBackground, Platform } from "react-native";
import React from "react";
import { Fonts, Colors, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
const { width } = Dimensions.get('window')
const SelectCurrencyNew = (props) => {
  const { commonText } = LanguageManager;

  /******************************************************************************************/
  const getBalance = (item) => {
    const wallets = item?.wallets || item?.wallet_data;
    const isValid =
      (wallets && Object.keys(wallets)?.length > 0) || wallets?.length > 0;
    if (isValid) {
      const bal = Array.isArray(wallets)
        ? wallets[0]?.balance
        : wallets.balance;
      const NewBal =
        bal < 0.000001
          ? toFixedExp(bal, 8)
          : bal < 0.0001
            ? toFixedExp(bal, 6)
            : toFixedExp(bal, 4);
      return " " + NewBal + ` ${item?.coin_symbol?.toUpperCase()}`;
    } else {
      return " " + "0.00" + ` ${item?.coin_symbol?.toUpperCase()}`;
    }
  };

  /******************************************************************************************/
  const getFiatValue = (item, amount) => {
    // console.log("onChangeNumber-====item==", item)

    const fiatval = item.fiat_price_data?.value;
    // console.log("onChangeNumber-====amount==", amount)
    // console.log("onChangeNumber-====fiatval==", fiatval)

    const value = toFixedExp(parseFloat(amount) * parseFloat(fiatval), 2);
    // console.log("onChangeNumber-====value==", value)

    return isNaN(value) || value == 0 ? "0.00" : value;
  };

  /******************************************************************************************/
  return (
    <View>
      {props.balance && (
        <View
          style={[
            styles.abvlWrapStyle,
            {
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 5,
            },
          ]}
        >
          {props.min ? (
            <Text allowFontScaling={false} style={[styles.abvlWrapTextStyle, { color: ThemeManager.colors.blackWhiteText }, props.custStyle]}>{commonText.Range}: {(props.min) + ' - ' + props.max}{` ${props.currency}`}</Text>
          ) : props.showRange == true ? (
            <Text allowFontScaling={false} style={[styles.abvlWrapTextStyle, { color: ThemeManager.colors.blackWhiteText }, props.custStyle]}>{commonText.Range}: {'0.00' + ' - ' + '0.00'}{` ${props.currency}`}</Text>
          ) : null}
        </View>
      )}
      <View
        style={[
          styles.inputandselectStyle,
          props.inputandselectStyle,
          {
            borderRadius: 14,
            backgroundColor: ThemeManager.colors.mnemonicsBg,
            overflow: "hidden",
          },
        ]}
      >

        <View style={[styles.inputStyle__left]}>
          {props?.text && <Text
            style={{
              color: ThemeManager.colors.primaryColor,
              fontSize: getDimensionPercentage(15),
              marginTop: 10,
              fontFamily: fonts.dmMedium,
            }}
          >
            {props.text}
          </Text>}
          <TextInput
            allowFontScaling={false}
            style={[
              styles.inputStyle,
              {
                color: ThemeManager.colors.blackWhiteText,
                fontSize:
                  props?.value?.length > 10 && props?.type == "to"
                    ? getDimensionPercentage(18)
                    : getDimensionPercentage(26),
                fontFamily: Fonts.dmMedium,
              },
            ]}
            editable={props.editable}
            placeholder={props.placeholder}
            onChangeText={props.onChangeNumber}
            maxLength={props.maxLength}
            placeholderTextColor={ThemeManager.colors.greenWhite}
            value={props.value}
            keyboardType={"numeric"}
            onBlur={props.onBlur}
            numberOfLines={!props.editable ? 1 : undefined}
          />
          {props.fromBuy ? null : (
            <Text
              allowFontScaling={false}
              style={{
                marginTop: -10,
                paddingLeft: 6,
                fontFamily: Fonts.dmRegular,
                fontSize: getDimensionPercentage(16),
                lineHeight: getDimensionPercentage(24),
                color: ThemeManager.colors.legalGreyColor,
                // maxWidth:width/3,
                marginBottom: 10,
                lineHeight: 30,
              }}
            >
              {
                props.item
                  ? Singleton.getInstance().CurrencySymbol +
                  getFiatValue(props.item, props.tokenOneAmount)
                  : Singleton.getInstance().CurrencySymbol + "0.00"
                // '$0.00'
              }
            </Text>
          )}
        </View>

        <View style={{ alignItems: "flex-end", paddingRight: 5 }}>
          <TouchableOpacity
            disabled={props.disabled}
            onPress={props.onPressCoin}
            style={[styles.currencySelectOption]}
          >
            <View style={styles.imgView}>
              {props.item?.coin_image ? (
                <Image
                  source={{ uri: props.item?.coin_image }}
                  style={styles.imgStyle}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.ViewStyle}>
                  <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>
                    {props.item?.coin_name?.charAt(0)?.toUpperCase()}
                  </Text>
                </View>
              )}
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: 8,
                  color: ThemeManager.colors.blackWhiteText,
                  fontSize: 16,
                  fontFamily: Fonts.dmRegular,
                }}
              >
                {props.item ? props.item?.coin_symbol?.toUpperCase() : "--"}
              </Text>

              {props.fromBuy ? null : (
                <Image
                  style={{
                    marginLeft: 10,
                    tintColor: ThemeManager.colors.blackWhitePure,
                  }}
                  source={ThemeManager.ImageIcons.dropDown}
                />
              )}
            </View>
          </TouchableOpacity>
          {props.fromBuy ? null : (
            <Text
              allowFontScaling={false}
              style={{
                marginTop: 15,
                marginRight: 8,
                color: ThemeManager.colors.legalGreyColor,
                fontSize: getDimensionPercentage(14),
                fontFamily: Fonts.dmRegular,
              }}
            >
              {commonText.Balance}:
              <Text
                allowFontScaling={false}
                style={{
                  color: ThemeManager.colors.blackWhitePure,
                  fontSize: 12,
                  fontFamily: Fonts.dmRegular,
                }}
              >
                {props.item ? getBalance(props.item) : " ---"}
              </Text>
            </Text>
          )}
        </View>
        {/* </LinearGradient> */}
      </View>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  abvlWrapStyle: {
    justifyContent: 'flex-end',
  },
  abvlWrapTextStyle: {
    color: ThemeManager.colors.lightText,
    fontSize: 12,
    fontFamily: Fonts.dmMedium,
  },
  ViewStyle: {
    justifyContent: "center",
    height: 26,
    width: 26,
    borderRadius: 10,
  },
  textStyle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: Fonts.dmSemiBold,
  },
  imgView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imgStyle: {
    height: 26,
    width: 26,
    borderRadius: 8,
    alignSelf: "center",
  },
  inputandselectStyle: {
    flexDirection: "row",
  },
  inputStyle__left: {
    flex: 1,
    marginLeft: 10,
  },
  inputStyle: {
    textAlign: "left",

    color: Colors.White,
    fontSize: 25,
    fontFamily: Fonts.dmSemiBold,
    justifyContent: "center",
    alignItems: "center",
    height: 55,
  },
  currencySelectOption: {
    position: "relative",
    paddingRight: 15,
    paddingTop: 15,
  },
});

export { SelectCurrencyNew };
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  StyleSheet,
} from "react-native";
import { toFixedExp } from "../../Utils/MethodsUtils";
import Singleton from "../../Singleton";
import { LanguageManager } from "../../../LanguageManager";
import LinearGradient from "react-native-linear-gradient"; import { getDimensionPercentage } from "../../Utils";
import fonts from "../../theme/Fonts";

