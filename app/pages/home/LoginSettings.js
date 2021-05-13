/**
 * 登录设置
 * Created by 伍钦.
 */
import React, { Component } from 'react';
import {
    Text, View, StyleSheet, ScrollView, Dimensions, Image, TouchableOpacity, Platform, TextInput, ImageBackground, BackHandler, DeviceEventEmitter
} from 'react-native';
import Global from '../../utils/GlobalStorage';
import { Actions, Config, SSOAuth, VectorIcon, UserInfo, SafeArea } from 'c2-mobile';
import { List, Radio } from 'antd-mobile-rn';
const RadioItem = Radio.RadioItem;
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class LoginSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: UserInfo.loginSet.result.rdata.loginUserInfo,
            bjsz: false,
            bjszDesc: '',
            phone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1,
            tellphone: UserInfo.loginSet.result.rdata.loginUserInfo.userWorktel,
            imageSource: UserInfo.loginSet.result.rdata.loginUserInfo.remark1,
            userName: UserInfo.loginSet.result.rdata.loginUserInfo.userName,
            usernameChange: false,
            phoneChange: false,
            checkNum: this.props.identity == 'student' ? '1' : '',
            resetMessage: 60,
            resetAuthCode: false,
            statu: '0',
        }
        Global.getValueForKey('loginSettingChoose').then((ret) => {
            if (ret) {
                if (ret == 'auto') {
                    this.setState({ bjszNum: 1, bjszDesc: "自动登录" });
                }
                if (ret == 'gesture') {
                    this.setState({ bjszNum: 2, bjszDesc: "手势密码" });
                }
                if (ret == 'voice') {
                    this.setState({ bjszNum: 3, bjszDesc: "声音锁" });
                }
                if (ret == 'face') {
                    this.setState({ bjszNum: 4, bjszDesc: "面部识别" });
                }
            }

        })
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        return (
            <ScrollView style={styles.main_view}>
                {/* <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>登录设置</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>登录设置</Text>
                    </View>
                </View>
                <ScrollView>
                    <View>
                        {this.props.identity == 'student' ? <View style={{
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
                            <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}>{this.state.userName}</Text>
                        </View>
                            : null}
                        {this.state.statu == '0' ?
                            this.props.identity == 'student' ?
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
                                }} onPress={() => Actions.UserInfoViewChange({ phone: this.state.phone, onblock: this.callback.bind(this) })}>
                                    <View style={{ width: 5 }} />
                                    <Text style={styles.normalsize}>手机号码</Text>
                                    <Text style={{ color: '#999', position: 'absolute', right: 10 }} >{this.state.phone}</Text>
                                </View>
                                :
                                null
                            // <TouchableOpacity style={{
                            //     paddingHorizontal: 20,
                            //     marginBottom: 1,
                            //     flexDirection: 'row',
                            //     backgroundColor: "#fff",
                            //     height: 50,
                            //     alignItems: 'center',
                            //     width: Dimensions.get('window').width,
                            //     borderBottomColor: '#f5f5f5',
                            //     borderBottomWidth: 1,
                            //     marginTop: 10
                            // }} onPress={() => Actions.UserInfoViewChange({ phone: this.state.phone, onblock: this.callback.bind(this) })}>
                            //     <View style={{ width: 5 }} />
                            //     <Text style={styles.normalsize}>手机号码</Text>
                            //     <Text style={{ color: '#999', position: 'absolute', right: 30 }} >{this.state.phone}</Text>
                            //     <VectorIcon name={'chevron-right'} style={{ position: 'absolute', right: 10 }} />
                            // </TouchableOpacity>
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


                                {this.props.identity == 'student' ? null : <View style={{
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
                                </View>}

                            </View>
                        }


                        <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => Actions.ChangePassword()}>
                            <View style={styles.bodyView}>
                                {/* <VectorIcon key={1} name={'android-lock'} style={styles.iconStart} /> */}
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>修改密码</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ height: 20, backgroundColor: "#e5e5e5", flex: 1 }} />

                        {/* <TouchableOpacity onPress={() => Actions.GestureOpenFragment()}>
                            <View style={styles.bodyView}>
                                <VectorIcon key={1} name={'gesture'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>手势密码</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity> */}
                        {/* <TouchableOpacity onPress={() => alert('开发中，敬请期待')}>
                            <View style={styles.bodyView}>
                                <VectorIcon key={1} name={'c2_im_weixin_voice'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>声音锁</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => alert('开发中，敬请期待')}>
                            <View style={styles.bodyView} >
                                <VectorIcon key={1} name={'face'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>面部识别</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity>
                        <View style={{ height: 20, backgroundColor: "#e5e5e5", flex: 1 }} />

                        <TouchableOpacity onPress={() => this.setState({ bjsz: !this.state.bjsz })}>
                            <View style={styles.bodyView}>
                                <VectorIcon key={1} name={'flag'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>首选登录模式设置</Text>
                                <Text style={{ color: Config.C2NavigationBarTintColor, fontSize: 14, position: 'absolute', right: 30, }}>{this.state.bjszDesc}</Text>
                                {(this.state.bjsz) ? <VectorIcon key={2} name={'chevron-left'} style={styles.iconEnd} /> : <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />}
                            </View>
                        </TouchableOpacity> */}
                        {/* {(this.state.bjsz) ?
                            this.showBjsz()
                            :
                            null} */}
                    </View>
                </ScrollView>
            </ScrollView >
        )
    }
    callback(rowData) {
        // debugger
        if (rowData.userName == undefined) {
            this.setState({
                phone: rowData.phone,
            })
        } else {
            this.setState({
                userName: rowData.userName,
            })
        }

    }
    showBjsz() {//首选登录模式设置
        return (
            <View >
                <List style={{ marginTop: 0, backgroundColor: '#e5e5e5', }}>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 1}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ bjszNum: 1, bjszDesc: "自动登录" });
                                Global.saveWithKeyValue('loginSettingChoose', "auto");
                                Actions.pop()
                            }
                        }}>自动登录</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 2}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ bjszNum: 2, bjszDesc: "手势密码" });
                                Global.saveWithKeyValue('loginSettingChoose', "gesture");
                                Actions.pop()
                            }
                        }}>手势密码</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 3}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ bjszNum: 3, bjszDesc: "声音锁" });
                                Global.saveWithKeyValue('loginSettingChoose', "voice");
                                Actions.pop()
                            }
                        }}>声音锁</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 4}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ bjszNum: 4, bjszDesc: "面部识别" });
                                Global.saveWithKeyValue('loginSettingChoose', "face");
                                Actions.pop()
                            }
                        }}>面部识别</RadioItem>

                </List>
            </View >
        );
    }
    outLogin() {
        SSOAuth.logout();
        Actions.pop();
    }

}
let styles = StyleSheet.create({

    main_view: {
        flex: 1,
        backgroundColor: '#e5e5e5',
    },
    bgImg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 5,
        alignItems: 'center',
        justifyContent: "center",

    },
    normalsize: {
        color: "#222222",
        fontSize: Config.MainFontSize
    },
    information: {
        color: "#fff",
        textAlign: 'center',
        backgroundColor: "#f8706d",
        borderWidth: 1,
        borderColor: "#fff",
        width: 18,
        height: 18,
        lineHeight: 18,
        borderRadius: 18,
        position: 'absolute',
        top: -5,
        right: -5,
    },
    topImg: {
        width: 60,
        height: 60,
    },
    bodyView: {
        paddingHorizontal: 20,
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 50,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    bdText: {
        color: "#222222",
        fontSize: Config.MainFontSize,
    },
    iconStart: {
        fontSize: 18,
        marginRight: 10,
    },
    iconEnd: {
        color: 'grey',
        fontSize: 14,
        position: 'absolute',
        right: 10,
    },
    out_body: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Config.C2NavigationBarTintColor,
        width: Dimensions.get('window').width / 1.5,
        height: 36,
        marginTop: 10,
        borderRadius: 30,
        justifyContent: 'center'
    },
    out_view: {
        flex: 1,
        textAlign: 'center',

    },
});