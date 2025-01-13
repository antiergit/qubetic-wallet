import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Text,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors, Fonts, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';
import { LanguageManager } from '../../../LanguageManager';
import * as Constants from '../../Constants';
import { getData } from '../../Utils/MethodsUtils';
import { EventRegister } from 'react-native-event-listeners';
import images from '../../theme/Images';
import { InputtextSearch } from './InputTextSearch';
import { set } from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { is } from '../../../ios/trust-min';
import { useKeyboard } from '../../hooks/useKeyboard';

export const FilterList = props => {
  const { commonText } = LanguageManager;
  const [themeSelected, setThemeSelected] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [list, setList] = useState(props.list?.list);
  const { isKeyboardOpen, keyboardHeight } = useKeyboard()

  //******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      setThemeSelected(theme);
    })
  }, []);

  useEffect(() => {
    setList(props.list?.list)
  }, [props.list?.list]);
  //******************************************************************************************/
  const getBgColor = (index, selectedIndex) => {
    let color = ''
    if (themeSelected == 2) {
      color = (index == selectedIndex) ? ThemeManager.colors.placeholderBg : ThemeManager.colors.placeholderBg
    } else {
      color = (index == selectedIndex) ? ThemeManager.colors.placeholderBg : ThemeManager.colors.placeholderBg
    }
    return color;
  }

  const onSearchQueryChange = (query) => {
    setSearchQuery(query);
    setList(props.list?.list?.filter(item => item.toLowerCase().includes(query.toLowerCase())));
  }

  //******************************************************************************************/

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={props.openModel}
      onRequestClose={props.onPressIn}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      />
      <SafeAreaView style={[styles.centeredView]}>
        <TouchableOpacity onPress={props.onPressIn} style={[styles.centeredView1]} />

        <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.mainBgNew }]}>

          <Pressable style={{ paddingVertical: 10 }} onPressIn={props.onPressIn}>
            <Image style={{ alignSelf: 'center', marginTop: 20, tintColor: ThemeManager.colors.primaryColor }} source={Images.modal_top_line} />
          </Pressable>

          <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>{commonText.Select}</Text>

          {props?.isCoinListSelected && <InputtextSearch
            placeholder={LanguageManager.commonText.Search}
            value={searchQuery}
            onChangeNumber={onSearchQueryChange}
            style={{ marginTop: 10 }}
            search={!searchQuery}
            pressClear={() => setSearchQuery("")}
          />}
          {props.fromCustom ? props.list?.map((item, index) => {
            return (
              <TouchableOpacity
                disabled={props.disabled}
                key={index + ''}
                onPress={() => props.onPress(item, index, props.list?.type)}
                style={[styles.touchableStyle, { borderColor: ThemeManager.colors.searchBorderColor }]}
              >
                <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.primaryColor }]}>{item}</Text>
              </TouchableOpacity>
            );
          })
            : <View style={{ height: 300 }}>
              <ScrollView>
                {list?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      disabled={props.disabled}
                      key={index + ''}
                      onPress={() => props.onPress(item, index, props.list?.type)}
                      style={[styles.touchableStyle, { borderColor: ThemeManager.colors.searchBorderColor }]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {props?.isCoinListSelected && <Image style={{ height: 20, width: 20, borderRadius: 10, marginRight: 10 }} source={{ uri: Constants.COIN_IMAGE_BY_SYMBOL[item?.toLowerCase()] }} />}
                        <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.blackWhiteText }]}>{item}</Text>
                      </View>
                      {index == props.selectedIndex && <Image style={{ tintColor: ThemeManager.colors.primaryColor }} source={images.tickIcon} />}
                    </TouchableOpacity>
                  );
                })}
                <Text style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText, marginTop: 60 }]}>{list.length > 0 ? '' : commonText.NoListFound}</Text>
              </ScrollView>
            </View>}

          {isKeyboardOpen && <View style={{ height: keyboardHeight - 50 }} />}

        </View>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: ThemeManager.colors.bottomSheetColor }} />
    </Modal>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  textStyle1: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  modalView: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    // paddingHorizontal: 15,
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#00000077',
    // minHeight: 400
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  touchableStyle: {
    flexDirection: 'row',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 15,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
});
