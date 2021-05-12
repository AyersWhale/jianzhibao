/**
 * 公文列表
 * Created by 曾一川.
 */
import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, TextInput, ListView, TouchableOpacity } from 'react-native';
import { NavigationBar, VectorIcon, Actions, Config } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
import theme from '../config/theme';
import underLiner from '../utils/underLiner';

var gsgw = [
    { "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "收文", "date": "10月11日 13:10" },
    { "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "党组织文件", "date": "10月11日 16:20" },
    {  "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "办公室文件", "date": "10月12日 10:10" },
    { "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "党组织文件", "date": "10月13日 15:50" },
    {  "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "党组织文件", "date": "10月12日 16:34" },
    { "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "收文", "date": "10月12日 11:22" },
    { "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "办公室文件", "date": "10月13日 10:24" },
]

export default class DocumentList extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataArray: this.props.dataArray,
            listViewData: gsgw,
            selectNum: '0',
            opened: false,
            topShow:'公司公文'
        }
    }
    _back() {
        Actions.pop();
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            return (
                <View style={styles.container}>
                    <NavigationBar title={this.state.topShow} faction='center' iconSize={15} rightIcon={this.state.opened == true ? 'ios-arrow-up' : 'ios-arrow-down'} onPress={() => this.setState({ opened: (this.state.opened == false) ? true : false })}>
                        <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                        <NavigationBar.NavBarItem faction='right' iconSize={20} style={{ width: 80, paddingRight: 10 }} />
                    </NavigationBar>
                    <TouchableOpacity style={{
                        height: 45,
                        backgroundColor: '#E1E1E1',
                        padding: 8,
                    }} onPress={() => this.getValue()}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',  //水平布局
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: 5,
                        }}>
                            <VectorIcon style={{
                                paddingLeft: 5,
                                paddingRight: 5,
                            }} name={'android-search'} color={'#8E8E93'} size={16} />
                            <Text style={{
                                color: '#8E8E93',
                                textAlign: 'center',
                            }}>{'搜索'}</Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                    <Text style={{ marginTop: 10, color: 'grey', fontSize: Config.MainFontSize - 4, fontWeight: 'bold', backgroundColor: 'transparent', padding: 3,marginLeft:16,paddingBottom:10 }}>2018年10月</Text>
                    </View>
                    <ScrollView style={{marginBottom:70}}>
                        <ListView
                            style={styles.listView}
                            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                            renderRow={this._renderItem.bind(this)}
                        />

                    </ScrollView>
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0.5, height: 60, width: theme.screenWidth, backgroundColor: 'rgb(240,240,240)' }}>
                        <VectorIcon style={{
                            padding: 10

                        }} name={'c2_im_weixin_voice'} color={'#8E8E93'} size={26} />
                        <TextInput
                            ref={"testref"}
                            style={styles.textInput}
                            autoFocus={false}
                            underlineColorAndroid="transparent"
                            blurOnSubmit={true}
                            value={this.state.value}
                        ></TextInput>
                        <VectorIcon style={{
                            padding: 10

                        }} name={'c2_im_weixin_smiley'} color={'#8E8E93'} size={26} />
                        <VectorIcon style={{
                            paddingTop: 10,
                            paddingRight: 10,

                        }} name={'c2_im_weixin_add'} color={'#8E8E93'} size={26} />
                    </View>
                    {this.state.opened == true ?
                        <View style={{ position: 'absolute', width: deviceWidth / 2.5, height: deviceWidth / 2.3, backgroundColor: 'white', borderRadius: 10, alignSelf: 'center', top: 70,borderWidth:0.1,borderColor:'grey' }}>
                            <TouchableOpacity onPress={() => this.setState({topShow:'全部公文',opened:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >全部公文</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({topShow:'党组织文件',opened:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >党组织文件</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({topShow:'办公室文件',opened:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >办公室文件</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({topShow:'收文',opened:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >收文</Text></TouchableOpacity>
                        </View> : null}
                </View>
            );
    }
    getValue() {
        if (this.props.theme == 'select') {
            Actions.SearchMessage({ callback: this.callback.bind(this), theme: 'select' })
        } else {
            Actions.SearchMessage({ theme: '1' })
        }
    }
    _renderItem(rowData) {
        return (
            <View>
            <TouchableOpacity style={{ backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
                    <View style={{ width: theme.screenWidth, backgroundColor: 'white', borderRadius: 5 }}>
                        <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize: Config.MainFontSize - 4,padding:5,color:'grey',marginLeft:12}}>{rowData.type}</Text>
                        <Text style={{fontSize: Config.MainFontSize - 4,padding:5,right:10,color:'grey',position:'absolute'}}>{rowData.date}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                        <View style={{backgroundColor:'red',width:8,height:8,borderRadius:10,marginLeft:5,marginTop:8}}/>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'black',marginLeft:5, paddingTop: 5,paddingRight: 10,paddingBottom: 10, marginRight: 15, borderRadius: 20 }}>{rowData.details}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={underLiner.liners} />
            </View>
        )

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
        backgroundColor: '#f6f6f6'
    },
    imageBackground: {
        height: 187,
        resizeMode: 'cover',
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
    textInput: {
        height: 30,
        width: deviceWidth - 300,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        fontSize: Config.MainFontSize - 2,
        borderRadius: 5,
        marginTop: 8,
        paddingLeft: 5,
    },


});