/**
 * Created by wangdi on 4/11/16.
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import px2dp from '../utils/px2dp';

export default class TextButton extends Component{
    static defaultProps = {
        color: 'white',
        fontSize: px2dp(12)
    };

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}>
                <View style={{height: px2dp(16)}}>
                    <Text style={{fontSize:this.props.fontSize, color: this.props.color}}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({

});