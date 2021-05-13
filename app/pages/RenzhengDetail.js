/**
 * 认证详情
 * Created by 曾一川 on 06/12/18.
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
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class RenzhengDetail extends Component {
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
            dataSource: [],
        }
        this.getContract()
        this.getFileList()
    }
    getContract() {
        //debugger
        Fetch.getJson(Config.mainUrl + '/companyInfoBF/getCompanyINfoById?infoid=' + this.props.rowData.id + '&type=' + this.props.types)
            .then((res) => {
                this.setState({
                    dataBlob: res.content,
                    dataBlob1: res.list,
                    contractText: res.acclist,
                    userIdForFile: res.content.userId
                })
            })
    }
    //获取附件列表
    getFileList() {
        //debugger
        let docParams = {
            params: {
                businessKey: this.props.rowData.userId,
            }
        }
        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            //debugger
            let entry = set.result.rdata.filelist;
            this.setState({
                dataSource: entry
            })
        })
    }
    //附件下载后查看
    downLoad(uri) {
        Actions.ImageZoom({ url: uri })
    }
    downLoad2(uri, fileType, fileName) {
        const c_path = Config.mainUrl + "/iframefile/qybdirprocess/download/"
        // const aa = 'http://www.hryscm.cn/hr/iframefile/qybdirprocess/download/'
        // const tempurl = "20200305/008503/35OA续费合同.pdf"
        if (fileType == 'pdf' || fileType == 'PDF') {
            if (Platform.OS == 'ios') {
                //debugger
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
            // Toast.showInfo('下载中，请耐心等待...', 3000);
            // var params = {
            //     source: { uri: c_path + uri, fileName: "1.docx" },
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
    reject() {
        if (this.state.rejectReason == '') {
            Toasts.show('请填写驳回原因', { position: -80 });
        } else {
            Toast.show({
                type: Toast.mode.C2MobileToastLoading,
                title: '驳回中...'
            });
            var entity = {//type  审核通过为 3，驳回为   4  （必填）
                type: "4",
                backReason: this.state.rejectReason,
                id: this.props.rowData.id,
                userId: this.props.rowData.userId
            }
            // debugger
            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/auditsecondcompany', entity)
                .then((res) => {
                    Toast.dismiss();
                    this.setState({ modalVisible: false })
                    if (res.status == '200') {
                        this.setState({ modalVisible: false })
                        Toasts.show('驳回成功', { position: -80 });
                        this.props.onblock()
                        Actions.pop({ refresh: { test: UUID.v4() } })
                    } else {
                        Toasts.show(res.data, { position: -60 });
                    }
                }).catch((res1) => {
                    Toasts.show(res1.description, { position: -60 });
                    this.setState({ modalVisible: false })
                })
        }

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>认证详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>认证详情</Text>
                    </View>
                </View>

                <ScrollView style={{ backgroundColor: 'white' }} scrollIndicatorInsets={{ right: 1 }}>
                    <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, marginTop: 10, width: deviceWidth - 10, paddingLeft: 6, paddingRight: 6 }}>
                        <View style={styles.basicInfo}>
                            <Text style={{ color: 'rgb(65,143,234)' }}>基本信息</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {this.renderListView()}
                        </View>
                        {(this.props.selectNum == '1') ? null : <View style={{ display: "flex", flexDirection: "row", alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 88 }}>
                            <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 30 }} onPress={() => this.isReject()}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.isMakeSure(1)}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>通过</Text>
                            </TouchableOpacity>
                        </View>}

                        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {this.bohuiModal()}
                        </View>
                    </View>
                </ScrollView>
            </View >
        );
    }
    renderListView() {
        var list = this.state.dataSource
        var temp = [];
        for (let i in list) {
            if (list[i].businessType == 'idCard_front' || list[i].businessType == 'idCard_back') {
                temp.push(
                    <View style={{ width: deviceWidth / 2 - 20, backgroundColor: 'white', marginTop: 10 }}>
                        <Text style={{ marginTop: 10 }}>{list[i].businessType == 'idCard_front' ? '法人身份证' : list[i].businessType == 'idCard_back' ? '法人身份证' : null}</Text>
                        {list[i].businessType == 'idCard_front' || list[i].businessType == 'idCard_back' ?
                            <Image source={{ uri: Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath }} style={{ width: deviceWidth / 2, height: deviceWidth / 2, alignSelf: 'center', margin: 10 }} />
                            : null}
                        <TouchableOpacity onPress={this.downLoad.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath)}>
                            <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
        for (let i in list) {
            if (list[i].businessType == 'QY_FRSQS' || list[i].businessType == 'QY_GSTTZP') {
                temp.push(
                    <View style={{ width: deviceWidth / 2 - 20, backgroundColor: 'white', marginTop: 10 }}>
                        <Text style={{ marginTop: 10 }}>{list[i].businessType == 'QY_FRSQS' ? '法人私章' : list[i].businessType == 'QY_GSTTZP' ? '公司抬头照片' : null}</Text>
                        {list[i].businessType == 'QY_FRSQS' || list[i].businessType == 'QY_GSTTZP' ?
                            <Image source={{ uri: Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath }} style={{ width: deviceWidth / 2, height: deviceWidth / 2, alignSelf: 'center', margin: 10 }} />
                            : null}
                        <TouchableOpacity onPress={this.downLoad.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + list[i].filePath)}>
                            <Text style={styles.infoItem} style={{ color: 'rgb(65,143,234)' }}>查看</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        }
        for (let i in list) {
            if (list[i].businessType == "QY_GSFP") {
                temp.push(
                    <View style={{ display: "flex", flexDirection: "row", height: 30, marginTop: 20 }}>
                        <Text style={{ fontWeight: "bold" }}>附件：</Text>
                        <Text >{list[i].displayName}</Text>
                        <TouchableOpacity onPress={this.downLoad2.bind(this, list[i].filePath, list[i].fileType, list[i].fileName)}>
                            <Text style={{ color: 'rgb(65,143,234)', marginLeft: 20 }}>查看</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }
        return temp

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
    isReject() {
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/' + this.props.rowData.id)
            .then((ret) => {
                console.warn('数据状态为:' + ret.hrEmailPassword)
                if (ret.hrEmailPassword != '2') {
                    Alert.alert('提示', '此条数据已被其他用户处理,请返回列表刷新获取最新内容', [{
                        text: '确定', onPress: () => { Actions.pop() }
                    },])
                } else {
                    this.setState({
                        modalVisible: true
                    })
                }
            })
    }
    isMakeSure(value) {
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/' + this.props.rowData.id)
            .then((ret) => {
                console.warn('数据状态为:' + ret.hrEmailPassword)
                if (ret.hrEmailPassword != '2') {
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
                            var entity = {//type  审核通过为 3，驳回为   4  （必填）
                                type: "3",
                                backReason: '',
                                //accountId: this.state.settlementId,
                                id: this.props.rowData.id,
                                userId: this.props.rowData.userId
                            }
                            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/auditsecondcompany', entity)
                                .then((res) => {
                                    Toast.dismiss();
                                    if (res.status == '200') {
                                        this.setState({ modalVisible: false });
                                        this.props.onblock()
                                        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getFadadaAuthCompanyurl/' + this.props.rowData.id)
                                            .then((ret) => {
                                                Toasts.show('提交成功', { position: -80 });
                                                Actions.pop({ refresh: { test: UUID.v4() } })
                                            })
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
