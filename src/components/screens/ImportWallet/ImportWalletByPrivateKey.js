import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
} from 'react-native';
import styles from './ImportWalletStyles';
import {
    getDimensionPercentage as dimen,
    heightDimen,
    widthDimen,
} from '../../../Utils';
import DeviceInfo from 'react-native-device-info';
import { AppAlert, Button, HeaderMain, Input, LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import { LanguageManager } from '../../../../LanguageManager';
import Toast from 'react-native-easy-toast';
import * as Constants from '../../../Constants';
import Singleton from '../../../Singleton';
import { createPrivateKeyWalletLocal, createUserWalletLocal, getData, requestWalletApiData, saveData } from '../../../Utils/MethodsUtils';
import { requestWalletLogin } from '../../../Redux/Actions';
import { useDispatch } from 'react-redux';
import images from '../../../theme/Images';
import Clipboard from '@react-native-clipboard/clipboard';
import { convertPrivateKeyToAddress, isValidEthereumPrivateKey } from '../../../Utils/EthUtils';
import { convertBtcPrivateKeyToAddress, isValidBitcoinPrivateKey } from '../../../Utils/BtcUtils';
import { convertTrxPrivateKeyToAddress, isValidTronPrivateKey } from '../../../Utils/TronUtils';
import { Actions } from 'react-native-router-flux';
import EnterPinForTransaction from '../EnterPinForTransaction/EnterPinForTransaction';
import { EventRegister } from 'react-native-event-listeners';

const ImportWalletByPrivateKey = (props) => {
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [walletName, setWalletName] = useState('');
    const [isKeyboard, setIsKeyboard] = useState(false);
    const [privateKeyText, setPrivateKeyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertModal, setAlertModal] = useState(false);
    const [alertText, setAlertText] = useState('');
    const [pinModal, setPinModal] = useState(false)
    const selectedChain = props?.selectedChain
    const isFromManageWallet = props?.isFromManageWallet

    // console.log("selectedChain>>>", selectedChain);

    const validatePrivateKey = () => {
        if (walletName?.trim().length == 0) {
            setAlertModal(true)
            setAlertText(LanguageManager.alertMessages.enterWalletName)
            return
        }
        if (walletName?.length < 3) {
            setAlertModal(true)
            setAlertText(LanguageManager.createWalletTexts.validName)
            return
        }
        if (privateKeyText?.length <= 0) {
            setAlertModal(true)
            setAlertText('Please enter private key.')
            return
        }
        console.log("isValidBitcoinPrivateKey(privateKeyText)>>", isValidBitcoinPrivateKey(privateKeyText));

        if (selectedChain?.coin_family == 3 && !isValidBitcoinPrivateKey(privateKeyText)) {
            setAlertModal(true)
            setAlertText('Enter valid private key.')
            return
        }
        if (selectedChain?.coin_family == 6 && !isValidTronPrivateKey(privateKeyText)) {
            setAlertModal(true)
            setAlertText('Enter valid private key.')
            return
        }
        if ((selectedChain?.coin_family == 1 || selectedChain?.coin_family == 2) && !isValidEthereumPrivateKey(privateKeyText)) {
            setAlertModal(true)
            setAlertText('Enter valid private key.')
            return
        }
        if (isFromManageWallet) {
            setPinModal(true)
        } else {
            restoreWallet()
        }
    }

    const restoreWallet = async (pin) => {
        if (selectedChain?.coin_family == 3) {
            const WalletData = await convertBtcPrivateKeyToAddress(privateKeyText);
            createWalletApi(WalletData?.btc_address, pin)
        } else if (selectedChain?.coin_family == 6) {
            const WalletData = await convertTrxPrivateKeyToAddress(privateKeyText);
            createWalletApi(WalletData?.trx_address, pin)
        } else {
            const WalletData = await convertPrivateKeyToAddress(privateKeyText);
            createWalletApi(WalletData?.eth_address, pin)
        }

    }

    const createWalletApi = async (address, pin) => {

        if (address == undefined) {
            setAlertModal(true)
            setAlertText('Please enter valid private key.')
            return
        }
        if (isFromManageWallet) {
            const multiWalletArray = await getData(Constants.MULTI_WALLET_LIST)
            let list = await JSON.parse(multiWalletArray);
            console.log(list,'listlistlistlist',);
            
            let isAlreadyExit = false
            await list.map(res => {
                if (res?.coinFamily == selectedChain?.coin_family && res?.loginRequest?.wallet_address?.toLowerCase() == address?.toLowerCase()) {
                    setAlertModal(true)
                    setAlertText('Wallet already exist.')
                    isAlreadyExit = true
                    return
                }
                console.log('makerid=>',res?.login_data?.makerUserId ,res?.addrsListKeys?.[0]?.toLowerCase(),res?.coinFamilyKeys?.[0],selectedChain?.coin_family);
                
                if (
                  !!res?.login_data?.makerUserId &&
                  res?.addrsListKeys?.[0]?.toLowerCase() ==
                    address?.toLowerCase() &&
                  res?.coinFamilyKeys?.[0] == selectedChain?.coin_family
                ) {
                  setLoading(false);
                  setAlertModal(true);
                  setAlertText(
                    "Please delete the existing maker before importing the wallet with the private key."
                  );
                  isAlreadyExit = true;
                  return;
                }

                if (res?.walletName == walletName) {
                  setAlertModal(true);
                  setAlertText("Wallet name already exist.");
                  isAlreadyExit = true;
                  return;
                }
            })
            if (!isAlreadyExit) {
                createWalletRequest(address, pin)
            }

        } else {
            createWalletRequest(address, pin)
        }

    };

    const createWalletRequest = async (address, pin) => {
        setLoading(true);
        const apiData = {
            device_id: Singleton.getInstance().unique_id,
            wallet_address: address,
            device_token: (await getData(Constants.DEVICE_TOKEN)) || "abc",
            wallet_name: walletName || "Basic",
            referral_code: "",
            addressList: [
                { symbol: selectedChain?.symbol?.toLowerCase(), address: address, coin_family: selectedChain?.coin_family },
            ],
        };
        dispatch(requestWalletLogin({ data: apiData, }))
            .then(async (resp) => {

                setLoading(false);
                if (isFromManageWallet) {
                    const createWalletData = {
                        resp: resp,
                        walletData: { address: address, privateKey: privateKeyText, chain: selectedChain },
                        walletName: walletName || "Basic",
                        pin: pin,
                        walletAlreadyExist: true,
                        onSuccess: () => {
                            setTimeout(() => {
                                EventRegister.emit("isMakerWallet", false);
                                EventRegister.emit("makerWalletChange", false);
                                Singleton.bottomBar?.navigateTab("WalletMain");
                                Actions.jump("WalletMain");
                            }, 150);
                        },
                    };
                    await createPrivateKeyWalletLocal(createWalletData);

                } else {
                    Actions.currentScene != "CreatePin" &&
                        Actions.CreatePin({
                            title: "Create",
                            subtitle: "create",
                            walletData: { address: address, privateKey: privateKeyText, chain: selectedChain },
                            walletName: walletName,
                            walletApiRes: resp,
                            isPrivateKey: true,
                        });
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.current?.show(err);
                console.log("error requestWalletLogin:::::", err);
            });
    }

    return (
        <View style={[{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }]}>
            <HeaderMain
                BackButtonText={LanguageManager.importWallet.importPrivate}
            />
            <View style={[styles.mainView,]}>
                <View style={styles.subView}>
                    {/* <Text style={[styles.reviewText, { color: ThemeManager.colors.blackWhiteText }]}>{LanguageManager.importWallet.importWalletH1}
                    </Text> */}
                    <Input
                        inputStyle={{ borderRadius: 14, color: ThemeManager.colors.blackWhiteText }}
                        label={LanguageManager.walletName.walletName}
                        value={walletName}
                        onChangeText={val => {
                            // if (Constants.ALPHANUMERIC_SPACE_REGEX.test(val)) {
                            setWalletName(val?.trimStart())
                            // }
                        }}
                        placeholder={LanguageManager.walletName.enterName}
                        maxLength={20}
                        onBlur={() => setIsKeyboard(false)}
                        onFocus={() => setIsKeyboard(true)}
                        // style={{ marginTop: dimen(5) }}
                        labelcustom={{ marginTop: heightDimen(1), color: ThemeManager.colors.blackWhiteText }}
                    />
                    <View>
                        <Input
                            inputStyle={[
                                styles.placeHolderStyle,
                                { borderColor: ThemeManager.colors.pasteInput, color: ThemeManager.colors.blackWhiteText },
                            ]}
                            placeholder={LanguageManager.importWallet.enterPrivateKey}
                            multiline
                            returnKeyType="next"
                            icon={false}
                            value={privateKeyText}
                            onChangeText={val => {
                                // if (val) {
                                //   if (val?.includes('\n')) {
                                //     Keyboard.dismiss();
                                //     return;
                                //   }
                                //   val = val.replace(/[^A-Za-z ]/gi, '');
                                // }
                                setPrivateKeyText(val);
                            }}
                            numberOfLines={3}
                            style={styles.inputPhraseStyle}
                            onBlur={() => setIsKeyboard(false)}
                            onFocus={() => setIsKeyboard(true)}
                            maxLength={150}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                Clipboard.getString()
                                    .then(res => {
                                        setPrivateKeyText(res);
                                    })
                            }}
                            style={{ position: "absolute", bottom: 12, right: 15 }}
                        >
                            <Image source={images.pasteIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnContainer}>
                        <Button
                            buttontext={LanguageManager.pins.restoreWallet}
                            onPress={validatePrivateKey}
                        />

                    </View>
                </View>

                {alertModal && (
                    <AppAlert
                        alertTxt={alertText}
                        hideAlertDialog={() => { setAlertModal(false) }}
                    />
                )}
                <LoaderView isLoading={loading} />
                <Toast
                    ref={toast}
                    position="bottom"
                    positionValue={250}
                    style={{ backgroundColor: ThemeManager.colors.toastBg }}
                />
            </View>
            {/* --------------------------------Modal for Pin----------------------------------- */}
            <Modal
                statusBarTranslucent
                animationType="slide"
                transparent={true}
                visible={pinModal}
                onRequestClose={() => {
                    setPinModal(false)
                }}
            >
                <View style={{ flex: 1 }}>
                    <EnterPinForTransaction
                        checkBiometric={true}
                        onBackClick={() => {
                            setPinModal(false)
                        }}
                        closeEnterPin={(res) => {
                            setPinModal(false)
                            setTimeout(() => {
                                restoreWallet(res)
                            }, 600);
                        }}
                    />
                </View>
            </Modal>
        </View>
    )
}

export default ImportWalletByPrivateKey