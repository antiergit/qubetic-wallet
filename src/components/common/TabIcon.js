import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Fonts } from '../../theme';

const TabIcon = props => {

  /******************************************************************************************/
  return (
    <View style={[styles.viewMainContainer]}>
      <Image
        source={props.focused ? props.activeImg : props.defaultImg}
        style={[props.ImgSize]}
      />
      <Text
        allowFontScaling={false}
        style={[styles.titleText, props.titleColor]}>
        {props.title}
      </Text>
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  viewMainContainer: {
    marginTop: 18,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  titleText: {
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
    fontSize: 9,
    fontFamily: Fonts.dmBold,
  },
});

export { TabIcon };
