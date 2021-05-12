//
//  RCTC2VersionPackage.m
//  RCTC2VersionPackage
//
//  Created by 刘圣坚 on 2016/10/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTQyFingerprintLockPackage.h"
#import <React/RCTBridgeModule.h>
#import <UIKit/UIDevice.h>
#import "RCTConvert.h"
#import "LocalAuthentication/LAContext.h"



@interface RCTQyFingerprintLockPackage()<RCTBridgeModule>
//使用和修改
@property (strong,nonatomic) NSString *state;

@end

@implementation RCTQyFingerprintLockPackage 

RCT_EXPORT_MODULE(QyFingerprintLock);

RCT_EXPORT_METHOD(getFingerprintLock:(RCTResponseSenderBlock)callback)
{
  
  NSLog(@"登录触发方法");
  // 步骤一 检查Touch ID是否可用
  LAContext *myContext = [[LAContext alloc] init];
  NSError *authError = nil;
  NSString *myLocalizedReasonString = @"通过Home键验证已有手机指纹";
  _state = [[NSString alloc] init];
  
  if ([myContext canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&authError]) {
    NSLog(@"Touch ID可以使用");
    
    [myContext evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics localizedReason:myLocalizedReasonString reply:^(BOOL success, NSError * _Nullable error) {
      if (success) {
        // 成功
        NSLog(@"成功");
       [self showMessage:[NSString stringWithFormat:@"解锁成功"] duration:3];
         callback(@[ @"解锁成功"]);
      } else {
        
        // 获取到相应的错误信息····做相应的操作
        // 失败
        NSLog(@"%@", error); // 错误信息
        
        NSString *domin = [error domain]; //获取错误域  一般
        NSLog(@"%@", domin);
        NSDictionary *userInfo = [error userInfo]; //错误详细信息
        NSLog(@"%@", userInfo);
        
        NSInteger code = [error code]; // 获取Code值  一般domin 和 code 一起就是一个错误信息
        if (code == -3) {
          // 点击了手指密码的 输入密码按钮
          NSLog(@"点击了手指密码的 输入密码按钮");
        //  [self showMessage:[NSString stringWithFormat:@"解锁成功"] duration:3];
          
        }
        
        if (code == -2) {
          NSLog(@"点击了手指密码的取消按钮");
          //  [self showMessage:[NSString stringWithFormat:@"取消按钮"] duration:3];
         callback(@[ @"取消按钮"]);
       //   [self showMessage:[NSString stringWithFormat:@"解锁成功"] duration:3];
        
        }
        
        if (code == -1) {
          NSLog(@"指纹密码不可用, 重新输入指纹密码");
          [self showMessage:[NSString stringWithFormat:@"指纹密码不可用, 重新输入指纹密码"] duration:3];

         
        }
      }
    }];
    
  }else {
    //
    NSLog(@"Touch ID 不可用");
    [self showMessage:[NSString stringWithFormat:@"Touch ID 不可用"] duration:3];

    
  }
  
  }

- (void)setFingerprintLock:(NSString *)state callback:(RCTResponseSenderBlock)callback
{
  NSDictionary *response = @{
                             @"state":state,
                             };
 callback(@[@{@"code":@"104201"}, response]);}

-(void)showMessage:(NSString *)message duration:(NSTimeInterval)time
{
  CGSize screenSize = [[UIScreen mainScreen] bounds].size;
  
  UIWindow * window = [UIApplication sharedApplication].keyWindow;
  UIView *showview =  [[UIView alloc]init];
  showview.backgroundColor = [UIColor grayColor];
  showview.frame = CGRectMake(1, 1, 1, 1);
  showview.alpha = 1.0f;
  showview.layer.cornerRadius = 5.0f;
  showview.layer.masksToBounds = YES;
  [window addSubview:showview];
  
  UILabel *label = [[UILabel alloc]init];
  NSMutableParagraphStyle *paragraphStyle = [[NSMutableParagraphStyle alloc]init];
  paragraphStyle.lineBreakMode = NSLineBreakByWordWrapping;
  
  NSDictionary *attributes = @{NSFontAttributeName:[UIFont systemFontOfSize:15.f],
                               NSParagraphStyleAttributeName:paragraphStyle.copy};
  
  CGSize labelSize = [message boundingRectWithSize:CGSizeMake(207, 999)
                                           options:NSStringDrawingUsesLineFragmentOrigin
                                        attributes:attributes context:nil].size;
  
  label.frame = CGRectMake(10, 5, labelSize.width +20, labelSize.height);
  label.text = message;
  label.textColor = [UIColor whiteColor];
  label.textAlignment = 1;
  label.backgroundColor = [UIColor clearColor];
  label.font = [UIFont boldSystemFontOfSize:15];
  [showview addSubview:label];
  
  showview.frame = CGRectMake((screenSize.width - labelSize.width - 20)/2,
                              screenSize.height - 300,
                              labelSize.width+40,
                              labelSize.height+10);
  [UIView animateWithDuration:time animations:^{
    showview.alpha = 0;
  } completion:^(BOOL finished) {
    [showview removeFromSuperview];
  }];
}
@end
