import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Clipboard,
  ScrollView,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ThemeManager } from "../../../../ThemeManager";
import { Button, HeaderMain, OnboardingHeadings } from "../../common";
import { LanguageManager } from "../../../../LanguageManager";
import styles from "./ShowRecoveryPhraseStyles";
import { getData, getEncryptedData } from "../../../Utils/MethodsUtils";
import images from "../../../theme/Images";
import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import FastImage from "react-native-fast-image";
import Toast from "react-native-easy-toast";
import { Actions } from "react-native-router-flux";
import LinearGradient from "react-native-linear-gradient";

const ShowRecoveryPhrase = ({ walletItem, pin }) => {
  console.log("walletItem:::::", walletItem);
  const [mnemonics, setMnemonics] = useState("");
  const toast = useRef(null);
  useEffect(() => {
    generateMnemonics();
  }, []);
  const generateMnemonics = async () => {
    getEncryptedData(walletItem.loginRequest.wallet_address, pin).then((mnemonics) => {
      setMnemonics(mnemonics?.split(" "));
    });
  };
  const onPressCopy = async () => {
    await Clipboard.setString(mnemonics?.join(" "));
    toast.current?.show("Copied");
  };
  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={[styles.mainView, { backgroundColor: ThemeManager.colors.mainBgNew }]}
    >
      <HeaderMain
        customStyle={{ paddingHorizontal: widthDimen(24) }}
      />
      <ScrollView style={styles.mainViewStyle}>

        <OnboardingHeadings title={LanguageManager.verifyPhrase.yourSecretPhrase} subTitle={LanguageManager.manageWallet.copyThePhrases} />


        <View
          style={[
            styles.itemContainerStyle,
          ]}
        >

          <FlatList
            scrollEnabled={false}
            data={mnemonics}
            numColumns={3}
            contentContainerStyle={[styles.containerStyle]}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{ ...styles.mnemonicBg, backgroundColor: ThemeManager.colors.mnemonicsBg }}
                >
                  <View key={index} style={styles.mnemonic}>
                    <Text
                      style={[
                        styles.textStyle,
                        { color: ThemeManager.colors.legalGreyColor },
                      ]}
                    >
                      {index + 1}.
                    </Text>
                    <Text
                      style={[
                        styles.textStyle,
                        { color: ThemeManager.colors.blackWhiteText },
                      ]}
                    >
                      {"  "}
                      {item}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.copyMainView}>
          <TouchableOpacity
            onPress={() => { onPressCopy(); }}
            style={[styles.copyView,]}
          >
            <Image
              style={styles.copyIconStyle}
              source={images.copyDarkButtonText}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.styleMargin]}>
          <View style={styles.subView}>
            <Image source={images.rightTick} style={{ ...styles.tickImgStyle, tintColor: ThemeManager.colors.legalGreyColor }} />
            <Text style={[styles.txtStyleOne, { color: ThemeManager.colors.legalGreyColor, }]}>{LanguageManager.secretPhrase.doNotShare}</Text>
          </View>
          <View style={styles.subViewTwo}>
            <Image source={images.rightTick} style={{ ...styles.tickImgStyle, tintColor: ThemeManager.colors.legalGreyColor }} />
            <Text style={[styles.txtStyleTwo, { color: ThemeManager.colors.legalGreyColor, }]}>
              {LanguageManager.secretPhrase.futureWalletSupport}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Toast
        ref={toast}
        position="bottom"
        positionValue={250}
        style={{ backgroundColor: ThemeManager.colors.toastBg }}
      />
    </ImageBackground>
  );
};

export default ShowRecoveryPhrase;
