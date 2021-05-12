'use strict'

import{
    NativeModules,
}from 'react-native';

import {
    EventCode
} from  'c2-mobile';

const QyFlashlight = NativeModules.QyFlashlight;

class Flashlight {
    static getFlashlight(state){

        return new Promise((resolve,reject)=>{
            QyFlashlight.getFlashlight(state,(events,response)=>{
                switch(events.code){
                    case '104201':
                    resolve(response);
                    break;
                    case '104102':
                    reject(EventCode['104102'])
                    break;
                    default:
                }
            })
        })
    }
}

module.exports = Flashlight;