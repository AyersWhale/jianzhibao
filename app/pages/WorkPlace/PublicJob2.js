/**
 * 发包审核详情
 * 曾一川
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { FileManager, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
import { Checkbox, List, Picker } from 'antd-mobile-rn';
import DatePicker from 'react-native-datepicker';
import ListViewChooseContainer from '../../utils/ListViewChooseContainer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const CheckboxItem = Checkbox.CheckboxItem;
import Toasts from 'react-native-root-toast';
import underLiner from '../../utils/underLiner';

var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
import EncryptionUtils from '../../utils/EncryptionUtils';
import PcInterface from '../../utils/http/PcInterface';
export default class PublicJob extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: [],
            value: '',
            rejectReason: '',
            advancePayment: '1',
            modalVisible: false,
            M: (this.props.rowData.positionKind == '0') ? true : false,
            W: (this.props.rowData.positionKind == '0') ? false : true,
            Y: (this.props.rowData.stagrSettlement == '0') ? true : false,
            N: (this.props.rowData.stagrSettlement == '0') ? false : true,
            ShowYfk: (this.props.rowData.advancePayment == '0') ? true : false,
            ShowNyfk: (this.props.rowData.advancePayment == '0') ? false : true,
            visibleReferees: false,
            visibleReferees1: false,
            diqu: this.props.rowData.positionProvinceName + this.props.rowData.positionCityName + this.props.rowData.positionAreaName,
            positionName: this.props.rowData.positionName,//发包名称
            positionKind: this.props.rowData.positionKind,//发包规模 多包是1，单包是0
            salary: this.props.rowData.salary,//金额
            stagrSettlement: this.props.rowData.stagrSettlement,// 是否阶段性结算
            workEndTime: this.timeChange(this.props.rowData.workEndTime),// 用工结束时间
            positionProvinceName: this.props.rowData.positionProvinceName,// 所在省
            positionCityName: this.props.rowData.positionCityName,// 所在市
            positionAreaName: this.props.rowData.positionAreaName, //所在区
            positionProvince: this.props.rowData.positionProvinceName,// 所在省
            positionCity: this.props.rowData.positionCity,// 所在市
            positionArea: this.props.rowData.positionArea, //所在区
            remark2: this.props.rowData.remark2,//发包内容
            jobDescription: this.props.rowData.jobDescription,//发包需求
            servingRequire: this.props.rowData.servingRequire,//验收标准
            remark: this.props.rowData.remark,//备注
            data_education: [],//发包标签
            value_education: this.props.rowData.remark3,
            ratio: this.props.rowData.ratio,
            address: this.props.rowData.address,
            dictdataValue: '',
            dictdataName: this.props.rowData.remark3,
            settlement: this.props.rowData.remark4,
            electronicBusinessLicense: this.props.rowData.electronicBusinessLicense,
            Fwf: this.props.rowData.serviceMoneyBl ? this.props.rowData.serviceMoneyBl : 0
        };
        this.refresh()
        // this.getFwf()
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=个人临时承揽标签', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                var xlList = JSON.parse(json).result;
                for (let i in xlList) {
                    if (xlList[i].dictdataValue != '不限') {
                        if (xlList[i].dictdataName == this.state.dictdataName) {
                            this.setState({
                                dictdataValue: xlList[i].dictdataValue
                            })
                        }
                    }

                }

            }
            )
    }
    // getFwf() {
    //     var entity = {
    //         userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
    //     }
    //     Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
    //         .then((res) => {
    //             console.log(res)
    //             this.setState({
    //                 Fwf: res.serviceMoneyLscl
    //             })
    //         })
    // }
    refresh() {
        let docParams = {
            params: {
                businessKey: this.props.rowData.id,
            }
        }
        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            //debugger
            th.setState({
                dataSource: entry,
            });
        });
    }
    choose1(rowDate) {
        this.setState({
            dictdataName: rowDate.dictdataName,
            dictdataValue: rowDate.value,
        })
    }

    pres1() {
        this.setState({
            M: true,
            W: false,
        })
    }
    pres2() {
        this.setState({
            M: false,
            W: true
        })
    }
    onEbl() {
        if (this.state.electronicBusinessLicense == "1") {
            this.setState({ electronicBusinessLicense: "0" })
        } else {
            this.setState({ electronicBusinessLicense: "1" })
        }
    }
    onyfk(value) {
        // if (this.state.advancePayment == "1") {
        //     this.setState({ advancePayment: "0" })
        // } else {
        //     this.setState({ advancePayment: "1" })
        // }
        this.setState({ advancePayment: value })
    }
    onSettlement() {
        if (this.state.settlement == "1") {
            this.setState({ settlement: "0" })
            Alert.alert('您已勾选“通过平台结算”', '由平台完成相应代扣代缴义务，并收取相应服务费', [{ text: '确定' }])
        } else {
            this.setState({ settlement: "1" })
            Alert.alert('您已勾选“不通过平台结算”', '平台不承担相应代扣代缴义务，合同双方自行处理结算个税申报、票据等相关事宜', [{ text: '确定' }])
        }
    }
    pres3() {
        this.setState({
            Y: true,
            N: false,
        })
    }
    pres4() {
        this.setState({
            Y: false,
            N: true
        })
    }
    _back() {
        Actions.pop();
    }
    toTimeStamp(time) {
        // 将指定日期转换为时间戳。
        var t = time;  // 月、日、时、分、秒如果不满两位数可不带0.
        var T = new Date(t);  // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
        return T.getTime()  // 将转换后的标准日期转换为时间戳。

    }
    pres1() {
        this.setState({
            M: true,
            W: false,
        })
    }
    Fbje(text) {
        var rule = /(^(((?!0+$)(?!0*\.0*$)\d{1,7}(\.\d{1,2})?)|10000000|10000000.0|10000000.00)$)/
        if (rule.test(this.state.salary) == false) {
            Toast.showInfo('请填写正确的发包金额', 1000);
            this.setState({
                salary: ''
            })
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }} >
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>发包内容</Text>
                    </View>
                </ImageBackground>

                <ScrollView onPress={() => { Keyboard.dismiss() }} scrollIndicatorInsets={{ right: 1 }}>
                    <View style={{
                        marginTop: 8, marginLeft: 8, width: deviceWidth - 18, backgroundColor: '#fff',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.8,
                        shadowRadius: 5,
                        shadowColor: '#b3b4b7',
                        elevation: 2,
                    }}>
                        <View>
                            <View style={{ flexDirection: 'column' }}>
                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包名称</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.positionName}
                                            placeholder='请输入发包名称'
                                            onChangeText={(text) => { this.setState({ positionName: text }) }}
                                        />
                                    </View> :
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包名称</Text>
                                        </View>
                                        <Text
                                            style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 4, }}
                                        >
                                            {this.state.positionName}
                                        </Text>
                                    </View>}

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包规模</Text>
                                        <View style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                            {this.state.M == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>单包</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                            {this.state.W == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>多包</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包金额(不含税)</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.salary}
                                            onBlur={(text) => { this.Fbje(text) }}
                                            placeholder='请输入发包金额'
                                            onChangeText={(text) => { this.setState({ salary: text }) }}
                                        />
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>元</Text>
                                    </View> : <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包金额(不含税)</Text>
                                        </View>
                                        <Text
                                            style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right' }}

                                        >{this.state.salary}</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>元</Text>
                                    </View>}

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>服务费比例</Text>
                                    </View>
                                    <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}>{this.state.Fwf + '%'}</Text>
                                </View>

                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>综合税费比例</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.ratio}
                                            placeholder='请输入综合税费比例'
                                            onChangeText={(text) => { this.setState({ ratio: text }) }}
                                        />
                                    </View> :
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>综合税费比例</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            value={this.state.ratio}
                                            editable={false}
                                            placeholder='请输入综合税费比例'
                                            onChangeText={(text) => { this.setState({ ratio: text }) }}
                                        />
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>%</Text>
                                    </View>}
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>总计金额</Text>
                                    </View>
                                    <View style={{ flex: 1, marginRight: 4, position: 'absolute', right: 14 }} >
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}>{(this.state.salary == '' || this.state.ratio == '') ? null : ((parseFloat(this.state.salary) * parseFloat(this.state.ratio) / 100) + parseFloat(this.state.salary) + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2)}</Text>

                                    </View>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, position: 'absolute', right: 4 }}>元</Text>
                                </View>
                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包标签</Text>
                                        </View>
                                        <TouchableOpacity style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => this.setState({ visibleReferees1: true })}>
                                            <Text style={{ color: (this.state.dictdataValue == '点我选择发包标签') ? '#c4c4c4' : '#000' }}>{this.state.dictdataValue}</Text>
                                        </TouchableOpacity>
                                    </View> : <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包标签</Text>
                                        </View>
                                        <View style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }}>
                                            <Text style={{ color: (this.state.dictdataValue == '点我选择发包标签') ? '#c4c4c4' : '#000' }}>{this.state.dictdataValue}</Text>
                                        </View>
                                    </View>}

                                {/* <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>结算方式</Text>
                                    </View>
                                </View>

                                <View style={styles.first}>+
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 150 }}>
                                        {this.state.settlement == "1" ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>通过平台结算</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
                                        {this.state.settlement == "0" ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>不通过平台结算</Text>
                                        </View>
                                    </View>
                                </View> */}

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>需要电子营业执照</Text>
                                        <View style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                            {this.state.electronicBusinessLicense == "0" ? <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                            {this.state.electronicBusinessLicense == "1" ? <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>阶段性结算</Text>
                                            <TouchableOpacity style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                                {this.state.Y == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                                {this.state.N == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    </View> :
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>阶段性结算</Text>
                                            <View style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                                {this.state.Y == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                                {this.state.N == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                                </View>
                                            </View>
                                        </View>

                                    </View>}
                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>用工结束时间</Text>
                                        </View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <DatePicker
                                                date={this.state.workEndTime}
                                                mode="date"
                                                placeholder={"选择时间"}
                                                placeholderColor='red'
                                                format="YYYY-MM-DD"
                                                minDate={new Date()}
                                                showIcon={false}
                                                customStyles={{
                                                    dateInput: {
                                                        borderColor: '#fff',
                                                        backgroundColor: '#fff', marginLeft: 50
                                                    }
                                                }}
                                                minuteInterval={10}
                                                onDateChange={(workEndTime) => { this.setState({ workEndTime: workEndTime }); }}
                                            />
                                        </View>
                                    </View> : <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>用工结束时间</Text>
                                        </View>
                                        <Text
                                            style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 4, }}

                                        >{this.state.workEndTime}</Text>
                                    </View>}
                                {this.props.rowDatas == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>工作地区</Text>
                                        </View>
                                        <TouchableOpacity style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => this.setState({ visibleReferees: true })}>
                                            <Text style={{ color: (this.state.diqu == '点我选择地区') ? '#c4c4c4' : '#000' }}>{this.state.diqu}</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>工作地区</Text>
                                        </View>
                                        <View style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }}>
                                            <Text style={{ color: (this.state.diqu == '点我选择地区') ? '#c4c4c4' : '#000' }}>{this.state.diqu}</Text>
                                        </View>
                                    </View>}
                                <View style={{
                                    flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10,
                                    width: Dimensions.get('window').width - 40,
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: 1,
                                    marginTop: 8,
                                    marginLeft: 8
                                }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize, marginLeft: 5 }}>*</Text>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>详细地址</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', height: deviceHeight / 6, marginRight: 4 }}>
                                        <TextInput
                                            style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, }}
                                            placeholderTextColor={'#808080'}
                                            value={this.state.address}
                                            multiline={true}
                                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                            placeholder='请填写详细地址'
                                            placeholderTextColor="#c4c4c4"
                                            numberOfLines={20}
                                            editable={this.props.rowDatas == '3' ? true : false}
                                            onChangeText={(text) => { this.setState({ address: text }) }}
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10,
                                    width: Dimensions.get('window').width - 40,
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: 1,
                                    marginTop: 8,
                                    marginLeft: 8
                                }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize, marginLeft: 5 }}>*</Text>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包内容</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', height: deviceHeight / 6, marginRight: 4 }}>
                                        <TextInput
                                            style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, }}
                                            placeholderTextColor={'#808080'}
                                            value={this.state.remark2}
                                            multiline={true}
                                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                            placeholder='请填写发包内容'
                                            placeholderTextColor="#c4c4c4"
                                            editable={this.props.rowDatas == '3' ? true : false}
                                            numberOfLines={20}
                                            onChangeText={(text) => { this.setState({ remark2: text }) }}
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10,
                                    width: Dimensions.get('window').width - 40,
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: 1,
                                    marginTop: 8,
                                    marginLeft: 8
                                }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize, marginLeft: 5 }}>*</Text>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包需求</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', height: deviceHeight / 6, marginRight: 4 }}>
                                        <TextInput
                                            style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, }}
                                            placeholderTextColor={'#808080'}
                                            value={this.state.jobDescription}
                                            multiline={true}
                                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                            placeholder='请填写发包需求'
                                            placeholderTextColor="#c4c4c4"
                                            editable={this.props.rowDatas == '3' ? true : false}
                                            numberOfLines={20}
                                            onChangeText={(text) => { this.setState({ jobDescription: text }) }}
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10,
                                    width: Dimensions.get('window').width - 40,
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: 1,
                                    marginTop: 8,
                                    marginLeft: 8
                                }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize, marginLeft: 5 }}>*</Text>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>验收标准</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', height: deviceHeight / 6, marginRight: 4 }}>
                                        <TextInput
                                            style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, }}
                                            placeholderTextColor={'#808080'}
                                            value={this.state.servingRequire}
                                            multiline={true}
                                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                            placeholder='请填写验收标准'
                                            placeholderTextColor="#c4c4c4"
                                            editable={this.props.rowDatas == '3' ? true : false}
                                            numberOfLines={20}
                                            onChangeText={(text) => { this.setState({ servingRequire: text }) }}
                                        />
                                    </View>
                                </View>
                                <View style={{
                                    flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10,
                                    width: Dimensions.get('window').width - 40,
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: 1,
                                    marginTop: 8,
                                    marginLeft: 8
                                }}>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>备注</Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginRight: 4 }}>
                                        <TextInput
                                            style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, height: deviceHeight / 6 }}
                                            placeholderTextColor={'#808080'}
                                            value={(this.state.remark == undefined || this.state.remark == '') ? "无" : this.state.remark}
                                            multiline={true}
                                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                            placeholder='选填'
                                            placeholderTextColor="#c4c4c4"
                                            editable={this.props.rowDatas == '3' ? true : false}
                                            numberOfLines={20}
                                            onChangeText={(text) => { this.setState({ remark: text }) }}
                                        />
                                        {/* <Text style={{ textAlign: 'right', color: "#999" }}>{this.state.remark == undefined || this.state.reamrk == '' ? "无" : this.state.remark}</Text> */}
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex: 1, margin: 10,
                                width: Dimensions.get('window').width - 40,
                                borderBottomColor: '#e7e7e7',
                                borderBottomWidth: 1,
                                marginTop: 8,
                                marginLeft: 8, marginBottom: 8
                            }}>
                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>附件</Text>
                                {this.renderListView()}
                            </View>
                        </View>
                        <View style={{ width: deviceWidth - 18, height: 10, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                    </View>

                    {this.props.rowDatas == '3' ? <TouchableOpacity style={{ marginTop: 20 }} onPress={() => {
                        this.save()
                    }}>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: Dimensions.get('window').width / 1.4,
                            height: 44,
                            marginTop: 10,
                            borderRadius: 20,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: Config.MainFontSize,
                                color: '#ffffff'
                            }}>重新提交审核</Text>
                        </View>
                    </TouchableOpacity> : null}
                    {this.props.rowData.positionKind == '0' && (this.props.selectNum == "0") ?
                        <View style={{
                            marginBottom: 30,
                            flexDirection: 'row',
                            backgroundColor: "#fff",
                            height: 44,
                            alignItems: 'center',
                            width: Dimensions.get('window').width - 20,
                            borderBottomColor: '#e7e7e7',
                            borderBottomWidth: 1,
                            marginTop: 8,
                            marginLeft: 8
                        }}>
                            <View style={{ width: 5 }} />
                            <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>是否预付款</Text>
                                <TouchableOpacity onPress={this.onyfk.bind(this, 0)} style={{ flexDirection: 'row', position: 'absolute', right: 90 }}>
                                    {this.state.advancePayment == "0" ? <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                        <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                    <View>
                                        <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.onyfk.bind(this, 1)} style={{ flexDirection: 'row', position: 'absolute', right: 30 }}>
                                    {this.state.advancePayment == "1" ? <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                        <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                    <View>
                                        <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        <View>
                            {this.props.rowData.positionKind == '0' ? <View style={{
                                marginBottom: 30,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 44,
                                alignItems: 'center',
                                width: Dimensions.get('window').width - 20,
                                borderBottomColor: '#e7e7e7',
                                borderBottomWidth: 1,
                                marginTop: 8,
                                marginLeft: 8
                            }}>
                                <View style={{ width: 5 }} />
                                <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>是否预付款</Text>
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 90 }}>
                                        {this.state.ShowYfk == true ? <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 30 }}>
                                        {this.state.ShowNyfk == true ? <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                        </View>
                                    </View>
                                </View>
                            </View> : null}
                        </View>
                    }
                    {(this.props.selectNum == "1") ? null : <View style={{ display: "flex", flexDirection: "row", alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 88 }}>
                        <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginRight: 30 }} onPress={() => this.isReject()}>
                            <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth / 3, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.isMakeSure(1)}>
                            <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>通过</Text>
                        </TouchableOpacity>
                    </View>}
                    <ListViewChooseContainer
                        visible={this.state.visibleReferees1}
                        top={deviceHeight / 3}//这个用来控制与顶部距离
                        theme={'year'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                        onCancel={() => { this.setState({ visibleReferees1: false }); return null; }}
                        callbackData={(data) => this.choose1(data)} />
                    <ListViewChooseContainer
                        visible={this.state.visibleReferees}
                        top={deviceHeight / 5}//这个用来控制与顶部距离
                        theme={'diqu'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                        onCancel={() => { this.setState({ visibleReferees: false }); return null; }}
                        callbackData={(data) => this.choose(data)} />
                </ScrollView>
                {this.bohuiModal()}
            </View >
        );
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
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.reject.bind(this)}>
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
    isReject() {
        Fetch.getJson(Config.mainUrl + '/temporaryWork/' + this.props.rowData.id)
            .then((ret) => {
                console.warn('数据状态为:' + ret.checkStatus)
                if (ret.checkStatus != '1') {
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
    isMakeSure(value) {//修改: status   审核通过2   驳回3 （必填）
        //debugger

        if (this.props.rowData.positionKind == '0' && this.state.advancePayment === '') {
            Toasts.show('请选择是否预付款', { position: -80 });
        } else {
            Fetch.getJson(Config.mainUrl + '/temporaryWork/' + this.props.rowData.id)
                .then((ret) => {
                    console.warn('预付款状态为:' + this.state.advancePayment)
                    if (ret.checkStatus != '1') {
                        Alert.alert('提示', '此条数据已被其他用户处理,请返回列表刷新获取最新内容', [{
                            text: '确定', onPress: () => { Actions.pop() }
                        },])
                    } else {
                        Alert.alert('提示', '您确认提交吗？', [{
                            text: '再看看', onPress: () => { }
                        }, {
                            text: '继续', onPress: () => {

                                var entity = {
                                    status: "2",
                                    reason: '',
                                    advancePayment: this.state.advancePayment,//是否预付款
                                    id: this.props.rowData.id,
                                    //  userId: this.props.rowData.userId
                                    userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                                }
                                var entity1 = {
                                    positionName: this.state.positionName,
                                    label: this.state.dictdataValue
                                }
                                Fetch.postJson(Config.mainUrl + '/temporaryWork/auditTemporaryMobiel', entity)
                                    .then((res) => {
                                        this.setState({ modalVisible: false })
                                        Fetch.postJson(Config.mainUrl + '/temporaryWork/pushJobInfo', entity1)
                                            .then((res) => {
                                            })
                                        Toasts.show('提交成功', { position: -80 });
                                        this.props.onblock()
                                        Actions.pop()
                                    }).catch((res1) => {
                                        Toasts.show(res1.description, { position: -60 });
                                    })
                            }
                        }])
                    }
                })
        }
    }
    renderListView() {
        var data = this.state.dataSource;
        var temp = [];
        if (data.length == 0) {
            temp.push(
                <View style={{ marginTop: 20, }} >
                    <Text style={{ marginTop: 10, }}>{"无附件"}</Text>
                </View>
            )
        } else {
            for (let i in data) {
                temp.push(
                    <TouchableOpacity key={i} style={{ marginTop: 20, marginLeft: 20 }} onPress={this.downLoadFile.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + encodeURIComponent(data[i].filePath), data[i].fileName)}>
                        <Text style={{ color: 'rgb(65,143,234)' }}>{data[i].fileName}</Text>
                    </TouchableOpacity>
                )
            }
        }

        return temp

    }
    reject() {
        if (this.state.rejectReason == '') {
            Toasts.show('请填写驳回原因', { position: -80 });
            return
        } else {
            Alert.alert('确定要提交吗？', '', [{ text: '取消' }, {
                text: '确定', onPress: () => {
                    var entity = {
                        status: "3",
                        reason: this.state.rejectReason,
                        advancePayment: this.state.advancePayment,//是否预付款
                        id: this.props.rowData.id,
                        //userId: this.props.rowData.userId
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                    }
                    Fetch.postJson(Config.mainUrl + '/temporaryWork/auditTemporaryMobiel', entity)
                        .then((res) => {
                            if (res.status == '200') {
                                this.setState({ modalVisible: false })
                                Toasts.show('驳回成功', { position: -80 });
                                this.props.onblock()
                                Actions.pop({ refresh: { test: UUID.v4() } })
                            }
                            else {
                                Toasts.show('驳回失败', { position: -80 });
                            }
                        }).catch((res1) => {
                            Toasts.show(res1.description, { position: -60 });
                        })
                }
            }])

        }
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
    save() {
        var reg = /^\d+(\.\d{0, 2})?$/;
        if (this.state.positionName == '') {
            Toast.showInfo('请填写发包名称', 1000);
            return
        } else if (this.state.M == false && this.state.W == false) {
            Toast.showInfo('请选择发包规模', 1000);
            return
        }
        else if (this.state.salary == '') {
            Toast.showInfo('请填写发包金额', 1000);
            return
        }
        else if (this.state.workEndTime == '') {
            Toast.showInfo('请选择用工结束时间', 1000);
            return
        }
        else if (this.state.diqu == '选择地区') {
            Toast.showInfo('请选择工作地区', 1000);
            return
        }
        else if (this.state.ratio == '') {
            Toast.showInfo('请输入综合税费比例', 1000);
            return
        }
        // else if (reg.test(this.state.ratio) == false) {
        //     Toast.showInfo('综合税费比例只允许小数点后两位', 1000);
        //     return
        // }
        else if (this.state.address == '') {
            Toast.showInfo('请填写详细地址', 1000);
            return
        }
        else if (this.state.remark2 == '') {
            Toast.showInfo('请填写发包内容', 1000);
            return
        }
        else if (this.state.jobDescription == '') {
            Toast.showInfo('请填写发包需求', 1000);
            return
        }
        else if (this.state.dictdataValue == '选择发包标签') {
            Toast.showInfo('请选择发包标签', 1000)
            return;
        }
        else if (this.state.servingRequire == '') {
            Toast.showInfo('请填写验收标准', 1000);
            return
        }

        temp = {
            positionName: this.state.positionName,
            positionKind: this.state.M == true ? '0' : '1',
            salary: this.state.salary,
            stagrSettlement: this.state.Y == true ? '0' : '1',
            workEndTime: Date.parse(this.state.workEndTime),
            positionProvince: this.state.positionProvince,//地区
            positionCity: this.state.positionCity,//地区
            positionArea: this.state.positionArea,//地区
            positionProvinceName: this.state.positionProvinceName,//地区
            positionCityName: this.state.positionCityName,//地区
            positionAreaName: this.state.positionAreaName,//地区
            positionProvince: this.state.positionProvince,//地区
            positionCity: this.state.positionCity,//地区
            positionArea: this.state.positionArea,//地区
            remark2: this.state.remark2,
            jobDescription: this.state.jobDescription,
            servingRequire: this.state.servingRequire,
            remark: this.state.remark,
            CHECK_STATUS: '1',
            creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            id: this.props.rowData.ID,
            remark3: this.state.dictdataName,
            ratio: this.state.ratio,
            realMoney: ((parseFloat(this.state.salary) * parseFloat(this.state.ratio) / 100) + parseFloat(this.state.salary) + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2),
            address: this.state.address,
            remark4: this.state.settlement,
            electronicBusinessLicense: this.state.electronicBusinessLicense
        }
        //debugger
        Alert.alert("提示", "请您确认好发包内容"
            , [
                {
                    text: "再看看", onPress: () => {
                    }
                },
                {
                    text: "继续", onPress: () => {
                        Toast.show({
                            type: Toast.mode.C2MobileToastLoading,
                            title: '提交中...'
                        });
                        Fetch.postJson(Config.mainUrl + '/temporaryWork/changeJobApp', temp)
                            .then((res) => {
                                Toast.dismiss();
                                Toast.showInfo('重新提交审核成功', 1000);
                                Actions.pop()
                                this.props.onblock()
                            })
                    }
                }

            ])


    }

    choose(data) {
        var province = (data.leftData.p_name == undefined) ? '' : data.leftData.p_name;
        var province_id = (data.leftData.p_id == undefined) ? '' : data.leftData.p_id;
        var city = (data.rightData.c_name == undefined) ? '' : data.rightData.c_name;
        var city_id = (data.rightData.c_id == undefined) ? '' : data.rightData.c_id;
        var area = (data.endData.a_name == undefined) ? '' : data.endData.a_name;
        var area_id = (data.endData.a_id == undefined) ? '' : data.endData.a_id;
        var value = province + city + area;
        if (data.leftData == '') {
            this.setState({
                diqu: '不限',
                positionProvinceName: '',
                positionProvince: '',
                positionCityName: '',
                positionCity: '',
                positionAreaName: '',
                positionArea: '',
            });
        } else {
            this.setState({
                diqu: value,
                positionProvinceName: province,
                positionProvince: province_id,
                positionCityName: city,
                positionCity: city_id,
                positionAreaName: area,
                positionArea: area_id,
            });
        }
    }


    dataChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " "
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

    first: {
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 44,
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        borderBottomColor: '#e7e7e7',
        borderBottomWidth: 1,
        marginTop: 8,
        marginLeft: 8
    },
    first2: {
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 44,
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        marginTop: 8,
        marginLeft: 8
    },
    height: {
        marginTop: 5,
        borderColor: '#bbe6f7',
        borderWidth: 1,
    },
});

