/**
 * Created by liwei on 20/03/17.
 */
'use strict';

import { Dimensions, Platform } from 'react-native';
import px2dp from '../../app/utils/px2dp';

const globalTextColor = '#000';

module.exports = {
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
    themeColor: 'rgb(22,131,251)',
    pageBackgroundColor: '#f4f4f4',
    backgroundColorC: '#ffffff',
    grayColor: '#c4c4c4',
    btnActiveOpacity: 0.7,
    touchableHighlightUnderlayColor: 'rgba(0,0,0,.4)',
    touchableOpacityActiveOpacity: 0.8,
    actionBar: {
        height: (Platform.OS === 'android') ? px2dp(49) : px2dp(69),
        backgroundColor: 'rgb(22,131,251)',
        fontSize: px2dp(20),
        fontColor: 'white'
    },
    text: {
        color: globalTextColor,
        fontSize: px2dp(15)
    },
    scrollView: {
        fontSize: px2dp(15),
        underlineStyle: {
            backgroundColor: 'white'
        }
    }
};