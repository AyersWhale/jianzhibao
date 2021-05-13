/**
* 企业审核
* Created by 曾一川.
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, Alert, ListView, BackHandler, Platform } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
import Toasts from 'react-native-root-toast';
import PcInterface from '../utils/http/PcInterface';
import EncryptionUtils from '../utils/EncryptionUtils';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class CompanyAudit extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            imageSource: '',
            imageSource1: '',
            imageSource2: '',
            imageSource3: '',
            imageSource4: '',
            uuid: UUID.v4(),
            checkQyStatu: '',
            reason: '',
        };
        this.checkQYZZ()
        this.refresh()
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    //检查企业是否上传营业执照
    checkQYZZ() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                this.setState({ checkQyStatu: res.hrEmailPassword, reason: res.remark2 })
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
            for (let i in entry) {
                if (entry[i].businessType == 'idCard_front') {
                    th.setState({
                        imageSource: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                } else if (entry[i].businessType == 'idCard_back') {
                    th.setState({
                        imageSource1: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                } else if (entry[i].businessType == 'QY_FRSQS') {
                    th.setState({
                        imageSource2: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                } else if (entry[i].businessType == 'QY_GSTTZP') {
                    th.setState({
                        imageSource3: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                } else if (entry[i].businessType == 'QY_GSFP') {
                    th.setState({
                        imageSource4: Config.mainUrl + "/iframefile/qybdirprocess/download/" + entry[i].filePath,
                    });
                }
            }
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
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>企业二次认证</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>企业二次认证</Text>
                    </View>
                </View>
                <ScrollView scrollIndicatorInsets={{ right: 1 }}>
                    <View style={{ backgroundColor: 'white', width: deviceWidth, marginTop: 10 }}>
                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 40, marginTop: 10, marginBottom: 10, flexDirection: 'row' }}>
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
                    </View>
                    {this.state.checkQyStatu == '4' ?
                        <View style={{ backgroundColor: 'white', width: deviceWidth, height: 120, marginTop: 10, marginBottom: 10 }}>
                            <Text style={{ margin: 10, alignSelf: 'flex-start', fontSize: Config.MainFontSize }}>被拒原因</Text>
                            <ScrollView style={{ marginLeft: 10, width: deviceWidth, height: 60 }}>
                                <Text style={{ fontSize: Config.MainFontSize, color: 'red', padding: 5 }}>{this.state.reason}</Text>
                            </ScrollView>
                        </View> : null}
                    <View style={{ backgroundColor: 'white', width: deviceWidth, paddingTop: 10 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*手持身份证件照</Text>
                        </View>
                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                        <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto.bind(this)}>
                                {this.state.imageSource == '' || this.state.imageSource == undefined ?
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={require('../image/scsfz.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传带头像一面</Text>
                                    </View> :
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={{ uri: this.state.imageSource }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View>}
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto1.bind(this)} >
                                {this.state.imageSource1 == '' || this.state.imageSource1 == undefined ?
                                    <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                                        <Image source={require('../image/scsfzfm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                        <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold', fontSize: Config.MainFontSize + 1 }}>点击上传带国徽一面</Text>
                                    </View> :
                                    <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                                        <Image source={{ uri: this.state.imageSource1 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: deviceWidth, height: deviceHeight / 3 - 20, paddingTop: 10 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*盖法人私章</Text>
                        </View>
                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                        <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto2.bind(this)} >
                                {this.state.imageSource2 == '' || this.state.imageSource2 == undefined ?
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={require('../image/sfzzm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View> :
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={{ uri: this.state.imageSource2 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View>}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: deviceWidth, height: deviceHeight / 3 - 20, marginTop: 10 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*公司抬头照片</Text>
                        </View>
                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                        <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto3.bind(this)} >
                                {this.state.imageSource3 == '' || this.state.imageSource3 == undefined ?
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={require('../image/sfzzm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View> :
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={{ uri: this.state.imageSource3 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View>}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'white', width: deviceWidth, height: deviceHeight / 3 - 20, marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', width: deviceWidth, height: 60 }}>
                            <Text style={{ fontSize: Config.MainFontSize + 2, marginTop: 10, marginLeft: 10, color: 'red' }}>*其他附件</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, marginTop: 10, marginLeft: 10, paddingRight: 20, width: deviceWidth / 1.3 }}>(注：其他为公司位置相关证明信息，可以为水电发票、租房发票，发票需含公司抬头)</Text>
                        </View>
                        <View style={{ width: deviceWidth - 20, height: 1, backgroundColor: 'grey', marginTop: 5, alignSelf: 'center' }} />
                        <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto4.bind(this)} >
                                {this.state.imageSource4 == '' || this.state.imageSource4 == undefined ?
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={require('../image/sfzzm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View> :
                                    <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                        <Image source={{ uri: this.state.imageSource4 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeight / 5, borderRadius: 5 }} />
                                    </View>}
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.state.checkQyStatu == '2' || this.state.checkQyStatu == '3' ? null :
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
                    }
                    <View style={{ position: 'absolute', right: 20, bottom: 90, backgroundColor: 'transparent', width: deviceWidth / 3 }}><Text>部分格式暂不支持查看，如未显示请去PC端查看</Text></View>

                </ScrollView>
            </View >
        );
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
            fileName: 'sfzz' + dataTemp + '.png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'idCard_front', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '法人身份证', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                if (respones.data.msg == "成功") {
                    Toasts.show('上传成功', { position: -20 })
                    this.setState({
                        uploadInfo: '网络地址：' + respones.data.url,
                    })
                } else {
                    Toasts.show(respones.data.errorMsg, { position: -20 })
                }
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto1() {
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
                        this._camera1();
                    } else if (index == 1) {
                        this._selectImage1();
                    }
                });
        }
    }
    _camera1() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource1: response.uri,
                    uploadText1: response.uri,
                    status: false,
                });
                this.uploadImage1(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage1() {
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
                this.setState({
                    imageSource1: response[0].uri
                })
                this.uploadImage1(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage1(response) {//上传身份证照片,side用来区分正方面
        let dataTemp = Date.parse(new Date())
        let sourceTemp = {
            ...response,
            fileName: 'sfzf' + dataTemp + '.png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'idCard_back', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '法人身份证', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                if (respones.data.msg == "成功") {
                    Toasts.show('上传成功', { position: -20 })
                    this.setState({
                        uploadInfo: '网络地址：' + respones.data.url,
                    })
                } else {
                    Toasts.show(respones.data.errorMsg, { position: -20 })
                }
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto2() {
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
                        this._camera2();
                    } else if (index == 1) {
                        this._selectImage2();
                    }
                });
        }
    }
    _camera2() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource2: response.uri,
                    uploadText2: response.uri,
                    status: false,
                });
                this.uploadImage2(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage2() {
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
                this.setState({
                    imageSource2: response[0].uri
                })
                this.uploadImage2(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage2(response) {//上传身份证照片,side用来区分正方面
        let dataTemp = Date.parse(new Date())
        let sourceTemp = {
            ...response,
            fileName: 'gfrsz' + dataTemp + '.png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_FRSQS', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '盖法人私章', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto3() {
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
                        this._camera3();
                    } else if (index == 1) {
                        this._selectImage3();
                    }
                });
        }
    }
    _camera3() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource3: response.uri,
                    uploadText3: response.uri,
                    status: false,
                });
                this.uploadImage3(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage3() {
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
                this.setState({
                    imageSource3: response[0].uri
                })
                this.uploadImage3(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage3(response) {//上传身份证照片,side用来区分正方面
        let dataTemp = Date.parse(new Date())
        let sourceTemp = {
            ...response,
            fileName: 'gstt' + dataTemp + '.png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'QY_GSTTZP', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '公司抬头照片', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                if (respones.data.msg == "成功") {
                    Toasts.show('上传成功', { position: -20 })
                    this.setState({
                        uploadInfo: '网络地址：' + respones.data.url,
                    })
                } else {
                    Toasts.show(respones.data.errorMsg, { position: -20 })
                }
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto4() {
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
                        this._camera4();
                    } else if (index == 1) {
                        this._selectImage4();
                    }
                });
        }
    }
    _camera4() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource4: response.uri,
                    uploadText4: response.uri,
                    status: false,
                });
                this.uploadImage4(response)
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _selectImage4() {
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
                this.setState({
                    imageSource4: response[0].uri
                })
                this.uploadImage4(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage4(response) {//上传身份证照片,side用来区分正方面
        let dataTemp = Date.parse(new Date())
        let sourceTemp = {
            ...response,
            fileName: 'cgw' + dataTemp + 'png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { businessType: 'QY_GSFP', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '其他', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                if (respones.data.msg == "成功") {
                    Toasts.show('上传成功', { position: -20 })
                    this.setState({
                        uploadInfo: '网络地址：' + respones.data.url,
                    })
                } else {
                    Toasts.show(respones.data.errorMsg, { position: -20 })
                }
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }


    //确认上传
    ensure() {
        if (this.state.imageSource == '' || this.state.imageSource == undefined) {
            Toast.showInfo('请上传身份证正面', 1000)
            return;
        }
        if (this.state.imageSource1 == '' || this.state.imageSource1 == undefined) {
            Toast.showInfo('请上传身份证反面', 1000)
            return;
        }
        if (this.state.imageSource2 == '' || this.state.imageSource2 == undefined) {
            Toast.showInfo('请上传盖法人私章', 1000)
            return;
        }
        if (this.state.imageSource3 == '' || this.state.imageSource3 == undefined) {
            Toast.showInfo('请上传公司抬头照片', 1000)
            return;
        }
        if (this.state.imageSource4 == '' || this.state.imageSource4 == undefined) {
            Toast.showInfo('请上传其他附件', 1000)
            return;
        }
        var entity = {
            hrEmailPassword: this.state.checkQyStatu,
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
        }
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '提交中...'
        });
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/updateSecondCompanyInfo', entity)
            .then((res) => {
                Toast.dismiss();
                if (res.rcode == "1") {
                    Toasts.show('提交成功', { position: -80 });
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1
    },

});