//
//  RCTC2VersionPackage.m
//  RCTC2VersionPackage
//
//  Created by 刘圣坚 on 2016/10/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTQyVersionPackage.h"
#import <React/RCTBridgeModule.h>
#import <UIKit/UIDevice.h>


@interface RCTQyVersionPackage()<RCTBridgeModule>

@end

@implementation RCTQyVersionPackage 

RCT_EXPORT_MODULE(QyVersion);

RCT_EXPORT_METHOD(getSystemInfo:(RCTResponseSenderBlock)callback)
{
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  CFShow((__bridge CFTypeRef)(infoDictionary));
  // app名称
    NSString *app_Name = [infoDictionary objectForKey:@"CFBundleName"];
  // app版本
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
  // app build版本
    NSString *app_build = [infoDictionary objectForKey:@"CFBundleVersion"];
  // app BundleIdentifier
    NSString *app_BundleIdentifier = [infoDictionary objectForKey:@"CFBundleIdentifier"];
  NSDictionary *response = @{
                             @"name":app_Name,
                             @"version":app_Version,
                             @"build":app_build,
                             @"BundleIdentifier":app_BundleIdentifier
                             };
    callback(@[@{@"code":@"104201"}, response]);
  
}

@end
