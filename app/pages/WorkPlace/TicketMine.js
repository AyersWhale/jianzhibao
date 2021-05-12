/**
 * 发票开具
 * 
 * 开发者：蒋牧野
 */
'use strict'
import React, { Component } from 'react';
import {
    View, Text, Dimensions, Keyboard, ScrollView, TouchableOpacity
} from 'react-native';
import { QySearch } from 'qysyb-mobile';
import { Actions, NavigationBar, VectorIcon, Config } from 'c2-mobile';

export default class TicketMine extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showlist: '',
        }
    }

    componentDidMount() {

    }
    dataSource(result) {

    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <NavigationBar title="我的发票" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <ScrollView  >
                    <View style={{ height: 40 }}>
                        <QySearch rowData={this.state.showlist} //搜索的数据源
                            searchResult={(result) => this.dataSource(result)}  //搜索成功后返回的数据，如何处理需自己处理
                            values={"name"}  //搜索的字段，多个字段在values1={'**'}  valuse2={'**'}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', width: Dimensions.get('window').width / 3, justifyContent: 'center' }}>
                            <Text style={{}}></Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: Dimensions.get('window').width / 3 }}>

                        </View>
                        <View style={{ flexDirection: 'row', width: Dimensions.get('window').width / 3 }}>

                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}