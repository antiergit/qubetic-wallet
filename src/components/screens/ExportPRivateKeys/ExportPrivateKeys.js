import { View, Text, FlatList, TouchableOpacity, Clipboard, ImageBackground } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ThemeManager } from '../../../../ThemeManager'
import { HeaderMain, OnboardingHeadings } from '../../common'
import { LanguageManager } from '../../../../LanguageManager'
import styles from './ExportProivateKeyStyles'
import { clearGarbageCollection, getData, getEncryptedData } from '../../../Utils/MethodsUtils'
import images from '../../../theme/Images'
import { getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../../Utils'
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-easy-toast'
import { COIN_IMAGE_BY_SYMBOL } from '../../../Constants'
import { deriveSolanaPrivateKey } from '../../../Utils/SolUtils'

const ExportPrivateKeys = ({ walletItem, pin }) => {
    const [keysData, setKeysData] = useState([])
    const { manageWallet } = LanguageManager;

    const toast = useRef(null);
    useEffect(() => {
        getKeys()
        return () => {
            clearGarbageCollection()
            setKeysData([])
        }
    }, [])

    const getKeys = async () => {
        try {
            let arr = [];
            console.log("Private key address >>>>", walletItem.loginRequest?.addressList);
            for (const item of walletItem.loginRequest?.addressList || []) {
                let privateKey = ""
                if (item?.coin_family == 5) {
                    privateKey = await getEncryptedData(item.address, pin)
                    privateKey = await deriveSolanaPrivateKey(privateKey)
                    privateKey = Buffer.from(privateKey).toString('hex')
                } else {
                    privateKey = await getEncryptedData(item.address + '_pk', pin)
                }

                arr.push({
                    symbol: item.symbol,
                    key: privateKey,
                    coinFamily: item.coin_family,
                });
                privateKey = ""
            }

            setKeysData(arr);
            console.log(arr, "Keys data array");
            setTimeout(() => {
                arr = ""
            }, 1500);
        } catch (error) {
            console.error("Error fetching keys:", error);
        }
    };
    console.log("keysData::::", keysData);
    const getImageFromCoinFamily = (coinFamily) => {
        switch (coinFamily) {
            case 1: return images.bnb
                break;
            case 2: return images.eth
                break;
            case 3: return images.btc
                break;
            case 6: return images.tron
                break;
            default: return images.bnb
        }
    }
    const onPressKey = async (item) => {
        await Clipboard.setString(item.key);
        toast.current?.show('Copied')
    }
    return (
        <ImageBackground
            source={ThemeManager.ImageIcons.mainBgImgNew}
            style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }} >
            <HeaderMain
                customStyle={{ paddingHorizontal: widthDimen(24) }}
            />
            <View style={styles.mainViewStyle}>
                <OnboardingHeadings title={manageWallet.privateKey} subTitle={manageWallet.keepYourPrivateKey} />

                <FlatList
                    data={keysData}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{ backgroundColor: ThemeManager.colors.mnemonicsBg, padding: dimen(20), marginTop: heightDimen(10), borderRadius: dimen(10), overflow: 'hidden' }}>


                                <TouchableOpacity onPress={() => onPressKey(item)}>
                                    <View style={styles.imageSymbolContainer}>
                                        <FastImage
                                            source={{ uri: COIN_IMAGE_BY_SYMBOL?.[item.symbol] }}
                                            style={styles.imageStyle} resizeMode='contain' />
                                        <Text style={[styles.symbolText, { color: ThemeManager.colors.blackWhiteText }]}>{item.symbol?.toUpperCase()}</Text>
                                    </View>
                                    <Text style={[styles.keyText, { color: ThemeManager.colors.legalGreyColor }]}>{item.key}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                />
            </View>
            <Toast
                ref={toast}
                position="bottom"
                positionValue={250}
                style={{ backgroundColor: ThemeManager.colors.toastBg }}
            />
        </ImageBackground>
    )
}

export default ExportPrivateKeys