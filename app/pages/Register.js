//注册
//曾一川
import React, { Component } from 'react';
import { Dimensions, ScrollView, View, ImageBackground, StyleSheet, Image, PixelRatio, Platform, Modal, TextInput, TouchableOpacity, Text, Alert,KeyboardAvoidingView,Keyboard } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import stylesheet from '../utils/style';
import EncryptionUtils from '../utils/EncryptionUtils';
import PcInterface from '../utils/http/PcInterface';
import { Fetch, VectorIcon, Config, Actions, UUID, Toast, UserInfo } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import PushUtils from '../utils/PushUtils';
import Global from '../utils/GlobalStorage';
import ServerProvider from '../utils/ServerProvider'
import {commonLogin} from '../utils/common/businessUtil'
export default class Register extends Component {
    constructor(props) {
        super(props);
        this._countTime = this._countTime.bind(this);
        this._timer = null;
        this.confirmPassword = '';
        this.newPassword1 = '';
        this.telphone = '';
        this.bendiCode = '';
        this.state = {
            serverModalVisible:false,
            serverData:{},
            resetMessage: 60,
            resetAuthCode: false,
            selected: false,
            uuid: UUID.v4(),
            modalVisible: false,
            contractVisible: false,
            useInform: false,
            registerInform: false,
            privacyInfrom: false,
            serviceInform: false,
            keyboardHeight: '',  // 键盘高度
            showWord:false
        }
    }
    // 监听键盘弹出与收回
    componentDidMount(){
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow',this.keyboardDidShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide',this.keyboardDidHide)
    }
    componentWillReceiveProps(nextProps) {
        Actions.pop({ refresh: { test: UUID.v4() } })
    }
    //注销监听
    componentWillUnmount(){
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
    }
   //键盘弹起后执行
    keyboardDidShow = (e) =>  {
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
    render() {
        if (this.props.identity == 'student') {
            return (
                <View style={stylesheet.container}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'  keyboardVerticalOffset={-this.state.keyboardHeight}>
                    <ScrollView style={{  width: theme.screenWidth, backgroundColor: 'white',height: theme.screenHeight}}>
                        {/* <Image source={require('../image/logo.png')} style={{ width: 40, height: 40, position: 'absolute', marginTop: theme.screenHeight / 6 - 10, marginLeft: 20 }} />
                        <Text style={{ position: 'absolute', marginTop: theme.screenHeight / 6, fontSize: Config.MainFontSize + 4, marginLeft: 80 }}>欢迎来到工薪易</Text>
                        <View style={{ height: theme.screenHeight / 5, backgroundColor: 'transparent', marginTop: 30 }} /> */}
                        <View style={{ width: deviceWidth, backgroundColor: '#3E7EFE', height: 210 }}>
                            <Text style={{ position: 'absolute', marginTop: 80, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>您好，个人注册！</Text>
                             {/* <Text style={{ position: 'absolute', marginTop: 118, fontSize: Config.MainFontSize - 2, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: '500' }}>企业用户请前往PC端完成注册</Text> */}
                            <Image source={require('../image/dllogo.png')} style={{ width: 211, height: 211, position: 'absolute', right: -40 }} />
                        </View>
                        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -20 ,overflow:'hidden'}}>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center', backgroundColor:'#fbf4e9',height: 32,borderTopLeftRadius: 25, borderTopRightRadius: 25}}>
                                <Text style={{color:'#E99A1F',fontSize:Config.MainFontSize}}>企业用户请前往PC端完成注册</Text>
                            </View>
                        <View style={{ width: theme.screenWidth - 20, margin: 10 }}>
                             <View style={{display:'flex', flexDirection: 'row',alignItems:'center' }}>
                                {/* {<VectorIcon
                                    name="mobile_phone"
                                    size={36}   //图片大小
                                    color='black'  //图片颜色

                                    style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 30 ,marginTop:20}}
                                />} */}
                                <Image source={require('../image/icon_iphone2.png')} style={{ alignSelf: 'center',width: 24, height: 24, marginLeft: 24}} />

                                <View style={styles.editView2}>
                                    {<TextInput
                                        style={styles.edit}
                                        underlineColorAndroid="transparent"
                                        keyboardType='numeric'
                                        placeholder="请输入手机号码"
                                        placeholderTextColor='#c4c4c4'
                                        onChangeText={(text) => { this.telphone = text }}
                                    />}
                                </View>
                            </View>
                            <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 70, alignSelf: 'center' }} />
                            <View style={{ width: theme.screenWidth - 20,}}>
                            <View style={{ display:'flex', flexDirection: 'row',alignItems:'center'  }}>
                                {/* {<VectorIcon
                                    name="c2_im_weixin_keyboard"
                                    size={32}   //图片大小
                                    color='black'  //图片颜色

                                    style={{ alignSelf: 'center', backgroundColor: 'transparent', marginLeft: 24, marginTop: 20 }}
                                />} */}
                                <Image source={require('../image/icon_meagges2.png')} style={{ alignSelf: 'center',width: 24, height: 24, marginLeft: 24}} />
                                <View style={styles.editView2}>
                                    {<TextInput
                                        style={styles.edit1}
                                        underlineColorAndroid="transparent"
                                        keyboardType='numeric'
                                        placeholder="请输入验证码"
                                        placeholderTextColor='#c4c4c4'
                                        maxLength={8}
                                        onChangeText={(text) => { this.bendiCode = text }}
                                    />}
                                </View>
                                {this.state.resetAuthCode == false ? 
                                <TouchableOpacity style={{ width: 100, height: 34, backgroundColor: '#4D88FF', alignSelf: 'center', marginRight: 24, marginTop: 14, borderRadius: 5 }} onPress={() => this._countTime()}>
                                    <Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>发送验证码</Text>
                                </TouchableOpacity>
                                            : <TouchableOpacity disabled={true} style={{ width: 100, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginRight: 24, marginTop: 14, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                                }
                            </View>
                                    </View>
                            <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 70, alignSelf: 'center' }} />
                            <View style={{ display:'flex', flexDirection: 'row',alignItems:'center' }}>
                                {/* {<VectorIcon
                                    name="locked"
                                    size={28}   //图片大小
                                    color='black'  //图片颜色

                                    style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 26, marginTop: 20 }}
                                />} */}
                                <Image source={require('../image/icon_code2.png')} style={{ alignSelf: 'center',width: 24, height: 24, marginLeft: 24}} />
                                <View style={styles.editView2}>
                                    <View style={{ display:'flex', flexDirection: 'row',alignItems:'center' }}>
                                                {/* (6~20位字母、数字、下划线) */}
                                    <TextInput style={{ flex: 1, textAlign: 'left', fontSize: Config.MainFontSize + 3,  backgroundColor: 'transparent',  marginLeft: 14, width:  (theme.screenWidth*0.65)}}
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={!this.state.showWord}
                                        placeholder="请设置密码"
                                        placeholderTextColor='#c4c4c4'
                                        onChangeText={(text) => { this.newPassword1 = text }}
                                    />
                                    {this.state.showWord ?
                                        <TouchableOpacity onPress={() => { this.setState({ showWord: !this.state.showWord }) }}>
                                            <Image source={require('../image/icon/icon_openeyes.png')} style={{ width: 24, height: 24,marginRight:24,marginTop:4 }} />
                                        </TouchableOpacity>
                                        : <TouchableOpacity onPress={() => { this.setState({ showWord: !this.state.showWord }) }}>
                                                        <Image source={require('../image/icon/icon_closeeyes.png')} style={{ width: 24, height: 24, marginRight: 24, marginTop: 4}} />
                                        </TouchableOpacity>
                                        }
                                </View>
                                </View>
                                </View>
                                <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 70, alignSelf: 'center' }} />
                                
                            </View>
                            {(this.state.selected) ? <TouchableOpacity style={styles.out_button} onPress={() => {
                                this.onRightCommit()
                            }}>
                                <View style={styles.out_body}>
                                    <Text style={styles.out_text}>注册</Text>
                                </View>
                            </TouchableOpacity> :
                                <TouchableOpacity style={styles.out_button} onPress={() => { this.onRightCommit() }}>
                                    <View style={styles.out_body_grey}>
                                        <Text style={styles.out_text}>注册</Text>
                                    </View>
                                </TouchableOpacity>}
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                {/* <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })} style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 10 }} >
                                    <Text style={{ color: 'grey', fontSize: Config.MainFontSize - 2 }}>您已经同意了</Text><View ><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize - 2 }}>工薪易协议</Text></View>
                                    <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.selected == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                                </TouchableOpacity> */}

                                <TouchableOpacity style={{ backgroundColor: 'transparent',   flexDirection: 'row',}} onPress={() => Actions.pop()}><Text style={{ color: '#999', fontSize: Config.MainFontSize - 1 }}>已有账号?</Text><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize - 1, marginLeft: 5 }}>立即登录</Text></TouchableOpacity>
                            </View>
                                
                            </View>
                        </ScrollView>
                        <View style={{position:'absolute',width:deviceWidth,bottom:20, display:'flex',flexDirection:'row', alignItems: 'center',justifyContent:'center' }}>
                            <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })} style={{ display:'flex', alignItems: 'center', backgroundColor: 'transparent', flexDirection: 'row'  }} >
                                <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.selected == true ? 'c2_im_check_circle_solid' : 'c2_im_select_circle'} style={{ color: '#3E7EFE', textAlign: 'center', fontSize: Config.MainFontSize,marginRight:5}} />
                                <Text style={{ color: 'grey', fontSize: Config.MainFontSize - 2 }}>已阅读并同意了</Text><View ><Text style={{ color: '#3E7EFE', fontSize: Config.MainFontSize - 2 }}>工薪易协议</Text></View>
                            </TouchableOpacity>
                        </View> 
                        {this.zerenModal()}
                        </KeyboardAvoidingView>
                    </View >
                );
        } else {
            return (
                <View style={stylesheet.container}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'  keyboardVerticalOffset={-this.state.keyboardHeight}>
                        <ScrollView style={{ width: theme.screenWidth, backgroundColor: 'white' ,height: theme.screenHeight}}>
                            <Image source={require('../image/logo.png')} style={{ width: 40, height: 40, position: 'absolute', marginTop: theme.screenHeight / 6 - 10, marginLeft: 20 }} />
                            <Text style={{ position: 'absolute', marginTop: theme.screenHeight / 6, fontSize: Config.MainFontSize + 4, marginLeft: 80 }}>欢迎来到工薪易</Text>
                            <View style={{ height: theme.screenHeight / 5, backgroundColor: 'transparent', marginTop: 30 }} />
                            <View style={{ width: theme.screenWidth - 20, margin: 10, marginTop: 10 }}>
                                {/* <View style={{ flexDirection: 'row' }}>
                                    {<VectorIcon
                                        name="c2_im_person_long"
                                        size={32}   //图片大小
                                        color='black'  //图片颜色

                                        style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 30 }}
                                    />}
                                    <View style={styles.editView2}>
                                        {<TextInput
                                            style={styles.edit}
                                            underlineColorAndroid="transparent"
                                            placeholder="用户名"
                                            placeholderTextColor='#c4c4c4'
                                            onChangeText={(text) => { this.userName = text }}
                                        />}
                                    </View>
                                </View> */}
                                {/* <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 40, alignSelf: 'center' }} /> */}

                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    {/* {<VectorIcon
                                        name="mobile_phone"
                                        size={36}   //图片大小
                                        color='black'  //图片颜色

                                        style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 30 }}
                                    />} */}
                                    <Image source={require('../image/icon_iphone2.png')} style={{ alignSelf: 'center', width: 24, height: 24, marginLeft: 30 }} />
                                    <View style={styles.editView2}>
                                        {<TextInput
                                            style={styles.edit}
                                            underlineColorAndroid="transparent"
                                            keyboardType='numeric'
                                            placeholder="手机号"
                                            placeholderTextColor='#c4c4c4'
                                            onChangeText={(text) => { this.telphone = text }}
                                        />}
                                    </View>
                                </View>
                                <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 40, alignSelf: 'center' }} />
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    {/* {<VectorIcon
                                        name="c2_im_weixin_keyboard"
                                        size={32}   //图片大小
                                        color='black'  //图片颜色

                                        style={{ alignSelf: 'center', backgroundColor: 'transparent', marginLeft: 24, marginTop: 3 }}
                                    />} */}
                                    <Image source={require('../image/icon_meagges2.png')} style={{ alignSelf: 'center',width: 24, height: 24, marginLeft: 24}} />
                                    <View style={styles.editView2}>
                                        {<TextInput
                                            style={styles.edit1}
                                            underlineColorAndroid="transparent"
                                            keyboardType='numeric'
                                            placeholder={(Platform.OS == 'ios') ? "验证码" : "验证码"}
                                            placeholderTextColor='#c4c4c4'
                                            onChangeText={(text) => { this.bendiCode = text }}
                                        />}
                                    </View>
                                    {this.state.resetAuthCode == false ? <TouchableOpacity style={{ width: 120, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 70, marginTop: 14, borderRadius: 5 }} onPress={() => this._countTime()}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>获取验证码2</Text></TouchableOpacity>
                                        : <TouchableOpacity disabled={true} style={{ width: 120, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 70, marginTop: 14, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                                    }
                                </View>
                                <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 40, alignSelf: 'center' }} />
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {/* {<VectorIcon
                                        name="locked"
                                        size={28}   //图片大小
                                        color='black'  //图片颜色

                                        style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 26, marginTop: 6 }}
                                    />} */}
                                    <Image source={require('../image/icon_code2.png')} style={{ alignSelf: 'center',width: 24, height: 24, marginLeft: 24}} />
                                    <View style={styles.editView2}>
                                        {<TextInput
                                            style={styles.edit2}
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={true}
                                            placeholder="请设置密码(6~20位字母、数字、下划线)"
                                            placeholderTextColor='#c4c4c4'
                                            onChangeText={(text) => { this.newPassword1 = text }}
                                        />}
                                    </View>
                                </View>
                                <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 40, alignSelf: 'center' }} />
                            </View>
                            {(this.state.selected) ? <TouchableOpacity style={styles.out_button} onPress={() => {
                                this.handleChooseServer()
                            }}>
                                <View style={styles.out_body}>
                                    <Text style={styles.out_text}>注册</Text>
                                </View>
                            </TouchableOpacity> :
                                <TouchableOpacity style={styles.out_button} onPress={() => { this.handleChooseServer() }}>
                                    <View style={styles.out_body_grey}>
                                        <Text style={styles.out_text}>注册</Text>
                                    </View>
                                </TouchableOpacity>}
                            <View style={{ alignItems: 'center', marginTop: 30 }}>
                                <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })} style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 10 }} >
                                    <Text style={{ color: 'grey', fontSize: Config.MainFontSize - 2 }}>您已经同意了</Text><View ><Text style={{ color: '#3E7EFE', fontSize: Config.MainFontSize - 2 }}>工薪易协议</Text></View>
                                    <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.selected == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                                </TouchableOpacity>

                                <TouchableOpacity style={{ backgroundColor: 'transparent', marginLeft: Dimensions.get('window').width / 2, flexDirection: 'row', marginTop: 50 }} onPress={() => Actions.pop()}><Text style={{ color: 'grey', fontSize: Config.MainFontSize - 3 }}>已有账号?点击返回</Text><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize - 3, marginLeft: 5 }}>登录页面</Text></TouchableOpacity>
                            </View>
                        </ScrollView>
                        <ServerProvider
                            modalVisible={this.state.serverModalVisible}
                            onCancel={() => { this.setState({ serverModalVisible: false }) }}
                            callback={(data) => this.handleServer(data)}
                        />
                        {this.zerenModal()}
                        </KeyboardAvoidingView>
                    </View >

                    );
                }
        
            }
    handleServer(data){
        Alert.alert(
            '温馨提示',
            '是否确认选择' + data.orgName,
            [
                { text: '取消', onPress: () => {}},
                { text: '确认', onPress: () => {
                    this.setState({
                        serverData:data,
                        serverModalVisible:false
                    },()=>{this.onRightCommitBoss()})
                }},
            ]
        )
    }
    onPressAgreement1() {
            this.setState({ modalVisible: false })
            Actions.C2WebView({url: Config.mainUrl + '/view/agreement3.html', title: '“工薪易”平台注册协议', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement2() {
            this.setState({ modalVisible: false })
            Actions.C2WebView({url: Config.mainUrl + '/view/agreement5.html', title: '“工薪易”平台须知', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement3() {
            this.setState({ modalVisible: false })
            Actions.C2WebView({url: Config.mainUrl + '/view/agreement4.html', title: '“工薪易”平台隐私政策', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement4() {
            this.setState({ modalVisible: false })
            Actions.C2WebView({url: Config.mainUrl + '/view/agreement6.html', title: '“工薪易”平台安全声明', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement5() {
            this.setState({ modalVisible: false })
            Actions.C2WebView({url: Config.mainUrl + '/view/agreement1.html', title: '“工薪易”平台发送内容规范', popCallback: this.handlePop.bind(this) })
    }
    onPressAgreement6() {
            this.setState({ modalVisible: false })
            Actions.C2WebView({url: Config.mainUrl + '/view/agreement2.html', title: '法律声明', popCallback: this.handlePop.bind(this) })
    }
    handlePop() {
        //debugger
        this.setState({ modalVisible: true })
    }
    onRequestCloseQP() {
        this.setState({
            modalVisible: false
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
                            onRequestClose={() => { this.onRequestCloseQP() }}

                        >
                            <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.5 }} onPress={() => this.setState({ modalVisible: false })}>
                            </TouchableOpacity>
                            {this.state.contractVisible == false ? <ScrollView style={{ alignSelf: 'center', height: (Platform.OS == 'ios') ? deviceHeight / 1.5 : deviceHeight / 1.4, width: deviceWidth - 40, marginTop: deviceHeight / 6, backgroundColor: 'white', position: 'absolute' }}>
                                <ImageBackground source={require('../image/mianze.png')} style={{ width: deviceWidth - 40, height: 160, alignSelf: 'center' }}>
                                    <VectorIcon onPress={() => this.setState({ modalVisible: false })} name={'android-close'} style={{ color: 'white', fontSize: 22, position: 'absolute', right: 5, top: 5, backgroundColor: 'transparent' }} />
                                    <Text style={{ color: 'white', position: 'absolute', alignSelf: 'center', backgroundColor: 'transparent', marginTop: 12, fontSize: Config.MainFontSize + 2, fontWeight: 'bold' }}>工薪易平台用户注册协议</Text>
                                    <VectorIcon name={'security'} style={{ color: 'white', fontSize: 80, position: 'absolute', marginTop: 50, alignSelf: 'center', backgroundColor: 'transparent' }} />
                                </ImageBackground>
                                <View style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 20 }}>
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#3B3B3B' }}>在您成为工薪易平台用户的过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议
                                        ，请您务必仔细阅读协议中的条款内容后再点击同意。
                        </Text>
                                </View>

                                <View style={{ height: 0.5, width: deviceWidth - 50, backgroundColor: 'grey', alignSelf: 'center', marginTop: 10 }} />
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement1()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台注册协议》</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement2()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台须知》</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => this.setState({ contractVisible: true, useInform: true })}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《工薪易平台须知》</Text>
                        </TouchableOpacity> */}
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement3()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台隐私政策》</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ paddingTop: 10, paddingLeft: 10 }} onPress={() => this.setState({ contractVisible: true, privacyInfrom: true })}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《隐私权政策》</Text>
                        </TouchableOpacity> */}
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement4()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台安全声明》</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ paddingTop: 10, paddingLeft: 10 }} onPress={() => this.setState({ contractVisible: true, serviceInform: true })}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《工薪易平台服务协议》</Text>
                        </TouchableOpacity> */}
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement5()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《“工薪易”平台发送内容规范》</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => this.onPressAgreement6()}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'rgb(65,143,234)' }}>《法律声明》</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: deviceWidth - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginBottom: 20, borderRadius: 5 }} onPress={() => this.setState({ modalVisible: false, selected: true })}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>同意并继续</Text></TouchableOpacity>
                            </ScrollView> :
                                <ScrollView style={{ marginTop: 40, marginBottom: 10, position: 'absolute', backgroundColor: 'white', width: deviceWidth - 40, alignSelf: 'center', height: deviceHeight / 1.2 }}>
                                    <View style={{ padding: 10 }}>
                                        <VectorIcon onPress={() => this.setState({ modalVisible: false, contractVisible: false, registerInform: false, useInform: false, privacyInfrom: false, serviceInform: false })} name={'android-close'} style={{ color: 'rgb(65,143,234)', fontSize: 24, position: 'absolute', right: 5, top: 5, backgroundColor: 'transparent' }} />
                                        <VectorIcon onPress={() => this.setState({ contractVisible: false, registerInform: false, useInform: false, privacyInfrom: false })} name={'c2_im_back_arrow'} style={{ color: 'rgb(65,143,234)', fontSize: 15, position: 'absolute', left: 5, top: 10, backgroundColor: 'transparent' }} />
                                        {this.state.registerInform == true ?
                                            <View style={{ marginTop: 40 }}>
                                                <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize + 2, marginTop: 10 }}>工薪易平台注册协议</Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    特别提示：
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    欢迎您签署本《“工薪易”平台服务协议》（下称“本协议”）并使用“工薪易”平台服务！
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    为使用“工薪易”（网址www.xsypt.com.cn和/或工薪易app，下称“工薪易”平台），您应当阅读并遵守《“工薪易”平台注册协议》（下称“本协议”）和《“工薪易”平台隐私政策》。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制“工薪易”平台责任的条款、对用户权利进行限制的条款、约定争议解决方式和司法管辖的条款（如第十一条相关约定）等，以及开通或使用某项服务的单独协议或规则。限制、免责条款或者其他涉及您重大权益的条款可能以加粗、加下划线等形式提示您重点注意。除非您已充分阅读、完全理解并接受本协议所有条款，否则您无权使用“工薪易”平台。
                                                本协议是您与“工薪易”平台和“工薪易”平台经营者湖南薪税信息科技有限责任公司之间就“工薪易”开放平台网站服务等相关事宜达成的合意，请您仔细阅读本协议。点击“我已阅读并同意《“工薪易”平台注册协议》”之日起，即表示您已充分阅读、理解并同意自己与本网站订立本协议，且您自愿受本协议的条款约束。本协议即在您与“工薪易”平台和“工薪易”平台经营者湖南薪税信息科技有限责任公司之间产生法律效力，成为对双方均具有约束力的法律文件。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。
                                                如果您因年龄、智力等因素而不具有完全民事行为能力，请在法定监护人（以下简称“监护人”）的陪同下阅读和判断是否同意本协议，并特别注意未成年人使用条款。
                                                如果您是中国大陆地区以外的用户，您订立或履行本协议还需要同时遵守您所属和/或所处国家或地区的法律。
                                        </Text>

                                                <Text style={{ marginTop: 10 }}>
                                                    本网站有权随时变更本协议并在本网站上予以公告。经修订的条款一经在本网站的公布后，立即自动生效。如您不同意相关变更，必须停止使用本网站。本协议内容包括协议正文及所有工薪易已经发布的各类规则。所有规则为本协议不可分割的一部分，与本协议正文具有同等法律效力。一旦您继续使用本网站，则表示您已接受并自愿遵守经修订后的条款。本协议即构成对您与工薪易之间有约束力的法律文件。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    如您对协议有任何疑问，可向“工薪易”平台客服（0732-89923263）咨询。
    </Text>

                                                <Text style={{ marginTop: 10 }}>
                                                    一、 协议范围
                                                   1、本协议是用户与“工薪易”平台和/或运营方湖南薪税信息科技有限责任公司之间关于其使用“工薪易”平台的服务所订立的协议。“工薪易”平台是指““工薪易”平台网”（域名为http://www.xsypt.com.cn及“工薪易app”或其他H5等开放平台, 以下简称““工薪易”平台”）和/或其相关服务可能存在的运营关联单位。“用户”是指“工薪易”平台的服务的使用人，在本协议中更多地称为“您”。
                                                   2、除另行明确声明外，“工薪易”平台服务包含任何“工薪易”平台及其关联公司、第三方服务商提供的基于互联网以及移动互联网的相关服务，具体服务以“工薪易”平台实际提供的为准（以下简称“本服务”）
                                                   3、本协议内容包括协议正文、法律声明、《“工薪易”平台服务协议》及所有“工薪易”平台已经发布或将来可能发布的各类规则、公告或通知（以下合称““工薪易”平台规则”或“规则”）。上述内容一经正式发布，即为本协议不可分割的组成部分，您同样应当遵守。您对前述任何单独协议的接受，即视为您对本协议全部的接受。
                                                   4、“工薪易”平台有权依据国家法律法规调整的要求和公平交易的商业原则及时地制订、修改本协议及各类规则，并以网站公示的方式进行变更公告，无需另行单独通知您。变更后的协议和规则一经在网站公布后，立即或在公告明确的特定时间自动生效。若您在前述变更公告后继续使用“工薪易”平台服务的，即表示您已经阅读、理解并接受经修订的协议和规则。若您不同意相关变更，应当立即停止使用“工薪易”平台服务。
    </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    二、 注册与账户
                                                1、主体资格
                                                您确认，在您完成注册程序或以其他“工薪易”平台允许的方式实际使用“工薪易”平台服务时，您应当符合下列条件之一:
                                                1)、年满十八岁，并具有民事权利能力和民事行为能力的自然人；
                                                2)、无民事行为能力人或限制民事行为能力人应在其监护人的监护下使用“工薪易”平台服务；
                                                3)、根据中国法律、法规、行政规章成立并合法存在的机关、企事业单位、个体工商户、社团组织和其他组织。
                                                若您不具备前述主体资格，则您及您的家长或法定监护人（以下统称"监护人"）应承担因此而导致的一切后果，且“工薪易”平台有权注销您的账户，并向您及您的监护人索偿。
                                                2、用户的帐号、密码和安全性
                                                您一旦注册成功成为用户，您将得到一个密码和帐号。如果您未保管好自己的帐号和密码而对您、“工薪易”平台或第三方造成的损害，您将负全部责任。另外，每个用户都要对其帐户中的所有活动和事件负全责。因此所衍生的任何损失或损害，“工薪易”平台无法也不承担任何责任。您可随时改变您的密码和图标，也可以结束旧的帐户重开一个新帐户。用户同意若发现任何非法使用用户帐号或安全漏洞的情况，立即通告“工薪易”平台。
                                                “工薪易”平台特别提醒您应妥善保管您的帐号和密码。当您使用完毕后，应安全退出。因您保管不善可能导致遭受被盗号或密码失窃，责任由您自行承担。
                                                除非有法律规定或行政司法机关的指令，且征得“工薪易”平台的同意，否则您的用户账户、登录密码、支付密码（如有）和验证码不得以任何方式转让、借用、赠与或继承（与账户相关的财产权益除外）。否则，由此给您（或“工薪易”平台、任何第三方）造成的一切损失，概由您自行承担（或者负责赔偿）。
                                                您在注册帐号或使用“工薪易”平台服务的过程中，可能需要填写一些必要的信息或提供一些必要的资料。若国家法律法规有特殊规定的，您需要填写您的真实的身份信息。“工薪易”平台虽然对用户进行资质审查，但“工薪易”平台并非司法机关，仅能要求用户提交真实、有效的资质证明文件，并对该提交的资质证明文件进行审核。如果因您提供的个人资料不完整、不合法、不真实、不准确的，您需承担因此引起的相应责任及后果，并且“工薪易”平台有权要求您进行修改且有权保留终止您使用“工薪易”平台各项服务的权利。
                                                您了解并同意，一经注册用户账号，即视为您同意“工薪易”平台及/或其关联公司通过短信或者电子邮件的方式向您注册时填写的手机号码或者电子邮箱发送相应的产品服务广告信息、促销优惠等营销信息；您如果不同意发送，您可以通过相应的退订功能进行退订。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    三、 “工薪易”平台服务
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>    1.	企业用户可以在“工薪易”平台上发布需求/服务、查询需求/服务、达成交易意向并进行交易、对其他会员进行评价、参加“工薪易”平台组织的活动以及使用其它信息服务及技术服务，具体以所开通的平台提供的服务内容为准。若您是企业用户，您了解并同意：
                                             （1）	企业用户应保证所发布或提供信息的真实性、合法性、有效性，不得冒充他人、不得利用他人的名义发布任何信息。
                                             （2）	企业用户应保证其招聘行为的合法性，保证不存在任何扣押被录用人员或参加面试人员的居民身份证和其他证件、以担保或其他任何名义向劳动者收取财物或其他以招用人员为名牟取不正当利益等民事或刑事等违法、犯罪行为。若因其招聘行为引发任何第三人投诉或诉讼等情形，应主动采取补救措施、并积极配合“工薪易”平台降低和消除事件可能给“工薪易”平台造成的影响。
                                             （3）	企业用户应保证遵守招聘、发布需求活动秩序，合理使用“工薪易”平台提供的物料及资源，因企业用户及其工作人员原因造成“工薪易”平台或其他人身或财产损失的，均由企业用户负责全额赔偿。
                                         </Text>
                                                <Text style={{ marginTop: 10 }}>  2.	本网站只能用于人才招聘、发布需求、人力资源代理服务等相关的合法目的，企业用户在成功注册为企业用户后，仅可就招聘目的在本网站发布招聘信息以及按照本网站为您开设的权限或功能浏览求职者的简历信息。本网站明确禁止将本网站及从本网站获取的信息用于任何其他非人才招聘相关的用途，并要求所有企业用户同意不得使用本网站从事下列任何一种行为：
                                             （1）	发布任何有关法律法规明令禁止发布的信息；
                                             （2）	发布任何与求职、招聘信息发布之目的不适之信息；
                                             （3）	发布任何职位名称与职位描述不符的信息；
                                             （4）	以任何形式侵犯他人的版权、商标权、商业秘密或其他知识产权；
                                             （5）	侵犯个人和社会大众的隐私安全；
                                             （6）	传输违反任何法律法规及其他规范性文件的信息，包括但不限于属于任何非法的、骚扰性的、中伤性的、辱骂性的、恐吓性的、伤害性、庸俗或淫秽的信息。
                                             （7）	发布虚假、不准确、不完整或具有误导性的职位信息或意见、通知、商业广告或其他与招聘目的不符的内容。
                                             （8）	发布任何违反法律法规及其他规范性文件、具有贬损、侮辱、有违社会公序良俗等的信息或言论；
                                             （9）	利用网站开设的功能或权限发布、编辑、传播等违反法律法规及其他规范性文件、引人反感或有违风化的信息、言论或内容。
                                         </Text>
                                                <Text style={{ marginTop: 10 }}>       3.	为了证明企业用户主体资格的真实性，企业用户应当向本网站提供相关证明材料（包括但不限于加盖公章的营业执照副本、授权委托书等），企业用户向本网站不可撤销的承诺其系依法成立的法人、团体或其他法律认可的组织。企业用户保证其向本网站提供的上述证明材料及在本网站发布的信息真实、合法、有效，且对该企业及企业在本网站所发布的信息及借助本网站所实施的全部行为承担完全责任，如因企业用户自身或企业用户所发布的信息违反本协议之规定或者侵犯任何第三方的合法权益引起的一切纠纷或责任，由企业用户自行承担，本网站不承担任何责任且有权向企业用户进行追偿。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>     4.	个人用户可以“工薪易”平台发布简历、找工作、承接工作任务等。若您为个人用户，您在注册时即已授权“工薪易”平台将您的简历/个人信息向不特定用人者推荐，或授权不特定用人者搜索、查阅、下载使用您的简历/个人信息，同时授权用人者通过前述方式获取您的详细联系方式，并在有合适工作机会时通过“工薪易”平台或电话、邮件等方式主动与您联系；如您不希望您的简历/个人信息被查看，或您不希望用人者在您未投递该企业职位情况下与您取得联系，您应当按照“工薪易”平台隐私设置规则、指引屏蔽相关企业、关闭联系通道。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>     5.	为完成在“工薪易”平台的注册并享受“工薪易”平台提供的产品和服务，用户应确保提供注册资料的真实性、准确性、完整性以及合法有效性。个人用户注册资料发生变更时，用户应及时更新注册资料。如因用户提供的注册资料不合法、不真实、不准确或不完整，用户应承担因此引发的相应责任及后果，且“工薪易”平台保留终止用户使用“工薪易”平台服务的权利。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>      6.	“工薪易”平台（含网站及手机APP）只能用于人才招聘相关的合法目的，即个人寻找职业和雇主寻找雇员。“工薪易”平台明确禁止任何其他非人才招聘相关的用途，并要求所有使用者同意不使用“工薪易”平台开展用于下列任何一种用途：
                                             （1）在简历中心公布不完整、虚假或不准确的简历资料，或不是使用者的准确简历（而为他人寻找全职或兼职工作）。
                                             （2）公布不是简历的资料，如意见、通知、商业广告或其他非简历内容。
                                             （3）为“工薪易”平台的竞争同行回应职位，并用此方法寻求与雇主联络业务。
                                             （4）除发布者外，删除或修改其他个人或公司公布的资料。
                                             （5）擅自打印、复制或以其他方式使用有关雇员的任何个人资料或有关雇主的商业信息。
                                             （6）未经同意，给公布信息的个人或公司发电子邮件、打电话、寄信或以其他方式进行接触。
                                     </Text>
                                                <Text style={{ marginTop: 10 }}>      7、您了解并同意，“工薪易”平台有权应政府部门（包括司法及行政部门）的要求，向其提供您向“工薪易”平台提供的用户信息和交易记录等必要信息。如您涉嫌侵犯他人知识产权等合法权益，则“工薪易”平台亦有权在初步判断涉嫌侵权行为存在的情况下，向权利人提供您必要的身份信息。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>       8、“工薪易”平台的部分服务是以收费方式提供的，如您使用收费服务，请遵守相关的协议。“工薪易”平台可能根据实际需要对收费服务的收费标准、方式进行修改和变更，“工薪易”平台也可能会对部分免费服务开始收费。前述修改、变更或开始收费前，“工薪易”平台将在相应服务页面进行通知或公告。如果您不同意上述修改、变更或付费内容，则应停止使用该服务。在“工薪易”平台降低收费服务的收费标准或者将收费服务改为免费服务提供时，“工薪易”平台保留不对原付费用户提供退费或者费用调整之权利。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>       9、您同意“工薪易”平台可以自行或由第三方通过短信、电子邮件或电子信息等多种方式向您发送、展示广告或其他信息（包括商业与非商业信息），广告或其他信息的具体发送及展示形式、频次及内容等以“工薪易”平台实际提供为准。“工薪易”平台将依照相关法律法规要求开展广告业务。您同意，对本服务中出现的广告，您应审慎判断其真实性和可靠性，除法律明确规定外，您应对因该广告而实施的行为负责。
                                     </Text>
                                                <Text style={{ marginTop: 10 }}>       10、除另行约定外，您应当自行承担因交易产生或取得的相关费用，并依法纳税，平台不承担代扣义务。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>      11、拒绝提供担保和免责声明
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>    您明确同意使用“工薪易”平台服务的风险由您个人承担。服务提供是建立在免费的基础上。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>    “工薪易”平台明确表示不提供任何类型的担保，不论是明确的或隐含的，但是对商业性的隐含担保，特定目的和不违反规定的适当担保除外。“工薪易”平台不担保服务一定能满足用户的要求，也不担保服务不会受中断，对服务的及时性、安全性、真实性、出错发生都不作担保。“工薪易”平台拒绝提供任何担保，包括信息能否准确、及时、顺利地传送。用户理解并接受下载或通过“工薪易”平台产品服务取得的任何信息资料取决于用户自己，并由其承担系统受损、资料丢失以及其它任何风险。“工薪易”平台对在服务网上得到的任何商品购物服务、交易进程、招聘信息，承包过程、成果审核等都不作担保。用户不会从“工薪易”平台收到口头或书面的意见或信息，“工薪易”平台也不会在这里作明确担保。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    四、“工薪易”平台服务使用规范
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>  1、在“工薪易”平台上使用“工薪易”平台服务过程中，您承诺遵守以下约定：
                                             a)、实施的所有行为均遵守国家法律、法规等规范性文件及“工薪易”平台各项规则的规定和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不偷逃应缴税费，不违反本协议及相关规则。
                                             b)、在与其他会员交易过程中，遵守诚实信用原则，不采取不正当竞争行为，不扰乱网上交易的正常秩序，不从事与网上交易无关的行为。
                                             c)、不发布国家禁止销售的或限制销售的服务信息（除非取得合法且足够的许可），不发布涉嫌侵犯他人知识产权或其它合法权益的服务信息，不发布违背社会公共利益或公共道德或“工薪易”平台认为不适合在“工薪易”平台上销售的服务信息，不发布其它涉嫌违法或违反本协议及各类规则的信息。
                                             d)、不采取不正当手段（包括但不限于虚假需求、互换好评等方式）提高自身或他人评价，或采用不正当手段恶意评价其他用户，降低其他人评价。
                                             e)、未经公司书面许可，不对“工薪易”平台上的任何数据作商业性利用，包括但不仅限于在未经“工薪易”平台事先书面同意的情况下，以复制、传播等任何方式使用“工薪易”平台站上展示的资料。
                                             f)、不使用任何装置、软件或例行程序干预或试图干预“工薪易”平台的正常运作或正在“工薪易”平台上进行的任何交易、活动。您不得采取任何将导致不合理的庞大数据负载加诸“工薪易”平台网络设备的行为。
                                         </Text>
                                                <Text style={{ marginTop: 10 }}>  2、您了解并同意：
                                             a)、您如果违反前述承诺，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保“工薪易”平台免于因此产生任何损失或增加费用。
                                             b)、基于维护“工薪易”平台交易秩序及交易安全的需要，“工薪易”平台有权在发生恶意交易等扰乱市场正常交易秩序的情形下，执行强制关闭相应交易订单等操作。
                                             c)、经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者“工薪易”平台根据自身的判断，认为您的行为涉嫌违反法律法规的规定或涉嫌违反本协议和/或规则的条款的，“工薪易”平台有权在“工薪易”平台上公示您的该等涉嫌违法或违约行为及“工薪易”平台已对您采取的措施。
                                             d)、对于您在“工薪易”平台上发布的涉嫌违法、涉嫌侵犯他人合法权利或违反本协议和规则的信息，“工薪易”平台有权不经通知您即予以删除，且按照规则的规定进行处理。
                                             e)、对于您违反本协议项下承诺，或您在“工薪易”平台上实施的行为，包括您未在“工薪易”平台上实施但已经对“工薪易”平台及其用户产生影响的行为，“工薪易”平台有权单方认定您行为的性质及是否构成对本协议规则的违反，并根据单方认定结果适用规则予以处理或终止向您提供服务，且无须征得您的同意或提前通知予您。您应自行保存与您行为有关的全部证据，并应对无法提供充要证据而承担的不利后果。
                                             f)、如您涉嫌违反有关法律或者本协议之规定，使“工薪易”平台遭受任何损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，您应当赔偿“工薪易”平台因此造成的损失发生的费用，包括合理的律师费用。
                                         </Text>
                                                <Text style={{ marginTop: 10 }}>   3、您了解并同意：
                                             您单独承担发布内容的责任。您对服务的使用是根据所有适用于服务的地方法律、国家法律和国际法律标准的。您承诺:
                                             （1）在“工薪易”平台的网页上发布信息或者利用“工薪易”平台的服务时必须符合中国有关法规，不得在“工薪易”平台的网页上或者利用“工薪易”平台的服务制作、复制、发布、传播以下信息:
                                             a)、反对宪法所确定的基本原则的;
                                             b)、危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
                                             c)、损害国家荣誉和利益的；
                                             d)、煽动民族仇恨、民族歧视，破坏民族团结的；
                                             e)、破坏国家宗教政策，宣扬邪教和封建迷信的；
                                             f)、散布谣言，扰乱社会秩序，破坏社会稳定的；
                                             g)、散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
                                             h)、侮辱或者诽谤他人，侵害他人合法权益的；
                                             i)、含有法律、行政法规禁止的其他内容的。
                                             （2）在“工薪易”平台的网页上发布信息或者利用“工薪易”平台的服务时还必须符合其他有关国家和地区的法律规定以及国际法的有关规定。
                                             （3）不利用“工薪易”平台的服务从事以下活动:
                                             a)、未经允许，进入计算机信息网络或者使用计算机信息网络资源的；
                                             b)、未经允许，对计算机信息网络功能进行删除、修改或者增加的；
                                             c)、未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；
                                             d)、故意制作、传播计算机病毒等破坏性程序的；
                                             e)、其他危害计算机信息网络安全的行为。
                                             （4）不以任何方式干扰“工薪易”平台的服务。
                                             （5）遵守“工薪易”平台的所有其他规定和程序。
                                         </Text>
                                                <Text style={{ marginTop: 10 }}>  您需对自己在使用“工薪易”平台服务过程中的行为承担法律责任。您理解，如果“工薪易”平台发现其网站传输的信息明显属于上段第(2)条所列内容之一，依据中国法律，“工薪易”平台有义务立即停止传输，保存有关记录，向国家有关机关报告，并且删除含有该内容的地址、目录或关闭服务器。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>   如果您违反本协议约定，“工薪易”平台有权进行独立判断并采取相应措施，包括但不限于通过技术手段删除、屏蔽相关内容或断开链接等。同时，“工薪易”平台有权视用户的行为性质，采取包括但不限于暂停或终止向您提供服务，限制、中止、冻结或终止您对“工薪易”平台帐号的使用，追究法律责任等措施。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}> 如果您在使用本服务过程中违反了相关法律法规或本协议约定，相关国家机关或机构可能会对您提起诉讼、罚款或采取其他制裁措施，并要求“工薪易”平台给予协助。因此给您或者他人造成损害的，您应自行承担全部责任，“工薪易”平台不承担任何责任。“工薪易”平台因此遭受损失的，您也应当一并赔偿。。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    五、特别授权
                                                 您完全理解并不可撤销地授予“工薪易”平台及其关联公司下列权利：
                                                 1、您完全理解并不可撤销地授权“工薪易”平台或“工薪易”平台授权的第三方或您与“工薪易”平台一致同意的第三方，根据本协议及“工薪易”平台规则的规定，处理您在“工薪易”平台上发生的所有交易及可能产生的交易纠纷。您同意接受“工薪易”平台或“工薪易”平台授权的第三方或您与“工薪易”平台一致同意的第三方的判断和调查处理决定。该决定将对您具有法律约束力。
                                                 2、一旦您向“工薪易”平台和其关联公司做出任何形式的承诺，且相关公司已确认您违反了该承诺，则“工薪易”平台有权立即按您的承诺或协议约定的方式对您的账户采取限制措施，包括中止或终止向您提供服务，并公示相关公司确认的您的违约情况。您了解并同意，“工薪易”平台无须就相关确认与您核对事实，或另行征得您的同意，且“工薪易”平台无须就此限制措施或公示行为向您承担任何的责任。
                                                 3、对于您提供的资料及数据信息，您授予“工薪易”平台及其关联公司永久免费的许可使用权利 (并有权在多个层面对该权利进行再授权)。此外，“工薪易”平台及其关联公司有权(全部或部分) 使用、复制、修订、改写、发布、翻译、分发、执行和展示您的全部资料数据（包括但不限于注册资料、交易行为数据及全部展示于“工薪易”平台的各类信息）或制作其派生作品，并以现在已知或日后开发的任何形式、媒体或技术，将上述信息纳入其它作品内。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    六、责任范围和责任限制
                                                 1、“工薪易”平台负责按"现状"和"可得到"的状态向您提供“工薪易”平台服务。但“工薪易”平台对“工薪易”平台服务不作任何明示或暗示的保证，包括但不限于“工薪易”平台服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。同时，“工薪易”平台也不对“工薪易”平台服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、稳定性和及时性做出任何承诺和保证。
                                                 2、您了解“工薪易”平台仅作为您获取需求和服务信息、物色交易对象、就服务的交易进行协商及开展交易的场所，平台上的服务和需求信息系由用户自行发布，且可能存在风险和瑕疵，“工薪易”平台无法完全控制交易所涉及的服务的质量、安全或合法性，信息的真实性或准确性，以及交易各方履行其在贸易协议中各项义务的能力。您应自行谨慎判断确定相关信息的真实性、合法性和有效性，并自行承担因此产生的责任与损失。
                                                 3、除非法律法规明确要求，或出现以下情况，否则，“工薪易”平台没有义务对所有用户的信息数据、服务信息、交易行为以及与交易有关的其它事项进行事先审查：
                                                 a)、“工薪易”平台有合理的理由认为特定会员及具体交易事项可能存在重大违法或违约情形。
                                                 b)、“工薪易”平台有合理的理由认为用户在“工薪易”平台的行为涉嫌违法或其他不当。
                                                 4、“工薪易”平台或“工薪易”平台授权的第三方或您与“工薪易”平台一致同意的第三方有权基于您不可撤销的授权受理您与其他会员因交易产生的争议，并有权单方判断与该争议相关的事实及应适用的规则，进而做出处理决定，包括但不限于调整相关订单的交易状态，争议款项的全部或部分支付给交易一方或双方。该处理决定对您有约束力。如您未在限期内执行处理决定的，则“工薪易”平台有权利（但无义务）直接使用您账户内的款项，或您向“工薪易”平台及其关联公司交纳的保证金代为支付。您应及时补足保证金并弥补“工薪易”平台及其关联公司的损失，否则“工薪易”平台及其关联公司有权直接抵减您在其它合同项下的权益，并有权继续追偿。
                                                 您理解并同意，“工薪易”平台或“工薪易”平台授权的第三方或您与“工薪易”平台一致同意的第三方并非司法机构，仅能以普通人的身份对证据进行鉴别，“工薪易”平台或“工薪易”平台授权的第三方或您与“工薪易”平台一致同意的第三方对争议的调查处理完全是基于您不可撤销的授权，其无法保证争议处理结果符合您的期望，也不对争议调处结论承担任何责任。如您因此遭受损失，您同意自行向受益人索偿。
                                                 5、您了解并同意，“工薪易”平台不对因下述任一情况而导致您的任何损害赔偿承担责任，包括但不限于利润、商誉、数据等方面的损失或其它无形损失的损害赔偿 (无论“工薪易”平台是否已被告知该等损害赔偿的可能性) ：
                                                 a)、使用或未能使用“工薪易”平台服务。
                                                 b)、第三方未经批准的使用您的账户或更改您的数据。
                                                 c)、通过“工薪易”平台交易服务或获取任何平台增值服务、数据、信息或进行交易等行为或替代行为产生的费用及损失。
                                                 d)、您对“工薪易”平台服务的误解。
                                                 e)、任何非因“工薪易”平台的原因而引起的与“工薪易”平台服务有关的其它损失。
                                                 6、不论在何种情况下，“工薪易”平台均不对由于信息网络正常的设备维护，信息网络连接故障，电脑、通讯或其他系统的故障，电力故障、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、政府行为、司法行政机关的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    七、协议终止
                                                 1、您同意，“工薪易”平台有权自行全权决定以任何理由不经事先通知的中止、终止向您提供部分或全部“工薪易”平台服务，暂时冻结或永久冻结（注销）您的账户在“工薪易”平台的权限，且无须为此向您或任何第三方承担任何责任。
                                                 2、出现以下情况时，“工薪易”平台有权直接以注销账户的方式终止本协议，并有权永久冻结（注销）您的账户在“工薪易”平台的权限和收回账户对应的“工薪易”平台昵称：
                                                 a)、“工薪易”平台终止向您提供服务后，您涉嫌再一次直接或间接以他人名义注册为“工薪易”平台用户的；
                                                 b)、您提供的电子邮箱不存在或无法接收电子邮件，且没有任何其他方式可以与您进行联系，或“工薪易”平台以其它联系方式通知您更改电子邮件信息，而您在“工薪易”平台通知后三个工作日内仍未更改为有效的电子邮箱的。
                                                 c)、您提供的用户信息中的主要内容不真实或不准确或不及时或不完整；
                                                 d)、本协议（含规则）变更时，您明示并通知“工薪易”平台不愿接受新的服务协议的；
                                                 e)、其它“工薪易”平台认为应当终止服务的情况。
                                                 f)、您若反对任何服务条款的建议或对后来的条款修改有异议，或对“工薪易”平台服务不满，您只有以下的追索权：
                                                 ①不再使用“工薪易”平台服务。
                                                 ②结束用户使用“工薪易”平台服务的资格。
                                                 ③通告“工薪易”平台停止该用户的服务。
                                                 结束用户服务后，即协议终止。您使用“工薪易”平台服务的权利马上中止。从那时起，“工薪易”平台不再对您承担任何义务。
                                                 3、您的账户服务被终止或者账户在“工薪易”平台的权限被永久冻结（注销）后，“工薪易”平台没有义务为您保留或向您披露您账户中的任何信息，也没有义务向您或第三方转发任何您未曾阅读或发送过的信息。
                                                 4、您同意，您与“工薪易”平台的合同关系终止后，“工薪易”平台仍享有下列权利：
                                                 a）、继续保存您的用户信息及您使用“工薪易”平台服务期间的所有交易信息。
                                                 b)、您在使用“工薪易”平台服务期间存在违法行为或违反本协议和/或规则的行为的，“工薪易”平台仍可依据本协议向您主张权利。
                                                 5、“工薪易”平台中止或终止向您提供“工薪易”平台服务后，对于您在服务中止或终止之前的交易行为依下列原则处理，您应独力处理并完全承担进行以下处理所产生的任何争议、损失或增加的任何费用，并应确保“工薪易”平台免于因此产生任何损失或承担任何费用：
                                                 a)、您在服务中止或终止之前已经上传至“工薪易”平台的服务交易尚未交易的，“工薪易”平台有权在中止或终止服务的同时删除此项服务交易的相关信息；
                                                 b)、您在服务中止或终止之前已经与其他会员达成服务交易合同，但合同尚未实际履行的，“工薪易”平台有权删除该买卖合同及其交易服务的相关信息；
                                                 c)、您在服务中止或终止之前已经与其他会员达成买卖合同且已部分履行的，“工薪易”平台可以不删除该项交易，但“工薪易”平台有权在中止或终止服务的同时将相关情形通知您的交易对方。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    八、隐私权政策
                                                 “工薪易”平台将在“工薪易”平台公布并不时修订《“工薪易”平台隐私政策》，《“工薪易”平台隐私政策》构成本协议的有效组成部分。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    九、知识产权条款
                                                 1、本网站之域名、商标，以及本网站内所有信息内容（本网站用户发布的信息除外），包括但不限于网站架构、文字、图片、软件、音频、视频、用户等级/评价体系/信用体系/榜单等数据信息，以及所有本网站使用之所有技术、数据分析模型、计算机软件、数据库（第三方创建并保留所有权和/或知识产权的除外），其所有权知识产权均归属“工薪易”平台唯一所有，未经“工薪易”平台书面许可，任何人均不得擅自进行全部和局部复制、转载、引用和链接等使用和处分。
                                                 2、用户在本网站发布的任何信息和内容（用户隐私信息除外），包括但不限于文字、图片、软件、音频、视频等，均被视为永久、免费且不可撤销地许可“工薪易”平台自行或许可其关联方、业务合作方、宣传方不受任何限制的使用和处分。
                                                 3、任何单位或者个人不得以任何方式引诱本网站用户或者第三方复制转载本网站之信息内容，或者同意该用户或者第三方复制转载本网站内容。
                                                 4、上述及其他任何本服务包含的内容的知识产权均受到法律法规保护，未经“工薪易”平台、用户或相关权利人书面许可，任何人不得以任何形式进行使用或创造相关衍生作品。
                                                 5、任何违反本站知识产权声明的行为，本站保留进一步追究法律责任的权利。
                                                 6、除非法律允许或“工薪易”平台书面许可，发活方不得从事下列行为：
                                                 1) 删除软件及其副本上关于著作权的信息；
                                                 2) 对软件进行反向工程、反向汇编、反向编译或者以其他方式尝试发现软件的源代码；
                                                 3) 对“工薪易”平台或其关联公司拥有知识产权的内容进行使用、出租、出借、复制、修改、链接、转载、汇编、发表、出版、建立镜像站点等侵犯知识产权及相关专属权利的行为；
                                                 4) 对软件或者软件运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及软件运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非经合法授权的第三方工具/服务接入软件和相关系统；
                                                 5) 修改或伪造软件运行中的指令、数据，增加、删减、变动软件的功能或运行效果，或者将用于上述用途的软件、方法进行运营或向公众传播，无论上述行为是否为商业目的；
                                                 6) 通过非“工薪易”平台开发、授权的第三方软件、插件、外挂、系统，使用“工薪易”平台服务，或制作、发布、传播非“工薪易”平台开发、授权的第三方软件、插件、外挂、系统；
                                                 7) 其他未经“工薪易”平台明示授权和/或许可的行为。
                                                 7、用户如因违反本协议第十、6条而对“工薪易”平台构成违约或侵权，用户应向“工薪易”平台支付一定金额的损害赔偿金。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十、不可抗力和其他免责事由
                                                 1、您理解并同意，在使用本服务的过程中，可能会遇到不可抗力等风险因素，使本服务受到影响。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行为等。出现上述情况时，“工薪易”平台将努力在第一时间与相关单位配合，争取及时进行处理，但是由此给您造成的损失“工薪易”平台在法律允许的范围内免责。
                                                 2、在法律允许的范围内，“工薪易”平台对以下情形导致的服务中断或受阻不承担责任：
                                                 a)受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏。
                                                 b)用户或“工薪易”平台的电脑软件、系统、硬件和通信线路出现故障。
                                                 c)用户操作不当或用户通过非“工薪易”平台授权的方式使用本服务。
                                                 d)程序版本过时、设备的老化和/或其兼容性问题。
                                                 f)其他“工薪易”平台台无法控制或合理预见的情形。
                                                 3、您理解并同意，在使用本服务的过程中，可能会遇到网络信息或其他用户行为带来的风险，“工薪易”平台不对任何信息的真实性、适用性、合法性承担责任，也不对因侵权行为给您造成的损害负责。这些风险包括但不限于：
                                                 （2）来自他人匿名或冒名的含有威胁、诽谤、令人反感或非法内容的信息。
                                                 （2）遭受他人误导、欺骗或其他导致或可能导致的任何心理、生理上的伤害以及经济上的损失。
                                                 （3）其他因网络信息或用户行为引起的风险。
                                                 4、“工薪易”平台依据本协议约定获得处理违法违规内容的权利，该权利不构成“工薪易”平台的义务或承诺，“工薪易”平台不能保证及时发现违法行为或进行相应处理。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十一、法律适用和管辖
                                                 1、本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国大陆地区法律，如无相关法律规定的，则应参照通用国际商业惯例或行业惯例。
                                                 2、因本协议产生之争议需根据您使用的服务归属的平台确定具体的争议对象，因您使用“工薪易”平台服务所产生的争议应由“工薪易”平台的经营者湖南薪税信息科技有限责任公司与您直接沟通并处理。一旦产生不可调和的争议，您与“工薪易”平台的经营者湖南薪税信息科技有限责任公司均同意该争议统一归湖南薪税信息科技有限责任公司所在地相应级别的法院管辖。
                                                 3、本协议所有条款的标题仅为阅读方便，本身并无实际涵义，不能作为本协议涵义解释的依据。
                                                 4、本协议条款无论因何种原因部分无效或不可执行，其余条款仍有效，对双方具有约束力。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十二、保密条款
                                                 1  各方对于本协议的签订、内容及在履行本协议期间所获知的另一方的商业秘密负有保密义务。非经对方书面同意，任何一方不得向第三方（关联公司除外）泄露、给予或转让该等保密信息。（根据法律、法规、证券交易所规则向政府、证券交易所或其他监管机构提供、双方的法律、会计、商业及其他顾问、雇员除外）。
                                                 2 在本协议终止之后，各方在本条款项下的义务并不随之终止，各方仍需遵守本协议之保密条款，履行其所承诺的保密义务，直到其他方同意其解除此项义务，或事实上不会因违反本协议的保密条款而给其他方造成任何形式的损害时为止。
                                                 3 任何一方均应告知并督促其因履行本协议之目的而必须获知本协议内容及因合作而获知对方商业秘密的雇员、代理人、顾问等遵守保密条款，并对其雇员、代理人、顾问等的行为承担责任。
                                                 十三、不可抗力
                                                 1 因不可抗力或者其他意外事件，使得本协议的履行不可能、不必要或者无意义的，各方均不承担责任。
                                                 2 对于因不可抗力或“工薪易”平台不能控制的原因造成的网络服务中断或其它缺陷，“工薪易”平台不承担任何责任，但将尽力减少因此而给发活方、接活方造成的损失和影响。
                                                 3 任何一方因不可抗力事件不能履行本协议的，应当在事件发生后7日内书面通知对方，以减轻可能给对方造成的损失，并应当在通知发出后7日内提供相关的证明。
                                                 4 如果不可抗力持续25日以上，任何一方均有权终止本协议。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十四、违约责任
                                                 1 任何一方违反本协议约定的，应承担相应的违约责任，并赔偿对方因此受到的直接损失。守约方有权单方提前终止本协议。
                                                 2 本协议有效期内，因国家相关主管部门颁布、变更的法令、政策（包括但不限于监管机构向“工薪易”平台出具的，要求停止或整改本协议约定的业务的书面通知等，下同）导致“工薪易”平台不能提供约定服务的，不视为“工薪易”平台违约，双方应根据相关的法令、政策变更本协议内容。
                                                 3 如一方违反本协议约定的禁止性规定（禁止性规定，是指协议条款中含有“不得”、“不能”等表述的内容，不可抗力条款中的表述除外），守约方有权单方提前终止协议。
                                                 4 发活方、接活方不论采取何种方式非法获取“工薪易”平台系统数据、利用“工薪易”平台谋取不正当利益或从事非法活动的，“工薪易”平台有权追究违约责任。
                                                 5 “工薪易”平台有权对发活方、接活方是否涉嫌违反本协议之约定做出认定，并根据认定结果中止、终止向接活方提供服务或采取其他限制措施。
                                                 1）对于发活方通过“工薪易”平台提交的涉嫌违法或涉嫌侵犯他人合法权利或违反本协议的项目成果，“工薪易”平台可不经通知发活方即予以退回等；对于发活方审核不合格的项目成果，接活方无权向发活方和/或“工薪易”平台主张支付承包款报酬。
                                                 2）发活方、接活方违反本协议约定对任意第三方造成损害的，发活方、接活方均应当以自己的名义独立承担所有的法律责任，并应确保“工薪易”平台、“工薪易”平台、发活方免于因此产生损失或增加费用。如发活方、接活方该等行为使“工薪易”平台、“工薪易”平台、发活方遭受任何损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，发活方、接活方应当赔偿以上主体因此遭受的全部损失（即直接损失及签订本协议时所能预见到的损失）和/或发生的费用，包括合理的律师费用、调查取证费用等。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十五、本协议的签订、变更、补充或解除
                                                 1 本协议由本协议正文条款、附件与“工薪易”平台规则等公示的各项通知、操作指引等规范性文件组成，相关名词可互相引用参照，如有不同理解，以本协议条款为准。
                                                 2 本协议有效期为22个月。本协议有效期届满时如各方无异议，则本协议期满后自动顺延，每次顺延期限为22个月，顺延次数不限；本协议期满后，如发活方发布信息继续存在或接活方在“工薪易”平台接活方账户中继续领取任务的，视为发活方同意续约。
                                                 3 任何一方拒绝履行本协议项下义务，或在违反本协议约定且在能够纠正的情况下，未能于3个工作日内履行义务或纠正违约行为，则守约方可要求违约方继续履行本协议或立即予以补救；违约方在上述限定时间内仍拒绝履行或未采取有效补救措施的，守约方有权解除本协议，且本协议的解除不影响守约方要求违约方承担违约责任。
                                            </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十六、适用法律和争议解决
                                                    16.1 本协议订立、履行、解释及争议解决均在“工薪易”平台规则基础上理解，并适用中华人民共和国（不包括香港、澳门、台湾地区）法律。
                                                    16.2 双方约定，如果就本协议发生争议，双方一致同意交由湖南省长沙市仲裁委员会依其仲裁规则进行仲裁，且该仲裁裁决具有终局性。
                                        </Text>
                                                <Text style={{ marginTop: 10 }}>
                                                    十七、其他
                                                    1 本协议正本一式两份，各方各执一份，均具有同等法律效力。
                                                    2 本协议自下列两种情形之任意一种最先发生之日起生效：
                                                    各方均签署本协议时，或
                                                    发活方在“工薪易”平台完成发活方用户注册时；
                                                    或接活方在“工薪易”平台完成接活用户注册时。
                                                    签署声明：
                                                    各方充分知悉且已理解本协议全部内容，各方均保证下列之签名者和/或网络流程操作者已获有效授权并足以代表各方订立本协议。
                                        </Text>
                                            </View> :
                                            this.state.useInform == true ?
                                                <View style={{ marginTop: 10 }}>
                                                    <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize + 2, marginTop: 10 }}>工薪易平台须知</Text>
                                                    <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize + 2, marginTop: 10 }}>  提示条款  欢迎您与“工薪易”平台共同遵守《“工薪易”平台须知》，并使用“工薪易”平台服务！
                                            </Text>
                                                    <Text style={{ marginTop: 10 }}>    各服务条款前所列索引关键词仅为帮助您理解该条款表达的主旨之用，不影响或限制本协议条款的含义或解释。为维护您自身权益，建议您仔细阅读各条款具体表述。
                                            </Text>
                                                    <Text style={{ marginTop: 10 }}>    【审慎阅读】您在申请注册流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗体下划线标识，您应重点阅读。如您对协议有任何疑问，可向“工薪易”平台客服咨询。
                                             </Text>
                                                    <Text style={{ marginTop: 10 }}>   【签约动作】当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与工薪易达成一致，成为“工薪易”平台“用户”。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。
        
                                            </Text>
                                                    <Text style={{ marginTop: 10 }}>    第一条 概述
                                                          1、为保障“工薪易”平台用户合法权益，维护“工薪易”平台正常经营秩序，根据国家相关法律法规制定《“工薪易”平台须知》（以下简称《平台须知》或本规则）。
                                                          2、《平台须知》是阐述“工薪易”平台用户基本行为规则的条款。用户使用“工薪易”平台的服务、在“工薪易”平台交易时，除了应该遵守我国相关法律法规和规章的规定，还应当遵循《平台须知》确定的规则。
                                                          3、违反《平台须知》行为的认定与处理，应基于“工薪易”平台认定的事实，严格依法依规执行。“工薪易”平台用户在适用本规则上一律平等。
                                                          4、用户在本平台的活动应当遵守国家法律、法规、规章等规范性文件及《平台须知》的规定。对任何涉嫌违反法律、法规、规章等规范性文件及《平台须知》的行为，本平台有权直接依法依规处理。用户在平台的行为没有相应规范对应的，“工薪易”平台有权本着诚实信用、公平合理的原则酌情处理。但“工薪易”平台对用户的处理不免除相关用户应当承担的法律责任。
                                                          5、用户在“工薪易”平台上的全部行为仅代表其本人，不代表“工薪易”平台，基于该行为的全部责任应当由用户自行承担。
                                                          6、在“工薪易”平台上完成的交易，除按照法律规定不能转让或用户另有约定外，交易中涉及的相关的知识产权归属依法律、法规、规章等规范性文件确定或由双方约定。
                                                          7、用户在“工薪易”平台注册时，应当认真阅读并同意接受本规则约束，不同意接受本规则的，不能注册和使用“工薪易”平台的各项服务；同理，用户注册使用工薪易服务即视同接受本规则。
                                                          8、“工薪易”平台有权对本规则进行修改和补充，并在平台上予以公告。自公告之日起，若用户不同意相关修改的，应当立即停止使用“工薪易”平台的相关服务或产品；若继续使用的，则视为接受修改后的规则。公告时已成交但尚未完成的交易可继续适用成交时有效的规则。“工薪易”平台有权对用户行为及适用的规则进行独立认定，并据此处理。
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>  第二条 名词解释
                                                          2.1 “工薪易”平台：指运行于“工薪易”网站的“www.xsypt.com.cn”及“工薪易app”或其他H5等开放平台，是“工薪易”网站上为用户提供信息发布、交流，以及其他技术服务的电子商务交易服务平台，本协议中提及的应由接活方或发活方行使的权利和履行的义务，由“工薪易”内部负责履行。
                                                          2.2 “工薪易”平台规则：指公示在“工薪易”平台之上的，与“工薪易”平台运营相关的全部规范性文件及流程操作指引。
                                                          2.3 “发活方”、“注册”及“入驻”：发活方（又称“发活团队”、“发活企业”、“发包方”），指已成为“工薪易”平台的非自然人注册用户并准备或正在“工薪易”平台发布项目的用户。
                                                          2.4 “发活”、“项目”、“任务”：“发活”，指“发活方”在“工薪易”平台以任务发布用户账户先后发布需要解决的具有一定经济价值或社会意义的任务、课题或其他相关需求的项目总和；“项目”，指“工薪易”平台分批次发布的各期工薪易；“任务”，指“工薪易”平台发布项目中所包含的每个单独的任务。
                                                          2.5 “接活方”：（又称“接活团队”、“团队”、“接包方”）指在“工薪易”平台上已注册并经接活方确认符合“工薪易”平台业务要求的接活团队或在有关工商行政管理部门登记注册的个体工商户，从事领取、解决和/或完成“工薪易”平台公开且正在进行中的待解决任务、课题或其他相关需求，由单一或数个自然人组成并负责管理本团队的主体。
                                                          2.6 “任务佣金”：发活方按 “工薪易”平台规则确定的费率及本协议约定，向发布项目中的合格接活方按审核通过的任务数量支付的佣金总和，从发活方在“工薪易”平台的账户支付款项中即时划扣。
                                                          2.7 “平台服务费”：指发活方为“工薪易”平台提供本协议项下服务时，按 “工薪易”平台规则确定的费率及本协议约定向湖南薪税信息科技有限责任公司支付的“工薪易”平台服务费。
                                                          2.8 “预付款”：是指发活方在发布当期项目或委托服务需求前，应按提示在“工薪易”平台线上完成相应预付，预付款由“工薪易”平台支配并按本协议及“工薪易”平台规则划扣，用以保障接活方劳有所得、增强任务可信度、提升任务完成率的资金。
                                                          2.9 “审核”：发活方根据发布项目或委托服务内容制定明确、具体、可衡量、可执行的审核标准，接活方按该标准提交全部项目成果证明（即“项目成果”）后，发活方按该标准审核并在“工薪易”平台确认。
                                                          2.10 “结算金额”：是指发活方发布项目或委托服务事项中发生的全部交易金额（含任务佣金、平台服务费、手续费、税费等其他相关费用），向“工薪易”平台即时支付。
                                                          2.11 “不可抗力”：指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定疾病、黑客攻击、网络病毒、电信网监部门技术管制、政府行为或任何其它自然或人为造成的灾难等强力制约本协议正常履行的客观情况。
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>  第三条 如何成为企业用户
          “工薪易”平台企业用户，必须是一个真实的企业实体，通过在线申请注册认证（提交下述资料并通过审核）后，可成为企业用户：
          1、真实清晰的企业法人营业执照、组织机构代码证、税务登记证的复印件或扫描件（或三证合一营业执照）。
          2、授权委托书（授权个人代表公司在“工薪易”平台进行操作）。
          上述材料均需要打印加盖企业公章后扫描上传。
  </Text>
                                                    <Text style={{ marginTop: 10 }}> 第四条 如何成为个人用户
  </Text>
                                                    <Text style={{ marginTop: 10 }}>  在遵守国家法律法规和“工薪易”平台所有规则的前提下，符合下列条件的自然人可以通过““工薪易”平台的注册要求“完成相应的注册步骤并通过审核成为“工薪易”平台的个人用户，必须为本人操作：
                                                      1、年满十八周岁，并具有民事权利能力和民事行为能力的自然人。
                                                      2、无民事行为能力人或限制民事行为能力人应经过其监护人的同意。
                                                      3、用户需要对平台提供明确的联系方式，并提供真实姓名（这是支付有保障的前提）并进行实名认证；在交易的过程中可以使用昵称，平台将充分保护用户的隐私权。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}> 第五条 信息审核
                                                      用户在“工薪易”平台注册和发布信息时须合法合规，如果账号、名称、头像、宣传介绍等资料和发布信息内容不真实，或涉及色情、暴力、恐怖主义、危害国家安全和社会公共利益等违法违规内容，或涉及侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的，“工薪易”平台有权采取不予注册、删除内容、冻结或注销用户账号等措施，因此产生的不利后果和损失由用户自行承担，具体请参见《“工薪易”平台发送内容规范》。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>         第六条 知识产权
                                                      1、本平台及本平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、档案、资料、平台构架、平台版面的安排、网页设计、经由本平台或广告商向用户呈现的广告或资讯，均由本平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经本平台或权利人明示授权，用户保证不修改、出租、出借、出售、散布本平台及本平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。
                                                      2、用户不得经由非本平台所提供的界面和入口注册、登录和使用本平台，否则，“工薪易”平台有权采取冻结或注销用户账号等措施，因此产生的不利后果和损失由用户自行承担。
                                                       第七条 用户信息
                                                      3、信息使用
                                                      （1）本平台不会向任何人出售或出借用户信息，除非事先得到用户的许可。
                                                      （2）本平台亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户信息。任何用户如从事上述活动，一经发现，本平台有权立即终止与该用户的服务协议，查封其账号，并依法追究其责任。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>   4、信息安全
                                                      在使用本平台服务进行网上交易时，请用户妥善保护自己的信息。
                                                      如果用户发现自己信息泄密，尤其是用户账号或资金账户及密码发生泄露，请用户立即联络本平台客服，以便我们采取相应措施。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>      第八条 不可抗力
                                                      因不可抗力或者其他意外事件，使得本平台的运行不可能、不必要或者无意义的，双方均不承担责任。本须知所称之不可抗力意指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定传染病、黑客攻击、网络病毒、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>    第九条 保密
                                                      接活（接包）方和发活（发包）方双方应对与对方有关的商业秘密、技术秘密、新产品（或系统）设计方案、重大经营决策以及客户交易结算资金等保密信息妥善保管，在协议期间及协议终止后均不得向第三方披露或公开，亦不得将该商业秘密或技术秘密用于除协议之外的任何其它用途；不得泄密，未经对方同意不得在合作范围以外使用，不得以任何方式向第三方提供，法律法规另有规定或双方另有约定的除外。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>     第十条 完整性
                                                      本规则与《发活（发包）须知》、《接活（接包）须知》、《“工薪易”平台举报处理制度》等“工薪易”平台公示的各项规则共同构成界定各方权利、义务和责任的依据，相关名词可互相引用参照，如有不同理解，以本规则条款为准。
                                                      用户对本规则理解和认同，用户即对上述各规则所有组成部分的内容理解并认同，一旦使用本平台，用户即受上述各规则所有组成部分的约束。
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>    第十一条 最终解释权
                                                       “工薪易”平台运营商对规则以及基于本规则制定的各项规则拥有最终解释权。
                                               </Text>
                                                    <Text style={{ marginTop: 10 }}>      第十二条 法律适用和争议解决
                                              </Text>
                                                    <Text style={{ marginTop: 10 }}>      本规则的解释以及“工薪易”平台运营商与使用“工薪易”平台的用户之间的争议纠纷适用中华人民共和国法律。
        
                                             </Text>
                                                    <Text style={{ marginTop: 10 }}>   工薪易平台安全声明
                                </Text>
                                                    <Text style={{ marginTop: 10 }}>             一、安全性声明
                      2“工薪易”平台利用了当今最先进的部分互联网安全技术。当您访问我们的网站时，您的信息会通过服务器验证和数据加密保护，确保您的数据安全无误，而且仅您单位的注册用户可以访问。 您的竞争对手将完全无法访问您的数据。
                      2“工薪易”平台会向个人用户及企业用户提供唯一的账户（用户名和密码），用户登录时必须输入。
                      3如果安全调查机构欲了解有关如何将安全性问题报告给“工薪易”平台的信息，应查看我们的漏洞报告策略。
              </Text>
                                                    <Text style={{ marginTop: 10 }}>                    二、漏洞报告策略
                                     </Text>
                                                    <Text style={{ marginTop: 10 }}>  “工薪易”平台安全团队深知独立安全研究机构在 Internet 安全领域内的重要作用。确保客户数据安全是我们的首要职责，我们鼓励大家负责任地报告我们的站点或应用程序内可能存在的任何漏洞。“工薪易”平台将全力与安全社区合作，验证报告给我们的所有潜在漏洞并给予响应。
          </Text>
                                                    <Text style={{ marginTop: 10 }}> 2报告潜在的安全性漏洞
                  （2）通过发送电子邮件至 xzrl_002@263.com 将可疑安全性漏洞的详细信息秘密告知 “工薪易”平台；
                  （2）提供可疑漏洞的完整详细信息，以便 “工薪易”平台安全团队能够验证并重现该问题。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    2“工薪易”平台不允许下列类型的安全性调查
                       （2）导致或尝试导致拒绝服务 (DoS) 状况；
                  （2）访问或尝试访问不属于您的数据或信息；
                  （3）损害/摧毁或尝试损害/摧毁不属于您的数据或信息。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   3“工薪易”平台安全团队承诺
                  对于遵循此“工薪易”平台漏洞报告策略的所有安全调查机构，“工薪易”平台安全团队承诺如下事项：
                  （2）及时响应，确认收到您的报告；
                  （2）提供解决该漏洞的预计时间范围；
                  （3）修复漏洞后通知报告者。
                      4不提供赔偿
              </Text>
                                                    <Text style={{ marginTop: 10 }}>  “工薪易”平台不会向报告安全性漏洞的任何人给予赔偿，如要求给予赔偿则被视为违反上述条件。此时，“工薪易”平台将保留其全部法律权利。
        
          </Text>
                                                    <Text style={{ marginTop: 10 }}>     工薪易平台发票开具规则
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>     第一条
                      为维护“工薪易”平台用户的合法权益，根据我国税务相关法律规定及“工薪易”平台发布的文件、规则，制定本规则。
              </Text>
                                                    <Text style={{ marginTop: 10 }}>    第二条
                  本规则适用于所有在“工薪易”平台进行的交易。发活方承诺并保证其在“工薪易”平台上发布的项目需求及任务信息真实、准确无误导性，发活方承诺提供资料之真实性、合法性、准确性和完整性，不存在任何虚假、误导、违法情形，不会侵犯任何第三方的合法权益。发活方应当保证本合作资金来源的稳定性及合法性,若因资金自身存在的问题并由此带来的一切后果及法律责任由发活方自行承担。
                  发票开具应依照发活方验收的项目或上传“工薪易”平台《批量验收项目发佣金》验收的项目为准，发活方保证发票内容与接活方真实提供服务内容以及发活方验收的内容一致，否则“工薪易”平台有权上报相关国家相关机关并追究发活方及接活方相关责任。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    第三条
                  “工薪易”平台服务费的发票将在交易结束“工薪易”平台实际收取接包/转包服务内容开具服务费。“工薪易”平台有权对相关服务进行审查，如果出现虚假业务、虚开发票、洗钱、违反国家相应规定等违法行为，“工薪易”平台有权解除合同，停止所有操作并向相关部门进行举报。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   第四条
                  “工薪易”平台就电子订单项下的实际交易内容开具相关发票，只提供所收取的接包服务费、发包服务费（如有）、其它增值服务费（如有）的相应发票。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   第五条
                  交易结束后，“工薪易”平台将根据用户提供的真实的服务内容开具对应类型（个人或单位）的发票邮寄给发活方用户。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>      第六条
                  发票一旦开具，就无法更改发票内容，请用户务必准确填写发票抬头付款人的企业名称或个人姓名及详细联系方式，因用户填写信息错误所导致发票的错误或与真实的业务不一致，“工薪易”平台不承担任何责任。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>  第七条 本规则自发布之日起实行。
        
        
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    工薪易”平台服务发布规范（类似于“猪八戒”）
        
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>   第一条　为了维护“工薪易”平台网站正常运营秩序，推动灵活用工共享经济，保障需求顺利进行，根据《“工薪易”平台须知》，制定本规则。
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>   第二条　接活方出售服务需要符合国家法律法规以及“工薪易”平台网站关于需求的相关规定。
                  第三条　服务发布规则适用于在“工薪易”平台网站上发布服务的所有接活方，接活方需遵守服务发布规则。发布的服务，需通过“工薪易”平台网站审核后才能成功发布。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>      第四条　服务信息的组成要素及定义
                  1、服务类目：根据服务内容选择行业性分类。
                  2、服务标题：从服务的内容、卖点等方面进行个性化描述。
                  3、服务验收标准：接活（接包）方从事服务后有明确的标准，对其服务的结果进行验收。
                  4、服务价格：根据服务内容和市场行情进行合理定价。
                  5、服务详情：对于服务内容、服务标准、服务卖点、服务承诺等特性的详细描述。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    第五条　服务发布规则
                  服务内容禁止使用或变相使用国家领导人及其家属信息（包括姓名、形象、漫画形象及含相关信息的案例展示等）；服务内容禁用词汇（极限词汇，比较级、最高级词汇，夸张、虚假词汇等）；服务内容禁用未经授权使用的标签（如：未经授权的官方特定产品标识、未经授权的暗指性官方特定产品标识、推荐、优选、热销、热卖、爆款等），服务封面及轮播区图片禁止出现联系方式（包括但不限于QQ，电话，网址，二维码，条形码，邮箱等）；服务相关信息必须属于合法可展示的图片内容，严禁发布侵权、色情等违法图片。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   1、服务类目
                  （1）根据服务的内容选择合适的类目，类目必须与服务标题、服务内容的描述保持一致；
                  （2）如服务的类目与服务标题、服务内容不一致，官方有权将服务下架；
                  （3）若服务类目为代理公司注册、代理记账等，接活方必须具备企业资质，且营业执照营业范围必须包含所出售的服务内容。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>  2、服务标题
                  （1）服务标题限定在20个汉字（40个字符）以内，否则会影响发布；
                  （2）标题简单直接，突出卖点；
                  基本组合：服务类目+服务属性+服务卖点
                  (比如搜索“XX企业logo设计”，logo设计服务标题可以这样写：logo设计 企业logo设计设计总监操刀3套方案)
                  （3）请勿堆砌关键词，在服务标题中大量滥用与该服务无关的热搜关键词；
                  （4）禁止使用特殊符号；
                  （5）禁用极限词汇，比较级、最高级词汇，夸张、虚假词汇（例：第一、最好、最大、首选、唯一等）。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>  3、服务价格
                  （1）根据市场行情及该服务的内容，对服务进行合理定价，不得恶意低价竞争，扰乱市场行情；
                  （2）服务修改规范：
                  未产生交易的服务可按照新发布服务流程进行修改；
          </Text>
                                                    <Text style={{ marginTop: 10 }}> 4、服务封面
                  （1）图片必须清晰完整，且图片内容必须与服务内容保持一致；
                  （2）图片信息必须属于合法可展示的图片内容，严禁发布侵权、色情等违法图片；
                  （3）图片不允许出现QQ，电话，网址，二维码，条形码，邮箱等联系方式；
                  （4）图片禁止出现带有“工薪易”平台网站字样或logo；
                  （5）图片需要和服务内容以及属性强相关（特殊说明：二级类目为“产品设计”的服务，封面必须使用产品设计效果图）。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>     5、服务详情
                  请详细描述与此服务相关的内容介绍，内容描述准确、完整、真实，不得虚假承诺。
                  服务详情描述需要和服务内容以及属性强相关；
                  服务详情需包含：
                  A、服务标准：必须详细说明服务的内容。
                  B、交易流程：必须符合“工薪易”平台网站交易流程。（注：“工薪易”平台网站交易流程是指发活方发布任务-接活方提供服务并交付任务-发活方验收项目-发活方支付佣金-双方评价）
                  C、售后服务：必须详细描述售后的服务项及售后服务时间。
                  D、退款须知：详细描述各种情况下的退款说明。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>     第六条　凡是违反宪法精神和中华人民共和国相关法律法规、带有民族歧视性、夸大宣传并带有欺骗性、有损于社会主义道德风尚或者有其他不良影响的服务，“工薪易”平台网站将禁止发布。以下服务内容由于违反法律、法规和“工薪易”平台网站相关规则而禁止服务：
                  1、服务与所发布的类目或属性不符的。
                  2、服务名称、图片、价格及售后服务等服务要素之间明显不匹配。
                  3、发布重复信息：标题，图片，重要属性、服务内容存在较高相似度的服务，只允许发布一次。
                  4、含有非平台业务的广告、招聘类内容。
                  5、泄露个人隐私（联系方式包括但不限于电话、QQ、邮箱、网址等）。
                  6、涉黄、赌博、暴力等服务。
                  7、发布非约定服务，是指接活方通过“工薪易”平台网站平台发布或出售未经“工薪易”平台网站许可的服务：论文代写类服务、盗图申诉类服务、刷钻、刷单及刷信用等其他违反法律、法规、行政规章等相关规定的服务。
                  8、售卖服务中禁止出售无效服务（无效服务：因促销服务活动，超过活动期限而未将其下架的服务）。
                  9、假冒服务成份，是指接活方对服务或成份信息的描述与发活方收到的服务完全不符。
                  10、发布非“工薪易”平台银行账号及个人支付宝账户等信息，特殊情形除外。
                  11、任何有损网络安全的服务：木马、黑客程序等。
                  12、扰乱市场秩序，是指以任何形式，刻意规避“工薪易”平台网站的各类规则或市场管控措施，或以不正当的方式获取、使用“工薪易”平台官方资源的行为。
                  13、侵犯第三方权利的服务。
                  14、侵犯第三方知识产权的服务：软件/程序破解类服务、游戏/程序外挂类服务、盗取网银、游戏账号类服务。
                  15、禁止出售商标、专利、版权等知识产权相关业务的咨询、注册、登记、转让、查询、备案类服务。
                  16、违背社会公共利益或公共道德或“工薪易”平台网站认为不适合的服务。
                  17、为违法行为（包括但不限于规避社保、虚开发票、洗钱、虚构业务、偷逃税款、行贿受贿等）发布服务任务。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   第七条　制度保障
                  接活方发布的服务一旦违规，“工薪易”平台网站将按照《“工薪易”平台网站举报处理制度》和《“工薪易”平台网站发送内容规范》的相关规则进行处理。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>      第八条　知识产权的归属
                  1、服务采购时，双方通过合同约定服务形成的软件或作品的知识产权归属。
                  2、发活方若需要线下签署知识产权转让协议，签署合作协议（出售服务）的接活方有义务配合发活方完成协议的签署，若接活方拒绝签署，发活方有权要求退还相应费用，该接活方也将视为“未完成工作”受到相应处理。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    第九条　平台服务费
                  按照签署的相关协议执行
          </Text>
                                                    <Text style={{ marginTop: 10 }}>       第十条　违约责任
                  1、发活方责任：
                  若由于发活方原因，导致交易无法完成的，接活方不承担任何责任。若由于发活方原因致使接活方产生损失的，平台有权使用发活方存入平台的预付款对接活方进行赔付。
                  2、接活方责任：
                  若接活方不能按双方约定完成需求或是不能履行自己的承诺，“工薪易”平台网站将按照“工薪易”平台网站规则进行相应处理。
          </Text>
                                                    <Text style={{ marginTop: 10 }}> 第十一条 本规则自发布之日起实行。
        
        
          </Text>
                                                    <Text style={{ marginTop: 10 }}>      “工薪易”平台服务发布规范（类似于“猪八戒”）
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>            第一条　为了维护“工薪易”平台网站正常运营秩序，推动灵活用工共享经济，保障需求顺利进行，根据《“工薪易”平台须知》，制定本规则。
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>          第二条　接活方出售服务需要符合国家法律法规以及“工薪易”平台网站关于需求的相关规定。
                                               </Text>
                                                    <Text style={{ marginTop: 10 }}>            第三条　服务发布规则适用于在“工薪易”平台网站上发布服务的所有接活方，接活方需遵守服务发布规则。发布的服务，需通过“工薪易”平台网站审核后才能成功发布。
                                                 </Text>
                                                    <Text style={{ marginTop: 10 }}>             第四条　服务信息的组成要素及定义
                  1、服务类目：根据服务内容选择行业性分类。
                  2、服务标题：从服务的内容、卖点等方面进行个性化描述。
                  3、服务验收标准：接活（接包）方从事服务后有明确的标准，对其服务的结果进行验收。
                  4、服务价格：根据服务内容和市场行情进行合理定价。
                  5、服务详情：对于服务内容、服务标准、服务卖点、服务承诺等特性的详细描述。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    第五条　服务发布规则
                                            </Text>
                                                    <Text style={{ marginTop: 10 }}> 服务内容禁止使用或变相使用国家领导人及其家属信息（包括姓名、形象、漫画形象及含相关信息的案例展示等）；服务内容禁用词汇（极限词汇，比较级、最高级词汇，夸张、虚假词汇等）；服务内容禁用未经授权使用的标签（如：未经授权的官方特定产品标识、未经授权的暗指性官方特定产品标识、推荐、优选、热销、热卖、爆款等），服务封面及轮播区图片禁止出现联系方式（包括但不限于QQ，电话，网址，二维码，条形码，邮箱等）；服务相关信息必须属于合法可展示的图片内容，严禁发布侵权、色情等违法图片。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>     1、服务类目
              （1）根据服务的内容选择合适的类目，类目必须与服务标题、服务内容的描述保持一致；
              （2）如服务的类目与服务标题、服务内容不一致，官方有权将服务下架；
              （3）若服务类目为代理公司注册、代理记账等，接活方必须具备企业资质，且营业执照营业范围必须包含所出售的服务内容。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>    2、服务标题
              （1）服务标题限定在20个汉字（40个字符）以内，否则会影响发布；
              （2）标题简单直接，突出卖点；
              基本组合：服务类目+服务属性+服务卖点
              (比如搜索“XX企业logo设计”，logo设计服务标题可以这样写：logo设计 企业logo设计设计总监操刀3套方案)
              （3）请勿堆砌关键词，在服务标题中大量滥用与该服务无关的热搜关键词；
              （4）禁止使用特殊符号；
              （5）禁用极限词汇，比较级、最高级词汇，夸张、虚假词汇（例：第一、最好、最大、首选、唯一等）。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>   3、服务价格
              （1）根据市场行情及该服务的内容，对服务进行合理定价，不得恶意低价竞争，扰乱市场行情；
              （2）服务修改规范：
              未产生交易的服务可按照新发布服务流程进行修改；
      </Text>
                                                    <Text style={{ marginTop: 10 }}>      4、服务封面
              （1）图片必须清晰完整，且图片内容必须与服务内容保持一致；
              （2）图片信息必须属于合法可展示的图片内容，严禁发布侵权、色情等违法图片；
              （3）图片不允许出现QQ，电话，网址，二维码，条形码，邮箱等联系方式；
              （4）图片禁止出现带有“工薪易”平台网站字样或logo；
              （5）图片需要和服务内容以及属性强相关（特殊说明：二级类目为“产品设计”的服务，封面必须使用产品设计效果图）。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>  5、服务详情
              请详细描述与此服务相关的内容介绍，内容描述准确、完整、真实，不得虚假承诺。
              服务详情描述需要和服务内容以及属性强相关；
              服务详情需包含：
              A、服务标准：必须详细说明服务的内容。
              B、交易流程：必须符合“工薪易”平台网站交易流程。（注：“工薪易”平台网站交易流程是指发活方发布任务-接活方提供服务并交付任务-发活方验收项目-发活方支付佣金-双方评价）
              C、售后服务：必须详细描述售后的服务项及售后服务时间。
              D、退款须知：详细描述各种情况下的退款说明。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>    第六条　凡是违反宪法精神和中华人民共和国相关法律法规、带有民族歧视性、夸大宣传并带有欺骗性、有损于社会主义道德风尚或者有其他不良影响的服务，“工薪易”平台网站将禁止发布。以下服务内容由于违反法律、法规和“工薪易”平台网站相关规则而禁止服务：
              1、服务与所发布的类目或属性不符的。
              2、服务名称、图片、价格及售后服务等服务要素之间明显不匹配。
              3、发布重复信息：标题，图片，重要属性、服务内容存在较高相似度的服务，只允许发布一次。
              4、含有非平台业务的广告、招聘类内容。
              5、泄露个人隐私（联系方式包括但不限于电话、QQ、邮箱、网址等）。
              6、涉黄、赌博、暴力等服务。
              7、发布非约定服务，是指接活方通过“工薪易”平台网站平台发布或出售未经“工薪易”平台网站许可的服务：论文代写类服务、盗图申诉类服务、刷钻、刷单及刷信用等其他违反法律、法规、行政规章等相关规定的服务。
              8、售卖服务中禁止出售无效服务（无效服务：因促销服务活动，超过活动期限而未将其下架的服务）。
              9、假冒服务成份，是指接活方对服务或成份信息的描述与发活方收到的服务完全不符。
              10、发布非“工薪易”平台银行账号及个人支付宝账户等信息，特殊情形除外。
              11、任何有损网络安全的服务：木马、黑客程序等。
              12、扰乱市场秩序，是指以任何形式，刻意规避“工薪易”平台网站的各类规则或市场管控措施，或以不正当的方式获取、使用“工薪易”平台官方资源的行为。
              13、侵犯第三方权利的服务。
              14、侵犯第三方知识产权的服务：软件/程序破解类服务、游戏/程序外挂类服务、盗取网银、游戏账号类服务。
              15、禁止出售商标、专利、版权等知识产权相关业务的咨询、注册、登记、转让、查询、备案类服务。
              16、违背社会公共利益或公共道德或“工薪易”平台网站认为不适合的服务。
              17、为违法行为（包括但不限于规避社保、虚开发票、洗钱、虚构业务、偷逃税款、行贿受贿等）发布服务任务。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>   第七条　制度保障
              接活方发布的服务一旦违规，“工薪易”平台网站将按照《“工薪易”平台网站举报处理制度》和《“工薪易”平台网站发送内容规范》的相关规则进行处理。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>     第八条　知识产权的归属
              1、服务采购时，双方通过合同约定服务形成的软件或作品的知识产权归属。
              2、发活方若需要线下签署知识产权转让协议，签署合作协议（出售服务）的接活方有义务配合发活方完成协议的签署，若接活方拒绝签署，发活方有权要求退还相应费用，该接活方也将视为“未完成工作”受到相应处理。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>     第九条　平台服务费
              按照签署的相关协议执行
      </Text>
                                                    <Text style={{ marginTop: 10 }}>   第十条　违约责任
              1、发活方责任：
              若由于发活方原因，导致交易无法完成的，接活方不承担任何责任。若由于发活方原因致使接活方产生损失的，平台有权使用发活方存入平台的预付款对接活方进行赔付。
              2、接活方责任：
              若接活方不能按双方约定完成需求或是不能履行自己的承诺，“工薪易”平台网站将按照“工薪易”平台网站规则进行相应处理。
      </Text>
                                                    <Text style={{ marginTop: 10 }}>  第十一条 本规则自发布之日起实行。
        
        
      </Text>
                                                    <Text style={{ marginTop: 10 }}>                                      “工薪易”平台发活（发包）须知
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>                                     第一条 概述
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>    为了维护“工薪易”平台正常运营秩序，保障发活（发包）顺利进行，制定本规则。
              </Text>
                                                    <Text style={{ marginTop: 10 }}>  第二条 声明
                                            </Text>
                                                    <Text style={{ marginTop: 10 }}>   发活（发包）方发活（发包）需符合国家法律法规以及“工薪易”平台关于发活（发包）的相关规定。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   第三条 服务内容
                  3.1发活方企业根据经营需要，委托接活方依法通过“工薪易”平台提供相关服务，服务方式包括但不限于咨询、信息、培训、技术、宣传、地推等各方共同确认的其他服务方式与服务内容。
                  3.2 各方确认并同意，本协议项下发活方委托接活方提供的服务内容及服务方式应当符合国家法律法规以及有关部门的监管规定，且应符合双方的经营范围及资质许可要求，同时也不应违反“工薪易”平台规则。
                  3.3审核标准
                  1) 为了保护接活方权益并使接活方更加准确了解“项目成果的合格状态”，发活方应在发布项目时设定审核标准，且应审慎填写并严格执行；
                  2) 如发活方未予审核通过，接活方可向“工薪易”平台复议，由发活方给出最终判定结果。
                  3.4 接活方仅按本协议约定的服务内容为发活方提供信息及相关服务，因接活方或第三方原因导致发活方损失的，“工薪易”平台不承担相关赔偿责任和/或相关所有连带责任。
                  3.5 费用实现：发活方按审核标准确认接活方提交的项目成果合格之后，发活方根据“工薪易”平台统计的接活方与发活方之间的项目成交金额，通过“工薪易”平台向接活方支付相应金额。
                  3.6 接活方账户使用方式：接活方账户在“工薪易”平台上领取的全部项目以及接活方团队师傅在线下具体执行任务中，均以接活方自身名义进行项目领取、项目执行、项目成果提交等。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   第四条 禁止发布需求类别
   </Text>
                                                    <Text style={{ marginTop: 10 }}>   凡是违反宪法精神和中华人民共和国相关法律法规、带有民族歧视性、夸大宣传并带有欺骗性、有损于社会主义道德风尚或者有其他不良影响的发活（发包），“工薪易”平台将拒绝提供服务。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>   1、以下订单由于违反法律、法规和“工薪易”平台相关规则而禁止发布：
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
                                                    <Text style={{ marginTop: 10 }}>   2、以下订单可能对交易参与方或者第三方带来损害而禁止发布：
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
                                                    <Text style={{ marginTop: 10 }}>   第五条 违规需求处理办法
                  在第三条的违规需求发布中，若“工薪易”平台未发现异常给予通过审核，事后经其他用户举报，立即关闭订单，并根据《“工薪易”平台举报处理制度》和《“工薪易”平台违规行为及处理制度》进行处理。
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
                                                    <Text style={{ marginTop: 10 }}>    第八条 企业用户所属企业法人授权内容
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
                                                    <Text style={{ marginTop: 10 }}>    第十条 执行规则
                  本规则与《发活（发包）须知》、《接活（接包）须知》、《“工薪易”平台举报处理制度》等“工薪易”平台公示的各项规则共同构成界定各方权利、义务和责任的依据，相关名词可互相引用参照，如有不同理解，以本规则条款为准：项目订单，具体以发活方提供的《批量验收项目发佣金》执行验收情况为准。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>    第十一条 验收与支付
                  1、接活（接包）方提请验收后，发活（发包）方须在7天内作出处理，若发活（发包）方未拒绝验收、也没有进行退回，则系统自动视为验收通过。
                  2、发活（发包）方与接活（接包）方之间的费用结算和支付，按《“工薪易”平台共享经济（自由职业者服务）协议》中约定的方式进行结算并支付。
                  （1）“工薪易”平台根据发活（发包）方上传系统中的验收结算表，将报酬支付给接活（接包）方。“工薪易”平台以发活（发包）方每次提供数据为准，一经确认无法修改，发活（发包）方上传验收结算表需谨慎。
                  （2）“工薪易”平台需收取平台服务费及其他费用具体以相关协议为准，若之后发生因交易纠纷或双方协商涉及到退款的举报，平台服务费及其他费用不予退还。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>      第十二条 违约责任
                  1、发活（发包）方责任：若由于发活（发包）方原因，导致交易无法完成的，接活（接包）方不承担任何责任。若由于发活（发包）方原因致使接活（接包）方产生损失的，“工薪易”平台有权使用发活（发包）方存入平台的预付款对接活（接包）方进行赔付，但是，“工薪易”平台并不需要因此向接活（接包）方承担任何赔偿责任。
                  2、接活（接包）方责任：若接活（接包）方不能按要求完成订单，将按照平台相关规则进行相应处理。
            第十三条 交易纠纷处理
                  1、交易双方使用“工薪易”平台进行交易时，应当遵守“工薪易”平台上的各项规则，因未使用“工薪易”平台进行交易或超出举报时限而产生的纠纷，平台不予受理。
                  2、交易纠纷处理办法由《“工薪易”平台举报处理制度》作出具体规定。
                  3、“工薪易”平台处理交易纠纷以发活（发包）方已存入平台的预付款资金为限，若双方在需求要求中约定了有超过发活（发包）方预付款金额的赔付内容，由双方自行协商处理，“工薪易”平台不接受此类争议的处理。
                      第十四条 所有权、知识产权、使用权
                  14.2 “工薪易”平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、图像、视频、档案、资料、网站构架、网站版面的安排、网页设计、经由“工薪易”平台或广告商向用户呈现的广告或资讯，均由“工薪易”平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经“工薪易”平台或权利人明示书面授权，接活方、接活方雇员及代理人保证不修改、出租、出借、出售、散布“工薪易”平台及“工薪易”平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。与“工薪易”平台相关的且由此业务产生的商业秘密信息、客户资料、渠道资源、技术资料和技术诀窍等所有权均归“工薪易”平台所有。
                  14.2 服务软件形式
          </Text>
                                                    <Text style={{ marginTop: 10 }}>  若“工薪易”平台依托“软件”向发活方、接活方提供平台服务，接活方还应遵守以下约定：
                                            </Text>
                                                    <Text style={{ marginTop: 10 }}> 14.2.2 “工薪易”平台可能为不同的终端设备开发不同的软件版本，发活方、接活方应当根据实际需要选择下载合适的版本进行安装。
                  14.2.2 如果发活方从未经合法授权的第三方获取本软件或与本软件名称相同的安装程序，“工薪易”平台将无法保证该软件能否正常使用，由此给发活方及接活方造成的任何损失不予负责。
                  14.2.3 为了增进平台用户体验、完善服务内容，“工薪易”平台将不时提供软件更新服务（该更新可能会采取软件替换、修改、功能强化、版本升级等形式）。为不断优化用户体验，保证服务的安全性与功能的一致性，“工薪易”平台有权对软件进行更新或对软件的部分功能效果进行改变或限制。
                  14.2.4 软件新版本发布后，旧版软件可能无法使用。“工薪易”平台不保证旧版软件继续可用及相应的客户服务，请发活方及接活方随时核对并下载最新版本。
          </Text>
                                                    <Text style={{ marginTop: 10 }}>  第十五条 本规则自发布之日起实行
        
        
            </Text>
                                                    <Text style={{ marginTop: 10 }}>           “工薪易”平台接包须知
                                                  </Text>
                                                    <Text style={{ marginTop: 10 }}>           第一条 概述
                      为了维护“工薪易”平台正常运营秩序，保障交易顺利进行，制定本规则。
              </Text>
                                                    <Text style={{ marginTop: 10 }}>          第二条 声明
                  1、接活（接包）方需符合国家法律法规以及“工薪易”平台关于发包的相关规定。接活（接包）方使用“工薪易”平台进行交易时，应当遵守“工薪易”平台上公示的各项规则，积极提升自身经营状况，为发活（发包）方提供高品质的商品及优质的服务。
                  2、为了提升发活（发包）方的消费体验，维护“工薪易”平台正常运营秩序，对于违反接包规则的接活（接包）方，“工薪易”平台将按照本规则规定的情形对接活（接包）方进行处理。
          3、本规则只适用于中华人民共和国大陆境内交易产生的纠纷，涉及到此范围以外的争议，不适用本规则。 </Text>
                                                    <Text style={{ marginTop: 10 }}>  第三条 服务内容
                3.1 发活方企业根据经营需要，委托接活方依法通过“工薪易”平台提供相关服务，服务方式包括但不限于咨询、信息、培训、技术、宣传、地推等各方共同确认的其他服务方式与服务内容。
                3.2 各方确认并同意，本协议项下发活方委托接活方提供的服务内容及服务方式应当符合国家法律法规以及有关部门的监管规定，且应符合双方的经营范围及资质许可要求，同时也不应违反“工薪易”平台规则。
        </Text>
                                                    <Text style={{ marginTop: 10 }}>  3.3审核标准
                1) 为了保护接活方权益并使接活方更加准确了解“项目成果的合格状态”，发活方应在发布项目时设定审核标准，且应审慎填写并严格执行；
                2) 如发活方未予审核通过，接活方可向“工薪易”平台复议，由发活方给出最终判定结果。
                3.4 接活方仅按本协议约定的服务内容为发活方提供信息及相关服务，因接活方或第三方原因导致发活方损失的，“工薪易”平台不承担相关赔偿责任和/或相关所有连带责任。
                3.5 费用实现：发活方按审核标准确认接活方提交的项目成果合格之后，发活方根据“工薪易”平台统计的接活方与发活方之间的项目成交金额，通过“工薪易”平台向接活方支付相应金额。
                3.6 接活方账户使用方式：接活方账户在“工薪易”平台上领取的全部项目以及接活方团队师傅在线下具体执行任务中，均以接活方自身名义进行项目领取、项目执行、项目成果提交等。
        
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第四条 接活（接包）方的权利和义务
                1、接活（接包）方承诺如因其承揽发活（发包）方通过“工薪易”平台发包的任务，导致第三方向“工薪易”平台提出索赔的，接活（接包）方将承担“工薪易”平台一切损失，且“工薪易”平台有权停止接活（接包）方继续使用“工薪易”平台。接活（接包）方与发活（发包）方届时依约结算。
                2、除非另行达成一致，接活（接包）方接包时应无条件遵守发活（发包）方关于项目的服务和技术要求，否则，发活（发包）方或“工薪易”平台有权不授予接活（接包）方订单。
                3、接活（接包）方为完成电子订单下的任务所需的工具、设备及场地由接活（接包）方自行负责解决。
                4、电子订单约定的价款为包干费用，包括了接活（接包）方为完成任务所付出的精力、交通、通讯、税收等一切费用，接活（接包）方不得以任何借口向发活（发包）方或“工薪易”平台索要除约定报酬金额以外的其他费用。
                5、接活（接包）方同意发生争议时，工薪易系统记载的数据、信息等可以作为证据使用。
                6、接活（接包）方保证提供身份信息真实有效，服务具体订单与发活方验收项目一致，不得与发活（发包）方虚构业务或以合法形式掩盖违法的目的（包括但不限于虚开发票、逃税漏税、抽逃出资、洗钱等），否则因此造成的损失由发活方和接活方承担与“工薪易”平台无关，“工薪易”平台有权将违法材料移送执法机关、举报等。
                7、接活（接包）方承诺提交的代码、方案、设计图稿等不涉嫌抄袭他人作品，提交的成果物不涉及知识产权纠纷，如果涉嫌盗用抄袭或者侵害其他第三方的知识产权，一经查实，接活（接包）方应自行承担所有责任，造成平台或发活（发包）方损失的，还应赔偿平台或发活（发包）方损失。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第五条 参与接包竞争规则
                1、接活（接包）方在“工薪易”平台上参与接包竞争，应当遵守法律、法规、规章等规范性文件的规定和“工薪易”平台相关规则，接活（接包）方不得参与违规需求接包竞争，否则一切不利后果由本人承担。
                2、接活（接包）方应保证交付提交物不侵犯第三方的专利权、著作权、商标权或其他任何专有权利。
                3、接活（接包）方应当保证参与接包竞争中所提交的的所有信息真实、可靠。不得夸大或者伪造自身经历，以影响发活（发包）方的判断或者骗取发活（发包）方信任。
                4、接活（接包）方上传的提交物应满足发包需求要求。对于无效参与接包竞争，“工薪易”平台有权未经接活（接包）方同意进行屏蔽。无效参与接包竞争的判定标准如下：
                （1）参与接包竞争的相关文件属于广告、低俗信息等违规内容。
                （2）参与接包竞争的相关文件与需求无任何关联。
                （3）没有提交实际作品的。
                （4）接活（接包）方参与接包竞争的相关文件无法满足需求的基本要素。
                （5）其他属于无效参与接包竞争的情况。
                5、提交物的知识产权归属按照法律规定确定，但接活（接包）方和发活（发包）方在电子订单可以对此另行作出特别约定。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第六条 签单
                1、发活（发包）方与接活（接包）方商量一致，通过签订电子订单即确定双方的合作行为，电子订单具有法律效力。
                2、发活（发包）方若根据订单约定需要线下签署知识产权转让协议，中选接活（接包）方有义务配合发活（发包）方完成协议的签署，若接活（接包）方拒绝签署，发活（发包）方有权要求取消接活（接包）方中选资格。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第七条 提交
                1、“工薪易”平台通过租用华为公司网络存储服务为交易双方的交易过程提供电子数据存储，若发生纠纷时是有效的举证依据。
                2、对于需要交接源文件的交易，接活（接包）方应在完成工作之后主动将源文件交付给发活（发包）方。
                3、如果发活（发包）方因接活（接包）方提交物侵犯了其他任何第三方的权利而遭到损失，有权向接活（接包）方追偿。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第八条 违约责任
                1、发活（发包）方责任：若由于发活（发包）方原因，导致交易无法完成的，接活（接包）方不承担任何责任。若由于发活（发包）方原因致使接活（接包）方产生损失的，“工薪易”平台有权协调发活（发包）方用托管的资金对接活（接包）方进行赔付，但是，平台对接活（接包）方不承担任何赔偿责任。
                2、接活（接包）方责任：若接活（接包）方不能按要求完成订单，将按照电子订单约定进行相应处理。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第九条 交易纠纷处理
                1、接活（接包）方和发活（发包）方使用“工薪易”平台进行交易时，应当遵守“工薪易”平台上的各项规则，因进行交易或超出举报时限（即该笔交易交易完毕并成功提现25日后）而产生的纠纷，平台不予受理。
                2、“工薪易”平台处理交易纠纷以发活（发包）方已存入平台的预付款资金为限，若双方在需求要求中约定了有超过发活（发包）方预付款金额的赔付内容，由双方自行协商处理，“工薪易”平台不接受此类争议的处理。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第十条 所有权、知识产权、使用权
                10.1 “工薪易”平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、图像、视频、档案、资料、网站构架、网站版面的安排、网页设计、经由“工薪易”平台或广告商向用户呈现的广告或资讯，均由“工薪易”平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经“工薪易”平台或权利人明示书面授权，接活方、接活方雇员及代理人保证不修改、出租、出借、出售、散布“工薪易”平台及“工薪易”平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。与“工薪易”平台相关的且由此业务产生的商业秘密信息、客户资料、渠道资源、技术资料和技术诀窍等所有权均归“工薪易”平台所有。
                10.2 服务软件形式
                若“工薪易”平台依托“软件”向发活方、接活方提供平台服务，接活方还应遵守以下约定：
                10.2.1 “工薪易”平台可能为不同的终端设备开发不同的软件版本，发活方、接活方应当根据实际需要选择下载合适的版本进行安装。
                10.2.2 如果发活方从未经合法授权的第三方获取本软件或与本软件名称相同的安装程序，“工薪易”平台将无法保证该软件能否正常使用，由此给发活方及接活方造成的任何损失不予负责。
                10.2.3 为了增进平台用户体验、完善服务内容，“工薪易”平台将不时提供软件更新服务（该更新可能会采取软件替换、修改、功能强化、版本升级等形式）。为不断优化用户体验，保证服务的安全性与功能的一致性，“工薪易”平台有权对软件进行更新或对软件的部分功能效果进行改变或限制。
                10.2.4 软件新版本发布后，旧版软件可能无法使用。“工薪易”平台不保证旧版软件继续可用及相应的客户服务，请发活方及接活方随时核对并下载最新版本。
            </Text>
                                                    <Text style={{ marginTop: 10 }}>  第十一条 本规则自发布之日起实行
                                            </Text>
                                                </View>
                                                :
                                                this.state.privacyInfrom == true ?
                                                    <View style={{ marginTop: 10 }}>
                                                        <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize + 2, marginTop: 10 }}>隐私权政策</Text>
                                                        <Text style={{ marginTop: 10 }}>提示条款</Text>
                                                        <Text>您的信任对我们非常重要，我们深知个人信息对您的重要性，我们将按法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全可控。鉴于此，工薪易平台服务提供者（或简称“我们”）制定本《隐私权政策》（下称“本政策 /本隐私权政策”）并提醒您：
                        本政策适用于工薪易平台提供的所有产品和服务。如我们关联公司（范围详见定义部分）的产品或服务中使用了工薪易平台提供的产品或服务但未设独立隐私权政策的，则本政策同样适用于该部分产品或服务。
                        需要特别说明的是，本政策不适用于其他第三方向您提供的服务，也不适用于工薪易平台中已另行独立设置法律声明及隐私权政策的产品或服务。例如工薪易平台上的发活方依托工薪易平台向您提供需求信息时，您向发活方提供的个人信息不适用本政策。
                        在使用工薪易平台各项产品或服务前，请您务必仔细阅读并透彻理解本政策，在确认充分理解并同意后使用相关产品或服务。一旦您开始使用工薪易平台各项产品或服务，即表示您已充分理解并同意本政策。如对本政策内容有任何疑问、意见或建议，您可通过工薪易平台提供的各种联系方式与我们联系。
