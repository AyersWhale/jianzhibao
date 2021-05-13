/**
 * 发布职位详情
 * Created by 曾一川 on 17/04/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Platform, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, UUID, Toast } from 'c2-mobile';
import theme from '../config/theme';
import TabNavigator from 'react-native-tab-navigator';
import Toasts from 'react-native-root-toast';
import px2dp from '../utils/px2dp';
import DatePicker from 'react-native-datepicker';
import { Checkbox, List, Picker } from 'antd-mobile-rn';
import style from 'qysyb-mobile/Libraries/Base/QyEcharts/style';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class PublicPositionInform extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sendResume: (this.props.sendResume) ? true : false,
            interviewTime: '',
            interviewTimeShow: false,
            positionList: [],
            value: [],
            positionId: '',
            positionName: '',
            rowData: '',
            public: false,
        }
        this.getJobInform()
    }
    //获取职位列表详情
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    getJobInform() {
        var url = Config.mainUrl + "/positionManagement/getPositionDetail?id=" + this.props.rowData.id;
        Fetch.getJson(url)
            .then((res) => {
                //console.log(res)
                // debugger
                this.setState({ rowData: res[0] })
            })
    }
    render() {
        var rowData = this.state.rowData
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: true } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>职位详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: true } })} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>职位详情</Text>
                    </View>
                </View>
                <ScrollView style={{ marginBottom: 80 }}>
                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"briefcase2"} size={24} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize, marginTop: 4 }}>职位信息</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 2 }}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, maxWidth: deviceWidth / 1.8 }}>职位名称:{rowData.POSITION_NAME}</Text>
                        {rowData.HOUR_SALARY == '' || rowData.HOUR_SALARY == undefined ? null :
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, marginTop: 10 }}>{rowData.WORK_MODE == '兼职' ? '薪资(元/小时):' + rowData.HOUR_SALARY : null} </Text>
                        }
                        {rowData.SALARY_RANGE == '' || rowData.SALARY_RANGE == undefined ? null :
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, marginTop: 10 }}>{rowData.WORK_MODE == '抢单' ? '薪资(元/月):' + rowData.SALARY_RANGE : null}</Text>
                        }
                    </View>
                    <View style={{ flexDirection: 'row', paddingTop: 10, marginLeft: 10, width: deviceWidth }}>
                        {rowData.WORK_MODE == '' || rowData.WORK_MODE == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, }}>工作方式:{rowData.WORK_MODE}</Text>
                            </View>
                        }
                        {rowData.POSITION_KIND == '' || rowData.POSITION_KIND == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, }}>职位类别:{rowData.POSITION_KIND}</Text>
                            </View>
                        }

                    </View>
                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                        {rowData.WORK_YEARS == '' || rowData.WORK_YEARS == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20, paddingTop: 10, marginLeft: 10, paddingBottom: 10, }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, }}>工作年限:{rowData.WORK_YEARS}</Text>
                            </View>
                        }
                        {rowData.RECRUIT_NUMBER == '' || rowData.RECRUIT_NUMBER == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20, paddingTop: 10, marginLeft: 10, paddingBottom: 10, }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>招聘人数:{rowData.RECRUIT_NUMBER}人</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>

                        {(rowData.WORK_START_TIME == '' || rowData.WORK_START_TIME == undefined) || rowData.WORK_MODE == '抢单' ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, paddingBottom: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>用工开始时间:{this.timeChange(rowData.WORK_START_TIME)}</Text>
                            </View>}
                        {(rowData.WORK_END_TIME == '' || rowData.WORK_END_TIME == undefined) || rowData.WORK_MODE == '抢单' ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, paddingBottom: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>用工结束时间:{this.timeChange(rowData.WORK_END_TIME)}</Text>
                            </View>}

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {(rowData.WORK_DAY == '' || rowData.WORK_DAY == undefined) || rowData.WORK_MODE == '抢单' ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, paddingBottom: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>每日工作时长:{rowData.WORK_DAY}小时</Text>
                            </View>}
                        {rowData.APPLY_NUMBER == '' || rowData.APPLY_NUMBER == undefined ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, paddingBottom: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>应聘人数:{rowData.APPLY_NUMBER}人</Text>
                            </View>}

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.AGE_REQUIRE == '' || rowData.AGE_REQUIRE == undefined ? null :
                            <View style={{ marginTop: 10, paddingBottom: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>年龄要求:{rowData.AGE_REQUIRE}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        {rowData.EDUCATION_REQUIRE == '' || rowData.EDUCATION_REQUIRE == undefined ? null :
                            <View style={{ marginTop: 10, paddingBottom: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>学历要求:{rowData.EDUCATION_REQUIRE}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.RELEASE_COMPANY_NAME == '' || rowData.RELEASE_COMPANY_NAME == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>用工单位:{rowData.RELEASE_COMPANY_NAME}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {(rowData.WORK_TIME == '' || rowData.WORK_TIME == undefined) || rowData.WORK_MODE == '抢单' ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>工作时间:{rowData.WORK_TIME == 'SW,' ? '上午' : rowData.WORK_TIME == 'XW,' ? '下午' : rowData.WORK_TIME == 'WS' ? '晚上' : rowData.WORK_TIME == 'SW,XW,' ? '上午  下午' : rowData.WORK_TIME == 'SW,WS' ? '上午  晚上' : rowData.WORK_TIME == 'XW,WS' ? '下午  晚上' : '任意时间'}</Text>
                            </View>}
                    </View>
                    {rowData.WORK_TIME == 'RYSJ' && rowData.WORK_MODE == '兼职' ?
                        <View style={{ flexDirection: 'row' }}>
                            {(rowData.WORK_TIME1 == '' || rowData.WORK_TIME1 == undefined) && (rowData.WORK_TIME != 'RYSJ' || rowData.WORK_TIME != '') ? null :
                                <View style={{ padding: 3, marginTop: 10, marginLeft: 10, paddingBottom: 10, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1 }}>工作时间:{rowData.WORK_TIME1}-{rowData.WORK_TIME2}</Text>
                                </View>}
                        </View> : null}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.POSITION_PROVINCE_NAME == '' || rowData.POSITION_PROVINCE_NAME == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, paddingBottom: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>所在省:{rowData.POSITION_PROVINCE_NAME}</Text>
                            </View>}
                        {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, paddingBottom: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>所在市:{rowData.POSITION_CITY_NAME}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, paddingBottom: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>所在区:{rowData.POSITION_AREA_NAME}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.DETAILED_ADDRESS == '' || rowData.DETAILED_ADDRESS == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, paddingBottom: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>详细地址:{rowData.DETAILED_ADDRESS}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        {rowData.SERVING_REQUIRE == '' || rowData.SERVING_REQUIRE == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, paddingBottom: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, maxWidth: deviceWidth - 50 }}>任职要求:{rowData.SERVING_REQUIRE}</Text>
                            </View>}

                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        {rowData.REMARK == '' || rowData.REMARK == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, paddingBottom: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, maxWidth: deviceWidth - 50 }}>备注:{rowData.REMARK}</Text>
                            </View>}

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.CREATE_TIME == '' || rowData.CREATE_TIME == undefined ? null :
                            <View style={{ marginLeft: 10, paddingBottom: 20, padding: 3, alignItems: 'center', marginRight: 20, position: 'absolute', right: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey' }}>创建时间:{this.timeChange(rowData.CREATE_TIME)}</Text>
                            </View>}
                    </View>

                </ScrollView>
                <View style={{ flexDirection: 'row', width: deviceWidth, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60, position: 'absolute', bottom: 20 }}>
                    <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                        <TouchableOpacity onPress={this.edit.bind(this, rowData)} style={{ backgroundColor: '#FF4040', width: deviceWidth / 2.5, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} >
                            <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>职位修改</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                        {this.state.public == false && rowData.POSITION_STATUS != 'FB' ? <TouchableOpacity style={{
                            backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 2.5, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
                        }}
                            onPress={() => {
                                Alert.alert("提示", "确定发布职位吗？"
                                    , [
                                        {
                                            text: "取消", onPress: () => {
                                                return
                                            }
                                        },
                                        {
                                            text: "确定", onPress: () => {
                                                // debugger
                                                Fetch.getJson(Config.mainUrl + '/positionManagement/updatePositionStatusList?ids=' + this.props.rowData.id)
                                                    .then((res) => {
                                                        console.log(res)
                                                        Toast.showInfo('发布成功', 1000)
                                                        // DeviceEventEmitter.emit('public')
                                                        Actions.pop()
                                                        this.props.onblock()
                                                        this.setState({ public: true })
                                                    })
                                            }
                                        }

                                    ])
                            }}>
                            <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>职位发布</Text>
                        </TouchableOpacity> :
                            <View style={{
                                backgroundColor: 'grey', width: deviceWidth / 2.5, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center',
                            }}
                            >
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>已发布</Text>
                            </View>}
                    </View>
                </View>
            </View>
        );
    }
    edit(rowData) {
        var province = (rowData.POSITION_PROVINCE_NAME == undefined) ? '' : rowData.POSITION_PROVINCE_NAME;
        var city = (rowData.POSITION_CITY_NAME == undefined) ? '' : rowData.POSITION_CITY_NAME;
        var area = (rowData.POSITION_AREA_NAME == undefined) ? '' : rowData.POSITION_AREA_NAME;
        var diqu = province + city + area;
        var params = {
            positionName: rowData.POSITION_NAME,
            recruitNumber: rowData.RECRUIT_NUMBER,
            releaseCompanyName: rowData.RELEASE_COMPANY_NAME,
            servingRequire: rowData.SERVING_REQUIRE,
            remark: rowData.REMARK,
            workMode: rowData.WORK_MODE,
            positionKind: rowData.POSITION_KIND,
            ageRequire: rowData.AGE_REQUIRE,
            educationRequire: rowData.EDUCATION_REQUIRE,
            salaryRange: rowData.SALARY_RANGE_ZS,//显示值
            salaryRange_XS: rowData.SALARY_RANGE,//真实
            workYears: rowData.WORK_YEARS,
            hourSalary: rowData.HOUR_SALARY,
            workDay: rowData.WORK_DAY,
            workEndTime: rowData.WORK_END_TIME,
            workStartTime: rowData.WORK_START_TIME,
            diqu: diqu,
            positionProvinceName: rowData.POSITION_PROVINCE_NAME,
            positionProvince: rowData.POSITION_PROVINCE,
            positionCityName: rowData.POSITION_CITY_NAME,
            positionCity: rowData.POSITION_CITY,
            positionAreaName: rowData.POSITION_AREA_NAME,
            positionArea: rowData.POSITION_AREA,
            detailedAddress: rowData.DETAILED_ADDRESS,
            createTime: rowData.CREATE_TIME,
            workTime: rowData.WORK_TIME,
            onblock: this.getJobInform.bind(this),
            id: rowData.id,
            WORK_TIME1: rowData.WORK_TIME1,
            WORK_TIME2: rowData.WORK_TIME2,
            style: '1',
            positionStatus: this.state.rowData.POSITION_STATUS,
            //预留真实值
        }
        if (this.state.rowData.POSITION_STATUS == 'FB') {
            Toast.showInfo('已发布职位无法修改', 1000)
            return;
        } else {
            Actions.AddNewJob(params)
        }
    }
    sendInterview() {

        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        }
        if (this.state.interviewTime == '' || this.state.interviewTime == undefined) {
            Toast.showInfo('请选择面试时间', 1000)
            return;
        } if (this.state.value[0] == '' || this.state.value[0] == undefined) {
            Toast.showInfo('请选择面试职位', 1000)
            return;
        }
        else {
            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
                .then((res) => {
                    console.log(res)
                    var entity1 = {
                        res: res,
                        userId: this.props.rowData.userId,
                        positionId: this.state.value[0],
                        interviewTime: this.state.interviewTime,
                    }
                    Fetch.postJson(Config.mainUrl + '/interviewNotice/sendInterviewToResApp', entity1)
                        .then((resInfo) => {
                            console.log(resInfo)
                            if (resInfo) {
                                Toasts.show('发送成功', { position: px2dp(-80), duration: 1000 });
                                this.setState({ sendResume: true, interviewTimeShow: false })
                            } else {
                                Toasts.show('发送失败，请重试', { position: px2dp(-80), duration: 1000 });
                            }
                        })

                })
        }


    }
    submit() {

        if (this.state.sendResume == true) {
            Alert.alert("提示", "已发送"
                , [
                    {
                        text: "确定", onPress: () => {
                        }
                    },])
        } else {
            Alert.alert("提示", "确定发送面试通知吗？"
                , [
                    {
                        text: "取消", onPress: () => {
                            this.setState({ interviewTimeShow: false })
                        }
                    },
                    {
                        text: "确定", onPress: () => {
                            this.setState({ interviewTimeShow: true })
                        }
                    }

                ])
        }

    }
    timeStart = (label, value) => {
        this.setState({ positionName: label, positionId: value });
    }
    timeChange1(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getHours()) + ":" +
            (d.getMinutes());
        return date;

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
    imgstyle1: {
        width: theme.screenWidth,
        height: theme.screenHeight / 4.8,
        marginTop: 10
    },
    imgstyle2: {
        width: theme.screenWidth,
        height: theme.screenHeight / 1.2,
    },
    imgstyle3: {
        width: theme.screenWidth,
        height: theme.screenHeight / 3.6,
        marginBottom: 60
    },
    tabStyle: {
        paddingTop: 26,
        width: deviceWidth - 20,
        alignSelf: 'center',
        backgroundColor: 'rgb(65,143,234)'
    },
    titleStyle: {
        fontSize: Config.MainFontSize,
        paddingBottom: 10,
        color: 'white'
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
        height: 40,//这里和下面的card设置50可以展示tabbar
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        width: deviceWidth - 20,
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 10,
        marginBottom: 10
    },

});
