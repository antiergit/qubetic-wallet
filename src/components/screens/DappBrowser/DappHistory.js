import { View, Text, ImageBackground, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemeManager } from '../../../../ThemeManager'
import { HeaderMain, Item } from '../../common'
import { getData, saveData } from '../../../Utils/MethodsUtils'
import { DAPP_HISTORY } from '../../../Constants'
import { ConfirmAlert } from '../../common/ConfirmAlert'
import { LanguageManager } from '../../../../LanguageManager'
import { Actions } from 'react-native-router-flux'
import Singleton from '../../../Singleton'

const DappHistory = (props) => {
    const [historyList, setHistoryList] = useState([])
    const [showAlertDialogConfirm, setShowAlertDialogConfirm] = useState(false)
    const [alertTxt, setAlertTxt] = useState("")
    useEffect(() => {
        getData(DAPP_HISTORY).then(response => {
            if (response) {

                const historyData = JSON.parse(response);
                setHistoryList(historyData)

            };
        })

    }, [])

    const submitPressed = (item) => {

        Actions.currentScene != 'DappBrowserNew' && Actions.DappBrowserNew({
            item: item,
            url: item?.url,
            themeSelected: props.themeSelected,
            maticFiatPrice: props.maticFiatPrice,
            bnbFiatPrice: props.bnbFiatPrice,
            ethFiatPrice: props.ethFiatPrice,
        });
    }

    return (
        <ImageBackground source={ThemeManager.ImageIcons.mainBgImgNew}
            style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
            <HeaderMain
                BackButtonText={"History"}
                imgSecond={ThemeManager.ImageIcons.deleteIcon}
                imgSecondStyle={{ tintColor: ThemeManager.colors.blackWhiteText }}
                onPressIcon={() => {
                    setAlertTxt("Do you want to clear all history?")
                    setShowAlertDialogConfirm(true)
                }}
            />

            <FlatList
                bounces={false}
                showsVerticalScrollIndicator={false}
                data={historyList}

                renderItem={({ item, index }) => {
                    return (
                        <Item
                            img={item?.iconUrl}
                            title={item.title}
                            index={index}
                            subtitle={item.url}
                            timestamp={item?.timestamp}
                            onDappPress={() => submitPressed(item)}
                            mainView={{ marginBottom: index == historyList?.length - 1 ? 50 : 0 }}
                        />
                    );
                }}
                keyExtractor={item => `key_${item.id}`}

            />

            {showAlertDialogConfirm && (
                <ConfirmAlert
                    text={LanguageManager.addressBook.yes}
                    alertTxt={alertTxt}
                    hideAlertDialog={() => {
                        setShowAlertDialogConfirm(false);
                    }}
                    ConfirmAlertDialog={() => {
                        saveData(DAPP_HISTORY, JSON.stringify([]))
                        setShowAlertDialogConfirm(false);


                        Singleton.getInstance().showToast?.show("History clear successfully.");
                        Actions.pop()

                    }}
                />
            )}
        </ImageBackground>
    )
}

export default DappHistory