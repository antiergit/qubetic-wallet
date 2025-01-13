/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  FlatList,
  View,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  ImageBackground,
  StyleSheet,
  Modal,
} from 'react-native';
import {
  getCryptoAddress,
  getData,
  toFixedExp,
} from '../../../Utils/MethodsUtils';
import { Images } from '../../../theme';
import moment from 'moment';
import { ThemeManager } from '../../../../ThemeManager';
import { Header, AppAlert, Filter, HeaderMain } from '../../common';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { LoaderView } from '../../common/LoaderView';
import DropShadow from 'react-native-drop-shadow';
import styles from './DetailTransactionStyle';
import { getTransactionList, downloadcsv } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import RNFetchBlob from 'rn-fetch-blob';
import { DOWNLOAD_CSV } from '../../../EndPoint';
import { BASE_URL } from '../../../EndPoint';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import { BackHandler } from 'react-native';
import ApplyFilter from './ApplyFilter';


/******************************************************************************************/
function capitalizeFirstLetter(string) {
  // console.log('string.charAt(0).toUpperCase() + string.slice(1)::::::::::', string.charAt(0).toUpperCase() + string.slice(1))
  const text = string.charAt(0).toUpperCase() + string.slice(1);
  return text?.toLowerCase() == 'withdraw' ? LanguageManager.detailTrx.Withdraw : text?.toLowerCase() == 'deposit' ? LanguageManager.detailTrx.Deposit : text?.toLowerCase() == 'approve' ? LanguageManager.swapText.approval : text?.toLowerCase() == 'card fees' ? LanguageManager.detailTrx.cardFee : text?.toLowerCase() == 'card recharge' ? LanguageManager.detailTrx.cardRecharge : text;
}

