import { Dimensions, Platform, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme';
import { getDimensionPercentage } from '../../../Utils';

export default StyleSheet.create({
  imgStyle: {
    marginLeft: 15,
    height: 30,
    width: 30,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  textStyle1: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
    paddingVertical: 5,
  },
  dropdown: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    top: 75,
    left: 0,
    right: 0,
    borderWidth: 1,
    zIndex: 16,
    // width: '100%'
  },
  touchableStyle: {
    alignSelf: 'center',
    padding: 5,
  },
  ViewStyle3: {
    height: 0.5,
    width: '95%',
    alignSelf: 'center',
    marginVertical: 5,
    marginLeft: 5,
  },
  ViewStyle2: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  cancelText: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
    color: Colors.White,
    marginTop: 20,
    marginRight: Platform.OS == 'ios' ? getDimensionPercentage(30) : getDimensionPercentage(15),
    alignSelf: 'flex-end',
  },
  cameraStyle: {
    height: Dimensions.get('window').height / 2,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  textStyle: {
    marginTop: 10,
    fontSize: 15,
    alignSelf: 'center',
    fontFamily: Fonts.dmRegular,
  },
  ViewStyle1: {
    marginTop: 10,
    height: 1,
    width: '100%',
  },
  ViewStyle: {
    height: 0.8,
    alignSelf: 'center',
    width: '98%',
    marginLeft: 10,
  },
  customStyle: {
    width: '80%',
    height: 45,
    paddingLeft: 7,
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.whiteText,
  },
  Title: {
    fontSize: 15,
    fontFamily: Fonts.dmRegular,
    color: ThemeManager.colors.whiteText,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  securityItem_list_textstyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
    marginLeft: 7,
  },
  securityItem_list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingRight: 8,
  },
  paste: {
    marginRight: 8,
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: ThemeManager.colors.colorVariation,
  },
  tokenImage_style: {
    width: 30,
    height: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderRadius: 38 / 2,
  },
  tokenItem: {
    borderBottomWidth: 1,
    borderBottomColor: ThemeManager.colors.borderColorCurr,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tokenItem_first: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tokenAbr_style: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
    marginRight: 5,
    marginLeft: 10,
  },
  centeredView: {
    flex: 1,
    backgroundColor: ThemeManager.colors.lightBlack,
    justifyContent: 'center',
    minHeight: '10%',
    elevation: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  txtCharErr: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    padding: 4,
    color: ThemeManager.colors.colorVariation,
    alignSelf: 'flex-start',
    marginTop: -8,
  },
});
