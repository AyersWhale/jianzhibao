'use strict';
import React, {
  Component,
  Alert,
} from 'react-native';
import JsonUitl from '../JsonUitl';
import Global from '../../utils/GlobalStorage';
import { C2Fetch, Config, Actions } from 'c2-mobile';
import Toast from 'react-native-root-toast';
var newConect = 1;
class HttpHelper {
  //post请求From
  static sendRequest(url, methodName, params, callback) {
    let jsonStr = JsonUitl.jsonToString(params);
    var isOk;
    let host = createUrl(url, methodName);

    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'req=' + jsonStr + ''
    };

    fetch(host, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        console.log('responseText = ', responseText);
        //Toast.show(responseText.status, { position: -80 });//responseText.status是空的
        if (new RegExp("HTTP Status 404").exec(responseText)) {
          // Global.getValueForKey('loginAgain').then((ret) => {
          //    ret.resetTo({ name: "Login", component: Login });
          //   });
          // callback("服务器异常，请联系管理员！");
          callback(10);
        } else {
          newConect = 0;
          callback(JSON.parse(responseText));
        }
      }).catch((error) => {
        if (error.message == 'Network request failed') { Toast.show('网络异常、请稍后再试', { position: -80 }); }
        if (error.message.indexOf('JSON') == 0) {
          Toast.show('登录信息失效,重新登录', { position: -80 });
          Actions.Login({ type: 'reset' });
        }
      })
  }
  //****************************************************
  //********************异步请求**************************
  //****************************************************
  static getJson(url, qurey) {

    return new Promise(function (resolve, reject) {
      var customMode = false;
      if (typeof url == 'object') {
        customMode = true;
      }

      var qureyText = '';
      for (var key in qurey) {
        var value = qurey[key];
        if (typeof value != 'number' && typeof value != 'string' && typeof value != 'bool') {
          for (var k in value) {
            qureyText += key + '=' + value[k] + '&';
          }
        } else {
          qureyText += key + '=' + value + '&';
        }
      }
      var completeUrl = (customMode ? url.url : url) + (qurey != null ? '?' + qureyText : '');
      //方法
      var requestMethod = 'GET';
      //send
      HttpHelper.baseFetchJson(completeUrl, requestMethod, customMode ? url.header : null)
        .then((response) => {
          resolve(response.json());
        }).catch((error) => {
          console.log('GET_JSON:' + url + '请求失败================================');
          reject(error);
        });
    })
  }
  //基础请求
  static baseFetchJson(url, requestMethod, requestHeader, requestBody) {

    if (requestHeader == null) {
      requestHeader = {
        'accept': 'application/json',
        'content-type': 'application/json',
      };
    } else {
      requestHeader = Object.assign({}, { 'accept': 'application/json', 'content-type': 'application/json', }, requestHeader)
    }

    //判定是否为接入C2统一认证项目
    if (Config.C2Project) {
      Object.assign(requestHeader, { 'Authorization': 'Bearer ' + Config.accesstoken });
    }
    var requestGroup = { method: requestMethod, headers: requestHeader, body: requestBody };

    if (!url.indexOf('http') == 0) {
      url = Config.mainUrl + url;
    }
    console.log('请求地址:' + url);
    return new Promise(function (resolve, reject) {

      return fetch(url, requestGroup)
        .then((response) => {

          if (response.status == 200) {
            resolve(response, response.status);
            return;
          }

          if (response.status == 401) {
            console.log("权限失效");
            reject({ status: 401, description: '权限失效' }, response.status);
            return
          }

          if (response.status == 501) {
            console.log("服务错误");
            reject({ status: 501, description: '服务错误' }, response.status);
            return
          }


        }).catch((error) => {

          reject(error);
        });

    });

  }
  static getRequest(url, params, ) {
    let jsonStr = JsonUitl.jsonToString(params);
    var isOk;
    let host = createUrl(url, methodName);

    var fetchOptions = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: jsonStr + ''
    };

    fetch(host, fetchOptions)
      .then((response) => { response.text() })
      .then((responseText) => {
        console.log('responseText = ', responseText);

      }).catch((error) => {
        console.log('responseText = ', error);

      }).done();

  }


  static sendRequests(url, methodName, data, callback) {
    var fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        //json形式
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    let host = createUrl(url, methodName);
    fetch(host, fetchOptions)
      .then((response) => response.text())
      .then((responseText) => {
        callback(JSON.parse(responseText));
      }).catch((error) => {

      }).done();
  }
}


function createUrl(url, methodName) {
  return url + '/' + methodName;
}



function showAlert(error) {
  let errorContent = '网络请求失败，请稍后再试！'
  let errorTitle = '当前网络异常！'
  if (error == 'Error: request timeout')
    errorContent = '网络请求超时或未接入公司网络，请检查网络后再试！'
  Alert.alert(errorTitle, errorContent, [{ text: '确认' },]);
}
module.exports = HttpHelper;