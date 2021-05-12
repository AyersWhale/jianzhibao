/**
 * 新增切换账号页面
 */
import React, { Component } from 'react';
import { View, StyleSheet, PixelRatio, Dimensions, Keyboard, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import px2dp from '../../utils/px2dp';
import theme from '../../config/theme';
import Global from '../../utils/GlobalStorage';
import { UUID, Actions, Toast, Config } from 'c2-mobile';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default class AddUser extends Component {
    constructor(props) {
        super(props);
        this.passParams = {
            params: {
                // userName: UserInfo.userInfo.params.userName,
                newUserName: '',
                newUserPsw: '',
            }
        };
        this.state = {
            key: this.props.params.key,
        };
        Global.getValueForKey('loginInformation').then((ret) => {
            if (ret) {
                this.currentuserName = ret.userName;
                this.currentpassword = ret.passWord;
            }
        })
    }
    componetDidMount() {

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.editGroup, styles.list]}>
                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="账号"
                            placeholderTextColor='#909090'
                            onChangeText={(text) => { this.passParams.params.newUserName = text }}
                        />
                    </View>
                    <View style={styles.editView2}>
                        <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            placeholder="密码"
                            secureTextEntry={true}
                            placeholderTextColor='#909090'
                            onChangeText={(text) => { this.passParams.params.newUserPsw = text }}
                        />
                    </View>
                    <TouchableOpacity style={styles.out_button} onPress={() => {
                        this.onRightCommit()
                    }}>
                        <View style={styles.out_body}>
                            <Text style={styles.out_text}>保存</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>


        );
    }
    //保存功能
    onRightCommit() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
            duration: 1000,
        });
        Keyboard.dismiss();
        if (this.passParams.params.newUserName == '') {
            Toast.showInfo("账号为空,请重新输入!", 1000)
        } else if (this.passParams.params.newUserPsw == '') {
            Toast.showInfo("密码为空,请重新输入!", 1000)
        } else {
            //type标识手机标识码  kind=2表示删除，1表示新增
            var url = Config.mainUrl + "/ws/addMobileUser?kind=1&type=" + this.state.key + "&userName=" + this.passParams.params.newUserName + "&password=" + this.passParams.params.newUserPsw;
            //Http请求
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.text())
                .then((json) => {
                    if (JSON.parse(json).result == true) {
                        var url = Config.mainUrl + "/ws/addMobileUser?kind=1&type=" + this.state.key + "&userName=" + this.currentuserName + "&password=" + this.currentpassword;
                        //Http请求
                        fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((res) => res.text())
                            .then((json) => {
                            });
                        Toast.dismiss()
                        Actions.pop();
                        this.props.onblock();
                        Toast.showInfo("保存成功!", 1000)
                    } else {
                        Toast.showInfo("保存失败!请检查账号密码是否正确", 1000)
                    }
                }).catch((error) => {//2
                    if (error.message.indexOf('JSON') == 0) {
                        // Toast.showInfo("登录信息失效,重新登录", 1000)
                        // Actions.Login({ type: 'reset' });
                        Toast.showInfo("保存失败!请检查账号密码是否正确", 1000)
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
    view: {
        flex: 1,
        backgroundColor: 'rgb(22,131,251)'
    },
    out_text: {
        fontSize: 16,
        color: '#ffffff'
    },
    out_body: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#44b2ff',
        width: Dimensions.get('window').width / 1.1,
        height: 44,
        marginTop: 25,
        borderRadius: 30,
        justifyContent: 'center'
    },
    edit: {
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
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
        borderBottomRightRadius: 3
    },
    list: {
        marginTop: px2dp(15)
    },
    editGroup: {
        margin: px2dp(0)
    }


});