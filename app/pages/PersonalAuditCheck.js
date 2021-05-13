/**
* 个人审核查看
* Created by 曾一川.
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, Alert, ListView } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
import EncryptionUtils from '../utils/EncryptionUtils';
import PcInterface from '../utils/http/PcInterface';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class PersonalAuditCheck extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            uuid: UUID.v4(),
            checkStatu: '',
            reason: '',
            content: '',
            labelshow: '',
            dataBlob: [],
            entry: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };

        this.checkYYZZ()
        this.refresh()
        _this = this;
    }
    //检查个人是否上传营业执照
    checkYYZZ() {
        Fetch.getJson(Config.mainUrl + '/businessLicense/checkiszcyyzz?userId=' + UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                if (res == undefined) {
                    this.setState({ checkStatu: '' })
                } else {
                    this.setState({ checkStatu: res.status })
                }
            })
    }
    refresh() {
        let docParams = {
            params: {
                businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            }
        }

        var th = this;
        EncryptionUtils.encodeData(docParams, UserInfo.userInfo.params.userName, UserInfo.userInfo.params.passWord);
        PcInterface.getattachfiles(docParams, (set) => {
            let entry = set.result.rdata.filelist;
            th.setState({
                entry: entry,
                dataSource: th.state.dataSource.cloneWithRows(entry),
                refreshing: false,
            });
        });

    }
    render() {
        var s = this.state.labelshow

        return (
            <View style={styles.container}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>个人电子营业执照查看</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>个人电子营业执照查看</Text>
                    </View>
                </View>
                <ScrollView>
                    <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, flexDirection: 'row' }}>
                        <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>审核状态</Text>
                        {this.state.checkStatu == '1' ?
                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>审核中</Text> :
                            this.state.checkStatu == '2' ?
                                <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>审核失败</Text> :
                                this.state.checkStatu == '3' ?
                                    <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'green' }}>审核通过</Text> :
                                    <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>审核中</Text>
                        }
                    </View>
                    {this.state.checkStatu == '2' ?
                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, flexDirection: 'row' }}>
                            <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>被拒原因</Text>
                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>{this.state.reason}</Text>
                        </View> : null}
                    {this.state.labelshow != '' ?
                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, flexDirection: 'row' }}>
                            <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>个人标签</Text>
                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize }}>{s.substring(0, s.length - 1)}</Text>
                        </View> : null}
                    {this.state.content != '' ?
                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 80, marginTop: 10 }}>
                            <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>自我介绍：</Text>
                            <Text style={{ margin: 10, fontSize: Config.MainFontSize }}>{this.state.content}</Text>
                        </View> : null}

                    {this.renderListView()}
                </ScrollView>
            </View>
        );
    }
    renderListView() {
        if (this.state.checkStatu == '3') {
            return (
                <ListView
                    dataSource={_this.state.dataSource}
                    renderRow={_this.DocList1}
                />
            )
        } else {
            return (
                <ListView
                    dataSource={_this.state.dataSource}
                    renderRow={_this.DocList}
                />
            )
        }

    }
    DocList(rowData) {
        uri = Config.mainUrl + "/iframefile/qybdirprocess/download/" + rowData.filePath;
        if (rowData.businessType == 'QY_SFZFM' || rowData.businessType == 'QY_SFZZM') {
            return (
                <View style={{ alignContent: 'center', alignItems: 'center', width: deviceWidth, backgroundColor: 'white' }}>
                    <Text style={{ marginTop: 10 }}>{rowData.businessType == 'QY_SFZFM' ? '身份证反面' : rowData.businessType == 'QY_SFZZM' ? '身份证正面' : null}</Text>
                    {rowData.businessType == 'QY_SFZFM' || rowData.businessType == 'QY_SFZZM' ?
                        <Image source={{ uri: uri }} style={{ width: deviceWidth / 2, height: deviceWidth / 2, alignSelf: 'center', margin: 10 }} />
                        : null}
                </View>

            );
        } else {
            return null
        }
    }
    DocList1(rowData) {
        uri = Config.mainUrl + "/iframefile/qybdirprocess/download/" + rowData.filePath;
        if (rowData.businessType == 'QY_DZYYZZ') {
            return (
                <View style={{ alignContent: 'center', alignItems: 'center', width: deviceWidth, backgroundColor: 'white' }}>
                    <Text style={{ marginTop: 10 }}>{rowData.businessType == 'QY_DZYYZZ' ? '电子营业执照' : null}</Text>
                    {rowData.businessType == 'QY_DZYYZZ' ?
                        <Image source={{ uri: uri }} style={{ width: deviceWidth / 2, height: deviceWidth / 2, alignSelf: 'center', margin: 10 }} />
                        : null}
                </View>

            );
        } else {
            return null
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1
    },

});