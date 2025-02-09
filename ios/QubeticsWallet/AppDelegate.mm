#import "AppDelegate.h"
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase/Firebase.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTAppSetupUtils.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

static void ClearKeychainIfNecessary() {
    // Checks wether or not this is the first time the app is run
//  NSString *keyService = @"deviceUID";
    if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
        // Set the appropriate value so we don't clear next time the app is launched
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];

//      /*-------------------------Fetching Old Device Id stored in Keychain---------------------*/
//      NSMutableDictionary *keychainItem = [[NSMutableDictionary alloc] init];
//      keychainItem[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword;
//      keychainItem[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleAfterFirstUnlock;
//      keychainItem[(__bridge id)kSecAttrAccount] = keyService;
//      keychainItem[(__bridge id)kSecAttrService] = keyService;
//      keychainItem[(__bridge id)kSecReturnData] = (__bridge id)kCFBooleanTrue;
//      keychainItem[(__bridge id)kSecReturnAttributes] = (__bridge id)kCFBooleanTrue;
//      CFDictionaryRef result = nil;
//      OSStatus status = SecItemCopyMatching((__bridge CFDictionaryRef)keychainItem, (CFTypeRef *)&result);
//      if (status != noErr) {
//        NSLog(@"------------------nil");
//      }
//      NSDictionary *resultDict = (__bridge_transfer NSDictionary *)result;
//      NSData *data = resultDict[(__bridge id)kSecValueData];
//
//      NSString *deviceId = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
//      /*-------------------------Fetching Device Id stored in Keychain Done-----------------------*/
//
//
//      /*-------------------------Delete Keychain Data---------------------*/
//           NSArray *secItemClasses = @[
//               (__bridge id)kSecClassGenericPassword,
//               (__bridge id)kSecClassInternetPassword,
//               (__bridge id)kSecClassCertificate,
//               (__bridge id)kSecClassKey,
//               (__bridge id)kSecClassIdentity
//           ];
//             for (id secItemClass in secItemClasses) {
//                 NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
//                 SecItemDelete((__bridge CFDictionaryRef)spec);
//             }
//           /*-------------------------Delete Keychain Data Done---------------------*/
//
//      /*-------------------------Save the same deviceId in Keychain Data again---------------------*/
//         keychainItem[(__bridge id)kSecValueData] = [deviceId dataUsingEncoding:NSUTF8StringEncoding];
//         OSStatus status1 = SecItemAdd((__bridge CFDictionaryRef)keychainItem, NULL);
//
//         if (status1 == errSecDuplicateItem) {
//           /*-------------------------Delete and update the same deviceId in Keychain Data again if duplicated---------------------*/
//           NSDictionary *query = [NSDictionary dictionaryWithObjectsAndKeys:
//                                  (__bridge id)kSecClassGenericPassword, kSecClass,
//                                  keyService, kSecAttrAccount,
//                                  keyService, kSecAttrService,
//                                  nil];
//
//           OSStatus status2= SecItemDelete((__bridge CFDictionaryRef)query);
//         }
//
 
  
        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];

        // Maps through all Keychain classes and deletes all items that match
        for (id secItemClass in secItemClasses) {

            NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
          NSLog(@"spec",spec);
            SecItemDelete((__bridge CFDictionaryRef)spec);
        }
    }
}
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  ClearKeychainIfNecessary();
  RCTAppSetupPrepareApp(application);
  [FIRApp configure];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

#if RCT_NEW_ARCH_ENABLED
  _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
  _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
  _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
  bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
#endif
  
  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"QubeticsWallet", nil);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  self.screenshot = [ScreenshotDelegate allocWithZone:nil];
  [NSNotificationCenter.defaultCenter
      addObserverForName:(NSNotificationName)UIApplicationUserDidTakeScreenshotNotification
                  object:nil
                   queue:nil
              usingBlock:^(NSNotification *) {
    NSLog(@"Screenshot was taken");
       
    [self.screenshot sendScreenshotEvent];
    
  }];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(handleAppWillResignActive)
                                                name:UIApplicationWillResignActiveNotification
                                              object:nil];

   [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(handleAppDidBecomeActive)
                                                name:UIApplicationDidBecomeActiveNotification
                                              object:nil];

   [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(handleAppDidEnterBackground)
                                                name:UIApplicationDidEnterBackgroundNotification
                                              object:nil];

   [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(handleAppWillEnterForeground)
                                                name:UIApplicationWillEnterForegroundNotification
                                              object:nil];

  return YES;
}


- (void)handleAppWillResignActive {
  NSLog(@"handleAppWillResignActive");
  
  // Log current application state
  UIApplicationState state = [UIApplication sharedApplication].applicationState;
  NSLog(@"Current applicationState: %@", [self stringForApplicationState:state]);

  // Schedule showing the overlay, but only if app doesn't become active soon
  self.isOverlayScheduled = YES;

  // Delay showing the overlay, but cancel if app becomes active again before the delay
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    // Only show the overlay if the app is inactive and not becoming active again
    if (self.isOverlayScheduled && [UIApplication sharedApplication].applicationState != UIApplicationStateActive) {
      NSLog(@"Showing overlay after delay");
      [self showOverlay];
      [self sendEventToJS:@"onAppBackground"];
    } else {
      NSLog(@"Overlay display canceled because app became active again");
    }
  });
}

- (void)handleAppDidBecomeActive {
  NSLog(@"handleAppDidBecomeActive");

  // Cancel showing the overlay because the app is back to active state
  self.isOverlayScheduled = NO;

  // Remove the overlay if it's showing (e.g., from Mission Control or background)
  [self hideOverlay];
  [self sendEventToJS:@"onAppForeground"];
}

- (void)handleAppDidEnterBackground {
  NSLog(@"handleAppDidEnterBackground");

  // This handles true backgrounding, such as when the app is minimized
  self.isOverlayScheduled = NO; // Prevent any delayed overlay from showing

  [self showOverlay];
  [self sendEventToJS:@"onAppBackground"];
}

- (void)handleAppWillEnterForeground {
  NSLog(@"handleAppWillEnterForeground");

  // App is coming back to the foreground
  self.isOverlayScheduled = NO; // Prevent any delayed overlay from showing

  [self hideOverlay];
  [self sendEventToJS:@"onAppForeground"];
}

- (void)showOverlay {
  NSLog(@"showOverlay");
  
  if (!self.overlayImageView) {
    UIImage *overlayImage = [UIImage imageNamed:@"OverlayImage"];
    self.overlayImageView = [[UIImageView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    self.overlayImageView.image = overlayImage;
    self.overlayImageView.contentMode = UIViewContentModeScaleAspectFill;
  }
  [self.window addSubview:self.overlayImageView];
}

- (void)hideOverlay {
  NSLog(@"hideOverlay");
  
  [self.overlayImageView removeFromSuperview];
}

// Send event to React Native
- (void)sendEventToJS:(NSString *)eventName {
  NSLog(@"sendEventToJS: %@", eventName);
  
  RCTBridge *bridge = [(RCTRootView *)self.window.rootViewController.view bridge];
  if (bridge) {
    [bridge.eventDispatcher sendAppEventWithName:eventName body:@{}];
  }
}

// Helper method to convert application state to string
- (NSString *)stringForApplicationState:(UIApplicationState)state {
  switch (state) {
    case UIApplicationStateActive:
      return @"Active";
    case UIApplicationStateInactive:
      return @"Inactive";
    case UIApplicationStateBackground:
      return @"Background";
    default:
      return @"Unknown";
  }
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end