</Text>
                                                        <Text style={{ marginTop: 10 }}>第一部分 定义</Text>
                                                        <Text>工薪易平台：指工薪易平台网站（域名为“www.xsypt.com.cn”）及“工薪易app”或其他H5等开放平台。
                        工薪易平台服务提供者：指工薪易平台的网络及软件技术服务提供者湖南薪税信息科技有限责任公司及关联公司。
                        关联公司：指公司湖南薪税信息科技有限责任公司及工薪易平台服务提供者的关联公司。
                        个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
                        个人敏感信息：指包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息等的个人信息。
                        个人信息删除：指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。
除另有约定外，本政策所用定义与《工薪易平台服务协议》中的定义具有相同的涵义。 </Text>
                                                        <Text style={{ marginTop: 10 }}>第二部分  隐私权政策</Text>
                                                        <Text style={{ marginTop: 10 }}>本隐私权政策部分将帮助您了解以下内容：
                        一、我们收集了哪些信息
                        二、我们如何使用收集的信息
                        三、我们如何使用Cookie和同类技术
                        四、我们如何共享、转让、公开披露您的信息
                        五、我们如何保护您的信息
                        六、您如何管理您的信息
                        七、我们如何处理未成年人的信息
                        八、您的信息如何在全球范围转移
                        九、本隐私权政策如何更新
                        十、如何联系我们
