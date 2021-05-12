import React,{
    NetInfo
} from 'react-native';
import Toasts from 'react-native-root-toast';

const NOT_NETWORK = "网络连接失败";
const TAG_NETWORK_CHANGE = "NetworkChange";
import { Weather } from 'qysyb-mobile';

/***
 * 检查网络链接状态
 * @param callback
 */
const checkNetworkState = (callback) =>{
    Weather.netWorkFetch("http://www.baidu.com").then((response) => {
        callback(true);
    }).catch((error) => {
        callback(false);
    });
    // NetInfo.isConnected.fetch().done(
    //     (isConnected) => {
    //         callback(isConnected);
    //     }
    // );
}

/***
 * 移除网络状态变化监听
 * @param tag
 * @param handler
 */
const removeEventListener = (tag,handler) => {
    NetInfo.isConnected.removeEventListener(tag, handler);
}

/***
 * 添加网络状态变化监听
 * @param tag
 * @param handler
 */
const addEventListener = (tag,handler)=>{
    NetInfo.isConnected.addEventListener(tag, handler);
}

export default{
    checkNetworkState,
    addEventListener,
    removeEventListener,
    NOT_NETWORK,
    TAG_NETWORK_CHANGE
}