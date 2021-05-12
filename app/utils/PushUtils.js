/**
 * 消息推送公共类
 */
'use strict';

import { Platform } from 'react-native';
import C2Push from 'c2-mobile-push';
import PcInterface from '../utils/http/PcInterface';
import Global from '../utils/GlobalStorage';
import { UserInfo, } from 'c2-mobile';
export default class PushUtils {
    //时间戳转换时间
    static registerC2Push() {
        C2Push.resetBadge();//ios去掉APP角标
        C2Push.initPush().then((result) => {
            let allUserParamss = {
                params: {
                    token: result.token
                }
            }
            PcInterface.unregister(allUserParamss, function (set2) {
                if (set2.result.rcode == "1") {
                    console.log("PushMessage" + '删除推送对象成功！');
                    let allUserParams = {
                        params: {
                            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                            channelName: result.channels,
                            channelCode: result.channels + Platform.OS,
                            token: result.token
                        }
                    }
                    PcInterface.register(allUserParams, function (set3) {
                        if (set3.result.rcode == "1") {
                            Global.saveWithKeyValue('token', result.token);
                            console.log("PushMessage" + '新增推送对象成功！')
                        } else {
                            console.log("PushMessage" + '新增推送对象失败！')
                        }
                    })
                } else {
                    console.log("PushMessage" + '删除推送对象失败！')
                    let allUserParams1 = {
                        params: {
                            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                            channelName: result.channels,
                            channelCode: result.channels + Platform.OS,
                            token: result.token
                        }
                    }
                    PcInterface.register(allUserParams1, function (set4) {
                        if (set4.result.rcode == "1") {
                            Global.saveWithKeyValue('token', result.token);
                            console.log("PushMessage" + '新增推送对象成功！')
                        } else {
                            console.log("PushMessage" + '新增推送对象失败！')
                        }
                    })
                }
            })
            // }
            console.log('渠道' + result.channels + "***Token==" + result.token);

        }).catch((e) => {
            alert(e);
        });
        C2Push.addReceiveCustomMsgListener((msg) => {
            console.log('输出透传消息：' + msg);
        })
    }
    /** JS对象转URL参数
* param 将要转为URL参数字符串的对象 
* key URL参数字符串的前缀 
* encode true/false 是否进行URL编码,默认为true 
*  
* return URL参数字符串 
*/
    static urlEncode = function (param, key, encode) {
        if (param == null) return '';
        var paramStr = '';
        var t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            // paramStr = ((encode == null || encode) ? encodeURIComponent(param) : param);
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (var i in param) {
                var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += PushUtils.urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };
}