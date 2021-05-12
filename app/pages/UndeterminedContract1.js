/**
 * 待签合同详情
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, PixelRatio, StyleSheet, ScrollView, TextInput, Alert, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Modal, Linking, DeviceEventEmitter } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, Fetch, UserInfo, Toast } from 'c2-mobile';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';
import TimeChange from '../utils/TimeChange';
import Toasts from 'react-native-root-toast';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class UndeterminedContract1 extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.telphone = UserInfo.loginSet.result.rdata.loginUserInfo.userMobiletel1;
        this.bendiCode = '';
        this._timer = null;
        this.state = {
            resetAuthCode: false,
            jiafang: true,
            resetMessage: 60,
            yifang: false,
            modalVisible: false,
            contract: true,
            rejectReason: '',
            pdfUrl: '',
            code: '',
            contractText: [],
            dataBlob: '',
            dataBlob1: '',
            read: false,
            modalVisible_yzm: false,
            checkStatu: '',
        }
        this.getContract()
    }
    //检查个人是否上传营业执照
    componentDidMount() {
        this.checkYYZZ()
    }
    checkYYZZ() {
        Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                // debugger
                if (res.status == undefined) {
                    this.setState({ checkStatu: '' })
                } else {//status   1-审核中、2-审核失败、3-审核通过
                    this.setState({ checkStatu: res.status })
                }

            })
    }
    getContract() {
        Fetch.postJson(Config.mainUrl + '/ws/contractApp?id=' + this.props.rowData.id + '&workType=' + this.props.rowData.REMARK1)
            .then((res) => {
                //debugger
                console.log(res),
                    this.setState({
                        dataBlob: res.result[0],
                        dataBlob1: res.result[1],
                        contractText: res.result
                    })
            })
    }
    reject() {
        // Alert.alert('确定要提交吗？', '', [{ text: '取消' }, { text: '确定', onPress: this.reject.bind(this) }])
        if (this.state.rejectReason == '') {
            Toast.showInfo('请输入驳回原因', 2000)
        } else {
            Alert.alert("温馨提示", "确定要提交吗？"
                , [
                    {
                        text: "取消", onPress: () => { }
                    },
                    {
                        text: "是", onPress: () => {
                            Toast.show({
                                type: Toast.mode.C2MobileToastLoading,
                                title: '提交中...'
                            });
                            var entity = {
                                id: this.props.rowData.id,
                                rejectReason: this.state.rejectReason,
                                workType: this.props.rowData.REMARK1
                            }
                            Fetch.postJson(Config.mainUrl + '/fqrzContract/contractReject', entity)
                                .then((res) => {
                                    Toast.dismiss();
                                    // console.log(res)
                                    console.log(res)
                                    this.setState({
                                        modalVisible: false
                                    })

                                    Actions.pop({ refresh: { test: UUID.v4() } })
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                        }
                    }])
        }
    }
    componentWillReceiveProps(nextProps) {
        Actions.pop({ refresh: { test: UUID.v4() } })
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    back() {
        DeviceEventEmitter.emit('yiqian');
        Actions.pop({ refresh: { test: UUID.v4() } })
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1, position: "relative" }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => this.back()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>待签合同</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>待签合同</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: 'white' }} >
                    <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, width: deviceWidth - 10 }}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', marginTop: 10 }}>{this.props.rowData.REMARK1 == 'FQRZ' ? '兼职' : this.props.rowData.REMARK1 == 'LSYG' ? '合伙人' : this.props.rowData.REMARK1 == 'LWPQ' ? '抢单' : this.props.rowData.REMARK1 == 'CHYW' ? '撮合' : '全日制'}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text>编号:</Text>
                            <Text>{this.state.dataBlob.contractNo}</Text>
                        </View>
                        {this.props.rowData.REMARK1 == 'LSYG' || this.props.rowData.REMARK1 == 'CHYW' ?
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: 100, height: 110, borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, alignContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 10 }} onPress={() => this.setState({ jiafang: !this.state.jiafang })}>
                                    <Image source={require('../image/jiafang.png')} style={{ width: 80, height: 80 }}></Image>
                                    <Text style={{ marginTop: 5 }}>甲方信息</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: 100, height: 110, borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, alignContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 10 }} onPress={() => this.setState({ yifang: !this.state.yifang })}>
                                    <Image source={require('../image/jiafang.png')} style={{ width: 80, height: 80 }}></Image>
                                    <Text style={{ marginTop: 5 }}>乙方信息</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{ width: 100, height: 110, borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, alignContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 10 }} onPress={() => this.setState({ bingfang: !this.state.bingfang })}>
                                    <Image source={require('../image/jiafang.png')} style={{ width: 80, height: 80 }}></Image>
                                    <Text style={{ marginTop: 5 }}>丙方信息</Text>
                                </TouchableOpacity>
                            </View>
                            : <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ width: 100, height: 110, borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, alignContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 10, marginRight: 40 }} onPress={() => this.setState({ jiafang: !this.state.jiafang })}>
                                    <Image source={require('../image/jiafang.png')} style={{ width: 80, height: 80 }}></Image>
                                    <Text style={{ marginTop: 5 }}>甲方信息</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: 100, height: 110, borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, alignContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 10, marginLeft: 40 }} onPress={() => this.setState({ yifang: !this.state.yifang })}>
                                    <Image source={require('../image/jiafang.png')} style={{ width: 80, height: 80 }}></Image>
                                    <Text style={{ marginTop: 5 }}>乙方信息</Text>
                                </TouchableOpacity>
                            </View>}
                        {this.state.jiafang == true && (this.props.rowData.REMARK1 == 'LSYG' || this.props.rowData.REMARK1 == 'CHYW') ? <View>
                            <View style={{ width: deviceWidth - 40, alignSelf: 'center', borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20 }}>
                                <View style={{ marginTop: 10, marginLeft: 20, width: deviceWidth }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"building"} size={22} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ color: 'rgb(65,143,234)', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 2, marginLeft: 10 }}>甲方信息</Text>
                                    </View>
                                    <Text style={{ marginTop: 10, width: (Platform.OS == 'ios') ? deviceWidth - 60 : deviceWidth - 90 }}>甲方（企业）：{this.state.dataBlob.jfName}</Text>
                                    <Text style={{ marginTop: 10, width: (Platform.OS == 'ios') ? deviceWidth - 60 : deviceWidth - 90 }}>统一社会信用代码：{this.state.dataBlob.jfCode}</Text>
                                    <Text style={{ marginTop: 10 }}>联系电话（手机）：{this.state.dataBlob1.jfContactPhone}</Text>
                                    <Text style={{ marginTop: 10, width: deviceWidth - 60 }}>住所：{this.state.dataBlob1.jfAddress}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ jiafang: false })}>
                                <VectorIcon name={"double_angle_up"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>

                        </View> : null}

                        {this.state.yifang == true && (this.props.rowData.REMARK1 == 'LSYG' || this.props.rowData.REMARK1 == 'CHYW') ? <View style={{ marginTop: 20 }}>
                            <View style={{ width: deviceWidth - 40, alignSelf: 'center', borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, flexDirection: 'row' }}>
                                {/* <View>
                                    <Image source={require('../image/yifang1.png')} style={{ width: 100, height: 200 }}></Image>
                                </View> */}
                                <View style={{ marginTop: 10, marginLeft: 20, width: deviceWidth / 1.5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"user"} size={22} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ color: 'rgb(65,143,234)', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 2, marginLeft: 10 }}>乙方信息</Text>
                                    </View>
                                    <Text style={{ marginTop: 10 }}>乙方（劳动者）：{this.state.dataBlob.yfName}</Text>
                                    <Text style={{ marginTop: 10 }}>居民身份证号码：{this.state.dataBlob.yfCode}</Text>
                                    <Text style={{ marginTop: 10 }}>联系电话（手机）：{this.state.dataBlob1.yfPhone}</Text>
                                    <Text style={{ marginTop: 10, width: deviceWidth - 60 }}>住所：{this.state.dataBlob1.yfAddress}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ yifang: false })}>
                                <VectorIcon name={"double_angle_up"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>
                        </View> : null}
                        {this.state.jiafang == true && this.props.rowData.REMARK1 != 'LSYG' && this.props.rowData.REMARK1 != 'CHYW' ? <View>
                            <View style={{ width: deviceWidth - 40, alignSelf: 'center', borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20 }}>
                                <View style={{ marginTop: 10, marginLeft: 20, width: deviceWidth }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"building"} size={22} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ color: 'rgb(65,143,234)', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 2, marginLeft: 10 }}>甲方信息</Text>
                                    </View>
                                    <Text style={{ marginTop: 10, width: (Platform.OS == 'ios') ? deviceWidth - 60 : deviceWidth - 90 }}>甲方（企业）：{this.state.dataBlob.jfEmployer}</Text>
                                    <Text style={{ marginTop: 10, width: (Platform.OS == 'ios') ? deviceWidth - 60 : deviceWidth - 90 }}>住所：{(this.state.dataBlob.jfAbode == undefined) ? this.state.dataBlob.jfAddress : this.state.dataBlob.jfAbode}</Text>
                                    <Text style={{ marginTop: 10 }}>负责人：{this.state.dataBlob.jfPrincipal}</Text>
                                    <Text style={{ marginTop: 10 }}>签订时间：{(this.state.dataBlob.jfSignTime == undefined) ? '' : TimeChange.timeChangeDate(this.state.dataBlob.jfSignTime)}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ jiafang: false })}>
                                <VectorIcon name={"double_angle_up"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>

                        </View> : null}

                        {this.state.yifang == true && this.props.rowData.REMARK1 != 'LSYG' && this.props.rowData.REMARK1 != 'CHYW' ? <View style={{ marginTop: 20 }}>
                            <View style={{ width: deviceWidth - 40, alignSelf: 'center', borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, flexDirection: 'row' }}>
                                {/* <View>
                                    <Image source={require('../image/yifang1.png')} style={{ width: 100, height: 200 }}></Image>
                                </View> */}
                                <View style={{ marginTop: 10, marginLeft: 20, width: deviceWidth / 1.5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"user"} size={22} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ color: 'rgb(65,143,234)', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 2, marginLeft: 10 }}>乙方信息</Text>
                                    </View>
                                    <Text style={{ marginTop: 10 }}>乙方（劳动者）：{this.state.dataBlob.yfEmployee}</Text>
                                    {(this.state.dataBlob.yfSex == undefined) ? null : <Text style={{ marginTop: 5 }}>性别：{this.state.dataBlob.yfSex == 'MALE' ? '男' : '女'}</Text>}
                                    {/* <Text style={{ marginTop: 5 }}>户籍所在地：{this.state.dataBlob.yfAddress}</Text> */}
                                    <Text style={{ marginTop: 10 }}>居民身份证号码：{this.state.dataBlob.yfIdcard}</Text>
                                    <Text style={{ marginTop: 10 }}>联系电话（手机）：{this.state.dataBlob.yfPhone}</Text>
                                    <Text style={{ marginTop: 10, width: deviceWidth - 60 }}>住所：{(this.state.dataBlob.yfAddress == undefined) ? this.state.dataBlob.yfAbode : this.state.dataBlob.yfAddress}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ yifang: false })}>
                                <VectorIcon name={"double_angle_up"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>
                        </View> : null}

                        {this.state.bingfang == true && (this.props.rowData.REMARK1 == 'LSYG' || this.props.rowData.REMARK1 == 'CHYW') ? <View style={{ marginTop: 20 }}>
                            <View style={{ width: deviceWidth - 40, alignSelf: 'center', borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20, flexDirection: 'row' }}>
                                {/* <View>
                                    <Image source={require('../image/yifang1.png')} style={{ width: 100, height: 200 }}></Image>
                                </View> */}
                                <View style={{ marginTop: 10, marginLeft: 20, width: deviceWidth / 1.5 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <VectorIcon name={"user"} size={22} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                        <Text style={{ color: 'rgb(65,143,234)', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 2, marginLeft: 10 }}>丙方信息</Text>
                                    </View>
                                    <Text style={{ marginTop: 10 }}>丙方（服务商)：{this.state.dataBlob1.bfCompanyName}</Text>
                                    <Text style={{ marginTop: 5 }}>法定代表人：{this.state.dataBlob1.bfName}</Text>
                                    <Text style={{ marginTop: 10 }}>联系人：{this.state.dataBlob1.bfContactPerson}</Text>
                                    <Text style={{ marginTop: 10 }}>联系电话（手机）：{this.state.dataBlob1.bfContactPhone}</Text>
                                    <Text style={{ marginTop: 10, width: deviceWidth - 60 }}>住所：{this.state.dataBlob1.bfAddress}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ bingfang: false })}>
                                <VectorIcon name={"double_angle_up"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>
                        </View> : null}

                        <ScrollView style={{ marginTop: 20, width: deviceWidth - 20, borderWidth: 2, borderColor: '#E8E8E8', borderRadius: 20 }}>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ contract: !this.state.contract })}>
                                <VectorIcon name={this.state.contract == true ? "double_angle_down" : "double_angle_up"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>

                            <ListView
                                style={{ padding: 10, height: this.state.contract == true ? null : deviceHeight / 3, marginTop: 30 }}
                                dataSource={this.ds.cloneWithRows(this.state.contractText)}
                                renderRow={this.text.bind(this)}
                                enableEmptySections={true}
                            />
                        </ScrollView>
                        <TouchableOpacity onPress={() => this.setState({ read: !this.state.read })} style={{ alignItems: 'flex-start', backgroundColor: 'transparent', flexDirection: 'row', marginLeft: 10, marginTop: 10 }} >
                            <Text style={{ color: 'grey', fontSize: Config.MainFontSize - 2 }}>您已经阅读并同意</Text><View ><Text style={{ color: 'rgb(65,143,234)', fontSize: Config.MainFontSize - 2 }}>{this.props.rowData.REMARK1 == 'LSYG' ? '项目外包服务合同' : '劳动合同'}</Text></View>
                            <VectorIcon onPress={this.ifAgree.bind(this)} name={this.state.read == true ? 'android-checkbox' : 'android-checkbox-outline-blank'} style={{ color: 'grey', textAlign: 'center', fontSize: Config.MainFontSize }} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', width: deviceWidth, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 90 }}>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 2.5, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>驳回</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                {this.state.read == true ?
                                    <TouchableOpacity style={{ backgroundColor: (this.state.modalVisible_yzm) ? 'grey' : 'rgb(32,124,241)', width: deviceWidth / 2.5, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.qianding.bind(this)}>
                                        <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>签订</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 2.5, height: 40, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => Alert.alert('请确认已阅读' + this.props.rowData.REMARK1 == 'LSYG' ? '项目外包服务合同' : '劳动合同', '', [{ text: '确定' }])}>
                                        <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>签订</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                        {this.bohuiModal()}
                    </View>
                </ScrollView>
                {this.state.modalVisible_yzm ? this.renderCode() : null}
            </View >
        );
    }

    qianding() {
        // var entity = {
        //     id: this.props.rowData.id,
        //     workType: this.props.rowData.workType,
        // }
        // debugger
        //发包金额大于10万
        // if (parseFloat(this.props.rowData.money) >= 100000 && this.state.checkStatu !== '3') {
        //     Alert.alert("温馨提示", "合同金额达到10万元需注册营业执照"
        //         , [
        //             {
        //                 text: "再看看", onPress: () => {
        //                 }
        //             }, {
        //                 text: "去注册", onPress: () => {
        //                     Actions.PersonalAudit()
        //                 }
        //             },
        //         ])
        // }
        // else {
        let entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        //验证这个人是否有填写银行信息
        Fetch.getJson(Config.mainUrl + '/personnelBank/checkdefaultBank', entity)
            .then((res) => {
                if (res.rcode == '1') {
                    var entityrz = {
                        userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
                    }
                    Fetch.postJson(Config.mainUrl + '/accountRegist/getValidResult', entityrz)
                        .then((ress) => {
                            console.log(ress)
                            if (ress.rcode == '2') {
                                Alert.alert("温馨提示", "您还未进行实名认证，请点击认证"
                                    , [
                                        {
                                            text: "取消", onPress: () => { }
                                        },
                                        {
                                            text: "去认证", onPress: () => {
                                                if (Platform.OS == 'ios') {
                                                    Actions.C2WebView({ url: ress.url })
                                                } else {
                                                    Linking.canOpenURL(ress.url).then(supported => {
                                                        if (!supported) {
                                                            console.warn('Can\'t handle url: ' + ress.url);
                                                        } else {
                                                            return Linking.openURL(ress.url);
                                                        }
                                                    }).catch(err => console.error('An error occurred', ress.url));
                                                }
                                            }
                                        }])
                            } else {
                                var entitys = {
                                    id: this.props.rowData.id,
                                    workType: this.props.rowData.REMARK1,
                                    personId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                                }
                                Fetch.postJson(Config.mainUrl + '/Contract/contractQd?map=' + JSON.stringify(entitys))
                                    .then((res) => {
                                        if (res.result == 'success') {
                                            DeviceEventEmitter.emit('yiqian');
                                            var entity = {
                                                contractId: this.state.dataBlob.contractNo,
                                                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                                                doc_title: this.props.rowData.jobContent
                                            }
                                            Fetch.postJson(Config.mainUrl + '/Contract/extsignContract?params=' + JSON.stringify(entity))
                                                .then((ret) => {
                                                    if (ret.url) {
                                                        Actions.C2WebView({ url: ret.url, types: 'FDD', rowData: this.props.rowData })
                                                    } else {
                                                        Toast.showInfo(ret.msg, 2000)
                                                    }
                                                })
                                        } else {
                                            Toast.showInfo(res.msg, 2000)
                                        }
                                    })
                                // Actions.C2WebView({ url: ret.url })
                                // id: this.props.rowData.id, workType: this.props.rowData.REMARK1, personId: UserInfo.loginSet.result.rdata.loginUserInfo.userId 
                                // this.setState({
                                //     modalVisible_yzm: true
                                // })
                            }
                        })
                } else {
                    Alert.alert("温馨提示", "需添加银行卡信息才能签订合同"
                        , [
                            {
                                text: "取消", onPress: () => { }
                            },
                            {
                                text: "去添加", onPress: () => { Actions.AccountMge() }
                            }])
                }
            }).catch(() => {
                Toast.showInfo('签订失败，请稍后重试', 2000)
            })
        // }
        // Actions.Qianming({ id: this.props.rowData.id, workType: this.props.rowData.REMARK1 })
    }

    ifAgree() {
        this.setState({ read: !this.state.read })
    }

    text(rowData) {
        let remark = null
        if (rowData.term == undefined) { return null } else {
            if (rowData.term.substr(0, 1) == '八') {
                if (this.state.dataBlob.remark !== undefined) {
                    remark = (this.state.dataBlob.remark.replace(new RegExp("#&nbsp;&nbsp;", "gm"), "\n")).replace(new RegExp("&nbsp;&nbsp;", "gm"), "  ")
                }
                console.log(remark)
            }
            if (this.state.modalVisible_yzm) {
                return (
                    <View style={{ padding: 5 }}>
                        <Text style={{ color: 'grey' }}>{(rowData.term.replace(new RegExp("#&nbsp;&nbsp;", "gm"), "\n")).replace(new RegExp("&nbsp;&nbsp;", "gm"), "  ")}</Text>
                        <Text style={{ color: 'grey' }}>{remark}</Text>
                    </View>
                )
            } else {
                return (
                    <View style={{ padding: 5 }}>
                        <Text>{(rowData.term.replace(new RegExp("#&nbsp;&nbsp;", "gm"), "\n")).replace(new RegExp("&nbsp;&nbsp;", "gm"), "  ")}</Text>
                        <Text>{remark}</Text>
                    </View>
                )
            }

        }
    }
    _countTime() {
        const rule = /^1[0-9]{10}$/;
        if (!rule.test(this.telphone)) {
            Toast.showInfo('请输入正确的手机号', 1000);
            return
        } else {
            this.sendCode();
            //     var entity = {
            //         userMobiletel1: this.telphone,
            //     }
            //     Fetch.postJson(Config.mainUrl + '/ws/checkPhone', entity)
            //         .then((res) => {
            //             if (res) {
            //                 this.sendCode();
            //             } else if (res == false) {
            //                 Toast.showInfo('该号码已注册', 1000)
            //             } else {
            //                 Toast.showInfo('服务器异常,请稍后重试', 1000)
            //             }
            //         })
        }

    }
    sendCode() {
        var entity = {
            phone: this.telphone,
            title: 'GENERAL_CODE',
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
    renderCode() {
        return (
            <View style={{ position: "absolute", height: deviceHeight, width: deviceWidth, top: SafeArea.top + 70, alignItems: "center" }}>
                <TouchableOpacity style={{ flex: 1, position: "absolute", height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ modalVisible_yzm: false })}>
                </TouchableOpacity>
                <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 5 - 30, height: (Platform.OS == 'ios') ? deviceHeight / 3 : 280, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white' }}>
                    <View style={{ height: 30, marginTop: 10, marginLeft: 20 }}>
                        <Text style={{ color: 'black', fontSize: Config.MainFontSize + 2, textAlign: "left" }}>请先短信验证</Text></View>
                    <View style={underLiner.liners} />
                    <View style={{ width: deviceWidth - 80, height: (Platform.OS == 'ios') ? 50 : 150, marginTop: 10, alignSelf: "center" }}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#E8E8E8' }}>
                            <VectorIcon
                                name="mobile_phone"
                                size={36}   //图片大小
                                color='black'  //图片颜色
                                style={{ alignSelf: 'center', width: px2dp(30), height: px2dp(30), backgroundColor: 'transparent', marginLeft: 30 }}
                            />
                            <View style={styles.editView2}>
                                <TextInput
                                    style={styles.edit}
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    value={this.telphone}
                                    placeholder="手机号"
                                    editable={(this.telphone == undefined) ? true : false}
                                    placeholderTextColor='#c4c4c4'
                                    onChangeText={(text) => { this.telphone = text }}
                                />
                            </View>
                        </View>
                        <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#c4c4c4', width: theme.screenWidth - 80, alignSelf: 'center' }} />
                        <View style={{ flexDirection: 'row', backgroundColor: '#E8E8E8' }}>
                            <VectorIcon
                                name="c2_im_weixin_keyboard"
                                size={32}   //图片大小
                                color='black'  //图片颜色
                                style={{ alignSelf: 'center', marginLeft: 24, marginTop: 3 }}
                            />
                            <View style={styles.editView2}>
                                <TextInput
                                    style={styles.edit1}
                                    underlineColorAndroid="transparent"
                                    keyboardType='numeric'
                                    placeholder={(Platform.OS == 'ios') ? "验证码" : "验证码"}
                                    placeholderTextColor='#c4c4c4'
                                    onChangeText={(text) => { this.bendiCode = text }}
                                />
                            </View>
                            {this.state.resetAuthCode == false ? <TouchableOpacity style={{ width: 100, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 40, marginTop: 14, borderRadius: 5 }} onPress={() => this._countTime()}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>获取验证码</Text></TouchableOpacity>
                                : <TouchableOpacity disabled={true} style={{ width: 100, height: 34, backgroundColor: 'rgb(65,143,234)', alignSelf: 'center', marginLeft: 40, marginTop: 14, borderRadius: 5 }}><Text style={{ alignSelf: 'center', padding: 8, borderRadius: 5, alignContent: 'center', color: 'white' }}>重新发送{this.state.resetMessage}</Text></TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ marginTop: (Platform.OS == 'ios') ? 120 : 0, flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60 }}>
                        <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 45, marginRight: 45 }}>
                            <TouchableOpacity style={{ backgroundColor: 'grey', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible_yzm: !this.state.modalVisible_yzm })}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: (Platform.OS == 'ios') ? 7 : 5 }}>取消</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                            <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.makesure.bind(this)}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: (Platform.OS == 'ios') ? 7 : 5 }}>提交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible_yzm: false })}>
                        <VectorIcon name={"android-close"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>驳回合同</Text></View>
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
                                <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
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
    makesure() {
        if (this.telphone == '') {
            Alert.alert("提示", '手机号码为空,请重新输入', [{ text: '确定', onPress: () => { } }]);
            return;
        } else if (this.state.code != this.bendiCode) {
            Alert.alert("提示", '验证码不对,请重新输入', [{ text: '确定', onPress: () => { } }]);
            return;
        } else if (this.state.code == '') {
            Alert.alert("提示", '请输入验证码', [{ text: '确定', onPress: () => { } }]);
            return;
        }
        else {
            this.setState({
                modalVisible_yzm: false
            })
            Toast.showInfo('验证成功', 1000);
            Actions.Qianming({ id: this.props.rowData.id, workType: this.props.rowData.REMARK1, personId: UserInfo.loginSet.result.rdata.loginUserInfo.userId })
        }

        //Actions.Qianming({ id: this.props.rowData.id, workType: this.props.rowData.REMARK1 })
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    edit1: {
        flex: 1,
        height: 20,
        width: 250,
        textAlign: 'left',
        fontSize: Config.MainFontSize - 2,
        backgroundColor: 'transparent',
        marginLeft: 24
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
    imgstyle: {
        height: theme.screenHeight / 3.5,
        width: theme.screenWidth,
    },
    edit: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: Config.MainFontSize - 2,
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
        width: theme.screenWidth / 1.5
    },


    editView2: {
        flex: 1,
        height: px2dp(48),
        backgroundColor: 'transparent',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        marginTop: 20

    },
});