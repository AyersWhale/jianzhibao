'use strict'

//新增话题
import React, { Component } from 'react';
import {
    ListView,
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    Dimensions,
} from 'react-native';

import { NavigationBar, Toast, UUID, Actions, Config, FileManager, ImagePicker, ActionSheet, Camera } from 'c2-mobile';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default class AddCircleMsg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loaded: false,
            imageSource: null,
            dataBlob: [],
            i: 0,
            zhengwen: '',
            biaoti: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        }
        this._camera = this._camera.bind(this);
        this.delete = this.delete.bind(this);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar title="新增工作圈" faction='center' style={{ borderWidth: 0 }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="取消" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={13} size={15} />
                    <NavigationBar.NavBarItem onPress={() => this.fabu.bind(this)} rightIcon={'android-done'} iconSize={28} faction='right' />
                </NavigationBar>

                <View style={{ height: 50, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#d3d3d3", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput
                        style={{ flex: 1, backgroundColor: 'white', fontSize: 14, marginLeft: 10 }}
                        placeholder='话题标题(必填)'
                        placeholderTextColor={'#808080'}
                        value={this.state.value}
                        underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                        onChangeText={(value) => this.setState({ biaoti: value })}
                        returnKeyType={'search'}
                        onSubmitEditing={this.onSearch} />

                </View>
                <View style={{ height: deviceHeight / 4, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#d3d3d3", borderBottomWidth: 1 }}>
                    <TextInput
                        style={{ flex: 1, backgroundColor: 'white', fontSize: 14, marginLeft: 10 }}
                        placeholder='话题正文(必填)'
                        placeholderTextColor={'#808080'}
                        underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                        value={this.state.value}
                        multiline={true}
                        onChangeText={(value) => this.setState({ zhengwen: value })}
                        returnKeyType={'search'}
                        onSubmitEditing={this.onSearch} />

                </View>
                {(this.state.dataBlob.length == 0) ? null : <View style={{ height: deviceHeight / 6, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#d3d3d3", borderBottomWidth: 1 }}>
                    {this.photo()}
                </View>}
                <View style={{ height: 40, backgroundColor: '#ffffff', flexDirection: 'row', borderBottomColor: "#d3d3d3", borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ flex: 1, color: '#808080', backgroundColor: 'white', fontSize: 14, marginLeft: 10 }}>上传图片(选填)</Text>
                </View>
                <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', height: 30, marginLeft: 20, marginRight: 20, borderColor: 'lightgrey', borderWidth: 1, marginBottom: 5 }} onPress={() => this.getPhoto()}>
                    <Text style={{ alignSelf: 'center', flex: 1, textAlign: 'center', fontSize: 13 }}>添加照片</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', height: 30, marginLeft: 20, marginRight: 20, borderColor: 'lightgrey', borderWidth: 1, marginBottom: 5 }} onPress={() => this.setState({ dataBlob: [], i: 0 })}>
                    <Text style={{ alignSelf: 'center', flex: 1, textAlign: 'center', fontSize: 13 }}>清空照片(点击图片可单独删除)</Text>
                </TouchableOpacity>


            </View >
        );
    }
    fabu() {
        var biaoti = this.state.biaoti;
        var zhengwen = this.state.zhengwen;
        if (biaoti == '') {
            Toast.show('标题不能为空', 1000);
            return;
        } else if (zhengwen == '') {
            Toast.show('正文不能为空', 1000)
            return;
        } else if (this.state.dataBlob.length > 0) {
            for (let i in this.state.dataBlob) {
                if (this.state.dataBlob) {
                    var path = Config.mainUrl + '/iframefile/qybdirprocess/upload';
                    var params = {
                        source: this.state.dataBlob[i],
                        url: path,
                        formData: { businessType: "attend_mobile_check", businessKey: uudiv, businessKey1: "PM" },
                        progress: (events) => {
                            //进度回掉，提供ui显示进度
                            // let percent = parseInt(events.completedUnitCount / events.totalUnitCount * 100);
                            // this.setState({
                            //     progressPercent: percent,
                            // })
                        }
                    }
                }
                FileManager.uploadFile(params)
                    .then((respones) => {
                        // var refs = this.refs;
                        // const { webviewbridge } = refs;
                        // webviewbridge.sendToBridge(JSON.stringify(respones));
                        Toast.show('上传成功', 1000)
                    }).catch((e) => {
                        Toast.show('抱歉，图片上传失败', 1000)
                    });
            }
        }

        // Fetch.postJson(url, htInfo)
        //     .then((response) => {
        //         alert(JSON.stringify(response))
        //     })
        //     .catch((e) => {
        //         alert(e);
        //     })
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
    _selectImage() {
        var domTemp = this.state.dataBlob;
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
                for (let i in response) {
                    let itemInfo = {
                        fileName: response[i].fileName,
                        fileSize: response[i].fileSize,
                        height: response[i].height,
                        type: response[i].type,
                        uri: response[i].uri,
                        num: this.state.i + 1,
                        width: response[i].width,
                    }
                    this.setState({ i: this.state.i + 1 });
                    domTemp.push(itemInfo);
                }
                this.setState({
                    dataBlob: domTemp,
                    imageSource: response,
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    _camera() {
        var domTemp = this.state.dataBlob;
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                let itemInfo = {
                    fileName: response.fileName,
                    fileSize: response.fileSize,
                    height: response.height,
                    type: response.type,
                    uri: response.uri,
                    num: this.state.i + 1,
                    width: response.width,

                }
                domTemp.push(itemInfo);
                // }
                this.setState({
                    i: this.state.i + 1,
                    dataBlob: domTemp,
                    imageSource: response,
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }

    photo() {
        if (this.state.imageSource) {
            var dataSource = this.state.dataBlob;
            const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            return (
                <ListView
                    style={styles.listView}
                    horizontal={true}
                    dataSource={ds.cloneWithRows(dataSource)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />)
        } else {
            return null
        }
    }
    _renderItem(imageSource, index) {
        return (<TouchableOpacity onPress={() => this.delete(imageSource.num)} style={{ marginLeft: 20, flexDirection: 'row', alignSelf: 'center' }}>
            {<Image source={{ uri: imageSource.uri }} style={{ width: 60, height: 60, flexDirection: 'row' }} />}
        </TouchableOpacity >
        )

    }
    delete(index) {
        //删除起始下标为1，长度为1的一个值(len设置1，如果为0，则数组不变)
        var length = this.state.dataBlob.length;
        var arr = this.state.dataBlob;
        if (length == 1) {
            this.setState({
                dataBlob: [],
                i: 0
            })
        } else if (index >= length) {
            arr.splice(length - 1, 1);
            this.setState({
                dataBlob: arr,
                i: this.state.i - 1
            })
        } else {
            arr.splice(index - 1, 1);
            this.setState({
                dataBlob: arr,
                i: this.state.i - 1
            })
        }
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    navigationBar: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderColor: '#d7d7d7',
        borderBottomWidth: 0.5
    },
    statueBar: {
        height: Platform.OS === 'ios' ? 20 : 0,
    },
    titleBar: {
        flexDirection: 'row',
        height: 44,
    },
    navigationTitle: {
        alignSelf: 'center',
        flex: 2,
        textAlign: 'center',
        fontSize: 18
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },

    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    main3: {
        flex: 1,
        backgroundColor: 'white',
    },
    card: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#d3d3d3',
        elevation: 1,
        padding: 10,
    },

    userInfo: {
        alignItems: 'center'
    },
    avatar: {
        width: 50,
        height: 50,
        alignSelf: 'center',
    },
    detail: {
        marginLeft: 16,
    },
    details: {
        flex: 1
    },
    detailText1: {
        marginTop: 5,
        fontSize: 16,
        color: '#333',
    },
    detailText2: {
        fontSize: 14,
        // marginLeft: 90,
        textAlign: 'right',
        color: '#333',
    },
    detailText: {
        marginLeft: 10,
        fontSize: 12,
        color: '#888',
    },
    detailTexts: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold'
    },

    row: {
        flex: 1
    },
    rows: {
        flex: 1,
    }

});