'use strict';
import React, {
	Component,
} from 'react-native';
import { Config } from 'c2-mobile';

//正式
// var baseUrl1 = Config.mainUrl;
// var url = Config.mainUrl;

/**
 * 服务地址
 */
// var strApiBaseUr = url + "/mobileapp/";
// var strApiBaseUr1 = url + "/mobilebusiness/";
// var strApiBaseUr2 = url + "/mobileworkflow";
// var strApiBaseUr3 = url + "/mobileoafile/";
// var strApiBaseUr4 = url + "/appVersion/";


var API_METHOD = {
	// URL: url,
	// BASEURL1: baseUrl1,
	// BASEURL2: baseUrl2,
	// STR_API_BASEUR: strApiBaseUr,
	// STR_API_BASEUR1: strApiBaseUr1,
	// STR_API_BASEUR2: strApiBaseUr2,
	// STR_API_BASEUR3: strApiBaseUr3,
	// STR_API_BASEUR4: strApiBaseUr4,
	// LOGIN: 'cuslogin',
	// LOGINSERVLET: 'LoginServlet',
	D_login: 'mobilecheckloginUser',
    /**
     * 登录
     * 
     */
	M_Mlogin: 'mlogin',
    /**
		 *  登出
		 *
		 */
	M_Mlogout: 'mlogout',

	/**
	 *  修改密码
	 *
	 */
	M_UpdatePassword: 'updatePassword',
	/**
	 *查询出所有用户列表
	 *
	 */
	M_GetAllusers: 'getAllusers',
	/**
 *根据orgId查询用户列表
 *
 */
	M_QueryUsersByUser: 'queryUsersByUser',

	/**
	 *查询出所有的机构列表
	 *
	 */
	M_QueryAllOrgs: 'queryAllOrgs',
	/**
	 *查询出所有的机构列表
	 *
	 */
	M_GetAllOrgs: 'getAllOrgs',
	/**
	 *查询出所有的新闻列表
	 *
	 */
	M_Getnewslist: 'getnewslist',
	/**
	 *查询出所有的制度规范
	 *
	 */
	M_Getregulationlist: 'getregulationlist',
	/**
	 *查询出所有的制度规范
	 *
	 */
	M_GetpublicAffairslist: 'getpublicAffairslist',
	/**
	 *查询出所有的会议
	 *
	 */
	M_Getmeetinglist: 'getmeetinglist',
	/**
	 *查询出所有的通知公告
	 *
	 */
	M_Getnoticelist: 'ws/oa-publish_getContentMapList',
	/**
 *查询出所有的历史请款
 *
 */
	M_Getrequestlist: 'ws/oa-publish_getContentMapList',
	/**
	 *查询公文管理
	 *
	 */
	M_GetMyDoclist: 'getMyDoclist',
	/**
	 *查询待办信息
	 *
	 */
	M_Gettodo: 'gettodo',
	/**
	 *获取待办详情
	 *
	 */
	M_Getflowdata: 'getflowdata',
	/**
	 *流程下一环节列表
	 *
	 */
	M_GetOutTransition: 'getOutTransition',
	/**
	 *流程环节处理人列表
	 *
	 */
	M_GetFlowHandler: 'getFlowHandler',
	/**
	 *提交批示
	 *
	 */
	M_Submitprocess: 'submitprocess',
	/**
	 *表单id
	 *
	 */
	M_GetFormId: 'getFormId',
	/**
	 *根据手机端获取手机端必填字段
	 *
	 */
	M_Getfields: 'getfields',
	/**
	 *返回上一环节状态
	 *
	 */
	M_Getactivityactions: 'getactivityactions',
	/**
	 *返回上一环节
	 *
	 */
	M_Reject: 'reject',
	/**
	 *返回上一环节：简易版
	 *
	 */
	M_RejectEasy: 'rejectEasy',
	/**
	 *获取附件
	 *
	 */
	M_Getattachfiles: 'getattachfiles',
	/**
	 *删除附件
	 *
	 */
	M_Deleteattachfile: 'deleteattachfile',
	/**
 *新增附件
 *
 */
	M_Addattachfile: 'addUploadFile',
	/**
	 *文档已读记录
	 *
	 */
	M_Addfilereadrecord: 'addfilereadrecord',
	/**
	 *通知已读记录
	 *
	 */
	M_Addnoticereadrecord: 'addnoticereadrecord',
	/**
	 *车辆管理
	 *
	 */
	M_GetCarMgrlist: 'getCarMgrlist',
	/**
	 *驾驶人
	 *
	 */
	M_Getdrivers: 'getdrivers',
	/**
	 *驾驶人
	 *
	 */
	M_GetWorkTotalbyTypes: 'getWorkTotalbyTypes',
	/**
	 *全部工作用户
	 *
	 */
	M_GetAlluserJob: 'getAlluserJob',
	/**
	 *安全生产管理
	 *
	 */
	M_GetSafeMgrlist: 'getSafeMgrlist',

	/**
	 *党政工团
	 *
	 */
	M_Getpgly: 'getpgly',
	/**
	 *党政工团
	 *
	 */
	M_Getculture: 'getculture',
	/**
	 *获取任务处理必要信息
	 *
	 */
	M_Gettaskinfo: 'gettaskinfo',
	/**
 *获取已办详情
 *
 */
	M_Getdonetaskinfo: 'getdonetaskinfo',
	/**
	 *提交审批批示
	 *
	 */

	M_Submitprocesseasy: 'submitprocesseasy',
	/**
	 *调极光推送接口
	 *
	 */
	M_InvokeJpush: 'invokeJpush',
	/**
	 *调极光推送接口
	 *
	 */
	M_DownLoadFile: 'downLoadFile',
	/**
	 *新获取任务处理必要信息
	 */
	M_Gettaskinfoeasy: 'gettaskinfoeasy',

	/**
	 *新的提交待办
	 */
	M_Submitprocesseasytwo: 'submitprocesseasytwo',
	/**
	 *审核挂起
	 */
	M_Suspendprocessinstancesbyid: 'suspendProcessInstancesById',
	/**
	 *版本升级接口
	 */
	M_GetAppVersion: 'getAppVersion',
	/**
	*获取未读数量
	*
	*/
	M_Getindexnums: 'getindexnums',

	/**
	 *获取工资接口
	 */
	M_Getbutie: 'getbutie',

	/**
 *获取工资接口
 */
	M_GetUserSalaryList: 'getUserSalaryList',
	/**
	*获取代办信息
	*
	*/
	M_Gettodoabstractbymodule: 'gettodoabstractbymodule',
	/**
*获取已办信息
*
*/
	M_GetDone: 'getdone',
	/**
	*获取已办分类信息
	*
	*/
	M_Getdoneabstractbytype: 'getdoneabstractbytype',
	/**
	*提交流程
	*
	*/
	M_StartflowEasy: 'startflowEasy',

	/**
*提交简历
*
*/
	M_basicResume: 'basicResume',

	/**
	 * 获取候选人
	 */
	M_GetEasycandidate: 'getEasycandidate',
	//取消推送注册接口
	M_Unregister: 'unregister',
	//推送注册接口
	M_Register: 'register'
};

module.exports = API_METHOD;
