import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  Clipboard,
  Platform,
  Share
} from 'react-native';
import { AppAlert, Button, Header, LoaderView, RewardCard, RewardItem } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './ReferralStyle';
import { Colors, Images } from '../../../theme';
import Singleton from '../../../Singleton';
import { LanguageManager } from '../../../../LanguageManager';
import Toast from 'react-native-easy-toast';
import { Actions } from 'react-native-router-flux';
import { useDispatch } from 'react-redux';
import { claimReward, getDetailsRef, getRefHistory } from '../../../Redux/Actions';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import { getData } from '../../../Utils/MethodsUtils';
// import Share from 'react-native-share';

const Referral = props => {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const dataObj = {
    page: 1,
    limit: 25
  }
  const { merchantCard, referral } = LanguageManager;
  const [isLoading, setLoading] = useState(false);
  const [isDisable, setisDisable] = useState(false);
  const [refData, setRefData] = useState('');
  const [refHistory, setRefHistory] = useState([]);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('')
  const [refLink, setRefLink] = useState('');

  /******************************************************************************************/
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getRefLink();
      setisDisable(false)
      getReferralDetails();
      getReferralHistory(dataObj);
      EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
        setShowAlertDialog(false);
        setAlertTxt('');
      });
    })
    EventRegister.addEventListener('enableTouchable', data => {
      setisDisable(false)
    });
  }, []);

  /******************************************************************************************/
  const getRefLink = async () => {
    getData(Constants.REF_LINK).then(url => {
      setRefLink(url);
    })
    return
  }

  /******************************************************************************************/
  const getReferralDetails = () => {
    setLoading(true)
    setTimeout(() => {
      dispatch(getDetailsRef()).then(res => {
        console.log('chk getDetailsRef res::::::', res)
        setLoading(false);
        setRefData(res)
      }).catch(err => {
        setLoading(false)
      })
    }, 100);
  }

  /******************************************************************************************/
  const getReferralHistory = (data) => {
    dispatch(getRefHistory({ data })).then(res => {
      console.log('chk getRefHistory res::::::', res)
      setRefHistory(res)
    }).catch(err => {
      setRefHistory([])
    })
  }

  /* *********************************************onPressRef***************************************** */
  const onPressRef = async () => {
    setisDisable(true)
    const code = Singleton.getInstance().refCode
    Singleton.isCameraOpen = true;
    Singleton.isPermission = true;


    const result = Share.share({ message: referral.getReward + code + `\n${referral.plsDownload}\n` + refLink });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('hererrere2');
      } else {
        console.log('hererrere1');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('hererrere');
    }
  };

  /******************************************************************************************/
  const set_Text_Into_Clipboard = async () => {
    toast?.current?.show(LanguageManager.alertMessages.copied);
    await Clipboard.setString(refLink);
  };

  /* ************************************************************************************** */
  const onPressUpgrade = () => {
    Actions.currentScene != 'Upgrade' && Actions.Upgrade({ refType: refData?.user_referral_type });
  }

  /* ************************************************************************************** */
  const getType = () => {
    const refType = refData.user_referral_type
    const type = refType == 1 ? referral.generalPublic : refType == 2 ? referral.franchisee : refType == 3 ? referral.premFranchisee : refType == 4 ? referral.masterFranchisee : '-'
    return type
  }

  /* ************************************************************************************** */
  const claimRewards = () => {
    setLoading(true);
    const data = {
      referral_type_id: refData.user_referral_type,
      amount_in_fiat: refData?.total_rewards?.fiat_amount || 0,
      amount_in_crypto: refData?.total_rewards?.crypto_amount || 0,
      ids: refData?.unsettled_ids
    }
    setTimeout(() => {
      dispatch(claimReward({ data })).then(res => {
        console.log('chk claimRewards res::::::', res)
        setLoading(false);
        setShowAlertDialog(true);
        setAlertTxt('Request submitted successfully!')
      }).catch(err => {
        setLoading(false);
        setShowAlertDialog(true);
        setAlertTxt(err);
      })
    }, 100);
  }

  /* ************************************************************************************** */
  return (
    <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.cardBg }}>
      <Header
        BackButtonText={referral.referralRewards}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <ScrollView
        bounces={false}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}>

        <View style={styles.ViewStyle}>
          <View style={[styles.ViewText, { backgroundColor: ThemeManager.colors.searchBg }]}>
            <Text style={[styles.txtNew, { color: ThemeManager.colors.lightText, lineHeight: 36 }]}>{referral.level}</Text>
            <Text style={[styles.txtNew1, { color: ThemeManager.colors.settingsText }]}>{getType()}</Text>
          </View>

          <ImageBackground resizeMode='contain' style={styles.imgStyle11} source={Images.refImg} >
            <Text style={[styles.txtUpgrade1, { color: ThemeManager.colors.lightWhiteTextNew }]}>{referral.referralEarn}</Text>
            <Text numberOfLines={10} style={[styles.txtUpgrade, { color: ThemeManager.colors.lightWhiteTextNew }]}>{referral.earnUptoINRRewards}</Text>

          </ImageBackground>
        </View>

        <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.cardBg1, borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
          <View style={{}}>
            <Text style={[styles.txt, { color: ThemeManager.colors.lightText }]}>{referral.refLink}</Text>

            <View style={[styles.addressWrap, { backgroundColor: ThemeManager.colors.bgNew, borderColor: ThemeManager.colors.borderColor }]}>
              <View style={[styles.addressItem, { borderRightColor: ThemeManager.colors.borderColor }]}>
                <Text numberOfLines={1} allowFontScaling={false} style={[styles.addressItemText, { color: ThemeManager.colors.txtColor, marginRight: 5 }]}>{refLink}</Text>
              </View>

              <View style={styles.addressButtons}>
                <TouchableOpacity style={styles.addButtons} onPress={() => set_Text_Into_Clipboard()}>
                  <Image source={ThemeManager.ImageIcons.copy} style={{ tintColor: ThemeManager.colors.newTint, height: 16, width: 13, resizeMode: 'contain' }} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.ViewTouch}>

              <TouchableOpacity disabled={Platform.OS == 'ios' ? false : isDisable} onPress={() => onPressRef()} style={[styles.touch1, { borderColor: ThemeManager.colors.colorVariationBorder }]}>
                <Image style={[styles.imgStyle112, { tintColor: ThemeManager.colors.colorVariationBorder }]} source={ThemeManager.ImageIcons.share} />
                <Text style={[styles.txtNew12, { color: ThemeManager.colors.text_Color }]}>{referral.share}</Text>
              </TouchableOpacity>

              {/* {refData.user_referral_type == 2 ?
                <TouchableOpacity disabled={true} style={[styles.touch2, { backgroundColor: ThemeManager.colors.groupTransferTxt }]}>
                  <Text style={[styles.txtNew12, { color: ThemeManager.colors.lightBlack }]}>{referral.upgrade}</Text>
                </TouchableOpacity>
                 ThemeManager.colors.activeTab 
                : */}
              <TouchableOpacity
                disabled={refData.user_referral_type == 4 ? true : false}
                onPress={() => onPressUpgrade()} style={[styles.touch2, { backgroundColor: refData.user_referral_type == 4 ? ThemeManager.colors.settingBg : ThemeManager.colors.activeTab }]}>
                <Text style={[styles.txtNew12, { color: refData.user_referral_type == 4 ? 'gray' : ThemeManager.colors.lightBlack }]}>{referral.upgrade}</Text>
              </TouchableOpacity>
              {/* } */}

            </View>
            {/* ----------------------------------------------------------- */}
            <View style={styles.ViewStyle3}>
              <RewardCard
                ViewStyle={{ marginVertical: 18 }}
                image={Images.referrals}
                textstyle={[styles.textstyle, { color: ThemeManager.colors.txtNew1 }]}
                textstyle1={styles.textstyle}
                text={referral.noRefer}
                text1={''}
                text2={''}>
                <View style={[styles.ViewStyle4, { backgroundColor: ThemeManager.colors.pieInnerColor }]}>
                  <Text style={[styles.textstyleNew, { color: ThemeManager.colors.settingsText }]}>{refData ? refData?.referral_count : 0}</Text>
                </View>
              </RewardCard>

              <RewardCard
                imgStyle={{ height: 31, width: 31, resizeMode: 'contain' }}
                ViewStyle={{ marginVertical: 18 }}
                textstyle={[styles.textstyle, { color: ThemeManager.colors.txtNew1 }]}
                textstyle1={styles.textstyle1}
                text={referral.startEarning}
                image={Images.price}
                // text={referral.totalRewards}
                // text1={`In ${refData ? refData?.total_rewards?.fiat_amount : 0} `}
                // text3={'USD'}
                // text2={refData ? refData.user_referral_type == 1 ? '' : `In ${refData ? refData?.total_rewards?.crypto_amount : 0} ` : ''}
                // text4={refData ? refData.user_referral_type == 1 ? '' : 'TKN' : ''}
                text2={'In 0.00 '}
                text4={Singleton.getInstance().CurrencySelected}
              >

                {/* <TouchableOpacity onPress={() => claimRewards()} disabled={refData?.enable_button == 1 ? false : true} style={[styles.codeBg, { backgroundColor: refData?.enable_button == 1 ? Colors.btnBg : ThemeManager.colors.groupTransferTxt }]}>
                  <Text style={[styles.txt2, { color: ThemeManager.colors.Mainbg }]}>{referral.claimRef}</Text>
                </TouchableOpacity> */}
              </RewardCard>


            </View>
            {/* ----------------------------------------------------------- */}
            <View style={{ marginHorizontal: 20 }}>
              <Text style={[styles.rewardTxt, { color: ThemeManager.colors.settingsText }]}>{referral.rewardsHistory}</Text>
              {refHistory.length > 0 ? refHistory.map((item, index) => {
                return <RewardItem data={refHistory} item={item} index={index} />
              }) :
                <View style={{ height: Dimensions.get('screen').height / 3.5, justifyContent: 'center' }}>
                  <Text allowFontScaling={false} style={[styles.transactionHistoryTitle, { color: ThemeManager.colors.whiteText, alignSelf: 'center' }]}>{referral.noHistory}</Text>
                </View>
              }
            </View>
          </View>
        </View>
      </ScrollView >

      <Toast
        ref={toast}
        position="bottom"
        positionValue={270}
        style={{ backgroundColor: ThemeManager.colors.toastBg }}
      />

      {showAlertDialog && (
        <AppAlert
          showSuccess={true}
          alertTxt={alertTxt}
          hideAlertDialog={() => { setShowAlertDialog(false) }}
        />
      )}

      <LoaderView isLoading={isLoading} />

    </View >
  );
};

export default Referral;
