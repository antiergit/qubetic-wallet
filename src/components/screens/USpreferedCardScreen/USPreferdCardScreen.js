import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Header, LoaderView } from '../../common'
import styles from './USPreferedCardScreenStyles'
import { ThemeManager } from '../../../../ThemeManager'
import { Actions } from 'react-native-router-flux'
import USPreferedCard from '../USPreferedCard/USPreferedCard'
import { LanguageManager } from '../../../../LanguageManager'

const USPreferdCardScreen = (props) => {
    const [loading, setLoading] = useState(false);
    return (
        <View style={styles.mainView}>
            <Header
                BackButtonText={LanguageManager.merchantCard.premBlack}
                bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
                backCallBack={() => {
                    Actions.jump('PrepaidCard');
                }}
            />
            <View style={{ flex: 1, marginTop: 10 }}>
                <USPreferedCard navigation={props.navigation} usCardData={props.usCardData} loading={loading} setLoading={setLoading} />
            </View>
            <LoaderView isLoading={loading} />
        </View>
    )
}

export default USPreferdCardScreen