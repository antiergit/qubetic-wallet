import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import {
  decodeData,
  getTransactionStatus,
  getTransactionType,
} from '../../../Utils';
import { AppAlert, Button, InputCustom, LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './PrepaidCardStyle';
import { Fonts, Images } from '../../../theme';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import CustomStatus from './CustomStatus';
import Slider from './Slider';
import BottomDots from './BottomDots';
import { checkPhysicalCardStatus, getAllCards, getCardHistory, getPhysicalCardDetail } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { exponentialToDecimal, toFixedExp } from '../../../Utils/MethodsUtils';
import { LanguageManager } from '../../../../LanguageManager';

const PhysicalCard = props => {
  const { merchantCard, walletMain, alertMessages } = LanguageManager;
  const dispatch = useDispatch();
  const { setLoading } = props;
  // const [isLoading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [physicalCardData, setPhysicalCardData] = useState('' || props.physicalCardData);
  const [showPhysicalApplied, setshowPhysicalApplied] = useState(props.from?.toLowerCase()?.includes('physicalcard') ? true : false);
  const [physicalCardStatus, setPhysicalCardStatus] = useState('inactive');
  const [userData, setUserData] = useState(null);
  const [coinData, setCoinData] = useState('');
  const [cardStatusError, setCardStatusError] = useState('...');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('');
  const [depositHistory, setDepositHistory] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [fees, setFees] = useState('');
  const [walletData, setWalletData] = useState('');
  const [deposit_markup, setDepositMarkup] = useState('0');
  const [liminalAddress, setLiminalAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({
    balance: 0,
    card_number: '****************',
    card_type: 'Physical',
    cvv: '***',
    expire: '****',
    first_name: '',
    last_name: '',
  });
  const [kycStatus, setKycStatus] = useState(null);
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
      text1: merchantCard.DoorStepDelivery,
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
  const checkCardStatus = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(getAllCards({})).then(res => {
        console.log('chk all list cards res:::::', res);
        if (res.length > 0) {
          res.map((item, index) => {
            if (item.card_type?.toLowerCase() == 'physical') {
              setPhysicalCardData(item)
              let data = {
                fiat_type: item?.fiat_currency?.toLowerCase() || 'usd',
                cardId: item?.card_id,
              };
              dispatch(checkPhysicalCardStatus(data)).then(res => {
                console.log('chk physical card res::::::', res)
                const card_data = res?.card_data;
                const coin_data = res?.coin_data;
                const card_user_data = card_data?.card_user_data;
                setLoading(false);
                setFees(card_data?.card_issuing_fee);
                setDepositMarkup(coin_data?.markup_fee || '0');
                if (card_user_data?.currency) {
                  setCurrency(card_user_data?.currency);
                }
                if (card_user_data?.card_status) {
                  setPhysicalCardStatus(card_user_data?.card_status?.toLowerCase());
                }
                setUserData(card_user_data);
                setCoinData({ ...coin_data?.coin, balance: coin_data?.coin?.wallet_data?.balance, coin_id: coin_data?.coin_id, fiat_price_data: coin_data?.coin?.card_fiat_price_data });
                setWalletData(coin_data?.coin?.wallet_data);
                setLiminalAddress(card_data?.liminal_address_data?.address);
                setCardStatusError(false);

                /******************************************************************************************/
                if (card_user_data?.card_status?.toLowerCase() == 'issued') {
                  if (card_user_data?.kyc_status) {
                    setKycStatus(card_user_data?.kyc_status);
                  }
                }
                /******************************************************************************************/
                if (card_user_data?.card_status?.toLowerCase() == 'activated') {
                  const cardID = item?.card_id
                  Promise.all([
                    new Promise((resolve, reject) => {
                      dispatch(getPhysicalCardDetail(cardID)).then(async resCardDetail => {
                        let data = resCardDetail?.data;
                        console.log('res::::::', resCardDetail);
                        decodeData(data).then(response => {
                          console.log('response getCardDetail:::::', response);
                          setCardDetails({
                            balance: response?.balance_details?.available_balance || '0.00',
                            card_number: response?.card_details?.card_number || '0000000000000000',
                            card_type: 'Physical',
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
                    /******************************************************************************************/
                    new Promise((resolve, reject) => {
                      dispatch(getCardHistory({
                        end_time: moment(new Date()).format('MMYYYY'),
                        start_time: moment(new Date()).subtract(5, 'months').format('MMYYYY'),
                        cardId: cardID,
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
                  setLoading(false);
                }
              }).catch(err => {
                setLoading(false);
                setAlertTxt(err || alertMessages.somethingWentWrong);
                setShowAlertDialog(true);
                setCardStatusError(true);
                console.log('err::::', err);
              });
            }
          })
        } else {
          setPhysicalCardData('');
          setLoading(false);
        }
      }).catch(err => {
        setLoading(false);
      })
    }, 100);

    console.log('chk props.physicalCardData?.card_id:::::', props.physicalCardData)

  };

  /******************************************************************************************/
  useEffect(() => {
    checkCardStatus();
    props.navigation.addListener('didFocus', () => {
      checkCardStatus();
    });
  }, []);

  /******************************************************************************************/
  const renderCardFeatureItem = (item, index) => {
    return (
      <View style={styles.cardFeatureView} key={index + 'key2'}>
        <FastImage style={styles.imageDesign} tintColor={ThemeManager.colors.colorVariationBorder} source={item.image}></FastImage>
        <Text style={[styles.textStyle, { color: ThemeManager.colors.subTitle1 }]}>{item.text1}</Text>
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
            {getTransactionType(item?.type)}
            <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize', fontSize: 14 }]}>{item.description != '' ? `(${item.description.length > 13 ? item.description.slice(0, 13) + '...' : item.description})` : ''}</Text>
          </Text>
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
      <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.modalCard }]}>
        <View style={styles.infoCardRowView}>
          <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.lightText }]}>{merchantCard.cardCurrency}</Text>
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.currencyStyle, { color: ThemeManager.colors.settingsText }]}>{currency?.toUpperCase()}</Text>
        </View>

        <View style={styles.infoCardRowView}>
          <Text allowFontScaling={false} style={[styles.textStyle1, styles.feeHeading, { color: ThemeManager.colors.lightText }]}>{merchantCard.approxCardIssuingfee}</Text>
          <Text allowFontScaling={false} style={[styles.textStyle2, styles.feeStyle, { color: ThemeManager.colors.settingsText }]}>
            {fees} {merchantCard.USDTTRX}
          </Text>
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
    console.log('chk physicalCardStatus:::::', physicalCardStatus)
    switch (physicalCardStatus) {
      default: {
        return card();
      }
      case 'Applied': {
        if (showPhysicalApplied) {
          return (
            <CustomStatus
              animation={Images.successAnim}
              titleText={merchantCard.applicationApplied}
              text={merchantCard.awaitingpaymentconfirmation}
              style={styles.customStatusStyle}
              titleStyle={styles.customStatusTitle}
              textStyle={styles.customStatusText}
            />
          );
        } else {
          return (
            <Button
              buttontext={merchantCard.linkYourCard}
              myStyle={styles.linkCardButton}
              onPress={() => { Actions.currentScene != 'LinkPhysicalCard' && Actions.LinkPhysicalCard({ physicalCardData: physicalCardData }) }}
            />
          );
        }
      }
      case 'Kyc_in_review': {
        return (
          <>
            <CustomStatus
              animation={ThemeManager.ImageIcons.review}
              animeHeight={150}
              titleText={merchantCard.informationInReview}
              text={merchantCard.kycInreviewProcessTime}
              style={{ top: -10 }}
              titleStyle={styles.customStatusTitle}
              textStyle={styles.customStatusText}
            />
          </>
        );
      }
      case 'Issued': {
        return (
          <>
            {kycStatus != 1 ? (
              <>
                <Button
                  buttontext={merchantCard.activateYourCard}
                  myStyle={styles.activateCardButton}
                  onPress={() => {
                    Actions.currentScene != 'ActivePhysicalCard' && Actions.ActivePhysicalCard({ data: userData, physicalCardData: physicalCardData })
                  }}
                />
                {card()}
              </>
            ) : (
              <CustomStatus
                animation={Images.review}
                animeHeight={150}
                titleText={merchantCard.informationInReview}
                text={merchantCard.kycInreviewProcessTime}
                style={{ top: -10 }}
                titleStyle={styles.customStatusTitle}
                textStyle={styles.customStatusText}
              />
            )}
          </>
        );
      }
      case 'Rejected': {
        return (
          <>
            <View style={styles.rejectedView}>
              <CustomStatus
                isRejected
                animation={Images.rejectedJson}
                animeHeight={100}
                titleText={merchantCard.kycIsRejected}
                text={merchantCard.youCanResubmitKycverificationInformation}
              />
            </View>
            <Button
              buttontext={merchantCard.reApplyKYC}
              myStyle={[styles.reApplyButton, { marginBottom: Platform.OS == 'android' ? 50 : 0 }]}
              onPress={() => {
                Singleton.getInstance().phyAndvirtualCard = true;
                Actions.currentScene != 'ActivePhysicalCard' && Actions.ActivePhysicalCard({ data: userData, from: 'ReApply', physicalCardData: physicalCardData })
              }}
            />
          </>
        );
      }
      case 'activated': {
        return stepTwo();
      }
    }
  };

  /******************************************************************************************/
  const stepOne = () => {
    return (
      <View>
        <View style={styles.switchRenderVIEW}>{switchRender()}</View>
        {physicalCardStatus != 'activated' && physicalCardStatus != 'Rejected' && (
          <>
            <Text allowFontScaling={false} style={[styles.cardFeatureText, { color: ThemeManager.colors.settingsText, borderBottomColor: ThemeManager.colors.underLineColor }]}>{merchantCard.cardFeatures}</Text>
            {cardFeatureData?.map((item, index) => {
              return renderCardFeatureItem(item, index);
            })}
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
        <View style={styles.depositButtonContainer}>
          <Button
            buttontext={merchantCard.deposit}
            onPress={() => { Actions.DepositCard({ coin: coinData, address: liminalAddress, currency: currency, usCardData: physicalCardData, fromUsp: true }) }}
          />
        </View>

        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text allowFontScaling={false} style={[styles.historyText, { color: ThemeManager.colors.whiteText }]}>{merchantCard.history}</Text>
            <TouchableOpacity onPress={() => { Actions.CardTransactionHistory({ currency: currency?.toUpperCase(), usCardData: physicalCardData }) }}>
              <Text style={[styles.viewAllText, { color: ThemeManager.colors.whiteText }]}>{walletMain.viewAll}</Text>
            </TouchableOpacity>
          </View>

          {depositHistory.length > 0 ? (
            depositHistory?.map((item, index) => {
              return renderItemHistory(item, index);
            })
          ) : (
            <>
              <View style={{ height: Dimensions.get('screen').height / 5.7, justifyContent: 'center' }}>
                <Text allowFontScaling={false} style={[styles.transactionHistoryTitle, { color: ThemeManager.colors.whiteText, alignSelf: 'center', fontFamily: Fonts.dmRegular }]}>{merchantCard.noTransactionHistoryFound}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  /******************************************************************************************/
  return (
    <View style={styles.mainView}>
      <ScrollView bounces={false} style={{ flex: 1 }} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              checkCardStatus();
            }}
          />
        }>
        <View style={[styles.cardContainer, { backgroundColor: ThemeManager.colors.modalCard, paddingBottom: physicalCardStatus == 'inActive' ? 10 : 20 }]}>
          <>
            <Slider
              props={props}
              cardStatusError={cardStatusError}
              pager_ref={pager_ref}
              setCurrentIndex={setCurrentIndex}
              physicalCardStatus={physicalCardStatus?.toLowerCase()}
              activeTab={1}
              cardDetails={cardDetails}
            />

            <BottomDots
              currentIndex={currentIndex}
              pager_ref={pager_ref}
              physicalCardStatus={physicalCardStatus}
            />

            {cardStatusError != '...' &&
              (userData == null ? (
                <Button
                  buttontext={merchantCard.apply}
                  myStyle={styles.btnStyle}
                  onPress={() => {
                    Singleton.getInstance().phyAndvirtualCard = true;
                    // Actions.currentScene != 'ActivePhysicalCard' && Actions.ActivePhysicalCard({ data: userData, physicalCardData: physicalCardData })
                    Actions.currentScene != 'VirtualAndPhysical' && Actions.VirtualAndPhysical({ status: userData == null ? 'inactive' : 'fee pending', coin_data: walletData?.status == 1 ? coinData : null, data: userData, physicalCardData: physicalCardData, address: liminalAddress, });
                  }}
                />
              ) : (
                userData != null && userData.card_status == null && (
                  <Button
                    buttontext={merchantCard.payFee}
                    myStyle={styles.btnStyle1}
                    onPress={() => {
                      Singleton.getInstance().phyAndvirtualCard = false;
                      Actions.currentScene != 'VirtualAndPhysical' && Actions.VirtualAndPhysical({ status: userData == null ? 'inactive' : 'fee pending', data: userData, coin_data: walletData?.status == 1 ? coinData : null, physicalCardData: physicalCardData, address: liminalAddress, });
                    }}
                  />
                )
              ))}
            {userData != null && userData.card_status == null && (
              <Text style={[{ paddingHorizontal: 20 }, styles.textStyle, { color: 'black', fontFamily: Fonts.dmMedium }]}>{merchantCard.takesTimeToconfirmPayment}</Text>
            )}
          </>
        </View>
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
export default PhysicalCard;
