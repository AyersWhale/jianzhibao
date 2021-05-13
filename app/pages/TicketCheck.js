/**
 * 开票记录
 * Created by 曾一川 on 22/4/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class TicketCheck extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
        }
        this.getMySalary()
    }

    getMySalary() {
        var url = Config.mainUrl + "/settleManagement/getSettleforOinvoice?rows=100&page=1&sidx=" + "" + "&sord=" + "" + "&cond=" + "";
        Fetch.getJson(url)
            .then((res) => {
                console.log(res)
                if (res.contents.length > 0) {
                    this.setState({
                        result: res.contents
                    })
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 48, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>开票记录</Text>
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
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem.bind(this)}
                />

            </View>)
        }

    }
    _renderItem(rowData) {
        return (
            <View>
                <View style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>工作方式:{rowData.workMode == 'LSYG' ? '临时用工' : null}</Text>
                            {rowData.settleYear == '' || rowData.settleYear == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>结算年度:{rowData.settleYear} </Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                            {rowData.remark4 == '' || rowData.remark4 == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>结算方式:{rowData.remark4 == '1' ? '月中结算' : rowData.remark4 == '2' ? '月底结算' : rowData.remark4 == '3' ? '预付款结算' : rowData.remark4 == '4' ? '阶段结算款' : rowData.remark4 == '5' ? '尾款结算' : rowData.remark4 == '6' ? '费用代发' : null}</Text>
                                </View>
                            }

                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>金额(元):{rowData.total == undefined ? '0' : rowData.total}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>
                            {rowData.createTime == '' || rowData.createTime == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>创建时间:{rowData.createTime}</Text>
                                </View>
                            }
                        </View>
                    </View>
                </View>
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
