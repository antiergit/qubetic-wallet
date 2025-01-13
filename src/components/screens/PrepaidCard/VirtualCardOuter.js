import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  BackHandler,
} from 'react-native';
import {
  checkCardStatus,
  getCardDetail,
  getCardHistory
} from '../../../Redux/Actions';
import {
  decodeData,
  getTransactionStatus,
  getTransactionType,
} from '../../../Utils';
import { AppAlert, Button, InputCustom } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './PrepaidCardStyle';
import { Fonts, Images } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import Slider from './Slider';
import BottomDots from './BottomDots';;
import { connect, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { exponentialToDecimal, toFixedExp } from '../../../Utils/MethodsUtils';
import { LanguageManager } from '../../../../LanguageManager';

const VirtualCardOuter = props => {
  const { merchantCard, walletMain, alertMessages } = LanguageManager;
  const dispatch = useDispatch();
  const { setLoading } = props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [virtualCardStatus, setVirtualCardStatus] = useState('inactive');
  const [userData, setUserData] = useState({ currency: currency });
  const [coinData, setCoinData] = useState('');
  const [cardStatusError, setCardStatusError] = useState('...');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('');
  const [depositHistory, setDepositHistory] = useState([]);
  const [currency, setCurrency] = useState(merchantCard.USD);
  const [fees, setFees] = useState('');
  const [deposit_markup, setDepositMarkup] = useState('0');
  const [cardDetails, setCardDetails] = useState({
    balance: 0,
    card_number: '****************',
    card_type: 'Virtual',
    cvv: '***',
    expire: '****',
    first_name: '',
    last_name: '',
  });
  const pager_ref = useRef(null);

  /******************************************************************************************/
  const cardFeatureData = [
    {
      key: '1',
      image: Images.polygonBlack,
      text1: merchantCard.easyAndQuickApplicationProcess,
    },
    {
      key: '2',
      image: Images.polygonBlack,
      text1: merchantCard.uniquewalletAddressesTohaveSecuredPayments,
    },
    {
      key: '3',
      image: Images.polygonBlack,
      text1: merchantCard.instantActivationforVirtualCards,
    },
    {
      key: '4',
      image: Images.polygonBlack,
      text1: merchantCard.earnrewardsbymakingreferrals,
    },
  ];

  /******************************************************************************************/
  const getCurrencySymbol = type => {
    console.log('type:::::', type);
    let symbol;
    if (type.toLowerCase() == 'usd') {
      symbol = '$';
    } else {
      symbol = '€';
    }
    return symbol;
  };

  /******************************************************************************************/
  const checkStatus = () => {
    let data = {
      coin_family: 6,
      fiat_type: 'usd',
    };
    setLoading(true);
    props.checkCardStatus(data).then(res => {
      console.log('chk feeee status::::::', res.data);
      setFees(res.data?.fees_data);
      setDepositMarkup(res?.data?.deposit_markup_fee || '0');
      if (res.data.user_data.currency) {
        setCurrency(res.data.user_data.currency);
      }
      console.log('res::::', JSON.stringify(res.data));
      setCardStatusError(false);
      setVirtualCardStatus(res.data.user_data.card_status.toLowerCase());
      setUserData(res.data.user_data);
      setCoinData({
        ...res.data.coin_data.coin,
        balance: res.data.coin_data.balance,
        coin_id: res.data.coin_data.coin_id,
      });
      if (res.data.user_data.card_status.toLowerCase() == 'issued') {
        Promise.all([
          new Promise((resolve, reject) => {
            dispatch(getCardDetail()).then(async resCardDetail => {
              let data = resCardDetail?.data;
              console.log('res::::::', resCardDetail);
              decodeData(data).then(response => {
                console.log('response getCardDetail:::::', response);
                setCardDetails({
                  balance: response?.balance_details?.available_balance || '0.00',
                  card_number: response?.card_details?.card_number || '0000000000000000',
                  card_type: 'Virtual',
                  cvv: response?.card_details?.cvv || '',
                  expire: response?.card_details?.expire || '',
                  first_name: response?.name?.first_name || '',
                  last_name: response?.name?.last_name || '',
                });
                resolve(response);
              }).catch(err => {
                reject(err);
              });
            }).catch(err => {
              reject();
              console.log('err::::::', err);
            });
          }),
          new Promise((resolve, reject) => {
            dispatch(getCardHistory({
              end_time: moment(new Date()).format('MMYYYY'),
              start_time: moment(new Date()).subtract(5, 'months').format('MMYYYY'),
            })).then(resCardHistory => {
              console.log('res::::::resCardHistory', JSON.stringify(resCardHistory));
              let lengthArray = resCardHistory?.data?.length > 5 ? 5 : resCardHistory?.data?.length;
              let slicedArray = resCardHistory.data?.slice(0, lengthArray);
              setDepositHistory(slicedArray);
              resolve();
            }).catch(err => {
              reject();
              console.log('err::::::', err);
            });
          })
        ]).then(res => {
          setLoading(false);
        }).catch(err => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(err => {
      setLoading(false);
      setAlertTxt(err || alertMessages.somethingWentWrong);
      setShowAlertDialog(true);
      setCardStatusError(true);
      console.log('err::::', err);
    });
  };

  /******************************************************************************************/
  useEffect(() => {
    checkStatus();
    props.navigation.addListener('didFocus', () => {
      checkCardStatus();
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    })
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, []);

  /******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log('Backhandler uspref Card::::::');
    Actions.jump('PrepaidCard');
    return true;
  };

  /******************************************************************************************/
  const renderCardFeatureItem = (item, index) => {
    return (
      <View style={styles.cardFeatureView} key={index + 'key2'}>
        <FastImage style={styles.imageDesign} source={item.image}></FastImage>
        <Text style={styles.textStyle}>{item.text1}</Text>
      </View>
    );
  };

  /******************************************************************************************/
  const renderItemHistory = (item, index) => {
    return (
      <View style={styles.renderHistoryMainView} key={index + 'key1'}>
        <View style={styles.renderHistoryImageContainer}>
          <FastImage
            style={styles.renderHistoryImage}
            source={parseFloat(item?.credit) > 0 ? Images.receive_bg : Images.send_bg}
          />
        </View>

        <View style={styles.centerContainer}>
          <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize' }]}>{getTransactionType(item?.type)}<Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize', fontSize: 14 }]}>{item.description != '' ? `(${item.description.length > 13 ? item.description.slice(0, 13) + '...' : item.description})` : ''}</Text></Text>
          <Text allowFontScaling={false} style={[styles.fromStatusStyle, { color: ThemeManager.colors.lightText, textTransform: 'capitalize' }]}>{merchantCard.transaction} {getTransactionStatus(item?.status)}</Text>
        </View>

        <View style={styles.priceAndDateContainer}>
          <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText }]}>{toFixedExp(parseFloat(toFixedExp(exponentialToDecimal(item?.credit), 8)) > 0 ? parseFloat(toFixedExp(exponentialToDecimal(item?.credit), 8)) : parseFloat(toFixedExp(exponentialToDecimal(item.debit), 8)), 8)}{' '}{currency.toUpperCase()}</Text>
          <Text allowFontScaling={false} style={[styles.fromStatusStyle, { color: ThemeManager.colors.lightText }]}>{moment.unix(item.transaction_date).format('MMM DD, YYYY')}</Text>
        </View>
      </View>
    );
  };

  /******************************************************************************************/
  const card = () => {
    return (
      <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.settingBg }]}>
        <View style={styles.infoCardRowView}>
          <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.lightText }]}>{merchantCard.cardCurrency}</Text>
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.currencyStyle, { color: ThemeManager.colors.settingsText }]}>{currency?.toUpperCase()}</Text>
        </View>

        <View style={styles.infoCardRowView}>
          <Text allowFontScaling={false} style={[styles.textStyle1, styles.feeHeading, { color: ThemeManager.colors.lightText }]}>{merchantCard.approxCardIssuingfee}</Text>
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.feeStyle, { color: ThemeManager.colors.settingsText }]}>{fees} {merchantCard.USDTTRX}</Text>
        </View>

        <View style={styles.infoCardRowView}>
          <Text allowFontScaling={false} style={[styles.textStyle1, styles.feeHeading, { color: ThemeManager.colors.lightText }]}>{merchantCard.consumptionMethod}</Text>
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.feeStyle, { color: ThemeManager.colors.settingsText }]}>{merchantCard.crypto}</Text>
        </View>
        <View style={styles.infoCardRowView}>
          <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.lightText }]}>{merchantCard.depositFeeRate}</Text>
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.feeStyle, { color: ThemeManager.colors.settingsText }]}>{deposit_markup} %</Text>
        </View>
      </View>
    );
  };

  /******************************************************************************************/
  const switchRender = () => {
    switch (virtualCardStatus) {
      default: {
        return stepTwo();
        // return card();
      }
      // case 'fee pending': {
      //   return card();
      // }
      // case 'applied': {
      //   return (
      //     <CustomStatus
      //       animation={Images.successAnim}
      //       titleText={merchantCard.applicationSubmitted}
      //       text={merchantCard.awaitingpaymentconfirmation}
      //       style={styles.customStatusStyle}
      //       titleStyle={styles.customStatusTitle}
      //       textStyle={styles.customStatusText}
      //     />
      //   );
      // }
      // case 'issued': {
      //   return stepTwo();
      // }
    }
  };

  /******************************************************************************************/
  const stepOne = () => {
    return (
      <View>
        <View style={styles.switchRenderVIEW}>{switchRender()}</View>
        {virtualCardStatus != 'issued' && (
          <>
            <Text allowFontScaling={false} style={[styles.cardFeatureText, { color: ThemeManager.colors.settingsText, borderBottomColor: ThemeManager.colors.underLineColor }]}>{merchantCard.cardFeatures}</Text>
            {cardFeatureData?.map((item, index) => { return renderCardFeatureItem(item, index) })}
          </>
        )}
      </View>
    );
  };

  /******************************************************************************************/
  const stepTwo = () => {
    return (
      <View>
        <View style={styles.depositView}>
          <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText, marginBottom: 10 }]}>{merchantCard.cardBalance}</Text>
        </View>
        <InputCustom
          customInputStyle={styles.customInputStyle}
          keyboardType={'decimal-pad'}
          maxLength={10}
          placeholderTextColor={ThemeManager.colors.whiteText}
          value={getCurrencySymbol(currency) + ' ' + cardDetails.balance?.toString()}
          editable={false}
        />
        {userData?.address && <View style={styles.depositButtonContainer}>
          <Button
            buttontext={merchantCard.deposit}
            onPress={() => { Actions.DepositCard({ fromUsp: false, coin: coinData, address: userData?.address, currency: currency }) }}
          />
        </View>}

        {cardDetails.balance != 0 && <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text allowFontScaling={false} style={[styles.historyText, { color: ThemeManager.colors.whiteText }]}>{merchantCard.history}</Text>
            <TouchableOpacity onPress={() => { Actions.CardTransactionHistory({ currency: currency?.toUpperCase() }) }}>
              <Text style={[styles.viewAllText, { color: ThemeManager.colors.whiteText }]}>{walletMain.viewAll}</Text>
            </TouchableOpacity>
          </View>
          {depositHistory.length > 0 ? (depositHistory?.map((item, index) => { return renderItemHistory(item, index) })) : (
            <>
              <View style={{ height: Dimensions.get('screen').height / 5.7, justifyContent: 'center' }}>
                <Text allowFontScaling={false} style={[styles.transactionHistoryTitle, { color: ThemeManager.colors.whiteText, alignSelf: 'center', fontFamily: Fonts.dmRegular }]}>{merchantCard.noTransactionHistoryFound}</Text>
              </View>
            </>
          )}
        </View>}
      </View>
    );
  };

  /******************************************************************************************/
  return (
    <View style={styles.mainView}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => { checkStatus() }} />
        }>
        {cardStatusError == true ? (
          <>
            <Text style={[{ paddingHorizontal: 20 }, styles.textStyle, { color: 'black', fontFamily: Fonts.dmMedium }]}>{merchantCard.unableToLoadCard}</Text>
          </>
        ) : (
          <View style={[styles.cardContainer, { paddingBottom: 10 }]}>
            <>
              <Slider
                props={props}
                cardStatusError={cardStatusError}
                pager_ref={pager_ref}
                setCurrentIndex={setCurrentIndex}
                virtualCardStatus={virtualCardStatus}
                activeTab={0}
                cardDetails={cardDetails}
              />
              <BottomDots currentIndex={currentIndex} pager_ref={pager_ref} />
              {/* {cardStatusError != '...' &&
                (virtualCardStatus == 'inactive' ? (
                  <Button
                    buttontext={merchantCard.apply}
                    myStyle={{marginTop: 10,marginBottom: 10,marginHorizontal: 20}}
                    onPress={() => {Singleton.getInstance().phyAndvirtualCard = false;Actions.currentScene != 'VirtualCard' &&Actions.VirtualCard({status: virtualCardStatus,coin_data: coinData,data: userData})}}
                  />
                ) : (
                  virtualCardStatus == 'fee pending' && (
                    <Button
                      buttontext={merchantCard.payFee}
                      myStyle={{marginTop: 10,marginBottom: 10,marginHorizontal: 20 }}
                      onPress={() => {Singleton.getInstance().phyAndvirtualCard = false;Actions.currentScene != 'VirtualCard' &&Actions.VirtualCard({status: virtualCardStatus,data: userData,coin_data: coinData})}}
                    />
                  )
                ))} */}
              {/* {virtualCardStatus == 'fee pending' && (<Text style={[{ paddingHorizontal: 20 },styles.textStyle,{ color: 'black', fontFamily: Fonts.dmMedium }]}>{merchantCard.itTakesTimeConfirmPayment}</Text>)} */}
            </>
          </View>
        )}
        {stepOne()}
      </ScrollView>

      {showAlertDialog && (
        <AppAlert
          showSuccess={false}
          alertTxt={alertTxt}
          hideAlertDialog={() => { setShowAlertDialog(false) }}
        />
      )}
    </View>
  );
};
export default connect(null, { checkCardStatus })(VirtualCardOuter);
