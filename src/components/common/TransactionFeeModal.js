import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import CommonModal from "./CommonModal";
import { ThemeManager } from "../../../ThemeManager";
import ProgressBarClass from "./ProgressBarClass";
import { LanguageManager } from "../../../LanguageManager";
import { heightDimen, widthDimen } from "../../Utils";
import { Colors, Fonts } from "../../theme";

const TransactionFeeModal = (props) => {
  const [selectedFeeType, setSelectedFeeType] = useState(
    props?.selectedFeeType
  );

  const { sendTrx } = LanguageManager;

  const onClickAction = (type) => {
    switch (type) {
      case "slow":
        setSelectedFeeType(1);
        props?.onEditTransFee?.("slow");
        break;
      case "average":
        setSelectedFeeType(2);
        props?.onEditTransFee?.("average");
        break;
      case "high":
        setSelectedFeeType(3);
        props?.onEditTransFee?.("high");
        break;
      default:
        break;
    }
  };

  return (
    <View>
      <CommonModal
        modalView={{
          minHeight: 200,
        }}
        visible={props.visible}
        onRequestClose={props.onRequestClose}
        onClose={props.onClose}
      >
        <View style={styles.coinInfo}>
          <View style={styles.ViewStyle6}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.TextStyle1,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {sendTrx.transactionFee}
              </Text>
              <TouchableOpacity onPress={props?.onClose}>
                <Image
                  resizeMode="contain"
                  source={ThemeManager.ImageIcons.crossIconNew}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: heightDimen(20),
                marginBottom: heightDimen(16),
                marginHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => onClickAction("slow")}
                style={{ flex: 1 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor:
                        selectedFeeType == 1
                          ? "rgba(94, 209, 210, 0.5)"
                          : "transparent",
                      borderRadius: selectedFeeType == 1 ? 20 : 10,
                      height: selectedFeeType == 1 ? 30 : 15,
                      width: selectedFeeType == 1 ? 30 : 15,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: selectedFeeType == 1 ? -10 : 0,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          selectedFeeType == 1
                            ? Colors.primaryColor
                            : ThemeManager.colors.primaryColor,
                        borderRadius: selectedFeeType == 1 ? 30 : 10,
                        height: selectedFeeType == 1 ? 20 : 15,
                        width: selectedFeeType == 1 ? 20 : 15,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor:
                        selectedFeeType == 1
                          ? ThemeManager.colors.inputPlace
                          : ThemeManager.colors.primaryColor,
                      height: 3,
                      width: "90%",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onClickAction("average")}
                style={{ flex: 1 }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor:
                        selectedFeeType == 2
                          ? "rgba(94, 209, 210, 0.5)"
                          : "transparent",
                      borderRadius: selectedFeeType == 2 ? 20 : 10,
                      height: selectedFeeType == 2 ? 30 : 15,
                      width: selectedFeeType == 2 ? 30 : 15,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: selectedFeeType == 2 ? -10 : 0,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor:
                          selectedFeeType == 2 || selectedFeeType == 3
                            ? Colors.primaryColor
                            : ThemeManager.colors.inputPlace,
                        borderRadius: selectedFeeType == 2 ? 33 : 10,
                        height: selectedFeeType == 2 ? 20 : 15,
                        width: selectedFeeType == 2 ? 20 : 15,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor:
                        selectedFeeType == 3
                          ? Colors.primaryColor
                          : ThemeManager.colors.inputPlace,
                      height: 3,
                      width: "90%",
                    }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onClickAction("high")}>
                <View
                  style={{
                    backgroundColor:
                      selectedFeeType == 3
                        ? "rgba(94, 209, 210, 0.5)"
                        : Colors.primaryColor,
                    borderRadius: selectedFeeType == 3 ? 20 : 10,
                    height: selectedFeeType == 3 ? 30 : 15,
                    width: selectedFeeType == 3 ? 30 : 15,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: selectedFeeType == 3 ? -10 : 0,
                  }}
                >
                  <View
                    style={{
                      backgroundColor:
                        selectedFeeType == 3
                          ? Colors.primaryColor
                          : ThemeManager.colors.inputPlace,
                      borderRadius: selectedFeeType == 3 ? 33 : 10,
                      height: selectedFeeType == 3 ? 20 : 15,
                      width: selectedFeeType == 3 ? 20 : 15,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {props?.isBnb ? (
          <View>
            {props?.sendFun?.()}
            {props?.sendFun2?.("fee")}
            {props?.sendFun3?.("fiat")}
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.dmSemiBold,
                color: ThemeManager.colors.grayTextColor,
                flex: 1,
                textAlign: "left",
              }}
            >
              {`${props?.lowText ?? "Low"}\n ${props?.lowRateTxt ?? ""}\n ${props?.lowValueTxt ?? ""
                }`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.dmSemiBold,
                color: ThemeManager.colors.grayTextColor,
                flex: 1,
                textAlign: "center",
              }}
            >
              {`${props?.avgTxt ?? "Average"}\n ${props?.avgRateTxt ?? ""}\n ${props?.avgValueTxt ?? ""
                }`}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.dmSemiBold,
                color: ThemeManager.colors.grayTextColor,
                flex: 1,
                textAlign: "right",
              }}
            >
              {`${props?.highTxt ?? "High"}\n ${props?.highRateTxt ?? ""}\n ${props?.highValueTxt ?? ""
                }`}
            </Text>
          </View>
        )}
      </CommonModal>
    </View>
  );
};

export default TransactionFeeModal;

const styles = StyleSheet.create({
  coinInfo: {
    // Add your styles here
  },
  ViewStyle6: {
    marginTop: 30,
  },
  TextStyle1: {
    marginBottom: 7,
    fontSize: 16,
    fontFamily: Fonts.dmBold,
  },
});
