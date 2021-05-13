/**
 * 申请开票
 * 曾一川
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { NavigationBar, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const emailRule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
const phoneRule = /^1[34578]\d{9}$/; //手机号码验证(正则)
export default class RequireTicket_new extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            templateCode: '',
            M: false,
            W: true,
            buyType: "",
            orderno: "",
            invoicedate: "",
            buyername: "",
            taxnum: "",
            address: "",
            telephone: "",
            account: "",
            clerk: "",
            payee: "",
            checker: "",
            kptype: "",
            phone: "",
            saleaccount: "",
            saleaddress: "",
            salephone: "",
            saletaxnum: "",
            message: "",
            fpdm: "",
            fphm: "",
            tsfs: "",
            email: "",
            qdbz: "",
            qdxmmc: "",
            dkbz: "",
            deptid: "",
            clerkid: "",
            cpybz: "",
            billInfoNo: "",
            bankAccount: '',
            registrationNumber: '',
            total: this.props.total.toFixed(2),
            money: this.props.money.toFixed(2),
            serviceMoney: (this.props.serviceMoney == undefined) ? '0' : this.props.serviceMoney.toFixed(2),
            nowTiming: '',
            nowDate: '',
            result: '',
            kce: 0,
            zonghe: "0",
            fuwufei: "0",
            info: '',
            modalVisible: false,
            remark: '',
            detail: [{
                goodsname: "",
                num: "",
                price: "",
                hsbz: "",
                taxrate: "",
                spec: "",
                unit: "",
                spbm: "",
                fphxz: ""

            }]
        };
        this.getMySalary()
        this.getTime()
        this.getTax()
        this.getTaxmoney()
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=开票税率', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                this.setState({
                    taxrate: JSON.parse(json).result[1].dictdataValue
                })
            }
            )

    }
    ifAgree() {
        this.setState({ read: !this.state.read })
    }
    getTaxmoney() {
        var Total = "0";
        var ServiceMoney = "0";
        for (let i in this.props.rowBack) {
            if (this.props.rowBack[i].total != undefined) {
                Total = JSON.parse(this.props.rowBack[i].total) + JSON.parse(Total)
            }
            if (this.props.rowBack[i].serviceMoney != undefined) {
                ServiceMoney = JSON.parse(this.props.rowBack[i].serviceMoney) + JSON.parse(ServiceMoney)
            }
        }
        this.setState({ zonghe: Total, fuwufei: ServiceMoney })
    }
    getMySalary() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + "/companyRegistInfo/getOneCompanyInfo", entity)
            .then((res) => {
                console.log(res)
                this.setState({
                    info: res,
                    address: res.companyAddress,
                    account: res.bankAccount,
                    registrationNumber: res.registrationNumber
                })
            })
    }
    getTax() {
        Fetch.postJson(Config.mainUrl + '/ws/getSeqorderno', { type: 'KP', fags: true })
            .then((res) => {
                this.setState({
                    orderno: res.result
                })
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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>申请开票</Text>
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

                                {/* <View style={{ width: deviceWidth - 40, height: 40, backgroundColor: 'white', margin: 10, flexDirection: 'row' }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize, marginLeft: 6, marginTop: 15 }}>*</Text>
                                    <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 11, marginTop: 15 }}>购买类型</Text>
                                    <TouchableOpacity onPress={this.pres1.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 140, top: 10 }}>
                                        {this.state.M == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 5 }}>个人</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.pres2.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 20, top: 10 }}>
                                        {this.state.W == false ? <Image source={require('../../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 5 }} /> :
                                            <Image source={require('../../image/Group.png')} style={{ height: 14, width: 14, marginTop: 5 }} />}
                                        <View>
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 5 }}>企业</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={styles.first1}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>名称</Text>
                                    </View>
                                    <Text
                                        style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 4, }}
                                    >{this.state.info.companyName}</Text>
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        {this.state.M == true ? null :
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>}
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>税号</Text>
                                    </View>
                                    {/* {this.state.M == true ? null : <Text
                                        style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 4, }}
                                    >{this.state.registrationNumber}</Text>} */}
                                    <TextInput
                                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        value={this.state.registrationNumber}
                                        placeholder=' '
                                        onChangeText={(text) => { this.setState({ registrationNumber: text }) }}
                                    />
                                </View>

                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>手机号</Text>
                                    </View>
                                    <TextInput
                                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        value={this.state.phone}
                                        keyboardType='numeric'
                                        placeholder=' '
                                        onChangeText={(text) => { this.setState({ phone: text }) }}
                                    />
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        {this.state.M == true ? null :
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>}
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>地址</Text>
                                    </View>
                                    <TextInput
                                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        value={this.state.address}
                                        placeholder=' '
                                        onChangeText={(text) => { this.setState({ address: text }) }}
                                    />
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* {this.state.M == true ? null :
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>} */}
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>银行账号</Text>
                                    </View>
                                    <TextInput
                                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        value={this.state.account}
                                        keyboardType='numeric'
                                        placeholder={this.state.account}
                                        onChangeText={(text) => { this.setState({ account: text }) }}
                                    />
                                </View>
                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>邮箱</Text>
                                    </View>
                                    <TextInput
                                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        value={this.state.email}
                                        placeholder=' '
                                        onChangeText={(text) => { this.setState({ email: text }) }}
                                    />
                                </View>
                                {/* <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>备注</Text>
                                    </View>
                                    <TextInput
                                        style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={false}
                                        placeholderTextColor="#c4c4c4"
                                        value={this.state.remark}
                                        placeholder=' '
                                        onChangeText={(text) => { this.setState({ remark: text }) }}
                                    />
                                </View> */}


                                <View style={styles.first}>
                                    <View style={{ width: 5 }} />
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> */}
                                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>总额(含服务费)</Text>
                                    </View>
                                    <Text
                                        style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 4, }}
                                    >{this.state.total}</Text>
                                </View>
                            </View>
                            <View style={styles.first}>
                                <View style={{ width: 5 }} />
                                <View style={{ flexDirection: 'row' }}>
                                    {/* <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> */}
                                    <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>服务费</Text>
                                </View>
                                <Text
                                    style={{ flex: 1, fontSize: Config.MainFontSize, textAlign: 'right', marginRight: 4, }}
                                >{this.state.serviceMoney}</Text>
                            </View>
                        </View>
                        <View style={{ width: deviceWidth - 18, height: 10, backgroundColor: '#f5f5f5', alignSelf: 'center', borderRadius: 5 }} />
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: true })} style={{ backgroundColor: 'transparent', flexDirection: 'row', marginTop: 10, alignSelf: 'center' }} >
                        <Text style={{ color: 'grey', fontSize: Config.MainFontSize }}>请阅读并勾选工薪易平台</Text><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize }}>发票开具规则</Text>
                        <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.read == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                    </TouchableOpacity>
                    {this.state.read == true ?
                        <TouchableOpacity style={{ marginTop: 20, marginBottom: 30 }} onPress={() => {
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
                                }}>申请</Text>
                            </View>
                        </TouchableOpacity> :
                        <View style={{ marginTop: 20, marginBottom: 30 }}>
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
                                }}>申请</Text>
                            </View>
                        </View>}
                </ScrollView>
                {this.zerenModal()}
            </View >
        );
    }
    getTime() {
        fetch(Config.mainUrl + '/fqrzAttendance/getCurrentTimeApp', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.text())
            .then((res) => {
                this.setState({
                    nowTiming: JSON.parse(res).time,
                    nowDate: JSON.parse(res).date,
                })
            })
    }
    onPressAgreement1() {
        this.setState({ modalVisible: false })
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement7.html', title: '“工薪易”平台发票开具规则', popCallback: this.handlePop.bind(this) })
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
                            <Text style={{ color: 'white', position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>“工薪易”平台发票开具规则</Text>
                            <VectorIcon name={'security'} style={{ color: 'white', fontSize: 80, position: 'absolute', marginTop: 50, alignSelf: 'center', backgroundColor: 'transparent' }} />
                        </ImageBackground>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement1()}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台发票开具规则》</Text>
                        </TouchableOpacity>
                        {/* <ScrollView style={{ marginBottom: 80, backgroundColor: 'white', width: deviceWidth - 60, alignSelf: 'center', height: deviceHeight / 3 }}>
                            <View>
                                <Text style={{ marginTop: 10 }}>
                                    第一条
    为维护“工薪易”平台用户的合法权益，根据我国税务相关法律规定及“工薪易”平台发布的文件、规则，制定本规则。
    第二条
    本规则适用于所有在“工薪易”平台进行的交易。发活方承诺并保证其在“工薪易”平台上发布的项目需求及任务信息真实、准确无误导性，发活方承诺提供资料之真实性、合法性、准确性和完整性，不存在任何虚假、误导、违法情形，不会侵犯任何第三方的合法权益。发活方应当保证本合作资金来源的稳定性及合法性,若因资金自身存在的问题并由此带来的一切后果及法律责任由发活方自行承担。
    发票开具应依照发活方验收的项目或上传“工薪易”平台《批量验收项目发佣金》验收的项目为准，发活方保证发票内容与接活方真实提供服务内容以及发活方验收的内容一致，否则“工薪易”平台有权上报相关国家相关机关并追究发活方及接活方相关责任。
    第三条
    “工薪易”平台服务费的发票将在交易结束“工薪易”平台实际收取接包/转包服务内容开具服务费。“工薪易”平台有权对相关服务进行审查，如果出现虚假业务、虚开发票、洗钱、违反国家相应规定等违法行为，“工薪易”平台有权解除合同，停止所有操作并向相关部门进行举报。
    第四条
    “工薪易”平台就电子订单项下的实际交易内容开具相关发票，只提供所收取的接包服务费、发包服务费（如有）、其它增值服务费（如有）的相应发票。
    第五条
    交易结束后，“工薪易”平台将根据用户提供的真实的服务内容开具对应类型（个人或单位）的发票邮寄给发活方用户。
    第六条
    发票一旦开具，就无法更改发票内容，请用户务必准确填写发票抬头付款人的企业名称或个人姓名及详细联系方式，因用户填写信息错误所导致发票的错误或与真实的业务不一致，“工薪易”平台不承担任何责任。
    第七条 本规则自发布之日起实行。

</Text>
                            </View>
                        </ScrollView> */}
                        <TouchableOpacity style={{ width: deviceWidth - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', position: 'absolute', bottom: 10, right: 20, borderRadius: 5 }} onPress={this.Temporary.bind(this)}><View><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>同意并继续</Text></View></TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
    Temporary() {
        this.setState({
            modalVisible: false,
            read: true
        })
    }
    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-' +
            (d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()) + ' ' +
            (d.getHours() < 10 ? '0' + (d.getHours()) : d.getHours()) + ':' +
            (d.getMinutes() < 10 ? '0' + (d.getMinutes()) : d.getMinutes()) + ':' +
            (d.getSeconds() < 10 ? '0' + (d.getSeconds()) : d.getSeconds())
        return date;
    }


    save() {
        // if (this.state.W == false && this.state.M == false) {
        //     Toast.showInfo('请选择购买类型', 1000);
        //     return
        // }
        // else 
        if (this.state.phone == '' || phoneRule.test(this.state.phone) == false) {
            Toast.showInfo('请填写正确的购方手机号码', 1000);
            return
        }
        if (this.state.registrationNumber == '') {
            Toast.showInfo('请填写税号', 1000);
            return
        }
        if (this.state.email == '' || emailRule.test(this.state.email) == false) {
            Toast.showInfo('请填写正确的购方邮箱', 1000);
            return
        }
        if (this.state.address == '') {
            Toast.showInfo('请填写购方地址', 1000);
            return
        }
        // if (this.state.account == '') {
        //     Toast.showInfo('请填写购方银行账号', 1000);
        //     return
        // }
        // var einvoiceOrder = {
        //     "templateCode": "modelCode0002",//
        //     "buyType": '1',
        //     "orderno": this.state.orderno,//
        //     "kptype": "1",//
        //     "fphxz": "1",//
        //     "invoicedate": this.timeChange(Date.parse(new Date())),//
        //     "invoiceLine": "p",
        //     'buyername': this.state.info.companyAddress,
        //     "taxnum": this.state.registrationNumber,
        //     "address": this.state.address,
        //     "phone": this.state.phone,
        //     "account": this.state.info.bankName + " " + this.state.account,
        //     "email": this.state.email,
        //     "tsfs": "0",
        //     "message": '差额征税：' + this.state.money + '。',
        //     // "clerk": "开票人",
        //     // "payee": "收款人",
        //     // "checker": "复核人",
        //     // "phone": "13027437629",
        //     // "saleaccount": "建设银行 88888888747",
        //     // "saleaddress": "湖南长沙市五一路800号中隆国际",
        //     // "salephone": "0731-85678421",
        //     // "saletaxnum": "339901999999516",
        //     // "message": '差额征税：' + this.state.money + '.00。',
        //     // "fpdm": "",
        //     // "fphm": "",
        //     // "tsfs": "0",
        //     // "email": this.state.email,
        //     // "qdbz": "0",
        //     // "qdxmmc": "",
        //     // "dkbz": "",
        //     // "deptid": "",
        //     // "clerkid": "",
        //     // "cpybz": "",
        //     // "billInfoNo": "",
        //     "detail": [{
        //         "goodsname": "*人力资源外包服务*服务费",
        //         "num": "1",
        //         "price": this.state.total,
        //         "hsbz": "1",
        //         "taxrate": this.state.taxrate / 100,
        //         // "spec": "50mg*40s/盒",
        //         // "unit": "盒",
        //         "spbm": "",
        //         "fphxz": "0",
        //         "kce": this.state.money,
        //     }]
        // }
        var id = UUID.v4();
        var einvoiceOrder = {
            fpqqlsh: id,
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            einvoiceOrder: {
                "id": id,
                "buyername": this.state.info.companyName,
                "taxnum": this.state.registrationNumber,
                "address": this.state.address,
                "phone": this.state.phone,
                "account": this.state.info.bankName + " " + this.state.account,
                "email": this.state.email,
                "total": JSON.parse(this.state.total),
                "service": JSON.parse(this.state.serviceMoney),
                "message": this.state.remark,
            },
            list: this.props.rowBack
        }
        Fetch.postJson(Config.mainUrl + '/einvoiceOrderxxkp/einvoiceorderApp', einvoiceOrder)
            .then((res) => {
                // alert(JSON.stringify(res))
                if (res.rcode == "1") {
                    Toasts.show('申请成功', { position: -80 });
                    Actions.pop({ refresh: { test: UUID.v4() } })
                } else {
                    Toasts.show(res.Msg, { position: -80 });
                }
            })
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
    first1: {
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 44,
        alignItems: 'center',
        width: Dimensions.get('window').width - 40,
        borderBottomColor: '#e7e7e7',
        borderBottomWidth: 1,
        borderTopColor: '#e7e7e7',
        borderTopWidth: 1,
        marginTop: 8,
        marginLeft: 8
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

