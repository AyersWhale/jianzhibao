/**
 * 简历筛选
 * 郭亚新 2020/4/8
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, Keyboard, DeviceEventEmitter, ImageBackground, WebView, ScrollView, Modal, Dimensions, ListView, Image, TouchableOpacity, Platform } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import { C2AmapApi } from 'c2-mobile-amap';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

let resumeCondition = {
    age: "BX",
    ageName: null,//后台需要显示值
    sex: "BX",
    salaryRanges: "BX",
    workYear: "BX",
    wyName: null,
    education: "BX",
    intentPost: null,
    workMethod: null
}
export default class ConditionFilterResume extends Component {

    constructor(props) {
        super(props);
        this.state = {
            multiData: [],//简历_性别
            multiData1: [],//学历
            gznx: [],//工作年限
            xzyq: [],//薪资要求
            nlyq: [],//年龄要求
            resumeCondition: {}
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
        //debugger//数据回显
        const selectedContionResume = this.props.selectedContionResume;
        if (selectedContionResume.multiData !== undefined) {
            this.setState({
                multiData: selectedContionResume.multiData,
                multiData1: selectedContionResume.multiData1,
                gznx: selectedContionResume.gznx,
                xzyq: selectedContionResume.xzyq,
                nlyq: selectedContionResume.nlyq
            })
        } else {
            this.getDictionary()
        }
    }
    getDictionary() {
        //debugger
        var params = {
            dictTypeNames: ["简历_性别", "学历", '工作年限', '薪资要求', '年龄要求']
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
                this.setState({
                    multiData: dicMap.result.简历_性别,
                    multiData1: dicMap.result.学历,
                    gznx: dicMap.result.工作年限,
                    xzyq: dicMap.result.薪资要求,
                    nlyq: dicMap.result.年龄要求
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
        if (filterType == 'xl') {
            this.state.multiData1.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    resumeCondition.education = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({
                multiData1: this.state.multiData1,
            });
        }

        if (filterType == 'xb') {
            this.state.multiData.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    resumeCondition.sex = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({ multiData: this.state.multiData });
        }

        if (filterType == 'nlyq') {
            this.state.nlyq.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    resumeCondition.age = items.dictdataName
                    resumeCondition.ageName = items.dictdataValue
                } else {
                    items.select = false;
                }
            })
            this.setState({ nlyq: this.state.nlyq });
        }

        if (filterType == 'xzyq') {
            this.state.xzyq.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    resumeCondition.salaryRanges = items.dictdataName
                } else {
                    items.select = false;
                }
            })
            this.setState({ xzyq: this.state.xzyq });
        }
        if (filterType == 'gznx') {
            this.state.gznx.forEach(function (items) {
                if (items.dictdataId == item.dictdataId) {
                    items.select = true;
                    resumeCondition.workYear = items.dictdataName
                    resumeCondition.wyName = items.dictdataValue
                } else {
                    items.select = false;
                }
            })
            this.setState({ gznx: this.state.gznx });
        }
    }
    cancel() {
        let con = {
            age: "BX",
            ageName: null,//后台需要显示值
            sex: "BX",
            salaryRanges: "BX",
            workYear: "BX",
            wyName: null,
            education: "BX",
            intentPost: null,
            workMethod: null
        }
        resumeCondition = con
        var params = {
            dictTypeNames: ["简历_性别", "学历", '工作年限', '薪资要求', '年龄要求']
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
                this.setState({
                    multiData: dicMap.result.简历_性别,
                    multiData1: dicMap.result.学历,
                    gznx: dicMap.result.工作年限,
                    xzyq: dicMap.result.薪资要求,
                    nlyq: dicMap.result.年龄要求
                })
                let selectedContion = {
                    multiData: this.state.multiData,
                    multiData1: this.state.multiData1,
                    gznx: this.state.gznx,
                    xzyq: this.state.xzyq,
                    nlyq: this.state.nlyq,
                }
                let ifhadChoose = {
                    flag: false
                }
                this.props.onblock(con, selectedContion, ifhadChoose)
            })
        //需要清除筛选条件
    }
    makeSure() {
        Actions.pop()
        let selectedContion = {
            multiData: this.state.multiData,
            multiData1: this.state.multiData1,
            gznx: this.state.gznx,
            xzyq: this.state.xzyq,
            nlyq: this.state.nlyq,
        }
        let ifhadChoose = {
            flag: true
        }
        this.props.onblock(resumeCondition, selectedContion, ifhadChoose)
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
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>条件筛选</Text>
                    </View>
                </View>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>学历要求</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.multiData1, 'xl')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>性别</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.multiData, 'xb')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>年龄</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.nlyq, 'nlyq')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>薪资要求</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.xzyq, 'xzyq')}
                    <View style={styles.title}>
                        <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: "bold", color: "#353535" }}>工作年限</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: "#838383" }}>（单选）</Text>
                    </View>
                    {this.renderWorkType(this.state.gznx, 'gznx')}
                </ScrollView>

                <View style={{ width: deviceWidth, position: "absolute", height: 66, bottom: 0, borderTopWidth: 1, flexDirection: "row", borderColor: "#c2c2c2" }}>
                    <TouchableOpacity style={{ backgroundColor: '#fff', width: deviceWidth / 3, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.cancel()}>
                        <Text style={{ textAlign: "center", fontSize: Config.MainFontSize + 3, color: "#353535" }}>清除</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: 'rgb(65,143,234)', width: deviceWidth * 2 / 3, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.makeSure()}>
                        <Text style={{ color: 'white', fontSize: Config.MainFontSize + 3 }}>确定</Text>
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