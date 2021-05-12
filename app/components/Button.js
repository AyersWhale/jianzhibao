/**
 * Created by wangdi on 4/11/16.
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import { Text, View, StyleSheet, Platform, TouchableHighlight, TouchableNativeFeedback } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';

export default class Button extends Component {

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
        if (this.props.theme == 1) {
            return (
                <View style={{
                    height: px2dp(35), width: px2dp(300), backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : '#66CD00', alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    borderRadius: 20
                }}>
                    <Text style={styles.text1}>{this.props.text}</Text>
                </View>
            );
        }
        else if (this.props.theme == 2) {
            return (
                <View style={{
                    height: px2dp(35), width: px2dp(300), backgroundColor: '#54BED6', alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    borderRadius: 20
                }}>
                    <Text style={styles.text1}>{this.props.text}</Text>
                </View>
            );
        }
        else {
            return (
                <View style={{
                    height: px2dp(35), width: px2dp(300), backgroundColor: 'transparent', borderColor: '#66CD00', borderWidth: 1, alignItems: 'center', alignSelf: 'center', justifyContent: 'center',
                    borderRadius: 20
                }}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    text: {
        color: '#66CD00',
        fontSize: px2dp(16)
    },
    text1: {
        color: 'white',
        fontSize: px2dp(16)
    }
});