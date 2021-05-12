/**
 * 临时承揽选人简历详情
 * Created by 曾一川 on 17/04/19.
 */
import React, { Component } from 'react';
import { Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Alert, Dimensions, Platform, ListView, TouchableOpacity, TextInput } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, UUID, Toast } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class ChooseResumeInform extends Component {
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
            hide: false,
            description: '',
            rowData1: [],
            rowData2: [],
            rowData: [],
        }
        this.getJobInform();
        this.getResume();
        this.onChange = value => {
            this.setState({ value });
        };
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    //获取职位列表
    getResume() {
        var entity = {
            userId: this.props.userId
        }
        Fetch.getJson(Config.mainUrl + '/basicResume/getPersonResume', entity)
            .then((res) => {
                console.log(res)
                this.setState({ rowData: res[0], rowData2: res[1] })
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
    render() {
        var rowData = this.state.rowData;
        let _maxLength = deviceHeight / 5;
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>简历详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>简历详情</Text>
                    </View>
                </View>
                <ScrollView style={{ marginBottom: 80 }} scrollIndicatorInsets={{ right: 1 }}>
                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"user"} size={24} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize, marginTop: 4 }}>个人信息</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <View style={{ marginTop: 10, marginLeft: 10, flexDirection: 'row' }}>
                        {rowData.personName == '' || rowData.personName == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>姓名:{rowData.personName}</Text>
                            </View>}
                        {rowData.sex == '' || rowData.sex == undefined ? null :
                            <View style={{ padding: 3, alignItems: 'center', marginRight: 20 }}>
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
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>身份证号码:{rowData.identifyNum}</Text>
                            </View>}
                    </View>
                    {/* {rowData.remark6 == '0' ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.phoneNumber == '' || rowData.phoneNumber == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData.phoneNumber.substring(0, 3) + '****' + rowData.phoneNumber.substring(7, 11)}</Text>
                                </TouchableOpacity>}
                        </View> :  */}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.phoneNumber == '' || rowData.phoneNumber == undefined ? null :
                            <TouchableOpacity onPress={() => this.onCall(rowData.phoneNumber)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>电话:{rowData.phoneNumber}</Text>
                            </TouchableOpacity>}
                    </View>
                    {/* } */}
                    {/* {rowData.remark6 == '0' ?
                        <View style={{ flexDirection: 'row' }}>
                            {rowData.email == '' || rowData.email == undefined ? null :
                                <TouchableOpacity style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                    <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>邮箱:{rowData.email.substring(0, 3) + '*****' + '@' + '*****'}</Text>
                                </TouchableOpacity>}
                        </View> :  */}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.email == '' || rowData.email == undefined ? null :
                            <TouchableOpacity onPress={() => this.onCall_Clipboard(rowData.email)} style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>邮箱:{rowData.email}</Text>
                            </TouchableOpacity>}
                    </View>
                    {/* } */}
                    <View style={{ flexDirection: 'row' }}>
                        {rowData.educateFrom == '' || rowData.educateFrom == undefined ? <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业学校:未填写</Text>
                        </View> :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>毕业学校:{rowData.educateFrom}</Text>
                            </View>}
                        {rowData.highestEducation == '' || rowData.highestEducation == undefined ?
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>学位:未填写</Text>
                            </View> :
                            <View style={{ padding: 3, marginTop: 10, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>学位:{rowData.highestEducation}</Text>
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
                        {rowData.partTime == '' || rowData.partTime == undefined ? null :
                            <View style={{ marginTop: 10, marginLeft: 10, padding: 3, alignItems: 'center', marginRight: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>兼职时间:{rowData.partTime == '1' ? '上午' : rowData.partTime == '2' ? '下午' : rowData.partTime == '3' ? '晚上' : rowData.partTime == '1,2' ? '上午  下午' : rowData.partTime == '1,3' ? '上午  晚上' : rowData.partTime == '2,3' ? '下午  晚上' : '任意时间'}</Text>
                            </View>
                        }
                    </View>
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' ?
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

                </ScrollView>


            </View>
        );
    }
    _renderItem(rowData) {
        return (
            <View>
                <View style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 3 * 2 }}>公司名称:{rowData.companyName}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>岗位:{rowData.position}</Text>
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
