import React, { useState, useRef, useEffect } from 'react';
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
  Modal,
  ImageBackground,
} from 'react-native';
import styles from './ManageImportWalletStyles';
import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import DeviceInfo from 'react-native-device-info';
import { AppAlert, Button, HeaderMain, Input, LoaderView, OnboardingHeadings } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import { LanguageManager } from '../../../../LanguageManager';
import { importWallet, validateMnemonics } from '../../../Utils/MnemonicsUtils';
import Toast from 'react-native-easy-toast';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { createUserWalletLocal, getData, requestWalletApiData, saveData } from '../../../Utils/MethodsUtils';
import { requestWalletLogin } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Clipboard from '@react-native-clipboard/clipboard';
import { scan } from '../../../TangemUtils';
import EnterPinForTransaction from '../EnterPinForTransaction/EnterPinForTransaction';
import { Images } from '../../../theme';
import { CongratsModel } from '../../common/CongratsModel';
const ManageImportWallet = (props) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [wallet_name, setWallet_name] = useState('');
  const [isKeyboard, setIsKeyboard] = useState(false);
  const [mnemonics, setMnemonics] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [multiwallet, setmultiwallet] = useState([]);
  const [isShowCongrats, setShowCongrats] = useState(false);
  const [state, updateState] = useState({
    PinModal: false,
    myPin: '',
  })

  const setState = (newObj = {}) => {
    updateState((prev) => ({ ...prev, ...newObj }));
  };

  useEffect(() => {
    getData(Constants.MULTI_WALLET_LIST).then(multiWalletArray => {
      setmultiwallet(JSON.parse(multiWalletArray));
    });
  }, []);
  const importAction = (enteredPin) => {
    console.log("multi importWallet mnemonics--+++-- ", mnemonics)


    setLoading(true)
    console.log("multi importWallet mnemonics---- ", mnemonics)
    importWallet(mnemonics?.toLowerCase()?.trim()).then(async (response) => {
      let WalletData = response
      console.log("multi importWallet response---- ", WalletData)
      const ethAddress = WalletData.eth_address?.toLowerCase();
      const btcAddress = WalletData.btc_address?.toLowerCase();
      const trxAddress = WalletData.trx_address?.toLowerCase();

      const iswalletExist = multiwallet?.find(
        ({ loginRequest, isPrivateKey }) =>
          !isPrivateKey &&
          [ethAddress, btcAddress, trxAddress].includes(
            loginRequest?.wallet_address?.toLowerCase()
          )
      );

      if (iswalletExist) {
        setLoading(false)
        setAlertModal(true)
        setAlertText("Please delete the existing wallet to proceed with importing this wallet.")
        return
      }

      const data = await requestWalletApiData({
        walletData: WalletData,
        walletName: wallet_name,
      });
      importWalletApiCall({
        WalletData,
        apiData: data,
        isTangem: false,
        enteredPin
      });
    }).catch((error) => {
      setLoading(false)
      console.log("importWallet error---- ", error)
      toast.current?.show(error)
    })
  }

  const importWalletApiCall = (data) => {
    const { WalletData, apiData, isTangem, enteredPin } = data;


    dispatch(requestWalletLogin({ data: apiData }))
      .then(async (resp) => {
        console.log("requestWalletLogin---", resp);
        const createWalletData = {
          resp,
          walletData: WalletData,
          walletName: wallet_name,
          pin: enteredPin,
          walletAlreadyExist: true,
          isTangem,
          onSuccess: () => {


            setLoading(false);
            setTimeout(() => {
              Actions.jump("CongratsScreen");

            }, 500);

          },
        };

        await createUserWalletLocal(createWalletData)

      })
      .catch((err) => {
        setLoading(false);
        toast.current?.show(err);
        console.log("error requestWalletLogin:::::", err);
      });
  };


  /******************************************************************************************/
  const onPinSuccess = (pin) => {
    setState({ PinModal: false, myPin: pin });

    importAction(pin);

  };


  const pasteAction = async () => {
    const text = await Clipboard.getString();
    setMnemonics(text);
  }
  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{
        flex: 1,
        backgroundColor: ThemeManager.colors.mainBgNew
      }}
    >
      <HeaderMain />
      <View style={[styles.mainView]}>
        <OnboardingHeadings title={LanguageManager.importWallet.importWallet} subTitle={LanguageManager.importWallet.importWalletH1} />

        <View style={styles.mainViewStyle}>

          <Input
            inputStyle={{
              borderRadius: 14,
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
              marginTop: dimen(40),
              color: ThemeManager.colors.blackWhiteText,
            }}
          />


          <View>
            <Input
              inputStyle={[
                styles.placeHolderStyle,
                {
                  borderColor: ThemeManager.colors.pasteInput,
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
                console.log("val", val);
              }}
              numberOfLines={3}
              style={styles.inputPhraseStyle}
              onBlur={() => setIsKeyboard(false)}
              onFocus={() => setIsKeyboard(true)}
            />
            <TouchableOpacity
              onPress={() => {
                pasteAction();
              }}
              style={{ position: "absolute", bottom: 12, right: 15 }}
            >
              <Image style={{ tintColor: ThemeManager.colors.primaryColor }} source={Images.pasteIcon} />
            </TouchableOpacity>
          </View>


        </View>

        <View style={styles.btnContainer}>
          <View style={styles.btnView}>
            <Button
              myStyle={{ marginBottom: heightDimen(50) }}
              buttontext={LanguageManager.pins.Continue}
              onPress={async () => {

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
                const isValidMnemonics = await validateMnemonics(mnemonics);
                console.log("isValidMnemonics", isValidMnemonics)
                if (!isValidMnemonics) {
                  toast.current?.show(LanguageManager.alertMessages.invalidMnemonics)
                  return
                }


                const iswalletNameExist = multiwallet?.find(item => item?.walletName.toLowerCase() == wallet_name?.toLowerCase());
                if (iswalletNameExist) {
                  setAlertModal(true)
                  setAlertText(LanguageManager.alertMessages.walletNameAlreadyExists)
                  return
                }

                setState({ PinModal: true });
              }}
            />
          </View>
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
      <LoaderView isLoading={loading} />
      <Toast
        ref={toast}
        position="bottom"
        positionValue={250}
        style={{ backgroundColor: ThemeManager.colors.toastBg }}
      />
      {/* --------------------------------Modal for Pin----------------------------------- */}
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={state.PinModal}
        onRequestClose={() => {
          setState({ PinModal: false });
        }}
      >
        <View style={{ flex: 1 }}>
          <EnterPinForTransaction
            onBackClick={() => {
              setState({ PinModal: false });
            }}
            checkBiometric={true}
            closeEnterPin={(pin) => {
              onPinSuccess(pin);
            }}
          />
        </View>
      </Modal>

    </ImageBackground>
  );
};

export default ManageImportWallet;
