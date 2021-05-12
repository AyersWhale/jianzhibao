'use strict'

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  TouchableOpacity, Dimensions,
  Clipboard, Linking, ScrollView, ImageBackground, BackHandler
} from 'react-native';
import Global from '../../utils/GlobalStorage';
import stylesheet from '../../utils/style';
import { Version, Config, Toast, Actions, VectorIcon, Fetch, SafeArea, UserInfo } from 'c2-mobile';
import CommonDialog from '../../assembly/CommonDialog/CommonDialog';
import DefineCon from '../../components/DefineCon';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export default class About extends Component {

  constructor(props) {
    super(props);
    this.state = {
      version: '1.0',
      showQy: false,
      Qybelong: ''
    }
    // this.onVersion = this.onVersion.bind(this);

    // this.checkIdenty();
  }
  componentDidMount() {
    this.onVersion()
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Actions.pop()
      return true;
    });
  }
  componentWillMount() {
    if (UserInfo.loginSet.result.rdata.loginUserInfo.remark2 == "0") {
      this.setState({
        showQy: true
      })
    }
    var entity = {
      userId: UserInfo.loginSet.result.rdata.loginUserInfo.userId
    }
    Fetch.postJson(Config.mainUrl + '/ws/getServiceNameByCompanyUserId', entity)
      .then((res) => {
        this.setState({
          Qybelong: res.result
        })
        console.log(res)
      })
  }
  componentWillUnmount() {

    this.backHandler.remove();
    this.setState = (state, callback) => {
      return;
    };

  }
  // checkIdenty() {
  //   Global.getValueForKey('loginInformation').then((ret) => {
  //     var entity = {
  //       userName: ret.userName,
  //       userPassword: ret.passWord,
  //     }
  //     Fetch.postJson(Config.mainUrl + '/accountRegist/checkIdentity', entity)
  //       .then((res) => {
  //         if (res == '0') {//0表示企业
  //           this.setState({
  //             showQy: true
  //           })
  //         } else {
  //           this.setState({
  //             showQy: false
  //           })
  //         }
  //       }).catch((e) => {
  //       })
  //   })
  // }
  onVersion() {
    Version.getSystemInfo().then((response) => {
      debugger
      this.setState({
        version: response.version
      })
    })
  }

  // fuzhi(phoneNum) {
  //   Clipboard.setString(phoneNum);
  //   Toast.showInfo('复制成功', 1000)
  // }

  // onCall(phoneNum) {
  //   let url;
  //   if (Platform.OS !== 'android') {
  //     url = 'telprompt:' + phoneNum;
  //   } else {
  //     url = 'tel:' + phoneNum;
  //   }
  //   Linking.openURL(url);
  // }
  render() {
    // if (Platform.OS === 'ios') {
    //   return (
    //     <View style={stylesheet.containerRouter}>
    //       <View style={styles.icon}>
    //         <Image style={styles.iconImage} source={require('../../image/logo.png')} />
    //         <Text style={styles.iconText}>工薪易</Text>
    //         <Text style={styles.versionText}>版本 1.8</Text>{/*版本号获取*/}
    //       </View>

    //       <View style={styles.phone}>
    //         <Text style={styles.phoneText}> 软件使用过程中可能产生数据流量费用，由运营商收取。</Text>
    //         <Text style={styles.phoneText}>Copyright hunan-xinshui All Rights Reserved</Text>
    //       </View>
    //       <Text style={styles.endText}>@湖南薪税信息科技有限责任公司 版权所有</Text>
    //     </View>
    //   );
    // }

    // if (Platform.OS === 'android') {
    return (
      <ScrollView style={{ flex: 1 }} scrollIndicatorInsets={{ right: 1 }}>
        {/* <ImageBackground source={require('../../image/TopBg.png')} style={{ width: deviceWidth, height: 70 + SafeArea.top }}>
          <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: 38, position: 'absolute', width: 100, height: 50 }}>
            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
          </TouchableOpacity>
          <View style={{ marginTop: 40, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 1, fontWeight: 'bold' }}>关于</Text>
          </View>
        </ImageBackground> */}
        <View style={{ width: deviceWidth, height: Platform.OS == 'ios' ? (40 + SafeArea.top) : 70, backgroundColor: '#3E7EFE', alignSelf: 'center' }}>
          <TouchableOpacity onPress={() => Actions.pop()} style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 40, position: 'absolute', width: 100, height: 50 }}>
            <VectorIcon name={"arrow_back"} size={20} color={'white'} style={{ backgroundColor: 'transparent', marginLeft: 15 }} />
          </TouchableOpacity>
          <View style={{ marginTop: Platform.OS == 'ios' ? SafeArea.top : 35, alignSelf: 'center', alignContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', backgroundColor: 'transparent', fontSize: Config.MainFontSize + 7, fontWeight: 'bold' }}>关于</Text>
          </View>
        </View>
        <View style={styles.icon}>
          <Image style={styles.iconImage} source={require('../../image/logo.png')} />
          <Text style={styles.iconText}>工薪易</Text>
          <Text style={styles.versionText}>v {this.state.version}</Text>{/*版本号获取*/}
        </View>

        <View style={styles.phone}>
          <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => Actions.AboutInfo({ Totype: 'Xy' })}>
            <View style={styles.bodyView}>
              {/* <VectorIcon key={1} name={'android-lock'} style={styles.iconStart} /> */}
              <View style={{ width: 5 }} />
              <Text style={styles.bdText}>平台协议</Text>
              <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
            </View>
          </TouchableOpacity>
          {/* <View style={{ height: 20, backgroundColor: "#e5e5e5", flex: 1 }} /> */}

          <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => Actions.AboutInfo({ Totype: 'Kf' })}>
            <View style={styles.bodyView}>
              {/* <VectorIcon key={1} name={'android-lock'} style={styles.iconStart} /> */}
              <View style={{ width: 5 }} />
              <Text style={styles.bdText}>联系客服</Text>
              <VectorIcon key={2} name={'chevron-right'} style={styles.iconEnd} />
            </View>
          </TouchableOpacity>

          {this.state.showQy ? <View style={{ backgroundColor: 'white', marginTop: 10 }}>
            <View style={styles.bodyView}>
              {/* <VectorIcon key={1} name={'android-lock'} style={styles.iconStart} /> */}
              <View style={{ width: 5 }} />
              <Text style={styles.bdText}>所属服务商</Text>
              <Text style={styles.iconEnd}>{this.state.Qybelong}</Text>
            </View>
          </View> : null}
          {/* <View style={{ height: 20, backgroundColor: "#e5e5e5", flex: 1 }} /> */}


          {/* <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 30 }} onPress={() => this.fuzhi("2791849873")} >
            <View style={styles.bodyView}>
              <VectorIcon key={1} name={'chatbubble'} style={styles.iconStart} />
              <View style={{ width: 5 }} />
              <Text style={styles.bdText}>客服QQ号(点击复制)</Text>
              <Text style={{ position: 'absolute', right: 10, color: 'rgb(22,131,251)' }}>3502368947</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => this.fuzhi("17343633261")}>
            <View style={styles.bodyView}>
              <VectorIcon key={1} name={'chatbubble-working'} style={styles.iconStart} />
              <View style={{ width: 5 }} />
              <Text style={styles.bdText}>客服微信号(点击复制)</Text>
              <Text style={{ position: 'absolute', right: 10, color: 'rgb(22,131,251)' }}>15307492415</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'white', marginTop: 10 }} onPress={() => this.onCall("0731-89923163")}>
            <View style={styles.bodyView}>
              <VectorIcon key={1} name={'ios-telephone'} style={styles.iconStart} />
              <View style={{ width: 5 }} />
              <Text style={styles.bdText}>联系电话</Text>
              <Text style={{ position: 'absolute', right: 10, color: 'rgb(22,131,251)' }}>0731-89923931</Text>
            </View>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement1.html', title: '“工薪易”平台发送内容规范' })} style={{ marginTop: 20, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台发送内容规范》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement2.html', title: '法律声明' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《法律声明》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement3.html', title: '“工薪易”平台注册协议' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台注册协议》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement4.html', title: '“工薪易”平台隐私协议' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台隐私协议》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement5.html', title: '“工薪易”平台须知' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台须知》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement6.html', title: '“工薪易”平台安全声明' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台安全声明》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement7.html', title: '“工薪易”平台发票开具规则' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台发票开具规则》</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement8.html', title: '“工薪易”平台服务发布规范' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台服务发布规范》</Text>
          </TouchableOpacity>
          {(this.state.showQy) ? <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement9.html', title: '“工薪易”平台发活（发包）须知' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台发活（发包）须知》</Text>
          </TouchableOpacity> : <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement10.html', title: '“工薪易”平台接包须知' })} style={{ marginTop: 10, marginLeft: 10, padding: 3 }}>
              <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台接包须知》</Text>
            </TouchableOpacity>}
          <TouchableOpacity onPress={() => Actions.C2WebView({ url: Config.mainUrl + '/view/agreement11.html', title: '“工薪易”平台共享经济（自由职业者服务）协议' })} style={{ marginTop: 10, marginLeft: 10, padding: 3, marginBottom: 20 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>《“工薪易”平台共享经济（自由职业者服务）协议》</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity onPress={() => this.onCall("0713-89923163")} style={{ marginTop: 10, padding: 3, textAlign: 'left', marginLeft: 20 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>联系电话：0713-89923163</Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => this.fuzhi("2791849873")} style={{ marginTop: 10, padding: 3, textAlign: 'left', marginLeft: 20 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>客服QQ号(点击复制)：2791849873</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.fuzhi("17343633261")} style={{ marginBottom: 10, marginTop: 10, padding: 3, textAlign: 'left', marginLeft: 20 }}>
            <Text style={{ color: 'rgb(22,131,251)', fontSize: Config.MainFontSize - 1 }}>客服微信号(点击复制)：17343633261</Text>
          </TouchableOpacity> */}
          {/* <Text style={styles.phoneText}>湘公网安备 43012102000634号</Text>
          <Text style={styles.phoneText}> {'Copyright ©2019 All Rights Reserved \n 工薪易 湘ICP备19006584号 | 湖南薪税信息科技有限责任公司 '}</Text>
          <Text style={styles.phoneText}>{'湖南省长沙县东六路华润置地广场12栋703号'} </Text> */}
        </View>
        {/* <TouchableOpacity onPress={() => {
            Fetch.postJson(Config.mainUrl + '/appVersion/getAppVersion', {})
              .then((json) => {
                if (Platform.OS === 'android') {
                  var androidCode = json.result.rdata.appVersion.android.code;
                  var androidversion = json.result.rdata.appVersion.android.version;
                  var uris = Config.mainUrl + json.result.rdata.appVersion.android.url;
                  Version.getSystemInfo()
                    .then((response) => {
                      if (response.build < androidCode) {
                        Alert.alert('温馨提示', '当前版本 : ' + response.version + '\n最新版本为 : ' + androidversion, [{
                          text: '取消'
                        },
                        {
                          text: '更新', onPress: () => {
                            this.setState({
                              uri: uris
                            })
                            this.funAlert()
                          }
                        }])
                      } else if (response.build >= androidCode) {
                        Alert.alert('温馨提示', '当前版本 : ' + response.version + ',已经是最新版本', "", [{ text: '确认' },]);
                      } else if (response.build == androidCode) {
                        Alert.alert('温馨提示', '当前版本 : ' + response.version + ',已经是最新版本', "", [{ text: '确认' },]);
                      }
                    })
                }
              })
              .catch((e) => {
                Error.ErrorJump(error)
                console.log('onPushing:');
              });
          }}>
            <Text style={styles.endTextUp}>检查更新</Text>
          </TouchableOpacity> */}
        {/* <Text style={styles.endText}>@湖南科创有限公司 版权所有</Text> */}
        {/* <CommonDialog types={'alert'} components={<DefineCon hides={this.hides.bind(this)} uri={this.state.uri} />} ref="dAlert" /> */}
      </ScrollView >
    );
    // }
  }

  funAlert() {
    var options = {
      thide: true,
      innersWidth: 300,
      innersHeight: 150,
      messText: '更新中',
      buttons: [
        {
          txt: '后台下载',
          btnStyle: { backgroundColor: Config.C2NavigationBarTintColor },
          onpress: this.hides.bind(this)
        }
      ]
    }
    this.refs.dAlert.show(options)
  }

  hides() {
    this.refs.dAlert.hide();
  }
}
var styles = StyleSheet.create({
  containerRouter: {
    backgroundColor: 'white',
  },
  icon: {
    // flex: 4,
    alignItems: 'center',
  },
  version: {
    flex: 3,
    alignItems: 'center',
  },
  bodyView: {
    paddingHorizontal: 20,
    marginBottom: 1,
    flexDirection: 'row',
    backgroundColor: "#fff",
    height: 63,
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  iconStart: {
    fontSize: 18,
    marginRight: 10,
  },
  iconEnd: {
    color: 'grey',
    fontSize: 14,
    position: 'absolute',
    right: 20,
  },
  iconImage: {
    marginTop: 30,
    width: 80,
    height: 80,
  },
  iconText: {
    marginTop: 10,
    fontSize: 20,
    color: '#333',
  },
  versionText: {
    width: 100,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    fontSize: 18,
    color: '#333333',
  },
  bdText: {
    color: "#333",
    fontSize: Config.MainFontSize + 3,
    fontWeight: '500'
  },
  phone: {
    marginTop: 10,
  },
  phoneText: {
    textAlign: 'center',
    //margin: 10,
    marginTop: 5,
    color: '#999',
    fontSize: Config.MainFontSize,
  },

  endText: {
    fontSize: 12,
    color: '#000',
    alignSelf: 'center',
    marginBottom: 20,
  },
  endTextUp: {
    fontSize: 16,
    color: 'rgb(22,131,251)',
    alignSelf: 'center',
    marginBottom: 20,
  }
});

