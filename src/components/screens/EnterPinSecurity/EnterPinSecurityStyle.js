import { StyleSheet, Dimensions } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  stepStyle: {
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  wrap: {
    flex: 1,
    display: 'flex',
    paddingHorizontal: 24,
    // marginBottom: 25,
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
    justifyContent: 'flex-end',
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
    marginHorizontal: 5,
    width: 12,
    height: 12,
    borderRadius: 20,
    borderWidth: 0.7,
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
  pinBlockTextStyle: {
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.headersTextColor,
    fontSize: getDimensionPercentage(30),
    textAlign: 'center',
    lineHeight: getDimensionPercentage(39)
  },
});
