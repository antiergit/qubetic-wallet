
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { bottomNotchWidth, getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils';
import { Fonts } from '../../../theme';



export default StyleSheet.create({
  mainView: {
    flex: 1,


  },
  mainViewStyle: {
    flex: 1,
    paddingHorizontal: dimen(24)
  },
  headerTextStyle: {
    color: 'red',
  },
  txtheading: {
    marginTop: dimen(20),
    fontSize: 16,
    fontFamily: Fonts.dmBold,
    marginBottom: 10
  },
  itemText: {

    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  itemView: {
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mainBtnView: {
    paddingHorizontal: dimen(24)
  }

});