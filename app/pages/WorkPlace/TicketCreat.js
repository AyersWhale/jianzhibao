/**
 * 发票开具
 * 
 * 开发者：蒋牧野
 */
'use strict'
import React, { Component } from 'react';
import {
    View, Text, Dimensions, ScrollView, Keyboard, TouchableOpacity, TextInput
} from 'react-native';
import { Actions, NavigationBar, VectorIcon, Config } from 'c2-mobile';
export default class TicketCreat extends Component {

    constructor(props) {
        super(props)
        this.state = {
            companyname: ''
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                <NavigationBar title="编辑发票" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <ScrollView onPress={() => { Keyboard.dismiss() }}>
                    <View style={{ backgroundColor: '#f5f5f5', height: 8, width: Dimensions.get('window').width }} />
                    <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5', }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize, marginLeft: 16 }}>名称</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#000', textAlign: 'left', marginLeft: 56, opacity: 0.54 }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholderTextColor="#c4c4c4"
                            placeholder={'公司名称'}
                            onChangeText={(text) => { this.gsmc = text }}
                        />
                    </View>
                    <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5', }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize, marginLeft: 16 }}>税号</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#000', textAlign: 'left', marginLeft: 56, opacity: 0.54 }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            keyboardType='numeric'
                            placeholderTextColor="#c4c4c4"
                            placeholder={'15-20位(企业报销时必填)'}
                            onChangeText={(text) => { this.sh = text }}
                        />
                    </View>
                    <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5', }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize, marginLeft: 16 }}>电话号码</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#000', textAlign: 'left', marginLeft: 24, opacity: 0.54 }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            keyboardType='numeric'
                            placeholderTextColor="#c4c4c4"
                            placeholder={'公司电话'}
                            onChangeText={(text) => { this.phonenum = text }}
                        />
                    </View>
                    <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5', }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize, marginLeft: 16 }}>开户银行</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#000', textAlign: 'left', marginLeft: 24, opacity: 0.54 }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            keyboardType='numeric'
                            placeholderTextColor="#c4c4c4"
                            placeholder={'开户银行'}
                            onChangeText={(text) => { this.khyh = text }}
                        />
                    </View>
                    <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5', }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize, marginLeft: 16 }}>银行账户</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#000', textAlign: 'left', marginLeft: 24, opacity: 0.54 }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholderTextColor="#c4c4c4"
                            placeholder={'银行账户'}
                            onChangeText={(text) => { this.yhzh = text }}
                        />
                    </View>
                    <View style={{ height: 48, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f5f5f5', }}>
                        <Text style={{ color: '#333', fontSize: Config.MainFontSize, marginLeft: 16 }}>单位地址</Text>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#000', textAlign: 'left', marginLeft: 24, opacity: 0.54 }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholderTextColor="#c4c4c4"
                            placeholder={'单位地址'}
                            onChangeText={(text) => { this.dwdz = text }}
                        />
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
                            <Text style={{ fontSize: Config.MainFontSize, color: '#ffffff' }}>保存</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View >
        )
    }
}