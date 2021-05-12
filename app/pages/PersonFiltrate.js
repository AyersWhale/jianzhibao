/**
 * 结算查询(企业)
 * Created by 曾一川 on 22/4/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class PersonFiltrate extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
        }
        this.getMySalary()
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
    getMySalary() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中...'
        });
        var url = Config.mainUrl + "/settleManagement/gethistory?creatorId=" + UserInfo.loginSet.result.rdata.loginUserInfo.userId;
        Fetch.getJson(url)
            .then((res) => {
                // debugger
                Toast.dismiss();
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

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 48, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Actions.RequireTicketPick()} style={{ marginTop: 48, position: 'absolute', right: 15, backgroundColor: 'transparent' }}>
                        <Text style={{ color: 'white' }}>申请开票</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>结算查询</Text>
                    </View>
                </ImageBackground>
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
    _renderItem(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.CountInform({ rowData: rowData })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>工作方式:{rowData.WORK_MODE}</Text>
                            {rowData.SETTLE_YEAR == '' || rowData.SETTLE_YEAR == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>结算年度:{rowData.SETTLE_YEAR} </Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                            {rowData.START_TIME == '' || rowData.START_TIME == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>开始时间:{this.timeChange(rowData.START_TIME)}</Text>
                                </View>
                            }

                            {rowData.END_TIME == '' || rowData.END_TIME == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>结束时间:{this.timeChange(rowData.END_TIME)}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>
                            {rowData.REMARK4 == '0' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 保险费</Text>
                            </View> : null}
                            {rowData.REMARK4 == '1' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 月中结算</Text>
                            </View> : null}
                            {rowData.REMARK4 == '2' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 月底结算</Text>
                            </View> : null}
                            {rowData.REMARK4 == '3' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 预付款结算</Text>
                            </View> : null}
                            {rowData.REMARK4 == '4' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 阶段结算款</Text>
                            </View> : null}
                            {rowData.REMARK4 == '5' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 尾款结算</Text>
                            </View> : null}
                            {rowData.REMARK4 == '6' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 费用代发</Text>
                            </View> : null}
                            {rowData.REMARK4 == '8' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 线下结算</Text>
                            </View> : null}
                            {rowData.REMARK4 == '9' ? <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>款项 : 服务费</Text>
                            </View> : null}
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>
                            {rowData.CREATE_TIME == '' || rowData.CREATE_TIME == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>创建时间:{this.timeChange(rowData.CREATE_TIME)}</Text>
                                </View>
                            }
                        </View>
                    </View>
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
    imgstyle: {
        height: theme.screenHeight / 3.5,
        width: theme.screenWidth,
    },

});
