'use strict';

import React, {
  Component,
} from 'react-native';

import Constant from '../contactList/Constant';

class EncryptionUtils {
    static fillEncodeData(params){
    if (Constant.NEED_KEY) {
      params.appKey = Constant.APPKEY;
      params.masterSecret = Constant.MASTERSECRET;
    }
  
    return params;
    }

    static encodeData(params,username,password){
    if (Constant.NEED_KEY) {
      params.un = username;
      params.up = password;
      params.appKey = Constant.APPKEY;
      params.masterSecret = Constant.MASTERSECRET;
    }
  
    return params;
    }
}

module.exports = EncryptionUtils;