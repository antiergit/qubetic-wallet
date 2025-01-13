/* eslint-disable react-native/no-inline-styles */
import { BigNumber } from 'bignumber.js';
import React from 'react';
import { useState } from 'react';
import { ThemeManager } from '../../../ThemeManager';
import { Button, RadioButton } from '.';
import { Colors, Fonts, Images } from '../../theme';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { exponentialToDecimalWithoutComma } from '../../Utils/MethodsUtils';
import { LanguageManager } from '../../../LanguageManager';

var gweiDivider = 1000000000;
var weiDivider = 1000000000000000000;


const AppAlertDialog = ({
  hideAlertDialog,
  alertTxt,
  confirmAlertDialog,
  showDetailView,
  currencyName,
  selectedFee,
  slowFee,
  averageFee,
  fastFee,
  gasPriceInHex,
  setSelectedFeeType,
  coin_family,
  isLoading,
  themeSelected,
}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const { commonText } = LanguageManager;

  /******************************************************************************************/
  function convertHexToDec(hexString, divider) {
    // console.log('hexString========', hexString, divider);
    hexString = hexString == undefined ? '0x0' : hexString;
    if (divider) {
      let bignumber = (new BigNumber(hexString, 16) / divider).toString();
      console.log(bignumber);
      return bignumber;
    } else {
      let bignumber = new BigNumber(hexString, 16).toString();
      console.log(bignumber);
      return bignumber;
    }
  }

  /******************************************************************************************/
  return (
    <View style={styles.centeredView}>
      <View style={[styles.modalView, { width: showDetailView ? '100%' : '90%', backgroundColor: ThemeManager.colors.mainBgNew, borderWidth: 0.5, borderColor: ThemeManager.colors.advanceModeDialogBorder, padding: showDetailView ? 8 : 20 }]}>

        <View style={{ alignItems: 'center' }}>
          {!showDetailView && (<Image style={{ height: 22, width: 22, marginBottom: 10 }} source={Images.tryAgain} />)}
          <Text allowFontScaling={false} style={[styles.modalTitle, { color: ThemeManager.colors.blackWhiteText }]}>{alertTxt}</Text>
        </View>

        {showDetailView && (
          <View style={{ alignItems: 'flex-start', marginBottom: showDetailView ? 10 : 0 }}>
            <Text allowFontScaling={false} style={[styles.modalTitle2, { color: ThemeManager.colors.whiteText }]}>{commonText.from} : {showDetailView.from}</Text>
            <Text allowFontScaling={false} style={[styles.modalTitle2, { color: ThemeManager.colors.whiteText }]}>{commonText.to} : {showDetailView.to}</Text>
            <Text allowFontScaling={false} style={styles.modalTitle2}>{commonText.GasPrice} :{' '}{convertHexToDec(gasPriceInHex, gweiDivider)}</Text>
            <Text allowFontScaling={false} style={[styles.modalTitle2, { color: ThemeManager.colors.whiteText }]}>{commonText.GasLimit} : {convertHexToDec(showDetailView.gas)}</Text>
            <Text allowFontScaling={false} style={[styles.modalTitle2, { color: ThemeManager.colors.whiteText }]}>{commonText.Nonce} : {convertHexToDec(showDetailView.nonce)}</Text>
            <Text allowFontScaling={false} style={[styles.modalTitle2, { color: ThemeManager.colors.whiteText }]}>{commonText.Value} :{' '}{exponentialToDecimalWithoutComma(convertHexToDec(showDetailView?.value || 0, weiDivider),)}{' '}{coin_family == 2 ? 'ETH' : 'BNB'} ({currencyName})</Text>

            <View style={styles.ViewStyle}>
              <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.whiteText }]}>{commonText.TransactionFee}</Text>
              <View style={styles.ViewStyle1}>
                <View style={{ alignItems: 'flex-start', paddingHorizontal: 5 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <RadioButton
                      value="Slow"
                      color="#d01961"
                      status={selectedFee == 0 ? 'checked' : 'unchecked'}
                      onPress={() => { setSelectedFeeType(0) }}
                    />
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 11 }}>{commonText.Slow}</Text>
                  </View>

                  <View style={{ marginLeft: 5 }}>
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 11 }}>({slowFee} {coin_family == 2 ? 'ETH' : 'BNB'})</Text>
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 11 }}>{currencyName}</Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <RadioButton
                      value="Average"
                      status={selectedFee == 1 ? 'checked' : 'unchecked'}
                      color="#738deb"
                      onPress={() => { setSelectedFeeType(1) }}
                    />
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 12 }}>{commonText.Average}</Text>
                  </View>

                  <View style={{ marginLeft: 5 }}>
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 12 }}>({averageFee} {coin_family == 2 ? 'ETH' : 'BNB'})</Text>
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 12 }}>{currencyName}</Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', marginBottom: 0 }}>
                    <RadioButton
                      value="Fast"
                      color="#738deb"
                      status={selectedFee == 2 ? 'checked' : 'unchecked'}
                      onPress={() => { setSelectedFeeType(2) }}
                    />
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 12 }}>{commonText.Fast}</Text>
                  </View>

                  <View style={{ marginLeft: 5 }}>
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 12 }}>({fastFee} {coin_family == 2 ? 'ETH' : 'BNB'})</Text>
                    <Text allowFontScaling={false} style={{ color: ThemeManager.colors.whiteText, fontSize: 12 }}>{currencyName}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.ViewStyle2} />
            </View>
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator
            style={{ marginBottom: 15 }}
            animating={true}
            size={'large'}
            color={ThemeManager.colors.bgQr}
          />
        ) : (
          <View>
            {/* <TouchableOpacity onPress={() => { hideAlertDialog() }} style={[styles.sendBtnStyle, { backgroundColor: ThemeManager.colors.primaryColor }]}>
              <Text allowFontScaling={false} style={[styles.sendBtnTextStyle, { color: 'white' }]}>{commonText.CANCEL}</Text>
            </TouchableOpacity> */}

            <Button
              buttontext={commonText.CANCEL}
              onPress={() => {
                hideAlertDialog()
              }}
            />

            <TouchableOpacity onPress={() => { confirmAlertDialog() }} style={{ alignSelf: 'center', marginVertical: 20 }}>
              <Text allowFontScaling={false} style={{ color: ThemeManager.colors.blackWhiteText, fontWeight: 'bold' }}>{LanguageManager.addressBook.yes}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View >
  );
};
export { AppAlertDialog };

/******************************************************************************************/
export const styles = {
  sendBtnStyle: {
    marginTop: 10,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sendBtnTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    textAlign: 'center',
  },
  ViewStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  ViewStyle1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
  },
  ViewStyle: {
    width: '100%',
    justifyContent: 'space-between',
    borderColor: 'grey',
    borderWidth: 0,
    marginTop: 20,
  },
  textStyle: {
    paddingHorizontal: 40,
    paddingVertical: 7,
    alignSelf: 'center',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    zIndex: 2,
  },
  modalView: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    paddingBottom: 0,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: ThemeManager.colors.whiteText,
    marginBottom: 15,
  },
  modalTitle2: {
    textAlign: 'center',
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
    marginBottom: 15,
  },
};
