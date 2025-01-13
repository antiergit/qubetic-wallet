import { View, Text, Modal, ImageBackground, ScrollView, Image, FlatList } from 'react-native'
import React from 'react'
import { Button, HeaderMain, ManageItem } from '../../../common'
import { LanguageManager } from '../../../../../LanguageManager'
import { ThemeManager } from '../../../../../ThemeManager'
import styles from '../WalletConnectionStyle'
import images from '../../../../theme/Images'
import { CHAIN_ID_TO_NAME, ETH_Img, SOL_Img } from '../../../../Constants'
import moment from 'moment'
import { SvgUri } from 'react-native-svg'

const ManageConnection = ({ isVisible, onClose, wcData, onDisconnect }) => {
    console.log("wcData>>>", wcData);
    let data = wcData?.peer?.metadata
    let iconUrl = null
    if (data?.name == "dYdX v4") {
        iconUrl = data?.url + data?.icons[data?.icons?.length - 1]
    }
    let finalIcon = iconUrl != null ? iconUrl : data?.icons[data?.icons.length - 1]
    const connectedWallets = wcData?.namespaces?.eip155?.accounts || wcData?.namespaces?.solana?.accounts

    const timeDate = (`${moment.unix(wcData?.expiry).subtract(7, 'days').format('DD MMM')}` + ', ' + `${moment.unix(wcData?.expiry).subtract(7, 'days').format('hh:mm A')}`)

    return (
        <Modal transparent={true} visible={isVisible} onRequestClose={onClose}>
            <ImageBackground
                source={ThemeManager.ImageIcons.mainBgImgNew}
                style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
            >
                <HeaderMain
                    backCallBack={onClose}
                    BackButtonText={LanguageManager.walletConnection.walletConnect} />

                <View style={{ flex: 0.9, paddingHorizontal: 20 }}>
                    <ScrollView>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>

                            {finalIcon?.includes(".svg") ?
                                <SvgUri
                                    style={styles.dappImage}
                                    uri={finalIcon}
                                />
                                :
                                <Image
                                    style={styles.dappImage}
                                    source={{ uri: finalIcon }} />
                            }
                            <Text style={[styles.dappName, { color: ThemeManager.colors.blackWhiteText }]}>{data?.name} want to disconnect to you wallet</Text>
                            <Text style={[styles.dappUrl, { color: ThemeManager.colors.primaryColor }]}>{data?.url}</Text>
                        </View>
                        <View style={{ marginTop: 30, alignItems: "flex-start" }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                <Text style={[styles.ethWallet, { color: ThemeManager.colors.blackWhiteText }]}>Connected</Text>
                                <Text style={[styles.ethWallet, { color: ThemeManager.colors.blackWhiteText }]}>{timeDate}</Text>
                            </View>

                            <FlatList
                                data={connectedWallets}
                                style={{ width: "100%" }}
                                renderItem={({ item }) => {
                                    const address = item?.split?.(":")?.[2]
                                    const chainId = item?.split?.(":")?.[1]
                                    const chain = item?.split?.(":")?.[0]
                                    console.log("solana>>>", item);

                                    return (
                                        <ManageItem
                                            walletName={chain == "solana" ? "Solana" : CHAIN_ID_TO_NAME?.[chainId]?.name}
                                            walletType={address}
                                            logo={{ uri: chain == "solana" ? SOL_Img : CHAIN_ID_TO_NAME?.[chainId]?.img }}
                                            logoStyle={{ borderRadius: 14 }}
                                        />
                                    )
                                }}
                            />
                        </View>

                    </ScrollView>
                </View>
                <View style={{ flex: 0.1, paddingHorizontal: 20, marginBottom: 10 }}>
                    <Button
                        onPress={onDisconnect}
                        buttontext={LanguageManager.walletConnection.disconnect} />
                </View>
            </ImageBackground>
        </Modal>
    )
}

export default ManageConnection