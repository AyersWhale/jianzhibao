/**
 * 选择接包人
 * Created by 曾一川 on 16/07/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Alert, Modal, TextInput } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class ChoosePeople extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            checkQyStatu: '',
            reason: '',
            modalVisible: false,
            content: '',
        }
        this.getJobPublicList()
    }
    componentWillReceiveProps(nextProps) {
        this.getJobPublicList();
    }

    getJobPublicList() {
        Fetch.postJson(Config.mainUrl + "/getJobInfo/getPeopleList", this.props.rowData.ID)
            .then((res) => {
                console.log(res)
                if (res.length == 0) {
                    this.setState({
                        ifzero: true
                    })
                } else {
                    this.setState({
                        ifzero: false
                    })
                }
                this.setState({
                    result: res,
                })
            })
    }

    // gotoViewLis() {

    // }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>选取接包人</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>选取接包人</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} scrollIndicatorInsets={{ right: 1 }}>
                    {this.showList()}
                </ScrollView>
                <View>
                </View>
                {this.bohuiModal()}
            </View>
        );
    }


    showList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                <ListView
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />

            </View>)
        }

    }
    _renderItem(rowData) {
        return (
            <View>
                <View style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }} >
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', marginTop: 10 }}>{rowData.PERSON_NAME}</Text>
                            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => Actions.ChooseResumeInform({ userId: rowData.USER_ID })}>
                                <View style={{
                                    backgroundColor: 'rgb(65,143,234)',
                                    // width: 60,
                                    // height: 34,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>查看简历</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            {rowData.AGE == '' || rowData.AGE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>年龄：{rowData.AGE}</Text>
                                </View>
                            }

                        </View>
                        {rowData.EMAIL == '' || rowData.EMAIL == undefined ? null :
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>邮箱：{rowData.EMAIL}</Text>
                                </View>
                            </View>
                        }
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            {rowData.PHONE_NUMBER == '' || rowData.PHONE_NUMBER == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>电话：{rowData.PHONE_NUMBER}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15, width: deviceWidth / 2 }}>
                            {rowData.REMARK2 == '' || rowData.REMARK2 == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>发包内容：{rowData.REMARK2}</Text>
                                </View>
                            }
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 15, width: deviceWidth / 2 }}>
                            {rowData.remark1 == '' || rowData.remark1 == undefined ?
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>
                                        未注册营业执照
                                    </Text>
                                </View>
                                :
                                <TouchableOpacity style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }} onPress={() => Actions.PersonalAudit({ registType: rowData.remark1, USER_ID: rowData.USER_ID, flag: 1 })}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>
                                        营业执照{rowData.remark1 == "1" ? "(自己注册)" : "(平台注册)"} ：<Text style={{ color: 'rgb(65,143,234)' }}>点击查看</Text>
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>

                        {rowData.content == '' || rowData.content == undefined ? null :
                            <View style={{ flexDirection: 'row', paddingTop: 15, width: deviceWidth / 2 }}>
                                {rowData.STATUS == '7' ? null : <Text style={{ fontSize: Config.MainFontSize, }}>接包人拒绝终止原因：{rowData.content}</Text>}
                            </View>
                        }

                        {rowData.POSITION_STATUS == '0' && rowData.STATUS != '7' && rowData.POSITION_KIND == '0' ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 20 }} onPress={
                                this.save.bind(this, rowData)
                            }>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    width: 80,
                                    height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>同意接包</Text>
                                </View>
                            </TouchableOpacity> : null}

                        {rowData.STATUS == '0' && rowData.POSITION_KIND == '1' ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 20 }} onPress={
                                this.save.bind(this, rowData)
                            }>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>同意接包</Text>
                                </View>
                            </TouchableOpacity> : null}
                        {/* //单包终止 */}
                        {(rowData.STATUS == '5' || rowData.STATUS == '8' || this.props.rowData.POSITION_STATUS == '3' || this.props.rowData.POSITION_STATUS == '4' || this.props.rowData.POSITION_STATUS == '8') && this.props.rowData.POSITION_KIND == '0' && rowData.STATUS != '0' && rowData.STATUS != '7' && rowData.STATUS !== '3' ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 60 }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible, rowData: rowData })}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#FF4040',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>点击终止</Text>
                                </View>
                            </TouchableOpacity> : null
                        }
                        {/* //多包终止 */}
                        {(rowData.STATUS == '5' || rowData.STATUS == '8') && this.props.rowData.POSITION_KIND == '1' ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 60 }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible, rowData: rowData })}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#FF4040',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>点击终止</Text>
                                </View>
                            </TouchableOpacity> : null
                        }
                        {rowData.STATUS == '9' ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 60 }} onPress={this.bohuiend.bind(this, rowData)}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#FF4040',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>点击终止</Text>
                                </View>
                            </TouchableOpacity> : null
                        }
                        {rowData.STATUS == '0' && rowData.POSITION_STATUS != '0' && this.props.rowData.POSITION_KIND == '0' ?
                            <View style={{ position: 'absolute', right: 20, top: 60 }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#e7e7e7',
                                    width: 80,
                                    height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: 'balck'
                                    }}>待接包</Text>
                                </View>
                            </View> : null
                        }

                        {rowData.STATUS == '1' ?
                            <View style={{ position: 'absolute', right: 20, top: 60 }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#e7e7e7',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: 'black'
                                    }}>接包成功</Text>
                                </View>
                            </View> : null
                        }
                        {this.props.rowData.POSITION_KIND == '0' && (rowData.STATUS == '5' || rowData.STATUS == '7' || rowData.STATUS == '8') ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 100 }}
                                onPress={() => Actions.CheckCGW({ rowData: rowData, positionId: this.props.rowData.ID })}>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>查看成果物</Text>
                                </View>
                            </TouchableOpacity> : null
                        }
                        {this.props.rowData.POSITION_KIND == '0' && rowData.STATUS == '3' ?
                            <TouchableOpacity style={{ position: 'absolute', right: 20, top: 100 }} onPress={
                                this.payment.bind(this, rowData)
                            }>
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>支付预付款</Text>
                                </View>
                            </TouchableOpacity> : null
                        }
                        {this.props.rowData.POSITION_KIND == '0' && rowData.STATUS == '4' ?
                            <View style={{ position: 'absolute', right: 20, top: 60 }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#e7e7e7',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: 'black'
                                    }}>等待预付款确认</Text>
                                </View>
                            </View> : null
                        }
                        {rowData.STATUS == '1' ?
                            <View style={{ position: 'absolute', right: 20, top: 60 }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#e7e7e7',
                                    // width: 120,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: 'black'
                                    }}>{rowData.settleType == '0' ? "请去PC端下发合同" : '请去PC端上传合同'}</Text>
                                </View>
                            </View> : null
                        }
                        {rowData.STATUS == '2' ?
                            <View style={{ position: 'absolute', right: 20, top: 60 }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: 'rgb(65,143,234)',
                                    width: 80,
                                    height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: '#ffffff'
                                    }}>合同签订中</Text>
                                </View>
                            </View> : null
                        }
                        {rowData.STATUS == '7' && this.props.rowData.POSITION_KIND == '1' ?
                            <View style={{ position: 'absolute', right: 20, top: 60 }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    backgroundColor: '#e7e7e7',
                                    // width: 80,
                                    // height: 34,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    padding: 8
                                }}>
                                    <Text style={{
                                        fontSize: Config.MainFontSize - 2,
                                        color: 'black'
                                    }}>包终止中</Text>
                                </View>
                            </View> : null
                        }

                    </View>
                </View>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View>
        )
    }
    payment(rowData) {
        temp = {
            positionId: this.props.rowData.ID,
            getjobId: rowData.getjobId,
            type: '3',
            creatorId: this.props.rowData.CREATOR_ID,
            id: UUID.v4(),
        }
        Alert.alert("提示", "请您确认好预付款金额:" + JSON.parse(rowData.jobSalary) / 2 + '元'
            , [
                {
                    text: "我再看看", onPress: () => {
                    }
                },
                {
                    text: "继续", onPress: () => {
                        Fetch.postJson(Config.mainUrl + '/lsygSettle/lsygSettleInitiate', temp)
                            .then((res) => {
                                if (res.rcode == '1') {
                                    Toast.showInfo('支付成功', 1000);
                                    this.props.onblock()
                                    this.getJobPublicList()
                                } else {
                                    Toast.showInfo(res.Msg, 1000);
                                    this.props.onblock()
                                    this.getJobPublicList()
                                }

                            })
                    }
                }

            ])
    }
    save(rowData) {
        if (rowData.POSITION_KIND == '1') {
            if (rowData.license == '0') {
                //检查个人是否上传营业执照
                Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + rowData.USER_ID)
                    .then((res) => {
                        // this.setState({ checkStatu: res.status })
                        if (res == null || res == undefined) {
                            Alert.alert("接包失败", "对方未注册个人营业执照，已发送消息提醒接包人注册"
                                , [
                                    {
                                        text: "好的", onPress: () => {
                                            var entity = {
                                                userId: rowData.USER_ID
                                            }
                                            Fetch.postJson(Config.mainUrl + '/businessLicense/notifyTheReceiver', entity)
                                                .then((res) => {
                                                })
                                        }
                                    }
                                ])
                        } else {
                            if (res.status == '3') {//3表示已注册
                                this.tongyijiebao(rowData)
                            } else {
                                Alert.alert("接包失败", "对方未注册个人营业执照，已发送消息提醒接包人注册"
                                    , [
                                        {
                                            text: "好的", onPress: () => {
                                                var entity = {
                                                    userId: rowData.USER_ID
                                                }
                                                Fetch.postJson(Config.mainUrl + '/businessLicense/notifyTheReceiver', entity)
                                                    .then((res) => {
                                                        console.log(res)
                                                    })

                                            }
                                        }
                                    ])
                            }
                        }

                    })
            } else {
                this.tongyijiebao(rowData)
            }

        } else {
            this.tongyijiebao(rowData)
        }

    }
    tongyijiebao(rowData) {
        var temp = {
            positionId: this.props.rowData.ID,
            userId: rowData.USER_ID,
        }
        Alert.alert("提示", "请您确认好接包人"
            , [
                {
                    text: "我再看看", onPress: () => {
                    }
                },
                {
                    text: "继续", onPress: () => {
                        Fetch.postJson(Config.mainUrl + '/getJobInfo/ensurePeople', temp)
                            .then((res) => {

                                Toast.showInfo('选择成功', 1000);
                                this.props.onblock();
                                this.getJobPublicList();
                            })
                    }
                }
            ])
    }
    bohuiModal() {
        var rowData = this.state.rowData
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
                    <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>终止</Text></View>
                        <View style={underLiner.liners} />
                        <View style={{ width: deviceWidth - 80, height: 100, backgroundColor: '#E8E8E8' }}>
                            {
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入终止原因'}
                                    style={{ textAlign: 'left', marginLeft: 16, marginRight: 16, flex: 1, fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    multiline={true}
                                    maxLength={parseInt(_maxLength)}
                                    onChangeText={(text) => this.setState({ content: text })} />

                            }
                        </View>
                        <View style={{ flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60, position: 'absolute', bottom: 10 }}>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 45, marginRight: 45 }}>
                                <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.end.bind(this, rowData)}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible: false })}>
                            <VectorIcon name={"android-close"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity>
                    </View>

                </Modal>
            </View>
        )
    }
    end(rowData) {
        var temp = {
            positionId: this.props.rowData.ID,
            userId: rowData.USER_ID,
            type: rowData.POSITION_KIND,
            content: this.state.content
        }
        if (this.state.content == '') {
            Toast.showInfo('终止原因不能为空', 1000)
            return;
        }
        Alert.alert("提示", "确定要终止吗？"
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
                        Fetch.postJson(Config.mainUrl + '/getJobInfo/stopJob', temp)
                            .then((res) => {
                                Toast.dismiss();
                                if (res.rcode == '1') {
                                    this.setState({ modalVisible: false })
                                    this.getJobPublicList();
                                    this.props.onblock();
                                    Actions.pop();
                                    Toast.showInfo('终止成功', 1000);
                                } else {
                                    Toast.showInfo(res.Msg, 1000);
                                }

                            })
                    }
                }

            ])
    }
    bohuiend(rowData) {
        var temp = {
            positionId: this.props.rowData.ID,
            getJobId: rowData.getjobId,
        }
        Alert.alert("提示", "确定要终止吗？"
            , [
                {
                    text: "我再看看", onPress: () => {
                    }
                },
                {
                    text: "继续", onPress: () => {
                        Fetch.postJson(Config.mainUrl + '/getJobInfo/jobStopContract', temp)
                            .then((res) => {
                                if (res.rcode == '1') {
                                    this.setState({ modalVisible: false })
                                    this.getJobPublicList()
                                    Toast.showInfo('终止成功', 1000);
                                } else {
                                    Toast.showInfo(res.Msg, 1000);
                                }

                            })
                    }
                }

            ])
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
    container: {
        backgroundColor: 'white',
    },
});

/**
 * STATUS==9    属于未签合同之前，可以直接终止（单包，多包）
 * 只有单包有支付预付款，支付预付款阶段不可以终止
    单包：STATUS==5   可以申请终止、查看成果物
        STATUS ==8   可以申请终止、查看拒绝终止原因、查看成果物
    多包：STATUS==5   可以申请终止
        STATUS ==8   可以申请终止、查看拒绝终止原因
 *  */