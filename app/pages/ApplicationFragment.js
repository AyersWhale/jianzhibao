/**
 * 设置模块
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import {
    Text, View, StyleSheet, ScrollView, Dimensions, Image, Alert, TouchableOpacity, ImageBackground, Platform, BackHandler, StatusBar,DeviceEventEmitter
} from 'react-native';

import { Fetch, Config, Actions, Cookies, SSOAuth, VectorIcon, UserInfo, SafeArea, UUID } from 'c2-mobile';
import Global from '../utils/GlobalStorage';
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;

export default class ApplicationFragment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: UserInfo.loginSet.result.rdata.loginUserInfo.remark1,
            userInfo: UserInfo.loginSet.result.rdata.loginUserInfo,
            jianliUpdate: true,
            idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
            idcardUpdate: true,
            userName: '',
            passWord: '',
            checkStatu: '',
            checkQyStatu: '',
            Tximg: ''
        }
        this.markSure()
        this.checkYYZZ()
        this.checkQYZZ()
        this.checkTx()
    }

    checkTx() {
        // debugger
        var entity = {
            // businessType: 'GR_TX',
            userId: this.state.userInfo.userId
        }
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/checkUploadTX', entity)
            .then((res) => {
                this.setState({
                    Tximg: Config.mainUrl + "/iframefile/qybdirprocess/" + res[0].filePath
                })
                console.warn('头像返回：' + JSON.stringify(res))
            })
    }
    //检查个人是否上传营业执照
    checkYYZZ() {
        if (this.props.identity == 'student') {
            Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
                .then((res) => {
                    if (res == undefined) {
                        this.setState({ checkStatu: '' })
                    } else {
                        this.setState({ checkStatu: res.status })
                    }

                })
        } else {
            var entity = {
                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
            }
            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
                .then((res) => {
                    this.setState({
                        checkQyStatu: res.hrEmailPassword,
                        checkQyStatus: res.remark1 == '2' ? true : false
                    })
                })
        }
    }

    //检查企业是否上传营业执照
    checkQYZZ() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        if (this.props.identity == 'boss') {
            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
                .then((res) => {
                    this.setState({ checkQyStatu: res.hrEmailPassword })
                })
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
        this.subscription1 = DeviceEventEmitter.addListener('Tx', (text) => {
            this.checkTx()
        })
    }

    componentWillReceiveProps(nextProps) {
        this.checkYYZZ()
        this.checkQYZZ()
        this.markSure()
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
        this.subscription1.remove();
    }
    markSure() {
        //debugger
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/checkUserIdCard', entity)
            .then((res) => {
                //debugger
                if (res.rcode == 0) {//未填写身份证信息
                    // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                    this.setState({
                        idcardUpdate: false,
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1
                    })
                } else {
                    Fetch.postJson(Config.mainUrl + '/basicResume/checkBasicResume', entity)
                        .then((res) => {
                            if (res.rcode == 0) {//未填写简历
                                // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                this.setState({
                                    idcardUpdate: true,
                                    jianliUpdate: false,
                                    userName: UserInfo.loginSet.result.rdata.loginUserInfo.userName,
                                    userRealname: UserInfo.loginSet.result.rdata.loginUserInfo.userRealname,
                                    passWord: UserInfo.userInfo.params.passWord,
                                    login: 1,
                                    userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                                    telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1,
                                    idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
                                    // sex: UserInfo.loginSet.result.rdata.loginUserInfo.userSex=='1'?'男':'女'
                                })
                            } else {
                                this.setState({
                                    jianliUpdate: true,
                                })
                            }
                        })
                }
            })
    }

    myJianli() {
        var that = this

        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/checkUserIdCard', entity)
            .then((res) => {
                //debugger
                var idcardUpdate = ''
                if (res.rcode == 0) {//未填写身份证信息
                    // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                    idcardUpdate = false
                    that.setState({
                        idcardUpdate: false,
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1
                    })
                } else {
                    idcardUpdate = true
                }
                if (idcardUpdate == false) {
                    Actions.IdCard({ update: true, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 });
                } else {
                    Actions.Jianli({ update: true, userName: this.state.userName, userRealname: this.state.userRealname, passWord: this.state.passWord, login: 1, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1, idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })

                }
            })
        console.log(UUID)

    }
    accountMge() {
        Actions.AccountMge()
    }
    _Cookies() {
        Cookies.removeAllCookies()
            .then((result) => {
            })
    }

    render() {
        return (
            <View style={(this.props.theme == '1') ? styles.main_view1 : styles.main_view}>
                <StatusBar
                    barStyle={'dark-content'} // enum('default', 'light-content', 'dark-content') 
                />

                {/* <ImageBackground source={Config.SettingBackgroundImg} style={{ width: deviceWidth, height: 60 + SafeArea.top }}>
                    {(this.props.theme == undefined) ? null : <TouchableOpacity onPress={() => Actxxxxxxxxxxxxxxxxxxxxxxxxxxxions.pop()} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15, width: 100, height: 50 }} />
                    </TouchableOpacity>}
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>我的</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: 30 + SafeArea.top, backgroundColor: '#fff', alignSelf: 'center' }}>
                    {/* <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>我的收入</Text>
                    </View> */}
                </View>

                <TouchableOpacity style={{ width: deviceWidth, flexDirection: 'row', backgroundColor: '#fff' }} onPress={() => Actions.UserInfoView({ identity: this.props.identity })}>

                    <View style={{ justifyContent: "space-between", flexDirection: 'row', marginTop: 16, marginBottom: 12, alignItems: 'center', width: deviceWidth - 40, marginLeft: 20, }}>
                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                            {this.state.Tximg == '' ? <Image source={require('../image/center_header_img150x150.png')} style={{ width: 80, height: 80, borderRadius: 40 }} />
                                : <Image source={{ uri: this.state.Tximg }} style={{ width: 80, height: 80, borderRadius: 40 }} />}
                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                <Text style={{ fontSize: Config.MainFontSize + 7, color: '#333', fontWeight: 'PingFang SC', fontWeight: '500' }} >{UserInfo.loginSet.result.rdata.loginUserInfo.userName}</Text>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#999', fontWeight: 'PingFang SC', fontWeight: '500', marginTop: 5 }}>{'电话号：' + UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1}</Text>
                            </View>
                        </View>
                        <VectorIcon key={2} name={'chevron-right'} style={{
                            // marginRight: 20,
                            color: '#B3B3B3',
                            fontSize: 14,
                        }} />

                    </View>

                </TouchableOpacity>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <View >
                        {/* {this.props.identity == 'student' ?
                            // <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => Actions.UserInfoView({ identity: this.props.identity })}>
                            //     <View style={styles.bodyView}>
                            //         <VectorIcon key={1} name={'portrait'} style={styles.iconStart} />
                            //         <View style={{ width: 5 }} />
                            //         <Text style={styles.bdText}>我的信息</Text>
                            //         <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            //         {this.state.checkStatu != '3' ?
                            //             <Text style={{ position: 'absolute', right: 40, color: 'red' }}>电子营业执照</Text> : <Text style={{ position: 'absolute', right: 40, color: 'green' }}>已注册电子营业执照</Text>}
                            //     </View>
                            // </TouchableOpacity>
                            null
                            :
                            this.props.identity == 'platform' ?
                                <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => Actions.UserInfoView({ identity: this.props.identity })}>
                                    <View style={styles.bodyView}>
                                        <VectorIcon key={1} name={'portrait'} style={styles.iconStart} />
                                        <View style={{ width: 5 }} />
                                        <Text style={styles.bdText}>我的信息</Text>
                                        <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                                    </View>
                                </TouchableOpacity> :
                                <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => Actions.UserInfoView({ identity: this.props.identity })}>
                                    <View style={styles.bodyView}>
                                        <VectorIcon key={1} name={'portrait'} style={styles.iconStart} />
                                        <View style={{ width: 5 }} />
                                        <Text style={styles.bdText}>我的信息</Text>
                                        <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                                        {this.state.checkQyStatu != '3' ?
                                            <Text style={{ position: 'absolute', right: 40, color: 'red' }}>实名认证</Text> : <Text style={{ position: 'absolute', right: 40, color: 'green' }}>认证成功</Text>}
                                    </View>
                                </TouchableOpacity>} */}

                        {this.props.identity == 'boss' || this.props.identity == 'platform' ? null :
                            <View>
                                <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 7 }} onPress={this.myJianli.bind(this)}>
                                    <View style={styles.bodyView}>
                                        {/* <VectorIcon key={1} name={'folder_close'} style={styles.iconStart} /> */}
                                        {/* <Image source={require('../image/WDJL.png')} style={{ marginRight: 10, width: 15, height: 15 }}></Image> */}
                                        <View style={{ width: 5 }} />
                                        <Text style={styles.bdText}>我的简历</Text>
                                        <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 7 }} onPress={this.accountMge.bind(this)}>
                                    <View style={styles.bodyView}>
                                        {/* <VectorIcon key={1} name={'account_balance_wallet'} style={styles.iconStart} /> */}
                                        {/* <Image source={require('../image/YHK.png')} style={{ marginRight: 10, width: 15, height: 15 }} ></Image> */}
                                        <View style={{ width: 5 }} />
                                        <Text style={styles.bdText}>银行卡信息</Text>
                                        <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                                    </View>
                                </TouchableOpacity>
                            </View>}

                        {/* {this.props.identity == 'boss' || this.props.identity == 'platform' ? null : <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={this.apply.bind(this)}>
                            <View style={styles.bodyView}>
                                <VectorIcon key={1} name={'credit_card'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>发票申请</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity>} */}
                        {/* <View style={{ height: 10, backgroundColor: "#e5e5e5", flex: 1 }} /> */}
                        {/* <View style={{ height: 1, backgroundColor: "#e5e5e5", flex: 1 }} />
                        <TouchableOpacity onPress={() => Actions.LoginSettings({ identity: this.props.identity })}>
                            <View style={styles.bodyView}>
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>个人信息</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity> */}

                        {/* <View style={{ height: 10, backgroundColor: "#e5e5e5", flex: 1 }} /> */}
                        <View style={{ height: 1, backgroundColor: "#e5e5e5", flex: 1 }} />
                        {this.props.identity == 'student' ? <TouchableOpacity onPress={() => {
                            var entity = {
                                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                            }
                            Fetch.postJson(Config.mainUrl + '/basicResume/checkUserIdCard', entity)
                                .then((res) => {
                                    if (res.rcode == 0) {//未填写身份证信息
                                        Alert.alert("提示", "请先填写身份证信息"
                                            , [
                                                {
                                                    text: "返回", onPress: () => {
                                                        Actions.pop()
                                                    }
                                                }, {
                                                    text: "填写身份证信息", onPress: () => {
                                                        Actions.IdCard({ update: true, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 });
                                                    }
                                                },
                                            ])
                                    } else {

                                        Fetch.postJson(Config.mainUrl + '/basicResume/checkBasicResume', entity)
                                            .then((res) => {
                                                if (res.rcode == 0) {//未填写简历
                                                    // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                                    Alert.alert("提示", "请先完善简历"
                                                        , [
                                                            {
                                                                text: "返回", onPress: () => {
                                                                    Actions.pop()
                                                                }
                                                            }, {
                                                                text: "完善简历", onPress: () => {
                                                                    Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1, idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                                                }
                                                            },
                                                        ])
                                                } else {
                                                    Actions.PersonalAudit({ checkStatu: this.state.checkStatu })
                                                }
                                            })
                                    }
                                })
                        }
                        }>
                            <View style={styles.bodyView}>
                                {/* <Image source={require('../image/DZYYZZ.png')} style={{ marginRight: 10, width: 15, height: 15, color: '#333' }} ></Image> */}
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>电子营业执照</Text>

                                {this.state.checkStatu == '1' ?
                                    <Text style={{ color: 'orange', position: 'absolute', right: 40 }} >审核中</Text> :
                                    this.state.checkStatu == '2' ?
                                        <Text style={{ color: 'red', position: 'absolute', right: 40 }} >审核失败</Text>
                                        : this.state.checkStatu == '3' ?
                                            <Text style={{ color: 'green', position: 'absolute', right: 40 }} >审核通过</Text>
                                            : null
                                }
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity> : null}

                        <View style={{ height: 7, backgroundColor: "#e5e5e5", flex: 1 }} />
                        <TouchableOpacity onPress={() => Actions.About()}>
                            <View style={styles.bodyView}>
                                {/* <VectorIcon key={1} name={'ios-information'} style={styles.iconStart} /> */}
                                {/* <Image source={require('../image/GY.png')} style={{ marginRight: 10, width: 15, height: 15 }} ></Image> */}
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>关于</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => Actions.AdviceDM()}>
                        <View style={styles.bodyView} >
                            {/* <VectorIcon key={1} name={'woman'} style={styles.iconStart} /> */}
                            {/* <Image source={require('../image/BZ.png')} style={{ marginRight: 10, width: 15, height: 15 }} ></Image> */}
                            <View style={{ width: 5 }} />
                            <Text style={styles.bdText}>帮助</Text>
                            <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Actions.Advice()}>
                        <View style={styles.bodyView} >
                            {/* <VectorIcon key={1} name={'user'} style={styles.iconStart} /> */}
                            {/* <Image source={require('../image/YJFK.png')} style={{ marginRight: 10, width: 15, height: 15 }} ></Image> */}
                            <View style={{ width: 5 }} />
                            <Text style={styles.bdText}>意见与反馈</Text>
                            <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => Actions.ScanCode()}>
                        <View style={styles.bodyView} >
                            <VectorIcon key={1} name={'user'} style={styles.iconStart} />
                            <View style={{ width: 5 }} />
                            <Text style={styles.bdText}>扫一扫</Text>
                            <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.out_button} onPress={() => {
                        Global.saveWithKeyValue('gesture', {
                            gesture: '',
                        });
                        Global.saveWithKeyValue('gestureOpen', {
                            gestureOpen: false,
                        });
                        Global.saveWithKeyValue('loginInformation', { userName: this.state.userName, passWord: '' });
                        Actions.Login({ type: 'reset' });
                        let loginParams = {
                            params: {
                                // log_status: '1',
                                userName: this.state.userName,
                                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                            }
                        }
                        //此处加入登录接口
                        // EncryptionUtils.fillEncodeData(loginParams);
                        // PcInterface.logout(loginParams, (set) => {
                        //     // console.log(set)
                        // })
                        Fetch.postJson(Config.mainUrl + '/ws/logout', loginParams)
                            .then((res) => {
                                console.log(res)
                            })
                    }}>
                        <View style={{
                            marginBottom: 20,
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: '#FFF',
                            width: Dimensions.get('window').width,
                            height: 44,
                            marginTop: 13,
                            // borderRadius: 30,
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.out_text}>退出登录</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
    apply() {
        if (this.state.idcardUpdate == false) {
            Alert.alert("温馨提示", "未填写身份证信息，不可开票"
                , [
                    {
                        text: "确定", onPress: () => {
                        }
                    }, {
                        text: "去填写", onPress: () => {
                            Actions.IdCard({ update: true, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 });
                        }
                    },
                ])
            return
        }
        if (this.state.checkStatu != "3") {
            Alert.alert("温馨提示", "未注册个人电子营业执照或审核未通过，不可开票"
                , [
                    {
                        text: "确定", onPress: () => {
                        }
                    }, {
                        text: "去注册", onPress: () => {
                            Actions.PersonalAudit()
                        }
                    },
                ])
            return
        }
        Alert.alert("提示", "请选择开票类型"
            , [
                {
                    text: "专票", onPress: () => {
                        Actions.ApplyFP({ theme: '1' })
                    }
                },
                {
                    text: "普票", onPress: () => { Actions.ApplyFP({ theme: '0' }) }
                }])
    }
    outLogin() {
        SSOAuth.logout();
        Actions.pop();
    }

    showOut() {
        if (this.props.isLogin) {
            return <TouchableOpacity style={styles.out_button} onPress={() => this.outLogin()}>
                <View style={{
                    marginBottom: 60,
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: Config.C2NavigationBarTintColor,
                    width: Dimensions.get('window').width / 1.5,
                    height: 36,
                    marginTop: 30,
                    borderRadius: 30,
                    justifyContent: 'center'
                }}>
                    <Text style={styles.out_text}>退出</Text>
                </View>
            </TouchableOpacity>
        } else {
            return

        }
    }


}
let styles = StyleSheet.create({

    main_view: {
        flex: 1,
        backgroundColor: '#e5e5e5',
        marginBottom: 60,
    },
    main_view1: {
        flex: 1,
        backgroundColor: '#e5e5e5',
    },

    topImg: {
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    bodyView: {
        paddingHorizontal: 20,
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 60,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    bdText: {
        color: "#333",
        fontSize: Config.MainFontSize + 2,
        fontWeight: '500',
        fontFamily: 'PingFang SC'
    },
    iconStart: {
        fontSize: 18,
        marginRight: 10,
        color: '#333'
    },
    iconEnd: {
        color: '#B3B3B3',
        fontSize: 14,
        position: 'absolute',
        right: 20,
    },
    out_text: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500'
    },
    out_body: {
        marginBottom: 60,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Config.C2NavigationBarTintColor,
        width: Dimensions.get('window').width / 1.5,
        height: 36,
        marginTop: 30,
        borderRadius: 30,
        justifyContent: 'center'
    },

});