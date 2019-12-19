import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import EncryptForm from './EncryptForm';
import Passcode from './Passcode';
import { Alert } from 'antd';

class LandingTemplate extends Component {

  render() {
    const { auth, encryptForm } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;

    var activationMessage = null;
    if(auth && !auth.activated) {
      // TODO: Provide resend email option
      activationMessage = <Alert
        message="Activation notice."
        description="Currently your account is not verified, please check your email. Unverified accounts are automatically
        deleted after 1 week."
        type="info"
        showIcon
      />;
    }

    return (
      <Fragment>
        { activationMessage }
        { encryptForm ? 
          <Passcode passcode={encryptForm.passcode } /> : <div className="landing">{landing} <EncryptForm /></div> 
        }
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, encryptForm } = state;
  return { auth: auth, encryptForm: encryptForm };
}

export default connect(mapStateToProps, actions)(LandingTemplate);