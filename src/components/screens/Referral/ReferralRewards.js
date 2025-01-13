import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Colors, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Button, Header, LoaderView } from '../../common';
import { LanguageManager } from '../../../../LanguageManager';
import styles from './ReferralStyle';
import { Actions } from 'react-native-router-flux';
import ReferralModal from '../../common/ReferralModal';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { getReferralStatus, updateRefCode } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { getData } from '../../../Utils/MethodsUtils';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import fonts from '../../../theme/Fonts';
const ReferralRewards = props => {
  const { referral } = LanguageManager;
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [HavingRefCode, showHavingRefCode] = useState(false);

  /******************************************************************************************/
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
        setShowAlertDialog(false);
        setShowSuccess(false);
        setShowReferralModal(false);
        setRefCode('');
        setAlertTxt('');
      });
      getRefStatus();
    });
  }, []);

  //*********************************************getRefStatus***************************************** */ }
  const getRefStatus = () => {
    const data = {
      device_id: Singleton.getInstance().unique_id,
      wallet_address: Singleton.getInstance().defaultEthAddress,
    };
    dispatch(getReferralStatus({ data }))
      .then(res => {
        console.log('chk getrefstatus:::::', res);
        res.message == 1 ? showHavingRefCode(true) : showHavingRefCode(false);
      })
      .catch(err => {
        console.log('chk err refstatus:::::', err);
      });
  };

  //*********************************************confirmRef***************************************** */ }
  const confirmRef = () => {
    console.log('chk refCode:::::', refCode?.trim().length);
    if (refCode.trim().length == 0) {
      setShowAlertDialog(true);
      setAlertTxt(LanguageManager.alertMessages.pleaseEnterReferralCode);
      return;
    } else if (refCode.trim().length < 8) {
      setShowAlertDialog(true);
      setAlertTxt(LanguageManager.alertMessages.enterValidRefCode);
      return;
    } else {
      updateReferral();
    }
  };

  //*********************************************updateReferral***************************************** */ }
  const updateReferral = () => {
    setLoading(true);
    setTimeout(async () => {
      const data = {
        device_id: Singleton.getInstance().unique_id,
        user_id: await getData(Constants.USER_ID),
        referral_code: refCode,
      };
      dispatch(updateRefCode({ data }))
        .then(res => {
          setLoading(false);
          setShowAlertDialog(true);
          setAlertTxt(LanguageManager.referral.addSuccess);
          console.log('chk updateRefCode:::::', res);
        })
        .catch(err => {
          setLoading(false);
          setShowAlertDialog(true);
          setAlertTxt(err);
          console.log('chk err updateRefCode:::::', err);
        });
    }, 200);
  };

  /******************************************************************************************/
  return (
    // <View style={{flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg}}>
    <View style={{ flexGrow: 1 }}>
      <Header BackButtonText={referral.referralRewards} />

      <View style={styles.ViewStyleNew}>
        <Image style={styles.imgStyle} source={Images.referralRewardIcon} />
      </View>

      <View style={{ flex: 0.8, justifyContent: 'flex-end' }}>
        <Button
          onPress={() =>
            Actions.currentScene != 'PrepaidCard' &&
            Actions.PrepaidCard({ isMainWallet: true })
          }
          myStyle={[styles.myStyle]}
          buttontext={referral.buyPrepaidCards}
        />
        <Button
          isLogout={true}
          onPress={() =>
            Actions.currentScene != 'ReferralRoadMap' &&
            Actions.ReferralRoadMap()
          }
          myStyle={[
            styles.btnStyle,
            { borderColor: ThemeManager.colors.colorVariation },
          ]}
          buttontext={referral.referEarn}
          restoreStyle={{ color: ThemeManager.colors.settingsText }}
        />
      </View>
      {HavingRefCode ? (
        <TouchableOpacity
          onPress={() => {
            setShowReferralModal(true);
            setRefCode('');
          }}
          style={styles.touchR}>
          <Text
            style={[
              styles.textstyle_,
              {
                textAlign: 'center',
                fontSize: 16,
                fontFamily: fonts.dmBold,
                color: ThemeManager.colors.settingsText,
              },
            ]}>
            {referral.havingARef}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity disabled style={styles.touch22}>
          <Text
            style={[
              styles.textstyle_,
              { fontSize: 17, color: ThemeManager.colors.settingsText },
            ]}>
            {' '}
          </Text>
        </TouchableOpacity>
      )}
      {/* *********************************************ReferralModal***************************************** */}
      <ReferralModal
        showReferralModal={showReferralModal}
        handleBack={() => {
          setShowReferralModal(false);
          setRefCode('');
        }}
        onChangeText={text => setRefCode(text.replace(/\s/g, ''))}
        onPress={() => confirmRef()}
        value={refCode}
        Txt={alertTxt}
        showAlert={showAlertDialog}
        hideAlertDialog={() => {
          if (alertTxt == LanguageManager.referral.addSuccess) {
            showHavingRefCode(false);
            setShowReferralModal(false);
            setRefCode('');
          }
          setShowAlertDialog(false);
        }}
        isLoading={isLoading}
      />

      <LoaderView isLoading={isLoading} />

      {showAlertDialog && (
        <AppAlert
          alertTxt={alertTxt}
          hideAlertDialog={() => {
            setShowAlertDialog(false);
          }}
        />
      )}
    </View>
  );
};

export default ReferralRewards;
