import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, Linking, Dimensions, Platform, ImageBackground } from 'react-native';
import styles from './WalletNameStyles'

import { AppAlert, Button, Header, HeaderMain, Input, LoaderView, OnboardingHeadings } from '../../common';
import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import DeviceInfo from 'react-native-device-info';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import { Actions } from 'react-native-router-flux';
import { createWallet } from '../../../Utils/MnemonicsUtils';
import * as Constants from '../../../Constants';
import { getData } from '../../../Utils/MethodsUtils';
import { moderateScale } from '../../../layouts/responsive';

const WalletName = (props) => {
  const [wallet_name, setWallet_name] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [multiwallet, setmultiwallet] = useState([]);
  useEffect(() => {
    getData(Constants.MULTI_WALLET_LIST).then(multiWalletArray => {
      setmultiwallet(JSON.parse(multiWalletArray));
    });
  }, []);

  const onPressContinue = () => {

    if (wallet_name?.trim().length == 0) {
      setAlertModal(true)
      setAlertText(LanguageManager.alertMessages.enterWalletName)
      return
    }
    if (wallet_name?.length < 3) {
      setAlertModal(true)
      setAlertText(LanguageManager.createWalletTexts.validName)
      return
    }
    if (props?.screen == 'managewallet') {
      const iswalletNameExist = multiwallet?.find(item => item?.walletName.toLowerCase() == wallet_name?.toLowerCase());
      if (iswalletNameExist) {
        setAlertModal(true)
        setAlertText(LanguageManager.alertMessages.walletNameAlreadyExists)
        return
      }

    }

    setLoading(true)
    createWallet().then((response) => {
      console.log("response---- ", response)
      let mnemonicsArray = response?.mnemonics?.split(' ')
      const duplicates = mnemonicsArray.filter((item, index) => mnemonicsArray.some((elem, idx) => elem === item && idx !== index));
      if (duplicates?.length > 0) {
        onPressContinue()
      }
      else {
        setLoading(false)
        Actions.currentScene != 'SecretPhrase' && Actions.SecretPhrase({ walletData: response, walletName: wallet_name, screen: props?.screen })
      }
    }).catch((error) => {
      setLoading(false)
      console.log("error---- ", error)
    })

    // Actions.SecretPhrase()
  }


  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <HeaderMain />
      <View style={styles.mainView}>
        <View style={styles.mainViewStyle}>

          <OnboardingHeadings title={LanguageManager.walletName.walletName} subTitle={LanguageManager.walletName.youCanlable} />

          <Input
            inputStyle={{ borderRadius: 14, color: ThemeManager.colors.blackWhiteText }}
            label={LanguageManager.walletName.enterWalletName}
            value={wallet_name}
            onChangeText={val => {
              if (Constants.ALPHANUMERIC_WITH_SPACE_REGEX.test(val)) {
                setWallet_name(val.trimStart());
              }
            }}
            placeholder={LanguageManager.walletName.enterHere}
            maxLength={20}
            // style={{ marginTop: dimen(5) }}
            labelcustom={{ color: ThemeManager.colors.grayBlack }}
          />
        </View>
        <View style={[styles.mainBtnView]}>
          <Button
            onPress={() => {
              onPressContinue()
            }}
            buttontext={LanguageManager.pins.Continue}
          />
        </View>
      </View>
      {alertModal && (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => { setAlertModal(false) }}
        />
      )}
      <LoaderView isLoading={loading} />
    </ImageBackground>

  );
};

export default WalletName;