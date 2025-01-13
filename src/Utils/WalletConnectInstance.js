//***********FOR_WALLET_CONNECT_V2_NEW***************/
import { Core } from '@walletconnect/core'
import { Web3Wallet, IWeb3Wallet } from '@walletconnect/web3wallet'
import { EventRegister } from 'react-native-event-listeners';
import { getSdkError } from '@walletconnect/utils';
import Singleton from '../Singleton';

const core = new Core({
    projectId: "5e8c24ef32ea3fedca2d3af1cc5a2911"
})

export default class WalletConnectInstance {

    static myInstance = null;
    web3Wallet = null;
    invalidQR = null;
    smartContractCallInterval = null

    /**
     * Singleton to get the instance of the WalletConnectInstance
     * @return {WalletConnectInstance} - The instance of the WalletConnectInstance
     */

    static getInstance() {
        if (WalletConnectInstance.myInstance == null) {
            WalletConnectInstance.myInstance = new WalletConnectInstance();
            WalletConnectInstance.myInstance.initializeWalletConnect()
        }
        return this.myInstance;
    }

    initializeWalletConnect = async () => {
        try {
            this.web3Wallet = await Web3Wallet.init({
                core, // <- pass the shared `core` instance
                metadata: {
                    name: "Qubetics Wallet",
                    description: "Qubetics Wallet",
                    url: "https://stage-wallet-api.qubetics.work",
                    icons: ["https://walletconnect.com/walletconnect-logo.png"],
                },
            })

        } catch (error) {
            console.log("error>>>", error);
        }

        // Approval: Using this listener for sessionProposal, you can accept the session
        this.web3Wallet.on("session_proposal", async (proposal) => {
            console.log("session_proposal>>>>>>", proposal);

            EventRegister.emitEvent("sessionProposal", proposal)
            clearTimeout(this.invalidQR)
        });

        this.web3Wallet.on("session_delete", async (proposal) => {
            EventRegister.emitEvent("sessionDeleted", proposal)
            let requests = this.web3Wallet.getPendingSessionRequests()

            requests.map(async el => {
                //Delete all pending requests for particular session before disconnecting the session
                if (el?.topic == topic) {
                    const response = {
                        id: el?.id,
                        jsonrpc: '2.0',
                        error: {
                            code: 5000,
                            message: 'User rejected.'
                        }
                    }
                    try {
                        await this.web3Wallet?.respondSessionRequest({
                            topic: el?.topic,
                            response: response,
                        });
                    } catch (e) {
                        //console.log('--------------error', e)
                    }
                }
            })

        });

        this.web3Wallet.on('session_request', async (event) => {

            this.sessionRequest(event)
        })
    }

    connect = async (walletUri) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("walletUri>>>", this.web3Wallet);

                const response = await this.web3Wallet.core.pairing.pair({ uri: walletUri })
                console.log("response>>>>>>", response);

