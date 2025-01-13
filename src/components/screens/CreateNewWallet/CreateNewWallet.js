import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Header, InputCustom, Button, AppAlert } from '../../common';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { LoaderView } from '../../common/LoaderView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './CreateNewWalletStyle';
import { getData } from '../../../Utils/MethodsUtils';
import { createWallet } from '../../../Utils/WalletUtils';
import { generateMnemonics } from '../../../Utils/MnemonicsUtils';
import { LanguageManager } from '../../../../LanguageManager';
import { EventRegister } from 'react-native-event-listeners';

const { alertMessages, placeholderAndLabels, pins, createWalletTexts } = LanguageManager;

class CreateNewWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      isLoading: false,
      walletName: '',
      showAlertDialog: false,
      alertTxt: '',
      errorMsg: '',
      themeSelected: '',
    };
  }
  componentDidMount() {
    EventRegister.addEventListener('getThemeChanged', data => {
      this.setState({ themeSelected: data });
    });
  }
  /******************************************************************************************/
  continuePressed() {
    const nameRegex = /^[a-zA-Z]*$/;
    const { walletName } = this.state;
    if (walletName.trim() == '') {
      return this.setState({ showAlertDialog: true, alertTxt: createWalletTexts.pleaseEnterName });
    } else if (!nameRegex.test(walletName)) {
      this.setState({ showAlertDialog: true, alertTxt: createWalletTexts.EnterValiName });
    } else if (walletName.length < 3) {
      this.setState({ showAlertDialog: true, alertTxt: createWalletTexts.validName });
    } else {
      this.setState({ isLoading: true });
      setTimeout(async () => {
        const mnemonics = generateMnemonics();
        const walletData = await createWallet(mnemonics);
        this.setState({ isLoading: false });
      }, 200);
    }
  }

  /******************************************************************************************/
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
          <Header themeSelected={this.state.themeSelected} BackButtonText="" bgColor={{ backgroundColor: ThemeManager.colors.Mainbg }} />
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            style={{ flex: 1 }}>
            <View style={[styles.wrap]}>
              <View>
                {this.state.showForm ? (
                  <Text allowFontScaling={false} style={[styles.titleStyle, { textAlign: 'center', color: this.state.themeSelected == 2 ? 'black' : ThemeManager.colors.whiteText }]}>{createWalletTexts.nameOfYourWallet}</Text>
                ) : (
                  <Text allowFontScaling={false} style={[styles.titleStyle, { color: ThemeManager.colors.whiteText }]}>{createWalletTexts.walletRestored}</Text>
                )}
                <Text allowFontScaling={false} style={[styles.txtFont, { textAlign: 'center', color: ThemeManager.colors.whiteText }]}>{createWalletTexts.namingYourWallet}</Text>
              </View>
              {/* /****************************************************************************************** */}
              <View style={styles.WalletCreateForm}>
                <Text allowFontScaling={false} style={[styles.txtField, { color: this.state.themeSelected == 2 ? 'black' : ThemeManager.colors.whiteText }]}>{createWalletTexts.enterName}</Text>
                {this.state.showForm ? (
                  <>
                    <View style={{ marginBottom: 15 }}>
                      <InputCustom
                        placeHolder={placeholderAndLabels.enterYourWalletName}
                        customInputStyle={{ borderColor: ThemeManager.colors.colorVariation, color: this.state.themeSelected == 2 ? 'black' : ThemeManager.colors.whiteText, fontFamily: Fonts.dmRegular, fontSize: 16 }}
                        placeholderTextColor={ThemeManager.colors.lightWhiteText}
                        maxLength={20}
                        value={this.state.walletName}
                        onChangeText={value => {
                          this.setState({ walletName: value });
                          if (Constants.ALPHABET_REGEX.test(value)) {
                            this.setState({ errorMsg: '' });
                          } else {
                            this.setState({ errorMsg: alertMessages.onlyLetters });
                          }
                        }}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      {this.state.errorMsg.length > 0 && (
                        <Text allowFontScaling={false} style={[styles.txtCharErr, { color: ThemeManager.colors.DarkRed }]}>{this.state.errorMsg}</Text>)}
                      <Text allowFontScaling={false} style={[styles.txtChar, { color: ThemeManager.colors.whiteText }]}>{createWalletTexts.maxLimit}{' '}{this.state.walletName.length}/25</Text>
                    </View>
                  </>
                ) : null}
              </View>
              <View></View>
            </View>
          </KeyboardAwareScrollView>
          <View style={{ marginHorizontal: 20 }}>
            <Button
              buttontext={pins.Continue}
              btnstyle={{ marginBottom: 20, backgroundColor: 'red' }}
              onPress={() => this.continuePressed()}
            />
          </View>
        </View>

        {this.state.showAlertDialog && (
          <AppAlert
            alertTxt={this.state.alertTxt}
            hideAlertDialog={() => { this.setState({ showAlertDialog: false }) }}
          />
        )}
        <LoaderView isLoading={this.state.isLoading} />
      </View>
    );
  }
}
export default CreateNewWallet;
