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
import { Toast, Fetch, Config, Actions, VectorIcon, ImagePicker, FileManager, ActionSheet, Camera } from 'c2-mobile';
const mTop = px2dp(Platform.OS == "ios" ? 64 : 44)
const { width, height } = Dimensions.get('window');
let mwidth = 100;
let mheight = 120;
const marginTop = mTop;

export default class MorePopWidows extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: null,
            uploadText: '没有图片需要上传',
            status: true
        }
    }
    _camera() {
        Camera.startWithPhoto({ maskType: 0 })
            .then((response) => {
                this.setState({
                    imageSource: response,
                    uploadText: response.uri,
                    status: false,
                });
            })
            .catch((e) => {
                console.log(e);
            })
    }
    circle() {
        this.props.closeModal();
        Actions.Kaoqin()
    }
    scan() {
        this.props.closeModal();
        Actions.ScanCode();

    }
    info() {
        this.props.closeModal();
        Actions.About();
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
                        <TouchableOpacity activeOpacity={1} onPress={this.scan.bind(this)} style={styles.itemView}>
                            <VectorIcon name={'qr-scanner'} style={styles.iconStart} />
                            <Text style={styles.textStyle}>扫一扫</Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#fff', height: 1, width: 90 }} />
                        {/* <SpacingView /> */}
                        <TouchableOpacity activeOpacity={1} onPress={this.circle.bind(this)} style={styles.itemView}>
                            <VectorIcon name={'th_list'} style={styles.iconStart} />
                            <Text style={styles.textStyle}>考勤打卡</Text>
                        </TouchableOpacity>
                        <View style={{ backgroundColor: '#fff', height: 1, width: 90 }} />
                        <TouchableOpacity activeOpacity={1} onPress={this.info.bind(this)} style={styles.itemView}>
                            <VectorIcon name={'info_sign'} style={styles.iconStart} />
                            <Text style={styles.textStyle}>版本信息</Text>
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
        backgroundColor: '#696969',
        width: mwidth,
        height: mheight,
        position: 'absolute',
        left: width - mwidth - 10,
        top: marginTop + 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    itemView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 5,
    },
    textStyle: {
        color: '#fff',
        fontSize: 14,
        marginRight: 5
    },
    imgStyle: {
        width: 20,
        height: 20,
    },
    iconStart: {
        fontSize: 20,
        color: '#fff',
        marginRight: 5
    },
});