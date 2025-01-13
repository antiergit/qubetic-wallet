import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Fonts, Colors } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';

//******************************************************************************************/
const Item = ({ item, onPress, style, oddColor, index }) => (
  <TouchableOpacity activeOpacity={1} style={[styles.listStyle, style]} onPress={() => { }}>
    <View style={[styles.item_defi, { backgroundColor: ThemeManager.colors.defi_btn_color }]}>
      <View style={{ flexDirection: 'row' }}>
        <Text allowFontScaling={false} numberOfLines={3} style={[styles.titleTextStyle, { color: ThemeManager.colors.passPhraseTitle }]}>{item.title}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

//******************************************************************************************/
const DefiAccessMainList = props => {
  const [selectedId, setSelectedId] = useState(null);
  const renderItem = ({ item, index }) => {
    // console.log('*********', item);
    return (
      <Item item={item} index={index} onPress={() => setSelectedId(item.id)} />
    );
  };

  //******************************************************************************************/
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={props?.defiList}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  listStyle: {
    marginVertical: 8,
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    width: Dimensions.get('screen').width / 2,
    alignItems: 'center',
  },
  item_defi: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 4,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('screen').width / 2 - 35,
    flexWrap: 'wrap',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  titleTextStyle: {
    fontFamily: Fonts.dmBold,
    color: Colors.textColor,
    fontSize: 14,
    marginLeft: 8,
    maxWidth: '75%',
    alignSelf: 'center',
  },
});

export { DefiAccessMainList };
