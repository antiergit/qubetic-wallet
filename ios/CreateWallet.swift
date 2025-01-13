//
//  CreateWallet.swift
//  WalletNativeDemo
//
//  Created by user on 02/03/23.
//

import UIKit
import HDWalletKit
import CryptoSwift
import React
import HDWalletKitBTC
import WalletCore

@objc(CreateWallet)
class CreateWallet: NSObject {

  @objc(generateMnemonics:)
 func generateMnemonics(_ callback: @escaping RCTResponseSenderBlock) {
   // Date is ready to use!
   let mnemonics = Mnemonic.create()
   let seed = Mnemonic.createSeed(mnemonic:mnemonics)
   let ethObj = generateAddress(seed: seed, coin: .ethereum)
   let btcObj = generateBip84Address(seed: seed, network: .main)
   let ltcObj = generateBip84Address(seed: seed, network: .ltc)
   let bchObj = generateBip84Address(seed: seed, network: .bch)
//   let dogeObj = generateDogeAddress(seed: seed, network: .doge, coin: .dogecoin)


   var obj = [String: Any]()
   obj["mnemonics"] =  mnemonics
   obj["eth"] = ethObj
   obj["btc"] = btcObj
   obj["ltc"] = ltcObj
   obj["bch"] = bchObj
//   obj["doge"] = dogeObj
   callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
 }
  
  @objc(generateAddressFromMnemonics:callback:)
  func generateAddressFromMnemonics(menmonicsString:String, callback: @escaping RCTResponseSenderBlock) {
    
    let seed = Mnemonic.createSeed(mnemonic:menmonicsString)
    
    let ethObj = generateAddress(seed: seed, coin: .ethereum)
    let btcObj = generateBip84Address(seed: seed, network: .main)
    let ltcObj = generateBip84Address(seed: seed, network: .ltc)
    let bchObj = generateBip84Address(seed: seed, network: .bch)

//    let dogeObj = generateDogeAddress(seed: seed, network: .doge, coin: .dogecoin)

    var obj = [String: [String: String]]()
    obj["eth"] = ethObj
    obj["btc"] = btcObj
    obj["ltc"] = ltcObj
    obj["bch"] = bchObj
//    obj["doge"] = dogeObj
    callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
  }
  
  func generateBip84Address(seed: Data, network: Network)-> [String: String]{
    let wallet = WalletBTC(seed: seed, network: network)
    let masterPrivateKey = wallet.privateKey
    let purpose = masterPrivateKey.derived(at: 84, hardens: true)
    let coinType = purpose.derived(at: network.coinType, hardens: true)
    let account = coinType.derived(at: 0, hardens: true)
    let change = account.derived(at: 0)
    let firstPrivateKey = change.derived(at: 0)
    let pvtKey = firstPrivateKey.wifiCompressed()
    let publicAddress = wallet.generateAddressBIP84(at: 0)
    
    var obj = [String: String]()
    obj["address"] = publicAddress
    obj["pvtKey"] = pvtKey
    return obj
  }
  
//  func generateDogeAddress(seed: Data, network: Network, coin: Coin)-> [String: String]{
//    let wallet = Wallet(seed: seed, network: network)
//    let masterPrivateKey = wallet.privateKey
//    let purpose = masterPrivateKey.derived(at: 44, hardens: true)
//    let coinType = purpose.derived(at: network.coinType, hardens: true)
//    let account = coinType.derived(at: 0, hardens: true)
//    let change = account.derived(at: 0)
//    let firstPrivateKey = change.derived(at: 0)
//    let pvtKey = firstPrivateKey.wifiCompressed()
//
//    let walletNew = Wallet(seed: seed, coin: coin)
//    let accountNew = walletNew.generateAccount()
//    let publicAddress = accountNew.address
//
//    var obj = [String: String]()
//    obj["address"] = publicAddress
//    obj["pvtKey"] = pvtKey
//    return obj
//  }
  
 
 
  func generateAddress(seed: Data, coin: Coin) -> [String: String]{
    let wallet = Wallet(seed: seed, coin: coin)
    let account = wallet.generateAccount()
    let publicAddress = account.address
    let pvtKey = account.rawPrivateKey
    var obj = [String: String]()
    obj["address"] = publicAddress
    obj["pvtKey"] = coin == .ethereum ? "0x"+pvtKey : pvtKey
    return obj
  }
  
  
  
