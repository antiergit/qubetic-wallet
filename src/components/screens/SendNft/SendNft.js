import React, { Component } from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import styles from './SendNftStyle';
import {
    AddressModal,
    AppAlert,
    Button,
    HeaderMain,
    InputCustom,
    InputCustomWithPasteButton,
    LoaderView,
    QRCodeScannerNew,
} from '../../common';
import { LanguageManager } from '../../../../LanguageManager';
import { ThemeManager } from '../../../../ThemeManager';
import images from '../../../theme/Images';
import { widthDimen } from '../../../Utils';
import { Colors, Fonts } from '../../../theme';
import Singleton from '../../../Singleton';
import { EventRegister } from 'react-native-event-listeners';
import * as Constants from "../../../Constants";
import { Modal } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ConfirmNftModal from '../../common/ConfirmNftModal';
import EnterPinForTransaction from '../EnterPinForTransaction/EnterPinForTransaction';
import ContactsBook from '../ContactsBook/ContactsBook';
import { ActionConst, Actions } from 'react-native-router-flux';
import Clipboard from '@react-native-clipboard/clipboard';
import { exponentialToDecimal, getData, getEncryptedData, toFixedExp } from '../../../Utils/MethodsUtils';
import { fetchNative_CoinPrice, fetchNativePrice, requestGasEstimation, requestgasprice, requestNonce, requestSendCoin } from '../../../Redux/Actions';
import { connect } from 'react-redux';
import { getEthBal, getSignRawTxnTokenForNft, getTotalGasFee } from '../../../Utils/EthUtils';
import { store } from '../../../Redux/Reducers';
import { SvgUri } from 'react-native-svg';

