import React, { Component } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { getAdminAnnouncements } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import { EventRegister } from 'react-native-event-listeners';
import styles from './NotificationsStyle';
import moment from 'moment';
import { Images } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import { LanguageManager } from '../../../../LanguageManager';
import Singleton from '../../../Singleton';
import { getData } from '../../../Utils/MethodsUtils';
import * as Constants from '../../../Constants';

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 25,
      isLoading: false,
      Announcements: [],
      loadList: false,
      totalRecords: '',
      data: {
        page: 1,
        limit: 25,
      },
      makerUserId: '',
    };
  }
  componentDidMount() {
    getData(Constants.LOGIN_DATA).then((res) => {
      const result = JSON.parse(res);
      this.announcementList({
        ...this.state.data,
        makerUserId: result?.makerUserId ?? 0,
      });
      this.setState({
        makerUserId: result?.makerUserId,
      });
    });
    EventRegister.addEventListener('hitWalletApi', () => {
      console.log('herrererer');
      Actions.currentScene == "NotificationsTab" &&
        this.announcementList({
          ...this.state.data,
          makerUserId: this.state.makerUserId,
        });
    });
    this.props.navigation.addListener('didFocus', () => {
      console.log('chk didFocus::::: announcements', this.props);
    });
    
  }

  /******************************************************************************************/
  announcementList(data, fromPagination = false) {
    this.setState({ isLoading: true });
    this.props.getAdminAnnouncements({ data }).then(response => {
      if (response.data.length > 0) {
        this.setState({
          Announcements: fromPagination ? this.state.Announcements.concat(response.data) : response.data,
          totalRecords: response.meta.total,
          loadList: true,
          isLoading: false,
        });
      } else {
        this.setState({ Announcements: fromPagination ? this.state.Announcements : [], isLoading: false });
      }
    })
      .catch(e => {
        this.setState({ isLoading: false });
      });
  }

  /******************************************************************************************/
  onLoadEnd = () => {
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.Announcements.length != this.state.totalRecords) {
          console.log('here::::', 1);
          const data = {
            page: this.state.page,
            limit: this.state.limit,
            makerUserId: this.state.makerUserId ?? 0,
          };
          this.announcementList(data, true);
        } else {
          console.log('here::::', 11);
        }
      });
    }
  };

  /******************************************************************************************/
  render() {
    const { notifications } = LanguageManager;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
        <View style={styles.viewMain}>
          {this.state.Announcements.length > 0 ? (
            <FlatList
              bounces={false}
              onEndReached={() => this.onLoadEnd()}
              onEndReachedThreshold={0.01}
              keyExtractor={(item, index) => index + ''}
              style={{ marginTop: 10 }}
              showsVerticalScrollIndicator={false}
              data={this.state.Announcements}
              renderItem={this.renderItem}
            />
          ) : (
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText }]}>{notifications.nolistfound}</Text>
          )}
          {this.state.isLoading == true && (<LoaderView isLoading={this.state.isLoading} />)}
        </View>
      </View>
    );
  }

  /******************************************************************************************/
  renderItem = ({ item, index }) => {
    return (
      <View
        style={[
          styles.ViewStyle1,
          {
            alignItems: "center",
            justifyContent: "flex-start",
            marginBottom: this.state.Announcements.length - 1 == index ? 30 : 0,
            borderColor: ThemeManager.colors.borderColor,
          },
        ]}
      >
        <Image
          source={ThemeManager.ImageIcons.sendCardMain}
          style={[StyleSheet.absoluteFillObject]}
        />
        <View style={{}}>
          <Image style={styles.imgStyle} source={Images.iconReqSent} />
        </View>
        <View style={styles.ViewStyle3}>
          {item?.message && (
            <Text
              allowFontScaling={false}
              style={[
                styles.Title,
                { flex: 1, color: ThemeManager.colors.blackWhiteText },
              ]}
            >
              {item?.message}
            </Text>
          )}
          <Text
            allowFontScaling={false}
            style={[
              styles.date,
              { flex: 1, color: ThemeManager.colors.lightText },
            ]}
          >
            {moment(item.created_at).format("DD MMM, YYYY")} |{" "}
            {moment(item.created_at).format("h:mm A")}
          </Text>
        </View>
      </View>
    );
  };
}
export default connect(null, { getAdminAnnouncements })(Announcements);
