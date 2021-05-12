import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, PixelRatio, Platform, Alert, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import px2dp from '../../utils/px2dp';
import theme from '../../config/theme';
import stylesheet from '../../utils/style';
import Button from '../../components/Button1';
import { Actions, Config, UserInfo, VectorIcon } from 'c2-mobile';
import PcInterface from '../../utils/http/PcInterface';
import Global from '../../utils/GlobalStorage';
import HandlerOnceTap from '../../utils/HandlerOnceTap'
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.onLeftBack = this.onLeftBack.bind(this);
        this.confirmPassword = '';
        this.passParams = {
            params: {
                userName: UserInfo.userInfo.params.userName,
                oldPassword: '',
                newPassword: '',
            }
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ width: deviceWidth, backgroundColor: '#3E7EFE', height: 210 }}>
                    <View style={{ zIndex: 99, flexDirection: 'row', width: deviceWidth, justifyContent: 'space-between', alignItems: 'center', marginTop: 35 }}>
                        <TouchableOpacity onPress={() => Actions.pop()}  >
                            <Text style={{ marginLeft: 20, fontSize: Config.MainFontSize + 1, color: '#fff', fontWeight: '500', marginTop: 2 }}>取消</Text>
                        </TouchableOpacity>
                        <View>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>修改密码</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.save()} style={{ backgroundColor: '#E6E6E6', width: 56, height: 32, justifyContent: 'center', alignItems: 'center', marginRight: 20 }}>
                            <Text>完成</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 21, alignItems: 'center', width: deviceWidth - 68, marginLeft: 34 }}>
                        <Text style={{ fontSize: Config.MainFontSize + 1, color: '#fff', fontWeight: '500' }}>如果你已忘记工薪易密码，可以在本页面重置工薪易密码。后续可通过手机号+工薪易密码登录。</Text>
                    </View>
                    <Image source={require('../../image/dllogo.png')} style={{ width: 211, height: 211, position: 'absolute', right: -40 }} />

                    {/* <Text style={{ position: 'absolute', marginTop: 80, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>123</Text>
                    <Text style={{ position: 'absolute', marginTop: 118, fontSize: Config.MainFontSize + 8, marginLeft: 20, color: '#fff', fontFamily: 'PingFang SC', fontWeight: 'bold' }}>欢迎来到工薪易</Text> */}
                </View>
                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, marginTop: -40 }}>


                    <View style={[styles.editGroup, styles.list]}>
                        <View style={styles.editView2}>
                            <TextInput
                                style={styles.edit}
                                underlineColorAndroid="transparent"
                                placeholder="旧密码"
                                secureTextEntry={true}
                                placeholderTextColor='#909090'
                                onChangeText={(text) => { this.passParams.params.oldPassword = text }}
                            />
                        </View>
                        <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                        <View style={styles.editView2}>
                            <TextInput
                                style={styles.edit}
                                underlineColorAndroid="transparent"
                                placeholder="新密码(6~20位字母、数字、下划线)"
                                secureTextEntry={true}
                                placeholderTextColor='#909090'
                                onChangeText={(text) => { this.passParams.params.newPassword = text }}
                            />
                        </View>
                        <View style={styles.editView2}>
                            <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                            <TextInput
                                style={styles.edit}
                                underlineColorAndroid="transparent"
                                placeholder="确认新密码(6~20位字母、数字、下划线)"
                                secureTextEntry={true}
                                placeholderTextColor='#909090'
                                onChangeText={(text) => { this.confirmPassword = text }}
                            />
                        </View>


                        {/* <TouchableOpacity style={styles.out_button} onPress={() => { this.save() }}>
                            <View style={styles.out_body}>
                                <Text style={styles.out_text}>保存</Text>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </View>
                <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
            </View>
        );
    }
    onLeftBack() {
        const { navigator } = this.props;
        navigator.pop();
    }
    save() {
        console.log('wncindsjcn')
        HandlerOnceTap(() => { this.onRightCommit() })
    }
    onRightCommit() {
        let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{6,16}$/;
        const patrn1 = /^(\w){6,20}$/;
        var th = this;
        Global.saveWithKeyValue('newPassword', this.passParams.params.newPassword);
        if (this.passParams.params.oldPassword != UserInfo.userInfo.params.passWord) {
            Alert.alert("", '请输入正确的旧密码!', [{ text: '确定', onPress: () => { } }]);
        } else if (this.passParams.params.oldPassword === '' || this.passParams.params.newPassword === '' || this.confirmPassword === '') {
            Alert.alert("", '密码为空,请重新输入!', [{ text: '确定', onPress: () => { } },]);
        } else if (!patrn1.test(this.passParams.params.newPassword) || !patrn1.test(this.confirmPassword)) {
            Alert.alert("", '请输入6～20位的密码(可包含数字、字母、下划线)!', [{ text: '确定', onPress: () => { } },]);
        } else if (this.passParams.params.oldPassword == this.passParams.params.newPassword) {
            Alert.alert("", '新旧密码一致!', [{ text: '确定', onPress: () => { } }]);
        } else if (this.passParams.params.newPassword != this.confirmPassword) {
            Alert.alert("", '新密码两次输入不一致!', [{ text: '确定', onPress: () => { } }]);
        } else {
            PcInterface.updatePassword(this.passParams, function (set) {
                // debugger
                switch (set.result.rcode) {
                    case '1':
                        Alert.alert("提示", "修改成功,返回登录页面重新登录"
                            , [
                                {
                                    text: "确定", onPress: () => {
                                        // Global.getValueForKey('newPassword').then((ret) => {
                                        //     Actions.Login({ type: 'reset', password: ret });
                                        // })
                                        Global.saveWithKeyValue('loginInformation', { userName: UserInfo.userInfo.params.userName, passWord: '' });
                                        Actions.Login({ type: 'reset' });
                                    }
                                }
                            ])
                        break;
                    case '0':
                        Alert.alert("提示", "修改失败"
                            , [
                                {
                                    text: "确定", onPress: () => {

                                    }
                                }
                            ])

                        break;
                    default:
                }
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    out_text: {
        fontSize: 16,
        color: '#ffffff'
    },
    out_body: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgb(65,143,234)',
        width: Dimensions.get('window').width / 1.5,
        height: 44,
        marginTop: 25,
        borderRadius: 30,
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
        fontSize: px2dp(11),
        backgroundColor: '#fff',
        marginLeft: 10
    },

    editView1: {
        height: px2dp(48),
        backgroundColor: 'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    editView2: {
        height: px2dp(48),
        backgroundColor: 'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,

    },
    list: {
        marginTop: px2dp(15)
    },
    editGroup: {
        margin: px2dp(0)
    }
});