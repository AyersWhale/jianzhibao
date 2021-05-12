/**
 * Created by liwei on 10/12/16.
 */
'use strict';

import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import Login from '../pages/Login';
import authcodeLogin from '../pages/authcodeLogin';

import MainNavigation from '../config/MainNavigation';
import MessageFragment from '../pages/MessageFragment';
import HomeFragment from '../pages/HomeFragment';
import CityChoose from '../utils/CityChoose';
import CitySelect from '../utils/CitySelect';
import ConditionFilter from '../pages/ConditionFilter';
import ConditionFilterResume from '../pages/ConditionFilterResume';
import DocumentList from '../pages/DocumentList';
import ConversationInfo from '../pages/ConversationInfo';
import RecordVideo from '../pages/RecordVideo';
import ContactsFragment from '../pages/ContactPage/ContactsFragment';
import TabBar from '../components/TabBarHome';
import UserInfoView from '../pages/home/UserInfoView';
import UserInfoViewChange from '../pages/home/UserInfoViewChange';
import ChangePassword from '../pages/home/ChangePassword';
import About from '../pages/home/About';
import AboutInfo from '../pages/home/AboutInfo';
import C2WebView from '../components/C2WebView';
import ImageZoom from '../components/ImageZoom';
import ImageView from '../components/ImageView';
import PDFWebView from '../components/PDFWebView';
import { Actions, Scene, Router, UUID } from 'c2-mobile';
import GestureOpenFragment from '../pages/home/GestureOpenFragment';
import FingureUnlock from '../pages/home/FingureUnlock';
import Ipmodify from '../pages/Ipmodify';
import Contact from '../pages/Contact';
import ApplicationFragment from '../pages/ApplicationFragment';
import Ewm from '../pages/home/Ewm';
import Mycontact from '../pages/ContactPage/Mycontact';
import ContactInfo from '../pages/ContactPage/ContactInfo';
import Newclass from '../pages/ContactPage/Newclass';
import ContactsNative from '../pages/ContactPage/ContactsNative';
import MyCollection from '../pages/ContactPage/MyCollection';
import QyContact from '../pages/ContactPage/QyContact';
import JobCircle from '../pages/WorkPlace/JobCircle';
import AddCircleMsg from '../pages/WorkPlace/AddCircleMsg';
// import GetPhoneNum from '../../node_modules/qysyb-mobile/Libraries/Base/QyVerificationCode/GetPhoneNum';
// import GetVerifyCode from '../../node_modules/qysyb-mobile/Libraries/Base/QyVerificationCode/GetVerifyCode';
import ChangeTx from '../pages/WorkPlace/ChangeTx';
import LoginSettings from '../pages/home/LoginSettings';
import PersonSettings from '../pages/home/PersonSettings';
import GesturePassword from '../pages/home/GesturePassword';
import MainWebView from '../components/MainWebView';
import TodoDealPage from '../pages/TodoDealPage';
import ScanCode from '../pages/ScanCode';
import ForgetPassword from '../pages/ForgetPassword';
import Register from '../pages/Register';
import IdCard from '../pages/IdCard';
import MyApplicate from '../pages/MyApplicate';
import MyJob from '../pages/MyJob';
import CountMoney from '../pages/CountMoney';
import CheckProgress from '../pages/CheckProgress';
import CheckCGW from '../pages/CheckCGW';
import SubmitAchieve from '../pages/SubmitAchieve';
import MySalary from '../pages/MySalary';
import ApplyForJob from '../pages/ApplyForJob';
import RegistLicense from '../pages/RegistLicense';
import UploadAchievement from '../pages/UploadAchievement';
import Temporary from '../pages/Temporary';
import ChoosePeople from '../pages/ChoosePeople';
import PublicJob from '../pages/WorkPlace/PublicJob';
import PublicJob1 from '../pages/WorkPlace/PublicJob1';
import PublicJob2 from '../pages/WorkPlace/PublicJob2';
import RequireTicket from '../pages/WorkPlace/RequireTicket';
import RequireTicket_new from '../pages/WorkPlace/RequireTicket_new';
import CompanyAudit from '../pages/CompanyAudit';
import PersonalAudit from '../pages/PersonalAudit';
import CountInform from '../pages/CountInform';
import PublicPositionInform from '../pages/PublicPositionInform';
import MyJobInform from '../pages/MyJobInform';
import LSYGJobInform from '../pages/LSYGJobInform';
import MessageDetails from '../pages/MessageDetails';
import JobInform from '../pages/JobInform';
import ResumeInform from '../pages/ResumeInform';
import ChooseResumeInform from '../pages/ChooseResumeInform';
import YingpinResumeInform from '../pages/YingpinResumeInform';
import Qiyeshenhe from '../pages/Qiyeshenhe';
import Qiyerenzheng from '../pages/Qiyerenzheng';
import UndeterminedContract from '../pages/UndeterminedContract';
import UndeterminedContract0 from '../pages/UndeterminedContract0';
import UndeterminedContract1 from '../pages/UndeterminedContract1';
import UndeterminedContract2 from '../pages/UndeterminedContract2';
import UndeterminedContract3 from '../pages/UndeterminedContract3';
import RenzhengDetail from '../pages/RenzhengDetail';
import PublicPosition from '../pages/PublicPosition';
import ResumeSearch from '../pages/ResumeSearch';
import InterviewResult from '../pages/InterviewResult';
import PersonFiltrate from '../pages/PersonFiltrate';
import TicketCheck from '../pages/TicketCheck';
import RequireTicketPick from '../pages/RequireTicketPick';
import NoticelistFragment from '../pages/NoticelistFragment';
import ApplicationManage from '../../node_modules/qysyb-mobile/Libraries/Base/QyPortal/ApplicationManage';
//通讯录
import {
  C2ABContactsDetail,
  C2ABSelectOrganization,
  C2ABOrganizationList,
  createStore,
  SearchOrganizationList,
  SearchContactDetail,
} from 'qysyb-mobile-contacts';

