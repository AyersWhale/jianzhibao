import PcInterface from '../http/PcInterface';
import EncryptionUtils from '../EncryptionUtils';
import { Alert } from 'react-native';
import Global from '../GlobalStorage';
import { UserInfo, UUID, Config, Fetch, Actions } from 'c2-mobile';
import PushUtils from '../PushUtils';
/**
 * 工作方式 通过真实值 得到 显示值
 */
export function workTypeByCode(code) {
    switch (code) {
        case 'FQRZ': return '兼职';
        case 'LSYG': return '合伙人';
        case 'LWPQ': return '抢单';
        case 'CHYW': return '撮合';
        case 'QRZ': return '全日制'
        default: return '其他'
    }
}
/**
 * 工作方式 通过真实值 得到 显示值
 */
export function workTypeByValue(value) {
    switch (value) {
        case '兼职': return 'FQRZ';
        case '合伙人': return 'LSYG';
        case '抢单': return 'LWPQ';
        case '撮合': return 'CHYW';
        case '全日制': return 'QRZ'
        default: return ''
    }
}

/**
 * 登录公共处理（注意要更新缓存里面的token）
 * @param loginParams 登录参数
 * @param loginCallback 回调
 */
export function commonLogin(loginParams, loginCallback) {
    console.log('开始登录')
    //方法外做必填校验
    EncryptionUtils.fillEncodeData(loginParams);
    PcInterface.login(loginParams, (set) => {
        if (set.result.rcode == '0') {
            //登录失败
            Alert.alert("提示", set.result.rmsg, [{ text: "确定", onPress: () => { } }])
            return;
        } else if (set.result.rcode == '1') {
            //登录成功 todo
            let rawData = {
                userInfo: loginParams,
                loginSet: set
            }
            if (set.result.rdata.loginUserInfo.remark5 == '0') {
                Alert.alert("提示", '您的登录权限已被禁用！', [{ text: "确定", onPress: () => { } }])
                return;
            } else {
                var entity2 = {
                    username: set.result.rdata.loginUserInfo.userName
                }
                //从后台获取登录token
                Fetch.postJson(Config.mainUrl + '/v1/mobile/userlogin', entity2)
                    .then((res) => {
                        Global.saveWithKeyValue('tokenValue', { token: res.token });
                    })
                Global.getValueForKey('firstLogin').then(() => {
                    Global.saveWithKeyValue('firstLogin', { key: UUID.v4() });
                })
                //推送
                PushUtils.registerC2Push();
                //初始化用户信息 并存到缓存
                UserInfo.initUserInfoWithDict(rawData);
                Global.saveWithKeyValue('loginInformation', loginParams.params);
                loginCallback()
            }
        } else {
            Alert.alert("提示", '登录失败，请稍后重试'
                , [
                    {
                        text: "确定", onPress: () => {
                            console.log("确定");
                        }
                    }
                ])
        }
    })
}

/**
 * 退出登录公共方法
 */
export function commonLoginOut(loginParams) {
    Global.saveWithKeyValue('gesture', {
        gesture: '',
    });
    Global.saveWithKeyValue('gestureOpen', {
        gestureOpen: false,
    });
    Global.saveWithKeyValue('loginInformation', { userName: loginParams.userName, passWord: '' });
    Actions.Login({ type: 'reset' });

    Fetch.postJson(Config.mainUrl + '/ws/logout', loginParams)
        .then((res) => {
            console.log(res)
        })
}