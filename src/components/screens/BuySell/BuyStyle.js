import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
export default StyleSheet.create({
  sendBtnStyle: {
    marginTop: 20,
    marginBottom: 25,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sendBtnTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  textStyle: {
    marginTop: 25,
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  ViewStyle1: {
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  TextStyle1: {
    marginTop: 45,
    marginBottom: 7,
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  ViewStyle7: {
    fontSize: 16,
    textAlign: 'center',
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    marginTop: 12,
    marginBottom: 5,
  },
  txtTitle1: {
    marginVertical: 10,
    marginRight: 8,
    fontSize: 12,
    fontFamily: Fonts.dmMedium,
    textAlign: 'right',
  },
  txtTitle2: {
    marginVertical: 10,
    marginRight: 8,
    fontSize: 12,
    fontFamily: Fonts.dmMedium,
    textAlign: 'center',
  },
  pin_wrap: {
    alignItems: 'center',
  },
  listStyle: {
    alignItems: 'center',
    height: 50,
    width: 50,
    justifyContent: 'center',
    padding: 10,
    margin: Dimensions.get('screen').height > 800 ? 20 : 10,
  },
  pinBlockTextStyle: {
    fontFamily: Fonts.dmMedium,
    color: Colors.textColor,
    fontSize: 20,
    textAlign: 'center',
  },
  pinBlockStyle: {
    alignItems: 'center',
    height: 50,
    width: 50,
    justifyContent: 'center',
    borderColor: 'red',
    borderRadius: 100,
    padding: 7,
    textAlign: 'center',
    alignSelf: 'center',
    margin: Dimensions.get('screen').height > 800 ? 30 : 20,
  },
});
