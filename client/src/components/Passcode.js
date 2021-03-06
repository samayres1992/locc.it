import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, notification } from 'antd';
import * as actions from '../actions';
import Clipboard from 'react-clipboard.js';
import Moment from 'moment';

class Passcode extends Component {

  openNotificationWithIcon = (type, action) => {
    switch (action) {
      case 'clipboard':
          notification[type]({
            message: 'Copied to clipboard successful.',
            description: 'Your details have been copied to your clipboard.',
            placement: 'bottomLeft'
          });
        break;
      default:
        break;
    }
  };

  resetEncrypt = () => {
    this.props.createAnother();
  }

  render() {
    const { url, expiry, passcode } = this.props.encryptForm;
    const fullUrl = process.env.REACT_APP_SITE_URL + 'd/' + url;

    return (
      <div className="passcode">
        <div className="check">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke="#fff" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <polyline className="path check" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
          </svg>
          <span className="success">Share your encrypted credentials with details below.</span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo url">
            <span className="data-to-copy">{ fullUrl }</span>
            <Clipboard className="button copy" data-clipboard-text={fullUrl} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard')}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>
        </div>
        <div className="input-effect">
          <span className="fancy-input passcodeInfo passcode">
            <span className="data-to-copy">{passcode}</span>
            <Clipboard className="button copy" data-clipboard-text={passcode} onSuccess={() => this.openNotificationWithIcon('success', 'clipboard')}><Icon type="copy" /><span className="copy-to-clipboard">Copy</span></Clipboard>
          </span>    
        </div>
        <div className="expiry-info">
          <span className="expiry-details">Credentials will expire on {Moment(expiry).format("MMMM Do, YYYY" )}.</span>
        </div>
        <button onClick={ this.resetEncrypt} className="button fancy-button create-another">
          Create another
          <span className="focus-border">
            <i></i>
          </span>
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { passcode, encryptForm } = state;
  return { passcode: passcode, encryptForm: encryptForm };
}

export default connect(mapStateToProps, actions)(Passcode);