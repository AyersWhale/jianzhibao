/**
 * 对话框详情
 * Created by 曾一川.
 */
import React, { Component } from 'react';
import { View, Text, Dimensions, Image, ScrollView, ImageBackground, StyleSheet, Platform, TextInput, ListView, TouchableOpacity } from 'react-native';
import { NavigationBar, VectorIcon, Actions, SegmentedControl, Config } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
import theme from '../config/theme';
import Inform1 from './Inform1';
import Inform2 from './Inform2';
import underLiner from '../utils/underLiner';

var gsgw = [
    { "content": "[公司文件]关于启动2019年度战略计划预算编制工作的通知", "time": "10-11 10:03", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "收文", "date": "10月11日" },
    { "content": "[收文]行业省级工业公司现代企业制度培训班通知", "time": "10-11 10:04", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "党组织文件", "date": "10月11日" },
    { "content": "[公司文件]公司关于报送行业物流信息化工作开展情况的通知", "time": "昨天 10:10", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "办公室文件", "date": "10月12日" },
    { "content": "[公司文件]杂志社有限公司工作座谈会的工作通知", "time": "昨天 10:15", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "党组织文件", "date": "10月13日" },
    { "content": "[公司文件]关于启动2019年度战略计划预算编制工作的通知", "time": "今天 10:20", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "党组织文件", "date": "10月12日" },
    { "content": "[收文]关于启动2019年度战略计划预算编制工作的通知", "time": "今天 13:50", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "收文", "date": "10月12日" },
    { "content": "[收文]关于启动2019年度战略计划预算编制工作的通知", "time": "今天 16:03", "details": "湖南中烟工业有限责任公司安全生产委员会关于组织开展2018年安全目标管理考核下半年安全检查", "type": "办公室文件", "date": "10月13日" },
]

