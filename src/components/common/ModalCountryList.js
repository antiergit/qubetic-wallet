import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  SafeAreaView,
  Keyboard,
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors, Fonts, Images } from '../../theme';
import { ThemeManager } from '../../../ThemeManager';
import { InputtextSearch } from './InputTextSearch';
import * as Constants from '../../Constants';
import FastImage from 'react-native-fast-image';
import { LanguageManager } from '../../../LanguageManager';
import { Header } from './Header';


export const ModalCountryList = props => {
  const { commonText, placeholderAndLabels } = LanguageManager;
  const [search, setSearch] = useState(props.clearSearch ? '' : '');
  const [countryList, setCountryList] = useState(Constants.countryList);

  //******************************************************************************************/
  useEffect(() => {
    setSearch('');
  }, []);

  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={props.openModel}
      onRequestClose={() => {
        setSearch('');
        props.handleBack && props.handleBack();
        props.onPressIn && props.onPressIn();
        props.onClearSearch && props.onClearSearch();
      }}>

      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      />

      <SafeAreaView style={[styles.centeredView, { backgroundColor: ThemeManager.colors.colorVariation }]} onMoveShouldSetResponder={() => { Keyboard.dismiss() }}>
        {/* <TouchableOpacity
          onPress={() => {
            setSearch('');
            props.onPressIn && props.onPressIn();
            props.onClearSearch && props.onClearSearch();
          }}
          style={[styles.centeredView1]}></TouchableOpacity> */}
        <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
          <View style={{ flex: 1 }}>
            <Header backCallBack={() => {
              props.handleBack && props.handleBack();
              props.onPressIn && props.onPressIn();
              props.onClearSearch && props.onClearSearch();
            }} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} BackButtonText={props.title || placeholderAndLabels.nationality} />
            <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.Mainbg }, props.showCountry && { height: '100%' }]}>
              {/* ******************************************************************************** */}

              {/* <Pressable style={styles.pressIn}
                onPressIn={() => {
                  setSearch('');
                  props.onPressIn && props.onPressIn();
                  props.onClearSearch && props.onClearSearch();
                }}>
                <Image
                  style={{ alignSelf: 'flex-end' }}
                  source={Images.cancelIconNew}
                />
              </Pressable> */}
              {/* ******************************************************************************** */}
              {props.showCountry ? (
                <>
                  {/* <Text style={styles.textStyle}>{props.countryCode ? commonText.ChooseCountryCode : commonText.ChooseCountry}</Text> */}
                  {/* ******************************************************************************** */}
                  <InputtextSearch
                    style={{ width: '100%', marginTop: 10 }}
                    placeholder={commonText.Search}
                    returnKeyType={'done'}
                    value={search}
                    search={!search ? true : false}
                    // clear={search ? true : false}
                    pressClear={() => {
                      setSearch('');
                      props.onClearSearch && props.onClearSearch();
                    }}
                    onChangeNumber={text => {
                      if (props.countryList) {
                        setSearch(text);
                        props.searchCountry(text);
                      } else {
                        // console.log('text', text);
                        setSearch(text);
                        if (text.length == 0) {
                          setCountryList(Constants.countryList);
                        } else {
                          let list = countryList.filter(country => country.name.toLowerCase().includes(text.toLowerCase()) || country.dial_code.toLowerCase().includes(text.toLowerCase()));
                          setCountryList(list);
                        }
                      }
                    }}
                    onSubmitEditing={props.onSubmitEditing}
                  />
                  {/* ******************************************************************************** */}
                  <FlatList
                    style={{ height: 350, marginTop: 10 }}
                    bounces={false}
                    keyExtractor={(item, index) => index + ''}
                    onScroll={props.onScroll}
                    showsVerticalScrollIndicator={false}
                    data={props.countryList ? props.countryList : countryList}
                    ListEmptyComponent={() => {
                      return (
                        <View style={[styles.emptyView1, , props.noStyle]}>
                          <Text allowFontScaling={false} style={[{ ...styles.textStyle, color: ThemeManager.colors.blackWhiteText }]}>{commonText.NoListFound}</Text>
                        </View>
                      );
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <TouchableOpacity
                            onPress={() => {
                              setSearch('');
                              setCountryList(Constants.countryList);
                              props.onClearSearch && props.onClearSearch();
                              props.onpressItem(item);
                            }}
                            style={[styles.listViewStyle, { borderBottomColor: ThemeManager.colors.borderUnderLine }]}>
                            <Text style={[styles.TextStyle, { color: ThemeManager.colors.Text, flex: 3 }]}>{props.countryList ? item.english : item.name}</Text>

                            {props.countryCode && (
                              <Text style={[styles.TextStyle, { color: ThemeManager.colors.Text, flex: 1, textAlign: 'right' }]}>{props.countryList ? '+' + item.mobile_area_code : item.dial_code}</Text>
                            )}

                          </TouchableOpacity>
                        </>
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.textStyle}>{props.heading}</Text>
                  {/* ******************************************************************************** */}
                  <FlatList
                    style={{ marginTop: 10 }}
                    bounces={false}
                    keyExtractor={(item, index) => index + ''}
                    onScroll={props.onScroll}
                    showsVerticalScrollIndicator={false}
                    data={props.list}
                    ListEmptyComponent={() => {
                      return (
                        <View style={[styles.emptyView1, , props.noStyle]}>
                          <Text allowFontScaling={false} style={[{ ...styles.textStyle, color: ThemeManager.colors.blackWhiteText }]}>{commonText.NoListFound}</Text>
                        </View>
                      );
                    }}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <TouchableOpacity onPress={() => props.onpressItem(item)} style={[item?.image ? styles.listViewImageStyle : styles.listViewStyle, { borderBottomColor: ThemeManager.colors.borderUnderLine }]}>
                            {item?.image && (
                              <FastImage source={item.image} style={{ marginRight: 10, height: 20, width: 20 }} />
                            )}
                            <Text style={[styles.TextStyle, { color: ThemeManager.colors.Text }]}>{item.title}</Text>
                          </TouchableOpacity>
                        </>
                      );
                    }}
                  />
                </>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>

      <SafeAreaView></SafeAreaView>
    </Modal>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  pressIn: {
    marginVertical: Platform.OS == 'android' ? 12 : 0,
    alignSelf: 'flex-end',
  },
  TextStyle: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
  },
  emptyView1: {
    alignSelf: 'center',
    marginTop: Dimensions.get('screen').height / 2.5,
  },
  textStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 18,
    textAlign: 'center',
  },
  modalView: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    padding: 15,
  },
  centeredView: {
    flex: 1,
    // justifyContent: 'flex-end',
    // width: '100%',
    // alignItems: 'center',
    // backgroundColor: '#00000077',
  },
  centeredView1: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  listViewStyle: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  listViewImageStyle: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
