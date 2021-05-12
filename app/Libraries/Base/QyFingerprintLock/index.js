'use strict'

import { NativeModules } from 'react-native';

import { EventCode } from 'c2-mobile';

const QyFingerprintLock = NativeModules.QyFingerprintLock;

class FingerprintLock {
    static getFingerprintLock() {

        return new Promise((resolve, reject) => {
            QyFingerprintLock.getFingerprintLock((response) => {
                // switch(events.code){
                //     case '104201':
                resolve(response);
                //     break;
                //     case '104102':
                //     reject(EventCode['104102'])
                //     break;
                //     default:
                // }
            })
        })
    }
    static isFingerLegal() {
        return new Promise((resolve, reject) => {
            QyFingerprintLock.isFingerLegal((response) => {
                // switch(events.code){
                //     case '104201':
                resolve(response);
                //     break;
                //     case '104102':
                //     reject(EventCode['104102'])
                //     break;
                //     default:
                // }
            })
        })
    }
}
module.exports = FingerprintLock;