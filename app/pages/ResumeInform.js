/**
 * 简历详情
 * Created by 曾一川 on 17/04/19.
 */
import React, { Component } from 'react';
import { Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Platform, ListView, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, UUID, Toast } from 'c2-mobile';
import theme from '../config/theme';
import TabNavigator from 'react-native-tab-navigator';
import Toasts from 'react-native-root-toast';
import px2dp from '../utils/px2dp';
import DatePicker from 'react-native-datepicker';
import { Checkbox, List, Picker } from 'antd-mobile-rn';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const phoneRule = /^1[0-9]{10}$/

export default class ResumeInform extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            sendResume: (this.props.sendResume) ? true : false,
            interviewTime: '',
            interviewTimeShow: false,
            positionList: [],
            value: [],
            value1: [],
            positionId: '',
            positionName: '',
            hide: false,
            description: '您好，欢迎您前来我公司面试，若有任何问题可随时与我们联系，祝您生活愉悦、天天开心。',
            rowData1: [],
            rowData2: [],
            checkPhone: '',
            sum: '',
            resumeShow: false,
            interviewAddress: '',
            contactsName: "",
            contactsWorkNumber: "",
            cInfo: {}
        }
        this.getJobInform();
        this.getResume();
        this.viewPhone();
        this.checkQYZZ();
        this.onChange = value => {
            this.setState({ value });
        };
        this.onChange1 = value1 => {
            this.setState({ value1 });
        };
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    //获取职位列表
    getResume() {
        var entity = {
            userId: this.props.rowData.userId
        }
        Fetch.getJson(Config.mainUrl + '/basicResume/getPersonResume', entity)
            .then((res) => {
                console.log(res)
                this.setState({ rowData1: res[0], rowData2: res[1] })
            }
            )
    }
    //检查企业是否上传营业执照 //获取 公司信息
    checkQYZZ() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                //debugger
                if (res.loadSum == null) {
                    this.setState({
                        sum: 0
                    })
                } else {
                    this.setState({
                        sum: res.loadSum - res.haveLoadSum
                    })
                }
                this.setState({
                    cInfo: res,
                    interviewAddress: res.companyProvinceName + res.companyCityName + res.companyAreaName + res.companyAddress,
                    contactsName: res.hrName,
                    contactsWorkNumber: res.hrMobile,
                })
            })
    }
    //点击下载简历
    downLoad() {
        var entity = {
            userId: this.props.rowData.userId,
            resumeId: this.props.rowData.id,
            positionId: this.state.value1[0],
        }
        if (this.state.sum <= 0) {
            Toast.showInfo('无剩余查看次数', 1000)
            return;
        } if (this.state.value1[0] == '' || this.state.value1[0] == undefined) {
            Toast.showInfo('请选择职位', 1000)
            return;
        }
        Fetch.postJson(Config.mainUrl + '/offerLetter/downChange', entity)
            .then((res) => {
                console.log(res)
                if (res.rcode == '1') {
                    this.setState({ checkPhone: true, resumeShow: false })
                    this.checkQYZZ()
                    Toast.showInfo('查看成功', 1000)
                } else {
                    Toast.showInfo(res.Msg, 1000)
                }
            })
    }
    //简历是否允许查看
    viewPhone() {
        //debugger
        var entity = {
            creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            resumeId: this.props.rowData.id,
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/viewPhone', entity)
            .then((res) => {
                if (res) {
                    this.setState({ checkPhone: true })
                } else {
                    this.setState({ checkPhone: false })
                }
            }
            )
    }

    //获取职位列表
    getJobInform() {
        var list = []
        var conds1 = {
            //这里传参数
            creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            positionStatus: 'FB'
        };
        var url = Config.mainUrl + "/positionManagement?rows=100&page=1&type=1&cond=" + escape(JSON.stringify(conds1));
        Fetch.getJson(url)
            .then((res) => {
                console.log(res)
                if (res.contents.length == 0) {
                    // Toast.showInfo('没有已发布职位', 1000)
                    this.setState({
                        hide: true,

                    })
                } else {
                    this.setState({
                        result: res.contents,

                    })
                    for (var i in this.state.result) {
                        let data = {
                            label: this.state.result[i].positionName,
                            value: this.state.result[i].id
                        }
                        this.state.positionList.push(data)
                    }
                }
            })
    }
    callta() {
        if (this.props.rowData.remark6 == '0') {
            Toast.showInfo('对方已隐藏联系方式,无法获取', 1000)
        } else {
            this.setState({ resumeShow: true, })
        }
    }
    //获取公司信息
    // getCompanyInfo() {
    //     var entity = {
    //         userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
    //     }
    //     Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
    //         .then((res) => {
    //             this.setState({
    //                 cInfo: res,
    //                 interviewAddress: res.companyProvinceName + res.companyCityName + res.companyAreaName + res.companyAddress,
    //                 contactsName: res.hrName,
    //                 contactsWorkNumber: res.hrWorkNumber,
    //             })
    //         })
    // }
    render() {
        //debugger
        var rowData = this.props.rowData;
        var rowData1 = this.state.rowData1;
        let _maxLength = deviceHeight / 5;
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>简历详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>简历详情</Text>
                    </View>
                </View>
                <ScrollView>
                    <View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, width: deviceWidth / 2 }}>{rowData.intentPost}</Text>
                                    {rowData.salaryRanges_xs == '' || rowData.salaryRanges_xs == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, marginTop: 10 }}>{rowData.salaryRanges_xs} </Text>
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                                    {rowData.workMethod == '' || rowData.workMethod == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', }}>{(rowData.workMethod == 'FQRZ' ? '兼职' : rowData.workMethod == 'LWPQ' ? '抢单' : rowData.workMethod == 'LSYG' ? '合伙人' : rowData.workMethod == 'QRZ' ? '全日制' : null)}</Text>
                                        </View>
                                    }

                                    {rowData1.partTime == '' || rowData1.partTime == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', }}>兼职时间:{rowData1.partTime == '1' ? '上午' : rowData1.partTime == '2' ? '下午' : rowData1.partTime == '3' ? '晚上' : rowData1.partTime == '1,2' ? '上午  下午' : rowData1.partTime == '1,3' ? '上午  晚上' : rowData1.partTime == '2,3' ? '下午  晚上' : '任意时间'}</Text>
                                        </View>
                                    }
                                    {rowData.workYear == '' || rowData.workYear == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.workYear}</Text>
                                        </View>
                                    }
                                    {rowData.professionCertificate == '' || rowData.professionCertificate == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>职位证书:{rowData.professionCertificate == 'null' ? '无' : rowData1.professionCertificate}</Text>
                                        </View>
                                    }
                                </View>
                                {rowData.createTime == '' || rowData.createTime == undefined ? null :
                                    <View style={{ position: 'absolute', right: 30, bottom: 10, flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', }}>发布时间：</Text>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.timeChange(rowData.createTime)}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                        <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                    </View >
                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"user"} size={24} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize, marginTop: 4 }}>个人信息</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    {this.state.checkPhone == false ?
                        <View style={{ marginTop: 10, marginLeft: 10, flexDirection: 'row' }}>
                            {this.state.sum == '' || this.state.sum == undefined ? null :
                                <View style={{ padding: 3, alignItems: 'center', marginRight: 10, marginTop: 2 }}>
                                    {this.state.checkPhone == true ? null :
                                        <Text style={{ fontSize: Config.MainFontSize, color: 'red' }}>您当前简历剩余额度:{this.state.sum}</Text>
                                    }
                                </View>}
                            {this.state.sum == 0 || this.state.sum == '' ? null : <TouchableOpacity style={{ padding: 3, alignItems: 'center', marginLeft: 20, backgroundColor: 'rgb(65,143,234)', flexDirection: 'row', borderRadius: 5 }} onPress={this.callta.bind(this)}>
                                <VectorIcon name={"phone"} size={16} color={'white'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ backgroundColor: 'transparent', alignSelf: 'center', color: 'white', alignItems: 'center', fontSize: Config.MainFontSize, padding: 5 }}>联系Ta</Text>
                            </TouchableOpacity>}
                        </View>
                        : null}
                    <View style={{ marginTop: 10, marginLeft: 10, flexDirection: 'row' }}>
                        {rowData.personName == '' || rowData.personName == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>姓名:{rowData.personName}</Text>
                            </View>}
                        {/* 当前列表已经过滤了，不需要此字段的判断 isDisable 登录权限 0禁用 1可用 */}
                        {rowData.isDisable == undefined || rowData.isDisable == '1' ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: "red" }}>(该用户已被平台注销)</Text>
                            </View>}
                        {rowData.sex == '' || rowData.sex == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>性别:{rowData.sex == 'BX' ? '不限' : rowData.sex == 'FEMALE' ? '女' : rowData.sex == 'MALE' ? '男' : null}</Text>
                            </View>}
                    </View>
                    <View style={{ marginTop: 10, marginLeft: 10, flexDirection: 'row' }}>
                        {rowData.age == '' || rowData.age == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>年龄:{rowData.age}</Text>
                            </View>}
                        {rowData.birthDay == '' || rowData.birthDay == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>生日:{this.timeChange(rowData.birthDay)}</Text>
                            </View>}

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.identifyNum == '' || rowData.identifyNum == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>身份证号码:{rowData.identifyNum.length == 18 ? rowData.identifyNum.substring(0, 3) + '************' + rowData.identifyNum.substring(15, 18) : rowData.identifyNum.substring(0, 3) + '*********' + rowData.identifyNum.substring(13, 15)}</Text>
                            </View>}
                    </View>
                    {/** 用户自主隐藏联系方式 或 该用户被平台注销，其联系方式都会被隐藏 */}
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' || this.state.checkPhone == false || rowData.isDisable == '0' ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.phoneNumber == '' || rowData.phoneNumber == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData.phoneNumber.substring(0, 3) + '****' + rowData.phoneNumber.substring(7, 11)}</Text>
                                </TouchableOpacity>}
                        </View> : <View style={{ flexDirection: 'row' }}>
                            {rowData.phoneNumber == '' || rowData.phoneNumber == undefined ? null :
                                <TouchableOpacity onPress={() => this.onCall(rowData.phoneNumber)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData.phoneNumber}</Text>
                                </TouchableOpacity>}
                        </View>}
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' || this.state.checkPhone == false || rowData.isDisable == '0' ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.email == '' || rowData.email == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>邮箱:{rowData.email.substring(0, 3) + '*****' + '@' + '*****'}</Text>
                                </TouchableOpacity>}
                        </View> : <View style={{ flexDirection: 'row' }}>
                            {rowData.email == '' || rowData.email == undefined ? null :
                                <TouchableOpacity onPress={() => this.onCall_Clipboard(rowData.email)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>邮箱:{rowData.email}</Text>
                                </TouchableOpacity>}
                        </View>}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.educateFrom == '' || rowData.educateFrom == undefined ? <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业学校:未填写</Text>
                        </View> :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业学校:{rowData.educateFrom}</Text>
                            </View>}
                        {rowData.highestEducation_xs == '' || rowData.highestEducation_xs == undefined ?
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>学历:未填写</Text>
                            </View> :
                            <View style={{ padding: 3, marginTop: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>学历:{rowData.highestEducation_xs}</Text>
                            </View>
                        }

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.educateTime == '' || rowData.educateTime == undefined ? <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业时间:未填写</Text>
                        </View> :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业时间:{this.timeChange(rowData.educateTime)}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.homeAddress == '' || rowData.homeAddress == undefined ? <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>住址:未填写</Text>
                        </View> :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>住址:{rowData.homeAddress}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.urgenPerson == '' || rowData.urgenPerson == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>紧急联系人:{rowData.urgenPerson}</Text>
                            </View>}
                    </View>
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' || this.state.checkPhone == false ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.urgenPhone == '' || rowData.urgenPhone == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>联系电话:{rowData.urgenPhone.substring(0, 3) + '****' + rowData.urgenPhone.substring(7, 11)}</Text>
                                </TouchableOpacity>}
                        </View> : <View style={{ flexDirection: 'row' }}>
                            {rowData.urgenPhone == '' || rowData.urgenPhone == undefined ? null :
                                <TouchableOpacity onPress={() => this.onCall(rowData.urgenPhone)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>联系电话:{rowData.urgenPhone}</Text>
                                </TouchableOpacity>}
                        </View>}
                    <View style={{ flexDirection: 'row', margin: 10, }}>
                        <VectorIcon name={"building"} size={24} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize, marginTop: 4 }}>工作经历</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                        {this.state.rowData2.length == 0 ? <Text style={{ fontSize: Config.MainFontSize - 1 }}>暂无工作经历</Text> :
                            <ListView
                                style={{ borderRadius: 20 }}
                                dataSource={this.ds.cloneWithRows(this.state.rowData2)}
                                renderRow={this._renderItem.bind(this)}
                            />
                        }
                    </View>
                    {this.state.interviewTimeShow == true ? <View style={{ alignSelf: 'center', width: deviceWidth - 40, marginTop: 70, backgroundColor: 'white', position: 'absolute' }}>
                        <View style={{ width: deviceWidth - 40, alignSelf: 'center', backgroundColor: 'white', borderWidth: 1, borderRadius: 10, borderColor: 'grey' }}>
                            <VectorIcon onPress={() => this.setState({ interviewTimeShow: false })} name={'android-close'} style={{ color: 'black', fontSize: 22, position: 'absolute', right: 5, top: 5, backgroundColor: 'transparent' }} />
                            <Text style={{ position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>请选择面试信息</Text>
                            <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 40 }}>
                                <DatePicker
                                    date={this.state.interviewTime}
                                    mode="datetime"
                                    minDate={new Date()}
                                    placeholder="选择面试时间"
                                    placeholderColor='red'
                                    format="YYYY-MM-DD HH:mm"
                                    onDateChange={(interviewTime) => { this.setState({ interviewTime: interviewTime }); }}
                                />
                                <View style={{ width: Dimensions.get('window').width - 62, height: 44, marginTop: 10 }}>

                                    <List >
                                        <Picker
                                            data={this.state.positionList}
                                            cols={1}
                                            value={this.state.value}
                                            onChange={this.onChange}
                                        >
                                            <List.Item arrow="horizontal">
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>选择面试职位</Text>
                                                </View>
                                            </List.Item>
                                        </Picker>
                                    </List>

                                </View>
                            </View>
                            <View style={{ width: deviceWidth - 70, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "#c2c2c2", marginLeft: 20, marginRight: 20 }}>
                                <View style={{ width: "30%" }}><Text style={{ textAlign: "left" }}>面试地址</Text></View>
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    style={{ textAlign: "right", width: "70%", fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    value={this.state.interviewAddress}
                                    multiline={true}
                                    numberOfLines={2}
                                    onChangeText={(text) => this.setState({ interviewAddress: text })} />
                            </View>
                            <View style={{ width: deviceWidth - 70, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "#c2c2c2", marginLeft: 20, marginRight: 20 }}>
                                <View style={{ width: "30%" }}><Text style={{ textAlign: "left" }}>联系人</Text></View>
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    style={{ textAlign: "right", width: "70%", fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    value={this.state.contactsName}
                                    multiline={true}
                                    onChangeText={(text) => this.setState({ contactsName: text })} />
                            </View>
                            <View style={{ width: deviceWidth - 70, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: "#c2c2c2", marginLeft: 20, marginRight: 20 }}>
                                <View style={{ width: "30%" }}><Text style={{ textAlign: "left" }}>电话</Text></View>
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    style={{ textAlign: "right", width: "70%", fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    value={this.state.contactsWorkNumber}
                                    multiline={true}
                                    keyboardType='numeric'
                                    maxLength={11}
                                    onChangeText={(text) => this.setState({ contactsWorkNumber: text })} />
                            </View>
                            <View style={{ width: deviceWidth - 80, height: 100, backgroundColor: '#E8E8E8', margin: 20 }}>
                                {
                                    <TextInput
                                        underlineColorAndroid={'transparent'}
                                        placeholder={'附加说明'}
                                        style={{ textAlign: 'left', marginLeft: 16, marginRight: 16, flex: 1, fontSize: 14 }}
                                        autoCapitalize={'none'}
                                        multiline={true}
                                        maxLength={parseInt(_maxLength)}
                                        onChangeText={(text) => this.setState({ description: text })} />

                                }
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 50 }}>
                                <TouchableOpacity style={{ width: deviceWidth / 3, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginTop: 20, borderRadius: 5, position: 'absolute', left: 10, bottom: 10 }} onPress={() => this.setState({ interviewTimeShow: false, })}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>取消</Text></TouchableOpacity>
                                <TouchableOpacity style={{ width: deviceWidth / 3, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginTop: 20, borderRadius: 5, position: 'absolute', right: 10, bottom: 10 }} onPress={this.sendInterview.bind(this)}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>确定</Text></TouchableOpacity>
                            </View>
                        </View>

                    </View> : null
                    }
                    {this.state.resumeShow == true ? <View style={{ alignSelf: 'center', width: deviceWidth - 40, marginTop: 70, backgroundColor: 'white', position: 'absolute' }}>
                        <View style={{ width: deviceWidth - 40, alignSelf: 'center', backgroundColor: 'white', borderWidth: 1, borderRadius: 10, borderColor: 'grey' }}>
                            <VectorIcon onPress={() => this.setState({ resumeShow: false })} name={'android-close'} style={{ color: 'black', fontSize: 22, position: 'absolute', right: 5, top: 5, backgroundColor: 'transparent' }} />
                            <Text style={{ position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>请选择职位</Text>
                            <View style={{ alignItems: 'center', alignSelf: 'center', marginTop: 40 }}>
                                <View style={{ width: Dimensions.get('window').width - 62, height: 44, marginTop: 10 }}>

                                    <List >
                                        <Picker
                                            data={this.state.positionList}
                                            cols={1}
                                            value={this.state.value1}
                                            onChange={this.onChange1}
                                        >
                                            <List.Item arrow="horizontal">
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>选择职位</Text>
                                                </View>
                                            </List.Item>
                                        </Picker>
                                    </List>

                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 70 }}>
                                <TouchableOpacity style={{ width: deviceWidth / 3, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginTop: 20, borderRadius: 5, position: 'absolute', left: 10, bottom: 10 }} onPress={() => this.setState({ resumeShow: false, })}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>取消</Text></TouchableOpacity>
                                <TouchableOpacity style={{ width: deviceWidth / 3, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginTop: 20, borderRadius: 5, position: 'absolute', right: 10, bottom: 10 }} onPress={this.downLoad.bind(this)}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>确定</Text></TouchableOpacity>
                            </View>
                        </View>

                    </View> : null
                    }

                </ScrollView>
                {this.state.hide == true ? null :
                    <View style={{ marginTop: 60 }}>
                        <TabNavigator
                            hidesTabTouch={true}
                            tabBarStyle={styles.tabbar}
                            sceneStyle={{ paddingBottom: styles.tabbar.height }}>
                            <TabNavigator.Item
                                tabStyle={{
                                    paddingTop: 26,
                                    width: deviceWidth - 20,
                                    alignSelf: 'center',
                                    backgroundColor: (this.state.sendResume == false) ? 'rgb(65,143,234)' : 'grey'
                                }}
                                selected={this.state.selectedTab === 'contacts'}
                                selectedTitleStyle={{ color: 'rgb(22,131,251)' }}
                                titleStyle={styles.titleStyle}
                                title={this.state.sendResume == false ? '发送面试通知' : '已发送'}
                                onPress={this.submit.bind(this)}
                            >
                            </TabNavigator.Item>
                        </TabNavigator>
                    </View>
                }

            </View>
        );
    }
    _renderItem(rowData) {
        return (
            <View>
                <View style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>公司名称:{rowData.companyName}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, marginTop: 10 }}>岗位:{rowData.position}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.entryTime == '' || rowData.entryTime == undefined ? null :
                                <View style={{ marginTop: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1 }}>入职时间:{this.timeChange(rowData.entryTime)}</Text>
                                </View>}
                            {rowData.seperateTime == '' || rowData.seperateTime == undefined ? null :
                                <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1 }}>离职时间:{this.timeChange(rowData.seperateTime)}</Text>
                                </View>}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.workContent == '' || rowData.workContent == undefined ? null :
                                <View style={{ marginTop: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, maxWidth: deviceWidth - 30 }}>工作内容:{rowData.workContent}</Text>
                                </View>}
                        </View>

                    </View>
                </View>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View>
        )
    }
    onCall_Clipboard(phoneNum) {
        let url;
        if (Platform.OS !== 'android') {
            url = 'mailto:' + phoneNum;
        } else {
            url = 'mailto:' + phoneNum;
        }
        Linking.openURL(url);
    }
    onCall(phoneNum) {
        let url;
        if (Platform.OS !== 'android') {
            url = 'telprompt:' + phoneNum;
        } else {
            url = 'tel:' + phoneNum;
        }
        Linking.openURL(url);
    }
    sendInterview() {
        if (this.state.sum <= 0) {
            Toast.showInfo('无剩余查看次数', 1000)
            return;
        }
        if (phoneRule.test(this.state.contactsWorkNumber) == false) {
            Toast.showInfo('请填写正确的电话', 1000)
            return;
        }
        if (this.state.interviewTime == '' || this.state.interviewTime == undefined) {
            Toast.showInfo('请选择面试时间', 1000)
            return;
        } if (this.state.value[0] == '' || this.state.value[0] == undefined) {
            Toast.showInfo('请选择面试职位', 1000)
            return;
        }
        else {
            var entity = {
                userId: this.props.rowData.userId,
                resumeId: this.props.rowData.id,
                positionId: this.state.value[0],
            }
            Fetch.postJson(Config.mainUrl + '/offerLetter/downChange', entity)
                .then((res) => {
                    //debugger
                    if (res.rcode == '1') {
                        this.setState({ checkPhone: true, resumeShow: false })
                        this.checkQYZZ()
                    }
                    // else {
                    //     Toast.showInfo(res.Msg, 1000)
                    // }
                })
            var entity1 = {
                id: this.state.cInfo.id,
                companyName: this.state.cInfo.companyName,
                userId: this.props.rowData.userId,
                positionId: this.state.value[0],
                interviewTime: this.state.interviewTime,
                description: this.state.description == '' ? '无' : this.state.description,
                interviewAddress: this.state.interviewAddress,
                hrName: this.state.contactsName,
                hrMobile: this.state.contactsWorkNumber,
                hrEmail: this.state.cInfo.hrEmail
            }
            Fetch.postJson(Config.mainUrl + '/interviewNotice/sendInterviewToResApp', entity1)
                .then((resInfo) => {
                    // debugger
                    if (resInfo) {
                        Toasts.show('发送成功', { position: px2dp(-80), duration: 1000 });
                        this.setState({ sendResume: true, interviewTimeShow: false })
                    } else {
                        Toasts.show('发送失败，请重试', { position: px2dp(-80), duration: 1000 });
                    }
                })
        }
    }
    submit() {
        if (this.props.rowData.isDisable !== undefined && this.props.rowData.isDisable == '0') {
            Alert.alert("温馨提示", "该用户因违反平台规定已被注销，不能接收面试通知"
                , [
                    {
                        text: "确定", onPress: () => {
                        }
                    },])
            return
        }
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
