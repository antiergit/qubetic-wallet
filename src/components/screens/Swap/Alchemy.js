import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import WebView from 'react-native-webview';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Header, LoaderView } from '../../common';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { useDispatch } from 'react-redux';
import { initiateTx, orderInitAlchemy } from '../../../Redux/Actions';
import { LanguageManager } from '../../../../LanguageManager';

const Alchemy = props => {
  const { alertMessages, alchemy } = LanguageManager;
  const dispatch = useDispatch();
  let requestSend = false;
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertTxt, setAlertTxt] = useState('');
  const email = Singleton.getInstance().defaultEmail;
  const merchant_transaction_id = Math.random().toString(36).substr(2) + Date.now().toString(36);

  console.log('alchemyObj:::::', props.alchemyObj);

  /******************************************************************************************/
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    });
    return () => { };
  }, []);

  /******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log('Backhandler Alchemy');
    Actions.pop('');
    return true;
  };

  /******************************************************************************************/
  const saveOrderId = url => {
    const alchemyData = props.alchemyObj;
    const Item = alchemyData?.selectedCoin;
    const type = alchemyData?.typeOfSwap;
    const address = alchemyData?.address;
    const amountReceived = alchemyData?.amountReceived;
    const amountEntered = alchemyData?.amountEntered;
    const fiat = alchemyData?.fiat_type;

    if (url.includes('orderStatus=SUCCESS')) {
      const tempArr = url.split('&');
      let orderId = tempArr.find(res => res.includes('orderNo='));
      orderId = orderId.split('=')[1];
      let amount1 = tempArr.find(res => res.includes('orderAmount='));
      amount1 = amount1.split('=')[1];
      let alchemyOrderId = tempArr.find(res => res.includes('customParam='));
      alchemyOrderId = alchemyOrderId.split('=')[1];
      if (orderId != '' && !requestSend) {
        requestSend = true;
        setIsLoading(true);
        const data = {
          ramp_type: 'ALCHEMY',
          coin_id: Item?.coin_id,
          coin_family: Item?.coin_family,
          amount: type == 'buy' ? Number(amountReceived) : Number(amountEntered),
          tx_type: type?.toUpperCase(),
          wallet_address: address,
          fiat_price: type == 'sell' ? amountReceived : amountEntered,
          fiat_type: fiat,
          order_id: orderId,
          merchant_id: merchant_transaction_id,
          alchemy_order_id: alchemyOrderId,
        };
        dispatch(initiateTx({ data })).then(res => {
          console.log('res------', res);
          setAlertTxt(alertMessages.thisTransactionIsCurrentlyBeingProcessed);
          setShowAlertDialog(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }).catch(err => {
          console.log('err------', err);
          setAlertTxt(alertMessages.transactionFailed);
          setShowAlertDialog(true);
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
      }
    }
  };

  /******************************************************************************************/
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        BackButtonText={alchemy.alchemy}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={['http://*', 'https://*', 'intent://*']}
          javaScriptEnabled={true}
          useWebkit
          incognito={true}
          cacheEnabled={false}
          testID={'browser-webview'}
          scalesPageToFit={true}
          source={{ uri: props.screen == 'wallet' ? `${Constants.ALCHEMY_PAY_MAINNET_URL}?appId=${Constants.APP_ID_MAINNET}&showTable=buy&showTable=sell&email=${email}&merchantOrderNo=${merchant_transaction_id}` : props.alchemyObj.url }}
          onError={err => {
            console.log('onError ---------', err);
          }}
          onHttpError={er => {
            console.log('onHttpError ---------', er);
          }}
          renderError={er => {
            console.log('renderError ---------', er);
          }}
          onMessage={msg => {
            console.log('Message ____________', msg.nativeEvent);
          }}
          onNavigationStateChange={navState => {
            console.log('NavigationState ---------', navState);
            saveOrderId(navState?.url);
          }}
        />
      </View>

      {showAlertDialog && (
        <AppAlert
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
export default Alchemy;
