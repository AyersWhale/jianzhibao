/**
 ** 我的工作
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, Modal, Alert, TouchableOpacity, Platform, TextInput, BackHandler } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Toast, UserInfo, Fetch, SegmentedControl } from 'c2-mobile';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class MyJob extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            result1: [],
            ifzero1: false,
            selectNum: '0',
            modalVisible: false,
            modalVisible1: false,
            content: '',
        }
        this.getMyjobList()
        this.getLSYGjobList()
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
    getMyjobList() {
        var entity = {
            YF_IDCARD: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
        }
        Fetch.postJson(Config.mainUrl + '/ws/getContractContent', entity)
            .then((res) => {
                console.log(res)
                if (res.list.length > 0) {
                    this.setState({
                        result: res.list,
                    })
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }
    getLSYGjobList() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中...'
        });
        Fetch.postJson(Config.mainUrl + '/getJobInfo/getJobList', UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard)
            .then((res) => {
                Toast.dismiss();
                // debugger
                if (res.length > 0) {
                    this.setState({
                        result1: res,
                    })
                } else {
                    this.setState({
                        ifzero1: true
                    })
                }
            })
            .catch((err) => {
                Toast.dismiss();
                Toast.showInfo('加载失败，请稍后重试', 3000)
            })
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}> */}
                {/* <View style={{ width: deviceWidth, height: 70 + SafeArea.top, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>我的工作</Text>
                    </View>
                </View> */}
                {/* </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>我的工作</Text>
                    </View>
                </View>
                <View style={{ flex: 1, width: deviceWidth }}  >
                    <SegmentedControl
                        ref={'C2SegmentedControl'}
                        itemDatas={[{ name: '兼职和抢单' }, { name: '合伙人' }]}
                        hasChanged={this._SelectPlanItem.bind(this)}
                        tintColor={'#333'}
                        textColor={'#CCC'}
                    />
                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                    <ScrollView style={{ backgroundColor: 'white', }} >
                        {
                            this.state.selectNum == '0' ? <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                                {this.showList()}
                            </View> :
                                this.state.selectNum == '1' ? <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', }}>
                                    {this.showDiffWarn()}
                                </View> :
                                    null
                        }
                        {this.bohuiModal()}
                    </ScrollView>
                </View>
            </View>
        );
    }
    _SelectPlanItem(selectNum) {
        this.setState({
            selectNum: selectNum,
        })
    }
    showList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <ListView
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />

            </View>)
        }

    }
    showDiffWarn() {
        if (this.state.ifzero1) {
            return (
                <View style={{ height: deviceHeight - 50, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <ListView
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.result1)}
                    renderRow={this._renderItem1.bind(this)}
                    enableEmptySections={true}
                />

            </View>)
        } 444

    }
    _renderItem(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.MyJobInform({ rowData: rowData })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 20, paddingBottom: 20, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', width: deviceWidth / 3 * 2, color: '#333' }}>{rowData.jobContent}</Text>
                            {rowData.basePay == undefined && rowData.salaryHour == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#333', position: 'absolute', right: 10, marginTop: 2 }}>{rowData.salaryHour == '' || rowData.salaryHour == undefined ? rowData.basePay : rowData.salaryHour}{rowData.remark1 == 'FQRZ' ? '元/小时' : rowData.salaryHour == '不限' ? '' : rowData.basePay == '不限' ? '' : rowData.salaryHour == '面议' ? '' : rowData.basePay == '面议' ? '' : '元/月'}</Text>
                            }
                        </View>
                        <View style={{ paddingTop: 10, width: deviceWidth - 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize + 1, color: '#666', marginRight: 10 }}>{rowData.jfEmployer}</Text>
                            <Text style={{ fontSize: Config.MainFontSize + 1, color: '#666', marginRight: 25 }}>{rowData.remark1 == 'FQRZ' ? '兼职' : rowData.remark1 == 'LSYG' ? '合伙人' : rowData.remark1 == 'LWPQ' ? '抢单' : '全日制'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                            {/* <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{rowData.remark1 == 'FQRZ' ? '兼职' : rowData.remark1 == 'LSYG' ? '合伙人' : rowData.remark1 == 'LWPQ' ? '抢单' : '全日制'}</Text> */}
                            {rowData.jfSignTime == '' ? null :
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#FF3333', position: 'absolute', right: 10, top: 10 }}>{(rowData.status == 'YXF' ? '已下发' : rowData.status == 'CN' ? '草拟' : rowData.status == 'YXF' ? '已下发' : rowData.status == 'YQD' ? '已签订' : rowData.status == 'YBH' ? '已驳回' : rowData.status == 'YZZ' ? '已终止' : rowData.status == 'YDQ' ? '已到期' : rowData.status == 'JDQ' ? '将到期' : rowData.status == 'YGQ' ? '已过期' : null)} </Text>}
                        </View>
                        <View style={{ paddingTop: 5 }}>
                            <Text style={{ fontSize: Config.MainFontSize + 1, color: '#999', marginRight: 10 }}>甲方签订时间:  {this.dataChange(rowData.jfSignTime)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View>
        )

    }
    _renderItem1(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.LSYGJobInform({ rowData: rowData })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', width: deviceWidth / 3 * 2, color: '#333' }}>{rowData.positionName}</Text>
                            {rowData.STATUS == undefined && rowData.STATUS == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#FF3333', position: 'absolute', right: 20 }}>{rowData.STATUS == '0' ? '申请中' : rowData.STATUS == '1' ? '接包成功' : rowData.STATUS == '2' ? '合同签订中' : rowData.STATUS == '3' ? '支付预付款中' : rowData.STATUS == '4' ? '等待预付款确认' : rowData.STATUS == '5' ? '工作中' : rowData.STATUS == '6' ? '包终止中' : rowData.STATUS == '7' ? '包终止' : rowData.STATUS == '8' ? '工作中' : rowData.STATUS == '9' ? '接包成功' : null}</Text>
                            }
                        </View>
                        <View style={{ paddingTop: 10, }}>
                            {rowData.salary == '' || rowData.salary == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey' }}>{rowData.companyName}</Text>}
                            {rowData.salary == '' || rowData.salary == undefined ? null :
                                <Text style={{ paddingTop: 10, fontSize: Config.MainFontSize - 2, color: '#666' }}>发包金额: {rowData.salary}元</Text>}
                            {rowData.getJobTime == '' || rowData.getJobTime == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginTop: 10 }}>创建时间: {this.dataChange(rowData.getJobTime)}</Text>}
                        </View>
                    </View>
                    {rowData.STATUS == '6' ? <TouchableOpacity style={{ position: 'absolute', right: 100, bottom: 10 }} onPress={this.agreeEnd.bind(this, rowData)}>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: 80,
                            height: 28,
                            marginTop: 10,
                            // borderRadius: 10,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: Config.MainFontSize,
                                color: '#ffffff'
                            }}>同意终止</Text>
                        </View>
                    </TouchableOpacity> : null}
                    {rowData.STATUS == '6' ? <TouchableOpacity style={{ position: 'absolute', right: 10, bottom: 50 }} onPress={this.checkReason.bind(this, rowData)}>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: 80,
                            height: 28,
                            marginTop: 10,
                            // borderRadius: 10,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: Config.MainFontSize,
                                color: '#ffffff'
                            }}>查看原因</Text>
                        </View>
                    </TouchableOpacity> : null}
                    {rowData.STATUS == '6' ? <TouchableOpacity style={{ position: 'absolute', right: 10, bottom: 10 }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible, rowData: rowData })}>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: 80,
                            height: 28,
                            marginTop: 10,
                            // borderRadius: 10,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: Config.MainFontSize,
                                color: '#ffffff'
                            }}>拒绝终止</Text>
                        </View>
                    </TouchableOpacity> :
                        (rowData.STATUS == '5' || rowData.STATUS == '8') && rowData.positionKind == '0' && rowData.remark4 == "0" && rowData.settleType == '0' ? <TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 10 }} onPress={() =>
                            this.CountMoney(rowData)
                        }>
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'rgb(65,143,234)',
                                width: 70,
                                height: 28,
                                marginTop: 10,
                                // borderRadius: 10,
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: Config.MainFontSize,
                                    color: '#ffffff'
                                }}>结算</Text>
                            </View>
                        </TouchableOpacity> : null}
                    {(rowData.STATUS == '5' || rowData.STATUS == '8') && rowData.positionKind == '0' ? <TouchableOpacity style={{ position: 'absolute', right: 100, bottom: 10 }} onPress={() => Actions.SubmitAchieve({ rowData: rowData, calback: this.getLSYGjobList.bind(this) })
                    }>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: 100,
                            height: 28,
                            marginTop: 10,
                            // borderRadius: 10,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                fontSize: Config.MainFontSize,
                                color: '#ffffff'
                            }}>提交成果物</Text>
                        </View>
                    </TouchableOpacity> : null}
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View>
        )

    }
    getStatus(param) {
        return new Promise((resolve, reject) => {
            Fetch.postJson(Config.mainUrl + '/lsygSettle/getStatus', param)
                .then((res) => {
                    console.log(res)
                    if (res) {//合同是否终止
                        resolve(res.isContractEnd)
                    }
                })
                .catch((err) => {
                    reject()
                    console.log(err)
                })
        })
    }
    CountMoney(rowData) {
        var temp = {
            creatorId: rowData.creatorId,
            contractId: rowData.contractId
        }
        this.getStatus().then((value) => {
            if (!value) {
                Fetch.postJson(Config.mainUrl + '/lsygSettle/getNoPayJdxjs', temp)
                    .then((res) => {
                        if (res.length > 0) {
                            Toast.showInfo('存在未完成结算的阶段性/尾款结算单，不能发起结算！', 2000);
                        } else {
                            Actions.CountMoney({ rowData: rowData })
                        }
                    })
            } else {
                Alert.alert("温馨提示", '该合同已结束，不能发起结算！'
                    , [
                        {
                            text: "确定", onPress: () => {

                            }
                        }
                    ])
                this.getLSYGjobList()
            }
        })
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
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>拒绝终止</Text></View>
                        <View style={underLiner.liners} />
                        <View style={{ width: deviceWidth - 80, height: 100, backgroundColor: '#E8E8E8' }}>
                            {
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入拒绝终止原因'}
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
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={this.refuseEnd.bind(this, rowData)}>
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
    refuseEnd(rowData) {
        temp = {
            positionId: rowData.positionId,
            userId: rowData.userId,
            content: this.state.content
        }
        if (this.state.content == '' || this.state.content == undefined) {
            Toast.dismiss();
            Toast.showInfo('请填写拒绝终止原因', 1000);
            return
        }
        Fetch.postJson(Config.mainUrl + '/getJobInfo/refuseStopJob', temp)
            .then((res) => {
                if (res.rcode == '1') {
                    this.getLSYGjobList()
                    this.setState({ modalVisible: false })
                    Toast.showInfo('提交成功', 1000);
                }
                else {
                    Toast.showInfo(res.Msg, 1000);
                }
            })
    }
    agreeEnd(rowData) {
        temp = {
            positionId: rowData.positionId,
            getJobId: rowData.getJobInfoId,
            userId: rowData.userId,
        }
        Fetch.postJson(Config.mainUrl + '/getJobInfo/jobStopOther', temp)
            .then((res) => {
                if (res.rcode == '1') {
                    this.getLSYGjobList()
                    Toast.showInfo('提交成功', 1000);
                } else {
                    Toast.showInfo(res.Msg, 1000);
                }

            })
    }
    checkReason(rowData) {
        temp = {
            positionId: rowData.positionId,
            userId: rowData.userId,
            title: '1'
        }
        Fetch.postJson(Config.mainUrl + '/temporaryLog/viewLog', temp)
            .then((res) => {
                Alert.alert("终止原因", res.content
                    , [
                        {
                            text: "确定", onPress: () => {

                            }
                        }
                    ])
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
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
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

});
