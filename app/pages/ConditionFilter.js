/**
 * 岗位筛选
 * 郭亚新 2020/4/7
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Keyboard, DeviceEventEmitter, ImageBackground, WebView, ScrollView, Modal, Dimensions, ListView, Image, TouchableOpacity, Platform } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import { C2AmapApi } from 'c2-mobile-amap';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let jobCondition = {
    workMode: null,
    workYears: "BX",
    educationRequire: "BX",
    //userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,//UserInfo放在全局中不起作用，可能跟加载顺序有关
    positionProvinceName: null,
    positionKind: "BX",
    positionCityName: null,
    positionAreaName: null,
    keyWord: null,
    //positionKind: null
}
export default class ConditionFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            multiData: [],//工作方式
            multiData1: [],//学历
            gznx: [],//工作年限
            gwlb: [],//岗位类别
            jobCondition: {},
            ifhadChoose: false
        }


    }

    componentDidMount() {
        this.loadData()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    loadData() {
        //debugger
        const selectedContionJob = this.props.selectedContionJob;
        if (selectedContionJob.multiData !== undefined) {
            this.setState({
                multiData: selectedContionJob.multiData,
                multiData1: selectedContionJob.multiData1,
                gznx: selectedContionJob.gznx,
                gwlb: selectedContionJob.gwlb,
            })
        } else {
            this.getDictionary()
        }
    }
    getDictionary() {
        //debugger
        var params = {
            dictTypeNames: ["工作方式", "学历", '工作年限', '岗位类别']
        }
        fetch(Config.mainUrl + '/getDictDataMap', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((res) => res.text())
            .then((json) => {
                let dicMap = JSON.parse(json)
                //debugger
                console.log(dicMap)
                let multiData_temp = dicMap.result.工作方式
                multiData_temp = multiData_temp.filter((item, idx) => {
                    return item.dictdataName !== "CHYW"
                })
                this.setState({
                    multiData: multiData_temp,
                    multiData1: dicMap.result.学历,
                    gznx: dicMap.result.工作年限,
                    gwlb: dicMap.result.岗位类别,
                })
            })
    }
    _selectPress(item, filterType) {
        // if (item.select) {//多选可以用到
        //     this.state.selectMultiItem.splice(this.state.selectMultiItem.findIndex(function (x) {
        //         return x === item.id;
        //     }), 1);
        // } else {
        //     this.state.selectMultiItem.push(item.id);
        // }
        if (filterType == 'gzfs') {
            this.state.multiData.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    jobCondition.workMode = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({
                multiData: this.state.multiData,
            });
        }

        if (filterType == 'xl') {
            this.state.multiData1.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    jobCondition.educationRequire = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({ multiData1: this.state.multiData1 });
        }

        if (filterType == 'gznx') {
            this.state.gznx.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    jobCondition.workYears = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({ gznx: this.state.gznx });
        }

        if (filterType == 'gwlb') {
            this.state.gwlb.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    jobCondition.positionKind = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({ gwlb: this.state.gwlb });
        }
    }
    cancel() {
        //this.getDictionary();
        let Condition = {
            workMode: null,
            workYears: "BX",
            educationRequire: "BX",
            //userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,//UserInfo放在全局中不起作用，可能跟加载顺序有关
            positionProvinceName: null,
            positionKind: "BX",
            positionCityName: null,
            positionAreaName: null,
            keyWord: null,
            //positionKind: null
        }
        jobCondition = Condition
        var params = {
            dictTypeNames: ["工作方式", "学历", '工作年限', '岗位类别']
        }
        fetch(Config.mainUrl + '/getDictDataMap', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }).then((res) => res.text())
            .then((json) => {
                let dicMap = JSON.parse(json)
                //debugger
                let multiData_temp = dicMap.result.工作方式
                multiData_temp = multiData_temp.filter((item, idx) => {
                    return item.dictdataName !== "CHYW"
                })
                this.setState({
                    multiData: multiData_temp,
                    multiData1: dicMap.result.学历,
                    gznx: dicMap.result.工作年限,
                    gwlb: dicMap.result.岗位类别,
                })
                let selectedContion = {
                    multiData: this.state.multiData,
                    multiData1: this.state.multiData1,
                    gwlb: this.state.gwlb,
                    gznx: this.state.gznx
                }
                let ifhadChoose = {
                    flag: false
                }
                this.props.onblock(Condition, selectedContion, ifhadChoose)
            })
        //清除
    }
    makeSure() {
        Actions.pop()
        let selectedContion = {
            multiData: this.state.multiData,
            multiData1: this.state.multiData1,
            gwlb: this.state.gwlb,
            gznx: this.state.gznx
        }
        let ifhadChoose = {
            flag: true
        }
        this.props.onblock(jobCondition, selectedContion, ifhadChoose)
    }
    renderWorkType(testData, filterType) {
        let len = testData.length
        let randerArry = []
        for (let i = 0; i < len; i++) {
            let item = testData[i]
            if (item.select) {
                randerArry.push(
                    <TouchableOpacity key={i}
                        onPress={() => this._selectPress(item, filterType)} style={[styles.markRow, styles.markChecked]}>
                        <Text style={styles.markCheckedText}>{item.dictdataValue}</Text>
                    </TouchableOpacity>
                )
            } else {
                randerArry.push(
                    <TouchableOpacity key={i}
                        onPress={() => this._selectPress(item, filterType)} style={[styles.markRow, styles.markUnCheck]}>
                        <Text style={styles.markUnCheckText}>{item.dictdataValue}</Text>
                    </TouchableOpacity>
                )
            }
        }
        return (
            <View style={styles.multiBox}>
                {randerArry}
            </View>
        );
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 66 }} >
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"c2_im_close_plus"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>条件筛选</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>条件筛选</Text>
                    </View>
                </View>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>工作方式</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选，默认为不限）</Text>
                    </View>
                    {this.renderWorkType(this.state.multiData, 'gzfs')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>学历</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.multiData1, 'xl')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>工作年限</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.gznx, 'gznx')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>岗位类别</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.gwlb, 'gwlb')}
                </ScrollView>

                <View style={{ width: deviceWidth, position: "absolute", height: 66, bottom: 0, borderTopWidth: 1, flexDirection: "row", borderColor: "#c2c2c2" }}>
                    <TouchableOpacity style={{ backgroundColor: '#fff', width: deviceWidth / 3, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.cancel()}>
                        <Text style={{ textAlign: "center", fontSize: Config.MainFontSize + 3, color: "#353535" }}>清除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth * 2 / 3, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.makeSure()}>
                        <Text style={{ color: 'white', fontSize: Config.MainFontSize + 3, }}>确定</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    multiBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: "wrap",
        marginTop: 20,
        marginBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    markRow: {
        width: deviceWidth / 4,
        //height: 40,
        //lineHeight: 40,
        padding: 10,
        marginBottom: 16,
        marginRight: 16,
        borderRadius: 8,
        borderWidth: 0.5,
    },
    markChecked: {
        borderColor: "#3B7ED9",
        backgroundColor: "#e8eefb",
    },
    markUnCheck: {
        backgroundColor: "white",
        borderColor: "#dddddd",
    },
    markCheckedText: {
        fontSize: 12,
        color: "#3B7ED9",
        textAlign: "center",
    },
    markUnCheckText: {
        fontSize: 12,
        color: "#838383",
        textAlign: "center",
    },
    title: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 20,
        marginTop: 20
    }
});