import { StyleSheet } from 'react-native';
import { Fonts, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import React from 'react';

export const CardViewoption = props => {

  /******************************************************************************************/
  return (
    <View onPress={props.onPress} style={[styles.mainView]}>
      <View style={[styles.ViewStyle, { paddingBottom: props.paddingBottom ? props.paddingBottom : props.hideBottom ? 11 : 15, borderBottomWidth: props.hideBottom ? 0 : 1, borderColor: ThemeManager.colors.borderUnderLine, marginTop: props.marginTop ? props.marginTop : 0 }]}>
        <Text allowFontScaling={false} style={[styles.textStyle, props.customTextStyle]}>{props.text}</Text>
        <TouchableOpacity disabled={props.disabled} onPress={props.onPressTxt} style={{ flexDirection: 'row', alignContent: 'center' }}>
          <Text allowFontScaling={false} style={[styles.textTypeStyle, props.customTypeTextStyle, { color: ThemeManager.colors.txtNew1 }]}>{props.typeText}</Text>
          {props.showArrow && (<Image source={Images.RightArrow} style={[styles.imgStyle, { tintColor: props?.themeSelected == 2 ? ThemeManager.colors.colorVariationBorder : 'white' }]} />)}
        </TouchableOpacity>
      </View>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  imgStyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: '#1A202E',
  },
  textTypeStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
  },
});
