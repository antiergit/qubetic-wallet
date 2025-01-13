import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemeManager } from '../../../ThemeManager'
import CommonModal from './CommonModal'
import images from '../../theme/Images'
import { LanguageManager } from '../../../LanguageManager'
import { dimen, hasNotchWithIOS, heightDimen, widthDimen } from '../../Utils'
import { Fonts } from '../../theme'
import CommonRow from './CommonRow'
import { Button } from './Button'
import Singleton from '../../Singleton'
import { maskAddress, toFixedExp } from '../../Utils/MethodsUtils'

const ConfirmNftModal = (props) => {
    return (
        <CommonModal
            visible={props.visible}
            onClose={props.onPressCancel}
        >
            <View>
                <View style={{ flexDirection: 'row', marginTop: heightDimen(30) }}>
                    <Image source={{ uri: props.data?.image }} style={styles.imageStyle} />
                    <View style={{ justifyContent: 'center', marginLeft: widthDimen(20) }}>
                        <Text
                            style={[
                                styles.name,
                                { color: ThemeManager.colors.subTextColor },
                            ]}
                        >
                            {props.data?.name}
                        </Text>
                        <Text
                            style={[
                                styles.tokenId,
                                { color: ThemeManager.colors.legalGreyColor },
                            ]}
                        >
                            {LanguageManager.nftData.tokenID}:
                            <Text style={{ color: ThemeManager.colors.subTextColor }}>
                                {' '}
                                #{props.data?.token_id}
                            </Text>
                        </Text>
                        <Text
                            style={[
                                styles.Standard,
                                { color: ThemeManager.colors.legalGreyColor },
                            ]}
                        >
                            {LanguageManager.nftData.Standard}:
                            <Text style={{ color: ThemeManager.colors.subTextColor }}>
                                {' '}
                                {props.data?.token_type}
                            </Text>
                        </Text>
                    </View>
                </View>

                <View style={[styles.rowView, { marginTop: 15, }]}>
                    <CommonRow
                        label={LanguageManager.browser.From}
                        value={maskAddress(Singleton.getInstance().defaultEthAddress, 7)}
                        image={ThemeManager.ImageIcons.copyChainIcon}
                        textStyle={{ fontSize: 16 }}
                        textStyle2={{ fontFamily: Fonts.dmSemiBold }}
                        ViewStyle={{ marginBottom: 10 }}
                    />
                    <CommonRow
                        label={LanguageManager.browser.to}
                        value={maskAddress(props?.toAddress, 7)}
                        image={ThemeManager.ImageIcons.copyChainIcon}
                        textStyle={{ fontSize: 16 }}
                        textStyle2={{ fontFamily: Fonts.dmSemiBold }}
                    />

                </View>
                <View style={[styles.rowView, { marginTop: 8, }]}>
                    <CommonRow label={LanguageManager.sendTrx.networkFees} value={`${props.fees} ETH (${Singleton.getInstance().CurrencySymbol}${toFixedExp(props.nativePrice * props.fees, 2)})`} />
                    <CommonRow label={LanguageManager.commonText.MaxTotal} value={`${Singleton.getInstance().CurrencySymbol}${toFixedExp(props.nativePrice * props.fees, 2)}`} />

                </View>

                <View style={styles.btnViewModal}>
                    <View style={{ marginRight: dimen(8) }}>
                        <Button
                            onPress={props.onPressCancel}
                            buttontext={LanguageManager.sendTrx.Cancel}
                            myStyle={{ width: widthDimen(182), alignItems: "center" }}
                            viewStyle={{
                                backgroundColor: ThemeManager.colors.mnemonicsBg,
                                ...styles.borderButtonStyle
                            }} />
                    </View>
                    <View style={{ marginLeft: dimen(8) }}>
                        <Button
                            onPress={() => { props.onPressContinue() }}
                            myStyle={{ width: widthDimen(182), alignItems: "center" }}
                            buttontext={LanguageManager.pins.Continue}
                        />
                    </View>

                </View>


            </View>
        </CommonModal>
    )
}

export default ConfirmNftModal

const styles = StyleSheet.create({
    imageStyle: {
        height: heightDimen(142),
        width: widthDimen(129),
        borderRadius: dimen(14),
        resizeMode: "contain"
    },
    name: {
        fontFamily: Fonts.dmSemiBold,
        fontSize: dimen(18),
        marginBottom: heightDimen(19)
    },
    tokenId: {
        fontFamily: Fonts.dmRegular,
        fontSize: dimen(14),
        marginBottom: heightDimen(6)
    },
    Standard: {
        fontFamily: Fonts.dmRegular,
        fontSize: dimen(14)
    },
    rowView: {
        backgroundColor: "#101010",
        borderRadius: 14,
        paddingVertical: 10
    },
    btnViewModal: {
        flexDirection: "row",
        alignSelf: "center",
        paddingHorizontal: dimen(35),
        marginBottom: hasNotchWithIOS() ? dimen(52) : dimen(30),
        marginTop: dimen(50),
    },
    borderButtonStyle: {
        width: "99%",
        height: "96%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: dimen(14),

    },

})