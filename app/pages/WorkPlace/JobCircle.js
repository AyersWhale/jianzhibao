/**
 * 考友圈
 * Created by 伍钦 on 2018/08/07
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    Dimensions, TouchableOpacity, ScrollView, TextInput, Platform, Keyboard
} from 'react-native';
import { NavigationBar, Config, Actions, VectorIcon, UserInfo } from 'c2-mobile';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export default class KaoyouQuan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            ifShowCommits: false,
            rowData: [
                { "name": "刘小明", "praiser": [{ name: '张三' }, { name: '李四' }, { name: '王五' }], "createrTime": "2018:11:11 18:13", "praises": 3, "comments": 1, "commentsMsg": [{ name: "张三", detail: "吃还是得吃，别太多" }, { name: "李四", detail: "别太多哦" }], ifpraises: false, "img": [{ imgUrl: require('../../image/profile5.png') }, { imgUrl: require('../../image/profile4.png') }, { imgUrl: require('../../image/profile3.png') }, { imgUrl: require('../../image/profile5.png') }, { imgUrl: require('../../image/profile4.png') }, { imgUrl: require('../../image/profile3.png') }], "title": "关于早餐", "contents": "早餐应该多吃吗？有人说好，又有人说不好。好纠结！！" },
                { "name": "王勇", "praiser": [{ name: '李四' }, { name: '管理员' }, { name: '王五' }], "createrTime": "2018:10:15 07:13", "praises": 3, "comments": 111, ifpraises: true, "img": [{ imgUrl: require('../../image/profile5.png') }, { imgUrl: require('../../image/profile4.png') }], "title": "有没有人参加马拉松", "contents": "长沙过段时间会有马拉松比赛。有没有想要一起参加的？来组个团吗？哈哈哈哈哈。一起跑起来~~" },
                { "name": "张勇", "praiser": [{ name: '王五' }], "createrTime": "2018:11:09 10:00", "praises": 3, "comments": 1, ifpraises: false, "img": [{ imgUrl: require('../../image/profile5.png') }], "title": "双11活动", "contents": "双11马上到来。同志们准备好了吗？" },
            ],

        }
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar title="工作圈" faction='center' >
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem faction='right' rightIcon={'add'} iconSize={28} style={{ width: 80, paddingRight: 10 }} onPress={() => Actions.AddCircleMsg()} />
                </NavigationBar>
                <ScrollView
                    horizontal={false}
                    style={styles.scrollView}>
                    <View>
                        {this.getQuanlist()}
                    </View>
                </ScrollView>

            </View>
        );
    }
    getQuanlist() {
        var rowData = this.state.rowData
        var temp = [];
        if (rowData.length == 0) {
            <View style={{ height: deviceHeight - 250, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../image/app_panel_expression_icon.png')} style={{ width: 160, height: 160, }} />
                <Text style={{ textAlign: 'center', fontSize: Config.MainFontSize, color: '#000', opacity: 0.6,marginTop:10 }}>当前没有人发布工作圈哦～</Text>
            </View>
        } else {
            for (let i in rowData) {
                temp.push(
                    <ScrollView >
                        <View style={styles.userInfo}>
                            <View>
                                <Image style={styles.avatar} source={require('../../image/profile4.png')} />
                            </View>
                            <View ><Text style={styles.detailTexts}>{rowData[i].name}</Text>
                            </View>
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.detailText_title}>标题 : {rowData[i].title}</Text>
                            <Text style={styles.detailText2}>{rowData[i].contents}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10, flexWrap: 'wrap' }}>
                            {this.showPic((rowData[i].img == undefined) ? [] : rowData[i].img)}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.detail_horizental}>
                                <VectorIcon style={{ marginTop: 15, }} name={'calendar'} size={12} color={'#b3b3b3'} />
                                <Text style={styles.detailText}>{rowData[i].createrTime}</Text>
                            </View>
                            <TouchableOpacity onPress={this.praisesClick.bind(this, i)} style={{ flexDirection: 'row' }}>
                                <VectorIcon style={{ marginTop: 15, marginLeft: deviceWidth / 5, }} name={'heart2'} size={12} color={(rowData[i].ifpraises) ? 'red' : '#b3b3b3'} />
                                <Text style={styles.detailText3}>{(rowData[i].praises == undefined) ? 0 : rowData[i].praises}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.commitsClick.bind(this, i)} style={{ flexDirection: 'row' }}>
                                <VectorIcon style={{ marginTop: 15, marginLeft: 20 }} name={'comment'} size={12} color={'#b3b3b3'} />
                                <Text style={styles.detailText1}>{rowData[i].comments}</Text>
                            </TouchableOpacity>
                        </View >
                        <View style={{ flexDirection: 'row', backgroundColor: '#f5f5f5', marginLeft: 20, marginRight: 20, flexWrap: 'wrap' }}>
                            <VectorIcon style={{ marginTop: 15, marginLeft: 5 }} name={'heart_empty'} size={14} color={'#b3b3b3'} />
                            {this.showPraiser((rowData[i].praiser == undefined) ? [] : rowData[i].praiser)}
                        </View >
                        <View style={{ backgroundColor: '#f5f5f5', marginLeft: 20, marginRight: 20, marginBottom: 10, flexWrap: 'wrap' }}>
                            {this.showCommits((rowData[i].commentsMsg == undefined) ? [] : rowData[i].commentsMsg)}
                        </View >
                        {this.state.ifShowCommits && i == this.state.commentsnum ?
                            <View style={{ backgroundColor: '#f5f5f5', marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
                                <TextInput
                                    ref={"testref"}
                                    style={{ fontSize: Config.MainFontSize, flexWrap: 'wrap', textAlign: 'left', marginRight: (Platform.OS == 'ios') ? 60 : 40, }}
                                    autoFocus={true}
                                    underlineColorAndroid="transparent"
                                    placeholder="评论"
                                    clearButtonMode={"always"}
                                    editable={true}
                                    multiline={true}
                                    numberOfLines={3}
                                    value={this.state.detail}
                                    returnKeyLabel={'search'}
                                    onChangeText={(value) => { this.setState({ detail: value }) }}
                                ></TextInput>
                                <TouchableOpacity onPress={this.makeSure.bind(this, i)} style={{ position: 'absolute', right: 10 }}>
                                    <Text style={{ fontSize: Config.MainFontSize + 3, color: '#54BED6', marginTop: 0 }}>评论</Text>
                                </TouchableOpacity>
                            </View > : null}

                        <View style={{ height: 5, backgroundColor: '#e5e5e5' }} />
                    </ScrollView >
                );
            }
        }
        return temp;
    }
    showPic(rowData) {//圈图片列表
        var temp = [];
        if (rowData.length == 0) {
            return null
        } else {
            for (let i in rowData) {
                temp.push(
                    <TouchableOpacity onPress={() => { }} style={{ flexDirection: 'row', margin: 10, marginLeft: 10 }}>
                        <Image style={{ height: deviceWidth / 5, width: deviceWidth / 5 }} source={rowData[i].imgUrl} />
                    </TouchableOpacity >
                )
            }
        }
        return temp;

    }
    showPraiser(rowData) {//赞列表
        var temp = [];
        if (rowData.length == 0) {
            return null
        } else {
            for (let i in rowData) {
                temp.push(
                    <View >
                        <Text style={{
                            marginTop: 12,
                            margin: 5,
                            fontSize: Config.MainFontSize ,
                            color: '#54BED6',
                        }}>{rowData[i].name},</Text>
                    </View>
                )
            }
        }
        return temp;
    }
    showCommits(rowData) {//评价列表
        var temp = [];
        if (rowData.length == 0) {
            return null
        } else {
            for (let i in rowData) {
                temp.push(
                    <View style={styles.detail_horizental}>
                        <Text style={{
                            marginTop: 12,
                            margin: 5,
                            fontSize: Config.MainFontSize,
                            color: '#54BED6', marginLeft: 5
                        }}>{rowData[i].name}:</Text>
                        <Text style={{
                            marginTop: 12,
                            margin: 5,
                            marginLeft: 5,
                            fontSize: Config.MainFontSize,
                            color: 'black', marginLeft: 5
                        }}>{rowData[i].detail}</Text>
                    </View>
                )
            }
        }

        return temp;

    }
    praisesClick(i) {//点赞事件处理
        var rowData = this.state.rowData;
        rowData[i].ifpraises = !rowData[i].ifpraises;
        var temp = [...rowData[i].praiser];
        if (rowData[i].ifpraises == false) {
            rowData[i].praises = rowData[i].praises - 1;
            for (let j in temp) {
                if (temp[j].name == UserInfo.loginSet.result.rdata.loginUserInfo.userRealname) {
                    temp.splice(j, 1);
                }
            }
            rowData[i].praiser = temp;
            this.setState({
                rowData: rowData
            })
        } else {
            rowData[i].praises = rowData[i].praises + 1;
            temp.push({ "name": UserInfo.loginSet.result.rdata.loginUserInfo.userRealname })
            rowData[i].praiser = temp
            this.setState({
                rowData: rowData
            })
        }
    }
    commitsClick(i) {//评论点击事件处理
        this.setState({
            ifShowCommits: !this.state.ifShowCommits,
            commentsnum: i
        })

    }
    makeSure(i) {//评论点击事件处理
        Keyboard.dismiss();
        this.setState({
            ifShowCommits: false,
            commentsnum: i
        }, () => {
            var rowData = this.state.rowData;
            var temp = rowData[i].commentsMsg == undefined ? [] : [...rowData[i].commentsMsg];
            temp.push({ "name": UserInfo.loginSet.result.rdata.loginUserInfo.userRealname, detail: this.state.detail })
            rowData[i].commentsMsg = temp
            this.setState({
                rowData: rowData,
                detail: ''
            })
        })

    }

}


var styles = StyleSheet.create({
    card: {
        padding: 5,
    },

    userInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10

    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 15
    },
    detail: {
        marginLeft: 16,
    },
    details: {},
    detail_horizental: {
        flex: 1,
        marginLeft: 5,
        flexDirection: 'row'
    },
    detailText2: {
        fontSize: Config.MainFontSize,
        marginLeft: 10,
        color: '#333',
    },
    detailText_title: {
        margin: 10,
        fontSize: Config.MainFontSize,
        color: '#333',
        marginLeft: 10,
        fontWeight: 'bold'
    },
    detailText: {
        marginTop: 12,
        margin: 5,
        fontSize: Config.MainFontSize + 1,
        color: '#54BED6',
        textAlign: 'right'
    },
    detailText1: {
        margin: 5,
        marginTop: 12,
        fontSize: Config.MainFontSize,
        color: '#54BED6',
        marginLeft: 10,
        marginRight: 10
    },
    detailText3: {
        margin: 5,
        marginTop: 12,
        fontSize: Config.MainFontSize,
        color: '#54BED6',
        marginLeft: 10
    },
    detailTexts: {
        margin: 5,
        marginLeft: 10,
        fontSize: Config.MainFontSize,
        color: '#333',
        fontWeight: 'bold'
    },
});