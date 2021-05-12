//点击下拉框弹出


import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import px2dp from '../utils/px2dp';
import { Toast, Fetch, Config, QuickSearch, Actions, VectorIcon, ImagePicker, FileManager, ActionSheet, Camera } from 'c2-mobile';
const mTop = px2dp(Platform.OS == "ios" ? 64 : 44)
const { width, height } = Dimensions.get('window');
let mwidth = 167;
let mheight = 96;
const marginTop = mTop;
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class MoreContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null,
            uploadText: '没有图片需要上传',
            status: true
        }
        this.star = this.star.bind(this)
        this.share = this.share.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ isVisible: nextProps.show });
    }

    star() {
        this.props.star();
    }
    share() {
        this.props.share();
    }

    Modal() {
        const { visible } = this.props;

        return (
            <Modal
                transparent={true}
                visible={visible}
                animationType={'fade'}
                onRequestClose={() => this.props.closeModal()}>
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.props.closeModal()}>
                    <View style={styles.modal}>
                        <TouchableOpacity activeOpacity={1} onPress={this.star.bind(this)} style={styles.itemView}>
                            <VectorIcon name={'star2'} style={styles.iconStart} />
                            <Text style={styles.textStyle}>添加到关注</Text>
                        </TouchableOpacity>
                        {/* <SpacingView /> */}
                        <TouchableOpacity activeOpacity={1} onPress={this.share.bind(this)} style={styles.itemView}>
                            <VectorIcon name={'share3'} style={styles.iconStart} />
                            <Text style={styles.textStyle}>分享</Text>
                        </TouchableOpacity>

                    </View>
                </TouchableOpacity>

            </Modal>
        );
    }
    render() {
        return (
            <View>
                {this.Modal()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    modal: {
        backgroundColor: '#fff',
        width: mwidth,
        height: mheight,
        position: 'absolute',
        left: width - mwidth - 10,
        top: marginTop + 10,
        padding: 5,
        borderRadius: 3,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        shadowColor: '#b3b4b7',
        elevation: 2,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 5,
    },
    textStyle: {
        color: '#000',
        fontSize: 14,
        marginLeft: 16
    },
    imgStyle: {
        width: 20,
        height: 20,
    },
    iconStart: {
        fontSize: 20,
        color: '#3396FB',
        marginRight: 5
    },
});