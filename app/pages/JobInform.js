/**
 * 职位详情
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { ListView, Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Modal, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { FileManager, Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, UUID } from 'c2-mobile';
import theme from '../config/theme';
import { C2AmapApi } from 'c2-mobile-amap';
import TabNavigator from 'react-native-tab-navigator';
import Toasts from 'react-native-root-toast';
import px2dp from '../utils/px2dp';
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';
import Global from '../utils/GlobalStorage';
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const TEXTLINGHT = 30;

export default class JobInform extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: [],
            toudi: (this.props.toudi) ? true : false,
            result: '',
            jianliUpdate: true,
            idcardUpdate: true,
            SALARY_RANGE: '',
            HOUR_SALARY: '',
            AGE_REQUIRE: '',
            EDUCATION_REQUIRE: '',
            WORK_MODE: '',
            WORK_YEARS: '',
            POSITION_KIND: '',
            RECRUIT_NUMBER: '',
            WORK_DAY: '',
            CREATE_TIME: '',
            POSITION_PROVINCE_NAME: '',
            POSITION_CITY_NAME: '',
            POSITION_AREA_NAME: '',
            JOB_DESCRIPTION: '',
            POSITION_NAME: '',
            RELEASE_COMPANY_NAME: '',
            checkStatu: '',
            LSYGJOB_DESCRIPTION: '',
            LSYGCOMPANY_NAME: '',
            LSYGSALARY: '',
            LSYGSERVING_REQUIRE: '',
            LSYGCOMPANY_KIND: '',
            LSYGareadetail: '',
            LSYGWORK_END_TIME: '',
            LSYGremark2: '',
            LSYGid: '',
            jobDescription: '',
            // modalVisible: (this.props.rowData.status == false && this.props.rowData.WORK_MODE == '合伙人' && this.props.rowData.type == undefined) ? true : false,
            // 接包须知在改为申请接包时弹出
            modalVisible: false,
            read: false,
            POSITION_PROVINCE_NAME: '',
            POSITION_AREA_NAME: '',
            POSITION_CITY_NAME: '',
            address: '',
            jfaddress: '',
            yfaddress: '',
            bfaddress: '',
            license: ""
        }
        this._initService()
        this._getGps()
        this.getJobInformation()
        this.loginMode()
        this.checkYYZZ()
        this.getAddress()
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
    //检查个人是否上传营业执照
    checkYYZZ() {
        Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                if (res == undefined) {
                    this.setState({ checkStatu: '' })
                } else {
                    this.setState({ checkStatu: res.status })
                }

            })
    }
    renderListView() {
        var data = this.state.dataSource;
        var temp = [];
        if (data.length == 0) {
            temp.push(
                <View >
                    <Text style={{ marginTop: 10, }}>{"无附件"}</Text>
                </View>
            )
        } else {
            for (let i in data) {
                temp.push(
                    <TouchableOpacity key={i} onPress={this.downLoadFile.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + encodeURIComponent(data[i].filePath), data[i].fileName)}>
                        <Text style={{ marginTop: 10, color: 'rgb(65,143,234)' }}>{data[i].fileName}</Text>
                    </TouchableOpacity>
                )
            }
        }

        return temp

    }
    downLoadFile(uri, fileName) {
        if (fileName.indexOf('jpg') != -1 || fileName.indexOf('png') != -1) {
            Actions.ImageZoom({ url: uri })

        } else {
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
                            })
                            .catch((e) => {
                                Toast.showInfo('查看失败，文件已失效或损坏', 1000);
                            })
                    }
                }).catch((e) => {
                    console.log(e);
                })
        }

    }
    //获取签订双方位置
    getAddress() {
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/queryAddress?fbUserId=' + this.props.rowData.CREATOR_ID + '&jbuserId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                if (res) {
                    this.setState({
                        bfaddress: res.userAddress,//丙方地址
                        yfaddress: res.yfAdress,//乙方
                        jfaddress: res.companyAddress//甲方地址
                    })
                }
            })
    }

    refresh(id) {
        let docParams = {
            params: {
                businessKey: id,
            }
        }

        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            th.setState({
                dataSource: entry,
            });
        });

    }
    //获取职位详情
    getJobInformation() {
        if (this.props.rowData.WORK_MODE == '合伙人' || this.props.rowData.workMode == 'LSYG') {
            //获取临时用工职位详情
            Fetch.getJson(Config.mainUrl + '/temporaryWork/getTemporaryWorkDetail?id=' + this.props.rowData.ID)
                .then((res) => {
                    this.refresh(res[0].id)
                    console.log(res)
                    this.setState({
                        LSYGid: res[0].id,
                        LSYGJOB_DESCRIPTION: res[0].JOB_DESCRIPTION,
                        LSYGCOMPANY_NAME: res[0].COMPANY_NAME,
                        LSYGSALARY: res[0].SALARY,
                        LSYGSERVING_REQUIRE: res[0].SERVING_REQUIRE,
                        LSYGCOMPANY_KIND: res[0].COMPANY_KIND,
                        LSYGareadetail: res[0].areadetail,
                        POSITION_PROVINCE_NAME: res[0].POSITION_PROVINCE_NAME,
                        POSITION_CITY_NAME: res[0].POSITION_CITY_NAME,
                        POSITION_AREA_NAME: res[0].POSITION_AREA_NAME,
                        address: res[0].address,
                        POSITION_NAME: res[0].pname,
                        SALARY: res[0].SALARY,
                        LSYGWORK_END_TIME: res[0].WORK_END_TIME,
                        LSYGremark2: res[0].remark2,
                        license: res[0].ELECTRONIC_BUSINESS_LICENSE,
                    })
                })
        } else if (this.props.rowData.workMode == 'CHYW' || this.props.rowData.WORK_MODE == '撮合') {
            Fetch.getJson(Config.mainUrl + '/transfer_temporaryWork/getTemporaryWorkDetail?id=' + this.props.rowData.ID)
                .then((res) => {
                    this.refresh(res[0].id)
                    console.log(res)
                    this.setState({
                        LSYGid: res[0].id,
                        LSYGJOB_DESCRIPTION: res[0].JOB_DESCRIPTION,
                        LSYGCOMPANY_NAME: res[0].COMPANY_NAME,
                        LSYGSALARY: res[0].SALARY,
                        LSYGSERVING_REQUIRE: res[0].SERVING_REQUIRE,
                        LSYGCOMPANY_KIND: res[0].COMPANY_KIND,
                        LSYGareadetail: res[0].areadetail,
                        POSITION_PROVINCE_NAME: res[0].POSITION_PROVINCE_NAME,
                        POSITION_CITY_NAME: res[0].POSITION_CITY_NAME,
                        POSITION_AREA_NAME: res[0].POSITION_AREA_NAME,
                        address: res[0].address,
                        POSITION_NAME: res[0].pname,
                        SALARY: res[0].SALARY,
                        LSYGWORK_END_TIME: res[0].WORK_END_TIME,
                        LSYGremark2: res[0].remark2,
                        license: res[0].ELECTRONIC_BUSINESS_LICENSE,
                    })
                })
        } else {
            Fetch.getJson(Config.mainUrl + '/ws/getOnePositionManagement?id=' + this.props.rowData.ID)
                .then((res) => {
                    console.log(res)
                    this.setState({
                        result: res,
                        SALARY_RANGE: res.salaryRange,
                        HOUR_SALARY: res.hourSalary,
                        AGE_REQUIRE: res.ageRequire,
                        EDUCATION_REQUIRE: res.educationRequire,
                        WORK_MODE: res.workMode,
                        WORK_YEARS: res.workYears,
                        POSITION_KIND: res.positionKind,
                        RECRUIT_NUMBER: res.recruitNumber,
                        WORK_DAY: res.workDay,
                        CREATE_TIME: res.createTime,
                        POSITION_NAME: res.positionName,
                        POSITION_PROVINCE_NAME: res.positionProvinceName,
                        POSITION_CITY_NAME: res.positionCityName,
                        POSITION_AREA_NAME: res.positionAreaName,
                        RELEASE_COMPANY_NAME: res.releaseCompanyName,
                        jobDescription: res.jobDescription,
                        address: res.detailedAddress,//职位详细地址
                    })
                })
        }

    }
    loginMode() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/checkUserIdCard', entity)
            .then((res) => {
                if (res.rcode == 0) {//未填写身份证信息
                    // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                    this.setState({
                        idcardUpdate: false,
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1
                    })
                } else {
                    Fetch.postJson(Config.mainUrl + '/basicResume/checkBasicResume', entity)
                        .then((res) => {
                            if (res.rcode == 0) {//未填写简历
                                // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                this.setState({
                                    idcardUpdate: true,
                                    jianliUpdate: false,
                                    userName: UserInfo.loginSet.result.rdata.loginUserInfo.userName,
                                    passWord: UserInfo.userInfo.params.passWord,
                                    login: 1,
                                    userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                                    telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1,
                                    idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard
                                })
                            } else {
                                this.setState({
                                    jianliUpdate: true,
                                })
                            }
                        })
                }
            }).catch((res) => {
                Toasts.show(res.description, { position: -60 });
            })
    }
    render() {
        var rowData = this.props.rowData;
        var num = (this.state.result.remark1 == undefined) ? '' : this.state.result.remark1 + "人 | ";
        var type = (this.state.result.remark2 == undefined) ? '' : this.state.result.remark2;
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>职位详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>职位详情</Text>
                    </View>
                </View>
                {this.props.rowData.type == 'MyApplicate' && this.props.rowData.workMode == 'FQRZ' ?
                    <ScrollView style={{ marginBottom: 80 }} >
                        <View>
                            <View style={{ backgroundColor: 'transparent' }}>
                                <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, maxWidth: deviceWidth / 1.8 }}>{this.state.POSITION_NAME}</Text>
                                        {this.state.SALARY_RANGE == '' || this.state.SALARY_RANGE == undefined ? null :
                                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{(this.state.SALARY_RANGE == '面议' || this.state.SALARY_RANGE == '不限') ? this.state.SALARY_RANGE : this.state.SALARY_RANGE + "元/月"}</Text>
                                        }
                                        {this.state.HOUR_SALARY == '' || this.state.HOUR_SALARY == undefined ? null :
                                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{this.state.HOUR_SALARY} {this.state.WORK_MODE == '兼职' ? this.state.WORK_MODE == '合伙人' ? '元/月' : "元/小时" : this.state.HOUR_SALARY == '不限' ? "" : this.state.HOUR_SALARY == '面议' ? "" : '元/月'}</Text>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                                        {this.state.AGE_REQUIRE == '' || this.state.AGE_REQUIRE == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{this.state.AGE_REQUIRE}</Text>
                                            </View>
                                        }
                                        {this.state.EDUCATION_REQUIRE == '' || this.state.EDUCATION_REQUIRE == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{this.state.EDUCATION_REQUIRE}</Text>
                                            </View>
                                        }
                                        {this.state.WORK_MODE == '' || this.state.WORK_MODE == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{this.state.WORK_MODE}</Text>
                                            </View>
                                        }
                                        {this.state.WORK_YEARS == '' || this.state.WORK_YEARS == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{this.state.WORK_YEARS}</Text>
                                            </View>
                                        }
                                    </View>
                                    {/* {this.state.SALARY_RANGE == '' || this.state.SALARY_RANGE == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5, top: 20 }}>{(this.state.SALARY_RANGE == '面议' || this.state.SALARY_RANGE == '不限') ? this.state.SALARY_RANGE : this.state.SALARY_RANGE + "元/月"}</Text>
                                    }
                                    {this.state.HOUR_SALARY == '' || this.state.HOUR_SALARY == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5, top: 20 }}>{this.state.HOUR_SALARY} {this.state.WORK_MODE == '非全日制' ? this.state.WORK_MODE == '临时承揽' ? '元/月' : "元/小时" : this.state.HOUR_SALARY == '不限' ? "" : this.state.HOUR_SALARY == '面议' ? "" : '元/月'}</Text>
                                    } */}
                                    <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>

                                        {this.state.POSITION_KIND == '' || this.state.POSITION_KIND == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{this.state.POSITION_KIND}</Text>
                                            </View>
                                        }

                                        {this.state.RECRUIT_NUMBER == '' || this.state.RECRUIT_NUMBER == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>招聘人数:{this.state.RECRUIT_NUMBER}人</Text>
                                            </View>
                                        }
                                        {this.state.WORK_DAY == '' || this.state.WORK_DAY == undefined ? null :
                                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>工时:{this.state.WORK_DAY}小时/天</Text>
                                            </View>
                                        }
                                    </View>
                                    {rowData.ALL_ADRESS == '' || rowData.ALL_ADRESS == undefined ? null :
                                        <View style={{ position: 'absolute', right: 30, bottom: 22, flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.ALL_ADRESS}</Text>
                                        </View>
                                    }
                                    {this.state.CREATE_TIME == '' || this.state.CREATE_TIME == undefined ? null :
                                        <View style={{ position: 'absolute', right: 30, bottom: 2, flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{"发布日期 :" + this.timeChange(this.state.CREATE_TIME)}</Text>
                                        </View>
                                    }
                                    {/* <View style={{ position: 'absolute', bottom: 15, right: 30, flexDirection: 'row' }}>
                                        {this.state.POSITION_PROVINCE_NAME == '' || this.state.POSITION_PROVINCE_NAME == undefined ? null :
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.state.POSITION_PROVINCE_NAME}</Text>
                                            </View>
                                        }
                                        {this.state.POSITION_CITY_NAME == '' || this.state.POSITION_CITY_NAME == undefined ? null :
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{this.state.POSITION_CITY_NAME}</Text>
                                            </View>
                                        }
                                        {this.state.POSITION_AREA_NAME == '' || this.state.POSITION_AREA_NAME == undefined ? null :
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{this.state.POSITION_AREA_NAME}</Text>
                                            </View>
                                        }</View> */}
                                    <View style={{ position: 'absolute', bottom: 15, right: 30, flexDirection: 'row' }}>
                                        {rowData.workStartTime == '' || rowData.workStartTime == undefined ? null :
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>开始日期：{this.timeChange(rowData.workStartTime)}</Text>
                                            </View>
                                        }
                                        {rowData.workEndTime == '' || rowData.workEndTime == undefined ? null :
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>结束日期：{this.timeChange(rowData.workEndTime)}</Text>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                        </View >
                        {this.props.rowData.JOB_DESCRIPTION == '' || this.props.rowData.JOB_DESCRIPTION == undefined ? null :
                            <View>
                                <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                    <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>职位描述</Text>
                                    <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                </View>
                                <View style={{ margin: 10 }}>
                                    <Text>{this.props.rowData.JOB_DESCRIPTION}</Text>
                                </View>
                            </View>}
                        <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                            <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>任职要求</Text>
                            <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Text>{this.state.result.servingRequire}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                            <VectorIcon name={"building"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>公司信息</Text>
                            <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                        </View>
                        <View style={{ margin: 10, flexDirection: 'row' }}>
                            <Image source={require('../image/company.png')} style={{ height: 70, width: 70 }}></Image>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize, marginLeft: 10, maxWidth: theme.screenWidth - 100 }}>{(this.state.RELEASE_COMPANY_NAME == undefined) ? "未知企业" : this.state.RELEASE_COMPANY_NAME}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>{num + type}</Text>
                                {this.state.jobDescription == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10, width: deviceWidth / 1.5 }}>{(this.state.jobDescription == undefined) ? '' : this.state.jobDescription}</Text>}
                            </View>
                        </View>

                    </ScrollView> :
                    this.props.rowData.WORK_MODE == '合伙人' ?
                        <ScrollView style={{ marginBottom: 80 }}>
                            <View>
                                <View style={{ backgroundColor: 'transparent' }}>
                                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, maxWidth: deviceWidth / 1.8 }}>{this.state.POSITION_NAME}</Text>
                                            {this.state.SALARY_RANGE == '' || this.state.SALARY_RANGE == undefined ? null :
                                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{(this.state.SALARY_RANGE == '面议' || this.state.SALARY_RANGE == '不限') ? this.state.SALARY_RANGE : this.state.SALARY_RANGE + "元/月"}</Text>
                                            }
                                            {this.state.HOUR_SALARY == '' || this.state.HOUR_SALARY == undefined ? null :
                                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{this.state.HOUR_SALARY} {this.state.WORK_MODE == '兼职' ? this.state.WORK_MODE == '合伙人' ? '元/月' : "元/小时" : this.state.HOUR_SALARY == '不限' ? "" : this.state.HOUR_SALARY == '面议' ? "" : '元/月'}</Text>
                                            }
                                            {this.state.SALARY == '' || this.state.SALARY == undefined ? null :
                                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{this.state.SALARY}元</Text>
                                            }
                                        </View>
                                        {this.state.LSYGWORK_END_TIME == '' || this.state.LSYGWORK_END_TIME == undefined ? null :
                                            <View style={{ position: 'absolute', bottom: 10, left: 10, }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4 }}>{this.timeChange(this.state.LSYGWORK_END_TIME)}前完成</Text>
                                            </View>
                                        }

                                        <View style={{ position: 'absolute', bottom: 10, right: 30, flexDirection: 'row' }}>
                                            {rowData.POSITION_PROVINCE_NAME == '' || undefined ? null :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                                </View>
                                            }
                                            {rowData.POSITION_CITY_NAME == '' || undefined ? null :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_CITY_NAME}</Text>
                                                </View>
                                            }
                                            {rowData.POSITION_AREA_NAME == '' || undefined ? null :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_AREA_NAME}</Text>
                                                </View>
                                            }</View>
                                    </View>
                                    {this.state.license == '' || this.state.license == undefined ? null :
                                        <View style={{ marginLeft: 20, marginBottom: 10 }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4 }}>{this.state.license == "1" ? "不需要电子营业执照" : "需要电子营业执照"}</Text>
                                        </View>
                                    }
                                </View>
                                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                            </View >
                            {this.state.LSYGJOB_DESCRIPTION == '' || this.state.LSYGJOB_DESCRIPTION == undefined ? null :
                                <View>
                                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                        <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>包需求</Text>
                                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                    </View>
                                    <View style={{ margin: 10 }}>
                                        <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.LSYGJOB_DESCRIPTION}</Text>
                                    </View>
                                </View>}
                            {this.state.LSYGSERVING_REQUIRE == '' || this.state.LSYGSERVING_REQUIRE == undefined ? null :
                                <View>
                                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                        <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>验收标准</Text>
                                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                    </View>
                                    <View style={{ margin: 10 }}>
                                        <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.LSYGSERVING_REQUIRE}</Text>
                                    </View>
                                </View>}
                            {this.state.LSYGremark2 == '' || this.state.LSYGremark2 == undefined ? null :
                                <View>
                                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                        <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>我需要</Text>
                                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                    </View>
                                    <View style={{ margin: 10 }}>
                                        <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.LSYGremark2}</Text>
                                    </View>
                                </View>}

                            {this.state.POSITION_PROVINCE_NAME == '' && this.state.POSITION_CITY_NAME == '' && this.state.POSITION_AREA_NAME == '' && this.state.address == '' ? null :
                                <View>
                                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                        <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>办公地址</Text>
                                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                    </View>
                                    <View style={{ margin: 10 }}>
                                        <Text>{this.state.POSITION_PROVINCE_NAME}{this.state.POSITION_CITY_NAME}{this.state.POSITION_AREA_NAME}{this.state.address}</Text>
                                    </View>
                                </View>}

                            {(this.state.dataSource.length == 0) ? null : <View>
                                <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                    <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>附件</Text>
                                    <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                </View>
                                <View style={{ margin: 10 }}>
                                    {this.renderListView()}
                                </View>
                            </View>}
                            <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                <VectorIcon name={"building"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>公司信息</Text>
                                <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                            </View>
                            <View style={{ margin: 10, flexDirection: 'row' }}>
                                <Image source={require('../image/company.png')} style={{ height: 70, width: 70 }}></Image>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize, marginLeft: 10, maxWidth: theme.screenWidth - 100 }}>{(this.props.rowData.COMPANY_NAME == undefined) ? "未知企业" : this.props.rowData.COMPANY_NAME}</Text>
                                    {/* {this.state.LSYGCOMPANY_KIND == '' || this.state.LSYGCOMPANY_KIND == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 10, marginTop: 10, maxWidth: theme.screenWidth - 100 }}>公司性质:{this.state.LSYGCOMPANY_KIND}</Text>
                                    } */}
                                    {this.state.LSYGareadetail == '' || this.state.LSYGareadetail == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 10, marginTop: 10, maxWidth: theme.screenWidth - 100 }}>公司地址:{this.state.LSYGareadetail}</Text>
                                    }
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>{num + type}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10, width: deviceWidth / 1.5 }}>{(this.props.rowData.PLACE == undefined) ? '' : this.props.rowData.PLACE + "  |  "}</Text>
                                </View>
                            </View>

                        </ScrollView>
                        :
                        ((this.props.rowData.workMode == 'LSYG' || this.props.rowData.workMode == 'CHYW') && this.props.rowData.type == 'MyApplicate') ?
                            <ScrollView style={{ marginBottom: 80 }}>
                                <View>
                                    <View style={{ backgroundColor: 'transparent' }}>
                                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, maxWidth: deviceWidth / 1.8 }}>{this.state.POSITION_NAME}</Text>
                                                {this.state.SALARY_RANGE == '' || this.state.SALARY_RANGE == undefined ? null :
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{(this.state.SALARY_RANGE == '面议' || this.state.SALARY_RANGE == '不限') ? this.state.SALARY_RANGE : this.state.SALARY_RANGE + "元/月"}</Text>
                                                }
                                                {this.state.HOUR_SALARY == '' || this.state.HOUR_SALARY == undefined ? null :
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{this.state.HOUR_SALARY} {this.state.WORK_MODE == '兼职' ? this.state.WORK_MODE == '合伙人' ? '元/月' : "元/小时" : this.state.HOUR_SALARY == '不限' ? "" : this.state.HOUR_SALARY == '面议' ? "" : '元/月'}</Text>
                                                }
                                            </View>
                                            {this.state.LSYGWORK_END_TIME == '' || this.state.LSYGWORK_END_TIME == undefined ? null :
                                                <View style={{ position: 'absolute', bottom: 10, left: 10, }}>
                                                    <Text style={{ fontSize: Config.MainFontSize - 4 }}>{this.timeChange(this.state.LSYGWORK_END_TIME)}前完成</Text>
                                                </View>
                                            }

                                            <View style={{ position: 'absolute', bottom: 10, right: 30, flexDirection: 'row' }}>
                                                {rowData.POSITION_PROVINCE_NAME == '' || undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                                    </View>
                                                }
                                                {rowData.POSITION_CITY_NAME == '' || undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_CITY_NAME}</Text>
                                                    </View>
                                                }
                                                {rowData.POSITION_AREA_NAME == '' || undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_AREA_NAME}</Text>
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                                </View >
                                {this.state.LSYGJOB_DESCRIPTION == '' || this.state.LSYGJOB_DESCRIPTION == undefined ? null :
                                    <View>
                                        <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                            <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>包需求</Text>
                                            <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                        </View>
                                        <View style={{ margin: 10 }}>
                                            <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.LSYGJOB_DESCRIPTION}</Text>
                                        </View>
                                    </View>}
                                {this.state.LSYGSERVING_REQUIRE == '' || this.state.LSYGSERVING_REQUIRE == undefined ? null :
                                    <View>
                                        <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                            <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>验收标准</Text>
                                            <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                        </View>
                                        <View style={{ margin: 10 }}>
                                            <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.LSYGSERVING_REQUIRE}</Text>
                                        </View>
                                    </View>}
                                {this.state.LSYGremark2 == '' || this.state.LSYGremark2 == undefined ? null :
                                    <View>
                                        <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                            <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>我需要</Text>
                                            <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                        </View>
                                        <View style={{ margin: 10 }}>
                                            <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.LSYGremark2}</Text>
                                        </View>
                                    </View>}
                                <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                    <VectorIcon name={"building"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>公司信息</Text>
                                    <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                </View>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <Image source={require('../image/company.png')} style={{ height: 70, width: 70 }}></Image>
                                    <View>
                                        <Text style={{ fontSize: Config.MainFontSize, marginLeft: 10, maxWidth: theme.screenWidth - 100 }}>{(this.state.LSYGCOMPANY_NAME == undefined) ? "未知企业" : this.state.LSYGCOMPANY_NAME}</Text>
                                        {/* {this.state.LSYGCOMPANY_KIND == '' || this.state.LSYGCOMPANY_KIND == undefined ? null :
                                            <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 10, marginTop: 10, maxWidth: theme.screenWidth - 100 }}>公司性质:{this.state.LSYGCOMPANY_KIND}</Text>
                                        } */}

                                        {this.state.LSYGareadetail == '' || this.state.LSYGareadetail == undefined ? null :
                                            <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 10, marginTop: 10, maxWidth: theme.screenWidth - 100 }}>公司地址:{this.state.LSYGareadetail}</Text>
                                        }
                                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>{num + type}</Text>
                                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10, width: deviceWidth / 1.5 }}>{(this.props.rowData.PLACE == undefined) ? '' : this.props.rowData.PLACE}</Text>
                                    </View>
                                </View>

                            </ScrollView>
                            :
                            <ScrollView style={{ marginBottom: 80 }}>
                                <View>
                                    <View style={{ backgroundColor: 'transparent' }}>
                                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, maxWidth: deviceWidth / 1.8 }}>{rowData.POSITION_NAME}</Text>
                                                {rowData.SALARY_RANGE == '' || rowData.SALARY_RANGE == undefined ? null :
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{(rowData.SALARY_RANGE == '面议' || rowData.SALARY_RANGE == '不限') ? rowData.SALARY_RANGE : rowData.SALARY_RANGE + "元/月"}</Text>
                                                }
                                                {rowData.HOUR_SALARY == '' || rowData.HOUR_SALARY == undefined ? null :
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{rowData.HOUR_SALARY}{rowData.WORK_MODE == '兼职' ? this.state.WORK_MODE == '合伙人' ? '元/月' : "元/小时" : rowData.HOUR_SALARY == '不限' ? "" : rowData.HOUR_SALARY == '面议' ? "" : '元/月'}</Text>
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                                                {rowData.AGE_REQUIRE == '' || rowData.AGE_REQUIRE == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.AGE_REQUIRE}</Text>
                                                    </View>
                                                }
                                                {rowData.EDUCATION_REQUIRE == '' || rowData.EDUCATION_REQUIRE == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{rowData.EDUCATION_REQUIRE}</Text>
                                                    </View>
                                                }
                                                {rowData.WORK_MODE == '' || rowData.WORK_MODE == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData.WORK_MODE}</Text>
                                                    </View>
                                                }
                                                {rowData.WORK_YEARS == '' || rowData.WORK_YEARS == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.WORK_YEARS}</Text>
                                                    </View>
                                                }
                                            </View>
                                            {/* {this.state.SALARY_RANGE == '' || this.state.SALARY_RANGE == undefined ? null :
                                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5, top: 20 }}>{(this.state.SALARY_RANGE == '面议' || this.state.SALARY_RANGE == '不限') ? this.state.SALARY_RANGE : this.state.SALARY_RANGE + "元/月"}</Text>
                                            }
                                            {this.state.HOUR_SALARY == '' || this.state.HOUR_SALARY == undefined ? null :
                                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5, top: 20 }}>{this.state.HOUR_SALARY} {this.state.WORK_MODE == '非全日制' ? this.state.WORK_MODE == '临时承揽' ? '元/月' : "元/小时" : this.state.HOUR_SALARY == '不限' ? "" : this.state.HOUR_SALARY == '面议' ? "" : '元/月'}</Text>
                                            } */}
                                            <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>

                                                {this.state.POSITION_KIND == '' || this.state.POSITION_KIND == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{this.state.POSITION_KIND}</Text>
                                                    </View>
                                                }

                                                {this.state.RECRUIT_NUMBER == '' || this.state.RECRUIT_NUMBER == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>招聘人数:{this.state.RECRUIT_NUMBER}人</Text>
                                                    </View>
                                                }
                                                {this.state.WORK_DAY == '' || this.state.WORK_DAY == undefined ? null :
                                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>工时:{this.state.WORK_DAY}小时/天</Text>
                                                    </View>
                                                }
                                            </View>

                                            {/* <View style={{ position: 'absolute', bottom: 15, right: 30, flexDirection: 'row' }}>
                                                {this.state.POSITION_PROVINCE_NAME == '' || this.state.POSITION_PROVINCE_NAME == undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.state.POSITION_PROVINCE_NAME}</Text>
                                                    </View>
                                                }
                                                {this.state.POSITION_CITY_NAME == '' || this.state.POSITION_CITY_NAME == undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{this.state.POSITION_CITY_NAME}</Text>
                                                    </View>
                                                }
                                                {this.state.POSITION_AREA_NAME == '' || this.state.POSITION_AREA_NAME == undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{this.state.POSITION_AREA_NAME}</Text>
                                                    </View>
                                                }</View> */}
                                            {rowData.workStartTime == '' || rowData.workStartTime == undefined ? null :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>开始日期：{this.timeChange(rowData.workStartTime)}</Text>
                                                </View>
                                            }
                                            {rowData.workEndTime == '' || rowData.workEndTime == undefined ? null :
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>结束日期：{this.timeChange(rowData.workEndTime)}</Text>
                                                </View>
                                            }
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: deviceWidth - 30 }}>
                                                {rowData.ALL_ADRESS == '' || rowData.ALL_ADRESS == undefined ? null :
                                                    <View>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.ALL_ADRESS}</Text>
                                                    </View>
                                                }
                                                {this.state.CREATE_TIME == '' || this.state.CREATE_TIME == undefined ? null :
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{"发布日期 :" + this.timeChange(this.state.CREATE_TIME)}</Text>
                                                    </View>
                                                }
                                            </View>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>详细地址 ：{this.state.address}</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                                </View >
                                {this.props.rowData.JOB_DESCRIPTION == '' || this.props.rowData.JOB_DESCRIPTION == undefined ? null :
                                    <View>
                                        <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                            <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>职位描述</Text>
                                            <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                        </View>
                                        <View style={{ margin: 10 }}>
                                            <Text style={{ lineHeight: TEXTLINGHT }}>{this.props.rowData.JOB_DESCRIPTION}</Text>
                                        </View>
                                    </View>}
                                <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                    <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>任职要求</Text>
                                    <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                </View>
                                <View style={{ margin: 10 }}>
                                    <Text style={{ lineHeight: TEXTLINGHT }}>{this.state.result.servingRequire}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                    <VectorIcon name={"building"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>公司信息</Text>
                                    <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                                </View>
                                <View style={{ margin: 10, flexDirection: 'row' }}>
                                    <Image source={require('../image/company.png')} style={{ height: 70, width: 70 }}></Image>
                                    <View>
                                        <Text style={{ fontSize: Config.MainFontSize, marginLeft: 10, maxWidth: theme.screenWidth - 100 }}>{(this.props.rowData.COMPANY_NAME == undefined) ? "未知企业" : this.props.rowData.COMPANY_NAME}</Text>
                                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>{num + type}</Text>
                                        {this.props.rowData.PLACE == undefined ? null :
                                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10, width: deviceWidth / 1.5 }}>{(this.props.rowData.PLACE == undefined) ? '' : this.props.rowData.PLACE}</Text>}
                                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10, width: deviceWidth / 1.5 }}>{(this.state.jobDescription == undefined) ? '' : this.state.jobDescription}</Text>
                                    </View>
                                </View>

                            </ScrollView>


                }
                {this.props.rowData.WORK_MODE == '合伙人' || this.props.rowData.WORK_MODE == '撮合' ?
                    <TabNavigator
                        hidesTabTouch={true}
                        tabBarStyle={styles.tabbar}
                        sceneStyle={{ paddingBottom: styles.tabbar.height }}>
                        <TabNavigator.Item
                            tabStyle={{
                                paddingTop: 26,
                                width: deviceWidth - 20,
                                alignSelf: 'center',
                                backgroundColor: (this.state.toudi == false && this.props.rowData.status == false) ? 'rgb(65,143,234)' : 'grey'
                            }}
                            selected={this.state.selectedTab === 'contacts'}
                            selectedTitleStyle={{ color: 'rgb(22,131,251)' }}
                            titleStyle={styles.titleStyle}
                            title={this.state.toudi == false && this.props.rowData.status == false ? '申请接包' : '已申请'}
                            onPress={this.submit1.bind(this)}
                        >
                        </TabNavigator.Item>
                    </TabNavigator> : <TabNavigator
                        hidesTabTouch={true}
                        tabBarStyle={styles.tabbar}
                        sceneStyle={{ paddingBottom: styles.tabbar.height }}>
                        <TabNavigator.Item
                            tabStyle={{
                                paddingTop: 26,
                                width: deviceWidth - 20,
                                alignSelf: 'center',
                                backgroundColor: (this.state.toudi == false && this.props.rowData.status == false) ? 'rgb(65,143,234)' : 'grey'
                            }}
                            selected={this.state.selectedTab === 'contacts'}
                            selectedTitleStyle={{ color: 'rgb(22,131,251)' }}
                            titleStyle={styles.titleStyle}
                            title={this.state.toudi == false && this.props.rowData.status == false ? '投递简历' : '已投递'}
                            onPress={this.submit.bind(this)}
                        >
                        </TabNavigator.Item>
                    </TabNavigator>}
                {this.zerenModal()}
            </View>
        );
    }
    onPressAgreement1() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement10.html', title: '“工薪易”平台接包须知', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement2() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement8.html', title: '“工薪易”平台服务发布规范', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement3() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement11.html', title: '“工薪易”平台共享经济（自由职业者服务）协议', popCallback: this.handlePop.bind(this) })
    }
    handlePop() {
        this.setState({ modalVisible: true })
    }
    onRequestClose() {
        //安卓必须写的
        this.setState({
            isModal: false
        });
    }
    zerenModal() {
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.onRequestClose() }}
                >
                    <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.5 }}>
                    </TouchableOpacity>
                    <View style={{ alignSelf: 'center', height: (Platform.OS == 'ios') ? deviceHeight / 1.5 : deviceHeight / 1.4, width: deviceWidth - 40, marginTop: 40, backgroundColor: 'white', position: 'absolute' }}>
                        <ImageBackground source={require('../image/mianze.png')} style={{ width: deviceWidth - 40, height: 160, alignSelf: 'center' }}>
                            <Text style={{ color: 'white', position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>工薪易平台接包须知</Text>
                            <VectorIcon name={'security'} style={{ color: 'white', fontSize: 80, position: 'absolute', marginTop: 50, alignSelf: 'center', backgroundColor: 'transparent' }} />
                        </ImageBackground>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement1()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台接包须知》</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement2()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台服务发布规范》</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement3()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台共享经济（自由职业者服务）协议》</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ read: !this.state.read })} style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', position: 'absolute', bottom: 60, left: 60 }} >
                            <Text style={{ color: 'grey', fontSize: Config.MainFontSize }}>您已经阅读并同意</Text><View ><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize }}>以上须知</Text></View>
                            <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.read == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize, marginTop: 3 }} />
                        </TouchableOpacity>
                        {this.state.read == true ?
                            <TouchableOpacity style={{ width: deviceWidth / 2 - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', position: 'absolute', bottom: 10, right: 20, borderRadius: 5 }} onPress={() => this.makesure()}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>同意接包</Text></TouchableOpacity> :
                            <View style={{ width: deviceWidth / 2 - 80, height: 40, backgroundColor: 'grey', alignSelf: 'center', position: 'absolute', bottom: 10, right: 20, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>同意接包</Text></View>
                        }
                        <TouchableOpacity style={{ width: deviceWidth / 2 - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', position: 'absolute', bottom: 10, left: 20, borderRadius: 5 }} onPress={this.Temporary.bind(this)}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>返回</Text></TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
    ifAgree() {
        this.setState({ read: !this.state.read })
    }
    Temporary() {
        Actions.pop()
        this.setState({
            modalVisible: false,
        })

    }
    submit() {
        if (this.state.toudi == true || this.props.rowData.status == true) {
            Alert.alert("提示", "已投递"
                , [
                    {
                        text: "好的", onPress: () => {
                        }
                    },])
        } else if (this.state.idcardUpdate == false) {
            Alert.alert("提示", "请先完善简历"
                , [
                    {
                        text: "再看看", onPress: () => {

                        }
                    }, {
                        text: "完善简历", onPress: () => {
                            Actions.IdCard({ update: true, userId: this.state.userId, telphone: this.state.telphone });
                        }
                    },
                ])
            return
        } else if (this.state.jianliUpdate == false) {
            Alert.alert("提示", "请先完善简历"
                , [
                    {
                        text: "再看看", onPress: () => {
                        }
                    }, {
                        text: "完善简历", onPress: () => {
                            Actions.Jianli({ update: true, userName: this.state.userName, passWord: this.state.passWord, login: 1, userId: this.state.userId, telphone: this.state.telphone, idNum: this.state.idNum, uuid: UUID.v4() })
                        }
                    },
                ])
            return
        } else {
            var entity = {
                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                positionId: this.state.result.id,
                createTime: (new Date()).getTime(),
            }
            Alert.alert("提示", "确定投递吗？"
                , [
                    {
                        text: "取消", onPress: () => {
                        }
                    },
                    {
                        text: "确定", onPress: () => {
                            Fetch.postJson(Config.mainUrl + '/delivery/savedelivery', entity)
                                .then((res) => {
                                    console.log(res)
                                    if (res.rcode == '1') {
                                        this.addApplyNumber();
                                        this.props.onblock();
                                        Toasts.show('投递成功', { position: px2dp(-80), duration: 1000 });
                                        this.setState({ toudi: true })
                                        Actions.pop({ refresh: { test: UUID.v4() } });
                                    } else {
                                        Toasts.show('投递失败，请重试', { position: px2dp(-80), duration: 1000 });
                                    }
                                })
                        }
                    }

                ])
        }

    }
    submit1() {
        let jiebaojine = 0
        if (this.state.SALARY !== '' || this.state.SALARY !== undefined) {
            jiebaojine = parseFloat(this.state.SALARY)
        }
        if (this.state.toudi == true || this.props.rowData.status == true) {
            Alert.alert("提示", "已申请"
                , [
                    {
                        text: "好的", onPress: () => {
                        }
                    },])
        } else if (this.state.idcardUpdate == false) {
            Alert.alert("提示", "请先完善简历"
                , [
                    {
                        text: "再看看", onPress: () => {

                        }
                    }, {
                        text: "完善简历", onPress: () => {
                            Actions.IdCard({ update: true, userId: this.state.userId, telphone: this.state.telphone });
                        }
                    },
                ])
            return
        } else if (this.state.jianliUpdate == false) {
            Alert.alert("提示", "请先完善简历"
                , [
                    {
                        text: "再看看", onPress: () => {
                        }
                    }, {
                        text: "完善简历", onPress: () => {
                            Actions.Jianli({ update: true, userName: this.state.userName, passWord: this.state.passWord, login: 1, userId: this.state.userId, telphone: this.state.telphone, idNum: this.state.idNum, uuid: UUID.v4() })
                        }
                    },
                ])
            return
        } else if (this.state.checkStatu !== '3' && this.props.rowData.WORK_MODE == '合伙人' && this.props.rowData.license == '0') {
            Alert.alert("提示", "请先注册个人电子营业执照"
                , [
                    {
                        text: "再看看", onPress: () => {
                        }
                    }, {
                        text: "去注册", onPress: () => {
                            Actions.PersonalAudit()
                        }
                    },
                ])
            return
        }
        // else if (jiebaojine >= 100000 && this.state.checkStatu !== '3') {//接包金额大于10w提醒
        //     Alert.alert("提示", "接包金额达到10万元需注册营业执照才能接包"
        //         , [
        //             {
        //                 text: "继续申请", onPress: () => {
        //                     this.setState({ modalVisible: true })
        //                 }
        //             }, {
        //                 text: "去注册", onPress: () => {
        //                     Actions.PersonalAudit()
        //                 }
        //             },
        //         ])
        // }
        else {
            this.setState({ modalVisible: true })
        }

    }
    makesure() {
        this.setState({ read: true })
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            positionId: this.state.LSYGid,
            createTime: (new Date()).getTime(),
        }
        Fetch.postJson(Config.mainUrl + '/delivery/savedelivery', entity)
            .then((res) => {
                console.log(res)
                if (res.rcode == '1') {
                    this.setState({
                        modalVisible: false
                    })
                    this.addApplyNumber1();
                    this.props.onblock();
                    Toasts.show('申请成功', { position: px2dp(-80), duration: 1000 });
                    this.setState({ toudi: true })
                    Actions.pop({ refresh: { test: UUID.v4() } });
                } else {
                    Toasts.show('申请失败，请重试', { position: px2dp(-80), duration: 1000 });
                }
            })
    }
    daohang(place) {
        if (Platform.OS == 'ios') {
            var url = 'baidumap://map/direction?origin=' + this.state.latitude + ',' + this.state.longitude + '&destination=' + place + '&mode=driving&src=webapp.navi.yourCompanyName.yourAppName';
            Linking.openURL(url)
                .catch(error => {
                    Toasts.show('请安装最新百度地图APP！', { position: px2dp(-30) });
                });
        } else {
            //baidumap://map/direction?region=beijing&origin=39.98871,116.43234&destination=name:西直门&mode=driving
            var url = 'baidumap://map/direction?region=' + this.state.latitude + ',' + this.state.longitude + '&destination=' + place + '&mode=driving&src=webapp.navi.yourCompanyName.yourAppName';
            Linking.openURL(url)
                .catch(error => {
                    Toasts.show('请安装最新百度地图APP！', { position: px2dp(-30) });
                });
        }
    }
    //增加投递人数
    addApplyNumber() {
        Fetch.postJson(Config.mainUrl + '/positionManagement/addApplyNumber', (this.state.result.id))
            .then((res) => {
                console.log(res)
            })
    }
    //增加临时承揽投递人数
    addApplyNumber1() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            positionId: this.props.rowData.ID,
            positionName: this.props.rowData.POSITION_NAME,
            creatorId: this.props.rowData.CREATOR_ID,
        }
        Fetch.postJson(Config.mainUrl + '/temporaryWork/addApplyNumberLSCL', entity)
            .then((res) => {
                console.log(res)
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
    _getGps() {
        C2AmapApi.getCurrentLocation()
            .then((result) => {
                this.setState({
                    city: result.info.city,
                    formattedAddress: result.info.formattedAddress,
                    AOIName: result.info.AOIName,
                    latitude: result.coordinate.latitude,//纬度
                    longitude: result.coordinate.longitude,//经度
                })
            })
            .catch(() => {

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
