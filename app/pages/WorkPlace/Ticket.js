/**
 * 发票开具
 * 
 * 开发者：蒋牧野
 */
'use strict'
import React, { Component } from 'react';
import {
    View, Text, Dimensions, TouchableHighlight, ScrollView, TouchableOpacity, Keyboard
} from 'react-native';
import { Actions, NavigationBar, VectorIcon, Config } from 'c2-mobile';


var ShowList = [
    { "TicketName": '湖南科创信息股份有限公司', "TicketNum": "91430100183899441P", "place": "长沙市岳麓区青山路678号" },
    { "TicketName": '长沙市日业电气有限公司', "TicketNum": "91430100561749628A", "place": " " },
    { "TicketName": '埃摩森人才服务(深圳)有限公司', "TicketNum": "91430100349804466H", "place": " " },
];
export default class Ticket extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {

    }
    rightCallback(rowData, i) {
        Actions.TicketEwm({
            ewm: rowData.TicketNum,
            companyname: rowData.TicketName,
            place: rowData.place
        })
    }
    TicketList() {
        var temp = [];
        var rowData = ShowList
        for (let i in rowData) {
            temp.push(
                <TouchableOpacity onPress={this.rightCallback.bind(this, rowData[i], i)} >
                    <View style={{ height: 64, backgroundColor: '#fff', flexDirection: 'column', borderBottomColor: "#f5f5f5", borderBottomWidth: 1 }}>
                        <Text style={{ marginLeft: 16, marginTop: 10, fontSize: Config.MainFontSize, opacity: 0.87, color: '#000' }}>{rowData[i].TicketName}</Text>
                        <Text style={{ marginLeft: 16, marginTop: 2, fontSize: Config.MainFontSize - 2, opacity: 0.54, color: '#000' }}>{"税号:  " + rowData[i].TicketNum}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        temp.push(
            <TouchableOpacity onPress={() => Actions.TicketCreat()}  >
                <View style={{ height: 64, backgroundColor: '#fff', flexDirection: 'row', borderBottomColor: "#f5f5f5", alignItems: 'center', borderBottomWidth: 1 }}>
                    <VectorIcon name={"add"} size={14} style={{ marginLeft: 16, color: '#006DDB' }} />
                    <Text style={{ marginLeft: 21, fontSize: Config.MainFontSize, color: '#006DDB' }}>添加发票抬头</Text>
                </View>
            </TouchableOpacity>
        )
        return temp;
    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <NavigationBar title="发票开具" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <ScrollView onPress={() => { Keyboard.dismiss() }}>
                    <View style={{ height: 8, backgroundColor: '#f5f5f5', width: Dimensions.get('window').width }} />
                    <TouchableHighlight onPress={() => Actions.TicketMine()}>
                        <View style={{
                            paddingHorizontal: 20,
                            marginBottom: 1,
                            flexDirection: 'row',
                            backgroundColor: "#fff",
                            height: 50,
                            alignItems: 'center',
                            width: Dimensions.get('window').width,

                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <VectorIcon name={"android-list"} size={20} style={{ color: '#000' }} />
                                <Text style={{ marginLeft: 19, color: '#000', opacity: 0.87, fontSize: Config.MainFontSize }}>我的发票</Text>
                            </View>
                            <VectorIcon name={'chevron-right'} style={{ color: '#000', position: 'absolute', right: 10 }} />
                        </View>
                    </TouchableHighlight>
                    <Text style={{ marginLeft: 16, marginTop: 8, marginBottom: 8, color: '#000', opacity: 0.54, fontSize: Config.MainFontSize - 4 }}>发票抬头</Text>

                    {this.TicketList()}
                </ScrollView>
            </View>
        )
    }
}