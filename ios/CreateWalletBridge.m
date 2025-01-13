//
//  CreateWalletBridge.m
//  WalletNativeDemo
//
//  Created by user on 02/03/23.
//

#import "CreateWalletBridge.h"

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CreateWallet, NSObject)

RCT_EXTERN_METHOD(generateMnemonics:(RCTResponseSenderBlock *)callback)
RCT_EXTERN_METHOD(generateAddressFromMnemonics:(NSString *) menmonicsString callback:(RCTResponseSenderBlock *)callback)

RCT_EXTERN_METHOD(signSolanaTransaction:(NSString *)pvtKey toAddress:(NSString *)toAddress
                  amount:(NSString *)amount
                  recentBlockhash:(NSString *)recentBlockhash callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(signSolanaTokenTransaction:(NSString *)pvtKey fromAddress:(NSString *)fromAddress toAddress:(NSString *)toAddress tokenMintAddress:(NSString *)tokenMintAddress amount:(NSString *)amount recentBlockhash:(NSString *)recentBlockhash decimal:(NSString *)decimal callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(signSolanaWalletConnectRequest:(NSString *)pvtKey requestPayload:(NSString *)requestPayload callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(createTokenAccountSigner:(NSString *)pvtKey mainAddress: (NSString *)mainAddress tokenMintAddress: (NSString *)tokenMintAddress tokenAddress: (NSString *)tokenAddress recentBlockhash: (NSString *)recentBlockhash callback:(RCTResponseSenderBlock)callback)


@end

@implementation CreateWalletBridge

@end
