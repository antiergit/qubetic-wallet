import React, { Component } from 'react';
import { BackHandler, ImageBackground, View } from 'react-native';
import styles from './ThemeChangeStyle';
import { AppAlert, CardView, Header, HeaderMain, LoaderView } from '../../common';
import { Colors, Images } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { updateLanguage } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { getData, saveData } from '../../../Utils/MethodsUtils';
import { LanguageManager } from '../../../../LanguageManager';
import { Actions } from 'react-native-router-flux';
import { EventRegister } from 'react-native-event-listeners';
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from '../../../Utils';
import changeNavigationBarColor, { } from 'react-native-navigation-bar-color';
import Singleton from '../../../Singleton';
import { onMakerDetailsChanged } from '../../../Utils/CheckerMarkerUtils';
class ThemeChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themeList: [
        // { theme: LanguageManager.setting.lightTheme, icon: Images.light },
        { theme: LanguageManager.setting.darkTheme, icon: Images.dark },
      ],
      isLoading: false,
      defaultTheme: '',
      alertTxt: '',
      showAlertDialog: false,
      showLoader: false,
      showSuccess: false,
    };
  }
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    this.props.navigation.addListener('didFocus', () => {
      this.setState({ showSuccess: false });
      this.getCurrentTheme();
    });
    this.props.navigation.addListener('didBlur', () => {
      this.setState({ showLoader: false, showAlertDialog: false });
    });
  }

  handleBackButtonClick() {
    console.log('back----');
    Actions.pop()

    return true;
  };

  /******************************************************************************************/
  getCurrentTheme() {
    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      console.log('chk theme::::statustheme', theme);
      const theme_ =
        theme == 1
          ? LanguageManager.setting.darkTheme
          : LanguageManager.setting.lightTheme;
      if (ThemeManager.colors.theme == 'light') {
        changeNavigationBarColor('#ffffff');
      } else {
        changeNavigationBarColor('#030D0D');
      }
      this.setState({ defaultTheme: theme_ });
    });
  }

  /******************************************************************************************/
  async itemPressed(item) {
    if (!global.isConnected) {
      return this.setState({
        showAlertDialog: true,
        alertTxt:
          LanguageManager.alertMessages.pleaseCheckYourNetworkConnection,
      });
    }
    const selectedThemeArr = item?.toLowerCase().split(" ");
    const selectedTheme =
      selectedThemeArr?.length > 0 ? selectedThemeArr[0] : item?.toLowerCase();
    const data = {
      key: 3, // 1 wallet_name,2 fiat_currency,3 theme
      value: selectedTheme,
    };
    onMakerDetailsChanged(data);
    console.log('chk item::::', item);
    const themeNew =
      item?.toLowerCase() == LanguageManager.setting.darkTheme?.toLowerCase()
        ? 1
        : 2;
    console.log('chk themeNew::::', themeNew);
    const themeName = themeNew == 1 ? 'darkMode' : 'lightMode';
    console.log('chk themeName::::', themeName);
    ThemeManager.setLanguage(themeName);
    Singleton.getInstance().themeStatus = themeNew

    this.setState({ defaultTheme: item });
    saveData(Constants.DARK_MODE_STATUS, themeNew);
    EventRegister.emit(
      'theme',
      themeNew == 1 ? ThemeManager.colors.MainbgNew : Colors.newHeader,
    );
    EventRegister.emit('getThemeChanged', themeNew);
    setTimeout(() => {
      this.setState({
        showSuccess: true,
        alertTxt: LanguageManager.setting.themeUpdateSuccess,
        showAlertDialog: true,
      });
    }, 500);


  }

  /******************************************************************************************/
  onPressItem(item, index) {
    console.log('log-----1');
    if (!global.isConnected) {
      return this.setState({
        showAlertDialog: true,
        alertTxt:
          LanguageManager.alertMessages.pleaseCheckYourNetworkConnection,
      });
    }
    console.log('log-----2', item?.theme?.toLowerCase() == this.state.defaultTheme?.toLowerCase());
    console.log('log-----3', item?.theme?.toLowerCase(), '------', this.state.defaultTheme?.toLowerCase());


    item?.theme?.toLowerCase() == this.state.defaultTheme?.toLowerCase()
      ? ''
      : this.itemPressed(item?.theme, index);
  }

  /******************************************************************************************/
  render() {
    const { setting } = LanguageManager;
    return (
      <>
        <ImageBackground
          source={ThemeManager.ImageIcons.mainBgImgNew}
          style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
          <HeaderMain

            BackButtonText={setting.theme}
            customStyle={{ paddingHorizontal: widthDimen(24) }}
          />
          <View
            style={[
              styles.ViewStyle11,
              {},
            ]}>
            {this.state.themeList?.map((item, index) => {
              return (
                <CardView
                  leftImg={true}

                  mainStyle={{ marginBottom: dimen(13) }}
                  leftImgIcon={item.icon}
                  imgStyleLeft={{ height: getDimensionPercentage(25), width: getDimensionPercentage(25) }}
                  imgIcon={ThemeManager.ImageIcons.RightArrow}
                  imgStyle={styles.imgstyle}
                  hideBottom={
                    index == this.state.themeList?.length - 1 ? true : false
                  }
                  onPress={() => {
                    this.onPressItem(item, index);
                    if (ThemeManager.colors.theme == 'light') {
                      changeNavigationBarColor('#ffffff');
                    } else {
                      changeNavigationBarColor('#030D0D');
                    }
                  }}
                  leftText={item?.theme}
                  img={item.icon}
                  text={item?.theme}
                  showIcon={
                    item?.theme?.toLowerCase() ==
                      this.state.defaultTheme?.toLowerCase()
                      ? true
                      : false
                  }
                  fromTheme={true}
                  leftTextStyle={{ marginTop: dimen(5) }}
                />
              );
            })}
          </View>
          {/* /****************************************************************************************** */}
          {this.state.showAlertDialog && (
            <AppAlert
              // fromTheme={true}
              // isvisible={this.state.showAlertDialog}
              showSuccess={this.state.showSuccess}
              alertTxt={this.state.alertTxt}
              hideAlertDialog={() => {

                this.setState({ showAlertDialog: false });
              }}
            />
          )}
          {/* /****************************************************************************************** */}
          <LoaderView isLoading={this.state.isLoading} />
        </ImageBackground>


      </>
    );
  }
}
export default connect(null, { updateLanguage })(ThemeChange);