import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { dimen, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
  imgSecond: {
    height: heightDimen(30),
    width: widthDimen(30)
  },
  imgNew: {
    height: heightDimen(33),
    width: widthDimen(33),
  },
  container: {
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: ThemeManager.colors.mnemonicsBg,
    borderRadius: 14,

    padding: 10,
    // alignItems: 'center',
  },
  image: {
    width: widthDimen(181),
    height: heightDimen(170),
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
    resizeMode: "contain"
  },
  title: {
    fontSize: 14,
    marginTop: 5,
  },
  nftId: {
    fontSize: 14,

  },
  price: {
    fontSize: 14,
    marginLeft: 6

  },
  nftIcon: {
    width: widthDimen(8),
    height: heightDimen(13),
  },
  transactionHistoryTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium
  }
});
