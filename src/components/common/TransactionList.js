import React, { useState, useEffect } from "react";
import { Fonts, Colors, Images } from "../../theme";
import * as Constants from "../../Constants";
import { ThemeManager } from "../../../ThemeManager";
import moment from "moment";
import Singleton from "../../Singleton";
import LinearGradient from "react-native-linear-gradient";

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  Dimensions,
  Platform,
} from "react-native";
import {
  getCryptoAddress,
  getFirstDecimalNumber,
  toFixedExp,
} from "../../Utils/MethodsUtils";
import { LanguageManager } from "../../../LanguageManager";
import fonts from "../../theme/Fonts";
import { moderateScale } from "../../layouts/responsive";
import { bottomNotchWidth, getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../Utils';
import { platform } from "process";
import { log } from "console";


const List = [
  {
    img: ThemeManager.ImageIcons.swapIconLight,
    type: "Swap",
    coinVal: "From: ",
    perValue: "0x1fwf...vz9jsd",
    val: "+1.96",
    date: "Mar 04 2024",
    Crypto: "BTC",
  },
  {
    img: ThemeManager.ImageIcons.swapIconLight,
    type: "Swap",
    coinVal: "To: ",
    perValue: "0x1gtqw...vz9jsd",
    val: "-0.01",
    date: "Mar 03 2024",
    Crypto: "BTC",
  },
  {
    img: ThemeManager.ImageIcons.transferIcon,
    type: "Transfer",
    coinVal: "To: ",
    perValue: "0x1gtqw...vz9jsd",
    val: "-0.01",
    date: "Mar 03 2024",
    Crypto: "BTC",
  },
  {
    img: ThemeManager.ImageIcons.smartContactIcon,
    type: "Smart Contact Call",
    coinVal: "To: ",
    perValue: "0x1gtqw...vz9jsd",
    val: "-0.001",
    date: "Mar 02 2024",
    Crypto: "BTC",
  },
  {
    img: ThemeManager.ImageIcons.transferDownIcon,
    type: "Transfer",
    coinVal: "From: ",
    perValue: "0x1gtqw...vz9jsd",
    val: "+1.94",
    date: "Mar 01 2024",
    Crypto: "BTC",
  },
];

//******************************************************************************************/
const Item = ({
  item,
  style,
  oddColor,
  selectedCoin,
  themeSelected,
  address,
  index
}) => (
  <TouchableOpacity
    disabled={!item.tx_id ? true : false}
    activeOpacity={0.7}
    onPress={() => {
      if (item.coin_family == 2) {
        return Linking.openURL(
          Constants.network == "testnet"
            ? "https://goerli.etherscan.io/tx/" + item.tx_id
            : "https://etherscan.io/tx/" + item.tx_id
        );
      } else if (item.coin_family == 1) {
        return Linking.openURL(
          Constants.network == "testnet"
            ? "https://testnet.bscscan.com/tx/" + item.tx_id
            : "https://bscscan.com/tx/" + item.tx_id
        );
      } else if (item.coin_family == 3) {
        return Linking.openURL(
          Constants.network == "testnet"
            ? "https://live.blockcypher.com/btc-testnet/tx/" + item.tx_id
            : "https://live.blockcypher.com/btc/tx/" + item.tx_id
        );
      } else if (item.coin_family == 4) {
        return Linking.openURL(
          Constants.network == "testnet"
            ? "https://mumbai.polygonscan.com/tx/" + item.tx_id
            : "https://polygonscan.com/tx/" + item.tx_id
        );
      } else if (item.coin_family == 5) {
        return Linking.openURL('https://solscan.io/tx/' + item.tx_id);
      } else if (item.coin_family == 6) {
        return Linking.openURL(
          Constants.network == "testnet"
            ? "https://shasta.tronscan.org/#/transaction/" + item.tx_id
            : "https://tronscan.org/#/transaction/" + item.tx_id
        );
      } else if (item.coin_family == 7) {
        return Linking.openURL('https://dev-explorer.qubetics.work/tx/' + item.tx_id);
      }
    }}
  >
    <View style={styles.ViewStyle3}>
      <View style={{ width: "10%", justifyContent: "center" }}>
        {item.type == 'dapp' ? (
          <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.transactionIconBg }}>
            <Image style={{ alignSelf: 'center', height: 20, width: 20, resizeMode: 'contain', tintColor: ThemeManager.colors.blackWhiteText }} source={Images.wallet_backup} />
          </View>
        ) : (
          <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.transactionIconBg }}>
            <Image style={{ alignSelf: 'center', }} source={Singleton.getInstance().getStatusImage(item, address)} />
          </View>
        )}
        {/* {item.type == 'dapp' ? (
          <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.bg }}>
            <Image style={{ alignSelf: 'center', height: 20, width: 20, resizeMode: 'contain', tintColor: ThemeManager.colors.colorVariation }} source={Images.wallet_backup} />
          </View>
        ) : item.type == 'card_fees' || item.type == 'card_recharge' || item.type == 'level_upgradation_fee' ? (
          <>
            <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.bg }}>
              <Image style={{ height: 40, width: 40, resizeMode: 'contain' }} source={Images.send_bg} />
            </View>
          </>
        ) : (
          <Image style={{ height: 40, width: 40, resizeMode: 'contain' }} source={item.type.toLowerCase() == 'withdraw' && address?.toLowerCase() == item.from_adrs?.toLowerCase() ? Images.send_bg : item.type.toLowerCase() == 'withdraw' && address?.toLowerCase() == item.to_adrs?.toLowerCase() ? Images.receive_bg : item.type.toLowerCase() == 'swap' || item?.type?.toLowerCase() == 'cross_chain' || item?.type?.toLowerCase() == 'approve' || item?.type?.toLowerCase() == 'buy' || item?.type?.toLowerCase() == 'sell' ? Images.Swap_bg : Images.receive_bg} />
        )} */}
      </View>

      <View style={{ width: "42%", alignSelf: "flex-start", marginLeft: dimen(12) }}>
        {item.type == "dapp" ? (
          <Text
            allowFontScaling={false}
            // numberOfLines={2}
            style={[
              styles.transTypeStyle,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {LanguageManager.commonText.SmartContractExecution}
          </Text>
        ) : item.type == "card_fees" ? (
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            style={[
              styles.transTypeStyle,
              {
                color: ThemeManager.colors.settingsText,
                textTransform: "capitalize",
              },
            ]}
          >
            {LanguageManager.detailTrx.cardFee}
          </Text>
        ) : item.type == "card_recharge" ? (
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            style={[
              styles.transTypeStyle,
              {
                color: ThemeManager.colors.settingsText,
                textTransform: "capitalize",
              },
            ]}
          >
            {LanguageManager.detailTrx.cardRecharge}
          </Text>
        ) : item.type == "level_upgradation_fee" ? (
          <Text
            allowFontScaling={false}
            numberOfLines={2}
            style={[
              styles.transTypeStyle,
              {
                color: ThemeManager.colors.settingsText,
                textTransform: "capitalize",
              },
            ]}
          >
            {LanguageManager.referral.levelUpgrade +
              " (" +
              item?.referral_upgrade_level +
              ")"}
          </Text>
        ) : (
          <Text
            allowFontScaling={false}
            style={[
              styles.transTypeStyle,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {item.is_approval == 1
              ? LanguageManager.swapText.approval
              : item?.type?.toLowerCase() == "withdraw" &&
                address?.toLowerCase() == item?.from_adrs?.toLowerCase()
                ? LanguageManager.referral.sent
                : item?.type?.toLowerCase() == "withdraw" &&
                  address?.toLowerCase() == item?.to_adrs?.toLowerCase()
                  ? LanguageManager.referral.received
                  : item?.type?.toLowerCase() == "buy"
                    ? LanguageManager.buySell.buy
                    : item?.type?.toLowerCase() == "sell"
                      ? LanguageManager.buySell.sell
                      : item?.type?.toLowerCase() == "swap"
                        ? "Swap"
                        : item?.type?.toLowerCase() == "cross_chain"
                          ? "Cross Chain Swap"
                          : item?.type?.toLowerCase() == "approve"
                            ? LanguageManager.swapText.approve
                            : LanguageManager.referral.receive}
          </Text>
        )}

        {item?.from_adrs ? <View style={{ flexDirection: "row", marginTop: dimen(4) }}>
          <Text allowFontScaling={false} style={[styles.transtimeStyle, { color: ThemeManager.colors.pinBgWhiteBlack, marginTop: -2 }]}>{LanguageManager.browser.From}{':'}</Text>
          <Text allowFontScaling={false} style={[styles.transtimeStyle, { color: ThemeManager.colors.pinBgWhiteBlack, marginTop: -2 }]}> {
            item?.from_adrs?.substring(0, 10) + "..." + item?.from_adrs?.substring(item?.from_adrs?.length - 4, item?.from_adrs?.length)
          }</Text>
        </View> :
          <View style={{ flexDirection: "row", marginTop: dimen(4) }}>
            <Text allowFontScaling={false} style={[styles.transtimeStyle, { color: ThemeManager.colors.pinBgWhiteBlack, marginTop: -2 }]}>{LanguageManager.detailTrx.Status}{':'}</Text>
            <Text allowFontScaling={false} style={[styles.transtimeStyle, { color: ThemeManager.colors.pinBgWhiteBlack, marginTop: -2, textTransform: "capitalize" }]}> {item?.blockchain_status}</Text>
          </View>
        }

        {/* <Text
          allowFontScaling={false}
          style={[
            styles.transtimeStyle,
            { color: ThemeManager.colors.TextColor, marginTop: -2 },
          ]}
        >
          {moment(item.created_at).format("DD MMM, YYYY")} |{" "}
          {moment(item.created_at).format("h:mm A")}
        </Text> */}
      </View>

      <View style={styles.ViewStyle2}>
        {item.is_approval == 1 && (
          <Text
            allowFontScaling={false}
            style={[
              styles.fromValueStyle,
              {
                color:
                  themeSelected == 2
                    ? ThemeManager.colors.headersTextColor
                    : ThemeManager.colors.whiteText,
              },
            ]}
          >
            {item.coin_symbol.toUpperCase()} approval{" "}
            {Singleton.getInstance().getStatus(
              item.status,
              item.blockchain_status,
              item.type
            )}
          </Text>
        )}

        {item.is_approval == 1 ? null : item.is_approval != 1 &&
          !item.token_id ? (
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.fromValueStyle,
                {
                  color:
                    (item?.type?.toLowerCase() == "withdraw" &&
                      address?.toLowerCase() ==
                      item.from_adrs?.toLowerCase()) ||
                      item.type == "card_fees" ||
                      item.type == "card_recharge"
                      ? ThemeManager.colors.blackWhiteText
                      : ThemeManager.colors.blackWhiteText,
                },
              ]}
            >
              {item.amount > 0
                ? toFixedExp(item?.amount, 6) > 0
                  ? toFixedExp(item?.amount, 6)
                  : getFirstDecimalNumber(toFixedExp(item?.amount, 6))
                : toFixedExp(item?.amount, 6)}{" "}
              {selectedCoin.coin_symbol.toUpperCase()}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.transtimeStyle,
                { color: ThemeManager.colors.pinBgWhiteBlack, marginTop: -2, textAlign: 'right' },
              ]}
            >
              {moment(item.created_at).format("MMM DD YYYY")}
            </Text>
          </View>
        ) : (
          <Text
            allowFontScaling={false}
            style={[
              styles.fromValueStyle,
              {
                color: ThemeManager.colors.headersTextColor,
                textAlign: "center",
              },
            ]}
          >
            {LanguageManager.commonText.TokenId} {item.token_id}
          </Text>
        )}
      </View>
    </View>



  </TouchableOpacity>
);

