/**
 * 新增岗位
 * 伍钦
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, Modal, KeyboardAvoidingView } from 'react-native';
import { NavigationBar, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
import { Checkbox, List, Picker } from 'antd-mobile-rn';
import DatePicker from 'react-native-datepicker';
import px2dp from '../../utils/px2dp';
import ListViewChooseContainer from '../../utils/ListViewChooseContainer';
import illegalDeal from '../../utils/illegalDeal'
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
const CheckboxItem = Checkbox.CheckboxItem;
var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
var data_fangshi = [
    { value: "兼职", label: "兼职" },
    { value: "抢单", label: "抢单" },
]

var data_payment = [
    { value: "2000以下", label: "2000以下" },
    { value: "2000-3000", label: "2000-3000" },
    { value: "3000-4500", label: "3000-4500" },
    { value: "4500-6000", label: "4500-6000" },
    { value: "6000-8000", label: "6000-8000" },
    { value: "8000-10000", label: "8000-10000" },
    { value: "10000以上", label: "10000以上" },
    { value: "面议", label: "面议" },
    { value: "不限", label: "不限" },
]
export default class AddNewJob extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            addressDetailed: (this.props.detailedAddress == undefined) ? '' : this.props.detailedAddress,
            salaryRange_XS: (this.props.salaryRange_XS == undefined) ? '' : this.props.salaryRange_XS,//薪资显示值
            zxyqList: [],
            zxyqList_source: [],
            keyboardHeight: '', // 键盘高度
            M: (this.props.sex == "男") ? true : false,
            W: (this.props.sex == "女") ? true : false,
            Phone: (this.props.telphone == undefined) ? "" : this.props.telphone,
            Sfz: (this.props.idNum == undefined) ? '' : this.props.idNum,
            BornDate: (this.props.birthday == undefined) ? "" : this.props.birthday,
            BornDate_new: (this.props.birthday == undefined) ? "" : this.props.birthday,
            nativePlace: (this.props.nativePlace == undefined) ? "" : this.props.nativePlace,
            Email: '',
            Time: '',
            modalVisible: false,
            Gzjl: '',
            Zwpj: '',
            imageSource: '',
            dataBlob: [],
            nianlingList: [],
            rightTitle: "修改",
            urgenPerson: '',
            urgenPersonRelation: '',
            urgenPhone: '',
            bankCardnum: '',
            OPENBANK_ZH: '',
            educateFrom: '',
            profession: '',
            homeAddress: '',
            workExperience: [],
            showPop: true,
            reportList: [],
            uuid: UUID.v4(),
            visibleReferees: false,
            selected: false,
            id: '',
            zcList: [],
            jzList: [],
            zwList: [],
            gwList: [],
            nianxianList: [],
            provinceList: [],
            professionCertificate: '',
            partTime: '',
            postCode: '',
            workTime1: (this.props.WORK_TIME1 == undefined) ? '' : this.props.WORK_TIME1,
            workTime2: (this.props.WORK_TIME2 == undefined) ? '' : this.props.WORK_TIME2,
            chooseTime: this.props.workTime == 'RYSJ' ? true : false,
            ifShowZczj: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
            ifShowZw: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }
                , { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }
                , { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
            data_education: [],


            positionName: (this.props.positionName == undefined) ? '' : this.props.positionName,//职位名称
            recruitNumber: (this.props.recruitNumber == undefined) ? '' : this.props.recruitNumber,//招聘人数
            releaseCompanyName: (this.props.releaseCompanyName == undefined) ? '' : this.props.releaseCompanyName,//单位
            servingRequire: (this.props.servingRequire == undefined) ? '' : this.props.servingRequire,//要求
            remark: (this.props.remark == undefined) ? '' : this.props.remark,//备注

            workMode: (this.props.workMode == undefined) ? '' : this.props.workMode,
            workMode_nochange: (this.props.workMode == undefined) ? '' : this.props.workMode,
            positionKind: (this.props.positionKind == undefined) ? '' : this.props.positionKind,
            positionKind_nachange: (this.props.positionKind == undefined) ? '' : this.props.positionKind,
            ageRequire: (this.props.ageRequire == undefined || this.props.ageRequire == '') ? '不限' : this.props.ageRequire,
            ageRequire_nochange: (this.props.ageRequire == undefined || this.props.ageRequire == '') ? '不限' : this.props.ageRequire,
            educationRequire: (this.props.educationRequire == undefined || this.props.educationRequire == '') ? '不限' : this.props.educationRequire,
            educationRequire_nochange: (this.props.educationRequire == undefined || this.props.educationRequire == '') ? '不限' : this.props.educationRequire,
            salaryRange: (this.props.salaryRange == undefined) ? '' : this.props.salaryRange,//真实值
            salaryRange_nochange: (this.props.salaryRange == undefined) ? '' : this.props.salaryRange,
            workYears: (this.props.workYears == undefined || this.props.workYears == '') ? '不限' : this.props.workYears,
            workYears_nochange: (this.props.workYears == undefined || this.props.workYears == '') ? '不限' : this.props.workYears,
            hourSalary: (this.props.hourSalary == undefined) ? '' : this.props.hourSalary,
            hourSalary_nochange: (this.props.hourSalary == undefined) ? '' : this.props.hourSalary,

            workDay: (this.props.workDay == undefined) ? '' : this.props.workDay,
            workEndTime: (this.props.workEndTime == undefined) ? '' : this.timeChange(this.props.workEndTime),
            workEndTime_nochange: (this.props.workEndTime == undefined) ? '' : this.props.workEndTime,
            ifchangeEndTime: false,
            ifchangeStartTime: false,

            ifchangeworMode: false,
            ifchangepositionKind: false,
            ifchangesalaryRange: false,
            ifchangeageRequire: false,
            ifchangeeducationRequire: false,
            ifchangeworkYears: false,

            workStartTime: (this.props.workStartTime == undefined) ? '' : this.timeChange(this.props.workStartTime),
            workStartTime_nochange: (this.props.workStartTime == undefined) ? '' : this.props.workStartTime,
            diqu: (this.props.diqu == '' || this.props.diqu == undefined) ? "点我选择地区" : this.props.diqu,
            positionProvinceName: (this.props.positionProvinceName == undefined) ? '' : this.props.positionProvinceName,
            positionProvince: (this.props.positionProvince == undefined) ? '' : this.props.positionProvince,//
            positionCityName: (this.props.positionCityName == undefined) ? '' : this.props.positionCityName,
            positionCity: (this.props.positionCity == undefined) ? '' : this.props.positionCity,
            positionAreaName: (this.props.positionAreaName == undefined) ? '' : this.props.positionAreaName,
            positionArea: (this.props.positionArea == undefined) ? '' : this.props.positionArea,
            createTime: (this.props.createTime == undefined) ? Date.parse(new Date()) : this.props.createTime,
            // ifShowJz: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
            ifShowJz: (this.props.workTime == undefined) ? [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }] :
                [{ show: this.props.workTime.indexOf("0") != -1 ? true : false }, { show: this.props.workTime.indexOf("SW") != -1 ? true : false },
                { show: this.props.workTime.indexOf("XW") != -1 ? true : false }, { show: this.props.workTime.indexOf("WS") != -1 ? true : false },
                { show: this.props.workTime.indexOf("RYSJ") != -1 ? true : false }, { show: this.props.workTime.indexOf("5") != -1 ? true : false }, { show: this.props.workTime.indexOf("6") != -1 ? true : false }],
            id: (this.props.id == undefined) ? UUID.v4() : this.props.id,
        };
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=岗位类别', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                var data_education = [];
                var gwList = JSON.parse(json).result;
                for (let i in gwList) {
                    if (!gwList[i].dictdataIsdefault) {
                        data_education.push({ value: gwList[i].dictdataValue, label: gwList[i].dictdataValue, dictdataName: gwList[i].dictdataName })
                    }
                }
                this.setState({
                    gwList: data_education
                })
                console.log(gwList)
                fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=学历', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => res.text())
                    .then((json) => {
                        var data_education = [];
                        var xlList = JSON.parse(json).result;
                        for (let i in xlList) {
                            if (!xlList[i].dictdataIsdefault) {
                                data_education.push({ value: xlList[i].dictdataValue, label: xlList[i].dictdataValue, dictdataName: xlList[i].dictdataName })
                            }
                        }
                        this.setState({
                            data_education: data_education
                        })
                        //年龄要求
                        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=年龄要求', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((res) => res.text())
                            .then((json) => {
                                var data_education = [];
                                var nianlingList = JSON.parse(json).result;
                                for (let i in nianlingList) {
                                    if (!nianlingList[i].dictdataIsdefault) {
                                        data_education.push({ value: nianlingList[i].dictdataValue, label: nianlingList[i].dictdataValue, dictdataName: nianlingList[i].dictdataName })
                                    }
                                }
                                this.setState({
                                    nianlingList: data_education
                                })
                                //工作年限
                                fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=工作年限', {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then((res) => res.text())
                                    .then((json) => {
                                        var data_education = [];
                                        var nianxianList = JSON.parse(json).result;
                                        for (let i in nianxianList) {
                                            if (!nianxianList[i].dictdataIsdefault) {
                                                data_education.push({ value: nianxianList[i].dictdataValue, label: nianxianList[i].dictdataValue, dictdataName: nianxianList[i].dictdataName })
                                            }
                                        }
                                        this.setState({
                                            nianxianList: data_education
                                        })
                                        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=兼职情况', {
                                            method: 'GET',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        }).then((res) => res.text())
                                            .then((json) => {
                                                this.setState({
                                                    jzList: JSON.parse(json).result
                                                })
                                            })
                                    })
                                //省
                                fetch(Config.mainUrl + '/ws/province?dictTypeName=省', {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then((res) => res.text())
                                    .then((json) => {
                                        var data_education = [];
                                        var provinceList = JSON.parse(json);
                                        for (let i in provinceList) {
                                            if (!provinceList[i].dictdataIsdefault) {
                                                data_education.push({ value: provinceList[i].ID, label: provinceList[i].NAME })
                                            }
                                        }
                                        this.setState({
                                            provinceList: data_education
                                        })
                                    })
                            })
                    })
            })

    }
    // 监听键盘弹出与收回
    componentDidMount() {
        this.getXZYQ()
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
    }
    //注销监听
    componentWillUnmount() {
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
        // this.setState = (state, callback) => {//不起作用
        //     return;
        // };
    }
    //键盘弹起后执行
    keyboardDidShow = (e) => {
        // this._scrollView.scrollTo({x:0, y:100, animated:true});
        this.setState({
            keyboardHeight: e.endCoordinates.height
        })
    }

    //键盘收起后执行
    keyboardDidHide = () => {
        // this._scrollView.scrollTo({x:0, y:0, animated:true});
        this.setState({
            keyboardHeight: 0
        })
    }
    getXZYQ() {//获取薪资要求字典
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=薪资要求', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                var array = [];
                var arrayResult = JSON.parse(json).result;
                for (let i in arrayResult) {
                    if (!arrayResult[i].dictdataIsdefault) {
                        array.push({ value: JSON.stringify(arrayResult[i]), label: arrayResult[i].dictdataValue })
                    }
                }
                this.setState({
                    zxyqList: array,
                    zxyqList_source: arrayResult
                })
            })
    }
    //协议
    ifAgree() {
        if (this.state.selected) {
            this.setState({ selected: !this.state.selected })
        } else {
            this.setState({ selected: !this.state.selected, modalVisible: !this.state.modalVisible })
        }

    }
    _back() {
        Actions.pop();
    }
    onChange_nianling = (value) => {
        this.setState({ ageRequire: value[0], ifchangeageRequire: true });
    }
    onChange_fangshi = (value) => {
        this.setState({ workMode: value[0], ifchangeworMode: true });
    }
    onChange_leibie = (value) => {
        this.setState({ positionKind: value[0], ifchangepositionKind: true });
    }
    onChange_education = (value) => {
        this.setState({ educationRequire: value[0], ifchangeeducationRequire: true });
    }
    onChange_payment = (value) => {
        //this.setState({ salaryRange: value[0], ifchangesalaryRange: true });
        let values = JSON.parse(value[0])
        this.setState({
            salaryRange: values.dictdataName,
            salaryRange_XS: values.dictdataValue,
            ifchangesalaryRange: true
        });
    }
    onChange_nianxian = (value) => {
        this.setState({ workYears: value[0], ifchangeworkYears: true });
    }

    toTimeStamp(time) {
        // 将指定日期转换为时间戳。
        var t = time;  // 月、日、时、分、秒如果不满两位数可不带0.
        var T = new Date(t);  // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
        return T.getTime()  // 将转换后的标准日期转换为时间戳。

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>{this.props.style == '1' ? "职位修改" : "新增岗位"}</Text>
                    </View>
                    {/* <TouchableOpacity style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => this.save()}>
                        <Text style={{ color: 'white' }}>{(this.state.id == '') ? "提交" : "保存"}</Text>
                    </TouchableOpacity> */}
                </ImageBackground>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={-this.state.keyboardHeight}>
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
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>职位名称</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.positionName}
                                            placeholder='请输入职位名称'
                                            onChangeText={(text) => { this.setState({ positionName: text }) }}
                                        />
                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>招聘人数</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.recruitNumber}
                                            placeholder='请输入招聘人数'
                                            onChangeText={(text) => { this.setState({ recruitNumber: illegalDeal.ifillegalNum(text) }) }}
                                        />
                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>用工单位</Text>
                                        </View>
                                        <TextInput
                                            style={{ paddingVertical: 0, flex: 1, maxHeight: deviceHeigth / 3, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            multiline
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            numberOfLines={2}
                                            maxLength={20}
                                            value={this.state.releaseCompanyName}
                                            placeholder='选填'
                                            onChangeText={(text) => { this.setState({ releaseCompanyName: text }) }}
                                        />
                                    </View>

                                    {/* <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>任职要求</Text>
                                    </View>
                                    <TextInput
                                        style={{ paddingVertical: 20, flex: 1, maxHeight: deviceHeigth / 3, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        multiline
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        numberOfLines={20}
                                        maxLength={200}
                                        value={this.state.servingRequire}
                                        placeholder='选填'
                                        onChangeText={(text) => { this.setState({ servingRequire: text }) }}
                                    />
                                </View> */}


                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>备         注</Text>
                                        </View>
                                        <TextInput
                                            style={{ paddingVertical: 0, flex: 1, maxHeight: deviceHeigth / 3, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            multiline
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            numberOfLines={20}
                                            maxLength={200}
                                            value={this.state.remark}
                                            placeholder='选填'
                                            onChangeText={(text) => { this.setState({ remark: text }) }}
                                        />
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10 }}>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>任职要求</Text>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', height: deviceHeigth / 6, marginRight: 4 }}>
                                            <TextInput
                                                style={{ flex: 1, color: "#999", textAlign: 'right', marginRight: 4, }}
                                                placeholderTextColor={'#808080'}
                                                value={this.state.servingRequire}
                                                multiline={true}
                                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                                placeholder='选填'
                                                placeholderTextColor="#c4c4c4"
                                                numberOfLines={20}
                                                onChangeText={(text) => { this.setState({ servingRequire: text }) }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ width: Dimensions.get('window').width - 32, height: 44 }}>
                                        <List >
                                            <Picker
                                                data={data_fangshi}
                                                cols={1}
                                                value={{ label: this.state.workMode, value: this.state.workMode }}
                                                onChange={this.onChange_fangshi}
                                                extra={this.state.workMode}
                                            >
                                                <List.Item arrow="horizontal"    >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 8 }}>工作方式</Text>
                                                    </View>
                                                </List.Item>
                                            </Picker>
                                        </List>
                                    </View>

                                    <View style={{ width: Dimensions.get('window').width - 32, height: 44 }}>
                                        <List >
                                            <Picker
                                                data={this.state.gwList}
                                                cols={1}
                                                value={{ label: this.state.positionKind, value: this.state.positionKind }}
                                                onChange={this.onChange_leibie}
                                                extra={this.state.positionKind}
                                            >
                                                <List.Item arrow="horizontal"  >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 8 }}>职位类别</Text>
                                                    </View>
                                                </List.Item>
                                            </Picker>
                                        </List>
                                    </View>



                                    {(this.state.workMode == '抢单' || this.state.workMode == '全日制') || this.state.workMode == '' ?
                                        <View style={{ width: Dimensions.get('window').width - 32, height: 44, }}>
                                            <List >
                                                <Picker
                                                    data={this.state.zxyqList}
                                                    cols={1}
                                                    //value={{ label: this.state.salaryRange, value: this.state.salaryRange }}
                                                    onChange={this.onChange_payment}
                                                    extra={this.state.salaryRange_XS}
                                                >
                                                    <List.Item arrow="horizontal" onPress={this.qjlx}   >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                                            <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 8 }}>薪资范围</Text>
                                                        </View>
                                                    </List.Item>
                                                </Picker>
                                            </List>
                                        </View>
                                        :
                                        (this.state.workMode == '兼职') || (this.state.workMode == '合伙人') ?
                                            this.fqrz()
                                            :
                                            null
                                    }

                                    < View style={{ width: Dimensions.get('window').width - 32, height: 44 }}>
                                        <List >
                                            <Picker
                                                data={this.state.nianlingList}
                                                cols={1}
                                                value={{ label: this.state.ageRequire, value: this.state.ageRequire }}
                                                onChange={this.onChange_nianling}
                                                extra={this.state.ageRequire}
                                            >
                                                <List.Item arrow="horizontal"  >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 8 }}>年龄要求</Text>
                                                    </View>
                                                </List.Item>
                                            </Picker>
                                        </List>
                                    </View>


                                    <View style={{ width: Dimensions.get('window').width - 32, height: 44 }}>
                                        <List >
                                            <Picker
                                                data={this.state.data_education}
                                                cols={1}
                                                value={{ label: this.state.educationRequire, value: this.state.educationRequire, dictdataName: this.state.dictdataName }}
                                                onChange={this.onChange_education}
                                                extra={this.state.educationRequire}
                                            >
                                                <List.Item arrow="horizontal">
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>学历要求</Text>
                                                    </View>
                                                </List.Item>
                                            </Picker>
                                        </List>
                                    </View>

                                    <View style={{ width: Dimensions.get('window').width - 32, height: 44 }}>
                                        <List >
                                            <Picker
                                                data={this.state.nianxianList}
                                                cols={1}
                                                value={{ label: this.state.workYears, value: this.state.workYears, dictdataName: this.state.workYears }}
                                                onChange={this.onChange_nianxian}
                                                extra={this.state.workYears}
                                            >
                                                <List.Item arrow="horizontal">
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>工作年限</Text>
                                                    </View>
                                                </List.Item>
                                            </Picker>
                                        </List>
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
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>详细地址</Text>
                                        </View>
                                        <TextInput
                                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.addressDetailed}
                                            placeholder='请输入详细地址'
                                            onChangeText={(text) => { this.setState({ addressDetailed: text }) }}
                                        />
                                    </View>
                                    {(this.state.workMode == '抢单' || this.state.workMode == '全日制') || this.state.workMode == '' ? null : <View>
                                        <List>
                                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                <VectorIcon name={"ios-timer"} size={18} color={'red'} style={{ backgroundColor: 'transparent', marginTop: 12, marginLeft: 8 }} />
                                                <Text style={{ marginTop: 12, fontSize: Config.MainFontSize, marginLeft: 3 }}>工作时间（非必选）</Text>
                                                <View>
                                                </View>
                                            </View>
                                            {this.jianzhi()}
                                            {this.state.chooseTime == true ?
                                                <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', margin: 10 }}>
                                                    <Text style={{ color: "black", fontSize: px2dp(12), alignSelf: 'center' }}>时间选择</Text>
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <DatePicker
                                                            date={this.state.workTime1}
                                                            mode="time"
                                                            placeholder="开始时间"
                                                            placeholderColor='red'
                                                            format="HH:mm"
                                                            showIcon={false}
                                                            customStyles={{
                                                                dateInput: {
                                                                    marginLeft: 50
                                                                }
                                                            }}
                                                            minuteInterval={10}
                                                            onDateChange={(workTime1) => { this.setState({ workTime1: workTime1 }); }}
                                                        />
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <DatePicker
                                                            date={this.state.workTime2}
                                                            mode="time"
                                                            placeholder="结束时间"
                                                            placeholderColor='red'
                                                            format="HH:mm"
                                                            showIcon={false}
                                                            customStyles={{
                                                                dateInput: {
                                                                    marginLeft: 50
                                                                }
                                                            }}
                                                            minuteInterval={10}
                                                            onDateChange={(workTime2) => { this.setState({ workTime2: workTime2 }); }}
                                                        />
                                                    </View>
                                                </View>
                                                : null}
                                        </List>
                                    </View>}

                                </View>

                            </View>
                            <View style={{ width: deviceWidth - 18, height: 10, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                        </View>

                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })} style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 10 }} >
                                <Text style={{ color: 'grey', fontSize: Config.MainFontSize - 2 }}>我已阅读并同意</Text><View ><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize - 2 }}>“工薪易”平台发送内容规范</Text></View>
                                <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.selected == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                            </TouchableOpacity>
                        </View>
                        {(this.state.selected) ? <TouchableOpacity style={{ marginTop: 20, marginBottom: 30 }} onPress={() => {
                            this.save()
                        }}>
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'rgb(65,143,234)',
                                width: Dimensions.get('window').width / 1.3,
                                height: 44,
                                marginTop: 10,
                                borderRadius: 20,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: Config.MainFontSize,
                                    color: '#ffffff'
                                }}>{(this.state.id == '') ? "提交" : "保存"}</Text>
                            </View>
                        </TouchableOpacity> : <TouchableOpacity style={{ marginTop: 20, marginBottom: 30 }} onPress={() => {
                            Toast.showInfo('请先同意“工薪易”平台发送内容规范', 1000)
                        }}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    width: Dimensions.get('window').width / 1.3,
                                    height: 44,
                                    marginTop: 10,
                                    borderRadius: 20,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize,
                                        color: '#ffffff'
                                    }}>{(this.state.id == '') ? "提交" : "保存"}</Text>
                                </View>
                            </TouchableOpacity>}
                        <ListViewChooseContainer
                            visible={this.state.visibleReferees}
                            top={deviceHeigth / 2 - 100}//这个用来控制与顶部距离
                            theme={'diqu'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                            onCancel={() => { this.setState({ visibleReferees: false }); return null; }}
                            callbackData={(data) => this.choose(data)} />
                        {this.zerenModal()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
        );
    }
    fqrz() {
        return (
            <View>
                <View style={styles.first}>
                    <View style={{ width: 5 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>{(this.state.workMode == '合伙人') ? "薪资/月" : "薪资/小时"}</Text>
                    </View>
                    <TextInput
                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        keyboardType='numeric'
                        placeholderTextColor="#c4c4c4"
                        value={this.state.hourSalary}
                        placeholder='(元)'
                        onChangeText={(text) => { this.setState({ hourSalary: illegalDeal.ifillegalNum(text) }) }}
                    />
                </View>
                <View style={styles.first}>
                    <View style={{ width: 5 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>每日工作时长</Text>
                    </View>
                    <TextInput
                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                        underlineColorAndroid="transparent"
                        secureTextEntry={false}
                        keyboardType='numeric'
                        placeholderTextColor="#c4c4c4"
                        value={this.state.workDay}
                        placeholder='(小时)'
                        onChangeText={(text) => { this.setState({ workDay: illegalDeal.ifillegalNum_workhour(text) }) }}
                    />
                </View>
                <View style={styles.first}>
                    <View style={{ width: 5 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>用工开始时间</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <DatePicker
                            date={this.state.workStartTime}
                            mode="date"
                            placeholder={"选择时间"}
                            placeholderColor='red'
                            format="YYYY-MM-DD"
                            // minDate={new Date()}
                            showIcon={false}
                            customStyles={{
                                dateInput: {
                                    borderColor: '#fff',
                                    backgroundColor: '#fff', marginLeft: 50
                                }
                            }}
                            minuteInterval={10}
                            onDateChange={(workStartTime) => { this.setState({ workStartTime: workStartTime, ifchangeStartTime: true }); }}
                        />
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
                            onDateChange={
                                this.pddata.bind(this)
                            }
                        />
                    </View>
                </View>
            </View>
        )
    }
    save() {
        var date = new Date(this.state.workEndTime);
        var time = Date.parse(date);
        var date1 = new Date(this.state.workStartTime);
        var time1 = Date.parse(date1);

        //  var   differ = parseInt((time2 - dates) / (1000 * 60))

        if (time != '' && time != '' && time <= time1) {
            Toast.showInfo('结束时间不能小于开始时间', 1000)
            return
        } else {
            var temp1 = '';
            if (UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false') {
                Toast.showInfo('请去电脑端完善企业信息', 1000);
                return
            } else {
                for (let i in this.state.ifShowJz) {
                    if (this.state.ifShowJz[i].show) {
                        if (i == 1) {
                            temp1 = 'SW,'
                            // temp1.push("SW,")
                        } else if (i == 2) {
                            // temp1.push("XW,")
                            temp1 = temp1 + "XW,"
                        } else if (i == 3) {
                            temp1 = temp1 + "WS"
                        } else {
                            // temp1.push("RYSJ")
                            temp1 = "RYSJ"
                        }
                    }
                }
                var temp = '';
                if (this.state.workMode == '') {
                    Toast.showInfo('请选择工作方式', 1000);
                    return
                } else if (this.state.positionName == '') {
                    Toast.showInfo('请填写职位名称', 1000);
                    return
                }
                else if (this.state.recruitNumber == '') {
                    Toast.showInfo('请填写招聘人数', 1000);
                    return
                } else if (this.state.positionKind == '') {
                    Toast.showInfo('请选择职位类别', 1000);
                    return
                } else if (this.state.addressDetailed == '') {
                    Toast.showInfo('请输入详细地址', 1000);
                    return
                } else if (this.state.diqu == '点我选择地区') {
                    Toast.showInfo('请选择工作地区', 1000);
                    return
                }
                if (this.state.workMode == '全日制' || this.state.workMode == '抢单') {
                    if (this.state.salaryRange == '') {
                        Toast.showInfo('请选择薪资范围', 1000);
                        return
                    }
                    temp = {
                        creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        createTime: this.state.createTime,//获取当前时间戳
                        updateTime: Date.parse(new Date()),//获取当前时间戳
                        id: this.state.id,
                        positionName: this.state.positionName,//职位名称，必填
                        recruitNumber: this.state.recruitNumber,//招聘人数，必填
                        releaseCompanyName: this.state.releaseCompanyName,//用工单位，选填
                        servingRequire: this.state.servingRequire,//用工要求，选填
                        remark: this.state.remark,//备注，选填

                        workMode: (this.state.ifchangeworMode) ? this.state.workMode : this.state.workMode_nochange,
                        positionKind: (this.state.ifchangepositionKind) ? this.state.positionKind : this.state.positionKind_nachange,
                        salaryRange: (this.state.ifchangesalaryRange) ? this.state.salaryRange : this.state.salaryRange_nochange,
                        ageRequire: (this.state.ifchangeageRequire) ? this.state.ageRequire == '' ? '不限' : this.state.ageRequire : this.state.ageRequire_nochange,
                        educationRequire: (this.state.ifchangeeducationRequire) ? this.state.educationRequire == '' ? '不限' : this.state.educationRequire : this.state.educationRequire_nochange,
                        workYears: (this.state.ifchangeworkYears) ? this.state.workYears == '' ? '不限' : this.state.workYears : this.state.workYears_nochange,

                        positionProvinceName: this.state.positionProvinceName,//地区，选填
                        positionProvince: this.state.positionProvince,//地区，选填
                        positionCityName: this.state.positionCityName,//地区，选填
                        positionCity: this.state.positionCity,//地区，选填
                        positionAreaName: this.state.positionAreaName,//地区，选填
                        positionArea: this.state.positionArea,//地区，选填
                        // workTime: temp1,//工作时间，选填

                        positionStatus: this.props.positionStatus == undefined ? null : this.props.positionStatus,//岗位发布状态
                        detailedAddress: this.state.addressDetailed,//详细地址 ，必填
                    }

                }
                if (this.state.workMode == '兼职' || this.state.workMode == '合伙人') {
                    if (this.state.hourSalary == '') {
                        Toast.showInfo('请填写薪资', 1000);
                        return
                    }
                    if (this.state.positionKind == '') {
                        Toast.showInfo('请选择职位类别', 1000);
                        return
                    }
                    if (this.state.workDay == '') {
                        Toast.showInfo('请填写每日工作时长', 1000);
                        return
                    }
                    if (this.state.workStartTime == '') {
                        Toast.showInfo('请选择用工开始时间', 1000);
                        return
                    }
                    if (this.state.workEndTime == '') {
                        Toast.showInfo('请选择用工结束时间', 1000);
                        return
                    }
                    if (this.state.partTime == '任意时间') {
                        if (this.state.workTime1 == '' || this.state.workTime2 == '') {
                            Toast.showInfo('请选择工作时间段', 1000);
                            return
                        }
                    }
                    var workTime1 = this.state.workStartTime + ' ' + this.state.workTime1;
                    var workTime2 = this.state.workStartTime + ' ' + this.state.workTime2;
                    temp = {
                        creatorId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        createTime: this.state.createTime,//获取当前时间戳
                        updateTime: Date.parse(new Date()),//获取当前时间戳
                        id: this.state.id,
                        positionName: this.state.positionName,//职位名称，必填
                        recruitNumber: this.state.recruitNumber,//招聘人数，必填
                        releaseCompanyName: this.state.releaseCompanyName,//用工单位，选填
                        servingRequire: this.state.servingRequire,//用工要求，选填
                        remark: this.state.remark,//备注，选填

                        workMode: (this.state.ifchangeworMode) ? this.state.workMode : this.state.workMode_nochange,
                        positionKind: (this.state.ifchangepositionKind) ? this.state.positionKind : this.state.positionKind_nachange,
                        // salaryRange: (this.state.ifchangesalaryRange) ? this.state.salaryRange : this.state.salaryRange_nochange,
                        ageRequire: (this.state.ifchangeageRequire) ? this.state.ageRequire : this.state.ageRequire_nochange,
                        educationRequire: (this.state.ifchangeeducationRequire) ? this.state.educationRequire : this.state.educationRequire_nochange,
                        workYears: (this.state.ifchangeworkYears) ? this.state.workYears : this.state.workYears_nochange,

                        positionProvinceName: this.state.positionProvinceName,//地区，选填
                        positionProvince: this.state.positionProvince,//地区，选填
                        positionCityName: this.state.positionCityName,//地区，选填
                        positionCity: this.state.positionCity,//地区，选填
                        positionAreaName: this.state.positionAreaName,//地区，选填
                        positionArea: this.state.positionArea,//地区，选填
                        workTime: temp1,//工作时间，选填

                        workTime1: this.state.workTime1,//任意时间开始时间
                        workTime2: this.state.workTime2,//任意时间结束时间

                        hourSalary: this.state.hourSalary,//薪资/小时
                        workDay: (this.state.workDay == 0) ? '' : this.state.workDay,//每日工作时长
                        workEndTime: (this.state.ifchangeEndTime) ? this.state.workEndTime : this.state.workEndTime_nochange,//开始时间
                        workStartTime: (this.state.ifchangeStartTime) ? this.state.workStartTime : this.state.workStartTime_nochange,//结束时间

                        positionStatus: this.props.positionStatus == undefined ? null : this.props.positionStatus,//岗位发布状态
                        detailedAddress: this.state.addressDetailed,//详细地址 ，必填
                    }
                }
                // debugger
                Alert.alert("提示", "请您确认好岗位内容 \n新增后需要您手动发布"
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
                                Fetch.postJson(Config.mainUrl + '/positionManagement/updatePositionDetail', temp)
                                    .then((res) => {
                                        Toast.dismiss();
                                        if (res.rcode == '1') {
                                            Toast.showInfo('保存成功', 1000);
                                            Actions.pop()
                                            this.props.onblock()
                                        } else {
                                            Toast.showInfo(res.Msg, 1000)
                                        }

                                    })
                            }
                        }

                    ])

            }

        }
    }
    pddata(value) {
        var date = new Date(value);
        var time = Date.parse(date);
        var date1 = new Date(this.state.workStartTime);
        var time1 = Date.parse(date1);
        if (time != '' && time != '' && time < time1) {
            Toast.showInfo('结束时间不能小于开始时间', 2000)
            this.setState({
                workEndTime: '',
                ifchangeEndTime: true
            });
            return
        }
        this.setState({
            workEndTime: value,
            ifchangeEndTime: true
        });
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
    zhicheng() { //职称
        var temp = [];
        var zcList = this.state.zcList;
        var ifshow = this.state.ifShowZczj;
        for (let i in zcList) {
            if (!zcList[i].dictdataIsdefault) {
                temp.push(
                    <CheckboxItem
                        checked={ifshow[i].show}
                        onChange={
                            this.zcClick.bind(this, i)
                        }><Text>
                            {zcList[i].dictdataValue}</Text>
                    </CheckboxItem>
                )
            }
        }
        return temp;
    }
    getZCName() { //进入简历获取的职称名称
        var temp = '';
        var zcList = this.state.zcList;
        var ifshow = this.state.ifShowZczj;
        for (let i in zcList) {
            if (ifshow[i].show) {
                temp = temp + zcList[i].dictdataValue + "  "
            }
        }
        this.setState({
            professionCertificate: temp
        })
    }
    zcClick(i) {
        var temp = '';
        var zcList = this.state.zcList;
        var ifshow = this.state.ifShowZczj;
        ifshow[i].show = !ifshow[i].show
        for (let i in zcList) {
            if (ifshow[i].show) {
                temp = temp + zcList[i].dictdataValue + "  "
            }
        }
        this.setState({
            professionCertificate: temp,
            ifshow: ifshow
        })
    }
    jianzhi() { //兼职
        var temp1 = [];
        var jzList = this.state.jzList;
        var ifshow1 = this.state.ifShowJz;
        for (let i in jzList) {
            if (!jzList[i].dictdataIsdefault) {
                temp1.push(
                    <CheckboxItem
                        checked={ifshow1[i].show}
                        onChange={
                            this.jzClick.bind(this, i)
                        }><Text>
                            {jzList[i].dictdataValue}</Text>
                    </CheckboxItem>
                )
            }
        }
        return temp1;
    }
    getJZName() { //进入简历获取的兼职
        var temp1 = '';
        var jzList = this.state.jzList;
        var ifshow1 = this.state.ifShowJz;
        for (let i in jzList) {
            if (ifshow1[i].show) {
                temp1 = temp1 + jzList[i].dictdataValue + "  "
            }
        }
        this.setState({
            partTime: temp1
        })
    }
    jzClick(i) {
        var temp1 = '';
        var jzList = this.state.jzList;
        var ifshow1 = this.state.ifShowJz;
        if (i == this.state.jzList.length - 1) {
            if (this.state.ifShowJz[i].show) {
                this.setState({
                    partTime: this.state.jzList[i].dictdataValue,
                    ifShowJz: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false },],
                    chooseTime: false,
                })
            } else {
                this.setState({
                    partTime: this.state.jzList[i].dictdataValue,
                    ifShowJz: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: true }, { show: false },],
                    chooseTime: true,
                })
            }
        } else {

            ifshow1[i].show = !ifshow1[i].show
            ifshow1[this.state.jzList.length - 1].show = false;
            for (let i in jzList) {
                if (ifshow1[i].show) {
                    temp1 = temp1 + jzList[i].dictdataValue + "  "
                }
            }
            this.setState({
                partTime: temp1,
                ifshow1: ifshow1,
                chooseTime: false,
            })
        }

    }
    zhiwei() { //意向职位
        var temp2 = [];
        var zwList = this.state.zwList;
        var ifshow2 = this.state.ifShowZw;
        for (let i in zwList) {
            if (!zwList[i].dictdataIsdefault) {
                temp2.push(
                    <CheckboxItem
                        checked={ifshow2[i].show}
                        onChange={
                            this.zwClick.bind(this, i)
                        }><Text>
                            {zwList[i].dictdataValue}</Text>
                    </CheckboxItem>
                )
            }
        }
        return temp2;
    }
    getZWName() { //进入简历获取的意向职位
        var temp2 = '';
        var zwList = this.state.zwList;
        var ifshow2 = this.state.ifShowZw;
        for (let i in zwList) {
            if (ifshow2[i].show) {
                temp2 = temp2 + zwList[i].dictdataValue + "  "
            }
        }
        this.setState({
            postCode: temp2
        })
    }
    zwClick(i) {
        var temp2 = '';
        var zwList = this.state.zwList;
        var ifshow2 = this.state.ifShowZw;
        var t = 0;

        for (let i in ifshow2) {
            if (ifshow2[i].show) {
                t = t + 1
            }
        }
        if (t > 2) {
            if (ifshow2[i].show) {
                ifshow2[i].show = !ifshow2[i].show;
                for (let i in zwList) {
                    if (ifshow2[i].show) {
                        temp2 = temp2 + zwList[i].dictdataValue + "  "
                    }
                }
                this.setState({
                    postCode: temp2,
                    ifshow2: ifshow2
                })
            } else {
                Toast.showInfo('最多选三个意向职位', 1000)
            }

        } else {
            ifshow2[i].show = !ifshow2[i].show
            for (let i in zwList) {
                if (ifshow2[i].show) {
                    temp2 = temp2 + zwList[i].dictdataValue + "  "
                }
            }
            this.setState({
                postCode: temp2,
                ifshow2: ifshow2
            })
        }

    }

    showExpList() {
        var temp = [];
        if (!this.state.workExperience.length == 0) {
            for (let i in this.state.workExperience) {
                temp.push(
                    <View style={{ marginBottom: 20, marginLeft: 10 }} onPress={() => { Actions.Wodejingli({ params: { rowData: this.state.workExperience[i], i: i, type: 'edit', }, onblock: this.reloadBack_wdjl.bind(this) }) }}>
                        <View style={{ flexDirection: 'row' }}><View><VectorIcon name={"building"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} /></View><View><Text style={{ marginLeft: 10, fontSize: Config.MainFontSize + 1 }}>{this.state.workExperience[i].companyName}</Text></View></View>
                        <View><Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginTop: 10 }}>{this.timeChange(this.state.workExperience[i].entryTime)}  {this.timeChange(this.state.workExperience[i].entryTime) || this.timeChange(this.state.workExperience[i].seperateTime) == '' ? '至' : null}  {this.timeChange(this.state.workExperience[i].seperateTime)}</Text></View>
                        <View><Text style={{ fontSize: Config.MainFontSize - 1, marginTop: 10 }}>{this.state.workExperience[i].position}</Text></View>
                        <View style={{ width: deviceWidth - 40, padding: 10 }}><Text style={{ fontSize: Config.MainFontSize - 2, marginTop: 10, color: 'grey' }}>{this.state.workExperience[i].workContent}</Text></View>
                        {this.state.showPop == true ? <TouchableOpacity style={{ position: 'absolute', right: 5, bottom: 2, backgroundColor: 'transparent' }}><Text style={{ color: 'red', marginLeft: 2 }} onPress={this.delete.bind(this, i)}>删除</Text></TouchableOpacity> : null}
                        {this.state.showPop == true ? <TouchableOpacity style={{ position: 'absolute', right: 10, top: 5 }} onPress={() => { Actions.Wodejingli({ params: { rowData: this.state.workExperience[i], i: i, type: 'edit', }, onblock: this.reloadBack_wdjl.bind(this) }) }}>
                            <VectorIcon name={"edit2"} size={20} color={'#03A9F4'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity> : null}
                    </View>
                )
            }
        }
        return temp;
    }
    reloadBack_wdjl(rowData) {
        if (rowData.type == 'edit') {
            this.state.workExperience[rowData.i] = rowData;
            var temp1 = [...this.state.reportList]
            temp1.push(rowData.itemId);
            this.setState({ reportList: temp1, })
        } else {
            var temp1 = [...this.state.reportList]
            temp1.push(rowData.itemId);
            var temp = [...this.state.workExperience];
            temp.push(rowData)
            this.setState({ reportList: temp1, workExperience: temp })
        }
    }

    ifOpen_xiangqing() {
        this.state.ifOpen[0].open = !this.state.ifOpen[0].open;
        this.setState({ ifOpen: this.state.ifOpen })
    }
    ifOpen_qiuzhi() {
        this.state.ifOpen[1].open = !this.state.ifOpen[1].open;
        this.setState({ ifOpen: this.state.ifOpen })
    }
    ifOpen_zhengjian() {
        this.state.ifOpen[2].open = !this.state.ifOpen[2].open;
        this.setState({ ifOpen: this.state.ifOpen })
    }
    ifOpen_zhiwei() {
        this.state.ifOpen[3].open = !this.state.ifOpen[3].open;
        this.setState({ ifOpen: this.state.ifOpen })
    }
    ifOpen_jianzhi() {
        this.state.ifOpen[4].open = !this.state.ifOpen[4].open;
        this.setState({ ifOpen: this.state.ifOpen })
    }
    ifOpen_bankcard() {
        this.state.ifOpen[5].open = !this.state.ifOpen[5].open;
        this.setState({ ifOpen: this.state.ifOpen })
    }
    delete(i) {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '请稍后...',
            duration: 500,
        });
        var arr = this.state.workExperience;
        arr.splice(i, 1);
        this.setState({
            workExperience: arr,
        })
    }
    photo() {
        if (this.state.imageSource) {
            var dataSource = this.state.dataBlob;
            const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            return (
                <ListView
                    style={styles.listView}
                    horizontal={true}
                    dataSource={ds.cloneWithRows(dataSource)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />)
        } else {
            return null
        }
    }
    _renderItem(imageSource) {
        return (<TouchableOpacity onPress={() => this.getPhoto()} >
            {<Image source={{ uri: imageSource.uri }} style={{ position: 'absolute', right: 8, top: 8, height: 120, width: 80, }} />}
        </TouchableOpacity >
        )

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
        var domTemp = this.state.dataBlob;
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                let itemInfo = {
                    fileName: response.fileName,
                    fileSize: response.fileSize,
                    height: response.height,
                    type: response.type,
                    uri: response.uri,
                    recruitNumber: this.state.i + 1,
                    width: response.width,

                }
                domTemp.push(itemInfo);
                // }
                this.setState({
                    i: this.state.i + 1,
                    dataBlob: domTemp,
                    imageSource: response,
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }

    _selectImage() {
        var domTemp = this.state.dataBlob;
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 5,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                for (let i in response) {
                    let itemInfo = {
                        fileName: response[i].fileName,
                        fileSize: response[i].fileSize,
                        height: response[i].height,
                        type: response[i].type,
                        uri: response[i].uri,
                        recruitNumber: this.state.i + 1,
                        width: response[i].width,
                    }
                    this.setState({ i: this.state.i + 1 });
                    domTemp.push(itemInfo);
                }
                this.setState({
                    dataBlob: domTemp,
                    imageSource: response,
                });
            })
            .catch((e) => {
                console.log(e);
            })
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
    zerenModal() {
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    modalVisible={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({ modalVisible: false }) }}
                >
                    <TouchableOpacity style={{ height: deviceHeigth, width: deviceWidth, backgroundColor: 'black', opacity: 0.5 }}>
                    </TouchableOpacity>
                    <View style={{ alignSelf: 'center', height: (Platform.OS == 'ios') ? deviceHeigth / 1.1 : deviceHeigth / 1.1, width: deviceWidth - 40, marginTop: 40, backgroundColor: 'white', position: 'absolute' }}>
                        <ImageBackground source={require('../../image/mianze.png')} style={{ width: deviceWidth - 40, height: 160, alignSelf: 'center' }}>
                            <Text style={{ color: 'white', position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>工薪易平台发送内容规范</Text>
                            <VectorIcon name={'security'} style={{ color: 'white', fontSize: 80, position: 'absolute', marginTop: 50, alignSelf: 'center', backgroundColor: 'transparent' }} />
                        </ImageBackground>
                        <ScrollView style={{ marginBottom: 80, backgroundColor: 'white', width: deviceWidth - 60, alignSelf: 'center', height: deviceHeigth / 3 }}>
                            <View>
                                <Text style={{ marginTop: 10 }}>
                                    第一条 概述
                                    </Text>
                                <Text style={{ marginTop: 10 }}>  用户在工薪易平台发送的内容需要遵守相关法律法规以及本规则的规定，如涉及违反相关规定，一经发现将根据违规程度对其账号采取相应的处理措施，包括但不限于：
                                </Text>
                                <Text style={{ marginTop: 10 }}> 第一条 侵权或侵犯隐私类内容
                                </Text>
                                <Text style={{ marginTop: 10 }}> 1、主体侵权
                                （1）擅自使用他人已经登记注册的企业名称或商标，侵犯他人企业名称专用权及商标专用权。
                                （2）擅自冒用他人名称、头像，侵害他人名誉权、肖像权等合法权利。
                                此类侵权行为一经发现，将对违规账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 2、内容侵权
                                （1）未经授权发送他人原创文章，侵犯他人知识产权。
                                （2）未经授权发送他人身份证号码、照片等个人隐私资料，侵犯他人肖像权、隐私权等合法权益。
                                （3）捏造事实公然丑化他人人格，或用侮辱、诽谤等方式损害他人名誉。
                                （4）未经授权发送企业商业秘密，侵犯企业合法权益。
</Text>
                                <Text style={{ marginTop: 10 }}> 首次出现此类侵权行为，将对违规内容进行删除处理，并可对其账号予以一定期限内冻结处理，多次出现上述违规行为或情节严重的，将对违规账号予以注销处理。
                                </Text>
                                <Text style={{ marginTop: 10 }}> 第二条 色情及色情擦边类内容
                                1、散布淫秽、色情内容，包括但不限于招嫖、寻找一夜情、性伴侣等内容。
                                2、发送以色情淫秽为目的的情色文字、情色视频、情色漫画的内容，但不限于上述形式。
                                3、长期发送色情擦边、性暗示类信息内容，以此来达到吸引用户的目的。
                                首次出现上述违规行为，将对违规内容进行删除处理，并可以对其账号予以一定期限内冻结处理，多次出现或情节严重的，将对违规账号予以注销处理。
                                </Text>
                                <Text style={{ marginTop: 10 }}> 第三条 暴力内容
                                1、散播人或动物被杀、致残以及枪击、刺伤、拷打等受伤情形的真实画面。
                                2、出现描绘暴力或虐待儿童等内容。
                                3、出现吸食毒品（管制类精神药品）自虐自残等令人不安的暴力画面内容。
                                4、无资质销售仿真枪、弓箭、管制刀具、气枪等含有杀伤力枪支武器弹药。
                                5、出现以鼓励非法或鲁莽使用等为目的而描述真实武器的内容。
                                出现上述违规行为，将对违规内容进行删除处理，并对账号予以注销处理。
                                </Text>
                                <Text style={{ marginTop: 10 }}> 第四条 赌博类内容
                                发送组织聚众赌博、出售赌博器具、传授赌博（千术）技巧、方式、方法等内容。
                                出现上述违规行为，将对违规内容进行删除处理，并对账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第五条 危害平台安全内容
                                1、发送钓鱼网站等信息，诱使用户上当受骗蒙受损失。
                                2、发送病毒、文件、计算机代码或程序，可能对工薪易平台的正常运行或消息发送和接收服务的正常运行造成损害或中断的。
                                出现上述违规行为，将对违规内容进行删除处理，并对账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第六条 涉黑类内容
                                发送替人复仇、收账等具有黑社会性质的信息；雇佣、引诱他人从事恐怖、暴力等活动；拉帮结派，招募成员，对社会秩序构成潜在危害的内容。
                                出现上述违规行为，将对违规内容进行删除处理，并对账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第七条 知识产权
                                1、本平台及本平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、档案、资料、平台构架、平台版面的安排、网页设计、经由本平台或广告商向用户呈现的广告或资讯，均由本平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经本平台或权利人明示授权，用户保证不修改、出租、出借、出售、散布本平台及本平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品；
                                2、用户不得经由非本平台所提供的界面和入口注册、登录和使用本平台，否则，工薪易平台有权采取冻结或注销用户账号等措施，因此产生的不利后果和损失由用户自行承担。
</Text>
                                <Text style={{ marginTop: 10 }}> 第七条 非法物品类内容
                                包括但不限于买卖发票；出售假烟、假币、赃物、走私物品、毒品、窃听窃照等器材、武器弹药、迷药、国家机密；性虐；信用卡套现；办证刻章、代办身份证、信用卡等、办理手机复制卡等信息；交易人体器官等内容。
                                出现上述违规行为，将对违规内容进行删除处理，并对账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第八条 广告类内容
                                1、欺诈虚假广告类
                                （1）以骗取钱财为目的的欺诈广告（例如网赚、中奖类信息）。
                                （2）虚假夸大减肥、增高、丰胸、美白效果但明显无效的保健品、药品、食品类广告。
                                （3）推广销售假冒伪劣商品的广告。
                                2、与工薪易平台定位和运营目的不相符的其他广告
                                首次出现上述违规行为，将对违规内容进行删除处理，并可对其账号予以一定期限内冻结处理，多次出现或情节严重的，对违规账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第九条 谣言类内容
                                发送不实信息，制造谣言，可能对他人、企业或其他机构造成损害的内容。
                                首次出现上述违规行为，将对违规内容进行删除处理，并可对其账号予以一定期限内冻结处理，多次出现或情节严重的，将对违规账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第十条 搔扰类内容
                                过度营销，对用户造成搔扰的内容。
                                首次出现上述违规行为，将对违规内容进行删除处理，并可对其账号予以一定期限内冻结处理，多次出现或情节严重的，将对违规账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第十一条 其他危害国家安全和社会公共利益的内容
                                发布涉及危害国家主权和领土完整、危害国家安全的、破坏国家统一和民族团结、破坏国家宗教政策等其他危害国家安全和社会公共利益的内容。
                                出现上述违规行为，将对违规内容进行删除处理，并对账号予以注销处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第十二条 暂时屏蔽和最终处理
                                任何第三方向工薪易平台举报用户有上述违规行为或者工薪易平台认为用户涉嫌有上述违规行为的，工薪易平台均有权要求涉嫌违规用户限时提交足以证明其行为并未违规的充分、有效证据。并且，工薪易平台有权暂时屏蔽涉嫌违规内容和涉嫌违规用户账号。如果涉嫌违规用户未按上述规定提交证据或者足以认定其违规属实的，其信用将受到影响，并且工薪易平台将按照上述规定对违规内容进行删除、对其账号予以一定期限内冻结或删除处理。
</Text>
                                <Text style={{ marginTop: 10 }}> 第十三条 本规则自公布之日起实行


</Text>
                            </View>
                        </ScrollView>
                        <TouchableOpacity style={{ width: deviceWidth - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', position: 'absolute', bottom: 10, right: 20, borderRadius: 5 }} onPress={() => this.setState({ modalVisible: false, selected: true })}><View><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>同意并继续</Text></View></TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    contentCon: {
        paddingVertical: 0
    },
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
    second: {
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 64,
        width: Dimensions.get('window').width - 32,
        borderBottomColor: '#e7e7e7',
        borderBottomWidth: 1,
        marginTop: 10,
        marginLeft: 8,

    },
    height: {
        marginTop: 5,
        borderColor: '#bbe6f7',
        borderWidth: 1,
    },
    p4: {
        alignItems: 'center',
        borderRightColor: '#bbe6f7',
        borderRightWidth: 1,
        borderBottomColor: '#bbe6f7',
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        width: 100
    },
    p5: {
        alignItems: 'center',
        borderRightColor: '#bbe6f7',
        borderRightWidth: 1,
        borderBottomColor: '#bbe6f7',
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        width: 150
    },
    playerBox: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'row',
        height: 35,
        alignSelf: 'center'
    },
});

