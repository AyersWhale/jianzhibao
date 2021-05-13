/**
 * 我的申请
 * Created by 曾一川 on 06/12/18.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Fetch, UserInfo, Actions, VectorIcon, Config, SafeArea, Toast } from 'c2-mobile';
import theme from '../config/theme';
import TimeChang from '../utils/TimeChange';
import { workTypeByValue } from '../utils/common/businessUtil'
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class MyApplicate extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            listViewData: [],
            ifzero: false,
        }
        this.getMyApplicationList();
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
    getMyApplicationList() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中...'
        });
        Fetch.postJson(Config.mainUrl + '/delivery/viewWorkList', UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                console.log(res)
                Toast.dismiss();
                if (res.length > 0) {
                    this.setState({
                        listViewData: res
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
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>我的申请</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>我的申请</Text>
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
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前申请为空～</Text>
                </View>
            )
        } else {
            return (
                <View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                    <ListView
                        style={{ borderRadius: 10 }}
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        enableEmptySections={true}
                        renderRow={this._renderItem.bind(this)}
                    />
                </View>
            )
        }
    }
    scan() {
        Actions.ScanCode();
    }
    onclick(rowData) {
        Actions.JobInform({
            toudi: true,
            rowData: {
                ID: rowData.positionId,
                type: 'MyApplicate',
                workMode: workTypeByValue(rowData.workMode),
                WORK_MODE: rowData.workMode
            }
        })
        // if (rowData.workMode == '合伙人') {
        //     Actions.JobInform({
        //         toudi: true,
        //         rowData: {
        //             ID: rowData.positionId,
        //             type: 'MyApplicate',
        //             workMode: 'LSYG',
        //             POSITION_NAME: rowData.positonName
        //         },
        //     })
        // } else {
        //     Actions.JobInform({
        //         toudi: true,
        //         rowData: {
        //             ID: rowData.positionId,
        //             type: 'MyApplicate',
        //             workMode: 'FQRZ'
        //         }
        //     })
        // }
    }
    _renderItem(rowData) {
        // if (rowData.workMode == '合伙人') {
        return (
            <View >
                <TouchableOpacity style={{ backgroundColor: '#fff' }} onPress={() => this.onclick(rowData)}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 20, paddingTop: 10, paddingBottom: 10, width: deviceWidth - 20, height: 120, }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', maxWidth: deviceWidth / 1.8, color: '#333' }}>{rowData.positonName}</Text>
                            {rowData.workMode == '合伙人' ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange}元</Text> : null}
                            {rowData.workMode == '抢单' ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange}{rowData.salaryRange == '不限' || rowData.salaryRange == '面议' ? null : '元/月'}</Text> : null}
                            {rowData.workMode == '兼职' ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.hourSalary}元/小时</Text> : null}
                            {/* <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange == '' || rowData.salaryRange == undefined ? rowData.hourSalary : rowData.salaryRange}{rowData.workMode == '兼职' ? '元/小时' : rowData.workMode == '合伙人' ? '元' : rowData.hourSalary == '不限' ? '' : rowData.salaryRange != '' ? '元/月' : rowData.salaryRange == '不限' ? '' : rowData.hourSalary == '面议' ? '' : rowData.salaryRange == '面议' ? '' : rowData.hourSalary == '' ? '' : '元/月'}</Text> */}
                            {rowData.workMode == '撮合' ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange}元</Text> : null}
                        </View>
                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize + 1, position: 'absolute', bottom: 50, width: deviceWidth / 1.5, color: '#666' }}>{rowData.companyName}</Text>
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
                                {rowData.workMode == '' || rowData.workMode == undefined ? null :
                                    <View style={{ display: "flex", flexDirection: "row", }}>
                                        {/* <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}> */}
                                        <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>{rowData.workMode}</Text>
                                        {/* </View> */}
                                        {
                                            rowData.workMode == "合伙人" || rowData.workMode == "撮合" ?
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
                            <View style={{ position: 'absolute', right: 10, bottom: 10, flexDirection: 'row' }}>
                                {/* <Text style={{ fontSize: Config.MainFontSize - 4 }}>发布时间：</Text> */}
                                <Text style={{ fontSize: Config.MainFontSize - 1, color: '#AAA' }}>{TimeChang.timeChange(rowData.createTime)}</Text>
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
        )
        // } 
        // else {
        //     return (
        //         <View>
        //             <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.JobInform({ toudi: true, rowData: { ID: rowData.positionId, type: 'MyApplicate', workMode: 'FQRZ' } })}>
        //                 <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
        //                     <View style={{ flexDirection: 'row' }}>
        //                         <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 3 * 2, color: 'rgb(65,143,234)' }}>{rowData.positonName}</Text>
        //                         {/* {rowData.workMode == '合伙人' ?
        //                             <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange}元</Text> : null} */}
        //                         {rowData.workMode == '抢单' ?
        //                             <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange}{rowData.salaryRange == '不限' || rowData.salaryRange == '面议' ? null : '元/月'}</Text> : null}
        //                         {rowData.workMode == '兼职' ?
        //                             <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.hourSalary}元/小时</Text> : null}
        //                         {/* <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRange == '' || rowData.salaryRange == undefined ? rowData.hourSalary : rowData.salaryRange}{rowData.workMode == '兼职' ? '元/小时' : rowData.workMode == '合伙人' ? '元' : rowData.hourSalary == '不限' ? '' : rowData.salaryRange != '' ? '元/月' : rowData.salaryRange == '不限' ? '' : rowData.hourSalary == '面议' ? '' : rowData.salaryRange == '面议' ? '' : rowData.hourSalary == '' ? '' : '元/月'}</Text> */}
        //                     </View>
        //                     <View style={{ paddingTop: 10 }}>
        //                         {/* <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 10 }}>{rowData.companyName}</Text> */}
        //                     </View>
        //                     <View style={{ flexDirection: 'row', paddingTop: 5 }}>
        //                         <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{rowData.workMode}</Text>
        //                         {/* <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 10 }}>{rowData.recruitNumber}</Text> */}
        //                         <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 20, top: 5 }}>{TimeChang.timeChange(rowData.createTime)}</Text>
        //                     </View>
        //                 </View>
        //             </TouchableOpacity>
        //             <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
        //         </View>
        //     )
        // }

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
