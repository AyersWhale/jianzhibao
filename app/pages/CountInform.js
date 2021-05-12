/**
 * 结算详情
 * Created by 曾一川 on 29/1/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class CountInform extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            REMARK4: this.props.rowData.REMARK4,
            accuntInfo: {}
        }
        this.getMySalary()
        this.getAccount()
    }
    getAccount() {
        var url = Config.mainUrl + "/accountManagePt/" + this.props.rowData.accountId;
        Fetch.getJson(url)
            .then((res) => {
                //debugger
                this.setState({
                    accuntInfo: JSON.parse(JSON.stringify(res))
                })
            })
    }
    getMySalary() {
        if (this.state.REMARK4 == '3' || this.state.REMARK4 == '9') {
            // var conds1 = {
            //     //这里传参数
            //     settleId: this.props.rowData.id,
            //     workType: this.props.rowData.workMode
            // };
            var url = Config.mainUrl + "/settleManagement/getypaysettleById?id=" + this.props.rowData.id;
            Fetch.getJson(url)
                .then((res) => {
                    //debugger
                    if (res.length == 0) {
                        this.setState({
                            ifzero: true
                        })
                    } else {
                        this.setState({
                            result: res,
                            ifzero: false
                        })
                    }
                })
        } else {
            var conds1 = {
                //这里传参数
                settleId: this.props.rowData.id,
                workType: this.props.rowData.workMode
            };
            var url = Config.mainUrl + "/settleManagement/getSettleDetail?&cond=" + escape(JSON.stringify(conds1));
            Fetch.getJson(url)
                .then((res) => {
                    console.log(res)
                    if (res.length == 0) {
                        this.setState({
                            ifzero: true
                        })
                    } else {
                        this.setState({
                            result: res,
                            ifzero: false
                        })
                    }
                })
        }

    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>结算详情</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>结算详情</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} scrollIndicatorInsets={{ right: 1 }}>
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
    renderAccount() {
        let accuntInfo = this.state.accuntInfo
        if (accuntInfo.accountName !== undefined) {
            return (
                <View style={{ marginLeft: 10, marginBottom: 10 }}>
                    <Text style={{ color: "#da544f" }}>请在{accuntInfo.tothedate}内按照以下要求将金额打入到账号上</Text>
                    <Text>账号名称：{accuntInfo.accountName}</Text>
                    <Text>账号：{accuntInfo.accountNo}</Text>
                    <Text>开户行：{accuntInfo.openBank}</Text>
                </View>
            )
        }
    }
    _renderItem(rowData) {
        if (this.state.REMARK4 == '3') {
            return (
                <View>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }}>
                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold', }}>包名 {rowData.POSITION_NAME}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 40 }}>结算年度 {rowData.SETTLE_YEAR}</Text>
                            </View>
                            <View style={{ paddingTop: 25 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2 }}>预付金额: {rowData.HEJI}</Text>
                            </View>
                            <View style={{ paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginTop: 10 }}>公司名称 {rowData.TRUE_EMPLOYER}</Text>
                            </View>

                        </View>
                    </View>
                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                </View>
            )
        } else if (this.state.REMARK4 == '9') {
            return (
                <View>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }}>
                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>包名  {rowData.POSITION_NAME}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>公司名称  {rowData.TRUE_EMPLOYER}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>结算年度  {rowData.SETTLE_YEAR} 年</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>甲方  {rowData.TRUE_EMPLOYER}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>乙方  {rowData.EMPLOYEE_NAME}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 1 }}>收取服务费  {(rowData.servicemoney == 'null' || rowData.servicemoney == undefined) ? '无' : rowData.servicemoney} 元</Text>
                        </View>
                        {this.renderAccount()}
                    </View>
                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }}>
                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                            <View>
                                <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold', }}>{rowData.EMPLOYEE_NAME}  包名:{rowData.POSITION_NAME}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2, }}>应发费用:{rowData.GROSS_PAY}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 2 }}>实发费用:{rowData.SUMMERY}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey' }}>扣除费用:{rowData.DEDUCT_COST}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', marginLeft: 10 }}>补贴费用:{rowData.SYBSIDY_COST}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey' }}>个税:{rowData.DEDUCTIBLE_FEE}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', marginLeft: 10 }}>个人保险:{rowData.DEDUCTIBLE_INSURANCE_PERSON}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', marginLeft: 10 }}>个人公积金:{rowData.DEDUCTIBLE_PREVIDENT_PERSON}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey' }}>企业保险:{rowData.DEDUCTIBLE_INSURANCE_COMPANY}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: 'grey', marginLeft: 10 }}>企业公积金:{rowData.DEDUCTIBLE_PREVIDENT_COMPANY}</Text>
                                </View>
                            </View>
                            {/* <View style={{ flexDirection: 'row', marginTop: 20,marginBottom:5 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, position: 'absolute', right: 20 }}>创建时间:{this.timeChange(rowData.CREATE_TIME)}</Text>
                        </View> */}
                        </View>
                    </View>
                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                </View>
            )
        }


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
