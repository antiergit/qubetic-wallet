import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import styles from "./OnboardingStyles";
import { ThemeManager } from "../../../../ThemeManager";
import { LanguageManager } from "../../../../LanguageManager";
import { Button, GradientText } from "../../common";
import { Actions } from "react-native-router-flux";
import images from "../../../theme/Images";
import { heightDimen } from "../../../Utils";
import Lottie from 'lottie-react-native';
import { Images } from "../../../theme";




const Onboarding = (props) => {
  const lottieRef = useRef()

  useEffect(() => {
    const focusListener = props.navigation.addListener("didFocus", () => {
      lottieRef.current?.play()
    });
    const blurListener = props.navigation.addListener("didBlur", () => {
      lottieRef.current?.pause()
    });

    return () => {
      focusListener.remove();
      blurListener.remove();
    }
  }, []);


  return (

    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1 }}
    >
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

      <View style={{ ...styles.btnView }}>
        <TouchableOpacity
          style={{ paddingVertical: 10, alignSelf: "center" }}
          onPress={() => {

            Actions.currentScene != "Legal" &&
              Actions.Legal({ from: "ImportWallet" });
          }}
        >

          <Image resizeMode="contain" source={images.alreadyWalletText} />

        </TouchableOpacity>
        <Button
          myStyle={{
            marginBottom: heightDimen(20),
            marginTop: heightDimen(10),
          }}
          onPress={() => {
            Actions.currentScene != "Legal" &&
              Actions.Legal({ from: "createwallet" });
          }}

          buttontext={LanguageManager.onboarding.createWallet}
        />

      </View>
    </ImageBackground>
  );
};

export default Onboarding;
