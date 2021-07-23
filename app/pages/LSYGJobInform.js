/**
 * 临时用工工作详情
 * Created by 曾一川 on 11/1/19.
 */
import React, { Component } from 'react';
import { Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform } from 'react-native';
import { Actions, VectorIcon, Config, SafeArea, Fetch } from 'c2-mobile';
import theme from '../config/theme';
import Toasts from 'react-native-root-toast'
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;


export default class LSYGJobInform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LSYGid: '',
            LSYGJOB_DESCRIPTION: '',
            LSYGCOMPANY_NAME: '',
            LSYGSALARY: '',
            LSYGSERVING_REQUIRE: '',
            LSYGCOMPANY_KIND: '',
            LSYGareadetail: '',

            POSITION_PROVINCE_NAME: '',
            POSITION_CITY_NAME: '',
            POSITION_AREA_NAME: '',
            address: '',

            LSYGWORK_END_TIME: '',
            LSYGremark2: '',
            COMPANY_NAME: '',
            showPDF: true,
        }
        //接收
        Fetch.getJson(Config.mainUrl + '/temporaryWork/getTemporaryWorkDetail?id=' + this.props.rowData.positionId+'&status='+this.props.rowData.STATUS)
            .then((res) => {
                console.log(res)
                this.setState({
                    LSYGid: res[0].id,
                    LSYGJOB_DESCRIPTION: res[0].JOB_DESCRIPTION,
                    LSYGCOMPANY_NAME: res[0].COMPANY_NAME,
                    LSYGSALARY: res[0].SALARY,
                    LSYGSERVING_REQUIRE: res[0].SERVING_REQUIRE,
                    LSYGCOMPANY_KIND: res[0].COMPANY_KIND,
                    LSYGareadetail: res[0].areadetail,

                    POSITION_PROVINCE_NAME: res[0].POSITION_PROVINCE_NAME,
                    POSITION_CITY_NAME: res[0].POSITION_CITY_NAME,
                    POSITION_AREA_NAME: res[0].POSITION_AREA_NAME,
                    address: res[0].address,

                    LSYGWORK_END_TIME: res[0].WORK_END_TIME,
                    LSYGremark2: res[0].remark2,
                    COMPANY_NAME: res[0].COMPANY_NAME
                })
            })
        var url = Config.mainUrl + '/ws/getFilePathByApp?id=' + this.props.rowData.contractId + '&type=LSYG';
        //Http请求
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((res) => {
                if (res == "false") {
                    this.setState({
                        showPDF: false
                    })
                } else {
                    this.setState({
                        showPDF: true
                    })
                }
            })
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1 }} >
                <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>我的工作</Text>
                    </View>
                </ImageBackground>
                <ScrollView style={{ marginBottom: 80 }}>
                    <View>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20, width: deviceWidth }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: Config.MainFontSize + 2, fontWeight: 'bold', margin: 8, width: deviceWidth / 2 }}>{this.props.rowData.positionName}</Text>
                                    {this.state.LSYGSALARY == '' || this.state.LSYGSALARY == undefined ? null :
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', position: 'absolute', right: 20, margin: 5 }}>{(this.state.LSYGSALARY == '面议' || this.state.LSYGSALARY == '不限') ? this.state.LSYGSALARY : this.state.LSYGSALARY + "元"} </Text>
                                    }
                                </View>
                                {this.state.LSYGWORK_END_TIME == '' || this.state.LSYGWORK_END_TIME == undefined ? null :
                                    <View style={{ position: 'absolute', bottom: 10, left: 10, }}>
                                        <Text style={{ fontSize: Config.MainFontSize - 4 }}>{this.timeChange(this.state.LSYGWORK_END_TIME)}前完成</Text>
                                    </View>
                                }

                            </View>
                        </View>
                        <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
                    </View >
                    {this.state.LSYGJOB_DESCRIPTION == '' || this.state.LSYGJOB_DESCRIPTION == undefined ? null :
                        <View>
                            <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>包需求</Text>
                                <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                            </View>
                            <View style={{ margin: 10 }}>
                                <Text>{this.state.LSYGJOB_DESCRIPTION}</Text>
                            </View>
                        </View>}
                    {this.state.LSYGSERVING_REQUIRE == '' || this.state.LSYGSERVING_REQUIRE == undefined ? null :
                        <View>
                            <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>验收标准</Text>
                                <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                            </View>
                            <View style={{ margin: 10 }}>
                                <Text>{this.state.LSYGSERVING_REQUIRE}</Text>
                            </View>
                        </View>}
                    {this.state.LSYGremark2 == '' || this.state.LSYGremark2 == undefined ? null :
                        <View>
                            <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                <VectorIcon name={"briefcase2"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>我需要</Text>
                                <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                            </View>
                            <View style={{ margin: 10 }}>
                                <Text>{this.state.LSYGremark2}</Text>
                            </View>
                        </View>}
                    {this.props.rowData.STATUS == '0' || this.state.showPDF == false ? null :
                        <View>
                            <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                                <VectorIcon name={"file_text_alt"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                                <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>合同详情</Text>
                                <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                            </View>
                            <TouchableOpacity onPress={() => this.getPDF()}>
                                <Text style={{ margin: 10, color: 'rgb(65,143,234)' }}>点击查看合同详情</Text>
                            </TouchableOpacity>
                        </View>}

                    <View style={{ flexDirection: 'row', margin: 10, marginTop: 30 }}>
                        <VectorIcon name={"building"} size={18} color={'rgb(65,143,234)'} style={{ backgroundColor: 'transparent' }} />
                        <Text style={{ marginLeft: 4, fontSize: Config.MainFontSize }}>公司信息</Text>
                        <View style={{ width: deviceWidth / 1.5, marginLeft: 5, borderWidth: 0.5, borderColor: '#E8E8E8', height: 1, alignSelf: 'center' }} />
                    </View>
                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Image source={require('../image/company.png')} style={{ height: 70, width: 70 }}></Image>
                        <View>
                            <Text style={{ fontSize: Config.MainFontSize, marginLeft: 10, maxWidth: theme.screenWidth - 100 }}>{(this.state.COMPANY_NAME == undefined) ? "未知企业" : this.state.COMPANY_NAME}</Text>
                            {/* {this.state.LSYGCOMPANY_KIND == '' || this.state.LSYGCOMPANY_KIND == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 10, marginTop: 10, maxWidth: theme.screenWidth - 100 }}>公司性质:{this.state.LSYGCOMPANY_KIND}</Text>
                            } */}
                            {this.state.LSYGareadetail == '' || this.state.LSYGareadetail == undefined ? null :
                                <Text style={{ fontSize: Config.MainFontSize - 2, marginLeft: 10, marginTop: 10, maxWidth: theme.screenWidth - 100 }}>公司地址:{this.state.LSYGareadetail}</Text>
                            }
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginLeft: 10, marginTop: 10 }}>{(this.props.rowData.PLACE == undefined) ? '' : this.props.rowData.PLACE + "  |  "}</Text>
                        </View>
                    </View>

                </ScrollView>
            </View>
        );
    }
    timeChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期

        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate());
        return date;

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

    dataChange(value) {
        var d = new Date(value * 1);    //根据时间戳生成的时间对象
        //只显示日期
        var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate()) + " "
        return date;
    }
    getPDF() {
        var entity = {
            contractId: this.props.rowData.contractNo
        }
        Fetch.postJson(Config.mainUrl + '/Contract/viewContract?params=' + JSON.stringify(entity))
            .then((ret) => {
                Actions.C2WebView({ url: ret.url })
            })
        // var url = Config.mainUrl + '/ws/getFilePathByApp?id=' + this.props.rowData.contractId + '&type=LSYG';
        // //Http请求
        // fetch(url, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then((res) => res.text())
        //     .then((res) => {
        //         if (res == "false") {
        //             Toasts.show('未找到合同,请联系管理员', { position: -80 });
        //         } else {
        //             if (Platform.OS == 'ios') {
        //                 Actions.C2WebView({ url: Config.mainUrl + '/' + res })
        //             } else {
        //                 Actions.C2WebView({ url: Config.mainUrl + '/pdfview.html?' + res })
        //             }

        //         }

        //     })

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
