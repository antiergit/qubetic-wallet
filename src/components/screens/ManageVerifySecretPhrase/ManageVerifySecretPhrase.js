import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, Linking, Pressable, Dimensions, Platform, Modal, ImageBackground, ScrollView } from 'react-native';
import styles from './ManageVerifySecretPhraseStyles'
import Toast from 'react-native-easy-toast';
import { getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { AppAlert, Button, ButtonIcon, HeaderMain, LoaderView, OnboardingHeadings } from '../../common';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { useDispatch } from 'react-redux';
import { createUserWalletLocal, getData, requestWalletApiData, saveData } from '../../../Utils/MethodsUtils';
import { requestWalletLogin } from '../../../Redux/Actions';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import EnterPinForTransaction from '../EnterPinForTransaction/EnterPinForTransaction';
import { CongratsModel } from '../../common/CongratsModel';

const ManageVerifySecretPhrase = (props) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [seqenceMn, setSeqenceMn] = useState([]);
  const [activeWalletData, setActiveWalletData] = useState({});
  const [jumbleMn, setJumbleMn] = useState([]);
  const [indexArr, setIndexArr] = useState([]);
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShowCongrats, setShowCongrats] = useState(false);
  const [state, updateState] = useState({
    PinModal: false,
    myPin: '',
  })

  const setState = (newObj = {}) => {
    updateState((prev) => ({ ...prev, ...newObj }));
  };

  const originalMnemonics = props?.walletData?.mnemonics.split(' ')
  useEffect(() => {

    let shuffle = originalMnemonics?.sort(() => Math.random() - 0.5);
    setJumbleMn(shuffle);
    setSeqenceMn([]);

  }, []);
  const addMnemonic = (item, indexValue) => {
    setSeqenceMn([...seqenceMn, item]);
    setIndexArr([...indexArr, indexValue]);
    removeMnemonicBottom(item, indexValue, true);
  };
  const removeMnemonicBottom = (item, indexValue, isUpperSide) => {
    let index = 0;
    let arr = indexArr;
    if (isUpperSide) {
      index = indexValue;
    } else {
      index = arr.indexOf(indexValue);
    }
    let mn = jumbleMn;
    // let index = mn.indexOf(item);
    if (index > -1) {
      mn.splice(index, 1);
      setJumbleMn([...mn]);
      console.log("[...mn]", mn)

      arr.splice(index, 1);
      setIndexArr([...arr]);
    }
  };
  const removeMnemonic = (item, indexValue, isUpperSide) => {
    let index = 0;
    let arr = indexArr;
    if (isUpperSide) {
      index = indexValue;
    } else {
      index = arr.indexOf(indexValue);
    }
    let mn = seqenceMn;
    // let index = mn.indexOf(item);
    if (index > -1) {
      mn.splice(index, 1);
      setSeqenceMn([...mn]);
      console.log("[...mn]", [...mn])
      setJumbleMn([...jumbleMn, item]);
      arr.splice(index, 1);
      setIndexArr([...arr]);
    }
  };
  const continueAction = async (enteredPin) => {


    if (JSON.stringify(originalMnemonics) != JSON.stringify(seqenceMn)) {
      toast.current?.show(LanguageManager.alertMessages.invalidMnemonics)
    }
    else {
      setLoading(true)
      let WalletData = props?.walletData
      console.log("WalletData ", WalletData)
      const data = await requestWalletApiData({
        walletData: WalletData,
        walletName: props?.walletName,
      });

      dispatch(requestWalletLogin({ data })).then(async resp => {
        console.log('requestWalletLogin---', resp);
        const createWalletData = {
          resp,
          walletData: WalletData,
          walletName: props?.walletName,
          pin: enteredPin,
          walletAlreadyExist: true,
          onSuccess: () => {
            console.log("ON_SUCCESS>>>>>>>>");

            setLoading(false);
            setTimeout(() => {
              Actions.push("CongratsScreen");
            }, 500);
          }
        };

        await createUserWalletLocal(createWalletData);



      }).catch(err => {
        setLoading(false)
        toast.current?.show(err)
        console.log('error requestWalletLogin:::::', err);
      });
    }

  }

  /******************************************************************************************/
  const onPinSuccess = (pin) => {
    setState({ PinModal: false, myPin: pin });
    continueAction(pin);
  };


  return (<ImageBackground
    source={ThemeManager.ImageIcons.mainBgImgNew}
    style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
  >
    <HeaderMain />

    <View style={styles.mainViewStyle}>
      <OnboardingHeadings title={LanguageManager.verifyPhrase.verifySecretPhrase} subTitle={LanguageManager.verifyPhrase.taptheWord} />
      <View style={[styles.mnemonicInput, { borderColor: ThemeManager.colors.blackWhiteText, }]}>
        {seqenceMn.map((item, index) => {
          return (
            <View
              style={{
                marginTop: heightDimen(11),
                marginHorizontal: widthDimen(5.5),
              }}
            >
              <ButtonIcon
                directionReverse={true}
                onPress={() => {
                  removeMnemonic(item, index, true);
                }}
                index={index}
                name={item}
                width={"100%"}
                imageSize={8}
                textStyle={{ color: ThemeManager.colors.blackWhiteText }}
                fontSize={getDimensionPercentage(16)}
                textHeight={getDimensionPercentage(42)}
                lineHeight={getDimensionPercentage(27.52)}
                borderRadius={55}
                tintColor={ThemeManager.colors.lightBlack}
                outline={true}
                borderColor={ThemeManager.colors.dividerColor}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.mnemonicsStyle}>
        {jumbleMn?.map((item, index) => {
          let isActive = seqenceMn?.includes(item);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.mnemonic_style, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}

              onPress={() => {
                console.log("jumbleMn----", isActive);
                isActive
                  ? removeMnemonic(item, index, false)
                  : addMnemonic(item, index);
              }}
            >

              <Text
                style={[
                  styles.jumleText,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {item}{" "}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>

    <View style={[styles.txtButtonContainer]}>
      <View>
        <Button
          buttontext={LanguageManager.pins.Continue}
          onPress={() => {
            if (JSON.stringify(originalMnemonics) != JSON.stringify(seqenceMn)) {
              toast.current?.show(LanguageManager.alertMessages.invalidMnemonics)
            } else {
              setState({ PinModal: true });
            }
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
    <LoaderView isLoading={loading} />
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
          closeEnterPin={(pin) => {
            onPinSuccess(pin);
          }}
        />
      </View>
    </Modal>

    {isShowCongrats && <CongratsModel
      // text={this.props.title == 'new' ? pins.yourWalletAccessIsRestored : pins.yourWalletisCreated}
      openModel={isShowCongrats}
      title={LanguageManager.commonText.walletCreatedSuccessfully}
      onPress={() => {
        setShowCongrats(false)
        Singleton.bottomBar?.navigateTab("WalletMain");
        Actions.jump("WalletMain");

      }}
    />}

  </ImageBackground>
  );
};

export default ManageVerifySecretPhrase;