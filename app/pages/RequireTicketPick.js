/**
 * 结算查询
 * Created by 曾一川 on 22/4/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Toast, Fetch } from 'c2-mobile';
import theme from '../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class RequireTicketPick extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: true,
            ifChoose: [{ choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },],
            ifChoose_false: [{ choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },
            { choose: false }, { choose: false }, { choose: false }, { choose: false }, { choose: false },],
            ifChoose_true: [{ choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },
            { choose: true }, { choose: true }, { choose: true }, { choose: true }, { choose: true },],

            ifmanyChoice: true,
            ifAll: false,
        }
        this.getMySalary()
    }
    componentWillReceiveProps(nextProps) {
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
        var url = Config.mainUrl + "/settleManagement/getSettleforOinvoice?rows=100&page=1&sidx=" + "" + "&sord=" + "" + "&cond=" + "";
        Fetch.getJson(url)
            .then((res) => {
                console.log(res)
                Toast.dismiss();
                if (res.contents.length > 0) {
                    this.setState({
                        result: res.contents,
                        ifzero: false
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
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 48, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>按已结算开票</Text>
                    </View>
 
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>按已结算开票</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} >
                    {this.showList()}
                </ScrollView>
                {(this.state.ifzero == true) ? null :
                    <View style={{ height: 60, backgroundColor: 'white', width: deviceWidth, position: 'absolute', bottom: 0, alignItems: 'center', flexDirection: 'row' }}>
                        {(this.state.ifAll) ? <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 20 }} onPress={this.chooseAll.bind(this)}>
                            <VectorIcon name={"c2_im_check_circle_solid"} size={20} color={'red'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity> : <TouchableOpacity style={{ height: 20, width: 20, marginLeft: 20 }} onPress={this.chooseAll.bind(this)}>
                                <VectorIcon name={"c2_im_select_circle"} size={20} color={'red'} style={{ backgroundColor: 'transparent' }} />
                            </TouchableOpacity>}
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.chooseAll.bind(this)}>
                            <Text>全选</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: 120, height: 40, position: 'absolute', right: 20, borderRadius: 5 }} onPress={this.uploadData.bind(this)}><Text style={{ color: 'white', height: 40, textAlign: "center", textAlignVertical: "center" }}>提 交</Text></TouchableOpacity>
                    </View>}
            </View>
        );
    }
    chooseAll() {
        if (this.state.ifAll == false) {
            this.setState({ ifChoose: this.state.ifChoose_true })
        } else {
            this.setState({ ifChoose: this.state.ifChoose_false })
        }
        this.setState({ ifAll: !this.state.ifAll })
    }
    uploadData() {
        var ifChoose = this.state.ifChoose;
        var result = this.state.result;
        var temp = [];
        var total = 0;
        var total_fuwu = 0;
        var serviceMoney = 0
        for (let i in ifChoose) {
            if (ifChoose[i].choose) {
                if (i < this.state.result.length) {
                    if (result[i].total == undefined) {
                    } else {
                        total = total + result[i].total;
                        serviceMoney = serviceMoney + result[i].serviceMoney;
                        temp.push(result[i])
                    }
                }
            }
        } if (total == 0) {
            Toast.showInfo('选取数或开票总额不能为0', 1000)
        } else {
            Actions.RequireTicket_new({ dataList: result, rowBack: temp, total: total, money: total - serviceMoney, serviceMoney: serviceMoney })
            // Actions.RequireTicket({ rowBack: temp, total: total, money: total - serviceMoney , serviceMoney: serviceMoney})
        }

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
                />
                <View style={{ height: deviceHeight / 5, width: deviceWidth, backgroundColor: '#E8E8E8' }} />
            </View>)
        }

    }
    itemClick(rowData, index) {
        this.state.ifChoose[index].choose = !this.state.ifChoose[index].choose
        this.setState({
            ifChoose: this.state.ifChoose
        })
    }
    _renderItem(rowData, dd, index) {
        if (this.state.ifmanyChoice) {
            return (
                <TouchableOpacity onPress={this.itemClick.bind(this, rowData, index)}>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }}>
                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                            {(this.state.ifChoose[index].choose) ? <View style={{ position: 'absolute', top: 40, left: 2 }}>
                                <VectorIcon name={"c2_im_check_circle_solid"} size={20} color={'red'} style={{ backgroundColor: 'transparent' }} />
                            </View> : <View style={{ position: 'absolute', top: 40, left: 2 }}>
                                    <VectorIcon name={"c2_im_select_circle"} size={20} color={'red'} style={{ backgroundColor: 'transparent' }} />
                                </View>}
                            <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>工作方式:{rowData.workMode == 'LSYG' ? '合伙人' : '  --'}</Text>
                                {rowData.settleYear == '' || rowData.settleYear == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>结算年度:{rowData.settleYear} </Text>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth, marginLeft: 30 }}>
                                {rowData.remark4 == '' || rowData.remark4 == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>结算方式:{rowData.remark4 == '1' ? '月中结算' : rowData.remark4 == '2' ? '月底结算' : rowData.remark4 == '3' ? '预付款结算' : rowData.remark4 == '4' ? '阶段结算款' : rowData.remark4 == '5' ? '尾款结算' : rowData.remark4 == '6' ? '费用代发' : rowData.remark4 == '8' ? "线下结算" : rowData.remark4 == '9' ? '服务费' : rowData.remark4 == '0' ? '保险费' : '--'}</Text>
                                    </View>
                                }

                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>金额(元):{rowData.total == undefined ? '0' : rowData.total}</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth, marginLeft: 30 }}>
                                {rowData.createTime == '' || rowData.createTime == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>创建时间:{rowData.createTime}</Text>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                </TouchableOpacity>
            )
        } else {
            return (
                <View>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 10, marginLeft: 5 }}>

                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>工作方式:{rowData.workMode == 'LSYG' ? '合伙人' : '  --'}</Text>
                                {rowData.settleYear == '' || rowData.settleYear == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>结算年度:{rowData.settleYear} </Text>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                                {rowData.remark4 == '' || rowData.remark4 == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 1, fontWeight: 'bold' }}>结算方式:{rowData.remark4 == '1' ? '月中结算' : rowData.remark4 == '2' ? '月底结算' : rowData.remark4 == '3' ? '预付款结算' : rowData.remark4 == '4' ? '阶段结算款' : rowData.remark4 == '5' ? '尾款结算' : rowData.remark4 == '6' ? '费用代发' : rowData.remark4 == '8' ? "线下结算" : rowData.remark4 == '9' ? '服务费' : rowData.remark4 == '0' ? '保险费' : '--'}</Text>
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
