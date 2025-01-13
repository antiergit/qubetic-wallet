import React, { useEffect, useRef, useState } from "react";
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
  Platform,
  ScrollView,
} from "react-native";
import { BlurView } from "@react-native-community/blur";
import { Colors, Fonts, Images } from "../../theme/";
import { ThemeManager } from "../../../ThemeManager";
import { Header } from "./Header";
import Singleton from "../../Singleton";
import { bigNumberSafeMath, CommaSeprator1, exponentialToDecimal, toFixedExp } from "../../Utils/MethodsUtils";
import { InputtextSearch } from "./InputTextSearch";
import * as Constants from "../../Constants";
import CrosschainSwapItem from "../screens/Swap/CrosschainSwapItem";
import FastImage from "react-native-fast-image";
import CountryFlag from "react-native-country-flag";
import { LanguageManager } from "../../../LanguageManager";
import { HeaderMain } from "./HeaderMain";
import LinearGradient from "react-native-linear-gradient";
import { SearchToken } from "./SearchToken";
import {
  getDimensionPercentage,
  hasNotchWithIOS,
  heightDimen,
} from "../../Utils";
import { useDispatch } from "react-redux";
import { getCrossChainCoinList } from "../../Redux/Actions";
import { LoaderView } from "./LoaderView";

let List = [];
const listData = [
  { title: "All" },
  { title: "BTC", coinFamily: 3, },
  { title: "ETH", coinFamily: 2, },
  { title: "BNB", coinFamily: 1, },
  { title: "POL", coinFamily: 4 },
  { title: 'SOL', coinFamily: 5 },
  {
    title: "TRX", coinFamily: 6,
  },
];


export const ChangellyCoinList = (props) => {
  const dispatch = useDispatch()
  const [selectedListIndex, setSelectedListIndex] = useState(0);
  const { commonText } = LanguageManager;
  const [coinList, setCoinList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [coinFamily, setCoinFamily] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState("");

  const searchRef = useRef(null)

  //******************************************************************************************/
  useEffect(() => {
    getCoinsApiData()
  }, []);


  const getCoinsApiData = async (page = 1, coinFamily, search = "") => {
    let apiData = {
      "page": page,
      "per_page": 20,
      "addresses": [
        Singleton.getInstance().defaultEthAddress,
        Singleton.getInstance().defaultBtcAddress,
        Singleton.getInstance().defaultTrxAddress,
        Singleton.getInstance().defaultSolAddress,
      ],
      "is_wallet": props?.isFrom,
      "fiat_type": Singleton.getInstance().CurrencySelected
    };
    if (coinFamily) {
      apiData = { ...apiData, coin_family: coinFamily }
    }
    if (search != "") {
      apiData = { ...apiData, search: search }
    }

    console.log("apiData>>>>", apiData);

    setLoading(true);
    dispatch(getCrossChainCoinList(apiData))
      .then(res => {
        setCoinList(page == 1 ? res?.data : [...coinList, ...res?.data])
        setTotalPages(res?.meta?.pages)
        setPage(page)
        setCoinFamily(coinFamily)
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      })
  };

  //******************************************************************************************/
  const filterFirstList = (value, index) => {
    setSearchText("")
    setSelectedListIndex(index)
    getCoinsApiData(1, value)
  }
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
        style={{
          flex: 1,
          backgroundColor: ThemeManager.colors.mainBgNew,
          //  paddingTop: Platform.OS === 'ios' ? 40 : 30
        }}
      >
        <View style={{ flex: 1 }}>
          <HeaderMain
            backCallBack={props.handleBack}
            BackButtonText={props.title ? props.title : commonText.ChooseAsset}
          />

          <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{ marginHorizontal: 15 }}
            >
              {listData.map((item, index) => (
                <>
                  <TouchableOpacity
                    key={index + ""}
                    style={[
                      styles.tabsViewNew,
                      {
                        // height: 50,
                        marginRight: 18,
                      },
                    ]}
                    onPress={() => filterFirstList(item?.coinFamily, index)}
                  >
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      colors={
                        ["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"]
                      }
                      style={styles.tabViewNew1}
                    >
                      <View style={{
                        alignItems: 'center',
                        justifyContent: "center",
                        backgroundColor: selectedListIndex == index ? "transparent" : ThemeManager.colors.mainBgNew,
                        height: 38,
                        width: "97%",
                        borderRadius: 12,
                      }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            color:
                              selectedListIndex == index
                                ? ThemeManager.colors.Mainbg
                                : ThemeManager.colors.lightGrayTextColor,
                            fontSize: 16,
                            fontFamily: Fonts.dmMedium,
                          }}
                        >
                          {item.title}
                        </Text>
                      </View>

                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ))}
            </ScrollView>
          </View>


          <View style={{ marginHorizontal: 10 }}>
            <SearchToken
              isIconsShow={false}
              value={searchText}
              onSubmitEditing={() => {
                getCoinsApiData(1, coinFamily, searchText)
              }}
              onChangeText={text => {
                setSearchText(text)
                clearTimeout(searchRef.current)
                searchRef.current = setTimeout(() => {
                  getCoinsApiData(1, coinFamily, text)

                }, 1000);
              }}
              inputProps={{
                autoCorrect: false,
              }}
            />
          </View>
          <View style={{ flex: 1, marginTop: 15 }}>
            <FlatList
              bounces={false}
              keyExtractor={(item, index) => index + ""}
              onScroll={props.onScroll}
              showsVerticalScrollIndicator={false}
              data={coinList}
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
                return (
                  <CrossChainItem
                    disabled={false}
                    onPress={() => {
                      if (props?.selectedCoin?.coinCode == item?.coinCode) {
                        props.onSamePair()
                      } else {
                        props.onPress(item)
                      }
                    }}
                    item={item}
                    index={index}
                    key={item?.id}
                  />
                );
              }}
              onEndReachedThreshold={0.3}
              onEndReached={() => {
                if (page < totalPages && !isLoading) {
                  getCoinsApiData(page + 1, coinFamily, searchText)
                }
              }}

            />
          </View>
        </View>
        <LoaderView isLoading={isLoading} />
      </ImageBackground>
    </Modal>
  );
};

