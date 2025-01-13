import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { Colors, Images } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
import {
  AppAlert,
  Button,
  Header,
  HeaderMain,
  InputtextSearch,
  LoaderView,
} from "../../common";
import { getWatchList, updateWatchList } from "../../../Redux/Actions";
import { connect } from "react-redux";
import Singleton from "../../../Singleton";
import styles from "./WatchListStyle";
import { CommaSeprator1, getCryptoAddress } from "../../../Utils/MethodsUtils";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../../Constants";
import { LanguageManager } from "../../../../LanguageManager";
import { SearchToken } from "../../common/SearchToken";
import images from "../../../theme/Images";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../layouts/responsive";
import { heightDimen, widthDimen, getDimensionPercentage as dimen, } from "../../../Utils";

import { Actions } from "react-native-router-flux";

class UpdateWatchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false, //true,
      showAlertDialog: false,
      isFav: false,
      selectedIndex: null,
      page: 1,
      limit: 25,
      loadList: false,
      totalRecords: "",
      AssetList: [],
      search: "",
      tempArr: [],
      dataObj: {
        fiat_type: Singleton.getInstance().CurrencySelected,
        search: "",
        page: 1,
        limit: 25,
        wallet_address: [
          Singleton.getInstance().defaultEthAddress,
          Singleton.getInstance().defaultBtcAddress,
          Singleton.getInstance().defaultTrxAddress,
          Singleton.getInstance().defaultSolAddress,
        ],
        // wallet_address: [Singleton.getInstance().defaultEthAddress, Singleton.getInstance().defaultBtcAddress, Singleton.getInstance().defaultLtcAddress]
      },
      isPop: false,
      showSuccess: false,
      fromSearch: false,
      totalPages: "",
      // selectedItem: '',
      // selectedItemIndex: null,
      // isSelect: null,
      // isSelectedItem: false
    };
  }
  componentDidMount() {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({
        showAlertDialog: false,
        alertTxt: "",
        showSuccess: false,
      });
    });
    this.props.navigation.addListener("didFocus", () => {
      this.setState({ search: "", isPop: false });
      this.getWatchlist(this.state.dataObj);
      // this.setState({ selectedItem: '', selectedItemIndex: null, isSelect: null, isSelectedItem: false })
    });
  }

  /******************************************************************************************/
  getWatchlist(data, fromPagination = false) {
    console.log("chk getWatchlist list res:::::", data);
    data.fiat_type = Singleton.getInstance().CurrencySelected;
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.props
        .getWatchList({ data })
        .then((res) => {

          let newArray = []
          res.data.map(data => {
            // if (data.coin_family != 3) {
            newArray.push(data)
            // }
          });
          this.setState({
            AssetList: fromPagination
              ? this.state.AssetList.concat(newArray)
              : newArray,
            isLoading: false,
            totalPages: res.meta.pages,
            totalRecords: res.meta.total,
            loadList: true,
          });




        })
        .catch((err) => {
          console.log("chk wallet list err:::::", err);
          this.setState({
            alertTxt: err,
            isLoading: false,
            showAlertDialog: true,
            loadList: false,
            showSuccess: false,
          });
        });
    }, 150);
  }

  /******************************************************************************************/
  iconPressed() {
    const { tempArr } = this.state;
    if (tempArr.length > 0) {
      this.setState({ isLoading: true });
      setTimeout(() => {
        let Arr = [];
        tempArr.map((item) => {
          const data = {};
          data["coin_id"] = item.coin_id;
          data["address"] = getCryptoAddress(item.coin_family);
          data["status"] = item.watchlist_data == null ? 0 : 1;
          Arr.push(data);
        });
        let data = {
          data: Arr,
        };
        this.props
          .updateWatchList({ data })
          .then((res) => {
            this.setState({
              isLoading: false,
              showAlertDialog: true,
              alertTxt:
                LanguageManager.alertMessages.watchlistUpdatedSuccessfully,
              isPop: true,
              showSuccess: true,
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              showAlertDialog: true,
              alertTxt: err,
              showSuccess: false,
            });
          });
      }, 150);
    }
  }

  /******************************************************************************************/
  onPressStar(item, index) {
    console.log('onPressStar-----', item.watchlist_data, index);
    this.setState({ isLoading: true });
    setTimeout(() => {
      console.log(item, "chk index::::", index);
      const status =
        item.watchlist_data == null ? { coin_id: item.coin_id } : null;
      this.state.AssetList[index].watchlist_data = status;
      const Arr = [];
      const data1 = {};
      data1["coin_id"] = item.coin_id;
      (data1["address"] = getCryptoAddress(item.coin_family)), // item.coin_family == 3 ? Singleton.getInstance().defaultBtcAddress : item.coin_family == 5 ? Singleton.getInstance().defaultLtcAddress : Singleton.getInstance().defaultEthAddress;
        (data1["status"] = item.watchlist_data == null ? 0 : 1);
      Arr.push(data1);
      const data = {
        data: Arr,
      };
      console.log("data send>>>>>>", data);
      this.props
        .updateWatchList({ data })
        .then((res) => {
          this.setState({
            isLoading: false,
            showAlertDialog: true,
            alertTxt:
              LanguageManager.alertMessages.watchlistUpdatedSuccessfully,
            isPop: true,
            showSuccess: true,
          });
          // this.setState({ showAlertDialog: true });
          // setTimeout(() => {
          //   Actions.currentScene !== "ToggleWalletNew" &&
          //     Actions.ToggleWalletNew({ themeSelected: "" });
          // }, 1000);

        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            // showAlertDialog: true,
            alertTxt: err,
            showSuccess: false,
          });
        });
    }, 150);
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
    const data = {
      fiat_type: Singleton.getInstance().CurrencySelected,
      search: this.state.search?.trim(),
      page: 1,
      limit: this.state.limit,
      wallet_address: [
        Singleton.getInstance().defaultEthAddress,
        Singleton.getInstance().defaultBtcAddress,
        Singleton.getInstance().defaultTrxAddress,
        Singleton.getInstance().defaultSolAddress,
      ],
    };
    this.setState({ tempArr: [], fromSearch: true });
    this.getWatchlist(data);
  }

  /******************************************************************************************/
  onLoadEnd = async () => {
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (
          this.state.AssetList.length != this.state.totalRecords &&
          this.state.page <= this.state.totalPages
        ) {
          console.log("here::::", 1);
          const data = {
            fiat_type: Singleton.getInstance().CurrencySelected,
            search: this.state.search,
            page: this.state.page,
            limit: this.state.limit,
            wallet_address: [
              Singleton.getInstance().defaultTrxAddress,
              Singleton.getInstance().defaultEthAddress,
              Singleton.getInstance().defaultBtcAddress,
              Singleton.getInstance().defaultSolAddress,
              // Singleton.getInstance().defaultLtcAddress,
            ],
          };
          this.getWatchlist(data, true);
        } else {
          console.log("here::::", 11);
        }
      });
    }
  };

  /******************************************************************************************/
  onPressOk() {
    Singleton.fromWatchList = true;
    this.setState({ showAlertDialog: false });
  }

  /******************************************************************************************/
  render() {
    const { walletMain, notifications } = LanguageManager;
    return (
      <ImageBackground
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
        source={ThemeManager.ImageIcons.mainBgImgNew}
      >
        <HeaderMain BackButtonText={"Add to Watchlist"} />
        {(this.state.AssetList.length > 0 ||
          this.state.search.length > 0 ||
          this.state.fromSearch == true) && (
            <View style={{ marginHorizontal: horizontalScale(20), marginBottom: 20 }}>
              <SearchToken
                isIconsShow={false}
                value={this.state.search}
                onSubmitEditing={(text) => {
                  this.updateSearch(this.state.search);
                }}
                onChangeText={(text) => {
                  if (!Constants.EMOJI_REGEX.test(text)) {
                    this.setState({ search: text }, () => this.updateSearch(text));
                  }
                }}
                viewStyle={{ marginRight: 0 }}
              />
            </View>
          )}

        {/* <View style={{flex: 1,backgroundColor:'green' }}> */}

        {/* ----------------------------------------------------------- */}
        <FlatList
          onEndReachedThreshold={0.01}
          bounces={false}
          onEndReached={() => {
            this.onLoadEnd();
          }}
          showsVerticalScrollIndicator={false}
          data={this.state.AssetList}
          keyExtractor={(item, index) => item?.coin_id}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyView1}>
                {!this.state.isLoading && <Text
                  allowFontScaling={false}
                  style={[
                    styles.textStyle,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {walletMain.Nodata}
                </Text>}
              </View>
            );
          }}
          renderItem={({ item, index }) => {
            // console.log('this.state.isSelectedItem ----',this.state.isSelectedItem );
            return (
              <View
                resizeMode={"contain"}
                style={{
                  flexDirection: "row",
                  marginBottom: heightDimen(10),
                  paddingHorizontal: horizontalScale(20),

                }}
              >
                <View
                  style={[
                    styles.ViewStyle,
                    { marginHorizontal: moderateScale(0.1), backgroundColor: ThemeManager.colors.mnemonicsBg },
                  ]}
                >
                  <View style={styles.ViewStyle1}>
                    {item.coin_image ? (
                      <View
                        style={[
                          styles.ImgStyle,
                          {
                            marginLeft: 20
                          },
                        ]}
                      >
                        <Image
                          style={[styles.ImgStyle2]}
                          source={{ uri: item.coin_image }}
                        />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.ImgStyle,
                          {
                            backgroundColor:
                              ThemeManager.colors.borderUnderLine,
                            marginLeft: 20
                          },
                        ]}
                      >
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.coinSymbolStyle,
                            {
                              color: ThemeManager.colors.Text,
                              textTransform: "capitalize",
                              paddingLeft: 0,
                            },
                          ]}
                        >
                          {item.coin_name?.substring(0, 1)}
                        </Text>
                      </View>
                    )}
                    <View style={{ flexDirection: "row", flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 }}>
                      <View style={{ flex: 0.7 }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            ...styles.textStyle,
                            color: ThemeManager.colors.blackWhiteText,
                          }}
                        >
                          {item?.coin_name?.toString().length > 10
                            ? item?.coin_name?.substring(0, 7) + "..."
                            : item.coin_name}
                          {(item.is_token == 1 || item.coin_family == 1) && (
                            <Text
                              allowFontScaling={false}
                              style={[
                                styles.titleTextStyle,
                                {
                                  color: ThemeManager.colors.blackWhiteText,
                                  fontSize: 12,
                                },
                              ]}
                            >
                              {item.coin_family == 1
                                ? " (BEP-20)"
                                : item.coin_family == 2
                                  ? " (ERC-20)"
                                  : item.coin_family == 6
                                    ? " (TRC-20)"
                                    : item.coin_family == 5
                                      ? " (SPL)"
                                      : item.coin_family == 4
                                        ? " (POL ERC-20)"
                                        : ""}
                            </Text>
                          )}
                        </Text>

                        <View style={{ flexDirection: "row" }} >
                          <Text
                            allowFontScaling={false}
                            style={{
                              ...styles.textStyle1,
                              color: ThemeManager.colors.TextColor,
                            }}
                          >
                            {Singleton.getInstance().CurrencySymbol}{CommaSeprator1(item.fiat_price_data?.value, 2)}</Text>
                          {item?.fiat_price_data?.price_change_percentage_24h?.toString().includes("-") ? (
                            <View style={styles.viewStyle2}>
                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.titleTextStyleNew,
                                  { color: Colors.lossColor, paddingLeft: 2 },
                                ]}
                              >
                                {'-'}{item?.fiat_price_data?.price_change_percentage_24h
                                  ? item?.fiat_price_data?.price_change_percentage_24h
                                    .toFixed(2)
                                    .toString()
                                    .replace(/[-]/g, "")
                                  : 0.0}
                                %
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.viewStyle2}>

                              <Text
                                allowFontScaling={false}
                                style={[
                                  styles.titleTextStyleNew,
                                  { color: Colors.profitColor, },
                                ]}
                              >
                                {'+'}{item?.fiat_price_data?.price_change_percentage_24h
                                  ? (item?.fiat_price_data?.price_change_percentage_24h).toFixed(2)
                                  : 0.0}
                                %
                              </Text>
                            </View>
                          )}
                        </View>


                      </View>

                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        <TouchableOpacity
                          disabled={this.state.isLoading || Singleton.getInstance().isMakerWallet}
                          style={styles.binStyle2}
                          onPress={() => {
                            this.onPressStar(item, index)



                          }}
                        >
                          <Image
                            source={images.ic_star_active}
                            style={{
                              tintColor: item.watchlist_data != null
                                ? ThemeManager.colors.primaryColor :
                                this.state.isSelectedItem
                                  &&
                                  this.state.isSelect == index
                                  ? ThemeManager.colors.primaryColor :
                                  ThemeManager.colors.watchListInactiveStar,

                              height: heightDimen(23), width: widthDimen(24), resizeMode: "contain", marginRight: dimen(6)
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>


              </View>
            );
          }}
        />


        {/* <View style={{ marginHorizontal: 24, marginBottom: heightDimen(30) }}>
          <Button
            onPress={() => {
              if (this.state.selectedItem !== '' && this.state.selectedItemIndex != null) {
                this.onPressStar(this.state.selectedItem, this.state.selectedItemIndex)
              }


            }}
            customStyle={{ marginTop: 20 }}
            buttontext={LanguageManager.merchantCard.done}
          />
        </View> */}
        {/* ----------------------------------------------------------- */}
        {/* </View> */}
        <LoaderView isLoading={this.state.isLoading} />
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => {
              this.onPressOk();
            }}
          />
        )}
      </ImageBackground>
    );
  }
}

export default connect(null, { getWatchList, updateWatchList })(
  UpdateWatchList
);
