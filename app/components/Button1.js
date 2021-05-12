/**
 * Created by wangdi on 4/11/16.
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import { Text, View, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';

export default class Button1 extends Component {

    render() {
        if (Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback
                    onPress={this.props.onPress}>
                    {this._renderContent()}
                </TouchableNativeFeedback>
            );
        } else if (Platform.OS === 'ios') {
            return (
                <TouchableHighlight
                    onPress={this.props.onPress}
                    activeOpacity={theme.btnActiveOpacity} >
                    {this._renderContent()}
                </TouchableHighlight>
            );
        }
    }

    _renderContent() {
        return (
            <View style={{
                height: px2dp(40), width: px2dp(300), backgroundColor: 'rgb(65,143,234)', alignItems: 'center',alignSelf:'center', justifyContent: 'center',
                borderRadius: 20
            }}>
                <Text style={styles.text}>{this.props.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: px2dp(16),
        fontWeight:'bold'
    }
});