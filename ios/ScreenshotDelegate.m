//
//  ScreenshotDelegate.m
//  Lead
//
//  Created by user on 28/11/22.
//

#import "ScreenshotDelegate.h"

@implementation ScreenshotDelegate
{
  bool hasListeners;
}
RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
    static ScreenshotDelegate *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone:zone];
    });
    return sharedInstance;
}
- (NSArray<NSString *> *)supportedEvents {
  return @[@"screenshotEvent"];
}
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}
- (void)sendScreenshotEvent
{
  NSLog(@"fdsfsdsfdsfdsfdsfdsf");
  NSLog(@"fdsfsdsfdsfdsfdsfdsf %d", hasListeners);
  if (hasListeners) { // Only send events if anyone is listening
//            [self showAlertMsg:self.window.rootViewController title:@"Warning" message:@"It isn't safe to take screenshot on crypto apps"];

    [self sendEventWithName:@"screenshotEvent" body:@"Tap enter code here` on Cancel button from Objc"];
  }
}
@end
