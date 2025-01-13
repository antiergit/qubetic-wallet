import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, Linking, Dimensions, FlatList } from 'react-native';
import styles from './UpdateWalletNameStyles'

import { AppAlert, Button, Header, HeaderMain, Input, LoaderView } from '../../common';
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
import { getData, saveData } from '../../../Utils/MethodsUtils';
const walletOptions = [
  {
    name: LanguageManager.manageWallet.showRecovery,
    index: 1
  },
  {
    name: LanguageManager.manageWallet.exportKey,
    index: 2
  }
]
const UpdateWalletName = (props) => {
  const [wallet_name, setWallet_name] = useState(props?.walletItem?.walletName);
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
    const iswalletNameExist = multiwallet?.find(item => item?.walletName.toLowerCase() == wallet_name?.toLowerCase());
    if (iswalletNameExist) {
      setAlertModal(true)
      setAlertText(LanguageManager.alertMessages.walletAlreadyExists)
      return
    }
    let wallet = props?.walletItem
    let updatedList = multiwallet
    console.log("wallet--- ", wallet)
    updatedList.map((item, index) => {
      if (item.walletName == wallet?.walletName && item?.loginRequest?.wallet_address == wallet?.loginRequest?.wallet_address) {
        item.walletName = wallet_name
        item.loginRequest.wallet_name = wallet_name
        item.login_data.walletName = wallet_name
      }
    });
    console.log("updatedList--- ", updatedList)
    saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(updatedList));
    Actions.pop()
  }
  const onPressOption = (option) => {
    if (option.name == LanguageManager.manageWallet.showRecovery) {
      Actions.ShowRecoveryPhrase({ walletItem: props.walletItem })
    } else {
      Actions.ExportPrivateKeys({ walletItem: props.walletItem })
    }
  }
  return (
    <View style={[styles.mainView, { backgroundColor: ThemeManager.colors.Mainbg }]}>

      <HeaderMain
        BackButtonText={LanguageManager.manageWallet.manageWallet}
        customStyle={{ paddingHorizontal: widthDimen(24) }}
      />

      <View style={styles.mainViewStyle}>
        <Input
          label={LanguageManager.walletName.nameWallet}
          value={wallet_name}
          onChangeText={val => {
            if (Constants.ALPHANUMERIC_SPACE_REGEX.test(val)) {
              setWallet_name(val);
            }
          }}
          placeholder={LanguageManager.walletName.nameWallet}
          maxLength={20}
          limit={LanguageManager.walletName.maxLimit + ` ${wallet_name?.length}/25`
          }

          style={{ marginTop: dimen(5) }}
          labelcustom={{ marginTop: dimen(29) }}
        />
        <Text style={[styles.txtheading, { color: ThemeManager.colors.TextColor }]}>
          {LanguageManager.manageWallet.backup}
        </Text>
        <FlatList
          bounces={false}
          keyExtractor={(item, index) => index + ''}
          showsVerticalScrollIndicator={false}
          data={walletOptions}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={[styles.itemView, { backgroundColor: ThemeManager.colors.nmemonicsInputColor }]} onPress={() => onPressOption(item)}>
                <Text style={[styles.itemText, { color: ThemeManager.colors.TextColor }]}>
                  {item?.name}
                </Text>
                <Image
                  source={ThemeManager.ImageIcons.forwardIcon}
                ></Image>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={[styles.mainBtnView]}>
        <View>
          <Button
            onPress={() => {
              onPressContinue()
            }}
            customStyle={{ marginTop: 20 }}
            buttontext={LanguageManager.manage.Update}
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
    </View>
  );
};

export default UpdateWalletName;