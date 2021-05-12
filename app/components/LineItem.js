'use strict';

import React, { Component, } from 'react';
import PropTypes from 'prop-types'; // ES6
import { Text, View, StyleSheet, Platform, Switch, PixelRatio, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import { VectorIcon } from 'c2-mobile';


export default class LineItem extends Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        iconColor: PropTypes.string,
        text: PropTypes.string.isRequired,
        subText: PropTypes.string,
        isHasSwitcher: PropTypes.bool,
        isHasIcon: PropTypes.bool,
        switcherValue: PropTypes.bool,
        onPress: PropTypes.func,
        onValueChange: PropTypes.func,
    }

    static defaultProps = {
        iconColor: 'gray',
        isHasIcon: true
    }

    constructor(props) {
        super(props);

    }

    render() {
        const { icon, iconColor, text, subText, onPress, isHasSwitcher, isHasIcon, switcherValue, onValueChange } = this.props;

        if (Platform.OS === 'android') {
            return (
                <TouchableNativeFeedback onPress={onPress} >
                    <View style={styles.listItem}>
                        <Text style={{ fontSize: px2dp(13), marginLeft: px2dp(0) }}>{text}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={{ color: "#ccc" }}>{subText}</Text>
                        </View>{
                            isHasIcon ?
                                <VectorIcon name={icon} size={px2dp(22)} color={iconColor} />
                                :
                                null

                        }
                        {isHasSwitcher ?
                            <Switch
                                onValueChange={onValueChange}
                                style={{ marginLeft: px2dp(5) }}
                                value={switcherValue} />
                            :
                            null
                        }
                    </View>
                </TouchableNativeFeedback>
            );
        } else if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity onPress={onPress} activeOpacity={theme.btnActiveOpacity}>
                    <View style={styles.listItem}>
                        <Text style={{ fontSize: px2dp(13), marginLeft: px2dp(5) }}>{text}</Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Text style={{ color: "#ccc" }}>{subText}</Text>
                        </View>{
                            isHasIcon ?
                                <VectorIcon name={icon} size={px2dp(22)} color={iconColor} />
                                :
                                null
                        }
                        {isHasSwitcher ?
                            <Switch
                                onValueChange={onValueChange}
                                style={{ marginLeft: px2dp(5) }}
                                value={switcherValue} />
                            :
                            null
                        }
                    </View>
                </TouchableOpacity>
            );
        }
    }
}
const styles = StyleSheet.create({
    listItem: {
        backgroundColor: 'white',
        height: px2dp(50),
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1 / PixelRatio.get()
    },
    listText: {

    }
});