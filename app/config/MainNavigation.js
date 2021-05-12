/**
 * Created by liwei on 9/12/16.
 */
'use strict';

import React, {Component} from 'react';
import {Navigator} from 'react-native';
import Main from '../pages/Main';

export default class MainNavigation extends Component{

    render(){
        return(
        <Navigator
            initialRoute={{component: Main}}
            renderScene={(route, navigator) => {
                return <route.component navigator={navigator} {...route.args}/>
                }
            }/>
        );
    }

    componentDidMount(){
        
        // SplashScreen.hide();
    }
}