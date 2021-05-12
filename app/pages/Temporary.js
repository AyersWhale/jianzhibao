/**
 * 临时承揽
 * Created by 曾一川 on 03/07/19.
 */
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, Alert, DeviceEventEmitter, BackHandler, Modal, TextInput } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast } from 'c2-mobile';
import theme from '../config/theme';
import Toasts from 'react-native-root-toast';
import underLiner from '../utils/underLiner';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class Temporary extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            result: [],
            ifzero: false,
            checkQyStatu: '',
            checkGrStatu: '',
            modalVisible: false,
            index: '',
            content: '',
            Jbr: true
        }
        this.getJobPublicList()
        this.checkQYZZ()
    }
    //检查企业是否上传营业执照
    checkQYZZ() {
        var entity = {
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
        }
        Fetch.postJson(Config.mainUrl + '/companyRegistInfo/getOneCompanyInfo', entity)
            .then((res) => {
                this.setState({
                    checkQyStatu: res.hrEmailPassword,
                    checkGrStatu: res.remark1
                })
            })
    }
    getJobPublicList() {

        Fetch.postJson(Config.mainUrl + "/temporaryWork/getList", UserInfo.loginSet.result.rdata.loginUserInfo.userId)
            .then((res) => {
                // debugger
                console.log(res)
                if (res.length == 0) {
                    this.setState({
                        ifzero: true
                    })
                } else {
                    this.setState({
                        ifzero: false
                    })
                }
                //debugger
                this.setState({
                    result: res,
                })
            })
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('public', (text) => {
            this.getJobPublicList()
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.subscription.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    handleStopPackage(rowData) {
        Alert.alert("温馨提示", "是否确定将包终止"
            , [
                {
                    text: "取消", onPress: () => { }
                },
                {
                    text: "确认", onPress: () => {
                        Fetch.postJson(Config.mainUrl + '/getJobInfo/pfflinePackageTermination', [rowData.ID])
                            .then((res) => {
                                if (res.status == '200') {
                                    Toast.show('包终止成功', { position: -80 });
                                    this.getJobPublicList()
                                }
                            }).catch((error) => {
                                Toast.show(res.Msg, { position: -80 });
                            });
                    }
                }
            ])
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={{ flex: 1 }}>
                {/* <ImageBackground source={require('../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>合伙人发包</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>合伙人发包</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: '#E8E8E8' }} >
                    {this.state.checkQyStatu != '3' ?
                        <View style={{ height: 40, width: deviceWidth, backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}
                        // onPress={() => {
                        //     if (UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false') {
                        //         Toast.showInfo('请先去电脑端完善企业信息', 1000);
                        //         return
                        //     } else { Actions.CompanyAudit() }
                        // } }
                        >
                            <Text style={{ fontSize: Config.MainFontSize, color: 'rgb(22,131,251)', margin: 20 }}>企业实名认证</Text>
                            <VectorIcon name={'shield'} color={'red'} size={20} style={{ marginLeft: deviceWidth / 3 }} />
                            {
                                this.state.checkGrStatu != '2' ? <Text style={{ margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>未实名认证</Text>
                                    : <Text style={{ color: 'green', fontSize: Config.MainFontSize, margin: 10 }}>已实名认证</Text>
                                // this.state.checkGrStatu == undefined ?
                                //     <Text style={{ margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>未开启</Text> :
                                //     this.state.checkQyStatu == '1' ?
                                //         <Text style={{ margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>草拟</Text> :
                                //         this.state.checkQyStatu == '2' ?
                                //             <Text style={{ margin: 10, fontSize: Config.MainFontSize, color: 'orange' }}>审核中</Text> :
                                //             this.state.checkQyStatu == '4' ?
                                //                 <Text style={{ margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>已驳回</Text> : <Text style={{ margin: 10, fontSize: Config.MainFontSize, color: 'red' }}>未认证</Text>

                            }
                            {/* <VectorIcon name={'chevron_right'} size={18} style={{ margin: 10 }} /> */}
                        </View> :
                        <View style={{ height: 40, width: deviceWidth, backgroundColor: 'white', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}
                        // onPress={() => Actions.CompanyAudit({ checkStatu: this.state.checkQyStatu })}
                        >
                            <Text style={{ fontSize: Config.MainFontSize, color: 'rgb(22,131,251)', margin: 20 }}>企业实名认证</Text>
                            <VectorIcon name={'shield'} color={'green'} size={20} style={{ marginLeft: deviceWidth / 3 }} />
                            <Text style={{ color: 'green', fontSize: Config.MainFontSize, margin: 10 }}>已实名认证</Text>
                            {/* <VectorIcon name={'chevron_right'} size={18} style={{ margin: 10 }} /> */}
                        </View>
                    }
                    {this.showList()}
                </ScrollView>
                <View>
                    {this.state.checkGrStatu == '2' ?
                        <TouchableOpacity style={{
                            width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgb(22,131,251)',
                            position: 'absolute', bottom: 30, elevation: 4, right: 25, justifyContent: 'center', alignItems: 'center'
                        }} onPress={() => Actions.PublicJob({ onblock: this.getJobPublicList.bind(this) })}>
                            <Text style={{ color: '#fff', fontSize: 18, }}>+</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity style={{
                            width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgb(22,131,251)',
                            position: 'absolute', bottom: 30, elevation: 4, right: 25, justifyContent: 'center', alignItems: 'center'
                        }} onPress={() => this.inform()}>
                            <Text style={{ color: '#fff', fontSize: 18, }}>+</Text>
                        </TouchableOpacity>
                    }
                </View>
                {this.ScModal()}
            </View>
        );
    }
    ScModal() {
        var rowData = this.state.index
        let _maxLength = deviceHeight / 5;
        return (
            <View>
                <Modal
                    alignSelf={'center'}
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}
                >
                    <View style={{ width: deviceWidth - 40, marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 10, backgroundColor: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ height: 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            <Text style={{ color: 'black', fontSize: Config.MainFontSize, fontWeight: 'bold' }}>删除原因</Text></View>
                        <View style={underLiner.liners} />
                        <View style={{ width: deviceWidth - 80, height: 100, backgroundColor: '#E8E8E8' }}>
                            {
                                <TextInput
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请输入删除原因'}
                                    style={{ textAlign: 'left', marginLeft: 16, marginRight: 16, flex: 1, fontSize: 14 }}
                                    autoCapitalize={'none'}
                                    multiline={true}
                                    maxLength={parseInt(_maxLength)}
                                    onChangeText={(text) => this.setState({ content: text })} />

                            }
                        </View>
                        <View style={{ flexDirection: 'row', width: deviceWidth - 40, alignContent: 'center', alignItems: 'center', alignSelf: 'center', height: 60, position: 'absolute', bottom: 10 }}>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 45, marginRight: 45 }}>
                                <TouchableOpacity style={{ backgroundColor: '#FF4040', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 20, marginRight: 20 }}>
                                <TouchableOpacity style={{ backgroundColor: 'rgb(32,124,241)', width: deviceWidth / 4, height: 30, borderRadius: 10, alignContent: 'center', alignItems: 'center', alignSelf: 'center', }} onPress={() => this.Sc(rowData)}>
                                    <Text style={{ color: 'white', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 5 }}>提交</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10 }} onPress={() => this.setState({ modalVisible: false })}>
                            <VectorIcon name={"android-close"} size={20} color={'black'} style={{ backgroundColor: 'transparent' }} />
                        </TouchableOpacity>
                    </View>

                </Modal>
            </View>
        )
    }
    Sc(rowData) {
        if (this.state.content == '') {
            Toast.showInfo('请输入删除原因', 2000);
        } else {
            rowData.REMARK5 = this.state.content
            console.log(rowData)
            if (this.state.Jbr == true) {
                Toast.show({
                    type: Toast.mode.C2MobileToastLoading,
                    title: '删除中...'
                });
                Fetch.postJson(Config.mainUrl + '/getJobInfo/sendDeleteMessage', rowData.ID)
                    .then((res) => {
                        Toast.dismiss();
                        if (res == true) {
                            rowData.DEL_FLAG = '1'
                            Fetch.postJson(Config.mainUrl + '/temporaryWork/deletePackage', rowData)
                                .then((res1) => {
                                    Toast.showInfo('删除成功，已给接包人员发送删除合伙人发包通知!', 2000);
                                    this.getJobPublicList()
                                    this.setState({
                                        modalVisible: false
                                    })
                                })
                        } else {
                            Toast.showInfo('删除失败，未能给接包人员发送删除合伙人发包通知！', 2000);
                        }
                    })
            } else {
                rowData.DEL_FLAG = '1'
                Toast.show({
                    type: Toast.mode.C2MobileToastLoading,
                    title: '提交中...'
                });
                Fetch.postJson(Config.mainUrl + '/temporaryWork/deletePackage', rowData)
                    .then((res1) => {
                        Toast.dismiss();
                        Toast.showInfo('删除成功!', 2000);
                        this.getJobPublicList()
                        this.setState({
                            modalVisible: false
                        })
                    })
            }
        }
    }
    inform() {
        // if (this.state.checkGrStatu != '2') {
        //     Toasts.show('企业实名认证尚未认证成功，不能发包', { position: -80 });
        // } else
        if (UserInfo.loginSet.result.rdata.loginUserInfo.remark1 == 'false') {
            Toast.showInfo('请去电脑端完善企业信息', 2000);
            return
        }
        if (this.state.checkGrStatu != '2') {
            Toasts.show('企业尚未进行实名认证，请去PC端完成', { position: -80 });
            return
        }

    }

    showList() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../image/icon/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ marginBottom: (Platform.OS == 'ios') ? 40 : 15, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                <ListView
                    style={{ borderRadius: 20 }}
                    dataSource={this.ds.cloneWithRows(this.state.result)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />

            </View>)
        }

    }

    _renderItem(rowData, rowId) {
        var rowDatastatus = ''
        if (rowData.POSITION_KIND == '0') {
            if (rowData.ADVANCE_PAYMENT == '0') {
                rowDatastatus = true
            } else {
                rowDatastatus = false
            }
        } else {
            rowDatastatus = false
        }
        return (
            <View>
                <TouchableOpacity style={{ backgroundColor: 'white', width: deviceWidth - 10, marginLeft: 5 }} onPress={() => { this.state.checkGrStatu == '2' ? Actions.PublicJob1({ rowData: rowData, onblock: this.getJobPublicList.bind(this) }) : this.inform() }}>
                    <View style={{ backgroundColor: 'transparent', marginLeft: 10, paddingTop: 10, paddingBottom: 20 }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize, fontWeight: 'bold', width: deviceWidth / 3 * 2 }}>{rowData.POSITION_NAME}</Text>

                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <Text style={{ fontSize: Config.MainFontSize }}>{rowData.POSITION_KIND == '0' ? '单包' : '多包'}</Text>
                            <Text style={{ fontSize: Config.MainFontSize, color: '#EE2C2C', marginLeft: 5 }}>{rowData.CHECK_STATUS == '0' ? '草拟' : rowData.CHECK_STATUS == '1' ? '审核中' : rowData.CHECK_STATUS == '2' ? '审核通过' : rowData.CHECK_STATUS == '3' ? '已驳回' : null}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15, alignItems: "center" }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>{(rowData.WORK_MODE == 'FQRZ' ? '兼职' : rowData.WORK_MODE == 'LWPQ' ? '抢单' : rowData.WORK_MODE == 'LSYG' ? '合伙人' : rowData.WORK_MODE == 'QRZ' ? '全日制' : null)}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 3, color: 'rgb(22,131,251)', borderRadius: 5, padding: 1 }}>
                                {rowData.ELECTRONIC_BUSINESS_LICENSE == "1" ? "不需要电子营业执照" : "需要电子营业执照"}
                            </Text>
                            {rowData.POSITION_STATUS == "6" ?
                                <Text style={{ fontSize: Config.MainFontSize - 3, color: '#d0473a', borderRadius: 5, padding: 1 }}>
                                    包已终止
                                </Text>
                                : null}
                            {rowData.REMARK4 == "1" && rowData.POSITION_STATUS != "6" && rowData.CHECK_STATUS != '1' ?
                                <TouchableOpacity style={{ backgroundColor: "rgb(65,143,234)", borderRadius: 5, overflow: "hidden" }} onPress={() => { this.state.checkGrStatu == '2' ? this.handleStopPackage(rowData) : this.inform() }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 3, color: "#fff", padding: 5 }}>非平台结算包终止</Text>
                                </TouchableOpacity>
                                : null}
                        </View>

                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            {/* <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', marginRight: 5 }}>当前状态：{rowData.POSITION_STATUS == '0' ? '待接包' : rowData.POSITION_STATUS == '1' ? '签合同中' : rowData.POSITION_STATUS == '2' ? '接包成功' : rowData.POSITION_STATUS == '3' ? '未开始' : rowData.POSITION_STATUS == '4' ? '工作中' : rowData.POSITION_STATUS == '5' ? '工作完成' : rowData.POSITION_STATUS == '6' ? '包终止' : rowData.POSITION_STATUS == '7' ? '请求终止中' : rowData.POSITION_STATUS == '8' ? '终止驳回' : null}</Text> */}
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'grey', position: 'absolute', right: 20, top: 15 }}>用工结束时间:{this.timeChange(rowData.WORK_END_TIME)}</Text>
                        </View>
                        {rowData.REMARK1 == '' || rowData.REMARK1 == undefined ? null : rowData.CHECK_STATUS != '3' ? null :
                            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 2 }}>驳回原因:{rowData.REMARK1}</Text>
                            </View>
                        }

                    </View>
                    <TouchableOpacity style={{ alignItems: 'center', alignContent: 'center', position: 'absolute', right: 10, backgroundColor: 'rgb(65,143,234)', borderRadius: 15, top: 10 }} onPress={() => this.ScList(rowData)}><Text style={{ backgroundColor: 'transparent', alignSelf: 'center', color: 'white', alignItems: 'center', fontSize: Config.MainFontSize, padding: 8 }}>删除</Text></TouchableOpacity>
                    {/* && rowData.POSITION_KIND == '0'  */}
                    {rowData.CHECK_STATUS == '2' && rowData.POSITION_STATUS != '6' ?
                        <TouchableOpacity style={{ alignItems: 'center', alignContent: 'center', position: 'absolute', right: 10, backgroundColor: 'rgb(65,143,234)', borderRadius: 15, top: 45 }} onPress={() => { this.state.checkGrStatu == '2' ? Actions.ChoosePeople({ rowData: rowData, onblock: this.getJobPublicList.bind(this) }) : this.inform() }}><Text style={{ backgroundColor: 'transparent', alignSelf: 'center', color: 'white', alignItems: 'center', fontSize: Config.MainFontSize, padding: 8 }}>选接包人</Text></TouchableOpacity> : null
                    }
                </TouchableOpacity>
                <View style={{ height: 8, backgroundColor: '#E8E8E8', width: theme.screenWidth }} />
            </View>
        )
    }
    ScList(rowData) {
        if (rowData.CHECK_STATUS == '2') {
            Fetch.getJson(Config.mainUrl + '/getJobInfo/getJobListByPositionId?positionId=' + rowData.ID)
                .then((res) => {
                    if (res.length > 0) {
                        Fetch.getJson(Config.mainUrl + '/getJobInfo/getContractListByJobInfoId?positionId=' + rowData.ID)
                            .then((res1) => {
                                if (res1.length > 0) {
                                    Toast.showInfo('该发包存在已签订合同数据，不能进行删除操作!', 2000)
                                } else {
                                    this.setState({
                                        modalVisible: true,
                                        index: rowData
                                    })
                                }
                            })
                    } else {
                        Alert.alert("提示", "该发包已经审核通过，目前还没有人接包，确定是否删除发包?"
                            , [
                                {
                                    text: "我再看看", onPress: () => {
                                    }
                                },
                                {
                                    text: "继续", onPress: () => {
                                        this.setState({
                                            modalVisible: true,
                                            index: rowData,
                                            Jbr: false
                                        })
                                    }
                                }])
                    }
                })
        } else {
            Alert.alert("提示", "该发包还没有审核通过，确定是否删除发包?"
                , [
                    {
                        text: "我再看看", onPress: () => {
                        }
                    },
                    {
                        text: "继续", onPress: () => {
                            rowData.DEL_FLAG = '1'
                            Fetch.postJson(Config.mainUrl + '/temporaryWork/deletePackage', rowData)
                                .then((res1) => {
                                    Toast.showInfo('删除成功', 2000);
                                    this.getJobPublicList()
                                    this.setState({
                                        modalVisible: false
                                    })
                                })
                            // this.setState({
                            //     // modalVisible: true,
                            //     index: rowData,
                            //     Jbr: false
                            // })
                        }
                    }])
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
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
});
