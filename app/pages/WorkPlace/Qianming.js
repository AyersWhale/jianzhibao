/**
 * 签名板
 * 
 * 开发者：伍钦
 */
import React, {
    Component
} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    Alert, DeviceEventEmitter,
} from 'react-native';
import {
    Paint,
    UUID,
    VectorIcon,
    Actions,
    Config,
    SafeArea,
    Fetch,
    FileManager,
    Toast
} from 'c2-mobile'
import Toasts from 'react-native-root-toast';
const deviceWidth = Dimensions.get('window').width;
export default class Qianming extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mode: 1,
            remark1: '',
            signRes: '',
        }

        this._clear = this._clear.bind(this);
        this._undo = this._undo.bind(this);
        this._redo = this._redo.bind(this);
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>签名板</Text>
                    </View>
                </ImageBackground>
                {this.state.source == null ? null : <Image source={this.state.source} style={{ width: 200, height: 200 }} />}
                <Paint ref={"C2Paint"} style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }} color={'black'} weight={20} mode={this.state.mode == 1 ? Paint.CommonMode : Paint.EraserMode}>
                </Paint>
                <View style={{ height: 50, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1, alignSelf: 'center' }} onPress={() => { this._clear() }}>
                        <Text style={{ textAlign: 'center' }}>重签</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, alignSelf: 'center' }} onPress={() => { this._getPic() }}>
                        <Text style={{ textAlign: 'center' }}>提交</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _clear() {
        this.refs.C2Paint.clear();
    }

    _undo() {
        this.refs.C2Paint.undo();
    }

    _redo() {
        this.refs.C2Paint.redo();
    }

    _getPic() {
        Toast.show({
            type: Toast.mode.C2MobileToastLoading,
            title: '提交中...'
        });
        var entity = '';
        var businessType = (this.props.workType == 'FQRZ') ? 'FQRZ_YFQMZ' : (this.props.workType == 'LWPQ') ? 'LWPQ_YFQMZ' : (this.props.workType == 'LSYG') ? 'LSYG_YFQMZ' : 'FQRZ_YFQMZ';
        var businessKey = this.props.id;
        this.refs.C2Paint.getPic()
            .then((response1) => {
                Toast.dismiss();
                // debugger
                var path = Config.mainUrl + '/iframefile/qybdirprocess/upload?businessType=' + businessType + "&businessKey=" + businessKey;
                var params = {
                    source: response1,
                    url: path,
                    formData: {
                        businessType: businessType,
                        businessKey: businessKey
                    },
                    header: {
                        Authorization: 'Bearer '
                    },
                    progress: (events) => { }
                }
                FileManager.uploadFile(params)
                    .then((respones) => {
                        // Toasts.show('上传成功', { position: -20 })
                        this.setState({ signRes: respones.data.msg })
                        entity = {
                            id: this.props.id,
                            remark1: respones.data.url,
                            workType: this.props.workType,
                            personId: this.props.personId
                        }
                        console.log(entity)
                    }).catch((e) => {
                        Toasts.show(JSON.stringify(e), {
                            position: -20
                        })
                    });

                Alert.alert("提示", "您确定签约吗？", [{
                    text: "取消",
                    onPress: () => { }
                },
                {
                    text: "确定",
                    onPress: () => {
                        if (this.state.signRes == "成功") {
                            // debugger
                            Fetch.postJson(Config.mainUrl + '/Contract/contractQd?map=' + JSON.stringify(entity))
                                .then((res) => {
                                    console.log(res)
                                    if (res.result == 'success') {
                                        DeviceEventEmitter.emit('yiqian');
                                        Alert.alert("提示", "签约成功！", [{
                                            text: "确定",
                                            onPress: () => {
                                                Actions.pop({
                                                    refresh: {
                                                        test: UUID.v4()
                                                    }
                                                });
                                            }
                                        }])
                                    } else {
                                        Toasts.show(res.msg, {
                                            position: -80
                                        })
                                    }

                                }).catch((e) => {
                                    Toasts.show(e.description, {
                                        position: -80
                                    })
                                });
                        } else {
                            Alert.alert("提示", "正在上传签名照中 请稍后重试！", [{
                                text: "确定",
                            }])
                        }
                    }
                }
                ])

            })

    }
}