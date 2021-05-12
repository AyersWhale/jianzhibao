'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import TabBar from '../components/TabBarHome';

export default class MainScene extends Component {
    constructor(props) {
        super(props);

    }

     render(){
        return(
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                 <TabBar navigator={this.props.navigator}/>
            </View>
        );
    }
}