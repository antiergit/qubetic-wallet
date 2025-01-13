import { createSolAddress } from "./MnemonicsUtils";
import Singleton from "../Singleton";
import { bigNumberSafeMath } from "./MethodsUtils";
import { NativeModules } from "react-native";
const { derivePath } = require('ed25519-hd-key');
const solanaWeb3 = require('@solana/web3.js');
const splToken = require('@solana/spl-token')
const bip39 = require('bip39');
const {
    Connection,
} = require('@solana/web3.js');
import promiseRetry from "promise-retry";

const { CreateWallet } = NativeModules;

const error = "Cannot proceed with this transaction. Please try again."

export const validateSolanaAddress = text => {
    try {
        new solanaWeb3.PublicKey(text);
        return true;
    } catch (error) {
        return false;
    }
};


export const sendSOLANA = async (
    recipientPublicKey,
    recipientAmount,
    mnemonics,
) => {
    return new Promise(async (resolve, reject) => {
        try {
            const LAMPORTS_PER_SOL = solanaWeb3.LAMPORTS_PER_SOL;

            let amount = bigNumberSafeMath(recipientAmount, '*', LAMPORTS_PER_SOL);
            const fromAccount = await createSolAddress(mnemonics);
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: fromAccount.publicKey,
                    toPubkey: new solanaWeb3.PublicKey(recipientPublicKey),
                    lamports: Number(amount),
                }),
            );

            let solRpcUrl = Singleton.getInstance().SOL_RPC_URL;
            console.log('transaction::::solRpcUrl', solRpcUrl);
            const connection = new Connection(solRpcUrl, 'confirmed');
            console.log('connection::::solRpcUrl', connection);

            let res = await solanaWeb3.sendAndConfirmTransaction(
                connection,
                transaction,
                [fromAccount],
            );
            console.log('SIGNATURE_SOl>>>>>>>', res);
            return resolve(res);
        } catch (err) {
            console.log('ERROR>SOLANA SEND>>>>>>', err);

            let message = err?.message ? err?.message : err
            let arr = message.split(' ');
            let findIndex = arr?.indexOf("signature") == -1 ? arr?.indexOf("Signature") : arr?.indexOf("signature")
            if (findIndex != -1 && arr.length >= findIndex + 1) {
                arr[findIndex + 1];
                let res = arr[findIndex + 1];
                return resolve(res);
            } else if (message?.includes('Too Many Requests')) {
                return reject('Txn cannot send. Please try again.');
            } else {
                return reject(err);
            }
        }
    });
};


// export const sendTokenSOLANA = async (
//     recipientPublicKey,
//     recipientAmount,
//     mnemonics,
//     contractAddress,
// ) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const fromWallet = await createSolAddress(mnemonics);


//             const mint = new solanaWeb3.PublicKey(contractAddress);
//             const receipentKey = new solanaWeb3.PublicKey(recipientPublicKey);
//             // Get the token account of the fromWallet address, and if it does not exist, create it
//             let solRpcUrl = "https://api.mainnet-beta.solana.com"//Singleton.getInstance().SOL_RPC_URL;
//             console.log("solRpcUrl:::", solRpcUrl);
//             const connection = new Connection(solRpcUrl, 'confirmed');

//             const myToken = new splToken.Token(
//                 connection,
//                 mint,
//                 splToken.TOKEN_PROGRAM_ID,
//                 fromWallet
//             );
//             // console.log("myToken::::::", myToken);
//             const fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
//                 fromWallet.publicKey
//             );
//             console.log("fromTokenAccount:::::", fromTokenAccount);
//             const toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
//                 receipentKey
//             );
//             console.log("toTokenAccount:::::", toTokenAccount);
//             const transaction = new solanaWeb3.Transaction().add(
//                 splToken.Token.createTransferInstruction(
//                     splToken.TOKEN_PROGRAM_ID,
//                     fromTokenAccount.address,
//                     toTokenAccount.address,
//                     fromWallet.publicKey,
//                     [],
//                     recipientAmount
//                 )
//             );
//             // console.log("transaction::::", transaction);
//             let res = await solanaWeb3.sendAndConfirmTransaction(
//                 connection,
//                 transaction,
//                 [fromWallet],
//                 // { commitment: 'singleGossip', preflightCommitment: 'singleGossip' }
//                 {
//                     skipPreflight: true,
//                     commitment: "confirmed",
//                     maxRetries: 1,
//                     preflightCommitment: "confirmed",
//                 },
//                 // { skipPreflight: true, maxRetries: 5, priorityFeePerComputeUnit: 25000 }
//             );