export default class CongversationInfo extends Component {
    constructor(props) {
        super(props);
        //name字段必须,其他可有可无
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataArray: this.props.dataArray,
            listViewData: gsgw,
            selectNum: '0',
            opened: false,
            topShow:'公司公文',
            theme:'1',
            showTheme:false,
        }
    }
    _back() {
        Actions.pop();
    }

    render() {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        if (this.props.dataArray.type == 'conversation') {
            return (
                <View style={styles.container}>
                    <NavigationBar title={this.props.dataArray.name} faction='center' >
                        <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                        <NavigationBar.NavBarItem faction='right' iconSize={20} style={{ width: 80, paddingRight: 10 }} />
                    </NavigationBar>

                    <ScrollView>
                        <ImageBackground style={{ width: theme.screenWidth, height: theme.screenHeight, }} source={require('../image/theme1.png')}>
                            <View style={{ backgroundColor: 'transparent', alignContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: Config.MainFontSize - 4, color: '#E8E8E8', fontWeight: 'bold' }}>{this.props.dataArray.time}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Image source={this.props.dataArray.source} style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 10, marginTop: 5 }} />
                                <View style={{ marginLeft: 10, alignContent: 'center', borderRadius: 4, alignItems: 'center', alignSelf: 'center' }}>
                                    <Text style={{ marginLeft: 12, marginLeft: 2, fontSize: Config.MainFontSize - 2, color: 'black', padding: 10, maxWidth: theme.screenWidth - 100 }}>{this.props.dataArray.conversation}</Text>
                                </View>
                            </View>
                        </ImageBackground>

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

                </View>
            );

        } else if (this.props.dataArray.type == 'card') {
            return (
                <View style={styles.container}>
                    <NavigationBar title={this.props.dataArray.name} faction='center' >
                        <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                        <NavigationBar.NavBarItem faction='right' iconSize={20} style={{ width: 80, paddingRight: 10 }} />
                    </NavigationBar>

                    <ScrollView>
                        <View style={{ width: deviceWidth, backgroundColor: '#fff' }}  >
                            <SegmentedControl
                                ref={'C2SegmentedControl'}
                                itemDatas={[{ name: '待办' }, { name: '通知:全部消息' }]}
                                hasChanged={this._SelectPlanItem.bind(this)}
                                tintColor={'rgb(22,131,251)'}
                            />
                        </View>
                        {
                            this.state.selectNum == '1' ? <Inform1 /> :
                                this.state.selectNum == '0' ? <Inform2 /> :
                                    null
                        }


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

                </View>
            );


        } else if (this.props.dataArray.type == 'inform') {
            return (<View style={styles.container}>
                {(this.state.theme==1)? <View>
                <NavigationBar title={this.state.topShow} faction='center' iconSize={15} rightIcon={this.state.opened == true ? 'ios-arrow-up' : 'ios-arrow-down'} onPress={() => this.setState({ opened: (this.state.opened == false) ? true : false })}>
                    <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem faction='right' iconSize={20} rightIcon={'android-settings'} style={{ width: 80, paddingRight: 10 }}  onPress={() => this.setState({ showTheme: (this.state.showTheme == false) ? true : false })}/>
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
                    {this.state.showTheme == true ?
                   <View style={{ position: 'absolute',  backgroundColor: 'white', right:10, top: 60,borderWidth:0.5,borderColor:'grey' }}>
                   <TouchableOpacity onPress={() => this.setState({theme:'1',showTheme:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >卡片</Text></TouchableOpacity>
                   <TouchableOpacity onPress={() => this.setState({theme:'2',showTheme:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >列表</Text></TouchableOpacity>
                   </View> : null}


            </View>: <View>
            <NavigationBar title={this.state.topShow} faction='center' iconSize={15} rightIcon={this.state.opened == true ? 'ios-arrow-up' : 'ios-arrow-down'} onPress={() => this.setState({ opened: (this.state.opened == false) ? true : false })}>
                <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                <NavigationBar.NavBarItem faction='right' iconSize={20} rightIcon={'android-settings'} style={{ width: 80, paddingRight: 10 }}  onPress={() => this.setState({ showTheme: (this.state.showTheme == false) ? true : false })}/>
            </NavigationBar>
            <TouchableOpacity style={{
                height: 45,
                backgroundColor: '#E1E1E1',
                padding: 8,
            }} onPress={() => this.getValue1()}>
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
            </View>
            <ScrollView style={{marginBottom:70}}>
                <ListView
                    style={styles.listView}
                    dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                    renderRow={this._renderItem1.bind(this)}
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
        </View>}
        {this.state.showTheme == true ?
                    <View style={{ position: 'absolute',  backgroundColor: 'white',right:10, top: 60,borderWidth:0.5,borderColor:'grey' }}>
                    <TouchableOpacity onPress={() => this.setState({theme:'1',showTheme:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >卡片</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => this.setState({theme:'2',showTheme:false})}><Text style={{ alignSelf: 'center', fontSize: Config.MainFontSize, padding: 10 }} >列表</Text></TouchableOpacity>
                    </View>: null}
        
        </View>
               
            );


        }

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
            <Text style={{ marginTop: 10, color: 'white', fontSize: Config.MainFontSize - 4, alignContent: 'center', fontWeight: 'bold', alignSelf: 'center', backgroundColor: '#DADADA', padding: 3 }}>{rowData.time}</Text>
            <TouchableOpacity style={{ backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
                    <View style={{ maxWidth: theme.screenWidth - 30, backgroundColor: 'white', marginTop: 10, borderRadius: 5 }}>
                        <View style={{flexDirection:'row'}}>
                        <View style={{backgroundColor:'red',width:8,height:8,borderRadius:10,marginLeft:5,marginTop:14}}/>
                        <Text style={{ fontSize: Config.MainFontSize - 2, color: 'black',marginLeft:5, paddingTop: 10,paddingRight: 10,paddingBottom: 10, marginRight: 15, maxWidth: theme.screenWidth - 80, borderRadius: 20 }}>{rowData.content}</Text>
                        </View>
                        <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', marginLeft: 10, padding: 10, marginRight: 15, maxWidth: theme.screenWidth - 80, borderRadius: 20 }}>{rowData.details}</Text>
                        <View style={{ padding: 20, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'white', backgroundColor: '#3396FB', position: 'absolute', left: 20, padding: 3 }}>{rowData.type}</Text>
                            <Text style={{ fontSize: Config.MainFontSize - 4, color: 'grey', position: 'absolute', right: 15 }}>{rowData.date}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            </View>
        )

    }
    getValue1() {
        if (this.props.theme == 'select') {
            Actions.SearchMessage({ callback: this.callback.bind(this), theme: 'select' })
        } else {
            Actions.SearchMessage({ theme: '1' })
        }
    }
    _renderItem1(rowData) {
        return (
            <View>
                 <Text style={{ marginTop: 10, color: 'grey', fontSize: Config.MainFontSize - 4, fontWeight: 'bold', backgroundColor: 'transparent', padding: 3,marginLeft:16,paddingBottom:10 }}>{rowData.date}</Text>
            <TouchableOpacity style={{ backgroundColor: 'transparent' }}>
                <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
                    <View style={{ width: theme.screenWidth, backgroundColor: 'white', borderRadius: 5 }}>
                        <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize: Config.MainFontSize - 4,padding:5,color:'grey',marginLeft:12}}>{rowData.type}</Text>
                        <Text style={{fontSize: Config.MainFontSize - 4,padding:5,right:10,color:'grey',position:'absolute'}}>{rowData.time}</Text>
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
        backgroundColor: '#f6f6f6',
        marginBottom:30
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