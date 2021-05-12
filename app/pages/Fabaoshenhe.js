/**
 * 企业发包审核
 * Created by 郭亚新 on 18/02/2020.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, RefreshControl, InteractionManager, TextInput } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import theme from '../config/theme';
import LoadMoreFooter from '../components/LoadMoreFooter';
import px2dp from '../utils/px2dp';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let _pageNo = 1;
const _pageSize = 10;
let changeTab = false;//是否切换了tab
const initialState = {
    products: [],
    isRefreshing: false,
    isLoadingMore: false,
}
export default class Fabaoshenhe extends Component {
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
            condition: { checkStatus: "1", releaseCompanyName: "", positionName: "" }
        }
        //监听首页未读消息
        //this.getContractList({ checkStatus: "1", releaseCompanyName: "", positionName: "" })
        this._loadMoreData(1, { checkStatus: "1", releaseCompanyName: "", positionName: "" })
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
        var url = Config.mainUrl + '/temporaryWork?page=' + pageNo + '&rows=10&cond=' + encodeURI(JSON.stringify(cond));
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
    // _toEnd() {
    //     debugger
    //     let pgNo = parseInt(this.state.dataBlob.length / _pageSize);
    //     if (initialState.isLoadingMore || pgNo + 1 == _pageNo || initialState.isRefreshing) {
    //         return;
    //     }
    //     InteractionManager.runAfterInteractions(() => {
    //         this._loadMoreData(pgNo + 1, this.state.condition);
    //     });
    // }
    // _renderFooter() {
    //     debugger
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
    getContractList(cond) {//type == 2(为审核) type == 3(通过)
        //const cond = this.state.condition
        Fetch.getJson(Config.mainUrl + '/temporaryWork?page=1' + '&rows=200&cond=' + encodeURI(JSON.stringify(cond)))
            .then((res) => {
                console.log(res)
                if (res.contents.length > 0) {
                    this.setState({
                        ifzero: false,
                        dataBlob: res.contents
                    })
                } else {
                    this.setState({
                        ifzero: true,
                        dataBlob: [],
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
    onEndReached() {
        //debugger
        page = _pageNo + 1;
        this._loadMoreData(page, this.state.condition)
    }
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
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>发包审核</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>发包审核</Text>
                    </View>
                </View>
                <View style={{ width: deviceWidth, backgroundColor: 'white', marginBottom: 120 + SafeArea.top }}>
                    <SegmentedControl
                        ref={'C2SegmentedControl'}
                        itemDatas={[{ name: '未审核' }, { name: '已通过' }]}
                        hasChanged={this._SelectPlanItem.bind(this)}
                        tintColor={'rgb(22,131,251)'}
                    />
                    <ScrollView
                        scrollIndicatorInsets={{ right: 1 }}
                        style={{ backgroundColor: 'white', marginTop: 10 }}
                        ref={(ref) => this.scrollView = ref}
                        scrollEnabled={true}
                        keyboardShouldPersistTaps={'handled'}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this._onRefresh()}
                                tintColor="#999999"
                                title="加载中..."
                                //titleColor="#999999"
                                colors={['#287ce0', '#00ff00', '#0000ff']}
                                progressBackgroundColor={"#fff"}
                            />
                        }
                        onContentSizeChange={() => { }}>
                        {this.state.selectNum == "1" ? this.searchView() : null}
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
        changeTab = true
        if (selectNum == "0") {
            let cond = {
                checkStatus: "1"
            }
            this.setState({ condition: cond })
            this._loadMoreData(1, cond)
            //this.getContractList(cond)
        }
        if (selectNum == "1") {
            let cond = {
                checkStatus: "2"
            }
            this.setState({ condition: cond })
            this._loadMoreData(1, cond)
            //this.getContractList(cond)
        }
    }
    getValue(values) {
        //this.setState({value:values})
        var cond = this.state.condition
        cond.positionName = values
        this.getContractList(cond)
    }
    handleSearchCancle() {
        var cond = this.state.condition
        cond.positionName = ""
        this.setState({ searchClick: false })
        //this.setState({value:''})
        this.getContractList(cond)
    }
    searchView() {
        if (this.state.searchClick) {
            return (
                <View style={{ height: 40, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#e5e5e5", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ height: 20, width: 20, marginLeft: 6 }} source={require('../image/icon/search_32.png')} />
                    <TextInput
                        style={{ flex: 1, height: 40, margin: 4, backgroundColor: 'white' }}
                        placeholder='请输入搜索包名称'
                        value={this.state.value}
                        onChangeText={this.getValue.bind(this)}
                        returnKeyType={'search'}
                        onSubmitEditing={this.onSearch} />
                    <TouchableOpacity onPress={() => this.handleSearchCancle()} numberOfLines={1}>
                        <Text style={{ fontSize: 16, marginRight: 10, color: '#00bfff' }}>{"取消"}</Text>
                    </TouchableOpacity>

                </View>
            )
        } else {
            return (
                <View style={{ height: 40, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#e5e5e5", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ searchClick: true })} style={{ width: deviceWidth / 2, flexDirection: 'row', backgroundColor: '#ffffff' }} numberOfLines={1}>
                        <Image style={{ height: 20, width: 20, marginLeft: deviceWidth / 6 }} source={require('../image/icon/search_32.png')} />
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
                <View style={{ height: deviceHeight, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<ScrollView style={{ marginTop: 10 }} scrollIndicatorInsets={{ right: 1 }}>
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
                <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5 }} onPress={() => Actions.PublicJob2({ rowData: rowData, onblock: this.getContractList.bind(this, { checkStatus: "1", releaseCompanyName: "", positionName: "" }), types: this.state.selectNum, selectNum: this.state.selectNum, rowDatas: '2' })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>公司名称:{rowData.releaseCompanyName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C' }}>发包名称:{rowData.positionName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }} numberOfLines={2}>发包需求:{rowData.jobDescription}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey' }}>发包金额:{rowData.salary} 元</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>用工结束时间:{this.timeChange(rowData.workEndTime)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey' }} numberOfLines={2}>备注:{rowData.remark || "无"}</Text>
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
