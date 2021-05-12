/**
 * Created by wangdi on 13/11/16.
 */
import React from 'react';
import { Share, View, StyleSheet, PixelRatio, Dimensions, ActivityIndicator } from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import Colors from '../pages/contactList/Colors';
import Toasts from 'react-native-root-toast';
import PageComponent from '../pages/BackPageComponent';
import { NavigationBar, Actions, Toast } from 'c2-mobile';
import Pdf from 'react-native-pdf';
export default class PDFWebView extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.load = true;

    }
    shareTo() {
        Share.share({
            message: '',
            url: this.props.url,
            title: (this.props.filename == undefined) ? '文件分享' : this.props.filename,
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
    componentWillMount() {
        // Toast.show({
        //     type: Toast.mode.C2MobileToastLoading,
        //     title: '请稍后...',
        //     duration: 2000
        // });
    }
    render() {
        const source = { uri: this.props.url };
        return (
            <View style={styles.container}>
                <NavigationBar title="详情查看" faction='center' style={{ borderWidth: 0 }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title={''} faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} />
                    <NavigationBar.NavBarItem faction=' ' />
                </NavigationBar>
                {/* right android-share this.shareTo.bind(this) */}
                <View style={styles.container1}>
                    <Pdf
                        source={source}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        style={styles.pdf} />
                </View>
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
    container1: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
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