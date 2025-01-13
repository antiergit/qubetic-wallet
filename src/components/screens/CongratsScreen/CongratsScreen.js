import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ThemeManager } from '../../../../ThemeManager';
import { Colors, Fonts, Images } from '../../../theme';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video';
import { LanguageManager } from '../../../../LanguageManager';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { Button } from '../../common';
import { getDimensionPercentage, heightDimen } from '../../../Utils';


const CongratsScreen = () => {
  const { pins } = LanguageManager

  // const lottieRef = useRef()
  const [showLottie, setShowLottie] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowLottie(true)

    }, 2000);

  }, []);

  return (
    <View style={[styles.centeredView, { backgroundColor: ThemeManager.colors.mainBgNew }]}>

      <Video
        source={Images.tickAnimation}
        style={styles.backgroundVideo}
        resizeMode="contain"
        repeat={false}
        loop={false}
      />
      <View style={{ height: 60 }} />
      <View style={{ alignItems: 'center' }}>
        <View>
          {showLottie ?
            <LottieView
              style={{ height: 280, width: 280 }}
              source={Images.tickAnimationLottie}
              autoPlay
              loop={false}

            />
            : null}
        </View>

      </View>
      <View style={{ width: '100%' }}>
        <Button buttontext={pins.Continue} onPress={() => {
          Singleton.bottomBar?.navigateTab("WalletMain");
          Actions.jump("WalletMain");
        }} />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50
  },

  backgroundVideo: {
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
});


export default CongratsScreen