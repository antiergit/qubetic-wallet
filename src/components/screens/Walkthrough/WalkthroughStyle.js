import { Dimensions, Platform, StyleSheet } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts } from '../../../theme/';
import DeviceInfo from 'react-native-device-info';

const walkthroughStyle = theme =>
  StyleSheet.create({
    ViewStyle1: {
      height: 300,
      width: '100%',
      marginTop: Platform.OS == 'android' ? 40 : 0,
    },
    appLogo: {
      marginVertical: 25,
      alignSelf: 'center',
    },
    textStyle: {
      fontFamily: Fonts.dmSemiBold,
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 20,
    },
    contentContainerStyle: {
      alignItems: 'center',
    },
    touchableStyle2: {
      height: 50,
      width: 74,
      marginHorizontal: 5,
      marginVertical: 5,
    },
    textStyle11: {
      fontFamily: Fonts.dmMedium,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 15,
      letterSpacing: -0.28,
    },
    ViewStyle: {
      marginTop: Dimensions.get('screen').height > 640 ? 20 : 10,
      marginBottom: DeviceInfo.hasNotch() ? 20 : 0,
      width: '100%',
      justifyContent: 'space-between',
    },
    absoluteView: {
      position: 'absolute',
      top: -35,
      right: -20,
      elevation: 10,
      zIndex: 1000,
      transform: [
        {
          rotate: '350deg',
        },
      ],
    },
    imgStyle: {
      height: Dimensions.get('window').height / 4,
      width: '100%',
      alignSelf: 'center',
      marginTop: 50,
    },
    txtStyle: {
      fontFamily: Fonts.dmMedium,
      fontSize: 18,
      marginHorizontal: 30,
      textAlign: 'center',
    },
    imgBg: {
      height: Platform.OS == 'ios' ? Dimensions.get('screen').height - 100 : Dimensions.get('screen').height - 15,
      width: '100%',
      justifyContent: 'center',
    },
    wrapper: {},
    imageIcon: {
      height: Dimensions.get('screen').height > 640 ? 190 : 148,
      width: 208,
      alignSelf: 'center',
      marginTop: Dimensions.get('screen').height > 900 ? 75 : 50,
    },
    title: {
      fontFamily: Fonts.dmLight,
      fontSize: Dimensions.get('screen').height > 640 ? 30 : 30,
      color: 'white',
      textAlign: 'center',
      paddingHorizontal: Dimensions.get('screen').height > 640 ? 40 : 20,
      marginTop: Dimensions.get('screen').height > 900 ? 116 : 80,
      letterSpacing: 0.27,
    },
    txtFont: {
      fontFamily: Fonts.dmLight,
      fontSize: 16,
      textAlign: 'center',
      color: ThemeManager.colors.lightWhiteText,
      marginLeft: 49,
      marginRight: 49,
      marginTop: 40,
      lineHeight: 23,
      padding: 4,
    },
    txtRestore: {
      fontFamily: Fonts.dmLight,
      fontSize: 13,
      textAlign: 'center',
      color: ThemeManager.colors.lightWhiteText,
      marginTop: -10,
      marginLeft: 8,
      marginRight: 8,
    },
    viewLine: {
      height: 2,
      width: 100,
      backgroundColor: '#504F4F',
    },

    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB',
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5',
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9',
    },
    text: {
      color: ThemeManager.colors.whiteText,
      fontSize: 30,
      fontWeight: 'bold',
    },
    txtBold: {
      color: ThemeManager.colors.whiteText,
      fontSize: 38,
      marginHorizontal: 30,
      fontWeight: 'bold',
      alignSelf: 'center',
      textAlign: 'center',
      padding: 5,
      fontFamily: Fonts.dmBold,
      letterSpacing: 0.27,
    },
    FontText: {
      color: 'white',
      textAlign: 'center',
      alignSelf: 'center',
      fontSize: 16,
      fontFamily: Fonts.dmRegular,
    },
  });
export default walkthroughStyle;
