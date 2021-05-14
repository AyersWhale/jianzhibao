/**
 * 我的简历
 * 伍钦
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, DeviceEventEmitter, KeyboardAvoidingView, BackHandler } from 'react-native';
import { NavigationBar, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID, SafeArea } from 'c2-mobile';
import { Checkbox, List, Picker, Switch } from 'antd-mobile-rn';
import DatePicker from 'react-native-datepicker';
import Global from '../../utils/GlobalStorage';
import TimeChange from '../../utils/TimeChange';
import { workTypeByCode, workTypeByValue, commonLogin } from '../../utils/common/businessUtil'
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
const CheckboxItem = Checkbox.CheckboxItem;
import PcInterface from '../../utils/http/PcInterface';
import EncryptionUtils from '../../utils/EncryptionUtils';
var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
const emailRule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const phoneRule = /^1[0-9]{10}$/
const phoneRule1 = /^1(3|4|5|7|8)\d{9}$/   //16686415607这个号码验证不出来
const emailArray = [
    { value: "@163.com", label: "@163.com" },
    { value: "@126.com", label: "@126.com" },
    { value: "@qq.com", label: "@qq.com" },
    { value: "@sina.com", label: "@sina.com" },
    { value: "@sohu.com", label: "@sohu.com" },
]
var data_fangshi = [
    { value: "兼职", label: "兼职" },
    { value: "合伙人", label: "合伙人" },
    { value: "抢单", label: "抢单" },
    { value: "撮合", label: "撮合" },
]
var data_bank = [
    { value: "中国工商银行", label: "中国工商银行" },
    { value: "中国农业银行", label: "中国农业银行" },
    { value: "中国银行", label: "中国银行" },
    { value: "平安银行", label: "平安银行" },
    { value: "中国建设银行", label: "中国建设银行" },
    { value: "中国邮政储蓄银行", label: "中国邮政储蓄银行" },
    { value: "招商银行", label: "招商银行" },
    { value: "长沙银行", label: "长沙银行" },
    { value: "交通银行", label: "交通银行" },

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
export default class Jianli extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            zgxl_ZS: '',//学历真实值
            zgxlList: [],//学历
            zgxlList_source: [],//学历字典原数据
            salaryRanges: '',//薪资真实值
            zxyqList_source: [],//薪资要求原数据
            zxyqList: [],//薪资要求
            keyboardHeight: '', // 键盘高度
            emailType: '',
            remark6: '',//（电话号码隐藏）  1 显示，0隐藏 
            remark5: '',//（简历隐藏）  1 显示，0隐藏 
            checked: false,
            checked1: false,
            value: '',
            value_fangshi: '',
            data_education: [],
            data_bank: [],
            value_education: '',//学历显示值
            dictdataName: '',
            ifChangeBirthday: false,
            ifChangeEducateTime: false,
            Name: (this.props.userName == undefined) ? '' : this.props.userName,
            userRealname: (this.props.userRealname == undefined) ? '' : this.props.userRealname,
            M: (this.props.sex == "男") ? true : false,
            W: (this.props.sex == "女") ? true : false,
            Phone: (this.props.telphone == undefined) ? "" : this.props.telphone,
            Sfz: (this.props.idNum == undefined) ? '' : this.props.idNum,
            BornDate: (this.props.birthday == undefined) ? "" : this.props.birthday,
            BornDate_new: (this.props.birthday == undefined) ? "" : this.props.birthday,
            nativePlace: (this.props.nativePlace == undefined) ? "" : this.props.nativePlace,
            Email: '',
            ifchangeEmail: false,
            res1: '',
            Time: '',
            Gzjl: '',
            Zwpj: '',
            imageSource: '',
            dataBlob: [],
            rightTitle: "修改",
            urgenPerson: '',
            urgenPersonRelation: '',
            urgenPhone: '',
            bankCardnum: '',
            OPENBANK_ZH: '',
            educateFrom: '',
            profession: '',
            educateTime: '',
            value_payment: '',//薪资显示值
            value_bank: '',
            homeAddress: '',
            workExperience: [],
            showPop: (this.props.userId == undefined) ? false : true,
            reportList: [],
            uuid: UUID.v4(),
            id: '',
            userId: (this.props.userId == undefined) ? "" : this.props.userId,
            ifOpen: [{ open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }],
            zcList: [],
            jzList: [],
            zwList: [],
            xlList: [],
            professionCertificate: '',
            partTime: '',
            postCode: '',
            postName: '',
            ifShowZczj: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
            ifShowJz: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
            ifShowJz_last: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: true }],
            ifShowZw: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }
                , { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }
                , { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false }],
        };
        this.sfzData()
        this.onChange1 = this._onChange1.bind(this);
        // Global.getValueForKey('ifhide').then((ret5) => {
        //     if (ret5 == undefined || ret5 == null) {
        //         this.setState({
        //             checked: false
        //         })
        //     } else {
        //         this.setState({
        //             checked: ret5
        //         })
        //     }
        // })
        Fetch.postJson(Config.mainUrl + '/basicResume/viewBasicResume', (UserInfo.loginSet == undefined) ? "" : UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                this.setState({
                    checked: (res[0].remark6 == '0') ? true : false,
                    checked1: (res[0].remark5 == '0') ? true : false,
                })
            })
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=岗位类别', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                this.setState({
                    zwList: JSON.parse(json).result
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
                        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=学历', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((res) => res.text())
                            .then((json) => {
                                // var data_education = [];
                                // var xlList = JSON.parse(json).result;
                                // for (let i in xlList) {
                                //     if (xlList[i].dictdataValue != '不限') {
                                //         if (!xlList[i].dictdataIsdefault) {
                                //             data_education.push({ value: xlList[i].dictdataValue, label: xlList[i].dictdataValue, dictdataName: xlList[i].dictdataName })
                                //         }
                                //     }

                                // }
                                // this.setState({
                                //     data_education: data_education
                                // })
                                var array = [];
                                var arrayResult = JSON.parse(json).result;
                                console.log('最高学历', arrayResult)
                                for (let i in arrayResult) {
                                    if (!arrayResult[i].dictdataIsdefault && arrayResult[i].dictdataName !== 'BX') {
                                        array.push({ value: JSON.stringify(arrayResult[i]), label: arrayResult[i].dictdataValue })
                                    }
                                }
                                this.setState({
                                    zgxlList: array,
                                    zgxlList_source: arrayResult
                                })
                                // 职称证件
                                fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=职称证件', {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then((res) => res.text())
                                    .then((json) => {
                                        this.getMyResume();//获取简历详情
                                        this.setState({
                                            zcList: JSON.parse(json).result
                                        })
                                    })
                            })
                    })
            })

    }

    // 监听键盘弹出与收回
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
        this.getXZYQ()
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
    }
    //注销监听
    componentWillUnmount() {
        this.backHandler.remove();
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
        this.setState = (state, callback) => {
            return;
        };
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
    sfzData() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/basicResume/checkBasicResume', entity)
            .then((res) => {
                // var zwList = this.state.zwList
                // for (var i in zwList){
                //     if (zwList[i].dictdataValue == res.data.intentPost){
                //         this.state.ifShowZw[i].show=true
                //     }
                // }
                if (res.data.postCode) {
                    var postCode = res.data.postCode
                    var codeArr = postCode.split(',')
                    console.log(codeArr)
                    var arr = []
                    var zwList = this.state.zwList
                    for (var i in zwList) {
                        arr.push(zwList[i].dictdataName)
                    }
                    var ifShowZw = this.state.ifShowZw
                    for (var j in codeArr) {
                        for (var i in arr) {
                            if (codeArr[j] == arr[i]) {
                                ifShowZw[i].show = true
                            }
                        }
                    }
                }
                var ss = this.dataChange(res.data.birthDay)
                this.setState({
                    Name: res.data.personName,
                    userRealname: res.data.personName,
                    BornDate: this.dataChange(res.data.birthDay),
                    nativePlace: res.data.nativePlace,
                    M: res.data.sex == 'MALE' ? true : false,
                    W: res.data.sex == 'FEMALE' ? true : false,
                    homeAddress: res.data.homeAddress ? res.data.homeAddress : '',
                    urgenPerson: res.data.urgenPerson ? res.data.urgenPerson : '',
                    urgenPersonRelation: res.data.contactRelations ? res.data.contactRelations : '',
                    urgenPhone: res.data.urgenPhone ? res.data.urgenPhone : '',
                    value_fangshi: workTypeByCode(res.data.workMethod),
                    // value_fangshi: res.data.workMethod == 'LSYG' ? '合伙人' : res.data.workMethod == 'FQRZ' ? '兼职' : res.data.workMethod == 'LWPQ' ? '抢单' : '',
                    postCode: res.data.postCode ? res.data.postCode : '',
                    postName: res.data.intentPost,
                    ifShowZw: ifShowZw ? ifShowZw : this.state.ifShowZw,
                    Sfz: res.data.identifyNum
                }, () => {
                    // if (res.data.postCode != '' || res.data.postCode) {
                    //     this.zwClick()
                    // }
                })
            })
    }
    getXl() {//获取学历字典
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=学历', {
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
                    zgxlList: array,
                    zgxlList_source: arrayResult
                })
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

    _isNull(str) {
        let result = true;
        if (str === "" || str === undefined) {
            result = true;
        }
        if (str.length > 0) {
            result = false;
        }
        return result;
    }

    _replaceSpace(str) {
        if (typeof str === 'string') {
            //替换空格或者非数字字符
            return str.replace(/\s|\D+/g, '');
        }
        return "";
    }

    _splitNum(str) {
        let reg = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/;
        let arr = reg.exec(str);
        let result = '';
        for (let i = 1; i < arr.length; i++) {
            if (arr[i]) {
                if (i === 1) {
                    result = arr[1];
                } else {
                    result = result + " " + arr[i];
                }
            } else {
                break;
            }
        }
        return result;
    }
    _onChange1(changeText) {
        let value = this._splitNum(this._replaceSpace(changeText))
        this.setState({
            bankCardnum: value,
        });
    }
    onChange_email = (value) => {
        this.setState({
            emailType: value
        })
    }
    _back() {
        Actions.pop();
    }
    onChange = (value) => {
        this.setState({ value: value });
    }
    onChange_fangshi = (value) => {
        this.setState({ value_fangshi: value });
    }
    onChange_education = (value) => {
        let values = JSON.parse(value[0])
        this.setState({
            value_education: values.dictdataValue,
            zgxl_ZS: values.dictdataName,
        });
    }
    onChange_payment = (value) => {
        let values = JSON.parse(value[0])
        this.setState({
            value_payment: values.dictdataValue,
            salaryRanges: values.dictdataName,
        });
    }
    // onChange_marrige = (value) => {
    //     this.setState({ value_marrige: value });
    // }
    onChange_bank = (value) => {
        this.setState({ value_bank: value });
    }
    removeAllSpace(str) {
        return str.replace(/\s+/g, "");
    }

    save() {
        var reg = /^[\u0391-\uFFE5]+$/;
        const rule = /^1[0-9]{10}$/;
        var entity3 = {
            hrEmail: this.state.Email + this.state.emailType,
            id: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            type: '1',
        }
        if (this.state.showPop) {
            // if (this.state.Name == '' || this.state.Name == undefined) {
            //     Toast.showInfo('请输入您的姓名', 1000)
            //     return;
            // }
            // if (this.state.Phone == '' || this.state.Phone == undefined) {
            //     Toast.showInfo('请输入您的手机号码', 1000)
            //     return;
            // }
            // if (rule.test(this.state.Phone) == false) {
            //     Toast.showInfo('请输入正确的号码格式', 1000)
            //     return;
            // }
            // if (this.state.Sfz == '' || this.state.Sfz == undefined) {
            //     Toast.showInfo('请输入您的身份证号码', 1000)
            //     return;
            // }
            // if (this.state.Email !== '' && emailRule.test(this.state.Email) == false) {
            //     Toast.showInfo('请输入正确的邮箱', 1000)
            //     return;
            // }
            // if (this.state.ifchangeEmail && this.state.Email !== '') {
            //     Fetch.postJson(Config.mainUrl + '/companyRegistInfo/checkHrEmail', entity3)
            //         .then((res) => {
            //             console.log(res)
            //             if (res == false) {
            //                 Toast.showInfo('邮箱已注册 请重新填写', 1000)
            //                 return;
            //             } else {

            //                 this.saveMethed()
            //             }
            //         })
            // } else {
            this.saveMethed()
            // }
        } else {
            this.setState({ showPop: !this.state.showPop });
        }
        // if (
        //     this.state.Name != '' && this.state.Phone != '' && this.state.Sfz != '' && this.state.Email != ''
        //     && this.state.BornDate != '' && this.state.nativePlace != '' && this.state.homeAddress != '' && this.state.urgenPerson != ''
        //     && this.state.urgenPersonRelation != '' && this.state.urgenPhone != '' && this.state.value_bank != '' && this.state.OPENBANK_ZH != ''
        //     && this.state.value_fangshi != '' && this.state.postCode.length != 0
        // ) {
        //     this.setState({ showPop: !this.state.showPop });
        // }

    }
    saveMethed() {
        //var bankCardnum = this.removeAllSpace(this.state.bankCardnum);
        if (phoneRule.test(this.state.Phone) == false) {
            Toast.showInfo('请输入正确的号码格式', 1000)
            return;
        }
        if (this.state.Email == '') {
            this.setState({
                emailType: ""
            })
        }
        let checkBornDate = TimeChange.checkAge(this.state.BornDate, 16)
        if (this.state.BornDate == '' || this.state.BornDate == undefined || checkBornDate == false) {
            Toast.showInfo('请选择满16周岁的出生日期', 1000)
            return;
        }
        if (this.state.nativePlace == '' || this.state.nativePlace == undefined) {
            Toast.showInfo('请输入您的户籍地', 1000)
            return;
        }
        if (this.state.homeAddress == '' || this.state.homeAddress == undefined) {
            Toast.showInfo('请输入您的家庭地址', 1000)
            return;
        }
        if (this.state.urgenPerson == '' || this.state.urgenPerson == undefined) {
            Toast.showInfo('请输入紧急联系人', 1000)
            return;
        }
        if (this.state.urgenPersonRelation == '' || this.state.urgenPersonRelation == undefined) {
            Toast.showInfo('请输入紧急联系人与本人关系', 1000)
            return;
        }
        if (this.state.urgenPhone == '' || this.state.urgenPhone == undefined) {
            Toast.showInfo('请输入紧急联系人联系方式', 1000)
            return;
        }
        if (phoneRule.test(this.state.urgenPhone) == false) {
            Toast.showInfo('请输入正确的紧急联系人联系方式', 1000)
            return;
        }
        if (this.state.Email !== '' && emailRule.test(this.state.Email + this.state.emailType) == false) {
            Toast.showInfo('请输入正确的邮箱', 1000)
            return;
        }
        // if (this.state.value_bank == '' || this.state.value_bank == undefined) {
        //     Toast.showInfo('请选择开户行信息', 1000)
        //     return;
        // }
        // if (this.state.OPENBANK_ZH == '' || this.state.OPENBANK_ZH == undefined) {
        //     Toast.showInfo('请输入开户行支行', 1000)
        //     return;
        // }
        // if (!reg.test(this.state.OPENBANK_ZH)) {
        //     Toast.showInfo('请输入正确的开户行支行格式', 1000)
        //     return;
        // }
        // if (bankCardnum.length > 19 || bankCardnum.length < 12 || bankCardnum == '' || bankCardnum == undefined) {
        //     Toast.showInfo('请输入正确的银行卡卡号', 1000)
        //     return;
        // }
        if (this.state.value_fangshi == '' || this.state.value_fangshi == undefined) {
            Toast.showInfo('请选择工作方式', 1000)
            return;
        }
        if (this.state.postCode.length == 0) {
            Toast.showInfo('请选择意向行业', 1000)
            return;
        }
        if (this.props.userId == undefined) {
            var userId = UserInfo.loginSet.result.rdata.loginUserInfo.userId;
            var id = (this.state.id == undefined || this.state.id == '') ? this.state.uuid : this.state.id;
        } else {
            var userId = this.state.userId;
            var id = this.props.uuid;
        }
        var temp = [];
        for (let i in this.state.ifShowZczj) {
            if (this.state.ifShowZczj[i].show) {
                temp.push(i)
            }
        }
        var temp1 = [];
        for (let i in this.state.ifShowJz) {
            if (this.state.ifShowJz[i].show) {
                temp1.push(i)
            }
        }
        var temp2 = [];
        for (let i in this.state.ifShowZw) {
            if (this.state.ifShowZw[i].show) {
                temp2.push((i < 10) ? 0 + i : i);
            }
        }
        var entity = {
            basicResume: {
                personName: this.state.Name,
                sex: this.state.M == true ? "MALE" : "FEMALE",
                identifyNum: this.state.Sfz,
                phoneNumber: this.state.Phone,
                birthDay: this.toTimeStamp(this.state.BornDate),
                //  (this.state.ifChangeBirthday) ? this.toTimeStamp(this.state.BornDate) : this.state.BornDate_new
                nativePlace: this.state.nativePlace,
                email: this.state.Email == '' ? '' : this.state.Email + this.state.emailType,
                urgenPerson: this.state.urgenPerson,
                urgenPhone: this.state.urgenPhone,
                educateFrom: this.state.educateFrom,
                profession: this.state.profession,
                educateTime: (this.state.ifChangeEducateTime) ? this.toTimeStamp(this.state.educateTime) : this.state.educateTime_new,
                contactRelations: this.state.urgenPersonRelation,
                //openbank: this.state.value_bank == undefined ? null : this.state.value_bank == "中国工商银行" ? "COMMERCIAL" : this.state.value_bank == "长沙银行" ? "CSBANK" : this.state.value_bank == "中国银行" ? "CHINABANK" : this.state.value_bank == "招商银行" ? "MERCHANTS" : this.state.value_bank == "中国建设银行" ? "CONSTRUCTION" : this.state.value_bank == "中国邮政储蓄银行" ? "EMS" : this.state.value_bank == "交通银行" ? "JTYH" : this.state.value_bank == "平安银行" ? "PAYY" : "AGRICULTURAL",//开户行
                //salaryRanges: this.state.value_payment == undefined ? null : this.state.value_payment == "2000以下" ? "LQYX" : this.state.value_payment == "2000-3000" ? "LQDSQ" : this.state.value_payment == "4500-6000" ? "SQWDLQ" : this.state.value_payment == "6000-8000" ? "LQDBQ" : this.state.value_payment == "8000-10000" ? "BQDYW" : this.state.value_payment == "10000以上" ? "YWYS" : this.state.value_payment == "面议" ? "MY" : "BX",//薪资范围
                salaryRanges: this.state.salaryRanges == '' ? 'BX' : this.state.salaryRanges,//薪资范围真实值
                workMethod: workTypeByValue(this.state.value_fangshi[0]),
                // workMethod: this.state.value_fangshi == undefined ? null : this.state.value_fangshi == "兼职" ? "FQRZ" : this.state.value_fangshi == "抢单" ? "LWPQ" : this.state.value_fangshi == "合伙人" ? "LSYG" : "QRZ",//工作方式
                //highestEducation: this.state.value_education == undefined ? null : this.state.value_education == '不限' ? "BX" : this.state.value_education == '高中以下' ? "0" : this.state.value_education == '高中(职高 技校)' ? "1" : this.state.value_education == '中专' ? "2" : this.state.value_education == '大专' ? "3" : this.state.value_education == '本科' ? "4" : this.state.value_education == '硕士研究生' ? "5" : this.state.value_education == '博士研究生' ? "6" : this.state.value_education == '博士后' ? "7" : "",//最高学历
                highestEducation: this.state.zgxl_ZS,
                homeAddress: this.state.homeAddress,
                id: id,
                userId: userId,
                // wagescard: this.state.bankCardnum,
                // OPENBANK_ZH: this.state.OPENBANK_ZH,
                professionCertificate: temp,
                partTime: temp1,
                postCode: this.state.postName,
                remark6: this.state.checked ? '0' : '1',//必传
                remark5: this.state.checked1 ? '0' : '1',//必传
            },
            workExperience: this.state.workExperience,
        }
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '提交中...'
        });
        Fetch.postJson(Config.mainUrl + '/basicResume/saveBasicResume', entity)
            .then((res) => {
                Toast.dismiss();
                if (res) {
                    this.setState({ showPop: !this.state.showPop });
                    if (this.props.userId == undefined) {
                        Toast.showInfo('修改成功', 1000)
                        DeviceEventEmitter.emit('change')
                    } else {
                        // Cookies.removeAllCookies()
                        //     .then((result) => {
                        //     })
                        Toast.showInfo('提交成功', 1000)
                        Global.getValueForKey('loginInformation').then((ret) => {
                            if (ret) {
                                let loginParams = {
                                    params: {
                                        userName: ret.userName,
                                        passWord: ret.passWord,
                                    }
                                }
                                //此处加入登录接口
                                commonLogin(loginParams, () => {
                                    Actions.TabBar({ type: 'replace', identity: 'student' })
                                    return;
                                })
                            } else {
                                if (this.props.update) {
                                    Alert.alert(
                                        '恭喜您已完成简历!',
                                        [
                                            {
                                                text: '好的', onPress: () => Actions.pop({ refresh: { test: UUID.v4() } })
                                            },
                                        ]
                                    )
                                } else {
                                    Alert.alert(
                                        '恭喜您已完成简历!',
                                        '直接登录',
                                        [
                                            {
                                                text: '好的', onPress: () => Actions.Login({ type: 'replace' })
                                            },
                                        ]
                                    )
                                }
                            }
                        })
                    }
                } else {
                    Toast.showInfo('提交失败', 1000)
                }
            }).catch((e) => {
                Toast.showInfo(e.description, 1000)
            })
    }
    toTimeStamp(time) {
        // 将指定日期转换为时间戳。
        var t = time;  // 月、日、时、分、秒如果不满两位数可不带0.
        var T = new Date(t);  // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
        return T.getTime()  // 将转换后的标准日期转换为时间戳。
    }
    getMyResume() {
        if (this.state.showPop == false) {
            Fetch.postJson(Config.mainUrl + '/basicResume/viewBasicResume', (UserInfo.loginSet == undefined) ? "" : UserInfo.loginSet.result.rdata.loginUserInfo.userId)
                .then((res) => {
                    let value_payment = ''
                    if (this.state.zxyqList_source.length) {
                        let zxyqList_source = this.state.zxyqList_source
                        for (let j = 0; j < zxyqList_source.length; j++) {
                            if (zxyqList_source[j].dictdataName == res[0].salaryRanges) {
                                value_payment = zxyqList_source[j].dictdataValue
                            }
                        }
                    }
                    let value_education = ''
                    if (this.state.zgxlList_source.length) {
                        let zgxlList_source = this.state.zgxlList_source
                        for (let k = 0; k < zgxlList_source.length; k++) {
                            if (zgxlList_source[k].dictdataName == res[0].highestEducation) {
                                value_education = zgxlList_source[k].dictdataValue
                            }
                        }
                    }
                    var postCode = res[0].postCode
                    var codeArr = postCode.split(',')
                    console.log(codeArr)
                    var arr = []
                    var zwList = this.state.zwList
                    for (var i in zwList) {
                        arr.push(zwList[i].dictdataName)
                    }
                    var ifShowZw = this.state.ifShowZw
                    for (var j in codeArr) {
                        for (var i in arr) {
                            if (codeArr[j] == arr[i]) {
                                ifShowZw[i].show = true
                            }
                        }
                    }
                    console.warn('显示行业' + ifShowZw)
                    this.setState({
                        Name: res[0].personName,
                        BornDate: this.timeChange(res[0].birthDay),
                        BornDate_new: res[0].birthDay,
                        educateFrom: res[0].educateFrom,
                        nativePlace: res[0].nativePlace,
                        Email: res[0].email == '' ? '' : (res[0].email).split('@')[0],
                        emailType: res[0].email == '' ? '' : '@' + (res[0].email).split('@')[1],
                        homeAddress: res[0].homeAddress,
                        Sfz: res[0].identifyNum,
                        Phone: res[0].phoneNumber,
                        profession: res[0].profession,
                        urgenPersonRelation: res[0].contactRelations,
                        M: res[0].sex == "MALE" ? true : false,
                        urgenPerson: res[0].urgenPerson,
                        urgenPhone: res[0].urgenPhone,
                        id: res[0].id,
                        bankCardnum: res[0].wagescard,
                        OPENBANK_ZH: res[0].openbankZh,
                        value_bank: res[0].openbank == "COMMERCIAL" ? "中国工商银行" : res[0].openbank == "CSBANK" ? "长沙银行" : res[0].openbank == "CHINABANK" ? "中国银行" : res[0].openbank == "MERCHANTS" ? "招商银行" : res[0].openbank == "CONSTRUCTION" ? "中国建设银行" : res[0].openbank == "EMS" ? "中国邮政储蓄银行" : res[0].openbank == "AGRICULTURAL" ? "中国农业银行" : res[0].openbank == "PAYY" ? "平安银行" : res[0].openbank == "JTYH" ? "交通银行" : "",//开户行
                        //value_payment: res[0].salaryRanges == "LQYX" ? "2000以下" : res[0].salaryRanges == "LQDSQ" ? "2000-3000" : res[0].salaryRanges == "SQWDLQ" ? "4500-6000" : res[0].salaryRanges == "LQDBQ" ? "6000-8000" : res[0].salaryRanges == "BQDYW" ? "8000-10000" : res[0].salaryRanges == "YWYS" ? "10000以上" : res[0].salaryRanges == "MY" ? "面议" : res[0].salaryRanges == "BX" ? "不限" : "",//薪资范围
                        value_payment: value_payment,
                        salaryRanges: res[0].salaryRanges,
                        value_fangshi: workTypeByCode(res[0].workMethod),
                        // value_fangshi: res[0].workMethod == "FQRZ" ? "兼职" : res[0].workMethod == "LWPQ" ? "抢单" : res[0].workMethod == "LSYG" ? "合伙人" : res[0].workMethod == "QRZ" ? "全日制" : "",//工作方式
                        //value_education: res[0].highestEducation == 'BX' ? "不限" : res[0].highestEducation == '0' ? "高中以下" : res[0].highestEducation == '1' ? "高中(职高 技校)" : res[0].highestEducation == '2' ? "中专" : res[0].highestEducation == '3' ? "大专" : res[0].highestEducation == '4' ? "本科" : res[0].highestEducation == '5' ? "硕士研究生" : res[0].highestEducation == '6' ? "博士研究生" : res[0].highestEducation == '7' ? "博士后" : "",//最高学历
                        value_education: value_education,
                        zgxl_ZS: res[0].highestEducation,
                        educateTime: (res[0].educateTime) ? this.timeChange(res[0].educateTime) : '',
                        educateTime_new: res[0].educateTime,
                        ifShowZczj: (res[0].professionCertificate == undefined || res[0].professionCertificate == '') ? this.state.ifShowZczj : [{ show: res[0].professionCertificate.indexOf("0") != -1 ? true : false }, { show: res[0].professionCertificate.indexOf("1") != -1 ? true : false },
                        { show: res[0].professionCertificate.indexOf("2") != -1 ? true : false }, { show: res[0].professionCertificate.indexOf("3") != -1 ? true : false },
                        { show: res[0].professionCertificate.indexOf("4") != -1 ? true : false }, { show: res[0].professionCertificate.indexOf("5") != -1 ? true : false },
                        { show: res[0].professionCertificate.indexOf("6") != -1 ? true : false }],

                        ifShowJz: (res[0].partTime == undefined || res[0].partTime == '') ? this.state.ifShowJz : [{ show: res[0].partTime.indexOf("0") != -1 ? true : false }, { show: res[0].partTime.indexOf("1") != -1 ? true : false },
                        { show: res[0].partTime.indexOf("2") != -1 ? true : false }, { show: res[0].partTime.indexOf("3") != -1 ? true : false },
                        { show: res[0].partTime.indexOf("4") != -1 ? true : false }, { show: res[0].partTime.indexOf("5") != -1 ? true : false }, { show: res[0].partTime.indexOf("6") != -1 ? true : false }],

                        ifShowZw: ifShowZw,


                        //工作经历
                        workExperience: res[1],
                    }, () => { this.getJZName(); this.getZCName(); this.getZWName() })
                })
        }



    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>我的简历</Text>
                    </View>
                    <TouchableOpacity style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => this.save()}>
                        <Text style={{ color: 'white' }}>{(this.state.showPop) ? "保存" : "修改"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginTop: 8, marginLeft: 8, width: deviceWidth - 18, backgroundColor: '#fff',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    shadowColor: '#b3b4b7',
                    elevation: 2,
                    borderRadius: 4
                }}>
                    <List.Item
                        extra={<Switch
                            checked={this.state.checked}
                            onChange={() => {
                                this.setState({
                                    checked: !this.state.checked,
                                });
                                var entity = {
                                    userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                                    remark6: !this.state.checked ? '0' : '1',
                                    remark5: this.state.checked1 ? '0' : '1',
                                }
                                Fetch.postJson(Config.mainUrl + '/basicResume/updatePhoneStatus', entity)
                                    .then((res) => {
                                        console.log(res)
                                    })
                            }}
                        />
                        }
                    >隐藏联系方式</List.Item>
                    <List.Item
                        extra={<Switch
                            checked={this.state.checked1}
                            onChange={() => {
                                this.setState({
                                    checked1: !this.state.checked1,
                                });
                                var entity = {
                                    userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                                    remark6: this.state.checked ? '0' : '1',
                                    remark5: !this.state.checked1 ? '0' : '1',
                                }
                                Fetch.postJson(Config.mainUrl + '/basicResume/updatePhoneStatus', entity)
                                    .then((res) => {
                                        console.log(res)
                                    })

                            }}
                        />
                        }
                    >隐藏简历</List.Item>
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={-this.state.keyboardHeight}>
                    <ScrollView keyboardShouldPersistTaps={'handled'} onPress={() => { Keyboard.dismiss() }}>
                        <View style={{
                            marginTop: 8, marginLeft: 8, width: deviceWidth - 18, backgroundColor: '#fff',
                            shadowOffset: { width: 0, height: 5 },
                            shadowOpacity: 0.8,
                            shadowRadius: 5,
                            shadowColor: '#b3b4b7',
                            elevation: 2,
                        }}>
                            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8 }}>
                                <View><Image style={{ marginLeft: 8, marginTop: 2 }} source={require('../../image/sx.png')} /></View>
                                <View><Text style={{ fontSize: Config.MainFontSize + 2, marginLeft: 5 }}>基本信息</Text></View>
                                <View>
                                    {/* <TouchableOpacity onPress={this.ifOpen_xiangqing.bind(this)} style={{ alignSelf: 'center', marginLeft: 80 }}>
                                    <VectorIcon name={this.state.ifOpen[0].open ? 'ios-arrow-down' : 'ios-arrow-right'} size={20} style={{ color: 'rgb(22,131,251)', alignSelf: 'center', position: 'absolute', right: 30 }} />
                                </TouchableOpacity> */}
                                </View>
                            </View>
                            {(this.state.ifOpen[0].open) ?
                                <View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{
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
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>姓        名</Text>
                                            </View>
                                            <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.userRealname}</Text>
                                        </View>
                                        <View style={{
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
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>性        别</Text>
                                            </View>

                                            {this.state.showPop == true ? <View style={{ flexDirection: 'row', position: 'absolute', right: 6 }}>

                                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                    {this.state.M == false ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                        <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                    <TouchableOpacity
                                                        onPress={this.pres1.bind(this)}>
                                                        <View>
                                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>男</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                                    {this.state.M == true ? <Image source={require('../../image/Oval.png')} style={{ height: 10, width: 10, marginTop: 5 }} /> :
                                                        <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                                    <TouchableOpacity
                                                        onPress={this.pres2.bind(this)}>
                                                        <View>
                                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 2 }}>女</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View> : <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.M == true ? '男' : '女'}</Text>}
                                        </View>

                                        <View style={{
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
                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>手机号码</Text>
                                            </View>
                                            {this.state.showPop == true ? <TextInput
                                                style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                                underlineColorAndroid="transparent"
                                                keyboardType='numeric'
                                                secureTextEntry={false}
                                                placeholderTextColor="#c4c4c4"
                                                value={this.state.Phone}
                                                placeholder='输入你的手机号码'
                                                maxLength={11}
                                                onChangeText={(text) => { this.setState({ Phone: text }) }}
                                                onBlur={() => this.handlePhoneBlur(this.state.Phone)}
                                            /> : <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.Phone}</Text>}
                                        </View>
                                    </View>
                                    <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 44,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: this.state.showPop ? "#999" : "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>身份证号</Text>
                                        </View>
                                        <Text style={{ color: '#999', position: 'absolute', right: 10 }}>{this.state.Sfz.substring(0, 3) + '***********' + this.state.Sfz.substring(14, 18)}</Text>
                                    </View>

                                    <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 44,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        //borderBottomColor: '#e7e7e7',
                                        //borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>出生日期</Text>
                                        </View>
                                        {this.state.showPop == true ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <DatePicker
                                                date={this.state.BornDate}
                                                mode="date"
                                                placeholder={(this.state.BornDate) == undefined ? "选择时间" : this.state.BornDate}
                                                placeholderColor='red'
                                                format="YYYY-MM-DD"
                                                maxDate={new Date()}
                                                showIcon={false}
                                                customStyles={{
                                                    dateInput: {
                                                        borderColor: '#fff',
                                                        backgroundColor: '#fff', marginLeft: 50
                                                    }
                                                }}
                                                minuteInterval={10}
                                                onDateChange={(BornDate) => this.handlePhoneBirthday(BornDate)}
                                            />
                                        </View> : <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.BornDate}</Text>}
                                    </View>

                                    {this.state.showPop == true ?
                                        <View style={{
                                            marginBottom: 1,
                                            flexDirection: 'row',
                                            backgroundColor: "#fff",
                                            //height: 44,
                                            alignItems: 'center',
                                            width: Dimensions.get('window').width - 32,
                                            borderColor: '#e7e7e7',
                                            borderBottomWidth: 1,
                                            borderTopWidth: 1,
                                            marginTop: 8,
                                            marginLeft: 8,
                                        }}>
                                            <Text style={{ fontSize: Config.MainFontSize, color: '#222222', marginLeft: 21 }}>我的邮箱</Text>
                                            <List style={{ flex: 1 }}>
                                                <Picker
                                                    disabled={!this.state.showPop}
                                                    data={emailArray}
                                                    cols={1}
                                                    onOk={this.onChange_email}
                                                    extra={this.state.emailType}
                                                    title='邮箱类型'
                                                // itemStyle={styles.pickStyle}
                                                >
                                                    <List.Item arrow="horizontal">
                                                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                                            {this.state.showPop ?
                                                                <TextInput
                                                                    style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'center' }}
                                                                    underlineColorAndroid="transparent"
                                                                    secureTextEntry={false}
                                                                    placeholderTextColor="#c4c4c4"
                                                                    value={this.state.Email}
                                                                    placeholder='请输入邮箱'
                                                                    onChangeText={(text) => { this.setState({ Email: text, ifchangeEmail: true }) }}
                                                                    maxLength={30}
                                                                    onBlur={() => this.handleEmailBlur(this.state.Email)}
                                                                />
                                                                : <Text style={{ color: '#999', position: 'absolute', right: 10 }}>{this.state.Email}</Text>}

                                                        </View>
                                                    </List.Item>
                                                </Picker>
                                            </List>
                                        </View>
                                        : <View style={{
                                            marginBottom: 1,
                                            flexDirection: 'row',
                                            backgroundColor: "#fff",
                                            height: 44,
                                            alignItems: 'center',
                                            width: Dimensions.get('window').width - 32,
                                            borderTopColor: '#e7e7e7',
                                            borderTopWidth: 1,
                                            marginTop: 10,
                                            marginLeft: 8,
                                            borderBottomColor: '#e7e7e7',
                                            borderBottomWidth: 1,
                                        }}>
                                            <View style={{ display: "flex", flexDirection: 'row' }}>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21 }}>我的邮箱</Text>
                                            </View>
                                            <Text style={{ color: '#999', position: 'absolute', right: 10 }}>{this.state.Email}{this.state.emailType}</Text>
                                        </View>}

                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 64,
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row', height: 20 }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>户 籍 地</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999', width: Dimensions.get('window').width / 1.2 }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            numberOfLines={2}
                                            maxLength={50}
                                            value={this.state.nativePlace}
                                            placeholder='请输入您的户籍地'
                                            onChangeText={(text) => { this.setState({ nativePlace: text }) }}
                                        /> : <View style={{ marginLeft: 10, marginTop: 10, width: Dimensions.get('window').width / 1.2 }}><Text style={{ color: '#999', marginLeft: 10 }} numberOfLines={2} >{this.state.nativePlace}</Text></View>}
                                    </View>

                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 64,
                                        //alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21 }}>毕业院校</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999', marginRight: 10 }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.educateFrom}
                                            placeholder='请输入您的毕业院校'
                                            onChangeText={(text) => { this.setState({ educateFrom: text }) }}
                                        /> : <Text style={{ color: '#999', marginLeft: 20, marginTop: 10 }}  >{this.state.educateFrom}</Text>}
                                    </View>

                                    <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 44,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21 }}>毕业时间</Text>
                                        </View>
                                        {this.state.showPop == true ? <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <DatePicker
                                                date={this.state.educateTime}
                                                mode="date"
                                                placeholder={(this.state.educateTime == undefined || this.state.educateTime == '') ? "选择时间" : this.dataChange(this.state.educateTime)}
                                                placeholderColor='red'
                                                format="YYYY-MM-DD"
                                                maxDate={new Date()}
                                                showIcon={false}

                                                customStyles={{
                                                    dateInput: {
                                                        borderColor: '#fff',
                                                        backgroundColor: '#fff', marginLeft: 50
                                                    }
                                                }}
                                                minuteInterval={10}
                                                onDateChange={(educateTime) => { this.setState({ educateTime: educateTime, ifChangeEducateTime: true }); }}
                                            />
                                        </View> : <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.educateTime}</Text>}
                                    </View>

                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 64,
                                        //alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: this.state.showPop == true ? null : 1,
                                        marginTop: 8,
                                        marginLeft: 8,
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21 }}>所学专业</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999', }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.profession}
                                            placeholder='请输入您的所学专业'
                                            onChangeText={(text) => { this.setState({ profession: text }) }}
                                        /> : <Text style={{ color: '#999', marginLeft: 20, marginTop: 10 }}  >{this.state.profession}</Text>}


                                    </View>
                                    {this.state.showPop == true ?
                                        <View style={{ width: Dimensions.get('window').width - 32 }}>
                                            <List>
                                                <Picker
                                                    data={this.state.zgxlList}
                                                    cols={1}
                                                    //value={{ label: this.state.value_education, value: this.state.value_education, dictdataName: this.state.dictdataName }}
                                                    onChange={this.onChange_education}
                                                    extra={this.state.value_education}
                                                    title='最高学历'
                                                // itemStyle={styles.pickStyle}
                                                >
                                                    <List.Item arrow="horizontal">
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 13 }}>最高学历</Text>
                                                        </View>
                                                    </List.Item>
                                                </Picker>
                                            </List>
                                        </View> :
                                        <View style={{
                                            marginBottom: 1,
                                            flexDirection: 'row',
                                            backgroundColor: "#fff",
                                            height: 44,
                                            alignItems: 'center',
                                            width: Dimensions.get('window').width - 32,
                                            borderBottomColor: '#e7e7e7',
                                            borderBottomWidth: 1,
                                            marginTop: 8,
                                            marginLeft: 8,

                                        }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21 }}>最高学历</Text>
                                            </View>
                                            <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.value_education == '不限' ? null : this.state.value_education}</Text>
                                        </View>}

                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 64,
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 10,
                                        marginLeft: 8,
                                    }}>
                                        <View style={{ flexDirection: 'row', height: 20 }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>家庭住址</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999', width: Dimensions.get('window').width / 1.2 }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            numberOfLines={2}
                                            maxLength={50}
                                            value={this.state.homeAddress}
                                            placeholder='请输入您的家庭住址'
                                            onChangeText={(text) => { this.setState({ homeAddress: text }) }}
                                        /> : <View style={{ marginLeft: 20, marginTop: 10, width: Dimensions.get('window').width / 1.2 }}><Text style={{ color: '#999' }} numberOfLines={2} >{this.state.homeAddress}</Text></View>}
                                    </View>

                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        //backgroundColor: "#fff",
                                        height: 64,
                                        //alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>紧急联系人</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999', marginRight: 10, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.urgenPerson}
                                            placeholder='请输入紧急联系人'
                                            onChangeText={(text) => { this.setState({ urgenPerson: text }) }}

                                        /> : <Text style={{ color: '#999', marginLeft: 20, marginTop: 10 }}  >{this.state.urgenPerson}</Text>}
                                    </View>

                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 64,
                                        //alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>紧急联系人是本人的</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999' }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.urgenPersonRelation}
                                            placeholder='与本人关系'
                                            onChangeText={(text) => { this.setState({ urgenPersonRelation: text }) }}
                                        /> : <Text style={{ color: '#999', marginLeft: 20, marginTop: 10 }}  >{this.state.urgenPersonRelation}</Text>}
                                    </View>
                                    <View style={{
                                        marginBottom: 1,
                                        //flexDirection: 'row',
                                        //backgroundColor: "#fff",
                                        height: 64,
                                        //alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: this.state.showPop == true ? null : 1,
                                        marginTop: 8,
                                        marginLeft: 8,
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>紧急联系人联系方式</Text>
                                        </View>
                                        {this.state.showPop ? <TextInput
                                            style={{ marginLeft: 15, fontSize: Config.MainFontSize, color: '#999', marginRight: 10, }}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.urgenPhone}
                                            placeholder='联系方式'
                                            maxLength={11}
                                            onChangeText={(text) => { this.setState({ urgenPhone: text }) }}
                                            onBlur={() => this.handlePhoneBlur(this.state.urgenPhone)}
                                        /> : <Text style={{ color: '#999', marginLeft: 20, marginTop: 10 }}  >{this.state.urgenPhone}</Text>}
                                    </View>


                                    <View style={{
                                        backgroundColor: "#fff",
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: this.state.showPop == true ? null : 1,
                                    }}>
                                        <View style={{ width: 5 }} />
                                        {this.state.showPop ? <View>
                                            <List>
                                                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                    <VectorIcon name={"certificate"} size={18} color={'red'} style={{ backgroundColor: 'transparent', marginTop: 12, marginLeft: 10 }} />
                                                    <Text style={{ marginTop: 12, fontSize: Config.MainFontSize, marginLeft: 5 }}>证件栏</Text>
                                                    <View>
                                                        {/* <TouchableOpacity onPress={this.ifOpen_zhengjian.bind(this)} style={{ alignSelf: 'center', marginLeft: 80 }}>
                                                        <VectorIcon name={this.state.ifOpen[2].open ? 'ios-arrow-down' : 'ios-arrow-right'} size={20} style={{ color: 'rgb(22,131,251)', alignSelf: 'center', position: 'absolute', right: 20, marginTop: 12 }} />
                                                    </TouchableOpacity> */}
                                                    </View>
                                                </View>
                                                {(this.state.ifOpen[2].open == true) ?
                                                    this.zhicheng() : null}
                                            </List>
                                        </View> : <View style={{
                                            marginBottom: 1,
                                            flexDirection: 'row',
                                            backgroundColor: "#fff",
                                            height: 34,
                                            alignItems: 'center',
                                            width: Dimensions.get('window').width - 32,
                                            borderBottomColor: '#e7e7e7',
                                            borderBottomWidth: this.state.showPop == true ? null : 1,
                                            marginTop: 10,
                                            marginLeft: 8,

                                        }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21, paddingBottom: 5 }}>所持证件</Text>
                                                </View>
                                                <View style={{ position: 'absolute', backgroundColor: 'transparent', right: 1, width: (this.state.professionCertificate.length > 14) ? deviceWidth / 1.5 : null }}>
                                                    <Text style={{ color: '#999', }}  >{this.state.professionCertificate}</Text>
                                                </View>
                                            </View>}
                                    </View>
                                </View> : null}
                            <View style={{ width: deviceWidth - 18, height: 20, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />

                            <View style={{ width: deviceWidth - 18, height: 20, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8 }}>
                                <View><Image style={{ marginLeft: 8, marginTop: 2 }} source={require('../../image/sx.png')} /></View>
                                <View><Text style={{ fontSize: Config.MainFontSize + 2, marginLeft: 5 }}>求职意向</Text></View>
                                <View>
                                    {/* <TouchableOpacity onPress={this.ifOpen_qiuzhi.bind(this)} style={{ alignSelf: 'center', marginLeft: 80 }}>
                                    <VectorIcon name={this.state.ifOpen[1].open ? 'ios-arrow-down' : 'ios-arrow-right'} size={20} style={{ color: 'rgb(22,131,251)', alignSelf: 'center', position: 'absolute', right: 30 }} />
                                </TouchableOpacity> */}
                                </View>
                            </View>
                            {(this.state.ifOpen[1].open) ? <View>
                                {this.state.showPop == true ? <View style={{ width: Dimensions.get('window').width - 32, height: 44, marginLeft: 8 }}>
                                    <List>
                                        <Picker
                                            data={data_fangshi}
                                            cols={1}
                                            value={{ label: this.state.value_fangshi, value: this.state.value_fangshi }}
                                            onChange={this.onChange_fangshi}
                                            extra={this.state.value_fangshi}
                                            title='工作方式'
                                        >
                                            <List.Item arrow="horizontal" onPress={this.qjlx}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6 }}>*</Text>
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>工作方式</Text>
                                                </View>
                                            </List.Item>
                                        </Picker>
                                    </List>
                                </View> :
                                    <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 44,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize, width: 6, marginLeft: 5 }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>工作方式</Text>
                                        </View>
                                        <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.value_fangshi}</Text>
                                    </View>}
                                {this.state.showPop == true ? <View style={{ width: Dimensions.get('window').width - 32, height: 44, marginLeft: 8 }}>
                                    <List >
                                        <Picker
                                            data={this.state.zxyqList}
                                            cols={1}
                                            //value={{ label: this.state.value_payment, value: this.state.value_payment }}
                                            onChange={this.onChange_payment}
                                            extra={this.state.value_payment}
                                            title='薪资范围'
                                        >
                                            <List.Item arrow="horizontal" onPress={this.qjlx}   >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 16 }}>薪资范围</Text>
                                                </View>
                                            </List.Item>
                                        </Picker>
                                    </List>
                                </View> :
                                    <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 44,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21 }}>薪资范围</Text>
                                        </View>
                                        <Text style={{ color: '#999', position: 'absolute', right: 10 }}  >{this.state.value_payment}</Text>
                                    </View>}

                                <View style={{
                                    backgroundColor: "#fff",
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: this.state.showPop == true ? null : 1,
                                }}>
                                    <View style={{ width: 5 }} />
                                    {this.state.showPop ? <View>
                                        <List>
                                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                <VectorIcon name={"ios-timer"} size={18} color={'red'} style={{ backgroundColor: 'transparent', marginTop: 12, marginLeft: 8 }} />
                                                <Text style={{ marginTop: 12, fontSize: Config.MainFontSize, marginLeft: 3 }}>兼职时间</Text>
                                                <View>
                                                    {/* <TouchableOpacity onPress={this.ifOpen_jianzhi.bind(this)} style={{ alignSelf: 'center', marginLeft: 80 }}>
                                                    <VectorIcon name={this.state.ifOpen[4].open ? 'ios-arrow-down' : 'ios-arrow-right'} size={20} style={{ color: 'rgb(22,131,251)', alignSelf: 'center', position: 'absolute', right: 20, marginTop: 12 }} />
                                                </TouchableOpacity> */}
                                                </View>
                                            </View>
                                            {(this.state.ifOpen[4].open == true) ?
                                                this.jianzhi() : null}

                                        </List>
                                    </View> : <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 34,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 21, paddingBottom: 5 }}>兼职时间</Text>
                                            </View>
                                            <Text style={{ color: '#999', position: 'absolute', right: 0, paddingBottom: 5 }}  >{this.state.partTime}</Text>
                                        </View>}
                                </View>

                                <View style={{
                                    backgroundColor: "#fff",
                                    borderBottomColor: '#e7e7e7',
                                    borderBottomWidth: this.state.showPop == true ? null : 1,
                                }}>
                                    <View style={{ width: 5 }} />
                                    {this.state.showPop ? <View>
                                        {/* <List>
                                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                                <VectorIcon name={"bookmark2"} size={18} color={'red'} style={{ backgroundColor: 'transparent', marginTop: 12, marginLeft: 10 }} />
                                                <Text style={{ marginTop: 12, fontSize: Config.MainFontSize, marginLeft: 5 }}>意向行业</Text>
                                                <View>
                                                    <TouchableOpacity onPress={this.ifOpen_zhiwei.bind(this)} style={{ alignSelf: 'center', marginLeft: 80 }}>
                                                        <VectorIcon name={this.state.ifOpen[3].open ? 'ios-arrow-down' : 'ios-arrow-right'} size={20} style={{ color: 'rgb(22,131,251)', alignSelf: 'center', position: 'absolute', right: 20, marginTop: 12 }} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            {(this.state.ifOpen[3].open == true) ?
                                                this.zhiwei() : null}
                                        </List> */}
                                        <TouchableOpacity onPress={() => Actions.Intended({ dataSource: this.state.zwList, onblock: this.handleIntended.bind(this) })} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 54 }}>
                                            <VectorIcon name={"bookmark2"} size={18} color={'red'} style={{ position: 'absolute', backgroundColor: 'transparent', marginTop: 12, marginLeft: 10 }} />
                                            <Text style={{ fontSize: Config.MainFontSize, color: '#222222', marginLeft: 30 }}>意向行业</Text>
                                            <Text style={{ color: '#949494', marginRight: 30 }}>{this.state.postCode || '请选择'}</Text>
                                            <VectorIcon name='ios-arrow-right' size={20} style={{ color: '#949494', position: 'absolute', right: 10 }} />
                                        </TouchableOpacity>
                                    </View> : <View style={{
                                        marginBottom: 1,
                                        flexDirection: 'row',
                                        backgroundColor: "#fff",
                                        height: 44,
                                        alignItems: 'center',
                                        width: Dimensions.get('window').width - 32,
                                        borderBottomColor: '#e7e7e7',
                                        borderBottomWidth: this.state.showPop == true ? null : 1,
                                        marginTop: 8,
                                        marginLeft: 8,

                                    }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'red', fontSize: Config.MainFontSize, paddingBottom: 5, width: 6, marginLeft: 5 }}>*</Text>
                                                <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10, paddingBottom: 5 }}>意向行业</Text>
                                            </View>
                                            <View style={{ backgroundColor: 'transparent', position: 'absolute', right: 1, width: (this.state.postCode.length > 14) ? deviceWidth / 1.5 : null }}>
                                                <Text style={{ color: '#999', paddingBottom: 5, }}  >{this.state.postCode}</Text>
                                            </View>
                                        </View>}
                                </View>

                            </View> : null}
                            <View style={{ width: deviceWidth - 18, height: 20, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                            <View style={{ display: 'flex', flexDirection: 'row', height: 50, alignItems: 'center' }}>
                                <Image style={{ marginLeft: 8, marginTop: 2 }} source={require('../../image/sx.png')} />
                                <Text style={{ fontSize: Config.MainFontSize + 2, marginLeft: 5 }}>工作/实习经历</Text>
                                {this.state.showPop == true ? <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 10 }} onPress={() => Actions.Wodejingli({ params: {}, onblock: this.reloadBack_wdjl.bind(this) })}>
                                    <Text style={{ marginLeft: 15, color: '#03A9F4' }}>+ 新增</Text>
                                </TouchableOpacity> : null}
                            </View>
                            <View style={{ backgroundColor: '#fff', flexDirection: "column" }}>
                                <ScrollView>
                                    {this.showExpList()}
                                </ScrollView>
                            </View>
                            <View style={{ width: deviceWidth - 18, height: 20, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                        </View>
                        {this.props.login == 1 ? this.props.update ? null : <TouchableOpacity style={{ marginTop: 20, marginBottom: 10 }} onPress={() => {
                            this.Register()
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
                                }}>完成简历</Text>
                            </View>
                        </TouchableOpacity> : null}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
        );
    }
    zhicheng() { //职称
        var temp2 = [];
        var zcList = this.state.zcList;
        var ifshow = this.state.ifShowZczj;
        // for (let i in zcList) {
        //     if (!zcList[i].dictdataIsdefault) {
        //         temp.push(
        //             <CheckboxItem
        //                 checked={ifshow[i].show}
        //                 onChange={
        //                     this.zcClick.bind(this, i)
        //                 }><Text>
        //                     {zcList[i].dictdataValue}</Text>
        //             </CheckboxItem>
        //         )
        //     }
        // }
        for (let i in zcList) {
            if (zcList[i].dictdataValue == '') {
                temp2.push(null)
            } else {
                temp2.push(
                    <View key={i} style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        {(this.state.ifShowZczj[i].show) ? <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 5 }} onPress={this.zcClick.bind(this, i)}>
                            <VectorIcon name={"c2_im_check_circle_solid"} size={20} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity> : <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 5 }} onPress={this.zcClick.bind(this, i)}>
                                <VectorIcon name={"c2_im_select_circle"} size={20} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>}
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.zcClick.bind(this, i)}>
                            <Text>{zcList[i].dictdataValue}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        }


        return temp2;
    }
    handlePhoneBlur(text) {
        const rule = /^1[0-9]{10}$/;
        if (rule.test(text) == false) {
            Toast.showInfo('请输入正确的电话号码', 1000)
            return;
        }
    }
    handlePhoneBirthday(BornDate) {
        this.setState({ BornDate: BornDate, ifChangeBirthday: true });
        let checkBornDate = TimeChange.checkAge(BornDate, 16)
        if (checkBornDate == false) {
            Toast.showInfo('请选择满16周岁的出生日期', 2000)
            return;
        }
    }
    handleEmailBlur(text) {
        if (text == '') {
            this.setState({
                emailType: ""
            })
        }
        if (emailRule.test(text + this.state.emailType) == false && text !== '') {
            Toast.showInfo('请选择邮箱类型', 1000)
            return;
        }
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
        var temp2 = [];
        var jzList = this.state.jzList;
        for (let i in jzList) {
            if (jzList[i].dictdataValue == '') {
                temp2.push(null)
            } else {
                temp2.push(
                    <View key={i} style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        {(this.state.ifShowJz[i].show) ? <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 5 }} onPress={this.jzClick.bind(this, i)}>
                            <VectorIcon name={"c2_im_check_circle_solid"} size={20} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity> : <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 5 }} onPress={this.jzClick.bind(this, i)}>
                                <VectorIcon name={"c2_im_select_circle"} size={20} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>}
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.jzClick.bind(this, i)}>
                            <Text>{jzList[i].dictdataValue}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        }
        return temp2;
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
                    ifShowJz: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: false }, { show: false },]
                })
            } else {
                this.setState({
                    partTime: this.state.jzList[i].dictdataValue,
                    ifShowJz: [{ show: false }, { show: false }, { show: false }, { show: false }, { show: true }, { show: false },]
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
                ifshow1: ifshow1
            })
        }

    }
    zhiwei() { //意向行业
        var temp2 = [];
        var bqList = this.state.zwList;
        for (let i in bqList) {
            if (bqList[i].dictdataValue == '') {
                temp2.push(null)
            } else {
                temp2.push(
                    <View key={i} style={{ flex: 1, margin: 10, flexDirection: 'row' }}>
                        {(this.state.ifShowZw[i].show) ? <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 5 }} onPress={this.zwClick.bind(this, i)}>
                            <VectorIcon name={"c2_im_check_circle_solid"} size={20} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity> : <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 5 }} onPress={this.zwClick.bind(this, i)}>
                                <VectorIcon name={"c2_im_select_circle"} size={20} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>}
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.zwClick.bind(this, i)}>
                            <Text>{bqList[i].dictdataValue}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

        }
        return temp2;
    }
    getZWName() { //进入简历获取的意向行业
        var temp2 = '';
        var temp3 = '';
        var zwList = this.state.zwList;
        var ifshow2 = this.state.ifShowZw;
        for (let i in zwList) {
            if (ifshow2[i].show) {
                temp2 = temp2 + zwList[i].dictdataValue + "  "
                temp3 = temp3 + zwList[i].dictdataName + ",";
            }
        }
        var dictdataName = (temp3.slice(temp3.length - 1) == ',') ? temp3.slice(0, -1) : temp3;
        this.setState({
            postCode: temp2,
            postName: dictdataName
        })
    }
    handleIntended(ds) {
        console.log('回调')
        console.log(ds)
        var temp2 = '';
        var temp3 = '';
        for (let i in ds) {
            if (ds[i].show) {
                temp2 = temp2 + ds[i].dictdataValue + "  ";
                temp3 = temp3 + ds[i].dictdataName + ",";
            }
        }
        var dictdataName = (temp3.slice(temp3.length - 1) == ',') ? temp3.slice(0, -1) : temp3;
        console.log(dictdataName)
        this.setState({
            postCode: temp2,
            postName: dictdataName
        })
    }
    zwClick(i) {
        var t = 0;
        var temp2 = '';
        var temp3 = '';
        var ifshow2 = this.state.ifShowZw;
        var zwList = this.state.zwList;
        this.state.ifShowZw[i].show = !this.state.ifShowZw[i].show;
        for (let i in ifshow2) {
            if (i == 0) {
                this.state.ifShowZw[i].show = false
            } else {
                if (ifshow2[i].show && i !== 0) {
                    t = t + 1
                }
            }

        }
        if (t > 3) {
            this.state.ifShowZw[i].show = false
            Toast.showInfo('最多选三个意向行业', 1000)
            temp2 = this.state.postCode
            temp3 = this.state.postName
        } else {
            for (let i in zwList) {
                if (ifshow2[i].show) {
                    temp2 = temp2 + zwList[i].dictdataValue + "  ";
                    temp3 = temp3 + zwList[i].dictdataName + ",";
                }
            }
        }
        var dictdataName = (temp3.slice(temp3.length - 1) == ',') ? temp3.slice(0, -1) : temp3;
        console.log(dictdataName)
        this.setState({
            postCode: temp2,
            ifshow2: ifshow2,
            postName: dictdataName
        })
    }
    Register() {
        //var bankCardnum = this.removeAllSpace(this.state.bankCardnum);
        if (this.state.Name == '' || this.state.Name == undefined) {
            Toast.showInfo('请输入您的姓名', 1000)
            return;
        }
        if (this.state.Phone == '' || this.state.Phone == undefined) {
            Toast.showInfo('请输入您的手机号码', 1000)
            return;
        }
        if (phoneRule.test(this.state.Phone) == false) {
            Toast.showInfo('请输入正确的号码格式', 1000)
            return;
        }
        if (this.state.Sfz == '' || this.state.Sfz == undefined) {
            Toast.showInfo('请输入您的身份证号码', 1000)
            return;
        }
        if (this.state.Email !== '' && emailRule.test(this.state.Email + this.state.emailType) == false) {
            Toast.showInfo('请输入正确的邮箱', 1000)
            return;
        }
        if (this.state.BornDate == '' || this.state.BornDate == undefined) {
            Toast.showInfo('请选择您的出生日期', 1000)
            return;
        }
        if (this.state.nativePlace == '' || this.state.nativePlace == undefined) {
            Toast.showInfo('请输入您的户籍地', 1000)
            return;
        }
        if (this.state.homeAddress == '' || this.state.homeAddress == undefined) {
            Toast.showInfo('请输入您的家庭地址', 1000)
            return;
        }
        if (this.state.urgenPerson == '' || this.state.urgenPerson == undefined) {
            Toast.showInfo('请输入紧急联系人', 1000)
            return;
        }
        if (this.state.urgenPersonRelation == '' || this.state.urgenPersonRelation == undefined) {
            Toast.showInfo('请输入紧急联系人与本人关系', 1000)
            return;
        }
        if (this.state.urgenPhone == '' || this.state.urgenPhone == undefined) {
            Toast.showInfo('请输入紧急联系人联系方式', 1000)
            return;
        }
        if (phoneRule.test(this.state.urgenPhone) == false) {
            Toast.showInfo('请输入正确的紧急联系人联系方式', 1000)
            return;
        }
        // if (this.state.value_bank == '' || this.state.value_bank == undefined) {
        //     Toast.showInfo('请选择开户行信息', 1000)
        //     return;
        // }
        // if (this.state.OPENBANK_ZH == '' || this.state.OPENBANK_ZH == undefined) {
        //     Toast.showInfo('请输入开户行支行', 1000)
        //     return;
        // }
        // if (bankCardnum.length > 19 || bankCardnum.length < 12 || bankCardnum == '' || bankCardnum == undefined) {
        //     Toast.showInfo('请输入正确的银行卡卡号', 1000)
        //     return;
        // }
        if (this.state.value_fangshi == '' || this.state.value_fangshi == undefined) {
            Toast.showInfo('请选择工作方式', 1000)
            return;
        }
        if (this.state.postCode.length == 0) {
            Toast.showInfo('请选择意向行业', 1000)
            return;
        }
        this.save();
    }
    showExpList() {
        var temp = [];
        if (!this.state.workExperience.length == 0) {
            for (let i in this.state.workExperience) {
                temp.push(
                    <View key={i} style={{ marginTop: 20, marginBottom: 20, marginLeft: 10 }} onPress={() => { Actions.Wodejingli({ params: { rowData: this.state.workExperience[i], i: i, type: 'edit', }, onblock: this.reloadBack_wdjl.bind(this) }) }}>
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
                    num: this.state.i + 1,
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
                        num: this.state.i + 1,
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
}

const styles = StyleSheet.create({
    contentCon: {
        paddingVertical: 0
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
    pickStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000000'
    },
});

