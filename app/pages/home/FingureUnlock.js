/**
 * Created by liwei on 9/12/16.
 */
'use strict';

import React, { Component } from 'react';
import { Text, View, StyleSheet, Platform, PixelRatio, DeviceEventEmitter, Alert } from 'react-native';
import px2dp from '../../utils/px2dp';
import theme from '../../config/theme';
import LineItem from '../../components/LineItem';
import Global from '../../utils/GlobalStorage';
import { Actions } from 'c2-mobile';
import { FingerprintLock } from "../../Libraries/";
import Toasts from 'react-native-root-toast';

export default class FingureUnlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
  
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('fingergestureswitcher', (text) => {
            console.log("finger", text)
            this.setState({
                isSwitcher: text,
            })
        })

        Global.getValueForKey('fingergestureswitcher').then((ret) => {
            if (ret == null || ret == 'false') {
                this.setState({
                    isSwitcher: false,
                })
            } else {
                console.log('error==xxxxxxx>', ret.switcherValue);
                this.setState({
                    isSwitcher: ret.switcherValue,
                })

            }
        })
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
            <LineItem text="开启指纹解锁" isHasIcon={false} isHasSwitcher={true} switcherValue={this.state.isSwitcher} onValueChange={(value) =>
                this._switcher(value)} />
        )
    }
    _switcher(value) {
        Global.getValueForKey('finger').then((ret) => {
            if (ret == undefined || ret == null || ret == "closefinger" || ret == '') {
                if (Platform.OS == 'android') {
                    FingerprintLock.isFingerLegal().then((response) => {
                        console.log("response=", response)
                        if (response == "当前设备不支持指纹") {
                            Toasts.show('当前设备不支持指纹', { position: px2dp(-40) });
                        } else if (response == "当前设备支持指纹") {
                            Alert.alert('提示', '您确实要设置解锁指纹吗？', [{
                                text: '确定', onPress: () => {
                                    this.setState({
                                        isSwitcher: true,
                                    });
                                    Global.saveWithKeyValue('finger', "openfinger")
                                    Global.saveWithKeyValue('fingergestureswitcher', {
                                        switcherValue: true
                                    });
                                    console.log('finger1', value);
                                }
                            }, , { text: '取消', onPress: () => { } }])
                        }

                    })
                } else if (Platform.OS == 'ios') {
                    Alert.alert('提示', '您确实要设置解锁指纹吗？', [{
                        text: '确定', onPress: () => {
                            this.setState({
                                isSwitcher: true,
                            });
                            Global.saveWithKeyValue('finger', "openfinger")
                            Global.saveWithKeyValue('fingergestureswitcher', {
                                switcherValue: true
                            });
                            console.log('finger1', value);
                        }
                    }, , { text: '取消', onPress: () => { } }])
                }

            } else {
                Global.saveWithKeyValue('finger', "closefinger")
                this.setState({
                    isSwitcher: false,
                });
                Global.saveWithKeyValue('fingergestureswitcher', {
                    switcherValue: false
                });
                console.log('finger2', value);
            }
        }).catch((err) => {
        })
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
    actionBar: {
        height: theme.actionBar.height,
        backgroundColor: theme.actionBar.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
    },
    intro: {
        height: px2dp(100),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: px2dp(20),
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#c4c4c4',
        borderTopColor: '#e4e4e4',
        marginTop: px2dp(10)
    },
    list: {
        marginTop: px2dp(15)
    },
    editGroup: {
        margin: px2dp(0)
    },
    listItem: {
        flex: 1,
        height: px2dp(47),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(25),
        paddingRight: px2dp(25),
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1 / PixelRatio.get()
    },
});