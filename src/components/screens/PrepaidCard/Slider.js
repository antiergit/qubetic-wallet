import { View, Text, ImageBackground, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './PrepaidCardStyle';
import { Colors, Images } from '../../../theme';
import FastImage from 'react-native-fast-image';
import ContentLoader, { FacebookLoader, InstagramLoader, Bullets } from 'react-native-easy-content-loader';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import { AppAlert, Header, LoaderView } from '../../common';
import WebView from 'react-native-webview';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { ConfirmAlert } from '../../common/ConfirmAlert';

const Slider = ({
  userData1,
  virtualCardStatus,
  physicalCardStatus,
  activeTab,
  setCurrentIndex,
  pager_ref,
  cardStatusError,
  cardDetails,
  usPreferedCardStatus,
  props
}) => {

  const [showCardDetail, setShowCardDetail] = useState(false);
  const [showCardDetailModal, setShowCardDetailModal] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('')
  const { detailTrx, merchantCard, alertMessages } = LanguageManager;

  /******************************************************************************************/
  useEffect(() => {
    console.log(userData1, '::::::', cardDetails, 'chk physicalCardStatus:::::::', physicalCardStatus)
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      // console.log('chk usPreferedCardSta1111tus:::::::',)
      setShowAlertDialog(false);
      setShowCardDetailModal(false);
      setShowCardDetail(false)
    });
    props.navigation.addListener('didBlur', () => {
      setShowAlertDialog(false);
      setShowCardDetailModal(false);
      setShowCardDetail(false)
    });
  }, []);

  /******************************************************************************************/
  const VirtualCardFront = () => {
    return (
      <View style={styles.flex1}>
        <View style={styles.virtualCardFront}>
          {virtualCardStatus != 'inactive' && virtualCardStatus != 'fee pending' && (<Text style={styles.statusText} allowFontScaling={false}>{detailTrx.Status}:{' '}<Text style={{ ...styles.textStyle11, color: getStatusColor(virtualCardStatus, 'virtual') }} allowFontScaling={false}>{getStatus(virtualCardStatus, 'virtual')}</Text></Text>)}
        </View>
        <CardDetail />
      </View>
    );
  };

  /******************************************************************************************/
  const getStatusColor = (status, type) => {
    console.log('status:::', virtualCardStatus);
    let color = '#019B01';
    if (type == 'usp') {
      if (status?.toLowerCase() == 'applied' || status?.toLowerCase() == 'kyc_in_review') {
        color = '#fbcf0d';
      } else if (status?.toLowerCase() == 'rejected') {
        color = '#ff1111';
      } else if (status?.toLowerCase() == 'activated' || status?.toLowerCase() == 'issued') {
        color = '#74d2e9';
      } else {
        color = '#019B01';
      }
    } else {
      if (status?.toLowerCase() == 'applied') {
        color = '#CC2131';
      } else if (status?.toLowerCase() == 'kyc_in_review') {
        color = '#1960C9';
      } else if (status?.toLowerCase() == 'rejected') {
        color = '#CF6823';
      } else if (status?.toLowerCase() == 'activated' || status?.toLowerCase() == 'issued') {
        color = '#1960C9';
      } else {
        color = '#019B01';
      }
    }
    return color;
  };

  /******************************************************************************************/
  const getStatus = (status, type) => {
    console.log('status:::', status);
    if (status?.toLowerCase() == 'applied' || (status?.toLowerCase() == 'kyc_in_review' && type == 'usp')) {
      return merchantCard.Applied;
    } else if (status?.toLowerCase() == 'rejected') {
      return merchantCard.rejected;
    } else if (status?.toLowerCase() == 'issued' || (status?.toLowerCase() == 'kyc_in_review' && type == 'physical')) {
      return merchantCard.issued;
    } else if (status?.toLowerCase() == 'activated') {
      return merchantCard.activated;
    }
  };


  /******************************************************************************************/
  const PhysicalCardFront = () => {
    return (
      <View style={styles.flex1}>
        {activeTab == 1 ? (!(physicalCardStatus == 'inactive') && (<View style={{ flex: (physicalCardStatus == 'inactive' ? 0.1 : physicalCardStatus == 'applied') ? 0.2 : 0.5, padding: 15 }}>
          {physicalCardStatus != 'inactive' && (<Text style={styles.statusText} allowFontScaling={false}>{detailTrx.Status}:{' '}<Text allowFontScaling={false} style={{ ...styles.textStyle11, color: getStatusColor(physicalCardStatus, 'physical') }}>{physicalCardStatus == 'Activation In Progress' ? merchantCard.issued : getStatus(physicalCardStatus, 'physical')}</Text></Text>)}
        </View>
        )) : (
          <View style={{ flex: (physicalCardStatus == 'inactive' || physicalCardStatus == 'applied') ? 0.1 : 0.5, padding: 15 }}>
            {physicalCardStatus != 'inactive' && (<Text style={styles.statusText} allowFontScaling={false}>{detailTrx.Status}:{' '}<Text style={{ ...styles.textStyle11, color: getStatusColor(physicalCardStatus, 'physical') }} allowFontScaling={false}>{getStatus(physicalCardStatus, 'physical')}</Text></Text>)}
          </View>
        )}
        {(physicalCardStatus == 'inactive' || physicalCardStatus == 'applied') ? (<BeforeLink />) : (<CardDetail />)}
      </View>
    );
  };

  /******************************************************************************************/
  const BeforeLink = () => {
    return (
      <View style={styles.beforeLinkContainer}>
        <Text allowFontScaling={false} style={[styles.beforLinkInstrction, { top: physicalCardStatus == 'applied' ? -20 : 0 }]}>{merchantCard.virtualVersionAppearHere}</Text>
      </View>
    );
  };

  /******************************************************************************************/
  const CardDetail = () => {
    return (
      <View style={styles.cardMainContainer}>
        <View style={styles.cardDetailTop}>
          <View style={styles.cardNumberContainer}>
            {showCardDetail ? (
              <>
                <Text allowFontScaling={false} style={styles.cardNumber}>{cardDetails?.card_number?.substring(0, 4)}</Text>
                <Text allowFontScaling={false} style={styles.cardNumber}>{' '}{cardDetails?.card_number?.substring(4, 8)}</Text>
                <Text allowFontScaling={false} style={styles.cardNumber}>{' '}{cardDetails?.card_number?.substring(8, 12)}</Text>
                <Text allowFontScaling={false} style={styles.cardNumber} >{' '}{cardDetails?.card_number?.substring(12, 16)}</Text>
              </>
            ) : (
              <>
                <Text allowFontScaling={false} style={styles.cardNumber}>****</Text>
                <Text allowFontScaling={false} style={styles.cardNumber}>{' '}****</Text>
                <Text allowFontScaling={false} style={styles.cardNumber}>{' '}****</Text>
                <Text allowFontScaling={false} style={styles.cardNumber}>{' '}****</Text>
              </>
            )}
          </View>
          <View style={{ width: '20%', marginBottom: 10, alignItems: 'flex-end' }}>
            {activeTab == 0 ? (virtualCardStatus == 'issued' && (
              <TouchableOpacity onPress={() => setShowCardDetail(!showCardDetail)}>
                <FastImage source={showCardDetail ? Images.view : Images.hide} style={styles.eyeImage} resizeMode="contain" />
              </TouchableOpacity>
            )
            ) : (
              ((physicalCardStatus != 'activated') ? null : <TouchableOpacity onPress={() => setShowCardDetail(!showCardDetail)}>
                <FastImage source={showCardDetail ? Images.view : Images.hide} style={styles.eyeImage} resizeMode="contain" />
              </TouchableOpacity>)
            )}
          </View>
        </View>
        {activeTab == 0 ? (virtualCardStatus == 'issued' && (
          <View style={styles.virtualCardBottom}>
            <Text allowFontScaling={false} style={styles.nameStyle}>{cardDetails?.first_name + ' ' + cardDetails?.last_name}</Text>
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <View>
                <Text allowFontScaling={false} style={[styles.validThru, { color: activeTab == 2 ? Colors.White : ThemeManager.colors.colorVariation }]}>{merchantCard.valid}</Text>
                <Text allowFontScaling={false} style={[styles.validThru, { color: activeTab == 2 ? Colors.White : ThemeManager.colors.colorVariation }]}>{merchantCard.THRU}</Text>
              </View>
              <Text allowFontScaling={false} style={[styles.datetext, { color: activeTab == 2 ? Colors.White : ThemeManager.colors.colorVariation }]}>{cardDetails?.expire}</Text>
            </View>
          </View>
        )
        ) : (physicalCardStatus != 'activated') ? null
          :
          <View style={styles.virtualCardBottom}>
            <Text allowFontScaling={false} style={styles.nameStyle}>{cardDetails?.first_name + ' ' + cardDetails?.last_name}</Text>
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              {cardDetails?.expire ?
                <View>
                  <Text allowFontScaling={false} style={[styles.validThru, { color: activeTab == 2 ? Colors.White : ThemeManager.colors.colorVariation }]}>{merchantCard.valid}</Text>
                  <Text allowFontScaling={false} style={[styles.validThru, { color: activeTab == 2 ? Colors.White : ThemeManager.colors.colorVariation }]}>{merchantCard.THRU}</Text>
                </View>
                : null
              }
              <Text allowFontScaling={false} style={[styles.datetext, { color: activeTab == 2 ? Colors.White : ThemeManager.colors.colorVariation }]}>{cardDetails?.expire}</Text>
            </View>
          </View>
        }
      </View>
    );
  };

  /******************************************************************************************/
  const USPreferedCardFront = () => {
    return (
      <View style={styles.flex1}>
        <View style={{ flex: 0.5 }}>
          <View style={styles.virtualCardFront}>
            {usPreferedCardStatus?.toLowerCase() != 'inactive' && usPreferedCardStatus?.toLowerCase() != 'fee pending' && usPreferedCardStatus?.toLowerCase() != 'kyc_pending' && (<Text style={[styles.statusText, { color: ThemeManager.colors.Mainbg }]} allowFontScaling={false}>{detailTrx.Status}:{' '}<Text style={{ ...styles.textStyle11, color: getStatusColor(usPreferedCardStatus, 'usp') }} allowFontScaling={false}>{usPreferedCardStatus?.toLowerCase() == 'kyc_in_review' ? merchantCard.Applied : getStatus(usPreferedCardStatus, 'usp')}</Text></Text>)}
          </View>
        </View>

        <View style={{ flex: 0.5 }}>
          <View style={styles.cardMainContainer}>
            <View style={styles.cardDetailTop}>
              <View style={[styles.cardNumberContainer, { marginBottom: 10 }]}>
                <>
                  <Text allowFontScaling={false} style={styles.cardNumberUSPrefered}>****</Text>
                  <Text allowFontScaling={false} style={styles.cardNumberUSPrefered}>****</Text>
                  <Text allowFontScaling={false} style={styles.cardNumberUSPrefered}>****</Text>
                  <Text allowFontScaling={false} style={styles.cardNumberUSPrefered}>****</Text>
                </>
              </View>

              {(usPreferedCardStatus?.toLowerCase() == 'issued') ?
                <View style={{ width: '20%', alignItems: 'center', marginTop: -8 }}>
                  <TouchableOpacity onPress={() => { setShowAlertDialog(true); setAlertTxt(merchantCard.ViewCardDetails + userData1?.email) }}>
                    <FastImage tintColor={Colors.White} source={showCardDetail ? Images.view : Images.hide} style={styles.eyeImage} resizeMode="contain" />
                  </TouchableOpacity>
                </View>
                :
                <View style={{ width: "20%", alignItems: 'center' }} />
              }
            </View>
            {(usPreferedCardStatus?.toLowerCase() == 'issued') ?
              <View style={styles.virtualCardBottom}>
                <Text allowFontScaling={false} style={[styles.nameStyle, { color: 'white' }]}>{cardDetails?.first_name + ' ' + cardDetails?.last_name}</Text>
              </View>
              :
              <View style={{ width: "20%", alignItems: 'center' }} />
            }
          </View>
        </View>
      </View>
    )
  }

  /******************************************************************************************/
  return (
    <>
      <View style={styles.cardView}>

        <View style={styles.cardView} key={0}>
          <FastImage
            style={styles.imageBackgroundStyles}
            source={Images.USPreferdCardBlack}
            resizeMode="stretch"
          />
          <View style={styles.absoluteView}>
            {<USPreferedCardFront />}
          </View>
        </View>

      </View>

      {/* /****************************************************************************************** */}
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={showCardDetailModal}
        onRequestClose={() => { setShowCardDetailModal(false); setShowCardDetail(false) }}>
        <SafeAreaView style={{ flex: 1, }}>
          <Header backCallBack={() => { setShowCardDetailModal(false); setShowCardDetail(false) }} BackButtonText={merchantCard.cardDetail} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
          <WebView
            onLoadStart={() => { setisLoading(true) }}
            style={{ flex: 1 }}
            source={{ uri: cardDetails?.link_details }}
            onLoadEnd={() => {
              setTimeout(() => {
                setisLoading(false);
              }, 1000);
            }}
          />
          {isLoading == true && <LoaderView isLoading={isLoading} />}
        </SafeAreaView>
      </Modal>
      {showAlertDialog && (
        <ConfirmAlert
          text={alertMessages.Ok}
          alertTxt={alertTxt}
          hideAlertDialog={() => { setShowAlertDialog(false); setShowCardDetailModal(false) }}
          ConfirmAlertDialog={() => { setShowAlertDialog(false); setShowCardDetailModal(true) }}
        />
      )}
    </>
  );


};

export default Slider;
