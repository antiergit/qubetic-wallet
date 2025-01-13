import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Platform,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Header } from './Header';
import { Fonts, Images } from '../../theme';
import Singleton from '../../Singleton';
import { Button } from './Button';
import Tooltip from 'rn-tooltip';
import { LanguageManager } from '../../../LanguageManager';
import { HeaderMain } from './HeaderMain';
import { getDimensionPercentage, heightDimen } from '../../Utils';
import Svg, { Line } from 'react-native-svg';
import DottedLine from './DottedLine';
import { swapToFixed } from '../../Utils/MethodsUtils';

export const ConfirmSwap = props => {
  const { commonText, merchantCard } = LanguageManager;
  const [ProviderText, showProviderText] = useState(false);


  console.log("props.tokenSecond>>>", props.tokenSecond);


  //******************************************************************************************/
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={props.showConfirmTxnModal}
      onRequestClose={props.handleBack}>


      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew, }}
      >
        <HeaderMain
          mainStyle={{ marginTop: Platform.OS === 'ios' ? 40 : 30 }}
          backCallBack={props.handleBack}
          BackButtonText={merchantCard.confirm + " " + commonText.Swap}
          TextcustomStyle={{ marginTop: 5 }}
        />

        <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>

          <View
            style={[styles.coinInfoText, { marginTop: 5, backgroundColor: ThemeManager.colors.mnemonicsBg }]}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
              <View style={{ alignItems: 'center' }}>
                {props.tokenFirst?.coin_image ? (
                  <Image style={styles.imgStyle1} source={{ uri: props.tokenFirst?.coin_image }} />
                ) : (
                  <View style={styles.ViewStyle3}>
                    <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.settingsText, textAlign: 'center', marginLeft: 0 }]}>{props?.tokenFirst?.coin_name?.charAt(0)}</Text>
                  </View>
                )}
              </View>
              <View style={{ width: "38%", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                <DottedLine />
                <Image style={{ marginLeft: -10, tintColor: ThemeManager.colors.blackWhiteText }} source={Images.forwardIcon} />
              </View>
              <View style={{ alignItems: 'center' }}>
                {props.tokenSecond?.coin_image ? (
                  <Image style={styles.imgStyle2} source={{ uri: props.tokenSecond?.coin_image }} />
                ) : (
                  <View style={styles.ViewStyle3}>
                    <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.settingsText, textAlign: 'center', marginLeft: 0 }]}>{props?.tokenSecond?.coin_name?.charAt(0)}</Text>
                  </View>
                )}


              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.blackWhiteText, fontFamily: Fonts.dmRegular }]}>From</Text>

              </View>
              {/* <View style={{ flex: 1 }} /> */}
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.blackWhiteText, fontFamily: Fonts.dmRegular }]}>To</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.blackWhiteText }]}>{swapToFixed(props?.tokenOneAmount)} {props?.tokenFirst?.coin_symbol}</Text>

              </View>

              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text allowFontScaling={false} style={[styles.coinInfoUSDValue, { color: ThemeManager.colors.blackWhiteText }]}>{swapToFixed(props?.tokenTwoAmount)} {props?.tokenSecond?.coin_symbol}</Text>
              </View>
            </View>




          </View>

          <View
            style={[styles.coinInfoText, { marginTop: 15, backgroundColor: ThemeManager.colors.mnemonicsBg }]}>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text allowFontScaling={false} style={[styles.coinInfoUSD, { width: "15%", color: ThemeManager.colors.blackWhiteText }]}>From</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                allowFontScaling={false} style={[styles.coinInfoUSD, { color: ThemeManager.colors.lightGreyText, flex: 0.6 }]}>{Singleton.getInstance()?.defaultEthAddress}</Text>
            </View>

            <View style={{ height: 1, backgroundColor: ThemeManager.colors.grayGreyBorder, marginVertical: 10 }} />


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text allowFontScaling={false} style={[styles.coinInfoUSD, { width: "15%", color: ThemeManager.colors.blackWhiteText }]}>To</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                allowFontScaling={false} style={[styles.coinInfoUSD, { color: ThemeManager.colors.lightGreyText, flex: 0.6 }]}>{Singleton.getInstance()?.defaultEthAddress}</Text>
            </View>
          </View>



          <View style={[styles.ViewStyle, { marginTop: 10 }]}>
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>Type</Text>


            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightGreyText }]}>
              On Chain
            </Text>

          </View>

          <View style={{ height: 1, backgroundColor: ThemeManager.colors.grayGreyBorder, }} />

          <View style={[styles.ViewStyle]}>
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>{commonText.networkFee}</Text>


            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.lightGreyText }]}>
              {props.networkFee}{' '}
              {props?.tokenFirst?.coin_family == 1 ? 'BNB' : props?.tokenFirst?.coin_family == 2 ? 'ETH' : 'POL'} (
              {Singleton.getInstance().CurrencySymbol}
              {props.nativePrice})
            </Text>

          </View>
        </View>

        <View style={{ justifyContent: 'flex-end', paddingHorizontal: heightDimen(24), marginBottom: heightDimen(30), backgroundColor: ThemeManager.colors.mainBgNew }}>
          <Button onPress={props.onPress} buttontext={props.text} />
        </View>
      </ImageBackground>
      <SafeAreaView></SafeAreaView>
    </Modal>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  imgStyle2: {
    resizeMode: 'contain',
    height: 36,
    width: 36,
    borderRadius: 12,
  },
  ViewStyle3: {
    resizeMode: 'contain',
    height: 36,
    width: 36,
    borderRadius: 12,
    justifyContent: 'center',
  },
  imgStyle1: {
    resizeMode: 'contain',
    height: 36,
    width: 36,
    borderRadius: 12,

  },
  reviewStyle: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: 16,
    marginTop: 15,
  },
  ViewStyle2: {
    position: 'absolute',
    elevation: 2,

    borderRadius: 39,
    top: Platform.OS == 'android' ? 62 : 65,
    alignSelf: 'flex-end',
    right: 60,
    padding: 0,
    zIndex: 1,
  },
  imgStyle: {
    alignSelf: 'center',
    height: 39,
    width: 39,
    resizeMode: 'contain',
  },
  coinInfoText: {
    paddingVertical: 15,
    marginTop: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  coinInfoUSDValue: {
    flexWrap: 'wrap',
    fontFamily: Fonts.dmSemiBold,
    fontSize: getDimensionPercentage(16),
    lineHeight: getDimensionPercentage(20),
    textTransform: 'uppercase',
  },
  coinInfoUSD: {
    fontFamily: Fonts.dmMedium,
    fontSize: 14,
  },
  ViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderBottomWidth: 1,
    paddingVertical: 10,
  },
  ViewStyle1: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingBottom: 2,
    paddingTop: 5,
    marginTop: 20,
  },
  textStyle: {
    fontSize: getDimensionPercentage(14),
    lineHeight: getDimensionPercentage(24),
    fontFamily: Fonts.dmMedium,
  },
});
