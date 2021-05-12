'use strict';
import React,{Component,PropTypes}from 'react';
import {View,ProgressBarAndroid} from 'react-native';
import { Config} from 'c2-mobile';

export default class ProgressBar extends Component {
    static propTypes = {
        ...View.propTypes,
        //当前进度
        progress: PropTypes.number,
        //second progress进度
        buffer: PropTypes.number,
    }


    componentWillReceiveProps(nextProps) {
        this._progress = nextProps.progress;
       
    }

    componentWillMount() {
        this._progress = this.props.progress;
       
    }


    render() {
        return (
            <View style={{flex: 1,}}>
                <ProgressBarAndroid color={Config.C2NavigationBarTintColor} styleAttr='Horizontal' 
                    indeterminate={false} style={{ height: 50, flex: 1, }} />
         </View>
        )
    }

}

Object.defineProperty(ProgressBar.prototype, 'progress', {
    set(value){
        if (value >= 0 && this._progress != value) {
            this._progress = value;
           // this._startAniProgress(value);
        }
    },
    get() {
        return this._progress;
    },
    enumerable: true,
});