import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import FastImage from "react-native-fast-image";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts, Images } from "../../theme";
import { dimen, heightDimen, widthDimen } from "../../Utils";
import { SvgUri } from "react-native-svg";

const TextInputDropDown = ({
  placeholder,
  keyboardType,
  value,
  onPressDropDown = () => { },
  onChangeText,
  cointImage,
  cointName,
  dropDown,
  editable,
  activeOpacity = 0.9,
  onPress,
  maxLength,
}) => {
  const [isSvgValid, setIsSvgValid] = useState(true);

  useEffect(() => {
    setIsSvgValid(true);
  }, [cointImage]);

  const onSvgErr = (e) => {
    if (e.message) {
      setIsSvgValid(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.mainContainer}
      activeOpacity={activeOpacity}
      onPress={onPress}
    >
      <View
        style={[styles.privacyView, { borderColor: ThemeManager.colors.inputBorder }]}
      >
        <TextInput
          style={[
            styles.textInputStyle,
            { color: ThemeManager.colors.blackWhiteText },
          ]}
          value={value}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={ThemeManager.colors.placeHolderText}
          onChangeText={onChangeText}
          editable={editable}
          maxLength={maxLength}
          keyboardAppearance="dark"
        />
        {!!dropDown && (
          <TouchableOpacity
            style={[
              styles.dropDownView,
              { backgroundColor: ThemeManager.colors.mnemonicsBg },
            ]}
            activeOpacity={0.8}
            accessibilityLabel="Select currency"
            onPress={dropDown ? onPressDropDown : null}
          >
            {!!cointImage && isSvgValid ? (
              cointImage?.includes(".svg") ? (
                <SvgUri
                  height={heightDimen(24)}
                  width={heightDimen(24)}
                  uri={cointImage}
                  stroke={ThemeManager.colors.primaryColor}
                  onError={onSvgErr}
                />
              ) : (
                <FastImage
                  source={{ uri: cointImage }}
                  resizeMode="contain"
                  style={styles.currencyImage}
                  accessibilityLabel="Currency image"
                />
              )
            ) : (
              <View
                style={[
                  styles.currencyImage,
                  { backgroundColor: ThemeManager.colors.blackWhiteText },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.coinInitialText,
                    { color: ThemeManager.colors.whiteBlacktext },
                  ]}
                >
                  {cointName?.charAt(0)}
                </Text>
              </View>
            )}
            <Text
              style={[
                styles.payText,
                { color: ThemeManager.colors.blackWhiteText },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {cointName}
            </Text>
            {dropDown && (
              <Image
                source={Images.dropdownnew}
                style={[
                  styles.dropDownIcon,
                  { tintColor: ThemeManager.colors.blackWhiteText },
                ]}
                accessibilityLabel="Dropdown icon"
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    height: dimen(50),
    borderRadius: dimen(14),
    flexDirection: "row",
    alignItems: "center",
  },
  textInputStyle: {
    flex: 0.64,
    paddingHorizontal: dimen(16),
  },
  dropDownView: {
    height: heightDimen(40),
    flex: 0.35,
    borderRadius: dimen(10),
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  currencyImage: {
    height: widthDimen(27),
    width: widthDimen(27),
    borderRadius: widthDimen(27 / 2),
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  payText: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(14),
    maxWidth: "50%",
    textTransform: "uppercase",
  },
  dropDownIcon: {
    height: widthDimen(8),
    width: widthDimen(8),
    resizeMode: "contain",
  },
  privacyView: {
    marginBottom: dimen(16),
    width: "100%",
    overflow: "hidden",
    height: dimen(50),
    borderRadius: dimen(14),
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  coinInitialText: {
    fontSize: dimen(16),
    fontFamily: Fonts.dmRegular,
  },
});

export default React.memo(TextInputDropDown);
