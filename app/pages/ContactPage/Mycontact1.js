/**
 * 通讯录群组界面（创建）
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, PixelRatio, Image, ScrollView, SectionList, Alert } from 'react-native';

import { TabBar, VectorIcon, Actions } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
export default class Mycontact1 extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无

    }

    createchat() {
        Actions.Newclass();
    }
    render() {
        return (
            <View style={{ backgroundColor: '#E9E9EF' }}>
                <Text style={{ marginTop: deviceHeigth / 4, textAlign: 'center' }} >尚未创建群组</Text>
                <TouchableOpacity onPress={this.createchat.bind(this)}>
                    <Text style={{ textAlign: 'center', color: 'rgb(22,131,251)' }} >点击创建群组</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});