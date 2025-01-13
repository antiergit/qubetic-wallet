import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  BackHandler,
  Animated,
} from 'react-native';
import {
  getPriceAlert,
  deletePriceAlert,
  getCurrencyPref,
} from '../../../Redux/Actions';
import {
  CommaSeprator1,
  getData,
  saveData,
} from '../../../Utils/MethodsUtils';
import styles from './PriceAlertStyle';
import { Button, Header, AppAlert, HeaderMain } from '../../common';
import { Colors, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { connect } from 'react-redux';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import { LanguageManager } from '../../../../LanguageManager';

const rowSwipeAnimatedValues = {};
Array(500).fill('').forEach((_, i) => { rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0) });

class PriceAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priceAlertList: [],
      showAlertDialog: false,
      alertTxt: '',
      page: 1,
      id: '',
      limit: 100,
      currencyList: [],
      showAlertDialogConfirm: false,
      alertTxtConfirm: '',
      rowMap: '',
      rowKey: '',
      selectedIndex: undefined,
      selectedItem: '',
      showSuccess: false,
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialogConfirm: false,
        alertTxtConfirm: '',
        showAlertDialog: false,
        alertTxt: '',
        showSuccess: false,
      });
    });
    this.manageRows();
    this.props.navigation.addListener('didFocus', () => {
      this.backhandle = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
      console.log('didfocus:::::: priceALert', Actions.currentScene);
      this.manageRows();
      this.fetchList();
    });
    this.props.navigation.addListener('didBlur', () => {
      console.log('didblur:::::::');
      this.manageRows();
      console.log('REMOVED blur');
    });
    this.getCurrencyList();
    getData('PriceAlertList').then(PriceAlertList => {
      PriceAlertList ? this.setState({ priceAlertList: JSON.parse(PriceAlertList) }) : this.setState({ priceAlertList: [] });
    });
  }

  /******************************************************************************************/
  handleBackButtonClick = () => {
    console.log('%%%%%%%%%%%%%%%%%%%%% ADDED back priceAlert');
    if (Actions.currentScene == 'CreatePriceAlert') {
      Actions.pop();
      return true;
    } else {
      Singleton.bottomBar?.navigateTab('Settings');
      Actions.jump('Settings');
      return true;
    }
  };

  /******************************************************************************************/
  componentWillUnmount() {
    console.log('%%%%%%%% unmount', Actions.currentScene);
    this.backhandle?.remove();
  }

  /******************************************************************************************/
  manageRows() {
    this.openRowRef?.manuallyOpenAllRows(0);
    setTimeout(() => {
      this.openRowRef?.manuallyOpenAllRows(0);
    }, 1200);
  }

  /******************************************************************************************/
  getCurrencyList() {
    this.props.getCurrencyPref().then(async res => {
      console.log('getCurrencyPref===>>>', res);
      let finalData = [];
      res.map(element => {
        finalData.push({
          currency_symbol: element.currency_symbol,
          currency_code: element.currency_code
        });
      });
      this.setState({ currencyList: finalData });
      saveData('currencyList', JSON.stringify(res));
    })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  /******************************************************************************************/
  fetchList() {
    const data = {
      wallet_address: Singleton.getInstance().defaultEthAddress,
      page: 1,
      limit: 100,
      fiat_type: Singleton.getInstance().CurrencySelected,
    };
    this.props.getPriceAlert({ data }).then(res => {
      if (res.length > 0) {
        setTimeout(() => {
          this.openRowRef?.manuallyOpenAllRows(0);
        }, 1000);
        res.map((item, index) => { item.key = `${index}` });
      }
      this.setState({ priceAlertList: res });
      saveData('PriceAlertList', JSON.stringify(res));
    }).catch(err => {
      console.log('chk err::::', err);
      this.setState({ showAlertDialog: true, alertTxt: err });
    });
  }

  /******************************************************************************************/
  renderItem = ({ item }) => {
    const currSymbol = this.state.currencyList.find(res => res?.currency_code?.toLowerCase() == item?.fiat_type?.toLowerCase());
    return (
      <View style={{ backgroundColor: ThemeManager.colors.Mainbg, borderBottomWidth: 1, borderBottomColor: ThemeManager.colors.dividerColor }}>
        <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
          {item.coin_data?.coin_image ? (
            <Image style={[styles.imgStyle, { backgroundColor: ThemeManager.colors.borderUnderLine }]} source={{ uri: item.coin_data.coin_image }} />) : (
            <View style={[styles.imgViewStyle, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
              <Text allowFontScaling={false} style={{ color: 'white' }}>{item?.coin_data?.coin_name?.substring(0, 1) ? item?.coin_data?.coin_name?.substring(0, 1) : ''}</Text>
            </View>
          )}
          <View style={styles.ViewStyle}>
            <Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.TextColor }]}>
              {item.coin_data?.coin_name}
              {item.coin_data?.token_type != null && (<Text allowFontScaling={false} style={[styles.titleTextStyle, { color: ThemeManager.colors.greytoken_type, fontSize: 12 }]}>{item.coin_data?.coin_family == 1 ? ' | BEP20' : item.coin_data?.coin_family == 2 ? ' | ERC20' : item.coin_data?.coin_family == 6 ? ' | TRC20' : item.coin_data?.coin_family == 4 ? ' | POL ERC20' : ''}</Text>)}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text allowFontScaling={false} style={[styles.txtSmall, { color: ThemeManager.colors.subTextColor }]}>{parseFloat(item?.price_in_usd_per_unit) > 0 ? CommaSeprator1(parseFloat(item?.coin_data?.fiat_price_data?.value), 2) : '0.00'}{' '}{Singleton.getInstance().CurrencySelected}{' '}</Text>
              {item?.percentage?.toString().includes('-') ? (
                <View style={styles.viewStyle2}>
                  <Image style={styles.imgStyle1} source={Images.loss} />
                  <Text allowFontScaling={false} style={[styles.txtSmall, { color: Colors.lossColor, paddingLeft: 2 }]}>{item?.percentage ? item?.percentage.toFixed(2).toString().replace(/[-]/g, '') : 0.0}{' '}%</Text>
                </View>
              ) : (
                <View style={styles.viewStyle2}>
                  <Image style={styles.imgStyle1} source={Images.gain} />
                  <Text allowFontScaling={false} style={[styles.txtSmall, { color: Colors.profitColor, paddingLeft: 2 }]}>{item?.percentage ? (item?.percentage).toFixed(2) : 0.0} %</Text>
                </View>
              )}
            </View>
          </View>
          <Text allowFontScaling={false} style={[styles.txtValue, { color: ThemeManager.colors.TextColor }]}>{currSymbol?.currency_symbol}{CommaSeprator1(item?.price, 4)}</Text>
        </View>
      </View>
    );
  };

  /******************************************************************************************/
  closeItem = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  /******************************************************************************************/
  deleteItem = () => {
    const { selectedItem, selectedIndex } = this.state;
    const rowMap = selectedIndex;
    const rowKey = selectedItem?.item?.key;
    this.props.deletePriceAlert(selectedItem?.item?.id).then(() => {
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.priceAlertDeletedSuccessfully,
        showSuccess: true,
      });
      this.closeItem(rowMap, rowKey);
      const newData = this.state.priceAlertList;
      const prevIndex = this.state.priceAlertList.findIndex(item => item.key === rowKey);
      newData.splice(prevIndex, 1);
      this.setState({ priceAlertList: newData, rowKey: '', rowMap: '' });
      this.fetchList();
    }).catch(err => {
      this.setState({ showAlertDialog: true, alertTxt: err });
    });
  };

  /******************************************************************************************/
  onItemOpen = () => { };

  /******************************************************************************************/
  onPressDlt(item, index) {
    this.setState({
      selectedItem: item,
      selectedIndex: index,
      showAlertDialogConfirm: true,
      alertTxtConfirm: LanguageManager.alertMessages.WantToDeleteThisPriceAlert,
    });
  }

  /******************************************************************************************/
  renderHiddenItem = (item, index) => (
    <View style={[styles.rowBack, { backgroundColor: ThemeManager.colors.DarkRed }]}>
      <TouchableOpacity style={[styles.viewClose, { backgroundColor: ThemeManager.colors.DarkRed }]} onPress={() => this.onPressDlt(item, index)}>
        <Image style={{ tintColor: 'white' }} source={ThemeManager.ImageIcons.deleteIcon} />
      </TouchableOpacity>
    </View>
  );

  /******************************************************************************************/
  backCallBack() {
    Singleton.bottomBar?.navigateTab('Settings');
    Actions.currentScene != 'Settings' && Actions.jump('Settings');
  }

  /******************************************************************************************/
  render() {
    const { priceAlert, addressBook } = LanguageManager;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <HeaderMain
          backCallBack={() => this.backCallBack()}
          BackButtonText={priceAlert.priceAlert}

        />
        <View style={{ marginHorizontal: 23, marginTop: 10, flex: 1 }}>
          <SwipeListView
            disableRightSwipe
            bounces={false}
            ref={ref => { this.openRowRef = ref }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return (
                <View style={styles.ViewStyle1}>
                  <Image style={{ alignSelf: 'center' }} source={ThemeManager.ImageIcons.noPriceAlert} />
                </View>
              );
            }}
            data={this.state.priceAlertList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index + ''}
            rightOpenValue={-70}
            previewRowKey={'0'}
            previewOpenValue={-40}
            closeOnScroll={true}
            closeOnRowPress={true}
            renderHiddenItem={this.renderHiddenItem}
          />
        </View>
        <View style={{ marginHorizontal: 23 }}>
          <Button
            onPress={() => { this.props.coinList.length > 0 ? Actions.currentScene != 'CreatePriceAlert' && Actions.CreatePriceAlert({ themeSelected: this.props?.themeSelected }) : this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.enableCoinsToAddPriceAlerts }); }}
            buttontext={priceAlert.createPriceAlert}
          />
        </View>

        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false, showSuccess: false }) }}
          />
        )}

        {this.state.showAlertDialogConfirm && (
          <ConfirmAlert
            text={addressBook.yes}
            alertTxt={this.state.alertTxtConfirm}
            hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }, () => this.closeItem(this.state.selectedIndex, this.state.selectedItem?.item?.key)) }}
            ConfirmAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }); this.deleteItem() }}
          />
        )}
      </View>
    );
  }
}
const mapStateToProp = state => {
  const { coinList } = state.walletReducer;
  return { coinList };
};
export default connect(mapStateToProp, {
  getPriceAlert,
  deletePriceAlert,
  getCurrencyPref,
})(PriceAlert);
