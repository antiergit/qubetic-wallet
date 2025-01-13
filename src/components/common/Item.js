import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts } from "../../theme";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";

export const Item = (props) => {
  //******************************************************************************************/
  useEffect(() => {
    console.log("props.img::::", props.img);
  }, []);


  function timeAgo(timestamp) {
    const now = new Date();
    const timeDifference = now - new Date(timestamp); // Difference in milliseconds

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else if (days < 30) {
      return `${days} days ago`;
    } else if (months < 12) {
      return `${months} months ago`;
    } else {
      return `${years} years ago`;
    }
  }

  //******************************************************************************************/
  return (
    <View
      style={[
        styles.mainView,
        props.mainView,
        {
          backgroundColor: ThemeManager.colors.mnemonicsBg,
          borderRadius: 10,
        },
      ]}
    >
      <TouchableOpacity
        onPress={props.onDappPress}>
        <View
          style={{ paddingHorizontal: 10, flexDirection: "row" }}
        >
          <FastImage
            style={[styles.imgStyle, props.imgStyle]}
            resizeMode="contain"
            source={{ uri: props.img }}
          />
          <View>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={[
                styles.textStyle,
                props.textStyle,
                { color: ThemeManager.colors.blackWhiteText },
              ]}
            >
              {props.title ? props.title?.substring(0, 15) + "..." : ""}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.subTextStyle,
                { color: ThemeManager.colors.legalGreyColor },
              ]}
            >
              {props.subtitle ? props.subtitle?.substring(0, 30) + "..." : ""}
            </Text>



          </View>
        </View>

      </TouchableOpacity>
      {props?.timestamp && <Text
        allowFontScaling={false}
        style={[
          styles.timeTextStyle,
          { color: ThemeManager.colors.legalGreyColor },
        ]}
      >{timeAgo(props?.timestamp)}</Text>}
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  mainView: {
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
    flexWrap: "wrap",
  },
  imgStyle: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    borderRadius: 50,
    alignSelf: "center",
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    textTransform: "capitalize",
    marginLeft: 10,
    marginTop: 5
  },
  subTextStyle: {
    fontFamily: Fonts.dmLight,
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5
  },
  timeTextStyle: {
    fontFamily: Fonts.dmExtraLight,
    fontSize: 8,
    position: "absolute",
    right: 10,
    bottom: 10
  },
});
