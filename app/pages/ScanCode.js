/**
 * 扫一扫
 * 曾一川
 */
'use strict'

import React from 'react';
import {
    Text,
    View,
    Dimensions,
    DeviceEventEmitter,
    ImageBackground,
    TouchableOpacity,
    AppState,
    Platform
} from 'react-native';

import { Actions, NavigationBar, Config } from 'c2-mobile';
import C2QRScannerView from 'c2-mobile-qrcode';
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;

export default class QRcodeView extends React.Component {

    constructor(props) {
        super(props);

        //debugger
        this.state = {
            appState: AppState.currentState,
            cameraShow: true,
            scanResult: '',
        }
        this.allowScan = true;
        this._cancel = this._cancel.bind(this);
        this._barcodeReceived = this._barcodeReceived.bind(this);

    }

    componentDidMount() {
        // this.subscription = DeviceEventEmitter.addListener('change', (text) => {
        //     this.getJobInform()
        // })
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillReceiveProps(nextProps) {

    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        //debugger
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
        }
        this.setState({ appState: nextAppState });
    }


    _cancel() {
        //Actions.ScanCodeLogin({ scanCode: "45678", onblock: this.handlePop.bind(this) })
        Actions.pop();
    }

    _renderTitleBar() {
        return null;
    }

    _renderMenu() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>请对准二维码</Text>
            </View>
        )
    }

    _barcodeReceived(result) {
        // if (result.data.indexOf('http') == 0) {//基础应用
        //     Actions.C2WebView({ url: result.data })
        // } else {
        //     this.props.callback && this.props.callback(result.data);
        //     var result = JSON.parse(result.data);
        //     if (this.allowScan == true && result != null && result != '') {
        //         Actions.TodoCheckPage({ rowData: { businessKey: result.businessKey, taskId: result.taskId, serviceTypeId: result.serviceTypeId, formId: result.formId, proInsId: result.proInsId, processInstanceId: result.processInstanceId } })
        //     }
        // }
        if (Platform.OS == 'ios') {
            if (this.state.scanResult !== '') return
        }
        if (result.data == undefined || result.data.indexOf('http') == 0) {
            Toasts.show('请扫描工薪易PC端APP登录二维码', { position: -80 });
            this.setState({ cameraShow: false })//去掉C2QRScannerView组件，防止出现黑屏
            Actions.pop()
        } else {
            let uuid = result.data
            Actions.ScanCodeLogin({ scanCode: uuid, onblock: this.handlePop.bind(this) })
        }
        this.setState({
            scanResult: result
        })
    }
    handlePop() {
        Actions.pop()
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <NavigationBar title="PC端二维码" faction='center' style={{ borderBottomWidth: 0 }}>
                    <NavigationBar.NavBarItem faction='left' style={{ width: 80, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem onPress={() => { this._cancel() }} faction='right' title={'取消'} style={{ width: 80, paddingRight: 10 }} />
                </NavigationBar>
                {this.state.appState == 'active' && this.state.cameraShow ?
                    <C2QRScannerView
                        maskColor={'transparent'}
                        onScanResultReceived={this._barcodeReceived.bind(this)}
                        renderTopBarView={() => this._renderTitleBar()}
                        renderBottomMenuView={() => this._renderMenu()}
                    />
                    : null}

            </View>
        )
    }
}

