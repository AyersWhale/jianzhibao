/**
 * 通讯录群组界面（加入过的）
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, PixelRatio, Image, ScrollView, SectionList, Alert } from 'react-native';

import { TabBar, VectorIcon, Actions } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
export default class Mycontact2 extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无

    }


    render() {
        return (
            <View style={{ backgroundColor: '#E9E9EF' }}>
                <Text style={{ marginTop: deviceHeigth / 4, textAlign: 'center' }} >尚未加入群组</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});