/******************************************************************************************/
const Item = ({ item, orderData, Lastindex, address }) => (
  <TouchableOpacity
    disabled={!item.tx_id ? true : false}
    activeOpacity={0.7}
    onPress={() => {
      // if (item.type.toLowerCase() == 'cross_chain' && Singleton.getInstance().getStatus(item)?.toLowerCase() != 'failed') {
      //   return (Actions.currentScene != 'DetailCrossChain' && Actions.DetailCrossChain({ item: item }));
      // } else 

      if (item.coin_family == 1) {
        return Linking.openURL('https://bscscan.com/tx/' + item.tx_id);
      } else if (item.coin_family == 2) {
        return Linking.openURL('https://etherscan.io/tx/' + item.tx_id);
      } else if (item.coin_family == 3) {
        return Linking.openURL('https://live.blockcypher.com/btc/tx/' + item.tx_id);
      } else if (item.coin_family == 4) {
        return Linking.openURL('https://polygonscan.com/tx/' + item.tx_id);
      } else if (item.coin_family == 5) {
        return Linking.openURL('https://solscan.io/tx/' + item.tx_id);
      } else if (item.coin_family == 6) {
        return Linking.openURL('https://tronscan.org/#/transaction/' + item.tx_id);
      } else if (item.coin_family == 7) {
        return Linking.openURL('https://dev-explorer.qubetics.work/tx/' + item.tx_id);
      }
    }}
    style={{ paddingHorizontal: 23, marginBottom: Lastindex ? 50 : 10 }}>
    <View style={[styles.listStyle, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}>
      <View style={{
        paddingBottom: 15,
        paddingHorizontal: 20,
        paddingTop: 15,
      }}>
        <View style={[styles.ViewStyle1, { borderColor: ThemeManager.colors.dividerColorNew, }]}>

          <View style={styles.ViewStyle2}>
            {item.type == 'dapp' ? (
              <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.transactionIconBg }}>
                <Image style={{ alignSelf: 'center', height: 20, width: 20, resizeMode: 'contain', tintColor: ThemeManager.colors.blackWhiteText }} source={Images.wallet_backup} />
              </View>
            ) : (
              <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.transactionIconBg }}>
                <Image style={{ alignSelf: 'center', }} source={Singleton.getInstance().getStatusImage(item, address)} />
              </View>
            )}
            <View style={{ paddingLeft: 8, width: '74%' }}>
              {item.type == 'dapp' ? (
                <Text allowFontScaling={false} numberOfLines={2} style={[styles.fromValueStyle, { color: ThemeManager.colors.blackWhiteText }]}>{LanguageManager.detailTrx.smartContractExecution}</Text>) : (
                <Text allowFontScaling={false} numberOfLines={2} style={[styles.fromValueStyle, { color: ThemeManager.colors.blackWhiteText }]}>{item.type?.toLowerCase() == 'level_upgradation_fee' ? (LanguageManager.referral.levelUpgrade + ' (' + item?.referral_upgrade_level + ')') : item.type?.toLowerCase() == 'withdraw' && address?.toLowerCase() == item?.from_adrs?.toLowerCase() ? capitalizeFirstLetter(item?.type?.toLowerCase()?.replace('_', ' ')) : item?.type?.toLowerCase() == 'withdraw' && address?.toLowerCase() == item?.to_adrs?.toLowerCase() ? LanguageManager.detailTrx.Deposit : capitalizeFirstLetter(item?.type?.toLowerCase()?.replace('_', ' '))}{' '}{item?.amount < 0.000001 ? toFixedExp(item?.amount, 8) : item?.amount < 0.01 ? toFixedExp(item?.amount, 6) : toFixedExp(item?.amount, 6)}{' '}{item?.coin_data?.coin_symbol?.toUpperCase()}</Text>
              )}
              <Text allowFontScaling={false} style={[styles.transtimeStyle, { color: ThemeManager.colors.legalGreyColor, marginTop: Platform.OS == 'android' ? -5 : 0, }]}>{moment(item.created_at).format('ll')} |{' '}{moment(item.created_at).format('LT')}</Text>
            </View>
          </View>

          <View style={{ width: '25%', alignItems: 'flex-end' }}>
            {item.type.toLowerCase() == 'cross_chain' && Singleton.getInstance().getStatus(item)?.toLowerCase() != 'failed' ? (<View style={styles.touchableStyle}><Image style={[styles.imgStyle, { tintColor: ThemeManager.colors.colorVariationBorder }]} source={Images.dropdown} /></View>) : (
              <Text allowFontScaling={false} style={[styles.transStatusStyle, { textAlign: 'center', marginTop: 10, color: Singleton.getInstance().getStatusColor(item) }]}>{Singleton.getInstance().getStatus(item)}</Text>
            )}
          </View>
        </View>
        <View style={{ marginTop: 10 }} />

        {item.is_kyber == 1 && (<Text allowFontScaling={false} style={[styles.fromAddressStyle, { color: ThemeManager.colors.welcomeCommaName }]}>{LanguageManager.detailTrx.contractExcecutedSuccessfully}</Text>)}

        {item.from_adrs ? (<Text allowFontScaling={false} style={[styles.fromAddressStyle, { color: ThemeManager.colors.legalGreyColor }]}>{LanguageManager.browser.From} :{' '}</Text>) : null}

        {item.from_adrs ? (<Text allowFontScaling={false} numberOfLines={1} style={[styles.fromAddressStyleNew, { color: ThemeManager.colors.blackWhiteText }]}>{item.from_adrs}</Text>) : null}

        <Text allowFontScaling={false} style={[styles.fromAddressStyle, { color: ThemeManager.colors.legalGreyColor, marginTop: 10 }]}>{LanguageManager.browser.to} :{' '}</Text>
        <Text allowFontScaling={false} numberOfLines={1} style={[styles.fromAddressStyleNew, { color: ThemeManager.colors.blackWhiteText }]}>{item.to_adrs}</Text>

        <View style={{ flexDirection: 'row', marginTop: 5 }} />
      </View>
    </View>
  </TouchableOpacity>
);

class DetailTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertTxt: '',
      showAlertDialog: false,
      showFilter: false,
      isLoading: false,
      transactionList: [],
      applyFilterObj: '',
      loadList: false,
      totalRecords: '',
      page: 1,
      limit: 25,
      addressList: '',
      coinFamilyList: '',
      showSuccess: false,
    };
    this.scrollRef = React.createRef();
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({ showAlertDialog: false, alertTxt: '', showSuccess: false, showFilter: false });
    });
    getData('txnHistory').then(txnHistory => {
      if (txnHistory) this.setState({ transactionList: JSON.parse(txnHistory) });
    });
    console.log('this.props.selectedCoin::::::::', this.props.selectedCoin);
    this.focus = this.props.navigation.addListener('didFocus', event => {
      this.setState({ selectedIndex: null });
    });
    this.unfocus = this.props.navigation.addListener('didBlur', () => {
      this._scrollToTop();
    });
    getData(Constants.ADDRESS_LIST).then(addressList => {
      getData(Constants.COIN_FAMILY_LIST).then(coinFamilyList => {
        console.log("getlistfamily>>>> ", coinFamilyList)
        this.setState({
          addressList: JSON.parse(addressList),
          coinFamilyList: JSON.parse(coinFamilyList),
        });
        const getTxnReq = {
          status: '',
          coin_type: '',
          coin_family: JSON.parse(coinFamilyList),
          trnx_type: '',
          date_from: '',
          date_to: '',
          addrsListKeys: JSON.parse(addressList),
          page: 1,
          limit: this.state.limit,
        };
        this.fetchTxn(getTxnReq);
      });
    });
  }


  handleBackButtonClick() {
    Actions.pop()

    return true;
  };
  /******************************************************************************************/
  fetchTxn(getTxnReq, fromPagination = false) {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.props.getTransactionList({ getTxnReq }).then(res => {
        // console.log('chk res::::::', res);
        this.setState({ isLoading: false });
        if (res.data.length > 0) {
          this.setState({
            transactionList: fromPagination ? this.state.transactionList.concat(res.data) : res.data,
            totalRecords: res.meta.total,
            loadList: true,
            isLoading: false,
          });
        } else {
          this.setState({
            transactionList: fromPagination ? this.state.transactionList : [],
            isLoading: false,
          });
        }
      }).catch(e => {
        this.setState({ isLoading: false });
      });
    }, 150);
  }

  /******************************************************************************************/
  componentWillUnmount() {
    this.focus?.remove();
    this.unfocus?.remove();
  }

  /* *********************************************_scrollToTop***************************************** */
  _scrollToTop() {
    if (this.scrollRef !== null) {
      if (this.scrollRef.current !== null) {
        this.state.transactionList?.length > 0 &&
          this.scrollRef.current.scrollToIndex({ animated: true, index: 0 });
      }
    }
  }

  /******************************************************************************************/
  async onPressCsv() {
    console.log('USER_ID::::', await getData(Constants.USER_ID))
    if (this.state.transactionList.length == 0) {
      return this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.noHistoryToDownload,
      });
    } else {
      const userId = await getData(Constants.USER_ID);
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.actualDownload(`${BASE_URL}${DOWNLOAD_CSV}${parseInt(userId)}`);
      }, 150);
    }
  }

  /******************************************************************************************/
  async actualDownload(link) {
    let file = 'Demo_file';
    try {
      const { dirs: { DownloadDir, DocumentDir } } = RNFetchBlob.fs;
      const isIOS = Platform.OS === 'ios';
      const directoryPath = Platform.select({
        ios: DocumentDir,
        android: DownloadDir,
      });
      const filePath = `${directoryPath}/Key_Transactions_`;
      const fileExt = file.ext;
      const mimeType = '';
      if (fileExt === 'csv') {
        mimeType = 'application/csv';
      }
      const configOptions = Platform.select({
        ios: {
          fileCache: true,
          path: filePath + new Date().getTime() + '.csv',
          appendExt: fileExt,
          notification: true,
        },
        android: {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            mediaScannable: true,
            notification: true,
            path: filePath + new Date().getTime() + '.csv',
          },
        },
      });

      RNFetchBlob.config(configOptions).fetch('GET', link, { 'Content-Type': 'multipart/form-data', 'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en' }).then(resp => {
        console.log('chk resp:::::: history', resp);
        this.setState({ isLoading: false });
        if (isIOS) {
          RNFetchBlob.ios.openDocument(resp.data);
        } else {
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt: LanguageManager.alertMessages.fileSavedToDownloads,
            showSuccess: true,
          });
        }
      }).catch(e => {
        this.setState({ isLoading: false });
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  }

  /******************************************************************************************/
  getFilter = filterObj => {
    this.setState({ showFilter: false, applyFilterObj: filterObj, page: 1 });
    this.fetchTxn(filterObj);
  };

  /******************************************************************************************/
  openApplyFilter() {
    this.setState({ showFilter: true });
    // Actions.currentScene != 'ApplyFilter' && Actions.ApplyFilter({ getFilter: this.getFilter, applyFilterObj: this.state.applyFilterObj });
  }


  /******************************************************************************************/
  onLoadEnd() {
    console.log('loadList::::', this.state.loadList);
    if (this.state.loadList) {
      let page = this.state.page + 1;
      console.log('page::::', page);
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.transactionList.length != this.state.totalRecords) {
          console.log('here::::', 1);
          const data = {
            status: '',
            coin_type: '',
            coin_family: this.state.coinFamilyList,
            trnx_type: '',
            date_from: '',
            date_to: '',
            addrsListKeys: this.state.addressList,
            page: this.state.page,
            limit: this.state.limit,
          };
          let data1 = this.state.applyFilterObj || ''
          data1 ? data1.page = this.state.page : ''
          console.log('chk dat1::::::', data1)
          this.fetchTxn(this.state.applyFilterObj ? data1 : data, true);
        } else {
          console.log('here::::', 11);
        }
      });
    }
  }

  /******************************************************************************************/
  render() {
    const { merchantCard, detailTrx } = LanguageManager;
    return (
      <>
        <ImageBackground
          source={ThemeManager.ImageIcons.mainBgImgNew}
          style={{ flex: 1, justifyContent: 'space-between', backgroundColor: ThemeManager.colors.mainBgNew }}>
          <HeaderMain
            // backCallBack={()=>{  Actions.Main({ type: ActionConst.RESET });}}
            BackButtonText={merchantCard.transactionHistory}
            imgSecond={Images.filter}
            onPressIcon={() => { this.openApplyFilter(); }}
            imgSecondStyle={{ tintColor: ThemeManager.colors.blackWhiteText }}
            imgStyle1={{ tintColor: ThemeManager.colors.blackWhiteText }}
          />
          <FlatList
            ref={this.scrollRef}
            keyExtractor={(item, index) => index + ''}
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 15 }}
            data={this.state.transactionList}
            onEndReached={() => this.onLoadEnd()}
            onEndReachedThreshold={0.01}
            ListEmptyComponent={() => {
              return (
                <View style={styles.noData}>
                  <Text allowFontScaling={false} style={[styles.transactionHistoryTitle, { color: ThemeManager.colors.blackWhiteText }]}>{merchantCard.noTransactionHistoryFound}</Text>
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              return (
                <Item
                  Lastindex={index == this.state.transactionList.length - 1 ? true : false}
                  item={item}
                  themeSelected={this.props.themeSelected}
                  address={getCryptoAddress(item?.coin_family)}
                />
              );
            }}
          />
        </ImageBackground>
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false, showSuccess: false }) }}
          />
        )}
        <Modal
          visible={this.state.showFilter}
          onRequestClose={() => { this.setState({ showFilter: false }) }}
          transparent={true}
          animationType={'fade'}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <ApplyFilter
              getFilter={this.getFilter}
              applyFilterObj={this.state.applyFilterObj}
              onClose={() => { this.setState({ showFilter: false }) }}
            />
          </View>
        </Modal>
        <LoaderView isLoading={this.state.isLoading} />
      </>
    );
  }
}


export default connect(null, { getTransactionList, downloadcsv })(
  DetailTransaction,
);
