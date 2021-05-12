/**
 * 合同附件列表
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ListView, Image, Platform, Alert } from 'react-native';
import { Actions, Config, FileManager, Toast } from 'c2-mobile';
import theme from '../config/theme';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;

export default class ContactFj extends Component {


    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            listViewData: this.props.dataSource,
        }
    }
    formatFileSize(bytSize) {
        if (!bytSize) {
            return "0 Bytes";
        }
        var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
        var index = 0;
        //读数，即单位前面的数字
        var readings = parseFloat(bytSize);
        while (readings > 1024) {
            index += 1;
            readings = readings / 1024;
        }
        return readings.toFixed(2) + " " + unitArr[index];
    }

    render() {
        return (
            <View>
                <ListView
                    style={styles.listView}
                    dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                    renderRow={this._renderItem.bind(this)}
                />
            </View>
        );
    }
    deal(rowData) {
        if (rowData.type == 'PDF' || rowData.type == 'pdf') {
            Actions.PDFWebView({ url: Config.mainUrl + '/' + rowData.path })
        } else if (rowData.type == 'jpg' || rowData.type == 'png' || rowData.type == 'JPG' || rowData.type == 'PNG') {
            if (Platform.OS == 'ios') {
                Actions.C2WebView({ url: Config.mainUrl + '/' + rowData.path })
            } else {
                Actions.ImageZoom({ url: Config.mainUrl + '/' + rowData.path })
            }
        } else if (rowData.type == 'docx' || rowData.type == 'doc') {
            Alert.alert('温馨提示', '当前格式在手机端不支持查看,请去PC端查看', [{
                text: '好的', onPress: () => {

                }
            }])
            // Toast.showInfo('附件下载中,请稍等···', 2000);
            // var source = { uri: Config.mainUrl + '/' + rowData.path }
            // var params = {
            //     source: source,
            //     dirMode: FileManager.DirMode.cache,
            //     header: {},
            // }
            // FileManager.downloadFile(params, FileManager.DirMode.cache,
            //     (events) => {
            //     }).then((respones) => {
            //         if (respones) {
            //             FileManager.openFile(respones)
            //                 .then((response) => {
            //                     Toast.dismiss();
            //                 })
            //                 .catch((e) => {
            //                     console.warn(e)
            //                     Toast.dismiss();
            //                     Toast.showInfo('查看失败，文件已失效或损坏', 1000);
            //                 })
            //         }
            //     }).catch((e) => {
            //         Toast.dismiss();
            //         console.warn(e)
            //         Toast.showInfo('查看失败，文件已失效或损坏', 1000);
            // })
        } else {
            Toast.showInfo('无法打开该文件,请检查格式是否正确', 2000);
        }
    }
    _renderItem(rowData) {
        return (
            <TouchableOpacity onPress={() => this.deal(rowData)}>
                <View style={{ backgroundColor: '#fff', flex: 1, marginBottom: 5 }}>
                    <View style={{ marginRight: 2 }}>
                        <Text numberOfLines={1} style={{ marginLeft: 20, fontSize: 20, color: '#000', marginTop: 10 }}>
                            {rowData.name}</Text>
                    </View>
                    <View>
                        <Text style={{ marginLeft: 20, fontSize: 14, color: ' #c4c4c4', marginTop: 10 }}>
                            {"大小" + ":" + "   " + this.formatFileSize(rowData.size)}</Text>
                    </View>
                </View>
                {/* <Text style={{ color: '#000', fontSize: 16, marginLeft: 10, marginTop: 10 }} numberOfLines={1}>{rowData.name}</Text> */}
            </TouchableOpacity>
        )

    }

}

const styles = StyleSheet.create({

});

