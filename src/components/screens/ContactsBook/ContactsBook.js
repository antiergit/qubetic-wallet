import React, { Component } from 'react';
import { View, Image, Text, FlatList, Modal, SafeAreaView, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import styles from './ContactsBookkStyle';
import { Fonts, Images } from '../../../theme/';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import {
  AppAlert,
  LoaderView,
  Header,
  InputtextSearch,
  AddressItem,
  AddresslModal,
  HeaderMain,
} from '../../common';
import { deleteAddressBookId, getAddressBook } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import * as Constants from '../../../Constants';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { getData } from '../../../Utils/MethodsUtils';
import Singleton from '../../../Singleton';
import { EventRegister } from 'react-native-event-listeners';
import { LanguageManager } from '../../../../LanguageManager';
import images from '../../../theme/Images';
import { BlurView } from '@react-native-community/blur';
import { getDimensionPercentage } from '../../../Utils';



class ContactsBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      isLoading: false,
      addressBook: [1, 2, 3, 4, 6],
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
      selected_Index: undefined,
      showView: false,
      limit: 10,
      page: 1,
      screen: '',
      totalrecord: 0,
      loadList: false,
      deleteId: 0,
      search: '',
      showContactlModal: false,
      selectedItem: '',
      coin_family_list: [],
      addressList: [],
      fromSearch: false,
    };
  }



  componentDidMount() {
    // BackHandler.addEventListener("hardwareBackPress",this.handleBackButtonClick);

    EventRegister.addEventListener(Constants.DOWN_lModal, () => {
      this.setState({
        showContactlModal: false,
        showAlertDialogConfirm: false,
        alertTxtConfirm: '',
        showAlertDialog: false,
        alertTxt: '',
      });
    });
    this.setState({
      page: 1,
      showView: false,
      addressList: [Singleton.getInstance().defaultEthAddress],
      coin_family_list: [this.props.coin_family],
    });
    this.getaddressBookList();
    this.props.navigation.addListener('didFocus', event => {
      this.setState({
        page: 1,
        showView: false,
        addressList: [Singleton.getInstance().defaultEthAddress],
        coin_family_list: [this.props.coin_family],
      });
      this.getaddressBookList();
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    });
  }

  handleBackButtonClick() {
    console.log("backhandler>>>>>>");
    Actions.pop()

    return true;
  };


  /******************************************************************************************/
  getaddressBookList() {
    getData(Constants.ADDRESS_LIST).then(addrs_list => {
      console.log('ajhsjahsajsh', addrs_list)
      const addressListKeys = JSON.parse(addrs_list);
      const data = {
        address: addressListKeys || this.state.addressList,
        coin_family: this.state.coin_family_list,
        limit: this.state.limit,
        page: 1,
        search: this.state.search,
      };
      this.hitApi(data, false);
    });
  }

  /******************************************************************************************/
  hitApi(data, fromPagination = false) {
    this.setState({ isLoading: true });
    this.props.getAddressBook({ data }).then(res => {
      console.log('res=======', res);
      if (res.data.length > 0) {
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
    })
      .catch(err => {
        this.setState({ showAlertDialog: true, alertTxt: err, isLoading: false });
      });
  }

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
  confirm_delete = (rowMap, rowKey, id) => {
    this.setState({ isLoading: true });
    const idName = this.state.id;
    this.props.deleteAddressBookId(rowKey).then(res => {
      this.setState({ isLoading: false });
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.contactDeletedSuccessfully,
        rowKey: null,
      });
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
      let newData = this.state.addressBook;
      let prevIndex = this.state.addressBook.findIndex(item => item.key === rowKey);
      newData.splice(prevIndex, 1);
      this.setState({ addressBook: newData, rowKey: null });
      this.getaddressBookList();
    }).catch(err => {
      this.setState({ showAlertDialog: true, alertTxt: err, rowKey: null });
    });
  };

  /******************************************************************************************/
  deleteItem = item => {
    this.setState({
      showAlertDialogConfirm: true,
      alertTxtConfirm: LanguageManager.alertMessages.doYouWantToDeleteContact,
      deleteId: item.id,
    });
  };

  /******************************************************************************************/
  callDeleteApi() {
    this.setState({ isLoading: true });
    const delId = this.state.deleteId;
    this.props.deleteAddressBookId(delId).then(res => {
      this.setState({ isLoading: false });
      console.log('delete succes==>', res);
      this.setState({
        showAlertDialog: true,
        alertTxt: LanguageManager.alertMessages.contactDeletedSuccessfully,
      });
      this.getaddressBookList();
    })
      .catch(err => {
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
    this.setState({ selectedIndex: index });
    if (this.state.selectedIndex != index) {
      this.setState({ showView: true });
    } else {
      if (this.state.showView == false) {
        this.setState({ showView: true });
        return;
      } else {
        this.setState({ showView: false });
        return;
      }
    }
  }

  /******************************************************************************************/
  // onPressView(item) {
  //   this.setState({showContactlModal: true, selectedItem: item });
  //   console.log('here');
  // }

  /******************************************************************************************/
  onPressItem(item, index) {
    this.setState({ selected_Index: index });
    setTimeout(() => {
      this.setState({ showContactlModal: false });
      this.props?.getAddress(item?.wallet_address);
      Actions.currentScene == 'ContactsBook' && Actions.pop();
    }, 800);
  }

  /******************************************************************************************/
  render() {
    const { placeholderAndLabels, addressBook } = LanguageManager;
    return (

      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={this.props.showAddressBookModal}
      // onRequestClose={props.handleBack}
      >

        <SafeAreaView style={{}} />

        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />

        <TouchableOpacity style={{ flex: 0.5, backgroundColor: "transparent" }} onPress={this.props.handleBack} />

        <View style={{
          flex: 0.5, backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,

          // flex: 0.6,
          backgroundColor: ThemeManager.colors.mainBgNew,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            },
            android: {
              elevation: 5,
            },
          }),
        }}>

          <>
            <View style={{ flexDirection: "row", marginTop: getDimensionPercentage(36), justifyContent: "space-between", marginHorizontal: 24 }}>
              <Text style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>
                Address Book
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={this.props.addbook}>
                  <Image source={Images.add} style={{ tintColor: ThemeManager.colors.blackWhiteText, width: 20, height: 20 }} />

                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.handleBack}>
                  <Image source={ThemeManager.ImageIcons.crossIconNew} style={{ resizeMode: "contain" }} />

                </TouchableOpacity>
              </View>


            </View>

            {(this.state.search.length > 0 || this.state.addressBook.length > 0 || this.state.fromSearch == true) && (
              <InputtextSearch
                placeholder={placeholderAndLabels.searchuser}
                value={this.state.search}
                search={!this.state.search ? true : false}
                // clear={this.state.search ? true : false}
                pressClear={() => this.setState({ search: '' }, () => this.getaddressBookList())}
                onChangeNumber={text => {
                  this.setState({ search: text, fromSearch: true }, () => this.updateSearch(text));
                }}
              />
            )}
            {/* {this.props?.ispop != true && this.state.addressBook.length > 0 && (<Text allowFontScaling={false} style={[styles.txtTitle, { color: ThemeManager.colors.newTitle }]}>{addressBook.saved}</Text>)} */}

            {/* /******************************************************************************************/}

            <FlatList
              bounces={false}
              showsVerticalScrollIndicator={false}
              data={this.state.addressBook}
              onEndReached={() => { this.onLoadEnd() }}
              onEndReachedThreshold={0.01}
              renderItem={({ item, index }) => {
                return (
                  <View key={index + ''} style={{ marginBottom: index == this.state.addressBook.length - 1 ? 30 : 0, }}>
                    <AddressItem
                      onPressView={() => this.props.onPressView(item)}
                      fromContact={true}
                      screen={this.state.screen}
                      item={item}
                      onPress={() => this.onPressDrop(index)}
                      selectedIndex={this.state.selectedIndex}
                      index={index}
                      showView={this.state.showView}
                      onPressBin={data => { this.deleteItem(data) }}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index + ''}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyView}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <Image source={ThemeManager.ImageIcons.noContact} />
                      <Text style={[styles.textStyle, {
                        color: ThemeManager.colors.blackWhiteText, marginTop: 15,
                        fontSize: 18,
                        lineHeight: 22,

                      }]}>
                        No records found
                      </Text>
                    </View>

                  </View>
                );
              }}
            />

          </>
        </View>



        <SafeAreaView style={{ backgroundColor: ThemeManager.colors.mainBgNew }} />
      </Modal>

    );
  }
}
export default connect(null, { getAddressBook, deleteAddressBookId })(ContactsBook);
