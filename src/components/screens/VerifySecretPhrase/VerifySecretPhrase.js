import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, Linking, Pressable, Dimensions, Platform, ImageBackground, ScrollView } from 'react-native';
import styles from './VerifySecretPhraseStyles'
import Toast from 'react-native-easy-toast';
import { getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';
import { AppAlert, Button, ButtonIcon, HeaderMain, LoaderView, OnboardingHeadings } from '../../common';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import { useDispatch } from 'react-redux';
import { requestWalletApiData } from '../../../Utils/MethodsUtils';
import { requestWalletLogin } from '../../../Redux/Actions';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

const VerifySecretPhrase = (props) => {
  const dispatch = useDispatch();
  const toast = useRef(null);
  const [seqenceMn, setSeqenceMn] = useState([]);
  const [jumbleMn, setJumbleMn] = useState([]);
  const [indexArr, setIndexArr] = useState([]);
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [loading, setLoading] = useState(false);
  const originalMnemonics = (props?.walletData?.mnemonics || "guilt tag maze code bus hard lion super region plug mixture orange subject virtual bench")?.split(' ')
  useEffect(() => {
    let shuffle = originalMnemonics.sort(() => Math.random() - 0.5);
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


  const continueAction = async () => {


    if (JSON.stringify(originalMnemonics) != JSON.stringify(seqenceMn)) {
      setAlertModal(true)
      setAlertText(LanguageManager.alertMessages.invalidMnemonics)
    }
    else {
      setLoading(true)
      let WalletData = props?.walletData
      // console.log("WalletData ", WalletData)
      const data = await requestWalletApiData({
        walletData: WalletData,
        walletName: props?.walletName,
      });

      dispatch(requestWalletLogin({ data }))
        .then((resp) => {
          console.log("requestWalletLogin---", resp);

          Actions.currentScene != "CreatePin" &&
            Actions.CreatePin({
              title: "Create",
              subtitle: "create",
              walletData: props?.walletData,
              walletName: props?.walletName,
              walletApiRes: resp,
            });
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.current?.show(err);
          console.log("error requestWalletLogin:::::", err);
        });
    }
  }

  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <HeaderMain />

      <View style={{ marginTop: heightDimen(30), paddingHorizontal: (20) }}>
        <OnboardingHeadings title={LanguageManager.verifyPhrase.verifySecretPhrase} subTitle={LanguageManager.verifyPhrase.taptheWord} />

        <View style={[styles.mnemonicInput, { borderColor: ThemeManager.colors.blackWhiteText }]}>
          {seqenceMn.map((item, index) => {
            return (
              <View
                style={{
                  marginTop: heightDimen(11),
                  marginHorizontal: widthDimen(5.5)
                }}>
                <ButtonIcon
                  directionReverse={true}
                  onPress={() => {
                    removeMnemonic(item, index, true);
                  }}
                  index={index}
                  name={item}
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
          {jumbleMn.map((item, index) => {
            let isActive = seqenceMn.includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.mnemonic_style, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}
                onPress={() => {
                  console.log('jumbleMn----sadsad', isActive)
                  isActive
                    ? removeMnemonic(item, index, false)
                    : addMnemonic(item, index)
                }}

              >
                <Text
                  style={[styles.jumleText,
                  { color: ThemeManager.colors.blackWhiteText }

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
        <Button
          buttontext={LanguageManager.pins.Continue}
          onPress={() => {
            continueAction()
          }}
        />
      </View>

      {alertModal && (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => { setAlertModal(false) }}
        />
      )}
      <Toast
        ref={toast}
        position="bottom"
        positionValue={250}
        style={{ backgroundColor: ThemeManager.colors.toastBg }}
      />
      <LoaderView isLoading={loading} />
    </ImageBackground>
  );
};

export default VerifySecretPhrase;