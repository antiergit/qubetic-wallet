import { Dimensions, Platform, StyleSheet, StatusBar } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts } from '../../../theme/';
import { dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { platform } from 'process';
import DeviceInfo from 'react-native-device-info';
export default StyleSheet.create({
  touchableStyleNew: {
    paddingVertical: 12,
    borderRadius: 10,
    paddingLeft: 20,
    justifyContent: 'flex-start',
    width: '80%',
    alignSelf: 'center',
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#00000077',
  },
  modalView: {
    borderRadius: 10,
    width: '90%',
    elevation: 4,
    // padding: 20
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    marginLeft: 5,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  imgStyle1: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  ViewStyle3: {
    justifyContent: 'center',
  },
  emptyView1: {
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 5,
  },
  ViewStyle2: {

    // height: 210,
    // backgroundColor:'green',
    // paddingVertical:20,
    // paddingHorizontal: 20,
    paddingHorizontal: getDimensionPercentage(25),

    width: '100%',
    // backgroundColor:'pink',
    // marginTop:heightDimen(Platform.OS == 'ios' ? 10: 50),
    marginTop: Platform.OS == 'ios'
      ? DeviceInfo.hasNotch() || DeviceInfo.hasDynamicIsland()
        ? 0
        : 0
      : StatusBar.currentHeight
        ? StatusBar.currentHeight
        : 28,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  ViewStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchableStyle: {
    borderRadius: 5,
    width: 33,
    height: 33,
    marginLeft: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getDimensionPercentage(20),
    justifyContent: "space-between"
  },
  txtCoin: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    marginLeft: 7,
    marginRight: 20,
  },
  imgNoti: {
    // height: 20,
    // width: 20,
    // alignSelf: 'center',
    // resizeMode: 'contain',
  },
  imgSearch: {
    resizeMode: 'center',
    height: 16,
    width: 16,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  viewAssets: {
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  imgSearch2: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    padding: 5,
  },
  viewCoinList: {
    // borderTopWidth: 0.4,
    // marginHorizontal: -24,
    // paddingHorizontal: 20,
    // justifyContent: 'center'
  },
  txtNoAssets: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.whiteText,
    alignSelf: 'center',
  },
  nameView: {

    paddingLeft: widthDimen(10),
    paddingRight: widthDimen(10),
    borderRadius: 14,
    paddingVertical: 6
  },
  walletNameIcon: {
    fontFamily: Fonts.dmBold,
    fontSize: dimen(25.46),
    fontWeight: '700',
    // marginBottom: -2
  },
  walletName: {
    textTransform: "capitalize",
    marginLeft: widthDimen(6),
    fontSize: getDimensionPercentage(20),
    fontFamily: Fonts.dmSemiBold,
    lineHeight: getDimensionPercentage(20),
    maxWidth: widthDimen(230),
    marginTop: heightDimen(5),
  },
  touchAbleStyle: {
    marginVertical: 30,
    alignSelf: "center",
    height: dimen(45),
    position: "absolute",
    bottom: 0
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: dimen(45),
  },
  copyButtonText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(16),
    lineHeight: dimen(24),
    textAlign: "center",
  },

});
