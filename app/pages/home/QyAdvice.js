/**
 * 意见反馈
 * Created by 曾一川 on 7/5/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, KeyboardAvoidingView, ListView, TextInput, Image, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, UUID, Fetch } from 'c2-mobile';
import theme from '../../config/theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class QyAdvice extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            title: '',
            content: '',
            date: '',
            title: [],//标题
            result: [],//
            detail: [],//详情
        }
        this._loadMoreData();
    }

    _loadMoreData() {
        // 用户操作向导接口
        Fetch.getJson(Config.mainUrl + '/customerService/getAllData')
            .then((res) => {
                console.log(res)
                this.setState({
                    result: res
                })
            })
    }

    render() {
        var timestamp = Date.parse(new Date());//获取当前时间戳
        return (
            <View style={{ backgroundColor: '#E1E1E1', height: deviceHeight }}>
                <ImageBackground source={require('../home/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop({ refresh: { test: UUID.v4() } })} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({detail:[] })} style={{ marginTop: 42, position: 'absolute',right:10 }}>
                        <Text style={{color:'white',backgroundColor:'transparent',fontSize:Config.MainFontSize-1}}>清空聊天记录</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>问题反馈</Text>
                    </View>
                </ImageBackground>
                <ScrollView style={{ width: theme.screenWidth, backgroundColor: '#E1E1E1', height: deviceHeight }}>
                    <View>
                        <View style={{ backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{this.timeChange(timestamp)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, backgroundColor: 'transparent' }}>
                            <Image source={require('../home/logo.png')} style={{ width: 50, height: 50, marginLeft: 10, marginTop: 5 }} />
                            <View>
                                <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize - 3, color: 'grey', paddingLeft: 10, backgroundColor: 'transparent' }}>客服机器人</Text>
                                <View style={{ marginLeft: 10, marginTop: 10, alignContent: 'center', borderRadius: 4, alignItems: 'center', alignSelf: 'center', backgroundColor: 'white', borderRadius: 10 }}>
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize - 1, color: 'black', padding: 10, maxWidth: theme.screenWidth - 100, backgroundColor: 'transparent' }}>您好，很高兴为您服务，请问有什么可以帮您的？</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 30, backgroundColor: 'transparent' }}>
                            <Image source={require('../home/logo.png')} style={{ width: 50, height: 50, marginLeft: 10, marginTop: 5 }} />
                            <View>
                                <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize - 3, color: 'grey', paddingLeft: 10, backgroundColor: 'transparent' }}>客服机器人</Text>
                                <View style={{ marginLeft: 10, marginTop: 10, borderRadius: 4, backgroundColor: 'white', borderRadius: 10 }}>
                                    <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize - 1, color: 'black', padding: 5, maxWidth: theme.screenWidth - 100, backgroundColor: 'transparent' }}>您好，有什么可以帮您的吗？</Text>
                                    {this.showDiff()}

                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: 100 }}>
                            {this.showDetail()}
                        </View>
                    </View>
                </ScrollView>
                {/* <View style={{ backgroundColor: '#F2F2F2', justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 50, width: deviceWidth, position: 'absolute', bottom: 20 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'transparent', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <VectorIcon name={"person2"} size={26} color={'grey'} style={{ backgroundColor: 'transparent' }} />
                            <Text style={{ color: 'grey', fontSize: Config.MainFontSize - 4 }}>转人工</Text>
                        </TouchableOpacity>
                        <TextInput
                            underlineColorAndroid={'#ffffff'}
                            style={{ height: 35, width: deviceWidth - 120, borderRadius: 5, borderWidth: 0.5, borderColor: '#D3D3D3', backgroundColor: 'white', marginLeft: 10 }} />
                        <TouchableOpacity style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <VectorIcon name={"c2_im_weixin_add"} size={30} color={'grey'} style={{ backgroundColor: 'transparent', marginLeft: 10, paddingBottom: 2 }} />
                        </TouchableOpacity>
                    </View>
                </View> */}

            </View>
        );
    }

    conversation(detail, title) {
        var temp = this.state.detail;
        temp.push({ detail: detail, title: title });
        this.setState({
            detail: temp,
        })
    }
    showDetail() {
        var temp = [];
        var list = this.state.detail;
        for (let i in list) {
            temp.push(
                <View style={{ flexDirection: 'row', marginTop: 10, backgroundColor: 'transparent' }}>
                    <Image source={require('../home/logo.png')} style={{ width: 50, height: 50, marginLeft: 10, marginTop: 5 }} />
                    <View>
                        <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize - 3, color: 'grey', paddingLeft: 10, backgroundColor: 'transparent' }}>客服机器人</Text>
                        <View style={{ marginLeft: 10, marginTop: 10, borderRadius: 4, backgroundColor: 'white', borderRadius: 10 }}>
                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize - 1, color: 'rgb(22,131,251)', padding: 10, maxWidth: theme.screenWidth - 100, backgroundColor: 'transparent' }}>{list[i].title}</Text>
                            <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize - 1, color: 'black', paddingLeft: 10,paddingRight: 10,paddingBottom: 10, maxWidth: theme.screenWidth - 100, backgroundColor: 'transparent' }}>{list[i].detail}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        return temp;
    }
    showDiff() {
        return (
            <ScrollView>
                <ListView
                    style={{ flex: 1, borderRadius: 20, marginTop: 5, marginBottom: 5 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem1.bind(this)}
                />

            </ScrollView>
        )
    }
    _renderItem1(rowData) {
        return (
            <TouchableOpacity onPress={this.conversation.bind(this, rowData.detail, rowData.title)}>
                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize - 1, color: 'rgb(22,131,251)', padding: 5, maxWidth: theme.screenWidth - 100, backgroundColor: 'transparent' }}>{rowData.title}</Text>
            </TouchableOpacity>
        )
    }
    componentWillReceiveProps(nextProps) {
        Actions.pop({ refresh: { test: UUID.v4() } })
    }
    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '-' +
            (d.getDate() < 10 ? '0' + (d.getDate()) : d.getDate()) + ' ' +
            (d.getHours() < 10 ? '0' + (d.getHours()) : d.getHours()) + ':' +
            (d.getMinutes() < 10 ? '0' + (d.getMinutes()) : d.getMinutes())
        return date;
    }

}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    backTextWhite: {
        color: 'white',
    },
    rowFront: {
        backgroundColor: 'rgb(250,250,250)',
        borderBottomColor: 'rgb(223,223,223)',
        borderBottomWidth: 1,
        height: 64,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'grey',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#FF3030',
        right: 0,
    },
    imgstyle: {
        height: theme.screenHeight / 3.5,
        width: theme.screenWidth,
    },
});
