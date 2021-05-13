/**
 * 发起结算
 * Created by 曾一川 on 18/07/18.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Platform, ImageBackground, Dimensions, TextInput, Image, TouchableOpacity, Alert, Keyboard, KeyboardAvoidingView } from 'react-native';
import { Actions, VectorIcon, UUID, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import Toasts from 'react-native-root-toast';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class CountMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyboardHeight: '', // 键盘高度
            M: false,
            W: false,
            uuid: UUID.v4(),
            money: '',
        }
    }

    // 监听键盘弹出与收回
    componentDidMount() {
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardDidHide)
    }
    //注销监听
    componentWillUnmount() {
        this.keyboardWillShowListener && this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener && this.keyboardWillHideListener.remove();
        // this.setState = (state, callback) => {
        //     return;
        // };
    }
    //键盘弹起后执行
    keyboardDidShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        })
    }

    //键盘收起后执行
    keyboardDidHide = () => {
        this.setState({
            keyboardHeight: 0
        })
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>发起结算</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>发起结算</Text>
                    </View>
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' keyboardVerticalOffset={-this.state.keyboardHeight}>
                    <ScrollView style={{ width: deviceWidth, backgroundColor: '#E8E8E8' }}>
                        <ScrollView style={{ width: deviceWidth - 20, height: deviceHeight / 3, backgroundColor: 'white', margin: 10 }}>
                            <Text style={{ fontSize: Config.MainFontSize + 5, margin: 10, color: 'rgb(65,143,234)' }}>{this.props.rowData.positionName}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5 }}>接包内容：{this.props.rowData.jobDescription}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5 }}>合同签订时间：{this.dataChange(this.props.rowData.getJobTime)}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5 }}>用工结束时间：{this.dataChange(this.props.rowData.workEndTime)}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5 }}>合同金额：{this.props.rowData.salarylower == undefined ? '0' : this.props.rowData.salarylower}元</Text>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5 }}>已结算金额：{this.props.rowData.money == undefined ? '0' : this.props.rowData.money}元</Text>
                        </ScrollView>
                        <View style={{ width: deviceWidth - 20, height: 60, backgroundColor: 'white', margin: 10, flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5, marginTop: 23 }}>结算方式：</Text>
                            <TouchableOpacity onPress={this.pres1.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 140, top: 20 }}>
                                {this.state.M == false ? <Image source={require('../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 8 }} /> :
                                    <Image source={require('../image/Group.png')} style={{ height: 14, width: 14, marginTop: 8 }} />}
                                <View>
                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 5 }}>阶段性结算</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.pres2.bind(this)} style={{ flexDirection: 'row', position: 'absolute', right: 20, top: 20 }}>
                                {this.state.W == false ? <Image source={require('../image/Oval.png')} style={{ height: 14, width: 14, marginTop: 8 }} /> :
                                    <Image source={require('../image/Group.png')} style={{ height: 14, width: 14, marginTop: 8 }} />}
                                <View>
                                    <Text style={{ marginLeft: 10, fontWeight: 'bold', marginTop: 5 }}>尾款结算</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: deviceWidth - 20, height: 60, backgroundColor: 'white', margin: 10, flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, margin: 5, marginLeft: 5, marginTop: 23 }}>结算金额(元)：</Text>
                            <TextInput
                                style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 10, }}
                                underlineColorAndroid="transparent"
                                secureTextEntry={false}
                                keyboardType='numeric'
                                placeholderTextColor="#c4c4c4"
                                value={this.state.money}
                                placeholder='请输入结算金额'
                                onChangeText={(text) => { this.setState({ money: text }) }}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={() => this.ensure()}>
                    <View style={{
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: 'rgb(65,143,234)',
                        width: Dimensions.get('window').width / 1.5,
                        height: 44,
                        borderRadius: 30,
                        justifyContent: 'center',
                        marginTop: 10, marginBottom: 20
                    }}>
                        <Text style={{ color: 'white' }}>提交</Text>
                    </View>
                </TouchableOpacity>

            </View>
        );
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
    ensure() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '提交中...'
        });
        var mes = ''
        if (this.state.M == false && this.state.W == false) {
            Toast.dismiss();
            Toast.showInfo('请选择结算方式', 1000)
            return;
        }
        var rule = /(^(((?!0+$)(?!0*\.0*$)\d{1,7}(\.\d{1,2})?)|10000000|10000000.0|10000000.00)$)/
        if (!rule.test(this.state.money)) {
            Toast.dismiss();
            Toast.showInfo('请填写合理的金额', 1000);
            return
        }
        if (this.state.money == '' || this.state.money == undefined) {
            Toast.dismiss();
            Toast.showInfo('请填写结算金额', 1000)
            return;
        }
        if (this.state.money <= 0) {
            Toast.dismiss();
            Toast.showInfo('结算金额不能小于或等于0', 1000)
            return;
        }
        if (this.state.money > 10000000) {
            Toast.dismiss();
            Toast.showInfo('结算金额不可超过10000000', 1000)
            return;
        }

        // if (this.state.M == true) {
        if (parseFloat(this.state.money) + this.props.rowData.money == this.props.rowData.salarylower) {
            // Toast.showInfo('阶段性结算的总额不能等于合同金额', 1000)
            // return;
            Toast.dismiss();
            mes = '您的结算总金额等于合同金额,'
        }
        // }


        if (parseFloat(this.state.money) + this.props.rowData.money > this.props.rowData.salarylower) {
            // Toast.showInfo('结算总额不能大于合同金额', 1000)
            mes = '您的结算总金额超过合同金额，'
            // return;
            Toast.dismiss();
        }

        // Alert.alert("提示", mes+"确认提交结算吗？"
        //     , [
        //         {
        //             text: "我再看看", onPress: () => {

        //             }
        //         },
        //         {
        //             text: "确定", onPress: () => {

        //              }
        //         }])

        // if (this.state.money > this.props.rowData.salarylower) {
        //     Toast.showInfo('结算金额不可大于合同金额', 1000)
        //     return;
        // }
        // if (this.state.M == true && this.state.money == this.props.rowData.salarylower) {
        //     Toast.showInfo('阶段性结算的总额不能等于合同金额', 1000)
        //     return;
        // }
        var entity = {
            id: this.state.uuid,
            creatorId: this.props.rowData.creatorId,
            positionId: this.props.rowData.positionId,
            type: this.state.M == true ? '4' : '5',
            fqjsMoney: this.state.money,
            money: this.props.rowData.money == undefined ? '0' : this.props.rowData.money,
            contractId: this.props.rowData.contractId,
            userId: this.props.rowData.userId,
        }
        Fetch.postJson(Config.mainUrl + '/lsygSettle/appSettleStartCheck', entity)
            .then((ret) => {
                Toast.dismiss();
                console.log(ret)
                if (ret.result == 'success') {
                    Alert.alert("提示", mes + "确认提交结算吗？"
                        , [
                            {
                                text: "我再看看", onPress: () => {
                                }
                            },
                            {
                                text: "继续", onPress: () => {
                                    var entitys = {
                                        id: this.state.uuid,
                                        creatorId: this.props.rowData.creatorId,
                                        positionId: this.props.rowData.positionId,
                                        type: this.state.M == true ? '4' : '5',
                                        fqjsMoney: this.state.money,
                                        money: this.props.rowData.money == undefined ? '0' : this.props.rowData.money,
                                        contractId: this.props.rowData.contractId,
                                        userId: this.props.rowData.userId,
                                        bxMoneyGR: ret.bxMoneyGR,
                                        bxMoneyGS: ret.bxMoneyGS,
                                        insuranceSettleId: ret.insuranceSettleId
                                    }
                                    Fetch.postJson(Config.mainUrl + '/lsygSettle/appSettle', entitys)
                                        .then((res) => {
                                            if (res.rcode == "-1") {
                                                Toasts.show('提交成功', { position: -80 });
                                                Actions.pop({ refresh: { test: UUID.v4() } })
                                            } else {
                                                Toast.showInfo(res.Msg, 2000);
                                            }
                                        })
                                }
                            }
                        ])
                } else {
                    Toast.showInfo(ret.Msg, 2000);
                }
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

});
