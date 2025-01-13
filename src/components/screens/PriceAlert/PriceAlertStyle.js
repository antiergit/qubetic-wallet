import { StyleSheet, Dimensions, Platform } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Images, Colors, Fonts } from '../../../theme';

export default StyleSheet.create({
  ViewStyle1: {
    height: Dimensions.get('screen').height / 1.4,
    justifyContent: 'center',
  },
  imgStyle1: {
    height: 8,
    width: 6,
    resizeMode: 'contain',
    marginBottom: Platform.OS == 'android' ? 3 : 0,
  },
  viewStyle2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  ViewStyle: {
    flexDirection: 'column',
    paddingLeft: 10,
    flex: 1,
  },
  imgStyle: {
    height: 33,
    width: 33,
    alignSelf: 'center',
    borderRadius: 30,
  },
  imgViewStyle: {
    height: 33,
    alignSelf: 'center',
    width: 33,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTitle: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.whiteText,
  },
  txtSmall: {
    fontSize: 12,
    fontFamily: Fonts.dmRegular,
    color: ThemeManager.colors.whiteText,
  },
  txtValue: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: Fonts.dmSemiBold,
    color: ThemeManager.colors.whiteText,
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 18,
    color: Colors.White,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 2.5,
  },
  trashBox: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewClose: {
    height: 105,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  txtClose: {
    color: ThemeManager.colors.whiteText,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    padding: 4,
  },
  viewmain: {
    backgroundColor: ThemeManager.colors.lightBlack,
    paddingTop: 40,
    paddingBottom: 15,
    flexDirection: 'row',
    paddingHorizontal: 23,
    justifyContent: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    // width: 50,
    backgroundColor: ThemeManager.colors.Mainbg,
    // height: 45,

    alignSelf: 'flex-end',
  },
  // rowBack: {
  //   alignItems: "center",
  //   flex: 1,
  //   justifyContent: "center",
  // },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    right: 0,
  },
  trash: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
  },
  actionButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  closeBtn: {
    backgroundColor: 'blue',
    right: 75,
  },
  deleteBtn: {
    backgroundColor: 'yellow',
    // right: 5,
    height: 30,
    width: 150,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'lightcoral',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    justifyContent: 'center',
    height: 50,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  list: {
    color: '#FFF',
  },
  btnText: {
    color: '#FFF',
  },
});
