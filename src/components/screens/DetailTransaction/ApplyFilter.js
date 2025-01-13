import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { ThemeManager } from '../../../../ThemeManager';
import { Fonts, Images } from '../../../theme';
import { AppAlert, Button, FilterList, Header, HeaderMain } from '../../common';
import FastImage from 'react-native-fast-image';
import DatePicker from 'react-native-date-picker';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import moment from 'moment';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { LanguageManager } from '../../../../LanguageManager';
import { getData } from '../../../Utils/MethodsUtils';
import { heightDimen, widthDimen } from '../../../Utils';
import { BlurView } from '@react-native-community/blur';


class ApplyFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: '',
      imgUri: '',
      selectedIndex: null,
      showCoinList: false,
      selectedCoin: LanguageManager.detailTrx?.all,
      Status: LanguageManager.detailTrx?.all,
      fromDate: '',
      ToDate: '',
      typeOfTxn: LanguageManager.detailTrx?.all,
      todaysDate: new Date(),
      showFromDatePicker: false,
      showToDatePicker: false,
      minimumDate: '',
      showAlertDialog: false,
      alertTxt: '',
      disabled: false,
      chainSelectDisable: Singleton.getInstance().isMakerWallet,
      themeSelected: '',
      isCoinListSelected: false,
      coinList: { list: [LanguageManager.detailTrx?.all, 'ETH', 'BNB', 'TRX', 'BTC', 'SOL', 'POL', "TICS"], type: 'coinlist' }
    };
  }
  componentDidMount() {
    if (Singleton.getInstance().isMakerWallet) {
      getData(Constants.COIN_FAMILY_LIST).then((res) => {
        const parsedRes = res ? JSON.parse(res) : [];
        const coin = Constants.AssetList.find((val) => val.coin_family == parsedRes[0]);
        this.setState({
          selectedCoin: coin.coin_symbol,
          imgUri: coin.coin_image,
        });
      });
    } else {
      getData(Constants.MULTI_WALLET_LIST)
        .then(list => {
          let currentWallet = JSON.parse(list)
          currentWallet = currentWallet.find(res => res?.defaultWallet)
          if (currentWallet?.isPrivateKey) {
            const coin = Constants.AssetList.find((val) => val.coin_family == currentWallet?.coinFamily);
            this.setState({
              selectedCoin: coin.coin_symbol,
              imgUri: coin.coin_image,
              chainSelectDisable: true
            });
          }
        })
    }



    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      this.setState({ themeSelected: theme })
    })
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data ? data : 2 });
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showFromDatePicker: false,
        showToDatePicker: false,
        showAlertDialog: false,
        alertTxt: '',
        showCoinList: false,
        disabled: false,
      });
    });
    if (this.props.applyFilterObj) {
      const data = this.props.applyFilterObj;
      const { detailTrx, walletMain, referral } = LanguageManager;
      this.setState({
        imgUri: this.getCoinImage(data.coin_type),
        selectedCoin: data.coin_type == '' ? detailTrx?.all : data.coin_type,
        Status: data.status == '' ? detailTrx?.all : data.status.toLowerCase() == 'confirmed' ? detailTrx?.completed : data.status.toLowerCase() == 'pending' ? detailTrx?.pending : data.status.toLowerCase() == 'failed' ? detailTrx?.Failed : '',
        typeOfTxn: data.trnx_type == '' ? detailTrx?.all
          : data.trnx_type.toLowerCase() == 'dapp' ? detailTrx?.smartContractInteraction
            : data.trnx_type.toLowerCase() == 'swap' ? detailTrx?.swap
              : data.trnx_type.toLowerCase() == 'deposit' ? detailTrx?.Deposit
                : data.trnx_type.toLowerCase() == 'withdraw' ? detailTrx?.Withdraw
                  : data.trnx_type.toLowerCase() == 'buy' ? detailTrx?.Buy
                    : data.trnx_type.toLowerCase() == 'sell' ? detailTrx?.Sell
                      : data.trnx_type.toLowerCase() == 'cards' ? walletMain.cards
                        : data.trnx_type.toLowerCase() == 'level_upgrade' ? referral.levelUpgrade
                          : '',
        fromDate: data.date_from,
        ToDate: data.date_to,
      });
    }
  }

  /******************************************************************************************/
  getCoinImage(coin_type) {
    const image = coin_type == '' ? '' : coin_type?.toUpperCase() == 'TRX' ? Constants.TRX_Img : coin_type?.toUpperCase() == 'BNB' ? Constants.BSC_Img : coin_type?.toUpperCase() == 'ETH' ? Constants.ETH_Img : coin_type?.toUpperCase() == 'BTC' ? Constants.BTC_Img : coin_type?.toUpperCase() == 'SOL' ? Constants.SOL_Img : coin_type?.toUpperCase() == 'POL' ? Constants.POL_Img : coin_type?.toUpperCase() == 'TICS' ? Constants.TICS_Img : Constants.MATIC_Img;
    return image;
  }

  /******************************************************************************************/
  getAddressArray(selectedCoin) {
    const ethAddress = Singleton.getInstance().defaultEthAddress;
    const btcAddress = Singleton.getInstance().defaultBtcAddress;
    const solAddress = Singleton.getInstance().defaultSolAddress;
    const trxAddress = Singleton.getInstance().defaultTrxAddress;
    console.log("btc address>>>", btcAddress);
    selectedCoin = selectedCoin?.toUpperCase()
    const addressArr = selectedCoin == 'BTC' ? [btcAddress] : selectedCoin == 'SOL' ? [solAddress] : selectedCoin == 'TRX' ? [trxAddress] : selectedCoin == 'MATIC' || selectedCoin == 'BNB' || selectedCoin == 'ETH' ? [ethAddress] : [ethAddress, btcAddress, solAddress, trxAddress];
    return addressArr;
  }

  /******************************************************************************************/
  getTypeOfTxn(typeOfTxn) {
    const { detailTrx, walletMain, referral } = LanguageManager;
    const txnTyp = typeOfTxn == detailTrx?.all ? ''
      : typeOfTxn == detailTrx?.smartContractInteraction ? 'dapp'
        : typeOfTxn == detailTrx?.swap ? 'swap'
          : typeOfTxn.toLowerCase() == detailTrx.Deposit?.toLowerCase() ? 'deposit'
            : typeOfTxn.toLowerCase() == detailTrx.Withdraw?.toLowerCase() ? 'withdraw'
              : typeOfTxn.toLowerCase() == detailTrx.Buy?.toLowerCase() ? 'buy'
                : typeOfTxn.toLowerCase() == detailTrx.Sell?.toLowerCase() ? 'sell'
                  : typeOfTxn.toLowerCase() == walletMain.cards?.toLowerCase() ? 'cards'
                    : typeOfTxn.toLowerCase() == referral.levelUpgrade?.toLowerCase() ? 'level_upgrade' : ''
    return txnTyp
  }

  /******************************************************************************************/
  onApply() {
    const { alertMessages, detailTrx, walletMain } = LanguageManager;
    if (this.state.fromDate != '' && this.state.ToDate == '') {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.selectToDate });
    } else if (this.state.fromDate == '' && this.state.ToDate != '') {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.selectFromDate });
    } else if (this.state.fromDate.toString() > this.state.ToDate.toString()) {
      return this.setState({ showAlertDialog: true, alertTxt: alertMessages.invalidDateFilter });
    } else {
      const { Status, selectedCoin, typeOfTxn, fromDate, ToDate } = this.state;
      const filterObj = {
        status: Status == detailTrx.all ? '' : Status.toLowerCase() == detailTrx?.completed.toLowerCase() ? 'confirmed' : Status.toLowerCase() == detailTrx?.pending.toLowerCase() ? 'pending' : Status.toLowerCase() == detailTrx?.Failed.toLowerCase() ? 'failed' : '',
        coin_type: selectedCoin?.toUpperCase() == detailTrx?.all?.toUpperCase() ? '' : selectedCoin,
        coin_family: selectedCoin?.toUpperCase() == 'ETH' ? [2] : selectedCoin?.toUpperCase() == 'BNB' ? [1] : selectedCoin?.toUpperCase() == 'POL' ? [4] : selectedCoin?.toUpperCase() == 'BTC' ? [3] : selectedCoin?.toUpperCase() == 'SOL' ? [5] : selectedCoin?.toUpperCase() == 'TRX' ? [6] : selectedCoin?.toUpperCase() == 'TICS' ? [7] : [1, 2, 3, 4, 5, 6, 7],
        trnx_type: this.getTypeOfTxn(typeOfTxn),
        date_from: fromDate,
        date_to: ToDate,
        addrsListKeys: this.getAddressArray(selectedCoin),
        page: 1,
        limit: 25,
      };
      console.log("filterObj>>>", selectedCoin, filterObj);

      this.setState({ disabled: false });
      this.props?.getFilter(filterObj);
    }
  }

  /******************************************************************************************/
  itemPressed(item, index, type) {
    this.setState({ selectedIndex: index, disabled: true });
    if (type == 'coinlist') {
      this.setState({ selectedCoin: item, imgUri: this.getCoinImage(item) });
    } else if (type == 'status') {
      this.setState({ Status: item });
    } else if (type == 'txnType') {
      this.setState({ typeOfTxn: item });
    }
    setTimeout(() => {
      this.setState({ showCoinList: false });
    }, 1000);
  }

  /******************************************************************************************/
  showDropDown(filterList, isCoinListSelected = false) {
    console.log("isCoinListSelected>>", isCoinListSelected);

    this.setState({
      list: filterList,
      selectedIndex: null,
      showCoinList: true,
      disabled: false,
      isCoinListSelected: isCoinListSelected
    });
  }


  /******************************************************************************************/
  render() {
    console.log('ayfsgtyasfdtatfds', this.state.imgUri)
    const { detailTrx, merchantCard, walletMain, referral } = LanguageManager;
    const status = { list: [detailTrx?.all, detailTrx?.completed, detailTrx?.pending, detailTrx?.Failed], type: 'status' };
    const txnType = { list: [detailTrx?.all, detailTrx?.Deposit, detailTrx?.Withdraw, detailTrx?.swap, detailTrx?.smartContractInteraction], type: 'txnType' };
    // const txnType = { list: [detailTrx?.all, detailTrx?.Deposit, detailTrx?.Withdraw, detailTrx?.Buy, detailTrx?.Sell, walletMain?.cards, referral.levelUpgrade, detailTrx?.smartContractInteraction], type: 'txnType' };
    // const txnType = { list: [detailTrx?.all, detailTrx?.Deposit, detailTrx?.Withdraw], type: 'txnType' };
    // const coinList = { list: [detailTrx?.all, 'ETH', 'BNB', 'TRX', 'BTC'], type: 'coinlist' };
    return (
      <View
        style={{ flex: 1, justifyContent: "flex-end", }}>
        <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={1} reducedTransparencyFallbackColor="white" />

        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            this.props.onClose();
          }} />

        <View style={{ paddingHorizontal: 20, backgroundColor: ThemeManager.colors.mainBgNew, borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
          {/* <HeaderMain BackButtonText={detailTrx.applyFilters} /> */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60 }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.headerTitle,
                { color: ThemeManager.colors.blackWhiteText },]}
            >
              {detailTrx.applyFilters}
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.onClose();
              }}
            >
              <Image
                style={{ resizeMode: "contain", height: 20, width: 20 }}
                source={ThemeManager.ImageIcons.cancel}
              />
            </TouchableOpacity>
          </View>
          <Text
            allowFontScaling={false}
            style={[
              styles.txtTitle,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {detailTrx.Coin}
          </Text>
          <TouchableOpacity
            disabled={this.state.chainSelectDisable}
            onPress={() => {
              this.showDropDown(this.state.coinList, true);
            }}
            style={[
              styles.ViewStyle,
              { borderColor: ThemeManager.colors.searchBorderColor },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              {this.state.selectedCoin?.toUpperCase() == detailTrx?.all?.toUpperCase() ? null : (
                <FastImage
                  style={[styles.tokenImage_style]}
                  source={{ uri: this.state.imgUri }}
                />
              )}
              <Text
                allowFontScaling={false}
                style={[
                  styles.coinText,
                  {
                    color: ThemeManager.colors.legalGreyColor,
                    marginLeft:
                      this.state.selectedCoin?.toUpperCase() == detailTrx?.all?.toUpperCase() ? 10 : 0,
                    textTransform: 'uppercase'
                  },
                ]}
              >
                {this.state.selectedCoin}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.imgStyle}>
              {/* <Image style={{ tintColor: ThemeManager.colors.colorVariation }} source={ThemeManager.colors.dropDown} /> */}
              <Image
                style={{
                  resizeMode: "contain",
                  tintColor: ThemeManager.colors.qrCodeColor,
                }}
                source={ThemeManager.ImageIcons.dropDown}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* ----------------------------------------------------------------------- */}
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.txtTitle,
                  { color: ThemeManager.colors.blackWhiteText, },
                ]}
              >
                {detailTrx.Status}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.showDropDown(status);
                }}
                style={[
                  styles.ViewStyle1,
                  { borderColor: ThemeManager.colors.searchBorderColor },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textStyle,
                    { color: ThemeManager.colors.legalGreyColor },
                  ]}
                >
                  {this.state.Status}
                </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    tintColor: ThemeManager.colors.qrCodeColor,
                  }}
                  source={ThemeManager.ImageIcons.dropDown}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.txtTitle,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {detailTrx.typeOfTransaction}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.showDropDown(txnType);
                }}
                style={[
                  styles.ViewStyle1,
                  { borderColor: ThemeManager.colors.searchBorderColor },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textStyle,
                    {
                      color: ThemeManager.colors.legalGreyColor,
                      fontFamily: Fonts.dmMedium,
                    },
                  ]}
                >
                  {this.state.typeOfTxn == detailTrx?.smartContractInteraction
                    ? this.state.typeOfTxn.substring(0, 10) + "..."
                    : this.state.typeOfTxn}
                </Text>
                <Image
                  style={{
                    resizeMode: "contain",
                    tintColor: ThemeManager.colors.qrCodeColor,
                  }}
                  source={ThemeManager.ImageIcons.dropDown}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ----------------------------------------------------------------------- */}
          <Text
            allowFontScaling={false}
            style={[
              styles.txtTitle,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {detailTrx.dateRange}
          </Text>
          <View style={{ flexDirection: "row", }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showFromDatePicker: true });
                }}
                style={[
                  styles.ViewStyle1,
                  { borderColor: ThemeManager.colors.searchBorderColor },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textStyle,
                    {
                      color: ThemeManager.colors.legalGreyColor,
                    },
                  ]}
                >
                  {this.state.fromDate == "" ? "From" : this.state.fromDate}
                </Text>
                <Image
                  style={{
                    tintColor: ThemeManager.colors.qrCodeColor,
                    resizeMode: "contain",
                    height: 19,
                    width: 18,
                  }}
                  source={Images.calendar}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ showToDatePicker: true });
                }}
                style={[
                  styles.ViewStyle1,
                  { borderColor: ThemeManager.colors.searchBorderColor },
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.textStyle,
                    {
                      color: ThemeManager.colors.legalGreyColor,
                    },
                  ]}
                >
                  {this.state.ToDate == "" ? "To" : this.state.ToDate}
                </Text>
                <Image
                  style={{
                    tintColor: ThemeManager.colors.qrCodeColor,
                    resizeMode: "contain",
                    height: 19,
                    width: 18,
                  }}
                  source={Images.calendar}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: 20, justifyContent: "flex-end", marginBottom: 40 }}>
            <Button
              onPress={() => this.onApply()}
              buttontext={merchantCard.apply}
            />
          </View>


        </View>


        {/* ********************************************************Modal for from Date******************************************************* */}
        <DatePicker
          modal
          theme={
            this.state.themeSelected == 1
              ? Platform.OS == "android"
                ? "auto"
                : "dark"
              : "light"
          }
          mode="date"
          open={this.state.showFromDatePicker}
          dateFormat="DD-MM-YYYY"
          date={new Date()}
          maximumDate={this.state.todaysDate}
          confirmText="Confirm"
          onConfirm={(date) => {
            this.setState({
              minimumDate: date,
              fromDate: moment(date).format("YYYY-MM-DD"),
              showFromDatePicker: false,
            });
          }}
          onCancel={() => {
            this.setState({ showFromDatePicker: false });
          }}
          androidVariant="iosClone"
          style={{ marginVertical: Platform.OS == "android" ? 20 : 5 }}
        />

        {/* ********************************************************Modal for To Date******************************************************* */}
        <DatePicker
          theme={
            this.state.themeSelected == 1
              ? Platform.OS == "android"
                ? "auto"
                : "dark"
              : "light"
          }
          modal
          mode="date"
          open={this.state.showToDatePicker}
          dateFormat="DD-MM-YYYY"
          date={new Date()}
          minimumDate={this.state.minimumDate}
          maximumDate={this.state.todaysDate}
          confirmText="Confirm"
          onConfirm={(date) => {
            this.setState({
              ToDate: moment(date).format("YYYY-MM-DD"),
              showToDatePicker: false,
            });
          }}
          onCancel={() => {
            this.setState({ showToDatePicker: false });
          }}
          androidVariant="iosClone"
          style={{ marginVertical: Platform.OS == "android" ? 20 : 5 }}
        />

        {/* /****************************************************************************************** */}
        <FilterList
          disabled={this.state.disabled}
          selectedIndex={this.state.selectedIndex}
          onPress={(item, index, type) => {
            this.itemPressed(item, index, type);
          }}
          list={this.state.list || this.state.coinList}
          openModel={this.state.showCoinList}
          isCoinListSelected={this.state.isCoinListSelected}
          onPressIn={() => this.setState({ showCoinList: false })}
        />

        {/* /****************************************************************************************** */}
        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}
      </View>
    );
  }
}
export default ApplyFilter;
const styles = StyleSheet.create({
  ViewStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 55,
    alignItems: 'center',
    borderRadius: 15,
  },
  imgStyle: {
    width: 10,
    height: 5,
    alignSelf: 'center',
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.dmSemiBold,
    textTransform: "capitalize"
  },
  txtTitle: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    marginTop: 15,
    marginBottom: 5,
  },
  txtTitle1: {
    fontSize: 14,
    fontFamily: Fonts.dmRegular,
  },
  tokenImage_style: {
    width: 25,
    height: 25,
    borderRadius: 30,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginLeft: 10,
    resizeMode: 'cover',
  },
  ViewStyle: {
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 55,
    alignItems: 'center',
  },
  coinText: {
    fontSize: 16,
    fontFamily: Fonts.dmMedium,
    color: ThemeManager.colors.text_Color,
    paddingLeft: 10,
    alignSelf: 'center',
  },
  ViewStyle1: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    height: 55,
    justifyContent: 'space-between',
    position: 'relative',
    marginRight: 7,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  textStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 16,
    textTransform: 'capitalize',
    marginRight: 5,
  },
});
