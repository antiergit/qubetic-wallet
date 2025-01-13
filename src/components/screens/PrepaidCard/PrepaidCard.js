import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
} from 'react-native';
import { Button, Header, LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './PrepaidCardStyle';
import { Actions } from 'react-native-router-flux';
import { useEffect } from 'react';
import { Images } from '../../../theme';
import { LanguageManager } from '../../../../LanguageManager';
import Singleton from '../../../Singleton';
import { useDispatch } from 'react-redux';
import { getAllCards } from '../../../Redux/Actions';
import PhysicalCard from './PhysicalCard';
import FastImage from 'react-native-fast-image';

const PrepaidCard = props => {
  const Arr = ['****', '****', '****', '****']
  const dispatch = useDispatch();
  const { merchantCard } = LanguageManager;
  // const [activeTab, setActiveTab] = useState(props.from?.toLowerCase()?.includes('physical') ? 1 : 0);
  const [activeTab, setActiveTab] = useState(props.from?.toLowerCase()?.includes('physical') ? 1 : 1);
  const [usCardData, setUsCardData] = useState('');
  const [physicalCardData, setPhysicalCardData] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertTxt, setAlertTxt] = useState('')
  const [virtualCardData, setVirtualCardData] = useState('');
  const [loading, setLoading] = useState(true);

  /******************************************************************************************/
  useEffect(() => {
    getCardList();
    props.navigation.addListener('didFocus', () => {
      getCardList();
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    });
    props.navigation.addListener('didBlur', () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    });
  }, []);

  /******************************************************************************************/
  const handleBackButtonClick = () => {
    console.log('Backhandler prepaid cards::::::isKyc', props.isKyc);

    if (props.isMainWallet) {
      Actions.pop();
      return true;
    } else if (props.isKyc) {
      Singleton.bottomBar?.navigateTab('Settings');
      Actions.jump('Settings');
      return true;
    } else {
      Actions.pop();
      return true;
    }
  };

  /******************************************************************************************/
  const getCardList = () => {
    props.from?.toLowerCase()?.includes('physical') ? setLoading(false) : setLoading(true);
    setTimeout(() => {
      dispatch(getAllCards({})).then(res => {
        console.log('chk all list cards res:::::', res);
        if (res.length > 0) {
          res.map((item, index) => {
            item.card_type?.toLowerCase() == 'virtual' ? setVirtualCardData(item) : item.card_type?.toLowerCase() == 'us_preferred' ? setUsCardData(item) : item.card_type?.toLowerCase() == 'physical' ? setPhysicalCardData(item) : ''
          })
        } else {
          setVirtualCardData('');
          setUsCardData('');
          setPhysicalCardData('');
        }
        setLoading(false);
      }).catch(err => {
        console.log('chk all list cards err:::::', err);
        setShowAlertDialog(true);
        setAlertTxt(err)
        setLoading(false);
      })
    }, 100);
  }

  /******************************************************************************************/
  const cardImage = (isVirtual, data) => {
    return (
      <View style={[styles.cardView, { marginHorizontal: 12, marginTop: 15 }]} >
        <FastImage
          style={styles.imageBackgroundStyles}
          source={isVirtual ? Images.cardFront : Images.USPreferdCardBlack}
          resizeMode="stretch"
        />
        <View style={styles.absoluteView}>
          <View style={{ flex: 0.5 }}>
          </View>
          <View style={{ flex: 0.5 }}>
            <View style={styles.cardMainContainer}>
              <View style={styles.cardDetailTop}>
                <View style={[styles.cardNumberContainer]}>
                  <>
                    {Arr.map((item, index) => {
                      return (
                        <Text allowFontScaling={false} style={[styles.cardNumberUSPrefered, { color: isVirtual ? !data?.card_user_data ? ThemeManager.colors.urlLinkColor : ThemeManager.colors.colorVariation : ThemeManager.colors.Mainbg }]}>{item}</Text>
                      )
                    })}
                  </>
                  <View style={{ width: "10%", alignItems: 'center', backgroundColor: 'pink' }} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }

  /******************************************************************************************/
  const showUspView = () => {
    return (
      <>
        {loading ? null :
          <ScrollView bounces={false} showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
            {/*+++++++++++++++++++++++++ Premium Card ++++++++++++++++++++*/}

            {usCardData ?
              <View style={styles.premium}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.textPrem}>{merchantCard.premBlack}</Text>
                </View>
                <View >
                  {cardImage(false, usCardData)}
                  <View style={styles.ViewStyle8}>
                    <Button
                      onPress={() => { usCardData && (Actions.currentScene !== 'USPreferdCardScreen' && Actions.USPreferdCardScreen({ usCardData: usCardData })) }}
                      buttontext={merchantCard.proceed}
                    />
                  </View>

                </View>
              </View>
              : null}
            {/*+++++++++++++++++++++++++ Metalic Card ++++++++++++++++++++*/}
            {virtualCardData ?
              <View style={[styles.premium1, { paddingBottom: !virtualCardData?.card_user_data ? 20 : 0 }]}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.textPrem, { color: !virtualCardData?.card_user_data ? ThemeManager.colors.urlLinkColor : ThemeManager.colors.colorVariation }]}>{merchantCard.metallicBlack}</Text>
                </View>
                <View>
                  {cardImage(true, virtualCardData)}
                  {!virtualCardData?.card_user_data ? null : <View style={styles.ViewStyle8}>
                    <Button
                      onPress={() => { Actions.currentScene !== 'VirtualCardScreen' && Actions.VirtualCardScreen() }}
                      buttontext={merchantCard.proceed}
                    />
                  </View>}

                </View>
              </View>
              :
              null}

          </ScrollView>
        }
      </>
    )
  }
  /******************************************************************************************/
  return (
    <View style={[styles.mainView, { backgroundColor: ThemeManager.colors.Mainbg }]}>
      <Header
        BackButtonText={merchantCard.prepaidCard}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
        backCallBack={() => { props.isMainWallet ? Actions.pop() : Actions.Settings(); }}
      />

      <View style={[styles.tabContainer, { backgroundColor: ThemeManager.colors.modalCard }]}>
        {/* <TouchableOpacity
          style={activeTab == 0 ? styles.activeTab : styles.inActiveTab}
          onPress={() => { setActiveTab(0); }}
          disabled={true}>
          <Text allowFontScaling={false} style={activeTab == 0 ? styles.activeTabText : styles.inActiveTabText}>{merchantCard.virtualCard}</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={activeTab == 0 ? styles.activeTab : styles.inActiveTab} onPress={() => { activeTab == 0 ? '' : setActiveTab(0) }}>
          <Text allowFontScaling={false} style={activeTab == 0 ? styles.activeTabText : styles.inActiveTabText}>{merchantCard.virtualCard}</Text>
        </TouchableOpacity> */}
        <TouchableOpacity disabled={true} style={activeTab == 1 ? [styles.activeTab, { backgroundColor: ThemeManager.colors.activeTab }] : styles.inActiveTab} onPress={() => { activeTab == 1 ? '' : setActiveTab(1) }}>
          <Text allowFontScaling={false} style={activeTab == 1 ? [styles.activeTabText, { color: ThemeManager.colors.bgQr }] : [styles.inActiveTabText, { color: ThemeManager.colors.inActiveTabText }]}>{merchantCard.physicalCard}</Text>
        </TouchableOpacity>
      </View>
      <>
        {activeTab == 0 ? (showUspView()) : (<PhysicalCard navigation={props.navigation} physicalCardData={physicalCardData || props.physicalCardData} loading={loading} setLoading={setLoading} />)}
      </>
      <LoaderView isLoading={loading} />
    </View>
  );
};
export default PrepaidCard;
