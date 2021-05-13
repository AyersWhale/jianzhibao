//忘记密码
//曾一川
import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, PixelRatio, Platform, ImageBackground, TextInput, TouchableOpacity, Text, Alert, Image } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import stylesheet from '../utils/style';
import { Fetch, VectorIcon, Actions, Config, Toast, SafeArea, UserInfo } from 'c2-mobile';
import Global from '../utils/GlobalStorage';
import PcInterface from '../utils/http/PcInterface'
export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this._countTime = this._countTime.bind(this);
        this._timer = null;
        this.telphone = '';
        this.confirmPassword = '';
        this.newPassword1 = '';
        this.state = {
            resetMessage: 60,
            newPasswordS: true,
            resetMessage: 60,
            resetAuthCode: false,
            realCode: '',
            newPassword: '',
            oldPassword: '',
            showWord: false,
            showWord_a: false,
        }
    }

    render() {
        return (
            <View style={stylesheet.containerRouter}>
                <View style={{ height: theme.screenHeight, width: theme.screenWidth, backgroundColor: 'white' }}>
                    {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: theme.screenWidth, height: 70 + SafeArea.top }}> */}
                    <View style={{ width: theme.screenWidth, height: 70 + SafeArea.top, backgroundColor: '#3E7EFE' }}>
                        <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                            <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>忘记密码</Text>
                        </View>
                    </View>
                    {/* </ImageBackground> */}
                    <View style={{ height: 20, backgroundColor: 'transparent' }} />

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: theme.screenWidth - 109 }}>
                        {/* {<VectorIcon
                            name="mobile_phone"
                            size={36}   //图片大小
                            color='black'  //图片颜色

                            style={{ alignSelf: 'center', backgroundColor: 'transparent', marginLeft: 46 }}
                        />} */}
                        {/* <View style={styles.editView2}> */}
                        <Image source={require('../image/icon_iphone2.png')} style={{ alignSelf: 'center', width: 24, height: 24, marginLeft: 46 }} />
                        {<TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="请输入手机号码"
                            placeholderTextColor='#c4c4c4'
                            onChangeText={(text) => { this.telphone = text }}
                        />}
                    </View>
                    {/* </View> */}
                    <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#E4E4E4', width: theme.screenWidth - 69, alignSelf: 'center' }} />
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* {<VectorIcon
                            name="c2_im_weixin_keyboard"
                            size={32}   //图片大小
                            color='black'  //图片颜色

                            style={{ alignSelf: 'center', backgroundColor: 'transparent', marginLeft: 36 }}
                        />} */}
                        {/* <View style={styles.editView2}> */}
                        <Image source={require('../image/icon_meagges2.png')} style={{ alignSelf: 'center', width: 24, height: 24, marginLeft: 46 }} />
                        {<TextInput
                            style={styles.edit1}
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            placeholder={(Platform.OS == 'ios') ? "验证码" : "验证码"}
                            placeholderTextColor='#c4c4c4'
                            maxLength={8}
                            onChangeText={(text) => { this.bendiCode = text }}
                        />}
                        {/* </View> */}
                        {this.state.resetAuthCode == false ?
                            <TouchableOpacity style={{ width: 100, height: 34, backgroundColor: '#4D88FF', alignSelf: 'center', borderRadius: 5, marginRight: 34 }} onPress={() => this._countTime()}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>获取验证码</Text></TouchableOpacity>
                            : <TouchableOpacity disabled={true} style={{ width: 100, height: 34, backgroundColor: 'grey', alignSelf: 'center', marginRight: 34, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                        }
                    </View>
                    <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#E4E4E4', width: theme.screenWidth - 75, alignSelf: 'center' }} />
                    {this.state.newPasswordS == true ?
                        <View>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10, }}>
                                {/* {<VectorIcon
                                    name="locked"
                                    size={28}   //图片大小
                                    color='black'  //图片颜色

                                    style={{ alignSelf: 'center', backgroundColor: 'transparent', marginLeft: 38, marginTop: 6 }}
                                />} */}
                                <Image source={require('../image/icon_code2.png')} style={{ width: 24, height: 24, marginLeft: 46 }} />
                                <View style={styles.passWord}>
                                    {<TextInput
                                        style={styles.edit1}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={true}
                                        placeholder="请设置新密码"
                                        placeholderTextColor='#c4c4c4'
                                        onChangeText={(text) => { this.newPassword = text }}
                                        secureTextEntry={!this.state.showWord}
                                    />}
                                    {this.state.showWord ?
                                        <TouchableOpacity onPress={() => { this.setState({ showWord: !this.state.showWord }) }}>
                                            <Image source={require('../image/icon/icon_openeyes.png')} style={{ width: 24, height: 24, }} />
                                        </TouchableOpacity>
                                        : <TouchableOpacity onPress={() => { this.setState({ showWord: !this.state.showWord }) }}>
                                            <Image source={require('../image/icon/icon_closeeyes.png')} style={{ width: 24, height: 24, }} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#E4E4E4', width: theme.screenWidth - 75, alignSelf: 'center' }} />
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                {/* {<VectorIcon
                                    name="locked"
                                    size={30}   //图片大小
                                    color='black'  //图片颜色

                                    style={{ alignSelf: 'center', backgroundColor: 'transparent', marginLeft: 38, marginTop: 6 }}
                                />} */}
                                <Image source={require('../image/icon_code2.png')} style={{ width: 24, height: 24, marginLeft: 46 }} />
                                <View style={styles.passWord}>
                                    {<TextInput
                                        style={styles.edit1}
                                        underlineColorAndroid="transparent"
                                        placeholder="请确认新密码"
                                        secureTextEntry={true}
                                        placeholderTextColor='#c4c4c4'
                                        onChangeText={(text) => { this.confirmPassword = text }}
                                        secureTextEntry={!this.state.showWord_a}
                                    />}
                                    {this.state.showWord_a ?
                                        <TouchableOpacity onPress={() => { this.setState({ showWord_a: !this.state.showWord_a }) }}>
                                            <Image source={require('../image/icon/icon_openeyes.png')} style={{ width: 24, height: 24, }} />
                                        </TouchableOpacity>
                                        : <TouchableOpacity onPress={() => { this.setState({ showWord_a: !this.state.showWord_a }) }}>
                                            <Image source={require('../image/icon/icon_closeeyes.png')} style={{ width: 24, height: 24, }} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                            <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#E4E4E4', width: theme.screenWidth - 75, alignSelf: 'center' }} />
                        </View>
                        : null
                    }
                    <TouchableOpacity style={styles.out_button} onPress={() => {
                        this.onRightCommit()
                    }}>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#3E7EFE',
                            width: Dimensions.get('window').width / 1.3,
                            height: 52,
                            marginTop: 60,
                            borderRadius: 30,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#ffffff'
                            }}>确定</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View >

        );
    }
    onLeftBack() {
        const { navigator } = this.props;
        navigator.pop();
    }
    onRightCommit() {
        const telRule = /^1[0-9]{10}$/;
        if (!telRule.test(this.telphone) || this.telphone == '' || this.telphone == undefined) {
            Alert.alert('', "请输入正确的手机号!", [{ text: '取消' },]);
            return;
        }
        if (this.bendiCode == '' || this.bendiCode == undefined) {
            Alert.alert('', "请输入验证码!", [{ text: '取消' },]);
            return;
        }
        if (this.newPassword == '' || this.newPassword == undefined) {
            Alert.alert('', "请输入新密码!", [{ text: '取消' },]);
            return;
        }
        if (this.confirmPassword == '' || this.confirmPassword == undefined) {
            Alert.alert('', "请确认新密码!", [{ text: '取消' },]);
            return;
        }
        if (this.newPassword != this.confirmPassword) {
            Alert.alert('', "新密码与确认密码不一致，请修改", [{ text: '取消' },]);
            return;
        }
        var entity = {
            userMobiletel1: this.telphone,
        }
        Fetch.postJson(Config.mainUrl + '/ws/queryAccountByPhone', entity)
            .then((res) => {
                console.log(res)
                if (res.rcode == '2' || res.rcode == '1') {
                    if (this.bendiCode == this.state.realCode) {
                        var entity1 = {
                            userMobiletel1: res.entity.userMobiletel1,
                            userPassword: this.newPassword,
                        }
                        Fetch.postJson(Config.mainUrl + '/accountRegist/updatePassword', entity1)
                            .then((res) => {
                                console.log(res)
                                if (res) {
                                    Alert.alert("提示", "修改成功,返回登录页面重新登录"
                                        , [
                                            {
                                                text: "确定", onPress: () => {
                                                    Actions.Login({ type: 'reset' });
                                                }
                                            }
                                        ])
                                } else {
                                    Alert.alert("提示", "修改失败"
                                        , [
                                            {
                                                text: "确定", onPress: () => {

                                                }
                                            }
                                        ])
                                }
                            });
                    } else {
                        Toast.showInfo('验证码错误', 1000);
                    }
                } else {
                    Toast.showInfo(res.Msg, 1000);
                }
            })

    }

    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
    }
    componentWillMount() {


    }

    _countTime() {
        const rule = /^1[0-9]{10}$/;
        if (!rule.test(this.telphone)) {
            Toast.showInfo('请输入正确的手机号', 1000);
            return
        } else {
            var entity = {
                userMobiletel1: this.telphone,
            }
            Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
                .then((res) => {
                    if (!res) {
                        this.sendCode();
                    } else if (res) {
                        Toast.showInfo('该号码未注册', 1000)
                    } else {
                        Toast.showInfo('服务器异常,请稍后重试', 1000)
                    }
                })
        }

    }
    sendCode() {
        var entity = {
            phone: this.telphone,
            title: 'LOGIN_CODE'
        }
        Fetch.postJson(Config.mainUrl + '/ws/getVerifyCode', entity)
            .then((res) => {
                console.log(res)
                // Alert.alert("验证码（测试用）", JSON.stringify(res), [{ text: '确定', onPress: () => { } }]);
                Toast.showInfo('发送成功', 1000)
                this.setState({ realCode: res })
            })
        let time = parseInt(this.state.resetMessage);
        this.setState({
            resetAuthCode: true,
        })
        this._timer = setInterval(() => {
            time--;
            this.setState({ resetMessage: time });
            if (this.state.resetMessage <= 0) {
                this._timer && clearInterval(this._timer);
                this.setState({
                    resetAuthCode: false,
                    resetMessage: 60,
                })
            }
        }, 1000);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    out_text: {
        fontSize: 16,
        color: '#ffffff'
    },
    out_body: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgb(65,143,234)',
        width: Dimensions.get('window').width / 1.3,
        height: 44,
        marginTop: 60,
        borderRadius: 20,
        justifyContent: 'center'
    },
    view: {
        flex: 1,
        backgroundColor: 'rgb(22,131,251)'
    },
    actionBar: {
        height: theme.actionBar.height,
        backgroundColor: theme.actionBar.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
    },
    edit: {
        flex: 1,
        height: 62,
        textAlign: 'left',
        fontSize: Config.MainFontSize + 3,
        backgroundColor: 'transparent',
        marginLeft: 16,
    },
    edit2: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: px2dp(14),
        backgroundColor: 'transparent',
        marginLeft: 10,
        width: theme.screenWidth / 2
    },
    edit1: {
        flex: 1,
        height: 62,
        textAlign: 'left',
        fontSize: Config.MainFontSize + 3,
        backgroundColor: 'transparent',
        marginLeft: 16,
    },

    editView1: {
        height: px2dp(48),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    editView2: {
        flex: 1,
        height: px2dp(30),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginTop: 20
    },
    list: {
        marginTop: px2dp(15)
    },
    editGroup: {
        margin: px2dp(0)
    },
    passWord: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 62,
        width: theme.screenWidth - 46 - 24 - 32
    }
});