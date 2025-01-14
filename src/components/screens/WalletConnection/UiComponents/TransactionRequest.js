import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import { BlurView } from '@react-native-community/blur';
import { Fonts, Images } from '../../../../theme';
import { dimen, getDimensionPercentage, getGasLimitFromData, getGasPriceForWc, getNonceForWc, hasNotchWithIOS, signPersonalMessage } from '../../../../Utils';
import { ThemeManager } from '../../../../../ThemeManager';
import { LanguageManager } from '../../../../../LanguageManager';
import { bigNumberSafeMath, getData, getEncryptedData, toFixed, toFixedExp } from '../../../../Utils/MethodsUtils';
import { AppAlert, Button, LoaderView } from '../../../common';
import Singleton from '../../../../Singleton';
import WalletConnectInstance from '../../../../Utils/WalletConnectInstance';
import { fetchNativePrice, requestSendCoin, saveSolTransactionId } from '../../../../Redux/Actions';
import { store } from '../../../../Redux/Reducers';
import EnterPinForTransaction from '../../EnterPinForTransaction/EnterPinForTransaction';
import { ACCESS_TOKEN } from '../../../../Constants';
import { sendSOLANAFromJupiterSwapLegacyTxn } from '../../../../Utils/SolUtils';

class TransactionRequest extends Component {
    /** Initializes the TransactionRequest component. */
    constructor(props) {
        super(props);
        this.state = {
            isShowReq: false,
            pinModal: false,
            showAlertDialog: false,
            showConfirmDialog: false,
            alertTxt: "",
            signingData: "",
            selectedNetwork: "Ethereum",
            coinFamily: 2,
            isLoading: false,
            calculatedFee: 0,
            fiatPrice: 0,
            gasPrice: 0,
            gasLimit: 0,
            transactionData: null,
            hideFees: false
        };
    }


    showTransactionRequest(isShow, signingData) {
        console.log("signingData>>>", JSON.stringify(signingData));
        const data = signingData?.payload?.params?.request?.params[0]
        this.setState({
            hideFees: false,
            isShowReq: isShow,
            signingData: signingData,
            coinFamily: signingData?.coinFamily,
            selectedNetwork: signingData?.coinFamily == 1 ? "Binance" :
                signingData?.coinFamily == 2 ? "Ethereum" :
                    signingData?.coinFamily == 5 ? "Solana" : "Polygon",
            transactionData: data
        }, async () => {
            if (signingData?.method == "eth_sendTransaction") {
                if (signingData?.payload?.params?.request?.method == "solana_signTransaction") {
                    let td = {
                        to: Singleton.getInstance()?.defaultSolAddress,
                        from: Singleton.getInstance()?.defaultSolAddress,
                        data: signingData?.payload?.params?.request?.params?.transaction
                    }
                    this.setState({
                        transactionData: td,
                        calculatedFee: "0.000005",
                    }, () => {
                        this.fetchNativePriceFun(signingData?.coinFamily);
                    })

                } else {
                    let calculateGasEstimate = 0
                    if (!data?.gas) {
                        calculateGasEstimate = await getGasLimitFromData(data?.from, data?.to, data?.data, signingData?.coinFamily);
                    } else {
                        calculateGasEstimate = this.hex2dec(data?.gas)
                    }
                    const gasPrice = await getGasPriceForWc(signingData?.coinFamily);
                    console.log("gasPrice>>>", gasPrice);

                    this.setState({
                        gasLimit: calculateGasEstimate,
                        gasPrice: gasPrice,
                        calculatedFee: toFixedExp(bigNumberSafeMath(bigNumberSafeMath(calculateGasEstimate, '*', gasPrice), "/", 10 ** 18), 4),
                    }, () => {
                        this.fetchNativePriceFun(signingData?.coinFamily);
                    })
                }
            } else {
                let td = {
                    to: data,
                    from: Singleton.getInstance()?.defaultEthAddress
                }
                this.setState({
                    hideFees: true,
                    transactionData: td
                })
            }
        });
    }



    fetchNativePriceFun(coinFamily) {
        let data = {
            fiat_currency: Singleton.getInstance().CurrencySelected,
            coin_family: coinFamily,
        };
        store.dispatch(fetchNativePrice({ data })).then((res) => {
            this.setState({
                isLoading: false,
                fiatPrice: toFixedExp(res?.fiatCoinPrice?.value, 2),
            });
            console.log("chk res native price:::::", res);
        })
            .catch((err) => {
                this.setState({
                    isLoading: false,
                });
                console.log("chk err native price:::::", err);
            });
    }

