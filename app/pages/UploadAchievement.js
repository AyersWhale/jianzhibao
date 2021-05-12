/**
* 上传成果物
* Created by 曾一川.
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ImageBackground, Image, ScrollView, Alert, ListView } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
import Toasts from 'react-native-root-toast';
import PcInterface from '../utils/http/PcInterface';
import Global from '../utils/GlobalStorage';
import EncryptionUtils from '../utils/EncryptionUtils';
export default class UploadAchievement extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            imageSource: '',
            imageSource1: '',
            userId: this.props.userId,
            idNum: '',
            userName: '',
            birthday: '',
            userInfo: '',
            uuid: UUID.v4(),
            sex: '',
            telphone: this.props.telphone,
            nativePlace: '',
        };

    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                        {(this.props.update) ? <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity> : null}
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>上传成果物</Text>
                        </View>
                    </ImageBackground>
                    <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                        <TouchableOpacity activeOpacity={1} onPress={this.getPhoto.bind(this)} >
                            {this.state.imageSource == '' || this.state.imageSource == undefined ?
                                <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                    <Image source={require('../image/add1.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeigth / 5, borderRadius: 5 }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击拍照</Text>
                                </View> :
                                <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                    <Image source={{ uri: this.state.imageSource }} style={{ width: deviceWidth / 2 - 20, height: deviceHeigth / 5, borderRadius: 5 }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击拍照</Text>
                                </View>}
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: deviceHeigth / 3, backgroundColor: '#fff', width: deviceWidth }} />
                    <TouchableOpacity>
                        <View style={{
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: 'rgb(65,143,234)',
                            width: Dimensions.get('window').width / 1.5,
                            height: 44,
                            borderRadius: 30,
                            justifyContent: 'center'
                        }}>
                            <Text style={{ color: 'white' }}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
    directLogin() {
        Global.getValueForKey('loginInformation').then((ret) => {
            if (ret) {
                let loginParams = {
                    params: {
                        userName: ret.userName,
                        passWord: ret.passWord,
                    }
                }
                //此处加入登录接口
                EncryptionUtils.fillEncodeData(loginParams);
                PcInterface.login(loginParams, (set) => {
                    if (set.result.rcode == 1) {
                        let rawData = {
                            userInfo: loginParams,
                            loginSet: set
                        }
                        Global.getValueForKey('firstLogin').then(() => {
                            Global.saveWithKeyValue('firstLogin', { key: UUID.v4() });
                        })
                        UserInfo.initUserInfoWithDict(rawData);
                        Actions.TabBar({ type: 'replace', identity: 'student' })
                        return;
                    } else if (set.result.rcode == 0) {
                        Alert.alert("提示", set.result.rmsg
                            , [
                                {
                                    text: "确定", onPress: () => {
                                        console.log("确定");
                                    }
                                }
                            ])
                        return;
                    }
                });
            }
        })
    }

    uploadInfo_front(response) {
        let formData = new FormData();
        let file = { uri: response.uri, type: 'multipart/form-data', name: Date.parse(new Date()) + ".jpg" };
        var url = "https://api-cn.faceplusplus.com/cardpp/v1/ocridcard?api_key=RugXC8qs9im9p9G1HgAuGNhsJMTvoh19&api_secret=dKqeeptqu2LpSycZ1mVCynK0uDozYMk7";
        formData.append("image_file", file);
        fetch(url, {
            method: 'POST',
            headers: {},
            body: formData,
        }).then((responses) => {
            if (responses.ok) {
                return responses.json();
            }
        }).then((json) => {
            if (json == undefined) {
                Toasts.show('图片不清晰,请重新尝试', { position: -60 });
                this.setState({
                    imageSource: ''
                })
            } else {
                if (json.cards.length == 0) {
                    Toasts.show('请上传身份证正面照片', { position: -60 });
                    this.setState({
                        imageSource: ''
                    })
                } else {
                    if (json.cards[0].side == "front") {
                        // alert(JSON.stringify(json.cards[0]));//获取的身份证信息
                        this.setState({
                            nativePlace: json.cards[0].address,
                            idNum: json.cards[0].id_card_number,
                            userName: json.cards[0].name,
                            sex: json.cards[0].gender,
                            birthday: json.cards[0].birthday,
                            userInfo: json.cards[0],
                        })
                        this.uploadImage("idCard_front", response);
                    } else {
                        Toasts.show('请上传身份证正面照片', { position: -60 });
                        this.setState({
                            imageSource: ''
                        })
                    }
                }
            }


        }).catch((error) => {
            console.error(error);
        });
    }
    uploadInfo_back(response) {
        let formData = new FormData();
        let file = { uri: response.uri, type: 'multipart/form-data', name: Date.parse(new Date()) + ".jpg" };
        var url = "https://api-cn.faceplusplus.com/cardpp/v1/ocridcard?api_key=RugXC8qs9im9p9G1HgAuGNhsJMTvoh19&api_secret=dKqeeptqu2LpSycZ1mVCynK0uDozYMk7";
        formData.append("image_file", file);
        fetch(url, {
            method: 'POST',
            headers: {},
            body: formData,
        }).then((responses) => {
            if (responses.ok) {
                return responses.json();
            }
        }).then((json) => {
            if ((json.cards.length == 0)) {
                Toasts.show('请上传身份证反面照片', { position: -60 });
                this.setState({
                    imageSource1: ''
                })
            } else {
                if (json.cards[0].side == "back") {
                    // alert(JSON.stringify(json.cards[0]));//获取的身份证信息

                    this.uploadImage("idCard_back", response);
                } else {
                    Toasts.show('请上传身份证反面照片', { position: -60 });
                    this.setState({
                        imageSource: ''
                    })
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    uploadImage(side, response) {//上传身份证照片,side用来区分正方面

        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: response,
            url: path,
            formData: { businessType: side, businessKey: this.state.userId },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                // Toasts.show('上传成功', { position: -20 })
                this.setState({
                    uploadInfo: '网络地址：' + respones.url,
                })
            }).catch((e) => {
                // Toasts.show('上传失败', { position: -20 })
            });
    }
    getPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        ActionSheet.showActionSheetWithOptions(params)
            .then((index) => {
                if (index == 0) {
                    this._camera();
                } else if (index == 1) {
                    this._selectImage();
                }
            });
    }
    _camera() {//_camera表示正面，_camera1表示反面
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource: response.uri,
                    uploadText: response.uri,
                    status: false,
                }, () => {
                    this.uploadInfo_front(response)
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
                this.uploadInfo_front(response[0]);
                this.setState({
                    imageSource: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    getPhoto1() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取照片方式',
        }
        ActionSheet.showActionSheetWithOptions(params)
            .then((index) => {
                if (index == 0) {
                    this._camera1();
                } else if (index == 1) {
                    this._selectImage1();
                }
            });
    }
    _camera1() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource1: response.uri,
                    uploadText1: response.uri,
                    status: false,
                });
                this.uploadInfo_back(response)
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
                this.uploadInfo_back(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    //确认上传
    ensure() {
        if (this.state.imageSource == '' || this.state.imageSource == undefined || this.state.imageSource1 == '' || this.state.imageSource1 == undefined) {
            Alert.alert('温馨提示', '您还未上传身份证照片,请您继续上传', [{

                text: '继续上传',
            },
            ])
        }
        else {
            Toast.show({
                type: Toast.mode.C2MobileToastLoading,
                title: '请稍后...',
                duration: 1000,
            });
            var entity = {
                idCard: this.state.idNum,
                userId: this.state.userId
            }
            if (this.state.idNum == '') {
                Toasts.show('图片不清晰,请重新上传', { position: -80 });
                this.setState({
                    imageSource: ''
                })
            } else {
                Toast.show({
                    type: Toast.mode.C2MobileToastLoading,
                    title: '提交中...'
                });
                Fetch.postJson(Config.mainUrl + '/basicResume/updateUserIdCard', entity)
                    .then((res) => {
                        Toast.dismiss();
                        if (res.rcode == "1") {

                            Toasts.show('提交成功,请填写简历', { position: -80 });
                            Actions.Jianli({ update: this.props.update, nativePlace: this.state.nativePlace, uuid: this.state.uuid, userName: this.state.userName, telphone: this.state.telphone, sex: this.state.sex, birthday: this.state.birthday, idNum: this.state.idNum, login: '1', userInfo: this.state.userInfo, userId: this.state.userId })

                        } else if (res.rcode == "0") {
                            Toasts.show(res.Msg, { position: -80 });
                            this.setState({
                                imageSource: '',
                                imageSource1: '',
                            })
                        } else {
                            Toasts.show(res.Msg, { position: -60 });
                        }
                    }).catch((res1) => {
                        Toasts.show(res1.description, { position: -60 });
                    })
            }

        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },

});