/**
 * 发包内容填写
 * 曾一川
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, Modal, BackHandler } from 'react-native';
import { FileManager, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
import { Checkbox, List, Picker } from 'antd-mobile-rn';
import Toasts from 'react-native-root-toast';
import DatePicker from 'react-native-datepicker';
import ListViewChooseContainer from '../../utils/ListViewChooseContainer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const CheckboxItem = Checkbox.CheckboxItem;
var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

export default class PublicJob extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            value: '',
            M: false,
            W: false,
            Y: false,
            N: true,
            visibleReferees: false,
            visibleReferees1: false,
            read: false,
            modalVisible: false,
            settlement: "0",
            electronicBusinessLicense: '1',
            diqu: '选择地区',
            positionName: '',//发包名称
            positionKind: '',//发包规模
            salary: '',//金额
            ratio: '',//比例
            address: '',//详细地址
            realMoney: '',//税后金额
            stagrSettlement: '',// 是否阶段性结算
            workEndTime: '',// 用工结束时间
            positionProvinceName: '',// 所在省
            positionCityName: '',// 所在市
            positionAreaName: '', //所在区
            positionProvince: '',// 所在省
            positionCity: '',// 所在市
            positionArea: '', //所在区
            remark2: '',//发包内容
            jobDescription: '',//发包需求
            servingRequire: '',//验收标准
            remark: '',//备注
            remark3: '',//发包标签
            data_education: [],//发包标签
            dictdataValue: '选择发包标签',
            dictdataName: '',
            value_education: [],
            jfaddress: '',
            yfaddress: '',
            bfaddress: '',
            imageSource4: '',
            UUID: UUID.v1(),
            Fwf: ''
        };
        this.getAddress();
        this.getFwf()
    }
    getFwf() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                console.log("服务费为:", res)
                this.setState({
                    Fwf: res.serviceMoneyLscl
                })
            })
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
    //获取签订双方位置
    getAddress() {
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/queryAddress?fbUserId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId + '&jbuserId=null')
            .then((res) => {
                if (res) {
                    this.setState({
                        // bfaddress: res.userAddress,//发包没有丙方地址
                        yfaddress: res.yfAdress,//乙方
                        jfaddress: res.companyAddress//甲方地址
                    })
                }

            })
    }
    onEbl() {
        if (this.state.electronicBusinessLicense == "1") {
            Alert.alert('提示', "您已勾选“需要电子营业执照”，平台不承担相应代扣代缴义务，合同双方自行处理结算、个税申报、票据等相关事宜", [{ text: '确定' },]);
            this.setState({
                electronicBusinessLicense: "0",
                settlement: "1"
            })
        } else {
            this.setState({
                electronicBusinessLicense: "1",
                settlement: "0"
            })
            Alert.alert('提示', '您未勾选“需要电子营业执照”，由实际接包情况确定是否由平台完成相应代扣代缴义务，并收取相应服务费', [{ text: '确定' },])
        }
    }
    onSettlement() {
        if (this.state.settlement == "1") {
            this.setState({ settlement: "0" })
            Alert.alert('您未勾选“需要电子营业执照”，由实际接包情况确定是否由平台完成相应代扣代缴义务，并收取相应服务费。', [{ text: '确定' }])
        } else {
            this.setState({ settlement: "1" })
            Alert.alert('您已勾选“需要电子营业执照”，平台不承担相应代扣代缴义务，合同双方自行处理结算、个税申报、票据等相关事宜。', [{ text: '确定' }])

        }
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
    onChange_education = (value, i) => {
        this.setState({ value_education: value });
    }
    pres1() {
        this.setState({
            M: true,
            W: false,
        })
    }
    choose1(rowDate) {
        this.setState({
            dictdataName: rowDate.dictdataName,
            dictdataValue: rowDate.value,
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
        // if (!rule.test(this.state.ratio)) {
        //     Toast.showInfo('最多保留小数点后8位', 1000);
        //     this.setState({
        //         ratio:''
        //     })
        //     return
        // }
    }
    render() {
        var numReg = /^[0-9]*$/
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }} >
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>发包内容填写</Text>
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
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包规模</Text>
                                        <TouchableOpacity onPress={this.pres1.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                            {this.state.M == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>单包</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.pres2.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                            {this.state.W == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>多包</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>

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
                                        placeholder='请输入发包金额'
                                        onChangeText={(text) => { this.setState({ salary: text }) }}
                                        onBlur={(text) => { this.Fbje(text) }}
                                        maxLength={8}
                                    />
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>元</Text>
                                </View>

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>服务费比例</Text>
                                    </View>
                                    <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}>{this.state.Fwf + '%'}</Text>
                                </View>

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
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>总计金额</Text>
                                    </View>
                                    <View style={{ flex: 1, marginRight: 4, position: 'absolute', right: 14 }} >
                                        <Text style={{ fontSize: Config.MainFontSize, textAlign: 'right', color: '#999', }}>{(this.state.salary == '' || this.state.ratio == '') ? null :
                                            ((parseFloat(this.state.salary) * parseFloat(this.state.ratio) / 100) + parseFloat(this.state.salary) + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2)}</Text>
                                        {/* + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2) */}
                                    </View>
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, position: 'absolute', right: 4 }}>元</Text>
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发包标签</Text>
                                    </View>
                                    <TouchableOpacity style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => this.setState({ visibleReferees1: true })}>
                                        <Text style={{ color: (this.state.dictdataValue == '点我选择发包标签') ? '#c4c4c4' : '#000' }}>{this.state.dictdataValue}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>结算方式</Text>
                                    </View>
                                </View>

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <TouchableOpacity onPress={this.onSettlement.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 150}}>
                                        {this.state.settlement == "1" ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10 }}>通过平台结算</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onSettlement.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 10 }}>
                                        {this.state.settlement == "0" ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10 }}>不通过平台结算</Text>
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

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row', width: deviceWidth }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>阶段性结算</Text>
                                        <TouchableOpacity onPress={this.pres3.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 120 }}>
                                            {this.state.Y == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>是</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.pres4.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 60 }}>
                                            {this.state.N == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                                <Image source={require('../../image/Group.png')} style={{ height: 10, width: 10, marginTop: 5 }} />}
                                            <View>
                                                <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>否</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>
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
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>工作地区</Text>
                                    </View>
                                    <TouchableOpacity style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => this.setState({ visibleReferees: true })}>
                                        <Text style={{ color: (this.state.diqu == '点我选择地区') ? '#c4c4c4' : '#000' }}>{this.state.diqu}</Text>
                                    </TouchableOpacity>
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
                                            numberOfLines={20}
                                            onChangeText={(text) => { this.setState({ remark: text }) }}
                                        />
                                    </View>
                                </View>



                            </View>

                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', width: deviceWidth, height: 30 }}>
                                <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10 }}>附件上传</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginTop: 10, marginLeft: 10, paddingRight: 20, width: deviceWidth / 1.3 }}>(非必选 :支持图片上传或者拍照)</Text>
                            </View>
                            {/* <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} /> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', margin: 20 }}>
                                <TouchableOpacity activeOpacity={1} onPress={this.getPhoto4.bind(this)} >
                                    {this.state.imageSource4 == '' || this.state.imageSource4 == undefined ?
                                        <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                            <Image source={require('../../image/fw.png')} style={{ width: deviceWidth / 6, height: deviceWidth / 6, borderRadius: 5 }} />
                                        </View> :
                                        <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                            <Image source={{ uri: this.state.imageSource4 }} style={{ width: deviceWidth / 6, height: deviceWidth / 6, borderRadius: 5 }} />
                                        </View>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: deviceWidth - 18, height: 10, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: true })} style={{ backgroundColor: 'transparent', flexDirection: 'row', marginTop: 20, alignSelf: 'center' }} >
                        <Text style={{ color: 'grey', fontSize: Config.MainFontSize }}>您已经阅读并同意</Text><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize }}>发包须知等协议</Text>
                        <VectorIcon onPress={() => this.setState({ read: !this.state.read })} name={this.state.read == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                    </TouchableOpacity>
                    {this.state.read == true ?
                        <TouchableOpacity style={{ marginTop: 10, marginBottom: 10 }} onPress={() => {
                            this.save()
                        }}>
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgb(65,143,234)',
                                width: Dimensions.get('window').width / 1.3,
                                height: 44,
                                marginTop: 10,
                                borderRadius: 20,
                            }}>
                                <Text style={{
                                    fontSize: Config.MainFontSize,
                                    color: '#ffffff'
                                }}>发包</Text>
                            </View>
                        </TouchableOpacity> : <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'grey',
                                width: Dimensions.get('window').width / 1.3,
                                height: 44,
                                marginTop: 10,
                                borderRadius: 20,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: Config.MainFontSize,
                                    color: '#ffffff'
                                }}>发包</Text>
                            </View>
                        </View>}
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
                {this.zerenModal()}
            </View >
        );
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
    getPhoto4() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        ActionSheet.showActionSheetWithOptions(params)
            .then((index) => {
                if (index == 0) {
                    this._camera4();
                } else if (index == 1) {
                    this._selectImage4();
                }
            });
    }
    _camera4() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource4: response.uri,
                });
                this.uploadImage4(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage4() {
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
                        fileName: '附件.jpg',
                        width: response[0].width,
                        height: response[0].height,
                        duration: response[0].duration,
                        type: response[0].type,
                        uri: response[0].uri,
                    }
                }
                this.setState({
                    imageSource4: response[0].uri
                })
                this.uploadImage4(info)
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage4(response) {//上传身份证照片,side用来区分正方面
        //debugger
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: response,
            url: path,
            formData: { ifCover: "true", businessType: 'FBFJSC', businessKey: this.state.UUID, displayName: '附件上传' },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                if (respones.data !== undefined) {
                    if (respones.data.errorMsg !== undefined) {
                        Toasts.show(respones.data.errorMsg, { position: -80 }, 2000)
                    }
                }
                // Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    onPressAgreement1() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement9.html', title: '“工薪易”平台发活（发包）须知', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement2() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement8.html', title: '“工薪易”平台服务发布规范', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement3() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement11.html', title: '“工薪易”平台服务发布规范', popCallback: this.handlePop.bind(this) })
    }
    handlePop() {
        //debugger
        this.setState({ modalVisible: true })
    }
    zerenModal() {
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    modalVisible={true}
                    visible={this.state.modalVisible}
                >
                    <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.5 }}>
                    </TouchableOpacity>
                    <View style={{ alignSelf: 'center', height: (Platform.OS == 'ios') ? deviceHeight / 1.5 : deviceHeight / 1.4, width: deviceWidth - 40, marginTop: 40, backgroundColor: 'white', position: 'absolute' }}>
                        <ImageBackground source={require('../../image/mianze.png')} style={{ width: deviceWidth - 40, height: 160, alignSelf: 'center' }}>
                            <Text style={{ color: 'white', position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>工薪易平台发包须知</Text>
                            <VectorIcon name={'security'} style={{ color: 'white', fontSize: 80, position: 'absolute', marginTop: 50, alignSelf: 'center', backgroundColor: 'transparent' }} />
                        </ImageBackground>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement1()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台发活（发包）须知》</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement2()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台服务发布规范》</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement3()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台共享经济（自由职业者服务）协议》</Text>
                        </TouchableOpacity>
                        {/* <ScrollView style={{ marginBottom: 80, backgroundColor: 'white', width: deviceWidth - 60, alignSelf: 'center', height: deviceHeight / 3 }}>
                            <View>
                                <Text style={{ marginTop: 10 }}>
                                    第一条 概述
                                    </Text>
                                <Text style={{ marginTop: 10 }}>  为了维护“工薪易”平台正常运营秩序，保障发活（发包）顺利进行，制定本规则。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  第二条 声明
发活（发包）方发活（发包）需符合国家法律法规以及“工薪易”平台关于发活（发包）的相关规定。
    </Text>
                                <Text style={{ marginTop: 10 }}> 第三条 服务内容
                                            </Text>
                                <Text style={{ marginTop: 10 }}>   3.1发活方企业根据经营需要，委托接活方依法通过“工薪易”平台提供相关服务，服务方式包括但不限于咨询、信息、培训、技术、宣传、地推等各方共同确认的其他服务方式与服务内容。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  3.2 各方确认并同意，本协议项下发活方委托接活方提供的服务内容及服务方式应当符合国家法律法规以及有关部门的监管规定，且应符合双方的经营范围及资质许可要求，同时也不应违反“工薪易”平台规则。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  3.3审核标准
1) 为了保护接活方权益并使接活方更加准确了解“项目成果的合格状态”，发活方应在发布项目时设定审核标准，且应审慎填写并严格执行；
2) 如发活方未予审核通过，接活方可向“工薪易”平台复议，由发活方给出最终判定结果。
    </Text>
                                <Text style={{ marginTop: 10 }}>  3.4 接活方仅按本协议约定的服务内容为发活方提供信息及相关服务，因接活方或第三方原因导致发活方损失的，“工薪易”平台不承担相关赔偿责任和/或相关所有连带责任。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  3.5 费用实现：发活方按审核标准确认接活方提交的项目成果合格之后，发活方根据“工薪易”平台统计的接活方与发活方之间的项目成交金额，通过“工薪易”平台向接活方支付相应金额。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  3.6 接活方账户使用方式：接活方账户在“工薪易”平台上领取的全部项目以及接活方团队师傅在线下具体执行任务中，均以接活方自身名义进行项目领取、项目执行、项目成果提交等。

                                            </Text>
                                <Text style={{ marginTop: 10 }}>  第四条 禁止发布需求类别
    </Text>
                                <Text style={{ marginTop: 10 }}>  凡是违反宪法精神和中华人民共和国相关法律法规、带有民族歧视性、夸大宣传并带有欺骗性、有损于社会主义道德风尚或者有其他不良影响的发活（发包），“工薪易”平台将拒绝提供服务。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  1、以下订单由于违反法律、法规和“工薪易”平台相关规则而禁止发布：
（1）软件破解、程序破解类订单。
（2）游戏外挂、程序外挂类订单。
（3）盗取网银账号、游戏账号类订单。
（4）侵犯第三方知识产权的订单。
（5）侵犯第三方权利的订单。
（6）木马、黑客程序等有损网络安全的订单。
（7）涉黄、赌博等订单。
（8）散布网络谣言的订单。
（9）其他违反法律、法规、行政规章等相关规定的订单。
    </Text>
                                <Text style={{ marginTop: 10 }}>  2、以下订单可能对交易参与方或者第三方带来损害而禁止发布：
（1）论文代写类订单。
（2）需要手机验证注册的订单。
（3）需要银行账号验证或者付费才能参与的订单。
（4）以招聘为名进行的欺骗型订单。
（5）可能套取订单参与方身份证、邮箱、手机号、银行账号等个人或者机构隐私信息的订单。
（6）刷信誉值、账号买卖等订单。
（7）发活（发包）方发布虚假信息的订单（包括但不限于订单信息与真实业务不符、虚构订单信息、明显低于或高于市场价值的订单信息等）。
（8）订单描述通过链接等方式逃避“工薪易”平台审核的。
（9）可能给他人或者其他机构带来损害的订单。
（10）其他违背社会伦理或社会主流价值观的订单。
（11）需要线下转账、充值、使用资金的订单。
    </Text>
                                <Text style={{ marginTop: 10 }}>  第五条 违规需求处理办法
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  在第三条的违规需求发布中，若“工薪易”平台未发现异常给予通过审核，事后经其他用户举报，立即关闭订单，并根据《“工薪易”平台举报处理制度》和《“工薪易”平台违规行为及处理制度》进行处理。
                                            </Text>
                                <Text style={{ marginTop: 10 }}>  第六条 需求描述规则
1、需求描述需要准确、完整，必须按规定填写必要真实有效的描述信息。
2、不得填写与发活（发包）内容无关的信息，如广告。
3、不得填写危害社会、交易、他人安全的信息，如恶意欺诈、违法、侵权、色情等信息，详情见《“工薪易”平台发送内容规范》。
4、凡是涉嫌诈骗、欺骗、虚假承诺、需要服务商先承担成本以及跳转站外有交易风险的，“工薪易”平台有权关闭该需求。
5、“工薪易”平台可在不通知用户的情况下对上述违规信息采取删除、屏蔽、断开链接等措施；对于发布上述信息，导致任何第三方损害的，发活（发包）方应当独立承担责任；“工薪易”平台因此遭受损失的，发活（发包）方也应当一并赔偿。
    </Text>
                                <Text style={{ marginTop: 10 }}>  第七条 需求发布规则
1、发活（发包）方自主确定需求、自主定价、自主确定完成需求的期限。
2、发活（发包）方可为需求添加标签，标签应和该需求的内容匹配，若标签和需求内容不匹配或涉嫌违法，“工薪易”平台有权删除或修改该需求的标签。
3、需求内容中不得含有联系方式。
4、同一需求禁止重复发布，若用户重复发布，“工薪易”平台将关闭重复的需求。
5、禁止通过发布需求来推广自己或别人的其他需求，一旦发现，网站将按“垃圾广告”的违规行为进行处理。
    </Text>
                                <Text style={{ marginTop: 10 }}>   第八条 企业用户所属企业法人授权内容
“工薪易”平台“企业用户”必须是能够独立承担法律责任的法人或组织（不含下属部门及其分支机构）。“工薪易”平台需要企业法人授权如下：
1、发活（发包）方所属企业法人同意使用“工薪易”平台作为众包交易平台，愿意遵守与“工薪易”平台达成的协议以及“工薪易”平台发布的各项规则。
2、发活（发包）方所属企业法人同意授权相关人员使用企业账户在“工薪易”平台上从事众包、众创交易，并授权下属部门的“负责人或授权人”实施操作，无条件承担交易相关的支付责任以及连带的法律责任。
3、发活（发包）方所属企业法人授权该企业账户的“负责人“角色个人账户指定的项目经理（使用“工薪易”平台功能指定）可以使用发活（发包）功能进行发活（发包），并接受“工薪易”平台提供的审批（在发活（发包）前、选定中选接活（接包）方、支付等关键环节，由发活（发包）方所属企业法人授权的”负责人“审批认定）和授权流程之后形成的有效需求及订单，发活（发包）方所属企业法人愿意承担支付责任。
    </Text>
                                <Text style={{ marginTop: 10 }}>   第九条 发活（发包）方确定中选接活（接包）方
1、发包方手动申请终止，且双方同意下，双方包终止，其他人仍可接包。发包方手动申请终止，接包方7日未给出响应系统将会默认双方包终止，其他人仍可接包。当包完成最后一笔结算款后，，系统会自动终止发包，不可以再有人接包。
2、发活（发包）方不得以任何形式参与自己发布订单的接活（接包）竞争并被选择为中选接活（接包）者和其它破坏公平竞争、骗取稿件和盗取创意的行为。
3、发活（发包）方改选中选接活（接包）方的情况，包括盗用发活（发包）方的密码进行确认中选接活（接包）方操作、发活（发包）方经中选接活（接包）方用户同意取消中选、特殊情况等，由发活（发包）方提供相关证据，经“工薪易”平台核实属实后，发活（发包）方可重新选择中选接活（接包）方。
4、发活（发包）方与接活（接包）方商量一致，通过签订电子订单或签订电子/纸质合同即确定双方的合作行为，电子订单具有法律效力，若发生纠纷，是重要的依据。
    </Text>
                                <Text style={{ marginTop: 10 }}>  第十条 执行规则
本规则与《发活（发包）须知》、《接活（接包）须知》、《“工薪易”平台举报处理制度》等“工薪易”平台公示的各项规则共同构成界定各方权利、义务和责任的依据，相关名词可互相引用参照，如有不同理解，以本规则条款为准：项目订单，具体以发活方提供的《批量验收项目发佣金》执行验收情况为准。
    </Text>
                                <Text style={{ marginTop: 10 }}>   第十一条 验收与支付
1、接活（接包）方提请验收后，发活（发包）方须在7天内作出处理，若发活（发包）方未拒绝验收、也没有进行退回，则系统自动视为验收通过。
2、发活（发包）方与接活（接包）方之间的费用结算和支付，按《“工薪易”平台共享经济（自由职业者服务）协议》中约定的方式进行结算并支付。
（1）“工薪易”平台根据发活（发包）方上传系统中的验收结算表，将报酬支付给接活（接包）方。“工薪易”平台以发活（发包）方每次提供数据为准，一经确认无法修改，发活（发包）方上传验收结算表需谨慎。
（2）“工薪易”平台需收取平台服务费及其他费用具体以相关协议为准，若之后发生因交易纠纷或双方协商涉及到退款的举报，平台服务费及其他费用不予退还。
    </Text>
                                <Text style={{ marginTop: 10 }}>  第十二条 违约责任
1、发活（发包）方责任：若由于发活（发包）方原因，导致交易无法完成的，接活（接包）方不承担任何责任。若由于发活（发包）方原因致使接活（接包）方产生损失的，“工薪易”平台有权使用发活（发包）方存入平台的预付款对接活（接包）方进行赔付，但是，“工薪易”平台并不需要因此向接活（接包）方承担任何赔偿责任。
2、接活（接包）方责任：若接活（接包）方不能按要求完成订单，将按照平台相关规则进行相应处理。
    </Text>
                                <Text style={{ marginTop: 10 }}> 第十三条 交易纠纷处理
1、交易双方使用“工薪易”平台进行交易时，应当遵守“工薪易”平台上的各项规则，因未使用“工薪易”平台进行交易或超出举报时限而产生的纠纷，平台不予受理。
2、交易纠纷处理办法由《“工薪易”平台举报处理制度》作出具体规定。
3、“工薪易”平台处理交易纠纷以发活（发包）方已存入平台的预付款资金为限，若双方在需求要求中约定了有超过发活（发包）方预付款金额的赔付内容，由双方自行协商处理，“工薪易”平台不接受此类争议的处理。
    </Text>
                                <Text style={{ marginTop: 10 }}>  第十四条 所有权、知识产权、使用权
14.2 “工薪易”平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、图像、视频、档案、资料、网站构架、网站版面的安排、网页设计、经由“工薪易”平台或广告商向用户呈现的广告或资讯，均由“工薪易”平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经“工薪易”平台或权利人明示书面授权，接活方、接活方雇员及代理人保证不修改、出租、出借、出售、散布“工薪易”平台及“工薪易”平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。与“工薪易”平台相关的且由此业务产生的商业秘密信息、客户资料、渠道资源、技术资料和技术诀窍等所有权均归“工薪易”平台所有。
14.2 服务软件形式
    </Text>
                                <Text style={{ marginTop: 10 }}>  若“工薪易”平台依托“软件”向发活方、接活方提供平台服务，接活方还应遵守以下约定：
14.2.2 “工薪易”平台可能为不同的终端设备开发不同的软件版本，发活方、接活方应当根据实际需要选择下载合适的版本进行安装。
14.2.2 如果发活方从未经合法授权的第三方获取本软件或与本软件名称相同的安装程序，“工薪易”平台将无法保证该软件能否正常使用，由此给发活方及接活方造成的任何损失不予负责。
14.2.3 为了增进平台用户体验、完善服务内容，“工薪易”平台将不时提供软件更新服务（该更新可能会采取软件替换、修改、功能强化、版本升级等形式）。为不断优化用户体验，保证服务的安全性与功能的一致性，“工薪易”平台有权对软件进行更新或对软件的部分功能效果进行改变或限制。
14.2.4 软件新版本发布后，旧版软件可能无法使用。“工薪易”平台不保证旧版软件继续可用及相应的客户服务，请发活方及接活方随时核对并下载最新版本。
    </Text>
                                <Text style={{ marginTop: 10 }}>  第十五条 本规则自发布之日起实行

</Text>

                                <Text style={{ marginTop: 30 }}>工薪易平台共享经济（自由职业者服务）协议
</Text>
                                <Text style={{ marginTop: 10 }}>感谢您选择由我司湖南薪税信息科技有限责任公司研发设计的“工薪易”服务平台（包括PC端和手机端app），我司将依托综合实力竭诚为您提供规范、专业、全方位的综合服务。
为便于您使用我司提供的服务，您通过网络页面点击或以其他任何形式确认本协议的，即视为您已充分理解本协议所有条款，同意订立本协议并接受本协议约束。
（在本协议下，甲方、乙方和丙方统称为“三方”，或各自被称为“一方”。各方确认并同意，本协议项下甲方委托乙方提供的服务内容及服务方式应当符合国家法律法规以及有关部门的监管规定，且应符合双方的经营范围及资质许可要求，同时也不应违反“工薪易”平台规则。）


</Text>
                                <Text style={{ marginTop: 10 }}>甲方：甲方（在“工薪易”平台注册、经认证、发布业务需求信息的企业用户）
                                </Text>
                                <Text style={{ marginTop: 10 }}>联系地址：{this.state.jfaddress}

                                </Text>
                                <Text style={{ marginTop: 10 }}>乙方：湖南薪税信息科技有限责任公司
                                </Text>
                                <Text style={{ marginTop: 10 }}>联系地址：{this.state.yfaddress}

                                </Text>
                                <Text style={{ marginTop: 10 }}>丙方：丙方（在“工薪易”平台注册的承接甲方对应业务的自由职业者,个人用户/个体工商户,
                                </Text>
                                <Text style={{ marginTop: 10 }}>联系地址：：{this.state.bfaddress}


                                </Text>
                                <Text style={{ marginTop: 10 }}>特别提示：
针对获得生产经营所得的自由职业者在使用本协议项下乙方提供的共享经济综合服务时，乙方承诺依法纳税、确保自然人纳税人取得税后的合法收入。
军人、公职人员等国家法律法规和纪律规定禁止从事兼职或经商的人员，严禁使用本协议项下乙方提供的共享经济综合服务。
公司雇员等其他与公司具有劳动/劳务合同关系、或其他类似的劳动人事法律关系并从与其有前述关系的公司取得工资薪金所得的人员，严禁使用本协议项下乙方提供的共享经济综合服务；该类人员因从事生产经营而从非与其有前述关系的企、事业单位所取得的生产经营所得，乙方可为其提供本协议项下的共享经济综合服务。
公司法定代表人、股东、董事、监事等其他从所属公司取得收入的人员，一律严禁使用本协议项下乙方提供的共享经济综合服务；该类人员因从事生产经营而从非与其有前述关系的企、事业单位所取得的生产经营所得，乙方可为其提供本协议项下的共享经济综合服务。
一经发现有上述任一行为的，乙方有权上报税务机关及其他相关国家机关。税务机关及其他相关国家机关根据《中华人民共和国税收征收管理法》及其他相关法律法规的规定追究责任主体的法律责任。

</Text>
                                <Text style={{ marginTop: 10 }}>第一条  合作内容
1、甲方因经营业务的需要，需要部分自由职业者为其提供临时性短期服务。甲方根据本协议及工薪易平台规则（《工薪易平台注册协议》及相关的规则文件），通过工薪易平台（运行于“工薪易”网站的“www.xsypt.com.cn”及“工薪易app”或其他H5等开放平台，是“工薪易”网站上为用户提供信息发布、交流，以及其他技术服务的电子商务交易服务平台，下称“工薪易平台”）发布项目信息、发布任务，与自由职业者（丙方）建立联系并达成相关协议（订单），对丙方执行的项目进行验收，验收合格后支付足额的服务费用（同时承担丙方该项个人所得税的代扣代缴义务）；参加工薪易平台有关活动并享受工薪易平台提供的其他有关资讯及信息服务，并向乙方支付相应的服务费用。
2、乙方是在中国国内注册成立的公司，具备共享经济资源平台及智能系统，可接受甲方委托为其提供共享经济综合服务，包括但不限于为其筛选适合的自由职业者并接受甲方委托向自由职业者支付相应费用，及依照主管税务机关授予的代征权限向自由职业者征收个人所得税税款及行政收费（如适用）。依照代征权限，乙方可以进行代征的范围仅限于从事生产经营的个人，即本协议项下的自由职业者（丙方）。
3、丙方系自然人生产经营共享经济服务活动的自由职业者，具备共享经济服务的专业素养、能力和相应许可证书。可按照甲方的业务需求提供相应的生产经营服务，履行相关权利和义务，收取相应的服务费用等。丙方应自行负担就其取得的生产经营服务费需缴纳的各项税款（按照有关税收政策规定及主管税务机关的要求，丙方该项的个人所得税款由甲方或者受甲方委托的乙方代扣代缴）。

</Text>
                                <Text style={{ marginTop: 10 }}>第二条  服务费结算及支付方式
1、根据甲乙双方签署的服务协议的约定，甲方应就乙方提供的共享经济综合服务支付服务费，其中，服务费金额中包括了最终对应到丙方基于其自由职业者活动而取得的费用金额（简称“绩效费”），乙方将完税后金额作为丙方从事生产经营活动的绩效费（税后）支付给丙方。
2、当甲方根据甲乙双方签署的服务协议的约定，向乙方按照有关协议约定支付服务费后，乙方应向丙方支付丙方应取得的绩效费（税后）。
3、本协议对绩效费的结算周期不作明确约定，甲乙丙三方可自行协商。
4、甲方按照业务结算规则计算丙方绩效费金额（税后），并生成提现申请单（提现申请单的内容包括但不限于丙方姓名、身份证号、收款账户信息、接单情况及费用等信息），甲方通过技术对接或者手工上传数据文件将数据上传至结算系统的，鉴于甲方商业机密及信息安全的考虑，乙方不得向甲方要求查阅自由职业者在甲方处提供服务的订单详情，甲方应如实填写提现申请单，乙方不负责核实提现申请单内容。
5、丙方收款账户信息以甲方提供的提现申请单记载或丙方在乙方登记的收款账户为准。
6、丙方可自行在甲方处查询绩效费的计算方式、支付途径等信息，甲方应提供相关查询便利，若双方因此产生争议纠纷的，应自行解决。
7、丙方应自行负担就其取得的绩效费需缴纳的各项税款及行政收费（如有）。乙方在向丙方支付其绩效费时，应当按照有关税收政策规定及主管税务机关的要求，向其代征个人所得税等税款及行政收费（如适用），乙方可在甲方支付的服务费中将该等款项予以扣减后支付给丙方。应乙方要求，丙方应提供与税款申报缴纳相关的协助及信息。

</Text>
                                <Text style={{ marginTop: 10 }}>第三条  甲方的权利与义务
1、甲方有权审核丙方提交的申请信息并决定是否接受丙方申请，丙方申请通过后获得专属于丙方的身份标识（如线上账户或线下记载文档等）。甲方自行规范其与丙方的交易方式及法律关系，如因此产生争议纠纷的，由甲方及丙方自行处理，与乙方无关。
2、甲方有权根据甲方业务需要、丙方活动情况等要求决定对丙方采取暂停活动及暂停对其费用结算、解除与丙方的活动安排及相应合同安排等措施。
3、甲方应当如实填写提现申请单（提现申请单所记载的金额应为丙方的税后所得）、按时足额向乙方支付服务费，并应独立承担与丙方活动有关的法律责任。
4、甲方应当保证其发布的服务信息真实有效且符合法律规定，保证信息发布人不会随意撤销或变更服务信息，如上述信息不实或变更导致丙方无法提供服务的由甲方承担。甲方应当保证在乙方的工薪易平台上发布的项目信息真实、准确无误导性，确保其发布的项目及委托乙方提供的服务内容不得违反国家法律、法规、行政规章的规定、不得侵犯他人知识产权或其他合法权益的信息、不得违背社会公共利益或公共道德、不得违反乙方的相关规定。如有违反导致任何法律后果的发生，甲方将以自己的名义独立承担法律责任，乙方不承担任何由此引发的法律责任。
5、甲方应当在平台上公布业务规则，且在业务规则发生变更时及时通知乙方和丙方。
6、甲方不得从事违反法律及行政法规等行为，如洗钱、偷税漏税及其他乙方认为不得使用乙方服务的行为等。甲方作为纳税人、扣缴义务人的，应该依法履行纳税义务。乙方在主管税务机关授予的代征权限履行本协议项下代征义务时，甲方拒绝缴纳税款的，乙方有权在24小时内报告主管税务机关，由主管税务机关处理。
7、甲方承诺对丙方所披露的个人隐私信息进行保密。
8、甲方不得委托乙方为下列人员代征个人所得税：①与甲方具有劳动/劳务合同关系、或其他类似的劳动人事法律关系的人员；②与甲方关联企业具有劳动/劳务合同关系、或其他类似的劳动人事法律关系的人员；③甲方及其关联企业的法定代表人、董事、监事、股东；④其他不适用于本协议条款中乙方代征范围的人员。
前述甲方关联企业指，与甲方相互间直接或间接持有其中一方的股权总和达到25%或以上的；或者与甲方直接或间接同为第三者所拥有或控制股权达到25%或以上的；或者对甲方生产经营、交易具有实际控制的与其他利益相关联的关系（包括但不限于婚姻、近亲属关系）。
如本条规定的人员以自由职业者身份从事生产经营行为的，经其提供相关证明文件后其生产经营所得可由乙方按照本协议向其代征个人所得税。
9、甲方可以留存为实现本次合作内容从丙方处获取的丙方个人信息。但是，未经丙方授权，甲方不得将从丙方个人信息披露给任何第三方。
10、甲方承诺向乙方合法提供或与乙方合法分享的丙方个人信息已经丙方同意。同时，甲方授权乙方为完成本协议合作之目的，使用甲方合法收集的个人信息（包括但不限于自然人姓名、身份证号、收款账户信息、接单数量及费用等）。上述“个人信息”是以电子或者其他方式记录的能够单独或者与其他信息结合识别自然人个人身份的各种信息，包括但不限于自然人的姓名、出生日期、身份证件号码、个人生物识别信息、住址、电话号码等。
11、甲方承诺将按照相关法律法规的要求，对从丙方处获得的丙方个人信息履行安全保护义务，保障网络免受干扰、破坏或未经授权的访问，防止网络数据泄露或被窃取、篡改。
12、甲方需向乙方支付本合同项下服务费，如因甲方未能及时支付服务费的，所导致的一切违约责任由甲方承担；如甲方已经按时支付服务费，但由于乙方原因造成乙方未能及时向各自由职业者结算其绩效费的，由此造成的一切后果由乙方承担。
13、甲方保证自由职业者可自行在甲方处查询费用的计算方式、支付途径等信息，如双方对查询结果有任何异议的，由甲方与自由职业者自行解决。
14、甲方承诺并保证其在乙方工薪易平台上发布的项目需求及任务信息真实、准确无误导性，丙方承诺提供资料之真实性、合法性、准确性和完整性，不存在任何虚假、误导、违法情形，不会侵犯任何第三方的合法权益。甲方应当保证本合作资金来源的稳定性及合法性,若因资金自身存在的问题并由此带来的一切后果及法律责任由丙方自行承担。
15、甲方需向乙方提供《授权委托书》，授权人操作甲方平台账户，甲方应自行负责自己的用户账号和密码，不得擅自以任何形式转让或授权他人使用，如甲方向他人提出操作指导帮助请求并把丙方平台账户名称及密码主动透露给他人，甲方仍须对在用户账号密码下发生的所有活动承担责任。甲方有权根据需要更改密码，且乙方建议甲方定期更改。因甲方过错而导致的任何损失由甲方自行承担，该过错包括但不限于：不按照交易提示操作，未及时进行交易操作，遗忘或泄漏密码，因密码保存不善被他人破解等。
16、如果甲方发布的项目或委托乙方工薪易平台提供的服务内容需要获得国家有关部门的认可、批准或相关合法资格的，丙方承诺其具有运营本项目所需的全部合法且适格的资格与资质，并将相应资格资质证明的复印件，作为合同附件。否则，乙方有权拒绝提供相关服务并根据具体情况决定是否解除本协议。
17、甲方基于乙方发生的任何商业行为所引起的一切法律纠纷由甲方自行承担，与乙方无关。
18、甲方公司或关联公司法定代表人、股东、董事、监事等其他从所属公司取得收入的人员、雇员等其他与公司或关联公司具有劳动/劳务合同关系、或其他类似的劳动人事法律关系并从与其有前述关系的公司取得工资薪金所得的人员，严禁使用本协议项下乙方提供的相关服务，包括抢活、接活和结算等，否则一经发现乙方有权解除合同，因以上行为产生的所有责任由甲方承担。
19、甲方若需乙方提供需收费的共享经济综合服务的，应与乙方另行签署服务合同，并按服务合同按时支付服务费及其他费用。

</Text>
                                <Text style={{ marginTop: 10 }}>第四条  乙方的权利与义务
1、乙方有权就丙方提供的个体经营活动制定相应服务标准，丙方应当遵守前述服务标准，乙方应敦促丙方不得违背相关法律法规，且乙方对丙方违反法律法规的行为不承担任何法律责任。
2、就本协议项下乙方提供的共享经济综合服务，包括丙方在甲方的活动行为，乙方有权向甲方收取相应的服务费，服务费包含丙方的绩效费。
3、乙方应当本着甲方利益最大化的原则，勤勉履行本协议，维护甲方形象，不得损害甲方的合法权益。
4、乙方应当按照有关税收政策规定及主管税务机关的要求，向甲方提供的提现申请单列明的丙方代征其个人所得税税款及行政收费（如适用），乙方可在甲方支付的服务费中将该等款项予以扣减后支付给丙方。应乙方要求，丙方应提供与税款申报缴纳相关的协助及信息。甲方支付给乙方相应的服务费后，乙方应当为甲方开具全额发票。
4.1乙方遵守国家法律、行政法规、规章关于委托代征的规定，按照与主管税务机关签署的《委托代征协议书》的规定完成本协议项下约定的代征行为。
4.2乙方应当依法足额及时解缴税款，做到税收票证开具金额与结报税款一致。
4.3乙方应当按照主管税务机关的票证管理规定，领取、保管、出具、结报缴销有关凭证。
4.4乙方在进行本协议项下代征税款时，应向甲方开具乙方主管税务机关提供的税收票证。
4.5因乙方责任未征或少征税款的，由此产生的法律责任由乙方承担，乙方自行处理与主管税务机关之间的责任承担事宜，但乙方将自由职业者拒绝缴纳等情况从自由职业者拒绝之时24小时内报告乙方主管税务机关的除外。
4.6乙方违规多征税款的，如因此致使或自由职业者合法权益受到损失的，由乙方负责赔偿，乙方自行处理与主管税务机关之间的责任承担事宜。
5、乙方发现甲方出现本协议项下第三条第8款之任一行为时，乙方有权立即中止履行本协议，并将甲方的违法行为自发现之时24小时之内向乙方主管税务机关报告。甲方应自行承担由此产生的税务相关的处罚责任，包括但不限于根据税务机关的要求补缴相应的税款、滞纳金等。
6、乙方发现丙方违反本协议项下定义的丙方的权利与义务之规定的，乙方有权中止本协议，并将丙方的违法行为自发现后 24 小时之内向乙方主管税务机关报告。丙方应自行承担由此产生的税务相关的处罚责任，包括但不限于根据税务机关的要求补缴的税款、滞纳金等。
7、乙方为使丙方满足甲方业务需求而向丙方提供的服务，该等服务并不当然导致乙丙双方构成任何劳动/劳务合同关系或其他类似劳动法律关系，乙方对丙方因从事生产经营活动与任一方或第三人所产生的争议不承担任何法律责任。
8、乙方承诺对丙方所披露的个人隐私信息进行保密。
9、乙方可以留存为实现本次合作内容从丙方处获取的丙方个人信息。但是，未经丙方授权，乙方不得将从丙方个人信息披露给任何第三方。
10、乙方承诺将按照相关法律法规的要求，对从丙方处获得的丙方个人信息履行安全保护义务，保障网络免受干扰、破坏或未经授权的访问，防止网络数据泄露或被窃取、篡改。
11、乙方有权检查甲方发布项目及要求乙方提供的服务内容，对违反法律法规、侵害他人合法权益或对他人合法权益产生威胁的项目或服务内容，或甲方、丙方利用乙方提供的服务从事违反国家法律法规及有关部门监管规定活动的，乙方有权采取包括但不限于以下措施中的一项或多项：有权删除或临时中止甲方发布项目，并有权甲方提供合理说明；拒绝提供甲方委托的服务内容；立即删除并对甲方进行封号处理；有权立即解除本协议并要求甲方赔偿乙方由此遭受的全部损失，对于甲方已经支付的平台服务费，乙方不予退还。
12、乙方有权抽查丙方提交的项目成果，对不合法合规、侵害他人合法权益或对他人合法权益产生威胁的、或虚假的项目成果，乙方有权予以立即删除不予支付任何承包款并对丙方、甲方进行封号处理，并有权立即解除本协议。
13、乙方因以下情况没有正确执行甲方委托事项的，不应视为乙方违约，乙方不承担任何责任：
（1）接收到的甲方委托事项有关信息不明确、不完整或无法辨认；
（2）甲方的预存款的余额、或可用资金额度不足；
（3）甲方未按照乙方或乙方的有关平台规则、流程规范等要求操作与执行；
（4）不可抗力或其他不可归因于乙方的情形，包括但不限于网络故障、通讯故障、停电、黑客或病毒侵袭等；
（5）有关部门或国家机关依法命令乙方停止提供服务或停止为甲方服务。
14、对于甲方通过乙方提交的涉嫌违法或涉嫌侵犯他人合法权利或违反本协议的项目成果，乙方可不经通知甲方即予以退回等；对于甲方审核不合格的项目成果，丙方无权向甲方和/或乙方主张支付承包款报酬。
15、乙方有权对甲方、丙方是否涉嫌违反本协议之约定做出认定，并根据认定结果中止、终止向丙方提供服务或采取其他限制措施。
16、为了增进平台用户体验、完善服务内容，乙方将不时提供软件更新服务（该更新可能会采取软件替换、修改、功能强化、版本升级等形式）。为不断优化用户体验，保证服务的安全性与功能的一致性，乙方有权对软件进行更新或对软件的部分功能效果进行改变或限制。

</Text>
                                <Text style={{ marginTop: 10 }}>第五条  丙方的权利与义务
1、丙方有权且应当拒绝违反法律法规的服务内容。
2、丙方保证向甲乙双方提供的信息均是真实的、有效的、合法的，如信息变更应当及时通知甲乙双方。丙方账户信息以其实名提交至甲方平台后台的信息为准，且丙方保证该账户为纳税义务人所有。自乙方将应支付绩效费支付至丙方账户之日起，视为丙方收到前述绩效费。乙方按照甲方后台统计数据完成相关税费缴纳。如因丙方提供信息有误导致付款失败的，丙方独自承担相应责任。
3、丙方承诺，其不是军人、公职人员等国家法律法规和纪律规定禁止从事兼职或者经商的人员以及其他不适用于本协议内容定义的甲方代征范围规定的人员。
4、丙方不得从事违反法律及行政法规等行为，如洗钱、偷税漏税及其他乙方认为不得使用乙方服务的行为等。
5、为实现本协议合作之目的，丙方同意甲方和/或乙方收集丙方的个人信息，包括但不限于丙方姓名、身份证号、收款账户信息、接单数量及费用等。
6、丙方发现甲方、乙方违反法律、行政法规的规定或者双方的约定收集、使用其个人信息的，有权要求其删除其个人信息；发现甲方、乙方收集、存储的其个人信息有错误的，有权要求其予以更正。甲方、乙方应当采取措施予以删除或者更正。
7、丙方承诺，其具有完全民事行为能力，并满足所有履行本协议所需的法定条件或约定条件。
8、丙方承诺，在服务过程中遵守国家法律法规，因丙方个人原因造成其个人或任何第三方损害的责任，由丙方承担全部法律责任，与甲乙双方无关。
9、丙方承诺，其以自由职业者身份从事服务活动，并可以配合甲方或其他相关国家机关提供相关证明文件，其个人所得可由甲方按照本协议向其代征各项税费。
10、丙方确认，其知晓最终支付给丙方的绩效费计算方式，并有权通过乙方向甲方要求支付绩效费。
11、丙方应当本着甲方利益最大化的原则，勤勉履行本协议，维护甲方形象，不得损害甲方的合法权益。
12、因乙丙双方不构成任何劳动/劳务合同关系或其他类似劳动法律关系，乙方没有为丙方购买任何保险的法律义务，丙方自行购买商业保险的，其投保、出险及理赔事宜均与乙方无关。丙方如存在其他异议，务必立即终止与甲方签署任何协议；丙方应当放弃其可获取的服务费，并退还其已获取的服务费所得给甲方;丙方应主动同甲方提出协商与调整合作内容。
13、丙方应排他性地使用于甲方处获得的唯一身份标识，因丙方泄露或提供给他人使用该等身份标识而造成的一切后果，由丙方承担，与甲乙双方无关。
14、丙方自备提供服务所需要的设备设施、自行承担提供服务的必要费用。
15、丙方可自行在甲方处查询服务费计算方式、支付途径等信息，如有异议，可直接与甲方沟通,乙方视情况需要可提供相关协助。
16、丙方知晓并认可乙方仅为提供网络平台信息服务的中间方，丙方与甲方因发布任务、结算等产生的纠纷与乙方无关；因甲方资金问题未按时委托乙方对丙方进行费用结算的，乙方应直接向甲方主张权利并要求承担相应责任。

</Text>
                                <Text style={{ marginTop: 10 }}>第六条  违约责任
1、任何一方违反本协议约定，即构成该方的违约；除本协议另有规定外，违约方应当赔偿守约方因此导致的所有损失（包括但不限于合理的律师费、诉讼费、公证费、保全费、执行费等）以及向守约方支付上述损失费用15%的违约金。
2、本协议有效期内，因国家相关主管部门颁布、变更的法令、政策（包括但不限于监管机构向乙方出具的，要求停止或整改本协议约定的业务的书面通知等，下同）导致乙方不能提供约定服务的，不视为乙方违约，双方应根据相关的法令、政策变更本协议内容。
3、如一方违反本协议约定的禁止性规定（禁止性规定，是指协议条款中含有“不得”、“不能”等表述的内容，不可抗力条款中的表述除外），守约方有权单方提前终止协议。
4、甲方、丙方不论采取何种方式非法获取乙方系统数据、利用乙方谋取不正当利益或从事非法活动的，乙方有权追究违约责任。
5、甲方、丙方违反本协议约定对任意第三方造成损害的，甲方、丙方均应当以自己的名义独立承担所有的法律责任，并应确保乙方、乙方、甲方免于因此产生损失或增加费用。如甲方、丙方该等行为使乙方、乙方、甲方遭受任何损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，甲方、丙方应当赔偿以上主体因此遭受的全部损失（即直接损失及签订本协议时所能预见到的损失）和/或发生的费用，包括合理的律师费用、调查取证费用等。
6、甲方或丙方提交的任务信息须符合法律法规规定，出现以下任一情形时，乙方有权随时停止甲方或丙方相关账户的服务，有权解除本协议，并应由违约方承担因下述事宜造成的全部损失；
1) 甲方或丙方不再满足入驻条件的；
2) 甲方或丙方提供虚假资质文件的；
3) 甲方或丙方执行项目错误或虚假业务，导致乙方受到或面临行政处罚、争议或纠纷的；
4) 甲方或丙方提交的项目信息含有可能危害国家安全、破坏民族团结及宗教政策、宣扬邪教迷信、淫秽色情、虚假、侮辱、诽谤、恐吓或骚扰、涉嫌非法集资、侵犯他人知识产权、商业秘密、人身权或其他合法权益等违法或有违社会公序良俗的信息。

</Text>
                                <Text style={{ marginTop: 10 }}>第七条  声明
1、甲方与乙方之间，均不因本协议的存在而成立劳动关系、劳务关系、雇佣关系、代理关系等非平台服务合同关系，甲方将发布的项目转包给乙方，乙方承接项目订单后可以另行与丙方签署项目转包协议，双方确定乙方无须为甲方和/或接活团队各成员交纳社会保险及意外伤害等商业保险，但各方另有书面约定除外。同时，乙方强烈建议甲方为自己及丙方团队各成员购买商业保险。丙方和/或接活团队成员在执行任务期间受到或对任何第三方造成人身、财产伤害，甲方应自行承担后果，不得要求乙方承担侵权等赔偿责任。
2、甲方基于乙方发生的任何商业行为所引起的一切法律纠纷由甲方自行承担，与乙方无关。但乙方会积极配合甲方处理相关事宜以促进各项事宜的解决。
3、乙方在本合作协议项下的任何权利不因其发生收购、兼并、重组而发生变化；如乙方被收购、被兼并、被重组，则乙方在本合作协议项下的权利随之转移至收购、兼并或重组之单位。
4、乙方有权对甲方的发布的项目或委托服务内容进行审查，乙方有权要求甲方按照乙方的要求进行核查，甲方应当配合并按照乙方的要求予以改正；乙方的上述审核行为并不意味着乙方对甲方的经营资质、任务、交易或甲方自行上传在乙方的其他信息的真实性、准确性、合法性、有效性承担任何明示或暗示的保证或担保等责任，也不意味着乙方和/或乙方成为甲方与丙方之间的参与方，因甲方的行为导致的任何投诉、纠纷、争议、赔偿等甲方应以自己的名义独立沟通与解决，并承担全部相应责任，乙方可给予甲方提供必要配合，但乙方不承担由此产生的任何法律责任。
5、本协议任何一方已披露签署和履行本协议所应当向其余各方披露的全部信息，且披露内容真实、准确、无遗漏。协议各方同时声明和承诺：本协议的签署和履行不与本协议任何一方已经签署的协议或需承担的任何义务相冲突，且也不会对本协议任何一方以外的第三方形成任何法律和商业上的冲突。
6、甲方及丙方保证向乙方提供的文件或其他相关证明真实、合法、准确、有效，并保证上述证明文件或其他相关证明发生任何变更、更新、撤销或注销之日起十日内书面通知乙方；若因丙方提交虚假、过期文件或未及时更新或通知证明文件导致纠纷或被相关国家机关处罚的，由丙方独立承担全部法律责任，如因此造成工薪易（包括工薪易代理人或职员）或其他任何相关方损失的，丙方应当承担全部的赔偿责任。

</Text>
                                <Text style={{ marginTop: 10 }}>第八条  保密责任
1、本协议任何一方应对本协议所涉及的所有内容以及协议各方在执行本协议过程中相关的一切法律、商业、合作业务的所有资讯进行保密。未经对方允许，均不得向各方以外的任意第三方披露。
2、保密期限应为：协议的有效期内及协议终止之后的十年。

</Text>
                                <Text style={{ marginTop: 10 }}>第九条  适用法律、争议及纠纷解决和司法管辖
本协议的订立、执行和解释及争议的解决均应适用中国法律。凡因本协议引起的或与本协议有关的任何争议，协议各方应友好协商解决。如不能协商解决，协议各方一致同意提交至乙方所在地有管辖权的人民法院诉讼解决。

</Text>
                                <Text style={{ marginTop: 10 }}>第十条  补充协议及附件
协议各方同意，在本协议签订后，如另有补充协议，该等补充协议及附件构成本协议不可分割的组成部分，具有同等法律效力。

</Text>
                                <Text style={{ marginTop: 10 }}>第十一条  权利的行使
在本协议的任意一方或几方未能及时行使本协议项下的权利不应被视为放弃该权利，也不影响该方在将来行使该权利。

</Text>
                                <Text style={{ marginTop: 10 }}>第十二条  通知和送达
1、除本协议另有约定外，在履行本协议过程中的一切通知，各方均应以挂号信、EMS或快递方式，发送至本协议首部所列的各方地址。各方均保证该地址是其可以随时送达通知的地址。该地址发生变更时，变更方应立即以书面形式通知其他各方变更后的地址。以挂号信、EMS或快递发出的，在邮戳日/妥投日的5日后视为送达。
2、任何一方未能及时书面通知对方地址变更的有关事宜，其他各方向其原提供的地址进行邮寄的，按照前款规定，在邮戳日/妥投日之5日后的日期视为已经进行了送达。

</Text>
                                <Text style={{ marginTop: 10 }}>第十三条  协议生效及有效期
本协议自勾选“我已阅读并同意《工薪易平台共享经济（自由职业者服务）协议》”即视为接受本协议约定的全部内容，以及与本协议有关的已经发布或将来可能发布的各项协议、规则、说明、页面展示、操作流程、公告或通知。有效期限2年，协议到期前1个月内协议各方均未以书面方式提出异议的，则本协议有效期自动顺延2年。

</Text>
                                <Text style={{ marginTop: 10 }}>签署声明：各方充分知悉且已理解本协议全部内容，各方均保证下列之签名者和/或网络流程操作者已获有效授权并足以代表各方订立本协议。

</Text>
                            </View>
                        </ScrollView> */}
                        <TouchableOpacity style={{ width: deviceWidth - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', position: 'absolute', bottom: 10, right: 20, borderRadius: 5 }} onPress={() => this.setState({ modalVisible: false, read: true })}><View><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>同意并继续</Text></View></TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }

    save() {
        var reg = /^\d+(\.\d{0,2})?$/;
        var numReg = /^[0-9]*$/
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
        } else if (numReg.test(this.state.salary) == false) {
            Toast.showInfo('请填写正确的发包金额', 1000);
            return
        }
        else if (this.state.workEndTime == '') {
            Toast.showInfo('请选择用工结束时间', 1000);
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
        else if (this.state.diqu == '选择地区') {
            Toast.showInfo('请选择工作地区', 1000);
            return
        }
        else if (this.state.remark2 == '') {
            Toast.showInfo('请填写发包内容', 1000);
            return
        }
        else if (this.state.dictdataValue == '选择发包标签') {
            Toast.showInfo('请选择发包标签', 1000)
            return;
        }
        else if (this.state.jobDescription == '') {
            Toast.showInfo('请填写发包需求', 1000);
            return
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
            id: this.state.UUID,
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
            remark2: this.state.remark2,
            jobDescription: this.state.jobDescription,
            servingRequire: this.state.servingRequire,
            remark: this.state.remark,
            CHECK_STATUS: '1',
            creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            remark3: this.state.dictdataName,
            ratio: this.state.ratio,
            realMoney: ((parseFloat(this.state.salary) * parseFloat(this.state.ratio) / 100) + parseFloat(this.state.salary) + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2),
            // + parseFloat(this.state.salary) * parseFloat((this.state.Fwf / 100))).toFixed(2),
            address: this.state.address,
            remark4: this.state.settlement,
            electronicBusinessLicense: this.state.electronicBusinessLicense,
            serviceMoneyBl: this.state.Fwf
        }
        Alert.alert("提示", "请您确认好发包内容"
            , [
                {
                    text: "我再看看", onPress: () => {
                    }
                },
                {
                    text: "继续", onPress: () => {
                        Fetch.postJson(Config.mainUrl + '/temporaryWork/issueJobApp', temp)
                            .then((res) => {
                                Toast.showInfo('发包成功', 1000);
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

