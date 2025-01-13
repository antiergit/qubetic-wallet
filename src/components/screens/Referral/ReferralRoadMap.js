import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Platform, ScrollView, Text, View } from 'react-native'
import { Colors, Images } from '../../../theme'
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import { Button, Header, LoaderView } from '../../common';
import styles from './ReferralStyle';
import { Actions } from 'react-native-router-flux';
import { getData, heightDimen } from '../../../Utils/MethodsUtils';
import * as Constants from '../../../Constants';
import { useDispatch } from 'react-redux';
import { getRoadMap } from '../../../Redux/Actions';

let localIndex = ''
let localHeight = 100
const ReferralRoadMap = (props) => {
  const { referral } = LanguageManager;
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('en');
  const [roadMap, setRoadMap] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [height, setHeight] = useState(localHeight);

  /******************************************************************************************/
  useEffect(() => {
    props.navigation.addListener('didFocus', () => {
      getLanguage();
      getLevel();
    })
  }, [])

  /******************************************************************************************/
  const getLevel = async () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(getRoadMap()).then(res => {
        console.log('chk roadmap res::::::', res)
        if (res.length > 0) {
          const newItem = res.findIndex(item => item.referrals_user_data != null)
          console.log('chk roadmap newItem::::::', newItem)
          localIndex = newItem
        }
        setLoading(false);
        setRoadMap(res)
      }).catch(err => {
        setLoading(false)
      })
    }, 200);
    const lang = await getData(Constants.SELECTED_LANGUAGE) || 'en'
    setLanguage(lang)
  }

  /******************************************************************************************/
  const getLanguage = async () => {
    const lang = await getData(Constants.SELECTED_LANGUAGE) || 'en'
    setLanguage(lang)
  }

  /******************************************************************************************/
  const getStrokeHeight = (index) => {
    console.log(height, 'localHeight,::::::', localHeight, 'DimHeight', Dimensions.get('screen').height)
    const isDim = Dimensions.get('screen').height < 900
    const isDim8 = Dimensions.get('screen').height > 850 && Dimensions.get('screen').height < 900
    const isDim6 = Dimensions.get('screen').height < 700
    console.log(isDim6, 'isDim6,::::::', isDim, 'isDim:::::')
    let hght = 95;
    if (language == 'en') {
      hght =
        index == 0 ? isDim6 ? heightDimen(localHeight) : (Platform.OS == 'android' ? heightDimen(localHeight / 1.5) : isDim ? heightDimen(localHeight / 1.35) : heightDimen(localHeight / 1.55)) :
          index == 1 ? isDim6 ? heightDimen(localHeight + 48) : (Platform.OS == 'android' ? heightDimen(localHeight / 1.2) : isDim ? heightDimen(localHeight / 1.06) : heightDimen(localHeight / 1.25)) :
            (index == 2 || index == 3) ? isDim6 ? heightDimen(localHeight + 135) : (Platform.OS == 'android') ? (isDim8 ? heightDimen(localHeight + 23) : isDim ? heightDimen(localHeight + 2) : localHeight) : (isDim ? heightDimen(localHeight + 20) : localHeight) : 95
    } else {
      hght =
        index == 0 ? isDim6 ? heightDimen(localHeight) : heightDimen(localHeight / 1.5) :
          index == 1 ? isDim6 ? heightDimen(localHeight + 48) : (Platform.OS == 'android' ? heightDimen(localHeight / 1.2) : heightDimen(localHeight / 1.25)) :
            (index == 2 || index == 3) ? isDim6 ? heightDimen(localHeight + 135) : isDim8 ? (localHeight + 12) : isDim ? (localHeight + 10) : (Platform.OS == 'android') ? localHeight : heightDimen(localHeight - 9) : 95
    }
    return hght;
  }

  /******************************************************************************************/
  const getHeightView = (height) => {
    console.log('height,::::::', height)
    localHeight = height
    setHeight(height);
  }

  /******************************************************************************************/
  return (
    <>
      <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
        <Header
          BackButtonText={referral.referralRoadMap}
          bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
        />
        <ScrollView
          bounces={false}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}>
          <View style={{ marginTop: 40 }}>
            {roadMap.map((item, index) => {
              return (
                <View style={{ marginHorizontal: 22 }}>
                  <View style={styles.ViewStyle8}>
                    <View style={{ flexDirection: 'row', }}>

                      <View style={styles.ViewStyle7}>
                        <View style={styles.imgView}>
                          {index <= localIndex ? <Image source={ThemeManager.ImageIcons.radioActive} /> : <Image source={ThemeManager.ImageIcons.radioInactive} />}
                        </View>
                        {<View style={{ minHeight: heightDimen(getStrokeHeight(index)), width: 5, backgroundColor: (index == roadMap.length - 1) ? 'transparent' : ThemeManager.colors.borderColor }} />}
                      </View>
                      <Text style={[styles.textstyle2, { color: index <= localIndex ? ThemeManager.colors.Text : ThemeManager.colors.lightText }]}>{referral.step} {index + 1}</Text>

                      <View style={{ flex: 0.7 }}>
                        <View style={[styles.ViewStyle6, { backgroundColor: index == 0 ? Colors.bg1 : index == 1 ? Colors.bg2 : index == 2 ? Colors.bg3 : Colors.bg4 }]}
                          onLayout={(event) => {
                            const { width, height } = event.nativeEvent.layout;
                            console.log(width, 'chk height::::::width::::::', height, ':::::::::', index)
                            index == (roadMap?.length - 1) && getHeightView(height);
                          }}
                        >
                          <Text style={styles.textstyle3}>{item.type}</Text>
                          {item.referral_data ? <Text style={styles.textstyle4}>{item.referral_data}</Text> : null}
                        </View>
                      </View>

                    </View>

                  </View>
                </View>
              )
            })}


          </View>
          {(roadMap.length > 0) ?
            <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 40 }}>
              <Button
                onPress={() => Actions.currentScene != 'Referral' && Actions.Referral()}
                myStyle={[styles.myStyle]}
                buttontext={referral.getStarted}
              />
            </View>
            : null}
        </ScrollView>
        <LoaderView isLoading={isLoading} />

      </View>
    </>
  )
}

export default ReferralRoadMap