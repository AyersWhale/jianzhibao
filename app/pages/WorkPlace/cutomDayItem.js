'use strict'

import React from 'react';

import {
    View,
    Text,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import PropTypes from 'prop-types';
import moment from 'moment';

class C2CalendarDayItem extends React.Component {

    static defaultProps = {
        defaultCheck: false
    }

    constructor(props) {
        super(props);

        this.state = {
            check: props.defaultCheck,
        }

        this._onPress = this._onPress.bind(this);
    }

    componentDidMount() {
        if (this.props.isOver) {
            return
        }
        if (this.state.check) {
            this.listener = DeviceEventEmitter.addListener('C2_MOBILE_CALENDAR_SELECTED', () => {
                this.listener.remove();
                this.setState({
                    check: false
                })
            })
        }
    }

    componentWillUnMount() {
        this.listener && this.listener.remove();
    }
    //********************************************************************* */
    //********************************EVENT******************************** */
    //********************************************************************* */

    _onPress() {
        if (this.state.check || this.props.isOver) {
            return
        }
        DeviceEventEmitter.emit('C2_MOBILE_CALENDAR_SELECTED', null);
        this.listener = DeviceEventEmitter.addListener('C2_MOBILE_CALENDAR_SELECTED', () => {
            this.listener.remove();
            this.setState({
                check: false
            })
        })
        this.setState({
            check: true
        })
        this.props.onPress && this.props.onPress(this.props.date);
    }

    //********************************************************************* */
    //**********************************UI********************************* */
    //********************************************************************* */
    renderContent() {
        var dom = [];
        if (this.state.check) {
            var color = this.props.date.isSame(moment(), 'day') ? this.props.todayColor : this.props.color;
            dom.push(
                <View style={{ alignSelf: 'center', justifyContent: 'center', width: this.props.width / 4 * 3, height: this.props.width / 4 * 3, backgroundColor: 'transparent' }}>
                    <View style={{ position: 'absolute', width: this.props.width / 4 * 3, height: this.props.width / 4 * 3, borderRadius: this.props.width / 8 * 3, backgroundColor: color }} />
                    <Text style={{ fontSize: 12, color: 'white', textAlign: 'center' }}>{this.props.date.date()}</Text>
                </View>
            )
        } else {
            dom.push(
                <Text style={{ alignSelf: 'center', color: this.props.isOver ? this.props.overMonthColor : 'black' }}>{this.props.date.date()}</Text>
            )
            if (this.props.extraData) {
                dom.push(
                    <View style={{ position: 'absolute', alignItems: 'center', bottom: 2, width: this.props.width, }}>
                        <Text style={{ color: this.props.isOver ? this.props.overMonthColor : 'red' }}>{this.props.extraData.color}</Text>
                    </View>
                )
            }
        }
        return dom;

    }

    render() {
        var dom = this.props.render && this.props.render();
        if (dom == null) {
            dom = this.renderContent();
        }
        return (
            <TouchableWithoutFeedback onPress={() => { this._onPress() }}>
                <View style={{ width: this.props.width - 10, minHeight: this.props.width, justifyContent: 'center',marginRight:8 }}>
                    {dom}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

module.exports = C2CalendarDayItem;