import React, { Component } from 'react';
import { Text, View, StyleSheet, PixelRatio, TouchableWithoutFeedback, TextInput } from 'react-native';

import px2dp from '../utils/px2dp';
import {
    Button
} from 'react-native-elements'
import { Toast, Config, Actions } from 'c2-mobile'
import Global from '../utils/GlobalStorage';
export default class Ipmodify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempIp: '',
        }
        this.passParams = {
            params: {
                ip: '',
                duankou: '',
                fuwu: '',
            }
        }
        Global.getValueForKey('mainUrl').then((ret) => {
            if (ret == Config.mainUrl || ret == '' || ret == undefined) {
                this.setState({
                    tempIp: Config.mainUrl
                })
            } else {
                this.setState({
                    tempIp: ret
                })
                Config.mainUrl = ret
            }
        })
    }

    onBackHandler() {
        Actions.pop()
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.editGroup, styles.list]}>
                    <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                    <View style={styles.editView1}>
                        <Text style={{ color: '#000', margin: 10, }}>当前配置IP :    {this.state.tempIp}</Text>
                    </View>
                    <View style={styles.editGroup}>
                        <TouchableWithoutFeedback  >
                            <View style={styles.editView1}>
                                <View style={{
                                    backgroundColor: 'white', flexDirection: "row"
                                }}>
                                    <Text style={{ color: '#000', margin: 10, textAlign: 'center' }}>请输入修改的 IP : </Text>
                                    <View style={{ flex: 1, marginTop: px2dp(0) }}>
                                        {<TextInput
                                            style={styles.edit}
                                            underlineColorAndroid="transparent"
                                            placeholder=" 例如：172.16.81.01 (必填)"
                                            placeholderTextColor="grey"
                                            autoCapitalize={'none'}
                                            keyboardType='numeric'
                                            // autoFocus={true}//自动获取焦点
                                            autoCorrect={true}
                                            onChangeText={(text) => {
                                                this.passParams.params.ip = text
                                            }}
                                        />}
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                        <TouchableWithoutFeedback  >
                            <View style={styles.editView1}>
                                <View style={{
                                    backgroundColor: 'white', flexDirection: "row"
                                }}>
                                    <Text style={{ color: '#000', margin: 10, textAlign: 'center' }}>请输入修改端口 : </Text>
                                    <View style={{ flex: 1, marginTop: px2dp(0), marginLeft: px2dp(5) }}>
                                        {<TextInput
                                            style={styles.edit}
                                            underlineColorAndroid="transparent"
                                            placeholder="例如：8080（选填）"
                                            keyboardType='numeric'
                                            placeholderTextColor="grey"
                                            onChangeText={(text) => {
                                                this.passParams.params.duankou = text
                                            }}
                                        />}
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ height: 1 / PixelRatio.get(), backgroundColor: '#c4c4c4' }} />
                        <TouchableWithoutFeedback  >
                            <View style={styles.editView1}>
                                <View style={{
                                    backgroundColor: 'white', flexDirection: "row"
                                }}>
                                    <Text style={{ color: '#000', margin: 10, textAlign: 'center' }}>请输入服务名称 : </Text>
                                    <View style={{ flex: 1, marginTop: px2dp(0), marginLeft: px2dp(5) }}>
                                        {<TextInput
                                            style={styles.edit}
                                            underlineColorAndroid="transparent"
                                            placeholder=" 例如:hrsj (选填)"
                                            placeholderTextColor="grey"
                                            onChangeText={(text) => {
                                                this.passParams.params.fuwu = text
                                            }}
                                        />}
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    <Button
                        backgroundColor='#03A9F4'
                        buttonStyle={{ borderRadius: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, marginTop: 50 }}
                        title='确认'
                        onPress={this.onRightCommit.bind(this)}
                    />
                    <Button
                        backgroundColor='#03A9F4'
                        buttonStyle={{ borderRadius: 3, marginLeft: 15, marginRight: 15, marginBottom: 10, marginTop: 10 }}
                        title='恢复默认'
                        onPress={() => this.hfsz()}
                    />
                </View>
            </View>
        );
    }
    onRightCommit() {
        if (this.passParams.params.ip == '') {
            Toast.showInfo('请输入IP', 500)
        }
        else {
            Toast.showInfo('修改成功', 1000)
            if (this.passParams.params.duankou == '') {
                var ip = "http://" + this.passParams.params.ip;
            }
            if (this.passParams.params.fuwu == '') {
                var ip = "http://" + this.passParams.params.ip + ":" + this.passParams.params.duankou
            } else {
                var ip = "http://" + this.passParams.params.ip + ":" + this.passParams.params.duankou + "/" + this.passParams.params.fuwu
            }
            Global.saveWithKeyValue('mainUrl', ip);
            Config.mainUrl = ip;
            this.onBackHandler();
        }
    }
    hfsz() {
        Toast.showInfo('已恢复默认IP', 1000)
        Global.saveWithKeyValue('mainUrl', Config.appApiUrl);
        Config.mainUrl = Config.appApiUrl
        this.onBackHandler();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4'
    },
    view: {
        flex: 1,
        backgroundColor: 'rgb(22,131,251)'
    },
    edit: {
        flex: 1,
        height: 20,
        textAlign: 'left',
        fontSize: px2dp(13),
        backgroundColor: '#fff',

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