'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import { Actions, UserInfo,Config} from 'c2-mobile';
import PasswordGesture from 'react-native-gesture-password'
import Global from '../utils/GlobalStorage';
export default class GestureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '请输入手势密码',
            status: 'normal'
        }

    }

    render() {
        return (
            <View style={[styles.conMid]}>
                <View style={styles.modalStyle}>
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
            </View>
        )
    }

    onEnd(input) {
        if (Config.gesturePassword === input) {
            const { route, navigator } = this.props;
            //解锁
            this.setState({
                status: 'right',
                message: '手势密码解锁成功!'
            });
            this.props.gesture()
           // this._onLogin();
        } else {
            this.setState({
                status: 'wrong',
                message: '手势密码错误,请重新输入!'
            });
        }
    }

    onStart() {
        // console.log('onStart');
        this.setState({
            status: 'normal',
            message: '请输入你的密码!'
        });
    }

    onReset() {
        this.setState({
            status: 'normal',
            message: '请再次输入你的密码!'
        });
    }

    _renderChilder() {
        return (
            <TouchableOpacity style={{ position: 'absolute', bottom: 24, right: 16 }}
                onPress={() => 
                {   Global.removeValueForKey('loginInformation').then((ret) => { });
                Actions.Login({ type: 'reset' });
            }
                }>
                <Text style={{ color: '#fff' }}>切换登录</Text>
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    conMid: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalStyle: {
        flex: 1,
        backgroundColor: '#f4f4f4'
    },
})