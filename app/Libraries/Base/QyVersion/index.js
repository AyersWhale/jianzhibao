'use strict'

import{
    NativeModules,
}from 'react-native';

import {
    EventCode
} from  'c2-mobile';

const QyVersion = NativeModules.QyVersion;

class Version {
    static getSystemInfo(){

        return new Promise((resolve,reject)=>{
            QyVersion.getSystemInfo((events,response)=>{
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

module.exports = Version;