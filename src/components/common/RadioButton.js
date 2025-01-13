import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Colors } from '../../theme/';

const RadioButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={{ marginHorizontal: 5 }}>
      <View style={styles.ViewStyle}>
        <View style={[styles.ViewStyle1, { borderColor: ThemeManager.colors.activeTab }]}>
          <View style={[styles.ViewStyle2, { backgroundColor: props.status == 'checked' ? ThemeManager.colors.activeTab : 'transparent' }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle2: {
    height: 10,
    borderRadius: 7,
    width: 10,
  },
  ViewStyle1: {
    padding: 3,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewStyle: {
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnStyle: {
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.themeColor,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 27,
  },
  sendBtnTextStyle: {
    fontFamily: Fonts.dmBold,
    fontSize: 14,
    color: Colors.White,
    marginLeft: 10,
  },
});

export { RadioButton };