class SendNft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gasFeeMultiplier: 0.000000000000000001,
            isLoading: false,
            isVisible: false,
            showConfirmModal: false,
            PinModal: false,
            showAddressBookModal: false,
            showContactlModal: false,
            newObj: "",
            selected_Index: undefined,
            selectedItem: '',
            showAlertDialog: false,
            isReqSent: false,
            alertTxt: '',
            amount: '',
            toAddress: "",
            nonce: -1,
            gasEstimate: 0,
            gasPrice: 0,
            gasPrice: 0,
            totalFee: 0,
            nativePrice: 0,
            isInsufficientBalance: false,
        };
    }

    async componentDidMount() {
        EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
            this.setState({
                isVisible: false,
                showConfirmModal: false,
            });
        });

        this.getGasLimit()
        this.fetchNativePrice()
    }

    getGasLimit() {
        this.setState({ isLoading: true });
        const wallet_address = Singleton.getInstance().defaultEthAddress
        let gasEstimationReq = {
            from: wallet_address,
            to: wallet_address,
            amount: "",
        };
        console.log("gasEstimationReq>>>>", gasEstimationReq, this.props.nftData?.token_address,)

        getData(Constants.ACCESS_TOKEN).then((token) => {
            console.log("token>>>", token);
            this.props.requestGasEstimation({
                url: `ethereum/${this.props.nftData?.token_address}/gas_estimation`,
                gasEstimationReq,
                token,
            })
                .then((res1) => {
                    console.log("chk gasEstimate res:::::", res1);
                    this.getTotalFee(res1.gas_estimate);
                })
                .catch((e) => {
                    console.log("chk gasEstimate error:::::", e);

                    this.setState({ isLoading: false });
                    this.setState({ showAlertDialog: true, alertTxt: e });
                });
        });
    }

    fetchNativePrice() {
        let data = {
            fiat_currency: Singleton.getInstance().CurrencySelected,
            coin_family: 2,
        };
        this.props
            .fetchNativePrice({ data })
            .then((res) => {
                this.setState({
                    nativePrice: toFixedExp(res?.fiatCoinPrice?.value, 2),
                });
                console.log("chk res native price:::::", res);
            })
            .catch((err) => {
                console.log("chk err native price:::::", err);
            });
    }

    getTotalFee = (gasLimit = 21000) => {
        this.setState({ isLoading: true });
        setTimeout(async () => {
            const Totalfee = await getTotalGasFee();
            const value = Totalfee
                ? exponentialToDecimal(
                    Totalfee * this.state.gasFeeMultiplier * gasLimit
                )
                : 0;
            console.log(" value:::::", value);
            const fee = parseFloat(value).toFixed(6);
            const bal = await getEthBal(Singleton.getInstance().defaultEthAddress);
            if (parseFloat(fee) > parseFloat(bal)) {
                this.setState({
                    showAlertDialog: true,
                    alertTxt: LanguageManager.alertMessages.youhaveInsufficientEthBalance,
                    isInsufficientBalance: true,
                });
            }
            this.setState({
                gasEstimate: gasLimit * 2,
                gasPrice: Totalfee,
                totalFee: fee,
                isLoading: false,
            });
        }, 100);
    };




    requestCameraPermission() {
        Singleton.getInstance()
            .cameraPermission()
            .then((res) => {
                if (res == "granted") {
                    Singleton.isCameraOpen = true;
                    this.setState({ isVisible: true });
                }
            });
    }

    sendTransaction() {
        const { alertMessages } = LanguageManager;
        const { toAddress, amount } = this.state;
        this.setState({ showConfirmModal: true });

        if (toAddress.trim().length == 0)
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.pleaseEnterWalletAddress,
            });
        else if (!/^(0x){1}[0-9a-fA-F]{40}$/i.test(toAddress))
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.pleaseEnterValidAddress,
            });
        else if (toAddress.toLowerCase() == Singleton.getInstance().defaultEthAddress.toLowerCase())
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.youCannotSendToSameAddress,
            });
        else if (amount.trim().length == 0 || amount == 0)
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.pleaseEnterAmount,
            });
        else if (isNaN(parseFloat(amount)))
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.pleaseEnterValidAmount,
            });
        else if (!/^\d*\.?\d*$/.test(amount))
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.youCanEnterOnlyOneDecimal,
            });
        else if (
            parseFloat(amount) > parseFloat(toFixedExp(this.props.nftData?.amount, 8))
        )
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.youhaveInsufficientBalance,
            });
        else if (this.state.isInsufficientBalance) {
            return this.setState({
                showAlertDialog: true,
                alertTxt: alertMessages.youhaveInsufficientEthBalance,
            });
        }
        else {

            this.setState({ showConfirmModal: true });
        }
    }
    getAddress = (address) => {
        this.setState({ toAddress: address, showContact: false });
    };
    onMaxClicked = () => {
        this.setState({
            amount: this.props.nftData?.amount || ""
        })
    }

    onPressItem(item, index) {
        this.setState({ selected_Index: index });
        setTimeout(() => {
            this.setState({ showContactlModal: false });
            this.getAddress(item?.wallet_address);
            // Actions.currentScene == 'ContactsBook' && Actions.pop();
        }, 800);
    }
    onPinSuccess(pin) {
        this.setState({ PinModal: false }, () => {
            this.setState({ isLoading: true });
            setTimeout(async () => {
                const { gasEstimate, toAddress, amount } = this.state;
                let privateKey = await getEncryptedData(`${Singleton.getInstance().defaultEthAddress}_pk`, pin);
                const chainId = "0x01"

                console.log("DATA>>", chainId,
                    privateKey,
                    this.props.nftData?.token_id,
                    this.props.nftData?.token_address,
                    gasEstimate,
                    toAddress,
                    Singleton.getInstance().defaultEthAddress);

                getSignRawTxnTokenForNft(chainId,
                    privateKey,
                    this.props.nftData?.token_id,
                    this.props.nftData?.token_address,
                    gasEstimate,
                    toAddress,
                    Singleton.getInstance().defaultEthAddress).then(res => {
                        console.log("RES>>", res);
                        this.sendSerializedTxn(res?.signedRaw, res?.nonce)

                    }).catch(err => {
                        console.log("ERR>>", err);

                    })


            }, 200);

        });


    }


    sendSerializedTxn(tx_raw, nonce) {
        const {
            toAddress,
            amount,
            gasEstimate,
            gasPrice,
        } = this.state;
        let sendCoinReq = {
            nonce: nonce,
            tx_raw: tx_raw,
            from: Singleton.getInstance().defaultEthAddress,
            to: toAddress,
            amount: amount,
            gas_estimate: gasEstimate,
            gas_price: gasPrice,
            tx_type: "withdraw",
        };
        console.log("sendCoinReq::::", sendCoinReq);
        this.props
            .requestSendCoin({
                url: `ethereum/${this.props.nftData?.token_address}/send`,
                sendCoinReq,
            })
            .then((res) => {
                this.setState({ isLoading: false, showAlertDialog: true, alertTxt: res?.message, isReqSent: true });
            })
            .catch((e) => {
                this.setState({ isLoading: false, showAlertDialog: true, alertTxt: e });
            });
    }

    render() {
        const { isVisible } = this.state;
        if (this.state.isVisible)
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: ThemeManager.colors.Mainbg,
                    }}
                >
                    <Modal
                        animationType={"slide"}
                        transparent={true}
                        visible={this.state.isVisible}
                        onRequestClose={() => {
                            console.log("Modal has been closed.");
                        }}
                    >
                        <View style={[styles.modalView, { flex: 1 }]}>
                            <View
                                style={{ backgroundColor: ThemeManager.colors.mainBgNew, flex: 1, marginTop: -5 }}
                            >
                                <QRCodeScannerNew
                                    cameraStyle={styles.cameraStyle}
                                    onRead={(event) => {
                                        this.setState({ isVisible: false, toAddress: event.data });
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ isVisible: false });
                                    }}
                                >
                                    <Text allowFontScaling={false} style={[styles.txtCancel, , { color: ThemeManager.colors.blackWhiteText }]}>
                                        {LanguageManager.sendTrx.Cancel}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
        return (
            <ImageBackground
                source={ThemeManager.ImageIcons.mainBgImgNew}
                style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
            >
                <HeaderMain BackButtonText={LanguageManager.nftData.sendNFT} />
                <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
                    <View style={{ flexDirection: 'row' }}>


                        {this.props.nftData?.image?.includes(".svg") ?
                            <SvgUri
                                style={styles.imageStyle}
                                uri={this.props.nftData?.image}
                            /> :
                            <Image source={{ uri: this.props.nftData?.image }} style={styles.imageStyle} />
                        }

                        <View style={{ justifyContent: 'center', marginLeft: widthDimen(20) }}>
                            <Text
                                style={[
                                    styles.name,
                                    { color: ThemeManager.colors.subTextColor },
                                ]}
                            >
                                {this.props.nftData?.name}
                            </Text>
                            <Text
                                style={[
                                    styles.tokenId,
                                    { color: ThemeManager.colors.legalGreyColor },
                                ]}
                            >
                                {LanguageManager.nftData.tokenID}:
                                <Text style={{ color: ThemeManager.colors.subTextColor }}>
                                    {' #'}
                                    {this.props.nftData?.token_id}
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
                                    {this.props.nftData?.token_type}
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 30, marginBottom: 24 }}>
                        <Text
                            allowFontScaling={false}
                            style={[
                                styles.txtWallet,
                                { color: ThemeManager.colors.blackWhiteText },
                            ]}
                        >
                            {LanguageManager.receive.address}
                        </Text>

                        <View
                            style={[
                                styles.ViewStyle,
                                {
                                    backgroundColor: 'transparent',
                                    borderColor: ThemeManager.colors.inputBorder,
                                },
                            ]}
                        >
                            <InputCustomWithPasteButton
                                placeHolder={LanguageManager.nftData.enterAddress}
                                value={this.state.toAddress}
                                customInputStyle={[
                                    styles.ViewStyle1,
                                    {
                                        backgroundColor: 'transparent',
                                        color: ThemeManager.colors.blackWhiteText,
                                    },
                                ]}
                                placeholderTextColor={ThemeManager.colors.inputBorder}
                                onChangeText={(text) => {
                                    this.setState({
                                        toAddress: text
                                    })
                                }}
                            />
                            <TouchableOpacity
                                style={{ position: "absolute", right: 80, top: 15, alignSelf: "center" }}
                                onPress={() => {
                                    Clipboard.getString().then((address) => {
                                        this.setState({
                                            toAddress: address,
                                        })
                                    })
                                }}>
                                <Text style={[styles.txtWallet, { color: ThemeManager.colors.blackWhiteText }]}>
                                    {"Paste"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 50, top: 17 }}
                                onPress={() => {
                                    this.setState({ showAddressBookModal: true })
                                }}
                            >
                                <Image
                                    source={ThemeManager.ImageIcons.addressBookIcon}
                                    style={{
                                        tintColor: ThemeManager.colors.subTextColor,

                                    }}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.requestCameraPermission()}
                                style={styles.scan}
                            >
                                <Image
                                    style={{
                                        tintColor: ThemeManager.colors.blackWhiteText,
                                    }}
                                    source={ThemeManager.ImageIcons.scan}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                            allowFontScaling={false}
                            style={[
                                styles.txtWallet,
                                { height: 40, color: ThemeManager.colors.blackWhiteText },
                            ]}
                        >
                            {LanguageManager.nftData.Quantity}
                        </Text>
                        <Text
                            allowFontScaling={false}
                            style={[
                                styles.txtWallet,
                                { height: 40, color: ThemeManager.colors.legalGreyColor },
                            ]}
                        >
                            {LanguageManager.nftData.availableNFT}:
                            <Text
                                style={{ color: ThemeManager.colors.blackWhiteText }}
                            >
                                {' '}
                                {this.props.nftData?.amount}
                            </Text>
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.ViewStyle2,
                            {
                                borderColor: ThemeManager.colors.inputBorder,
                                backgroundColor: 'transparent',
                            },
                        ]}
                    >
                        <InputCustom
                            placeHolder={'0'}
                            placeholderColor={Colors.placeholderColor}
                            keyboardType="decimal-pad"
                            maxLength={15}
                            customInputStyle={[
                                styles.ViewStyle4,
                                { color: ThemeManager.colors.settingsText },
                            ]}
                            placeholderTextColor={ThemeManager.colors.inputBorder}
                            value={this.state.amount}
                            onChangeText={(text) => {
                                this.setState({ amount: text })
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                this.onMaxClicked();
                            }}
                            style={styles.maxStyle}
                        >
                            <Text
                                allowFontScaling={false}
                                style={[
                                    styles.maxText,
                                    { color: ThemeManager.colors.primaryColor },
                                ]}
                            >
                                {LanguageManager.sendTrx.max}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text
                        style={[
                            styles.transactionFees,
                            { color: ThemeManager.colors.legalGreyColor },
                        ]}
                    >
                        {LanguageManager.nftData.transactionFees} {'(ETH)'}:
                        <Text style={{ color: ThemeManager.colors.subTextColor }}>
                            {'  '}
                            {this.state.totalFee}
                        </Text>
                    </Text>
                </ScrollView>

                <View style={styles.btnView}>
                    <Button
                        onPress={() => {
                            this.sendTransaction();
                        }}
                        customStyle={{ marginTop: 20 }}
                        buttontext={LanguageManager.nftData.Confirm}
                    />
                </View>


                <ConfirmNftModal
                    onPressCancel={() => this.setState({ showConfirmModal: false })}
                    visible={this.state.showConfirmModal}
                    data={this.props.nftData}
                    toAddress={this.state.toAddress}
                    fees={this.state.totalFee}
                    nativePrice={this.state.nativePrice}
                    onPressContinue={() => this.setState({ showConfirmModal: false },
                        () => {
                            this.setState({
                                PinModal: true
                            })
                        })}
                />

                {this.state.showAddressBookModal && <ContactsBook
                    handleBack={() => this.setState({ showAddressBookModal: false })}
                    showAddressBookModal={this.state.showAddressBookModal}
                    newObj={this.state.newObj}
                    getAddress={this.getAddress}
                    address={Singleton.getInstance().defaultEthAddress}
                    coin_family={2}
                    onPressView={(item) => {
                        this.setState({ showAddressBookModal: false, showContactlModal: true, selectedItem: item });
                    }}
                    addbook={() => {
                        this.setState({ showAddressBookModal: false })
                        Actions.currentScene != 'AddContact' && Actions.AddContact({ themeSelected: this.props.themeSelected, });
                    }}
                    navigation={this.props.navigation}
                />}
                <AddressModal
                    selected_Index={this.state.selected_Index}
                    onPressItem={(item, index) => this.onPressItem(item, index)}
                    dismiss={() => this.setState({ showContactlModal: false })}
                    item={this.state.selectedItem}
                    openModel={this.state.showContactlModal}
                />


                <Modal
                    statusBarTranslucent
                    animationType="slide"
                    transparent={true}
                    visible={this.state.PinModal}
                    onRequestClose={() => {
                        this.setState({ PinModal: false });
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <EnterPinForTransaction
                            onBackClick={() => {
                                this.setState({ PinModal: false });
                            }}
                            closeEnterPin={(res) => {
                                this.onPinSuccess(res);
                            }}
                        />
                    </View>
                </Modal>
                <LoaderView isLoading={this.state.isLoading} />

                {this.state.showAlertDialog && (
                    <AppAlert
                        alertTxt={this.state.alertTxt}
                        showSuccess={this.state.isReqSent}
                        hideAlertDialog={() => {
                            this.setState({ showAlertDialog: false });
                            if (this.state.isReqSent) {
                                Actions.pop()
                                Actions.pop()
                            }
                        }}
                    />
                )}

            </ImageBackground>
        );
    }
}

export default connect(null, {
    requestgasprice,
    requestGasEstimation,
    requestNonce,
    requestSendCoin,
    fetchNativePrice,
    fetchNative_CoinPrice,
})(SendNft);;
