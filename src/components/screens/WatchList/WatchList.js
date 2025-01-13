import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  ImageBackground,
} from 'react-native';
import {
  CommaSeprator1,
  getCryptoAddress,
  getData,
} from '../../../Utils/MethodsUtils';
import {
  AppAlert,
  Button,
  InputtextSearch,
  LoaderView,
} from '../../common';
import { Colors, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { Actions } from 'react-native-router-flux';
import { getWatchList, updateWatchList } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import Singleton from '../../../Singleton';
import styles from './WatchListStyle';
import * as Constants from '../../../Constants';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import { getDimensionPercentage as dimen, widthDimen, heightDimen } from '../../../Utils';


class WatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      showAlertDialog: false,
      showAlertDialogConfirm: false,
      alertTxtConfirm: '',
      isFav: false,
      selectedIndex: null,
      page: 1,
      limit: 25,
      loadList: false,
      totalRecords: '',
      AssetList: [],
      search: '',
      tempArr: [],
      dataObj: {
        fiat_type: Singleton.getInstance().CurrencySelected,
        search: '',
        page: 1,
        limit: 25,
        wallet_address: [
          Singleton.getInstance().defaultEthAddress,
          Singleton.getInstance().defaultBtcAddress,
          Singleton.getInstance().defaultTrxAddress,
        ],
        // wallet_address: [Singleton.getInstance().defaultEthAddress, Singleton.getInstance().defaultBtcAddress, Singleton.getInstance().defaultLtcAddress],
        is_fav: 1,
        coin_family: [1, 2, 3, 6],
      },
      fromSearch: false,
      totalPages: '',
      coin_family: [1, 2, 3, 6],
    };
  }

  /******************************************************************************************/
  /******************************************************************************************/
  componentDidMount() {
    getData(Constants.COIN_FAMILY_LIST).then(coin_familyList => {
      this.setState({ coin_family: JSON.parse(coin_familyList) });
    });

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialogConfirm: false,
        showAlertDialog: false,
        alertTxt: '',
      });
    });
    this.props.navigation.addListener('didFocus', () => {
      this.setState({ fromSearch: false, search: '', page: 1 });
      getData(Constants.ADDRESS_LIST).then(coin_familyList => {
        console.log(' coin_familyList:::::::::: ', coin_familyList);
        this.setState({ wallet_address: JSON.parse(coin_familyList) });
        let addresses = JSON.parse(coin_familyList);
        const data = {
          fiat_type: Singleton.getInstance().CurrencySelected,
          search: this.state.search,
          page: 1,
          limit: 200,
          wallet_address: addresses,
          is_fav: 1,
          coin_family: this.state.coin_family,
        };
        this.getWatchlist(data, false);
      });
    });
    this.props.navigation.addListener('didBlur', () => {
      this.scrollListReftop?.scrollTo({ x: 0, y: 0, animated: true });
    });
  }

  /******************************************************************************************/
  getWatchlist(data, fromPagination = false) {
    this.setState({ isLoading: true });
    data.fiat_type = Singleton.getInstance().CurrencySelected;
    setTimeout(() => {
      console.log("pagination>>>", data)
      this.props.getWatchList({ data }).then(res => {
        console.log("datawatchlist length>>>", res.data.length);
        this.setState({
          AssetList: fromPagination ? this.state.AssetList.concat(res.data) : res.data,
          isLoading: false,
          totalPages: res.meta.pages,
          totalRecords: res.meta.total,
          loadList: true,
        });
      }).catch(err => {
        this.setState({
          alertTxt: err,
          isLoading: false,
          showAlertDialog: true,
          loadList: false,
        });
      });
    }, 150);
  }

  /******************************************************************************************/
  onPressBin(item) {
    this.setState({
      selectedItem: item,
      showAlertDialogConfirm: true,
      alertTxtConfirm: LanguageManager.alertMessages.wantToRemoveThisAssetFromWatchlist,
    });
  }

  /******************************************************************************************/
  delete() {
    this.setState({ isLoading: true, showAlertDialogConfirm: false });
    const { coin_id, coin_family } = this.state.selectedItem;
    const address = getCryptoAddress(coin_family);
    const Arr = [{ coin_id: coin_id.toString(), address: address, status: 0 }];
    let data = {
      data: Arr,
    };
    this.props.updateWatchList({ data }).then(res => {
      this.setState({ search: '' });
      this.getWatchlist({
        fiat_type: Singleton.getInstance().CurrencySelected,
        search: '',
        page: 1,
        limit: 25,
        wallet_address: [
          Singleton.getInstance().defaultEthAddress,
          Singleton.getInstance().defaultBtcAddress,
          Singleton.getInstance().defaultTrxAddress,
        ],
        // wallet_address: [Singleton.getInstance().defaultEthAddress, Singleton.getInstance().defaultBtcAddress, Singleton.getInstance().defaultLtcAddress],
        is_fav: 1,
        coin_family: [1, 2, 3, 6],
      });
    }).catch(err => {
      this.setState({ isLoading: false, showAlertDialog: true, alertTxt: err });
    });
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
      search: this.state.search?.trim(),
      page: 1,
      limit: this.state.limit,
      wallet_address: [
        Singleton.getInstance().defaultEthAddress,
        Singleton.getInstance().defaultBtcAddress,
        Singleton.getInstance().defaultTrxAddress
      ],
      is_fav: 1,
    };
    this.getWatchlist(data);
  }

  /******************************************************************************************/
  onLoadEnd = ({ }) => {
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.AssetList.length != this.state.totalRecords && this.state.page <= this.state.totalPages) {
          console.log('here::::', 1);
          const data = {
            fiat_type: Singleton.getInstance().CurrencySelected,
            search: this.state.search,
            page: this.state.page,
            limit: this.state.limit,
            wallet_address: [
              Singleton.getInstance().defaultEthAddress,
              Singleton.getInstance().defaultBtcAddress,
              Singleton.getInstance().defaultTrxAddress,
            ],
          };
          this.getWatchlist(data, true);
        } else {
          console.log('here::::', 11);
        }
      });
    }
  };

  /******************************************************************************************/
  render() {
    const { addressBook, walletMain, placeholderAndLabels, notifications } = LanguageManager;
    return !this.props.isVisible ? (
      <View />
    ) : (
      <>
        {(this.state.AssetList.length > 0 || this.state.search.length > 0 || this.state.fromSearch == true) && (
          <InputtextSearch
            style={{ width: Dimensions.get('screen').width - 40 }}
            placeholder={walletMain.search}
            returnKeyType={'done'}
            value={this.state.search}
            search={!this.state.search ? true : false}
            // clear={this.state.search ? true : false}
            pressClear={() => this.setState({ search: '', page: 1 }, () => this.getWatchlist(this.state.dataObj))}
            onChangeNumber={text => {
              this.setState({ search: text, fromSearch: true });
              this.updateSearch(text);
            }}
            onSubmitEditing={() => this.updateSearch(this.state.search)}
          />
        )}
        <ScrollView
          bounces={false}
          onScroll={({ nativeEvent }) => { this.onLoadEnd(nativeEvent) }}
          scrollEventThrottle={100}
          contentContainerStyle={{ paddingBottom: heightDimen(50) }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {this.state.AssetList.length > 0 ? (
              this.state.AssetList.map((item, index) => {
                return (
                  <View
                    style={[styles.ViewStyle, { marginBottom: index == this.state.AssetList.length - 1 ? 240 : 0, marginTop: heightDimen(10), backgroundColor: ThemeManager.colors.mnemonicsBg }]}
                  >

                    {/* <ImageBackground source={ThemeManager.ImageIcons.cardViewImg} key={index + ''} style={[styles.ViewStyle, { marginBottom: index == this.state.AssetList.length - 1 ? 240 : 0, marginTop: heightDimen(10) }]}> */}
                    <View style={styles.ViewStyle1}>
                      {item.coin_image ? (
                        <View style={[styles.ImgStyle, {}]}>
                          <Image style={[styles.ImgStyle2]} source={{ uri: item.coin_image }} />
                        </View>
                      ) : (
                        <View style={[styles.ImgStyle, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                          <Text allowFontScaling={false} style={[styles.coinSymbolStyle, { color: ThemeManager.colors.Text, textTransform: 'capitalize', paddingLeft: 0 }]}>{item.coin_name?.substring(0, 1)}</Text>
                        </View>
                      )}

                      <View style={{ marginLeft: 10 }}>
                        <Text allowFontScaling={false} style={{ ...styles.textStyle, color: ThemeManager.colors.blackWhiteText }}>
                          {item?.coin_name?.toString().length > 15 ? item?.coin_name?.substring(0, 13) + '...' : item.coin_name}
                          {item.is_token == 1 && (<Text allowFontScaling={false} style={[styles.titleTextStyle, { color: ThemeManager.colors.blackWhiteText, fontSize: dimen(14) }]}>{item.coin_family == 1 ? ' (BEP-20)' : item.coin_family == 2 ? ' (ERC-20)' : item.coin_family == 4 ? ' (POL ERC-20)' : item.coin_family == 5 ? ' (SPL)' : item.coin_family == 6 ? ' (TRC-20)' : ''}</Text>)}
                        </Text>
                        <View style={{ marginTop: 2, flexDirection: "row", alignItems: "center" }}>
                          <Text allowFontScaling={false} style={{ ...styles.textStyle1, color: ThemeManager.colors.legalGreyColor }}>{Singleton.getInstance().CurrencySymbol}{CommaSeprator1(item.fiat_price_data?.value, 2)}{' '}</Text>

                          <Text allowFontScaling={false} style={{ ...styles.textStyle1, color: item.fiat_price_data ? item.fiat_price_data?.price_change_percentage_24h >= 0 ? ThemeManager.colors.greenText : Colors.lossColor : ThemeManager.colors.greenText }}>
                            {item.fiat_price_data ? (item.fiat_price_data?.price_change_percentage_24h >= 0 ? "+" : "-") : ""}{item.fiat_price_data ? item?.fiat_price_data.price_change_percentage_24h?.toString().includes('-') ? parseFloat(item?.fiat_price_data.price_change_percentage_24h.toFixed(2).toString().replace(/[-]/g, '')).toFixed(2) : parseFloat(item.fiat_price_data?.price_change_percentage_24h).toFixed(2) : '0'}%
                          </Text>

                        </View>
                      </View>
                    </View>

                    <View style={[styles.ViewStyle1]}>
                      {/* <Image style={styles.ImgStyle1} source={item.fiat_price_data ? item.fiat_price_data?.price_change_percentage_24h >= 0 ? Images.gain : Images.loss : Images.gain} /> */}

                      <TouchableOpacity disabled={Singleton.getInstance().isMakerWallet} style={styles.binStyle} onPress={() => this.onPressBin(item)}>
                        <Image source={Images.deleteIcon} style={{ height: dimen(16), width: dimen(14), resizeMode: "contain" }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={[styles.emptyView1, { marginTop: this.state.fromSearch == true ? Dimensions.get('screen').height / 5.5 : Dimensions.get('screen').height / 4.5 }]}>
                <Image style={{ marginBottom: 20 }} source={Images.noContact} />

                <Text allowFontScaling={false} style={{ ...styles.textStyle, color: ThemeManager.colors.blackWhiteText }}>No record found</Text>
              </View>
            )}
          </View>

          {this.state.showAlertDialogConfirm && (
            <ConfirmAlert
              text={addressBook.yes}
              alertTxt={this.state.alertTxtConfirm}
              hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }) }}
              ConfirmAlertDialog={() => { this.delete() }}
            />
          )}

          {this.state.showAlertDialog && (
            <AppAlert
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
            />
          )}
        </ScrollView>

        <LoaderView customStyle={styles.customStyle} isLoading={this.state.isLoading} />

        <View style={styles.ViewStyle2}>
          <Button
            myStyle={{ width: Dimensions.get('screen').width - 40 }}
            onPress={() => Actions.currentScene != 'UpdateWatchList' && Actions.UpdateWatchList()}
            buttontext={LanguageManager.portfolio.addTokens}
          />
        </View>
      </>
    );
  }
}
export default connect(null, { getWatchList, updateWatchList })(WatchList);