   @objc(signSolanaTransaction:toAddress:amount:recentBlockhash:callback:)
   func signSolanaTransaction(
     pvtKey: String,
     toAddress: String,
     amount: String, // Amount in lamports (1 SOL = 1,000,000,000 lamports)
     recentBlockhash: String,
     _ callback: @escaping RCTResponseSenderBlock
   ) {
     
 //    let privateKey = PrivateKey(data: Base58.decode(pvtKey)!)
     let hdWallet = HDWallet(mnemonic: pvtKey, passphrase: "")!
     let privateKey = hdWallet.getKeyForCoin(coin: .solana)
         
     let transferMessage = SolanaTransfer.with {
       $0.recipient = toAddress
       $0.value = UInt64(amount)!
     }
     
     let input = SolanaSigningInput.with {
                 $0.transferTransaction = transferMessage
                 $0.recentBlockhash = recentBlockhash
                 $0.privateKey = privateKey.data
                 $0.txEncoding = .base64
               }
     let output: SolanaSigningOutput = AnySigner.sign(input: input, coin: .solana)
      
     print("Signed Transaction (Hex): \(output.encoded)")
     
     let obj = ["rawTxn": output.encoded, "signature": output.signatures.first?.signature ]
     
     print(obj)
     callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])

   }
   
   @objc(signSolanaTokenTransaction:fromAddress:toAddress:tokenMintAddress:amount:recentBlockhash:decimal:callback:)
   func signSolanaTokenTransaction(pvtKey: String,
                                   fromAddress: String,
                                   toAddress: String,
                                   tokenMintAddress: String,
                                   amount: String, // Amount in lamports (1 SOL = 1,000,000,000 lamports)
                                   recentBlockhash: String,
                                   decimal: String,
                                   _ callback: @escaping RCTResponseSenderBlock) {
     let hdWallet = HDWallet(mnemonic: pvtKey, passphrase: "")!
     let privateKey = hdWallet.getKeyForCoin(coin: .solana)
     
     
     let fromTokenAccount = fromAddress//getTokenAccount(tokenAddress: tokenMintAddress, walletAddress: fromAddress)
     
     let toTokenAccount = toAddress//getTokenAccount(tokenAddress: tokenMintAddress, walletAddress: toAddress)
     
     let tokenTransferMessage = SolanaTokenTransfer.with {
       $0.tokenMintAddress = tokenMintAddress
       $0.recipientTokenAddress = toTokenAccount
       $0.senderTokenAddress = fromTokenAccount
       $0.amount = UInt64(amount)!
       $0.decimals = UInt32(decimal)!
     }
     let input = SolanaSigningInput.with {
       $0.tokenTransferTransaction = tokenTransferMessage
       $0.recentBlockhash = recentBlockhash
       $0.privateKey = privateKey.data
       $0.txEncoding = .base64
     }
     
     let output: SolanaSigningOutput = AnySigner.sign(input: input, coin: .solana)
     
     let obj = ["rawTxn": output.encoded, "signature": output.signatures.first?.signature ]
     
     print(obj)
     callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
   }
   
   @objc(createTokenAccountSigner:mainAddress:tokenMintAddress:tokenAddress:recentBlockhash:callback:)
   func createTokenAccountSigner(pvtKey: String, mainAddress: String, tokenMintAddress: String, tokenAddress: String, recentBlockhash: String, _ callback: @escaping RCTResponseSenderBlock) {
     let hdWallet = HDWallet(mnemonic: pvtKey, passphrase: "")!
     let privateKey = hdWallet.getKeyForCoin(coin: .solana)
     let createAccountMessage = SolanaCreateTokenAccount.with {
               $0.mainAddress = mainAddress
               $0.tokenMintAddress = tokenMintAddress
               $0.tokenAddress = tokenAddress
           }
           
     
     let input = SolanaSigningInput.with {
       $0.createTokenAccountTransaction = createAccountMessage
       $0.recentBlockhash = recentBlockhash
       $0.privateKey = privateKey.data
       $0.txEncoding = .base64
       $0.priorityFeePrice = SolanaPriorityFeePrice.with {
         $0.price = 10000
       }
       $0.priorityFeeLimit = SolanaPriorityFeeLimit.with{
         $0.limit = 1000000
       }
     }

     let output: SolanaSigningOutput = AnySigner.sign(input: input, coin: .solana)
     let obj = ["rawTxn": output.encoded, "signature": output.signatures.first?.signature ]
     
   
     print(obj)
     callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
   }
   
   @objc(signSolanaWalletConnectRequest:requestPayload:callback:)
  func signSolanaWalletConnectRequest(pvtKey: String, requestPayload: String, _ callback: @escaping RCTResponseSenderBlock)  {
    let hdWallet = HDWallet(mnemonic: pvtKey, passphrase: "")!
    let privateKey = hdWallet.getKeyForCoin(coin: .solana)
    
    let payload = String(format: """
         {"transaction":"%@"}
         """, requestPayload)
    // Step 1: Parse a signing request received through WalletConnect.
    let parsingInput = WalletConnectParseRequestInput.with {
      $0.method = .solanaSignTransaction
      $0.payload = payload
    }
    
    do {
      let parsingInputBytes = try parsingInput.serializedData()
      
      let parsingOutputBytes = WalletConnectRequest.parse(coin: .solana, input: parsingInputBytes)
      let parsingOutput = try WalletConnectParseRequestOutput(serializedBytes: parsingOutputBytes)
      
      var signingInput = parsingOutput.solana
      
      // Step 2: Set missing fields.
      signingInput.privateKey = privateKey.data
      signingInput.txEncoding = .base64
      
      // Step 3: Sign the transaction.
      let output: SolanaSigningOutput = AnySigner.sign(input: signingInput, coin: .solana)
      let obj = ["rawTxn": output.encoded, "signature": output.signatures.first?.signature ]
      
      print(obj)
      callback([String(data: try! JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted), encoding: .utf8)!])
    } catch {
      //handle error
      print(error)
    }
    
    
    
    
  }

}

struct SolanaTransaction {
    struct TransferInstruction {
        let from: Data
        let to: Data
        let value: UInt64

        func serialize() -> Data {
            // Construct the byte array for the transfer instruction here.
            // This involves Solana-specific byte encoding.
            // You will need to follow the Solana Transfer Instruction format.
            return Data() // Placeholder
        }
    }
    
    struct Message {
        let recentBlockhash: String
        let instructions: [TransferInstruction]

        func serialize() -> Data {
            // Serialize the message into the proper format for Solana.
            return Data() // Placeholder
        }
    }
    
    var message: Message
    var signatures: [Data] = []

    init(message: Message) {
        self.message = message
    }

    mutating func addSignature(signature: Data) {
        signatures.append(signature)
    }

    func serialize() -> Data {
        // Serialize the entire transaction, including signatures.
        return Data() // Placeholder
    }
}
