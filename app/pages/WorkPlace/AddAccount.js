/**
 * 添加银行卡/查看银行卡/编辑银行卡
 * 郭亚新 2020/4/2
 */
import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView, ImageBackground, Dimensions, ListView, Image, TouchableOpacity, Platform, DeviceEventEmitter, RefreshControl, InteractionManager, TextInput, BackHandler } from 'react-native';
import { UUID, Actions, VectorIcon, Config, SafeArea, UserInfo, Fetch, Toast, SegmentedControl } from 'c2-mobile';
import { Checkbox, List, Picker, Switch } from 'antd-mobile-rn';
const deviceWidth = Dimensions.get('window').width;
const bankRule = /^([1-9]{1})(\d{14}|\d{18})$/
const bankRule1 = /\b\d{12,19}\b/
export default class AddAccount extends Component {
    constructor(props) {
        super(props);
        //this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            data_bank_source: [],
            data_bank: [],//开户行字典
            value_bank: this.props.rowData ? this.props.rowData.openbankName : '',//开户行显值
            value_bank_name: this.props.rowData ? this.props.rowData.openbank : '',//开户行真实值
            OPENBANK_ZH: this.props.rowData ? this.props.rowData.opengbankzh : '',//支行
            accountNum: this.props.rowData ? this.props.rowData.wagescart : '',//账号
            checked: this.props.rowData ? (this.props.rowData.bankstatus == "1" ? true : false) : false,
        }
        this.getValueBackDictionary()
        this.onChange1 = this.onChange1.bind(this);
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
    getValueBackDictionary() {
        fetch(Config.mainUrl + '/ws/getDictDataList?dictTypeName=开户行', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.text())
            .then((json) => {
                let data_b = []
                let xlList = JSON.parse(json).result;
                console.log(xlList)
                for (let i in xlList) {
                    if (xlList[i].dictdataName != '') {
                        data_b.push({ value: JSON.stringify(xlList[i]), label: xlList[i].dictdataValue })
                    }
                }
                this.setState({
                    data_bank: data_b,
                    data_bank_source: xlList
                })
            })
    }
    onChange_bank = (value) => {
        let values = JSON.parse(value[0])
        this.setState({
            value_bank: values.dictdataValue,
            value_bank_name: values.dictdataName,
        });
    }
    removeAllSpace(str) {
        return str.replace(/\s+/g, "");
    }
    save() {
        var bankCardnum = this.removeAllSpace(this.state.accountNum);
        if (bankRule1.test(bankCardnum) == false || bankCardnum == '' || bankCardnum == undefined) {
            Toast.showInfo('请输入正确的银行卡卡号', 1000)
            return;
        }
        if (this.state.value_bank_name == '') {
            Toast.showInfo('请选择开户行信息', 1000)
            return;
        }
        if (this.state.OPENBANK_ZH == '') {
            Toast.showInfo('请输入开户行支行', 1000)
            return;
        }
        var entity = {
            id: this.props.rowData ? this.props.rowData.id : undefined,
            openbank: this.state.value_bank_name,
            openbankZh: this.state.OPENBANK_ZH,
            userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId,
            wagescard: this.state.accountNum
        }
        Fetch.postJson(Config.mainUrl + '/personnelBank/savePersonBank', entity)
            .then((res) => {
                if (res.rcode == '1') {
                    Toast.showInfo('保存成功', 1000);
                    Actions.pop()
                    this.props.onblock()
                }
            }).catch((error) => {
                Toast.show(res.Msg, { position: px2dp(-80) });
            });
    }
    _splitNum(str) {
        let reg = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/;
        let arr = reg.exec(str);
        let result = '';
        for (let i = 1; i < arr.length; i++) {
            if (arr[i]) {
                if (i === 1) {
                    result = arr[1];
                } else {
                    result = result + " " + arr[i];
                }
            } else {
                break;
            }
        }
        return result;
    }
    _replaceSpace(str) {
        if (typeof str === 'string') {
            //替换空格或者非数字字符
            return str.replace(/\s|\D+/g, '');
        }
        return "";
    }
    onChange1(changeText) {
        let value = this._splitNum(this._replaceSpace(changeText))
        this.setState({
            accountNum: value,
        });
    }
    render() {
        const pinkerBank = this.state.data_bank
        return (
            <View style={{ flex: 1 }}>
                <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>银行卡信息</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: "#fff", marginTop: 20 }}>
                    <View style={{ width: Dimensions.get('window').width, height: 43 }}>
                        <List>
                            <Picker
                                data={pinkerBank}
                                cols={1}
                                onOk={this.onChange_bank}
                                extra={this.state.value_bank}
                            >
                                <List.Item arrow="horizontal">
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> */}
                                        <Text style={{ fontSize: Config.MainFontSize, color: '#333' }}>开户行信息</Text>
                                    </View>
                                </List.Item>
                            </Picker>
                        </List>
                    </View>
                    <View style={{ height: 0.5, backgroundColor: '#E4E4E4', marginLeft: 16, marginRight: 16 }}></View>
                    <View style={styles.lines}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> */}
                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>开户行支行</Text>
                        </View>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 10, }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            placeholderTextColor="#c4c4c4"
                            value={this.state.OPENBANK_ZH}
                            placeholder='请输入开户行支行'
                            onChangeText={(text) => { this.setState({ OPENBANK_ZH: text }) }}
                        />
                    </View>
                    <View style={styles.lines}>
                        <View style={{ flexDirection: 'row', }}>
                            {/* <Text style={{ color: 'red', fontSize: Config.MainFontSize }}>*</Text> */}
                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize }}>银行卡账号</Text>
                        </View>
                        <TextInput
                            style={{ flex: 1, fontSize: Config.MainFontSize, color: '#999', textAlign: 'right', marginRight: 10, }}
                            underlineColorAndroid="transparent"
                            secureTextEntry={false}
                            keyboardType='numeric'
                            placeholderTextColor="#c4c4c4"
                            value={this.state.accountNum}
                            placeholder='请输入银行卡账号'
                            onChangeText={this.onChange1}
                        />
                    </View>

                    {/* <View style={styles.lines}>
                        <View style={{ flexDirection: 'row', }}>
                            <Text style={{ color: "#222222", fontSize: Config.MainFontSize, marginLeft: 10 }}>设为默认银行卡</Text>
                        </View>
                        <View >
                            <Switch
                                checked={this.state.checked}
                                color="#398fe2"
                                onChange={() => {
                                    this.setState({
                                        checked: !this.state.checked,
                                    });
                                }}
                            />
                        </View>
                    </View> */}
                </View>
                <View style={{ width: deviceWidth, height: 88, bottom: 0, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingLeft: 10, paddingRight: 10 }}>
                    <TouchableOpacity style={{ backgroundColor: '#3E7EFE', width: deviceWidth - 50, height: 50, borderRadius: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => this.save()} >
                        <Text style={{ fontSize: Config.MainFontSize + 3, color: 'white' }}>{this.props.actionTypes == 'add' ? '添加' : '保存'}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    lines: {
        marginBottom: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
        height: 43,
        alignItems: 'center',
        width: Dimensions.get('window').width - 32,
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: 0.5,
        marginTop: 10,
        marginLeft: 16
    }
})