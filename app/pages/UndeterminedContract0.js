/**
 * 企业审核详情
 * Created by 郭亚新 on 2020/02/24.
 */
import React, { Component } from 'react';
import { Text, View, PixelRatio, StyleSheet, ScrollView, TextInput, Alert, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Modal, DeviceEventEmitter } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, Toast, FileManager } from 'c2-mobile';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';
import TimeChange from '../utils/TimeChange';
import { List, Radio } from 'antd-mobile-rn';
import EncryptionUtils from '../utils/EncryptionUtils';
import PcInterface from '../utils/http/PcInterface';
const RadioItem = Radio.RadioItem;

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Toasts from 'react-native-root-toast';

export default class UndeterminedContract0 extends Component {
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
            dataBlob1: '',
            read: false,
            modalVisible_yzm: false,
            settlementId: "",
            settlementItem: {},
            userIdForFile: "",
            filePathList: [],
            ComInfo: ''
        }
        this.getContract()

    }
    getContract() {
        Fetch.getJson(Config.mainUrl + '/companyInfoBF/getCompanyINfoById?infoid=' + this.props.rowData.id + '&type=' + this.props.types)
            .then((res) => {
                Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getUserEntityByUserId/' + res.content.userId)
                    .then((ret) => {
                        console.log(ret)
                        this.setState({
                            ComInfo: ret.companyRegistInfo,
                            ComuserInfo: ret.userInfo
                        })
                    })
                // debugger
                this.setState({
                    dataBlob: res.content,
                    dataBlob1: res.list,
                    contractText: res.acclist,
                    userIdForFile: res.content.userId
                })
                this.getFileList()
            })
    }
    //获取附件列表
    getFileList() {
        //debugger
        let docParams = {
            params: {
                businessKey: this.state.userIdForFile,
            }
        }
        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            this.setState({
                filePathList: entry
            })
        })
    }
    //附件下载后查看
    downLoad(bType) {
        //debugger
        const fileList = this.state.filePathList
        const c_path = Config.mainUrl + "/iframefile/qybdirprocess/download/"
        for (var j in fileList) {
            if (fileList[j].businessType == bType) {
                if (fileList[j].fileType == 'pdf' || fileList[j].fileType == 'PDF') {
                    if (Platform.OS == 'ios') {//没有ios区分
                        Actions.PDFWebView({ url: c_path + encodeURIComponent(fileList[j].filePath) })
                    } else {
                        Actions.PDFWebView({ url: c_path + encodeURIComponent(fileList[j].filePath) })
                    }
                } else if (fileList[j].fileType == 'jpg' || fileList[j].fileType == 'png' || fileList[j].fileType == 'JPG' || fileList[j].fileType == 'PNG') {
                    Actions.ImageZoom({ url: c_path + encodeURIComponent(fileList[j].filePath) })
                } else {
                    Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                        text: '好的', onPress: () => {

                        }
                    }
                    ])
                    // Toast.showInfo('下载中，请耐心等待...', 3000);
                    // var params = {
                    //     source: { uri: c_path + fileList[j].filePath, fileName: fileList[j].fileName },
                    //     dirMode: FileManager.DirMode.cache,
                    //     header: {},
                    // }
                    // debugger
                    // FileManager.downloadFile(params, FileManager.DirMode.cache,
                    //     (events) => {
                    //     }).then((respones) => {
                    //         if (respones) {
                    //             FileManager.openFile(respones)
                    //                 .then((response) => {
                    //                 })
                    //                 .catch((e) => {
                    //                     Toast.showInfo('查看失败，文件已失效或损坏', 1000);
                    //                 })
                    //         }
                    //     }).catch((e) => {
                    //         console.log(e);
                    //     })
                }
            }
        }
    }
    //多个授权委托书
    renderSqwts() {
        let temp = []
        const fileList = this.state.filePathList
        for (var j in fileList) {
            if (fileList[j].businessType == "QY_SQWTS") {
                temp.push(
                    <TouchableOpacity onPress={this.downLoad2.bind(this, fileList[j].fileType, fileList[j].filePath)}>
                        <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>
                            {fileList[j].fileName}
                        </Text>
                    </TouchableOpacity>
                )
            }
        }
        return temp
    }
    downLoad2(fileType, uri) {
        const c_path = Config.mainUrl + "/iframefile/qybdirprocess/download/"
        if (fileType == 'pdf' || fileType == 'PDF') {
            if (Platform.OS == 'ios') {//没有ios区分
                Actions.PDFWebView({ url: c_path + encodeURIComponent(uri) })
            } else {
                Actions.PDFWebView({ url: c_path + encodeURIComponent(uri) })
            }
        } else if (fileType == 'jpg' || fileType == 'png' || fileType == 'JPG' || fileType == 'PNG') {
            Actions.ImageZoom({ url: c_path + encodeURIComponent(uri) })
        } else {
            Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                text: '好的', onPress: () => {

                }
            }
            ])
        }
    }
    reject() {
        if (this.state.rejectReason == '') {
            // Alert.alert('', '请填写驳回原因', [{ text: '好的' },]);
            Toasts.show('请填写驳回原因', { position: -80 });
        } else {
            Alert.alert('确定要提交吗？', '', [{ text: '取消' }, {
                text: '确定', onPress:
                    () => {
                        Toast.show({
                            type: Toast.mode.C2MobileToastLoading,
                            title: '提交中...'
                        });
                        var entity = {
                            id: this.props.rowData.id,
                            userId: this.props.rowData.userId,
                            backReason: this.state.rejectReason
                        }
                        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/rejecteCompanyReason', entity)
                            .then((res) => {
                                this.setState({ modalVisible: false });
                                Toast.dismiss();
                                if (res.status == '200') {
                                    Actions.pop({ refresh: { test: UUID.v4() } })
                                    Toasts.show('驳回成功', { position: -80 });
                                    this.props.onblock()
                                } else {
                                    Toasts.show(res.description, { position: -60 });
                                }
                            }).catch((res1) => {
                                this.setState({ modalVisible: false });
                                Toasts.show(res1.description, { position: -60 });
                            })
                    }
            }])

        }
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        const info = this.state.dataBlob
        if (info.companyName == undefined) {
            return null
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                        <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>企业详情</Text>
                        </View>
                    </ImageBackground>
                    {this.bohuiModal()}
                    <ScrollView style={{ backgroundColor: 'white' }} scrollIndicatorInsets={{ right: 1 }}>
                        <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, marginTop: 10, width: deviceWidth - 10, paddingLeft: 6, paddingRight: 6 }}>
                            <View>
                                <Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize, fontWeight: "bold" }}>基本信息</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>单位名称</Text>
                                <Text style={styles.infoItem}>{info.companyName}</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>单位所属行业</Text>
                                <Text style={styles.infoItem}>{info.companyIndustry}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>单位法人姓名</Text>
                                <Text style={styles.infoItem}>{info.companyLegalName}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>单位电话</Text>
                                <Text style={styles.infoItem}>{info.companyPhone}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={styles.infoItem}>注册地址所在省:</Text>
                                    <Text style={styles.infoItem}>{info.companyProvinceName}</Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={styles.infoItem}>市:</Text>
                                    <Text style={styles.infoItem}>{info.companyCityName}</Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={styles.infoItem}>区/县:</Text>
                                    <Text style={styles.infoItem}>{info.companyAreaName}</Text>
                                </View>
                            </View>
                            <View style={styles.companyInfo} >
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: "bold", marginTop: 10 }} >注册详细地址</Text>
                                <Text style={{ fontSize: Config.MainFontSize, marginTop: 5 }}>{info.companyAddress}</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>开户银行名称</Text>
                                <Text style={styles.infoItem}>{info.bankName}</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>银行账号</Text>
                                <Text style={styles.infoItem}>{info.bankAccount}</Text>
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>纳税人识别号</Text>
                                <Text style={styles.infoItem}>{info.registrationNumber ? info.registrationNumber : "无"}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={styles.infoItem}>联系地址所在省:</Text>
                                    <Text style={styles.infoItem}>{info.companyProvincelxName}</Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={styles.infoItem}>市:</Text>
                                    <Text style={styles.infoItem}>{info.companyCitylxName}</Text>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={styles.infoItem}>区/县:</Text>
                                    <Text style={styles.infoItem}>{info.companyArealxName}</Text>
                                </View>
                            </View>

                            <View style={styles.companyInfo}>
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: "bold", marginTop: 10 }}>联系详细地址</Text>
                                <Text style={{ fontSize: Config.MainFontSize, marginTop: 5 }}>{info.companyAddresslx}</Text>
                            </View>

                            {/* <View style={styles.info}>
                                <Text style={styles.infoTitle}>是否三证合一</Text>
                                <Text style={styles.infoItem}>{info.companyCertificatesType == "1" ? "是" : "否"}</Text>
                            </View> */}
                            {info.companyCertificatesType == "1" ?
                                <View style={styles.info}>
                                    <Text style={styles.infoTitle}>营业执照</Text>
                                    <TouchableOpacity onPress={this.downLoad.bind(this, "QY_SZHY")}>
                                        <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoTitle}>营业执照</Text>
                                        <TouchableOpacity onPress={this.downLoad.bind(this, "QY_YYZZ")}>
                                            <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoTitle}>税务登记</Text>
                                        <TouchableOpacity onPress={this.downLoad.bind(this, "QY_SWDJ")}>
                                            <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.infoTitle}>组织机构代码</Text>
                                        <TouchableOpacity onPress={this.downLoad.bind(this, "QY_ZZJJDM")}>
                                            <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }

                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>授权委托书</Text>
                                <View >{this.renderSqwts()}</View>
                                {/* <TouchableOpacity onPress={this.downLoad.bind(this, "QY_SQWTS")}> */}
                                {/* <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>{this.renderSqwts()}</Text> */}
                                {/* </TouchableOpacity> */}
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>企业公章</Text>
                                <TouchableOpacity onPress={this.downLoad.bind(this, "QY_QYGZ")}>
                                    <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>法人签章</Text>
                                <TouchableOpacity onPress={this.downLoad.bind(this, "QY_FRQZ")}>
                                    <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle} style={{ color: "red" }}>如需预览合同章效果，请前往PC端</Text>
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.infoTitle}>公司规模</Text>
                                <Text style={styles.infoItem}>{info.companyScale}</Text>
                            </View>

                            <View style={styles.companyInfo} >
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: "bold", marginTop: 10 }} >公司信息</Text>
                                <Text style={{ fontSize: Config.MainFontSize, marginTop: 5 }}>{info.companyInfo ? info.companyInfo : "无"}</Text>
                            </View>

                            <View style={{ marginTop: 10, marginBottom: 10 }}>
                                <Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize, fontWeight: "bold" }}>企业联系人信息</Text>
                            </View>
                            <View>
                                <ListView
                                    style={{ borderRadius: 20 }}
                                    dataSource={this.ds.cloneWithRows(this.state.dataBlob1)}
                                    renderRow={this._renderItem.bind(this)}
                                    enableEmptySections={true}
                                />
                            </View>


                            {(this.props.selectNum == 1) ? null : <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                                <Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize, fontWeight: "bold" }}>结算收款账号信息</Text>
                                <TouchableOpacity onPress={() => { this.setState({ modalVisible2: !this.state.modalVisible2 }) }}>
                                    <Text style={{ backgroundColor: 'rgb(65,143,234)', color: "white", fontSize: Config.MainFontSize - 2, padding: 3 }}>请选择</Text>
                                </TouchableOpacity>
                            </View>}


                            {this.state.settlementItem.id !== undefined ? <View>
                                <View style={styles.jsskinfo}>
                                    <Text style={styles.jsskinfotext}>账号名称:{this.state.settlementItem.accountName}</Text>
                                    <Text style={styles.jsskinfotext}>账号:{this.state.settlementItem.accountNo}</Text>
                                    <Text style={styles.jsskinfotext}>开户行:{this.state.settlementItem.openBank}</Text>
                                    <Text style={styles.jsskinfotext}>到账天数:{this.state.settlementItem.tothedate}</Text>
                                </View>
                            </View> : null}

                            {(this.props.selectNum == '1') ? null : < View style={{ display: "flex", flexDirection: "row", alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 88 }}>
                                <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 30 }} onPress={() => this.isReject()}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.isMakeSure(1)}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>通过</Text>
                                </TouchableOpacity>
                            </View>}

                            {this.chooseSettlementModal()}

                        </View>
                    </ScrollView>
                </View >
            );
        }
    }
    _renderItem(rowData) {
        return (
            <View style={{ backgroundColor: "#e8e8e8", borderRadius: 10, marginBottom: 10, paddingLeft: 5, paddingRight: 5 }}>
                <View style={styles.contactInfoItem}>
                    <Text style={styles.infoItem}>{rowData.hrName}</Text>
                    <Text style={styles.infoItem}>职位:{rowData.hrPosition}</Text>
                </View>
                <View style={styles.contactInfoItem}>
                    <Text style={styles.infoItem}>办公电话:{rowData.hrWorkNumber}</Text>
                    <Text style={styles.infoItem}>手机号码:{rowData.hrMobile}</Text>
                </View>
                <View style={styles.contactInfoItem}>
                    <Text style={styles.infoItem}>邮箱:{rowData.hrEmail == '' ? '无' : rowData.hrEmail}</Text>
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
    isReject() {
        Fetch.getJson(Config.mainUrl + '/companyInfoBF/' + this.props.rowData.id)
            .then((ret) => {
                console.warn('数据状态为:' + ret.auditType)
                if (ret.auditType != '1') {
                    Alert.alert('提示', '此条数据已被其他用户处理,请返回列表刷新获取最新内容', [{
                        text: '确定', onPress: () => { Actions.pop() }
                    },])
                } else {
                    this.setState({
                        modalVisible: !this.state.modalVisible
                    })
                }
            })
    }
    isMakeSure(value) {
        // if (value == 0) {//驳回
        //     Alert.alert('温馨提示', '是否确认驳回？', [{
        //         text: '再看看', onPress: () => { }
        //     }, {
        //         text: '确定', onPress: () => {

        //             var entity = {
        //                 backReason: "",
        //                 id: this.props.rowData.id,
        //                 userId: this.props.rowData.userId
        //             }
        //             Fetch.postJson(Config.mainUrl + '/companyRegistInfo/rejecteCompanyReason', entity)
        //                 .then((res) => {
        //                     this.setState({ modalVisible: false })
        //                     Toasts.show('提交成功', { position: -80 });
        //                     Actions.pop({ refresh: { test: UUID.v4() } })
        //                 }).catch((res1) => {
        //                     Toasts.show(res1.description, { position: -60 });
        //                 })

        //         }
        //     }])
        // }
        // if (value == 1) {//通过
        if (this.state.settlementId == "") {
            Alert.alert('温馨提示:', '请选择结算收款账号信息', [{ text: '确定' },]);
            return
        }

        if (this.state.ComuserInfo.remark7 && this.state.ComuserInfo.remark9 && this.state.ComuserInfo.remark10) {
            Fetch.getJson(Config.mainUrl + '/companyInfoBF/' + this.props.rowData.id)
                .then((ret) => {
                    console.warn('数据状态为:' + ret.auditType)
                    if (ret.auditType != '1') {
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
                                    backReason: this.state.rejectReason,
                                    accountId: this.state.settlementId,
                                    id: this.props.rowData.id,
                                    userId: this.props.rowData.userId,
                                    list: this.state.dataBlob1
                                }
                                Fetch.postJson(Config.mainUrl + '/companyRegistInfo/approvedCompanyMobile', entity)
                                    .then((res) => {
                                        Toast.dismiss();
                                        if (res.status == '200') {
                                            this.setState({ modalVisible: false })
                                            Toasts.show('提交成功,请去PC端进行该企业服务费配置', { position: -80, duration: 2000 });
                                            this.props.onblock();
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
        } else {
            Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getFadadaAuthCompanyurl/' + this.state.ComInfo.id)
                .then((ret) => {
                    if (ret.remark7 != '0') {
                        Toasts.show('审核失败，请返回重新提交', { position: -60 });
                    } else {
                        Fetch.getJson(Config.mainUrl + '/companyInfoBF/' + this.props.rowData.id)
                            .then((ret) => {
                                console.warn('数据状态为:' + ret.auditType)
                                if (ret.auditType != '1') {
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
                                                backReason: this.state.rejectReason,
                                                accountId: this.state.settlementId,
                                                id: this.props.rowData.id,
                                                userId: this.props.rowData.userId,
                                                list: this.state.dataBlob1
                                            }
                                            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/approvedCompanyMobile', entity)
                                                .then((res) => {
                                                    Toast.dismiss();
                                                    if (res.status == '200') {
                                                        this.setState({ modalVisible: false })
                                                        Toasts.show('提交成功,请去PC端进行该企业服务费配置', { position: -80, duration: 2000 });
                                                        this.props.onblock();
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
                })
        }
    }
    // }
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
                <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ modalVisible2: false })}>
                </TouchableOpacity>
                <View style={{ position: "absolute", width: deviceWidth - 40, borderColor: "#f8f8f8", marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderRadius: 10, backgroundColor: 'white', alignSelf: "center", }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 55, backgroundColor: "#076edf", borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                        <Text style={{ color: "#fff", marginLeft: 10 }}>点击选择结算收款账号信息</Text>
                        <VectorIcon onPress={() => this.setState({ modalVisible2: false })} name={'android-close'} style={{ color: '#fff', fontSize: 22, backgroundColor: 'transparent' }} />
                    </View>

                    <ScrollView style={{ width: deviceWidth - 40 }} scrollIndicatorInsets={{ right: 1 }}>
                        <ListView
                            style={{ borderRadius: 20 }}
                            dataSource={this.ds.cloneWithRows(this.state.contractText)}
                            renderRow={this._renderSettlement.bind(this)}
                            enableEmptySections={true}
                        />
                    </ScrollView>
                </View>
            </Modal>
        )
    }
    _renderSettlement(rowData) {
        const value = this.state.settlementId
        return (
            <View style={{ borderColor: "#eee", borderWidth: 1, margin: 10, borderRadius: 10 }}>
                <RadioItem style={{ borderRadius: 10 }} name={rowData.id} key={rowData.id} checked={value === rowData.id} onChange={() => this.handleChooseRadio(rowData)}>
                    <View>
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
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>驳回原因</Text></View>
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
                                <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.reject.bind(this)}>
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
    jsskinfo: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    jsskinfotext: {
        margin: 5,
        fontSize: Config.MainFontSize,
    },
    companyInfo: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    infoTitle: {
        fontSize: Config.MainFontSize,
        fontWeight: 'bold',
        //lineHeight: 38
    },
    infoItem: {
        fontSize: Config.MainFontSize,
        //lineHeight:35
    },
    contactInfoItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        height: 40,
        //lineHeight: 30,
    },
});
