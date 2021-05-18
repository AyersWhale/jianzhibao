import { Platform } from 'react-native';
import { SafeArea } from 'c2-mobile';
var Config = {
  C2Project: true,
  C2NavigationBarTintColor: 'rgb(26,26,26)',
  C2NavigationBarItemColor: '#ffffff',
  isWebPop: true,
  gesturePassword: '',
  topHeight: (Platform.OS == 'ios') ? 60 + SafeArea.top : 80,
  MainFontSize: (Platform.OS == 'ios') ? 16 : 13, //统一字体大小
  C2NavigationBarDefaultBackTitle: '              ',

  mainUrl: 'http://172.16.81.168:8088/flexible',
  appApiUrl: 'http://172.16.81.168:8088/flexible',//曹卓

  // mainUrl: 'http://172.16.81.200:8080/flexible',
  // appApiUrl: 'http://172.16.81.200:8080/flexible',//段芳

  // mainUrl: 'http://192.168.99.7:8080/flexible',
  // appApiUrl: 'http://192.168.99.7:8080/flexible',//段芳郑州

  // mainUrl: 'http://172.16.81.33:8080/flexible',
  // appApiUrl: 'http://172.16.81.33:8080/flexible',//陈威

  // mainUrl: 'http://172.16.81.152:8083/flexible',
  // appApiUrl: 'http://172.16.81.152:8083/flexible',//张磊

  // mainUrl: 'http://172.16.81.199:8083/flexible',
  // appApiUrl: 'http://172.16.81.199:8083/flexible',//刘陶均

  // mainUrl: 'http://www.xsypt.com.cn/flexible',
  // appApiUrl: 'http://www.xsypt.com.cn/flexible',//正式服务器

  // mainUrl: 'http://www.xsypt.com.cn/flexible_test',
  // appApiUrl: 'http://www.xsypt.com.cn/flexible_test',//测试服务器

  // mainUrl: 'http://www.xsypt.com.cn/flexible_test_new',
  // appApiUrl: 'http://www.xsypt.com.cn/flexible_test_new',//测试服务器 现用 

}

export default Config;