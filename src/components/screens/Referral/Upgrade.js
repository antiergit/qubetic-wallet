import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View, Image } from 'react-native'
import { Colors, Fonts, Images } from '../../../theme'
import { Button, Header, LoaderView } from '../../common'
import { ThemeManager } from '../../../../ThemeManager'
import { LanguageManager } from '../../../../LanguageManager'
import styles from './ReferralStyle'
import { Actions } from 'react-native-router-flux'
import { getData } from '../../../Utils/MethodsUtils'
import * as Constants from '../../../Constants'
import { useDispatch } from 'react-redux'
import { RefUserStatus, getLevelDetail, getRefLevel } from '../../../Redux/Actions'
import Lottie from 'lottie-react-native';

const Upgrade = (props) => {
  const dispatch = useDispatch();
  const { referral, merchantCard } = LanguageManager;
  const [language, setLanguage] = useState('en');
  const [isLoading, setLoading] = useState(false);
  const [refUserData, setRefUserData] = useState('');
  const [userNextLevelData, setUserNextLevelData] = useState('');
  const [userStatusData, setUserStatusData] = useState('');
  const [coinData, setCoinData] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [levelDetail, setLevelDetail] = useState('');

  /******************************************************************************************/
  useEffect(() => {
    getLanguage();
    props.navigation.addListener('didFocus', () => {
      getCurrentStatus();
    })
  }, [])

  /******************************************************************************************/
  const getCurrentStatus = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(getRefLevel()).then(refType => {
        console.log('chk getRefLevel res::::::', refType);
        const data = {
          referral_type_id: refType?.user_level,
          fiat_type: 'usd'
        }
        setUserLevel(refType?.user_level);
        const data1 = {
          referral_type_id: refType?.user_level,
        }
        dispatch(getLevelDetail({ data1 })).then(res => {
          console.log('chk getLevelDetail res::::::', res);
          setLevelDetail(res?.content);
          dispatch(RefUserStatus({ data })).then(res => {
            console.log('chk RefUserStatus res::::::', res);
            setCoinData({
              ...res.coin_data.coin,
              balance: res.coin_data?.coin?.wallet_data?.balance,
              coin_id: res.coin_data.coin_id,
            });
            setLoading(false);
            setRefUserData(res);
            const dataNew = res?.next_level_of_referral;
            const userstatus = res?.user_data
            setUserStatusData(userstatus);
            setUserNextLevelData(dataNew);
          }).catch(err => {
            setLoading(false)
          })
        }).catch(err => {
          console.log('chk getLevelDetail err::::::', err);
        })
      }).catch(err => {
        setLoading(false)
      })
    }, 100);
  }

  /******************************************************************************************/
  const getLanguage = async () => {
    const lang = await getData(Constants.SELECTED_LANGUAGE) || 'en'
    setLanguage(lang)
  }

  /* ************************************************************************************** */
  const getType = (refType) => {
    const type = refType == 1 ? referral.generalPublic : refType == 2 ? referral.franchisee : refType == 3 ? referral.premFranchisee : refType == 4 ? referral.masterFranchisee : '-'
    return type
  }

  /******************************************************************************************/
  const getRefCount = () => {
    if (userNextLevelData?.cards_left_to_refer == userNextLevelData?.sell_combo_cards) {
      return `${userNextLevelData.sell_combo_cards} ${referral.refs}`
    } else {
      const count = parseFloat(userNextLevelData?.sell_combo_cards) - parseFloat(userNextLevelData?.cards_left_to_refer)
      return `${count} ${referral.refs}`
    }
  }

  /******************************************************************************************/
  const onProceed = () => {
    Actions.currentScene != 'Terms' && Actions.Terms({ next_level_refTyp: userNextLevelData?.type, refType: userLevel, fees: refUserData?.fee_to_pay, coin_data: coinData })
    // (!userStatusData) ?
    //   Actions.currentScene != 'Terms' && Actions.Terms({ next_level_refTyp: userNextLevelData?.type, refType: userLevel, fees: refUserData?.fee_to_pay, coin_data: coinData })
    //   : Actions.currentScene != 'PayFee' && Actions.PayFee({ from: 'upgrade', next_level_refTyp: userNextLevelData?.type, refType: userLevel, fees: refUserData?.fee_to_pay, coin_data: coinData, address: refUserData?.liminal_address })
  }

  /******************************************************************************************/
  return (
    <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        BackButtonText={referral.upgrade}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <ScrollView
        bounces={false}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}>

        <View style={[styles.ViewStyleNew, { marginHorizontal: 20 }]}>
          {userLevel ? <Image style={{ alignSelf: 'center' }} source={userLevel == 1 ? Images.ref1 : Images.franchise} /> : <View style={{ height: 200, width: 200 }} />}

          <View style={styles.ViewNew}>
            {userLevel && userLevel != 4 ?
              <>
                <View style={{ flex: 0.6 }}>
                  <Text style={[styles.txtNew, { color: ThemeManager.colors.lightText }]}>{referral.currentLevel}</Text>
                </View>
                <View style={{ flex: 0.48 }}>
                  <Text style={[styles.txtNew, { color: ThemeManager.colors.lightText, textAlign: 'left' }]}>{referral.upgrade}</Text>
                </View>
              </>
              : null}
          </View>


          {userLevel && userLevel != 4 ?
            <>
              <View style={[styles.ViewNew, { marginTop: 0 }]}>
                <View style={{ flex: 0.45 }}>
                  <View style={[styles.ViewStyle9, { backgroundColor: ThemeManager.colors.activeTab }]}>
                    <Text style={[styles.txtNew, { fontFamily: Fonts.dmBold, color: ThemeManager.colors.Mainbg, lineHeight: 36 }]}>{getType(userLevel)}</Text>
                  </View>
                </View>

                <Image style={[styles.img1, { tintColor: ThemeManager.colors.colorVariationBorder }]} source={Images.ArrowLong} />

                <View style={{ flex: 0.48 }}>
                  <View style={[styles.ViewStyle9, { borderColor: ThemeManager.colors.borderNew, borderWidth: 1 }]}>
                    <Text style={[styles.txtNew, { fontFamily: Fonts.dmBold, color: ThemeManager.colors.Text, lineHeight: (userNextLevelData?.id) < 3 ? 35 : 25 }]}>{getType(userNextLevelData?.id)}</Text>
                  </View>
                </View>
              </View>
            </>
            :
            <>
              {userLevel ?
                <>
                  <View>
                    <Lottie style={{ alignSelf: 'center', height: 200, width: '100%' }} source={Images.successAnim} autoPlay loop />
                  </View>
                  <Text style={[styles.textstyle_1, { color: ThemeManager.colors.Text, marginTop: -55, }]}>{referral.merchantLevelApprove}</Text>
                </>
                : null
              }
            </>
          }

          {userNextLevelData ?
            <>
              {/* {userNextLevelData?.id < 3 ? null :
                <View style={[styles.ViewNew, { marginTop: 0 }]}>
                  <View style={{ flex: 0.6 }}>
                    <Text style={[styles.txtNew11, { color: ThemeManager.colors.txtNew1 }]}>{getRefCount()}</Text>
                  </View>
                  <View style={{ flex: 0.48 }}>
                    <Text style={[styles.txtNew123, { color: ThemeManager.colors.Text, textAlign: 'left' }]}>{`${userNextLevelData?.cards_left_to_refer} ${referral.more}`}</Text>
                  </View>
                </View>
              } */}

              {/* {(!userStatusData?.status && !refUserData.user_request_status?.request_rejected == 1) ? <Text style={[styles.textstyle5, { color: ThemeManager.colors.lightText, paddingVertical: 20 }]}>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used.</Text> : null} */}

              {userNextLevelData?.sign_required == 0 ? null :
                (!userStatusData && !refUserData.user_request_status?.request_rejected == 1) ?
                  <>
                    <View style={[styles.ViewText, { flexDirection: 'column', marginTop: 0, paddingHorizontal: 0 }]}>
                      <Text style={[styles.textstyle_4, { color: ThemeManager.colors.Text }]}>{`${referral.toUpgrade}${getType(userLevel)}${referral.to}${getType(userNextLevelData?.id)}${referral.youmust}`}</Text>
                      <Text style={[styles.textstyle_5, { color: ThemeManager.colors.Text }]}>{levelDetail}</Text>
                    </View>
                  </>
                  :
                  (userStatusData && userStatusData.status == 1) ?
                    <>
                      <View>
                        <Lottie style={{ alignSelf: 'center', height: 200, width: '100%' }} source={Images.successAnim} autoPlay loop />
                      </View>
                      <Text style={[styles.textstyle_1, { color: ThemeManager.colors.Text }]}>{referral.adminApprove}</Text>
                    </>
                    :
                    (refUserData.user_request_status?.request_rejected == 1) ?
                      <>
                        <View>
                          <Lottie style={{ alignSelf: 'center', height: 100, width: '100%', marginTop: 25 }} source={Images.rejectedJson} autoPlay loop />
                        </View>
                        <Text style={[styles.textstyle_1, { color: ThemeManager.colors.Text, marginTop: 45 }]}>{referral.adminReject}</Text>
                      </>
                      : null
              }
            </>
            : null}
        </View>

        {userNextLevelData ?
          <>
            {userNextLevelData?.sign_required == 0 ? null : <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: userStatusData ? 25 : 45 }}>
              {(userStatusData && userStatusData.status == null) && <Text style={[styles.textstyle_1, { color: ThemeManager.colors.Text, fontFamily: Fonts.dmMedium }]}>{merchantCard.itTakesTimeConfirmPayment}</Text>}
              {(userLevel == 4 || (userStatusData && userStatusData.status == 1)) ? null :
                <Button
                  onPress={() => onProceed()}
                  myStyle={[styles.myStyle]}
                  buttontext={merchantCard.proceed}
                />}
            </View>}
          </>
          : null
        }
      </ScrollView>
      <LoaderView isLoading={isLoading} />
    </View>
  )
}

export default Upgrade