    closeModal() {
        this.setState({ signingData: "", isShowReq: false }, () => {
            let requests = WalletConnectInstance.getInstance().web3Wallet.getPendingSessionRequests()
            console.log("requests:::S:S::::", requests);
            requests.map(async el => {
                const response = {
                    id: el?.id,
                    jsonrpc: '2.0',
                    error: {
                        code: 5000,
                        message: 'User rejected.'
                    }
                }
                try {
                    // console.log("el?.topic::::::", el?.topic);
                    await WalletConnectInstance.getInstance().web3Wallet?.respondSessionRequest({
                        topic: el?.topic,
                        response: response,
                    });
                } catch (e) {
                    console.log('----------dapp request reject----error', e)
                }
            })
        });
    }

    ConvertBase(num) {
        return {
            from: function (baseFrom) {
                return {
                    to: function (baseTo) {
                        return parseInt(num, baseFrom).toString(baseTo);
                    },
                };
            },
        };
    }
    hex2dec(num) {
        return this.ConvertBase(num).from(16).to(10);
    }

    async prepareTransactionRaw(pin) {
        try {


            this.setState({ isLoading: true, });
            if (this.state.selectedNetwork == "Solana") {
                const mnemonics = await getEncryptedData(Singleton.getInstance().defaultSolAddress, pin);
                sendSOLANAFromJupiterSwapLegacyTxn(this.state.transactionData?.data, mnemonics)
                    .then(serializedTx => {
                        this.saveSolTransaction(serializedTx);
                    })
                    .catch(err => {
                        console.log("ERR>>>", err);

                        this.setState({ isLoading: false, });
                    })

            } else {

                let pKey = await getEncryptedData(`${Singleton.getInstance().defaultEthAddress}_pk`, pin);

                console.log("VALUE>>>>", this.state.transactionData?.value, this.hex2dec(this.state.transactionData?.value));

                let amount = (this.hex2dec(this.state.transactionData?.value) / 10 ** 18).toString();
                console.log("amount11>>>", amount);

                // if (amount.includes(".")) {
                //     amount = amount.split(".")[0]
                // }
                const nonce = await getNonceForWc(Singleton.getInstance().defaultEthAddress, this.state.coinFamily);
                console.log("amount>>>", amount);
                console.log("gasLimit>>>", this.state.gasLimit);
                console.log("gasLimit>>>", this.state.gasLimit);
                console.log("nonce>>>", nonce);
                console.log("transactionData>>>", this.state.transactionData);
                console.log("selectedNetwork>>>", this.state.selectedNetwork);
                let gasPrice = this.state.gasPrice
                if (this.state.selectedNetwork != "Ethereum") {
                    gasPrice = bigNumberSafeMath(gasPrice, "/", 10 ** 9)
                    if (gasPrice?.toString().includes(".")) {
                        gasPrice = gasPrice.split(".")[0]
                    }
                    console.log("gasPrice>>>", gasPrice);

                }

                Singleton.getInstance()
                    .getsignRawTxnDapp(
                        pKey,
                        amount,
                        gasPrice,
                        this.state.gasLimit,
                        nonce,
                        this.state.transactionData?.to,
                        this.state.transactionData?.from,
                        this.state.transactionData?.data,
                        this.state.selectedNetwork == "Ethereum"
                            ? "eth"
                            : this.state.selectedNetwork == "Binance"
                                ? "bnb"
                                : "pol"
                    ).then(serializedTx => {
                        console.log("res>>>", serializedTx);
                        pKey = ""
                        if (serializedTx != null) {
                            this.sendCoin(serializedTx, nonce);
                        }
                    })
                    .catch(err => {
                        console.log("ERR>>>", err);
                        pKey = ""
                        this.setState({ isLoading: false, });
                    })
            }
        } catch (error) {
            this.setState({ isLoading: false, });

        }
    }

    saveSolTransaction(transactionId) {
        let data = {
            amount: "0.0",
            gas_price: 0.000005,
            from: Singleton.getInstance().defaultSolAddress,
            txid: transactionId,
            to: Singleton.getInstance().defaultSolAddress,
            tx_type: "dapp",
            tx_status: "Complete"
        }
        store.dispatch(saveSolTransactionId("sol", data))
            .then(async (res) => {
                console.log("res saveSolTransactionId", res);

                const responseVal = {
                    id: parseInt(this.state.signingData?.payload?.id),
                    result: { signature: transactionId }
                    , jsonrpc: '2.0'
                }
                console.log("RES>>>", responseVal, this.state.signingData?.payload?.topic);

                await WalletConnectInstance.getInstance().web3Wallet?.respondSessionRequest({
                    topic: this.state.signingData?.payload?.topic?.toString(),
                    response: responseVal,
                });


                this.setState({ isLoading: false, showConfirmDialog: true, alertTxt: res?.message });

            })
            .catch((err) => {
                console.log("err saveSolTransactionId", err);

                this.setState({
                    isLoading: false,
                    alertTxt: err,
                    showAlertDialog: true,
                });
                // this.setState({ isLoading: false });

            })
    }


