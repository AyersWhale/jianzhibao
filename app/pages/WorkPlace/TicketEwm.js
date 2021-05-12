/**
 * 发票开具
 * 
 * 开发者：蒋牧野
 */
'use strict'
import React, { Component } from 'react';
import {
    View, Text, Dimensions, TouchableHighlight, Alert, TouchableOpacity
} from 'react-native';
import { QySearch } from 'qysyb-mobile';
import { Actions, NavigationBar, VectorIcon, Config } from 'c2-mobile';
import QRCode from 'react-native-qrcode';
export default class TicketEwm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            text: this.props.ewm,
            name: this.props.companyname,
            place: this.props.place
        }
    }

    componentDidMount() {

    }

    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <NavigationBar title="发票抬头" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <View style={{
                    marginTop: 20, marginLeft: 10, height: Dimensions.get('window').height / 1.5, width: Dimensions.get('window').width - 20, backgroundColor: '#fff',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 5,
                    shadowColor: '#b3b4b7',
                    elevation: 2,
                }}>
                    <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', marginLeft: 20, marginTop: 20 }}>{this.state.name}</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.54 }}>税      号</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.84, marginLeft: 20 }}>{this.state.text}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 10 }}>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.54 }}>单位地址</Text>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.84, marginLeft: 20 }}>{this.state.place}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: 100, flexDirection: 'column' }}>
                        <QRCode
                            value={this.state.text}
                            size={150}
                            bgColor='purple'
                            fgColor='white' />
                        <Text style={{ marginTop: 5, fontSize: Config.MainFontSize - 2, color: '#000', opacity: 0.54 }}>开票时候出示</Text>
                    </View>

                </View>

            </View>
        )
    }
}