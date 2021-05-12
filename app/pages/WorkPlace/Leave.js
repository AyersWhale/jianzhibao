/**
 * 请假
 * 
 * 开发者：蒋牧野
 */
'use strict'
import React, { Component } from 'react';
import {
    View, Text, Dimensions, TextInput, Image, TouchableOpacity, ScrollView, ListView, Keyboard
} from 'react-native';
import { QySearch } from 'qysyb-mobile';
import { Actions, NavigationBar, VectorIcon, Config, ImagePicker, ActionSheet, Camera } from 'c2-mobile';
import { DatePicker, List, Picker } from 'antd-mobile-rn';
import moment from 'moment';
var data = [
    { value: "年假", label: "年假" },
    { value: "事假", label: "事假" },
    { value: "病假", label: "病假" },
    { value: "调休", label: "调休" },
    { value: "产假", label: "产假" },
    { value: "陪产假", label: "陪产假" },
    { value: "婚假", label: "婚假" },
    { value: "例假", label: "例假" },
    { value: "丧假", label: "丧假" },
    { value: "哺乳假", label: "哺乳假" },
]
var datas = [
    { value: "伍钦", label: "伍钦" },
    { value: "曾一川", label: "曾一川" },
    { value: "蒋牧野", label: "蒋牧野" },
]
var mryear = moment().format('YYYY');
var mrmonth = moment().format('MMM');
if (mrmonth == 'Jan') { mrmonth = '1' } else if (mrmonth == 'Feb') { mrmonth = '2' } else if (mrmonth == 'Mar') { mrmonth = '3' } else if (mrmonth == 'Apr') { mrmonth = '4' }
else if (mrmonth == 'May') { mrmonth = '5' } else if (mrmonth == 'Jun') { mrmonth = '6' } else if (mrmonth == 'Jul') { mrmonth = '7' } else if (mrmonth == 'Aug') { mrmonth = '8' }
else if (mrmonth == 'Sep') { mrmonth = '9' } else if (mrmonth == 'Oct') { mrmonth = '10' } else if (mrmonth == 'Nov') { mrmonth = '11' } else if (mrmonth == 'Dec') { mrmonth = '12' }
var mrday = moment().format('DD')
export default class Leave extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: '',
            value1: new Date(mryear, mrmonth - 1, mrday),
            value2: new Date(mryear, mrmonth - 1, mrday),
            value3: '',
            timelong: '',
            reason: '',
            imageSource: null,
            dataBlob: [],
            uploadText: '没有图片需要上传',
            status: true,
            rightTitle: "修改",
            i: 0,
        }
    }

    componentDidMount() {

    }
    qjlx = () => {
        // console.log('start loading data');
        setTimeout(() => {
            this.setState({
                data: district,
            });
        }, 200);
    }

    zwdlr = () => {
        // console.log('start loading data');
        setTimeout(() => {
            this.setState({
                datas: district,
            });
        }, 200);
    }
    onChange = (value) => {
        // console.log(value);
        this.setState({ value: value });
    }
    onChange1 = (value) => {
        this.setState({ value1: value });
    }
    onChange2 = (value) => {
        this.setState({ value2: value });
    }
    onChange3 = (value) => {
        // console.log(value);
        this.setState({ value3: value });
    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <NavigationBar title="请假" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <ScrollView onPress={() => { Keyboard.dismiss() }}>
                    <View style={{ backgroundColor: '#f5f5f5', width: Dimensions.get('window').width, height: 20 }} />
                    <List >
                        <Picker
                            data={data}
                            cols={1}
                            value={this.state.value}
                            onChange={this.onChange}
                        >
                            <List.Item arrow="horizontal" onPress={this.qjlx}   >
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 44 }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>请假类型</Text>
                                </View>
                            </List.Item>
                        </Picker>
                    </List>
                    <View style={{ backgroundColor: '#f5f5f5', width: Dimensions.get('window').width, height: 20 }} />
                    <List>
                        <DatePicker
                            value={this.state.value1}
                            mode="date"
                            minDate={new Date(2017, 0, 1)}
                            maxDate={new Date(2028, 11, 31)}
                            onChange={this.onChange1}
                            format="YYYY-MM-DD"
                        >
                            <List.Item arrow="horizontal" onPress={this.onPress}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 44 }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>开始时间</Text>
                                </View>
                            </List.Item>
                        </DatePicker>
                    </List>
                    <List>
                        <DatePicker
                            value={this.state.value2}
                            mode="date"
                            minDate={new Date(2017, 0, 1)}
                            maxDate={new Date(2028, 11, 31)}
                            onChange={this.onChange2}
                            format="YYYY-MM-DD"
                        >
                            <List.Item arrow="horizontal" onPress={this.onPress}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 44 }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>结束时间</Text>
                                </View>
                            </List.Item>
                        </DatePicker>
                    </List>
                    <View style={{
                        paddingHorizontal: 10,
                        marginBottom: 1,
                        flexDirection: 'row',
                        backgroundColor: "#fff",
                        height: 58,
                        alignItems: 'center',
                        width: Dimensions.get('window').width,
                        borderBottomColor: '#e7e7e7',
                        borderBottomWidth: 1,
                    }}>
                        <View style={{ width: 5 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>时长(天)</Text>
                        </View>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right' }}
                            keyboardType='numeric'
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholderTextColor="#c4c4c4"
                            value={this.state.timelong}
                            placeholder='请输入时长'
                            onChangeText={(text) => { this.setState({ timelong: text }) }}
                        />
                    </View>
                    <View style={{ backgroundColor: '#fff', flexDirection: "column", height: Dimensions.get('window').height / 5, marginTop: 20, borderTopColor: '#e7e7e7', borderTopWidth: 1, borderBottomColor: '#e7e7e7', borderBottomWidth: 1 }}>
                        <View style={{ marginTop: 10, flexDirection: "row", marginLeft: 15 }}>
                            <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>请假事由</Text>
                        </View>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#333', textAlign: 'left', marginLeft: 30 }}
                            ref='textInput'
                            clearButtonMode='always'
                            autoheith={true}
                            multiline={true}
                            placeholder='请输入请假事由'
                            placeholderTextColor="#c4c4c4"
                            underlineColorAndroid='transparent'
                            onChangeText={(value) => this.setState({ reason: value })}
                        />
                    </View>
                    <List style={{ marginTop: 20, borderTopColor: '#e7e7e7', borderTopWidth: 1 }}>
                        <Picker
                            data={datas}
                            cols={1}
                            value={this.state.value3}
                            onChange={this.onChange3}
                        >
                            <List.Item arrow="horizontal" onPress={this.zwdlr}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', height: 44 }}>
                                    <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text>
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', marginLeft: 10 }}>职务代理人</Text>
                                </View>
                            </List.Item>
                        </Picker>
                    </List>
                    <View style={{ backgroundColor: '#fff', flexDirection: "column", height: Dimensions.get('window').height / 5, marginTop: 20, borderTopColor: '#e7e7e7', borderTopWidth: 1, borderBottomColor: '#e7e7e7', borderBottomWidth: 1 }}>
                        <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 30, marginTop: 10 }}>图片</Text>

                        {this.state.dataBlob.length == 0 ?
                            <TouchableOpacity activeOpacity={1} onPress={this.getPhoto.bind(this)} >
                                <View style={{
                                    marginLeft: 30, width: 60, height: 60, justifyContent: 'center', marginTop: 10, backgroundColor: '#fff',
                                    shadowOffset: { width: 0, height: 5 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 5,
                                    shadowColor: '#b3b4b7',
                                    elevation: 2,
                                }}>
                                    <Text style={{ textAlign: 'center', fontSize: 30, }}>+</Text>
                                </View>
                            </TouchableOpacity> :
                            <View
                            // style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                            >
                                {this.photo()}
                            </View>
                        }
                    </View>
                    <TouchableOpacity onPress={() => Actions.pop()}>
                        <View style={{
                            marginBottom: 20,
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: Config.C2NavigationBarTintColor,
                            width: Dimensions.get('window').width / 1.5,
                            height: 36,
                            marginTop: 30,
                            borderRadius: 30,
                            justifyContent: 'center'
                        }}>
                            <Text style={{ fontSize: Config.MainFontSize, color: '#ffffff' }}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
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

    _selectImage() {
        var domTemp = this.state.dataBlob;
         var DEFAULT_OPTIONS = {
            mainColor: '#ffffff',
            tintColor: '#4285f4',
            accentColor: '#4285f4',
            backgroundColor: '#ffffff',
            picMax: 5,
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
    photo() {
        if (this.state.imageSource) {
            var dataSource = this.state.dataBlob;
            const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            return (
                <ListView
                    style={{ paddingTop: 20, backgroundColor: '#F5FCFF', }}
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
    // showimg() {
    //     var rowData = this.state.imageSource
    //     var temp = [];
    //     if (this.state.uploadText != '没有图片需要上传') {
    //         temp.push(
    //             <TouchableOpacity onPress={this.getPhoto.bind(this)} style={{ flexDirection: 'row', margin: 10, marginLeft: 20 }}>
    //                 <Image style={{ height: 50, width: 50 }} source={{ uri: this.state.imageSource }} />
    //             </TouchableOpacity >
    //         )
    //     } else {
    //         for (let i in rowData) {
    //             temp.push(
    //                 <TouchableOpacity onPress={() => this.delete(i)} style={{ flexDirection: 'row', margin: 10, marginLeft: 20 }}>
    //                     <Image style={{ height: 50, width: 50 }} source={{ uri: rowData[i].uri }} />
    //                 </TouchableOpacity >
    //             )
    //         }
    //     }
    //     return temp;
    // }
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