/**
 * 发票申请
 * 伍钦
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Keyboard, Platform, Image, ScrollView, TextInput, ListView, Alert, TouchableOpacity, ImageBackground, Modal, KeyboardAvoidingView, BackHandler } from 'react-native';
import { NavigationBar, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const bankRule = /^([1-9]{1})(\d{14}|\d{18})$/
const bankRule1 = /\b\d{12,19}\b/
//保留两位小数，不改变数据类型（若第二位小数为0，则保留一位小数）
function keepTwoDecimal(num) {
    //debugger
    var result = parseFloat(num);
    if (isNaN(result)) {
        return
    }
    result = Math.round(num * 100) / 100;
    return result
}
export default class ApplyFP extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            keyboardHeight: '',  // 键盘高度
            value: '',
            total: '',
            bl: 0,
            saleName: "",
            buyername: "",
            taxnum: "",
            phone: "",
            address: "",
            account: "",
            accountbank: "",
            taxCode: "",
            goodsortaxname: "",
            unit: '',
            number: "",
            remarkfp: '',
            recipient: '',
            recipientphone: '',
            recipientaddress: '',
            accountInfoZHMC: "",
            accountInfoZH: "",
            accountInfoKHH: "",
            read: false,//是否勾选协议,
            fapiaoDetail: {},
            clerk: "",
            payee: '',
            checker: '',
            rowDataType: ''
        };
        Fetch.getJson(Config.mainUrl + '/einvoiceOrderxxkp/getServiceByuserId')
            .then((json) => {
                // debugger
                this.setState({
                    bl: json.servicebl//服务费比例
                })
            })
        this.getAccount()
        this.getFapiaoDetail()
    }
    // 监听键盘弹出与收回
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
    }
    componentWillReceiveProps(nextProps) {
        Actions.pop({ refresh: { test: UUID.v4() } })
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
    //获取打款方
    getAccount() {
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=平台方信息', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                //debugger
                const accountTemp = JSON.parse(json).result
                for (var k in accountTemp) {
                    if (accountTemp[k].dictdataName == "ZHMC") {
                        this.setState({ accountInfoZHMC: accountTemp[k].dictdataValue })
                    }
                    if (accountTemp[k].dictdataName == "ZH") {
                        this.setState({ accountInfoZH: accountTemp[k].dictdataValue })
                    }
                    if (accountTemp[k].dictdataName == "KHH") {
                        this.setState({ accountInfoKHH: accountTemp[k].dictdataValue })
                    }
                }
            })
    }
    //获取发票详情,判断是申请页面还是查看页面
    getFapiaoDetail() {
        //debugger
        if (this.props.rowData !== undefined) {
            const listId = this.props.rowData.id
            Fetch.getJson(Config.mainUrl + '/einvoiceOrderxxkp/' + listId)
                .then((res) => {
                    // debugger
                    this.setState({
                        fapiaoDetail: res,
                        rowDataType: this.props.rowDataType
                    })
                })
        }
    }

    render() {
        const fapiaoDetail = this.state.fapiaoDetail
        var rowDataType = this.state.rowDataType
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        {fapiaoDetail.id == undefined ? <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>{this.props.theme == '1' ? "专票申请" : "普票申请"}</Text>
                            : <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>发票详情</Text>}
                    </View>
                    <TouchableOpacity style={{ marginTop: 42, position: 'absolute', right: 10, backgroundColor: 'transparent' }} onPress={() => Actions.ApplyFPList()}>
                        {fapiaoDetail.id == undefined ? <Text style={{ color: 'white' }}>查看</Text> : null}
                    </TouchableOpacity>
                </ImageBackground>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={-this.state.keyboardHeight}>
                    <ScrollView style={{ flex: 1 }} onPress={() => { Keyboard.dismiss() }} >
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
                                        {/* <View style={{ width: 5 }} /> */}
                                        <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                            {this.props.theme == "1" ? <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> : null}
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>销售方公司名称</Text>
                                        </View>
                                        {fapiaoDetail.saleName == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.saleName}
                                            placeholder='销售方公司名称'
                                            onChangeText={(text) => { this.setState({ saleName: text }) }}

                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.saleName == "" && !fapiaoDetail.saleName) ? "无" : fapiaoDetail.saleName}</Text>}
                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>购买方公司名称</Text>
                                        </View>
                                        {fapiaoDetail.buyername == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.buyername}
                                            placeholder='购买方公司名称'
                                            onChangeText={(text) => { this.setState({ buyername: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.buyername == "" || !fapiaoDetail.buyername) ? "无" : fapiaoDetail.buyername}</Text>}
                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>纳税人识别号</Text>
                                        </View>
                                        {fapiaoDetail.taxnum == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.taxnum}
                                            maxLength={15}
                                            placeholder='请输入纳税人识别号'
                                            onChangeText={(text) => { this.setState({ taxnum: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.taxnum == "" || !fapiaoDetail.taxnum) ? "无" : fapiaoDetail.taxnum}</Text>}

                                    </View>

                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.props.theme == "1" ? <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> : null}
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>手机号</Text>
                                        </View>
                                        {fapiaoDetail.phone == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.phone}
                                            keyboardType='numeric'
                                            placeholder='请输入手机号码'
                                            maxLength={11}
                                            onChangeText={(text) => { this.setState({ phone: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.phone == "" || !fapiaoDetail.phone) ? "无" : fapiaoDetail.phone}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.props.theme == "1" ? <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> : null}
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>地址</Text>
                                        </View>
                                        {fapiaoDetail.address == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.address}
                                            placeholder='请输入地址'
                                            onChangeText={(text) => { this.setState({ address: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.address == "" || !fapiaoDetail.address) ? "无" : fapiaoDetail.address}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.props.theme == "1" ? <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> : null}
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>购方开户行</Text>
                                        </View>
                                        {fapiaoDetail.accountbank == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.accountbank}
                                            placeholder='请输入开户行'
                                            onChangeText={(text) => { this.setState({ accountbank: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.accountbank == "" || !fapiaoDetail.accountbank) ? "无" : fapiaoDetail.accountbank}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.props.theme == "1" ? <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> : null}
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>银行账号</Text>
                                        </View>
                                        {fapiaoDetail.account == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.account}
                                            keyboardType='numeric'
                                            placeholder='请输入账号'
                                            onChangeText={(text) => { this.setState({ account: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.account == "" || !fapiaoDetail.account) ? "无" : fapiaoDetail.account}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            {this.props.theme == "1" ? <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> : null}
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>税收编码</Text>
                                        </View>
                                        {fapiaoDetail.taxCode == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.taxCode}
                                            placeholder='例如：现代服务业'
                                            onChangeText={(text) => { this.setState({ taxCode: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.taxCode == "" || !fapiaoDetail.taxCode) ? "无" : fapiaoDetail.taxCode}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>货物或应税劳务、服务名称</Text>
                                        </View>
                                        {fapiaoDetail.goodsortaxname == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.goodsortaxname}
                                            placeholder='例如：咨询费'
                                            maxLength={30}
                                            onChangeText={(text) => { this.setState({ goodsortaxname: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.goodsortaxname == "" || !fapiaoDetail.goodsortaxname) ? "无" : fapiaoDetail.goodsortaxname}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>单位</Text>
                                        </View>
                                        {fapiaoDetail.unit == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.unit}
                                            maxLength={5}
                                            placeholder='例如：项'
                                            onChangeText={(text) => { this.setState({ unit: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.unit == "" || !fapiaoDetail.unit) ? "无" : fapiaoDetail.unit}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>数量</Text>
                                        </View>
                                        {fapiaoDetail.id == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.number}
                                            maxLength={5}
                                            keyboardType='numeric'
                                            placeholder='例如：1'
                                            onChangeText={(text) => { this.setState({ number: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.number == undefined || !fapiaoDetail.number) ? "无" : fapiaoDetail.number}</Text>}

                                    </View>

                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>发票备注栏</Text>
                                        </View>
                                        {fapiaoDetail.remarkfp == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.remarkfp}
                                            placeholder='默认无，如有需求请填写'
                                            onChangeText={(text) => { this.setState({ remarkfp: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.remarkfp == "" || !fapiaoDetail.remarkfp) ? "无" : fapiaoDetail.remarkfp}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>开票员</Text>
                                        </View>
                                        {fapiaoDetail.clerk == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.clerk}
                                            placeholder='自开时需填写，代开可不填'
                                            onChangeText={(text) => { this.setState({ clerk: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.clerk == "" || !fapiaoDetail.clerk) ? "无" : fapiaoDetail.clerk}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>收款人</Text>
                                        </View>
                                        {fapiaoDetail.payee == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.payee}
                                            placeholder='默认无，如有需求请填写'
                                            onChangeText={(text) => { this.setState({ payee: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.payee == "" || !fapiaoDetail.payee) ? "无" : fapiaoDetail.payee}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>复核人</Text>
                                        </View>
                                        {fapiaoDetail.checker == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.checker}
                                            placeholder='默认无，如有需求请填写'
                                            onChangeText={(text) => { this.setState({ checker: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.checker == "" || !fapiaoDetail.checker) ? "无" : fapiaoDetail.checker}</Text>}

                                    </View>

                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>邮寄收件人</Text>
                                        </View>
                                        {fapiaoDetail.recipient == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.recipient}
                                            placeholder='请输入邮寄收件人'
                                            onChangeText={(text) => { this.setState({ recipient: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.recipient == "" || !fapiaoDetail.recipient) ? "无" : fapiaoDetail.recipient}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>收件人联系方式</Text>
                                        </View>
                                        {fapiaoDetail.recipientphone == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            keyboardType='numeric'
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.recipientphone}
                                            placeholder='请输入联系方式'
                                            maxLength={11}
                                            onChangeText={(text) => { this.setState({ recipientphone: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.recipientphone == "" || !fapiaoDetail.recipientphone) ? "无" : fapiaoDetail.recipientphone}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>邮寄地址</Text>
                                        </View>
                                        {fapiaoDetail.recipientaddress == undefined && rowDataType != 'CK' ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            value={this.state.recipientaddress}
                                            placeholder='请输入邮寄地址'
                                            onChangeText={(text) => { this.setState({ recipientaddress: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.recipientaddress == "" || !fapiaoDetail.recipientaddress) ? "无" : fapiaoDetail.recipientaddress}</Text>}

                                    </View>
                                    <View style={styles.first}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "red", fontSize: Config.MainFontSize, marginLeft: 10 }}>总额(单位:元)</Text>
                                        </View>
                                        {fapiaoDetail.total == undefined ? <TextInput
                                            style={styles.inputStyle}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={false}
                                            placeholderTextColor="#c4c4c4"
                                            keyboardType='numeric'
                                            value={this.state.total}
                                            placeholder='例如：1'
                                            onChangeText={(text) => { this.setState({ total: text }) }}
                                        /> : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', margin: 10 }}>{(fapiaoDetail.total == "" || !fapiaoDetail.total) ? "无" : fapiaoDetail.total}</Text>}

                                    </View>
                                    <View style={[styles.first, { display: "flex", flexDirection: "row", height: 44, alignItems: "center" }]}>
                                        <View style={{ width: 5 }} />
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                            <Text style={{ color: "red", fontSize: Config.MainFontSize, marginLeft: 10 }}>服务费(元)</Text>
                                        </View>
                                        {fapiaoDetail.service == undefined ? <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 4, }} >{keepTwoDecimal(this.state.total * this.state.bl / 100)}</Text>
                                            : <Text style={{ flex: 1, fontSize: Config.MainFontSize, color: '#222', textAlign: 'right', marginRight: 4, }}>{keepTwoDecimal(fapiaoDetail.total * this.state.bl / 100)}</Text>}

                                    </View>
                                </View>
                            </View>
                        </View>
                        {fapiaoDetail.id !== undefined ? null :
                            <View>
                                <TouchableOpacity onPress={() => this.onPressAgreement()} style={{ backgroundColor: 'transparent', flexDirection: 'row', marginTop: 10, alignSelf: 'center' }} >
                                    <Text style={{ color: 'grey', fontSize: Config.MainFontSize }}>请阅读并勾选工薪易平台</Text><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize }}>发票开具规则</Text>
                                    <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.read == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                                </TouchableOpacity>
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
                                        }}>{"提交"}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        {fapiaoDetail.id == undefined ? null :
                            <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                                <Text style={{ fontSize: Config.MainFontSize }}>薪税服务费收款账号信息</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>账号名称：{this.state.accountInfoZHMC}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>账号：{this.state.accountInfoZH}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 1 }}>开户行：{this.state.accountInfoKHH}</Text>
                            </View>}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
        );
    }
    ifAgree() {
        this.setState({ read: !this.state.read })
    }
    onPressAgreement() {
        Actions.C2WebView({ url: Config.mainUrl + '/view/agreement7.html', title: '“工薪易”平台发票开具规则' })
    }
    save() {
        const ruleTel = /^1[0-9]{10}$/;
        if (this.state.saleName == '' && this.props.theme == "1") {
            Toast.showInfo('请填写销售方公司名称', 1000);
            return
        }

        if (this.state.buyername == '') {
            Toast.showInfo('请填写购买方公司名称', 1000);
            return
        }
        if (this.state.taxnum == '') {
            Toast.showInfo('请填写纳税人识别号', 1000);
            return
        }
        // 专票没有填 或者 填了但是不对
        if ((this.state.phone !== '' && !ruleTel.test(this.state.phone)) || (this.state.phone == '' && this.props.theme == "1")) {
            Toast.showInfo('请填写正确的手机号', 1000);
            return
        }
        if (this.state.address == '' && this.props.theme == "1") {
            Toast.showInfo('请填写地址', 1000);
            return
        }
        if (this.state.accountbank == '' && this.props.theme == "1") {
            Toast.showInfo('请填写购方开户行', 1000);
            return
        }
        if ((this.state.account !== '' && (bankRule1.test(this.state.account) == false)) || (this.props.theme == "1" && this.state.account == '')) {
            Toast.showInfo('请填写正确的银行账号', 1000);
            return
        }
        if (this.state.taxCode == '' && this.props.theme == "1") {
            Toast.showInfo('请填写税收编码', 1000);
            return
        }
        if (this.state.goodsortaxname == '') {
            Toast.showInfo('请填写货物或应税劳务、服务名称', 1000);
            return
        }
        if (this.state.unit == '') {
            Toast.showInfo('请填写单位', 1000);
            return
        }
        if (this.state.number == '') {
            Toast.showInfo('请填写数量', 1000);
            return
        }
        // if (this.state.remarkfp == '' && this.props.theme == "1") {
        //     Toast.showInfo('请填写发票备注栏', 1000);
        //     return
        // }
        // if (this.state.clerk == '' && this.props.theme == "1") {
        //     Toast.showInfo('请填写开票员', 1000);
        //     return
        // }
        // if (this.state.payee == '' && this.props.theme == "1") {
        //     Toast.showInfo('请填写收款人', 1000);
        //     return
        // }
        // if (this.state.checker == '' && this.props.theme == "1") {
        //     Toast.showInfo('请填写复核人', 1000);
        //     return
        // }
        if (this.state.recipient == '') {
            Toast.showInfo('请填写邮寄收件人', 1000);
            return
        }

        if (this.state.recipientphone == '' || !ruleTel.test(this.state.recipientphone)) {
            Toast.showInfo('请填写正确收件人联系方式', 1000);
            return
        }
        if (this.state.recipientaddress == '') {
            Toast.showInfo('请填写邮寄地址', 1000);
            return
        }
        if (this.state.total == '') {
            Toast.showInfo('请填写总额', 1000);
            return
        }
        // var totalmin = parseFloat(0.1)
        // var totalmax = parseFloat(10000000)
        var rule = /(^(((?!0+$)(?!0*\.0*$)\d{1,7}(\.\d{1,2})?)|10000000|10000000.0|10000000.00)$)/
        if (!rule.test(this.state.total)) {
            Toast.showInfo('请填写合理的金额', 1000);
            return
        }
        var total = parseInt(this.state.total)
        if (total > 10000000) {
            Toast.showInfo('请填写合理的金额', 1000);
            return
        }
        if (total < 0) {
            Toast.showInfo('请填写合理的金额', 1000);
            return
        }
        if (this.state.read === false) {
            Toast.showInfo('请阅读并勾选工薪易平台发票开具规则', 1000);
            return
        }
        var entity = {
            saleName: this.state.saleName,
            buyername: this.state.buyername,
            taxnum: this.state.taxnum,
            phone: this.state.phone,
            address: this.state.address,
            account: this.state.account,
            accountbank: this.state.accountbank,
            taxCode: this.state.taxCode,
            goodsortaxname: this.state.goodsortaxname,
            unit: this.state.unit,
            number: this.state.number,
            remarkfp: this.state.remarkfp,
            recipient: this.state.recipient,
            recipientphone: this.state.recipientphone,
            recipientaddress: this.state.recipientaddress,
            total: this.state.total,
            service: this.state.bl,
            type: this.props.theme == "0" ? "2" : "1",
            clerk: this.state.clerk,
            payee: this.state.payee,
            checker: this.state.checker
        }
        //type == 1 是专票 2是普票
        var params = { einvoiceOrder: entity }
        //debugger
        Alert.alert("温馨提示", '本次开票服务费:' + keepTwoDecimal(this.state.total * this.state.bl / 100) + "元；【薪税服务费收款账号名称：" + this.state.accountInfoZHMC + "，账号：" + this.state.accountInfoZH + "，开户行：" + this.state.accountInfoKHH +
            "】 请本人确认开票信息、邮寄地址正确无误，如有误，相关责任自行承担。说明：服务费到账 2 个工作日内邮寄发票。"
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
                        Fetch.postJson(Config.mainUrl + '/einvoiceOrderxxkp/personaleinvoiceorderApp', JSON.stringify(params))
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

const styles = StyleSheet.create({
    contentCon: {
        paddingVertical: 0
    },
    first: {
        marginBottom: 1,
        // flexDirection: 'row',
        backgroundColor: "#fff",
        //height: 44,
        //alignItems: 'center',
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
    inputStyle: {
        flex: 1,
        width: deviceWidth,
        height: 44,
        fontSize: Config.MainFontSize,
        color: '#222',
        //backgroundColor: 'pink',
        //textAlign: 'right',
        marginRight: 20,
        marginLeft: 10,
    }
});