</Text>
                                                        <Text style={{ marginTop: 10 }}>一、我们收集了哪些信息
                        （一）您创建或者提供给我们的信息
                        1、成为我们的用户
                        我们通过工薪易平台为您提供用户服务。为使用我们的用户服务，您需要创建工薪易平台账户，提供手机号码、拟使用的用户名和密码。
                        如果您选择提供真实姓名、性别、出生年月日、居住地、您本人肖像的头像等非注册必须的个人资料，我们可以为您提供用户生日特权等更加个性化的用户服务。如果您不提供上述信息，不会影响您使用工薪易平台的浏览、搜索、相关平台服务。
                        如果您需要注册为发活方，除了上述信息外，我们会收集您的身份信息或企业基本信息等法律规定收集的信息。
                        对于需要通过工薪易平台账户才能使用的服务，我们可能会根据您提供的上述信息校验您的用户身份，确保我们是在为您本人提供服务。
                        如果您已拥有工薪易平台账户，我们可能会在工薪易平台服务中显示您的上述个人信息，以及您在工薪易平台上或与工薪易平台账户相关联的产品和服务中执行的操作，例如通过工薪易平台账户集中展示您的个人资料或交易订单。我们会尊重您对工薪易平台服务和工薪易平台账户设置所做的选择。
                        2、完成您相关的交易
                        如果您是发活方企业，为完成您所选择或达成的交易，您可以在平台发布需求信息，提供服务规范要求及验收标准。
                        在向工薪易平台提供这些企业信息之前，您需确保您已经取得合法的授权，并保证发布信息真实、有效、合理、合法，并保证符合工薪易平台其他规定。
                        如果您是接活方，为完成您所选择或达成交易，根据发布任务的要求提供相关服务，根据任务要求您必须具备相关资质或证明。例如，从业经历证明、相关行业从业资格证书、个体工商户等。
                        如果您选择通过工薪易平台转化为个体工商户，需要提供本人真实身份信息，并保证提供信息准确无误，且为本人意愿。平台不接受任何带办理或授权办理，如有请终止操作，否则因此产生所有法律责任由操作人本人承担。
                        为便于向您提供订单管理服务，我们会收集您在使用我们服务过程中产生的订单信息。
                        （二）我们在您使用服务过程中收集的信息
                        我们会收集关于您使用我们产品或服务以及使用方式的信息，这些信息包括：
                        设备信息：我们会根据您在软件安装及/或使用中授予的具体权限，接收并记录您所使用的设备相关信息（例如设备型号、操作系统版本、设备设置、唯一设备标识符、设备环境等软硬件特征信息）、设备所在位置相关信息（例如IP 地址、GPS位置以及能够提供相关信息的WLAN接入点、蓝牙和基站等传感器信息）。如果您在安装及/或使用过程中拒绝授予我们相应权限的，我们并不会记录您上述对应的信息。
                        服务日志信息：当您使用我们的网站或客户端提供的产品或服务时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存。例如搜索查询内容、IP地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及您访问的网页记录等。
                        其他相关信息：为了帮助您更好地使用我们的产品或服务，我们会收集相关信息。
                        请您理解，单独的设备信息、日志信息等是无法识别特定自然人身份的信息。除非将这类非个人信息与其他信息结合用于识别特定自然人身份，或者将其与个人信息结合使用，那么在结合使用期间，这类非个人信息将被视为个人信息，我们会将该类个人信息做匿名化、去标识化处理（取得您的授权或法律法规另有规定的情况除外）。
                        当您与我们联系时，为验证您的身份，帮助您解决问题，我们可能会记录您与我们的对话并收集其他为解决问题所需的必要信息。
                        （三）我们通过间接获得方式收集到的您的信息
                        为确认交易状态，为您提供售后与争议解决服务，我们会通过您基于交易所选择的交易对象、提现银行机构等，收集与交易进度相关的您的交易、提现、订单信息。
                        您可通过工薪易平台账户在我们提供的链接入口使用我们关联公司提供的产品或服务，包括来自水滴孵化器、工薪易平台等信息。当您通过工薪易平台账户使用上述服务时，您授权我们根据实际业务及合作需要，从我们关联公司处接收、汇总、分析我们确认其来源合法或您授权同意其向我们提供的您的个人信息或交易信息。
