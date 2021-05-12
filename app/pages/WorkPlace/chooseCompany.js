
/**
 * 功能模块：选择公司
 * 
 * 开发负责人：曾一川
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Platform, ListView, Image, BackHandler
} from 'react-native';
import { Actions, VectorIcon, Config, Calendar, UserInfo, Fetch, SafeArea } from 'c2-mobile';
import underLiner from '../../utils/underLiner';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class chooseCompany extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            companyList: [],
            ifzero: false,
        }
        this.getCompanylist()
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
    getCompanylist() {//选择公司
        //Http请求
        var entity = {
            idCard: UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == '' || UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard == undefined ? '1' : UserInfo.loginSet.result.rdata.loginUserInfo.userIdcard,
        }
        Fetch.getJson(Config.mainUrl + '/companyRegistInfo/getQyCompany', entity)
            .then((json) => {
                // debugger
                if (json.length > 0) {
                    this.setState({
                        companyList: json
                    })
                } else {
                    this.setState({
                        ifzero: true
                    })
                }
            })
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F4F4F4', height: deviceHeight }}>
                {/* <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>选择打卡公司</Text>
                    </View>
                </ImageBackground> */}
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>选择打卡公司</Text>
                    </View>
                </View>
                {this.companyListView()}
            </View>
        )
    }
    companyListView() {
        if (this.state.ifzero) {
            return (
                <View style={{ height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../image/app_panel_expression.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: 15, color: "grey", marginTop: 10 }}>当前列表为空～</Text>
                </View>
            )
        } else {
            return (<View style={{ marginBottom: (Platform.OS == 'ios') ? 140 : 150, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 7 }}>
                <ListView
                    dataSource={this.ds.cloneWithRows(this.state.companyList)}
                    renderRow={this._renderItem.bind(this)}
                    enableEmptySections={true}
                />

            </View>)
        }
    }
    _renderItem(rowData) {
        if (!rowData.isParent) {
            return (
                <View>
                    <TouchableOpacity style={{ marginTop: 10, backgroundColor: '#fff' }} onPress={this.itemReturn.bind(this, rowData)}>
                        <View style={{ padding: 5 }}>
                            <Text style={{ color: '#333', margin: 15, fontSize: Config.MainFontSize + 1 }}>{rowData.jobContent}</Text>
                            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                {/* <VectorIcon name={"building"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', marginLeft: 5 }} /> */}
                                <Image source={require('../../image/Dkgs.png')} style={{ width: 20, height: 20, backgroundColor: 'transparent', marginLeft: 5 }} />
                                <Text style={{ color: '#999', marginLeft: 10 }}>{rowData.name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10 ,marginBottom:10}}>
                                {/* <VectorIcon name={"tag"} size={20} color={'rgb(32,124,241)'} style={{ backgroundColor: 'transparent', marginLeft: 5 }} /> */}
                                <Image source={require('../../image/Dklx.png')} style={{ width: 20, height: 20, backgroundColor: 'transparent', marginLeft: 5 }} />
                                <Text style={{ color: '#999',marginLeft: 10 }}> {(rowData.workMode == 'FQRZ' ? '兼职' : rowData.workMode == 'LWPQ' ? '抢单' : rowData.workMode == 'LSYG' ? '合伙人' : rowData.workMode == 'QRZ' ? '全日制' : null)}</Text>
                                <Text style={{ color: '#999', position: 'absolute', right: 20 }}>{rowData.startDate.substring(0, 10)}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width: deviceWidth, height: 0.5, backgroundColor: 'white', alignSelf: 'center' }} />
                </View>
            )
        } else {
            return null
        }

    }


    itemReturn(rowData) {
        Actions.pop()
        this.props.onblock(rowData)
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    }
})

