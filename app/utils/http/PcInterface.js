'use strict';
import React, {
  Component,
} from 'react-native';
import HttpHelper from './HttpHelper'
import HttpConstant from './HttpConstant'
import { Config } from 'c2-mobile'
class PcInterface {
  static Differlogin(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/ws", HttpConstant.D_login, params, callback);
  }
  /**
  * 登录
  * 
  */
  static login(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp", HttpConstant.M_Mlogin, params, callback);
  }
  /**
   * 判断登录
   * 
   */
  static isLogin(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_MsiLogin, params, callback);
  }

  /**
   * 登出
   * 
   */
  static logout(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_Mlogout, params, callback);
  }

  /**
   *  修改密码
   *
   */
  static updatePassword(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_UpdatePassword, params, callback);
  }

  /**
 *查询出所有用户列表
 *
 */
  static getAllusers(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_GetAllusers, params, callback);
  }
  /**
    *根据orgId查询出所有用户列表
    *
    */
  static queryUsersByUser(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_QueryUsersByUser, params, callback);
  }
  /**
   *查询出所有的机构列表
   *
   */
  static queryAllOrgs(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_QueryAllOrgs, params, callback);
  }

  /**
   *查询出所有的机构列表
   *
   */
  static getAllOrgs(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetAllOrgs, params, callback);
  }

	/**
		 *查询公文管理
		 *
		 */
  static getMyDoclist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetMyDoclist, params, callback);
  }

  static getnewslist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getnewslist, params, callback);
  }

  static getnewslist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getnewslist, params, callback);
  }
  /**
   *查询出所有的通知公告
   *
   */
  static getnoticelist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getnoticelist, params, callback);
  }
  /**
  *查询出所有的历史请款
  *
  */
  static getrequestlist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/budget/v1/mExpensesApplyList?page=1&rows=10", HttpConstant.M_Getrequestlist, params, callback);
  }

	/**
		 *查询出所有办事公开
		 *
		 */
  static getpublicAffairslist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetpublicAffairslist, params, callback);
  }
  /**
   *获取已办信息
   *
   */
  static getdone(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_GetDone, params, callback);
  }
  /**
 *提交流程
 *
 */
  static startflowEasy(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_StartflowEasy, params, callback);
  }

  /**
*提交简历
*
*/
  static basicResume(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/qyqymanager?nd=1544253992055&_search=false&rows=10&page=1&sidx=&sord=&cond=%7B%7D", HttpConstant.M_basicResume, params, callback);
  }


  /**
   *查询出所有的会议
   *
   */
  static getmeetinglist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getmeetinglist, params, callback);
  }

	/**
		 *安全生产管理
		 *
		 */
  static getSafeMgrlist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetSafeMgrlist, params, callback);
  }
  /**
   *党政工团
   *
   */
  static getpgly(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getpgly, params, callback);
  }
  /**
     *企业文化
     *
     */
  static getculture(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getculture, params, callback);
  }
  /**
   *查询出所有的制度规范
   *
   */
  static getregulationlist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getregulationlist, params, callback);
  }
  /**
   *附件列表
   *
   */
  static getattachfiles(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileoafile/", HttpConstant.M_Getattachfiles, params, callback);
  }
  /**
     *查询待办信息
     *
     */
  static gettodo(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Gettodo, params, callback);
  }
  /**
     *查询已读待办信息
     *
     */
  static getdone(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_GetDone, params, callback);
  }
  /**
     *查询已读待办信息分类
     *
     */
  static getdoneabstractbytype(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Getdoneabstractbytype, params, callback);
  }
  /**
    *查询待办分类
    *
    */
  static gettodoabstractbytype(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Gettodoabstractbytype, params, callback);
  }
  /**
 *表单ID
 *
 */
  static getFormId(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_GetFormId, params, callback);
  }

  /**
*新获取任务处理必要信息
*
*/
  static gettaskinfoeasy(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Gettaskinfoeasy, params, callback);
  }

  /**
 *新获取任务处理必要信息
 *
 */
  static gettaskinfo(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Gettaskinfo, params, callback);
  }
  /**
   * 获取候选人
   * 
   */

  static getEasycandidate(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_GetEasycandidate, params, callback);
  }
  /**
*新获取已办详情
*
*/
  static getdonetaskinfo(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Getdonetaskinfo, params, callback);
  }
  /**
      *公司会议列表
      *
      */
  static getmeetinglist(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getmeetinglist, params, callback);
  }

  /**M_Addfilereadrecord
        *通知已读记录
        *
        */
  static addnoticereadrecord(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Addnoticereadrecord, params, callback);
  }
  /**
        *通知公文已读记录
        *
        */
  static addfilereadrecord(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Addfilereadrecord, params, callback);
  }

  /**
   *pdf下载
   *
   */
  static downLoadFile(params, callback) {
    return HttpHelper.getInstance(context).downLoadFile(headImgUrl, callBack,
      true);
  }

  /**
        *新的提交待办
        *
        */
  static submitprocesseasy(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Submitprocesseasy, params, callback);
  }
  /**
      *待办挂起
      *
      */
  static suspendProcessInstancesById(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Suspendprocessinstancesbyid, params, callback);
  }


	/**
	 *返回上一环节：简易版
	 *
	 */
  static rejectEasy(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_RejectEasy, params, callback);
  }
  /**
     *返回上一环节
     *
     */
  static reject(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Reject, params, callback);
  }
  /**
 *版本升级接口
 *
 */
  static getAppVersion(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/appVersion/", HttpConstant.M_GetAppVersion, params, callback);
  }

	/**
	 *调极光推送接口
	 *
	 */
  static invokeJpush(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_InvokeJpush, params, callback);
  }

  /**
	 *获取工资接口
	 */
  static getbutie(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getbutie, params, callback);
  }

  /**
 *获取工资接口
 */
  static getUserSalaryList(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetUserSalaryList, params, callback);
  }

  /**
 *获取代办信息
 */
  static gettodoabstractbymodule(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileworkflow/", HttpConstant.M_Gettodoabstractbymodule, params, callback);
  }
  /**
*获取系统消息列表
*/
  static getUserMessageListForPage(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileapp/", HttpConstant.M_GetUserMessageListForPage, params, callback);
  }
  /**
	 *签到新增接口
	 */
  static addCenterAttend(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_AddCenterAttend, params, callback);
  }  /**
	 *签退接口
	 */
  static updateCenterAttend(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_UpdateCenterAttend, params, callback);
  }  /**
	 *获取签到详情接口
	 */
  static getAttendInfo(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetAttendInfo, params, callback);
  }
  /**
  *获取我的打卡地点接口
  */
  static getmyattendlocations(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Getmyattendlocations, params, callback);
  }
  /**
  *获取我的打卡地点合法状态接口
  */
  static validateattendstatus(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_Validateattendstatus, params, callback);
  }
  /**
  *获取待办，通知等未读数量接口
  */
  static getindexnums(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness", HttpConstant.M_Getindexnums, params, callback);
  }
  /**
  *获取系统通知接口
  */
  static getUserMessage(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_GetUserMessage, params, callback);
  }
  /**
  *新增推送对象接口
  */
  static addPushMessage(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_AddPushMessage, params, callback);
  }
  /**
  *新增推送注册接口
  */
  static register(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/messagepush/", HttpConstant.M_Register, params, callback);
  }
  /**
	 *删除推送注册接口
	 */
  static unregister(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/messagepush/", HttpConstant.M_Unregister, params, callback);
  }
  /**
  *获取系统通知接口
  */
  static deletePushMessage(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobilebusiness/", HttpConstant.M_DeletePushMessage, params, callback);
  }
  /**
 *删除附件接口
 */
  static deleteattachfile(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileoafile/", HttpConstant.M_Deleteattachfile, params, callback);
  }
  /**
    *增加附件接口
    */
  static addUploadFile(params, callback) {
    return HttpHelper.sendRequest(Config.mainUrl + "/mobileoafile/", HttpConstant.M_Addattachfile, params, callback);
  }
}
module.exports = PcInterface;