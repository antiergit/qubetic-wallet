import React, { Component } from "react";
import { View, Image, Text, FlatList, ImageBackground } from "react-native";
import moment from "moment";
import styles from "./NotificationsStyle";
import { LoaderView } from "../../common";
import { Colors, Images } from "../../../theme/";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import { connect } from "react-redux";
import { getNotificationList } from "../../../Redux/Actions";
import { CommaSeprator1, getData } from "../../../Utils/MethodsUtils";
import { EventRegister } from "react-native-event-listeners";
import { Actions } from "react-native-router-flux";
import { LanguageManager } from "../../../../LanguageManager";
import Singleton from "../../../Singleton";

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 25,
      adrsArray: [],
      isLoading: false,
      NotificationListData: [],
      loadList: false,
      totalRecords: "",
    };
  }

  /******************************************************************************************/
  componentDidMount() {
    EventRegister.addEventListener("hitWalletApi", () => {
      Actions.currentScene == "NotificationsTab" && this.hitApiNoti();
    });
    this.hitApiNoti();
  }

  /******************************************************************************************/
  hitApiNoti() {
    getData(Constants.ADDRESS_LIST).then((addressList) => {
      const adrsArray = JSON.parse(addressList);
      this.setState({ adrsArray: adrsArray });
      const data = {
        page: 1,
        limit: this.state.limit,
        addrsListKeys: adrsArray,
      };
      this.notificationList(data);
    });
  }

  /******************************************************************************************/
  notificationList(data, fromPagination = false) {
    this.setState({ isLoading: true });
    this.props
      .getNotificationList({ data })
      .then((response) => {
        if (response.data.length > 0) {
          this.setState({
            NotificationListData: fromPagination
              ? this.state.NotificationListData.concat(response.data)
              : response.data,
            totalRecords: response.meta.total,
            loadList: true,
            isLoading: false,
          });
        } else {
          this.setState({
            NotificationListData: fromPagination
              ? this.state.NotificationListData
              : [],
            isLoading: false,
          });
        }
      })
      .catch((e) => {
        this.setState({ isLoading: false });
      });
  }

  /******************************************************************************************/
  onLoadEnd = () => {
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.NotificationListData.length != this.state.totalRecords) {
          console.log("here::::", 1);
          const data = {
            page: this.state.page,
            limit: this.state.limit,
            addrsListKeys: this.state.adrsArray,
          };
          this.notificationList(data, true);
        } else {
          console.log("here::::", 11);
        }
      });
    }
  };

  /******************************************************************************************/
  render() {
    const { notifications } = LanguageManager;
    return (
      <View style={{ flex: 1, }}>
        <View style={styles.viewMain}>
          {this.state.NotificationListData.length > 0 ? (
            <FlatList
              bounces={false}
              onEndReached={() => this.onLoadEnd()}
              onEndReachedThreshold={0.01}
              keyExtractor={(item, index) => index + ""}
              style={{ marginTop: 10, marginBottom: 20 }}
              showsVerticalScrollIndicator={false}
              data={this.state.NotificationListData}
              renderItem={this.renderItem}
            />
          ) : (
            <Text
              allowFontScaling={false}
              style={[
                styles.textStyle,
                { color: ThemeManager.colors.blackWhiteText },
              ]}
            >
              {notifications.nolistfound}
            </Text>
          )}
          {this.state.isLoading == true && (
            <LoaderView isLoading={this.state.isLoading} />
          )}
        </View>
      </View>
    );
  }

  /******************************************************************************************/
  renderItem = ({ item, index }) => {
    const { priceAlert } = LanguageManager;
    return (
      <View
        style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}
      >
        {!item.tx_type ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ThemeManager.colors.transactionIconBg,
              height: 40,
              width: 40,
              borderRadius: 30,
            }}
          >
            <Image style={[styles.imgStyle2, { tintColor: ThemeManager.colors.blackWhiteText }]} source={Images.icon_help} />
          </View>
        ) : (
          <View style={{ ...styles.ViewStyle4, backgroundColor: ThemeManager.colors.transactionIconBg }}>
            <Image
              style={{ alignSelf: 'center', tintColor: ThemeManager.colors.blackWhiteText }}
              source={
                item.tx_type?.toLowerCase() == "alert"
                  ? Images.noti
                  : item.notification_type?.toLowerCase() == "withdraw"
                    ? Images.withdrawNew
                    : item.notification_type?.toLowerCase() == "smart contract execution" ||
                      item?.notification_type?.toLowerCase() == "approval" ||
                      item?.notification_type?.toLowerCase() == "swap" ||
                      item?.notification_type?.toLowerCase() == "cross chain swap"
                      ? Images.icTransactionSwap
                      : Images.deposit
              } />
          </View>

        )}


        <View
          style={{
            flexDirection: "column",
            width: item.tx_type?.toLowerCase() == "alert" ? "55%" : "90%",
          }}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.Title,
              { flex: 1, color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {item.tx_type?.toLowerCase() == "alert"
              ? priceAlert.priceAlert +
              " " +
              `(${item.coin_symbol?.toUpperCase()})`
              : item?.message}
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.date,
              { flex: 1, color: ThemeManager.colors.legalGreyColor },
            ]}
          >
            {moment(item.created_at).format("MMM DD YYYY")} |{" "}
            {moment(item.created_at).format("h:mm A")}
          </Text>
        </View>

        <View
          style={[
            styles.ViewStyle2,
            { width: item.tx_type?.toLowerCase() == "alert" ? "35%" : "0%" },
          ]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.TitleNew,
              { color: ThemeManager.colors.settingsText },
            ]}
          >
            {item.tx_type?.toLowerCase() == "alert"
              ? `${item.currency_data ? item.currency_data?.currency_symbol : "$"
              }${CommaSeprator1(item.amount, 4)}`
              : null}
          </Text>

          {item.tx_type?.toLowerCase() == "alert" ? (
            item?.alert_price?.toString().includes("-") ? (
              <View style={styles.viewStyle2}>
                <Image style={styles.imgStyle1} source={Images.loss} />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.titleTextStyleNew,
                    { color: Colors.lossColor, paddingLeft: 2 },
                  ]}
                >
                  {item?.alert_price
                    ? item?.alert_price
                      .toFixed(2)
                      .toString()
                      .replace(/[-]/g, "")
                    : 0.0}
                  %
                </Text>
              </View>
            ) : (
              <View style={styles.viewStyle2}>
                <Image style={styles.imgStyle1} source={Images.gain} />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.titleTextStyleNew,
                    { color: Colors.profitColor, paddingLeft: 2 },
                  ]}
                >
                  {item?.alert_price ? (item?.alert_price).toFixed(2) : 0.0} %
                </Text>
              </View>
            )
          ) : null}
        </View>
        {/* </View> */}
      </View>
    );
  };
}
export default connect(null, { getNotificationList })(Notifications);
