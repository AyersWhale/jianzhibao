/**
 * 消息页
 * Created by 曾一川 on 05/11/18.
 */
import React, { Component } from 'react';
import { Text, View, Keyboard, DeviceEventEmitter, StyleSheet, ScrollView, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import px2dp from '../utils/px2dp';
import { Actions, VectorIcon, Fetch, Config, UserInfo, UUID } from 'c2-mobile';
import QySearch from './QySearch';
import { QySwiper } from 'qysyb-mobile';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';
import QySearch1 from './JianliSearch';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class HomeFragment extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            showPop: false,
            entry: 0,
            theme: '',
            resultList: [],
            resumeList: [],
            resultList1: [],
            ifzero: true,
            ifzero_search: false,
            unreadNum: '',
            showSearchList: false,
            unreadMessage: false,
            visibleReferees: false,
            listViewData_search: [],
            diqu: '选择地区',
            endData: '',
            identity: '',
            ifOpen: [{ open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true },
            { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true },],

        }
        this.getJobInform();
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
    componentWillReceiveProps() {
        Actions.pop({ refresh: { test: UUID.v4() } });
    }

    dataSource(result) {
        if (result != undefined) {
            if (result.length != 0 && result != "null") {
                this.setState({
                    listViewData_search: result,
                    showSearchList: true,
                    ifzero_search: false,
                    ifzero: false
                })
            } else if (result == '') {
                this.setState({
                    showSearchList: false,
                    ifzero_search: false,
                    ifzero: true

                })
            }
            else if (result == 'null') {
                this.setState({
                    showSearchList: false,
                    ifzero_search: true,
                    ifzero: true
                })
            }
        }

    }

    //获取职位列表
    getJobInform() {
        var entity = {
            workMode: null,
            workYears: "BX",
            educationRequire: "BX",
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            positionProvinceName: "QG",
            positionKind: "BX",
            positionCityName: null,
            positionAreaName: null,
            keyWord: null,
        }
        let url = Config.mainUrl + '/positionManagement/getPositionByPersonnelIntent?rows=10&page=1&sidx=&sord=&cond=' + encodeURI(JSON.stringify(entity))
        Fetch.getJson(url)
            .then((res) => {
                // debugger
                if (res.contents.length == 0) {
                    this.setState({
                        ifzero: true
                    })
                }
                this.setState({
                    resultList1: res.contents,
                })
            })
    }


    render() {
        return (
            <ScrollView style={{ backgroundColor: '#E8E8E8', flex: 1 }} onPress={() => { Keyboard.dismiss() }}>
                <View style={{ height: theme.screenHeight / 12, }}>
                    <View style={{ height: 35, position: 'absolute', flex: 1, flexDirection: 'row', left: 10, top: 20, width: theme.screenWidth, backgroundColor: 'transparent' }}>
                        <View style={{ width: theme.screenWidth - 20, backgroundColor: 'transparent' }}>
                            <QySearch rowData={this.state.resultList1} //搜索的数据源
                                searchResult={(result) => this.dataSource(result)}  //搜索成功后返回的数据，如何处理需自己处理
                                theme={1}
                                autoFocus={true}
                                values={"COMPANY"}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', marginBottom: 15, width: deviceWidth - 10, alignSelf: 'center' }}>
                    {this.showList()}
                </View>
            </ScrollView>
        );
    }

    showList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - deviceHeight / 12, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无搜索结果，换一个试试～</Text>
                </View>
            )
        } else {
            return (
                <ListView
                    style={styles.listView}
                    enableEmptySections={true}
                    dataSource={this.ds.cloneWithRows(this.state.listViewData_search)}
                    renderRow={this._renderItem.bind(this)}
                />
            )
        }
    }


    _renderItem(rowData, index, i) {
        // if (rowData.POSITION_STATUS == 'FB') {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => Actions.JobInform({ rowData: rowData, onblock: this.getJobInform.bind(this) })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', maxWidth: deviceWidth / 1.8 }} numberOfLines={1}>{rowData.POSITION_NAME}</Text>
                            {rowData.status == false ? null :
                                <View style={{ marginLeft: 10, backgroundColor: '#EE2C2C', alignItems: 'center', borderRadius: 5, height: 18, width: 44 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已投递</Text>
                                </View>
                            }
                            {/* {rowData.SALARY_RANGE == '' || rowData.SALARY_RANGE == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY_RANGE == '面议' || rowData.SALARY_RANGE == '不限') ? rowData.SALARY_RANGE : rowData.SALARY_RANGE + "元/月"} </Text>
                            }
                            {rowData.HOUR_SALARY == '' || rowData.HOUR_SALARY == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.HOUR_SALARY}{rowData.WORK_MODE == '兼职' ? '元/小时' : rowData.HOUR_SALARY == '不限' ? '' : rowData.HOUR_SALARY == '面议' ? '' : '元/月'}</Text>
                            } */}
                            {rowData.WORK_MODE == '合伙人' && (rowData.SALARY != '' && rowData.SALARY != undefined) ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY == '面议' || rowData.SALARY == '不限') ? rowData.SALARY : rowData.SALARY + "元"} </Text> : null}
                            {(rowData.SALARY_RANGE !== '' && rowData.SALARY_RANGE !== undefined) && rowData.WORK_MODE == '抢单' ? <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY_RANGE == '面议' || rowData.SALARY_RANGE == '不限') ? rowData.SALARY_RANGE : rowData.SALARY_RANGE + "元/月"} </Text> : null}
                            {(rowData.SALARY !== '' && rowData.SALARY !== undefined) && rowData.WORK_MODE == '兼职' ? <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.SALARY}元/小时</Text> : null}
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                            {rowData.AGE_REQUIRE == '' || rowData.AGE_REQUIRE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.AGE_REQUIRE}</Text>
                                </View>
                            }
                            {rowData.EDUCATION_REQUIRE == '' || rowData.EDUCATION_REQUIRE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{rowData.EDUCATION_REQUIRE}</Text>
                                </View>
                            }
                            {rowData.WORK_MODE == '' || rowData.WORK_MODE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData.WORK_MODE}</Text>
                                </View>
                            }
                            {rowData.WORK_YEARS == '' || rowData.WORK_YEARS == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.WORK_YEARS}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>

                            {rowData.POSITION_KIND == '' || rowData.POSITION_KIND == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData.POSITION_KIND}</Text>
                                </View>
                            }
                            {rowData.RECRUIT_NUMBER == '' || rowData.RECRUIT_NUMBER == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>招聘人数:{rowData.RECRUIT_NUMBER}人</Text>
                                </View>
                            }
                            {rowData.WORK_DAY == '' || rowData.WORK_DAY == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>工时:{rowData.WORK_DAY}小时/天</Text>
                                </View>
                            }
                        </View>
                        {rowData.REMARK == '' || rowData.REMARK == undefined ? null :
                            <View style={{ flexDirection: 'row', marginTop: 10, width: deviceWidth / 1.3, marginBottom: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>备注：</Text>
                                {(this.state.ifOpen[i].open) ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }} numberOfLines={2}>{rowData.REMARK}</Text> : <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }} >{rowData.REMARK}</Text>}

                            </View>}
                        <View style={{ height: 20, width: deviceWidth }} />

                        {rowData.CREATE_TIME == '' || rowData.CREATE_TIME == undefined ? null :
                            <View style={{ position: 'absolute', right: 30, bottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, marginTop: 1 }}>发布时间：</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 4 }}>{this.timeChange(rowData.CREATE_TIME)}</Text>
                            </View>
                        }
                        <View style={{ position: 'absolute', bottom: 30, flexDirection: 'row' }}>
                            {rowData.POSITION_PROVINCE_NAME == '' || rowData.POSITION_PROVINCE_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 5 }}>{rowData.POSITION_CITY_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 5 }}>{rowData.POSITION_AREA_NAME}</Text>
                                </View>
                            }</View>

                        <Text style={{ fontSize: Config.MainFontSize - 3, position: 'absolute', bottom: 10, maxWidth: deviceWidth / 2 }}>{rowData.COMPANY_NAME}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
        )

        // } 
        // else {
        //     return null
        // }
    }

    showDetail(i) {
        this.state.ifOpen[i].open = !this.state.ifOpen[i].open;
        this.setState({ ifOpen: this.state.ifOpen })
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