</Text>
                                                        <Text style={{ marginTop: 10 }}>二、我们如何使用收集的信息
                        1、向您提供产品或服务。
                        2、为改善我们的产品或服务，以便向您提供更符合您个性化需求的信息展示、搜索及交易服务，我们会根据您的浏览及搜索记录、设备信息、位置信息、订单信息，提取您的浏览及搜索偏好、行为习惯、位置信息等特征，基于特征标签进行间接人群画像，并展示、推送信息和可能的商业广告。
                        如果您不想接收我们给您发送的商业广告，您可通过短信提示回复退订或我们提供的其他方式进行退订。
                        3、为提高您使用我们及我们关联公司、合作伙伴提供服务的安全性，确保操作环境安全与识别用户账号异常状态，保护您或其他用户或公众的人身财产安全免遭侵害，更好地预防钓鱼网站、欺诈、网络漏洞、计算机病毒、网络攻击、网络侵入等安全风险，更准确地识别违反法律法规或工薪易平台相关协议规则的情况，我们可能使用或整合您的用户信息、交易信息、设备信息、有关网络日志以及我们关联公司、合作伙伴取得您授权或依适用的法律共享的信息，综合判断您工薪易平台账户及交易风险、进行身份验证、检测及防范安全事件，并依法采取必要的记录、审计、分析、处置措施。
                        4、我们可能会对收集的信息进行去标识化地研究、统计分析和预测，用于改善工薪易平台的内容和布局，为商业决策提供产品或服务支撑，以及改进我们的产品和服务（例如使用匿名数据进行机器学习或模型算法训练）。
                        5、如我们停止运营工薪易平台产品或服务，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，并对我们所持有的与已关停业务相关的个人信息进行删除或匿名化处理。
                        6、若我们将信息用于本政策未载明的其他用途，或者将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
