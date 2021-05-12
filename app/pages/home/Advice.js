/**
 * 功能：意见及反馈
 * 伍钦
 */
import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, Platform, TextInput, TouchableOpacity, Text, Keyboard, ImageBackground, BackHandler } from 'react-native';
import px2dp from '../../utils/px2dp';
import theme from '../../config/theme';
import { Actions, Toast, Config, UserInfo, Fetch, SafeArea, VectorIcon } from 'c2-mobile';
import { QyAdvice } from 'qysyb-mobile'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const phoneRule = /^(((13[0-9]{1})||(14[0-9]{1})||(15[0-9]{1})||(16[0-9]{1})||(18[0-9]{1})||(19[0-9]{1})||(17[0-9]{1}))+\d{8})$/;
export default class Advice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            relationName: '',
            relationPhone: ''
        }
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
    render() {
        return (
            <View style={styles.container}>
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>意见与反馈</Text>
                    </View>
                </View>


                <View style={{ backgroundColor: "white", marginTop: 24 }}>

                    <View style={styles.item}>
                        <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', }}>联  系  人</Text>
                        <TextInput
                            style={styles.item_input}
                            placeholder='请输入您的姓名'
                            maxLength={20}
                            value={this.state.relationName}
                            onChangeText={(value) => this.setState({ relationName: value })}
                        />
                    </View>


                    <View style={{ width: deviceWidth, backgroundColor: '#f4f4f4', height: 10 }}></View>


                    <View style={[styles.item]}>
                        <Text style={{ fontSize: Config.MainFontSize + 3, color: '#333', }}>联系电话</Text>
                        <TextInput
                            style={styles.item_input}
                            maxLength={11}
                            placeholder='请输入您的联系电话'
                            value={this.state.relationPhone}
                            onChangeText={(value) => this.setState({ relationPhone: value })}
                            keyboardType={"numeric"}
                        />
                    </View>
                </View>

                <View style={{ height: (Platform.OS == 'ios') ? deviceHeight / 4 : deviceHeight / 3, backgroundColor: '#ffffff', borderBottomColor: "#d3d3d3", borderBottomWidth: 1, marginTop: 10 }}>
                    <Text style={{ marginLeft: 20, marginTop: 20, fontSize: Config.MainFontSize + 3, color: '#333', fontWeight: '500' }}>我们的进步 , 期待您的参与!</Text>
                    <TextInput
                        style={{ flex: 1, backgroundColor: '#f2f2f2', fontSize: Config.MainFontSize + 3, margin: 20 }}
                        placeholder='请输入您的意见与反馈...'
                        placeholderTextColor={'#999999'}
                        value={this.state.value}
                        underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                        multiline={true}
                        onChangeText={(value) => this.setState({ value: value })}
                    />
                </View>
                <TouchableOpacity style={styles.out_button} onPress={() => {
                    this.onRightCommit()
                }}>
                    <View style={{
                        marginBottom: 50,
                        alignItems: 'center',
                        alignSelf: 'center',
                        backgroundColor: '#3E7EFE',
                        width: Dimensions.get('window').width - 66,
                        height: 52,
                        marginTop: 30,
                        borderRadius: 30,
                        justifyContent: 'center'
                    }}>
                        <Text style={styles.out_text}>提交</Text>
                    </View>
                </TouchableOpacity>
                {/**这里估计想把智能问答组件化 */}
                {/* <QyAdvice/> */}
            </View>
        );
    }

    onRightCommit() {
        if (this.state.relationName == '') {
            Toast.showInfo('请输入联系人姓名', 1000)
            return
        } else if (this.state.relationPhone == '') {
            Toast.showInfo('请输入联系人方式', 1000)
            return
        } else if (this.state.value == '') {
            Toast.showInfo('请输入的意见', 1000)
            return
        } else if (this.state.relationPhone !== '' && !phoneRule.test(this.state.relationPhone)) {
            Toast.showInfo('请输入正确的联系方式', 1000)
            return
        }
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            solution: this.state.value,
            relationName: this.state.relationName,
            relationPhone: this.state.relationPhone
        }
        //Keyboard.dismiss
        if (this.state.value) {
            Toast.show({
                type: Toast.mode.C2MobileToastLoading,
                title: '提交中...'
            });
            Fetch.postJson(Config.mainUrl + '/problemCollection/saveEntity', entity)
                .then((res) => {
                    Toast.dismiss();
                    console.log(res)
                    if (res) {
                        Toast.show({
                            type: Toast.mode.C2MobileToastError,
                            title: '提交成功',
                            duration: 1000,
                        });
                        Actions.pop()
                    } else {
                        Toast.show({
                            type: Toast.mode.C2MobileToastError,
                            title: '提交失败',
                            duration: 1000,
                        });
                    }
                })
        } else {
            Toast.show({
                type: Toast.mode.C2MobileToastError,
                title: '意见不能为空',
                duration: 1000,
            });
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4'
    },
    out_text: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600'
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        width: deviceWidth - 40,
        marginLeft: 20,
        justifyContent: 'space-between'
        // borderColor: "#e7e7e7",
        // borderBottomWidth: 1
    },
    item_input: {
        flex: 1,
        textAlign: "right",
    }
});