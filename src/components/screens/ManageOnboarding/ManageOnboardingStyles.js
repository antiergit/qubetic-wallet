
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';



export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: dimen(25)

  },
  subView: {
    flex: 1,
    alignItems: 'center',

  },
  welcomeText: {
    fontFamily: Fonts.dmBold,
    fontSize: 24,
    marginTop: dimen(24),
    textAlign: 'center',
  },
  descText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    marginTop: dimen(10),
    textAlign: 'center'
  },
  importText: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    alignSelf: 'center'

  },
  headerText: {
    marginTop: dimen(26),
    fontFamily: Fonts.dmBold,
    fontSize: dimen(28),
    textAlign: 'center',
    lineHeight: dimen(34),
    marginHorizontal: widthDimen(28),
  },
  boldText: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(16),
    lineHeight: getDimensionPercentage(24),
    textAlign: "center",
    marginTop: heightDimen(10)

  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});