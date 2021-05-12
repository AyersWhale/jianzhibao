/**
* 企业审核查看
* Created by 曾一川.
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Platform, Image, ScrollView, Alert, ListView } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
import EncryptionUtils from '../utils/EncryptionUtils';
import PcInterface from '../utils/http/PcInterface';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class CompanyAuditCheck extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            uuid: UUID.v4(),
            checkStatu: '',
            reason: '',
            content: '',
            labelshow: '',
            checkQyStatu: '',
            reason: '',
            dataBlob: [],
            entry: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
        this.refresh();
        this.checkQYZZ();
        _this = this;
    }

    //检查企业是否上传营业执照
    checkQYZZ() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                this.setState({ checkQyStatu: res.hrEmailPassword, reason: res.hrEmail })
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
        return (
            <View style={styles.container}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>企业二次认证情况查看</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>企业二次认证情况查看</Text>
                    </View>
                </View>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, flexDirection: 'row' }}>
                        <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>审核状态</Text>
                        {this.state.checkQyStatu == '1' ?
                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>草拟</Text> :
                            this.state.checkQyStatu == '2' ?
                                <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>审核中</Text> :
                                this.state.checkQyStatu == '3' ?
                                    <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'green' }}>审核通过</Text> :
                                    this.state.checkQyStatu == '4' ?
                                        <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>已驳回</Text> :
                                        <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>未开启</Text>
                        }
                    </View>
                    {this.state.checkQyStatu == '4' ?
                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, flexDirection: 'row' }}>
                            <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>被拒原因</Text>
                            <Text style={{ position: 'absolute', right: 10, margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>{this.state.reason}</Text>
                        </View> : null}
                    {this.renderListView()}
                </ScrollView>
            </View>
        );
    }
    renderListView() {
        return (
            <ListView
                dataSource={_this.state.dataSource}
                renderRow={_this.DocList}
            />
        )
    }
    DocList(rowData) {
        var uri = Config.mainUrl + "/iframefile/qybdirprocess/download/" + rowData.filePath;
        if (rowData.businessType == 'idCard_front' || rowData.businessType == 'idCard_back' || rowData.businessType == 'QY_FRSQS' || rowData.businessType == 'QY_GSTTZP' || rowData.businessType == 'QY_GSFP') {
            return (
                <View style={{ alignContent: 'center', alignItems: 'center', width: deviceWidth, backgroundColor: 'white', marginTop: 10 }}>
                    <Text style={{ marginTop: 10 }}>{rowData.businessType == 'idCard_front' ? '身份证正面' : rowData.businessType == 'idCard_back' ? '身份证反面' : rowData.businessType == 'QY_FRSQS' ? '盖法人私章' : rowData.businessType == 'QY_GSTTZP' ? '公司抬头照片' : rowData.businessType == 'QY_GSFP' ? '其他' : null}</Text>
                    {rowData.businessType == 'idCard_front' || rowData.businessType == 'idCard_back' || rowData.businessType == 'QY_FRSQS' || rowData.businessType == 'QY_GSTTZP' || rowData.businessType == 'QY_GSFP' ?
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
    item: {
        flexDirection: 'row',
        width: deviceWidth,
        height: 50,
        backgroundColor: '#fff',
        paddingLeft: 15,
        paddingRight: 15,
    },

});