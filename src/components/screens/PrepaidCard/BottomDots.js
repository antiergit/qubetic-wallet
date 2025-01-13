import { View, Text, TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import styles from './PrepaidCardStyle';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import { ThemeManager } from '../../../../ThemeManager';
const BottomDots = ({ currentIndex, pager_ref, physicalCardStatus }) => {
  return (
    <View style={[styles.dotContainer, { marginBottom: physicalCardStatus == 'inactive' ? 20 : 10 }]}>
      <Animated.View
        entering={FadeInLeft}
        exiting={FadeOutLeft}
        style={styles.ViewStyleNew}>
        <TouchableWithoutFeedback onPress={() => { pager_ref.current?.setPage(0) }}>
          <Animatable.View
            duration={600}
            transition={['width', 'backgroundColor']}
            style={{
              height: 7,
              width: currentIndex == 0 ? 20 : 10,
              borderRadius: 5,
              backgroundColor: currentIndex == 0 ? ThemeManager.colors.buttonBg : ThemeManager.colors.bottomColor,
              marginHorizontal: 5,
            }}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => { pager_ref.current?.setPage(1) }}>
          <Animatable.View
            // onMagicTap={() => {
            //     pager_ref.setPage(0)
            // }}
            duration={600}
            transition={['width', 'backgroundColor']}
            style={{
              height: 7,
              width: currentIndex == 1 ? 20 : 10,
              borderRadius: 5,
              backgroundColor: currentIndex == 1 ? ThemeManager.colors.buttonBg : ThemeManager.colors.bottomColor,
              marginHorizontal: 5,
            }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export default BottomDots;