</Text>
                                                        <Text style={{ marginTop: 10 }}>三、我们如何使用 Cookie 和同类技术
                        （一） Cookie
                        为确保网站正常运转、为您获得更轻松的访问体验、向您推荐您可能感兴趣的内容，我们会在您的计算机或移动设备上存储Cookie、Flash Cookie，或浏览器（或关联应用程序）提供的其他通常包含标识符、站点名称以及一些号码和字符的本地存储（统称“Cookie”）。借助于 Cookie，网站能够存储您的偏好或订单等数据。
                        如果您的浏览器或浏览器附加服务允许，您可修改对Cookie的接受程度或拒绝我们的Cookie。有关详情，请参见 AboutCookies.org。但如果您这么做，在某些情况下可能会影响您安全访问我们的网站，且可能需要在每一次访问我们的网站时更改用户设置。
                        （二） Cookie 同类技术
                        除 Cookie外，我们还会在网站上使用网站信标、像素标签、ETag等其他同类技术。
                        例如，我们向您发送的电子邮件可能含有链接至我们网站内容的地址链接，如果您点击该链接，我们则会跟踪此次点击，帮助我们了解您的产品或服务偏好，以便于我们主动改善客户服务体验。网站信标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签，我们能够获知电子邮件是否被打开。如果您不希望自己的活动以这种方式被追踪，则可以随时从我们的寄信名单中退订。
                        ETag（实体标签）是在互联网浏览器与互联网服务器之间背后传送的HTTP协议标头，可代替Cookie。ETag可以帮助我们避免不必要的服务器负载，提高服务效率，节省资源、能源，同时，我们可能通过ETag来记录您的身份，以便我们可以更深入地了解和改善我们的产品或服务。大多数浏览器均为用户提供了清除浏览器缓存数据的功能，您可以在浏览器设置功能中进行相应的数据清除操作。但请注意，如果停用ETag，您可能无法享受相对更佳的产品或服务体验。
