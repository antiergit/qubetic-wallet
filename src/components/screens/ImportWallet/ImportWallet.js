import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  Linking,
  Keyboard,
  Platform,
  Clipboard,
  ImageBackground,
} from 'react-native';
import styles from './ImportWalletStyles';
import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import DeviceInfo from 'react-native-device-info';
import { AppAlert, Button, HeaderMain, Input, LoaderView, OnboardingHeadings } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import { LanguageManager } from '../../../../LanguageManager';
import { importWallet } from '../../../Utils/MnemonicsUtils';
import Toast from 'react-native-easy-toast';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { createUserWalletLocal, getData, requestWalletApiData, saveData } from '../../../Utils/MethodsUtils';
import { requestWalletLogin } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { scan } from '../../../TangemUtils';
import { Images } from '../../../theme';
const ImportWallet = (props) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [wallet_name, setWallet_name] = useState('');
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [mnemonics, setMnemonics] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState('');

  const importAction = () => {

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
    if (mnemonics?.length <= 0) {
      setAlertModal(true)
      setAlertText('Please enter mnemonics')
      return
    }
    setLoading(true)
    importWallet(mnemonics?.toLowerCase()?.trim()).then(async (response) => {
      let WalletData = response
      console.log("importWallet response--++++-- ", WalletData)
      // console.log("importWallet response---- ", WalletData)

      const data = await requestWalletApiData({
        walletData: response,
        walletName: wallet_name,
      });


      console.log('data:::::::>>>>>', data);
      importWalletApiCall(WalletData, data, false)

    }).catch((error) => {
      setLoading(false)
      console.log("importWallet error---- ", error)
      setAlertModal(true)
      setAlertText(error)
    })
  }

  const importWalletApiCall = async (WalletData, data, isTangem) => {
    dispatch(requestWalletLogin({ data }))
      .then((resp) => {
        Actions.currentScene != "CreatePin" &&
          Actions.CreatePin({
            title: "Create",
            subtitle: "create",
            walletData: WalletData,
            walletName: wallet_name,
            walletApiRes: resp,
            isTangem,
          });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.current?.show(err);
        console.log("error requestWalletLogin:::::", err);
      });
  };


  const pasteAction = async () => {
    const text = await Clipboard.getString();
    setMnemonics(text);
  }
  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <HeaderMain />
      <View style={[styles.mainView]}>
        <OnboardingHeadings title={LanguageManager.importWallet.importWallet} subTitle={LanguageManager.importWallet.importWalletH1} />

        <View style={[styles.subView]}>
          <Input
            inputStyle={{
              borderRadius: dimen(14),
              color: ThemeManager.colors.blackWhiteText,
            }}
            label={LanguageManager.walletName.enterWalletName}
            value={wallet_name}
            onChangeText={(val) => {
              if (Constants.ALPHANUMERIC_WITH_SPACE_REGEX.test(val)) {
                setWallet_name(val?.trimStart());
              }
            }}
            placeholder={LanguageManager.walletName.enterHere}
            maxLength={20}
            onBlur={() => setIsKeyboard(false)}
            onFocus={() => setIsKeyboard(true)}
            // style={{ marginTop: dimen(5) }}
            labelcustom={{
              marginTop: heightDimen(10),
              color: ThemeManager.colors.blackWhiteText,
            }}
          />
          <View>
            <Input
              inputStyle={[
                styles.placeHolderStyle,
                {
                  color: ThemeManager.colors.blackWhiteText,
                },
              ]}
              placeholder={LanguageManager.importWallet.secret}
              multiline
              returnKeyType="next"
              icon={false}
              value={mnemonics}
              onChangeText={(val) => {
                // if (val) {
                //   if (val?.includes('\n')) {
                //     Keyboard.dismiss();
                //     return;
                //   }
                //   val = val.replace(/[^A-Za-z ]/gi, '');
                // }
                setMnemonics(val);
                console.log("val nmemonics>>>>", val);
              }}
              numberOfLines={3}
              style={styles.inputPhraseStyle}
              onBlur={() => setIsKeyboard(false)}
              onFocus={() => setIsKeyboard(true)}
            />

            <TouchableOpacity
              onPress={() => {
                pasteAction()
              }}
              style={{ position: "absolute", bottom: 12, right: 15 }}
            >
              <Image style={{ tintColor: ThemeManager.colors.primaryColor }} source={Images.pasteIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.btnContainer}>
            <Button
              buttontext={LanguageManager.pins.Continue}
              onPress={() => {
                importAction();
              }}
            />
          </View>
        </View>

        {alertModal && (
          <AppAlert
            alertTxt={alertText}
            hideAlertDialog={() => {
              setAlertModal(false);
            }}
          />
        )}

        <Toast
          ref={toast}
          position="bottom"
          positionValue={250}
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />
      </View>
      <LoaderView isLoading={loading} />
    </ImageBackground>
  );
};

export default ImportWallet;
