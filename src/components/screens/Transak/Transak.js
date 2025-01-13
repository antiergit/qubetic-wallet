import React, { useEffect, useState } from 'react';
import { View, Platform, BackHandler } from 'react-native';
import { Actions } from 'react-native-router-flux';
import WebView from 'react-native-webview';
import * as Constants from '../../../Constants';
import { useDispatch } from 'react-redux';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Header, LoaderView } from '../../common';
import { EventRegister } from 'react-native-event-listeners';
import { initiateTx } from '../../../Redux/Actions';
import Singleton from '../../../Singleton';
import { LanguageManager } from '../../../../LanguageManager';

const Transak = props => {
  console.log('props---', props?.url);
  const { alertMessages, walletMain, sendTrx, buySell } = LanguageManager;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorOccur, setErrorOccur] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('');
  const [canGoBack, setGoBack] = useState(false);
  const [showSuccess, setsuccess] = useState(true);

  //******************************************************************************************/
  useEffect(() => {
    console.log('chk props transak::::::', props);
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      setShowAlertDialog(false);
      setAlertTxt('');
    });
    props.navigation.addListener('didFocus', () => {
      setsuccess(true);
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    });
    return () => { };
  }, []);

  //******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log('Backhandler transak');
    Actions.pop('');
    return true;
  };

  //******************************************************************************************/
  const initialiseTxn = (cryptoAmount, fiatAmount, fiatCurrency, orderID) => {
    setIsLoading(true);
    setTimeout(() => {
      const Item = props.selectedCoin;
      const data = {
        ramp_type: 'TRANSAK',
        coin_id: Item?.coin_id,
        coin_family: Item?.coin_family,
        tx_type: props.title?.toUpperCase(),
        wallet_address: Item?.wallet_address?.toLowerCase(),
        amount: cryptoAmount,
        fiat_price: fiatAmount,
        fiat_type: fiatCurrency,
        merchant_id: props.partnerOrderId,
        alchemy_order_id: '',
        order_id: orderID,
      };
      console.log(' transak initialise data::::::::', data);
      dispatch(initiateTx({ data })).then(res => {
        console.log('res------', res);
        setAlertTxt(alertMessages.yourTransactionIsSuccessfullySubmitted);
        setsuccess(true);
        setShowAlertDialog(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }).catch(err => {
        console.log('err------', err);
        setsuccess(false);
        setAlertTxt(alertMessages.somethingWentWrong);
        setShowAlertDialog(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }, 100);
    });
  };

  //******************************************************************************************/
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        BackButtonText={buySell.transak}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <View style={{ flex: 1 }}>
        {!global.isConnected || errorOccur ? (
          <Text style={{ color: ThemeManager.colors.Mainbg, justifyContent: 'center', alignSelf: 'center' }}>{alertMessages.NoNetworkConnection}{' '}</Text>
        ) : (
          <WebView
            originWhitelist={['http://*', 'https://*', 'intent://*']}
            javaScriptEnabled={true}
            useWebkit
            incognito={true}
            cacheEnabled={false}
            testID={'browser-webview'}
            scalesPageToFit={true}
            source={{ uri: props.screen == 'wallet' ? `${Constants.TRANSAK_URL}?appId=${Constants.TRANSAK_KEY}&email=${Singleton.getInstance().defaultEmail}&networks=ethereum,polygon,tron,bsc` : props?.url }}
            onError={err => { console.log('onError ---------', err) }}
            onHttpError={er => { console.log('onHttpError ---------', er) }}
            renderError={er => {
              console.log('ERROR0-22----', er);
              if (Platform.OS == 'android' && er == undefined) {
                setIsLoading(false);
                setErrorOccur(true);
              }
              if (Platform.OS == 'ios' && er == 'NSURLErrorDomain') {
                setErrorOccur(false);
                setIsLoading(true);
              }
            }}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => {
              setIsLoading(false);
              setErrorOccur(false);
            }}
            onMessage={msg => { console.log('Message ____________', msg.nativeEvent) }}
            onNavigationStateChange={navState => {
              console.log('::::::::::Navigation:::::', navState);
              console.log('::::::::::Navigation:::::navState.url', navState.url);
              if (navState?.url.includes(`${Constants.TRANSAK_REDIRECT_URL}?partnerCustomerId`) || navState?.url.includes(`${Constants.TRANSAK_REDIRECT_URL}?orderId`)) {
                let tempUrl = navState?.url?.split('&');
                let splitedUrl_crypto = tempUrl?.find(res => res?.includes('cryptoAmount'));
                let splitedUrl_Fiat = tempUrl?.find(res => res?.includes('fiatAmount'));
                let splitedUrl_OrderId = tempUrl?.find(res => res?.includes('orderId'));
                let splitedUrl_FiatCurrency = tempUrl?.find(res => res?.includes('fiatCurrency'));
                let splitedUrl_type = tempUrl?.find(res => res?.includes('isBuyOrSell'));
                const cryptoAmount = splitedUrl_crypto?.split('=')[1];
                const fiatAmount = splitedUrl_Fiat?.split('=')[1];
                const orderID = splitedUrl_OrderId?.split('=')[1];
                const fiatCurrency = splitedUrl_FiatCurrency?.split('=')[1];
                const type = splitedUrl_type?.split('=')[1];
                initialiseTxn(cryptoAmount, fiatAmount, fiatCurrency, orderID, type);
              }
            }}
          />
        )}
      </View>
      {showAlertDialog && (
        <AppAlert
          showSuccess={showSuccess}
          alertTxt={alertTxt}
          hideAlertDialog={() => {
            setShowAlertDialog(false);
            Actions.pop();
            Actions.pop();
          }}
        />
      )}
      <LoaderView isLoading={isLoading} />
    </View>
  );
};
export default Transak;
