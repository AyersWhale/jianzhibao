import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, PixelRatio, Image } from 'react-native';
import px2dp from '../../utils/px2dp';
import { Config } from 'c2-mobile';

export default class Ewm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title ? this.props.title : '',
        }
    }

    render() {
        return (

            <View style={styles.container}>
                <View style={{ backgroundColor: 'white', justifyContent: 'center', textAlign: 'center', marginTop: 40, }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', textAlign: 'center', marginTop: 5, }}>
                        <Image source={require('../../image/ewm.png')} style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 20 }} />
                        <Text style={{ textAlign: 'center', marginTop: 5, color: "#c4c4c4", marginTop: 30, fontSize: Config.MainFontSize, }}>扫一扫上面的二维码下载APP</Text>
                    </View>
                </View>
            </View>
        );
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

    list: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#c4c4c4',

    },
    listItem: {
        flex: 1,
        height: px2dp(47),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        borderBottomColor: '#e4e4e4',
        borderBottomWidth: 1 / PixelRatio.get()
    },
    ditGroup: {
        margin: px2dp(0)
    }
});