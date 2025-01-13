/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, BackHandler } from 'react-native';
import styles from './CreatePriceAlertStyle';
import {
  Button,
  Header,
  InputCustom,
  AppAlert,
  LoaderView,
  ModalCoinList,
  HeaderMain,
} from '../../common';
import { Colors, Fonts, Images } from '../../../theme/';
import { ThemeManager } from '../../../../ThemeManager';
import { ViewChange } from './ViewChange';
import { CustomCongratsModel } from '../../common/CustomCongratsModel';
import { connect } from 'react-redux';
import * as Constants from '../../../Constants';
import { addPriceAlert, getCoinList } from '../../../Redux/Actions';
import {
  CommaSeprator1,
  exponentialToDecimal,
  removeComma,
  toFixed,
  toFixedExp,
} from '../../../Utils/MethodsUtils';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';


class CreatePriceAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModel: false,
      activeType: false,
      activeTypeDrop: false,
      PercentValue: undefined,
      showCongrats: false,
      showAlertDialog: false,
      alertTxt: '',
      priceAlertValue: '',
      assetList: [],
      selectedItem: '',
      selectedPercentValue: undefined,
      isLoading: false,
      loadList: false,
      totalRecords: '',
      page: 1,
      limit: 100,
      search: '',
      dataObj: {
        page: 1,
        limit: 100,
        search: '',
        fiat_type: Singleton.getInstance().CurrencySelected,
      },
      fromSearch: false,
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: '',
        showCongrats: false,
        showModel: false,
        priceAlertValue: '',
      });
    });
    this.props.navigation.addListener('didFocus', () => {
      this.backhandle = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      this.setState({
        PercentValue: undefined,
        selectedPercentValue: undefined,
        activeType: false,
        activeTypeDrop: false,
        selectedItem: '',
        priceAlertValue: '',
      });
      this.fetchList(this.state.dataObj);
      this.getVal();
    });
    this.unfocus = this.props.navigation.addListener('didBlur', event => {
      this.setState({
        PercentValue: undefined,
        selectedPercentValue: undefined,
        activeType: false,
        activeTypeDrop: false,
        selectedItem: '',
        priceAlertValue: '',
      });
      this.setState({ showCongrats: false, showModel: false });
    });
  }

  /******************************************************************************************/
  handleBackButtonClick() {
    console.log('createpriceAlert::::::back');
    Actions.pop();
    return true;
  }

  /******************************************************************************************/
  componentWillUnmount() {
    console.log('createpriceAlert::::::componentWillUnmount');
    this.backhandle?.remove();
  }

  /******************************************************************************************/
  fetchList(data, fromPagination = false) {
    this.setState({ isLoading: true });
    data.fiat_type = Singleton.getInstance().CurrencySelected;
    setTimeout(() => {
      this.props.getCoinList({ data }).then(res => {
        if (res.data.length > 0) {
          this.setState({
            isLoading: false,
            assetList: fromPagination ? this.state.assetList.concat(res.data) : res.data,
            selectedItem: fromPagination ? this.state.assetList[0] : res.data[0],
            totalRecords: res.meta.total,
            loadList: true
          });
        } else {
          this.setState({
            isLoading: false,
            assetList: fromPagination ? this.state.assetList : [],
            selectedItem: ''
          });
        }
      }).catch(err => {
        console.log('chk err of getCoinList::::::', err);
        this.setState({ isLoading: false });
      });
    }, 150);
  }

  /******************************************************************************************/
  getValue = async (item, index, isDrop) => {
    const { selectedItem } = this.state;
    const priceVal = this.getValuee(selectedItem?.fiat_price_data?.value);
    const FiatVal = await removeComma(priceVal);
    const value = (FiatVal * item.amount) / 100;
    const remainingVal = this.state.activeTypeDrop == true ? FiatVal - value : parseFloat(FiatVal) + parseFloat(value);
    const PriceAlertVal = this.getFiatValue(remainingVal);
    this.setState({
      activeType: isDrop == true ? false : true,
      activeTypeDrop: isDrop == true ? true : false,
      selectedPercentValue: item.amount,
      PercentValue: index,
      priceAlertValue: PriceAlertVal.toString(),
    });
  };

  /******************************************************************************************/
  async getVal() {
    const { selectedItem } = this.state;
    const priceVal = this.getValuee(selectedItem?.fiat_price_data?.value);
    const FiatVal = await removeComma(priceVal);
    const value = (FiatVal * this.state.selectedPercentValue) / 100;
    const remainingVal = this.state.activeTypeDrop == true ? FiatVal - value : parseFloat(FiatVal) + parseFloat(value);
    console.log(isNaN(remainingVal));
    const PriceAlertVal = this.getFiatValue(remainingVal);
    this.setState({ priceAlertValue: isNaN(remainingVal) ? '' : PriceAlertVal.toString() });
  }

  /******************************************************************************************/
  async createPriceAlert() {
    const { alertMessages } = LanguageManager;
    const { selectedItem } = this.state;
    const priceVal = this.getValuee(selectedItem?.fiat_price_data?.value);
    const FiatVal = await removeComma(priceVal);
    const priceAlertValue = this.getFiatValue(this.state.priceAlertValue);
    if (this.state.priceAlertValue.trim().length == 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterAmount });
    } else if (this.state.priceAlertValue <= 0) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidAmount });
    } else if (isNaN(this.state.priceAlertValue)) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.pleaseEnterValidAmount });
    } else {
      if (this.state.activeType == false && this.state.activeTypeDrop == false) {
        if (FiatVal.toString() == priceAlertValue.toString()) {
          return this.setState({ showAlertDialog: true, alertTxt: alertMessages.valueMustBeGreaterLessThan + ' ' + `${FiatVal}` });
        } else {
          const isGreater = parseFloat(FiatVal) > parseFloat(priceAlertValue);
          if (isGreater) {
            const percent = parseFloat((parseFloat(FiatVal) - parseFloat(priceAlertValue)) / FiatVal) * 100;
            this.addPriceAlert(toFixedExp(percent, 4), true);
          } else {
            const percent = parseFloat((parseFloat(priceAlertValue) - parseFloat(FiatVal)) / FiatVal) * 100;
            this.addPriceAlert(toFixed(percent, 4), false);
          }
        }
      } else {
        if (FiatVal.toString() == toFixedExp(priceAlertValue, 2).toString()) {
          return this.setState({ showAlertDialog: true, alertTxt: alertMessages.valueMustBeGreaterLessThan + ' ' + `${FiatVal}` });
        } else {
          this.addPriceAlert(toFixedExp(this.state.selectedPercentValue, 4), this.state.activeTypeDrop == true ? true : false);
        }
      }
    }
  }

  /******************************************************************************************/
  addPriceAlert(percent, isNegative) {
    this.setState({ isLoading: true });
    const item = this.state.selectedItem;
    let data = {
      wallet_address: Singleton.getInstance().defaultEthAddress,
      coin_symbol: item.coin_symbol,
      coin_name: item.coin_name,
      coin_family: item.coin_family,
      coin_image: item.coin_image,
      percentage: isNegative == true ? '-' + percent : '+' + percent,
      price_in_usd_per_unit: item?.fiat_price_data?.value,
      token_address: item.token_address,
      alert_price: this.state.priceAlertValue,
      fiat_type: Singleton.getInstance().CurrencySelected,
    };
    this.props.addPriceAlert({ data }).then(res => {
      this.setState({ isLoading: false, showCongrats: true });
    }).catch(err => {
      this.setState({
        isLoading: false,
        showCongrats: false,
        showAlertDialog: true,
        alertTxt: err,
      });
    });
  }

  /******************************************************************************************/
  itemPressed(item) {
    this.setState({ selectedItem: item, showModel: false }, () => this.state.selectedPercentValue ? this.getVal() : null);
    this.setState({ search: '' });
  }

  /******************************************************************************************/
  onPressRise() {
    this.setState({ activeType: true, activeTypeDrop: false }, () => {
      this.getVal();
    });
  }

  /******************************************************************************************/
  onPressDrop() {
    this.setState({ activeType: false, activeTypeDrop: true }, () => {
      this.getVal();
    });
  }

  /******************************************************************************************/
  onChangeText(value) {
    if (value.includes(',')) value = value.replace(',', '.');
    if (value == '.') value = '0.';
    if (Constants.ONE_DECIMAL_REGEX.test(value)) {
      this.setState({
        selectedPercentValue: undefined,
        priceAlertValue: value,
        PercentValue: undefined,
        activeType: false,
        activeTypeDrop: false,
      });
    }
  }

  /******************************************************************************************/
  dismissModal() {
    Actions.currentScene != 'PriceAlert' && Actions.PriceAlert({ themeSelected: this.props.themeSelected });
    this.setState({ showCongrats: false });
  }

  /******************************************************************************************/
  onLoadEnd() {
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.assetList.length != this.state.totalRecords) {
          console.log('here::::', 1);
          const data = {
            fiat_type: Singleton.getInstance().CurrencySelected,
            search: this.state.search,
            page: this.state.page,
            limit: this.state.limit,
          };
          this.fetchList(data, true);
        } else {
          console.log('here::::', 11);
        }
      });
    }
  }

  /******************************************************************************************/
  pressClear() {
    this.setState({ search: '', page: 1 }, () =>
      this.fetchList(this.state.dataObj),
    );
  }

  /******************************************************************************************/
  onChangeNumber(text) {
    this.setState({ search: text, fromSearch: true });
    this.updateSearch();
  }

  /******************************************************************************************/
  updateSearch() {
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getSearchList();
    }, 1000);
  }

  /******************************************************************************************/
  getSearchList() {
    let data = {
      fiat_type: Singleton.getInstance().CurrencySelected,
      search: this.state.search,
      page: 1,
      limit: this.state.limit
    };
    this.fetchList(data);
  }

  /******************************************************************************************/
  openList() {
    this.fetchList(this.state.dataObj);
    this.setState({ page: 1, search: '', showModel: true });
  }

  /******************************************************************************************/
  getValuee(bal1) {
    const bal = bal1 ? exponentialToDecimal(bal1) : '0.00';
    if (bal > 0) {
      const NewBal = bal < 0.000001 ? CommaSeprator1(bal, 8) : bal < 0.0001 ? CommaSeprator1(bal, 6) : CommaSeprator1(bal, 4);
      return NewBal;
    } else return '0.00';
  }

  /******************************************************************************************/
  getFiatValue(bal) {
    if (bal > 0) {
      const NewBal = bal < 0.000001 ? toFixedExp(bal, 9) : bal < 0.0001 ? toFixedExp(bal, 7) : toFixedExp(bal, 5);
      console.log('NewBal::::::', NewBal);
      return NewBal;
    } else return '0.00';
  }

  /******************************************************************************************/
  render() {
    const { merchantCard, priceAlert } = LanguageManager;
    const { selectedItem } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <HeaderMain BackButtonText={priceAlert.createPriceAlert} />
        <View style={{ flex: 1 }}>
          <View style={{ marginHorizontal: 20 }}>
            <View style={styles.ViewStyle}>
              <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.subTextColor }]}>{merchantCard.currency}</Text>
              <Text allowFontScaling={false} style={[styles.txtTitle, { color: Colors.successColor }]}>{priceAlert.currentPrice}{' '}{Singleton.getInstance().CurrencySymbol}{selectedItem ? this.getValuee(selectedItem?.fiat_price_data?.value) : '0.00'}</Text>
            </View>

            <TouchableOpacity onPress={() => { this.openList() }} style={{ ...styles.touchableStyle, borderColor: ThemeManager.colors.dividerColor }}>
              <View style={{ flexDirection: 'row' }}>
                {selectedItem?.coin_image ? (
                  <Image style={[styles.tokenImage_styleNew]} source={{ uri: selectedItem?.coin_image }} />
                ) : selectedItem?.coin_name ? (
                  <View style={[styles.tokenImage_stylee, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                    <Text allowFontScaling={false} style={[styles.tokenAbr_stylee, { color: 'white' }]}>{selectedItem?.coin_name?.charAt(0)}</Text>
                  </View>
                ) : (
                  <View style={[styles.tokenImage_stylee, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                    <Text allowFontScaling={false} style={[styles.tokenAbr_stylee, { color: 'white' }]}>{''}</Text>
                  </View>
                )}
                <Text allowFontScaling={false} style={[styles.coinText, { color: ThemeManager.colors.txtTitle }]}>
                  {selectedItem ? selectedItem?.coin_name : '--'}
                </Text>
              </View>
              <TouchableOpacity style={styles.imgStyle}>
                <Image source={ThemeManager.ImageIcons.dropDown} />
              </TouchableOpacity>
            </TouchableOpacity>

            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.subTextColor }]}>{priceAlert.alertType}</Text>

            {/* --------------------------------------------------------- */}
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { this.onPressRise() }} style={{ ...styles.ViewStyle1, borderColor: this.state.activeType == true ? ThemeManager.colors.settingsText : ThemeManager.colors.dividerColor }}>
                <Text allowFontScaling={false} style={{ paddingLeft: 15, color: this.state.activeType == true ? ThemeManager.colors.alertText : ThemeManager.colors.lightWhiteText, fontFamily: Fonts.dmRegular }}>{priceAlert.priceRisesTo}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.onPressDrop() }} style={{ ...styles.ViewStyle1, borderColor: this.state.activeTypeDrop == true ? ThemeManager.colors.settingsText : ThemeManager.colors.dividerColor }}>
                <Text allowFontScaling={false} style={{ paddingLeft: 15, color: this.state.activeTypeDrop == true ? ThemeManager.colors.alertText : ThemeManager.colors.lightWhiteText, fontFamily: Fonts.dmRegular }}>{priceAlert.priceDropsTo}</Text>
              </TouchableOpacity>
            </View>

            {/* ------------------------------------------------------- */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.subTextColor }]}>{priceAlert.addPrice}</Text>
            </View>
            <InputCustom
              showText={true}
              keyboardType={'decimal-pad'}
              placeHolder={`${Singleton.getInstance().CurrencySymbol} 0.00`}
              maxLength={10}
              placeholderTextColor={ThemeManager.colors.lightWhiteText}
              onChangeText={value => { this.onChangeText(value) }}
              value={this.state.priceAlertValue ? `${this.state.priceAlertValue}` : ''}
            />

            <View style={{ height: 50, marginVertical: 10 }}>
              <ViewChange
                isDrop={this.state.activeTypeDrop}
                percentValue={this.state.PercentValue}
                themeSelected={this.props.themeSelected}
                onPress={(item, index, isDrop) => { this.getValue(item, index, isDrop) }}
              />
            </View>
          </View>
        </View>

        {/* /****************************************************************************************** */}
        <View style={{ marginHorizontal: 23 }}>
          <Button
            buttontext={priceAlert.createPriceAlert}
            onPress={() => { this.createPriceAlert() }}
          />
        </View>

        {/* /****************************************************************************************** */}
        <ModalCoinList
          showSearch={true}
          onScroll={() => this.onLoadEnd()}
          list={this.state.assetList}
          openModel={this.state.showModel}
          handleBack={() => this.setState({ showModel: false, page: 1 })}
          onPress={item => { this.itemPressed(item) }}
          pressClear={() => this.pressClear()}
          onChangeNumber={text => this.onChangeNumber(text)}
          search={this.state.search}
          fromSearch={this.state.fromSearch}
        />

        {/* /****************************************************************************************** */}
        <CustomCongratsModel
          textStyle={{ ...styles.coinTextStyle, color: ThemeManager.colors.subTextColor }}
          title1={priceAlert.priceAlertCreated}
          title2={priceAlert.notificationWillSent}
          openModel={this.state.showCongrats}
          dismiss={() => { this.dismissModal() }}
        />
        {this.state.showAlertDialog && (
          <AppAlert alertTxt={this.state.alertTxt} hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }} />)}

        <LoaderView isLoading={this.state.isLoading} />
      </View>
    );
  }
}
export default connect(null, { addPriceAlert, getCoinList })(CreatePriceAlert);
