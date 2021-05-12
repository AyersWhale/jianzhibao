'use strict';
import React, {
    Component,
    Alert,

} from 'react-native';
import { Actions, } from 'c2-mobile'
class ToolUitl {
    static quickMarkData(extParam, eData, loginUserInfo) {
        let extP = extParam;
        let extParams = null;
        if (extParam != undefined || extParams != null) {
            extParams = JSON.parse(extParam)
        }

        let userInfo = '';
        let url = ''

        if (extParams != null) {
            if (extParams.useLoginInfo) {
                userInfo = '&loginUserInfo=' + JSON.stringify(loginUserInfo)
            }
            url = extParams.url;

        }

        if (eData != null) {
            // if ('http://' == eData.substring(0, 7) || 'https://' == eData.substring(0, 8)) {
            //     // url = eData + userInfo

            // } else {
            //     url = url + eData + userInfo
            // }
            Alert.alert("提示", "扫描结果为" + eData
                , [
                    {
                        text: "确定", onPress: () => {
                          
                        }
                    }
                ])
        }

        return encodeURI(encodeURI(url));
    }
}
module.exports = ToolUitl;