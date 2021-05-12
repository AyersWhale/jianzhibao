/**
 * 本地通讯录
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, ListView, PixelRatio, Image, TouchableHighlight, SectionList, Alert } from 'react-native';
// import SectionListModule from 'react-native-sectionlist-contacts'
import { Actions, Config } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import { QySearch } from 'qysyb-mobile';

export default class ContactsNative extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataArray: this.props.dataArray,
            stu: 'native',
            listViewData: ''
        }
    }
    detail(result) {
        Actions.ContactInfo({
            dataArray: result
        })
    }
    _renderItem(rowData) {


        return (
            <TouchableHighlight underlayColor='#00000000' onPress={() => this.detail(rowData)}  >
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
                    <View style={{ height: 44, width: 44, borderRadius: 22, backgroundColor: rowData.sex == "W" ? '#FF8282' : '#3396FB', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'white' }}>{rowData.name.substring(1, 2) != '' ? rowData.name.substring(1, 3) : rowData.name.substring(0, 1)}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: 12, justifyContent: "center" }}>
                        <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.87, }}>{rowData.name}</Text>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: '#000', opacity: 0.54, }}>{rowData.phoneNumbers}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )

    }
    showView() {
        if (this.state.stu == "null") {
            return (
                <View style={{ height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../image/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                    <Text style={{ textAlign: 'center', fontSize: Config.MainFontSize, color: '#000', opacity: 0.6, marginTop: 10 }}>当前没有搜索结果～</Text>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {this.state.stu == 'native' ?
                        null : <ListView
                            style={styles.listView}
                            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                            renderRow={this._renderItem.bind(this)}
                        />
                    }
                </View>
            )
        }
    }
    render() {
        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <View style={{ height: 40, marginBottom: 10 }}>
                    <QySearch rowData={this.state.dataArray} //搜索的数据源
                        searchResult={(result) => this.dataSource(result)}  //搜索成功后返回的数据，如何处理需自己处理
                        values={"name"}  //搜索的字段，多个字段在values1={'**'}  valuse2={'**'}
                    />
                </View>
                {this.showView()}
            </View>
        );
    }
    dataSource(result) {
        console.log(result)
        // this.setState({
        //     dataArray: result
        // })
        // this.search(result);
        if (result.length != 0 && result != 'null') {
            this.setState({
                listViewData: result,
                stu: 'search'
            })
        } else if (result == '') {
            this.setState({
                stu: 'native'
            })
        }
        else if (result == 'null') {
            this.setState({
                stu: 'null'
            })
        }
    }
}

const styles = StyleSheet.create({

});