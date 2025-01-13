import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../../theme';
import fonts from '../../../theme/Fonts';
import { ThemeManager } from '../../../../ThemeManager';
import colors from '../../../theme/Colors';
export default StyleSheet.create({
  reviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ViewStyle22: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'space-between',
  },
  ViewStyle2: {
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 10,
  },

  ViewStyle1: {
    minHeight: 95,
    paddingHorizontal: 20,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  ViewStyle: {
    alignSelf: 'center',
    // top: 20,
    position: 'absolute',
    zIndex: 16,
  },
  txt: {
    marginTop: 80,
    fontFamily: Fonts.dmBold,
    fontSize: 26,
    letterSpacing: 0.18,
    lineHeight: 49,
    textAlign: 'center',
  },
  txt1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    lineHeight: 27,
    textAlign: 'center',
    marginHorizontal: 60,
  },
  textstyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 15,
    color: Colors.txt_new,
    lineHeight: 27,
  },
  textstyle1: {
    fontFamily: Fonts.dmBold,
    fontSize: 26,
    letterSpacing: 0.18,
    lineHeight: 49,
    marginTop: -5,
  },
  textstyle_: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    lineHeight: 27,
  },
  myStyle: {
    alignSelf: 'center',
    width: '92%',
    fontFamily: Fonts.dmBold,
    fontSize: 18,
    color: Colors.txt_new,
    lineHeight: 39,
    letterSpacing: 0.13,
    textAlign: 'center',
  },
  txt2: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  codeBg: {
    // flex: 1,
    borderRadius: 7,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: Colors.btnBg,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  imgStyle1: {
    resizeMode: 'contain',
    alignSelf: 'center',
    width: Dimensions.get('screen').width + 25,
  },
  rewardTxt: {
    marginTop: 20,
    fontFamily: Fonts.dmSemiBold,
    fontSize: 16,
    lineHeight: 27,
    textAlign: 'left',
  },
  textStyle1: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    marginTop: 10,
    width: '35%',
  },


  textStyle2: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    marginTop: 10,
    width: '35%',
    color: '#1A202E',
  },
  cardFeatureView: {
    flexDirection: 'row',
    alignContent: 'center',
    marginTop: 10,
    marginRight: 20,
    marginLeft: 5
  },
  imageDesign: {

    resizeMode: 'contain',
    height: 30,
    width: 13,
  },
  textStyle: {
    marginLeft: 7,
    textAlign: "left",
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    color: "#64748B",
    marginTop: 4
  },

  cardFeatureText: {
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,
    marginVertical: 10,
    color: ThemeManager.colors.whiteText,
    marginTop: 20,
    paddingHorizontal: 20
  },
  cardBalance: {
    fontSize: 10,
    fontFamily: Fonts.dmRegular,
    color: '#64748B'


  },
  physicalCard:
    { flex: 1, alignContent: "flex-end", paddingHorizontal: 30 },
  physicalCardTxt: {
    alignSelf: "flex-end", fontSize: 8, fontFamily: Fonts.dmSemiBold
  },
  transtimeStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: ThemeManager.colors.lightWhiteText,
  },
  transtimeStyle1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: ThemeManager.colors.whiteText,
    marginTop: 10,
  },
  transTypeStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: Colors.textColor,
    marginTop: 5,
    marginRight: 10,
  },


  ViewStyle5: {
    width: '44%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },


  fromStatusStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 12,
    color: Colors.textColor,
  },
  fromRechargeStyle: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    color: ThemeManager.colors.lightBlack
  },
  tabContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    marginTop: 20,
    backgroundColor: '#F1F5F9',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row'
  },
  activeTab: {
    flex: 1,
    backgroundColor: colors.Black,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }, inActiveTab: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeTabText: {
    fontSize: 14,
    color: colors.White,
    fontFamily: Fonts.dmMedium
  },
  inActiveTabText: {
    fontSize: 14,
    color: colors.Black,
    fontFamily: Fonts.dmMedium
  },
  cardContainer: {
    marginVertical: 10,
    // marginTop: 20,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
    // paddingHorizontal: 17,
    paddingTop: 17,
    borderRadius: 30
  },
  statusAnimeTitle: {
    fontSize: 14,
    color: colors.Black,
    fontFamily: Fonts.dmMedium,
    // top: -20,
    marginTop: 10
  },
  statusAnimeText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: Fonts.dmRegular,
    // top: -15,
    textAlign: 'center',
    marginTop: 10
  },
  cardView: {
    height: 200,
    borderRadius: 30,
    position: 'relative',
    zIndex: -1,
    marginHorizontal: 8.6,
  },
  imageBackgroundStyles: {
    height: '100%',
    width: '100%',
    resizeMode: 'stretch'
  },
  codeText: { paddingRight: 30, fontSize: 24, color: Colors.textColor, fontStyle: 'italic' },
  cardInstruction: { fontFamily: Fonts.dmMedium, fontSize: 12, marginTop: 2 },
  backCardTop: { flex: 2, justifyContent: 'flex-end', alignItems: 'center', padding: 10 },
  backCardStrip: { width: '100%', height: 35, justifyContent: 'center', alignItems: 'flex-end', top: 0 },
  absoluteView: { position: 'absolute', height: '100%', width: '100%', zIndex: 10, borderRadius: 30, },
  statusText: { fontFamily: Fonts.dmRegular, fontSize: 14, textTransform: 'capitalize' },
  cardNumber: { fontFamily: Fonts.dmRegular, fontSize: 25, marginTop: -2 },
  cardNumberStar: { fontFamily: Fonts.dmRegular, fontSize: 25, marginTop: 6 },
  validThru: { fontFamily: Fonts.dmRegular, fontSize: 9 },
  datetext: { fontFamily: Fonts.dmSemiBold, fontSize: 15, marginLeft: 10 },
  nameStyle: { fontFamily: Fonts.dmSemiBold, fontSize: 15, marginLeft: 15, flex: 1 },
  virtualCardBottom: { flex: 1, marginRight: '25%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  cardNumberContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 },
  beforLinkInstrction: { fontFamily: Fonts.dmSemiBold, fontSize: 15, textAlign: 'center' },
  dotContainer: {
    width: '100%',
    paddingHorizontal: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  renderHistoryMainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginTop: 10
  },
  renderHistoryImageContainer: {
    width: '12%',
  },
  renderHistoryImage: { height: 40, width: 40, resizeMode: 'contain' },
  priceAndDateContainer: {
    width: '25%',
    alignItems: 'flex-end',
  },
  centerContainer: {
    width: '60%',
  },
  infoCardRowView: { flexDirection: 'row', justifyContent: 'space-between' },
  currencyStyle: {
    width: '60%',
    textAlign: 'right',
    color: ThemeManager.colors.settingsText,
  },
  feeStyle: {
    width: '50%',
    textAlign: 'right',
    color: ThemeManager.colors.settingsText,
  },
  feeHeading: { width: '50%', color: ThemeManager.colors.lightText },
  customStatusStyle: { top: -30 },
  customStatusTitle: { marginTop: -30, fontSize: 18 },
  customStatusText: { marginTop: 10, marginHorizontal: 40 },
  rejectedView: { marginVertical: 60, flex: 1 },
  reApplyButton: { marginTop: 10, marginBottom: 0, },
  linkCardButton: { marginTop: 10, marginBottom: 17 },
  activateCardButton: { marginTop: 10, marginBottom: 17 },
  switchRenderVIEW: { paddingHorizontal: 20 },
  depositView: { flexDirection: 'row', justifyContent: 'space-between' },
  customInputStyle: { marginTop: 10 },
  depositButtonContainer: { marginTop: 20 },
  historyContainer: { flex: 1 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  historyText: {
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,
    color: ThemeManager.colors.whiteText,
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,
    color: ThemeManager.colors.whiteText,
  },
  mainView: { flexGrow: 1, backgroundColor: 'white' },
  beforeLinkContainer: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', },
  cardDetailTop: { paddingHorizontal: 15, alignItems: 'flex-start', flex: 0.8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30 },
  cardMainContainer: { flex: 0.8 },
  flex1: {
    flex: 1
  },
  virtualCardFront: { flex: 0.5, padding: 15 },
  eyeImage: { height: 20, width: 20, marginLeft: 10 },
  backTextContainer: { flex: 2, paddingHorizontal: 10 },
  backCard: { position: 'absolute', height: '100%', width: '100%', zIndex: 10, borderRadius: 30, }

});