const getCoinName = (item) => {
  const target = Constants.AssetList.find((val) => val.coin_family == item.coinFamily);
  if (target) {
    return target.coin_symbol.toUpperCase();
  }
  return "";
};

const CrossChainItem = (props) => {
  const { item, index } = props;
  const data = item?.coin_data;
  /******************************************************************************************/
  console.log("data?.coin_image>>>", data?.coin_image, data?.coin_name);

  return (
    <View
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
        key={data?.id || index}
        onPress={() => {
          props.onPress(index);
        }}
        disabled={props.disabled}
      >
        <View style={[styles.tokenItem, { flex: 1 }]}>
          <View style={[styles.tokenItem_first, { flex: 1 }]}>
            {(data?.coin_image == null || data?.coin_image == "null" || data?.coin_image == "") ? (
              <View
                style={[
                  styles.tokenImage_stylee,
                  { backgroundColor: ThemeManager.colors.mnemonicsBorder },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.tokenAbr_stylee,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {data?.coin_name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
            ) : (
              <View
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <Image style={styles.icon} source={{ uri: data?.coin_image }} />
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                // width: "70%",
                flex: 1
              }}
            >
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.tokenAbr_style,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {data?.coin_name}
                {data?.coin_family != null && (
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.tokenAbr_style,
                      { color: "#A1A1A1", fontSize: 11, marginLeft: 0 },
                    ]}
                  >
                    {(data.coin_family == 1)
                      ? " (BEP-20)"
                      : data.coin_family == 2
                        ? " (ERC-20)"
                        : data.coin_family == 4
                          ? " (POL ERC-20)"
                          : data.coin_family == 5
                            ? " (SPL)"
                            : data.coin_family == 6
                              ? " (TRC-20)"
                              : ""}
                  </Text>
                )}
              </Text>

            </View>
          </View>
          {item?.wallet_data?.balance ? <View style={{ flex: .4 }}>
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
              {Singleton.getInstance().isHideBalance ? "*****" : toFixedExp(item?.wallet_data?.balance, item?.wallet_data?.balance > 1 ? 2 : 4)} {!!data?.isToken ? data.name?.toUpperCase() : getCoinName(data)}
            </Text>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={[
                styles.tokenAbr_style,
                {
                  fontSize: 12,
                  fontFamily: Fonts.dmRegular,
                  color: ThemeManager.colors.blackWhiteText,
                  textAlign: 'right',
                  marginTop: 5
                },
              ]}
            >
              {Singleton.getInstance().CurrencySymbol}{(Singleton.getInstance().isHideBalance ? "*****" : toFixedExp(bigNumberSafeMath(item?.wallet_data?.balance, "*", item?.fiat_price_data?.value), 2))}
            </Text>
          </View> : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  TextStyle: {
    fontSize: 12,
    marginVertical: 2,
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
    backgroundColor: Colors.White,
    width: "100%",
    paddingHorizontal: getDimensionPercentage(15),
    flex: 1,
  },
  centeredView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
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

  //*************************************** STYLES OFRENDER ITEM OF LIST ***************************************/
  tokenItem: {
    alignItems: "center",
    marginHorizontal: 15,
    flexDirection: "row",
    // justifyContent: "space-between",
    paddingVertical: 8,
  },
  tokenItem_first: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tokenImage_stylee: {
    alignSelf: "center",
    width: 33,
    height: 33,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#B9CADB",
    //
  },
  tokenAbr_stylee: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    textAlign: "center",
  },
  tokenAbr_style: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: ThemeManager.colors.whiteText,
    marginRight: 5,
    marginLeft: 10,
  },
  icon: {
    width: 33,
    height: 33,
    borderRadius: 30,
  },
  tabsViewNew: {
    paddingVertical: 10,
    width: 60,
    borderRadius: 14,
  },
  tabViewNew1: {
    borderRadius: 12,
    height: 40,
    alignItems: "center",
    justifyContent: "center",

  },
});
