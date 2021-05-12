/**
* 个人审核
* Created by 曾一川.
*/
import React, { Component } from 'react';
import { NativeModules, PermissionsAndroid, StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, Alert, ListView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
import PcInterface from '../utils/http/PcInterface';
import Global from '../utils/GlobalStorage';
import EncryptionUtils from '../utils/EncryptionUtils';
import { QyVideoRecorder } from 'qysyb-mobile-videorecorder';
import { Checkbox, List, Picker, Switch } from 'antd-mobile-rn';
import HandlerOnceTap from '../utils/HandlerOnceTap'
import ServerProvider from '../utils/ServerProvider'
const CheckboxItem = Checkbox.CheckboxItem;


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const dataTemp = Date.parse(new Date())
function getFileTypeByurl(url) {
    let str = url.lastIndexOf('.');
    let type = url.substr(str + 1)//获取文件类型;
    return '.' + type
}
export default class PersonalAudit extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            serverData: {},
            orgId: '',//服务商id
            modalVisible: false,
            keyboardHeight: '', // 键盘高度
            remark1: "",//判断是平台注册营业执照还是个人上传rowData.remark1 == "1" ? "(自己注册)" : "(平台注册)"
            imageSource: '',
            imageSource1: '',
            imageSourceLis: '',
            imageSourceSeal: '',
            imageSourceCom: '',
            imageSource_yyzz: '',
            uuid: UUID.v4(),
            bqList: [],
            content: '',
            postCode: '',
            postCode3: '',
            checkStatu: '',//   3-审核通过，2-审核失败，1-审核中
            labelshow: '',
            reason: '',
            uploadDetail: '*需手持身份证念内容信息，信息如下：我是张三，我自愿在工薪易平台注册营业执照。',
            id: '',
            ifShowBq: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }
                , { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }
                , { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
            isHasLicense: false,
            zhizhaoInfo: {},//营业执照审核通过后后台返回的执照信息
        };
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=个人临时承揽标签', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                this.setState({
                    bqList: JSON.parse(json).result
                })
            })
        this.openQuanxian();
        //this.refresh();
        this.checkYYZZ();
        this.markSure();
    }
    openQuanxian() {
        if (Platform.OS == 'android') {
            var camera = PermissionsAndroid.PERMISSIONS.CAMERA;
            var microphone = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
            PermissionsAndroid.check(microphone).then(granted => {
                if (granted) {
                    PermissionsAndroid.check(camera).then(granted => {
                        // alert(granted)
                        if (granted) {
                        } else {
                            PermissionsAndroid.request(
                                camera,
                            ).then(shouldShow => (shouldShow ? 'denied' : 'restricted'));
                        }
                    })
                } else {
                    PermissionsAndroid.request(
                        microphone,
                    ).then(() =>
                        PermissionsAndroid.check(camera).then(granted => {
                            // alert(granted)
                            if (granted) {
                            } else {
                                PermissionsAndroid.request(
                                    camera,
                                ).then(shouldShow => (shouldShow ? 'denied' : 'restricted'));
                            }
                        }));
                }
            })
        }

    }
    // 监听键盘弹出与收回
    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
    }
    //注销监听
    componentWillUnmount() {
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    //键盘弹起后执行
    keyboardDidShow = (e) => {
        // this._scrollView.scrollTo({x:0, y:100, animated:true});
        this.setState({
            keyboardHeight: e.endCoordinates.height
        })
    }

    //键盘收起后执行
    keyboardDidHide = () => {
        // this._scrollView.scrollTo({x:0, y:0, animated:true});
        this.setState({
            keyboardHeight: 0
        })
    }
    markSure() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/checkUserIdCard', entity)
            .then((res) => {
                if (this.props.flag == 1) {
                    return
                }
                if (res.rcode == 0) {//未填写身份证信息
                    Actions.IdCard({ update: true, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 });
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
                                                Actions.Jianli({ update: true, userName: UserInfo.loginSet.result.rdata.loginUserInfo.userName, login: 1, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1, idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                            }
                                        },
                                    ])
                            }
                        })
                }
            })
    }
    //检查个人是否上传营业执照
    checkYYZZ() {
        let USER_ID = UserInfo.loginSet.result.rdata.loginUserInfo.userId
        if (this.props.flag == 1) {
            USER_ID = this.props.USER_ID
        }
        Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + USER_ID)
            .then((res) => {
                console.log('服务商' + res.remark2)
                this.setState({
                    remark1: res.remark1,
                    orgId: res.remark2 == undefined ? '' : res.remark2
                })
                this.setState({
                    postCode3: res.label, checkStatu: res.status, reason: res.reason, content: res.content, postCode: res.labelshow, id: res.id,
                    ifShowBq: (res.label == undefined || res.label == '') ? this.state.ifShowBq : [{ show: res.label.indexOf("0") != -1 ? true : false }, { show: res.label.indexOf("1") != -1 ? true : false },
                    { show: res.label.indexOf("2") != -1 ? true : false }, { show: res.label.indexOf("3") != -1 ? true : false },
                    { show: res.label.indexOf("4") != -1 ? true : false }, { show: res.label.indexOf("5") != -1 ? true : false }, { show: res.label.indexOf("6") != -1 ? true : false }, { show: res.label.indexOf("7") != -1 ? true : false }, { show: res.label.indexOf("8") != -1 ? true : false }, { show: res.label.indexOf("9") != -1 ? true : false }
                        , { show: res.label.indexOf("10") != -1 ? true : false }, { show: res.label.indexOf("11") != -1 ? true : false }, { show: res.label.indexOf("12") != -1 ? true : false }, { show: res.label.indexOf("13") != -1 ? true : false }
                        , { show: res.label.indexOf("14") != -1 ? true : false }, { show: res.label.indexOf("15") != -1 ? true : false }, { show: res.label.indexOf("16") != -1 ? true : false }, { show: res.label.indexOf("17") != -1 ? true : false }, { show: res.label.indexOf("18") != -1 ? true : false }, { show: res.label.indexOf("19") != -1 ? true : false }
                        , { show: res.label.indexOf("20") != -1 ? true : false }, { show: res.label.indexOf("21") != -1 ? true : false }, { show: res.label.indexOf("22") != -1 ? true : false }
                        , { show: res.label.indexOf("23") != -1 ? true : false }, { show: res.label.indexOf("24") != -1 ? true : false }, { show: res.label.indexOf("25") != -1 ? true : false }
                        , { show: res.label.indexOf("26") != -1 ? true : false }, { show: res.label.indexOf("27") != -1 ? true : false }, { show: res.label.indexOf("28") != -1 ? true : false }
                        , { show: res.label.indexOf("29") != -1 ? true : false }, { show: res.label.indexOf("30") != -1 ? true : false }, { show: res.label.indexOf("31") != -1 ? true : false }
                        , { show: res.label.indexOf("32") != -1 ? true : false }, { show: res.label.indexOf("33") != -1 ? true : false }, { show: res.label.indexOf("34") != -1 ? true : false }
                        , { show: res.label.indexOf("35") != -1 ? true : false }, { show: res.label.indexOf("36") != -1 ? true : false }, { show: res.label.indexOf("37") != -1 ? true : false }],
                })
                if (res.remark1 == "1") {
                    this.setState({
                        isHasLicense: true
                    })
                }
                this.refresh();
            })
    }
    refresh() {
        let docParams = {
            params: {
                businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            }
        }
        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        if (this.props.flag == 1) {
            docParams = {
                params: {
                    businessKey: this.props.USER_ID,
                }
            }
        }
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            for (let i in entry) {
                // if (entry[i].businessType == 'QY_DZYYZZ') {
                //     th.setState({
                //         imageSourceLis: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                //         isHasLicenseL: true
                //     });
                // }
                if (entry[i].businessType == 'QY_SFZZM') {
                    th.setState({
                        imageSource: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                }
                if (entry[i].businessType == 'QY_SFZFM') {
                    th.setState({
                        imageSource1: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                }
                if (entry[i].businessType == 'QY_RZSP') {
                    th.setState({
                        uploadDetail: '视频已上传',
                    });
                }
                if (entry[i].businessType == 'QY_DZYYZZ') {
                    th.setState({
                        imageSource_yyzz: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                        imageSourceLis: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                        //isHasLicense: true
                        zhizhaoInfo: entry[i]
                    });
                }
                if (entry[i].businessType == 'QY_FFGZPER') {
                    th.setState({
                        imageSourceSeal: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                }
                if (entry[i].businessType == 'QY_SFZZMPER') {
                    th.setState({
                        imageSourceCom: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                }
                if (th.props.registType != '' && th.props.registType) {
                    if (th.props.registType == "1") {
                        th.setState({ isHasLicense: true })
                    } else if (th.props.registType == "2") {
                        th.setState({ isHasLicense: false })
                    }
                }
            }
        });
    }

    render() {
        const zzInfo = this.state.zhizhaoInfo
        return (
            <View style={styles.container}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>个人电子营业执照</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>个人电子营业执照</Text>
                    </View>
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={-this.state.keyboardHeight}>
                    <ScrollView>
                        <View style={{ backgroundColor: 'white', width: deviceWidth, marginTop: 10 }}>
                            <View style={{ display: (this.state.checkStatu == '3' || this.state.checkStatu == '1' || this.props.flag == 1) ? "none" : "flex", flexDirection: "row", justifyContent: "flex-end", height: 30, alignContent: "center", alignItems: "center" }}>
                                <Switch
                                    checked={this.state.isHasLicense}
                                    onChange={() => {
                                        this.setState({
                                            isHasLicense: !this.state.isHasLicense,
                                        });
                                    }}
                                /><Text style={{ marginRight: 10 }}>已有电子营业执照，直接上传</Text>
                            </View>


                            <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, flexDirection: 'row' }}>
                                <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>审核状态</Text>
                                {this.state.checkStatu == '1' ?
                                    <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>审核中</Text> :
                                    this.state.checkStatu == '2' ?
                                        <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>审核失败</Text> :
                                        this.state.checkStatu == '3' ?
                                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'green' }}>审核通过</Text> :
                                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>待提交</Text>
                                }
                            </View>
                            {(zzInfo.filePath != undefined && this.state.remark1 != "1" && this.state.checkStatu == '3') ? <TouchableOpacity style={{ marginTop: 10 }} onPress={this.getViewZhizhao.bind(this, zzInfo.filePath, zzInfo.fileType, zzInfo.fileName)}>
                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                    <VectorIcon name={"c2_im_weixin_smiley"} size={18} color={'#5190e3'} style={{ backgroundColor: 'transparent', marginTop: 12, marginLeft: 10 }} />
                                    <Text style={{ marginTop: 12, fontSize: Config.MainFontSize, marginLeft: 5, color: "#5190e3" }}>查看电子营业执照</Text>
                                </View>
                            </TouchableOpacity>
                                : null}

                            {this.state.checkStatu == '2' ?
                                <View style={{ backgroundColor: 'white', width: deviceWidth, height: 120, marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>被拒原因</Text>
                                    <ScrollView style={{ marginLeft: 10, width: deviceWidth, height: 60 }}>
                                        <Text style={{ fontSize: Config.MainFontSize, color: 'red', padding: 5 }}>{this.state.reason}</Text>
                                    </ScrollView>
                                </View> : null}

                            {this.state.isHasLicense ? <View>{this.renderHasLis()}</View>
                                : <View>
                                    <View>
                                        <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*手持身份证件照(请保持手机竖屏正向拍摄)</Text>
                                    </View>
                                    <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                                    <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                                        <TouchableOpacity activeOpacity={1} onPress={this.getPhoto.bind(this)} >
                                            {this.state.imageSource == '' || this.state.imageSource == undefined ?
                                                <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                                    <Image source={require('../image/scsfz.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传带头像一面</Text>
                                                </View> :
                                                <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                                    <Image source={{ uri: this.state.imageSource }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传带头像一面</Text>
                                                </View>}
                                        </TouchableOpacity>
                                        <TouchableOpacity activeOpacity={1} onPress={this.getPhoto1.bind(this)} >
                                            {this.state.imageSource1 == '' || this.state.imageSource1 == undefined ?
                                                <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                                                    <Image source={require('../image/scsfzfm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                                    <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold', fontSize: Config.MainFontSize + 1 }}>点击上传带国徽一面</Text>
                                                </View> :
                                                <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                                                    <Image source={{ uri: this.state.imageSource1 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                                    <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold', fontSize: Config.MainFontSize + 1 }}>点击上传带国徽一面</Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    {this.state.checkStatu == '3' || this.state.checkStatu == '1' ?
                                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 40 }}>
                                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>{this.state.checkStatu == '1' ? '*视频认证正在审核中' : '*视频认证已审核通过'}</Text>
                                        </View> :
                                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: (Platform.OS == 'ios') ? deviceHeight / 3 - 40 : deviceHeight / 3 - 20, marginTop: 10 }}>
                                            <View>
                                                <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*拍摄视频</Text>
                                            </View>
                                            <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                                            <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                                                <TouchableOpacity onPress={this.start.bind(this)} >
                                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                                        <Image source={require('../image/add1.png')} style={{ width: deviceWidth / 5, height: deviceHeight / 6, borderRadius: 5 }} />
                                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize, marginTop: 5, marginBottom: 10 }}>点击拍摄视频</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ width: deviceWidth / 3, height: deviceHeight / 7, alignSelf: 'center', margin: 30 }}>
                                                    <Text style={{ fontSize: this.state.uploadDetail == '视频已上传' ? Config.MainFontSize + 2 : Config.MainFontSize, color: this.state.uploadDetail == '视频已上传' ? '#287CE0' : 'red' }}>
                                                        {this.state.uploadDetail}
                                                    </Text>
                                                </View>
                                            </View>
                                            <QyVideoRecorder ref={(ref) => { this.QyVideoRecorder = ref; }} showContent={'请正脸面向屏幕,并用普通话认真阅读: \n\n我是XXX（您的姓名）\n\n我自愿在工薪易平台注册营业执照'} duration={10} compressQuality={'medium'} />
                                        </View>}
                                    {(this.state.imageSource_yyzz == '' || !this.state.isHasLicense) ? null : <View style={{ backgroundColor: 'white', width: deviceWidth, height: deviceHeight / 3 - 20, marginTop: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*电子营业执照</Text>
                                        </View>
                                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                                        <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                                            <TouchableOpacity activeOpacity={1} >
                                                {this.state.imageSource_yyzz == '' || this.state.imageSource_yyzz == undefined ?
                                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                                        <Image source={require('../image/sfzzm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                                    </View> :
                                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                                        <Image source={{ uri: this.state.imageSource_yyzz }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                                    </View>}
                                            </TouchableOpacity>
                                        </View>
                                    </View>}
                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            <VectorIcon name={"bookmark2"} size={18} color={'red'} style={{ backgroundColor: 'transparent', marginTop: 12, marginLeft: 10 }} />
                                            <Text style={{ marginTop: 12, fontSize: Config.MainFontSize, marginLeft: 5, color: 'red' }}>个人标签</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10, flex: 1 }}>
                                        {this.biaoqian()}
                                    </View>
                                    <View style={{ height: deviceHeight / 6, backgroundColor: '#ffffff', marginTop: 10 }}>
                                        <Text style={{ marginLeft: 10, marginTop: 10, fontSize: Config.MainFontSize + 2, color: 'red' }}>*自我介绍：</Text>
                                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                                        {this.state.checkStatu == '1' || this.state.checkStatu == '3' ? <ScrollView style={{ margin: 10 }}>
                                            <Text>{this.state.content}</Text>
                                        </ScrollView> :
                                            <TextInput
                                                style={{ flex: 1, backgroundColor: 'white', fontSize: Config.MainFontSize, margin: 10 }}
                                                placeholder='请填写...'
                                                placeholderTextColor={'#d3d3d3'}
                                                value={this.state.content}
                                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                                                multiline={true}
                                                onChangeText={(value) => this.setState({ content: value })}
                                            />}
                                    </View>
                                </View>}
                            {/* {this.state.orgId == '' ? <View style={{ marginBottom: 60, marginTop: 10 }}>
                                <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
                                    <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize + 2, color: 'red' }}>*服务商信息</Text>
                                    <TouchableOpacity onPress={() => { this.setState({ modalVisible: !this.state.modalVisible }) }}>
                                        <Text style={{ marginLeft: 10, backgroundColor: 'rgb(65,143,234)', color: "white", fontSize: Config.MainFontSize - 2, padding: 5, borderRadius: 5 }}>请选择</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                                {this.state.serverData.orgName == undefined ? null : <Text style={{ color: "rgb(65,143,234)", marginLeft: 10, marginTop: 10 }}>已选择服务商： {this.state.serverData.orgName}</Text>}
                            </View> : null} */}
                        </View>

                        <ServerProvider
                            title={"请选择一个执照审核服务商"}
                            modalVisible={this.state.modalVisible}
                            onCancel={() => { this.setState({ modalVisible: false }) }}
                            callback={(data) => this.handleChooseServer(data)}
                        />
                        {this.state.checkStatu == '1' || this.state.checkStatu == '3' || this.props.flag == 1 ? null :
                            <TouchableOpacity onPress={() => HandlerOnceTap(() => { this.handleSubmit() })}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    width: Dimensions.get('window').width / 1.5,
                                    height: 44,
                                    borderRadius: 30,
                                    justifyContent: 'center',
                                    marginTop: 10, marginBottom: 20
                                }}>
                                    <Text style={{ color: 'white' }}>提交</Text>
                                </View>
                            </TouchableOpacity>}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

    handleChooseServer(data) {
        Alert.alert(
            '温馨提示',
            '是否确认选择' + data.orgName,
            [
                { text: '取消', onPress: () => { } },
                {
                    text: '确认', onPress: () => {
                        this.setState({
                            serverData: data,
                            modalVisible: false
                        }, () => { this.ensure() })
                    }
                },
            ]
        )
    }
    getViewZhizhao(uri, fileType, fileName) {
        const c_path = Config.mainUrl + "/iframefile/qybdirprocess/download/"
        if (fileType == 'jpg' || fileType == 'png' || fileType == 'JPG' || fileType == 'PNG' || fileType == 'jpeg') {
            Actions.ImageZoom({ url: c_path + encodeURIComponent(uri) })
        } else if (fileType == 'pdf' || fileType == 'PDF') {
            Actions.PDFWebView({ url: c_path + encodeURIComponent(uri) })
        } else {
            Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                text: '好的', onPress: () => {

                }
            }
            ])
        }
    }
    getComPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        if (this.state.checkStatu == '1' || this.state.checkStatu == '3' || this.props.flag == 1) {
            null
        } else {
            ActionSheet.showActionSheetWithOptions(params)
                .then((index) => {
                    if (index == 0) {
                        this._cameraCom();
                    } else if (index == 1) {
                        this._selectImageCom();
                    }
                });
        }
    }
    _cameraCom() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSourceCom: response.uri,
                    //uploadText: response.uri,
                    //status: true,
                }, () => {
                    this.uploadImageCom(response)
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImageCom() {
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return }
                this.uploadImageCom(response[0]);
                this.setState({
                    imageSourceCom: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })
    }
    uploadImageCom(response) {//上传公章
        let sourceTemp = {
            ...response,
            fileName: 'gz' + dataTemp + getFileTypeByurl(response.uri)
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_SFZZMPER', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '法人私章', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getSealPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        if (this.state.checkStatu == '1' || this.state.checkStatu == '3' || this.props.flag == 1) {
            null
        } else {
            ActionSheet.showActionSheetWithOptions(params)
                .then((index) => {
                    if (index == 0) {
                        this._cameraSeal();
                    } else if (index == 1) {
                        this._selectImageSeal();
                    }
                });
        }
    }
    _cameraSeal() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSourceSeal: response.uri,
                    //uploadText: response.uri,
                    //status: true,
                }, () => {
                    this.uploadImageSeal(response)
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImageSeal() {
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return }
                this.uploadImageSeal(response[0]);
                this.setState({
                    imageSourceSeal: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })
    }
    uploadImageSeal(response) {//上传私章
        let sourceTemp = {
            ...response,
            fileName: 'srfz' + dataTemp + getFileTypeByurl(response.uri)
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_FFGZPER', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '法人私章', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getLisPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        if (this.state.checkStatu == '1' || this.state.checkStatu == '3' || this.props.flag == 1) {
            null
        } else {
            ActionSheet.showActionSheetWithOptions(params)
                .then((index) => {
                    if (index == 0) {
                        this._cameraLis();
                    } else if (index == 1) {
                        this._selectImageLis();
                    }
                });
        }
    }
    _cameraLis() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSourceLis: response.uri,
                    //uploadText: response.uri,
                    //status: true,
                }, () => {
                    this.uploadImageLis(response)
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImageLis() {
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return }
                this.uploadImageLis(response[0]);
                this.setState({
                    imageSourceLis: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })
    }
    uploadImageLis(response) {//上传营业执照
        let sourceTemp = {
            ...response,
            fileName: 'yyzz' + dataTemp + getFileTypeByurl(response.uri)
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_DZYYZZ', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '电子营业执照', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        if (this.state.checkStatu == '1' || this.state.checkStatu == '3' || this.props.flag == 1) {
            null
        } else {
            ActionSheet.showActionSheetWithOptions(params)
                .then((index) => {
                    if (index == 0) {
                        this._camera();
                    } else if (index == 1) {
                        this._selectImage();
                    }
                });
        }
    }
    _camera() {//_camera表示正面，_camera1表示反面
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource: response.uri,
                    uploadText: response.uri,
                    status: true,
                }, () => {
                    this.uploadImage(response)
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage() {//_selectImage表示正面，_selectImage1表示反面
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return }
                this.uploadImage(response[0]);
                this.setState({
                    imageSource: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage(response) {//上传身份证照片,side用来区分正方面
        let sourceTemp = {
            ...response,
            fileName: 'sfzzm' + dataTemp + getFileTypeByurl(response.uri)
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_SFZZM', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '身份证正面', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto1() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        if (this.state.checkStatu == '1' || this.state.checkStatu == '3' || this.props.flag == 1) {
            null
        } else {
            ActionSheet.showActionSheetWithOptions(params)
                .then((index) => {
                    if (index == 0) {
                        this._camera1();
                    } else if (index == 1) {
                        this._selectImage1();
                    }
                });
        }
    }
    _camera1() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource1: response.uri,
                    uploadText1: response.uri,
                    status: false,
                });
                this.uploadImage1(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage1() {
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };

        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return }
                this.setState({
                    imageSource1: response[0].uri
                })
                this.uploadImage1(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage1(response) {//上传身份证照片,side用来区分正方面
        let sourceTemp = {
            ...response,
            fileName: 'sfzfm' + dataTemp + getFileTypeByurl(response.uri)
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_SFZFM', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '身份证反面', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }


    //视频录制
    start() {
        if (Platform.OS == 'android') {
            var camera = PermissionsAndroid.PERMISSIONS.CAMERA;
            var microphone = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
            PermissionsAndroid.check(microphone).then(granted => {
                // alert(granted)
                if (granted) {
                    PermissionsAndroid.check(camera).then(granted => {
                        // alert(granted)
                        if (granted) {
                            this.QyVideoRecorder.open((data) => {
                                var temp = {
                                    type: "video/mp4",
                                    simpleType: "MP4",
                                    fileName: '认证视频.MP4',
                                    width: deviceWidth,
                                    height: deviceHeight,
                                    uri: data.path
                                }
                                var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
                                var params = {
                                    source: temp,
                                    url: path,
                                    formData: { ifCover: "true", businessType: 'QY_RZSP', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '认证视频', },
                                    progress: (events) => {
                                    }
                                }
                                // debugger
                                FileManager.uploadFile(params)
                                    .then((respones) => {
                                        console.log('respones', respones)
                                        this.setState({
                                            uploadDetail: '视频已上传',
                                        })
                                    }).catch((e) => {
                                    });//这里处理录制好的视频文件，跟图片处理一致
                            });
                        } else {
                            Toasts.show('请先开启相机权限', { position: -20 })
                            PermissionsAndroid.request(
                                camera,
                            ).then(shouldShow => (shouldShow ? 'denied' : 'restricted'));
                        }
                    })
                } else {
                    Toasts.show('请先开启麦克风权限', { position: -20 })
                    PermissionsAndroid.request(
                        microphone,
                    ).then(shouldShow => (shouldShow ? 'denied' : 'restricted'));
                }
            })
        } else {
            this.QyVideoRecorder.open((data) => {
                var temp = {
                    type: "video/mp4",
                    simpleType: "MP4",
                    fileName: '认证视频.MP4',
                    width: deviceWidth,
                    height: deviceHeight,
                    uri: data.path
                }
                var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
                var params = {
                    source: temp,
                    url: path,
                    formData: { ifCover: "true", businessType: 'QY_RZSP', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '认证视频', },
                    progress: (events) => {
                    }
                }
                FileManager.uploadFile(params)
                    .then((respones) => {
                        console.log('respones', respones)
                        this.setState({
                            uploadDetail: '视频已上传',
                        })
                    }).catch((e) => {
                    });//这里处理录制好的视频文件，跟图片处理一致
            });
        }


    }
    biaoqian() { //标签
        var temp2 = [];
        var bqList = this.state.bqList;
        for (let i in bqList) {
            if (bqList[i].dictdataValue == '') {
                temp2.push(null)
            } else {
                temp2.push(
                    <View style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        {(this.state.ifShowBq[i].show) ? <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 20 }} disabled={(this.state.checkStatu == '3' || this.state.checkStatu == '1') ? true : false} onPress={this.bqClick.bind(this, i)}>
                            <VectorIcon name={"c2_im_check_circle_solid"} size={20} color={'red'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity> : <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 20 }} disabled={(this.state.checkStatu == '3' || this.state.checkStatu == '1') ? true : false} onPress={this.bqClick.bind(this, i)}>
                                <VectorIcon name={"c2_im_select_circle"} size={20} color={'red'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>}
                        <TouchableOpacity style={{ marginLeft: 10 }} disabled={(this.state.checkStatu == '3' || this.state.checkStatu == '1') ? true : false} onPress={this.bqClick.bind(this, i)}>
                            <Text>{bqList[i].dictdataValue}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        }
        return temp2;
    }
    renderHasLis() {
        return (
            <View>
                <View>
                    <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5 }} />
                    <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*上传个人电子营业执照</Text>
                    <TouchableOpacity activeOpacity={1} onPress={this.getLisPhoto.bind(this)} style={{ marginTop: 20 }}>
                        {this.state.imageSourceLis == '' || this.state.imageSourceLis == undefined ?
                            <View style={{ flexDirection: 'column', marginLeft: 12, alignItems: "center" }}>
                                <Image source={require('../image/cgw.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传个人电子营业执照</Text>
                            </View> :
                            <View style={{ flexDirection: 'column', marginLeft: 12, alignItems: "center" }}>
                                <Image source={{ uri: this.state.imageSourceLis }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                {/* <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传个人电子营业执照</Text> */}
                            </View>}
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5 }} />
                    <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>上传公章扫描件</Text>
                    <TouchableOpacity activeOpacity={1} onPress={this.getComPhoto.bind(this)} style={{ marginTop: 20 }}>
                        {this.state.imageSourceCom == '' || this.state.imageSourceCom == undefined ?
                            <View style={{ flexDirection: 'column', marginLeft: 12, alignItems: "center" }}>
                                <Image source={require('../image/cgw.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传公章扫描件</Text>
                            </View> :
                            <View style={{ flexDirection: 'column', marginLeft: 12, alignItems: "center" }}>
                                <Image source={{ uri: this.state.imageSourceCom }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                {/* <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传公章扫描件</Text> */}
                            </View>}
                    </TouchableOpacity>
                </View>
                <View>
                    <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5 }} />
                    <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>上传法人私章扫描件</Text>
                    <TouchableOpacity activeOpacity={1} onPress={this.getSealPhoto.bind(this)} style={{ marginTop: 20, marginBottom: 20 }}>
                        {this.state.imageSourceSeal == '' || this.state.imageSourceSeal == undefined ?
                            <View style={{ flexDirection: 'column', marginLeft: 12, alignItems: "center" }}>
                                <Image source={require('../image/cgw.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传法人私章扫描件</Text>
                            </View> :
                            <View style={{ flexDirection: 'column', marginLeft: 12, alignItems: "center" }}>
                                <Image source={{ uri: this.state.imageSourceSeal }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                {/* <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传法人私章扫描件</Text> */}
                            </View>}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    bqClick(i) {
        var t = 0;
        var temp2 = '';
        var temp3 = '';
        var ifshow2 = this.state.ifShowBq;
        var bqList = this.state.bqList;
        this.state.ifShowBq[i].show = !this.state.ifShowBq[i].show;
        for (let i in ifshow2) {
            if (ifshow2[i].show) {
                t = t + 1
            }
        }
        if (t > 3) {
            this.state.ifShowBq[i].show = false
            Toast.showInfo('最多选三个标签', 1000)
        } else {
            for (let i in bqList) {
                if (ifshow2[i].show) {
                    temp2 = temp2 + bqList[i].dictdataValue + ","
                    temp3 = temp3 + bqList[i].dictdataName + ","
                }
            }
            this.setState({
                postCode: temp2,
                postCode3: temp3,
                ifShowBq: ifshow2
            })
        }

    }
    handleSubmit() {
        if (!this.state.isHasLicense) {
            if (this.state.imageSource == '' || this.state.imageSource == undefined) {
                Toast.showInfo('请上传身份证正面', 1000)
                return;
            }
            if (this.state.imageSource1 == '' || this.state.imageSource1 == undefined) {
                Toast.showInfo('请上传身份证反面', 1000)
                return;
            }
            if (this.state.postCode == undefined || this.state.postCode == '') {
                Toast.showInfo('请选择个人标签', 1000)
                return;
            }
            if (this.state.content == '' || this.state.content == undefined) {
                Toast.showInfo('请填写自我介绍', 1000)
                return;
            }
            if (this.state.uploadDetail != '视频已上传') {
                Toast.showInfo('请上传视频', 1000)
                return;
            }
        } else {
            if (this.state.imageSourceLis == '' || this.state.imageSourceLis == undefined) {
                Toast.showInfo('请上传个人电子营业执照', 1000)
                return;
            }
        }
        this.setState({
            modalVisible: true
        })
    }
    //确认上传
    ensure() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '提交中...'
        });
        console.log(this.state.serverData.orgId)
        console.log(this.state.orgId)
        if (!this.state.isHasLicense) {
            var entity = {
                content: this.state.content,
                label: this.state.postCode3,
                labelshow: this.state.postCode,
                user_id: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                id: this.state.id,
                remark1: 2,//自己注册传1，需要平台注册传2 
                remark2: this.state.serverData.orgId
            }
        } else {
            var entity = {
                user_id: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                id: this.state.id,
                remark1: 1,//自己注册传1，需要平台注册传2  
                remark2: this.state.serverData.orgId
            }
        }
        console.log(entity)
        Fetch.postJson(Config.mainUrl + '/businessLicense/savecyyzz', entity)
            .then((res) => {
                Toast.dismiss();
                if (res.rcode == "1") {
                    Toasts.show('提交成功,请等待您的审核结果', { position: -80 });
                    Actions.pop({ refresh: { test: UUID.v4() } })
                } else if (res.rcode == "0") {
                    Toasts.show(res.Msg, { position: -80 });
                } else {
                    Toasts.show(res.Msg, { position: -60 });
                }
            }).catch((res1) => {
                Toasts.show(res1.description, { position: -60 });
            })
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1
    },

});
