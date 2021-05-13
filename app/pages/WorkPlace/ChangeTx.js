import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, PixelRatio, TouchableOpacity, Dimensions, Image, TextInput, Alert, ImageBackground, DeviceEventEmitter } from 'react-native';
import px2dp from '../../utils/px2dp';
import { UserInfo, Actions, NavigationBar, Fetch, Config, Toast, Camera, ImagePicker, FileManager, ActionSheet, VectorIcon, UUID, SafeArea } from 'c2-mobile';
import PcInterface from '../../utils/http/PcInterface';
import Global from '../../utils/GlobalStorage';
import Toasts from 'react-native-root-toast';
import EncryptionUtils from '../../utils/EncryptionUtils';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const dataTemp = Date.parse(new Date())
export default class ChangeTx extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Tximg: ''
        }

    }
    componentWillMount() {
        var entity = {
            // businessType: 'GR_TX',
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/checkUploadTX', entity)
            .then((res) => {
                if (res.length == 0) {
                    this.setState({
                        Tximg: ''
                    })
                } else {
                    this.setState({
                        Tximg: Config.mainUrl + "/iframefile/qybdirprocess/" + res[0].filePath
                    })
                }
                console.warn('头像返回：' + JSON.stringify(res))
            })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#e5e5e5', }}>
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>个人信息</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ marginTop: 170 }} onPress={this.getPhoto.bind(this)}>
                    {this.state.Tximg == '' ? <Image source={require('../../image/center_header_img150x150.png')} style={{ width: deviceWidth, height: 300 }} />
                        : <Image source={{ uri: this.state.Tximg }} style={{ width: deviceWidth, height: 300 }} />}
                </TouchableOpacity>
            </View>
        )
    }
    getPhoto() {
        var params = {
            options: ['点击拍照', '相册选择'],
            title: '请选择获取头像方式',
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
                    Tximg: response.uri,
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
                    Tximg: response[0].uri
                })
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    uploadImage(response) {
        let sourceTemp = {
            ...response,
            fileName: 'gr' + dataTemp + '.png'
        }
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        var params = {
            source: sourceTemp,
            url: path,
            formData: { ifCover: "true", businessType: 'GR_TX', businessKey: UserInfo.loginSet.result.rdata.loginUserInfo.userId, displayName: '个人头像', },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toasts.show('上传成功', { position: -20 })
                DeviceEventEmitter.emit('Tx')
                this.setState({
                    uploadInfo: '网络地址：' + respones.data.url,
                })
            }).catch((e) => {
                Toasts.show('上传失败', { position: -20 })
            });
    }
}