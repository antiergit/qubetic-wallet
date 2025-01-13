import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Alert, Platform, ImageBackground } from 'react-native';
import styles from './ManageOnboardingStyles'
import { ThemeManager } from '../../../../ThemeManager';
import { LanguageManager } from '../../../../LanguageManager';
import { Button, HeaderMain } from '../../common';
import { Actions } from 'react-native-router-flux';
import { getDimensionPercentage, heightDimen } from '../../../Utils';
import images from '../../../theme/Images';
import { Images } from '../../../theme';
import Lottie from 'lottie-react-native';

const ManageOnboarding = (props) => {
  const lottieRef = useRef()

  useEffect(() => {
    const focusListener = props.navigation.addListener("didFocus", () => {
      lottieRef?.current?.play()
    });
    const blurListener = props.navigation.addListener("didBlur", () => {
      lottieRef?.current?.pause()
    });

    return () => {
      focusListener.remove();
      blurListener.remove();
    }
  }, []);


  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{
        flex: 1, backgroundColor: ThemeManager.colors.mainBgNew
      }}>


      <HeaderMain BackButtonText={LanguageManager.manageWallet.manageWallet} />
      <View style={styles.mainView}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1, }}>
          <Lottie
            ref={lottieRef}
            style={{ height: 280, }}
            source={Images.welcomeAnimation}
            autoPlay
          />

          <View style={{ paddingHorizontal: 40 }}>
            <Text
              style={[
                styles.headerText,
                { color: ThemeManager.colors.blackWhiteText },
              ]}
            >{LanguageManager.onboarding.welcome}</Text>
            <Text style={[styles.boldText, { color: ThemeManager.colors.legalGreyColor }]}>{LanguageManager.onboarding.nonCustodial}</Text>
          </View>


        </View>


        <View style={{ marginBottom: getDimensionPercentage(50) }}>
          <TouchableOpacity
            style={{ marginBottom: heightDimen(10), alignSelf: "center" }}
            // onPress={() => { Actions.currentScene != 'ManageImportWallet' && Actions.ManageImportWallet({}) }}
            onPress={() => {
              Actions.currentScene != "ManageImportWallet" &&
                Actions.ManageImportWallet({});
            }}
          >
            <Image resizeMode="contain" source={images.alreadyWalletText} />
          </TouchableOpacity>
          <Button
            myStyle={{ marginBottom: heightDimen(0), marginTop: heightDimen(10) }}
            onPress={() => { Actions.currentScene != 'WalletName' && Actions.WalletName({ screen: props?.screen }) }}
            // customStyle={{ marginTop: 20 }}
            buttontext={LanguageManager.onboarding.createWallet}
          />


        </View>
      </View>
    </ImageBackground>
  );
};

export default ManageOnboarding;