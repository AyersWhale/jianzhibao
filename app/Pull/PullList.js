'use strict';

import React, { Component } from 'react';
import { ListView } from 'react-native';

import Pullable from './Pullable';

/**
支持android&ios可以下拉刷新的PullList组件
*/

export default class PullList extends Pullable {

    constructor(props) {
        super(props);
        this.getMetrics = this.getMetrics.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.scrollToEnd = this.scrollToEnd.bind(this);
    }

    getMetrics(args) {
        this.scroll.getMetrics(args);
    }

    scrollTo(...args) {
        this.scroll.scrollTo(...args);
    }

    scrollToEnd(args) {
        this.scroll.scrollToEnd(args);
    }

    getScrollable() {
        return (
            <ListView ref={(c) => {this.scroll = c;}} scrollEnabled={this.state.scrollEnabled} onScroll={this.onScroll} {...this.props} />
        );
    }
}
