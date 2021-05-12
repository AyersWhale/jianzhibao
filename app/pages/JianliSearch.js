import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
} from 'react-native';
import { QuickSearch, VectorIcon } from 'c2-mobile';
import illegalDeal from '../utils/illegalDeal'
export default class QySearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loaded: false,
        }

    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                {this.searchView()}
            </View>
        );
    }
    searchView() {
        if (this.props.theme == 1) {
            return (
                <View style={styles.container1}>
                    <View style={{
                        backgroundColor: 'white', flexDirection: 'row', height: 35, borderRadius: 20
                    }}  >
                        <VectorIcon name='ios-search' size={20} style={{ alignSelf: 'center', marginLeft: 15, color: '#999' }} />
                        <TextInput
                            ref={"testref"}
                            style={styles.textInput1}
                            autoFocus={false}
                            underlineColorAndroid="transparent"
                            placeholder="搜索职位/公司"
                            placeholderTextColor="#999"
                            clearButtonMode={"always"}
                            blurOnSubmit={true}
                            value={this.state.value}
                            returnKeyLabel={'search'}
                            onChangeText={this.getValue.bind(this)}
                        ></TextInput>
                    </View>
                    <View>
                        {this.loading()}
                    </View>
                    <View style={styles.main3}>
                        {this.renderListView()}
                    </View>
                </View >
            );
        } else if (this.props.theme == 2) {
            return (
                <View style={styles.container1}>
                    <View style={{
                        backgroundColor: 'white', flexDirection: 'row', height: 35, borderRadius: 20
                    }}  >
                        <VectorIcon name='ios-search' size={20} style={{ alignSelf: 'center', marginLeft: 15, color: '#999' }} />
                        <TextInput
                            ref={"testref"}
                            style={styles.textInput1}
                            autoFocus={false}
                            underlineColorAndroid="transparent"
                            placeholder="搜索职位"
                            placeholderTextColor="#999"
                            clearButtonMode={"always"}
                            blurOnSubmit={true}
                            value={this.state.value}
                            returnKeyLabel={'search'}
                            onChangeText={this.getValueResume.bind(this)}
                        ></TextInput>
                    </View>
                    <View>
                        {this.loading()}
                    </View>
                    <View style={styles.main3}>
                        {this.renderListView()}
                    </View>
                </View >
            );
        } else {

            return (
                <View style={styles.container}>
                    <View style={{
                        backgroundColor: '#E9E9EF', flexDirection: 'row', height: 40, marginTop: 4, marginLeft: 10, marginRight: 10
                    }}  >
                        <VectorIcon name='ios-search' size={14} style={{ alignSelf: 'center', marginLeft: 15, color: '#999' }} />
                        <TextInput
                            ref={"testref"}
                            style={styles.textInput}
                            autoFocus={false}
                            underlineColorAndroid="transparent"
                            placeholder="搜索"
                            clearButtonMode={"always"}
                            placeholderTextColor="#999"
                            blurOnSubmit={true}
                            value={this.state.value}
                            returnKeyLabel={'search'}
                            onChangeText={this.getValue.bind(this)}
                        ></TextInput>
                    </View>
                    <View>
                        {this.loading()}
                    </View>
                    <View style={styles.main3}>
                        {this.renderListView()}
                    </View>
                </View >
            );
        }
    }
    getValue(value) {
        illegalDeal.ifillegal(value)
        console.log(this.props.rowData)
        // if (this.props.values1 == undefined) {
        //     var temp = [this.props.values]
        // }
        // if (this.props.values2 == undefined) {
        //     var temp = [this.props.values, this.props.values1]
        // }
        // if (this.props.values3 == undefined) {
        //     var temp = [this.props.values, this.props.values1, this.props.values2]
        // }
        // if (this.props.values4 == undefined) {
        //     var temp = [this.props.values, this.props.values1, this.props.values2, this.props.values3]
        // } 
        if (value == '') {
            this.props.searchResult('');
        } if (value != '') {
            this.props.searchResult('null');
        }
        this.setState({
            loading: true,
            loaded: true,
            showList: false,
        })
        if (!value || !value.trim() || value.trim().length <= 0) {
            this.setState({
                loading: false,
                loaded: false
            });
            return;
        }
        // var th = this;
        // for (var i in temp) {
        //     if (i == 1) {
        //         var datas = QuickSearch.search(this.props.rowData, [temp[0], 'like', value]);
        //     }
        //     if (i == 2) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value]]);
        //     }
        //     if (i == 3) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value], '||', [temp[2], 'like', value]]);
        //     }
        //     if (i == 4) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value], '||', [temp[2], 'like', value], '||', [temp[3], 'like', value]]);
        //     }
        //     if (i == 5) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value], '||', [temp[2], 'like', value], '||', [temp[3], 'like', value], '||', [temp[4], 'like', value]]);
        //     }
        //     if (i == 6) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value], '||', [temp[2], 'like', value], '||', [temp[3], 'like', value], '||', [temp[4], 'like', value], '||', [temp[5], 'like', value]]);
        //     }
        //     if (i == 7) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value], '||', [temp[2], 'like', value], '||', [temp[3], 'like', value], '||', [temp[4], 'like', value], '||', [temp[5], 'like', value], '||', [temp[6], 'like', value]]);
        //     }
        //     if (i == 8) {
        //         var datas = QuickSearch.search(this.props.rowData, [[temp[0], 'like', value], '||', [temp[1], 'like', value], '||', [temp[2], 'like', value], '||', [temp[3], 'like', value], '||', [temp[4], 'like', value], '||', [temp[5], 'like', value], '||', [temp[6], 'like', value], '||', [temp[7], 'like', value]]);
        //     }
        // }
        // var datas = QuickSearch.search(this.props.rowData, [[[[[[['POSITION_NAME', 'like', value], '||', ['POSITION_PROVINCE_NAME', 'like', value]], '||', ['POSITION_CITY_NAME', 'like', value]]], '||', ['RELEASE_COMPANY_NAME', 'like', value]]]]);
        var datas = QuickSearch.search(this.props.rowData, [['intentPost', 'like', value], '||', ['educateFrom', 'like', value], '||', ['personName', 'like', value], '||', ['highestEducation', 'like', value], ['age', 'like', value]]);

        if (datas == 0) {
            this.setState({
                loading: false,
                loaded: false
            });
            return;
        }
        this.setState({
            loading: false,
            list: datas
        });

    }
    getValueResume(value) {
        illegalDeal.ifillegal(value)
        console.log(this.props.rowData)
        if (value == '') {
            this.props.searchResult('');
        } if (value != '') {
            this.props.searchResult('null');
        }
        this.setState({
            loading: true,
            loaded: true,
            showList: false,
        })
        if (!value || !value.trim() || value.trim().length <= 0) {
            this.setState({
                loading: false,
                loaded: false
            });
            return;
        }
        var datas = QuickSearch.search(this.props.rowData, [['intentPost', 'like', value], '||', ['educateFrom', 'like', value], '||', ['personName', 'like', value], '||', ['highestEducation', 'like', value], ['age', 'like', value]]);

        // var datas = QuickSearch.search(this.props.rowData, [['intentPost', 'like', value], '||', ['personName', 'like', value]]);
        if (datas == 0) {
            this.setState({
                loading: false,
                loaded: false
            });
            return;
        }
        this.setState({
            loading: false,
            list: datas
        });

    }
    renderListView() {
        if (this.state.loaded) {
            var row = this.props.searchResult(this.state.list);
            this.setState({ loaded: false })
            return row;
        }
    }
    loading() {
        if (this.state.loading) {
            return (
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 22, color: '#888', marginTop: 100, width: 400, height: 800 }}>搜索中，请稍后......</Text>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff'
    },
    container1: {
        backgroundColor: 'white',
        borderRadius: 10
    },
    textInput: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#E9E9EF',
        fontSize: 14,
        padding: 0,
        paddingLeft: 5
    },
    textInput1: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        fontSize: 14,
        padding: 0,
        paddingLeft: 5,
        borderRadius: 10
    },
    main3: {
        flex: 1,
        backgroundColor: 'white',
    },
})