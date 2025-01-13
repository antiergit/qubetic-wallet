import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemeManager } from '../../../ThemeManager'
import { Fonts } from '../../theme'
import { LanguageManager } from '../../../LanguageManager'

const NftDetailView = ({ Country, Years, ArchitecturalStyle }) => {
    return (
        <View>
            <View
                style={[
                    styles.line,
                    { backgroundColor: ThemeManager.colors.grayGreyBorder, marginHorizontal: 24, marginVertical: 8 },
                ]}
            />
            <View style={styles.detailContainer}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.detailValue, { color: ThemeManager.colors.subTextColor, alignSelf: "flex-start" }]}>{Country}</Text>
                    <Text style={[styles.detailTitle, { color: ThemeManager.colors.legalGreyColor }]}>{LanguageManager.nftData.Country}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.detailValue, { color: ThemeManager.colors.subTextColor, alignSelf: "center" }]}>{Years}</Text>
                    <Text style={[styles.detailTitle, { color: ThemeManager.colors.legalGreyColor, alignSelf: "center" }]}>{LanguageManager.nftData.Years}</Text>
                </View>
                <View style={{ flex: 1}}>
                    <Text style={[styles.detailValue, { color: ThemeManager.colors.subTextColor }]}>{ArchitecturalStyle}</Text>
                    <Text style={[styles.detailTitle, { color: ThemeManager.colors.legalGreyColor, alignSelf: "flex-end" }]}>{LanguageManager.nftData.ArchitecturalStyle}</Text>

                </View>
            </View>
            <View
                style={[
                    styles.line,
                    { backgroundColor: ThemeManager.colors.grayGreyBorder, marginHorizontal: 24, marginVertical: 8 },
                ]}
            />
        </View>
    )
}

export default NftDetailView

const styles = StyleSheet.create({
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 24,
    },
    detailTitle: {
        fontSize: 12,
        marginTop: 10,
        fontFamily: Fonts.dmRegular
    },
    detailValue: {
        color: '#FFFFFF',
        fontSize: 14,
        alignSelf: "flex-end",
        fontFamily: Fonts.dmRegular
    },
    line: {
        height: 1,
        // width: "100%",
    },

})