</Text>
                                                        <Text style={{ marginTop: 10 }}>四、我们如何共享、转让、公开披露您的信息
                        （一）共享
                        我们不会与工薪易平台服务提供者以外的公司、组织和个人共享您的个人信息，但以下情况除外：
                        1、在法定情形下的共享：我们可能会根据法律法规规定、诉讼争议解决需要，或按行政、司法机关依法提出的要求，对外共享您的个人信息。
                        2、在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
                        3、在您主动选择情况下共享：
                        您同意并知晓当您承揽发活方发布的项目/任务信息后，需要向发活方递交您的资历信息（个体工商户执照、身份信息、结算账户信息、订单结算信息等），并需要经过发活方的筛选并审核（审核方式包括查看执照信息、过往订单信息、面谈、体检、任务考核、），当您选择承接项目或扫描企业提供的开工二维码时，即视为您已经同意向发布相应服务的招募企业或人员提供上述资历信息并允许其浏览及为招募目的合理使用您资历的权利。对于因此而引起的任何法律纠纷（包括但不限于招募企业或人员错误或非法使用前述资历信息），工薪易平台不承担任何法律责任。
                        尽管工薪易平台已尽商业合理努力设置了安全防范措施，以下情况仍然有可能发生，包括但不限于 （1）某一第三方躲过了我们的安全措施并进入我们的数据库，查找到您的资历；（2）因不可抗力导致网络系统的瘫痪导致服务中断；（3）因网站和服务器收并额度或其他第三方侵害导致您个人信息泄露、损毁和丢失等。
                        工薪易平台认为在您把您的资历放入我们的数据库时，您已经意识到了这种风险的存在，并同意承担这样的风险。对于因此而引起的任何法律纠纷，工薪易平台不承担任何法律责任。
                        您通过工薪易平台接活或提供服务，我们会根据您的选择，将您的订单信息中与交易有关的必要信息共享给相关项目的提供者（发活方），以实现您的资质或能力审查，任务交易，任务的验收及费用结算需求。
                        4、与关联公司间共享：为便于我们基于工薪易平台账户向您提供产品和服务，推荐您可能感兴趣的信息，识别用户账号异常，保护工薪易平台关联公司或其他用户或公众的人身财产安全免遭侵害，您的个人信息可能会与我们的关联公司和/或其指定的服务提供商共享。我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束，如果我们共享您的个人敏感信息或关联公司改变个人信息的使用及处理目的，将再次征求您的授权同意。
                        5、鉴于水滴(昆山)孵化器管理有限公司为工薪易平台提供接活方营业执照委托办理、孵化、税务代征代缴、合作签署、发票的委托代办等，我们会将您与订单有关的必要订单信息共享给水滴公司，用于与财税、孵化等相关用途。
                        6、与授权合作伙伴共享：我们可能委托授权合作伙伴为您提供某些服务或代表我们履行职能，我们仅会出于本隐私权政策声明的合法、正当、必要、特定、明确的目的共享您的信息，授权合作伙伴只能接触到其履行职责所需信息，且不得将此信息用于其他任何目的。
                        目前，我们的授权合作伙伴包括以下类型：
                        （1）广告、分析服务类的授权合作伙伴。除非得到您的许可，否则我们不会将您的个人身份信息与提供广告、分析服务的合作伙伴共享。我们会向这些合作伙伴提供有关其广告覆盖面和有效性的信息，但不会提供您的个人身份信息，或者我们将这些信息进行汇总，以便它不会识别您个人。这类合作伙伴可能将上述信息与他们合法获取的其他数据相结合，以进行广告或决策建议。
                        （2）供应商、服务提供商和其他合作伙伴。我们将信息发送给支持我们业务的供应商、服务提供商和其他合作伙伴，这些支持包括提供技术基础设施服务、分析我们服务的使用方式、衡量广告和服务的有效性、提供客户服务、支付便利或进行学术研究和调查。
                        我们会与其约定严格的数据保护措施，令其按照我们的说明、本隐私权政策以及其他任何相关的保密和安全措施来处理个人信息。
                        （二）转让
                        我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                        1、在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
                        2、在工薪易平台服务提供者发生合并、收购或破产清算情形，或其他涉及合并、收购或破产清算情形时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受本政策的约束，否则我们将要求该公司、组织和个人重新向您征求授权同意。
                        （三）公开披露
                        我们仅会在以下情况下，公开披露您的个人信息：
                        1、获得您明确同意或基于您的主动选择，我们可能会公开披露您的个人信息；
                        2、如果我们确定您出现违反法律法规或严重违反工薪易平台相关协议及规则的情况，或为保护工薪易平台用户或公众的人身财产安全免遭侵害，我们可能依据法律法规或征得您同意的情况下披露关于您的个人信息，包括相关违规行为以及工薪易平台已对您采取的措施。例如，若您因出售假冒商品而严重违反工薪易规则，我们可能会公开披露您的店铺认证主体信息与违规情况。
                        （四）共享、转让、公开披露个人信息时事先征得授权同意的例外
                        以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
                        1、与国家安全、国防安全有关的；
                        2、与公共安全、公共卫生、重大公共利益有关的；
                        3、与犯罪侦查、起诉、审判和判决执行等司法或行政执法有关的；
                        4、出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                        5、您自行向社会公众公开的个人信息；
                        6、从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
                        请知悉，根据适用的法律，若我们对个人信息采取技术措施和其他必要措施进行处理，使得数据接收方无法重新识别特定个人且不能复原，则此类处理后数据的共享、转让、公开披露无需另行向您通知并征得您的同意。
