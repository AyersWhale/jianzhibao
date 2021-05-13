
/**
 * 
 * 开发负责人：曾一川
 */
'use strict'
import React, { Component } from 'react';
import {
    View,
    ImageBackground, TouchableOpacity, StyleSheet,
    Dimensions, Text, Alert
} from 'react-native';
import moment from 'moment';
import TabNavigator from 'react-native-tab-navigator';
import { Actions, VectorIcon, Config, SafeArea } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var nowTime = moment().format('HH:mm:ss');

export default class kaoqin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            nowTiming: null,
            position: (this.props.position == undefined) ? '' : this.props.position,
        }
        this._countTime()
    }
    componentWillUnmount() {
        this.nowTime && clearInterval(this.nowTime);
    }
    _countTime() {
        this.nowTime = setInterval(() => {
            this.setState({
                nowTiming: moment().format('HH:mm:ss')
            })
        }, 1000);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', marginTop: SafeArea.top }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: deviceHeight / 3 - 20 }}>
                    <View>
                        <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 25, position: 'absolute', width: 100, height: 50 }}>
                            <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 27, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>考勤打卡</Text>
                        </View>
                        {this.gettime()}
                    </View>
                </ImageBackground>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <VectorIcon name={"ios-clock"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', margin: 15 }} />
                        <Text style={{ marginTop: 17 }}>打卡时间：    {nowTime}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <VectorIcon name={"c2_location_solid"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', marginLeft: 15, marginRight: 15 }} />
                        <Text style={{ marginTop: 2 }}>打卡地点：    {this.state.position}</Text>
                    </View>
                    <TouchableOpacity style={{ width: deviceWidth / 3.3, height: deviceWidth / 3.3, marginTop: deviceHeight / 4.5, backgroundColor: 'rgb(32,124,241)', borderRadius: 60, alignContent: 'center', alignItems: 'center', alignSelf: 'center' }} onPress={() => Alert.alert('确定要打卡吗？', '', [{ text: '确定' }, { text: '取消' }])}>
                        <Text style={{ transparent: 'parent', color: 'white', fontSize: Config.MainFontSize + 6, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 30 }}>打卡</Text>
                        <Text style={{ transparent: 'parent', color: '#EDEDED', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>{this.state.nowTiming}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 15 }}>
                        <VectorIcon name={"c2_im_check"} size={16} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ backgroundColor: 'transparent', color: 'grey', marginLeft: 5 }}>已进入考勤范围{this.state.position}</Text>
                    </View>

                </View>
            </View>
        )
    }


    gettime() {
        var nowYYYY = moment().format('YYYY');
        var nowMM = moment().format('MMM');
        var nowdddd = moment().format('dddd');
        if (nowMM == 'Jan') { nowMM = '01' } else if (nowMM == 'Feb') { nowMM = '02' } else if (nowMM == 'Mar') { nowMM = '03' } else if (nowMM == 'Apr') { nowMM = '04' }
        else if (nowMM == 'May') { nowMM = '05' } else if (nowMM == 'Jun') { nowMM = '06' } else if (nowMM == 'Jul') { nowMM = '07' } else if (nowMM == 'Aug') { nowMM = '08' }
        else if (nowMM == 'Sep') { nowMM = '09' } else if (nowMM == 'Oct') { nowMM = '10' } else if (nowMM == 'Nov') { nowMM = '11' } else if (nowMM == 'Dec') { nowMM = '12' }
        if (nowdddd == 'Monday') { nowdddd = '星期一' } else if (nowdddd == 'Tuesday') { nowdddd = '星期二' } else if (nowdddd == 'Wednesday') { nowdddd = '星期三' } else if (nowdddd == 'Thursday') { nowdddd = '星期四' }
        else if (nowdddd == 'Friday') { nowdddd = '星期五' } else if (nowdddd == 'Saturday') { nowdddd = '星期六' } else if (nowdddd == 'Sunday') { nowdddd = '星期日' }
        var nowDD = moment().format('DD');
        var Date = nowYYYY + '年' + nowMM + '月' + nowDD + '日';
        return (
            <View>
                <View style={{ flexDirection: "row", marginTop: 40, marginLeft: 15 }}>
                    <Text style={{ backgroundColor: 'transparent', color: 'white', fontSize: Config.MainFontSize + 3, }}>{Date}</Text>
                    <Text style={{ backgroundColor: 'transparent', color: 'white', fontSize: Config.MainFontSize + 3, marginLeft: 10, marginTop: 2 }}>{nowdddd}</Text>
                </View>
            </View >
        )
    }
}
var styles = StyleSheet.create({
    tabStyle: {
        paddingTop: 26,
    },
    titleStyle: {
        fontSize: Config.MainFontSize - 3,
        paddingBottom: 3,
        color: 'rgb(22,131,251)'
    },
    titleStyle1: {
        fontSize: Config.MainFontSize - 3,
        paddingBottom: 3,
    },
    height: {
        marginTop: 5,
        borderColor: '#bbe6f7',
        borderWidth: 1,
    },
    tabbar: {
        height: 50,//这里和下面的card设置50可以展示tabbar
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
})
