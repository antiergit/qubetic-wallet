import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getQueryList } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import { EventRegister } from 'react-native-event-listeners';
import styles from './HelpStyle';
import moment from 'moment';
import { Colors } from '../../../theme';
import { Actions } from 'react-native-router-flux';
import { LanguageManager } from '../../../../LanguageManager';
import { CustomCongratsModel } from '../../common/CustomCongratsModel';
import * as Constants from '../../../Constants';


class SupportHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 25,
      showModal: false,
      isLoading: false,
      selectedItem: '',
      supportTickets: [],
      loadList: false,
      totalRecords: '',
      data: {
        status: 1,
        page: 1,
        limit: 25
      },
    };
  }
  componentDidMount() {
    EventRegister.addEventListener('hitWalletApi', () => {
      console.log('herrererer');
      Actions.currentScene == 'HelpTab' && this.openQueryList(this.state.data);
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      this.setState({ showModal: false })
    });
    this.props.navigation.addListener('didFocus', () => {
      console.log('chk didFocus::::: supportHistory', this.props);
    });
    this.openQueryList(this.state.data);
  }
  /******************************************************************************************/
  openQueryList(data, fromPagination = false) {
    this.setState({ isLoading: true })
    this.props.getQueryList({ data }).then(response => {
      console.log('chk res::::', response);
      if (response.data?.length > 0) {
        this.setState({ supportTickets: fromPagination ? this.state.supportTickets.concat(response.data) : response.data, totalRecords: response.meta.total, loadList: true, isLoading: false });
      } else {
        this.setState({ supportTickets: fromPagination ? this.state.supportTickets : [], isLoading: false });
      }
    }).catch(e => {
      this.setState({ isLoading: false });
    });
  }
  /******************************************************************************************/
  onLoadEnd = () => {
    if (this.state.loadList) {
      let page = this.state.page + 1;
      this.setState({ page: page, loadList: false }, () => {
        if (this.state.supportTickets.length != this.state.totalRecords) {
          console.log('here::::', 1);
          const data = {
            status: 1,
            page: this.state.page,
            limit: this.state.limit,
          };
          this.openQueryList(data, true);
        } else {
          console.log('here::::', 11);
        }
      });
    }
  };
  /******************************************************************************************/
  render() {
    const { help } = LanguageManager;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <View style={styles.viewMain}>
          {this.state.supportTickets.length > 0 ? (
            <FlatList
              bounces={false}
              onEndReached={() => this.onLoadEnd()}
              onEndReachedThreshold={0.01}
              keyExtractor={(item, index) => index + ''}
              style={{ marginTop: 10 }}
              showsVerticalScrollIndicator={false}
              data={this.state.supportTickets}
              renderItem={this.renderItem}
            />
          ) : (
            <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.whiteText, textAlign: 'center' }]}>{help.noListFound}</Text>)}
          {this.state.isLoading == true && (<LoaderView isLoading={this.state.isLoading} />)}
        </View>

        {/* /****************************************************************************************** */}
        <CustomCongratsModel
          hideLottie={true}
          textStyle={{ ...styles.coinTextStyle, color: ThemeManager.colors.lightText }}
          title1={help.remarks}
          title2={this.state.selectedItem}
          openModel={this.state.showModal}
          dismiss={() => this.setState({ showModal: false, selectedItem: '' })}
        />
      </View>
    );
  }
  renderItem = ({ item, index }) => {
    const { contactUs, help } = LanguageManager;
    return (
      <TouchableOpacity disabled={item.remarks ? false : true} onPress={() => this.setState({ showModal: true, selectedItem: item.remarks })} style={[styles.ViewStyle1, { backgroundColor: ThemeManager.colors.modalCard, marginBottom: this.state.supportTickets.length - 1 == index ? 30 : 0 }]}>
        <Text style={[styles.textStyle, { textDecorationLine: 'underline', color: ThemeManager.colors.Text }]}>{help.ticketId}: {item.ticket_id}</Text>
        <View style={styles.ViewStyle2}>
          <Text style={[styles.textStyle1, { color: ThemeManager.colors.Text }]}>{contactUs.category}</Text>
          <Text numberOfLines={1} style={[styles.textStyle2, , { textAlign: 'right', width: '55%', color: ThemeManager.colors.Text }]}>{item.category}</Text>
        </View>
        <View style={styles.ViewStyle2}>
          <Text style={[styles.textStyle1, { color: ThemeManager.colors.Text }]}>{help.subject}</Text>
          <Text numberOfLines={1} style={[styles.textStyle2, , { textAlign: 'right', width: '55%', color: ThemeManager.colors.Text }]}>{item.subject}</Text>
        </View>
        <View style={styles.ViewStyle2}>
          <Text style={[styles.textStyle1, { color: ThemeManager.colors.Text }]}>{help.lastUpdated}</Text>
          <Text style={[styles.textStyle2, { width: '47%', textAlign: 'right', color: ThemeManager.colors.Text }]}>{moment(item.created_at).format('DD MMM, YYYY')} |{' '}{moment(item.created_at).format('h:mm A')}</Text>
        </View>
        <View style={styles.ViewStyle2}>
          <Text style={[styles.textStyle1, { color: ThemeManager.colors.Text }]}>{help.remarks}</Text>
          <Text numberOfLines={1} style={[styles.textStyle2, { textAlign: 'right', width: '50%', color: ThemeManager.colors.Text }]}>{item.remarks ? item.remarks : '...'}</Text>
        </View>
        <View style={styles.ViewStyle2}>
          <Text style={[styles.textStyle1, { color: ThemeManager.colors.Text }]}>{help.status}</Text>
          <Text style={[styles.textStyle2, { color: item.status == '2' ? Colors.successColor : item.status == '1' ? Colors.orangeColor : Colors.lossColor }]}>{item.status == 0 ? 'Open' : item.status == 1 ? 'In Progress' : item.status == 2 ? 'Resolved' : 'Expired'}</Text>
        </View>
      </TouchableOpacity>
    );
  };
}
export default connect(null, { getQueryList })(SupportHistory);