import { Provider, connect } from 'react-redux'
import ChangeUserFragment from '../pages/home/ChangeUserFragment';
import AddUser from '../pages/home/AddUser';
import Advice from '../pages/home/Advice';
import AdviceDM from '../pages/home/AdviceDM';
import Kaoqin from '../pages/WorkPlace/kaoqin';
import kaoqinHistory from '../pages/WorkPlace/kaoqinHistory';
import kaoqinContent from '../pages/WorkPlace/kaoqinContent';
import chooseCompany from '../pages/WorkPlace/chooseCompany';
import Ticket from '../pages/WorkPlace/Ticket';
import TicketCreat from '../pages/WorkPlace/TicketCreat';
import TicketMine from '../pages/WorkPlace/TicketMine';
import Fangdai from '../pages/WorkPlace/Fangdai';
import Qianming from '../pages/WorkPlace/Qianming';
import TicketEwm from '../pages/WorkPlace/TicketEwm';
import Leave from '../pages/WorkPlace/Leave';
import Jianli from '../pages/WorkPlace/Jianli';
import AddAccount from '../pages/WorkPlace/AddAccount';
import AccountMge from '../pages/WorkPlace/AccountMge';
import AddNewJob from '../pages/WorkPlace/AddNewJob';
import ApplyFP from '../pages/WorkPlace/ApplyFP';
import ApplyFPList from '../pages/WorkPlace/ApplyFPList';
import Wodejingli from '../pages/WorkPlace/Wodejingli';
import Intended from '../pages/WorkPlace/Intended';
import JobSearch from '../pages/JobSearch'
import PersonalAuditCheck from '../pages/PersonalAuditCheck';
import CompanyAuditCheck from '../pages/CompanyAuditCheck';
import Zhizhaoshenhe from '../pages/Zhizhaoshenhe';
import Fabaoshenhe from '../pages/Fabaoshenhe';
import ScanCodeLogin from '../pages/ScanCodeLogin';
import ContactFj from '../pages/ContactFj';

const store = createStore();

