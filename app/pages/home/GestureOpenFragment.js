/**
 * Created by liwei on 9/12/16.
 */
'use strict';

import React, { Component } from 'react';
import { Platform, BackHandler, Text, View, StyleSheet } from 'react-native';
import px2dp from '../../utils/px2dp';
import theme from '../../config/theme';
import LineItem from '../../components/LineItem';
import Global from '../../utils/GlobalStorage';
import { UserInfo, Actions } from 'c2-mobile';

export default class GestureOpenFragment extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.ifOpenGesture();
    }
    ifOpenGesture() {
        Global.getValueForKey('gestureOpen').then((ret) => {
            if (ret == null || ret.gestureOpen == false || ret.gestureOpen == undefined) {
                this.setState({
                    isSwitcher: false,
                })
            } else {

                this.setState({
                    isSwitcher: true,
                })

            }
        })
    }
    componentWillReceiveProps(nextProps) {
        this.ifOpenGesture();
        Actions.pop();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.editGroup}>
                    <View style={styles.list}>
                        {this.makeSure()}
                    </View>
                </View>
            </View>
        );
    }
    makeSure() {
        return (
            <LineItem text="开启手势解锁" isHasIcon={false} isHasSwitcher={true} switcherValue={this.state.isSwitcher} onValueChange={(value) =>
                this._switcher(value)} />
        )
    }
    _switcher(value) {
        if (value == true) {
            Actions.GesturePassword();
        } else {
            Global.saveWithKeyValue('gesture', {
                gesture: '',
            });
            Global.saveWithKeyValue('gestureOpen', {
                gestureOpen: false,
            });
            this.setState({
                isSwitcher: false,
            })
        }


    }

    _handleBack() {
        Actions.pop();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    list: {
        marginTop: px2dp(15)
    },
    editGroup: {
        margin: px2dp(0)
    },

});