/**
 * 查看成果物
 * Created by 曾一川 on 18/07/18.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Keyboard, TextInput, Alert, } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, FileManager } from 'c2-mobile';
import theme from '../config/theme';
import Toasts from 'react-native-root-toast';
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class CheckCGW extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            M: false,
            W: false,
            result: [],
            imageSource: '',
            value: '',
            id: '',
            logId: '',
        }
        this.CheckCGW()
    }
    CheckCGW() {
        var temp = {
            userId: this.props.rowData.USER_ID,
            positionId: this.props.positionId
        }
        var tep = [];
        Fetch.postJson(Config.mainUrl + '/temporaryLog/viewResultcontenApp', temp)
            .then((res) => {
                if (res.length > 0) {
                    for (let i in res) {
                        let docParams = {
                            params: {
                                businessKey: res[i].REMARK1,
                            }
                        }
                        EncryptionUtils.encodeData(docParams, this.props.rowData.userName, this.props.rowData.userPassword);
                        PcInterface.getattachfiles(docParams, (set) => {
                            let entry = set.result.rdata.filelist;
                            if (entry.length > 0) {
                                for (let j in entry) {
                                    tep.push({ path: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[j].filePath, time: res[i].CREATE_TIME, fileName: entry[j].fileName, fileType: entry[j].fileType, content: res[i].CONTENT })
                                }
                                tep.sort(function (a, b) {
                                    return Date.parse(b.time.replace(/-/g, "/")) - Date.parse(a.time.replace(/-/g, "/"));
                                });
                            }
                            this.setState({
                                result: tep,
                                logId: res[res.length - 1].logId,
                                ifzero: false
                            })
                        });

                    }
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }

    render() {
        return (
            <ScrollView onPress={() => Keyboard.dismiss()} scrollIndicatorInsets={{ right: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>查看成果物</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>查看成果物</Text>
                    </View>
                </View>
                {this.state.ifzero == true ? null :
                    <View style={{ backgroundColor: '#ffffff', borderBottomColor: "#d3d3d3", borderBottomWidth: 1 }}>
                        <View style={{ marginTop: 10, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>评价成果物</Text>
                        </View>
                        <TextInput
                            style={{ height: deviceHeight / 8, backgroundColor: '#E8E8E8', fontSize: Config.MainFontSize, margin: 10 }}
                            placeholder='请输入您对成果物的最新评价，谢谢'
                            placeholderTextColor={'grey'}
                            value={this.state.value}
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            multiline={true}
                            onChangeText={(value) => this.setState({ value: value })}
                        />
                        <TouchableOpacity onPress={this.ensure.bind(this)}>
                            <View style={{
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'rgb(65,143,234)',
                                width: 80,
                                height: 44,
                                borderRadius: 10,
                                justifyContent: 'center',
                                marginTop: 10, marginBottom: 20
                            }}>
                                <Text style={{ color: 'white' }}>提交</Text>
                            </View>
                        </TouchableOpacity>
                    </View>}
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} scrollIndicatorInsets={{ right: 1 }} >
                    {this.showList()}
                </ScrollView>

            </ ScrollView>
        );
    }
    ensure() {
        if (this.state.value == '') {
            Toast.showInfo('评价不能为空', 1000)
            return;
        } else {
            Alert.alert('提示', '您确认提交吗？', [{
                text: '再看看', onPress: () => {

                }
            }, {
                text: '继续', onPress: () => {
                    Toast.show({
                        type: Toast.mode.C2MobileToastLoading,
                        title: '提交中...'
                    });
                    var entity = {
                        textarea: this.state.value,
                        id: this.state.logId,
                    }
                    Fetch.postJson(Config.mainUrl + '/temporaryLog/updatetemporaryLogReason', entity)
                        .then((res) => {
                            Toast.dismiss();
                            if (res == true) {
                                Toasts.show('提交成功', { position: -80 });
                                Actions.pop({ refresh: { test: UUID.v4() } })
                            } else {
                                Toasts.show(res.Msg, { position: -60 });
                            }
                        }).catch((res1) => {
                            Toasts.show(res1.description, { position: -60 });
                        })
                }
            }])
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
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem.bind(this)}
                />

            </View>)
        }

    }
    _renderItem(rowData) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', width: deviceWidth, marginTop: 10 }}>
                <Text style={{ fontSize: Config.MainFontSize, margin: 10 }}>创建时间：{rowData.time}</Text>
                <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                {/* <View style={{ flexDirection: 'column', margin: 10 }}>
                    <Image source={{ uri: rowData.path }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                </View> */}
                <TouchableOpacity onPress={this.downLoad.bind(this, rowData)}>
                    <Text style={{ textAlign: 'left', fontSize: 15, color: "grey", margin: 10 }}>{rowData.fileName}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: Config.MainFontSize, margin: 10 }}>企业评价：{rowData.content}</Text>
            </View>
        )
    }
    downLoad(rowData) {
        if (rowData.fileType == 'pdf' || rowData.fileType == 'PDF') {
            if (Platform.OS == 'ios') {
                Actions.C2WebView({ url: rowData.path })
            } else {
                Actions.PDFWebView({ url: rowData.path })
            }
        } else if (rowData.fileType == 'jpg' || rowData.fileType == 'png' || rowData.fileType == 'JPG' || rowData.fileType == 'PNG') {
            if (Platform.OS == 'ios') {
                Actions.C2WebView({ url: rowData.path })
            } else {
                Actions.ImageView({ url: rowData.path })
            }
        } else {
            Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                text: '好的', onPress: () => {
                }
            }, {}
            ])
        }

    }
    pres1() {
        this.setState({
            M: true,
            W: false,
        })
    }
    pres2() {
        this.setState({
            M: false,
            W: true
        })
    }

    dataChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " "
        return date;
    }
}


const styles = StyleSheet.create({

});
