

/**
 * 发票申请列表
 * Created by 郭亚新 on 17/02/2020.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, RefreshControl, InteractionManager, TextInput, BackHandler } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import theme from '../../config/theme';
import LoadMoreFooter from '../../components/LoadMoreFooter';
import px2dp from '../../utils/px2dp';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let _pageNo = 1;
const _pageSize = 10;
const initialState = {
    products: [],
    isRefreshing: false,
    isLoadingMore: false,
}
let changeTab = false;//是否切换了tab
export default class ApplyFPList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            isRefreshing: false,//是否刷新
            isLoadingMore: false,//是否加载更多
            loadedData: false,
            refreshing: false,
            dataBlob: [],
            selectNum: "0",
            condition: { status: "0", createTime: null }
        }
        //this.getContractList({ status: "0", createTime: null })
        this._loadMoreData(1, this.state.condition)
    }
    _loadMoreData(pageNo, cond, isRefreash) {
        _pageNo = pageNo;
        initialState.products = this.state.dataBlob
        if (changeTab || isRefreash) {//切换tab页避免重复push
            initialState.products = [];
        }
        if (pageNo == 0) {
            initialState.isRefreshing = true;
            initialState.products = [];
        }
        var url = Config.mainUrl + '/einvoiceOrderxxkp/getpersonalList?nd=1582274153941&_search=false&page=' + pageNo + '&rows=10&cond=' + encodeURI(JSON.stringify(cond));
        Fetch.getJson(url)
            .then((data) => {
                // debugger
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
                changeTab = false
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
        //debugger
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
        });
        this._loadMoreData(1, this.state.condition, true);
    }
    _toEnd() {
        // debugger
        let pgNo = parseInt(this.state.dataBlob.length / _pageSize);
        if (initialState.isLoadingMore || pgNo + 1 == _pageNo || initialState.isRefreshing) {
            return;
        }
        InteractionManager.runAfterInteractions(() => {
            this._loadMoreData(pgNo + 1, this.state.condition);
        });
    }
    _renderFooter() {
        // debugger
        // 通过当前product数量和刷新状态（是否正在下拉刷新）来判断footer的显示
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
        this._loadMoreData(1, this.state.condition, true);
    }
    onEndReached() {
        //debugger
        page = _pageNo + 1;
        this._loadMoreData(page, this.state.condition)
    }
    // _toEnd() {
    //     //debugger
    //     let pgNo = parseInt(this.state.dataBlob.length / _pageSize);
    //     if (initialState.isLoadingMore || pgNo + 1 == _pageNo || initialState.isRefreshing) {
    //         return;
    //     }
    //     InteractionManager.runAfterInteractions(() => {
    //         this._loadMoreData(pgNo + 1, this.state.condition);
    //     });
    // }
    // _renderFooter() {
    //     //debugger
    //     // 通过当前product数量和刷新状态（是否正在下拉刷新）来判断footer的显示
    //     if (this.state.dataBlob.length < 1 || this.state.refreshing) {
    //         return null
    //     };
    //     if (!parseInt(this.state.dataBlob.length / _pageSize) == _pageNo) {
    //         //还有更多，默认显示‘正在加载更多...’
    //         return <LoadMoreFooter />
    //     } else {
    //         // 加载全部
    //         return <LoadMoreFooter isLoadAll={true} />
    //     }
    // }
    //获取发票申请列表
    getContractList(cond) {// '0'：未开票，'1'：已开票    
        Fetch.getJson(Config.mainUrl + '/einvoiceOrderxxkp/getpersonalList?nd=1582274153941&_search=false&page=1' + '&rows=200&cond=' + encodeURI(JSON.stringify(cond)))
            .then((res) => {
                // debugger
                //debugger
                console.log(res)
                if (res.contents.length > 0) {
                    this.setState({
                        dataBlob: res.contents,
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
    /*
   
    componentWillReceiveProps(nextProps) {
        this.getContractList()
    }
    */
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>发票列表</Text>
                    </View>
                </ImageBackground>
                <View style={{ width: deviceWidth, backgroundColor: 'white', marginBottom: 120 + SafeArea.top }}>
                    <SegmentedControl
                        ref={'C2SegmentedControl'}
                        itemDatas={[{ name: '未开票' }, { name: '已开票' }]}
                        hasChanged={this._SelectPlanItem.bind(this)}
                        tintColor={'rgb(22,131,251)'}
                    />
                    <ScrollView
                        // style={{ backgroundColor: 'white', marginTop: 10, marginBottom: (140 + SafeArea.top) }}
                        ref={(ref) => this.scrollView = ref}
                        scrollEnabled={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this._onRefresh()}
                                tintColor="#999999"
                                // title="加载中..."
                                titleColor="#999999"
                                colors={['#287ce0', '#00ff00', '#0000ff']}
                                progressBackgroundColor={"#fff"}
                            />
                        }
                        onContentSizeChange={() => { }}>
                        {/* {this.state.selectNum == "1" ? this.searchView() : null} */}
                        {this.showList()}
                    </ScrollView>
                </View >
            </View>
        );
    }
    _SelectPlanItem(selectNum) {
        debugger
        this.setState({
            selectNum: selectNum,
        })
        changeTab = true
        if (selectNum == "0") {
            let cond = {
                status: "0",
                createTime: null
            }
            this.setState({ condition: cond })
            this._loadMoreData(1, cond, true)
            //this.getContractList(cond)
        }
        if (selectNum == "1") {
            let cond = {
                status: "1",
                createTime: null
            }
            this.setState({ condition: cond })
            this._loadMoreData(1, cond, true)
            //this.getContractList(cond)
        }
    }
    searchView() {
        if (this.state.searchClick) {
            return (
                <View style={{ height: 40, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#e5e5e5", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ height: 20, width: 20, marginLeft: 6 }} source={require('../../image/icon/search_32.png')} />
                    <TextInput
                        style={{ flex: 1, height: 20, margin: 4, backgroundColor: 'white' }}
                        placeholder='请输入搜索内容'
                        value={this.state.value}
                        onChangeText={this.getValue.bind(this)}
                        returnKeyType={'search'}
                        onSubmitEditing={this.onSearch} />
                    <TouchableOpacity onPress={() => this.setState({ searchClick: false, showList: true })} numberOfLines={1}>
                        <Text style={{ fontSize: 16, marginRight: 10, color: '#00bfff' }}>{"取消"}</Text>
                    </TouchableOpacity>

                </View>
            )
        } else {
            return (
                <View style={{ height: 40, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#e5e5e5", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ searchClick: true })} style={{ width: deviceWidth / 2, flexDirection: 'row', backgroundColor: '#ffffff' }} numberOfLines={1}>
                        <Image style={{ height: 20, width: 20, marginLeft: deviceWidth / 6 }} source={require('../../image/icon/search_32.png')} />
                        <Text style={{ fontSize: 14, marginLeft: 5 }}>{"搜索"}</Text>
                    </TouchableOpacity>

                </View>
            )
        }
    }
    showList() {
        if (this.state.ifzero) {
            //debugger
            return (
                <View style={{ height: deviceHeight - (70 + SafeArea.top), alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<ScrollView style={{ marginTop: 10, }}>
                <ListView
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.dataBlob)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={50}
                />

            </ScrollView>)
        }

    }
    scan() {
        Actions.ScanCode();
    }
    _renderItem(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5, marginTop: 8 }} onPress={() => { Actions.ApplyFP({ rowData: rowData, rowDataType: 'CK' }) }}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <Text style={{ fontSize: Config.MainFontSize - 1 }}>发票单号:{rowData.orderno}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 1 }}>纳税人识别号:{rowData.taxnum}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 1 }}>购方名称:{rowData.buyername}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 1 }}>销方名称:{rowData.saleName == '' || rowData.saleName == undefined ? '无' : rowData.saleName}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, width: deviceWidth / 2 }}>开票额:{rowData.total} 元</Text>
                            <Text style={{ fontSize: Config.MainFontSize, position: 'absolute', right: 20 }}>发票性质:{rowData.type == "2" ? "普票" : "增值税专用发票"}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>开票状态:{rowData.status == "0" ? "未开票" : "已开票"}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 20, top: 15 }}>提交时间:{this.timeChange(rowData.creatorTime)}</Text>
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
