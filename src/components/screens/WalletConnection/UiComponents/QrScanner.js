import { View, Text, Modal, StyleSheet, ImageBackground, Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { LanguageManager } from '../../../../../LanguageManager'
import { HeaderMain, QRCodeScannerNew } from '../../../common'
import { ThemeManager } from '../../../../../ThemeManager'
import { BlurView } from '@react-native-community/blur'
import images from '../../../../theme/Images'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { Fonts, Images } from '../../../../theme'
import { getDimensionPercentage, hasNotchWithIOS } from '../../../../Utils'

const QrScanner = ({ isVisible, onClose, onRead }) => {
    return (
        <Modal visible={isVisible}
            style={{ backgroundColor: ThemeManager.colors.Mainbg }}
            onRequestClose={onClose}>
            <View>
                <View style={{
                    position: "absolute",
                    left: 15,
                    right: 15,
                    justifyContent: "space-between",
                    top: hasNotchWithIOS() ? 80 : 60, zIndex: 1, flexDirection: "row",
                }}>
                    <TouchableOpacity
                        onPress={onClose}>
                        <Image
                            source={Images.arrowLeft}
                            style={[
                                { tintColor: ThemeManager.colors.blackWhiteText },
                            ]}
                        />
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: 16, color: ThemeManager.colors.blackWhiteText,
                        fontFamily: Fonts.dmMedium,
                        fontSize: getDimensionPercentage(18),
                        lineHeight: getDimensionPercentage(20),
                        fontWeight: "bold"
                    }}>{LanguageManager.walletConnection.scanQR}</Text>
                    <View style={{ width: 20 }} />
                </View>
                <View style={{ backgroundColor: ThemeManager.colors.Mainbg }}>


                    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>

                        <View style={{ flex: 1, marginTop: "60%", backgroundColor: ThemeManager.colors.Mainbg }}>

                            <QRCodeScannerNew
                                cameraStyle={{ backgroundColor: ThemeManager.colors.Mainbg, }}
                                onRead={onRead}
                            />

                        </View>
                    </View>
                </View>
                <Image
                    resizeMode='contain'
                    source={images.qrBg} style={[{
                        width: Dimensions.get('screen').width,
                        height: Dimensions.get('screen').height,
                        resizeMode: "contain",
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: -20,
                        bottom: 0,
                    }]} />

                {/* <View style={{ flex: 1, backgroundColor: "red" }}>

            </View> */}
            </View>

        </Modal>
    )
}

export default QrScanner