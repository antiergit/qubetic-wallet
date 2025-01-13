import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  ViewStyle2: {
    bottom: heightDimen(210),
    position: 'absolute',
    alignSelf: 'center',
  },
  titleTextStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    paddingRight: 5,
  },
  emptyView1: {
    alignSelf: 'center',
    alignItems: "center",
    marginTop: Dimensions.get('screen').height / 3,
  },
  txtTitle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    marginHorizontal: 23,
    marginTop: 20,
  },
  ViewNew: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  customStyle: {
    alignSelf: 'center',
    bottom: 50,
  },
  ImgStyle2: {
    height: heightDimen(33),
    width: widthDimen(33),
    borderRadius: dimen(14),
    resizeMode: 'contain',
  },
  binStyle: {
    alignItems: 'flex-end',
    // marginBottom: 6,
    paddingLeft: dimen(10),
    paddingRight: dimen(20),
    // paddingVertical: 10,
  },
  binStyle1: {
    alignItems: 'flex-end',
    marginBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    paddingVertical: 10,
  },
  emptyView: {
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 3.5,
  },
  txtTitle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    marginHorizontal: 23,
    marginTop: 20,
  },
  textStyle2: {
    textAlign: 'center',
    marginLeft: 3,
    fontSize: dimen(18),
    fontFamily: Fonts.dmSemiBold,
  },
  ViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: 12,
    marginHorizontal: dimen(15),
    borderRadius: 14,
    overflow: 'hidden',
    height: dimen(76),
  },
  ViewStyle1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: dimen(18),
    fontFamily: Fonts.dmSemiBold,
    lineHeight: dimen(23)
  },
  textStyle1: {
    fontSize: dimen(14),
    fontFamily: Fonts.dmRegular,
    lineHeight: dimen(18)
  },
  coinSymbolStyle: {
    paddingLeft: 5,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    top: 2,
  },
  ImgStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: widthDimen(15),
    marginRight: dimen(10),
    height: heightDimen(33),
    width: widthDimen(33),
    borderRadius: dimen(14),
  },
  ImgStyle1: {

    height: 8,
    width: 6,
    resizeMode: 'contain',
  },
  viewStyle2: {
    flexDirection: "row",
    // justifyContent: "center",
    // alignItems: "center",
    paddingLeft: 3,
  },
  titleTextStyleNew: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(14),
    // paddingRight: 55,
  },
});
