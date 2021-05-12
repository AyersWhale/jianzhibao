'use strict';
import React, {
  Component,
} from 'react-native';

/**
*JsonUitl的实现
*/
class JsonUitl {

 /**
  *
  * json字符串转json对象
  */
  static stringToJson(jsonStr){
    return JSON.parse(jsonStr);
  }

 /**
  * 对象转json字符串
  */
  static jsonToString(obj){
    return JSON.stringify(obj);
  }
  /**
  *map转换为json
  */
  static mapToJson(map) {
  return JSON.stringify(JsonUitl.strMapToObj(map));
  }
  /**
  *json转换为map
  */
  static jsonToMap(jsonStr){
    return  JsonUitl.objToStrMap(JSON.parse(jsonStr));
  }


 /**
 *map转化为对象（map所有键都是字符串，可以将其转换为对象）
 */
 static strMapToObj(strMap){
    let obj= Object.create(null);
    for (let[k,v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }

/**
*对象转换为Map
*/
static  objToStrMap(obj){
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k,obj[k]);
  }
  return strMap;
}


}

module.exports = JsonUitl;
