/**
 * Created by wangdi on 13/11/16.
 */
import React from 'react';
import { Share, View, StyleSheet, PixelRatio, WebView, ActivityIndicator, DeviceEventEmitter, BackHandler, Platform } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import Colors from '../pages/contactList/Colors';
import Toasts from 'react-native-root-toast';
import PageComponent from '../pages/BackPageComponent';
import { NavigationBar, Actions, Toast } from 'c2-mobile';
export default class OfficeDeatail extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: (this.props.title == undefined) ? '详情查看' : this.props.title,
        };
        this.load = true;
    }
    shareTo() {
        Share.share({
            message: '',
            url: this.props.url,
            title: (this.props.filename == undefined) ? '' : this.props.filename,
        }, {
            dialogTitle: '分享',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ],
            tintColor: '#54BED6'
        })
            .then(this._showResult)
            .catch((error) => this.setState({ result: 'error: ' + error.message }));
    }
    _showResult(result) {
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                this.setState({ result: 'shared with an activityType: ' + result.activityType });
            } else {
                this.setState({ result: 'shared' });
            }
        } else if (result.action === Share.dismissedAction) {
            this.setState({ result: 'dismissed' });
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackHandler);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler);
        }
    }
    onBackHandler = () => {
        if (this.props.types == 'FDD') {
            DeviceEventEmitter.emit('yiqian');
            Actions.pop()
        }
        Actions.pop()
        return true
    }
    componentWillMount() {
        // Toast.show({
        //     type: Toast.mode.C2MobileToastLoading,
        //     title: '请稍后...',
        //     duration: 2000
        // });
    }
    handlePop() {
        Actions.pop()
        if (this.props.types == 'FDD') {
            DeviceEventEmitter.emit('yiqian');
            Actions.pop()
        }
        //debugger
        if (this.props.popCallback) {
            this.props.popCallback()
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title={this.state.title} faction='center' style={{ borderWidth: 0 }}>
                    <NavigationBar.NavBarItem onPress={() => this.handlePop()} title={''} faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <WebView
                    ref={(ref) => { this.webView = ref }}
                    source={{ uri: this.props.url }}
                    style={{ width: '100%', height: '100%' }}
                    renderLoading={this._renderLoading.bind(this)}
                    startInLoadingState={false}
                    onLoadEnd={() => { Toast.dismiss() }}
                    automaticallyAdjustContentInsets={true}
                    scrollEnabled={true}
                    onLoad={this._onLoad.bind(this)}
                    onError={this._showTips.bind(this, '加载失败！')}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                />
            </View>
        );
    }

    _showTips(msg) {
        Toasts.show(msg, { position: px2dp(-80) });
    }
    _onLoad() {

        if (this.load) {
            this.load = !this.load;
            this.webView.reload();
        }

    }

    _renderLoading() {
        return (
            <View style={{ justifyContent: 'center', paddingTop: px2dp(20) }}>
                <ActivityIndicator color={theme.themeColor} size="large" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.mainBackground
    },
    webView: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    bottom: {
        width: theme.screenWidth,
        height: px2dp(49),
        backgroundColor: '#fff',
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#c4c4c4',
        flexDirection: 'row',
        paddingLeft: px2dp(20),
        paddingRight: px2dp(20),
        alignItems: 'center'
    },
    info: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
    }
});