'use strict'

import {
    View,
    Text,
    TouchableOpacity,
    ListView,
    Modal,
    StyleSheet
} from 'react-native';

import React, { Component } from 'react';

let buttonX = 0;
let buttonY = 0;
let buttonWidth = 0;
let buttonHeight = 0;

class C2DropMenu extends Component {

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

        if (!this.state.showModal) {
            this.refs.button.measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                buttonX = pageX;
                buttonY = pageY;
                buttonWidth = frameWidth;
                buttonHeight = frameHeight;

                this.setState({
                    showModal: true
                })
            });
        } else {
            this.setState({
                showModal: false
            })
        }
    }

    _selectedRow(rowData) {
        this.setState({
            selectedOption: rowData,
            showModal: false
        })
        this.props.onPress(rowData);
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
        if (this.state.loadMore) {
            return (
                <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>加载更多···</Text>
                </View>
            )
        }

        return (
            <View style={{ paddingTop: 20, paddingBottom: 20 }}>
                <Text style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>无更多选项</Text>
            </View>
        )
    }

    _renderRow(rowData) {

        return (
            <View style={{borderBottomWidth: 1, borderBottomColor: '#e5e5e5'}}>
            <TouchableOpacity style={{ paddingTop: 20, paddingBottom: 20 }} onPress={() => this._selectedRow(rowData)}>
                <Text style={{ flex: 1,alignSelf: 'auto', textAlign: 'left',left:20, fontSize: 16 }}>{rowData}</Text>
            </TouchableOpacity>
            </View>
        )
    }

    render() {
        
        return (
            <TouchableOpacity ref={'button'} style={[styles.container, this.props.style]} onPress={() => this._showDropMenu()}>
                <Text style={{ flex: 1, alignSelf: 'center', textAlign: 'left',left:0 }}>{this.state.selectedOption}</Text>
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => { alert("Modal has been closed.") } }
                    >
                    <TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => this._showDropMenu()}>
                        <View style={{ left: buttonX, top: buttonY + buttonHeight, height: buttonHeight * 4, width: buttonWidth, backgroundColor: 'white', borderColor: '#edecec', borderWidth: 1 }}>
                            <ListView
                                ref={'listview'}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                onEndReachedThreshold={5}
                                onEndReached={this._onEndReached}

                                />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </TouchableOpacity>
        )
    }

}

C2DropMenu.defaultProps = {
    loadMoreData: () => null
}

let styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

module.exports = C2DropMenu;