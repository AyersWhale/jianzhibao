/**
 * 发包审核
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, PixelRatio, StyleSheet, ScrollView, TextInput, Alert, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Modal, DeviceEventEmitter } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, Toast } from 'c2-mobile';
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


export default class UndeterminedContract3 extends Component {
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
            filePathList: []
        }
        this.getContract()
    }
    getContract() {
        //debugger
        var params = {
            id: this.props.rowData.id
        }
        Fetch.getJson(Config.mainUrl + '/temporaryWork/viewJobApp?id=' + this.props.rowData.id)
            .then((res) => {
                // debugger
                console.log(res)
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
        // debugger
        const fileList = this.state.filePathList
        const c_path = Config.mainUrl + "/iframefile/qybdirprocess/download/"
        for (var j in fileList) {
            if (fileList[j].businessType == bType) {
                if (fileList[j].fileType == 'pdf' || fileList[j].fileType == 'PDF') {
                    Actions.PDFWebView({ url: c_path + encodeURIComponent(fileList[j].filePath) })
                } else if (fileList[j].fileType == 'jpg' || fileList[j].fileType == 'png' || fileList[j].fileType == 'JPG' || fileList[j].fileType == 'PNG') {
                    if (Platform.OS == 'ios') {
                        Actions.C2WebView({ url: c_path + fileList[j].path })
                    } else {
                        Actions.ImageView({ url: c_path + fileList[j].path })
                    }
                } else {
                    Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                        text: '好的', onPress: () => {

                        }
                    }
                    ])
                }
            }
        }
    }
    reject() {
        var entity = {
            id: this.props.rowData.id,
            reason: this.state.rejectReason,
            workType: this.props.rowData.REMARK1
        }
        //debugger
        Fetch.postJson(Config.mainUrl + '/fqrzContract/contractReject', entity)
            .then((res) => {
                console.log(res)
                Actions.pop({ refresh: { test: UUID.v4() } })
            })
    }
    componentWillReceiveProps(nextProps) {
        Actions.pop({ refresh: { test: UUID.v4() } })
    }
    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;

    }
    render() {
        const rowData = this.props.rowData
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
                <ScrollView style={{ backgroundColor: 'white', }} >
                    <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, marginTop: 10, width: deviceWidth - 10, paddingLeft: 6, paddingRight: 6 }}>
                        <View style={styles.basicInfo}>
                            <Text style={{ color: 'rgb(65,143,234)' }}>基本信息</Text>
                        </View>

                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize, }}>公司名称:{rowData.releaseCompanyName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize, }}>发包名称:{rowData.positionName}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginRight: 5 }}>发包需求:{rowData.jobDescription}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginRight: 5 }}>发包需求:{rowData.jobDescription}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, }}>发包金额:{rowData.salary} 元</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginRight: 5 }}>用工结束时间:{this.timeChange(rowData.workEndTime)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, }}>备注:{rowData.remark || "无"}</Text>
                            </View>
                        </View>

                        <View style={{ display: "flex", flexDirection: "row", alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 88 }}>
                            <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 30 }} onPress={() => this.isMakeSure(0)}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.isMakeSure(1)}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>通过</Text>
                            </TouchableOpacity>
                        </View>

                        {this.chooseSettlementModal()}

                    </View>
                </ScrollView>
            </View >
        );
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
        if (value == 0) {//驳回
            Alert.alert('温馨提示', '是否确认驳回？', [{
                text: '再看看', onPress: () => { }
            }, {
                text: '继续', onPress: () => {
                    Toast.show({
                        type: Toast.mode.C2MobileToastLoading,
                        title: '提交中...'
                    });
                    var entity = {
                        status: "3",
                        reason: this.state.rejectReason,
                        id: this.props.rowData.id,
                        //userId: this.props.rowData.userId,
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                    }
                    Fetch.postJson(Config.mainUrl + '/companyRegistInfo/rejecteCompanyReason', entity)
                        .then((res) => {
                            Toast.dismiss();
                            if (res.status == '200') {
                                Toasts.show('提交成功', { position: -80 });
                                Actions.pop({ refresh: { test: UUID.v4() } })
                            } else {
                                Toasts.show(res.Msg, { position: -60 });
                            }
                        }).catch((res1) => {
                            Toasts.show(res1.description, { position: -60 });
                        })

                }
            }])
        }
        if (value == 1) {//通过
            if (this.state.settlementId == "") {
                Alert.alert('温馨提示:', '请选择结算收款账号信息', [{ text: '确定' },]);
                return
            }
            Alert.alert('提示', '您确认提交吗？', [{
                text: '再看看', onPress: () => { }
            }, {
                text: '继续', onPress: () => {
                    Toast.show({
                        type: Toast.mode.C2MobileToastLoading,
                        title: '提交中...'
                    });
                    var entity = {
                        status: "2",
                        accountId: this.state.settlementId,
                        id: this.props.rowData.id,
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                    }
                    Fetch.postJson(Config.mainUrl + '/companyRegistInfo/approvedCompanyMobile', entity)
                        .then((res) => {
                            Toast.dismiss();
                            if (res.status == "200") {
                                Toasts.show('提交成功', { position: -80 });
                                //刷新首页未读消息数量
                                DeviceEventEmitter.emit('change3')
                                Actions.pop({ refresh: { test: UUID.v4() } })
                            } else {
                                Toasts.show(res.Msg, { position: -60 });
                            }
                        }).catch((res1) => {
                            Toasts.show(res1.description, { position: -60 });
                        })

                }
            }])
        }
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
                    <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>驳回合同</Text></View>
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
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible_yzm}
                    onRequestClose={() => { }}
                >
                    <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 5 - 30, height: (Platform.OS == 'ios') ? deviceHeight * 3 / 8 + 20 : deviceHeight / 2, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>请先短信验证</Text></View>
                        <View style={underLiner.liners} />
                        <View style={{ width: deviceWidth - 80, height: (Platform.OS == 'ios') ? 50 : 150, backgroundColor: '#E8E8E8' }}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#E8E8E8' }}>
                                <VectorIcon
                                    name="mobile_phone"
                                    size={36}   //图片大小
                                    color='black'  //图片颜色

                                    style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 30 }}
                                />
                                <View style={styles.editView2}>
                                    <TextInput
                                        style={styles.edit}
                                        underlineColorAndroid="transparent"
                                        keyboardType='numeric'
                                        value={this.telphone}
                                        placeholder="手机号"
                                        editable={(this.telphone == undefined) ? true : false}
                                        placeholderTextColor='#c4c4c4'
                                        onChangeText={(text) => { this.telphone = text }}
                                    />
                                </View>
                            </View>
                            <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 80, alignSelf: 'center' }} />
                            <View style={{ flexDirection: 'row', backgroundColor: '#E8E8E8' }}>
                                <VectorIcon
                                    name="c2_im_weixin_keyboard"
                                    size={32}   //图片大小
                                    color='black'  //图片颜色
                                    style={{ alignSelf: 'center', marginLeft: 24, marginTop: 3 }}
                                />
                                <View style={styles.editView2}>
                                    <TextInput
                                        style={styles.edit1}
                                        underlineColorAndroid="transparent"
                                        keyboardType='numeric'
                                        placeholder={(Platform.OS == 'ios') ? "验证码" : "验证码"}
                                        placeholderTextColor='#c4c4c4'
                                        onChangeText={(text) => { this.bendiCode = text }}
                                    />
                                </View>
                                {this.state.resetAuthCode == false ? <TouchableOpacity style={{ width: 100, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 40, marginTop: 14, borderRadius: 5 }} onPress={() => this._countTime()}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>获取验证码</Text></TouchableOpacity>
                                    : <TouchableOpacity disabled={true} style={{ width: 50, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 40, marginTop: 14, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={{ marginTop: (Platform.OS == 'ios') ? deviceWidth / 3 : 0, flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60 }}>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 45, marginRight: 45 }}>
                                <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible_yzm: !this.state.modalVisible_yzm })}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.makesure.bind(this)}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>验证</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible_yzm: false })}>
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

        fontSize: Config.MainFontSize + 2,
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
        justifyContent: 'space-between',
        height: 30,
        //lineHeight: 30,
    }
});
