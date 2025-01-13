import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Moment from 'moment';
import { Images, Colors, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { LanguageManager } from '../../../../LanguageManager';

const ViewChange = ({ onPress, percentValue, boxStyle, isDrop, themeSelected }) => {
  const { priceAlert } = LanguageManager;
  const percentData = [
    {
      amount: '2',
    },
    {
      amount: '5',
    },
    {
      amount: '10',
    },
  ];

  /******************************************************************************************/
  const renderOrderItem = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => onPress(item, index, isDrop)}
        style={[styles.boxcolor, boxStyle,
        {
          backgroundColor: percentValue === index ? ThemeManager.colors.walletCardBg : themeSelected == 2 ? 'white' : 'transparent',
          borderWidth: 1,
          borderColor: percentValue != index ? ThemeManager.colors.dividerColor : themeSelected == 2 ? ThemeManager.colors.dividerColor : 'transparent'
        }]}>
        <Text allowFontScaling={false} style={[styles.lightgreyText, { color: percentValue === index ? ThemeManager.colors.Text : ThemeManager.colors.text_Color }]}>
          {isDrop ? '-' + item.amount : '+' + item.amount}%
        </Text>
      </TouchableOpacity>
    );
  };

  /******************************************************************************************/
  return (
    <View style={{ flex: 1, alignItems: 'flex-end' }}>
      <FlatList
        bounces={false}
        data={percentData}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        keyExtractor={(item, index) => `_key${index.toString()}`}
        renderItem={({ item, index }) => renderOrderItem(item, index)}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text allowFontScaling={false} style={styles.noData}>{priceAlert.noData}</Text>
          </View>
        }
      />
    </View>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  emptyView: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 200,
  },
  noData: {
    color: 'black',
    fontFamily: Fonts.dmRegular,
    fontSize: 16,
    alignSelf: 'center',
  },
  body: {
    justifyContent: 'center',
  },
  boxcolor: {
    padding: 5,
    marginHorizontal: 4,
    minWidth: 50,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewMainContainer: {
    height: '100%',
  },

  CardContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  CardMainContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 14,
  },

  BuySellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  SellViewContainer: {
    flexDirection: 'row',
    height: 31,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 26,
    paddingVertical: 5,
  },
  greyText: {
    fontWeight: '400',
    fontSize: 10,
    color: 'grey',
    lineHeight: 16,
    fontFamily: Fonts.dmRegular,
  },
  btnTab: {
    flexDirection: 'row',
    width: '50%',
    flexShrink: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Tabtext: {
    alignItems: 'center',
    fontSize: 14,
    color: '#d3d3d3',
    fontFamily: Fonts.dmRegular,
  },
  Activetext: {
    fontSize: 12,
    alignItems: 'center',
    color: '#ffffff',
    fontFamily: Fonts.dmRegular,
  },
  lightgreyText: {
    fontSize: 15,
    alignItems: 'center',
    fontFamily: Fonts.dmMedium,
  },
  GreyLargeText: {
    color: 'grey',
    fontSize: 10,
    fontFamily: Fonts.dmRegular,
  },
  greenText: {
    fontWeight: '700',
    lineHeight: 16,
    fontSize: 10,
    alignItems: 'center',
    color: 'green',
    fontFamily: Fonts.dmRegular,
  },
  bottomcontainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    alignItems: 'center',
  },
});

export { ViewChange };
