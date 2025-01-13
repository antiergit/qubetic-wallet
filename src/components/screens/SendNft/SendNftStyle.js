import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { dimen, hasNotchWithIOS, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  imageStyle: {
    height: heightDimen(142),
    width: widthDimen(129),
    borderRadius: 14,
    resizeMode: "contain"
  },
  name: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(18),
    marginBottom: heightDimen(19)
  },
  tokenId: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(14),
    marginBottom: heightDimen(6)
  },
  Standard: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(14)
  },


  ViewStyle: {
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
  },
  ViewStyle1: {
    alignSelf: 'center',
    width: '72%',
  },
  txtWallet: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
    marginBottom: 10,

  }, scan: {
    position: 'absolute',
    right: 15,
    top: 12,
    tintColor: 'white',
  },
  ViewStyle2: {
    marginTop: -20,
    height: 50,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
  },
  maxText: {
    fontSize: 16,
    fontFamily: Fonts.dmBold,
  },
  maxStyle: {
    height: 50,
    position: 'absolute',
    right: 20,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  ViewStyle4: {
    fontSize: 16,
    alignSelf: "center",
    fontFamily: Fonts.dmLight
  },
  transactionFees: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    marginTop: 10
  },
  btnView: {
    marginHorizontal: 24,
    marginBottom: hasNotchWithIOS() ? dimen(52) : dimen(30)
  },
  modalView: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    paddingBottom: 0,
  },
  cameraStyle: {
    height: Dimensions.get('window').height / 2,
    width: '80%',
    alignSelf: 'center',
  },
  txtCancel: {
    fontFamily: Fonts.osSemibold,
    fontSize: 15,
    color: Colors.White,
    marginTop: 20,
    marginRight: 15,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

});
