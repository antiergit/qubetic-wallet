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
  AppAlert,
  Button,
  InputCustom,
  LoaderView,
} from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './USPreferedCardStyles';
import { Fonts, Images } from '../../../theme';;
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { checkUSPCardStatus, getUSPCardDetail, getSupportedCoinList, getCardHistory } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { decodeData, getTransactionStatus, getTransactionType } from '../../../Utils';
import { exponentialToDecimal, toFixedExp } from '../../../Utils/MethodsUtils';
import CustomStatus from '../PrepaidCard/CustomStatus';
import Slider from '../PrepaidCard/Slider';
import BottomDots from '../PrepaidCard/BottomDots';
import { LanguageManager } from '../../../../LanguageManager';

const USPreferedCard = (props) => {
  const { merchantCard, walletMain, alertMessages, placeholderAndLabels } = LanguageManager;
  const dispatch = useDispatch()
  // const { setLoading } = props
  const [isLoading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPhysicalApplied, setshowPhysicalApplied] = useState(props.from?.toLowerCase()?.includes('physicalcard') ? true : false)
  const [usPreferedCardStatus, setUsPreferedCardStatus] = useState('inactive')
  const [userData, setUserData] = useState('')
  const [coinData, setCoinData] = useState('')
  const [cardStatusError, setCardStatusError] = useState('')
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [alertTxt, setAlertTxt] = useState('')
  const [depositHistory, setDepositHistory] = useState([])
  const [currency, setCurrency] = useState(props.usCardData?.fiat_currency || 'USD')
  const [fees, setFees] = useState("0")
  const [walletData, setWalletData] = useState('')
  const [deposit_markup, setDepositMarkup] = useState('0');
  const [supportedCoin, setSupportedCoin] = useState('');
  const [liminalAddress, setLiminalAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    "balance": 0,
    "first_name": "",
    "last_name": ""
  })
  const [kycStatus, setKycStatus] = useState(null)
  const pager_ref = useRef(null);

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
      text1: merchantCard.earnrewardsbymakingreferrals,
    },
  ];
  // console.log(props.usCardData, "userData::::::::::::::::::::", userData);

  /******************************************************************************************/
  const getCurrencySymbol = (type) => {
    console.log("type:::::", type);
    let symbol
    if (type.toLowerCase() == 'usd') {
      symbol = '$'
    } else {
      symbol = '€'
    }
    return symbol
  }

  /******************************************************************************************/
  const checkCardStatus = () => {
    const data = {
      fiat_type: props.usCardData?.fiat_currency?.toLowerCase() || 'usd',
      cardId: props.usCardData?.card_id,
    }
    setLoading(true)
    dispatch(checkUSPCardStatus(data)).then(res => {
      console.log('chk checkUSPCardStatus res::::', res);
      const card_data = res?.card_data;
      const coin_data = res?.coin_data;
      const card_user_data = card_data?.card_user_data;

      setFees(card_data?.card_issuing_fee);
      setDepositMarkup(coin_data?.markup_fee || '0');
      if (card_user_data?.currency) {
        setCurrency(card_user_data?.currency)
      }
      if (card_user_data?.card_status) {
        setUsPreferedCardStatus(card_user_data?.card_status)
      }
      setUserData(card_user_data);
      setCoinData({ ...coin_data?.coin, balance: coin_data?.coin?.wallet_data?.balance, coin_id: coin_data?.coin_id, fiat_price_data: coin_data?.coin?.card_fiat_price_data });
      setWalletData(coin_data?.coin?.wallet_data);
      setLiminalAddress(card_data?.liminal_address_data?.address);
      setCardStatusError(false);

      /******************************************************************************************/
      if (card_user_data?.card_status?.toLowerCase() == 'issued') {
        if (card_user_data?.kyc_status) {
          setKycStatus(card_user_data?.kyc_status)
        }

        Promise.all([
          new Promise((resolve, reject) => {
            const cardID = props.usCardData?.card_id
            dispatch(getUSPCardDetail(cardID)).then(async resCardDetail => {
              const data = resCardDetail?.data
              console.log("res::::::", resCardDetail);
              decodeData(data).then((response) => {
                console.log("response getUSPCardDetail:::::", response);
                setCardDetails({
                  "balance": response?.balance_details?.available_balance || '0.00',
                  "link_details": response?.card_details?.link_details || '',
                  "first_name": response?.name?.first_name || '',
                  "last_name": response?.name?.last_name || ''
                })
                resolve(response)
              }).catch(err => {
                reject(err)
              })
            }).catch(err => {
              reject()
              console.log("err::::::", err);
            })
          }),
          /******************************************************************************************/
          new Promise((resolve, reject) => {
            dispatch(getCardHistory({
              end_time: moment(new Date()).format('MMYYYY'),
              start_time: moment(new Date()).subtract(5, 'months').format('MMYYYY'),
              cardId: props.usCardData?.card_type?.toLowerCase() == 'us_preferred' ? props.usCardData?.card_id : '',
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
        ]).then((res => {
          setLoading(false)
        })).catch(err => {
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    }).catch(err => {
      setLoading(false)
      setAlertTxt(err || alertMessages.somethingWentWrong)
      setShowAlertDialog(true)
      setCardStatusError(true)
      console.log("err::::", err);
    })

  }

  /******************************************************************************************/
  useEffect(() => {
    getSupported_CoinList();
    // checkCardStatus();
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
  const getSupported_CoinList = () => {
    setTimeout(() => {
      dispatch(getSupportedCoinList({})).then(res => {
        console.log('chk getSupported_CoinList res:::::', res);
        setSupportedCoin(res ? res[0] : '')
      }).catch(err => {
        console.log('chk getSupported_CoinList err:::::', err);
      })
    }, 100);
  }

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
          <FastImage style={styles.renderHistoryImage} source={parseFloat(item?.credit) > 0 ? Images.receive_bg : Images.send_bg} />
        </View>
        <View style={styles.centerContainer}>
          <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize' }]}>
            {getTransactionType(item?.type)}<Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize', fontSize: 14 }]}>{item.description != '' ? `(${item.description.length > 13 ? item.description.slice(0, 13) + '...' : item.description})` : ''}</Text>
          </Text>
          <Text allowFontScaling={false} style={[styles.fromStatusStyle, { color: ThemeManager.colors.lightText, textTransform: 'capitalize' }]}>{merchantCard.transaction} {getTransactionStatus(item?.status)}</Text>
        </View>
        <View style={styles.priceAndDateContainer}>
          <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText }]}>
            {toFixedExp(parseFloat(toFixedExp(exponentialToDecimal(item?.credit), 8)) > 0 ? parseFloat(toFixedExp(exponentialToDecimal(item?.credit), 8)) : parseFloat(toFixedExp(exponentialToDecimal(item.debit), 8)), 8)} {currency.toUpperCase()}
          </Text>
          <Text allowFontScaling={false} style={[styles.fromStatusStyle, { color: ThemeManager.colors.lightText }]}>
            {moment.unix(item.transaction_date).format("MMM DD, YYYY")}
          </Text>
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
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.feeStyle, { color: ThemeManager.colors.settingsText }]}>{fees} {supportedCoin?.coin_symbol?.toUpperCase()}({supportedCoin?.native_coins_data?.coin_symbol?.toUpperCase()})</Text>
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
    )
  }

  /******************************************************************************************/
  const switchRender = () => {
    switch (usPreferedCardStatus) {
      default: {
        return (
          cardStatusError != '' && card()
        )
      }
      case 'Kyc_pending': {
        if (showPhysicalApplied) {
          return (
            <CustomStatus animation={Images.successAnim} titleText={merchantCard.applicationApplied} text={merchantCard.awaitingpaymentconfirmation} style={styles.customStatusStyle} titleStyle={styles.customStatusTitle} textStyle={styles.customStatusText} />
          )
        } else {
          return (
            <Button buttontext={merchantCard.submitKYC} myStyle={styles.linkCardButton} onPress={() => { Actions.currentScene != 'USPrefCardKYC' && Actions.USPrefCardKYC({ usCardData: props.usCardData }); }} />
          )
        }
      }
      case 'Kyc_in_review': {
        if (showPhysicalApplied) {
          return (
            <CustomStatus animation={Images.successAnim} titleText={merchantCard.applicationApplied} text={merchantCard.awaitingpaymentconfirmation} style={styles.customStatusStyle} titleStyle={styles.customStatusTitle} textStyle={styles.customStatusText} />
          )
        } else {
          return (
            <>
              <View style={[styles.ViewStyle22]}>
                <View style={styles.reviewContainer}>
                  <CustomStatus
                    animation={Images.review}
                    titleText={placeholderAndLabels.informationInReview}
                    text={merchantCard.kycInreviewProcessTime}
                    titleStyle={{ marginTop: -30, fontSize: 18 }}
                    textStyle={{ marginTop: 10, marginHorizontal: 40, marginBottom: 40 }}
                  />
                </View>
              </View>
            </>
          )
        }
      }
      case 'Rejected': {
        return (
          <>
            <View style={styles.rejectedView}>
              <CustomStatus isRejected animation={Images.rejectedJson} animeHeight={100} titleText={merchantCard.kycIsRejected} text={merchantCard.youCanResubmitKycverificationInformation} />
            </View>
            <Button
              buttontext={merchantCard.reApplyKYC}
              myStyle={styles.reApplyButton}
              onPress={() => {
                Singleton.getInstance().phyAndvirtualCard = true
                Actions.currentScene != 'USPrefCardKYC' && Actions.USPrefCardKYC({ usCardData: props.usCardData });
              }} />
          </>
        )
      }
      case 'Issued': {
        return (
          stepTwo()
        )
      }
    }
  }

  /******************************************************************************************/
  const stepOne = () => {
    return (
      <View>
        <View style={styles.switchRenderVIEW}>
          {switchRender()}
        </View>
        {(usPreferedCardStatus?.toLowerCase() != 'issued' && usPreferedCardStatus?.toLowerCase() != 'rejected') &&
          <>
            <Text allowFontScaling={false} style={[styles.cardFeatureText, { color: ThemeManager.colors.settingsText, borderBottomColor: ThemeManager.colors.underLineColor }]}>{merchantCard.cardFeatures}</Text>
            {cardFeatureData?.map((item, index) => {
              return (renderCardFeatureItem(item, index))
            })
            }
          </>
        }

      </View>
    );
  };

  /******************************************************************************************/
  const stepTwo = () => {
    return (
      <View >
        <View style={styles.depositView}>
          <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText, marginBottom: 10 }]}>{merchantCard.cardBalance}</Text>
        </View>
        <InputCustom
          customInputStyle={styles.customInputStyle}
          keyboardType={'decimal-pad'}
          maxLength={10}
          placeholderTextColor={ThemeManager.colors.whiteText}
          value={getCurrencySymbol(currency) + " " + cardDetails.balance?.toString()}
          editable={false}
        />
        <View style={styles.depositButtonContainer}>
          <Button buttontext={merchantCard.deposit} onPress={() => {
            Actions.DepositCard({ fromUsp: true, coin: coinData, address: liminalAddress, currency: currency, usCardData: props.usCardData })
          }} />
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text allowFontScaling={false} style={[styles.historyText, { color: ThemeManager.colors.whiteText, }]}>{merchantCard.history}</Text>
            <TouchableOpacity onPress={() => { Actions.CardTransactionHistory({ currency: currency?.toUpperCase(), usCardData: props.usCardData }) }}>
              <Text style={[styles.viewAllText, { color: ThemeManager.colors.whiteText, }]}>{walletMain.viewAll}</Text>
            </TouchableOpacity>
          </View>
          {depositHistory.length > 0 ?
            depositHistory?.map((item, index) => {
              return (renderItemHistory(item, index))
            })
            : <><View style={{ height: Dimensions.get('screen').height / 5.7, justifyContent: 'center' }}>
              <Text allowFontScaling={false} style={[styles.transactionHistoryTitle, { color: ThemeManager.colors.whiteText, alignSelf: 'center', fontFamily: Fonts.dmRegular }]}>{merchantCard.noTransactionHistoryFound}</Text>
            </View></>}
        </View>
      </View>
    );
  };

  /******************************************************************************************/
  return (
    <View style={styles.mainView}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={() => { checkCardStatus() }}
        />
      }>
        <View style={[styles.cardContainer, { paddingBottom: usPreferedCardStatus == 'inActive' ? 10 : 20 }]}>
          <>
            <Slider props={props} userData1={userData} cardStatusError={cardStatusError} pager_ref={pager_ref} setCurrentIndex={setCurrentIndex} usPreferedCardStatus={usPreferedCardStatus} activeTab={2} cardDetails={cardDetails} cardFrontImage={Images.USPreferdCardBlack} cardBackImage={Images.USPreferdCardBlackBack} />
            {/* <BottomDots currentIndex={currentIndex} pager_ref={pager_ref} usPreferedCardStatus={usPreferedCardStatus} /> */}
            {isLoading ? null :
              <>
                {cardStatusError != '...' && (userData == null ?
                  <Button
                    buttontext={merchantCard.apply}
                    myStyle={{ marginTop: 10, marginBottom: 0, marginHorizontal: 20 }}
                    onPress={() => {
                      Singleton.getInstance().phyAndvirtualCard = true;
                      Actions.currentScene != 'VirtualCard' && Actions.VirtualCard({ usCardData: props.usCardData, status: 'inactive', coin_data: walletData?.status == 1 ? coinData : null, data: userData, liminalAddress: liminalAddress })
                    }}
                  />

                  : (userData != null && userData.card_status == null) &&
                  <Button
                    buttontext={merchantCard.payFee}
                    myStyle={{ marginTop: 10, marginBottom: 10, marginHorizontal: 20 }}
                    onPress={() => {
                      Singleton.getInstance().phyAndvirtualCard = false;
                      Actions.currentScene != 'VirtualCard' && Actions.VirtualCard({ usCardData: props.usCardData, status: 'inactive', data: userData, coin_data: walletData?.status == 1 ? coinData : null, liminalAddress: liminalAddress });
                    }} />)
                }
                {userData != null && userData.card_status == null && <Text style={[{ paddingHorizontal: 20 }, styles.textStyle, { color: 'black', fontFamily: Fonts.dmMedium }]}>{merchantCard.itTakesTimeConfirmPayment}</Text>}
              </>
            }
          </>

        </View>
        {/* } */}
        {stepOne()}
      </ScrollView>
      <LoaderView isLoading={isLoading} />
      {showAlertDialog && (<AppAlert showSuccess={false} alertTxt={alertTxt} hideAlertDialog={() => { setShowAlertDialog(false) }} />)}
    </View>
  );
};
export default USPreferedCard;

