
/**
 * 功能模块：考勤打卡历史记录
 * 
 * 开发负责人：曾一川
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Platform, ListView, Image
} from 'react-native';
import { Actions, VectorIcon, Config, Calendar, UserInfo, Fetch, SafeArea } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import CustomDayItem from './cutomDayItem';
import moment from 'moment';

export default class kaoqinHistory extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            extraDatas: {},
            punchCard: [],
            ifzero: false,
            showList: true
        }
        this._loadMoreData();
        var ts = Math.round(new Date().getTime() / 1000).toString();
        this.onSelect(ts)

    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    onSelect(rowData) {
        // alert(JSON.stringify(rowData))
        var unixTimestamp = new Date(rowData * 1000)
        // let data = this.timeChange(unixTimestamp)
        var timeStamp = Date.parse(unixTimestamp)
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            time: timeStamp,
        }
        Fetch.postJson(Config.mainUrl + '/fqrzAttendance/getAttendancesByUserIdAndTime', entity)
            .then((res) => {
                debugger
                if (res.length > 0) {
                    this.setState({
                        punchCard: res,
                        ifzero: false
                    })
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }
    _loadMoreData() {
        //Http请求
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        var Date1 = nowYYYY + '-' + nowMM;
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            time: Date1,
        }
        Fetch.postJson(Config.mainUrl + '/fqrzAttendance/getAttendances', entity)
            .then((res) => {
                setTimeout(() => {
                    this.setState({
                        extraDatas: res.entity
                    })
                }, 1000);

            })
    }


    render() {
        return (
            <View style={{ backgroundColor: '#f2f2f2', flex: 1 }}>
                {/* <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>考勤详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>考勤详情</Text>
                    </View>
                </View>
                <ScrollView  >
                    <View style={{ width: deviceWidth - 20, backgroundColor: "#fff", marginTop: 20, marginLeft: 10, borderRadius: 6 }}>
                        <Calendar
                            mode={'month'}
                            onSelect={this.onSelect.bind(this)}
                            onChange={(unix) => { }}
                            showExtraMonth={true}
                            extraDatas={this.state.extraDatas}
                            todayColor={'#3E7EFE'}
                            overMonthColor={'grey'}
                            customDayComponent={CustomDayItem}
                            scrollEnabled={true}
                            width={deviceWidth}
                        />
                        {this.state.showList ? <TouchableOpacity style={{ marginTop: 30, marginBottom: 10 }} onPress={() => this.setState({ showList: !this.state.showList })}>
                            <Image source={require('../../image/icon/Kqxs.png')} style={{ width: deviceWidth - 40, height: 7, marginLeft: 10 }} />
                        </TouchableOpacity> :
                            <TouchableOpacity style={{ marginTop: 30, marginBottom: 10 }} onPress={() => this.setState({ showList: !this.state.showList })}>
                                <Image source={require('../../image/icon/Kqyc.png')} style={{ width: deviceWidth - 40, height: 7, marginLeft: 10 }} />
                            </TouchableOpacity>}
                        {this.state.showList ? <ScrollView   >
                            {this.punchInform()}
                        </ScrollView> : null}
                    </View>
                </ScrollView>

            </View>
        )
    }
    punchInform() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: 200, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                    <Image source={require('../../image/app_panel_expression.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: Config.MainFontSize - 1, color: "#AAA", marginTop: 13 }}>当日无打卡记录</Text>
                </View>
            )
        } else {
            return (
                <View style={{ marginBottom: 100, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                    <ListView
                        style={{ borderRadius: 20 }}
                        dataSource={this.ds.cloneWithRows(this.state.punchCard)}
                        renderRow={this._renderItem.bind(this)}
                        enableEmptySections={true}
                    />

                </View>
            )

        }
    }
    _renderItem(rowData) {
        if (rowData.workMode == "FQRZ") {
            return (
                <View >
                    {/* <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{rowData.attendenceTime}</Text> */}
                    <View style={{ backgroundColor: 'transparent', width: deviceWidth, marginTop: 10 }}>
                        <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: deviceWidth - 80, marginLeft: 30, backgroundColor: '#F8FAFF', borderRadius: 4 }}>
                            <View style={{ backgroundColor: '#F8FAFF', marginTop: 5, borderRadius: 10, width: deviceWidth / 1.4 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: '#3E7EFE', width: 6, height: 6, borderRadius: 3, marginTop: 18 }} />
                                    <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', marginLeft: 18, paddingTop: 10, paddingRight: 10, paddingBottom: 10, marginRight: 15, fontWeight: '500' }}>{rowData.companyName}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize + 1, color: 'black', marginLeft: 35, paddingRight: 10, marginRight: 15, fontWeight: '500' }}>(兼职)</Text>
                                </View>
                                <View style={{ padding: 5, marginLeft: 20, marginBottom: 15 }}>
                                    {/* <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>{(rowData.remark4 == 0) ? '上班打卡' : (rowData.remark4 == 1) ? '下班打卡' : ''}</Text> */}
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey' }}>职位名称：{rowData.positionName}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey' }}>打卡时长：{rowData.workingHour}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey' }}>打卡地点：{rowData.punchPlace}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey' }}>打卡时间：{rowData.punchTime}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            )
        }
        if (rowData.workMode == "LWPQ") {
            return (
                <View>
                    {/* <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{rowData.sbAtendenceTime}</Text> */}
                    <View style={{ backgroundColor: 'transparent', width: deviceWidth, marginTop: 10 }}>
                        <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: deviceWidth - 80, marginLeft: 30, backgroundColor: '#F8FAFF', borderRadius: 4 }}>
                            <View style={{ backgroundColor: '#F8FAFF', marginTop: 5, borderRadius: 10, width: deviceWidth / 1.4 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: '#3E7EFE', width: 6, height: 6, borderRadius: 3, marginTop: 18 }} />
                                    <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', marginLeft: 18, paddingTop: 10, paddingRight: 10, paddingBottom: 10, marginRight: 15, fontWeight: '500' }}>{rowData.companyName}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize + 1, color: 'black', marginLeft: 35, paddingRight: 10, marginRight: 15, fontWeight: '500' }}>(抢单)</Text>
                                </View>
                                <View style={{ padding: 5, marginLeft: 20, marginTop: 3 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>上班打卡地点：{rowData.sbPunchPlace}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>上班打卡时间：{rowData.sbPunchTime}</Text>
                                </View>
                                <View style={{ padding: 5, marginLeft: 20, marginBottom: 15 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>下班打卡地点：{rowData.xbPunchPlace}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>下班打卡时间：{rowData.xbPunchTime}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            )
        }
        if (rowData.workMode == "LSYG") {
            return (
                <View>
                    <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{rowData.attendenceTime}</Text>
                    <View style={{ backgroundColor: 'transparent', width: deviceWidth }}>
                        <View style={{ backgroundColor: 'transparent', alignItems: 'center', width: deviceWidth }}>
                            <View style={{ backgroundColor: 'white', marginTop: 10, borderRadius: 10, width: deviceWidth / 1.4, marginLeft: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ backgroundColor: 'red', width: 8, height: 8, borderRadius: 10, marginLeft: 5, marginTop: 14 }} />
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'black', marginLeft: 5, paddingTop: 10, paddingRight: 10, paddingBottom: 10, marginRight: 15 }}>{rowData.companyName}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'black', marginLeft: 5, paddingRight: 10, marginRight: 15 }}>(合伙人)</Text>
                                </View>
                                <View style={{ padding: 5 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>职位名称：{rowData.positionName}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>打卡地点：{rowData.punchPlace}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>打卡时间：{rowData.punchTime}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            )
        } else {
            return (
                null
            )
        }

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

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    }
})

