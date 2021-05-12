import React, { Component } from 'react';
import {
     View, StyleSheet, Alert
} from 'react-native';

import PasswordGesture from 'react-native-gesture-password'
import theme from '../../config/theme';
import Global from '../../utils/GlobalStorage';
import {Actions, NavigationBar } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
let setCache = ''; //设置缓存
let password = ''; //密码
let isYanz = false

export default class GesturePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '请绘制解锁图案',
            status: 'normal'
        };
        setCache = '';
    }

    render() {
        return (
            <View style={styles.container}>
                <PasswordGesture
                    ref='pg'
                    status={this.state.status}
                    message={this.state.message}
                    interval={500}
                    onStart={() => this.onStart()}
                    onEnd={(input) => this.onEnd(input)}
                    children={this._renderChilder()}
                />
            </View>
        );
    }

    _renderChilder() {
        return (
            <View >
                <NavigationBar title="设置手势密码" faction='center' >
                    <NavigationBar.NavBarItem onPress={this._handleBack.bind(this)} title="" faction='left' leftIcon={'chevron-left'} iconSize={10} style={{ width: 80, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem faction='right' title="清空密码" iconSize={20} onPress={() => { Alert.alert('提示', '确定要清空手势密码吗?', [{ text: '确定', onPress: () => { this._clearGesturePassword() } }, { text: '取消', onPress: () => { } }]) }} style={{ width: 80, paddingRight: 10 }} />
                </NavigationBar>
            </View >
        );
    }

    _handleBack() {
        Actions.pop({ refresh: { test: true } })
        setCache = '';
        password = '';
        isYanz = false;
    }


    _clearGesturePassword() {
        setCache = '';
        password = '';
    }

    onEnd(input) {
        if (password === '') {
            // TODO 设置密码
            if (setCache === '') {
                //初始设置
                if (input.length < 4) {
                    this.setState({
                        status: 'normal',
                        message: '至少连接4个点,请重新绘制!'
                    });
                } else {
                    setCache = input;
                    this.setState({
                        status: 'normal',
                        message: '请再次绘制解锁图案!'
                    });
                }
            } else {
                let gestureDa = {
                    rawData: {
                        gesture: input,
                    }
                }
                //确认手势密码
                if (setCache === input) {
                    Global.saveWithKeyValue('gesture', {
                        gesture: input,
                    });
                    Global.saveWithKeyValue('gestureOpen', {
                        gestureOpen: true,
                    });
                    this.setState({
                        status: 'normal',
                        message: '手势密码设置成功!请验证解锁!'
                    });
                    password = input;
                    isYanz = true;
                    Toasts.show('设置成功', { position: -80 });
                    this._handleBack()
                } else {
                    this.setState({
                        status: 'normal',
                        message: '两次密码不一样,请重新输入!'
                    });
                }
            }
        } else { //
            if (password === input) {
                //解锁
                this.setState({
                    status: 'right',
                    message: '手势密码解锁成功!'
                });
                password = input;
                isYanz = true

                if (isYanz) {
                    isYanz = false
                    this._handleBack()
                }
            } else {
                this.setState({
                    status: 'wrong',
                    message: '密码错误,请重新输入!'
                });
            }
        }
    }

    onStart() {
        // console.log('onStart');
        // this.setState({
        //     status: 'normal',
        //     message: '请输入你的密码!'
        // });
    }

    onReset() {
        // console.log('onReset');
        // this.setState({
        //     status: 'normal',
        //     message: '请再次输入你的密码!'
        // });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },

});