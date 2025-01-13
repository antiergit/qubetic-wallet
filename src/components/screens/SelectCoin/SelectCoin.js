import React, { Component } from "react";
import { View, Text, ImageBackground } from "react-native";
import styles from "./SelectCoinStyle";
import {
  Header,
  CoinList,
  InputtextSearch,
  LoaderView,
  AppAlert,
  HeaderMain,
} from "../../common";
import { ThemeManager } from "../../../../ThemeManager";
import { connect } from "react-redux";
import { requestCoinList } from "../../../Redux/Actions";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../../Constants";
import { LanguageManager } from "../../../../LanguageManager";
import { SearchToken } from "../../common/SearchToken";
import Singleton from "../../../Singleton";

class SelectCoin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      page: 1,
      limit: 25,
      loadList: false,
      totalRecords: "",
      coinList: [],
      showAlertDialog: false,
      alertTxt: "",
      dataObj: {
        search: "",
        page: 1,
        limit: 25,
      },
      isLoading: false,
      fromSearch: false,
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({ showAlertDialog: false, alertTxt: "" });
    });
    this.fetchList(this.state.dataObj);
    this.props.navigation.addListener("didFocus", (event) => {
      this.setState({ showAlertDialog: false, alertTxt: "", page: 1, limit: 25 });
      // this.setState({ showAlertDialog: false, alertTxt: "", search: "" });
      // this.fetchList(this.state.dataObj);
    });
  }


  fetchList(data1, fromPagination = false) {
    this.setState({ isLoading: true });
    console.log('chk action_type:::::', this.props.action_type);
    setTimeout(() => {
      if (this.props.action_type == 'send') {
        console.log("data 1 send>>>>>>>", data1);
        this.props.requestCoinList({ data1 }).then(response => {
          if (response.data.length > 0) {
            const newArr = response.data.filter(item => {
              return parseFloat(item.balance) > 0;
            });
            console.log('chk newAr::::::');
            this.setState({ coinList: fromPagination ? this.state.coinList.concat(newArr) : newArr, loadList: true, totalRecords: response?.meta?.total });
          } else {
            this.setState({
              coinList: fromPagination ? this.state.coinList : [],
            });
          }
          this.setState({ isLoading: false });
        }).catch(err => {
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt: err,
          });
        });
      } else if (this.props.action_type == 'receive') {
        console.log("data 1 receive>>>>>>>", data1);
        this.props.requestCoinList({ data1 }).then(response => {
          console.log("coin list receive>>>>>", response);
          if (response.data.length > 0) {
            this.setState({ coinList: fromPagination ? this.state.coinList.concat(response.data) : response.data, loadList: true, totalRecords: response?.meta?.total });
          } else {
            this.setState({ coinList: fromPagination ? this.state.coinList : [] });
          }
          this.setState({ isLoading: false });
        }).catch(err => {
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt: err,
          });
        });
      }
    }, 150);
  }


  /******************************************************************************************/
  // fetchList(data1, fromPagination = false) {
  //   this.setState({ isLoading: true });
  //   console.log("chk action_type:::::", this.props.action_type);
  //   setTimeout(() => {
  //     if (this.props.action_type == "send") {
  //       this.props
  //         .requestCoinList({ data1 })
  //         .then((response) => {


  //           if (response.data.length > 0) {

  //             let newArray = []
  //             response.data.map(data => {
  //               // if (data.coin_family != 3 ) {
  //                 newArray.push(data)
  //               // }
  //             });
  //             const newArr = response.data.filter((item) => {
  //               return parseFloat(item.balance) > 0;
  //             });
  //             console.log("chk newAr::::::");
  //             this.setState({
  //               coinList: fromPagination
  //                 ? this.state.coinList.concat(newArray)
  //                 : newArray,
  //               loadList: true,
  //               totalRecords: response?.meta?.total,
  //             });
  //           } else {
  //             this.setState({
  //               coinList: fromPagination ? this.state.coinList : [],
  //             });
  //           }
  //           this.setState({ isLoading: false });
  //         })
  //         .catch((err) => {
  //           this.setState({
  //             isLoading: false,
  //             showAlertDialog: true,
  //             alertTxt: err,
  //           });
  //         });
  //     } else if (this.props.action_type == "receive") {
  //       this.props
  //         .requestCoinList({ data1 })
  //         .then((response) => {
  //           if (response.data.length > 0) {

  //             let newArray = []
  //             response.data.map(data => {
  //               // if (data.coin_family != 3 ) {
  //                 newArray.push(data)
  //               // }
  //             });
  //             this.setState({
  //               coinList: fromPagination
  //                 ? this.state.coinList.concat(newArray)
  //                 : newArray,
  //               loadList: true,
  //               totalRecords: response?.meta?.total,
  //             });
  //           } else {
  //             this.setState({
  //               coinList: fromPagination ? this.state.coinList : [],
  //             });
  //           }
  //           this.setState({ isLoading: false });
  //         })
  //         .catch((err) => {
  //           this.setState({
  //             isLoading: false,
  //             showAlertDialog: true,
  //             alertTxt: err,
  //           });
  //         });
  //     }
  //   }, 150);
  // }



  // fetchList(data1, fromPagination = false) {
  //   this.setState({ isLoading: true });
  //   console.log('chk action_type:::::', this.props.action_type);
  //   setTimeout(() => {
  //     if (this.props.action_type == 'send') {
  //       this.props.requestCoinList({ data1 }).then(response => {
  //         if (response.data.length > 0) {
  //           const newArr = response.data.filter(item => {
  //             return parseFloat(item.balance) > 0;
  //           });
  //           console.log('chk newAr::::::');
  //           this.setState({ coinList: fromPagination ? this.state.coinList.concat(newArr) : newArr, loadList: true, totalRecords: response?.meta?.total });
  //         } else {
  //           this.setState({
  //             coinList: fromPagination ? this.state.coinList : [],
  //           });
  //         }
  //         this.setState({ isLoading: false });
  //       }).catch(err => {
  //         this.setState({
  //           isLoading: false,
  //           showAlertDialog: true,
  //           alertTxt: err,
  //         });
  //       });
  //     } else if (this.props.action_type == 'receive') {
  //       this.props.requestCoinList({ data1 }).then(response => {
  //         if (response.data.length > 0) {
  //           this.setState({ coinList: fromPagination ? this.state.coinList.concat(response.data) : response.data, loadList: true, totalRecords: response?.meta?.total });
  //         } else {
  //           this.setState({ coinList: fromPagination ? this.state.coinList : [] });
  //         }
  //         this.setState({ isLoading: false });
  //       }).catch(err => {
  //         this.setState({
  //           isLoading: false,
  //           showAlertDialog: true,
  //           alertTxt: err,
  //         });
  //       });
  //     }
  //   }, 150);
  // }

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
      search: this.state.search?.trim(),
      page: 1,
      limit: this.state.limit,
    };
    this.fetchList(data);
  }

  /******************************************************************************************/
  onLoadEnd = () => {
    console.log("chhchchchhc");
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.coinList?.length != this.state.totalRecords) {
          console.log("here::::", 1);
          const data = {
            search: "",
            page: this.state.page,
            limit: this.state.limit,
          };
          this.fetchList(data, true);
        } else {
          console.log("here::::", 11);
        }
      });
    }
  };

  /******************************************************************************************/
  render() {
    const { walletMain } = LanguageManager;
    return (
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <HeaderMain
          BackButtonText={`${this.props.action_type.toLowerCase() == "send"
            ? walletMain.send
            : this.props.action_type == "multiSender"
              ? walletMain.send
              : walletMain.receive
            }`}
        />

        {(this.state.coinList?.length > 0 ||
          this.state.search.length > 0 ||
          this.state.fromSearch == true) && (
            <View style={{ marginHorizontal: 20 }}>
              <SearchToken
                isIconsShow={false}
                manage={() => {
                  // this.manage();
                }}
                onSubmitEditing={(text) => {
                  this.updateSearch(this.state.search);
                }}
                value={this.state.search}
                onChangeText={(text) => {
                  this.setState({ search: text, fromSearch: true });
                  this.updateSearch(text);
                }}
              />
            </View>
          )}

        <View style={{ marginBottom: 22, flex: 1 }}>
          <View style={{ marginTop: 8 }}>
            {this.state.coinList?.length > 0 ? (
              <CoinList
                onEndReached={() => this.onLoadEnd()}
                coinList={this.state.coinList}
                tabType={this.props.tabType}
                selectCoin={this.props.selectCoin}
                action_type={this.props.action_type}
                themeSelected={this.props?.themeSelected}
                hideGraph={true}
                showTransactionHistory="false"
                showFooter={false}
                showViewAll={false}
                style={{ marginBottom: 20 }}
                isHideBalance={Singleton.getInstance().isHideBalance}
              />
            ) : (
              <Text
                allowFontScaling={false}
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {walletMain.Noasset}
              </Text>
            )}
          </View>
          <LoaderView isLoading={this.state.isLoading} />
        </View>

        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.setState({ showAlertDialog: false });
            }}
          />
        )}
      </ImageBackground>
    );
  }
}
const mapStateToProp = (state) => {
  const { coinList } = state.walletReducer;
  return { coinList };
};

export default connect(mapStateToProp, { requestCoinList })(SelectCoin);
