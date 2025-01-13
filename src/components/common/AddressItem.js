import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Images } from '../../theme';
import { LanguageManager } from '../../../LanguageManager';
import { getDimensionPercentage, heightDimen, widthDimen } from '../../Utils';
import { Actions } from 'react-native-router-flux';
import { GradientBorderView } from './GradientBorderView';

export const AddressItem = props => {

  const { commonText } = LanguageManager;

  /******************************************************************************************/
  const maskAddres = address => {
    const a = address.slice(0, 12);
    const b = address.slice(-4);
    return a + '...' + b;
  };

  /******************************************************************************************/
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={props.fromContact ? props.onPressView : null}
      style={[styles.mainView]}
    >

      {props.fromContact ? (
        <>
          {props?.item?.wallet_data && <View style={[styles.mainViewN, { borderBottomColor: ThemeManager.colors.dividernew, borderBottomWidth: 1, }]}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              {props?.item?.name &&
                <GradientBorderView
                  gradientStyle={{ height: widthDimen(44), width: widthDimen(44), }}
                  mainStyle={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={[styles.textStyleNew, { color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name?.charAt(0)}</Text>

                </GradientBorderView>}

              <View style={{ marginLeft: 12 }}>
                <Text allowFontScaling={false} style={[styles.textStyle, props.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name}</Text>
                {props.item?.wallet_data?.length > 0 && (<Text allowFontScaling={false} style={[styles.subTextStyle, props.subTextStyle, { color: ThemeManager.colors.legalGreyColor }]}>{maskAddres(props.item?.wallet_data[0]?.wallet_address)}</Text>)}
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: "center" }}>
              {props.screen != 'addressbook' && props.item?.wallet_data?.length > 0 && (<Text allowFontScaling={false} style={[styles.subTextStyle1, props.subTextStyle, { color: ThemeManager.colors.blackWhiteText }]}>{`${props.item?.wallet_data?.length}` + commonText.addresses}</Text>)}

              <TouchableOpacity
                disabled={props.fromContact ? true : false}
                onPress={props.onPress}
                style={styles.touchableStyle}>
                <Image style={[styles.deleteStyle,
                {
                  transform: [{
                    rotate: props.fromContact ? '270deg' :
                      props.selectedIndex == props.index && props.showView == true ?
                        '180deg' : '360deg'
                  }],
                  tintColor: ThemeManager.colors.blackWhiteText
                }]}
                  source={ThemeManager.ImageIcons.dropDown} />
              </TouchableOpacity>
            </View>
          </View>
          }
        </>

      ) : (
        <View style={{ ...styles.cardView, backgroundColor: ThemeManager.colors.mnemonicsBg }}>
          <TouchableOpacity onPress={props.onPress} style={[styles.mainViewN]}>
            <View style={{ flexDirection: 'row' }}>
              {/* <View style={[styles.ViewStyle, { backgroundColor: ThemeManager.colors.mnemonicsBorder }]}>
                <Text allowFontScaling={false} style={[styles.textStyleNew, { color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name?.charAt(0)}</Text>
              </View> */}
              <GradientBorderView
                gradientStyle={{ height: widthDimen(42), width: widthDimen(42), }}
                mainStyle={{ alignItems: "center", justifyContent: "center" }}
              >
                <Text style={[styles.textStyleNew, { color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name?.charAt(0)}</Text>

              </GradientBorderView>
              <View style={{ marginLeft: 10 }}>
                <Text allowFontScaling={false} style={[styles.textStyle, props.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>{props.item?.name}</Text>
                {props.item?.wallet_data?.length > 0 && (<Text allowFontScaling={false} style={[styles.subTextStyle, props.subTextStyle, { color: ThemeManager.colors.greyText }]}>{maskAddres(props.item?.wallet_data[0]?.wallet_address)}</Text>)}
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {props.screen != 'addressbook' && props.item?.wallet_data?.length > 0 && (<Text allowFontScaling={false} style={[styles.subTextStyle1, props.subTextStyle, { color: ThemeManager.colors.lightText }]}>{`${props.item?.wallet_data?.length}` + commonText.addresses}</Text>)}

              <TouchableOpacity
                disabled={props.fromContact ? true : false}
                onPress={props.onPress}
                style={styles.touchableStyle}>
                <Image style={[styles.deleteStyle, {
                  transform: [{
                    rotate: props.fromContact ? '270deg' :
                      props.selectedIndex == props.index && props.showView == true ? '180deg' : '360deg'
                  }],
                  tintColor: ThemeManager.colors.dropDownColor
                }]} source={ThemeManager.ImageIcons.dropDown} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

      )}
      {props.selectedIndex == props.index && props.showView == true && (
        <>
          <View style={{
            marginTop: 8,
            backgroundColor: ThemeManager.colors.mnemonicsBg,
            borderRadius: 14,
          }}>
            {props.item?.wallet_data?.length > 0 && props.item?.wallet_data.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      let tabType = undefined;
                      console.log("item:::", item)
                      return
                      if (item.coin_family == 1)
                        Actions.currentScene != "SendBnb" &&
                          Actions.push("SendBnb", {
                            selectedCoin: item,
                            tabType: tabType,
                            themeSelected: props.themeSelected,
                          });
                      else if (item.coin_family == 2)
                        Actions.currentScene != "Send" &&
                          Actions.push("Send", {
                            selectedCoin: item,
                            tabType: tabType,
                            themeSelected: props.themeSelected,
                          });
                      else if (item.coin_family == 3)
                        Actions.currentScene != "SendBtc" &&
                          Actions.push("SendBtc", {
                            selectedCoin: item,
                            tabType: tabType,
                            themeSelected: props.themeSelected,
                          });
                      else if (item.coin_family == 4)
                        Actions.currentScene != "SendMatic" &&
                          Actions.push("SendMatic", {
                            selectedCoin: item,
                            tabType: tabType,
                            themeSelected: props.themeSelected,
                          });
                      else if (item.coin_family == 6)
                        Actions.currentScene != "SendTrx" &&
                          Actions.push("SendTrx", {
                            selectedCoin: item,
                            tabType: tabType,
                            themeSelected: props.themeSelected,
                          });
                    }}
                    key={index + ''}
                    style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}>
                    <View style={[styles.ViewStyle2, { backgroundColor: item.coin_data?.coin_image != null ? 'transparent' : ThemeManager.colors.underLineColor }]}>
                      {item.coin_data?.coin_image != null ? (<Image style={[styles.iconStyle]} source={{ uri: item.coin_data?.coin_image }} />) : (<Text allowFontScaling={false} style={[styles.textStyleNew, props.textStyle, { color: ThemeManager.colors.newTxt }]}>{item.name?.charAt(0)}</Text>)}
                    </View>
                    <View style={{ marginLeft: 10, width: '82%', }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View>
                          <Text allowFontScaling={false} style={[styles.textStyle1, { color: ThemeManager.colors.blackWhiteText }]}>{item.name}</Text>
                          <Text allowFontScaling={false} style={[styles.subTextStyle1, { color: ThemeManager.colors.legalGreyColor }]}>{item?.wallet_address?.substring(0, 25) + '...'}</Text>
                        </View>
                        <TouchableOpacity style={styles.binStyle} onPress={() => props.onPressBin(item)}>
                          <Image style={{ alignSelf: 'flex-end', height: 18, width: 18, resizeMode: 'contain', tintColor: ThemeManager.colors.legalGreyColor }} source={ThemeManager.ImageIcons.deleteIcon} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {index !== props.item?.wallet_data?.length - 1 && <View style={{ height: 1, width: "100%", backgroundColor: ThemeManager.colors.lineColor }} />}


                </>

              );
            })}
          </View>

        </>
      )}
    </TouchableOpacity>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle1: {
    flexDirection: 'row',
    width: '100%',

    borderRadius: 14,
    paddingLeft: widthDimen(17),
    borderColor: ThemeManager.colors.addressBookDropBorederColor,
    paddingVertical: 5
  },
  iconStyle: {
    height: 26,
    width: 26,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  ViewStyle2: {
    height: 34,
    width: 34,
    backgroundColor: 'orange',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    alignSelf: 'center',

  },
  deleteStyle: {
    resizeMode: 'contain',
  },
  touchableStyle: {
    marginLeft: 6, marginTop: 10
  },
  ViewStyle: {
    height: 36,
    width: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainView: {
    marginTop: heightDimen(14),
    borderRadius: 10,
    marginHorizontal: widthDimen(24)
  },
  mainViewN: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    // borderRadius: 14,
    // borderBottomWidth:1,

    // paddingHorizontal: 10
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    lineHeight: 20.83,
    textTransform: 'capitalize',
  },
  textStyle1: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    color: ThemeManager.colors.settingsText,
    textTransform: 'capitalize',
    bottom: -10,
  },
  textStyleNew: {
    fontFamily: Fonts.dmMedium,
    fontSize: 20,
    // lineHeight: 30.24,
    textTransform: 'capitalize',
  },
  subTextStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    lineHeight: 18.23,
  },
  subTextStyle1: {
    fontFamily: Fonts.dmRegular,
    fontSize: 12,
    lineHeight: 24,
    marginTop: getDimensionPercentage(8)
  },
  binStyle: {
    alignSelf: 'flex-end',
    // marginBottom: 6,
    // paddingLeft: 12,
    // paddingRight: 16,
    paddingBottom: getDimensionPercentage(12),
  },
  viewusercontact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'space-between',
    flex: 1,
    width: '87%',
    borderBottomWidth: 1,
  },
  cardView: {
    height: getDimensionPercentage(71),
    resizeMode: 'contain',
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: widthDimen(16),
  }
});
