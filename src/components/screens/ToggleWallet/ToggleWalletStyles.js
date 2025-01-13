import { Dimensions, Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  toggleStyle: {
    height: 25,
    width: 60,
    resizeMode: 'contain',
  },
  TextStyle: {
    fontSize: 14,
    marginVertical: 2,
  },
  coinName: {
    fontSize: 16,
    height: 25,
    fontFamily: Fonts.dmMedium,
  },
  imgStyle: {
    height: heightDimen(40),
    width: widthDimen(40),
    borderRadius: dimen(40),
    // resizeMode: 'cover',
    // height: 40,
    // width: 40,
  },
  toggleimg: {
    height: heightDimen(22),
    width: widthDimen(36),
    resizeMode: "contain"
  },
  imgView: {
    height: 40,
    width: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginLeft: dimen(15),
    marginRight: dimen(10),

    paddingRight: 5,
    justifyContent: 'center',
    // paddingVertical: 5,
  },
  ViewStyle1: {
    justifyContent: 'center',
    borderRadius: 10,
    flex: 1,
  },
  ViewStyle2: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginHorizontal: 20,
    padding: Platform.OS == 'ios' ? 20 : 0,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ViewStyle3: {
    bottom: heightDimen(210),
    position: 'absolute',
    alignSelf: 'center',
  },
  ViewStyle3: {
    height: 0,
    opacity: 0.3,
    width: '95%',
    marginHorizontal: 10,
  },
  ViewStyle4: {
    alignItems: 'flex-start',
    // flex: 1.5,
    marginRight: dimen(10),
    // marginLeft: 5,
  },
  textStyle: {
    fontSize: 15,
    fontFamily: Fonts.dmMedium,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 3.2,
  },
  viewStyle2: {
    flexDirection: "row",
    justifyContent: "center",
    // alignItems: "center",
    paddingLeft: 3,
  },
  titleTextStyleNew: {
    fontFamily: Fonts.dmRegular,
    fontSize: dimen(14),
    // paddingRight: 55,
  },
});
