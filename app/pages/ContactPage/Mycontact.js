/**
 * 通讯录群组主界面
 * Created by 蒋牧野.
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform, TextInput, Image, ScrollView } from 'react-native';
import { Actions, Config, SegmentedControl, VectorIcon } from 'c2-mobile';
import Mycontact1 from './Mycontact1';
import Mycontact2 from './Mycontact2';
const deviceWidth = Dimensions.get('window').width;

export default class Mycontact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectNum: '0',
        }
    }
    componentWillMount() {

    }
    _back() {
        Actions.pop();
    }
    _SelectPlanItem(selectNum) {
        this.setState({
            selectNum: selectNum,
        })
    }
    render() {
        return (
            <View style={{ backgroundColor: '#fff' }} >
                {/* <NavigationBar title="我的群组" faction='center' >
                    <NavigationBar.NavBarItem onPress={this._back.bind(this)} title="" faction='left' leftIcon={'c2_im_back_arrow'} iconSize={18} size={16} style={{ width: 80, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem faction='right' title="发起群聊" iconSize={20} style={{ width: 80, paddingRight: 10 }} />
                </NavigationBar> */}
                <View style={{
                    backgroundColor: '#E9E9EF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, marginTop: 4, marginLeft: 10, marginRight: 10
                }}  >
                    <VectorIcon name='ios-search' size={14} style={{ alignSelf: 'center', marginLeft: 15, color: '#999' }} />
                    <TextInput
                        ref={"testref"}
                        style={styles.textInput}
                        autoFocus={false}
                        underlineColorAndroid="transparent"
                        // defaultValue={this.state.searchKeyWord == '' ? '' : this.state.searchKeyWord}
                        placeholder="搜索:群组"
                        // onEndEditing={(event) => this.saveData(event)}
                        placeholderTextColor="#999"
                        blurOnSubmit={true}
                        // onSubmitEditing={this.onSearch}
                        value={this.state.value}
                        returnKeyLabel={'搜索'}
                        onChangeText={(inputKey) => this.onCancel(inputKey)}
                    ></TextInput>

                </View>
                <View style={{ height: 1, backgroundColor: '#E9E9EF', width: deviceWidth, marginTop: 3 }} />
                <View style={{
                    flexDirection: 'row', marginTop: 10,
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.8,
                    shadowRadius: 5,
                    shadowColor: '#b3b4b7',
                    elevation: 2,
                }}>
                    <View style={{ width: 20, backgroundColor: '#fff' }} />
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        horizontal={true}
                    >
                        <View style={{ width: deviceWidth - 40, backgroundColor: '#fff', borderRadius: 5 }}  >
                            <SegmentedControl
                                ref={'C2SegmentedControl'}
                                itemDatas={[{ name: '我创建的' }, { name: '我加入的' }]}
                                hasChanged={this._SelectPlanItem.bind(this)}
                                tintColor={'rgb(22,131,251)'}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ width: 20, backgroundColor: '#fff' }} />
                </View>
                <View style={{ height: 1, backgroundColor: '#f4f4f4', width: deviceWidth }} />
                {
                    this.state.selectNum == '0' ? <Mycontact1 /> :
                        this.state.selectNum == '1' ? <Mycontact2 /> :
                            null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        // width: deviceWidth - 50,
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#E9E9EF',
        fontSize: Config.MainFontSize - 2,
        padding: 0,
        paddingLeft: 5
    },
});