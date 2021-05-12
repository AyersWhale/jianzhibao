'use strict'

import { Config, Fetch, Toast, UserInfo, Actions } from 'c2-mobile'
import Toasts from 'react-native-root-toast';
import Global from '../utils/GlobalStorage';
import NetWorkTool from '../utils/NetWorkTool';

export function ErrorJump(errorData) {

    //路由跳转
    Fetch.postJson(Config.mainUrl + '/mobileapp/isLogin', { params: { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userName } })
        .then((response) => {
            Toast.dismiss();
            if (!response.result.rdata.state) {
                Global.removeValueForKey('loginInformation').then((ret) => { });
                Toasts.show('登录信息已失效,请重新登录', { position: -80 });
                Actions.Login({ type: 'reset' });
            } else {
                if (errorData.status == 500) {
                    Toasts.show("服务错误");
                } else if (errorData.status == 401) {
                    Toasts.show("权限失效");
                } else if (errorData.status == 404) {
                    Toasts.show("地址无法访问");
                } else if (errorData.status == 400) {
                    Toasts.show("请求出错");
                } else if (errorData.status == 408) {
                    Toasts.show("服务响应超时")
                } else {
                    Toasts.show("连接错误信息");
                }
            }
        }).catch((error) => {
            NetWorkTool.checkNetworkState((isConnected) => {
                Toast.dismiss();
                if (!isConnected) {
                    Toasts.show(NetWorkTool.NOT_NETWORK);
                } else {
                    if (error.status == 500) {
                        Toasts.show("服务错误");
                    } else if (error.status == 401) {
                        Toasts.show("权限失效");
                    } else if (error.status == 404) {
                        Toasts.show("地址无法访问");
                    } else if (error.status == 400) {
                        Toasts.show("请求出错");
                    } else if (errorData.status == 408) {
                        Toasts.show("服务响应超时")
                    } else {
                        Toasts.show("连接错误信息");
                    }
                }
            });
        });
    return
}