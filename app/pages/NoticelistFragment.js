/**
 * 开发人员: 曾一川
 * 模块或者功能：通知公告
 */
'use strict';
import React from 'react';
import { Image, Text, Dimensions, View, StyleSheet, TouchableOpacity, ScrollView, Platform, ListView, ImageBackground, DeviceEventEmitter, BackHandler } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import PageComponent from '../pages/BackPageComponent';
import Colors from '../pages/contactList/Colors';
import underLiner from '../utils/underLiner';
import TimeChange from '../utils/TimeChange';
import { Toast, NavigationBar, Actions, Config, Fetch, SafeArea, VectorIcon, UUID } from 'c2-mobile';
import { QySearch, QySwipeListView } from 'qysyb-mobile';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class NoticelistFragment extends PageComponent {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataBlob: [],
            ifzero: false,
            unreadMessage: false,
        }
        this._loadMoreData()
    }


    _loadMoreData() {
        //Http请求
        Fetch.getJson(Config.mainUrl + '/messageAll/getMessageList')
            .then((res) => {
                console.log(res)
                if (res.length > 0) {
                    this.setState({
                        dataBlob: res
                    })
                    for (let i in res) {
                        if (res[i].is_open == "0") {
                            this.setState({
                                unreadMessage: true,
                            })
                            return
                        } else {
                            this.setState({
                                unreadMessage: false,
                            })
                        }
                    }
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }

    _itemClickCallback(rowData) {
        Actions.MessageDetails({ id: rowData.id_, onblock: this._loadMoreData.bind(this) })
    }
    componentWillReceiveProps(nextProps) {
        this._loadMoreData()
    }
    _back() {
        this.props.navigation.navigate('A');
        // 这里的param可以写可以不写自己需要带参数就可以写
        var param = this.state.unreadMessage
        DeviceEventEmitter.emit("unreadMessage", param);
        DeviceEventEmitter.emit('change2')
        Actions.pop();
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
            <View style={{ flex: 1, width: deviceWidth, backgroundColor: '#E1E1E1', height: deviceHeight }}  >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => this._back()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>消息</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>消息</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E1E1E1', paddingBottom: (Platform.OS == 'ios') ? 10 : 15 }}>
                    {/* <View style={{ height: 50, backgroundColor: 'transparent' }}>
                        <QySearch rowData={this.state.dataBlob} //搜索的数据源
                            searchResult={(result) => this.dataSource(result)}  //搜索成功后返回的数据，如何处理需自己处理
                            values={"title"}  //搜索的字段，多个字段在values1={'**'}  valuse2={'**'}
                        />
                    </View> */}
                    <ScrollView style={{ backgroundColor: '#E1E1E1', marginBottom: 70, marginTop: 10 }}>
                        {this.dataBlobList()}
                    </ScrollView>
                </ScrollView >
            </View>
        )
    }
    dataSource(result) {
        if (result.length != 0 && result != "null") {
            this.setState({
                dataBlob: result,
                ifzero: false
            })
        } else if (result == '') {
            this.setState({
                ifzero: false
            })
        }
        else if (result == "null") {
            this.setState({
                ifzero: true
            })
        }
    }
    dataBlobList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - 40, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>无消息记录</Text>
                </View>
            )
        } else {
            return (
                <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                    <ListView
                        style={styles.listView}
                        enableEmptySections={true}
                        dataSource={this.ds.cloneWithRows(this.state.dataBlob)}
                        renderRow={this._renderItem.bind(this)}
                    />
                </View>
            )

        }
    }
    _renderItem(rowData) {
        return (
            <View style={{ paddingBottom: 5 }}>
                <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{TimeChange.timeChange(rowData.arrival)}</Text>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={this._itemClickCallback.bind(this, rowData)}>
                    <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
                        <View style={{ width: theme.screenWidth - 30, backgroundColor: 'white', marginTop: 10, borderRadius: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: rowData.is_open == 0 ? 'red' : 'white', width: 8, height: 8, borderRadius: 10, marginLeft: 5, marginTop: 14 }} />
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: 'black', marginLeft: 5, paddingTop: 10, paddingRight: 10, paddingBottom: 10, marginRight: 15, maxWidth: theme.screenWidth - 80, borderRadius: 20 }}>{rowData.title}</Text>
                            </View>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, padding: 10, marginRight: 15, maxWidth: theme.screenWidth - 80, borderRadius: 20 }}>{rowData.content}</Text>
                            <View style={{ padding: 20, alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize - 3, color: 'white', backgroundColor: '#3396FB', position: 'absolute', left: 20, padding: 3 }}>{rowData.from_}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', position: 'absolute', right: 15 }}>{this.timeChange(rowData.arrival)}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    timeChange(value) {
        var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m;
    }
    onLeftBack() {
        Actions.pop();
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.mainBackground,
    },
    item: {
        flexDirection: 'row',
        width: theme.screenWidth,
        backgroundColor: '#fff',
        paddingHorizontal: px2dp(15),
        paddingTop: px2dp(15),
        paddingBottom: px2dp(5),
    },
    content: {
        color: '#000',
        fontSize: px2dp(15),
    },

    content1: {
        fontSize: 13,
        color: '#999',
        width: 300
    },
    content2: {
        color: '#000',
        fontSize: 13,
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
});