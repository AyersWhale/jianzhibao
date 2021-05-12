/**
* 通讯录收藏界面
* Created by 蒋牧野.
*/
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableHighlight, Image, ScrollView, SectionList, ListView } from 'react-native';
import { TabBar, VectorIcon, Actions, Config } from 'c2-mobile';
import { QySwipeListView } from 'qysyb-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;
var gzt = [
    { 'itemid': '陈援', "phone": "14876536997", "sex": 'W' },
    { 'itemid': '姜磊', "phone": "15478965987", "sex": 'M' },
    { 'itemid': '李玲', "phone": "18564788954", "sex": 'M' },
];
export default class MyCollection extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            listViewData: gzt,
        };

    }

    deleteRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].closeRow();
        const newData = [...this.state.listViewData];
        newData.splice(rowId, 1);
        this.setState({ listViewData: newData });
    }

    cancel(secId, rowId, rowMap) {
        const rowRef = rowMap[`${secId}${rowId}`];
        rowRef.closeRow();
    }
    blink(data) {
        let itemInfo = {
            name: data.itemid,
            phoneNumbers: data.phone
        }
        Actions.ContactInfo({
            dataArray: itemInfo
        })
    }
    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <View style={styles.container}>
                <QySwipeListView
                    dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                    renderRow={data => (
                        <TouchableHighlight
                            onPress={() => this.blink(data)}
                            underlayColor={'#fff'}>
                            <View style={{
                                flex: 1,
                                height: 56,
                                flexDirection: 'row', // 水平布局
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 4,
                                paddingBottom: 4,
                                backgroundColor: 'white',
                                alignItems: 'center',
                                borderBottomColor: '#f5f5f5',
                                borderBottomWidth: 1
                            }}>
                                <View style={{ height: 44, width: 44, borderRadius: 22, backgroundColor: data.sex == "W" ? '#FF8282' : '#3396FB', alignItems: 'center', justifyContent: 'center', }}>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: 'white' }}>{data.itemid.substring(1, 2) != '' ? data.itemid.substring(1, 3) : data.itemid.substring(0, 1)}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', marginLeft: 12, justifyContent: "center" }}>
                                    <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.87, }}>{data.itemid}</Text>
                                    <Text style={{ fontSize: Config.MainFontSize - 2, color: '#000', opacity: 0.54, }}>{data.phone}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )}
                    renderHiddenRow={(data, secId, rowId, rowMap) => (
                        <View style={styles.rowBack}>
                            <TouchableOpacity
                                onPress={_ => this.cancel(secId, rowId, rowMap)}
                                style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                                <Text style={styles.backTextWhite}>还原</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.backRightBtn, styles.backRightBtnRight]}
                                onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                                <Text style={styles.backTextWhite}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    standalone: {
        marginTop: 30,
        marginBottom: 30,
    },
    standaloneRowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        justifyContent: 'center',
        height: 50,
    },
    standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    controls: {
        alignItems: 'center',
        marginBottom: 30,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        paddingVertical: 10,
        width: 100,
    },
});