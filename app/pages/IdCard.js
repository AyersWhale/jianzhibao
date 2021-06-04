/**
* 身份证上传界面
* Created by 蒋牧野.
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ImageStore, Image, ScrollView, Alert, ListView, PermissionsAndroid, Platform, NetInfo, Modal, ImageEditor, CameraRoll } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
import Toasts from 'react-native-root-toast';
import PcInterface from '../utils/http/PcInterface';
import Global from '../utils/GlobalStorage';
import EncryptionUtils from '../utils/EncryptionUtils';
import RNFetchBlob from "rn-fetch-blob";
import { commonLogin } from '../utils/common/businessUtil'

function hypotenuse(a, b) {
    //三角形斜边
    return Math.sqrt(a * a + b * b)
}
function quadrilateralArea(a, b, c, d) {
    //海伦公式四边形面积
    let z = (a + b + c + d) / 2
    return Math.sqrt((z - a) * (z - b) * (z - c) * (z - d))
}
export default class MyCollection extends Component {
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
            isConnected: null,
            modalVisible: false
        };

    }

    componentDidMount() {
        this.openQuanxian()
    }
    openQuanxian() {
        if (Platform.OS == 'android') {
            var permissionCAMERA = PermissionsAndroid.PERMISSIONS.CAMERA;
            PermissionsAndroid.check(permissionCAMERA).then(granted => {//拍照权限
                if (granted) {//已允许
                } else {
                    PermissionsAndroid.request(
                        permissionCAMERA,
                    ).then(shouldShow => {

                    });
                }
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                        {(this.props.update) ? <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity> : null}
                        <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>身份证录入</Text>
                        </View>
                    </ImageBackground> */}
                    <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                            <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>身份证录入</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <VectorIcon name={"ok_sign"} size={12} color={'#00EE00'} style={{ backgroundColor: 'transparent', marginLeft: 2, marginTop: 2 }} />
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: '#00EE00' }}>手机注册 </Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: '#00EE00' }}>--></Text>
                        <VectorIcon name={"ok_sign"} size={12} color={'grey'} style={{ backgroundColor: 'transparent', marginLeft: 2, marginTop: 2 }} />
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey' }}>上传身份证正反面 </Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey' }}>--></Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey' }}>完善个人简历</Text>
                    </View>
                    {/* <Image source={require('../image/takePhoto.png')} style={{ width: deviceWidth , height: deviceHeigth / 3, borderRadius: 5 }} /> */}
                    <View style={{ flexDirection: 'row', alignContent: 'center', marginTop: 20 }}>
                        <TouchableOpacity activeOpacity={1} onPress={() => { this.getPhoto() }} >
                            {this.state.imageSource == '' || this.state.imageSource == undefined ?
                                <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                    <Image source={require('../image/sfzzm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeigth / 5, borderRadius: 5 }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传带头像一面</Text>
                                </View> :
                                <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                    <Image source={{ uri: this.state.imageSource }} style={{ width: deviceWidth / 2 - 20, height: deviceHeigth / 5, borderRadius: 5 }} />
                                    <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: Config.MainFontSize + 1, marginTop: 5 }}>点击上传带头像一面</Text>
                                </View>}
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={this.getPhoto1.bind(this)} >
                            {this.state.imageSource1 == '' || this.state.imageSource1 == undefined ?
                                <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                                    <Image source={require('../image/sfzbm.png')} style={{ width: deviceWidth / 2 - 20, height: deviceHeigth / 5, borderRadius: 5 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold', fontSize: Config.MainFontSize + 1 }}>点击上传带国徽一面</Text>
                                </View> :
                                <View style={{ flexDirection: 'column', marginLeft: 16 }}>
                                    <Image source={{ uri: this.state.imageSource1 }} style={{ width: deviceWidth / 2 - 20, height: deviceHeigth / 5, borderRadius: 5 }} />
                                    <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold', fontSize: Config.MainFontSize + 1 }}>点击上传带国徽一面</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: deviceHeigth / 7, backgroundColor: '#fff', width: deviceWidth }} />

                    <TouchableOpacity onPress={() => {
                        this.ensure();
                    }}>
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
                    <TouchableOpacity onPress={() => {
                        this.directLogin();
                    }}>
                        {(this.props.update) ? null : <View style={{ marginTop: 30, backgroundColor: 'transparent' }}>
                            <Text style={{ color: 'rgb(65,143,234)', position: 'absolute', right: 5, bottom: 5 }}>跳过，直接登录</Text>
                        </View>}
                    </TouchableOpacity>
                </ScrollView>
                {/* {this.editor()} */}
            </View>
        );
    }
    editor() {
        var deviceWidth = Dimensions.get('window').width;
        var deviceHeight = Dimensions.get('window').height;
        let _maxLength = deviceHeight / 5;
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    modalVisible={false}
                    transparent={true}
                    animationType={'fade'}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({ modalVisible: false }) }}
                >
                    <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => this.setState({ modalVisible: false })}>
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', width: deviceWidth - 40, marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                    </View>

                </Modal>
            </View>
        )
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
                commonLogin(loginParams, () => {
                    Actions.TabBar({ type: 'replace', identity: 'student' })
                    return;
                })
            }
        })
    }

    uploadInfo_front(response, cardInfo) {
        // this.uploadImage("idCard_front", response)
        // return
        var date = new Date();
        var year = date.getFullYear(); //获取完整的年份(4位)
        if (year - parseInt(cardInfo.birth.substring(0, 4)) <= 16) {
            //用JSON.parse()转数字，首位是0会报错
            Toasts.show('未满16岁身份证无效', { position: -60 });
            this.setState({
                imageSource: ''
            })
        }
        else {
            const idcardReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (idcardReg.test(cardInfo.num)) {
                this.setState({
                    nativePlace: cardInfo.address,
                    idNum: cardInfo.num,
                    userName: cardInfo.name,
                    sex: cardInfo.sex,
                    birthday: cardInfo.birth,
                    // userInfo: cardInfo,
                })
                Alert.alert('温馨提示', '请确定您的信息是否为【' + cardInfo.name + ',' + cardInfo.num + '】，如不正确，请重新上传照片', [
                    { text: '取消', onPress: () => { this.setState({ imageSource: '' }) } },
                    { text: '正确', onPress: () => { this.uploadImage("idCard_front", response); } }
                ])
            } else {
                Alert.alert('温馨提示', '请上传清晰的二代身份证正面照片', [{
                    text: '继续上传',
                },
                ])
                this.setState({
                    imageSource: ''
                })
            }
        }
    }
    uploadInfo_back(response, cardInfo) {
        if (cardInfo.success) {
            this.uploadImage("idCard_back", response);
        }
    }
    uploadImage(side, response) {//上传身份证照片,side用来区分正方面
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '正在上传...'
        });
        var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
        let responseTemp = {
            ...response,
            fileName: Date.parse(new Date()) + ".jpg"
        }
        var params = {
            source: responseTemp,
            url: path,
            formData: { ifCover: "true", businessType: side, businessKey: this.state.userId },
            progress: (events) => {
            }
        }
        FileManager.uploadFile(params)
            .then((respones) => {
                Toast.dismiss();
                console.log(respones)
                if (side == 'idCard_front') {
                    this.setState({
                        uploadInfo: respones.data.url,
                    })
                }
                // if(respones.data){
                //     Toasts.show('上传成功', { position: -80 })
                // }else{
                //     Toasts.show('上传失败', { position: -80 })
                // }
            }).catch((e) => {
                Toast.dismiss();
                Toasts.show('上传失败', { position: -80 })
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
    handleCheckCard(dataSource) {
        // debugger
        let coordinateArray = dataSource.card_region
        // coordinateArray 坐标数组
        //检测图片是不是符合标准
        let normal_width = Math.abs(coordinateArray[1].x - coordinateArray[0].x) //常规宽
        let normal_height = Math.abs(coordinateArray[3].y - coordinateArray[0].y) //常规高
        if (dataSource.angle && dataSource.angle == 270) {
            normal_width = Math.abs(coordinateArray[3].y - coordinateArray[0].y)
            normal_height = Math.abs(coordinateArray[1].x - coordinateArray[0].x)
        }
        let mask_width = Platform.OS == 'ios' ? deviceWidth - 40 : deviceWidth * 0.9// 遮罩框宽度
        let mask_height = Platform.OS == 'ios' ? (deviceWidth - 40) / 1.6 : deviceWidth * 0.9 * 400 / 620 // 遮罩框高度
        console.log('遮罩层宽高', mask_width, mask_height)
        let mask_area = mask_width * mask_height //遮罩框的面积
        let mask_marginleft = Platform.OS == 'ios' ? 40 / 2 : (deviceWidth - mask_width) / 2 // 遮罩框的marginleft
        let a_oppsite = Math.abs(coordinateArray[1].x - coordinateArray[0].x)
        let a_oppsite_h = Math.abs(coordinateArray[1].y - coordinateArray[0].y)
        let a = hypotenuse(a_oppsite, a_oppsite_h)

        let b_oppsite = Math.abs(coordinateArray[3].x - coordinateArray[0].x)
        let b_oppsite_h = Math.abs(coordinateArray[3].y - coordinateArray[0].y)
        let b = hypotenuse(b_oppsite, b_oppsite_h)

        let c_oppsite = Math.abs(coordinateArray[3].x - coordinateArray[2].x)
        let c_oppsite_h = Math.abs(coordinateArray[3].y - coordinateArray[2].y)
        let c = hypotenuse(c_oppsite, c_oppsite_h)

        let d_oppsite = Math.abs(coordinateArray[2].x - coordinateArray[1].x)
        let d_oppsite_h = Math.abs(coordinateArray[2].y - coordinateArray[1].y)
        let d = hypotenuse(d_oppsite, d_oppsite_h)

        if (normal_width < normal_height) { //判断是横向，而不是竖向
            Toasts.show('请保持身份证横向摆放，重新上传', { position: -80 })
            return false
        }
        let de_ratio_a = a_oppsite > a_oppsite_h ? a_oppsite_h / a_oppsite : a_oppsite / a_oppsite_h //a偏移比例
        let de_ratio_b = b_oppsite > b_oppsite_h ? b_oppsite_h / b_oppsite : b_oppsite / b_oppsite_h //b偏移比例
        let de_ratio_c = c_oppsite > c_oppsite_h ? c_oppsite_h / c_oppsite : c_oppsite / c_oppsite_h //c偏移比例
        let de_ratio_d = d_oppsite > d_oppsite_h ? d_oppsite_h / d_oppsite : d_oppsite / d_oppsite_h //d偏移比例

        if (de_ratio_a > 0.17 || de_ratio_b > 0.17 || de_ratio_c > 0.17 || de_ratio_d > 0.17) {//判断身份证是否是2d倾斜 0.17是偏移角度12度，不能大于12度
            Toasts.show('请调整身份证方向与照片底部平行，重新上传', { position: -80 })
            return false
        } else {
            let imgArea = quadrilateralArea(a, b, c, d)
            if (imgArea / mask_area < 0.8) {
                Toasts.show('身份证照片尺寸过小，请重新拍照上传', { position: -80 })
                return false
            }
        }
        return true
    }

    handleRecognition_front(response) {
        //调用第三方接口识别身份正面
        console.log("图片信息", response)
        const fs = RNFetchBlob.fs;
        let local_url = response.uri
        if (Platform.OS == 'ios') {
            if (local_url.indexOf('file://') !== -1) {
                local_url = local_url.replace(new RegExp("file://"), '')
            }
        }
        // url = "/Users/gyx/Library/Developer/CoreSimulator/Devices/8F09BA09-FAC7-4D7C-AD9D-568C54733095/data/Containers/Data/Application/288AD5BA-999A-4BE6-9905-520AE678409C/Library/Caches/image/72CE1C74-576F-4390-87C1-25D89CB16B1F.jpg"
        fs.readFile(local_url, 'base64')
            .then((content) => {
                fetch('https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        // AppCode:'606e5da84a634667a9499e5f1e4c9a98',
                        Authorization: 'APPCODE 606e5da84a634667a9499e5f1e4c9a98'
                    },
                    body: JSON.stringify({
                        "image": content,
                        "configure": 'face'
                        // { "side": "face" } //身份证正反面类型: face / back
                    })
                }).then((res) => {
                    console.log(res)
                    var dataSource = JSON.parse(res._bodyText)
                    var imgWidth = Math.abs(dataSource.card_region[1].x - dataSource.card_region[0].x)
                    var imgHeight = Math.abs(dataSource.card_region[3].y - dataSource.card_region[0].y)
                    if (!this.handleCheckCard(dataSource)) {
                        return
                    }
                    this.setState({
                        imageSource: response.uri
                    })
                    this.uploadInfo_front(response, dataSource)
                    // if (Platform.OS == 'ios') {
                    //     this.setState({
                    //         imageSource: response.uri
                    //     })
                    //     this.uploadInfo_front(response, dataSource)
                    // } else {
                    //     let size = { width: imgWidth, height: imgHeight }
                    //     let offset = dataSource.card_region[0]
                    //     if (dataSource.angle == 270) {
                    //         size = { width: imgHeight, height: imgWidth }
                    //         offset = [dataSource.card_region[0].y, dataSource.card_region[0].x]
                    //     }
                    //     var cropData = {
                    //         offset: offset,//从原图裁剪的起始坐标
                    //         size: size,//裁剪的宽高
                    //         resizeMode: 'contain',//缩放图像时使用的调整大小模式
                    //         displaySize: { width: imgWidth, height: imgHeight }//裁剪后生成图片的大小
                    //         // displaySize: { width: deviceWidth, height: deviceWidth / 1.6 }//裁剪后生成图片的大小
                    //     }
                    //     ImageEditor.cropImage(response.uri,
                    //         cropData, (successURI) => {
                    //             console.log(successURI)
                    //             this.setState({
                    //                 imageSource: successURI
                    //             }, () => {
                    //                 this.uploadInfo_front({ ...response, uri: successURI }, dataSource)
                    //             })
                    //         },
                    //         (error) => {
                    //             console.log('剪裁失败', error)
                    //         }
                    //     )
                    // }
                }).catch((err) => {
                    Toasts.show('请上传清晰的身份证正面照片', { position: -80 })
                    console.log('调用第三方接口失败', err)
                })
            })
            .catch((err) => {
                Toasts.show('图片检测异常，请重新上传', { position: -80 })
                console.log("base64转换异常", err);
            });
    }
    handleRecognition_back(response) {
        //调用第三方接口识别身份反面
        let local_url = response.uri
        if (Platform.OS == 'ios') {
            if (local_url.indexOf('file://') !== -1) {
                local_url = local_url.replace(new RegExp("file://"), '')
            }
        }
        const fs = RNFetchBlob.fs;
        fs.readFile(local_url, 'base64')
            .then((content) => {
                fetch('https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        // AppCode:'606e5da84a634667a9499e5f1e4c9a98',
                        Authorization: 'APPCODE 606e5da84a634667a9499e5f1e4c9a98'
                    },
                    body: JSON.stringify({
                        image: content,
                        configure: { side: "back" }
                        // { "side": "face" } //身份证正反面类型: face / back
                    })
                }).then((res) => {
                    console.log(res)
                    var dataSource = JSON.parse(res._bodyText)
                    var imgWidth = Math.abs(dataSource.card_region[1].x - dataSource.card_region[0].x)
                    var imgHeight = Math.abs(dataSource.card_region[3].y - dataSource.card_region[0].y)
                    if (!this.handleCheckCard(dataSource)) {
                        return
                    }
                    this.setState({
                        imageSource1: response.uri
                    })
                    this.uploadInfo_back(response, dataSource)
                    // if (Platform.OS == 'ios') {
                    //     this.setState({
                    //         imageSource1: response.uri
                    //     })
                    //     this.uploadInfo_back(response, dataSource)
                    // } else {
                    //     let size = { width: imgWidth, height: imgHeight }
                    //     let offset = dataSource.card_region[0]
                    //     if (dataSource.angle == 270) {
                    //         size = { width: imgHeight, height: imgWidth }
                    //         offset = [dataSource.card_region[0].y, dataSource.card_region[0].x]
                    //     }
                    //     var cropData = {
                    //         offset: offset,//从原图裁剪的起始坐标
                    //         size: size,//裁剪的宽高
                    //         resizeMode: 'contain',//缩放图像时使用的调整大小模式
                    //         displaySize: { width: imgWidth, height: imgHeight }//裁剪后生成图片的大小
                    //         // displaySize: { width: deviceWidth, height: deviceWidth / 1.6 }//裁剪后生成图片的大小
                    //     }
                    //     ImageEditor.cropImage(response.uri,
                    //         cropData, (successURI) => {
                    //             console.log(successURI)
                    //             this.setState({
                    //                 imageSource1: successURI
                    //             }, () => {
                    //                 this.uploadInfo_back({ ...response, uri: successURI }, dataSource)
                    //             })
                    //         },
                    //         (error) => {
                    //             console.log('剪裁失败', error)
                    //         }
                    //     )
                    // }
                }).catch((err) => {
                    Toasts.show('请上传清晰的身份证背面照片', { position: -80 })
                    console.log('调用第三方接口失败', err)
                })
            })
            .catch((err) => {
                Toasts.show('图片检测异常，请重新上传', { position: -80 })
                console.log("base64转换异常", err);
            });
    }
    _camera() {//_camera表示正面，_camera1表示反面
        Camera.startWithPhoto({ maskType: 1 })
            .then((response) => {
                this.handleRecognition_front(response)
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
                this.handleRecognition_front(response[0])
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
        Camera.startWithPhoto({ maskType: 2 })
            .then((response) => {
                this.setState({
                    // imageSource1: response.uri,
                    status: false,
                });
                this.handleRecognition_back(response)
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
                // this.setState({
                //     imageSource1: response[0].uri
                // })
                this.handleRecognition_back(response[0])
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    //确认上传
    ensure() {
        if (this.state.imageSource == '' || this.state.imageSource == undefined || this.state.imageSource1 == '' || this.state.imageSource1 == undefined) {
            Toast.dismiss();
            Alert.alert('温馨提示', '您还未上传身份证照片,请您继续上传', [{

                text: '继续上传',
            },
            ])
        }
        else {
            Toast.show({
                type: Toast.mode.C2MobileToastLoading,
                title: '提交中...'
            });
            var entity = {
                idCard: this.state.idNum,
                userId: this.state.userId,
                customerName: this.state.userName,
                sex: this.state.sex,
                birthday: this.state.birthday,
                nativePlace: this.state.nativePlace
            }
            if (this.state.idNum == '') {
                Toast.dismiss();
                Toasts.show('图片不清晰,请重新上传', { position: -80 });
                this.setState({
                    imageSource: ''
                })
            } else {
                if (this.state.uploadInfo == undefined) {
                    Toast.dismiss();
                    Toasts.show('请您重新上传身份证,确定身份证号是否正确', { position: -80 })
                    this.setState({
                        imageSource: '',
                        imageSource1: ''
                    })
                } else {
                    // debugger
                    NetInfo.isConnected.fetch().done((isConnected) => {
                        if (!isConnected && Platform.OS == 'android') {
                            Toasts.show('网络超时，请检查您的网络并重新提交')
                        } else {
                            Toast.show({
                                type: Toast.mode.C2MobileToastLoading,
                                title: '请稍后...',
                                // duration: 1000,
                            });
                            var entityrz = {
                                userId: this.state.userId,
                                customerName: this.state.userName,
                                customerIdentNo: this.state.idNum,
                                mobile: this.state.telphone,
                                identFrontPath: '/' + this.state.uploadInfo
                            }

                            Fetch.postJson(Config.mainUrl + '/accountRegist/fddAuth', entityrz)
                                .then((ress) => {
                                    // debugger
                                    Toast.dismiss();
                                    if (ress.rcode == '1') {
                                        Fetch.postJson(Config.mainUrl + '/basicResume/updateUserIdCard', entity)
                                            .then((res) => {
                                                if (res.rcode == "1") {
                                                    Toast.dismiss();
                                                    Toasts.show('提交成功,请填写简历', { position: -80 });
                                                    Actions.Jianli({ update: this.props.update, nativePlace: this.state.nativePlace, uuid: this.state.uuid, userRealname: this.state.userName, telphone: this.state.telphone, sex: this.state.sex, birthday: this.state.birthday, idNum: this.state.idNum, login: '1', userInfo: this.state.userInfo, userId: this.state.userId })
                                                } else if (res.rcode == "0") {
                                                    Toasts.show(res.Msg, { position: -80 });
                                                    this.setState({
                                                        imageSource: '',
                                                        imageSource1: '',
                                                    })
                                                } else {
                                                    Toasts.show(res.Msg, { position: -60 });
                                                }
                                            })
                                    } else {
                                        Toasts.show('提交失败,请重新提交', { position: -80 });
                                    }
                                }).catch((res1) => {
                                    Toasts.show(res1.description, { position: -60 });
                                })
                        }
                    });
                }
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