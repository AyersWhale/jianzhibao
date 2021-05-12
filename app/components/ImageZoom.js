/**
 * Created by wangdi on 13/11/16.
 */
import React, { Component } from 'react';
import { Share, View, StyleSheet, Dimensions, WebView, ActivityIndicator } from 'react-native';
import { ImageViewer } from 'react-native-image-zoom-viewer'
const images = [];
export default class Component06 extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageViewer
                    imageUrls={[{
                        url: this.props.url,
                    }]}
                    failImageSource={{
                        url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=105735635,1803762039&fm=26&gp=0.jpg',
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').width,
                    }}
                />
            </View>
        );
    }
}