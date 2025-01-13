import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { LanguageManager } from '../../../LanguageManager';

export const CardViewVirtualPhy = props => {
  const { commonText } = LanguageManager;

  /******************************************************************************************/
  return (
    <>
      {props.isUpload ? (
        <>
          <View style={[styles.ViewStyleOne, { borderBottomWidth: props.hideBottom ? 0 : 1, borderColor: ThemeManager.colors.borderColor, paddingBottom: 20 }]}>

            <View style={[styles.ViewStyleNew, props.ViewStyle, {}]}>
              <Text allowFontScaling={false} style={[styles.textStyle, { textAlign: 'left', color: ThemeManager.colors.settingsText }, props.leftTextStyle]}>{props.text}</Text>
              <Text onPress={props.righttopTxtPress} allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText, textDecorationLine: 'underline', flex: 1, textAlign: 'right' }]}>{props.righttopTxt}</Text>
            </View>

            {props.hideImg ? null :
              <TouchableOpacity activeOpacity={0.7} disabled={props.onPressImg ? false : true} onPress={props.onPressImg}>
                <Image source={props.UploadImgOne} style={[styles.imgStyle1, props.imgStyle1]} />
              </TouchableOpacity>
            }
            {props.txtLineOne && (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <View style={[styles.radiobtnStyle, props.radiobtnStyle]}></View>
                <Text style={[styles.txtLineOneStyle, props.txtLineOneStyle]}>{props.txtLineOne}</Text>
              </View>
            )}

            {props.txtLineTwo && (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <View style={[styles.radiobtnStyle, props.radiobtnStyle]}></View>
                <Text style={[styles.txtLineOneStyle, props.txtLineOneStyle]}>{props.txtLineTwo}</Text>
              </View>
            )}

            {props.txtLineThree && (
              <View style={{ flexDirection: 'row', marginRight: 10 }}>
                <View style={[styles.radiobtnStyle, props.radiobtnStyle]}></View>
                <Text style={[styles.txtLineOneStyle, props.txtLineOneStyle]}>{props.txtLineThree}</Text>
              </View>
            )}
            {props.endButton && props.endButton()}
            {props.bottomText && props.bottomText()}
          </View>
        </>

      ) : props.isSignature ? (

        <View style={[styles.ViewStyleOne, props.ViewStyleOne, { borderBottomWidth: props.hideBottom ? 0 : 1, borderColor: ThemeManager.colors.borderColor, paddingBottom: 20 }]}>
          <View style={[styles.ViewStyleNew, props.ViewStyle, {}]}>
            {props.text ? <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText }, props.leftTextStyle]}>{props.text}</Text> : null}
            {props.righttopTxt ? <Text onPress={props.righttopTxtPress} allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.settingsText, textDecorationLine: 'underline', flex: 1, textAlign: 'right' }]}>{props.righttopTxt}</Text> : null}
          </View>
          {props.signatureComponent && props.signatureComponent()}
          {props.endButton && props.endButton()}
          {props.bottomText && props.bottomText()}
        </View>

      ) : props.uploadSignature ? (
        <>
          <View style={[styles.ViewStyleOne, { borderBottomWidth: props.hideBottom ? 0 : 1, borderColor: ThemeManager.colors.borderColor, paddingBottom: 20 }]}>

            <View style={{ marginTop: 10 }}>
              <TouchableOpacity activeOpacity={0.7} onPress={props.righttopTxtPress} style={[styles.codeBg, { backgroundColor: ThemeManager.colors.colorVariation }]}>
                <Text style={[styles.txt2, { color: ThemeManager.colors.Mainbg }]}>{props.righttopTxt}</Text>
              </TouchableOpacity>
              {props.hideImg ? null :
                <Image source={props.UploadImgOne} style={[styles.imgStyle1, props.imgStyle1]} />
              }
            </View>


          </View>
        </>

      ) : (
        <View style={[styles.mainView]}>
          <View style={[styles.ViewStyle, props.ViewStyle, { flexDirection: 'column', borderBottomWidth: props.hideBottom ? 0 : 1, borderColor: ThemeManager.colors.borderUnderLine }]}>
            <View style={[styles.ViewStyleInner, props.ViewStyleInner]}>
              <Text allowFontScaling={false} style={[styles.textStyle, props.textStyle11, { color: ThemeManager.colors.newTitle }]}>{props.text}</Text>

              {props.dropDownView ? (
                <View style={styles.ViewStyle1}>
                  <TouchableOpacity disabled={props.disableTouch} style={styles.ViewStyle1} onPress={props.onPressTxt}>
                    <Text style={[styles.rightTxt, props.rightTxtStyle]}>{props.textRight}</Text>
                    {props.hideImage ? null : <Image source={props.rightImg} style={[styles.imgStyle, { tintColor: ThemeManager.colors.colorVariationBorder }]} />}
                  </TouchableOpacity>
                </View>
              ) : (

                <View style={{ ...styles.ViewStyle1, alignItems: 'center' }}>
                  {props.showNumbView && (
                    <View style={styles.phonecodeMainView}>
                      <TouchableOpacity onPress={props.onPressCountryCode} style={[styles.phoneCodeView, props.phoneCodeView]}>
                        <Text style={[props.phoneCodetxtStyle, styles.rightTxt]}>{props.phoneCodetxt}</Text>
                        <Image source={Images.dropdownnew} style={[styles.imgStyle, { tintColor: ThemeManager.colors.colorVariationBorder }]} />
                      </TouchableOpacity>
                    </View>
                  )}

                  <TextInput style={[{ marginLeft: 8, justifyContent: 'flex-end', flex: 1, }, props.inputStyle, styles.rightTxt]}
                    value={props.value}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor}
                    editable={props.editable}
                    maxLength={props.maxLength}
                    multiline
                    onBlur={props.onBlur}
                    keyboardType={props.keyboardType}
                    onChangeText={props.onChangeText}
                  />

                  {props.OTPstatus && (
                    <TouchableOpacity onPress={props.onPressRight} disabled={props.disableRight || props.status == 'verified'}>
                      {props.OTPstatus == 'verify' ? (
                        <Text style={[styles.verifyTextStyle, { color: props.disableRight ? ThemeManager.colors.lightText : 'black', paddingHorizontal: 10 }]}>{commonText.Verify}</Text>
                      ) : (
                        <Image style={styles.imgStyle2} source={Images.completed} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            {props.endButton && props.endButton()}
            {props.bottomText && props.bottomText()}
          </View>
        </View>
      )}
    </>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  codeBg: {
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: Colors.btnBg,
    marginBottom: 5,
    width: '50%',
    alignSelf: 'center'
  },
  txt2: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  imgStyle2: {
    paddingHorizontal: 6,
    width: 12,
    height: 9,
    marginLeft: 10,
  },
  ViewStyle1: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  imgStyle1: {
    alignSelf: 'center',
    width: '100%',
    resizeMode: "stretch",
    height: 200,
    marginVertical: 10,
    borderRadius: Platform.OS == 'ios' ? 20 : 10,
    // resizeMode: 'stretch',
  },
  ViewStyle: {
    paddingHorizontal: 20,
    flex: 1,
  },
  ViewStyleInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 1,
  },
  verifyTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    right: -10,
  },
  ViewStyleNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ViewStyleOne: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginLeft: 8,
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'right',
  },
  rightTxt: {
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
    textAlign: 'right',
    textAlignVertical: 'top',
  },
  phonecodeMainView: {
    flex: 0.8,
    alignItems: 'flex-end',
    marginLeft: 10,
    justifyContent: 'center',
  },
  phoneCodeView: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    justifyContent: 'space-between',
    minWidth: '70%',
    alignSelf: 'flex-end',
  },
  radiobtnStyle: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 5,
  },
  txtLineOneStyle: {
    fontSize: 12,
    fontFamily: Fonts.dmLight,
  },
});
