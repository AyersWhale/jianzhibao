/**
 * 应聘简历
 * Created by 曾一川 on 17/04/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, BackHandler } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import QySearch from './JianliSearch';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class ResumeSearch extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            resumeList: [],
            ifzero: false,
            listViewData_search: [],
            showSearchList: false,
            ifzero_search: false,
        }
        this.getResumeList()
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
    getResumeList() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中...'
        });
        var url = Config.mainUrl + "/positionManagement/getYpjl?creatorId=" + UserInfo.loginSet.result.rdata.loginUserInfo.userId;
        Fetch.getJson(url)
            .then((res) => {
                // debugger
                Toast.dismiss();
                console.log(res)
                if (res.length > 0) {
                    this.setState({
                        resumeList: res
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
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>应聘简历</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>应聘简历</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: 'white' }} >
                    {this.showList()}
                </ScrollView>
            </View>
        );
    }

    showList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight / 2 - 60, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无简历～</Text>
                </View>
            )
        } else {
            return (
                this.state.showSearchList ?
                    <View >
                        <ListView
                            style={styles.listView}
                            enableEmptySections={true}
                            dataSource={this.ds.cloneWithRows(this.state.listViewData_search)}
                            renderRow={this._renderItemResume.bind(this)}
                        />
                    </View >
                    : this.state.ifzero_search ?
                        <View style={{ height: deviceHeight / 2 - 60, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                            <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无搜索结果～</Text>
                        </View>
                        :
                        <ListView
                            style={styles.listView}
                            enableEmptySections={true}
                            dataSource={this.ds.cloneWithRows(this.state.resumeList)}
                            renderRow={this._renderItemResume.bind(this)}
                        />

            )
        }
    }

    _renderItemResume(rowData, i) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => Actions.YingpinResumeInform({ rowData: rowData })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 1.5 }}>{rowData.POSITION_NAME}</Text>
                            {rowData.XZFW == '' || rowData.XZFW == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.XZFW} </Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>

                            {rowData.POSITION_KIND == '' || rowData.POSITION_KIND == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>{rowData.POSITION_KIND}</Text>
                                </View>
                            }
                            {rowData.EDUCATION_REQUIRE == '' || rowData.EDUCATION_REQUIRE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{rowData.EDUCATION_REQUIRE}</Text>
                                </View>
                            }
                            {rowData.AGE_REQUIRE == '' || rowData.AGE_REQUIRE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.AGE_REQUIRE}</Text>
                                </View>
                            }
                            {rowData.WORK_YEARS == '' || rowData.WORK_YEARS == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.WORK_YEARS}</Text>
                                </View>
                            }
                        </View>

                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>应聘者姓名:{rowData.PERSON_NAME}</Text>

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
