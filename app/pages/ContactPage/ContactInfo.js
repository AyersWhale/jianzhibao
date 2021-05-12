/**
 * 通讯录详细界面
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, Linking, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import MoreContact from '../../utils/MoreContact';
import { NavigationBar, Config, Actions, VectorIcon, UserInfo } from 'c2-mobile';
let colorNumber = ["#FFD39B", "#FFB6C1", "#EED5D2", "#B2DFEE", "#87CEFF", "#9370DB", "#CD69C9"]
const deviceWidth = Dimensions.get('window').width;

export default class ContactInfo extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无
        this.state = {
            dataArray: this.props.dataArray,
            showPop: false,
        }
    }
    _back() {
        Actions.pop();
    }
    onCall(phoneNum) {
        let url;
        if (Platform.OS !== 'android') {
            url = 'telprompt:' + phoneNum;
        } else {
            url = 'tel:' + phoneNum;
        }
        Linking.openURL(url);
    }
    onMessage(phoneNum) {
        let url;
        if (Platform.OS !== 'android') {
            url = 'smsto:' + phoneNum;
        } else {
            url = 'smsto:' + phoneNum;
        }
        Linking.openURL(url);
    }
    onCall_Clipboard(phoneNum) {
        // Clipboard.setString(phoneNum);
        // Toasts.show('复制成功', { position: px2dp(-80) });
        let url;
        if (Platform.OS !== 'android') {
            url = 'mailto:' + phoneNum;
        } else {
            url = 'mailto:' + phoneNum;
        }
        Linking.openURL(url);
    }
    share() {
        this.setState({ showPop: false })
        Actions.Kaoqin()
    }
    star() {
        this.setState({ showPop: false })
        Actions.Kaoqin()
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 11, backgroundColor: Config.C2NavigationBarTintColor }} />
                <NavigationBar title="联系人详情" faction='center' >
                    <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem faction='right' rightIcon={'ios-more'} iconSize={28} style={{ width: 80, paddingRight: 10 }} onPress={() => this.setState({ showPop: true })} />
                </NavigationBar>
                <MoreContact
                    visible={this.state.showPop}
                    share={this.share.bind(this)}
                    star={this.star.bind(this)}
                    closeModal={() => {
                        this.setState({ showPop: false }); return null;
                    }} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: '#fff', flexDirection: 'row', height: 96 }}>
                        < View style={{ flexDirection: 'column', marginTop: 16, marginLeft: 16 }}>
                            <Text style={{ fontSize: Config.MainFontSize + 6, fontWeight: 'bold', }}>{this.props.dataArray.name}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, opacity: 0.54, marginTop: 10 }}>{this.props.dataArray.dept}</Text>
                        </View>
                        {this.props.dataArray.img != '' ? <Image source={{ uri: this.props.dataArray.img }} style={{ position: 'absolute', right: 15, width: 72, height: 72, borderRadius: 36, marginTop: 10 }} />
                            : <Image source={require('../../image/center_header_img150x150.png')} style={{ position: 'absolute', right: 15, width: 72, height: 72, borderRadius: 36, marginTop: 10 }} />}
                    </View>
                    <View style={{ backgroundColor: '#f5f5f5', height: 16, width: deviceWidth }} />
                    <View style={{ backgroundColor: '#fff' }}>
                        <TouchableOpacity onPress={() => this.onCall_Clipboard(this.props.dataArray.email)} style={{ backgroundColor: '#fff', height: 48, flexDirection: 'row' }}>
                            <VectorIcon name='email' size={20} style={{ alignSelf: 'center', marginLeft: 16, color: '#999' }} />
                            <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, opacity: 0.8, marginLeft: 20 }}>{this.props.dataArray.email}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, marginLeft: 16, width: deviceWidth - 16, backgroundColor: '#f5f5f5' }} />
                        <TouchableOpacity onPress={() => this.onCall_Clipboard(this.props.dataArray.phoneNumbers)} style={{ backgroundColor: '#fff', height: 48, flexDirection: 'row' }}>
                            <VectorIcon name='phone_android' size={20} style={{ alignSelf: 'center', marginLeft: 16, color: '#999' }} />
                            <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, opacity: 0.8, marginLeft: 20 }}>{this.props.dataArray.phoneNumbers}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, marginLeft: 16, width: deviceWidth - 16, backgroundColor: '#f5f5f5' }} />
                        <TouchableOpacity onPress={() => this.onCall_Clipboard(this.props.dataArray.phoneNumbers)} style={{ backgroundColor: '#fff', height: 48, flexDirection: 'row' }}>
                            <VectorIcon name='phone2' size={20} style={{ alignSelf: 'center', marginLeft: 16, color: '#999' }} />
                            <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, opacity: 0.8, marginLeft: 20 }}>{this.props.dataArray.telNumbers}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, marginLeft: 16, width: deviceWidth - 16, backgroundColor: '#f5f5f5' }} />
                        <View style={{ backgroundColor: '#fff', height: 48, flexDirection: 'row' }}>
                            <VectorIcon name='c2_location_solid' size={20} style={{ alignSelf: 'center', marginLeft: 16, color: '#999' }} />
                            <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, opacity: 0.8, marginLeft: 20 }}>{this.props.dataArray.dept}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: '#fff', height: 48, flexDirection: 'row' }}>
                        <VectorIcon name='pencil' size={20} style={{ alignSelf: 'center', marginLeft: 16, color: '#999' }} />
                        <Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, opacity: 0.8, marginLeft: 20 }}>{this.props.dataArray.remark}</Text>
                    </View>



                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, height: 56, backgroundColor: '#fff', flexDirection: 'row', flex: 1 }}>
                    <TouchableOpacity onPress={() => this.onCall_Clipboard(this.props.dataArray.email)}>
                        <View style={{ height: 40, width: deviceWidth / 3 - 11, marginTop: 8, marginLeft: 16 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <VectorIcon name='c2_location_solid' size={20} style={{ alignSelf: 'center', color: '#3396FB', marginTop: 12 }} />
                                <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize, marginTop: 12 }}>发邮件</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onCall(this.props.dataArray.phoneNumbers)}>
                        <View style={{ height: 40, width: deviceWidth / 3 - 11, marginTop: 8, marginLeft: 11 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <VectorIcon name='c2_location_solid' size={20} style={{ alignSelf: 'center', color: '#3396FB', marginTop: 12 }} />
                                <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize, marginTop: 12 }}>打电话</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onMessage(this.props.dataArray.phoneNumbers)}>
                        <View style={{ height: 40, width: deviceWidth / 3 - 11, marginTop: 8, marginLeft: 11 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <VectorIcon name='c2_location_solid' size={20} style={{ alignSelf: 'center', color: '#3396FB', marginTop: 12 }} />
                                <Text style={{ marginLeft: 10, fontSize: Config.MainFontSize, marginTop: 12 }}>发短信</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View >

        );
    }
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        width: 160,
        height: 160,
        borderRadius: 80,
        alignSelf: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    imageBackground: {
        height: 187,
        resizeMode: 'cover',
    },
    titleImg: {
        fontSize: Config.MainFontSize + 2,
        color: 'white',
    },
    image1: {
        height: (Platform.OS === 'android') ? Dimensions.get('window').height / 5 : Dimensions.get('window').height / 4.5,
        width: Dimensions.get('window').width,
        resizeMode: 'cover'
    },
    imageUser: {
        resizeMode: 'contain',
        marginTop: 70,
        marginLeft: 30,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#CECECE',
        flexDirection: 'column',  //水平布局
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',  //水平布局
        height: 45,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#CECECE',
    },
    title: {
        flex: 1,
        fontSize: Config.MainFontSize - 2,
        textAlign: 'left',
        color: '#0A0A0A',
        marginLeft: 16,
    },
    content: {
        fontSize: Config.MainFontSize - 3,
        color: '#969696',
        marginRight: 16
    },
    buttonSendMessage: {
        height: 44,
        marginLeft: 60,
        marginRight: 60,
        marginTop: 30,
        backgroundColor: '#EE3E5F',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: Config.MainFontSize - 3,
    },
    buttonSetting: {
        height: 44,
        marginLeft: 60,
        marginRight: 60,
        marginTop: 12,
        backgroundColor: '#E1E1E1',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTextSetting: {
        color: 'black',
        fontSize: Config.MainFontSize - 3,
    },
    tabbar: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
});