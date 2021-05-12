/**
 * 职位发布
 * Created by 曾一川 on 17/04/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Alert, DeviceEventEmitter, BackHandler } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class PublicPosition extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
        }
        this.getJobPublicList()
    }
    getJobPublicList() {
        var conds1 = {
            //这里传参数
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        };
        var url = Config.mainUrl + "/positionManagement/getAllPositionManagementPC?rows=100&page=1&type=1&cond=" + escape(JSON.stringify(conds1));
        Fetch.getJson(url)
            .then((res) => {
                console.log(res)
                if (res.contents.length == 0) {
                    this.setState({
                        ifzero: true
                    })
                } else {
                    this.setState({
                        ifzero: false
                    })
                }
                this.setState({
                    result: res.contents,
                })
            })
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('public', (text) => {
            this.getJobPublicList()
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.subscription.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>职位发布</Text>
                    </View>
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' ?
                        <TouchableOpacity onPress={() => Toast.showInfo('请去电脑端完善企业信息', 1000)} style={{ marginTop: 38, right: 20, position: 'absolute' }}>
                            <VectorIcon name={"add"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => Actions.AddNewJob({ onblock: this.getJobPublicList.bind(this) })} style={{ marginTop: 38, right: 20, position: 'absolute' }}>
                            <VectorIcon name={"add"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity>}
                    {/* <TouchableOpacity onPress={() => Actions.AddNewJob({ onblock: this.getJobPublicList.bind(this) })} style={{ marginTop: 38, right: 20, position: 'absolute' }}>
                        <VectorIcon name={"add"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity> */}
                </ImageBackground>

                <ScrollView style={{ backgroundColor: '#E8E8E8' }} >
                    {this.showList()}
                </ScrollView>
                <View>
                    {UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false' ? <TouchableOpacity style={{
                        width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgb(22,131,251)',
                        position: 'absolute', bottom: 30, elevation: 4, right: 25, justifyContent: 'center', alignItems: 'center'
                    }} onPress={() => Toast.showInfo('请去电脑端完善企业信息', 1000)}>
                        <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>+</Text>
                    </TouchableOpacity> :
                        <TouchableOpacity style={{
                            width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgb(22,131,251)',
                            position: 'absolute', bottom: 30, elevation: 4, right: 25, justifyContent: 'center', alignItems: 'center'
                        }} onPress={() => Actions.AddNewJob({ onblock: this.getJobPublicList.bind(this) })}>
                            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>+</Text>
                        </TouchableOpacity>}
                </View>
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

    _renderItem(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.PublicPositionInform({ rowData: rowData, onblock: this.getJobPublicList.bind(this) })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 3 * 2 }}>{rowData.positionName}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.positionStatus == 'FB' ? '已发布' : rowData.positionStatus == 'CN' ? '草拟' : rowData.positionStatus == 'TZ' ? '已停止' : null}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{(rowData.workMode == 'FQRZ' ? '兼职' : rowData.workMode == 'LWPQ' ? '抢单' : rowData.workMode == 'LSYG' ? '合伙人' : rowData.workMode == 'QRZ' ? '全日制' : null)}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 20, top: 15 }}>创建时间:{this.timeChange(rowData.creatorTime)}</Text>
                        </View>
                    </View>
                    {rowData.positionStatus != 'FB' ?
                        <TouchableOpacity style={{ backgroundColor: 'transparent', marginBottom: 10, marginTop: 10 }} onPress={() => {
                            Alert.alert("提示", "确定发布职位吗？"
                                , [
                                    {
                                        text: "取消", onPress: () => {
                                            return
                                        }
                                    },
                                    {
                                        text: "确定", onPress: () => {
                                            Fetch.getJson(Config.mainUrl + '/positionManagement/updatePositionStatusList?ids=' + rowData.id)
                                                .then((res) => {
                                                    console.log(res)
                                                    Toast.showInfo('发布成功', 1000)
                                                    this.getJobPublicList()
                                                })
                                        }
                                    }

                                ])

                        }}>
                            <View style={{ padding: 3, backgroundColor: 'rgb(22,131,251)', alignItems: 'center', width: 100, borderRadius: 5, position: 'absolute', right: 20, bottom: 1 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: Config.MainFontSize - 2 }}>点击发布职位</Text>
                            </View>
                        </TouchableOpacity> :
                        rowData.positionStatus == 'FB' ?
                            <TouchableOpacity style={{ backgroundColor: 'transparent', marginBottom: 10, marginTop: 10 }} onPress={() => {
                                Alert.alert("提示", "确定停止吗？"
                                    , [
                                        {
                                            text: "取消", onPress: () => {
                                                return
                                            }
                                        },
                                        {
                                            text: "确定", onPress: () => {
                                                var entity = {
                                                    id: rowData.id,
                                                    positionStatus: 'TZ'
                                                }
                                                Fetch.postJson(Config.mainUrl + '/positionManagement/updatePositionStatus', entity)
                                                    .then((res) => {
                                                        console.log(res)
                                                        Toast.showInfo('停止成功', 1000)
                                                        this.getJobPublicList()
                                                    })
                                            }
                                        }

                                    ])

                            }}>
                                <View style={{ padding: 3, backgroundColor: '#EE2C2C', alignItems: 'center', width: 100, borderRadius: 5, position: 'absolute', right: 20, bottom: 1 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: Config.MainFontSize - 2 }}>点击停止职位</Text>
                                </View>
                            </TouchableOpacity> : null}

                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
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
});
