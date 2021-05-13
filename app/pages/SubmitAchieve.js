/**
 * 提交成果物
 * Created by 曾一川 on 18/07/18.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, Alert, ListView, Platform } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';
import theme from '../config/theme';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const chineseTest = /[\u4E00-\u9FA5\uF900-\uFA2D]/;

export default class SubmitAchieve extends Component {
    constructor(props) {
        super(props);
        this.state = {
            M: false,
            W: false,
            imageSource: '',
            value: '',
        }
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>提交成果物</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>提交成果物</Text>
                    </View>
                </View>
                <View style={{ width: deviceWidth, backgroundColor: '#E8E8E8' }}  >
                    <View style={{ backgroundColor: 'white', width: deviceWidth, height: deviceHeight / 3 - 20, marginTop: 10 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*成果物上传</Text>
                        </View>
                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                        <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto.bind(this)} >
                                {this.state.imageSource == '' || this.state.imageSource == undefined ?
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={require('../image/cgw.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View> :
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={{ uri: this.state.imageSource }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View>}
                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity onPress={this.ensure.bind(this)}>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: Dimensions.get('window').width / 1.5,
                            height: 44,
                            borderRadius: 30,
                            justifyContent: 'center',
                            marginTop: 10, marginBottom: 20
                        }}>
                            <Text style={{ color: 'white' }}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    ensure() {
        //debugger
        if (this.state.imageSource == '' || this.state.imageSource == undefined) {
            Toast.showInfo('请上传成果物', 1000)
            return;
        }
        var entity = {
            businessKey: this.props.rowData.getJobInfoId + this.props.rowData.num,
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            positionId: this.props.rowData.positionId
        }
        Alert.alert("提示", "确认提交吗？"
            , [
                {
                    text: "我再看看", onPress: () => {
                    }
                },
                {
                    text: "继续", onPress: () => {
                        Toast.show({
                            type: Toast.mode.C2MobileToastLoading,
                            title: '提交中...'
                        });
                        Fetch.postJson(Config.mainUrl + '/temporaryLog/TJcgw', entity)
                            .then((res) => {
                                Toast.dismiss();
                                if (res.rcode == "1") {
                                    Toasts.show('提交成功', { position: -80 });
                                    this.props.calback();
                                    Actions.pop({ refresh: { test: UUID.v4() } })
                                } else if (res.rcode == "0") {
                                    Toasts.show(res.Msg, { position: -80 });
                                } else {
                                    Toasts.show(res.Msg, { position: -60 });
                                }
                            }).catch((res1) => {
                                Toasts.show(res1.description, { position: -60 });
                            })
                    }
                }
            ])
    }
    getPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        if (this.state.checkQyStatu == '2' || this.state.checkQyStatu == '3') {
            null
        } else {
            ActionSheet.showActionSheetWithOptions(params)
                .then((index) => {
                    if (index == 0) {
                        this._camera();
                    } else if (index == 1) {
                        this._selectImage();
                    }
                });
        }

    }
    _camera() {//_camera表示正面，_camera1表示反面
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource: response.uri,
                    uploadText: response.uri,
                    status: true,
                }, () => {
                    this.uploadImage(response)
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage() {//_selectImage表示正面，_selectImage1表示反面
        var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 1,
            picMin: 1,
        };
        ImagePicker.show(DEFAULT_OPTIONS)
            .then((response) => {
                if (response.length > 1) { Toasts.show('只能上传一个文件，请重新选择', { position: -80 }); return }
                this.uploadImage(response[0]);
                this.setState({
                    imageSource: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage(response) {//上传身份证照片,side用来区分正方面
        //debugger
        let dataTemp = Date.parse(new Date())
        let sourceTemp = {
            ...response,
            fileName: 'cgw' + dataTemp + '.png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'GR_CGW', businessKey: this.props.rowData.getJobInfoId + this.props.rowData.num, displayName: '成果物', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                //debugger
                // Toasts.show('上传成功', { position: -20 })
                if (respones.data.msg == "成功") {
                    this.props.calback();
                } else {
                    Toasts.show(respones.data.errorMsg, { position: -20 })
                }
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
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
