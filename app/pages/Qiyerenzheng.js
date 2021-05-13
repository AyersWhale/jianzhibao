/**
 * 企业认证
 * Created by 郭亚新 on 17/02/2020.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, RefreshControl, InteractionManager } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import theme from '../config/theme';
import LoadMoreFooter from '../components/LoadMoreFooter';
import px2dp from '../utils/px2dp';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let _pageNo = 1;
const _pageSize = 10;
const initialState = {
    products: [],
    isRefreshing: false,
    isLoadingMore: false,
}
export default class Qiyerenzheng extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            isRefreshing: false,
            isLoadingMore: false,
            loadedData: false,
            refreshing: false,
            dataBlob: [],
            selectNum: "0"
        }
        this.getContractList(2)
        //this._loadMoreData(1)
    }
    _loadMoreData(pageNo) {
        _pageNo = pageNo;
        initialState.products = this.state.dataBlob
        if (pageNo == 0) {
            initialState.isRefreshing = true;
            initialState.products = [];
        }
        var url = Config.mainUrl + '/companyInfoBF?page=' + pageNo + '&rows=20&sidx=regTime&sord=desc&cond=%7B"auditType"%3A"1"%7D';
        Fetch.getJson(url)
            .then((data) => {
                //debugger
                var entry1 = data.contents;
                this.setState({
                    dataSource: entry1,
                });
                for (let i in entry1) {
                    let itemInfo = entry1[i]
                    initialState.products.push(itemInfo);
                }
                Toast.dismiss();
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
            }).catch((error) => {
                Toast.show(error, { position: px2dp(-80) });
            });
        if (pageNo == 0) {
            initialState.isRefreshing = false;
        } else {
            initialState.isLoadingMore = false;
        }
    }
    _onRefresh() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
        });
        this._loadMoreData(1);
    }
    _toEnd() {
        let pgNo = parseInt(this.state.dataBlob.length / _pageSize);
        if (initialState.isLoadingMore || pgNo + 1 == _pageNo || initialState.isRefreshing) {
            return;
        }
        InteractionManager.runAfterInteractions(() => {
            this._loadMoreData(pgNo + 1);
        });
    }
    _renderFooter() {
        // //通过当前product数量和刷新状态（是否正在下拉刷新）来判断footer的显示
        if (this.state.dataBlob.length < 1 || this.state.refreshing) {
            return null
        };
        if (!parseInt(this.state.dataBlob.length / _pageSize) == _pageNo) {
            //还有更多，默认显示‘正在加载更多...’
            return <LoadMoreFooter />
        } else {
            // 加载全部
            return <LoadMoreFooter isLoadAll={true} />
        }
    }
    //获取企业审核列表
    getContractList(type) {//type == 2(未审核) type == 3(通过)
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getsecondcompanyList?type=' + type)
            .then((res) => {
                // debugger
                console.log(res)
                if (res.content.length > 0) {
                    this.setState({
                        dataBlob: res.content,
                        ifzero: false
                    })
                } else {
                    this.setState({
                        dataBlob: [],
                        ifzero: true
                    })
                }
            })
    }
    /*
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('yiqian', (text) => {
            this.getContractList()
        })
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    componentWillReceiveProps(nextProps) {
        this.getContractList()
    }
    */
    handleBack() {
        DeviceEventEmitter.emit('change3')
        Actions.pop()
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => this.handleBack()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>企业认证</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => this.handleBack()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>企业认证</Text>
                    </View>
                </View>
                <View style={{ width: deviceWidth, backgroundColor: 'white', marginBottom: 120 + SafeArea.top }}>
                    <SegmentedControl
                        ref={'C2SegmentedControl'}
                        itemDatas={[{ name: '未认证' }, { name: '已认证' }]}
                        hasChanged={this._SelectPlanItem.bind(this)}
                        tintColor={'rgb(22,131,251)'}
                    />
                    <ScrollView style={{ backgroundColor: 'white', marginTop: 10 }} scrollIndicatorInsets={{ right: 1 }}>
                        {this.showList()}
                    </ScrollView>
                </View >
            </View>
        );
    }
    _SelectPlanItem(selectNum) {
        this.setState({
            selectNum: selectNum,
        })
        if (selectNum == "0") { this.getContractList(2) }
        if (selectNum == "1") { this.getContractList(3) }
    }
    showList() {
        if (this.state.ifzero) {
            //debugger
            return (
                <View style={{ height: deviceHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ marginTop: 10 }}>
                <ListView
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.dataBlob)}
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
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.RenzhengDetail({ rowData: rowData, onblock: this.getContractList.bind(this, 2), types: this.state.selectNum, selectNum: this.state.selectNum })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 2 }}>单位名称:{rowData.companyName}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>所属行业:{rowData.companyIndustry}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>公司规模:{rowData.companyScale}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 20, top: 15 }}>提交时间:{rowData.regTime}</Text>
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
});