</Text>
                                                        <Text style={{ marginTop: 10 }}>五、我们如何保护您的信息
                        （一）我们已采取符合业界标准、合理可行的安全防护措施保护您的信息，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。例如，在您的浏览器与服务器之间交换数据时受 SSL协议加密保护；我们同时对工薪易平台网站提供HTTPS协议安全浏览方式；我们会使用加密技术提高个人信息的安全性；我们会使用受信赖的保护机制防止个人信息遭到恶意攻击；我们会部署访问控制机制，尽力确保只有授权人员才可访问个人信息；以及我们会举办安全和隐私保护培训课程，加强用户对于保护个人信息重要性的认识。
                        （二）我们有行业先进的以数据为核心、围绕数据生命周期进行的数据安全管理体系，从组织建设、制度设计、人员管理、产品技术等方面多维度提升整个系统的安全性。
                        （三）我们会采取合理可行的措施，尽力避免收集无关的个人信息。我们只会在达成本政策所述目的所需的期限内保留您的个人信息（除非法律有强制的存留要求）。
                        （四）互联网并非绝对安全的环境，使用工薪易平台服务时，我们强烈建议您不要使用非工薪易平台推荐的通信方式发送您的信息。您可以通过我们的服务建立联系和相互分享。当您通过我们的服务创建交流、交易或分享时，您可以自主选择沟通、交易或分享的对象，作为能够看到您的交易内容、联络方式、交流信息或分享内容等相关信息的第三方。
                        在使用工薪易平台服务进行网上交易时，您不可避免地要向交易对方或潜在的交易对方披露自己的个人信息，如联络方式或联系地址。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。如您发现自己的个人信息尤其是您的账户或密码发生泄露，请您立即联络工薪易平台客服，以便我们根据您的申请采取相应措施。
                        请注意，您在使用我们服务时自愿共享甚至公开分享的信息，可能会涉及您或他人的个人信息甚至个人敏感信息，如您在评价时选择上传包含个人信息的图片。请您更加谨慎地考虑，是否在使用我们的服务时共享甚至公开分享相关信息。
                        请使用复杂密码，协助我们保证您的账号安全。我们将尽力保障您发送给我们的任何信息的安全性。如果我们的物理、技术或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。
                        （五）我们将不定期更新并公开安全风险、个人信息安全影响评估报告等有关内容，您可通过工薪易平台公告方式获得。
                        （六）在不幸发生个人信息安全事件后，我们将按照法律法规的要求向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。事件相关情况我们将以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。
                        同时，我们还将按照监管部门要求，上报个人信息安全事件的处置情况。
</Text>
                                                        <Text style={{ marginTop: 10 }}>六、您如何管理您的信息
                        您可以通过以下方式访问及管理您的信息：
                        （一）查询您的信息
                        您有权查询您的信息。您可以通过以下方式自行查询您的信息：
                        账户信息——如果您希望访问或编辑您的账户中的个人基本资料信息和绑定账户信息、更改您的密码等，您可以通过登录账号通过“设置”执行此类操作。
                        订单信息：您可以在工薪易平台中查阅账单记录、交易记录等。
                        如果您无法通过上述路径查询该等信息，您可以随时通过工薪易平台客服与我们取得联系。我们将在15天内回复您的访问请求。
                        对于您在使用我们的产品或服务过程中产生的其他个人信息，我们将根据本条“（七）响应您的上述请求”中的相关安排向您提供。
                        （二）更正或补充您的信息
                        当您发现我们处理的关于您的信息有错误时，您有权要求我们做出更正或补充。您可以通过“（一）查询您的信息”中列明的方式提出更正或补充申请。
                        （三）删除您的信息
                        您可以通过“（一）查询您的信息”中列明的方式删除您的部分信息。
                        在以下情形中，您可以向我们提出删除个人信息的请求：
                        1、如果我们处理个人信息的行为违反法律法规；
                        2、如果我们收集、使用您的个人信息，却未征得您的明确同意；
                        3、如果我们处理个人信息的行为严重违反了与您的约定；
                        4、如果您不再使用我们的产品或服务，或您主动注销了账号；
                        5、如果我们永久不再为您提供产品或服务。
                        若我们决定响应您的删除请求，我们还将同时尽可能通知从我们处获得您的个人信息的主体，并要求其及时删除（除非法律法规另有规定，或这些主体已独立获得您的授权）。
                        当您或我们协助您删除相关信息后，因为适用的法律和安全技术，我们可能无法立即从备份系统中删除相应的信息，我们将安全地存储您的个人信息并将其与任何进一步处理隔离，直到备份可以清除或实现匿名。
                        （四）注销个体工商户
                        根据相关注销流程经过您本人授权，或经过您确认可以通过工薪易平台申请注销个体工商户，具体流程详见平台公示信息。
                        但您注销个体工商户，不会影响此前基于您的授权而开展的经营行为及个人信息处理。
                        （五）注销您的账户
                        您可以自行在“注销账户”页面（例如，手机工薪易APP“我的工薪易-设置-账户与安全-注销账户”）提交账户注销申请。
                        在您主动注销账户之后，我们将停止为您提供产品或服务，根据适用法律的要求删除您的个人信息，或使其匿名化处理。
                        （六）约束信息系统自动决策
                        在某些业务功能中，我们可能仅依据信息系统、算法等在内的非人工自动决策机制做出决定。如果这些决定显著影响您的合法权益，您有权要求我们做出解释，我们也将在不侵害工薪易平台商业秘密或其他用户权益、社会公共利益的前提下提供申诉方法。
                        （七）响应您的上述请求
                        为保障安全，您可能需要提供书面请求，或以其他方式证明您的身份。我们可能会先要求您验证自己的身份，然后再处理您的请求。
                        我们将在15天内做出答复。如您不满意，还可以通过工薪易平台客服发起投诉。
                        对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将酌情收取一定费用。对于与您的身份不直接关联的信息、无端重复信息，或者需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者不切实际的请求，我们可能会予以拒绝。
                        在以下情形中，按照法律法规要求，我们将无法响应您的请求：
                        1、与国家安全、国防安全有关的；
                        2、与公共安全、公共卫生、重大公共利益有关的；
                        3、与犯罪侦查、起诉、审判和执行判决等有关的；
                        4、有充分证据表明个人信息主体存在主观恶意或滥用权利的；
                        5、响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
                        6、涉及商业秘密的。
</Text>
                                                        <Text style={{ marginTop: 10 }}>七、我们如何处理未成年人的信息
                        在电子商务活动中我们推定您具有相应的民事行为能力。如您为未成年人，我们要求您请您的父母或监护人仔细阅读本隐私权政策，并在征得您的父母或监护人同意的前提下使用我们的服务或向我们提供信息。
                        对于经父母或监护人同意使用我们的产品或服务而收集未成年人个人信息的情况，我们只会在法律法规允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用、共享、转让或披露此信息。
</Text>
                                                        <Text style={{ marginTop: 10 }}>八、您的信息如何在全球范围转移
                        我们在中华人民共和国境内运营中收集和产生的个人信息，存储在中国境内，以下情形除外：
                        1、适用的法律有明确规定；
                        2、获得您的明确授权；
                        3、您通过互联网进行跨境交易等个人主动行为。
                        针对以上情形，我们会确保依据本隐私权政策对您的个人信息提供足够的保护。
</Text>
                                                        <Text style={{ marginTop: 10 }}>九、本隐私权政策如何更新
                        我们的隐私权政策可能变更。
                        未经您明确同意，我们不会限制您按照本隐私权政策所应享有的权利。我们会在专门页面上发布对隐私权政策所做的任何变更。
                        对于重大变更，我们还会提供更为显著的通知（包括我们会通过工薪易平台公示的方式进行通知甚至向您提供弹窗提示）。
                        本政策所指的重大变更包括但不限于：
                        1、我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
                        2、我们在控制权等方面发生重大变化。如并购重组等引起的信息控制者变更等；
                        3、个人信息共享、转让或公开披露的主要对象发生变化；
                        4、您参与个人信息处理方面的权利及其行使方式发生重大变化；
                        5、我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化；
                        6、个人信息安全影响评估报告表明存在高风险。
                        我们还会将本隐私权政策的旧版本在工薪易平台专门页面存档，供您查阅。
</Text>
                                                        <Text style={{ marginTop: 10 }}>十、如何联系我们
                        您可以通过以下方式与我们联系，我们将在15天内回复您的请求：
                        1、如对本政策内容有任何疑问、意见或建议，您可通过工薪易平台客服及工薪易平台服务中心在线客服与我们联系；
                        2、如发现个人信息可能被泄露，您可以通过工薪易平台客服投诉举报；
                        3、我们还设立了个人信息保护专职部门，您可以通过xzrl_001@163.com与其联系。
                        如果您对我们的回复不满意，特别是您认为我们的个人信息处理行为损害了您的合法权益，您还可以通过向被告住所地有管辖权的法院提起诉讼来寻求解决方案。
