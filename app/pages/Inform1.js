/**
 * 对话框待办
 * Created by 曾一川.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity,ListView,Image } from 'react-native';
import {  Actions,Config } from 'c2-mobile';
import theme from '../config/theme';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;


var kqdk=[
    {"daka":"上周(10.29-11.04)考勤情况","xiangqing":"小飞，你上周共迟到1次，缺卡1次,旷工0次。","time":"11月5日 14:34"},
    {"daka":"还有8分钟就上班了，别忘记打卡哟~","xiangqing":"","time":"昨天 8:52"},
    {"daka":"还有8分钟就上班了，别忘记打卡哟~","xiangqing":"","time":"今天 8:52"},
]

export default class Inform1 extends Component {

    
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            listViewData: kqdk,
        }
    }

    createchat() {
        Actions.Newclass();
    }
    render() {
        return (
            <View>
            <ListView
                    style={styles.listView}
                    dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                    renderRow={this._renderItem.bind(this)}
                />
            </View>
        );
    }
    _renderItem(rowData) {
        return (
            <TouchableOpacity style={{backgroundColor:'transparent'}}>
                <View style={{backgroundColor:'transparent'}}>
                <Text style={{marginTop:10,color:'grey',fontWeight:'bold',alignSelf:'center'}}>{rowData.time}</Text>
                <View style={{flexDirection:'row'}}>
                <Image style={{marginTop:10}} source={require('../image/icon_px1.png')}/>
                <View style={{marginLeft:20,marginTop:10}}>
                <Text style={{color:'grey',fontSize:Config.MainFontSize-4}}>考勤打卡</Text>
                <View style={{ maxWidth:theme.screenWidth/1.5,backgroundColor:'white',marginTop:10,borderRadius:5}}>
                <Text  style={{ fontSize: Config.MainFontSize-1, color: 'black',marginLeft:5,padding:10,marginRight:10,maxWidth:theme.screenWidth-80,borderRadius:20,color:'rgb(111,167,246)'}}>考勤打卡</Text>
                <Text  style={{ fontSize: Config.MainFontSize-2, color: 'black',marginLeft:5,padding:10,marginRight:10,maxWidth:theme.screenWidth-80,borderRadius:20}}>{rowData.daka}</Text>
                <Text  style={{ fontSize: Config.MainFontSize-4, color: 'black',marginLeft:5,paddingBottom:3,paddingLeft:10,marginRight:10,maxWidth:theme.screenWidth-80,borderRadius:20,color:'grey'}}>{rowData.xiangqing}</Text>
                </View>
                </View>
                </View>
                </View>
            </TouchableOpacity>
        )

    }
}

const styles = StyleSheet.create({

});