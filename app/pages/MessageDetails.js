/**
 * 我的消息详情
 * Created by 曾一川 on 14/1/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, UUID, Fetch } from 'c2-mobile';
import theme from '../config/theme';
import TimeChange from '../utils/TimeChange';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class MessageDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            date: '',
        }
        this._loadMoreData();
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            this.props.onblock()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    _loadMoreData() {
        //Http请求
        entity = {
            id: this.props.id
        }
        Fetch.getJson(Config.mainUrl + '/messageAll/getMessageDetail', entity)
            .then((res) => {
                console.log(res)
                this.setState({
                    content: res.content,
                    date: res.arrival,
                    title: res.title
                })
            })
    }
    handleBack() {
        Actions.pop({ refresh: { test: UUID.v4() } })
        this.props.onblock()
    }
    render() {
        return (
            <ScrollView style={{ backgroundColor: '#E1E1E1' }}>
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => this.handleBack()} style={{ marginTop: 38, position: 'absolute' }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>消息</Text>
                    </View>
                </ImageBackground>
                <View style={{ width: theme.screenWidth, height: theme.screenHeight, backgroundColor: '#E1E1E1' }}>
                    <View style={{ backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{TimeChange.timeChange(this.state.date)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10, backgroundColor: 'transparent' }}>
                        <Image source={require('../image/logo.png')} style={{ width: 50, height: 50, marginLeft: 10, marginTop: 5 }} />
                        <View style={{ marginLeft: 10, alignContent: 'center', borderRadius: 4, alignItems: 'center', alignSelf: 'center', backgroundColor: 'white', borderRadius: 20 }}>
                            <Text style={{ marginLeft: 12, marginLeft: 2, fontSize: Config.MainFontSize - 1, color: 'black', padding: 10, maxWidth: theme.screenWidth - 100, backgroundColor: 'transparent' }}>{this.state.content}</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        );
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
