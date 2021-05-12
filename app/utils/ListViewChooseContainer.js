'use strict'
//列表关联组件封装
//伍钦
import React, { Component } from 'react';
import {
    View,
    Platform,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    PermissionsAndroid
} from 'react-native';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { Fetch, Config, VectorIcon } from 'c2-mobile';
import { Button } from 'react-native-elements';
import { QySearch } from 'qysyb-mobile';
import { C2AmapApi } from 'c2-mobile-amap';
// import moment from 'moment';
// var mryear = moment().format('YYYY');
// import CityInfo from './CityInfo';
// const temp = CityInfo.getProvinceWithid();

class ListViewChooseContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chooseNumright: '100',
            chooseNumleft: '',
            // leftDatas: temp,
            endData: [],
            showEndData: false,
            rightData: '',
            top: (this.props.top) ? this.props.top : (Platform.OS == 'ios') ? (Dimensions.get('window').width) / 3 - 20 : (Dimensions.get('window').width) / 3 - 40,
            singleDatas: (this.props.singleDatas == undefined) ? undefined : this.props.singleDatas,
            theme: (this.props.theme == undefined) ? undefined : this.props.theme,
            showRightList: false,
            rightDatas: [],
            rightDatas_diqu_back: [{ ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false },],
            rightDatas_diqu: [{ ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false },],
            endDatas_diqu: [{ ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false },],
            data: [],
            leftData: [{ "companyName": '' }],
            projectlist: [],
            projectlist1: [],
            searchprojectlist: [],
            data_education: [],
            stu: 'native',
            cleftData: '',
            crightData: '',
            cendData: ''
            // project: (this.props.project) ? this.props.project : '1'
        };
        this.getLeftData();
        // this.getproject();
        //this.openQuanxian()//获取权限
        //this._getGps()

    }
    openQuanxian() {
        if (Platform.OS == 'android') {
            var location = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
            PermissionsAndroid.check(location).then(granted => {
                if (granted) {
                } else {
                    PermissionsAndroid.request(
                        location,
                    ).then(() => { });
                }
            })
        }
    }
    _getGps() {
        C2AmapApi.getCurrentLocation()
            .then((result) => {
                //debugger
                if (result.coordinate.latitude == '0.000000') {
                    Toast.showInfo('请开启定位', 2000)
                } else {
                    this.setState({
                        cleftData: result.info.province,
                        crightData: result.info.city,
                        cendData: result.info.district
                    })
                    // var data = { leftData: this.state.leftData, rightData: '', endData: '' };
                    // this.props.callbackData(data);
                    // this.props.onCancel()
                }
            })
            .catch(() => {
                Toast.showInfo('请开启定位', 2000)
            })
    }
    getLeftData() {
        if (this.props.theme == 'year') {
            fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=个人临时承揽标签', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.text())
                .then((json) => {
                    var data_education = [];
                    var xlList = JSON.parse(json).result;
                    for (let i in xlList) {
                        if (xlList[i].dictdataValue != '不限') {
                            if (!xlList[i].dictdataIsdefault) {
                                data_education.push({ value: xlList[i].dictdataValue, label: xlList[i].dictdataValue, dictdataName: xlList[i].dictdataName })
                            }
                        }

                    }
                    this.setState({
                        data_education: data_education
                    })
                })
        } else {
            //省
            var provinceNames = [];
            fetch(Config.mainUrl + '/ws/province?dictTypeName=省', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.text())
                .then((json) => {
                    var provinceList = JSON.parse(json);
                    for (let i in provinceList) {
                        if (!provinceList[i].dictdataIsdefault) {
                            provinceNames.push({ p_id: provinceList[i].ID, p_name: provinceList[i].NAME });
                        }
                    }
                    this.setState({
                        leftDatas: provinceNames
                    })
                })
        }


    }
    render() {
        const { visible } = this.props;
        return (
            <Modal
                visible={visible}
                style={{ height: deviceHeight, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}
                transparent={true}
                onRequestClose={this.onCancel.bind(this)}
            >
                {(this.state.theme == 'hour-minute') ?
                    <TouchableOpacity onPress={() => this.props.onCancel()} style={{ height: deviceHeight, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                        <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, }}>
                            <ScrollView style={{
                                flex: 1,
                                width: Dimensions.get('window').width / 2,
                                height: deviceHeight / 2,
                                backgroundColor: '#F6F6F6'
                            }}>
                                {this.leftList_hourminute()}
                            </ScrollView>
                        </ScrollView>
                        {(this.state.showRightList) ? <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                            <ScrollView style={{
                                flex: 1,
                                width: Dimensions.get('window').width / 2,
                                height: deviceHeight / 2,
                                backgroundColor: '#fff'
                            }}>
                                {this.rightList_hourminute()}
                            </ScrollView>
                        </ScrollView> : null}
                    </TouchableOpacity>
                    :
                    (this.state.theme == 'year') ?
                        <TouchableOpacity onPress={() => this.props.onCancel()} style={{ height: deviceHeight, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                            <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 3, }}>
                                <ScrollView style={styles.ViewStyle_noleft}>
                                    {this.rightList_noleft()}
                                </ScrollView>
                            </ScrollView>
                        </TouchableOpacity> :

                        (this.state.theme == 'diqu') ?
                            <TouchableOpacity onPress={() => this.props.onCancel()} style={{ height: deviceHeight, backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                                <View style={{ height: 100, }}>
                                    <View style={{ flex: 1, top: this.state.top, backgroundColor: 'white' }}>
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: 20, marginBottom: 10 }}>
                                            <Text style={{ color: "#353535", fontSize: 16, marginLeft: 20 }}>请选择地区</Text>
                                            {(this.state.chooseNumright == "100" && this.state.showRightList) ? < View style={{ flexDirection: 'row', marginLeft: 20, }}>
                                                <Button
                                                    color={"#353535"}
                                                    backgroundColor='#fff'
                                                    buttonStyle={{ width: 60, height: 30, borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 5 }}
                                                    title='取消'
                                                    onPress={this.clear.bind(this)}
                                                    fontSize={11}
                                                />
                                                <View style={{ marginLeft: -20, }}>
                                                    <Button
                                                        buttonStyle={{ width: 60, height: 30, borderWidth: 1, borderColor: "#e6e6e6", borderRadius: 5 }}
                                                        backgroundColor='#418FEA'
                                                        title='确定'
                                                        onPress={this.Search_diqu.bind(this)}
                                                        fontSize={11}
                                                    />
                                                </View>
                                            </View> : null}
                                        </View>
                                        <View style={{ flexDirection: 'row', backgroundColor: 'white' }}>
                                            <Text style={{ marginLeft: 20, color: '#0066d3', fontSize: 12 }}>{this.state.leftData.p_name}</Text>
                                            {this.state.chooseNumright == "100" ? null : <Text style={{ color: '#0066d3', fontSize: 12 }}> - {this.state.rightData.c_name == undefined ? '' : this.state.rightData.c_name}</Text>}
                                            {this.state.chooseNumEnd == '100' || this.state.data.endData == undefined ? null : <Text style={{ color: '#0066d3', fontSize: 12 }}> - {this.state.data.endData == undefined ? '' : this.state.data.endData.a_name}</Text>}
                                        </View>


                                    </View >
                                    {/* <ScrollView style={{ flex: 1, top: this.state.top, backgroundColor: 'white' }} horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        pagingEnabled={true}>
                                        {this.showChooseList_diqu()}
                                    </ScrollView> */}

                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, borderTopWidth: 1, borderColor: "#e6e6e6", borderRightWidth: 1 }}>
                                        <ScrollView style={{
                                            flex: 1,
                                            width: (this.state.chooseNumright == '100') ? Dimensions.get('window').width : Dimensions.get('window').width / 3,
                                            height: deviceHeight / 2,
                                            backgroundColor: '#F6F6F6'
                                        }}>
                                            {this.leftList_diqu()}
                                        </ScrollView>
                                    </ScrollView>
                                    {(this.state.showRightList) ? <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, borderTopWidth: 1, borderColor: "#e6e6e6", borderRightWidth: 1 }}>
                                        <View style={{ height: 25, backgroundColor: '#F6F6F6', width: (this.state.chooseNumright == '100') ? deviceWidth / 2 : deviceWidth / 3, borderColor: "#e6e6e6", borderRightWidth: 1 }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1, marginLeft: 15, height: 20, justifyContent: 'center', alignItems: 'flex-start', }}>
                                                    <Text style={{
                                                        color: '#000000',
                                                        fontSize: 10,
                                                        fontWeight: 'bold',
                                                        opacity: 0.5,
                                                    }} numberOfLines={2}>{this.state.leftData.p_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: 1, backgroundColor: '#e5e5e5' }} />
                                        <ScrollView style={[(this.state.chooseNumright == '100') ? styles.ViewStyle1 : styles.ViewStyle3, { backgroundColor: "#fafafa", borderColor: "#e6e6e6", borderRightWidth: 1 }]}>
                                            {this.rightList_diqu()}
                                        </ScrollView>

                                        {/* {(this.state.chooseNumright == "100") ? < View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                            <Button
                                                backgroundColor='#03A9F4'
                                                buttonStyle={{ width: 50, height: 35, }}
                                                title='取消'
                                                onPress={this.clear.bind(this)}
                                                fontSize={11}
                                            />
                                            <View style={{ marginLeft: -20, }}>
                                                <Button
                                                    backgroundColor='#03A9F4'
                                                    buttonStyle={{ width: 50, height: 35 }}
                                                    title='确定'
                                                    onPress={this.Search_diqu.bind(this)}
                                                    fontSize={11}
                                                />
                                            </View>
                                        </View> : null} */}
                                    </ScrollView> : null}
                                    {(this.state.showEndData) ? <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, borderTopWidth: 1, borderColor: "#e6e6e6" }}>
                                        <View style={{ height: 25, backgroundColor: '#F6F6F6', width: deviceWidth / 3 }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1, marginLeft: 15, height: 20, justifyContent: 'center', alignItems: 'flex-start', }}>
                                                    <Text style={{
                                                        color: '#000000',
                                                        fontSize: 10,
                                                        fontWeight: 'bold',
                                                        opacity: 0.5,
                                                    }} numberOfLines={2}>{this.state.rightData.c_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                                        <ScrollView style={[styles.ViewStyle3, { backgroundColor: "#f3f3f3" }]}>
                                            {this.endList_diqu()}
                                        </ScrollView>
                                        < View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10, marginBottom: 10 }}>

                                            {/* <View style={{ marginLeft: -20, }}>
                                                <Button
                                                    backgroundColor='#03A9F4'
                                                    buttonStyle={{ width: 80, height: 35 }}
                                                    title='不限地区'
                                                    onPress={this.buxian.bind(this)}
                                                    fontSize={11}
                                                />
                                            </View> */}
                                        </View>
                                    </ScrollView> : null}

                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.props.onCancel()} style={{ height: deviceHeight, backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
                                {(this.state.showRightList) ?
                                    <View style={{ height: 100, }}>
                                        <View style={{ top: this.state.top, }}>
                                            <View style={{ height: 50, backgroundColor: 'white', justifyContent: 'center' }}>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', backgroundColor: 'white' }}>
                                                    <Text style={{
                                                        marginLeft: 10,
                                                        color: '#000',
                                                        fontSize: 14,
                                                    }} numberOfLines={1}>{this.state.leftData.p_name}</Text>
                                                </View>
                                            </View >
                                        </View >
                                        <ScrollView style={{ flex: 1, top: this.state.top, backgroundColor: 'white' }} horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            pagingEnabled={true}>
                                            {this.showChooseList_diqu()}
                                        </ScrollView>
                                    </View> : null}
                                <View style={{ flexDirection: 'row', }}>
                                    <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, }}>
                                        <ScrollView style={{
                                            flex: 1,
                                            width: (this.state.chooseNumright == '100') ? Dimensions.get('window').width / 2 : Dimensions.get('window').width / 3,
                                            height: deviceHeight / 2,
                                            backgroundColor: '#F6F6F6'
                                        }}>
                                            {this.leftList_diqu()}
                                        </ScrollView>
                                    </ScrollView>
                                    {(this.state.showRightList) ? <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, }}>
                                        <View style={{ height: 25, backgroundColor: '#F6F6F6', width: (this.state.chooseNumright == '100') ? deviceWidth / 2 : deviceWidth / 3 }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1, marginLeft: 15, height: 20, justifyContent: 'center', alignItems: 'flex-start', }}>
                                                    <Text style={{
                                                        color: '#000000',
                                                        fontSize: 10,
                                                        fontWeight: 'bold',
                                                        opacity: 0.5,
                                                    }} numberOfLines={2}>{this.state.leftData.p_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: 1, backgroundColor: '#e5e5e5' }} />
                                        <ScrollView style={(this.state.chooseNumright == '100') ? styles.ViewStyle1 : styles.ViewStyle3}>
                                            {this.rightList_diqu()}
                                        </ScrollView>

                                        {(this.state.chooseNumright == "100") ? < View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10, marginBottom: 10 }}>
                                            <Button
                                                backgroundColor='#03A9F4'
                                                buttonStyle={{ width: 50, height: 35, }}
                                                title='取消'
                                                onPress={this.clear.bind(this)}
                                                fontSize={11}
                                            />
                                            <View style={{ marginLeft: -20, }}>
                                                <Button
                                                    backgroundColor='#03A9F4'
                                                    buttonStyle={{ width: 50, height: 35 }}
                                                    title='确定'
                                                    onPress={this.Search_diqu.bind(this)}
                                                    fontSize={11}
                                                />
                                            </View>
                                        </View> : null}
                                    </ScrollView> : null}
                                    {(this.state.showEndData) ? <ScrollView style={{ top: this.state.top, backgroundColor: '#fff', flexDirection: 'row', height: deviceHeight / 2, }}>
                                        <View style={{ height: 25, backgroundColor: '#F6F6F6', width: deviceWidth / 3 }}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: 1, marginLeft: 15, height: 20, justifyContent: 'center', alignItems: 'flex-start', }}>
                                                    <Text style={{
                                                        color: '#000000',
                                                        fontSize: 10,
                                                        fontWeight: 'bold',
                                                        opacity: 0.5,
                                                    }} numberOfLines={2}>{this.state.rightData.c_name}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                                        <ScrollView style={styles.ViewStyle3}>
                                            {this.endList_diqu()}
                                        </ScrollView>
                                        < View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10, marginBottom: 10 }}>

                                            {/* <View style={{ marginLeft: -20, }}>
                                                <Button
                                                    backgroundColor='#03A9F4'
                                                    buttonStyle={{ width: 80, height: 35 }}
                                                    title='不限地区'
                                                    onPress={this.buxian.bind(this)}
                                                    fontSize={11}
                                                />
                                            </View> */}
                                        </View>
                                    </ScrollView> : null}
                                </View>
                            </TouchableOpacity>}
            </Modal>
        );
    }
    leftList_diqu() {
        var temp = [];
        var rowData = this.state.leftDatas;
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity onPress={this.leftCallback_diqu.bind(this, rowData[i], i)} style={{ flex: 1 }} key={i}>
                    <View style={{ height: 50, backgroundColor: '#fff' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    // textAlign: 'center',
                                    color: (i == this.state.chooseNumleft) ? '#0066d3' : '#000',
                                    fontSize: 12,
                                    borderBottomWidth: 1,
                                    borderColor: (i == this.state.chooseNumleft) ? '#0066d3' : '#fff',
                                    paddingBottom: 5
                                }} numberOfLines={2}>{rowData[i].p_name}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }
    leftCallback_diqu(rowData, i) {
        // var res = CityInfo.getCityWithid(rowData.p_id)
        //市
        var provinceNames = [];
        fetch(Config.mainUrl + '/ws/city?parentid=' + rowData.p_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                var provinceList = JSON.parse(json);
                for (let i in provinceList) {
                    if (!provinceList[i].dictdataIsdefault) {
                        provinceNames.push({ c_id: provinceList[i].ID, c_name: provinceList[i].NAME });
                    }
                }
                var data = { leftData: rowData, rightData: provinceNames };
                this.setState({
                    leftData: rowData,
                    showRightList: true,
                    chooseNumleft: i,
                    chooseNumright: '100',
                    endData: [],
                    showEndData: false,
                    data: data,
                    rightDatas: provinceNames
                })
            })

    }
    rightList_diqu() {
        var temp = [];
        var rowData = this.state.rightDatas;
        temp.push(
            <TouchableOpacity onPress={this.rightCallback_diqu.bind(this, { c_name: '全部', c_id: '' }, '100')} style={{ flex: 1 }}>
                <View style={{ height: 50 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Text style={{
                                textAlign: 'center',
                                color: ('100' == this.state.chooseNumright) ? '#0066d3' : '#000',
                                fontSize: 12,
                                borderBottomWidth: 1,
                                borderColor: ('100' == this.state.chooseNumright) ? '#0066d3' : '#fafafa',
                                paddingBottom: 5
                            }} numberOfLines={2}>{'全部'}</Text>
                        </View>
                        {/* {('100' == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                        </View> : null} */}
                    </View>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} /> */}
            </TouchableOpacity>
        )
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback_diqu.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: (i == this.state.chooseNumright) ? '#0066d3' : '#000',
                                    fontSize: 12,
                                    borderBottomWidth: 1,
                                    borderColor: (i == this.state.chooseNumright) ? '#0066d3' : '#fafafa',
                                    paddingBottom: 5
                                }} numberOfLines={2}>{rowData[i].c_name}</Text>
                            </View>
                            {/* {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null} */}
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} /> */}
                </TouchableOpacity>
            )
        }
        return temp;
    }
    endList_diqu() {
        var temp = [];
        var rowData = this.state.endData;
        temp.push(
            <TouchableOpacity onPress={this.endCallback_diqu.bind(this, '', '100')} style={{ flex: 1 }}>
                <View style={{ height: 50 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Text style={{
                                textAlign: 'center',
                                color: ('100' == this.state.chooseNumEnd) ? '#0066d3' : '#000',
                                fontSize: 12,
                                borderBottomWidth: 1,
                                borderColor: ('100' == this.state.chooseNumEnd) ? '#0066d3' : '#fafafa',
                                paddingBottom: 5
                            }} numberOfLines={2}>{'全部'}</Text>
                        </View>
                        {/* {('100' == this.state.chooseNumEnd) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                        </View> : null} */}
                    </View>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} /> */}
            </TouchableOpacity>
        )
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.endCallback_diqu.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: (i == this.state.chooseNumEnd) ? '#0066d3' : '#000',
                                    fontSize: 12,
                                    borderBottomWidth: 1,
                                    borderColor: (i == this.state.chooseNumEnd) ? '#0066d3' : '#fafafa',
                                    paddingBottom: 5
                                }} numberOfLines={2}>{rowData[i].a_name}</Text>
                            </View>
                            {/* {(i == this.state.chooseNumEnd) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null} */}
                        </View>
                    </View>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} /> */}
                </TouchableOpacity>
            )
        }
        return temp;
    }
    rightCallback_diqu(rowData, i) {
        if (i == '100') {
            var data = { leftData: this.state.leftData, rightData: rowData, endData: '' };
            this.setState({
                data: data,
                chooseNumright: i,
                endData: [],
                showEndData: false,
            })
        } else {
            var data = { leftData: this.state.leftData, rightData: rowData };
            // var endData = CityInfo.getArea(this.state.leftData, rowData);
            // var endData = CityInfo.getAreaWithid(rowData.c_id);
            //县
            var provinceNames = [];
            fetch(Config.mainUrl + '/ws/area?parentid=' + rowData.c_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.text())
                .then((json) => {
                    var provinceList = JSON.parse(json);
                    for (let i in provinceList) {
                        if (!provinceList[i].dictdataIsdefault) {
                            provinceNames.push({ a_id: provinceList[i].ID, a_name: provinceList[i].NAME });
                        }
                    }
                    this.setState({
                        showEndData: true,
                        data: data,
                        chooseNumEnd: '',
                        endData: provinceNames,
                        endDatas_diqu: [{ ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false },],
                        rightData: rowData,
                        chooseNumright: i,
                    })
                })

        }
    }
    endCallback_diqu(rowData, i) {
        //debugger
        if (i == '100') {
            var data = { leftData: this.state.leftData, rightData: this.state.rightData, endData: '' };
            // var data = this.state.leftData + this.state.leftData;
            this.setState({
                chooseNumEnd: i,
                endDatas_diqu: [{ ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false }, { ifshow: false },],
            })
        } else {
            if (this.state.endDatas_diqu[i].ifshow == undefined) {
                this.state.endDatas_diqu[i].ifshow = false
            }
            this.state.endDatas_diqu[i].ifshow = !this.state.endDatas_diqu[i].ifshow;
            var data = { leftData: this.state.leftData, rightData: this.state.rightData, endData: rowData };
            // var data = this.state.leftData + this.state.rightData + rowData;
            this.setState({
                endDatas_diqu: this.state.endDatas_diqu,
                data: data,
                chooseNumEnd: i,
            })

        }
        this.props.callbackData(data);
        this.props.onCancel()
    }
    showChooseList_diqu() {
        var temp = [];
        var rowData = this.state.endData;
        // var rowData_show = this.state.endDatas_diqu;
        for (let i in rowData) {
            if (i == this.state.chooseNumEnd) {
                temp.push(
                    <View key={i} style={{ marginLeft: 10, marginRight: 10, flex: 1 }}>
                        <View style={{ height: 50, backgroundColor: 'white', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 30, backgroundColor: '#D73500' }}>
                                <Text style={{
                                    marginLeft: 10,
                                    marginRight: 10,
                                    color: 'white',
                                    fontSize: 13,
                                }} numberOfLines={1}>{rowData[i].a_name}</Text>
                                {/* <TouchableOpacity onPress={this.mmdelete_diqu.bind(this, rowData[i], i)} style={{ marginRight: 5, height: 30, justifyContent: 'center', alignItems: 'flex-end', }}>
                                    <Image source={require('../image/close.png')} style={{ width: 12, height: 12, marginLeft: 5 }} />
                                </TouchableOpacity> */}
                            </View>
                        </View >
                    </View >
                )
            }
        }
        return temp;
    }
    handleCuurAddrss() {
        var data = {
            leftData: { p_name: this.state.cleftData },
            rightData: { c_name: this.state.crightData },
            endData: { a_name: this.state.cendData }
        };
        //debugger
        this.props.callbackData(data);
        this.props.onCancel()
    }
    buxian() {
        var data = { leftData: '', rightData: '', endData: '' };
        this.props.callbackData(data);
        this.props.onCancel()
    }
    Search_diqu() {
        var data = { leftData: this.state.leftData, rightData: '', endData: '' };
        this.props.callbackData(data);
        this.props.onCancel()
    }

    dataSource(result) {
        console.log(result)
        // this.setState({
        //     dataArray: result
        // })
        // this.search(result);

        if (result.length != 0 && result != 'null') {
            this.setState({
                searchprojectlist: result,
                stu: 'search',
            })
        } else if (result == '') {
            this.setState({
                stu: 'native'
            })
        }
        else if (result == 'null') {
            this.setState({
                stu: 'native'
            })
        }
    }
    clear() { this.props.onCancel() }
    Search() {
        if (this.state.chooseNumright == '100') {
            let query1 = {
                parentId: this.state.parentId,
            }
            Fetch.postJson(Config.mainUrl + '/ws/deptList', query1)
                .then((res) => {
                    var temp = [];
                    for (let i in res.result) {
                        temp.push({
                            pid: res.result[i].pid,
                            orgId: res.result[i].orgId,
                            orgName: res.result[i].orgName,
                            ifshow: true,
                        })
                    }
                    var data = { leftData: this.state.leftData, rightData: temp };
                    this.setState({
                        rightDatas: res.result,
                        data: data,
                    })
                    this.props.callbackData(JSON.stringify(data))
                })

        } else {
            this.props.callbackData(JSON.stringify(this.state.data))
        }

    }
    rightList_manychoice() {
        var temp = [];
        var rowData = this.state.rightDatas;
        temp.push(
            <TouchableOpacity onPress={this.rightCallback_manychoice.bind(this, { deptName: '全部', companyId: '' }, '100')} style={{ flex: 1 }}>
                <View style={{ height: 50, backgroundColor: ('100' == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Text style={{
                                textAlign: 'center',
                                color: ('100' == this.state.chooseNumright) ? '#D73500' : '#000',
                                fontSize: 12,
                            }} numberOfLines={2}>{'全部'}</Text>
                        </View>
                        {('100' == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                        </View> : null}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
            </TouchableOpacity>
        )
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback_manychoice.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (rowData[i].ifshow == true) ? '#F6F6F6' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: (rowData[i].ifshow == true) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].orgName}</Text>
                            </View>
                            {(rowData[i].ifshow == true) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }
    showChooseList() {
        var temp = [];
        var rowData = this.state.rightDatas;
        for (let i in rowData) {
            if (rowData[i].ifshow) {
                temp.push(
                    <View key={i} style={{ marginLeft: 10, marginRight: 10, flex: 1 }}>
                        <View style={{ height: 50, backgroundColor: 'white', justifyContent: 'center' }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 30, backgroundColor: '#D73500' }}>
                                <Text style={{
                                    marginLeft: 10,
                                    color: 'white',
                                    fontSize: 13,
                                }} numberOfLines={1}>{rowData[i].orgName}</Text>
                                <TouchableOpacity onPress={this.mmdelete.bind(this, rowData[i], i)} style={{ marginRight: 5, height: 30, justifyContent: 'center', alignItems: 'flex-end', }}>
                                    <Image source={require('../image/close.png')} style={{ width: 12, height: 12, marginLeft: 5 }} />
                                </TouchableOpacity>
                            </View>
                        </View >
                    </View >
                )
            }
        }
        return temp;
    }

    mmdelete(rowData, i) {
        this.state.rightDatas[i].ifshow = !this.state.rightDatas[i].ifshow;
        var data = { leftData: this.state.leftData, rightData: this.state.rightDatas };
        this.setState({
            data: data,
            rightData: rowData,
            chooseNumright: i,
        })
    }
    rightList() {
        var temp = [];
        var rowData = this.state.rightDatas;
        temp.push(
            <TouchableOpacity onPress={this.rightCallback.bind(this, { orgName: '全部', orgId: '' }, 'all')} style={{ flex: 1 }}>
                <View style={{ height: 50, backgroundColor: ('all' == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Text style={{
                                textAlign: 'center',
                                color: ('all' == this.state.chooseNumright) ? '#D73500' : '#000',
                                fontSize: 12,
                            }} numberOfLines={2}>{'全部'}</Text>
                        </View>
                        {('all' == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                        </View> : null}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
            </TouchableOpacity>
        )
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity onPress={this.rightCallback.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: (i == this.state.chooseNumright) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].orgName}</Text>
                            </View>
                            {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }
    rightList_hourminute() {
        var temp = [];
        var rowData = [{ deptName: '00' }, { deptName: '30' }];
        // temp.push(<TouchableOpacity onPress={this.rightCallback.bind(this, { deptName: '全部' }, '100')} style={{ flex: 1 }}>
        //     <View style={{ height: 50, backgroundColor: ('100' == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
        //         <View style={{ flex: 1, flexDirection: 'row' }}>
        //             <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
        //                 <Text style={{
        //                     textAlign: 'center',
        //                     color: ('100' == this.state.chooseNumright) ? '#D73500' : '#000',
        //                     fontSize: 12,
        //                 }} numberOfLines={2}>{'全部'}</Text>
        //             </View>
        //             {('100' == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
        //                 <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
        //             </View> : null}
        //         </View>
        //     </View>
        //     <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
        // </TouchableOpacity>)
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback.bind(this, rowData[i].deptName, i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{
                                    textAlign: 'left',
                                    color: (i == this.state.chooseNumright) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].deptName}</Text>
                            </View>
                            {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }
    rightList_yearmonth() {
        var temp = [];
        var rowData = [{ deptName: '12' }, { deptName: '11' }, { deptName: '10' }, { deptName: '09' }, { deptName: '08' }, { deptName: '07' },
        { deptName: '06' }, { deptName: '05' }, { deptName: '04' }, { deptName: '03' }, { deptName: '02' }, { deptName: '01' }];
        temp.push(<TouchableOpacity onPress={this.rightCallback.bind(this, { deptName: '全部' }, '100')} style={{ flex: 1 }}>
            <View style={{ height: 50, backgroundColor: ('100' == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                        <Text style={{
                            textAlign: 'center',
                            color: ('100' == this.state.chooseNumright) ? '#D73500' : '#000',
                            fontSize: 12,
                        }} numberOfLines={2}>{'全部'}</Text>
                    </View>
                    {('100' == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                        <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                    </View> : null}
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
        </TouchableOpacity>)
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{
                                    textAlign: 'left',
                                    color: (i == this.state.chooseNumright) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].deptName + '月'}</Text>
                            </View>
                            {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }
    rightList_yearmonth_two() {
        var temp = [];
        var rowData = [{ deptName: '1-6月份' }, { deptName: '6-12月份' }];
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={{
                                    textAlign: 'left',
                                    color: (i == this.state.chooseNumright) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].deptName}</Text>
                            </View>
                            {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }
    rightList_noleft() {
        var temp = [];
        var rowData = this.state.data_education;
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback_noleft.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumright) ? '#F6F6F6' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    // textAlign: 'center',
                                    color: (i == this.state.chooseNumright) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].label}</Text>
                            </View>
                            {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }
    rightList_noleft_project() {
        var temp = [];
        // var rowData = (this.state.project == '1') ? this.state.projectlist : this.state.projectlist1;
        var rowData = this.state.stu == 'native' ? this.state.projectlist : this.state.searchprojectlist;
        temp.push(
            <TouchableOpacity onPress={this.rightCallback_noleft_project.bind(this, { PROJECT_NAME: '全部项目', ID: '' }, 'all')} style={{ flex: 1 }}>
                <View style={{ height: 50, backgroundColor: ('all' == this.state.chooseNumright) ? '#fff' : '#fff' }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Text style={{
                                // textAlign: 'center',
                                color: ("all" == this.state.chooseNumright) ? '#000' : '#000',
                                fontSize: 12,
                                marginTop: 5
                            }} numberOfLines={2}>{'全部项目'}</Text>
                        </View>
                        {('all' == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                            <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} />
                        </View> : null}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
            </TouchableOpacity>
        )
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.rightCallback_noleft_project.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumright) ? '#fff' : '#fff' }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    // textAlign: 'center',
                                    color: (i == this.state.chooseNumright) ? '#000' : '#000',
                                    fontSize: 12,
                                    marginTop: 5
                                }} numberOfLines={2}>{rowData[i].PROJECT_NAME}</Text>
                            </View>
                            {(i == this.state.chooseNumright) ? <View style={{ marginRight: 5, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                {/* <Image source={require('../image/check.png')} style={{ width: 16, height: 16 }} /> */}
                            </View> : null}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 2 }} />
                </TouchableOpacity>
            )
        }
        return temp;
    }

    leftList() {
        var temp = [];
        var rowData = this.state.leftDatas;
        for (let i in rowData) {
            if (rowData[i].id != '01DDCFC8FE64492C8E9281F1B1519B33') {
                temp.push(
                    <TouchableOpacity key={i} onPress={this.leftCallback.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                        <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumleft) ? '#fff' : '#F6F6F6' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                    <Text style={{
                                        // textAlign: 'center',
                                        color: (i == this.state.chooseNumleft) ? '#D73500' : '#000',
                                        fontSize: 12,
                                    }} numberOfLines={2}>{rowData[i].name}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        return temp;
    }

    leftList_manychoice() {
        var temp = [];
        var rowData = this.state.leftDatas;
        for (let i in rowData) {
            if (rowData[i].id != '01DDCFC8FE64492C8E9281F1B1519B33') {
                temp.push(
                    <TouchableOpacity key={i} onPress={this.leftCallback.bind(this, rowData[i], i)} style={{ flex: 1 }}>
                        <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumleft) ? '#fff' : '#F6F6F6' }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                    <Text style={{
                                        // textAlign: 'center',
                                        color: (i == this.state.chooseNumleft) ? '#D73500' : '#000',
                                        fontSize: 12,
                                    }} numberOfLines={2}>{rowData[i].name}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        return temp;
    }
    leftList_hourminute() {
        var temp = [];
        var rowData = [
            { value: "00", label: "00" },
            { value: "01", label: "01" },
            { value: "02", label: "02" },
            { value: "03", label: "03" },
            { value: "04", label: "04" },
            { value: "05", label: "05" },
            { value: "06", label: "06" },
            { value: "07", label: "07" },
            { value: "08", label: "08" },
            { value: "09", label: "09" },
            { value: "10", label: "10" },
            { value: "11", label: "11" },
            { value: "12", label: "12" },
            { value: "13", label: "13" },
            { value: "14", label: "14" },
            { value: "15", label: "15" },
            { value: "16", label: "16" },
            { value: "17", label: "17" },
            { value: "18", label: "18" },
            { value: "19", label: "19" },
            { value: "20", label: "20" },
            { value: "21", label: "21" },
            { value: "22", label: "22" },
            { value: "23", label: "23" },
        ];
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity key={i} onPress={this.leftCallback.bind(this, rowData[i].value, i)} style={{ flex: 1 }}>
                    <View style={{ height: 50, backgroundColor: (i == this.state.chooseNumleft) ? '#fff' : '#F6F6F6' }}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, marginLeft: 15, height: 40, justifyContent: 'center', alignItems: 'flex-start', }}>
                                <Text style={{
                                    textAlign: 'center',
                                    color: (i == this.state.chooseNumleft) ? '#D73500' : '#000',
                                    fontSize: 12,
                                }} numberOfLines={2}>{rowData[i].value}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        return temp;
    }

    leftCallback(rowData, i) {
        this.setState({
            leftData: rowData,
            showRightList: true,
            chooseNumleft: i,
        })
    }

    rightCallback(rowData, i) {
        var data = { leftData: this.state.leftData, rightData: rowData };
        this.props.callbackData(JSON.stringify(data))
        this.props.onCancel()
        this.setState({
            rightData: rowData,
            chooseNumright: i,
        })
    }
    rightCallback_manychoice(rowData, i) {
        if (i == '100') {
            let query1 = {
                parentId: this.state.parentId,
            }
            Fetch.postJson(Config.mainUrl + '/ws/deptList', query1)
                .then((res) => {
                    // var temp = [];
                    // for (let i in res.result) {
                    //     temp.push({
                    //         pid: res.result[i].pid,
                    //         orgId: res.result[i].orgId,
                    //         orgName: res.result[i].orgName,
                    //         ifshow: true,
                    //     })
                    // }
                    // var data = { leftData: this.state.leftData, rightData: temp };
                    this.setState({
                        chooseNumright: i,
                        rightDatas: res.result,
                        // data: data,
                    })
                })
        } else {
            if (this.state.rightDatas[i].ifshow == undefined) {
                this.state.rightDatas[i].ifshow = false
            }
            this.state.rightDatas[i].ifshow = !this.state.rightDatas[i].ifshow;
            var data = { leftData: this.state.leftData, rightData: this.state.rightDatas };
            this.setState({
                data: data,
                rightData: rowData,
                chooseNumright: i,
            })
        }

    }
    rightCallback_noleft(rowData, i) {
        var data = { value: rowData.label, index: i, dictdataName: rowData.dictdataName };
        this.props.callbackData(data)
        this.props.onCancel()
        this.setState({
            rightData: rowData,
            chooseNumright: i,
        })
    }
    rightCallback_noleft_project(rowData, i) {
        var data = { leftData: rowData };
        this.props.callbackData(rowData)
        this.props.onCancel()
        this.setState({
            rightData: rowData,
            chooseNumright: i,
            stu: 'native'
        })
    }
    onCancel() {
        this.props.onCancel();
        this.setState({
            stu: 'native'
        })
    }

}
const styles = StyleSheet.create({
    ViewStyle: {
        flex: 1,
        width: Dimensions.get('window').width / 2,
        height: deviceHeight / 2,
        backgroundColor: '#F6F6F6'
    },
    ViewStyle1: {
        flex: 1,
        width: Dimensions.get('window').width / 2,
        height: deviceHeight / 2,
        backgroundColor: '#fff'
    },
    ViewStyle3: {
        width: Dimensions.get('window').width / 3,
        height: deviceHeight / 2,
        backgroundColor: '#fff'
    },
    ViewStyle_noleft: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: deviceHeight / 3,
        backgroundColor: '#fff'
    },
    cuurAddress: {
        marginLeft: 10,
        // borderColor: "#c2c2c2",
        // borderWidth: 1,
        backgroundColor: '#03A9F4',
        color: '#fff',
        padding: 5,
        borderRadius: 2
    }
});
export default ListViewChooseContainer;