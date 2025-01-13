import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Button, Header, LoaderView } from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import styles from './CheckoutNewStyle';
import { CommaSeprator1, toFixedExp } from '../../../Utils/MethodsUtils';
import getSymbolFromCurrency from 'currency-symbol-map';
import * as Constants from '../../../Constants';
import { useDispatch } from 'react-redux';
import { getSign } from '../../../Redux/Actions';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../../Singleton';
import { ALCHEMY_WEBHOOK } from '../../../EndPoint';
import { LanguageManager } from '../../../../LanguageManager';

const CheckoutNew = props => {
  const { checkOut, alchemy } = LanguageManager;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [alertModal, setAlertModal] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState(
    getSymbolFromCurrency(props.conversionRes?.fiat || 'USD'),
  );

  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      console.log('conversionRes:::::', props.conversionRes);
    });
  }, []);

  /* *********************************************************** getValue ********************************************************************** */
  const getValue = bal => {
    if (bal > 0) {
      const NewBal = bal < 0.000001 ? toFixedExp(bal, 8) : bal < 0.0001 ? toFixedExp(bal, 6) : toFixedExp(bal, 4);
      return NewBal;
    } else return bal == null ? props.amountEntered : '0.0000';
  };

  /* *********************************************************** onPressConfirmSwap ********************************************************************** */
  const onPressConfirmSwap = () => {
    getSignature();
  };

  /* *********************************************************** getSignature ********************************************************************** */
  const getSignature = () => {
    const type = props.typeOfSwap;
    const merchant_transaction_id =
      Math.random().toString(36).substr(2) + Date.now().toString(36);
    const address = props.selectedCoin?.coin_family == 6 || props.selectedCoin?.coin_family == 3 ? props.selectedCoin?.wallet_address : props.selectedCoin?.wallet_address?.toLowerCase();
    const alchemy_network = props.selectedCoin?.coin_family == 1 ? 'BSC' : props.selectedCoin?.coin_family == 3 ? 'BTC' : props.selectedCoin?.coin_family == 2 ? 'ETH' : props.selectedCoin?.coin_family == 6 ? 'TRX' : 'MATIC';
    setLoading(true);
    setTimeout(() => {
      const appId = Constants.network == 'testnet' ? Constants.APP_ID_TESTNET : Constants.APP_ID_MAINNET;
      const secretKey = Constants.network == 'testnet' ? Constants.ALCHEMY_SECRET_KEY_TESTNET : Constants.ALCHEMY_SECRET_KEY_MAINNET;
      const plain_text = type == 'buy' ? `address=${address}&appId=${appId}` : `appId=${appId}&cryptoAmount=${props.amountEntered}&fiat=${props.conversionRes?.fiat}&urlType=app`;
      const data = {
        plainText: plain_text,
        secretKeyData: secretKey,
      };
      dispatch(getSign({ data })).then(res => {
        setLoading(false);
        const Buy_URL = `${Constants.ALCHEMY_PAY_MAINNET_URL
          }?crypto=${props.selectedCoin?.coin_symbol.toUpperCase()}&network=${alchemy_network}&country=${props.selectedCurr?.country_code
          }&fiatAmount=${props.amountEntered}&fiat=${props.selectedCurr?.fiat_currency
          }&appId=${Constants.APP_ID_MAINNET
          }&address=${address}&sign=${res}&showTable=${type}&merchantOrderNo=${merchant_transaction_id}&redirectURL=${Constants.REDIRECT_URL
          }&callbackUrl=${ALCHEMY_WEBHOOK}&email=${Singleton.getInstance().defaultEmail
          }`;
        // console.log(type, 'signedUserData ----', Buy_URL);
        const Sell_URL = `${Constants.ALCHEMY_PAY_MAINNET_URL}?appId=${Constants.APP_ID_MAINNET
          }&crypto=${props.selectedCoin?.coin_symbol.toUpperCase()}&network=${alchemy_network}&showTable=sell&merchantOrderNo=${merchant_transaction_id}&country=${props.selectedCurr?.country_code
          }&cryptoAmount=${props.amountEntered}&fiat=${props.selectedCurr?.fiat_currency
          }&type=sell&urlType=app&sign=${res}&email=${Singleton.getInstance().defaultEmail}`;

        // console.log('signedUserData ----', Sell_URL);
        const URL = type.toLowerCase() == 'buy' ? Buy_URL : Sell_URL;
        const alchemyObj = {
          url: URL,
          fiat_type: props.conversionRes?.fiat,
          amountEntered: props.amountEntered,
          amountReceived: props.amountReceived,
          merchantTransactionId: merchant_transaction_id,
          selectedCoin: props.selectedCoin,
          typeOfSwap: type,
          address: props.selectedCoin?.wallet_address?.toLowerCase(),
        };
        Actions.currentScene != 'Alchemy' && Actions.Alchemy({ screen: 'checkout', alchemyObj: alchemyObj });
      }).catch(err => {
        setLoading(false);
        console.log('chk getSign err::::::', err);
      });
    }, 100);
  };

  /* *********************************************************** getNetworkPercent ********************************************************************** */
  const getPercent = fee => {
    const divider = props.conversionRes.cryptoQuantity == null ? parseFloat(props.conversionRes.fiatQuantity) : parseFloat(props.conversionRes.cryptoQuantity);
    const percent = fee ? (100 * fee) / divider : '0.00';
    if (percent > 0) {
      return toFixedExp(percent, 2);
    } else return '0.00';
  };

  /* *********************************************************** getTotalPercent ********************************************************************** */
  const getTotalPercent = () => {
    const network_Fee = getPercent(props.conversionRes?.networkFee);
    const ramp_Fee = getPercent(props.conversionRes?.rampFee);
    const total = toFixedExp(parseFloat(network_Fee) + parseFloat(ramp_Fee), 2);
    return total;
  };

  /* *********************************************************** getTotalPercent ********************************************************************** */
  const getTotalAmt = () => {
    const network_Fee = props.conversionRes?.networkFee ? props.conversionRes?.networkFee : '0.00';
    const ramp_Fee = props.conversionRes?.rampFee ? props.conversionRes?.rampFee : '0.00';
    const total = toFixedExp(parseFloat(network_Fee) + parseFloat(ramp_Fee), 2);
    return total;
  };

  /******************************************************************************************/
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header BackButtonText={checkOut.Checkout} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
      <ScrollView style={{ paddingHorizontal: 20 }} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1 }}>
          <View style={[styles.ViewStyle, { borderBottomColor: ThemeManager.colors.borderUnderLine }]}>
            <View style={[styles.mainBg, { backgroundColor: ThemeManager.colors.searchBg }]}>
              <View style={styles.imgBg}>
                <Image style={{ resizeMode: 'contain', height: 59, width: 59 }} source={{ uri: props.selectedCoin.coin_image }} />
              </View>
              <Text allowFontScaling={false} style={[styles.coinName, { color: ThemeManager.colors.inActiveTabText }]}>{props.selectedCoin.coin_name}</Text>
              <Text allowFontScaling={false} style={[styles.amountStyle, { color: ThemeManager.colors.Text }]}>{getValue(props.conversionRes?.cryptoQuantity)}</Text>
            </View>
            <View style={styles.viewBg}>
              <Text allowFontScaling={false} style={[styles.perAmountStyle, { fontFamily: Fonts.dmBold, color: ThemeManager.colors.Text }]}>{currencySymbol}{CommaSeprator1(props.conversionRes?.cryptoPrice, 2)} {checkOut.per}{' '}{props.selectedCoin.coin_symbol?.toUpperCase()}</Text>
            </View>
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightText }]}>{checkOut.quantityYouReceiveMayDeviate}</Text>
          </View>
          {/* ******************************************************************************************/}
          <View style={styles.innerView1}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: 32, width: 32, resizeMode: 'contain' }} source={Images.alchemy} />
              <Text allowFontScaling={false} style={{ ...styles.perAmountStyle, height: 24, marginLeft: 5, color: ThemeManager.colors.settingsText }}>{alchemy.alchemy}</Text>
            </View>
            <Text allowFontScaling={false} style={{ ...styles.textStyleNew, color: ThemeManager.colors.lightText }}>{checkOut.paymentGateway}</Text>
          </View>
          {/* ******************************************************************************************/}
          <View style={[styles.lowerBg, { backgroundColor: ThemeManager.colors.searchBg, borderRadius: 30 }]}>
            <View style={styles.innerView}>
              <Text allowFontScaling={false} style={[styles.perAmountStyle, { color: ThemeManager.colors.lightText }]}>{checkOut.networkFee}</Text>
              <Text allowFontScaling={false} style={[styles.perAmountStyleNew, { color: ThemeManager.colors.lightText }]}>{currencySymbol}{props.conversionRes?.networkFee ? props.conversionRes?.networkFee : '0.00'}{` (${getPercent(props.conversionRes?.networkFee)}%)`}</Text>
            </View>
            <View style={[styles.innerView, { paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: ThemeManager.colors.borderUnderLine }]}>
              <Text allowFontScaling={false} style={[styles.perAmountStyle, { color: ThemeManager.colors.lightText }]}>{checkOut.platformFee}</Text>
              <Text allowFontScaling={false} style={[styles.perAmountStyleNew, { color: ThemeManager.colors.lightText }]}>{currencySymbol}{props.conversionRes?.rampFee ? props.conversionRes?.rampFee : '0.00'}{` (${getPercent(props.conversionRes?.rampFee)}%)`}</Text>
            </View>
            <View style={styles.innerView}>
              <Text allowFontScaling={false} style={[styles.perAmountStyle, { color: ThemeManager.colors.lightText }]}>{checkOut.totalAmount}</Text>
              <Text allowFontScaling={false} style={[styles.perAmountStyleNew, { color: ThemeManager.colors.lightText }]}>{currencySymbol}{getTotalAmt()}{` (${getTotalPercent()}%)`}</Text>
            </View>
          </View>
          {/* ******************************************************************************************/}
        </View>
        <View style={{ justifyContent: 'flex-end', minHeight: Dimensions.get('screen').height / 3.4 }}>
          <Text allowFontScaling={false} style={[styles.textStyle, { marginBottom: 28, color: ThemeManager.colors.lightText, marginHorizontal: 3 }]}>{checkOut.paymentGatewayToCompleteThePurchase}</Text>
          <Button
            buttontext={checkOut.confirmPurchase}
            onPress={() => onPressConfirmSwap()}
          />
        </View>
        {/* ******************************************************************************************/}

      </ScrollView>
      {alertModal && (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => { setAlertModal(false) }}
        />
      )}
      <LoaderView isLoading={isLoading} />
    </View>
  );
};
export default CheckoutNew;
