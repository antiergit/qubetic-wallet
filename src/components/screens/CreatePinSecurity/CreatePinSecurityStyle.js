import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { moderateScale, verticalScale } from '../../../layouts/responsive';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  ViewStyle: {
    marginVertical: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  ViewStyle2: {
    borderRadius: 5,
    marginTop: 5,
    height: 5,
    width: 80,
    backgroundColor: Colors.lossColor,
  },
  stepStyle: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  wrap: {
    flex: 1
  },
  subHeaderStyle: {
    marginTop: verticalScale(60),
    justifyContent: 'center',
    alignItems: 'center'
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
  pinBlockTextStyle: {
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.headersTextColor,
    fontSize: getDimensionPercentage(30),
    textAlign: 'center',
    lineHeight: getDimensionPercentage(39)
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

});
