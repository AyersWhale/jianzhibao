
/**
 * 功能模块：考勤打卡首页
 * 
 * 开发负责人：曾一川
 */
'use strict'
import React, { Component } from 'react';
import {
    View,
    ImageBackground, TouchableOpacity, StyleSheet,
    Dimensions, Text, Alert, ScrollView, Platform, PermissionsAndroid, Image
} from 'react-native';
import moment from 'moment';
import { C2AmapApi } from 'c2-mobile-amap';
import DatePicker from 'react-native-datepicker';
import ListViewChooseContainer from '../utils/ListViewChooseContainer';
import theme from '../config/theme';
import TimeChange from '../utils/TimeChange';
import { Checkbox, List, Picker } from 'antd-mobile-rn';
const CheckboxItem = Checkbox.CheckboxItem;
import { Actions, VectorIcon, Config, UserInfo, Fetch, Toast, SafeArea } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var nowTime = moment().format('HH:mm:ss');
// var times = [
//     { value: "25", label: "请选择" },
//     { value: "0", label: "00" },
//     { value: "1", label: "01" },
//     { value: "2", label: "02" },
//     { value: "3", label: "03" },
//     { value: "4", label: "04" },
//     { value: "5", label: "05" },
//     { value: "6", label: "06" },
//     { value: "7", label: "07" },
//     { value: "8", label: "08" },
//     { value: "9", label: "09" },
//     { value: "10", label: "10" },
//     { value: "11", label: "11" },
//     { value: "12", label: "12" },
//     { value: "13", label: "13" },
//     { value: "14", label: "14" },
//     { value: "15", label: "15" },
//     { value: "16", label: "16" },
//     { value: "17", label: "17" },
//     { value: "18", label: "18" },
//     { value: "19", label: "19" },
//     { value: "20", label: "20" },
//     { value: "21", label: "21" },
//     { value: "22", label: "22" },
//     { value: "23", label: "23" },
//     { value: "24", label: "24" }
// ];
const times = [
    [
        { value: "00", label: "00" },
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
        { value: "17", label: "17" },
        { value: "18", label: "18" },
        { value: "19", label: "19" },
        { value: "20", label: "20" },
        { value: "21", label: "21" },
        { value: "22", label: "22" },
        { value: "23", label: "23" },
    ],
    [
        { value: "00", label: "00" },
        { value: "30", label: "30" },
    ],
];
export default class kaoqin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nowTiming: null,
            data_company: [],
            ifzero: false,//是否有可打卡的公司
            value_company: '',
            companyList: [],
            companyId: '',
            workMode: '',
            companyName: '',
            contractStartDate: '',//合同开始时间
            startTime: '',
            endTime: '',
            contractId: '',
            nowDate: '',
            shangban_time: '',
            xiaban_time: '',
            buka_time: '',
            result: '',
            visibleReferees: false,
            visibleReferees1: false,
            dakalist: [],
            startTime_minute: 0,
            endTime_minute: 0,
            chooseBuka: false,
        }
        var ts = Math.round(new Date().getTime() / 1000).toString();
        this._initService()
        this._getGps()
        this._countTime()
        this.getCompanylist()
        // this._loadMoreData(Math.round(new Date().getTime() / 1000).toString())
        this.openQuanxian()
    }
    openQuanxian() {
        if (Platform.OS == 'android') {
            var location = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
            PermissionsAndroid.check(location).then(granted => {
                if (granted) {
                } else {
                    PermissionsAndroid.request(
                        location,
                    ).then(() => { });
                }
            })
        }
    }
    componentWillUnmount() {
        this.timerOut && clearTimeout(this.timerOut);
        this.nowTime && clearInterval(this.nowTime);
    }
    _loadMoreData(rowData) {
        var unixTimestamp = new Date(rowData * 1000)
        // let data = this.timeChange(unixTimestamp)
        var timeStamp = Date.parse(unixTimestamp)
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            time: timeStamp,
            companyId: this.state.companyId,
            contractId: this.state.contractId,
            type: this.state.chooseBuka == false ? '0' : '1'
        }

        Fetch.postJson(Config.mainUrl + '/fqrzAttendance/getAttendancesByUserIdAndTime', entity)
            .then((res) => {
                this.setState({
                    dakalist: res
                })
            })
    }
    _countTime() {
        this.nowTime = setInterval(() => {
            fetch(Config.mainUrl + '/fqrzAttendance/getCurrentTimeApp', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => res.text())
                .then((res) => {
                    this.setState({
                        nowTiming: JSON.parse(res).time,
                        nowDate: JSON.parse(res).date,
                    })
                })
            //     this.setState({
            //         nowTiming: moment().format('HH:mm:ss')
            //     })
        }, 1000);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F6F7' }} >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: deviceHeight / 3 - 20 }}>
                    <View>
                        <View style={{ marginTop: 27, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold', marginTop: 20 }}>考勤打卡</Text>
                        </View>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#fff', alignSelf: 'center' }}>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#333', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>考勤打卡</Text>
                    </View>
                </View>
                {this.gettime()}

                {this.info()}
                {/* {this.DkList()} */}
                <ScrollView>
                    {/* <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10 }} onPress={() => Actions.chooseCompany({ onblock: this.reloadBack_wdjl.bind(this) })}>
                        <VectorIcon name={"building"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', marginLeft: 16 }} />
                        <Text style={{ marginLeft: 18, marginTop: 2 }}>打卡公司：</Text>
                        <Text style={{ flex: 1, marginLeft: 15, marginTop: 2, color: 'red', marginRight: 20, flexWrap: 'wrap', }}>{this.state.companyName == '' ? '请选择' : this.state.companyName}</Text>
                    </TouchableOpacity> */}
                    {this.state.workMode == "FQRZ" && this.state.chooseBuka == true ? <View>
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <VectorIcon name={"update"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', margin: 15 }} />
                            <Text style={{ marginTop: 17 }}>请选择时间段：</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                            <TouchableOpacity style={{ width: deviceWidth / 2 }} onPress={() => this.setState({ visibleReferees: !this.state.visibleReferees })}>
                                <View style={{ width: theme.screenWidth - 10, flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"ios-clock"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', margin: 15 }} />
                                        <Text style={{ marginTop: 17 }}>打卡：    {this.state.startTime}</Text>
                                    </View>
                                    <View style={{ backgroundColor: 'transparent', position: 'absolute', right: 10, flexDirection: "row" }} >

                                        <Text style={{ fontSize: Config.MainFontSize - 2, margin: 10, maxWidth: 250 }}>{this.state.diqu}</Text>
                                        <ListViewChooseContainer
                                            visible={this.state.visibleReferees}
                                            top={deviceHeight / 4}//这个用来控制与顶部距离
                                            theme={'hour-minute'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                                            onCancel={() => { this.setState({ visibleReferees: false }); return null; }}
                                            callbackData={(data) => this.choose_startTime(data)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: deviceWidth / 2 }} onPress={() => this.setState({ visibleReferees1: !this.state.visibleReferees1 })}>
                                <View style={{ width: theme.screenWidth - 10, flexDirection: 'row' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"ios-clock"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', margin: 15 }} />
                                        <Text style={{ marginTop: 17 }}>打卡：    {this.state.endTime}</Text>
                                    </View>
                                    <View style={{ backgroundColor: 'transparent', position: 'absolute', right: 10, flexDirection: "row" }} >

                                        <Text style={{ fontSize: Config.MainFontSize - 2, margin: 10, maxWidth: 250 }}>{this.state.diqu}</Text>
                                        <VectorIcon
                                            name="chevron_down"
                                            size={12}   //图片大小
                                            color='black' //图片颜色
                                            style={{ alignSelf: 'center' }}
                                        />
                                        <ListViewChooseContainer
                                            visible={this.state.visibleReferees1}
                                            top={deviceHeight / 4}//这个用来控制与顶部距离
                                            theme={'hour-minute'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                                            onCancel={() => { this.setState({ visibleReferees1: false }); return null; }}
                                            callbackData={(data) => this.choose_endTime(data)} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> : null}
                    <View style={{ flexDirection: 'row', marginLeft: 25, width: deviceWidth - 40, justifyContent: 'space-between', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => this.punchcard("shangban")}>
                            <View style={{
                                width: (deviceWidth - 55) / 2, height: 110, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
                                borderRadius: 8,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                shadowColor: '#b3b4b7',
                                elevation: 1,

                            }}>
                                <Text style={{ color: '#999', fontSize: Config.MainFontSize + 5 }}>上班打卡</Text>
                                <Text style={{ backgroundColor: 'transparent', color: '#999', marginTop: 5, fontSize: Config.MainFontSize + 1 }}>{this.state.shangban_time == '' ? '未打卡' : this.state.shangban_time}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.punchcard("xiaban")}>
                            <View style={{
                                width: (deviceWidth - 55) / 2, height: 110, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 8,
                                shadowOffset: { width: 0, height: 5 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                shadowColor: '#b3b4b7',
                                elevation: 1,
                            }}>
                                <Text style={{ color: '#999', fontSize: Config.MainFontSize + 5 }}>下班打卡</Text>
                                <Text style={{ backgroundColor: 'transparent', color: '#999', marginTop: 5, fontSize: Config.MainFontSize + 1 }}>{this.state.xiaban_time == '' ? '未打卡' : this.state.xiaban_time}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ flexDirection: 'row' }}>
                        <VectorIcon name={"ios-clock"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', margin: 15 }} />
                        <Text style={{ marginTop: 17 }}>北京时间：    {this.state.nowTiming}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <VectorIcon name={"c2_location_solid"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        <Text style={{ marginLeft: 15, marginTop: 2, marginRight: 10 }}>打卡地点：</Text>
                        <Text style={{ flex: 1, marginTop: 2, marginRight: 10 }}>{this.state.result}</Text>
                    </View> */}
                    {/* 
                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        {(this.state.dakalist.length == '0') ? <TouchableOpacity style={{ width: deviceWidth / 3.3, height: deviceWidth / 3.3, marginTop: this.state.workMode == "FQRZ" ? 30 : deviceHeight / 11, backgroundColor: 'rgb(32,124,241)', borderRadius: 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 20 }} onPress={() => this.punchcard("shangban")}>
                            <Text style={{ backgroundColor: 'transparent', color: 'white', fontSize: Config.MainFontSize + 6, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 40 }}>上班打卡</Text>
                            {(this.state.shangban_time == '') ? null :
                                <Text style={{ backgroundColor: 'transparent', color: '#EDEDED', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>{this.state.shangban_time}</Text>}
                        </TouchableOpacity> : <TouchableOpacity style={{ width: deviceWidth / 3.3, height: deviceWidth / 3.3, marginTop: this.state.workMode == "FQRZ" ? 30 : deviceHeight / 11, backgroundColor: 'rgb(32,124,241)', borderRadius: 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 20 }} onPress={() => this.punchcard("xiaban")}>
                                <Text style={{ backgroundColor: 'transparent', color: 'white', fontSize: Config.MainFontSize + 6, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 40 }}>下班打卡</Text>
                                {(this.state.xiaban_time == '') ? null :
                                    <Text style={{ backgroundColor: 'transparent', color: '#EDEDED', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>{this.state.xiaban_time}</Text>}
                            </TouchableOpacity>}
                        <TouchableOpacity style={{ width: deviceWidth / 3.3, height: deviceWidth / 3.3, marginTop: this.state.workMode == "FQRZ" ? 20 : deviceHeight / 11, backgroundColor: '#FF8C69', borderRadius: 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20 }} onPress={() => this.punchcard1()}>
                            <Text style={{ backgroundColor: 'transparent', color: 'white', fontSize: Config.MainFontSize + 6, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 40 }}>申请补卡</Text>
                            {(this.state.buka_time == '') ? null :
                                <Text style={{ backgroundColor: 'transparent', color: '#EDEDED', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>{this.state.buka_time}</Text>}
                        </TouchableOpacity>
                    </View> */}

                    <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 25 }}>
                        {(this.state.result == '') ? null : <VectorIcon name={"c2_im_check"} size={16} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent' }} />}
                        <Text style={{ backgroundColor: 'transparent', color: '#999', marginLeft: 5, marginRight: 10, fontSize: Config.MainFontSize - 1 }}>{(this.state.result == '') ? '定位中，请稍后' : "已进入考勤范围" + this.state.result + '附近'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                        <TouchableOpacity style={{ backgroundColor: 'transparent', flexDirection: 'row', alignContent: 'center', alignItems: 'center', }} onPress={() => { Actions.kaoqinHistory() }}>
                            <VectorIcon name={"_480"} size={16} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent' }} />
                            <Text style={{ color: '#3E7EFE', marginLeft: 10, fontSize: Config.MainFontSize - 1 }}>查看考勤记录</Text>
                        </TouchableOpacity>
                    </View>
                    {Platform.OS == 'ios' ? null : <View style={{ height: 60, width: deviceWidth }} />}
                </ScrollView >
            </View >

        )
    }
    choose_startTime(rowData) {
        // alert(rowData)
        var temp = JSON.parse(rowData)
        this.setState({
            startTime: temp.leftData + ":" + temp.rightData,
            startTime_hour: temp.leftData,
            startTime_minute: temp.rightData,
        })
    }
    choose_endTime(rowData) {
        var temp = JSON.parse(rowData)
        this.setState({
            endTime: temp.leftData + ":" + temp.rightData,
            endTime_hour: temp.leftData,
            endTime_minute: temp.rightData,
        })
    }
    reloadBack_wdjl(rowData) {
        this.setState({ companyName: rowData.name, workMode: rowData.workMode, companyId: rowData.id, contractId: rowData.contractId, contractStartDate: rowData.startDate }, () => {
            this._loadMoreData(Math.round(new Date().getTime() / 1000).toString())
        })
    }
    punchcard1() {

        var nowTiming = this.state.nowTiming;
        var timestamp = Date.parse(new Date());//获取当前时间戳
        let cuurNY = TimeChange.timeYMChange(timestamp)//获取当前年月
        let contactNY = this.state.contractStartDate.substring(0, 10)
        if (cuurNY == contactNY) {
            Alert.alert("温馨提示", "无需补卡"
                , [{
                    text: "确定", onPress: () => {
                    }
                }, {}])
            return
        }
        if (this.state.dakalist.length > 0) {
            if (this.state.dakalist[0].workMode == "FQRZ") {
                if (this.state.dakalist[0].punchTime != '' && this.state.dakalist[0].punchTime1 != '') {
                    Alert.alert("温馨提示", "无需补卡"
                        , [{
                            text: "确定", onPress: () => {
                            }
                        }, {}])
                    return
                }
            } else {
                if (this.state.dakalist[0].sbPunchTime != '' && this.state.dakalist[0].xbPunchTime != '') {
                    Alert.alert("温馨提示", "无需补卡"
                        , [{
                            text: "确定", onPress: () => {
                            }
                        }, {}])
                    return
                }
            }
        }
        this.setState({ chooseBuka: true })
        Alert.alert("提示", "您确定补卡吗？"
            , [{
                text: "取消", onPress: () => {
                }
            },
            {
                text: "确定", onPress: () => {
                    if (this.state.companyId == undefined || this.state.companyId == '') {
                        Toast.showInfo('请选择补卡公司', 1000)
                        return;
                    }
                    if (this.state.workMode == 'FQRZ') {
                        if (this.state.startTime == '') {
                            Toast.showInfo('请选择上班时间', 1000)
                            return;
                        }
                        if (this.state.endTime == '') {
                            Toast.showInfo('请选择下班时间', 1000)
                            return;
                        }
                        if (this.state.startTime > this.state.endTime) {
                            Toast.showInfo('请选择合理的上下班时间', 1000)
                            return;
                        }
                    }
                    if (this.state.longitude == undefined || this.state.longitude == '0.000000') {
                        //Toast.showInfo('请开启定位', 2000)
                        this._getGps({ dk_flag: true, dk_type: 'bk' })
                        return;
                    }
                    if (this.state.result == undefined || this.state.result == '') {
                        Toast.showInfo('正在获取当前地点，请稍后', 2000)
                        return;
                    }
                    var i = 0;
                    if (this.state.startTime_minute > this.state.endTime_minute) {
                        i = -0.5
                    } else if (this.state.startTime_minute < this.state.endTime_minute) {
                        i = 0.5
                    } else {
                        i = 0
                    }
                    var entity = {
                        entity: {
                            remark4: "0",
                            workMode: this.state.workMode,
                            punchLgLt: this.state.latitude + ',' + this.state.longitude,
                            punchPlace: this.state.result,
                            punchTime: timestamp,
                            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                            companyId: this.state.companyId,
                            period: this.state.workMode == 'FQRZ' ? JSON.stringify(this.state.endTime_hour - this.state.startTime_hour + i) : null,
                            contractId: this.state.contractId,
                        }
                    }
                    // this.setState({ companyId: '', companyName: '', workMode: '', endTime: '', startTime: '' })
                    Fetch.postJson(Config.mainUrl + '/ws/suppAttendance', entity)
                        .then((res) => {
                            console.log(res)
                            if (res.result == 'success') {
                                Alert.alert("提示", "补卡成功！"
                                    , [
                                        {
                                            text: "确定", onPress: () => {
                                                this.setState({
                                                    buka_time: nowTiming
                                                })
                                            }
                                        }])
                            } else {
                                var tip = ''
                                if (res.description) {
                                    tip = res.description
                                } else {
                                    tip = '补卡超时,请重新补卡'
                                }
                                Alert.alert("提示", tip
                                    , [
                                        {
                                            text: "确定", onPress: () => {
                                            }
                                        }])
                            }
                        }
                        )
                }
            }])
    }

    punchcard(daka_style) {
        if (this.state.dakalist.length > 0 && daka_style == 'shangban') {
            Toast.showInfo('您已经打过上班卡，无需重复打卡', 2000)
            return
        }
        var nowTiming = this.state.nowTiming;
        const daka_style_tip = daka_style == 'shangban' ? '上班' : '下班'
        var timestamp = Date.parse(new Date());//获取当前时间戳
        var ts = Math.round(new Date().getTime() / 1000).toString();
        this.setState({ chooseBuka: false })
        if (this.state.companyId == undefined || this.state.companyId == '') {
            Toast.showInfo('请选择打卡公司', 1000)
            return;
        }
        // if (this.state.workMode == 'FQRZ') {
        //     if (this.state.startTime == '') {
        //         Toast.showInfo('请选择上班时间', 1000)
        //         return;
        //     }
        //     if (this.state.endTime == '') {
        //         Toast.showInfo('请选择下班时间', 1000)
        //         return;
        //     }

        // }
        if (this.state.longitude == undefined || this.state.longitude == '0.000000') {
            //Toast.showInfo('请开启定位', 2000)
            this._getGps({ dk_flag: true, dk_type: daka_style })
            return;
        }
        if (this.state.result == undefined || this.state.result == '') {
            Toast.showInfo('正在获取当前地点，请稍后', 2000)
            return;
        }
        var i = 0;
        if (this.state.startTime_minute > this.state.endTime_minute) {
            i = -0.5
        } else if (this.state.startTime_minute < this.state.endTime_minute) {
            i = 0.5
        } else {
            i = 0
        }
        Alert.alert("提示", "您确定打" + daka_style_tip + "卡吗？"
            , [{
                text: "取消", onPress: () => {
                }
            },
            {
                text: "确定", onPress: () => {
                    var entity = {
                        entity: {
                            remark4: (daka_style == 'shangban') ? "0" : "1",
                            workMode: this.state.workMode,
                            punchLgLt: this.state.latitude + ',' + this.state.longitude,
                            punchPlace: this.state.result,
                            punchTime: timestamp,
                            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                            companyId: this.state.companyId,
                            // period: this.state.workMode == 'FQRZ' ? JSON.stringify(this.state.endTime_hour - this.state.startTime_hour + i) : null,
                            contractId: this.state.contractId,
                        }
                    }
                    // this.setState({ companyId: '', companyName: '', workMode: '', endTime: [], startTime: [] })
                    Fetch.postJson(Config.mainUrl + '/ws/saveAttendance', entity)
                        .then((res) => {
                            console.log(res)
                            if (res.result == 'success') {
                                Alert.alert("提示", "打卡成功！"
                                    , [
                                        {
                                            text: "确定", onPress: () => {
                                                if (daka_style == 'shangban') {
                                                    this.setState({
                                                        shangban_time: nowTiming
                                                    })
                                                    this._loadMoreData(ts)
                                                } else {
                                                    this.setState({
                                                        xiaban_time: nowTiming
                                                    })
                                                    this._loadMoreData(ts)
                                                }

                                            }
                                        }])
                            } else {
                                Alert.alert("提示", res.description
                                    , [
                                        {
                                            text: "确定", onPress: () => {
                                            }
                                        }])
                            }
                        }
                        )
                }
            }])
    }

    getCompanylist() {//选择公司
        var entity = {
            idCard: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
        }
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getQyCompany', entity)
            .then((json) => {
                if (json.length > 0) {
                    var R = Math.round(new Date().getTime() / 1000).toString()
                    var unixTimestamp = new Date(R * 1000)
                    var timeStamp = Date.parse(unixTimestamp)
                    var entity = {
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        time: timeStamp,
                        companyId: json[0].id,
                        contractId: json[0].contractId,
                        type: this.state.chooseBuka == false ? '0' : '1'
                    }
                    Fetch.postJson(Config.mainUrl + '/fqrzAttendance/getAttendancesByUserIdAndTime', entity)
                        .then((res) => {
                            console.log('第一个公司当天的打卡记录', res)
                            if (res.length > 0) {
                                this.setState({
                                    shangban_time: res[res.length - 1].punchTime,
                                    xiaban_time: res[0].punchTime1 || '',
                                })
                            }
                            this.setState({
                                dakalist: res
                            })
                        })
                    this.setState({
                        companyList: json
                    })
                    this.setState({ companyName: json[0].name, workMode: json[0].workMode, companyId: json[0].id, contractId: json[0].contractId, contractStartDate: json[0].startDate })
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }

    _getGps(param) {
        C2AmapApi.getCurrentLocation()
            .then((result) => {
                if (result.coordinate.latitude == '0.000000') {
                    Toast.showInfo('请开启定位', 2000)
                } else {
                    if (result.info.street == '') {
                        this.timerOut = setTimeout(
                            () => this._getGps(),
                            1000
                        );
                    } else {
                        this.setState({
                            result: result.info.street + result.info.AOIName,
                            latitude: result.coordinate.latitude,//纬度
                            longitude: result.coordinate.longitude,//经度
                        })
                        if (param !== undefined) {
                            if (param.dk_type == 'bk') {
                                this.punchcard1()
                            } else {
                                this.punchcard(param.dk_type)
                            }
                        }
                    }
                }
            })
            .catch((res) => {
                console.log(res)
                Toast.showInfo('请开启定位', 2000)
            })
    }
    _initService() {
        if (Platform.OS == 'android') {
            C2AmapApi.initService({
                apiKey: 'f1e98431de6fcdbfb9071b9e8cc56061'
            });
        } else {
            C2AmapApi.initService({
                apiKey: '2a79d9bfda5534d33c3eb959fc805569'
            });
        }
    }
    info() {
        return (
            <View>
                <View style={{
                    flexDirection: "row", marginTop: 20, marginLeft: 25, width: deviceWidth - 40, backgroundColor: '#fff',
                    borderRadius: 8,
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                    shadowColor: '#b3b4b7',
                    elevation: 2,
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <View style={{ width: (deviceWidth - 40) / 5, alignItems: 'center' }}>
                        <Image source={require('../image/center_header_img150x150.png')} style={{ width: 50, height: 50, borderRadius: 25 }} />
                    </View>

                    <View style={{ flexDirection: 'column', marginTop: 20, marginBottom: 20, }}>

                        <Text style={{ fontSize: Config.MainFontSize + 3, color: "#333" }}>{'您好，' + UserInfo.loginSet.result.rdata.loginUserInfo.userName}</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 6 }} onPress={() => Actions.chooseCompany({ onblock: this.reloadBack_wdjl.bind(this) })}>
                            <Image source={require('../image/Dkgs.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ marginLeft: 4, marginTop: 2, fontSize: Config.MainFontSize - 1, color: '#333' }}>打卡公司：</Text>
                            <Text style={{ marginTop: 2, color: '#3E7EFE', fontSize: Config.MainFontSize - 1, }}>{this.state.companyName == '' ? '请选择' : this.state.companyName}</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', marginTop: 6 }}>
                            <Image source={require('../image/Dkdz.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ marginLeft: 4, marginTop: 2, fontSize: Config.MainFontSize - 1, color: '#333' }}>打卡地点：</Text>
                            <Text style={{ marginTop: 2, color: '#3E7EFE', fontSize: Config.MainFontSize - 1, width: deviceWidth / 2.4 }}>{this.state.result}</Text>
                        </View>


                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 6 }} onPress={() => this.punchcard1()}>
                            <Image source={require('../image/Dksq.png')} style={{ width: 20, height: 20 }} />
                            <Text style={{ marginLeft: 4, marginTop: 2, fontSize: Config.MainFontSize - 1, color: '#333' }}>申请补卡：</Text>
                            <Text style={{ marginTop: 2, color: '#3E7EFE', fontSize: Config.MainFontSize - 1, }}>{this.state.buka_time == '' ? '请选择补卡' : this.state.buka_time}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
    }
    gettime() {
        var arr = this.state.nowDate
        if (arr != '') {
            var temp = arr.split('日')
            var time = temp[0] + '日'
            var week = temp[1]
        }
        return (
            <View>
                <View style={{
                    flexDirection: "row", marginTop: 20, marginLeft: 25, width: deviceWidth - 40,
                    backgroundColor: '#fff', borderRadius: 8,
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 8,
                    shadowColor: '#b3b4b7',
                    elevation: 2,
                    justifyContent: 'center', alignItems: 'center',
                    minHeight: 50
                }}>
                    <Text style={{ backgroundColor: 'transparent', color: '#000', fontSize: Config.MainFontSize + 30, width: (deviceWidth - 40) / 1.7 }}>{this.state.nowTiming}</Text>
                    <View style={{ flexDirection: 'column', marginTop: 2 }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>
                            {time || '当前时间'}
                        </Text>
                        <Text style={{ textAlign: 'center', color: '#333', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>
                            {week}
                        </Text>
                    </View>
                </View>
            </View >
        )
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
var styles = StyleSheet.create({
    tabStyle: {
        paddingTop: 26,
    },
    titleStyle: {
        fontSize: Config.MainFontSize - 3,
        paddingBottom: 3,
        color: 'rgb(22,131,251)'
    },
    titleStyle1: {
        fontSize: Config.MainFontSize - 3,
        paddingBottom: 3,
    },
    height: {
        marginTop: 5,
        borderColor: '#bbe6f7',
        borderWidth: 1,
    },
    tabbar: {
        height: 50,//这里和下面的card设置50可以展示tabbar
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
})
