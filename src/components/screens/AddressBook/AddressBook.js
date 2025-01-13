import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  BackHandler,
} from 'react-native';
import {
  AppAlert,
  LoaderView,
  Header,
  InputtextSearch,
  AddressItem,
  HeaderMain,
  Button,
} from '../../common';
import {
  deleteAddressBookId,
  getAddressBook,
  deleteContact,
} from '../../../Redux/Actions';
import styles from './AddressBookStyle';
import { Images } from '../../../theme/';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import { connect } from 'react-redux';
import * as Constants from '../../../Constants';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { getData } from '../../../Utils/MethodsUtils';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';

const rowSwipeAnimatedValues = {};
Array(500).fill('').forEach((_, i) => { rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0) });

class AddressBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      isLoading: false,
      addressBook: [],
      alertTxt: '',
      showAlertDialog: false,
      walletAddress: '',
      walletName: '',
      coin_family: ' ',
      myWalletList: [],
      alertTxtConfirm: '',
      showAlertDialogConfirm: false,
      rowMap: null,
      rowKey: null,
      selectedIndex: undefined,
      showView: false,
      limit: 25,
      page: 1,
      screen: 'addressbook',
      totalrecord: 0,
      loadList: false,
      deleteId: 0,
      address_book_id: 0,
      search: '',
      coin_family_list: [],
      addressList: [],
      selectedIndexNew: null,
      selectedIndex1: undefined,
      selectedItem: '',
      showAlertDialogConfirm1: false,
      showSuccess: false,
      fromSearch: false,
    };
  }
  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialogConfirm1: false,
        showAlertDialogConfirm: false,
        showAlertDialog: false,
        alertTxt: '',
        showSuccess: false,
        isLoading: false
      });
    });
    this.manageRows();
    this.props.navigation.addListener('didFocus', event => {
      this.manageRows();
      getData(Constants.ADDRESS_LIST).then(addrs_list => {
        getData(Constants.COIN_FAMILY_LIST).then(coin_familyList => {

          this.setState({
            page: 1,
            showView: false,
            addressList: JSON.parse(addrs_list),
            coin_family_list: JSON.parse(coin_familyList),
          }, () => { this.getaddressBookList(); });

        });
      });
    });
  }
  componentWillUnmount() {
    this.setState({ isLoading: false })
  }

  handleBackButtonClick() {
    Actions.pop()

    return true;
  };

  /******************************************************************************************/
  manageRows() {
    this.openRowRef?.manuallyOpenAllRows(0);
    setTimeout(() => {
      this.openRowRef?.manuallyOpenAllRows(0);
    }, 1200);
  }

  /******************************************************************************************/
  getaddressBookList() {
    const data = {
      address: this.state.addressList,
      coin_family: this.state.coin_family_list,
      limit: this.state.limit,
      page: 1,
      search: this.state.search?.trim(),
    };
    this.hitApi(data, false);
  }

  /******************************************************************************************/
  hitApi(data, fromPagination = false) {
    this.setState({ isLoading: true });
    this.props.getAddressBook({ data }).then(res => {
      this.manageRows();
      if (res.data.length > 0) {
        res.data.map((item, index) => {
          item.key = `${index}`;
        });
        this.setState({
          isLoading: false,
          addressBook: fromPagination ? this.state.addressBook.concat(res.data) : res.data,
          totalrecord: res.meta.total,
          loadList: true,
        });
      } else {
        this.setState({
          isLoading: false,
          addressBook: fromPagination ? this.state.addressBook : [],
        });
      }
    }).catch(err => {
      this.setState({ showAlertDialog: true, alertTxt: err, isLoading: false });
    });
  }

  /******************************************************************************************/
  deleteRow = (item, rowMap) => {
    const rowKey = item.item?.id;
    this.props.deleteContact(rowKey).then(res => {
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.contactDeletedSuccessfully,
        showSuccess: true,
      });
      const data = {
        address: this.state.addressList,
        coin_family: this.state.coin_family_list,
        limit: this.state.limit,
        page: 1,
        search: this.state.search,
      };
      this.hitApi(data, false);
      this.closeRow(item.item?.key, rowMap);
    }).catch(err => {
      this.setState({ showAlertDialog: true, alertTxt: err });
    });
  };

  /******************************************************************************************/
  closeRow = (rowKey, rowMap) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  /******************************************************************************************/
  onLoadEnd = () => {
    if (this.state.loadList) {
      const page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.addressBook.length != this.state.totalrecord) {
          const data = {
            address: this.state.addressList,
            coin_family: this.state.coin_family_list,
            limit: this.state.limit,
            page: this.state.page,
            search: this.state.search,
          };
          this.hitApi(data, true);
        } else {
          console.log('here::::', 11);
        }
      });
    }
  };

  /******************************************************************************************/
  maskAddress(address) {
    const a = address.slice(0, 8);
    const b = address.slice(-4);
    return a + '...' + b;
  }

  /******************************************************************************************/
  deleteItem = item => {
    this.setState({
      showAlertDialogConfirm: true,
      alertTxtConfirm: LanguageManager.alertMessages.doYouWantToDeleteContact,
      deleteId: item.id,
      address_book_id: item.address_book_id,
    });
  };

  /******************************************************************************************/
  callDeleteApi() {
    this.setState({ isLoading: true });
    const data = {
      id: this.state.deleteId,
      address_book_id: this.state.address_book_id,
    };
    this.props.deleteAddressBookId({ data }).then(res => {
      this.setState({ isLoading: false });
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.contactDeletedSuccessfully,
        showSuccess: true,
        showView: false,
      });
      this.getaddressBookList();
    }).catch(err => {
      this.setState({ showAlertDialog: true, alertTxt: err, isLoading: false });
    });
  }

  /******************************************************************************************/
  updateSearch() {
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.getaddressBookList();
    }, 1000);
  }

  /******************************************************************************************/
  iconPressed() {
    Actions.currentScene != 'AddContact' && Actions.AddContact({ themeSelected: this.props.themeSelected, isFrom: this.props.symbol });
  }

  /******************************************************************************************/
  onPressBin() {
    this.setState({
      showAlertDialogConfirm: true,
      alertTxtConfirm: LanguageManager.alertMessages.doYouWantToDeleteTheContact,
    });
  }

  /******************************************************************************************/
  onPressDrop(index) {
    this.manageRows();
    this.setState({ selectedIndex: index });
    if (this.state.selectedIndex != index) {
      this.setState({ showView: true });
    } else {
      if (this.state.showView == false) {
        this.setState({ showView: true });
        return;
      } else {
        this.setState({ showView: false });
        this.manageRows();
        return;
      }
    }
  }

  /******************************************************************************************/
  onPressDlt(item, index) {
    this.setState({
      selectedItem: item,
      selectedIndex1: index,
      showAlertDialogConfirm1: true,
      alertTxtConfirm: LanguageManager.alertMessages.doYouWantToDeleteTheContact,
    });
    this.manageRows();
  }

  /******************************************************************************************/
  closeItem = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  /******************************************************************************************/
  render() {
    const { addressBook, walletMain } = LanguageManager;
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <View style={{ flex: 1 }}>
          <HeaderMain
            onPressIcon={() => this.iconPressed()}
            // imgSecond={this.props?.ispop != true && this.state.addressBook.length == 0 && Images.add}
            imgSecond={this.state.addressBook.length > 0 ? Images.add : null}

            BackButtonText={addressBook.addressBook}
            imgSecondStyle={{ tintColor: ThemeManager.colors.blackWhiteText }}
          />
          <>
            {(this.state.search.length > 0 || this.state.addressBook.length > 0 || this.state.fromSearch == true) && (
              <InputtextSearch
                placeholder={addressBook.searchByName}
                value={this.state.search}
                search={!this.state.search ? true : false}
                // clear={this.state.search ? true : false}
                pressClear={() => this.setState({ search: '' }, () => this.getaddressBookList())}
                onChangeNumber={text => {
                  this.setState({ search: text, fromSearch: true }, () =>
                    this.updateSearch(text),
                  );
                }}
              />
            )}
            {this.props?.ispop != true && this.state.addressBook.length > 0 && (<Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.blackWhiteText }]}>{addressBook.saved}</Text>)}
            <View style={{ flex: 1 }}>

              <SwipeListView
                disableRightSwipe
                ref={ref => { this.openRowRef = ref }}
                onScroll={() => { this.onLoadEnd() }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index + ''}
                ListEmptyComponent={() => {
                  return this.state.isLoading ? null : <View style={styles.emptyView}>
                    <View style={{ alignItems: 'center', justifyContent: "center", flex: this.state.fromSearch ? 0.9 : 1 }}>
                      <Image style={{ marginBottom: 20 }} source={Images.noContact} />
                      <Text style={[styles.emptyTxt, { color: ThemeManager.colors.blackWhiteText }]}>No record found</Text>
                    </View>
                    <Button buttontext={"Add Address"} onPress={() => this.iconPressed()} />
                  </View>

                }}
                data={this.state.addressBook}
                renderItem={({ item, index }) => {
                  return (
                    // <View key={index + ''} style={{ backgroundColor: ThemeManager.colors.Mainbg, marginBottom: this.state.addressBook.length - 1 == index ? 25 : 0 }}>
                    <AddressItem
                      screen={this.state.screen}
                      item={item}
                      onPress={() => this.onPressDrop(index)}
                      selectedIndex={this.state.selectedIndex}
                      index={index}
                      themeSelected={this.props.themeSelected}
                      showView={this.state.showView}
                      onPressBin={data => {
                        this.deleteItem(data);
                      }}
                    />
                    // </View>
                  );
                }}
                rightOpenValue={-80}
                previewRowKey={'0'}
                previewOpenValue={-30}
                closeOnScroll={true}
                closeOnRowPress={true}
                renderHiddenItem={(item, index) => {
                  return (
                    <View style={styles.rowBack}>
                      <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => { this.onPressDlt(item, index) }}>
                        <Animated.View style={[styles.trashBox, { transform: [{ scale: rowSwipeAnimatedValues[item?.item?.key].interpolate({ inputRange: [45, 90], outputRange: [0, 1], extrapolate: 'clamp' }) }] }]}>
                          <Image style={{ height: 25, width: 25, resizeMode: 'contain', tintColor: ThemeManager.colors.legalGreyColor }} source={ThemeManager.ImageIcons.deleteIcon} />
                        </Animated.View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                onSwipeValueChange={swipeData => {
                  const { key, value } = swipeData;
                  rowSwipeAnimatedValues[key].setValue(Math.abs(value));
                }}
                swipeGestureBegan={key => {
                  console.log('fdfdfdfd');
                  this.setState({ showView: false, selectedIndexNew: key });
                }}
                swipeGestureEnded={(key, endedData) => {
                  this.setState({
                    selectedIndexNew:
                      endedData.direction == 'left' ? key : null,
                  });
                }}
              />
            </View>
          </>
        </View>
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false, showSuccess: false }) }}
          />
        )}
        {this.state.isLoading == true && (
          <LoaderView isLoading={this.state.isLoading} />
        )}
        {this.state.showAlertDialogConfirm && (
          <ConfirmAlert
            text={addressBook.yes}
            alertTxt={this.state.alertTxtConfirm}
            hideAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }) }}
            ConfirmAlertDialog={() => { this.setState({ showAlertDialogConfirm: false }); this.callDeleteApi() }}
          />
        )}
        {this.state.showAlertDialogConfirm1 && (
          <ConfirmAlert
            text={addressBook.yes}
            alertTxt={this.state.alertTxtConfirm}
            hideAlertDialog={() => { this.setState({ showAlertDialogConfirm1: false }, () => this.closeItem(this.state.selectedIndex1, this.state.selectedItem?.item?.key)) }}
            ConfirmAlertDialog={() => {
              this.setState({ showAlertDialogConfirm1: false });
              this.deleteRow(this.state.selectedItem, this.state.selectedIndex1);
            }}
          />
        )}
      </ImageBackground>
    );
  }
}
export default connect(null, {
  getAddressBook,
  deleteAddressBookId,
  deleteContact,
})(AddressBook);
