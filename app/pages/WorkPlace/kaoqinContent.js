
/**
 * 功能模块：考勤打卡内容
 * 
 * 开发负责人：曾一川
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet, ImageBackground, Dimensions, TouchableOpacity
} from 'react-native';
import { Actions, VectorIcon, Config, Calendar } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
var gsgw = [
    { "content": "[打卡详情]准时打卡", "time": "10-11 10:03", "details": "湖南科创信息股份有限公司，湖南科创信息股份有限公司，湖南科创信息股份有限公司", "type": "收文", "date": "10月11日" },
]
export default class kaoqinContent extends Component {

    constructor(props) {
        super(props);
        // this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {

        }
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
                <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{gsgw['0'].time}</Text>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }}>
                    <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
                        <View style={{ maxWidth: deviceWidth - 30, backgroundColor: 'white', marginTop: 10, borderRadius: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ backgroundColor: 'red', width: 8, height: 8, borderRadius: 10, marginLeft: 5, marginTop: 14 }} />
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'black', marginLeft: 5, paddingTop: 10, paddingRight: 10, paddingBottom: 10, marginRight: 15, maxWidth: deviceWidth - 80, borderRadius: 20 }}>{gsgw['0'].content}</Text>
                            </View>
                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginLeft: 10, padding: 10, marginRight: 15, maxWidth: deviceWidth - 80, borderRadius: 20 }}>{gsgw['0'].details}</Text>
                            <View style={{ padding: 20, alignItems: 'center', flexDirection: 'row' }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', backgroundColor: '#3396FB', position: 'absolute', left: 20, padding: 3 }}>{gsgw['0'].type}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', position: 'absolute', right: 15 }}>{gsgw['0'].date}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    }
})