    sendCoin(serializedTx, nonce) {
        const tx_raw = serializedTx;
        const from = this.state.transactionData?.from;
        const to = this.state.transactionData?.to;
        const amount = (
            this.hex2dec(this.state.transactionData?.value) /
            10 ** 18
        ).toString();
        const gas_estimate = this.state.gasLimit;
        const eth_gas_price = this.state.gasPrice;
        const coinsym =
            this.state.selectedNetwork == "Ethereum" ? "eth" :
                this.state.selectedNetwork == "Binance" ? "bnb" : "pol";
        const coinType =
            this.state.selectedNetwork == "Ethereum" ? "ethereum" :
                this.state.selectedNetwork == "Binance" ? "binancesmartchain" : "polygon";
        const fee = toFixedExp(parseFloat(this.state.calculatedFee), 8);
        const sendCoinReq = {
            nonce: nonce,
            tx_raw: tx_raw,
            from: from,
            to: to,
            amount:
                this.hex2dec(this.state.transactionData) == 0 ? fee : amount,
            add_amount:
                this.hex2dec(this.state.transactionData) == 0 ? 1 : 0,
            gas_estimate: gas_estimate,
            gas_price: eth_gas_price,
            tx_type: "dapp",
        };
        console.log("The sendCoinReq txn is ", sendCoinReq);
        getData(ACCESS_TOKEN).then((token) => {
            console.log("The raw txn is " + tx_raw);
            store.dispatch(requestSendCoin({
                url: `${coinType}/${coinsym}/send`,
                coinSymbol: coinsym,
                sendCoinReq,
                token,
            }))
                .then(async (res) => {
                    console.log(
                        "-----------------------Response------------",
                        res.tx_hash
                    );
                    const responseVal = { id: parseInt(this.state.signingData?.payload?.id), result: res?.tx_hash, jsonrpc: '2.0' }
                    await WalletConnectInstance.getInstance().web3Wallet?.respondSessionRequest({
                        topic: this.state.signingData?.payload?.topic?.toString(),
                        response: responseVal,
                    });

                    this.setState({ isLoading: false, showConfirmDialog: true, alertTxt: res?.message });

                })
                .catch((err) => {
                    this.setState({
                        isLoading: false,
                        alertTxt: err,
                        showAlertDialog: true,
                    });
                });
        });
    }
    render() {
        if (!this.state.isShowReq) {
            return null
        }
        const { sendTrx, browser, merchantCard } = LanguageManager;

        return (
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: ThemeManager.colors.mainBgNew, zIndex: 10 }}>
                {this.state.signingData != "" && (
                    <>
                        <BlurView
                            style={styles.blurView}
                            blurType="Dark"
                            blurAmount={4}
                        // reducedTransparencyFallbackColor="white"
                        />
                        <View
                            style={{
                                ...styles.modalView,
                                // borderColor: ThemeManager.colors.borderColor,
                                // backgroundColor:'transparent',
                            }}
                        >
                            <View
                                style={{
                                    ...styles.modalinner,
                                    borderColor: ThemeManager.colors.borderColor,
                                    backgroundColor: ThemeManager.colors.mnemonicsBg,
                                }}
                            >
                                <View style={styles.ViewStyle5}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{
                                            ...styles.titleSign,
                                            color: ThemeManager.colors.blackWhiteText,
                                        }}
                                    >
                                        {browser.confirmTransaction}
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.touchableStyle}
                                        onPress={() => {
                                            this.closeModal();
                                        }}
                                    >
                                        <Image
                                            style={{
                                                tintColor: ThemeManager.colors.blackWhiteText,
                                            }}
                                            source={Images.close_icon}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.vwSignTransaction}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.textLbl,
                                            { color: ThemeManager.colors.blackWhiteText },
                                        ]}
                                    >
                                        {browser.to}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.txtValue,
                                            { color: ThemeManager.colors.lightGreyText },
                                        ]}
                                    >
                                        {this.state.transactionData?.to}
                                    </Text>
                                </View>

                                <View style={styles.vwSignTransaction}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.textLbl,
                                            { color: ThemeManager.colors.blackWhiteText },
                                        ]}
                                    >
                                        {browser.From}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.txtValue,
                                            { color: ThemeManager.colors.lightGreyText },
                                        ]}
                                    >
                                        {this.state.transactionData?.from}
                                    </Text>
                                </View>



                                {!this.state.hideFees && <View style={[styles.vwSignTransaction]}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.textLbl,
                                            { color: ThemeManager.colors.blackWhiteText },
                                        ]}
                                    >
                                        {sendTrx.transactionFee}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.txtValue,
                                            { color: ThemeManager.colors.lightGreyText, marginLeft: dimen(6) },
                                        ]}
                                    >
                                        {this.state.calculatedFee}{" "}
                                        {this.state.selectedNetwork == "Ethereum" ? "ETH" :
                                            this.state.selectedNetwork == "Binance" ? "BNB" :
                                                this.state.selectedNetwork == "Solana" ? "SOL" : "POL"}{" "}{`(${Singleton.getInstance().CurrencySymbol} ${toFixedExp(
                                                    Number(this.state.calculatedFee) *
                                                    Number(this.state.fiatPrice),
                                                    4
                                                )})`}
                                    </Text>
                                </View>}
                                {!this.state.hideFees && <View style={styles.vwSignTransaction}>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.textLbl,
                                            { color: ThemeManager.colors.blackWhiteText },
                                        ]}
                                    >
                                        {browser.total}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        style={[
                                            styles.txtValue,
                                            { color: ThemeManager.colors.lightGreyText },
                                        ]}
                                    >
                                        {toFixed(
                                            this.state.selectedNetwork == "Solana" ?
                                                this.state.calculatedFee :
                                                bigNumberSafeMath(
                                                    this.hex2dec(this.state?.transactionData?.value) /
                                                    10 ** 18,
                                                    "+",
                                                    this.state.calculatedFee
                                                ),
                                            8
                                        )}{" "}
                                        {this.state.selectedNetwork == "Ethereum" ? "ETH" :
                                            this.state.selectedNetwork == "Binance" ? "BNB" :
                                                this.state.selectedNetwork == "Solana" ? "SOL" : "POL"}
                                    </Text>
                                </View>}
                                <Button
                                    btnstyle={{ borderRadius: 6, marginBottom: 0 }}
                                    buttontext={merchantCard.submit}
                                    onPress={() => {
                                        // // this.setState({ isLoading: true });
                                        // // setTimeout(() => {
                                        // // this.signRawTxn();
                                        this.setState({ pinModal: true });
                                        // // }, 1000);
                                    }}
                                />
                            </View>
                        </View>
                        <LoaderView isLoading={this.state.isLoading} />
                    </>
                )}

                {this.state.showAlertDialog && (
                    <AppAlert
                        alertTxt={this.state.alertTxt}
                        hideAlertDialog={() => {
                            this.setState({ showAlertDialog: false });
                        }}
                    />
                )}
                {this.state.showConfirmDialog && (
                    <AppAlert
                        showSuccess={true}
                        alertTxt={this.state.alertTxt}
                        hideAlertDialog={() => {
                            this.setState({
                                showConfirmDialog: false,
                                signingData: "",
                                isShowReq: false

                            });
                        }}
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.pinModal}
                    onRequestClose={() => {
                        this.setState({ pinModal: false });
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <EnterPinForTransaction
                            onBackClick={() => {
                                this.setState({ pinModal: false });
                            }}
                            checkBiometric={true}
                            closeEnterPin={async (pin) => {
                                this.setState({ pinModal: false }, () => {
                                    setTimeout(async () => {
                                        if (this.state.signingData?.method == "eth_sendTransaction") {
                                            this.prepareTransactionRaw(pin)
                                        } else if (this.state.signingData?.method == "eth_signTypedData") {
                                            this.setState({ isLoading: true });
                                            Singleton.getInstance().dappApprovalHash(pKey, this.state.signingData?.newParams).then(async (res) => {
                                                let responseVal = { id: parseInt(this.state.signingData?.payload?.id), result: res, jsonrpc: '2.0' }
                                                try {
                                                    await WalletConnectInstance.getInstance().web3Wallet?.respondSessionRequest({
                                                        topic: this.state.signingData?.payload?.topic?.toString(),
                                                        response: responseVal,
                                                    });
                                                    Singleton.getInstance().showToast?.show('Transaction Successfully Done.', 2000)
                                                    setTimeout(() => {
                                                        this.setState({
                                                            isLoading: false,
                                                            showConfirmDialog: false,
                                                            signingData: "",
                                                            isShowReq: false
                                                        });
                                                        global.wcTxnPopup = false
                                                    }, 800);
                                                } catch (e) {
                                                    console.log('-------approval-------error', e)
                                                    this.setState({ isLoading: false });
                                                    Singleton.getInstance().showToast?.show(`${e}`)
                                                }
                                            }).catch(err => {
                                                this.setState({ isLoading: false });
                                                Singleton.getInstance().showToast?.show("Transaction failed.")
                                            })
                                        } else if (this.state.signingData?.method == "personal_sign") {
                                            this.setState({ isLoading: true });
                                            let signedMessage = await signPersonalMessage(this.state.transactionData, pKey, this.state.coinFamily);
                                            let responseVal = { id: parseInt(this.state.signingData?.payload?.id), result: signedMessage, jsonrpc: '2.0' }
                                            try {
                                                await WalletConnectInstance.getInstance().web3Wallet?.respondSessionRequest({
                                                    topic: this.state.signingData?.payload?.topic?.toString(),
                                                    response: responseVal,
                                                });
                                                Singleton.getInstance().showToast?.show('Transaction Successfully Done.')
                                                setTimeout(() => {
                                                    this.setState({
                                                        isLoading: false,
                                                        showConfirmDialog: false,
                                                        signingData: "",
                                                        isShowReq: false
                                                    });
                                                }, 800);

                                            } catch (err) {
                                                this.setState({ isLoading: false });
                                                Singleton.getInstance().showToast?.show("Transaction failed.")

                                            }
                                        }
                                        global.wcTxnData = null
                                        global.wcTxnPopup = false
                                    }, 100);
                                });
                            }}
                        />
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ViewStyle7: {
        fontSize: 16,
    },
    TextStyle2: {
        fontSize: 12,
        fontFamily: Fonts.dmRegular,
    },
    feeView: {
        paddingVertical: 7,
        width: Dimensions.get('screen').width / 4.2,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    textStyle1: {
        fontSize: 12,
        fontFamily: Fonts.dmRegular,
    },
    blurView: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1,
    },
    touchableStyle: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 40,
        width: 40,
        alignItems: 'flex-end',
    },
    ViewStyle1: {
        width: '100%',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hasNotchWithIOS() ? 20 : 0,
    },
    ViewStyle2: {
        width: 100,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
    },
    ViewStyle3: {
        width: 40,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ViewStyle4: {
        width: 50,
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ViewStyle5: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    textStyle: {
        fontFamily: Fonts.dmRegular,
        fontSize: 15,
        color: '#6DAAFF',
    },
    ViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%',
    },
    modalView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: ThemeManager.colors.Mainbg,
        // opacity: 0.94,
    },
    modalinner: {
        backgroundColor: ThemeManager.colors.whiteText,
        borderRadius: 18,
        borderWidth: 1,
        // borderColor: Colors.White,
        paddingHorizontal: 15,
        paddingVertical: 20,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.84,
        elevation: 2,
        width: '85%',
    },
    vwSignTransaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        minHeight: 40,
        marginBottom: 8,

    },
    titleSign: {
        fontFamily: Fonts.dmMedium,
        fontSize: 17,
    },
    textLbl: {
        fontFamily: Fonts.dmMedium,
        fontSize: 15,
        marginBottom: 8,
    },
    txtValue: {
        width: '86%',
        fontFamily: Fonts.dmRegular,
        fontSize: 14,
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: 'white',
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        top: -10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 1,
    },
    searchBtn: {
        width: '12%',
        justifyContent: 'center',
    },
    dapHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: hasNotchWithIOS()
            ? getDimensionPercentage(60)
            : getDimensionPercentage(0),
        height: hasNotchWithIOS()
            ? getDimensionPercentage(90)
            : getDimensionPercentage(130)
    },
    dapBackView: {
        padding: 8,
        justifyContent: 'center',
        width: '8%',
    },
    searchMainView: {
        width: '63%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInnerView: {
        height: 50,
        width: '95%',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
    },
    coinView: {
        alignItems: 'center',
        width: '18%',
        justifyContent: 'center',
    },
    coinView1: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '15%',
        justifyContent: 'flex-start',
    },
    coinImg: {
        marginRight: 2,
        width: 25,
        height: 25,
        borderRadius: 40,
    },
    coinTxt: {
        marginRight: 8,
        fontFamily: Fonts.dmMedium,
        fontSize: 13,
    },
    searchText: {
        paddingLeft: 10,
        fontFamily: Fonts.dmRegular,
        marginRight: 8,
    },
})
export default TransactionRequest;
