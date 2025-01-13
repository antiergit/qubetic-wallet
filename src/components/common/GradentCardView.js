import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import {
  dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../Utils";
import FastImage from "react-native-fast-image";
import { Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { EventRegister } from "react-native-event-listeners";
import { getData } from "../../Utils/MethodsUtils";
import * as Constants from "../../Constants";

const GradentCardView = (props) => {
  const {
    maincontainerStyle,
    imagebg = Images.sendCardMain,
    imageStyle,
    onPress,
    leftIcon,
    leftIconStyle,
    rightIcon,
    rightIconStyle,
    title,
    subTitle,
    titleStyle,
    subTitleStyle,
  } = props;

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    getData(Constants.DARK_MODE_STATUS).then(async (theme) => {
      setIsDarkMode(theme != 2);
    });
  }, []);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      {isDarkMode && (
        <Image
          source={imagebg}
          style={[StyleSheet.absoluteFillObject, styles.imageStyle]}
        />
      )}
      <View style={[styles.containerStyle, maincontainerStyle, {}]}>
        <View style={[styles.iconView, { alignItems: "flex-start" }]}>
          <FastImage
            source={typeof leftIcon == "string" ? { uri: leftIcon } : leftIcon}
            style={[styles.leftIcon, leftIconStyle]}
            resizeMode="contain"
          />
        </View>
        <View style={{ flex: 0.8, justifyContent: "center" }}>
          <Text
            style={[
              styles.titleStyle,
              { color: ThemeManager.colors.blackWhiteText },
              titleStyle,
            ]}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.subTitleStyle,
              { color: ThemeManager.colors.blackWhiteText },
              subTitleStyle,
            ]}
          >
            {subTitle}
          </Text>
        </View>
        <View style={[styles.iconView, { alignItems: "flex-end" }]}>
          {rightIcon ? (
            <FastImage
              source={rightIcon}
              style={[styles.rightIcon, rightIconStyle]}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(GradentCardView);

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    paddingHorizontal: getDimensionPercentage(15),
    paddingVertical: dimen(10),
  },
  imageStyle: {
    height: "100%",
    width: "100%",
    borderRadius: getDimensionPercentage(14),
    overflow: "hidden",
    resizeMode: "stretch",
  },
  leftIcon: {
    height: heightDimen(44),
    width: heightDimen(44),
    borderRadius: heightDimen(44 / 2),
  },
  iconView: {
    flex: 0.2,
    justifyContent: "center",
  },
  rightIcon: {
    height: heightDimen(12),
    width: widthDimen(12),
  },
  titleStyle: {
    fontFamily: Fonts.dmBold,
    marginBottom: getDimensionPercentage(4),
    fontSize: getDimensionPercentage(18),
  },
  subTitleStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: getDimensionPercentage(14),
    opacity: 0.5,
  },
});
