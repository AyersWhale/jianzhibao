/**
 * 应聘简历详情
 * Created by 曾一川 on 17/04/19.
 */
import React, { Component } from 'react';
import { Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Platform, TouchableOpacity, ListView, TextInput, BackHandler } from 'react-native';
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

export default class YingpinResumeInform extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            sendResume: (this.props.sendResume) ? true : false,
            interviewTime: '',
            interviewTimeShow: false,
            positionList: [],
            value: [],
            positionId: '',
            positionName: '',
            checkPhone: '',
            USER_ID: this.props.rowData.USER_ID,
            rowData1: '',
            rowData2: '',
            hide: false,
            description: '您好，欢迎您前来我公司面试，若有任何问题可随时与我们联系，祝您生活愉悦、天天开心。',
            interviewAddress: '',
            contactsName: "",
            contactsWorkNumber: "",
            cInfo: {}
        }
        this.viewPhone();
        this.getJobInform();
        this.checkResume();
        this.getResume();
        this.getCompanyInfo();
        this.onChange = value => {
            this.setState({ value });
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
    //查看简历状态
    checkResume() {
        var deliveryId = this.props.rowData.DELIVER_ID;
        Fetch.postJson(Config.mainUrl + '/delivery/updateViewStatus', deliveryId)
            .then((json) => {
                console.log(json)
            })
    }
    //简历是否允许查看
    viewPhone() {
        //debugger
        var entity = {
            creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            resumeId: this.props.rowData.RESUME_ID,
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/viewPhone', entity)
            .then((res) => {
                if (res) {
                    this.setState({ checkPhone: true })
                } else {
                    this.setState({ checkPhone: false })
                }
            })
    }
    //获取职位列表
    getResume() {
        var entity = {
            userId: this.state.USER_ID
        }
        Fetch.getJson(Config.mainUrl + '/basicResume/getPersonResume', entity)
            .then((res) => {
                console.log(res)
                this.setState({ rowData1: res[0], rowData2: res[1] })
            }
            )
    }

    getJobInform() {
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
    //获取公司信息
    getCompanyInfo() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                this.setState({
                    cInfo: res,
                    interviewAddress: res.companyProvinceName + res.companyCityName + res.companyAreaName + res.companyAddress,
                    contactsName: res.hrName,
                    contactsWorkNumber: res.hrMobile,
                })
            })
    }
    render() {
        //debugger
        var rowData = this.props.rowData;
        var rowData1 = this.state.rowData1;
        let _maxLength = deviceHeight / 5;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>简历详情</Text>
                    </View>
                </ImageBackground>
                <ScrollView>
                    <View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, width: '70%', }}>{rowData.POSITION_NAME}</Text>
                                    {rowData.XZFW == '' || rowData.XZFW == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, top: 10 }}>{rowData.XZFW} </Text>
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                                    {rowData.POSITION_KIND == '' || rowData.POSITION_KIND == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>{rowData.POSITION_KIND}</Text>
                                        </View>
                                    }
                                    {rowData.EDUCATION_REQUIRE == '' || rowData.EDUCATION_REQUIRE == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>学历:{rowData.EDUCATION_REQUIRE}</Text>
                                        </View>
                                    }
                                    {rowData.AGE_REQUIRE == '' || rowData.AGE_REQUIRE == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.AGE_REQUIRE}</Text>
                                        </View>
                                    }
                                    {rowData.WORK_YEARS == '' || rowData.WORK_YEARS == undefined ? null :
                                        <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.WORK_YEARS}</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                    </View >
                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"user"} size={24} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize, marginTop: 4 }}>简历信息</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <View style={{ marginTop: 10, marginLeft: 10, flexDirection: 'row' }}>
                        {rowData1.personName == '' || rowData1.personName == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>姓名:{rowData1.personName}</Text>
                            </View>}
                        {/* isDisable 登录权限 0禁用 1可用 */}
                        {rowData.isDisable == undefined || rowData.isDisable == '1' ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: "red" }}>(该用户已被平台注销)</Text>
                            </View>}
                        {rowData1.sex == '' || rowData1.sex == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>性别:{rowData1.sex == 'BX' ? '不限' : rowData1.sex == 'FEMALE' ? '女' : rowData1.sex == 'MALE' ? '男' : null}</Text>
                            </View>}

                    </View>
                    <View style={{ marginTop: 10, marginLeft: 10, flexDirection: 'row' }}>
                        {rowData1.age == '' || rowData1.age == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>年龄:{rowData1.age}</Text>
                            </View>}
                        {rowData1.birthDay == '' || rowData1.birthDay == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>生日:{this.timeChange(rowData1.birthDay)}</Text>
                            </View>}

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.nativePlace == '' || rowData1.nativePlace == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>身份证地址:{rowData1.nativePlace}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.identifyNum == '' || rowData1.identifyNum == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>身份证号码:{rowData1.identifyNum}</Text>
                            </View>}
                    </View>
                    {/* <View style={{ flexDirection: 'row' }}>
                        {rowData1.phoneNumber == '' || rowData1.phoneNumber == undefined ? null :
                            <TouchableOpacity onPress={() => this.onCall(rowData1.phoneNumber)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData1.phoneNumber}</Text>
                            </TouchableOpacity>}
                    </View> */}
                    {/** 用户自主隐藏联系方式 或 该用户被平台注销，其联系方式都会被隐藏 */}
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' || rowData1.isDisable == '0' ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData1.phoneNumber == '' || rowData1.phoneNumber == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData1.phoneNumber.substring(0, 3) + '****' + rowData1.phoneNumber.substring(7, 11)}</Text>
                                </TouchableOpacity>}
                        </View> : <View style={{ flexDirection: 'row' }}>
                            {rowData1.phoneNumber == '' || rowData1.phoneNumber == undefined ? null :
                                <TouchableOpacity onPress={() => this.onCall(rowData1.phoneNumber)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData1.phoneNumber}</Text>
                                </TouchableOpacity>}
                        </View>}
                    {rowData1.isDisable == '0' ? <View style={{ flexDirection: 'row' }}>
                        {rowData1.email == '' || rowData1.email == undefined ? null :
                            <TouchableOpacity onPress={() => this.onCall_Clipboard(rowData1.email)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>邮箱:{rowData1.email.substring(0, 3) + '*****' + '@' + '*****'}</Text>
                            </TouchableOpacity>}
                    </View>
                        : <View style={{ flexDirection: 'row' }}>
                            {rowData1.email == '' || rowData1.email == undefined ? null :
                                <TouchableOpacity onPress={() => this.onCall_Clipboard(rowData1.email)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>邮箱:{rowData1.email}</Text>
                                </TouchableOpacity>}
                        </View>}

                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.educateFrom == '' || rowData1.educateFrom == undefined ?
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业学校:未填写</Text>
                            </View> :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业学校:{rowData1.educateFrom}</Text>
                            </View>}
                        {rowData1.profession == '' || rowData1.profession == undefined ? <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>所学专业:未填写</Text>
                        </View> :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>所学专业:{rowData1.profession}</Text>
                            </View>}


                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.educateTime == '' || rowData1.educateTime == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业时间:{this.timeChange(rowData1.educateTime)}</Text>
                            </View>}
                        {rowData1.highestEducation == '' || rowData1.highestEducation == undefined ? <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>学历:未填写</Text>
                        </View> :
                            <View style={{ padding: 3, marginTop: 10, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>学历:{rowData1.highestEducation}</Text>
                            </View>
                        }
                        {rowData1.workYear == '' || rowData1.workYear == undefined ? null :
                            <View style={{ marginTop: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>工作经验:{rowData1.workYear}年</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.homeAddress == '' || rowData1.homeAddress == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>住址:{rowData1.homeAddress}</Text>
                            </View>}
                    </View>
                    {/* <View style={{ flexDirection: 'row' }}>
                        {rowData1.urgenPerson == '' || rowData1.urgenPerson == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>紧急联系人:{rowData1.urgenPerson}</Text>
                            </View>}
                        {rowData1.urgenPhone == '' || rowData1.urgenPhone == undefined ? null :
                            <TouchableOpacity onPress={() => this.onCall(rowData1.urgenPhone)} style={{ padding: 3, marginTop: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>紧急联系电话:{rowData1.urgenPhone}</Text>
                            </TouchableOpacity>
                        }

                    </View> */}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.urgenPerson == '' || rowData1.urgenPerson == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>紧急联系人:{rowData1.urgenPerson}</Text>
                            </View>}
                    </View>
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData1.urgenPhone == '' || rowData1.urgenPhone == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>联系电话:{rowData1.urgenPhone.substring(0, 3) + '****' + rowData1.urgenPhone.substring(7, 11)}</Text>
                                </TouchableOpacity>}
                        </View> :
                        <View style={{ flexDirection: 'row' }}>
                            {rowData1.urgenPhone == '' || rowData1.urgenPhone == undefined ? null :
                                <TouchableOpacity onPress={() => this.onCall(rowData1.urgenPhone)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>联系电话:{rowData1.urgenPhone}</Text>
                                </TouchableOpacity>}
                        </View>}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.workMethod == '' || rowData1.workMethod == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>工作方式:{rowData1.workMethod}</Text>
                            </View>}
                        {rowData1.professionCertificate == '' || rowData1.professionCertificate == undefined ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>职位证书:{rowData1.professionCertificate == 'null' ? '无' : rowData1.professionCertificate}</Text>
                            </View>
                        }
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.intentPost == '' || rowData1.intentPost == undefined ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>意向职位:{rowData1.intentPost}</Text>
                            </View>
                        }
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.partTime == '' || rowData1.partTime == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>兼职时间:{rowData1.partTime == '1' ? '上午' : rowData1.partTime == '2' ? '下午' : rowData1.partTime == '3' ? '晚上' : rowData1.partTime == '1,2' ? '上午  下午' : rowData1.partTime == '1,3' ? '上午  晚上' : rowData1.partTime == '2,3' ? '下午  晚上' : '任意时间'}</Text>
                            </View>}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.salaryRanges == '' || rowData1.salaryRanges == undefined ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>薪资要求:{rowData1.salaryRanges}</Text>
                            </View>
                        }

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {rowData1.createTime == '' || rowData1.createTime == undefined ? null :
                            <View style={{ padding: 3, marginTop: 10, marginLeft: 10, alignItems: 'center', marginRight: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey' }}>创建时间:{this.timeChange(rowData1.createTime)}</Text>
                            </View>
                        }
                    </View>
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

                </ScrollView>
                {this.state.interviewTimeShow == true ? <View style={{ alignSelf: 'center', width: deviceWidth - 40, marginTop: 200, backgroundColor: 'white', position: 'absolute' }}>
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
                                maxLength={11}
                                // keyboardType='numeric'
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
                                    value={this.state.description}
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

        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        }
        if (phoneRule.test(this.state.contactsWorkNumber) == false) {
            Toast.showInfo('请填写正确的电话', 1000)
            return;
        }
        if (this.state.interviewTime == '' || this.state.interviewTime == undefined) {
            Toast.showInfo('请选择面试时间', 1000)
            return;
        }
        else {
            var entity1 = {
                // res: this.state.cInfo,
                id: this.state.cInfo.id,
                companyName: this.state.cInfo.companyName,
                // userId: this.props.rowData.USER_ID,
                // positionId: this.props.rowData.id,
                // interviewTime: this.state.interviewTime,
                // description: this.state.description == '' ? '无' : this.state.description,
                // interviewAddress: this.state.interviewAddress,
                // contactsName: this.state.contactsName,
                // contactsWorkNumber: this.state.contactsWorkNumber
                userId: this.props.rowData.USER_ID,
                positionId: this.props.rowData.id,
                interviewTime: this.state.interviewTime,
                interviewAddress: this.state.interviewAddress,
                hrName: this.state.contactsName,
                hrMobile: this.state.contactsWorkNumber,
                hrEmail: this.state.cInfo.hrEmail,
                description: this.state.description == '' ? '无' : this.state.description
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
