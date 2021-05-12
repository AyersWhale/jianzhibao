/**
 * 通讯录群组界面（添加流程）
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, PixelRatio, Image, ScrollView, SectionList, Alert } from 'react-native';

import { Config, VectorIcon, Actions } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
export default class Newclass extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无

    }


    render() {
        return (
            <View style={{ backgroundColor: '#E9E9EF' }}>
                {/* <View style={{ marginTop: 5, flexDirection: 'row', height: deviceHeigth / 12, backgroundColor: '#fff' }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgb(22,131,251)', marginLeft: 13, justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center', marginTop: 10 }} >企业</Text>
                    </View>
                    <Text style={{ marginLeft: 5, marginTop: 8, fontSize: 18 }} >企业通讯录中添加</Text>
                </View> */}
                <View style={{
                    paddingHorizontal: 13,
                    marginBottom: 1,
                    flexDirection: 'row',
                    backgroundColor: "#fff",
                    height: 60,
                    alignItems: 'center',
                    width: Dimensions.get('window').width,
                    borderBottomColor: '#f5f5f5',
                    borderBottomWidth: 1
                }}>
                    <View style={{ width: 5 }} />
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgb(22,131,251)', justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center' }} >企业</Text>
                    </View>
                    <Text style={{ position: 'absolute', left: 70, fontSize: Config.MainFontSize }} >企业通讯录中添加</Text>
                </View>
                <View style={{
                    paddingHorizontal: 13,
                    marginBottom: 1,
                    flexDirection: 'row',
                    backgroundColor: "#fff",
                    height: 60,
                    alignItems: 'center',
                    width: Dimensions.get('window').width,
                    borderBottomColor: '#f5f5f5',
                    borderBottomWidth: 1
                }}>
                    <View style={{ width: 5 }} />
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#DEE1E6', justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center' }} >本地</Text>
                    </View>
                    <Text style={{ position: 'absolute', left: 70, fontSize: Config.MainFontSize }} >手机通讯录中添加</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});