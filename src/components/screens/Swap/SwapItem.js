import React, { Component, memo } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Fonts, Images, Colors } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
const SwapItem = props => {
  const { item, index } = props;

  /******************************************************************************************/
  return (
    <TouchableOpacity
      key={item?.id || index}
      onPress={() => { }}
      disabled={props.disabled}>

      <View style={styles.tokenItem}>
        <View style={styles.tokenItem_first}>
          {item?.coin_image == '' || item?.coin_image == null ? (
            <View style={styles.tokenImage_stylee}>
              <Text allowFontScaling={false} style={[styles.tokenAbr_stylee, { color: ThemeManager.colors.whiteText }]}>{item.coin_name?.charAt(0)}</Text>
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignContent: 'center' }}>
              <Image style={styles.icon} source={{ uri: item?.coin_image }} />
            </View>
          )}

          <Text allowFontScaling={false} style={[styles.tokenAbr_style, { color: props.themeSelected == 2 ? ThemeManager.colors.hedingTextColor : ThemeManager.colors.whiteText }]}>{item.coin_name}</Text>
          {item.token_address != null && (
            <Text allowFontScaling={false} style={[styles.tokenAbr_style, { color: props.themeSelected == 2 ? ThemeManager.colors.hedingTextColor : ThemeManager.colors.whiteText, fontSize: 12, marginLeft: 0 }]}>{item.coin_family == 1 ? '(BNB)' : '(ETH)'}</Text>
          )}
        </View>
        <View>
          <Text allowFontScaling={false} style={[styles.tokenAbr_style, { color: ThemeManager.colors.lightText }]}>{item.coin_symbol?.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  tokenItem: {
    alignItems: 'center',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  tokenItem_first: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
  },
  tokenImage_stylee: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'green',
  },
  tokenAbr_stylee: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    color: ThemeManager.colors.whiteText,
  },
  tokenAbr_style: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: ThemeManager.colors.whiteText,
    marginRight: 5,
    marginLeft: 10,
  },
  icon: {
    width: 33,
    height: 33,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});

export default memo(SwapItem);
