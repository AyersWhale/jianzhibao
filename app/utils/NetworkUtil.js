import React, { Component, PropTypes } from 'react';

export default class NetworkUtil extends Component {
  constructor(props) {
    super(props);

  }

  static networkAlert(props, number) {

    switch (number) {
      case 0:
     // Toasts.show('获取数据失败，请联系管理员！', { position: px2dp(-80) });
        break;
      case 2:

        break;
      case 10:
      //   props.resetTo({ name: "Login", component: Login });
        break;
      default:
    }
   

  }

}

module.exports = NetworkUtil;