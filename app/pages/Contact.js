/**
 * 合同
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, Alert } from 'react-native';
import { Actions, FileManager, Config, SafeArea, SegmentedControl, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import TimeChange from '../utils/TimeChange';
import Toasts from 'react-native-root-toast'
import { workTypeByCode } from '../utils/common/businessUtil'
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class UndeterminedContract extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            result1: [],
            selectNum: '0',
            ifzero: false,
            ifzero1: false,
            ifzero2: false,
            result2: [],
        }
        this.getContractList()
        this.getContractList2()
        this.getContractList1()
        this.refresh()
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
        this.setState = (state, callback) => {
            return;
        };
        this.subscription.remove();
    }
    componentWillReceiveProps() {
        this.getContractList();
        this.getContractList1();
        this.getContractList2();
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('yiqian', (text) => {
            this.getContractList()
            this.getContractList2()
            this.getContractList1()
        })
    }
    refresh() {
        // this._timer = setInterval(() => {
        //     this.getContractList();
        //     this.getContractList1();
        //     this.getContractList2();
        // }, 1000);
    }
    //获取合同信息
    getContractList() {
        var conds1 = {
            //这里传参数
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        };
        var url = Config.mainUrl + "/fqrzContract/getContractManageList?rows=100&page=1&type=1&cond=" + escape(JSON.stringify(conds1));
        Fetch.getJson(url)
            .then((res) => {
                console.log(res)
                if (res.contents.length == 0) {
                    this.setState({
                        ifzero: true
                    })
                }
                this.setState({
                    result: res.contents,
                })
            })
    }
    //获取预警信息
    getContractList2() {
        var conds1 = {
            //这里传参数
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        };
        var url = Config.mainUrl + "/fqrzContract/getContractWarningList?rows=100&page=1&type=1&cond=" + escape(JSON.stringify(conds1));
        Fetch.getJson(url)
            .then((res) => {
                console.log(res.contents)
                if (res.contents.length == 0) {
                    this.setState({
                        ifzero2: true
                    })
                }
                this.setState({
                    result2: res.contents,
                })
            })
    }

    //获取已签订合同列表
    getContractList1() {
        var entity = {
            yfIdcard: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
        }
        if (this.props.identity == 'boss') {
            return (
                null
            )
        } else {
            Fetch.postJson(Config.mainUrl + '/fqrzContract/viewPersonalContract', entity)
                .then((res) => {
                    console.log(res)
                    if (res.length > 0) {
                        this.setState({
                            result1: res
                        })
                    } else {
                        this.setState({
                            ifzero1: true
                        })
                    }
                })
        }
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        if (this.props.identity == 'student') {
            return (
                <View style={{ backgroundColor: '#E8E8E8', flex: 1 }} >
                    {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>已处理合同</Text>
                        </View>
                    </ImageBackground> */}
                    <View style={{ display: 'flex', width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', justifyContent: 'center' }}>
                        <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>已处理合同</Text>
                        </View>
                    </View>
                    <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 150 }}>
                        {this.showDiff()}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{ backgroundColor: 'white', flex: 1 }} >
                    {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>合同信息</Text>
                        </View>
                    </ImageBackground> */}
                    <View style={{ width: deviceWidth, height: 70 + SafeArea.top, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                        {/* <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 40, position: 'absolute', width: 100, height: 50 }}>
                            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity> */}
                        <View style={{ marginTop: 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>合同信息</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{ width: deviceWidth, backgroundColor: 'white' }}  >
                            <SegmentedControl
                                ref={'C2SegmentedControl'}
                                itemDatas={[{ name: '合同信息' }, { name: '预警信息' }]}
                                hasChanged={this._SelectPlanItem.bind(this)}
                                tintColor={'rgb(22,131,251)'}
                            />
                            <ScrollView style={{ backgroundColor: 'white', marginTop: 10 }} scrollIndicatorInsets={{ right: 1 }}>
                                {
                                    this.state.selectNum == '0' ? <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 400 }}>
                                        {this.showDiffContract()}
                                    </View> :
                                        this.state.selectNum == '1' ? <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 400 }}>
                                            {this.showDiffWarn()}
                                        </View> :
                                            null
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
            );
        }


    }
    showDiff() {
        if (this.state.ifzero1 == true) {
            return (
                <View style={{ height: deviceHeight - 300, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <ListView
                        style={{ flex: 1, borderRadius: 10, marginTop: 10, marginBottom: 10 }}
                        dataSource={this.ds.cloneWithRows(this.state.result1)}
                        renderRow={this._renderItem1.bind(this)}
                        enableEmptySections={true}
                    />
                </ScrollView>
            )
        }
    }
    showDiffContract() {
        if (this.state.ifzero == true) {
            return (
                <View style={{ height: deviceHeight - 300, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <ListView
                        style={{ flex: 1, borderRadius: 10, marginTop: 10, marginBottom: 10 }}
                        dataSource={this.ds.cloneWithRows(this.state.result)}
                        renderRow={this._renderItem.bind(this)}
                        enableEmptySections={true}
                    />
                </ScrollView>
            )
        }
    }
    showDiffWarn() {
        if (this.state.ifzero2 == true) {
            return (
                <View style={{ height: deviceHeight - 300, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <ListView
                        style={{ flex: 1, borderRadius: 10, marginTop: 10, marginBottom: 10 }}
                        dataSource={this.ds.cloneWithRows(this.state.result2)}
                        renderRow={this._renderItem2.bind(this)}
                        enableEmptySections={true}
                    />
                </ScrollView>
            )
        }
    }
    _renderItem2(rowData) {
        // debugger
        var url = Config.mainUrl + '/ws/getFilePathByApp?id=' + rowData.ID + '&type=' + rowData.WORK_TYPE;
        var entity = {
            contractId: rowData.CONTRACT_NO ? rowData.CONTRACT_NO : null
        }
        return (
            <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 20, marginBottom: Platform.OS == 'ios' ? 10 : 20 }}
                onPress={() => {
                    !rowData.CONTRACT_NO ? fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then((res) => res.text())
                        .then((res) => {
                            console.log(res)
                            if (rowData.STATUS == 'YBH') {
                                return null
                            } else if (rowData.STATUS == 'YXF') {
                                Toasts.show('已下发合同请去PC端查看！', { position: -80 });
                            } else if (res == "false") {
                                Toasts.show('未找到合同,请联系管理员', { position: -80 });
                            } else {
                                if (Platform.OS == 'ios') {
                                    Actions.C2WebView({ url: Config.mainUrl + '/' + res })
                                } else {
                                    Actions.C2WebView({ url: Config.mainUrl + '/pdfview.html?' + res })
                                }

                            }
                        }) : Fetch.postJson(Config.mainUrl + '/Contract/viewContract?params=' + JSON.stringify(entity))
                            .then((ret) => {
                                Actions.C2WebView({ url: ret.url })
                            })
                }
                }>
                <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: Platform.OS == 'ios' ? 10 : 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 3 * 2 }}>{rowData.JOB_CONTENT}</Text>
                        <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', position: 'absolute', right: 10, color: 'red' }}>{rowData.EXPIRY_DAYS.substring(1, 2) <= '0' ? '已失效' : rowData.EXPIRY_DAYS}</Text>
                        {/* <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', position: 'absolute', right: 10, color: 'red' }}>{rowData.EXPIRED_DAYS <= 0 ? '已失效' : rowData.EXPIRY_DAYS}</Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{rowData.YF_EMPLOYEE}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{rowData.YF_IDCARD.substring(0, 3) + '***********' + rowData.YF_IDCARD.substring(14, 18)}</Text>
                    </View>
                    {rowData.REJECT_REASON == '' || rowData.REJECT_REASON == undefined ? null :
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>驳回原因：{rowData.REJECT_REASON}</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{workTypeByCode(rowData.WORK_TYPE)}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5, position: 'absolute', right: 10, top: 20 }}>更新日期:{this.timeChange(rowData.UPDATE_TIME)}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: 50, marginTop: 10, alignContent: 'center', flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', padding: 2, textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{(rowData.STATUS == 'YXF' ? '已下发' : rowData.STATUS == 'CN' ? '草拟' : rowData.STATUS == 'YXF' ? '已下发' : rowData.STATUS == 'YQD' ? '已签订' : rowData.STATUS == 'YBH' ? '已驳回' : rowData.STATUS == 'YZZ' ? '已终止' : rowData.STATUS == 'YDQ' ? '已到期' : rowData.STATUS == 'JDQ' ? '将到期' : rowData.STATUS == 'YGQ' ? '已过期' : null)}</Text>
                        </View>
                        <View style={{ width: 50, marginTop: 10, alignContent: 'center', flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', padding: 2, textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{(rowData.settleType == '1' ? '线下结算' : '线上结算')}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'grey', width: deviceWidth - 10, alignSelf: 'center', height: 0.5 }} />
            </TouchableOpacity>
        )

    }
    _renderItem(rowData) {
        debugger
        var url = url = Config.mainUrl + '/ws/getFilePathByApp?id=' + rowData.ID + '&type=' + rowData.WORK_TYPE;
        var entity = {
            contractId: rowData.CONTRACT_NO ? rowData.CONTRACT_NO : null
        }
        return (
            <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 20, marginBottom: Platform.OS == 'ios' ? 10 : 20 }}
                onPress={() => {
                    debugger
                    !rowData.CONTRACT_NO ? fetch(url, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then((res) => res.text())
                        .then((res) => {
                            console.log(res)
                            if (rowData.STATUS == 'YBH') {
                                return null
                            } else if (rowData.STATUS == 'YXF') {
                                Toasts.show('已下发合同请去PC端查看！', { position: -80 });
                            } else if (res == "false") {
                                Toasts.show('未找到合同,请联系管理员', { position: -80 });
                            } else if (rowData.settleType == "1" && rowData.WORK_TYPE == "LSYG") {
                                this.XxHhr(res)
                            }
                            else {
                                if (Platform.OS == 'ios') {
                                    Actions.C2WebView({ url: Config.mainUrl + '/' + res })
                                } else {
                                    Actions.C2WebView({ url: Config.mainUrl + '/pdfview.html?' + res })
                                }

                            }
                        }) : rowData.settleType == "1" && rowData.WORK_TYPE == "LSYG" ?
                            fetch(Config.mainUrl + '/ws/getFilePathByApp?id=' + rowData.ID + '&type=LSCL_CONTRACT', {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                                .then((res) => res.text())
                                .then((res) => {
                                    var result = JSON.parse(res)
                                    // console.log((result)
                                    if (result.length == 1) {
                                        if (result[0].type == 'PDF' || result[0].type == 'pdf') {
                                            Actions.PDFWebView({ url: Config.mainUrl + '/' + result[0].path })
                                        } else if (result[0].type == 'jpg' || result[0].type == 'png' || result[0].type == 'JPG' || result[0].type == 'PNG') {
                                            if (Platform.OS == 'ios') {
                                                Actions.C2WebView({ url: Config.mainUrl + '/' + result[0].path })
                                            } else {
                                                Actions.ImageZoom({ url: Config.mainUrl + '/' + result[0].path })
                                            }
                                        } else if (result[0].type == 'docx' || result[0].type == 'doc') {
                                            Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                                                text: '好的', onPress: () => {

                                                }
                                            }])
                                        } else {
                                            Toast.showInfo('无法打开该文件,请检查格式是否正确', 2000);
                                        }
                                    } else {
                                        Actions.ContactFj({ dataSource: result })
                                    }
                                    // Actions.PDFWebView({ url: Config.mainUrl + '/' + res })
                                })
                            : Fetch.postJson(Config.mainUrl + '/Contract/viewContract?params=' + JSON.stringify(entity))
                                .then((ret) => {
                                    Actions.C2WebView({ url: ret.url })
                                })
                }
                }>
                <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: Platform.OS == 'ios' ? 10 : 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 3 * 2 }}>{rowData.JOB_CONTENT}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{rowData.YF_EMPLOYEE}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{rowData.YF_IDCARD.substring(0, 3) + '***********' + rowData.YF_IDCARD.substring(14, 18)}</Text>
                    </View>
                    {rowData.REJECT_REASON == '' || rowData.REJECT_REASON == undefined ? null :
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>驳回原因：{rowData.REJECT_REASON}</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{workTypeByCode(rowData.WORK_TYPE)}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5, position: 'absolute', right: 10, top: 20 }}>更新日期:{this.timeChange(rowData.UPDATE_TIME)}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: 50, marginTop: 10, alignContent: 'center', flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', padding: 2, textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{(rowData.STATUS == 'YXF' ? '已下发' : rowData.STATUS == 'CN' ? '草拟' : rowData.STATUS == 'YXF' ? '已下发' : rowData.STATUS == 'YQD' ? '已签订' : rowData.STATUS == 'YBH' ? '已驳回' : rowData.STATUS == 'YZZ' ? '已终止' : rowData.STATUS == 'YDQ' ? '已到期' : rowData.STATUS == 'JDQ' ? '将到期' : rowData.STATUS == 'YGQ' ? '已过期' : null)}</Text>
                        </View>
                        <View style={{ width: 50, marginTop: 10, alignContent: 'center', flexDirection: 'row' }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', padding: 2, textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{(rowData.settleType == '1' ? '线下结算' : '线上结算')}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'grey', width: deviceWidth - 10, alignSelf: 'center', height: 0.5 }} />
            </TouchableOpacity>
        )

    }
    XxHhr(rowData) {
        // Actions.PDFWebView({ url: c_path + encodeURIComponent(uri) })
        console.log
    }
    _renderItem1(rowData) {
        var url = Config.mainUrl + '/ws/getFilePathByApp?id=' + rowData.id + '&type=' + rowData.REMARK1;
        var entity = {
            contractId: rowData.contractNo
        }
        return (
            <TouchableOpacity style={{ backgroundColor: 'white', width: deviceWidth, flex: 1, marginBottom: Platform.OS == 'ios' ? 5 : 10 }}
                onPress={() => {
                    rowData.settleType == "1" && rowData.REMARK1 == "LSYG" ?
                        fetch(Config.mainUrl + '/ws/getFilePathByApp?id=' + rowData.id + '&type=LSCL_CONTRACT', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then((res) => res.text())
                            .then((res) => {
                                var result = JSON.parse(res)
                                console.warn(result)
                                if (result.length == 1) {
                                    if (result[0].type == 'PDF' || result[0].type == 'pdf') {
                                        Actions.PDFWebView({ url: Config.mainUrl + '/' + result[0].path })
                                    } else if (result[0].type == 'jpg' || result[0].type == 'png' || result[0].type == 'JPG' || result[0].type == 'PNG') {
                                        if (Platform.OS == 'ios') {
                                            Actions.C2WebView({ url: Config.mainUrl + '/' + result[0].path })
                                        } else {
                                            Actions.ImageZoom({ url: Config.mainUrl + '/' + result[0].path })
                                        }
                                    } else if (result[0].type == 'docx' || result[0].type == 'doc') {
                                        Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                                            text: '好的', onPress: () => {

                                            }
                                        }])
                                    } else {
                                        Toast.showInfo('无法打开该文件,请检查格式是否正确', 2000);
                                    }
                                } else {
                                    Actions.ContactFj({ dataSource: result })
                                }
                                // Actions.PDFWebView({ url: Config.mainUrl + '/' + res })
                            }) : Fetch.postJson(Config.mainUrl + '/Contract/viewContract?params=' + JSON.stringify(entity))
                                .then((ret) => {
                                    Actions.C2WebView({ url: ret.url })
                                })
                }
                }>
                <View style={{ backgroundColor: 'transparent', marginLeft: 20, paddingTop: 10, paddingBottom: Platform.OS == 'ios' ? 10 : 5, minHeight: 120 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', maxWidth: deviceWidth / 1.8, color: '#333' }}>{rowData.jobContent}</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.money}</Text>
                    </View>


                    <View style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: 40, right: 15 }}>
                        <View style={{ marginTop: 10, alignContent: 'center' }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 3, color: 'white', backgroundColor: '#3E7EFE', padding: 5, textAlign: 'center',
                                fontWeight: '500',
                                width: 70
                            }}>{(rowData.statu == 'YXF' ? '已下发' : rowData.statu == 'CN' ? '草拟' : rowData.statu == 'YXF' ? '已下发' : rowData.statu == 'YQD' ? '已签订' : rowData.statu == 'YBH' ? '已驳回' : rowData.statu == 'YZZ' ? '已终止' : rowData.statu == 'YDQ' ? '已到期' : rowData.statu == 'JDQ' ? '将到期' : rowData.statu == 'YGQ' ? '已过期' : null)}</Text>
                        </View>
                        <View style={{ marginTop: 10, alignContent: 'center', flexDirection: 'row', marginLeft: 10 }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 3, color: 'white', backgroundColor: '#3E7EFE', padding: 5, textAlign: 'center',
                                fontWeight: '500',
                                width: 70
                            }}>{(rowData.settleType == '1' ? ' 线下结算 ' : ' 线上结算 ')}</Text>
                        </View>
                    </View>

                    <View>
                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize + 1, width: deviceWidth / 1.5, color: '#666' }}>{rowData.jfEmployer}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.cityName == '' || rowData.cityName == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: "#AAA" }}>{rowData.cityName + '/'}</Text>
                                </View>
                            }

                            {rowData.areaName == '' || rowData.areaName == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: "#AAA" }}>{rowData.areaName}</Text>
                                </View>
                            }
                        </View>
                        {rowData.REMARK1 == '' || rowData.REMARK1 == undefined ? null :
                            <View style={{ display: "flex", flexDirection: "row" }}>
                                {/* <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}> */}
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA', }}>{workTypeByCode(rowData.REMARK1)}</Text>
                                {/* </View> */}
                                {
                                    rowData.REMARK1 == "LSYG" || rowData.REMARK1 == "CHYW" ?
                                        // <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA', marginLeft: 8 }}>{rowData.isNeedYyzz == "1" ? "不需要电子营业执照" : "需要电子营业执照"}</Text>
                                        // </View>
                                        : null
                                }
                            </View>
                        }
                    </View>
                    {rowData.createTime == '' || rowData.createTime == undefined ? null :
                        <View style={{ position: 'absolute', right: 20, bottom: 10, flexDirection: 'row' }}>
                            {/* <Text style={{ fontSize: Config.MainFontSize - 4 }}>发布时间：</Text> */}
                            <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>{this.timeChange(rowData.updateTime)}</Text>
                        </View>
                    }
                    {/* </View>
                
            </TouchableOpacity> */}
                    {/* <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} /> */}

                    {/* <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', width: deviceWidth / 3 * 1.8 }}>{rowData.jfEmployer}</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.money}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 1, color: 'grey', marginRight: 5, width: deviceWidth / 1.7 }}>{rowData.jobContent}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey', position: 'absolute', right: 20, top: 15 }}>{(rowData.REMARK1 == 'FQRZ' ? '兼职' : rowData.REMARK1 == 'LWPQ' ? '抢单' : rowData.REMARK1 == 'LSYG' ? '合伙人' : rowData.REMARK1 == 'QRZ' ? '全日制' : null)} | {this.timeChange(rowData.updateTime)}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View style={{ width: 50, marginTop: 10, alignContent: 'center' }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', padding: 2, textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{(rowData.statu == 'YXF' ? '已下发' : rowData.statu == 'CN' ? '草拟' : rowData.statu == 'YXF' ? '已下发' : rowData.statu == 'YQD' ? '已签订' : rowData.statu == 'YBH' ? '已驳回' : rowData.statu == 'YZZ' ? '已终止' : rowData.statu == 'YDQ' ? '已到期' : rowData.statu == 'JDQ' ? '将到期' : rowData.statu == 'YGQ' ? '已过期' : null)}</Text>
                        </View>
                        <View style={{ width: 50, marginTop: 10, alignContent: 'center', flexDirection: 'row', marginLeft: 10 }}>
                            <Text style={{
                                fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', padding: 2, textAlign: 'center',
                                fontWeight: 'bold'
                            }}>{(rowData.settleType == '1' ? '线下结算' : '线上结算')}</Text>
                        </View>
                    </View>
                    {(rowData.rejectReason == '' || rowData.rejectReason == undefined) ? null :
                        <View style={{ marginTop: 10 }}>
                            <Text>驳回原因：{rowData.rejectReason}</Text>
                        </View>
                    }
                    {(rowData.stopReason == '' || rowData.stopReason == undefined) ? null :
                        <View style={{ marginTop: 10 }}>
                            <Text>终止原因：{rowData.stopReason}</Text>
                        </View>
                    } */}
                </View>
            </TouchableOpacity>
        )
    }

    _SelectPlanItem(selectNum) {
        this.setState({
            selectNum: selectNum,
        })
    }

    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;

    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
});
