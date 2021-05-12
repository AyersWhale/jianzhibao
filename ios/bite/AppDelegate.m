/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import <React/RCTLinkingManager.h>
#import <C2PushClient.h>
#import <Contacts/Contacts.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //请求获取通讯录授权
//  [self requestAuthorizationForAddressBook];//4.授权状态
  [C2PushClient openAppNotify:launchOptions];
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"jianzhibao"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

// Only if your app is using [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}
//C2Push配置
- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  // 注册APNS成功, 注册deviceToken
  [C2PushClient bindDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err
{
  NSLog(@"通知注册失败");
}

- ( void )application:( UIApplication *)application didReceiveRemoteNotification:( NSDictionary *)userInfo
{
  [C2PushClient handleReceiveRemoteNotification:userInfo];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  [C2PushClient handleReceiveRemoteNotificationForiOS10:notification];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler {
  [C2PushClient handleOpenRemoteNotificationForiOS10:response];
  completionHandler();
}
- (void)requestAuthorizationForAddressBook {
  
  CNAuthorizationStatus authorizationStatus = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  
  if(authorizationStatus ==CNAuthorizationStatusNotDetermined) {
    
    CNContactStore*contactStore = [[CNContactStore alloc]init];
    
    [contactStore requestAccessForEntityType:CNEntityTypeContacts completionHandler:^(BOOL granted,NSError*_Nullable error) {
      
      if(granted) {
        
        NSLog(@"通讯录获取授权成功==");
        
        [self getContact]; //5.获取用户通讯录
        
      }else{
        
        NSLog(@"授权失败, error=%@", error);
        
      }
      
    }];
    
  }
  
}
- (void)getContact{
  
  CNAuthorizationStatus authorizationStatus = [CNContactStore authorizationStatusForEntityType:CNEntityTypeContacts];
  
  if(authorizationStatus ==CNAuthorizationStatusAuthorized) {
    
    // 获取指定的字段,并不是要获取所有字段，需要指定具体的字段
    
    NSArray*keysToFetch =@[CNContactGivenNameKey,CNContactFamilyNameKey,CNContactPhoneNumbersKey];
    
    CNContactFetchRequest*fetchRequest = [[CNContactFetchRequest alloc]initWithKeysToFetch:keysToFetch];
    
    CNContactStore*contactStore = [[CNContactStore alloc]init];
    
    //创建一个保存通讯录的数组
    
    NSMutableArray *contactArr = [NSMutableArray array];
    
    [contactStore enumerateContactsWithFetchRequest:fetchRequest error:nil usingBlock:^(CNContact*_Nonnull contact,BOOL*_Nonnull stop) {
      
      NSLog(@"-------------------------------------------------------");
      
      NSString*givenName = contact.givenName;
      
      NSString*familyName = contact.familyName;
      
      NSLog(@"givenName=%@, familyName=%@", givenName, familyName);
      
      NSArray*phoneNumbers = contact.phoneNumbers;
      
      for(CNLabeledValue*labelValue in phoneNumbers) {
        
//        NSString*label = labelValue.label;
//        
//        CNPhoneNumber*phoneNumber = labelValue.value;
//        
//        NSDictionary*contact =@{@"phone":phoneNumber.stringValue,@"user":FORMAT(@"%@%@",familyName,givenName)};
//        
//        [contactArr addObject:contact];
//        
//        NSLog(@"label=%@, phone=%@", label, phoneNumber.stringValue);
        
      }
      
      //*stop = YES;// 停止循环，相当于break；
      
    }];
    
//    _contactArr= contactArr;
//
//    NSError*error;
//
//    NSData*jsonData = [NSJSONSerialization dataWithJSONObject:contactArr options:NSJSONWritingPrettyPrinted error:&error];//此处data参数是我上面提到的key为"data"的数组
//
//    NSString*jsonString = [[NSString alloc]initWithData:jsonData encoding:NSUTF8StringEncoding];
//
//    _jsonString= jsonString;
//
//    NSLog(@"jsonString====%@",jsonString);
//
//    [self postContactTo]; //6.上传通讯录
    
  }else{
    
    NSLog(@"====通讯录没有授权====");
    
  }
  
}
@end
