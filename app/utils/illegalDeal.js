'use strict';
import { Toast } from 'c2-mobile'
/**
*非法字符处理的实现
*/
class illegalDeal {

  /**
   *
   * 是否包含非法字符
   */
  static ifillegal(jsonStr) {
    var reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    if (reg.test(jsonStr)) {
      Toast.showInfo("包含特殊字符", 1000)
      jsonStr = jsonStr.replace(/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/g, "");
      return jsonStr;
    } else {
      return jsonStr;
    }
  }
  /**
    *
    * 金额是否非法字符
    */
  static ifillegalNum(num) {
    var exp = /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/;
    if (!exp.test(num)) {
      Toast.showInfo("输入格式不对,请重新输入", 1000)
      num = "";
      return num;
    } else {
      return num;
    }
  }
  /**
      *
      * 每日工作时长判断
      */
  static ifillegalNum_workhour(num) {
    var exp = /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/;
    if (!exp.test(num)) {
      Toast.showInfo("输入格式不对,请重新输入", 1000)
      num = "";
      return num;
    } else if (num > 24) {
      Toast.showInfo("不能超过24小时", 1000)
      return "";
    } else {
      return num;
    }
  }
}

module.exports = illegalDeal;
