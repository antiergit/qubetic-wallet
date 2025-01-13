import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Header, LoaderView } from '../../common'
import styles from './VirtualCardScreenStyles'
import { ThemeManager } from '../../../../ThemeManager'
import { Actions } from 'react-native-router-flux'
import VirtualCard from '../PrepaidCard/VirtualCardOuter';
import { LanguageManager } from '../../../../LanguageManager'

const VirtualCardScreen = (props) => {
    const [loading, setLoading] = useState(false)
    const { merchantCard } = LanguageManager;
    return (
        <View style={styles.mainView}>
            <Header
                BackButtonText={merchantCard.metallicBlack}
                bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
                backCallBack={() => {
                    Actions.pop()
                }}
            />
            <View style={{ flex: 1, marginTop: 10 }}>
                <VirtualCard navigation={props.navigation} loading={loading} setLoading={setLoading} />
            </View>
            <LoaderView isLoading={loading} />
        </View>
    )
}

export default VirtualCardScreen