//
//  ScreenshotDelegate.h
//  Lead
//
//  Created by user on 28/11/22.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
NS_ASSUME_NONNULL_BEGIN

@interface ScreenshotDelegate : RCTEventEmitter <RCTBridgeModule>
+ (id)allocWithZone:(NSZone *)zone;
- (void)sendScreenshotEvent;

@end

NS_ASSUME_NONNULL_END
