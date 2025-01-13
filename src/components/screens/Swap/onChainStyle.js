import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { bottomNotchWidth, getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { platform } from 'process';


export default StyleSheet.create({
  ViewStyle4: {
    flex: 1,
    backgroundColor: ThemeManager.colors.lightBlack,
    marginBottom: 0,
  },
  tabsViewNew: {
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingHorizontal: 35,
    paddingVertical: 12,
    borderRadius: 10,
  },
  SafeAreaViewStyle: {
    flexGrow: 1,
    marginTop: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  btnView: {
    // justifyContent: 'flex-end',
    // paddingHorizontal: 6,
    // marginTop: 25,
    marginTop: getDimensionPercentage(10),
    marginBottom: getDimensionPercentage(30),
    // flexDirection:'row',
    // flex:1,
    // backgroundColor:'red',
    // height:'100%'
  },
  textStyle: {
    textAlign: 'right',
    // marginTop: 15,
    marginRight: 8,
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  imgstyle: {
    alignSelf: 'center',
    resizeMode: 'contain',
    // height: dimen(39),
    // width: dimen(39),

  },
  ViewStyle2: {
    alignSelf: 'center',
    elevation: 3,
    // borderWidth: 2,
    // borderRadius: 39,
  },
  ViewStyle1: {
    paddingVertical: 15,
    paddingHorizontal: 5,

  },
  ViewStyle: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,

  },
  tabsView: {
    justifyContent: 'space-between',
    // borderWidth: 1,
    // width: Dimensions.get('screen').width /6.2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  sliderView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    // height:50

  },
  header: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    padding: Platform.OS == 'ios' ? 20 : 0,
    borderWidth: 1,
    borderColor: ThemeManager.colors.lightWhiteText,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  np_active_wallet_text: {
    textAlign: 'center',
    letterSpacing: 0,
    color: ThemeManager.colors.whiteText,
    fontSize: 12,
    fontFamily: Fonts.dmMedium,
  },
  ViewStyle3: {
    justifyContent: 'space-between',
    marginTop: 15,
  },
  tabsViewTwo: {
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width / 5.8,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',

  },
  textStyle1: {
    fontSize: 12,
    fontFamily: Fonts.dmMedium,
  },

  imgStyle: {
    alignSelf: 'center',
    height: 39,
    width: 39,
    transform: [{ rotate: '270deg' }],
  },
  // ViewStyle2: {
  //   zIndex: 16,
  //   position: 'absolute',
  //   elevation: 3,
  //   borderWidth: 2,
  //   borderRadius: 39,
  //   zIndex: 1,
  //   top: 98,
  //   alignSelf: 'center',
  // },
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 100,
    marginHorizontal: 22,
    marginTop: 15,
  },
  emptyView1: {
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 2.5,
  },
  txtTitle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    marginHorizontal: 23,
    marginTop: 20,
  },
  // -----------
  contentContainerStyle: {
    flexGrow: 1,
    paddingBottom: 100,
    marginHorizontal: 22,
    marginTop: 15,
  },
  emptyView1: {
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 2.5,
  },
  txtTitle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    marginHorizontal: 23,
    marginTop: 20,
  },

  lefttextStyle: {
    fontSize: dimen(16),
    fontFamily: Fonts.dmMedium,
  },
  sendBtnTextStyle: {
    fontSize: 16,
    color: ThemeManager.colors.blackText,
    fontFamily: Fonts.dmBold
  },
  btnStyle: { borderColor: ThemeManager.colors.settingsText, flex: 1, backgroundColor: ThemeManager.colors.settingsText, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  //////////////****************////////////
  // Approve Modal Style
  //Modal Style
  main_container: {
    width: "100%",
  },
  heading_container: {
    marginTop: dimen(23.68),
    alignItems: "center"
  },
  heading_text: {
    fontSize: 18,
    fontFamily: Fonts.dmBold
  },

  token_head_container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: dimen(26),
  },
  logo: {
    height: dimen(44),
    width: dimen(44),
    marginBottom: dimen(6),
    borderRadius: dimen(22)
  },
  token_name: {
    fontSize: 20,
    // fontWeight: "700",
    fontFamily: Fonts.dmBold,
    lineHeight: dimen(22.1)
  },
  amount_text: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: dimen(15.6),
    color: ThemeManager.colors.subTextColor,
    fontFamily: Fonts.dmMedium
  },
  body_container: {},
  first_view: {
    marginTop: dimen(28),
    backgroundColor: Colors.bgView,
    borderRadius: 10
  },
  info_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: dimen(16),
    alignItems: "flex-start",
    // backgroundColor:"red"
  },
  left_texts: {
    fontSize: 16,
    fontWeight: "500",
    color: ThemeManager.colors.subTextColor,
    fontFamily: Fonts.dmSemiBold,
    // lineHeight: dimen(19.36)
  },
  providerIcon_TXT_row: {
    flexDirection: "row",
    alignItems: "center",
  },
  right_Double_col_View: {
    alignItems: "flex-end",
  },
  right_value_text: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Fonts.dmBold,
  },
  right_lower_text: {
    fontSize: 12,
    fontWeight: "500",
    color: ThemeManager.colors.subTextColor,
    fontFamily: Fonts.dmSemiBold,
    // lineHeight: dimen(14.52)
  },
  second_view: {
    backgroundColor: Colors.bgView,
    marginTop: dimen(10),
    borderRadius: 10
  },
  provider_icon: {
    height: dimen(18),
    width: dimen(19.13),
    marginRight: dimen(5)
  },
  seprator_line: {
    marginHorizontal: dimen(16),
  },
  btn_container: {
    marginTop: dimen(50.79),
  },
  btn_style: {
    // height:dimen(25)
  },
  btn_text: {
    fontFamily: Fonts.dmSemiBold,
  },


  //////////////****************////////////
  // **Preview Modal style**//
  tokens_Main_Container: {
    flexDirection: "row",
    // justifyContent: "center",
    justifyContent: "space-evenly",
    marginTop: dimen(30),
  },
  Token_container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
    // backgroundColor:"red"
  },
  transfer_container: {
    alignItems: "center",
    marginHorizontal: dimen(45),
  },
  Transfer_Icon: {
    height: dimen(15),
    width: dimen(15),
    position: "absolute",
    // zIndex:-3,
    top: 9,
  },
  transfer_line: {
    width: dimen(144),
    height: heightDimen(1),
    alignSelf: "center",
    position: "absolute",
    zIndex: -3,
    top: 15,
  },

  slippageView: {
    marginTop: dimen(30),
  },
  slippageText: {
    fontSize: 14,
    color: ThemeManager.colors.subTextColor,
    fontFamily: Fonts.dmRegular,

  },
  cancelView: {
    justifyContent: 'space-between',
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: ThemeManager.colors.addressBookDropBorederColor
  },
  viewRow:
  {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: getDimensionPercentage(10)
    //  marginBottom: dimen(15) 
  },
  slippageIcon: {
    width: 20,
    height: 20,
    marginRight: 5
  },
  slippageView: { alignSelf: 'flex-end', marginVertical: 20, flexDirection: 'row' },
  slippageTabView: { marginTop: 20, },
  textStyle2: {
    textAlign: 'right',
    // marginTop: 15,
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  reciptViewStyle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: heightDimen(6),
    marginTop: heightDimen(20)
  }

});
