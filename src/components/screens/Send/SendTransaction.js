import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ThemeManager } from "../../../../ThemeManager";
import {
  AssetList,
  Button,
  Card,
  CardViewoption,
  HeaderMain,
  Input,
} from "../../common";
import { getDimensionPercentage as dimen, heightDimen } from "../../../Utils";
import { Fonts, Images } from "../../../theme";
import { LanguageManager } from "../../../../LanguageManager";
import images from "../../../theme/Images";
import fonts from "../../../theme/Fonts";
import LinearGradient from "react-native-linear-gradient";
import CardRow from "./CardRow";
import Singleton from "../../../Singleton";
import { CommaSeprator } from "../../../Utils/MethodsUtils";
import {
  getCheckerRequests,
  updateAccessReqByChecker,
} from "../../../Redux/Actions";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import TransactionFeeModal from "../../common/TransactionFeeModal";
import colors from "../../../theme/Colors";

const SendTransaction = (props) => {
  const reqData = props?.requestData;
  const coinImage = props?.selectedCoin?.coin_image;
  const coinSymbol = props?.selectedCoin?.coin_symbol;
  const coinName = props?.selectedCoin?.coin_name;
  const [integerPart, decimalPart] = props?.amount
    ? props?.amount?.split(".")
    : [0, 0];

  const toggleLoading = (status = false) => {
    if (props?.updateLoading) {
      props?.updateLoading?.(status);
    }
  };

  const onCancel = () => {
    toggleLoading(true);
    const data = {
      status: 2, // 1 - approved || 2 - rejected
      id: reqData.id, // 1 = access request id , 2 = trnx request id
      type: 2, // 1 = access request , 2 = trnx request
    };
    console.log("updateAccessReqByChecker data ------", data);
    updateAccessReqByChecker(data)
      .then((res) => {
        console.log(
          "CheckerReqModal onCancel res --------",
          JSON.stringify(res)
        );
        props.getCheckerRequests().then(res => {
          Actions.pop();
        });
      })
      .finally(() => {
        toggleLoading();
      });
  };

  return (
    <View style={{ backgroundColor: ThemeManager.colors.mainBgNew, flex: 1 }}>
      <HeaderMain
        BackButtonText={LanguageManager.makerchecker.signYourTransaction}
      />
      {!props?.isLoading && (
        <View style={styles.mainView}>
          <ScrollView
            contentContainerStyle={{}}
            style={{
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mainViewStyle}>
              <LabelWithText
                label={LanguageManager.makerchecker.walletAddress}
                value={reqData.to_address}
              />
              <LabelWithText
                label={LanguageManager.makerchecker.walletName}
                value={reqData.wallet_name}
              />

              <View style={{ alignItems: "center" }}>
                {coinImage && (
                  <Image
                    source={{ uri: coinImage }}
                    style={styles.teherImgStyle}
                  />
                )}
                <Text
                  style={[
                    styles.text1,
                    { color: ThemeManager.colors.darkLighttext },
                  ]}
                >
                  ≈ {Singleton.getInstance().CurrencySymbol}
                  {props?.fiatAmount}
                </Text>
                {/* <View style={{ flexDirection: "row", alignItems: "center",marginBottom:dimen(20) }}> */}
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    marginTop: -10,
                    marginBottom: dimen(30),
                    // marginTop: heightDimen(6),
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.balAmount,
                      { color: ThemeManager.colors.blackWhiteText },
                    ]}
                  >
                    {CommaSeprator(integerPart)}
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.bal,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      {"."}
                      {decimalPart} {coinSymbol.toUpperCase()}
                    </Text>
                  </Text>
                </View>
                {/* </View> */}
              </View>

              <LinearGradient
                colors={ThemeManager.colors.headerBgGradient}
                style={styles.main1}
                start={{ x: 0.28, y: -0.09 }}
                end={{ x: 0.15, y: 0.99 }}
              >
                <CardRow
                  text1={LanguageManager.makerchecker.asset}
                  text2={`${coinName}(${coinSymbol?.toUpperCase()})`}
                />
                <CardRow
                  text1={LanguageManager.makerchecker.from}
                  text2={reqData?.from_address}
                  isAddressTxt
                />
                <CardRow
                  text1={LanguageManager.makerchecker.to}
                  text2={reqData?.to_address}
                  isAddressTxt
                />
              </LinearGradient>

              <LinearGradient
                colors={ThemeManager.colors.headerBgGradient}
                style={{ borderRadius: 14, paddingBottom: dimen(15) }}
                start={{ x: 0.28, y: -0.09 }}
                end={{ x: 0.15, y: 0.99 }}
              >
                <CardRow
                  text1={LanguageManager.makerchecker.networkFee}
                  text2={`${props?.cryptoTransFee} ${props?.feeSymbol} (${Singleton.getInstance().CurrencySymbol
                    }${props?.fiatTransFee})`}
                  {...((props?.feeSymbol == "BNB" ||
                    props?.feeSymbol == "BTC") && {
                    imageData: Images.editKey,
                    onImgClicked: () => props?.toggleTransFeeModal?.(true),
                  })}
                />
                <CardRow
                  text1={LanguageManager.makerchecker.maxTotal}
                  text2={`${Singleton.getInstance().CurrencySymbol}${props?.maxTotal
                    }`}
                />
              </LinearGradient>
            </View>
          </ScrollView>
          <View style={{ flex: 0.2, paddingTop: dimen(12) }}>
            <Button
              buttontext={"Sign"}
              onPress={props?.onSign}
              customStyle={{ marginBottom: 12 }}
            />
            <Button buttontext={"Cancel"} onPress={onCancel} />
          </View>
        </View>
      )}
      <TransactionFeeModal
        visible={props?.showTransModal ?? false}
        {...(props?.selectedFeeType && {
          selectedFeeType: props?.selectedFeeType,
        })}
        {...(props?.transFeeProps && props?.transFeeProps)}
        {...(props?.isBnb && {
          isBnb: true,
          sendFun: props?.sendFun,
          sendFun2: props?.sendFun2,
          sendFun3: props?.sendFun3,
        })}
        onEditTransFee={props?.onEditTransFee}
        onClose={() => props?.toggleTransFeeModal?.()}
      />
    </View>
  );
};

