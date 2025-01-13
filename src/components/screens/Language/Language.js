import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './LanguageStyle';
import { AppAlert, CardView, Header, LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { getLanguageList, updateLanguage } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { getData, saveData } from '../../../Utils/MethodsUtils';
import Toast from 'react-native-easy-toast';
import { LanguageManager } from '../../../../LanguageManager';
import Singleton from '../../../Singleton';
import { Actions } from 'react-native-router-flux';

class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageList: [],
      isLoading: false,
      defaultCurrency: '',
      alertTxt: '',
      showAlertDialog: false,
      showLoader: false,
      showSuccess: false
    };
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.fetchLanguageList()
    });
    this.props.navigation.addListener('didBlur', () => {
      this.setState({ showLoader: false, showAlertDialog: false, showSuccess: false });
    });
    getData(Constants.SELECTED_LANGUAGE).then(symbol => {
      this.setState({ defaultCurrency: symbol ? symbol : 'en' });
    });
  }

  /******************************************************************************************/
  async fetchLanguageList() {
    this.setState({ isLoading: true })
    this.props.getLanguageList({}).then(res => {
      this.setState({ isLoading: false, languageList: res, showSuccess: true })
      console.log('chk language res:::::', res)
    }).catch(err => {
      this.setState({ isLoading: false, languageList: [], showAlertDialog: true, alertTxt: err })
      console.log('chk language err:::::', err)

    })
  }

  /******************************************************************************************/
  async itemPressed(item) {
    if (!global.isConnected) {
      return this.setState({ showAlertDialog: true, alertTxt: LanguageManager.alertMessages.pleaseCheckYourNetworkConnection });
    }
    console.log('chk item::::', item);
    this.setState({ isLoading: true });
    LanguageManager.setLanguage(item.name);
    const data = {
      fiat_currency: await getData(Constants.SELECTED_CURRENCY)
    }
    this.props.updateLanguage({ data }).then(res => {
      this.setState({ isLoading: false, defaultCurrency: item.code, alertTxt: LanguageManager.setting.LanUpdateSuccess, showAlertDialog: true })
      console.log('chk updateLanguage res:::::', res);
      Singleton.getInstance().SelectedLanguage = item.code;
      saveData(Constants.SELECTED_LANGUAGE, item.code);
    }).catch(err => {
      this.setState({ isLoading: false })
      console.log('chk updateLanguage err:::::', err)

    })
  }

  /******************************************************************************************/
  onPressItem(item, index) {
    item.code?.toLowerCase() == this.state.defaultCurrency?.toLowerCase() ? '' : this.itemPressed(item, index)
  }

  /******************************************************************************************/
  render() {
    const { setting } = LanguageManager;
    return (
      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header BackButtonText={setting.language} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
        {this.state.languageList.length > 0 ? <View style={[styles.ViewStyle11, { backgroundColor: ThemeManager.colors.searchBg }]}>
          {this.state.languageList?.map((item, index) => {
            return (
              <CardView
                hideBottom={(index == this.state.languageList?.length - 1) ? true : false}
                onPress={() => { this.onPressItem(item, index) }}
                img={{ uri: item.image }}
                imgStyle={styles.imgStyle}
                text={item?.name}
                showIcon={item.code?.toLowerCase() == this.state.defaultCurrency?.toLowerCase() ? true : false}
                fromTheme={true}
                fromLang={true}
              />
            )
          })}
        </View>
          : null}

        {/* /****************************************************************************************** */}
        <Toast
          ref={toast => (this.toast = toast)}
          position="bottom"
          style={{ backgroundColor: ThemeManager.colors.toastBg }}
        />

        {/* /****************************************************************************************** */}
        {this.state.showAlertDialog && (
          <AppAlert
            showSuccess={this.state.showSuccess}
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { Actions.currentScene == 'Language' ? Actions.pop() : null; this.setState({ showAlertDialog: false }) }}
          />
        )}
        {/* /****************************************************************************************** */}
        <LoaderView isLoading={this.state.isLoading} />
      </View>
    );
  }
}
export default connect(null, { getLanguageList, updateLanguage })(Language);
