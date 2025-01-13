import { View, Text } from 'react-native';
import React from 'react';
import styles from './PrepaidCardStyle';
import Lottie from 'lottie-react-native';
import LottieView from 'lottie-react-native';
import { ThemeManager } from '../../../../ThemeManager';
const CustomStatus = ({
  animation,
  animeHeight = 200,
  titleText,
  text,
  isRejected,
  style,
  textStyle,
  titleStyle,
}) => {
  return (
    <View
      style={[
        { justifyContent: 'center', alignItems: 'center', marginTop: -10 },
        style,
      ]}>
      <View style={{ height: animeHeight, width: animeHeight }}>
        <LottieView
          style={{ height: animeHeight, width: animeHeight }}
          source={animation}
          autoPlay
          loop
        />
      </View>
      <Text
        allowFontScaling={false}
        style={[styles.statusAnimeTitle, titleStyle, { color: ThemeManager.colors.Text }]}>
        {titleText}
      </Text>
      <Text
        allowFontScaling={false}
        style={[styles.statusAnimeText, textStyle, { color: ThemeManager.colors.lightText }]}>
        {text}
      </Text>
    </View>
  );
};

export default CustomStatus;
