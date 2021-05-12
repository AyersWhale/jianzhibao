/**
 * 我的工作详情
 * Created by 曾一川 on 11/1/19.
 */
import React, { Component } from 'react';
import { Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Toast, Fetch } from 'c2-mobile';
import theme from '../config/theme';
import Toasts from 'react-native-root-toast'
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class MyJobInform extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    render() {
        // debugger
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>我的工作</Text>
                    </View>
                </ImageBackground>
                <ScrollView style={{ marginBottom: 80 }}>
                    <View style={{ width: deviceWidth - 20, alignSelf: 'center', borderRadius: 5, borderColor: '#E8E8E8', borderWidth: 1, height: deviceHeight / 8, marginTop: 10, padding: 10 }}>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold' }}>{this.props.rowData.jobContent}</Text>
                            {this.props.rowData.basePay == undefined && this.props.rowData.salaryHour == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 10 }}>{this.props.rowData.salaryHour == '' || this.props.rowData.salaryHour == undefined ? this.props.rowData.basePay : this.props.rowData.salaryHour}{this.props.rowData.remark1 == 'FQRZ' ? '元/小时' : '元/月'}</Text>}
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: '#EE2C2C' }}>{this.props.rowData.remark1 == 'FQRZ' ? '兼职' : this.props.rowData.remark1 == 'LSYG' ? '合伙人' : this.props.rowData.remark1 == 'LWPQ' ? '抢单' : '全日制'}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 10 }}>{(this.props.rowData.jfSignTime == undefined) ? '' : "签订时间 :  " + this.dataChange(this.props.rowData.jfSignTime)}</Text>
                        </View>
                    </View>
                    {this.props.rowData.JOB_DESCRIPTION == '' || this.props.rowData.JOB_DESCRIPTION == undefined ? null :
                        <View>
                            <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>职位描述</Text>
                                <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                            </View>
                            <View style={{ margin: 10 }}>
                                <Text>{this.props.rowData.JOB_DESCRIPTION}</Text>
                            </View>
                        </View>}
                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"building"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>公司信息</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Image source={require('../image/company.png')} style={{ height: 80, width: 70 }}></Image>
                        <View style={{ width: deviceWidth - 120 }}>
                            <Text style={{ fontSize: Config.MainFontSize, marginLeft: 10 }}>{this.props.rowData.jfEmployer}</Text>
                            {/* {this.props.rowData.jfAbode == '' || this.props.rowData.jfAbode == undefined ?
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>地址:暂无 </Text> :
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>地址:{this.props.rowData.jfAbode} </Text>
                            } */}
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>地址:{this.props.rowData.jfAbode || this.props.rowData.jfAddress || '暂无'}</Text>

                            {/* {this.props.rowData.jfPhone == '' || this.props.rowData.jfPhone == undefined ?
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>电话:暂无 </Text> :
                                <TouchableOpacity onPress={() => this.onCall(this.props.rowData.jfPhone)}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>电话:{this.props.rowData.jfPhone} </Text>
                                </TouchableOpacity>
                            } */}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"file_text_alt"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>合同详情</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <TouchableOpacity onPress={() => this.getPDF()}>
                        <Text style={{ margin: 10, color: 'rgb(65,143,234)' }}>点击查看合同详情</Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        );
    }
    onCall(phoneNum) {
        let url;
        if (Platform.OS !== 'android') {
            url = 'telprompt:' + phoneNum;
        } else {
            url = 'tel:' + phoneNum;
        }
        Linking.openURL(url);
    }
    // 获取PDF
    getPDF() {
        var entity = {
            contractId: this.props.rowData.contractNo
        }
        Fetch.postJson(Config.mainUrl + '/Contract/viewContract?params=' + JSON.stringify(entity))
            .then((ret) => {
                Actions.C2WebView({ url: ret.url })
            })
        // var url = Config.mainUrl + '/ws/getFilePathByApp?id=' + this.props.rowData.id + '&type=' + this.props.rowData.remark1;
        // //Http请求
        // fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then((res) => res.text())
        //     .then((res) => {
        //         if (res == "false") {
        //             Toasts.show('合同未签订,请联系管理员', { position: -80 });
        //         } else {
        //             if (Platform.OS == 'ios') {
        //                 Actions.C2WebView({ url: Config.mainUrl + '/' + res })
        //             } else {
        //                 Actions.C2WebView({ url: Config.mainUrl + '/pdfview.html?' + res })
        //             }

        //         }

        //     })

    }
    dataChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " "
        return date;
    }

}



const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    backTextWhite: {
        color: 'white',
    },
    rowFront: {
        backgroundColor: 'rgb(250,250,250)',
        borderBottomColor: 'rgb(223,223,223)',
        borderBottomWidth: 1,
        height: 64,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'grey',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#FF3030',
        right: 0,
    },
    imgstyle: {
        height: theme.screenHeight / 3.5,
        width: theme.screenWidth,
    },

});