//             console.log('SIGNATURE_Sol_Token>>>>>>>', res);
//             return resolve(res);
//         } catch (err) {
//             console.log('ERROR_GENERATING_TOKEN_TRANSACTION_ID--->', err);
//             // Convert the error to a string
//             let errorString = String(err);
//             // Use a regular expression to extract the JSON part
//             let jsonPart = errorString.match(/{.*}/);
//             // Parse the JSON string if a match was found
//             let messageErr = null
//             if (jsonPart) {
//                 const parsedResponse = JSON.parse(jsonPart[0]);
//                 messageErr = parsedResponse?.error?.message;
//             }
//             let message = err?.message ? err?.message : err
//             let arr = message.split(' ');
//             let findIndex = arr?.indexOf("signature") == -1 ? arr?.indexOf("Signature") : arr?.indexOf("signature")
//             if (findIndex != -1 && arr.length >= findIndex + 1) {
//                 arr[findIndex + 1];
//                 let res = arr[findIndex + 1];
//                 return resolve(res);
//             } else if (message?.includes('Too Many Requests')) {
//                 return reject('Txn cannot send. Please try again.');
//             } else if (messageErr?.includes('Too many requests')) {
//                 return reject('Txn cannot send. Please try again.');
//             } else {
//                 return reject(err);
//             }
//             // return reject(err);
//         }
//     });
// };


export const sendTokenSOLANA = async (
    recipientPublicKey,
    recipientAmount,
    mnemonics,
    contractAddress,
    decimal
) => {
    return new Promise(async (resolve, reject) => {
        // Singleton.getInstance().SOL_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=85f64171-ce5a-4d6a-9244-cc9a05fc82d0"
        let solRpcUrl = Singleton.getInstance().SOL_RPC_URL;
        console.log("solRpcUrl>>>>",
            solRpcUrl,
            recipientPublicKey,
            recipientAmount,
            mnemonics,
            contractAddress,
            decimal
        );

        const connection = new Connection(solRpcUrl, 'confirmed');
        const fromAccount = await createSolAddress(mnemonics);
        // console.log("mnemonics::::", mnemonics);
        const myMint = new solanaWeb3.PublicKey(contractAddress);


        const myToken = new splToken.Token(
            connection,
            myMint,
            splToken.TOKEN_PROGRAM_ID,
            fromAccount,
        );
        // console.log("myToken:::::", myToken);
        // console.log("fromAccount.publicKey::", fromAccount.publicKey);

        const fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
            fromAccount.publicKey,
        );
        // console.log("fromTokenAccount:::::", fromTokenAccount.address);
        let fromTokenAccountAddress = fromTokenAccount.address//await splToken.Token.getAssociatedTokenAddress(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, myMint, new solanaWeb3.PublicKey(fromAccount.publicKey))

        let toTokenAccountAddress = await splToken.Token.getAssociatedTokenAddress(splToken.ASSOCIATED_TOKEN_PROGRAM_ID, splToken.TOKEN_PROGRAM_ID, myMint, new solanaWeb3.PublicKey(recipientPublicKey))
        // console.log("toTokenAccount address:::::", toTokenAccountAddress);

        try {
            let toAccountInfo = await myToken.getAccountInfo(toTokenAccountAddress)

            return solTokenNativeTxn(mnemonics, fromTokenAccountAddress, toAccountInfo.address, contractAddress, recipientAmount, decimal).then(res => {
                console.log('-------------------------solTokenNativeTxn-res', res);
                mnemonics = ""
                resolve(res)
            }).catch(err => {
                mnemonics = ""
                reject(err)
            })
        } catch (error) {
            console.log("error::::::", error);
            const blockhash = (await connection.getLatestBlockhash('finalized'))
                .blockhash;
            console.log("blockhash::::", blockhash);
            CreateWallet.createTokenAccountSigner(mnemonics, recipientPublicKey, contractAddress, toTokenAccountAddress.toString(), blockhash, async (res) => {
                console.debug("createTokenAccountSigner res", res);
                let obj = JSON.parse(res);
                let serializedTransaction = obj.rawTxn;

                try {
                    console.debug("createTokenAccountSigner serializedTransaction", serializedTransaction);
                    const transactionResponse = await transactionSenderAndConfirmationWaiter({
                        serializedTransaction,
                    });
                    console.debug("createTokenAccountSigner transactionResponse:::::", transactionResponse);
                    setTimeout(async () => {
                        try {
                            let toAccountInfo1 = await myToken.getAccountInfo(toTokenAccountAddress)
                            console.log("toAccountInfo:::::", toAccountInfo1);
                            return solTokenNativeTxn(mnemonics, fromTokenAccountAddress, toAccountInfo1.address, contractAddress, recipientAmount, decimal).then(res => {
                                mnemonics = ""
                                resolve(res)
                            }).catch(err => {
                                mnemonics = ""
                                reject(err)
                            })
                        } catch (error) {
                            console.debug("toAccountInfo Error:::::", error);
                            mnemonics = ""
                            reject({ message: error })
                        }
                    }, 2000);
                } catch (err) {
                    console.debug("createTokenAccountSigner err", err);
                    if (err == null) {
                        setTimeout(async () => {
                            try {
                                let toAccountInfo1 = await myToken.getAccountInfo(toTokenAccountAddress)
                                console.debug("toAccountInfo:::::", toAccountInfo1);
                                return solTokenNativeTxn(mnemonics, fromTokenAccountAddress, toAccountInfo1.address, contractAddress, recipientAmount, decimal).then(res => {
                                    mnemonics = ""
                                    resolve(res)
                                }).catch(err => {
                                    reject(err)
                                })
                            } catch (error) {
                                mnemonics = ""
                                console.debug("toAccountInfo Error:::::", error);
                                reject({ message: error })
                            }
                        }, 2000);
                    } else {
                        mnemonics = ""
                        // return reject(err)
                        reject({ message: error })
                    }

                }
            })
        }
    });
};


