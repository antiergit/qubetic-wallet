
import { StatusBar, StyleSheet } from 'react-native';
import { getDimensionPercentage as dimen, hasNotchWithIOS, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';


export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(24),

  },
  mainViewStyle: {
    // flex: 1,
    marginHorizontal: dimen(21)


  },
  headerTextStyle: {
    color: ThemeManager.colors.TextColor,
  },
  txtheading: {
    marginTop: dimen(30),
    textAlign: 'center',
    fontSize: dimen(24),
    lineHeight: dimen(36),
    color: ThemeManager.cloudy,
    fontFamily: Fonts.dmMedium,
  },

  txtButtonContainer: {
    marginBottom: hasNotchWithIOS() ? dimen(50) : dimen(20),
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: dimen(24)
    // backgroundColor:'red'

  },
  buttonstyle: {
    width: '100%',
  },
  mnemonicInput: {
    borderRadius: 12,
    // backgroundColor: ThemeManager.colors.nmemonicsInputColor,
    // padding: 5,
    paddingHorizontal: dimen(10.5),
    paddingVertical: dimen(7),
    // marginVertical: 10,
    height: dimen(228),
    flexDirection: 'row',
    overflow: 'scroll',
    flexWrap: 'wrap',
    // top: 5,
    // backgroundColor:"red",
    marginTop: dimen(30),
    borderColor: ThemeManager.colors.primaryColor,
    borderWidth: 1

  },
  mnemonicsStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: dimen(24),
    justifyContent: 'space-between',
    // width: '100%',
    // borderRadius: 15,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // alignItems: 'center',
    // justifyContent: 'space-around',
    // marginTop: dimen(24),
  },
  mnemonic_style: {


    borderRadius: dimen(14),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: heightDimen(10),
    paddingVertical: heightDimen(8),
    paddingHorizontal: widthDimen(5),
    width: "31%"
  },
  jumleText: {
    fontFamily: Fonts.dmMedium,
    fontSize: dimen(14),
    lineHeight: dimen(21.17),

  },
  mnemonicActive: {
    borderStyle: 'dotted',
    borderRadius: 12,


  },


});
