import { StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";

export default StyleSheet.create({
  ViewStyle3: {
    alignSelf: 'center',
    height: 250,
    width: 250,
    borderWidth: 5,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginBottom: 10
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    elevation: 1,
  },
  modalView: {
    borderRadius: 12,
    paddingVertical: 25,
    paddingHorizontal: 20,
    width: '90%',
    borderWidth: 1,
  },
  QrText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 20,
    color: '#1A202E',
    textAlign: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    marginTop: 10,
    color: '#64748B',
    marginHorizontal: 35,
    marginBottom: 20
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
  ViewStyle2: {
    borderRadius: 20,
  },
  textStyle5: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    color: '#1A202E',
    alignSelf: 'center',
  },
  textStyle2: {
    marginTop: 15,
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
    lineHeight: 24,
    color: '#64748B',
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 30
  },
  ViewStyleNew: {
    marginTop: 20,
    justifyContent: 'center',
    flex: 1,
    marginBottom: 15,
  },
  textStyle4: {
    fontSize: 36,
    fontFamily: Fonts.dmMedium,
    color: '#1A202E',
    alignSelf: 'center',
  },
  textStyle3: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    color: '#64748B',
    alignSelf: 'center',
  },
  customTxtstyle1: {
    color: '#1A202E',
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  customTxtstyle: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  textStyle1: {
    fontSize: 15,
    marginTop: 20,
    fontFamily: Fonts.dmMedium,
    color: '#1A202E',
  },
})