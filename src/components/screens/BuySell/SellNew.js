import React, { Component } from 'react';
import {
  BackHandler,
  Text,
  View,
} from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import {
  AppAlert,
  Button,
  BuyItem,
  Header,
  ItemRamp,
  LoaderView,
  ModalCoinList,
  SelectCurrencyNew,
} from '../../common';
import styles from './BuyStyle';
import { Actions } from 'react-native-router-flux';
import {
  getFiatSupportedList,
  getBuySellStatus,
  getConversionAlchemy,
  getOnOffRampFiatList,
  getConversionRamp,
} from '../../../Redux/Actions/AlchemyAction';
import { connect } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import { Colors } from '../../../theme';
import { exponentialToDecimal, toFixedExp } from '../../../Utils/MethodsUtils';
import Singleton from '../../../Singleton';
import { LanguageManager } from '../../../../LanguageManager';

var debounce = require('lodash.debounce');

class SellNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAlchemy: false,
      selectedTransak: false,
      amount: '',
      isLoading: false,
      fiatList: [],
      search: '',
      showSuccess: false,
      actualFiatList: [],
      showFiatModal: false,
      showAlertDialog: false,
      alertTxt: '',
      selectedCurr: '',
      buttontext: LanguageManager.buySell?.proceedToSell,
      receivingAmount: '',
      text: '',
      conversionRes: '',
      disabled: true,
      minAmount: '0.00',
      maxAmount: '0.00',
      alchemyText: '',
      transakText: '',
      isTransakErr: false,
      isAlchemyErr: false,
      transakAmount: '',
      alchemyAmount: '',
    };
  }
  componentDidMount() {
    this.fetchFiatList();
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showFiatModal: false,
        search: '',
        showAlertDialog: false,
        alertTxt: '',
        showSuccess: false,
      });
    });
    this.props.navigation.addListener('didFocus', () => {
      this.setState({
        disabled: true,
        selectedAlchemy: false,
        selectedTransak: false,
        showFiatModal: false,
        search: '',
        showAlertDialog: false,
        alertTxt: '',
        showSuccess: false,
      });
      this.setState({ buttontext: LanguageManager.buySell.proceedToSell });
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    });
    this.props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    });
  }

  /******************************************************************************************/
  handleBackButtonClick = () => {
    console.log('Backhandler Sell');
    Actions.pop('');
    return true;
  };

  /* *********************************************************** Fiat list supported by Alchemy ********************************************************************** */
  fetchFiatList() {
    this.setState({ isLoading: true });
    this.setState({ isLoading: true });
    this.props.getOnOffRampFiatList({}).then(res => {
      this.setState({
        isLoading: false,
        fiatList: res,
        actualFiatList: res,
        selectedCurr: res[0],
      });
    }).catch(err => {
      this.setState({ isLoading: false });
      console.log('fetchFiatList:::::::err', err);
    });
  }

  /* *********************************************************** getConversionNew ********************************************************************** */
  getConversionNew() {
    const { buySell } = LanguageManager;
    this.setState({ isLoading: true });
    const { amount, selectedCurr } = this.state;
    const selectedCoin_ = this.props.selectedCoin;
    const network = selectedCoin_?.coin_family == 1 ? 'bsc' : selectedCoin_?.coin_family == 3 ? 'mainnet' : selectedCoin_?.coin_family == 2 ? 'ethereum' : selectedCoin_?.coin_family == 6 ? selectedCoin_?.is_token == 1 ? 'tron' : 'mainnet' : 'polygon';
    const data = {
      transak_url: `?partnerApiKey=${Constants.TRANSAK_KEY}&fiatCurrency=${selectedCurr?.fiat_currency}&cryptoCurrency=${selectedCoin_?.coin_symbol?.toUpperCase()}&isBuyOrSell=SELL&network=${network}&paymentMethod=credit_debit_card&cryptoAmount=${amount}`,
      crypto: selectedCoin_.coin_symbol?.toUpperCase(),
      network: selectedCoin_?.coin_family == 1 ? 'bsc' : selectedCoin_.coin_family == 2 ? 'ETH' : selectedCoin_.coin_family == 3 ? 'BTC' : selectedCoin_.coin_family == 6 ? 'TRX' : 'MATIC',
      fiat: selectedCurr.fiat_currency,
      country: selectedCurr.country_code,
      amount: amount,
      payWayCode: selectedCurr?.alchemy_payment_details != null ? selectedCurr?.alchemy_payment_details[0]?.payWayCode : '',
      side: this.props.typeOfSwap.toUpperCase(),
    };
    this.props.getConversionRamp({ data }).then(async res => {
      this.setState({ isLoading: false });
      if (!res.alchemy?.data && res.transak?.hasOwnProperty('error')) {
        return this.setState({
          isAlchemyErr: true,
          isTransakErr: true,
          alchemyText: res.alchemy?.returnCode == '3100' ? '' : res.alchemy?.returnMsg,
          transakText: res.transak?.error?.message,
        });
      } else if (!res.alchemy?.data && res.transak?.hasOwnProperty('response')) {
        const transakRes = res.transak?.response;
        const receivingAmount = parseFloat(transakRes.cryptoAmount) - parseFloat(transakRes.totalFee);
        const lowBal = exponentialToDecimal(receivingAmount) <= 0;
        const convertedAmount = exponentialToDecimal(receivingAmount) <= 0 ? '' : receivingAmount.toFixed(2);
        return this.setState({
          disabled: lowBal ? true : false,
          selectedTransak: true,
          alchemyText: '',
          isTransakErr: false,
          transakText: lowBal ? '' : `${selectedCoin_.coin_symbol?.toUpperCase()} ${convertedAmount}`,
          transakAmount: convertedAmount,
          alchemyAmount: '',
          conversionRes: '',
          receivingAmount: convertedAmount,
          text: '',
          buttontext: lowBal ? buySell.platformFeeTooHigh : buySell.sell,
        });
      } else if (res.alchemy?.data && res.transak?.hasOwnProperty('error')) {
        const alchemyRes = res.alchemy?.data;
        const receivingAmount = parseFloat(alchemyRes.fiatQuantity) - parseFloat(alchemyRes.rampFee);
        const lowBal = exponentialToDecimal(receivingAmount) <= 0;
        const convertedAmount = exponentialToDecimal(receivingAmount) <= 0 ? '' : receivingAmount.toFixed(2);
        this.setState({
          disabled: lowBal ? true : false,
          selectedAlchemy: true,
          transakText: '',
          isAlchemyErr: false,
          alchemyText: lowBal ? '' : `${selectedCoin_.coin_symbol?.toUpperCase()} ${convertedAmount}`,
          conversionRes: alchemyRes,
          alchemyAmount: convertedAmount,
          transakAmount: '',
          receivingAmount: convertedAmount,
          text: '',
          buttontext: lowBal ? buySell.platformFeeTooHigh : buySell.sell,
        });
        lowBal ? '' : this.checkAlchemyStatus(this.props.selectedCoin, this.state.selectedCurr);
        return;
      } else {
        const transakRes = res.transak?.response;
        const transakReceivingAmount = parseFloat(transakRes.fiatAmount) - parseFloat(transakRes.totalFee);
        const transakConvertedAmount = exponentialToDecimal(transakReceivingAmount) <= 0 ? '' : transakReceivingAmount.toFixed(2);
        const alchemyRes = res.alchemy?.data;
        const alchemyReceivingAmount = parseFloat(alchemyRes.fiatQuantity) - parseFloat(alchemyRes.rampFee);
        const alchemyConvertedAmount = exponentialToDecimal(alchemyReceivingAmount) <= 0 ? '' : alchemyReceivingAmount.toFixed(2);
        const LowBal = (exponentialToDecimal(alchemyConvertedAmount) && exponentialToDecimal(transakConvertedAmount)) <= 0;
        console.log('chk is lowBal:::::', LowBal)
        console.log('chk is alchemyConvertedAmount:::::', alchemyConvertedAmount)
        console.log('chk is alchemyReceivingAmount:::::', alchemyReceivingAmount)
        this.setState({
          transakText: LowBal ? '' : `${selectedCoin_.coin_symbol?.toUpperCase()} ${transakConvertedAmount} ${parseFloat(transakConvertedAmount) > parseFloat(alchemyConvertedAmount) ? buySell.bestPrice : ''}`,
          alchemyText: LowBal ? '' : `${selectedCoin_.coin_symbol?.toUpperCase()} ${alchemyConvertedAmount} ${parseFloat(transakConvertedAmount) < parseFloat(alchemyConvertedAmount) ? buySell.bestPrice : ''}`,
          isTransakErr: false,
          isAlchemyErr: false,
          conversionRes: alchemyRes,
          receivingAmount: parseFloat(transakConvertedAmount) > parseFloat(alchemyConvertedAmount) ? transakConvertedAmount : alchemyConvertedAmount,
          text: '',
          selectedAlchemy: parseFloat(transakConvertedAmount) < parseFloat(alchemyConvertedAmount) ? true : false,
          selectedTransak: parseFloat(transakConvertedAmount) > parseFloat(alchemyConvertedAmount) ? true : false,
          transakAmount: transakConvertedAmount,
          alchemyAmount: alchemyConvertedAmount,
          buttontext: LowBal ? buySell.platformFeeTooHigh : buySell.sell,
          disabled: LowBal ? true : false,
        });
        parseFloat(transakConvertedAmount) < parseFloat(alchemyConvertedAmount) ? this.checkAlchemyStatus(this.props.selectedCoin, this.state.selectedCurr) : '';
        return;
      }
    }).catch(err => {
      this.setState({ isLoading: false });
      console.log('chk getConversionRamp err:::::', err);
    });
  }

  /* *********************************************************** onSell ********************************************************************** */
  onSell() {
    const { alertMessages } = LanguageManager;
    const { minAmount, maxAmount, amount, receivingAmount, selectedCurr, selectedTransak, selectedAlchemy } = this.state;
    const selectedCoin_ = this.props.selectedCoin;
    if (amount?.length == 0 || amount == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterAmount });
    } else if (receivingAmount?.length == 0 || receivingAmount == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.cannotProceed });
    } else if (parseFloat(amount) > parseFloat(this.props.selectedCoin.balance)) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.insufficientBalance });
    } else if (selectedAlchemy == false && selectedTransak == false) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.selectPaymentGatewayToProceed });
    } else {
      if (selectedTransak == true) {
        this.createTransakObject(receivingAmount, amount, selectedCurr?.fiat_currency);
      } else if (selectedAlchemy == true) {
        if (parseFloat(amount) < parseFloat(minAmount)) {
          return this.setState({ showAlertDialog: true, alertTxt: alertMessages.minimumAmountMustBe + ' ' + `${minAmount} ${selectedCoin_?.coin_symbol?.toUpperCase()}` });
        } else if (parseFloat(amount) > parseFloat(maxAmount)) {
          return this.setState({ showAlertDialog: true, alertTxt: alertMessages.maximumAmountMustBe + ' ' + `${maxAmount} ${selectedCoin_?.coin_symbol?.toUpperCase()}` });
        } else if (parseFloat(amount) > parseFloat(this.props.selectedCoin.balance)) {
          return this.setState({ showAlertDialog: true, alertTxt: alertMessages.insufficientBalance });
        } else {
          Actions.currentScene != 'CheckoutNew' &&
            Actions.CheckoutNew({
              selectedCurr: this.state.selectedCurr,
              amountReceived: this.state.receivingAmount,
              amountEntered: this.state.amount,
              selectedCoin: this.props.selectedCoin,
              typeOfSwap: this.props.typeOfSwap?.toLowerCase(),
              conversionRes: this.state.conversionRes,
            });
        }
      }
    }
  }

  /* *********************************************************** createTransakObject ********************************************************************** */
  createTransakObject(fiatAmount, cryptoAmount, sourceCurrName) {
    const selectedCoin_ = this.props.selectedCoin;
    const paymentMethod = 'credit_debit_card';
    const partnerOrderId = Math.random().toString(36).substr(2) + Date.now().toString(36);
    const partnerCustomerId = selectedCoin_?.coin_family == 6 || selectedCoin_?.coin_family == 3 ? selectedCoin_?.wallet_address : selectedCoin_?.wallet_address?.toLowerCase();
    const network = selectedCoin_?.coin_family == 1 ? 'bsc' : selectedCoin_?.coin_family == 3 ? 'mainnet' : selectedCoin_?.coin_family == 2 ? 'ethereum' : selectedCoin_?.coin_family == 6 ? selectedCoin_?.is_token == 1 ? 'tron' : 'mainnet' : 'polygon';

    const productsAvailed = 'SELL';
    const orderUrl = Constants.network == 'testnet'
      ? `${Constants.TRANSAK_URL}?apiKey=${Constants.TRANSAK_KEY
      }&walletAddress=${partnerCustomerId}&fiatCurrency=${sourceCurrName}&defaultFiatAmount=${fiatAmount}&cryptoCurrencyCode=${selectedCoin_.coin_symbol?.toUpperCase()}&defaultCryptoAmount=${cryptoAmount}&defaultPaymentMethod=${paymentMethod}&network=${network}&redirectURL=${Constants.TRANSAK_REDIRECT_URL
      }&partnerOrderId=${partnerOrderId}&partnerCustomerId=${partnerCustomerId}&productsAvailed=${productsAvailed}&environment=STAGING`
      : `${Constants.TRANSAK_URL}?apiKey=${Constants.TRANSAK_KEY
      }&walletAddress=${partnerCustomerId}&fiatCurrency=${sourceCurrName}&defaultFiatAmount=${fiatAmount}&cryptoCurrencyCode=${selectedCoin_.coin_symbol?.toUpperCase()}&defaultCryptoAmount=${cryptoAmount}&defaultPaymentMethod=${paymentMethod}&network=${network}&redirectURL=${Constants.TRANSAK_REDIRECT_URL
      }&partnerOrderId=${partnerOrderId}&partnerCustomerId=${partnerCustomerId}&productsAvailed=${productsAvailed}&email=${Singleton.getInstance().defaultEmail
      }`;
    Actions.currentScene != 'Transak' &&
      Actions.Transak({
        title: 'Sell',
        url: orderUrl,
        partnerOrderId: partnerOrderId,
        selectedCoin: this.props.selectedCoin,
      });
  }
  /* *********************************************************** onChangeNumber ********************************************************************** */
  onChangeNumber(value) {
    if (value.includes(',')) value = value.replace(',', '.');
    const expression = new RegExp('^\\d*\\.?\\d{0,' + '}$');
    if (expression.test(value)) {
      this.setState({
        amount: value,
        receivingAmount: '',
        selectedAlchemy: false,
        selectedTransak: false,
        isAlchemyErr: false,
        isTransakErr: false,
        alchemyText: '',
        transakText: '',
        disabled: true,
        buttontext: LanguageManager.buySell.proceedToSell,
      });
      this.onChangeTextDebounce(value);
    }
  }
  /* *********************************************************** onChangeTextDebounce ********************************************************************** */
  onChangeTextDebounce = debounce(value => {
    if (value?.length == 0 || value == 0 || value == '.' || value?.trim() == '') {
      this.setState({ amount: '', receivingAmount: '' });
      return;
    } else {
      this.getConversionNew(value);
    }
  }, 1000);
  /* *********************************************************** onPressFiatItem ********************************************************************** */
  onPressFiatItem(item) {
    this.setState({
      amount: '',
      selectedAlchemy: false,
      selectedTransak: false,
      receivingAmount: '',
      selectedCurr: item,
      showFiatModal: false,
      search: '',
      fiatList: this.state.actualFiatList,
      alchemyText: '',
      transakText: '',
      isTransakErr: false,
      isAlchemyErr: false,
    });
    //this.checkAlchemyStatus(this.props.selectedCoin, item)
  }
  /* *********************************************************** updateSearch ********************************************************************** */
  updateSearch(text) {
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.searchFiat(text);
    }, 1000);
  }

  /* *********************************************************** searchFiat ********************************************************************** */
  searchFiat(text) {
    if (text == '') {
      return this.setState({ fiatList: this.state.actualFiatList });
    } else {
      const arr = this.state.actualFiatList.filter(res => res?.country_code.toLowerCase().includes(text.toLowerCase()) || res?.country_name.toLowerCase().includes(text.toLowerCase()) || res?.fiat_currency.toLowerCase().includes(text.toLowerCase()));
      return this.setState({ fiatList: arr });
    }
  }

  /* *********************************************************** getValue ********************************************************************** */
  getValue = bal => {
    if (bal > 0) {
      const NewBal = bal < 0.000001 ? toFixedExp(bal, 8) : bal < 0.0001 ? toFixedExp(bal, 6) : toFixedExp(bal, 4);
      return NewBal;
    } else return '0.0000';
  };

  /* *********************************************************** onPressTransak ********************************************************************** */
  onPressTransak = () => {
    this.setState({
      selectedTransak: true,
      selectedAlchemy: false,
      disabled: false,
      buttontext: LanguageManager.buySell.sell,
      receivingAmount: this.state.transakAmount,
    });
  };

  /* *********************************************************** onPressAlchemy ********************************************************************** */
  onPressAlchemy = () => {
    this.setState({
      selectedTransak: false,
      selectedAlchemy: true,
      disabled: false,
      buttontext: LanguageManager.buySell.sell,
      receivingAmount: this.state.alchemyAmount,
    });
    this.checkAlchemyStatus(this.props.selectedCoin, this.state.selectedCurr);
  };

  /* *********************************************************** checkAlchemyStatus ********************************************************************** */
  checkAlchemyStatus(item, fiat) {
    const { buySell } = LanguageManager;
    this.setState({ isLoading: true });
    const data = {
      symbol: item.coin_symbol?.toUpperCase(),
      alchemy_network: item?.coin_family == 1 ? 'BSC' : item?.coin_family == 3 ? 'BTC' : item?.coin_family == 2 ? 'ETH' : item?.coin_family == 6 ? 'TRX' : 'MATIC',
      fiat: fiat?.fiat_currency || 'USD',
    };
    this.props.getBuySellStatus(data).then(res => {
      const response = res.on_off_ramp_coin_data;
      this.setState({ isLoading: false });
      if (response) {
        if (response.sell_enable == 1) {
          return this.setState({ buttontext: buySell.sell, minAmount: toFixedExp(response.min_sell_amount, 4), maxAmount: toFixedExp(response.max_sell_amount, 4) });
        } else
          return this.setState({ buttontext: buySell.exchangePairIsNotSupported, disabled: false });
      }
    }).catch(err => {
      this.setState({
        isLoading: false,
        buttontext: buySell.exchangePairIsNotSupported,
        disabled: true,
      });
      console.log('chk buysell status err::::::', err);
    });
  }
  render() {
    const { walletMain, sendTrx, buySell } = LanguageManager;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header BackButtonText={`${this.props.typeOfSwap?.toLowerCase() == 'buy' ? buySell.buy : buySell.sell} ${this.props.selectedCoin?.coin_symbol.toUpperCase()}`} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
        <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg, paddingHorizontal: 23 }}>
          <View style={styles.ViewStyle1}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText }]}>{buySell.payment}</Text>
              </View>

              <SelectCurrencyNew
                value={this.state.amount}
                disabled={true}
                item={this.props.selectedCoin}
                fromBuy={true}
                placeholder={'0.00'}
                onChangeNumber={value => {
                  this.setState({ text: '', disabled: false });
                  this.onChangeNumber(value);
                }}
              />
              <Text allowFontScaling={false} style={[styles.txtTitle1, { color: ThemeManager.colors.lightText }]}>{sendTrx.Balance}<Text allowFontScaling={false} style={[styles.txtTitle1, { color: ThemeManager.colors.settingsText }]}>{' '}{this.getValue(this.props.selectedCoin.balance)}{' '}{this.props.selectedCoin.coin_symbol.toUpperCase()}</Text></Text>
              <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.lightText, marginTop: 15 }]}>{walletMain.receive}</Text>
              <BuyItem
                disabled={true}
                value={this.state.receivingAmount}
                item={this.state.selectedCurr}
                onPressCoin={() => this.setState({ search: '', showFiatModal: true })}
                placeholder={'0.00'}
              />
              <ItemRamp
                isSelectedTransak={this.state.selectedTransak}
                isSelectedAlchemy={this.state.selectedAlchemy}
                onPressTransak={() => this.onPressTransak()}
                onPressAlchemy={() => this.onPressAlchemy()}
                transakText={this.state.transakText}
                alchemyText={this.state.alchemyText}
                isAlchemyErr={this.state.isAlchemyErr}
                isTransakErr={this.state.isTransakErr}
                minAmount={this.state.minAmount}
                maxAmount={this.state.maxAmount}
              />
            </View>
          </View>

          <View style={{ justifyContent: 'flex-end', flex: 1 }}>
            <Text allowFontScaling={false} style={[styles.txtTitle2, { color: Colors.lossColor }]}>{this.state.text}</Text>
            {this.state.disabled ? (
              <View style={[styles.sendBtnStyle, { backgroundColor: ThemeManager.colors.settingBg }]}>
                <Text allowFontScaling={false} style={[styles.sendBtnTextStyle]}>{this.state.buttontext}</Text>
              </View>
            ) : (
              <Button
                disabled={this.state.disabled}
                onPress={() => this.onSell()}
                myStyle={{ marginTop: 20 }}
                buttontext={this.state.buttontext}
              />
            )}
          </View>
        </View>
        {/* *********************************************************** MODAL FOR EXISTING COINS ********************************************************************** */}
        <ModalCoinList
          title={buySell.selectCountry}
          fromAlchemy={true}
          showSearch={true}
          openModel={this.state.showFiatModal}
          handleBack={() => { this.setState({ showFiatModal: false, search: '' }) }}
          list={this.state.fiatList}
          onPress={item => { this.onPressFiatItem(item) }}
          pressClear={() => this.setState({ search: '', fiatList: this.state.actualFiatList })}
          onChangeNumber={text => { this.setState({ search: text, fromSearch: true }, () => this.updateSearch(text)) }}
          search={this.state.search}
          fromSearch={true}
        />

        <LoaderView isLoading={this.state.isLoading} />
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
          />
        )}
      </View>
    );
  }
}
export default connect(null, {
  getFiatSupportedList,
  getBuySellStatus,
  getConversionAlchemy,
  getOnOffRampFiatList,
  getConversionRamp,
})(SellNew);
