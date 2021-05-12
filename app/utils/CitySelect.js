
/**
 * 城市选择
 * 郭亚新（2020/3/31）
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    ImageBackground,
    Dimensions,
    StatusBar,
    ScrollView,
    Platform,
    PermissionsAndroid,
    Alert,
    BackHandler
} from 'react-native';
import { NavigationBar, VectorIcon, Actions, Config, Fetch, Camera, Cookies, ImagePicker, UserInfo, ActionSheet, Toast, UUID } from 'c2-mobile';
import { C2AmapApi } from 'c2-mobile-amap';
import Utils from './common/Utils'
import cityContent from './city.json'
import Toasts from 'react-native-root-toast';
import CoordinateTrans from '../utils/CoordinateTrans';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
const CITYHEIGHT = 30;//右侧字母导航的宽度
const TITLEHEIGHT = 40;
const DESCHEIGHT = 25;
const CITYHEIGHT2 = 30;
const selectWidth = 80;//中间的字母的背景宽高

export default class CitySelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationtip: '定位中',
            latlong: { lat: 0, lng: 0 },//当前经纬度
            sections: [],
            cityArray: [],
            cityBase: [],
            showFlag: true,
            cuurCity: '',//选择的城市
            isTouchDown: false,//触摸事件开始,类型android的onTouchDown
            selectText: ''//当前选择的字母
        }
        // 特殊栏目的数量 （定位，热门，常用）
        descNumber = 0;
        // 和上面对应的item 的数量。三个的总数
        city2number = 0;
        // 每个栏目前面城市的数量
        titleCityArray = [0],
            // 右侧导航中 特殊栏目的数量。
            this.letterDescNumber = 0;

        this._moveAction = this._moveAction.bind(this);
        this._getItemLayout = this._getItemLayout.bind(this);
        if (Platform.OS == 'android') {
            C2AmapApi.initService({
                apiKey: 'f1e98431de6fcdbfb9071b9e8cc56061'
            });
        } else {
            C2AmapApi.initService({
                apiKey: '2a79d9bfda5534d33c3eb959fc805569'
            });
        }
    }

    static navigationOptions = {
        header: null,
    };
    openQuanxian() {
        if (Platform.OS == 'android') {
            var permissionACCESS_FINE_LOCATION = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
            PermissionsAndroid.check(permissionACCESS_FINE_LOCATION).then(granted => {//位置权限
                if (granted) {//已允许
                } else {
                    PermissionsAndroid.request(
                        permissionACCESS_FINE_LOCATION,
                    ).then(shouldShow => {

                    });
                }
            })
        }
    }
    _getGps() {
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
                        var citytemp = JSON.parse(res.result.str)
                        console.log(citytemp)
                        var city = citytemp.result.addressComponent.city
                        if (result.coordinate.latitude == '0.000000') {
                            Toast.showInfo('请开启定位', 2000)
                        } else {
                            Toast.dismiss();
                            if (city == '') {//频繁定位没有解析好位置
                                // this.setState({
                                //     locationtip: '定位失败'
                                // })
                                // this.timerOut = setTimeout(
                                //     () => this._getGps(),
                                //     1000
                                // );
                                setTimeout(() => {
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
                                let bd_Coordinate = CoordinateTrans.gps_bgps(result.coordinate.longitude, result.coordinate.latitude)
                                let coordinate = {
                                    lat: keepSixDecimal(bd_Coordinate.bd_lat),
                                    lng: keepSixDecimal(bd_Coordinate.bd_lng)
                                }
                                this.setState({
                                    cuurCity: city,
                                    latlong: coordinate
                                })
                            }
                        }
                    })
            })
            .catch((error) => {
                Toast.dismiss();
                this.setState({
                    locationtip: '定位失败'
                })
                if (Platform.OS == 'android') {
                    var permissionACCESS_FINE_LOCATION = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
                    PermissionsAndroid.check(permissionACCESS_FINE_LOCATION).then(granted => {//位置权限
                        if (granted) {//已允许
                            Toasts.show('定位失败，请检查位置信息是否开启', { position: -160 });
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
    reloadGps() {
        Alert.alert('未定位到准确位置', '是否重新定位', [{ text: '取消' }, { text: '确定', onPress: () => this._getGps() }])
    }
    /*用户手指开始触摸*/
    responderGrant(event) {
        this.scrollSectionList(event);
        this.setState({
            isTouchDown: true,
        })
    }
    /*用户手指在屏幕上移动手指，没有停下也没有离开*/
    responderMove(event) {
        console.log("responderMove")
        this.scrollSectionList(event);
        this.setState({
            isTouchDown: true,
        })
    }
    /*用户手指离开屏幕*/
    responderRelease(event) {
        console.log("onTouchUp")
        this.setState({
            isTouchDown: false,
        })
    }
    /*手指滑动，触发事件*/
    scrollSectionList(event) {
        //执行范围控制
        const touch = event.nativeEvent.touches[0];
        if (touch.pageY >= Config.topHeight + (93 - Utils.statusBarHeight * 2) + 30 + 50
            && touch.pageY <= Config.topHeight + (93 - Utils.statusBarHeight * 2) + 30 + 50 + 23 * 20
            && touch.pageX >= deviceWidth - CITYHEIGHT
            && touch.pageX <= deviceWidth
        ) {
            //index = touch.pageY - 上面留白的所有高度(顶部菜单，搜索框、定位、margintop值) / 每个字母的高度
            const index = (touch.pageY - Config.topHeight - (93 - Utils.statusBarHeight * 2) - 30 - 50) / 20;
            let lettertemp = this.state.listData[Math.round(index)]
            if (Math.round(index) >= 0 && Math.round(index) <= 23) {
                this.setState({
                    selectText: lettertemp
                })
                if (Math.round(index) == 0) {
                    lettertemp = lettertemp + '城市'
                }
                for (let i = 0; i < this.state.sections.length; i++) {
                    if (this.state.sections[i].name == lettertemp) {
                        this.refs.FlatList.scrollToIndex({ animated: false, index: i });
                        break;
                    }
                }
            }
        }
    }
    render() {
        let sectionTextView = null
        if (this.state.isTouchDown) {
            sectionTextView =
                <View style={styles.selectView}>
                    <Text style={styles.selectTv}>{this.state.selectText}</Text>
                </View>
        }
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: Config.topHeight }}>
                    {(this.props.userId == undefined) ? <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity> : (this.props.update) ? <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity> : null}
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>选择城市</Text>
                    </View>
                </ImageBackground>
                <View style={styles.headerView}>
                    <VectorIcon name='ios-search' size={20} style={{ alignSelf: 'center', marginLeft: 15, color: '#545454' }} />
                    <TextInput
                        style={{ width: 200 }}
                        onChangeText={(text) => this.onChangeText(text)}
                        underlineColorAndroid='transparent'
                        placeholder={'输入城市名字或拼音查询'}
                    />
                </View>
                <View style={styles.container}>
                    <View style={styles.gpsContent}>
                        <VectorIcon
                            name="map_marker"
                            size={20}
                            color='#287ce0'
                            style={{ backgroundColor: 'transparent', marginLeft: 10 }}
                        />
                        <Text style={styles.gpsFont}>当前定位城市：</Text>
                        <TouchableOpacity onPress={() => this.handleClick(this.state.cuurCity, true)} >
                            <Text style={styles.gpsFont2}>{this.state.cuurCity == '' ? this.state.locationtip : this.state.cuurCity}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this._getGps()} >
                            <Text style={[styles.gpsFont2, { color: "#287ce0" }]}>重新定位</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => this.handleClick('不限')}>
                        <Text style={{
                            color: "#838383",
                            textAlignVertical: 'center',
                            textAlign: 'center',
                            width: 88,
                            height: CITYHEIGHT2,
                            borderColor: '#DDDDDD',
                            borderWidth: Utils.pixel,
                            borderRadius: 5,
                            fontSize: 15,
                            marginRight: 14,
                            marginBottom: 14,
                            ...Platform.select({
                                ios: { lineHeight: CITYHEIGHT2 },
                                android: {}
                            })
                        }}>不限城市</Text>
                    </TouchableOpacity>
                    {this.state.showFlag == true ? (
                        <View style={{ paddingBottom: 100 }}>
                            <FlatList
                                ref={'FlatList'}
                                style={{ width: '100%' }}
                                data={this.state.sections}
                                contentContainerStyle={styles.list}
                                showsVerticalScrollIndicator={false}
                                renderItem={this._renderItem}
                                initialNumToRender={50}
                                getItemLayout={(data, index) => this._getItemLayout(data, index)}
                                keyExtractor={(item, index) => {
                                    return (index.toString());
                                }}
                            >
                            </FlatList>
                            <View
                                style={{
                                    position: 'absolute',
                                    //height: Utils.size.height - 93 + Utils.statusBarHeight,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    right: 0,
                                    paddingBottom: 100
                                }}
                            >
                                <View style={{ height: 23 * 20 }}>
                                    {/* <FlatList
                                        initialNumToRender={25}
                                        data={this.state.listData}
                                        renderItem={this._flatRenderItem}
                                        keyExtractor={(item, index) => { return item + index }}
                                    >
                                    </FlatList> */}
                                    {this.state.listData ? this.randerLetter() : null}
                                </View>
                            </View>
                        </View>
                    ) : (
                            <FlatList
                                style={{ width: Utils.size.width }}
                                data={this.state.searchArray}
                                renderItem={this._searchRenderItem}
                                keyExtractor={(item, index) => {
                                    return (index.toString());
                                }}
                            />
                        )}
                </View>
                {sectionTextView}
            </View>
        )
    }

    _returnAction = () => {
        this.props.navigation.goBack(null);
    }

    _getItemLayout(data, index) {
        if (data[index].type == 'letter' || data[index].type == 'city') {
            let i;
            for (i = index; i > 0; i--) {
                if (data[i].type == 'letter') {
                    break;
                }
            }
            let offset = this.state.listData.indexOf(data[i]['name']) - this.letterDescNumber;
            return {
                index,
                offset: CITYHEIGHT * (this.titleCityArray[offset] + index - i) + (offset) * (TITLEHEIGHT)
                    + this.city2number * CITYHEIGHT2 + this.descNumber * (DESCHEIGHT),
                length: i == index ? TITLEHEIGHT : CITYHEIGHT,
            }
        } else {
            let i;
            for (i = index; i > 0; i--) {
                if (data[i].type == 'desc') {
                    break;
                }
            }
            let offset = this.state.listData.indexOf(data[i]['name'].slice(0, 2));
            return {
                index,
                offset: CITYHEIGHT2 * index + offset * (DESCHEIGHT - CITYHEIGHT2),
                length: i == index ? DESCHEIGHT : CITYHEIGHT2,
            }
        }

    }

    //查找
    onChangeText(text) {
        let Chinese = new RegExp('^[\u4e00-\u9fa5]+$');
        let English = new RegExp('^[a-zA-Z]+$');
        if (Chinese.test(text)) {
            let temp = [];
            this.state.cityBase.forEach(city => {
                if (city.name.indexOf(text) == 0) {
                    temp[temp.length] = city;
                }
            });
            this.setState({
                searchArray: temp,
                showFlag: false,
            })
        } else if (English.test(text)) {
            text = text.toLowerCase();
            let temp = [];
            this.state.cityBase.forEach(city => {
                if (city.name_en.indexOf(text) == 0) {
                    temp[temp.length] = city;
                }
            });
            this.setState({
                searchArray: temp,
                showFlag: false,
            })
        } else if (text.length == 0) {
            this.setState({
                searchArray: this.state.cityBase,
                showFlag: true
            });
        } else {
            this.setState({
                searchArray: [],
                showFlag: false
            });
        }
    }

    _searchRenderItem = (info) => {
        return (
            <View style={{ flexDirection: 'row', width: Utils.size.width, height: CITYHEIGHT, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.handleClick(info.item.name)}>
                    <Text>{info.item.name}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _flatRenderItem = (info) => {
        return (
            <TouchableOpacity onPress={() => this._moveAction(info)} style={{ width: CITYHEIGHT, alignItems: 'center', height: 20 }}>
                <Text style={{ color: "#a6a6a6" }}>{info.item}</Text>
            </TouchableOpacity>
        )
    }

    _moveAction(info) {
        let item = info.item.length == 1 ? info.item : info.item + '城市';
        for (let i = 0; i < this.state.sections.length; i++) {
            if (this.state.sections[i].name == item) {
                this.refs.FlatList.scrollToIndex({ animated: false, index: i });
                break;
            }
        }
    }
    _moveAction1(info) {
        let item = info.length == 1 ? info : info + '城市';
        for (let i = 0; i < this.state.sections.length; i++) {
            if (this.state.sections[i].name == item) {
                this.setState({
                    selectText: info
                })
                this.refs.FlatList.scrollToIndex({ animated: false, index: i });
                break;
            }
        }
    }
    handleClick(value, ifcuurlocation) {//ifcuurlocation在这里不用了
        if (this.state.cuurCity == '' && ifcuurlocation) {//如果是定位中，不切换页面
            return
        }
        let param = {
            ifcuurlocation: ifcuurlocation
        }
        if (ifcuurlocation) {
            param = {
                ifcuurlocation: true,
                ...this.state.latlong
            }
        }

        Actions.pop()
        this.props.onblock(value, param)
    }
    randerLetter() {
        let selected = this.state.selectText
        const sectionItem = this.state.listData.map((info, index) => {

            return (
                <TouchableOpacity onPress={() => this._moveAction1(info)} key={index}
                    style={[{ width: CITYHEIGHT, alignItems: 'center', height: 20 }, selected == info ? styles.selectedText : styles.unselectedText]}>
                    <Text style={{ color: selected == info ? "#fff" : "#a6a6a6" }}>{info}</Text>
                </TouchableOpacity>
            )
        });

        if (Platform.OS == 'ios') {//ios滑动有问题
            return (
                <ScrollView
                    ref="sectionItemView"
                // iosalwaysBounceVertical={false}
                // onStartShouldSetResponder={() => true}
                // onMoveShouldSetResponder={() => true}
                // onResponderTerminationRequest={() => true}
                // onResponderGrant={this.responderGrant.bind(this)}
                // onResponderMove={this.responderMove.bind(this)}
                // onResponderRelease={this.responderRelease.bind(this)}
                >
                    {sectionItem}
                </ScrollView>
            );
        } else {
            return (
                <ScrollView
                    ref="sectionItemView"
                    onStartShouldSetResponder={() => true} // 在用户开始触摸的时候（手指刚刚接触屏幕的瞬间），是否愿意成为响应者？
                    onMoveShouldSetResponder={() => true} // :如果View不是响应者，那么在每一个触摸点开始移动（没有停下也没有离开屏幕）时再询问一次：是否愿意响应触摸交互呢？
                    onResponderTerminationRequest={() => true}
                    onResponderGrant={this.responderGrant.bind(this)} // View现在要开始响应触摸事件了。这也是需要做高亮的时候，使用户知道他到底点到了哪里
                    onResponderMove={this.responderMove.bind(this)} // 用户正在屏幕上移动手指时（没有停下也没有离开屏幕）
                    onResponderRelease={this.responderRelease.bind(this)} // 触摸操作结束时触发，比如"touchUp"（手指抬起离开屏幕）
                >
                    {sectionItem}
                </ScrollView>

            );
        }

    }
    _renderItem = (info) => {
        var txt = info.item.name;
        switch (info.item.type) {
            case 'city': {
                return (
                    <TouchableOpacity onPress={() => this.handleClick(info.item.name)}>
                        <Text
                            style={{
                                height: CITYHEIGHT,
                                width: Utils.size.width - 70,
                                textAlignVertical: 'center',
                                // backgroundColor: "#ffffff", 
                                color: '#838383',
                                fontSize: 15,
                                borderBottomColor: '#F5F5F5',
                                borderBottomWidth: 1,
                            }}
                        >
                            {txt}
                        </Text>
                    </TouchableOpacity>
                )
            }
            case 'letter': {
                return (
                    <View>
                        <Text
                            style={{
                                height: TITLEHEIGHT,
                                width: Utils.size.width - 70,
                                textAlignVertical: 'center',
                                //backgroundColor: "#0f0", 
                                color: '#a6a6a6',
                                fontSize: 15,
                                borderBottomColor: '#F5F5F5',
                                borderBottomWidth: 1,
                            }}
                        >
                            {txt}
                        </Text>
                    </View>
                )
            }
            case 'desc': {
                return (
                    <View>
                        <Text
                            style={{
                                height: DESCHEIGHT,
                                width: Utils.size.width - 50,
                                textAlignVertical: 'center',//ios不支持这样垂直居中
                                //backgroundColor: "#0f0", 
                                color: '#A6A6A6',
                                fontSize: 15,
                                marginBottom: 10,
                            }}
                        >
                            {txt}
                        </Text>
                    </View>
                )
            }
            case 'city2': {
                txt = txt.split(',');
                return (
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        {
                            txt.map((element, index) => {
                                return <TouchableOpacity onPress={() => this.handleClick(element)} key={index}>
                                    <Text
                                        key={'info' + info.index + 'index' + index}
                                        style={{
                                            color: "#838383",
                                            textAlignVertical: 'center',
                                            textAlign: 'center',
                                            width: 88,
                                            height: CITYHEIGHT2,
                                            borderColor: '#DDDDDD',
                                            borderWidth: Utils.pixel,
                                            borderRadius: 5,
                                            fontSize: 15,
                                            marginRight: 14,
                                            marginBottom: 14,
                                            ...Platform.select({
                                                ios: { lineHeight: CITYHEIGHT2 },
                                                android: {}
                                            })
                                        }}>
                                        {element}
                                    </Text></TouchableOpacity>
                            })
                        }
                    </View>
                )
            }
            case 'location': {
                return (
                    <Text
                        style={{
                            textAlignVertical: 'center',
                            textAlign: 'center',
                            width: 94.5,
                            height: CITYHEIGHT2,
                            borderColor: 'rgb(220,220,220)',
                            borderWidth: Utils.pixel,
                            fontSize: 15,
                            marginRight: 14,
                            //marginTop:4
                        }}>
                        {txt}
                    </Text>
                )
            }
        }
    }

    componentWillUnmount() {
        this.timerOut && clearTimeout(this.timerOut);
        this.setState = (state, callback) => {
            return;
        };
    }
    componentWillMount() {
        this._gestureHandlers = {
            onStartShouldSetResponder: (evt) => true,
            onMoveShouldSetResponder: (evt) => true,
            onResponderStart: (evt) => {
                console.log(this);
                //this.refs.FlatList.onResponderStart(evt);
            }

        }
    }
    componentDidMount() {

        // this._getGps()
        //初始化数据
        let cityContent2 = cityContent.data;
        let letterList = [];
        let cityArray = [];
        let sections = [];
        this.city2number = 0;
        this.descNumber = 0;
        this.titleCityArray = [0];

        //设置不同的type 在 FlatList 中的 renderItem 中用于区分，实现不同的样式
        // sections[sections.length] = {
        //     name: '定位城市',
        //     type: 'desc',
        // };

        // sections[sections.length] = {
        //     name: this.state.cuurCity == '' ? '定位中' : 'cs',
        //     type: 'location',
        // };
        // sections[sections.length] = {
        //     name: '常用城市',
        //     type: 'desc',
        // };

        // sections[sections.length] = {
        //     name: '珠海,广州',
        //     type: 'city2',
        // };

        sections[sections.length] = {
            name: '热门城市',
            type: 'desc',
        };

        sections[sections.length] = {
            name: '珠海,广州,杭州',
            type: 'city2',
        };
        sections[sections.length] = {
            name: '北京,上海,西安',
            type: 'city2',
        };
        sections[sections.length] = {
            name: '苏州,大连,武汉',
            type: 'city2',
        };
        sections[sections.length] = {
            name: '长沙,南京',
            type: 'city2',
        };
        //letterList.splice(0, 0, '定位', '常用', '热门');
        letterList.splice(0, 0, '热门');
        this.letterDescNumber = letterList.length;
        sections.forEach(element => {
            if (element.type != 'desc') {
                this.city2number++;
            } else {
                this.descNumber++;
            }
        });
        let i = 0;
        cityContent2.forEach(element => {
            sections[sections.length] = {
                name: element.title,
                type: 'letter',
            };
            element.city.forEach(element => {
                if (element.city_child == element.city_parent) {
                    sections[sections.length] = {
                        name: element.city_child,
                        type: 'city',
                    }
                    i++;
                }
            });
            this.titleCityArray[this.titleCityArray.length] = i;
            letterList[letterList.length] = element.title;
        });

        // 查找时使用的数据
        let key = 0;
        cityArray = [];
        cityContent2.forEach(element => {
            element.city.forEach(element => {
                if (element.city_child == element.city_parent) {
                    cityArray[cityArray.length] = {
                        'name': element.city_child,
                        'name_en': element.city_child_en,
                        'key': key++,
                    }
                }
            });
        });
        this.setState({
            sections: sections,
            listData: letterList,
            cityBase: cityArray,
            searchArray: cityArray,
        });
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
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
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingLeft: 25
    },
    headerView: {
        width: Utils.size.width - 50,
        //height: 93 - Utils.statusBarHeight * 2,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",
        justifyContent: 'center',
        backgroundColor: "#F0F0F0",
        borderRadius: 20,
        marginTop: 10
    },
    gpsContent: {
        height: 30,
        width: Utils.size.width - 50,
        display: "flex",
        flexDirection: "row",
        marginBottom: 10,
        marginTop: 20,
        paddingBottom: 10,
        borderBottomColor: "#F5F5F5",
        borderBottomWidth: 1
    },
    gpsFont: {
        color: "#838383",
        marginLeft: 10,
        fontSize: 14,
    },
    gpsFont2: {
        color: "#838383",
        marginLeft: 5,
        fontSize: 14,
        // borderColor: 'rgb(220,220,220)',
        // borderBottomWidth: Utils.pixel,
        // textAlignVertical: 'center',
        // textAlign: 'center',
    },
    selectView: {
        position: 'absolute',
        width: selectWidth,
        height: selectWidth,
        right: deviceWidth / 2 - selectWidth / 2,
        top: deviceHeigth / 2 - selectWidth / 2,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 5
    },
    selectTv: {
        fontSize: 32,
        color: '#287ce0'
    },
    selectedText: {
        backgroundColor: "#287ce0",
        borderRadius: 10
    },
    unselectedText: {
        backgroundColor: "transparent",
    }

});