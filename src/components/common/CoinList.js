/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import { Fonts, Colors, Images } from "../../theme";
import { Actions } from "react-native-router-flux";
import { ThemeManager } from "../../../ThemeManager";
import fonts from "../../theme/Fonts";
import { CommaSeprator1, toFixedExp } from "../../Utils/MethodsUtils";
import { AreaChart, Path } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { LanguageManager } from "../../../LanguageManager";
import { Divider } from "./Divider";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../layouts/responsive";
import images from "../../theme/Images";
import LinearGradient from "react-native-linear-gradient";
import { dynamicFont, dynamicFontNew, heightDimen } from "../../Utils";

import {
  getDimensionPercentage as dimen,

  widthDimen,
} from '../../Utils';
import { platform } from "process";
import Singleton from "../../Singleton";
import { log } from "console";
import { GradientBorderView } from "./GradientBorderView";
//******************************************************************************************/
const Line = ({ line }) => (
  <Path key={"line"} d={line} stroke={Colors.successColor} fill={"none"} />
);
//******************************************************************************************/
const Line1 = ({ line }) => (
  <Path key={"line"} d={line} stroke={Colors.lossColor} fill={"none"} />
);

//******************************************************************************************/
const pressItem = (
  item,
  showTransactionHistory,
  themeSelected,
  selectCoin,
  updateSelectedCoin,
  action_type,
  tabType
) => {

  console.log("item>>>>", item);


  if (showTransactionHistory == "true") {
    return (
      Actions.currentScene != "TransactionHistory" &&
      Actions.TransactionHistory({
        selectedCoin: item,
        themeSelected: themeSelected,
      })
    );
  }
  if (selectCoin) {
    return updateSelectedCoin(item);
  }
  if (action_type == "send") {
    if (item.coin_family == 1 || item.coin_family == 4 || item.coin_family == 7)
      Actions.currentScene != "SendBnbPol" && Actions.SendBnbPol({
        selectedCoin: item,
        tabType: tabType,
        themeSelected: themeSelected
      })

    else if (item.coin_family == 2)
      Actions.currentScene != "Send" && Actions.Send({
        selectedCoin: item,
        tabType: tabType,
        themeSelected: themeSelected
      })
    else if (item.coin_family == 3)
      Actions.currentScene != "SendBtc" &&
        Actions.SendBtc({
          selectedCoin: item,
          tabType: tabType,
          themeSelected: themeSelected
        })
    else if (item.coin_family == 5)
      Actions.currentScene != "SendSol" &&
        Actions.SendSol({
          selectedCoin: item,
          tabType: tabType,
          themeSelected: themeSelected
        })

    else if (item.coin_family == 6)
      Actions.currentScene != "SendTrx" &&
        Actions.SendTrx({
          selectedCoin: item,
          tabType: tabType,
          themeSelected: themeSelected
        })
  } else {

    Actions.currentScene != "Receive" &&
      Actions.Receive({
        selectedCoin: item,
        tabType: tabType,
        themeSelected: themeSelected
      })



  }
};

//******************************************************************************************/
const getValue = (bal) => {
  if (bal > 0) {
    const NewBal =
      bal < 0.000001
        ? toFixedExp(bal, 8)
        : bal < 0.0001
          ? toFixedExp(bal, 6)
          : toFixedExp(bal, 4);
    return NewBal;
  } else return "0.0000";
};

//******************************************************************************************/
const getFiatValue = (bal) => {
  if (bal > 0) {
    const NewBal =
      bal < 0.000001
        ? toFixedExp(bal, 8)
        : bal < 0.0001
          ? toFixedExp(bal, 6)
          : toFixedExp(bal, 2);
    return NewBal;
  } else return "0.00";
};