const solTokenNativeTxn = (mnemonics, fromTokenAccountAddress, toTokenAccountAddress, contractAddress, recipientAmount, decimal) => {
    console.log("solTokenNativeTxn::::");
    return new Promise(async (resolve, reject) => {

        console.debug("solTokenNativeTxn:::: 1");

        let solRpcUrl = Singleton.getInstance().SOL_RPC_URL;
        const connection = new Connection(solRpcUrl, 'confirmed');
        const blockhash = (await connection.getLatestBlockhash('finalized'))
            .blockhash;

        CreateWallet.signSolanaTokenTransaction(mnemonics, fromTokenAccountAddress.toString(), toTokenAccountAddress.toString(), contractAddress, recipientAmount.toString(), blockhash.toString(), (decimal.toString().length - 1).toString(), async (res) => {

            let obj = JSON.parse(res);
            let serializedTransaction = obj.rawTxn;

            try {
                const transactionResponse = await transactionSenderAndConfirmationWaiter({
                    serializedTransaction,
                });
                console.debug('-------------------transactionResponse', transactionResponse)
                // console.log('-------------------transactionResponse', obj.signature)

                resolve(obj.signature);

            } catch (err) {
                console.debug('-------------------err', err)
                if (err == null) {
                    resolve(obj.signature)
                } else {
                    // return reject(err)
                    reject(error);
                }
            }
        })
    })
}
const SEND_OPTIONS = {
    skipPreflight: true,
};

export const sendSOLANAFromJupiterSwapLegacyTxn = async (swapTransaction, mnemonics) => {
    console.debug("swapTransaction:::::", swapTransaction);
    return new Promise(async (resolve, reject) => {

        CreateWallet.signSolanaWalletConnectRequest(mnemonics, swapTransaction, async (result) => {
            let obj = JSON.parse(result);
            let serializedTransaction = obj.rawTxn;
            console.debug("serializedTransaction:::::", serializedTransaction);
            console.debug("signature:::::", obj.signature);

            try {
                let simulatedTxn = await simulateTransaction(serializedTransaction);
                console.debug("simulatedTxn>>>>>>>xx>>>", JSON.stringify(simulatedTxn));

                if (simulatedTxn?.result?.err == null) {
                    const transactionResponse = await transactionSenderAndConfirmationWaiter({
                        serializedTransaction,

                    });
                    console.debug("transactionResponse::>:>:>:>:>", transactionResponse);
                    return resolve(obj.signature);
                } else {
                    return reject(simulatedTxn?.result?.err?.error ? simulatedTxn?.result?.err?.error : "Cloud not proceed with swap. Please try again.");
                }


            } catch (err) {
                console.debug('-------------------err', err)
                if (err == null) {
                    return reject("Cloud not proceed with swap. Please try again.");
                } else {
                    return resolve(obj?.signature || err?.toString());
                }
            }
        })
    });
};


