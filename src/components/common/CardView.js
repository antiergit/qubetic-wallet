import { StyleSheet } from "react-native";
import { Fonts, Images } from "../../theme";
import { ThemeManager } from "../../../ThemeManager";
import { Image, TouchableOpacity, View, Text, ImageBackground } from "react-native";
import React from "react";
import colors from "../../theme/Colors";
import FastImage from "react-native-fast-image";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../Utils";
import LinearGradient from "react-native-linear-gradient";

export const CardView = (props) => {
  /******************************************************************************************/
  return (
    <>

      {!props.mainCard && <TouchableOpacity
        disabled={props?.disabled}
        onPress={props.onPress} style={[styles.mainView, props.mainStyle]}>


        <View style={[styles.privacyView, { backgroundColor: ThemeManager.colors.mnemonicsBg }, props?.cardStyle]}>
          <View
            style={[
              styles.ViewStyle, props.ViewStyle,
            ]}
          >
            {props.leftImg && (
              <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  {props.leftImgIcon ? <Image
                    source={props.leftImgIcon}
                    style={[
                      styles.imgStyleLeft,
                      props.imgStyleLeft,
                      // {tintColor: ThemeManager.colors.cloudy},
                    ]}
                  /> : <View style={{
                    ...styles.imageBg,
                    backgroundColor: ThemeManager.colors.settingIconsBg,
                  }}>
                    <Image style={{ tintColor: ThemeManager.colors.blackWhiteText }} source={props?.leftIcon} />
                  </View>}

                  <View style={[props.viewStyle, {}]}>
                    <Text
                      allowFontScaling={false}
                      style={[
                        styles.textStyle, props.leftTextStyle,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      {props.leftText}
                    </Text>
                    {props.bottomText && <Text
                      allowFontScaling={false}
                      style={[
                        styles.bottomTextStyle,
                        { color: ThemeManager.colors.cardCur },
                      ]}
                    >
                      {props.bottomText}
                    </Text>}
                  </View>
                </View>


                {props.fromTheme ? props.showIcon ? <Image source={Images.done} style={[styles.imgStyle, props.imgStyle, { tintColor: ThemeManager.colors.primaryColor }]} /> : null : <Image source={props.imgIcon ? props.imgIcon : Images.RightArrow} style={[styles.imgStyle]} />}


              </View>
            )}

          </View>
        </View>
      </TouchableOpacity>}



      {props.isToggle &&
        <View style={{ paddingHorizontal: dimen(24), marginTop: 24 }}>


          <View style={[styles.privacyView, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}>
            <View
              style={[
                styles.ViewStyle, props.ViewStyle,

              ]}
            >
              {props.leftImg && (
                <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", }}>

                    {props?.leftImgIcon ? <Image
                      source={props.leftImgIcon}
                      style={[
                        styles.imgStyleLeft,
                        props.imgStyleLeft,
                        // {tintColor: ThemeManager.colors.cloudy},
                      ]}
                    /> : <View style={{
                      ...styles.imageBg,
                      backgroundColor: ThemeManager.colors.settingIconsBg,
                    }}>
                      <Image style={{ tintColor: ThemeManager.colors.blackWhiteText }} source={props?.leftIcon} />
                    </View>}

                    <View style={[props.viewStyle, {}]}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.textStyle, props.leftTextStyle,
                          { color: ThemeManager.colors.blackWhiteText },
                        ]}
                      >
                        {props.leftText}
                      </Text>
                      {props.bottomText && <Text
                        allowFontScaling={false}
                        style={[
                          styles.bottomTextStyle,
                          { color: ThemeManager.colors.cardCur },
                        ]}
                      >
                        {props.bottomText}
                      </Text>}
                    </View>
                  </View>

                  <TouchableOpacity onPress={props.onPressIcon} style={{ alignSelf: "center" }}>
                    <TouchableOpacity onPress={props.onPressToggle}>
                      {props.fromTheme ? props.showIcon ?
                        <Image source={Images.done} style={[styles.imgStyle, props.imgStyle, { tintColor: ThemeManager.colors.primaryColor }]} /> : null : <Image source={props.imgIcon ? props.imgIcon : Images.RightArrow} style={[styles.imgStyle]} />

                      }
                    </TouchableOpacity>

                  </TouchableOpacity>



                </View>
              )}

            </View>
          </View>
        </View>
      }

    </>

  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle: {
    flexDirection: "row",
    marginTop: dimen(19),
    marginBottom: dimen(20)
    // marginVertical:dimen(20),

  },
  mainView: {
    paddingHorizontal: dimen(24),
    //  flex:1
  },
  imgStyle: {
    alignSelf: "center",
    resizeMode: "contain",
    marginRight: dimen(16),
  },
  imgStyleLeft: {
    // alignSelf: "center",
    resizeMode: "contain",
    // justifyContent: "center",
    // alignItems:'center',
    height: dimen(36),
    width: dimen(36),
    marginLeft: dimen(16),


    // marginLeft:dimen(16)
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(16),
    lineHeight: dimen(19),
    alignSelf: "flex-start",
    marginLeft: dimen(9),

  },
  bottomTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(14),
    lineHeight: dimen(18),
    alignSelf: "flex-start",
  }
  , gradient: {
    borderRadius: dimen(12),
  },
  gradientStyleTwo: {
    marginLeft: dimen(16),
    marginVertical: dimen(20),
    height: dimen(36),
    width: dimen(36),
    borderRadius: dimen(100),
    justifyContent: "center",
    alignItems: "center",
  },
  privacyView: {
    borderRadius: dimen(12),
    marginBottom: dimen(16),
    width: '100%',
    // borderWidth: 1,
    borderColor: ThemeManager.colors.carBorder,
    overflow: 'hidden',
    // marginTop: heightDimen(16)
  },
  imageBg: {
    height: dimen(36),
    width: dimen(36),
    marginLeft: dimen(16),
    borderRadius: dimen(14),
    alignItems: "center",
    justifyContent: "center"
  }
});
