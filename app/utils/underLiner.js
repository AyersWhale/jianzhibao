'use strict'
import React, { Component } from 'react';
import {
      View,
      StyleSheet
} from 'react-native';
import theme from '../config/theme';
import px2dp from '../utils/px2dp';



module.exports = {
      liners: {
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
      }
};