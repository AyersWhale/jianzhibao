/**
 * 发现模块
 * 伍钦
 */
import React, { Component } from 'react';
import ReactNative, { Text, View, ScrollView, StyleSheet, Image, Platform } from 'react-native';
import { NavigationBar, UserInfo, Actions } from 'c2-mobile';
import CustomGrid from '../utils/CustomGrid';
import MorePopWidows from '../utils/MorePopWidows';
export default class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPop: false,
            hasMsg: false,
            item: {
                "code": 0, "msg": "成功", "data": [
                    {
                        "id": 52, "icon": null, "name": "其他应用", "children": [
                            { "id": "gzq", "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_1_09.jpg", "name": "工作圈", "children": null },
                            { "id": 1, "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_1_03.jpg", "name": "日志", "children": null },
                            { "id": 60, "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_zczy2.jpg", "name": "客户管理", "children": null }]
                    },
                    {
                        "id": 53, "icon": null, "name": "工具箱", "children": [
                            { "id": 4, "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_1_09.jpg", "name": "计算器", "children": null },
                            { "id": 'sys', "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_zczy2.jpg", "name": "扫一扫", "children": null },
                            { "id": "qianming", "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_1_104.jpg", "name": "签名板", "children": null },
                            { "id": "ticket", "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_bslc3.jpg", "name": "发票抬头管理", "children": null },
                            { "id": "fdjsq", "icon": "https://sds-release.oss-cn-beijing.aliyuncs.com/sds-app/store/skill/icon_zczy2.jpg", "name": "房贷计算器", "children": null },

                        ]
                    }
                ]
            }
        }

    }

    render() {
        var item1 = [{ icon: require('../image/icon_zd1.png'), name: '我的待办', id: 'wddb' },
        { icon: require('../image/icon_zd2.png'), name: '通知公告', id: 'tzgg' },
        { icon: (this.state.hasMsg) ? require('../image/icon_msgred.png') : require('../image/icon_msg.png'), name: '我的消息', id: 'wdxx' },
        { "id": 'kqdk', icon: require('../image/icon_16.png'), "name": "考勤打卡", "children": null },
        ];

        return (
            <View style={styles.container}>
                <NavigationBar title="发现" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem />
                    <NavigationBar.NavBarItem faction='right' rightIcon={'add'} iconSize={28} style={{ width: 80, paddingRight: 10 }} onPress={() => this.setState({ showPop: true })} />
                </NavigationBar>
                <ScrollView >
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#ffffff' }}>
                        <Image source={require('../image/left_title.png')} style={styles.leftTitleIcon} />
                        <Text style={{ fontWeight: '600', fontSize: 16, color: '#000000', marginLeft: 2 }}>工作台</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#f4f4f4', marginTop: 2 }} />
                    <View style={{ marginTop: 5, marginLeft: 20, marginRight: 20, backgroundColor: '#ffffff' }}>
                        <CustomGrid data={item1} type='zhadui' columnNum={4} onClickHandle={this.zhadui.bind(this)} />
                    </View>
                    <View style={{ height: 3, backgroundColor: '#f4f4f4' }} />

                    {this.fenlei()}
                    <MorePopWidows
                        visible={this.state.showPop}
                        closeModal={() => {
                            this.setState({ showPop: false }); return null;
                        }} />
                </ScrollView>

            </View >
        );
    }
    fenlei() {
        var item = this.state.item.data
        if (item == []) { return null }
        var temp = [];
        for (let i in item) {
            if (item[i].children == undefined) { } else {
                temp.push(<View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 6, backgroundColor: '#ffffff' }}>
                        <Image source={require('../image/left_title.png')} style={styles.leftTitleIcon} />
                        <Text style={{ fontWeight: '600', fontSize: 16, color: '#000000', marginLeft: 2 }}>{item[i].name}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: '#f4f4f4', marginTop: 2 }} />
                    <ScrollView style={{ marginTop: 5, marginLeft: 20, marginRight: 20, backgroundColor: '#ffffff' }}>
                        <CustomGrid data={item[i].children} type='local' columnNum={4} onClickHandle={this.zhadui.bind(this)} />
                    </ScrollView>
                    <View style={{ height: 3, backgroundColor: '#f4f4f4' }} />
                </View>
                )
            }
        }
        return temp;

    }
    zhadui(rowData) {
        if (rowData.categoryId == 'kqdk') {//考勤打卡
            Actions.Kaoqin()
        } else if (rowData.categoryId == 'sys') {//扫一扫
            Actions.ScanCode()
        } else if (rowData.categoryId == 'gzq') {//工作圈
            Actions.JobCircle()
        } else if (rowData.categoryId == 'wddb') {//我的待办
            Actions.ConversationInfo({ dataArray: item })
        } else if (rowData.categoryId == 'ticket') {//发票开具
            Actions.Ticket()
        } else if (rowData.categoryId == 'fdjsq') {
            const source = (Platform.OS == 'ios') ? require('./h5page/jsq/index.html') : { uri: 'file:///android_asset/index.html' };
            Actions.C2WebView({ url: source, title: '房贷计算器' });
        } else if (rowData.categoryId == 'qianming') {
            Actions.Qianming()
        } else if (rowData.categoryId == 'qingjia') {
            Actions.Leave()
        } else if (rowData.categoryId == 'jsq') {
            Actions.Jsq()
        }
        else {
            alert('开发中，敬请期待')
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 50,
    },
    leftTitleIcon: {
        height: 14,
        width: 5,
        marginRight: 5
    },
});