//******************************************************************************************/
const Item = ({
  hideGraph,
  item,
  tabType,
  index,
  showTransactionHistory,
  selectCoin,
  updateSelectedCoin,
  action_type,
  themeSelected,
  isHideBalance
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        pressItem(
          item,
          showTransactionHistory,
          themeSelected,
          selectCoin,
          updateSelectedCoin,
          action_type,
          tabType
        )
      }
    >
      <View  >
        <View style={styles.viewStyle}>
          <View style={styles.viewStyle3}>
            {item.coin_image ? (
              <Image
                style={[styles.imgStyle]}
                source={{ uri: item.coin_image }}
              />
            ) : (
              <View
                style={[
                  styles.imgViewStyle,
                  { backgroundColor: ThemeManager.colors.placeholderColorNew },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={{ color: ThemeManager.colors.primaryColor, fontSize: heightDimen(22) }}
                >
                  {item?.coin_name?.charAt(0)}
                </Text>
              </View>
            )}

            <View style={{ paddingLeft: 8, justifyContent: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={[
                    styles.titleTextStyle,
                    {
                      overflow: "hidden",
                      color: ThemeManager.colors.blackWhiteText,
                    },
                  ]}
                >
                  {hideGraph
                    ? item.is_token == 1
                      ? item?.coin_name?.toString().length > 8
                        ? item?.coin_name?.substring(0, 7) + "..."
                        : item.coin_name
                      : item?.coin_name?.toString().length > 8
                        ? item?.coin_name?.substring(0, 7) + "..."
                        : item.coin_name
                    : item.coin_family == 4 && item.is_token == 1
                      ? item?.coin_name?.substring(0, 4) + "..."
                      : item?.coin_name?.toString().length > 8
                        ? item?.coin_name?.substring(0, 7) + "..."
                        : item.coin_name}
                </Text>
                {(item.is_token == 1 || item.coin_family == 1) && (
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.titleTextStyle,
                      {
                        color: ThemeManager.colors.blackWhiteText,
                        fontSize: dimen(14),
                      },
                    ]}
                  >
                    {(item.coin_family == 1)
                      ? " (BEP-20)"
                      : item.coin_family == 2
                        ? " (ERC-20)"
                        : item.coin_family == 4
                          ? " (POL ERC-20)"
                          : item.coin_family == 5
                            ? " (SPL)"
                            : item.coin_family == 6
                              ? " (TRC-20)"
                              : ""}
                  </Text>
                )}
              </View>

              <View style={styles.viewStyle1}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.titleTextStyleNew,
                    { color: ThemeManager.colors.legalGreyColor },
                  ]}
                >
                  {Singleton.getInstance().CurrencySymbol}{item?.currentPriceInMarket
                    ? CommaSeprator1(item?.currentPriceInMarket, 2)
                    : "0.00"}
                  {/* {item.selectedCurrencySymbol} */}
                </Text>
                {item?.price_change_percentage_24h?.toString().includes("-") ? (
                  <View style={styles.viewStyle2}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.precentText, { color: Colors.lossColor, },
                      ]}
                    >{'-'}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.titleTextStyleNew,
                        { color: Colors.lossColor, },
                      ]}
                    >
                      {item?.price_change_percentage_24h
                        ? item?.price_change_percentage_24h
                          .toFixed(2)
                          .toString()
                          .replace(/[-]/g, "")
                        : 0.0}
                      %
                    </Text>
                  </View>
                ) : (
                  <View style={styles.viewStyle2}>
                    <Text
                      allowFontScaling={false}
                      style={[{
                        color: Colors.profitColor,
                        // fontSize: 12,
                        // paddingRight: 5,
                        marginBottom: Platform.OS == 'ios' ? 3 : 0
                      },
                      ]}
                    >{'+'}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.titleTextStyleNew,
                        { color: Colors.profitColor, },
                      ]}
                    >
                      {item?.price_change_percentage_24h
                        ? (item?.price_change_percentage_24h).toFixed(2)
                        : 0.0}
                      %
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.viewStyle4}>
            {/* {hideGraph ? null : (
              <AreaChart
                // svg={{ fill: item.price_change_percentage_24h > 0 ? Colors.successGradient : Colors.lossGradient }}
                style={{ height: 60, width: "100%" }}
                data={item.graphData}
                contentInset={{
                  top: 18,
                  bottom: item.graphData.every((v) => v === item.graphData[0])
                    ? 30
                    : 15,
                }}
                curve={shape.curveNatural}
              >
                {item.price_change_percentage_24h > 0 ? <Line /> : <Line1 />}
              </AreaChart>
            )} */}
          </View>

          <View
            style={{
              width: hideGraph ? "38%" : "32%",
              alignItems: "flex-end",
              paddingRight: 8,

            }}
          >


            <Text
              allowFontScaling={false}
              style={[
                styles.cValueStyle,
                {
                  color: ThemeManager.colors.blackWhiteText,
                  fontSize: dynamicFontNew(String(getValue(item?.balance)))
                },
              ]}
            >
              {isHideBalance ? "*****" : getValue(item?.balance)}
            </Text>


            {/* <Text
              allowFontScaling={false}
              style={[
                styles.cValueStyle,
                { color: ThemeManager.colors.blackWhiteText, fontSize: item?.balance.length > 5 ? 33 : 11 },
              ]}
            >
              {getValue(item?.balance)}
            </Text> */}
            <Text
              allowFontScaling={false}
              style={[
                styles.cUSDStyle,
                {
                  color: ThemeManager.colors.legalGreyColor,
                },
              ]}
            >
              {Singleton.getInstance().CurrencySymbol}{(isHideBalance ? "*****" : getFiatValue(item?.fiatBal))}
              {/* {item.selectedCurrencySymbol} */}
            </Text>
          </View>
        </View>
        {/* <Divider
          customStyle={{ marginHorizontal: 20, marginTop: showTransactionHistory == 'false' ? 10 : 0 }}
        ></Divider> */}
      </View>
    </TouchableOpacity>
  );
};

