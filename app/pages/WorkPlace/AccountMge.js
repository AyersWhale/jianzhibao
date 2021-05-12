/**
 * 银行卡信息列表
 * 郭亚新 2020/4/2
 */
import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, RefreshControl, InteractionManager, TextInput, Alert, BackHandler } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import px2dp from '../../utils/px2dp';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
let _pageNo = 1;
const initialState = {
    products: [],
    // isRefreshing: false,
    // isLoadingMore: false,
}
export default class AccountMge extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataBlob: [],
            isRefreshing: false,
            bankstatus: "",//设置默认卡
        }
        this._loadMoreData(1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId })
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
    _loadMoreData(pageNo, cond, isRefreash) {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
        });
        _pageNo = pageNo;
        initialState.products = this.state.dataBlob
        if (isRefreash) {
            initialState.products = [];
        }
        if (pageNo == 0) {
            //initialState.isRefreshing = true;
            initialState.products = [];
        }
        var url = Config.mainUrl + '/personnelBank/bankgetListByPage?nd=1585811998758&_search=false&rows=10&page=' + pageNo + '&sidx=&sord=&cond=' + encodeURI(JSON.stringify(cond))
        Fetch.getJson(url)
            .then((data) => {
                //debugger
                Toast.dismiss();
                var entry1 = data.contents;
                console.log(entry1)
                this.setState({
                    dataSource: entry1,
                });
                for (let i in entry1) {
                    let itemInfo = entry1[i]
                    initialState.products.push(itemInfo);
                }
                if (initialState.products.length == 0) {
                    this.setState({
                        ifzero: true
                    })
                } else {
                    this.setState({
                        ifzero: false
                    })
                }
                this.setState({
                    dataBlob: initialState.products,
                    loadedData: true,
                    refreshing: false
                });
                //changeTab = false
            }).catch((error) => {
                Toast.dismiss();
                Toast.show(error, { position: px2dp(-80) });
            });
        // if (pageNo == 0) {
        //     initialState.isRefreshing = false;
        // } else {
        //     initialState.isLoadingMore = false;
        // }
    }
    onEndReached() {
        //debugger
        page = _pageNo + 1;
        this._loadMoreData(page, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId })
    }
    _onRefresh() {
        this._loadMoreData(1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId }, true);
    }
    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;

    }
    handleDelCard(rowData) {
        if (rowData.bankstatus == "1") {
            Alert.alert("温馨提示", "默认卡不可删除"
                , [
                    {
                        text: "好的", onPress: () => { }
                    },
                ])
            return
        }
        Alert.alert("温馨提示", "是否确认删除"
            , [
                {
                    text: "取消", onPress: () => { }
                },
                {
                    text: "确认", onPress: () => {
                        Fetch.deleteJson(Config.mainUrl + '/personnelBank/' + rowData.id)
                            .then((res) => {
                                //debugger
                                //res 没有返回值，默认删除成功
                                this._loadMoreData(1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId }, true);
                            }).catch((error) => {
                                Toast.show(res.Msg, { position: px2dp(-80) });
                            });
                    }
                }
            ])
    }
    setDefaultCard(rowData) {
        var entity = {
            id: rowData.id,
            bankStatus: '1',
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        }
        Fetch.postJson(Config.mainUrl + '/personnelBank/updatedefaultBank', entity)
            .then((res) => {
                if (res.rcode == '1') {
                    this._loadMoreData(1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId }, true);
                }
            }).catch((error) => {
                Toast.show(res.Msg, { position: px2dp(-80) });
            });
    }
    getbankStyle(openbank) {
        let bankType = {
            logo: require('../../image/bankCard/CONSTRUCTION.png'),
            bg: require('../../image/bankCard/CONSTRUCTION1.png'),
            pic: require('../../image/bankCard/CONSTRUCTION2.png'),
        }
        switch (openbank) {
            case 'COMMERCIAL':
                bankType = {
                    logo: require('../../image/bankCard/COMMERCIAL.png'),
                    bg: require('../../image/bankCard/CSBANK1.png'),
                    pic: require('../../image/bankCard/COMMERCIAL2.png'),
                }
                return bankType // 工商
            case 'SPDBANK':
                bankType = {
                    logo: require('../../image/bankCard/SPDBANK.png'),
                    bg: require('../../image/bankCard/SPDBANK1.png'),
                    pic: require('../../image/bankCard/SPDBANK2.png'),
                }
                return bankType //浦发
            case 'GDYH':
                bankType = {
                    logo: require('../../image/bankCard/guangda.png'),
                    bg: require('../../image/bankCard/guangda1.png'),
                    pic: require('../../image/bankCard/guangda2.png'),
                }
                return bankType  //光大
            case 'CHINABANK':
                bankType = {
                    logo: require('../../image/bankCard/CHINABANK.png'),
                    bg: require('../../image/bankCard/CHINABANK1.png'),
                    pic: require('../../image/bankCard/CHINABANK2.png'),
                }
                return bankType //中国
            case 'JTYH':
                bankType = {
                    logo: require('../../image/bankCard/JTYH.png'),
                    bg: require('../../image/bankCard/CONSTRUCTION1.png'),
                    pic: require('../../image/bankCard/JTYH2.png'),
                }
                return bankType //交通
            case 'PAYY':
                bankType = {
                    logo: require('../../image/bankCard/PAYY.png'),
                    bg: require('../../image/bankCard/PAYY1.png'),
                    pic: require('../../image/bankCard/PAYY2.png'),
                }
                return bankType //平安
            case 'CSBANK':
                bankType = {
                    logo: require('../../image/bankCard/CSBANK.png'),
                    bg: require('../../image/bankCard/CSBANK1.png'),
                    pic: require('../../image/bankCard/CSBANK2.png'),
                }
                return bankType //长沙
            case 'CONSTRUCTION':
                bankType = {
                    logo: require('../../image/bankCard/CONSTRUCTION.png'),
                    bg: require('../../image/bankCard/CONSTRUCTION1.png'),
                    pic: require('../../image/bankCard/CONSTRUCTION2.png'),
                }
                return bankType //建设
            case 'AGRICULTURAL':
                bankType = {
                    logo: require('../../image/bankCard/AGRICULTURAL.png'),
                    bg: require('../../image/bankCard/AGRICULTURAL1.png'),
                    pic: require('../../image/bankCard/AGRICULTURAL2.png'),
                }
                return bankType //农业
            case 'EMS':
                bankType = {
                    logo: require('../../image/bankCard/EMS.png'),
                    bg: require('../../image/bankCard/EMS1.png'),
                    pic: require('../../image/bankCard/EMS2.png'),
                }
                return bankType //邮政
            case 'MERCHANTS':
                bankType = {
                    logo: require('../../image/bankCard/MERCHANTS.png'),
                    bg: require('../../image/bankCard/CSBANK1.png'),
                    pic: require('../../image/bankCard/MERCHANTS2.png'),
                }
                return bankType //招商
            default: return bankType
        }
    }
    _renderItem_new(rowData) {
        let bankStyle = this.getbankStyle(rowData.openbank)
        let bg = bankStyle.bg
        let logo = bankStyle.logo
        let pic = bankStyle.pic
        return (
            <TouchableOpacity style={{ width: deviceWidth - 60, marginBottom: 20, paddingLeft: 10, borderRadius: 5, overflow: 'hidden' }} onPress={() => Actions.AddAccount({ rowData: rowData, actionTypes: 'edit', onblock: this._loadMoreData.bind(this, 1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId }, true) })}>
                <ImageBackground source={bg} resizeMode='stretch' style={{ height: 138, width: '100%', backgroundColor: 'transparent', borderRadius: 5, overflow: 'hidden' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Image source={logo} style={{ height: 42, width: 42, marginLeft: 15 }} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize + 3, color: '#ffffff' }}>{rowData.openbankName}</Text>
                                {rowData.bankstatus == "1" ?
                                    <Text style={{ fontSize: Config.MainFontSize, color: "#fff", marginTop: 5 }}>{rowData.bankstatus == "1" ? '默认卡' : ''}</Text>
                                    :
                                    <TouchableOpacity style={{ width: Config.MainFontSize * 5, borderRadius: 5, overflow: "hidden" }} onPress={() => this.setDefaultCard(rowData)}>
                                        <Text style={{ fontSize: Config.MainFontSize - 1, color: "#333", marginTop: 5 }}>设为默认卡</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <Text style={{ fontSize: Config.MainFontSize + 4, color: '#ffffff', marginRight: 20 }}>
                            {'**** ' + rowData.wagescart.substring(rowData.wagescart.length - 5)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginLeft: 15, paddingTop: 15 }}>
                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize, color: '#fff' }}>支行:{rowData.opengbankzh}</Text>
                        <TouchableOpacity onPress={() => this.handleDelCard(rowData)}>
                            <VectorIcon
                                name="delete_forever"
                                size={26}   //图片大小
                                color='#fff'  //图片颜色
                                style={{ backgroundColor: 'transparent', paddingRight: 10 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: 'absolute', right: 30, top: 75 }}>
                        <Image source={pic} style={{ width: 118 }} />
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
    _renderItem(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 10, width: deviceWidth - 40, marginLeft: 5 }} onPress={() => Actions.AddAccount({ rowData: rowData, actionTypes: 'edit', onblock: this._loadMoreData.bind(this, 1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId }, true) })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                            <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 2 }}>开户行:{rowData.openbankName}</Text>
                            {rowData.bankstatus == "1" ?
                                <Text style={{ fontSize: Config.MainFontSize, color: "green", paddingRight: 20 }}>{rowData.bankstatus == "1" ? '默认卡' : ''}</Text>
                                :
                                <TouchableOpacity style={{ backgroundColor: "rgb(65,143,234)", marginRight: 10, borderRadius: 5, overflow: "hidden" }} onPress={() => this.setDefaultCard(rowData)}>
                                    <Text style={{ fontSize: Config.MainFontSize - 1, color: "#fff", padding: 5, }}>设为默认卡</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingTop: 15 }}>
                            <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize, width: deviceWidth / 1.5 }}>支行:{rowData.opengbankzh}</Text>
                            <TouchableOpacity onPress={() => this.handleDelCard(rowData)}>
                                {/* <Text style={{ fontSize: Config.MainFontSize - 1, color: "#fff", padding: 5, }}>删除</Text> */}
                                <VectorIcon
                                    name="delete_forever"
                                    size={26}   //图片大小
                                    color='rgb(65,143,234)'  //图片颜色
                                    style={{ backgroundColor: 'transparent', paddingRight: 10 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>卡号:{rowData.wagescart}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 20, top: 15 }}>创建时间:{this.timeChange(rowData.updateTime)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    showList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ marginTop: 10 }}>
                <ListView
                    // style={{ borderRadius: 10 }}
                    dataSource={this.ds.cloneWithRows(this.state.dataBlob)}
                    renderRow={this._renderItem_new.bind(this)}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={10}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh()}
                            tintColor="#999999"
                            title="加载中..."
                            titleColor="#999999"
                            colors={['#287ce0', '#00ff00', '#0000ff']}
                            progressBackgroundColor={"#fff"}
                        />
                    }
                />

            </View>)
        }

    }
    render() {
        return (
            <View style={{ position: 'relative', }}>
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>银行卡信息</Text>
                    </View>
                </View>
                <View style={{ height: 188, backgroundColor: '#3E7EFE', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}>
                </View>
                <ScrollView style={{ height: deviceHeight, width: deviceWidth - 40, position: 'absolute', right: 20, top: SafeArea.top + 100, backgroundColor: '#fff', borderRadius: 8, }}>
                    <View style={styles.acctitle}>
                        <Text style={{ fontSize: Config.MainFontSize + 1, fontWeight: 'bold', color: '#333' }}>我的卡</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 1, color: '#3E7EFE' }}>全部（{this.state.dataBlob.length || 0}）</Text>
                    </View>

                    <View style={{ marginBottom: 30 }}>
                        {this.showList()}
                    </View>

                    <View style={{ marginBottom: 120, display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity style={{ display: 'flex', backgroundColor: '#4781f6', width: deviceWidth - 60, height: 60, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => Actions.AddAccount({ actionTypes: "add", onblock: this._loadMoreData.bind(this, 1, { userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId }, true) })} >
                            <VectorIcon name={"android-add-circle"} size={25} style={{ color: '#ffffff', backgroundColor: 'transparent', marginRight: 3 }} />
                            <Text style={{ fontSize: Config.MainFontSize + 3, color: 'white' }}>添加银行卡</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    acctitle: {
        height: 50,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }
});