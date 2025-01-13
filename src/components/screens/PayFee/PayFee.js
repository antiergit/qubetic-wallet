import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, Clipboard, Image, Keyboard, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ThemeManager } from '../../../../ThemeManager'
import { Button, CardViewoption, Header, LoaderView } from '../../common'
import styles from './PayFeeStyle'
import { LanguageManager } from '../../../../LanguageManager'
import { InputCustomWithQrButton } from '../../common/InputCustomWithQrButton'
import { Images } from '../../../theme'
import { Actions } from 'react-native-router-flux'
import { EventRegister } from 'react-native-event-listeners'
import * as Constants from '../../../Constants'
import Singleton from '../../../Singleton'
import { CustomCongratsModel } from '../../common/CustomCongratsModel'
import Toast from 'react-native-easy-toast'
import { BlurView } from '@react-native-community/blur'

const PayFee = (props) => {
  const toast = useRef(null);
  const { referral, merchantCard, commonText, alertMessages } = LanguageManager;
  const [address, setAddress] = useState(props.address);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('')
  const [showOR, setShowQR] = useState(false);

  /******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      setShowCongrats(false);
      setShowAlertDialog(false);
      setShowQR(false);
      setAlertTxt('');
    });
    props.navigation.addListener('didFocus', () => {
      BackHandler.addEventListener('hardwareBackPress', () => {
        hitBack();
        return true
      });
    })
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress');
    })
  }, [])

  /******************************************************************************************/
  const onPressDone = () => {
    setShowCongrats(true)
  }

  /******************************************************************************************/
  const dismissModal = () => {
    setShowCongrats(false)
    hitBack();
  }

  /******************************************************************************************/
  const hitBack = () => {
    if (props.from == 'upgrade') {
      Actions.pop()
    } else {
      Singleton.bottomBar?.navigateTab('Settings');
      Actions.jump('Settings');
    }
  }

  //******************************************************************************************/
  const set_Text_Into_Clipboard = async () => {
    await Clipboard.setString(address);
  };

  /******************************************************************************************/
  return (
    <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        backCallBack={() => { hitBack() }}
        BackButtonText={referral.upgrade}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <ScrollView
        bounces={false}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}>

        <View style={[styles.ViewStyleNew, { marginHorizontal: 20 }]}>

          <View style={[styles.ViewStyle2]}>
            <Text style={[styles.textStyle5, { color: ThemeManager.colors.newTitle }]}>{merchantCard.amountToBePaid}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
              <Text style={[styles.textStyle4, { color: ThemeManager.colors.Text }]}>{props.fees}{' '}</Text>
              <Text style={[styles.textStyle3, { color: ThemeManager.colors.subTitle1 }]}>{'USDT'}</Text>
            </View>

            <Text style={[styles.textStyle2, { color: ThemeManager.colors.subTitle1 }]}>{merchantCard.pleasePayTheUpgradeFee}</Text>

            <View style={[{ borderRadius: 20, marginTop: 40, backgroundColor: ThemeManager.colors.searchBg, paddingVertical: 5 }]}>
              <CardViewoption
                hideBottom={true}
                disabled
                paddingBottom={5}
                customTypeTextStyle={styles.customTxtstyle1}
                customTextStyle={[styles.customTxtstyle, { color: ThemeManager.colors.subTitle1 }]}
                typeText={`${props.fees} ${'USDT'}`}
                text={merchantCard.comboCardAmt}
              />

              <CardViewoption
                typeText={'USDT'}
                paddingBottom={5}
                marginTop={-10}
                disabled
                customTypeTextStyle={[styles.customTxtstyle1, { color: ThemeManager.colors.lightText }]}
                customTextStyle={[styles.customTxtstyle, { color: ThemeManager.colors.subTitle1 }]}
                hideBottom={true}
                text={merchantCard.paymentCurrency}
              />

              <CardViewoption
                marginTop={-10}
                disabled
                customTypeTextStyle={styles.customTxtstyle1}
                customTextStyle={[styles.customTxtstyle, { color: ThemeManager.colors.subTitle1 }]}
                typeText={`${props.fees} ${'USDT'}`}
                hideBottom={true}
                text={merchantCard.estimatedPaymentAmount}
              />

            </View>

            <Text style={[styles.textStyle1, { color: ThemeManager.colors.inActiveTabText }]}>{merchantCard.walletAddress}</Text>

            <View style={{ marginTop: 12 }}>
              <InputCustomWithQrButton
                editable={false}
                placeHolder={address}
                placeholderTextColor={ThemeManager.colors.txtColor}
                showQrCode={() => { setShowQR(true) }}
                notScan={true}
                isCopy={true}
                doCopy={() => {
                  set_Text_Into_Clipboard();
                  Keyboard.dismiss();
                  toast.current?.show(alertMessages.copied);
                }}
                image={Images.showQr}
                customIcon={Images.sendOutlined}
                customIconPress={() => {
                  console.log('coin_data:::', props.coin_data);
                  if (props.coin_data?.hasOwnProperty('coin_symbol')) {
                    Actions.SendTrx({
                      selectedCoin: props.coin_data,
                      from: 'referral',
                      fee: props.fees,
                      address: address,
                      currency: '$',
                      next_level_refTyp: props.next_level_refTyp
                    });
                  } else {
                    console.log('else::::');
                    setShowAlertDialog(true);
                    setAlertTxt(alertMessages.PleaseactivateTronUSDT);
                  }
                }}
              />
            </View>
          </View>

        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 45, }}>
          <Button
            onPress={() => onPressDone()}
            myStyle={[styles.myStyle]}
            buttontext={merchantCard.done}
          />
        </View>

      </ScrollView>

      {/* /****************************************************************************************** */}
      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent={true}
        visible={showOR}
        onRequestClose={() => { setShowQR(false) }}>
        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
        <View style={[styles.centeredView]}>
          <View style={[styles.modalView, { backgroundColor: ThemeManager.colors.bottomSheetColor, borderColor: ThemeManager.colors.Mainbg }]}>
            <Text style={[styles.QrText, { color: ThemeManager.colors.Text }]}>{merchantCard.scanQRcode}</Text>
            <TouchableOpacity style={{ marginTop: -36 }} onPress={() => { setShowQR(false) }}>
              <Image style={{ height: 33, width: 33, alignSelf: 'flex-end' }} source={ThemeManager.ImageIcons.cancel} />
            </TouchableOpacity>
            <View style={styles.ViewStyle3}>

            </View>
          </View>
        </View>
      </Modal>

      {/* /****************************************************************************************** */}
      <CustomCongratsModel
        textStyle={[styles.textStyle, { color: ThemeManager.colors.lightText }]}
        openModel={showCongrats}
        dismiss={() => { dismissModal() }}
        title1={commonText.Congratulations}
        title2={commonText.paymentDoneRequestForApproval}
      />

      {/* /****************************************************************************************** */}
      {showAlertDialog && (
        <AppAlert
          showSuccess={false}
          alertTxt={alertTxt}
          hideAlertDialog={() => { setShowAlertDialog(false) }}
        />
      )}

      {/* /****************************************************************************************** */}
      <Toast
        ref={toast}
        position="bottom"
        positionValue={210}
        style={{ backgroundColor: ThemeManager.colors.toastBg }}
      />

      {/* <LoaderView isLoading={this.state.loading} /> */}
    </View>
  )
}

export default PayFee