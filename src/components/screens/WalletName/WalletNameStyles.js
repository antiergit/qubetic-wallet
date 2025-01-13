
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';



export default StyleSheet.create({
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(24),
    marginTop: heightDimen(30)
  },
  mainViewStyle: {
    flex: 1,

  },
  headerTextStyle: {
    color: 'red',
  },
  txtheading: {
    marginTop: dimen(30),
    textAlign: 'center',
    fontSize: dimen(24),
    lineHeight: dimen(36),
    // color: 'yellow',
    fontFamily: Fonts.dmMedium,
    marginBottom: heightDimen(40)
  },
  styleMargin: {
    backgroundColor: 'blue',
    borderRadius: dimen(12),
    marginTop: dimen(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 12,
  },
  lineStyle: {
    borderBottomWidth: 1,
    borderColor: 'orange',
    marginHorizontal: dimen(10),
  },

  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimen(16),
    paddingTop: dimen(11),
    paddingBottom: dimen(9),
    justifyContent: 'space-between',
    marginVertical: dimen(6),
    marginHorizontal: dimen(10),
  },
  txtStyle: {
    textAlign: 'center',
    color: 'red',
    fontSize: dimen(16),
    lineHeight: dimen(24),
    fontFamily: Fonts.dmMedium,

  },
  rightArrowStyle: {
    height: dimen(12),
    width: dimen(7)
  },

  mainBtnView: {

    marginBottom: dimen(50)
  },
  btntxtStyle: {
    fontSize: dimen(18),
    fontFamily: Fonts.dmBold,
    lineHeight: dimen(24),
    letterSpacing: -dimen(0.36),
    flex: 1,
  },
  buttonstyle: {
    backgroundColor: 'green'
  }

});