#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "ScreenshotDelegate.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RCTBridgeModule>

@property (nonatomic, strong) UIWindow *window;
@property (nonatomic, strong) ScreenshotDelegate *screenshot;
@property (nonatomic, strong) UIImageView *overlayImageView;
@property (nonatomic, assign) BOOL isOverlayScheduled;

@end
