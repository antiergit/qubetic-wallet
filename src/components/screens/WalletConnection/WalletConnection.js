import { View, Text, ImageBackground, Image, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemeManager } from '../../../../ThemeManager'
import { Button, HeaderMain, LoaderView, ManageItem, OnboardingHeadings } from '../../common'
import styles from './WalletConnectionStyle'
import { LanguageManager } from '../../../../LanguageManager'
import images from '../../../theme/Images'
import { dimen, widthDimen } from '../../../Utils'
import QrScanner from './UiComponents/QrScanner'
import NewConnection from './UiComponents/NewConnection'
import ManageConnection from './UiComponents/ManageConnection'
import WalletConnectInstance from '../../../Utils/WalletConnectInstance'
import { EventRegister } from 'react-native-event-listeners'
import Singleton from '../../../Singleton'

const WalletConnection = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeConnections, setActiveConnections] = useState(["a"]);
    const [isQrScannerVisible, setIsQrScannerVisible] = useState(false);
    const [isNewConnectionVisible, setIsNewConnectionVisible] = useState(false);
    const [approveRequestData, setApproveRequestData] = useState(false);
    const [manageConnectionData, setManageConnectionData] = useState({
        isVisible: false,
        wcData: null,
    });
    useEffect(() => {
        getActiveConnections()
        EventRegister.addEventListener('wallet_connect_event', (link) => {
            handleAddNewConnection(link);
        })

        EventRegister.addEventListener('sessionProposal', (data) => {
            sessionProposalV2(data);
        })

        EventRegister.addEventListener('sessionDeleted', (data) => {
            getActiveConnections()
        })

        EventRegister.addEventListener('sessionRequest', (data) => {
            // allModalClose()
        })
    }, []);

    const getActiveConnections = async () => {
        let sessions = await WalletConnectInstance.getInstance()?.web3Wallet?.getActiveSessions()
        if (sessions) {
            let keys = Object?.keys(sessions)
            let connectionList = []
            keys?.map(el => {
                connectionList.push(sessions[el])
            })
            setActiveConnections(connectionList)
            return connectionList
        }
    }

    const approveConnection = async (walletAddress, isSolana) => {
        try {
            console.log("approveConnection:::", walletAddress);
            setIsNewConnectionVisible(false);
            setIsLoading(true)
            if (WalletConnectInstance.getInstance().web3Wallet) {
                console.log("approveRequestData>>>>", JSON.stringify(approveRequestData));
                let optionalChains = []
                let requireChains = []

                if (isSolana) {
                    optionalChains = approveRequestData?.params?.optionalNamespaces?.['solana']?.chains || []
                    requireChains = approveRequestData?.params?.requiredNamespaces?.['solana']?.chains || []
                } else {
                    optionalChains = approveRequestData?.params?.optionalNamespaces?.['eip155']?.chains || []
                    requireChains = approveRequestData?.params?.requiredNamespaces?.['eip155']?.chains || []
                }

                let chainList = [...optionalChains, ...requireChains]
                chainList = [...new Set(chainList)];
                let accounts = []
                console.log("chainList:::", chainList);

                chainList?.map(chain => {
                    if (isSolana) {
                        accounts.push(`${chain}:${walletAddress}`)
                    } else {
                        if (chain == "eip155:56" || chain == "eip155:1" || chain == "eip155:137") {
                            accounts.push(`${chain}:${walletAddress}`)
                        }
                    }
                })
                let namespaces = null
                if (isSolana) {
                    namespaces = {
                        solana: {
                            accounts,
                            methods: approveRequestData?.params?.requiredNamespaces['solana']?.methods || approveRequestData?.params?.optionalNamespaces['solana']?.methods,
                            events: approveRequestData?.params?.requiredNamespaces['solana']?.events || approveRequestData?.params?.optionalNamespaces['solana']?.events
                        },
                    }
                } else {
                    namespaces = {
                        eip155: {
                            accounts,
                            methods: [
                                "eth_sendTransaction",
                                "personal_sign",
                                "eth_signTypedData",
                                "eth_signTypedData_v4",
                                "eth_sign"
                            ],
                            events: approveRequestData?.params?.requiredNamespaces['eip155']?.events || approveRequestData?.params?.optionalNamespaces['eip155']?.events
                        },
                    }
                }

                console.log("namespaces:::>>>", namespaces, approveRequestData?.id);


                await WalletConnectInstance.getInstance()?.web3Wallet?.approveSession({
                    id: approveRequestData?.id,
                    namespaces: namespaces,
                });
                setIsLoading(false)
                getActiveConnections()
                Singleton.getInstance().showToast?.show("       Connected successfully\nYou can go back to your browser.", 4000);
            }
        } catch (e) {
            console.log("approveConnection_catch:::", e);
            setIsLoading(false)
        }
    }

    const sessionProposalV2 = (event) => {
        setIsLoading(false)
        console.log("Object Required>>>", Object.keys(event?.params?.requiredNamespaces));
        console.log("Object Optional>>>", Object.keys(event?.params?.optionalNamespaces));
        if (Object.keys(event?.params?.requiredNamespaces)?.toString()?.includes('solana') ||
            Object.keys(event?.params?.optionalNamespaces)?.toString()?.includes('solana') ||
            Object.keys(event?.params?.requiredNamespaces)?.toString()?.includes('eip155') ||
            Object.keys(event?.params?.optionalNamespaces)?.toString()?.includes('eip155')) {
            setApproveRequestData(event)
            setIsLoading(false)
            setIsNewConnectionVisible(true);
        } else {
            Singleton.getInstance().showToast?.show("Unsupported chain", 2000);
        }
    }

    const handleAddNewConnection = (walletUri) => {
        if (!walletUri.includes('wc')) {
            setIsLoading(false)
            return;
        }
        if (walletUri?.includes('relay-protocol')) {
            Singleton.getInstance().showToast?.show("May take a few seconds to connect", 2000);
            // setIsLoading(true)
            try {
                let interval = setInterval(() => {
                    if (WalletConnectInstance.getInstance()?.web3Wallet != null) {
                        clearInterval(interval)
                        console.log("walletUri>>>>>>>>", walletUri);

                        WalletConnectInstance.getInstance().connect(walletUri).then(res => {
                            console.log("WalletConnect.getInstance().connect_res:::", res);
                            setIsLoading(false)
                        }).catch(err => {
                            console.log("connect_catch:::", err);
                            setIsLoading(false)
                        })
                    } else {
                        console.log("Not initialized",);
                    }
                }, 1000);
            } catch (e) {
                console.log("Instance initializing_V2", e);
                setIsLoading(false)
            }
        }
    }

    const handleDeleteConnection = async (event) => {
        try {
            setIsLoading(true)
            if (event) {
                await await WalletConnectInstance.getInstance()?.deleteSession(event)
                Singleton.getInstance().showToast?.show("Disconnected successfully", 2000);
            } else {
                await WalletConnectInstance.getInstance()?.deleteAllSessions()
                Singleton.getInstance().showToast?.show("All connections disconnected successfully", 2000);
            }
            await getActiveConnections()
            setIsLoading(false)
        } catch (e) {
            console.log("handleDeleteConnection_catch:::", e);
            setIsLoading(false)
        }
    }

    return (
        <ImageBackground
            source={ThemeManager.ImageIcons.mainBgImgNew}
            style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
        >
            <HeaderMain
                BackButtonText={activeConnections.length === 0 ? LanguageManager.setting.walletConnect : ""}
                imgSecond={activeConnections.length === 0 ? images.add : images.icDeleteWC}
                onPressIcon={() => {
                    if (activeConnections.length === 0) {
                        setIsQrScannerVisible(true);
                    } else {
                        handleDeleteConnection()
                    }
                }}
                imgSecondStyle={{ tintColor: ThemeManager.colors.blackWhiteText }}
            />

            <View style={[styles.mainView,]}>
                <View style={[styles.mainView, { padding: widthDimen(25), marginBottom: dimen(20) }]}>
                    {activeConnections.length === 0 ? <View style={[styles.emptyWalletConnectionView,]}>
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                style={{ position: "absolute", }}
                                source={images.icEmptyWalletConnectionBg} resizeMode="contain" />
                            <Image source={images.icEmptyWalletConnection} resizeMode="contain" />
                        </View>
                        <Text style={[styles.emptyWalletConnectionText, { color: ThemeManager.colors.blackWhiteText }]}>{LanguageManager.walletConnection.noConnection}</Text>
                    </View> : <View style={[styles.mainView, { alignItems: "flex-start", }]}>
                        <OnboardingHeadings
                            title={LanguageManager.setting.walletConnect}
                            subTitle={LanguageManager.walletConnection.manageExistingConnections}
                        />
                        <Text style={[styles.activeConnectionsText, { color: ThemeManager.colors.blackWhiteText }]}>Active Connections</Text>

                        <FlatList
                            data={activeConnections}
                            style={{ marginTop: dimen(10), width: "100%" }}
                            renderItem={({ item }) => {
                                let data = item?.peer?.metadata
                                let iconUrl = null
                                if (data?.name == "dYdX v4") {
                                    iconUrl = data?.url + data?.icons[data?.icons?.length - 1]
                                }
                                let finalIcon = iconUrl != null ? iconUrl : data?.icons[data?.icons.length - 1]

                                return <ManageItem
                                    logo={{ uri: finalIcon }}
                                    logoStyle={{ height: dimen(40), width: dimen(40), borderRadius: dimen(14) }}
                                    nameViewStyle={{ flex: 1 }}
                                    walletName={(data?.name?.toString()?.length > 11 ? data?.name?.substring(0, 20) + "..." : data?.name) || 'Home'}
                                    walletType={data?.url?.toString()?.length > 28 ? data?.url?.substring(0, 27) + "..." : data?.url}
                                    onclickWallet={() => { setManageConnectionData({ isVisible: true, wcData: item }) }} />
                            }}
                        />
                    </View>}
                    <Button
                        buttontext={activeConnections.length === 0 ? LanguageManager.walletConnection.addNewConnection : LanguageManager.walletConnection.newConnection}
                        onPress={() => {
                            // handleAddNewConnection("wc:41ea12f2dee28b8c467cebcfeba0006e0b2ad1cb4e716351cc68f4257089a089@2?expiryTimestamp=1736244826&relay-protocol=irn&symKey=c4471da1dc9987e40ea7f5968a227c71acc707df0f712ee9fb872a4e60652236")
                            setIsQrScannerVisible(true);
                        }}
                    />

                </View>

            </View>
            <QrScanner
                isVisible={isQrScannerVisible}
                onClose={() => {
                    setIsQrScannerVisible(false);
                }}
                onRead={event => {
                    setIsQrScannerVisible(false);
                    handleAddNewConnection(event.data)
                }}
            />

            {isNewConnectionVisible && <NewConnection
                isVisible={isNewConnectionVisible}
                approveRequestData={approveRequestData}
                onClose={() => {
                    setIsNewConnectionVisible(false);
                    WalletConnectInstance.getInstance()?.rejectSession(approveRequestData?.id)
                    setTimeout(() => {
                        getActiveConnections()
                    }, 1000);
                }}
                approveConnection={approveConnection}
            />}

            <ManageConnection
                isVisible={manageConnectionData.isVisible}
                onClose={() => {
                    setManageConnectionData({ isVisible: false, wcData: null });
                }}
                wcData={manageConnectionData.wcData}
                onDisconnect={() => {
                    const event = manageConnectionData.wcData
                    setManageConnectionData({ isVisible: false, wcData: null })
                    handleDeleteConnection(event)
                }}
            />

            <LoaderView isLoading={isLoading} />
        </ImageBackground>
    )
}

export default WalletConnection