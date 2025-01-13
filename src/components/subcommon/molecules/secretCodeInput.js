import { StyleSheet, Text, View, Image, ImageBackground, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '../../../layouts/responsive'
import { ThemeManager } from '../../../../ThemeManager'
import images from '../../../theme/Images'
import KeyPad from './keyPad'
import { getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils'
import { Fonts } from '../../../theme'
import { log } from '../../../../ios/trust-min'

const SecretCodeInput = ({ biometric, onPress = false, secretTxt, togglePress, toggleStatus }) => {

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: Platform.OS == 'android' ? heightDimen(13) : heightDimen(20)
            }}>
                {secretTxt?.map((char, index) => {
                    return (
                        <View style={[styles.itemsStyle, { borderColor: (char) ? ThemeManager.colors.pinColor : ThemeManager.colors.inputBorder, }]}>
                            <Text style={[styles.secretText, { color: ThemeManager.colors.pinColor }]}>{char ? "*" : ""}</Text>
                        </View>
                    );
                })}
            </View>
            <View style={{
                marginTop: Platform.OS == 'android' ? heightDimen(20) : heightDimen(30),
            }}>
                <Text style={[{ ...styles.securityText, color: ThemeManager.colors.blackWhiteText }]}>Adds an extra layer of security when using the app</Text>
                {biometric ? <View
                    style={{ ...styles.biomatricView, backgroundColor: ThemeManager.colors.darkGreyBg }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Image source={images.se} />
                        <Text style={{ color: ThemeManager.colors.blackWhiteText, marginHorizontal: widthDimen(12) }}>Enable Biometric</Text>
                        <TouchableOpacity onPress={togglePress}>
                            <Image source={toggleStatus ? images.toggleGreen1 : images.ToggleOff} />
                        </TouchableOpacity>

                    </View>
                </View> : <View style={{ height: getDimensionPercentage(50), }}></View>}
            </View>
            <View>
                {onPress && <KeyPad onPress={onPress} />}
            </View>
        </View>

    )
}

export default SecretCodeInput

const styles = StyleSheet.create({
    itemsStyle: {
        width: getDimensionPercentage(50),
        height: getDimensionPercentage(50), // Set width and height to create a circle
        borderRadius: getDimensionPercentage(14), // Half of width/height to create a circle
        alignItems: 'center',
        borderWidth: widthDimen(1),
        justifyContent: 'center',
    },
    secretText: {
        fontSize: getDimensionPercentage(22),
        fontFamily: Fonts.dmMedium,
        textAlign: 'center',
        alignSelf: "center",
        textAlign: "center",
        lineHeight: getDimensionPercentage(27.52),
        paddingTop: heightDimen(10),
        // padding: Platform.OS == 'ios' ? getDimensionPercentage(20) : getDimensionPercentage(15),
    },
    securityText: {
        fontSize: getDimensionPercentage(18),
        fontFamily: Fonts.dmMedium,
        lineHeight: getDimensionPercentage(23),
        marginRight: widthDimen(30),
    },
    biomatricView: {
        width: widthDimen(250),
        height: getDimensionPercentage(50),
        justifyContent: 'center',
        borderRadius: 14,
        overflow: 'hidden',
        paddingHorizontal: widthDimen(16),
        marginTop: heightDimen(30),
        // marginBottom:10
        // marginHorizontal: horizontalScale(50),

    },
    lockImg: {
        width: getDimensionPercentage(71),
        height: getDimensionPercentage(118),
        alignSelf: 'center',
        // marginTop: Platform.OS == 'android' ? heightDimen(40) : heightDimen(50)
        marginTop: Platform.OS == 'android' ? heightDimen(52) : heightDimen(40)

    }
})