import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { dimen } from '../../Utils'
import { ThemeManager } from '../../../ThemeManager'
import { Fonts } from '../../theme'

const CommonRow = ({ label, value, image, textStyle, textStyle2, ViewStyle }) => {
    return (
        <View style={[styles.ViewStyle, ViewStyle]}>
            <Text allowFontScaling={false} style={[styles.textStyle, textStyle, { color: ThemeManager.colors.legalGreyColor }]}>{label}</Text>
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "flex-end" }}>
                <Text
                    allowFontScaling={false} style={[styles.textStyle, textStyle2, { color: ThemeManager.colors.blackWhiteText }]}>{value}</Text>
                {image &&
                    <Image source={image} style={{ marginRight: 18 }} />
                }

            </View>

        </View>
    )
}

export default CommonRow

const styles = StyleSheet.create({

    ViewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    textStyle: {
        fontSize: dimen(14),
        // lineHeight: dimen(23),
        fontFamily: Fonts.dmMedium,
        paddingHorizontal: 20
    },
})