</Text>
                                                    </View> :
                                                    <View style={{ marginTop: 10 }}>
                                                        <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize + 2, marginTop: 10 }}>“工薪易”平台须知</Text>
                                                        <Text style={{ marginTop: 10 }}>
                                                            提示条款
                        欢迎您与“工薪易”平台共同遵守《“工薪易”平台须知》，并使用“工薪易”平台服务！
                </Text>
                                                        <Text style={{ marginTop: 10 }}> 各服务条款前所列索引关键词仅为帮助您理解该条款表达的主旨之用，不影响或限制本协议条款的含义或解释。为维护您自身权益，建议您仔细阅读各条款具体表述。
                                                </Text>
                                                        <Text style={{ marginTop: 10 }}> 【审慎阅读】您在申请注册流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗体下划线标识，您应重点阅读。如您对协议有任何疑问，可向“工薪易”平台客服咨询。
                                                </Text>
                                                        <Text style={{ marginTop: 10 }}> 【签约动作】当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与工薪易达成一致，成为“工薪易”平台“用户”。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止注册程序。
        
                                                </Text>
                                                        <Text style={{ marginTop: 10 }}> 第一条 概述
                        1、为保障“工薪易”平台用户合法权益，维护“工薪易”平台正常经营秩序，根据国家相关法律法规制定《“工薪易”平台须知》（以下简称《平台须知》或本规则）。
                        2、《平台须知》是阐述“工薪易”平台用户基本行为规则的条款。用户使用“工薪易”平台的服务、在“工薪易”平台交易时，除了应该遵守我国相关法律法规和规章的规定，还应当遵循《平台须知》确定的规则。
                        3、违反《平台须知》行为的认定与处理，应基于“工薪易”平台认定的事实，严格依法依规执行。“工薪易”平台用户在适用本规则上一律平等。
                        4、用户在本平台的活动应当遵守国家法律、法规、规章等规范性文件及《平台须知》的规定。对任何涉嫌违反法律、法规、规章等规范性文件及《平台须知》的行为，本平台有权直接依法依规处理。用户在平台的行为没有相应规范对应的，“工薪易”平台有权本着诚实信用、公平合理的原则酌情处理。但“工薪易”平台对用户的处理不免除相关用户应当承担的法律责任。
                        5、用户在“工薪易”平台上的全部行为仅代表其本人，不代表“工薪易”平台，基于该行为的全部责任应当由用户自行承担。
                        6、在“工薪易”平台上完成的交易，除按照法律规定不能转让或用户另有约定外，交易中涉及的相关的知识产权归属依法律、法规、规章等规范性文件确定或由双方约定。
                        7、用户在“工薪易”平台注册时，应当认真阅读并同意接受本规则约束，不同意接受本规则的，不能注册和使用“工薪易”平台的各项服务；同理，用户注册使用工薪易服务即视同接受本规则。
                        8、“工薪易”平台有权对本规则进行修改和补充，并在平台上予以公告。自公告之日起，若用户不同意相关修改的，应当立即停止使用“工薪易”平台的相关服务或产品；若继续使用的，则视为接受修改后的规则。公告时已成交但尚未完成的交易可继续适用成交时有效的规则。“工薪易”平台有权对用户行为及适用的规则进行独立认定，并据此处理。
                </Text>
                                                        <Text style={{ marginTop: 10 }}> 第二条 名词解释
                        2.1 “工薪易”平台：指运行于“工薪易”网站的“www.xsypt.com.cn”及“工薪易app”或其他H5等开放平台，是“工薪易”网站上为用户提供信息发布、交流，以及其他技术服务的电子商务交易服务平台，本协议中提及的应由接活方或发活方行使的权利和履行的义务，由“工薪易”内部负责履行。
                        2.2 “工薪易”平台规则：指公示在“工薪易”平台之上的，与“工薪易”平台运营相关的全部规范性文件及流程操作指引。
                        2.3 “发活方”、“注册”及“入驻”：发活方（又称“发活团队”、“发活企业”、“发包方”），指已成为“工薪易”平台的非自然人注册用户并准备或正在“工薪易”平台发布项目的用户。
                        2.4 “发活”、“项目”、“任务”：“发活”，指“发活方”在“工薪易”平台以任务发布用户账户先后发布需要解决的具有一定经济价值或社会意义的任务、课题或其他相关需求的项目总和；“项目”，指“工薪易”平台分批次发布的各期工薪易；“任务”，指“工薪易”平台发布项目中所包含的每个单独的任务。
                        2.5 “接活方”：（又称“接活团队”、“团队”、“接包方”）指在“工薪易”平台上已注册并经接活方确认符合“工薪易”平台业务要求的接活团队或在有关工商行政管理部门登记注册的个体工商户，从事领取、解决和/或完成“工薪易”平台公开且正在进行中的待解决任务、课题或其他相关需求，由单一或数个自然人组成并负责管理本团队的主体。
                        2.6 “任务佣金”：发活方按 “工薪易”平台规则确定的费率及本协议约定，向发布项目中的合格接活方按审核通过的任务数量支付的佣金总和，从发活方在“工薪易”平台的账户支付款项中即时划扣。
                        2.7 “平台服务费”：指发活方为“工薪易”平台提供本协议项下服务时，按 “工薪易”平台规则确定的费率及本协议约定向湖南薪税信息科技有限责任公司支付的“工薪易”平台服务费。
                        2.8 “预付款”：是指发活方在发布当期项目或委托服务需求前，应按提示在“工薪易”平台线上完成相应预付，预付款由“工薪易”平台支配并按本协议及“工薪易”平台规则划扣，用以保障接活方劳有所得、增强任务可信度、提升任务完成率的资金。
                        2.9 “审核”：发活方根据发布项目或委托服务内容制定明确、具体、可衡量、可执行的审核标准，接活方按该标准提交全部项目成果证明（即“项目成果”）后，发活方按该标准审核并在“工薪易”平台确认。
                        2.10 “结算金额”：是指发活方发布项目或委托服务事项中发生的全部交易金额（含任务佣金、平台服务费、手续费、税费等其他相关费用），向“工薪易”平台即时支付。
                        2.11 “不可抗力”：指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定疾病、黑客攻击、网络病毒、电信网监部门技术管制、政府行为或任何其它自然或人为造成的灾难等强力制约本协议正常履行的客观情况。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第三条 如何成为企业用户
                        “工薪易”平台企业用户，必须是一个真实的企业实体，通过在线申请注册认证（提交下述资料并通过审核）后，可成为企业用户：
                        1、真实清晰的企业法人营业执照、组织机构代码证、税务登记证的复印件或扫描件（或三证合一营业执照）。
                        2、授权委托书（授权个人代表公司在“工薪易”平台进行操作）。
                        上述材料均需要打印加盖企业公章后扫描上传。
                </Text>
                                                        <Text style={{ marginTop: 10 }}> 第四条 如何成为个人用户
                        在遵守国家法律法规和“工薪易”平台所有规则的前提下，符合下列条件的自然人可以通过““工薪易”平台的注册要求“完成相应的注册步骤并通过审核成为“工薪易”平台的个人用户，必须为本人操作：
                        1、年满十八周岁，并具有民事权利能力和民事行为能力的自然人。
                        2、无民事行为能力人或限制民事行为能力人应经过其监护人的同意。
                        3、用户需要对平台提供明确的联系方式，并提供真实姓名（这是支付有保障的前提）并进行实名认证；在交易的过程中可以使用昵称，平台将充分保护用户的隐私权。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第五条 信息审核
                        用户在“工薪易”平台注册和发布信息时须合法合规，如果账号、名称、头像、宣传介绍等资料和发布信息内容不真实，或涉及色情、暴力、恐怖主义、危害国家安全和社会公共利益等违法违规内容，或涉及侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的，“工薪易”平台有权采取不予注册、删除内容、冻结或注销用户账号等措施，因此产生的不利后果和损失由用户自行承担，具体请参见《“工薪易”平台发送内容规范》。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第六条 知识产权
                        1、本平台及本平台所使用的任何相关软件、程序、内容，包括但不限于作品、图片、档案、资料、平台构架、平台版面的安排、网页设计、经由本平台或广告商向用户呈现的广告或资讯，均由本平台或其它权利人依法享有相应的知识产权，包括但不限于著作权、商标权、专利权或其它专属权利等，受到相关法律的保护。未经本平台或权利人明示授权，用户保证不修改、出租、出借、出售、散布本平台及本平台所使用的上述任何资料和资源，或根据上述资料和资源制作成任何种类产品。
                        2、用户不得经由非本平台所提供的界面和入口注册、登录和使用本平台，否则，“工薪易”平台有权采取冻结或注销用户账号等措施，因此产生的不利后果和损失由用户自行承担。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第七条 用户信息
                        3、信息使用
                        （1）本平台不会向任何人出售或出借用户信息，除非事先得到用户的许可。
                        （2）本平台亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播用户信息。任何用户如从事上述活动，一经发现，本平台有权立即终止与该用户的服务协议，查封其账号，并依法追究其责任。
                        4、信息安全
                        在使用本平台服务进行网上交易时，请用户妥善保护自己的信息。
                        如果用户发现自己信息泄密，尤其是用户账号或资金账户及密码发生泄露，请用户立即联络本平台客服，以便我们采取相应措施。
                </Text>
                                                        <Text style={{ marginTop: 10 }}> 第八条 不可抗力
                        因不可抗力或者其他意外事件，使得本平台的运行不可能、不必要或者无意义的，双方均不承担责任。本须知所称之不可抗力意指不能预见、不能避免并不能克服的客观情况，包括但不限于战争、台风、水灾、火灾、雷击或地震、罢工、暴动、法定传染病、黑客攻击、网络病毒、电信部门技术管制、政府行为或任何其它自然或人为造成的灾难等客观情况。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第九条 保密
                        接活（接包）方和发活（发包）方双方应对与对方有关的商业秘密、技术秘密、新产品（或系统）设计方案、重大经营决策以及客户交易结算资金等保密信息妥善保管，在协议期间及协议终止后均不得向第三方披露或公开，亦不得将该商业秘密或技术秘密用于除协议之外的任何其它用途；不得泄密，未经对方同意不得在合作范围以外使用，不得以任何方式向第三方提供，法律法规另有规定或双方另有约定的除外。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第十条 完整性
                        本规则与《发活（发包）须知》、《接活（接包）须知》、《“工薪易”平台举报处理制度》等“工薪易”平台公示的各项规则共同构成界定各方权利、义务和责任的依据，相关名词可互相引用参照，如有不同理解，以本规则条款为准。
                        用户对本规则理解和认同，用户即对上述各规则所有组成部分的内容理解并认同，一旦使用本平台，用户即受上述各规则所有组成部分的约束。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第十一条 最终解释权
                        “工薪易”平台运营商对规则以及基于本规则制定的各项规则拥有最终解释权。
                </Text>
                                                        <Text style={{ marginTop: 10 }}>  第十二条 法律适用和争议解决
                                                </Text>
                                                        <Text style={{ marginTop: 10 }}>  本规则的解释以及“工薪易”平台运营商与使用“工薪易”平台的用户之间的争议纠纷适用中华人民共和国法律。
        
                                                </Text>

                                                    </View>
                                        }

                                        <TouchableOpacity style={{ width: deviceWidth - 80, height: 40, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginTop: 10, borderRadius: 5 }} onPress={() => this.setState({ contractVisible: false, registerInform: false, useInform: false, privacyInfrom: false })}><Text style={{ alignSelf: 'center', padding: 10, borderRadius: 5, alignContent: 'center', color: 'white', fontSize: Config.MainFontSize }}>确定</Text></TouchableOpacity>
                                    </View>
                                </ScrollView>
                            }


                        </Modal>
                    </View >
                    )
                }
    onLeftBack() {
        const {navigator} = this.props;
        navigator.pop();
    }
    //个人注册
    onRightCommit() {
        const telRule = /^1[0-9]{10}$/;
        //是否含有中文（也包含日文和韩文）
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        // if (reg.test(this.userName)) {
        //     Alert.alert("提示", '用户名为不能为中文,请重新输入', [{ text: '确定', onPress: () => { } }]);
        //     return;
        // }
        var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
        var patrn1 = /^(\w){6,20}$/;
        // if (this.userName == '') {
        //     Alert.alert("提示", '用户名为空,请重新输入', [{ text: '确定', onPress: () => { } }]);
        //     return;
        // }
        // if (!patrn.exec(this.userName)) {
        //     Alert.alert("提示", '请输入正确格式的用户名(5~20位字母开头、可包含数字)', [{ text: '确定', onPress: () => { } }]);
        //     return;
        // }
        if (!telRule.test(this.telphone) || this.telphone == '') {
            Alert.alert("提示", '请输入正确的手机号', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else if (this.newPassword1 == '') {
            Alert.alert("提示", '请输入密码', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else if (!patrn1.test(this.newPassword1)) {
            Alert.alert("提示", '请输入6～20位的密码(可包含数字、字母、下划线)！', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else if (this.state.code != this.bendiCode) {
            Alert.alert("提示", '验证码不正确,请重新输入', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else if (this.state.selected == false) {
            Alert.alert("提示", '请同意工薪易协议', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else {
            var entity = {
                    userName:this.telphone,
                    userPassword: this.newPassword1,
                    userMobiletel1: this.telphone,
                    remark1: "false",
                    remark2: '1',
                }
            let loginParams = {
                params: {
                    userName: this.telphone,
                    passWord: this.newPassword1,
                }
            }
            var entity1 = {
                        userName: this.telphone,
                }
                Fetch.postJson(Config.mainUrl + '/ws/checkAccount', entity1)
                .then((res) => {
                    if (res) {
                        Fetch.postJson(Config.mainUrl + '/accountRegist/insertAccount', entity)
                            .then((res) => {
                                //1表示注册成功，0表示失败
                                if (res.rcode == '1') {
                                    Fetch.postJson(Config.mainUrl + '/ws/setRoleOnGuestCompany', { id: res.userId, type: '1',orgId:'' })
                                        .then((ress) => {
                                        })
                                    Global.saveWithKeyValue('loginInformation', loginParams.params);
                                    Alert.alert(
                                        '注册成功',
                                        '恭喜你完成注册第一步！点击下一步继续完善个人信息，点击直接登录进入试用',
                                        [
                                            { text: '下一步（推荐）', onPress: () => this.next(this.telphone, this.newPassword1, res) },
                                            { text: '直接登录', onPress: () => this.directLogin(this.telphone, this.newPassword1) },
                                        ]

                                    )
                                } else {
                                    Toast.showInfo(res.Msg, 1000)
                                }
                            })
                    }
                    else if (res == false) {
                        Toast.showInfo('该用户名已注册', 1000)
                    } else {
                        Toast.showInfo('服务器异常,请稍后重试', 1000)
                    }
                    })
    
            }
        }
    handleChooseServer(){
        //隐藏用户名，用户名直接存手机号
        const telRule = /^1[0-9]{10}$/;
        //是否含有中文（也包含日文和韩文）
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        // if (reg.test(this.userName)) {
        //     Alert.alert("提示", '用户名为不能为中文,请重新输入', [{ text: '确定', onPress: () => { } }]);
        //     return;
        // }
        var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
        var patrn1 = /^(\w){6,20}$/;
        // if (this.userName == '') {
        //     Alert.alert("提示", '用户名为空,请重新输入', [{ text: '确定', onPress: () => { } }]);
        //     return;
        // }
        // if (!patrn.exec(this.userName)) {
        //     Alert.alert("提示", '请输入正确格式的用户名(5~20位字母开头、可包含数字)', [{ text: '确定', onPress: () => { } }]);
        //     return;
        // }
        if (!telRule.test(this.telphone) || this.telphone == '') {
            Alert.alert("提示", '请输入正确的手机号', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        if (this.newPassword1 == '') {
            Alert.alert("提示", '请输入密码', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        if ( !patrn1.test(this.newPassword1)) {
            Alert.alert("提示", '请输入6～20位的密码(可包含数字、字母、下划线)!', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        if (this.state.code != this.bendiCode) {
            Alert.alert("提示", '验证码不正确,请重新输入', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        if (this.state.selected == false) {
            Alert.alert("提示", '请同意工薪易协议', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else {
            this.setState({
                serverModalVisible:true
            })
        }
    }
        //企业注册
    onRightCommitBoss() {
        console.log(this.state.serverData.orgId )
        var entity = {
            userName: this.telphone,
            userPassword: this.newPassword1,
            userMobiletel1: this.telphone,
            remark1: "false",
            remark2: '0',
        }
        let loginParams = {
            params: {
                userName: this.telphone,
                passWord: this.newPassword1,
            }
        }
        var entity1 = {
            userName: this.telphone,
        }
        Fetch.postJson(Config.mainUrl + '/ws/checkAccount', entity1)
        .then((res) => {
            if (res) {
                Fetch.postJson(Config.mainUrl + '/accountRegist/insertAccount', entity)
                    .then((res) => {
                        //1表示注册成功，0表示失败
                        console.log(res)
                        if (res.rcode == '1') {
                            debugger
                            var res_userId = res.userId
                            Fetch.postJson(Config.mainUrl + '/ws/setOrg',{userId:res_userId,scopeId:this.state.serverData.orgId})
                                .then((res) => {
                                    // debugger
                                    Fetch.postJson(Config.mainUrl + '/ws/setRoleOnGuestCompany', { id: res_userId, type: '0',orgId:this.state.serverData.orgId })
                                    .then((ress) => {
                                    })
                                }) 
                            Global.saveWithKeyValue('loginInformation', loginParams.params);
                            Alert.alert(
                                '注册成功',
                                '恭喜你完成注册第一步！请去网页端继续完善企业信息，点击直接登录进入试用',
                                [
                                    { text: '直接登录', onPress: () => this.directLoginBoss(this.telphone, this.newPassword1) },
                                ]

                            )
                        } else {
                            Toast.showInfo(res.Msg, 1000)
                        }
                    })
            } else if (res == false) {
                Toast.showInfo('该用户名已注册', 1000)
            } else {
                Toast.showInfo('服务器异常,请稍后重试', 1000)
            }
            })
        }
    next(userName, passWord, res) {//跳转完善信息
            let loginParams = {
                params: {
                    userName: userName,
                    passWord: passWord,
                }
            }
            //此处加入登录接口
            commonLogin(loginParams,()=>{
                Actions.IdCard({type: 'replace', passWord: passWord, telphone: this.telphone, login: '1', userInfo: {login: '1', uuid: this.state.uuid }, userId: res.userId })
                return;
            })
        }
    directLogin(userName, passWord) {
        let loginParams = {
                params: {
                    userName: userName,
                    passWord: passWord,
                }
            }
            //此处加入登录接口
            commonLogin(loginParams,()=>{
                Actions.TabBar({type: 'replace', identity: 'student' })
                    return;
            })
        }
    directLoginBoss(userName, passWord) {
        let loginParams = {
                params: {
                    userName: userName,
                    passWord: passWord,
                }
            }
            //此处加入登录接口
            commonLogin(loginParams,()=>{
                Actions.TabBar({type: 'replace', identity: 'boss' })
                return;
            })
        }
    componentWillUnmount() {
        this._timer && clearInterval(this._timer);
    }
                    //协议
    ifAgree() {
        if (this.state.selected) {
            this.setState({ selected: !this.state.selected })
        } else {
            this.setState({ selected: !this.state.selected, modalVisible: !this.state.modalVisible })
        }
    }
    _countTime() {
        const rule = /^1[0-9]{10}$/;
        if (!rule.test(this.telphone)) {
                        Toast.showInfo('请输入正确的手机号', 1000);
                    return
        } else {
            var entity = {
                        userMobiletel1: this.telphone,
                }
                Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
                .then((res) => {
                    if (res) {
                        this.sendCode();
                    } else if (res == false) {
                        Toast.showInfo('该号码已注册', 1000)
                    } else {
                        Toast.showInfo('服务器异常,请稍后重试', 1000)
                    }
                    })
            }
    
        }
    sendCode() {
        var entity = {
            phone: this.telphone,
            title: 'REGISTER_CODE',
        }
        Fetch.postJson(Config.mainUrl + '/ws/getVerifyCode', entity)
            .then((res) => {
                        this.setState({
                            code: res
                        })
                // Alert.alert("验证码（测试用）", JSON.stringify(res), [{ text: '确定', onPress: () => { } }]);
                Toast.showInfo('发送成功', 1000)
                })
            let time = parseInt(this.state.resetMessage);
            this.setState({
                        resetAuthCode: true,
                })
        this._timer = setInterval(() => {
                    time--;
                    this.setState({resetMessage: time });
            if (this.state.resetMessage <= 0) {
                        this._timer && clearInterval(this._timer);
                    this.setState({
                        resetAuthCode: false,
                    resetMessage: 60,
                })
            }
        }, 1000);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    out_text: {
        fontSize: Config.MainFontSize+2,
        color: '#ffffff',
        fontWeight:'bold'
    },
    out_body: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgb(65,143,234)',
        width: Dimensions.get('window').width / 1.3,
        height: 52,
        marginTop: 20,
        borderRadius: 20,
        justifyContent: 'center'
    },
    out_body_grey: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'grey',
        width: Dimensions.get('window').width / 1.3,
        height: 52,
        marginTop: 20,
        borderRadius: 20,
        justifyContent: 'center'
    },
    view: {
        flex: 1,
        backgroundColor: 'rgb(22,131,251)'
    },
    actionBar: {
        height: theme.actionBar.height,
        backgroundColor: theme.actionBar.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? px2dp(20) : 0,
    },
    edit: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: Config.MainFontSize + 3,
        backgroundColor: 'transparent',
        marginLeft: 10,
    },
    edit2: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: Config.MainFontSize - 2,
        backgroundColor: 'transparent',
        marginLeft: 12,
        width: theme.screenWidth / 1.5,
        backgroundColor:'#333'
        // borderColor:"pink",
        // borderWidth:2
    },
    edit1: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: Config.MainFontSize + 3,
        backgroundColor: 'transparent',
        marginLeft: 10,
        color: 'black',
        width:theme.screenWidth/2
    },
            
            
    editView2: {
        flex: 1,
        height: px2dp(60),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        // marginTop: 20
    },
    list: {
        marginTop: px2dp(15)
    },
    editGroup: {
        margin: px2dp(0)
    }
});