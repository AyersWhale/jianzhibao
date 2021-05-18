/**
 * 意向行业 by gyx 2021/05/06
 */
'use strict'
import React, { Component } from 'react';
import {
    BackHandler,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ImageBackground, Dimensions
} from 'react-native';
import { Config, Actions, SafeArea, VectorIcon, Toast } from 'c2-mobile';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default class Intended extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ds: this.props.dataSource || [],
            chooseNum: 0,
        }
    }
    componentDidMount() {
        //监听物理返回
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            Actions.pop()
            this.props.onblock(this.state.ds);
            return true;
        });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        this.setState = (state, callback) => {
            return;
        };
    }
    choose(idx) {
        // console.log(idx)
        if (this.state.chooseNum > 2) {
            Toast.showInfo('最多选三个意向行业', 1000)
            return
        }
        const ds_temp = this.state.ds
        ds_temp[idx].show = !ds_temp[idx].show
        this.setState({
            ds: ds_temp
        })
        if (ds_temp[idx].show) {
            this.setState({
                chooseNum: this.state.chooseNum + 1
            })
        } else {
            this.setState({
                chooseNum: this.state.chooseNum - 1
            })
        }
    }
    handlePop() {
        Actions.pop()
        this.props.onblock(this.state.ds);
    }
    render() {
        const ds = this.state.ds
        return (
            <ScrollView style={{ backgroundColor: '#F2F2F2' }}>
                <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
                    <TouchableOpacity onPress={() => this.handlePop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
                        <VectorIcon name={"chevron-left"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
                    </TouchableOpacity>
                    <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>意向行业</Text>
                    </View>
                </ImageBackground>
                <View style={styles.contanier}>
                    {/* <Text>{JSON.stringify(ds)}</Text> */}
                    {/* <Text>{this.state.chooseNum}</Text> */}
                    {
                        ds.length > 0 ?
                            <View style={styles.icontent}>
                                {ds.map((item, idx) => {
                                    if (item.dictdataValue) {
                                        return (
                                            <TouchableOpacity key={idx} style={styles.intendedItem} onPress={this.choose.bind(this, idx)}>
                                                <Text style={{ fontSize: Config.MainFontSize + 1, color: '#333' }}>{item.dictdataValue}</Text>
                                                <VectorIcon name={"checkmark"} size={16} style={{ color: item.show ? '#4781f6' : 'transparent', backgroundColor: 'transparent' }} />
                                            </TouchableOpacity>
                                        )
                                    }
                                })}
                            </View>
                            : <Text>暂无数据</Text>
                    }
                </View>

            </ScrollView >
        );
    }

}

const styles = StyleSheet.create({
    contanier: {
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 14,
        paddingBottom: 14
    },
    intendedItem: {
        display: 'flex',
        flexDirection: 'row',
        height: 47,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: '#E4E4E4',
        borderBottomWidth: 1
    },
    icontent: {
        backgroundColor: "#FFFFFF",
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 14,
        paddingBottom: 14
    }
});