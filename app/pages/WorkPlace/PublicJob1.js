/**
 * 发包内容编辑
 * 曾一川
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, DeviceEventEmitter, BackHandler } from 'react-native';
import { FileManager, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
import { Checkbox, List, Picker } from 'antd-mobile-rn';
import DatePicker from 'react-native-datepicker';
import ListViewChooseContainer from '../../utils/ListViewChooseContainer';
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const CheckboxItem = Checkbox.CheckboxItem;
var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
import EncryptionUtils from '../../utils/EncryptionUtils';
import PcInterface from '../../utils/http/PcInterface';
export default class PublicJob extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            UUID: UUID.v1(),
            imageSource: '',//附件图片
            dataSource: [],
            value: '',
            M: (this.props.rowData.POSITION_KIND == '0') ? true : false,
            W: (this.props.rowData.POSITION_KIND == '0') ? false : true,
            Y: (this.props.rowData.STAGR_SETTLEMENT == '1') ? false : true,
            N: (this.props.rowData.STAGR_SETTLEMENT == '1') ? true : false,
            ShowYfk: (this.props.rowData.advancePayment == '0') ? true : false,
            ShowNyfk: (this.props.rowData.advancePayment == '0') ? false : true,
            visibleReferees: false,
            visibleReferees1: false,
            diqu: this.props.rowData.POSITION_PROVINCE_NAME + this.props.rowData.POSITION_CITY_NAME + this.props.rowData.POSITION_AREA_NAME,
            positionName: this.props.rowData.POSITION_NAME,//发包名称
            positionKind: this.props.rowData.POSITION_KIND,//发包规模
            salary: this.props.rowData.SALARY,//金额
            stagrSettlement: this.props.rowData.STAGR_SETTLEMENT,// 是否阶段性结算
            workEndTime: this.timeChange(this.props.rowData.WORK_END_TIME),// 用工结束时间
            positionProvinceName: this.props.rowData.POSITION_PROVINCE_NAME,// 所在省
            positionCityName: this.props.rowData.POSITION_CITY_NAME,// 所在市
            positionAreaName: this.props.rowData.POSITION_AREA_NAME, //所在区
            positionProvince: this.props.rowData.POSITION_PROVINCE,// 所在省
            positionCity: this.props.rowData.POSITION_CITY,// 所在市
            positionArea: this.props.rowData.POSITION_AREA, //所在区
            remark2: this.props.rowData.REMARK2,//发包内容
            jobDescription: this.props.rowData.JOB_DESCRIPTION,//发包需求
            servingRequire: this.props.rowData.SERVING_REQUIRE,//验收标准
            remark: this.props.rowData.REMARK,//备注
            data_education: [],//发包标签
            value_education: this.props.rowData.REMARK3,
            ratio: this.props.rowData.RATIO,
            address: this.props.rowData.ADDRESS,
            dictdataValue: '',
            dictdataName: this.props.rowData.REMARK3,
            settlement: this.props.rowData.REMARK4,
            electronicBusinessLicense: this.props.rowData.ELECTRONIC_BUSINESS_LICENSE,
            Fwf: this.props.rowData.SERVICE_MONEY_BL ? this.props.rowData.SERVICE_MONEY_BL : ''
        };
        this.refresh()
        this.getFwf()
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
    getFwf() {
        if (this.props.rowData.CHECK_STATUS == '3') {
            var entity = {
                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
            }
            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
                .then((res) => {
                    console.log(res)
                    if(res.serviceMoneyLscl!=this.state.Fwf){
                        Toast.showInfo('贵公司的合伙人服务费比例进行了调整，总计金额发生变化，请悉知！', 3000);
                    }
                    this.setState({
                        Fwf: res.serviceMoneyLscl
                    })
                })
        }
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
    refresh() {
        let docParams = {
            params: {
                businessKey: this.props.rowData.ID,
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
        if (this.props.rowData.CHECK_STATUS !== '3') {
            return
        }
        if (this.state.electronicBusinessLicense == "1") {
            this.setState({ electronicBusinessLicense: "0" })
        } else {
            this.setState({ electronicBusinessLicense: "1" })
        }
    }
    onSettlement() {
        if (this.props.rowData.CHECK_STATUS !== '3') {
            return
        }
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
    biliInputOnblur(text) {
        //debugger
        let value = parseFloat(this.state.ratio)
        var rule = /(^(((\d|[1-9]\d)(\.\d{1,8})?)|100|100.0|100.00|100.000|100.0000|100.00000|100.000000|100.0000000|100.000000000)$)/
        if (value > 100 || !rule.test(this.state.ratio)) {
            Alert.alert('综合税费比例输入提示', '请填写100以内的数字，最多保留小数点后8位', [{ text: '确定' }])
            this.setState({
                ratio: ''
            })
        }
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
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>{this.props.rowData.CHECK_STATUS == '3' ? '发包内容修改' : '发包内容查看'}</Text>
                    </View>
                </ImageBackground>

                <ScrollView onPress={() => { Keyboard.dismiss() }}>
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
                                {this.props.rowData.CHECK_STATUS == '3' ?
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
                                            {this.state.M == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>单包</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                            {this.state.W == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>多包</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {this.props.rowData.CHECK_STATUS == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包金额(不含税)</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', }}
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
                                            style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 18, }}
                                        >{this.state.salary}</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, position: 'absolute', right: 4 }}>元</Text>
                                    </View>}

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>服务费比例</Text>
                                    </View>
                                    <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}>{this.state.Fwf + '%'}</Text>
                                </View>


                                {this.props.rowData.CHECK_STATUS == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>综合税费比例</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.ratio}
                                            placeholder='请输入综合税费比例'
                                            onChangeText={(text) => { this.setState({ ratio: text }) }}
                                            onBlur={(text) => { this.biliInputOnblur(text) }}
                                        />
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>%</Text>
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
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}>{(this.state.salary == '' || this.state.ratio == '') ? null :
                                            ((parseFloat(this.state.salary) * parseFloat(this.state.ratio) / 100) + parseFloat(this.state.salary) + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2)}</Text>
                                    </View>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, position: 'absolute', right: 4 }}>元</Text>
                                </View>
                                {this.props.rowData.CHECK_STATUS == '3' ?
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

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <TouchableOpacity onPress={this.onSettlement.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 150 }}>
                                        {this.state.settlement == "1" ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, marginTop: 2 }}>通过平台结算</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onSettlement.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
                                        {this.state.settlement == "0" ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, marginTop: 2 }}>不通过平台结算</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>需要电子营业执照</Text>
                                        <TouchableOpacity onPress={this.onEbl.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                            {this.state.electronicBusinessLicense == "0" ? <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.onEbl.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                            {this.state.electronicBusinessLicense == "1" ? <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {this.props.rowData.CHECK_STATUS == '3' ?
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>阶段性结算</Text>
                                            <TouchableOpacity onPress={this.pres3.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                                {this.state.Y == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.pres4.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                                {this.state.N == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
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
                                                {this.state.Y == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                                {this.state.N == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                    <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                <View>
                                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                                </View>
                                            </View>
                                        </View>

                                    </View>}
                                {this.props.rowData.CHECK_STATUS == '3' ?
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
                                {this.props.rowData.CHECK_STATUS == '3' ?
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
                                            editable={this.props.rowData.CHECK_STATUS == '3' ? true : false}
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
                                            editable={this.props.rowData.CHECK_STATUS == '3' ? true : false}
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
                                            editable={this.props.rowData.CHECK_STATUS == '3' ? true : false}
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
                                            editable={this.props.rowData.CHECK_STATUS == '3' ? true : false}
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
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', height: deviceHeight / 6, marginRight: 4 }}>
                                        <TextInput
                                            style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, }}
                                            placeholderTextColor={'#808080'}
                                            value={this.state.remark}
                                            multiline={true}
                                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                            placeholder='选填'
                                            placeholderTextColor="#c4c4c4"
                                            editable={this.props.rowData.CHECK_STATUS == '3' ? true : false}
                                            numberOfLines={20}
                                            onChangeText={(text) => { this.setState({ remark: text }) }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                margin: 10,
                                width: Dimensions.get('window').width - 40,
                                borderBottomColor: '#e7e7e7',
                                borderBottomWidth: 1,
                                marginTop: 8,
                                marginLeft: 8, marginBottom: 8
                            }}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>附件</Text>
                                    {this.props.rowData.CHECK_STATUS == '3' ? <TouchableOpacity activeOpacity={1} onPress={this.getPhoto.bind(this)} style={{ marginLeft: 20 }}>
                                        <Text style={{ backgroundColor: 'rgb(65,143,234)', color: "white", fontSize: Config.MainFontSize - 2, padding: 3, borderRadius: 5 }}>附件上传</Text>
                                    </TouchableOpacity> : null}
                                </View>
                                {this.renderListView()}
                            </View>

                            {this.props.rowData.advancePayment ? <View style={{
                                marginBottom: 1,
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
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>是否预付款</Text>
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 100 }}>
                                        {this.state.ShowYfk == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', position: 'absolute', right: 40 }}>
                                        {this.state.ShowNyfk == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                        </View>
                                    </View>
                                </View>
                            </View> : null}

                            {/* {this.state.imageSource == '' ? null :
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <Image style={{ width: deviceWidth / 3, height: deviceWidth / 3, borderRadius: 5 }} source={{ uri: this.state.imageSource }}></Image>
                                </View>
                            } */}
                        </View>
                        <View style={{ width: deviceWidth - 18, height: 10, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                    </View>
                    {this.props.rowData.CHECK_STATUS == '3' ? <TouchableOpacity style={{ marginTop: 20 }} onPress={() => {
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

                    <TouchableOpacity style={{ marginTop: 20, marginBottom: 30 }} onPress={() => Actions.pop()}>
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
                            }}>返回</Text>
                        </View>
                    </TouchableOpacity>
                    <ListViewChooseContainer
                        visible={this.state.visibleReferees1}
                        top={deviceHeight / 3}//这个用来控制与顶部距离
                        theme={'year'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                        onCancel={() => { this.setState({ visibleReferees1: false }); return null; }}
                        callbackData={(data) => this.choose1(data)} />
                    <ListViewChooseContainer
                        visible={this.state.visibleReferees}
                        top={deviceHeight / 2 - 100}//这个用来控制与顶部距离
                        theme={'diqu'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                        onCancel={() => { this.setState({ visibleReferees: false }); return null; }}
                        callbackData={(data) => this.choose(data)} />
                </ScrollView>
            </View >
        );
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
                    <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 10 }}>
                        <TouchableOpacity onPress={this.downLoadFile.bind(this, Config.mainUrl + "/iframefile/qybdirprocess/download/" + encodeURIComponent(data[i].filePath), data[i].fileName)}>
                            <Text style={{ color: 'rgb(65,143,234)' }}>{data[i].fileName}</Text>
                        </TouchableOpacity>
                        {this.props.rowData.CHECK_STATUS == '3' ?
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.deleteFile.bind(this, data[i])}>
                                <Text>删除</Text>
                            </TouchableOpacity>
                            : null}

                    </View>
                )
            }
        }
        return temp
    }
    getPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        ActionSheet.showActionSheetWithOptions(params)
            .then((index) => {
                if (index == 0) {
                    this._camera();
                } else if (index == 1) {
                    this._selectImage();
                }
            });
    }
    _camera() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource: response.uri,
                });
                this.uploadImage(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage() {
        let timestamp = Date.parse(new Date());
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return } else {
                    var info = {
                        simpleType: response[0].simpleType,
                        fileSize: response[0].fileSize,
                        fileName: timestamp + '.jpg',
                        width: response[0].width,
                        height: response[0].height,
                        duration: response[0].duration,
                        type: response[0].type,
                        uri: response[0].uri,
                    }
                }
                this.setState({
                    imageSource: response[0].uri
                })
                this.uploadImage(info)
            }).catch((e) => {
                console.log('失败回调');
            })
    }
    uploadImage(response) {
        //debugger
        let business_Key = this.props.rowData.ID
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: response,
            url: path,
            formData: { businessType: 'FBFJSC', businessKey: business_Key, displayName: '附件上传' },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                if (respones.data !== undefined) {
                    if (respones.data.errorMsg !== undefined) {
                        Toasts.show(respones.data.errorMsg, { position: -80 }, 2000)
                    }
                    if (respones.data.msg == '成功') {
                        this.refresh()
                        Toasts.show('上传成功', { position: -20 })
                    }
                }

            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    deleteFile(fileParam) {
        //debugger
        Alert.alert("温馨提示", "是否确认删除？"
            , [
                {
                    text: "取消", onPress: () => { }
                }, {
                    text: "确定", onPress: () => {
                        let filePath = fileParam.filePath
                        let fileName = fileParam.fileName
                        let filePathArray = filePath.split('/')
                        let url = Config.mainUrl + '/iframefile/qybdirprocess/' + filePathArray[0] + '/' + filePathArray[1] + '/' + encodeURIComponent(fileName) + '?' + 'businessKey=' + fileParam.businessKey + '&businessType=' + fileParam.businessType + '&displayName=附件上传&maxNum=5&maxSize=4294967296&viewModel=list'
                        Fetch.deleteJson(url)
                            .then((res) => {
                                //debugger
                                Toast.showInfo(res.msg, 1000);
                                this.refresh()
                            })
                    }
                },
            ])
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
        //debugger
        var reg = /^\d+(\.\d{0,2})?$/;
        var numReg = /^[0-9]*$/
        if (this.state.positionName == '') {
            Toast.showInfo('请填写发包名称', 1000);
            return
        } else if (this.state.M == false && this.state.W == false) {
            Toast.showInfo('请选择发包规模', 1000);
            return
        }
        else if (numReg.test(this.state.salary) == false) {
            Toast.showInfo('请填写正确的发包金额', 1000);
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
        // else if (reg.test(parseFloat(this.state.ratio)) == false) {
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
        // let value = parseFloat(this.state.ratio)
        // if (value > 100 || this.state.ratio.length > 5) {
        //     Toast.showInfo('请填写100以内的综合税费比例，精确到小数点后两位', 2000);
        //     return
        // }
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
            electronicBusinessLicense: this.state.electronicBusinessLicense,
            serviceMoneyBl: this.state.Fwf
        }
        //debugger
        Alert.alert("提示", "请您确认好发包内容"
            , [
                {
                    text: "我再看看", onPress: () => {
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

