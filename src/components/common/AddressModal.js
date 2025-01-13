import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Colors, Fonts, Images } from '../../theme';
import * as Constants from '../../Constants';
import { BlurView } from '@react-native-community/blur';
import { getData } from '../../Utils/MethodsUtils';
import { EventRegister } from 'react-native-event-listeners';
import { getDimensionPercentage } from '../../Utils';
import images from '../../theme/Images';
import { GradientBorderView } from './GradientBorderView';

export const AddressModal = props => {
  const [themeSelected, setThemeSelected] = useState('');

  /******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
  }, []);

  /******************************************************************************************/
  return (
    <>
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={props.openModel}
        onRequestClose={() => { false }}>
        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />
        <TouchableOpacity style={[styles.centeredView]} onPress={props.dismiss} />
        {/* <View style={[styles.centeredView]}>
        </View> */}
        <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.mainBgNew }]}>



          <View style={{ flexDirection: "row", justifyContent: "space-between", }}>
            <TouchableOpacity onPress={props.dismiss}>
              <View style={{ flexDirection: "row" }}>
                <Image resizeMode="contain" source={images.leftIcon} style={{ alignSelf: "center", tintColor: ThemeManager.colors.blackWhiteText }} />

                <Text style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText, marginLeft: 8 }]}>
                  Back
                </Text>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={props.dismiss}>
              <Image resizeMode="contain" source={ThemeManager.ImageIcons.crossIconNew} />
            </TouchableOpacity>


          </View>



          <View style={{ justifyContent: 'center', }}>

            <GradientBorderView
              gradientStyle={{ height: 58, width: 58, alignSelf: 'center', marginBottom: 5 }}
              mainStyle={{ alignItems: "center", justifyContent: "center" }}
            >
              <Text style={[styles.textStyleNew, { color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name?.charAt(0)}</Text>

            </GradientBorderView>



            <Text allowFontScaling={false} style={[styles.textStyleNew, { fontSize: 20, color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name}</Text>
          </View>

          <View style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.legalBg, paddingBottom: 8 }]}>
            {props.item?.wallet_data?.length > 0 && props.item?.wallet_data.map((item, index) => {
              return (
                <TouchableOpacity key={index + ''} onPress={() => props.onPressItem(item, index)} style={[styles.ViewStyle11, { paddingBottom: 0 }]}>
                  <View style={[styles.ViewStyle2]}>
                    {item.coin_data?.coin_image != null ? (
                      <Image style={[styles.iconStyle]} source={{ uri: item.coin_data?.coin_image }} />
                    ) : (
                      <Text allowFontScaling={false} style={[styles.textStyleNew, props.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item.name?.charAt(0)}</Text>
                    )}
                  </View>
                  <View style={[styles.ViewStyle3, { borderBottomWidth: index == props.item?.wallet_data.length - 1 ? 0 : 1, }]}>
                    <View style={{ marginLeft: 10 }}>
                      <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.blackWhiteText }]}>{item.name}</Text>
                      <View>
                        <Text allowFontScaling={false} style={[styles.subTextStyle1, { color: ThemeManager.colors.legalGreyColor }]}>{item?.wallet_address?.substring(0, 23) + '...'}</Text>
                      </View>
                    </View>

                    {props.selected_Index == index && (
                      <View style={styles.ViewStyle4}>
                        <Image style={styles.imgStyle1} source={Images.completed} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </Modal >
    </>
  );
};

const styles = StyleSheet.create({
  ViewStyle4: {
    marginLeft: 10,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    padding: 15,
  },
  ViewStyle3: {
    width: '85%',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imgStyle1: {
    height: 9,
    width: 12,
    alignSelf: 'flex-end',
  },
  textStyle1: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  subTextStyle1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    color: 'rgba(26, 32, 46, 0.8)',
    textAlign: 'center',
    paddingBottom: 10,
  },
  iconStyle: {
    height: 34,
    width: 34,
    borderRadius: 17,
  },
  viewusercontact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'space-between',
    flex: 1,
    borderBottomWidth: 1,
  },
  ViewStyle11: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 10,
    width: '100%',
    alignItems: 'center',
  },
  ViewStyle2: {
    height: 34,
    width: 34,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textStyleNew: {
    fontFamily: Fonts.dmMedium,
    fontSize: 24,
    color: ThemeManager.colors.settingsText,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  ViewStyle: {
    height: 60,
    width: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  ViewStyle1: {
    borderRadius: 20,
    marginTop: 20,
  },
  centeredView: {
    flex: 0.5,
    justifyContent: 'center',
    paddingHorizontal: 18,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: '#00000077',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalView: {
    backgroundColor: Colors.White,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,

    borderRadius: 10,
    // width: '90%',
    elevation: 4,
    paddingHorizontal: 24,
    paddingVertical: 25,
    flex: 0.5,
    // backgroundColor:"red"

  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: ThemeManager.colors.whiteText,
  },
  buttonView: {
    marginHorizontal: 20,
    marginVertical: 20,
    marginTop: 5,
    marginBottom: Platform.OS == 'android' ? 20 : 25,
  },
  swipeAfterImage: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 10,
    right: 28,
    height: 39,
    justifyContent: 'center',
  },
  swipeAfterSubImage: {
    position: 'absolute',
    alignSelf: 'center',
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: getDimensionPercentage(16),
    lineHeight: getDimensionPercentage(24),
  }
});
