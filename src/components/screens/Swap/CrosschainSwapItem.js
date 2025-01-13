import React, { Component, memo } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Fonts, Images, Colors } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
const CrosschainSwapItem = (props) => {
  const { item, index } = props;
  // console.log("item:::::::");

  /******************************************************************************************/
  return (
    <TouchableOpacity
      key={item?.id || index}
      onPress={() => {
        props.onPress(index);
      }}
      disabled={props.disabled}
    >
      <View
        style={[
          styles.tokenItem,
          { borderBottomColor: ThemeManager.colors.borderUnderLine },
        ]}
      >
        <View style={styles.tokenItem_first}>
          {item?.coinImageUrl == "" || item?.coinImageUrl == null ? (
            <View
              style={[
                styles.tokenImage_stylee,
                { backgroundColor: ThemeManager.colors.borderUnderLine },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.tokenAbr_stylee,
                  { color: ThemeManager.colors.Text },
                ]}
              >
                {item.coinName?.charAt(0)}
              </Text>
            </View>
          ) : (
            <View style={{ justifyContent: "center", alignContent: "center" }}>
              <Image style={styles.icon} source={{ uri: item?.coinImageUrl }} />
            </View>
          )}

          <Text
            allowFontScaling={false}
            style={[
              styles.tokenAbr_style,
              { color: ThemeManager.colors.settingsText },
            ]}
          >
            {item.coinName}
          </Text>
          {(item?.contact != null || item?.contact?.length > 0) && (
            <Text
              allowFontScaling={false}
              style={[
                styles.tokenAbr_style,
                { color: "#A1A1A1", fontSize: 12, marginLeft: 0 },
              ]}
            >
              {item.mainNetwork.toLowerCase() == "trx"
                ? "| TRX"
                : item.mainNetwork.toLowerCase() == "eth"
                  ? "| ETH"
                  : item.mainNetwork.toLowerCase() == "bsc"
                    ? "| BNB"
                    : item.mainNetwork.toLowerCase() == "polygon"
                      ? "| MATIC"
                      : ""}
            </Text>
          )}
        </View>
        <View>
          <Text
            allowFontScaling={false}
            style={[
              styles.tokenAbr_style,
              {
                fontSize: 12,
                fontFamily: Fonts.dmRegular,
                color: ThemeManager.colors.lightText,
              },
            ]}
          >
            {item.coinCode?.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  tokenItem: {
    alignItems: "center",
    borderBottomWidth: 1,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
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
    color: ThemeManager.colors.whiteText,
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
    backgroundColor: "white",
  },
});

export default memo(CrosschainSwapItem);