const RouterWithRedux = connect()(Router);

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="Login" component={Login} title="登录" hideNavBar={true} />
    <Scene key="authcodeLogin" component={authcodeLogin} title="验证码登录" hideNavBar={true} />
    <Scene key="MainNavigation" component={MainNavigation} hideNavBar={true} />
    <Scene key="HomeFragment" component={HomeFragment} title="首页" hideNavBar={true} />
    <Scene key="CityChoose" component={CityChoose} title="城市选择" hideNavBar={true} />
    <Scene key="CitySelect" component={CitySelect} title="城市" hideNavBar={true} />
    <Scene key="ConditionFilter" component={ConditionFilter} title="筛选" hideNavBar={true} />
    <Scene key="ConditionFilterResume" component={ConditionFilterResume} title="筛选" hideNavBar={true} />
    <Scene key="MessageFragment" component={MessageFragment} title="发现" hideNavBar={false} />
    <Scene key="UserInfoView" component={UserInfoView} title="个人信息" hideNavBar={true} />
    <Scene key="UserInfoViewChange" component={UserInfoViewChange} title="信息修改" hideNavBar={true} />
    <Scene key="ChangePassword" component={ChangePassword} title="修改密码" hideNavBar={true} />
    <Scene key="About" component={About} title="关于" hideNavBar={true} />
    <Scene key="AboutInfo" component={AboutInfo} title="关于" hideNavBar={true} />
    <Scene key="ContactsFragment" component={ContactsFragment} title="通讯录" hideNavBar={false} />
    <Scene key="ForgetPassword" component={ForgetPassword} title="忘记密码" hideNavBar={true} />
    <Scene key="Register" component={Register} title="注册" hideNavBar={true} />
    <Scene key="C2WebView" component={C2WebView} hideNavBar={true} />
    <Scene key="ImageZoom" component={ImageZoom} title="查看" hideNavBar={false} />
    <Scene key="ImageView" component={ImageView} title="图片查看" hideNavBar={false} />
    <Scene key="PDFWebView" component={PDFWebView} hideNavBar={true} />
    <Scene key="TabBar" component={TabBar} hideNavBar={true} />
    <Scene key="GestureOpenFragment" component={GestureOpenFragment} title="手势密码" hideNavBar={false} />
    <Scene key="FingureUnlock" component={FingureUnlock} title="指纹解锁" hideNavBar={false} />
    <Scene key="GesturePassword" component={GesturePassword} title="设置手势密码" hideNavBar={true} />
    <Scene key="Ewm" component={Ewm} title="APP下载" hideNavBar={false} />
    <Scene key="Ipmodify" component={Ipmodify} title="网络设置" hideNavBar={false} />
    <Scene key="MainWebView" component={MainWebView} title="" hideNavBar={true} />
    <Scene key="ApplicationManage" component={ApplicationManage} title="应用管理" hideNavBar={false} />
    <Scene key="NoticelistFragment" component={NoticelistFragment} title="通知公告" hideNavBar={true} />
    <Scene key="ContactInfo" component={ContactInfo} title="联系人详情" hideNavBar={true} />
    <Scene key="Mycontact" component={Mycontact} title="我的群组" hideNavBar={false} />
    <Scene key="Newclass" component={Newclass} title="新建群组" hideNavBar={false} />
    <Scene key="ContactsNative" component={ContactsNative} title="手机通讯录" hideNavBar={false} />
    <Scene key="MyCollection" component={MyCollection} title="关注" hideNavBar={false} />
    <Scene key="QyContact" component={QyContact} title="企业通讯录" hideNavBar={false} />
    <Scene key="kaoqinContent" component={kaoqinContent} title="考勤详情" hideNavBar={false} />
    <Scene key="chooseCompany" component={chooseCompany} title="选择打卡公司" hideNavBar={true} />

    <Scene key="C2ABSelectOrganization" component={C2ABSelectOrganization} title="选择组织机构" hideNavBar={true} />
    <Scene key="C2ABOrganizationList" component={C2ABOrganizationList} title="选择组织机构" hideNavBar={true} />
    <Scene key="C2ABContactsDetail" component={C2ABContactsDetail} title="联系人详情" hideNavBar={true} />
    <Scene key="SearchOrganizationList" component={SearchOrganizationList} title="搜索联系人" hideNavBar={true} />
    <Scene key="SearchMessage" component={SearchOrganizationList} title="搜索聊天信息" hideNavBar={true} />
    <Scene key="ConversationInfo" component={ConversationInfo} title="聊天信息" hideNavBar={true} />
    <Scene key="RecordVideo" component={RecordVideo} title="录制视频" hideNavBar={true} />
    <Scene key="SearchContactDetail" component={SearchContactDetail} title="联系人详情" hideNavBar={true} />
    <Scene key="TodoDealPage" component={TodoDealPage} title="待办处理" hideNavBar={true} />
    <Scene key="UndeterminedContract" component={UndeterminedContract} title="待签合同" hideNavBar={true} />
    <Scene key="Qiyeshenhe" component={Qiyeshenhe} title="企业审核" hideNavBar={true} />
    <Scene key="Qiyerenzheng" component={Qiyerenzheng} title="企业认证" hideNavBar={true} />
    <Scene key="Fabaoshenhe" component={Fabaoshenhe} title="发包审核" hideNavBar={true} />
    <Scene key="ScanCodeLogin" component={ScanCodeLogin} title="扫码登录" hideNavBar={true} />
    <Scene key="Zhizhaoshenhe" component={Zhizhaoshenhe} title="执照认证" hideNavBar={true} />
    <Scene key="UndeterminedContract0" component={UndeterminedContract0} title="企业审核" hideNavBar={true} />
    <Scene key="UndeterminedContract1" component={UndeterminedContract1} title="企业认证" hideNavBar={true} />
    <Scene key="UndeterminedContract2" component={UndeterminedContract2} title="执照审核" hideNavBar={true} />
    <Scene key="UndeterminedContract3" component={UndeterminedContract3} title="发包审核" hideNavBar={true} />
    <Scene key="RenzhengDetail" component={RenzhengDetail} title="认证详情" hideNavBar={true} />
    <Scene key="PublicPosition" component={PublicPosition} title="职位发布" hideNavBar={true} />
    <Scene key="ResumeSearch" component={ResumeSearch} title="简历搜索" hideNavBar={true} />
    <Scene key="InterviewResult" component={InterviewResult} title="面试结果" hideNavBar={true} />
    <Scene key="ApplyForJob" component={ApplyForJob} title="申请接包" hideNavBar={true} />
    <Scene key="RegistLicense" component={RegistLicense} title="注册电子营业执照" hideNavBar={true} />
    <Scene key="UploadAchievement" component={UploadAchievement} title="上传成果物" hideNavBar={true} />
    <Scene key="Temporary" component={Temporary} title="临时承揽" hideNavBar={true} />
    <Scene key="ChoosePeople" component={ChoosePeople} title="选择接包人" hideNavBar={true} />
    <Scene key="PublicJob" component={PublicJob} title="发包内容填写" hideNavBar={true} />
    <Scene key="PublicJob1" component={PublicJob1} title="发包内容编辑" hideNavBar={true} />
    <Scene key="PublicJob2" component={PublicJob2} title="发包审核" hideNavBar={true} />
    <Scene key="RequireTicket_new" component={RequireTicket_new} title="申请开票" hideNavBar={true} />
    <Scene key="RequireTicket" component={RequireTicket} title="申请开票" hideNavBar={true} />
    <Scene key="CompanyAudit" component={CompanyAudit} title="企业审核" hideNavBar={true} />
    <Scene key="PersonalAudit" component={PersonalAudit} title="个人审核" hideNavBar={true} />
    <Scene key="PersonalAuditCheck" component={PersonalAuditCheck} title="个人审核查看" hideNavBar={true} />
    <Scene key="CompanyAuditCheck" component={CompanyAuditCheck} title="企业审核查看" hideNavBar={true} />
    <Scene key="PersonFiltrate" component={PersonFiltrate} title="结算查询" hideNavBar={true} />
    <Scene key="TicketCheck" component={TicketCheck} title="开票记录" hideNavBar={true} />
    <Scene key="RequireTicketPick" component={RequireTicketPick} title="申请开票选择" hideNavBar={true} />
    <Scene key="ApplicationFragment" component={ApplicationFragment} title="我的" hideNavBar={true} />
    <Scene key="ScanCode" component={ScanCode} title="扫一扫" hideNavBar={true} />
    <Scene key="ChangeUserFragment" component={ChangeUserFragment} title="切换账号" hideNavBar={true} />
    <Scene key="AddUser" component={AddUser} title="新增账号" hideNavBar={false} />
    <Scene key="Advice" component={Advice} title="意见与反馈" hideNavBar={true} />
    <Scene key="AdviceDM" component={AdviceDM} title="帮助" hideNavBar={true} />
    <Scene key="LoginSettings" component={LoginSettings} title="登录设置" hideNavBar={true} />
    <Scene key="IdCard" component={IdCard} title="身份证录入" hideNavBar={true} />
    <Scene key="PersonSettings" component={PersonSettings} title="偏好设置" hideNavBar={false} />
    <Scene key="Kaoqin" component={Kaoqin} title="考勤" hideNavBar={true} />
    <Scene key="kaoqinHistory" component={kaoqinHistory} title="考勤记录" hideNavBar={true} />
    <Scene key="Contact" component={Contact} title="消息" hideNavBar={true} />
    <Scene key="DocumentList" component={DocumentList} title="公文列表" hideNavBar={true} />
    <Scene key="JobCircle" component={JobCircle} title="工作圈" hideNavBar={true} />
    <Scene key="AddCircleMsg" component={AddCircleMsg} title="新增工作圈" hideNavBar={true} />
    <Scene key="Ticket" component={Ticket} title="发票开具" hideNavBar={true} />
    <Scene key="TicketCreat" component={TicketCreat} title="编辑发票" hideNavBar={true} />
    <Scene key="TicketMine" component={TicketMine} title="我的发票" hideNavBar={true} />
    <Scene key="TicketEwm" component={TicketEwm} title="发票抬头" hideNavBar={true} />
    <Scene key="Fangdai" component={Fangdai} title="房贷计算器" hideNavBar={true} />
    <Scene key="Qianming" component={Qianming} title="签名板" hideNavBar={true} />
    <Scene key="Leave" component={Leave} title="请假" hideNavBar={true} />
    <Scene key="Jianli" component={Jianli} title="简历" hideNavBar={true} />
    <Scene key="AccountMge" component={AccountMge} title="银行卡信息" hideNavBar={true} />
    <Scene key="AddAccount" component={AddAccount} title="银行卡信息" hideNavBar={true} />
    <Scene key="MyApplicate" component={MyApplicate} title="我的申请" hideNavBar={true} />
    <Scene key="MyJob" component={MyJob} title="我的工作" hideNavBar={true} />
    <Scene key="CountMoney" component={CountMoney} title="发起结算" hideNavBar={true} />
    <Scene key="CheckProgress" component={CheckProgress} title="查看结算进度" hideNavBar={true} />
    <Scene key="SubmitAchieve" component={SubmitAchieve} title="提交成果物" hideNavBar={true} />
    <Scene key="CheckCGW" component={CheckCGW} title="查看成果物" hideNavBar={true} />
    <Scene key="MySalary" component={MySalary} title="我的收入" hideNavBar={true} />
    <Scene key="CountInform" component={CountInform} title="结算详情" hideNavBar={true} />
    <Scene key="PublicPositionInform" component={PublicPositionInform} title="发布职位详情" hideNavBar={true} />
    <Scene key="MyJobInform" component={MyJobInform} title="工作详情" hideNavBar={true} />
    <Scene key="LSYGJobInform" component={LSYGJobInform} title="工作详情" hideNavBar={true} />
    <Scene key="MessageDetails" component={MessageDetails} title="消息详情" hideNavBar={true} />
    <Scene key="JobInform" component={JobInform} title="职位详情" hideNavBar={true} />
    <Scene key="ResumeInform" component={ResumeInform} title="简历详情" hideNavBar={true} />
    <Scene key="ChooseResumeInform" component={ChooseResumeInform} title="临时承揽选人简历详情" hideNavBar={true} />
    <Scene key="YingpinResumeInform" component={YingpinResumeInform} title="应聘简历详情" hideNavBar={true} />
    <Scene key="Wodejingli" component={Wodejingli} title="我的工作经历" hideNavBar={true} />
    <Scene key="AddNewJob" component={AddNewJob} title="新增职位" hideNavBar={true} />
    <Scene key="ApplyFP" component={ApplyFP} title="发票申请" hideNavBar={true} />
    <Scene key="ApplyFPList" component={ApplyFPList} title="发票列表" hideNavBar={true} />
    <Scene key="JobSearch" component={JobSearch} title="职位搜索" hideNavBar={false} />
    <Scene key="ContactFj" component={ContactFj} title="附件列表" hideNavBar={false} />
    <Scene key="ChangeTx" component={ChangeTx} title="个人信息" hideNavBar={true} />
    <Scene key="Intended" component={Intended} title="意向行业" hideNavBar={true} />
    {/* <Scene key="GetVerifyCode" component={GetVerifyCode} title="验证码登陆" hideNavBar={true} />
    <Scene key="GetPhoneNum" component={GetPhoneNum} title="验证码登陆" hideNavBar={true} /> */}
  </Scene>
);


export default class Navigation extends Component {
  _console(store) {
    if (store.currentScene == "TabBar" || store.currentScene == "Login" || store.currentScene == "authcodeLogin") {
      BackHandler.exitApp();
      return false;
    }
    if (store.currentScene == 'TodoCheckPage' || store.currentScene == 'C2WebView') { }
    this.lastBackPressed = Date.now();
    Actions.pop({ refresh: { test: UUID.v4() } });
    return true;
  }
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux backAndroidHandler={this._console.bind(this)} scenes={scenes} />
      </Provider>
    )
  }

}