                this.invalidQR = setTimeout(() => {
                    try {
                        if (this.web3Wallet) {
                            if (!this.web3Wallet?.connected) {
                                Singleton.getInstance().showToast?.show("Invalid QR Code.");
                                reject()
                            }
                        }
                    } catch (e) {
                        console.log("exception--------", e);
                    }
                }, 15000);
                resolve()
            } catch (error) {
                Singleton.getInstance().showToast?.show("Invalid QR Code.", 3000);
                console.log('-------------connectionError', error)
                reject(error)
            }
        })
    }

    rejectSession = (id) => {
        this.web3Wallet.rejectSession({
            id: id,
            reason: getSdkError("USER_REJECTED_METHODS"),
        });
    }

    sessionRequest = (payload) => {
        let coinFamily = null
        if (payload?.params?.chainId?.toString()?.includes('solana')) {
            coinFamily = 5  // for SOLANA
        } else if (payload?.params?.chainId?.toString() == 'eip155:56') {
            coinFamily = 1  // for BNB
        } else if (payload?.params?.chainId?.toString() == 'eip155:137') {
            coinFamily = 4  // for POLYGON
        } else if (payload?.params?.chainId?.toString() == 'eip155:1') {
            coinFamily = 2  // for ETH
        } else {
            coinFamily = 6
        }
        if (coinFamily == 6) {
            Singleton.getInstance().showToast?.show("Unsupported chain");
            return
        } else if (payload?.params?.request?.method.includes('personal_sign')) {   //Personal Sign
            console.log("INSIDE PERSONAL SIGN");
            EventRegister.emitEvent("sessionRequest", true)

            global.callRequest = true;
            clearInterval(this.smartContractCallInterval)
            this.smartContractCallInterval = setInterval(() => {
                let data = {
                    payload: payload,
                    coinFamily: coinFamily,
                    newParams: payload?.params?.request?.params[0],
                    method: 'personal_sign'
                }
                console.log("data:PERSONAL SIGN::>:>>:>>", data);
                EventRegister.emitEvent("requestFromDapp", data)
                clearInterval(this.smartContractCallInterval)
            }, 2000);
            return

        } else {
            EventRegister.emitEvent("sessionRequest", true)
            if (payload?.params?.request?.method.includes("eth_signTypedData")) {        //Sign type data
                let adrs = payload.params?.request?.params[0]
                let approvalParam = JSON.parse(payload?.params?.request?.params[1]);
                let typeArr = Object.keys(approvalParam.types)
                let newTypes = {}
                typeArr.map(el => {
                    if (el != "EIP712Domain") {
                        newTypes[el] = approvalParam.types[el]

                    }
                })
                // console.log("newTypes ", newTypes)
                let newParams = {
                    domain: approvalParam.domain,
                    types: newTypes,
                    message: approvalParam.message,
                };
                global.callRequest = true;
                clearInterval(this.smartContractCallInterval)
                this.smartContractCallInterval = setInterval(() => {
                    let data = {
                        payload: payload,
                        coinFamily: coinFamily,
                        newParams: newParams,
                        method: 'eth_signTypedData'
                    }
                    EventRegister.emitEvent("requestFromDapp", data)
                    clearInterval(this.smartContractCallInterval)
                }, 2000);
                return


            } else {      // Send Txn
                global.callRequest = true;
                clearInterval(this.smartContractCallInterval)
                this.smartContractCallInterval = setInterval(() => {
                    let data = {
                        payload: payload,
                        coinFamily: coinFamily,
                        method: 'eth_sendTransaction'
                    }
                    EventRegister.emitEvent("requestFromDapp", data)
                    clearInterval(this.smartContractCallInterval)
                }, 2000);
            }
        }
    }

    deleteSession = async (event) => {
        return new Promise(async (resolve, reject) => {
            const { topic } = event
            let requests = this.web3Wallet.getPendingSessionRequests()
            requests.map(async el => {
                //Delete all pending requests for particular session before disconnecting the session
                if (el?.topic == topic) {
                    const response = {
                        id: el?.id,
                        jsonrpc: '2.0',
                        error: {
                            code: 5000,
                            message: 'User rejected.'
                        }
                    }
                    try {
                        await this.web3Wallet?.respondSessionRequest({
                            topic: el?.topic,
                            response: response,
                        });
                    } catch (e) {
                        console.log('----------deleteSession----error', e)
                    }
                }
            })


            try {
                await this.web3Wallet.disconnectSession({
                    topic,
                    reason: getSdkError('USER_DISCONNECTED')
                })
            } catch (error) {
            }
            setTimeout(() => {
                resolve()
            }, 1000);
        })

    }

    deleteAllSessions = () => {

        //console.log("deleteAllSessions======")

        return new Promise((resolve, reject) => {
            if (!this.web3Wallet) {
                reject()
                return
            }
            let requests = this.web3Wallet.getPendingSessionRequests()
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
                    await this.web3Wallet?.respondSessionRequest({
                        topic: el?.topic,
                        response: response,
                    });
                } catch (e) {
                    //console.log('--------------error', e)
                }
            })

            let sessions = this.web3Wallet.getActiveSessions()
            let keys = Object.keys(sessions)
            let connectionList = []
            keys.map(el => {
                connectionList.push(sessions[el])
            })

            console.log('-----------sessions', connectionList)
            try {
                connectionList.map(async el => {

                    await this.web3Wallet.disconnectSession({
                        topic: el.topic,
                        reason: getSdkError('USER_DISCONNECTED')
                    })

                })
            } catch (error) {
            } finally {
                console.log('-----------finally')
                EventRegister.emitEvent("deleteAllSession", true)
            }

            setTimeout(() => {
                resolve()
            }, 1000);
        })

    }

    extendSession = async () => {
        return new Promise(async (resolve, reject) => {
            let sessions = this.web3Wallet.getActiveSessions()
            let keys = Object.keys(sessions)
            keys.map(async (el) => {
                // console.log("el>>>>extendSession>>>>>>>", el);
                try {
                    await this.web3Wallet?.extendSession({ topic: el });
                } catch (e) {
                    console.log('----------extendSession----error', e)
                }
            })
        })

    }
}
