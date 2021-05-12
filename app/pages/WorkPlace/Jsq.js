import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight, Modal, Platform, Dimensions
} from 'react-native';
import { Config, Actions, NavigationBar } from 'c2-mobile';

const { width, height } = Dimensions.get('window');
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            res: '0',//当前显示的结果值
            active: '',//运算符号是否是激活状态
            method: '',//存储的运算符号
            oldres: '',//存储的上一个值
            isPreMethod: false,//上一个按键是否是运算符号
        };
    }

    formatFloat(f, digit) {
        var m = Math.pow(10, digit);
        var a = Math.round(f * m, 10) / m;
        console.log(a)
        return a
    }

    numberFloat(number) {

        if (number.toString().length > 11) {
            number = number.toExponential(3)
            number = number.replace('+', '')
            return number
        }
        let num = number.toString()
        num = num.split("").reverse().join("");
        if (num.indexOf('.') > -1) {
            num = num.replace(/(\d+\.)(\d{3})/g, "$1$2,");
        } else {
            num = num.replace(/(\d{3})/g, "$1,");
        }
        num = num.split("").reverse().join("");
        if (num.indexOf(',') == 0) {
            num = num.replace(/,/, '')
        }
        // num = num.replace('/,\./','.');
        return num;
    }

    press(val, type) {

        if (val == 'ac') { //清空（AC）
            this.setState({
                res: 0,
                active: '',
            })

        } else if (/\d/.test(val) || val == '.') { //数字(1234567890.)

            if (this.state.isPreMethod) {//如果上一个按键是运算符号就把res值重置
                this.setState({
                    res: val,
                    active: '',
                }, () => {
                    this.setState({
                        isPreMethod: false
                    })
                })
            } else {

                if (this.state.res.toString().length >= 10) {
                    return
                }

                let value = this.state.res + '' + val
                if (/^0\d/.test(value)) {
                    value = Number(value)
                }

                this.setState({
                    res: value,
                    active: '',
                })
            }

        } else if (val) { //运算符号 ( + - x ÷ +/- % = )

            if (val == '+/-') {
                this.setState({
                    res: -this.state.res
                })
            } else if (val == '%') {

                // if(this.state.res.toString().length>=10){
                //   return
                // }
                this.setState({
                    res: this.state.res / 100
                })
            } else if (val == '=') { //计算结果

                this.setState({
                    isPreMethod: true,
                })

                if (this.state.method == '+') {
                    this.setState({
                        res: this.formatFloat(Number(this.state.oldres) + Number(this.state.res), 10),
                        method: ''
                    })
                } else if (this.state.method == '-') {
                    this.setState({
                        res: this.formatFloat(Number(this.state.oldres) - Number(this.state.res), 10),
                        method: ''
                    })
                } else if (this.state.method == 'x') {
                    this.setState({
                        res: this.formatFloat(Number(this.state.oldres) * Number(this.state.res), 10),
                        method: ''
                    })
                } else if (this.state.method == '÷') {
                    this.setState({
                        res: this.formatFloat(Number(this.state.oldres) / Number(this.state.res), 10),
                        method: ''
                    })
                }

            } else {//( + - x ÷)
                this.setState({
                    oldres: this.state.res,
                    method: val,
                    isPreMethod: true,
                })
            }
            this.setState({
                active: val
            })
        }

    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title="计算器" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>
                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <View style={[styles.input]}>
                        <Text style={[styles.inputText, this.state.res.toString().length > 7 && styles.zoomFontSize]} numberOfLines={1} >
                            {
                                this.numberFloat(this.state.res)
                            }</Text>
                    </View>
                    <View style={{ height: 20, width: width, backgroundColor: '#000' }} />
                    <View style={styles.itemView}>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight underLayColor="rgba(34,26,38,0.1)" onPress={() => { this.press('ac') }} style={[styles.touchBtn, styles.gray]}>
                                <Text style={styles.key}>
                                    AC
            </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('+/-') }} style={[styles.touchBtn, styles.gray]}>
                                <Text style={styles.key} >
                                    +/-
            </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('%') }} style={[styles.touchBtn, styles.gray]}>
                                <Text style={styles.key} >
                                    %
            </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('÷') }} style={[{
                                height: 56, width: 56, backgroundColor: '#333',
                                overflow: 'hidden',
                                justifyContent: 'center',
                                borderRadius: 28,
                                borderWidth: 0.5,
                                borderColor: '#f3f3f3'
                            }, this.state.active == '÷' ? styles.active : styles.yellow]}>
                                <Text style={{ fontSize: 30, textAlign: 'center', color: this.state.active == '÷' ? '#333' : '#fff', }}>
                                    ÷
      </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.itemView}>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('7') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    7
          </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('8') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    8
          </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('9') }} style={styles.touchBtn}>
                                <Text style={styles.key} >
                                    9
          </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('x') }} style={[{
                                height: 56, width: 56, backgroundColor: '#333',
                                overflow: 'hidden',
                                justifyContent: 'center',
                                borderRadius: 28,
                                borderWidth: 0.5,
                                borderColor: '#f3f3f3'
                            }, this.state.active == 'x' ? styles.active : styles.yellow]}>
                                <Text style={{ fontSize: 30, textAlign: 'center', color: this.state.active == 'x' ? '#333' : '#fff', }}>
                                    x
      </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.itemView}>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('4') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    4
        </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('5') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    5
        </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('6') }} style={styles.touchBtn}>
                                <Text style={styles.key} >
                                    6
        </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('-') }} style={[{
                                height: 56, width: 56, backgroundColor: '#333',
                                overflow: 'hidden',
                                justifyContent: 'center',
                                borderRadius: 28,
                                borderWidth: 0.5,
                                borderColor: '#f3f3f3'
                            }, this.state.active == '-' ? styles.active : styles.yellow]}>
                                <Text style={{ fontSize: 30, textAlign: 'center', color: this.state.active == '-' ? '#333' : '#fff', }}>
                                    -
      </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.itemView}>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('1') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    1
      </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('2') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    2
      </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('3') }} style={styles.touchBtn}>
                                <Text style={styles.key}>
                                    3
      </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('+') }} style={[{
                                height: 56, width: 56, backgroundColor: '#333',
                                overflow: 'hidden',
                                justifyContent: 'center',
                                borderRadius: 28,
                                borderWidth: 0.5,
                                borderColor: '#f3f3f3'
                            }, this.state.active == '+' ? styles.active : styles.yellow]}>
                                <Text style={{ fontSize: 30, textAlign: 'center', color: this.state.active == '+' ? '#333' : '#fff', }}>
                                    +
      </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={styles.itemView}>
                        <View style={styles.keyWrap1}>
                            <TouchableHighlight onPress={() => { this.press('0') }} style={styles.touchBtn1}>
                                <Text style={styles.key}>
                                    0
            </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('.') }} style={styles.touchBtn}>
                                <Text style={styles.key} >
                                    .
            </Text>
                            </TouchableHighlight>
                        </View>
                        <View style={styles.keyWrap}>
                            <TouchableHighlight onPress={() => { this.press('=') }} style={[styles.touchBtn, styles.yellow]}>
                                <Text style={styles.key} >
                                    =
            </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#000',
    },
    input: {

    },
    inputText: {
        color: '#fff',
        fontSize: 40,
        textAlign: 'right',
        paddingRight: 30,
    },
    zoomFontSize: {
        fontSize: 40,
        textAlign: 'right',
    },
    itemView: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    touchBtn: {
        height: 56,
        width: 56,
        backgroundColor: '#000',
        borderRadius: 28,
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#f3f3f3'
    },
    touchBtn1: {
        height: 56,
        backgroundColor: '#000',
        borderRadius: 28,
        width: '85%',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#f3f3f3',
    },
    keyWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    keyWrap1: {
        flex: 2,
        alignItems: 'center',
    },
    key: {
        fontSize: 30,
        textAlign: 'center',
        color: '#fff',
    },
    key1: {
        fontSize: 30,
        textAlign: 'center',
        color: '#fff',
    },
    yellow: {
        backgroundColor: '#333',
        height: 56,
    },
    active: {
        color: '#333',
        backgroundColor: '#fff',
    },
    gray: {
        backgroundColor: '#333',
    }
});