/**
 * 首页
 * Created by 曾一川 on 05/11/18.
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Keyboard, DeviceEventEmitter, ImageEditor, WebView, ScrollView, Modal, Dimensions, ListView, Image, TouchableOpacity, Platform, RefreshControl, TextInput, PermissionsAndroid, Alert } from 'react-native';
import { Toast, Actions, VectorIcon, Fetch, Config, UserInfo, QuickSearch } from 'c2-mobile';
import QySearch from './QySearch';
import { QySwiper } from 'qysyb-mobile';
import theme from '../config/theme';
import underLiner from '../utils/underLiner';
import QySearch1 from './JianliSearch';
import ListViewChooseContainer from '../utils/ListViewChooseContainer';
import { Popover } from 'antd-mobile-rn';
import Toasts from 'react-native-root-toast';
import CoordinateTrans from '../utils/CoordinateTrans';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';
import { C2AmapApi } from 'c2-mobile-amap';
import Global from '../utils/GlobalStorage';
import HandlerOnceTap from '../utils/HandlerOnceTap'
import { Button } from 'react-native-elements';
import { commonLoginOut } from '../utils/common/businessUtil'

let _pageNo = 1;
let jobPageSize = 10;
let touchEnd = false;//前端分页
const initialState = {
    products: [],
    hasMoredata: false,//用来控制频繁调用onEndReached
}
export default class HomeFragment extends Component {
    static defaultProps = {
        duration: 3000
    }
    constructor(props) {
        super(props);
        // console.log(UserInfo.loginSet.result.rdata.loginUserInfo)
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            latlong: { lat: 0, lng: 0 },//当前经纬度
            gwTab: "tj",//fj附近职位，tj推荐职位
            hideHeader: false,
            ifhadChoose: false,//是否有筛选条件
            gps_city: '',//定位城市
            selectedCity: '',//所选城市
            qipaoVisible: false,
            isRefreshing: false,//刷新职位简历
            showPop: false,
            entry: 0,
            theme: '',
            resultList: [],//职位列表 源数据
            resultCellList: [],//职位列表 实现只前端分页
            resumeList: [],//简历列表
            ifzero: true,
            ifzero_boss: true,
            ifzero_search: false,
            unreadNum: '',
            showSearchList: false,
            showSearchList_bos: false,
            unreadMessage: false,
            visibleReferees: false,
            listViewData_search: [],
            diqu: '选择地区',
            endData: '',
            identity: '',
            ifShowlubo: true,
            currentPage: 0,//轮播图用
            lunbotuList: [],
            modalVisible: false,
            platformNum: '',
            qyshUnreadNum: '',
            qyrzUnreadNum: '',
            zzshUnreadNum: '',
            fbshUnreadNum: '',
            ifOpen: [{ open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true },
            { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true }, { open: true },],
            resultCon: {
                workMode: null,
                workYears: "BX",
                educationRequire: "BX",
                userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
                positionProvinceName: null,
                positionKind: "BX",
                positionCityName: null,
                positionAreaName: null,
                keyWord: null,
            },//职位条件 
            selectedContionJob: {},//职位筛选回显
            selectedContionResume: {},//简历筛选回显
            resumeCon: {
                age: "BX",
                sex: "BX",
                salaryRanges: "BX",
                workYear: "BX",
                education: "BX",
                intentPost: null,
            },//简历条件
            modalVisible_notice: false,
            updateTips: {}//更新内容
        }
        if (Platform.OS == 'android') {
            C2AmapApi.initService({
                apiKey: 'f1e98431de6fcdbfb9071b9e8cc56061'
            });
        } else {
            C2AmapApi.initService({
                apiKey: '2a79d9bfda5534d33c3eb959fc805569'
            });
        }
        this.Pdsmrz();
        this.getLunbotu();
        this.refresh();
        this._loadMoreData();//获取消息列表
        this.checkWdsl()
        if (this.props.identity == 'boss') {
            let resumeCon = {
                age: "BX",
                sex: "BX",
                salaryRanges: "BX",
                workYear: "BX",
                education: "BX"
            }
            this.getResumeList(1, resumeCon);//获取简历列表（分页）
        } else if (this.props.identity == 'student') {
            this.getUnreadNum();//获取导航上标
        } else if (this.props.identity == 'platform') {
            this.getUnreadPlatform();//获取平台导航上标
            this.getPlatformNum();//数据统计
        }
    }
    checkWdsl() {
        Fetch.getJson(Config.mainUrl + '/messageAll/getUnReadNum')
            .then((res) => {
                this.setState({
                    UnReadNum: res
                })
            })
    }
    Pdsmrz() {
        if (UserInfo.loginSet.result.rdata.loginUserInfo.remark2 == '-1') {
            if (UserInfo.loginSet.result.rdata.loginUserInfo.remark7 != undefined && UserInfo.loginSet.result.rdata.loginUserInfo.remark7 != '1') {
                Toasts.show('请前往PC端进行实名认证', { position: -60 });
            }
        }
    }
    componentWillUnmount() {
        //this.subscription.remove();
        this.subscription1.remove();
        this.subscription2.remove();
        this.subscription3.remove();
        this.subscription4.remove();
        this.subscription.remove();
        this.timer && clearTimeout(this.timer);
        this.timerBanner && clearInterval(this.timerBanner)
        this.timerOut && clearTimeout(this.timerOut);

        this.setState = (state, callback) => {
            return;
        };
    }

    componentDidMount() {
        this.getUpdatePreNotice()
        if (Platform.OS == 'android') {
            C2AmapApi.initService({
                apiKey: 'f1e98431de6fcdbfb9071b9e8cc56061'
            });
        } else {
            C2AmapApi.initService({
                apiKey: '2a79d9bfda5534d33c3eb959fc805569'
            });
        }
        if (this.props.identity == 'student') {
            this.getGlobalLocation(() => this._getGps())
            //this.loadJobData(this.state.resultCon)
        }
        this.subscription1 = DeviceEventEmitter.addListener('change1', (text) => {
            this.getUnreadNum()
        })
        this.subscription2 = DeviceEventEmitter.addListener('change2', (text) => {
            this._loadMoreData()
        })
        this.subscription3 = DeviceEventEmitter.addListener('change3', (text) => {
            this.getUnreadPlatform()
        })
        this.subscription4 = DeviceEventEmitter.addListener('change4', (text) => {
            this.checkWdsl()
        })
        this.subscription = DeviceEventEmitter.addListener("unreadMessage", (param) => {
            // 刷新界面等
            // console.log(param)
            this.setState({
                unreadMessage: param
            })
        });
        this.startTimer();
    }

    componentWillReceiveProps(nextProps) {
        // this.getUnreadNum();
        // this.getJobInform();
        // this._loadMoreData();
        // if (this.props.identity == 'boss') {
        //     this.getResumeList();//获取简历列表（分页）
        // } else if (this.props.identity == 'student') {
        //     this._loadMoreData();//获取消息列表
        //     this.getJobInform();//获取职位列表（分页）
        //     this.getUnreadNum();//获取导航上标
        // } else if (this.props.identity == 'platform') {
        //     this.getUnreadPlatform()//获取平台导航上标
        // }
        this._loadMoreData();//获取消息列表
        if (this.props.identity == 'boss') {
            let resumeCon = {
                age: "BX",
                sex: "BX",
                salaryRanges: "BX",
                workYear: "BX",
                education: "BX",
            }
            this.getResumeList(1, this.state.resumeCon, true);//获取简历列表（分页）
        } else if (this.props.identity == 'student') {
            if (this.state.gwTab == 'tj') {
                this.loadJobData(this.state.resultCon)//获取岗位
            } else {
                let con = {
                    ...this.state.resultCon,
                    ...this.state.latlong
                }
                this.loadNearbyJob(1, con, true)
            }
            this.getUnreadNum();//获取导航上标
        } else if (this.props.identity == 'platform') {
            this.getUnreadPlatform();//获取平台导航上标
            this.getPlatformNum();//数据统计
        }
    }
    getUpdatePreNotice() {
        //获取更新预告消息
        Fetch.getJson(Config.mainUrl + '/updateTips/getIsOpenUpdateTips')
            .then((res) => {
                // console.log('公告', res)
                if (res.id) {
                    this.setState({
                        updateTips: res,
                    }, () => {
                        this.setState({
                            modalVisible_notice: true
                        })
                    })
                }
            })
    }
    startTimer() {
        let activePage = 0
        this.timerBanner = setInterval(() => {
            let imageCount = this.state.lunbotuList.length
            if (imageCount < 1) {

            } else {
                let scrollViewer = this.scrollView
                if (activePage >= imageCount - 1) {
                    activePage = 0;
                } else {
                    activePage++
                }
                this.setState({
                    currentPage: activePage
                })
                let offsetX = activePage * (deviceWidth - 30)
                scrollViewer.scrollTo({ x: offsetX, y: 0, animated: offsetX == 0 ? false : true })
            }
        }, this.props.duration)
    }
    refresh() {
        // if (this.props.identity == 'boss') {
        //     this.timer = setInterval(() => {
        //         this.getResumeList();//获取简历列表（）
        //     }, 10000);//
        // } else if (this.props.identity == 'student') {
        //     this.timer = setInterval(() => {
        //         this._loadMoreData();//获取消息列表（不分页）
        //         this.getJobInform();
        //         this.getUnreadNum();
        //     }, 10000);
        // }
        if (this.props.identity == 'student') {
            this.timer = setInterval(() => {
                let storageToken = ''
                Global.getValueForKey('tokenValue').then((ret) => {
                    console.log('本地存的tokenValue', ret)
                    storageToken = ret.token
                    let params = {
                        username: UserInfo.loginSet.result.rdata.loginUserInfo.userName,
                        token: storageToken
                    }
                    Fetch.postJson(Config.mainUrl + '/v1/mobile/checkloginis', params)
                        .then((res) => {
                            console.log('有别人登录的时候返回false', res)
                            if (res.status == false) {
                                commonLoginOut()
                                Actions.Login({ type: 'reset' });
                                Alert.alert('温馨提示', '该账号登录信息已过期或已在其他设备登录', [{
                                    text: '好的', onPress: () => { }
                                }, {}
                                ])
                            }
                        })
                })
            }, 30000);//检测是否有其他登录
        }
    }
    getGlobalLocation(functionTobeCalled) {//获取上次定位信息，包括城市与经纬度
        Global.getValueForKey('lastLocationInfo').then((ret) => {
            if (ret == null) {

            } else {
                let lastCity = ret.lastCity
                let con = {
                    ...this.state.resultCon,
                    provinceName: lastCity,
                }
                this.setState({ resultCon: con, selectedCity: lastCity })
                this.loadJobData(con)
            }
        })
        //console.log('执行了getGlobalLocation')
        functionTobeCalled()
    }
    _getGps(param) {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '定位中...'
        });
        C2AmapApi.getCurrentLocation()
            .then((result) => {
                let bd_Coordinate = CoordinateTrans.gps_bgps(result.coordinate.longitude, result.coordinate.latitude)
                var lat = keepSixDecimal(bd_Coordinate.bd_lat)
                var lng = keepSixDecimal(bd_Coordinate.bd_lng)
                Fetch.postJson(Config.mainUrl + '/ws/getAddress?x=' + lat + '&y=' + lng)
                    .then((res) => {
                        console.log('后台返回的位置信息', res)
                        var citytemp = res.result ? JSON.parse(res.result.str) : {}
                        // console.log(citytemp)
                        var city = citytemp.result ? citytemp.result.addressComponent.city : ''
                        if (result.coordinate.latitude == '0.000000') {
                            this.loadJobData(this.state.resultCon)
                            Alert.alert('温馨提示', '请开启定位权限可查看当前城市职位信息，方便向您推荐附近的职位信息', [{
                                text: '好的', onPress: () => { }
                            }, {}
                            ])
                        } else {
                            if (city == '') {
                                // this.timerOut = setTimeout(
                                //     () => this._getGps(),
                                //     1000
                                // );
                                this.loadJobData(this.state.resultCon)
                                setTimeout(() => {
                                    Toast.dismiss();
                                    Alert.alert("温馨提示", "定位失败，是否重新定位"
                                        , [
                                            {
                                                text: "取消", onPress: () => { }
                                            },
                                            {
                                                text: "是", onPress: () => {
                                                    if (Platform.OS == 'android') {
                                                        C2AmapApi.initService({
                                                            apiKey: 'f1e98431de6fcdbfb9071b9e8cc56061'
                                                        });
                                                    } else {
                                                        C2AmapApi.initService({
                                                            apiKey: '2a79d9bfda5534d33c3eb959fc805569'
                                                        });
                                                    }
                                                    this._getGps()
                                                }
                                            }])
                                }, 2000)
                            } else {
                                Toast.dismiss();
                                //高德经纬度转百度
                                let bd_Coordinate = CoordinateTrans.gps_bgps(result.coordinate.longitude, result.coordinate.latitude)
                                let coordinate = {
                                    lat: keepSixDecimal(bd_Coordinate.bd_lat),
                                    lng: keepSixDecimal(bd_Coordinate.bd_lng)
                                }
                                Global.saveWithKeyValue('lastLocationInfo', { lastCity: city, coordinate: coordinate });

                                let con = {
                                    ...this.state.resultCon,
                                    provinceName: city
                                }
                                this.setState({
                                    gps_city: city,
                                    selectedCity: city,
                                    latlong: coordinate,
                                    resultCon: con
                                })
                                if (param !== undefined) {
                                    if (param.fj_flag == true) {
                                        this.setState({ gwTab: "fj" })
                                    }
                                }
                                if (this.state.gwTab == 'tj') {
                                    // console.log(con)
                                    this.loadJobData(con)
                                } else if (this.state.gwTab == 'fj') {
                                    let cond = {
                                        ...this.state.resultCon,
                                        ...this.state.latlong,
                                        provinceName: this.state.gps_city
                                    }
                                    // console.log(cond)
                                    this.loadNearbyJob(1, cond, true)
                                }
                            }
                        }
                    })
            })
            .catch((res) => {
                // console.log(res)
                this.loadJobData(this.state.resultCon)
                if (Platform.OS == 'android') {
                    var permissionACCESS_FINE_LOCATION = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
                    PermissionsAndroid.check(permissionACCESS_FINE_LOCATION).then(granted => {//位置权限
                        if (granted) {//已允许
                            Alert.alert('温馨提示', '请开启位置信息可查看当前城市职位信息，方便向您推荐附近的职位信息', [{
                                text: '好的', onPress: () => { }
                            }, {}
                            ])
                        } else {
                            PermissionsAndroid.request(
                                permissionACCESS_FINE_LOCATION,
                            ).then(shouldShow => {

                            });
                        }
                    })
                }
            })
    }

    // 获取平台方待办数量
    getUnreadPlatform() {
        Fetch.getJson(Config.mainUrl + '/companyInfoBF/getCompanyINfoList?type=0')
            .then((res) => {
                this.setState({
                    qyshUnreadNum: res.content.length
                })
            })
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getsecondcompanyList?type=2')
            .then((res) => {
                this.setState({
                    qyrzUnreadNum: res.content.length
                })
            })
        Fetch.getJson(Config.mainUrl + '/businessLicense/getcheckLicenseMobile?page=1' + '&rows=10&cond=' + encodeURI(JSON.stringify({ status: "1", REMARK1: "" })))
            .then((res) => {
                this.setState({
                    zzshUnreadNum: res.total
                })
            })
        Fetch.getJson(Config.mainUrl + '/temporaryWork?page=1' + '&rows=10&cond=' + encodeURI(JSON.stringify({ checkStatus: "1", releaseCompanyName: "", positionName: "" })))
            .then((res) => {
                this.setState({
                    fbshUnreadNum: res.total
                })
            })
    }
    getPlatformNum() {
        Fetch.getJson(Config.mainUrl + '/accountRegist/indexsum')
            .then((res) => {
                this.setState({
                    platformNum: res[0]
                })
            })
    }
    _loadMoreData() {
        Fetch.getJson(Config.mainUrl + '/messageAll/getMessageList')
            .then((res) => {
                if (res.length != 0) {
                    for (let i in res) {
                        if (res[i].is_open == "0") {
                            this.setState({
                                unreadMessage: true,
                            })
                            return
                        } else {
                            this.setState({
                                unreadMessage: false,
                            })
                        }
                    }
                }
            })
    }

    dataSource(result) {
        if (result != undefined) {
            if (result.length != 0 && result != "null") {
                this.setState({
                    listViewData_search: result,
                    showSearchList: true,
                    ifzero_search: false
                })
            } else if (result == '') {
                this.setState({
                    showSearchList: false,
                    ifzero_search: false

                })
            }
            else if (result == 'null') {
                this.setState({
                    showSearchList: false,
                    ifzero_search: true
                })
            }
        }
    }

    //获取未读数
    getUnreadNum() {
        var entity = {
            yfIdcard: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
            statu: 'YXF'
        }
        if (this.props.identity == 'boss') {
            return (
                null
            )
        } else {
            Fetch.postJson(Config.mainUrl + '/fqrzContract/viewPersonalContract', entity)
                .then((res) => {
                    this.setState({
                        unreadNum: res.length
                    })
                })
        }
    }

    //获取职位列表
    loadJobData(cond) {
        debugger;
        //console.log('执行了loadJobData')
        this.getUnreadNum()
        // Toast.show({
        //     type: Toast.mode.C2MobileToastLoading,
        //     title: '加载中...'
        // });
        let array = []
        //因后台原因，这里获取的是整个的职位数据，前端分页
        let url = Config.mainUrl + '/positionManagement/getPositionByPersonnelIntent?rows=10&page=1&sidx=&sord=&cond=' + encodeURI(JSON.stringify(cond))
        Fetch.getJson(url)
            .then((res) => {
                // console.log(res.contents.length)
                Toast.dismiss();
                touchEnd = true;
                var entry1 = res.contents;
                if (entry1.length < jobPageSize) {
                    for (let k = 0; k < entry1.length; k++) {
                        let itemInfo = entry1[k];
                        array.push(itemInfo)
                    }
                } else {
                    for (let k = 0; k < jobPageSize; k++) {
                        let itemInfo = entry1[k];
                        array.push(itemInfo)
                    }
                }

                if (entry1.length == 0) {
                    this.setState({
                        ifzero: true,
                        hideHeader: false,
                    })
                } else {
                    this.setState({//源数据
                        resultList: entry1,
                        resultCellList: array,
                        ifzero: false
                    })
                }
            })
    }

    //获取附近职位列表
    loadNearbyJob(pageNo, cond, isRefreash) {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
        });
        _pageNo = pageNo;
        initialState.products = this.state.resultList
        if (isRefreash) {
            initialState.products = [];
            this.setState({
                resultList: []
            })
        }
        let url = Config.mainUrl + '/positionManagement/getLocationNearForPerson?rows=10&page=' + pageNo + '&sidx=&sord=&cond=' + encodeURI(JSON.stringify(cond))
        Fetch.getJson(Config.mainUrl + '/positionManagement/getLocationNearForPerson?rows=10&page=' + pageNo + '&sidx=&sord=&cond=' + encodeURI(JSON.stringify(cond)))
            .then((res) => {
                Toast.dismiss();
                // console.log(res.contents)
                // console.log(res.total)
                var entry1 = res.contents;
                for (let i in entry1) {
                    let itemInfo = entry1[i]
                    initialState.products.push(itemInfo);
                }
                if (initialState.products.length == 0) {
                    this.setState({
                        ifzero: true,
                        hideHeader: false
                    })
                } else {
                    this.setState({
                        resultList: initialState.products,
                        ifzero: false
                    })
                    initialState.hasMoredata = true
                }
            })
    }

    //获取简历列表
    getResumeList(pageNo, cond, isRefreash) {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
        });
        _pageNo = pageNo;
        initialState.products = this.state.resumeList
        if (isRefreash) {
            initialState.products = [];
            this.setState({
                resumeList: []
            })
        }
        var url = Config.mainUrl + '/basicResume/getListByConds?rows=10&page=' + pageNo + '&sidx=&sord=&cond=' + encodeURI(JSON.stringify(cond));
        Fetch.getJson(url)
            .then((res) => {
                Toast.dismiss();
                var entry1 = res.contents;
                for (let i in entry1) {
                    let itemInfo = entry1[i]
                    initialState.products.push(itemInfo);
                }
                if (initialState.products.length == 0) {
                    this.setState({
                        ifzero_boss: true,
                        hideHeader: false
                    })
                } else {
                    this.setState({
                        resumeList: initialState.products,
                        ifzero_boss: false
                    })
                    initialState.hasMoredata = true
                }
            })
    }

    getLunbotu() {//获取轮播图片
        let docParams = {
            params: {
                businessKey: (this.props.identity == 'boss' ? "administratorkeyQiye" : "administratorkeyGeren"),
            }
        }
        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            if (entry.length == 0) {
                th.setState({
                    lunbotuList: entry,
                    ifShowlubo: true
                });
            } else {
                th.setState({
                    lunbotuList: entry,
                    ifShowlubo: false
                });
            }
        });
    }
    renderPageIndex() {
        let array = [];
        let length = this.state.lunbotuList.length;
        var style;
        for (var i = 0; i < length; i++) {
            style = (i == this.state.currentPage) ? { color: 'orange' } : { color: "#e8e8e8" }
            array.push(
                <Text key={i} style={[{ fontSize: 34 }, style]}>•</Text>
            )
        }
        return array;
    }
    onScrollBeginDrag() {
        clearInterval(this.timerBanner)
    }
    _onScrollEndDrag() {
        this.startTimer()
    }
    onAnimationEnd(e) {
        var offsetX = e.nativeEvent.contentOffset.x
        var currentPages = Math.floor(offsetX / deviceWidth)
        this.setState({
            currentPage: currentPages
        })
    }

    showLunboList() {
        var lunbotuList = this.state.lunbotuList;
        const randerlunbo = lunbotuList.map((item, index) => {
            return (
                <View style={styles.imgstyle} key={index}>
                    <Image key={index} style={styles.imgstyle} source={{ uri: Config.mainUrl + '/iframefile/qybdirprocess/' + item.filePath }} ></Image>
                </View>
            )
        })
        if (lunbotuList.length > 0) {
            return (
                // <QySwiper autoplay autoplayTimeout={5} style={{ flex: 1 }}>
                //     {randerlunbo}
                // </QySwiper>
                <View>
                    <ScrollView
                        ref={(r) => this.scrollView = r}
                        horizontal={true}
                        pagingEnabled={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        onScrollBeginDrag={(e) => this.onScrollBeginDrag(e)}
                        onScrollEndDrag={(e) => this._onScrollEndDrag(e)}
                        onMomentumScrollEnd={(e) => this.onAnimationEnd(e)}
                    >
                        {randerlunbo}

                    </ScrollView>
                    <View style={styles.pageViewStyle}>
                        {this.renderPageIndex()}
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    <ScrollView
                        ref={(r) => this.scrollView = r}
                        horizontal={true}
                        pagingEnabled={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        onScrollBeginDrag={(e) => this.onScrollBeginDrag(e)}
                        onScrollEndDrag={(e) => this._onScrollEndDrag(e)}
                        onMomentumScrollEnd={(e) => this.onAnimationEnd(e)}
                    >
                        <Image style={styles.imgstyle} source={require('../image/banner_01.png')}></Image>
                        <Image style={styles.imgstyle} source={require('../image/banner_02.png')}></Image>
                        <Image style={styles.imgstyle} source={require('../image/banner_03.png')}></Image>
                    </ScrollView>
                    <View style={styles.pageViewStyle}>
                        {this.renderPageIndex()}
                    </View>
                </View>
            )
        }
    }

    onRequestCloseQP() {
        this.setState({
            qipaoVisible: false
        })
    }
    changeQpVisible(visible) {
        this.setState({
            qipaoVisible: visible
        })
    }
    handlesaoyisao() {
        if (Platform.OS == 'android') {
            var permissionCAMERA = PermissionsAndroid.PERMISSIONS.CAMERA;
            PermissionsAndroid.check(permissionCAMERA).then(granted => {//拍照权限
                if (granted) {//已允许
                    this.changeQpVisible(false)
                    Actions.ScanCode()
                } else {
                    PermissionsAndroid.request(
                        permissionCAMERA,
                    ).then(shouldShow => {
                        if (shouldShow == 'granted') {
                            this.changeQpVisible(false)
                            Actions.ScanCode()
                        }
                    });
                }
            })
        } else {
            this.changeQpVisible(false)
            Actions.ScanCode()
        }
    }
    handlexiaoxi() {
        this.changeQpVisible(false)
        this.message()
    }
    handlebangzhu() {
        this.changeQpVisible(false)
        Actions.AdviceDM()
    }
    handleyijian() {
        this.changeQpVisible(false)
        Actions.Advice()
    }
    renderRightQipao() {
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    modalVisible={false}
                    transparent={true}
                    visible={this.state.qipaoVisible}
                    animationType={'fade'}
                    onRequestClose={() => { this.onRequestCloseQP() }}
                >
                    <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ qipaoVisible: false })}>
                    </TouchableOpacity>
                    <View style={styles.caret_up}>
                        <VectorIcon name={"caret_up"} size={24} color={'white'} style={{ backgroundColor: 'transparent' }} />
                    </View>

                    <View style={styles.qipaoModal}>

                        <TouchableOpacity onPress={() => this.handlesaoyisao()} style={styles.itemView}>
                            <VectorIcon name={'qr-scanner'} style={styles.iconStart} />
                            <View>
                                <Text style={styles.textStyle}>扫一扫</Text>
                                <View style={{ backgroundColor: '#EEEBEB', height: 1, width: 70 }} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.handlexiaoxi()} style={styles.itemView}>
                            <VectorIcon name={'message'} style={styles.iconStart} />
                            <View style={{ position: "relative" }}>
                                <Text style={styles.textStyle}>消息</Text>
                                <View style={{ backgroundColor: '#EEEBEB', height: 1, width: 70 }} />
                                {this.state.unreadMessage ?
                                    <View style={{ position: 'absolute', top: 1, right: 3, width: 18, height: 18, borderRadius: 10, backgroundColor: 'red', justifyContent: 'center', alignContent: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: 8, textAlign: 'center' }}>{this.state.UnReadNum > 99 ? '99+' : this.state.UnReadNum}</Text>
                                    </View>
                                    : null}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.handlebangzhu()} style={styles.itemView}>
                            <VectorIcon name={'help-circled'} style={styles.iconStart} />
                            <View>
                                <Text style={styles.textStyle}>帮助</Text>
                                <View style={{ backgroundColor: '#EEEBEB', height: 1, width: 70, }} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.handleyijian()} style={styles.itemView}>
                            <VectorIcon name={'edit2'} style={styles.iconStart} />
                            <View>
                                <Text style={styles.textStyle}>意见反馈</Text>
                                <View style={{ backgroundColor: '#EEEBEB', height: 1, width: 70, }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal >
            </View>
        );
    }
    handleRenderSlidetop() {
        if (Platform.OS == 'ios') {
            this.listView.scrollTo({ x: 0, y: 0, animated: true });
        } else {
            this.listView.scrollTo({ x: 0, y: 0, animated: true });
            //安卓不会调用滑动是事件onMomentumScrollEnd，强制返回
            this.setState({
                hideHeader: false
            })
        }

    }
    renderSlidetop() {
        return (
            <TouchableOpacity onPress={() => this.handleRenderSlidetop()}
                style={{ position: "absolute", width: 50, height: 50, bottom: 100, right: 10, backgroundColor: "#3E7EFE", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 25, borderColor: "#737ca5", borderWidth: 1 }}>
                <VectorIcon
                    name="double_angle_up"
                    size={24}   //图片大小
                    // color='#737ca5'  //图片颜色
                    color='#ffffff'  //图片颜色
                    style={{ backgroundColor: 'transparent' }}
                />
                <Text></Text>
            </TouchableOpacity>
        )
    }
    renderNoticeModal() {
        const { updateTips } = this.state
        return (
            <Modal
                alignSelf={'center'}
                modalVisible={false}
                transparent={true}
                animationType={'fade'}
                visible={this.state.modalVisible_notice}
                onRequestClose={() => { this.setState({ modalVisible_notice: false }) }}
            >
                <TouchableOpacity style={{ position: "absolute", height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ modalVisible_notice: false })}>
                </TouchableOpacity>
                <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignSelf: 'center' }}>
                    <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 15 }}>
                        <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>{updateTips.title}</Text></View>
                    <View style={underLiner.liners} />
                    <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 5 }}>
                        <Text style={{ color: '#666', fontSize: Config.MainFontSize }}>亲爱的“工薪易”用户：</Text>
                    </View>
                    <View style={{ paddingLeft: 32, paddingRight: 12, marginTop: 5 }}>
                        <Text style={{ color: '#666', fontSize: Config.MainFontSize }}>您好！</Text>
                    </View>
                    <View style={{ paddingLeft: 32, paddingRight: 12, marginTop: 10 }}>
                        <Text style={{ color: '#666', fontSize: Config.MainFontSize }}>{updateTips.remark}</Text>
                    </View>
                    <View style={{ paddingLeft: 32, paddingRight: 12, marginTop: 5 }}>
                        <Text style={{ color: '#666', fontSize: Config.MainFontSize, textAlign: 'right' }}>“工薪易”运维</Text>
                    </View>
                    <View style={{ paddingLeft: 32, paddingRight: 12, marginTop: 5 }}>
                        <Text style={{ color: '#666', fontSize: Config.MainFontSize, textAlign: 'right' }}>{this.timeChange(updateTips.openStartTime)}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', height: 60, justifyContent: "space-around" }}>
                        <TouchableOpacity style={{ display: 'flex', backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 3, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => this.setState({ modalVisible_notice: false })}>
                            <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>关闭</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible_notice: false })}>
                        <VectorIcon name={"android-close"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        if (this.props.identity == 'student') {
            return (
                <View style={{ flex: 1, marginBottom: 60, backgroundColor: "#e8e8e8" }} >
                    {this.state.ifzero ? this.renderHeaderJob() : null}
                    {this.state.gwTab == 'tj' ? this.showList() : this.showfjList()}
                    {this.state.hideHeader ? this.renderSlidetop() : null}
                    {this.renderNoticeModal()}
                </View>
            );
        } else if (this.props.identity == 'platform') {
            return (
                <ScrollView style={{ backgroundColor: 'white', flex: 1, marginBottom: 60 }} showsVerticalScrollIndicator={false} onPress={() => { Keyboard.dismiss() }}>
                    <View style={{ height: theme.screenHeight / 3.7, position: 'relative' }}>
                        {this.showLunboList()}
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ qipaoVisible: !this.state.qipaoVisible }) }} style={{ position: "absolute", right: 10, top: 40, backgroundColor: "transparent" }}>
                            <VectorIcon
                                name="android-menu"
                                size={24}   //图片大小
                                color='white' //图片颜色
                            />
                            {this.state.unreadMessage ?
                                <View style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 10, backgroundColor: 'red' }}>
                                </View>
                                : null}
                        </TouchableOpacity>
                        {this.renderRightQipao()}
                    </View>
                    <View style={{ marginTop: 8, marginBottom: 8, flexDirection: 'row', width: theme.screenWidth - 10, height: theme.screenHeight / 7, backgroundColor: 'white', padding: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'space-around', }}>
                        <View style={{ width: 90, height: 80 }}>
                            {this.state.qyshUnreadNum == '' || undefined ? null : <View style={{ position: 'absolute', right: 5, top: 5, width: 18.5, height: 18.5, borderRadius: 10, backgroundColor: 'red' }}>
                                <Text style={{ color: 'white', fontSize: Config.MainFontSize - 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 2.3 }}>{this.state.qyshUnreadNum}</Text>
                            </View>}
                            <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => Actions.Qiyeshenhe()}>
                                <Image source={require('../image/qysh.png')} style={{ height: 50, width: 50 }} />
                                <Text style={{ marginTop: 5, color: '#43484d' }}>企业审核</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{ width: 90, height: 80 }}>
                            {this.state.qyrzUnreadNum == '' || this.state.qyrzUnreadNum == undefined || this.state.qyrzUnreadNum == '0' ? null : <View style={{ position: 'absolute', right: 5, top: 5, width: 18.5, height: 18.5, borderRadius: 10, backgroundColor: 'red' }}>
                                <Text style={{ color: 'white', fontSize: Config.MainFontSize - 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 2.3 }}>{this.state.qyrzUnreadNum}</Text>
                            </View>}
                            <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.Qiyerenzheng()}>
                                <Image source={require('../image/qyrz.png')} style={{ height: 50, width: 50 }} />
                                <Text style={{ marginTop: 5, color: '#43484d' }}>企业认证</Text>
                            </TouchableOpacity>
                        </View> */}
                        <View style={{ width: 90, height: 80 }}>
                            {this.state.zzshUnreadNum == '' || this.state.zzshUnreadNum == undefined || this.state.zzshUnreadNum == '0' ? null : <View style={{ position: 'absolute', right: 5, top: 5, width: 18.5, height: 18.5, borderRadius: 10, backgroundColor: 'red' }}>
                                <Text style={{ color: 'white', fontSize: Config.MainFontSize - 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 2.3 }}>{this.state.zzshUnreadNum}</Text>
                            </View>}
                            <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.Zhizhaoshenhe()}>
                                <Image source={require('../image/zzsh.png')} style={{ height: 50, width: 50 }} />
                                <Text style={{ marginTop: 5, color: '#43484d' }}>执照审核</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 90, height: 80 }}>
                            {this.state.fbshUnreadNum == '' || this.state.fbshUnreadNum == undefined || this.state.fbshUnreadNum == '0' ? null : <View style={{ position: 'absolute', right: 5, top: 5, width: 18.5, height: 18.5, borderRadius: 10, backgroundColor: 'red' }}>
                                <Text style={{ color: 'white', fontSize: Config.MainFontSize - 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 2.3 }}>{this.state.fbshUnreadNum}</Text>
                            </View>}
                            <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.Fabaoshenhe()}>
                                <Image source={require('../image/fbsh.png')} style={{ height: 50, width: 50 }} />
                                <Text style={{ marginTop: 5, color: '#43484d' }}>发包审核</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <Text style={{ color: 'rgb(123,168,202)', fontSize: Config.MainFontSize + 3, fontWeight: 'bold', margin: 10, marginTop: (Platform.OS == 'ios') ? -10 : 0, marginLeft: 5 }}>数据统计</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                            {this.bxqk()}
                        </View>
                    </View>
                    <View style={{ height: (Platform.OS == 'ios') ? deviceHeight / 2 + 80 : deviceHeight + 30, width: deviceWidth, marginTop: 20, }}>
                        <WebView
                            source={{ uri: Config.mainUrl + "/f/ptSyTjMobile" }}
                            startInLoadingState={true}
                            onLoadEnd={() => { Toast.dismiss() }}
                            automaticallyAdjustContentInsets={true}
                            scrollEnabled={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            scalesPageToFit={true}
                        />
                    </View>
                    {this.renderNoticeModal()}
                </ScrollView>
            );
        }
        else {
            return (
                <View style={{ flex: 1, marginBottom: 60, backgroundColor: "#e8e8e8" }} >
                    {this.state.ifzero_boss ? this._renderHeader() : null}
                    {this.showResume()}
                    {this.state.hideHeader ? this.renderSlidetop() : null}
                    {this.renderNoticeModal()}
                </View>
            );
        }

    }
    gotoConditionFilterResume() {
        Actions.ConditionFilterResume({ selectedContionResume: this.state.selectedContionResume, onblock: this.handleConditionResume.bind(this) })
    }
    gotoConditionFilter() {
        //跳转到筛选条件页面
        Actions.ConditionFilter({ selectedContionJob: this.state.selectedContionJob, onblock: this.handleCondition.bind(this) })
    }
    handleConditionResume(resumeCondition, selectedContion, ifhadChoose) {
        this.setState({
            ifhadChoose: ifhadChoose.flag,
            selectedContionResume: selectedContion,
            resumeCon: resumeCondition
        })
        // console.log(resumeCondition)
        this.getResumeList(1, resumeCondition, true)
    }
    handleCondition(jobCondition, selectedContion, ifhadChoose) {
        let con = {
            ...jobCondition,
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            provinceName: this.state.selectedCity == '不限' ? null : this.state.selectedCity
        }
        this.setState({
            ifhadChoose: ifhadChoose.flag,
            selectedContionJob: selectedContion,
            resultCon: con
        })
        if (this.state.gwTab == 'tj') {
            // console.log(con)
            this.loadJobData(con)
        } else {
            let condition = {
                ...con,
                ...this.state.latlong,
                provinceName: this.state.gps_city
            }
            // console.log(condition)
            this.loadNearbyJob(1, condition, true)
        }
    }
    bxqk() {
        var temp = [];
        var platformNum = this.state.platformNum;
        var list = [
            { 'itemid': 'zcqy', "title": "注册企业", "num": platformNum.qyzh, "color": 'green' },
            { 'itemid': 'wdfq', "title": "注册人员", "num": platformNum.ygzh, "color": 'green' },
            { 'itemid': 'tzgg', "title": "发布信息", "num": platformNum.yfbzw, "color": 'green' },
            { 'itemid': 'wddb', "title": "合同信息", "num": platformNum.htqd, "color": 'green' },
        ];
        for (let i in list) {
            temp.push(
                <View key={i} style={{ alignItems: 'center', backgroundColor: 'white', width: deviceWidth / 4, justifyContent: 'center', borderLeftWidth: 2, borderLeftColor: '#f4f4f4' }}>
                    <View style={{ height: 5 }} />
                    <Text style={{ textAlign: 'center', fontSize: 20, color: list[i].color }}>{list[i].num}</Text>
                    <Text style={{ textAlign: 'center', marginTop: 10, color: '#43484d' }}>{list[i].title}</Text>
                    <View style={{ height: 5 }} />
                </View>
            );
        }
        return temp;
    }
    onRequestCloseFB() {
        this.setState({
            modalVisible: false
        })
    }
    chooseModal() {
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    modalVisible={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.onRequestCloseFB() }}
                >
                    <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ modalVisible: false })}>
                    </TouchableOpacity>
                    <View style={{ alignSelf: 'center', height: 275, width: deviceWidth - 40, marginTop: deviceHeight / 4, backgroundColor: 'white', position: 'absolute' }}>
                        {/* <ImageBackground source={require('../image/bg1.png')} style={{ width: deviceWidth - 40, height: deviceHeight / 4, alignSelf: 'center' }}>
                            <VectorIcon onPress={() => this.setState({ modalVisible: false })} name={'android-close'} style={{ color: 'white', fontSize: 22, position: 'absolute', right: 5, top: 5, backgroundColor: 'transparent' }} />
                            <TouchableOpacity onPress={this.PublicPosition.bind(this)} style={{ position: 'absolute', top: deviceHeight / 14, left: 10, backgroundColor: 'transparent', width: deviceWidth - 40 }}><View><Text style={{ color: 'white', fontSize: Config.MainFontSize + 4 }}>兼职与全职发布</Text></View><VectorIcon name={'chevron-right'} style={{ color: 'white', fontSize: 24, position: 'absolute', right: 20, backgroundColor: 'transparent' }} /></TouchableOpacity>
                            <View style={{ width: deviceWidth - 60, alignSelf: "center", alignItems: 'center', height: 2, backgroundColor: 'white', position: 'absolute', top: deviceHeight / 7.5 }}></View>
                            <TouchableOpacity onPress={this.Temporary.bind(this)} style={{ position: 'absolute', top: deviceHeight / 6, left: 10, backgroundColor: 'transparent', width: deviceWidth - 40 }}><View><Text style={{ color: 'white', fontSize: Config.MainFontSize + 4 }}>合伙人发包</Text></View><VectorIcon name={'chevron-right'} style={{ color: 'white', fontSize: 24, position: 'absolute', right: 20, backgroundColor: 'transparent' }} /></TouchableOpacity>
                        </ImageBackground> */}
                        <View style={{ height: 54, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#305ab2" }}>
                            <Text style={{ fontSize: Config.MainFontSize + 2, color: "white", marginLeft: 10 }}>信息发布</Text>
                            <VectorIcon onPress={() => this.setState({ modalVisible: false })} name={'android-close'} style={{ color: 'white', fontSize: 22, backgroundColor: 'transparent', marginRight: 10 }} />
                        </View>
                        <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 20 }}>
                            <TouchableOpacity onPress={this.PublicPosition.bind(this)} style={[styles.job_post, { height: 60 }]}>
                                <Text style={{ color: 'white', fontSize: Config.MainFontSize + 2 }}>兼职与全职发布</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.Temporary.bind(this)} style={[styles.job_post, { height: 60 }]}>
                                <Text style={{ color: 'white', fontSize: Config.MainFontSize + 2 }}>合伙人发包</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )

    }
    PublicPosition() {
        this.setState({
            modalVisible: false,
        })
        Actions.PublicPosition()

    }
    Temporary() {
        this.setState({
            modalVisible: false,
        })
        Actions.Temporary()

    }
    choose(data) {
        var province = (data.leftData.p_name == undefined) ? '' : data.leftData.p_name;
        var city = (data.rightData.c_name == undefined) ? '' : data.rightData.c_name;
        var area = (data.endData.a_name == undefined) ? '' : data.endData.a_name
        var value = province + city + area;
        if (data.leftData == '') {
            this.setState({
                diqu: '不限',
                showSearchList: false,
                ifzero_search: false
            });
        } else {
            this.setState({
                diqu: value,
            });
            var result = QuickSearch.search(this.state.resultList, ['ALL_ADRESS', 'like', value]);
            if (result != undefined) {
                if (result.length != 0 && result != "null") {
                    this.setState({
                        listViewData_search: result,
                        showSearchList: true,
                        ifzero_search: false
                    })
                } else if (result == '不限') {
                    this.setState({
                        showSearchList: false,
                        ifzero_search: false
                    })
                }
                else if (result == 'null') {
                    this.setState({
                        showSearchList: false,
                        ifzero_search: true
                    })
                } else if (result.length == 0) {
                    this.setState({
                        showSearchList: false,
                        ifzero_search: true
                    })
                }
            }
        }
    }
    dataSource1(resumeList) {
        if (resumeList != undefined) {
            if (resumeList.length != 0 && resumeList != "null") {
                this.setState({
                    listViewData_search: resumeList,
                    showSearchList_bos: true,
                    ifzero_search: false
                })
            } else if (resumeList == '') {
                this.setState({
                    showSearchList_bos: false,
                    ifzero_search: false

                })
            }
            else if (resumeList == 'null') {
                this.setState({
                    showSearchList_bos: false,
                    ifzero_search: true
                })
            }
        }

    }
    onEndReached2() {
        if (initialState.hasMoredata) {
            page = _pageNo + 1;
            let con = {
                ...this.state.resultCon,
                ...this.state.latlong,
                provinceName: this.state.gps_city,
            }
            // console.log(con)
            this.loadNearbyJob(page, con)
        }
    }
    _onRefresh2() {
        if (this.state.latlong.lat == 0) {
            this._getGps()
        } else {
            let con = {
                ...this.state.resultCon,
                ...this.state.latlong,
                provinceName: this.state.gps_city
            }
            this.loadNearbyJob(1, con, true)
        }
    }
    onEndReached1() {
        if (initialState.hasMoredata) {
            page = _pageNo + 1;
            this.getResumeList(page, this.state.resumeCon)
        }
    }
    _onRefresh1() {
        this.getResumeList(1, this.state.resumeCon, true)
    }
    onEndReached() {
        //page = _pageNo + 1;
        if (touchEnd == false) {
            return;
        }
        jobPageSize = jobPageSize + 10
        let array = []
        let resultList = this.state.resultList
        if (jobPageSize < resultList.length) {
            for (let k = 0; k < jobPageSize; k++) {
                let itemInfo = resultList[k];
                array.push(itemInfo)
            }
        } else {
            for (let k = 0; k < resultList.length; k++) {
                let itemInfo = resultList[k];
                array.push(itemInfo)
            }
        }
        this.setState({
            resultCellList: array
        })
    }
    _onRefresh() {
        if (this.state.latlong.lat == 0) {
            this._getGps()
        } else {
            this.loadJobData(this.state.resultCon)
        }
    }
    renderItem(rowData) {
        return (
            <View >
                <TouchableOpacity style={{ backgroundColor: '#fff' }} onPress={() => HandlerOnceTap(() => { Actions.JobInform({ rowData: rowData, onblock: this.loadJobData.bind(this, this.state.resultCon) }) })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 20, paddingTop: 10, paddingBottom: 10, width: deviceWidth - 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', maxWidth: deviceWidth / 1.8, color: '#333' }}>{rowData.POSITION_NAME}</Text>
                            {rowData.status == false ? null :
                                <View style={{ marginLeft: 10, backgroundColor: '#EE2C2C', alignItems: 'center', borderRadius: 5, height: 18, width: 44 }}>
                                    {rowData.WORK_MODE == '合伙人' ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已申请</Text> :
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已投递</Text>}
                                </View>
                            }
                            {rowData.WORK_MODE == '合伙人' && (rowData.SALARY != '' && rowData.SALARY != undefined) ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY == '面议' || rowData.SALARY == '不限') ? rowData.SALARY : rowData.SALARY + "元"} </Text> : null}
                            {(rowData.SALARY_RANGE !== '' && rowData.SALARY_RANGE !== undefined) && rowData.WORK_MODE == '抢单' ? <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY_RANGE == '面议' || rowData.SALARY_RANGE == '不限') ? rowData.SALARY_RANGE : rowData.SALARY_RANGE + "元/月"} </Text> : null}
                            {(rowData.SALARY !== '' && rowData.SALARY !== undefined) && rowData.WORK_MODE == '兼职' ? <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.SALARY}元/小时</Text> : null}
                        </View>
                        <View style={{ flexDirection: 'row', width: deviceWidth }}>
                            {rowData.AGE_REQUIRE == '' || rowData.AGE_REQUIRE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, marginBottom: 4, marginTop: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.AGE_REQUIRE}</Text>
                                </View>
                            }
                            {rowData.EDUCATION_REQUIRE == '' || rowData.EDUCATION_REQUIRE == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, marginBottom: 4, marginTop: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>学位:{rowData.EDUCATION_REQUIRE}</Text>
                                </View>
                            }
                            {rowData.WORK_YEARS == '' || rowData.WORK_YEARS == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, marginBottom: 4, marginTop: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.WORK_YEARS}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', width: deviceWidth }}>

                            {rowData.POSITION_KIND == '' || rowData.POSITION_KIND == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, marginBottom: 4, marginTop: 4 }}>
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
                                {(this.state.ifOpen[i].open) ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }} numberOfLines={2}>{rowData.REMARK}</Text> : <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }} >{rowData[i].REMARK}</Text>}

                            </View>}

                        <View style={{ position: 'absolute', bottom: 30, right: 30, flexDirection: 'row' }}>
                            {rowData.distance == '' || rowData.distance == undefined ? null :
                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                    <VectorIcon
                                        name="map_marker"
                                        size={18}
                                        color='#287ce0'
                                        style={{ backgroundColor: 'transparent', marginRight: 5 }}
                                    />
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: '#287ce0', marginRight: 5 }}>{dealDistance(rowData.distance)}</Text>
                                </View>}
                        </View>
                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 3, width: deviceWidth / 1.5, }}>{rowData.COMPANY_NAME}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, }}>{rowData.POSITION_CITY_NAME + '/'}</Text>
                                        </View>
                                    }

                                    {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: Config.MainFontSize - 4, }}>{rowData.POSITION_AREA_NAME}</Text>
                                        </View>
                                    }
                                </View>
                                {rowData.WORK_MODE == '' || rowData.WORK_MODE == undefined ? null :
                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                        {/* <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}> */}
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>{rowData.WORK_MODE}</Text>
                                        {/* </View> */}
                                        {
                                            rowData.WORK_MODE == "合伙人" || rowData.WORK_MODE == "撮合" ?
                                                // <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginLeft: 8 }}>{rowData.license == "1" ? "不需要电子营业执照" : "需要电子营业执照"}</Text>
                                                // </View>
                                                : null
                                        }
                                    </View>
                                }
                            </View>
                        </View>
                        {rowData.CREATE_TIME == '' || rowData.CREATE_TIME == undefined ? null :
                            // <View style={{ position: 'absolute', right: 20, bottom: 10, flexDirection: 'row' }}>
                            <Text style={{ width: 60, textAlign: 'right', position: 'absolute', right: 20, bottom: 10, fontSize: Config.MainFontSize - 4 }}>{this.timeChange(rowData.CREATE_TIME)}</Text>
                            // </View>
                        }
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
        )
    }
    show_forlist1(rowData) {
        var temp = [];
        for (let i in rowData) {
            if (rowData[i].ALL_ADRESS == '不限区域') {
                temp.push(
                    <View > <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={this.click.bind(this, rowData[i])}>
                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', maxWidth: deviceWidth / 1.8 }}>{rowData[i].POSITION_NAME}</Text>
                                {rowData[i].status == false ? null :
                                    <View style={{ marginLeft: 10, backgroundColor: '#EE2C2C', alignItems: 'center', borderRadius: 5, height: 18, width: 44 }}>
                                        {rowData[i].WORK_MODE == '合伙人' ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已申请</Text> :
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已投递</Text>}
                                    </View>
                                }
                                {/* <Text>fvdfvdfv</Text> */}
                                {rowData[i].SALARY_RANGE == '' || rowData[i].SALARY_RANGE == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData[i].SALARY_RANGE == '面议' || rowData[i].SALARY_RANGE == '不限') ? rowData[i].SALARY_RANGE : rowData[i].SALARY_RANGE + "元/月"} </Text>
                                }
                                {rowData[i].HOUR_SALARY == '' || rowData[i].HOUR_SALARY == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData[i].HOUR_SALARY}{rowData[i].WORK_MODE == '兼职' ? '元/小时' : rowData[i].HOUR_SALARY == '不限' ? '' : rowData[i].HOUR_SALARY == '面议' ? '' : '元/月'}</Text>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>
                                {rowData[i].AGE_REQUIRE == '' || rowData[i].AGE_REQUIRE == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData[i].AGE_REQUIRE}</Text>
                                    </View>
                                }
                                {rowData[i].EDUCATION_REQUIRE == '' || rowData[i].EDUCATION_REQUIRE == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{rowData[i].EDUCATION_REQUIRE}</Text>
                                    </View>
                                }
                                {rowData[i].WORK_MODE == '' || rowData[i].WORK_MODE == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData[i].WORK_MODE}</Text>
                                    </View>
                                }
                                {rowData[i].WORK_YEARS == '' || rowData[i].WORK_YEARS == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData[i].WORK_YEARS}</Text>
                                    </View>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>

                                {rowData[i].POSITION_KIND == '' || rowData[i].POSITION_KIND == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData[i].POSITION_KIND}</Text>
                                    </View>
                                }
                                {rowData[i].RECRUIT_NUMBER == '' || rowData[i].RECRUIT_NUMBER == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>招聘人数:{rowData[i].RECRUIT_NUMBER}人</Text>
                                    </View>
                                }
                                {rowData[i].WORK_DAY == '' || rowData[i].WORK_DAY == undefined ? null :
                                    <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 4 }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>工时:{rowData[i].WORK_DAY}小时/天</Text>
                                    </View>
                                }
                            </View>
                            {rowData[i].REMARK == '' || rowData[i].REMARK == undefined ? null :
                                <View style={{ flexDirection: 'row', marginTop: 10, width: deviceWidth / 1.3, marginBottom: 10 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>备注：</Text>
                                    {(this.state.ifOpen[i].open) ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }} numberOfLines={2}>{rowData[i].REMARK}</Text> : <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }} >{rowData[i].REMARK}</Text>}

                                </View>}
                            <View style={{ height: 20, width: deviceWidth }} />

                            {rowData[i].CREATE_TIME == '' || rowData[i].CREATE_TIME == undefined ? null :
                                <View style={{ position: 'absolute', right: 30, bottom: 10, flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>发布时间：</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.timeChange(rowData[i].CREATE_TIME)}</Text>
                                </View>
                            }
                            <View style={{ position: 'absolute', bottom: 30, right: 30, flexDirection: 'row' }}>
                                {rowData[i].POSITION_PROVINCE_NAME == '' || rowData[i].POSITION_PROVINCE_NAME == undefined ? null :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData[i].POSITION_PROVINCE_NAME}</Text>
                                    </View>
                                }
                                {rowData[i].POSITION_CITY_NAME == '' || rowData[i].POSITION_CITY_NAME == undefined ? null :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData[i].POSITION_CITY_NAME}</Text>
                                    </View>
                                }
                                {rowData[i].POSITION_AREA_NAME == '' || rowData[i].POSITION_AREA_NAME == undefined ? null :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData[i].POSITION_AREA_NAME}</Text>
                                    </View>
                                }</View>

                            <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 3, position: 'absolute', bottom: 10, width: deviceWidth / 1.5 }}>{rowData[i].COMPANY_NAME}</Text>
                        </View>
                    </TouchableOpacity>
                        <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                    </View >
                )
            } else {
                return null
            }
            return temp;
        }
    }
    show_forlist2(rowData) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: '#fff', marginLeft: 5, marginRight: 5 }} onPress={() => HandlerOnceTap(() => Actions.ResumeInform({ rowData: rowData }))}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>{rowData.intentPost}</Text>
                            {rowData.salaryRanges_xs == '' || rowData.salaryRanges_xs == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRanges_xs} </Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>

                            {rowData.educateFrom == '' || rowData.educateFrom == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>毕业学校:{rowData.educateFrom}</Text>
                                </View>
                            }
                            {rowData.highestEducation == '' || rowData.highestEducation == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{rowData.highestEducation == 'BX' ? '不限' : rowData.highestEducation == '0' ? '高中以下' : rowData.highestEducation == '1' ? '高中(职高 技校)' : rowData.highestEducation == '2' ? '中专' : rowData.highestEducation == '3' ? '大专' : rowData.highestEducation == '4' ? '本科' : rowData.highestEducation == '5' ? '硕士研究生' : rowData.highestEducation == '6' ? '博士研究生' : rowData.highestEducation == '7' ? '博士后' : null}</Text>
                                </View>
                            }
                            {rowData.workMethod == '' || rowData.workMethod == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{(rowData.workMethod == 'FQRZ' ? '兼职' : rowData.workMethod == 'LWPQ' ? '抢单' : rowData.workMethod == 'LSYG' ? '合伙人' : rowData.workMethod == 'QRZ' ? '全日制' : null)}</Text>
                                </View>
                            }
                            {rowData.workYear == '' || rowData.workYear == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.workYear}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>

                            {rowData.personName == '' || rowData.personName == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData.personName}</Text>
                                </View>
                            }
                            {rowData.age == '' || rowData.age == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.age}</Text>
                                </View>
                            }
                            {rowData.sex == '' || rowData.sex == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 6 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>性别:{rowData.sex == 'BX' ? '不限' : rowData.sex == 'FEMALE' ? '女' : rowData.sex == 'MALE' ? '男' : null}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ height: 20, width: deviceWidth }} />
                        {rowData.createTime == '' || rowData.createTime == undefined ? null :
                            <View style={{ position: 'absolute', right: 30, bottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>发布时间：</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.timeChange(rowData.createTime)}</Text>
                            </View>
                        }
                        <View style={{ position: 'absolute', bottom: 30, right: 30, flexDirection: 'row' }}>
                            {rowData.POSITION_PROVINCE_NAME == '' || rowData.POSITION_PROVINCE_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_CITY_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_AREA_NAME}</Text>
                                </View>
                            }</View>

                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 3, position: 'absolute', bottom: 10, width: deviceWidth / 1.5 }}>{rowData.COMPANY_NAME}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
        )
    }
    renderjobSeachItem() {
        return (<View style={{ display: 'flex', height: 35, position: 'absolute', flexDirection: 'row', top: 45, width: theme.screenWidth, backgroundColor: 'transparent' }}>
            <TouchableOpacity activeOpacity={1} onPress={() => this.mine()} style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", height: 30, marginRight: 16, maxWidth: 89, minWidth: 70 }}>
                <Image source={require('../image/icon/icon_map.png')} style={{ paddingBottom: 6, backgroundColor: 'transparent', width: 18, height: 18, }}></Image>
                <Text style={{ fontSize: Config.MainFontSize, color: "#fff", }}>{this.state.selectedCity == '' ? '切换' : this.state.selectedCity}</Text>
                {/* <VectorIcon
                        name="sort_down"
                        size={18}   //图片大小
                        color='white'  //图片颜色
                        style={{ paddingBottom: 6, backgroundColor: 'transparent' }}
                    /> */}
                {/* icon_map.png */}
            </TouchableOpacity>
            <View style={{ width: theme.screenWidth - 100 - 89, backgroundColor: 'transparent', borderRadius: 30, marginTop: 4 }}>
                <QySearch rowData={this.state.resultList} //搜索的数据源
                    searchResult={(result) => this.dataSource(result)}  //搜索成功后返回的数据，如何处理需自己处理
                    theme={2}
                    placeholderText='搜索自己心仪的职位'
                    values={"COMPANY"}
                />
            </View>
            <TouchableOpacity style={{ position: "relative", width: 50 }} activeOpacity={1} onPress={() => this.handlesaoyisao()} style={{ paddingLeft: 10, paddingTop: 5 }}>
                {/* <VectorIcon
                    name="android-menu"
                    size={24}   //图片大小
                    color='white' //图片颜色
                />
                {this.state.unreadMessage ?
                    <View style={{ position: 'absolute', top: 5, right: 0, width: 8, height: 8, borderRadius: 10, backgroundColor: 'red' }}>
                    </View>
                    : null} */}
                <Image source={require('../image/icon/icon_saoyisao.png')} style={{ paddingBottom: 6, backgroundColor: 'transparent', width: 24, height: 24, marginLeft: 12 }}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{ position: "relative", width: 50 }} activeOpacity={1} onPress={() => this.handlexiaoxi()} style={{ paddingLeft: 10, paddingTop: 5 }}>
                {/* <VectorIcon
                    name="android-menu"
                    size={24}   //图片大小
                    color='white' //图片颜色
                />
                {this.state.unreadMessage ?
                    <View style={{ position: 'absolute', top: 5, right: 0, width: 8, height: 8, borderRadius: 10, backgroundColor: 'red' }}>
                    </View>
                    : null} */}
                <Image source={require('../image/icon/icon_Xx.png')} style={{ paddingBottom: 6, backgroundColor: 'transparent', width: 24, height: 24, }}></Image>
                {this.state.unreadMessage ?
                    <View style={{ position: 'absolute', top: 5, right: 0, width: 8, height: 8, borderRadius: 10, backgroundColor: 'red' }}>
                    </View>
                    : null}
            </TouchableOpacity>
            {this.renderRightQipao()}
        </View>)
    }
    renderHeaderJob() {
        return (<View>
            <View style={{ height: 88, backgroundColor: '#3E7EFE', }}>
                {this.renderjobSeachItem()}
            </View>
            <View style={{ backgroundColor: '#ffff' }}>
                <View style={{ width: deviceWidth - 30, margin: 15 }}>
                    {this.showLunboList()}
                    {/* {this.renderjobSeachItem()} */}
                </View>
            </View>
            <View style={{ flexDirection: 'row', width: theme.screenWidth, backgroundColor: 'white', padding: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'space-around', }}>
                <View style={{ width: 90, height: 80 }}>
                    <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.MyApplicate()}>
                        <Image source={require('../image/wdsqs.png')} style={{ height: 40, width: 40 }} />
                        <Text style={{ marginTop: 5, color: '#43484d' }}>工作申请</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: 90, height: 80 }}>
                    {this.state.unreadNum == '' || undefined ? null : <View style={{ position: 'absolute', right: 10, top: 2, width: 18.5, height: 18.5, borderRadius: 10, backgroundColor: 'red' }}>
                        <Text style={{ color: 'white', fontSize: Config.MainFontSize - 5, alignContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 3.3 }}>{this.state.unreadNum}</Text>
                    </View>}
                    <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => Actions.UndeterminedContract()}>
                        <Image source={require('../image/dqhts.png')} style={{ height: 40, width: 40 }} />
                        <Text style={{ marginTop: 5, color: '#43484d' }}>待签合同</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ width: 90, height: 80 }}>
                    <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.MySalary()}>
                        <Image source={require('../image/zwsss.png')} style={{ height: 40, width: 40 }} />
                        <Text style={{ marginTop: 5, color: '#43484d' }}>薪资收入</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: 90, height: 80 }}>
                    <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.MyJob()}>
                        <Image source={require('../image/wdgzs.png')} style={{ height: 40, width: 40 }} />
                        <Text style={{ marginTop: 5, color: '#43484d' }}>我的工作</Text>
                    </TouchableOpacity>
                </View>

            </View>
            {/* {
                this.state.hideHeader ? <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    {this.renderjobSeachItem()}
                    {this.renderSlidetop()}
                </ImageBackground> : null
            } */}

            <View style={{ backgroundColor: 'white', width: deviceWidth, alignSelf: 'center', marginTop: 1 }}>
                <Text style={{ color: '#333', fontSize: Config.MainFontSize + 3, fontWeight: '600', marginLeft: 20, marginTop: 17 }}>职位推荐</Text>
                <View style={{ height: 40, width: theme.screenWidth, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.handleTouchtj()}>
                        <View style={{ backgroundColor: 'transparent', flexDirection: 'column', alignItems: 'center', marginLeft: 18 }}>
                            <Text style={{ fontSize: Config.MainFontSize + 1, fontWeight: 'bold', margin: 10, textAlign: 'center', color: this.state.gwTab == 'tj' ? "#3E7EFE" : "#c2c2c2" }}>推荐</Text>
                            <View style={{ height: 2, backgroundColor: this.state.gwTab == 'tj' ? "#3E7EFE" : "#fff", width: 14 }}></View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.handleTouchfj()}>
                        <View style={{ backgroundColor: 'transparent', flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={{ fontSize: Config.MainFontSize + 1, fontWeight: 'bold', margin: 10, textAlign: 'center', color: this.state.gwTab == "fj" ? "#3E7EFE" : "#c2c2c2" }}>附近</Text>
                            <View style={{ height: 2, backgroundColor: this.state.gwTab == 'fj' ? "#3E7EFE" : "#fff", width: 14 }}></View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', right: 20, flexDirection: "row" }} onPress={() => this.gotoConditionFilter()}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, margin: 10, maxWidth: 250, color: this.state.ifhadChoose == true ? "#287ce0" : "#8d8d8d" }}>筛选</Text>
                        <VectorIcon
                            name="chevron_down"
                            size={12}   //图片大小
                            color='#bebebe' //图片颜色
                            style={{ alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
                {/* <ListViewChooseContainer
                    visible={this.state.visibleReferees}
                    top={90}//这个用来控制与顶部距离
                    theme={'diqu'}  //project表示项目，year表示选择年份，year-month表示选择年月。注释这行选择公司，部门
                    onCancel={() => { this.setState({ visibleReferees: false }); return null; }}
                    callbackData={(data) => this.choose(data)} /> */}
                <View style={underLiner.liners} />
            </View>
        </View>
        )
    }



    onScrollEndDrag(e) {//手指松开滑的偏移量，触发率高且不准确
        const contentOffset = e.nativeEvent.contentOffset.y
        if (contentOffset > 200) {
            this.setState({
                hideHeader: true
            })
        } else {
            this.setState({
                hideHeader: false
            })
        }
    }
    onMomentumScrollEnd(e) {//一共滑的偏移量，触发率低、偶尔会出bug
        // 偏移量
        const contentOffset = e.nativeEvent.contentOffset.y
        if (contentOffset > 200) {
            this.setState({
                hideHeader: true
            })
        } else {
            this.setState({
                hideHeader: false
            })
        }
    }
    _onScroll(e) {//触发率高，但很灵敏
        const contentOffset = e.nativeEvent.contentOffset.y
        if (contentOffset > 200) {
            this.setState({
                hideHeader: true
            })
        } else {
            this.setState({
                hideHeader: false
            })
        }
    }

    showList() {
        if (this.state.ifzero || touchEnd == false) {
            return (
                <View style={{ height: deviceHeight / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff", marginLeft: 5, marginRight: 5 }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无推荐职位～</Text>
                </View>
            )
        } else {
            return (
                <ListView
                    ref={(r) => this.listView = r}
                    renderHeader={this.renderHeaderJob.bind(this)}
                    dataSource={this.ds.cloneWithRows(this.state.resultCellList)}
                    renderRow={this.renderItem.bind(this)}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={10}
                    //onScrollEndDrag={(e) => this.onScrollEndDrag(e)}
                    //onMomentumScrollEnd={(e) => this.onMomentumScrollEnd(e)}
                    onScroll={(e) => this._onScroll(e)}
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
                />
            )
        }
    }
    showfjList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff", marginLeft: 5, marginRight: 5 }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无附近职位～</Text>
                </View>
            )
        } else {
            return (
                <ListView
                    ref={(r) => this.listView = r}
                    renderHeader={this.renderHeaderJob.bind(this)}
                    dataSource={this.ds.cloneWithRows(this.state.resultList)}
                    renderRow={this.renderItem.bind(this)}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached2.bind(this)}
                    onEndReachedThreshold={10}
                    // onScrollEndDrag={(e) => this.onScrollEndDrag(e)}
                    // onMomentumScrollEnd={(e) => this.onMomentumScrollEnd(e)}
                    onScroll={(e) => this._onScroll(e)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh2()}
                            tintColor="#999999"
                            title="加载中..."
                            titleColor="#999999"
                            colors={['#287ce0', '#00ff00', '#0000ff']}
                            progressBackgroundColor={'#fff'}
                        />
                    }
                />
            )
        }
    }
    renderReaumeSeachTop() {
        return (
            <View style={{ height: 35, position: 'absolute', flex: 1, flexDirection: 'row', left: 10, top: 40, width: theme.screenWidth, backgroundColor: 'transparent' }}>
                {/* <TouchableOpacity activeOpacity={1} onPress={this.mineBoss.bind(this)} style={{ marginTop: 5, marginRight: 10 }}>
                    <VectorIcon
                        name="person_pin"
                        size={24}   //图片大小
                        color='white'  //图片颜色
                        style={{ alignSelf: 'center', backgroundColor: 'transparent' }}
                    />
                </TouchableOpacity> */}
                <View style={{ width: theme.screenWidth / 1.2, backgroundColor: 'transparent', height: 45, marginTop: 10, alignSelf: 'center', marginLeft: 10 }}>
                    {/* <QySearch1 //搜索的数据源
                        rowData={this.state.resumeList}
                        searchResult={(resumeList) => this.dataSource1(resumeList)}  //搜索成功后返回的数据，如何处理需自己处理
                        theme={2}
                        values={"COMPANY_NAME"}
                    /> */}
                    <View style={{
                        backgroundColor: 'white', flexDirection: 'row', height: 35, borderRadius: 10
                    }}  >
                        <VectorIcon name='ios-search' size={20} style={{ alignSelf: 'center', marginLeft: 15, color: '#999' }} />
                        <TextInput
                            //ref={"testref"}
                            style={styles.textInput1}
                            autoFocus={false}
                            underlineColorAndroid="transparent"
                            placeholder="职位/意向岗位搜索"
                            placeholderTextColor="#999"
                            onBlur={(text) => { this.onBlur(text) }}
                            ///clearButtonMode={"always"}
                            value={this.state.postvalue}
                            //returnKeyLabel={'search'}
                            onChangeText={this.getPostValue.bind(this)}
                        ></TextInput>
                    </View>
                </View>
                {/* <TouchableOpacity activeOpacity={1} onPress={this.message.bind(this)} style={{ marginLeft: 10, marginTop: 5 }}>
                    <VectorIcon
                        name="chatbubble-working"
                        size={20}   //图片大小
                        color='white' //图片颜色
                        style={{ alignSelf: 'center', backgroundColor: 'transparent' }}
                    />
                    {this.state.unreadMessage ?
                        <View style={{ position: 'absolute', right: 0.1, top: 0.1, width: 8, height: 8, borderRadius: 10, backgroundColor: 'red' }}>
                        </View>
                        : null}
                </TouchableOpacity> */}
                <TouchableOpacity activeOpacity={1} onPress={() => { this.setState({ qipaoVisible: !this.state.qipaoVisible }) }} style={{ paddingLeft: 10, paddingTop: 5 }}>
                    <VectorIcon
                        name="android-menu"
                        size={24}   //图片大小
                        color='white' //图片颜色
                    />
                    {this.state.unreadMessage ?
                        <View style={{ position: 'absolute', top: 5, right: 0, width: 8, height: 8, borderRadius: 10, backgroundColor: 'red' }}>
                        </View>
                        : null}
                </TouchableOpacity>
                {this.renderRightQipao()}
            </View>
        )
    }
    onBlur() {
        var value = this.state.postvalue
        if (value != '') {
            let con = {
                ...this.state.resumeCon,
                intentPost: value
            }
            this.getResumeList(1, con, true)
        }
    }
    _renderHeader() {
        return (<View>
            <View >
                <View style={{ height: 88, backgroundColor: '#3E7EFE', }}>
                    {this.renderReaumeSeachTop()}
                </View>
                <View style={{ backgroundColor: '#ffff' }}>
                    <View style={{ width: deviceWidth - 30, margin: 15 }}>
                        {this.showLunboList()}
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 8, marginBottom: 8, flexDirection: 'row', width: theme.screenWidth - 10, height: theme.screenHeight / 7, backgroundColor: 'white', padding: 5, alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'space-around', }}>
                <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                    <Image source={require('../image/zzfb.png')} style={{ height: 50, width: 50 }} />
                    <Text style={{ marginTop: 5, color: '#43484d' }}>信息发布</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.ResumeSearch()}>
                    <Image source={require('../image/jlss.png')} style={{ height: 50, width: 50 }} />
                    <Text style={{ marginTop: 5, color: '#43484d' }}>应聘简历</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Actions.PersonFiltrate()}>
                    <Image source={require('../image/rysx.png')} style={{ height: 50, width: 50 }} />
                    <Text style={{ marginTop: 5, color: '#43484d' }}>结算查询</Text>
                </TouchableOpacity>
            </View>
            {/* {
                this.state.hideHeader ? <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    {this.renderReaumeSeachTop()}
                </ImageBackground> : null
            } */}
            <View style={{ backgroundColor: 'white', width: deviceWidth - 10, alignSelf: 'center' }}>
                <View style={{ height: 40, width: theme.screenWidth - 10, backgroundColor: 'white', flexDirection: 'row' }}>
                    <View style={{ backgroundColor: 'transparent' }}>
                        <Text style={{ fontSize: Config.MainFontSize + 3, fontWeight: 'bold', margin: 10 }}>简历</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: 'transparent', position: 'absolute', right: 10, flexDirection: "row" }} onPress={() => this.gotoConditionFilterResume()}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, margin: 10, maxWidth: 250, color: this.state.ifhadChoose == true ? "#287ce0" : "#8d8d8d" }}>筛选</Text>
                        <VectorIcon
                            name="chevron_down"
                            size={12}   //图片大小
                            color='#bebebe' //图片颜色
                            style={{ alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={underLiner.liners} />
                {this.chooseModal()}
            </View></View>
        )
    }
    showResume() {
        if (this.state.ifzero_boss) {
            return (
                <View style={{ height: deviceHeight / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: "#fff", marginLeft: 5, marginRight: 5 }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无简历～</Text>
                </View>
            )
        } else {
            return (
                <ListView
                    ref={(r) => this.listView = r}
                    renderHeader={this._renderHeader.bind(this)}
                    dataSource={this.ds.cloneWithRows(this.state.resumeList)}
                    renderRow={this.show_forlist2.bind(this)}
                    enableEmptySections={true}
                    onEndReached={this.onEndReached1.bind(this)}
                    onEndReachedThreshold={10}
                    // onScrollEndDrag={(e) => this.onScrollEndDrag(e)}
                    // onMomentumScrollEnd={(e) => this.onMomentumScrollEnd(e)}
                    onScroll={(e) => this._onScroll(e)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this._onRefresh1()}
                            tintColor="#999999"
                            title="加载中..."
                            titleColor="#999999"
                            colors={['#287ce0', '#00ff00', '#0000ff']}
                            progressBackgroundColor={'#fff'}
                        />
                    }
                />
            )
        }
    }
    handleTouchfj() {
        if (this.state.latlong.lat == 0) {
            // Alert.alert('温馨提示', '请开启位置信息可查看当前城市职位信息，方便向您推荐附近的职位信息', [{
            //     text: '好的', onPress: () => {
            //         this.timerOut = setTimeout(
            //             () => this._getGps(),
            //             1000
            //         );
            //     }
            // }, {}
            // ])
            this._getGps({ fj_flag: true })
            return
        }
        this.setState({
            gwTab: "fj"
        })
        let con = {
            ...this.state.resultCon,
            ...this.state.latlong,
            provinceName: this.state.gps_city,
        }
        // console.log(con)
        this.loadNearbyJob(1, con, true)
    }
    handleTouchtj() {
        this.setState({
            gwTab: "tj"
        })
        // console.log(this.state.resultCon)
        this.loadJobData(this.state.resultCon)
    }
    getPostValue(value) {
        if (value == '') {
            let con = {
                ...this.state.resumeCon,
                intentPost: value
            }
            this.getResumeList(1, con, true)
        }
        this.setState({
            postvalue: value
        })
    }
    message() {
        Actions.NoticelistFragment();
    }
    mine() {
        //Actions.ApplicationFragment({ theme: '1', identity: 'student' });
        //Actions.CityChoose();
        //跳转到选择城市，启用
        HandlerOnceTap(() => { Actions.CitySelect({ onblock: this.handleChangeCity.bind(this) }); })

    }
    handleChangeCity(value, param) {
        let con = {
            ...this.state.resultCon,
            provinceName: value,
        }
        if (value == '不限') {
            con = {
                ...this.state.resultCon,
                provinceName: null,
            }
        }
        // console.log(con)
        this.loadJobData(con)
        this.setState({
            selectedCity: value,
            resultCon: con,
            gwTab: 'tj'
        })
    }
    mineBoss() {
        Actions.ApplicationFragment({ theme: '1', identity: 'boss' });
    }
    click() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '加载中···',
            duration: 1000,
        });
        Actions.JobInform({ rowData: rowData, onblock: this.getJobInform.bind(this) })
    }
    _renderItem1(rowData, index, i) {
        // if (rowData.POSITION_STATUS == 'FB' && rowData.ALL_ADRESS == '不限区域') {
        if (rowData.ALL_ADRESS == '不限区域') {
            return (
                <View>
                    <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={this.click.bind(this, rowData)}>
                        <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', maxWidth: deviceWidth / 1.8 }}>{rowData.POSITION_NAME}</Text>
                                {rowData.status == false ? null :
                                    <View style={{ marginLeft: 10, backgroundColor: '#EE2C2C', alignItems: 'center', borderRadius: 5, height: 18, width: 44 }}>
                                        {rowData.WORK_MODE == '合伙人' ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已申请</Text> :
                                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已投递</Text>}
                                    </View>
                                }
                                {rowData.SALARY_RANGE == '' || rowData.SALARY_RANGE == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY_RANGE == '面议' || rowData.SALARY_RANGE == '不限') ? rowData.SALARY_RANGE : rowData.SALARY_RANGE + "元/月"} </Text>
                                }
                                {rowData.HOUR_SALARY == '' || rowData.HOUR_SALARY == undefined ? null :
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.HOUR_SALARY}{rowData.WORK_MODE == '兼职' ? '元/小时' : rowData.HOUR_SALARY == '不限' ? '' : rowData.HOUR_SALARY == '面议' ? '' : '元/月'}</Text>
                                }
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
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>发布时间：</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.timeChange(rowData.CREATE_TIME)}</Text>
                                </View>
                            }
                            <View style={{ position: 'absolute', bottom: 30, right: 30, flexDirection: 'row' }}>
                                {rowData.POSITION_PROVINCE_NAME == '' || rowData.POSITION_PROVINCE_NAME == undefined ? null :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                    </View>
                                }
                                {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_CITY_NAME}</Text>
                                    </View>
                                }
                                {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_AREA_NAME}</Text>
                                    </View>
                                }</View>

                            <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 3, position: 'absolute', bottom: 10, width: deviceWidth / 1.5 }}>{rowData.COMPANY_NAME}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                </View >
            )

        } else {
            return (
                null
                // <View style={{ height: deviceHeight / 2 - 60, alignItems: 'center', justifyContent: 'center' }}>
                //     <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                //     <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 20 }}>当前无搜索职位～</Text>
                // </View>
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
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', maxWidth: deviceWidth / 1.8 }}>{rowData.POSITION_NAME}</Text>
                            {rowData.status == false ? null :
                                <View style={{ marginLeft: 10, backgroundColor: '#EE2C2C', alignItems: 'center', borderRadius: 5, height: 18, width: 44 }}>
                                    {rowData.WORK_MODE == '合伙人' ? <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已申请</Text> :
                                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', paddingTop: 2 }}>已投递</Text>}
                                </View>
                            }
                            {rowData.WORK_MODE == '合伙人' && rowData.SALARY != '' && rowData.SALARY != undefined ?
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY == '面议' || rowData.SALARY == '不限') ? rowData.SALARY : rowData.SALARY + "元"} </Text> : null}
                            {rowData.SALARY_RANGE == '' || rowData.SALARY_RANGE == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{(rowData.SALARY_RANGE == '面议' || rowData.SALARY_RANGE == '不限') ? rowData.SALARY_RANGE : rowData.SALARY_RANGE + "元/月"} </Text>
                            }
                            {rowData.HOUR_SALARY == '' || rowData.HOUR_SALARY == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.HOUR_SALARY}{rowData.WORK_MODE == '兼职' ? '元/小时' : rowData.HOUR_SALARY == '不限' ? '' : rowData.HOUR_SALARY == '面议' ? '' : '元/月'}</Text>
                            }
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
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>发布时间：</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.timeChange(rowData.CREATE_TIME)}</Text>
                            </View>
                        }
                        <View style={{ position: 'absolute', bottom: 30, right: 30, flexDirection: 'row' }}>
                            {rowData.POSITION_PROVINCE_NAME == '' || rowData.POSITION_PROVINCE_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_CITY_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_AREA_NAME}</Text>
                                </View>
                            }</View>

                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 3, position: 'absolute', bottom: 10, width: deviceWidth / 1.5 }}>{rowData.COMPANY_NAME}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
        )

        // } else {
        //     return null
        // }
    }
    _renderItemResume(rowData, i) {
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => Actions.ResumeInform({ rowData: rowData })}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>{rowData.intentPost}</Text>
                            {rowData.salaryRanges == '' || rowData.salaryRanges == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20 }}>{rowData.salaryRanges == 'BX' ? '不限' : rowData.salaryRanges == 'MY' ? '面议' : rowData.salaryRanges == 'LQYX' ? '2000以下 元/月' : rowData.salaryRanges == 'LQDSQ' ? '2000-3000元/月' : rowData.salaryRanges == 'SQDSQW' ? '3000-4500元/月' : rowData.salaryRanges == 'SQWDLQ' ? '4500-6000元/月' : rowData.salaryRanges == 'LQDBQ' ? '6000-8000元/月' : rowData.salaryRanges == 'BQDYW' ? '8000-10000元/月' : rowData.salaryRanges == 'YWYS' ? '10000以上 元/月' : null} </Text>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: deviceWidth }}>

                            {rowData.educateFrom == '' || rowData.educateFrom == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>毕业学校:{rowData.educateFrom}</Text>
                                </View>
                            }
                            {rowData.highestEducation == '' || rowData.highestEducation == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>学位:{rowData.highestEducation == 'BX' ? '不限' : rowData.highestEducation == '0' ? '高中以下' : rowData.highestEducation == '1' ? '高中(职高 技校)' : rowData.highestEducation == '2' ? '中专' : rowData.highestEducation == '3' ? '大专' : rowData.highestEducation == '4' ? '本科' : rowData.highestEducation == '5' ? '硕士研究生' : rowData.highestEducation == '6' ? '博士研究生' : rowData.highestEducation == '7' ? '博士后' : null}</Text>
                                </View>
                            }
                            {rowData.workMethod == '' || rowData.workMethod == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{(rowData.workMethod == 'FQRZ' ? '兼职' : rowData.workMethod == 'LWPQ' ? '抢单' : rowData.workMethod == 'LSYG' ? '合伙人' : rowData.workMethod == 'QRZ' ? '全日制' : null)}</Text>
                                </View>
                            }
                            {rowData.workYear == '' || rowData.workYear == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', }}>工作年限:{rowData.workYear}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ flexDirection: 'row', paddingBottom: 10, width: deviceWidth }}>

                            {rowData.personName == '' || rowData.personName == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginTop: 1 }}>{rowData.personName}</Text>
                                </View>
                            }
                            {rowData.age == '' || rowData.age == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>年龄:{rowData.age}</Text>
                                </View>
                            }
                            {rowData.sex == '' || rowData.sex == undefined ? null :
                                <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 6 }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>性别:{rowData.sex == 'BX' ? '不限' : rowData.sex == 'FEMALE' ? '女' : rowData.sex == 'MALE' ? '男' : null}</Text>
                                </View>
                            }
                        </View>
                        {/* {rowData.email == '' || rowData.email == undefined ? null :
                            <View style={{ padding: 3, backgroundColor: '#F2F2F2', alignItems: 'center', marginRight: 4, height: 20, width: deviceWidth / 1.8 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey' }}>email:{rowData.email}</Text>
                            </View>
                        } */}
                        <View style={{ height: 20, width: deviceWidth }} />

                        {rowData.createTime == '' || rowData.createTime == undefined ? null :
                            <View style={{ position: 'absolute', right: 30, bottom: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>发布时间：</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{this.timeChange(rowData.createTime)}</Text>
                            </View>
                        }
                        <View style={{ position: 'absolute', bottom: 30, right: 30, flexDirection: 'row' }}>
                            {rowData.POSITION_PROVINCE_NAME == '' || rowData.POSITION_PROVINCE_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929' }}>{rowData.POSITION_PROVINCE_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_CITY_NAME == '' || rowData.POSITION_CITY_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_CITY_NAME}</Text>
                                </View>
                            }
                            {rowData.POSITION_AREA_NAME == '' || rowData.POSITION_AREA_NAME == undefined ? null :
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 4, color: '#292929', marginLeft: 10 }}>{rowData.POSITION_AREA_NAME}</Text>
                                </View>
                            }</View>

                        <Text numberOfLines={1} style={{ fontSize: Config.MainFontSize - 3, position: 'absolute', bottom: 10, width: deviceWidth / 1.5 }}>{rowData.COMPANY_NAME}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View >
        )
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
function dealDistance(num) {
    let result = parseFloat(num);
    if (result > 1000) {
        let ret = parseFloat(num / 1000)
        return Math.round(ret * 10) / 10 + 'km'
    } else {
        return num + 'm'
    }
}
function keepSixDecimal(num) {//保留6位小数
    var result = parseFloat(num);
    if (isNaN(result)) {
        return
    }
    result = Math.round(num * 1000000) / 1000000;
    return result
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
        flex: 1,
        height: (theme.screenWidth - 30) * (320 / 710),
        // theme.screenHeight / 3.5
        width: theme.screenWidth - 30,
        borderRadius: 4
    },

    itemView: {
        height: 40,
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    qipaoModal: {
        position: "absolute",
        right: Platform.OS == 'ios' ? 5 : 10,
        top: Platform.OS == 'ios' ? 75 : 55,
        width: 120,
        backgroundColor: "#fff",
        // borderWidth: 1,
        // borderColor: "#EEEBEB",
        borderRadius: 10,
    },
    textStyle: {
        color: "#353535"
    },
    iconStart: {
        color: "#404040",
        marginLeft: 10,
        marginRight: 10
    },
    textInput1: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        fontSize: 14,
        padding: 0,
        paddingLeft: 5,
        borderRadius: 10,
    },
    caret_up: {
        position: "absolute",
        right: Platform.OS == 'ios' ? 20 : 25,
        top: Platform.OS == 'ios' ? 58 : 38,
        //'width: 100
    },
    job_post: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        width: deviceWidth / 2,
        backgroundColor: "#648de2",
        borderWidth: 1,
        borderColor: "#5b83d8",
        borderRadius: 40,
    },
    pageViewStyle: {
        display: "flex",
        width: deviceWidth - 30,
        height: 25,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center'
    }
});
