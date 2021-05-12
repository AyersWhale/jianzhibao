/**
 * 切换账号功能模块
 * 伍钦
 */
import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, Platform, Dimensions, Image, TouchableOpacity } from 'react-native';
import theme from '../../config/theme';
import { UUID, Actions, NavigationBar, Config, Toast, UserInfo } from 'c2-mobile';
import Global from '../../utils/GlobalStorage';
import PcInterface from '../../utils/http/PcInterface';
import EncryptionUtils from '../../utils/EncryptionUtils';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default class changeUserFragment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightTitle: '新增',
            userInfo: this.props.userInfo,
            showDeleteButton: false,
            deleteMsg: '前往清除登录痕迹',
            userList: [],
        }
        Global.getValueForKey('iphonKey').then((ret) => {
            if (ret) {
                this.setState({ key: ret }, () => { this.init() })
            } else {
                var key = UUID.v4();
                Global.saveWithKeyValue('iphonKey', key);
                this.setState({ key: ret }, () => { this.init() })
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title="切换账号" faction='center' >
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem faction='right' title={this.state.rightTitle} iconSize={20} onPress={this.addUser.bind(this)} style={{ width: 100, paddingRight: 10 }} />
                </NavigationBar>
                <View style={{ marginTop: deviceHeight / 6, alignContent: "center", justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: 'black', textAlign: 'center' }}>轻触头像以切换账号</Text>
                </View>
                <View style={{ backgroundColor: '#e5e5e5', width: deviceWidth / 3, height: 3, marginLeft: deviceWidth / 3, marginTop: 50 }} />
                <View style={{ height: deviceHeight / 3, marginTop: 10, justifyContent: 'center', alignContent: "center" }}>
                    <ScrollView style={{ marginTop: 30, alignContent: "center" }} horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}>
                        {this.getUserList()}
                    </ScrollView>
                </View>

                <TouchableOpacity style={{ position: 'absolute', bottom: 30, left: deviceWidth / 4, right: deviceWidth / 4 }} onPress={this.deleteMsg.bind(this)}>
                    <Text style={{ fontSize: Config.MainFontSize, textAlign: 'center', color: '#626C8E' }}>{this.state.deleteMsg}</Text>
                </TouchableOpacity>
            </View >


        );
    }
    //获取账号列表
    getUserList() {
        var currentUser = this.state.userInfo;//当前用户信息
        var userList = this.state.userList;//用户列表
        var temp = [];
        temp.push(
            <TouchableOpacity style={{ alignContent: "center", justifyContent: 'center', margin: (Platform.OS == 'ios') ? 20 : 16, marginBottom: 0 }} onPress={() => Actions.pop()}>
                {currentUser.remark1 ? <Image source={{ uri: currentUser.remark1 }} style={styles.topImg} />
                    : <Image source={require('../../image/icon_px1.png')} style={styles.topImg} />
                }
                <Text style={{ marginTop: 20, marginLeft: (Platform.OS == 'ios') ? -10 : 0, fontSize: 16, textAlign: 'center' }}>{currentUser.userRealname}</Text>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'lightgreen' }} />
                    <Text style={{ marginLeft: 5, fontSize: Config.MainFontSize, }}>当前使用</Text>
                </View>

            </TouchableOpacity>
        )
        for (let i in userList) {
            if (userList[i].userId != this.state.userInfo.userId) {
                temp.push(
                    <TouchableOpacity style={{ alignContent: "center", justifyContent: 'center', margin: (Platform.OS == 'ios') ? 20 : 16 }} onPress={this.changeUserLogin.bind(this, userList[i])}>
                        {userList[i].remark1 ? <Image source={{ uri: userList[i].remark1 }} style={styles.topImg} />
                            : <Image source={require('../../image/icon_px1.png')} style={styles.topImg} />
                        }
                        <Text style={{ marginTop: 20, marginLeft: (Platform.OS == 'ios') ? -10 : 0, fontSize: 16, textAlign: 'center' }}>{userList[i].userRealname}</Text>
                        {this.state.showDeleteButton ?
                            <TouchableOpacity style={{ position: 'absolute', top: (Platform.OS == 'ios') ? 50 : 0, right: (Platform.OS == 'ios') ? -15 : 0 }} onPress={this.delete.bind(this, userList[i])}>
                                <Image source={require('../../image/close1.png')} style={{ width: 16, height: 16, borderRadius: 8 }} />
                            </TouchableOpacity>
                            : null}
                    </TouchableOpacity>
                )
            }
        }

        temp.push(
            <TouchableOpacity style={{ alignContent: "center", justifyContent: 'center', margin: (Platform.OS == 'ios') ? 20 : 16 }} onPress={this.addUser.bind(this)}>
                <Image source={require('../../image/add1.png')} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'tranparent' }} />
            </TouchableOpacity>
        )

        return temp;
    }
    //切换用户登录
    changeUserLogin(rowData) {
        let loginParams = {
            params: {
                userName: rowData.userName,
                passWord: rowData.userPassword,
            }
        }
        EncryptionUtils.fillEncodeData(loginParams);
        PcInterface.login(loginParams, (set) => {
            if (set.result.rcode == 1) {
                let rawData = {
                    userInfo: loginParams,
                    loginSet: set
                }
                UserInfo.initUserInfoWithDict(rawData);
                var params = {
                    userName: rowData.userName,
                    passWord: rowData.userPassword,
                }
                Global.saveWithKeyValue('loginInformation', params);
                Actions.Login({ type: 'reset' });
                return;
            } else {
                Toast.showInfo("保存的信息已失效,请删除后重新添加", 2000)
            }
        })
    }
    //新增登录用户
    addUser() {
        Actions.AddUser({ params: { key: this.state.key }, onblock: this.init.bind(this) })
    }
    init() {
        //type标识手机标识码
        var url = Config.mainUrl + "/ws/viewMobileUser?type=" + this.state.key;
        //Http请求
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                if (JSON.parse(json).length !== 0) {
                    this.setState({
                        userList: JSON.parse(json)
                    })
                }
            }).catch((error) => {
                if (error.message.indexOf('JSON') == 0) {
                    // Toast.showInfo("登录信息失效,重新登录", 1000)
                    // Actions.Login({ type: 'reset' });
                }
            });
    }
    //删除登录用户
    delete(rowData) {
        this.setState({
            deleteMsg: (this.state.deleteMsg == '取消') ? '前往清除登录痕迹' : '取消',
            showDeleteButton: !this.state.showDeleteButton,
        })
        //type标识手机标识码   kind=2表示删除，1表示新增
        var url = Config.mainUrl + "/ws/addMobileUser?kind=2&type=" + this.state.key + "&userId=" + rowData.userId;
        //Http请求
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                if (JSON.parse(json).result.rcode == "1") {
                    Toast.showInfo("删除成功!", 1000);
                    this.init()
                } else {
                    Toast.showInfo(JSON.parse(json).result.rmsg, 1000)
                }
            }).catch((error) => {
                if (error.message.indexOf('JSON') == 0) {
                    Toast.showInfo("登录信息失效,重新登录", 1000)
                    Actions.Login({ type: 'reset' });
                }
            });

    }
    deleteMsg() {
        this.setState({
            deleteMsg: (this.state.deleteMsg == '取消') ? '前往清除登录痕迹' : '取消',
            showDeleteButton: !this.state.showDeleteButton,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    topImg: {
        width: 50,
        height: 50
    },
});