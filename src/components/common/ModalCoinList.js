import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Platform
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { Colors, Fonts, Images } from "../../theme/";
import { ThemeManager } from "../../../ThemeManager";
import { Header } from "./Header";
import Singleton from "../../Singleton";
import { bigNumberSafeMath, CommaSeprator1, exponentialToDecimal, getData, toFixedExp } from "../../Utils/MethodsUtils";
import * as Constants from "../../Constants";
import CrosschainSwapItem from "../screens/Swap/CrosschainSwapItem";
import FastImage from "react-native-fast-image";
import CountryFlag from "react-native-country-flag";
import { LanguageManager } from "../../../LanguageManager";
import { HeaderMain } from "./HeaderMain";
import LinearGradient from "react-native-linear-gradient";
import { SearchToken } from "./SearchToken";
import { getDimensionPercentage, hasNotchWithIOS, heightDimen } from "../../Utils";
import { LoaderView } from "./LoaderView";

let List = [];

export const ModalCoinList = (props) => {
  const { commonText } = LanguageManager;
  const [CoinList, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  //******************************************************************************************/
  useEffect(() => {


    // console.log("herelist::::: ", props.list)
    List = props.showSearch || props.contactUs ? props.list : Constants.AssetList;
    setList(List);
    getData(Constants.MULTI_WALLET_LIST)
      .then(list => {
        let currentWallet = JSON.parse(list)

        currentWallet = currentWallet.find(res => res?.defaultWallet)
        if (currentWallet?.isPrivateKey) {

          List = List.filter((val) => val.coin_family == currentWallet?.coinFamily);
          console.log("currentWallet>>>", List);
          setList(List);
        }
      })

  }, [props.list]);

  //******************************************************************************************/
  const getTagLabel = (item) => {
    if (item.coin_family == 2 && item.is_token == 1) {
      return " (ERC-20)";
    } else if (item.coin_family == 1) {
      return " (BEP-20)";
    } else if (item.coin_family == 4 && item.is_token == 1) {
      return " (POL ERC-20)";
    } else if (item.coin_family == 5 && item.is_token == 1) {
      return " (SPL)";
    } else if (item.coin_family == 6 && item.is_token == 1) {
      return " (TRC-20)";
    } else {
      return "";
    }
  };

  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={props.openModel}
      onRequestClose={props.handleBack || props.onPressIn}
    >
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        {props.showSearch ? (
          // <SafeAreaView
          //   style={{ flex: 1, backgroundColor: ThemeManager.colors.lightBlack }}
          // >
          <View
            style={{
              flex: 1,

            }}
          >
            <View style={{ flex: 1 }}>
              <HeaderMain
                backCallBack={props.handleBack}
                BackButtonText={
                  props.title ? props.title : commonText.ChooseAsset
                }
              />
              {props.children}
              {(List?.length > 0 ||
                props.search?.length > 0 ||
                props.fromSearch == true) && (
                  <View
                    style={{ marginHorizontal: 10 }}
                  >
                    <SearchToken
                      isIconsShow={false}
                      value={props.search}
                      onSubmitEditing={props.onSubmitEditing}
                      onChangeText={props.onChangeNumber}
                    />
                  </View>
                )}
              <View style={{ flex: 1, marginTop: 15 }}>
                <FlatList
                  bounces={false}
                  keyExtractor={(item, index) => index + ""}
                  onScroll={props.onScroll}
                  showsVerticalScrollIndicator={false}
                  data={CoinList}
                  style={{ marginBottom: heightDimen(20) }}
                  ListEmptyComponent={() => {
                    return (
                      <View style={[styles.emptyView1, , props.noStyle]}>
                        <Text
                          allowFontScaling={false}
                          style={[
                            {
                              ...styles.textStyle,
                              color: ThemeManager.colors.blackWhiteText,
                            },
                          ]}
                        >
                          {commonText.NoListFound}
                        </Text>
                      </View>
                    );
                  }}
                  renderItem={({ item, index }) => {
                    return (<View
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        marginBottom: 10,
                        marginHorizontal: 15,
                        padding: 5,
                        backgroundColor: ThemeManager.colors.mnemonicsBg
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (props?.isFrom == 'From') {
                            setLoading(true)
                            setTimeout(() => {
                              setLoading(false)
                            }, 3000);
                          }
                          props.onPress(item)
                        }}
                        style={[
                          styles.ViewStyle,
                          // { marginBottom: index == List.length - 1 ? 30 : 0 },
                        ]}
                      >
                        {item?.coin_image ? (
                          <FastImage
                            resizeMode="contain"
                            style={[
                              styles.imgCoin,
                              {
                                backgroundColor:
                                  ThemeManager.colors.borderUnderLine,
                              },
                            ]}
                            source={{ uri: item?.coin_image }}
                          />
                        ) : (
                          <View
                            style={[
                              styles.ViewStyle2,

                            ]}
                          >
                            <Text
                              allowFontScaling={false}
                              style={{ color: ThemeManager.colors.blackWhiteText }}
                            >
                              {item?.coin_name?.charAt(0)}
                            </Text>
                          </View>
                        )}
                        <View
                          style={[
                            styles.ViewStyle3,
                            { flex: 1 }
                          ]}
                        >
                          <View style={[styles.ViewStyle1, { flex: 0.7 }]}>
                            <View style={{ flexDirection: "row", flex: 1, alignItems: 'center' }}>
                              <Text
                                numberOfLines={1}
                                allowFontScaling={false}
                                style={[
                                  styles.txtCoin,
                                  {
                                    color: ThemeManager.colors.blackWhiteText
                                  },
                                ]}
                              >
                                {item?.coin_name?.toString().length > 11
                                  ? item?.coin_name?.substring(0, 9) + "..."
                                  : item?.coin_name}
                              </Text>
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.TextStyle,
                                  { color: ThemeManager.colors.blackWhiteText, flex: 1 },
                                ]}
                              >
                                {getTagLabel(item)}
                              </Text>
                            </View>
                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                              {item?.fiat_price_data?.price_change_percentage_24h
                                ?.toString()
                                .includes("-") ? (
                                <View style={styles.viewStyle22}>
                                  <Image
                                    style={{
                                      height: 8,
                                      width: 6,
                                      resizeMode: "contain",
                                    }}
                                    source={Images.loss}
                                  />
                                  <Text
                                    allowFontScaling={false}
                                    style={[
                                      styles.titleTextStyleNew,
                                      { color: Colors.lossColor, paddingLeft: 2 },
                                    ]}
                                  >
                                    {item?.fiat_price_data
                                      ?.price_change_percentage_24h
                                      ? item?.fiat_price_data?.price_change_percentage_24h
                                        .toFixed(2)
                                        .toString()
                                        .replace(/[-]/g, "")
                                      : 0.0}
                                    %
                                  </Text>
                                </View>
                              ) : (
                                <View style={styles.viewStyle22}>
                                  <Image
                                    style={{
                                      height: 8,
                                      width: 6,
                                      resizeMode: "contain",
                                    }}
                                    source={Images.gain}
                                  />
                                  <Text
                                    allowFontScaling={false}
                                    style={[
                                      styles.titleTextStyleNew,
                                      {
                                        color: Colors.profitColor,
                                        paddingLeft: 2,
                                      },
                                    ]}
                                  >
                                    {item?.fiat_price_data
                                      ?.price_change_percentage_24h
                                      ? (item?.fiat_price_data?.price_change_percentage_24h).toFixed(
                                        2
                                      )
                                      : 0.0}
                                    %
                                  </Text>
                                </View>
                              )}
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.txtValue,
                                  { color: ThemeManager.colors.legalGreyColor },
                                ]}
                              >
                                {Singleton.getInstance().CurrencySymbol}
                                {parseFloat(item?.fiat_price_data?.value) > 0
                                  ? CommaSeprator1(
                                    parseFloat(
                                      exponentialToDecimal(
                                        item?.fiat_price_data?.value
                                      )
                                    ),
                                    2
                                  )
                                  : "0.00"}{" "}


                              </Text>
                            </View>
                          </View>

                          {/* {item?.wallets?.[0]?.balance ? <View style={{ flex: .4 }}>
                            <Text
                              // numberOfLines={1}
                              allowFontScaling={false}
                              style={[
                                styles.tokenAbr_style,
                                {
                                  fontSize: 12,
                                  fontFamily: Fonts.dmRegular,
                                  color: ThemeManager.colors.blackWhiteText,
                                  textAlign: 'right',
                                },
                              ]}
                            >
                              {toFixedExp(item?.wallets?.[0]?.balance, item?.wallets?.[0]?.balance > 1 ? 2 : 4)} {item.coin_symbol?.toUpperCase()}
                            </Text>
                            <Text
                              numberOfLines={1}
                              allowFontScaling={false}
                              style={[
                                styles.tokenAbr_style,
                                {
                                  fontSize: 12,
                                  fontFamily: Fonts.dmRegular,
                                  color: ThemeManager.colors.lightText,
                                  marginTop: 5,
                                  color: ThemeManager.colors.blackWhiteText,
                                  textAlign: 'right',
                                },
                              ]}
                            >
                              {Singleton.getInstance().CurrencySymbol}{toFixedExp(bigNumberSafeMath(item?.wallets?.[0]?.balance, "*", item?.fiat_price_data?.value), 2)}
                            </Text>
                          </View> : null} */}

                          <View>



                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    );
                  }}
                />
              </View>
            </View>
          </View>
          // {/* </SafeAreaView> */}
        ) : props.showReceive ? (
          <View style={[styles.centeredView]}>
            <TouchableOpacity
              onPress={props.onPressIn}
              style={[styles.centeredView1]}
            />
            <View style={styles.modalView}>
              <Pressable
                style={{ paddingVertical: 5 }}
                onPressIn={props.onPressIn}
              >
                <Image
                  style={{
                    alignSelf: "center",
                    marginTop: 20,
                    tintColor: ThemeManager.colors.colorVariationBorder,
                  }}
                  source={Images.modal_top_line}
                />
              </Pressable>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.settingsText },
                ]}
              >
                {commonText.Select}
              </Text>
              {props.children}
            </View>
          </View>
        ) : props.contactUs ? (
          <View style={[styles.centeredView]}>
            <TouchableOpacity
              onPress={props.onPressIn}
              style={[styles.centeredView1]}
            />
            <View
              style={[
                styles.modalView,
                { backgroundColor: ThemeManager.colors.bottomSheetColor },
              ]}
            >
              <Pressable
                style={{ paddingVertical: 5 }}
                onPressIn={props.onPressIn}
              >
                <Image
                  style={{
                    alignSelf: "center",
                    marginTop: 20,
                    tintColor: ThemeManager.colors.colorVariationBorder,
                  }}
                  source={Images.modal_top_line}
                />
              </Pressable>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.settingsText },
                ]}
              >
                {props.title || commonText.ChooseNetwork}
              </Text>
              {List?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index + ""}
                    onPress={() => {
                      if (props?.isFrom == 'From') {
                        setLoading(true)
                        setTimeout(() => {
                          setLoading(false)
                        }, 3000);
                      }
                      props.onPress(item)
                    }}
                    style={[
                      styles.touchableStyle,
                      {
                        borderWidth: 1,
                        borderColor: ThemeManager.colors.borderColor,
                      },
                    ]}
                  >
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textStyle1,
                        { color: ThemeManager.colors.settingsText },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={[styles.centeredView, {
          }]}>
            <HeaderMain
              backCallBack={props.onPressIn}
              BackButtonText={"Network"}
            />
            <View style={[styles.modalView,]}>

              {CoinList.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index + ""}
                    onPress={() => {
                      if (props?.isFrom == 'From') {
                        setLoading(true)
                        setTimeout(() => {
                          setLoading(false)
                        }, 3000);
                      }
                      props.onPress(item)
                    }}
                    style={[
                      styles.touchableStyle,
                      {
                        borderBottomWidth: 1,
                        borderColor: ThemeManager.colors.dividerColor,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      {item.coin_image ? (
                        <Image
                          style={styles.imgStyle}
                          source={{ uri: item.coin_image }}
                        />
                      ) : (
                        <View
                          style={[
                            styles.tokenImage_stylee,
                            { backgroundColor: ThemeManager.colors.settingsText },
                          ]}
                        >
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.tokenAbr_stylee,
                              { color: ThemeManager.colors.whiteText },
                            ]}
                          >
                            {item?.coin_name?.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.textStyle1,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {item.coin_name}
                      </Text>
                    </View>
                    <Image style={{ tintColor: ThemeManager.colors.legalGreyColor }} source={ThemeManager.ImageIcons.forwardIcon} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
        <LoaderView isLoading={loading} />
      </ImageBackground>
    </Modal>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  TextStyle: {
    fontSize: 12,
  },
  emptyView1: {
    alignSelf: "center",
    marginTop: Dimensions.get("screen").height / 2.5,
  },
  viewStyle22: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 3,
  },
  titleTextStyleNew: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    paddingRight: 5,
  },
  ViewStyle1: {
    flexDirection: "column",
    marginLeft: 13,
  },
  ViewStyle3: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingVertical: 8,
  },
  txtCoin: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
  },
  txtValue: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: ThemeManager.colors.lightText,
  },
  ViewStyle2: {
    height: 33,
    alignSelf: "center",
    width: 33,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  imgCoin: {
    width: 33,
    height: 33,
    borderRadius: 30,
    resizeMode: "contain",
    alignSelf: "center",
  },
  ViewStyle: {
    flexDirection: "row",
    // width: "95%",
    flex: 1,
    marginHorizontal: 15,
    // paddingVertical:8,
    justifyContent: "center",
    alignSelf: "center",
  },
  tokenImage_stylee: {
    alignSelf: "center",
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  tokenAbr_stylee: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
  },
  textStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },
  textStyle1: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
    textAlign: "center",
  },
  modalView: {
    width: "100%",
    paddingHorizontal: getDimensionPercentage(15),
    flex: 1,
  },
  centeredView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  centeredView1: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  touchableStyle: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 5,
    justifyContent: "space-between",
  },
  imgStyle: {
    height: 32,
    width: 32,
    borderRadius: 32,
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  tokenAbr_style: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: ThemeManager.colors.whiteText,
    marginRight: 5,
    marginLeft: 10,
  },
});
