import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Axios from 'axios';
import * as actions from '../actions';
import EncryptForm from './EncryptForm';
import Passcode from './Passcode';
import { Alert, notification } from 'antd';

class LandingTemplate extends Component {

  resendActivation = () => {
    Axios.get('/auth/local/send-activation').then(res => {
      if (res.data.errors) {
        this.openFailureNotificationWithIcon('error', 'activation', res.data.errors.email);
      }
      else {
        this.openNotificationWithIcon('success', 'activation');
      }
    });
  }

  openNotificationWithIcon = (type, action) => {
    switch (action) {
      case 'activation':
        notification[type]({
          message: 'Activation email sent.',
          description: 'Please check your inbox, allow a few minutes.',
          placement: 'bottomLeft'
        });
        break;
      default:
        break;
    }
  };


  openFailureNotificationWithIcon = (type, action, description) => {
    switch (action) {
      case 'activation':
        notification[type]({
          message: 'Activation request failed',
          description: description,
          placement: 'bottomLeft'
        });
        break;
      default:
        break;
    }
  };

  render() {
    const { auth, encryptForm } = this.props;
    const landing = <Fragment><h1>Be safe.</h1><h2>Encrypt your credentials before sharing them online.</h2></Fragment>;
    const activationDescription = <div className="activation"><p className="activation-description">Currently your account is not verified, please check your email including your spam. Unverified accounts are automatically
    deleted after 1 week.</p><button onClick={this.resendActivation}>Re-send activation</button></div>;

    var activationMessage = null;
    if(auth && !auth.activated) {
      activationMessage = <Alert
        message="Activation notice."
        description={activationDescription}
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