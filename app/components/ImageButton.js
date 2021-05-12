/**
 * Created by marno on 2017/6/7
 * Function: 可点击的 Image 组件
 * Desc:
 */
import React, {Component} from 'react';
import {Image, TouchableWithoutFeedback,TouchableOpacity,Platform,ImageBackground} from 'react-native';

export default class ImageButton extends Component {
    render() {
        if(Platform.OS ==='ios'){
             return (
            <TouchableOpacity onPress={this.props.onPress}>
                <ImageBackground
                    style={this.props.style}
                    source={this.props.source}
                >
                    {this.props.children}
                </ImageBackground>
            </TouchableOpacity>)
        }else{
             return (
            <TouchableWithoutFeedback onPress={this.props.onPress}>
                <ImageBackground
                    style={this.props.style}
                    source={this.props.source}
                >
                    {this.props.children}
                </ImageBackground>
            </TouchableWithoutFeedback>)
        }
    }
}