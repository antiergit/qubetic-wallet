import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Clipboard,
  Share,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import styles from './DepositCalculateStyle';
import {
  Header,
  AppAlert,
  Button,
  LoaderView,
} from '../../common';
import { Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { InputCustomWithDeposit } from '../../common/InputCustomWithDeposit';
import Toast from 'react-native-easy-toast';
import { toFixedExp } from '../../../Utils/MethodsUtils';
import { calculateCardDeposit } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { LanguageManager } from '../../../../LanguageManager';
var debounce = require('lodash.debounce');


class DepositCalculate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhrase: false,
      enteredAmount: '',
      returnAmount: '',
      currency: this.props.currency,
      loading: false,
    };
  }
  componentDidMount() {
    console.log(this.props.usCardData, 'props:::::', this.props.coin);
  }

  /******************************************************************************************/
  limitLoadData = debounce(value => {
    if (this.state.enteredAmount != '') {
      this.setState({ loading: true });
      if (this.props.usCardData?.card_type?.toLowerCase() == 'us_preferred' || this.props.usCardData?.card_type?.toLowerCase() == 'physical') {
        this.props.calculateCardDeposit({
          amount: this.state.enteredAmount,
          address: this.props.address,
          coin_id: this.props.coin?.coin_id,
          fiat_type: this.props.currency,
          cardId: this.props.usCardData?.card_id
        }).then(res => {
          this.setState({ loading: false });
          this.setState({ returnAmount: this.state.enteredAmount == '' ? '' : toFixedExp(res.data.final_amount, 6).toString() });
        }).catch(err => {
          this.setState({ loading: false });
          this.setState({ returnAmount: '' });
        });
      } else {
        this.props.calculateCardDeposit({
          amount: this.state.enteredAmount,
          address: this.props.address,
          coin_id: this.props.coin?.coin_id,
          fiat_type: this.props.currency,
        }).then(res => {
          this.setState({ loading: false });
          this.setState({ returnAmount: this.state.enteredAmount == '' ? '' : toFixedExp(res.data.final_amount, 6).toString() });
        }).catch(err => {
          this.setState({ loading: false });
          this.setState({ returnAmount: '' });
        });
      }
    }
  }, 2000);

  /******************************************************************************************/
  convert(value) {
    this.limitLoadData(value);
  }

  /******************************************************************************************/
  set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(
      toFixedExp(this.state.returnAmount, 8)?.toString(),
    );
  };

  /******************************************************************************************/
  shareAddress(addressTxt, address) {
    const { sendTrx } = LanguageManager;
    const symbol = 'ERC(20)';
    try {
      this.setState({ isDisable: true });
      Singleton.isCameraOpen = true;
      Singleton.isPermission = true;
      const text = sendTrx.paymeViaTriskelCapitalWallet + sendTrx.myPublicAddressToReceive;
      const result = Share.share({ message: text + addressTxt + symbol + ' is: ' + address });
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
  render() {
    const { merchantCard, alertMessages, deposit, placeholderAndLabels } = LanguageManager;
    const DATA = [{ Key: 0, text: deposit.calIsAproxxValue, img: Images.polygonBlack }, { Key: 1, text: deposit.theDepositIntoTheCard, img: Images.polygonBlack },];
    return (
      <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header BackButtonText={merchantCard.deposit} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}>
          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={[styles.txtText, { color: ThemeManager.colors.subTitle1 }]}>{deposit.selectCurrencyToCalculateTopup}</Text>
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

            <Text style={[styles.txtText, { color: ThemeManager.colors.subTitle1 }]}>{deposit.howMuchBalanceWouldYouLike}</Text>

            <View style={{ marginTop: 12 }}>
              <InputCustomWithDeposit
                placeHolder={placeholderAndLabels.enterAmount}
                keyboardType={'numeric'}
                placeholderTextColor={ThemeManager.colors.Text}
                showQrCode={() => { this.setState({ showQr: true }) }}
                value={this.state.enteredAmount}
                onChangeText={async text => {
                  const expression = new RegExp('^\\d*\\.?\\d{0,' + 6 + '}$');
                  if (expression.test(text)) {
                    this.setState({ enteredAmount: text });
                    this.convert(text);
                  } else if (text.length < 2) {
                    this.setState({ enteredAmount: '', returnAmount: '' });
                  }
                }}
                maxLength={15}
                Txt={this.state.currency?.toUpperCase()}
                isText={true}
                doCopy={() => { }}
                notScan={true}
              />
            </View>
            <Text style={[styles.txtText, { marginTop: 12, color: ThemeManager.colors.subTitle1 }]}>{deposit.youNeedToDeposit}</Text>

            <View style={{ marginTop: 12 }}>
              <InputCustomWithDeposit
                placeHolder={placeholderAndLabels.convertedAmount}
                placeholderTextColor={ThemeManager.colors.Text}
                showQrCode={() => { this.setState({ showQr: true }) }}
                editable={false}
                value={this.state.returnAmount?.toString()}
                Txt={'USDT'}
                isText={true}
                isImage={true}
                keyboardType={'numeric'}
                image={Images.copydeposit}
                doCopy={() => {
                  if (this.state.returnAmount != '') {
                    this.set_Text_Into_Clipboard();
                    Keyboard.dismiss();
                    this.toast.show(alertMessages.copied);
                    console.log('copy');
                  }
                }}
              />
            </View>

            <Text style={[styles.txtinst, { marginTop: 30, color: ThemeManager.colors.Text }]}>{deposit.instructions}</Text>

            <View style={[styles.pin_wrap, { marginTop: 10, left: -10, paddingRight: 10, width: '110%' }]}>
              <FlatList
                data={DATA}
                bounces={false}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <View style={styles.imgStyle1}>
                      <Image source={item.img} style={{ tintColor: ThemeManager.colors.colorVariationBorder }} />
                      <Text multiline style={[styles.txtText, { marginLeft: 10, color: ThemeManager.colors.lightText }]}>{item.text}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* /****************************************************************************************** */}
        <View style={{ bottom: 0, paddingHorizontal: 20 }}>
          <Button
            onPress={() => { Actions.pop() }}
            buttontext={deposit.depositWalletAddress}
          />
        </View>

        {/* /****************************************************************************************** */}
        <LoaderView isLoading={this.state.loading} />

        {/* /****************************************************************************************** */}
        <Toast
          ref={toast => (this.toast = toast)}
          position="bottom"
          positionValue={210}
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />

        {/* /****************************************************************************************** */}
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

export default connect(null, { calculateCardDeposit })(DepositCalculate);
