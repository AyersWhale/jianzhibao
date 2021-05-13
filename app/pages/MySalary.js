/**
 * 我的收入
 * Created by 曾一川 on 29/1/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler, Modal, TextInput, Alert } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import Toasts from 'react-native-root-toast';
import underLiner from '../utils/underLiner';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const emailRule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

export default class MySalary extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            modalVisible: false,
            email: '',
            cuurRowData: {}
        }
        this.getMySalary()
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
    getMySalary() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中...'
        });
        var entity = {
            idCard: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
        }
        Fetch.postJson(Config.mainUrl + '/settleManagement/getSalaryBills', entity)
            .then((res) => {
                Toast.dismiss();
                console.log(res)
                if (res.length > 0) {
                    this.setState({
                        result: res
                    })
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
            .catch((err) => {
                Toast.showInfo('加载失败，请稍后重试', 3000)
                Toast.dismiss();
            })
    }
    submitDutypaid() {
        let param = {
            settltno: this.state.cuurRowData.id,
            email: this.state.email
        }
        if (this.state.email !== '' && emailRule.test(this.state.email) == false) {
            Toasts.show('请输入正确的邮箱', { position: -80 });
            return;
        }
        Fetch.postJson(Config.mainUrl + '/Invoice_listTransfer', param)
            .then((res) => {
                // debugger
                this.setState({
                    modalVisible: false
                })
                if (res.settltno) {
                    Toasts.show('申请发送成功', { position: -80 });
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({
                    modalVisible: false
                })
                Toasts.show('发送失败，请稍后重试', { position: -80 });
            })
    }
    checkDutypaid(rowData) {
        console.log(rowData)
        Fetch.postJson(Config.mainUrl + '/basicResume/viewBasicResume', UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                this.setState({
                    email: res[0].email || '',
                    cuurRowData: rowData
                }, () => {
                    this.setState({
                        modalVisible: true
                    })
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    renderDutyModal() {
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
                    <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 15 }}>
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>输入邮箱</Text></View>
                        <View style={underLiner.liners} />
                        <View style={{ width: deviceWidth - 80, height: 100, backgroundColor: '#E8E8E8' }}>
                            {
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    placeholder={this.state.email}
                                    style={{ textAlign: 'left', marginLeft: 16, marginRight: 16, flex: 1, fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    multiline={true}
                                    maxLength={parseInt(_maxLength)}
                                    onChangeText={(text) => this.setState({ email: text })} />

                            }
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', height: 60, justifyContent: "space-around" }}>
                            <TouchableOpacity style={{ display: 'flex', backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ modalVisible: false })}>
                                <Text style={{ color: 'white' }}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ display: 'flex', backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => Alert.alert('确定要提交吗？', '', [{ text: '取消' }, { text: '确定', onPress: this.submitDutypaid.bind(this) }])}>
                                <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>提交</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible: false })}>
                            <VectorIcon name={"android-close"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
        )
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>我的收入</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>我的收入</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} >
                    {this.showList()}
                </ScrollView>
                {this.renderDutyModal()}
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

    showsettleType(cellvalue, type) {
        if (cellvalue == "1") {
            return "月中结算";
        } else if (cellvalue == "2") {
            return "月底结算";
        } else if (cellvalue == "3") {
            return "预付款结算";
        } else if (cellvalue == "4") {
            return "阶段结算款";
        } else if (cellvalue == "5") {
            return "尾款结算";
        } else if (cellvalue == "6") {
            if (type == "1") {
                return "费用代发-保费代收";
            } else {
                return "费用代发";
            }
        } else if (cellvalue == "8") {
            return "线下结算";
        } else if (cellvalue == "9") {
            return "服务费";
        } else if (cellvalue == "0") {
            return "保险费";
        } else {
            return "--";
        }
    }
    _renderItem(rowData) {
        var bankAccount = ''
        if (rowData.bankAccount == undefined || rowData.bankAccount == '') {
            bankAccount = ''
        } else {
            var len = rowData.bankAccount.length
            bankAccount = rowData.bankAccount.substring(0, 4) + '  **** ****  ' + rowData.bankAccount.substring(len - 4, len)
        }
        return (
            <View>
                <View style={{ backgroundColor: 'white', width: deviceWidth }}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 20, paddingTop: 20, paddingBottom: 20 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', width: deviceWidth / 1.5, fontFamily: 'PingFang SC' }}>{rowData.positionName} | {rowData.companyName}</Text>
                            <Text style={{ fontSize: Config.MainFontSize + 1, color: '#FF3333', position: 'absolute', right: 20, top: 2, fontFamily: 'PingFang SC' }}>{this.showsettleType(rowData.settleType, rowData.type)}</Text>
                            <Text style={{ fontSize: Config.MainFontSize + 1, color: '#666', marginTop: 10, fontFamily: 'PingFang SC' }}>银行账号:{bankAccount}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <Text style={{ fontSize: Config.MainFontSize + 1, color: '#666', fontFamily: 'PingFang SC' }}>应发费用: {rowData.grossPay == undefined ? 0 : rowData.grossPay}</Text>
                            <Text style={{ fontSize: Config.MainFontSize + 1, marginLeft: 10, color: '#666', fontFamily: 'PingFang SC' }}>实发费用: {rowData.summery == undefined ? 0 : rowData.summery}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#AAA', fontFamily: 'PingFang SC' }}>扣除费用:{rowData.deductCose == undefined ? 0 : rowData.deductCose}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#AAA', marginLeft: 10, fontFamily: 'PingFang SC' }}>个税专项扣除:{rowData.deductibleFee == undefined ? 0 : rowData.deductibleFee}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#AAA', marginLeft: 10, fontFamily: 'PingFang SC' }}>应扣保险:{rowData.deductibleInsurance == undefined ? 0 : rowData.deductibleInsurance}</Text>
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#AAA', fontFamily: 'PingFang SC' }}>应扣公积金:{rowData.deductiblePrevident == undefined ? 0 : rowData.deductiblePrevident}</Text>
                            </View>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#AAA', marginLeft: 10, fontFamily: 'PingFang SC' }}>补贴费用:{rowData.sybsidyCost == undefined ? 0 : rowData.sybsidyCost}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#AAA', fontFamily: 'PingFang SC' }}>{rowData.remark == undefined ? '备注：无' : "备注 保险扣除:" + Math.abs(rowData.remark)}</Text>
                            </View>
                        </View>
                        {/* {rowData.startTime == undefined && rowData.endTime == undefined ? null :
                            <View style={{ flexDirection: 'row', marginTop: 40, marginBottom: 5 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, position: 'absolute', right: 20, fontFamily: 'PingFang SC' }}>{rowData.startTime} ~ {rowData.endTime}</Text>
                            </View>} */}
                        {rowData.workType == 'CHYW' ? <TouchableOpacity onPress={() => { this.checkDutypaid(rowData) }} >
                            <Text style={{ width: 100, padding: 5, backgroundColor: '#3E7EFE', color: '#FFF', marginTop: 20, borderRadius: 3, fontSize: Config.MainFontSize - 1 }}>查看完税证明</Text>
                        </TouchableOpacity> : null}
                    </View>
                </View>
                <View style={{ height: 10, backgroundColor: '#F4F4F4', width: theme.screenWidth }} />
            </View>
        )

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