//******************************************************************************************/
const TransactionList = ({
  txnList,
  selectedCoin,
  themeSelected,
  onScroll,
}) => {
  const [transactionList, setTransactionList] = useState(txnList);
  const { merchantCard } = LanguageManager;

  //******************************************************************************************/
  useEffect(() => {
    setTransactionList(txnList);
  }, [txnList]);

  //******************************************************************************************/
  const renderItem = ({ item, index }) => {
    // console.log(item.tx_id, 'item.tx_iditem.tx_iditem.tx_id', moment(item.created_at).format("MMM DD YYYY"));

    return (
      <Item
        item={item}
        oddColor={{
          backgroundColor: index % 2 == 0 ? Colors.defiListbg : "green",
        }}
        selectedCoin={selectedCoin}
        themeSelected={themeSelected}
        address={getCryptoAddress(item.coin_family)}

      />
    );
  };

  //******************************************************************************************/
  return (
    <View style={{ flex: 1, marginBottom: Platform.OS == 'ios' ? getDimensionPercentage(45) : getDimensionPercentage(10) }}>
      <FlatList
        bounces={false}
        data={txnList}
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.ViewStyle1,
              { backgroundColor: ThemeManager.colors.dividerColor, marginHorizontal: 15, marginVertical: 8 },
            ]}
          />
        )}
        renderItem={renderItem}
        // contentContainerStyle={{ paddingBottom: txnList.length > 0 ? 120 : 0 }}
        keyExtractor={(item, index) => index + ""}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                height: Dimensions.get("screen").height / 2.7,
                justifyContent: "center",
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.transactionHistoryTitle,
                  { color: ThemeManager.colors.blackWhiteText, alignSelf: "center" },
                ]}
              >
                {merchantCard.noTransactionHistoryFound}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle4: {
    borderRadius: 14,
    height: 40,
    width: 40,
    justifyContent: 'center',
  },
  ViewStyle3: {
    flexDirection: "row",
    width: "92%",
    alignSelf: "center",
    paddingVertical: 8,
  },
  ViewStyle2: {
    width: "44%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  ViewStyle: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    fontFamily: Fonts.dmLight,
    color: ThemeManager.colors.whiteText,
    paddingLeft: 10,
  },
  listStyle: {
    paddingHorizontal: 23,
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomColor: ThemeManager.colors.lightWhiteText,
  },
  transaction_time: {
    flexDirection: "row",
    alignItems: "center",
  },
  transtimeStyle: {
    fontFamily: fonts.dmSemiBold,
    fontSize: dimen(14),
    lineHeight: dimen(21),
    color: ThemeManager.colors.lightWhiteText,
  },
  transtimeStyle1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: ThemeManager.colors.whiteText,
    marginTop: 10,
  },
  fromValueStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 14,
    color: Colors.textColor,
    marginVertical: 5,
    textAlign: "right",
  },
  fromAddressStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 10,
    color: Colors.textColor,
  },
  transStatusStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: Colors.successColor,
    marginRight: 0,
  },
  transTypeStyle: {
    fontFamily: fonts.dmSemiBold,
    fontSize: moderateScale(14),
    lineHeight: 20,
    color: Colors.textColor,
    marginTop: 5,
    marginRight: 10,
  },
  transactionHistoryTitle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
    textAlign: "center",
    width: "90%",
  },
  ViewStyle1: {
    height: 1,
    width: "100%",
  },
});

export { TransactionList };
