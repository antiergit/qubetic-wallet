import { View, Modal, SafeAreaView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemeManager } from '../../../ThemeManager'
import { BlurView } from '@react-native-community/blur'
import { Fonts, Images } from '../../theme'
import WebView from 'react-native-webview'
import { LoaderView } from './LoaderView'
import { tradingWebView } from '../../Utils/MethodsUtils'

const GraphComponent = ({ headerText, openModel, onPressClose, graphData }) => {
    return (
        <Modal
            statusBarTranslucent
            animationType="fade"
            transparent={true}
            visible={openModel}
            onRequestClose={onPressClose}>

            <BlurView
                style={StyleSheet.absoluteFillObject}
                blurType="light"
                blurAmount={2}
                reducedTransparencyFallbackColor="white"
            />
            <View style={{ flex: 0.1, }} />
            <SafeAreaView style={[styles.mainView, { backgroundColor: ThemeManager.colors.mnemonicsBg, }]}>
                <View style={styles.headerView}>
                    <View />
                    <Text style={[styles.headerText, { color: ThemeManager.colors.blackWhiteText }]}>{headerText}</Text>
                    <TouchableOpacity onPress={onPressClose}>
                        <Image source={Images.close_icon} style={[styles.closeIcon, { tintColor: ThemeManager.colors.blackWhiteText }]} />
                    </TouchableOpacity>
                </View>
                <WebView
                    style={{ flex: 1, backgroundColor: ThemeManager.colors.mnemonicsBg }}
                    source={{
                        html: tradingWebView(null, 'dark', ThemeManager.colors.mnemonicsBg, graphData),

                    }}
                    startInLoadingState={true} />
            </SafeAreaView>
        </Modal>
    )
}
const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerText: {
        fontSize: 20,
        fontFamily: Fonts.dmMedium,
    },
    closeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
})

export default GraphComponent