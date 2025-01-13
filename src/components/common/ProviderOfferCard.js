import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React from "react";
import FastImage from "react-native-fast-image";
import { ThemeManager } from "../../../ThemeManager";
import { dimen, heightDimen, widthDimen } from "../../Utils";
import { Fonts, Images } from "../../theme";
import LinearGradient from "react-native-linear-gradient";

const ProviderOfferCard = ({ item, onPress, selected, onOfferPressed }) => {
  // console.log("item =====", JSON.stringify(item));
  return (
    <TouchableOpacity
      onPress={!!item?.errorMessage ? null : onPress}
      activeOpacity={!!item?.errorMessage ? 1 : 0.8}
    >
      <ImageBackground
        source={ThemeManager.ImageIcons.cardViewImg}
        style={[styles.cardView, { opacity: !item?.errorMessage ? 1 : 0.5 }]}
      >
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.providerCode,
                { color: ThemeManager.colors.blackWhiteText },
              ]}
            >
              {item?.providerCode}
            </Text>
            {item?.amountExpectedTo ? (
              <Text style={styles.amountExpectedTo}>
                {item?.amountExpectedTo}
              </Text>
            ) : (
              <Text style={styles.amountExpectedTo}>{item?.errorMessage}</Text>
            )}
          </View>
          <View style={styles.iconContainer}>
            <View>
              <FastImage
                style={styles.icon}
                source={selected ? Images.radio_active : Images.radio_inactive}
                tintColor={
                  selected
                    ? ThemeManager.colors.primaryColor
                    : ThemeManager.colors.blackWhiteText
                }
              />
            </View>
          </View>
        </View>
        {item?.paymentMethodOffer && selected && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            {item?.paymentMethodOffer?.map((val) => {
              if (!val?.methodName) {
                return null;
              }

              return (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={["#24A09D", "#69DADB"]}
                  style={{
                    borderRadius: 10,
                    marginRight: 12,
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 8,
                    }}
                    onPress={onOfferPressed(val)}
                  >
                    <Text
                      style={{
                        fontSize: dimen(15),
                        fontFamily: Fonts.dmMedium,
                        color: ThemeManager.colors.whiteBlacktext,
                      }}
                    >
                      {val.methodName}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              );
            })}
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardView: {
    borderRadius: dimen(12),
    overflow: "hidden",
    paddingVertical: dimen(10),
    paddingHorizontal: dimen(16),
    marginBottom: dimen(20),
  },
  container: {
    flexDirection: "row",
  },
  textContainer: {
    flex: 0.9,
  },
  providerCode: {
    textTransform: "capitalize",
    fontSize: dimen(18),
    fontFamily: Fonts.dmBold,
    marginBottom: dimen(8),
  },
  amountExpectedTo: {
    color: ThemeManager.colors.placeHolderText,
    textTransform: "capitalize",
    fontSize: dimen(14),
    fontFamily: Fonts.dmMedium,
  },
  iconContainer: {
    flex: 0.1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  icon: {
    height: heightDimen(24),
    width: widthDimen(24),
  },
});

export default React.memo(ProviderOfferCard);
