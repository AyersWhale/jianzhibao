'use strict'
//我的经历
//曾一川
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput, Alert, ImageBackground, Dimensions
} from 'react-native';
import { Config, Actions, SafeArea, VectorIcon, Toast } from 'c2-mobile';
import px2dp from '../../utils/px2dp';
import { Button } from 'react-native-elements'
import DatePicker from 'react-native-datepicker';
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class Wodejingli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ifRuzhi: false,
            ifLizhi: false,
            companyName: this.props.params.rowData == undefined ? '' : this.props.params.rowData.companyName,
            position: this.props.params.rowData == undefined ? '' : this.props.params.rowData.position,
            entryTime: this.props.params.rowData == undefined ? '' : this.timeChange(this.props.params.rowData.entryTime),
            entryTime_ruzhi: this.props.params.rowData == undefined ? '' : this.props.params.rowData.entryTime,
            seperateTime_lizhi: this.props.params.rowData == undefined ? '' : this.props.params.rowData.seperateTime,
            seperateTime: this.props.params.rowData == undefined ? '' : this.timeChange(this.props.params.rowData.seperateTime),
            workContent: this.props.params.rowData == undefined ? '' : this.props.params.rowData.workContent,
            id: this.props.params.rowData == undefined ? '' : this.props.params.rowData.id,
        }
    }
    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;

    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#F4F4F4' }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>我的工作经历</Text>
                    </View>
                </ImageBackground>
                <View style={{ backgroundColor: "#FFFFFF" }}>
                    <View style={styles.companyItem}>
                        <Text style={styles.companyLabel}>公司名称</Text>
                        <TextInput
                            style={{ color: "black", fontSize: px2dp(12), marginBottom: 10 }}
                            placeholderTextColor={'#C1C4CC'}
                            value={this.state.companyName}
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                            placeholder={'请输入公司名称'}
                            onChangeText={(value) => this.setState({ companyName: value })}
                        />
                    </View>
                    <View style={styles.companyItem}>
                        <Text style={styles.companyLabel}>岗位</Text>
                        <TextInput
                            style={{ color: "black", fontSize: px2dp(12), marginBottom: 10 }}
                            placeholderTextColor={'#C1C4CC'}
                            value={this.state.position}
                            underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果
                            placeholder={'请输入岗位'}
                            onChangeText={(value) => this.setState({ position: value })}
                        />
                    </View>

                    <View style={styles.companyItem}>
                        <Text style={styles.companyLabel}>工作时间</Text>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <DatePicker
                                style={{ width: 100 }}
                                date={this.state.entryTime}
                                mode="date"
                                placeholder="入职时间"
                                placeholderColor='red'
                                format="YYYY-MM-DD"
                                maxDate={new Date()}
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                        marginLeft: 0,
                                    }
                                }}
                                minuteInterval={10}
                                onDateChange={(entryTime) => { this.setState({ entryTime: entryTime, ifRuzhi: true }); }}
                            />
                            <Text style={{ marginTop: 5, marginLeft: 10, marginRight: 10, color: '#CCCCCC' }}>_</Text>
                            <DatePicker
                                style={{ width: 100 }}
                                date={this.state.seperateTime}
                                mode="date"
                                placeholderColor='red'
                                placeholder="离职时间"
                                format="YYYY-MM-DD"
                                maxDate={new Date()}
                                showIcon={false}
                                customStyles={{
                                    dateInput: {
                                        borderWidth: 0,
                                    }
                                }}
                                minuteInterval={10}
                                onDateChange={(seperateTime) => { this.setState({ seperateTime: seperateTime, ifLizhi: true }); }}
                            />
                        </View>
                    </View>
                    {/* <View style={{ display: "flex", flexDirection: 'row', margin: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={styles.companyLabel}>离职时间</Text>
                        <View>
                            <DatePicker
                                date={this.state.seperateTime}
                                mode="date"
                                placeholderColor='red'
                                placeholder="离职时间"
                                format="YYYY-MM-DD"
                                maxDate={new Date()}
                                showIcon={false}
                                customStyles={{
                                    dateIcon: {

                                        width: 0
                                    },
                                    dateInput: {
                                        borderWidth: 0,
                                    }
                                }}
                                minuteInterval={10}
                                onDateChange={(seperateTime) => { this.setState({ seperateTime: seperateTime, ifLizhi: true }); }}
                            />
                        </View>
                    </View> */}
                    <View style={styles.companyItem}>
                        <Text style={styles.companyLabel}>工作内容</Text>
                        <View style={{ height: deviceHeight / 4 }}>
                            <TextInput
                                style={{ color: "black", fontSize: px2dp(12), marginBottom: 10 }}
                                placeholderTextColor={'#C1C4CC'}
                                value={this.state.workContent}
                                multiline={true}
                                underlineColorAndroid='transparent' //设置下划线背景色透明 达到去掉下划线的效果  
                                placeholder={'请输入工作/实习经历'}
                                onChangeText={(value) => this.setState({ workContent: value })}
                            />
                        </View>
                    </View>
                    <Button
                        backgroundColor='#096EFD'
                        buttonStyle={{ height: 50, borderRadius: 8, marginLeft: 15, marginRight: 15, marginBottom: 10, marginTop: 50 }}
                        title='保存'
                        onPress={this.itemClick.bind(this)}
                    />
                </View>

            </ScrollView >
        );
    }
    toDate(str) {
        var sd = str.split("-");
        var M = ''
        var D = ''
        if (sd[1].length < 2) {
            M = 0 + sd[1]
        } else {
            M = sd[1]
        }
        if (sd[2].length < 2) {
            D = 0 + sd[2]
        } else {
            D = sd[2]
        }
        return sd[0] + M + D;
    }

    itemClick() {
        if (this.state.seperateTime !== '' && this.state.entryTime !== '') {
            var seperateTime = this.toDate(this.state.seperateTime);
            var entryTime = this.toDate(this.state.entryTime);
        }
        if (this.state.companyName == '' || this.state.companyName == undefined) {
            Toast.showInfo('请填写公司名称', 1000)
            return;
        }
        if (this.state.position == '' || this.state.position == undefined) {
            Toast.showInfo('请填写岗位', 1000)
            return;
        }
        if (this.state.entryTime == '' || this.state.entryTime == undefined || this.state.entryTime == "NaN-NaN-NaN") {
            Toast.showInfo('请填写入职时间', 1000)
            return;
        }
        if (this.state.seperateTime == '' || this.state.seperateTime == undefined || this.state.seperateTime == "NaN-NaN-NaN") {
            Toast.showInfo('请填写离职时间', 1000)
            return;
        }
        if (this.state.seperateTime != '' && this.state.entryTime != '' && seperateTime < entryTime) {
            Alert.alert("温馨提示", "离职时间必须大于入职时间"
                , [
                    {
                        text: "确定", onPress: () => {
                        }
                    }])
            return
        }
        if (this.state.workContent == '' || this.state.workContent == undefined) {
            Toast.showInfo('请填写工作内容', 1000)
            return;
        }
        var temp = {
            companyName: this.state.companyName, position: this.state.position,
            entryTime: (this.state.ifRuzhi) ? this.toTimeStamp(this.state.entryTime) : this.state.entryTime_ruzhi,
            seperateTime: (this.state.ifLizhi) ? this.toTimeStamp(this.state.seperateTime) : this.state.seperateTime_lizhi,
            workContent: this.state.workContent,
            id: this.state.id == undefined ? null : this.state.id,
            i: this.props.params.i == undefined ? '' : this.props.params.i,
            type: this.props.params.type == 'edit' ? 'edit' : ''
        };
        this.props.onblock(temp);
        Actions.pop();
    }
    toTimeStamp(time) {
        // 将指定日期转换为时间戳。
        var t = time;  // 月、日、时、分、秒如果不满两位数可不带0.
        var T = new Date(t);  // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
        return T.getTime()  // 将转换后的标准日期转换为时间戳。

    }
}

const styles = StyleSheet.create({
    companyItem: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: 1
    },
    companyLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: '#333333',
        // marginLeft: 3,
        marginBottom: 10
    }
});