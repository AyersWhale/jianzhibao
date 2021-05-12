/**
 * 偏好设置
 * Created by 伍钦.
 */
import React, { Component } from 'react';
import {
    Text, View, StyleSheet, ScrollView, Dimensions, Image, Platform, TouchableOpacity, ImageBackground
} from 'react-native';
import Global from '../../utils/GlobalStorage';
import { Actions, Config, SSOAuth, VectorIcon, UserInfo } from 'c2-mobile';
import { List, Radio } from 'antd-mobile-rn';
const RadioItem = Radio.RadioItem;
export default class PersonSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: UserInfo.loginSet.result.rdata.loginUserInfo,
            bjsz: false,
            sysz: false,
            bjszDesc: '',
            syszDesc: '',
        }
        Global.getValueForKey('themePick').then((ret) => {
            if (ret) {
                //星空=1，科技=2， 海洋=3， 办公=4
                if (ret == '1') {
                    this.setState({ bjszNum: 1, bjszDesc: "星空" });
                }
                if (ret == '2') {
                    this.setState({ bjszNum: 2, bjszDesc: "科技" });
                }
                if (ret == '3') {
                    this.setState({ bjszNum: 3, bjszDesc: "海洋" });
                }
                if (ret == '4') {
                    this.setState({ bjszNum: 4, bjszDesc: "办公" });
                }
            }

        })
        Global.getValueForKey('shouyeSettings').then((ret) => {
            if (ret) {
                if (ret == 'msg') {
                    this.setState({ syszNum: 1, syszDesc: "职位" });
                }
                if (ret == 'contacts') {
                    this.setState({ syszNum: 2, syszDesc: "合同" });
                }
                if (ret == 'faxian') {
                    this.setState({ syszNum: 3, syszDesc: "考勤" });
                }
                if (ret == 'me') {
                    this.setState({ syszNum: 4, syszDesc: "我的" });
                }
            }
        })

    }

    render() {
        return (
            <ScrollView style={styles.main_view}>
                <ScrollView>
                    <View >
                        <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 20 }} onPress={() => this.setState({ bjsz: !this.state.bjsz })}>
                            <View style={styles.bodyView}>
                                <VectorIcon key={1} name={'cogs'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>主题设置</Text>
                                <Text style={{ color: Config.C2NavigationBarTintColor, fontSize: 14, position: 'absolute', right: 30, }}>{this.state.bjszDesc}</Text>
                                {(this.state.bjsz) ? <VectorIcon key={2} name={'chevron-left'} style={styles.iconEnd} /> : <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />}
                            </View>
                        </TouchableOpacity>
                        {(this.state.bjsz) ?
                            this.showBjsz()
                            :
                            null}
                        <View style={{ height: 30, backgroundColor: "#e5e5e5", flex: 1 }} />

                        <TouchableOpacity onPress={() => this.setState({ sysz: !this.state.sysz })}>
                            <View style={styles.bodyView}>
                                <VectorIcon key={1} name={'c2_im_weixin_keyboard'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>首页设置</Text>
                                <Text style={styles.iconEnd_text}>{this.state.syszDesc}</Text>
                                {(this.state.sysz) ? <VectorIcon key={2} name={'chevron-left'} style={styles.iconEnd} /> : <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />}
                            </View>
                        </TouchableOpacity>
                        {(this.state.sysz) ?
                            this.showSysz()
                            :
                            null}
                        <View style={{ height: 30, backgroundColor: "#e5e5e5", flex: 1 }} />

                        <TouchableOpacity onPress={() => alert('开发中，敬请期待')}>
                            <View style={styles.bodyView} >
                                <VectorIcon key={1} name={'face'} style={styles.iconStart} />
                                <View style={{ width: 5 }} />
                                <Text style={styles.bdText}>顶部功能设置</Text>
                                <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ScrollView >
        )
    }
    showBjsz() {//主题设置
        return (
            <View >
                <List style={{ marginTop: 0 }}>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 1}
                        onChange={(event) => {
                            if (event.target.checked) {
                                Actions.pop({ refresh: { test: this.state.bjszNum } })
                                this.setState({ bjszNum: 1, bjszDesc: "星空" });
                                Global.saveWithKeyValue('themePick', "1");
                                Config.C2NavigationBarTintColor = 'rgb(42,51,91)';
                                Config.SettingBackgroundImg = require('../../image/xingkong.jpg');
                            }
                        }}>星空</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 2}
                        onChange={(event) => {
                            if (event.target.checked) {
                                Actions.pop({ refresh: { test: this.state.bjszNum } })
                                this.setState({ bjszNum: 2, bjszDesc: "科技" });
                                Global.saveWithKeyValue('themePick', "2");
                                Config.C2NavigationBarTintColor = 'rgb(29,29,29)';
                                Config.SettingBackgroundImg = require('../../image/bg4.png');
                            }
                        }}>科技</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 3}
                        onChange={(event) => {
                            if (event.target.checked) {
                                Actions.pop({ refresh: { test: this.state.bjszNum } })
                                this.setState({ bjszNum: 3, bjszDesc: "海洋" });
                                Global.saveWithKeyValue('themePick', "3");
                                Config.C2NavigationBarTintColor = 'rgb(31,164,240)';
                                Config.SettingBackgroundImg = require('../../image/haiyang.png');
                            }
                        }}>海洋</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.bjszNum === 4}
                        onChange={(event) => {
                            if (event.target.checked) {
                                Actions.pop({ refresh: { test: this.state.bjszNum } })
                                this.setState({ bjszNum: 4, bjszDesc: "办公" });
                                Global.saveWithKeyValue('themePick', "4");
                                Config.C2NavigationBarTintColor = 'rgb(52,121,228)';
                                Config.SettingBackgroundImg = require('../../image/bangong.png');
                            }
                        }}>办公</RadioItem>
                </List>
            </View >
        );
    }
    showSysz() {//首页设置
        return (
            <View>
                <List style={{ marginTop: 0, }}>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.syszNum === 1}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ syszNum: 1, syszDesc: "职位" });
                                Global.saveWithKeyValue('shouyeSettings', "msg");
                                Actions.pop()
                            }
                        }}>职位</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.syszNum === 2}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ syszNum: 2, syszDesc: "合同" });
                                Global.saveWithKeyValue('shouyeSettings', "contacts");
                                Actions.pop()
                            }
                        }}>合同</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.syszNum === 3}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ syszNum: 3, syszDesc: "考勤" });
                                Global.saveWithKeyValue('shouyeSettings', "faxian");
                                Actions.pop()
                            }
                        }}>考勤</RadioItem>
                    <RadioItem
                        style={{ backgroundColor: '#e5e5e5', borderBottomWidth: 1, borderBottomColor: 'white' }}
                        checked={this.state.syszNum === 4}
                        onChange={(event) => {
                            if (event.target.checked) {
                                this.setState({ syszNum: 4, syszDesc: "我" });
                                Global.saveWithKeyValue('shouyeSettings', "me");
                                Actions.pop()
                            }
                        }}>我</RadioItem>
                </List>
            </View >
        );
    }
    outLogin() {
        SSOAuth.logout();
        Actions.pop();
    }

}
let styles = StyleSheet.create({

    main_view: {
        flex: 1,
        backgroundColor: '#e5e5e5',
    },
    bgImg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 5,
        alignItems: 'center',
        justifyContent: "center",

    },
    information: {
        color: "#fff",
        textAlign: 'center',
        backgroundColor: "#f8706d",
        borderWidth: 1,
        borderColor: "#fff",
        width: 18,
        height: 18,
        lineHeight: 18,
        borderRadius: 18,
        position: 'absolute',
        top: -5,
        right: -5,
    },
    topImg: {
        width: 60,
        height: 60,
    },
    bodyView: {
        paddingHorizontal: 20,
        marginBottom: 1,
        flexDirection: 'row',
        backgroundColor: "#fff",
        height: 50,
        alignItems: 'center',
        width: Dimensions.get('window').width,
    },
    bdText: {
        color: "#222222",
        fontSize: Config.MainFontSize,
    },
    iconStart: {
        fontSize: 18,
        marginRight: 10,
    },
    iconEnd: {
        color: 'grey',
        fontSize: 14,
        position: 'absolute',
        right: 10,
    },
    iconEnd_text: {
        color: 'black',
        fontSize: 14,
        position: 'absolute',
        right: 30,
    },
    out_body: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: Config.C2NavigationBarTintColor,
        width: Dimensions.get('window').width / 1.5,
        height: 36,
        marginTop: 10,
        borderRadius: 30,
        justifyContent: 'center'
    },
    out_view: {
        flex: 1,
        textAlign: 'center',

    },
});