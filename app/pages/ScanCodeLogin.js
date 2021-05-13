/**
 * 扫码确认登录界面
 * 郭亚新  2020/4/9
 */
import React, { Component } from 'react';
import {
    Text, View, StyleSheet, ScrollView, Dimensions, Image, Alert, TouchableOpacity, ImageBackground, Platform
} from 'react-native';

import { Fetch, Config, Actions, Cookies, SSOAuth, VectorIcon, UserInfo, SafeArea, UUID, Toast } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class ScanCodeLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    loginPC() {
        // debugger
        let entity = {
            uuid: this.props.scanCode
        }
        Fetch.postJson(Config.mainUrl + '/v1/Qrcode/uuid/userlogin', entity)
            .then((res) => {
                //debugger
                let code = res.code
                if (code == '102') {
                    Alert.alert('', "该用户不存在!", [{ text: '取消' },]);
                } else if (code == '103') {
                    Alert.alert('', "该用户被禁用!", [{ text: '取消' },]);
                } else if (code == '104') {//成功
                    Actions.pop()
                    this.props.onblock()
                } else {
                    Toasts.show('登录失败，请重试', { position: px2dp(-80) });
                    Actions.pop()
                }
            })
    }
    handleBack() {//退两层
        Actions.pop()
        this.props.onblock()
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', height: deviceHeight, width: deviceWidth }} >
                <TouchableOpacity onPress={() => this.handleBack()} style={{ marginTop: 38, width: 100, height: 50 }}>
                    <VectorIcon name={"chevron-left"} size={24} color={'black'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                </TouchableOpacity>
                <View style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center" }} >
                    <Image source={require('../image/scanlogin1.png')} style={{ width: 300, height: 150 }} />
                    <Text style={{ fontSize: Config.MainFontSize + 3, color: "black", fontWeight: "bold", marginTop: 30 }}>工薪易电脑端登录确认</Text>
                    <Text style={{ fontSize: Config.MainFontSize, color: "#c2c2c2", marginTop: 20 }}>为确保账号安全，请确认是您本人操作</Text>
                </View>

                <TouchableOpacity onPress={() => this.loginPC()}>
                    <View style={{
                        marginBottom: 20,
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'rgb(65,143,234)',
                        width: deviceWidth / 2,
                        height: 36,
                        marginTop: 60,
                        borderRadius: 30,
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#fff" }}>确认登录电脑端</Text>
                    </View></TouchableOpacity>
                <TouchableOpacity onPress={() => this.handleBack()} >
                    <View style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: '#c2c2c2',
                        width: deviceWidth / 2,
                        height: 36,
                        borderRadius: 30,
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#fff" }}>取消登录</Text>
                    </View></TouchableOpacity>
            </View>
        )
    }
}