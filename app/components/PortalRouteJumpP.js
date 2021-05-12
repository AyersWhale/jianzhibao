'use strict'

import {
  Alert,
  Linking,
  Platform,

} from 'react-native';

import C2WebView from './C2WebView';
import { Config, Fetch, VectorIcon, Actions, Router } from 'c2-mobile'

export function portalRouteJump(navigator, itemData, components) {

  //url跳转
  if (itemData.eventtype === 'web') {

    Actions.C2WebView({ url: itemData.url, title: itemData.title })

    return
  }
  //路由跳转
  if (itemData.eventtype === 'native') {

    if (itemData.url == 'applicationManage') {

      Actions.ApplicationManage()

    } else if (itemData.url == 'QuickMark') {

      Actions.C2WebView({ url: itemData.url, title: itemData.title })

    } else if (itemData.url == "AssetSee") {
      Actions.C2WebView({ url: itemData.url, title: itemData.title })
    } else {
      if (itemData.url == '' || itemData.url == null) {
        Alert.alert(
          '启动失败',
          '应用暂未开放,请联系管理员',
          [
            { text: '确认', onPress: () => console.log('Cancel Pressed!') },
          ]
        )
        return
      }
    }
    return
  }

  //第三方应用跳转
  if (itemData.eventtype === 'externalNative') {
    var urlObject = JSON.parse(itemData.url);
    var url = Platform.OS == 'ios' ? urlObject.ios : urlObject.android;
    var obUrl = JSON.parse(itemData.url);
    var url = Platform.OS == 'ios' ? obUrl.ios : obUrl.android;
    Linking.openURL(url)
      .catch(error => {
        Alert.alert(
          '启动失败',
          '应用没有安装',
          [
            { text: '暂不安装', onPress: () => console.log('Cancel Pressed!') },
            { text: '现在安装', onPress: () => Linking.openURL(obUrl.block) },
          ]
        )
      });
  }
}