async function simulateTransaction(base64Transaction) {
    return new Promise(async (resolve, reject) => {
        const url = Singleton.getInstance().SOL_RPC_URL;

        // Construct the payload
        const payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "simulateTransaction",
            "params": [
                base64Transaction,
                {
                    "encoding": "base64",
                    "sigVerify": true,
                    "commitment": "processed"
                }
            ]
        };

        try {
            // Send the POST request
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            // Handle the response
            if (!response.ok) {
                // console.error(`HTTP error: ${response.status}`);
                return reject({
                    message: "Simulation failed. Please try again."
                });
            }

            const result = await response.json();
            console.log("Simulation Result:", JSON.stringify(result));
            resolve(result);
        } catch (error) {
            console.error("Error simulating transaction:", error);
            reject(error);
        }
    })
}

export async function transactionSenderAndConfirmationWaiter({
    serializedTransaction,
}) {
    let solRpcUrl = Singleton.getInstance().SOL_RPC_URL;
    const connection = new Connection(solRpcUrl, 'confirmed');
    console.debug('---------------serializedTransaction', serializedTransaction)
    const txid = await connection.sendEncodedTransaction(
        serializedTransaction,
        SEND_OPTIONS
    );


    console.debug('---------------txtId', txid)
    const controller = new AbortController();
    const abortSignal = controller.signal;

    const abortableResender = async () => {
        while (true) {
            await wait(2000);
            if (abortSignal.aborted) return;
            try {
                await connection.sendEncodedTransaction(
                    serializedTransaction,
                    SEND_OPTIONS
                );
            } catch (e) {
                console.warn(`Failed to resend transaction: ${e}`);
            }
        }
    };

    try {
        abortableResender();
        // const lastValidBlockHeight =
        //   blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

        // this would throw TransactionExpiredBlockheightExceededError


        await Promise.race([
            connection.getTransaction(txid,
                {
                    commitment: "confirmed",
                    maxSupportedTransactionVersion: 0
                }
            ),
            new Promise(async (resolve) => {
                // in case ws socket died
                while (!abortSignal.aborted) {
                    await wait(2000);
                    const tx = await connection.getSignatureStatus(txid, {
                        searchTransactionHistory: false,
                    });
                    if (tx?.value?.confirmationStatus === "finalized") {
                        resolve(tx);
                    }
                }
            }),
        ]);
    } catch (e) {
        if (e) {
            // we consume this error and getTransaction would return null
            // console.log('---------------error e', e)
            return e;
        } else {
            // invalid state from web3.js
            // console.log('---------------error e throw', e)
            throw e;
        }
    } finally {
        controller.abort();
    }

    // in case rpc is not synced yet, we add some retries
    const response = promiseRetry(
        async (retry) => {
            const response = await connection.getTransaction(txid, {
                commitment: "confirmed",
                maxSupportedTransactionVersion: 0,
            });
            if (!response || response == null) {
                retry(response);
            }
            return response;
        },
        {
            retries: 5,
            minTimeout: 1e3,
        }
    );

    return response;
}

export const wait = (time) =>
    new Promise((resolve) => setTimeout(resolve, time));

export const validSolanaTokenAddress = async (tokenAddress) => {
    try {
        const publicKey = new PublicKey(tokenAddress);
        const token = new splToken.Token(
            new solanaWeb3.Connection('https://api.mainnet-beta.solana.com'),
            publicKey,
            splToken.TOKEN_PROGRAM_ID,
            null // You can pass a provider here if needed
        );
        await token.getMintInfo();
        console.log("validSolanaTokenAddress_gettingSuccess:::");
        return true;
    } catch (error) {
        console.log("validSolanaTokenAddress_gettingError:::", error);
        // An error will be thrown if the address is not a valid token address
        return false;
    }
}

export function deriveSolanaPrivateKey(mnemonic) {
    // Validate the mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
    }

    // Convert mnemonic to seed
    const seed = bip39.mnemonicToSeedSync(mnemonic); // Sync version

    // Derive the keypair from the first 32 bytes of the seed
    const keypair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));

    // Return the private key
    return keypair.secretKey;
}
