/**
 * 执照审核
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, PixelRatio, StyleSheet, ScrollView, TextInput, Alert, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Modal, DeviceEventEmitter, KeyboardAvoidingView } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, Toast, FileManager, ActionSheet, Camera, ImagePicker } from 'c2-mobile';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';
import TimeChange from '../utils/TimeChange';
import { List, Radio } from 'antd-mobile-rn';
import EncryptionUtils from '../utils/EncryptionUtils';
import PcInterface from '../utils/http/PcInterface';
const RadioItem = Radio.RadioItem;
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class UndeterminedContract2 extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.telphone = UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1;
        this.bendiCode = '';
        this._timer = null;
        this.state = {
            resetAuthCode: false,
            jiafang: true,
            resetMessage: 60,
            yifang: false,
            modalVisible: false,
            modalVisible2: false,
            contract: true,
            rejectReason: '',
            pdfUrl: '',
            code: '',
            contractText: [],
            dataBlob: '',
            reason: '',
            dataBlob1: '',
            read: false,
            modalVisible_yzm: false,
            settlementId: "",
            settlementItem: {},
            userIdForFile: "",
            filePathList: [],
            dataSource: [],
            ifzero: false,
            ifuploadYEZZ: false
        }
        // this.getContract()
        this.getFileList()
    }
    // getContract() {
    //     //debugger
    //     Fetch.getJson(Config.mainUrl + '/companyInfoBF/getCompanyINfoById?infoid=' + this.props.rowData.id + '&type=' + this.props.types)
    //         .then((res) => {
    //             // debugger
    //             console.log(res)
    //             this.setState({
    //                 dataBlob: res.content,
    //                 dataBlob1: res.list,
    //                 contractText: res.acclist,
    //                 userIdForFile: res.content.userId
    //             })
    //             this.getFileList()
    //         })
    // }
    //获取附件列表
    getFileList() {
        //remt1 字段   为1 查看自己上传的界面  2查看平台注册界面
        let docParams = {
            params: {
                businessKey: this.props.rowData.USER_ID,
            }
        }
        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            if (entry.length == 0) {
                this.setState({
                    ifzero: true,
                    dataSource: []
                })
            } else {
                this.setState({
                    ifzero: false,
                    dataSource: entry
                })
            }

        })
    }
    //附件下载后查看
    downLoad(uri) {
        Actions.ImageZoom({ url: uri })
    }
    reject() {
        if (this.state.rejectReason == '') {
            Toasts.show('请填写驳回理由', { position: -80 });
        } else {
            Fetch.getJson(Config.mainUrl + '/businessLicense/' + this.props.rowData.id)
                .then((ret) => {
                    console.warn('数据状态为:' + ret.status)
                    if (ret.status != '1') {
                        Alert.alert('提示', '此条数据已被其他用户处理,请返回列表刷新获取最新内容', [{
                            text: '确定', onPress: () => { Actions.pop() }
                        },])
                    } else {
                        Alert.alert('提示', '您确认提交吗？', [{
                            text: '再看看', onPress: () => { }
                        }, {
                            text: '继续', onPress: () => {
                                Toast.show({
                                    type: Toast.mode.C2MobileToastLoading,
                                    title: '提交中...'
                                });
                                var entity = {//修改：status  审核通过3   驳回2 （必填）
                                    status: "2",
                                    reason: this.state.rejectReason,
                                    id: this.props.rowData.id,
                                    userId: this.props.rowData.USER_ID
                                }
                                Fetch.postJson(Config.mainUrl + '/businessLicense/auditLicense', entity)
                                    .then((res) => {
                                        Toast.dismiss();
                                        this.setState({ modalVisible: false });
                                        if (res.status == '200') {
                                            Toasts.show('驳回成功', { position: -80 });
                                            this.props.onblock()
                                            Actions.pop({ refresh: { test: UUID.v4() } })
                                        } else {
                                            Toasts.show(res.Msg, { position: -60 });
                                        }
                                    }).catch((res1) => {
                                        Toasts.show(res1.description, { position: -60 });
                                        this.setState({ modalVisible: false });
                                    })
                            }
                        }])
                    }
                })
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1 }}
                >
                    <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                        <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>执照详情</Text>
                        </View>
                    </ImageBackground>

                    {(this.props.rowData.remt1 == '1') ? <ScrollView style={{ backgroundColor: 'white' }} scrollIndicatorInsets={{ right: 1 }}>
                        <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, marginTop: 10, width: deviceWidth - 10, paddingLeft: 6, paddingRight: 6 }}>
                            <View style={styles.first}>
                                <View style={{ width: 5 }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ textAlign: 'right', color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>注册编号：</Text>
                                </View>
                                <Text style={styles.infoItem}>{this.props.rowData.CODE}</Text>
                            </View>

                            {this.state.ifzero ?
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>未上传相关照片</Text>
                                </View> : <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {this.renderListView()}
                                </View>}
                            {(this.props.selectNum == '1') ? null : <View style={{ marginTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 15 }}>理        由：</Text>
                                </View>
                                <TextInput
                                    style={{ paddingVertical: 0, flex: 1, height: 100, fontSize: Config.MainFontSize, color: '#999', marginRight: 4, borderWidth: 1, borderColor: "#e7e7e7", borderRadius: 10, padding: 10, marginTop: 10 }}
                                    underlineColorAndroid="transparent"
                                    multiline
                                    secureTextEntry={false}
                                    placeholderTextColor="#c4c4c4"
                                    numberOfLines={20}
                                    maxLength={200}
                                    value={this.state.rejectReason}
                                    onChangeText={(text) => { this.setState({ rejectReason: text }) }}
                                />
                            </View>}
                            {(this.props.selectNum == '1') ? null : <View style={{ display: "flex", flexDirection: "row", alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 88 }}>
                                <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 30 }} onPress={() => this.reject()}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.isMakeSure(1)}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>通过</Text>
                                </TouchableOpacity>
                            </View>}
                            {/* {this.bohuiModal()} */}
                        </View>
                    </ScrollView>
                        :
                        <ScrollView style={{ backgroundColor: 'white' }} scrollIndicatorInsets={{ right: 1 }}>
                            <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, marginTop: 10, width: deviceWidth - 10, paddingLeft: 6, paddingRight: 6 }}>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ textAlign: 'right', color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>注册编号：</Text>
                                    </View>
                                    <Text style={styles.infoItem}>{this.props.rowData.CODE}</Text>
                                </View>

                                {this.state.ifzero ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>未上传相关照片</Text>
                                    </View> : <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {this.renderListView()}
                                    </View>}
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>个人标签</Text>
                                    </View>
                                    <View style={{ paddingVertical: 0, flex: 1, maxHeight: deviceHeight / 3, fontSize: Config.MainFontSize, color: 'rgb(65,143,234)', marginRight: 4, }}>
                                        <Text style={{ color: '#222222', textAlign: 'right', marginRight: 4, }} >{this.props.rowData.LABELSHOW}</Text>
                                    </View>
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>自我描述</Text>
                                    </View>
                                    <View style={{ paddingVertical: 0, flex: 1, maxHeight: deviceHeight / 3, marginRight: 4, }}>
                                        <Text style={{ color: '#222222', textAlign: 'right', marginRight: 4, }} >{(this.props.rowData.CONTENT == undefined) ? '无' : this.props.rowData.CONTENT}</Text>
                                    </View>
                                </View>

                                {(this.props.selectNum == '1') ? null : <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>电子营业执照</Text>
                                    </View>
                                    <TouchableOpacity onPress={this.upLoadFile.bind(this)} style={{ paddingVertical: 0, flex: 1, maxHeight: deviceHeight / 3, color: 'rgb(65,143,234)', marginRight: 4, }}>
                                        <Text style={{ color: 'rgb(65,143,234)', textAlign: 'right', marginRight: 4, }} >添加附件</Text>
                                    </TouchableOpacity>
                                </View>}
                                <TouchableOpacity activeOpacity={1} onPress={this.upLoadFile.bind(this)} >
                                    {this.state.imageSource1 == '' || this.state.imageSource1 == undefined ?
                                        null :
                                        <View style={{ flexDirection: 'column', margin: 5 }}>
                                            <Image source={{ uri: this.state.imageSource1 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                        </View>
                                    }
                                </TouchableOpacity>
                                {(this.props.selectNum == '1') ? null : <View style={{ marginTop: 20 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 15 }}>理        由：</Text>
                                    </View>
                                    <TextInput
                                        style={{ paddingVertical: 0, flex: 1, height: 100, fontSize: Config.MainFontSize, color: '#999', marginRight: 4, borderWidth: 1, borderColor: "#e7e7e7", borderRadius: 10, padding: 10, marginTop: 10 }}
                                        underlineColorAndroid="transparent"
                                        multiline
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        numberOfLines={20}
                                        maxLength={200}
                                        value={this.state.rejectReason}
                                        onChangeText={(text) => { this.setState({ rejectReason: text }) }}
                                    />
                                </View>}
                                {(this.props.selectNum == '1') ? null : <View style={{ display: "flex", flexDirection: "row", alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 88 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 30 }} onPress={() => this.reject()}>
                                        <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.isMakeSure(1)}>
                                        <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>通过</Text>
                                    </TouchableOpacity>
                                </View>}

                                {/* {this.bohuiModal()} */}

                            </View>
                        </ScrollView>}
                </KeyboardAvoidingView>
            </View >
        );
    }
    upLoadFile() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        ActionSheet.showActionSheetWithOptions(params)
            .then((index) => {
                if (index == 0) {
                    this._camera1();
                } else if (index == 1) {
                    this._selectImage1();
                }
            });
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
    uploadImage1(response) {

        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: response,
            url: path,
            formData: { ifCover: "true", businessType: "QY_DZYYZZ", businessKey: this.props.rowData.USER_ID, displayName: '电子营业执照' },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    ifuploadYEZZ: true,
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    renderListView() {
        var list = this.state.dataSource
        var temp = [];
        console.log("remt1" + this.props.rowData.remt1)
        if (this.props.rowData.remt1 == '2') {
            for (let i in list) {
                if (list[i].businessType == 'QY_SFZZM' || list[i].businessType == 'QY_SFZFM') {
                    temp.push(
                        <View style={{ width: deviceWidth, backgroundColor: 'white', marginTop: 10, alignItems: "center" }}>
                            <Text style={{ marginTop: 10 }}>{list[i].businessType == 'QY_SFZZM' ? '身份证正面' : list[i].businessType == 'QY_SFZFM' ? '身份证反面' : null}</Text>
                            {list[i].businessType == 'QY_SFZZM' || list[i].businessType == 'QY_SFZFM' ?
                                <Image source={{ uri: Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath }} style={{ width: deviceWidth / 2, height: deviceWidth / 2, alignSelf: 'center', marginTop: 10 }} />
                                : null}
                            <TouchableOpacity onPress={this.downLoad.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath)}>
                                <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)', alignSelf: "center", marginTop: 10 }}>查看</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            }
            for (let i in list) {
                if (list[i].businessType == "QY_RZSP") {
                    temp.push(
                        <View style={{
                            marginBottom: 1,
                            flexDirection: 'row',
                            backgroundColor: "#fff",
                            height: 44,
                            marginTop: 10,
                            alignItems: 'center',
                            width: Dimensions.get('window').width - 40,
                            borderBottomColor: '#e7e7e7',
                            borderBottomWidth: 1,
                        }}>
                            <View style={{ width: 5 }} />
                            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>认证视频</Text>
                            </View>
                            <TouchableOpacity onPress={this.downLoadFile.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + encodeURIComponent(list[i].filePath), list[i].fileName)} style={{ paddingVertical: 0, flex: 1, maxHeight: deviceHeight / 3, color: 'rgb(65,143,234)', marginRight: 4, }}>
                                <Text style={{ color: 'rgb(65,143,234)', textAlign: 'right', marginRight: 4, }} >下载</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            }
        }

        if (this.props.rowData.remt1 == '1') {
            for (let i in list) {
                if (list[i].businessType == 'QY_SFZZMPER' || list[i].businessType == 'QY_DZYYZZ' || list[i].businessType == 'QY_FFGZPER') {
                    temp.push(
                        <View style={{ width: deviceWidth, backgroundColor: 'white', marginTop: 10, alignItems: "center" }}>
                            <Text style={{ marginTop: 10 }}>{list[i].businessType == 'QY_SFZZMPER' ? '公章' : list[i].businessType == 'QY_DZYYZZ' ? '电子营业执照' : list[i].businessType == 'QY_FFGZPER' ? '法人私章' : null}</Text>
                            {list[i].businessType == 'QY_SFZZMPER' || list[i].businessType == 'QY_DZYYZZ' || list[i].businessType == 'QY_FFGZPER' ?
                                <Image source={{ uri: Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath }} style={{ width: deviceWidth / 2, height: deviceWidth / 2, alignSelf: 'center', marginTop: 10 }} />
                                : null}
                            <TouchableOpacity onPress={this.downLoad.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath)}>
                                <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)', marginTop: 10, alignSelf: "center" }}>查看</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }
            }
        }

        return temp

    }
    downLoadFile(uri, fileName) {
        //debugger
        //let filename = fileName.replace(new RegExp("\/", "gm"), "");
        if (fileName.indexOf('jpg') != -1 || fileName.indexOf('png') != -1) {
            Actions.ImageZoom({ url: uri })
        } else {
            Toast.show({
                type: Toast.mode.C2MobileToastLoading,
                title: '视频下载中,请稍等···',
                duration: 1000,
            });
            var params = {
                source: { uri: uri, fileName: fileName },
                dirMode: FileManager.DirMode.cache,
                header: {},
            }
            FileManager.downloadFile(params, FileManager.DirMode.cache,
                (events) => {
                }).then((respones) => {
                    if (respones) {
                        FileManager.openFile(respones)
                            .then((response) => {
                                Toast.dismiss();
                            })
                            .catch((e) => {
                                Toast.dismiss();
                                Toast.showInfo('查看失败，文件已失效或损坏', 1000);
                            })
                    }
                }).catch((e) => {
                    Toast.dismiss();
                    console.log(e);
                })
        }
    }
    _renderItem(rowData) {
        return (
            <View style={{ backgroundColor: "#e8e8e8", borderRadius: 10, marginBottom: 10 }}>
                <View style={styles.contactInfoItem}>
                    <Text style={styles.infoItem}>{rowData.hrName}</Text>
                    <Text style={styles.infoItem}>职位:{rowData.hrPosition}</Text>
                </View>
                <View style={styles.contactInfoItem}>
                    <Text style={styles.infoItem}>办公电话:{rowData.hrWorkNumber}</Text>
                    <Text style={styles.infoItem}>手机号码:{rowData.hrMobile}</Text>
                </View>
                <View style={styles.contactInfoItem}>
                    <Text style={styles.infoItem}>邮箱:{rowData.hrEmail}</Text>
                </View>
            </View>
        )
    }
    qianding() {
        this.setState({
            modalVisible_yzm: true
        })
        // Actions.Qianming({ id: this.props.rowData.id, workType: this.props.rowData.REMARK1 })
    }

    ifAgree() {
        this.setState({ read: !this.state.read })
    }

    text(rowData) {
        if (rowData.term == undefined) { return null } else {
            if (this.state.modalVisible_yzm) {
                return (
                    <View style={{ padding: 5 }}>
                        <Text style={{ color: 'grey' }}>{(rowData.term.replace(new RegExp("#&nbsp;&nbsp;", "gm"), "\n")).replace(new RegExp("&nbsp;&nbsp;", "gm"), "  ")}</Text>
                    </View>
                )
            } else {
                return (
                    <View style={{ padding: 5 }}>
                        <Text>{(rowData.term.replace(new RegExp("#&nbsp;&nbsp;", "gm"), "\n")).replace(new RegExp("&nbsp;&nbsp;", "gm"), "  ")}</Text>
                    </View>
                )
            }

        }
    }
    _countTime() {
        const rule = /^1[0-9]{10}$/;
        if (!rule.test(this.telphone)) {
            Toast.showInfo('请输入正确的手机号', 1000);
            return
        } else {
            this.sendCode();
            //     var entity = {
            //         userMobiletel1: this.telphone,
            //     }
            //     Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
            //         .then((res) => {
            //             if (res) {
            //                 this.sendCode();
            //             } else if (res == false) {
            //                 Toast.showInfo('该号码已注册', 1000)
            //             } else {
            //                 Toast.showInfo('服务器异常,请稍后重试', 1000)
            //             }
            //         })
        }

    }
    sendCode() {
        var entity = {
            phone: this.telphone,
            title: 'GENERAL_CODE',
        }
        Fetch.postJson(Config.mainUrl + '/ws/getVerifyCode', entity)
            .then((res) => {
                this.setState({
                    code: res
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
    isMakeSure(value) {
        if (this.state.ifuploadYEZZ === false && this.props.rowData.remt1 == "2") {
            Alert.alert('温馨提示', '请先上传营业执照', [{ text: '确定', onPress: () => { } }])
            return
        }

        Fetch.getJson(Config.mainUrl + '/businessLicense/' + this.props.rowData.id)
            .then((ret) => {
                console.warn('数据状态为:' + ret.status)
                if (ret.status != '1') {
                    Alert.alert('提示', '此条数据已被其他用户处理,请返回列表刷新获取最新内容', [{
                        text: '确定', onPress: () => { Actions.pop() }
                    },])
                } else {
                    Alert.alert('提示', '您确认提交吗？', [{
                        text: '再看看', onPress: () => { }
                    }, {
                        text: '继续', onPress: () => {
                            Toast.show({
                                type: Toast.mode.C2MobileToastLoading,
                                title: '提交中...'
                            });
                            var entity = {
                                status: "3",
                                reason: this.state.rejectReason,//通过也可填理由
                                id: this.props.rowData.id,
                                userId: this.props.rowData.userId
                            }
                            Fetch.postJson(Config.mainUrl + '/businessLicense/auditLicense', entity)
                                .then((res) => {
                                    Toast.dismiss();
                                    if (res.status == '200') {
                                        this.setState({ modalVisible: false })
                                        Toasts.show('提交成功', { position: -80 });
                                        this.props.onblock()
                                        Actions.pop({ refresh: { test: UUID.v4() } })
                                    } else {
                                        Toasts.show(res.description, { position: -60 });
                                    }
                                }).catch((res1) => {
                                    Toasts.show(res1.description, { position: -60 });
                                })

                        }
                    }])
                }
            })
    }
    chooseSettlementModal() {
        let _maxLength = deviceHeight / 5;
        return (
            <Modal
                alignSelf={'center'}
                animationType={"fade"}
                transparent={true}
                visible={this.state.modalVisible2}
                onRequestClose={() => { }}
            >
                <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white' }}>
                    <View style={{ width: deviceWidth - 40 }}>
                        <ListView
                            style={{ borderRadius: 20 }}
                            dataSource={this.ds.cloneWithRows(this.state.contractText)}
                            renderRow={this._renderSettlement.bind(this)}
                            enableEmptySections={true}
                        />
                    </View>
                </View>
            </Modal>    
        )
    }
    _renderSettlement(rowData) {
        const value = this.state.settlementId
        return (
            <View style={{ borderBottomWidth: 0.5, borderBottomColor: "grey" }}>
                <RadioItem name={rowData.id} key={rowData.id} checked={value === rowData.id} onChange={() => this.handleChooseRadio(rowData)}>
                    <View style={{ width: "100%" }} >
                        <Text style={styles.infoItem}>账户名称:{rowData.accountName}</Text>
                        <Text style={styles.infoItem}>账号:{rowData.accountNo}</Text>
                        <Text style={styles.infoItem}>开户行:{rowData.openBank}</Text>
                        <Text style={styles.infoItem}>到账天数:{rowData.tothedate}</Text>
                        <Text style={styles.infoItem}>备注:{rowData.remark}</Text>
                    </View>
                </RadioItem>
            </View>
        )
    }
    handleChooseRadio(rowData) {
        this.setState({
            settlementItem: rowData,
            settlementId: rowData.id,
            modalVisible2: false
        })
    }
    bohuiModal() {
        let _maxLength = deviceHeight / 5;
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}
                >
                    <TouchableOpacity style={{ position: "absolute", height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ modalVisible: false })}>
                    </TouchableOpacity>
                    <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>驳回原因(必填)</Text></View>
                        <View style={underLiner.liners} />
                        <View style={{ width: deviceWidth - 80, height: 100, backgroundColor: '#E8E8E8' }}>
                            {
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入驳回原因'}
                                    style={{ textAlign: 'left', marginLeft: 16, marginRight: 16, flex: 1, fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    multiline={true}
                                    maxLength={parseInt(_maxLength)}
                                    onChangeText={(text) => this.setState({ rejectReason: text })} />

                            }
                        </View>
                        <View style={{ flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60 }}>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 45, marginRight: 45 }}>
                                <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible: false })}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => Alert.alert('确定要提交吗？', '', [{ text: '取消' }, { text: '确定', onPress: this.reject.bind(this) }])}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible: false })}>
                            <VectorIcon name={"android-close"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity>
                    </View>

                </Modal>
            </View >
        )
    }
    makesure() {
        if (this.telphone == '') {
            Alert.alert("提示", '手机号码为空,请重新输入', [{ text: '确定', onPress: () => { } }]);
            return;
        } else if (this.state.code != this.bendiCode) {
            Alert.alert("提示", '验证码不对,请重新输入', [{ text: '确定', onPress: () => { } }]);
            return;
        } else if (this.bendiCode == '') {
            Alert.alert("提示", '请输入验证码', [{ text: '确定', onPress: () => { } }]);
            return;
        } else {
            this.setState({
                modalVisible_yzm: false
            })
            Toast.showInfo('验证成功', 1000);
            Actions.Qianming({ id: this.props.rowData.id, workType: this.props.rowData.REMARK1 })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },

    backTextWhite: {
        color: 'white',
    },
    rowFront: {
        backgroundColor: 'rgb(250,250,250)',
        borderBottomColor: 'rgb(223,223,223)',
        borderBottomWidth: 1,
        height: 64,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'grey',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#FF3030',
        right: 0,
    },
    imgstyle: {
        height: theme.screenHeight / 3.5,
        width: theme.screenWidth,
    },
    edit: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: Config.MainFontSize - 2,
        backgroundColor: 'transparent',
        marginLeft: 10,
    },
    first: {
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 44,
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        borderBottomColor: '#e7e7e7',
        borderBottomWidth: 1,
    },
    edit2: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: Config.MainFontSize - 2,
        backgroundColor: 'transparent',
        marginLeft: 12,
        width: theme.screenWidth / 1.5
    },
    edit1: {
        flex: 1,
        height: 20,
        width: 250,
        textAlign: 'left',
        fontSize: Config.MainFontSize - 2,
        backgroundColor: 'transparent',
        marginLeft: (Platform.OS == 'android') ? 14 : 24
    },
    editView2: {
        flex: 1,
        height: px2dp(48),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginTop: 20
    },
    basicInfo: {

        fontSize: Config.MainFontSize + 5,
        fontWeight: 'bold'
    },
    info: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        height: 40,
        //lineHeight: 40,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    companyInfo: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    infoTitle: {
        fontSize: Config.MainFontSize,
        fontWeight: 'bold',
    },
    infoItem: {
        fontSize: Config.MainFontSize
    },
    contactInfoItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        fontSize: Config.MainFontSize,
        justifyContent: 'space-between',
        height: 44,
        margin: 5,
        //lineHeight: 30,
    },
});
