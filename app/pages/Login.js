import React, { Component } from 'react';
import { ImageBackground, Text, View, Dimensions, PixelRatio, PermissionsAndroid, TouchableHighlight, StyleSheet, Modal, Platform, TouchableWithoutFeedback, TouchableOpacity, Image, Alert, TextInput, Keyboard, ScrollView, ListView } from 'react-native';
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
import { QySwiper } from 'qysyb-mobile';
import Toasts from 'react-native-root-toast';
let password = ''; //密码
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import PushUtils from '../utils/PushUtils';
Object.assign(Text.defaultProps, { allowFontScaling: false });
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            loading: true,
            isGesture: false,
            message: '',
            modalVisible: false,
            isFingerPrint: false,
            status: 'normal',
            isLock: false,
            showChangeButton: false,
            showFirstPic: false,//轮播引导页
            changeLogin_click: false,
            selected: true,
            showWelcome: true,//欢迎页
            showTheme: false,
            theme: '1',
            showIdentity: false,
            showIdentityDl: false,
            identity: '',
            identityDl: '',
            showWord: false,
            showsure: true,

        }
        this.onLogin = (this.props.type == 'reset') ? null : this._onLogin.bind(this);

        var th = this;
        var i = 0;

        Global.getValueForKey('themePick').then((ret) => {
            if (ret) {
                //星空=1，科技=2， 海洋=3， 办公=4
                if (ret == '1') {
                    Config.C2NavigationBarTintColor = 'rgb(42,51,91)',
                        Config.SettingBackgroundImg = require('../image/xingkong.jpg');
                }
                if (ret == '2') {
                    Config.C2NavigationBarTintColor = 'rgb(29,29,29)'
                    Config.SettingBackgroundImg = require('../image/bg4.png');
                }
                if (ret == '3') {
                    Config.C2NavigationBarTintColor = 'rgb(31,164,240)'
                    Config.SettingBackgroundImg = require('../image/haiyang.png');
                }
                if (ret == '4') {
                    Config.C2NavigationBarTintColor = 'rgb(52,121,228)'
                    Config.SettingBackgroundImg = require('../image/bangong.png');
                }
                this.setState({ theme: ret })
            } else {
                var theme = this.state.theme;
                Global.saveWithKeyValue('themePick', theme);
                Config.SettingBackgroundImg = require('../image/xingkong.jpg');
                this.setState({
                    theme: theme
                })
            }
        })
        Global.getValueForKey('firstLogin').then((ret5) => {
            if (ret5 == null) {
                th.setState({
                    showWelcome: false,
                    showFirstPic: true
                });
                return;
            }
            if (ret5.key) {
                th.setState({
                    key: ret5.key,
                    showWelcome: true,
                    // showIdentity: true,
                })
            } else {
                var key = UUID.v4();
                Global.saveWithKeyValue('firstLogin', { key: key });
                th.setState({
                    key: key.key,
                    showWelcome: false,
                    // showIdentity: true,
                    showFirstPic: true
                });
            }
        })

        Global.getValueForKey('loginInformation').then((ret) => {
            if (ret == null) {
                return
            }
            if (ret.passWord) {
                Global.getValueForKey('ifRemberPassword').then((ret11) => {
                    if (ret11) {
                        if (ret11.rember == false) {
                            th.setState({
                                selected: false,
                            })
                            this.userName = ret.userName;
                            this.passWord = '';
                        } else {
                            this.userName = ret.userName;
                            this.passWord = ret.passWord;
                            th.setState({
                                selected: true,
                            })
                        }
                    }
                })
                th.setState({
                    loading: false
                })

                Global.getValueForKey('finger').then((ret1) => {
                    if (ret1 == 'openfinger') {
                        th.setState({
                            modalVisible: true,
                            isFingerPrint: true,
                            showChangeButton: true,
                            isLock: true,
                            showFirstPic: false
                        })
                        FingerprintLock.getFingerprintLock().then((response) => {
                            if (response == "解锁成功" && this.props.type != 'reset') {
                                this.setModalVisible(false);
                                this._onLogin();
                            } else if (response == "取消按钮") {
                                this.password = '';
                            } else {
                                this.password = '';
                            }
                        })
                    } else {
                        Global.getValueForKey('gestureOpen').then((ret3) => {
                            if (!ret3 && this.props.type != 'reset') {
                                this._onLogin();
                            } else if (ret3.gestureOpen == true) {
                                Global.getValueForKey('gesture').then((ret2) => {
                                    password = ret2.gesture;
                                    th.setState({
                                        showChangeButton: true,
                                        isLock: true,
                                        showFirstPic: false,
                                        isGesture: true,
                                        status: 'normal',
                                        message: '请输入你的手势密码!'
                                    })
                                })

                            } else {
                                if (this.props.type != 'reset') {
                                    this._onLogin();
                                }
                            }
                        })

                    }
                })
            } else {
                this.userName = '';
                this.password = '';
                th.setState({
                    selected: true
                })
                Global.saveWithKeyValue('ifRemberPassword', { rember: true })
                this.timer = setTimeout(
                    () => {
                        th.setState({
                            showWelcome: false,
                            showIdentity: false,
                            showFirstPic: true
                        })
                    },
                    1000
                );

            }
        });
        this.openQuanxian()
    }

    openQuanxian() {
        // debugger
        // 多个权限获取会造成卡顿问题
        if (Platform.OS == 'android') {
            var write = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            PermissionsAndroid.check(write).then(granted => {//存储权限，安装时自动允许
                if (granted) {
                } else {
                    PermissionsAndroid.request(
                        write,
                    ).then(() => {
                        var permissionACCESS_FINE_LOCATION = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
                        PermissionsAndroid.check(permissionACCESS_FINE_LOCATION).then(granted => {//位置权限
                            if (granted) {//已允许
                            } else {
                                PermissionsAndroid.request(
                                    permissionACCESS_FINE_LOCATION,
                                ).then(shouldShow => {

                                });
                            }
                        })
                    });
                }
            })
            // var permissionCAMERA = PermissionsAndroid.PERMISSIONS.CAMERA;
            // PermissionsAndroid.check(permissionCAMERA).then(granted => {//拍照权限
            //     if (granted) {//已允许
            //     } else {
            //         PermissionsAndroid.request(
            //             permissionCAMERA,
            //         ).then(shouldShow => {

            //         });
            //     }
            // })

            // var permissionRECORD_AUDIO = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
            // PermissionsAndroid.check(permissionRECORD_AUDIO).then(granted => {//录音权限
            //     if (granted) {//已允许
            //     } else {
            //         PermissionsAndroid.request(
            //             permissionRECORD_AUDIO,
            //         ).then(shouldShow => {
            //             debugger
            //             //shouldShow  返回  denied（拒绝） granted（允许）never_ask_again（禁止后不再询问）
            //         });
            //     }
            // })

            // var permissionRECORD_VIDEO = PermissionsAndroid.PERMISSIONS.RECORD_VIDEO;
            // PermissionsAndroid.check(permissionRECORD_VIDEO).then(granted => {//录视频权限
            //     if (granted) {
            //     } else {
            //         PermissionsAndroid.request(
            //             permissionRECORD_VIDEO,
            //         ).then(shouldShow => {

            //         });
            //     }
            // })
        }

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
        Global.getValueForKey('loginInformation').then((ret) => {
            if (ret) {
                this.userName = ret.userName;
                this.password = ret.passWord;
                this.setState({
                    loading: false
                })
            }
        })
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.setState = (state, callback) => {
            return;
        };
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    loading() {
        return (
            <View style={styles.editGroup}>
                <TouchableWithoutFeedback  >
                    <View style={styles.editView1}>
                        <View style={{ flexDirection: "column" }}>
                            {/* {<VectorIcon
                                name="mobile_phone"
                                size={36}   //图片大小
                                color='black'  //图片颜色

                                style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 3 }}
                            />} */}
                            <Text style={{ color: '#333', fontSize: Config.MainFontSize + 5, fontFamily: 'PingFang SC', marginTop: 6, marginLeft: 10, fontWeight: '500' }}>
                                手机号
                            </Text>
                            {/* <View style={styles.editView2}> */}
                            {<TextInput
                                style={styles.edit}
                                placeholder={(this.userName) ? this.userName : '请输入您的手机号'}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#c4c4c4"
                                // placeholder={ fontSize:Config.MainFontSize }
                                autoCapitalize={'none'}
                                clearButtonMode={"always"}
                                autoCorrect={true}
                                paddingLeft={10}
                                maxLength={20}
                                onChangeText={(text) => {
                                    this.userName = text, this.setState({
                                        showChangeButton: false
                                    })
                                }}
                            />}
                            {/* </View> */}
                        </View>
                    </View>

                </TouchableWithoutFeedback>
                <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#E4E4E4', width: theme.screenWidth - 70, alignSelf: 'center' }} />
                <TouchableWithoutFeedback  >
                    <View style={styles.editView1}>
                        <View style={{ flexDirection: "column" }}>
                            {/* {<VectorIcon
                                name="c2_im_weixin_keyboard"
                                size={26}   //图片大小
                                color='black'  //图片颜色
                                style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 3 }}
                            />} */}
                            <Text style={{ color: '#333', fontSize: Config.MainFontSize + 5, fontFamily: 'PingFang SC', marginTop: 6, marginLeft: 10, fontWeight: '500' }}>
                                密码
                            </Text>
                            {/* <View style={styles.editView2}> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {<TextInput
                                    style={{
                                        backgroundColor: 'transparent',
                                        opacity: 0.8,
                                        height: px2dp(42),
                                        fontSize: Config.MainFontSize + 3,
                                        paddingLeft: px2dp(0),
                                        paddingRight: px2dp(100),
                                        color: 'black',
                                        borderRadius: 18,
                                        width: (theme.screenWidth - 70 - 24),
                                    }}
                                    underlineColorAndroid="transparent"
                                    clearButtonMode={"always"}
                                    placeholder="请输入您的密码"
                                    secureTextEntry={!this.state.showWord}
                                    paddingLeft={10}
                                    placeholderTextColor="#c4c4c4"
                                    onChangeText={(text) => { this.password = text }}
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
                            {/* </View> */}
                        </View>
                    </View>

                </TouchableWithoutFeedback>
                <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#E4E4E4', width: theme.screenWidth - 70, alignSelf: 'center' }} />

            </View>
        )
    }

    //debugger
    _onLogin() {
        if (this.state.showsure == false) {
            Toast.showInfo('请您阅读并同意相关协议之后再进行登录!', 3000);
        } else {
            Toast.show({
                type: Toast.mode.C2MobileToastLoading,
                title: '登录中...'
            });
            var entity1 = {
                userName: this.userName,
            }
            Fetch.postJson(Config.mainUrl + '/ws/checkRegInfo', entity1)
                .then((res) => {
                    Toast.dismiss();
                    if (res.result.userName == undefined) {
                        Alert.alert('提示', "用户名或者密码错误,请重新输入", [{ text: '取消' },]);
                        return;
                    } else {

                        let loginParams = {
                            params: {
                                userName: res.result.userName,
                                passWord: this.password,
                            }
                        }
                        //此处加入登录接口
                        EncryptionUtils.fillEncodeData(loginParams);
                        PcInterface.login(loginParams, (set) => {
                            // var set = { "result": { "rcode": "1", "rdata": { "loginOrgInfo": { "creatingTime": 1520994422000, "creator": "1", "isDirectguanhu": 0, "isDirectlyparty": 0, "isForeignparty": 0, "isJichaparty": 0, "orgId": "42D6A4CED2DF4E4DAC487AF43F8FFCD6", "orgLevel": "2", "orgName": "欢瑞世纪影视传媒财务部", "orgNumber": "hrsjyscmcwb", "orgShowName": "财务部", "orgSn": 0, "orgXzqm": "000000", "parentId": "47CFDBC53D3E49489A1A06592F8E5ED3" }, "loginUserInfo": { "lastloginDate": 1541043738000, "loginIp": "172.16.81.163", "politics": "群众", "remark1": "file:///Users/wuqin/Library/Developer/CoreSimulator/Devices/D698BCB3-B0FE-4C24-96FC-C5B48D48CDA4/data/Containers/Data/Application/0E45ABBC-E881-4FC4-9264-611520A2E877/Library/Caches/image/BF6C32B2-3013-459D-A85B-DD34C541CE8C.jpg", "userAddress": "13212123", "userEmail": "122673456@qq.com", "userFax": "", "userHometel": "4645646", "userId": "8AFEC1BA776E411690310C4FC27690C5", "userIdcard": "430381196314126654", "userIsvalid": 2, "userLogincount": 3735, "userMobiletel1": "15717327380", "userName": "jeffery", "userOicq": "1212312313", "userPinyin": "", "userRealname": "管理员", "userRegdate": 1529545852000, "userSex": "-1", "userSn": 999, "userType": "0", "userWorktel": "15764988004" } }, "rmsg": "操作成功！" } }
                            // cancelable.cancel();
                            if (loginParams.params.userName == '') {
                                Alert.alert('', "请输入账号!", [{ text: '取消' },]);
                                return;
                            }
                            if (loginParams.params.passWord == '') {
                                Alert.alert('', "请输入密码!", [{ text: '取消' },]);
                                return;
                            }
                            if (set.result.rcode == 0) {
                                // Alert.alert("提示", set.result.rmsg
                                Alert.alert("提示", '用户名或者密码错误,请重新输入'
                                    , [
                                        {
                                            text: "确定", onPress: () => {
                                                console.log("确定");
                                            }
                                        }
                                    ])
                                return;
                            }
                            else {
                                //debugger
                                if (set.result.rcode == 1) {
                                    //debugger
                                    let rawData = {
                                        userInfo: loginParams,
                                        loginSet: set
                                    }
                                    if (set.result.rdata.loginUserInfo.remark5 == '0') {
                                        Alert.alert("提示", '您的登录权限已被禁用！'
                                            , [
                                                {
                                                    text: "确定", onPress: () => {
                                                        console.log("确定");
                                                    }
                                                }
                                            ])
                                        return;
                                    } else {
                                        var entity2 = {
                                            username: set.result.rdata.loginUserInfo.userName
                                        }
                                        Fetch.postJson(Config.mainUrl + '/v1/mobile/userlogin', entity2)
                                            .then((res) => {
                                                //debugger
                                                Global.saveWithKeyValue('tokenValue', { token: res.token });
                                            })

                                        Global.getValueForKey('firstLogin').then(() => {
                                            Global.saveWithKeyValue('firstLogin', { key: UUID.v4() });
                                        })
                                        PushUtils.registerC2Push();
                                        UserInfo.initUserInfoWithDict(rawData);
                                        Global.saveWithKeyValue('loginInformation', loginParams.params);
                                        var entity = {
                                            userName: this.userName,
                                            userPassword: this.password,
                                        }
                                        Fetch.postJson(Config.mainUrl + '/accountRegist/checkIdentity', entity)
                                            .then((res) => {
                                                Fetch.getJson(Config.mainUrl + '/ws/checkRole')
                                                    .then((source) => {
                                                        console.log(source)
                                                        if (source[0].creator == true || source[0].supervise == true || source[0].serviceQykf == true || source[0].kefu == true || source[0].caiwu == true || source[0].service == true) {
                                                            Toast.showInfo('平台账号请前往pc端进行登录！', 3000);
                                                        } else {
                                                            if (res == '0') {
                                                                Actions.TabBar({ type: 'replace', identity: 'boss' })
                                                            } else if (res == '-1') {
                                                                Actions.TabBar({ type: 'replace', identity: 'platform' })
                                                            }
                                                            else {
                                                                Actions.TabBar({ type: 'replace', identity: 'student' })
                                                            }
                                                        }
                                                    })
                                            })
                                        return;
                                    }

                                } else {
                                    Alert.alert("提示", '用户名或者密码错误,请重新输入'
                                        // set.result.rmsg
                                        , [
                                            {
                                                text: "确定", onPress: () => {
                                                    console.log("确定");
                                                }
                                            }
                                        ])
                                    return;
                                }
                            }
                        })

                    }
                })
        }

        // const somePromise = new Promise(r => setTimeout(r, 5000));//创建一个异步操作
        // const cancelable = makeCancelable(somePromise);//为异步操作添加可取消的功能
        // cancelable
        //     .promise
        //     .then(() => {
        //         let errorContent = '网络请求失败，请稍后再试！'
        //         let errorTitle = '当前网络异常！'

        //         errorContent = '服务器启动中,请稍后！'
        //         Alert.alert(errorTitle, errorContent, [{
        //             text: '确认', onPress: () => {
        //                 this.setState({
        //                     animating: false
        //                 });

        //             }
        //         },])
        //     })
        //     .catch(({ isCanceled, ...error }) => console.log('isCanceled', isCanceled));

    }
    start = () => {
        this.QyVideoRecorder.open((data) => {
            console.log('captured data', data);//这里处理录制好的视频文件，跟图片处理一致
        });
    }

    render() {
        let datePickerModal = (
            this.state.isGesture ?
                <Modal
                    transparent={true}
                    visible={this.state.isGesture}
                    onShow={() => { }}
                    onRequestClose={() => { }} >
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
                </Modal>
                : null
        );
        //欢迎页
        if (this.state.showWelcome) {//image 背景图适配出现问题，暂时用背景色结局
            return (
                <View style={{ flex: 1, width: deviceWidth, backgroundColor: "white" }}>
                    <TouchableOpacity onPress={() => this.setState({ showWelcome: false, showFirstPic: true })}>
                        <Image style={styles.imgstyle} source={require('../image/guide.jpg')}></Image>
                    </TouchableOpacity>
                </View>
            )
        } else if (this.state.showFirstPic) {
            return (
                <View style={{ flex: 1, position: "relative", backgroundColor: "white", width: deviceWidth }}>
                    <QySwiper paginationStyle={{ bottom: theme.screenHeight / 4 }}
                        autoplay autoplayTimeout={5} showsButtons activeDotColor='#D0DEFA' dotColor='#F2F2F2'
                        prevButton={
                            <TouchableOpacity style={{ backgroundColor: '#3E7EFE', width: deviceWidth / 3, height: 50, borderRadius: 5, marginRight: 40, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={this.register.bind(this)}>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: 'white' }}>我要注册</Text>
                            </TouchableOpacity>
                        }
                        nextButton={
                            <TouchableOpacity style={{ backgroundColor: '#3E7EFE', width: deviceWidth / 3, height: 50, borderRadius: 5, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.setState({ showFirstPic: false, showIdentityDl: true })}>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: 'white' }}>我要登录</Text>
                            </TouchableOpacity>
                        }
                        buttonWrapperStyle={{ position: 'absolute', bottom: 60, width: deviceWidth, height: 30, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}
                    >
                        <View>
                            <Image style={styles.imgstyle} source={require('../image/guide1.jpg')} >
                            </Image>
                        </View>
                        <View>
                            <Image style={styles.imgstyle} source={require('../image/guide2.jpg')} >
                            </Image>
                        </View>
                        <View>
                            <Image style={styles.imgstyle} source={require('../image/guide3.jpg')} >
                            </Image>
                        </View>
                    </QySwiper>
                </View >
            )
        } //选择身份
        else if (this.state.showIdentityDl) {
            return (
                <View style={{ flex: 1, width: deviceWidth, backgroundColor: '#FFFFFF', marginTop: 44 }}>
                    {/* , marginTop: (Platform.OS == 'ios') ? 80 : 60 */}
                    <TouchableOpacity onPress={() => this.setState({ showFirstPic: false, showIdentityDl: false, showWelcome: true })} style={{ height: 44, width: deviceWidth, justifyContent: 'center', }}>
                        <Image style={{ marginLeft: 20, height: 24, width: 24 }} source={require('../image/icon/icon_black.png')} >
                        </Image>
                    </TouchableOpacity>
                    <Text style={{ fontSize: Config.MainFontSize + 6, marginLeft: 20, marginTop: 20, color: '#333' }}>请选择您的身份</Text>
                    {/* marginTop:(Platform.OS == 'ios') ? 200 : 100, */}
                    <Text style={{ fontSize: Config.MainFontSize, marginTop: 10, marginLeft: 20, color: '#999999' }}>机会不会主动找你，必须亮出你自己</Text>

                    <Text style={{ fontSize: Config.MainFontSize, marginTop: 30, marginLeft: 20, color: '#666666' }}>个人登录端口</Text>
                    {/* marginTop: (Platform.OS == 'ios') ? deviceHeight / 6 : deviceHeight / 8, */}
                    <View style={{ marginTop: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                        {/* style={{ marginTop: (Platform.OS == 'ios') ? 100 : 80 }} */}
                        <TouchableOpacity onPress={() => this.setState({ showFirstPic: false, identityDl: 1, showIdentityDl: false })}  >
                            <Image style={styles.imgstyle2} source={require('../image/grdl.png')} >
                            </Image>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: Config.MainFontSize, marginTop: 30, marginLeft: 20, color: '#666666' }}>企业登录端口</Text>
                    <View style={{ marginTop: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                        <TouchableOpacity onPress={() => this.setState({ showFirstPic: false, identityDl: 0, showIdentityDl: false })}>
                            <Image style={styles.imgstyle2} source={require('../image/qydl.png')} >
                            </Image>
                            {/* <Text style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', fontSize: Config.MainFontSize + 6, marginTop: -(theme.screenWidth / 5 + 40) / 2, color: 'white', backgroundColor: 'transparent', marginLeft: 20 }}>个人注册</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else {
            // if (this.state.showIdentity) {
            //     return (
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

            if (this.state.showChangeButton) {
                return (<ScrollView>
                    <TouchableOpacity activeOpacity={1} style={styles.view} onPress={() => Keyboard.dismiss()}>
                        {datePickerModal}
                        <View style={{ width: theme.screenWidth, height: theme.screenHeight, backgroundColor: 'white' }}>
                            <ScrollView>
                                <Image source={require('../image/logo.png')} style={{ width: 40, height: 40, position: 'absolute', marginTop: theme.screenHeight / 6 - 10, marginLeft: 20 }} />
                                <Text style={{ position: 'absolute', marginTop: theme.screenHeight / 6, fontSize: Config.MainFontSize + 4, marginLeft: 80 }}>欢迎来到工薪易</Text>
                                <View style={{ alignItems: 'center', marginTop: deviceHeight / 6 + 30 }}>
                                </View>
                                <View>{this.loading()}</View>
                                <View style={{ flexDirection: 'row', marginTop: 30 }}>
                                    <TouchableOpacity style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 40 }} onPress={() => Actions.authcodeLogin()}>
                                        <Text style={{ color: 'rgb(65,143,234)' }}>验证码登录</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: 'transparent', marginLeft: theme.screenWidth / 2.2 }} onPress={this.forgetPassword.bind(this)}><Text style={{ color: '#c4c4c4' }}>忘记密码</Text></TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.out_button} onPress={() => {
                                    this._onLogin()
                                }}>
                                    <View style={{
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        backgroundColor: '#3E7EFE',
                                        width: Dimensions.get('window').width / 1.3,
                                        height: 44,
                                        marginTop: 20,
                                        borderRadius: 20,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: Config.MainFontSize,
                                            color: '#ffffff'
                                        }}>登录</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.out_button} onPress={() => {
                                    this.changeLogin_click()
                                }}>
                                    <View style={{
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                        backgroundColor: 'rgb(65,143,234)',
                                        width: Dimensions.get('window').width / 1.3,
                                        height: 44,
                                        marginTop: 30,
                                        borderRadius: 20,
                                        justifyContent: 'center'
                                    }}>
                                        <Text style={{
                                            fontSize: Config.MainFontSize,
                                            color: '#ffffff'
                                        }}>切换登录方式</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={stylesheet.phone}>
                                    <Text style={stylesheet.phoneText}>湖南科创信息股份有限公司</Text>
                                </View>

                            </ScrollView>
                        </View>
                    </TouchableOpacity></ScrollView>
                );
            } else {
                return (
                    <TouchableOpacity activeOpacity={1} style={styles.view} onPress={() => Keyboard.dismiss()} onPress={() => this.setState({ showTheme: false })}>
                        {datePickerModal}
                        <ScrollView>
                            <View style={{ width: deviceWidth, backgroundColor: '#3E7EFE', height: 210 }}>
                                <Text style={{ position: 'absolute', marginTop: 80, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>{this.state.identityDl == 0 ? '您好，企业登录！' : '您好，个人登录！'}</Text>
                                <Text style={{ position: 'absolute', marginTop: 118, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>欢迎来到工薪易</Text>
                                <Image source={require('../image/dllogo.png')} style={{ width: 211, height: 211, position: 'absolute', right: -40 }} />
                            </View>
                            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20 }}>{this.loading()}</View>
                            <View style={{ display: 'flex', flexDirection: 'row', width: theme.screenWidth - 70, marginLeft: 35, marginTop: -10, justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={() => Actions.authcodeLogin()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: '#999', fontWeight: '500' }}>短信验证码登录</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => Actions.ForgetPassword()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: '#999', fontWeight: '500' }}>忘记密码？</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.out_button} onPress={() => {
                                this._onLogin()
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#3E7EFE',
                                    width: Dimensions.get('window').width / 1.3,
                                    height: 52,
                                    marginTop: 25,
                                    borderRadius: 30,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize + 2,
                                        color: '#ffffff',
                                        fontWeight: '600'
                                    }}>登录</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.out_button} onPress={this.register.bind(this)}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#f5f6fa',
                                    width: Dimensions.get('window').width / 1.3,
                                    height: 52,
                                    marginTop: 20,
                                    borderRadius: 30,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize + 2,
                                        color: '#333',
                                        fontWeight: '600'
                                    }}>注册</Text>
                                </View>
                            </TouchableOpacity>
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
                            {/* <View style={stylesheet.phone}>
                                <Text style={stylesheet.phoneText}>湖南科创信息股份有限公司</Text>
                            </View> */}
                        </ScrollView>
                    </TouchableOpacity>
                );
            }
        }
    }

    //忘记密码
    forgetPassword() {
        Actions.ForgetPassword()
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
                            {/* <View style={{ width: theme.screenWidth, height: theme.screenHeight, backgroundColor: 'rgba(0,0,0,0.5)' }}> */}
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
                            {/* </View> */}
                        </TouchableOpacity>
                    </Modal>
                </View>

            )
        } else return null
    }
    changeLogin_click() {
        Global.getValueForKey('loginInformation').then((ret) => {
            this.password = ret.passWord;
        })
        if (this.state.isFingerPrint) {
            if (Platform.OS == 'android') {
                this.setState({
                    modalVisible: true,
                })
            } else if (Platform.OS == 'ios') {
                FingerprintLock.getFingerprintLock().then((response) => {
                    if (response == "解锁成功") {
                        this.setModalVisible(false);
                        this._onLogin();
                    } else if (response == "取消按钮") {
                        this.password = '';
                    }
                })
            }
        } else if (this.state.isLock) {
            this.setState({
                isGesture: true,
                status: 'normal',
                message: '请输入你的手势密码!'
            })
        }
        else {
            Alert.alert('', "尚未开启其他登录方式!", [{ text: '取消' },]);
            return;
        }
    }


    onStart() {
        // console.log('onStart');
        // this.setState({
        //     status: 'normal',
        //     message: '请输入你的密码!'
        // });
    }

    chageLogin() {
        this.password = '';
        this.setState({
            isGesture: false
        })
    }
    _renderChilder() {
        return (
            <TouchableOpacity style={{ position: 'absolute', bottom: px2dp(24), right: px2dp(16) }}
                onPress={this.chageLogin.bind(this)}>
                <Text style={{ color: '#fff' }}>切换登录</Text>
            </TouchableOpacity>

        );
    }

}
function makeCancelable(promise) {
    let hasCanceled_ = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) =>
            hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
        );
        promise.catch((error) =>
            hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
        );
    });

    return {
        promise: wrappedPromise,
        cancel() {
            hasCanceled_ = true;
        },
    };
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        width: deviceWidth,
        backgroundColor: 'white'
    },
    editView2: {
        flex: 1,
        height: px2dp(48),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginLeft: 10,
        marginTop: 10

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
        height: (Platform.OS === 'ios') ? theme.screenWidth / 5 + 30 : theme.screenWidth / 4 + 40,
        width: (Platform.OS === 'ios') ? theme.screenWidth - 20 : theme.screenWidth - 10,
        alignContent: 'center',
        alignItems: 'center',
        // borderBottomLeftRadius: 30,
        // borderBottomRightRadius: 30,
        // borderTopLeftRadius: 30,
        // borderTopRightRadius: 30,
        alignSelf: 'center',
    },
    imgstyle2: {
        height: theme.screenWidth / 5 + 30,
        width: theme.screenWidth - 40,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8
    },
    actionBar: {
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    edit: {
        backgroundColor: 'transparent',
        opacity: 0.8,
        height: px2dp(42),
        fontSize: Config.MainFontSize + 3,
        paddingLeft: px2dp(0),
        paddingRight: px2dp(100),
        color: 'black',
        borderRadius: 18,
        width: theme.screenWidth - 70,
    },
    editView1: {
        // height: px2dp(48),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginTop: (Platform.OS == 'ios') ? 20 : 5,
        // marginBottom: (Platform.OS == 'ios') ? 0 : 10
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
    },
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        flex: 1,
    }
});