import { StyleSheet } from "react-native";
import { Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageBackground,
} from "react-native";
import React from "react";
import colors from "../../theme/Colors";
import FastImage from "react-native-fast-image";
import { Divider } from "./Divider";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../Utils";
import { SvgUri } from "react-native-svg";

export const ManageItem = (props) => {
  /******************************************************************************************/
  return (
    <View
      style={[
        styles.privacyView,
        { backgroundColor: ThemeManager.colors.mnemonicsBg },
      ]}
    >
      <TouchableOpacity onPress={props?.onclickWallet}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", marginLeft: dimen(21) }}>
            {props?.logo?.uri?.includes(".svg") ? (
              <SvgUri
                uri={props?.logo?.uri}
                style={[{
                  resizeMode: "contain",
                  alignSelf: "center",
                  height: dimen(35),
                  width: dimen(35),
                }, props?.logoStyle]}
              />
            ) : <Image
              source={props?.logo ? props?.logo : ThemeManager.ImageIcons.logoTextImg}
              style={[{
                resizeMode: "contain",
                alignSelf: "center",
                height: dimen(35),
                width: dimen(35),
              }, props?.logoStyle]}
            />}

            <View style={[{ marginLeft: dimen(17), flex: 0.8 }, props?.nameViewStyle]}>
              <Text
                style={[
                  styles.walletNameText,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {props?.walletName}
              </Text>
              <Text
                style={[
                  styles.subwallText,
                  { color: ThemeManager.colors.legalGreyColor, },
                ]}
                numberOfLines={1}
              >
                {props?.walletType}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {props?.firstIcon && (
              <TouchableOpacity onPress={props?.onClickFirst}>
                <Image style={{ marginRight: 15 }} source={props?.firstIcon} />
              </TouchableOpacity>
            )}
            {props?.secondIcon && (
              <TouchableOpacity
                style={{ paddingHorizontal: 15, paddingVertical: 5 }}
                onPress={props?.onClickSecond}
              >
                <Image
                  source={props?.secondIcon}
                  style={{
                    // marginRight: dimen(15),
                    height: dimen(20),
                    width: dimen(20),
                    resizeMode: "contain",
                    // backgroundColor:'red'
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* <Divider /> */}
      </TouchableOpacity>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    borderBottomWidth: 1,
    marginLeft: 13,
    paddingBottom: 15,
  },
  walletNameText: {
    fontFamily: Fonts.dmBold,
    fontSize: dimen(18),
    lineHeight: dimen(23),
    textTransform: "capitalize",
  },
  subwallText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
  },
  privacyView: {
    borderRadius: dimen(12),
    marginBottom: dimen(16),
    width: "100%",
    overflow: "hidden",
    paddingVertical: dimen(16),
    borderColor: ThemeManager.colors.carBorder,
    overflow: "hidden",
    // marginTop: dimen(20),
    // marginBottom: dimen(16)
    // marginTop: heightDimen(16)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