//******************************************************************************************/
const CoinList = ({
  onEndReached,
  hideGraph,
  coinList,
  tabType,
  searchTxt,
  showTransactionHistory,
  selectCoin,
  updateSelectedCoin,
  action_type,
  themeSelected,
  showBalance,
  showFooter,
  onAddressBookPress,
  isHideBalance
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [coinArr, setCoinArr] = useState([]);
  const [filteredArr, setFilteredArr] = useState([]);

  //******************************************************************************************/
  useEffect(() => {
    if (coinList && coinList.length > 0) {

      if (searchTxt) {
        const arr = coinArr;
        let filteredArray = [];
        arr.map((item) => {
          if (item?.coin_name?.toLowerCase().includes(searchTxt.toLowerCase()))
            filteredArray.push(item);
          return item;
        });
        setFilteredArr(filteredArray);
      } else setFilteredArr(coinList);
      setCoinArr(coinList);
    }
  }, [coinList, searchTxt]);

  //******************************************************************************************/
  const renderItem = ({ item, index }) => {
    const { walletMain } = LanguageManager;
    if (
      selectCoin &&
      item.coin_family != 1 &&
      item.coin_family != 2 &&
      item.coin_family != 3 &&
      item.coin_family != 4 &&
      item.coin_family != 5 &&
      item.coin_family != 6
    )
      return null;
    // console.log("coin list send>>", coinList);
    return coinList ? (
      <View key={index + ""}>
        <LinearGradient
          colors={['#101010', '#18171F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.6763, 0.95]}
          style={{
            flex: 1,
            marginHorizontal: 20,
            height: verticalScale(76),
            justifyContent: "center",
            marginTop: 10,
            borderRadius: 14,
          }}
        >

          <Item
            showTransactionHistory={showTransactionHistory}
            selectCoin={selectCoin}
            updateSelectedCoin={updateSelectedCoin}
            index={index}
            filteredArr={filteredArr}
            item={item}
            onPress={() => setSelectedId(item.id)}
            tabType={tabType}
            action_type={action_type}
            themeSelected={themeSelected}
            showBalance={showBalance}
            hideGraph={hideGraph}
            isHideBalance={isHideBalance}
          />
        </LinearGradient>
      </View>
    ) : (
      <View style={styles.ViewNew}>
        <Text
          allowFontScaling={false}
          style={{
            fontSize: 18,
            fontFamily: fonts.dmMedium,
            color:
              themeSelected == 2
                ? ThemeManager.colors.subTextColor
                : ThemeManager.colors.TextColor,
          }}
        >
          {walletMain.Noasset}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      <FlatList
        bounces={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        data={filteredArr}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100, }}
        keyExtractor={(item, index) => index + ""}
        extraData={selectedId}
        ListFooterComponent={(item, index) => {
          return showFooter ? <TouchableOpacity
            key={index + ""}
            onPress={onAddressBookPress}
            style={[
              styles.touchAbleStyle,
            ]}
          >
            {/* <Image resizeMode="contain" source={Images.addressBookButton} /> */}
            <GradientBorderView mainStyle={styles.copyButton}>
              {/* <Image style={{ tintColor: ThemeManager.colors.blackWhiteText, marginHorizontal: dimen(5) }} source={Images.icAddressBookLogo} /> */}
              <Text style={[styles.copyButtonText, { color: ThemeManager.colors.blackWhiteText, marginRight: dimen(8) }]}>Add Custom Token</Text>
            </GradientBorderView>
          </TouchableOpacity> : null
        }}
      />
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  viewStyle4: {
    width: "19%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewStyle3: {
    flexDirection: "row",
    // width: "53%",
    flex: 1,
    justifyContent: "flex-start",
  },
  viewStyle2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red"
    // paddingLeft: 3,
  },
  touchAbleStyle: {
    marginVertical: 30,
    alignSelf: "center",
    height: dimen(45),
  },
  ViewNew: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  viewStyle1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 0,
  },
  imgViewStyle: {
    height: 50,
    alignSelf: "center",
    width: 50,

    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 25,
  },
  imgStyle: {
    height: 50,
    alignSelf: "center",
    width: 50,
    borderRadius: 14,
    resizeMode: "cover",
    marginLeft: 10,
  },
  viewStyle: {
    flexDirection: "row",
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // marginHorizontal: horizontalScale(20),
    paddingHorizontal: horizontalScale(10),
    // paddingVertical: 14,
    // paddingTop: 5,
  },
  listStyle: {
    // marginHorizontal: horizontalScale(20),
  },
  container: {
    marginTop: Platform.OS == "android" ? 15 : 10,
  },
  titleTextStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    paddingRight: 5,
  },
  titleTextStyleNew: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    paddingRight: 5,
  },
  precentText: {
    fontFamily: Fonts.dmRegular,
  },
  cValueStyle: {
    fontFamily: Fonts.dmSemiBold,
    // fontSize: 15,
    color: ThemeManager.colors.whiteText,
    marginBottom: 6,
    textAlign: "right",
  },
  cUSDStyle: {
    color: "#FCFCFC",
    fontSize: 14,
    lineHeight: 19.88,
    fontFamily: Fonts.dmRegular,
    bottom: 6,
    textAlign: "right",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  copyButtonText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    textAlign: "center",
  },
});

export { CoinList };
