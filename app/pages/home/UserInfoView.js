
import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, PixelRatio, TouchableOpacity, Dimensions, Image, TextInput, Alert, DeviceEventEmitter, Platform } from 'react-native';
import px2dp from '../../utils/px2dp';
import { UserInfo, Actions, NavigationBar, Fetch, Config, Toast, Camera, ImagePicker, FileManager, ActionSheet, VectorIcon, UUID, SafeArea } from 'c2-mobile';
import PcInterface from '../../utils/http/PcInterface';
import Global from '../../utils/GlobalStorage';
import EncryptionUtils from '../../utils/EncryptionUtils';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class UserInfoView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statu: '0',
            phone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1,
            tellphone: UserInfo.loginSet.result.rdata.loginUserInfo.userWorktel,
            // email: UserInfo.loginSet.result.rdata.loginUserInfo.userEmail,
            imageSource: UserInfo.loginSet.result.rdata.loginUserInfo.remark1,
            uploadText: '没有图片需要上传',
            status: true,
            rightTitle: "修改",
            userName: UserInfo.loginSet.result.rdata.loginUserInfo.userName,
            usernameChange: false,
            phoneChange: false,
            checkStatu: '',
            checkQyStatu: '',
            checkNum: this.props.identity == 'student' ? '1' : '',
            resetMessage: 60,
            resetAuthCode: false,
            Tximg: ''
        };
        this.checkYYZZ()
        this.checkQYZZ()
        this.checkTx()
        // this.showremark1()
    }
    componentDidMount() {
        this.subscription1 = DeviceEventEmitter.addListener('Tx', (text) => {
            this.checkTx()
        })
    }
    componentWillUnmount() {
        this.subscription1.remove();
    }
    callback(rowData) {
        // debugger
        if (rowData.userName == undefined) {
            this.setState({
                phone: rowData.phone,
            })
        } else {
            this.setState({
                userName: rowData.userName,
            })
        }

    }
    checkTx() {
        var entity = {
            // businessType: 'GR_TX',
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/checkUploadTX', entity)
            .then((res) => {
                this.setState({
                    Tximg: Config.mainUrl + "/iframefile/qybdirprocess/" + res[0].filePath
                })
                console.warn('头像返回：' + JSON.stringify(res))
            })
    }
    _countTime() {
        // const rule = /^1[0-9]{10}$/;
        // if (!rule.test(this.phone)) {
        //     Toast.showInfo('请输入正确的手机号', 1000);
        //     return
        // } else {
        var entity = {
            userMobiletel1: this.state.phone,
        }
        Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
            .then((res) => {
                if (res == true) {
                    this.sendCode();
                } else if (res == false) {
                    Toast.showInfo('该号码已注册', 1000);
                } else {
                    Toast.showInfo('服务器异常,请稍后重试', 1000)
                }
            })
        // }

    }
    sendCode() {
        var entity = {
            phone: this.state.phone,
            title: 'UPDATEPHONE_CODE'
        }
        Fetch.postJson(Config.mainUrl + '/ws/getVerifyCode', entity)
            .then((res) => {
                console.log(res)
                // Alert.alert("验证码（测试用）", JSON.stringify(res), [{ text: '确定', onPress: () => { } }]);
                Toast.showInfo('发送成功', 1000)
            })
        let time = parseInt(this.state.resetMessage);
        this.setState({
            resetAuthCode: true,
        })
        this._timer = setInterval(() => {
            time--;
            this.setState({ resetMessage: time });
            if (this.state.resetMessage <= 0) {
                this._timer && clearInterval(this._timer);
                this.setState({
                    resetAuthCode: false,
                    resetMessage: 60,
                })
            }
        }, 1000);
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    componentWillReceiveProps() {
        this.checkYYZZ()
        this.checkQYZZ()
    }
    //检查个人是否上传营业执照
    checkYYZZ() {
        if (this.props.identity == 'student') {
            Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
                .then((res) => {
                    if (res == undefined) {
                        this.setState({ checkStatu: '' })
                    } else {
                        this.setState({ checkStatu: res.status })
                    }

                })
        } else {
            var entity = {
                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
            }
            Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
                .then((res) => {
                    this.setState({
                        checkQyStatu: res.hrEmailPassword,
                        checkQyStatus: res.remark1 == '2' ? true : false
                    })
                })
        }

    }
    //检查企业是否上传营业执照
    checkQYZZ() {

    }
    _handleBack() {
        Actions.pop({ refresh: { test: true } })
    }
    xiugai() {
        this.setState({
            statu: '1',
            rightTitle: ''
        })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                {/* <NavigationBar title="个人信息" faction='center' >
                    <NavigationBar.NavBarItem onPress={this._handleBack.bind(this)} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar> */}
                {/* <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={this._handleBack.bind(this)} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>个人信息</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>个人信息</Text>
                    </View>
                </View>
                {/* <View style={{ backgroundColor: '#f5f5f5', height: 20 }} /> */}
                <ScrollView>
                    <TouchableOpacity onPress={() => {
                        Actions.ChangeTx()
                    }} style={{
                        paddingHorizontal: 20,
                        marginBottom: 1,
                        flexDirection: 'row',
                        backgroundColor: "#fff",
                        height: 77,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#f5f5f5',
                        borderBottomWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.normalsize}>头像</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {this.state.Tximg == '' ? <Image source={require('../../image/center_header_img150x150.png')} style={{ width: 60, height: 60, borderRadius: 30 }} />
                                : <Image source={{ uri: this.state.Tximg }} style={{ width: 60, height: 60, borderRadius: 30, }} />}
                            <VectorIcon name={'chevron-right'} style={{ color: '#b3b3b3', marginLeft: 5 }} />
                        </View>
                    </TouchableOpacity>
                    {/** 去掉修改用户名的功能*/}
                    <View style={{
                        paddingHorizontal: 20,
                        marginBottom: 1,
                        flexDirection: 'row',
                        backgroundColor: "#fff",
                        height: 60,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#f5f5f5',
                        borderBottomWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.normalsize}>名字</Text>
                        <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', }}>{this.state.userName}</Text>
                    </View>



                    {this.state.statu == '0' ?
                        this.props.identity == 'student' ? <View style={{
                            paddingHorizontal: 20,
                            marginBottom: 1,
                            flexDirection: 'row',
                            backgroundColor: "#fff",
                            height: 60,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: Dimensions.get('window').width,
                            borderBottomColor: '#f5f5f5',
                            borderBottomWidth: 1,
                            marginTop: 10
                        }} onPress={() => Actions.UserInfoViewChange({ phone: this.state.phone, onblock: this.callback.bind(this) })}>

                            <Text style={styles.normalsize}>手机号码</Text>
                            <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', }} >{this.state.phone}</Text>
                        </View> : <TouchableOpacity style={{
                            paddingHorizontal: 20,
                            marginBottom: 1,
                            flexDirection: 'row',
                            backgroundColor: "#fff",
                            height: 60,
                            alignItems: 'center',
                            width: Dimensions.get('window').width,
                            borderBottomColor: '#f5f5f5',
                            borderBottomWidth: 1,
                            marginTop: 10
                        }} onPress={() => Actions.UserInfoViewChange({ phone: this.state.phone, onblock: this.callback.bind(this) })}>
                                <View style={{ width: 5 }} />
                                <Text style={styles.normalsize}>手机号码</Text>
                                <Text style={{ color: '#333', position: 'absolute', right: 40 }} >{this.state.phone}</Text>
                                <VectorIcon name={'chevron-right'} style={{ position: 'absolute', right: 20, color: '#b3b3b3' }} />
                            </TouchableOpacity> :
                        <View>
                            <View style={{
                                paddingHorizontal: 20,
                                marginBottom: 1,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 60,
                                alignItems: 'center',
                                width: Dimensions.get('window').width,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }}>
                                <View style={{ width: 5 }} />
                                <Text style={styles.normalsize}>手机号码</Text>
                                <TextInput
                                    style={{ flex: 1, fontSize: Config.MainFontSize, color: '#333', textAlign: 'right' }}
                                    keyboardType='numeric'
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={false}
                                    placeholderTextColor="#c4c4c4"
                                    value={this.state.phone}
                                    onChangeText={(text) => { this.setState({ phone: text, phoneChange: true }) }}
                                />
                            </View>
                            {this.props.identity == 'student' ? null : <View style={{
                                paddingHorizontal: 20,
                                marginBottom: 1,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 60,
                                alignItems: 'center',
                                width: Dimensions.get('window').width,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }}>
                                <View style={{ width: 5 }} />
                                <Text style={styles.normalsize}>验证码</Text>
                                <TextInput
                                    style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', width: 200 }}
                                    keyboardType='numeric'
                                    underlineColorAndroid="transparent"
                                    secureTextEntry={false}
                                    placeholderTextColor="#c4c4c4"
                                    placeholder='请输入验证码'
                                    value={this.state.checkNum}
                                    maxLength={8}
                                    onChangeText={(text) => { this.setState({ checkNum: text, }) }}
                                />
                                {this.state.resetAuthCode == false ? <TouchableOpacity style={{ width: 120, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 70, marginTop: 6, borderRadius: 5 }} onPress={() => this._countTime()}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>点击获取验证码</Text></TouchableOpacity>
                                    : <TouchableOpacity disabled={true} style={{ width: 120, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 70, marginTop: 6, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                                }
                            </View>}

                        </View>
                    }
                    {this.props.identity == 'platform' ? null : this.props.identity == 'student' ?
                        <View>
                            <TouchableOpacity style={{
                                paddingHorizontal: 20,
                                marginBottom: 1,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 60,
                                alignItems: 'center',
                                width: Dimensions.get('window').width,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }}
                                onPress={() => {
                                    var entity = {
                                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                                    }
                                    Fetch.postJson(Config.mainUrl + '/basicResume/checkUserIdCard', entity)
                                        .then((res) => {
                                            if (res.rcode == 0) {//未填写身份证信息
                                                Alert.alert("提示", "请先填写身份证信息"
                                                    , [
                                                        {
                                                            text: "返回", onPress: () => {
                                                                Actions.pop()
                                                            }
                                                        }, {
                                                            text: "填写身份证信息", onPress: () => {
                                                                Actions.IdCard({ update: true, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 });
                                                            }
                                                        },
                                                    ])
                                            } else {

                                                Fetch.postJson(Config.mainUrl + '/basicResume/checkBasicResume', entity)
                                                    .then((res) => {
                                                        if (res.rcode == 0) {//未填写简历
                                                            // Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: set.result.rdata.loginUserInfo.userId, telphone: set.result.rdata.loginUserInfo.userMobiletel1, idNum: set.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                                            Alert.alert("提示", "请先完善简历"
                                                                , [
                                                                    {
                                                                        text: "返回", onPress: () => {
                                                                            Actions.pop()
                                                                        }
                                                                    }, {
                                                                        text: "完善简历", onPress: () => {
                                                                            Actions.Jianli({ userName: this.userName, passWord: this.password, login: 1, userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId, telphone: UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1, idNum: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard, uuid: UUID.v4() })
                                                                        }
                                                                    },
                                                                ])
                                                        } else {
                                                            Actions.PersonalAudit({ checkStatu: this.state.checkStatu })
                                                        }
                                                    })
                                            }
                                        })
                                }}>
                                {/* <View style={{ width: 5 }} /> */}
                                <Text style={styles.normalsize}>个人电子营业执照</Text>
                                {this.state.checkStatu == '1' ?
                                    <Text style={{ color: 'orange', position: 'absolute', right: 40 }} >审核中</Text> :
                                    this.state.checkStatu == '2' ?
                                        <Text style={{ color: 'red', position: 'absolute', right: 40 }} >审核失败</Text>
                                        : this.state.checkStatu == '3' ?
                                            <Text style={{ color: 'green', position: 'absolute', right: 40 }} >审核通过</Text>
                                            : null
                                }
                                <VectorIcon name={'chevron-right'} style={{ position: 'absolute', right: 20, color: '#b3b3b3' }} />
                            </TouchableOpacity>
                        </View> : UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' ? <View>
                            <View style={{
                                paddingHorizontal: 20,
                                marginBottom: 1,
                                flexDirection: 'row',
                                backgroundColor: "#fff",
                                height: 60,
                                alignItems: 'center',
                                width: Dimensions.get('window').width,
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1,
                                marginTop: 10
                            }}
                            // onPress={() => this.showremark1()}

                            >
                                {/* <View style={{ width: 5 }} /> */}
                                <Text style={styles.normalsize}>企业实名认证</Text>
                                {
                                    // this.state.checkQyStatu == '1' ?
                                    //     <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >草拟</Text> :
                                    //     this.state.checkQyStatu == '2' ?
                                    //         <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >审核中</Text>
                                    //         : this.state.checkQyStatu == '3' ?
                                    //             <Text style={{ color: 'green', position: 'absolute', right: 30 }} >审核通过</Text>
                                    //             : this.state.checkQyStatu == '4' ?
                                    //                 <Text style={{ color: 'red', position: 'absolute', right: 30 }} >已驳回</Text>
                                    //                 : this.state.checkQyStatu == undefined ?
                                    //                     <Text style={{ color: 'red', position: 'absolute', right: 30 }} >未开启</Text>
                                    //                     : null
                                    this.state.checkQyStatus == true ? <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >已实名认证</Text> : <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >未实名认证</Text>
                                }
                                {/* <VectorIcon name={'chevron-right'} style={{ position: 'absolute', right: 10 }} /> */}
                            </View>
                        </View> : <View>
                                <View style={{
                                    paddingHorizontal: 20,
                                    marginBottom: 1,
                                    flexDirection: 'row',
                                    backgroundColor: "#fff",
                                    height: 60,
                                    alignItems: 'center',
                                    width: Dimensions.get('window').width,
                                    borderBottomColor: '#f5f5f5',
                                    borderBottomWidth: 1,
                                    marginTop: 10
                                }}
                                // onPress={() => {
                                //     Actions.CompanyAudit({ checkStatu: this.state.checkStatu }
                                //         )
                                // }}
                                >
                                    {/* <View style={{ width: 5 }} /> */}
                                    <Text style={styles.normalsize}>企业实名认证</Text>
                                    {
                                        this.state.checkQyStatus == true ? <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >已实名认证</Text> : <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >未实名认证</Text>
                                        // this.state.checkQyStatu == '1' ?
                                        //     <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >草拟</Text> :
                                        //     this.state.checkQyStatu == '2' ?
                                        //         <Text style={{ color: 'orange', position: 'absolute', right: 30 }} >审核中</Text>
                                        //         : this.state.checkQyStatu == '3' ?
                                        //             <Text style={{ color: 'green', position: 'absolute', right: 30 }} >审核通过</Text>
                                        //             : this.state.checkQyStatu == '4' ?
                                        //                 <Text style={{ color: 'red', position: 'absolute', right: 30 }} >已驳回</Text>
                                        //                 : this.state.checkQyStatu == '0' ?
                                        //                     <Text style={{ color: 'red', position: 'absolute', right: 30 }} >未开启</Text>
                                        //                     : null
                                    }
                                    {/* <VectorIcon name={'chevron-right'} style={{ position: 'absolute', right: 10 }} /> */}
                                </View>
                            </View>}

                    <TouchableOpacity onPress={() => {
                        Actions.ChangePassword()
                    }} style={{
                        paddingHorizontal: 20,
                        marginBottom: 1,
                        flexDirection: 'row',
                        backgroundColor: "#fff",
                        height: 60,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#f5f5f5',
                        borderBottomWidth: 1,
                        marginTop: 10
                    }}>
                        <Text style={styles.normalsize}>修改密码</Text>
                        {/* <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', }}>{this.state.userName}</Text> */}
                        <VectorIcon name={'chevron-right'} style={{ color: '#b3b3b3' }} />
                    </TouchableOpacity>

                    {this.state.statu == '1' ?
                        <View>
                            <TouchableOpacity style={styles.out_button} onPress={() => {
                                this.ensure()
                            }}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: Config.C2NavigationBarTintColor,
                                    width: Dimensions.get('window').width / 1.5,
                                    height: 44,
                                    marginTop: 25,
                                    borderRadius: 30,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={styles.out_text}>保存</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.out_button} onPress={this._handleBack.bind(this)}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: Config.C2NavigationBarTintColor,
                                    width: Dimensions.get('window').width / 1.5,
                                    height: 44,
                                    marginTop: 25,
                                    borderRadius: 30,
                                    justifyContent: 'center'
                                }}>
                                    <Text style={styles.out_text}>返回</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : null}
                </ScrollView>
            </View >
        );
    }
    showremark1() {
        var entity = UserInfo.loginSet.result.rdata.loginUserInfo.userId

        Fetch.postJson(Config.mainUrl + '/businessLicense/getUserStatus', entity)
            .then((res) => {
                console.warn(res)
                if (res == false) {
                    Toast.showInfo('请去电脑端完善企业信息', 1000)
                } else {
                    Alert.alert("温馨提示", "企业信息已完善,请重新登录"
                        , [
                            {
                                text: "否", onPress: () => {

                                }
                            },
                            {
                                text: "是", onPress: () => { Actions.Login({ type: 'reset' }) }
                            }])
                }
            })
        // Toast.showInfo('请去电脑端完善企业信息', 1000)
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
                    uploadText: response.uri,
                    status: false,
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage() {
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
                this.setState({
                    imageSource: response[0].uri
                })
                this._loadInitFile();
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    _loadInitFile() {
        // if (this.state.imageSource.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: px2dp(-20) }); return }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        for (let i in this.state.imageSource) {
            var params = {
                source: this.state.imageSource[i],
                url: path,
                formData: this.state.bridgeMessage,
                header: { Authorization: 'Bearer ' },
                progress: (events) => {
                }
            }
            FileManager.uploadFile(params)
                .then((respones) => {
                    // alert('上传文件成功');
                    var refs = this.refs;
                    const { webviewbridge } = refs;
                    webviewbridge.sendToBridge(JSON.stringify(respones));
                    // Toasts.show('上传成功', { position: px2dp(-20), duration: 1000 })
                    this.setState({
                        uploadInfo: '网络地址：' + respones.url,
                    })
                }).catch((e) => {
                    // Toasts.show('上传失败', { position: px2dp(-20), duration: 1000 })
                });
        }
    }
    ensure() {
        const rule = /^1[0-9]{10}$/;
        const rule1 = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        const { phone, email } = this.state;
        var entity = {
            VerifyCode: this.state.checkNum,
            phone: this.state.phone,
        }
        if (this.state.phone == '' || this.state.phone == undefined) {
            Alert.alert('', "请输入手机号!", [{ text: '取消' },]);
            return;
        }
        if (this.state.checkNum == '' || this.state.checkNum == undefined) {
            Alert.alert('', "请输入验证码!", [{ text: '取消' },]);
            return;
        }
        Fetch.postJson(Config.mainUrl + '/ws/checkVerifyCode', entity)
            .then((result) => {
                console.log(result)
                if (result.rcode != '1' && this.props.identity == 'boss') {
                    Toast.show({
                        title: '验证码错误',
                        duration: 1000,
                    });
                }
                else {
                    // UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 = this.state.phone;
                    // UserInfo.loginSet.result.rdata.loginUserInfo.userWorktel = this.state.tellphone;
                    // UserInfo.loginSet.result.rdata.loginUserInfo.userEmail = this.state.email;
                    // UserInfo.loginSet.result.rdata.loginUserInfo.userName = this.state.userName;
                    // UserInfo.loginSet.result.rdata.loginUserInfo.remark1 = this.state.imageSource;
                    let userDto = {
                        id: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                        userName: this.state.userName,
                        userMobiletel1: this.state.phone,
                        // userWorktel: this.state.tellphone,
                        // email: this.state.email,
                        // remark1: this.state.imageSource
                    }
                    var entity1 = {
                        userName: this.state.userName,
                    }
                    var entity = {
                        userMobiletel1: this.state.phone,
                    }
                    if (this.state.usernameChange) {
                        Fetch.postJson(Config.mainUrl + '/ws/checkAccount', entity1)
                            .then((res) => {
                                if (res) {
                                    if (this.state.phoneChange) {
                                        Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
                                            .then((res) => {
                                                if (res) {
                                                    Fetch.postJson(Config.mainUrl + '/accountRegist/updateUser', userDto)
                                                        .then((res) => {
                                                            console.log(res)
                                                            if (res) {
                                                                UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 = this.state.phone;
                                                                UserInfo.loginSet.result.rdata.loginUserInfo.userName = this.state.userName;
                                                            }
                                                        })
                                                    this.setState({
                                                        statu: '0',
                                                        rightTitle: '修改'
                                                    })
                                                } else if (res == false) {
                                                    Toast.showInfo('该号码已注册', 1000)
                                                } else {
                                                    Toast.showInfo('服务器异常,请稍后重试', 1000)
                                                }
                                            })
                                    } else {
                                        Fetch.postJson(Config.mainUrl + '/accountRegist/updateUser', userDto)
                                            .then((res) => {
                                                console.log(res)
                                                if (res) {
                                                    UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 = this.state.phone;
                                                    UserInfo.loginSet.result.rdata.loginUserInfo.userName = this.state.userName;
                                                }
                                                this.setState({
                                                    statu: '0',
                                                    rightTitle: '修改'
                                                })
                                            })
                                    }
                                }
                                else if (res == false) {
                                    Toast.showInfo('该用户名已注册', 1000)
                                } else {
                                    Toast.showInfo('服务器异常,请稍后重试', 1000)
                                }
                            })
                    } else {

                        if (this.state.phoneChange) {
                            Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
                                .then((res) => {
                                    if (res) {
                                        Fetch.postJson(Config.mainUrl + '/accountRegist/updateUser', userDto)
                                            .then((res) => {
                                                console.log(res)
                                                if (res) {
                                                    UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 = this.state.phone;
                                                    UserInfo.loginSet.result.rdata.loginUserInfo.userName = this.state.userName;
                                                }
                                            })
                                        this.setState({
                                            statu: '0',
                                            rightTitle: '修改'
                                        })
                                    } else if (res == false) {
                                        Toast.showInfo('该号码已注册', 1000)
                                    } else {
                                        Toast.showInfo('服务器异常,请稍后重试', 1000)
                                    }
                                })
                        } else {
                            Fetch.postJson(Config.mainUrl + '/accountRegist/updateUser', userDto)
                                .then((res) => {
                                    console.log(res)
                                    if (res) {
                                        UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1 = this.state.phone;
                                        UserInfo.loginSet.result.rdata.loginUserInfo.userName = this.state.userName;
                                    }
                                    this.setState({
                                        statu: '0',
                                        rightTitle: '修改'
                                    })
                                })
                        }



                    }

                }
            })


    }
}


const styles = StyleSheet.create({
    list: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#e4e4e4',
        marginTop: px2dp(12)
    },
    normalsize: {
        color: "#333333",
        fontSize: Config.MainFontSize + 3,
        fontWeight: '500'
    },
    ditGroup: {
        margin: px2dp(0)
    }, subtitleView1: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }, subtitleView: {
        flexDirection: 'row',
        paddingLeft: 7,
        paddingTop: 5
    }, titleStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 80,
        width: 80,
    }
    ,
    titleStyle3: {

        fontSize: 18,
        color: '#333',

        backgroundColor: 'transparent',
        fontWeight: 'bold'
    }, titleStyle4: {
        marginTop: 2,
        fontSize: 12,
        color: '#808080',
        backgroundColor: 'transparent',
        fontWeight: 'bold'
    },
    titleStyle5: {
        marginLeft: 8,
        fontSize: 12,
        color: '#fffaf0',
        backgroundColor: '#dc143c',
        fontWeight: 'bold',
        justifyContent: 'center',
        height: 16,
        width: 40
    },
    out_text: {
        fontSize: 16,
        color: '#ffffff'
    },
});