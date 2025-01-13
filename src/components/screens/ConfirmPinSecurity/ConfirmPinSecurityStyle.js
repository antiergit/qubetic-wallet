import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { moderateScale } from '../../../layouts/responsive';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  stepStyle: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  wrap: {
    display: 'flex',
    paddingHorizontal: 23,
  },
  subHeaderStyle: {
    marginTop: 20,
  },
  titlStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 26,
    color: ThemeManager.colors.whiteText,
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    color: ThemeManager.colors.lightWhiteText,
    textAlign: 'center',
  },
  pin_wrap: {
    alignItems: 'center',
    flex: 0.6,
    justifyContent: 'flex-end'
  },
  pinBlockStyle: {
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
    // borderColor: 'red',
    // borderRadius: 100,
    // padding: getDimensionPercentage(10),

    // padding: 7,
    // textAlign: 'center',
    // alignSelf: 'center',
    // marginRight: 40,
    // margin: Dimensions.get('screen').height > 800 ? 20 : 10,
    // backgroundColor:'green',

    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  listStyle: {
    alignItems: 'center',
    height: getDimensionPercentage(50),
    width: getDimensionPercentage(50),
    justifyContent: 'center',
    // padding: getDimensionPercentage(10),
    // margin: Dimensions.get('screen').height > 800 ? 20 : 10,
    // backgroundColor:'pink',
    marginBottom: heightDimen(30),
    marginHorizontal: widthDimen(40)
  },
  itemsStyle: {
    width: moderateScale(50),
    height: moderateScale(50), // Set width and height to create a circle
    borderRadius: moderateScale(25), // Half of width/height to create a circle
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeManager.colors.pinBackground,
  },
  secretText: {
    fontSize: moderateScale(20),
    color: ThemeManager.colors.headersTextColor,
    padding: moderateScale(15),
  },
  // pinBlockTextStyle: {
  //   fontFamily: Fonts.dmMedium,
  //   color: Colors.textColor,
  //   fontSize: moderateScale(30),
  //   textAlign: 'center',
  // },
  pinBlockTextStyle: {
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.headersTextColor,
    fontSize: getDimensionPercentage(30),
    textAlign: 'center',
    lineHeight: getDimensionPercentage(39)
  },
});
