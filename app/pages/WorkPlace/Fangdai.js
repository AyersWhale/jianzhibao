/**
 * 房贷计算器
 * 
 * 开发者：伍钦
 */
'use strict'
'use strict'

import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

import { NavigationBar, Actions } from 'c2-mobile'

export default class PaintDemo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mode: 1,
        }

        this._clear = this._clear.bind(this);
        this._undo = this._undo.bind(this);
        this._redo = this._redo.bind(this);
    }

    _clear() {
        this.refs.C2Paint.clear();
    }

    _undo() {
        this.refs.C2Paint.undo();
    }

    _redo() {
        this.refs.C2Paint.redo();
    }

    _getPic() {
        this.refs.C2Paint.getPic()
            .then((response) => {
                console.log(response);
            })
            .catch((e) => {

            });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <NavigationBar title="房贷计算器" faction='center' style={{ fontWeight: 'bold' }}>
                    <NavigationBar.NavBarItem onPress={() => Actions.pop()} title="" faction='left' leftIcon={'chevron-left'} iconSize={21} style={{ width: 100, paddingLeft: 10 }} />
                    <NavigationBar.NavBarItem />
                </NavigationBar>

            </View>
        )
    }

}
