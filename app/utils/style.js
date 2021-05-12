'use strict'
import React, { Component } from 'react';
import ReactNative, { PixelRatio, Platform } from 'react-native';

import theme from '../config/theme';
import px2dp from '../utils/px2dp';

module.exports = {
      marginleft: {
            marginLeft: px2dp(15),
      },
      fontcolor: {
           color: 'black',
      },

      //界面主体内容
      container: {
            flex: 1,
            backgroundColor: theme.pageBackgroundColor
      },

      //顶部导航栏
      actionBar: {
            height: theme.actionBar.height,
            backgroundColor: theme.actionBar.backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
      },
      actionText: {
            color: theme.actionBar.fontColor,
            fontSize: theme.actionBar.fontSize
      },

      //公用带有返回图标的顶部导航
      barView: {
            height: (Platform.OS === 'android') ? px2dp(49) : px2dp(69),
            backgroundColor: theme.actionBar.backgroundColor,
      },
      showView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: Platform.OS === 'android' ? 0 : 20,
      },
      title: {
            color: 'white',
            fontSize: 18.0,
      },
      leftNav: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 8,
            justifyContent: 'center',
            paddingTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
      },
      leftImage: {
            width: px2dp(80),
            height: (Platform.OS === 'android') ? px2dp(49) : px2dp(69),
            alignSelf: 'center',
            textAlign: 'left',
            paddingTop: (Platform.OS === 'android') ? px2dp(13) : px2dp(23),
            paddingLeft: px2dp(10),
            backgroundColor: 'hsla(50, 33%, 25%,0)',
      },
      rightNav: {
            position: 'absolute',
            right: 8,
            top: 8,
            bottom: 8,
            justifyContent: 'center',
      },
      barButton: {
            color: 'white'
      },

      //底部导航
      tabbar: {
            height: px2dp(50),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fbfbfb'
      },
      tabStyle: {
            padding: px2dp(10)
      },
      sizeIcon: {
            flex: 1,
            alignSelf: 'center',
            textAlign: 'center',
            width: px2dp(50),
            height: px2dp(50)
      },

      //消息列表列
      item: {
            flexDirection: 'row',
            width: theme.screenWidth,
            backgroundColor: '#fff',
            paddingLeft: px2dp(15),
            paddingRight: px2dp(15),
            paddingVertical: px2dp(15),
      },
      itemContent: {
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
      },
      image: {     //图片
            height: px2dp(35),
            width: px2dp(35),
            resizeMode: 'cover'
      },
      msgContent: {
            color: '#000',
            fontSize: px2dp(16),
      },
      minorContent: {   //次要标题行
            flexDirection: 'row',
            marginTop: px2dp(5)
      },
      tag: {     //标签
            color: 'rgb(22,131,251)',
            fontSize: px2dp(12),
            padding: px2dp(1),
            borderWidth: 1 / PixelRatio.get(),
            borderColor: 'rgb(22,131,251)',
      },
      timeContent: {    //时间
            fontSize: px2dp(12),
            color: '#999',
            padding: px2dp(1),
            marginLeft: px2dp(5)
      },

      //列表行底部分隔线
      liners: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            height: 1,
            //width: theme.screenWidth,
            backgroundColor: '#e5e5e5',
            marginHorizontal: px2dp(2)
      },
      listLine: {
            height: 1,
            backgroundColor: '#e5e5e5',
            margin: px2dp(2)
      },

      //标题内容一行展示
      //页面小标题
      card: {
            alignSelf: 'center',
            width: theme.screenWidth,
            height: 250,
            elevation: 1,
      },
      card1: {
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
            marginLeft: 5,
            flexDirection: 'row',
            marginTop: px2dp(0)
      },
      detailtitle: {
            fontSize: px2dp(16),
            color: 'rgb(22,131,251)',
            marginVertical: px2dp(5),
            marginLeft: px2dp(15)
      },
      //内容展现
      card4: {    //内容小模块
            alignSelf: 'center',
            width: theme.screenWidth,
            backgroundColor: 'white',
            paddingVertical: px2dp(12),
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: px2dp(15),
            paddingRight: px2dp(15),
      },
      card2: {    //标题
            fontSize: px2dp(16),
            color: '#999',
      },
      card6: {    //内容
            color: 'black',
            marginLeft: px2dp(10)
      },
      card5: {   //内容分两行
            flex: 2,
            flexDirection: 'column',
            alignItems: 'flex-start',
            alignSelf: 'center',
            width: theme.screenWidth,
            backgroundColor: 'white',
            paddingVertical: px2dp(12),
            paddingLeft: px2dp(15),
            paddingRight: px2dp(15),
      },
      card7: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            paddingTop: px2dp(5)
      },

};