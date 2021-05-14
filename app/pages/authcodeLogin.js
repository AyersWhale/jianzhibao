//验证码登录
//曾一川
import React, { Component } from 'react';
import { ImageBackground, Text, View, Dimensions, PixelRatio, TouchableHighlight, StyleSheet, Modal, Platform, TouchableWithoutFeedback, TouchableOpacity, Image, Alert, TextInput, Keyboard, ScrollView } from 'react-native';
import Button from '../components/Button1';
import px2dp from '../utils/px2dp';
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';
import Global from '../utils/GlobalStorage';
import { UserInfo, Actions, UUID, Config, VectorIcon, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import stylesheet from './JmLoginCss';
import PasswordGesture from 'react-native-gesture-password'
import { FingerprintLock } from "../Libraries/";
let password = ''; //密码
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import PushUtils from '../utils/PushUtils';
import { commonLogin } from '../utils/common/businessUtil'

Object.assign(Text.defaultProps, { allowFontScaling: false });
export default class authcodeLogin extends Component {
    constructor(props) {
        super(props);
        this._countTime = this._countTime.bind(this);
        this._timer = null;

        this.state = {
            loading: true,
            isGesture: false,
            message: '',
            modalVisible: false,
            isFingerPrint: false,
            status: 'normal',
            isLock: false,
            showFirstPic: true,
            changeLogin_click: false,
            selected: true,
            showWelcome: true,
            showTheme: false,
            theme: '1',
            showIdentity: true,
            resetMessage: 60,
            resetAuthCode: false,
            RealUserName: '',
            RealUserPassword: '',
            showIdentity: '',
            showsure: true,
        }
        this.onLogin = this._onLogin.bind(this);

        var th = this;
        var i = 0;



        // Global.getValueForKey('loginInformation').then((ret) => {
        //     if (ret.passWord) {
        //         Global.getValueForKey('ifRemberPassword').then((ret11) => {
        //             if (ret11.rember == false) {
        //                 th.setState({
        //                     selected: false,
        //                 })
        //                 this.userName = ret.userName;
        //                 this.passWord = '';
        //             } else {
        //                 this.userName = ret.userName;
        //                 this.passWord = ret.passWord;
        //                 th.setState({
        //                     selected: true,
        //                 })
        //             }
        //         })
        //         th.setState({
        //             loading: false
        //         })

        //         this.userName = '';
        //         this.password = '';
        //         th.setState({
        //             selected: true
        //         })
        //         Global.saveWithKeyValue('ifRemberPassword', { rember: true })
        //         this.timer = setTimeout(
        //             () => {
        //                 th.setState({
        //                     showFirstPic: false,
        //                     showWelcome: true,
        //                     showIdentity: true,
        //                 })
        //             },
        //             1000
        //         );

        //     }
        // });

    }
    componentWillMount() {

    }
    componentDidMount() {
        Global.getValueForKey('mainUrl').then((ret) => {
            if (ret == Config.mainUrl || ret == '' || ret == undefined) {
            } else {
                Config.mainUrl = ret
            }
        })
    }
    componentWillMount() {
        // Global.getValueForKey('loginInformation').then((ret) => {
        //     if (ret) {
        //         this.userName = ret.userName;
        //         this.password = ret.passWord;
        //         this.setState({
        //             loading: false
        //         })
        //     }
        // })

    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    loading() {
        return (
            <View style={styles.editGroup}>
                <TouchableWithoutFeedback  >
                    <View style={styles.editView1}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize + 5, fontFamily: 'PingFang SC', marginTop: 6, marginLeft: 10, fontWeight: '500' }}>
                            手机号
                        </Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {/* <Image source={require('../image/icon_iphone2.png')} style={{ alignSelf: 'center', width: 24, height: 24, marginLeft: 8 }} /> */}
                            <View style={styles.editView2}>
                                {<TextInput
                                    style={styles.edit}
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    placeholder="请输入您的手机号"
                                    placeholderTextColor='#c4c4c4'
                                    onChangeText={(text) => { this.telphone = text }}
                                />}
                            </View>
                            {this.state.resetAuthCode == false ? <TouchableOpacity style={{ display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, height: 30, backgroundColor: '#4D88FF', marginTop: 6, borderRadius: 2 }} onPress={() => this._countTime()}><Text style={{ borderRadius: 2, color: 'white' }}>获取验证码</Text></TouchableOpacity>
                                : <TouchableOpacity disabled={true} style={{ display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100, height: 30, backgroundColor: '#4D88FF', marginTop: 6, borderRadius: 2 }}><Text style={{ borderRadius: 2, color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ height: 0.5, backgroundColor: '#E4E4E4', width: theme.screenWidth - 80, alignSelf: 'center' }} />
                <TouchableWithoutFeedback>
                    <View style={styles.editView1}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize + 5, fontFamily: 'PingFang SC', marginTop: 6, marginLeft: 10, fontWeight: '500' }}>
                            短信验证码
                        </Text>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            {/* <Image source={require('../image/icon_meagges2.png')} style={{ width: 24, height: 24, marginLeft: 8 }} /> */}
                            <View style={styles.editView2}>
                                {<TextInput
                                    style={styles.edit1}
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    placeholder={"请输入验证码"}
                                    placeholderTextColor='#c4c4c4'
                                    maxLength={8}
                                    onChangeText={(text) => { this.bendiCode = text }}
                                />}
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ height: 0.5, backgroundColor: '#E4E4E4', width: theme.screenWidth - 80, alignSelf: 'center' }} />

            </View>
        )
    }

    _onLogin() {
        if (this.state.showsure == false) {
            Toast.showInfo('请您阅读并同意相关协议之后再进行登录!', 3000);
            return;
        }
        if (this.telphone == '' || this.telphone == undefined) {
            Alert.alert('', "请输入手机号!", [{ text: '取消' },]);
            return;
        }
        if (this.bendiCode == '' || this.bendiCode == undefined) {
            Alert.alert('', "请输入验证码!", [{ text: '取消' },]);
            return;
        }
        var entity = {
            userMobiletel1: this.telphone,
        }
        Fetch.postJson(Config.mainUrl + '/ws/queryAccountByPhone', entity)
            .then((res) => {
                console.log(res)
                if (res.rcode == '1') {
                    var entity = {
                        VerifyCode: this.bendiCode,
                        phone: this.telphone,
                    }
                    Fetch.postJson(Config.mainUrl + '/ws/checkVerifyCode', entity)
                        .then((result) => {
                            debugger
                            console.log(result)
                            if (result.rcode == '1') {
                                let loginParams = {
                                    params: {
                                        userName: res.entity.userName,
                                        passWord: res.entity.userPassword,
                                    }
                                }
                                //此处加入登录接口
                                commonLogin(loginParams, () => {
                                    Actions.TabBar({ type: 'replace', identity: 'student' })
                                    return;
                                })
                            } else {
                                Toast.showInfo(result.Msg, 1000)
                            }

                        })
                } if (res.rcode == 2) {
                    var entity = {
                        VerifyCode: this.bendiCode,
                        phone: this.telphone,
                    }
                    Fetch.postJson(Config.mainUrl + '/ws/checkVerifyCode', entity)
                        .then((result) => {
                            console.log(result)
                            if (result.rcode == 1) {
                                let loginParams = {
                                    params: {
                                        userName: res.entity.userName,
                                        passWord: res.entity.userPassword,
                                    }
                                }
                                //此处加入登录接口
                                commonLogin(loginParams, () => {
                                    Actions.TabBar({ type: 'replace', identity: 'boss' })
                                    return;
                                })
                            } else {
                                Toast.showInfo(result.Msg, 1000)
                            }
                        })
                } else {
                    // Toast.showInfo(res.Msg, 1000)
                }
            })

    }

    render() {

        // if (this.state.showIdentity == true) {
        //     return(
        //         <View style={{ flex: 1, width: deviceWidth, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
        //             <View style={{ marginTop: (Platform.OS == 'ios') ? deviceHeight / 6 : deviceHeight / 8, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
        //                 <Text style={{ fontSize: Config.MainFontSize + 6, marginTop: 40 }}>请选择您的身份</Text>

        //                 <TouchableOpacity onPress={this.registerBoss.bind(this)} style={{ marginTop: (Platform.OS == 'ios') ? 100 : 80 }}>
        //                     <Image style={styles.imgstyle2} source={require('../image/zc_qyzc.png')} >
        //                     </Image>
        //                 </TouchableOpacity>
        //             </View>
        //             <View style={{ marginTop: 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
        //                 <TouchableOpacity onPress={this.register.bind(this)}>
        //                     <Image style={styles.imgstyle2} source={require('../image/zc_grzc.png')} >
        //                     </Image>
        //                     {/* <Text style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', fontSize: Config.MainFontSize + 6, marginTop: -(theme.screenWidth / 5 + 40) / 2, color: 'white', backgroundColor: 'transparent', marginLeft: 20 }}>个人注册</Text> */}
        //                 </TouchableOpacity>
        //             </View>
        //             <Text style={{ fontSize: Config.MainFontSize, marginTop: (Platform.OS == 'ios') ? 200 : 100, }}>机会不会主动找你，必须亮出你自己</Text>
        //         </View>
        //     )
        // }
        // else {
        return (
            <ScrollView>
                <TouchableOpacity activeOpacity={1} style={styles.view} onPress={() => Keyboard.dismiss()} onPress={() => this.setState({ showTheme: false })}>
                    <View style={{ width: theme.screenWidth, height: theme.screenHeight, backgroundColor: 'white' }}>
                        <ScrollView>
                            {/* <Image source={require('../image/logo.png')} style={{ width: 40, height: 40, position: 'absolute', marginTop: theme.screenHeight / 6 - 10, marginLeft: 20 }} />
                            <Text style={{ position: 'absolute', marginTop: theme.screenHeight / 6, fontSize: Config.MainFontSize + 4, marginLeft: 80 }}>欢迎来到工薪易</Text>
                            <View style={{ alignItems: 'center', marginTop: deviceHeight / 6 + 30 }}>
                            </View> */}
                            <View style={{ width: deviceWidth, backgroundColor: '#3E7EFE', height: 210 }}>
                                <Text style={{ position: 'absolute', marginTop: 80, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>{this.state.identityDl == 0 ? '您好，企业登录！' : '您好，个人登录！'}</Text>
                                <Text style={{ position: 'absolute', marginTop: 118, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>欢迎来到工薪易</Text>
                                <Image source={require('../image/dllogo.png')} style={{ width: 211, height: 211, position: 'absolute', right: -40 }} />
                            </View>
                            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20 }}>{this.loading()}</View>
                            <TouchableOpacity style={styles.out_button} onPress={() => {
                                this._onLogin()
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#3E7EFE',
                                    width: Dimensions.get('window').width / 1.3,
                                    height: 44,
                                    marginTop: 10,
                                    borderRadius: 20,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize + 2,
                                        color: '#ffffff'
                                    }}>登录</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                <TouchableOpacity style={{ backgroundColor: 'transparent', marginLeft: theme.screenWidth / 2.6 }} onPress={this.register.bind(this)}><Text style={{ color: 'rgb(65,143,234)' }}>注册</Text></TouchableOpacity>
                                <Text style={{ backgroundColor: 'transparent', fontWeight: 'bold', color: 'grey', marginLeft: 10, }}>|</Text>
                                <TouchableOpacity style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 10 }} onPress={() => Actions.pop()}>
                                    <Text style={{ color: 'rgb(65,143,234)' }}>密码登录</Text>
                                </TouchableOpacity>
                                <Text style={{ backgroundColor: 'transparent', fontWeight: 'bold', color: 'grey', marginLeft: 10, }}>|</Text>
                                <TouchableOpacity style={{ backgroundColor: 'transparent', marginLeft: 10 }} onPress={this.forgetPassword.bind(this)}><Text style={{ color: 'rgb(65,143,234)' }}>忘记密码?</Text></TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: theme.screenHeight / 5 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => this.setState({ showsure: !this.state.showsure })}>
                                        {this.state.showsure ? <Image source={require('../image/icon/icon_xuanze.png')} style={{ width: 16, height: 16 }} />
                                            : <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: '#333' }}></View>}
                                    </TouchableOpacity>
                                    <Text style={{ marginLeft: 7, color: '#999999', fontSize: Config.MainFontSize - 3, fontWeight: '500', fontFamily: 'PingFang SC' }}>已阅读并同意工薪易
                                     <Text onPress={() => { Actions.C2WebView({ url: Config.mainUrl + '/view/agreement5.html', title: '“工薪易”平台须知' }) }} style={{ color: '#3E7EFE' }}>《“工薪易”平台须知》</Text>&<Text onPress={() => { Actions.C2WebView({ url: Config.mainUrl + '/view/agreement4.html', title: '“工薪易”平台隐私政策' }) }} style={{ color: '#3E7EFE' }}>《“工薪易”平台隐私政策》</Text></Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        );
        // }
    }
    //忘记密码
    forgetPassword() {
        Actions.ForgetPassword({ theme: this.state.theme })
    }
    //个人注册
    register() {
        this.setState({ showIdentity: false, identity: 'student' })
        Actions.Register({ theme: this.state.theme, identity: 'student' })
    }
    //企业注册
    registerBoss() {
        Alert.alert('温馨提示', "如您是企业用户,请前往网页端注册实名!", [{ text: '确定' },]);
        // this.setState({ showIdentity: false, identity: 'boss' })
        // Actions.Register({ theme: this.state.theme, identity: 'boss' })
    }
    //记住密码
    ifRemembler() {
        this.setState({ selected: !this.state.selected })
        Global.saveWithKeyValue('ifRemberPassword', { rember: !this.state.selected })
    }
    //选择主题
    showTheme() {
        if (this.state.showTheme) {
            return (
                <View style={{ position: 'absolute', right: 5, top: 60, borderWidth: 1, borderColor: 'grey' }}>
                    <TouchableOpacity onPress={() => this.saveTheme('1')}><ImageBackground style={{ width: 80, height: 30 }} source={require('../image/xingkong.jpg')}><Text style={{ backgroundColor: 'transparent', color: '#D1EEEE', alignSelf: 'center', paddingTop: 7, fontWeight: 'bold' }}>星   空</Text></ImageBackground></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.saveTheme('2')}><ImageBackground style={{ width: 80, height: 30 }} source={require('../image/keji.png')}><Text style={{ backgroundColor: 'transparent', color: 'white', alignSelf: 'center', paddingTop: 7, fontWeight: 'bold' }}>科   技</Text></ImageBackground></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.saveTheme('3')}><ImageBackground style={{ width: 80, height: 30 }} source={require('../image/haiyang.png')}><Text style={{ backgroundColor: 'transparent', color: 'white', alignSelf: 'center', paddingTop: 7, fontWeight: 'bold' }}>海   洋</Text></ImageBackground></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.saveTheme('4')}><ImageBackground style={{ width: 80, height: 30 }} source={require('../image/bangong.png')}><Text style={{ backgroundColor: 'transparent', color: '#D1EEEE', alignSelf: 'center', paddingTop: 7, fontWeight: 'bold' }}>办   公</Text></ImageBackground></TouchableOpacity>
                </View>
            )
        }
    }
    saveTheme(index) {
        if (index == '1') {
            Config.C2NavigationBarTintColor = 'rgb(42,51,91)',
                Config.SettingBackgroundImg = require('../image/xingkong.jpg');
        }
        if (index == '2') {
            Config.C2NavigationBarTintColor = 'rgb(29,29,29)'
            Config.SettingBackgroundImg = require('../image/bg4.png');
        }
        if (index == '3') {
            Config.C2NavigationBarTintColor = 'rgb(31,164,240)'
            Config.SettingBackgroundImg = require('../image/haiyang.png');
        }
        if (index == '4') {
            Config.C2NavigationBarTintColor = 'rgb(52,121,228)'
            Config.SettingBackgroundImg = require('../image/bangong.png');
        }
        this.setState({ showTheme: false, theme: index })
        Global.saveWithKeyValue('themePick', index);
    }

    onEnd(input) {
        if (password === input) {
            //解锁
            this.setState({
                status: 'right',
                message: '手势密码解锁成功!'
            });
            this._onLogin();
        } else {
            this.setState({
                status: 'wrong',
                message: '手势密码错误,请重新输入!'
            });
        }

    }
    changeLogin() {
        if (this.state.changeLogin_click) {
            return (
                <View style={{ marginTop: 10 }}>
                    <Modal
                        alignSelf={'center'}
                        animationType={"slide"}
                        transparent={true}
                        onRequestClose={() => { }}
                    >
                        <TouchableOpacity activeOpacity={1} style={styles.view} onPress={() => Keyboard.dismiss()}>
                            <View style={{ width: theme.screenWidth, height: theme.screenHeight, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <View style={{
                                    margin: px2dp(20), marginTop: (Platform.OS === 'android') ? px2dp(149) : px2dp(169), width: theme.screenWidth - px2dp(40), height: px2dp(170), backgroundColor: 'rgb(255,255,255)',
                                    borderRadius: px2dp(10)
                                }}>
                                    <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: 'lightgrey', flexDirection: 'row', height: px2dp(19), marginTop: 20, justifyContent: 'center' }}>
                                        <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>请选择登录方式</Text>
                                    </View>
                                    <View style={{
                                        height: 86,
                                        backgroundColor: 'white', borderBottomColor: 'lightgrey', borderBottomWidth: 1,
                                    }}>
                                        <View>
                                            <TouchableOpacity onPress={() => FingerprintLock.getFingerprintLock().then((response) => {
                                                console.log("ddd=", response)
                                                if (response == "解锁成功") {
                                                    this.setModalVisible(false);
                                                    this._onLogin();
                                                } else {
                                                    this.password = '';
                                                }
                                            })} >
                                                <View>
                                                    <Image style={{ marginTop: 10, marginLeft: 20, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute' }} source={require('../image/fingureUnlock.jpg')} />
                                                    <Text style={stylesheet.phoneText1}>指   纹   解   锁</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableHighlight onPress={() => {
                                                this.setState({ changeLogin_click: false })
                                            }}>
                                                <View style={{ width: (theme.screenWidth - px2dp(40)), height: px2dp(40), alignItems: 'center', justifyContent: 'center', }}>
                                                    <Text style={{ color: '#1e90ff', fontSize: Config.MainFontSize }}>取消</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>

                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </View>

            )
        } else return null
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
                    if (res == false) {
                        this.sendCode();
                    } else if (res == true) {
                        Toast.showInfo('该号码未注册', 1000);
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

    view: {
        flex: 1,
    },
    loginBg: {
        height: theme.screenHeight,
        width: theme.screenWidth,
    },
    imgstyle: {
        height: theme.screenHeight,
        width: theme.screenWidth,
    },
    imgstyle1: {
        height: theme.screenHeight / 3,
        width: theme.screenWidth / 3,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    imgstyle2: {
        height: theme.screenWidth / 5 + 30,
        width: theme.screenWidth - 60,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    actionBar: {
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    edit: {
        backgroundColor: 'transparent',
        opacity: 0.8,
        height: px2dp(43),
        fontSize: Config.MainFontSize + 3,
        paddingLeft: px2dp(0),
        paddingRight: px2dp(100),
        color: 'black',
        borderRadius: 18
    },
    edit1: {
        flex: 1,
        height: px2dp(43),
        textAlign: 'left',
        fontSize: Config.MainFontSize + 3,
        backgroundColor: 'transparent',
        marginLeft: 0
    },
    editView2: {
        flex: 1,
        height: px2dp(43),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginLeft: 10,
        // marginTop: 20

    },
    editView1: {
        // height: px2dp(48),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginLeft: 10,
        marginTop: (Platform.OS == 'ios') ? 20 : 5,
        marginBottom: (Platform.OS == 'ios') ? 0 : 10
    },
    editGroup: {
        margin: px2dp(20),
        borderRadius: px2dp(10),
        // height: px2dp(130),
    },
    textButtonLine: {
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thirdPartyView: {
        flex: 1,
        marginTop: px2dp(10),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around'
    },// modal的样式  
    modalStyle: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    // modal上子View的样式  
    subView: {
        alignSelf: 'stretch',
        justifyContent: 'center',
    }

});