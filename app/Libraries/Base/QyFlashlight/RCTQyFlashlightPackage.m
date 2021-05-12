//
//  RCTC2VersionPackage.m
//  RCTC2VersionPackage
//
//  Created by 刘圣坚 on 2016/10/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTQyFlashlightPackage.h"
#import <React/RCTBridgeModule.h>
#import <UIKit/UIDevice.h>
#import "RCTConvert.h"
#import <AVFoundation/AVFoundation.h>


@interface RCTQyFlashlightPackage()<RCTBridgeModule>


@end

@implementation RCTQyFlashlightPackage

RCT_EXPORT_MODULE(QyFlashlight);

RCT_EXPORT_METHOD(getFlashlight:(NSString *)param callback:(RCTResponseSenderBlock)callback){
  Class captureDeviceClass = NSClassFromString(@"AVCaptureDevice");
  if (captureDeviceClass !=nil) {
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if ([device hasFlash]){
      [device lockForConfiguration:nil];
      if ([param isEqual:@"0"]) {
        [device setTorchMode:AVCaptureTorchModeOn];
        [device setFlashMode:AVCaptureFlashModeOn];
        [self setFlashlight:@"0" callback:callback];
      } else {
        [device setTorchMode:AVCaptureTorchModeOff];
        [device setFlashMode:AVCaptureFlashModeOff];
        [self setFlashlight:@"1" callback:callback];
      }
      [device unlockForConfiguration];
    }else{
      NSLog(@"初始化失败");
      [self setFlashlight:@"2" callback:callback];
    }
  }else{
    NSLog(@"没有闪光设备");
     [self setFlashlight:@"3" callback:callback];
  }

}

- (void)setFlashlight:(NSString *)state callback:(RCTResponseSenderBlock)callback
{
  NSDictionary *response = @{
                             @"state":state,
                             };
  callback(@[@{@"code":@"104201"}, response]);}

@end
