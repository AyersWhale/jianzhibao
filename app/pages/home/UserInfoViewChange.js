//修改用户名或者手机号码
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, PixelRatio, TouchableOpacity, Dimensions, Image, TextInput, Alert } from 'react-native';
import px2dp from '../../utils/px2dp';
import { UserInfo, Actions, NavigationBar, Fetch, Config, Toast, Camera, ImagePicker, FileManager, ActionSheet, VectorIcon } from 'c2-mobile';
import Global from '../../utils/GlobalStorage';
import PcInterface from '../../utils/http/PcInterface';
import EncryptionUtils from '../../utils/EncryptionUtils';
export default class UserInfoViewChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statu: '1',
            status: true,
            rightTitle: "修改",
            usernameChange: false,
            phoneChange: false,
            checkStatu: '',
            checkQyStatu: '',
            checkNum: '',
            sendCodeNum: '',
            resetMessage: 60,
            resetAuthCode: false,
            ifuserName: (this.props.ifuserName == undefined) ? '' : this.props.ifuserName,
            userName: (this.props.userName == undefined) ? '' : this.props.userName,
            phone: (this.props.phone == undefined) ? '' : this.props.phone,

        };
        this.checkYYZZ()
        this.checkQYZZ()
    }
    _countTime() {
        // const rule = /^1[0-9]{10}$/;
        // if (!rule.test(this.phone)) {
        //     Toast.showInfo('请输入正确的手机号', 1000);
        //     return
        // } else {
        var tel = this.state.phone
        var phone = ''
        if (tel.length == 13) {
            phone = tel.replace(/\s/g, "")
        } else {
            phone = this.state.phone
        }
        var entity = {
            userMobiletel1: phone,
        }
        Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
            .then((res) => {
                if (res == true) {
                    this.sendCode();
                } else if (res == false) {
                    Toast.showInfo('该号码已注册', 1000);
                } else {
                    Toast.showInfo('服务器异常,请稍后重试', 1000)
                }
            })
    }
    sendCode() {
        var entity = {
            phone: this.state.phone,
            title: 'UPDATEPHONE_CODE'
        }
        Fetch.postJson(Config.mainUrl + '/ws/getVerifyCode', entity)
            .then((res) => {
                this.setState({
                    sendCodeNum: JSON.stringify(res)
                })
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
    //检查个人是否上传营业执照
    checkYYZZ() {
        Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                if (res == undefined) {
                    this.setState({ checkStatu: '' })
                } else {
                    this.setState({ checkStatu: res.status })
                }

            })
    }
    //检查企业是否上传营业执照
    checkQYZZ() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                this.setState({ checkQyStatu: res.hrEmailPassword })
            })
    }
    _handleBack() {
        Actions.pop({ refresh: { test: true } })
    }
    xiugai() {
        this.setState({
            statu: '1',
            rightTitle: ''
        })
    }
    componentWillMount() {
        console.log(UserInfo.loginSet.result.rdata.loginUserInfo)

    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <NavigationBar title={this.state.ifuserName == true ? "用户名修改" : "手机号码修改"} faction='center' >
                    <NavigationBar.NavBarItem onPress={this._handleBack.bind(this)} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    {/* <NavigationBar.NavBarItem /> */}
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <View style={{ backgroundColor: '#f5f5f5', height: 20 }} />
                <ScrollView>

                    {this.state.ifuserName == true ? <View style={{
                        paddingHorizontal: 20,
                        marginBottom: 1,
                        flexDirection: 'row',
                        backgroundColor: "#fff",
                        height: 50,
                        alignItems: 'center',
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#f5f5f5',
                        borderBottomWidth: 1,
                        marginTop: 10
                    }}>
                        <View style={{ width: 5 }} />
                        <Text style={styles.normalsize}>用  户  名</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}
                            keyboardType='numeric'
                            autoFocus={true}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholderTextColor="#c4c4c4"
                            value={this.state.userName}
                            onChangeText={(text) => { this.setState({ userName: text, usernameChange: true }) }}
                        />
                    </View>

                        :
                        <View>
                            <View style={{
                                paddingHorizontal: 20,
                                marginBottom: 1,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 50,
                                alignItems: 'center',
                                width: Dimensions.get('window').width,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }}>
                                <View style={{ width: 5 }} />
                                <Text style={styles.normalsize}>手机号码</Text>
                                <TextInput
                                    style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}
                                    keyboardType='numeric'
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={false}
                                    placeholderTextColor="#c4c4c4"
                                    value={this.state.phone}
                                    onChangeText={(text) => { this.setState({ phone: text, phoneChange: true }) }}
                                />
                            </View>
                            <View style={{
                                paddingHorizontal: 20,
                                marginBottom: 1,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 50,
                                alignItems: 'center',
                                width: Dimensions.get('window').width,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }}>
                                <View style={{ width: 5 }} />
                                <Text style={styles.normalsize}>验证码</Text>
                                <TextInput
                                    style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', width: 200 }}
                                    keyboardType='numeric'
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={false}
                                    placeholderTextColor="#c4c4c4"
                                    placeholder='请输入验证码'
                                    value={this.state.checkNum}
                                    maxLength={8}
                                    onChangeText={(text) => { this.setState({ checkNum: text, }) }}
                                />
                                {this.state.resetAuthCode == false ? <TouchableOpacity style={{ width: 120, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 70, marginTop: 6, borderRadius: 5 }} onPress={() => this._countTime()}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>点击获取验证码</Text></TouchableOpacity>
                                    : <TouchableOpacity disabled={true} style={{ width: 120, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 70, marginTop: 6, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                                }
                            </View>

                        </View>
                    }

                    <View>
                        <TouchableOpacity style={styles.out_button} onPress={() => {
                            this.ensure()
                        }}>
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: Config.C2NavigationBarTintColor,
                                width: Dimensions.get('window').width / 1.5,
                                height: 44,
                                marginTop: 45,
                                borderRadius: 30,
                                justifyContent: 'center'
                            }}>
                                <Text style={styles.out_text}>保存</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }
    //2020/4/20 个人端： 用户名、手机号已不提供修改、有强制下线功能
    //企业： 手机号可修改、无强制下线功能
    markSure() {
        Global.getValueForKey('loginInformation').then((ret) => {
            let loginParams = {
                params: {
                    userName: this.state.userName,
                    passWord: ret.passWord,
                }
            }
            //此处加入登录接口
            EncryptionUtils.fillEncodeData(loginParams);
            PcInterface.login(loginParams, (set) => {
                if (set.result.rcode == 1) {
                    let rawData = {
                        userInfo: loginParams,
                        loginSet: set
                    }
                    UserInfo.initUserInfoWithDict(rawData);
                    Global.saveWithKeyValue('loginInformation', loginParams.params);
                    Actions.pop({ refresh: { test: true } })
                }
            });
        });

        //let userinfotemp = UserInfo

    }
    ensure() {
        if (this.state.ifuserName == true) {
            //是否含有中文（也包含日文和韩文）
            var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            if (reg.test(this.state.userName)) {
                Alert.alert("提示", '用户名为不能为中文,请重新输入', [{ text: '确定', onPress: () => { } }]);
                return;
            }
            if (this.state.userName == '') {
                Toast.showInfo("用户名不能为空", 1000);
                return;
            }
            let userDto = {
                id: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                userName: this.state.userName,
                // userMobiletel1: this.state.phone,
            }
            var entity1 = {
                userName: this.state.userName,
            }
            if (this.state.usernameChange) {
                Fetch.postJson(Config.mainUrl + '/ws/checkAccount', entity1)
                    .then((res) => {
                        if (res) {
                            Fetch.postJson(Config.mainUrl + '/accountRegist/updateUser', userDto)
                                .then((res) => {
                                    console.log(res)
                                    if (res) {
                                        Toast.showInfo('用户名修改成功', 1000)
                                        this.props.callback({ userName: this.state.userName })
                                        this.markSure()
                                        UserInfo.loginSet.result.rdata.loginUserInfo.userName = this.state.userName;
                                    }
                                    this.setState({
                                        statu: '0',
                                        rightTitle: '修改'
                                    })
                                })
                        }
                        else if (res == false) {
                            Toast.showInfo('该用户名已注册', 1000)
                        } else {
                            Toast.showInfo('服务器异常,请稍后重试', 1000)
                        }
                    })
            } else {
                Toast.showInfo('请修改用户名', 1000)
            }

        } else {
            const rule = /^1[0-9]{10}$/;
            if (!rule.test(this.state.phone)) {
                Toast.showInfo('请输入正确的手机号', 1000);
                return
            }
            if (this.state.phone == '' || this.state.phone == undefined) {
                Toast.showInfo('请输入的手机号', 1000);
                return;
            }
            if (this.state.checkNum == '') {
                Toast.showInfo('请输入验证码', 1000);
                return;
            }
            if (this.state.checkNum !== this.state.sendCodeNum) {
                Toast.show({
                    title: '验证码错误',
                    duration: 1000,
                });
            }
            else {
                //debugger
                let userDto = {
                    id: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                    userName: UserInfo.loginSet.result.rdata.loginUserInfo.userName,
                    userMobiletel1: this.state.phone,
                }
                var entity = {
                    userMobiletel1: this.state.phone,
                }
                Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
                    .then((res) => {
                        if (res) {
                            Fetch.postJson(Config.mainUrl + '/accountRegist/updateUser', userDto)
                                .then((res) => {
                                    //debugger
                                    if (res) {
                                        this.props.onblock({ phone: this.state.phone })
                                        Toast.showInfo('手机号码修改成功', 1000)
                                        this.markSure()
                                        UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 = this.state.phone;
                                        Actions.pop()
                                    }
                                })
                            this.setState({
                                statu: '0',
                                rightTitle: '修改'
                            })
                        } else if (res == false) {
                            Toast.showInfo('该号码已注册', 1000)
                        } else {
                            Toast.showInfo('服务器异常,请稍后重试', 1000)
                        }
                    })

            }
        }



    }
}


const styles = StyleSheet.create({
    list: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#e4e4e4',
        marginTop: px2dp(12)
    },
    normalsize: {
        color: "#222222",
        fontSize: Config.MainFontSize
    },
    ditGroup: {
        margin: px2dp(0)
    }, subtitleView1: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }, subtitleView: {
        flexDirection: 'row',
        paddingLeft: 7,
        paddingTop: 5
    }, titleStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 80,
        width: 80,
    }
    ,
    titleStyle3: {

        fontSize: 18,
        color: '#333',

        backgroundColor: 'transparent',
        fontWeight: 'bold'
    }, titleStyle4: {
        marginTop: 2,
        fontSize: 12,
        color: '#808080',
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    titleStyle5: {
        marginLeft: 8,
        fontSize: 12,
        color: '#fffaf0',
        backgroundColor: '#dc143c',
        fontWeight: 'bold',
        justifyContent: 'center',
        height: 16,
        width: 40
    },
    out_text: {
        fontSize: 16,
        color: '#ffffff'
    },
});