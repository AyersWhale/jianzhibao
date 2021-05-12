/**
 * 通讯录群组界面（加入过的）
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, TouchableOpacity, Image, ScrollView, SectionList, Alert } from 'react-native';

import { QySearch } from 'qysyb-mobile';
// import NestedListView from 'react-native-nested-listview';
import { Config, VectorIcon, Actions } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeigth = Dimensions.get('window').height;

export default class QyContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataArray: [
                { name: '企业事业部', dept: '企业事业部', items: [{ name: '李丽华', phoneNumbers: "123456789", sex: "W", dept: '企业事业部' }, { name: '伍钦', phoneNumbers: "123456789", sex: "M", dept: '企业事业部' }, { name: '陈威', phoneNumbers: "123456789", sex: "W", dept: '企业事业部' }, { name: '曹卓', phoneNumbers: "123456789", sex: "W", dept: '企业事业部' }] },
                { name: '人力资源部', dept: '人力资源部', items: [{ name: 'AAAA', phoneNumbers: "123456789", dept: '人力资源部' }, { name: 'BBBB', phoneNumbers: "123456789", dept: '人力资源部' }] },
                { name: '财务部', dept: '财务部', items: [{ name: 'CCC', phoneNumbers: "123456789", dept: '财务部' }, { name: 'DDD', phoneNumbers: "123456789", dept: '财务部' }, { name: 'EEEE', phoneNumbers: "123456789", dept: '财务部' }, { name: 'FFFF', phoneNumbers: "123456789", dept: '财务部' }, { name: 'GGGG', phoneNumbers: "123456789", dept: '财务部' }, { name: 'HHHH', phoneNumbers: "123456789", dept: '财务部' }] },
                { name: '电子渠道部', dept: '电子渠道部', items: [{ name: 'aaaa', phoneNumbers: "123456789", dept: '电子渠道部' }, { name: 'bbbb', phoneNumbers: "123456789", dept: '电子渠道部' }, { name: 'cccc', phoneNumbers: "123456789", dept: '电子渠道部' }, { name: 'dddd', phoneNumbers: "123456789", dept: '电子渠道部' }] },
                { name: '电子政务部', dept: '电子渠道部', items: [{ name: 'eeee', phoneNumbers: "123456789", dept: '电子渠道部' }, { name: 'ffff', phoneNumbers: "123456789", dept: '电子渠道部' }, { name: 'gggg', phoneNumbers: "123456789", dept: '电子渠道部' }, { name: 'hhhh', phoneNumbers: "123456789", dept: '电子渠道部' }] },
            ],
        }
    }
    renderNode = (node, level) => {
        const paddingLeft = 20
        const backgroundColor = 'white'
        return (
            <View style={[{
                flex: 1,
                padding: 10,
                borderWidth: 1,
                borderColor: '#F5F5F5',
            }, { backgroundColor, paddingLeft }]}>
                <View style={{ flexDirection: 'row' }}>
                    {!node.phoneNumbers ? < View style={{


                        flexDirection: 'row',
                        backgroundColor: "#fff",

                        alignItems: 'center',
                        width: Dimensions.get('window').width,

                    }}>
                        <Text style={{ fontSize: Config.MainFontSize, opacity: 0.87, color: '#000' }}>{node.name + "  (" + node.items.length + ")"}</Text>
                        {node.opened == false ? <VectorIcon name='ios-arrow-right' size={20} style={{ alignSelf: 'center', position: 'absolute', right: 30 }} />
                            : <VectorIcon name='ios-arrow-down' size={20} style={{ alignSelf: 'center', position: 'absolute', right: 30 }} />}
                    </View> :
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ height: 44, width: 44, borderRadius: 22, backgroundColor: node.sex == "W" ? '#FF8282' : '#3396FB', alignItems: 'center', justifyContent: 'center', }}>
                                <Text style={{ fontSize: MainFontSize - 2, color: 'white' }}>{node.name.substring(1, 2) != '' ? node.name.substring(1, 3) : node.name.substring(0, 1)}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', marginLeft: 12 }}>
                                <Text style={{ fontSize: Config.MainFontSize, color: '#000', opacity: 0.87, }}>{node.name}</Text>
                                <Text style={{ fontSize: Config.MainFontSize - 2, color: '#000', opacity: 0.54, }}>{node.phoneNumbers}</Text>
                            </View>
                        </View>
                    }


                </View>
            </View>
        )
    }

    dataSource(result) {
        console.log(result)
        // this.setState({
        //     dataArray: result
        // })
    }
    render() {
        return (
            <View style={{ backgroundColor: '#FFF', flex: 1 }}>
                <View style={{ height: 40, marginBottom: 10 }}>
                    <QySearch rowData={this.state.dataArray[0].items} //搜索的数据源
                        searchResult={this.dataSource.bind(this)}  //搜索成功后返回的数据，如何处理需自己处理
                        values={"name"}  //搜索的字段，多个字段在values1={'**'}  valuse2={'**'}
                    />
                </View>
                <View style={{ height: 32, backgroundColor: '#f5f5f5', }}>
                    <Text style={{ marginLeft: 15, fontSize: 12, opacity: 0.54, marginTop: 8 }}>部门联系人</Text>
                </View>
                {this.MapList()}
            </View>
        );

    }
    MapList() {
        const paddingLeft = 20
        const backgroundColor = 'white';
        var node = this.state.dataArray;
        var temp = [];
        for (let i in node) {
            temp.push(
                <View style={[{ padding: 10, borderWidth: 1, borderColor: '#F5F5F5', }, { backgroundColor, paddingLeft }]} >
                    <View style={{ flexDirection: 'row' }}>
                        < TouchableOpacity onPress={this.selectItem.bind(this, i)} style={{ flexDirection: 'row', backgroundColor: "#fff", alignItems: 'center', width: Dimensions.get('window').width, }}>
                            <Text style={{ fontSize: Config.MainFontSize, opacity: 0.87, color: '#000' }}>{node[i].name + "  (" + node[i].items.length + ")"}</Text>
                            {node[i].opened ? <VectorIcon name='ios-arrow-down' size={20} style={{ alignSelf: 'center', position: 'absolute', right: 30 }} />
                                : <VectorIcon name='ios-arrow-right' size={20} style={{ alignSelf: 'center', position: 'absolute', right: 30 }} />}
                        </TouchableOpacity>
                    </View>
                    {(node[i].opened) ? this.showItem(node[i].items) : null}
                </View>
            )
        }
        return temp;

    }
    selectItem(i) {
        this.state.dataArray[i].opened = !this.state.dataArray[i].opened
        this.setState({
            dataArray: this.state.dataArray
        })
    }
    showItem(node) {
        var temp = [];
        if (node.length == 0) { return null } else {
            for (let i in node) {
                temp.push(
                    <TouchableOpacity onPress={this.itemsClick.bind(this, node[i])} style={{ flexDirection: 'row', margin: 10 }}>
                        <View style={{ height: 44, width: 44, borderRadius: 22, backgroundColor: node[i].sex == "W" ? '#FF8282' : '#3396FB', alignItems: 'center', justifyContent: 'center', }}>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: 'white' }}>{node[i].name.substring(1, 2) != '' ? node[i].name.substring(1, 3) : node[i].name.substring(0, 1)}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', marginLeft: 12, justifyContent: "center" }}>
                            <Text style={{
                                fontSize: Config.MainFontSize, color: '#000', opacity: 0.87,
                            }}>{node[i].name}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 2, color: '#000', opacity: 0.54, }}>{node[i].phoneNumbers}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
            return temp

        }
    }
    itemsClick(result) {
        Actions.ContactInfo({
            dataArray: result,
        })
    }
}

const styles = StyleSheet.create({

});