'use strict'

import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    Modal,
    Dimensions,
    StyleSheet
} from 'react-native';

import React, { Component } from 'react';

import CheckBox from './checkBox';

let buttonX = 0;
let buttonY = 0;
let buttonWidth = 0;
let buttonHeight = 0;

class PopupBoxMenu extends Component {

    static CheckBox = CheckBox;

    rowRefs = {};
    itemStatus = {};
    selectedItems = [];
    selectedArr = [];

    constructor(props) {
        super(props)

        this._onEndReached = this._onEndReached.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._renderRow = this._renderRow.bind(this);

        this.state = {
            loadMore: true,
            showModal: false,
            optionsGroup: this.props.options,
            selectedOption: this.props.options[0],
            dataSource: this._getDataSource()
        }

        
    }

    _getDataSource(datas) {
        var dataSource = datas || this.props.options;
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return ds.cloneWithRows(dataSource);
    }

    _showDropMenu() {

        var moreData = this.props.loadMoreData();
        this.selectedItems = []
        this.rowRefs = {};
        this.itemStatus = {};
        this.state.selectedOption = this.props.options[0]
        var mergeTo = [];
        
        
        mergeTo = mergeTo.concat(moreData);
        
        if (!this.state.showModal) {
            this.refs.button.measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                buttonX = pageX;
                buttonY = pageY;
                buttonWidth = frameWidth;
                buttonHeight = 87;
                this.setState({
                    showModal: true,
                    dataSource: this._getDataSource(mergeTo)
                })
            });
        } else {
            this.setState({
                showModal: false,
                dataSource: this._getDataSource(mergeTo)
            })
        }

       
    }

    _commitOptions() {
        if (this.selectedItems.length > 0) {
            this.setState({
                selectedOption: { title: this.selectedItems[0].title + (this.selectedItems.length > 1 ? ',....' : '') },
                showModal: false
            })
        } else {
            this.setState({
                selectedOption: { title: '' },
                showModal: false
            })
        }
        
        this.props.selectedOption(this.selectedItems);


    }
    
    _selectedRows(rowData, rowID) {
        if (this.rowRefs[rowID].Status) {
            this.rowRefs[rowID].switchStatus(false);
            this.itemStatus[rowID] = false;
            var tempArray = [];
            for (var key in this.selectedItems) {
                if (rowData.title === this.selectedItems[key].title) {
                    continue;
                }
                tempArray.push(this.selectedItems[key]);
            }
            this.selectedItems = tempArray;
        } else {
            this.rowRefs[rowID].switchStatus(true);
            this.itemStatus[rowID] = true;
            this.selectedItems.push(rowData);
        }
    }

    _selectedRow(rowData, rowID) {
        this.selectedItems = [];
        this.selectedItems.push(rowData);
        this.setState({
            selectedOption: rowData,
            showModal: false
        })
        this.props.selectedOption(rowID, rowData);
    }


    _onEndReached() {

        if (!this.state.loadMore) {
            return
        }

        var moreData = this.props.loadMoreData();
        if (moreData == null) {
            this.setState({
                loadMore: false,
            })
            return
        }

        var mergeTo = this.state.optionsGroup.slice(0);
        mergeTo = mergeTo.concat(moreData);
        this.setState({
            dataSource: this._getDataSource(mergeTo),
        })

    }

    _renderFooter() {

        if (this.props.renderFooter != null) {
            return this.props.renderFooter(this.state.loadMore);
        }

        if (this.state.loadMore) {
            return (
                <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>{this.props.loadingText}</Text>
                </View>
            )
        }

        return (
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>无更多选项</Text>
            </View>
        )
    }

    _renderMultiMode() {
        if (this.props.multiSelect) {
            return (
                <TouchableOpacity style={{ flexDirection: 'row', padding: 20, backgroundColor: this.props.tintcolor }} onPress={() => this._commitOptions()}>
                    <Text style={{ flex: 1, textAlign: 'center', color: 'white' }}>确认</Text>
                </TouchableOpacity>
            )
        }
        return null;
    }

    _renderRow(rowData, sectionID, rowID) {

        if (this.props.renderRow) {
            return this.props.renderRow(rowData, sectionID, rowID);
        }

        if (this.props.multiSelect) {
            return (
                <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }} onPress={() => this._selectedRows(rowData, rowID)}>
                    <Text style={{ flex: 1, textAlign: 'left', fontSize: 16 }}>{rowData.title}</Text>
                    <CheckBox tintcolor={this.props.tintcolor} ref={(ref) => { this.rowRefs[rowID] = ref } } selected={this.itemStatus[rowID] == true ? true : false} />
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={{ paddingTop: 20, paddingBottom: 20 }} onPress={() => this._selectedRow(rowData, rowID)}>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>{rowData.title}</Text>
            </TouchableOpacity>
        )
    }

    _renderModalMenu() {

        return (
            <TouchableOpacity activeOpacity={1} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: "#00000064" }} onPress={() => this._showDropMenu()}>
                <View style={{ flex: 1, marginHorizontal: 30, height: buttonHeight * (this.props.multiSelect ? 5 : 4), backgroundColor: 'white', borderColor: '#edecec', borderWidth: 1 }}>
                    <ListView
                        ref={'listview'}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        onEndReachedThreshold={5}

                        />
                    {this._renderMultiMode()}
                </View>
            </TouchableOpacity>
        )
    }

    _renderDropMenu() {

        return (
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this._showDropMenu()}>
                <View style={{ left: buttonX, top: buttonY + buttonHeight, height: buttonHeight * (this.props.multiSelect ? 5 : 4), width: buttonWidth, backgroundColor: 'white', borderColor: '#edecec', borderWidth: 1 }}>
                    <ListView
                        ref={'listview'}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        onEndReachedThreshold={5}

                        />
                    {this._renderMultiMode()}
                </View>
            </TouchableOpacity>
        )
    }

    _renderMenu() {

        var menuContent;

        switch (this.props.mode) {
            case "DropMenu":
                menuContent = this._renderDropMenu();
                break;
            case "Modal":
                menuContent = this._renderModalMenu();
                break;
            default:

        }

        return menuContent;
    }

    render() {

        //this.selectedItems这个值  多选的时候就有值  但是转换成单选的时候 这个值为空  组件上面有一个是否允许多选的属性
        var buttonContent = this.props.renderButton(this.selectedItems) || <Text style={{ flex: 1, alignSelf: 'center', textAlign: 'center' }}>{this.state.selectedOption.title}</Text>
        this.selectedItems = [];
        return (
            <TouchableOpacity ref={'button'} style={[styles.container, this.props.style]} onPress={() => this._showDropMenu()}>
                {buttonContent}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => { } }
                    >
                    {this._renderMenu()}
                </Modal>
            </TouchableOpacity>
        )
    }
}

PopupBoxMenu.defaultProps = {
    mode: "DropMenu",//Modal
    renderButton: () => null,
    placeholder: '请选择',
    loadingText: '加载更多···',
    loadMoreData: () => null,
    selectedOption: () => alert('需要实现selectedOption这个回调'),
    multiSelect: false
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

module.exports = PopupBoxMenu;