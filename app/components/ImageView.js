/**
 * Created by wangdi on 13/11/16.
 */
import React from 'react';
import { Dimensions, View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { NavigationBar, Actions, Toast } from 'c2-mobile';
import { QyLightbox, QyCarousel } from 'qysyb-mobile';
import PageComponent from '../pages/BackPageComponent';
const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 10;

export default class ImageView extends PageComponent {
    constructor(props) {
        super(props);
        this.state = {

        };

    }
    renderCarousel = () => (
        <QyCarousel style={{ width: WINDOW_WIDTH, height: WINDOW_WIDTH }}>
            <Image
                style={{ flex: 1 }}
                resizeMode="contain"
                source={{ uri: this.props.url }}
            />
            <View style={{ backgroundColor: '#6C7A89', flex: 1 }} />
            <View style={{ backgroundColor: '#019875', flex: 1 }} />
            <View style={{ backgroundColor: '#E67E22', flex: 1 }} />
        </QyCarousel>
    )

    render() {
        return (
            <ScrollView style={styles.container} >
                {/* <NavigationBar title="图片查看" faction='center' style={{ borderWidth: 0 }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="返回" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={13} size={15} />
                    <NavigationBar.NavBarItem faction='right' />
                </NavigationBar> */}
                <View style={styles.text}><Text>  </Text></View>
                <QyLightbox springConfig={{ tension: 15, friction: 7 }} swipeToDismiss={false} renderContent={this.renderCarousel}>
                    <Image
                        style={styles.carousel}
                        resizeMode="contain"
                        source={{ uri: this.props.url }}
                    />
                </QyLightbox>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: BASE_PADDING,
    },
    closeButton: {
        color: 'white',
        borderWidth: 1,
        borderColor: 'white',
        padding: 8,
        borderRadius: 3,
        textAlign: 'center',
        margin: 10,
        alignSelf: 'flex-end',
    },
    customHeaderBox: {
        height: 150,
        backgroundColor: '#6C7A89',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        marginLeft: -BASE_PADDING,
        marginRight: -BASE_PADDING,
    },
    col: {
        flex: 1,
    },
    square: {
        width: WINDOW_WIDTH / 2,
        height: WINDOW_WIDTH / 2,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    squareFirst: {
        backgroundColor: '#C0392B',
    },
    squareSecond: {
        backgroundColor: '#019875',
    },
    squareText: {
        textAlign: 'center',
        color: 'white',
    },
    carousel: {
        height: WINDOW_WIDTH - BASE_PADDING * 2,
        width: WINDOW_WIDTH - BASE_PADDING * 2,
        backgroundColor: 'white',
    },
    contain: {
        flex: 1,
        height: 150,
    },
    text: {
        marginVertical: BASE_PADDING * 2,
    },
});