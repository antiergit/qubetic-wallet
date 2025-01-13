import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { Colors, Fonts } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';

export const RewardCard = props => {

  //******************************************************************************************/
  return (
    <>

      <View style={[styles.ViewStyle, props.styles, { backgroundColor: ThemeManager.colors.cardBg }]}>
        <Image style={props.imgStyle} source={props.image} />
        <View style={[props.ViewStyle]}>
          <Text style={[styles.textStyle, props.textstyle]}>{props.text}</Text>
          <Text style={[props.textstyle1]}>{props.text1}<Text style={[styles.textStyle1, { color: ThemeManager.colors.lightText }]}>{props.text3}</Text></Text>
          <Text style={[props.textstyle1, { marginTop: -23, color: ThemeManager.colors.lightText }]}>{props.text2}<Text style={[styles.textStyle1, { color: ThemeManager.colors.txtNew1 }]}>{props.text4}</Text></Text>
        </View>
        {props.children}
      </View>
    </>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle: {
    width: Dimensions.get('screen').width / 2.25,
    justifyContent: 'flex-start',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 5,
  },
  textStyle: {},
  textStyle1: {
    fontFamily: Fonts.dmBold,
    fontSize: 16,
    lineHeight: 49
  }
});
