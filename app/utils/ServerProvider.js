import React, { Component } from 'react'
import {
    View,
    ListView,
    Platform,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableOpacity,
    Image,
    Text,
    ScrollView,
    PermissionsAndroid
} from 'react-native';
import { Fetch, Config, VectorIcon } from 'c2-mobile';
import { List, Radio } from 'antd-mobile-rn';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const RadioItem = Radio.RadioItem;
export default class ServerProvider extends Component {
    constructor(props) {
        super(props)
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            serverData: [],
            settlementId: '',
            settlementItem: {}
        }
    }
    componentDidMount() {
        this.getServerData()
    }
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };
    }
    getServerData() {
        Fetch.getJson(Config.mainUrl + '/orgUser/getOrgList')
            .then((res) => {
                console.log(res)
                this.setState({
                    serverData: res
                })
            })
    }
    handleChooseRadio(rowData) {
        this.setState({
            settlementItem: rowData,
            settlementId: rowData.orgId,
        })
        this.props.callback(rowData)
    }
    _renderSettlement(rowData) {
        const value = this.state.settlementId
        return (
            <View style={{ margin: 5, padding: 5 }}>
                <RadioItem name={rowData.orgId} key={rowData.orgId} checked={value === rowData.orgId} onChange={() => this.handleChooseRadio(rowData)}>
                    <Text style={styles.infoItem}>{rowData.orgName}</Text>
                </RadioItem>
            </View>
        )
    }
    render() {
        return (
            <Modal
                alignSelf={'center'}
                animationType={"fade"}
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={() => { this.props.onCancel() }}
            >
                <TouchableOpacity style={{ height: deviceHeight, width: deviceWidth, backgroundColor: 'black', opacity: 0.2 }} onPress={() => { this.props.onCancel() }}>
                </TouchableOpacity>
                <View style={{ position: "absolute", width: deviceWidth - 40, borderColor: "#f8f8f8", marginTop: deviceHeight / 3, height: deviceHeight / 3, borderWidth: 1, borderRadius: 10, backgroundColor: 'white', alignSelf: "center" }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 55, backgroundColor: "#076edf", borderTopRightRadius: 10, borderTopLeftRadius: 10 }}>
                        <Text style={{ color: "#fff", marginLeft: 10 }}>{this.props.title ? this.props.title : "请选择服务商"}</Text>
                        <VectorIcon onPress={() => this.props.onCancel()} name={'android-close'} style={{ color: '#fff', fontSize: 22, backgroundColor: 'transparent', marginRight: 10 }} />
                    </View>

                    <ScrollView style={{ width: deviceWidth - 40 }} scrollIndicatorInsets={{ right: 1 }}>
                        <ListView
                            style={{ borderRadius: 20 }}
                            dataSource={this.ds.cloneWithRows(this.state.serverData)}
                            renderRow={this._renderSettlement.bind(this)}
                            enableEmptySections={true}
                        />
                    </ScrollView>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    infoItem: {
        fontSize: Config.MainFontSize,
    },
})