/**
 * 待签合同列表
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, BackHandler } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class UndeterminedContract extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
        }
        this.getContractList()
    }
    //获取合同列表
    getContractList() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中...'
        });
        var entity = {
            yfIdcard: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
            statu: 'YXF'
        }
        if (this.props.identity == 'boss') {
            return (
                null
            )
        } else {
            Fetch.postJson(Config.mainUrl + '/fqrzContract/viewPersonalContract', entity)
                .then((res) => {
                    Toast.dismiss();
                    console.log(res)
                    DeviceEventEmitter.emit('change1')
                    if (res.length > 0) {
                        this.setState({
                            result: res
                        })
                    } else {
                        this.setState({
                            ifzero: true
                        })
                    }
                })
                .catch((err) => {
                    Toast.showInfo('加载失败，请稍后重试', 3000)
                    Toast.dismiss();
                })
        }
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('yiqian', (text) => {
            this.getContractList()
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.subscription.remove();
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    componentWillReceiveProps(nextProps) {
        this.getContractList()
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>待签合同</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>待签合同</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} >
                    {this.showList()}
                </ScrollView>
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
                    style={{ borderRadius: 10 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />

            </View>)
        }

    }
    scan() {
        Actions.ScanCode();
    }
    _renderItem(rowData) {
        return (
            // <View>
            //     <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.UndeterminedContract1({ rowData: rowData })}>
            //         <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>

            //             <View style={{ flexDirection: 'row' }}>
            //                 <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', width: deviceWidth / 3 * 1.8 }}>{rowData.jobContent}</Text>
            //                 <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.money}</Text>
            //             </View>

            //             <View style={{ flexDirection: 'row', paddingTop: 15 }}>
            //                 <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey', marginRight: 5 }}>{rowData.jfEmployer}</Text>
            //                 <Text style={{ fontSize: Config.MainFontSize - 1, color: 'grey', position: 'absolute', right: 20, top: 15 }}>{(rowData.REMARK1 == 'FQRZ' ? '兼职' : rowData.REMARK1 == 'LWPQ' ? '抢单' : rowData.REMARK1 == 'LSYG' ? '合伙人' : rowData.REMARK1 == 'QRZ' ? '全日制' : null)} | {this.timeChange(rowData.updateTime)}</Text>
            //             </View>
            //             {/* <View style={{ width: 50, marginTop: 10, alignContent: 'center' }}>
            //                 <Text style={{ fontSize: Config.MainFontSize - 2, color: 'white', backgroundColor: 'red', fontWeight: 'bold', textAlign: 'center', padding: 3 }}>{(rowData.statu == 'YXF' ? '已下发' : rowData.statu == 'CN' ? '草拟' : rowData.statu == 'YXF' ? '已下发' : rowData.statu == 'YQD' ? '已签订' : rowData.statu == 'YBH' ? '已驳回' : rowData.statu == 'JDQ' ? '将到期' : rowData.statu == 'YGQ' ? '已过期' : null)}</Text>
            //             </View> */}
            //         </View>
            //     </TouchableOpacity>
            //     <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            // </View>
            <View >
                <TouchableOpacity style={{ backgroundColor: '#fff' }} onPress={() => Actions.UndeterminedContract1({ rowData: rowData })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 20, paddingTop: 10, paddingBottom: 10, width: deviceWidth - 20, height: 125 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', maxWidth: deviceWidth / 1.8, color: '#333' }}>{rowData.jobContent}</Text>

                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.money}</Text>

                        </View>
                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize + 1, position: 'absolute', bottom: 50, width: deviceWidth / 1.5, color: '#666' }}>{rowData.jfEmployer}</Text>
                        <View style={{ position: 'absolute', bottom: 10, flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {rowData.cityName == '' || rowData.cityName == undefined ? null :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 1, color: "#AAA" }}>{rowData.cityName + '/'}</Text>
                                        </View>
                                    }

                                    {rowData.areaName == '' || rowData.areaName == undefined ? null :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 1, color: "#AAA" }}>{rowData.areaName}</Text>
                                        </View>
                                    }
                                </View>
                                {rowData.REMARK1 == '' || rowData.REMARK1 == undefined ? null :
                                    <View style={{ display: "flex", flexDirection: "row", }}>
                                        {/* <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}> */}
                                        <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA', }}>{(rowData.REMARK1 == 'FQRZ' ? '兼职' : rowData.REMARK1 == 'LWPQ' ? '抢单' : rowData.REMARK1 == 'LSYG' ? '合伙人' : rowData.REMARK1 == 'CHYW' ? '撮合' : rowData.REMARK1 == 'QRZ' ? '全日制' : '')}</Text>
                                        {/* </View> */}
                                        {
                                            rowData.REMARK1 == "LSYG" || rowData.REMARK1 == 'CHYW' ?
                                                // <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA', marginLeft: 8 }}>{rowData.isNeedYyzz == "1" ? "不需要电子营业执照" : "需要电子营业执照"}</Text>
                                                // </View>
                                                : null
                                        }
                                    </View>
                                }
                            </View>
                        </View>
                        {rowData.createTime == '' || rowData.createTime == undefined ? null :
                            <View style={{ position: 'absolute', right: 20, bottom: 10, flexDirection: 'row' }}>
                                {/* <Text style={{ fontSize: Config.MainFontSize - 4 }}>发布时间：</Text> */}
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>{this.timeChange(rowData.updateTime)}</Text>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
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