export default connect(undefined, {
  getCheckerRequests,
})(SendTransaction);

const LabelWithText = ({ label, value }) => {
  return (
    <View style={{ marginTop: dimen(24) }}>
      <Text
        style={[
          {
            fontSize: dimen(14),
            lineHeight: dimen(21.17),
            fontFamily: Fonts.dmBold,
            color: ThemeManager.colors.grayBlack,
          },
        ]}
      >
        {label}
      </Text>
      <View
        style={{
          paddingVertical: dimen(16),
          paddingHorizontal: dimen(16),
          marginTop: dimen(8),
          backgroundColor: ThemeManager.colors.placeholderBg,
          borderRadius: dimen(14),
        }}
      >
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontFamily: Fonts.dmMedium,
            fontSize: dimen(16),
            color: colors.Black,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(24),
  },
  mainViewStyle: {
    flex: 0.9,
    marginBottom: dimen(16),
  },
  teherImgStyle: {
    height: dimen(72),
    width: dimen(72),
    borderRadius: dimen(26.18),
    marginTop: dimen(41),
  },
  text1: {
    marginVertical: dimen(10),
    fontSize: dimen(16),
    fontFamily: fonts.dmMedium,
  },
  text2: {
    fontSize: dimen(40),
    fontFamily: fonts.dmBold,
    marginBottom: dimen(30),
  },
  text3: {
    fontSize: dimen(40),
    fontFamily: fonts.dmLight,
  },
  main1: {
    borderRadius: dimen(14),
    marginBottom: dimen(10),
    paddingBottom: dimen(15),
  },
  bal: {
    textAlign: "center",
    fontSize: dimen(20),
    fontWeight: "200",
  },
  balAmount: {
    textAlign: "center",
    fontSize: dimen(40),
    fontFamily: Fonts.dmExtraLight,
    lineHeight: dimen(40),
  },
});
