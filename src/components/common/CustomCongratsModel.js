import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { View, Image, Text, TouchableOpacity, Modal } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Colors, Fonts, Images } from '../../theme';
import * as Constants from '../../Constants';
import { getData } from '../../Utils/MethodsUtils';
import { BlurView } from '@react-native-community/blur';
import Lottie from 'lottie-react-native';
import { EventRegister } from 'react-native-event-listeners';

export const CustomCongratsModel = props => {
  const [themeSelected, setThemeSelected] = useState('');

  //******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
  }, []);

  //******************************************************************************************/
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.openModel}
      onRequestClose={props.dismiss}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      <View style={[styles.centeredView]}>
        <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.bottomSheetColor }]}>
          <View style={{ alignItems: 'center', }}>
            {props.hideLottie ?
              <TouchableOpacity style={{ height: 35, width: 35, alignSelf: 'flex-end', paddingTop: 8 }} onPress={props.dismiss}>
                <Image resizeMode="contain" source={ThemeManager.ImageIcons.cancel} />
              </TouchableOpacity>
              : <TouchableOpacity style={{ height: 35, width: 35, alignSelf: 'flex-end', position: 'absolute', paddingTop: 8 }} onPress={props.dismiss}>
                <Image resizeMode="contain" source={ThemeManager.ImageIcons.cancel} />
              </TouchableOpacity>
            }
            {props.hideLottie ? null : <View style={{ marginTop: -20 }}>
              <Lottie
                style={{ height: 200, width: '100%' }}
                source={Images.successAnim}
                autoPlay
                loop
              />
            </View>
            }
            {props.hideLottie ?
              <View >
                <Text allowFontScaling={false} style={[styles.modalTitle, { fontFamily: Fonts.dmBold, color: ThemeManager.colors.whiteText, paddingBottom: 10, }]}>{props.title1}</Text>
                <Text allowFontScaling={false} style={[styles.modalTitle, { marginTop: -5, marginBottom: 5, fontFamily: Fonts.dmLight, color: ThemeManager.colors.lightText, fontSize: 14 }, props.textStyle]}>{props.title2}</Text>
              </View>
              :
              <>
                <Text allowFontScaling={false} style={[styles.modalTitle, { paddingBottom: 0, fontFamily: Fonts.dmBold, marginTop: -30, color: ThemeManager.colors.whiteText, }]}>{props.title1}</Text>
                <Text allowFontScaling={false} style={[styles.modalTitle, { fontFamily: Fonts.dmLight, color: ThemeManager.colors.lightText, fontSize: 14 }, props.textStyle]}>{props.title2}</Text>
              </>
            }
          </View>
        </View>
      </View>
    </Modal>
  );
};

//******************************************************************************************/
export const styles = {
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    elevation: 1,
  },
  modalView: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '90%',
    paddingVertical: 10,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: Fonts.dmBold,
    color: ThemeManager.colors.whiteText,
    paddingBottom: 20
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
};
