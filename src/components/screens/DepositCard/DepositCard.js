import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Clipboard,
  Share,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import styles from './DepositCardStyle';
import {
  Header,
  AppAlert,
  Button,
  LoaderView,
} from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { getMinimumRechargeAmount, getUspCardFees, getVirtualCardFees } from '../../../Redux/Actions/CardActions';
import { connect } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';
import { toFixedExp } from '../../../Utils/MethodsUtils';


class DepositCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhrase: false,
      walletAddress: this.props.address,
      currency: this.props.currency,
      mimRechargeAmount: '20',
      minRechargeAmountCrypto: '0',
      loading: false,
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    if (this.props.fromUsp == true) {
      const cardID = this.props?.usCardData?.card_id;
      this.props.getUspCardFees(cardID).then(res => {
        console.log('res::::', res);
        this.setState({
          mimRechargeAmount: res.data.min_recharge_fee,
          minRechargeAmountCrypto: toFixedExp(res.data.converted_min_recharge_fee, 6).toString(),
          loading: false,
        });
      }).catch(err => {
        console.log('err::::', err);
        this.setState({ loading: false });
      });
    } else {
      this.props.getVirtualCardFees().then(res => {
        console.log('res::::', res);
        this.setState({
          mimRechargeAmount: res.data.min_recharge_fee,
          minRechargeAmountCrypto: toFixedExp(res.data.converted_min_recharge_fee, 6).toString(),
          loading: false,
        });
      }).catch(err => {
        console.log('err::::', err);
        this.setState({ loading: false });
      });
    }
  }

  /******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(this.state.walletAddress);
    this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.walletAddressCopied, });
    if (this.props.showHeader == 'true')
      this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.walletAddressCopied });
  };

  /******************************************************************************************/
  shareAddress() {
    const { merchantCard } = LanguageManager;
    try {
      this.setState({ isDisable: true });
      Singleton.isCameraOpen = true;
      Singleton.isPermission = true;
      const text = merchantCard.rechargeCardViaTriskal;
      const result = Share.share({ message: text + ' ' + merchantCard.is + ' ' + this.state.walletAddress });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('hererrere2');
        } else {
          console.log('hererrere1');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('hererrere');
      }
    } catch (error) {
      console.log('hererrere111');
    }
  }

  /******************************************************************************************/
  getCurrencySymbol = type => {
    console.log(':::::::::::::::', this.state.currency);
    if (type.toLowerCase() == 'usd') {
      return '$';
    } else {
      return '€';
    }
  };

  /******************************************************************************************/
  render() {
    const { merchantCard, walletMain } = LanguageManager;
    return (
      <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header BackButtonText={merchantCard.deposit} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
        <ScrollView bounces={false} style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
          {/* /****************************************************************************************** */}
          <View style={{ marginHorizontal: 20 }}>
            <Text allowFontScaling={false} style={[styles.copyShareButtonsText, { color: ThemeManager.colors.Text }]}>{merchantCard.publicAddress}</Text>
            <View style={{ borderRadius: 20, backgroundColor: '#F0F3F7', alignSelf: 'center', padding: 25 }}>
              <View style={styles.qrBlock}>
                {this.state.walletAddress ? (
                  <View style={{ borderWidth: 5, borderColor: 'white' }}>

                  </View>
                ) : null}
              </View>
            </View>
            {/* /****************************************************************************************** */}
            <View style={styles.qrAddress}>
              <Text allowFontScaling={false} style={[styles.qrAddressTextStyle, { color: ThemeManager.colors.inActiveTabText }]}>{this.state.walletAddress}</Text>
            </View>
            <View style={styles.copyShareButtons}>
              <TouchableOpacity onPress={() => { this.set_Text_Into_Clipboard(); Keyboard.dismiss() }} style={[styles.buttonsStyle]}>
                <View style={styles.ViewStyle1}>
                  <Image source={Images.copyNew} style={{ height: 21, width: 17, resizeMode: 'contain', padding: 3, tintColor: ThemeManager.colors.colorVariationBorder }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity disabled={Platform.OS == 'ios' ? false : this.state.isDisable} onPress={() => { this.shareAddress(); }} style={[styles.buttonsStyle, { marginLeft: 10 }]}>
                <View style={styles.ViewStyle}>
                  <Image source={Images.Share} style={{ height: 21, width: 17, resizeMode: 'contain', padding: 3, tintColor: ThemeManager.colors.colorVariationBorder }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (this.props.coin?.hasOwnProperty('coin_symbol')) {
                    Actions.SendTrx({ selectedCoin: this.props.coin, themeSelected: 2, from: 'Card', fee: '', address: this.props.address, currency: this.getCurrencySymbol(this.state.currency), minRechargeAmount: this.state.minRechargeAmountCrypto, cardId: this.props?.usCardData?.card_id });
                  } else {
                    console.log('else::::');
                    this.setState({
                      alertTxt: LanguageManager.alertMessages.PleaseactivateTronUSDT,
                      showAlertDialog: true,
                      showSuccess: false,
                    });
                  }
                }}
                style={[styles.buttonsStyle]}>
                <View style={styles.ViewStyle1}>
                  <Image
                    source={Images.sendOutlined}
                    style={{
                      height: 21,
                      width: 17,
                      resizeMode: 'contain',
                      padding: 3,
                      tintColor: ThemeManager.colors.colorVariationBorder,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* /****************************************************************************************** */}
            <Text style={[styles.fontStyle, { color: ThemeManager.colors.subTitle1 }]}>{walletMain.coin}</Text>
            <View style={[styles.ViewStyle2, { borderColor: ThemeManager.colors.borderColor }]}>
              <View style={styles.selectToken}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  {this.props.coin.coin_image ? (
                    <Image style={styles.imgStyle} source={{ uri: this.props.coin.coin_image }} />
                  ) : (
                    <Image style={styles.imgStyle} source={Images.teher} />
                  )}
                  <Text allowFontScaling={false} style={[styles.coinTextStyle, { color: ThemeManager.colors.whiteText }]}>{this.props.coin.coin_symbol ? this.props.coin.coin_symbol : 'USDT'}</Text>
                </View>
              </View>
            </View>

            <Text allowFontScaling={false} style={[styles.noteText, { marginTop: 15, color: ThemeManager.colors.subTitle1 }]}>{merchantCard.forUSDTTRCdepositonly}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text allowFontScaling={false} style={[styles.noteText, { marginTop: 2, color: ThemeManager.colors.whiteText, fontFamily: Fonts.dmBold }]}>{merchantCard.note}</Text>
              <Text allowFontScaling={false} style={[styles.noteText, { marginTop: 2, color: ThemeManager.colors.subTitle1 }]}>{' ' + merchantCard.minimumDepositvalueis + ' ' + `${this.state.minRechargeAmountCrypto} ${this.state.currency?.toUpperCase()}`}</Text>
            </View>

            <View style={{ marginTop: 10, marginBottom: -12 }}>
              <Button
                onPress={() => { Actions.DepositCalculate({ coin: this.props.coin, currency: this.state.currency, address: this.props.address, usCardData: this.props.usCardData }) }}
                buttontext={merchantCard.calculateYourTopUp}
              />
            </View>

            <Text allowFontScaling={false} style={[styles.noteText, { marginBottom: 10, color: ThemeManager.colors.subTitle1 }]}>{merchantCard.clickonButtontoGetCal}</Text>
          </View>
        </ScrollView>
        {/* /****************************************************************************************** */}
        <LoaderView isLoading={this.state.loading} />

        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={true}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
          />
        )}
      </View>
    );
  }
}

export default connect(null, { getMinimumRechargeAmount, getUspCardFees, getVirtualCardFees })(DepositCard);
