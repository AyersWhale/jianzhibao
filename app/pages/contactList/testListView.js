import React, { Component } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ImageStore, Image, ScrollView, Alert, ListView, PermissionsAndroid, Platform, NetInfo, Modal, ImageEditor, CameraRoll } from 'react-native';
import { UUID, Toast, FileManager, Actions, SafeArea, Config, Camera, ImagePicker, ActionSheet, VectorIcon, Fetch, UserInfo } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
const pageIndex = 0
export default class TestListView extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            isRefreshing: false,
            isLoadingMore: false,
            refreshing: false,
            dataBlob: [{}, {}, {}, {}, {}, {}]
        }
    }
    componentDidMount() {
        this.loadedData()
    }
    loadedData() {

        setTimeout(() => {
            let array = [{}, {}, {}, {}, {}, {}]
            this.setState({
                dataBlob: this.state.dataBlob.concat(array)
            })
            pageIndex = pageIndex + 1
            console.log(pageIndex, '回加载')
        }, 2000);
    }
    _renderItem(rowData, sectionID, rowID) {
        return (
            <View>
                <View style={{ backgroundColor: 'pink', borderRadius: 20, width: deviceWidth - 10, marginLeft: 5, height: 100 }} >
                    <Text> {rowID}</Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: deviceWidth }} />
            </View>
        )
    }
    _onEndReached(a, b, c) {
        console.log(a, b, c, '_onEndReached')
        this.loadedData()
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
        Camera.startWithPhoto({ maskType: 2 })
            .then((response) => {

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
            }).catch((e) => {
                console.log('失败回调');
            })

    }
    render() {
        return (
            <View>
                <View style={{ width: deviceWidth, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={1} onPress={() => { this.getPhoto() }} >
                    <Text>拍照</Text>
                </TouchableOpacity>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.dataBlob)}
                    renderRow={this._renderItem.bind(this)}
                    onEndReachedThreshold={10}
                    onEndReached={this._onEndReached.bind(this)}
                />
            </View>
        )
    }
}
