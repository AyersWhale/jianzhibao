'use strict'
import React, { Component } from 'react';
import { Config } from 'c2-mobile';
import { connect } from 'react-redux';

import {
  C2ABClient,
  C2ABOrganizationActions,
  C2ABContactsIndex
} from 'qysyb-mobile-contacts';

class ContactsFragment extends Component {

  render() {
    //通讯录
    C2ABClient.initService({
      apiHost: Config.mainUrl,
    });
    this.props.dispatch(C2ABOrganizationActions.initOrganization());

    return (
      <C2ABContactsIndex title={'通讯录'} />
    )
  }
}

// ------------ redux -------------
const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(ContactsFragment);