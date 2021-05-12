'use strict'

//系统组件
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Platform,
    Dimensions,
    Keyboard,
} from 'react-native';

import {  Actions, WebView, } from 'c2-mobile';

var WEBVIEW_REF = 'webview';
var DEFAULT_URL = null;
export default class MainWebView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Data: '',
            url: this.props.url ? this.props.url : DEFAULT_URL,
            title: this.props.title ? this.props.title : '',
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
            showLoading: true
        }

    }
    render() {
        return (
            <View style={styles.container} >
                <WebView
                    ref={WEBVIEW_REF}
                    style={styles.webView}
                    source={{ uri: 'http://localhost:8088/assets/appLogin.jsp' }}
                    javaScriptEnabled={true}
                    onLoadStart={() => {
                    }}
                    onLoadEnd={() => {
                        Actions.TabBar({ type: 'replace' })
                     }}
                    onLoad={() => {
                       
                    }}
                    onError={() => {
                        
                    }}
                    automaticallyAdjustContentInsets={false}
                />
            </View >
        )
    }

    onBridgeMessage(message) {
        const { webviewbridge } = this.refs;
        var mes2 = JSON.parse(message);
        var mes3 = mes2.params;
        var mes4 = mes2.businessType;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderColor: '#d7d7d7',
        borderBottomWidth: 1,
    },
    collectionContainer: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: '#edecec',
    },
    itemContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    navigationBar: {
        flexDirection: 'column',
        backgroundColor: 'white',
        borderColor: '#d7d7d7',
        borderBottomWidth: 0.5
    },
    statueBar: {
        height: Platform.OS === 'ios' ? 20 : 0,
    },
    titleBar: {
        flexDirection: 'row',
        height: Platform.OS === 'ios' ? 44 : 44,
    },
    navigationSearchBar: {
        flex: 3,
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: 2,
        marginBottom: 5,
        marginRight: 2,
        borderColor: '#d7d7d7',
        borderWidth: 0.5,
        borderRadius: 5,
    },
    listContainer: {
        backgroundColor: 'white',
    },
    sectionheaderContent: {
        flex: 1,
        paddingLeft: 20,
        paddingBottom: 4,
        marginTop: 20,
    },
    navigationTitle: {
        alignSelf: 'center',
        flex: 2,
        textAlign: 'center',
        fontSize: 18
    },

})